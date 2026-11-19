// Cloudflare Pages Function: POST /api/contact
//
// Kept so the site can move back to Cloudflare Pages without rewriting anything. It is only read by
// Cloudflare Pages — Vercel ignores this folder, and a Cloudflare *Worker* ignores it too, which is
// why the first deploy had no working form (ADR 0008).
//
// All the thinking lives in lib/contact.mjs; this file only unwraps the request and wraps the answer.

import { handleContact, jsonResponse } from '../../lib/contact.mjs';

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Send a JSON object.' }, 400);
  }
  const { status, data } = await handleContact({
    body,
    env,
    ip: request.headers.get('CF-Connecting-IP') || '',
  });
  return jsonResponse(data, status);
}

/** Anything that is not a POST. */
export function onRequest() {
  return jsonResponse({ error: 'Use POST.' }, 405);
}
