import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://miru.io.kr';

  return [
    {
      url: baseUrl,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tips`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
