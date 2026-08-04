const https = require('https');
const querystring = require('querystring');

const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';
const SMSONLINEGH_API_KEY = process.env.SMSONLINEGH_API_KEY;

function normalizeGhanaPhone(n) {
  let num = String(n).trim().replace(/\s+/g, '');
  if (num.startsWith('0') && num.length === 10) num = '233' + num.slice(1);
  return num;
}

async function sendSMS(to, message) {
  if (!SMSONLINEGH_API_KEY) {
    console.warn('[SMS] SMSONLINEGH_API_KEY not set — skipping');
    return;
  }

  const numbers = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map(normalizeGhanaPhone);

  if (numbers.length === 0) { console.warn('[SMS] No valid recipients'); return; }

  // Send one request per recipient (form-encoded, key in body)
  for (const number of numbers) {
    const payload = querystring.stringify({
      key: SMSONLINEGH_API_KEY.trim(),
      sender: SENDER_ID,
      text: message,
      to: number,
      type: '0',
    });

    await new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.smsonlinegh.com',
        path: '/v5/message/sms/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          console.log('[SMS] Status:', res.statusCode, '| to:', number, '| body:', data);
          resolve();
        });
      });
      req.on('error', err => { console.error('[SMS] Error:', err.message); resolve(); });
      req.write(payload);
      req.end();
    });
  }
}

module.exports = { sendSMS };
