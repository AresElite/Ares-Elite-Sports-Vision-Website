import { Instagram, Linkedin } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function SocialShare() {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/areselitesportsvision1", label: "Instagram" },
    { icon: TikTokIcon, href: "https://www.tiktok.com/@areselitesportsvision", label: "TikTok" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/102292953/", label: "LinkedIn" },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[var(--color-ares-charcoal)]/80 backdrop-blur-md border border-[var(--color-ares-border)] rounded-full flex items-center justify-center text-white/60 hover:text-[var(--color-ares-teal)] hover:border-[var(--color-ares-teal)]/50 hover:bg-[var(--color-ares-charcoal)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(41,182,246,0.3)] group"
          aria-label={social.label}
        >
          <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        </a>
      ))}
    </div>
  );
}
