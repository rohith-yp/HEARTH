import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DriftingLeaves: React.FC<{ count?: number }> = ({ count = 35 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Custom leaf geometry (elliptical curve with pointed tip)
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.1, 0.2, 0.25, 0.5, 0, 0.8);
    shape.bezierCurveTo(-0.25, 0.5, -0.1, 0.2, 0, 0);

    const extrudeSettings = {
      depth: 0.01,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Initialize leaf data (position, rotation, scale, velocity)
  const leavesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.4) * 14,
        y: Math.random() * 8 - 1,
        z: (Math.random() - 0.5) * 8 + 1,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.5,
        rotSpeedY: (Math.random() - 0.5) * 2.0,
        speedX: -0.3 - Math.random() * 0.5, // Drift left in wind
        speedY: -0.1 - Math.random() * 0.2, // Sway downward
        swayFreq: 1 + Math.random() * 2,
        swayAmp: 0.2 + Math.random() * 0.3,
        scale: 0.25 + Math.random() * 0.2,
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    leavesData.forEach((leaf, i) => {
      // Update leaf positions
      leaf.x += leaf.speedX * delta;
      leaf.y += (leaf.speedY + Math.sin(time * leaf.swayFreq) * 0.1) * delta;

      // Update rotations
      leaf.rotX += leaf.rotSpeedX * delta;
      leaf.rotY += leaf.rotSpeedY * delta;

      // Reset when leaf drifts out of bounds
      if (leaf.x < -8 || leaf.y < -3) {
        leaf.x = 8 + Math.random() * 4;
        leaf.y = 5 + Math.random() * 3;
        leaf.z = (Math.random() - 0.5) * 8 + 1;
      }

      dummy.position.set(leaf.x, leaf.y, leaf.z);
      dummy.rotation.set(leaf.rotX, leaf.rotY, leaf.rotZ);
      dummy.scale.setScalar(leaf.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[leafGeometry, undefined, count]}
      castShadow
    >
      <meshStandardMaterial
        color="#70aa33"
        roughness={0.4}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};
