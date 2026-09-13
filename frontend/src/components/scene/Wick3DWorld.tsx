import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStageInfo, getMoodAnimationParams } from '../../services/wickEvolution';

interface Wick3DWorldProps {
  stage?: string;
  mood?: string;
  energy?: number;
  bond?: number;
}

export const Wick3DWorld: React.FC<Wick3DWorldProps> = ({
  stage = 'Ember',
  mood = 'happy',
  energy = 85,
  bond = 40,
}) => {
  const wickGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const flameHairRef = useRef<THREE.Mesh>(null);
  const secondaryFlameRef = useRef<THREE.Mesh>(null);
  const auraRingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const stageInfo = getStageInfo(stage);
  const moodParams = getMoodAnimationParams(mood);

  const normalizedEnergy = Math.max(0.3, Math.min(1.0, energy / 100));
  const normalizedBond = Math.max(0.1, Math.min(1.0, bond / 100));
  const emberColor = moodParams.lightColor;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Breathing pulse & floating bobbing scaled by energy and stage
    const floatSpeed = moodParams.floatSpeed;
    const bounceH = moodParams.bounceHeight;
    const breath = Math.sin(time * (floatSpeed * 0.8)) * 0.04 + 1;
    const hover = Math.sin(time * floatSpeed) * bounceH;

    if (wickGroupRef.current) {
      wickGroupRef.current.position.y = -0.5 + hover;
      // Subtle companion tilt
      wickGroupRef.current.rotation.z = Math.sin(time * 1.2) * 0.03;
    }

    if (headRef.current) {
      headRef.current.scale.set(
        stageInfo.scale * breath,
        stageInfo.scale * breath,
        stageInfo.scale * breath
      );
    }

    if (bodyRef.current) {
      bodyRef.current.scale.set(
        stageInfo.scale * 0.95,
        stageInfo.scale * 0.95,
        stageInfo.scale * 0.95
      );
    }

    // Flame Hair Crown animation scaling across evolution stages
    if (flameHairRef.current) {
      flameHairRef.current.rotation.y += delta * (1.2 * normalizedEnergy);
      const flameW = 0.25 * stageInfo.scale * (Math.sin(time * 4) * 0.08 + 1);
      const flameH = stageInfo.flameHeight * (Math.cos(time * 3) * 0.1 + 1);
      flameHairRef.current.scale.set(flameW, flameH, flameW);
    }

    if (secondaryFlameRef.current) {
      secondaryFlameRef.current.rotation.y -= delta * (1.8 * normalizedEnergy);
      const secH = stageInfo.flameHeight * 0.7 * (Math.sin(time * 5) * 0.12 + 1);
      secondaryFlameRef.current.scale.set(
        0.2 * stageInfo.scale,
        secH,
        0.2 * stageInfo.scale
      );
    }

    // Subtle Aura Ring rotation for Blaze and Hearthkeeper stages
    if (auraRingRef.current) {
      auraRingRef.current.rotation.z += delta * 0.8;
      const auraPulse = Math.sin(time * 2) * 0.1 + 1;
      auraRingRef.current.scale.set(auraPulse, auraPulse, auraPulse);
    }

    // Environmental Point Light scaling
    if (lightRef.current) {
      const baseIntensity = stageInfo.emissiveIntensity * moodParams.emissiveBoost;
      lightRef.current.intensity =
        (baseIntensity * 2.5 + Math.sin(time * 4) * 0.5) * normalizedEnergy;
      lightRef.current.distance = stageInfo.lightRadius + normalizedBond * 2;
    }
  });

  const isEvolvedStage =
    stageInfo.name === 'Flame' ||
    stageInfo.name === 'Blaze' ||
    stageInfo.name === 'Hearthkeeper';

  const isUltimateStage =
    stageInfo.name === 'Blaze' || stageInfo.name === 'Hearthkeeper';

  return (
    <group position={[2.2, -0.6, 1.2]}>
      {/* Dynamic Point Light emanating from Wick */}
      <pointLight
        ref={lightRef}
        color={emberColor}
        intensity={3.5}
        distance={stageInfo.lightRadius}
        decay={2}
        position={[0, 0.6 * stageInfo.scale, 0]}
      />

      {/* Wooden Deck Base */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.15, 2.5]} />
        <meshStandardMaterial color="#7a4a21" roughness={0.7} />
      </mesh>

      {/* Wick Character Group */}
      <group ref={wickGroupRef} position={[-0.4, 0, 0]}>
        {/* Soft Glowing Body */}
        <mesh ref={bodyRef} position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color="#fff0db"
            emissive={emberColor}
            emissiveIntensity={
              0.5 * stageInfo.emissiveIntensity * normalizedEnergy
            }
            roughness={0.3}
          />
        </mesh>

        {/* Cute Head */}
        <mesh ref={headRef} position={[0, 0.65 * stageInfo.scale, 0]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial
            color="#ffe8cc"
            emissive={emberColor}
            emissiveIntensity={
              0.7 * stageInfo.emissiveIntensity * normalizedEnergy
            }
            roughness={0.2}
          />
        </mesh>

        {/* Primary Flame Hair Crown */}
        <mesh
          ref={flameHairRef}
          position={[0, (0.9 + stageInfo.flameHeight * 0.3) * stageInfo.scale, 0]}
        >
          <coneGeometry args={[0.25, 0.6, 16]} />
          <meshStandardMaterial
            color={emberColor}
            emissive={emberColor}
            emissiveIntensity={2.2 * stageInfo.emissiveIntensity * normalizedEnergy}
            roughness={0.1}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Evolved Secondary Flame Spire (Flame, Blaze, Hearthkeeper) */}
        {isEvolvedStage && (
          <mesh
            ref={secondaryFlameRef}
            position={[
              0,
              (1.05 + stageInfo.flameHeight * 0.4) * stageInfo.scale,
              0,
            ]}
          >
            <coneGeometry args={[0.18, 0.5, 12]} />
            <meshStandardMaterial
              color="#ffe5b4"
              emissive="#ffa500"
              emissiveIntensity={
                2.8 * stageInfo.emissiveIntensity * normalizedEnergy
              }
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}

        {/* Ultimate Golden/Ember Aura Ring (Blaze & Hearthkeeper) */}
        {isUltimateStage && (
          <mesh
            ref={auraRingRef}
            position={[0, 0.5 * stageInfo.scale, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.55 * stageInfo.scale, 0.02, 16, 32]} />
            <meshBasicMaterial
              color={stageInfo.name === 'Hearthkeeper' ? '#ffd700' : '#ff7700'}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}

        {/* Expressive Companion Eyes */}
        <mesh position={[0.12 * stageInfo.scale, 0.68 * stageInfo.scale, 0.32 * stageInfo.scale]}>
          <sphereGeometry args={[0.04 * stageInfo.scale, 16, 16]} />
          <meshBasicMaterial color="#2d1500" />
        </mesh>
        <mesh position={[-0.12 * stageInfo.scale, 0.68 * stageInfo.scale, 0.32 * stageInfo.scale]}>
          <sphereGeometry args={[0.04 * stageInfo.scale, 16, 16]} />
          <meshBasicMaterial color="#2d1500" />
        </mesh>
      </group>

      {/* Open Laptop on Deck */}
      <group position={[0.8, -0.4, 0.2]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.5]} />
          <meshStandardMaterial color="#c0c7d0" metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[0, 0.015, -0.24]} rotation={[-0.3, 0, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.7, 0.48, 0.02]} />
            <meshStandardMaterial color="#1d2939" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.25, 0.012]}>
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
        <mesh position={[0, 0.12, 0.1]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={emberColor} />
        </mesh>
      </group>
    </group>
  );
};
