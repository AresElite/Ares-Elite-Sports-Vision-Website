import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function NeuralNetwork() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();
  
  // Create particles - Increased count for denser network
  const count = 400; 
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color("#06B6D4"); // Teal
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;     // x - wider spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z - deeper depth
      
      color.toArray(colors, i * 3);
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Constant slow rotation - "System Idle" state
    ref.current.rotation.x = time * 0.02;
    ref.current.rotation.y = time * 0.04;
    
    // Mouse interaction - subtle parallax with damping
    const x = (mouse.x * viewport.width) / 40;
    const y = (mouse.y * viewport.height) / 40;
    
    // Smooth interpolation for "heavy" feel
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, ref.current.rotation.x + (y * 0.01), 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, ref.current.rotation.y + (x * 0.01), 0.1);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        colors={colors}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#06B6D4"
          size={0.08} // Larger particles
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6} // Brighter
        />
      </Points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.08} // Visible connections
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
