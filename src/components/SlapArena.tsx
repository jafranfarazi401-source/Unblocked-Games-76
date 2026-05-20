/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  FallingFaceData, 
  GameParticle, 
  Weapon, 
  GameMode, 
  GameStats, 
  FaceType 
} from '../types';
import { FallingFace } from './FallingFace';
import { 
  playSlapSound, 
  playUnlockSound, 
  playGameOverSound, 
  playComboBrokenSound 
} from '../utils/audio';
import { 
  Trophy, 
  Sparkles, 
  Heart, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Play, 
  Zap, 
  Flame,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface SlapArenaProps {
  activeWeapon: Weapon;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  stats: GameStats;
  setStats: React.Dispatch<React.SetStateAction<GameStats>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isFullscreen?: boolean;
  toggleFullscreen?: () => void;
}

const CONSTANT_GRAVITY = 0.65;
const SLAP_WORDS = ['SLAP!', 'WHACK!', 'POW!', 'SMACK!', 'CRACK!', 'BOOM!', 'BAM!', 'THWACK!'];
const SHOES = ['👢', '👡', '👠', '🥿', '🥾', '👟', '👞'];
const FACE_TYPES: FaceType[] = ['custom1', 'custom2', 'custom3'];

export const SlapArena: React.FC<SlapArenaProps> = ({
  activeWeapon,
  score,
  setScore,
  stats,
  setStats,
  isMuted,
  setIsMuted,
  isFullscreen = false,
  toggleFullscreen,
}) => {
  // Game Setup
  const [gameMode, setGameMode] = useState<GameMode>('arcade');
  const [faces, setFaces] = useState<FallingFaceData[]>([]);
  const [particles, setParticles] = useState<GameParticle[]>([]);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // standard challenge/timer modes
  const [isPlayingSeconds, setIsPlayingSeconds] = useState<number>(0);
  
  // Game visual feedback
  const [screenShake, setScreenShake] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [arenaFlash, setArenaFlash] = useState<boolean>(false);

  // References
  const arenaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number>(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty counters
  const speedScale = useRef<number>(1.0);
  const spawnRateMs = useRef<number>(1600);

  // Pre-cached arena dimensions mapped locally
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!arenaRef.current) return;
    const updateSize = () => {
      if (arenaRef.current) {
        setDimensions({
          width: arenaRef.current.clientWidth,
          height: arenaRef.current.clientHeight,
        });
      }
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(arenaRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Active gameplay duration tracker
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      setIsPlayingSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setIsPlayingSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  // Trouble transition warning trigger
  useEffect(() => {
    if (isPlayingSeconds === 5 && isPlaying && !isGameOver) {
      // Impact camera flash and shake to alarm the user
      setArenaFlash(true);
      setTimeout(() => setArenaFlash(false), 200);
      setScreenShake({ x: 12, y: 12 });
      setTimeout(() => setScreenShake({ x: 0, y: 0 }), 300);
      
      // Audible warning beep using standard Web Audio
      if (!isMuted) {
        try {
          const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.41);
          }
        } catch (_) {}
      }
    }
  }, [isPlayingSeconds, isPlaying, isGameOver, isMuted]);

  // Update speed/spawning based on game state score & elapsed duration (making it significantly harder after 5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    
    let baseSpeed = 1.0;
    let baseSpawn = 1600;

    // Base rules for game scale difficulties
    if (gameMode === 'arcade') {
      baseSpeed = 1.0 + Math.floor(score / 40) * 0.15;
      baseSpawn = Math.max(500, 1600 - Math.floor(score / 20) * 120);
    } else if (gameMode === 'challenge') {
      baseSpeed = 1.4 + Math.floor(score / 50) * 0.22;
      baseSpawn = Math.max(400, 1100 - Math.floor(score / 25) * 100);
    } else { // Zen Mode
      baseSpeed = 0.9 + Math.floor(score / 150) * 0.08;
      baseSpawn = 1500;
    }

    // Dynamic difficulty bump! Exactly 5 seconds after starting a session, speeds scale up drastically!
    if (isPlayingSeconds >= 5) {
      // 1.55x speed increase & launch 45% faster
      baseSpeed *= 1.55;
      baseSpawn = Math.max(350, Math.floor(baseSpawn * 0.55));
    }

    speedScale.current = baseSpeed;
    spawnRateMs.current = baseSpawn;
  }, [score, gameMode, isPlaying, isPlayingSeconds]);

  // Combo decay tracking
  const triggerSlapCombo = () => {
    setCombo(prev => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
      playComboBrokenSound(isMuted);
    }, 2200); // 2.2 seconds to sustain combo
  };

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

  // Spawn new falling face
  const spawnFace = () => {
    if (!arenaRef.current) return;
    const id = Math.random().toString(36).substring(2, 9);
    
    // Choose size and speed parameters depending on mobile or desktop
    const isMobile = dimensions.width < 550;
    const size = isMobile 
      ? Math.floor(Math.random() * 15) + 42   // mobile size: 42 to 57px
      : Math.floor(Math.random() * 32) + 64;  // desktop size: 64 to 96px
      
    const x = Math.random() * 80 + 10; // offset slightly from borders
    const y = -size / 2; // spawn offscreen top
    
    // Whimsical speeds - adjusted on mobile so they don't sprint past the short screen too fast
    const speedAdjustment = isMobile ? 0.72 : 1.0;
    const vy = (Math.random() * 1.5 + 2.2) * speedScale.current * speedAdjustment;
    const vx = (Math.random() * 0.8 - 0.4) * speedScale.current * speedAdjustment;
    
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 3 - 1.5;
    const type = FACE_TYPES[Math.floor(Math.random() * FACE_TYPES.length)];

    const newFace: FallingFaceData = {
      id,
      x,
      y,
      vx,
      vy,
      rotation,
      rotationSpeed,
      size,
      type,
      isSlapped: false,
    };

    setFaces(prev => [...prev, newFace]);
  };

  // Spark and Text visual explosions
  const spawnParticlesOnSlap = (
    clickX: number, 
    clickY: number, 
    faceType: FaceType, 
    earnedPoints: number
  ) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relativeX = clickX - rect.left;
    const relativeY = clickY - rect.top;

    const newParticles: GameParticle[] = [];

    // 1. Text Particle representing the punchy SLAP bubble
    const word = SLAP_WORDS[Math.floor(Math.random() * SLAP_WORDS.length)];
    const textParticleId = `text-${Math.random()}`;
    const wordParticle: GameParticle = {
      id: textParticleId,
      x: relativeX,
      y: relativeY - 25,
      vx: (Math.random() * 2 - 1) * 1.5,
      vy: -3.5 - Math.random() * 2.5,
      color: 'text-amber-300 font-extrabold', // class tailwind representation
      size: Math.floor(Math.random() * 8) + 24, // font sizes 24-32px
      rotation: Math.random() * 20 - 10,
      rotationSpeed: Math.random() * 4 - 2,
      alpha: 1.0,
      life: 0,
      maxLife: 0.9, // seconds
      type: 'text',
      text: `${word} (+${earnedPoints})`,
    };
    newParticles.push(wordParticle);

    // 2. Expand Wave Circle Ripple
    const rippleParticleId = `ripple-${Math.random()}`;
    const rippleParticle: GameParticle = {
      id: rippleParticleId,
      x: relativeX,
      y: relativeY,
      vx: 0,
      vy: 0,
      color: '#fef08a', // expanding glow border
      size: 15,
      rotation: 0,
      rotationSpeed: 0,
      alpha: 0.8,
      life: 0,
      maxLife: 0.35,
      type: 'impact',
    };
    newParticles.push(rippleParticle);

    // 3. Shiny Stars, Sweat drops and circle burst debris sparks
    const scoreColor = faceType === 'custom1' ? '#facc15' : faceType === 'custom2' ? '#f43f5e' : '#38bdf8';
    const numStars = Math.floor(Math.random() * 6) + 10;
    for (let i = 0; i < numStars; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      const pId = `spark-${Math.random()}-${i}`;
      
      const spark: GameParticle = {
        id: pId,
        x: relativeX,
        y: relativeY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // slightly upwards offset bias
        color: Math.random() > 0.4 ? scoreColor : '#fca5a5',
        size: Math.floor(Math.random() * 8) + 8,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 20 - 10,
        alpha: 1.0,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
        type: i % 3 === 0 ? 'droplet' : 'star',
      };
      
      newParticles.push(spark);
    }

    // 4. Swinging Shoe / Slipper slam animation
    const randomShoe = SHOES[Math.floor(Math.random() * SHOES.length)];
    const shoeParticleId = `shoe-${Math.random()}`;
    const shoeParticle: GameParticle = {
      id: shoeParticleId,
      x: relativeX,
      y: relativeY,
      vx: 0,
      vy: 0,
      color: randomShoe, // Stores a gorgeous shoe emoji (e.g. 👢, 👡, 👠, etc.)
      size: 96,
      rotation: -80, // Starts rotated back
      rotationSpeed: 0,
      alpha: 1.0,
      life: 0,
      maxLife: 0.28, // Fast swing arc
      type: 'weapon',
    };
    newParticles.push(shoeParticle);

    // Additionally spawn 2 mini flying shoe debris particles shooting off!
    for (let sIdx = 0; sIdx < 2; sIdx++) {
      const extraShoe = SHOES[Math.floor(Math.random() * SHOES.length)];
      const debrisId = `shoedebris-${Math.random()}-${sIdx}`;
      const angle = (Math.random() * Math.PI) + Math.PI; // fly upwards/outwards
      const speed = Math.random() * 4 + 3;
      newParticles.push({
        id: debrisId,
        x: relativeX,
        y: relativeY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color: extraShoe,
        size: 32, // mini flying shoes
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 24 - 12,
        alpha: 1.0,
        life: 0,
        maxLife: 0.8,
        type: 'weapon', // reuse weapon rendering so they can be parsed as text-large emoticons
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Perform absolute slapping operations
  const handleFaceSlap = (id: string, clickX: number, clickY: number) => {
    if (!isPlaying || isGameOver) return;

    // 1. Find the target face in the current state array first
    const targetFace = faces.find(f => f.id === id);
    if (!targetFace || targetFace.isSlapped) return;

    // 2. Perform calculations and state modifications outside of state updaters
    if (!arenaRef.current) return;
    const arenaRect = arenaRef.current.getBoundingClientRect();
    const faceCenterRelativeX = (targetFace.x / 100) * arenaRect.width;
    const clickRelativeX = clickX - arenaRect.left;

    // Click to the left -> thrust to the right, and vice versa!
    const pushDirection = clickRelativeX < faceCenterRelativeX ? 1 : -1;
    const bounceIntensityX = (Math.random() * 5 + 6) * pushDirection;
    const bounceIntensityY = -(Math.random() * 6 + 7); // launched upwards

    // Play Weapon impact auditory/visual cues
    playSlapSound(activeWeapon.soundType, isMuted);
    triggerSlapCombo();

    // Math Combo calculations
    const comboMultiplier = Math.max(1, Math.floor(combo / 5) + 1);
    const slapPoints = activeWeapon.multiplier * comboMultiplier;

    // Update core score values
    setScore(prevScore => prevScore + slapPoints);
    
    // Upgrade general stats lifetime entries
    setStats(prevStats => {
      const nextStats = { ...prevStats };
      nextStats.lifetimeSlaps += 1;
      nextStats.lifetimePoints += slapPoints;
      
      const currentFinalScore = score + slapPoints;
      // Save matching highscore based on mode
      if (gameMode === 'zen') {
        if (currentFinalScore > nextStats.highScoreZen) {
          nextStats.highScoreZen = currentFinalScore;
        }
      } else if (gameMode === 'arcade') {
        if (currentFinalScore > nextStats.highScoreArcade) {
          nextStats.highScoreArcade = currentFinalScore;
        }
      } else if (gameMode === 'challenge') {
        if (currentFinalScore > nextStats.highScoreChallenge) {
          nextStats.highScoreChallenge = currentFinalScore;
        }
      }
      
      localStorage.setItem('slap_game_stats_local', JSON.stringify(nextStats));
      return nextStats;
    });

    // Shaking the camera screen based on weapon slap impact
    const shakeScalar = activeWeapon.impactScale;
    setScreenShake({
      x: (Math.random() * 12 - 6) * shakeScalar,
      y: (Math.random() * 12 - 6) * shakeScalar,
    });

    if (activeWeapon.impactScale > 1.3) {
      setArenaFlash(true);
      setTimeout(() => setArenaFlash(false), 90);
    }

    // Restore screen coords
    setTimeout(() => {
      setScreenShake({ x: 0, y: 0 });
    }, 150);

    // Trigger particle explosions at physical coordinates
    spawnParticlesOnSlap(clickX, clickY, targetFace.type, slapPoints);

    // 3. Update the faces list state cleanly (without side-effects inside)
    setFaces(prevFaces => {
      return prevFaces.map(f => {
        if (f.id === id) {
          return {
            ...f,
            isSlapped: true,
            slapTime: Date.now(),
            slapVX: bounceIntensityX,
            slapVY: bounceIntensityY,
            rotationSpeed: (Math.random() * 25 + 15) * pushDirection,
          };
        }
        return f;
      });
    });
  };

  // Dedicated core physics frames clock tick
  const updatePhysicsLoop = (time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    const deltaMs = Math.min(100, time - previousTimeRef.current);
    previousTimeRef.current = time;

    // Seconds fraction
    const dtSeconds = deltaMs / 1000;

    // Let's update faces physics coordinates
    setFaces(prevFaces => {
      const activeHeight = dimensions.height;
      let lossOfLife = 0;

      const nextFaces = prevFaces
        .map(face => {
          // If face is NOT slapped
          if (!face.isSlapped) {
            // Drop down smoothly based on elapsed delta fraction 
            const speedY = face.vy * (deltaMs / 16.666);
            const speedX = face.vx * (deltaMs / 16.666);
            
            const nextY = face.y + speedY;
            // Wobble slightly sideways as a wave
            const nextX = face.x + Math.sin(time / 280 + face.size) * 0.12 * (deltaMs / 16.666);

            // Trigger Escape check
            if (nextY > activeHeight + face.size) {
              // Face fell out bottom without getting slapped!
              if (gameMode !== 'zen') {
                lossOfLife += 1;
              }
              return { ...face, escaped: true };
            }

            return {
              ...face,
              y: nextY,
              x: Math.max(8, Math.min(92, nextX)), // keep bounded
              rotation: face.rotation + face.rotationSpeed * (deltaMs / 16.666),
            };
          } else {
            // Face IS slapped! Flying physical trajectory coordinates
            const currentVX = face.slapVX ?? 0;
            const currentVY = face.slapVY ?? 0;

            const nextX = face.x + (currentVX * (deltaMs / 16.666) / dimensions.width) * 100;
            const nextY = face.y + currentVY * (deltaMs / 16.666);
            
            // Apply gravity to fall trajectory
            const updatedVY = currentVY + CONSTANT_GRAVITY * (deltaMs / 16.666);
            const updatedVX = currentVX * Math.pow(0.97, deltaMs / 16.666); // slight drag

            return {
              ...face,
              x: nextX,
              y: nextY,
              slapVX: updatedVX,
              slapVY: updatedVY,
              rotation: face.rotation + face.rotationSpeed * (deltaMs / 16.666),
            };
          }
        })
        // Filter out those that are off screen or escaped
        .filter(face => {
          if (face.escaped) return false;
          
          // Slapped pieces can be filtered once they leave screen boundaries
          if (face.isSlapped) {
            if (face.y > activeHeight + face.size || face.x < -15 || face.x > 115) {
              return false;
            }
          }
          return true;
        });

      if (lossOfLife > 0) {
        setLives(prevLives => {
          const nextLives = Math.max(0, prevLives - lossOfLife);
          if (nextLives <= 0) {
            // Trigger game over sequences
            setIsGameOver(true);
            setIsPlaying(false);
            playGameOverSound(isMuted);
          } else {
            // Screen shake indicating a lost life penalty
            setScreenShake({ x: 9, y: 0 });
            setTimeout(() => setScreenShake({ x: 0, y: 0 }), 140);
          }
          return nextLives;
        });
      }

      return nextFaces;
    });

    // Let's update particles ticks
    setParticles(prevP => {
      return prevP
        .map(p => {
          if (p.type === 'text') {
            return {
              ...p,
              y: p.y + p.vy,
              x: p.x + p.vx,
              alpha: Math.max(0, 1.0 - (p.life / p.maxLife)),
              rotation: p.rotation + p.rotationSpeed,
              life: p.life + dtSeconds,
            };
          } else if (p.type === 'impact') {
            return {
              ...p,
              size: p.size + 14 * (deltaMs / 16.666), // expand quickly
              alpha: Math.max(0, 1.0 - (p.life / p.maxLife)),
              life: p.life + dtSeconds,
            };
          } else if (p.type === 'weapon') {
            const progress = p.life / p.maxLife; // 0 to 1
            // Rapid swing arc if static, or spin freely if flying
            const currentRotation = p.vx !== 0 
              ? p.rotation + p.rotationSpeed * (deltaMs / 16.666) 
              : -80 + (progress * 135);
            
            // Grows larger during the impact slap phase, then shrinks a bit
            const currentScale = progress < 0.3 ? 0.7 + progress * 1.5 : 1.15 - (progress - 0.3) * 0.95;
            
            // Apply coordinates movement if velocities exist (for flying shoe debris)
            const nextX = p.x + p.vx * (deltaMs / 16.666);
            const nextY = p.y + p.vy * (deltaMs / 16.666);
            const nextVY = p.vy !== 0 ? p.vy + CONSTANT_GRAVITY * 0.25 * (deltaMs / 16.666) : 0;
            const nextVX = p.vx !== 0 ? p.vx * Math.pow(0.97, deltaMs / 16.666) : 0;

            return {
              ...p,
              x: nextX,
              y: nextY,
              vx: nextVX,
              vy: nextVY,
              rotation: currentRotation,
              size: p.vx !== 0 ? p.size : 96 * currentScale,
              alpha: Math.max(0, 1.0 - progress),
              life: p.life + dtSeconds,
            };
          } else {
            // Sparks / Stars / Droplets
            const nextVY = p.vy + CONSTANT_GRAVITY * 0.3 * (deltaMs / 16.666);
            const nextVX = p.vx * Math.pow(0.96, deltaMs / 16.666);
            return {
              ...p,
              x: p.x + nextVX,
              y: p.y + nextVY,
              vy: nextVY,
              vx: nextVX,
              alpha: Math.max(0, 1.0 - (p.life / p.maxLife)),
              rotation: p.rotation + p.rotationSpeed,
              life: p.life + dtSeconds,
            };
          }
        })
        .filter(p => p.life < p.maxLife);
    });

    // Handle spawn timings
    spawnTimerRef.current += deltaMs;
    if (spawnTimerRef.current >= spawnRateMs.current) {
      spawnFace();
      spawnTimerRef.current = 0;
    }

    // Keep loop active
    if (isPlaying && !isGameOver) {
      requestRef.current = requestAnimationFrame(updatePhysicsLoop);
    }
  };

  // Start loop when component is active
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(updatePhysicsLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isGameOver, dimensions, gameMode]);

  // Challenge Mode Timer countdown
  useEffect(() => {
    if (!isPlaying || isGameOver || gameMode !== 'challenge') return;
    
    setTimeRemaining(60);
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          setIsPlaying(false);
          playGameOverSound(isMuted);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, gameMode]);

  // Command handlers
  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setFaces([]);
    setParticles([]);
    setScore(0);
    setCombo(0);
    setLives(3);
    setIsPlayingSeconds(0);
    setIsGameOver(false);
    setIsPlaying(true);
    previousTimeRef.current = null;
    spawnTimerRef.current = 0;
    playUnlockSound(isMuted);
  };

  const handleStopGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setFaces([]);
    setParticles([]);
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-900 overflow-hidden relative">
      {/* Main Game Arena Sky Canvas */}
      <div
        id="slap-arena-sandbox"
        ref={arenaRef}
        onTouchStart={(e) => {
          if (isPlaying && !isGameOver) {
            if (e.target === e.currentTarget) {
              setCombo(prev => Math.max(0, Math.floor(prev / 2)));
            }
          }
        }}
        onMouseDown={(e) => {
          if (isPlaying && !isGameOver) {
            if (e.target === e.currentTarget) {
              setCombo(prev => Math.max(0, Math.floor(prev / 2)));
            }
          }
        }}
        className={`flex-1 relative overflow-hidden transition-all duration-[50ms] select-none ${
          arenaFlash ? 'bg-amber-300/40' : 'bg-gradient-to-b from-sky-950 via-slate-900 to-indigo-950/80'
        }`}
        style={{
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`,
        }}
      >
        {/* Sky styling lines / decorative clouds pattern */}
        <div className="absolute inset-0 select-none pointer-events-none opacity-[0.06] flex flex-col justify-around">
          <div className="border-t border-white/50 w-full"></div>
          <div className="border-t border-white/50 w-full"></div>
          <div className="border-t border-white/50 w-full"></div>
        </div>

        {/* Ambient Moon / Sun Glow Circle */}
        <div className="absolute top-[15%] left-[50%] -translate-x-[50%] w-72 h-72 rounded-full bg-amber-400/5 blur-3xl pointer-events-none select-none"></div>

        {/* Immersive Floating HUD Overlay - Top Left Score */}
        {isPlaying && (
          <div className="absolute top-3 left-3 sm:top-5 sm:left-6 z-40 flex flex-col pointer-events-none select-none">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-slate-400/85">Score</span>
            <div className="text-xl sm:text-4xl font-black text-amber-400 font-sans tracking-tight flex items-center gap-1.5 sm:gap-2.5 leading-none">
              {score}
              {combo > 2 && (
                <span className="text-[9px] sm:text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono uppercase font-black animate-bounce flex items-center gap-0.5 sm:gap-1">
                  x{combo} 🔥
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rapid Difficulty Rise Alert Widget */}
        {isPlaying && isPlayingSeconds >= 5 && (
          <div className="absolute top-16 left-[50%] -translate-x-[50%] z-45 bg-red-900/90 backdrop-blur-md border border-red-500/35 text-red-100 font-sans px-3.5 py-1.5 rounded-full text-[9px] sm:text-xs uppercase tracking-widest font-black animate-pulse flex items-center gap-1.5 shadow-lg shadow-red-500/20 select-none pointer-events-none">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>SYNDICATE RAGE MODE (HARD)</span>
          </div>
        )}

        {/* Immersive Floating HUD Overlay - Top Right Status & Mute Control */}
        {isPlaying && (
          <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-3.5 select-none">
            {gameMode === 'arcade' && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/45 backdrop-blur-md border border-slate-800/40 px-2 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
                      i < lives ? 'text-red-500 fill-red-500 scale-100 animate-pulse' : 'text-slate-700 scale-90'
                    }`}
                  />
                ))}
              </div>
            )}

            {gameMode === 'challenge' && (
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-950/45 backdrop-blur-md border border-slate-800/40 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-bounce" />
                <span className={`font-mono text-xs sm:text-sm font-black ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                  {timeRemaining}s
                </span>
              </div>
            )}

            {gameMode === 'zen' && (
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-950/45 backdrop-blur-md border border-slate-800/40 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-spin" />
                <span className="text-[10px] sm:text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">Zen</span>
              </div>
            )}

            {/* Subtle Mute Button inside canvas overlay */}
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-800/45 bg-slate-950/45 backdrop-blur-md text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all outline-none cursor-pointer"
              id="sound-toggle-btn"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-500" />}
            </button>

            {toggleFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-800/45 bg-slate-950/45 backdrop-blur-md text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all outline-none cursor-pointer"
                id="fullscreen-toggle-btn"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-500" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />}
              </button>
            )}
          </div>
        )}

        {/* Falling Faces Rendering */}
        {isPlaying && faces.map(face => (
          <FallingFace
            key={face.id}
            face={face}
            onSlap={handleFaceSlap}
          />
        ))}

        {/* Interactive Explosive Particles Render */}
        {particles.map(p => {
          if (p.type === 'text') {
            return (
              <div
                key={p.id}
                className={`absolute font-black select-none pointer-events-none ${p.color} text-center`}
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                  fontSize: `${p.size}px`,
                  opacity: p.alpha,
                  textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.9)',
                  zIndex: 50,
                  transition: 'opacity 0.05s linear',
                }}
              >
                {p.text}
              </div>
            );
          } else if (p.type === 'impact') {
            return (
              <div
                key={p.id}
                className="absolute rounded-full border-4 select-none pointer-events-none"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: p.color,
                  opacity: p.alpha,
                  boxShadow: '0 0 20px rgba(253, 224, 71, 0.4)',
                  zIndex: 45,
                }}
              />
            );
          } else if (p.type === 'weapon') {
            return (
              <div
                key={p.id}
                className="absolute select-none pointer-events-none text-center flex items-center justify-center"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                  opacity: p.alpha,
                  fontSize: `${p.size * 0.85}px`,
                  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.55))',
                  zIndex: 65,
                }}
              >
                {p.color}
              </div>
            );
          } else {
            // Particle Stars / Droplets
            return (
              <div
                key={p.id}
                className="absolute select-none pointer-events-none flex items-center justify-center"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                  opacity: p.alpha,
                  zIndex: 48,
                }}
              >
                {p.type === 'star' ? (
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-yellow-400 text-yellow-300 drop-shadow">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                  </svg>
                ) : (
                  // sweat droplet circle particle
                  <div 
                    className="w-1.5 h-3 rounded-full opacity-80" 
                    style={{ 
                      backgroundColor: p.color,
                      transform: 'scaleY(1.5)' 
                    }} 
                  />
                )}
              </div>
            );
          }
        })}

        {/* Start / Menu Prompt Screen overlay - Gorgeous & Ultra Clean */}
        {!isPlaying && !isGameOver && (
          <div 
            onClick={() => handleStartGame('arcade')}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center z-45 cursor-pointer"
          >
            <div className="max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 animate-fade-in flex flex-col items-center">
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-5 animate-bounce select-none">
                🖐️
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mb-2 sm:mb-3 font-sans select-none">
                Slap Game
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-8 leading-relaxed select-none px-2">
                Slam falling faces before they escape! Build massive combo multipliers for quick consecutive slaps.
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame('arcade');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-6 sm:py-3 sm:px-8 rounded-full text-[10px] sm:text-xs uppercase tracking-widest animate-pulse transition-all shadow-lg shadow-amber-500/15 cursor-pointer"
                id="mode-arcade-btn"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over screen overlay - Simplified & Centered */}
        {isGameOver && (
          <div 
            onClick={() => handleStartGame('arcade')}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center z-45 cursor-pointer"
          >
            <div className="max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 animate-fade-in flex flex-col items-center">
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4 select-none">
                😵
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-500 tracking-tight leading-none mb-1.5 sm:mb-2">
                GAME OVER
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 font-mono leading-relaxed px-2">
                Final Score: <span className="text-amber-300 font-bold">{score}</span><br />
                Max Combo: <span className="text-emerald-400 font-bold">{maxCombo}</span>
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame('arcade');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-6 sm:py-3 sm:px-8 rounded-full text-[10px] sm:text-xs uppercase tracking-widest animate-pulse transition-all shadow-lg shadow-amber-500/15 cursor-pointer"
                id="retry-game-btn"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
