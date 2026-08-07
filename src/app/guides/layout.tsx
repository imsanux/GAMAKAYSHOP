import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Redemption Guides | How to Redeem Gift Cards in Nepal',
    description: 'Step-by-step guides to redeem your digital gift cards in Nepal. Learn how to activate PlayStation, Xbox, Steam, Apple, Netflix, Spotify cards and more.',
    keywords: ['how to redeem gift card Nepal', 'steam redeem Nepal', 'PlayStation gift card activate Nepal', 'Netflix activation Nepal', 'gift card guide Nepal', 'Xbox redeem Nepal', 'Apple gift card activate'],
    alternates: { canonical: 'https://gamakay.com/guides' },
    openGraph: {
        title: 'Redemption Guides | Gamakay Nepal',
        description: 'Step-by-step guides to redeem your digital gift cards. PlayStation, Xbox, Steam, Apple, Netflix & more.',
        url: 'https://gamakay.com/guides',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gamakay Gift Card Redemption Guides' }],
    },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
