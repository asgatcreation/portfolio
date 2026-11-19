// Tests for the contact function. They run with `npm test` and in CI; nothing leaves the machine,
// because fetch is replaced with a stub that records what the function tried to send.
import assert from 'node:assert/strict';
import test, { afterEach, beforeEach } from 'node:test';
import { readForm } from '../lib/contact.mjs';
import { onRequest, onRequestPost } from '../functions/api/contact.js';
import { GET as vercelGet, POST as vercelPost } from '../api/contact.js';

const realFetch = globalThis.fetch;
let calls = [];

function stubFetch(handler) {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler ? handler(String(url), init) : new Response('{}', { status: 200 });
  };
}

beforeEach(() => {
  calls = [];
  stubFetch();
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

const ENV = { BREVO_API_KEY: 'key-for-tests', CONTACT_TO: 'owner@example.com', CONTACT_FROM: 'site@example.com' };

const post = (body, env = ENV, headers = {}) =>
  onRequestPost({
    env,
    request: new Request('https://example.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  });

const good = {
  name: 'Ada Obi',
  email: 'ada@example.com',
  message: 'I would like a quote for a small marketplace, please.',
  subject: 'A new project · from Ada Obi',
};

test('readForm accepts a complete message', () => {
  const { fields, error } = readForm(good);
  assert.equal(error, undefined);
  assert.equal(fields.name, 'Ada Obi');
  assert.equal(fields.kind, 'message');
});

test('readForm refuses a missing name, a bad address and a one-word message', () => {
  assert.match(readForm({ ...good, name: 'A' }).error, /name/i);
  assert.match(readForm({ ...good, email: 'not-an-address' }).error, /email/i);
  assert.match(readForm({ ...good, message: 'hi' }).error, /words/i);
  assert.match(readForm('a string').error, /JSON/i);
});

test('readForm trims control characters and cuts long values', () => {
  const { fields } = readForm({ ...good, name: '  Ada\u0000 Obi  ', message: 'x'.repeat(9000) });
  assert.equal(fields.name, 'Ada Obi');
  assert.equal(fields.message.length, 4000);
});

test('readForm makes a subject when none is given', () => {
  const { fields } = readForm({ ...good, subject: '', kind: 'booking' });
  assert.equal(fields.subject, 'Call request from Ada Obi');
});

test('a filled honeypot is answered politely and sends nothing', async () => {
  const res = await post({ ...good, company: 'spam ltd' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 0);
});

test('bad JSON gets 400 and sends nothing', async () => {
  const res = await post('{not json');
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test('a good message is sent to the owner, with the visitor as reply-to', async () => {
  const res = await post(good);
  assert.equal(res.status, 200);
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/smtp/email');
  assert.equal(calls[0].init.headers['api-key'], 'key-for-tests');
  assert.equal(sent.to[0].email, 'owner@example.com');
  assert.equal(sent.sender.email, 'site@example.com');
  assert.equal(sent.replyTo.email, 'ada@example.com');
  assert.match(sent.subject, /New message/);
  assert.match(sent.htmlContent, /small marketplace/);
  assert.equal(sent.textContent, undefined); // Brevo takes one body type per request
});

test('an acknowledgement goes to the visitor, and CONTACT_AUTOREPLY=off stops it', async () => {
  await post(good);
  assert.equal(calls.length, 2);
  const reply = JSON.parse(calls[1].init.body);
  assert.equal(reply.to[0].email, 'ada@example.com');
  assert.match(reply.textContent, /small marketplace/); // the visitor gets their own words back
  assert.equal(reply.htmlContent, undefined);

  calls = [];
  await post(good, { ...ENV, CONTACT_AUTOREPLY: 'off' });
  assert.equal(calls.length, 1);
});

test('HTML in a message cannot reach the e-mail as markup', async () => {
  await post({ ...good, message: 'Hello <script>alert(1)</script> & goodbye' });
  const sent = JSON.parse(calls[0].init.body);
  assert.ok(!sent.htmlContent.includes('<script>'));
  assert.ok(sent.htmlContent.includes('&lt;script&gt;'));
});

test('without the Brevo settings it answers 503, so the page can fall back to mail', async () => {
  const res = await post(good, { CONTACT_TO: 'owner@example.com' });
  assert.equal(res.status, 503);
  assert.equal(calls.length, 0);
});

test('a failed Turnstile check stops the message', async () => {
  stubFetch((url) =>
    url.includes('siteverify')
      ? new Response(JSON.stringify({ success: false }), { status: 200 })
      : new Response('{}', { status: 200 }),
  );
  const res = await post({ ...good, token: 'wrong' }, { ...ENV, TURNSTILE_SECRET_KEY: 'secret' });
  assert.equal(res.status, 400);
  assert.equal(calls.length, 1); // only the check itself
});

test('a passed Turnstile check lets the message through', async () => {
  stubFetch((url) =>
    url.includes('siteverify')
      ? new Response(JSON.stringify({ success: true }), { status: 200 })
      : new Response('{}', { status: 200 }),
  );
  const res = await post({ ...good, token: 'right' }, { ...ENV, TURNSTILE_SECRET_KEY: 'secret' });
  assert.equal(res.status, 200);
  assert.equal(calls[1].url, 'https://api.brevo.com/v3/smtp/email');
});

test('the rate limit replies 429 after five messages from one address', async () => {
  const store = new Map();
  const kv = {
    get: async (k) => store.get(k) ?? null,
    put: async (k, v) => void store.set(k, v),
  };
  const env = { ...ENV, CONTACT_RATE: kv, CONTACT_AUTOREPLY: 'off' };
  const headers = { 'CF-Connecting-IP': '203.0.113.9' };
  for (let i = 0; i < 5; i++) assert.equal((await post(good, env, headers)).status, 200);
  const blocked = await post(good, env, headers);
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error, /WhatsApp/);
});

test('a failure at Brevo is reported, not swallowed', async () => {
  stubFetch(() => new Response('no', { status: 500 }));
  const res = await post(good);
  assert.equal(res.status, 502);
});

test('anything that is not a POST gets 405', async () => {
  const res = onRequest();
  assert.equal(res.status, 405);
});

// The Vercel handler is the same logic behind a different door, so it gets the same checks.

const vercelRequest = (body, headers = {}) =>
  new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

test('the Vercel handler sends a good message and reads its settings from process.env', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, ENV, { CONTACT_AUTOREPLY: 'off' });
  try {
    const res = await vercelPost(vercelRequest(good, { 'x-forwarded-for': '203.0.113.9, 70.41.3.18' }));
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    const sent = JSON.parse(calls[0].init.body);
    assert.equal(sent.to[0].email, 'owner@example.com');
    assert.equal(sent.replyTo.email, 'ada@example.com');
  } finally {
    process.env = saved;
  }
});

test('the Vercel handler refuses bad input and answers 405 to a GET', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, ENV);
  try {
    assert.equal((await vercelPost(vercelRequest('{not json'))).status, 400);
    assert.equal((await vercelPost(vercelRequest({ ...good, email: 'nope' }))).status, 400);
    assert.equal(calls.length, 0);
    assert.equal(vercelGet().status, 405);
  } finally {
    process.env = saved;
  }
});
