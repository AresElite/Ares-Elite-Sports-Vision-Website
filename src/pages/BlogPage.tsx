import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Clock, ChevronDown, ExternalLink } from 'lucide-react';
import { SectionReveal } from '../components/ui/SectionReveal';
import { blogPosts } from '../data/blog';
import { articles as researchArticles, sections as researchSections, filters as researchFilters, categoryColors } from '../data/research';

function ResearchCard({ article }: { article: typeof researchArticles[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 sm:p-10 flex flex-col transition-all duration-500 hover:border-[var(--color-ares-teal)]/40 hover:shadow-[0_0_40px_rgba(0,210,182,0.1)] relative overflow-hidden group"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-ares-teal)]/0 to-transparent group-hover:via-[var(--color-ares-teal)]/50 transition-all duration-500" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {article.categories.map(cat => (
            <span key={cat} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryColors[cat] || 'bg-white/10 text-white border-[var(--color-ares-border)]'}`}>
              {researchFilters.find(f => f.id === cat)?.label || cat}
            </span>
          ))}
        </div>
        <div className="flex items-center text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
          <Calendar className="w-3.5 h-3.5 mr-2" />
          {article.year}
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors leading-tight tracking-tight">
        {article.title}
      </h3>
      <p className="text-white/50 text-sm italic mb-6">
        {article.authors}
      </p>

      <p className={`text-white/50 mb-8 flex-grow leading-relaxed font-light text-sm sm:text-base ${!isOpen ? 'line-clamp-4' : ''}`}>
        {article.abstract}
      </p>

      <AnimatePresence>
        {isOpen && article.keyPoints && article.keyPoints.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="pt-4 border-t border-[var(--color-ares-border)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ares-teal)] block mb-3">
                Key Takeaways
              </span>
              <ul className="space-y-2">
                {article.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-[var(--color-ares-teal)] mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6 border-t border-[var(--color-ares-border)]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/60 hover:text-[var(--color-ares-teal)] transition-colors"
        >
          <ChevronDown className={`w-4 h-4 mr-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          {isOpen ? 'Hide Details' : 'Read More'}
        </button>

        {article.link !== '#' ? (
          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-ares-teal)] hover:text-white transition-colors group/link"
          >
            View Full Article <ExternalLink className="ml-2 w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
          </a>
        ) : (
          <span className="flex items-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/30 cursor-not-allowed">
            Link Unavailable
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function BlogPage() {
  const [activeTab, setActiveTab] = useState<'journal' | 'research'>('journal');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredResearch = researchArticles.filter(article => 
    activeFilter === 'all' ? true : article.categories.includes(activeFilter)
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "The A.R.E.S. Library",
    "description": "Explore the science of elite human performance, neuro-cognitive training, and sports vision research.",
    "url": "https://areselitesports.vision/resources",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Ares Elite Sports Vision"
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-24 sm:pt-32 pb-24 relative overflow-x-clip">
      <SEO 
        title="The A.R.E.S. Library | Research, Insights & Neurocognitive Performance"
        description="Explore the science of elite human performance, neuro-cognitive training, and sports vision research. Access our library of peer-reviewed articles and performance journal."
        path="/resources"
        schema={collectionSchema}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-b from-[var(--color-ares-purple)]/10 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-8 uppercase">
              RESEARCH & INSIGHTS
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-balance">
              The A.R.E.S. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-[var(--color-ares-white)]">Library</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed text-balance mb-12">
              Explore the science of human performance, neuro-cognitive training, and the future of sports vision.
            </p>

            {/* Tab Switcher */}
            <div className="inline-flex bg-white/5 border border-[var(--color-ares-border)] rounded-full p-1 mb-8">
              <button
                onClick={() => setActiveTab('journal')}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeTab === 'journal' 
                    ? 'bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] shadow-[0_0_20px_rgba(0,210,182,0.3)]' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                The Journal
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeTab === 'research' 
                    ? 'bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] shadow-[0_0_20px_rgba(0,210,182,0.3)]' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Research
              </button>
            </div>
          </div>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {activeTab === 'journal' ? (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
            >
              {blogPosts.map((post, index) => {
                const wordCount = post.content.split(/\s+/).length;
                const readingTime = Math.ceil(wordCount / 200);
                
                return (
                  <SectionReveal key={post.id} delay={index * 0.1}>
                    <Link to={`/blog/${post.id}`} className="block h-full group">
                      <motion.div 
                        className="h-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 sm:p-10 flex flex-col transition-all duration-500 hover:border-[var(--color-ares-teal)]/40 hover:shadow-[0_0_40px_rgba(0,210,182,0.1)] relative overflow-hidden"
                        whileHover={{ y: -8 }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-ares-teal)]/0 to-transparent group-hover:via-[var(--color-ares-teal)]/50 transition-all duration-500" />
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-[var(--color-ares-purple)]/20 text-[var(--color-ares-purple)] border-[var(--color-ares-purple)]/30">
                              Journal
                            </span>
                          </div>
                          <div className="flex items-center text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {post.date}
                          </div>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-[var(--color-ares-teal)] transition-colors line-clamp-3 leading-tight tracking-tight">
                          {post.title}
                        </h2>
                        
                        <div className="flex items-center text-white/40 text-sm italic mb-6">
                          <Clock className="w-3.5 h-3.5 mr-2" />
                          {readingTime} min read
                        </div>
                        
                        <p className="text-white/50 mb-10 flex-grow line-clamp-4 leading-relaxed font-light text-sm sm:text-base">
                          {post.abstract}
                        </p>
                        
                        <div className="flex items-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/60 group-hover:text-[var(--color-ares-teal)] transition-colors mt-auto pt-8 border-t border-[var(--color-ares-border)]">
                          Read Article <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </motion.div>
                    </Link>
                  </SectionReveal>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter Bar */}
              <div className="mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50 mr-2 w-full text-center md:w-auto md:text-left mb-2 md:mb-0">Filter by:</span>
                {researchFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      activeFilter === filter.id 
                        ? 'bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)]' 
                        : 'border border-[var(--color-ares-border)] text-white/70 hover:border-[var(--color-ares-teal)]/50 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div className="space-y-24">
                {researchSections.map(section => {
                  const sectionArticles = filteredResearch.filter(a => a.section === section.id);
                  
                  if (sectionArticles.length === 0) return null;

                  return (
                    <div key={section.id}>
                      <SectionReveal>
                        <div className="flex items-center gap-6 mb-12">
                          <span className="text-2xl font-mono font-bold text-[var(--color-ares-teal)]">
                            0{section.id}
                          </span>
                          <div className="h-px flex-1 bg-white/10"></div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg text-right tracking-tight">
                            {section.title}
                          </h2>
                        </div>
                      </SectionReveal>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                        <AnimatePresence mode="popLayout">
                          {sectionArticles.map(article => (
                            <ResearchCard key={article.id} article={article} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}

                {filteredResearch.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/50 text-lg">No articles found matching the selected filter.</p>
                    <button 
                      onClick={() => setActiveFilter('all')}
                      className="mt-4 text-[var(--color-ares-teal)] hover:text-white transition-colors underline underline-offset-4"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
