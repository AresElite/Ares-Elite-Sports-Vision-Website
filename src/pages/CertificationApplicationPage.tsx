import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

export function CertificationApplicationPage() {
  const { level } = useParams<{ level: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    cityState: '',
    reason: '',
    howToUse: '',
    partnerAffiliation: '',
    // Level 2 specific
    licenseType: '',
    licenseNumber: '',
    stateLoc: '',
    specialty: '',
    clinicName: '',
    isMedicalProfessional: false,
  });

  const isLevel2 = level === 'level2';
  const levelName = isLevel2 ? 'Level 2 Provider Certification' : 'Level 1 CPVT Certification';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation this would post to a server to send the email to drl@areselitesportsvision.com
    console.log('Sending email to drl@areselitesportsvision.com:', {
      requestedCertification: levelName,
      status: 'pending_review',
      ...formData
    });
    setIsSubmitted(true);
  };

  return (
    <>
      <SEO 
        title={`Apply for ${levelName} | Ares Elite Sports Vision`}
        description="Become a certified Ares Elite Sports Vision provider. Submit your application for CPVT or Provider Certifications."
        path={level ? `/certification/apply/${level}` : '/certification/apply'}
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/certification" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Certifications
        </Link>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center"
          >
            <div className="w-20 h-20 bg-[var(--color-ares-teal)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[var(--color-ares-teal)]" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Application Submitted</h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Your application for the {levelName} has been received. Our team will review your details and contact you shortly to schedule a consultation/interview call.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center bg-[var(--color-ares-charcoal)] hover:bg-[var(--color-ares-charcoal)]/80 text-white font-bold tracking-widest uppercase px-8 py-4 rounded-xl border border-white/10 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Application
              </h1>
              <p className="text-xl text-[var(--color-ares-teal)] font-mono uppercase tracking-widest mb-4">
                {levelName}
              </p>
              <p className="text-white/70">
                Please provide your details below. Dr. LaPlaca will review your application and we will reach out to schedule an interview and consultation call.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--color-ares-charcoal)]/50 p-8 rounded-3xl border border-[var(--color-ares-border)]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="cityState" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">City, State</label>
                  <input
                    type="text"
                    id="cityState"
                    required
                    value={formData.cityState}
                    onChange={(e) => setFormData({...formData, cityState: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Organization</label>
                <input
                  type="text"
                  id="organization"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Role / Title</label>
                <input
                  type="text"
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="partnerAffiliation" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Partner Organization Affiliation (if any)</label>
                <input
                  type="text"
                  id="partnerAffiliation"
                  value={formData.partnerAffiliation}
                  onChange={(e) => setFormData({...formData, partnerAffiliation: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Why are you pursuing this certification?</label>
                <textarea
                  id="reason"
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label htmlFor="howToUse" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">How do you plan to use this certification?</label>
                <textarea
                  id="howToUse"
                  required
                  rows={3}
                  value={formData.howToUse}
                  onChange={(e) => setFormData({...formData, howToUse: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors resize-none"
                ></textarea>
              </div>

              {isLevel2 && (
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <h3 className="text-xl font-bold tracking-tight text-[var(--color-ares-purple)]">Professional License Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="licenseType" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Professional License Type</label>
                      <input
                        type="text"
                        id="licenseType"
                        required
                        value={formData.licenseType}
                        onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-purple)] transition-colors"
                        placeholder="e.g. OD, MD, PT, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">License Number</label>
                      <input
                        type="text"
                        id="licenseNumber"
                        required
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-purple)] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="stateLoc" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">State of Licensure</label>
                      <input
                        type="text"
                        id="stateLoc"
                        required
                        value={formData.stateLoc}
                        onChange={(e) => setFormData({...formData, stateLoc: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-purple)] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="specialty" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Specialty</label>
                      <input
                        type="text"
                        id="specialty"
                        required
                        value={formData.specialty}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-purple)] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clinicName" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Clinic / Practice Name</label>
                    <input
                      type="text"
                      id="clinicName"
                      required
                      value={formData.clinicName}
                      onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-purple)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center gap-2">
                       <span className="flex-1">Upload Credential</span>
                       <span className="text-[10px] text-white/40 font-normal normal-case">(PDF, JPG, PNG)</span>
                    </label>
                    <div className="w-full bg-black/30 border border-dashed border-white/20 rounded-xl px-4 py-6 text-center hover:bg-black/50 transition-colors cursor-pointer">
                       <p className="text-sm text-white/60">Click to upload or drag & drop</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[var(--color-ares-purple)]/10 p-4 rounded-xl border border-[var(--color-ares-purple)]/30">
                    <input
                      type="checkbox"
                      id="isMedicalProfessional"
                      required
                      checked={formData.isMedicalProfessional}
                      onChange={(e) => setFormData({...formData, isMedicalProfessional: e.target.checked})}
                      className="mt-1 shrink-0 w-4 h-4 rounded border-white/20 text-[var(--color-ares-purple)] focus:ring-[var(--color-ares-purple)]"
                    />
                    <label htmlFor="isMedicalProfessional" className="text-sm text-white/80">
                      I confirm that I am an optometrist, neurologist, or approved medical professional eligible for the Level 2 Provider Certification.
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full font-bold tracking-widest uppercase px-6 py-4 rounded-xl shadow-glow transition-all active:scale-[0.98] ${
                  isLevel2 ? 'bg-[var(--color-ares-purple)] hover:bg-[var(--color-ares-purple)]/90 text-white' : 'bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white'
                }`}
              >
                Submit Application
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
