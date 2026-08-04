const https = require('https');

const API_KEY = process.env.SMSONLINEGH_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';
const BASE_URL = 'api.smsonlinegh.com';

async function sendSMS(to, message) {
  if (!API_KEY) {
    console.warn('[SMS] SMSONLINEGH_API_KEY not set — skipping SMS');
    return;
  }

  const numbers = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map(n => {
      let num = String(n).trim().replace(/\s+/g, '');
      if (num.startsWith('0') && num.length === 10) num = '233' + num.slice(1);
      return num;
    });

  if (numbers.length === 0) { console.warn('[SMS] No valid recipients'); return; }

  // SMSOnlineGH v5 payload — to is array of { to: "number" }
  const payload = JSON.stringify({
    text: message,
    type: 0,
    to: numbers.map(n => ({ to: n })),
    sender: SENDER_ID,
  });

  console.log('[SMS] Sending | key prefix:', API_KEY.substring(0, 8), '| key length:', API_KEY.trim().length, '| to:', numbers, '| payload:', payload);

  return new Promise((resolve) => {
    // Try v5 endpoint
    const path = '/v5/message/sms/send';
    console.log('[SMS] POST https://' + BASE_URL + path);
    const req = https.request(
      {
        hostname: BASE_URL,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `key ${API_KEY.trim()}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          console.log('[SMS] Status:', res.statusCode, '| headers:', JSON.stringify(res.headers), '| body:', data);
          try {
            const parsed = JSON.parse(data);
            if (parsed?.handshake?.label !== 'HSHK_OK') {
              console.warn('[SMS] Failed:', parsed?.handshake?.label);
            } else {
              console.log('[SMS] Success to:', numbers);
            }
          } catch {
            console.warn('[SMS] Non-JSON response:', data);
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
