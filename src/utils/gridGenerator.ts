import { ALL_ICON_NAMES, ICON_CATEGORIES } from '../data/iconsCatalog';
import type { IconGridItem, IconSortMode } from '../types';

// Simple mulberry32 PRNG for deterministic seeds
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateIconGrid(
  columns: number,
  rows: number,
  categories: string[] | string,
  seed: number,
  existingItems: IconGridItem[] = [],
  sortMode: IconSortMode = 'shuffle'
): IconGridItem[] {
  const totalCells = columns * rows;
  const rng = mulberry32(seed);

  // Normalize categories array
  const catArray = Array.isArray(categories)
    ? categories
    : categories
    ? [categories]
    : ['all'];

  // Determine pool of icons
  let pool: string[] = [];
  if (catArray.length === 0 || catArray.includes('all')) {
    pool = [...ALL_ICON_NAMES];
  } else {
    const combinedSet = new Set<string>();
    for (const catId of catArray) {
      const found = ICON_CATEGORIES.find((c) => c.id === catId);
      if (found && found.icons.length > 0) {
        found.icons.forEach((name) => combinedSet.add(name));
      }
    }
    pool = combinedSet.size > 0 ? Array.from(combinedSet) : [...ALL_ICON_NAMES];
  }

  // Apply sorting or shuffling based on sortMode
  if (sortMode === 'alpha_asc') {
    pool.sort((a, b) => a.localeCompare(b));
  } else if (sortMode === 'alpha_desc') {
    pool.sort((a, b) => b.localeCompare(a));
  } else if (sortMode === 'complexity') {
    // Sort by name length & syllable/complexity heuristics
    pool.sort((a, b) => a.length - b.length || a.localeCompare(b));
  } else if (sortMode === 'category_cluster') {
    // Keep icons clustered by their category order in catalog
    // Pool already retains grouping if constructed from categories
  } else {
    // Default 'shuffle': deterministic Fisher-Yates with seed
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  const result: IconGridItem[] = [];

  // 1. Analyze existing grid icon frequencies
  const iconFrequencyMap: Record<string, number> = {};
  existingItems.forEach((item) => {
    if (item.name) {
      iconFrequencyMap[item.name] = (iconFrequencyMap[item.name] || 0) + 1;
    }
  });

  const uniqueIconsCount = Object.keys(iconFrequencyMap).length;
  // Check if grid is 100% uniform (e.g. user set a single icon across 100% of the poster)
  const isUniformGrid = uniqueIconsCount === 1 && existingItems.length > 0;
  const uniformIconName = isUniformGrid ? existingItems[0].name : null;

  for (let index = 0; index < totalCells; index++) {
    const existing = existingItems[index];

    // If existing item is locked, preserve it completely
    if (existing && existing.isLocked) {
      result.push(existing);
      continue;
    }

    // If previous grid was 100% uniform (same icon everywhere), keep that icon for newly created cells
    if (uniformIconName) {
      result.push({
        id: existing?.id || `cell-${index}-${Math.floor(rng() * 100000)}`,
        name: uniformIconName,
        category: existing?.category,
        rotation: existing ? existing.rotation || 0 : 0,
        customColor: existing ? existing.customColor : undefined,
        isLocked: existing ? Boolean(existing.isLocked) : false,
      });
      continue;
    }

    // If cell already existed in the previous grid layout, keep its customized icon
    if (existing) {
      result.push({
        id: existing.id || `cell-${index}-${Math.floor(rng() * 100000)}`,
        name: existing.name,
        category: existing.category,
        rotation: existing.rotation || 0,
        customColor: existing.customColor,
        isLocked: Boolean(existing.isLocked),
      });
      continue;
    }

    // Pick icon from pool with wrapping for new expanded cells
    const iconIndex = index % pool.length;
    const name = pool[iconIndex] || 'Sparkles';

    // Identify primary category if possible
    const itemCategory = catArray.length === 1 && catArray[0] !== 'all' ? catArray[0] : undefined;

    result.push({
      id: `cell-${index}-${Math.floor(rng() * 100000)}`,
      name: name,
      category: itemCategory,
      rotation: 0,
      customColor: undefined,
      isLocked: false,
    });
  }

  return result;
}
