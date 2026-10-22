/**
 * Builds a direct WhatsApp chat URL with pre-filled message.
 * Default contact number: 971541676733
 */
export const DEFAULT_WHATSAPP_NUMBER = '971541676733';

export function buildWhatsAppLink(message = '', phone = DEFAULT_WHATSAPP_NUMBER) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message || "Hi TeddyPups! I'm interested in adopting a puppy 🐶");
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
