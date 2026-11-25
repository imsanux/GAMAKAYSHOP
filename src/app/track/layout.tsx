import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const URL = `${SITE_URL}/track`;

export const metadata: Metadata = {
    title: 'Track Your Gift Card Order',
    description:
        'Check your Gamakay gift card order status in Nepal. Enter your phone number or order reference for quick WhatsApp support.',
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
        title: 'Track Your Gift Card Order | Gamakay Nepal',
        description: 'Check your Gamakay order status and get quick WhatsApp updates.',
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Track Order - Gamakay Nepal' }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@gamakaynepal',
        title: 'Track Your Gift Card Order | Gamakay Nepal',
        description: 'Check your Gamakay order status and get quick WhatsApp updates.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
    return children;
}
