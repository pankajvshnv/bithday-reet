import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Check, Gift, Camera, HelpCircle, Crown, Music } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar, GothicDivider } from './GothicOrnaments';
import { CuteCartoonSpiderSVG, CrownedSnakeCompanionSVG } from './StorybookCharacters';

interface DoorSurpriseModalProps {
  doorId: number | null;
  onClose: () => void;
  onSelectDoor: (doorId: number) => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

const MEMORIES = [
  {
    id: 1,
    tag: 'CHAOS LEVEL: 100%',
    title: '“We Will Behave Tonight”',
    caption: 'Narrator: Neither of us behaved.',
    secretBack:
      'Every single time we swear it will be a calm,normal hangout, we end up making the most questionable decisions of the year.',
    doodle: '✨🕷️✨',
    rotation: '-rotate-1',
  },
  {
    id: 2,
    tag: 'ZERO BRAIN CELLS',
    title: 'Laughing at Nothing',
    caption: 'Over jokes that make zero sense to anyone else.',
    secretBack:
      'One look across the room is all it takes for both of us to lose composure at the worst possible moment.',
    doodle: '👑🐍✨',
    rotation: 'rotate-1',
  },
  {
    id: 3,
    tag: '2 AM DELUSIONS',
    title: 'Fake Business Ideas',
    caption: 'Planning a whole empire instead of sleeping.',
    secretBack:
      'According to our 2 AM plans, we should already be billionaires living on a private island by now.',
    doodle: '🌙🎂✨',
    rotation: '-rotate-1',
  },
  {
    id: 4,
    tag: 'NEXT CHAPTER',
    title: 'More Bad Ideas Ahead!',
    caption: 'Another year of unsupervised chaos.',
    secretBack:
      'Happy Birthday! Here’s to surviving another year without getting banned from any public establishments.',
    doodle: '🥂🎉👑',
    rotation: 'rotate-1',
  },
];

const GIFT_VOUCHERS = [
  {
    id: 1,
    title: 'One Free Food Run Pass',
    desc: 'Redeemable when you are "starving" but refuse to pick a restaurant for 45 minutes.',
  },
  {
    id: 2,
    title: 'One “Bail Me Out” Alibi',
    desc: 'Valid whenever you need an immediate excuse to leave a boring conversation.',
  },
  {
    id: 3,
    title: '24-Hour Roast Immunity Pass',
    desc: 'For today only, I will pretend your life choices make total sense.',
  },
];

export const DoorSurpriseModal: React.FC<DoorSurpriseModalProps> = ({
  doorId,
  onClose,
  onSelectDoor,
  isMusicPlaying = false,
  onToggleMusic,
}) => {
  // Door 1 ("Our Memories"): Flipped Polaroids & Starred Memories
  const [flippedPolaroids, setFlippedPolaroids] = useState<number[]>([]);
  const [starredMemories, setStarredMemories] = useState<number[]>([1]);

  // Door 2 ("Something for You"): Gift Box Unwrap & Claimed Vouchers
  const [giftUnwrapped, setGiftUnwrapped] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState<number[]>([]);

  // Door 3 ("One Last Surprise"): Mystery Challenge -> Grand Reveal
  const [mysteryTaps, setMysteryTaps] = useState(0);
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [crowned, setCrowned] = useState(false);

  // Cute companion tap reactions inside modal
  const [companionReaction, setCompanionReaction] = useState<string | null>(null);

  if (doorId === null) return null;

  const togglePolaroid = (id: number) => {
    soundEngine.playSparkle();
    setFlippedPolaroids((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStarMemory = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    soundEngine.playSparkle();
    setStarredMemories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUnwrapGift = () => {
    soundEngine.playDoorOpen(1);
    setGiftUnwrapped(true);
  };

  const handleClaimVoucher = (id: number) => {
    soundEngine.playSparkle();
    if (!claimedVouchers.includes(id)) {
      setClaimedVouchers((prev) => [...prev, id]);
    }
  };

  const handleTapMysteryOrb = () => {
    soundEngine.playSparkle();
    if (mysteryTaps + 1 >= 2) {
      soundEngine.playCandleBlow();
      setSurpriseRevealed(true);
    } else {
      setMysteryTaps((prev) => prev + 1);
    }
  };

  const triggerCompanionSay = (msg: string) => {
    soundEngine.playSparkle();
    setCompanionReaction(msg);
    window.setTimeout(() => {
      setCompanionReaction(null);
    }, 2400);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2A0E15]/75 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-[28px] border-2 border-[#D9A86C] shadow-[0_24px_70px_rgba(32,8,14,0.65)] overflow-hidden max-h-[90dvh] flex flex-col"
          style={{
            background:
              'radial-gradient(circle at 50% 15%, #FFF4EE 0%, #F7DFD7 55%, #ECC8BE 100%)',
          }}
        >
          {/* Storybook Modal Header */}
          <div className="flex items-center justify-between px-5 pt-3.5 pb-3 border-b border-[#6D1A28]/15 bg-[#F9E7E0]/80 shrink-0">
            <div className="flex items-center gap-2">
              <FourPointStar size={16} color="#6D1A28" glow />
              <span className="font-cinzel text-xs tracking-[0.16em] text-[#6D1A28] font-semibold">
                {doorId === 1 && 'DOOR I · OUR MEMORIES'}
                {doorId === 2 && 'DOOR II · SOMETHING FOR YOU'}
                {doorId === 3 && 'DOOR III · ONE LAST SURPRISE'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close door"
              className="min-w-[40px] min-h-[40px] -mr-1.5 flex items-center justify-center rounded-full text-[#4A1520] hover:bg-[#6D1A28]/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Companion Speech Toast inside Modal */}
          <AnimatePresence>
            {companionReaction && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-[#5E1622] text-[#FFF5EE] font-serif-editorial italic text-sm shadow-lg border border-[#E6B875] whitespace-nowrap"
              >
                {companionReaction}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable Storybook Content */}
          <div className="px-5 sm:px-7 py-5 overflow-y-auto space-y-5">
            {/* ===============================================================
                DOOR 1: OUR MEMORIES ("Let's relive the chaos!")
               =============================================================== */}
            {doorId === 1 && (
              <div className="text-center space-y-4">
                <div className="relative flex flex-col items-center">
                  {/* Cute Interactive Spider dangling in header */}
                  <button
                    type="button"
                    onClick={() => triggerCompanionSay('Tap any Polaroid to expose the truth! 🕷️✨')}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    aria-label="Tap cute cartoon spider"
                  >
                    <CuteCartoonSpiderSVG size={66} isExcited />
                  </button>

                  <h2 className="font-serif-editorial italic font-semibold text-3xl sm:text-4xl text-[#5E1522] mt-1">
                    Our Memories
                  </h2>
                  <p className="font-serif-editorial italic text-base text-[#6E303B]">
                    Let&rsquo;s relive the chaos! Tap any Polaroid to flip it over ✦
                  </p>
                  <GothicDivider className="mt-1" />
                </div>

                {/* 2x2 Polaroid Scrapbook Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                  {MEMORIES.map((mem) => {
                    const isFlipped = flippedPolaroids.includes(mem.id);
                    const isStarred = starredMemories.includes(mem.id);

                    return (
                      <div
                        key={mem.id}
                        onClick={() => togglePolaroid(mem.id)}
                        className={`group relative rounded-2xl p-3.5 bg-[#FFFDFB] border-2 border-[#E2BFB5] shadow-[0_8px_20px_rgba(90,20,32,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-1 ${mem.rotation}`}
                      >
                        {/* Golden Washi Tape on Top of Polaroid */}
                        <div className="w-14 h-3.5 bg-[#E6BE7E]/65 border border-[#C99B56]/40 rounded-sm mx-auto -mt-5 mb-2.5 rotate-2" />

                        {!isFlipped ? (
                          <>
                            {/* Polaroid Photo Illustration Frame */}
                            <div
                              className="w-full h-28 rounded-xl border border-[#DFB9AF] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden"
                              style={{
                                background:
                                  'linear-gradient(145deg, #741C2B 0%, #52111C 60%, #3A0B13 100%)',
                              }}
                            >
                              <Camera className="w-6 h-6 text-[#F9DFB5] mb-1 opacity-90" />
                              <span className="font-cinzel text-[9px] tracking-[0.16em] text-[#F5CFA0]">
                                {mem.tag}
                              </span>
                              <span className="text-xs mt-1">{mem.doodle}</span>
                            </div>

                            <div className="mt-2.5 flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-serif-editorial font-bold text-lg text-[#4B131D] leading-snug">
                                  {mem.title}
                                </h3>
                                <p className="font-serif-editorial italic text-sm text-[#703740]">
                                  {mem.caption}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => toggleStarMemory(e, mem.id)}
                                aria-label="Star this memory"
                                className="p-1.5 rounded-full hover:bg-[#F7DFD7] transition-colors cursor-pointer shrink-0"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isStarred
                                      ? 'fill-[#D99B38] text-[#8B1D2C]'
                                      : 'text-[#9E6B73]'
                                  }`}
                                />
                              </button>
                            </div>
                            <span className="block mt-1.5 font-cinzel text-[9px] tracking-widest text-[#8B1D2C]">
                              TAP TO READ BACK →
                            </span>
                          </>
                        ) : (
                          /* Back of Polaroid Handwritten Note */
                          <div className="min-h-[178px] flex flex-col justify-between p-2 bg-[#FFF8F4] rounded-xl border border-dashed border-[#D6A99E]">
                            <div className="flex items-center justify-between">
                              <span className="font-cinzel text-[9px] tracking-widest text-[#7A202E] font-semibold">
                                CLASSIFIED NOTE · #{mem.id}
                              </span>
                              <span>{mem.doodle}</span>
                            </div>
                            <p className="font-serif-editorial italic text-base text-[#3D121A] leading-relaxed my-2">
                              &ldquo;{mem.secretBack}&rdquo;
                            </p>
                            <span className="font-cinzel text-[9px] tracking-widest text-[#8B1D2C] text-right">
                              ← TAP TO FLIP BACK
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===============================================================
                DOOR 2: SOMETHING FOR YOU
               =============================================================== */}
            {doorId === 2 && (
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => triggerCompanionSay('Sss-something chaotic just for you! 👑🐍')}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    aria-label="Tap crowned snake"
                  >
                    <CrownedSnakeCompanionSVG size={70} isExcited />
                  </button>
                  <h2 className="font-serif-editorial italic font-semibold text-3xl sm:text-4xl text-[#5E1522]">
                    Something for You
                  </h2>
                  <p className="font-serif-editorial italic text-base text-[#6E303B]">
                    A little chaos, curated just for you ✦
                  </p>
                  <GothicDivider className="mt-1" />
                </div>

                {!giftUnwrapped ? (
                  /* Interactive Glowing Gift Box to Unwrap */
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-6 bg-[#631724] text-[#FFF4EE] border-2 border-[#E3B46E] shadow-xl flex flex-col items-center space-y-4"
                  >
                    <p className="font-serif-editorial italic text-lg text-[#FBE3D8] max-w-xs">
                      &ldquo;A suspiciously fancy birthday box wrapped in golden ribbon awaits...&rdquo;
                    </p>

                    <button
                      type="button"
                      onClick={handleUnwrapGift}
                      className="group relative w-28 h-28 rounded-3xl bg-[#7D1E2E] border-2 border-[#F4CE8E] shadow-[0_0_28px_rgba(244,206,142,0.5)] flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      <Gift className="w-12 h-12 text-[#FFF0C2] group-hover:rotate-12 transition-transform" />
                      <span className="font-cinzel text-[10px] tracking-[0.16em] text-[#FFF0C2] mt-1.5 font-semibold">
                        TAP TO UNWRAP
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  /* Unwrapped Storybook Birthday Note + Claimable Vouchers */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-left"
                  >
                    <div className="rounded-2xl p-5 bg-[#FFFDFB] border-2 border-[#DFB699] shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#6D1A28]/15 pb-2">
                        <span className="font-serif-editorial italic font-bold text-lg text-[#6D1A28]">
                          To My Partner in Chaos,
                        </span>
                        <span className="text-sm">👑🎉✨</span>
                      </div>
                      <p className="font-serif-editorial text-base sm:text-lg text-[#3A121A] leading-relaxed">
                        Happy Birthday! Somehow you survived another 365 days of questionable life choices, terrible sleep schedules, and unhinged jokes. May this year bring you good snacks, zero stress, and slightly better common sense.
                      </p>
                    </div>

                    {/* 3 Claimable Bestie Vouchers */}
                    <div className="space-y-2.5">
                      <span className="block font-cinzel text-[11px] tracking-[0.16em] text-[#6D1A28] font-semibold text-center">
                        OFFICIAL BEST-FRIEND COUPONS (TAP TO CLAIM)
                      </span>
                      {GIFT_VOUCHERS.map((v) => {
                        const isClaimed = claimedVouchers.includes(v.id);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleClaimVoucher(v.id)}
                            className={`w-full text-left rounded-2xl p-3.5 border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                              isClaimed
                                ? 'bg-[#6D1A28] border-[#E5B86E] text-[#FFF5EE]'
                                : 'bg-[#FFF7F3] border-[#DFB6A8] text-[#3D121A] hover:border-[#6D1A28]'
                            }`}
                          >
                            <div>
                              <h4 className="font-serif-editorial font-bold text-base sm:text-lg leading-tight">
                                {v.title}
                              </h4>
                              <p
                                className={`font-serif-editorial italic text-sm mt-0.5 ${
                                  isClaimed ? 'text-[#F7DCD4]' : 'text-[#6E3640]'
                                }`}
                              >
                                {v.desc}
                              </p>
                            </div>

                            <span
                              className={`px-3 py-1.5 rounded-xl font-cinzel text-[10px] tracking-wider font-semibold shrink-0 flex items-center gap-1 ${
                                isClaimed
                                  ? 'bg-[#E5B86E] text-[#2E0B12]'
                                  : 'bg-[#6D1A28] text-[#FFF5EE]'
                              }`}
                            >
                              {isClaimed ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>CLAIMED</span>
                                </>
                              ) : (
                                <span>CLAIM ✦</span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ===============================================================
                DOOR 3: ONE LAST SURPRISE ("Are you ready? (Probably not.)")
               =============================================================== */}
            {doorId === 3 && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => triggerCompanionSay('Are you ready?! (Definitely not!) 🕷️✨')}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <CuteCartoonSpiderSVG size={58} isExcited />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerCompanionSay('Tap the glowing question mark if you dare! 👑🐍')}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <CrownedSnakeCompanionSVG size={62} isExcited />
                  </button>
                </div>

                <div>
                  <h2 className="font-serif-editorial italic font-semibold text-3xl sm:text-4xl text-[#5E1522]">
                    One Last Surprise
                  </h2>
                  <p className="font-serif-editorial italic text-base text-[#6E303B]">
                    Are you ready? (Probably not.)
                  </p>
                  <GothicDivider className="mt-1" />
                </div>

                {!surpriseRevealed ? (
                  /* Step 1: Glowing Mystery Question Mark Challenge */
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-6 bg-[#5E1522] text-[#FFF4EE] border-2 border-[#E3B46E] shadow-xl flex flex-col items-center space-y-4"
                  >
                    <p className="font-serif-editorial italic text-lg text-[#FBE3D8]">
                      {mysteryTaps === 0
                        ? '“Behind this seal lies the final verdict on your birthday... Tap the glowing question mark twice if you can handle the truth!”'
                        : '“Almost there! One more tap to reveal the final roast! ✨”'}
                    </p>

                    <button
                      type="button"
                      onClick={handleTapMysteryOrb}
                      className="group relative w-28 h-28 rounded-full bg-[#7A1D2D] border-2 border-[#F5D090] shadow-[0_0_32px_rgba(245,208,144,0.65)] flex flex-col items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
                    >
                      <HelpCircle className="w-12 h-12 text-[#FFF1C5] animate-bounce" />
                      <span className="font-cinzel text-[10px] tracking-widest text-[#FFF1C5] mt-1 font-semibold">
                        {mysteryTaps === 0 ? 'TAP TWICE' : 'ONE MORE TAP!'}
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  /* Step 2: Grand Finale Best-Friend Roast & Celebration */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-5 sm:p-6 bg-[#FFFDFB] border-2 border-[#E2B26B] shadow-md space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D1A28] text-[#FFF2C6] font-cinzel text-xs tracking-[0.16em]">
                      <Crown className="w-4 h-4 text-[#F5C97B]" />
                      <span>CERTIFIED CHAOS LEGEND</span>
                    </div>

                    <h3 className="font-script-gothic text-5xl sm:text-6xl text-[#6D1A28] leading-none pt-1">
                      Officially Vintage!
                    </h3>

                    <p className="font-serif-editorial text-base sm:text-lg text-[#3A121A] leading-relaxed">
                      Congratulations on leveling up! You’re officially one year closer to complaining about loud noises at 9 PM. Thanks for being the funniest, most chaotic friend on the planet—now go eat cake before the spider steals it!
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playCandleBlow();
                          setCrowned(true);
                        }}
                        className={`px-4 py-2.5 min-h-[44px] rounded-xl font-serif-editorial font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          crowned
                            ? 'bg-[#E3B266] text-[#2D0B12]'
                            : 'bg-[#6D1A28] text-[#FFF5EE] hover:bg-[#821F30]'
                        }`}
                      >
                        <Crown className="w-4 h-4" />
                        <span>{crowned ? 'Chaos Crown Claimed 👑✨' : 'Claim Your Chaos Crown 👑'}</span>
                      </button>

                      {onToggleMusic && (
                        <button
                          type="button"
                          onClick={onToggleMusic}
                          className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#F7DFD7] border border-[#C9958C] text-[#4A141E] font-serif-editorial font-semibold text-sm flex items-center gap-2 hover:bg-[#F2CFC4] transition-colors cursor-pointer"
                        >
                          <Music className="w-4 h-4 text-[#6D1A28]" />
                          <span>{isMusicPlaying ? 'Pause Birthday Tune' : 'Play Birthday Tune 🎵'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Storybook Footer Switcher for the 3 Doors */}
          <div className="px-4 py-3 bg-[#F3D5CB]/90 border-t border-[#6D1A28]/15 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 1, label: 'Memories' },
                { id: 2, label: 'For You' },
                { id: 3, label: 'Surprise' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playDoorOpen(tab.id - 1);
                    onSelectDoor(tab.id);
                  }}
                  className={`px-3 py-1.5 min-h-[40px] rounded-xl font-serif-editorial font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                    doorId === tab.id
                      ? 'bg-[#6D1A28] text-[#FFF5EE] shadow-sm'
                      : 'bg-[#FFF6F2] text-[#4A1520] hover:bg-[#FCE8E1]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 min-h-[40px] rounded-xl font-serif-editorial font-semibold text-xs sm:text-sm text-[#4A1520] hover:bg-[#6D1A28]/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              All Doors
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
