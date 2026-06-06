import { Canvas } from '@react-three/fiber';
import { NeuralNetwork } from './NeuralNetwork';
import { Suspense, useState } from 'react';
import { PerformanceMonitor } from '@react-three/drei';

export function NeuralBackgroundCanvas() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050508]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={dpr} // Dynamic DPR based on performance
      >
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 5, 25]} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      </Canvas>
      {/* Subtle vignette instead of heavy gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050508_100%)] pointer-events-none opacity-80" />
    </div>
  );
}
