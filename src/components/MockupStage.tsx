import React, { useRef, useState } from 'react';
import type { MockupScene, PosterConfig } from '../types';
import {
  X,
  Download,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  SunMedium,
  Check,
  ZoomIn,
  ZoomOut,
  Minus,
  Plus,
} from 'lucide-react';
import { exportAsPNG, triggerCelebration } from '../utils/exportUtils';

interface MockupStageProps {
  isOpen: boolean;
  onClose: () => void;
  config: PosterConfig;
  svgElement: SVGSVGElement | null;
}

export function MockupStage({
  isOpen,
  onClose,
  config,
  svgElement,
}: MockupStageProps) {
  const [scene, setScene] = useState<MockupScene>('minimal_black');
  const [showMatte, setShowMatte] = useState<boolean>(true);
  const [showGlare, setShowGlare] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const [mockupScale, setMockupScale] = useState<number>(0.9);

  const mockupRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Scene configs
  const scenes = [
    {
      id: 'minimal_black' as MockupScene,
      name: 'Black Gallery Frame',
      bgClass: 'bg-[#E9E7E2]',
      wallTexture:
        'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.7) 0%, rgba(210,205,195,0.9) 100%)',
      frameClass: 'bg-[#181818] border-[#0F0F0F] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35),0_15px_30px_-10px_rgba(0,0,0,0.2)]',
      frameBorder: 'p-3.5 sm:p-5 rounded-xs ring-1 ring-black/30',
      description: 'Modern museum aluminum frame with depth shadow',
    },
    {
      id: 'natural_oak' as MockupScene,
      name: 'Natural Oak Wood',
      bgClass: 'bg-[#F2ECE3]',
      wallTexture:
        'linear-gradient(135deg, #FAF7F2 0%, #E6DDD0 100%)',
      frameClass: 'bg-[#D6B588] border-[#A88452] shadow-[0_35px_80px_-20px_rgba(70,50,30,0.25),0_15px_30px_-10px_rgba(70,50,30,0.15)]',
      frameBorder: 'p-4 sm:p-6 rounded-xs border-2 border-[#C29E6E]',
      description: 'Warm Scandinavian natural oak wood finish',
    },
    {
      id: 'warm_walnut' as MockupScene,
      name: 'Prestige Walnut Wood',
      bgClass: 'bg-[#EDE7DE]',
      wallTexture:
        'linear-gradient(135deg, #F5EFE6 0%, #D8CEBE 100%)',
      frameClass: 'bg-[#4E321F] border-[#331E11] shadow-[0_40px_90px_-20px_rgba(50,30,15,0.4),0_15px_30px_-10px_rgba(50,30,15,0.25)]',
      frameBorder: 'p-4 sm:p-6 rounded-xs border-4 border-[#3D2515] ring-1 ring-black/45',
      description: 'Prestige dark walnut grain with deep rich tones',
    },
    {
      id: 'aluminum_silver' as MockupScene,
      name: 'Brushed Aluminum',
      bgClass: 'bg-[#EAEAEA]',
      wallTexture:
        'linear-gradient(180deg, #F0F0F0 0%, #DBDBDB 100%)',
      frameClass: 'bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-400 border-zinc-500 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.15)]',
      frameBorder: 'p-3 sm:p-4 rounded-xs border border-zinc-400 ring-1 ring-white/40',
      description: 'Modern technical anodized silver frame',
    },
    {
      id: 'luxury_gold' as MockupScene,
      name: 'Champagne Gold',
      bgClass: 'bg-[#EAE5DC]',
      wallTexture:
        'radial-gradient(circle at 50% 20%, #FAF8F5 0%, #D4CDBF 100%)',
      frameClass: 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 border-amber-600 shadow-[0_40px_85px_-15px_rgba(40,30,10,0.3),0_15px_35px_-10px_rgba(40,30,10,0.2)]',
      frameBorder: 'p-4 sm:p-5 rounded-xs border-2 border-amber-400 ring-1 ring-amber-700/50',
      description: 'Elegantly gilded brass frame for high-end galleries',
    },
    {
      id: 'studio_gallery' as MockupScene,
      name: 'Exhibition Wall',
      bgClass: 'bg-[#DCD8D2]',
      wallTexture:
        'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8) 0%, rgba(195,190,180,0.9) 100%)',
      frameClass: 'bg-[#2B2B2B] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4),0_20px_40px_-10px_rgba(0,0,0,0.25)]',
      frameBorder: 'p-3 sm:p-4 rounded-none ring-2 ring-black/40',
      description: 'Architectural gallery spotlight with deep gallery shadow',
    },
    {
      id: 'floating_acrylic' as MockupScene,
      name: 'Floating Acrylic',
      bgClass: 'bg-[#F2F1EC]',
      wallTexture:
        'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #DFDDD6 100%)',
      frameClass: 'bg-white/40 backdrop-blur-xs shadow-[0_50px_100px_-25px_rgba(0,0,0,0.25),0_20px_45px_-10px_rgba(0,0,0,0.15)]',
      frameBorder: 'p-1 rounded-sm border border-white/80 ring-1 ring-black/5',
      description: 'Frameless glass artwork with spacer wall-mount shadows',
    },
    {
      id: 'industrial_concrete' as MockupScene,
      name: 'Concrete Block',
      bgClass: 'bg-[#D6D6D6]',
      wallTexture:
        'radial-gradient(ellipse at center, #E5E5E5 0%, #B8B8B8 100%)',
      frameClass: 'bg-[#6B6B6B] border-[#525252] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.45)]',
      frameBorder: 'p-5 sm:p-7 rounded-none border-4 border-[#5E5E5E]',
      description: 'Brutalist concrete block styling with deep borders',
    },
    {
      id: 'hanger_clip' as MockupScene,
      name: 'Minimal Binder Clips',
      bgClass: 'bg-[#F5F2EB]',
      wallTexture:
        'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #E8E2D5 100%)',
      frameClass: 'bg-transparent shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)]',
      frameBorder: 'p-0',
      description: 'Industrial studio binder clips hanging print',
    },
    {
      id: 'magazine_flat' as MockupScene,
      name: 'Editorial Flatlay',
      bgClass: 'bg-[#FAF8F5]',
      wallTexture:
        'linear-gradient(to right, #FDFDFD 0%, #EFECE6 100%)',
      frameClass: 'bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15),0_2px_10px_-3px_rgba(0,0,0,0.08)]',
      frameBorder: 'p-0.5 rounded-none',
      description: 'Studio flatlay spread table placement',
    },
  ];

  const currentScene = scenes.find((s) => s.id === scene) || scenes[0];

  // Convert svg to data url for crisp isolated preview inside mockup
  const svgMarkup = svgElement ? new XMLSerializer().serializeToString(svgElement) : '';
  const svgDataUrl = svgMarkup ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}` : '';

  const handleDownloadMockup = async () => {
    if (!svgElement) return;
    setIsExporting(true);
    try {
      // Export high-res poster with celebration
      await exportAsPNG(svgElement, 3, `lucide-poster-gallery-mockup.png`);
      triggerCelebration();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Top Bar Controls */}
      <header className="h-14 sm:h-16 bg-[#FDFCFB] border-b border-black/10 px-4 sm:px-6 flex items-center justify-between text-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1A1A1A]">3D Real-World Gallery Mockup</h2>
            <p className="text-[11px] text-black/50 hidden sm:block font-sans">
              Interactive framed archival simulation with realistic lighting & shadows
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">          
          <button
            type="button"
            onClick={handleDownloadMockup}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#FDFCFB] font-bold text-xs uppercase tracking-wider rounded shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download size={13} />
            <span>{isExporting ? 'Exporting...' : 'Download Hi-Res (300 DPI)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullView(!isFullView)}
            className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded transition-colors hidden md:flex"
            title={isFullView ? 'Standard View' : 'Full Screen Preview'}
          >
            {isFullView ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded transition-colors"
            title="Close Mockup"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Mockup Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Side: Live Framed Stage */}
        <main
          ref={mockupRef}
          className="flex-1 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: currentScene.bgClass.replace('bg-[', '').replace(']', ''),
            background: currentScene.wallTexture,
          }}
        >
          {/* Subtle Ambient Plant Shadow Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 85% 15%, rgba(0,0,0,0.5) 0%, transparent 60%)',
            }}
          />

          {/* Wall Bottom Baseboard Illusion */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/10 border-t border-black/5 pointer-events-none" />

          {/* Framed Artwork Container */}
          <div
            className={`relative h-[55vh] sm:h-[62vh] md:h-[68vh] max-w-[90vw] transition-transform duration-200 ease-out ${currentScene.frameClass} ${currentScene.frameBorder}`}
            style={{
              transform: `scale(${mockupScale})`,
              transformOrigin: 'center',
              aspectRatio:
                config.aspectRatio === '1:1'
                  ? '1/1'
                  : config.aspectRatio === '16:9'
                  ? '16/9'
                  : config.aspectRatio === '9:16'
                  ? '9/16'
                  : config.aspectRatio === '2:3'
                  ? '2/3'
                  : config.aspectRatio === '3:4'
                  ? '3/4'
                  : config.aspectRatio === '4:5'
                  ? '4/5'
                  : config.aspectRatio === 'a4'
                  ? '1200/1697'
                  : '3/4',
            }}
          >
            {/* Binder Clips on top if hanger scene */}
            {scene === 'hanger_clip' && (
              <>
                <div className="absolute -top-6 left-12 w-6 h-8 bg-zinc-800 rounded-xs shadow-md z-30 flex flex-col items-center">
                  <div className="w-1 h-3 bg-zinc-400 rounded-full mt-1" />
                  <div className="w-8 h-2 bg-zinc-700 mt-auto rounded-xs shadow-xs" />
                </div>
                <div className="absolute -top-6 right-12 w-6 h-8 bg-zinc-800 rounded-xs shadow-md z-30 flex flex-col items-center">
                  <div className="w-1 h-3 bg-zinc-400 rounded-full mt-1" />
                  <div className="w-8 h-2 bg-zinc-700 mt-auto rounded-xs shadow-xs" />
                </div>
              </>
            )}

            {/* Passe-partout / Mat Board (Acid-free Archival White Board) */}
            <div
              className={`w-full h-full transition-all flex items-center justify-center relative ${
                showMatte && scene !== 'hanger_clip' && scene !== 'magazine_flat'
                  ? 'bg-[#FAF8F5] shadow-inner border border-black/10'
                  : 'bg-transparent'
              }`}
            >
              {/* Poster Surface with Proportional Sizing */}
              <div
                className={`relative shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden bg-white transition-all duration-300 ${
                  showMatte && scene !== 'hanger_clip' && scene !== 'magazine_flat'
                    ? 'w-[84%] h-[84%] border border-black/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]'
                    : 'w-full h-full'
                }`}
              >
                {svgDataUrl ? (
                  <img
                    src={svgDataUrl}
                    alt="Poster Artwork"
                    className="w-full h-full object-cover block select-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/30 text-xs">
                    Loading Artwork...
                  </div>
                )}

                {/* Subtle Museum Art Glass Reflection Glare */}
                {showGlare && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                    style={{
                      background:
                        'linear-gradient(125deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 35%, transparent 55%, rgba(255,255,255,0.2) 100%)',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Floating Mockup Zoom & Viewport Bar */}
          <div className="absolute bottom-16 z-20 flex items-center gap-1 px-2.5 py-1.5 bg-[#FDFCFB]/95 backdrop-blur border border-black/15 shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-full text-xs font-sans">
            <button
              type="button"
              onClick={() => setMockupScale((prev) => Math.max(0.4, prev - 0.1))}
              className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black rounded-full transition-colors"
              title="Zoom Out (-)"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              onClick={() => setMockupScale(0.9)}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-black/80 hover:text-black transition-colors rounded hover:bg-black/5"
              title="Reset Zoom to 90%"
            >
              {Math.round(mockupScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setMockupScale((prev) => Math.min(1.6, prev + 0.1))}
              className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black rounded-full transition-colors"
              title="Zoom In (+)"
            >
              <Plus size={13} />
            </button>
            <div className="w-[1px] h-3.5 bg-black/15 mx-1" />
            <button
              type="button"
              onClick={() => setMockupScale(0.85)}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-black/70 hover:text-black hover:bg-black/5 rounded transition-colors"
              title="Fit mockup to screen"
            >
              <Maximize2 size={11} />
              <span>Fit</span>
            </button>
          </div>
        </main>

        {/* Right Side: Mockup Studio Customizer Bar */}
        <aside
          className={`w-full md:w-80 bg-[#FDFCFB] border-t md:border-t-0 md:border-l border-black/10 p-5 flex flex-col gap-5 text-[#1A1A1A] overflow-y-auto ${
            isFullView ? 'hidden' : 'block'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-2">
              Frame & Environment
            </span>
            <div className="grid grid-cols-2 gap-2">
              {scenes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScene(s.id)}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between gap-2 transition-all ${
                    scene === s.id
                      ? 'bg-black text-white border-black ring-1 ring-black shadow-xs'
                      : 'bg-white border-black/15 hover:border-black/30 hover:bg-black/5 text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{s.name}</span>
                    {scene === s.id && <Check size={14} className="text-amber-400" />}
                  </div>
                  <span className={`text-[10px] leading-tight ${scene === s.id ? 'text-white/70' : 'text-black/50'}`}>
                    {s.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mat Board & Lighting Toggles */}
          <div className="space-y-3 pt-3 border-t border-black/10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 block">
              Display Adjustments
            </span>

            {/* Passe-Partout Mat Toggle */}
            {scene !== 'hanger_clip' && scene !== 'magazine_flat' && (
              <label className="flex items-center justify-between p-2.5 bg-white hover:bg-black/5 rounded-lg cursor-pointer transition-colors border border-black/15">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-black/70" />
                  <div>
                    <span className="text-xs font-semibold block">Passe-Partout Mat</span>
                    <span className="text-[10px] text-black/50 font-sans">Archival white museum border</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showMatte}
                  onChange={(e) => setShowMatte(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-black"
                />
              </label>
            )}

            {/* Glass Glare Reflection Toggle */}
            <label className="flex items-center justify-between p-2.5 bg-white hover:bg-black/5 rounded-lg cursor-pointer transition-colors border border-black/15">
              <div className="flex items-center gap-2">
                <SunMedium size={14} className="text-black/70" />
                <div>
                  <span className="text-xs font-semibold block">Glass Glare Effect</span>
                  <span className="text-[10px] text-black/50 font-sans">Museum optical glass reflection</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showGlare}
                onChange={(e) => setShowGlare(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-black"
              />
            </label>            
          </div>

          {/* Poster Specifications Summary Card */}
          <div className="mt-auto p-3.5 bg-black/5 rounded-lg border border-black/10 space-y-1.5 text-[11px] text-black/60">
            <div className="flex justify-between">
              <span>Aspect Ratio:</span>
              <span className="font-mono text-black font-semibold">{config.aspectRatio}</span>
            </div>
            <div className="flex justify-between">
              <span>Matrix Grid:</span>
              <span className="font-mono text-black font-semibold">{config.columns} × {config.rows}</span>
            </div>
            <div className="flex justify-between">
              <span>Typography Font:</span>
              <span className="font-mono text-black font-semibold">{config.fontFamily}</span>
            </div>
            <div className="flex justify-between">
              <span>Texture:</span>
              <span className="font-mono text-black font-semibold">{config.texture}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
