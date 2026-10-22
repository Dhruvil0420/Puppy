import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function FinalCtaSection() {
  const { settings } = useSettings();

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'm interested in adopting a puppy 🐶",
    settings?.whatsappNumber
  );

  return (
    <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-4xl bg-honey/50 border border-cocoa/10 p-8 sm:p-14 lg:p-16 shadow-float overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-apricot/20 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Image (Max) */}
            <div className="lg:col-span-5 text-center">
              <div className="relative mx-auto max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-4 border-white shadow-card bg-cream">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
                  alt="Teddy Puppy"
                  className="size-full object-cover"
                />
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-cocoa/80 text-cream backdrop-blur-sm text-xs font-medium">
                  🐶 "Can't wait to meet you!"
                </div>
              </div>
            </div>

            {/* Right Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <p className="font-scrawl text-3xl text-apricot">start your journey</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-cocoa leading-tight">
                Ready to meet your new best friend?
              </h2>
              <p className="text-cocoa/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Come hold our teacup puppies in our Downtown Dubai showroom, or send us a WhatsApp message to discover rare miniature puppies ready to join your family.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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

                <Button to="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                  Visit & contact
                </Button>
              </div>

              <p className="text-xs text-cocoa/60 pt-2">
                Showroom visits by appointment in Downtown Dubai • U.A.E. Vet Certified
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
