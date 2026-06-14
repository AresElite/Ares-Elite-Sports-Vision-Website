/**
 * Centralized conversion event tracking module for Ares Elite Sports Vision.
 * Abstracts tracking events to console in development and prepares hooks
 * for future analytics SDK integrations (e.g., Google Analytics, Meta Pixel).
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'start_assessment_clicked'
  | 'assessment_completed'
  | 'booking_clicked'
  | 'referral_code_used'
  | 'contact_form_submitted'
  | 'resource_downloaded';

export interface EventProperties {
  path?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  role?: string;
  level?: string;
  location?: string;
  score?: number;
  category?: string;
  bottleneck?: string;
  referralCode?: string;
  [key: string]: any;
}

export function trackEvent(name: AnalyticsEvent, properties?: EventProperties) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Always log to console for auditing and visibility
  if (isDev) {
    console.log(`%c[Analytics Event: ${name}]`, 'color: #29b6f6; font-weight: bold;', {
      timestamp: new Date().toISOString(),
      properties
    });
  } else {
    console.log(`[Analytics Event: ${name}]`, properties);
  }

  // Hook for Google Analytics (gtag)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', name, properties);
    } catch (err) {
      console.warn('Failed to dispatch GA event:', err);
    }
  }

  // Hook for Meta Pixel (fbq)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      (window as any).fbq('track', name, properties);
    } catch (err) {
      console.warn('Failed to dispatch FB Pixel event:', err);
    }
  }
}
