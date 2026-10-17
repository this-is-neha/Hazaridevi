import axios from 'axios';

/**
 * Text-message alerts to the farm's phone, sent through Sparrow SMS (https://sparrowsms.com),
 * a Nepali SMS gateway. Needs in .env:
 *   SPARROW_SMS_TOKEN  - API token from the Sparrow dashboard
 *   SPARROW_SMS_FROM   - sender identity approved by Sparrow (e.g. "TheAlert" or your own)
 *   ADMIN_SMS_NUMBER   - one or more 10-digit numbers, comma-separated (default: farm phone)
 * Without a token, SMS is skipped (and logged) - everything else keeps working.
 * EMAIL_DRY_RUN=true also puts SMS in print-only mode.
 */

const TOKEN = process.env.SPARROW_SMS_TOKEN || '';
const FROM = process.env.SPARROW_SMS_FROM || '';
const ADMIN_NUMBERS = (process.env.ADMIN_SMS_NUMBER || '9807760832')
  .split(',')
  .map((n) => n.replace(/[^0-9]/g, '').slice(-10))
  .filter((n) => n.length === 10);
const DRY_RUN = process.env.EMAIL_DRY_RUN === 'true';

export const smsConfigured = () => Boolean(TOKEN && FROM && ADMIN_NUMBERS.length);

/** Sends a short text to the admin number(s). Resolves to true if the gateway accepted it. */
export const sendAdminSms = async (text: string): Promise<boolean> => {
  // Keep it to ~2 SMS segments; plain ASCII is cheapest (Nepali script costs more per message)
  const body = text.length > 300 ? `${text.slice(0, 297)}...` : text;

  if (DRY_RUN) {
    console.log(`\n📱 [DRY RUN] SMS to ${ADMIN_NUMBERS.join(', ')}:\n   ${body.replace(/\n/g, '\n   ')}\n`);
    return true;
  }
  if (!smsConfigured()) {
    console.warn('📱 SMS not sent: set SPARROW_SMS_TOKEN and SPARROW_SMS_FROM in .env to enable admin text alerts.');
    return false;
  }

  try {
    const res = await axios.post(
      'https://api.sparrowsms.com/v2/sms/',
      new URLSearchParams({ token: TOKEN, from: FROM, to: ADMIN_NUMBERS.join(','), text: body }),
      { timeout: 15000 }
    );
    const ok = res.data?.response_code === 200;
    if (!ok) console.error('📱 Sparrow SMS rejected the message:', res.data);
    return ok;
  } catch (err: any) {
    console.error('📱 Sparrow SMS failed:', err?.response?.data || err.message);
    return false;
  }
};
