
export interface Position {
  x: number;
  y: number;
}

export interface TrailPoint extends Position {
  id: number;
}

export interface FaceConfig {
  strokeWidth: number;
  leftEyeX: number;
  leftEyeY: number;
  eyeSize: number; 
  rightEyeX: number;
  rightEyeY: number;
  winkScale: number;
  smileY: number;
  smileCurve: number;
  winkType: '<' | '^' | '-';
  trackingSpeed: number;
  mouthRadius: number; 
  mouthSweep: number;  
  mouthRotation: number; 
  winkOpeningAngle: number;
  winkRotation: number;
  winkLineLength: number; // New: Length of the wink's line segments
}
