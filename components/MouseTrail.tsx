
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SquareIcon from './SquareIcon';
import { Position, FaceConfig } from '../types';

const NUM_SEGMENTS = 8; 
const SQUARE_SIZE = 120; // Exact dimensions from SquareIcon.tsx
const BOUNCE_SPEED = 2.5; // Constant speed for the "DVD" mode

const MouseTrail: React.FC = () => {
  const getCenter = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const [faceConfig] = useState<FaceConfig>({
    strokeWidth: 10,
    leftEyeX: 25,
    leftEyeY: 40,
    eyeSize: 11,
    rightEyeX: 68,
    rightEyeY: 40,
    winkScale: 1,
    smileY: 56,
    smileCurve: 12,
    winkType: '<',
    trackingSpeed: 0.08,
    mouthRadius: 32,
    mouthSweep: 96,
    mouthRotation: -13,
    winkOpeningAngle: 54,
    winkRotation: 355,
    winkLineLength: 21
  });

  const [isAutoFloating, setIsAutoFloating] = useState(true);
  
  // Refs for animation physics
  const segmentsRef = useRef<Position[]>(Array(NUM_SEGMENTS).fill(getCenter()));
  const mousePos = useRef<Position>(getCenter());
  
  // DVD Bouncing state refs
  const bouncePos = useRef<Position>(getCenter());
  const velocity = useRef({ x: BOUNCE_SPEED, y: BOUNCE_SPEED });
  
  const [renderSegments, setRenderSegments] = useState<Position[]>(segmentsRef.current);
  const requestRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    // Only switch to manual mode if we are currently floating
    setIsAutoFloating(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // When mouse leaves the document, start auto-floating from the current head position
    bouncePos.current = { ...segmentsRef.current[0] };
    
    // Choose a random direction for the new float path
    const angle = Math.random() * Math.PI * 2;
    velocity.current = {
      x: Math.cos(angle) * BOUNCE_SPEED,
      y: Math.sin(angle) * BOUNCE_SPEED
    };
    
    setIsAutoFloating(true);
  }, []);

  const animate = useCallback(() => {
    const segments = [...segmentsRef.current];
    const followSpeed = faceConfig.trackingSpeed;
    const radius = SQUARE_SIZE / 2;
    
    let targetX: number;
    let targetY: number;

    if (isAutoFloating) {
      // DVD Bouncing Logic
      let { x, y } = bouncePos.current;
      let { x: vx, y: vy } = velocity.current;

      x += vx;
      y += vy;

      // Perfect Tangent Collision Detection
      const maxX = window.innerWidth - radius;
      const minX = radius;
      const maxY = window.innerHeight - radius;
      const minY = radius;

      // Horizontal Bounce
      if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      } else if (x <= minX) {
        x = minX;
        vx = Math.abs(vx);
      }

      // Vertical Bounce
      if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      } else if (y <= minY) {
        y = minY;
        vy = Math.abs(vy);
      }

      bouncePos.current = { x, y };
      velocity.current = { x: vx, y: vy };
      
      targetX = x;
      targetY = y;
      
      // In auto mode, the head follows the target strictly for pixel precision
      segments[0] = {
        x: segments[0].x + (targetX - segments[0].x) * 0.2, 
        y: segments[0].y + (targetY - segments[0].y) * 0.2,
      };
    } else {
      targetX = mousePos.current.x;
      targetY = mousePos.current.y;
      
      // Head follows cursor in manual mode
      segments[0] = {
        x: segments[0].x + (targetX - segments[0].x) * followSpeed,
        y: segments[0].y + (targetY - segments[0].y) * followSpeed,
      };
    }

    // Body segments follow previous segments
    for (let i = 1; i < NUM_SEGMENTS; i++) {
      const prev = segments[i - 1];
      const curr = segments[i];
      
      segments[i] = {
        x: curr.x + (prev.x - curr.x) * followSpeed,
        y: curr.y + (prev.y - curr.y) * followSpeed,
      };
    }

    segmentsRef.current = segments;
    setRenderSegments([...segments]);
    requestRef.current = requestAnimationFrame(animate);
  }, [faceConfig.trackingSpeed, isAutoFloating]);

  useEffect(() => {
    const handleResize = () => {
      const radius = SQUARE_SIZE / 2;
      const x = Math.max(radius, Math.min(window.innerWidth - radius, bouncePos.current.x));
      const y = Math.max(radius, Math.min(window.innerHeight - radius, bouncePos.current.y));
      bouncePos.current = { x, y };
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    // document mouseleave is more reliable for "leaving the canvas"
    document.addEventListener('mouseleave', handleMouseLeave);
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, animate]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
      {[...renderSegments].reverse().map((pos, idx) => {
        const originalIndex = NUM_SEGMENTS - 1 - idx;
        const isHead = originalIndex === 0;
        
        let opacity = 1;
        if (!isHead) {
          // Trail segments are translucent
          opacity = Math.max(0, 0.8 - (originalIndex * 0.1));
        }
        
        const scale = isHead ? 1 : 1 - (originalIndex * 0.08);
        const zIndex = 100 - originalIndex;

        return (
          <div
            key={`segment-${originalIndex}`}
            className="absolute"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndex,
            }}
          >
            <SquareIcon 
              opacity={opacity} 
              scale={scale} 
              expressionIndex={originalIndex} 
              customConfig={faceConfig}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MouseTrail;
