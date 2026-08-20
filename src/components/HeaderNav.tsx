import React, { useState, useRef, useEffect } from 'react';
import {
  Shuffle,
  Download,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileImage,
  FileCode,
  FileText,
  Check,
  ChevronDown,
  Undo2,
  Redo2,
  Sparkles,
  Share2,
  Printer,
} from 'lucide-react';
import { LucideSwirlLogo } from './PosterCanvas';

interface HeaderNavProps {
  onShuffle: () => void;
  onResetToPreset: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenMockup?: () => void;
  onShare?: () => void;
  onOpenPrintSettings?: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onExportPNG: (scale: number) => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onCopyImage: () => void;
  copySuccess: boolean;
  totalIcons: number;
  columns: number;
  rows: number;
  aspectRatio: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function HeaderNav({
  onShuffle,
  onResetToPreset,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenMockup,
  onShare,
  onOpenPrintSettings,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onCopyImage,
  copySuccess,
  totalIcons,
  columns,
  rows,
  aspectRatio,
  isSidebarCollapsed = false,
  onToggleSidebar,
}: HeaderNavProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 sm:h-16 border-b border-black/10 bg-[#FDFCFB] text-[#1A1A1A] px-3 sm:px-6 flex items-center justify-between flex-none z-40 transition-colors select-none">
      {/* Brand & Editorial Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <LucideSwirlLogo size={24} color="#1A1815" accentColor="#DE5D53" strokeWidth={2.2} />
          <span className="text-lg sm:text-xl font-bold font-sans tracking-tight text-[#1A1A1A]">
            Lucide
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 hidden md:inline-block">
            Poster Studio
          </span>
        </div>

        {/* Live specs badge */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-black/50 bg-black/5 px-2.5 py-1 rounded">
          <span>{columns}×{rows}</span>
          <span>•</span>
          <span>{aspectRatio}</span>
          <span>•</span>
          <span>{totalIcons} glyphs</span>
        </div>
      </div>

      {/* Center & Action Toolbar in Editorial Design */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 font-sans">
        {/* Undo / Redo Buttons */}
        <div className="flex items-center border border-black/15 rounded bg-white overflow-hidden">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 hover:bg-black/5 text-black/70 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z / Cmd+Z)"
          >
            <Undo2 size={13} />
          </button>
          <div className="w-[1px] h-3.5 bg-black/15" />
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 hover:bg-black/5 text-black/70 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Y / Cmd+Shift+Z)"
          >
            <Redo2 size={13} />
          </button>
        </div>

        {/* Reset Poster / Design Button */}
        <button
          type="button"
          onClick={onResetToPreset}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-black/15 hover:border-black hover:bg-black/5 text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider rounded transition-all"
          title="Reset to default poster layout and design"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Shuffle Button */}
        <button
          type="button"
          onClick={onShuffle}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-dashed border-black/30 hover:border-black hover:bg-black/5 text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider rounded transition-all"
          title="Randomize icon arrangement"
        >
          <Shuffle size={13} />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        {/* Share Composition URL Button */}
        <button
          type="button"
          onClick={onShare}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 border border-black/15 hover:border-black/40 text-black/75 hover:text-black text-xs uppercase tracking-wider font-semibold rounded transition-colors"
          title="Generate and copy compressed share link"
        >
          <Share2 size={13} />
          <span>Share</span>
        </button>

        {/* Copy Image Button */}
        <button
          type="button"
          onClick={onCopyImage}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-black/20 hover:bg-black hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold rounded"
          title="Copy PNG image to clipboard"
        >
          {copySuccess ? (
            <>
              <Check size={13} className="text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Main Export Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A1A] hover:bg-black text-[#FDFCFB] text-xs uppercase tracking-widest font-semibold rounded transition-all shadow-xs"
          >
            <Download size={13} />
            <span>Export</span>
            <ChevronDown size={12} className="opacity-60" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-black/15 shadow-[0_15px_35px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-100 rounded font-sans">
              <div className="px-3 py-1.5 border-b border-black/5 text-[9px] uppercase font-bold tracking-widest text-black/40">
                Print & Vector Formats
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onExportPNG(2);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-black/5 rounded transition-colors text-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2.5">
                    <FileImage size={14} className="opacity-70" />
                    <span className="font-semibold">PNG Image</span>
                  </div>
                  <span className="text-[10px] font-mono text-black/40">2× Retina</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportPNG(4);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-black/5 rounded transition-colors text-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2.5">
                    <FileImage size={14} className="opacity-70" />
                    <span className="font-semibold">Ultra PNG</span>
                  </div>
                  <span className="text-[10px] font-mono text-white bg-black px-1.5 py-0.5 rounded text-[9px]">4× 300DPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportSVG();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-black/5 rounded transition-colors text-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode size={14} className="opacity-70" />
                    <span className="font-semibold">Vector SVG</span>
                  </div>
                  <span className="text-[10px] font-mono text-black/40">Vector</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPrintSettings) {
                      onOpenPrintSettings();
                    } else {
                      onExportPDF();
                    }
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-black/5 rounded transition-colors text-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2.5">
                    <Printer size={14} className="opacity-70 text-rose-600" />
                    <div>
                      <span className="font-semibold block">Print-Ready PDF</span>
                      <span className="text-[9px] text-black/40">With Bleed & Crop Marks</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-black/40">CMYK/300DPI</span>
                </button>
              </div>

              <div className="pt-1 border-t border-black/5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onCopyImage();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-black/5 rounded transition-colors text-black/80 font-medium"
                >
                  <Copy size={13} className="opacity-60" />
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

