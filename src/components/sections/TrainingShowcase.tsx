import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

export function TrainingShowcase() {
  return (
    <SectionReveal id="training-showcase" className="py-20 sm:py-32 relative bg-[var(--color-ares-charcoal)] border-t border-[var(--color-ares-border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">Inside The Lab</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              NEURAL ADAPTATION IN PRACTICE
            </h3>
            <p className="text-lg text-white/60 leading-relaxed text-balance">
              Take a look inside real A.R.E.S. sessions. We use cognitive loading, reactive tech, and VR tools to force adaptation at the speed of competitive sports.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ScrollReveal direction="up" distance={30} speed={1.0}>
            <div className="rounded-2xl border border-[var(--color-ares-border)] overflow-hidden bg-[#0B0F2A] relative group h-[450px]">
              <video 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/Office 6.jpg"
              >
                <source src="/cam-fl-6.mov" type="video/mp4" />
                <source src="/cam-fl-6.mov" type="video/quicktime" />
              </video>
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0B0F2A] via-[#0B0F2A]/90 to-transparent flex flex-col justify-end p-6 group-hover:from-black/90 transition-colors duration-500">
                <div className="text-[10px] text-[var(--color-ares-teal)] font-mono tracking-widest uppercase mb-1 drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Reactive Protocol</div>
                <div className="text-white font-bold tracking-tight text-xl drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Peripheral Execution</div>
                <p className="text-white/80 text-sm mt-3 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-75">Processing multi-point data arrays to expand the usable visual field during dynamic movement.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} speed={1.1}>
            <div className="rounded-2xl border border-[var(--color-ares-border)] overflow-hidden bg-[#0B0F2A] relative group h-[450px]">
              <video 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/Office 2.jpg"
              >
                <source src="/ryan-fl-2.mov" type="video/mp4" />
                <source src="/ryan-fl-2.mov" type="video/quicktime" />
              </video>
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0B0F2A] via-[#0B0F2A]/90 to-transparent flex flex-col justify-end p-6 group-hover:from-black/90 transition-colors duration-500">
                 <div className="text-[10px] text-[var(--color-ares-purple)] font-mono tracking-widest uppercase mb-1 drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Decision Speed</div>
                 <div className="text-white font-bold tracking-tight text-xl drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Multi-Target Coordination</div>
                 <p className="text-white/80 text-sm mt-3 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-75">High-tension neural loading to force quicker, more accurate decision making under pressure.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} speed={1.2}>
            <div className="rounded-2xl border border-[var(--color-ares-border)] overflow-hidden bg-[#0B0F2A] relative group h-[450px]">
              <video 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/Office 7.jpg"
              >
                <source src="/ryan-vr.mov" type="video/mp4" />
                <source src="/ryan-vr.mov" type="video/quicktime" />
              </video>
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0B0F2A] via-[#0B0F2A]/90 to-transparent flex flex-col justify-end p-6 group-hover:from-black/90 transition-colors duration-500">
                 <div className="text-[10px] text-white/70 font-mono tracking-widest uppercase mb-1 drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Virtual Reality</div>
                 <div className="text-white font-bold tracking-tight text-xl drop-shadow-md translate-y-6 group-hover:translate-y-0 transition-transform duration-500">Cognitive Processing</div>
                 <p className="text-white/80 text-sm mt-3 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-75">Immersive game-speed simulations to rewire motor output responses to specific visual cues.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
