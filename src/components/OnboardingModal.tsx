import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  MousePointerClick,
  Palette,
  Eye,
  Download,
  Layers,
  CheckCircle2,
  Lock,
  RotateCw,
  Printer,
  Sliders,
  Compass,
} from 'lucide-react';
import { LucideSwirlLogo } from './PosterCanvas';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  preview: React.ReactNode;
  bullets: string[];
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      badge: 'Step 1 of 5 • Workspace',
      title: 'Welcome to Lucide Poster Studio',
      subtitle: 'Artisanal Grid Composition & Vector Poster Engine',
      description:
        'Lucide Poster Studio empowers you to design museum-grade iconography posters, technical cheat sheets, and wall prints powered by 1,779+ official vector icons.',
      icon: <LucideSwirlLogo size={28} color="#1A1815" accentColor="#DE5D53" />,
      accentColor: '#DE5D53',
      bullets: [
        'Complete 1,779 Lucide Icons library with 0ms lag',
        'Swiss typography hierarchy & archival aspect ratios',
        'Real-time interactive canvas with instant undo/redo',
      ],
      preview: (
        <div className="w-full h-full bg-[#FAF8F5] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-xl border border-black/10">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-black/10 flex items-center justify-center mb-4">
            <LucideSwirlLogo size={32} color="#1A1815" accentColor="#DE5D53" />
          </div>
          <span className="text-xl font-bold font-sans tracking-tight text-[#1A1815]">
            Lucide Poster Studio
          </span>
          <span className="text-[11px] font-mono text-[#78716C] uppercase tracking-widest mt-1">
            Archival Edition // 2026
          </span>
          <div className="flex gap-2 mt-4">
            <span className="px-2.5 py-1 rounded-md bg-white border border-black/10 text-[10px] font-mono font-bold text-[#1A1815]">
              1,779 GLYPHS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-black/10 text-[10px] font-mono font-bold text-[#DE5D53]">
              NAMED LAYERS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-black/10 text-[10px] font-mono font-bold text-[#10B981]">
              PDF &amp; 4K
            </span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 2 of 5 • Layout & Grids',
      title: 'Architect Your Grid & Styles',
      subtitle: 'Sidebar Controls, Ratios & Textures',
      description:
        'Use the left sidebar to customize your grid dimensions from 2×2 up to 24×24, choose paper ratios (A2, A3, A4, 16:9, Square), and apply tactile paper textures.',
      icon: <LayoutGrid size={24} className="text-[#0284C7]" />,
      accentColor: '#0284C7',
      bullets: [
        'Presets: Swiss Minimal, Bauhaus, Cyberpunk & Sand',
        'Tactile textures: Grain, Blueprint, Dot Grid & Isometry',
        'Custom margins, cell gaps, scale, and header branding',
      ],
      preview: (
        <div className="w-full h-full bg-[#FAF8F5] p-5 flex flex-col justify-center rounded-xl border border-black/10">
          <div className="grid grid-cols-4 gap-2.5 p-4 bg-white rounded-lg border border-black/10 shadow-xs">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded border border-black/10 bg-[#FAF8F5] flex items-center justify-center text-[#1A1815]"
              >
                <Sparkles size={16} strokeWidth={2} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] mt-3 px-1">
            <span>RATIO: A3 (3:4)</span>
            <span>GRID: 4 × 2</span>
            <span>TEXTURE: GRAIN</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 3 of 5 • Precision Editing',
      title: 'Single-Cell Quick Inspector',
      subtitle: 'Click any icon on the canvas to inspect',
      description:
        'Fine-tune individual cells. Click any icon to search & replace from all 1,779 icons, rotate 90°, assign custom tint accents, or lock specific icons.',
      icon: <MousePointerClick size={24} className="text-[#DE5D53]" />,
      accentColor: '#DE5D53',
      bullets: [
        'Click any cell to open the Quick Inspector modal',
        'Lock favorite icons so global shuffle ignores them',
        'Rotate and apply individual focal color accents',
      ],
      preview: (
        <div className="w-full h-full bg-[#FAF8F5] p-5 flex flex-col justify-center rounded-xl border border-black/10 relative">
          <div className="bg-white p-4 rounded-xl border border-black/15 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-black/10 flex items-center justify-center text-[#DE5D53]">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1A1815]">Sparkles</div>
                <div className="text-[10px] text-[#78716C] font-mono">Cell #04 • Locked</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="p-1.5 rounded bg-black/5 text-[#1A1815]">
                <RotateCw size={14} />
              </span>
              <span className="p-1.5 rounded bg-[#DE5D53]/10 text-[#DE5D53]">
                <Lock size={14} />
              </span>
            </div>
          </div>
          <div className="text-center text-[11px] text-[#78716C] mt-3 flex items-center justify-center gap-1.5">
            <MousePointerClick size={13} className="text-[#DE5D53]" />
            <span>Click any cell anytime to modify</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 4 of 5 • 3D Visualization',
      title: '3D Spatial Gallery Mockups',
      subtitle: 'Preview your poster in real-world interiors',
      description:
        'Experience how your poster looks mounted in high-end spaces. Choose from Natural Oak, Matte Black Aluminum, Brushed Gold, or Frameless Glass frames with lighting.',
      icon: <Eye size={24} className="text-[#F59E0B]" />,
      accentColor: '#F59E0B',
      bullets: [
        '4 curated room environments (Concrete Loft, Studio, Gallery)',
        'Customizable mat thickness (passe-partout)',
        'Real-time directional gallery spotlight shadows',
      ],
      preview: (
        <div className="w-full h-full bg-[#EBE7DF] p-4 flex items-center justify-center rounded-xl border border-black/10 relative overflow-hidden">
          {/* Mockup Frame */}
          <div className="w-36 h-48 bg-[#FAF8F5] border-[6px] border-[#8B5A2B] shadow-2xl rounded-xs p-2 flex flex-col justify-between">
            <div className="text-[6px] font-bold text-center tracking-widest text-[#1A1815]">
              LUCIDE SYSTEM
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-black/5 rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1815]" />
                </div>
              ))}
            </div>
            <div className="text-[5px] text-center text-[#78716C]">NATURAL OAK FRAME</div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 5 of 5 • Production Export',
      title: 'Professional Print & Vector Export',
      subtitle: 'Named SVG Layers, 300 DPI PDF & 8K PNG',
      description:
        'Export production-ready assets. SVGs maintain clean layer names for Figma and Illustrator. PDFs include CMYK color simulation and bleed/crop registration marks.',
      icon: <Download size={24} className="text-[#10B981]" />,
      accentColor: '#10B981',
      bullets: [
        'Vector SVG with exact icon layer names (inkscape:label / data-name)',
        'Print-Ready PDF with bleed & trim marks (300 DPI)',
        'Ultra PNG exports up to 4× / 8K resolution',
      ],
      preview: (
        <div className="w-full h-full bg-[#FAF8F5] p-5 flex flex-col justify-center gap-2 rounded-xl border border-black/10">
          <div className="p-2.5 rounded-lg bg-white border border-black/10 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1815]">
              <Layers size={14} className="text-[#10B981]" />
              <span>Vector SVG</span>
            </div>
            <span className="text-[10px] font-mono text-[#78716C]">Figma &amp; Illustrator</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-black/10 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1815]">
              <Printer size={14} className="text-[#DE5D53]" />
              <span>Print PDF</span>
            </div>
            <span className="text-[10px] font-mono text-[#78716C]">300 DPI CMYK Bleed</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-black/10 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1815]">
              <Download size={14} className="text-[#0284C7]" />
              <span>Ultra PNG</span>
            </div>
            <span className="text-[10px] font-mono text-[#78716C]">4× 300DPI</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCFB] text-[#1A1A1A] border border-black/15 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative select-none animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-black/10 flex items-center justify-center p-1.5 shadow-xs">
              <LucideSwirlLogo size={20} color="#1A1815" accentColor="#DE5D53" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#1A1815]">
                Lucide Poster Studio
              </span>
              <span className="text-[10px] text-[#78716C] font-mono block">
                Interactive Guide &amp; Tour
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 text-[#78716C] hover:text-[#1A1815] transition-colors"
            title="Close guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          {/* Left: Interactive Step Visual Preview */}
          <div className="w-full md:w-5/12 h-52 sm:h-60 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
            {current.preview}
          </div>

          {/* Right: Step Details */}
          <div className="w-full md:w-7/12 flex flex-col justify-between">
            <div>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-2.5 inline-block"
                style={{
                  color: current.accentColor,
                  borderColor: `${current.accentColor}40`,
                  backgroundColor: `${current.accentColor}10`,
                }}
              >
                {current.badge}
              </span>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1A1A1A] mb-1">
                {current.title}
              </h2>

              <p className="text-xs font-semibold text-[#78716C] mb-3">
                {current.subtitle}
              </p>

              <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                {current.description}
              </p>

              <ul className="space-y-1.5 mb-6">
                {current.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#1A1815] font-medium">
                    <CheckCircle2 size={13} style={{ color: current.accentColor }} className="flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-black/10 bg-[#FAF8F5] flex items-center justify-between">
          {/* Step Indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-6 bg-[#1A1815]'
                    : 'w-2 bg-black/20 hover:bg-black/40'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2.5">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3.5 py-2 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-[#1A1815] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 rounded-lg bg-[#1A1815] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#DE5D53] hover:bg-[#C94E44] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#DE5D53]/25 transition-all"
              >
                <span>Start Designing</span>
                <Sparkles size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
