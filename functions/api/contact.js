// Cloudflare Pages Function: receives the contact and booking forms and sends them on by e-mail.
//
// It needs these environment variables (set in the Cloudflare dashboard, never in the repository):
//   BREVO_API_KEY        Brevo (Sendinblue) HTTP API key          — required to send
//   CONTACT_TO           where messages are delivered             — required to send
//   CONTACT_FROM         a sender address verified in Brevo       — required to send
//   TURNSTILE_SECRET_KEY Cloudflare Turnstile secret              — optional; when set, a token is required
//   CONTACT_AUTOREPLY    "off" to stop the acknowledgement        — optional
//   CONTACT_RATE         a KV namespace binding                   — optional; when bound, limits each IP
//
// With no BREVO_API_KEY it answers 503 and the page falls back to the visitor's own mail app,
// so the form still works on a host without this function.

const LIMITS = { name: 120, email: 160, phone: 40, org: 120, subject: 160, message: 4000 };
const RATE_MAX = 5; // messages per IP
const RATE_WINDOW = 3600; // seconds

const json = (data, status) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Trim, drop control characters, and cut to length. Anything not a string becomes ''. */
function clean(value, max) {
  if (typeof value !== 'string') return '';
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0);
    // keep tab and newline, drop the other control characters
    if (code > 31 || ch === '\t' || ch === '\n') if (code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

function looksLikeEmail(value) {
  return /^[^\s@,;:<>()[\]\\]+@[^\s@,;:<>()[\]\\]+\.[a-z]{2,}$/i.test(value);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Returns { fields } or { error } — never throws on bad input. */
export function readForm(body) {
  if (!body || typeof body !== 'object') return { error: 'Send a JSON object.' };
  const fields = {
    kind: clean(body.kind, 20) === 'booking' ? 'booking' : 'message',
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    phone: clean(body.phone, LIMITS.phone),
    org: clean(body.org, LIMITS.org),
    subject: clean(body.subject, LIMITS.subject),
    message: clean(body.message, LIMITS.message),
  };
  if (fields.name.length < 2) return { error: 'Please give your name.' };
  if (!looksLikeEmail(fields.email)) return { error: 'That email address does not look right.' };
  if (fields.message.length < 10) return { error: 'Please write a few more words.' };
  if (!fields.subject)
    fields.subject = (fields.kind === 'booking' ? 'Call request' : 'Message') + ' from ' + fields.name;
  return { fields };
}

async function checkTurnstile(secret, token, ip) {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token || '');
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    return data && data.success === true;
  } catch {
    return false; // the check could not run, so treat it as failed
  }
}

/** Counts requests per IP in a KV namespace. Returns true when the caller is over the limit. */
async function overRateLimit(kv, ip) {
  if (!kv || !ip) return false;
  const key = 'contact:' + ip;
  try {
    const seen = Number((await kv.get(key)) || 0);
    if (seen >= RATE_MAX) return true;
    await kv.put(key, String(seen + 1), { expirationTtl: RATE_WINDOW });
    return false;
  } catch {
    return false; // storage trouble must not block a real message
  }
}

function buildEmail(fields, env) {
  const title = (fields.kind === 'booking' ? 'Call request' : 'New message') + ' · ' + fields.subject;
  const rows = [
    ['Name', fields.name],
    ['Email', fields.email],
    ['Phone', fields.phone],
    ['Organisation', fields.org],
  ].filter(([, v]) => v);
  const text =
    rows.map(([k, v]) => k + ': ' + v).join('\n') + '\n\n' + fields.message + '\n\n— sent from the contact form';
  const html =
    '<h2>' +
    escapeHtml(title) +
    '</h2><ul>' +
    rows.map(([k, v]) => '<li><b>' + k + ':</b> ' + escapeHtml(v) + '</li>').join('') +
    '</ul><p style="white-space:pre-wrap">' +
    escapeHtml(fields.message) +
    '</p><p><small>Sent from the contact form on your site.</small></p>';
  return {
    sender: { email: env.CONTACT_FROM, name: 'asgatcreation site' },
    to: [{ email: env.CONTACT_TO }],
    replyTo: { email: fields.email, name: fields.name },
    subject: title,
    textContent: text,
    htmlContent: html,
  };
}

function buildAutoReply(fields, env) {
  const text =
    'Hello ' +
    fields.name.split(' ')[0] +
    ',\n\nThank you for your message. It has reached me and I reply to everything, usually within one working day.\n\nIf it is urgent, WhatsApp is faster: https://wa.me/2348160948723\n\nWhat you sent:\n\n' +
    fields.message +
    '\n\n— Akanji Oluwaseun Gabriel (asgatcreation)';
  return {
    sender: { email: env.CONTACT_FROM, name: 'Akanji Oluwaseun Gabriel' },
    to: [{ email: fields.email, name: fields.name }],
    subject: 'Thank you — I have your message',
    textContent: text,
  };
}

async function sendWithBrevo(apiKey, payload) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Send a JSON object.' }, 400);
  }

  // Honeypot: a real person never fills this in. Answer as if it worked, and send nothing.
  if (clean(body && body.company, 80)) return json({ ok: true }, 200);

  const read = readForm(body);
  if (read.error) return json({ error: read.error }, 400);
  const fields = read.fields;

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await checkTurnstile(env.TURNSTILE_SECRET_KEY, body && body.token, ip);
    if (!passed) return json({ error: 'The spam check did not pass. Please try again.' }, 400);
  }
  if (await overRateLimit(env.CONTACT_RATE, ip)) {
    return json({ error: 'That is several messages in a row. Please try again later, or use WhatsApp.' }, 429);
  }

  if (!env.BREVO_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: 'Sending is not set up on this site yet.' }, 503);
  }

  const sent = await sendWithBrevo(env.BREVO_API_KEY, buildEmail(fields, env));
  if (!sent) return json({ error: 'The message could not be sent. Please use email or WhatsApp.' }, 502);

  if (env.CONTACT_AUTOREPLY !== 'off') {
    try {
      await sendWithBrevo(env.BREVO_API_KEY, buildAutoReply(fields, env));
    } catch {
      // the message itself is already delivered; a failed acknowledgement is not the visitor's problem
    }
  }
  return json({ ok: true }, 200);
}

/** Anything that is not a POST. */
export function onRequest() {
  return json({ error: 'Use POST.' }, 405);
}
