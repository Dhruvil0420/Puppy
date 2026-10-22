import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '@/components/ui/SectionHeading';
import Accordion from '@/components/ui/Accordion';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import api from '@/services/api';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { useSettings } from '@/context/SettingsContext';

export default function FaqPage() {
  const { settings } = useSettings();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/faqs')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setFaqs(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load FAQs:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const waLink = buildWhatsAppLink(
    "Hi TeddyPups! I have a question about adopting a puppy that isn't answered in the FAQ.",
    settings?.whatsappNumber
  );

  // FAQPage JSON-LD schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Questions & Answers — FAQ | TeddyPups Dubai</title>
        <meta
          name="description"
          content="Frequently asked questions about teacup puppies in Dubai: showroom appointments, health tests, vaccinations, travel nannies, and puppy care."
        />
        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="sniff out a question"
          title="Questions & answers"
          subtitle="Everything you need to know about our teacup puppies, health guarantees, and Dubai showroom visits."
        />

        {/* Counter pill */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/60 text-cocoa text-xs font-semibold shadow-soft">
            <span>🐾</span>
            <span>{faqs.length || 9} notes on the board</span>
          </span>
        </div>

        {/* Accordion */}
        <div className="mt-10">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rect" className="w-full h-16 rounded-3xl" />
              ))}
            </div>
          ) : (
            <Accordion items={faqs} />
          )}
        </div>

        {/* Ask your own question card */}
        <div className="mt-16 rounded-3xl bg-honey/40 border border-cocoa/10 p-8 sm:p-10 text-center space-y-4 shadow-card">
          <span className="text-4xl">💬</span>
          <h3 className="font-display text-2xl font-medium text-cocoa">
            Still have a question?
          </h3>
          <p className="text-cocoa/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Our puppy specialists are happy to answer any questions about breeds, size expectations, or showroom viewings.
          </p>
          <div className="pt-2">
            <Button
              href={waLink}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>💬</span>
              <span>Ask your own question on WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
