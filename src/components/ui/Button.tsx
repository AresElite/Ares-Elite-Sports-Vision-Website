import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motionConfig } from '../../config/motion';

const MotionLink = motion(Link);

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  href?: string;
}

export function Button({ children, variant = 'primary', className = '', href, ...props }: ButtonProps) {
  const baseStyles = "relative px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm tracking-wide overflow-hidden group transition-all duration-300 inline-flex items-center justify-center cursor-pointer";
  
  const variantStyles = {
    primary: "bg-[var(--color-ares-teal)] text-white hover:bg-[var(--color-ares-teal)]/90 shadow-glow font-bold",
    outline: "bg-transparent border border-[var(--color-ares-teal)] text-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/10 font-medium",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5 font-medium"
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Precision Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-[var(--color-ares-teal)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        layoutId={`glow-${Math.random()}`} // Unique layoutId to prevent conflicts
      />
    </>
  );

  if (href) {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    
    if (isInternal) {
      return (
        <MotionLink
          to={href}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: motionConfig.timing.micro, ease: motionConfig.easing.precision }}
          className={combinedClassName}
          {...props as any}
        >
          {content}
        </MotionLink>
      );
    }

    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: motionConfig.timing.micro, ease: motionConfig.easing.precision }}
        className={combinedClassName}
        {...props as any}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: motionConfig.timing.micro, ease: motionConfig.easing.precision }}
      className={combinedClassName}
      {...props}
    >
      {content}
    </motion.button>
  );
}
