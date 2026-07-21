import { motion } from 'framer-motion';
import { Eye, Clock, Activity } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { variants } from '../../config/motion';

const problems = [
  {
    icon: Eye,
    title: "The 20/20 Optical Illusion",
    description: "You can have perfect 20/20 eyesight and still react late. A standard eye exam only checks static optical clarity while sitting in a dark room. Ares measures how fast your brain processes visual data under stress to identify the latency you aren't aware of."
  },
  {
    icon: Clock,
    title: "Late Reads Are Upstream Gaps",
    description: "Late reactions, missed gaps, and post-error lag are rarely mechanical issues—they are visual processing bottlenecks. Physical conditioning cannot fix a delayed signal. We isolate and train the exact neural path to make reads automatic."
  },
  {
    icon: Activity,
    title: "Even the Best Have Latency",
    description: "Elite athletes might feel their visual system is functioning perfectly, but milliseconds decide podiums. We help the best of the best identify hidden visual fatigue points, replacing random drills with targeted training built around your actual data."
  }
];

export function ProblemSection() {
  return (
    <SectionReveal id="problem" className="pt-24 pb-24 md:pt-32 md:pb-32 relative bg-[var(--color-ares-dark-purple)]" style={{ clipPath: 'polygon(0 4vw, 100% 0, 100% 100%, 0 100%)' }}>
      {/* Parallax Background Elements */}
      <ScrollReveal direction="down" distance={150} speed={0.5} className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--color-ares-purple)] rounded-full mix-blend-screen filter blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--color-ares-teal)] rounded-full mix-blend-screen filter blur-[60px] sm:blur-[100px]" />
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">EXECUTION PROBLEMS OFTEN START UPSTREAM.</h2>
            <div className="h-1 w-16 sm:w-20 bg-[var(--color-ares-purple)] mx-auto rounded-full"></div>
            <p className="mt-6 md:mt-8 text-base md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed text-balance">
              If the input is late, incomplete, or misread, the output will suffer. Here is why regular eye exams are not enough.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 md:perspective-1000 mb-12">
          {problems.map((problem, index) => (
            <ScrollReveal 
              key={index}
              direction="up" 
              distance={40 + (index * 20)} 
              speed={1.2}
              rotate={index === 1 ? 1 : -1} // Reduced rotation for better mobile fit
              className="h-full"
            >
              <motion.div
                variants={variants.origamiReveal}
                className="bg-[var(--color-ares-charcoal)] p-6 sm:p-10 rounded-xl border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/50 transition-all duration-500 group h-full flex flex-col"
              >
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[var(--color-ares-purple)]/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-ares-purple)] transition-all duration-500 shadow-lg shadow-black/20">
                  <problem.icon className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-ares-teal)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">{problem.title}</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                  {problem.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Parent & Athlete Plain-Language Callout */}
        <ScrollReveal direction="up" distance={30}>
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-teal)]/30 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-2xl">
            <div className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-[0.2em] font-bold mb-2">
              The Plain-Language Guarantee
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-3">
              What Does This Mean For Your Performance?
            </h4>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              "In a 75-minute Performance Evaluation, we answer two simple questions for parents and athletes:<br />
              <strong className="text-[var(--color-ares-teal)] font-bold">1. Where are you losing milliseconds on the field?</strong><br />
              <strong className="text-white font-bold">2. Exactly how do we train your visual processing system to get them back?</strong>"
            </p>
          </div>
        </ScrollReveal>
      </div>
    </SectionReveal>
  );
}
