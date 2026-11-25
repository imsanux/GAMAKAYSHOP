import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const URL = `${SITE_URL}/support`;

export const metadata: Metadata = {
    title: 'Support, Delivery & Refund Policy in Nepal',
    description:
        'Read Gamakay delivery times, account region compatibility rules, refund policy, and customer support terms for digital gift cards and subscriptions in Nepal.',
    keywords: [
        'Gamakay support Nepal',
        'gift card refund policy Nepal',
        'gift card region compatibility Nepal',
        'digital gift card delivery time Nepal',
        'Gamakay policies',
    ],
    alternates: {
        canonical: URL,
        languages: {
            'en-NP': URL,
            'x-default': URL,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_NP',
        url: URL,
        siteName: 'Gamakay',
        title: 'Support & Policies | Gamakay Nepal',
        description:
            'Delivery times, account region compatibility, refund policy, and customer support terms for Gamakay digital gift cards in Nepal.',
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Gamakay Support and Policies Nepal' }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@gamakaynepal',
        title: 'Support & Policies | Gamakay Nepal',
        description:
            'Delivery times, account region compatibility, refund policy, and customer support terms for Gamakay digital gift cards in Nepal.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Support & Policies', item: URL },
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
