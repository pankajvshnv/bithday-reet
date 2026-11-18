import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  X,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FourPointStar } from './GothicOrnaments';
import { CuteCartoonSpiderSVG, CrownedSnakeCompanionSVG } from './StorybookCharacters';

export interface SurpriseVariant {
  badge: string;
  headline: string;
  message: string;
  subtext: string;
  emojiAnim: string;
  spiderComment: string;
  snakeComment: string;
}

export interface RoomObjectConfig {
  id: string;
  name: string;
  hintLabel: string;
  soundType: 'bubble' | 'fanfare' | 'dice' | 'boing' | 'oracle' | 'whistle';
  hitboxStyle: React.CSSProperties;
  glowStyle: React.CSSProperties;
  surprises: SurpriseVariant[];
}

const ROOM_OBJECTS: RoomObjectConfig[] = [
  {
    id: 'potion',
    name: 'Mystery Potion Bottle (??)',
    hintLabel: 'Drink at your own risk 🧪',
    soundType: 'bubble',
    hitboxStyle: { left: '4.5%', top: '32.0%', width: '25.0%', height: '19.5%' },
    glowStyle: { left: '16.5%', top: '42.5%' },
    surprises: [
      {
        badge: 'MAGICAL CURE #1 · BUBBLING BREW',
        headline: 'Potion of Common Sense',
        message:
          'Claims to provide 2 minutes of common sense. Side effect: May not work on the subject.',
        subtext: 'Choose Your Magical Cure...',
        emojiAnim: '🧪🫧✨',
        spiderComment: '2 minutes is still a new record! 🕷️🫧',
        snakeComment: 'Subject appears completely immune! 👑🐍',
      },
      {
        badge: 'MAGICAL CURE #2 · RARE ELIXIR',
        headline: 'Potion of Silence',
        message:
          'Temporarily reduces unnecessary talking. Warning: Extremely rare and currently out of stock.',
        subtext: 'Choose Your Magical Cure...',
        emojiAnim: '🧪🤫✨',
        spiderComment: 'Sold out immediately, obviously! 🕷️💀',
        snakeComment: 'Even alchemy cannot stop the yapping! 👑🐍',
      },
      {
        badge: 'MAGICAL CURE #3 · BRAIN UPGRADE',
        headline: 'Potion of Intelligence',
        message:
          'Promises an instant brain upgrade. Side effect: Installation failed. Insufficient storage.',
        subtext: 'Choose Your Magical Cure...',
        emojiAnim: '🧪🧠✨',
        spiderComment: 'Error 404: Storage full of memes! 🕷️😂',
        snakeComment: 'Try deleting some brainrot first! 👑🐍',
      },
      {
        badge: 'MAGICAL CURE #4 · ADULTING BREW',
        headline: 'Potion of Responsibility',
        message:
          'Supposed to make you responsible. Side effect: Subject may experience sudden sleepiness.',
        subtext: 'Choose Your Magical Cure...',
        emojiAnim: '🧪😴✨',
        spiderComment: 'Instant nap mode triggered! 🕷️💤',
        snakeComment: 'Allergic to responsibilities, as usual! 👑🐍',
      },
      {
        badge: 'MAGICAL CURE #5 · TRUTH TONIC',
        headline: 'Potion of Reality Check',
        message:
          "Makes you see yourself from someone else's perspective. Warning: May cause dramatic reactions and denial.",
        subtext: 'Choose Your Magical Cure...',
        emojiAnim: '🧪🪞✨',
        spiderComment: 'Cue the dramatic gasp in 3... 2... 1! 🕷️🎭',
        snakeComment: '100% denial guaranteed! 👑🐍',
      },
    ],
  },
  {
    id: 'giftbox',
    name: 'Royal Star Gift Box',
    hintLabel: 'Unwrap a random gift 🎁',
    soundType: 'fanfare',
    hitboxStyle: { left: '33.0%', top: '32.8%', width: '34.5%', height: '21.8%' },
    glowStyle: { left: '50.2%', top: '44.0%' },
    surprises: [
      {
        badge: 'GIFT OPTION #1 · ROYAL EGO',
        headline: 'Invisible Crown 👑',
        message:
          'For the queen who thinks the entire universe revolves around her.',
        subtext: 'A Little Something For You...',
        emojiAnim: '🎁👑✨',
        spiderComment: 'Fits your main-character syndrome! 🕷️👑',
        snakeComment: 'Invisible, just like your humility! 👑🐍',
      },
      {
        badge: 'GIFT OPTION #2 · FRAGILE ITEM',
        headline: 'Emergency Braincell 🧠',
        message:
          'One braincell. Handle with care. Please return after use.',
        subtext: 'A Little Something For You...',
        emojiAnim: '🎁🧠✨',
        spiderComment: 'Please don’t lose it in 5 minutes! 🕷️🧠',
        snakeComment: 'Strictly a loaner, return it intact! 👑🐍',
      },
      {
        badge: 'GIFT OPTION #3 · OUT OF STOCK',
        headline: 'Premium Patience Jar 🫙',
        message:
          "For everyone who has to deal with you. Unfortunately, it's empty.",
        subtext: 'A Little Something For You...',
        emojiAnim: '🎁🫙✨',
        spiderComment: 'Used up the last drop yesterday! 🕷️💀',
        snakeComment: 'Bone dry, thanks to your antics! 👑🐍',
      },
      {
        badge: 'GIFT OPTION #4 · SELF REFLECTION',
        headline: 'Mirror of Truth 🪞',
        message:
          'A magical mirror that shows you exactly how annoying you can be.',
        subtext: 'A Little Something For You...',
        emojiAnim: '🎁🪞✨',
        spiderComment: '4K Ultra-HD reality check! 🕷️🪞',
        snakeComment: 'Look closely and take notes! 👑🐍',
      },
      {
        badge: 'GIFT OPTION #5 · CHAMPIONSHIP',
        headline: 'Golden Trophy 🏆',
        message:
          "Congratulations! You've won the award for making simple things unnecessarily complicated.",
        subtext: 'A Little Something For You...',
        emojiAnim: '🎁🏆✨',
        spiderComment: 'Undefeated world champion! 🕷️🏆',
        snakeComment: 'First place in overcomplicating life! 👑🐍',
      },
    ],
  },
  {
    id: 'dice',
    name: 'Floating Magical Dice',
    hintLabel: 'Roll for a birthday roast 🎲',
    soundType: 'dice',
    hitboxStyle: { left: '75.0%', top: '37.0%', width: '22.5%', height: '14.5%' },
    glowStyle: { left: '86.2%', top: '44.2%' },
    surprises: [
      {
        badge: 'DICE ROLL · ROAST #1',
        headline: 'Congratulations! 🎲',
        message:
          'You have won absolutely nothing. Just like your contribution to group projects.',
        subtext: 'Maybe the next roll will fix your life. Probably not.',
        emojiAnim: '🎲💀😂✨',
        spiderComment: 'Zero contribution, 100% credit! 🕷️👏',
        snakeComment: 'Brutal roll right out the gate! 👑🐍',
      },
    ],
  },
  {
    id: 'letter',
    name: 'Mysterious Crown-Sealed Letter',
    hintLabel: 'Open for roasts & chaos notes ✉️',
    soundType: 'boing',
    hitboxStyle: { left: '3.0%', top: '53.5%', width: '36.0%', height: '18.0%' },
    glowStyle: { left: '21.5%', top: '62.5%' },
    surprises: [
      {
        badge: 'SEALED LETTER #1 · FUTURE SELF',
        headline: 'From Your Future Self',
        message:
          "Dear Me, I hope you've finally become responsible. Anyway, I know that's asking too much.",
        subtext: 'A Few Words For You...',
        emojiAnim: '✉️📜✨',
        spiderComment: 'Future you already gave up! 🕷️💀',
        snakeComment: 'Zero expectations, zero disappointment! 👑🐍',
      },
      {
        badge: 'SEALED LETTER #2 · SECRET ADMIRER',
        headline: 'Secret Admirer',
        message:
          "I've been watching you for a while. Your confidence is impressive, especially considering the decisions you make.",
        subtext: 'A Few Words For You...',
        emojiAnim: '✉️👀✨',
        spiderComment: '100% confidence, 0% plan! 🕷️😂',
        snakeComment: 'Truly a fascinating specimen! 👑🐍',
      },
      {
        badge: 'SEALED LETTER #3 · APPRECIATION',
        headline: 'Appreciation Letter',
        message:
          'Thank you for being such a wonderful friend. Your ability to irritate people is truly unmatched.',
        subtext: 'A Few Words For You...',
        emojiAnim: '✉️🏆✨',
        spiderComment: 'A world-record menace! 🕷️🏅',
        snakeComment: 'Unmatched talent in chaos! 👑🐍',
      },
      {
        badge: 'SEALED LETTER #4 · THE UNIVERSE',
        headline: 'From the Universe',
        message:
          "Dear Human, we've received your requests. Unfortunately, we're currently busy trying to understand your behaviour.",
        subtext: 'A Few Words For You...',
        emojiAnim: '✉️🌌✨',
        spiderComment: 'Even the cosmos is confused! 🕷️🔮',
        snakeComment: 'System error in the stars! 👑🐍',
      },
      {
        badge: 'SEALED LETTER #5 · EMERGENCY NOTICE',
        headline: 'Emergency Letter',
        message:
          'URGENT! Your daily drama levels have exceeded the recommended limit. Please contact someone who has patience.',
        subtext: 'A Few Words For You...',
        emojiAnim: '✉️🚨✨',
        spiderComment: 'Patience not found in this room! 🕷️🚨',
        snakeComment: 'Drama meter officially broken! 👑🐍',
      },
    ],
  },
  {
    id: 'crystalball',
    name: 'Galaxy Crystal Ball',
    hintLabel: 'Peer into your chaotic future 🔮',
    soundType: 'oracle',
    hitboxStyle: { left: '41.5%', top: '57.5%', width: '25.5%', height: '17.0%' },
    glowStyle: { left: '54.2%', top: '65.5%' },
    surprises: [
      {
        badge: 'CRYSTAL VISION #1 · CAREER PREDICTION',
        headline: 'Career Prediction',
        message:
          'A bright future awaits you. Unfortunately, your laziness has already applied for the position.',
        subtext: 'The Universe Has Spoken...',
        emojiAnim: '🔮🌌✨',
        spiderComment: 'Your laziness already got promoted! 🕷️🔮',
        snakeComment: 'Exposed by the cosmos! 👑🐍',
      },
      {
        badge: 'CRYSTAL VISION #2 · INTELLIGENCE PREDICTION',
        headline: 'Intelligence Prediction',
        message:
          'The universe sees great potential in you. It is still waiting for you to use it.',
        subtext: 'The Universe Has Spoken...',
        emojiAnim: '🔮🧠✨',
        spiderComment: 'Still waiting since day one! 🕷️💀',
        snakeComment: 'Unboxed potential, literally! 👑🐍',
      },
      {
        badge: 'CRYSTAL VISION #3 · FUTURE PREDICTION',
        headline: 'Future Prediction',
        message:
          'You will achieve great things someday. Today is apparently not that day.',
        subtext: 'The Universe Has Spoken...',
        emojiAnim: '🔮🌟✨',
        spiderComment: 'Try again tomorrow, maybe! 🕷️😂',
        snakeComment: 'The stars said not today! 👑🐍',
      },
      {
        badge: 'CRYSTAL VISION #4 · PERSONALITY PREDICTION',
        headline: 'Personality Prediction',
        message:
          'The stars have studied your personality. Even they need a moment to recover.',
        subtext: 'The Universe Has Spoken...',
        emojiAnim: '🔮🪐✨',
        spiderComment: 'Too chaotic even for astronomy! 🕷️✨',
        snakeComment: 'The constellations are exhausted! 👑🐍',
      },
      {
        badge: 'CRYSTAL VISION #5 · SECRET PREDICTION',
        headline: 'Secret Prediction',
        message:
          'The crystal ball knows everything. Especially that one embarrassing thing you pretend never happened.',
        subtext: 'The Universe Has Spoken...',
        emojiAnim: '🔮👀✨',
        spiderComment: 'We ALL remember that day! 🕷️📸',
        snakeComment: 'Your secret is safe... mostly! 👑🐍',
      },
    ],
  },
  {
    id: 'scroll',
    name: 'Mystery Scroll (?)',
    hintLabel: 'Unroll the secret scroll 📜',
    soundType: 'whistle',
    hitboxStyle: { left: '69.0%', top: '54.0%', width: '28.5%', height: '20.0%' },
    glowStyle: { left: '83.2%', top: '64.0%' },
    surprises: [
      {
        badge: 'ANCIENT SCROLL #1 · ROYAL COMMITTEE',
        headline: 'Royal Investigation Report',
        message:
          'After months of investigation, the royal committee has concluded that you are the main reason common sense needs protection.',
        subtext: 'Ancient Scrolls of Truth...',
        emojiAnim: '📜🔍✨',
        spiderComment: 'Common sense is in witness protection! 🕷️📜',
        snakeComment: 'Signed and stamped by the committee! 👑🐍',
      },
      {
        badge: 'ANCIENT SCROLL #2 · OFFICIAL AWARD',
        headline: 'Certificate of Extraordinary Uselessness',
        message:
          'This certificate proudly recognises your exceptional ability to do absolutely nothing while remaining exhausted.',
        subtext: 'Ancient Scrolls of Truth...',
        emojiAnim: '📜🏅✨',
        spiderComment: 'Tired from doing literally nothing! 🕷️💀',
        snakeComment: 'A truly unmatched talent! 👑🐍',
      },
      {
        badge: 'ANCIENT SCROLL #3 · FORETOLD LEGEND',
        headline: 'Ancient Prophecy',
        message:
          'An ancient prophecy foretold that one day a person would possess unlimited confidence and questionable intelligence. Congratulations, we found you.',
        subtext: 'Ancient Scrolls of Truth...',
        emojiAnim: '📜🔮✨',
        spiderComment: 'The chosen one of chaos! 🕷️😂',
        snakeComment: 'The prophecy was 100% accurate! 👑🐍',
      },
      {
        badge: 'ANCIENT SCROLL #4 · PUBLIC SAFETY',
        headline: 'Public Warning Notice',
        message:
          'WARNING: Approaching this individual may result in unnecessary arguments, random drama and severe headaches.',
        subtext: 'Ancient Scrolls of Truth...',
        emojiAnim: '📜⚠️✨',
        spiderComment: 'Proceed at your own risk! 🕷️⚠️',
        snakeComment: 'Consider yourselves officially warned! 👑🐍',
      },
      {
        badge: 'ANCIENT SCROLL #5 · FINAL SENTENCE',
        headline: 'Royal Court Verdict',
        message:
          "After reviewing years of evidence, the court finds you guilty of being dramatic, unnecessarily complicated and impossible to explain. Sentence: Continue being everyone's headache.",
        subtext: 'Ancient Scrolls of Truth...',
        emojiAnim: '📜⚖️✨',
        spiderComment: 'Guilty on all counts, no appeal! 🕷️⚖️',
        snakeComment: 'Court is adjourned! 👑🐍',
      },
    ],
  },
  {
    id: 'treasurechest',
    name: 'Enchanted Spellbooks & Secret Stash',
    hintLabel: 'Unlock the hidden spellbook stash 🗝️',
    soundType: 'fanfare',
    hitboxStyle: { left: '2.0%', top: '72.0%', width: '24.0%', height: '24.0%' },
    glowStyle: { left: '12.0%', top: '84.0%' },
    surprises: [
      {
        badge: 'SECRET STASH #1 · GOLDEN LOOT',
        headline: 'You Found the Hidden Birthday Stash! 🗝️💎',
        message:
          'Tucked inside the ancient books was your birthday stat buff: +100 Comedy, +100 Snack Capacity, and +0 Patience for annoying people!',
        subtext: 'Secret Explorer Achievement Unlocked ✨',
        emojiAnim: '🗝️💎⚡✨',
        spiderComment: 'Ooh, you found the secret stash! 🕷️💎',
        snakeComment: 'Clever eyes, birthday legend! 👑🐍',
      },
      {
        badge: 'SECRET STASH #2 · ANCIENT SPELLBOOK',
        headline: 'Page 404: Common Sense Not Found 📖🪄',
        message:
          'You opened the ancient spellbook of wisdom... and all the pages were blank! Looks like we’re winging it again this year.',
        subtext: 'Vibes: 100% · Plan: 0%',
        emojiAnim: '📖🪄🌟😂',
        spiderComment: 'Winging it is our specialty! 🕷️🪄',
        snakeComment: 'Who needs a plan anyway?! 👑🐍',
      },
    ],
  },
  {
    id: 'hourglass',
    name: 'Candlelit Hourglass of Time',
    hintLabel: 'Tap the glowing candle & hourglass ⏳',
    soundType: 'oracle',
    hitboxStyle: { left: '78.0%', top: '72.0%', width: '20.5%', height: '26.0%' },
    glowStyle: { left: '90.5%', top: '85.0%' },
    surprises: [
      {
        badge: 'TIME MAGIC #1 · GOLDEN SANDS',
        headline: 'Official “5 Minutes Away” Converter ⏳🕯️',
        message:
          'According to this magical hourglass, whenever you text "I’m 5 minutes away," it actually means you just picked up your towel and haven’t even left the house yet.',
        subtext: 'Time Distortion Level: Extreme',
        emojiAnim: '⏳🕯️🏃💨',
        spiderComment: 'Why are you always on your own timezone?! 🕷️⏳',
        snakeComment: 'Exposed by the hourglass! 👑🐍',
      },
      {
        badge: 'TIME MAGIC #2 · ETERNAL FLAME',
        headline: 'One Bonus Birthday Wish Granted! 🕯️🌟',
        message:
          'You found the secret corner candle! That means you legally get ONE extra bonus birthday wish—and no, wishing for infinite wishes still doesn’t count.',
        subtext: 'Make your bonus wish right now!',
        emojiAnim: '🕯️🌟💫🎉',
        spiderComment: 'Double wishes!! Don’t waste it! 🕷️✨',
        snakeComment: 'Choose wisely, birthday star! 👑🐍',
      },
    ],
  },
];

const SPIDER_IDLE_LINES = [
  'Tap any object! They roast you differently every time! 🕷️✨',
  'Try the purple ?? potion bottle! 🧪',
  'Click the floating dice on the right if you dare! 🎲',
  'Did you open the crown-sealed letter yet? 📜',
];

const SNAKE_IDLE_LINES = [
  'Tap something... if you dare! 🐍',
  'Tap the same object again for a NEW surprise! 👑🐍',
  'Peer into the galaxy crystal ball! 🔮✨',
  'Every single object in this room is chaotic!',
];

const DICE_ROAST_MESSAGES: { headline: string; body: string }[] = [
  {
    headline: 'Congratulations!',
    body: 'You have won absolutely nothing.\nJust like your contribution\nto group projects.',
  },
  {
    headline: 'Impressive Roll!',
    body: 'The dice tried to calculate your\ncommon sense, but unfortunately it\ndoesn’t roll into the negatives.',
  },
  {
    headline: 'Plot Twist!',
    body: 'You rolled 100% delusion and\n0% life skills. Honestly, how have\nyou survived this long?',
  },
  {
    headline: 'Tragic News!',
    body: 'Another year older, and your\ndecision-making still runs on two\nbrain cells fighting for third place.',
  },
  {
    headline: 'Critical Miss!',
    body: 'Your birthday luck is almost as\nquestionable as your sleep schedule\nand your daily life choices.',
  },
  {
    headline: 'Rare Achievement!',
    body: 'You unlocked “Professional Overthinker”\n— creating 47 fake scenarios\nbefore breakfast every day.',
  },
];

const CRYSTAL_BALL_PREDICTIONS: { category: string; quote: string }[] = [
  {
    category: 'Career Prediction',
    quote:
      '“A bright future awaits you. Unfortunately, your laziness has already applied for the position.”',
  },
  {
    category: 'Intelligence Prediction',
    quote:
      '“The universe sees great potential in you. It is still waiting for you to use it.”',
  },
  {
    category: 'Future Prediction',
    quote:
      '“You will achieve great things someday. Today is apparently not that day.”',
  },
  {
    category: 'Personality Prediction',
    quote:
      '“The stars have studied your personality. Even they need a moment to recover.”',
  },
  {
    category: 'Secret Prediction',
    quote:
      '“The crystal ball knows everything. Especially that one embarrassing thing you pretend never happened.”',
  },
];

const POTION_CURES: { name: string; quote: string }[] = [
  {
    name: 'Potion of Common Sense',
    quote:
      '“Claims to provide 2 minutes of common sense. Side effect: May not work on the subject.”',
  },
  {
    name: 'Potion of Silence',
    quote:
      '“Temporarily reduces unnecessary talking. Warning: Extremely rare and currently out of stock.”',
  },
  {
    name: 'Potion of Intelligence',
    quote:
      '“Promises an instant brain upgrade. Side effect: Installation failed. Insufficient storage.”',
  },
  {
    name: 'Potion of Responsibility',
    quote:
      '“Supposed to make you responsible. Side effect: Subject may experience sudden sleepiness.”',
  },
  {
    name: 'Potion of Reality Check',
    quote:
      '“Makes you see yourself from someone else’s perspective. Warning: May cause dramatic reactions and denial.”',
  },
];

const SEALED_LETTERS: { title: string; quote: string }[] = [
  {
    title: 'From Your Future Self',
    quote:
      '“Dear Me, I hope you’ve finally become responsible. Anyway, I know that’s asking too much.”',
  },
  {
    title: 'Secret Admirer',
    quote:
      '“I’ve been watching you for a while. Your confidence is impressive, especially considering the decisions you make.”',
  },
  {
    title: 'Appreciation Letter',
    quote:
      '“Thank you for being such a wonderful friend. Your ability to irritate people is truly unmatched.”',
  },
  {
    title: 'From the Universe',
    quote:
      '“Dear Human, we’ve received your requests. Unfortunately, we’re currently busy trying to understand your behaviour.”',
  },
  {
    title: 'Emergency Letter',
    quote:
      '“URGENT! Your daily drama levels have exceeded the recommended limit. Please contact someone who has patience.”',
  },
];

const GIFT_BOX_OPTIONS: { name: string; icon: string; shortLabel: string; quote: string }[] = [
  {
    name: 'Invisible Crown 👑',
    icon: '👑',
    shortLabel: 'Crown',
    quote:
      '“For the queen who thinks the entire universe revolves around her.”',
  },
  {
    name: 'Emergency Braincell 🧠',
    icon: '🧠',
    shortLabel: 'Braincell',
    quote:
      '“One braincell. Handle with care. Please return after use.”',
  },
  {
    name: 'Premium Patience Jar 🫙',
    icon: '🫙',
    shortLabel: 'Patience',
    quote:
      '“For everyone who has to deal with you. Unfortunately, it’s empty.”',
  },
  {
    name: 'Mirror of Truth 🪞',
    icon: '🪞',
    shortLabel: 'Mirror',
    quote:
      '“A magical mirror that shows you exactly how annoying you can be.”',
  },
  {
    name: 'Golden Trophy 🏆',
    icon: '🏆',
    shortLabel: 'Trophy',
    quote:
      '“Congratulations! You’ve won the award for making simple things unnecessarily complicated.”',
  },
];

const ANCIENT_SCROLLS_OF_TRUTH: { title: string; shortLabel: string; quote: string }[] = [
  {
    title: 'Royal Investigation Report',
    shortLabel: 'Report',
    quote:
      '“After months of investigation, the royal committee has concluded that you are the main reason common sense needs protection.”',
  },
  {
    title: 'Certificate of Extraordinary Uselessness',
    shortLabel: 'Certificate',
    quote:
      '“This certificate proudly recognises your exceptional ability to do absolutely nothing while remaining exhausted.”',
  },
  {
    title: 'Ancient Prophecy',
    shortLabel: 'Prophecy',
    quote:
      '“An ancient prophecy foretold that one day a person would possess unlimited confidence and questionable intelligence. Congratulations, we found you.”',
  },
  {
    title: 'Public Warning Notice',
    shortLabel: 'Warning',
    quote:
      '“WARNING: Approaching this individual may result in unnecessary arguments, random drama and severe headaches.”',
  },
  {
    title: 'Royal Court Verdict',
    shortLabel: 'Verdict',
    quote:
      '“After reviewing years of evidence, the court finds you guilty of being dramatic, unnecessarily complicated and impossible to explain. Sentence: Continue being everyone’s headache.”',
  },
];

interface SomethingForYouScreenProps {
  onBackToDoors: () => void;
}

export const SomethingForYouScreen: React.FC<SomethingForYouScreenProps> = ({
  onBackToDoors,
}) => {
  // Track how many times each object has been tapped so repeated taps cycle through different surprises!
  const [tapCounts, setTapCounts] = useState<Record<string, number>>({});
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const [activeVariantIdx, setActiveVariantIdx] = useState<number>(0);
  const [bouncingObjectId, setBouncingObjectId] = useState<string | null>(null);

  // Dedicated Parchment Popup state for the Dice
  const [isDicePopupOpen, setIsDicePopupOpen] = useState(false);
  const [diceRoastIdx, setDiceRoastIdx] = useState<number>(0);
  const [diceRollCount, setDiceRollCount] = useState<number>(0);
  const [healedDicePopupSrc, setHealedDicePopupSrc] = useState<string | null>(null);

  // Dedicated Fortune-Telling Popup state for the Crystal Ball
  const [isCrystalBallPopupOpen, setIsCrystalBallPopupOpen] = useState(false);
  const [crystalPredictionIdx, setCrystalPredictionIdx] = useState<number>(0);
  const [crystalRevealCount, setCrystalRevealCount] = useState<number>(0);
  const [crystalBallSpriteSrc, setCrystalBallSpriteSrc] = useState<string | null>(null);

  // Dedicated Magical Cure Popup state for the Potion Bottle
  const [isPotionPopupOpen, setIsPotionPopupOpen] = useState(false);
  const [potionCureIdx, setPotionCureIdx] = useState<number>(0);
  const [potionDrinkCount, setPotionDrinkCount] = useState<number>(0);
  const [potionSpriteSrc, setPotionSpriteSrc] = useState<string | null>(null);

  // Dedicated Letter-Opening Popup state for the Crown-Sealed Letter
  const [isLetterPopupOpen, setIsLetterPopupOpen] = useState(false);
  const [letterIdx, setLetterIdx] = useState<number>(0);
  const [letterOpenCount, setLetterOpenCount] = useState<number>(0);
  const [letterSpriteSrc, setLetterSpriteSrc] = useState<string | null>(null);

  // Dedicated Gift Box Popup state for the Royal Star Gift Box
  const [isGiftBoxPopupOpen, setIsGiftBoxPopupOpen] = useState(false);
  const [giftOptionIdx, setGiftOptionIdx] = useState<number>(0);
  const [giftOpenCount, setGiftOpenCount] = useState<number>(0);
  const [giftBoxSpriteSrc, setGiftBoxSpriteSrc] = useState<string | null>(null);

  // Dedicated Ancient Scrolls Popup state for the Mystery Scroll
  const [isScrollPopupOpen, setIsScrollPopupOpen] = useState(false);
  const [scrollOptionIdx, setScrollOptionIdx] = useState<number>(0);
  const [scrollUnrollCount, setScrollUnrollCount] = useState<number>(0);
  const [scrollSpriteSrc, setScrollSpriteSrc] = useState<string | null>(null);

  // Spider & Crowned Snake states
  const [spiderBlinking, setSpiderBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [spiderSpeech, setSpiderSpeech] = useState<string | null>(null);
  const [spiderTapCount, setSpiderTapCount] = useState(0);

  const [snakeExcited, setSnakeExcited] = useState(false);
  const [snakeSpeech, setSnakeSpeech] = useState<string | null>(null);
  const [snakeTapCount, setSnakeTapCount] = useState(0);

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeHeadCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeObject = ROOM_OBJECTS.find((o) => o.id === activeObjectId) || null;
  const activeSurprise =
    activeObject ? activeObject.surprises[activeVariantIdx % activeObject.surprises.length] : null;

  // Total unique surprises discovered counter
  const totalTaps = Object.values(tapCounts).reduce((acc, n) => acc + n, 0);

  // Little eye animation for the cute cartoon spider
  useEffect(() => {
    const gazes = [
      { x: 0, y: 0 },
      { x: 1.3, y: 1.1 },
      { x: -1.2, y: 0.8 },
      { x: 0.8, y: -0.6 },
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
    }, 1900);
    return () => clearInterval(timer);
  }, []);

  // Extract Crowned Snake Head Sprite, Crystal Ball Sprite, & heal background + baked-in hearts
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Something_for_You__Magical_Surprises_220cd1d4.png';
    img.onload = () => {
      const w = img.naturalWidth || 941;
      const h = img.naturalHeight || 1672;

      const snakeCanvas = snakeHeadCanvasRef.current;
      if (snakeCanvas) {
        const sx = Math.round(w * 0.742);
        const sy = Math.round(h * 0.068);
        const sw = Math.round(w * 0.195);
        const sh = Math.round(h * 0.078);
        snakeCanvas.width = sw;
        snakeCanvas.height = sh;
        const sCtx = snakeCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          const sData = sCtx.getImageData(0, 0, sw, sh);
          const d = sData.data;
          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const envEdge = Math.min(x, y, sw - 1 - x, sh - 1 - y);
              const i = (y * sw + x) * 4;
              if (envEdge < 8) {
                d[i + 3] = Math.round((envEdge / 8) * 255);
              }
            }
          }
          sCtx.putImageData(sData, 0, 0);
        }
      }

      // Extract the existing Crystal Ball artwork with a soft vignette for the Fortune-Telling screen
      const cbX = Math.round(w * 0.39);
      const cbY = Math.round(h * 0.568);
      const cbW = Math.round(w * 0.30);
      const cbH = Math.round(h * 0.175);
      const cbCanvas = document.createElement('canvas');
      cbCanvas.width = cbW;
      cbCanvas.height = cbH;
      const cbCtx = cbCanvas.getContext('2d');
      if (cbCtx) {
        cbCtx.drawImage(img, cbX, cbY, cbW, cbH, 0, 0, cbW, cbH);
        const cbData = cbCtx.getImageData(0, 0, cbW, cbH);
        const cd = cbData.data;
        const cx = cbW / 2;
        const cy = cbH / 2;
        const rx = cbW * 0.48;
        const ry = cbH * 0.48;
        for (let y = 0; y < cbH; y++) {
          for (let x = 0; x < cbW; x++) {
            const normDist = Math.sqrt(
              Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2)
            );
            const i = (y * cbW + x) * 4;
            if (normDist > 1) {
              cd[i + 3] = 0;
            } else if (normDist > 0.72) {
              const alpha = Math.cos(((normDist - 0.72) / 0.28) * (Math.PI / 2));
              cd[i + 3] = Math.round(Math.max(0, alpha) * 255);
            }
          }
        }
        cbCtx.putImageData(cbData, 0, 0);
        setCrystalBallSpriteSrc(cbCanvas.toDataURL('image/png'));
      }

      // Extract the existing Potion Bottle illustration with a soft vignette for the Magical Cure screen
      const pX = Math.round(w * 0.035);
      const pY = Math.round(h * 0.305);
      const pW = Math.round(w * 0.27);
      const pH = Math.round(h * 0.215);
      const pCanvas = document.createElement('canvas');
      pCanvas.width = pW;
      pCanvas.height = pH;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        pCtx.drawImage(img, pX, pY, pW, pH, 0, 0, pW, pH);
        const pData = pCtx.getImageData(0, 0, pW, pH);
        const pd = pData.data;
        const pcx = pW / 2;
        const pcy = pH / 2;
        const prx = pW * 0.48;
        const pry = pH * 0.48;
        for (let y = 0; y < pH; y++) {
          for (let x = 0; x < pW; x++) {
            const normDist = Math.sqrt(
              Math.pow((x - pcx) / prx, 2) + Math.pow((y - pcy) / pry, 2)
            );
            const i = (y * pW + x) * 4;
            if (normDist > 1) {
              pd[i + 3] = 0;
            } else if (normDist > 0.72) {
              const alpha = Math.cos(((normDist - 0.72) / 0.28) * (Math.PI / 2));
              pd[i + 3] = Math.round(Math.max(0, alpha) * 255);
            }
          }
        }
        pCtx.putImageData(pData, 0, 0);
        setPotionSpriteSrc(pCanvas.toDataURL('image/png'));
      }

      // Extract the existing Crown-Sealed Letter & Envelope illustration with a soft vignette
      const lX = Math.round(w * 0.032);
      const lY = Math.round(h * 0.528);
      const lW = Math.round(w * 0.36);
      const lH = Math.round(h * 0.175);
      const lCanvas = document.createElement('canvas');
      lCanvas.width = lW;
      lCanvas.height = lH;
      const lCtx = lCanvas.getContext('2d');
      if (lCtx) {
        lCtx.drawImage(img, lX, lY, lW, lH, 0, 0, lW, lH);
        const lData = lCtx.getImageData(0, 0, lW, lH);
        const ld = lData.data;
        const lcx = lW / 2;
        const lcy = lH / 2;
        const lrx = lW * 0.48;
        const lry = lH * 0.48;
        for (let y = 0; y < lH; y++) {
          for (let x = 0; x < lW; x++) {
            const normDist = Math.sqrt(
              Math.pow((x - lcx) / lrx, 2) + Math.pow((y - lcy) / lry, 2)
            );
            const i = (y * lW + x) * 4;
            if (normDist > 1) {
              ld[i + 3] = 0;
            } else if (normDist > 0.74) {
              const alpha = Math.cos(((normDist - 0.74) / 0.26) * (Math.PI / 2));
              ld[i + 3] = Math.round(Math.max(0, alpha) * 255);
            }
          }
        }
        lCtx.putImageData(lData, 0, 0);
        setLetterSpriteSrc(lCanvas.toDataURL('image/png'));
      }

      // Extract the existing Royal Star Gift Box illustration with a soft vignette
      const gX = Math.round(w * 0.325);
      const gY = Math.round(h * 0.325);
      const gW = Math.round(w * 0.355);
      const gH = Math.round(h * 0.222);
      const gCanvas = document.createElement('canvas');
      gCanvas.width = gW;
      gCanvas.height = gH;
      const gCtx = gCanvas.getContext('2d');
      if (gCtx) {
        gCtx.drawImage(img, gX, gY, gW, gH, 0, 0, gW, gH);
        const gData = gCtx.getImageData(0, 0, gW, gH);
        const gd = gData.data;
        const gcx = gW / 2;
        const gcy = gH / 2;
        const grx = gW * 0.48;
        const gry = gH * 0.48;
        for (let y = 0; y < gH; y++) {
          for (let x = 0; x < gW; x++) {
            const normDist = Math.sqrt(
              Math.pow((x - gcx) / grx, 2) + Math.pow((y - gcy) / gry, 2)
            );
            const i = (y * gW + x) * 4;
            if (normDist > 1) {
              gd[i + 3] = 0;
            } else if (normDist > 0.72) {
              const alpha = Math.cos(((normDist - 0.72) / 0.28) * (Math.PI / 2));
              gd[i + 3] = Math.round(Math.max(0, alpha) * 255);
            }
          }
        }
        gCtx.putImageData(gData, 0, 0);
        setGiftBoxSpriteSrc(gCanvas.toDataURL('image/png'));
      }

      // Extract the existing Mystery Scroll illustration with a soft vignette
      const scX = Math.round(w * 0.685);
      const scY = Math.round(h * 0.535);
      const scW = Math.round(w * 0.295);
      const scH = Math.round(h * 0.205);
      const scCanvas = document.createElement('canvas');
      scCanvas.width = scW;
      scCanvas.height = scH;
      const scCtx = scCanvas.getContext('2d');
      if (scCtx) {
        scCtx.drawImage(img, scX, scY, scW, scH, 0, 0, scW, scH);
        const scData = scCtx.getImageData(0, 0, scW, scH);
        const scd = scData.data;
        const sccx = scW / 2;
        const sccy = scH / 2;
        const scrx = scW * 0.48;
        const scry = scH * 0.48;
        for (let y = 0; y < scH; y++) {
          for (let x = 0; x < scW; x++) {
            const normDist = Math.sqrt(
              Math.pow((x - sccx) / scrx, 2) + Math.pow((y - sccy) / scry, 2)
            );
            const i = (y * scW + x) * 4;
            if (normDist > 1) {
              scd[i + 3] = 0;
            } else if (normDist > 0.72) {
              const alpha = Math.cos(((normDist - 0.72) / 0.28) * (Math.PI / 2));
              scd[i + 3] = Math.round(Math.max(0, alpha) * 255);
            }
          }
        }
        scCtx.putImageData(scData, 0, 0);
        setScrollSpriteSrc(scCanvas.toDataURL('image/png'));
      }

      const bgCanvas = bgCanvasRef.current;
      if (!bgCanvas) return;
      bgCanvas.width = w;
      bgCanvas.height = h;
      const ctx = bgCanvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      // Helper to horizontally heal baked-in heart icons on the background artwork
      const healHeartRect = (rx1: number, ry1: number, rx2: number, ry2: number) => {
        const x1 = Math.round(w * rx1);
        const x2 = Math.round(w * rx2);
        const y1 = Math.round(h * ry1);
        const y2 = Math.round(h * ry2);
        const rw = x2 - x1;
        const rh = y2 - y1;
        const rData = ctx.getImageData(x1, y1, rw, rh);
        const rd = rData.data;
        for (let y = 0; y < rh; y++) {
          const lIdx = (y * rw + 0) * 4;
          const rIdx = (y * rw + (rw - 1)) * 4;
          for (let x = 1; x < rw - 1; x++) {
            const t = x / (rw - 1);
            const idx = (y * rw + x) * 4;
            rd[idx] = Math.round(rd[lIdx] * (1 - t) + rd[rIdx] * t);
            rd[idx + 1] = Math.round(rd[lIdx + 1] * (1 - t) + rd[rIdx + 1] * t);
            rd[idx + 2] = Math.round(rd[lIdx + 2] * (1 - t) + rd[rIdx + 2] * t);
          }
        }
        ctx.putImageData(rData, x1, y1);
      };

      // 1) Heal heart inside top-right snake speech bubble
      healHeartRect(0.752, 0.052, 0.788, 0.072);
      // 2) Heal heart at the end of "A box of random surprises awaits..."
      healHeartRect(0.722, 0.293, 0.760, 0.318);
      // 3) Heal heart at the end of "Tap any object to discover what's inside !"
      healHeartRect(0.665, 0.855, 0.702, 0.880);
    };
  }, []);

  // Preload and heal the Dice Roll Parchment Popup image on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Mystical_Dice_Roll_Parchement_Popup_8ae7d3e0.png';
    img.onload = () => {
      const w = img.naturalWidth || 1055;
      const h = img.naturalHeight || 1491;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

      // Heal ONLY the inner cream dialogue box text area (x: 19.2%..81.2%, y: 36.2%..54.4%)
      // using surrounding cream parchment pixels so only the dialogue text changes on every roll.
      const x1 = Math.round(w * 0.192);
      const x2 = Math.round(w * 0.812);
      const y1 = Math.round(h * 0.362);
      const y2 = Math.round(h * 0.544);
      const boxW = x2 - x1;
      const boxH = y2 - y1;

      // Sample a clean horizontal cream parchment strip at y = 46.5% (between text lines)
      const cleanRowY = Math.round(h * 0.465);
      const cleanStrip = ctx.getImageData(x1, cleanRowY, boxW, 1).data;

      const boxData = ctx.getImageData(x1, y1, boxW, boxH);
      const bd = boxData.data;

      for (let y = 0; y < boxH; y++) {
        const leftIdx = (y * boxW + 0) * 4;
        const rightIdx = (y * boxW + (boxW - 1)) * 4;
        const rL = bd[leftIdx], gL = bd[leftIdx + 1], bL = bd[leftIdx + 2];
        const rR = bd[rightIdx], gR = bd[rightIdx + 1], bR = bd[rightIdx + 2];

        const stripL_R = cleanStrip[0], stripL_G = cleanStrip[1], stripL_B = cleanStrip[2];
        const stripR_Idx = (boxW - 1) * 4;
        const stripR_R = cleanStrip[stripR_Idx],
          stripR_G = cleanStrip[stripR_Idx + 1],
          stripR_B = cleanStrip[stripR_Idx + 2];

        for (let x = 1; x < boxW - 1; x++) {
          const t = x / (boxW - 1);
          const baseR = rL * (1 - t) + rR * t;
          const baseG = gL * (1 - t) + gR * t;
          const baseB = bL * (1 - t) + bR * t;

          // Add subtle natural parchment grain from the clean strip
          const sIdx = x * 4;
          const expectedStripR = stripL_R * (1 - t) + stripR_R * t;
          const expectedStripG = stripL_G * (1 - t) + stripR_G * t;
          const expectedStripB = stripL_B * (1 - t) + stripR_B * t;

          const grainR = (cleanStrip[sIdx] - expectedStripR) * 0.45;
          const grainG = (cleanStrip[sIdx + 1] - expectedStripG) * 0.45;
          const grainB = (cleanStrip[sIdx + 2] - expectedStripB) * 0.45;

          const idx = (y * boxW + x) * 4;
          bd[idx] = Math.max(0, Math.min(255, Math.round(baseR + grainR)));
          bd[idx + 1] = Math.max(0, Math.min(255, Math.round(baseG + grainG)));
          bd[idx + 2] = Math.max(0, Math.min(255, Math.round(baseB + grainB)));
        }
      }

      ctx.putImageData(boxData, x1, y1);
      setHealedDicePopupSrc(canvas.toDataURL('image/png'));
    };
  }, []);

  const playObjectSound = (soundType: RoomObjectConfig['soundType']) => {
    switch (soundType) {
      case 'bubble':
        soundEngine.playBubblePop();
        break;
      case 'fanfare':
        soundEngine.playTreasureFanfare();
        break;
      case 'dice':
        soundEngine.playDiceRoll();
        break;
      case 'boing':
        soundEngine.playBoing();
        break;
      case 'oracle':
        soundEngine.playMysticOracle();
        break;
      case 'whistle':
        soundEngine.playSlideWhistle();
        break;
    }
  };

  const pickRandomDiceRoastIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * DICE_ROAST_MESSAGES.length);
    }
    const candidates = DICE_ROAST_MESSAGES.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const pickRandomCrystalPredictionIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * CRYSTAL_BALL_PREDICTIONS.length);
    }
    const candidates = CRYSTAL_BALL_PREDICTIONS.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const pickRandomPotionCureIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * POTION_CURES.length);
    }
    const candidates = POTION_CURES.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const pickRandomLetterIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * SEALED_LETTERS.length);
    }
    const candidates = SEALED_LETTERS.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const pickRandomGiftIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * GIFT_BOX_OPTIONS.length);
    }
    const candidates = GIFT_BOX_OPTIONS.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const pickRandomScrollIndex = (excludeIdx?: number) => {
    if (excludeIdx === undefined) {
      return Math.floor(Math.random() * ANCIENT_SCROLLS_OF_TRUTH.length);
    }
    const candidates = ANCIENT_SCROLLS_OF_TRUTH.map((_, idx) => idx).filter(
      (idx) => idx !== excludeIdx
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const handleRollDiceAgain = () => {
    soundEngine.playDiceRoll();
    setDiceRoastIdx((prev) => pickRandomDiceRoastIndex(prev));
    setDiceRollCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      dice: (prev.dice || 0) + 1,
    }));
  };

  const handleRevealCrystalAgain = () => {
    soundEngine.playMysticOracle();
    setCrystalPredictionIdx((prev) => pickRandomCrystalPredictionIndex(prev));
    setCrystalRevealCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      crystalball: (prev.crystalball || 0) + 1,
    }));
  };

  const handleDrinkPotionAgain = () => {
    soundEngine.playBubblePop();
    setPotionCureIdx((prev) => pickRandomPotionCureIndex(prev));
    setPotionDrinkCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      potion: (prev.potion || 0) + 1,
    }));
  };

  const handleOpenAnotherLetter = () => {
    soundEngine.playBoing();
    setLetterIdx((prev) => pickRandomLetterIndex(prev));
    setLetterOpenCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      letter: (prev.letter || 0) + 1,
    }));
  };

  const handleOpenAnotherGift = () => {
    soundEngine.playTreasureFanfare();
    setGiftOptionIdx((prev) => pickRandomGiftIndex(prev));
    setGiftOpenCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      giftbox: (prev.giftbox || 0) + 1,
    }));
  };

  const handleSelectGiftOption = (idx: number) => {
    soundEngine.playTreasureFanfare();
    setGiftOptionIdx(idx);
    setGiftOpenCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      giftbox: (prev.giftbox || 0) + 1,
    }));
  };

  const handleUnrollAnotherScroll = () => {
    soundEngine.playSlideWhistle();
    setScrollOptionIdx((prev) => pickRandomScrollIndex(prev));
    setScrollUnrollCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      scroll: (prev.scroll || 0) + 1,
    }));
  };

  const handleSelectScrollOption = (idx: number) => {
    soundEngine.playSlideWhistle();
    setScrollOptionIdx(idx);
    setScrollUnrollCount((c) => c + 1);
    setTapCounts((prev) => ({
      ...prev,
      scroll: (prev.scroll || 0) + 1,
    }));
  };

  const handleTapObject = (obj: RoomObjectConfig) => {
    playObjectSound(obj.soundType);
    setBouncingObjectId(obj.id);

    const prevCount = tapCounts[obj.id] || 0;
    const nextVariant = prevCount % obj.surprises.length;

    setTapCounts((prev) => ({
      ...prev,
      [obj.id]: prevCount + 1,
    }));

    // When clicking the potion bottle, open the dedicated "Choose Your Magical Cure..." Potion Screen
    if (obj.id === 'potion') {
      const nextPotion =
        prevCount === 0
          ? pickRandomPotionCureIndex()
          : pickRandomPotionCureIndex(potionCureIdx);
      setPotionCureIdx(nextPotion);
      setPotionDrinkCount((c) => c + 1);
      setIsPotionPopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    // When clicking the gift box, open the dedicated "A Little Something For You..." Gift Box Screen
    if (obj.id === 'giftbox') {
      const nextGift =
        prevCount === 0
          ? pickRandomGiftIndex()
          : pickRandomGiftIndex(giftOptionIdx);
      setGiftOptionIdx(nextGift);
      setGiftOpenCount((c) => c + 1);
      setIsGiftBoxPopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    // When clicking the letter, open the dedicated "A Few Words For You..." Letter-Opening Screen
    if (obj.id === 'letter') {
      const nextLetter =
        prevCount === 0
          ? pickRandomLetterIndex()
          : pickRandomLetterIndex(letterIdx);
      setLetterIdx(nextLetter);
      setLetterOpenCount((c) => c + 1);
      setIsLetterPopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    // When clicking the dice, open the dedicated Parchment-style Dice Rolls Popup
    if (obj.id === 'dice') {
      const nextRoast = prevCount === 0 ? 0 : pickRandomDiceRoastIndex(diceRoastIdx);
      setDiceRoastIdx(nextRoast);
      setDiceRollCount((c) => c + 1);
      setIsDicePopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    // When clicking the crystal ball, open the dedicated "The Universe Has Spoken..." Fortune-Telling Screen
    if (obj.id === 'crystalball') {
      const nextPrediction =
        prevCount === 0
          ? pickRandomCrystalPredictionIndex()
          : pickRandomCrystalPredictionIndex(crystalPredictionIdx);
      setCrystalPredictionIdx(nextPrediction);
      setCrystalRevealCount((c) => c + 1);
      setIsCrystalBallPopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    // When clicking the scroll, open the dedicated "Ancient Scrolls of Truth..." Scroll Screen
    if (obj.id === 'scroll') {
      const nextScroll =
        prevCount === 0
          ? pickRandomScrollIndex()
          : pickRandomScrollIndex(scrollOptionIdx);
      setScrollOptionIdx(nextScroll);
      setScrollUnrollCount((c) => c + 1);
      setIsScrollPopupOpen(true);

      window.setTimeout(() => {
        setBouncingObjectId(null);
      }, 650);
      return;
    }

    setActiveVariantIdx(nextVariant);
    setActiveObjectId(obj.id);

    // Trigger cute character reactions too!
    const surprise = obj.surprises[nextVariant];
    setSpiderSpeech(surprise.spiderComment);
    setSnakeSpeech(surprise.snakeComment);
    setSnakeExcited(true);

    window.setTimeout(() => {
      setBouncingObjectId(null);
      setSnakeExcited(false);
    }, 650);
  };

  // Cycle to the NEXT surprise inside the currently open object modal!
  const handleTapAgainSameObject = () => {
    if (!activeObject) return;
    playObjectSound(activeObject.soundType);

    const prevCount = tapCounts[activeObject.id] || 0;
    const nextVariant = prevCount % activeObject.surprises.length;

    setTapCounts((prev) => ({
      ...prev,
      [activeObject.id]: prevCount + 1,
    }));
    setActiveVariantIdx(nextVariant);

    const surprise = activeObject.surprises[nextVariant];
    setSpiderSpeech(surprise.spiderComment);
    setSnakeSpeech(surprise.snakeComment);
  };

  const handleTapSpider = () => {
    soundEngine.playBoing();
    setSpiderBlinking(true);
    const next = spiderTapCount + 1;
    setSpiderTapCount(next);
    setSpiderSpeech(SPIDER_IDLE_LINES[next % SPIDER_IDLE_LINES.length]);

    window.setTimeout(() => setSpiderBlinking(false), 220);
    window.setTimeout(() => setSpiderSpeech(null), 2600);
  };

  const handleTapSnake = () => {
    soundEngine.playSparkle();
    setSnakeExcited(true);
    const next = snakeTapCount + 1;
    setSnakeTapCount(next);
    setSnakeSpeech(SNAKE_IDLE_LINES[next % SNAKE_IDLE_LINES.length]);

    window.setTimeout(() => setSnakeExcited(false), 850);
    window.setTimeout(() => setSnakeSpeech(null), 2600);
  };

  const currentDiceRoast = DICE_ROAST_MESSAGES[diceRoastIdx % DICE_ROAST_MESSAGES.length];
  const currentCrystalPrediction =
    CRYSTAL_BALL_PREDICTIONS[crystalPredictionIdx % CRYSTAL_BALL_PREDICTIONS.length];
  const currentPotionCure = POTION_CURES[potionCureIdx % POTION_CURES.length];
  const currentLetter = SEALED_LETTERS[letterIdx % SEALED_LETTERS.length];
  const currentGiftOption = GIFT_BOX_OPTIONS[giftOptionIdx % GIFT_BOX_OPTIONS.length];
  const currentScrollOption =
    ANCIENT_SCROLLS_OF_TRUTH[scrollOptionIdx % ANCIENT_SCROLLS_OF_TRUTH.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-[#DFB2A8] overflow-hidden select-none touch-none"
    >
      {/* Ambient Storybook Blush-Pink, Burgundy & Gold Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #F8DFD6 0%, #E5B6AC 52%, #C28A80 90%, #9E6860 100%)',
        }}
      />

      {/* Desktop Left & Right Storybook Accents */}
      <div className="hidden lg:flex fixed left-8 xl:left-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-85">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;Every object hides multiple roasts and surprises! Tap them again and again!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          {totalTaps} SURPRISES PULLED
        </span>
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-center text-center max-w-[200px] pointer-events-none opacity-85">
        <FourPointStar size={20} color="#6D1A28" />
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <p className="font-serif-editorial italic text-[#4A141E] text-base leading-relaxed">
          &ldquo;Potion Bottle, Gift Box, Magical Dice, Sealed Letter, Crystal Ball &amp; Treasure Scroll!&rdquo;
        </p>
        <div className="w-[1px] h-12 bg-[#6D1A28]/30 my-3" />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#6D1A28]">
          DOOR II · SURPRISE ROOM
        </span>
      </div>

      {/* Main 941x1672 Reference Container (Fits 100% in 100dvh with zero scroll) */}
      <div className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[941/1672] sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(48,12,20,0.34)] sm:border sm:border-[#D9A875]/60 overflow-hidden flex items-center justify-center bg-[#F1C9BF]">
        <div className="relative w-full h-full">
          {/* Base Reference Artwork */}
          <img
            src="/assets/aistudio/Something_for_You__Magical_Surprises_220cd1d4.png"
            alt="Something for You — A box of random surprises awaits."
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none select-none"
          />

          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* =================================================================
              1. CUTE CARTOON SPIDER WITH EYE ANIMATION & TAP REACTION (Top-Left)
             ================================================================= */}
          <button
            type="button"
            onClick={handleTapSpider}
            aria-label="Tap cute cartoon spider"
            style={{
              left: '11.0%',
              top: '9.0%',
              width: '16.5%',
              height: '7.5%',
            }}
            className="absolute z-30 cursor-pointer focus:outline-none"
          >
            {/* Little Eye Glance & Blink Overlay */}
            <svg
              viewBox="0 0 44 22"
              fill="none"
              style={{
                left: '33.0%',
                top: '31.5%',
                width: '38.5%',
                height: '36.0%',
              }}
              className="absolute pointer-events-none overflow-visible"
            >
              {spiderBlinking ? (
                <>
                  <ellipse cx="10.5" cy="11.5" rx="8.5" ry="8" fill="#32141A" />
                  <path d="M4 12C7 9 14 9 17 12" stroke="#FFF6F0" strokeWidth="2.2" strokeLinecap="round" />

                  <ellipse cx="32.5" cy="11.0" rx="8.5" ry="8" fill="#32141A" />
                  <path d="M26 11.5C29 8.5 36 8.5 39 11.5" stroke="#FFF6F0" strokeWidth="2.2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="10.5" cy="11.5" r="7.2" fill="#FFF9F5" stroke="#1E0B10" strokeWidth="1.8" />
                  <circle
                    cx={10.5 + eyeOffset.x}
                    cy={11.5 + eyeOffset.y}
                    r="4.0"
                    fill="#1E0B10"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />
                  <circle cx={9.0 + eyeOffset.x * 0.7} cy={9.8 + eyeOffset.y * 0.7} r="1.4" fill="#FFFFFF" />

                  <circle cx="32.5" cy="11.0" r="7.0" fill="#FFF9F5" stroke="#1E0B10" strokeWidth="1.8" />
                  <circle
                    cx={32.5 + eyeOffset.x}
                    cy={11.0 + eyeOffset.y}
                    r="3.8"
                    fill="#1E0B10"
                    style={{ transition: 'cx 0.35s ease, cy 0.35s ease' }}
                  />
                  <circle cx={31.0 + eyeOffset.x * 0.7} cy={9.3 + eyeOffset.y * 0.7} r="1.4" fill="#FFFFFF" />
                </>
              )}
            </svg>
          </button>

          {/* Spider Speech Bubble Toast */}
          <AnimatePresence>
            {spiderSpeech &&
              !activeObject &&
              !isDicePopupOpen &&
              !isCrystalBallPopupOpen &&
              !isPotionPopupOpen &&
              !isLetterPopupOpen &&
              !isGiftBoxPopupOpen &&
              !isScrollPopupOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ left: '6%', top: '16.8%' }}
                  className="absolute z-40 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none"
                >
                  {spiderSpeech}
                </motion.div>
              )}
          </AnimatePresence>

          {/* =================================================================
              2. ANIMATED CROWNED SNAKE MOVING ITS HEAD (Top-Right)
             ================================================================= */}
          <div
            style={{
              left: '74.2%',
              top: '6.8%',
              width: '19.5%',
              height: '7.8%',
            }}
            className="absolute z-30"
          >
            <button
              type="button"
              onClick={handleTapSnake}
              aria-label="Tap crowned snake"
              className={`relative w-full h-full cursor-pointer focus:outline-none animate-snake-sway transition-transform duration-300 ${
                snakeExcited ? 'scale-115 -rotate-6' : 'hover:scale-105'
              }`}
            >
              <canvas
                ref={snakeHeadCanvasRef}
                className="w-full h-full object-fill pointer-events-none"
              />
              <div className="absolute left-[42%] top-[4%] pointer-events-none animate-star-twinkle">
                <FourPointStar size={13} color="#FFE89E" glow />
              </div>
            </button>

            <AnimatePresence>
              {snakeSpeech &&
                !activeObject &&
                !isDicePopupOpen &&
                !isCrystalBallPopupOpen &&
                !isPotionPopupOpen &&
                !isLetterPopupOpen &&
                !isGiftBoxPopupOpen &&
                !isScrollPopupOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -left-32 sm:-left-40 top-full mt-1 px-3 py-1 rounded-2xl bg-[#5E1622] text-[#FFF6F0] font-serif-editorial italic text-xs sm:text-sm shadow-lg border border-[#E6B875] whitespace-nowrap pointer-events-none z-40"
                  >
                    {snakeSpeech}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              3. INTERACTIVE MAGICAL OBJECTS IN THE SURPRISE ROOM
             ================================================================= */}
          {ROOM_OBJECTS.map((obj) => {
            const count = tapCounts[obj.id] || 0;
            const isBouncing = bouncingObjectId === obj.id;
            const badgeTotal =
              obj.id === 'dice'
                ? DICE_ROAST_MESSAGES.length
                : obj.id === 'crystalball'
                ? CRYSTAL_BALL_PREDICTIONS.length
                : obj.id === 'potion'
                ? POTION_CURES.length
                : obj.id === 'letter'
                ? SEALED_LETTERS.length
                : obj.id === 'giftbox'
                ? GIFT_BOX_OPTIONS.length
                : obj.id === 'scroll'
                ? ANCIENT_SCROLLS_OF_TRUTH.length
                : obj.surprises.length;

            return (
              <React.Fragment key={obj.id}>
                {/* Subtle Magical Sparkle Halo on each object */}
                <div
                  style={obj.glowStyle}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full pointer-events-none transition-all duration-500 ${
                    isBouncing
                      ? 'bg-[#FFF3C4]/85 scale-150 blur-xl'
                      : count > 0
                      ? 'bg-[#FFE3A8]/35 blur-lg animate-pulse'
                      : 'bg-[#FFE3A8]/15 blur-md'
                  }`}
                />

                {/* Clickable Object Hitbox */}
                <button
                  type="button"
                  onClick={() => handleTapObject(obj)}
                  style={obj.hitboxStyle}
                  aria-label={`${obj.name} — ${obj.hintLabel}`}
                  className={`group absolute z-20 rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE3A8] transition-transform duration-300 ${
                    isBouncing
                      ? 'scale-110 -rotate-3'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Floating Tap Counter / Sparkle Badge if already tapped */}
                  {count > 0 && (
                    <span className="absolute -top-1.5 right-1 px-2 py-0.5 rounded-full bg-[#5E1622]/90 border border-[#E6B875] text-[#FFF4D4] font-cinzel text-[9px] tracking-wider shadow-md pointer-events-none">
                      ✦ {count}/{badgeTotal}
                    </span>
                  )}

                  {/* Subtle hover sparkle ring */}
                  <div className="w-full h-full rounded-2xl border-2 border-transparent group-hover:border-[#FFF0C2]/55 group-hover:bg-[#FFF0C2]/10 transition-all" />
                </button>
              </React.Fragment>
            );
          })}

          {/* =================================================================
              4. ORNATE "← Back to the doors" BUTTON AT THE BOTTOM
             ================================================================= */}
          <div
            style={{
              left: '21%',
              right: '21%',
              bottom: '2.0%',
              height: '5.8%',
            }}
            className="absolute z-30 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => {
                soundEngine.playSparkle();
                onBackToDoors();
              }}
              className="w-full h-full rounded-full bg-gradient-to-b from-[#4B1A22] to-[#2B0D12] border-2 border-[#D9A86C] shadow-[0_10px_28px_rgba(24,5,9,0.55)] flex items-center justify-center gap-2.5 px-5 text-[#FAF0E6] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#E6B875] shrink-0" />
              <span className="font-serif-editorial text-base sm:text-lg tracking-wide whitespace-nowrap">
                Back to the doors
              </span>
              <span className="text-[#E6B875] text-xs">✦</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          DICE ROLLS PARCHMENT POPUP (Matches Mystical_Dice_Roll_Parchement_Popup_8ae7d3e0.png,
          only the dialogue inside the parchment box changes on every roll!)
         ===================================================================== */}
      <AnimatePresence>
        {isDicePopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsDicePopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/75 backdrop-blur-sm p-0 sm:p-3 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[100dvh] w-full max-w-[480px] sm:h-[96dvh] sm:w-auto sm:aspect-[1055/1491] sm:rounded-[28px] sm:shadow-[0_24px_75px_rgba(12,3,6,0.85)] sm:border sm:border-[#D9A875]/65 overflow-hidden flex items-center justify-center bg-[#231218]"
            >
              {/* Healed Parchment Popup Image (inner cream dialogue box cleaned so only the roast message changes) */}
              {healedDicePopupSrc && (
                <img
                  src={healedDicePopupSrc}
                  alt="Dice Rolls... Parchment Popup"
                  className="w-full h-full object-fill pointer-events-none select-none"
                />
              )}

              {/* Dynamic Roast Dialogue Box — ONLY this text changes on every roll */}
              <div
                style={{
                  left: '19.2%',
                  width: '61.8%',
                  top: '36.2%',
                  height: '18.2%',
                }}
                className="absolute z-20 flex flex-col items-center justify-center text-center px-2 sm:px-3 pointer-events-none"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${diceRoastIdx}-${diceRollCount}`}
                    initial={{ opacity: 0, y: 5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <h3 className="font-serif-editorial font-bold text-[#35170C] text-[clamp(1.35rem,5.4vw,1.95rem)] leading-tight mb-1.5 sm:mb-2">
                      {currentDiceRoast.headline}
                    </h3>
                    <p className="font-serif-editorial font-medium text-[#3B1C11] text-[clamp(1.02rem,4.1vw,1.42rem)] leading-[1.28] whitespace-pre-line">
                      {currentDiceRoast.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Interactive "🎲 Roll Again" Button Hitbox (matches exact parchment button on artwork) */}
              <button
                type="button"
                onClick={handleRollDiceAgain}
                aria-label="🎲 Roll Again"
                style={{
                  left: '26.2%',
                  width: '48.8%',
                  top: '57.8%',
                  height: '9.0%',
                }}
                className="group absolute z-30 rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5A2A18] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              >
                <span className="sr-only">🎲 Roll Again</span>
                <div className="w-full h-full rounded-2xl border-2 border-transparent group-hover:border-[#6B331B]/35 group-hover:bg-[#FFF3DC]/15 transition-all" />
              </button>

              {/* Interactive "← Back" Button Hitbox (matches exact dark ornate button on artwork) */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSparkle();
                  setIsDicePopupOpen(false);
                }}
                aria-label="← Back"
                style={{
                  left: '35.8%',
                  width: '28.6%',
                  top: '67.8%',
                  height: '6.8%',
                }}
                className="group absolute z-30 rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C97B] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.96]"
              >
                <span className="sr-only">← Back</span>
                <div className="w-full h-full rounded-xl border border-transparent group-hover:border-[#F5C97B]/50 group-hover:bg-[#FFF3DC]/10 transition-all" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          CRYSTAL BALL FORTUNE-TELLING MESSAGE SCREEN ("The Universe Has Spoken...")
          Matches the existing vintage fantasy parchment theme & crystal ball design,
          and only changes the displayed prediction dialogue when clicking "Reveal Again 🔮"
         ===================================================================== */}
      <AnimatePresence>
        {isCrystalBallPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCrystalBallPopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/80 backdrop-blur-sm p-3 sm:p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[430px] rounded-[28px] border-2 border-[#D9A875]/80 shadow-[0_24px_75px_rgba(12,3,6,0.9)] overflow-hidden px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center text-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #3A192A 0%, #24101B 48%, #170911 100%)',
              }}
            >
              {/* Decorative Hanging Gold Stars & Cosmic Twinkles */}
              <div className="absolute top-3 left-5 pointer-events-none opacity-80 animate-star-twinkle">
                <FourPointStar size={16} color="#F5C97B" glow />
              </div>
              <div className="absolute top-6 right-6 pointer-events-none opacity-85 animate-star-twinkle">
                <FourPointStar size={18} color="#F5C97B" glow />
              </div>
              <div className="absolute bottom-5 left-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>
              <div className="absolute bottom-5 right-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>

              {/* Existing Galaxy Crystal Ball Design with Mystical Aura */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-1">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-75 pointer-events-none animate-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(235,162,255,0.55) 0%, rgba(245,201,123,0.35) 55%, transparent 75%)',
                  }}
                />
                {crystalBallSpriteSrc ? (
                  <img
                    src={crystalBallSpriteSrc}
                    alt="Galaxy Crystal Ball"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(235,162,255,0.45)] pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative z-10 text-6xl select-none">🔮</div>
                )}
              </div>

              {/* Vintage Parchment Scroll Card */}
              <div
                className="relative w-full rounded-[24px] border-2 border-[#B37D43] shadow-[0_14px_40px_rgba(10,3,6,0.75)] px-4 py-5 sm:px-6 sm:py-6 flex flex-col items-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FCEBD2 0%, #F4D5AD 62%, #E5BC8A 100%)',
                }}
              >
                {/* Hand-drawn Crown & Star Corner Doodles matching the vintage parchment theme */}
                <svg
                  viewBox="0 0 36 28"
                  fill="none"
                  className="w-7 h-6 absolute top-3.5 left-4 opacity-80 pointer-events-none -rotate-12"
                >
                  <path
                    d="M4 22L7 9L14 16L18 6L22 16L29 9L32 22H4Z"
                    stroke="#3B1C11"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="25" x2="32" y2="25" stroke="#3B1C11" strokeWidth="1.8" />
                </svg>

                <div className="absolute top-3.5 right-4 opacity-80 pointer-events-none">
                  <FourPointStar size={16} color="#3B1C11" />
                </div>

                {/* Heading: "The Universe Has Spoken..." */}
                <h2 className="font-serif-editorial italic font-bold text-[#35170C] text-[clamp(1.5rem,5.6vw,2.05rem)] leading-tight tracking-wide mt-1">
                  The Universe Has Spoken...
                </h2>

                {/* Vintage Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5 w-full max-w-[240px] opacity-85">
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-xs">✦</span>
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                </div>

                {/* Inner Cream Dialogue Box — ONLY this prediction text changes on "Reveal Again 🔮" */}
                <div
                  className="w-full min-h-[148px] sm:min-h-[158px] rounded-2xl border border-[#C89B68] px-4 py-4 sm:px-5 sm:py-4 flex flex-col items-center justify-center text-center shadow-inner my-1.5"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF7EB 0%, #F9E7CC 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${crystalPredictionIdx}-${crystalRevealCount}`}
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <h3 className="font-serif-editorial font-bold text-[#4E131E] text-[clamp(1.2rem,4.6vw,1.5rem)] leading-snug">
                        {currentCrystalPrediction.category}:
                      </h3>
                      <p className="font-serif-editorial font-medium text-[#35170C] text-[clamp(1.02rem,4vw,1.25rem)] leading-relaxed">
                        {currentCrystalPrediction.quote}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* "Reveal Again 🔮" Vintage Parchment Scroll Button */}
                <button
                  type="button"
                  onClick={handleRevealCrystalAgain}
                  className="mt-3 w-full max-w-[260px] py-2.5 px-5 min-h-[46px] rounded-2xl border-2 border-[#5A2A18] shadow-[0_6px_16px_rgba(53,23,12,0.28)] flex items-center justify-center gap-2 text-[#35170C] font-serif-editorial font-bold text-lg sm:text-xl tracking-wide hover:scale-[1.02] active:scale-[0.97] transition-transform cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7DEC0 0%, #E7BF91 55%, #D9AC79 100%)',
                  }}
                >
                  <span>Reveal Again 🔮</span>
                </button>

                {/* "← Back" Dark Ornate Vintage Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSparkle();
                    setIsCrystalBallPopupOpen(false);
                  }}
                  className="mt-2.5 w-full max-w-[175px] py-2 px-4 min-h-[40px] rounded-xl bg-gradient-to-b from-[#4B2316] to-[#2B120A] border border-[#C89456] shadow-[0_6px_16px_rgba(24,8,4,0.45)] flex items-center justify-center gap-2 text-[#FAF0E0] font-serif-editorial text-base sm:text-lg tracking-wide hover:scale-[1.03] active:scale-[0.96] transition-transform cursor-pointer"
                >
                  <span>← Back</span>
                </button>

                {/* Subtle Bottom Parchment Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3.5 mb-1 w-full max-w-[220px] opacity-75">
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-[10px]">✦</span>
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                </div>
                <p className="font-serif-editorial italic text-[#3B1C11] text-xs sm:text-sm leading-snug opacity-90">
                  — The cosmos has spoken. Zero refunds on your destiny. —
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          POTION MAGICAL CURE SCREEN ("Choose Your Magical Cure...")
          Matches the existing vintage fantasy parchment theme & potion bottle illustration,
          and only changes the displayed potion text when clicking "Drink Again 🧪"
         ===================================================================== */}
      <AnimatePresence>
        {isPotionPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsPotionPopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/80 backdrop-blur-sm p-3 sm:p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[430px] rounded-[28px] border-2 border-[#D9A875]/80 shadow-[0_24px_75px_rgba(12,3,6,0.9)] overflow-hidden px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center text-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #3A192A 0%, #24101B 48%, #170911 100%)',
              }}
            >
              {/* Decorative Hanging Gold Stars & Sparkles */}
              <div className="absolute top-3 left-5 pointer-events-none opacity-80 animate-star-twinkle">
                <FourPointStar size={16} color="#F5C97B" glow />
              </div>
              <div className="absolute top-6 right-6 pointer-events-none opacity-85 animate-star-twinkle">
                <FourPointStar size={18} color="#F5C97B" glow />
              </div>
              <div className="absolute bottom-5 left-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>
              <div className="absolute bottom-5 right-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>

              {/* Existing Potion Bottle Illustration with Magical Aura */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-1">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-75 pointer-events-none animate-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(226,142,248,0.55) 0%, rgba(245,201,123,0.35) 55%, transparent 75%)',
                  }}
                />
                {potionSpriteSrc ? (
                  <img
                    src={potionSpriteSrc}
                    alt="Magical Potion Bottle"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(226,142,248,0.45)] pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative z-10 text-6xl select-none">🧪</div>
                )}
              </div>

              {/* Vintage Parchment Scroll Card */}
              <div
                className="relative w-full rounded-[24px] border-2 border-[#B37D43] shadow-[0_14px_40px_rgba(10,3,6,0.75)] px-4 py-5 sm:px-6 sm:py-6 flex flex-col items-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FCEBD2 0%, #F4D5AD 62%, #E5BC8A 100%)',
                }}
              >
                {/* Hand-drawn Crown & Star Corner Doodles matching the vintage parchment theme */}
                <svg
                  viewBox="0 0 36 28"
                  fill="none"
                  className="w-7 h-6 absolute top-3.5 left-4 opacity-80 pointer-events-none -rotate-12"
                >
                  <path
                    d="M4 22L7 9L14 16L18 6L22 16L29 9L32 22H4Z"
                    stroke="#3B1C11"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="25" x2="32" y2="25" stroke="#3B1C11" strokeWidth="1.8" />
                </svg>

                <div className="absolute top-3.5 right-4 opacity-80 pointer-events-none">
                  <FourPointStar size={16} color="#3B1C11" />
                </div>

                {/* Heading: "Choose Your Magical Cure..." */}
                <h2 className="font-serif-editorial italic font-bold text-[#35170C] text-[clamp(1.45rem,5.4vw,2.0rem)] leading-tight tracking-wide mt-1">
                  Choose Your Magical Cure...
                </h2>

                {/* Vintage Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5 w-full max-w-[240px] opacity-85">
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-xs">✦</span>
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                </div>

                {/* Inner Cream Dialogue Box — ONLY this potion text changes on "Drink Again 🧪" */}
                <div
                  className="w-full min-h-[148px] sm:min-h-[158px] rounded-2xl border border-[#C89B68] px-4 py-4 sm:px-5 sm:py-4 flex flex-col items-center justify-center text-center shadow-inner my-1.5"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF7EB 0%, #F9E7CC 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${potionCureIdx}-${potionDrinkCount}`}
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <h3 className="font-serif-editorial font-bold text-[#4E131E] text-[clamp(1.2rem,4.6vw,1.5rem)] leading-snug">
                        {currentPotionCure.name}:
                      </h3>
                      <p className="font-serif-editorial font-medium text-[#35170C] text-[clamp(1.02rem,4vw,1.25rem)] leading-relaxed">
                        {currentPotionCure.quote}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* "Drink Again 🧪" Vintage Parchment Scroll Button */}
                <button
                  type="button"
                  onClick={handleDrinkPotionAgain}
                  className="mt-3 w-full max-w-[260px] py-2.5 px-5 min-h-[46px] rounded-2xl border-2 border-[#5A2A18] shadow-[0_6px_16px_rgba(53,23,12,0.28)] flex items-center justify-center gap-2 text-[#35170C] font-serif-editorial font-bold text-lg sm:text-xl tracking-wide hover:scale-[1.02] active:scale-[0.97] transition-transform cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7DEC0 0%, #E7BF91 55%, #D9AC79 100%)',
                  }}
                >
                  <span>Drink Again 🧪</span>
                </button>

                {/* "← Back" Dark Ornate Vintage Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSparkle();
                    setIsPotionPopupOpen(false);
                  }}
                  className="mt-2.5 w-full max-w-[175px] py-2 px-4 min-h-[40px] rounded-xl bg-gradient-to-b from-[#4B2316] to-[#2B120A] border border-[#C89456] shadow-[0_6px_16px_rgba(24,8,4,0.45)] flex items-center justify-center gap-2 text-[#FAF0E0] font-serif-editorial text-base sm:text-lg tracking-wide hover:scale-[1.03] active:scale-[0.96] transition-transform cursor-pointer"
                >
                  <span>← Back</span>
                </button>

                {/* Subtle Bottom Parchment Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3.5 mb-1 w-full max-w-[220px] opacity-75">
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-[10px]">✦</span>
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                </div>
                <p className="font-serif-editorial italic text-[#3B1C11] text-xs sm:text-sm leading-snug opacity-90">
                  — Brewed with 100% chaos. Results not guaranteed. —
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          CROWN-SEALED LETTER-OPENING EXPERIENCE ("A Few Words For You...")
          Matches the existing vintage fantasy parchment theme & envelope design,
          and only changes the displayed letter content when clicking "Open Another Letter"
         ===================================================================== */}
      <AnimatePresence>
        {isLetterPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsLetterPopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/80 backdrop-blur-sm p-3 sm:p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[430px] rounded-[28px] border-2 border-[#D9A875]/80 shadow-[0_24px_75px_rgba(12,3,6,0.9)] overflow-hidden px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center text-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #3A192A 0%, #24101B 48%, #170911 100%)',
              }}
            >
              {/* Decorative Hanging Gold Stars & Sparkles */}
              <div className="absolute top-3 left-5 pointer-events-none opacity-80 animate-star-twinkle">
                <FourPointStar size={16} color="#F5C97B" glow />
              </div>
              <div className="absolute top-6 right-6 pointer-events-none opacity-85 animate-star-twinkle">
                <FourPointStar size={18} color="#F5C97B" glow />
              </div>
              <div className="absolute bottom-5 left-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>
              <div className="absolute bottom-5 right-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>

              {/* Existing Crown-Sealed Envelope Illustration with Warm Golden Aura */}
              <div className="relative w-36 h-28 sm:w-40 sm:h-32 flex items-center justify-center mb-1">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-75 pointer-events-none animate-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245,201,123,0.5) 0%, rgba(217,120,108,0.35) 55%, transparent 75%)',
                  }}
                />
                {letterSpriteSrc ? (
                  <img
                    src={letterSpriteSrc}
                    alt="Mysterious Crown-Sealed Envelope"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(245,201,123,0.4)] pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative z-10 text-6xl select-none">✉️</div>
                )}
              </div>

              {/* Vintage Parchment Letter Card */}
              <div
                className="relative w-full rounded-[24px] border-2 border-[#B37D43] shadow-[0_14px_40px_rgba(10,3,6,0.75)] px-4 py-5 sm:px-6 sm:py-6 flex flex-col items-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FCEBD2 0%, #F4D5AD 62%, #E5BC8A 100%)',
                }}
              >
                {/* Hand-drawn Crown & Star Corner Doodles matching the vintage parchment theme */}
                <svg
                  viewBox="0 0 36 28"
                  fill="none"
                  className="w-7 h-6 absolute top-3.5 left-4 opacity-80 pointer-events-none -rotate-12"
                >
                  <path
                    d="M4 22L7 9L14 16L18 6L22 16L29 9L32 22H4Z"
                    stroke="#3B1C11"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="25" x2="32" y2="25" stroke="#3B1C11" strokeWidth="1.8" />
                </svg>

                <div className="absolute top-3.5 right-4 opacity-80 pointer-events-none">
                  <FourPointStar size={16} color="#3B1C11" />
                </div>

                {/* Heading: "A Few Words For You..." */}
                <h2 className="font-serif-editorial italic font-bold text-[#35170C] text-[clamp(1.45rem,5.4vw,2.0rem)] leading-tight tracking-wide mt-1">
                  A Few Words For You...
                </h2>

                {/* Vintage Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5 w-full max-w-[240px] opacity-85">
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-xs">✦</span>
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                </div>

                {/* Inner Cream Letter Box — ONLY this letter content changes on "Open Another Letter" */}
                <div
                  className="w-full min-h-[148px] sm:min-h-[158px] rounded-2xl border border-[#C89B68] px-4 py-4 sm:px-5 sm:py-4 flex flex-col items-center justify-center text-center shadow-inner my-1.5"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF7EB 0%, #F9E7CC 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${letterIdx}-${letterOpenCount}`}
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <h3 className="font-serif-editorial font-bold text-[#4E131E] text-[clamp(1.2rem,4.6vw,1.5rem)] leading-snug">
                        {currentLetter.title}:
                      </h3>
                      <p className="font-serif-editorial font-medium text-[#35170C] text-[clamp(1.02rem,4vw,1.25rem)] leading-relaxed">
                        {currentLetter.quote}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* "Open Another Letter ✉️" Vintage Parchment Scroll Button */}
                <button
                  type="button"
                  onClick={handleOpenAnotherLetter}
                  className="mt-3 w-full max-w-[275px] py-2.5 px-5 min-h-[46px] rounded-2xl border-2 border-[#5A2A18] shadow-[0_6px_16px_rgba(53,23,12,0.28)] flex items-center justify-center gap-2 text-[#35170C] font-serif-editorial font-bold text-lg sm:text-xl tracking-wide hover:scale-[1.02] active:scale-[0.97] transition-transform cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7DEC0 0%, #E7BF91 55%, #D9AC79 100%)',
                  }}
                >
                  <span>Open Another Letter ✉️</span>
                </button>

                {/* "← Back" Dark Ornate Vintage Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSparkle();
                    setIsLetterPopupOpen(false);
                  }}
                  className="mt-2.5 w-full max-w-[175px] py-2 px-4 min-h-[40px] rounded-xl bg-gradient-to-b from-[#4B2316] to-[#2B120A] border border-[#C89456] shadow-[0_6px_16px_rgba(24,8,4,0.45)] flex items-center justify-center gap-2 text-[#FAF0E0] font-serif-editorial text-base sm:text-lg tracking-wide hover:scale-[1.03] active:scale-[0.96] transition-transform cursor-pointer"
                >
                  <span>← Back</span>
                </button>

                {/* Subtle Bottom Parchment Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3.5 mb-1 w-full max-w-[220px] opacity-75">
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-[10px]">✦</span>
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                </div>
                <p className="font-serif-editorial italic text-[#3B1C11] text-xs sm:text-sm leading-snug opacity-90">
                  — Sealed by royal decree &amp; 100% judgment. —
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ROYAL STAR GIFT BOX EXPERIENCE ("A Little Something For You...")
          Displays the 5 gift options, reveals the selected gift's name and roast message,
          and includes "Open Another Gift 🎁" and "← Back" buttons
         ===================================================================== */}
      <AnimatePresence>
        {isGiftBoxPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsGiftBoxPopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/80 backdrop-blur-sm p-3 sm:p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[430px] rounded-[28px] border-2 border-[#D9A875]/80 shadow-[0_24px_75px_rgba(12,3,6,0.9)] overflow-hidden px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center text-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #3A192A 0%, #24101B 48%, #170911 100%)',
              }}
            >
              {/* Decorative Hanging Gold Stars & Sparkles */}
              <div className="absolute top-3 left-5 pointer-events-none opacity-80 animate-star-twinkle">
                <FourPointStar size={16} color="#F5C97B" glow />
              </div>
              <div className="absolute top-6 right-6 pointer-events-none opacity-85 animate-star-twinkle">
                <FourPointStar size={18} color="#F5C97B" glow />
              </div>
              <div className="absolute bottom-5 left-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>
              <div className="absolute bottom-5 right-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>

              {/* Existing Royal Star Gift Box Illustration with Golden Aura */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-1">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-75 pointer-events-none animate-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245,201,123,0.55) 0%, rgba(190,65,85,0.4) 55%, transparent 75%)',
                  }}
                />
                {giftBoxSpriteSrc ? (
                  <img
                    src={giftBoxSpriteSrc}
                    alt="Royal Star Gift Box"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(245,201,123,0.45)] pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative z-10 text-6xl select-none">🎁</div>
                )}
              </div>

              {/* Vintage Parchment Gift Card */}
              <div
                className="relative w-full rounded-[24px] border-2 border-[#B37D43] shadow-[0_14px_40px_rgba(10,3,6,0.75)] px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FCEBD2 0%, #F4D5AD 62%, #E5BC8A 100%)',
                }}
              >
                {/* Hand-drawn Crown & Star Corner Doodles matching the vintage parchment theme */}
                <svg
                  viewBox="0 0 36 28"
                  fill="none"
                  className="w-7 h-6 absolute top-3.5 left-4 opacity-80 pointer-events-none -rotate-12"
                >
                  <path
                    d="M4 22L7 9L14 16L18 6L22 16L29 9L32 22H4Z"
                    stroke="#3B1C11"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="25" x2="32" y2="25" stroke="#3B1C11" strokeWidth="1.8" />
                </svg>

                <div className="absolute top-3.5 right-4 opacity-80 pointer-events-none">
                  <FourPointStar size={16} color="#3B1C11" />
                </div>

                {/* Heading: "A Little Something For You..." */}
                <h2 className="font-serif-editorial italic font-bold text-[#35170C] text-[clamp(1.38rem,5.2vw,1.95rem)] leading-tight tracking-wide mt-1">
                  A Little Something For You...
                </h2>

                {/* Vintage Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2 w-full max-w-[240px] opacity-85">
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-xs">✦</span>
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                </div>

                {/* Five Selectable Gift Options */}
                <div className="grid grid-cols-5 gap-1.5 w-full mb-2.5">
                  {GIFT_BOX_OPTIONS.map((gift, idx) => {
                    const isSelected = idx === (giftOptionIdx % GIFT_BOX_OPTIONS.length);
                    return (
                      <button
                        key={gift.name}
                        type="button"
                        onClick={() => handleSelectGiftOption(idx)}
                        className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5E1622] text-[#FFF7EB] border-[#E6B875] shadow-md scale-[1.04]'
                            : 'bg-[#FFF7EB]/75 hover:bg-[#FFF7EB] text-[#35170C] border-[#C89B68]'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl leading-none select-none">
                          {gift.icon}
                        </span>
                        <span className="font-serif-editorial text-[10px] sm:text-[11px] font-semibold leading-tight mt-1 truncate w-full">
                          {gift.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Inner Cream Dialogue Box — ONLY the displayed gift and roast dialogue change */}
                <div
                  className="w-full min-h-[132px] sm:min-h-[142px] rounded-2xl border border-[#C89B68] px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col items-center justify-center text-center shadow-inner my-1"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF7EB 0%, #F9E7CC 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${giftOptionIdx}-${giftOpenCount}`}
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center space-y-1.5"
                    >
                      <h3 className="font-serif-editorial font-bold text-[#4E131E] text-[clamp(1.2rem,4.6vw,1.5rem)] leading-snug">
                        {currentGiftOption.name}:
                      </h3>
                      <p className="font-serif-editorial font-medium text-[#35170C] text-[clamp(1.02rem,4vw,1.25rem)] leading-relaxed">
                        {currentGiftOption.quote}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* "Open Another Gift 🎁" Vintage Parchment Scroll Button */}
                <button
                  type="button"
                  onClick={handleOpenAnotherGift}
                  className="mt-2.5 w-full max-w-[270px] py-2.5 px-5 min-h-[45px] rounded-2xl border-2 border-[#5A2A18] shadow-[0_6px_16px_rgba(53,23,12,0.28)] flex items-center justify-center gap-2 text-[#35170C] font-serif-editorial font-bold text-lg sm:text-xl tracking-wide hover:scale-[1.02] active:scale-[0.97] transition-transform cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7DEC0 0%, #E7BF91 55%, #D9AC79 100%)',
                  }}
                >
                  <span>Open Another Gift 🎁</span>
                </button>

                {/* "← Back" Dark Ornate Vintage Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSparkle();
                    setIsGiftBoxPopupOpen(false);
                  }}
                  className="mt-2 w-full max-w-[175px] py-2 px-4 min-h-[40px] rounded-xl bg-gradient-to-b from-[#4B2316] to-[#2B120A] border border-[#C89456] shadow-[0_6px_16px_rgba(24,8,4,0.45)] flex items-center justify-center gap-2 text-[#FAF0E0] font-serif-editorial text-base sm:text-lg tracking-wide hover:scale-[1.03] active:scale-[0.96] transition-transform cursor-pointer"
                >
                  <span>← Back</span>
                </button>

                {/* Subtle Bottom Parchment Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3 mb-0.5 w-full max-w-[220px] opacity-75">
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-[10px]">✦</span>
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                </div>
                <p className="font-serif-editorial italic text-[#3B1C11] text-xs sm:text-sm leading-snug opacity-90">
                  — Hand-picked with zero budget &amp; maximum sarcasm. —
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ANCIENT SCROLLS OF TRUTH EXPERIENCE ("Ancient Scrolls of Truth...")
          Displays the 5 scroll options, reveals the selected scroll's title and roast,
          and includes "Unroll Another Scroll 📜" and "← Back" buttons
         ===================================================================== */}
      <AnimatePresence>
        {isScrollPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsScrollPopupOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D080E]/80 backdrop-blur-sm p-3 sm:p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[430px] rounded-[28px] border-2 border-[#D9A875]/80 shadow-[0_24px_75px_rgba(12,3,6,0.9)] overflow-hidden px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center text-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #3A192A 0%, #24101B 48%, #170911 100%)',
              }}
            >
              {/* Decorative Hanging Gold Stars & Sparkles */}
              <div className="absolute top-3 left-5 pointer-events-none opacity-80 animate-star-twinkle">
                <FourPointStar size={16} color="#F5C97B" glow />
              </div>
              <div className="absolute top-6 right-6 pointer-events-none opacity-85 animate-star-twinkle">
                <FourPointStar size={18} color="#F5C97B" glow />
              </div>
              <div className="absolute bottom-5 left-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>
              <div className="absolute bottom-5 right-6 pointer-events-none opacity-70">
                <FourPointStar size={14} color="#D9A875" />
              </div>

              {/* Existing Mystery Scroll Illustration with Warm Golden Aura */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-1">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-75 pointer-events-none animate-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245,201,123,0.55) 0%, rgba(190,65,85,0.38) 55%, transparent 75%)',
                  }}
                />
                {scrollSpriteSrc ? (
                  <img
                    src={scrollSpriteSrc}
                    alt="Ancient Scroll of Truth"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(245,201,123,0.45)] pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative z-10 text-6xl select-none">📜</div>
                )}
              </div>

              {/* Vintage Parchment Scroll Card */}
              <div
                className="relative w-full rounded-[24px] border-2 border-[#B37D43] shadow-[0_14px_40px_rgba(10,3,6,0.75)] px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FCEBD2 0%, #F4D5AD 62%, #E5BC8A 100%)',
                }}
              >
                {/* Hand-drawn Crown & Star Corner Doodles matching the vintage parchment theme */}
                <svg
                  viewBox="0 0 36 28"
                  fill="none"
                  className="w-7 h-6 absolute top-3.5 left-4 opacity-80 pointer-events-none -rotate-12"
                >
                  <path
                    d="M4 22L7 9L14 16L18 6L22 16L29 9L32 22H4Z"
                    stroke="#3B1C11"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="25" x2="32" y2="25" stroke="#3B1C11" strokeWidth="1.8" />
                </svg>

                <div className="absolute top-3.5 right-4 opacity-80 pointer-events-none">
                  <FourPointStar size={16} color="#3B1C11" />
                </div>

                {/* Heading: "Ancient Scrolls of Truth..." */}
                <h2 className="font-serif-editorial italic font-bold text-[#35170C] text-[clamp(1.38rem,5.2vw,1.95rem)] leading-tight tracking-wide mt-1">
                  Ancient Scrolls of Truth...
                </h2>

                {/* Vintage Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2 w-full max-w-[240px] opacity-85">
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-xs">✦</span>
                  <div className="h-[1.5px] flex-1 bg-[#4B2313]" />
                </div>

                {/* Five Selectable Scroll Options */}
                <div className="grid grid-cols-5 gap-1.5 w-full mb-2.5">
                  {ANCIENT_SCROLLS_OF_TRUTH.map((scrollItem, idx) => {
                    const isSelected =
                      idx === (scrollOptionIdx % ANCIENT_SCROLLS_OF_TRUTH.length);
                    return (
                      <button
                        key={scrollItem.title}
                        type="button"
                        onClick={() => handleSelectScrollOption(idx)}
                        className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5E1622] text-[#FFF7EB] border-[#E6B875] shadow-md scale-[1.04]'
                            : 'bg-[#FFF7EB]/75 hover:bg-[#FFF7EB] text-[#35170C] border-[#C89B68]'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl leading-none select-none">
                          📜
                        </span>
                        <span className="font-serif-editorial text-[10px] sm:text-[11px] font-semibold leading-tight mt-1 truncate w-full">
                          {scrollItem.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Inner Cream Dialogue Box — ONLY the displayed scroll title and roast dialogue change */}
                <div
                  className="w-full min-h-[140px] sm:min-h-[150px] rounded-2xl border border-[#C89B68] px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col items-center justify-center text-center shadow-inner my-1"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF7EB 0%, #F9E7CC 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${scrollOptionIdx}-${scrollUnrollCount}`}
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center space-y-1.5"
                    >
                      <h3 className="font-serif-editorial font-bold text-[#4E131E] text-[clamp(1.15rem,4.4vw,1.45rem)] leading-snug">
                        {currentScrollOption.title}:
                      </h3>
                      <p className="font-serif-editorial font-medium text-[#35170C] text-[clamp(0.98rem,3.9vw,1.2rem)] leading-relaxed">
                        {currentScrollOption.quote}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* "Unroll Another Scroll 📜" Vintage Parchment Scroll Button */}
                <button
                  type="button"
                  onClick={handleUnrollAnotherScroll}
                  className="mt-2.5 w-full max-w-[280px] py-2.5 px-5 min-h-[45px] rounded-2xl border-2 border-[#5A2A18] shadow-[0_6px_16px_rgba(53,23,12,0.28)] flex items-center justify-center gap-2 text-[#35170C] font-serif-editorial font-bold text-lg sm:text-xl tracking-wide hover:scale-[1.02] active:scale-[0.97] transition-transform cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7DEC0 0%, #E7BF91 55%, #D9AC79 100%)',
                  }}
                >
                  <span>Unroll Another Scroll 📜</span>
                </button>

                {/* "← Back" Dark Ornate Vintage Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSparkle();
                    setIsScrollPopupOpen(false);
                  }}
                  className="mt-2 w-full max-w-[175px] py-2 px-4 min-h-[40px] rounded-xl bg-gradient-to-b from-[#4B2316] to-[#2B120A] border border-[#C89456] shadow-[0_6px_16px_rgba(24,8,4,0.45)] flex items-center justify-center gap-2 text-[#FAF0E0] font-serif-editorial text-base sm:text-lg tracking-wide hover:scale-[1.03] active:scale-[0.96] transition-transform cursor-pointer"
                >
                  <span>← Back</span>
                </button>

                {/* Subtle Bottom Parchment Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3 mb-0.5 w-full max-w-[220px] opacity-75">
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                  <span className="text-[#4B2313] text-[10px]">✦</span>
                  <div className="h-[1px] flex-1 bg-[#4B2313]" />
                </div>
                <p className="font-serif-editorial italic text-[#3B1C11] text-xs sm:text-sm leading-snug opacity-90">
                  — Recorded in the royal archives. No appeals allowed. —
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          INTERACTIVE SURPRISE REVEAL MODAL FOR OTHER ROOM OBJECTS
         ===================================================================== */}
      <AnimatePresence>
        {activeObject && activeSurprise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveObjectId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#22090F]/80 backdrop-blur-md"
          >
            <motion.div
              key={`${activeObject.id}-${activeVariantIdx}`}
              initial={{ opacity: 0, scale: 0.86, y: 20, rotate: -1.5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 14 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[28px] border-2 border-[#E2B26B] shadow-[0_24px_70px_rgba(18,4,8,0.7)] overflow-hidden p-5 sm:p-6 text-center space-y-4"
              style={{
                background:
                  'radial-gradient(circle at 50% 15%, #FFF7F2 0%, #F7DFD6 58%, #EBC4B8 100%)',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveObjectId(null)}
                aria-label="Close surprise"
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#5E1622]/10 hover:bg-[#5E1622]/20 text-[#4A141E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5E1622] text-[#FFF3D1] border border-[#E6B875] font-cinzel text-[10px] tracking-[0.15em] font-semibold">
                <Sparkles className="w-3 h-3 text-[#F5C97B]" />
                <span>{activeSurprise.badge}</span>
              </div>

              {/* Animated Bouncing Emoji / Mini Visual */}
              <motion.div
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: [0.8, 1.18, 1], rotate: [0, 8, -6, 0] }}
                transition={{ duration: 0.55 }}
                className="text-4xl sm:text-5xl py-1 select-none"
              >
                {activeSurprise.emojiAnim}
              </motion.div>

              {/* Surprise Headline & Message */}
              <div className="space-y-2 bg-[#FFFDFB] rounded-2xl p-4 sm:p-5 border border-[#DFB6A8] shadow-inner">
                <h3 className="font-serif-editorial font-bold text-2xl sm:text-3xl text-[#4E131E] leading-tight">
                  {activeSurprise.headline}
                </h3>
                <p className="font-serif-editorial text-base sm:text-lg text-[#361118] leading-relaxed">
                  {activeSurprise.message}
                </p>
                <p className="font-serif-editorial italic text-xs sm:text-sm text-[#7D2835] pt-1">
                  ✦ {activeSurprise.subtext} ✦
                </p>
              </div>

              {/* Live Reactions from Cute Cartoon Spider & Crowned Snake */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div className="rounded-2xl p-2.5 bg-[#FFF6F2] border border-[#DFB6A8] flex items-center gap-2">
                  <div className="shrink-0">
                    <CuteCartoonSpiderSVG size={42} isExcited />
                  </div>
                  <p className="font-serif-editorial italic text-xs sm:text-sm text-[#3B131B] leading-snug">
                    &ldquo;{activeSurprise.spiderComment}&rdquo;
                  </p>
                </div>

                <div className="rounded-2xl p-2.5 bg-[#FFF6F2] border border-[#DFB6A8] flex items-center gap-2">
                  <div className="shrink-0">
                    <CrownedSnakeCompanionSVG size={44} isExcited />
                  </div>
                  <p className="font-serif-editorial italic text-xs sm:text-sm text-[#3B131B] leading-snug">
                    &ldquo;{activeSurprise.snakeComment}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Buttons: Tap Again for a Different Surprise OR Back to Room */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTapAgainSameObject}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-[#6D1A28] hover:bg-[#852031] text-[#FFF5EE] border border-[#E6B875] font-serif-editorial font-semibold text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-[#F5C97B]" />
                  <span>Tap Again for New Surprise!</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playObjectSound(activeObject.soundType);
                  }}
                  aria-label="Replay sound effect"
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-[#F5DCD4] hover:bg-[#EFCBC0] text-[#4A141E] border border-[#C9968B] font-serif-editorial font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#6D1A28]" />
                  <span>Sound FX</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
