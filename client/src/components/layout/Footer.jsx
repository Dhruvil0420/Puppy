import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function Footer() {
  const { settings } = useSettings();

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd love to know more about your puppies.",
    settings?.whatsappNumber
  );

  return (
    <footer className="bg-sand/60 border-t border-cocoa/10 pt-16 pb-28 md:pb-16 text-cocoa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="text-3xl">🐶</span>
              <span className="font-display text-3xl font-medium tracking-tight text-cocoa">
                TeddyPups
              </span>
            </Link>

            <p className="font-scrawl text-2xl text-apricot">
              {settings?.tagline || 'Home, at last.'}
            </p>

            <p className="text-cocoa/75 text-sm sm:text-base leading-relaxed max-w-md">
              Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders worldwide.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-cream border border-cocoa/10 flex items-center justify-center text-cocoa hover:text-apricot hover:border-apricot transition-colors shadow-soft"
                  aria-label="Instagram"
                >
                  📸
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-cream border border-cocoa/10 flex items-center justify-center text-cocoa hover:text-apricot hover:border-apricot transition-colors shadow-soft"
                  aria-label="TikTok"
                >
                  🎵
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-cream border border-cocoa/10 flex items-center justify-center text-cocoa hover:text-apricot hover:border-apricot transition-colors shadow-soft"
                  aria-label="Facebook"
                >
                  📘
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-lg font-semibold text-cocoa">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-cocoa/80">
              <li>
                <Link to="/" className="hover:text-apricot transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/puppies" className="hover:text-apricot transition-colors">
                  Available puppies
                </Link>
              </li>
              <li>
                <Link to="/happy-families" className="hover:text-apricot transition-colors">
                  Happy families
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-apricot transition-colors">
                  How adoption works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-apricot transition-colors">
                  Frequently asked questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Say Hello */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-lg font-semibold text-cocoa">
              Say hello
            </h3>
            <dl className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-2 text-sm text-cocoa/80 leading-relaxed">
              <dt className="text-cocoa font-semibold">Location:</dt>
              <dd>{settings?.address || 'Downtown Dubai, UAE'}</dd>
              <dt className="text-cocoa font-semibold">Phone:</dt>
              <dd>
                <a href={`tel:${settings?.phone}`} className="hover:underline">
                  {settings?.phone || '+971 54 167 6733'}
                </a>
              </dd>
              <dt className="text-cocoa font-semibold">WhatsApp:</dt>
              <dd>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 font-medium hover:underline"
                >
                  Chat with us
                </a>
              </dd>
              <dt className="text-cocoa font-semibold">Email:</dt>
              <dd>
                <a href={`mailto:${settings?.email}`} className="hover:underline">
                  {settings?.email || 'info@teddypups.ae'}
                </a>
              </dd>
            </dl>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-cocoa/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cocoa/80 gap-4">
          <p>{settings?.footerText || '© 2026 TeddyPups U.A.E. All rights reserved.'}</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:underline">Contact us</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:underline text-cocoa/75 hover:text-cocoa font-medium">Admin portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
