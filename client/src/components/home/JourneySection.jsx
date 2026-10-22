import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function JourneySection() {
  const { settings } = useSettings();

  const steps = [
    {
      num: '1',
      title: 'Choose your breed',
      desc: 'Browse our available puppies in Dubai or explore our handpicked rare breeds from trusted international partners.',
      icon: '🐾',
    },
    {
      num: '2',
      title: 'Get photos & details',
      desc: 'Message us on WhatsApp. We will send you fresh HD videos, close-up photos, vet certificates, and parent history.',
      icon: '📸',
    },
    {
      num: '3',
      title: 'Secure & safe delivery',
      desc: 'Meet your puppy in our private Dubai showroom or have them personally accompanied by our dedicated flight nanny right to your arms.',
      icon: '🏡',
    },
  ];

  const breedChips = [
    { label: 'Maltipoo', slug: 'maltipoo' },
    { label: 'Pomeranian', slug: 'pomeranian' },
    { label: 'Poodle', slug: 'poodle' },
    { label: 'Cavapoo', slug: 'cavapoo' },
    { label: 'Shih Tzu', slug: 'shih-tzu' },
  ];

  const photoStrip = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop&q=80',
  ];

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd love to know more about your puppies.",
    settings?.whatsappNumber
  );

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="how it works"
          title="Your puppy journey"
          subtitle="Simple, transparent, and joyful every step of the way."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* 3 Step Process */}
          <div className="lg:col-span-6 space-y-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="flex items-start gap-4 p-5 rounded-3xl bg-sand/30 border border-cocoa/5 shadow-soft hover:bg-sand/60 transition-colors"
              >
                <div className="size-12 shrink-0 rounded-2xl bg-honey flex items-center justify-center font-display text-xl font-bold text-cocoa shadow-soft">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-display text-xl text-cocoa font-medium">
                    {s.title}
                  </h3>
                  <p className="text-cocoa/75 text-sm sm:text-base leading-relaxed mt-1">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Chat Mockup Card */}
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-md rounded-3xl bg-[#efeae2] border border-cocoa/15 shadow-float overflow-hidden text-cocoa">
              {/* Mockup Header */}
              <div className="bg-[#075E54] text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-honey text-cocoa flex items-center justify-center text-lg font-bold">
                    🐶
                  </div>
                  <div>
                    <h4 className="font-medium text-sm leading-tight">TeddyPups U.A.E.</h4>
                    <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      online
                    </span>
                  </div>
                </div>
                <span className="text-xs text-white/70">Downtown Dubai</span>
              </div>

              {/* Chat Body */}
              <div className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
                {/* Received Bubble */}
                <div className="max-w-[85%] bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-cocoa space-y-1">
                  <p className="font-medium text-cocoa">
                    "Hi TeddyPups! I'd love to know more about your puppies."
                  </p>
                  <span className="block text-[10px] text-cocoa/40 text-right">10:42 AM</span>
                </div>

                {/* Sent reply */}
                <div className="ml-auto max-w-[88%] bg-[#dcf8c6] p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-cocoa space-y-2">
                  <p>
                    Hello! 🐾 We would love to help you find your dream companion. Which breed are you looking for?
                  </p>
                  <span className="block text-[10px] text-cocoa/40 text-right">10:43 AM ✓✓</span>
                </div>

                {/* Breed Chips */}
                <div className="pt-2">
                  <p className="text-[11px] text-cocoa/60 font-semibold mb-2">Tap to explore breeds:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {breedChips.map((chip) => (
                      <Link
                        key={chip.slug}
                        to={`/puppies?breed=${chip.slug}`}
                        className="px-3 py-1 rounded-full bg-white hover:bg-honey border border-cocoa/10 text-cocoa text-xs font-medium shadow-soft transition-colors"
                      >
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4 Photo Strip */}
                <div className="pt-2">
                  <p className="text-[11px] text-cocoa/60 font-semibold mb-2">Recent showroom pups:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {photoStrip.map((photo, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-soft bg-white">
                        <img src={photo} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-card hover:bg-[#20bd5a] transition-colors"
                  >
                    <span>💬</span>
                    <span>Say hello on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
