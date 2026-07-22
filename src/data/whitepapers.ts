export interface WhitePaper {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Case Study' | 'White Paper';
  type: string;
  date: string;
  author: string;
  location: string;
  summary: string;
  coverMetrics: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  athleteProfile?: {
    name: string;
    discipline: string;
    program: string;
  };
  keyFindings: {
    label: string;
    metric: string;
    change: string;
    description: string;
  }[];
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    metricsTable?: {
      metric: string;
      baseline: string;
      final: string;
      improvement: string;
    }[];
    highlights?: string[];
  }[];
  callToAction: {
    title: string;
    text: string;
    buttonText: string;
    link: string;
  };
}

export const whitePapers: WhitePaper[] = [
  {
    id: 'noah-west-case-study',
    slug: 'noah-west-case-study',
    title: 'The Critical Role of Vision Training in Athletic Performance',
    subtitle: 'A comprehensive case study of Noah West — a collegiate ice hockey goalie — over a five-year targeted training program.',
    category: 'Case Study',
    type: 'Longitudinal Case Study (2019 – 2024)',
    date: 'May 2024',
    author: 'Dr. Joseph LaPlaca, OD',
    location: 'Carmel / Indianapolis, IN',
    summary: "This 5-year longitudinal case study analyzes the transformative role advanced vision and sensory training played in collegiate ice hockey goalie Noah West's development. By pairing VR training, FitLight reactive drills, and Senaptec Sensory Station protocols, Noah progressed from 11th percentile baseline quickness to top 98th percentile elite status comparable to Formula 1 drivers and pro athletes.",
    athleteProfile: {
      name: 'Noah West',
      discipline: 'Ice Hockey Goalie',
      program: '2019 – 2024 (5-Year Program)'
    },
    coverMetrics: [
      { label: 'Near-Far Quickness', value: '11th → 98th', sublabel: 'Percentile Jump' },
      { label: 'Response Time', value: '299ms → 210ms', sublabel: 'Reaction Latency' },
      { label: 'Final Status', value: 'Elite', sublabel: 'May 2024 Confirmation' }
    ],
    keyFindings: [
      {
        label: 'Near-Far Quickness',
        metric: '98 Score (99%)',
        change: '11th to 98th',
        description: 'Placed alongside the world\'s best athletes — comparable to elite Formula 1 drivers.'
      },
      {
        label: 'Reaction Response Latency',
        metric: '210ms',
        change: '-89ms Reduction',
        description: 'FitLight light-based reactive stimulus response decreased from 560ms to 210ms.'
      },
      {
        label: 'Visual Acuity',
        metric: '20/13',
        change: '32nd %ile → 20/13',
        description: 'Super-normal visual sharpness exceeding standard 20/20 vision thresholds.'
      },
      {
        label: 'Overall Sensory Score',
        metric: '85 Overall',
        change: 'Pro Category',
        description: 'Surpassed benchmarks of professional athletes across multiple sports disciplines.'
      }
    ],
    sections: [
      {
        heading: 'Initial Evaluation · August 6, 2019',
        subheading: 'The Starting Point',
        content: [
          "Noah West's initial baseline evaluation revealed several key visual and sensory deficits — critical areas to address for an elite ice hockey goalie, where microsecond visual processing speed dictates performance under fire.",
          'Initial diagnostic baseline metrics recorded in August 2019:'
        ],
        metricsTable: [
          { metric: 'Visual Acuity', baseline: '32nd Percentile', final: '20/13 Snellen', improvement: 'Super-normal clarity' },
          { metric: 'Contrast Sensitivity', baseline: '13th Percentile', final: '96th Percentile', improvement: '+83 percentile points' },
          { metric: 'Depth Perception', baseline: '11th Percentile', final: 'Elite Grade', improvement: 'Precise puck tracking' },
          { metric: 'Perception Span', baseline: '45th Percentile', final: '98th Percentile', improvement: '+53 percentile points' },
          { metric: 'Reaction Time', baseline: '299ms', final: '210ms', improvement: '89ms faster response' }
        ]
      },
      {
        heading: 'The Vision Training Journey',
        subheading: 'Three Systems, One Goal',
        content: [
          'A multi-modal program targeted every deficit over a five-year period — pairing immersive cognitive load with high-speed reactive drills and precision sensory measurement:'
        ],
        highlights: [
          'VR Training: Immersive environments challenging visual processing speed, hand-eye coordination, and cognitive decision-making under intense pressure. Synth Riders Score surged from 1,425,872 to 2,326,078 (+63%).',
          'FitLight Training: Drills demanding rapid visual target acquisition and motor response to light stimuli under strict millisecond time constraints. Response time improved from 520–560ms down to 210ms.',
          'Senaptec Sensory Station: Tablet and station-based drills processing complex multi-object visual data with high precision. Perception span improved from 0.714 to 0.805.'
        ]
      },
      {
        heading: 'Re-Evaluations & Longitudinal Trajectory',
        subheading: 'Progress Over Time (2022 – 2024)',
        content: [
          'Progressive re-evaluations tracked Noah\'s steady climb into elite ranks:'
        ],
        highlights: [
          'July 21, 2022: Near-Far Quickness reached 99%, Perception Span 97%, Reaction Time 88%, Contrast Sensitivity 34%.',
          'April 18, 2023: Overall Sensory Score reached 85 (Pro/Elite category), Contrast Sensitivity 96%, Perception Span 98%, Reaction Time 93%.',
          'May 8, 2024 (Elite Status Confirmed): Visual Acuity 20/13, Near-Far Quickness 98, Multi-Object Tracking 88, Overall Score 85.'
        ]
      },
      {
        heading: 'Comparative Analysis & Conclusion',
        subheading: 'Benchmarking Against Pro Athletes',
        content: [
          "Noah's performance metrics were benchmarked against professional athlete cohorts across major sports — including NFL running backs, MLB third basemen, and Formula 1 drivers.",
          "His near-far quickness (score 98) placed him alongside elite Formula 1 drivers, while his multi-object tracking (score 88) matched top-tier athletes managing multiple fast-moving objects simultaneously.",
          "Noah West's 5-year journey underscores the critical role of structured vision training. Consistent improvements across every key metric demonstrate how targeted neuro-vision protocols prepare athletes for game-day dominance under pressure."
        ]
      }
    ],
    callToAction: {
      title: 'Elevate Your Visual Processing Speed',
      text: 'Schedule your comprehensive Sports Vision Evaluation at our Carmel Clinic or discuss custom team integration.',
      buttonText: 'Book Evaluation ($449)',
      link: '/book/evaluation'
    }
  },
  {
    id: 'andretti-training-program-white-paper',
    slug: 'andretti-training-program-white-paper',
    title: 'The Case for Vision Training',
    subtitle: 'How targeted neurocognitive vision training produced measurable gains in reaction time, decision-making, and on-field performance in the Andretti Training Program — and why your team should integrate it next.',
    category: 'White Paper',
    type: 'Organizational Trial & Cohort Study',
    date: '2024',
    author: 'Dr. Joseph LaPlaca, OD',
    location: 'Ares Elite Sports Vision (Carmel / Indianapolis, IN)',
    summary: 'In elite sport, the margin between winning and losing is measured in milliseconds. The Andretti Training Program put vision training to the test across three independent assessment platforms (Neurotrainer, Senaptec Sensory Station, PsychLab 101). Results demonstrated up to 27% faster reaction times, 24.57% better multiple-object tracking, and a 22.14% increase in overall sensory-motor performance.',
    coverMetrics: [
      { label: 'Simple Reaction Time', value: '+27%', sublabel: 'Faster Response (PsychLab)' },
      { label: 'Multi-Object Tracking', value: '+24.57%', sublabel: 'Perception Testing' },
      { label: 'Sensory-Motor Score', value: '+22.14%', sublabel: 'Higher Overall (Senaptec)' }
    ],
    keyFindings: [
      {
        label: 'Simple Reaction Time',
        metric: '27.00%',
        change: 'PsychLab 101',
        description: 'Significant reduction in the latency gap between visual stimulus and motor execution.'
      },
      {
        label: 'Multiple Object Tracking',
        metric: '24.57%',
        change: 'Perception Testing',
        description: 'Dramatically enhanced capacity to track multiple moving targets in dynamic space.'
      },
      {
        label: 'Overall Response Speed',
        metric: '24.22%',
        change: 'Senaptec Station',
        description: 'Faster combined visual intake, decision routing, and physical touch output.'
      },
      {
        label: 'Overall Sensory-Motor',
        metric: '22.14%',
        change: 'Senaptec Station',
        description: 'Composite score elevation across visual acuity, contrast, depth, and coordination.'
      }
    ],
    sections: [
      {
        heading: 'Executive Summary',
        subheading: 'The Edge Between Victory & Defeat',
        content: [
          'In elite motorsport and high-speed athletics, the margin between winning and losing is measured in milliseconds. Vision training — targeted development of how the brain takes in, processes, and acts on visual information — is one of the most powerful and underused tools for finding that margin.',
          'The Andretti Training Program, conducted by Ares Elite Sports Vision, put that premise to the test. Across three independent assessment platforms, participants posted significant, measurable improvements in the neurocognitive and visual metrics that drive athletic performance.'
        ],
        highlights: [
          'Athletes reacted up to 27% faster to simple visual stimuli.',
          'Processed complex visual information over 5% faster.',
          'Cut decision-making time by more than 6% under pressure.'
        ]
      },
      {
        heading: 'Proven in Testing · Platform Breakdown',
        subheading: 'Multi-Platform Objective Validation',
        content: [
          'Participants were assessed across three independent platforms — measuring the full neural chain from visual intake to motor response:'
        ],
        metricsTable: [
          { metric: 'Simple Reaction Time (PsychLab 101)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+27.00% Faster' },
          { metric: 'Multiple Object Tracking (Perception)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+24.57% Gain' },
          { metric: 'Response Speed (Senaptec Station)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+24.22% Faster' },
          { metric: 'Overall Sensory-Motor Score (Senaptec)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+22.14% Higher' },
          { metric: 'Choice Reaction Time (PsychLab 101)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+18.14% Faster' },
          { metric: 'Raw Reaction Time (Neurotrainer)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+12.00% Reduction' },
          { metric: 'Perception Span (Perception Testing)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+11.29% Expansion' },
          { metric: 'Choice Reaction Time - Left (Neurotrainer)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+7.46% Faster' },
          { metric: 'Visual Processing Speed (Neurotrainer)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+5.13% Faster' },
          { metric: 'Overall Accuracy (Senaptec Station)', baseline: 'Pre-Training', final: 'Post-Training', improvement: '+3.52% Higher' }
        ]
      },
      {
        heading: 'Participant Feedback & Retention',
        subheading: 'Subjective & Operational Impact',
        content: [
          'The data was corroborated by high participant satisfaction and strong operational engagement:'
        ],
        highlights: [
          '8–10 / 10 Satisfaction: Consistent high ratings across all participants regarding clear perceived value on the track and field.',
          'Strong Retention: Athletes expressed a unanimous desire to continue training beyond the initial trial block.',
          'Responsive Support: High marks for team communication, seamless scheduling, and clinical collaboration.'
        ]
      },
      {
        heading: 'The Case for Integration',
        subheading: 'Why Your Team Should Train Vision Next',
        content: [
          '1. Competitive Advantage: Vision training sharpens individual skills and elevates team dynamics — players become more in tune with each other\'s movements.',
          '2. Return on Investment: The gains documented here translate directly to on-track, on-field, and on-court victories.',
          '3. Future-Ready Team: As games get faster, the ability to process information swiftly becomes the primary competitive separator.',
          '4. Proven Blueprint: The Andretti Training Program shows how vision training integrates seamlessly into existing regimens.'
        ]
      }
    ],
    callToAction: {
      title: 'Integrate Vision Training into Your Organization',
      text: 'Schedule an institutional consultation with Dr. Joseph LaPlaca to design a custom program for your facility, team, or university.',
      buttonText: 'Schedule Team Consultation',
      link: '/teams-and-organizations'
    }
  }
];
