import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Brain, Eye, X, Loader2, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resources = [
  {
    id: 'concussion-guide',
    title: "Desynchronized: The Neurometabolic and Sensorimotor Impact of Concussion",
    description: "Evaluation, Rehabilitation, and the A.R.E.S. Return-to-Performance Framework.",
    icon: <Brain className="w-12 h-12 text-[var(--color-ares-teal)]" />,
    imageTheme: "from-blue-900 to-slate-900",
    audience: "Athletes, Medical Providers, Coaches"
  },
  {
    id: 'performance-guide',
    title: "The Athlete's Guide to Measuring What Most Training Misses",
    description: "Unlocking the unseen neuro-visual mechanics of peak performance.",
    icon: <Eye className="w-12 h-12 text-[var(--color-ares-purple)]" />,
    imageTheme: "from-purple-900 to-slate-900",
    audience: "Athletes, Parents, Performance Centers"
  }
];

export function LeadMagnets() {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', sport: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeResource = resources.find(r => r.id === selectedResource);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Save to Firebase Firestore (Non-blocking background promise)
      addDoc(collection(db, 'resource_downloads'), {
        firstName: formData.firstName,
        lastName: formData.lastName || null,
        email: formData.email,
        sport: formData.sport || null,
        resourceName: activeResource?.title || null,
        createdAt: serverTimestamp()
      }).catch(fsError => {
        console.error("Firebase Firestore resource download write failed:", fsError);
      });

      // 2. Submit to express server SQLite
      const response = await fetch('/api/resource-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resourceName: activeResource?.title
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        // Usually, here we would trigger a download if we had the actual PDF file.
        // For demonstration purposes, we will just show a success message since the user doesn't have the PDF hosted yet.
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeForm = () => {
    setSelectedResource(null);
    setIsSuccess(false);
    setFormData({ firstName: '', lastName: '', email: '', sport: '' });
  };

  return (
    <section className="py-24 bg-[var(--color-ares-bg)] relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-ares-border)] to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={30} speed={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              FREE RESOURCES & GUIDES
            </h2>
            <p className="text-[var(--color-ares-muted)] text-lg sm:text-xl max-w-2xl mx-auto text-balance">
              Dive deep into the science of sports performance vision and concussion management. Download our comprehensive frameworks.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {resources.map((resource, i) => (
            <ScrollReveal key={resource.id} direction="up" distance={30}>
              <div 
                className="group relative h-full flex flex-col bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-6 sm:p-8 hover:border-[var(--color-ares-teal)] transition-all cursor-pointer overflow-hidden shadow-xl"
                onClick={() => setSelectedResource(resource.id)}
              >
                <div className={`absolute -right-24 -top-24 w-64 h-64 bg-gradient-to-br ${resource.imageTheme} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className="mb-8">
                  {resource.icon}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
                  {resource.title}
                </h3>
                
                <p className="text-[var(--color-ares-muted)] leading-relaxed mb-8 flex-grow">
                  {resource.description}
                </p>

                <div className="text-sm font-mono text-[var(--color-ares-teal)] mb-6">
                  FOR: {resource.audience.toUpperCase()}
                </div>

                <button className="flex items-center text-white font-bold uppercase tracking-wide text-sm group-hover:text-[var(--color-ares-teal)] transition-colors mt-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Request Access
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Modal / Form Overlay */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeForm} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={closeForm}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center px-3 py-1 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-bold tracking-widest rounded-full uppercase mb-4">
                  Free Download
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {activeResource?.title}
                </h3>
                <p className="text-[var(--color-ares-muted)] text-sm">
                  Fill out the form below to receive your copy immediately.
                </p>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Download className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Request Complete!</h4>
                  <p className="text-green-200/80 mb-6">
                    We've received your request. In a complete application, your PDF would download here or be emailed to you immediately.
                  </p>
                  <button 
                    onClick={closeForm}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--color-ares-teal)] text-white font-bold rounded-xl transition-all"
                  >
                    Return to site
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">First Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Last Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Sport or Organization (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                      value={formData.sport}
                      onChange={e => setFormData({...formData, sport: e.target.value})}
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center px-6 py-4 bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 disabled:opacity-50 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(41,152,170,0.3)] font-bold tracking-wide uppercase text-sm"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="mr-2">Request Access</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-white/40 mt-4">
                      By submitting this form, you agree to receive communications from Ares Elite Sports Vision.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
