import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '@/services/api';
import HeroSection from '@/components/home/HeroSection';
import MeetThePupsSection from '@/components/home/MeetThePupsSection';
import TwoWaysSection from '@/components/home/TwoWaysSection';
import JourneySection from '@/components/home/JourneySection';
import TrustSection from '@/components/home/TrustSection';
import HappyFamiliesPreview from '@/components/home/HappyFamiliesPreview';
import FaqPreview from '@/components/home/FaqPreview';
import FinalCtaSection from '@/components/home/FinalCtaSection';

export default function HomePage() {
  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/puppies?limit=15')
      .then((res) => {
        if (isMounted && res.data?.success && res.data.data) {
          setPuppies(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Error fetching puppies on homepage:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const featuredPuppies = puppies.filter((p) => p.featured || p.showOnHome).slice(0, 6);
  const heroPuppies = featuredPuppies.length > 0 ? featuredPuppies : puppies.slice(0, 6);

  return (
    <>
      <Helmet>
        <title>TeddyPups U.A.E. — Premium teacup puppies in Dubai</title>
        <meta
          name="description"
          content="Meet local puppies in our Downtown Dubai showroom or bring home a rare teacup breed imported from trusted breeders worldwide."
        />
        <meta property="og:title" content="TeddyPups U.A.E. — Premium teacup puppies in Dubai" />
        <meta property="og:description" content="Meet local puppies in our Downtown Dubai showroom or bring home a rare teacup breed imported with complete certification." />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'TeddyPups U.A.E.',
            description: 'Premium teacup puppy showroom in Downtown Dubai with ethical breeding & certification.',
            url: 'https://teddypups.ae',
            areaServed: 'United Arab Emirates',
            priceRange: '$$$$',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Dubai',
              addressCountry: 'AE',
            },
          })}
        </script>
      </Helmet>

      <div>
        {/* 1. Hero */}
        <HeroSection featuredPuppies={heroPuppies} />

        {/* 2. Meet The Pups */}
        <MeetThePupsSection puppies={puppies} loading={loading} />

        {/* 3. Two Ways */}
        <TwoWaysSection />

        {/* 4. Your Puppy Journey (3 steps + WhatsApp chat mockup) */}
        <JourneySection />

        {/* 5. Why families trust TeddyPups */}
        <TrustSection />

        {/* 6. Happy families preview with featured testimonial */}
        <HappyFamiliesPreview />

        {/* 7. FAQ Preview (3 items from /api/faqs?home=true) */}
        <FaqPreview />

        {/* 8. Final CTA with Max image */}
        <FinalCtaSection />
      </div>
    </>
  );
}
