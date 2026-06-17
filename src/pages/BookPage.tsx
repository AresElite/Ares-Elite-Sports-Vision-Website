import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKING_CONFIG } from '../config/booking';
import { BookingEmbedFrame } from '../components/booking/BookingEmbedFrame';
import { BookingFAQ } from '../components/booking/BookingFAQ';
import { BookingSupportSection } from '../components/booking/BookingSupportSection';
import { ChevronRight, CheckCircle2, Loader2, AlertCircle, ExternalLink, ArrowRight, UserPlus, Users, Award, RefreshCw } from 'lucide-react';

export function BookPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  const sessionId = searchParams.get('session_id');
  const isSuccess = searchParams.get('success') === 'true';

  // Verify payment if session_id and success are present
  useEffect(() => {
    async function verifyPayment() {
      if (sessionId && isSuccess) {
        setIsVerifying(true);
        try {
          const response = await fetch(`/api/checkout-session/${sessionId}`);
          if (!response.ok) {
            throw new Error('Payment verification failed');
          }
          const data = await response.json();
          if (data.status === 'paid' || data.status === 'active' || data.status === 'open') {  // added open for invoice-based
            setIsPaid(true);
            if (data.officeId) setSelectedOfficeId(data.officeId);
            // Scroll to embed
            setTimeout(() => {
              embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
          } else {
            console.log("Stripe status not confirmed:", data.status);
            setPaymentError("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Verification error:", error);
          setPaymentError("Unable to verify payment. Please check your connection.");
        } finally {
          setIsVerifying(false);
        }
      }
    }

    verifyPayment();
  }, [sessionId, isSuccess]);

  // Handle initial load from URL parameter for office
  useEffect(() => {
    const officeParam = searchParams.get('office');
    if (officeParam && BOOKING_CONFIG.offices.some(o => o.id === officeParam)) {
      setSelectedOfficeId(officeParam);
    }
  }, [searchParams]);

  const handleSelectOffice = (officeId: string) => {
    setSelectedOfficeId(officeId);
    setSearchParams(prev => {
      prev.set('office', officeId);
      return prev;
    });
  };

  const handlePayment = async (serviceId: string, price: number, name: string) => {
    if (!selectedOfficeId && !serviceId.startsWith('training-')) return;
    
    setIsRedirecting(true);
    // If it's a subscription or package, it doesn't necessarily need a facility, but we default to CARMEL HQ
    const safeOffice = selectedOfficeId || 'office1';

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: serviceId,
          officeId: safeOffice,
          serviceName: name,
          price: price
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error instanceof Error ? error.message : "Error starting checkout. Please try again.");
      setIsRedirecting(false);
    }
  };

  const renderNewAthleteFlow = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <button onClick={() => navigate('/book')} className="text-white/60 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to options
        </button>

        <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-white uppercase tracking-tight leading-tight">
            A 75-minute A.R.E.S. Performance Evaluation that maps where your athlete is losing milliseconds and gives a clear training plan.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-ares-teal)] uppercase mb-4">What Is Measured</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-1.5 shrink-0"></span>
                  <span><strong>Dynamic Acuity & Contrast Sensitivity:</strong> Gaze tracking and tracking accuracy at high speeds.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-1.5 shrink-0"></span>
                  <span><strong>Choice reaction speed:</strong> Millisecond latency chain when resolving complex choices.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-1.5 shrink-0"></span>
                  <span><strong>Peripheral awareness & multi-object tracking:</strong> Capturing flank targets under load.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-1.5 shrink-0"></span>
                  <span><strong>Post-Error recovery speed:</strong> Visual-cognitive resilience immediately after making a mistake.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[var(--color-ares-purple)] uppercase mb-4">How it Differs From Static Eye Exams</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                A standard 20/20 eye exam checks static optical clarity while sitting in a dark room. It misses 80% of sports vision requirements. We check your visual operating system under G-force, stress, and physical fatigue to find real athletic latency gaps.
              </p>
              <h3 className="text-base font-bold text-white uppercase mb-2">What You Leave With</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                An empirical neuro-performance telemetry dashboard detailing your latency metrics, plus a custom 12-week progression plan to shave off critical visual bottlenecks.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button 
                onClick={() => embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="py-4 px-8 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold text-sm tracking-widest uppercase transition-all shadow-glow text-center cursor-pointer"
              >
                Book Baseline Evaluation ($449)
              </button>
              <Link 
                to="/assessment"
                className="py-4 px-8 rounded-xl border border-[var(--color-ares-purple)] text-white hover:bg-[var(--color-ares-purple)]/10 font-bold text-sm tracking-widest uppercase transition-all text-center"
              >
                Start Assessment
              </Link>
              <Link 
                to="/contact"
                className="py-4 px-8 rounded-xl border border-white/20 text-white hover:bg-white/5 font-bold text-sm tracking-widest uppercase transition-all text-center"
              >
                Schedule Team Consultation
              </Link>
            </div>
            <div className="text-right mt-4 lg:mt-0 font-mono text-xs text-white/40 uppercase tracking-wider shrink-0">
              * Carmel HQ Location Only
            </div>
          </div>
        </div>
        
        {/* Acuity Scheduler Iframe */}
        <div ref={embedRef} className="scroll-mt-32">
          <div className="bg-white rounded-2xl overflow-hidden shadow-glow mb-24 min-h-[800px] relative z-10 w-full p-2">
            <iframe
              src="https://areselite.as.me/schedule/45c1a107/appointment/40353533/calendar/8034424?appointmentTypeIds[]=40353533"
              title="Schedule Appointment"
              width="100%"
              height="800"
              frameBorder="0"
              className="w-full h-full border-none min-h-[800px]"
            ></iframe>
            <script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
          </div>
        </div>
      </div>
    );
  };

  const renderExistingClientFlow = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <button onClick={() => navigate('/book')} className="text-white/60 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to options
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Client Scheduling & Training</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Active clients can schedule their sessions or purchase additional training packages below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
             <div className="w-16 h-16 rounded-full bg-[var(--color-ares-purple)]/20 flex items-center justify-center mb-6">
                <RefreshCw className="w-8 h-8 text-[var(--color-ares-purple)]" />
             </div>
             <h3 className="text-2xl font-bold mb-4 uppercase">Book a Re-Evaluation</h3>
             <p className="text-white/60 mb-8 flex-1">
               Follow-up assessment to measure your progress and adjust training protocols. Only for existing athletes who have already completed an initial Evaluation.
             </p>
             <div className="text-2xl font-bold mb-6">$299</div>
             <button
                onClick={() => navigate('/book/re-evaluation')}
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-all text-lg cursor-pointer"
             >
               Start Re-Evaluation Booking
             </button>
          </div>

          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
             <div className="w-16 h-16 rounded-full bg-[var(--color-ares-teal)]/20 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[var(--color-ares-teal)]" />
             </div>
             <h3 className="text-2xl font-bold mb-4 uppercase">Purchase Packages & Memberships</h3>
             <p className="text-white/60 mb-8 flex-1">
               Purchase session packages or monthly training subscriptions directly online through our secure portal.
             </p>
             <div className="text-2xl font-bold mb-6">Packages & Plans</div>
             <button
                onClick={() => navigate('/book/packages')}
                className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold transition-all text-lg cursor-pointer uppercase tracking-wider"
             >
               View Store Options
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReevalFlow = () => {
    const service = BOOKING_CONFIG.services.find(s => s.id === 're-evaluation')!;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <button onClick={() => navigate('/book/client')} className="text-white/60 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to client options
        </button>

        {!isPaid && !isSuccess ? (
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Book a Re-Evaluation</h2>
                <p className="text-white/70 mb-6 text-lg">
                  Measure your progress and let us adjust your training protocols based on new baseline data.
                </p>
                <div className="bg-[var(--color-ares-purple)]/10 border border-[var(--color-ares-purple)]/30 rounded-xl p-5 mb-8">
                  <p className="text-sm text-[var(--color-ares-purple)] font-bold mb-2">Important:</p>
                  <p className="text-sm text-white/70 leading-relaxed">This booking path is exclusively for clients who have already completed their initial $449 Performance Evaluation. If you have not, please select New Athlete Evaluation instead.</p>
                </div>
                <div className="text-4xl font-bold text-[var(--color-ares-purple)] mb-2">${service.price}</div>
                <div className="text-white/50 text-sm">Re-evaluation fee</div>
              </div>
              <div className="flex-1 w-full bg-black/30 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Step 1: Select Location</h3>
                <div className="space-y-3">
                  {BOOKING_CONFIG.offices.filter(o => o.servicesOffered.includes('re-evaluation')).map(office => (
                    <button
                      key={office.id}
                      onClick={() => handleSelectOffice(office.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedOfficeId === office.id 
                        ? 'bg-[var(--color-ares-purple)]/20 border-[var(--color-ares-purple)] shadow-[0_0_20px_rgba(139,92,246,0.15)] text-white' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70 hover:text-white'
                      }`}
                    >
                      <div className="font-bold">{office.name}</div>
                      <div className="text-sm opacity-70 truncate">{office.description}</div>
                    </button>
                  ))}
                </div>

                {selectedOfficeId && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="font-bold mb-4">Step 2: Secure Reservation</h3>
                    <button
                      onClick={() => handlePayment(service.id, service.price!, service.name)}
                      disabled={isRedirecting}
                      className="w-full py-4 rounded-xl bg-[var(--color-ares-purple)] hover:bg-[var(--color-ares-purple)]/90 text-white font-bold text-lg shadow-glow transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isRedirecting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                      ) : (
                        <>Complete Payment to Schedule <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Payment Success state / Embed */}
        {selectedOfficeId && (isPaid || isSuccess) && (
          <div ref={embedRef} className="scroll-mt-32">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-center gap-4 text-emerald-200">
              <div className="p-3 rounded-full bg-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Payment Confirmed</h4>
                <p className="text-sm opacity-90">Please select your date and time below to confirm your re-evaluation directly in our system.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-glow mb-24 min-h-[600px] relative z-10 w-[min(100vw,100%)] p-2">
              <BookingEmbedFrame office={BOOKING_CONFIG.offices.find(o=>o.id === selectedOfficeId)!} serviceType="re-evaluation" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeamFlow = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto text-center mb-24">
        <button onClick={() => navigate('/book')} className="text-white/60 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to options
        </button>
        <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 shadow-xl">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Users className="w-10 h-10 text-white/80" />
           </div>
           <h2 className="text-3xl font-bold mb-4">Book a Discovery Call</h2>
           <p className="text-white/70 mb-8 text-lg">
             For teams, facilities, organizations, and coaches. Discuss integrating the A.R.E.S. framework into your existing environment. Custom pricing and scheduling apply.
           </p>
           <a
             href="mailto:drl@areselitesportsvision.com?subject=Team/Facility Consultation Request"
             className="inline-flex py-4 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-lg transition-all items-center justify-center gap-2 shadow-glow w-full sm:w-auto"
           >
             Email Dr. Joe LaPlaca Directly
             <ExternalLink className="w-5 h-5 mx-1" />
           </a>
        </div>
      </div>
    );
  };

  const renderPackagePurchaseFlow = () => {
    let title = "Training Package";
    let price = 0;
    
    if (type === 'training-20-pack') { title = "20-Session Package"; price = 1999; }
    if (type === 'training-40-pack') { title = "40-Session Package"; price = 3599; }
    if (type === 'training-4-pack') { title = "4 Sessions / Month"; price = 399; }
    if (type === 'training-8-pack') { title = "8 Sessions / Month"; price = 599; }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto text-center mb-24">
        <button onClick={() => navigate('/book/client')} className="text-white/60 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to client options
        </button>
        <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-white/60 mb-8 text-lg">Purchase this package via Stripe to add it to your account for booking future sessions.</p>
          <div className="text-5xl font-bold text-[var(--color-ares-teal)] mb-10">
            ${price} {type?.includes('-pack') && (type.startsWith('training-4-') || type.startsWith('training-8-')) ? <span className="text-2xl text-[var(--color-ares-teal)]/50">/mo</span> : ""}
          </div>
          
          <button
             onClick={() => handlePayment(type!, price, title)}
             disabled={isRedirecting}
             className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-glow"
          >
            {isRedirecting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <>Complete Secure Payment <ExternalLink className="w-5 h-5 mx-1" /></>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderPackagesFlow = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <button onClick={() => navigate('/book/client')} className="text-white/60 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to client options
        </button>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white uppercase tracking-tight">Purchase Training Packages & Subscriptions</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Select a session package or monthly training subscription below to purchase and secure your credits.
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-glow mb-24 min-h-[900px] relative z-10 w-full p-2">
          <iframe
            src="https://areselite.as.me/schedule/45c1a107"
            title="Purchase Training Packages & Subscriptions"
            width="100%"
            height="900"
            frameBorder="0"
            className="w-full h-full border-none min-h-[900px]"
          ></iframe>
        </div>
      </div>
    );
  };

  const renderSelectionGrid = () => {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="text-center mb-16 pt-8">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Book Your A.R.E.S. Experience</h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light">Choose the option that best matches where you are today.</p>
        </div>
        
        {/* Step-by-step section */}
        <div className="max-w-5xl mx-auto px-4 mb-20 relative text-center">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>
          <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-ares-teal)] mb-12">How Scheduling Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-bg)] border border-[var(--color-ares-teal)]/50 text-2xl font-bold flex items-center justify-center mb-6 text-[var(--color-ares-teal)] shadow-[0_0_20px_rgba(41,152,170,0.2)]">1</div>
              <h4 className="text-xl font-bold mb-3">Choose Pathway</h4>
              <p className="text-white/60 text-base max-w-[250px]">Select the service that directly matches your current status.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-bg)] border border-[var(--color-ares-teal)]/50 text-2xl font-bold flex items-center justify-center mb-6 text-[var(--color-ares-teal)] shadow-[0_0_20px_rgba(41,152,170,0.2)]">2</div>
              <h4 className="text-xl font-bold mb-3">Secure Reservation</h4>
              <p className="text-white/60 text-base max-w-[250px]">Complete any required payments securely via our Stripe integration.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-bg)] border border-[var(--color-ares-teal)]/50 text-2xl font-bold flex items-center justify-center mb-6 text-[var(--color-ares-teal)] shadow-[0_0_20px_rgba(41,152,170,0.2)]">3</div>
              <h4 className="text-xl font-bold mb-3">Select Your Time</h4>
              <p className="text-white/60 text-base max-w-[250px]">Choose exactly when you want to visit us via our scheduling portal.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {/* New Athlete */}
          <button onClick={() => navigate('/book/evaluation')} className="group bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-10 hover:border-[var(--color-ares-teal)]/50 hover:bg-[#1a1c22] transition-all text-left flex flex-col h-full hover:shadow-[0_0_30px_rgba(41,152,170,0.1)] hover:-translate-y-1 w-full relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--color-ares-teal)]/10 group-hover:border-[var(--color-ares-teal)]/30 transition-colors shadow-lg shadow-black/20">
                <UserPlus className="w-7 h-7 text-white group-hover:text-[var(--color-ares-teal)] transition-colors" />
              </div>
              <div className="bg-[var(--color-ares-teal)] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(41,152,170,0.5)]">Start Here</div>
            </div>
            <h3 className="text-2xl font-bold mb-4">New Athlete Evaluation</h3>
            <p className="text-white/60 mb-8 flex-1 text-lg leading-relaxed">
              For individuals looking to start training. A 75-minute comprehensive baseline assessment of your visual-cognitive profile.
            </p>
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5 w-full">
              <div>
                <div className="text-sm font-bold text-white/40 mb-1 tracking-widest uppercase">Pricing</div>
                <div className="font-bold text-2xl">$449</div>
              </div>
              <span className="text-[var(--color-ares-teal)] group-hover:underline flex items-center gap-2 font-bold text-base">
                Book Evaluation <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </button>

          {/* Existing Client */}
          <button onClick={() => navigate('/book/client')} className="group w-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-10 hover:border-[var(--color-ares-purple)]/50 hover:bg-[#1a1c22] transition-all text-left flex flex-col h-full hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--color-ares-purple)]/10 group-hover:border-[var(--color-ares-purple)]/30 transition-colors shadow-lg shadow-black/20">
                <RefreshCw className="w-7 h-7 text-white group-hover:text-[var(--color-ares-purple)] transition-colors" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Existing Client / Re-Evaluation</h3>
            <p className="text-white/60 mb-8 flex-1 text-lg leading-relaxed">
              For active athletes to purchase training packages, log into the portal to schedule a session, or book a follow-up re-evaluation.                     
            </p>
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
              <div>
                 <div className="text-sm font-bold text-[var(--color-ares-purple)]/70 mb-1 tracking-widest uppercase">Client Access</div>
                 <div className="text-white/80 font-medium">Portals & Packages</div>
              </div>
               
              <span className="text-[var(--color-ares-purple)] group-hover:underline flex items-center gap-2 font-bold text-base">
                View Options <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </button>

          {/* Teams / Facilities */}
          <button onClick={() => navigate('/book/consultation')} className="group w-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-10 hover:border-white/30 hover:bg-[#1a1c22] transition-all text-left flex flex-col h-full hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg shadow-black/20">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Team or Facility Partnership</h3>
            <p className="text-white/60 mb-8 flex-1 text-lg leading-relaxed">
              For coaches, team administrators, or facility owners interested in integrating A.R.E.S. protocols into an entire organization.
            </p>
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
              <div>
                <div className="text-sm font-bold text-white/40 mb-1 tracking-widest uppercase">Investment</div>
                <div className="font-bold text-white/90">Custom Pricing</div>
              </div>
              <span className="text-white group-hover:underline flex items-center gap-2 font-bold text-base">
                Book Discovery Call <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </button>

          {/* Certification */}
          <a href="https://arescertification.com/" target="_blank" rel="noopener noreferrer" className="group bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-10 hover:border-white/30 hover:bg-[#1a1c22] transition-all text-left flex flex-col h-full hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg shadow-black/20">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-white/20 transition-colors">Providers</div>
            </div>
            <h3 className="text-2xl font-bold mb-4">A.R.E.S. Certification Application</h3>
            <p className="text-white/60 mb-8 flex-1 text-lg leading-relaxed">
              For doctors, performance specialists, and clinicians wanting to become certified A.R.E.S. providers and access our proprietary system.
            </p>
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
              <div>
                <div className="text-sm font-bold text-white/40 mb-1 tracking-widest uppercase">Enrollment</div>
                <div className="font-bold text-white/90">Application Based</div>
              </div>
              <span className="text-white group-hover:underline flex items-center gap-2 font-bold text-base mt-2">
                Apply for Certification <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Book Sports Vision Evaluation & Training | Ares Elite Sports Vision"
        description="Schedule your Sports Vision Performance Evaluation, re-evaluations, or purchase training packages with Ares Elite Sports Vision in Carmel, IN."
        path={type ? `/book/${type}` : '/book'}
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white relative pt-24 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in">
            <Loader2 className="w-12 h-12 text-[var(--color-ares-teal)] animate-spin mb-6" />
            <h2 className="text-3xl font-bold mb-4">Verifying Payment...</h2>
            <p className="text-white/60 text-lg">One moment while we securely unlock your reservation access.</p>
          </div>
        ) : paymentError ? (
          <div className="mt-12 p-8 rounded-3xl bg-red-950/30 border border-red-500/30 text-red-200 flex flex-col items-center gap-6 max-w-2xl mx-auto text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
            </div>
            <p className="text-xl font-bold">{paymentError}</p>
            <button onClick={() => window.location.href = '/book'} className="mt-4 px-8 py-3 bg-white hover:bg-white/90 text-black rounded-xl transition-colors font-bold text-lg">Return to Booking Options</button>
          </div>
        ) : (
          <div className="py-8">
            {!type && renderSelectionGrid()}
            {type === 'evaluation' && renderNewAthleteFlow()}
            {(type === 'client' || type === 'training') && renderExistingClientFlow()}
            {type === 're-evaluation' && renderReevalFlow()}
            {type === 'packages' && renderPackagesFlow()}
            {type === 'consultation' && renderTeamFlow()}
            {type?.startsWith('training-') && renderPackagePurchaseFlow()}
          </div>
        )}

        {/* FAQ Section */}
        <section className="mb-12 mt-32 border-t border-[var(--color-ares-border)] pt-24">
          <BookingFAQ />
        </section>

        {/* Support Section */}
        <section>
          <BookingSupportSection />
        </section>
      </main>
    </div>
    </>
  );
}
