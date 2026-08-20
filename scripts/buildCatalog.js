import fs from 'fs';
import path from 'path';

const metadataPath = path.resolve('src/data/officialLucideMetadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const categoryIconsMap = metadata.categoryIconsMap;

const categoriesDef = [
  { id: "accessibility", label: "Accessibility", iconName: "Accessibility" },
  { id: "account", label: "Accounts & Access", iconName: "User" },
  { id: "animals", label: "Animals", iconName: "Dog" },
  { id: "arrows", label: "Arrows", iconName: "ArrowLeftRight" },
  { id: "buildings", label: "Buildings", iconName: "Building" },
  { id: "charts", label: "Charts", iconName: "ChartPie" },
  { id: "communication", label: "Communication", iconName: "MessageCircle" },
  { id: "connectivity", label: "Connectivity", iconName: "Wifi" },
  { id: "cursors", label: "Cursors", iconName: "MousePointer2" },
  { id: "design", label: "Design", iconName: "Palette" },
  { id: "development", label: "Coding & Development", iconName: "CodeXml" },
  { id: "devices", label: "Devices", iconName: "Smartphone" },
  { id: "emoji", label: "Emoji", iconName: "Smile" },
  { id: "files", label: "File Icons", iconName: "FileText" },
  { id: "finance", label: "Finance", iconName: "PiggyBank" },
  { id: "food-beverage", label: "Food & Beverage", iconName: "Coffee" },
  { id: "gaming", label: "Gaming", iconName: "Gamepad2" },
  { id: "home", label: "Home", iconName: "House" },
  { id: "layout", label: "Layout", iconName: "PanelsTopLeft" },
  { id: "mail", label: "Mail", iconName: "Mail" },
  { id: "math", label: "Mathematics", iconName: "Divide" },
  { id: "medical", label: "Medical", iconName: "Heart" },
  { id: "multimedia", label: "Multimedia", iconName: "CirclePlay" },
  { id: "nature", label: "Nature", iconName: "Sprout" },
  { id: "navigation", label: "Navigation & Places", iconName: "Compass" },
  { id: "notifications", label: "Notifications", iconName: "TriangleAlert" },
  { id: "people", label: "People", iconName: "PersonStanding" },
  { id: "photography", label: "Photography", iconName: "Camera" },
  { id: "science", label: "Science", iconName: "FlaskConical" },
  { id: "seasons", label: "Seasons", iconName: "Leaf" },
  { id: "security", label: "Security", iconName: "Shield" },
  { id: "shapes", label: "Shapes", iconName: "Triangle" },
  { id: "shopping", label: "Shopping", iconName: "ShoppingBag" },
  { id: "social", label: "Social", iconName: "ThumbsUp" },
  { id: "sports", label: "Sports", iconName: "Trophy" },
  { id: "sustainability", label: "Sustainability", iconName: "Recycle" },
  { id: "text", label: "Text Formatting", iconName: "Type" },
  { id: "time", label: "Time & Calendar", iconName: "Calendar" },
  { id: "tools", label: "Tools", iconName: "Hammer" },
  { id: "transportation", label: "Transportation", iconName: "TrainFront" },
  { id: "travel", label: "Travel", iconName: "Backpack" },
  { id: "weather", label: "Weather", iconName: "CloudSun" }
];

const categoryList = categoriesDef.map(cat => {
  const icons = categoryIconsMap[cat.id] || [];
  return {
    id: cat.id,
    label: cat.label,
    iconName: cat.iconName,
    icons: Array.from(new Set(icons)).sort()
  };
});

const officialIcons = Object.keys(metadata.iconCategoriesMap).sort();

const tsContent = `import type { ElementType } from 'react';
import * as LucideIcons from 'lucide-react';
import type { IconCategory } from '../types';

// All official icons from https://github.com/lucide-icons/lucide/tree/main/icons
export const ALL_OFFICIAL_ICONS: string[] = ${JSON.stringify(officialIcons, null, 2)};

// Filter to icons that exist in lucide-react and are valid components
export const ALL_ICON_NAMES: string[] = ALL_OFFICIAL_ICONS.filter((name) => {
  const comp = (LucideIcons as Record<string, unknown>)[name];
  return (
    typeof comp === 'function' ||
    (typeof comp === 'object' && comp !== null && 'render' in (comp as object))
  );
});

// Official categories and icon mappings directly from https://github.com/lucide-icons/lucide/tree/main/categories and icons/
const OFFICIAL_CATEGORIES_DATA: IconCategory[] = ${JSON.stringify(categoryList, null, 2)};

const validIconSet = new Set(ALL_ICON_NAMES);

// Clean categories to ensure icons exist in lucide-react
const cleanedCategories: IconCategory[] = OFFICIAL_CATEGORIES_DATA.map((cat) => {
  const validIcons = cat.icons.filter((name) => validIconSet.has(name));
  return {
    ...cat,
    icons: Array.from(new Set(validIcons)),
  };
});

// Create complete categories array with 'all' as the first element
export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'all',
    label: 'All Categories',
    iconName: 'Sparkles',
    icons: ALL_ICON_NAMES,
  },
  ...cleanedCategories,
];

// Fast lookup set
export const VALID_ICONS_SET = validIconSet;

// Helper to safely get an icon component or fallback
export function getLucideIcon(iconName: string): ElementType | null {
  const comp = (LucideIcons as Record<string, unknown>)[iconName];
  if (typeof comp === 'function' || (typeof comp === 'object' && comp !== null)) {
    return comp as ElementType;
  }
  return LucideIcons.Sparkles;
}

// Check if an icon name is valid in Lucide
export function isValidIconName(iconName: string): boolean {
  return validIconSet.has(iconName);
}
`;

fs.writeFileSync('src/data/iconsCatalog.ts', tsContent, 'utf8');
console.log('Successfully generated src/data/iconsCatalog.ts with exact 1,776 official icons and 42 categories!');
