// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` drives canonical URLs and the sitemap. No trailing slashes, like the previous site.
export default defineConfig({
  site: 'https://aryanaufal.my.id',
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
