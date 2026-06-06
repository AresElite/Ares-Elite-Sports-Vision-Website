import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  rotate?: number;
  speed?: number;
}

export function ScrollReveal({ 
  children, 
  className = "", 
  id,
  direction = 'up',
  distance = 100,
  rotate = 0,
  speed = 1
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Use a wider offset for smoother, longer parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate movement based on direction and speed
  // Disable horizontal parallax on mobile to prevent horizontal overflow issues
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Reduce total movement on mobile to prevent clipping and overflow
  const effectiveDistance = isMobile ? distance * 0.2 : distance;
  
  const yOffset = direction === 'up' ? effectiveDistance * speed : direction === 'down' ? -effectiveDistance * speed : 0;
  const xOffset = direction === 'left' || direction === 'right' ? (isMobile ? 0 : (direction === 'left' ? effectiveDistance * speed : -effectiveDistance * speed)) : 0;

  // Parallax translation
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);
  const x = useTransform(scrollYProgress, [0, 1], [xOffset, -xOffset]);
  
  // Subtle rotation parallax
  // Disable rotation on mobile to prevent corners from pushing off-screen
  const rotateZ = useTransform(scrollYProgress, [0, 1], [isMobile ? 0 : -rotate, isMobile ? 0 : rotate]);

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ 
        y: direction === 'up' || direction === 'down' ? y : 0,
        x: direction === 'left' || direction === 'right' ? x : 0,
        rotate: rotateZ
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
