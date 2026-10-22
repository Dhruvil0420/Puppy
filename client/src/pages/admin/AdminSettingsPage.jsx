import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import Button from '../../components/ui/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    tagline: '',
    footerText: '',
    happyMomentsCount: 250,
    whatsappDefaultMessage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get('/admin/settings')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setSettings(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error loading settings');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-medium text-cocoa">Website Settings</h1>
        <p className="text-cocoa/70 text-sm">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-medium text-cocoa">
          Website Settings
        </h1>
        <p className="text-cocoa/70 text-sm">
          Update showroom phone number, WhatsApp contact number, social links, and footer text.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl bg-white border border-cocoa/10 p-6 sm:p-8 shadow-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
              WhatsApp Number *
            </label>
            <input
              type="text"
              name="whatsappNumber"
              required
              value={settings.whatsappNumber || ''}
              onChange={handleChange}
              placeholder="+971 54 167 6733"
              className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone || ''}
              onChange={handleChange}
              placeholder="+971 54 167 6733"
              className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={settings.email || ''}
              onChange={handleChange}
              placeholder="info@teddypups.ae"
              className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
              Showroom Physical Address
            </label>
            <input
              type="text"
              name="address"
              value={settings.address || ''}
              onChange={handleChange}
              placeholder="Downtown Dubai, UAE"
              className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="pt-4 border-t border-cocoa/10 space-y-4">
          <h3 className="font-display text-lg font-medium text-cocoa">
            Social Media Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/teddypups"
                className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">TikTok URL</label>
              <input
                type="url"
                name="tiktok"
                value={settings.tiktok || ''}
                onChange={handleChange}
                placeholder="https://tiktok.com/@teddypups"
                className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={settings.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/teddypups"
                className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Brand Text & Defaults */}
        <div className="pt-4 border-t border-cocoa/10 space-y-4">
          <h3 className="font-display text-lg font-medium text-cocoa">
            Taglines & Default Messages
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Brand Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || ''}
                onChange={handleChange}
                placeholder="Home, at last."
                className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Footer Copyright Text</label>
              <input
                type="text"
                name="footerText"
                value={settings.footerText || ''}
                onChange={handleChange}
                placeholder="© 2026 TeddyPups U.A.E. All rights reserved."
                className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Default WhatsApp Message</label>
            <input
              type="text"
              name="whatsappDefaultMessage"
              value={settings.whatsappDefaultMessage || ''}
              onChange={handleChange}
              placeholder="Hi TeddyPups! I'm interested in adopting a puppy 🐶"
              className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? 'Saving changes...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
