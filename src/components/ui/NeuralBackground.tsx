import { useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  layer: number;     // 0: input, 1: interneuron, 2: output
  connections: Connection[];
}

interface Connection {
  nodeA: Node;
  nodeB: Node;
  curvature: number;
}

interface Signal {
  connection: Connection;
  progress: number;
  speed: number;
  length: number;
  color: string;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let signals: Signal[] = [];
    
    // Teal and Purple from Ares theme
    const colors = [
      { r: 41, g: 152, b: 170 }, // Teal #2998AA
      { r: 139, g: 92, b: 246 }  // Purple #8B5CF6
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      initNetwork(rect.width, rect.height);
    };

    const initNetwork = (width: number, height: number) => {
      nodes = [];
      connections = [];
      signals = [];
      
      const numNodes = Math.min(Math.floor((width * height) / 10000), 200);
      
      // Create nodes distributed across 3 layers horizontally
      for (let i = 0; i < numNodes; i++) {
        // Layer determines approximate X position (simulating a neural pathway left to right)
        const layer = i % 3; // 0, 1, or 2
        
        let baseX = 0;
        if (layer === 0) baseX = width * (0.1 + Math.random() * 0.2);
        else if (layer === 1) baseX = width * (0.4 + Math.random() * 0.2);
        else baseX = width * (0.7 + Math.random() * 0.2);
        
        nodes.push({
          id: i,
          x: baseX + (Math.random() - 0.5) * 100, // Some jitter
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseRadius: layer === 1 ? 1.5 + Math.random() : 1 + Math.random(), // Interneurons slightly larger
          layer,
          connections: []
        });
      }

      // Pre-calculate connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = 0; j < nodes.length; j++) {
          const nodeB = nodes[j];
          if (i === j) continue;
          
          // Connect mostly to same layer or adjacent layer (forward direction preferred)
          const layerDiff = nodeB.layer - nodeA.layer;
          if (layerDiff === 0 || layerDiff === 1) {
            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Connect if close enough
            const threshold = layerDiff === 1 ? 300 : 150; 
            
            if (dist < threshold) {
              // Add a bit of chance to not have too uniform connections
              if (Math.random() > 0.4) continue;
              
              const curvature = (Math.random() - 0.5) * (dist * 0.5); // Random curve
              const connection = { nodeA, nodeB, curvature };
              
              connections.push(connection);
              nodeA.connections.push(connection);
            }
          }
        }
      }
    };

    const getBezierXY = (t: number, sx: number, sy: number, cp1x: number, cp1y: number, ex: number, ey: number) => {
      return {
        x: Math.pow(1-t, 2) * sx + 2 * (1-t) * t * cp1x + Math.pow(t, 2) * ex,
        y: Math.pow(1-t, 2) * sy + 2 * (1-t) * t * cp1y + Math.pow(t, 2) * ey
      };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Clear with slight trailing effect for motion blur
      ctx.clearRect(0, 0, width, height);

      // Update nodes (slow drift)
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Keep within bounds relative to their layer with gentle bouncing
        const layerMinX = node.layer * (width / 3) - 100;
        const layerMaxX = (node.layer + 1) * (width / 3) + 100;
        
        if (node.x < layerMinX) { node.x = layerMinX; node.vx *= -1; }
        if (node.x > layerMaxX) { node.x = layerMaxX; node.vx *= -1; }
        if (node.y < -50) { node.y = -50; node.vy *= -1; }
        if (node.y > height + 50) { node.y = height + 50; node.vy *= -1; }
      });

      ctx.lineWidth = 1;
      
      // Draw Connections (Axons/Dendrites)
      connections.forEach(conn => {
        const { nodeA, nodeB, curvature } = conn;
        
        // Calculate control point for quadratic bezier
        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        
        // Normal vector
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len === 0) return;
        const nx = -dy / len;
        const ny = dx / len;
        
        const cpX = midX + nx * curvature;
        const cpY = midY + ny * curvature;

        // Distance affects opacity
        const maxDist = 300;
        const opacity = Math.max(0, 0.15 * (1 - len / maxDist));
        
        if (opacity > 0) {
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.quadraticCurveTo(cpX, cpY, nodeB.x, nodeB.y);
          
          // Different colors based on layer connection
          if (nodeA.layer !== nodeB.layer) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`; // Purple across layers
          } else {
            ctx.strokeStyle = `rgba(41, 152, 170, ${opacity})`; // Teal within layer
          }
          ctx.stroke();
        }
      });

      // Draw Nodes (Somas)
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.layer === 1 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(41, 152, 170, 0.5)';
        ctx.fill();
        
        // Core glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // Spawn Signals (Synaptic Firing)
      if (Math.random() < 0.4 && connections.length > 0) {
        // Prefer forward-feeding connections (layer 0->1 or 1->2)
        const validConns = connections.filter(c => c.nodeB.layer > c.nodeA.layer);
        const sourceList = validConns.length > 0 && Math.random() < 0.7 ? validConns : connections;
        
        if (sourceList.length > 0) {
          const conn = sourceList[Math.floor(Math.random() * sourceList.length)];
          const c = colors[Math.floor(Math.random() * colors.length)];
          
          signals.push({
            connection: conn,
            progress: 0,
            speed: 0.005 + Math.random() * 0.015, // Variable transmission speed
            length: 0.1 + Math.random() * 0.2,    // Tail length for the signal
            color: `rgba(${c.r}, ${c.g}, ${c.b}, 1)` 
          });
        }
      }

      // Draw Signals
      ctx.lineCap = "round";
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.progress += s.speed;
        
        if (s.progress > 1 + s.length) {
          signals.splice(i, 1);
          continue;
        }

        const { nodeA, nodeB, curvature } = s.connection;
        
        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len === 0) continue;
        
        const nx = -dy / len;
        const ny = dx / len;
        const cpX = midX + nx * curvature;
        const cpY = midY + ny * curvature;

        // The signal is a short segment of the curve
        const headProg = Math.min(1, s.progress);
        const tailProg = Math.max(0, s.progress - s.length);
        
        const head = getBezierXY(headProg, nodeA.x, nodeA.y, cpX, cpY, nodeB.x, nodeB.y);
        const tail = getBezierXY(tailProg, nodeA.x, nodeA.y, cpX, cpY, nodeB.x, nodeB.y);
        
        // Draw the firing bolt
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        // Approximation: a straight line for the signal segment looks fine if short, 
        // but for better fidelity we could draw small sub-segments.
        // A simple straight line from tail to head is very performant and visually identical for short lengths.
        ctx.lineTo(head.x, head.y);
        
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        
        ctx.stroke();
        
        ctx.shadowBlur = 0; // Reset
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    setTimeout(() => {
      resize();
      draw();
    }, 100);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-ares-bg)] opacity-40 z-10" />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 opacity-80 mix-blend-screen w-full h-full transform scale-105"
      />
    </div>
  );
}
