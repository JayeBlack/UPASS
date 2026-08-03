const https = require('https');

const API_KEY = process.env.SMSONLINEGH_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';
const BASE_URL = 'api.smsonlinegh.com';

/**
 * Send an SMS via SMSOnlineGH v5
 * @param {string|string[]} to - phone number(s)
 * @param {string} message
 * @returns {Promise<void>} — resolves silently, never throws (fire-and-forget safe)
 */
async function sendSMS(to, message) {
  if (!API_KEY) {
    console.warn('[SMS] SMSONLINEGH_API_KEY not set — skipping SMS');
    return;
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map(n => ({ to: String(n).trim() }));

  if (recipients.length === 0) return;

  const payload = JSON.stringify({
    text: message,
    type: 0,
    to: recipients,
    sender: SENDER_ID,
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: BASE_URL,
        path: '/v5/message/sms/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `key ${API_KEY}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed?.handshake?.label !== 'HSHK_OK') {
              console.warn('[SMS] Delivery issue:', parsed?.handshake?.label, '| to:', to);
            }
          } catch {
            console.warn('[SMS] Could not parse response');
          }
          resolve();
        });
      }
    );
    req.on('error', (err) => {
      console.error('[SMS] Request error:', err.message);
      resolve();
    });
    req.write(payload);
    req.end();
  });
}

module.exports = { sendSMS };
