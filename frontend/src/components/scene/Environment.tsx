import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Environment: React.FC = () => {
  const treeBranchRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Gentle tree branch wind sway
    if (treeBranchRef.current) {
      treeBranchRef.current.rotation.z = Math.sin(time * 0.8) * 0.02;
    }

    // Clouds slow drift across sky
    if (cloudsRef.current) {
      cloudsRef.current.position.x += delta * 0.05;
      if (cloudsRef.current.position.x > 15) {
        cloudsRef.current.position.x = -15;
      }
    }

    // Lantern flame flicker
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity = 2.0 + Math.sin(time * 6) * 0.4;
    }
  });

  return (
    <>
      {/* Sky & Fog */}
      <color attach="background" args={['#7eb5e6']} />
      <fog attach="fog" args={['#b8d8f0', 8, 28]} />

      {/* Sun & Lighting */}
      <ambientLight color="#fff7e6" intensity={1.4} />
      <directionalLight
        position={[6, 12, 6]}
        color="#fff4d4"
        intensity={2.2}
        castShadow
      />

      {/* Distant Cumulus Clouds */}
      <group ref={cloudsRef} position={[-5, 4.5, -12]}>
        {[
          [-4, 0, 0, 1.8],
          [-2, 0.5, 0, 2.2],
          [0, 0, 0, 2.5],
          [2, 0.3, 0, 2.0],
          [4, 0, 0, 1.5],
        ].map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[s, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} opacity={0.95} transparent />
          </mesh>
        ))}
      </group>

      {/* Distant Lake / River Waters */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -8]}>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#3877ab" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Lush Grassy Ground Meadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#559922" roughness={0.8} />
      </mesh>

      {/* Left Wooden Fence */}
      <group position={[-5, -0.8, -1]}>
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0]}>
            <boxGeometry args={[0.12, 0.9, 0.12]} />
            <meshStandardMaterial color="#7a5230" roughness={0.8} />
          </mesh>
        ))}
        {/* Horizontal rails */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[6.5, 0.08, 0.06]} />
          <meshStandardMaterial color="#7a5230" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[6.5, 0.08, 0.06]} />
          <meshStandardMaterial color="#7a5230" roughness={0.8} />
        </mesh>
      </group>

      {/* Large Oak Tree on Right */}
      <group ref={treeBranchRef} position={[4.2, -1.5, 0]}>
        {/* Main Trunk */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.9, 5.5, 12]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.9} />
        </mesh>

        {/* Overhanging Branches & Foliage Canopy */}
        <group position={[-0.8, 4.8, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshStandardMaterial color="#4d881e" roughness={0.7} />
          </mesh>
          <mesh position={[-1.2, -0.5, 0.5]}>
            <sphereGeometry args={[1.8, 16, 16]} />
            <meshStandardMaterial color="#5ca324" roughness={0.7} />
          </mesh>
        </group>

        {/* Hanging Lantern on Branch */}
        <group position={[-1.5, 3.2, 0.8]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
            <meshStandardMaterial color="#222222" metalness={0.8} />
          </mesh>
          <pointLight
            ref={lanternLightRef}
            color="#ffaa33"
            intensity={2.2}
            distance={5}
          />
        </group>
      </group>
    </>
  );
};
