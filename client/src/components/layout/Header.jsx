import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import Button from '../ui/Button';

// SVG Paw Icon for active nav link
function PawIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="currentColor">
      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
    </svg>
  );
}

export default function Header() {
  const { settings } = useSettings();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Track scroll position for header glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Puppies', path: '/puppies' },
    { label: 'Happy families', path: '/happy-families' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Visit & contact', path: '/contact' },
  ];

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd love to know more about your puppies.",
    settings?.whatsappNumber
  );

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-honey text-cocoa text-center py-2 px-4 text-xs sm:text-sm font-medium border-b border-cocoa/5 flex items-center justify-center gap-2 select-none">
        <PawIcon className="size-3.5 text-apricot animate-pulse" />
        <span className="font-scrawl text-lg text-cocoa tracking-wide">
          every puppy is family
        </span>
        <span className="hidden sm:inline font-sans text-xs text-cocoa/70">• Downtown Dubai Showroom</span>
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/90 backdrop-blur-md shadow-soft border-b border-cocoa/5'
            : 'bg-cream/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="TeddyPups Home">
            <div className="size-11 sm:size-12 rounded-2xl bg-honey/60 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform shadow-soft">
              🐶
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-cocoa">
                TeddyPups
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-apricot -mt-1">
                Dubai, U.A.E.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-honey text-cocoa font-semibold shadow-soft'
                      : 'text-cocoa/80 hover:text-cocoa hover:bg-honey/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && <PawIcon className="size-3.5 text-cocoa" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={waLink}
              variant="whatsapp"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              href={waLink}
              variant="whatsapp"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              className="!h-9 !px-3 text-xs"
            >
              WhatsApp
            </Button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-cocoa/20 bg-cream text-cocoa text-xs font-semibold shadow-soft active:scale-95 cursor-pointer"
              aria-label="Open menu"
            >
              <PawIcon className="size-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (where to, friend?) */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[100] bg-honey flex flex-col justify-between p-6 sm:p-8 animate-fade-in text-cocoa"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between">
            <span className="font-scrawl text-2xl text-apricot-dark">
              where to, friend?
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="h-10 px-5 rounded-full bg-cocoa text-cream text-sm font-semibold active:scale-95 cursor-pointer transition-colors hover:bg-cocoa-light"
            >
              Close
            </button>
          </div>

          {/* Nav Links */}
          <nav aria-label="Mobile Navigation" className="my-auto py-6">
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `font-display block py-1 text-3xl sm:text-4xl transition-transform hover:translate-x-2 ${
                        isActive ? 'text-apricot-dark font-bold underline decoration-wavy' : 'text-cocoa'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Drawer Footer */}
          <div className="space-y-3 pt-4 border-t border-cocoa/10">
            <Button
              href={waLink}
              variant="whatsapp"
              size="lg"
              className="w-full text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </Button>
            <p className="text-center text-sm font-medium text-cocoa/80">
              Showroom: {settings?.phone || '+971 54 167 6733'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
