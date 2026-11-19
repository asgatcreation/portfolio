// Vercel Function: POST /api/contact
//
// Vercel deploys every file in this folder as a function, with no adapter and no vercel.json.
// All the thinking lives in lib/contact.mjs; this file only unwraps the request and wraps the answer.
//
// Settings go in the Vercel dashboard under Settings → Environment Variables. They are listed in
// lib/contact.mjs and in docs/DEPLOY.md. Nothing secret belongs in this repository.

import { handleContact, jsonResponse } from '../lib/contact.mjs';

/** Best-effort visitor address. Only used for the spam check; nothing breaks when it is empty. */
function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Send a JSON object.' }, 400);
  }
  const { status, data } = await handleContact({
    body,
    env: process.env,
    ip: clientIp(request),
  });
  return jsonResponse(data, status);
}

/** Anything that is not a POST. */
export function GET() {
  return jsonResponse({ error: 'Use POST.' }, 405);
}
