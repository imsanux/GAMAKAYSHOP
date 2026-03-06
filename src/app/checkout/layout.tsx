import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout | Gamakay Giftcards Nepal',
    description: 'Complete your gift card purchase. Fast digital delivery via WhatsApp within minutes.',
    robots: 'noindex, nofollow',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
