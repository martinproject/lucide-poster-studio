import React, { useState, useMemo, useRef } from 'react';
import {
  Sparkles,
  Grid3X3,
  Palette,
  Type,
  Download,
  Upload,
  Trash2,
  Save,
  FileJson,
  FolderPlus,
  SlidersHorizontal,
  Lock,
  Unlock,
  Shuffle,
  RotateCcw,
  Check,
  FileImage,
  FileCode,
  FileText,
  Copy,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Minus,
  CheckCheck,
  Shapes,
  Maximize2,
  Eye,
  EyeOff,
  Filter,
  X,
  View,
} from 'lucide-react';
import { ICON_CATEGORIES, ALL_ICON_NAMES, getLucideIcon } from '../data/iconsCatalog';
import { POSTER_PRESETS } from '../data/presets';
import { LucideSwirlLogo } from './PosterCanvas';
import type {
  AspectRatio,
  BackgroundType,
  FontFamily,
  HeaderPosition,
  IconColorMode,
  PosterConfig,
  PosterPreset,
  TextureType,
} from '../types';

interface SidebarProps {
  config: PosterConfig;
  onChangeConfig: (updates: Partial<PosterConfig>) => void;
  onApplyPreset: (preset: PosterPreset) => void;
  customPresets?: PosterPreset[];
  onSaveCustomPreset?: (data: { name: string; description: string; category: string }) => void;
  onDeleteCustomPreset?: (id: string) => void;
  onExportPresetJSON?: (preset: PosterPreset) => void;
  onImportPresetJSON?: (file: File) => void;
  onExportAllPresetsJSON?: () => void;
  onExportConfigJSON?: () => void;
  onShuffle: () => void;
  onResetToPreset?: () => void;
  onLockAll: () => void;
  onUnlockAll: () => void;
  allLocked: boolean;
  onExportPNG: (scale: number) => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onCopyImage: () => void;
  copySuccess: boolean;
  totalIconsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenMockup?: () => void;
}

export type TabType = 'presets' | 'icons' | 'layout' | 'colors' | 'typography' | 'export';

export function Sidebar({
  config,
  onChangeConfig,
  onApplyPreset,
  customPresets = [],
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onExportPresetJSON,
  onImportPresetJSON,
  onExportAllPresetsJSON,
  onExportConfigJSON,
  onShuffle,
  onResetToPreset,
  onLockAll,
  onUnlockAll,
  allLocked,
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onCopyImage,
  copySuccess,
  totalIconsCount,
  isCollapsed = false,
  onToggleCollapse,
  onOpenMockup,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [categorySearch, setCategorySearch] = useState('');

  // Presets tab state
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedPresetFilter, setSelectedPresetFilter] = useState<string>('all');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState('Custom');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected categories normalization
  const selectedCats = useMemo(() => {
    if (config.selectedCategories && config.selectedCategories.length > 0) {
      return config.selectedCategories;
    }
    if (config.selectedCategory) {
      return [config.selectedCategory];
    }
    return ['all'];
  }, [config.selectedCategories, config.selectedCategory]);

  const isAllActive = selectedCats.includes('all');

  // Toggle or multi-select a category
  const handleToggleCategory = (catId: string) => {
    if (catId === 'all') {
      onChangeConfig({ selectedCategories: ['all'], selectedCategory: 'all' });
      return;
    }

    let nextCats: string[];
    if (isAllActive) {
      nextCats = [catId];
    } else if (selectedCats.includes(catId)) {
      nextCats = selectedCats.filter((id) => id !== catId);
      if (nextCats.length === 0) {
        nextCats = ['all'];
      }
    } else {
      nextCats = [...selectedCats, catId];
    }

    onChangeConfig({
      selectedCategories: nextCats,
      selectedCategory: nextCats.length === 1 ? nextCats[0] : 'all',
    });
  };

  // Select all categories
  const handleSelectAll = () => {
    onChangeConfig({ selectedCategories: ['all'], selectedCategory: 'all' });
  };

  // Filter categories by search
  const visibleCategories = useMemo(() => {
    if (!categorySearch.trim()) return ICON_CATEGORIES;
    const q = categorySearch.toLowerCase();
    return ICON_CATEGORIES.filter((cat) => cat.label.toLowerCase().includes(q));
  }, [categorySearch]);

  // Tab definitions with icons and descriptions
  const tabs: { id: TabType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'presets', label: 'Styles', icon: Sparkles },
    { id: 'icons', label: 'Icons', icon: Shapes, badge: '1.7k' },
    { id: 'layout', label: 'Grid', icon: SlidersHorizontal },
    { id: 'colors', label: 'Palette', icon: Palette },
    { id: 'typography', label: 'Type', icon: Type },
    { id: 'export', label: 'Export', icon: Download },
  ];

  const aspectRatios: { id: AspectRatio; label: string; desc: string; ratio: string }[] = [
    { id: '3:4', label: '3:4', desc: 'Standard Editorial Poster', ratio: 'w-4 h-5' },
    { id: '1:1', label: '1:1', desc: 'Square Vinyl Format', ratio: 'w-4 h-4' },
    { id: '4:5', label: '4:5', desc: 'Fine Art Print', ratio: 'w-4 h-5' },
    { id: '2:3', label: '2:3', desc: 'Classic 24×36 Exhibition', ratio: 'w-3.5 h-5' },
    { id: '9:16', label: '9:16', desc: 'Vertical Story', ratio: 'w-3 h-5' },
    { id: '16:9', label: '16:9', desc: 'Horizontal Banner', ratio: 'w-5 h-3' },
  ];

  const textures: { id: TextureType; label: string }[] = [
    { id: 'none', label: 'Smooth' },
    { id: 'grain', label: 'Micro Grain' },
    { id: 'linen', label: 'Fine Linen' },
    { id: 'paper', label: 'Cotton Paper' },
    { id: 'grid', label: 'Tech Grid' },
    { id: 'dots', label: 'Dot Matrix' },
    { id: 'halftone', label: 'Halftone' },
    { id: 'lines', label: 'Engraving' },
  ];

  const iconColorModes: { id: IconColorMode; label: string; desc: string }[] = [
    { id: 'single', label: 'Monochrome', desc: 'Single uniform ink tone' },
    { id: 'alternate', label: 'Checkerboard', desc: 'Alternating cell rhythm' },
    { id: 'row_gradient', label: 'Vertical Spectrum', desc: 'Top-to-bottom continuous transition' },
    { id: 'col_gradient', label: 'Horizontal Spectrum', desc: 'Left-to-right color transition' },
    { id: 'category', label: 'By Category', desc: 'Taxonomy-based palette assignment' },
    { id: 'random_palette', label: 'Curated Mix', desc: 'Harmonic balanced color distribution' },
  ];

  const editorialPaletteSwatches = [
    { hex: '#1A1815', name: 'Deep Charcoal' },
    { hex: '#F3EDE2', name: 'Warm Cream' },
    { hex: '#E2DEC8', name: 'Kraft Beige' },
    { hex: '#E5EADD', name: 'Sage Leaf' },
    { hex: '#EBD9D1', name: 'Terracotta' },
    { hex: '#D1DAEB', name: 'Slate Azure' },
    { hex: '#DE5D53', name: 'Lucide Coral' },
    { hex: '#123028', name: 'Forest Ink' },
    { hex: '#0F2C59', name: 'Blueprint Navy' },
    { hex: '#0B0D13', name: 'Obsidian Black' },
  ];

  const fonts: FontFamily[] = [
    'Inter',
    'Playfair Display',
    'Space Grotesk',
    'Syne',
    'JetBrains Mono',
    'Plus Jakarta Sans',
    'Outfit',
    'DM Sans',
  ];

  // Presets filtering and grouping
  const presetCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('all');
    if (customPresets.length > 0) cats.add('Custom');
    POSTER_PRESETS.forEach((p) => cats.add(p.category));
    customPresets.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [customPresets]);

  const filteredCustomPresets = useMemo(() => {
    return customPresets.filter((preset) => {
      const matchesSearch =
        !presetSearch.trim() ||
        preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        preset.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
        preset.category.toLowerCase().includes(presetSearch.toLowerCase());

      const matchesCategory =
        selectedPresetFilter === 'all' ||
        selectedPresetFilter.toLowerCase() === 'custom' ||
        preset.category.toLowerCase() === selectedPresetFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [customPresets, presetSearch, selectedPresetFilter]);

  const filteredCuratedPresets = useMemo(() => {
    if (selectedPresetFilter.toLowerCase() === 'custom') return [];
    return POSTER_PRESETS.filter((preset) => {
      const matchesSearch =
        !presetSearch.trim() ||
        preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        preset.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
        preset.category.toLowerCase().includes(presetSearch.toLowerCase());

      const matchesCategory =
        selectedPresetFilter === 'all' ||
        preset.category.toLowerCase() === selectedPresetFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [presetSearch, selectedPresetFilter]);

  const handleSavePresetSubmit = (e: React.FormEvent, downloadAfter: boolean = false) => {
    e.preventDefault();
    const name = newPresetName.trim() || 'Custom Studio Preset';
    const category = newPresetCategory.trim() || 'Custom';
    const description = newPresetDesc.trim() || 'Custom composition with user typography and colors';

    if (onSaveCustomPreset) {
      onSaveCustomPreset({ name, category, description });
    }

    if (downloadAfter && onExportPresetJSON) {
      const tempPreset: PosterPreset = {
        id: `custom-${Date.now()}`,
        name,
        description,
        category,
        previewBg: config.backgroundColor,
        previewFg: config.primaryIconColor,
        previewAccent: config.badgeColor || config.secondaryIconColor,
        config: { ...config },
        isCustom: true,
        createdAt: Date.now(),
      };
      onExportPresetJSON(tempPreset);
    }

    setIsCreatingPreset(false);
    setNewPresetName('');
    setNewPresetDesc('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportPresetJSON) {
      onImportPresetJSON(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <aside className="flex flex-row h-full min-h-0 border-r border-black/10 bg-[#FDFCFB] text-[#1A1A1A] font-sans flex-shrink-0 z-30 select-none overflow-hidden">
      {/* ================= 1. PRIMARY ICON RAIL (Compact Left Sidebar) ================= */}
      <div className="w-16 sm:w-[70px] bg-[#FAF8F5] border-r border-black/10 flex flex-col items-center justify-between py-4 flex-shrink-0 h-full overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="w-full flex flex-col items-center gap-1.5 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !isCollapsed;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isCollapsed && onToggleCollapse) {
                    onToggleCollapse();
                  }
                }}
                className={`w-full py-2.5 px-1 rounded flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all relative group ${isActive
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-black/50 hover:text-black hover:bg-black/5'
                  }`}
                title={tab.label}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
                <span className="text-[9px] scale-90 tracking-tighter truncate max-w-full">{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 px-1 bg-black/10 text-black/70 text-[8px] rounded-full font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* 3D Mockup Access */}
          {onOpenMockup && (
            <>
              <div className="w-8 h-[1px] bg-black/10 my-1.5" />
              <button
                onClick={onOpenMockup}
                className="w-full py-2.5 px-1 rounded flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all relative text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 shadow-3xs"
                title="Preview in 3D Mockup"
              >
                <View size={18} strokeWidth={1.75} className="text-amber-600 animate-pulse" />
                <span className="text-[9px] scale-90 tracking-tighter truncate max-w-full">Mockup</span>
              </button>
            </>
          )}
        </div>

        {/* Quick Bottom Actions */}
        <div className="w-full flex flex-col items-center gap-2 pt-3 border-t border-black/10 px-2">
          <button
            onClick={onShuffle}
            className="w-10 h-10 rounded border border-dashed border-black/25 hover:border-black hover:bg-black/5 flex items-center justify-center text-black/70 hover:text-black transition-all"
            title="Randomize icon arrangement (Shuffle)"
          >
            <Shuffle size={15} />
          </button>

          <button
            onClick={allLocked ? onUnlockAll : onLockAll}
            className={`w-10 h-10 rounded border flex items-center justify-center transition-all ${allLocked
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'border-black/15 hover:border-black/40 text-black/60 hover:text-black'
              }`}
            title={allLocked ? 'Unlock all cells' : 'Lock all icon positions'}
          >
            {allLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-10 h-10 rounded border border-black/10 hover:border-black/30 hover:bg-black/5 items-center justify-center text-black/60 hover:text-black transition-all"
              title={isCollapsed ? 'Expand Inspector Panel' : 'Collapse Inspector Panel'}
            >
              {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. INSPECTOR PANEL (Spacious Scrollable Settings) ================= */}
      {!isCollapsed && (
        <div className="w-full sm:w-[350px] md:w-[380px] flex flex-col h-full bg-[#FDFCFB] overflow-hidden border-r border-black/5 animate-in slide-in-from-left-2 duration-150">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-black/10 bg-[#FAF9F7] flex items-center justify-between flex-shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">
                Inspector
              </span>
              <h2 className="text-base font-serif font-bold tracking-tight text-[#1A1A1A]">
                {activeTab === 'presets' && 'Design Presets'}
                {activeTab === 'icons' && 'Taxonomy & Glyphs'}
                {activeTab === 'layout' && 'Grid Architecture'}
                {activeTab === 'colors' && 'Color & Textures'}
                {activeTab === 'typography' && 'Typography & Brand'}
                {activeTab === 'export' && 'Export & Print Specs'}
              </h2>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-black/5 rounded text-black/60">
              {totalIconsCount} icons
            </span>
          </div>

          {/* Panel Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-gutter-stable">
            {/* ================= TAB 1: PRESETS ================= */}
            {activeTab === 'presets' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-black/60">
                    Curated typographic compositions and custom presets for high-res archival print.
                  </p>
                </div>

                {/* Hidden JSON file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".json,application/json"
                  className="hidden"
                />

                {/* Top Action Bar: Create Custom, Import JSON & Reset */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setIsCreatingPreset((v) => !v)}
                      className={`p-2 sm:p-2.5 rounded border text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs ${isCreatingPreset
                        ? 'bg-[#1A1A1A] text-white border-black'
                        : 'bg-white border-black/15 hover:border-black text-[#1A1A1A] hover:bg-black/5'
                        }`}
                      title={isCreatingPreset ? 'Close Creator' : 'Save current design as custom preset'}
                    >
                      <Plus size={13} />
                      <span className="truncate">{isCreatingPreset ? 'Close' : 'Save'}</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 sm:p-2.5 rounded border border-black/15 hover:border-black bg-white hover:bg-black/5 text-xs font-bold text-[#1A1A1A] flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs"
                      title="Import preset from a .json file"
                    >
                      <Upload size={13} className="text-black/70" />
                      <span className="truncate">Import</span>
                    </button>

                    {onResetToPreset && (
                      <button
                        type="button"
                        onClick={onResetToPreset}
                        className="p-2 sm:p-2.5 rounded border border-black/15 hover:border-black bg-white hover:bg-black/5 text-xs font-bold text-[#1A1A1A] flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs"
                        title="Reset poster to default original design"
                      >
                        <RotateCcw size={13} className="text-black/70" />
                        <span className="truncate">Reset</span>
                      </button>
                    )}
                  </div>

                  {customPresets.length > 0 && onExportAllPresetsJSON && (
                    <button
                      onClick={onExportAllPresetsJSON}
                      className="w-full py-1.5 px-2.5 rounded border border-black/10 hover:border-black/30 bg-black/5 hover:bg-black/10 text-[11px] font-medium text-black/70 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileJson size={13} className="text-black/60" />
                      <span>Export All Custom Presets ({customPresets.length}) as JSON</span>
                    </button>
                  )}
                </div>

                {/* Inline "Create Custom Preset" Form */}
                {isCreatingPreset && (
                  <form
                    onSubmit={(e) => handleSavePresetSubmit(e, false)}
                    className="p-4 bg-white border border-black/20 rounded shadow-xs space-y-3 animate-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/10">
                      <div className="flex items-center gap-1.5">
                        <Save size={14} className="text-black/70" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black">
                          Save Custom Preset
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCreatingPreset(false)}
                        className="text-black/40 hover:text-black"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Live Preview Bar of Current Composition */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-black/40">
                        Current Look Preview
                      </span>
                      <div
                        className="w-full h-8 rounded border border-black/15 flex items-center justify-between px-3 overflow-hidden shadow-2xs"
                        style={{ backgroundColor: config.backgroundColor || '#FAF8F5' }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: config.badgeColor || '#DE5D53' }}
                          />
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: config.primaryIconColor || '#1A1A1A' }}
                          >
                            {config.fontFamily}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config.primaryIconColor || '#1A1A1A' }}
                          />
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config.secondaryIconColor || '#4A463F' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-black/60">
                        Preset Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="e.g. Kyoto Minimalist Grid"
                        className="w-full p-2 bg-white border border-black/20 rounded text-xs focus:outline-none focus:border-black font-medium"
                      />
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-black/60">
                        Category
                      </label>
                      <select
                        value={newPresetCategory}
                        onChange={(e) => setNewPresetCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-black/20 rounded text-xs focus:outline-none focus:border-black text-[#1A1A1A]"
                      >
                        <option value="Custom">Custom</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Editorial">Editorial</option>
                        <option value="Vibrant">Vibrant</option>
                        <option value="Organic">Organic</option>
                        <option value="Dark Mode">Dark Mode</option>
                        <option value="Artistic">Artistic</option>
                        <option value="Warm">Warm</option>
                      </select>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-black/60">
                        Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={newPresetDesc}
                        onChange={(e) => setNewPresetDesc(e.target.value)}
                        placeholder="Brief notes about fonts, colors, and layout..."
                        className="w-full p-2 bg-white border border-black/20 rounded text-xs focus:outline-none focus:border-black resize-none"
                      />
                    </div>

                    {/* Submit Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="submit"
                        className="py-2 px-3 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded transition-all shadow-xs"
                      >
                        Save Preset
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSavePresetSubmit(e, true)}
                        className="py-2 px-3 bg-white hover:bg-black/5 text-[#1A1A1A] border border-black/20 text-xs font-bold rounded flex items-center justify-center gap-1 transition-all"
                        title="Save and download as JSON file"
                      >
                        <Download size={13} />
                        <span>Save & JSON</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Search & Category Filter */}
                <div className="space-y-3 pt-1 border-t border-black/10">
                  {/* Search bar */}
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-black/40" />
                    <input
                      type="text"
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      placeholder="Search presets by name or style..."
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-black/15 rounded text-xs focus:outline-none focus:border-black"
                    />
                    {presetSearch && (
                      <button
                        onClick={() => setPresetSearch('')}
                        className="absolute right-2.5 top-2 text-black/40 hover:text-black"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {presetCategories.map((cat) => {
                      const isSelected =
                        selectedPresetFilter.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedPresetFilter(cat)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all capitalize ${isSelected
                            ? 'bg-[#1A1A1A] text-white font-bold shadow-2xs'
                            : 'bg-white border border-black/10 text-black/70 hover:border-black/30 hover:text-black'
                            }`}
                        >
                          {cat === 'all' ? `All (${POSTER_PRESETS.length + customPresets.length})` : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ================= 1. CUSTOM PRESETS SECTION ================= */}
                {filteredCustomPresets.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                        My Custom Presets ({filteredCustomPresets.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {filteredCustomPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="group flex flex-col p-3.5 border border-purple-200/80 hover:border-purple-400 bg-white text-left transition-all hover:shadow-[0_8px_20px_rgba(124,58,237,0.06)] relative rounded"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs tracking-tight text-[#1A1A1A] group-hover:text-black">
                              {preset.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] uppercase tracking-widest font-mono text-purple-700 bg-purple-100/80 px-1.5 py-0.5 rounded font-bold">
                                {preset.category || 'CUSTOM'}
                              </span>
                            </div>
                          </div>

                          {/* Visual swatch bar preview */}
                          <div
                            onClick={() => onApplyPreset(preset)}
                            className="w-full h-9 rounded border border-black/10 flex items-center justify-between px-3 overflow-hidden cursor-pointer"
                            style={{
                              backgroundColor: preset.config.backgroundColor || '#F3EDE2',
                            }}
                            title="Click to apply this preset"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: preset.config.badgeColor || '#DE5D53' }}
                              />
                              <div
                                className="h-1 w-10 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                            </div>
                            <div className="flex gap-1">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: preset.config.secondaryIconColor || '#4A463F',
                                }}
                              />
                            </div>
                          </div>

                          <p className="text-[11px] text-black/60 mt-2 line-clamp-2 leading-relaxed">
                            {preset.description}
                          </p>

                          {/* Card Actions Footer */}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5">
                            <button
                              onClick={() => onApplyPreset(preset)}
                              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                            >
                              <Sparkles size={12} />
                              <span>Apply Style</span>
                            </button>

                            <div className="flex items-center gap-1">
                              {onExportPresetJSON && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExportPresetJSON(preset);
                                  }}
                                  className="p-1 text-black/50 hover:text-black hover:bg-black/5 rounded transition-all"
                                  title="Export preset as JSON"
                                >
                                  <Download size={13} />
                                </button>
                              )}

                              {onDeleteCustomPreset && (
                                confirmDeleteId === preset.id ? (
                                  <div
                                    className="flex items-center gap-1 bg-red-50 py-0.5 px-1.5 rounded border border-red-200 animate-in fade-in duration-150"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="text-[10px] text-red-700 font-bold">Delete?</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCustomPreset(preset.id);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-2xs"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDeleteId(null);
                                      }}
                                      className="px-1 py-0.5 text-black/60 hover:text-black text-[10px] font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmDeleteId(preset.id);
                                    }}
                                    className="p-1 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                                    title="Delete custom preset"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= 2. CURATED STUDIO PRESETS SECTION ================= */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                      Curated Studio Presets ({filteredCuratedPresets.length})
                    </span>
                  </div>

                  {filteredCuratedPresets.length === 0 && filteredCustomPresets.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-black/15 rounded bg-white space-y-2">
                      <p className="text-xs text-black/50">No presets match your search query.</p>
                      <button
                        onClick={() => {
                          setPresetSearch('');
                          setSelectedPresetFilter('all');
                        }}
                        className="text-xs font-bold text-black hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredCuratedPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="group flex flex-col p-3.5 border border-black/10 hover:border-black/40 bg-white text-left transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] relative rounded"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs tracking-tight text-[#1A1A1A] group-hover:text-black">
                              {preset.name}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest font-mono text-black/40 bg-black/5 px-1.5 py-0.5 rounded">
                              {preset.category}
                            </span>
                          </div>

                          {/* Visual swatch bar preview */}
                          <div
                            onClick={() => onApplyPreset(preset)}
                            className="w-full h-9 rounded border border-black/10 flex items-center justify-between px-3 overflow-hidden cursor-pointer"
                            style={{
                              backgroundColor: preset.config.backgroundColor || '#F3EDE2',
                            }}
                            title="Click to apply this preset"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: preset.config.badgeColor || '#DE5D53' }}
                              />
                              <div
                                className="h-1 w-10 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                            </div>
                            <div className="flex gap-1">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: preset.config.primaryIconColor || '#1A1815',
                                }}
                              />
                            </div>
                          </div>

                          <p className="text-[11px] text-black/50 mt-2 line-clamp-2 leading-relaxed">
                            {preset.description}
                          </p>

                          {/* Card Actions Footer */}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5">
                            <button
                              onClick={() => onApplyPreset(preset)}
                              className="text-[11px] font-bold text-black/70 hover:text-black flex items-center gap-1"
                            >
                              <Sparkles size={12} />
                              <span>Apply Preset</span>
                            </button>

                            {onExportPresetJSON && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExportPresetJSON(preset);
                                }}
                                className="p-1 text-black/40 hover:text-black hover:bg-black/5 rounded transition-all flex items-center gap-1 text-[10px]"
                                title="Export this preset as JSON template"
                              >
                                <Download size={12} />
                                <span className="font-mono">JSON</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: ICONS & CATEGORIES ================= */}
            {activeTab === 'icons' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-black/60">
                    Filter by official Lucide taxonomy or generate randomized sets from all 1,776 vector glyphs.
                  </p>
                </div>

                {/* Quick Grid Shuffling */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onShuffle}
                    className="py-2.5 px-3 border border-dashed border-black/30 hover:border-black hover:bg-black/5 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded"
                  >
                    <Shuffle size={13} />
                    <span>Shuffle</span>
                  </button>

                  <button
                    onClick={allLocked ? onUnlockAll : onLockAll}
                    className={`py-2.5 px-3 border text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded ${allLocked
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'border-black/20 hover:border-black text-black/70 hover:text-black'
                      }`}
                  >
                    {allLocked ? <Lock size={13} /> : <Unlock size={13} />}
                    <span>{allLocked ? 'Unlock All' : 'Lock All'}</span>
                  </button>
                </div>

                {/* Search & Category Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                      Taxonomy Selection
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSelectAll}
                        className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${isAllActive ? 'text-black font-bold' : 'text-black/40 hover:text-black'
                          }`}
                      >
                        All (1,776)
                      </button>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    <input
                      type="text"
                      placeholder="Search 42 categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full pl-9 pr-7 py-2 bg-white border border-black/15 text-xs rounded placeholder-black/30 focus:outline-none focus:border-black"
                    />
                    {categorySearch && (
                      <button
                        onClick={() => setCategorySearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] uppercase opacity-40 hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Pills Grid */}
                  <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1 border border-black/10 p-2 bg-white rounded">
                    {visibleCategories.map((cat) => {
                      const isSelected = isAllActive
                        ? cat.id === 'all'
                        : selectedCats.includes(cat.id);
                      const IconComp = getLucideIcon(cat.iconName) || Shapes;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-all ${isSelected
                            ? 'bg-[#1A1A1A] text-white font-medium shadow-xs'
                            : 'hover:bg-black/5 text-black/80'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <IconComp size={13} className={isSelected ? 'text-white' : 'opacity-50'} />
                            <span className="truncate">{cat.label}</span>
                          </div>
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-black/40'
                              }`}
                          >
                            {cat.icons.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: LAYOUT & DENSITY ================= */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Poster Format / Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {aspectRatios.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onChangeConfig({ aspectRatio: item.id })}
                        className={`p-2.5 border text-left flex flex-col justify-between transition-all rounded ${config.aspectRatio === item.id
                          ? 'border-black bg-[#1A1A1A] text-white shadow-xs'
                          : 'border-black/15 bg-white hover:border-black/40 text-black/80'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">{item.label}</span>
                          <div
                            className={`border border-current opacity-40 rounded-xs ${item.ratio}`}
                          />
                        </div>
                        <span
                          className={`text-[9px] mt-1 truncate ${config.aspectRatio === item.id ? 'text-white/60' : 'text-black/40'
                            }`}
                        >
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columns Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Columns</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <button
                        onClick={() => onChangeConfig({ columns: Math.max(3, config.columns - 1) })}
                        className="w-5 h-5 border border-black/20 hover:border-black flex items-center justify-center rounded"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center font-bold">{config.columns}</span>
                      <button
                        onClick={() => onChangeConfig({ columns: Math.min(16, config.columns + 1) })}
                        className="w-5 h-5 border border-black/20 hover:border-black flex items-center justify-center rounded"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="16"
                    value={config.columns}
                    onChange={(e) => onChangeConfig({ columns: Number(e.target.value) })}
                    className="slider-editorial"
                  />
                </div>

                {/* Rows Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Rows</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <button
                        onClick={() => onChangeConfig({ rows: Math.max(3, config.rows - 1) })}
                        className="w-5 h-5 border border-black/20 hover:border-black flex items-center justify-center rounded"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center font-bold">{config.rows}</span>
                      <button
                        onClick={() => onChangeConfig({ rows: Math.min(24, config.rows + 1) })}
                        className="w-5 h-5 border border-black/20 hover:border-black flex items-center justify-center rounded"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    value={config.rows}
                    onChange={(e) => onChangeConfig({ rows: Number(e.target.value) })}
                    className="slider-editorial"
                  />
                </div>

                {/* Icon Scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">Glyph Scale</span>
                    <span className="font-mono text-black/50">{config.iconScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={config.iconScale}
                    onChange={(e) => onChangeConfig({ iconScale: Number(e.target.value) })}
                    className="slider-editorial"
                  />
                </div>

                {/* Stroke Width */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">Vector Stroke Weight</span>
                    <span className="font-mono text-black/50">{config.strokeWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.5"
                    step="0.25"
                    value={config.strokeWidth}
                    onChange={(e) => onChangeConfig({ strokeWidth: Number(e.target.value) })}
                    className="slider-editorial"
                  />
                </div>

                {/* Grid Gaps */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-black/70">Gap X</span>
                      <span className="font-mono text-black/50">{config.gridGapX}</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      value={config.gridGapX}
                      onChange={(e) => onChangeConfig({ gridGapX: Number(e.target.value) })}
                      className="slider-editorial"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-black/70">Gap Y</span>
                      <span className="font-mono text-black/50">{config.gridGapY}</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      value={config.gridGapY}
                      onChange={(e) => onChangeConfig({ gridGapY: Number(e.target.value) })}
                      className="slider-editorial"
                    />
                  </div>
                </div>

                {/* Poster Margins & Framing */}
                <div className="space-y-3 pt-2 border-t border-black/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                      Poster Framing & Margins
                    </span>
                    <button
                      onClick={() =>
                        onChangeConfig({
                          paddingSides: 56,
                          paddingTop: 56,
                          paddingBottom: 56,
                        })
                      }
                      className="text-[10px] font-mono text-black/60 hover:text-black underline"
                    >
                      Equalize (56px)
                    </button>
                  </div>

                  {/* Master Uniform Padding */}
                  <div className="space-y-1.5 p-3 bg-white border border-black/15 rounded">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Padding (All 4 Sides)</span>
                      <span className="font-mono text-black/60">{config.paddingSides || 56} px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="140"
                      value={config.paddingSides || 56}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onChangeConfig({
                          paddingSides: val,
                          paddingTop: val,
                          paddingBottom: val,
                        });
                      }}
                      className="slider-editorial"
                    />
                    <span className="text-[10px] text-black/40 block">
                      Frame the poster with exactly the same spacing at the top, bottom, and sides.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: PALETTE & TEXTURES ================= */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Background Type */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Background Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onChangeConfig({ backgroundType: 'solid' })}
                      className={`py-2 text-xs font-semibold rounded border transition-all ${config.backgroundType === 'solid'
                        ? 'bg-[#1A1A1A] text-white border-black'
                        : 'bg-white border-black/15 text-black/70 hover:border-black/40'
                        }`}
                    >
                      Solid Color
                    </button>
                    <button
                      onClick={() => onChangeConfig({ backgroundType: 'gradient' })}
                      className={`py-2 text-xs font-semibold rounded border transition-all ${config.backgroundType === 'gradient'
                        ? 'bg-[#1A1A1A] text-white border-black'
                        : 'bg-white border-black/15 text-black/70 hover:border-black/40'
                        }`}
                    >
                      Linear Gradient
                    </button>
                  </div>
                </div>

                {/* Background Color Pickers */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Canvas Base Colors
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 p-2 bg-white border border-black/15 rounded">
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => onChangeConfig({ backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded border border-black/10 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black/40 uppercase">Primary Base</span>
                        <span className="font-mono text-xs font-bold">{config.backgroundColor}</span>
                      </div>
                    </div>

                    {config.backgroundType === 'gradient' && (
                      <div className="flex items-center gap-2 flex-1 p-2 bg-white border border-black/15 rounded">
                        <input
                          type="color"
                          value={config.gradientColor2 || '#E7DEC8'}
                          onChange={(e) => onChangeConfig({ gradientColor2: e.target.value })}
                          className="w-7 h-7 rounded border border-black/10 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-black/40 uppercase">Gradient End</span>
                          <span className="font-mono text-xs font-bold">{config.gradientColor2}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editorialPaletteSwatches.map((swatch) => (
                      <button
                        key={swatch.hex}
                        onClick={() => onChangeConfig({ backgroundColor: swatch.hex })}
                        style={{ backgroundColor: swatch.hex }}
                        className="w-6 h-6 rounded border border-black/15 hover:scale-110 transition-transform shadow-2xs"
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Paper Textures */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Archival Paper Texture
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {textures.map((tex) => (
                      <button
                        key={tex.id}
                        onClick={() => onChangeConfig({ texture: tex.id })}
                        className={`p-2 text-xs font-medium rounded border transition-all text-center ${config.texture === tex.id
                          ? 'bg-[#1A1A1A] text-white border-black'
                          : 'bg-white border-black/15 text-black/70 hover:border-black/40'
                          }`}
                      >
                        {tex.label}
                      </button>
                    ))}
                  </div>

                  {config.texture !== 'none' && (
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-black/60">Texture Opacity</span>
                        <span className="font-mono">{Math.round(config.textureOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.02"
                        max="0.4"
                        step="0.02"
                        value={config.textureOpacity}
                        onChange={(e) => onChangeConfig({ textureOpacity: Number(e.target.value) })}
                        className="slider-editorial"
                      />
                    </div>
                  )}
                </div>

                {/* Icon Color Modes */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Icon Chromatic Rhythm
                  </label>
                  <div className="space-y-1.5">
                    {iconColorModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => onChangeConfig({ iconColorMode: mode.id })}
                        className={`w-full p-2.5 text-left border rounded transition-all flex items-center justify-between ${config.iconColorMode === mode.id
                          ? 'bg-[#1A1A1A] text-white border-black'
                          : 'bg-white border-black/15 hover:border-black/30 text-black/80'
                          }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{mode.label}</span>
                          <span
                            className={`text-[10px] ${config.iconColorMode === mode.id ? 'text-white/60' : 'text-black/50'
                              }`}
                          >
                            {mode.desc}
                          </span>
                        </div>
                        {config.iconColorMode === mode.id && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary & Secondary Icon Colors */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-black/50">Primary Ink</span>
                    <div className="flex items-center gap-2 p-2 bg-white border border-black/15 rounded">
                      <input
                        type="color"
                        value={config.primaryIconColor}
                        onChange={(e) => onChangeConfig({ primaryIconColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold truncate">
                        {config.primaryIconColor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-black/50">Accent Ink</span>
                    <div className="flex items-center gap-2 p-2 bg-white border border-black/15 rounded">
                      <input
                        type="color"
                        value={config.secondaryIconColor}
                        onChange={(e) => onChangeConfig({ secondaryIconColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold truncate">
                        {config.secondaryIconColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Brand Logo & Accent Ink Quick Access */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                      Brand Logo & Accent Ink
                    </label>
                    <span className="text-[10px] font-mono text-black/40">
                      {config.logoTheme === 'original-light'
                        ? 'Original Light'
                        : config.logoTheme === 'original-dark'
                          ? 'Original Dark'
                          : 'Custom Ink'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          logoTheme: 'original-light',
                          badgeColor: '#F56565',
                        })
                      }
                      className={`p-2 rounded border flex items-center justify-center gap-2 transition-all ${config.logoTheme === 'original-light'
                        ? 'bg-slate-100 border-slate-900 ring-1 ring-slate-900 font-bold'
                        : 'bg-white border-black/15 hover:border-black/30 text-black/70'
                        }`}
                      title="Official Lucide Light Theme Logo (#F56565 / #2D3748)"
                    >
                      <LucideSwirlLogo size={16} color="#2D3748" accentColor="#F56565" strokeWidth={2} />
                      <span className="text-xs">Original Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          logoTheme: 'original-dark',
                          badgeColor: '#F56565',
                        })
                      }
                      className={`p-2 rounded border flex items-center justify-center gap-2 transition-all ${config.logoTheme === 'original-dark'
                        ? 'bg-neutral-900 border-black ring-1 ring-black text-white font-bold'
                        : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
                        }`}
                      title="Official Lucide Dark Theme Logo (#F56565 / #FFFFFF)"
                    >
                      <LucideSwirlLogo size={16} color="#FFFFFF" accentColor="#F56565" strokeWidth={2} />
                      <span className="text-xs">Original Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: TYPOGRAPHY & BRAND ================= */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                {/* Master Visibility Switch */}
                <div className="p-3.5 bg-white border border-black/15 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {config.showTypography !== false ? (
                        <Eye size={16} className="text-black" />
                      ) : (
                        <EyeOff size={16} className="text-black/40" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">Typography & Branding</span>
                        <span className="text-[10px] text-black/50">
                          {config.showTypography !== false ? 'Visible on poster' : 'Hidden (Full icon grid)'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onChangeConfig({ showTypography: config.showTypography === false ? true : false })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.showTypography !== false ? 'bg-[#1A1A1A]' : 'bg-black/20'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.showTypography !== false ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {config.showTypography === false && (
                    <div className="pt-2 border-t border-black/10 text-[11px] text-black/60">
                      All brand headers, logos, and footer labels are currently hidden. The canvas displays an uninterrupted full grid of icons.
                    </div>
                  )}
                </div>

                {config.showTypography !== false && (
                  <>
                    {/* Brand Header Section */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                          Brand Header & Emblem
                        </label>
                        <button
                          type="button"
                          onClick={() => onChangeConfig({ showSideHeader: !config.showSideHeader })}
                          className="text-[10px] font-bold text-black/70 hover:text-black flex items-center gap-1"
                        >
                          {config.showSideHeader ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      {/* Header Layout Placement */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onChangeConfig({ headerPosition: 'vertical-left', showSideHeader: true })}
                          className={`p-2 text-center rounded border transition-all text-xs ${config.showSideHeader && config.headerPosition === 'vertical-left'
                            ? 'bg-[#1A1A1A] text-white border-black font-bold'
                            : 'bg-white border-black/15 hover:border-black/30 text-black/70'
                            }`}
                        >
                          Vertical
                        </button>
                        <button
                          type="button"
                          onClick={() => onChangeConfig({ headerPosition: 'horizontal-top', showSideHeader: true })}
                          className={`p-2 text-center rounded border transition-all text-xs ${config.showSideHeader && config.headerPosition === 'horizontal-top'
                            ? 'bg-[#1A1A1A] text-white border-black font-bold'
                            : 'bg-white border-black/15 hover:border-black/30 text-black/70'
                            }`}
                        >
                          Top Banner
                        </button>
                        <button
                          type="button"
                          onClick={() => onChangeConfig({ showSideHeader: false })}
                          className={`p-2 text-center rounded border transition-all text-xs ${!config.showSideHeader
                            ? 'bg-[#1A1A1A] text-white border-black font-bold'
                            : 'bg-white border-black/15 hover:border-black/30 text-black/70'
                            }`}
                        >
                          None
                        </button>
                      </div>

                      {config.showSideHeader && (
                        <div className="space-y-3 p-3 bg-white border border-black/15 rounded-lg">
                          <div>
                            <span className="text-xs font-bold block text-[#1A1A1A]">Brand Accent Ink & Emblem</span>
                            <span className="text-[10px] text-black/50">Official Lucide signature vector swirl & brand accents</span>
                          </div>

                          {/* Original Light / Original Dark / Custom Mode Selector */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {/* 1. Original Light */}
                            <button
                              type="button"
                              onClick={() =>
                                onChangeConfig({
                                  logoTheme: 'original-light',
                                  badgeColor: '#F56565',
                                })
                              }
                              className={`p-2 rounded border text-left flex flex-col items-center justify-between gap-1.5 transition-all ${config.logoTheme === 'original-light'
                                ? 'bg-slate-100 border-slate-900 ring-1 ring-slate-900 shadow-2xs'
                                : 'bg-slate-50/70 border-black/10 hover:border-black/30'
                                }`}
                              title="Official Lucide Light Theme Logo (#F56565 / #2D3748)"
                            >
                              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                                <LucideSwirlLogo size={18} color="#2D3748" accentColor="#F56565" strokeWidth={2} />
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] font-bold block text-slate-800 leading-tight">Original Light</span>
                                <span className="text-[8px] text-slate-400 font-mono">#2D3748 / #F56565</span>
                              </div>
                            </button>

                            {/* 2. Original Dark */}
                            <button
                              type="button"
                              onClick={() =>
                                onChangeConfig({
                                  logoTheme: 'original-dark',
                                  badgeColor: '#F56565',
                                })
                              }
                              className={`p-2 rounded border text-left flex flex-col items-center justify-between gap-1.5 transition-all ${config.logoTheme === 'original-dark'
                                ? 'bg-neutral-900 border-black ring-1 ring-black text-white shadow-2xs'
                                : 'bg-neutral-900/90 border-neutral-700 hover:border-neutral-500 text-neutral-200'
                                }`}
                              title="Official Lucide Dark Theme Logo (#F56565 / #FFFFFF)"
                            >
                              <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-2xs">
                                <LucideSwirlLogo size={18} color="#FFFFFF" accentColor="#F56565" strokeWidth={2} />
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] font-bold block leading-tight">Original Dark</span>
                                <span className="text-[8px] opacity-60 font-mono">#FFFFFF / #F56565</span>
                              </div>
                            </button>

                            {/* 3. Custom Ink */}
                            <button
                              type="button"
                              onClick={() =>
                                onChangeConfig({
                                  logoTheme: 'custom',
                                })
                              }
                              className={`p-2 rounded border text-left flex flex-col items-center justify-between gap-1.5 transition-all ${config.logoTheme === 'custom' || (!config.logoTheme && config.badgeColor !== '#F56565')
                                ? 'bg-amber-50/80 border-amber-900 ring-1 ring-amber-900 shadow-2xs'
                                : 'bg-white border-black/10 hover:border-black/30'
                                }`}
                              title="Custom Accent Ink matched to poster palette"
                            >
                              <div className="w-8 h-8 rounded-full bg-white border border-black/15 flex items-center justify-center shadow-2xs">
                                <LucideSwirlLogo
                                  size={18}
                                  color={config.textColor || '#1A1815'}
                                  accentColor={config.badgeColor || '#DE5D53'}
                                  strokeWidth={2}
                                />
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] font-bold block text-black/80 leading-tight">Custom Ink</span>
                                <span className="text-[8px] text-black/40 font-mono truncate max-w-[60px]">{config.badgeColor || '#DE5D53'}</span>
                              </div>
                            </button>
                          </div>

                          {/* Accent Color Custom Picker & Quick Swatches */}
                          <div className="pt-2 border-t border-black/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-black/60">
                                Accent Ink Color
                              </span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={config.badgeColor || '#DE5D53'}
                                  onChange={(e) =>
                                    onChangeConfig({
                                      badgeColor: e.target.value,
                                      logoTheme: 'custom',
                                    })
                                  }
                                  className="w-6 h-6 rounded cursor-pointer border border-black/15"
                                />
                                <span className="font-mono text-[11px] font-bold">{config.badgeColor || '#DE5D53'}</span>
                              </div>
                            </div>

                            {/* Preset Swatches including Original Lucide Red */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { name: 'Original Lucide Red', hex: '#F56565' },
                                { name: 'Swiss Vermillion', hex: '#DE5D53' },
                                { name: 'Electric Blue', hex: '#3B82F6' },
                                { name: 'Emerald Green', hex: '#10B981' },
                                { name: 'Amber Gold', hex: '#F59E0B' },
                                { name: 'Neon Purple', hex: '#8B5CF6' },
                                { name: 'Editorial Rose', hex: '#EC4899' },
                                { name: 'Cyan Tech', hex: '#06B6D4' },
                                { name: 'Acid Lime', hex: '#D4FF00' },
                                { name: 'Obsidian Black', hex: '#1A1A1A' },
                              ].map((swatch) => (
                                <button
                                  key={swatch.hex}
                                  type="button"
                                  onClick={() =>
                                    onChangeConfig({
                                      badgeColor: swatch.hex,
                                      logoTheme: swatch.hex === '#F56565' ? config.logoTheme || 'custom' : 'custom',
                                    })
                                  }
                                  style={{ backgroundColor: swatch.hex }}
                                  className={`w-5 h-5 rounded-full border transition-all ${config.badgeColor?.toLowerCase() === swatch.hex.toLowerCase()
                                    ? 'ring-2 ring-black ring-offset-1 scale-110 border-transparent'
                                    : 'border-black/20 hover:scale-110'
                                    }`}
                                  title={swatch.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Font Family Selection */}
                    <div className="space-y-2 pt-2 border-t border-black/10">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                        Typeface
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {fonts.map((font) => (
                          <button
                            key={font}
                            onClick={() => onChangeConfig({ fontFamily: font })}
                            className={`p-2.5 text-xs text-left rounded border transition-all ${config.fontFamily === font
                              ? 'bg-[#1A1A1A] text-white border-black font-bold'
                              : 'bg-white border-black/15 hover:border-black/30 text-black/70'
                              }`}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Footer Metadata Text Inputs */}
                    <div className="space-y-3 pt-2 border-t border-black/10">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                          Editorial Poster Metadata (Footer)
                        </label>
                        <button
                          type="button"
                          onClick={() => onChangeConfig({ showFooter: config.showFooter === false ? true : false })}
                          className="text-[10px] font-bold text-black/70 hover:text-black flex items-center gap-1"
                        >
                          {config.showFooter !== false ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      {config.showFooter !== false && (
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] text-black/60">Footer Left Text</span>
                            <textarea
                              rows={2}
                              value={config.footerLeft}
                              onChange={(e) => onChangeConfig({ footerLeft: e.target.value })}
                              className="w-full p-2 bg-white border border-black/15 rounded text-xs focus:outline-none focus:border-black font-mono"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-black/60">Footer Center Text (Optional)</span>
                            <input
                              type="text"
                              value={config.footerCenter || ''}
                              onChange={(e) => onChangeConfig({ footerCenter: e.target.value })}
                              placeholder="e.g. CURATED COLLECTION"
                              className="w-full p-2 bg-white border border-black/15 rounded text-xs focus:outline-none focus:border-black font-mono"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-black/60">Footer Right Text</span>
                            <input
                              type="text"
                              value={config.footerRight}
                              onChange={(e) => onChangeConfig({ footerRight: e.target.value })}
                              className="w-full p-2 bg-white border border-black/15 rounded text-xs focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ================= TAB 6: EXPORT ================= */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-black/60">
                    Download print-ready vectors and ultra high-definition raster graphics.
                  </p>
                </div>

                {/* Export PNG */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    High-Definition PNG
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onExportPNG(1)}
                      className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-center rounded transition-all"
                    >
                      <span className="text-xs font-bold block">1× Screen</span>
                      <span className="text-[10px] font-mono text-black/40">Standard</span>
                    </button>
                    <button
                      onClick={() => onExportPNG(2)}
                      className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-center rounded transition-all"
                    >
                      <span className="text-xs font-bold block">2× Retina</span>
                      <span className="text-[10px] font-mono text-black/40">Crisp Display</span>
                    </button>
                    <button
                      onClick={() => onExportPNG(4)}
                      className="p-3 border border-black bg-[#1A1A1A] text-white hover:bg-black text-center rounded transition-all shadow-xs"
                    >
                      <span className="text-xs font-bold block">4× Ultra</span>
                      <span className="text-[10px] font-mono text-white/60">300 DPI Print</span>
                    </button>
                  </div>
                </div>

                {/* Export SVG & PDF */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    Vector & Print Formats
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onExportSVG}
                      className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-left rounded transition-all flex items-start gap-3"
                    >
                      <FileCode size={18} className="text-black/70 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold block">Pure SVG</span>
                        <span className="text-[10px] text-black/50">Infinite vector scaling</span>
                      </div>
                    </button>

                    <button
                      onClick={onExportPDF}
                      className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-left rounded transition-all flex items-start gap-3"
                    >
                      <FileText size={18} className="text-black/70 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold block">Archival PDF</span>
                        <span className="text-[10px] text-black/50">Commercial print ready</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quick Copy to Clipboard */}
                <div className="pt-2 border-t border-black/10">
                  <button
                    onClick={onCopyImage}
                    className="w-full py-3 px-4 border border-black/20 hover:border-black bg-white hover:bg-black/5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded transition-all"
                  >
                    {copySuccess ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
                  </button>
                </div>

                {/* JSON Configuration & Custom Presets Backup */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                    JSON Data & Backup
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {onExportConfigJSON && (
                      <button
                        onClick={onExportConfigJSON}
                        className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-left rounded transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileJson size={18} className="text-black/70" />
                          <div>
                            <span className="text-xs font-bold block">Current Composition (.json)</span>
                            <span className="text-[10px] text-black/50">Full layout, colors, typography state</span>
                          </div>
                        </div>
                        <Download size={14} className="text-black/40" />
                      </button>
                    )}

                    {customPresets.length > 0 && onExportAllPresetsJSON && (
                      <button
                        onClick={onExportAllPresetsJSON}
                        className="p-3 border border-black/15 hover:border-black bg-white hover:bg-black/5 text-left rounded transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderPlus size={18} className="text-black/70" />
                          <div>
                            <span className="text-xs font-bold block">All Custom Presets ({customPresets.length})</span>
                            <span className="text-[10px] text-black/50">Export your custom preset library</span>
                          </div>
                        </div>
                        <Download size={14} className="text-black/40" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
