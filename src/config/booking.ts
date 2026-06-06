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
      name: "Carmel HQ 1",
      description: "Our primary performance facility equipped with the complete A.R.E.S. technology stack.",
      address: "510 W. Carmel Dr. Carmel, IN 46032",
      servicesOffered: ["evaluation", "training", "re-evaluation", "consultation"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/AresOffice1@areselitesportsvision.com/",
      badge: "Flagship Facility"
    },
    {
      id: "office2",
      name: "Carmel HQ 2",
      description: "Our secondary performance suite located within the Carmel HQ facility.",
      address: "510 W. Carmel Dr. Carmel, IN 46032",
      servicesOffered: ["evaluation", "training", "consultation"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/AresOffice2@areselitesportsvision.com/"
    },
    {
      id: "ganassi",
      name: "Ganassi Performance Center",
      description: "Exclusive facility dedicated to motorsport athletes and high-speed cognitive conditioning.",
      address: "",
      servicesOffered: ["evaluation", "training"],
      // References the URL above
      bookingUrl: "https://outlook.office.com/book/GanassiTrainingFacility@areselitesportsvision.com/",
      badge: "Motorsport Exclusive"
    }
  ] as OfficeLocation[],

  faq: [
    {
      question: "Do you accept insurance?",
      answer: "Ares Elite Sports Vision operates as an out-of-network provider. We do not directly bill insurance companies. However, upon request, we can provide you with a superbill containing the necessary diagnostic and procedure codes, which you may submit to your insurance provider for potential out-of-network reimbursement. Please note that coverage varies significantly by provider and plan, and we cannot guarantee reimbursement."
    },
    {
      question: "How do I pay for my session?",
      answer: "Ares Elite Sports Vision requires pre-payment to secure your reservation on our calendar. After selecting your location and service type, you will be redirected to a secure Stripe checkout. Once payment is confirmed, the scheduling calendar will unlock for you to select your time slot."
    },
    {
      question: "How much does an evaluation or training session cost?",
      answer: "Our initial Performance Evaluation is a comprehensive 75-minute assessment ($449). Ongoing neuro-performance training is available in specialized packages and monthly memberships exclusively for active clients."
    },
    {
      question: "Which office should I book at?",
      answer: "Choose the location most convenient for you. Our Carmel HQ offers our complete suite of services, while Ganassi is specialized for motorsport athletes."
    },
    {
      question: "What is the difference between evaluation and training?",
      answer: "An evaluation is a comprehensive 75-minute baseline assessment required for all new clients. Training sessions are for active clients executing their custom protocols."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule directly through the confirmation email you receive after booking, up to 24 hours before your session."
    },
    {
      question: "What if I am not sure which service I need?",
      answer: "If you are a new client, always start with a Performance Evaluation or a Consultation. If you are an active client, select Training Session."
    }
  ],

  support: {
    phone: "+1 (773) 981-1447",
    email: "drl@areselitesportsvision.com"
  }
};
