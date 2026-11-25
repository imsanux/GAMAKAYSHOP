import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Search Gift Cards & Subscriptions in Nepal',
    description:
        'Search 125+ digital gift cards and subscriptions in Nepal including Steam, PlayStation, Apple, Xbox, Netflix, Spotify, ChatGPT and Claude AI.',
    alternates: {
        canonical: `${SITE_URL}/search`,
    },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_NP',
        url: `${SITE_URL}/search`,
        siteName: 'Gamakay',
        title: 'Search Gift Cards & Subscriptions | Gamakay Nepal',
        description: 'Search Steam, PlayStation, Apple, Xbox, Netflix, Spotify and AI tools available in Nepal.',
    },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
