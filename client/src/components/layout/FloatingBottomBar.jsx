import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function FloatingBottomBar() {
  const { settings } = useSettings();

  const waLink = buildWhatsAppLink(
    settings?.whatsappDefaultMessage || "Hi TeddyPups! I'd love to know more about your puppies.",
    settings?.whatsappNumber
  );

  const phone = settings?.phone || '+971 54 167 6733';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden bg-cream/95 backdrop-blur-md border-t border-cocoa/10 shadow-float">
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-soft active:scale-95 transition-transform"
        >
          <span>💬</span>
          <span>WhatsApp us</span>
        </a>

        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center gap-2 h-11 rounded-full bg-cocoa text-cream text-sm font-semibold shadow-soft active:scale-95 transition-transform"
        >
          <span>📞</span>
          <span>Call</span>
        </a>
      </div>
    </div>
  );
}
