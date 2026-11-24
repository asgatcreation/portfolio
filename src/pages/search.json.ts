/**
 * The search index as a static file. It is fetched once, the first time someone opens the
 * search box, so nobody downloads it unless they actually search.
 */
import type { APIRoute } from 'astro';
import { searchIndex } from '../data/search';

export const GET: APIRoute = async () => {
  const body = JSON.stringify(await searchIndex());
  return new Response(body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
