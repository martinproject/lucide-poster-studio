export type AspectRatio = '3:4' | '2:3' | '1:1' | '4:5' | '9:16' | '16:9' | 'a4';

export type BackgroundType = 'solid' | 'gradient' | 'radial' | 'mesh';

export type TextureType =
  | 'none'
  | 'paper'
  | 'grain'
  | 'linen'
  | 'dots'
  | 'grid'
  | 'halftone'
  | 'lines'
  | 'iso_grid'
  | 'crosshatch'
  | 'noise';

export type IconColorMode = 'single' | 'alternate' | 'row_gradient' | 'col_gradient' | 'category' | 'random_palette';

export type IconSortMode = 'shuffle' | 'alpha_asc' | 'alpha_desc' | 'complexity' | 'category_cluster';

export type HeaderPosition = 'vertical-left' | 'horizontal-top' | 'top-right' | 'center-top' | 'none';

export type MockupScene =
  | 'none'
  | 'minimal_black'
  | 'natural_oak'
  | 'studio_gallery'
  | 'hanger_clip'
  | 'magazine_flat'
  | 'warm_walnut'
  | 'aluminum_silver'
  | 'floating_acrylic'
  | 'industrial_concrete'
  | 'luxury_gold';

export interface PrintSettings {
  format: 'A1' | 'A2' | 'A3' | 'A4' | '50x70' | '70x100' | 'ArchD';
  bleedMm: number; // 0, 3, 5
  showCropMarks: boolean;
  dpi: number; // 300
}

export type FontFamily = 
  | 'Space Grotesk'
  | 'Inter'
  | 'Syne'
  | 'JetBrains Mono'
  | 'Plus Jakarta Sans'
  | 'Outfit'
  | 'DM Sans'
  | 'Playfair Display';

export interface IconGridItem {
  id: string;
  name: string;
  category?: string;
  rotation?: number; // 0, 90, 180, 270
  customColor?: string;
  isLocked?: boolean;
}

export interface PosterConfig {
  // Dimension & Grid
  aspectRatio: AspectRatio;
  columns: number;
  rows: number;
  iconScale: number; // percentage 40 - 100
  strokeWidth: number; // 0.75 to 3.5
  iconOpacity: number; // 0.1 to 1.0
  gridGapX: number; // 0 to 40
  gridGapY: number; // 0 to 40
  paddingTop: number;
  paddingBottom: number;
  paddingSides: number;

  // Background & Textures
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientColor2: string;
  gradientAngle: number;
  texture: TextureType;
  textureOpacity: number; // 0.0 to 0.5

  // Colors
  iconColorMode: IconColorMode;
  primaryIconColor: string;
  secondaryIconColor: string;
  colorPalette: string[];

  // Header / Branding
  showTypography?: boolean; // Master toggle to show/hide typography & brand
  showSideHeader: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  headerPosition: HeaderPosition;
  headerTitle: string;
  headerLogo: string; // 'swirl' | Lucide icon name
  badgeColor: string;
  badgeBgColor: string;
  badgeScale: number;
  logoTheme?: 'auto' | 'original-light' | 'original-dark' | 'custom';

  // Footer & Typography
  footerLeft: string;
  footerRight: string;
  footerCenter: string;
  fontFamily: FontFamily;
  textColor: string;
  textOpacity: number;
  textSize: number;
  letterSpacing: number; // in px or em

  // Filter, Sorting & Seed
  selectedCategories: string[]; // e.g. ['all'] or ['design', 'nature']
  selectedCategory?: string; // backwards compatibility
  sortMode?: IconSortMode;
  seed: number;
}

export interface IconCategory {
  id: string;
  label: string;
  iconName: string;
  icons: string[];
}

export interface PosterPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  previewBg: string;
  previewFg: string;
  previewAccent: string;
  config: Partial<PosterConfig>;
  isCustom?: boolean;
  createdAt?: number;
}
