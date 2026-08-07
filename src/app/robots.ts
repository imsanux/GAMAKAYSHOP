import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/cart', '/checkout', '/confirmation', '/api/'],
            },
        ],
        sitemap: 'https://gamakay.com/sitemap.xml',
        host: 'https://gamakay.com',
    }
}
