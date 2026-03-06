import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shopping Cart | Gamakay Giftcards Nepal',
    description: 'Review your selected gift cards and proceed to checkout. Digital delivery via WhatsApp.',
    robots: 'noindex, nofollow',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return children;
}
