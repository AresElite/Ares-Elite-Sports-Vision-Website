import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sport: '',
    message: '',
    howHeard: '',
    howHeardOther: '',
    referralCode: sessionStorage.getItem('referral_code') || ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.howHeard.trim()) {
      newErrors.howHeard = 'Please select how you heard about us';
    }
    if (formData.howHeard === 'Other (Please specify)' && !formData.howHeardOther.trim()) {
      newErrors.howHeardOther = 'Please specify how you heard about us';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types/selects
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    
    const utmSource = sessionStorage.getItem('utm_source') || null;
    const utmMedium = sessionStorage.getItem('utm_medium') || null;
    const utmCampaign = sessionStorage.getItem('utm_campaign') || null;
    const utmContent = sessionStorage.getItem('utm_content') || null;
    const utmTerm = sessionStorage.getItem('utm_term') || null;
    const landingPage = sessionStorage.getItem('landing_page') || '/';

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      sport: formData.sport,
      message: formData.message,
      howHeard: formData.howHeard || null,
      howHeardOther: formData.howHeard === 'Other (Please specify)' ? formData.howHeardOther : null,
      referralCode: formData.referralCode || null,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }
      
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      if (error.name === 'TypeError' && error.message.toLowerCase().includes('fetch')) {
        setErrorMessage('Network error. Please check your internet connection and try again.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <SEO 
        title="Contact Ares Elite Sports Vision | Location & Inquiries"
        description="Contact Ares Elite Sports Vision in Carmel, IN. Fill out our form for inquiries or call us at (773) 981-1447 to learn more about sports vision training."
        path="/contact"
      />
    <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-24 pb-12 flex flex-col items-center">
      <div className="max-w-3xl w-full px-6 sm:px-8">
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
          <p className="text-white/70 mb-8">
            Ready to unlock your visual-cognitive potential? Fill out the form below and Dr. Joe LaPlaca will be in touch.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-[var(--color-ares-border)]">
            <div>
              <h3 className="text-[var(--color-ares-teal)] font-bold mb-2">Email</h3>
              <a href="mailto:drl@areselitesportsvision.com" className="text-white/80 hover:text-white transition-colors text-sm">drl@areselitesportsvision.com</a>
            </div>
            <div>
              <h3 className="text-[var(--color-ares-teal)] font-bold mb-2">Phone</h3>
              <a href="tel:+17739811447" className="text-white/80 hover:text-white transition-colors text-sm">+1 (773) 981-1447</a>
            </div>
            <div>
              <h3 className="text-[var(--color-ares-teal)] font-bold mb-2">Location</h3>
              <p className="text-white/80 text-sm">510 W. Carmel Dr.<br />Carmel, IN 46032</p>
            </div>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 rounded-2xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-[var(--color-ares-teal)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Request Received</h2>
              <p className="text-white/80">
                Thanks for reaching out! We've received your information and will be in touch shortly.
              </p>
              <Button href="/" variant="outline" className="mt-8">
                Return Home
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full bg-black/30 border ${errors.firstName ? 'border-red-500' : 'border-[var(--color-ares-border)]'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/80">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-[var(--color-ares-border)]'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sport" className="block text-sm font-medium text-white/80">Primary Sport / Discipline</label>
                <input 
                  type="text" 
                  id="sport" 
                  name="sport" 
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all"
                  placeholder="e.g. Baseball, Hockey, Motorsport"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="howHeard" className="block text-sm font-medium text-white/80">How did you hear about us? *</label>
                <select 
                  id="howHeard" 
                  name="howHeard" 
                  value={formData.howHeard}
                  onChange={handleChange}
                  className={`w-full bg-[#0e111a]/95 border ${errors.howHeard ? 'border-red-500' : 'border-[var(--color-ares-border)]'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all`}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Search Engine (Google, Bing, etc.)">Search Engine (Google, Bing, etc.)</option>
                  <option value="Social Media (Instagram, Facebook, TikTok, etc.)">Social Media (Instagram, Facebook, TikTok, etc.)</option>
                  <option value="Referral (Coach, Athlete, Parent, School, Club)">Referral (Coach, Athlete, Parent, School, Club)</option>
                  <option value="Referral Partner (Doctor, Clinic, Physical Therapist)">Referral Partner (Doctor, Clinic, Physical Therapist)</option>
                  <option value="Affiliate Partner">Affiliate Partner</option>
                  <option value="Ares Event or Presentation">Ares Event or Presentation</option>
                  <option value="QR Code (Scan)">QR Code (Scan)</option>
                  <option value="Other (Please specify)">Other (Please specify)</option>
                </select>
                {errors.howHeard && <p className="text-red-400 text-xs mt-1">{errors.howHeard}</p>}
              </div>

              {formData.howHeard === 'Other (Please specify)' && (
                <div className="space-y-2">
                  <label htmlFor="howHeardOther" className="block text-sm font-medium text-white/80">Please specify *</label>
                  <input 
                    type="text" 
                    id="howHeardOther" 
                    name="howHeardOther" 
                    value={formData.howHeardOther}
                    onChange={handleChange}
                    className={`w-full bg-black/30 border ${errors.howHeardOther ? 'border-red-500' : 'border-[var(--color-ares-border)]'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all`}
                    placeholder="Please describe how you heard about us"
                  />
                  {errors.howHeardOther && <p className="text-red-400 text-xs mt-1">{errors.howHeardOther}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="referralCode" className="block text-sm font-medium text-white/80">Referral / Affiliate Code</label>
                <input 
                  type="text" 
                  id="referralCode" 
                  name="referralCode" 
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all"
                  placeholder="e.g. COACH-SMITH"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-white/80">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange as any}
                  rows={4}
                  className="w-full bg-black/30 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)]/50 focus:ring-1 focus:ring-[var(--color-ares-teal)]/50 transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-200">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(41,182,246,0.3)] hover:shadow-[0_0_30px_rgba(41,182,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
    </>
  );
}
