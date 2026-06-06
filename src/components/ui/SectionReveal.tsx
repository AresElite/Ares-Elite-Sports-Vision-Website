import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { variants } from '../../config/motion';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  animate?: any;
  style?: React.CSSProperties;
}

export function SectionReveal({ children, className = "", id, delay = 0, animate, style }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      style={style}
      initial="hidden"
      whileInView={animate ? undefined : "visible"}
      animate={animate}
      viewport={{ once: true, margin: "0px" }}
      variants={variants.origamiReveal}
      transition={{ delay }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}
