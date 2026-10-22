import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/services/api';

const SettingsContext = createContext({
  settings: null,
  loading: true,
  error: null,
});

const defaultSettings = {
  whatsappNumber: '+971 54 167 6733',
  phone: '+971 54 167 6733',
  email: 'info@teddypups.ae',
  address: 'Downtown Dubai, UAE',
  mapsUrl: 'https://maps.google.com/?q=Downtown+Dubai',
  instagram: 'https://instagram.com/teddypups',
  tiktok: 'https://tiktok.com/@teddypups',
  facebook: 'https://facebook.com/teddypups',
  tagline: 'Home, at last.',
  footerText: '© 2026 TeddyPups U.A.E. All rights reserved.',
  happyMomentsCount: 250,
  whatsappDefaultMessage: "Hi TeddyPups! I'm interested in adopting a puppy 🐶",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.get('/settings')
      .then((res) => {
        if (isMounted && res.data?.success && res.data.data) {
          setSettings({ ...defaultSettings, ...res.data.data });
        }
      })
      .catch((err) => {
        console.warn('Could not load settings from API, using defaults:', err.message);
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
