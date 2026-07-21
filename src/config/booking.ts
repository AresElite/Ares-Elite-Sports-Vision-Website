export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  price?: number;
}

export interface OfficeLocation {
  id: string;
  name: string;
  description: string;
  address: string;
  servicesOffered: string[];
  bookingUrl: string;
  badge?: string;
}

export const BOOKING_CONFIG = {
  // ============================================================================
  // MICROSOFT BOOKINGS URLS
  // Paste your 3 Microsoft Bookings shared page URLs here.
  // These are the single source of truth for the iframe embeds.
  // ============================================================================
  urls: {
    office1: "https://outlook.office.com/book/AresOffice1@areselitesportsvision.com/",
    office2: "https://outlook.office.com/book/AresOffice2@areselitesportsvision.com/",
    ganassi: "https://outlook.office.com/book/GanassiTrainingFacility@areselitesportsvision.com/",
  },
  
  services: [
    {
      id: "evaluation",
      name: "Performance Evaluation",
      description: "Comprehensive 75-minute baseline assessment of your visual-cognitive profile.",
      price: 449
    },
    {
      id: "training",
      name: "Training Session",
      description: "45-minute training session for active clients."
    },
    {
      id: "re-evaluation",
      name: "Re-Evaluation",
      description: "Follow-up assessment to measure progress and adjust training protocols.",
      price: 299
    },
    {
      id: "consultation",
      name: "Consultation",
      description: "Discuss your goals and see if the A.R.E.S. system is right for you."
    }
  ] as ServiceCategory[],

  offices: [
    {
      id: "office1",
      name: "Carmel Headquarters (Main Evaluation Suite)",
      description: "Our primary flagship evaluation suite located on the 2nd Floor inside Elemental Fitness, equipped with the complete A.R.E.S. technology stack.",
      address: "510 W. Carmel Dr., 2nd Floor (Inside Elemental Fitness), Carmel, IN 46032",
      servicesOffered: ["evaluation", "training", "re-evaluation", "consultation"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/AresOffice1@areselitesportsvision.com/",
      badge: "Flagship Facility"
    },
    {
      id: "office2",
      name: "Carmel Headquarters (Performance Suite 2)",
      description: "Our secondary performance suite located within the Carmel HQ facility on the 2nd Floor of Elemental Fitness.",
      address: "510 W. Carmel Dr., 2nd Floor (Inside Elemental Fitness), Carmel, IN 46032",
      servicesOffered: ["evaluation", "training", "consultation"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/AresOffice2@areselitesportsvision.com/"
    },
    {
      id: "ganassi",
      name: "Ganassi Performance Center",
      description: "Exclusive facility dedicated to motorsport athletes and high-speed cognitive conditioning.",
      address: "Carmel, IN",
      servicesOffered: ["evaluation", "training"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/GanassiTrainingFacility@areselitesportsvision.com/",
      badge: "Motorsport Exclusive"
    }
  ] as OfficeLocation[],

  faq: [
    {
      question: "Do you accept insurance?",
      answer: "Ares Elite Sports Vision operates on a direct self-pay model to deliver uncompromised 1-on-1 visual-neurocognitive care. While we are an out-of-network provider and do not bill insurance directly, we provide an itemized Superbill upon request. This document contains all standard diagnostic (CPT) and procedure codes for you to submit to your insurance carrier for potential out-of-network reimbursement."
    },
    {
      question: "How do I pay for my session?",
      answer: "Payment is completed securely online via credit card or Stripe when scheduling your evaluation or training package. Your reservation is immediately confirmed on our calendar."
    },
    {
      question: "How much does an evaluation or training session cost?",
      answer: "Our initial Performance Evaluation is a comprehensive 75-minute diagnostic baseline ($449), which includes full telemetry reporting, visual latency profiling, and your personalized training protocol. Follow-up re-evaluations are $299, and ongoing training is available via active client packages."
    },
    {
      question: "Which suite or office should I book at?",
      answer: "Both the Main Evaluation Suite and Performance Suite 2 are located inside our primary Carmel HQ facility (510 W. Carmel Dr., 2nd Floor inside Elemental Fitness). Both suites feature identical A.R.E.S. diagnostic stack technology—choose whichever open time slot fits your schedule."
    },
    {
      question: "What is the difference between an evaluation and training?",
      answer: "An evaluation is a 75-minute baseline diagnostic required for all new clients to identify visual latency bottlenecks. Training sessions are ongoing 45-minute protocols for active clients executing custom progressions."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule directly through the confirmation email you receive after booking, up to 24 hours before your session."
    },
    {
      question: "What if I am not sure which service I need?",
      answer: "If you are a new client, always start with a Performance Evaluation or a Consultation. If you are an active client, select Training Session or Re-Evaluation."
    }
  ],

  support: {
    phone: "+1 (773) 981-1447",
    email: "drl@areselitesportsvision.com"
  }
};
