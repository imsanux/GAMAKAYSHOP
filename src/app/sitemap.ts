import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gamakay.com'
    const currentDate = new Date()

    const mainPages = [
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
        { url: `${baseUrl}/search`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    ]

    const categories = ['all', 'gaming', 'streaming', 'software', 'subscriptions', 'ai-tools', 'social-media']
    const categoryPages = categories.map(category => ({
        url: `${baseUrl}/category/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: category === 'all' ? 0.9 : 0.85,
    }))

    const contentPages = [
        { url: `${baseUrl}/guides`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/student`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/support`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/cart`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    ]

    return [...mainPages, ...categoryPages, ...contentPages]
}
