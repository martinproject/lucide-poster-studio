import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  RotateCw,
  Lock,
  Unlock,
  Shuffle,
  Paintbrush,
  Check,
} from 'lucide-react';
import { ALL_ICON_NAMES, ICON_CATEGORIES, getLucideIcon } from '../data/iconsCatalog';
import type { IconGridItem } from '../types';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: IconGridItem | null;
  cellIndex: number | null;
  onUpdateItem: (index: number, updated: Partial<IconGridItem>) => void;
  onRerollCell: (index: number) => void;
  primaryColor: string;
  totalCells?: number;
  currentFrequencyPercent?: number;
  onApplyDistribution?: (iconName: string, percentage: number) => void;
}

export function IconPickerModal({
  isOpen,
  onClose,
  selectedItem,
  cellIndex,
  onUpdateItem,
  onRerollCell,
  primaryColor,
  totalCells = 48,
  currentFrequencyPercent = 0,
  onApplyDistribution,
}: IconPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customHex, setCustomHex] = useState(selectedItem?.customColor || '');
  const [distributionPercent, setDistributionPercent] = useState<number>(currentFrequencyPercent);

  const selectedButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCustomHex(selectedItem?.customColor || '');
  }, [selectedItem?.customColor]);

  useEffect(() => {
    setDistributionPercent(currentFrequencyPercent);
  }, [currentFrequencyPercent, selectedItem?.name]);

  // Reset search and scroll to selected icon when opening the inspector
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveCategory('all');

      // Allow DOM to render then scroll selected icon into view smoothly
      const timer = setTimeout(() => {
        if (selectedButtonRef.current) {
          selectedButtonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
      }, 60);

      return () => clearTimeout(timer);
    }
  }, [isOpen, cellIndex, selectedItem?.name]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter icons based on category and search query
  const filteredIcons = useMemo(() => {
    let pool = ALL_ICON_NAMES;
    if (activeCategory !== 'all') {
      const cat = ICON_CATEGORIES.find((c) => c.id === activeCategory);
      if (cat && cat.icons.length > 0) {
        pool = cat.icons;
      }
    }

    if (!searchQuery.trim()) {
      return pool;
    }

    const q = searchQuery.toLowerCase();
    return pool.filter((name) => name.toLowerCase().includes(q));
  }, [activeCategory, searchQuery]);

  if (!isOpen || selectedItem === null || cellIndex === null) return null;

  const CurrentIcon = getLucideIcon(selectedItem.name);
  const targetCellsCount = Math.max(1, Math.round((distributionPercent / 100) * totalCells));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCFB] border border-black/20 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/10 bg-[#FAF9F7]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 border border-black/15 bg-white flex items-center justify-center text-[#1A1A1A]">
              {CurrentIcon ? <CurrentIcon size={22} strokeWidth={2} /> : null}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
                Cell Inspector № {cellIndex + 1}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] tracking-tight">
                {selectedItem.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-black/10 hover:border-black/30 hover:bg-black/5 text-black/60 hover:text-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Bar for Selected Cell */}
        <div className="px-6 sm:px-8 py-3 bg-[#F5F2ED] border-b border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {/* Lock / Unlock Toggle */}
            <button
              onClick={() => onUpdateItem(cellIndex, { isLocked: !selectedItem.isLocked })}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                selectedItem.isLocked
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 hover:border-black/40 bg-white text-black/80'
              }`}
            >
              {selectedItem.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {selectedItem.isLocked ? 'Locked' : 'Unlocked'}
            </button>

            {/* Rotate Clockwise */}
            <button
              onClick={() => {
                const nextRot = ((selectedItem.rotation || 0) + 90) % 360;
                onUpdateItem(cellIndex, { rotation: nextRot });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-black/20 hover:border-black/40 bg-white text-black/80 hover:text-black text-[11px] uppercase tracking-wider font-medium transition-colors"
            >
              <RotateCw size={12} />
              Rotate ({selectedItem.rotation || 0}°)
            </button>

            {/* Re-roll this cell */}
            <button
              onClick={() => onRerollCell(cellIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-black/30 hover:border-black hover:bg-black/5 text-black/80 text-[11px] uppercase tracking-wider font-semibold transition-colors"
              title="Pick another random icon for this cell"
            >
              <Shuffle size={12} />
              Re-Roll
            </button>
          </div>

          {/* Custom Color Tint for this icon */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1">
              <Paintbrush size={11} /> Tint:
            </span>
            <input
              type="color"
              value={selectedItem.customColor || primaryColor}
              onChange={(e) => {
                setCustomHex(e.target.value);
                onUpdateItem(cellIndex, { customColor: e.target.value });
              }}
              className="w-6 h-6 border border-black/20 bg-transparent cursor-pointer p-0.5"
            />
            {selectedItem.customColor && (
              <button
                onClick={() => {
                  setCustomHex('');
                  onUpdateItem(cellIndex, { customColor: undefined });
                }}
                className="text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 underline ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Poster Frequency / Appearance Percentage Controller (Up to 100% of entire design) */}
        <div className="px-6 sm:px-8 py-3.5 bg-[#FAF8F5] border-b border-black/10 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#1A1A1A]">
                Frecuencia en el diseño:
              </span>
              <span className="font-mono text-xs font-bold text-white bg-[#1A1A1A] px-2 py-0.5 rounded shadow-2xs">
                {distributionPercent}%
              </span>
              <span className="text-[11px] font-mono text-black/50">
                ({targetCellsCount} de {totalCells} celdas)
              </span>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1">
              {[
                { label: 'Solo 1', pct: Math.max(1, Math.round((1 / totalCells) * 100)) },
                { label: '25%', pct: 25 },
                { label: '50%', pct: 50 },
                { label: '75%', pct: 75 },
                { label: '100% Todo', pct: 100 },
              ].map((p) => {
                const isCurrent = Math.abs(distributionPercent - p.pct) <= 1 || (p.pct === 100 && distributionPercent === 100);
                return (
                  <button
                    key={p.label}
                    onClick={() => {
                      setDistributionPercent(p.pct);
                      if (onApplyDistribution) {
                        onApplyDistribution(selectedItem.name, p.pct);
                      }
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border transition-colors ${
                      isCurrent
                        ? 'border-black bg-black text-white'
                        : 'border-black/15 bg-white text-black/70 hover:border-black/40 hover:text-black'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={Math.max(1, Math.round((1 / totalCells) * 100))}
              max="100"
              step="1"
              value={distributionPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDistributionPercent(val);
                if (onApplyDistribution) {
                  onApplyDistribution(selectedItem.name, val);
                }
              }}
              className="slider-editorial flex-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 sm:p-6 border-b border-black/10 bg-[#FDFCFB] space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search 1,776 symbols (e.g. circle, arrow, spark, plant, cloud, user)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-black/20 text-xs text-[#1A1A1A] placeholder-black/30 focus:outline-none focus:border-black"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {ICON_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors font-semibold border ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-black/15 bg-white text-black/70 hover:border-black/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon Grid Viewer */}
        <div
          ref={scrollContainerRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-[240px] max-h-[340px] bg-[#FAF9F7] scrollbar-thin scrollbar-thumb-black/10"
        >
          {filteredIcons.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-black/50">
              <Search size={28} className="mb-2 opacity-30" />
              <p className="text-xs font-semibold uppercase tracking-wider">No matching glyphs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = getLucideIcon(iconName);
                const isSelected = selectedItem.name === iconName;
                return (
                  <button
                    key={iconName}
                    ref={isSelected ? (el) => { selectedButtonRef.current = el; } : undefined}
                    onClick={() => {
                      onUpdateItem(cellIndex, { name: iconName });
                    }}
                    title={iconName}
                    className={`group relative flex flex-col items-center justify-center p-2.5 border transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-md ring-2 ring-black/20'
                        : 'border-black/10 bg-white hover:border-black/40 text-[#1A1A1A]'
                    }`}
                  >
                    {IconComponent ? (
                      <IconComponent size={22} strokeWidth={1.8} className="transition-transform group-hover:scale-110" />
                    ) : null}
                    <span className="text-[8px] font-mono truncate w-full text-center mt-1.5 opacity-60">
                      {iconName}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <Check size={9} strokeWidth={3} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-3.5 border-t border-black/10 bg-[#FDFCFB]">
          <span className="text-[10px] uppercase tracking-wider font-mono opacity-50">
            {filteredIcons.length} Available Glyphs
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-widest transition-colors shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
