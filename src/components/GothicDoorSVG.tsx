import React from 'react';

export interface DoorSpec {
  id: number;
  roman: string;
  title: string;
  subtitle: string;
  emblemLabel: string;
}

export const DOOR_SPECS: DoorSpec[] = [
  {
    id: 1,
    roman: 'I',
    title: 'The Moonlit Letter',
    subtitle: 'A wax-sealed roast & memory audit',
    emblemLabel: 'Door of the Crescent Moon',
  },
  {
    id: 2,
    roman: 'II',
    title: "The Serpent's Gift",
    subtitle: 'Chaotic surprises & questionable loot',
    emblemLabel: 'Door of the Ivory Serpent',
  },
  {
    id: 3,
    roman: 'III',
    title: 'The Crimson Sanctuary',
    subtitle: 'Final boss birthday surprise',
    emblemLabel: 'Door of the Eternal Rose',
  },
];

interface GothicDoorArtworkProps {
  doorId: number;
  isOpen: boolean;
  isUnlocked: boolean;
}

export const GothicDoorArtwork: React.FC<GothicDoorArtworkProps> = ({
  doorId,
  isOpen,
  isUnlocked,
}) => {
  return (
    <div className="relative w-full aspect-[3/5] max-w-[230px] mx-auto select-none perspective-1200">
      {/* Stationary Outer Stone/Ivory Gothic Arch Frame + Glowing Interior Behind the Door */}
      <svg
        viewBox="0 0 220 360"
        fill="none"
        className="w-full h-full drop-shadow-[0_16px_28px_rgba(38,16,20,0.28)]"
        aria-hidden="true"
      >
        {/* Outer Pointed Gothic Archway Stone Frame */}
        <path
          d="M16 346V138C16 68 62 18 110 8C158 18 204 68 204 138V346H16Z"
          fill="url(#archStoneOuter)"
          stroke="#4A2E31"
          strokeWidth="2"
        />
        <path
          d="M24 342V140C24 74 66 28 110 18C154 28 196 74 196 140V342H24Z"
          fill="#261215"
          stroke="#6E4F45"
          strokeWidth="1.4"
        />

        {/* Glowing Candlelit Sanctuary Interior (visible when the door swings open!) */}
        <path
          d="M28 340V142C28 78 68 34 110 24C152 34 192 78 192 142V340H28Z"
          fill="url(#interiorGlow)"
        />

        {/* Interior starlight & rays when door opens */}
        <g className={`transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-30'}`}>
          <circle cx="110" cy="155" r="56" fill="url(#innerSunburst)" />
          {/* Hanging inner star inside the open doorway */}
          <line x1="110" y1="26" x2="110" y2="95" stroke="#FFF2D1" strokeWidth="1" strokeOpacity="0.8" />
          <path
            d="M110 92C110 104 112 108 124 110C112 112 110 116 110 128C110 116 108 112 96 110C108 108 110 104 110 92Z"
            fill="#FFF7E2"
          />
          <circle cx="85" cy="180" r="2" fill="#FFE7B3" />
          <circle cx="138" cy="165" r="2.2" fill="#FFE7B3" />
          <circle cx="112" cy="220" r="1.8" fill="#FFE7B3" />
        </g>

        {/* Bottom Carved Stone Threshold / Pedestal (matches cake stand tone) */}
        <rect x="8" y="340" width="204" height="10" rx="4" fill="url(#pedestalGrad)" stroke="#4A2E31" strokeWidth="1.2" />
        <rect x="2" y="348" width="216" height="8" rx="3" fill="#B7A69C" stroke="#3E2528" strokeWidth="1.2" />

        <defs>
          <linearGradient id="archStoneOuter" x1="110" y1="8" x2="110" y2="346" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E5DBD3" />
            <stop offset="0.5" stopColor="#CFC1B8" />
            <stop offset="1" stopColor="#A8968C" />
          </linearGradient>
          <radialGradient id="interiorGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 165) scale(135)">
            <stop stopColor="#FFF5DC" />
            <stop offset="0.45" stopColor="#E7B374" />
            <stop offset="0.8" stopColor="#6D1A22" />
            <stop offset="1" stopColor="#240B0E" />
          </radialGradient>
          <radialGradient id="innerSunburst" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 155) scale(56)">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#FFE4A8" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FFE4A8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pedestalGrad" x1="8" y1="345" x2="212" y2="345" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A6958B" />
            <stop offset="0.5" stopColor="#E6DDD6" />
            <stop offset="1" stopColor="#9E8D83" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Swinging Gothic Door Leaf */}
      <div
        style={{
          transform: isOpen ? 'rotateY(-106deg)' : 'rotateY(0deg)',
          transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="absolute inset-0 origin-door-left preserve-3d pointer-events-none"
      >
        <svg viewBox="0 0 220 360" fill="none" className="w-full h-full">
          {/* Main Carved Ivory-Taupe Door Leaf */}
          <path
            d="M28 340V142C28 78 68 34 110 24C152 34 192 78 192 142V340H28Z"
            fill="url(#doorWoodGrad)"
            stroke="#3B2326"
            strokeWidth="2"
          />

          {/* Subtle Spiderweb Etchings on Door Surface (matches the cake surface!) */}
          <g opacity="0.32" stroke="#4A3235" strokeWidth="0.75">
            <path d="M190 145L135 165M190 145L142 195M190 145L160 225" />
            <path d="M168 153C165 168 168 176 177 183" />
            <path d="M150 160C147 180 153 194 166 205" />
            <path d="M30 250L80 235M30 250L78 268M30 250L65 295" />
            <path d="M55 242C58 254 56 263 48 272" />
          </g>

          {/* Dripping Ivory Glaze / Candle Wax Crown along upper arch (echoing the cake frosting drips!) */}
          <path
            d="M44 102C48 118 54 118 56 104C60 92 66 126 71 126C76 126 78 92 84 86C90 80 92 114 97 114C102 114 104 78 110 76C116 78 118 122 123 122C128 122 131 84 137 88C143 92 145 118 150 118C155 118 158 96 164 102C169 108 172 124 176 108C164 62 138 34 110 26C82 34 56 62 44 102Z"
            fill="url(#glazeDripGrad)"
            stroke="#B8A79D"
            strokeWidth="0.8"
          />

          {/* Recessed Gothic Panels */}
          <path
            d="M44 195V144C44 94 74 56 110 46C146 56 176 94 176 144V195H44Z"
            fill="url(#recessedPanelGrad)"
            stroke="#593E38"
            strokeWidth="1.3"
          />
          <rect
            x="44"
            y="210"
            width="132"
            height="112"
            rx="4"
            fill="url(#recessedPanelGrad)"
            stroke="#593E38"
            strokeWidth="1.3"
          />

          {/* Forged Gothic Iron Hinges on the Left */}
          <path
            d="M28 148H54C59 148 62 143 65 140C62 150 59 154 54 154H28V148Z"
            fill="#2B181A"
          />
          <path
            d="M28 286H54C59 286 62 281 65 278C62 288 59 292 54 292H28V286Z"
            fill="#2B181A"
          />

          {/* Ornate Gold Keyhole Plate & Handle on Right Side of Door */}
          <g>
            <ellipse cx="164" cy="202" rx="8" ry="15" fill="url(#goldHardware)" stroke="#3D2218" strokeWidth="1" />
            <circle cx="164" cy="198" r="3" fill="#240E10" />
            <path d="M162.5 199L161 209H167L165.5 199H162.5Z" fill="#240E10" />
            {/* Unlocked golden glow from keyhole */}
            {isUnlocked && (
              <circle cx="164" cy="202" r="10" fill="#FFE3A3" opacity="0.55" filter="blur(3px)" />
            )}
          </g>

          {/* DOOR-SPECIFIC CENTRAL EMBLEM */}
          {doorId === 1 && (
            /* DOOR I: Glowing Crescent Moon & Hanging Celestial Stars */
            <g>
              <line x1="110" y1="46" x2="110" y2="92" stroke="#6B4D3B" strokeWidth="1" />
              <circle cx="110" cy="128" r="32" fill="#FFE7B3" opacity="0.25" />
              <path
                d="M116 96C98 98 85 114 87 132C89 150 105 162 123 159C130 158 136 155 141 150C131 153 120 151 112 144C102 135 101 119 110 109C114 104 119 101 125 100C122 97 119 96 116 96Z"
                fill="url(#goldHardware)"
                stroke="#FFF7E4"
                strokeWidth="0.9"
              />
              {/* Hanging 4-point star inside lower panel */}
              <path
                d="M110 238C110 254 113 260 128 263C113 266 110 272 110 288C110 272 107 266 92 263C107 260 110 254 110 238Z"
                fill="#5E151D"
              />
              <circle cx="110" cy="263" r="2.2" fill="#F6D8A6" />
            </g>
          )}

          {doorId === 2 && (
            /* DOOR II: Coiled Ivory Albino Serpent with Ruby Eye (matching the snake on the cake!) */
            <g>
              {/* Coiled White Serpent body winding down the door */}
              <path
                d="M96 105C114 96 136 104 136 122C136 142 94 150 92 174C90 198 142 206 140 236C138 264 96 274 106 302"
                stroke="#3A2527"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M96 105C114 96 136 104 136 122C136 142 94 150 92 174C90 198 142 206 140 236C138 264 96 274 106 302"
                stroke="url(#serpentBodyGrad)"
                strokeWidth="13.5"
                strokeLinecap="round"
              />
              {/* Subtle scale highlights along serpent */}
              <path
                d="M96 105C114 96 136 104 136 122C136 142 94 150 92 174C90 198 142 206 140 236C138 264 96 274 106 302"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeDasharray="2 5"
                strokeLinecap="round"
                opacity="0.75"
              />
              {/* Serpent Head & Ruby Eye */}
              <path
                d="M82 108C86 98 98 96 104 102C108 106 102 114 90 114C84 114 80 112 82 108Z"
                fill="#F7F1EC"
                stroke="#4A3436"
                strokeWidth="1"
              />
              {/* Glowing Ruby Eye */}
              <circle cx="91" cy="105" r="2.2" fill="#9E1B28" />
              <circle cx="90.5" cy="104.5" r="0.7" fill="#FFE6EA" />
              {/* Delicate forked tongue */}
              <path d="M81 109L73 108M76 108.5L73 112" stroke="#8E1C28" strokeWidth="0.9" strokeLinecap="round" />
            </g>
          )}

          {doorId === 3 && (
            /* DOOR III: Blooming Deep Crimson Rose Emblem & Twin Striped Gothic Candles */
            <g>
              {/* Central Crimson Rose Medallion in Upper Arch */}
              <circle cx="110" cy="128" r="30" fill="#2E1115" stroke="#8C6D46" strokeWidth="1.2" />
              <circle cx="110" cy="128" r="22" fill="url(#doorRoseGrad)" />
              <path
                d="M96 126C95 116 104 109 113 111C122 113 127 123 124 132C120 141 109 144 101 139C95 135 97 130 96 126Z"
                fill="#8F222D"
                stroke="#3A090E"
                strokeWidth="0.9"
              />
              <circle cx="110" cy="127" r="4" fill="#4A0A10" stroke="#D99B78" strokeWidth="0.7" />

              {/* Striped Gothic Candles in Lower Panel (matching the cake candles!) */}
              <g>
                {/* Left candle */}
                <rect x="88" y="254" width="8" height="48" rx="2" fill="#EBDed3" stroke="#3B2326" strokeWidth="0.8" />
                <path d="M88 264L96 270M88 276L96 282M88 288L96 294" stroke="#361E21" strokeWidth="2.2" />
                <path d="M92 238C92 238 96 244 96 248.5C96 251.5 94.2 254 92 254C89.8 254 88 251.5 88 248.5C88 244 92 238 92 238Z" fill="#FFBE55" />
                <circle cx="92" cy="248" r="2.2" fill="#FFFDF5" />

                {/* Right taller candle */}
                <rect x="124" y="242" width="8" height="60" rx="2" fill="#EBDed3" stroke="#3B2326" strokeWidth="0.8" />
                <path d="M124 252L132 258M124 264L132 270M124 276L132 282M124 288L132 294" stroke="#361E21" strokeWidth="2.2" />
                <path d="M128 226C128 226 132 232 132 236.5C132 239.5 130.2 242 128 242C125.8 242 124 239.5 124 236.5C124 232 128 226 128 226Z" fill="#FFBE55" />
                <circle cx="128" cy="236" r="2.2" fill="#FFFDF5" />
              </g>
            </g>
          )}

          {/* Thorny Vines & Deep Burgundy Roses Wrapping the Door Frame (matches the cake roses!) */}
          <g>
            {/* Climbing thorny vine */}
            <path
              d="M32 325C22 275 46 235 36 182C28 135 50 92 76 58"
              stroke="#2A1417"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Top-Left Crimson Rose Cluster */}
            <g transform="translate(24, 58) scale(0.52)">
              <circle cx="50" cy="50" r="36" fill="url(#doorRoseGrad)" stroke="#29070B" strokeWidth="2" />
              <path
                d="M32 46C30 32 42 22 56 24C70 26 78 40 74 54C70 68 54 74 40 68C30 62 33 54 32 46Z"
                fill="#8C202B"
                stroke="#3A090E"
                strokeWidth="1.5"
              />
              <circle cx="52" cy="48" r="8" fill="#4A0B11" stroke="#B84B57" strokeWidth="1.2" />
            </g>

            {/* Bottom-Right Crimson Rose Cluster */}
            <g transform="translate(148, 286) scale(0.56)">
              <circle cx="50" cy="50" r="36" fill="url(#doorRoseGrad)" stroke="#29070B" strokeWidth="2" />
              <path
                d="M32 46C30 32 42 22 56 24C70 26 78 40 74 54C70 68 54 74 40 68C30 62 33 54 32 46Z"
                fill="#8C202B"
                stroke="#3A090E"
                strokeWidth="1.5"
              />
              <circle cx="52" cy="48" r="8" fill="#4A0B11" stroke="#B84B57" strokeWidth="1.2" />
            </g>
          </g>

          <defs>
            <linearGradient id="doorWoodGrad" x1="28" y1="24" x2="192" y2="340" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EFE6DE" />
              <stop offset="0.45" stopColor="#DBCFC6" />
              <stop offset="1" stopColor="#B8A79D" />
            </linearGradient>
            <linearGradient id="glazeDripGrad" x1="110" y1="26" x2="110" y2="126" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAF5F0" />
              <stop offset="0.7" stopColor="#EAE0D7" />
              <stop offset="1" stopColor="#D6C7BC" />
            </linearGradient>
            <linearGradient id="recessedPanelGrad" x1="110" y1="46" x2="110" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CEB2A6" stopOpacity="0.45" />
              <stop offset="1" stopColor="#9E8A80" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="goldHardware" x1="85" y1="95" x2="145" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF6DF" />
              <stop offset="0.5" stopColor="#DAB67E" />
              <stop offset="1" stopColor="#8E683A" />
            </linearGradient>
            <linearGradient id="serpentBodyGrad" x1="88" y1="100" x2="142" y2="302" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAF5F0" />
              <stop offset="0.5" stopColor="#E5DAD1" />
              <stop offset="1" stopColor="#C4B4A9" />
            </linearGradient>
            <radialGradient id="doorRoseGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) scale(36)">
              <stop stopColor="#9E2632" />
              <stop offset="0.65" stopColor="#63121A" />
              <stop offset="1" stopColor="#2D070B" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
