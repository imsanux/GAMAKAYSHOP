import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Offers',
    description: 'Browse digital gift cards and subscriptions in Nepal on Gamakay.',
    robots: {
        index: false,
        follow: true,
    },
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return children;
}
