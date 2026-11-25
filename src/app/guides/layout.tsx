import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const URL = `${SITE_URL}/guides`;

export const metadata: Metadata = {
    title: 'How to Redeem Gift Cards in Nepal | Guides',
    description:
        'Step-by-step guides to redeem PlayStation, Steam, Apple, Xbox, Netflix, Spotify, Claude AI & ChatGPT subscriptions in Nepal, including US and India region tips.',
    keywords: [
        'how to redeem gift card Nepal',
        'redeem Steam gift card Nepal',
        'activate PlayStation gift card Nepal',
        'redeem Apple gift card Nepal',
        'how to use Xbox Game Pass Nepal',
        'Netflix activation guide Nepal',
        'Spotify Premium redeem Nepal',
        'gift card region guide Nepal',
    ],
    alternates: {
        canonical: URL,
        languages: {
            'en-NP': URL,
            'x-default': URL,
        },
    },
    openGraph: {
        type: 'article',
        locale: 'en_NP',
        url: URL,
        siteName: 'Gamakay',
        title: 'How to Redeem Gift Cards in Nepal | Gamakay Guides',
        description:
            'Step-by-step redemption guides for PlayStation, Steam, Apple, Xbox, Netflix, Spotify, and AI subscriptions in Nepal.',
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Gamakay Gift Card Redemption Guides Nepal' }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@gamakaynepal',
        title: 'How to Redeem Gift Cards in Nepal | Gamakay',
        description: 'Step-by-step guides for PlayStation, Steam, Apple, Xbox, Netflix & AI subscriptions in Nepal.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Redemption Guides', item: URL },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
