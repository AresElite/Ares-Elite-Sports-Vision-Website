import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Glasses, Database, Server } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { variants } from '../../config/motion';
import { VideoEmbed } from '../ui/VideoEmbed';

export function TechSection() {
  return (
    <SectionReveal id="technology" className="pt-20 pb-32 sm:pt-32 sm:pb-40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 sm:mb-24">
          <ScrollReveal direction="left" distance={30} speed={0.8}>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight text-balance">OBJECTIVE DATA. NOT GUESSWORK.</h2>
              <p className="text-white/60 text-lg sm:text-xl leading-relaxed mx-auto lg:mx-0 text-balance max-w-2xl">
                If something affects performance, it should be measured, tracked, and communicated clearly. We built a custom EMR and tracking platform because athletes deserve more than opinions and vague notes. We measure what most programs miss. We track what others guess.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" distance={30} speed={0.8}>
            <div className="mx-auto w-full max-w-2xl lg:max-w-none">
              <VideoEmbed 
                src="https://www.youtube.com/embed/qdEmN0iYLq4?si=r7kK-W1VnQe5L7P1" 
                title="Importance of Analytics and Tracking Information for Athletes" 
              />
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <ScrollReveal direction="left" distance={40} speed={1.1} className="h-full">
            <motion.div variants={variants.cardReveal} className="bg-[var(--color-ares-charcoal)] rounded-xl border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/50 transition-all duration-500 group cursor-pointer overflow-hidden h-full">
              <Link to="/detail/emr-infrastructure" className="block p-8 sm:p-10 h-full flex flex-col">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[var(--color-ares-purple)]/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-ares-purple)] transition-all duration-500 shadow-lg">
                  <Database className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-ares-teal)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors tracking-tight">Custom EMR System</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                  A specialized platform built to document evaluations, track training results, and organize athlete data. Performance should not be based on assumptions.
                </p>
              </Link>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="right" distance={40} speed={1.2} className="h-full">
            <motion.div variants={variants.cardReveal} className="bg-[var(--color-ares-charcoal)] rounded-xl border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/50 transition-all duration-500 group cursor-pointer overflow-hidden h-full">
              <Link to="/detail/vr-training-protocols" className="block p-8 sm:p-10 h-full flex flex-col">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[var(--color-ares-purple)]/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-ares-purple)] transition-all duration-500 shadow-lg">
                  <Glasses className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-ares-teal)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors tracking-tight">Trainable Targets</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                  By tracking exact neuro-cognitive metrics through VR and reactive tech, we turn hidden weaknesses into structured, trainable progression targets.
                </p>
              </Link>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={40} speed={1.3} className="h-full">
            <motion.div variants={variants.cardReveal} className="bg-[var(--color-ares-charcoal)] rounded-xl border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/50 transition-all duration-500 group cursor-pointer overflow-hidden h-full">
              <Link to="/detail/performance-suite" className="block p-8 sm:p-10 h-full flex flex-col">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[var(--color-ares-purple)]/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-ares-purple)] transition-all duration-500 shadow-lg">
                  <Monitor className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-ares-teal)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors tracking-tight">Clear Communication</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                  Our dashboard translates complex visual and cognitive metrics into clear language that athletes, parents, and coaches can actually understand and use.
                </p>
              </Link>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="right" distance={40} speed={1.4} className="h-full">
            <motion.div variants={variants.cardReveal} className="bg-[var(--color-ares-charcoal)] rounded-xl border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/50 transition-all duration-500 group cursor-pointer overflow-hidden h-full">
              <Link to="/detail/standardized-drill-progression" className="block p-8 sm:p-10 h-full flex flex-col">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[var(--color-ares-purple)]/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-ares-purple)] transition-all duration-500 shadow-lg">
                  <Server className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-ares-teal)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors tracking-tight">Structured Progression</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                  We are not just running random drills. We use data to drive rigid drill leveling and progression, maximizing athletic capability without the guesswork.
                </p>
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
