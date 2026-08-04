const https = require('https');
const querystring = require('querystring');

const PROVIDER = process.env.SMS_PROVIDER || 'smsonlinegh'; // 'smsonlinegh' | 'arkesel'
const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';

// SMSOnlineGH v5
const SMSONLINEGH_API_KEY = process.env.SMSONLINEGH_API_KEY;

// Arkesel (fallback)
const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;

function normalizeGhanaPhone(n) {
  let num = String(n).trim().replace(/\s+/g, '');
  if (num.startsWith('0') && num.length === 10) num = '233' + num.slice(1);
  return num;
}

async function sendViaSMSOnlineGH(numbers, message) {
  const payload = JSON.stringify({
    text: message,
    type: 0,
    to: numbers.map(n => ({ to: n })),
    sender: SENDER_ID,
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.smsonlinegh.com',
      path: '/v5/message/sms/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `key ${SMSONLINEGH_API_KEY.trim()}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log('[SMS] SMSOnlineGH status:', res.statusCode, '| body:', data);
        resolve();
      });
    });
    req.on('error', err => { console.error('[SMS] SMSOnlineGH error:', err.message); resolve(); });
    req.write(payload);
    req.end();
  });
}

async function sendViaArkesel(numbers, message) {
  const payload = JSON.stringify({
    sender: SENDER_ID,
    message,
    recipients: numbers,
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'sms.arkesel.com',
      path: '/api/v2/sms/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': ARKESEL_API_KEY,
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log('[SMS] Arkesel status:', res.statusCode, '| body:', data);
        resolve();
      });
    });
    req.on('error', err => { console.error('[SMS] Arkesel error:', err.message); resolve(); });
    req.write(payload);
    req.end();
  });
}

async function sendSMS(to, message) {
  const numbers = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map(normalizeGhanaPhone);

  if (numbers.length === 0) { console.warn('[SMS] No valid recipients'); return; }

  console.log('[SMS] Sending to:', numbers, '| provider:', PROVIDER);

  try {
    if (PROVIDER === 'arkesel' && ARKESEL_API_KEY) {
      await sendViaArkesel(numbers, message);
    } else if (SMSONLINEGH_API_KEY) {
      await sendViaSMSOnlineGH(numbers, message);
    } else {
      console.warn('[SMS] No API key configured');
    }
  } catch (err) {
    console.error('[SMS] Unexpected error:', err.message);
  }
}

module.exports = { sendSMS };
