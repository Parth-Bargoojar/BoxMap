import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sign-in', '/sign-up'],
      disallow: ['/boxes', '/search', '/settings', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
