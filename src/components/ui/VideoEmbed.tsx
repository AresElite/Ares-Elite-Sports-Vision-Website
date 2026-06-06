import React from 'react';

interface VideoEmbedProps {
  src: string;
  title?: string;
  className?: string;
}

export function VideoEmbed({ src, title = "Video player", className = "" }: VideoEmbedProps) {
  return (
    <div className={`w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-ares-border)] shadow-glow bg-[var(--color-ares-charcoal)] relative ${className}`}>
      {/* 
        This is a responsive iframe container. 
        Replace the 'src' prop with your actual YouTube, Vimeo, or other embed URL.
      */}
      <iframe
        src={src}
        title={title}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
}
