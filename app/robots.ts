import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/wp-content/',
        '/wp-admin/',
        '/wp-includes/',
        '/*?replytocom=',
        '/*?filter=',
        '/tag/',
        '/category/' // Desbloqueie se você for usar /category/ no seu novo blog
      ],
    },
    sitemap: 'https://eyagencia.com.br/sitemap.xml',
  };
}