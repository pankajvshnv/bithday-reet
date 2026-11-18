import React from 'react';

// Four-point gothic celestial star matching the reference illustration
export const FourPointStar: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  glow?: boolean;
}> = ({ className = '', size = 24, color = '#7A5843', glow = false }) => (
  <svg
    width={size}
    height={size * 1.35}
    viewBox="0 0 24 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {glow && (
      <circle cx="12" cy="16" r="9" fill="url(#starGlow)" opacity="0.65" />
    )}
    <path
      d="M12 0C12 10.5 13.5 14.2 24 16C13.5 17.8 12 21.5 12 32C12 21.5 10.5 17.8 0 16C10.5 14.2 12 10.5 12 0Z"
      fill={color}
    />
    <path
      d="M6 10L18 22M18 10L6 22"
      stroke={color}
      strokeWidth="0.6"
      strokeOpacity="0.6"
    />
    <circle cx="12" cy="16" r="1.6" fill="#FFF6E5" />
    <defs>
      <radialGradient id="starGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 16) scale(9)">
        <stop stopColor="#FFE6B3" />
        <stop offset="1" stopColor="#FFE6B3" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Glowing hanging crescent moon with suspended four-point stars (matches top-center of reference)
export const HangingCrescentMoon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center pointer-events-none select-none ${className}`} aria-hidden="true">
    {/* Upper thread */}
    <div className="w-[1px] h-8 bg-gradient-to-b from-[#6B5044]/60 to-[#7A5843]/80" />
    <FourPointStar size={18} color="#6D4C3B" glow />
    <div className="w-[1px] h-4 bg-[#7A5843]/60" />
    <div className="w-1 h-1 rounded-full bg-[#6D4C3B]" />
    <div className="w-[1px] h-3 bg-[#7A5843]/40" />

    {/* Glowing Crescent Moon */}
    <div className="relative flex items-center justify-center my-0.5">
      <div className="absolute w-20 h-20 rounded-full bg-[#FFE8B8]/45 blur-xl" />
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="relative drop-shadow-[0_0_12px_rgba(255,235,190,0.85)]">
        <path
          d="M37.5 10C23.5 11.2 13 23.2 14.2 37.2C15.4 51.2 27.8 61.2 41.8 59.5C47.2 58.8 52.1 56.5 55.8 53.1C48.2 55.6 39.6 54.1 33.4 48.6C25.2 41.3 24.4 28.7 31.7 20.5C34.8 17.0 38.8 14.6 43.3 13.6C41.4 11.8 39.5 10.4 37.5 10Z"
          fill="url(#moonGrad)"
          stroke="#FFF9EB"
          strokeWidth="0.8"
        />
        {/* Tiny inner star inside moon */}
        <path
          d="M35 28C35 31 35.6 32 38.5 32.5C35.6 33 35 34 35 37C35 34 34.4 33 31.5 32.5C34.4 32 35 31 35 28Z"
          fill="#FFF8E7"
        />
        <defs>
          <linearGradient id="moonGrad" x1="14" y1="12" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF7" />
            <stop offset="0.55" stopColor="#F8E0B0" />
            <stop offset="1" stopColor="#D6AE72" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    {/* Lower hanging star below moon */}
    <div className="w-[1px] h-4 bg-[#7A5843]/50" />
    <div className="w-1 h-1 rounded-full bg-[#6D4C3B]" />
    <div className="w-[1px] h-3 bg-[#7A5843]/70" />
    <FourPointStar size={20} color="#6D4C3B" glow className="animate-star-twinkle" />
  </div>
);

// Gothic Calligraphic Divider under "Birthday!" and "Mystery Doors"
export const GothicDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 26"
    fill="none"
    className={`w-64 sm:w-72 h-6 mx-auto ${className}`}
    aria-hidden="true"
  >
    {/* Sweeping left & right tapered lines */}
    <path
      d="M20 13L138 13"
      stroke="url(#divLeft)"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M182 13L300 13"
      stroke="url(#divRight)"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    {/* Small side nodes */}
    <circle cx="132" cy="13" r="1.8" fill="#5B161D" />
    <circle cx="188" cy="13" r="1.8" fill="#5B161D" />
    <circle cx="88" cy="13" r="1.2" fill="#5B161D" opacity="0.7" />
    <circle cx="232" cy="13" r="1.2" fill="#5B161D" opacity="0.7" />
    {/* Center 4-point dark crimson diamond star */}
    <path
      d="M160 3C160 9.5 162.2 11.2 170 13C162.2 14.8 160 16.5 160 23C160 16.5 157.8 14.8 150 13C157.8 11.2 160 9.5 160 3Z"
      fill="#4E1218"
    />
    <circle cx="160" cy="13" r="1.2" fill="#E8C7A8" />
    <defs>
      <linearGradient id="divLeft" x1="20" y1="13" x2="138" y2="13" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5B161D" stopOpacity="0" />
        <stop offset="0.35" stopColor="#5B161D" stopOpacity="0.65" />
        <stop offset="1" stopColor="#4E1218" />
      </linearGradient>
      <linearGradient id="divRight" x1="300" y1="13" x2="182" y2="13" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5B161D" stopOpacity="0" />
        <stop offset="0.35" stopColor="#5B161D" stopOpacity="0.65" />
        <stop offset="1" stopColor="#4E1218" />
      </linearGradient>
    </defs>
  </svg>
);

// Detailed Dark Crimson Rose SVG matching the reference illustration
export const CrimsonRoseSVG: React.FC<{
  size?: number;
  className?: string;
  bloomed?: boolean;
}> = ({ size = 64, className = '', bloomed = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={`transition-transform duration-500 ${bloomed ? 'scale-110' : ''} ${className}`}
    aria-hidden="true"
  >
    {/* Dark gothic leaves behind the rose */}
    <path
      d="M18 52C6 42 4 26 14 18C24 26 28 40 18 52Z"
      fill="#2D1719"
      stroke="#1A0C0E"
      strokeWidth="1"
    />
    <path
      d="M82 48C94 38 96 22 86 14C76 22 72 36 82 48Z"
      fill="#381A1D"
      stroke="#1A0C0E"
      strokeWidth="1"
    />
    <path
      d="M22 78C8 76 4 62 12 52C24 56 30 68 22 78Z"
      fill="#3A181C"
    />
    <path
      d="M78 80C92 78 96 64 88 54C76 58 70 70 78 80Z"
      fill="#2B1416"
    />

    {/* Outer plush burgundy petals */}
    <path
      d="M50 12C68 10 86 24 86 44C86 64 70 84 50 86C30 84 14 64 14 44C14 24 32 10 50 12Z"
      fill="url(#roseOuter)"
      stroke="#2B070A"
      strokeWidth="1.2"
    />
    <path
      d="M22 36C16 52 26 74 46 82C64 86 82 70 82 50C82 32 66 16 48 16C32 16 26 24 22 36Z"
      fill="url(#roseMid)"
      stroke="#3B0B10"
      strokeWidth="1"
    />
    {/* Layered inner petals */}
    <path
      d="M30 46C28 32 40 22 54 24C68 26 76 40 72 54C68 68 52 74 38 68C28 62 31 54 30 46Z"
      fill="url(#roseInner)"
      stroke="#8E2934"
      strokeWidth="0.9"
    />
    <path
      d="M38 48C38 38 45 32 54 34C63 36 66 45 62 54C58 62 46 64 40 58C36 54 38 51 38 48Z"
      fill="#590F17"
      stroke="#9E333E"
      strokeWidth="0.8"
    />
    {/* Tight spiral rose heart */}
    <path
      d="M45 48C45 43 49 40 53 42C57 44 58 49 55 53C51 56 45 53 45 48Z"
      fill="#38070C"
      stroke="#B3434E"
      strokeWidth="0.8"
    />
    {/* Golden pollen/dewdrop glints when bloomed */}
    {bloomed && (
      <>
        <circle cx="51" cy="48" r="2.2" fill="#FFE6B0" />
        <circle cx="46" cy="44" r="1.3" fill="#FFF4D9" />
        <circle cx="56" cy="51" r="1.4" fill="#FFE6B0" />
      </>
    )}
    <defs>
      <radialGradient id="roseOuter" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 48) scale(38)">
        <stop stopColor="#851E29" />
        <stop offset="0.65" stopColor="#581118" />
        <stop offset="1" stopColor="#2E070B" />
      </radialGradient>
      <radialGradient id="roseMid" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(52 46) scale(30)">
        <stop stopColor="#9B2733" />
        <stop offset="0.7" stopColor="#66131B" />
        <stop offset="1" stopColor="#3B090E" />
      </radialGradient>
      <radialGradient id="roseInner" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 48) scale(22)">
        <stop stopColor="#AD313E" />
        <stop offset="0.6" stopColor="#721620" />
        <stop offset="1" stopColor="#420A10" />
      </radialGradient>
    </defs>
  </svg>
);

// Delicate Corner Spiderweb + Hanging Spider matching top-left & top-right of the reference image
export const CornerCobwebAndSpider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
    {/* Top-Left Spiderweb SVG */}
    <svg
      viewBox="0 0 220 220"
      fill="none"
      className="fixed top-0 left-0 w-44 sm:w-56 h-44 sm:h-56 opacity-55 z-10"
    >
      {/* Radial anchor threads */}
      <path d="M0 0L210 25M0 0L185 85M0 0L145 145M0 0L85 190M0 0L25 210" stroke="#4A3537" strokeWidth="0.75" />
      {/* Curved concentric web strands */}
      <path d="M42 6C38 22 36 26 24 38C18 40 12 42 5 44" stroke="#4A3537" strokeWidth="0.65" />
      <path d="M84 10C76 34 72 42 56 58C42 68 32 74 10 86" stroke="#4A3537" strokeWidth="0.65" />
      <path d="M128 16C114 50 108 62 86 86C64 104 48 114 15 130" stroke="#4A3537" strokeWidth="0.65" />
      <path d="M174 21C154 66 144 82 116 116C84 142 64 154 21 174" stroke="#4A3537" strokeWidth="0.65" />
    </svg>

    {/* Hanging Spider on silk thread on the right */}
    <div className="fixed top-0 right-[14%] sm:right-[18%] z-10 flex flex-col items-center animate-spider-bob">
      <div className="w-[1px] h-24 sm:h-32 bg-[#3A2628]/60" />
      <svg width="34" height="38" viewBox="0 0 40 44" fill="none">
        {/* Spider legs */}
        <path d="M18 18C12 12 6 8 2 12" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M17 20C10 17 4 16 1 22" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M17 23C10 24 5 27 3 34" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M18 25C13 30 10 36 11 42" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />

        <path d="M22 18C28 12 34 8 38 12" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M23 20C30 17 36 16 39 22" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M23 23C30 24 35 27 37 34" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M22 25C27 30 30 36 29 42" stroke="#1E1214" strokeWidth="1.3" strokeLinecap="round" />
        {/* Spider body */}
        <ellipse cx="20" cy="16" rx="4.2" ry="5.5" fill="#1E1214" />
        <circle cx="20" cy="24" r="3" fill="#2B181B" />
        <circle cx="19" cy="14" r="0.8" fill="#8C2D36" />
      </svg>
    </div>
  </div>
);

// Drifting Dark Crimson Rose Petals across the viewport
const PETALS = [
  { id: 1, left: '8%', delay: '0s', duration: '13s', size: 18, rotate: 25 },
  { id: 2, left: '22%', delay: '3.5s', duration: '15s', size: 14, rotate: -40 },
  { id: 3, left: '48%', delay: '7s', duration: '14s', size: 16, rotate: 15 },
  { id: 4, left: '74%', delay: '1.8s', duration: '16s', size: 19, rotate: 65 },
  { id: 5, left: '88%', delay: '5.2s', duration: '12.5s', size: 15, rotate: -20 },
  { id: 6, left: '35%', delay: '9.5s', duration: '15.5s', size: 13, rotate: 45 },
];

export const FloatingPetals: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
    {PETALS.map((p) => (
      <div
        key={p.id}
        style={{
          left: p.left,
          animation: `petal-drift ${p.duration} linear ${p.delay} infinite`,
        }}
        className="absolute -top-8 opacity-0"
      >
        <svg
          width={p.size}
          height={p.size * 1.25}
          viewBox="0 0 24 30"
          fill="none"
          style={{ transform: `rotate(${p.rotate}deg)` }}
        >
          <path
            d="M12 1C5 5 1 14 4 22C7 28 15 29 19 23C23 16 19 5 12 1Z"
            fill="url(#petalFill)"
          />
          <path
            d="M12 3C11 12 11 19 14 26"
            stroke="#2B070B"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />
          <defs>
            <linearGradient id="petalFill" x1="4" y1="2" x2="19" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#851F2A" />
              <stop offset="0.6" stopColor="#561017" />
              <stop offset="1" stopColor="#2E080C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ))}
  </div>
);
