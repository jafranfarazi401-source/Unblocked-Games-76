/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FallingFaceData, FaceType } from '../types';

interface FallingFaceProps {
  face: FallingFaceData;
  onSlap: (id: string, clientX: number, clientY: number) => void;
}

export const FallingFace: React.FC<FallingFaceProps> = ({ face, onSlap }) => {
  const { id, type, size, rotation, isSlapped } = face;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isSlapped) return; // Cannot slap an already slapped (falling out) face
    onSlap(id, e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isSlapped) return;
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      onSlap(id, touch.clientX, touch.clientY);
    }
  };

  // Pick face background colors and features based on type
  const getFaceColors = (faceType: FaceType, slapped: boolean) => {
    if (slapped) {
      return {
        bg: 'from-red-300 to-red-500 border-red-700 shadow-red-200',
        stroke: '#7f1d1d',
        cheeks: '#ef4444',
      };
    }

    switch (faceType) {
      case 'custom1':
      case 'custom2':
      case 'custom3':
        return {
          bg: 'from-amber-100 to-amber-200 border-amber-500 shadow-amber-300/40',
          stroke: '#7c2d12',
          cheeks: '#ea580c',
        };
      default:
        return {
          bg: 'from-yellow-200 to-amber-300 border-amber-500 shadow-yellow-100/40',
          stroke: '#78350f',
          cheeks: '#f59e0b',
        };
    }
  };

  const colors = getFaceColors(type, isSlapped);

  // Helper to render facial expressions dynamically inside SVG
  const renderFaceFeatures = () => {
    // Shared parameters
    const cx1 = 30; // Left eye X
    const cx2 = 70; // Right eye X
    const ey = 42;  // Eyes Y
    const slapEyeSize = 10;
    
    // Slapped State overrules all
    if (isSlapped) {
      return (
        <>
          {/* Swollen Slap Handmark / Red cheeks */}
          <ellipse cx="25" cy="65" rx="14" ry="10" fill="#ef4444" fillOpacity="0.8" />
          <ellipse cx="75" cy="65" rx="14" ry="10" fill="#ef4444" fillOpacity="0.8" />
          
          {/* Left Eye crossed: X */}
          <line x1={cx1 - 8} y1={ey - 8} x2={cx1 + 8} y2={ey + 8} stroke={colors.stroke} strokeWidth="5.5" strokeLinecap="round" />
          <line x1={cx1 + 8} y1={ey - 8} x2={cx1 - 8} y2={ey + 8} stroke={colors.stroke} strokeWidth="5.5" strokeLinecap="round" />
          
          {/* Right Eye crossed: X */}
          <line x1={cx2 - 8} y1={ey - 8} x2={cx2 + 8} y2={ey + 8} stroke={colors.stroke} strokeWidth="5.5" strokeLinecap="round" />
          <line x1={cx2 + 8} y1={ey - 8} x2={cx2 - 8} y2={ey + 8} stroke={colors.stroke} strokeWidth="5.5" strokeLinecap="round" />

          {/* Slap Impact handprint or red swirl on cheek */}
          <path d="M 60,65 Q 65,72 70,64 Q 72,55 78,59" stroke="#b91c1c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          
          {/* Distorted / Whacking teeth Wavy mouth */}
          <path d="M 35,72 Q 50,85 65,70 Q 55,62 35,72" fill="#7f1d1d" stroke={colors.stroke} strokeWidth="3" />
          <path d="M 40,73 L 42,76 M 46,73 L 48,76 M 55,71 L 53,74" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Dizzyness spiral star above head */}
          <path d="M 42,12 Q 50,4 58,12 T 74,10" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }

    // Unslapped expressions
    switch (type) {
      case 'custom1':
      case 'custom2':
      case 'custom3':
        return null;
      default:
        return null;
    }
  };

  // Convert logical coordinates / rotation into CSS transforms
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${face.x}%`,
    top: `${face.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    cursor: isSlapped ? 'not-allowed' : 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    zIndex: isSlapped ? 10 : 30,
    transition: isSlapped ? 'none' : 'transform 0.05s linear', // slightly lag filter for smooth movement
  };

  return (
    <div
      id={`face-${id}`}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="group select-none active:scale-95 duration-75"
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md select-none rounded-full border-4 shadow-inner bg-gradient-to-br ${colors.bg} transition-colors duration-100`}
        style={{ contentVisibility: 'auto' }}
      >
        <defs>
          <clipPath id={`circle-clip-${id}`}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>
        {type === 'custom1' && (
          <image
            href="https://lh3.googleusercontent.com/d/1eHRx0vH6N3PWvKnB3UEE7btX-diG0AnU"
            width="96"
            height="96"
            x="2"
            y="2"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#circle-clip-${id})`}
            referrerPolicy="no-referrer"
          />
        )}
        {type === 'custom2' && (
          <image
            href="https://lh3.googleusercontent.com/d/1xBm0O_jA3n0aVrhTDdHJ__CoKESBk6n3"
            width="96"
            height="96"
            x="2"
            y="2"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#circle-clip-${id})`}
            referrerPolicy="no-referrer"
          />
        )}
        {type === 'custom3' && (
          <image
            href="https://scontent.fdac175-1.fna.fbcdn.net/v/t39.30808-6/473102571_1019741270191191_7428969032570704057_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGMCFGXyzApnt3jrzJkLElvWN0DK0ePjOlY3QMrR4-M6djU-5lEd97KZTtCz77GsqyrcmYGinLIL9G7PPeEht1k&_nc_ohc=O9sBjM1wggUQ7kNvwHWdn8V&_nc_oc=AdqvRcX34io_VfxMF9-OLKowl1ezFXbdBVqHXOVwRdibTEjfJEXIjSRLyEczvPUe6hk&_nc_zt=23&_nc_ht=scontent.fdac175-1.fna&_nc_gid=NnkHFXaJSlxm400yI9vkMg&_nc_ss=7b2a8&oh=00_Af5C3S6hIg3kJTU0cc6a0Yi44RtLqfngG_tswxD_iqRTjA&oe=6A132505"
            width="96"
            height="96"
            x="2"
            y="2"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#circle-clip-${id})`}
            referrerPolicy="no-referrer"
          />
        )}
        {renderFaceFeatures()}
      </svg>
    </div>
  );
};
