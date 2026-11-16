// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The final domain isn't chosen yet. Set SITE_URL (for example in CI) to get canonical URLs and a sitemap.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  ...(site ? { site } : {}),
  trailingSlash: 'always',
  integrations: site ? [sitemap()] : [],
  build: { format: 'directory' },
});
