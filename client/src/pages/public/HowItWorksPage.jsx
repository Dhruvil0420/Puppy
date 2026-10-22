import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { useSettings } from '@/context/SettingsContext';

export default function HowItWorksPage() {
  const { settings } = useSettings();
  const [activeSection, setActiveSection] = useState('two-ways');

  const navItems = [
    { id: 'two-ways', label: '1. Two ways home' },
    { id: 'promise', label: '2. Our puppy promise' },
    { id: 'delivery', label: '3. Delivery & collection' },
    { id: 'why', label: '4. Why choose us' },
  ];

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd like to book an appointment to visit your Dubai showroom.",
    settings?.whatsappNumber
  );

  return (
    <>
      <Helmet>
        <title>How It Works — Adoption, Delivery & Guarantee | TeddyPups U.A.E.</title>
        <meta
          name="description"
          content="Learn how adopting a teacup puppy works: meet in person in Downtown Dubai or order upon request from Korea. Transparent, ethical, and fully guaranteed."
        />
      </Helmet>

      <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="the adoption journey"
          title="How it works"
          subtitle="Everything you need to know about welcoming your new family member home with complete peace of mind."
        />

        {/* Sticky in-page navigation */}
        <div className="sticky top-20 z-30 my-8 py-3 bg-cream/90 backdrop-blur-md border-y border-cocoa/10">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-cocoa text-cream shadow-soft'
                    : 'bg-sand/50 text-cocoa hover:bg-sand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: Two ways home */}
        <section id="two-ways" className="pt-8 pb-16 space-y-10 scroll-mt-36">
          <div className="max-w-3xl">
            <span className="font-scrawl text-2xl text-apricot">step by step</span>
            <h2 className="font-display text-3xl sm:text-4xl text-cocoa font-medium mt-1">
              Two ways home
            </h2>
            <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed mt-2">
              Whether you want to cuddle puppies today in our Downtown Dubai showroom or handpick a rare micro breed imported with dedicated flight care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column A: Meet in person */}
            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏙️</span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-cocoa">
                    Meet in person
                  </h3>
                  <p className="text-xs text-cocoa/60 font-semibold uppercase tracking-wider">Downtown Dubai Showroom</p>
                </div>
              </div>

              <ol className="space-y-4 text-sm text-cocoa/80">
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-honey flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Browse Available Pups:</strong>
                    <span>Check our online catalog or ask us on WhatsApp for currently residing showroom puppies.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-honey flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Book a Private Appointment:</strong>
                    <span>Enjoy an exclusive, unhurried session where your family interacts directly with the puppy.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-honey flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Vet Records Review:</strong>
                    <span>Inspect health cards, U.A.E. microchip certification, vaccinations, and deworming paperwork.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-honey flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Take Home Today:</strong>
                    <span>Complete adoption paperwork and head home with our puppy starter package and care guide.</span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Column B: Order upon request */}
            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✈️</span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-cocoa">
                    Order upon request
                  </h3>
                  <p className="text-xs text-cocoa/60 font-semibold uppercase tracking-wider">Europe · Korea → Dubai</p>
                </div>
              </div>

              <ol className="space-y-4 text-sm text-cocoa/80">
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-apricot-light text-cocoa flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Specify Your Dream Puppy:</strong>
                    <span>Select desired breed, coat color, eye shape, and anticipated adult size with our consultants.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-apricot-light text-cocoa flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Curated Video Selection:</strong>
                    <span>Receive real-time 4K videos, parent pedigrees, and vet inspections from our ethical partners.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-apricot-light text-cocoa flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">In-Cabin Flight Nanny:</strong>
                    <span>Our certified pet nanny travels alongside the puppy in the airplane cabin with continuous feeding and cuddles.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-7 rounded-full bg-apricot-light text-cocoa flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="block text-cocoa font-semibold">Dubai Welcoming & Handover:</strong>
                    <span>Receive your puppy at our Downtown Dubai showroom or delivered directly to your doorstep.</span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* SECTION 2: Our premium puppy promise */}
        <section id="promise" className="py-16 space-y-10 border-t border-cocoa/10 scroll-mt-36">
          <div className="max-w-3xl">
            <span className="font-scrawl text-2xl text-apricot">our standards</span>
            <h2 className="font-display text-3xl sm:text-4xl text-cocoa font-medium mt-1">
              Our premium puppy promise
            </h2>
            <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed mt-2">
              We hold the highest veterinary and ethical animal welfare standards in the United Arab Emirates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-sand/30 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-3">
              <span className="text-3xl">🩺</span>
              <h3 className="font-display text-xl font-medium text-cocoa">Comprehensive Health Guarantee</h3>
              <p className="text-cocoa/75 text-sm leading-relaxed">
                Every puppy is covered against congenital and hereditary health conditions with mandatory pre-travel and pre-handover veterinary certifications.
              </p>
            </div>

            <div className="rounded-3xl bg-sand/30 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-3">
              <span className="text-3xl">🌿</span>
              <h3 className="font-display text-xl font-medium text-cocoa">Ethical, Cage-Free Breeders</h3>
              <p className="text-cocoa/75 text-sm leading-relaxed">
                We work strictly with registered, home-based and cage-free breeders who prioritize early socialization, affectionate temperaments, and clean genetics.
              </p>
            </div>

            <div className="rounded-3xl bg-sand/30 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-3">
              <span className="text-3xl">🍼</span>
              <h3 className="font-display text-xl font-medium text-cocoa">Lifetime Care Consultation</h3>
              <p className="text-cocoa/75 text-sm leading-relaxed">
                Adoption is just the first step. Our care experts provide ongoing advice on grooming, nutrition, potty training, and preventative wellness for years to come.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Delivery & collection */}
        <section id="delivery" className="py-16 space-y-10 border-t border-cocoa/10 scroll-mt-36">
          <div className="max-w-3xl">
            <span className="font-scrawl text-2xl text-apricot">safe transit</span>
            <h2 className="font-display text-3xl sm:text-4xl text-cocoa font-medium mt-1">
              Delivery & collection
            </h2>
            <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed mt-2">
              Flexible options designed around your schedule and the ultimate comfort of the puppy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-2">
              <span className="text-2xl">🚗</span>
              <h4 className="font-display text-lg font-medium text-cocoa">Same Day Dubai Pickup</h4>
              <p className="text-xs sm:text-sm text-cocoa/70 leading-relaxed">
                Adopt directly from our Downtown showroom and carry your puppy home within hours.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-2">
              <span className="text-2xl">🏡</span>
              <h4 className="font-display text-lg font-medium text-cocoa">Within Dubai & U.A.E.</h4>
              <p className="text-xs sm:text-sm text-cocoa/70 leading-relaxed">
                Private air-conditioned vehicle delivery to Dubai, Abu Dhabi, Sharjah, and across the Emirates.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-2">
              <span className="text-2xl">✈️</span>
              <h4 className="font-display text-lg font-medium text-cocoa">International Flight Nanny</h4>
              <p className="text-xs sm:text-sm text-cocoa/70 leading-relaxed">
                Personal attendant carrying the puppy inside the airplane passenger cabin for absolute safety.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-2">
              <span className="text-2xl">🌍</span>
              <h4 className="font-display text-lg font-medium text-cocoa">Worldwide Shipping</h4>
              <p className="text-xs sm:text-sm text-cocoa/70 leading-relaxed">
                Export permits, customs clearance, and global flight routing to Saudi Arabia, Kuwait, and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Why choose us */}
        <section id="why" className="py-16 space-y-10 border-t border-cocoa/10 scroll-mt-36">
          <div className="max-w-3xl">
            <span className="font-scrawl text-2xl text-apricot">the teddypups difference</span>
            <h2 className="font-display text-3xl sm:text-4xl text-cocoa font-medium mt-1">
              Why choose us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-sand/40 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-2">
              <h4 className="font-display text-lg font-medium text-cocoa">1. Transparent & Ethical</h4>
              <p className="text-xs sm:text-sm text-cocoa/75 leading-relaxed">
                No hidden brokers or unexpected surprises. You receive verifiable medical records and real photos.
              </p>
            </div>

            <div className="rounded-3xl bg-sand/40 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-2">
              <h4 className="font-display text-lg font-medium text-cocoa">2. True Teacup Dimensions</h4>
              <p className="text-xs sm:text-sm text-cocoa/75 leading-relaxed">
                We specialize in petite, doll-faced teddy bear proportions that remain small, sweet, and manageable.
              </p>
            </div>

            <div className="rounded-3xl bg-sand/40 border border-cocoa/10 p-6 sm:p-7 shadow-soft space-y-2">
              <h4 className="font-display text-lg font-medium text-cocoa">3. Elite Showroom Experience</h4>
              <p className="text-xs sm:text-sm text-cocoa/75 leading-relaxed">
                A serene Downtown showroom built specifically for intimate bonding and peaceful puppy introduction.
              </p>
            </div>
          </div>

          {/* Unique and high quality puppies paragraph */}
          <div className="rounded-3xl bg-white border border-cocoa/10 p-8 sm:p-10 shadow-card space-y-6">
            <h3 className="font-display text-2xl font-medium text-cocoa">
              Unique and high quality puppies
            </h3>
            <p className="text-cocoa/80 text-sm sm:text-base leading-relaxed">
              At TeddyPups U.A.E., our passion is bringing joy, warmth, and lifelong companionship to homes throughout Dubai and the Gulf. Every puppy in our showroom is selected for exceptional disposition, radiant health, and picture-perfect features. From tiny button noses to fluffy teddy bear coats, we take pride in offering the finest teacup and miniature breeds available anywhere in the region.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button href={waLink} variant="whatsapp" size="lg" target="_blank" rel="noopener noreferrer">
                <span>💬</span>
                <span>Speak to our puppy consultant</span>
              </Button>
              <Button to="/puppies" variant="primary" size="lg">
                View available puppies
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
