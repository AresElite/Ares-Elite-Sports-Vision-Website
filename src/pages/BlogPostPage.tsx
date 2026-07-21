import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SectionReveal } from '../components/ui/SectionReveal';
import { Button } from '../components/ui/Button';
import { blogPosts } from '../data/blog';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.id === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!post) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-ares-bg)] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Button variant="outline" href="/blog">Return to Blog</Button>
        </div>
      </div>
    );
  }

  // Calculate estimated reading time (assuming ~200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "BlogPosting",
    "headline": post.title,
    "description": post.abstract,
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Ares Elite Sports Vision",
      "url": "https://ares-elite.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ares Elite Sports Vision",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ares-elite.com/logo.png"
      }
    },
    "keywords": post.keywords?.join(", "),
    "articleBody": post.content.substring(0, 500) // snippet for AI crawlers
  };

  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      <SEO 
        title={`${post.title} | Ares Elite Sports Vision`}
        description={post.abstract}
        path={`/resources/${post.id}`}
        schema={jsonLd}
        type="article"
      />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-ares-teal)] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-[500px] bg-gradient-to-b from-[var(--color-ares-purple)]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-full lg:w-1/3 h-2/3 bg-[var(--color-ares-teal)]/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <Link to="/blog" className="inline-flex items-center text-white/40 hover:text-[var(--color-ares-teal)] transition-all duration-300 mb-12 group font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <SectionReveal>
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-widest mb-8 uppercase">
              <div className="flex items-center bg-[var(--color-ares-teal)]/10 px-3 py-1 rounded-full border border-[var(--color-ares-teal)]/20">
                <Calendar className="w-3 h-3 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center text-white/40">
                <Clock className="w-3 h-3 mr-2" />
                {readingTime} min read
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-10 leading-[1.1] text-balance">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between py-8 border-y border-[var(--color-ares-border)]">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[var(--color-ares-purple)] to-[var(--color-ares-purple)]/50 border border-[var(--color-ares-border)] flex items-center justify-center text-white font-bold shadow-lg">
                  A
                </div>
                <div>
                  <div className="font-bold text-white tracking-tight text-sm sm:text-base">A.R.E.S. Team</div>
                  <div className="text-[10px] sm:text-xs text-white/40 font-mono uppercase tracking-wider">Performance Research</div>
                </div>
              </div>
              
              <button className="h-10 w-10 rounded-xl bg-white/5 border border-[var(--color-ares-border)] flex items-center justify-center text-white/40 hover:text-[var(--color-ares-teal)] hover:bg-white/10 hover:border-[var(--color-ares-teal)]/30 transition-all duration-300 shadow-sm">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </header>

          <article className="relative">
            {/* Decorative quote mark for aesthetic */}
            <div className="absolute -left-4 sm:-left-12 top-0 text-white/5 select-none pointer-events-none hidden md:block">
              <span className="text-[12rem] leading-none font-serif">"</span>
            </div>

            <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none 
              prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-10 prose-p:font-light prose-p:text-balance
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-headings:mt-16 prose-headings:mb-8
              prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:text-[var(--color-ares-teal)] prose-h2:border-l-2 prose-h2:border-[var(--color-ares-teal)]/30 prose-h2:pl-6
              prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl
              prose-a:text-[var(--color-ares-teal)] hover:prose-a:text-white prose-a:transition-colors prose-a:decoration-[var(--color-ares-teal)]/30 hover:prose-a:decoration-white
              prose-strong:text-white prose-strong:font-bold
              prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-6 prose-ul:my-12
              prose-li:relative prose-li:pl-10 prose-li:text-white/70 prose-li:leading-[1.8] prose-li:font-light
              prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.7em] prose-li:before:w-4 prose-li:before:h-[1px] prose-li:before:bg-[var(--color-ares-teal)]
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-6 prose-ol:my-12 prose-ol:text-white/70 prose-ol:leading-[1.8] prose-ol:font-light
              prose-blockquote:border-l-0 prose-blockquote:bg-gradient-to-br prose-blockquote:from-white/5 prose-blockquote:to-transparent prose-blockquote:py-10 prose-blockquote:px-10 sm:prose-blockquote:px-16 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:text-white/90 prose-blockquote:my-16 prose-blockquote:text-xl sm:prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:font-light prose-blockquote:relative
              prose-blockquote:before:content-['“'] prose-blockquote:before:absolute prose-blockquote:before:left-4 prose-blockquote:before:top-4 prose-blockquote:before:text-white/10 prose-blockquote:before:text-6xl
              prose-hr:border-[var(--color-ares-border)] prose-hr:my-20
              prose-img:rounded-3xl prose-img:shadow-glow prose-img:border prose-img:border-[var(--color-ares-border)]">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
          
          <footer className="mt-24 pt-16 border-t border-[var(--color-ares-border)]">
            <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent p-8 sm:p-12 rounded-3xl border border-[var(--color-ares-border)] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[var(--color-ares-teal)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 relative z-10 tracking-tight">Ready to upgrade your operating system?</h3>
              <p className="text-white/60 mb-10 max-w-xl mx-auto relative z-10 font-light">
                Join the elite organizations already using A.R.E.S. to redefine human performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                <Button variant="primary" href="/free-week" className="w-full sm:w-auto bg-[var(--color-ares-teal)] text-[#0A0B14]">
                  Start Free 7-Day Protocol
                </Button>
                <Button variant="outline" href="/book/evaluation" className="w-full sm:w-auto">
                  Schedule Evaluation ($449)
                </Button>
              </div>
            </div>
            
            {/* Free At-Home End-cap Banner */}
            <div className="mt-12 rounded-2xl border border-[var(--color-ares-teal)]/40 bg-[var(--color-ares-charcoal)] p-8 text-center">
              <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-widest font-bold block mb-2">Want the at-home version?</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Start with our Free 7-Day Protocol</h3>
              <p className="text-white/70 max-w-xl mx-auto mb-6 text-sm">
                Two drills a day right in your browser. Build your visual foundation at home before your clinic evaluation.
              </p>
              <Link to="/free-week" className="inline-flex items-center gap-2 bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity uppercase text-xs tracking-wider">
                Get Free 7-Day Protocol →
              </Link>
            </div>

            <div className="mt-12 flex justify-center">
              <Link to="/blog" className="text-white/40 hover:text-[var(--color-ares-teal)] transition-colors font-mono text-xs uppercase tracking-widest flex items-center group">
                <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                Explore more articles
              </Link>
            </div>
          </footer>
        </SectionReveal>
      </div>
    </div>
  );
}
