import { motion } from 'framer-motion';

export function SystemOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,19,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[var(--color-ares-teal)]/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[var(--color-ares-teal)]/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[var(--color-ares-teal)]/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[var(--color-ares-teal)]/30" />
      
      {/* System Status - Bottom Left */}
      <div className="absolute bottom-8 left-20 text-[10px] font-mono text-[var(--color-ares-teal)]/40 tracking-widest hidden md:block">
        SYSTEM_STATUS: ONLINE
        <br />
        NEURAL_LINK: ACTIVE
      </div>

      {/* Coordinates - Top Right */}
      <div className="absolute top-9 right-20 text-[10px] font-mono text-[var(--color-ares-teal)]/40 tracking-widest hidden md:block">
        COORD: 34.0522° N, 118.2437° W
      </div>
    </div>
  );
}
