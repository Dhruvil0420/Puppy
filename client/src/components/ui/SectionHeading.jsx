import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div className={`space-y-3 ${isCenter ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl'} ${className}`}>
      {eyebrow && (
        <p className="font-scrawl text-2xl text-apricot tracking-wide">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-cocoa leading-[1.15] tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-cocoa/80 text-base sm:text-lg leading-relaxed pt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
