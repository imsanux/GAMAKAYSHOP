import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gamakay.com'
    const currentDate = new Date()

    // Main pages
    const mainPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: currentDate,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
    ]

    // Category pages
    const categories = [
        'all',
        'gaming',
        'streaming',
        'software',
        'subscriptions',
        'ai-tools',
        'social-media',
    ]

    const categoryPages = categories.map(category => ({
        url: `${baseUrl}/category/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: category === 'all' ? 0.9 : 0.8,
    }))

    // Guide pages for SEO
    const guidePages = [
        {
            url: `${baseUrl}/guides`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
    ]

    // Utility pages
    const utilityPages = [
        {
            url: `${baseUrl}/cart`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/track`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ]

    return [...mainPages, ...categoryPages, ...guidePages, ...utilityPages]
}
