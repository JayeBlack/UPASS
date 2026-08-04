const https = require('https');

const API_KEY = process.env.SMSONLINEGH_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';
const BASE_URL = 'api.smsonlinegh.com';

async function sendSMS(to, message) {
  if (!API_KEY) {
    console.warn('[SMS] SMSONLINEGH_API_KEY not set — skipping SMS');
    return;
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map(n => {
      let num = String(n).trim().replace(/\s+/g, '');
      // Convert local Ghanaian format (0XXXXXXXXX) to international (233XXXXXXXXX)
      if (num.startsWith('0') && num.length === 10) num = '233' + num.slice(1);
      return { to: num };
    });

  console.log('[SMS] Attempting send to:', recipients, '| message:', message);
  console.log('[SMS] Using API key prefix:', API_KEY.substring(0, 6) + '...' + ' | sender:', SENDER_ID);
  if (recipients.length === 0) { console.warn('[SMS] No valid recipients'); return; }

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
          console.log('[SMS] HTTP status:', res.statusCode, '| raw response:', data);
          try {
            const parsed = JSON.parse(data);
            if (parsed?.handshake?.label !== 'HSHK_OK') {
              console.warn('[SMS] Delivery issue:', parsed?.handshake?.label, '| to:', to);
            } else {
              console.log('[SMS] Sent successfully to:', to);
            }
          } catch {
            console.warn('[SMS] Could not parse response as JSON. Raw:', data);
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
