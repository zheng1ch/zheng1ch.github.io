import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://zheng1ch.github.io',
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: 'https://zheng1ch.github.io/publications',
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: 'https://zheng1ch.github.io/cv',
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: 'https://zheng1ch.github.io/posters',
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: 'https://zheng1ch.github.io/flights',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://zheng1ch.github.io/mood_tracking_2025',
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}