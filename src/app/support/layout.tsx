import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support & Policies | Delivery, Refunds & Terms — Gamakay Nepal',
    description: 'Read Gamakay\'s support policies including refund policy, region compatibility, delivery times, account terms and service conditions for digital gift cards in Nepal.',
    keywords: ['Gamakay support Nepal', 'gift card refund policy Nepal', 'digital product terms Nepal', 'gift card delivery time Nepal', 'Gamakay terms and conditions'],
    alternates: { canonical: 'https://gamakay.com/support' },
    openGraph: {
        title: 'Support & Policies | Gamakay Nepal',
        description: 'Refund policy, delivery times, region compatibility, and terms of service for Gamakay digital gift cards.',
        url: 'https://gamakay.com/support',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gamakay Support & Policies' }],
    },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    return children;
}
