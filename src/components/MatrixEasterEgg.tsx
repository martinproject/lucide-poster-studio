import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Terminal,
  Camera,
  Zap,
  Sparkles,
  Shuffle,
} from 'lucide-react';
import { LUCIDE_FONT_GLYPHS } from '../data/lucideFontGlyphs';

// Lazy dynamic audio engine loader to prevent AudioContext initialization warnings on page load
let audioModulePromise: Promise<typeof import('../utils/matrixThemeAudio')> | null = null;
function getMatrixAudio() {
  if (!audioModulePromise) {
    audioModulePromise = import('../utils/matrixThemeAudio');
  }
  return audioModulePromise;
}

export type MatrixTheme = 'classic' | 'trinity' | 'zion' | 'agent' | 'monochrome';

interface ThemeColors {
  name: string;
  head: string;
  glow: string;
  bright: string;
  mid: string;
  dark: string;
  bgFade: string;
  accent: string;
}

const MATRIX_THEMES: Record<MatrixTheme, ThemeColors> = {
  classic: {
    name: 'Classic 1999',
    head: '#FFFFFF',
    glow: '#00FF66',
    bright: '#22C55E',
    mid: '#15803D',
    dark: '#052E16',
    bgFade: 'rgba(0, 5, 2, 0.15)',
    accent: '#00FF66',
  },
  trinity: {
    name: 'Trinity Cyan',
    head: '#FFFFFF',
    glow: '#06B6D4',
    bright: '#22D3EE',
    mid: '#0891B2',
    dark: '#083344',
    bgFade: 'rgba(0, 4, 8, 0.15)',
    accent: '#06B6D4',
  },
  zion: {
    name: 'Zion Amber',
    head: '#FFFBEB',
    glow: '#F59E0B',
    bright: '#FBBF24',
    mid: '#B45309',
    dark: '#451A03',
    bgFade: 'rgba(8, 4, 0, 0.15)',
    accent: '#F59E0B',
  },
  agent: {
    name: 'Agent Red',
    head: '#FFF1F2',
    glow: '#EF4444',
    bright: '#F87171',
    mid: '#B91C1C',
    dark: '#450A0A',
    bgFade: 'rgba(8, 0, 2, 0.15)',
    accent: '#EF4444',
  },
  monochrome: {
    name: 'Ghost Monochrome',
    head: '#FFFFFF',
    glow: '#E2E8F0',
    bright: '#CBD5E1',
    mid: '#64748B',
    dark: '#1E293B',
    bgFade: 'rgba(3, 3, 4, 0.15)',
    accent: '#F8FAFC',
  },
};

interface MatrixEasterEggProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  length: number;
  size: number;
  glyphs: string[];
  mutateCounter: number;
}

export function MatrixEasterEgg({ isOpen, onClose }: MatrixEasterEggProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const [theme, setTheme] = useState<MatrixTheme>('classic');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [density, setDensity] = useState<'normal' | 'dense' | 'hyper'>('normal');
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [stats, setStats] = useState({ columnsCount: 0, fps: 60 });
  const [typewriterText, setTypewriterText] = useState<string>('');
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Shuffle stream seed
  const handleShuffle = useCallback(() => {
    setShuffleSeed((prev) => prev + 1);
    getMatrixAudio().then((m) => m.matrixAudio.playShuffleGlitch());
  }, []);

  // Tone.js Matrix Main Title Theme Soundtrack Engine
  useEffect(() => {
    if (isOpen) {
      getMatrixAudio().then((m) => m.matrixAudio.start());
    } else {
      getMatrixAudio().then((m) => m.matrixAudio.stop());
    }

    return () => {
      getMatrixAudio().then((m) => m.matrixAudio.stop());
    };
  }, [isOpen]);

  // Typewriter effect sequence
  useEffect(() => {
    if (!isOpen) return;
    const messages = [
      'WAKE UP, NEO...',
      'THE MATRIX HAS YOU...',
      'FOLLOW THE LUCIDE CODE...',
      'NATIVE VECTOR FONT ENGINE: ALL 1,779 GLYPHS ACTIVE.',
      'PRESS [R] TO SHUFFLE • [SPACE] TO CHANGE THEME • [ESC] TO EXIT.'
    ];

    let msgIndex = 0;
    let charIndex = 0;
    let timer: NodeJS.Timeout;

    const typeNext = () => {
      const currentMsg = messages[msgIndex];
      if (charIndex < currentMsg.length) {
        setTypewriterText(currentMsg.substring(0, charIndex + 1));
        charIndex++;
        timer = setTimeout(typeNext, 45 + Math.random() * 40);
      } else {
        timer = setTimeout(() => {
          charIndex = 0;
          msgIndex = (msgIndex + 1) % messages.length;
          typeNext();
        }, 3200);
      }
    };

    typeNext();
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Main Canvas 60FPS Native Font Glyphs Rendering Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initColumns();
    };

    window.addEventListener('resize', handleResize);

    const fontSize = density === 'dense' ? 18 : density === 'hyper' ? 14 : 22;
    const colSpacing = density === 'dense' ? 22 : density === 'hyper' ? 16 : 28;
    const totalGlyphs = LUCIDE_FONT_GLYPHS.length;
    let columns: Column[] = [];

    const initColumns = () => {
      const numColumns = Math.floor(width / colSpacing);
      columns = [];

      for (let i = 0; i < numColumns; i++) {
        const length = Math.floor(Math.random() * 22) + 12;
        const glyphList: string[] = [];
        for (let j = 0; j < length; j++) {
          glyphList.push(LUCIDE_FONT_GLYPHS[Math.floor(Math.random() * totalGlyphs)]);
        }

        columns.push({
          x: i * colSpacing + colSpacing / 2,
          y: Math.random() * -height * 1.5,
          speed: (Math.random() * 3 + 2.5) * speedMultiplier,
          length,
          size: fontSize,
          glyphs: glyphList,
          mutateCounter: Math.floor(Math.random() * 20),
        });
      }
      setStats((prev) => ({ ...prev, columnsCount: numColumns }));
    };

    initColumns();

    // Frame timer for reliable real-time FPS telemetry
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const currentColors = MATRIX_THEMES[theme];

    // Clear entire canvas to pure black on start
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const render = (time: number) => {
      frameCount++;
      const elapsed = time - lastFpsUpdate;
      if (elapsed >= 500) {
        const calculatedFps = Math.round((frameCount * 1000) / elapsed);
        setStats((prev) => ({ ...prev, fps: Math.max(1, Math.min(144, calculatedFps || 60)) }));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      // 1. Semi-transparent black background fade for smooth phosphor trails
      ctx.fillStyle = currentColors.bgFade;
      ctx.fillRect(0, 0, width, height);

      // 2. Set font rendering properties once per frame
      ctx.font = `${fontSize}px "lucide", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 3. Render all cascading columns
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Random glyph mutation across all 1,779 icons
        col.mutateCounter++;
        if (col.mutateCounter > 10) {
          col.mutateCounter = 0;
          const randomIndex = Math.floor(Math.random() * col.glyphs.length);
          col.glyphs[randomIndex] = LUCIDE_FONT_GLYPHS[Math.floor(Math.random() * totalGlyphs)];
        }

        // Draw falling trail of Lucide vector glyphs
        for (let j = 0; j < col.length; j++) {
          const glyph = col.glyphs[j];
          const iconY = col.y - j * (col.size + 4);

          if (iconY < -col.size || iconY > height + col.size) continue;

          if (j === 0) {
            // Glowing bright white head glyph
            ctx.save();
            ctx.shadowColor = currentColors.glow;
            ctx.shadowBlur = 14;
            ctx.fillStyle = currentColors.head;
            ctx.fillText(glyph, col.x, iconY);
            ctx.restore();
          } else {
            let color = currentColors.dark;
            if (j < 3) {
              color = currentColors.bright;
            } else if (j < col.length * 0.6) {
              color = currentColors.mid;
            }
            ctx.fillStyle = color;
            ctx.fillText(glyph, col.x, iconY);
          }
        }

        // Advance column position
        col.y += col.speed * speedMultiplier;

        // Reset column to top once fallen off screen
        if (col.y - col.length * (col.size + 4) > height) {
          col.y = -Math.random() * 80;
          col.speed = (Math.random() * 3 + 2.5) * speedMultiplier;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, theme, speedMultiplier, density, shuffleSeed]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'm') {
        setIsSoundMuted((prev) => {
          const next = !prev;
          getMatrixAudio().then((m) => m.matrixAudio.setMuted(next));
          return next;
        });
      } else if (e.key.toLowerCase() === 'r') {
        handleShuffle();
      } else if (e.key.toLowerCase() === 'h') {
        setShowHUD((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        // Cycle theme
        const themes: MatrixTheme[] = ['classic', 'trinity', 'zion', 'agent', 'monochrome'];
        setTheme((prev) => {
          const idx = (themes.indexOf(prev) + 1) % themes.length;
          getMatrixAudio().then((m) => m.matrixAudio.playShuffleGlitch());
          return themes[idx];
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleShuffle]);

  // Screenshot capture tool
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `lucide-matrix-${theme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  const currentThemeInfo = MATRIX_THEMES[theme];

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-[#00FF66] select-none overflow-hidden font-mono">
      {/* 1. Main 60FPS Digital Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 2. Authentic CRT Scanline & Phosphor Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 3px, 6px 100%',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]"
      />

      {/* 3. Terminal Typewriter Banner (Top-Left) */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1 pointer-events-none animate-in fade-in duration-300">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: currentThemeInfo.glow }}
          />
          <span
            className="text-xs uppercase tracking-[0.25em] font-bold"
            style={{ color: currentThemeInfo.accent, textShadow: `0 0 10px ${currentThemeInfo.glow}` }}
          >
            LUCIDE DIGITAL MAINFRAME // 1.0
          </span>
        </div>
        <div
          className="text-sm sm:text-base font-bold tracking-wider max-w-xl h-6 flex items-center"
          style={{ color: currentThemeInfo.head, textShadow: `0 0 12px ${currentThemeInfo.glow}` }}
        >
          <span>{typewriterText}</span>
          <span className="w-2 h-4 ml-1 bg-current animate-pulse inline-block" />
        </div>
      </div>

      {/* 4. Top Right Close & Sound Action Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/20 bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all text-white/80 hover:text-white text-xs font-bold"
          title="Shuffle Matrix stream (R)"
        >
          <Shuffle size={14} />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = !isSoundMuted;
            setIsSoundMuted(next);
            getMatrixAudio().then((m) => {
              m.matrixAudio.setMuted(next);
              if (!next) m.matrixAudio.playShuffleGlitch();
            });
          }}
          className="p-2.5 rounded-md border border-white/20 bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all text-white/80 hover:text-white"
          title={isSoundMuted ? 'Unmute Matrix Soundtrack (M)' : 'Mute Matrix Soundtrack (M)'}
        >
          {isSoundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          type="button"
          onClick={handleCaptureSnapshot}
          className="p-2.5 rounded-md border border-white/20 bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all text-white/80 hover:text-white"
          title="Save High-Res Matrix Wallpaper Snapshot"
        >
          <Camera size={16} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-md border font-bold text-xs uppercase tracking-widest transition-all bg-black/80 hover:bg-black backdrop-blur-md"
          style={{
            borderColor: currentThemeInfo.glow,
            color: currentThemeInfo.head,
            boxShadow: `0 0 15px ${currentThemeInfo.glow}40`,
          }}
        >
          <span>Disconnect</span>
          <X size={15} />
        </button>
      </div>

      {/* 5. Bottom Interactive Controls & HUD Bar */}
      {showHUD && (
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/15 bg-black/75 backdrop-blur-lg animate-in slide-in-from-bottom-4 duration-300 text-xs">
          {/* Live telemetry */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-white/70">
            <div className="flex items-center gap-1.5">
              <Terminal size={13} style={{ color: currentThemeInfo.glow }} />
              <span>COLUMNS: {stats.columnsCount}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Zap size={13} style={{ color: currentThemeInfo.glow }} />
              <span>FPS: {stats.fps}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Sparkles size={12} />
              <span>1,779 VECTOR GLYPHS ACTIVE</span>
            </div>
          </div>

          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(Object.keys(MATRIX_THEMES) as MatrixTheme[]).map((thmKey) => {
              const thm = MATRIX_THEMES[thmKey];
              const isCurrent = theme === thmKey;
              return (
                <button
                  key={thmKey}
                  onClick={() => {
                    setTheme(thmKey);
                    getMatrixAudio().then((m) => m.matrixAudio.playShuffleGlitch());
                  }}
                  className={`px-3 py-1 rounded border text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white/20 text-white border-white shadow-xs'
                      : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
                  }`}
                  style={isCurrent ? { borderColor: thm.glow, color: thm.head } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: thm.glow }}
                  />
                  <span>{thm.name}</span>
                </button>
              );
            })}
          </div>

          {/* Density, Speed & Shuffle controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-[10px] uppercase font-bold text-white transition-colors"
              title="Shuffle Matrix stream (R)"
            >
              <Shuffle size={12} />
              <span>Shuffle</span>
            </button>

            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded border border-white/15 text-[10px]">
              {(['normal', 'dense', 'hyper'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDensity(d);
                    getMatrixAudio().then((m) => m.matrixAudio.playShuffleGlitch());
                  }}
                  className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
                    density === d ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 1.8 : prev === 1.8 ? 0.6 : 1))}
              className="px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/15 text-[10px] uppercase font-bold text-white transition-colors"
              title="Toggle rain speed"
            >
              Speed {speedMultiplier}x
            </button>
          </div>
        </div>
      )}

      {/* 6. Keyboard Shortcut Legend Hint at bottom center */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-[9px] uppercase tracking-widest text-white/30 pointer-events-none hidden md:block">
        [SPACE] Cycle Themes • [R] Shuffle • [M] Mute Sound • [H] Toggle HUD • [ESC] Return
      </div>
    </div>
  );
}
