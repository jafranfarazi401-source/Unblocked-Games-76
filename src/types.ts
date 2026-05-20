/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FaceType = 'custom1' | 'custom2' | 'custom3';

export interface FallingFaceData {
  id: string;
  x: number; // percentage of arena width (0 to 100)
  y: number; // percentage of height or absolute pixels (using relative tracking for full responsiveness)
  vx: number; // horizontal drift speed
  vy: number; // vertical falling speed
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: FaceType;
  isSlapped: boolean;
  slapTime?: number;
  escaped?: boolean;
  slapVX?: number; // horizontal flight velocity after slaps
  slapVY?: number; // vertical launch velocity after slaps
}

export type WeaponSoundType = 'slap' | 'slipper' | 'fish' | 'glove' | 'hammer';

export interface Weapon {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  multiplier: number;
  soundType: WeaponSoundType;
  impactScale: number; // visual scale of screen shake / flash
}

export type ParticleType = 'star' | 'donut' | 'impact' | 'text' | 'droplet' | 'weapon';

export interface GameParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: ParticleType;
  text?: string;
}

export type GameMode = 'zen' | 'arcade' | 'challenge';

export interface GameStats {
  highScoreZen: number;
  highScoreArcade: number;
  highScoreChallenge: number;
  lifetimeSlaps: number;
  lifetimePoints: number;
}
