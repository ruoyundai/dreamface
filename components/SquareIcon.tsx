
import React from 'react';
import { FaceConfig } from '../types';

interface SquareIconProps {
  className?: string;
  opacity?: number;
  scale?: number;
  expressionIndex?: number;
  customConfig?: FaceConfig;
}

const SquareIcon: React.FC<SquareIconProps> = ({ 
  className = '', 
  opacity = 1, 
  scale = 1, 
  expressionIndex = 0,
  customConfig
}) => {
  const color = "#14C9A0";

  // Default values updated to match the final parameters from the user's latest request
  const cfg: FaceConfig = customConfig || {
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
  };

  const sw = cfg.strokeWidth;

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const renderWink = (x: number, y: number, s: number, type: string) => {
    switch(type) {
      case '^':
        return <path d={`M${x-10*s} ${y+5*s} L${x} ${y-5*s} L${x+10*s} ${y+5*s}`} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      case '-':
        return <line x1={x-10*s} y1={y} x2={x+10*s} y2={y} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
      default: // Customizable '<' wink
        const L = cfg.winkLineLength * s;
        const a1 = (cfg.winkRotation - cfg.winkOpeningAngle / 2) * Math.PI / 180;
        const a2 = (cfg.winkRotation + cfg.winkOpeningAngle / 2) * Math.PI / 180;
        const x1 = x + L * Math.cos(a1);
        const y1 = y + L * Math.sin(a1);
        const x2 = x + L * Math.cos(a2);
        const y2 = y + L * Math.sin(a2);
        
        return (
          <path 
            d={`M${x1} ${y1} L${x} ${y} L${x2} ${y2}`} 
            stroke={color} 
            strokeWidth={sw} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
        );
    }
  };

  const renderExpression = (index: number) => {
    const i = index % 8; 
    
    if (i === 0) {
      const startAngle = 180 - (cfg.mouthSweep / 2) + cfg.mouthRotation;
      const endAngle = 180 + (cfg.mouthSweep / 2) + cfg.mouthRotation;
      
      return (
        <>
          <circle cx={cfg.leftEyeX} cy={cfg.leftEyeY} r={cfg.eyeSize} fill={color} />
          {renderWink(cfg.rightEyeX, cfg.rightEyeY, cfg.winkScale, cfg.winkType)}
          <path 
            d={describeArc(50, cfg.smileY, cfg.mouthRadius, startAngle, endAngle)}
            stroke={color} 
            strokeWidth={sw} 
            strokeLinecap="round" 
            fill="none"
          />
        </>
      );
    }

    switch (i) {
      case 1: // Happy
        return (
          <>
            <path d="M20 45 Q30 35 40 45" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
            <path d="M60 45 Q70 35 80 45" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
            <path d="M30 70 Q50 85 70 70" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
          </>
        );
      case 2: // Big Laugh
        return (
          <>
            <path d="M22 42 L38 42" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <path d="M62 42 L78 42" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <path d="M30 65 Q50 95 70 65 Z" fill={color} />
          </>
        );
      case 3: // Sad
        return (
          <>
            <circle cx="30" cy="40" r="8" fill={color} />
            <circle cx="70" cy="40" r="8" fill={color} />
            <path d="M35 80 Q50 65 65 80" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
          </>
        );
      case 4: // Angry
        return (
          <>
            <path d="M20 35 L40 45" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <path d="M60 45 L80 35" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <path d="M40 75 Q50 65 60 75" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
          </>
        );
      case 5: // Playful
        return (
          <>
            <circle cx="30" cy="40" r="9" fill={color} />
            <path d="M60 45 L80 45" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <path d="M40 70 Q50 75 60 70" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
            <path d="M45 72 Q50 85 55 72 Z" fill="#FF5C5C" />
          </>
        );
      case 6: // Surprised
        return (
          <>
            <circle cx="30" cy="35" r="9" fill={color} />
            <circle cx="70" cy="35" r="9" fill={color} />
            <circle cx="50" cy="75" r="10" stroke={color} strokeWidth={sw} fill="none" />
          </>
        );
      case 7: // Speechless
        return (
          <>
            <line x1="20" y1="40" x2="40" y2="40" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <line x1="60" y1="40" x2="80" y2="40" stroke={color} strokeWidth={sw} strokeLinecap="round" />
            <line x1="35" y1="75" x2="65" y2="75" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-[24%] flex items-center justify-center shadow-2xl ${className}`}
      style={{ 
        width: '120px', 
        height: '120px', 
        opacity,
        transform: `scale(${scale})`,
        transition: 'transform 0.05s linear'
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[70%] h-[70%]"
      >
        {renderExpression(expressionIndex)}
      </svg>
    </div>
  );
};

export default SquareIcon;
