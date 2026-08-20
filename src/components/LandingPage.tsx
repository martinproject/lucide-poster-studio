import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  LayoutGrid,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { LucideSwirlLogo } from './PosterCanvas';
import type { PosterPreset } from '../types';

interface LandingPageProps {
  onEnterStudio: (preset?: PosterPreset) => void;
}

export function LandingPage({ onEnterStudio }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col justify-between relative overflow-x-hidden select-none">
      {/* 1. Subtle Archival Studio Ambient Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Subtle Warm Accent Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full opacity-35 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #DE5D53 0%, #F59E0B 35%, transparent 70%)',
        }}
      />

      {/* 2. Editorial Top Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-20 border-b border-black/10 bg-[#FDFCFB]/80 backdrop-blur-md">
        <div
          onClick={() => onEnterStudio()}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <LucideSwirlLogo size={28} color="#1A1815" accentColor="#DE5D53" strokeWidth={2.2} />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-sans tracking-tight text-[#1A1A1A] group-hover:text-[#DE5D53] transition-colors">
              Lucide
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 hidden sm:inline-block">
              Poster Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#78716C] hover:text-[#1A1A1A] transition-colors"
          >
            <span>1,779 Icons</span>
            <ExternalLink size={12} />
          </a>

          <a
            href="https://github.com/martinproject/lucide-poster-studio"
            target="_blank"
            rel="noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-lg border border-black/10 hover:border-black/25 bg-white hover:bg-black/5 text-[#1A1A1A] font-medium text-xs transition-colors flex items-center gap-1.5"
            title="View on GitHub"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <button
            onClick={() => onEnterStudio()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1A1815] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Launch Studio</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center z-10 my-auto">
        {/* Editorial Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-[#DE5D53]" />
          <span className="text-xs font-mono text-[#57534E] font-medium">
            1,779 Official Lucide Vector Glyphs
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1A1815] mb-6 leading-[1.08] max-w-4xl">
          Design Editorial{' '}
          <span className="text-[#DE5D53]">
            Icon Posters
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mb-8 font-normal">
          Create museum-grade art prints, developer cheat sheets, and high-resolution vector posters with Swiss typography, customizable grids, and print-ready export.
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => onEnterStudio()}
            className="px-8 py-4 rounded-xl bg-[#1A1815] hover:bg-black text-white font-extrabold text-base shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2.5"
          >
            <Sparkles size={18} className="text-[#DE5D53]" />
            <span>Open Studio</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Showcase Poster Card in Gallery Stage */}
        <div
          onClick={() => onEnterStudio()}
          className="relative rounded-2xl p-3 sm:p-4 bg-[#F0EFED] border border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] max-w-4xl w-full cursor-pointer group hover:border-black/25 transition-all duration-300 mb-12"
        >
          <div className="relative rounded-xl overflow-hidden bg-[#FAF8F5] border border-black/10 aspect-[16/9] flex items-center justify-center shadow-xs">
            <img
              src="/assets/banner.svg"
              alt="Lucide Poster Studio Preview"
              className="w-full h-full object-cover sm:object-contain transform group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#1A1815]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="px-5 py-2.5 rounded-lg bg-[#1A1815] text-white font-bold text-sm shadow-xl">
                Edit this Poster in Studio →
              </span>
            </div>
          </div>
        </div>

        {/* Feature Cards in Clean White */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <LayoutGrid size={18} className="text-[#DE5D53] mb-2.5" />
            <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Custom Grids</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">A2, A3, A4, 16:9 and square ratios from 2×2 to 24×24.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Layers size={18} className="text-[#10B981] mb-2.5" />
            <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Named Layers</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">Export clean SVGs ready for Figma and Illustrator.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Eye size={18} className="text-[#F59E0B] mb-2.5" />
            <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">3D Mockups</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">Real-world room previews with oak and aluminum frames.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Download size={18} className="text-[#0284C7] mb-2.5" />
            <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Print &amp; 8K</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">300 DPI CMYK PDF and ultra-sharp 4K/8K PNGs.</p>
          </div>
        </div>
      </main>

      {/* 4. Editorial Clean Footer */}
      <footer className="border-t border-black/10 py-6 px-6 z-20 bg-[#FDFCFB]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C] font-sans">
          <div className="flex items-center gap-2">
            <LucideSwirlLogo size={16} color="#1A1815" accentColor="#DE5D53" />
            <span className="font-bold text-[#1A1A1A]">Lucide Poster Studio</span>
            <span>•</span>
            <span>Icons by <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-[#1A1A1A] hover:underline font-medium">Lucide Contributors</a></span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={() => onEnterStudio()}
              className="text-[#1A1815] hover:text-[#DE5D53] transition-colors"
            >
              Studio
            </button>
            <a
              href="https://github.com/martinproject/lucide-poster-studio"
              target="_blank"
              rel="noreferrer"
              className="text-[#78716C] hover:text-[#1A1815] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
