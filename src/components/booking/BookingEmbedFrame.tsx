import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { OfficeLocation } from '../../config/booking';

interface BookingEmbedFrameProps {
  office: OfficeLocation;
  serviceType?: string;
}

export function BookingEmbedFrame({ office, serviceType }: BookingEmbedFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Construct URL with service parameter if provided
  const bookingUrl = serviceType 
    ? `${office.bookingUrl}${office.bookingUrl.includes('?') ? '&' : '?'}service=${serviceType}`
    : office.bookingUrl;

  // Reset loading state when office changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Fallback timeout in case iframe onload doesn't fire
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [office.id]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <motion.div
      key={office.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Scheduling: {office.name}</h2>
          <p className="text-white/60 text-sm mt-1">
            Access unlocked. Please select your time slot below to finalize your reservation.
          </p>
          {office.id === 'ganassi' && (
            <div className="mt-3 inline-flex items-start sm:items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-orange-400" />
              <p>
                <strong>Note:</strong> Only active members of Chip Ganassi Racing can book through this link. All other bookings should be completed through the Carmel Offices.
              </p>
            </div>
          )}
        </div>
        <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-[var(--color-ares-border)] text-white text-sm font-medium transition-colors shrink-0"
        >
          Open in new tab <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      <div className="responsive-iframe-wrapper relative w-full bg-white rounded-2xl overflow-hidden shadow-glow border border-[var(--color-ares-border)] min-h-[720px] md:min-h-[800px]">
        
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--color-ares-charcoal)] flex flex-col items-center justify-center z-10"
            >
              <Loader2 className="w-10 h-10 text-[var(--color-ares-teal)] animate-spin mb-4" />
              <p className="text-white/60 font-medium tracking-wide">Loading booking system...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {hasError ? (
          <div className="absolute inset-0 bg-[var(--color-ares-charcoal)] flex flex-col items-center justify-center z-10 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Unable to load booking system</h3>
            <p className="text-white/60 mb-6 max-w-md">
              There was a problem loading the Microsoft Bookings interface. You can still book your appointment by opening the booking page directly.
            </p>
            <a 
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white font-medium transition-colors"
            >
              Open Booking Page <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        ) : (
          <iframe
            src={bookingUrl}
            className="absolute inset-0 w-full h-full border-none min-h-[720px]"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={`Book appointment at ${office.name}`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
          />
        )}
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-[100] md:hidden">
         <button
           onClick={() => window.history.back()}
           className="w-full inline-flex justify-center items-center px-6 py-4 rounded-2xl bg-[var(--color-ares-charcoal)]/95 backdrop-blur-md border border-[var(--color-ares-border)] text-white font-bold transition-colors shadow-2xl"
         >
           <ArrowLeft className="w-5 h-5 mr-2" />
           Back to Options
         </button>
      </div>
    </motion.div>
  );
}
