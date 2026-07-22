import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, CheckCircle2, TrendingUp, Award, ArrowRight, Printer, Sparkles, Building2, User } from 'lucide-react';
import { WhitePaper } from '../../data/whitepapers';

interface WhitePaperModalProps {
  paper: WhitePaper | null;
  onClose: () => void;
}

export function WhitePaperModal({ paper, onClose }: WhitePaperModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'full'>('overview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (paper) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paper, onClose]);

  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-[#0A0B14] border border-[var(--color-ares-teal)]/30 rounded-3xl shadow-[0_0_80px_rgba(41,182,246,0.2)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header Controls Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[var(--color-ares-teal)]" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase tracking-widest block font-bold">
                  A.R.E.S. OFFICIAL RESEARCH & WHITE PAPERS
                </span>
                <span className="text-xs text-white/70 font-mono font-bold uppercase truncate max-w-xs sm:max-w-md block">
                  {paper.category}: {paper.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                title="Print White Paper"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Scrollable Content */}
          <div className="p-6 sm:p-10 overflow-y-auto space-y-10 flex-1">
            
            {/* Paper Title Banner */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white/5 via-black/80 to-[var(--color-ares-purple)]/20 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Award className="w-48 h-48 text-[var(--color-ares-teal)]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 text-[var(--color-ares-teal)] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{paper.type}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4 text-balance">
                {paper.title}
              </h1>

              <p className="text-sm sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-6 font-light">
                {paper.subtitle}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Author</span>
                  <span className="text-white font-bold">{paper.author}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Location</span>
                  <span className="text-white font-bold">{paper.location}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Publication Date</span>
                  <span className="text-white font-bold">{paper.date}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Category</span>
                  <span className="text-[var(--color-ares-teal)] font-bold">{paper.category}</span>
                </div>
              </div>
            </div>

            {/* Top Cover Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paper.coverMetrics.map((m, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-black/60 border border-[var(--color-ares-teal)]/30 text-center relative overflow-hidden">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">{m.label}</div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-[var(--color-ares-teal)]">{m.value}</div>
                  <div className="text-[11px] text-white/70 font-mono mt-1">{m.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Athlete / Cohort Profile Banner (if applicable) */}
            {paper.athleteProfile && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/40 flex items-center justify-center">
                    <User className="w-6 h-6 text-[var(--color-ares-teal)]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Athlete Subject</span>
                    <h4 className="text-lg font-bold text-white uppercase">{paper.athleteProfile.name}</h4>
                  </div>
                </div>
                <div className="flex gap-6 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block uppercase text-[10px]">Discipline</span>
                    <span className="text-white font-bold">{paper.athleteProfile.discipline}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[10px]">Program Duration</span>
                    <span className="text-[var(--color-ares-teal)] font-bold">{paper.athleteProfile.program}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary & Abstract */}
            <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono font-bold text-[var(--color-ares-teal)] uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
                {paper.summary}
              </p>
            </div>

            {/* Key Findings Card Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-ares-teal)]" />
                <span>Key Performance Metrics & Findings</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paper.keyFindings.map((kf, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-white/60 uppercase">{kf.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--color-ares-teal)]/20 text-[var(--color-ares-teal)] border border-[var(--color-ares-teal)]/30 uppercase">
                        {kf.change}
                      </span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">{kf.metric}</div>
                    <p className="text-xs text-white/70 leading-relaxed font-light">{kf.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Document Sections */}
            <div className="space-y-8 pt-4">
              {paper.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4 p-6 sm:p-8 rounded-2xl bg-black/30 border border-white/10">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">{sec.heading}</h3>
                    {sec.subheading && (
                      <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-wider block mt-0.5">
                        {sec.subheading}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Optional Metrics Table */}
                  {sec.metricsTable && (
                    <div className="overflow-x-auto rounded-xl border border-white/10 mt-4">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-white/60">
                          <tr>
                            <th className="p-3">Performance Metric</th>
                            <th className="p-3">Baseline</th>
                            <th className="p-3">Final Outcome</th>
                            <th className="p-3 text-right">Net Improvement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/90">
                          {sec.metricsTable.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-bold text-white">{row.metric}</td>
                              <td className="p-3 text-white/60">{row.baseline}</td>
                              <td className="p-3 text-white font-bold">{row.final}</td>
                              <td className="p-3 text-right font-bold text-[var(--color-ares-teal)]">{row.improvement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Highlights Bullet List */}
                  {sec.highlights && (
                    <ul className="space-y-2 pt-2">
                      {sec.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs sm:text-sm text-white/90 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-ares-teal)] shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-light">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Call To Action */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--color-ares-teal)]/20 via-black to-[var(--color-ares-purple)]/20 border border-[var(--color-ares-teal)]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h4 className="text-lg font-black text-white uppercase">{paper.callToAction.title}</h4>
                <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl font-light">{paper.callToAction.text}</p>
              </div>
              <a
                href={paper.callToAction.link}
                onClick={onClose}
                className="px-6 py-3.5 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(41,182,246,0.4)] whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                <span>{paper.callToAction.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
