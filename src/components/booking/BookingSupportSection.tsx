import { Phone, Mail, HelpCircle } from 'lucide-react';
import { BOOKING_CONFIG } from '../../config/booking';

export function BookingSupportSection() {
  return (
    <div className="max-w-4xl mx-auto w-full mt-24">
      <div className="bg-gradient-to-br from-[var(--color-ares-purple)]/20 to-[var(--color-ares-teal)]/10 border border-[var(--color-ares-border)] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[var(--color-ares-purple)]/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-ares-border)]">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-ares-teal)]" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Need Manual Assistance?</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            If you're having trouble finding a time that works, or if you need to coordinate a team booking, our staff is ready to help you directly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <a 
              href={`tel:${BOOKING_CONFIG.support.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--color-ares-border)] transition-colors w-full sm:w-auto justify-center group"
            >
              <Phone className="w-5 h-5 text-[var(--color-ares-teal)] group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">{BOOKING_CONFIG.support.phone}</span>
            </a>
            
            <a 
              href={`mailto:${BOOKING_CONFIG.support.email}`}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--color-ares-border)] transition-colors w-full sm:w-auto justify-center group"
            >
              <Mail className="w-5 h-5 text-[var(--color-ares-teal)] group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
