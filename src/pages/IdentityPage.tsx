import { SEO } from '../components/SEO';
import { MissionVisionSection } from '../components/sections/MissionVision';

export function IdentityPage() {
  return (
    <>
      <SEO 
        title="Who We Are | Ares Elite Sports Vision"
        description="Our mission, vision, and core values: improving performance through the A.R.E.S. Performance Loop™."
        path="/identity"
      />
      <div className="pt-32 min-h-dvh flex flex-col pb-32 bg-[var(--color-ares-bg)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-ares-teal)]/5 rounded-full blur-[120px] pointer-events-none" />
        <MissionVisionSection />
      </div>
    </>
  );
}
