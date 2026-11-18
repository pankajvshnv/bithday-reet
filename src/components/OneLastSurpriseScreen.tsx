import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Crown,
  Gift,
  Upload,
  RefreshCw,
  Camera,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar, GothicDivider } from './GothicOrnaments';

interface OneLastSurpriseScreenProps {
  onBackToDoors: () => void;
}

const SPIDER_IDLE_LINES = [
  'Go on, tap the gift box! Don’t be scared! 🕷️✨',
  'I helped wrap this with 8 legs of pure chaos! 🕸️🎁',
  'Are you ready for the grand finale?! 🕷️🔥',
  'Click the box before I open it myself! 🕷️👀',
];

const SPIDER_EXCITED_LINES = [
  'BOOM!! Look at that legendary photo! 🕷️🎉✨',
  'Live your life, your rules! Travel everywhere! 🕷️🌍',
  'Prove everyone wrong, chaos champion! 🕷️👑',
];

const SNAKE_IDLE_LINES = [
  'Sss-something legendary is inside that box! 👑🐍',
  'The grand finale awaits... tap the gift! ✨🎁',
  'Even my royal crown is excited for this one! 👑🐍',
  'Tap the box and unleash the magic! 🐍✨',
];

const SNAKE_EXCITED_LINES = [
  'Sss-spectacular! Unstoppable energy! 👑🐍🎉',
  'Your life, your rules! Nothing can stop you! 👑✨',
  'Certified legend status unlocked! 🐍🏆',
];

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotateEnd: number;
  driftX: number;
  shape: 'rect' | 'circle' | 'star';
}

const CONFETTI_COLORS = [
  '#F6C868', // Warm Gold
  '#F4B8C4', // Blush Pink
  '#A62438', // Royal Burgundy
  '#FFF5E4', // Vintage Cream
  '#E88372', // Warm Coral
  '#FFD97D', // Starlight Gold
  '#C97A9E', // Dusty Rose
];

const FRIENDSHIP_PHOTO_CROPS = [
  {
    id: 1,
    label: 'Adventure & Horizons ✦',
    rect: { x: 0.125, y: 0.362, w: 0.275, h: 0.118 },
  },
  {
    id: 2,
    label: 'Partners in Chaos ✦',
    rect: { x: 0.112, y: 0.576, w: 0.275, h: 0.12 },
  },
  {
    id: 3,
    label: 'Brainrot Chronicles ✦',
    rect: { x: 0.605, y: 0.376, w: 0.28, h: 0.12 },
  },
];

export const OneLastSurpriseScreen: React.FC<OneLastSurpriseScreenProps> = ({
  onBackToDoors,
}) => {
  const [stage, setStage] = useState<'closed' | 'opening' | 'revealed' | 'secret'>('closed');
  const [giftBoxSpriteSrc, setGiftBoxSpriteSrc] = useState<string | null>(null);
  const [friendshipPhotos, setFriendshipPhotos] = useState<string[]>([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('birthday_custom_friendship_photo');
    } catch {
      return null;
    }
  });

  // Confetti burst state
  const [confettiBurstKey, setConfettiBurstKey] = useState<number>(0);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  // Final secret surprise crown state
  const [chaosCrownClaimed, setChaosCrownClaimed] = useState(false);

  // Spider & Crowned Snake states
  const [spiderBlinking, setSpiderBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [spiderExcited, setSpiderExcited] = useState(false);
  const [spiderSpeech, setSpiderSpeech] = useState<string | null>(null);
  const [spiderTapCount, setSpiderTapCount] = useState(0);

  const [snakeExcited, setSnakeExcited] = useState(false);
  const [snakeSpeech, setSnakeSpeech] = useState<string | null>(null);
  const [snakeTapCount, setSnakeTapCount] = useState(0);

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeHeadCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate colourful confetti and floating stars burst
  const triggerConfettiAndStars = () => {
    const pieces: ConfettiPiece[] = Array.from({ length: 46 }).map((_, idx) => ({
      id: idx,
      left: `${5 + ((idx * 19) % 90)}%`,
      color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
      size: 7 + (idx % 5) * 2.5,
      delay: (idx % 9) * 0.05,
      duration: 2.3 + (idx % 5) * 0.45,
      rotateEnd: (idx % 2 === 0 ? 1 : -1) * (240 + (idx % 4) * 90),
      driftX: (idx % 2 === 0 ? 1 : -1) * (15 + (idx % 6) * 10),
      shape: idx % 4 === 0 ? 'star' : idx % 3 === 0 ? 'circle' : 'rect',
    }));
    setConfettiPieces(pieces);
    setConfettiBurstKey((prev) => prev + 1);
  };

  // Little eye animation for the cute cartoon spider
  useEffect(() => {
    const gazes = [
      { x: 0, y: 0 },
      { x: 1.4, y: 0.9 },
      { x: -1.2, y: 0.7 },
      { x: 0.7, y: -0.8 },
      { x: 0, y: 0 },
    ];
    let step = 0;
    const timer = window.setInterval(() => {
      step = (step + 1) % gazes.length;
      setEyeOffset(gazes[step]);
      if (step % 2 === 0) {
        setSpiderBlinking(true);
        window.setTimeout(() => setSpiderBlinking(false), 160);
      }
    }, 1850);
    return () => clearInterval(timer);
  }, []);

  // Load default friendship photos from Our_Enchanted_Memory_Gallery_1e2007ff.png
  useEffect(() => {
    const memImg = new Image();
    memImg.crossOrigin = 'anonymous';
    memImg.src = '/assets/aistudio/Our_Enchanted_Memory_Gallery_1e2007ff.png';
    memImg.onload = () => {
      const mw = memImg.naturalWidth || 852;
      const mh = memImg.naturalHeight || 1846;
      const extracted: string[] = [];

      FRIENDSHIP_PHOTO_CROPS.forEach((crop) => {
        const off = document.createElement('canvas');
        const cw = Math.round(mw * crop.rect.w);
        const ch = Math.round(mh * crop.rect.h);
        off.width = cw;
        off.height = ch;
        const oCtx = off.getContext('2d');
        if (oCtx) {
          oCtx.drawImage(
            memImg,
            Math.round(mw * crop.rect.x),
            Math.round(mh * crop.rect.y),
            cw,
            ch,
            0,
            0,
            cw,
            ch
          );
          extracted.push(off.toDataURL('image/jpeg', 0.92));
        }
      });

      if (extracted.length > 0) {
        setFriendshipPhotos(extracted);
      }
    };
  }, []);

  // Load main background, heal baked-in hearts, extract Crowned Snake Head & existing Gift Box design
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/One_Last_Magical_Birthday_Surprise_85592e8a.png';
    img.onload = () => {
      const w = img.naturalWidth || 941;
      const h = img.naturalHeight || 1672;

      // 1. Extract Crowned Snake Head Sprite (x: 76.5%..95.5%, y: 12.2%..20.5%)
      const snakeCanvas = snakeHeadCanvasRef.current;
      if (snakeCanvas) {
        const sx = Math.round(w * 0.765);
        const sy = Math.round(h * 0.122);
        const sw = Math.round(w * 0.19);
        const sh = Math.round(h * 0.083);
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
              const r = d[i],
                g = d[i + 1],
                b = d[i + 2];
              // Remove dark background pixels around the light cream/blush snake head
              const isDarkBg = r < 95 && g < 55 && b < 62 && x < sw * 0.68;
              if (isDarkBg) {
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

      // 2. Draw background canvas and heal baked-in hearts
      const bgCanvas = bgCanvasRef.current;
      if (!bgCanvas) return;
      bgCanvas.width = w;
      bgCanvas.height = h;
      const ctx = bgCanvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

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
          const lIdx = (y * rw + 0) * 4;
          const rIdx = (y * rw + (rw - 1)) * 4;
          const rL = rd[lIdx],
            gL = rd[lIdx + 1],
            bL = rd[lIdx + 2];
          const rR = rd[rIdx],
            gR = rd[rIdx + 1],
            bR = rd[rIdx + 2];

          for (let x = 1; x < rw - 1; x++) {
            const t = x / (rw - 1);
            const idx = (y * rw + x) * 4;
            rd[idx] = Math.round(rL * (1 - t) + rR * t);
            rd[idx + 1] = Math.round(gL * (1 - t) + gR * t);
            rd[idx + 2] = Math.round(bL * (1 - t) + bR * t);
          }
        }
        ctx.putImageData(rectData, x1, y1);
      };

      // A) Heal small heart near the snake's snout (x: 73.2%..76.8%, y: 15.8%..18.3%)
      healRectHoriz(0.732, 0.158, 0.768, 0.183);

      // B) Heal small heart on the "For You" gift box tag (x: 67.4%..71.2%, y: 57.9%..60.5%)
      healRectHoriz(0.674, 0.579, 0.712, 0.605);

      // C) Heal heart at the end of "Happy Birthday, Aryan" (x: 69.0%..73.8%, y: 89.3%..93.0%)
      healRectHoriz(0.69, 0.893, 0.738, 0.93);

      // 3. Extract the healed Gift Box Sprite (preserving the exact gift box design)
      const gbx = Math.round(w * 0.205);
      const gby = Math.round(h * 0.4);
      const gbw = Math.round(w * 0.58);
      const gbh = Math.round(h * 0.328);
      const gbCanvas = document.createElement('canvas');
      gbCanvas.width = gbw;
      gbCanvas.height = gbh;
      const gbCtx = gbCanvas.getContext('2d');
      if (gbCtx) {
        gbCtx.drawImage(bgCanvas, gbx, gby, gbw, gbh, 0, 0, gbw, gbh);
        const gbData = gbCtx.getImageData(0, 0, gbw, gbh);
        const gbd = gbData.data;
        for (let y = 0; y < gbh; y++) {
          for (let x = 0; x < gbw; x++) {
            const nx = (x - gbw * 0.5) / (gbw * 0.5);
            const ny = (y - gbh * 0.5) / (gbh * 0.5);
            const dist = Math.sqrt(nx * nx + ny * ny);
            if (dist > 0.96) {
              gbd[(y * gbw + x) * 4 + 3] = 0;
            } else if (dist > 0.76) {
              const fade = 1 - (dist - 0.76) / 0.2;
              gbd[(y * gbw + x) * 4 + 3] = Math.round(fade * fade * 255);
            }
          }
        }
        gbCtx.putImageData(gbData, 0, 0);
        setGiftBoxSpriteSrc(gbCanvas.toDataURL('image/png'));
      }
    };
  }, []);

  const handleTapSpider = () => {
    soundEngine.playSparkle();
    setSpiderBlinking(true);
    setSpiderExcited(true);
    const next = spiderTapCount + 1;
    setSpiderTapCount(next);
    const lines = stage === 'closed' ? SPIDER_IDLE_LINES : SPIDER_EXCITED_LINES;
    setSpiderSpeech(lines[next % lines.length]);
    window.setTimeout(() => setSpiderBlinking(false), 220);
    window.setTimeout(() => setSpiderExcited(false), 950);
    window.setTimeout(() => setSpiderSpeech(null), 2800);
  };

  const handleTapSnake = () => {
    soundEngine.playSparkle();
    setSnakeExcited(true);
    const next = snakeTapCount + 1;
    setSnakeTapCount(next);
    const lines = stage === 'closed' ? SNAKE_IDLE_LINES : SNAKE_EXCITED_LINES;
    setSnakeSpeech(lines[next % lines.length]);
    window.setTimeout(() => setSnakeExcited(false), 950);
    window.setTimeout(() => setSnakeSpeech(null), 2800);
  };

  const handleClickGiftBox = () => {
    if (stage !== 'closed') return;

    // 1. Play smooth opening sound + excited companion reactions
    soundEngine.playTreasureFanfare();
    setStage('opening');
    setSpiderExcited(true);
    setSnakeExcited(true);
    setSpiderSpeech('IT’S OPENING!! Hold onto your snacks! 🕷️🎉✨');
    setSnakeSpeech('Sss-surprise incoming! Prepare yourself! 👑🐍');

    // 2. Transition to revealed state with confetti, stars, Polaroid & caption
    window.setTimeout(() => {
      soundEngine.playCandleBlow();
      triggerConfettiAndStars();
      setStage('revealed');
      setSpiderSpeech(SPIDER_EXCITED_LINES[0]);
      setSnakeSpeech(SNAKE_EXCITED_LINES[0]);
    }, 820);

    window.setTimeout(() => {
      setSpiderExcited(false);
      setSnakeExcited(false);
    }, 2400);

    window.setTimeout(() => {
      setSpiderSpeech(null);
      setSnakeSpeech(null);
    }, 4500);
  };

  const handleOpenFinalSecret = () => {
    soundEngine.playTreasureFanfare();
    triggerConfettiAndStars();
    setStage('secret');
    setSpiderExcited(true);
    setSnakeExcited(true);
    setSpiderSpeech('The final secret truth is out! Happy Birthday! 🕷️👑');
    setSnakeSpeech('Long live the reigning champion of chaos! 👑🐍✨');

    window.setTimeout(() => {
      setSpiderExcited(false);
      setSnakeExcited(false);
    }, 1800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomPhotoUrl(dataUrl);
      try {
        localStorage.setItem('birthday_custom_friendship_photo', dataUrl);
      } catch {
        // Ignore storage quota errors
      }
      soundEngine.playSparkle();
    };
    reader.readAsDataURL(file);
  };

  const handleCyclePhoto = () => {
    soundEngine.playSparkle();
    if (customPhotoUrl) {
      setCustomPhotoUrl(null);
      setActivePhotoIdx(0);
    } else if (friendshipPhotos.length > 0) {
      setActivePhotoIdx((prev) => (prev + 1) % friendshipPhotos.length);
    }
  };

  const currentPhotoSrc =
    customPhotoUrl || friendshipPhotos[activePhotoIdx] || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-[#2D1018] overflow-hidden select-none touch-none"
    >
      {/* Ambient Storybook Burgundy, Blush Pink & Gold Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #6D2231 0%, #3E121C 55%, #230910 100%)',
        }}
      />

      {/* Desktop Left & Right Storybook Accents */}
      <div className="hidden lg:flex fixed left-8 xl:left-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-85">
        <FourPointStar size={20} color="#F5D090" glow />
        <div className="w-[1px] h-12 bg-[#F5D090]/35 my-3" />
        <p className="font-serif-editorial italic text-[#F8E0D8] text-base leading-relaxed">
          &ldquo;The final surprise of your journey. Click the gift and see what&rsquo;s inside!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#F5D090]/35 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#F5D090]">
          DOOR III · GRAND FINALE
        </span>
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-85">
        <FourPointStar size={20} color="#F5D090" glow />
        <div className="w-[1px] h-12 bg-[#F5D090]/35 my-3" />
        <p className="font-serif-editorial italic text-[#F8E0D8] text-base leading-relaxed">
          &ldquo;Do what you want. Prove everyone wrong. Live your life, your rules.&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#F5D090]/35 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#F5D090]">
          ONE LAST SURPRISE
        </span>
      </div>

      {/* Main 941x1672 Scene Container (100% mobile-friendly, fits in 100dvh) */}
      <div className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[941/1672] sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(18,4,8,0.65)] sm:border sm:border-[#D9A875]/60 overflow-hidden flex items-center justify-center bg-[#3A121C]">
        <div className="relative w-full h-full">
          {/* Base Reference Artwork */}
          <img
            src="/assets/aistudio/One_Last_Magical_Birthday_Surprise_85592e8a.png"
            alt="One Last Surprise — Click the gift box in the centre of the screen to reveal your final birthday surprise."
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Healed Scene Canvas (Removes all baked-in heart symbols while keeping exact artwork) */}
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* =================================================================
              SOFT GLOWING SPOTLIGHT & FLOATING SPARKLES AROUND THE GIFT BOX
             ================================================================= */}
          <motion.div
            animate={{
              opacity: stage === 'opening' ? [0.65, 1, 0.85] : [0.45, 0.72, 0.45],
              scale: stage === 'opening' ? [1, 1.25, 1.1] : [0.96, 1.06, 0.96],
            }}
            transition={{
              duration: stage === 'opening' ? 0.8 : 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: '50%',
              top: '56.5%',
              background:
                'radial-gradient(circle, rgba(255,232,175,0.52) 0%, rgba(244,184,196,0.26) 42%, rgba(109,26,40,0) 72%)',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full pointer-events-none z-10 blur-xl"
          />

          {/* Vertical Spotlight Beam from Above */}
          <div
            style={{
              left: '50%',
              top: '34%',
              width: '66%',
              height: '42%',
              background:
                'linear-gradient(180deg, rgba(255,240,200,0.18) 0%, rgba(255,220,165,0.28) 50%, rgba(255,220,165,0) 100%)',
              clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
            }}
            className="absolute -translate-x-1/2 pointer-events-none z-10 blur-md animate-pulse"
          />

          {/* Ambient Floating Sparkles around the Gift Box */}
          {[
            { left: '22%', top: '43%', size: 16, delay: 0 },
            { left: '78%', top: '44%', size: 15, delay: 0.6 },
            { left: '18%', top: '61%', size: 14, delay: 1.1 },
            { left: '81%', top: '60%', size: 17, delay: 0.3 },
            { left: '34%', top: '39%', size: 13, delay: 0.9 },
            { left: '67%', top: '39%', size: 14, delay: 1.4 },
          ].map((sp, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.45, 1, 0.45],
                scale: [0.85, 1.18, 0.85],
              }}
              transition={{
                duration: 2.6,
                delay: sp.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ left: sp.left, top: sp.top }}
              className="absolute pointer-events-none z-20"
            >
              <FourPointStar size={sp.size} color="#FFE9A8" glow />
            </motion.div>
          ))}

          {/* =================================================================
              TOP-LEFT "BACK TO DOORS" BUTTON
             ================================================================= */}
          <div className="absolute top-3 left-3 right-14 z-40 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSparkle();
                onBackToDoors();
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[40px] rounded-full bg-[#FFF3ED]/90 backdrop-blur-md border border-[#D9A875] text-[#4A141E] font-serif-editorial text-xs sm:text-sm font-semibold hover:bg-[#FFF9F6] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#6D1A28]" />
              <span>Back to Doors</span>
            </button>
          </div>

          {/* =================================================================
              1. CUTE CARTOON SPIDER (Top-Left, Reacts Excitedly!)
             ================================================================= */}
          <div
            style={{
              left: '9.5%',
              top: '12.5%',
              width: '19.5%',
              height: '8.2%',
            }}
            className="absolute z-30"
          >
            <button
              type="button"
              onClick={handleTapSpider}
              aria-label="Tap cute cartoon spider"
              className={`relative w-full h-full cursor-pointer focus:outline-none transition-transform duration-300 ${
                spiderExcited ? 'scale-120 -translate-y-1.5 rotate-6' : 'hover:scale-105'
              }`}
            >
              {/* Animated Spider Eyes Overlay */}
              <svg
                viewBox="0 0 46 22"
                fill="none"
                style={{
                  left: '36.5%',
                  top: '39.5%',
                  width: '32%',
                  height: '24%',
                }}
                className="absolute pointer-events-none overflow-visible"
              >
                {spiderBlinking ? (
                  <>
                    <ellipse cx="11" cy="11" rx="8.5" ry="8" fill="#2A0E14" />
                    <path
                      d="M4.5 11.5C7.5 8.5 14.5 8.5 17.5 11.5"
                      stroke="#FFF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <ellipse cx="34" cy="11" rx="8.5" ry="8" fill="#2A0E14" />
                    <path
                      d="M27.5 11.5C30.5 8.5 37.5 8.5 40.5 11.5"
                      stroke="#FFF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <circle
                      cx="11"
                      cy="11"
                      r="7.4"
                      fill="#FFF9F5"
                      stroke="#1E0B10"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx={11 + eyeOffset.x}
                      cy={11 + eyeOffset.y}
                      r="4.1"
                      fill="#1E0B10"
                      style={{ transition: 'cx 0.3s ease, cy 0.3s ease' }}
                    />
                    <circle
                      cx={9.4 + eyeOffset.x * 0.7}
                      cy={9.2 + eyeOffset.y * 0.7}
                      r="1.5"
                      fill="#FFFFFF"
                      style={{ transition: 'cx 0.3s ease, cy 0.3s ease' }}
                    />

                    <circle
                      cx="34"
                      cy="11"
                      r="7.2"
                      fill="#FFF9F5"
                      stroke="#1E0B10"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx={34 + eyeOffset.x}
                      cy={11 + eyeOffset.y}
                      r="4.0"
                      fill="#1E0B10"
                      style={{ transition: 'cx 0.3s ease, cy 0.3s ease' }}
                    />
                    <circle
                      cx={32.4 + eyeOffset.x * 0.7}
                      cy={9.2 + eyeOffset.y * 0.7}
                      r="1.4"
                      fill="#FFFFFF"
                      style={{ transition: 'cx 0.3s ease, cy 0.3s ease' }}
                    />
                  </>
                )}
              </svg>

              {/* Excited Sparkle Pop on Spider */}
              <AnimatePresence>
                {spiderExcited && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.5 }}
                    animate={{ opacity: 1, y: -14, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-[#FFE494]" />
                    <FourPointStar size={13} color="#FFE494" glow />
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
                  className="absolute left-1 -bottom-9 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none z-40"
                >
                  {spiderSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              2. CROWNED SNAKE (Top-Right, Reacts Excitedly!)
             ================================================================= */}
          <div
            style={{
              left: '76.5%',
              top: '12.2%',
              width: '19.0%',
              height: '8.3%',
            }}
            className="absolute z-30"
          >
            <button
              type="button"
              onClick={handleTapSnake}
              aria-label="Tap crowned snake"
              className={`relative w-full h-full cursor-pointer focus:outline-none animate-snake-sway transition-transform duration-300 ${
                snakeExcited ? 'scale-120 -rotate-8' : 'hover:scale-105'
              }`}
            >
              <canvas
                ref={snakeHeadCanvasRef}
                className="w-full h-full object-fill pointer-events-none"
              />
              <div className="absolute left-[34%] top-[4%] pointer-events-none animate-star-twinkle">
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
                    <FourPointStar size={13} color="#FFE89E" glow />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {snakeSpeech && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-2 -bottom-9 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none z-40"
                >
                  {snakeSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              3. CLICKABLE EXISTING GIFT BOX IN THE CENTRE OF THE SCREEN
                 (With gentle anticipation animation & smooth opening animation)
             ================================================================= */}
          <motion.button
            type="button"
            onClick={handleClickGiftBox}
            aria-label="Click the gift box to open your final birthday surprise"
            animate={
              stage === 'closed'
                ? {
                    y: [0, -7, 0],
                    scale: [1, 1.028, 1],
                    rotate: [0, -1.1, 1.1, 0],
                  }
                : stage === 'opening'
                ? {
                    scale: [1, 1.09, 0.94, 1.22, 0.85],
                    rotate: [0, -7, 7, -9, 9, 0],
                    y: [0, -14, 0, -20, 10],
                  }
                : {
                    scale: 0.92,
                    opacity: 0.35,
                  }
            }
            transition={
              stage === 'closed'
                ? {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {
                    duration: 0.82,
                    ease: 'easeInOut',
                  }
            }
            style={{
              left: '20.5%',
              top: '40.0%',
              width: '58.0%',
              height: '32.8%',
            }}
            className={`group absolute z-20 cursor-pointer focus:outline-none ${
              stage === 'revealed' || stage === 'secret' ? 'pointer-events-none' : ''
            }`}
          >
            {giftBoxSpriteSrc && (
              <img
                src={giftBoxSpriteSrc}
                alt="Magical Birthday Gift Box"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_0_24px_rgba(255,222,158,0.55)] group-hover:drop-shadow-[0_0_36px_rgba(255,235,180,0.85)] transition-all"
              />
            )}

            {/* Subtle Tap Prompt Pill on Hover/Mobile Anticipation */}
            {stage === 'closed' && (
              <motion.div
                animate={{ y: [0, -4, 0], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#4A121C]/90 border border-[#F5D090] text-[#FFF5E4] font-cinzel text-[10px] sm:text-[11px] tracking-[0.18em] whitespace-nowrap shadow-[0_6px_18px_rgba(18,3,7,0.65)] flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#F5D090]" />
                <span>TAP TO OPEN GIFT</span>
                <Sparkles className="w-3 h-3 text-[#F5D090]" />
              </motion.div>
            )}
          </motion.button>

          {/* Opening Flash Burst when Gift Box Unwraps */}
          <AnimatePresence>
            {stage === 'opening' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.8, 2.3] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                style={{
                  left: '50%',
                  top: '56%',
                  background:
                    'radial-gradient(circle, rgba(255,250,225,0.95) 0%, rgba(246,200,104,0.65) 40%, rgba(166,36,56,0) 75%)',
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full pointer-events-none z-30"
              />
            )}
          </AnimatePresence>

          {/* =================================================================
              4. COLOURFUL CONFETTI & FLOATING STARS BURST
             ================================================================= */}
          <AnimatePresence>
            {confettiBurstKey > 0 && (
              <div
                key={confettiBurstKey}
                className="absolute inset-0 pointer-events-none overflow-hidden z-40"
              >
                {confettiPieces.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{
                      opacity: 1,
                      y: '46%',
                      x: 0,
                      scale: 0.4,
                      rotate: 0,
                    }}
                    animate={{
                      opacity: [1, 1, 0.9, 0],
                      y: ['46%', `${12 + (p.id % 28)}%`, '104%'],
                      x: [0, p.driftX, p.driftX * 1.4],
                      scale: [0.5, 1.15, 0.9],
                      rotate: p.rotateEnd,
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: [0.2, 0.8, 0.4, 1],
                    }}
                    style={{ left: p.left, top: 0 }}
                    className="absolute"
                  >
                    {p.shape === 'star' ? (
                      <FourPointStar size={p.size + 5} color={p.color} glow />
                    ) : (
                      <div
                        style={{
                          width: p.size,
                          height: p.shape === 'circle' ? p.size : p.size * 0.6,
                          backgroundColor: p.color,
                          borderRadius: p.shape === 'circle' ? '9999px' : '2px',
                          boxShadow: `0 0 8px ${p.color}`,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* =================================================================
              5. REVEALED FLOATING POLAROID FRAME + FUNNY CAPTION +
                 "ONE LAST THING..." BUTTON
             ================================================================= */}
          <AnimatePresence>
            {stage === 'revealed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-x-0 top-[29.5%] bottom-[3.5%] z-30 flex flex-col items-center justify-center px-4 sm:px-5 pointer-events-auto"
              >
                {/* Soft Darkened Backdrop Glow behind Polaroid so text & photo pop clearly */}
                <div
                  className="absolute inset-x-3 inset-y-1 rounded-[28px] pointer-events-none -z-10"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 45%, rgba(45,12,20,0.86) 0%, rgba(34,9,15,0.92) 75%, rgba(28,7,12,0.75) 100%)',
                    boxShadow: '0 0 40px rgba(25,5,10,0.8)',
                  }}
                />

                {/* Continuously Floating Stars Around the Revealed Polaroid */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-5 top-4 pointer-events-none"
                >
                  <FourPointStar size={20} color="#FFE7A0" glow />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [0, -12, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-5 top-6 pointer-events-none"
                >
                  <FourPointStar size={18} color="#F4B8C4" glow />
                </motion.div>

                {/* Floating Polaroid Frame emerging from the Gift Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.45, y: 50, rotate: -6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                    rotate: [-1.2, 1.2, -1.2],
                  }}
                  transition={{
                    opacity: { duration: 0.4 },
                    scale: { type: 'spring', stiffness: 240, damping: 20 },
                    y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="relative w-full max-w-[270px] sm:max-w-[295px] bg-[#FAF2EA] p-3 pb-3.5 rounded-[8px] border-2 border-[#DFB070] shadow-[0_18px_45px_rgba(15,3,7,0.75)]"
                >
                  {/* Vintage Golden Washi Tape on Top of Polaroid */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#E5C185]/90 border border-[#B88E4F] shadow-xs rotate-[-2deg] pointer-events-none" />

                  {/* Friendship Photo Frame */}
                  <div className="relative w-full aspect-[4/3.1] bg-[#3E161E] rounded-[3px] overflow-hidden border border-[#9E7168]/50">
                    {currentPhotoSrc ? (
                      <img
                        src={currentPhotoSrc}
                        alt="Funny friendship memory"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#F8E0D8] p-4 text-center">
                        <Camera className="w-8 h-8 text-[#F5D090] mb-1.5 opacity-80" />
                        <span className="font-serif-editorial italic text-sm">
                          Legendary Friendship Memory ✦
                        </span>
                      </div>
                    )}

                    {/* Subtle Photo Controls (Switch Memory Crop or Upload Custom Photo) */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleCyclePhoto}
                        title="Switch friendship photo"
                        className="p-1.5 rounded-full bg-[#2A0D13]/75 text-[#FFF5EE] border border-[#E6B875]/60 hover:bg-[#5E1622] transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload custom friendship photo"
                        className="p-1.5 rounded-full bg-[#2A0D13]/75 text-[#FFF5EE] border border-[#E6B875]/60 hover:bg-[#5E1622] transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Polaroid Handwritten Strip */}
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="font-serif-editorial italic font-bold text-[#3B151D] text-sm sm:text-base">
                      {customPhotoUrl
                        ? 'Certified Chaos Legends ✦'
                        : FRIENDSHIP_PHOTO_CROPS[activePhotoIdx]?.label || 'Partners in Chaos ✦'}
                    </span>
                    <span className="font-cinzel text-[9px] tracking-[0.15em] text-[#7A2230] font-semibold">
                      BEST FRIENDS
                    </span>
                  </div>
                </motion.div>

                {/* Funny Empowering Caption Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  className="w-full max-w-[340px] mt-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 bg-[#FFF6EE] border-2 border-[#DFB070] shadow-[0_12px_30px_rgba(18,4,8,0.65)] text-center"
                >
                  <p className="font-serif-editorial italic font-bold text-[#38121A] text-[15px] sm:text-[17px] leading-snug">
                    &ldquo;Do what you want. Prove everyone wrong. Live your life, your rules. Travel as far as you can.&rdquo;
                  </p>
                </motion.div>

                {/* "One Last Thing..." Button leading to the Final Secret Surprise */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-3 flex items-center justify-center gap-2.5 w-full max-w-[340px]"
                >
                  <button
                    type="button"
                    onClick={handleOpenFinalSecret}
                    className="group relative flex-1 py-2.5 px-5 min-h-[44px] rounded-full bg-gradient-to-r from-[#6D1A28] via-[#8A2233] to-[#6D1A28] text-[#FFF6EE] border-2 border-[#F5D090] shadow-[0_0_24px_rgba(245,208,144,0.5)] font-serif-editorial font-bold italic text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#F5D090] group-hover:rotate-12 transition-transform" />
                    <span>One Last Thing...</span>
                    <Sparkles className="w-4 h-4 text-[#F5D090] group-hover:-rotate-12 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================================
              6. FINAL SECRET SURPRISE MODAL ("One Last Thing...")
             ================================================================= */}
          <AnimatePresence>
            {stage === 'secret' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#1E070C]/85 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 12 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 24 }}
                  className="relative w-full max-w-[370px] rounded-[26px] border-2 border-[#E3B46E] p-5 sm:p-6 text-center shadow-[0_24px_70px_rgba(12,2,5,0.85)] space-y-3.5"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 18%, #FFF7F0 0%, #F7DFD4 58%, #EBC4B8 100%)',
                  }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5E1622] border border-[#E6B875] text-[#FFF5E4] font-cinzel text-[10px] tracking-[0.18em]">
                    <Crown className="w-3.5 h-3.5 text-[#F5D090]" />
                    <span>THE FINAL SECRET SURPRISE</span>
                  </div>

                  <h2 className="font-serif-editorial italic font-bold text-2xl sm:text-3xl text-[#4A121C] leading-tight">
                    Official Verdict: Unstoppable! 👑
                  </h2>

                  <GothicDivider />

                  <div className="rounded-2xl p-4 bg-[#FFFDFB]/90 border border-[#D9A875] shadow-inner space-y-2.5 text-[#381119] font-serif-editorial text-[15px] sm:text-base leading-relaxed">
                    <p className="italic">
                      &ldquo;Okay, roasts aside for literally five seconds—you survived another whole year of chaos, questionable decisions, and my non-stop nonsense.&rdquo;
                    </p>
                    <p className="font-semibold text-[#5E1622]">
                      &ldquo;Keep chasing big adventures, proving everyone wrong, and living 100% by your own rules. And don&rsquo;t forget who your funniest friend is when you&rsquo;re famous!&rdquo;
                    </p>
                  </div>

                  {/* Interactive Chaos Crown Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playCandleBlow();
                      triggerConfettiAndStars();
                      setChaosCrownClaimed(true);
                    }}
                    className={`w-full py-2.5 px-4 min-h-[44px] rounded-xl font-serif-editorial font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-md ${
                      chaosCrownClaimed
                        ? 'bg-[#E6B86A] border-[#8A5A1E] text-[#2D0B12]'
                        : 'bg-[#5E1622] border-[#E6B875] text-[#FFF6F0] hover:bg-[#751B2A]'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>
                      {chaosCrownClaimed
                        ? 'Chaos Crown Claimed! Happy Birthday! 👑🎉'
                        : 'Claim Your Official Chaos Crown 👑'}
                    </span>
                  </button>

                  <div className="pt-1 flex items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playSparkle();
                        setStage('revealed');
                      }}
                      className="flex-1 py-2 px-3 min-h-[40px] rounded-xl bg-[#F5DCD4] border border-[#C9968B] text-[#4A141E] font-serif-editorial font-semibold text-xs sm:text-sm hover:bg-[#EFCBC0] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playSparkle();
                        setStage('closed');
                      }}
                      className="py-2 px-3 min-h-[40px] rounded-xl bg-[#F5DCD4] border border-[#C9968B] text-[#4A141E] font-serif-editorial font-semibold text-xs sm:text-sm hover:bg-[#EFCBC0] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#6D1A28]" />
                      <span>Replay Box</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
