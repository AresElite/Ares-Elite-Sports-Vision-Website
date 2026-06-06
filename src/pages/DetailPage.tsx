import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Cpu, Zap, RefreshCw, Database, Glasses, Activity, PenTool } from 'lucide-react';
import { SectionReveal } from '../components/ui/SectionReveal';
import { Button } from '../components/ui/Button';
import { System3DModel } from '../components/canvas/System3DModel';
import { VideoEmbed } from '../components/ui/VideoEmbed';

const pageData: Record<string, any> = {
  'emr-infrastructure': {
    title: 'EMR Infrastructure',
    subtitle: 'Secure, Scalable Data Management',
    icon: Database,
    color: 'var(--color-ares-teal)',
    description: 'Our proprietary Electronic Medical Record (EMR) infrastructure is built specifically for neuro-performance data. It handles high-frequency telemetry, longitudinal tracking, and secure sharing across your organization.',
    features: [
      'HIPAA compliant data storage and transmission',
      'Real-time synchronization across all A.R.E.S. devices',
      'Advanced analytics and trend visualization',
      'Customizable reporting for athletes, coaches, and medical staff'
    ]
  },
  'vr-training-protocols': {
    title: 'VR Training Protocols',
    subtitle: 'Immersive Cognitive Load Testing',
    icon: Glasses,
    color: 'var(--color-ares-purple)',
    description: 'We are building a VR Suite of drills to address and measure a wide variety of visual and cognitive portions. We are currently using the most advanced technology in the space as we develop even more advanced proprietary technology.',
    features: [
      'Measurement of a wide variety of visual and cognitive portions',
      'Utilizing the most advanced current technology',
      'Continuous development of proprietary VR solutions',
      'Immersive environments for cognitive load testing'
    ]
  },
  'performance-suite': {
    title: 'Performance Suite',
    subtitle: 'Data-Driven Athlete Progression',
    icon: Activity,
    color: 'var(--color-ares-teal)',
    description: 'The A.R.E.S. Performance Suite was built by Dr. LaPlaca personally. All levels, progressions, variations, and difficulty progressions have been tested over multiple months with current clients to ensure maximal function and sport transfer.',
    features: [
      '25+ drills, each with pre-built levels ranging from 50 to over 400+',
      'Scores and metrics analyzed against all currently training athletes',
      'Progress is moved forward by the trainer/doctor based on customized plans',
      'Future roadmap includes third-party biometric sensor integration'
    ]
  },
  'standardized-drill-progression': {
    title: 'Standardized Drill Progression',
    subtitle: 'Rigid Leveling for Standardized Metrics',
    icon: PenTool,
    color: 'var(--color-ares-purple)',
    description: 'We do not use random or custom drill architectures. Instead, we employ a rigid drill leveling and progression system. This allows us to establish standardized metrics to ensure maximal efficiency in moving the athlete forward or backward based on their personal results.',
    features: [
      'Rigid, scientifically validated drill leveling',
      'Standardized metrics for accurate performance tracking',
      'Data-driven progression and regression protocols',
      'Maximal efficiency in athletic development'
    ]
  },
  'concussion-baselining': {
    title: 'Concussion Baselining & Rehab',
    subtitle: 'The Future of Return to Play',
    icon: Activity,
    color: 'var(--color-ares-teal)',
    description: 'Our evaluation is the most extensive concussion baselining available. We utilize current, up-to-date research regarding concussions and vision as it relates to return to play. Our tracking exceeds traditional evaluation methods, giving us exact data points to look back to. Our rehab is not traditional vision therapy—we are the future of concussion return to play, tracking, and actually knowing when you\'re ready.',
    features: [
      'Extensive preseason, in-season, and off-season baselining',
      'Brought players out of concussion-induced retirement',
      'Restored athlete confidence before major events like the Indy500',
      'Objective tracking to know exactly when an athlete is ready to return'
    ]
  },
  'acquire': {
    title: 'Acquire',
    subtitle: 'Visual Intake Optimization',
    icon: Eye,
    color: 'var(--color-ares-teal)',
    bodyParts: 'Eyes (Cornea, Lens, Retina), Extraocular Muscles, Optic Nerve',
    description: 'The foundation of elite performance begins at the point of contact: the eyes. We don\'t just test visual acuity; we evaluate the mechanical and neurological efficiency of visual intake. By isolating the \'Acquire\' phase, we pinpoint micro-deficits in ocular anatomy, tear film stability, and dynamic tracking before the signal even reaches the brain. If the input is flawed, the output will be compromised.',
    microLevelBenefit: 'Breaking down the Acquire phase allows us to isolate mechanical eye movements from cognitive processing. If an athlete is reacting slowly, we must first prove they are actually seeing the target clearly and quickly. Fixing a micro-level tracking issue here prevents a cascading failure in the rest of the system.',
    videoUrl: 'https://www.youtube.com/embed/zQBbjcd_Thw?list=PLgEsz5kTYEAYIwRDEMmmtsX6yuU-dwNEW&index=38',
    features: [
      'Dynamic visual acuity assessment',
      'Contrast sensitivity profiling',
      'Oculomotor tracking and saccadic speed analysis',
      'Peripheral awareness expansion'
    ]
  },
  'route': {
    title: 'Route',
    subtitle: 'Neural Pathway Efficiency',
    icon: Cpu,
    color: 'var(--color-ares-purple)',
    bodyParts: 'Visual Cortex, Neural Pathways, Frontal Lobe (Decision Making Centers)',
    description: 'Once visual data is acquired, it must be transmitted and processed. The \'Route\' phase maps the speed and efficiency of neural transmission from the retina to the visual cortex and into the decision-making centers. We identify cognitive bottlenecks—whether it\'s signal-to-noise ratio issues or delayed cortical processing—and train the brain to route information with zero latency.',
    microLevelBenefit: 'By isolating the Route phase, we can determine if a delayed reaction is a physical limitation or a cognitive processing delay. Understanding this micro-level neural transmission allows us to train the brain to process complex visual scenes faster, turning conscious deliberation into subconscious reflex.',
    videoUrl: 'https://www.youtube.com/embed/KeSjv7izzOE?list=PLgEsz5kTYEAYIwRDEMmmtsX6yuU-dwNEW&index=37',
    features: [
      'Cortical processing speed measurement',
      'Signal-to-noise ratio optimization',
      'Pattern recognition and anticipation training',
      'Cognitive load management'
    ]
  },
  'execute': {
    title: 'Execute',
    subtitle: 'Precision Motor Output',
    icon: Zap,
    color: 'var(--color-ares-teal)',
    bodyParts: 'Motor Cortex, Peripheral Nervous System, Musculoskeletal System (Hands, Feet, Core)',
    description: 'Perception without action is useless. The \'Execute\' phase bridges the gap between cognitive decision and physical movement. By isolating motor output, we measure the exact delay between the brain\'s command and the body\'s response. This analysis lets us strip away mechanical inefficiencies and optimize kinematic sequencing for explosive, precise reactions.',
    microLevelBenefit: 'Isolating the Execute phase reveals if the athlete is seeing and processing correctly but failing mechanically. By breaking this down, we can optimize the exact neuromuscular pathways required for the sport, ensuring the physical response perfectly matches the cognitive command.',
    videoUrl: 'https://www.youtube.com/embed/ESVlPbINir4?list=PLgEsz5kTYEAYIwRDEMmmtsX6yuU-dwNEW&index=36',
    features: [
      'Reaction time isolation and improvement',
      'Hand-eye and foot-eye coordination refinement',
      'Motor inhibition and impulse control',
      'Kinematic sequencing optimization'
    ]
  },
  'synchronize': {
    title: 'Synchronize',
    subtitle: 'Full-Stack Integration',
    icon: RefreshCw,
    color: 'var(--color-ares-purple)',
    bodyParts: 'Central & Peripheral Nervous Systems, Oculomotor System, Musculoskeletal System',
    description: 'Peak performance is the seamless integration of the entire Human Operating System. The \'Synchronize\' phase stress-tests the complete loop—Acquire, Route, Execute—under extreme cognitive load and physical fatigue. By understanding the micro-components first, we now rebuild the macro-system, ensuring flawless performance when the pressure is highest.',
    microLevelBenefit: 'We cannot effectively synchronize a broken system. Because we have already optimized the micro-levels (Acquire, Route, Execute), the Synchronize phase allows us to safely overload the athlete. This reveals how the integrated systems hold up under fatigue, allowing us to build unbreakable neuro-endurance.',
    videoUrl: 'https://www.youtube.com/embed/cZmnq5He9mQ?list=PLgEsz5kTYEAYIwRDEMmmtsX6yuU-dwNEW&index=39',
    features: [
      'Dual-tasking and divided attention drills',
      'Fatigue resistance conditioning',
      'Stress inoculation training',
      'Game-speed scenario simulation'
    ]
  }
};

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const data = id ? pageData[id] : null;

  if (!data) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-ares-bg)] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <Button variant="outline" href="/">Return Home</Button>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  const getModelAnimation = (stage: string): any => {
    switch (stage) {
      case 'acquire':
        return {
          animate: {
            scale: [1, 1.01, 1],
            boxShadow: [
              "0px 0px 0px rgba(0, 210, 182, 0)",
              "0px 0px 30px rgba(0, 210, 182, 0.4)",
              "0px 0px 0px rgba(0, 210, 182, 0)"
            ]
          },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'route':
        return {
          animate: {
            y: [0, -8, 0],
            boxShadow: [
              "0px 0px 10px rgba(123, 97, 255, 0.1)",
              "0px 15px 35px rgba(123, 97, 255, 0.4)",
              "0px 0px 10px rgba(123, 97, 255, 0.1)"
            ]
          },
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case 'execute':
        return {
          animate: {
            scale: [1, 1.02, 1, 1.01, 1],
            boxShadow: [
              "0px 0px 0px rgba(0, 210, 182, 0)",
              "0px 0px 40px rgba(0, 210, 182, 0.5)",
              "0px 0px 0px rgba(0, 210, 182, 0)",
              "0px 0px 20px rgba(0, 210, 182, 0.3)",
              "0px 0px 0px rgba(0, 210, 182, 0)"
            ]
          },
          transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2.5, ease: "circOut" }
        };
      case 'synchronize':
        return {
          animate: {
            scale: [1, 1.015, 1],
            boxShadow: [
              "0px 0px 20px rgba(0, 210, 182, 0.3)",
              "0px 0px 50px rgba(123, 97, 255, 0.5)",
              "0px 0px 20px rgba(0, 210, 182, 0.3)"
            ]
          },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-ares-purple)]/5 transform skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-[var(--color-ares-teal)]/5 transform -skew-x-12 -translate-x-1/4" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] flex items-center justify-center shadow-glow" style={{ color: data.color }}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-mono tracking-widest uppercase mb-1" style={{ color: data.color }}>
                {data.subtitle}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {data.title}
              </h1>
            </div>
          </div>

          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 md:p-12 shadow-glow mb-12">
            {data.bodyParts && (
              <div className="mb-12">
                <motion.div 
                  className="rounded-2xl"
                  {...getModelAnimation(id!)}
                >
                  <System3DModel stage={id!} />
                </motion.div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-[var(--color-ares-border)] rounded-2xl p-6">
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white/50 mb-3">Targeted Systems</h3>
                    <p className="text-white/90 font-medium leading-relaxed">
                      {data.bodyParts}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-[var(--color-ares-border)] rounded-2xl p-6">
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white/50 mb-3">Micro-Level Analysis</h3>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {data.microLevelBenefit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xl text-white/80 leading-relaxed mb-12">
              {data.description}
            </p>

            {data.videoUrl && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6">Platform in Action</h3>
                <VideoEmbed src={data.videoUrl} title={`${data.title} Demonstration`} />
              </div>
            )}

            <h3 className="text-2xl font-bold mb-6">Key Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-[var(--color-ares-border)]">
                  <div className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                  <p className="text-white/70">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" href="/book/consultation">
              Book Discovery Call
            </Button>
            {['acquire', 'route', 'execute', 'synchronize'].includes(id!) && (
              <Button variant="outline" href="/book/evaluation">
                Schedule Evaluation
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
