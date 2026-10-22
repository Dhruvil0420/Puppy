import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

export default function TwoWaysSection() {
  return (
    <section className="py-16 md:py-24 bg-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="how it works"
          title="Two ways to meet your puppy"
          subtitle="Choose between cuddling our pups in Dubai right now or having a rare teacup breed handpicked from top breeders worldwide."
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Puppies in Dubai / In our showroom */}
          <div className="group rounded-3xl bg-white border border-cocoa/10 p-8 sm:p-10 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-honey/60 flex items-center justify-center text-3xl shadow-soft group-hover:scale-105 transition-transform">
                🏙️
              </div>
              <p className="font-scrawl text-2xl text-apricot">In Dubai right now</p>
              <h3 className="font-display text-2xl sm:text-3xl text-cocoa font-medium">
                Puppies in Dubai
              </h3>
              <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed">
                Visit our cozy Downtown Dubai showroom by appointment. Play with the puppies in person, check their energy and personality, and bring your new furry family member home today.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-cocoa/75">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> In-person showroom visits by appointment
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Same-day adoption available
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Full Dubai vet check & passport ready
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-cocoa/5">
              <Link
                to="/puppies?origin=dubai"
                className="inline-flex items-center justify-center w-full h-12 rounded-full bg-cocoa text-cream font-semibold text-sm hover:bg-cocoa-light shadow-soft transition-all"
              >
                Browse showroom puppies →
              </Link>
            </div>
          </div>

          {/* Card 2: Imported for you (Korea → Dubai) */}
          <div className="group rounded-3xl bg-white border border-cocoa/10 p-8 sm:p-10 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-apricot-light flex items-center justify-center text-3xl shadow-soft group-hover:scale-105 transition-transform">
                ✈️
              </div>
              <p className="font-scrawl text-2xl text-apricot">Hand-selected internationally</p>
              <h3 className="font-display text-2xl sm:text-3xl text-cocoa font-medium">
                Imported for you (Korea → Dubai)
              </h3>
              <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed">
                Looking for an ultra-rare micro teacup Maltipoo, Poodle, or Pomeranian? We collaborate directly with premier, ethical international breeders in South Korea with end-to-end flight nanny delivery.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-cocoa/75">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Hand-delivered with experienced pet nanny
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Microchip, vaccination, and DNA health check
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Handpicked for rare colors and petite size
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-cocoa/5">
              <Link
                to="/puppies?origin=imported"
                className="inline-flex items-center justify-center w-full h-12 rounded-full bg-honey text-cocoa font-semibold text-sm hover:bg-honey/80 shadow-soft transition-all"
              >
                Browse imported puppies →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
