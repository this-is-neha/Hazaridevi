import axios from 'axios';

/**
 * Automatic WhatsApp alerts to the farm, sent by the SERVER through Meta's official
 * WhatsApp Business Cloud API (https://developers.facebook.com/docs/whatsapp/cloud-api).
 * A website button can only open WhatsApp for the customer to press Send; sending on
 * its own requires this API.
 *
 * .env:
 *   WHATSAPP_CLOUD_TOKEN      - permanent access token (System User token from Meta Business)
 *   WHATSAPP_PHONE_NUMBER_ID  - "Phone number ID" of the business number that SENDS the alerts
 *   WHATSAPP_ADMIN_TO         - farm number(s) that RECEIVE alerts, with country code, no "+"
 *                               (e.g. 9779805980832), comma-separated
 *   WHATSAPP_TEMPLATE_NAME    - approved message template with ONE body variable {{1}}
 *   WHATSAPP_TEMPLATE_LANG    - template language code (default "en")
 *
 * Meta only allows free-form text if the farm number messaged the business number in the
 * last 24 hours, so alerts are sent as an approved template whenever one is configured.
 * Without a token, WhatsApp alerts are skipped (logged) - email alerts still go out.
 * EMAIL_DRY_RUN=true also puts WhatsApp in print-only mode.
 */

const TOKEN = process.env.WHATSAPP_CLOUD_TOKEN || '';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME || '';
const TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en';
const RECIPIENTS = (process.env.WHATSAPP_ADMIN_TO || '')
  .split(',')
  .map((n) => n.replace(/[^0-9]/g, ''))
  .filter((n) => n.length >= 11);
const DRY_RUN = process.env.EMAIL_DRY_RUN === 'true';

export const whatsappConfigured = () => Boolean(TOKEN && PHONE_NUMBER_ID && RECIPIENTS.length);

const sendOne = async (to: string, text: string) => {
  // Template variables may not contain line breaks or long runs of spaces
  const oneLine = text.replace(/\s*\n\s*/g, ' | ').replace(/\s{4,}/g, ' ').slice(0, 1000);
  const body = TEMPLATE
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: TEMPLATE,
          language: { code: TEMPLATE_LANG },
          components: [{ type: 'body', parameters: [{ type: 'text', text: oneLine }] }]
        }
      }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { body: text.slice(0, 4000) } };

  await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, body, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    timeout: 15000
  });
};

/** Sends an alert to every farm WhatsApp number. Resolves to true if at least one was accepted. */
export const sendAdminWhatsApp = async (text: string): Promise<boolean> => {
  if (DRY_RUN) {
    console.log(`\n💬 [DRY RUN] WhatsApp to ${RECIPIENTS.join(', ') || '(no WHATSAPP_ADMIN_TO set)'}:\n   ${text.replace(/\n/g, '\n   ')}\n`);
    return true;
  }
  if (!whatsappConfigured()) {
    console.warn('💬 WhatsApp alert not sent: set WHATSAPP_CLOUD_TOKEN, WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ADMIN_TO in .env.');
    return false;
  }

  const results = await Promise.allSettled(RECIPIENTS.map((to) => sendOne(to, text)));
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const err: any = r.reason;
      console.error(`💬 WhatsApp alert to ${RECIPIENTS[i]} failed:`, err?.response?.data?.error?.message || err?.message);
    }
  });
  return results.some((r) => r.status === 'fulfilled');
};
