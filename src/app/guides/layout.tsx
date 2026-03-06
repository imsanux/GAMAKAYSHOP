import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gift Card Redemption Guides | Gamakay Nepal',
    description: 'Step-by-step guides on how to redeem PlayStation, Xbox, Apple, Netflix, Spotify, NordVPN, and more gift cards in Nepal. Easy instructions for all platforms.',
    openGraph: {
        title: 'Gift Card Redemption Guides | Gamakay Nepal',
        description: 'Learn how to redeem your gift cards with our easy step-by-step guides. PlayStation, Xbox, Apple, Netflix & more.',
    },
    keywords: 'how to redeem gift card nepal, playstation gift card redeem, xbox gift card redeem nepal, apple gift card redeem, netflix activation nepal',
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
