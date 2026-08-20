import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PosterCanvas,
  getCanvasDimensions,
} from './components/PosterCanvas';
import { Sidebar } from './components/Sidebar';
import { HeaderNav } from './components/HeaderNav';
import { IconPickerModal } from './components/IconPickerModal';
import { MockupStage } from './components/MockupStage';
import { PrintDialog } from './components/PrintDialog';
import { POSTER_PRESETS } from './data/presets';
import { generateIconGrid } from './utils/gridGenerator';
import {
  exportAsPNG,
  exportAsSVG,
  exportAsPDF,
  copyImageToClipboard,
  triggerCelebration,
  decodeShareableURL,
  encodeShareableURL,
} from './utils/exportUtils';
import type {
  IconGridItem,
  PosterConfig,
  PosterPreset,
} from './types';
import {
  Check,
  MousePointerClick,
  Minus,
  Plus,
  Maximize2,
} from 'lucide-react';

const CONFIG_STORAGE_KEY = 'lucide_poster_config';
const ICONS_STORAGE_KEY = 'lucide_poster_icons';
const CUSTOM_PRESETS_STORAGE_KEY = 'lucide_custom_presets';

// Helper to download JSON data as a file
function downloadJSON(data: unknown, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function loadInitialCustomPresets(): PosterPreset[] {
  try {
    const saved = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load custom presets from localStorage:', err);
  }
  return [];
}

const getDefaultConfig = (): PosterConfig => {
  const defaultPreset = POSTER_PRESETS[0];
  return {
    aspectRatio: defaultPreset.config.aspectRatio || '3:4',
    columns: defaultPreset.config.columns || 8,
    rows: defaultPreset.config.rows || 12,
    iconScale: defaultPreset.config.iconScale || 72,
    strokeWidth: defaultPreset.config.strokeWidth || 2,
    iconOpacity: defaultPreset.config.iconOpacity || 1,
    gridGapX: defaultPreset.config.gridGapX || 18,
    gridGapY: defaultPreset.config.gridGapY || 18,
    paddingTop: defaultPreset.config.paddingTop || 56,
    paddingBottom: defaultPreset.config.paddingBottom || 56,
    paddingSides: defaultPreset.config.paddingSides || 56,
    backgroundType: defaultPreset.config.backgroundType || 'solid',
    backgroundColor: defaultPreset.config.backgroundColor || '#F3EDE2',
    gradientColor2: defaultPreset.config.gradientColor2 || '#E7DEC8',
    gradientAngle: defaultPreset.config.gradientAngle || 180,
    texture: defaultPreset.config.texture || 'grain',
    textureOpacity: defaultPreset.config.textureOpacity || 0.08,
    iconColorMode: defaultPreset.config.iconColorMode || 'single',
    primaryIconColor: defaultPreset.config.primaryIconColor || '#1A1815',
    secondaryIconColor: defaultPreset.config.secondaryIconColor || '#4A463F',
    colorPalette: defaultPreset.config.colorPalette || ['#1A1815', '#332F2B', '#4D4741'],
    showTypography: defaultPreset.config.showTypography ?? true,
    showSideHeader: defaultPreset.config.showSideHeader ?? true,
    showHeader: defaultPreset.config.showHeader ?? true,
    showFooter: defaultPreset.config.showFooter ?? true,
    headerPosition: defaultPreset.config.headerPosition || 'vertical-left',
    headerTitle: defaultPreset.config.headerTitle || 'Lucide',
    headerLogo: defaultPreset.config.headerLogo || 'swirl',
    badgeColor: defaultPreset.config.badgeColor || '#DE5D53',
    badgeBgColor: defaultPreset.config.badgeBgColor || 'transparent',
    badgeScale: defaultPreset.config.badgeScale || 1,
    footerLeft: defaultPreset.config.footerLeft || 'OPEN SOURCE\nMADE WORLDWIDE',
    footerRight: defaultPreset.config.footerRight || '1600+ ICONS',
    footerCenter: defaultPreset.config.footerCenter || '',
    fontFamily: defaultPreset.config.fontFamily || 'Inter',
    textColor: defaultPreset.config.textColor || '#1A1815',
    textOpacity: defaultPreset.config.textOpacity || 0.95,
    textSize: defaultPreset.config.textSize || 20,
    letterSpacing: defaultPreset.config.letterSpacing || 2,
    selectedCategories: ['all'],
    selectedCategory: 'all',
    seed: 48291,
  };
};

function getSharedPayload() {
  try {
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('share');
    if (sharedParam) {
      const decoded = decodeShareableURL(sharedParam);
      if (decoded) {
        return decoded;
      }
    }
  } catch (e) {
    console.warn('Could not decode shared URL payload:', e);
  }
  return null;
}

function loadInitialConfig(): PosterConfig {
  const shared = getSharedPayload();
  if (shared && shared.c) {
    return shared.c;
  }

  const fallback = getDefaultConfig();
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...fallback, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Could not load saved poster config from localStorage:', err);
  }
  return fallback;
}

function loadInitialIcons(initialConfig: PosterConfig): IconGridItem[] {
  const shared = getSharedPayload();
  const cats = initialConfig.selectedCategories && initialConfig.selectedCategories.length > 0
    ? initialConfig.selectedCategories
    : initialConfig.selectedCategory ? [initialConfig.selectedCategory] : ['all'];

  const baseGrid = generateIconGrid(
    initialConfig.columns,
    initialConfig.rows,
    cats,
    initialConfig.seed,
    [],
    initialConfig.sortMode || 'shuffle'
  );

  if (shared && shared.c) {
    if (shared.i && Array.isArray(shared.i)) {
      return baseGrid.map((item, index) => {
        const custom = shared.i?.find((ci: any) => ci.id === item.id || (ci.id && ci.id.split('-')[1] === String(index)));
        if (custom) {
          return {
            ...item,
            name: custom.name || item.name,
            rotation: custom.rotation || 0,
            customColor: custom.customColor,
            isLocked: custom.isLocked || false,
          };
        }
        return item;
      });
    }
    return baseGrid;
  }

  try {
    const saved = localStorage.getItem(ICONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.length === initialConfig.columns * initialConfig.rows
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load saved icons from localStorage:', err);
  }

  return baseGrid;
}

export default function App() {
  const defaultPreset = POSTER_PRESETS[0];
  const [config, setConfig] = useState<PosterConfig>(loadInitialConfig);
  const [customPresets, setCustomPresets] = useState<PosterPreset[]>(loadInitialCustomPresets);
  const [icons, setIcons] = useState<IconGridItem[]>(() => loadInitialIcons(config));
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [isMockupOpen, setIsMockupOpen] = useState<boolean>(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);

  // Undo / Redo History States
  const [past, setPast] = useState<Array<{ config: PosterConfig; icons: IconGridItem[] }>>([]);
  const [future, setFuture] = useState<Array<{ config: PosterConfig; icons: IconGridItem[] }>>([]);
  const isTraversingHistory = useRef<boolean>(false);
  const lastHistoryTime = useRef<number>(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef<boolean>(true);

  // Track real-time stage viewport dimensions for automatic fit-to-screen
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;

    const handleResize = () => {
      if (el) {
        setStageSize({
          width: el.clientWidth,
          height: el.clientHeight,
        });
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [isSidebarCollapsed]);

  // Toggle sidebar collapse
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Show quick toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const pushToHistory = useCallback((currentConfig = config, currentIcons = icons, isContinuous = false) => {
    const now = Date.now();
    if (isContinuous && now - lastHistoryTime.current < 800) {
      return;
    }
    lastHistoryTime.current = now;
    setPast((prev) => [
      ...prev.slice(-49),
      {
        config: JSON.parse(JSON.stringify(currentConfig)),
        icons: JSON.parse(JSON.stringify(currentIcons)),
      },
    ]);
    setFuture([]);
  }, [config, icons]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    setFuture((prev) => [{ config, icons }, ...prev]);
    isTraversingHistory.current = true;
    setPast(newPast);
    setConfig(previous.config);
    setIcons(previous.icons);
    showToast('Undo action');
  }, [past, config, icons, showToast]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, { config, icons }]);
    isTraversingHistory.current = true;
    setFuture(newFuture);
    setConfig(next.config);
    setIcons(next.icons);
    showToast('Redo action');
  }, [future, config, icons, showToast]);

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isZ = e.key.toLowerCase() === 'z';
      const isY = e.key.toLowerCase() === 'y';
      const isMeta = e.metaKey || e.ctrlKey;

      if (isMeta && isZ) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (isMeta && isY) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, config, icons, undo, redo]);

  // Persist config changes automatically to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save config to localStorage:', err);
    }
  }, [config]);

  // Persist customized/locked icons changes to localStorage
  useEffect(() => {
    if (icons.length > 0) {
      try {
        localStorage.setItem(ICONS_STORAGE_KEY, JSON.stringify(icons));
      } catch (err) {
        console.warn('Failed to save icons to localStorage:', err);
      }
    }
  }, [icons]);

  // Generate or regenerate icons whenever columns, rows, categories, seed, or sortMode change
  useEffect(() => {
    // Avoid re-scrambling loaded customized grid on initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isTraversingHistory.current) {
      isTraversingHistory.current = false;
      return;
    }

    const cats = config.selectedCategories && config.selectedCategories.length > 0
      ? config.selectedCategories
      : config.selectedCategory ? [config.selectedCategory] : ['all'];

    setIcons((prev) =>
      generateIconGrid(
        config.columns,
        config.rows,
        cats,
        config.seed,
        prev,
        config.sortMode || 'shuffle'
      )
    );
  }, [config.columns, config.rows, config.selectedCategories, config.selectedCategory, config.seed, config.sortMode]);

  // Partial config updater
  const handleChangeConfig = (updates: Partial<PosterConfig>) => {
    const continuousKeys = [
      'gridGapX',
      'gridGapY',
      'paddingTop',
      'paddingBottom',
      'paddingSides',
      'iconScale',
      'strokeWidth',
      'iconOpacity',
      'textureOpacity',
      'textSize',
      'letterSpacing',
      'badgeScale'
    ];
    const isContinuous = Object.keys(updates).some(key => continuousKeys.includes(key));
    pushToHistory(config, icons, isContinuous);
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Apply a curated preset
  const handleApplyPreset = (preset: PosterPreset) => {
    pushToHistory(config, icons);
    setConfig((prev) => ({
      ...prev,
      ...preset.config,
    }));
    triggerCelebration();
    showToast(`Applied "${preset.name}" preset`);
  };

  const handleShare = () => {
    try {
      const url = encodeShareableURL(config, icons);
      navigator.clipboard.writeText(url);
      showToast('Shareable link copied to clipboard!');
      triggerCelebration();
    } catch (err) {
      showToast('Error generating share link');
    }
  };

  // Save current poster configuration as a custom preset
  const handleSaveCustomPreset = (data: { name: string; description: string; category: string }) => {
    const newPreset: PosterPreset = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim() || 'Custom Studio Preset',
      description: data.description.trim() || 'Custom composition with user typography and colors',
      category: data.category.trim() || 'Custom',
      previewBg: config.backgroundColor,
      previewFg: config.primaryIconColor,
      previewAccent: config.badgeColor || config.secondaryIconColor,
      config: { ...config },
      isCustom: true,
      createdAt: Date.now(),
    };

    setCustomPresets((prev) => {
      const updated = [newPreset, ...prev];
      try {
        localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save custom preset to localStorage', e);
      }
      return updated;
    });

    triggerCelebration();
    showToast(`Preset "${newPreset.name}" saved!`);
  };

  // Delete a custom preset
  const handleDeleteCustomPreset = (id: string) => {
    setCustomPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update localStorage', e);
      }
      return updated;
    });
    showToast('Custom preset removed');
  };

  // Export a single preset as JSON
  const handleExportPresetJSON = (preset: PosterPreset) => {
    const filename = `${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-preset.json`;
    downloadJSON(preset, filename);
    showToast(`Exported "${preset.name}" as JSON!`);
  };

  // Export all custom presets as a collection JSON
  const handleExportAllPresetsJSON = () => {
    if (customPresets.length === 0) {
      showToast('No custom presets to export');
      return;
    }
    downloadJSON(customPresets, 'lucide-custom-presets.json');
    showToast(`Exported ${customPresets.length} custom presets as JSON!`);
  };

  // Export current entire poster config and icon state as JSON
  const handleExportConfigJSON = () => {
    const payload = {
      app: 'Lucide Poster Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config,
      icons: icons.map((i) => ({
        id: i.id,
        name: i.name,
        rotation: i.rotation,
        customColor: i.customColor,
        isLocked: i.isLocked,
      })),
    };
    downloadJSON(payload, 'lucide-poster-config.json');
    showToast('Full poster config exported to JSON!');
  };

  // Import preset or collection from a JSON file
  const handleImportPresetJSON = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed) {
        showToast('Invalid JSON file');
        return;
      }

      // Check if it's an array of presets
      if (Array.isArray(parsed)) {
        const validPresets: PosterPreset[] = parsed
          .filter((p) => p && typeof p === 'object' && p.config && typeof p.config === 'object')
          .map((p) => ({
            id: p.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: p.name || 'Imported Preset',
            description: p.description || 'Imported from JSON',
            category: p.category || 'Custom',
            previewBg: p.previewBg || p.config.backgroundColor || '#FAF8F5',
            previewFg: p.previewFg || p.config.primaryIconColor || '#1A1A1A',
            previewAccent: p.previewAccent || p.config.badgeColor || '#DE5D53',
            config: p.config,
            isCustom: true,
            createdAt: p.createdAt || Date.now(),
          }));

        if (validPresets.length === 0) {
          showToast('No valid presets found in JSON file');
          return;
        }

        setCustomPresets((prev) => {
          const merged = [...validPresets, ...prev.filter((p) => !validPresets.some((vp) => vp.id === p.id))];
          try {
            localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Could not save to localStorage', e);
          }
          return merged;
        });

        // Apply first preset immediately
        handleApplyPreset(validPresets[0]);
        triggerCelebration();
        showToast(`Imported ${validPresets.length} preset(s) successfully!`);
        return;
      }

      // Check if it's a single PosterPreset object
      if (parsed.config && typeof parsed.config === 'object') {
        const importedPreset: PosterPreset = {
          id: parsed.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: parsed.name || file.name.replace(/\.json$/i, ''),
          description: parsed.description || 'Imported custom preset',
          category: parsed.category || 'Custom',
          previewBg: parsed.previewBg || parsed.config.backgroundColor || '#FAF8F5',
          previewFg: parsed.previewFg || parsed.config.primaryIconColor || '#1A1A1A',
          previewAccent: parsed.previewAccent || parsed.config.badgeColor || '#DE5D53',
          config: parsed.config,
          isCustom: true,
          createdAt: Date.now(),
        };

        setCustomPresets((prev) => {
          const updated = [importedPreset, ...prev.filter((p) => p.id !== importedPreset.id)];
          try {
            localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn('Could not save to localStorage', e);
          }
          return updated;
        });

        handleApplyPreset(importedPreset);
        triggerCelebration();
        showToast(`Preset "${importedPreset.name}" imported and applied!`);
        return;
      }

      // If it's a direct PosterConfig object
      if (parsed.columns && parsed.rows && parsed.backgroundColor) {
        const importedPreset: PosterPreset = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.json$/i, '') || 'Imported Config',
          description: 'Imported configuration file',
          category: 'Custom',
          previewBg: parsed.backgroundColor,
          previewFg: parsed.primaryIconColor || '#1A1A1A',
          previewAccent: parsed.badgeColor || '#DE5D53',
          config: parsed,
          isCustom: true,
          createdAt: Date.now(),
        };

        setCustomPresets((prev) => {
          const updated = [importedPreset, ...prev];
          try {
            localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn('Could not save to localStorage', e);
          }
          return updated;
        });

        handleApplyPreset(importedPreset);
        triggerCelebration();
        showToast(`Imported and applied "${importedPreset.name}"!`);
        return;
      }

      showToast('Unrecognized JSON preset format');
    } catch (err) {
      console.error('Error importing JSON preset:', err);
      showToast('Failed to parse JSON file');
    }
  };

  // Shuffle icon grid
  const handleShuffle = () => {
    pushToHistory(config, icons);
    const newSeed = Math.floor(Math.random() * 900000) + 10000;
    setConfig((prev) => ({ ...prev, seed: newSeed }));
    triggerCelebration();
  };

  // Reset to original default preset
  const handleResetToPreset = () => {
    pushToHistory(config, icons);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
      localStorage.removeItem(ICONS_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear localStorage on reset:', err);
    }
    const freshDefault = getDefaultConfig();
    setConfig(freshDefault);
    const cats = freshDefault.selectedCategories || ['all'];
    setIcons(generateIconGrid(freshDefault.columns, freshDefault.rows, cats, freshDefault.seed));
    triggerCelebration();
    showToast('Reset to original poster layout');
  };

  // Lock all cells
  const handleLockAll = () => {
    pushToHistory(config, icons);
    setIcons((prev) => prev.map((item) => ({ ...item, isLocked: true })));
    showToast('All icon positions locked');
  };

  // Unlock all cells
  const handleUnlockAll = () => {
    pushToHistory(config, icons);
    setIcons((prev) => prev.map((item) => ({ ...item, isLocked: false })));
    showToast('All icon positions unlocked');
  };

  const allLocked = icons.length > 0 && icons.every((item) => item.isLocked);

  // Click on a cell in the poster canvas
  const handleSelectIcon = (index: number) => {
    setSelectedCellIndex(index);
    setIsPickerOpen(true);
  };

  // Update properties of a specific cell
  const handleUpdateItem = (index: number, updated: Partial<IconGridItem>) => {
    pushToHistory(config, icons);
    setIcons((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updated };
      }
      return copy;
    });
  };

  // Reroll single cell
  const handleRerollCell = (index: number) => {
    pushToHistory(config, icons);
    const singleNewSeed = Math.floor(Math.random() * 100000);
    const fresh = generateIconGrid(1, 1, config.selectedCategory, singleNewSeed);
    if (fresh[0]) {
      handleUpdateItem(index, {
        name: fresh[0].name,
        rotation: 0,
      });
    }
  };

  // Export handlers
  const handleExportPNG = async (scale: number) => {
    if (!svgRef.current) return;
    try {
      showToast(`Generating PNG (${scale}x)...`);
      await exportAsPNG(svgRef.current, scale, `lucide-poster-${scale}x.png`);
      showToast(`PNG (${scale}x) downloaded successfully!`);
    } catch {
      showToast('Error generating PNG image');
    }
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    try {
      exportAsSVG(svgRef.current, 'lucide-poster.svg');
      showToast('Pure Vector SVG downloaded successfully!');
    } catch {
      showToast('Error exporting SVG');
    }
  };

  const handleExportPDF = async () => {
    if (!svgRef.current) return;
    try {
      showToast('Generating high-resolution PDF...');
      await exportAsPDF(svgRef.current, 'lucide-poster.pdf');
      showToast('Print-ready PDF downloaded!');
    } catch {
      showToast('Error generating PDF');
    }
  };

  const handleCopyImage = async () => {
    if (!svgRef.current) return;
    try {
      const ok = await copyImageToClipboard(svgRef.current);
      if (ok) {
        setCopySuccess(true);
        showToast('Image copied to clipboard!');
        setTimeout(() => setCopySuccess(false), 2500);
      } else {
        showToast('Automatic copy not supported by browser. Please use PNG export.');
      }
    } catch {
      showToast('Error copying image');
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, +(z - 0.15).toFixed(2)));
  const handleZoomReset = () => setZoom(1);

  // Calculate target aspect ratio container styles and dynamic screen fitting
  const { width: svgWidth, height: svgHeight } = getCanvasDimensions(config.aspectRatio);
  const posterAspectRatio = svgWidth / svgHeight;

  // Margin around poster inside the stage (responsive breathing space)
  const marginX = (stageSize.width || 800) > 1024 ? 64 : (stageSize.width || 800) > 640 ? 40 : 20;
  const marginY = (stageSize.height || 700) > 800 ? 56 : (stageSize.height || 700) > 500 ? 36 : 20;

  const availableWidth = Math.max(160, (stageSize.width || 700) - marginX * 2);
  const availableHeight = Math.max(160, (stageSize.height || 650) - marginY * 2);

  let baseFitWidth = availableWidth;
  let baseFitHeight = availableWidth / posterAspectRatio;

  if (baseFitHeight > availableHeight) {
    baseFitHeight = availableHeight;
    baseFitWidth = availableHeight * posterAspectRatio;
  }

  // Exact rendered dimensions scaled by current zoom level
  const renderWidth = Math.round(baseFitWidth * zoom);
  const renderHeight = Math.round(baseFitHeight * zoom);

  const actualIconCount =
    config.columns * config.rows -
    (config.headerPosition === 'vertical-left' && config.showSideHeader ? 3 : 0);

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white select-none">
      {/* Editorial Minimal Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 bg-[#1A1A1A] text-[#FDFCFB] text-xs font-medium shadow-[0_20px_40px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-3 duration-200 font-sans tracking-wide">
          <Check size={14} className="text-white opacity-80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Top Navbar */}
      <HeaderNav
        onShuffle={handleShuffle}
        onResetToPreset={handleResetToPreset}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={undo}
        onRedo={redo}
        onOpenMockup={() => setIsMockupOpen(true)}
        onShare={handleShare}
        onOpenPrintSettings={() => setIsPrintDialogOpen(true)}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onExportPDF={handleExportPDF}
        onCopyImage={handleCopyImage}
        copySuccess={copySuccess}
        totalIcons={actualIconCount}
        columns={config.columns}
        rows={config.rows}
        aspectRatio={config.aspectRatio}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Workspace Area: Sidebar + Canvas Stage */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden relative">
        {/* Editorial Dual-Rail Sidebar Controls */}
        <Sidebar
          config={config}
          onChangeConfig={handleChangeConfig}
          onApplyPreset={handleApplyPreset}
          customPresets={customPresets}
          onSaveCustomPreset={handleSaveCustomPreset}
          onDeleteCustomPreset={handleDeleteCustomPreset}
          onExportPresetJSON={handleExportPresetJSON}
          onImportPresetJSON={handleImportPresetJSON}
          onExportAllPresetsJSON={handleExportAllPresetsJSON}
          onExportConfigJSON={handleExportConfigJSON}
          onShuffle={handleShuffle}
          onLockAll={handleLockAll}
          onUnlockAll={handleUnlockAll}
          allLocked={allLocked}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportPDF={handleExportPDF}
          onCopyImage={handleCopyImage}
          copySuccess={copySuccess}
          totalIconsCount={actualIconCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onOpenMockup={() => setIsMockupOpen(true)}
        />

        {/* Interactive Poster Stage Preview (Warm Gallery Floor) */}
        <main
          ref={stageContainerRef}
          className="flex-1 h-full min-h-0 bg-[#F0EFED] overflow-auto flex items-center justify-center relative p-3 sm:p-6"
          style={{
            backgroundImage:
              'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Subtle Stage Header Pill */}
          <div className="absolute top-4 left-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#FDFCFB]/95 backdrop-blur border border-black/10 text-[10px] uppercase tracking-widest font-semibold text-black/60 shadow-xs rounded">
            <MousePointerClick size={12} className="opacity-70 text-black" />
            <span>Click any cell to edit icon, rotate or lock</span>
          </div>

          {/* Floating Canvas Zoom & Viewport Bar */}
          <div className="absolute bottom-4 z-20 flex items-center gap-1 px-2.5 py-1.5 bg-[#FDFCFB]/95 backdrop-blur border border-black/15 shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-full text-xs font-sans">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black rounded-full transition-colors"
              title="Zoom Out (-)"
            >
              <Minus size={13} />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-black/80 hover:text-black transition-colors rounded hover:bg-black/5"
              title="Reset to 100% (Fit to Screen)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black rounded-full transition-colors"
              title="Zoom In (+)"
            >
              <Plus size={13} />
            </button>
            <div className="w-[1px] h-3.5 bg-black/15 mx-1" />
            <button
              onClick={handleZoomReset}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-black/70 hover:text-black hover:bg-black/5 rounded transition-colors"
              title="Fit poster to screen"
            >
              <Maximize2 size={11} />
              <span>Fit</span>
            </button>
          </div>

          {/* Poster Container with Soft Archival Drop Shadow */}
          <div
            className="transition-[width,height] duration-150 ease-out flex items-center justify-center my-auto mx-auto flex-shrink-0"
            style={{
              width: `${renderWidth}px`,
              height: `${renderHeight}px`,
            }}
          >
            <div
              className="relative w-full h-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden transition-all bg-white rounded-xs"
            >
              <PosterCanvas
                ref={svgRef}
                config={config}
                icons={icons}
                selectedIndex={selectedCellIndex}
                onSelectIcon={handleSelectIcon}
                interactive={true}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Single Cell Quick Inspector / Icon Picker Modal */}
      <IconPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedItem={selectedCellIndex !== null ? icons[selectedCellIndex] || null : null}
        cellIndex={selectedCellIndex}
        onUpdateItem={handleUpdateItem}
        onRerollCell={handleRerollCell}
        primaryColor={config.primaryIconColor}
      />

      {/* 3D Mockup Modal */}
      <MockupStage
        isOpen={isMockupOpen}
        onClose={() => setIsMockupOpen(false)}
        config={config}
        svgElement={svgRef.current}
      />

      {/* Print Production Settings Dialog */}
      <PrintDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        svgElement={svgRef.current}
      />
    </div>
  );
}
