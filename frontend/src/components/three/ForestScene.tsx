import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WickEmber3D } from './WickEmber3D';

interface ForestSceneProps {
  theme: 'dark' | 'light';
  mood?: string;
  energy?: number;
  stage?: string;
}

// Background environment with trees silhouettes and drifting particles
const EnvironmentElements: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';
  const fogColor = isLight ? '#e6f4f0' : '#070d0b';
  const ambientColor = isLight ? '#fffaed' : '#0e1815';

  // Background drifting ambient particles
  const particleCount = 120;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
    // Subtle camera parallax movement
    const targetX = state.pointer.x * 0.4;
    const targetY = state.pointer.y * 0.2 + 0.5;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 5, 22]} />
      <ambientLight color={ambientColor} intensity={isLight ? 1.8 : 0.6} />

      {/* Sun/Moon Directional Light */}
      <directionalLight
        position={[5, 10, 5]}
        color={isLight ? '#fff2d6' : '#2b4942'}
        intensity={isLight ? 2.5 : 0.8}
      />

      {/* Forest Floor Ground Mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={isLight ? '#406050' : '#0a1411'}
          roughness={0.9}
        />
      </mesh>

      {/* Tree Silhouettes Background Group */}
      <group ref={groupRef} position={[0, -1.8, -5]}>
        {[-8, -5, -2, 2, 5, 8].map((x, i) => (
          <group key={i} position={[x + (i % 2) * 0.5, 0, (i % 3) * -1.5]}>
            {/* Trunk */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.2, 0.4, 5, 8]} />
              <meshStandardMaterial color={isLight ? '#2a3a30' : '#050a08'} />
            </mesh>
            {/* Foliage Canopy */}
            <mesh position={[0, 4.5, 0]}>
              <coneGeometry args={[1.5, 4, 8]} />
              <meshStandardMaterial color={isLight ? '#1f4535' : '#08120e'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ambient Drifting Fireflies / Pollen */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={isLight ? '#ffd966' : '#ff9933'}
          transparent
          opacity={isLight ? 0.5 : 0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

export const ForestScene: React.FC<ForestSceneProps> = ({
  theme,
  mood,
  energy,
  stage,
}) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000">
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ pointerEvents: 'none' }}
      >
        <EnvironmentElements theme={theme} />
        <WickEmber3D mood={mood} energy={energy} stage={stage} theme={theme} />
      </Canvas>
    </div>
  );
};
