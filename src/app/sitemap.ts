import { MetadataRoute } from 'next'
import { artworks, members, mediaArticles } from '@/components/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://4zigen.vercel.app'

  // ベースページ
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // 作品ページを追加
  const artworkRoutes = artworks.map((artwork) => ({
    url: artwork.link,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // メンバーページを追加
  const memberRoutes = members.map((member) => ({
    url: member.link,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // メディア記事を追加
  const mediaRoutes = mediaArticles.map((article) => ({
    url: article.link,
    lastModified: new Date(article.date || new Date()),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...routes, ...artworkRoutes, ...memberRoutes, ...mediaRoutes]
}