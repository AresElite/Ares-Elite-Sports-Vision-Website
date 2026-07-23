// Ares Elite Sports Vision — Performance Shop catalog.
// This file is the SINGLE SOURCE OF TRUTH for product pricing and is imported by
// BOTH the client (display) and the server (price authority for Stripe checkout).
// Never trust a price sent from the browser — the server looks prices up here by id.

export type ProductCategory = 'bundles' | 'supplements' | 'tools' | 'eyewear' | 'digital' | 'merch';

// stripe        -> one-time Stripe Checkout
// stripe-both   -> one-time OR subscribe & save (recurring)
// external      -> link out (e.g. Fullscript dispensary / affiliate). No Stripe.
// free          -> free download (lead magnet)
export type PurchaseType = 'stripe' | 'stripe-both' | 'external' | 'free';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  price: number;                 // USD one-time
  subscribePrice?: number;       // USD recurring (if stripe-both)
  subscribeInterval?: 'month';   // Stripe recurring interval
  compareAt?: number;            // shown struck-through
  features: string[];
  badges?: string[];             // e.g. "NSF Certified for Sport"
  purchase: PurchaseType;
  externalUrl?: string;          // for external products
  externalLabel?: string;
  digitalFile?: string;          // path under /downloads for digital/free
  gated?: boolean;               // served only to verified purchasers (e.g. the book reader)
  readerPath?: string;           // in-app reader route for gated products
  includes?: string[];           // bundle: product ids this purchase also unlocks
  inStock?: boolean;
  note?: string;                 // small print on the product page
}

// NOTE: replace FULLSCRIPT_URL with your real dispensary link once your account is live.
export const FULLSCRIPT_URL = 'https://us.fullscript.com/welcome/aresvision';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  bundles: 'Bundles & Kits',
  supplements: 'Supplements',
  eyewear: 'Eyewear',
  tools: 'Vision Training Tools',
  digital: 'Digital Training',
  merch: 'Ares Merch',
};

export const MERCH_STORE_URL = 'https://ares-elite-sports-vision-shop.fourthwall.com';

export const PRODUCTS: Product[] = [
  // ---------- BUNDLES & KITS ----------
  {
    id: 'ares-series-bundle',
    slug: 'complete-ares-series',
    name: 'The Complete A.R.E.S. Series — All 4 Books',
    category: 'bundles',
    tagline: 'The entire performance loop: Acquire, Route, Execute, Synchronize',
    description:
      'All four books of the A.R.E.S. Performance Loop in one purchase — the full story of athletic vision, from the first flash of light to smooth, game-speed performance. ACQUIRE (seeing), ROUTE (deciding), EXECUTE (moving), and SYNCHRONIZE (holding it together under pressure). Each opens in its own interactive reader, unlocked instantly.',
    price: 129,
    compareAt: 156,
    features: [
      'ACQUIRE — Book 1: how the eyes catch what matters',
      'ROUTE — Book 2: The Decision Architecture',
      'EXECUTE — Book 3: The Motor Output Architecture',
      'SYNCHRONIZE — Book 4: The Integration Architecture',
      'Save $27 versus buying individually',
    ],
    badges: ['Best Value'],
    purchase: 'stripe',
    includes: ['acquire-book', 'route-book', 'execute-book', 'synchronize-book'],
    inStock: true,
    note: 'All four books are delivered as private, purchase-protected in-browser readers — your access links arrive by email after checkout.',
  },
  {
    id: 'drills-bundle',
    slug: 'complete-drill-program',
    name: 'The Complete Drill Program — Both 4-Week Programs',
    category: 'bundles',
    tagline: 'Eight weeks of training: vision first, then eye-hand',
    description:
      'The complete 8-week visual training progression for developing athletes. Start with Beginner Drills to build solid tracking, focus, and eye control over four weeks. Then step up to Eye-Hand Coordination Drills to sharpen reaction speed and quick decision making under pressure.',
    price: 24,
    compareAt: 28,
    features: [
      'Beginner Sports Performance Drills — 8 drills, 28 days',
      'Eye-Hand Coordination Drills — 11 families, 35+ levels, 28 days',
      'Eight weeks of programming in the right order',
      'Both trackers save your progress as you go',
    ],
    badges: ['Best Value'],
    purchase: 'stripe',
    includes: ['beginner-drills', 'eye-hand-drills'],
    inStock: true,
    note: 'Both programs are delivered as private, purchase-protected in-browser readers — your access links arrive by email after checkout.',
  },
  {
    id: 'ares-elite-starter-kit',
    slug: 'elite-starter-kit',
    name: 'Ares Elite Starter Kit',
    category: 'bundles',
    tagline: 'Supplement, program & tool — the complete starting point',
    description:
      'The fastest way to start training your visual system inside and out. Includes a 3-month supply of MacuHealth VisionEdge Pro, the Sports Vision Playbook, and an Ares Reaction Ball — everything an athlete needs to begin.',
    price: 109,
    compareAt: 127,
    features: [
      'MacuHealth VisionEdge Pro (3-month supply)',
      'The Sports Vision Playbook (digital)',
      'Ares Reaction Ball',
      'Save $18 vs. buying separately',
    ],
    badges: ['Best Seller'],
    purchase: 'stripe',
    inStock: true,
    note: 'Bundle ships physical items and emails digital access.',
  },
  {
    id: 'home-training-bundle',
    slug: 'home-training-bundle',
    name: 'Home Vision Training Bundle',
    category: 'bundles',
    tagline: 'Everything to train vision at home — gear + program',
    description:
      'The complete at-home training package: the Ares Home Vision Training Kit, the Sports Vision Playbook, and the Training Log & Tracker.',
    price: 79,
    compareAt: 87,
    features: [
      'Ares Home Vision Training Kit',
      'The Sports Vision Playbook (digital)',
      'Training Log & Tracker (digital)',
      'Everything to start and measure progress',
    ],
    badges: ['Great Value'],
    purchase: 'stripe',
    inStock: true,
  },

  // ---------- SUPPLEMENTS ----------
  {
    id: 'macuhealth-visionedge-pro',
    slug: 'visionedge-pro',
    name: 'MacuHealth VisionEdge Pro',
    category: 'supplements',
    tagline: 'The vision-performance supplement made for athletes',
    description:
      'Targeted daily eye and brain nutrition built for athletes. Packed with natural plant pigments and pure omega-3 fish oil, this daily softgel helps your eyes adapt to glare, read low-contrast targets faster, and recover quickly between intense sessions. 90 softgels = a full 3-month training block.',
    price: 85,
    features: [
      '90 softgels — 3-month supply',
      'Eye-protecting plant pigments + 300 mg omega-3 (DHA/EPA)',
      'Helps with glare recovery and seeing low-contrast targets',
      'Save 10% with practice code 12129 at checkout on MacuHealth.com',
    ],
    badges: ['Practitioner Recommended', 'Code 12129 · 10% Off'],
    purchase: 'external',
    externalUrl:
      'https://www.macuhealth.com/product/macuhealth-vision-edge-pro-supplement-for-eye-support/',
    externalLabel: 'Buy at MacuHealth.com — 10% off with Code 12129',
    inStock: true,
    note: 'Ordering direct from MacuHealth with our practice code 12129 saves you 10% and links your purchase to Ares Elite Sports Vision. These statements have not been evaluated by the FDA.',
  },
  {
    id: 'nuun-sport-hydration',
    slug: 'nuun-sport-hydration',
    name: 'Nuun Sport Hydration',
    category: 'supplements',
    tagline: 'NSF Certified for Sport electrolytes',
    description:
      'Clean, light-tasting electrolyte tablets to keep athletes hydrated through training and competition. NSF Certified for Sport — safe for drug-tested athletes.',
    price: 8.99,
    features: [
      '10 tablets per tube',
      '300 mg sodium + potassium, magnesium & more',
      'Flavors: Tri-Berry, Strawberry Lemonade, Lemon Lime',
      'Light, easy taste — great for everyday hydration',
    ],
    badges: ['NSF Certified for Sport'],
    purchase: 'stripe',
    inStock: true,
  },
  {
    id: 'fullscript-dispensary',
    slug: 'athlete-supplement-dispensary',
    name: 'Athlete Supplement Dispensary',
    category: 'supplements',
    tagline: 'NSF-certified protein, creatine, omega-3 & greens',
    description:
      'Our practitioner-curated store for clean, athlete-tested supplements like protein, creatine, and omega-3s. Every product is NSF Certified for Sport so you get pure performance without banned ingredients.',
    price: 0,
    features: [
      'NSF Certified for Sport protein & creatine',
      'Omega-3 fish oil (eye & brain support)',
      'Foundational greens blends',
      'Ships direct — curated by Ares Elite Sports Vision',
    ],
    badges: ['NSF Certified for Sport'],
    purchase: 'external',
    externalUrl: FULLSCRIPT_URL,
    externalLabel: 'Open Our Dispensary',
  },

  // ---------- EYEWEAR ----------
  {
    id: 'ares-heritage-sunglasses',
    slug: 'heritage-wood-sunglasses',
    name: 'Ares Heritage Sunglasses',
    category: 'eyewear',
    tagline: 'Hand-finished wood frames, polarized UV400',
    description:
      'See sharper and look unforgettable. Hand-finished wood and bamboo frames in shapes you won\'t find anywhere else, with polarized UV400 lenses that cut glare and boost contrast. Laser-engraved with the Ares mark and packed in a branded pouch.',
    price: 59,
    features: ['Real wood / bamboo frames', 'Polarized UV400 lenses', 'Laser-engraved Ares logo', 'Branded microfiber pouch included'],
    badges: ['Polarized · UV400'],
    purchase: 'stripe',
    inStock: true,
  },
  {
    id: 'ares-gameday-sunglasses',
    slug: 'gameday-sport-sunglasses',
    name: 'Ares Game Day Sport Sunglasses',
    category: 'eyewear',
    tagline: 'Built for the play — impact-rated, high-contrast',
    description:
      'A lightweight, impact-rated (ANSI Z87.1) wrap with polarized, high-contrast lenses and a no-slip grip that stays put through every sprint, swing, and stride. Engineered to help you track the ball and read the field in any light.',
    price: 69,
    features: ['Impact-rated ANSI Z87.1', 'Polarized high-contrast lenses', 'No-slip nose & temple grips', 'Built for baseball, cycling, running'],
    badges: ['ANSI Z87.1 · Polarized'],
    purchase: 'stripe',
    inStock: true,
  },
  {
    id: 'ares-focus-bluelight',
    slug: 'focus-blue-light-glasses',
    name: 'Ares Focus Blue-Light Glasses',
    category: 'eyewear',
    tagline: 'Recovery for the screen-time athlete',
    description:
      'Your eyes work overtime off the field too. Focus glasses filter blue light from screens and stadium panels so your visual system can recover between sessions. Lightweight, all-day comfortable, Ares-branded.',
    price: 35,
    features: ['Blue-light filtering lenses', 'Lightweight all-day comfort', 'Clear / light-tint options', 'Ares-branded'],
    purchase: 'stripe',
    inStock: true,
  },

  // ---------- VISION TRAINING TOOLS ----------
  {
    id: 'ares-vision-training-kit',
    slug: 'home-vision-training-kit',
    name: 'Ares Home Vision Training Kit',
    category: 'tools',
    tagline: 'The physical companion to the Sports Vision Playbook',
    description:
      'Everything an athlete needs to train their visual system at home: a reaction ball, a juggling/vision ball set, a Brock string for convergence, and a printed drill card that links to our full program. Train hand-eye coordination, tracking, and reaction time anywhere.',
    price: 49,
    features: ['Reaction ball + juggling/vision ball set', 'Brock string for convergence', 'Printed drill card', 'Pairs with the Sports Vision Playbook'],
    badges: ['Best Value'],
    purchase: 'stripe',
    inStock: true,
  },
  {
    id: 'ares-reaction-ball',
    slug: 'reaction-ball',
    name: 'Ares Reaction Ball',
    category: 'tools',
    tagline: 'Unpredictable bounce. Faster reactions.',
    description:
      'A six-sided reaction ball that bounces unpredictably to train reaction time and hand-eye coordination. Toss it against a wall solo or drill with a partner. Ares-branded.',
    price: 18,
    features: ['Trains reaction time & hand-eye', 'Solo or partner drills', 'Durable rubber', 'Ares-branded'],
    purchase: 'stripe',
    inStock: true,
  },
  {
    id: 'ares-juggling-set',
    slug: 'juggling-vision-ball-set',
    name: 'Ares Juggling / Vision Ball Set (3)',
    category: 'tools',
    tagline: 'The classic, proven tracking trainer',
    description:
      'A set of three weighted juggling balls — one of the most proven tools for building dynamic tracking and hand-eye coordination. Includes a quick-start drill guide.',
    price: 24,
    features: ['Set of 3 weighted balls', 'Builds tracking & hand-eye', 'Quick-start drill guide', 'Ares-branded'],
    purchase: 'stripe',
    inStock: true,
  },

  // ---------- DIGITAL ----------
  {
    id: 'acquire-book',
    slug: 'acquire-book',
    name: 'ACQUIRE — The A.R.E.S. Performance Loop, Book 1',
    category: 'digital',
    tagline: 'How elite athletes see what matters — before anyone else',
    description:
      'Book 1 of the A.R.E.S. Performance Loop. ACQUIRE is about seeing — how the eyes catch the ball, the defender, the gap, and turn it into something the brain can act on. Learn how the best athletes pick up what matters faster than their opponents, in short interactive chapters you can read, watch, and tap through on any device. Instant access after purchase.',
    price: 39,
    features: [
      'Interactive book — read, watch, and tap through on any device',
      'The complete ACQUIRE stage of the A.R.E.S. Loop',
      'The science of seeing, made practical',
      'Instant access after purchase',
    ],
    badges: ['Flagship Book'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/acquire',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser reader — your access link arrives by email after checkout.',
  },
  {
    id: 'route-book',
    slug: 'route-book',
    name: 'ROUTE — The A.R.E.S. Performance Loop, Book 2',
    category: 'digital',
    tagline: 'The decision architecture: why athletes who see correctly still decide too late',
    description:
      'Book 2 of the A.R.E.S. Performance Loop. ROUTE is the decision stage — everything that happens between seeing and acting. Learn why more options make you slower, how the brain picks "go" and holds "stop," why pressure shrinks your working memory, and how the best athletes turn what they see into the right decision faster. An interactive digital book you read, watch, and tap through.',
    price: 39,
    features: [
      'Interactive book — read, watch, and tap through on any device',
      'The complete ROUTE stage of the A.R.E.S. Loop',
      'Decision speed, Hick\'s Law & working memory under load',
      'Instant access after purchase',
    ],
    badges: ['Book 2'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/route',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser reader — your access link arrives by email after checkout.',
  },
  {
    id: 'execute-book',
    slug: 'execute-book',
    name: 'EXECUTE — The A.R.E.S. Performance Loop, Book 3',
    category: 'digital',
    tagline: 'Where the right read becomes the right move',
    description:
      'Book 3 of the A.R.E.S. Performance Loop. EXECUTE is where the decision becomes movement — how the brain plans a motion, fires it to the muscle, and times it just right to turn a correct read into a precise, repeatable action. This is where great decisions either show up on the field or die on the way to the muscle. An interactive digital book you read, watch, and tap through.',
    price: 39,
    features: [
      'Interactive book — read, watch, and tap through on any device',
      'The complete EXECUTE stage of the A.R.E.S. Loop',
      'Motor planning, drive, timing & movement precision',
      'Instant access after purchase',
    ],
    badges: ['Book 3'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/execute',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser reader — your access link arrives by email after checkout.',
  },
  {
    id: 'synchronize-book',
    slug: 'synchronize-book',
    name: 'SYNCHRONIZE — The A.R.E.S. Performance Loop, Book 4',
    category: 'digital',
    tagline: 'Why great athletes still fall apart — and how to fix it',
    description:
      'Book 4 of the A.R.E.S. Performance Loop. SYNCHRONIZE is where it all has to work together — acquisition, decision, and execution integrated into one loop that holds up under fatigue, pressure, and game speed. This is why athletes with elite individual pieces still break down in competition, and how to fix it. An interactive digital book you read, watch, and tap through.',
    price: 39,
    features: [
      'Interactive book — read, watch, and tap through on any device',
      'The complete SYNCHRONIZE stage of the A.R.E.S. Loop',
      'Integration under fatigue, pressure & game speed',
      'Instant access after purchase',
    ],
    badges: ['Book 4'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/synchronize',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser reader — your access link arrives by email after checkout.',
  },
  {
    id: 'sports-vision-playbook',
    slug: 'sports-vision-playbook',
    name: 'The Sports Vision Playbook (eBook)',
    category: 'digital',
    tagline: 'Train your eyes like you train your body',
    description:
      'The complete at-home program: the 6 visual skills that win games, how to assess your baseline, a full drill library, and a done-for-you 6-week program. Instant PDF download after purchase.',
    price: 24,
    features: ['8-page designed PDF', '6-week starter program', 'Drill library + baseline tests', 'Instant download'],
    purchase: 'stripe',
    digitalFile: '/downloads/sports-vision-playbook.pdf',
    inStock: true,
  },
  {
    id: 'sports-vision-tracker',
    slug: 'training-log-and-tracker',
    name: 'Sports Vision Training Log & Tracker',
    category: 'digital',
    tagline: 'Log every session, measure every gain',
    description:
      'A printable pack: baseline assessment, daily training log, weekly progress tracker, reaction-score chart, drill checklist, and season goal sheet. Instant PDF download.',
    price: 14,
    features: ['7-page printable PDF', 'Baseline + weekly trackers', 'Drill checklist & goal sheet', 'Instant download'],
    purchase: 'stripe',
    digitalFile: '/downloads/sports-vision-training-log-and-tracker.pdf',
    inStock: true,
  },
  {
    id: 'eye-hand-drills',
    slug: 'eye-hand-coordination-drills',
    name: 'Eye-Hand Coordination Drills — 4-Week Program',
    category: 'digital',
    tagline: '11 drill families · 35+ level progressions · all you need is 1-2 balls',
    description:
      'A complete 4-week progressive program to train fast eyes and quick hands. Eleven drill families teach your eyes to lock onto targets early and your hands to react without hesitation. Features 35+ level progressions that climb every week, plus a built-in catch-rate tracker to score your gains. All you need is one or two tennis balls.',
    price: 19,
    features: [
      '11 drill families with 35+ level progressions',
      '28-day schedule — 2 drills/day, level climbs weekly',
      'Catch/drop tracker to score every session',
      'Interactive in-browser program + downloadable PDF',
      'Equipment: 1 or 2 balls',
    ],
    badges: ['New'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/eyehand',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser program with a built-in 28-day tracker — your access link arrives by email after checkout.',
  },
  {
    id: 'beginner-drills',
    slug: 'beginner-sports-performance-drills',
    name: 'Beginner Sports Performance Drills — 4-Week Program',
    category: 'digital',
    tagline: 'Eight core drills · two a day · four weeks',
    description:
      'The ultimate 4-week starting point for young and developing athletes. Eight core visual drills build tracking speed, focus switching, and eye alignment in just 10 to 15 minutes a day. Tap to check off each day in your private online training portal. All you need is a pencil and a window.',
    price: 9,
    features: [
      '8 core drills with full instructions',
      '28-day schedule — 2 drills per day, cycled & randomized',
      'Tap-to-complete tracker that saves your progress',
      'Interactive in-browser program + downloadable PDF',
      'Equipment: a pencil and a window',
    ],
    badges: ['Start Here'],
    purchase: 'stripe',
    gated: true,
    readerPath: '/read/beginner',
    inStock: true,
    note: 'Delivered as a private, purchase-protected in-browser program with a built-in 28-day tracker — your access link arrives by email after checkout.',
  },

  // ---------- MERCH (fulfilled by Fourthwall — zero inventory) ----------
  {
    id: 'ares-merch-tee',
    slug: 'merch-tees',
    name: 'Ares Tees — Milliseconds Matter™ Edition',
    category: 'merch',
    tagline: 'Official Ares performance tee featuring MILLISECONDS MATTER™ typography',
    description:
      'Premium soft athletic tees featuring the iconic MILLISECONDS MATTER™ branding in exact matching brand typography across the chest and back. Crafted for high-performance comfort during training and game-day.',
    price: 28,
    features: [
      'Official MILLISECONDS MATTER™ brand typography',
      'Matching chest & back logo placement',
      'Premium ultra-soft athletic unisex fit — navy, black & heather',
      'Printed on demand by our fulfillment partner',
    ],
    badges: ['Official Apparel'],
    purchase: 'external',
    externalUrl: MERCH_STORE_URL,
    externalLabel: 'Shop Tees at the Ares Merch Store',
    inStock: true,
  },
  {
    id: 'ares-merch-hoodie',
    slug: 'merch-hoodies',
    name: 'Ares Hoodies — Milliseconds Matter™ Edition',
    category: 'merch',
    tagline: 'Heavyweight pullover featuring MILLISECONDS MATTER™ typography',
    description:
      'Heavyweight pullover hoodies featuring the MILLISECONDS MATTER™ brand typography styled to match the front crest logo. Built for early morning practices, travel, and intense training sessions.',
    price: 52,
    features: [
      'Official MILLISECONDS MATTER™ brand typography',
      'Heavyweight fleece pullover — navy & black',
      'Matching front crest & full back print',
      'Printed on demand by our fulfillment partner',
    ],
    badges: ['Official Apparel'],
    purchase: 'external',
    externalUrl: MERCH_STORE_URL,
    externalLabel: 'Shop Hoodies at the Ares Merch Store',
    inStock: true,
  },
  {
    id: 'ares-merch-hat',
    slug: 'merch-hats',
    name: 'Ares Hats — Milliseconds Matter™ Edition',
    category: 'merch',
    tagline: 'Embroidered cap with MILLISECONDS MATTER™ matching typography',
    description:
      'Classic structured caps and snapbacks featuring precision-embroidered MILLISECONDS MATTER™ typography across the front and back, matching the official Ares logo typography.',
    price: 30,
    features: [
      'Official MILLISECONDS MATTER™ embroidered typography',
      'Matching front logo & back embroidery placement',
      'Classic dad-cap & performance snapback styles',
      'Printed on demand by our fulfillment partner',
    ],
    badges: ['Official Apparel'],
    purchase: 'external',
    externalUrl: MERCH_STORE_URL,
    externalLabel: 'Shop Hats at the Ares Merch Store',
    inStock: true,
  },
];

export const getProduct = (idOrSlug: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

// Does a purchased product unlock the target product? True for a direct purchase,
// or when the purchase was a bundle that includes it.
export const grantsAccess = (purchasedId: string, targetProductId: string): boolean => {
  if (purchasedId === targetProductId) return true;
  const p = getProduct(purchasedId);
  return !!(p && p.includes && p.includes.includes(targetProductId));
};

// ---------------------------------------------------------------------------
// WHAT IS ACTUALLY FOR SALE RIGHT NOW.
// Only digital products are live — they need no inventory and deliver instantly.
// When physical stock arrives, just add that product's id to this set and the
// item appears in the shop and becomes purchasable. Nothing else to change.
// ---------------------------------------------------------------------------
export const LIVE_PRODUCT_IDS = new Set<string>([
  'ares-series-bundle',
  'acquire-book',
  'route-book',
  'execute-book',
  'synchronize-book',
  'drills-bundle',
  'eye-hand-drills',
  'beginner-drills',
  'macuhealth-visionedge-pro',
  'ares-merch-tee',
  'ares-merch-hoodie',
  'ares-merch-hat',
]);

// Gated readers: reader slug -> { product that unlocks it, private file on the server }.
// To add another later: drop the HTML in /private, add a product above, add a line here.
export const GATED_BOOKS: Record<string, { productId: string; file: string }> = {
  acquire: { productId: 'acquire-book', file: 'ares-acquire-book.html' },
  route: { productId: 'route-book', file: 'ares-route-book.html' },
  execute: { productId: 'execute-book', file: 'ares-execute-book.html' },
  synchronize: { productId: 'synchronize-book', file: 'ares-synchronize-book.html' },
  beginner: { productId: 'beginner-drills', file: 'ares-beginner-drills.html' },
  eyehand: { productId: 'eye-hand-drills', file: 'ares-eyehand-drills.html' },
};

// Purchase-gated file downloads: productId -> file in /private served by
// /api/download/:productId?session_id=... after Stripe verification.
export const GATED_DOWNLOADS: Record<string, { file: string; label: string }> = {
  'beginner-drills': {
    file: 'ares-beginner-sports-performance-drills.pdf',
    label: 'Beginner Sports Performance Drills (PDF)',
  },
  'eye-hand-drills': {
    file: 'ares-eye-hand-coordination-drills.pdf',
    label: 'Eye-Hand Coordination Drills (PDF)',
  },
};

export const isLive = (p: Product): boolean => LIVE_PRODUCT_IDS.has(p.id);

export const productsByCategory = (cat: ProductCategory): Product[] =>
  PRODUCTS.filter((p) => p.category === cat && isLive(p));
