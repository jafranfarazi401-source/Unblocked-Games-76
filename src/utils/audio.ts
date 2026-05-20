/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeaponSoundType } from '../types';
import { SLAP_SOUND_BASE64 } from './slapSoundData';

// Convert base64 safely to ArrayBuffer for Web Audio decoding
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  
  return audioCtx;
}

/**
 * Creates noise buffer for realistic cracking slap sounds
 */
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;

  const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return noiseBuffer;
}

const SLAP_AUDIO_PATH = '/slap.mp3?v=classroom6x-v4';

let slapAudioBuffer: AudioBuffer | null = null;
let isFetchingSlapBuffer = false;

async function loadSlapAudioBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  if (slapAudioBuffer) return slapAudioBuffer;
  if (isFetchingSlapBuffer) return null;
  
  isFetchingSlapBuffer = true;
  try {
    // Attempt decoding directly from built-in base64 string
    const arrayBuffer = base64ToArrayBuffer(SLAP_SOUND_BASE64);
    slapAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return slapAudioBuffer;
  } catch (err) {
    console.warn('Failed to pre-decode custom base64 slap audio, trying network path fallback:', err);
    try {
      const response = await fetch(SLAP_AUDIO_PATH);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        slapAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
        return slapAudioBuffer;
      }
    } catch (networkErr) {
      console.warn('Network path fallback failed:', networkErr);
    }
    return null;
  } finally {
    isFetchingSlapBuffer = false;
  }
}

export function playSlapSound(type: WeaponSoundType, isMuted: boolean): void {
  if (isMuted) return;

  const ctx = getAudioContext();
  if (ctx) {
    loadSlapAudioBuffer(ctx).then(buffer => {
      if (buffer) {
        try {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.85, ctx.currentTime);
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          source.start(0);
        } catch (e) {
          console.warn("Buffer source play failed, falling back to audio element:", e);
          playWithAudioElement();
        }
      } else {
        playWithAudioElement();
      }
    }).catch(() => {
      playWithAudioElement();
    });
  } else {
    playWithAudioElement();
  }

  function playWithAudioElement() {
    try {
      // Play from inline base64 data URL
      const audio = new Audio("data:audio/mp3;base64," + SLAP_SOUND_BASE64);
      audio.volume = 0.85;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Base64 audio element play failed, trying network file:", err);
          const backupAudio = new Audio(SLAP_AUDIO_PATH);
          backupAudio.volume = 0.85;
          backupAudio.play().catch((backupErr) => {
            console.warn("Network play failed too, playing procedural synth:", backupErr);
            playProceduralSlapSound(type, isMuted);
          });
        });
      }
    } catch (err) {
      console.warn("Audio element play failed, using procedural synth:", err);
      playProceduralSlapSound(type, isMuted);
    }
  }
}

export function playButtonClickSound(isMuted: boolean): void {
  if (isMuted) return;

  try {
    const audio = new Audio("data:audio/mp3;base64," + SLAP_SOUND_BASE64);
    audio.volume = 0.35;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Base64 button click failed, trying network file:", err);
        const backupAudio = new Audio(SLAP_AUDIO_PATH);
        backupAudio.volume = 0.35;
        backupAudio.play().catch((backupErr) => {
          console.warn("Network button click failed too:", backupErr);
        });
      });
    }
  } catch (err) {
    console.warn("Button click audio failed:", err);
  }
}

function playProceduralSlapSound(type: WeaponSoundType, isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const now = ctx.currentTime;
    
    // Support volume/gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.002);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'slap': {
        // Crack: Fast decay noise
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1000, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // Body: Medium frequency thud
        const bodyOsc = ctx.createOscillator();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(120, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        const bodyGain = ctx.createGain();
        bodyGain.gain.setValueAtTime(0.9, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(masterGain);

        noise.start(now);
        bodyOsc.start(now);
        noise.stop(now + 0.15);
        bodyOsc.stop(now + 0.15);
        break;
      }
      
      case 'slipper': {
        // Slipper: Double slap (thwack-thwack, secondary sound with slight delay)
        const times = [now, now + 0.04];
        
        times.forEach((t, index) => {
          const osc = ctx.createOscillator();
          osc.type = index === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(index === 0 ? 180 : 130, t);
          osc.frequency.linearRampToValueAtTime(60, t + 0.08);
          
          const bandpass = ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(500, t);
          bandpass.Q.setValueAtTime(3, t);
 
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(index === 0 ? 0.7 : 0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
 
          osc.connect(bandpass);
          bandpass.connect(gain);
          gain.connect(masterGain);
 
          // Tiny noise snap
          const click = ctx.createBufferSource();
          click.buffer = getNoiseBuffer(ctx);
          const clickGain = ctx.createGain();
          clickGain.gain.setValueAtTime(0.3, t);
          clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
 
          click.connect(clickGain);
          clickGain.connect(masterGain);
 
          osc.start(t);
          click.start(t);
          osc.stop(t + 0.1);
          click.stop(t + 0.1);
        });
        break;
      }
 
      case 'fish': {
        // Wet, floppy splash pop sound
        const bubble = ctx.createOscillator();
        bubble.type = 'sine';
        bubble.frequency.setValueAtTime(80, now);
        bubble.frequency.exponentialRampToValueAtTime(450, now + 0.04); // Fast frequency rise (pop)
 
        const bubbleGain = ctx.createGain();
        bubbleGain.gain.setValueAtTime(1.0, now);
        bubbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
 
        bubble.connect(bubbleGain);
        bubbleGain.connect(masterGain);
 
        // Splat: Low noise component
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
 
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(800, now);
 
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, now + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
 
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
 
        bubble.start(now);
        noise.start(now);
        bubble.stop(now + 0.2);
        noise.stop(now + 0.2);
        break;
      }
 
      case 'glove': {
        // Deep boxing blow
        const bassOsc = ctx.createOscillator();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(90, now);
        bassOsc.frequency.exponentialRampToValueAtTime(25, now + 0.2);
 
        const bassGain = ctx.createGain();
        bassGain.gain.setValueAtTime(1.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
 
        bassOsc.connect(bassGain);
        bassGain.connect(masterGain);
 
        // Low crack
        const bodyOsc = ctx.createOscillator();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(220, now);
        bodyOsc.frequency.linearRampToValueAtTime(50, now + 0.1);
 
        const bodyGain = ctx.createGain();
        bodyGain.gain.setValueAtTime(0.5, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
 
        bodyOsc.connect(bodyGain);
        bodyGain.connect(masterGain);
 
        bassOsc.start(now);
        bodyOsc.start(now);
        bassOsc.stop(now + 0.3);
        bodyOsc.stop(now + 0.3);
        break;
      }
 
      case 'hammer': {
        // High squeaky sweep!
        const squeak = ctx.createOscillator();
        squeak.type = 'sine';
        squeak.frequency.setValueAtTime(1200, now);
        squeak.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
 
        const squeakGain = ctx.createGain();
        squeakGain.gain.setValueAtTime(0.8, now);
        squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
 
        squeak.connect(squeakGain);
        squeakGain.connect(masterGain);
 
        // High hammer tap noise
        const tap = ctx.createOscillator();
        tap.type = 'square';
        tap.frequency.setValueAtTime(400, now);
        tap.frequency.setValueAtTime(150, now + 0.01);
 
        const tapGain = ctx.createGain();
        tapGain.gain.setValueAtTime(0.2, now);
        tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
 
        tap.connect(tapGain);
        tapGain.connect(masterGain);
 
        squeak.start(now);
        tap.start(now);
        squeak.stop(now + 0.1);
        tap.stop(now + 0.1);
        break;
      }
    }
  } catch (err) {
    console.warn('Procedural audio generation failed or suspended:', err);
  }
}

export function playUnlockSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4-E4-G4-C5 arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const noteTime = now + idx * 0.08;
      
      gainNode.gain.setValueAtTime(0.0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.15, noteTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  } catch (e) {
    console.warn('Unlock sound play error:', e);
  }
}

export function playGameOverSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const now = ctx.currentTime;
    
    // Sad falling slide sound
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.6);
    
    // Buttered lowpass sweep
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(600, now);
    lp.frequency.exponentialRampToValueAtTime(100, now + 0.6);
    
    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    
    osc.connect(lp);
    lp.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.75);
  } catch (e) {
    console.warn('Game over sound play error:', e);
  }
}

export function playComboBrokenSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const now = ctx.currentTime;
    // Brief low buzzer click
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.setValueAtTime(80, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 350;
    
    osc.connect(lp);
    lp.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {
    console.warn('Combo broken sound play error:', e);
  }
}
