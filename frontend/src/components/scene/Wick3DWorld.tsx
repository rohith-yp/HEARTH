import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Wick3DWorldProps {
  stage?: string;
  mood?: string;
  energy?: number;
  bond?: number;
}

export const Wick3DWorld: React.FC<Wick3DWorldProps> = ({
  stage = 'Spark',
  mood = 'happy',
  energy = 85,
  bond = 40,
}) => {
  const wickGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const flameHairRef = useRef<THREE.Mesh>(null);
  const laptopScreenRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const normalizedEnergy = Math.max(0.3, Math.min(1.0, energy / 100));

  // Determine glow color by mood
  const getMoodColor = () => {
    switch (mood.toLowerCase()) {
      case 'joyful':
        return '#ffd700';
      case 'happy':
        return '#ff9933';
      case 'tired':
        return '#ff3300';
      case 'quiet':
        return '#ffbb44';
      default:
        return '#ff6611';
    }
  };

  const emberColor = getMoodColor();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Breathing pulse & gentle bobbing
    const breath = Math.sin(time * 2) * 0.05 + 1;
    const hover = Math.sin(time * 1.5) * 0.04;

    if (wickGroupRef.current) {
      wickGroupRef.current.position.y = -0.5 + hover;
    }

    if (headRef.current) {
      headRef.current.scale.set(1.1 * breath, 1.1 * breath, 1.1 * breath);
    }

    if (flameHairRef.current) {
      flameHairRef.current.rotation.y += delta * 1.2;
      flameHairRef.current.scale.set(
        (0.6 + normalizedEnergy * 0.2) * (Math.sin(time * 4) * 0.08 + 1),
        (0.8 + normalizedEnergy * 0.3) * (Math.cos(time * 3) * 0.08 + 1),
        (0.6 + normalizedEnergy * 0.2) * (Math.sin(time * 4) * 0.08 + 1)
      );
    }

    if (lightRef.current) {
      lightRef.current.intensity = (3.0 + Math.sin(time * 5) * 0.8) * normalizedEnergy;
    }
  });

  return (
    <group position={[2.2, -0.6, 1.2]}>
      {/* Point Light emanating from Wick */}
      <pointLight
        ref={lightRef}
        color={emberColor}
        intensity={3.5}
        distance={8}
        decay={2}
        position={[0, 0.6, 0]}
      />

      {/* Wooden Deck Base */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.15, 2.5]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
      </mesh>

      {/* Wick Character Group */}
      <group ref={wickGroupRef} position={[-0.4, 0, 0]}>
        {/* Soft Glowing Body */}
        <mesh ref={bodyRef} position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color="#fff0db"
            emissive={emberColor}
            emissiveIntensity={0.6 * normalizedEnergy}
            roughness={0.3}
          />
        </mesh>

        {/* Cute Head */}
        <mesh ref={headRef} position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial
            color="#ffe8cc"
            emissive={emberColor}
            emissiveIntensity={0.8 * normalizedEnergy}
            roughness={0.2}
          />
        </mesh>

        {/* Flame Hair Crown */}
        <mesh ref={flameHairRef} position={[0, 1.1, 0]}>
          <coneGeometry args={[0.25, 0.6, 16]} />
          <meshStandardMaterial
            color={emberColor}
            emissive={emberColor}
            emissiveIntensity={2.5 * normalizedEnergy}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Cute Eyes */}
        <mesh position={[0.12, 0.68, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#331a00" />
        </mesh>
        <mesh position={[-0.12, 0.68, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#331a00" />
        </mesh>
      </group>

      {/* Open Laptop on Deck */}
      <group position={[0.8, -0.4, 0.2]} rotation={[0, -0.3, 0]}>
        {/* Laptop Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.5]} />
          <meshStandardMaterial color="#d0d5dd" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Laptop Screen Lid */}
        <group position={[0, 0.015, -0.24]} rotation={[-0.3, 0, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.7, 0.48, 0.02]} />
            <meshStandardMaterial color="#1d2939" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Glowing Screen Content */}
          <mesh ref={laptopScreenRef} position={[0, 0.25, 0.012]}>
            <planeGeometry args={[0.64, 0.42]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* Cozy Hearth Coffee Mug */}
      <group position={[1.4, -0.4, -0.3]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.22, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Flame Logo Stamp on Mug */}
        <mesh position={[0, 0.12, 0.1]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={emberColor} />
        </mesh>
      </group>
    </group>
  );
};
