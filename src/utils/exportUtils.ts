import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import LZString from 'lz-string';
import type { IconGridItem, PosterConfig, PrintSettings } from '../types';

export interface ExportOptions {
  filename?: string;
  scale?: number; // 1, 2, 4
}

// Trigger celebratory confetti
export function triggerCelebration() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E11D48', '#38BDF8', '#10B981', '#F59E0B', '#8B5CF6'],
    });
  } catch {
    // Ignore if confetti fails
  }
}

// Convert SVG Element to standalone SVG string with styles
export function getSvgString(svgElement: SVGSVGElement): string {
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Ensure standard SVG namespaces
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  
  // Embed external fonts reference inside SVG defs
  const defs = clonedSvg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700;800&family=Playfair+Display:wght@600;700;900&family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap');
    text { font-smooth: always; -webkit-font-smoothing: antialiased; }
  `;
  defs.appendChild(styleEl);
  if (!clonedSvg.querySelector('defs')) {
    clonedSvg.insertBefore(defs, clonedSvg.firstChild);
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(clonedSvg);
}

// Download SVG file
export function exportAsSVG(svgElement: SVGSVGElement, filename = 'lucide-poster.svg') {
  const svgString = getSvgString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  triggerCelebration();
}

// Render SVG to High-Resolution Canvas
export async function renderSvgToCanvas(
  svgElement: SVGSVGElement,
  scale = 2
): Promise<HTMLCanvasElement> {
  const viewBox = svgElement.viewBox.baseVal;
  const width = (viewBox && viewBox.width > 0) ? viewBox.width : svgElement.clientWidth || 1200;
  const height = (viewBox && viewBox.height > 0) ? viewBox.height : svgElement.clientHeight || 1600;

  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const svgString = getSvgString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not get 2d context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

// Download PNG file
export async function exportAsPNG(
  svgElement: SVGSVGElement,
  scale = 2,
  filename = 'lucide-poster.png'
) {
  const canvas = await renderSvgToCanvas(svgElement, scale);
  
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerCelebration();
  }, 'image/png');
}

// Standard Quick PDF file
export async function exportAsPDF(
  svgElement: SVGSVGElement,
  filename = 'lucide-poster.pdf'
) {
  return exportAsPrintPDF(
    svgElement,
    {
      format: 'A4',
      bleedMm: 0,
      showCropMarks: false,
      dpi: 300,
    },
    filename
  );
}

// Format dimension map in mm
const FORMAT_SIZES_MM: Record<string, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
  A2: [420, 594],
  A1: [594, 841],
  '50x70': [500, 700],
  '70x100': [700, 1000],
  ArchD: [610, 914], // 24x36 inches in mm
};

// High Definition Professional Print PDF with Crop Marks and Bleed
export async function exportAsPrintPDF(
  svgElement: SVGSVGElement,
  settings: PrintSettings,
  filename = 'lucide-poster-print.pdf'
) {
  const [basePageW, basePageH] = FORMAT_SIZES_MM[settings.format] || [210, 297];

  const viewBox = svgElement.viewBox.baseVal;
  const svgW = viewBox.width || 1200;
  const svgH = viewBox.height || 1600;

  const isLandscape = svgW > svgH;
  const targetW = isLandscape ? Math.max(basePageW, basePageH) : Math.min(basePageW, basePageH);
  const targetH = isLandscape ? Math.min(basePageW, basePageH) : Math.max(basePageW, basePageH);

  // If crop marks are enabled, we add canvas margins to draw trim marks
  const marginMm = settings.showCropMarks ? 12 : 0;
  const bleedMm = settings.bleedMm || 0;

  const totalPageW = targetW + marginMm * 2;
  const totalPageH = targetH + marginMm * 2;

  // Render high-res image (scale 3.5 for 300dpi crisp rendering)
  const canvas = await renderSvgToCanvas(svgElement, 3.5);
  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [totalPageW, totalPageH],
  });

  // Calculate poster image position (accounting for bleed)
  const posterX = marginMm - bleedMm;
  const posterY = marginMm - bleedMm;
  const posterW = targetW + bleedMm * 2;
  const posterH = targetH + bleedMm * 2;

  pdf.addImage(imgData, 'JPEG', posterX, posterY, posterW, posterH);

  // Draw professional crop marks and registration if enabled
  if (settings.showCropMarks) {
    pdf.setDrawColor(30, 30, 30);
    pdf.setLineWidth(0.25);

    const markLen = 6;
    const offset = 2; // distance from trim line

    // Top-Left Marks
    pdf.line(marginMm, marginMm - offset - markLen, marginMm, marginMm - offset); // V
    pdf.line(marginMm - offset - markLen, marginMm, marginMm - offset, marginMm); // H

    // Top-Right Marks
    const trX = marginMm + targetW;
    pdf.line(trX, marginMm - offset - markLen, trX, marginMm - offset); // V
    pdf.line(trX + offset, marginMm, trX + offset + markLen, marginMm); // H

    // Bottom-Left Marks
    const blY = marginMm + targetH;
    pdf.line(marginMm, blY + offset, marginMm, blY + offset + markLen); // V
    pdf.line(marginMm - offset - markLen, blY, marginMm - offset, blY); // H

    // Bottom-Right Marks
    pdf.line(trX, blY + offset, trX, blY + offset + markLen); // V
    pdf.line(trX + offset, blY, trX + offset + markLen, blY); // H

    // Print metadata label outside crop area
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `LUCIDE POSTER STUDIO • ${settings.format} (${targetW}x${targetH}mm) • Bleed: ${bleedMm}mm • 300 DPI`,
      marginMm,
      marginMm - 6
    );
  }

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  triggerCelebration();
}

// Copy PNG Image to Clipboard
export async function copyImageToClipboard(svgElement: SVGSVGElement): Promise<boolean> {
  try {
    const canvas = await renderSvgToCanvas(svgElement, 2);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          triggerCelebration();
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}

// Copy SVG Markup to Clipboard
export async function copySvgCodeToClipboard(svgElement: SVGSVGElement): Promise<boolean> {
  try {
    const svgString = getSvgString(svgElement);
    await navigator.clipboard.writeText(svgString);
    triggerCelebration();
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// Compressed URL State Sharing (LZ-String)
// ==========================================

export interface ShareablePayload {
  c: PosterConfig;
  i?: Array<{
    id: string;
    name: string;
    rotation?: number;
    customColor?: string;
    isLocked?: boolean;
  }>;
}

export function encodeShareableURL(config: PosterConfig, icons: IconGridItem[]): string {
  try {
    // Only serialize customized/locked icons to keep URL payload compact
    const customIcons = icons.filter((i) => i.isLocked || i.rotation || i.customColor);
    const payload: ShareablePayload = {
      c: config,
      i: customIcons.length > 0 ? customIcons : undefined,
    };

    const json = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const url = new URL(window.location.href);
    url.searchParams.set('share', compressed);
    return url.toString();
  } catch (err) {
    console.error('Error generating shareable URL:', err);
    return window.location.href;
  }
}

export function decodeShareableURL(param: string): ShareablePayload | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(param);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);
    if (parsed && (parsed.c || parsed.columns)) {
      return {
        c: parsed.c || parsed,
        i: parsed.i,
      };
    }
    return null;
  } catch (err) {
    console.error('Error decoding shareable URL:', err);
    return null;
  }
}
