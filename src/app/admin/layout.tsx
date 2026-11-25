import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Local Catalog Manager',
    description: 'Local-only product catalog manager for Gamakay.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children;
}
