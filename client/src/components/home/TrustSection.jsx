import React from 'react';
import SectionHeading from '../ui/SectionHeading';

export default function TrustSection() {
  const cards = [
    {
      icon: '🩺',
      title: 'Vet-checked & healthy',
      desc: 'Complete health check, age-appropriate vaccinations, deworming, and microchip with a licensed U.A.E. veterinarian certificate.',
    },
    {
      icon: '✈️',
      title: 'Korea to Dubai safely',
      desc: 'Our handpicked international puppies travel comfortably in-cabin accompanied by an experienced personal flight nanny.',
    },
    {
      icon: '🤝',
      title: 'Support 24/7',
      desc: 'From potty training tips to feeding schedules and health questions, our dedicated puppy care team is always here for you.',
    },
    {
      icon: '🌍',
      title: 'Trusted by families worldwide',
      desc: 'Over 250+ delighted families have adopted with us across Dubai, Abu Dhabi, Saudi Arabia, Kuwait, and internationally.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="our promise"
          title="Why families trust TeddyPups"
          subtitle="We place health, safety, and ethical care above everything else."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-cocoa/10 p-6 sm:p-7 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="size-14 rounded-2xl bg-honey/50 flex items-center justify-center text-3xl shadow-soft">
                  {c.icon}
                </div>
                <h3 className="font-display text-xl text-cocoa font-medium">
                  {c.title}
                </h3>
                <p className="text-cocoa/75 text-sm leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
