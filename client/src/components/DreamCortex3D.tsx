import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 🧠 Dream Cortex 3D Visualization
 * A high-performance, premium 3D visualization of the 17,000+ agent swarm.
 */

function AgentParticles({ count = 5000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      const distance = 5 + Math.random() * 5;
      
      p[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      p[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      p[i * 3 + 2] = distance * Math.cos(theta);
    }
    return p;
  }, [count]);

  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function GuildCore({ color, position, name }: { color: string, position: [number, number, number], name: string }) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
    </Float>
  );
}

export default function DreamCortex3D() {
  const guilds = [
    { name: 'PiClaw', color: '#0066ff', pos: [3, 2, 0] as [number, number, number] },
    { name: 'Trading', color: '#ffd700', pos: [-3, -2, 2] as [number, number, number] },
    { name: 'Axo', color: '#ff00ff', pos: [0, 4, -2] as [number, number, number] },
    { name: 'Ghost', color: '#ffffff', pos: [4, -4, 0] as [number, number, number] },
    { name: 'SEO', color: '#00ff00', pos: [-4, 3, -1] as [number, number, number] },
  ];

  return (
    <div style={{ width: '100%', height: '600px', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />
        
        <AgentParticles count={8000} />
        
        {guilds.map((g, i) => (
          <GuildCore key={i} color={g.color} position={g.pos} name={g.name} />
        ))}
        
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
