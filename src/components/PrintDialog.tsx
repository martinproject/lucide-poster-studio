import React, { useState } from 'react';
import type { PrintSettings } from '../types';
import { Printer, X, Download, Check, Sparkles } from 'lucide-react';
import { exportAsPrintPDF } from '../utils/exportUtils';

interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  svgElement: SVGSVGElement | null;
}

export function PrintDialog({ isOpen, onClose, svgElement }: PrintDialogProps) {
  const [format, setFormat] = useState<PrintSettings['format']>('A3');
  const [bleedMm, setBleedMm] = useState<number>(3);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const formats: Array<{
    id: PrintSettings['format'];
    name: string;
    dim: string;
    description: string;
  }> = [
    { id: 'A4', name: 'DIN A4', dim: '210 × 297 mm', description: 'Standard Desktop Print' },
    { id: 'A3', name: 'DIN A3', dim: '297 × 420 mm', description: 'Medium Exhibition Poster' },
    { id: 'A2', name: 'DIN A2', dim: '420 × 594 mm', description: 'Large Art Gallery Poster' },
    { id: 'A1', name: 'DIN A1', dim: '594 × 841 mm', description: 'Grand Format Exhibition' },
    { id: '50x70', name: 'B2 / 50×70', dim: '500 × 700 mm', description: 'Standard Swedish Frame size' },
    { id: 'ArchD', name: 'Arch D (24×36")', dim: '610 × 914 mm', description: 'US Large Format Architectural' },
  ];

  const handleExport = async () => {
    if (!svgElement) return;
    setIsExporting(true);
    try {
      await exportAsPrintPDF(
        svgElement,
        {
          format,
          bleedMm,
          showCropMarks,
          dpi: 300,
        },
        `lucide-poster-${format}-print.pdf`
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-black/15 overflow-hidden flex flex-col font-sans">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between bg-[#FDFCFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Printer size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A]">Print-Ready PDF Production</h3>
              <p className="text-[11px] text-black/50">300 DPI high-definition CMYK export with trim & bleed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black hover:bg-black/5 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Format Selector Grid */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-2">
              Physical Paper Dimensions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between gap-1 transition-all ${
                    format === f.id
                      ? 'bg-black text-white border-black ring-1 ring-black'
                      : 'bg-white border-black/15 text-[#1A1A1A] hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{f.name}</span>
                    {format === f.id && <Check size={12} className="text-amber-400" />}
                  </div>
                  <span className={`text-[10px] font-mono ${format === f.id ? 'text-white/70' : 'text-black/50'}`}>
                    {f.dim}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bleed & Crop Marks Options */}
          <div className="p-3.5 bg-black/5 rounded-lg space-y-3">
            {/* Crop Marks Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-black block">Professional Crop / Trim Marks</span>
                <span className="text-[10px] text-black/50">Adds printer registration guides and cutting lines</span>
              </div>
              <input
                type="checkbox"
                checked={showCropMarks}
                onChange={(e) => setShowCropMarks(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-black"
              />
            </label>

            <div className="h-[1px] bg-black/10" />

            {/* Bleed Margin Selection */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-black block">Bleed Margin</span>
                <span className="text-[10px] text-black/50">Safety bleed for borderless edge trimming</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-black/15 rounded p-0.5">
                {[0, 3, 5].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBleedMm(b)}
                    className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-colors ${
                      bleedMm === b ? 'bg-black text-white font-bold' : 'text-black/70 hover:text-black'
                    }`}
                  >
                    {b}mm
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#FDFCFB] border-t border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-black/60">
            <Sparkles size={13} className="text-amber-500" />
            <span>Ready for professional offset & digital print</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-black/70 hover:text-black hover:bg-black/5 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-xs disabled:opacity-50"
            >
              <Download size={13} />
              <span>{isExporting ? 'Generating PDF...' : 'Download Print PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
