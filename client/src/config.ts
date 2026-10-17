// Backend API address. Set VITE_API_URL in client/.env to override
// (e.g. VITE_API_URL=https://api.hazarideviduckfarm.com for production).
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname || 'localhost'}:4000`;

// The farm number that customers message on WhatsApp. It MUST have a WhatsApp account:
// WhatsApp itself refuses to open a chat with a number that isn't registered.
// Override with VITE_WHATSAPP_NUMBER in client/.env (10 digits, no +977).
export const WHATSAPP_NUMBER: string = String(import.meta.env.VITE_WHATSAPP_NUMBER || '9807760832')
  .replace(/[^0-9]/g, '')
  .slice(-10);

/** Base chat link; append `?text=...` (already URL-encoded) for a pre-filled message. */
export const WHATSAPP_URL = `https://wa.me/977${WHATSAPP_NUMBER}`;
