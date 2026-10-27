import { MetadataRoute } from 'next';
import {client} from '../sanity/lib/client';
import {groq} from 'next-sanity';
import { categories, tools } from './ia-ecommerce/data';
import { guides } from './ia-ecommerce/guias/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.eyagencia.com.br';
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const articles = await client.fetch(groq`*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)]{
      "slug":slug.current,"modified":coalesce(_updatedAt,publishedAt)
    }`);
    blogUrls = (articles || []).filter((item:{slug?:string}) => /^[a-z0-9][a-z0-9-]*$/.test(item.slug || '')).map((item:{slug:string,modified?:string}) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(item.slug)}`,
      lastModified: item.modified ? new Date(item.modified) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));
  } catch(error) {
    console.error('[sitemap] Falha ao carregar URLs do blog',error);
  }

  const iaCategoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/ia-ecommerce/${category.slug}`,
    lastModified: new Date('2026-09-29'),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const iaToolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/ia-ecommerce/ferramentas/${tool.slug}`,
    lastModified: new Date('2026-09-29'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const iaGuideUrls: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/ia-ecommerce/guias/${guide.slug}`,
    lastModified: new Date('2026-09-29'),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/clientes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ia-ecommerce`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'weekly',
      priority: 0.95,
      images: [`${baseUrl}/ia-ecommerce/hero-ia-ecommerce.svg`],
    },
    {
      url: `${baseUrl}/ia-ecommerce/ferramentas`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ia-ecommerce/guias`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ia-ecommerce/metodologia`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    ...iaCategoryUrls,
    ...iaToolUrls,
    ...iaGuideUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogUrls,
    {
      url: `${baseUrl}/clientes/sidao-hub`,
      images: [
        `${baseUrl}/cases/sidao-hub/retrato.png`,
        `${baseUrl}/cases/sidao-hub/poker.jpeg`,
        `${baseUrl}/cases/sidao-hub/sao-paulo.webp`,
        `${baseUrl}/cases/sidao-hub/vasco.webp`,
      ],
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/parceiros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
