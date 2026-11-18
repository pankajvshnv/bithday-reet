import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, MicOff } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar } from './GothicOrnaments';

interface CandleConfig {
  id: number;
  left: string;
  top: string;
  wickTop: string;
  maskWidth: string;
  maskHeight: string;
  scale: number;
  delayMs: number;
  patchColorInner: string;
  patchColorOuter: string;
}

// Exact coordinates calibrated to the 852x1846 reference image (/assets/aistudio/Gothic_Birthday_Cake_Invitation_ed137cf0.png)
const CANDLES: CandleConfig[] = [
  {
    id: 1,
    left: '37.15%',
    top: '57.5%',
    wickTop: '58.4%',
    maskWidth: '3.2%',
    maskHeight: '3.0%',
    scale: 0.72,
    delayMs: 0,
    patchColorInner: '#E7D8C9',
    patchColorOuter: '#DFD0C3',
  },
  {
    id: 2,
    left: '42.15%',
    top: '53.8%',
    wickTop: '55.2%',
    maskWidth: '3.6%',
    maskHeight: '3.8%',
    scale: 1.0,
    delayMs: 65,
    patchColorInner: '#E8D9CA',
    patchColorOuter: '#DFD1C5',
  },
  {
    id: 3,
    left: '46.1%',
    top: '58.0%',
    wickTop: '59.1%',
    maskWidth: '3.0%',
    maskHeight: '3.0%',
    scale: 0.74,
    delayMs: 130,
    patchColorInner: '#EADACB',
    patchColorOuter: '#E2D3C6',
  },
  {
    id: 4,
    left: '50.75%',
    top: '51.2%',
    wickTop: '52.8%',
    maskWidth: '4.0%',
    maskHeight: '4.2%',
    scale: 1.18,
    delayMs: 195,
    patchColorInner: '#E8D9CB',
    patchColorOuter: '#DFD0C3',
  },
  {
    id: 5,
    left: '54.4%',
    top: '59.2%',
    wickTop: '60.1%',
    maskWidth: '2.6%',
    maskHeight: '2.6%',
    scale: 0.65,
    delayMs: 260,
    patchColorInner: '#EBDCCB',
    patchColorOuter: '#E2D3C5',
  },
  {
    id: 6,
    left: '57.9%',
    top: '55.5%',
    wickTop: '56.9%',
    maskWidth: '3.5%',
    maskHeight: '3.7%',
    scale: 0.96,
    delayMs: 325,
    patchColorInner: '#E7D8C9',
    patchColorOuter: '#DED0C3',
  },
];

interface CakeInvitationScreenProps {
  onComplete: () => void;
}

export const CakeInvitationScreen: React.FC<CakeInvitationScreenProps> = ({ onComplete }) => {
  const [candleState, setCandleState] = useState<'lit' | 'blowing' | 'extinguished'>('lit');
  const [micState, setMicState] = useState<'off' | 'listening' | 'denied'>('off');
  const [breathLevel, setBreathLevel] = useState(0);
  const [wishSparkles, setWishSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const candleStateRef = useRef<'lit' | 'blowing' | 'extinguished'>('lit');
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const blowFramesRef = useRef<number>(0);

  // Draw the reference image onto a canvas and seamlessly heal ONLY the "Tap to begin" letters
  // (x: 326..526, y: 1666..1704) by vertically interpolating the exact surrounding table pixels.
  // This removes "Tap to begin" with ZERO white border or box so "Blow the candles" sits cleanly as plain text!
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Gothic_Birthday_Cake_Invitation_ed137cf0.png';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = img.naturalWidth || 852;
      const h = img.naturalHeight || 1846;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

      // Exact pixel bounding box of "Tap to begin" text in the 852x1846 artwork
      const xStart = Math.round(w * 0.378); // 322
      const xEnd = Math.round(w * 0.622);   // 530
      const yTop = Math.round(h * 0.9015);  // 1664 (clean row right above text)
      const yBot = Math.round(h * 0.9235);  // 1705 (clean row right below text)
      const boxW = xEnd - xStart;
      const boxH = yBot - yTop;

      const imgData = ctx.getImageData(xStart, yTop, boxW, boxH);
      const data = imgData.data;

      for (let x = 0; x < boxW; x++) {
        // Horizontal feathering at left & right edges (8px)
        const edgeDist = Math.min(x, boxW - 1 - x);
        const horizAlpha = Math.min(1, edgeDist / 8);

        const topIdx = x * 4;
        const botIdx = ((boxH - 1) * boxW + x) * 4;

        const rTop = data[topIdx];
        const gTop = data[topIdx + 1];
        const bTop = data[topIdx + 2];

        const rBot = data[botIdx];
        const gBot = data[botIdx + 1];
        const bBot = data[botIdx + 2];

        for (let y = 1; y < boxH - 1; y++) {
          const t = y / (boxH - 1);
          const idx = (y * boxW + x) * 4;

          const interpR = rTop * (1 - t) + rBot * t;
          const interpG = gTop * (1 - t) + gBot * t;
          const interpB = bTop * (1 - t) + bBot * t;

          data[idx] = Math.round(data[idx] * (1 - horizAlpha) + interpR * horizAlpha);
          data[idx + 1] = Math.round(data[idx + 1] * (1 - horizAlpha) + interpG * horizAlpha);
          data[idx + 2] = Math.round(data[idx + 2] * (1 - horizAlpha) + interpB * horizAlpha);
        }
      }

      ctx.putImageData(imgData, xStart, yTop);
    };
  }, []);

  const stopMicResources = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setBreathLevel(0);
  }, []);

  const triggerBlowOut = useCallback(() => {
    if (candleStateRef.current !== 'lit') return;
    candleStateRef.current = 'blowing';

    stopMicResources();
    setMicState('off');
    soundEngine.playCandleBlow();
    setCandleState('blowing');

    const embers = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 34 + Math.random() * 32,
      y: 50 + Math.random() * 12,
    }));
    setWishSparkles(embers);

    window.setTimeout(() => {
      candleStateRef.current = 'extinguished';
      setCandleState('extinguished');
    }, 520);

    window.setTimeout(() => {
      onComplete();
    }, 2350);
  }, [onComplete, stopMicResources]);

  const handleToggleMic = async () => {
    if (candleStateRef.current !== 'lit') return;

    if (micState === 'listening') {
      stopMicResources();
      setMicState('off');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicState('denied');
      return;
    }

    try {
      soundEngine.playSparkle();

      // IMPORTANT: Create and resume AudioContext SYNCHRONOUSLY inside the user click gesture
      // BEFORE awaiting getUserMedia so mobile/desktop browsers never suspend it!
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      ctx.resume().catch(() => {});

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });
      } catch {
        // Fallback to standard audio constraints if custom flags are rejected by device
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (candleStateRef.current !== 'lit') {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;

      // Connect analyser to a silent GainNode -> destination so Chromium/WebKit actively pulls audio frames
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(ctx.destination);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const floatTimeData = new Float32Array(analyser.fftSize);
      const byteTimeData = new Uint8Array(analyser.fftSize);

      blowFramesRef.current = 0;
      let warmupFrames = 0;
      let baselineRms = 0.008;
      setMicState('listening');

      const detectBlow = () => {
        if (candleStateRef.current !== 'lit') return;

        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        analyser.getByteFrequencyData(freqData);

        let rms = 0;
        let peak = 0;

        if (typeof analyser.getFloatTimeDomainData === 'function') {
          analyser.getFloatTimeDomainData(floatTimeData);
          let sumSq = 0;
          for (let i = 0; i < floatTimeData.length; i++) {
            const v = Math.abs(floatTimeData[i]);
            if (v > peak) peak = v;
            sumSq += v * v;
          }
          rms = Math.sqrt(sumSq / floatTimeData.length);
        } else {
          analyser.getByteTimeDomainData(byteTimeData);
          let sumSq = 0;
          for (let i = 0; i < byteTimeData.length; i++) {
            const v = Math.abs((byteTimeData[i] - 128) / 128);
            if (v > peak) peak = v;
            sumSq += v * v;
          }
          rms = Math.sqrt(sumSq / byteTimeData.length);
        }

        // Frequency energy across bins 1..40
        let freqSum = 0;
        let maxBin = 0;
        for (let i = 1; i <= 40; i++) {
          freqSum += freqData[i];
          if (freqData[i] > maxBin) maxBin = freqData[i];
        }
        const freqAvg = freqSum / 40;

        // Quick 8-frame warmup (~130ms) to learn quiet ambient floor
        if (warmupFrames < 8) {
          warmupFrames++;
          baselineRms = Math.min(0.02, baselineRms * 0.7 + rms * 0.3);
        }

        const visualLevel = Math.min(1, Math.max(rms / 0.04, freqAvg / 35, peak / 0.08));
        setBreathLevel(visualLevel);

        // Highly responsive blow detection: triggers on gentle or strong blow into mic
        const isBlowingFrame =
          rms > Math.max(0.014, baselineRms * 2.1) ||
          peak > 0.038 ||
          freqAvg > 16 ||
          maxBin > 65;

        if (isBlowingFrame) {
          blowFramesRef.current += 1;
        } else {
          blowFramesRef.current = Math.max(0, blowFramesRef.current - 1);
        }

        if (
          blowFramesRef.current >= 2 ||
          rms > 0.035 ||
          peak > 0.08 ||
          freqAvg > 32 ||
          maxBin > 105
        ) {
          triggerBlowOut();
          return;
        }

        rafRef.current = requestAnimationFrame(detectBlow);
      };

      rafRef.current = requestAnimationFrame(detectBlow);
    } catch {
      setMicState('denied');
    }
  };

  useEffect(() => {
    return () => {
      stopMicResources();
    };
  }, [stopMicResources]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-[#D7CCC4] overflow-hidden select-none touch-none"
    >
      {/* Seamless Parchment Backdrop matching the exact edge tones of the reference image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 54%, #EFE4DA 0%, #DDD2CA 45%, #C8BCB3 85%, #B8AAA1 100%)',
        }}
      />

      {/* Desktop Left & Right Atmospheric Lore Accents */}
      <div className="hidden lg:flex fixed left-8 xl:left-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-75">
        <FourPointStar size={20} color="#6D1A22" />
        <div className="w-[1px] h-12 bg-[#6D1A22]/30 my-3" />
        <p className="font-serif-editorial italic text-[#3A2628] text-base leading-relaxed">
          &ldquo;Make an unreasonable birthday wish and blow out the candles before the wax melts...&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A22]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A22]">
          CHAPTER I · THE WISH
        </span>
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-75">
        <FourPointStar size={20} color="#6D1A22" />
        <div className="w-[1px] h-12 bg-[#6D1A22]/30 my-3" />
        <p className="font-serif-editorial italic text-[#3A2628] text-base leading-relaxed">
          &ldquo;Three chaotic mystery doors await beyond the smoke of the candles.&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A22]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A22]">
          III GATES AWAIT
        </span>
      </div>

      {/* Fixed-Viewport Reference Scene Container (Fits 100% in 100dvh with zero scroll) */}
      <div className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[852/1846] sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(38,18,21,0.28)] sm:border sm:border-[#B8A89E]/60 overflow-hidden flex items-center justify-center bg-[#DFD4CC]">
        <div className="relative w-full h-full">
          {/* Fallback img underneath while canvas initializes */}
          <img
            src="/assets/aistudio/Gothic_Birthday_Cake_Invitation_ed137cf0.png"
            alt="Happy Birthday — Gothic cake with crimson roses, white serpent, and glowing candles."
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Pixel-Healed Canvas (Seamlessly removes "Tap to begin" using exact surrounding image pixels, zero white border!) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Plain, Unboxed "Blow the candles" Text (NO background box, NO white border!) */}
          <div
            style={{ top: '91.2%' }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
          >
            <span className="font-serif-editorial text-[#261618] text-[19px] sm:text-[21px] leading-none tracking-[0.01em] whitespace-nowrap">
              Blow the candles
            </span>
          </div>

          {/* =================================================================
              MAIN PAGE ONLY: Dedicated Microphone Button in Left Corner
             ================================================================= */}
          <div className="absolute top-3.5 left-3.5 z-40">
            <button
              type="button"
              onClick={handleToggleMic}
              disabled={candleState !== 'lit'}
              aria-label={
                micState === 'listening'
                  ? 'Microphone active — blow to extinguish candles'
                  : 'Enable microphone to blow out the candles'
              }
              className={`group relative inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-md ${
                micState === 'listening'
                  ? 'bg-[#6D1A22]/90 border-[#E5C494]/70 text-[#FAF0E6] shadow-[0_0_20px_rgba(109,26,34,0.45)]'
                  : micState === 'denied'
                  ? 'bg-[#3A2628]/85 border-[#9E7B66]/50 text-[#E6D7CC]'
                  : 'bg-[#EFE6DE]/85 border-[#8C6D46]/50 text-[#2E1B1D] hover:bg-[#FAF2EA]'
              }`}
            >
              {micState === 'listening' && (
                <span
                  style={{
                    transform: `scale(${1 + breathLevel * 0.45})`,
                    opacity: 0.35 + breathLevel * 0.5,
                  }}
                  className="absolute inset-0 rounded-full bg-[#E5C494]/30 pointer-events-none transition-transform duration-75"
                />
              )}

              {micState === 'denied' ? (
                <MicOff className="w-4 h-4 text-[#E5C494] shrink-0 relative z-10" />
              ) : (
                <Mic
                  className={`w-4 h-4 shrink-0 relative z-10 ${
                    micState === 'listening' ? 'text-[#FFE7B3] animate-pulse' : 'text-[#6D1A22]'
                  }`}
                />
              )}

              <span className="font-serif-editorial text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap relative z-10">
                {micState === 'listening'
                  ? 'Blow Now!'
                  : micState === 'denied'
                  ? 'Mic Blocked'
                  : 'Use Mic'}
              </span>
            </button>
          </div>

          {/* Subtle Warm Candlelight Ambient Halo when Lit, dimming when Extinguished */}
          <div
            className={`absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[68%] h-[28%] rounded-full pointer-events-none transition-opacity duration-1000 ${
              candleState === 'lit' ? 'opacity-65' : 'opacity-0'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(255,218,145,0.42) 0%, rgba(255,180,95,0.16) 50%, rgba(255,180,95,0) 75%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Subtle Moonlight Pulse at Top Crescent Moon */}
          <div
            className="absolute left-1/2 top-[13%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none animate-pulse"
            style={{
              background:
                'radial-gradient(circle, rgba(255,244,214,0.45) 0%, rgba(255,230,175,0) 70%)',
            }}
          />

          {/* Seamless Parchment Erase Masks + Darkened Wicks */}
          {CANDLES.map((c) => (
            <React.Fragment key={`mask-${c.id}`}>
              <div
                style={{
                  left: c.left,
                  top: c.top,
                  width: c.maskWidth,
                  height: c.maskHeight,
                  transitionDelay: `${c.delayMs}ms`,
                  background: `radial-gradient(ellipse at center, ${c.patchColorInner} 38%, ${c.patchColorOuter} 72%, rgba(223,208,195,0) 100%)`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-500 ${
                  candleState === 'lit' ? 'opacity-0' : 'opacity-100'
                }`}
              />

              <div
                style={{
                  left: c.left,
                  top: c.wickTop,
                  transitionDelay: `${c.delayMs}ms`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-opacity duration-500 ${
                  candleState === 'lit' ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full bg-[#FF6B2B] shadow-[0_0_6px_#FF9E44] transition-opacity duration-1000 ${
                    candleState === 'extinguished' ? 'opacity-60 animate-pulse' : 'opacity-100'
                  }`}
                />
                <div className="w-[1.5px] h-2 bg-[#2A181A] rounded-full -mt-0.5" />
              </div>
            </React.Fragment>
          ))}

          {/* Live Animated Candle Flames Overlay (reacts dynamically to breath level on mic!) */}
          {CANDLES.map((c) => (
            <div
              key={`flame-${c.id}`}
              style={{
                left: c.left,
                top: c.top,
                animationDelay: candleState === 'blowing' ? `${c.delayMs}ms` : `${c.id * 0.23}s`,
              }}
              className={`absolute -translate-y-1/2 pointer-events-none ${
                candleState === 'lit'
                  ? 'animate-flame'
                  : candleState === 'blowing'
                  ? 'animate-flame-blow'
                  : 'opacity-0 scale-0 transition-all duration-300'
              }`}
            >
              <div
                style={{
                  transform: `scale(${c.scale * (1 + breathLevel * 0.18)}) skewX(${
                    -breathLevel * 26
                  }deg)`,
                  transition: 'transform 75ms ease-out',
                }}
                className="relative flex items-center justify-center"
              >
                <div className="absolute w-7 h-10 rounded-full bg-[#FFA73B]/45 blur-[6px]" />
                <svg width="18" height="30" viewBox="0 0 18 30" fill="none" className="relative">
                  <path
                    d="M9 1C9 1 16 11 16 18.5C16 23.8 12.9 28 9 28C5.1 28 2 23.8 2 18.5C2 11 9 1 9 1Z"
                    fill="url(#outerFlameGrad)"
                  />
                  <path
                    d="M9 6.5C9 6.5 13.5 13.5 13.5 19C13.5 22.8 11.5 26 9 26C6.5 26 4.5 22.8 4.5 19C4.5 13.5 9 6.5 9 6.5Z"
                    fill="#FFFDF5"
                  />
                  <defs>
                    <linearGradient id="outerFlameGrad" x1="9" y1="1" x2="9" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFE89E" />
                      <stop offset="0.5" stopColor="#FFAE42" />
                      <stop offset="1" stopColor="#D9531E" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          ))}

          {/* Curling Wisps of Silver-Grey Candle Smoke when Blowing / Extinguished */}
          <AnimatePresence>
            {candleState !== 'lit' &&
              CANDLES.map((c) => (
                <div
                  key={`smoke-${c.id}`}
                  style={{
                    left: c.left,
                    top: c.wickTop,
                    animationDelay: `${c.delayMs + 160}ms`,
                  }}
                  className="absolute pointer-events-none animate-smoke z-20"
                >
                  <svg width="46" height="96" viewBox="0 0 46 96" fill="none" className="opacity-75">
                    <path
                      d="M22 92C18 76 28 64 20 48C12 32 28 18 22 4"
                      stroke="url(#smokeStroke)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="blur(2px)"
                    />
                    <path
                      d="M25 86C31 70 17 56 26 38C34 22 19 12 27 2"
                      stroke="url(#smokeStroke)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      filter="blur(2.5px)"
                    />
                    <defs>
                      <linearGradient id="smokeStroke" x1="23" y1="92" x2="23" y2="2" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A3B3D" stopOpacity="0.55" />
                        <stop offset="0.5" stopColor="#8E8284" stopOpacity="0.45" />
                        <stop offset="1" stopColor="#EFE7E2" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ))}
          </AnimatePresence>

          {/* Animated Wind / Breath Gust Wave across the cake */}
          <AnimatePresence>
            {candleState === 'blowing' && (
              <motion.div
                initial={{ opacity: 0, x: -90 }}
                animate={{ opacity: [0, 0.85, 0], x: 110 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
                className="absolute top-[48%] left-[18%] right-[18%] h-28 pointer-events-none z-20 flex items-center justify-center"
              >
                <svg viewBox="0 0 320 90" fill="none" className="w-full h-full">
                  <path
                    d="M10 45C75 25 140 65 215 38C255 24 285 32 310 42"
                    stroke="url(#windGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M35 65C95 48 165 78 235 55C265 45 288 52 298 60"
                    stroke="url(#windGrad)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25 25C85 12 155 42 225 20C255 10 278 18 292 24"
                    stroke="url(#windGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="windGrad" x1="10" y1="45" x2="310" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF8EB" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#FFF8EB" stopOpacity="0.85" />
                      <stop offset="1" stopColor="#E6C391" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rising Golden & Crimson Wish Embers on Blow Out */}
          <AnimatePresence>
            {candleState !== 'lit' &&
              wishSparkles.map((ember) => (
                <motion.div
                  key={ember.id}
                  initial={{ opacity: 0, left: `${ember.x}%`, top: `${ember.y}%`, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 0.9, 0],
                    top: `${ember.y - 18 - (ember.id % 9)}%`,
                    left: `${ember.x + ((ember.id % 5) - 2) * 3.5}%`,
                    scale: [0.5, 1.15, 0.3],
                  }}
                  transition={{ duration: 1.85, ease: 'easeOut', delay: (ember.id % 6) * 0.08 }}
                  className="absolute pointer-events-none z-20"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ember.id % 3 === 0
                        ? 'bg-[#8A1C27] shadow-[0_0_8px_#8A1C27]'
                        : 'bg-[#FFE7B3] shadow-[0_0_10px_#FFE7B3]'
                    }`}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Clean Interactive Cake Hitbox */}
          <button
            type="button"
            onClick={triggerBlowOut}
            disabled={candleState !== 'lit'}
            aria-label="Blow the birthday candles"
            className="absolute left-[10%] right-[10%] top-[47%] bottom-[12%] z-30 rounded-3xl cursor-pointer focus:outline-none"
          />

          {/* Interactive Bottom "Blow the candles" Trigger Area */}
          <button
            type="button"
            onClick={triggerBlowOut}
            disabled={candleState !== 'lit'}
            aria-label="Blow the candles"
            className="absolute left-[15%] right-[15%] bottom-[6%] h-12 z-30 flex items-center justify-center cursor-pointer rounded-2xl focus:outline-none"
          >
            <span className="sr-only">Blow the candles</span>
          </button>

          {/* Whispered Wish Confirmation Banner while transitioning */}
          <AnimatePresence>
            {candleState !== 'lit' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="absolute top-[43.5%] left-1/2 -translate-x-1/2 z-30 w-[88%] text-center pointer-events-none"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2B1417]/88 backdrop-blur-md border border-[#C8A273]/50 shadow-[0_12px_32px_rgba(30,10,14,0.35)]">
                  <Sparkles className="w-4 h-4 text-[#F3D299] shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-serif-editorial italic text-[#FAF2E8] text-sm sm:text-base tracking-wide">
                    Candles out! Let the birthday chaos begin...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
