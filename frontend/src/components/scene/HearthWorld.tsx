import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from './Environment';
import { DriftingLeaves } from './DriftingLeaves';
import { Wick3DWorld } from './Wick3DWorld';
import { CameraRig } from './CameraRig';

interface HearthWorldProps {
  stage?: string;
  mood?: string;
  energy?: number;
  bond?: number;
}

export const HearthWorld: React.FC<HearthWorldProps> = ({
  stage,
  mood,
  energy,
  bond,
}) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.6, 5.5], fov: 48 }}
        gl={{ antialias: true, alpha: false }}
        style={{ pointerEvents: 'none' }}
      >
        <CameraRig />
        <Environment />
        <DriftingLeaves count={40} />
        <Wick3DWorld stage={stage} mood={mood} energy={energy} bond={bond} />
      </Canvas>
    </div>
  );
};
