import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gift Cards | Gamakay Giftcards Nepal',
    description: 'Browse gift cards by category. Gaming, Streaming, Software, Subscriptions and more. Buy digital gift cards in Nepal with instant WhatsApp delivery.',
    openGraph: {
        title: 'Gift Cards | Gamakay Giftcards Nepal',
        description: 'Browse our collection of digital gift cards by category. Instant delivery in Nepal.',
    },
};

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
