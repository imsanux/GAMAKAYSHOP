import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Gift Cards | Gamakay Giftcards Nepal',
    description: 'Search for Steam, PlayStation, Xbox, Netflix, Spotify, and more gift cards available in Nepal. Instant digital delivery via WhatsApp.',
    openGraph: {
        title: 'Search Gift Cards | Gamakay Giftcards Nepal',
        description: 'Find your favorite gift cards — Gaming, Streaming, Software & more. Instant delivery in Nepal.',
    },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
