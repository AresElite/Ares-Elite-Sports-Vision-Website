import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

// Simple, dependency-free contact page: a button that opens the visitor's own
// email app straight to info@, plus a click-to-call phone number. No server,
// no form submission — nothing that can fail.
export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Ares Elite Sports Vision | Location & Inquiries"
        description="Contact Ares Elite Sports Vision in Carmel, IN. Email info@areselitesportsvision.com or call (773) 981-1447 to learn more about sports vision training."
        path="/contact"
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-24 pb-12 flex flex-col items-center">
        <div className="max-w-2xl w-full px-6 sm:px-8">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors group mb-8">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] p-8 sm:p-12 rounded-xl shadow-glow"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Contact Us</h1>
            <p className="text-white/70 mb-10 leading-relaxed">
              Ready to unlock your visual-cognitive potential? Reach out directly and Dr. Joe LaPlaca will be in touch.
            </p>

            {/* Primary actions — open the visitor's email app / phone dialer */}
            <div className="space-y-4 mb-10">
              <a
                href="mailto:info@areselitesportsvision.com?subject=Website%20Inquiry"
                className="w-full flex items-center justify-center gap-3 bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(41,182,246,0.3)] hover:shadow-[0_0_30px_rgba(41,182,246,0.5)]"
              >
                <Mail className="w-5 h-5" />
                Email info@areselitesportsvision.com
              </a>
              <a
                href="tel:+17739811447"
                className="w-full flex items-center justify-center gap-3 border border-[var(--color-ares-teal)]/40 text-white font-bold py-4 rounded-xl hover:bg-[var(--color-ares-teal)]/10 transition-all"
              >
                <Phone className="w-5 h-5 text-[var(--color-ares-teal)]" />
                Call (773) 981-1447
              </a>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[var(--color-ares-border)]">
              <div>
                <h3 className="text-[var(--color-ares-teal)] font-bold mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</h3>
                <a href="mailto:info@areselitesportsvision.com" className="text-white/80 hover:text-white transition-colors text-sm break-all">info@areselitesportsvision.com</a>
              </div>
              <div>
                <h3 className="text-[var(--color-ares-teal)] font-bold mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</h3>
                <a href="tel:+17739811447" className="text-white/80 hover:text-white transition-colors text-sm">(773) 981-1447</a>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-[var(--color-ares-teal)] font-bold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Carmel Headquarters</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  510 W. Carmel Dr., 2nd Floor<br />
                  (Inside Elemental Fitness)<br />
                  Carmel, IN 46032
                </p>
              </div>
            </div>

            {/* Arrival & Parking Guidance */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-8 text-xs text-white/80 leading-relaxed">
              <span className="font-bold text-[var(--color-ares-teal)] uppercase tracking-wider block mb-1 font-mono">Arrival &amp; Parking Note</span>
              We are located inside the Elemental Fitness facility on the 2nd Floor. Ample free parking is available directly in front of the main building entrance.
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
