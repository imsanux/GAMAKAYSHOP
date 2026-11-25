import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Confirmation',
    description: 'Your Gamakay digital gift card order reference and WhatsApp confirmation link.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
    return children;
}
