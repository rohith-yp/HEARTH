import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraRig: React.FC = () => {
  useFrame((state) => {
    // Subtle mouse parallax camera drift
    const targetX = state.pointer.x * 0.4;
    const targetY = state.pointer.y * 0.2 + 0.6;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};
