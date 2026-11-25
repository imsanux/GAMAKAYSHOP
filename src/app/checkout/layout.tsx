import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your Gamakay gift card order and receive your digital code on WhatsApp or Viber.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
