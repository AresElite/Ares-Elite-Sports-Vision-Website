import { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar, Footer } from './components/layout';
import { SystemOverlay } from './components/ui/SystemOverlay';
import { SocialShare } from './components/ui/SocialShare';
// import { AthenaChat } from './components/ui/AthenaChat';
import { NewsletterOverlay } from './components/ui/NewsletterOverlay';
import { MobileStickyCTA } from './components/ui/MobileStickyCTA';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DetailPage = lazy(() => import('./pages/DetailPage').then(m => ({ default: m.DetailPage })));
const CertificationPage = lazy(() => import('./pages/CertificationPage').then(m => ({ default: m.CertificationPage })));
const BookPage = lazy(() => import('./pages/BookPage').then(m => ({ default: m.BookPage })));
const BookingHoldPage = lazy(() => import('./pages/BookingHoldPage').then(m => ({ default: m.BookingHoldPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const CertificationApplicationPage = lazy(() => import('./pages/CertificationApplicationPage').then(m => ({ default: m.CertificationApplicationPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// New Service Pages
const SportsVisionPerformanceEvaluationPage = lazy(() => import('./pages/SportsVisionPerformanceEvaluationPage').then(m => ({ default: m.SportsVisionPerformanceEvaluationPage })));
const SportsVisionTrainingPage = lazy(() => import('./pages/SportsVisionTrainingPage').then(m => ({ default: m.SportsVisionTrainingPage })));
const AresPerformanceSystemPage = lazy(() => import('./pages/AresPerformanceSystemPage').then(m => ({ default: m.AresPerformanceSystemPage })));
const AresAcademyPage = lazy(() => import('./pages/AresAcademyPage').then(m => ({ default: m.AresAcademyPage })));
const TeamsOrganizationsPage = lazy(() => import('./pages/TeamsOrganizationsPage').then(m => ({ default: m.TeamsOrganizationsPage })));
const ConcussionBaselinePage = lazy(() => import('./pages/ConcussionBaselinePage').then(m => ({ default: m.ConcussionBaselinePage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const SportsHubPage = lazy(() => import('./pages/SportsHubPage').then(m => ({ default: m.SportsHubPage })));
const SportSpecificPage = lazy(() => import('./pages/SportSpecificPage').then(m => ({ default: m.SportSpecificPage })));
const IdentityPage = lazy(() => import('./pages/IdentityPage').then(m => ({ default: m.IdentityPage })));

// Conversion Pathways
const AthletesPage = lazy(() => import('./pages/AthletesPage').then(m => ({ default: m.AthletesPage })));
const ParentsPage = lazy(() => import('./pages/ParentsPage').then(m => ({ default: m.ParentsPage })));
const CoachesPage = lazy(() => import('./pages/CoachesPage').then(m => ({ default: m.CoachesPage })));
const ProSportsPage = lazy(() => import('./pages/ProSportsPage').then(m => ({ default: m.ProSportsPage })));
const OfficialsPage = lazy(() => import('./pages/OfficialsPage').then(m => ({ default: m.OfficialsPage })));
const SpeakingPage = lazy(() => import('./pages/SpeakingPage').then(m => ({ default: m.SpeakingPage })));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage').then(m => ({ default: m.TechnologyPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then(m => ({ default: m.ResultsPage })));

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      
      setTimeout(tryScroll, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToHash />
        <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white selection:bg-[var(--color-ares-teal)] selection:text-white overflow-x-hidden relative">
          <div className="fixed inset-0 bg-[url('/logo.png')] bg-no-repeat bg-center bg-[length:35%_auto] opacity-[0.08] pointer-events-none z-0"></div>
          <div className="relative z-10">
            <SystemOverlay />
            <SocialShare />
            {/* <AthenaChat /> */}
            <NewsletterOverlay />
            <MobileStickyCTA />
            <Navbar />
            <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-[var(--color-ares-bg)]"><div className="w-8 h-8 md:w-16 md:h-16 border-t-2 border-[var(--color-ares-teal)] rounded-full animate-spin"></div></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* Core Architecture */}
                <Route path="/sports-vision-performance-evaluation" element={<SportsVisionPerformanceEvaluationPage />} />
                <Route path="/sports-vision-training" element={<SportsVisionTrainingPage />} />
                <Route path="/ares-performance-system" element={<AresPerformanceSystemPage />} />
                <Route path="/ares-academy" element={<AresAcademyPage />} />
                <Route path="/teams-and-organizations" element={<TeamsOrganizationsPage />} />
                <Route path="/concussion-baseline-testing" element={<ConcussionBaselinePage />} />
                
                {/* Sports Hub */}
                <Route path="/sports" element={<SportsHubPage />} />
                <Route path="/sports/:sport" element={<SportSpecificPage />} />
                
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/identity" element={<IdentityPage />} />
                
                {/* Conversion Pathways */}
                <Route path="/athletes" element={<AthletesPage />} />
                <Route path="/parents" element={<ParentsPage />} />
                <Route path="/coaches" element={<CoachesPage />} />
                <Route path="/pro-sports" element={<ProSportsPage />} />
                <Route path="/officials" element={<OfficialsPage />} />
                <Route path="/speaking" element={<SpeakingPage />} />
                <Route path="/technology-and-data" element={<TechnologyPage />} />
                <Route path="/results" element={<ResultsPage />} />
                
                {/* Legacy/Other Details */}
                <Route path="/detail/:id" element={<DetailPage />} />
                
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/certification/apply/:level" element={<CertificationApplicationPage />} />
                
                <Route path="/book" element={<BookPage />} />
                <Route path="/book/:type" element={<BookPage />} />
                <Route path="/booking-hold" element={<BookingHoldPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/client-portal" element={<Navigate to="/login" replace />} />
                <Route path="/client-scheduling" element={<Navigate to="/book" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/research" element={<Navigate to="/resources" replace />} />
                <Route path="/resources" element={<BlogPage />} />
                <Route path="/blog" element={<Navigate to="/resources" replace />} />
                <Route path="/resources/:slug" element={<BlogPostPage />} />
                <Route path="/blog/:slug" element={<Navigate to="/resources/:slug" replace />} />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </div>
      </Router>
    </HelmetProvider>
  );
}
