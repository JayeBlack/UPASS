const https = require('https');
const querystring = require('querystring');

const API_KEY = process.env.SMSONLINEGH_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || 'UMATPG';
const PORTAL_HOST = 'portal.smsonlinegh.com';

function portalPost(path, body) {
  return new Promise((resolve, reject) => {
    const payload = querystring.stringify(body);
    const req = https.request(
      {
        hostname: PORTAL_HOST,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Length': Buffer.byteLength(payload),
          // Portal uses session cookie auth — we use the API key as Bearer for portal endpoints
          'Authorization': `key ${API_KEY}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { resolve({ status: res.statusCode, body: data }); }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

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

  try {
    // Step 1: Save message
    const saveRes = await portalPost('/async/message/save', {
      category: 1, mv: 0, tplId: '', type: 0,
      message, isPsnd: 0, url: '', sender: SENDER_ID,
      varstr: '', scheduled: 0, writeClose: 1,
    });
    console.log('[SMS] Save response:', JSON.stringify(saveRes));

    const msgid = saveRes.body?.msgid;
    if (!msgid) { console.warn('[SMS] No msgid returned from save'); return; }

    // Step 2: Add destinations
    const destRes = await portalPost('/async/message/destinations/add', {
      phone: JSON.stringify(numbers),
      dialcode: 233,
      tplId: msgid,
    });
    console.log('[SMS] Destinations response:', JSON.stringify(destRes));

    // Step 3: Submit
    const submitRes = await portalPost('/async/message/submit', { tplId: msgid });
    console.log('[SMS] Submit response:', JSON.stringify(submitRes));

    if (submitRes.body?.code === 1) {
      console.log('[SMS] Sent successfully to:', numbers);
    } else {
      console.warn('[SMS] Submit failed:', JSON.stringify(submitRes.body));
    }
  } catch (err) {
    console.error('[SMS] Error:', err.message);
  }
}

module.exports = { sendSMS };
