import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar } from './GothicOrnaments';
import { DoorSurpriseModal } from './DoorSurpriseModal';

interface MysteryDoorsScreenProps {
  onBackToCake: () => void;
  onOpenMemories: () => void;
  onOpenSomethingForYou: () => void;
  onOpenOneLastSurprise: () => void;
  unlockedDoors: number[];
  onUnlockDoor: (doorId: number) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const SPIDER_LINES = [
  'Still older than me! Happy Birthday! 🕷️✨',
  'Hey! Watch the 8 legs! Tap a door! 🕸️',
  'I didn’t clean my web for this, pick a door! 🕷️',
  'Let’s relive your questionable life choices! 🕸️✨',
];

const SNAKE_LINES = [
  'Sss-someone survived another year! 👑🐍',
  'Bow to the crown—or just pick a door! ✨',
  'Choose wisely... or chaotically, as usual! 🐍',
  'My crown has more common sense than both of us! 👑',
];

export const MysteryDoorsScreen: React.FC<MysteryDoorsScreenProps> = ({
  onBackToCake,
  onOpenMemories,
  onOpenSomethingForYou,
  onOpenOneLastSurprise,
  unlockedDoors,
  onUnlockDoor,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [activeModalDoorId, setActiveModalDoorId] = useState<number | null>(null);
  const [openingDoorId, setOpeningDoorId] = useState<number | null>(null);

  // Animated Cute Cartoon Spider states
  const [spiderExcited, setSpiderExcited] = useState(false);
  const [spiderBlinking, setSpiderBlinking] = useState(false);
  const [spiderSpeech, setSpiderSpeech] = useState<string | null>(null);
  const [spiderTapCount, setSpiderTapCount] = useState(0);

  // Animated Crowned Snake states
  const [snakeExcited, setSnakeExcited] = useState(false);
  const [snakeSpeech, setSnakeSpeech] = useState<string | null>(null);
  const [snakeTapCount, setSnakeTapCount] = useState(0);

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeHeadCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSpiderBlinking(true);
      window.setTimeout(() => setSpiderBlinking(false), 180);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Choose_Your_Magical_Adventure_Doors_ad1bbd4e.png';
    img.onload = () => {
      const w = img.naturalWidth || 941;
      const h = img.naturalHeight || 1672;

      // 1. Extract Crowned Snake Head Sprite onto snakeHeadCanvasRef
      const snakeCanvas = snakeHeadCanvasRef.current;
      if (snakeCanvas) {
        const sx = Math.round(w * 0.805);
        const sy = Math.round(h * 0.238);
        const sw = Math.round(w * 0.156);
        const sh = Math.round(h * 0.080);
        snakeCanvas.width = sw;
        snakeCanvas.height = sh;
        const sCtx = snakeCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          const sData = sCtx.getImageData(0, 0, sw, sh);
          const d = sData.data;
          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const i = (y * sw + x) * 4;
              const r = d[i], g = d[i + 1], b = d[i + 2];
              const isParchmentSky =
                x < sw * 0.72 &&
                r > 228 &&
                g > 198 &&
                b > 186 &&
                r - g < 38 &&
                g - b < 24;
              if (isParchmentSky) {
                d[i + 3] = 0;
              } else {
                const edgeDist = Math.min(x, y, sw - 1 - x, sh - 1 - y);
                if (edgeDist < 6) {
                  d[i + 3] = Math.round((edgeDist / 6) * 255);
                }
              }
            }
          }
          sCtx.putImageData(sData, 0, 0);
        }
      }

      // 2. Draw main background and heal static snake snout/crown + middle door subtitle
      const bgCanvas = bgCanvasRef.current;
      if (!bgCanvas) return;
      bgCanvas.width = w;
      bgCanvas.height = h;
      const ctx = bgCanvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

      // A) Heal static Snake Snout, Crown & Tongue protruding into parchment sky
      const snX1 = Math.round(w * 0.805);
      const snX2 = Math.round(w * 0.910);
      const snY1 = Math.round(h * 0.238);
      const snY2 = Math.round(h * 0.313);
      const snW = snX2 - snX1;
      const snH = snY2 - snY1;

      const snData = ctx.getImageData(snX1, snY1, snW, snH);
      const nd = snData.data;
      for (let y = 0; y < snH; y++) {
        const leftIdx = (y * snW + 0) * 4;
        const rL = nd[leftIdx], gL = nd[leftIdx + 1], bL = nd[leftIdx + 2];
        for (let x = 1; x < snW; x++) {
          const rightDist = snW - 1 - x;
          const alpha = Math.min(1, rightDist / 12);
          const idx = (y * snW + x) * 4;
          nd[idx] = Math.round(nd[idx] * (1 - alpha) + rL * alpha);
          nd[idx + 1] = Math.round(nd[idx + 1] * (1 - alpha) + gL * alpha);
          nd[idx + 2] = Math.round(nd[idx + 2] * (1 - alpha) + bL * alpha);
        }
      }
      ctx.putImageData(snData, snX1, snY1);

      // B) Cleanly heal the small stray black marks on the left and right of the spider
      const healSmallBox = (rx1: number, ry1: number, rx2: number, ry2: number) => {
        const x1 = Math.round(w * rx1);
        const x2 = Math.round(w * rx2);
        const y1 = Math.round(h * ry1);
        const y2 = Math.round(h * ry2);
        const bw = x2 - x1;
        const bh = y2 - y1;
        const bData = ctx.getImageData(x1, y1, bw, bh);
        const bd = bData.data;
        for (let y = 0; y < bh; y++) {
          const lIdx = (y * bw + 0) * 4;
          const rIdx = (y * bw + (bw - 1)) * 4;
          for (let x = 1; x < bw - 1; x++) {
            const t = x / (bw - 1);
            const idx = (y * bw + x) * 4;
            bd[idx] = Math.round(bd[lIdx] * (1 - t) + bd[rIdx] * t);
            bd[idx + 1] = Math.round(bd[lIdx + 1] * (1 - t) + bd[rIdx + 1] * t);
            bd[idx + 2] = Math.round(bd[lIdx + 2] * (1 - t) + bd[rIdx + 2] * t);
          }
        }
        ctx.putImageData(bData, x1, y1);
      };
      healSmallBox(0.188, 0.153, 0.206, 0.165);
      healSmallBox(0.288, 0.148, 0.307, 0.160);

      // C) Cleanly heal the baked-in middle door subtitle ("A little surprise, / just for you ♡")
      // so the centered two-line subtitle renders cleanly without heart or offset
      const subX1 = Math.round(w * 0.402);
      const subX2 = Math.round(w * 0.598);
      const subY1 = Math.round(h * 0.747);
      const subY2 = Math.round(h * 0.799);
      const subW = subX2 - subX1;
      const subH = subY2 - subY1;
      const subData = ctx.getImageData(subX1, subY1, subW, subH);
      const sbd = subData.data;
      for (let y = 0; y < subH; y++) {
        const vEdge = Math.min(y, subH - 1 - y);
        const vAlpha = Math.min(1, vEdge / 5);
        const lIdx = (y * subW + 0) * 4;
        const rIdx = (y * subW + (subW - 1)) * 4;
        for (let x = 1; x < subW - 1; x++) {
          const hEdge = Math.min(x, subW - 1 - x);
          const alpha = Math.min(vAlpha, hEdge / 6);
          const t = x / (subW - 1);
          const idx = (y * subW + x) * 4;
          const ir = sbd[lIdx] * (1 - t) + sbd[rIdx] * t;
          const ig = sbd[lIdx + 1] * (1 - t) + sbd[rIdx + 1] * t;
          const ib = sbd[lIdx + 2] * (1 - t) + sbd[rIdx + 2] * t;
          sbd[idx] = Math.round(sbd[idx] * (1 - alpha) + ir * alpha);
          sbd[idx + 1] = Math.round(sbd[idx + 1] * (1 - alpha) + ig * alpha);
          sbd[idx + 2] = Math.round(sbd[idx + 2] * (1 - alpha) + ib * alpha);
        }
      }
      ctx.putImageData(subData, subX1, subY1);
    };
  }, []);

  const handleTapSpider = () => {
    soundEngine.playSparkle();
    setSpiderExcited(true);
    const nextCount = spiderTapCount + 1;
    setSpiderTapCount(nextCount);
    setSpiderSpeech(SPIDER_LINES[nextCount % SPIDER_LINES.length]);

    window.setTimeout(() => {
      setSpiderExcited(false);
    }, 900);

    window.setTimeout(() => {
      setSpiderSpeech(null);
    }, 2400);
  };

  const handleTapSnake = () => {
    soundEngine.playSparkle();
    setSnakeExcited(true);
    const nextCount = snakeTapCount + 1;
    setSnakeTapCount(nextCount);
    setSnakeSpeech(SNAKE_LINES[nextCount % SNAKE_LINES.length]);

    window.setTimeout(() => {
      setSnakeExcited(false);
    }, 950);

    window.setTimeout(() => {
      setSnakeSpeech(null);
    }, 2400);
  };

  const handleDoorClick = (doorId: number) => {
    soundEngine.playDoorOpen(doorId - 1);
    setOpeningDoorId(doorId);
    onUnlockDoor(doorId);

    window.setTimeout(() => {
      setOpeningDoorId(null);
      if (doorId === 1) {
        onOpenMemories();
      } else if (doorId === 2) {
        onOpenSomethingForYou();
      } else if (doorId === 3) {
        onOpenOneLastSurprise();
      } else {
        setActiveModalDoorId(doorId);
      }
    }, 380);
  };

  const handleCloseModal = () => {
    setActiveModalDoorId(null);
  };

  const handleSwitchDoorFromModal = (doorId: number) => {
    onUnlockDoor(doorId);
    if (doorId === 1) {
      setActiveModalDoorId(null);
      onOpenMemories();
    } else if (doorId === 2) {
      setActiveModalDoorId(null);
      onOpenSomethingForYou();
    } else if (doorId === 3) {
      setActiveModalDoorId(null);
      onOpenOneLastSurprise();
    } else {
      setActiveModalDoorId(doorId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-[#EBC8BE] overflow-hidden select-none touch-none"
    >
      {/* Soft Storybook Blush-Pink & Burgundy Ambient Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #F8E0D8 0%, #EBC7BD 52%, #CFA198 90%, #B8867E 100%)',
        }}
      />

      {/* Desktop Left & Right Storybook Accents */}
      <div className="hidden lg:flex fixed left-8 xl:left-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-80">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;Poke the spider or the snake if you want attitude, then pick a door!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          {unlockedDoors.length} / 3 UNLOCKED
        </span>
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-80">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;Our Memories, Something for You, and One Last Surprise—prepare to be roasted!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          CHOOSE YOUR DOOR
        </span>
      </div>

      {/* Main 941x1672 Storybook Scene Container */}
      <div className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[941/1672] sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(48,12,20,0.32)] sm:border sm:border-[#D9A875]/60 overflow-hidden flex items-center justify-center bg-[#F4D9D0]">
        <div className="relative w-full h-full">
          {/* Fallback base image */}
          <img
            src="/assets/aistudio/Choose_Your_Magical_Adventure_Doors_ad1bbd4e.png"
            alt="Choose your adventure — Three interactive mystery doors: Our Memories, Something for You, and One Last Surprise."
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Healed Scene Canvas */}
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Subtle Top Utility Controls */}
          <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSparkle();
                onBackToCake();
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-full bg-[#FFF3ED]/85 backdrop-blur-md border border-[#C9968B]/60 text-[#4A141E] font-serif-editorial text-xs sm:text-sm font-semibold hover:bg-[#FFF9F6] transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#6D1A28]" />
              <span>Cake</span>
            </button>

            <button
              type="button"
              onClick={onToggleMusic}
              aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-full bg-[#FFF3ED]/85 backdrop-blur-md border border-[#C9968B]/60 text-[#4A141E] font-serif-editorial text-xs sm:text-sm font-semibold hover:bg-[#FFF9F6] transition-colors cursor-pointer shadow-sm"
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#6D1A28]" />
                  <span>Melody</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#6D1A28]/70" />
                  <span>Melody</span>
                </>
              )}
            </button>
          </div>

          {/* 1. CUTE CARTOON SPIDER (Preserves original spider & web without extra line/box above) */}
          <div
            style={{
              left: '19.0%',
              top: '14.2%',
              width: '11.2%',
              height: '5.5%',
            }}
            className="absolute z-30 flex flex-col items-center"
          >
            <button
              type="button"
              onClick={handleTapSpider}
              aria-label="Tap the cute cartoon spider"
              className="relative w-full h-full cursor-pointer focus:outline-none"
            >
              {/* Subtle Blinking Eye Overlay on the Original Spider */}
              {spiderBlinking && (
                <svg
                  viewBox="0 0 36 16"
                  fill="none"
                  style={{
                    left: '28%',
                    top: '42%',
                    width: '44%',
                    height: '34%',
                  }}
                  className="absolute pointer-events-none"
                >
                  <ellipse cx="9" cy="8" rx="6.5" ry="6" fill="#2A0E14" />
                  <path
                    d="M4 8.5C6.5 6 11.5 6 14 8.5"
                    stroke="#FFF6F0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <ellipse cx="26" cy="8" rx="6.5" ry="6" fill="#2A0E14" />
                  <path
                    d="M21 8.5C23.5 6 28.5 6 31 8.5"
                    stroke="#FFF6F0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              <AnimatePresence>
                {spiderExcited && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -16, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 text-[#8B1D2C]"
                  >
                    <Sparkles className="w-4 h-4 text-[#DF9B40]" />
                    <FourPointStar size={12} color="#6D1A28" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {spiderSpeech && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-1 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none"
                >
                  {spiderSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. ANIMATED CROWNED SNAKE MOVING ITS HEAD */}
          <div
            style={{
              left: '80.5%',
              top: '23.8%',
              width: '15.6%',
              height: '8.0%',
            }}
            className="absolute z-30"
          >
            <button
              type="button"
              onClick={handleTapSnake}
              aria-label="Tap the crowned birthday snake"
              className={`relative w-full h-full cursor-pointer focus:outline-none animate-snake-sway transition-transform duration-300 ${
                snakeExcited ? 'scale-115 -rotate-8' : 'hover:scale-105'
              }`}
            >
              <canvas
                ref={snakeHeadCanvasRef}
                className="w-full h-full object-fill pointer-events-none"
              />

              <svg
                viewBox="0 0 36 28"
                fill="none"
                className={`absolute left-[2%] bottom-[8%] w-[26%] h-[32%] pointer-events-none transition-transform duration-200 ${
                  snakeExcited ? 'scale-125' : 'animate-pulse'
                }`}
              >
                <path
                  d="M28 6C19 11 14 15 11 23M16 14L7 15"
                  stroke="#BA3246"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className={`absolute left-[42%] top-[56%] w-3.5 h-2 rounded-full bg-[#E87A8E] blur-[1px] pointer-events-none transition-opacity duration-300 ${
                  snakeExcited ? 'opacity-90' : 'opacity-30'
                }`}
              />

              <div className="absolute left-[40%] top-[6%] pointer-events-none animate-star-twinkle">
                <FourPointStar size={14} color="#FFE89E" glow />
              </div>

              <AnimatePresence>
                {snakeExcited && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.5 }}
                    animate={{ opacity: 1, y: -18, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-3 left-1/3 -translate-x-1/2 pointer-events-none flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-[#F3C66F]" />
                    <FourPointStar size={12} color="#FFE89E" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {snakeSpeech && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute -left-36 sm:-left-44 top-1/2 -translate-y-1/2 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none z-40"
                >
                  {snakeSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. THREE INTERACTIVE MYSTERY DOORS */}
          {[
            {
              id: 1,
              title: 'Our Memories',
              subtitle: "Let's relive the chaos!",
              left: '2.5%',
              width: '30.5%',
              iconLeft: '17.8%',
            },
            {
              id: 2,
              title: 'Something for You',
              subtitle: 'A little surprise just for you',
              left: '34.5%',
              width: '31.0%',
              iconLeft: '50.0%',
            },
            {
              id: 3,
              title: 'One Last Surprise',
              subtitle: 'Are you ready? (Probably not.)',
              left: '67.0%',
              width: '30.5%',
              iconLeft: '82.2%',
            },
          ].map((door) => {
            const isOpening = openingDoorId === door.id;
            const isUnlocked = unlockedDoors.includes(door.id);

            return (
              <React.Fragment key={door.id}>
                <div
                  style={{ left: door.iconLeft, top: '52.2%' }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full pointer-events-none transition-all duration-500 ${
                    isOpening
                      ? 'bg-[#FFF3C4]/80 scale-150 blur-xl'
                      : isUnlocked
                      ? 'bg-[#FFE2B0]/35 blur-lg animate-pulse'
                      : 'bg-[#FFE2B0]/15 blur-md'
                  }`}
                />

                {isUnlocked && (
                  <div
                    style={{ left: door.iconLeft, top: '39.8%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 animate-star-twinkle"
                  >
                    <FourPointStar size={18} color="#FFF4C8" glow />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleDoorClick(door.id)}
                  style={{
                    left: door.left,
                    width: door.width,
                    top: '37.2%',
                    height: '44.5%',
                  }}
                  aria-label={`Open ${door.title} — ${door.subtitle}`}
                  className="group absolute z-20 rounded-t-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1A28] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.985]"
                >
                  <div
                    className={`w-full h-[80%] rounded-t-full border-2 transition-all duration-300 ${
                      isOpening
                        ? 'border-[#FFF2C2] bg-[#FFF2C2]/25 shadow-[0_0_30px_rgba(255,240,190,0.65)]'
                        : 'border-transparent group-hover:border-[#F5D090]/50 group-hover:bg-[#FFF2C2]/10'
                    }`}
                  />
                </button>
              </React.Fragment>
            );
          })}

          {/* Centered Two-Line Subtitle Beneath the Middle Door */}
          <div
            style={{ left: '50%', top: '74.8%' }}
            className="absolute -translate-x-1/2 text-center pointer-events-none select-none z-20"
          >
            <p className="font-serif-editorial italic font-medium text-[#2A0E15] text-[13.5px] sm:text-[15px] leading-[1.18] tracking-[0.005em] whitespace-nowrap">
              A little surprise
              <br />
              just for you
            </p>
            <svg
              viewBox="0 0 88 7"
              fill="none"
              className="w-[68px] sm:w-[76px] h-[5px] mx-auto mt-[1px] opacity-85"
            >
              <path
                d="M3 5.5C28 2.6 58 1.5 85 2.0"
                stroke="#2A0E15"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Interactive Modal for "Something for You" and "One Last Surprise" */}
      <DoorSurpriseModal
        doorId={activeModalDoorId}
        onClose={handleCloseModal}
        onSelectDoor={handleSwitchDoorFromModal}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
      />
    </motion.div>
  );
};
