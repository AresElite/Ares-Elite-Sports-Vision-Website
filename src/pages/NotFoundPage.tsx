import { Link } from 'react-router-dom';
import { ArrowLeft, Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ares-bg)] flex items-center justify-center pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight">404</h1>
        <h2 className="text-2xl md:text-3xl font-display font-medium text-white mb-6">Page Not Found</h2>
        
        <p className="text-[var(--color-ares-muted)] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          The pathway you're looking for doesn't exist or has been moved. Return to the main portal to continue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(41,152,170,0.3)] hover:shadow-[0_0_30px_rgba(41,152,170,0.5)] font-bold tracking-wide"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] hover:bg-white/5 text-white rounded-xl transition-all font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2 text-white/50" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
