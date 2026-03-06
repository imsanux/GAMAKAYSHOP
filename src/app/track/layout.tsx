import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Track Your Order | Gamakay Giftcards Nepal',
    description: 'Track your Gamakay gift card order status. Enter your phone number and get instant updates via WhatsApp.',
    openGraph: {
        title: 'Track Your Order | Gamakay Giftcards Nepal',
        description: 'Track your gift card order and get instant status updates via WhatsApp.',
    },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
    return children;
}
