import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Button from '../ui/Button';

export default function EnquiryForm({ puppy, onSuccess }) {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: puppy ? `Hi! I'd love to know more about ${puppy.name} (${puppy.breed}).` : '',
    website: '', // honeypot
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 80) {
      errors.name = 'Please enter your name (2 to 80 characters).';
    }

    const phoneRegex = /^[\d\s+\-]{6,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number with country code (6 to 20 digits).';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (formData.area && formData.area.length > 80) {
      errors.area = 'Area must be 80 characters or fewer.';
    }

    if (formData.message && formData.message.length > 1000) {
      errors.message = 'Message must be 1000 characters or fewer.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFieldErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : undefined,
        area: formData.area ? formData.area.trim() : undefined,
        message: formData.message ? formData.message.trim() : undefined,
        source: puppy ? 'puppy' : 'contact',
        puppySlug: puppy?.slug,
        website: formData.website, // honeypot
      };

      const res = await api.post('/enquiries', payload);

      if (res.data?.success) {
        toast.success(res.data.message || 'Thank you! Your enquiry has been received.');
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          area: '',
          message: puppy ? `Hi! I'd love to know more about ${puppy.name} (${puppy.breed}).` : '',
          website: '',
        });
        onSuccess?.();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Map backend express-validator errors onto fields
        const backendMap = {};
        err.response.data.errors.forEach((errObj) => {
          backendMap[errObj.field] = errObj.message;
        });
        setFieldErrors(backendMap);
      }
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3">
        <span className="text-4xl">💌</span>
        <h4 className="font-display text-2xl font-medium text-emerald-950">
          Enquiry sent!
        </h4>
        <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Our Dubai care team will message or call you shortly on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs text-emerald-700 underline font-semibold mt-2 cursor-pointer"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-cocoa">
      {/* Honeypot field (hidden) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="hp_website">Website</label>
        <input
          type="text"
          id="hp_website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="eq_name" className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          id="eq_name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Maryam Al Maktoum"
          className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
            fieldErrors.name
              ? 'border-rose-400 bg-rose-50/50'
              : 'border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa'
          }`}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.name}</p>
        )}
      </div>

      {/* Phone / WhatsApp */}
      <div>
        <label htmlFor="eq_phone" className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
          Phone or WhatsApp *
        </label>
        <input
          type="tel"
          id="eq_phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="+971 50 123 4567"
          className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
            fieldErrors.phone
              ? 'border-rose-400 bg-rose-50/50'
              : 'border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa'
          }`}
        />
        <p className="mt-1 text-[11px] text-cocoa/50">
          With country code, e.g. +971 50 123 4567
        </p>
        {fieldErrors.phone && (
          <p className="mt-0.5 text-xs text-rose-500 font-medium">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Email & Area row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eq_email" className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            id="eq_email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="maryam@example.com"
            className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
              fieldErrors.email
                ? 'border-rose-400 bg-rose-50/50'
                : 'border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="eq_area" className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
            Area (Optional)
          </label>
          <input
            type="text"
            id="eq_area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g. Dubai Marina"
            className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
              fieldErrors.area
                ? 'border-rose-400 bg-rose-50/50'
                : 'border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa'
            }`}
          />
          {fieldErrors.area && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.area}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="eq_message" className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
          Message
        </label>
        <textarea
          id="eq_message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
            fieldErrors.message
              ? 'border-rose-400 bg-rose-50/50'
              : 'border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa'
          }`}
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? 'Sending enquiry...' : 'Submit Enquiry'}
      </Button>
    </form>
  );
}
