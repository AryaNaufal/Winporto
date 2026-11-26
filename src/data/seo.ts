/** SEO helpers: URLs, dates and structured data (JSON-LD). */
import type { ArticleMeta } from './articles';
import { contact, education, profile, site } from './portfolio';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** "05 Agu 2026" -> "2026-08-05". */
export function isoDate(date: string): string {
  const [d, m, y] = date.split(' ');
  return `${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export const articlePath = (slug: string) => `/article/${slug}`;

export function personSchema(base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: site.name,
    url: new URL('/', base).href,
    jobTitle: profile.role,
    email: `mailto:${contact.email}`,
    knowsAbout: profile.skills,
    alumniOf: education
      .filter((e) => e.degree !== 'Course')
      .map((e) => ({ '@type': 'EducationalOrganization', name: e.school })),
    sameAs: contact.links.map((l) => l.url),
  };
}

export function articleSchemas(article: ArticleMeta, base: URL) {
  const url = new URL(articlePath(article.slug), base).href;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      datePublished: isoDate(article.date),
      inLanguage: 'id',
      url,
      mainEntityOfPage: url,
      image: new URL('/og.png', base).href,
      author: { '@type': 'Person', name: profile.name, url: new URL('/', base).href },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: new URL('/', base).href },
        { '@type': 'ListItem', position: 2, name: 'Artikel', item: new URL('/article', base).href },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
  ];
}
