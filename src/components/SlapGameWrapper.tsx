/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SlapArena } from './SlapArena';
import { Weapon, GameStats } from '../types';
import { playUnlockSound, playButtonClickSound } from '../utils/audio';

const WEAPONS_ARSENAL: Weapon[] = [
  {
    id: 'hand',
    name: 'Open Palm',
    description: 'The standard issue slap. Fast, lightweight, and leaves a gorgeous red mark.',
    emoji: '🖐️',
    cost: 0,
    multiplier: 1,
    soundType: 'slap',
    impactScale: 1.0,
  },
  {
    id: 'slipper',
    name: 'Meme Slipper',
    description: 'The legendary household accelerator. Unleashes loud dual spanking thwacks.',
    emoji: '🩴',
    cost: 80,
    multiplier: 2,
    soundType: 'slipper',
    impactScale: 1.25,
  },
  {
    id: 'fish',
    name: 'Floppy Mackerel',
    description: 'Slack-slap with a fresh, wet fish. Releases satisfyingly damp squelchy pops.',
    emoji: '🐟',
    cost: 350,
    multiplier: 5,
    soundType: 'fish',
    impactScale: 1.5,
  },
  {
    id: 'glove',
    name: 'Gauntlet Punch',
    description: 'Heavily weighted kinetic blow. Slaps literally rattle the entire screen grid.',
    emoji: '🥊',
    cost: 1000,
    multiplier: 12,
    soundType: 'glove',
    impactScale: 1.9,
  },
  {
    id: 'hammer',
    name: 'Squeaky Mallet',
    description: 'Ultra chaotic squeaking hammer. Squeezes maximum slap points out of targets.',
    emoji: '🔨',
    cost: 3000,
    multiplier: 35,
    soundType: 'hammer',
    impactScale: 2.4,
  },
];

export const SlapGameWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Statistics loading state
  const [stats, setStats] = useState<GameStats>({
    highScoreZen: 0,
    highScoreArcade: 0,
    highScoreChallenge: 0,
    lifetimeSlaps: 0,
    lifetimePoints: 0,
  });

  // Weapon unlocks
  const [unlockedWeaponIds, setUnlockedWeaponIds] = useState<string[]>(['hand']);
  const [activeWeaponId, setActiveWeaponId] = useState<string>('hand');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    const element = containerRef.current as any;
    const doc = document as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  // Load from local storage
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem('slap_game_stats_local');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      const storedUnlocks = localStorage.getItem('slap_game_unlocked_weapons_local');
      if (storedUnlocks) {
        setUnlockedWeaponIds(JSON.parse(storedUnlocks));
      }

      const storedActive = localStorage.getItem('slap_game_active_weapon_local');
      if (storedActive && WEAPONS_ARSENAL.some(w => w.id === storedActive)) {
        setActiveWeaponId(storedActive);
      }
    } catch (e) {
      console.warn('Local storage states reading failed:', e);
    }
  }, []);

  // Universal sound player for any button click in the game
  useEffect(() => {
    const handleGlobalButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const button = target.closest('button');
        if (button) {
          playButtonClickSound(isMuted);
        }
      }
    };

    document.addEventListener('click', handleGlobalButtonClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalButtonClick, true);
    };
  }, [isMuted]);

  const activeWeapon = WEAPONS_ARSENAL.find(w => w.id === activeWeaponId) || WEAPONS_ARSENAL[0];

  // Weapon purchasing handler
  const handleUnlockWeapon = (weapon: Weapon) => {
    if (stats.lifetimePoints < weapon.cost) return;

    if (!unlockedWeaponIds.includes(weapon.id)) {
      const nextUnlocks = [...unlockedWeaponIds, weapon.id];
      setUnlockedWeaponIds(nextUnlocks);
      setActiveWeaponId(weapon.id);
      
      // Save
      localStorage.setItem('slap_game_unlocked_weapons_local', JSON.stringify(nextUnlocks));
      localStorage.setItem('slap_game_active_weapon_local', weapon.id);
      
      playUnlockSound(isMuted);
    }
  };

  const handleEquipWeapon = (weaponId: string) => {
    if (unlockedWeaponIds.includes(weaponId)) {
      setActiveWeaponId(weaponId);
      localStorage.setItem('slap_game_active_weapon_local', weaponId);
      playUnlockSound(isMuted);
    }
  };

  // Reset progress safely
  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all your lifetime slap records, high scores, and weapons progress?')) {
      const freshStats: GameStats = {
        highScoreZen: 0,
        highScoreArcade: 0,
        highScoreChallenge: 0,
        lifetimeSlaps: 0,
        lifetimePoints: 0,
      };
      setStats(freshStats);
      setUnlockedWeaponIds(['hand']);
      setActiveWeaponId('hand');
      setScore(0);
      localStorage.setItem('slap_game_stats_local', JSON.stringify(freshStats));
      localStorage.setItem('slap_game_unlocked_weapons_local', JSON.stringify(['hand']));
      localStorage.setItem('slap_game_active_weapon_local', 'hand');
      playUnlockSound(isMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      id="slap-game-container"
      className={`w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative transition-all duration-[50ms] ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none' 
          : 'rounded-xl sm:rounded-3xl'
      }`}
    >
      {/* Play Stage */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        <SlapArena
          activeWeapon={activeWeapon}
          score={score}
          setScore={setScore}
          stats={stats}
          setStats={setStats}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
};
