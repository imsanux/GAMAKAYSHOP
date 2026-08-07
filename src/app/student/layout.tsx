import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Discount Nepal | 10% Off Academic Products — Gamakay',
    description: 'Students in Nepal get 10% off academic products and 5% off everything on Gamakay. Verify with your college or university ID to unlock exclusive discounts on digital gift cards.',
    keywords: ['student discount Nepal', 'student gift cards Nepal', 'college discount Nepal', 'university discount Nepal', 'cheap gift cards students Nepal', 'student offer Nepal'],
    alternates: { canonical: 'https://gamakay.com/student' },
    openGraph: {
        title: 'Student Discount | 10% Off Academic Products — Gamakay Nepal',
        description: 'Students get 10% off academic products and 5% off everything. Verify with your college ID.',
        url: 'https://gamakay.com/student',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gamakay Student Discount Nepal' }],
    },
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return children;
}
