import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '@/services/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Lightbox from '@/components/ui/Lightbox';
import EnquiryForm from '@/components/puppies/EnquiryForm';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { useSettings } from '@/context/SettingsContext';

export default function PuppyDetailPage() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const formRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery states
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setActivePhotoIdx(0);
    setIsPlayingVideo(false);

    api.get(`/puppies/${slug}`)
      .then((res) => {
        if (isMounted && res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  const puppy = data?.puppy;
  const prev = data?.prev;
  const next = data?.next;

  const photos = useMemo(() => {
    if (!puppy) return [];
    if (Array.isArray(puppy.photos) && puppy.photos.length > 0) return puppy.photos;
    if (Array.isArray(puppy.images) && puppy.images.length > 0) {
      return puppy.images.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
    }
    if (puppy.primaryImage) return [puppy.primaryImage];
    return [];
  }, [puppy]);

  // Arrow & swipe handlers for gallery
  const handlePrevPhoto = useCallback(() => {
    setIsPlayingVideo(false);
    setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNextPhoto = useCallback(() => {
    setIsPlayingVideo(false);
    setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation for image arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPhoto, handleNextPhoto, isLightboxOpen]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton variant="rect" className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rect" className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Skeleton variant="text" className="w-1/3 h-6" />
          <Skeleton variant="text" className="w-2/3 h-10" />
          <Skeleton variant="text" className="w-1/2 h-6" />
          <Skeleton variant="rect" className="w-full h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !puppy) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <span className="text-5xl">🐶</span>
        <h2 className="font-display text-3xl text-cocoa">Puppy Not Found</h2>
        <p className="text-cocoa/70 text-sm">
          This puppy may have already found their loving family or the link is incorrect.
        </p>
        <Button to="/puppies" variant="primary">
          View available puppies
        </Button>
      </div>
    );
  }

  const isGoneHome = puppy.status === 'gone-home';
  const isAvailable = puppy.status === 'available';
  const isReserved = puppy.status === 'reserved';
  const isImported = puppy.origin === 'imported';

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://teddypups.ae/puppies/${puppy.slug}`;
  const waMsg = `Hi TeddyPups! I'm interested in ${puppy.name}, the ${puppy.breed}: ${currentUrl}`;
  const waLink = buildWhatsAppLink(waMsg, settings?.whatsappNumber);

  const scrollToEnquiry = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{puppy.name} — {puppy.breed} | TeddyPups Dubai</title>
        <meta
          name="description"
          content={`Meet ${puppy.name}, an adorable ${puppy.gender} ${puppy.breed} available in Dubai at TeddyPups showroom.`}
        />
        <meta property="og:title" content={`${puppy.name} — ${puppy.breed} | TeddyPups Dubai`} />
        <meta property="og:description" content={`Meet ${puppy.name}, an adorable ${puppy.gender} ${puppy.breed}.`} />
        {puppy.primaryImage && <meta property="og:image" content={puppy.primaryImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${puppy.name} - ${puppy.breed}`,
            image: photos.length > 0 ? photos : [puppy.primaryImage],
            description: puppy.description || `Meet ${puppy.name}, an adorable ${puppy.gender} ${puppy.breed} in Dubai.`,
            brand: {
              '@type': 'Brand',
              name: 'TeddyPups U.A.E.',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'AED',
              availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: currentUrl,
            },
          })}
        </script>
      </Helmet>

      <div className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pb-6 border-b border-cocoa/10 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-cocoa/60 font-medium">
            <Link to="/" className="hover:text-cocoa">Home</Link>
            <span>/</span>
            <Link to="/puppies" className="hover:text-cocoa">Puppies</Link>
            <span>/</span>
            <span className="text-cocoa font-semibold">{puppy.name}</span>
          </div>

          <Link to="/puppies" className="font-semibold text-apricot-dark hover:underline">
            ← All puppies
          </Link>
        </nav>

        {/* Main Grid: Gallery & Puppy Info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image / Video Viewport */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-honey/30 shadow-card border border-cocoa/10 group select-none">
              {isPlayingVideo && puppy.videoUrl ? (
                <video
                  src={puppy.videoUrl}
                  poster={puppy.videoPoster || photos[0] || puppy.primaryImage}
                  controls
                  playsInline
                  preload="metadata"
                  className="size-full object-cover bg-black"
                />
              ) : (
                <img
                  src={photos[activePhotoIdx] || puppy.primaryImage}
                  alt={puppy.name}
                  onClick={() => setIsLightboxOpen(true)}
                  className="size-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-102"
                />
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                {isAvailable && <Badge type="available">Available</Badge>}
                {isReserved && <Badge type="reserved">Reserved</Badge>}
                {isGoneHome && <Badge type="gone-home">gone home ♥</Badge>}
              </div>

              {/* Slide Counter "‹ 1 / N ›" */}
              {photos.length > 1 && !isPlayingVideo && (
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 pointer-events-none">
                  <div className="px-4 py-1.5 rounded-full bg-cocoa/80 text-cream text-xs font-semibold backdrop-blur-md shadow-soft flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                      className="hover:text-honey text-sm px-1 cursor-pointer"
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <span>
                      {activePhotoIdx + 1} / {photos.length}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                      className="hover:text-honey text-sm px-1 cursor-pointer"
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {/* Video thumbnail button if videoUrl is present */}
              {puppy.videoUrl && (
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className={`size-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all relative bg-cocoa flex flex-col items-center justify-center text-cream shadow-soft cursor-pointer ${
                    isPlayingVideo ? 'border-apricot ring-2 ring-apricot/30' : 'border-cocoa/10 hover:border-apricot'
                  }`}
                  aria-label="Play puppy video"
                >
                  <span className="text-xl">▶</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Video</span>
                </button>
              )}

              {/* Image thumbnails */}
              {photos.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsPlayingVideo(false);
                    setActivePhotoIdx(i);
                  }}
                  className={`size-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all shadow-soft cursor-pointer bg-honey/20 ${
                    !isPlayingVideo && activePhotoIdx === i
                      ? 'border-apricot ring-2 ring-apricot/30 scale-102'
                      : 'border-cocoa/10 hover:border-cocoa/30'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Puppy Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge type="origin">
                  {isImported ? 'Imported for you' : 'In our Dubai showroom'}
                </Badge>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-medium text-cocoa mt-2">
                {puppy.name}
              </h1>
              <p className="font-scrawl text-2xl text-apricot mt-1">
                {puppy.breed}
              </p>
            </div>

            {/* Details Table */}
            <div className="rounded-3xl bg-sand/40 border border-cocoa/10 p-5 divide-y divide-cocoa/10 text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-cocoa/70 font-medium">Breed</span>
                <span className="font-semibold text-cocoa">{puppy.breed}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-cocoa/70 font-medium">Boy or girl</span>
                <span className="font-semibold text-cocoa capitalize">{puppy.gender}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-cocoa/70 font-medium">Age</span>
                <span className="font-semibold text-cocoa">{puppy.age || 'Puppy'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-cocoa/70 font-medium">Where</span>
                <span className="font-semibold text-cocoa">
                  {isImported ? 'Imported for you (Korea → Dubai)' : 'In our Dubai showroom'}
                </span>
              </div>
            </div>

            {/* CTAs */}
            {isGoneHome ? (
              <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <Badge type="gone-home">gone home ♥</Badge>
                <p className="text-sm text-rose-900 font-medium">
                  {puppy.name} has found their family! Browse our currently available puppies to find yours.
                </p>
                <Button to="/puppies" variant="primary" size="md">
                  See available puppies
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Button
                  href={waLink}
                  variant="whatsapp"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-base"
                >
                  <span>💬</span>
                  <span>Ask about {puppy.name} on WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={scrollToEnquiry}
                  className="w-full"
                >
                  Send an enquiry
                </Button>
              </div>
            )}

            {/* Description */}
            {puppy.description && (
              <div className="pt-2">
                <h3 className="font-display text-lg font-semibold text-cocoa mb-2">
                  Meet {puppy.name}
                </h3>
                <p className="text-cocoa/80 text-sm leading-relaxed whitespace-pre-line">
                  {puppy.description}
                </p>
              </div>
            )}

            {/* "Every Teddy Pup comes" Checklist */}
            <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-soft space-y-3">
              <h3 className="font-display text-lg font-semibold text-cocoa">
                Every Teddy Pup comes:
              </h3>
              <ul className="space-y-2 text-sm text-cocoa/80">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Vaccinated
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Dewormed
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Verified health certificate from licensed vets
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Thoroughly checked before joining your family
                </li>
              </ul>
            </div>

            {/* Journey steps: Imported vs Local */}
            <div className="rounded-3xl bg-sand/30 border border-cocoa/10 p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-cocoa">
                {isImported ? 'Coming home from abroad' : 'Meeting in Dubai'}
              </h3>
              {isImported ? (
                <ol className="space-y-3 text-xs sm:text-sm text-cocoa/80">
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">1</span>
                    <span><strong>Reservation:</strong> We confirm puppy availability and finalize export health documentation in South Korea.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">2</span>
                    <span><strong>Live Video Updates:</strong> Receive weekly videos & vet records as your puppy grows.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">3</span>
                    <span><strong>Flight Nanny Travel:</strong> Your puppy travels in-cabin with our certified flight nanny directly to Dubai.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">4</span>
                    <span><strong>Welcome Home:</strong> Dubai vet clearance and hand-delivery to your home or showroom pickup.</span>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-3 text-xs sm:text-sm text-cocoa/80">
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">1</span>
                    <span><strong>Private Visit:</strong> Book a private appointment at our Downtown Dubai showroom to cuddle and bond.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">2</span>
                    <span><strong>Health Verification:</strong> Review the official U.A.E. pet passport, microchip, and vet checks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="size-6 shrink-0 rounded-full bg-honey flex items-center justify-center font-bold text-xs">3</span>
                    <span><strong>Same-Day Welcome:</strong> Take your puppy home today with food guide and starter care package.</span>
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>

        {/* Enquiry Form Section (hidden if gone home) */}
        {!isGoneHome && (
          <div ref={formRef} className="mt-20 max-w-2xl mx-auto rounded-3xl bg-white border border-cocoa/10 p-8 sm:p-10 shadow-card">
            <div className="text-center space-y-2 mb-8">
              <p className="font-scrawl text-2xl text-apricot">have questions?</p>
              <h3 className="font-display text-3xl font-medium text-cocoa">
                Enquire about {puppy.name}
              </h3>
              <p className="text-xs sm:text-sm text-cocoa/70">
                Send us your contact information and our showroom team will message you right back.
              </p>
            </div>

            <EnquiryForm puppy={puppy} />
          </div>
        )}

        {/* Previous Pup / Next Pup Cards */}
        <div className="mt-20 pt-12 border-t border-cocoa/10">
          <div className="flex items-center justify-between mb-6">
            <span className="font-scrawl text-2xl text-apricot">neighbouring puppies</span>
            <Link to="/puppies" className="text-xs font-semibold text-cocoa/70 hover:text-cocoa">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {prev && (
              <Link
                to={`/puppies/${prev.slug}`}
                className="group rounded-3xl bg-sand/30 hover:bg-sand/60 border border-cocoa/10 p-6 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-xs text-cocoa/50 font-bold uppercase tracking-wider">‹ Previous Puppy</span>
                  <h4 className="font-display text-2xl font-medium text-cocoa group-hover:text-apricot transition-colors mt-0.5">
                    {prev.name}
                  </h4>
                </div>
                <span className="text-2xl text-cocoa group-hover:-translate-x-1 transition-transform">‹</span>
              </Link>
            )}

            {next && (
              <Link
                to={`/puppies/${next.slug}`}
                className="group rounded-3xl bg-sand/30 hover:bg-sand/60 border border-cocoa/10 p-6 flex items-center justify-between transition-all text-right ml-auto w-full"
              >
                <span className="text-2xl text-cocoa group-hover:translate-x-1 transition-transform">›</span>
                <div>
                  <span className="text-xs text-cocoa/50 font-bold uppercase tracking-wider">Next Puppy ›</span>
                  <h4 className="font-display text-2xl font-medium text-cocoa group-hover:text-apricot transition-colors mt-0.5">
                    {next.name}
                  </h4>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for full gallery view */}
      <Lightbox
        isOpen={isLightboxOpen}
        images={photos}
        currentIndex={activePhotoIdx}
        onClose={() => setIsLightboxOpen(false)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />
    </>
  );
}
