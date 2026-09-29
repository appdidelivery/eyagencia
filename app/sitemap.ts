import { MetadataRoute } from 'next';
import { categories, tools } from './ia-ecommerce/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eyagencia.com.br';

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

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servicos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
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
    ...iaCategoryUrls,
    ...iaToolUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
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
