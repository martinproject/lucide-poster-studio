import React, { forwardRef } from 'react';
import { getLucideIcon } from '../data/iconsCatalog';
import type { AspectRatio, IconGridItem, PosterConfig } from '../types';

interface PosterCanvasProps {
  config: PosterConfig;
  icons: IconGridItem[];
  selectedIndex: number | null;
  onSelectIcon?: (index: number) => void;
  interactive?: boolean;
}

// Calculate SVG base canvas dimensions from Aspect Ratio
export function getCanvasDimensions(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '3:4':
      return { width: 1200, height: 1600 };
    case '2:3':
      return { width: 1200, height: 1800 };
    case '1:1':
      return { width: 1400, height: 1400 };
    case '4:5':
      return { width: 1200, height: 1500 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '16:9':
      return { width: 1920, height: 1080 };
    case 'a4':
      return { width: 1200, height: 1697 };
    default:
      return { width: 1200, height: 1600 };
  }
}

// Official Lucide Logo Component (sourced directly from assets/logo.light.svg & assets/logo.dark.svg)
export function LucideSwirlLogo({
  size = 48,
  color = '#2D3748',
  accentColor = '#F56565',
  strokeWidth = 2,
  className = '',
}: {
  size?: number;
  color?: string;
  accentColor?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide-logo"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12C6 16.4183 9.58172 20 14 20C18.4183 20 22 16.4183 22 12C22 8.446 20.455 5.25285 18 3.05557"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12C10 14.2091 11.7909 16 14 16C16.2091 16 18 14.2091 18 12C18 7.58172 14.4183 4 10 4C5.58172 4 2 7.58172 2 12C2 15.5841 3.57127 18.8012 6.06253 21"
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PosterCanvas = forwardRef<SVGSVGElement, PosterCanvasProps>(
  ({ config, icons, selectedIndex, onSelectIcon, interactive = true }, ref) => {
    const { width, height } = getCanvasDimensions(config.aspectRatio);

    // Grid dimension calculations
    const cols = config.columns;
    const rows = config.rows;

    // Unified framing margin for all 4 sides (symmetrical encuadre)
    const margin = config.paddingSides ?? config.paddingTop ?? 56;

    // Master typography & brand controls
    const showTypography = config.showTypography !== false;
    const showHeader = showTypography && (config.showSideHeader !== false) && (config.showHeader !== false) && config.headerPosition !== 'none';
    const hasVerticalHeader = showHeader && config.headerPosition === 'vertical-left';
    const hasHorizontalHeader = showHeader && config.headerPosition === 'horizontal-top';
    const headerTopOffset = hasHorizontalHeader ? 72 : 0;

    const showFooter = showTypography && (config.showFooter !== false) && Boolean(config.footerLeft || config.footerRight || config.footerCenter);
    const footerBottomOffset = showFooter ? 60 : 0;

    // Grid bounding box with equal margins
    const gridWidth = width - margin * 2;
    const gridHeight = height - margin * 2 - headerTopOffset - footerBottomOffset;

    const totalGapX = (cols - 1) * config.gridGapX;
    const totalGapY = (rows - 1) * config.gridGapY;

    // Cell width and height calculated so the grid spans uniformly from margin to (width - margin)
    const cellWidth = Math.max(20, (gridWidth - totalGapX) / cols);
    const cellHeight = Math.max(20, (gridHeight - totalGapY) / rows);
    const cellSize = Math.min(cellWidth, cellHeight);

    // Start offsets: perfectly aligned with margin
    const startX = margin;
    const startY = margin + headerTopOffset;

    // Determine icon color based on mode and position
    const getIconColor = (col: number, row: number, item: IconGridItem): string => {
      if (item.customColor) return item.customColor;

      switch (config.iconColorMode) {
        case 'single':
          return config.primaryIconColor;
        case 'alternate':
          return (col + row) % 2 === 0 ? config.primaryIconColor : config.secondaryIconColor;
        case 'row_gradient': {
          const t = row / Math.max(1, rows - 1);
          return interpolateColor(config.primaryIconColor, config.secondaryIconColor, t);
        }
        case 'col_gradient': {
          const t = col / Math.max(1, cols - 1);
          return interpolateColor(config.primaryIconColor, config.secondaryIconColor, t);
        }
        case 'random_palette': {
          if (config.colorPalette && config.colorPalette.length > 0) {
            const hash = (col * 31 + row * 17) % config.colorPalette.length;
            return config.colorPalette[hash] || config.primaryIconColor;
          }
          return config.primaryIconColor;
        }
        case 'category': {
          const catColors: Record<string, string> = {
            technology: '#06B6D4',
            nature: '#10B981',
            design: '#EC4899',
            travel: '#3B82F6',
            food: '#F59E0B',
            tools: '#8B5CF6',
            media: '#EF4444',
            science: '#14B8A6',
            commerce: '#84CC16',
            communication: '#6366F1',
            shapes: '#F97316',
          };
          return (item.category && catColors[item.category]) || config.primaryIconColor;
        }
        default:
          return config.primaryIconColor;
      }
    };

    // Helper to interpolate between 2 hex colors
    function interpolateColor(c1: string, c2: string, factor: number): string {
      const hex = (c: string) => parseInt(c.replace('#', ''), 16);
      const num1 = hex(c1.length === 4 ? `#${c1[1]}${c1[1]}${c1[2]}${c1[2]}${c1[3]}${c1[3]}` : c1);
      const num2 = hex(c2.length === 4 ? `#${c2[1]}${c2[1]}${c2[2]}${c2[2]}${c2[3]}${c2[3]}` : c2);

      const r1 = (num1 >> 16) & 255;
      const g1 = (num1 >> 8) & 255;
      const b1 = num1 & 255;

      const r2 = (num2 >> 16) & 255;
      const g2 = (num2 >> 8) & 255;
      const b2 = num2 & 255;

      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));

      return `rgb(${r}, ${g}, ${b})`;
    }

    return (
      <svg
        ref={ref}
        id="lucide-poster-svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fontFamily: `"${config.fontFamily}", system-ui, sans-serif`,
        }}
      >
        <defs>
          {/* Background Gradients */}
          <linearGradient id="bg-linear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.backgroundColor} />
            <stop offset="100%" stopColor={config.gradientColor2} />
          </linearGradient>

          <radialGradient id="bg-radial-grad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={config.backgroundColor} />
            <stop offset="100%" stopColor={config.gradientColor2} />
          </radialGradient>

          {/* Subtle Archival Cotton Paper Texture Filter */}
          <filter id="archival-paper-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.5 0" />
            <feBlend mode="multiply" in="SourceGraphic" in2="noise" />
          </filter>

          {/* Fine Film Micro-Grain Filter */}
          <filter id="fine-grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" />
          </filter>

          {/* Dot Matrix Pattern */}
          <pattern id="dot-pattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="1.5" fill={config.primaryIconColor} fillOpacity={config.textureOpacity} />
          </pattern>

          {/* Grid Lines Pattern */}
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={config.primaryIconColor}
              strokeWidth="0.75"
              strokeOpacity={config.textureOpacity}
            />
          </pattern>

          {/* Halftone Pattern */}
          <pattern id="halftone-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="2.2" fill={config.primaryIconColor} fillOpacity={config.textureOpacity * 0.9} />
          </pattern>

          {/* Fine Linen Canvas Weave Pattern */}
          <pattern id="linen-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M 0 4 L 8 4 M 4 0 L 4 8 M 0 0 L 8 8 M 8 0 L 0 8"
              fill="none"
              stroke={config.primaryIconColor}
              strokeWidth="0.5"
              strokeOpacity={config.textureOpacity * 0.6}
            />
          </pattern>

          {/* Diagonal Engraving Lines Pattern */}
          <pattern id="lines-pattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M 0 12 L 12 0 M -3 3 L 3 -3 M 9 15 L 15 9"
              fill="none"
              stroke={config.primaryIconColor}
              strokeWidth="0.6"
              strokeOpacity={config.textureOpacity * 0.7}
            />
          </pattern>

          {/* Swiss Isometric Drafting Grid Pattern */}
          <pattern id="iso-grid-pattern" x="0" y="0" width="30" height="51.96" patternUnits="userSpaceOnUse">
            <path
              d="M 15 0 L 30 25.98 L 15 51.96 L 0 25.98 Z M 0 25.98 L 30 25.98 M 15 0 L 15 51.96"
              fill="none"
              stroke={config.primaryIconColor}
              strokeWidth="0.5"
              strokeOpacity={config.textureOpacity * 0.75}
            />
          </pattern>

          {/* Crosshatch Serigraphy Pattern */}
          <pattern id="crosshatch-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 0 0 L 10 10 M 10 0 L 0 10"
              fill="none"
              stroke={config.primaryIconColor}
              strokeWidth="0.5"
              strokeOpacity={config.textureOpacity * 0.65}
            />
          </pattern>
        </defs>

        {/* 1. Base Background Fill */}
        <g id="layer-background" data-name="Background">
          <rect
            id="background-rect"
            data-name="Background Rect"
            x="0"
            y="0"
            width={width}
            height={height}
            fill={
              config.backgroundType === 'gradient'
                ? 'url(#bg-linear-grad)'
                : config.backgroundType === 'radial'
                ? 'url(#bg-radial-grad)'
                : config.backgroundColor
            }
          />
        </g>

        {/* 2. Texture Overlay Layer */}
        {config.texture !== 'none' && (
          <g id="layer-texture" data-name="Texture Overlay">
            {config.texture === 'dots' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#dot-pattern)" />
            )}
            {config.texture === 'grid' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#grid-pattern)" />
            )}
            {config.texture === 'iso_grid' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#iso-grid-pattern)" />
            )}
            {config.texture === 'crosshatch' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#crosshatch-pattern)" />
            )}
            {config.texture === 'halftone' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#halftone-pattern)" />
            )}
            {config.texture === 'linen' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#linen-pattern)" />
            )}
            {config.texture === 'lines' && (
              <rect x="0" y="0" width={width} height={height} fill="url(#lines-pattern)" />
            )}
            {config.texture === 'paper' && (
              <rect
                x="0"
                y="0"
                width={width}
                height={height}
                filter="url(#archival-paper-filter)"
                opacity={config.textureOpacity * 1.5}
                fill={config.backgroundColor}
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
            {(config.texture === 'grain' || config.texture === 'noise') && (
              <rect
                x="0"
                y="0"
                width={width}
                height={height}
                filter="url(#fine-grain-filter)"
                opacity={config.texture === 'noise' ? config.textureOpacity * 1.6 : config.textureOpacity * 0.9}
                fill={config.primaryIconColor}
                style={{ mixBlendMode: 'overlay' }}
              />
            )}
          </g>
        )}

        {/* 3. Horizontal Top Header (if selected) */}
        {hasHorizontalHeader && (() => {
          const logoColors =
            config.logoTheme === 'original-light'
              ? { baseColor: '#2D3748', accentColor: '#F56565' }
              : config.logoTheme === 'original-dark'
              ? { baseColor: '#FFFFFF', accentColor: '#F56565' }
              : { baseColor: config.textColor, accentColor: config.badgeColor || '#DE5D53' };

          const headerLogoSize = 36;
          const headerMarginRight = headerLogoSize * (8 / 24); // 8px proportional margin
          const headerFontSize = headerLogoSize * (20 / 24); // 30px proportional font size
          const headerStrokeWidth = 2.2;

          return (
            <g
              id="poster-horizontal-header"
              data-name="Header Typography"
              transform={`translate(${margin}, ${margin})`}
            >
              <title>Header Typography</title>
              <g className="flex items-center" data-name="Header Brand">
                {config.headerLogo === 'swirl' ? (
                  <LucideSwirlLogo
                    size={headerLogoSize}
                    color={logoColors.baseColor}
                    accentColor={logoColors.accentColor}
                    strokeWidth={headerStrokeWidth}
                  />
                ) : (
                  (() => {
                    const BadgeIcon = getLucideIcon(config.headerLogo);
                    return BadgeIcon ? (
                      <BadgeIcon
                        size={headerLogoSize}
                        color={config.badgeColor}
                        strokeWidth={config.strokeWidth}
                      />
                    ) : null;
                  })()
                )}
                <text
                  x={headerLogoSize + headerMarginRight}
                  y={headerLogoSize * 0.72}
                  fill={config.textColor}
                  fillOpacity={config.textOpacity}
                  fontSize={headerFontSize}
                  fontWeight="600"
                  letterSpacing={config.letterSpacing}
                  style={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {config.headerTitle}
                </text>
              </g>
            </g>
          );
        })()}

        {/* 4. Icon Grid with Integrated Branding */}
        <g id="poster-icon-grid" data-name="Icons Grid">
          <title>Icons Grid</title>
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: cols }).map((_, col) => {
              const cellX = startX + col * (cellWidth + config.gridGapX);
              const cellY = startY + row * (cellHeight + config.gridGapY);
              const actualScale = (config.iconScale / 100) * cellSize;
              const defaultIconOffsetX = (cellWidth - actualScale) / 2;
              const defaultIconOffsetY = (cellHeight - actualScale) / 2;

              // CASE A: Top-left cell (row 0, col 0) contains the Lucide Swirl Logo
              if (hasVerticalHeader && col === 0 && row === 0) {
                const logoColors =
                  config.logoTheme === 'original-light'
                    ? { baseColor: '#2D3748', accentColor: '#F56565' }
                    : config.logoTheme === 'original-dark'
                    ? { baseColor: '#FFFFFF', accentColor: '#F56565' }
                    : { baseColor: config.textColor, accentColor: config.badgeColor || '#DE5D53' };

                return (
                  <g
                    key="branding-logo-cell"
                    id="branding-logo-cell"
                    data-name="Logo - Lucide Swirl"
                    transform={`translate(${cellX}, ${cellY})`}
                    className="cursor-default"
                  >
                    <title>Lucide Logo</title>
                    <g
                      data-name="Swirl Logo Symbol"
                      transform={`
                        translate(${defaultIconOffsetX + actualScale / 2}, ${defaultIconOffsetY + actualScale / 2})
                        scale(${config.badgeScale})
                        translate(${-actualScale / 2}, ${-actualScale / 2})
                      `}
                    >
                      {config.headerLogo === 'swirl' ? (
                        <LucideSwirlLogo
                          size={actualScale}
                          color={logoColors.baseColor}
                          accentColor={logoColors.accentColor}
                          strokeWidth={2.2}
                        />
                      ) : (
                        (() => {
                          const BadgeIcon = getLucideIcon(config.headerLogo);
                          return BadgeIcon ? (
                            <BadgeIcon
                              size={actualScale}
                              color={config.badgeColor || config.textColor}
                              strokeWidth={config.strokeWidth}
                            />
                          ) : null;
                        })()
                      )}
                    </g>
                  </g>
                );
              }

              // CASE B: Row 1, Col 0 starts the vertical "Lucide" text running downwards through row 2
              if (hasVerticalHeader && col === 0 && row === 1) {
                // Proportions matching official 36px icon / 20px font / 8px margin (8/24 ratio)
                const effectiveLogoSize = actualScale * config.badgeScale;
                const proportionalMargin = effectiveLogoSize * (8 / 24);
                const proportionalFontSize = effectiveLogoSize * (20 / 24);

                // Calculate vertical position: start below the logo by exactly proportionalMargin
                // Logo bottom edge is at startY + cellHeight / 2 + effectiveLogoSize / 2
                // Since this cell starts at cellY (startY + cellHeight + gridGapY), we offset from cellY
                const logoBottomInPoster = startY + cellHeight / 2 + effectiveLogoSize / 2;
                const textTargetTop = logoBottomInPoster + proportionalMargin;
                const textOffsetY = textTargetTop - cellY;

                return (
                  <g
                    key="branding-text-cell"
                    id="branding-text-cell"
                    data-name={`Header - ${config.headerTitle || 'Lucide'}`}
                    transform={`translate(${cellX + cellWidth / 2}, ${cellY + textOffsetY})`}
                    className="cursor-default"
                  >
                    <title>{config.headerTitle || 'Lucide'}</title>
                    <text
                      x="0"
                      y="0"
                      transform="rotate(90)"
                      fill={config.textColor}
                      fillOpacity={config.textOpacity}
                      fontSize={proportionalFontSize}
                      fontWeight="600"
                      letterSpacing={config.letterSpacing}
                      dominantBaseline="central"
                      textAnchor="start"
                      style={{
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {config.headerTitle}
                    </text>
                  </g>
                );
              }

              // CASE C: Row 2, Col 0 is part of the vertical text span
              if (hasVerticalHeader && col === 0 && row === 2) {
                return null;
              }

              // CASE D: Standard Icon Cell
              const iconIndex = hasVerticalHeader
                ? row === 0
                  ? col - 1
                  : row === 1
                  ? (cols - 1) + (col - 1)
                  : row === 2
                  ? (cols - 1) * 2 + (col - 1)
                  : (cols - 1) * 3 + (row - 3) * cols + col
                : row * cols + col;

              const item = icons[iconIndex] || {
                id: `empty-${iconIndex}`,
                name: 'Sparkles',
                rotation: 0,
              };

              const iconName = item.name || 'Icon';
              const iconComponent = getLucideIcon(iconName);
              const IconComp = iconComponent;
              const iconColor = getIconColor(col, row, item);
              const isSelected = selectedIndex === iconIndex;
              const cleanIconSlug = iconName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const cellLayerId = `cell-${iconIndex + 1}-${cleanIconSlug}`;

              return (
                <g
                  key={item.id || iconIndex}
                  id={cellLayerId}
                  data-name={`${iconName} (Cell ${iconIndex + 1})`}
                  transform={`translate(${cellX}, ${cellY})`}
                  className={interactive ? 'cursor-pointer group' : ''}
                  onClick={() => interactive && onSelectIcon && onSelectIcon(iconIndex)}
                >
                  <title>{iconName}</title>

                  {/* Selection / Hover Indicator */}
                  {interactive && (
                    <rect
                      x="0"
                      y="0"
                      width={cellWidth}
                      height={cellHeight}
                      rx="8"
                      fill={isSelected ? config.badgeColor : 'transparent'}
                      fillOpacity={isSelected ? 0.16 : 0}
                      stroke={isSelected ? config.badgeColor : 'transparent'}
                      strokeWidth={isSelected ? 2 : 0}
                      strokeDasharray={isSelected ? '4 2' : 'none'}
                      className="transition-all duration-150 group-hover:fill-current group-hover:fill-opacity-5"
                    />
                  )}

                  {/* Lock Indicator Pin */}
                  {item.isLocked && (
                    <circle
                      cx={cellWidth - 6}
                      cy={6}
                      r="3.5"
                      fill={config.badgeColor}
                      opacity="0.85"
                    />
                  )}

                  {/* Render Nested SVG for Icon with Rotation & Sizing */}
                  <g
                    id={`icon-${cleanIconSlug}-${iconIndex + 1}`}
                    data-name={iconName}
                    transform={`
                      translate(${defaultIconOffsetX + actualScale / 2}, ${defaultIconOffsetY + actualScale / 2})
                      rotate(${item.rotation || 0})
                      translate(${-actualScale / 2}, ${-actualScale / 2})
                    `}
                    opacity={config.iconOpacity}
                  >
                    <title>{iconName}</title>
                    {IconComp ? (
                      <IconComp
                        size={actualScale}
                        color={iconColor}
                        strokeWidth={config.strokeWidth}
                      />
                    ) : (
                      <svg
                        width={actualScale}
                        height={actualScale}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={iconColor}
                        strokeWidth={config.strokeWidth}
                      >
                        <circle cx="12" cy="12" r="8" stroke={iconColor} strokeWidth={config.strokeWidth} />
                      </svg>
                    )}
                  </g>
                </g>
              );
            })
          )}
        </g>

        {/* 6. Footer Layout (Swiss Poster Standard as in reference image) */}
        {showFooter && (
          <g
            id="poster-footer"
            data-name="Footer Typography"
            transform={`translate(${margin}, ${height - margin - 22})`}
          >
            <title>Footer</title>
            {/* Left Footer: Multi-line text (e.g. "OPEN SOURCE \n MADE WORLDWIDE") */}
            {config.footerLeft && (
              <text
                x="0"
                y="0"
                fill={config.textColor}
                fillOpacity={config.textOpacity}
                fontSize={config.textSize * 0.88}
                fontWeight="700"
                letterSpacing={config.letterSpacing + 0.8}
              >
                {config.footerLeft.split('\n').map((line, i) => (
                  <tspan key={i} x="0" dy={i === 0 ? 0 : config.textSize * 1.05}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}

            {/* Center Footer (Optional) */}
            {config.footerCenter && (
              <text
                x={gridWidth / 2}
                y="20"
                textAnchor="middle"
                fill={config.textColor}
                fillOpacity={config.textOpacity * 0.75}
                fontSize={config.textSize * 0.75}
                fontWeight="600"
                letterSpacing={config.letterSpacing + 1}
              >
                {config.footerCenter}
              </text>
            )}

            {/* Right Footer: Bold title (e.g. "1600+ ICONS") */}
            {config.footerRight && (
              <text
                x={gridWidth}
                y="20"
                textAnchor="end"
                fill={config.textColor}
                fillOpacity={config.textOpacity}
                fontSize={config.textSize * 1.5}
                fontWeight="800"
                letterSpacing={config.letterSpacing}
              >
                {config.footerRight}
              </text>
            )}
          </g>
        )}
      </svg>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';
