import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const RotatingShape = () => {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  
  // Mouse movement track karne ke liye
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // 1. Automatic Rotation
    gradientMaterial.uniforms.uTime.value = t;
    meshRef.current.rotation.y = t * 0.15;
    
    // 2. Cursor Movement (Parallax)
    // Mouse position ke base par thoda tilt aur movement dena
    const targetX = state.mouse.x * 0.5;
    const targetY = state.mouse.y * 0.5;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);
  });

  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#4F9CF9') },
        uColor2: { value: new THREE.Color('#7C5CFF') },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          float mixer = (vPosition.y + 1.5) / 3.0;
          vec3 baseColor = mix(uColor1, uColor2, mixer);
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          vec3 finalColor = baseColor + fresnel * 0.3;
          gl_FragColor = vec4(finalColor, 0.85);
        }
      `,
      transparent: true,
    });
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <primitive object={gradientMaterial} attach="material" />
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

      {/* ZOOM FEATURE: enableZoom={true} se mouse scroll se zoom hoga */}
      {/* enablePan={false} taki object screen se bahar na khisak jaye */}
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        enableRotate={false} // Mouse movement humne manually handle kiya hai upar
        minDistance={3} 
        maxDistance={8} 
      />
    </Canvas>
  );
};

export default Ball;