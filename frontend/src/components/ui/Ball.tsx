import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const RotatingShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    meshRef.current.rotation.y = t * 0.15;

    const targetX = state.mouse.x * 0.5;
    const targetY = state.mouse.y * 0.5;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial color="#4F9CF9" emissive="#1F4FD8" emissiveIntensity={0.18} roughness={0.35} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.85, 1]} />
          <meshBasicMaterial color="#4F9CF9" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  );
};

const Ball = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#4F9CF9" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#7C5CFF" />
      
      <RotatingShape />

      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        enableRotate={false} 
        minDistance={5} 
        maxDistance={10} 
      />
    </Canvas>
  );
};

export default Ball;
