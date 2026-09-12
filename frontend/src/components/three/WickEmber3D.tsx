import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WickEmber3DProps {
  mood?: string;
  energy?: number;
  stage?: string;
  theme?: 'dark' | 'light';
}

export const WickEmber3D: React.FC<WickEmber3DProps> = ({
  mood = 'neutral',
  energy = 100,
  stage = 'Spark',
  theme = 'dark',
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Derive visual intensity parameters from mood & energy
  const normalizedEnergy = Math.max(0.2, Math.min(1.0, energy / 100));

  // Determine colors based on mood & stage
  const getMoodColor = () => {
    switch (mood.toLowerCase()) {
      case 'joyful':
        return '#ffd700'; // Vibrant Gold
      case 'happy':
        return '#ff7700'; // Warm Ember Orange
      case 'tired':
        return '#ff3300'; // Deep Crimson Flame
      case 'quiet':
        return '#ffaa44'; // Soft Amber
      default:
        return '#ff5c1c'; // Classic Ember
    }
  };

  const mainColor = getMoodColor();
  const innerColor = '#ffffff';

  // Particle count scaling
  const particleCount = Math.floor(40 + normalizedEnergy * 60);

  // Generate particle positions
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 3.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pulseSpeed = mood === 'joyful' ? 3.5 : mood === 'tired' ? 1.2 : 2.2;

    // Idle breathing pulse animation
    const pulse = Math.sin(time * pulseSpeed) * 0.15 + 0.95;
    const hoverY = Math.sin(time * 1.5) * 0.15;

    if (coreRef.current) {
      coreRef.current.position.y = hoverY;
      coreRef.current.scale.setScalar((0.55 + normalizedEnergy * 0.15) * pulse);
    }

    if (outerRef.current) {
      outerRef.current.position.y = hoverY;
      outerRef.current.rotation.y += delta * 0.8;
      outerRef.current.rotation.z = Math.sin(time * 1.2) * 0.1;
      outerRef.current.scale.setScalar((0.85 + normalizedEnergy * 0.25) * pulse);
    }

    if (lightRef.current) {
      lightRef.current.intensity = (2.5 + Math.sin(time * 4) * 0.5) * normalizedEnergy * (theme === 'light' ? 1.5 : 1.0);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.3;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += delta * (0.3 + normalizedEnergy * 0.4);
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -0.5;
          positions[i * 3] = (Math.random() - 0.5) * 2.0;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dynamic Ambient Point Light */}
      <pointLight
        ref={lightRef}
        color={mainColor}
        intensity={3.0 * normalizedEnergy}
        distance={12}
        decay={2}
      />

      {/* Inner White Hot Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color={innerColor} />
      </mesh>

      {/* Outer Flame Aura */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.65, 3]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={2.0 * normalizedEnergy}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Dynamic Ember Fireflies Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={mainColor}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
