import React from 'react';

// Cute Cartoon Spider SVG matching the exact storybook spider in Choose_Your_Magical_Adventure_Doors_ad1bbd4e.png
export const CuteCartoonSpiderSVG: React.FC<{
  size?: number;
  isExcited?: boolean;
  isBlinking?: boolean;
  className?: string;
}> = ({ size = 96, isExcited = false, isBlinking = false, className = '' }) => (
  <svg
    width={size}
    height={size * 0.9}
    viewBox="0 0 120 108"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Cute little excitement motion marks above spider (matches reference image!) */}
    <g
      className={`transition-transform duration-300 ${
        isExcited ? 'scale-115 opacity-100' : 'opacity-85'
      }`}
      stroke="#2B1218"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M22 24L15 19" />
      <path d="M18 32L10 30" />
      <path d="M98 22L105 17" />
      <path d="M102 30L110 28" />
    </g>

    {/* Left 4 cute bent cartoon legs */}
    <g
      stroke="#2B1218"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={isExcited ? ' origin-center animate-bounce' : ''}
    >
      <path d="M42 46L22 36L12 48" />
      <path d="M39 54L16 49L8 64" />
      <path d="M40 62L19 63L14 80" />
      <path d="M45 68L29 75L28 92" />

      {/* Right 4 cute bent cartoon legs */}
      <path d="M78 46L98 36L108 48" />
      <path d="M81 54L104 49L112 64" />
      <path d="M80 62L101 63L106 80" />
      <path d="M75 68L91 75L92 92" />
    </g>

    {/* Plump round dark-burgundy/plum cartoon body */}
    <ellipse cx="60" cy="54" rx="23" ry="22" fill="url(#spiderBodyGrad)" stroke="#1E0B10" strokeWidth="2.8" />

    {/* Subtle top highlight on head */}
    <ellipse cx="53" cy="40" rx="8" ry="4" transform="rotate(-15 53 40)" fill="#6E3A46" opacity="0.55" />

    {/* Big Cute Googly Cartoon Eyes */}
    {isBlinking ? (
      <>
        <path d="M45 56C48 52 54 52 57 56" stroke="#FFF8F5" strokeWidth="3" strokeLinecap="round" />
        <path d="M63 56C66 52 72 52 75 56" stroke="#FFF8F5" strokeWidth="3" strokeLinecap="round" />
      </>
    ) : (
      <>
        {/* Left Eye */}
        <circle cx="51" cy="56" r="7.2" fill="#FFF9F6" stroke="#1E0B10" strokeWidth="2" />
        <circle cx="51.5" cy="56.5" r="4" fill="#1E0B10" />
        <circle cx="49.8" cy="54.5" r="1.5" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="68" cy="56" r="6.8" fill="#FFF9F6" stroke="#1E0B10" strokeWidth="2" />
        <circle cx="67.5" cy="56.5" r="3.8" fill="#1E0B10" />
        <circle cx="66" cy="54.5" r="1.4" fill="#FFFFFF" />
      </>
    )}

    {/* Cute rosy blush cheeks when tapped/excited */}
    <ellipse
      cx="43"
      cy="62"
      rx="4.2"
      ry="2.4"
      fill="#F28B9B"
      opacity={isExcited ? 0.85 : 0.35}
    />
    <ellipse
      cx="76"
      cy="62"
      rx="4.2"
      ry="2.4"
      fill="#F28B9B"
      opacity={isExcited ? 0.85 : 0.35}
    />

    <defs>
      <radialGradient id="spiderBodyGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55 46) scale(26)">
        <stop stopColor="#4B242F" />
        <stop offset="0.7" stopColor="#2E131B" />
        <stop offset="1" stopColor="#1D0A10" />
      </radialGradient>
    </defs>
  </svg>
);

// Cute Storybook Crowned Snake Badge for Modal Companions
export const CrownedSnakeCompanionSVG: React.FC<{
  size?: number;
  isExcited?: boolean;
  className?: string;
}> = ({ size = 84, isExcited = false, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 110 110"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Little Golden Crown on top of snake head */}
    <g
      className={`transition-transform duration-300 ${
        isExcited ? '-translate-y-1.5 rotate-6' : ''
      }`}
    >
      <path
        d="M44 34L41 17L52 25L59 14L66 25L77 17L74 34H44Z"
        fill="url(#snakeCrownGrad)"
        stroke="#4A2520"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="41" cy="15" r="2" fill="#FFE6A3" />
      <circle cx="59" cy="12" r="2.2" fill="#FFE6A3" />
      <circle cx="77" cy="15" r="2" fill="#FFE6A3" />
    </g>

    {/* Blush-Ivory Snake Neck & Head */}
    <path
      d="M78 96C92 84 96 64 84 50C76 41 64 34 46 36C30 38 20 48 22 57C24 65 38 66 54 62C68 58 76 66 72 78C68 88 58 94 54 98"
      stroke="#4A222B"
      strokeWidth="20"
      strokeLinecap="round"
    />
    <path
      d="M78 96C92 84 96 64 84 50C76 41 64 34 46 36C30 38 20 48 22 57C24 65 38 66 54 62C68 58 76 66 72 78C68 88 58 94 54 98"
      stroke="url(#snakeSkinGrad)"
      strokeWidth="16"
      strokeLinecap="round"
    />

    {/* Forked Pink Tongue */}
    <path
      d="M21 58C14 60 11 64 9 69M13 62L7 62"
      stroke="#C83E53"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={isExcited ? 'animate-pulse' : ''}
    />

    {/* Cute Dark Ruby Eye with Shine */}
    <circle cx="43" cy="48" r="4.5" fill="#2A0E15" />
    <circle cx="41.5" cy="46.5" r="1.6" fill="#FFFFFF" />

    {/* Rosy Blush Cheek */}
    <ellipse cx="52" cy="53" rx="5" ry="2.8" fill="#EAA1AD" opacity="0.75" />

    <defs>
      <linearGradient id="snakeCrownGrad" x1="41" y1="14" x2="77" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF0B8" />
        <stop offset="0.5" stopColor="#E0B165" />
        <stop offset="1" stopColor="#B57E38" />
      </linearGradient>
      <linearGradient id="snakeSkinGrad" x1="22" y1="36" x2="88" y2="96" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF6F2" />
        <stop offset="0.55" stopColor="#F5D5CE" />
        <stop offset="1" stopColor="#DFB2AC" />
      </linearGradient>
    </defs>
  </svg>
);
