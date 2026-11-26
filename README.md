# Portfolio 98

Interactive Windows 98 style (pixel art) portfolio built with Astro 7, React 19 islands, TypeScript and Tailwind CSS v4.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Make it yours
- Content: `src/data/portfolio.ts` (name, experience, projects, contact, Clippy tips…)
- Programs/icons/window sizes: `src/data/apps.ts`
- Resume: replace `public/resume.pdf`
- Domain: set `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`
- Icons are generated from ASCII art: edit `scripts/gen-assets.mjs`, then `node scripts/gen-assets.mjs`
