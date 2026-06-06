import { motion } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';

export function CTASection() {
  return (
    <SectionReveal id="contact" className="py-20 sm:py-32 bg-[var(--color-ares-charcoal)] relative overflow-hidden border-t border-[var(--color-ares-border)]">
      {/* Abstract shapes */}
      <ScrollReveal direction="left" distance={150} speed={0.3} className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white transform skew-x-12"></div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal direction="up" distance={40} speed={0.8}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight text-balance">
            IF EVERY DETAIL MATTERS, EVERY DETAIL SHOULD BE EVALUATED.
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
            Stop guessing and start measuring. Whether you are an athlete searching for the hidden millisecond, a coach evaluating a team, or a professional looking to redefine performance, A.R.E.S. is your infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button 
              variant="primary" 
              href="/book/evaluation"
              className="w-full sm:w-auto"
            >
              Find Your Decision-Speed Baseline
            </Button>
            <Button 
              variant="outline" 
              href="/book/consultation"
              className="w-full sm:w-auto"
            >
              Schedule Performance Consultation
            </Button>
            <Button 
              variant="outline" 
              href="https://arescertification.com/"
              className="w-full sm:w-auto border-[var(--color-ares-purple)] text-[var(--color-ares-purple)] hover:bg-[var(--color-ares-purple)] hover:text-white"
            >
              Professional Certification
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </SectionReveal>
  );
}
