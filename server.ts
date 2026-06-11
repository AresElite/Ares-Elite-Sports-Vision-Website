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
`);

// Drop old bookings table if exists to migrate to payments
db.exec(`DROP TABLE IF EXISTS bookings`);

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
const SENDER_EMAIL = "Dr. Joe LaPlaca <laplacajn@gmail.com>"; // In a real app, this needs to be a verified domain in Resend

const APP_URL = process.env.APP_URL || 'https://aresvision.com';

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

// Email Sequence Definition
const emails = [
  {
    day: 0,
    subject: "Got your message — here's what's next",
    body: (firstName: string, sport: string) => `Hi ${firstName},

Thanks for reaching out to Ares Elite Sports Vision — I got your message and wanted to follow up personally.

What you're looking into is more important than most athletes realize. Visual processing, reaction speed, and spatial tracking are trainable — and for ${sport || 'elite'} athletes specifically, that edge is often the difference between good and elite.

Here's what happens next: I'll be in touch within 24 hours to answer your questions and, if it makes sense, get you scheduled for an evaluation. The eval runs about 90 minutes and covers the full picture — from baseline visual acuity to high-speed target acquisition and cognitive processing under fatigue.

In the meantime, if you have any questions, just reply to this email.

Looking forward to connecting.

— Dr. Joe LaPlaca
Ares Elite Sports Vision
${APP_URL}/book/evaluation`
  },
  {
    day: 1,
    subject: "The gap most athletes never close",
    body: (firstName: string, sport: string) => `Hi ${firstName},

Most ${sport || 'elite'} athletes spend thousands of hours on physical conditioning. Very few spend any time on the system that controls every physical output — the visual-cognitive engine.

Your eyes don't just see the field. They calculate depth, predict movement, time reactions, and feed real-time data to your motor system — all in under 200 milliseconds. When that system is undertrained, you're slower than you need to be. Not because your legs are slow. Because your brain is late.

At AESV, we've tested and trained athletes across ${sport || 'multiple sports'} and other high-speed disciplines. The pattern is consistent: athletes who close this gap see measurable improvement in reaction time, decision accuracy, and on-field anticipation — often within the first few weeks of training.

Your evaluation is the starting point. It takes 90 minutes and maps your exact visual-cognitive profile so we know precisely where to build.

Want to get on the schedule?

Book Your Evaluation: ${APP_URL}/book/evaluation

— Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 3,
    subject: "What your eval actually looks like",
    body: (firstName: string, sport: string) => `Hi ${firstName},

I get this question a lot, so I want to walk you through what an AESV evaluation actually involves — because it's nothing like a standard eye exam.

When you come in, we assess five performance-specific areas:

1. Dynamic visual acuity — how well you process moving targets at speed
2. Saccadic precision — how fast and accurately your eyes acquire and shift between targets
3. Contrast sensitivity — how you read visual information in variable light and motion conditions
4. Depth and spatial processing — how quickly you calculate distance and object trajectory
5. Cognitive processing under load — how your visual system performs when your body is fatigued

By the end, you have a complete visual-cognitive performance profile — your strengths, your gaps, and a training roadmap built specifically for ${sport || 'your sport'}.

Athletes typically leave the eval with three things: clarity on what's been holding them back, a baseline to measure against, and a plan to move forward.

The eval is $449. If you've been on the fence, this is the clearest next step.

Reserve Your Evaluation Spot: ${APP_URL}/book/evaluation

— Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 5,
    subject: "What athletes say after their eval",
    body: (firstName: string, sport: string) => `Hi ${firstName},

One thing I hear consistently after evaluations:

"I didn't realize how much I was leaving on the table."

Athletes come in thinking their vision is fine — and technically, it often is. 20/20 vision has nothing to do with processing speed. What we find, almost universally, is that the gap isn't physical. It's the speed at which the visual system feeds information to the brain, and the brain converts that into action.

That's a trainable gap. And for ${sport || 'elite'} athletes competing at a high level, closing it matters.

If you're ready to find out exactly where you stand — and what it would take to sharpen your edge — the evaluation is the place to start.

Book Your AESV Evaluation: ${APP_URL}/book/evaluation

One slot. 90 minutes. Your complete visual-cognitive profile.

— Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 8,
    subject: "Quick question for you",
    body: (firstName: string, sport: string) => `Hi ${firstName},

Just checking in — I want to ask you one direct question:

When is your next competitive season, tryout, or key event?

The reason I ask: most athletes who train with us see the sharpest gains when they start 6–10 weeks before a high-stakes period. That window gives us enough time to run the evaluation, identify your specific gaps, and get a meaningful training cycle in before it matters most.

If that window is coming up sooner than you think, I'd rather you know now than after.

Just reply with your timeline and I'll tell you honestly whether we can make it count.

— Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 11,
    subject: "Limited eval slots this month",
    body: (firstName: string, sport: string) => `Hi ${firstName},

A quick heads-up: evaluation slots for this month are filling up, and I want to make sure you have a chance to get in before the schedule closes out.

We keep our evaluation volume intentionally limited — not as a sales tactic, but because I want to have enough time with each athlete to do the assessment properly and be present for the debrief conversation afterward.

If you've been thinking about it, now is the time to move.

Grab Your Evaluation Slot: ${APP_URL}/book/evaluation

Also — whether or not you're ready to book, here's something you can use today: a 3-drill visual warm-up protocol I built for ${sport || 'elite'} athletes that takes less than 10 minutes and can be done before any practice or competition. No equipment needed.

Download the Free Visual Warm-Up Protocol: ${APP_URL}/#system

— Dr. Joe LaPlaca
Ares Elite Sports Vision`
  },
  {
    day: 14,
    subject: "Leaving the door open",
    body: (firstName: string, sport: string) => `Hi ${firstName},

I've reached out a few times and haven't heard back — which is completely fine. Timing matters, and if this isn't the right moment, I get it.

I'm not going to keep filling your inbox. But I do want to leave you with this:

The athletes who see the most from what we do at AESV are the ones who come in before they feel like they need it — not in response to a slump or a down season, but proactively, when they're building toward something.

When the timing is right, the door is open. You can book directly at the link below, or just reply to this email and I'll get back to you personally.

Schedule Your Evaluation When You're Ready: ${APP_URL}/book/evaluation

Wishing you a strong season regardless.

— Dr. Joe LaPlaca
Ares Elite Sports Vision
aresportsvision.com`
  }
];

// Process Sequences Function
async function processEmailSequences() {
  console.log("Running email sequence processor...");
  
  // Get all active leads
  const leads = db.prepare("SELECT * FROM leads WHERE status = 'active'").all() as any[];
  
  for (const lead of leads) {
    // Calculate days since creation
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Find which emails should have been sent by now
    for (let i = 0; i < emails.length; i++) {
      const emailDef = emails[i];
      
      if (diffDays >= emailDef.day) {
        // Check if this specific email was already sent
        const log = db.prepare("SELECT * FROM email_logs WHERE lead_id = ? AND email_index = ?").get(lead.id, i);
        
        if (!log) {
          // Send email
          try {
            console.log(`Sending email ${i} (Day ${emailDef.day}) to ${lead.email}`);
            
            if (resend) {
              await resend.emails.send({
                from: SENDER_EMAIL,
                to: lead.email,
                subject: emailDef.subject,
                text: emailDef.body(lead.first_name, lead.sport || 'elite')
              });
            } else {
              console.log("RESEND_API_KEY not set. Simulating email send:");
              console.log(`Subject: ${emailDef.subject}`);
              console.log(`To: ${lead.email}`);
            }
            
            // Log it
            db.prepare("INSERT INTO email_logs (lead_id, email_index) VALUES (?, ?)").run(lead.id, i);
            
            // If this was the last email, mark lead as completed
            if (i === emails.length - 1) {
              db.prepare("UPDATE leads SET status = 'completed' WHERE id = ?").run(lead.id);
            }
          } catch (error) {
            console.error(`Failed to send email ${i} to ${lead.email}:`, error);
          }
        }
      }
    }
  }
}

// Run cron job every day at 9:00 AM
cron.schedule('0 9 * * *', () => {
  processEmailSequences();
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
      officeId: session.metadata?.officeId
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to verify payment" });
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

        if (resend && clientEmail) {
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
    const { firstName, lastName, email, sport, resourceName } = req.body;
    
    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    // Send notification to A.R.E.S. team
    if (resend) {
      try {
        await resend.emails.send({
          from: 'A.R.E.S. Website <onboarding@resend.dev>',
          to: ['drl@areselitesportsvision.com'],
          subject: `New Resource Download: ${firstName} ${lastName}`,
          html: `
            <h2>New Lead via Resource Download</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sport:</strong> ${sport || 'Not specified'}</p>
            <p><strong>Resource Downloaded:</strong> ${resourceName || 'Unknown Resource'}</p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send team notification:", emailError);
      }
    }
    
    // Insert lead
    try {
      const stmt = db.prepare("INSERT INTO leads (first_name, last_name, email, sport) VALUES (?, ?, ?, ?)");
      stmt.run(firstName, lastName || null, email, sport || null);
      
      // Trigger sequence processor immediately for Day 0 email
      setTimeout(() => processEmailSequences(), 1000);
    } catch (dbError: any) {
      // If email exists, we just ignore it as it's already a lead
    }
    
    res.json({ success: true, message: "Resource downloaded and notification sent." });
  } catch (error) {
    console.error("Error processing resource download:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, sport, message } = req.body;
    
    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    // Send notification to A.R.E.S. team
    if (resend) {
      try {
        await resend.emails.send({
          from: 'A.R.E.S. Website <onboarding@resend.dev>', // Use a verified domain in production
          to: ['drl@areselitesportsvision.com'], // Send to Dr. LaPlaca
          subject: `New Contact Request: ${firstName} ${lastName}`,
          html: `
            <h2>New Contact Request</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sport:</strong> ${sport || 'Not specified'}</p>
            <p><strong>Message:</strong> ${message || 'No message provided'}</p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send team notification:", emailError);
      }
    }
    
    // Insert lead
    try {
      const stmt = db.prepare("INSERT INTO leads (first_name, last_name, email, sport) VALUES (?, ?, ?, ?)");
      const info = stmt.run(firstName, lastName || null, email, sport || null);
      
      // Trigger sequence processor immediately for Day 0 email
      setTimeout(() => processEmailSequences(), 1000);
      
      res.json({ success: true, message: "Contact request received. Sequence started." });
    } catch (dbError: any) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "This email is already in our system." });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error processing contact request:", error);
    res.status(500).json({ error: "Internal server error" });
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
