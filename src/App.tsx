/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CakeInvitationScreen } from './components/CakeInvitationScreen';
import { MysteryDoorsScreen } from './components/MysteryDoorsScreen';
import { OurMemoriesScreen } from './components/OurMemoriesScreen';
import { SomethingForYouScreen } from './components/SomethingForYouScreen';
import { OneLastSurpriseScreen } from './components/OneLastSurpriseScreen';
import { FloatingPetals } from './components/GothicOrnaments';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [screen, setScreen] = useState<'cake' | 'doors' | 'memories' | 'something' | 'lastsurprise'>('cake');
  const [unlockedDoors, setUnlockedDoors] = useState<number[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleCakeComplete = () => {
    setScreen('doors');
  };

  const handleBackToCake = () => {
    setScreen('cake');
  };

  const handleOpenMemories = () => {
    setScreen('memories');
  };

  const handleOpenSomethingForYou = () => {
    setScreen('something');
  };

  const handleOpenOneLastSurprise = () => {
    setScreen('lastsurprise');
  };

  const handleBackToDoors = () => {
    setScreen('doors');
  };

  const handleUnlockDoor = (doorId: number) => {
    setUnlockedDoors((prev) => (prev.includes(doorId) ? prev : [...prev, doorId]));
  };

  const handleToggleMusic = () => {
    const playing = soundEngine.toggleAmbientMusicBox();
    setIsMusicPlaying(playing);
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#D7CCC4] text-[#2E1D1F] overflow-hidden select-none">
      {/* Drifting Dark Crimson Rose Petals across all screens */}
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {screen === 'cake' && (
          <CakeInvitationScreen key="cake-screen" onComplete={handleCakeComplete} />
        )}
        {screen === 'doors' && (
          <MysteryDoorsScreen
            key="doors-screen"
            onBackToCake={handleBackToCake}
            onOpenMemories={handleOpenMemories}
            onOpenSomethingForYou={handleOpenSomethingForYou}
            onOpenOneLastSurprise={handleOpenOneLastSurprise}
            unlockedDoors={unlockedDoors}
            onUnlockDoor={handleUnlockDoor}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
          />
        )}
        {screen === 'memories' && (
          <OurMemoriesScreen key="memories-screen" onBackToDoors={handleBackToDoors} />
        )}
        {screen === 'something' && (
          <SomethingForYouScreen key="something-screen" onBackToDoors={handleBackToDoors} />
        )}
        {screen === 'lastsurprise' && (
          <OneLastSurpriseScreen key="lastsurprise-screen" onBackToDoors={handleBackToDoors} />
        )}
      </AnimatePresence>
    </div>
  );
}
