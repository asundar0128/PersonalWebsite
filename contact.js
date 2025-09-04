export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { name, email, message, token } = req.body || {};
    if (!name || !email || !message || !token) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 1) Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server misconfigured: RECAPTCHA_SECRET missing' });

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);
    const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const vjson = await verify.json();
    if (!vjson.success) {
      return res.status(400).json({ error: 'Captcha verification failed' });
    }

    // 2) Forward to Formspree (simple reliable delivery)
    const endpoint = process.env.FORMSPREE_ENDPOINT; // e.g., https://formspree.io/f/xxxxxx
    if (!endpoint) return res.status(500).json({ error: 'Server misconfigured: FORMSPREE_ENDPOINT missing' });

    const form = new URLSearchParams();
    form.append('name', name);
    form.append('email', email);
    form.append('message', message);

    const fs = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: form
    });
    if (!fs.ok) {
      const txt = await fs.text();
      return res.status(502).json({ error: 'Upstream error: ' + txt.slice(0, 200) });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
