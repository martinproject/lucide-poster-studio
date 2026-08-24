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
import bannerSvg from '../../assets/banner.svg';
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

          className="flex items-center cursor-pointer group"
        >
          <LucideSwirlLogo size={36} color="#1A1815" accentColor="#DE5D53" strokeWidth={2.2} className="mr-2" />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-sans tracking-tight text-[#3c3c43] group-hover:text-[#DE5D53] transition-colors">
              Lucide
            </span>
            <span className="text-sm">|</span>
            <span className="text-xl font-bold font-sans tracking-tight opacity-40 hidden sm:inline-block">
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
            className="text-[#1A1A1A] hover:opacity-60 transition-opacity p-1.5 flex items-center justify-center"
            title="GitHub Repository"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
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
          className="relative rounded-2xl p-2 sm:p-3 bg-[#F0EFED] border border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] max-w-4xl w-full cursor-pointer group hover:border-black/25 transition-all duration-300 mb-12"
        >
          <div className="relative rounded-xl overflow-hidden border border-black/10 aspect-[1200/560] w-full flex items-center justify-center shadow-xs">
            <img
              src={bannerSvg}
              alt="Lucide Poster Studio Preview"
              className="w-full h-full object-cover block transform group-hover:scale-[1.01] transition-transform duration-500"
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
            <h2 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Custom Grids</h2>
            <p className="text-xs text-[#78716C] leading-relaxed">A2, A3, A4, 16:9 and square ratios from 2×2 to 24×24.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Layers size={18} className="text-[#10B981] mb-2.5" />
            <h2 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Named Layers</h2>
            <p className="text-xs text-[#78716C] leading-relaxed">Export clean SVGs ready for Figma and Illustrator.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Eye size={18} className="text-[#F59E0B] mb-2.5" />
            <h2 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">3D Mockups</h2>
            <p className="text-xs text-[#78716C] leading-relaxed">Real-world room previews with oak and aluminum frames.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-black/10 shadow-xs hover:border-black/25 transition-colors">
            <Download size={18} className="text-[#0284C7] mb-2.5" />
            <h2 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-1">Print &amp; 8K</h2>
            <p className="text-xs text-[#78716C] leading-relaxed">300 DPI CMYK PDF and ultra-sharp 4K/8K PNGs.</p>
          </div>
        </div>
      </main>

      {/* 4. Editorial Clean Footer */}
      <footer className="border-t border-black/10 py-8 px-6 z-20 bg-[#FDFCFB]">
        <div className="max-w-5xl mx-auto flex flex-col gap-4 text-xs text-[#78716C] font-sans">
          {/* Main Footer Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LucideSwirlLogo size={16} color="#1A1815" accentColor="#DE5D53" />
              <span className="font-bold text-[#1A1A1A]">Lucide Poster Studio</span>
            </div>

            <div className="flex items-center gap-5 font-medium">
              <button
                onClick={() => onEnterStudio()}
                className="text-[#1A1815] hover:text-[#DE5D53] transition-colors"
              >
                Studio
              </button>
              <a
                href="https://lucide.dev/license"
                target="_blank"
                rel="noreferrer"
                className="text-[#78716C] hover:text-[#1A1A1A] transition-colors"
              >
                Lucide License
              </a>
              <a
                href="https://github.com/martinproject/lucide-poster-studio"
                target="_blank"
                rel="noreferrer"
                className="text-[#78716C] hover:text-[#1A1A1A] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Copyright & Attribution Details */}
          <div className="pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A8A29E] font-mono text-center sm:text-left">
            <div>
              <span>ISC License • Copyright &copy; 2026 Lucide Icons and Contributors</span>
            </div>
            <div>
              <span>MIT License • Copyright &copy; 2013-present Cole Bemis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
