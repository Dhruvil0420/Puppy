import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import { useSettings } from '../context/SettingsContext';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();

  const [availablePuppies, setAvailablePuppies] = useState([]);
  const preselectedSlug = searchParams.get('puppy') || '';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    selectedPuppy: preselectedSlug,
    message: '',
    website: '', // honeypot
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [letterSent, setLetterSent] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get('/puppies?limit=50&status=available')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setAvailablePuppies(res.data.data);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.length < 2) {
      errors.name = 'Please provide your name';
    }
    const phoneRegex = /^[\d\s+\-]{6,20}$/;
    if (!form.phone.trim() || !phoneRegex.test(form.phone)) {
      errors.phone = 'Please provide a valid phone or WhatsApp number';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please provide a valid email address';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFieldErrors({});

    try {
      const puppyNote = form.selectedPuppy ? `Inquiring about puppy: ${form.selectedPuppy}. ` : '';
      const fullMessage = `${puppyNote}${form.message}`.trim();

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email ? form.email.trim() : undefined,
        area: form.area ? form.area.trim() : undefined,
        message: fullMessage || undefined,
        source: 'contact',
        puppySlug: form.selectedPuppy || undefined,
        website: form.website, // honeypot
      };

      const res = await api.post('/enquiries', payload);

      if (res.data?.success) {
        setLetterSent(true);
        toast.success('Your letter has been posted! We will be in touch shortly.');
        setForm({
          name: '',
          phone: '',
          email: '',
          area: '',
          selectedPuppy: '',
          message: '',
          website: '',
        });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendMap = {};
        err.response.data.errors.forEach((o) => {
          backendMap[o.field] = o.message;
        });
        setFieldErrors(backendMap);
      }
      toast.error(err.response?.data?.message || 'Failed to post letter. Please message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd like to book an appointment to visit your Dubai showroom.",
    settings?.whatsappNumber
  );

  const googleMapsUrl = 'https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7';

  return (
    <>
      <Helmet>
        <title>Get in touch with us — TeddyPups U.A.E.</title>
        <meta
          name="description"
          content="Visit our Downtown Dubai showroom by appointment or write to us about adopting your dream puppy."
        />
      </Helmet>

      <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="we would love to hear from you"
          title="Get in touch with us"
          subtitle="Our Dubai showroom is open for private family viewings by appointment. Drop us a letter or reach out on WhatsApp."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Letter-Style Form */}
          <div className="lg:col-span-7">
            <div className="rounded-4xl bg-white border border-cocoa/15 p-6 sm:p-10 shadow-card relative overflow-hidden">
              {/* Decorative Stamp */}
              <div className="absolute top-6 right-6 size-16 sm:size-20 border-2 border-dashed border-cocoa/30 rounded-2xl flex flex-col items-center justify-center text-center p-1 select-none opacity-80 rotate-3">
                <span className="text-xl sm:text-2xl">🐶</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-cocoa/60 mt-0.5">Air Mail</span>
              </div>

              {letterSent ? (
                <div className="py-12 text-center space-y-4">
                  <span className="text-5xl">💌</span>
                  <h3 className="font-display text-3xl text-cocoa font-medium">
                    Your letter is on its way!
                  </h3>
                  <p className="text-cocoa/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Thank you for writing to us. Our Dubai team has received your letter and will get back to you via WhatsApp or phone very soon.
                  </p>
                  <Button variant="secondary" size="md" onClick={() => setLetterSent(false)}>
                    Write another letter
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Honeypot */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="ct_website">Website</label>
                    <input
                      type="text"
                      id="ct_website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </div>

                  <p className="font-scrawl text-2xl text-apricot">
                    Dear TeddyPups,
                  </p>

                  <div className="text-sm sm:text-base text-cocoa leading-loose font-normal">
                    <span>My name is </span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="your full name"
                      value={form.name}
                      onChange={handleChange}
                      className={`inline-block px-3 py-1 mx-1 border-b-2 font-medium bg-sand/20 rounded-md outline-none transition-colors ${
                        fieldErrors.name ? 'border-rose-400 bg-rose-50' : 'border-cocoa/30 focus:border-cocoa'
                      }`}
                    />
                    <span>, and you can reach me on </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="phone or WhatsApp"
                      value={form.phone}
                      onChange={handleChange}
                      className={`inline-block px-3 py-1 mx-1 border-b-2 font-medium bg-sand/20 rounded-md outline-none transition-colors ${
                        fieldErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-cocoa/30 focus:border-cocoa'
                      }`}
                    />
                    <span> or by email at </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="email (optional)"
                      value={form.email}
                      onChange={handleChange}
                      className={`inline-block px-3 py-1 mx-1 border-b-2 font-medium bg-sand/20 rounded-md outline-none transition-colors ${
                        fieldErrors.email ? 'border-rose-400 bg-rose-50' : 'border-cocoa/30 focus:border-cocoa'
                      }`}
                    />
                    <span>. I live in </span>
                    <input
                      type="text"
                      name="area"
                      placeholder="city or area"
                      value={form.area}
                      onChange={handleChange}
                      className="inline-block px-3 py-1 mx-1 border-b-2 border-cocoa/30 focus:border-cocoa font-medium bg-sand/20 rounded-md outline-none"
                    />
                    <span>, and I'm curious about </span>
                    <select
                      name="selectedPuppy"
                      value={form.selectedPuppy}
                      onChange={handleChange}
                      className="inline-block px-3 py-1 mx-1 border-b-2 border-cocoa/30 focus:border-cocoa font-medium bg-sand/30 rounded-md outline-none text-cocoa cursor-pointer"
                    >
                      <option value="">any puppy (not sure yet)</option>
                      {availablePuppies.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name} ({p.breed})
                        </option>
                      ))}
                    </select>
                    <span>.</span>
                  </div>

                  {/* Message textarea */}
                  <div className="pt-2">
                    <label htmlFor="ct_message" className="block text-xs font-bold uppercase tracking-wider text-cocoa/60 mb-2">
                      A few words from you:
                    </label>
                    <textarea
                      id="ct_message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your home, questions about breed care, or preferred visit dates..."
                      className="w-full p-4 rounded-2xl border border-cocoa/15 bg-sand/20 focus:bg-white focus:border-cocoa outline-none text-sm transition-all resize-none"
                    />
                  </div>

                  {/* Letter signoff & button */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cocoa/10">
                    <p className="font-scrawl text-xl text-cocoa/70 italic text-center sm:text-left">
                      with love, a future puppy parent.
                    </p>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={submitting}
                      className="w-full sm:w-auto"
                    >
                      {submitting ? 'Posting letter...' : 'Post my letter ✉️'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Side Info & Showroom Photo */}
          <div className="lg:col-span-5 space-y-8">
            {/* Showroom Photo card */}
            <div className="rounded-4xl overflow-hidden shadow-card border border-cocoa/10 bg-white">
              <div className="aspect-[4/3] w-full bg-sand/40 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
                  alt="TeddyPups Dubai Showroom"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-transparent to-transparent flex items-end p-6 text-cream">
                  <div>
                    <span className="font-scrawl text-xl text-honey">Downtown Dubai</span>
                    <h4 className="font-display text-2xl font-medium">TeddyPups Showroom</h4>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <p className="text-cocoa/80 text-sm leading-relaxed">
                  Visit us in Downtown Dubai. Experience a calm, hygienic, and welcoming showroom where you can cuddle our teacup puppies and ask our specialists any question.
                </p>

                <div className="pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sand/60 hover:bg-sand text-cocoa font-semibold text-xs sm:text-sm transition-colors border border-cocoa/10 shadow-soft"
                  >
                    <span>📍</span>
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="rounded-3xl bg-honey/40 border border-cocoa/10 p-6 sm:p-7 shadow-card space-y-5">
              <h4 className="font-display text-xl font-medium text-cocoa">
                Direct contacts
              </h4>

              <div className="space-y-4 text-sm text-cocoa">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs uppercase font-bold text-cocoa/60">WhatsApp us</span>
                    <span className="font-medium">{settings?.whatsappNumber || '+971 54 167 6733'}</span>
                  </div>
                  <Button href={waLink} variant="whatsapp" size="sm" target="_blank" rel="noopener noreferrer">
                    Chat
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cocoa/10">
                  <div>
                    <span className="block text-xs uppercase font-bold text-cocoa/60">Call us</span>
                    <span className="font-medium">{settings?.phone || '+971 54 167 6733'}</span>
                  </div>
                  <Button href={`tel:${settings?.phone || '+971541676733'}`} variant="outline" size="sm">
                    Call
                  </Button>
                </div>

                <div className="pt-2 border-t border-cocoa/10">
                  <span className="block text-xs uppercase font-bold text-cocoa/60">Email</span>
                  <a href={`mailto:${settings?.email || 'info@teddypups.ae'}`} className="font-medium hover:underline">
                    {settings?.email || 'info@teddypups.ae'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
