import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function HeroSection({ featuredPuppies = [] }) {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback puppies if none loaded from API
  const slides = featuredPuppies.length > 0 ? featuredPuppies.slice(0, 6) : [
    {
      name: 'Mochi',
      breed: 'Teacup Maltipoo',
      primaryImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
      slug: 'mochi',
    },
    {
      name: 'Bella',
      breed: 'Toy Poodle (Red)',
      primaryImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
      slug: 'bella',
    },
    {
      name: 'Biscuit',
      breed: 'Teacup Pomeranian',
      primaryImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&auto=format&fit=crop&q=80',
      slug: 'biscuit',
    },
  ];

  // Auto-play slideshow every 4.5 seconds (pause on hover)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'm interested in adopting a puppy 🐶",
    settings?.whatsappNumber
  );

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-honey/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/60 text-cocoa text-sm font-medium shadow-soft">
              <span className="text-base">✨</span>
              <span className="font-scrawl text-lg text-apricot-dark">every puppy is family</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-cocoa leading-[1.1] tracking-tight">
              Premium teacup puppies in Dubai
            </h1>

            <p className="text-cocoa/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button to="/puppies" variant="primary" size="lg" className="w-full sm:w-auto">
                View available puppies
              </Button>

              <Button
                href={waLink}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <span>💬</span>
                <span>Enquire on WhatsApp</span>
              </Button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-cocoa/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="font-display text-2xl font-bold text-cocoa">100%</p>
                <p className="text-xs text-cocoa/70">Health guaranteed</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-cocoa">Downtown</p>
                <p className="text-xs text-cocoa/70">Dubai showroom</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-cocoa">250+</p>
                <p className="text-xs text-cocoa/70">Happy families</p>
              </div>
            </div>
          </div>

          {/* Right Slideshow Column */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden shadow-float bg-honey/40 border-4 border-white">
              {slides.map((puppy, idx) => (
                <div
                  key={puppy.slug || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={
                      puppy.primaryImage ||
                      puppy.photos?.[0] ||
                      (typeof puppy.images?.[0] === 'string' ? puppy.images[0] : puppy.images?.[0]?.url) ||
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={puppy.name}
                    className="size-full object-cover select-none"
                  />

                  {/* Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-cocoa/90 via-cocoa/40 to-transparent text-cream flex items-end justify-between">
                    <div>
                      <p className="font-scrawl text-xl text-honey">Featured puppy</p>
                      <h3 className="font-display text-2xl sm:text-3xl font-medium">
                        {puppy.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-cream/80">{puppy.breed}</p>
                    </div>

                    <Link
                      to={`/puppies/${puppy.slug}`}
                      className="px-4 py-2 rounded-full bg-cream text-cocoa text-xs font-semibold hover:bg-honey transition-colors shadow-soft"
                    >
                      Meet {puppy.name} →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Prev / Next buttons */}
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-cream/70 hover:bg-cream text-cocoa flex items-center justify-center text-lg shadow-soft transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-cream/70 hover:bg-cream text-cocoa flex items-center justify-center text-lg shadow-soft transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dots navigation */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === currentIndex ? 'w-8 bg-cocoa' : 'w-2.5 bg-cocoa/20 hover:bg-cocoa/40'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
