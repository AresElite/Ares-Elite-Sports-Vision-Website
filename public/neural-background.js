/**
 * Ares Elite Sports Vision - Neural Background
 * 
 * Instructions:
 * 1. Include this file in your HTML: <script src="neural-background.js"></script>
 * 2. Add a canvas to your HTML: <canvas id="neural-canvas" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none;"></canvas>
 * 3. Initialize it: initNeuralBackground('neural-canvas');
 */

function initNeuralBackground(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let nodes = [];
  let connections = [];
  let signals = [];
  
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
    
    initNetwork(rect.width, rect.height);
  };

  const initNetwork = (width, height) => {
    nodes = [];
    connections = [];
    signals = [];
    
    const numNodes = Math.min(Math.floor((width * height) / 10000), 200);
    
    // Create nodes distributed across 3 layers horizontally
    for (let i = 0; i < numNodes; i++) {
      const layer = i % 3; // 0, 1, or 2
      
      let baseX = 0;
      if (layer === 0) baseX = width * (0.1 + Math.random() * 0.2);
      else if (layer === 1) baseX = width * (0.4 + Math.random() * 0.2);
      else baseX = width * (0.7 + Math.random() * 0.2);
      
      nodes.push({
        id: i,
        x: baseX + (Math.random() - 0.5) * 100,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseRadius: layer === 1 ? 1.5 + Math.random() : 1 + Math.random(),
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
        
        const layerDiff = nodeB.layer - nodeA.layer;
        if (layerDiff === 0 || layerDiff === 1) {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const threshold = layerDiff === 1 ? 300 : 150; 
          
          if (dist < threshold) {
            if (Math.random() > 0.4) continue;
            
            const curvature = (Math.random() - 0.5) * (dist * 0.5);
            const connection = { nodeA, nodeB, curvature };
            
            connections.push(connection);
            nodeA.connections.push(connection);
          }
        }
      }
    }
  };

  const getBezierXY = (t, sx, sy, cp1x, cp1y, ex, ey) => {
    return {
      x: Math.pow(1-t, 2) * sx + 2 * (1-t) * t * cp1x + Math.pow(t, 2) * ex,
      y: Math.pow(1-t, 2) * sy + 2 * (1-t) * t * cp1y + Math.pow(t, 2) * ey
    };
  };

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    ctx.clearRect(0, 0, width, height);

    // Update nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      const layerMinX = node.layer * (width / 3) - 100;
      const layerMaxX = (node.layer + 1) * (width / 3) + 100;
      
      if (node.x < layerMinX) { node.x = layerMinX; node.vx *= -1; }
      if (node.x > layerMaxX) { node.x = layerMaxX; node.vx *= -1; }
      if (node.y < -50) { node.y = -50; node.vy *= -1; }
      if (node.y > height + 50) { node.y = height + 50; node.vy *= -1; }
    });

    ctx.lineWidth = 1;
    
    // Draw Connections
    connections.forEach(conn => {
      const { nodeA, nodeB, curvature } = conn;
      
      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len === 0) return;
      const nx = -dy / len;
      const ny = dx / len;
      
      const cpX = midX + nx * curvature;
      const cpY = midY + ny * curvature;

      const maxDist = 300;
      const opacity = Math.max(0, 0.15 * (1 - len / maxDist));
      
      if (opacity > 0) {
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.quadraticCurveTo(cpX, cpY, nodeB.x, nodeB.y);
        
        if (nodeA.layer !== nodeB.layer) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`;
        } else {
          ctx.strokeStyle = `rgba(41, 152, 170, ${opacity})`;
        }
        ctx.stroke();
      }
    });

    // Draw Nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = node.layer === 1 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(41, 152, 170, 0.5)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.baseRadius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // Spawn Signals
    if (Math.random() < 0.4 && connections.length > 0) {
      const validConns = connections.filter(c => c.nodeB.layer > c.nodeA.layer);
      const sourceList = validConns.length > 0 && Math.random() < 0.7 ? validConns : connections;
      
      if (sourceList.length > 0) {
        const conn = sourceList[Math.floor(Math.random() * sourceList.length)];
        const c = colors[Math.floor(Math.random() * colors.length)];
        
        signals.push({
          connection: conn,
          progress: 0,
          speed: 0.005 + Math.random() * 0.015,
          length: 0.1 + Math.random() * 0.2,
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

      let startT = Math.max(0, s.progress - s.length);
      let endT = Math.min(1, s.progress);
      
      if (startT < endT) {
        ctx.beginPath();
        const startPoint = getBezierXY(startT, nodeA.x, nodeA.y, cpX, cpY, nodeB.x, nodeB.y);
        ctx.moveTo(startPoint.x, startPoint.y);
        
        const steps = 5;
        for (let j = 1; j <= steps; j++) {
          const t = startT + (endT - startT) * (j / steps);
          const p = getBezierXY(t, nodeA.x, nodeA.y, cpX, cpY, nodeB.x, nodeB.y);
          ctx.lineTo(p.x, p.y);
        }
        
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  
  // Initial setup
  resize();
  draw();

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
