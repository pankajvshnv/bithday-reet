import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Star, X, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar } from './GothicOrnaments';

export interface MemoryPhotoItem {
  id: number;
  title: string;
  funnyCaption: string;
  funnySubtext: string;
  tapeColor: string;
  tapeBorder: string;
  positionStyle: React.CSSProperties;
  floatClass: string;
  cropRect: { x: number; y: number; w: number; h: number };
  customPhotoUrl?: string;
}

const INITIAL_MEMORIES: MemoryPhotoItem[] = [
  {
    id: 1,
    title: 'Sunset buddies',
    funnyCaption:
      '“We came for the view, took 47 terrible blurry photos, complained about the wind, and immediately went looking for food.”',
    funnySubtext: 'Chaos Rating: 10/10 · Photography Skills: Questionable',
    tapeColor: '#DEC09B',
    tapeBorder: '#B8966E',
    positionStyle: { left: '7.5%', top: '36.2%', width: '39.5%' },
    floatClass: 'animate-polaroid-1',
    cropRect: { x: 0.125, y: 0.362, w: 0.275, h: 0.118 },
  },
  {
    id: 2,
    title: 'Brainrot sessions',
    funnyCaption:
      '“Two shared brain cells fighting for third place at 2 AM while making zero sense to normal society.”',
    funnySubtext: 'IQ Level: Room Temperature · Laughs: Uncontrollable',
    tapeColor: '#9C2632',
    tapeBorder: '#6E141E',
    positionStyle: { right: '6.5%', top: '37.0%', width: '39.5%' },
    floatClass: 'animate-polaroid-2',
    cropRect: { x: 0.605, y: 0.376, w: 0.28, h: 0.12 },
  },
  {
    id: 3,
    title: 'Partners in crime',
    funnyCaption:
      '“If one of us has a terrible idea, the other doesn’t even try to stop it—just grabs snacks and watches it unfold.”',
    funnySubtext: 'Impulse Control: 0% · Alibi Status: Verified',
    tapeColor: '#523B3C',
    tapeBorder: '#362324',
    positionStyle: { left: '6.5%', top: '55.4%', width: '39.0%' },
    floatClass: 'animate-polaroid-3',
    cropRect: { x: 0.112, y: 0.576, w: 0.275, h: 0.12 },
  },
  {
    id: 4,
    title: 'Unpaid therapists',
    funnyCaption:
      '“Pretending to be normal best friends in public for 0.5 seconds before roasting each other into oblivion.”',
    funnySubtext: 'Sanity Status: Not Found · Blackmail Archive: Full',
    tapeColor: '#EFE3D9',
    tapeBorder: '#C7B4A6',
    positionStyle: { right: '8.0%', top: '56.4%', width: '36.0%' },
    floatClass: 'animate-polaroid-4',
    cropRect: { x: 0.612, y: 0.592, w: 0.255, h: 0.112 },
  },
];

const SNAKE_MEMORY_LINES = [
  "Scroll more... there's more chaos!!",
  'Sss-so many questionable decisions! 👑🐍',
  'Zero brain cells, 100% comedy! ✨',
  'Tap a photo to read the roast caption!',
];

interface OurMemoriesScreenProps {
  onBackToDoors: () => void;
}

export const OurMemoriesScreen: React.FC<OurMemoriesScreenProps> = ({ onBackToDoors }) => {
  const [memories, setMemories] = useState<MemoryPhotoItem[]>(INITIAL_MEMORIES);
  const [croppedDefaults, setCroppedDefaults] = useState<Record<number, string>>({});
  const [selectedMemoryId, setSelectedMemoryId] = useState<number | null>(null);
  const [starredIds, setStarredIds] = useState<number[]>([1, 2, 3, 4]);

  // Spider stays completely still — only little eye glance & blink animation!
  const [spiderBlinking, setSpiderBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [spiderSparklePop, setSpiderSparklePop] = useState(false);

  // Animated Crowned Snake states
  const [snakeExcited, setSnakeExcited] = useState(false);
  const [snakeSpeech, setSnakeSpeech] = useState<string | null>(null);
  const [snakeTapIdx, setSnakeTapIdx] = useState(0);

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeHeadCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedMemory = memories.find((m) => m.id === selectedMemoryId) || null;

  // Little eye animation for the stationary spider (blinks & glances around gently)
  useEffect(() => {
    const gazes = [
      { x: 0, y: 0 },
      { x: 1.4, y: -0.6 },
      { x: 0.5, y: 1.3 },
      { x: -1.1, y: 0.4 },
      { x: 0, y: 0 },
    ];
    let step = 0;

    const gazeTimer = window.setInterval(() => {
      step = (step + 1) % gazes.length;
      setEyeOffset(gazes[step]);
      if (step % 2 === 0) {
        setSpiderBlinking(true);
        window.setTimeout(() => setSpiderBlinking(false), 160);
      }
    }, 1800);

    return () => clearInterval(gazeTimer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Our_Enchanted_Memory_Gallery_1e2007ff.png';
    img.onload = () => {
      const w = img.naturalWidth || 852;
      const h = img.naturalHeight || 1846;

      // 1. Extract the 4 default photo crops for the floating Polaroid frames
      const crops: Record<number, string> = {};
      INITIAL_MEMORIES.forEach((item) => {
        const off = document.createElement('canvas');
        const cw = Math.round(w * item.cropRect.w);
        const ch = Math.round(h * item.cropRect.h);
        off.width = cw;
        off.height = ch;
        const oCtx = off.getContext('2d');
        if (oCtx) {
          oCtx.drawImage(
            img,
            Math.round(w * item.cropRect.x),
            Math.round(h * item.cropRect.y),
            cw,
            ch,
            0,
            0,
            cw,
            ch
          );
          crops[item.id] = off.toDataURL('image/jpeg', 0.92);
        }
      });
      setCroppedDefaults(crops);

      // 2. Extract Crowned Snake Head Sprite (x: 74.5%..93.5%, y: 12.4%..19.8%)
      const snakeCanvas = snakeHeadCanvasRef.current;
      if (snakeCanvas) {
        const sx = Math.round(w * 0.745);
        const sy = Math.round(h * 0.124);
        const sw = Math.round(w * 0.19);
        const sh = Math.round(h * 0.075);
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
              const isBlushSky =
                x < sw * 0.65 &&
                r > 218 &&
                g > 180 &&
                b > 168 &&
                r - g < 44;
              if (isBlushSky) {
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

      // 3. Draw background canvas
      const bgCanvas = bgCanvasRef.current;
      if (!bgCanvas) return;
      bgCanvas.width = w;
      bgCanvas.height = h;
      const ctx = bgCanvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

      // Extract the original "Our Memories" + Crown artwork (x: 155..665, y: 242..532)
      // while masking out the top-left spider quadrant (x < 178, y < 118) so no spider pixels are copied!
      const titX = 155, titY = 242, titW = 510, titH = 290;
      const titleSprite = document.createElement('canvas');
      titleSprite.width = titW;
      titleSprite.height = titH;
      const tCtx = titleSprite.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(img, titX, titY, titW, titH, 0, 0, titW, titH);
        const tData = tCtx.getImageData(0, 0, titW, titH);
        const td = tData.data;
        for (let y = 0; y < titH; y++) {
          for (let x = 0; x < titW; x++) {
            // Exclude top-left region where the spider's right legs/body sit in the source image
            if (x < 178 && y < 118) {
              td[(y * titW + x) * 4 + 3] = 0;
              continue;
            }
            const edge = Math.min(x, y, titW - 1 - x, titH - 1 - y);
            if (edge < 14) {
              td[(y * titW + x) * 4 + 3] = Math.round((edge / 14) * 255);
            }
          }
        }
        tCtx.putImageData(tData, 0, 0);
      }

      // Helper to horizontally heal a rectangular region on the canvas
      const healRectHoriz = (rx1: number, ry1: number, rx2: number, ry2: number) => {
        const x1 = Math.max(0, Math.round(w * rx1));
        const x2 = Math.min(w - 1, Math.round(w * rx2));
        const y1 = Math.max(0, Math.round(h * ry1));
        const y2 = Math.min(h - 1, Math.round(h * ry2));
        const rw = x2 - x1;
        const rh = y2 - y1;
        if (rw <= 2 || rh <= 2) return;

        const rectData = ctx.getImageData(x1, y1, rw, rh);
        const rd = rectData.data;
        for (let y = 0; y < rh; y++) {
          const vEdge = Math.min(y, rh - 1 - y);
          const vAlpha = Math.min(1, vEdge / 8);
          const lIdx = (y * rw + 0) * 4;
          const rIdx = (y * rw + (rw - 1)) * 4;
          const rL = rd[lIdx], gL = rd[lIdx + 1], bL = rd[lIdx + 2];
          const rR = rd[rIdx], gR = rd[rIdx + 1], bR = rd[rIdx + 2];

          for (let x = 1; x < rw - 1; x++) {
            const hEdge = Math.min(x, rw - 1 - x);
            const alpha = Math.min(vAlpha, hEdge / 8);
            const t = x / (rw - 1);
            const idx = (y * rw + x) * 4;
            const ir = rL * (1 - t) + rR * t;
            const ig = gL * (1 - t) + gR * t;
            const ib = bL * (1 - t) + bR * t;
            rd[idx] = Math.round(rd[idx] * (1 - alpha) + ir * alpha);
            rd[idx + 1] = Math.round(rd[idx + 1] * (1 - alpha) + ig * alpha);
            rd[idx + 2] = Math.round(rd[idx + 2] * (1 - alpha) + ib * alpha);
          }
        }
        ctx.putImageData(rectData, x1, y1);
      };

      // Remove unwanted black vertical/diagonal marks around the spider while keeping the spider & web thread untouched
      healRectHoriz(0.091, 0.093, 0.150, 0.111);
      healRectHoriz(0.090, 0.111, 0.109, 0.118);
      healRectHoriz(0.194, 0.093, 0.240, 0.108);

      // Heal the small heart inside the top-right snake bubble
      healRectHoriz(0.818, 0.096, 0.858, 0.114);

      // Heal the center heart doodle between the Polaroids
      healRectHoriz(0.488, 0.550, 0.542, 0.586);

      // Heal the original "Our" + Crown (x: 38.0%..68.0%, y: 13.0%..19.6%) — stays far right of the spider!
      healRectHoriz(0.380, 0.130, 0.680, 0.196);

      // Heal the original "Memories" + low subtitle area (x: 17.5%..79.0%, y: 19.6%..33.6%) — starts below the spider!
      healRectHoriz(0.175, 0.196, 0.790, 0.336);

      // Draw the "Our Memories" + Crown artwork slightly smaller (82% scale) and higher up
      const scaledTitW = Math.round(titW * 0.82);
      const scaledTitH = Math.round(titH * 0.82);
      const destTitX = Math.round((w - scaledTitW) / 2 + 12);
      const destTitY = 246;
      ctx.drawImage(titleSprite, 0, 0, titW, titH, destTitX, destTitY, scaledTitW, scaledTitH);

      // Heal static Crowned Snake snout & crown (x: 74.5%..85.5%, y: 12.4%..19.5%)
      healRectHoriz(0.745, 0.124, 0.855, 0.195);

      // Softly heal the 4 static Polaroid regions (starting lower at y=0.352 so the subtitle area above is 100% clear!)
      healRectHoriz(0.055, 0.352, 0.495, 0.535);
      healRectHoriz(0.53, 0.352, 0.96, 0.548);
      healRectHoriz(0.045, 0.538, 0.475, 0.752);
      healRectHoriz(0.56, 0.552, 0.93, 0.750);
    };
  }, []);

  const handleTapSpider = () => {
    soundEngine.playSparkle();
    setSpiderBlinking(true);
    setSpiderSparklePop(true);
    window.setTimeout(() => setSpiderBlinking(false), 220);
    window.setTimeout(() => setSpiderSparklePop(false), 1100);
  };

  const handleTapSnake = () => {
    soundEngine.playSparkle();
    setSnakeExcited(true);
    const next = snakeTapIdx + 1;
    setSnakeTapIdx(next);
    setSnakeSpeech(SNAKE_MEMORY_LINES[next % SNAKE_MEMORY_LINES.length]);

    window.setTimeout(() => setSnakeExcited(false), 950);
    window.setTimeout(() => setSnakeSpeech(null), 2400);
  };

  const handleOpenMemory = (id: number) => {
    soundEngine.playSparkle();
    setSelectedMemoryId(id);
  };

  const handleStepMemory = (dir: -1 | 1) => {
    if (selectedMemoryId === null) return;
    soundEngine.playSparkle();
    const idx = memories.findIndex((m) => m.id === selectedMemoryId);
    const nextIdx = (idx + dir + memories.length) % memories.length;
    setSelectedMemoryId(memories[nextIdx].id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedMemoryId === null) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMemories((prev) =>
        prev.map((m) => (m.id === selectedMemoryId ? { ...m, customPhotoUrl: dataUrl } : m))
      );
      try {
        localStorage.setItem('birthday_custom_friendship_photo', dataUrl);
      } catch {
        // Ignore storage errors
      }
      soundEngine.playSparkle();
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-[#E8BEB4] overflow-hidden select-none touch-none"
    >
      {/* Ambient Blush-Pink & Burgundy Storybook Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #F8E0D8 0%, #E8BEB4 52%, #C9958B 90%, #AD7A70 100%)',
        }}
      />

      {/* Desktop Left & Right Storybook Accents */}
      <div className="hidden lg:flex fixed left-8 xl:left-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-80">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;A collection of questionable decisions &amp; unforgettable memories&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          DOOR I · MEMORIES
        </span>
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-80">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;Tap any floating Polaroid to enlarge it and read the roast caption!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          TAP A POLAROID
        </span>
      </div>

      {/* Main 852x1846 Reference Container (Fits 100% in 100dvh with zero scroll) */}
      <div className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[852/1846] sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(48,12,20,0.32)] sm:border sm:border-[#D9A875]/60 overflow-hidden flex items-center justify-center bg-[#F2CEC4]">
        <div className="relative w-full h-full">
          {/* Base reference artwork */}
          <img
            src="/assets/aistudio/Our_Enchanted_Memory_Gallery_1e2007ff.png"
            alt="Our Memories — A collection of questionable decisions and unforgettable memories."
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Healed Scene Canvas (Smaller "Our Memories" title, close speech bubble, clear space above Polaroids!) */}
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Clear, Unobstructed Subtitle Positioned Higher Up Above the Polaroid Photos */}
          <div
            style={{ top: '28.5%' }}
            className="absolute left-[14%] right-[14%] -translate-y-1/2 text-center pointer-events-none z-20"
          >
            <p className="font-serif-editorial italic font-medium text-[#3A141B] text-[15px] sm:text-[17px] leading-[1.22] tracking-[0.01em]">
              A collection of questionable
              <br />
              decisions &amp; unforgettable memories ✦
            </p>
          </div>

          {/* Glowing Golden Fairy String & Subtle Sparkles Behind the Floating Polaroids */}
          <svg
            viewBox="0 0 400 360"
            fill="none"
            className="absolute left-0 right-0 top-[34.5%] w-full h-[41%] pointer-events-none z-10 opacity-85"
          >
            <path
              d="M360 15C280 65 40 120 18 175C-5 230 355 245 380 295C395 325 220 345 120 340"
              stroke="url(#fairyStringGrad)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M206 186C206 196 208 199 218 201C208 203 206 206 206 216C206 206 204 203 194 201C204 199 206 196 206 186Z"
              stroke="#5A1520"
              strokeWidth="1.6"
              fill="#F5D090"
            />
            <defs>
              <linearGradient id="fairyStringGrad" x1="0" y1="0" x2="400" y2="360" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF5D6" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#FFF5D6" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FFE09E" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* =================================================================
              1. STATIONARY SPIDER WITH CUTE LITTLE EYE ANIMATION ONLY
             ================================================================= */}
          <button
            type="button"
            onClick={handleTapSpider}
            aria-label="Tap cute cartoon spider"
            style={{
              left: '8.9%',
              top: '9.5%',
              width: '17.5%',
              height: '7.4%',
            }}
            className="absolute z-30 cursor-pointer focus:outline-none"
          >
            <svg
              viewBox="0 0 44 22"
              fill="none"
              style={{
                left: '37.5%',
                top: '61.5%',
                width: '28.5%',
                height: '16.5%',
              }}
              className="absolute pointer-events-none overflow-visible"
            >
              {spiderBlinking ? (
                <>
                  <ellipse cx="10.5" cy="11.5" rx="8.5" ry="8" fill="#3B141A" />
                  <path d="M4 12C7 9 14 9 17 12" stroke="#FFF6F0" strokeWidth="2.2" strokeLinecap="round" />

                  <ellipse cx="32.5" cy="10.5" rx="8.5" ry="8" fill="#3B141A" />
                  <path d="M26 11C29 8 36 8 39 11" stroke="#FFF6F0" strokeWidth="2.2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Left Eye */}
                  <circle cx="10.5" cy="11.5" r="7.5" fill="#FFF9F5" stroke="#1E0B10" strokeWidth="1.8" />
                  <circle
                    cx={10.5 + eyeOffset.x}
                    cy={11.5 + eyeOffset.y}
                    r="4.2"
                    fill="#1E0B10"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />
                  <circle
                    cx={9.0 + eyeOffset.x * 0.7}
                    cy={9.8 + eyeOffset.y * 0.7}
                    r="1.5"
                    fill="#FFFFFF"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />

                  {/* Right Eye */}
                  <circle cx="32.5" cy="10.5" r="7.2" fill="#FFF9F5" stroke="#1E0B10" strokeWidth="1.8" />
                  <circle
                    cx={32.5 + eyeOffset.x}
                    cy={10.5 + eyeOffset.y}
                    r="4.0"
                    fill="#1E0B10"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />
                  <circle
                    cx={31.0 + eyeOffset.x * 0.7}
                    cy={8.8 + eyeOffset.y * 0.7}
                    r="1.4"
                    fill="#FFFFFF"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />
                </>
              )}
            </svg>

            <AnimatePresence>
              {spiderSparklePop && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.5 }}
                  animate={{ opacity: 1, y: -14, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-[#DF9B40]" />
                  <FourPointStar size={12} color="#6D1A28" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* =================================================================
              2. ANIMATED CROWNED SNAKE MOVING ITS HEAD (Top-Right)
             ================================================================= */}
          <div
            style={{
              left: '74.5%',
              top: '12.4%',
              width: '19.0%',
              height: '7.5%',
            }}
            className="absolute z-30"
          >
            <button
              type="button"
              onClick={handleTapSnake}
              aria-label="Tap crowned snake"
              className={`relative w-full h-full cursor-pointer focus:outline-none animate-snake-sway transition-transform duration-300 ${
                snakeExcited ? 'scale-115 -rotate-8' : 'hover:scale-105'
              }`}
            >
              <canvas
                ref={snakeHeadCanvasRef}
                className="w-full h-full object-fill pointer-events-none"
              />
              <div className="absolute left-[38%] top-[2%] pointer-events-none animate-star-twinkle">
                <FourPointStar size={13} color="#FFE89E" glow />
              </div>

              <AnimatePresence>
                {snakeExcited && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.5 }}
                    animate={{ opacity: 1, y: -16, scale: 1.15 }}
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
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -left-36 sm:-left-44 top-1/2 -translate-y-1/2 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none z-40"
                >
                  {snakeSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              3. FLOATING POLAROID FRAMES WITH GENTLE ANIMATIONS
             ================================================================= */}
          {memories.map((item) => {
            const photoSrc = item.customPhotoUrl || croppedDefaults[item.id];
            return (
              <div
                key={item.id}
                style={item.positionStyle}
                className={`absolute z-20 ${item.floatClass}`}
              >
                <button
                  type="button"
                  onClick={() => handleOpenMemory(item.id)}
                  aria-label={`View memory: ${item.title}`}
                  className="group relative w-full bg-[#FAF0E6] p-2 pb-3 sm:p-2.5 sm:pb-3.5 rounded-[4px] border border-[#8A5A52]/65 shadow-[0_10px_24px_rgba(58,18,24,0.22)] hover:shadow-[0_14px_32px_rgba(109,26,40,0.38)] transition-all duration-300 cursor-pointer focus:outline-none hover:scale-105 active:scale-95"
                >
                  <div
                    style={{
                      backgroundColor: item.tapeColor,
                      borderColor: item.tapeBorder,
                    }}
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-11 sm:w-13 h-4 sm:h-4.5 border opacity-92 shadow-xs rotate-[-2deg] pointer-events-none"
                  />

                  <div className="relative w-full aspect-[4/3.4] bg-[#4A2228] overflow-hidden border border-[#9E7168]/40">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F8E0D8] text-xs font-serif-editorial italic">
                        Memory #{item.id}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-tr from-[#6D1A28]/15 via-transparent to-[#FFF2C6]/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="mt-1.5 sm:mt-2 font-serif-editorial italic font-semibold text-[#3B171E] text-[13px] sm:text-[15px] leading-none text-center tracking-tight">
                    {item.title}
                  </p>
                </button>
              </div>
            );
          })}

          {/* Twinkling Starlight Jar Glow in Bottom-Right Corner */}
          <div
            style={{ right: '6%', bottom: '12%' }}
            className="absolute w-16 h-16 rounded-full bg-[#FFE6A3]/35 blur-xl pointer-events-none animate-pulse z-10"
          />

          {/* =================================================================
              4. BACK TO THE DOORS BUTTON
             ================================================================= */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playSparkle();
              onBackToDoors();
            }}
            aria-label="Back to the doors"
            style={{
              left: '23%',
              right: '23%',
              bottom: '3.6%',
              height: '6.2%',
            }}
            className="group absolute z-30 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D090] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            <span className="sr-only">Back to the doors</span>
            <div className="w-full h-full rounded-full border border-transparent group-hover:border-[#FFE5A8]/60 group-hover:shadow-[0_0_22px_rgba(255,228,168,0.45)] transition-all" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          ENLARGED CENTER POLAROID MODAL WITH FUNNY CAPTION UNDERNEATH
         ===================================================================== */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedMemoryId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#240B10]/80 backdrop-blur-md"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-[18%] top-[18%] animate-star-twinkle">
                <FourPointStar size={22} color="#FFE7A8" glow />
              </div>
              <div className="absolute right-[18%] top-[22%] animate-star-twinkle">
                <FourPointStar size={18} color="#FFE7A8" glow />
              </div>
              <div className="absolute left-[22%] bottom-[20%] animate-star-twinkle">
                <FourPointStar size={18} color="#FFE7A8" glow />
              </div>
              <div className="absolute right-[20%] bottom-[18%] animate-star-twinkle">
                <FourPointStar size={22} color="#FFE7A8" glow />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 24, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.86, y: 18 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[380px] flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => setSelectedMemoryId(null)}
                aria-label="Close enlarged photo"
                className="absolute -top-4 -right-2 z-30 w-10 h-10 rounded-full bg-[#5E1622] border-2 border-[#E6B875] text-[#FFF6F0] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Enlarged Polaroid Frame */}
              <div className="relative w-full bg-[#FAF2EA] p-4 pb-5 rounded-[6px] border-2 border-[#C89B8E] shadow-[0_24px_60px_rgba(20,4,8,0.65)]">
                <div
                  style={{
                    backgroundColor: selectedMemory.tapeColor,
                    borderColor: selectedMemory.tapeBorder,
                  }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 border opacity-95 shadow-sm rotate-[-1.5deg]"
                />

                <div className="relative w-full aspect-[4/3.5] bg-[#3E161E] rounded-[2px] overflow-hidden border border-[#9E7168]/45">
                  {(selectedMemory.customPhotoUrl || croppedDefaults[selectedMemory.id]) && (
                    <img
                      src={selectedMemory.customPhotoUrl || croppedDefaults[selectedMemory.id]}
                      alt={selectedMemory.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleStepMemory(-1)}
                    aria-label="Previous memory"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#2A0D13]/65 text-[#FFF5EE] border border-[#E6B875]/50 flex items-center justify-center hover:bg-[#5E1622] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepMemory(1)}
                    aria-label="Next memory"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#2A0D13]/65 text-[#FFF5EE] border border-[#E6B875]/50 flex items-center justify-center hover:bg-[#5E1622] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between px-1">
                  <h3 className="font-serif-editorial italic font-bold text-2xl sm:text-3xl text-[#3B151D]">
                    {selectedMemory.title}
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSparkle();
                      setStarredIds((prev) =>
                        prev.includes(selectedMemory.id)
                          ? prev.filter((id) => id !== selectedMemory.id)
                          : [...prev, selectedMemory.id]
                      );
                    }}
                    aria-label="Star this memory"
                    className="p-2 rounded-full hover:bg-[#F3D8D0] transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starredIds.includes(selectedMemory.id)
                          ? 'fill-[#D99B38] text-[#8B1D2C]'
                          : 'text-[#8B5D63]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Funny Caption Card Revealed Underneath */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="w-full mt-3.5 rounded-2xl p-4 sm:p-5 bg-[#FFF6F0] border-2 border-[#DFB070] shadow-[0_14px_35px_rgba(25,5,10,0.45)] text-center space-y-2.5"
              >
                <p className="font-serif-editorial italic text-lg sm:text-xl text-[#3B131B] leading-snug">
                  {selectedMemory.funnyCaption}
                </p>
                <p className="font-cinzel text-[10px] tracking-[0.15em] text-[#7A2230] font-semibold">
                  {selectedMemory.funnySubtext}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2.5 border-t border-[#6D1A28]/15">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#F5DCD4] border border-[#C9968B] text-[#4A141E] font-serif-editorial font-semibold text-xs sm:text-sm hover:bg-[#EFCBC0] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#6D1A28]" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMemoryId(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#5E1622] text-[#FFF5EE] font-serif-editorial font-semibold text-xs sm:text-sm hover:bg-[#751B2A] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Memories</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
