import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import cron from "node-cron";
import { Resend } from "resend";
import Stripe from "stripe";
import dotenv from "dotenv";
import fs from "fs";
import { getProduct } from "./src/data/products";

dotenv.config();

// removed fileURLToPath as it breaks in CJS bundle

const app = express();
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Database
let dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'leads.db');
let db: Database.Database;

try {
  if (process.env.DATABASE_PATH) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  db = new Database(dbPath);
} catch (err: any) {
  console.warn(`Failed to open DB at ${dbPath}, falling back to /tmp/leads.db. Error: ${err.message}`);
  dbPath = '/tmp/leads.db';
  db = new Database(dbPath);
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL UNIQUE,
    sport TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    email_index INTEGER NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    customer_email TEXT,
    stripe_customer_id TEXT,
    stripe_checkout_session_id TEXT,
    stripe_payment_intent_id TEXT,
    stripe_subscription_id TEXT,
    product_id TEXT,
    price_id TEXT,
    product_name TEXT,
    payment_status TEXT DEFAULT 'Booked but Unpaid',
    amount_paid INTEGER,
    currency TEXT,
    package_type TEXT,
    membership_type TEXT,
    sessions_purchased INTEGER,
    sessions_remaining INTEGER,
    billing_interval TEXT,
    webhook_event_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    questionnaire_score INTEGER,
    questionnaire_data TEXT,
    raw_rt_avg REAL,
    raw_rt_fastest REAL,
    raw_rt_slowest REAL,
    raw_rt_false_positives INTEGER,
    choice_rt_purple_avg REAL,
    choice_rt_purple_acc REAL,
    choice_rt_teal_avg REAL,
    choice_rt_teal_acc REAL,
    choice_rt_post_error_slowing REAL,
    rec_speed_avg REAL,
    rec_speed_acc REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(email) REFERENCES leads(email)
  );
`);

// Drop old bookings table if exists to migrate to payments
db.exec(`DROP TABLE IF EXISTS bookings`);

// Referral helpers
function parseReferralCode(code: string | null) {
  if (!code) return { name: null, type: null };
  const upperCode = code.toUpperCase().trim();
  const parts = upperCode.split('-');
  
  if (parts.length < 2) {
    return { name: code.trim(), type: 'Other' };
  }

  const prefix = parts[0];
  const value = parts.slice(1).join(' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  switch (prefix) {
    case 'COACH':
      return { name: `Coach ${value}`, type: 'Coach' };
    case 'TEAM':
      return { name: value, type: 'Team' };
    case 'SCHOOL':
      return { name: value, type: 'School' };
    case 'DR':
      return { name: `Dr. ${value}`, type: 'Doctor' };
    case 'CLINIC':
      return { name: `${value} Clinic`, type: 'Vision Clinic' };
    case 'EVENT':
      return { name: value, type: 'Event' };
    case 'AFFILIATE':
      return { name: value, type: 'Affiliate Partner' };
    case 'CAMPAIGN':
      return { name: value, type: 'Campaign' };
    default:
      return { name: code.trim(), type: 'Referral Partner' };
  }
}

function checkSourceConfidence(howHeard: string | null, referralCode: string | null, utmSource: string | null): string {
  if (!howHeard) return 'High';
  
  let matches = true;

  const getChannel = (val: string, type: 'how' | 'ref' | 'utm') => {
    const clean = val.toLowerCase().trim();
    if (type === 'how') {
      if (clean.includes('google') || clean.includes('search')) return 'Search';
      if (clean.includes('social') || clean.includes('facebook') || clean.includes('instagram') || clean.includes('tiktok') || clean.includes('youtube')) return 'Social';
      if (clean.includes('ad')) return 'Paid Ads';
      if (clean.includes('referral') || clean.includes('coach') || clean.includes('athlete') || clean.includes('parent') || clean.includes('team') || clean.includes('school') || clean.includes('club') || clean.includes('doctor') || clean.includes('vision') || clean.includes('clinic') || clean.includes('physical') || clean.includes('therapist') || clean.includes('specialist') || clean.includes('strength') || clean.includes('facility')) return 'Referral';
      if (clean.includes('affiliate')) return 'Affiliate';
      if (clean.includes('event') || clean.includes('conference')) return 'Event';
      if (clean.includes('qr')) return 'QR Code';
      return 'Other';
    } else if (type === 'ref') {
      if (clean.startsWith('coach') || clean.startsWith('team') || clean.startsWith('school') || clean.startsWith('dr') || clean.startsWith('clinic')) return 'Referral';
      if (clean.startsWith('affiliate')) return 'Affiliate';
      if (clean.startsWith('event')) return 'Event';
      if (clean.startsWith('campaign')) return 'Campaign';
      return 'Other';
    } else {
      if (clean.includes('google') || clean.includes('bing') || clean.includes('search')) return 'Search';
      if (clean.includes('facebook') || clean.includes('instagram') || clean.includes('tiktok') || clean.includes('youtube') || clean.includes('social')) return 'Social';
      if (clean.includes('cpc') || clean.includes('ad') || clean.includes('paid')) return 'Paid Ads';
      if (clean.includes('partner') || clean.includes('referral')) return 'Referral';
      if (clean.includes('affiliate')) return 'Affiliate';
      return 'Other';
    }
  };

  const howChannel = getChannel(howHeard, 'how');
  let refChannel: string | null = null;
  let utmChannel: string | null = null;

  if (referralCode) {
    refChannel = getChannel(referralCode, 'ref');
    if (refChannel !== 'Other' && howChannel !== 'Other' && refChannel !== howChannel) {
      matches = false;
    }
  }

  if (utmSource) {
    utmChannel = getChannel(utmSource, 'utm');
    if (utmChannel !== 'Other' && howChannel !== 'Other' && utmChannel !== howChannel) {
      matches = false;
    }
    if (refChannel && refChannel !== 'Other' && utmChannel !== 'Other' && refChannel !== utmChannel) {
      matches = false;
    }
  }

  return matches ? 'High' : 'Needs Review';
}

function determineSourceString(howHeard: string | null, referralCode: string | null, utmSource: string | null): string {
  if (referralCode) {
    const { name, type } = parseReferralCode(referralCode);
    return name ? `${type}: ${name}` : (type || 'Referral');
  }
  if (utmSource) {
    return `UTM: ${utmSource}`;
  }
  if (howHeard) {
    return howHeard;
  }
  return 'Website';
}

// Schema migrations to support lead capture details, UTM parameters, and lead status
function runMigrations() {
  const columnsToAdd = [
    { table: "leads", column: "phone", type: "TEXT" },
    { table: "leads", column: "athlete_name", type: "TEXT" },
    { table: "leads", column: "parent_guardian_name", type: "TEXT" },
    { table: "leads", column: "age", type: "INTEGER" },
    { table: "leads", column: "lead_source", type: "TEXT DEFAULT 'Website'" },
    { table: "leads", column: "utm_source", type: "TEXT" },
    { table: "leads", column: "utm_medium", type: "TEXT" },
    { table: "leads", column: "utm_campaign", type: "TEXT" },
    { table: "leads", column: "landing_page", type: "TEXT DEFAULT '/'" },
    { table: "leads", column: "updated_at", type: "DATETIME" },
    
    // New growth attribution fields
    { table: "leads", column: "how_heard", type: "TEXT" },
    { table: "leads", column: "how_heard_other", type: "TEXT" },
    { table: "leads", column: "referral_code", type: "TEXT" },
    { table: "leads", column: "affiliate_code", type: "TEXT" },
    { table: "leads", column: "referral_partner_name", type: "TEXT" },
    { table: "leads", column: "referral_partner_type", type: "TEXT" },
    { table: "leads", column: "utm_content", type: "TEXT" },
    { table: "leads", column: "utm_term", type: "TEXT" },
    { table: "leads", column: "first_touch_source", type: "TEXT" },
    { table: "leads", column: "last_touch_source", type: "TEXT" },
    { table: "leads", column: "conversion_source", type: "TEXT" },
    { table: "leads", column: "assessment_completed_date", type: "DATETIME" },
    { table: "leads", column: "evaluation_scheduled_date", type: "DATETIME" },
    { table: "leads", column: "evaluation_completed_date", type: "DATETIME" },
    { table: "leads", column: "became_client_date", type: "DATETIME" },
    { table: "leads", column: "source_confidence", type: "TEXT DEFAULT 'High'" },
    { table: "leads", column: "manually_verified_source", type: "TEXT" },
    { table: "leads", column: "lead_owner", type: "TEXT DEFAULT 'Admin'" },
    { table: "leads", column: "notes", type: "TEXT" },
    { table: "leads", column: "icp_segment", type: "TEXT" },
    { table: "leads", column: "competitive_level", type: "TEXT" },
    { table: "leads", column: "location", type: "TEXT" },
    { table: "leads", column: "bottleneck_profile", type: "TEXT" },
    { table: "leads", column: "primary_concern", type: "TEXT" },
    { table: "leads", column: "lead_score", type: "INTEGER DEFAULT 0" },
    { table: "leads", column: "lead_category", type: "TEXT DEFAULT 'Cold'" },
    { table: "leads", column: "urgency", type: "TEXT" },
    { table: "leads", column: "desired_next_step", type: "TEXT" },
    { table: "leads", column: "consent", type: "INTEGER DEFAULT 0" },
    { table: "leads", column: "drip_stage", type: "TEXT" },
    { table: "email_logs", column: "notes", type: "TEXT" }
  ];

  for (const item of columnsToAdd) {
    try {
      db.prepare(`ALTER TABLE ${item.table} ADD COLUMN ${item.column} ${item.type}`).run();
      console.log(`Migrated: Added ${item.column} to ${item.table}`);
    } catch (err: any) {
      if (!err.message.includes("duplicate column name") && !err.message.includes("already exists")) {
        console.warn(`Migration warning for ${item.table}.${item.column}: ${err.message}`);
      }
    }
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      old_status TEXT,
      new_status TEXT,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lead_id) REFERENCES leads(id)
    );
  `);
}
runMigrations();

// Mock Stripe Webhook Endpoint

let resend: Resend | null = null;
try {
  const key = process.env.RESEND_API_KEY;
  if (key && key.trim().length > 0) {
    resend = new Resend(key);
  }
} catch (e) {
  console.warn("Failed to initialize Resend:", e);
}
const SENDER_EMAIL = "Dr. Joe LaPlaca <onboarding@areselitesportsvision.com>"; // In a real app, this needs to be a verified domain in Resend

const APP_URL = process.env.APP_URL || 'https://areselitesports.vision';

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Segmented Email Sequences Definitions
const athleteParentSequence = [
  {
    day: 0,
    subject: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => 
      bottleneck 
        ? `Next steps for your ${bottleneck.toLowerCase()}, ${firstName}`
        : `Next steps for your sensory performance, ${firstName}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const bottleneckIntro = bottleneck 
        ? `Based on your assessment, your eyes show signs of a ${bottleneck}. This means your visual system is lagging when trying to process dynamic play.` 
        : `While your initial metrics give us a snapshot, the next step is mapping your complete visual engine.`;
      
      const concernDetail = concern 
        ? `Specifically, your concern with "${concern.toLowerCase()}" is a classic indicator of visual-cognitive latency.`
        : `High-speed coordination, peripheral accuracy, and focus under physical fatigue cannot be fully diagnosed online.`;

      return `Hi ${firstName},

Great job completing the A.R.E.S. sensory assessment.

${bottleneckIntro}

${concernDetail}

That is why we begin with the Sports Vision Performance Evaluation. This is a 75-minute, in-depth diagnostic session at our Carmel HQ where we run you through our specialized tactile boards, eye-tracking systems, and strobe-occlusion diagnostics.

Delaying this evaluation means training with blind spots. Let's lock in your baseline.

Book Your Evaluation: ${APP_URL}/book/evaluation

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision
Milliseconds Matter™`;
    }
  },
  {
    day: 2,
    subject: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => 
      bottleneck 
        ? `The 200ms ${bottleneck.toLowerCase()} in ${sport || 'sports'}`
        : `The 200-millisecond bottleneck in ${sport || 'sports'}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const bottleneckP = bottleneck === 'Acquire Bottleneck'
        ? `Your assessment indicated an Acquire Bottleneck. This means your eyes are taking too long to capture and track high-speed movements, leaving you reacting late.`
        : bottleneck === 'Route Bottleneck'
        ? `Your assessment indicated a Route Bottleneck. Your eyes capture the play, but there is a delay in routing that coordinate data through the optic nerve to your brain.`
        : bottleneck === 'Execute Bottleneck'
        ? `Your assessment indicated an Execute Bottleneck. Your brain processes the play, but your motor cortex has a latency delay commanding your hands and feet to move.`
        : bottleneck === 'Synchronize Bottleneck'
        ? `Your assessment indicated a Synchronize Bottleneck. Under fatigue or pressure, your visual and physical motor systems fall out of sync, leading to late-game errors.`
        : `In ${sport || 'elite sports'}, the physical game moves fast, but the cognitive game moves faster.`;

      const concernP = concern 
        ? `This explains why you've been noticing issues like: ${concern.toLowerCase()}. By training your visual pathways, we can shave off those latency delays.`
        : `A 90mph fastball, an opponent's sudden change of direction, or a high-speed corner all require visual processing in under 200 milliseconds.`;

      return `Hi ${firstName},

In ${sport || 'elite sports'}, the physical game moves fast, but the cognitive game moves faster.

${bottleneckP}

${concernP}

Most athletes spend thousands of dollars on strength and skills coaching, yet ignore the neural visual engine that controls those physical movements.

Our in-office evaluation exposes the exact bottleneck where you are giving away precious milliseconds.

Review our schedule and book your diagnostic slot this week:
Book Your Evaluation: ${APP_URL}/book/evaluation

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 5,
    subject: (firstName: string, sport: string) => `Why 20/20 vision isn't enough in ${sport || 'sports'}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const concernText = concern 
        ? `Even if you have perfect eyesight, cognitive latency in areas like "${concern.toLowerCase()}" is completely separate from how clear your static vision is.`
        : `Having 20/20 vision simply means you can read a stationary letter chart from 20 feet away.`;

      return `Hi ${firstName},

A common misconception we hear from ${sport || 'elite'} athletes: "I don't need sports vision training, I have 20/20 vision."

${concernText} Static vision tells us nothing about:
- How fast your eyes track a spinning ball or high-speed target.
- Your depth perception under stadium glare.
- Your peripheral awareness when moving at speed.

Sports vision training takes healthy eyes and tunes them for athletic dominance. But we cannot write your protocol until we run the baseline evaluation.

Book your Carmel diagnostic spot here:
Reserve Evaluation Spot ($449): ${APP_URL}/book/evaluation

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 9,
    subject: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => 
      bottleneck 
        ? `Eliminating your ${bottleneck.toLowerCase()} with A.R.E.S.`
        : `How the A.R.E.S. framework builds elite athletes`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const intro = bottleneck 
        ? `We have mapped your initial results to our A.R.E.S. framework and identified a primary target: your ${bottleneck.toLowerCase()}.`
        : `We build elite vision using a proprietary cognitive training loop: A.R.E.S.`;

      const targetFocus = bottleneck === 'Acquire Bottleneck'
        ? `For your Acquire Bottleneck, we focus on training your saccades, smooth pursuit tracking, and visual search speed so you can lock onto targets faster.`
        : bottleneck === 'Route Bottleneck'
        ? `For your Route Bottleneck, we focus on optic nerve processing, visual memory recognition, and spatial processing so your brain receives coordinates instantly.`
        : bottleneck === 'Execute Bottleneck'
        ? `For your Execute Bottleneck, we focus on choice reaction speed, motor reaction triggers, and hand-eye coordination to decrease motor reaction lag.`
        : bottleneck === 'Synchronize Bottleneck'
        ? `For your Synchronize Bottleneck, we focus on dynamic visual fatigue endurance, peripheral decision accuracy, and play-calling under load.`
        : `The A.R.E.S. framework breaks visual performance down into four pillars.`;

      return `Hi ${firstName},

${intro}

The A.R.E.S. framework breaks visual performance down into four pillars:
- Acquire: How fast and accurately do your eyes capture high-speed targets?
- Route: How efficiently does your optic nerve send spatial coordinates to your brain?
- Execute: How quickly does your motor cortex command physical muscle reactions?
- Synchronize: How consistently do these systems align under fatigue and pressure?

${targetFocus}

Standard eye exams only check static 20/20 vision. The A.R.E.S. Evaluation is the only way to measure all four pillars under athletic load.

Don't let visual latency limit your training gains.

Find Your Gaps: Schedule Evaluation: ${APP_URL}/book/evaluation

Sincerely,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 14,
    subject: (firstName: string, sport: string) => `What coaches, parents, and scouts look for in ${sport || 'sports'}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const concernDetail = concern 
        ? `They look for players who don't suffer from things like: ${concern.toLowerCase()}.`
        : `These aren't abstract traits — they are directly tied to your visual-cognitive stamina.`;

      return `Hi ${firstName},

When scouts and coaches evaluate an athlete in ${sport || 'sports'}, they look for "decision-making speed" and "high-pressure composure."

${concernDetail}

- Coaches love athletes who read plays half a second before they happen.
- Parents value the safety margin: faster tracking means fewer blind-spot hits and lower injury risk.
- Scouts look for neurological efficiency: the athlete who stays cool and accurate in the final minutes of a game.

An A.R.E.S. Evaluation gives you the empirical telemetry data to show them you have that elite cognitive edge.

Book Your Performance Evaluation: ${APP_URL}/book/evaluation

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 20,
    subject: (firstName: string, sport: string) => `Missing baseline data alert for ${firstName}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const focusText = bottleneck 
        ? `We cannot prescribe target drills, peripheral response training, or dynamic focus work for your ${bottleneck.toLowerCase()} without these primary benchmarks.`
        : `Without a scheduled A.R.E.S. Evaluation, your cognitive profile remains incomplete.`;

      return `Hi ${firstName},

We noticed that we are still missing your baseline visual-performance telemetry.

${focusText}

Let's get your calibration scheduled before the season moves forward.

Schedule Evaluation Spot ($449): ${APP_URL}/book/evaluation

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 25,
    subject: (firstName: string, sport: string) => `Take control of your reaction times in ${sport || 'sports'}`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const concernP = concern 
        ? `Latency in visual capture and specific concerns like "${concern.toLowerCase()}" are trained patterns that require targeted training.`
        : `If you are waiting for performance gaps to resolve on their own, they won't.`;

      return `Hi ${firstName},

${concernP}

The A.R.E.S. Evaluation is the first step toward reclaiming those crucial milliseconds.

Book Your Performance Evaluation: ${APP_URL}/book/evaluation

Sincerely,

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  },
  {
    day: 30,
    subject: (firstName: string, sport: string) => `Leaving the door open (A.R.E.S. Evaluation)`,
    body: (firstName: string, sport: string, bottleneck?: string | null, concern?: string | null) => {
      const bottleneckP = bottleneck 
        ? `Visual bottlenecks like your ${bottleneck.toLowerCase()} do not go away on their own. They manifest as split-second hesitations, late reactions, and performance drop-offs during physical fatigue.`
        : `Visual bottlenecks do not go away on their own. They manifest as split-second hesitations, late reactions, and performance drop-offs during physical fatigue.`;

      return `Hi ${firstName},

I have checked in a few times and haven't heard back, which is completely fine. Timing is everything in sports and training, and if this isn't the right window for you, I understand.

${bottleneckP}

Whenever you are ready to proactively build your processing speed and claim those crucial milliseconds, the door is open.

You can book your diagnostic evaluation below or reply directly to this email to coordinate.

Book Evaluation When Ready: ${APP_URL}/book/evaluation

Wishing you a healthy and successful season.

Dr. Joe LaPlaca
Ares Elite Sports Vision`;
    }
  }
];

const coachTeamSequence = [
  {
    day: 0,
    subject: (firstName: string, sport: string) => `Objective player diagnostics for your roster`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

Thank you for completing the A.R.E.S. assessment.

As a coach, you know that physical conditioning has diminishing returns. When everyone is strong and fast, the ultimate competitive advantage is visual processing and decision speed.

We specialize in establishing team visual baselines to identify which players have processing latency that leads to turnovers, late reads, or hesitations under pressure.

We can run on-site testing days for your entire roster. Let's schedule a time to discuss a custom team screening program.

Request a Consultation: ${APP_URL}/contact

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 2,
    subject: (firstName: string, sport: string) => `Decision speed: The ultimate team advantage`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

If your players are strong but constantly reacting late, their visual routing is congested.

At the elite level, spatial coordinates must travel from the eyes to the motor cortex in under 180 milliseconds. If a player's eyes take 240ms to acquire the target, they are slow before their muscles even contract.

Ares trains the system that controls movement. We help your athletes read the field, track dynamic objects, and execute decisions faster.

Let's discuss how we can integrate neuro-performance screening into your roster:
Request Team Consultation: ${APP_URL}/contact

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 5,
    subject: (firstName: string, sport: string) => `Vision vs. Sight: Why eye charts fail your athletes`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

A player with 20/20 sight can read a stationary chart. But can they track a ball in their peripheral field under glare while running at full speed?

Standard eye exams check static vision at rest. They miss 80% of sports vision requirements. Ares evaluates and trains:
- Saccadic eye movement speed
- Peripheral reaction times
- Cognitive stamina under fatigue

Let's build a roster that doesn't blink under pressure.

Request a Consultation: ${APP_URL}/contact

Sincerely,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 9,
    subject: (firstName: string, sport: string) => `Establish your team's visual baseline`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

Before the season gets fully underway, we recommend setting a baseline for your athletes.

Our team screenings provide you with:
1. Player visual speed and coordination telemetry dashboards.
2. Team-wide reports identifying potential bottleneck trends.
3. Pre-season concussion baselines that map visual processing (which is affected in over 50% of brain injuries).

Secure a consultation to discuss testing packages:
Request Team Consultation: ${APP_URL}/contact

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 14,
    subject: (firstName: string, sport: string) => `Integrating neurocognitive drills into your practice`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

Adding sensory training to your standard practices doesn't require extra hours. We design plug-and-play neurocognitive drills that can be integrated directly into your existing conditioning and skill work.

By combining physical fatigue with visual decisions, we train your players to maintain composure and precision in the fourth quarter.

Let's coordinate a consultation to review sample drills.

Request Team Consultation: ${APP_URL}/contact

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 21,
    subject: (firstName: string, sport: string) => `Let's discuss your team's visual blueprint`,
    body: (firstName: string, sport: string) => `Hi Coach ${firstName},

I wanted to send a final check-in. Visual bottlenecks in your athletes lead to turnovers, sluggish plays, and increased injury risks.

Whenever you are ready to establish roster baselines and build an elite decision-making team, the door is open. You can coordinate a consultation below or reply directly to this email.

Schedule Consultation: ${APP_URL}/contact

Wishing you a successful season,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  }
];

const facilitySequence = [
  {
    day: 0,
    subject: (firstName: string, sport: string) => `Adding a premium performance revenue stream`,
    body: (firstName: string, sport: string) => `Hi ${firstName},

Thank you for completing the A.R.E.S. assessment.

Sports vision and neurocognitive training are the fastest-growing sectors in elite athlete development. Parents and coaches are looking for objective cognitive telemetry to give their athletes a competitive edge.

The A.R.E.S. Certification and Provider Licensing Program allows you to add our premium neuro-performance protocols directly into your facility, creating a highly profitable standalone service or primary training pillar.

Let's schedule a call to review integration pathways and equipment needs.

Schedule Facility Call: ${APP_URL}/contact

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 3,
    subject: (firstName: string, sport: string) => `The plug-and-play neuro-performance model`,
    body: (firstName: string, sport: string) => `Hi ${firstName},

Integrating sports vision training doesn't require rebuilding your facility. The A.R.E.S. system is designed to be highly spatial-efficient.

We provide:
- The equipment specifications and hardware sourcing.
- 3 days of clinical and operational intensive training with Dr. LaPlaca.
- Proprietary software, EMR tracking tools, and client onboarding systems.

This allows you to begin running certified baseline evaluations and selling packages within weeks of certification.

Let's discuss regional licensing options:
Schedule Facility Integration Call: ${APP_URL}/contact

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 7,
    subject: (firstName: string, sport: string) => `Clinical progression and EMR integration`,
    body: (firstName: string, sport: string) => `Hi ${firstName},

The biggest challenge with cognitive training is proving the value. Parents want to see objective progress, not just lights flashing on a board.

Our proprietary A.R.E.S. EMR platform logs player telemetry data from every drill. This allows you to generate visual report cards showing improvements in:
- Raw reaction times (ms)
- Peripheral awareness field (degrees)
- Choice reaction accuracy (%)

When parents see objective, millisecond-level improvements mapped on a graph, retention and package renewals follow naturally.

Let's discuss integration details:
Schedule Facility Call: ${APP_URL}/contact

Sincerely,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 14,
    subject: (firstName: string, sport: string) => `Exclusive territory licensing details`,
    body: (firstName: string, sport: string) => `Hi ${firstName},

To protect the value of the A.R.E.S. brand and ensure the success of our partners, we enforce strict geographic territory exclusivity. We only certify a limited number of facility partners per market.

If you want to establish your facility as the exclusive destination for elite sports vision in your region, securing territory rights is crucial.

Review our licensing packages and apply for certification today:
Contact Certification Team: ${APP_URL}/contact

Best,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 21,
    subject: (firstName: string, sport: string) => `Schedule your facility integration call`,
    body: (firstName: string, sport: string) => `Hi ${firstName},

This is my final automated follow-up. If you want to differentiate your facility, increase average client value, and attract elite collegiate and pro athletes, neuro-performance training is the path.

Whenever you are ready to review the operational blueprints and coordinate a licensing call, the door is open.

Schedule Facility Integration Call: ${APP_URL}/contact

Best regards,

Dr. Joe LaPlaca
Ares Elite Sports Vision`
  }
];

function getLeadSequence(icpSegment: string | null): { name: string, emails: any[] } {
  const segment = icpSegment || 'Elite Athlete';
  if (segment.includes('Motorsports')) {
    return { name: 'athleteParentSequence', emails: athleteParentSequence };
  }
  if (segment.includes('Coach') || segment.includes('Team') || segment.includes('Org')) {
    return { name: 'coachTeamSequence', emails: coachTeamSequence };
  }
  if (segment.includes('Facility')) {
    return { name: 'facilitySequence', emails: facilitySequence };
  }
  return { name: 'athleteParentSequence', emails: athleteParentSequence };
}

function calculateLeadScore(leadData: {
  role: string | null;
  competitiveLevel: string | null;
  location: string | null;
  urgency: string | null;
  phone: string | null;
  referralCode: string | null;
  desiredNextStep: string | null;
  booked: boolean;
}): number {
  let score = 0;
  
  if (leadData.booked) {
    score += 25;
  }
  
  if (leadData.location) {
    const loc = leadData.location.toLowerCase();
    if (loc.includes('indiana') || loc.includes('carmel') || loc.includes('indianapolis') || /\bin\b/.test(loc)) {
      score += 20;
    }
  }
  
  const isAthleteOrParent = leadData.role && (
    leadData.role.includes('Athlete') || 
    leadData.role.includes('Parent')
  );
  if (isAthleteOrParent && leadData.urgency === 'Immediate') {
    score += 20;
  }
  
  const isCoachOrOrg = leadData.role && (
    leadData.role.includes('Coach') || 
    leadData.role.includes('Team') || 
    leadData.role.includes('Facility')
  );
  if (isCoachOrOrg) {
    score += 20;
  }
  
  if (leadData.competitiveLevel) {
    const lvl = leadData.competitiveLevel.toLowerCase();
    if (lvl.includes('college') || lvl.includes('professional') || lvl.includes('elite')) {
      score += 15;
    }
  }
  
  if (leadData.referralCode && leadData.referralCode.trim().length > 0) {
    score += 10;
  }
  
  if (leadData.phone && leadData.phone.trim().length > 0) {
    score += 10;
  }

  if (leadData.desiredNextStep === 'Book Evaluation') {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function getLeadCategory(score: number): 'Hot' | 'Warm' | 'Cold' {
  if (score >= 75) return 'Hot';
  if (score >= 40) return 'Warm';
  return 'Cold';
}

// Process Sequences Function
async function processEmailSequences() {
  console.log("Running email sequence processor...");
  
  // Get all active leads in nurture, excluding internal domains
  const leads = db.prepare(`
    SELECT * FROM leads 
    WHERE (status IN ('Nurture Campaign Active', 'Evaluation Not Scheduled') OR status LIKE 'Email % Sent')
      AND email NOT LIKE '%@areselitesportsvision.com'
  `).all() as any[];
  
  for (const lead of leads) {
    // Determine the correct sequence based on icp_segment
    const { name: sequenceName, emails: currentSequence } = getLeadSequence(lead.icp_segment);
    
    // Calculate days since creation
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Find which emails should have been sent by now
    for (let i = 0; i < currentSequence.length; i++) {
      const emailDef = currentSequence[i];
      
      if (diffDays >= emailDef.day) {
        // Check if this specific email was already sent
        const log = db.prepare("SELECT * FROM email_logs WHERE lead_id = ? AND email_index = ? AND notes = ?").get(lead.id, i, sequenceName);
        
        if (!log) {
          // Send email
          try {
            console.log(`Sending email index ${i} (Day ${emailDef.day}) in ${sequenceName} to ${lead.email}`);
            
            const subjectText = emailDef.subject(
              lead.first_name, 
              lead.sport || 'elite', 
              lead.bottleneck_profile || null, 
              lead.primary_concern || null
            );
            const bodyText = emailDef.body(
              lead.first_name, 
              lead.sport || 'elite', 
              lead.bottleneck_profile || null, 
              lead.primary_concern || null
            ) +
              `\n\n---\n` +
              `If you no longer wish to receive these training updates, you can unsubscribe here:\n` +
              `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(lead.email)}\n\n` +
              `Ares Elite Sports Vision // 510 W. Carmel Dr., Carmel, IN 46032`;

            if (resend) {
              await resend.emails.send({
                from: SENDER_EMAIL,
                to: lead.email,
                subject: subjectText,
                text: bodyText
              });
            } else {
              console.log("RESEND_API_KEY not set. Simulating email send:");
              console.log(`Subject: ${subjectText}`);
              console.log(`To: ${lead.email}`);
            }
            
            // Log it
            db.prepare("INSERT INTO email_logs (lead_id, email_index, notes) VALUES (?, ?, ?)").run(lead.id, i, sequenceName);
            
            // Update lead status and drip_stage
            const statusLabel = i === currentSequence.length - 1 ? 'Final Follow-Up Sent' : `Email ${i + 1} Sent`;
            db.prepare("UPDATE leads SET status = ?, drip_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(statusLabel, `${sequenceName}:${i}`, lead.id);
          } catch (error) {
            console.error(`Failed to send email index ${i} to ${lead.email}:`, error);
          }
        }
      }
    }
  }
}

// Compile and send Weekly Performance Report
async function sendWeeklyReport() {
  console.log("Compiling weekly report...");
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Total new assessment leads
    const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE created_at >= ?").get(oneWeekAgo) as { count: number };
    
    // Total scheduled evaluations
    const scheduled = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Evaluation Scheduled' AND updated_at >= ?").get(oneWeekAgo) as { count: number };
    
    // Total active in nurture
    const activeNurture = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status LIKE '%Sent' OR status = 'Nurture Campaign Active'").get() as { count: number };
    
    // Leads by source
    const sourceStats = db.prepare("SELECT last_touch_source, COUNT(*) as count FROM leads WHERE created_at >= ? GROUP BY last_touch_source").all(oneWeekAgo) as { last_touch_source: string, count: number }[];
    
    // Convert source stats to description
    const sourceSummary = sourceStats.map(s => `${s.last_touch_source || 'Website'}: ${s.count}`).join(', ') || "None";
    
    // Conversion rate
    const conversionRate = newLeads.count > 0 ? Math.round((scheduled.count / newLeads.count) * 100) : 0;

    // Leads who have not scheduled yet
    const pendingLeadsList = db.prepare(`
      SELECT l.first_name, l.last_name, l.sport, l.created_at, a.questionnaire_score 
      FROM leads l
      LEFT JOIN assessments a ON l.email = a.email
      WHERE l.status != 'Evaluation Scheduled' AND l.status != 'Unsubscribed' AND l.status != 'Not Interested' AND l.status != 'Became Client'
      ORDER BY l.created_at DESC LIMIT 10
    `).all() as any[];

    // Manual follow-ups
    const manualFollowUpsList = db.prepare(`
      SELECT first_name, last_name, email, sport, status
      FROM leads
      WHERE (sport LIKE '%pro%' OR sport LIKE '%elite%' OR status = 'Final Follow-Up Sent')
        AND status != 'Evaluation Scheduled' AND status != 'Became Client'
      LIMIT 5
    `).all() as any[];

    // Top referral partner channels this week
    const topReferralCodes = db.prepare(`
      SELECT referral_code, referral_partner_name, referral_partner_type, COUNT(*) as count,
             SUM(CASE WHEN status = 'Evaluation Scheduled' OR status = 'Became Client' THEN 1 ELSE 0 END) as converted
      FROM leads
      WHERE referral_code IS NOT NULL AND created_at >= ?
      GROUP BY referral_code
      ORDER BY count DESC
      LIMIT 5
    `).all(oneWeekAgo) as any[];

    // Attribution review candidate count
    const reviewCount = (db.prepare(`
      SELECT COUNT(*) as count FROM leads WHERE source_confidence = 'Needs Review'
    `).get() as { count: number }).count;

    // Format HTML email rows
    let pendingRows = "";
    for (const lead of pendingLeadsList) {
      pendingRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${lead.first_name} ${lead.last_name || ''}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${lead.sport || 'N/A'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${lead.questionnaire_score || 'N/A'}/200</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${new Date(lead.created_at).toLocaleDateString()}</td>
        </tr>
      `;
    }

    let manualRows = "";
    for (const lead of manualFollowUpsList) {
      const reason = lead.status === 'Final Follow-Up Sent' ? 'Finished Drip Nurture' : 'Elite/Pro Athlete';
      manualRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><strong>${lead.first_name} ${lead.last_name || ''}</strong> (${lead.email})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${lead.sport || 'N/A'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><span style="background: #ef5350; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${reason}</span></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><a href="mailto:${lead.email}" style="color: #29b6f6; text-decoration: none;">Email Lead</a></td>
        </tr>
      `;
    }

    let partnerRows = "";
    for (const partner of topReferralCodes) {
      partnerRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><strong>${partner.referral_code}</strong> (${partner.referral_partner_name || 'N/A'})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${partner.referral_partner_type || 'Other'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${partner.count}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center; color: #66bb6a;">${partner.converted}</td>
        </tr>
      `;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0e111a; color: #ffffff; padding: 24px; max-width: 650px; border-radius: 12px; border: 1px solid #8b5cf6;">
        <h2 style="color: #8b5cf6; margin-top: 0; text-transform: uppercase; font-size: 20px; border-bottom: 2px solid #8b5cf6; padding-bottom: 12px;">A.R.E.S. Weekly Funnel Performance Report</h2>
        <p style="color: #9ca3af; font-size: 13px;">Reporting Period: Past 7 Days</p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
          <div style="background: #1f2937; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">New Assessment Leads</div>
            <div style="font-size: 24px; font-weight: bold; color: #29b6f6; margin-top: 5px;">${newLeads.count}</div>
          </div>
          <div style="background: #1f2937; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">Evals Scheduled</div>
            <div style="font-size: 24px; font-weight: bold; color: #66bb6a; margin-top: 5px;">${scheduled.count}</div>
          </div>
          <div style="background: #1f2937; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">Conversion Rate</div>
            <div style="font-size: 24px; font-weight: bold; color: #fbbf24; margin-top: 5px;">${conversionRate}%</div>
          </div>
        </div>

        ${reviewCount > 0 ? `
        <div style="background: rgba(239, 83, 80, 0.1); border: 1px solid #ef5350; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
          <span style="color: #ef5350; font-weight: bold;">⚠️ ATTRIBUTION CLEANUP NEEDED:</span> You have <strong>${reviewCount}</strong> leads with conflicting source channels. Verify them on the Admin Dashboard.
        </div>
        ` : ''}

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Leads Active in Nurture: ${activeNurture.count}</div>
        <div style="font-size: 13px; margin-top: 10px; color: #e5e7eb;"><strong>Acquisition Channels:</strong> ${sourceSummary}</div>

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Top Referral Codes & Partners (7 Days)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Partner Code / Name</th>
              <th style="padding-bottom: 8px;">Partner Type</th>
              <th style="padding-bottom: 8px; text-align: center;">Leads</th>
              <th style="padding-bottom: 8px; text-align: center;">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            ${partnerRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No partner referrals this week</td></tr>'}
          </tbody>
        </table>

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Manual Follow-Up Alerts (Hot Actions Needed)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Name</th>
              <th style="padding-bottom: 8px;">Sport</th>
              <th style="padding-bottom: 8px;">Trigger Reason</th>
              <th style="padding-bottom: 8px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${manualRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No high-priority manual follow-ups this week</td></tr>'}
          </tbody>
        </table>

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Recent Leads Who Haven't Booked Yet</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Name</th>
              <th style="padding-bottom: 8px;">Sport</th>
              <th style="padding-bottom: 8px;">Score</th>
              <th style="padding-bottom: 8px;">Enrolled Date</th>
            </tr>
          </thead>
          <tbody>
            ${pendingRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No pending leads in sequence</td></tr>'}
          </tbody>
        </table>

        <p style="font-size: 11px; color: #6b7280; margin-top: 30px; text-align: center; border-top: 1px solid #374151; padding-top: 15px;">
          Ares Elite Sports Vision Automation System // Carmel Headquarters
        </p>
      </div>
    `;

    if (resend) {
      await resend.emails.send({
        from: "A.R.E.S. Funnel Automation <laplacajn@gmail.com>",
        to: ["dminor@areselitesportsvision.com", "jguler@areselitesportsvision.com", "drl@areselitesportsvision.com"],
        subject: "A.R.E.S. Weekly Funnel Performance Report",
        html: htmlContent
      });
      console.log("Weekly report sent successfully via Resend.");
    } else {
      console.log("Weekly report generated (Simulated):");
      console.log(htmlContent);
    }
  } catch (err) {
    console.error("Failed to compile weekly report:", err);
  }
}

// Compile and send Monthly Performance Report
async function sendMonthlyReport() {
  console.log("Compiling monthly report...");
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Total new assessment leads
    const leads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE created_at >= ?").get(thirtyDaysAgo) as { count: number };
    
    // Total scheduled evaluations
    const scheduled = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Evaluation Scheduled' AND updated_at >= ?").get(thirtyDaysAgo) as { count: number };
    
    // Total unscheduled leads backlog
    const unscheduledLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status != 'Evaluation Scheduled' AND status != 'Unsubscribed' AND status != 'Not Interested' AND status != 'Became Client'").get() as { count: number };
    
    // Average days to book
    const avgDays = db.prepare(`
      SELECT AVG(julianday(updated_at) - julianday(created_at)) as avg_days 
      FROM leads 
      WHERE status = 'Evaluation Scheduled' AND updated_at >= ?
    `).get(thirtyDaysAgo) as { avg_days: number | null };
    
    const avgDaysToBook = avgDays.avg_days ? Math.round(avgDays.avg_days) : 0;
    
    // Conversion rate
    const conversionRate = leads.count > 0 ? Math.round((scheduled.count / leads.count) * 100) : 0;
    
    // Revenue opportunity
    const revOpportunity = unscheduledLeads.count * 449;

    // Leads by last touch source channel
    const sourceStats = db.prepare("SELECT last_touch_source, COUNT(*) as count FROM leads WHERE created_at >= ? GROUP BY last_touch_source").all(thirtyDaysAgo) as { last_touch_source: string, count: number }[];
    
    // Format source rows
    let sourceRows = "";
    for (const stat of sourceStats) {
      const sourceConv = db.prepare("SELECT COUNT(*) as count FROM leads WHERE last_touch_source = ? AND (status = 'Evaluation Scheduled' OR status = 'Became Client') AND created_at >= ?").get(stat.last_touch_source, thirtyDaysAgo) as { count: number };
      const sourceRate = stat.count > 0 ? Math.round((sourceConv.count / stat.count) * 100) : 0;
      sourceRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><strong>${stat.last_touch_source || 'Website'}</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${stat.count}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${sourceConv.count}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${sourceRate}%</td>
        </tr>
      `;
    }

    // Top performing referral partners (30 Days)
    const topReferrals = db.prepare(`
      SELECT referral_code, referral_partner_name, referral_partner_type, COUNT(*) as count,
             SUM(CASE WHEN status = 'Evaluation Scheduled' OR status = 'Became Client' THEN 1 ELSE 0 END) as converted
      FROM leads
      WHERE referral_code IS NOT NULL AND created_at >= ?
      GROUP BY referral_code
      ORDER BY count DESC
      LIMIT 5
    `).all(thirtyDaysAgo) as any[];

    let partnerRows = "";
    for (const p of topReferrals) {
      const convRate = p.count > 0 ? Math.round((p.converted / p.count) * 100) : 0;
      partnerRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><strong>${p.referral_code}</strong> (${p.referral_partner_name || 'N/A'})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${p.referral_partner_type || 'Other'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${p.count}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${convRate}%</td>
        </tr>
      `;
    }

    // Attribution review candidate count and sample list
    const reviewCandidates = db.prepare(`
      SELECT first_name, last_name, email, how_heard, referral_code, utm_source, created_at
      FROM leads
      WHERE source_confidence = 'Needs Review'
      ORDER BY created_at DESC
      LIMIT 5
    `).all() as any[];

    let reviewRows = "";
    for (const c of reviewCandidates) {
      reviewRows += `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px solid #1f2937; font-size: 13px;"><strong>${c.first_name} ${c.last_name || ''}</strong><br/><span style="color: #6b7280; font-size: 11px;">${c.email}</span></td>
          <td style="padding: 6px 0; border-bottom: 1px solid #1f2937; font-size: 11px;">Heard: ${c.how_heard || 'N/A'}<br/>Code: ${c.referral_code || 'N/A'}<br/>UTM: ${c.utm_source || 'N/A'}</td>
          <td style="padding: 6px 0; border-bottom: 1px solid #1f2937; font-size: 11px; text-align: right; color: #ef5350;">Conflict</td>
        </tr>
      `;
    }

    // Recommended outreach list (highest visual symptom scores that haven't booked)
    const recommendedList = db.prepare(`
      SELECT l.first_name, l.last_name, l.email, l.sport, a.questionnaire_score
      FROM leads l
      JOIN assessments a ON l.email = a.email
      WHERE l.status != 'Evaluation Scheduled' AND l.status != 'Unsubscribed' AND l.status != 'Not Interested' AND l.status != 'Became Client'
      ORDER BY a.questionnaire_score DESC LIMIT 5
    `).all() as any[];

    let recommendedRows = "";
    for (const lead of recommendedList) {
      const reason = lead.questionnaire_score >= 120 ? 'High Symptom Latency' : 'Needs Follow-Up';
      recommendedRows += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><strong>${lead.first_name} ${lead.last_name || ''}</strong> (${lead.email})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;">${lead.sport || 'N/A'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937; text-align: center;">${lead.questionnaire_score || 'N/A'}/200</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1f2937;"><span style="color:#fbbf24;">${reason}</span></td>
        </tr>
      `;
    }

    const monthName = new Date().toLocaleString('default', { month: 'long' });
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0e111a; color: #ffffff; padding: 28px; max-width: 650px; border-radius: 12px; border: 1px solid #29b6f6;">
        <h2 style="color: #29b6f6; margin-top: 0; text-transform: uppercase; font-size: 22px; border-bottom: 2px solid #29b6f6; padding-bottom: 12px;">A.R.E.S. Monthly Funnel Performance Report</h2>
        <p style="color: #9ca3af; font-size: 13px;">Reporting Period: Past Month (${monthName})</p>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;">
          <div style="background: #1f2937; padding: 12px 8px; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Total Leads</div>
            <div style="font-size: 20px; font-weight: bold; color: #29b6f6; margin-top: 5px;">${leads.count}</div>
          </div>
          <div style="background: #1f2937; padding: 12px 8px; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Scheduled</div>
            <div style="font-size: 20px; font-weight: bold; color: #66bb6a; margin-top: 5px;">${scheduled.count}</div>
          </div>
          <div style="background: #1f2937; padding: 12px 8px; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Conversion</div>
            <div style="font-size: 20px; font-weight: bold; color: #fbbf24; margin-top: 5px;">${conversionRate}%</div>
          </div>
          <div style="background: #1f2937; padding: 12px 8px; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Avg Days to Book</div>
            <div style="font-size: 20px; font-weight: bold; color: #8b5cf6; margin-top: 5px;">${avgDaysToBook}</div>
          </div>
        </div>

        <div style="background: rgba(102, 187, 106, 0.1); border: 1px solid #66bb6a; border-radius: 8px; padding: 15px; margin-top: 20px;">
          <h3 style="color: #66bb6a; margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase;">Estimated Pipeline Opportunity</h3>
          <p style="margin: 0; font-size: 13px; color: #e5e7eb;">
            You currently have <strong>${unscheduledLeads.count}</strong> leads who completed an assessment but have not scheduled an evaluation. 
            Based on a $449 evaluation rate, this represents a <strong>$${revOpportunity}</strong> near-term booking opportunity.
          </p>
        </div>

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Lead Acquisition Channels Performance</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Source</th>
              <th style="padding-bottom: 8px; text-align: center;">Acquired Leads</th>
              <th style="padding-bottom: 8px; text-align: center;">Scheduled Evals</th>
              <th style="padding-bottom: 8px; text-align: center;">Conversion %</th>
            </tr>
          </thead>
          <tbody>
            ${sourceRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No source acquisition metrics logged</td></tr>'}
          </tbody>
        </table>

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Top Performing Partners (30 Days)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Partner Code</th>
              <th style="padding-bottom: 8px;">Partner Type</th>
              <th style="padding-bottom: 8px; text-align: center;">Leads</th>
              <th style="padding-bottom: 8px; text-align: center;">Conv. Rate</th>
            </tr>
          </thead>
          <tbody>
            ${partnerRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No partner referrals this month</td></tr>'}
          </tbody>
        </table>

        ${reviewCandidates.length > 0 ? `
        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Attribution Cleanup Queue (Recent Conflicts)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tbody>
            ${reviewRows}
          </tbody>
        </table>
        ` : ''}

        <div style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-top: 25px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Recommended Outreach List (High Opportunity)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #374151;">
              <th style="padding-bottom: 8px;">Name</th>
              <th style="padding-bottom: 8px;">Sport</th>
              <th style="padding-bottom: 8px; text-align: center;">Symptom Score</th>
              <th style="padding-bottom: 8px;">Reason</th>
            </tr>
          </thead>
          <tbody>
            ${recommendedRows || '<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:10px;">No high-priority targets logged</td></tr>'}
          </tbody>
        </table>

        <p style="font-size: 11px; color: #6b7280; margin-top: 30px; text-align: center; border-top: 1px solid #374151; padding-top: 15px;">
          Ares Elite Sports Vision Analytics System
        </p>
      </div>
    `;

    if (resend) {
      await resend.emails.send({
        from: "A.R.E.S. Funnel Automation <laplacajn@gmail.com>",
        to: ["dminor@areselitesportsvision.com", "jguler@areselitesportsvision.com", "drl@areselitesportsvision.com"],
        subject: `A.R.E.S. Monthly Funnel Performance Report - ${monthName}`,
        html: htmlContent
      });
      console.log("Monthly report sent successfully via Resend.");
    } else {
      console.log("Monthly report generated (Simulated):");
      console.log(htmlContent);
    }
  } catch (err) {
    console.error("Failed to compile monthly report:", err);
  }
}

// Run cron job every day at 9:00 AM
cron.schedule('0 9 * * *', () => {
  processEmailSequences();
});

// Run weekly report on Mondays at 8:00 AM
cron.schedule('0 8 * * 1', () => {
  sendWeeklyReport();
});

// Run monthly report on the 1st of every month at 8:00 AM
cron.schedule('0 8 1 * *', () => {
  sendMonthlyReport();
});

// API Routes
app.get("/api/bookings", (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT 
        p.id,
        (l.first_name || ' ' || COALESCE(l.last_name, '')) AS client_name,
        p.customer_email AS client_email,
        p.product_name AS service,
        p.payment_status AS status,
        p.created_at,
        p.updated_at,
        p.stripe_payment_intent_id
      FROM payments p
      LEFT JOIN leads l ON p.customer_email = l.email
      ORDER BY p.created_at DESC
    `).all();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { serviceId, officeId, serviceName, price } = req.body;
    
    if (!serviceId || !price) {
      return res.status(400).json({ error: "Service and price are required" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe is not configured. Please add your STRIPE_SECRET_KEY in the AI Studio Settings (Environment Variables) to enable payments." });
    }

    const stripe = getStripe();
    
    let mode: any = 'payment';
    let priceData: any = {
      currency: 'usd',
      product_data: {
        name: serviceName,
        description: `A.R.E.S. Elite Sports Vision appointment at our ${officeId} location.`,
      },
      unit_amount: price * 100, // Stripe uses cents
    };

    if (serviceId === 'training-4-pack' || serviceId === 'training-8-pack') {
       mode = 'subscription';
       priceData.recurring = { interval: 'month' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${APP_URL}/book/${serviceId}?office=${officeId}&success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/book/${serviceId}?office=${officeId}&canceled=true`,
      metadata: {
        serviceId,
        officeId,
        product_name: serviceName,
        package_type: serviceId === 'training-20-pack' ? '20-pack' : serviceId === 'training-40-pack' ? '40-pack' : null,
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating stripe session:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

app.get("/api/checkout-session/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe configuration missing" });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(id);
    res.json({
      status: session.payment_status,
      serviceId: session.metadata?.serviceId,
      officeId: session.metadata?.officeId,
      productId: session.metadata?.product_id,
      productIds: session.metadata?.product_ids,
      productName: session.metadata?.product_name,
      shop: session.metadata?.shop,
      cart: session.metadata?.cart
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Performance Shop checkout. Price is looked up SERVER-SIDE from the product
// catalog (src/data/products.ts) so the browser can never set its own price.
app.post("/api/create-shop-checkout-session", async (req, res) => {
  try {
    const { productId, mode: requestedMode } = req.body || {};
    const product = productId ? getProduct(productId) : undefined;

    if (!product) {
      return res.status(400).json({ error: "Unknown product." });
    }
    if (product.purchase !== "stripe" && product.purchase !== "stripe-both") {
      return res.status(400).json({ error: "This product is not purchasable via checkout." });
    }
    if (product.inStock === false) {
      return res.status(400).json({ error: "This product is currently out of stock." });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable payments." });
    }

    const wantsSubscription =
      requestedMode === "subscription" &&
      product.purchase === "stripe-both" &&
      typeof product.subscribePrice === "number";

    const mode: "payment" | "subscription" = wantsSubscription ? "subscription" : "payment";
    const unitPrice = wantsSubscription ? (product.subscribePrice as number) : product.price;

    const priceData: any = {
      currency: "usd",
      product_data: {
        name: product.name,
        description: product.tagline,
      },
      unit_amount: Math.round(unitPrice * 100),
    };
    if (wantsSubscription) {
      priceData.recurring = { interval: product.subscribeInterval || "month" };
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: priceData, quantity: 1 }],
      mode,
      allow_promotion_codes: true,
      success_url: `${APP_URL}/shop/success?product=${product.slug}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/shop/${product.slug}`,
      metadata: {
        shop: "true",
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        is_digital: product.digitalFile ? "true" : "false",
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating shop checkout session:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

// Multi-item cart checkout (one-time payment items only; subscriptions use the single-item flow).
app.post("/api/create-cart-checkout-session", async (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable payments." });
    }

    const line_items: any[] = [];
    const names: string[] = [];
    const ids: string[] = [];
    let anyDigital = false;

    for (const item of items) {
      const product = item?.productId ? getProduct(item.productId) : undefined;
      const qty = Math.max(1, Math.min(99, parseInt(item?.qty, 10) || 1));
      if (!product) {
        return res.status(400).json({ error: `Unknown product: ${item?.productId}` });
      }
      if (product.purchase !== "stripe" && product.purchase !== "stripe-both") {
        return res.status(400).json({ error: `${product.name} can't be added to the cart.` });
      }
      if (product.inStock === false) {
        return res.status(400).json({ error: `${product.name} is out of stock.` });
      }
      if (product.digitalFile || product.gated) anyDigital = true;
      ids.push(product.id);
      names.push(`${product.name}${qty > 1 ? ` x${qty}` : ""}`);
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name, description: product.tagline },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: qty,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${APP_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/cart`,
      metadata: {
        shop: "true",
        cart: "true",
        product_name: names.join(", ").slice(0, 480),
        product_ids: ids.join(",").slice(0, 480),
        is_digital: anyDigital ? "mixed" : "false",
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

// Gated reader: streams the ACQUIRE book ONLY to verified purchasers.
// The book lives in /private (never served statically); access requires a paid Stripe session.
app.get("/api/read/acquire", async (req, res) => {
  try {
    const sessionId = String(req.query.session_id || "");
    if (!sessionId) return res.status(400).send("Missing session.");
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).send("Payments not configured.");

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const single = session.metadata?.product_id === "acquire-book";
    const inCart =
      session.metadata?.cart === "true" &&
      (session.metadata?.product_ids || "").split(",").includes("acquire-book");

    if (!paid || !(single || inCart)) {
      return res.status(403).send("Access denied. Please purchase ACQUIRE to read it.");
    }

    const candidates = [
      path.join(process.cwd(), "private", "ares-acquire-book.html"),
      path.join(process.cwd(), "ares-elite-sports-vision-website", "private", "ares-acquire-book.html"),
      "private/ares-acquire-book.html",
    ];
    const filePath = candidates.find((p) => fs.existsSync(p));
    if (!filePath) return res.status(404).send("Book file not found.");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "private, no-store");
    res.send(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("Error serving gated reader:", error);
    res.status(500).send("Could not load the book.");
  }
});

// Update booking status manually
app.patch("/api/bookings/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE payments SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
    res.json({ success: true, message: `Booking status updated to ${status}` });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// MS Bookings / CRM Webhook Endpoint to decrement sessions
app.post("/api/webhooks/bookings", express.json(), async (req, res) => {
  try {
    const { customer_email } = req.body;

    if (!customer_email) {
      return res.status(400).json({ error: "customer_email is required in the payload" });
    }

    console.log(`[Bookings Webhook] Received booking for ${customer_email}`);

    // Find active payment record with sessions_remaining > 0 for this email
    const activePayment = db.prepare(`
      SELECT id, sessions_remaining 
      FROM payments 
      WHERE customer_email = ? 
        AND payment_status = 'Paid and Confirmed' 
        AND sessions_remaining > 0
      ORDER BY created_at ASC
      LIMIT 1
    `).get(customer_email) as { id: number, sessions_remaining: number } | undefined;

    if (activePayment) {
      db.prepare(`
        UPDATE payments
        SET sessions_remaining = sessions_remaining - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(activePayment.id);
      
      console.log(`[Bookings Webhook] Decremented sessions for payment ID ${activePayment.id}. Remaining: ${activePayment.sessions_remaining - 1}`);
      return res.json({ success: true, message: "Session decremented", remaining: activePayment.sessions_remaining - 1 });
    } else {
      console.log(`[Bookings Webhook] No active sessions found for ${customer_email}`);
      return res.status(404).json({ error: "No active sessions remaining for this user" });
    }
  } catch (error) {
    console.error("Error processing bookings webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Stripe Webhook Endpoint
app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event: Stripe.Event;

    if (!sig || !endpointSecret) {
      console.error("[Stripe Webhook] Missing signature or STRIPE_WEBHOOK_SECRET");
      return res.status(400).send("Webhook Error: Missing signature or STRIPE_WEBHOOK_SECRET");
    }

    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe] Checkout Session completed for session ${session.id}`);
        
        const clientEmail = session.customer_details?.email || null;
        const customerId = typeof session.customer === 'string' ? session.customer : null;
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
        const amountPaid = session.amount_total;
        const currency = session.currency;
        const productName = session.metadata?.product_name || 'Service Purchase';
        const packageType = session.metadata?.package_type || null;
        
        let sessionsPurchased = null;
        if (packageType === '20-pack') sessionsPurchased = 20;
        else if (packageType === '40-pack') sessionsPurchased = 40;
        
        let membershipType = null;
        let billingInterval = null;
        if (session.mode === 'subscription') {
          membershipType = session.metadata?.membership_type || null;
          billingInterval = 'monthly'; // Assume monthly for subscriptions based on requirements
          if (membershipType === '4-per-month') sessionsPurchased = 4;
          else if (membershipType === '8-per-month') sessionsPurchased = 8;
        }

        const existing = db.prepare("SELECT id FROM payments WHERE stripe_checkout_session_id = ?").get(session.id);
        
        if (existing) {
          db.prepare(`
            UPDATE payments SET 
              payment_status = 'Paid and Confirmed', 
              stripe_payment_intent_id = ?,
              stripe_subscription_id = ?,
              stripe_customer_id = ?,
              updated_at = CURRENT_TIMESTAMP 
            WHERE stripe_checkout_session_id = ?
          `).run(paymentIntentId, subscriptionId, customerId, session.id);
        } else {
          db.prepare(`
            INSERT INTO payments (
              customer_email, stripe_customer_id, stripe_checkout_session_id, stripe_payment_intent_id,
              stripe_subscription_id, product_name, payment_status, amount_paid, currency,
              package_type, membership_type, sessions_purchased, sessions_remaining, billing_interval,
              webhook_event_id
            ) VALUES (?, ?, ?, ?, ?, ?, 'Paid and Confirmed', ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            clientEmail, customerId, session.id, paymentIntentId,
            subscriptionId, productName, amountPaid, currency,
            packageType, membershipType, sessionsPurchased, sessionsPurchased, billingInterval,
            event.id
          );
        }

        // Suppress nurture campaign for the lead
        if (clientEmail) {
          const lead = db.prepare("SELECT id, status FROM leads WHERE email = ?").get(clientEmail) as { id: number, status: string } | undefined;
          if (lead) {
            db.prepare("UPDATE leads SET status = 'Evaluation Scheduled', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);
            db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, 'Evaluation Scheduled')").run(lead.id, lead.status);
            console.log(`[Stripe Webhook] Updated lead ${clientEmail} status to 'Evaluation Scheduled'`);
          }
        }

        // Performance Shop: order confirmation + automatic digital delivery (single or cart)
        if (resend && clientEmail && session.metadata?.shop === 'true') {
          try {
            const idList = session.metadata?.cart === 'true'
              ? (session.metadata?.product_ids || '').split(',').filter(Boolean)
              : (session.metadata?.product_id ? [session.metadata.product_id] : []);
            const btn = 'background:#2998AA;color:#0B0F2A;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;';
            const deliveries: string[] = [];
            let hasPhysical = false;
            for (const pid of idList) {
              const sp = getProduct(pid);
              if (!sp) continue;
              if (sp.gated && sp.readerPath) {
                const url = `${APP_URL}${sp.readerPath}?session_id=${session.id}`;
                deliveries.push(`<p><a href="${url}" style="${btn}">Read ${sp.name}</a></p><p style="font-size:12px;color:#888;">Access link: ${url}</p>`);
              } else if (sp.digitalFile) {
                const url = `${APP_URL}${sp.digitalFile}`;
                deliveries.push(`<p><a href="${url}" style="${btn}">Download ${sp.name}</a></p><p style="font-size:12px;color:#888;">Or paste this link: ${url}</p>`);
              } else {
                hasPhysical = true;
              }
            }
            const deliveryBlock =
              (deliveries.length ? `<p>Your digital items are ready:</p>${deliveries.join('')}` : '') +
              (hasPhysical ? `<p>We're preparing the rest of your order and will follow up with shipping or pickup details shortly.</p>` : '');
            await resend.emails.send({
              from: SENDER_EMAIL,
              to: clientEmail,
              subject: `Order Confirmed | Ares Elite Sports Vision`,
              html: `
                <h2>Thank you for your order!</h2>
                <p>We've received your purchase of <strong>${productName}</strong>.</p>
                ${deliveryBlock || `<p>We'll be in touch shortly.</p>`}
                <p>Questions? Just reply to this email.</p>
                <p>— Ares Elite Sports Vision</p>
              `,
            });
          } catch (e) {
            console.error("Failed to send shop confirmation email:", e);
          }
        }

        if (resend && clientEmail && session.metadata?.shop !== 'true') {
          try {
            await resend.emails.send({
              from: SENDER_EMAIL,
              to: clientEmail,
              subject: "Reservation Access Unlocked - Ares Elite Sports Vision",
              html: `
                <h2>Payment Successful - Access Unlocked</h2>
                <p>Hello,</p>
                <p>Thank you for your payment. You now have access to our scheduling system.</p>
                <p>If you haven't completed your booking yet, please use <a href="${APP_URL}/login">the Client Portal</a> to schedule your sessions.</p>
                <p>We look forward to seeing you.</p>
              `
            });
          } catch (e) {
            console.error("Failed to send success email:", e);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const intentId = paymentIntent.id;
        console.log(`[Stripe] Payment succeeded for intent ${intentId}`);
        
        db.prepare(
          "UPDATE payments SET payment_status = 'Paid and Confirmed', updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?"
        ).run(intentId);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const intentId = paymentIntent.id;
        console.log(`[Stripe] Payment failed for intent ${intentId}`);
        
        db.prepare(
           "UPDATE payments SET payment_status = 'Payment Failed', updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?"
        ).run(intentId);
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status; // active, past_due, canceled
        
        db.prepare(
           "UPDATE payments SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?"
        ).run(status, subscription.id);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        db.prepare(
           "UPDATE payments SET payment_status = 'Canceled', updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?"
        ).run(subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Could reset sessions_remaining for monthly memberships here if needed.
        if ((invoice as any).subscription) {
          db.prepare(
            "UPDATE payments SET payment_status = 'Paid and Confirmed', sessions_remaining = sessions_purchased, updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?"
          ).run((invoice as any).subscription as string);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          db.prepare(
            "UPDATE payments SET payment_status = 'Payment Failed', updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?"
          ).run((invoice as any).subscription as string);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : "Unknown"}`);
  }
});

app.post("/api/resource-download", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      sport,
      resourceName,
      howHeard,
      howHeardOther,
      referralCode,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage
    } = req.body;
    
    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    const parsedRef = parseReferralCode(referralCode);
    const confidence = checkSourceConfidence(howHeard, referralCode, utmSource);
    const calculatedSource = determineSourceString(howHeard, referralCode, utmSource);

    // Send notification to A.R.E.S. team
    if (resend) {
      try {
        const emailTo = ['dminor@areselitesportsvision.com', 'jguler@areselitesportsvision.com', 'drl@areselitesportsvision.com'];
        await resend.emails.send({
          from: 'A.R.E.S. Website <onboarding@areselitesportsvision.com>',
          to: emailTo,
          subject: `New Resource Download: ${firstName} ${lastName || ''}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0e111a; color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #29b6f6; max-width: 600px;">
              <h2 style="color: #29b6f6; border-bottom: 1px solid #1f2937; padding-bottom: 12px; margin-top: 0;">New Lead via Resource Download</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold; width: 40%;">Lead Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${firstName} ${lastName || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Sport:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${sport || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Resource:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${resourceName || 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Lead Source (Manual):</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${howHeard || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Referral Code:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${referralCode || 'None'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Source Confidence:</td>
                  <td style="padding: 8px 0;"><span style="background-color: ${confidence === 'High' ? '#66bb6a' : '#ef5350'}; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${confidence}</span></td>
                </tr>
              </table>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send team notification:", emailError);
      }
    }
    
    // Insert/Update Lead
    try {
      const existingLead = db.prepare("SELECT id, status FROM leads WHERE email = ?").get(email) as any;
      if (existingLead) {
        const currentStatus = existingLead.status;
        const finalStatus = (currentStatus === 'Evaluation Scheduled' || currentStatus === 'Unsubscribed' || currentStatus === 'Not Interested' || currentStatus === 'Became Client')
          ? currentStatus
          : 'Nurture Campaign Active';

        db.prepare(`
          UPDATE leads SET 
            first_name = ?, last_name = ?, sport = ?, 
            utm_source = COALESCE(utm_source, ?),
            utm_medium = COALESCE(utm_medium, ?),
            utm_campaign = COALESCE(utm_campaign, ?),
            utm_content = COALESCE(utm_content, ?),
            utm_term = COALESCE(utm_term, ?),
            how_heard = COALESCE(how_heard, ?),
            how_heard_other = COALESCE(how_heard_other, ?),
            referral_code = COALESCE(referral_code, ?),
            affiliate_code = COALESCE(affiliate_code, ?),
            referral_partner_name = COALESCE(referral_partner_name, ?),
            referral_partner_type = COALESCE(referral_partner_type, ?),
            last_touch_source = ?,
            source_confidence = ?,
            status = ?,
            notes = COALESCE(notes || '', '') || ? || '\n',
            updated_at = CURRENT_TIMESTAMP
          WHERE email = ?
        `).run(
          firstName, lastName || null, sport || null,
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null,
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type,
          calculatedSource, confidence, finalStatus,
          resourceName ? `Downloaded Resource: ${resourceName}` : '',
          email
        );
      } else {
        const firstTouch = calculatedSource;
        db.prepare(`
          INSERT INTO leads (
            first_name, last_name, email, sport, lead_source, 
            utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page,
            how_heard, how_heard_other, referral_code, affiliate_code,
            referral_partner_name, referral_partner_type, first_touch_source, last_touch_source,
            source_confidence, status, notes
          ) VALUES (?, ?, ?, ?, 'Website', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Nurture Campaign Active', ?)
        `).run(
          firstName, lastName || null, email, sport || null,
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null, landingPage || '/',
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type, firstTouch, firstTouch,
          confidence, resourceName ? `Downloaded Resource: ${resourceName}` : null
        );
      }
      
      // Trigger sequence processor immediately for Day 0 email
      setTimeout(() => processEmailSequences(), 1000);
    } catch (dbError: any) {
      console.error("Failed to insert/update lead record in resource download route:", dbError);
    }
    
    res.json({ success: true, message: "Resource downloaded and notification sent." });
  } catch (error) {
    console.error("Error processing resource download:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      sport,
      message,
      howHeard,
      howHeardOther,
      referralCode,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage
    } = req.body;
    
    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    const parsedRef = parseReferralCode(referralCode);
    const confidence = checkSourceConfidence(howHeard, referralCode, utmSource);
    const calculatedSource = determineSourceString(howHeard, referralCode, utmSource);

    // Send notification to A.R.E.S. team
    if (resend) {
      try {
        const emailTo = ['dminor@areselitesportsvision.com', 'jguler@areselitesportsvision.com', 'drl@areselitesportsvision.com'];
        await resend.emails.send({
          from: 'A.R.E.S. Website <onboarding@areselitesportsvision.com>',
          to: emailTo,
          subject: `New Contact Request: ${firstName} ${lastName || ''}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0e111a; color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #29b6f6; max-width: 600px;">
              <h2 style="color: #29b6f6; border-bottom: 1px solid #1f2937; padding-bottom: 12px; margin-top: 0;">New Contact Request</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold; width: 40%;">Lead Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${firstName} ${lastName || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Sport:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${sport || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Lead Source (Manual):</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${howHeard || 'N/A'} ${howHeardOther ? `(${howHeardOther})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Referral / Affiliate Code:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${referralCode || 'None'} ${parsedRef.name ? `-> Resolved to: ${parsedRef.name} (${parsedRef.type})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">UTM Tags:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace; font-size: 11px;">
                    Source: ${utmSource || 'N/A'}<br/>
                    Medium: ${utmMedium || 'N/A'}<br/>
                    Campaign: ${utmCampaign || 'N/A'}<br/>
                    Content: ${utmContent || 'N/A'}<br/>
                    Term: ${utmTerm || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Source Confidence:</td>
                  <td style="padding: 8px 0;"><span style="background-color: ${confidence === 'High' ? '#66bb6a' : '#ef5350'}; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${confidence}</span></td>
                </tr>
              </table>

              <h3 style="color: #8b5cf6; margin-top: 25px; border-bottom: 1px solid #1f2937; padding-bottom: 8px; font-size: 15px;">Message</h3>
              <p style="background-color: #1a1e2e; padding: 12px; border-radius: 8px; border: 1px solid #374151; font-family: monospace; font-size: 13px; color: #e5e7eb;">
                ${message || 'No message provided'}
              </p>
              
              <div style="margin-top: 25px; text-align: center;">
                <a href="${APP_URL}/admin" style="background-color: #29b6f6; color: #0a0b14; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px; text-transform: uppercase;">View Lead Dashboard</a>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send team notification:", emailError);
      }
    }
    
    // Insert/Update Lead
    try {
      const existingLead = db.prepare("SELECT id, status FROM leads WHERE email = ?").get(email) as any;
      if (existingLead) {
        const currentStatus = existingLead.status;
        const finalStatus = (currentStatus === 'Evaluation Scheduled' || currentStatus === 'Unsubscribed' || currentStatus === 'Not Interested' || currentStatus === 'Became Client')
          ? currentStatus
          : 'Nurture Campaign Active';

        db.prepare(`
          UPDATE leads SET 
            first_name = ?, last_name = ?, sport = ?, 
            utm_source = COALESCE(utm_source, ?),
            utm_medium = COALESCE(utm_medium, ?),
            utm_campaign = COALESCE(utm_campaign, ?),
            utm_content = COALESCE(utm_content, ?),
            utm_term = COALESCE(utm_term, ?),
            how_heard = COALESCE(how_heard, ?),
            how_heard_other = COALESCE(how_heard_other, ?),
            referral_code = COALESCE(referral_code, ?),
            affiliate_code = COALESCE(affiliate_code, ?),
            referral_partner_name = COALESCE(referral_partner_name, ?),
            referral_partner_type = COALESCE(referral_partner_type, ?),
            last_touch_source = ?,
            source_confidence = ?,
            status = ?,
            notes = COALESCE(notes || '', '') || ? || '\n',
            updated_at = CURRENT_TIMESTAMP
          WHERE email = ?
        `).run(
          firstName, lastName || null, sport || null,
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null,
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type,
          calculatedSource, confidence, finalStatus,
          message ? `Contact Form Message: ${message}` : '',
          email
        );

        if (currentStatus !== finalStatus) {
          db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, ?)")
            .run(existingLead.id, currentStatus, finalStatus);
        }
      } else {
        const firstTouch = calculatedSource;
        const result = db.prepare(`
          INSERT INTO leads (
            first_name, last_name, email, sport, lead_source, 
            utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page,
            how_heard, how_heard_other, referral_code, affiliate_code,
            referral_partner_name, referral_partner_type, first_touch_source, last_touch_source,
            source_confidence, status, notes
          ) VALUES (?, ?, ?, ?, 'Website', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Nurture Campaign Active', ?)
        `).run(
          firstName, lastName || null, email, sport || null,
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null, landingPage || '/',
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type, firstTouch, firstTouch,
          confidence, message ? `Contact Form Message: ${message}` : null
        );

        db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, 'Nurture Campaign Active')")
          .run(result.lastInsertRowid, null);
      }
      
      // Trigger sequence processor immediately for Day 0 email
      setTimeout(() => processEmailSequences(), 1000);
      
      res.json({ success: true, message: "Contact request received. Sequence started." });
    } catch (dbError: any) {
      console.error("Failed to insert/update lead record in contact route:", dbError);
      res.status(500).json({ error: "Failed to store contact request." });
    }
  } catch (error) {
    console.error("Error processing contact request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/submit-assessment", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      athleteName,
      parentGuardianName,
      age,
      sport,
      leadSource,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage,
      questionnaireScore,
      questionnaireData,
      rawRtAvg,
      rawRtFastest,
      rawRtSlowest,
      rawRtFalsePositives,
      choiceRtPurpleAvg,
      choiceRtPurpleAcc,
      choiceRtTealAvg,
      choiceRtTealAcc,
      choiceRtPostErrorSlowing,
      recSpeedAvg,
      recSpeedAcc,
      howHeard,
      howHeardOther,
      referralCode,
      role,
      competitiveLevel,
      location,
      urgency,
      desiredNextStep,
      consent,
      bottleneckProfile,
      primaryConcern
    } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    // Check if evaluation is already scheduled
    const booked = db.prepare("SELECT id FROM payments WHERE customer_email = ? AND payment_status = 'Paid and Confirmed'").get(email);
    const initialStatus = booked ? 'Evaluation Scheduled' : 'Nurture Campaign Active';

    // Parse referral code and check source confidence
    const parsedRef = parseReferralCode(referralCode);
    const confidence = checkSourceConfidence(howHeard, referralCode, utmSource);
    const calculatedSource = determineSourceString(howHeard, referralCode, utmSource);

    // Calculate lead score and category
    const leadScore = calculateLeadScore({
      role: role || null,
      competitiveLevel: competitiveLevel || null,
      location: location || null,
      urgency: urgency || null,
      phone: phone || null,
      referralCode: referralCode || null,
      desiredNextStep: desiredNextStep || null,
      booked: !!booked
    });
    const leadCategory = getLeadCategory(leadScore);

    // 1. Insert or Update Lead (Merge duplicates)
    try {
      const existingLead = db.prepare("SELECT id, status FROM leads WHERE email = ?").get(email) as any;
      if (existingLead) {
        const currentStatus = existingLead.status;
        const finalStatus = (currentStatus === 'Evaluation Scheduled' || currentStatus === 'Unsubscribed' || currentStatus === 'Not Interested' || currentStatus === 'Became Client')
          ? currentStatus
          : initialStatus;

        let evalScheduledDate = null;
        if (finalStatus === 'Evaluation Scheduled') {
          evalScheduledDate = new Date().toISOString();
        }

        db.prepare(`
          UPDATE leads SET 
            first_name = ?, last_name = ?, phone = ?, athlete_name = ?, 
            parent_guardian_name = ?, sport = ?, age = ?, 
            utm_source = COALESCE(utm_source, ?),
            utm_medium = COALESCE(utm_medium, ?),
            utm_campaign = COALESCE(utm_campaign, ?),
            utm_content = COALESCE(utm_content, ?),
            utm_term = COALESCE(utm_term, ?),
            how_heard = COALESCE(how_heard, ?),
            how_heard_other = COALESCE(how_heard_other, ?),
            referral_code = COALESCE(referral_code, ?),
            affiliate_code = COALESCE(affiliate_code, ?),
            referral_partner_name = COALESCE(referral_partner_name, ?),
            referral_partner_type = COALESCE(referral_partner_type, ?),
            last_touch_source = ?,
            source_confidence = ?,
            assessment_completed_date = COALESCE(assessment_completed_date, CURRENT_TIMESTAMP),
            evaluation_scheduled_date = COALESCE(evaluation_scheduled_date, ?),
            status = ?,
            icp_segment = ?,
            competitive_level = ?,
            location = ?,
            bottleneck_profile = ?,
            primary_concern = ?,
            lead_score = ?,
            lead_category = ?,
            urgency = ?,
            desired_next_step = ?,
            consent = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE email = ?
        `).run(
          firstName, lastName || null, phone || null, athleteName || null,
          parentGuardianName || null, sport || null, age || null,
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null,
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type,
          calculatedSource, confidence, evalScheduledDate,
          finalStatus, role || null, competitiveLevel || null, location || null,
          bottleneckProfile || null, primaryConcern || null, leadScore, leadCategory, urgency || null,
          desiredNextStep || null, consent ? 1 : 0, email
        );

        if (currentStatus !== finalStatus) {
          db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, ?)")
            .run(existingLead.id, currentStatus, finalStatus);
        }
      } else {
        const firstTouch = calculatedSource;
        const evalScheduledDate = (initialStatus === 'Evaluation Scheduled') ? new Date().toISOString() : null;

        const result = db.prepare(`
          INSERT INTO leads (
            first_name, last_name, email, phone, athlete_name, 
            parent_guardian_name, sport, age, lead_source, 
            utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page,
            how_heard, how_heard_other, referral_code, affiliate_code,
            referral_partner_name, referral_partner_type, first_touch_source, last_touch_source,
            source_confidence, assessment_completed_date, evaluation_scheduled_date, status,
            icp_segment, competitive_level, location, bottleneck_profile, primary_concern, lead_score,
            lead_category, urgency, desired_next_step, consent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          firstName, lastName || null, email, phone || null, athleteName || null,
          parentGuardianName || null, sport || null, age || null, leadSource || 'Website',
          utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null, landingPage || '/',
          howHeard || null, howHeardOther || null, referralCode || null,
          (parsedRef.type === 'Affiliate Partner' ? referralCode : null),
          parsedRef.name, parsedRef.type, firstTouch, firstTouch,
          confidence, evalScheduledDate, initialStatus, role || null, competitiveLevel || null,
          location || null, bottleneckProfile || null, primaryConcern || null, leadScore, leadCategory, urgency || null,
          desiredNextStep || null, consent ? 1 : 0
        );

        db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, ?)")
          .run(result.lastInsertRowid, null, initialStatus);
      }
      
      // Trigger sequence processor immediately for Day 0 email
      setTimeout(() => processEmailSequences(), 1000);
    } catch (dbError: any) {
      console.error("Failed to insert/update lead record:", dbError);
    }

    // 2. Insert detailed assessment data
    try {
      const stmt = db.prepare(`
        INSERT INTO assessments (
          email, questionnaire_score, questionnaire_data, raw_rt_avg, raw_rt_fastest,
          raw_rt_slowest, raw_rt_false_positives, choice_rt_purple_avg, choice_rt_purple_acc,
          choice_rt_teal_avg, choice_rt_teal_acc, choice_rt_post_error_slowing,
          rec_speed_avg, rec_speed_acc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        email, questionnaireScore, questionnaireData, rawRtAvg, rawRtFastest,
        rawRtSlowest, rawRtFalsePositives, choiceRtPurpleAvg, choiceRtPurpleAcc,
        choiceRtTealAvg, choiceRtTealAcc, choiceRtPostErrorSlowing,
        recSpeedAvg, recSpeedAcc
      );
    } catch (dbError: any) {
      console.error("Failed to insert assessment record:", dbError);
    }

    // 3. Send Report Email to User & Lead Alert to Team
    if (resend) {
      try {
        const candidateRecommendation = questionnaireScore >= 120 
          ? "High Priority Candidate (Severe visual-cognitive bottlenecks detected. High training potential)" 
          : "Candidate Approved (Strong baseline, but with room to optimize and shave off critical reaction latency)";

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0e111a; color: #ffffff; border-radius: 10px; border: 1px solid #1f2937;">
            <div style="text-align: center; border-bottom: 2px solid #29b6f6; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 24px; text-transform: uppercase; margin: 0; letter-spacing: 1px;">A.R.E.S. Sensory Telemetry Report</h1>
              <p style="color: #29b6f6; font-size: 14px; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 2px;">Elite Performance Analytics</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5; color: #e5e7eb;">Hello <strong>${firstName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.5; color: #9ca3af;">Thank you for completing the A.R.E.S. Sports Vision and Cognitive Evaluation. Below is your initial performance telemetry report measuring sensory acquisition, decision processing, and motor response times.</p>
            
            <div style="background-color: #1a1e2e; border: 1px solid #374151; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #8b5cf6; margin-top: 0; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom: 8px;">1. Visual Symptoms Questionnaire</h3>
              <p style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 10px 0 5px 0;">${questionnaireScore} <span style="font-size: 16px; color: #9ca3af; font-weight: normal;">/ 200</span></p>
              <p style="font-size: 14px; color: #29b6f6; margin: 0;"><strong>Recommendation:</strong> ${candidateRecommendation}</p>
            </div>
            
            <div style="background-color: #1a1e2e; border: 1px solid #374151; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #29b6f6; margin-top: 0; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom: 8px;">2. Raw Reaction Speed</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Average Reaction Time:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${rawRtAvg}ms</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Fastest Trial:</td>
                  <td style="padding: 6px 0; text-align: right; color: #29b6f6; font-weight: bold; font-family: monospace; font-size: 14px;">${rawRtFastest}ms</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Slowest Trial:</td>
                  <td style="padding: 6px 0; text-align: right; color: #f87171; font-weight: bold; font-family: monospace; font-size: 14px;">${rawRtSlowest}ms</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">False Positives:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-family: monospace; font-size: 14px;">${rawRtFalsePositives}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #1a1e2e; border: 1px solid #374151; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #8b5cf6; margin-top: 0; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom: 8px;">3. Choice Reaction & Accuracy</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Purple Target Average:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${choiceRtPurpleAvg}ms (${choiceRtPurpleAcc}% Acc)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Teal Target Average:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${choiceRtTealAvg}ms (${choiceRtTealAcc}% Acc)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Post-Error Slowing:</td>
                  <td style="padding: 6px 0; text-align: right; color: #fbbf24; font-weight: bold; font-family: monospace; font-size: 14px;">${choiceRtPostErrorSlowing >= 0 ? '+' : ''}${choiceRtPostErrorSlowing}ms</td>
                </tr>
              </table>
              <p style="font-size: 11px; color: #9ca3af; margin-top: 10px; line-height: 1.3;">*Post-Error Slowing measures your cognitive recovery speed immediately following a mistake. Elite athletes typically recover with minimal post-error latency.</p>
            </div>

            <div style="background-color: #1a1e2e; border: 1px solid #374151; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #29b6f6; margin-top: 0; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom: 8px;">4. Recognition Speed & Memory</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Average Recognition Speed:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${recSpeedAvg}ms</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Spatial Recall Accuracy:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${recSpeedAcc}%</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 15px;">
              <a href="${APP_URL}/book/evaluation" style="background-color: #29b6f6; color: #0a0b14; padding: 14px 28px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Book Full 75-Min In-Office Evaluation</a>
            </div>
            
            <p style="font-size: 12px; text-align: center; color: #6b7280; line-height: 1.4; margin-top: 30px; border-top: 1px solid #1f2937; padding-top: 15px;">
              Ares Elite Sports Vision // Milliseconds Matter™<br/>
              510 W. Carmel Dr. Carmel, IN 46032
            </p>
          </div>
        `;

        // Send Report to User
        await resend.emails.send({
          from: SENDER_EMAIL,
          to: email,
          subject: "A.R.E.S. Cognitive Assessment Telemetry Report",
          html: htmlContent
        });

        // Send Alert to Team
        const evalBookedLabel = booked ? "YES - evaluation scheduled and paid" : "NO - nurture campaign active";
        const emailTo = ['dminor@areselitesportsvision.com', 'jguler@areselitesportsvision.com', 'drl@areselitesportsvision.com'];

        const subjectLine = leadScore >= 75
          ? `HOT LEAD: ${firstName} ${lastName || ''} - ${sport || role || 'Elite'} - Score: ${leadScore}`
          : `[Lead Alert] Assessment Completed: ${firstName} ${lastName || ''} (Score: ${leadScore})`;

        await resend.emails.send({
          from: 'A.R.E.S. Onboarding <onboarding@areselitesportsvision.com>',
          to: emailTo,
          subject: subjectLine,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0e111a; color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #29b6f6; max-width: 600px;">
              <h2 style="color: ${leadScore >= 75 ? '#ef5350' : '#29b6f6'}; border-bottom: 1px solid #1f2937; padding-bottom: 12px; margin-top: 0;">
                ${leadScore >= 75 ? '🔥 [HOT LEAD ALERT] Assessment Completed' : '[Lead Alert] Assessment Completed'}
              </h2>
              <p>A new visitor has completed the interactive assessment and sensory drills.</p>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold; width: 40%;">Lead Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${firstName} ${lastName || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Role / ICP Segment:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${role || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Competitive Level:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${competitiveLevel || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${location || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Athlete Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${athleteName || 'N/A (Self)'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Parent/Guardian:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${parentGuardianName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Contact Info:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${email} / ${phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Sport & Age:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${sport || 'N/A'} (Age: ${age || 'N/A'})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Lead Score:</td>
                  <td style="padding: 8px 0; color: ${leadScore >= 75 ? '#ef5350' : '#29b6f6'}; font-weight: bold; font-family: monospace;">
                    ${leadScore} / 100 (${leadCategory} Lead)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Timeline / Urgency:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${urgency || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Desired Next Step:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${desiredNextStep || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Consent Opt-In:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${consent ? 'YES (Opted In)' : 'NO'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Lead Source (Manual):</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${howHeard || 'N/A'} ${howHeardOther ? `(${howHeardOther})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Referral / Affiliate Code:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${referralCode || 'None'} ${parsedRef.name ? `-> Resolved to: ${parsedRef.name} (${parsedRef.type})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">UTM Tags:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace; font-size: 11px;">
                    Source: ${utmSource || 'N/A'}<br/>
                    Medium: ${utmMedium || 'N/A'}<br/>
                    Campaign: ${utmCampaign || 'N/A'}<br/>
                    Content: ${utmContent || 'N/A'}<br/>
                    Term: ${utmTerm || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Source Confidence:</td>
                  <td style="padding: 8px 0;"><span style="background-color: ${confidence === 'High' ? '#66bb6a' : '#ef5350'}; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${confidence}</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Evaluation Booked:</td>
                  <td style="padding: 8px 0;"><span style="background-color: ${booked ? '#66bb6a' : '#ef5350'}; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${evalBookedLabel}</span></td>
                </tr>
              </table>

              <h3 style="color: #8b5cf6; margin-top: 25px; border-bottom: 1px solid #1f2937; padding-bottom: 8px; font-size: 15px;">Assessment Results Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold; width: 40%;">Primary Bottleneck:</td>
                  <td style="padding: 8px 0; color: #29b6f6; font-weight: bold; font-family: monospace;">${bottleneckProfile || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Visual Symptom Score:</td>
                  <td style="padding: 8px 0; color: #8b5cf6; font-weight: bold; font-family: monospace;">${questionnaireScore} / 200</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Raw Reaction Avg:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${rawRtAvg}ms (Fastest: ${rawRtFastest}ms, FP: ${rawRtFalsePositives})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Choice Accuracy:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">Teal: ${choiceRtTealAcc}% / Purple: ${choiceRtPurpleAcc}%</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Post-Error Slowing:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${choiceRtPostErrorSlowing}ms</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-weight: bold;">Recognition speed:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${recSpeedAvg}ms (${recSpeedAcc}% Accuracy)</td>
                </tr>
              </table>
              
              <div style="margin-top: 25px; text-align: center;">
                <a href="${APP_URL}/admin" style="background-color: #29b6f6; color: #0a0b14; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px; text-transform: uppercase;">View Lead Dashboard</a>
              </div>
            </div>
          `
        });

      } catch (emailError) {
        console.error("Failed to send assessment emails via Resend:", emailError);
      }
    }

    res.json({ success: true, message: "Assessment received and processed successfully." });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET all leads for Admin panel
app.get("/api/leads", (req, res) => {
  try {
    const leads = db.prepare(`
      SELECT 
        l.id, l.first_name, l.last_name, l.email, l.phone, l.athlete_name, 
        l.parent_guardian_name, l.sport, l.age, l.lead_source, 
        l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content, l.utm_term, l.landing_page, 
        l.status, l.created_at, l.updated_at,
        l.how_heard, l.how_heard_other, l.referral_code, l.affiliate_code,
        l.referral_partner_name, l.referral_partner_type, l.first_touch_source, l.last_touch_source,
        l.conversion_source, l.assessment_completed_date, l.evaluation_scheduled_date,
        l.evaluation_completed_date, l.became_client_date, l.source_confidence,
        l.manually_verified_source, l.lead_owner, l.notes,
        (SELECT questionnaire_score FROM assessments WHERE email = l.email ORDER BY created_at DESC LIMIT 1) as questionnaire_score,
        (SELECT created_at FROM assessments WHERE email = l.email ORDER BY created_at DESC LIMIT 1) as assessment_date
      FROM leads l
      ORDER BY l.created_at DESC
    `).all();
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update lead status manually from Admin panel
app.patch("/api/leads/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const lead = db.prepare("SELECT status, how_heard, referral_code, utm_source FROM leads WHERE id = ?").get(id) as any;
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    let dateFieldQuery = "";
    const params: any[] = [status];

    if (status === 'Became Client') {
      dateFieldQuery = ", became_client_date = COALESCE(became_client_date, CURRENT_TIMESTAMP)";
    } else if (status === 'Evaluation Scheduled') {
      dateFieldQuery = ", evaluation_scheduled_date = COALESCE(evaluation_scheduled_date, CURRENT_TIMESTAMP)";
    } else if (status === 'Evaluation Completed') {
      dateFieldQuery = ", evaluation_completed_date = COALESCE(evaluation_completed_date, CURRENT_TIMESTAMP)";
    }

    // Set conversion_source when they convert
    if (status === 'Evaluation Scheduled' || status === 'Became Client') {
      const convSource = determineSourceString(lead.how_heard, lead.referral_code, lead.utm_source);
      dateFieldQuery += ", conversion_source = COALESCE(conversion_source, ?)";
      params.push(convSource);
    }

    params.push(id);

    db.prepare(`UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP ${dateFieldQuery} WHERE id = ?`).run(...params);
    db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, ?)")
      .run(id, lead.status, status);

    res.json({ success: true, message: `Lead status updated to ${status}` });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Manual override for admin growth attribution cleanup
app.patch("/api/leads/:id/attribution", (req, res) => {
  try {
    const { id } = req.params;
    const { manuallyVerifiedSource, leadOwner, notes } = req.body;

    if (!manuallyVerifiedSource) {
      return res.status(400).json({ error: "manuallyVerifiedSource is required" });
    }

    const lead = db.prepare("SELECT id FROM leads WHERE id = ?").get(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    db.prepare(`
      UPDATE leads SET 
        manually_verified_source = ?,
        lead_owner = COALESCE(?, lead_owner),
        notes = COALESCE(?, notes),
        source_confidence = 'High',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(manuallyVerifiedSource, leadOwner || null, notes || null, id);

    res.json({ success: true, message: "Lead attribution manually verified and updated." });
  } catch (error) {
    console.error("Error manual verifying lead attribution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET funnel analytics data for dashboard tab
app.get("/api/funnel-analytics", (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const newLeads7d = db.prepare("SELECT COUNT(*) as count FROM leads WHERE created_at >= ?").get(sevenDaysAgo) as { count: number };
    const evalsBooked7d = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Evaluation Scheduled' AND updated_at >= ?").get(sevenDaysAgo) as { count: number };
    
    const conversionRate7d = newLeads7d.count > 0 ? Math.round((evalsBooked7d.count / newLeads7d.count) * 100) : 0;
    
    const activeNurture = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Nurture Campaign Active' OR status LIKE 'Email % Sent'").get() as { count: number };
    
    const unscheduledLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status != 'Evaluation Scheduled' AND status != 'Unsubscribed' AND status != 'Not Interested' AND status != 'Became Client'").get() as { count: number };
    const pipelineOpportunity = unscheduledLeads.count * 449;

    const stages = {
      active: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Nurture Campaign Active'").get() as { count: number }).count,
      email1: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 1 Sent'").get() as { count: number }).count,
      email2: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 2 Sent'").get() as { count: number }).count,
      email3: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 3 Sent'").get() as { count: number }).count,
      email4: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 4 Sent'").get() as { count: number }).count,
      email5: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 5 Sent'").get() as { count: number }).count,
      email6: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Email 6 Sent'").get() as { count: number }).count,
      final: (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Final Follow-Up Sent'").get() as { count: number }).count
    };

    const sourceStats = db.prepare("SELECT lead_source, COUNT(*) as count FROM leads GROUP BY lead_source").all() as { lead_source: string, count: number }[];
    const sources = sourceStats.map(s => {
      const sourceConv = db.prepare("SELECT COUNT(*) as count FROM leads WHERE lead_source = ? AND status = 'Evaluation Scheduled'").get(s.lead_source) as { count: number };
      const rate = s.count > 0 ? Math.round((sourceConv.count / s.count) * 100) : 0;
      return {
        source: s.lead_source || 'Website',
        count: s.count,
        converted: sourceConv.count,
        rate
      };
    });

    const hotLeads = db.prepare(`
      SELECT id, first_name, last_name, email, sport, status, created_at
      FROM leads
      WHERE (sport LIKE '%pro%' OR sport LIKE '%elite%' OR sport LIKE '%coach%' OR sport LIKE '%facility%' OR sport LIKE '%team%' OR status = 'Final Follow-Up Sent')
        AND status != 'Evaluation Scheduled' AND status != 'Unsubscribed' AND status != 'Not Interested' AND status != 'Became Client'
      ORDER BY created_at DESC
      LIMIT 10
    `).all() as any[];

    res.json({
      summary: {
        newLeads7d: newLeads7d.count,
        evalsBooked7d: evalsBooked7d.count,
        conversionRate7d,
        activeNurture: activeNurture.count,
        pipelineOpportunity
      },
      stages,
      sources,
      hotLeads: hotLeads.map(l => ({
        id: l.id,
        name: `${l.first_name} ${l.last_name || ''}`.trim(),
        email: l.email,
        sport: l.sport || 'N/A',
        status: l.status,
        reason: l.status === 'Final Follow-Up Sent' ? 'Nurture Runout' : 'Strategic / Elite Lead'
      }))
    });
  } catch (error) {
    console.error("Error fetching funnel analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET unsubscribe route
app.get("/api/unsubscribe", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send("Email parameter is required.");
  }
  try {
    const lead = db.prepare("SELECT id, status FROM leads WHERE email = ?").get(email) as any;
    if (lead) {
      db.prepare("UPDATE leads SET status = 'Unsubscribed', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);
      db.prepare("INSERT INTO lead_status_history (lead_id, old_status, new_status) VALUES (?, ?, 'Unsubscribed')").run(lead.id, lead.status);
    }
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #0e111a; color: #ffffff; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="color: #29b6f6; margin-bottom: 20px; text-transform: uppercase;">Unsubscribed</h1>
        <p style="color: #9ca3af; font-size: 16px;">You have been successfully removed from our training updates.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Ares Elite Sports Vision // Carmel Headquarters</p>
      </div>
    `);
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Endpoint to manually trigger sequence processing (for testing)
app.post("/api/trigger-sequence", (req, res) => {
  processEmailSequences();
  res.json({ success: true, message: "Sequence processor triggered" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Run once on startup to catch up
    processEmailSequences();
  });
}

startServer();
