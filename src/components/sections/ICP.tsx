import { motion } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { variants } from '../../config/motion';

export function ICPSection() {
  return (
    <SectionReveal className="py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={20} speed={0.8}>
          <div className="mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">WHO WE SERVE</h2>
            <div className="h-px w-full bg-white/10"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Tier 1 */}
          <ScrollReveal direction="up" distance={40} speed={1.1} className="h-full">
            <motion.div variants={variants.cardReveal} className="h-full flex flex-col">
              <div className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs mb-4 font-bold tracking-[0.2em] uppercase">TIER 1</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">Elite & Professional</h3>
              <ul className="space-y-4 text-white/80 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>IndyCar, INDYNXT, NHRA</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>NFL, NHL, AHL, USHL</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Professional Basketball & NBA Officials</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Olympians</li>
              </ul>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed font-light text-balance">
                For those where 0.1s is the difference between winning and losing. We provide the infrastructure to close that gap.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Tier 2 */}
          <ScrollReveal direction="up" distance={40} speed={1.3} className="h-full">
            <motion.div variants={variants.cardReveal} className="h-full flex flex-col">
              <div className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs mb-4 font-bold tracking-[0.2em] uppercase">TIER 2</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">Developmental</h3>
              <ul className="space-y-4 text-white/80 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>D1 Collegiate Athletes</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Ambitious Youth</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Performance Facilities</li>
              </ul>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed font-light text-balance">
                Building the foundation before bad habits set in. Data-driven progression for the next generation of elites.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Tier 3 */}
          <ScrollReveal direction="up" distance={40} speed={1.5} className="h-full">
            <motion.div variants={variants.cardReveal} className="h-full flex flex-col">
              <div className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs mb-4 font-bold tracking-[0.2em] uppercase">TIER 3</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">Clinical & Medical</h3>
              <ul className="space-y-4 text-white/80 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Optometrists</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Neurologists</li>
                <li className="flex items-center gap-3 text-sm sm:text-base"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Rehab Specialists</li>
              </ul>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed font-light text-balance">
                Modernize your practice. Move beyond static 20/20 charts and offer measurable neuro-performance therapies.
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
