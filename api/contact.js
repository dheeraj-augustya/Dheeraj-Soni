// Prefer working IPv4 routes on networks with DNS-advertised but unreachable IPv6.
require('node:dns').setDefaultResultOrder('ipv4first');

const limits = new Map();
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

module.exports = async function contact(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Please use POST.' });
  }
  const origin = req.headers?.origin;
  const host = req.headers?.host;
  if (origin) {
    try {
      if (new URL(origin).host !== host) return res.status(403).json({ error: 'Please submit from this website.' });
    } catch { return res.status(403).json({ error: 'Invalid request origin.' }); }
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid request.' }); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid request.' });
  // A hidden field catches simple bots without adding a visible challenge.
  if (body.website) return res.status(200).json({ message: 'Thank you. Your message has been submitted.' });
  const { name, email, message } = body;
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 || /[\r\n\x00-\x1f]/.test(name) ||
      typeof email !== 'string' || email.length > 254 || !EMAIL.test(email.trim()) || /[\r\n]/.test(email) ||
      typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
    return res.status(400).json({ error: 'Please enter a name (2–100 characters), valid email, and message (10–5000 characters).' });
  }
  const now = Date.now();
  for (const [key, value] of limits) if (value.until <= now) limits.delete(key);
  const ip = req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const entry = limits.get(ip) || { count: 0, until: now + 10 * 60 * 1000 };
  if (entry.count >= 3) {
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil((entry.until - now) / 1000))));
    return res.status(429).json({ error: 'You have sent several messages. Please try again in 10 minutes, or email Dheeraj directly.' });
  }
  entry.count++;
  limits.set(ip, entry);
  const recipient = process.env.CONTACT_EMAIL?.trim() || 'dheerajsoni.dev@gmail.com';
  if (!EMAIL.test(recipient)) return res.status(503).json({ error: 'The contact service is not configured. Please email Dheeraj directly.' });
  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}` },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL?.trim() || 'Portfolio <onboarding@resend.dev>',
          to: [recipient], reply_to: email.trim(), subject: `Portfolio inquiry: ${name.trim()}`,
          text: `New portfolio inquiry\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.id !== 'string' || !data.id) {
        console.warn('Contact email provider rejected submission:', response.status);
        return res.status(502).json({ error: 'Your message could not be submitted. Please email dheerajsoni.dev@gmail.com or try again later.' });
      }
      return res.status(200).json({ message: 'Thank you. Your message has been submitted. Dheeraj can reply to the email address you provided.' });
    }
    // Let the browser POST directly to FormSubmit. Its server-side AJAX route
    // hangs on this network even when the submission triggers an activation email.
    const formId = process.env.FORMSUBMIT_FORM_ID?.trim();
    const target = formId && /^[a-f0-9]{32}$/i.test(formId) ? formId : recipient;
    return res.status(200).json({ delivery: 'browser', action: 'https://formsubmit.co/' + encodeURIComponent(target) });

  } catch (error) {
    console.warn('Contact relay unavailable:', error?.name || 'Error');
    return res.status(503).json({ error: 'The contact service is unavailable. Please try again or email dheerajsoni.dev@gmail.com.' });
  }
};
