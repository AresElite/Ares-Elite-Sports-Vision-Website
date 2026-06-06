import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

function Annotation({ position, title, description }: { position: [number, number, number], title: string, description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
      >
        <div className="w-4 h-4 bg-[var(--color-ares-teal)] rounded-full border-2 border-white shadow-[0_0_10px_rgba(41,182,246,0.8)] animate-pulse" />
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-56 bg-black/90 border border-[var(--color-ares-teal)]/50 p-3 rounded-lg backdrop-blur-md text-left transition-opacity duration-200 pointer-events-none ${open ? 'opacity-100' : 'opacity-0'}`}>
          <h4 className="text-[var(--color-ares-teal)] font-bold text-sm mb-1">{title}</h4>
          <p className="text-white/80 text-xs leading-tight">{description}</p>
        </div>
      </div>
    </Html>
  );
}

// Acquire: Eye / Lens abstraction
function AcquireModel() {
  const eyeGroupRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (eyeGroupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 6;
      const targetY = (state.pointer.y * Math.PI) / 6;
      eyeGroupRef.current.rotation.y = THREE.MathUtils.lerp(eyeGroupRef.current.rotation.y, targetX, 0.1);
      eyeGroupRef.current.rotation.x = THREE.MathUtils.lerp(eyeGroupRef.current.rotation.x, -targetY, 0.1);
    }
    if (irisRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      irisRef.current.scale.set(scale, scale, scale);
    }
    if (pupilRef.current) {
      const distance = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
      const targetScale = 0.8 + distance * 0.4; // Dilate when looking away
      pupilRef.current.scale.setScalar(THREE.MathUtils.lerp(pupilRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group ref={eyeGroupRef}>
      {/* Light Beam */}
      <mesh position={[0, 0, 3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.8, 4, 32]} />
        <meshBasicMaterial color="#e0f7fa" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Sclera (White of the eye) - Transparent to see inside */}
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} roughness={0.2} metalness={0.1} />
      </Sphere>
      
      {/* Retina (Inner back wall) */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1.48, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#ef5350" side={THREE.BackSide} roughness={0.8} />
      </mesh>

      {/* Cornea (Clear bulge) */}
      <Sphere args={[1.55, 32, 32]} position={[0, 0, 0.2]}>
        <meshPhysicalMaterial transparent opacity={0.3} roughness={0} transmission={1} thickness={0.5} color="#e0f7fa" />
      </Sphere>

      {/* Lens */}
      <Sphere args={[0.4, 32, 32]} position={[0, 0, 0.9]}>
        <meshPhysicalMaterial transparent opacity={0.8} roughness={0.1} transmission={1} ior={1.5} color="#ffffff" />
      </Sphere>

      {/* Iris */}
      <mesh position={[0, 0, 1.4]} ref={irisRef}>
        <circleGeometry args={[0.6, 64]} />
        <meshStandardMaterial color="#00D2B6" roughness={0.4} />
      </mesh>

      {/* Pupil */}
      <mesh position={[0, 0, 1.41]} ref={pupilRef}>
        <circleGeometry args={[0.25, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Optic Nerve */}
      <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 32]} />
        <meshStandardMaterial color="#ffcdd2" roughness={0.8} />
      </mesh>
      
      {/* Extraocular Muscles (Stylized) */}
      {[
        [1.6, 0, -0.5], [-1.6, 0, -0.5], [0, 1.6, -0.5], [0, -1.6, -0.5]
      ].map((pos, i) => (
        <mesh key={i} position={pos as any} rotation={[Math.PI / 2, 0, i < 2 ? Math.PI / 2 : 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
          <meshStandardMaterial color="#ef5350" roughness={0.7} />
        </mesh>
      ))}

      {/* Annotations */}
      <Annotation position={[0, 0, 1.8]} title="Cornea" description="The eye's clear, protective outer layer. First point of visual refraction." />
      <Annotation position={[0.6, 0, 0.9]} title="Lens" description="Focuses light onto the retina. Crucial for dynamic visual acuity." />
      <Annotation position={[0, 1.2, -0.8]} title="Retina" description="Light-sensitive tissue lining the back of the eye. Converts light to neural signals." />
      <Annotation position={[0, -0.5, -2.2]} title="Optic Nerve" description="Transmits visual information from the retina to the brain." />
      <Annotation position={[1.8, 0, -0.5]} title="Extraocular Muscles" description="Control eye movement and tracking precision." />
    </group>
  );
}

// Route: Neural Network abstraction
function RouteModel() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const pos = [];
    const cols = [];
    const color = new THREE.Color();
    for (let i = 0; i < 4000; i++) {
      const r = 2 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);
      
      // Elongate front-to-back (z), flatten bottom (y)
      x *= 0.75; 
      y *= 0.7; 
      z *= 1.1; 
      
      // Flatten bottom
      if (y < -0.4) y = -0.4 + (y + 0.4) * 0.3;

      // Create two hemispheres by pushing points away from center x=0
      const isRight = x > 0;
      if (isRight) {
        x = x + 0.08;
      } else {
        x = x - 0.08;
      }

      // Add a cerebellum-like structure at the back bottom
      if (Math.random() > 0.85) {
        x = (Math.random() - 0.5) * 1.2;
        y = -0.7 + (Math.random() * 0.4);
        z = -1.0 + (Math.random() * 0.6);
      }

      pos.push(x, y, z);
      
      const normalizedY = (y + 1.0) / 2.0;
      color.lerpColors(new THREE.Color('#7B61FF'), new THREE.Color('#00D2B6'), normalizedY);
      cols.push(color.r, color.g, color.b);
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(cols) };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.5, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -state.pointer.x * 0.5, 0.1);
    }
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.PointsMaterial).size = 0.04 + Math.sin(state.clock.elapsedTime * 3) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
      
      {/* Neural Pathways (Glowing Lines inside) */}
      {[...Array(15)].map((_, i) => {
        const start = [(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2] as [number, number, number];
        const end = [(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2] as [number, number, number];
        return (
          <Line key={`line-${i}`} points={[start, end]} color="#00D2B6" transparent opacity={0.15} lineWidth={1} />
        );
      })}

      {[...Array(12)].map((_, i) => (
        <Signal key={i} delay={i * 0.25} />
      ))}

      <Annotation position={[0, 1.2, 1.5]} title="Frontal Lobe" description="Responsible for higher-level cognitive functions, decision making, and motor planning." />
      <Annotation position={[0, -0.2, -2.0]} title="Visual Cortex" description="Processes visual information received from the eyes." />
      <Annotation position={[1.2, 0, 0]} title="Neural Pathways" description="High-speed networks transmitting signals across brain regions." />
    </group>
  );
}

function Signal({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime + delay) % 2;
      const z = 2.4 - (t * 2.4);
      const x = Math.sin(t * Math.PI * 4) * 0.5 * (t > 1 ? 1 : -1);
      const y = Math.cos(t * Math.PI * 3) * 0.5;
      ref.current.position.set(x, y, z);
      ref.current.scale.setScalar(Math.sin((t / 2) * Math.PI));
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

// Execute: Motor Output / Kinematic abstraction
function ExecuteModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = state.pointer.y * 0.2;
      groupRef.current.rotation.z = -state.pointer.x * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Brainstem / Motor Cortex */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#7B61FF" roughness={0.3} emissive="#7B61FF" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Spinal Cord & Vertebrae */}
      <group position={[0, 0.5, 0]}>
        {/* Inner cord */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
          <meshStandardMaterial color="#00D2B6" emissive="#00D2B6" emissiveIntensity={0.8} />
        </mesh>
        {/* Vertebrae segments */}
        {[...Array(15)].map((_, i) => (
          <mesh key={i} position={[0, 1.8 - i * 0.28, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
            <meshStandardMaterial color="#e0f7fa" transparent opacity={0.5} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Peripheral Nerves & Muscles */}
      {[
        { y: 1.5, x: 2.0, label: "Upper Extremity" },
        { y: 1.5, x: -2.0 },
        { y: -0.8, x: 1.8, label: "Lower Extremity" },
        { y: -0.8, x: -1.8 }
      ].map((pos, i) => (
        <MuscleGroup key={i} pos={pos} delay={i * 0.5} />
      ))}

      <Annotation position={[0, 3.6, 0]} title="Motor Cortex" description="Generates neural impulses that control the execution of movement." />
      <Annotation position={[0, 0.5, 0.4]} title="Spinal Cord" description="The main pathway for information connecting the brain and peripheral nervous system." />
      <Annotation position={[2.4, 0.7, 0]} title="Neuromuscular Junction" description="Where the nervous system connects to the muscular system to trigger contraction." />
      <Annotation position={[2.0, -2.0, 0]} title="Kinematic Chain" description="The coordinated sequence of muscle activations for complex movements." />
    </group>
  );
}

function MuscleGroup({ pos, delay }: { pos: {x: number, y: number}, delay: number }) {
  const muscleRef = useRef<THREE.Group>(null);
  const signalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * 1.5 + delay) % 2;
    
    if (signalRef.current) {
      if (t < 1) {
        signalRef.current.visible = true;
        // Follow the nerve path
        if (t < 0.5) {
          const progress = t * 2;
          signalRef.current.position.x = THREE.MathUtils.lerp(0, pos.x * 0.5, progress);
          signalRef.current.position.y = pos.y;
        } else {
          const progress = (t - 0.5) * 2;
          signalRef.current.position.x = THREE.MathUtils.lerp(pos.x * 0.5, pos.x, progress);
          signalRef.current.position.y = THREE.MathUtils.lerp(pos.y, pos.y - 0.4, progress);
        }
        signalRef.current.scale.setScalar(Math.sin(t * Math.PI));
      } else {
        signalRef.current.visible = false;
      }
    }

    if (muscleRef.current) {
      if (t > 0.8 && t < 1.2) {
        const contractT = (t - 0.8) / 0.4;
        const scaleX = 1 + Math.sin(contractT * Math.PI) * 0.3;
        const scaleY = 1 - Math.sin(contractT * Math.PI) * 0.15;
        muscleRef.current.scale.set(scaleX, scaleY, scaleX);
        const belly = muscleRef.current.children[0] as THREE.Mesh;
        (belly.material as THREE.MeshStandardMaterial).color.setHex(0xff5252);
        (belly.material as THREE.MeshStandardMaterial).emissive.setHex(0x330000);
      } else {
        muscleRef.current.scale.set(1, 1, 1);
        const belly = muscleRef.current.children[0] as THREE.Mesh;
        (belly.material as THREE.MeshStandardMaterial).color.setHex(0xef5350);
        (belly.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
      }
    }
  });

  return (
    <group>
      <Line points={[[0, pos.y, 0], [pos.x * 0.5, pos.y, 0], [pos.x, pos.y - 0.4, 0]]} color="#00D2B6" lineWidth={2} />
      <group position={[pos.x, pos.y - 0.8, 0]} ref={muscleRef}>
        {/* Muscle Belly */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 16]} />
          <meshStandardMaterial color="#ef5350" roughness={0.7} />
        </mesh>
        {/* Top Tendon */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.05, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#e0f7fa" roughness={0.5} />
        </mesh>
        {/* Bottom Tendon */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.15, 0.05, 0.3, 16]} />
          <meshStandardMaterial color="#e0f7fa" roughness={0.5} />
        </mesh>
      </group>
      <mesh ref={signalRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Synchronize: Full Stack Integration
function SynchronizeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5 + state.pointer.x;
      groupRef.current.rotation.x = state.pointer.y;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core (Brain/CNS) */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial color="#7B61FF" distort={0.4} speed={3} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Orbiting Data Rings */}
      {[1.5, 2, 2.5].map((radius, i) => (
        <group key={i} rotation={[Math.PI / 2 + i, i, 0]}>
          <mesh>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00D2B6" transparent opacity={0.5} />
          </mesh>
          <DataPacket radius={radius} speed={1 + i * 0.5} />
        </group>
      ))}

      {/* Peripheral Nodes (Eye, Limb) */}
      <group position={[3, 0, 0]}>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <FeedbackLine start={[0,0,0]} end={[-3,0,0]} color="#00D2B6" delay={0} />
      </group>
      
      <group position={[-3, 0, 0]}>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#ef5350" />
        </Sphere>
        <FeedbackLine start={[0,0,0]} end={[3,0,0]} color="#7B61FF" delay={0.5} />
      </group>

      <Annotation position={[0, 1.5, 0]} title="Central Nervous System" description="The core processor integrating all sensory input and motor output." />
      <Annotation position={[2.5, 1.5, 0]} title="Feedback Loops" description="Continuous, real-time data exchange between peripheral systems and the CNS." />
    </group>
  );
}

function FeedbackLine({ start, end, color, delay }: { start: [number, number, number], end: [number, number, number], color: string, delay: number }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime + delay) % 1;
      pulseRef.current.position.x = THREE.MathUtils.lerp(start[0], end[0], t);
      pulseRef.current.position.y = THREE.MathUtils.lerp(start[1], end[1], t);
      pulseRef.current.position.z = THREE.MathUtils.lerp(start[2], end[2], t);
      pulseRef.current.scale.setScalar(Math.sin(t * Math.PI) * 1.5);
    }
  });

  return (
    <group>
      <Line points={[start, end]} color={color} lineWidth={2} transparent opacity={0.5} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function DataPacket({ radius, speed }: { radius: number, speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const angle = state.clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.y = Math.sin(angle) * radius;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

export function System3DModel({ stage }: { stage: string }) {
  return (
    <div className="w-full h-[500px] bg-[var(--color-ares-charcoal)] rounded-xl overflow-hidden border border-[var(--color-ares-border)] relative shadow-glow cursor-crosshair">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-[var(--color-ares-border)] text-xs font-mono text-white/70 uppercase tracking-widest">
        Live Render: {stage}
      </div>
      <div className="absolute bottom-4 right-4 z-10 text-xs font-mono text-white/40 uppercase tracking-widest text-right">
        Interactive Model<br/>
        <span className="text-[var(--color-ares-teal)]">Hover points for details</span>
      </div>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#7B61FF" intensity={2} />
        
        {stage === 'acquire' && <AcquireModel />}
        {stage === 'route' && <RouteModel />}
        {stage === 'execute' && <ExecuteModel />}
        {stage === 'synchronize' && <SynchronizeModel />}
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
