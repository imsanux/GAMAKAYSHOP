'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Banner configuration with links to relevant categories
const banners = [
    {
        src: '/IMAGES/BANNERS/AI.png',
        alt: 'AI Tools',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/Apple_Creator_studio.png',
        alt: 'Apple Creator Studio',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
    {
        src: '/IMAGES/BANNERS/Apple_giftcards.png',
        alt: 'Apple Gift Cards',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Claude.png',
        alt: 'Claude AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/Crunchyroll.png',
        alt: 'Crunchyroll',
        link: '/category/streaming',
        category: 'streaming'
    },
    {
        src: '/IMAGES/BANNERS/Dating.png',
        alt: 'Dating Apps',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
    {
        src: '/IMAGES/BANNERS/Netflix.png',
        alt: 'Netflix',
        link: '/category/streaming',
        category: 'streaming'
    },
    {
        src: '/IMAGES/BANNERS/Playstation.png',
        alt: 'PlayStation',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Steam.png',
        alt: 'Steam',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Suno.png',
        alt: 'Suno AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/SuperGrok.png',
        alt: 'SuperGrok AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/TradingView.png',
        alt: 'TradingView',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
    {
        src: '/IMAGES/BANNERS/iCloud.png',
        alt: 'iCloud Storage',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
];

interface PromoBannerProps {
    variant?: 'single' | 'double' | 'carousel';
    category?: string; // Filter banners by category
    className?: string;
}

export default function PromoBanner({ variant = 'single', category, className }: PromoBannerProps) {
    const [selectedBanners, setSelectedBanners] = useState<typeof banners>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Filter by category if provided, otherwise use all
        let availableBanners = category
            ? banners.filter(b => b.category === category)
            : banners;

        // If no banners match category, use all
        if (availableBanners.length === 0) {
            availableBanners = banners;
        }

        // Shuffle and pick banners
        const shuffled = [...availableBanners].sort(() => Math.random() - 0.5);

        if (variant === 'double') {
            setSelectedBanners(shuffled.slice(0, 2));
        } else if (variant === 'carousel') {
            setSelectedBanners(shuffled.slice(0, 5));
        } else {
            setSelectedBanners(shuffled.slice(0, 1));
        }
    }, [variant, category]);

    // Auto-rotate carousel
    useEffect(() => {
        if (variant === 'carousel' && selectedBanners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % selectedBanners.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [variant, selectedBanners.length]);

    if (selectedBanners.length === 0) return null;

    // Single banner style
    if (variant === 'single') {
        const banner = selectedBanners[0];
        return (
            <Link
                href={banner.link}
                className={className}
                style={{
                    display: 'block',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                }}
            >
                <img
                    src={banner.src}
                    alt={banner.alt}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                    }}
                />
            </Link>
        );
    }

    // Double banner layout
    if (variant === 'double') {
        return (
            <div
                className={className}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                }}
            >
                {selectedBanners.map((banner, index) => (
                    <Link
                        key={index}
                        href={banner.link}
                        style={{
                            display: 'block',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                        }}
                    >
                        <img
                            src={banner.src}
                            alt={banner.alt}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                    </Link>
                ))}
            </div>
        );
    }

    // Carousel banner
    if (variant === 'carousel') {
        return (
            <div
                className={className}
                style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease-out',
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {selectedBanners.map((banner, index) => (
                        <Link
                            key={index}
                            href={banner.link}
                            style={{
                                minWidth: '100%',
                                display: 'block',
                            }}
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Dots indicator */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {selectedBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: currentIndex === index ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                border: 'none',
                                background: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return null;
}

// Export banner data for use elsewhere
export { banners };
