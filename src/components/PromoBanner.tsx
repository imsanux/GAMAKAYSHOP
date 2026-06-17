'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Banner configuration with links to relevant categories
const banners = [
    {
        src: '/IMAGES/BANNERS/AI.webp',
        alt: 'AI Tools',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/Apple_Creator_studio.webp',
        alt: 'Apple Creator Studio',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
    {
        src: '/IMAGES/BANNERS/Apple_giftcards.webp',
        alt: 'Apple Gift Cards',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Claude.webp',
        alt: 'Claude AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/Crunchyroll.webp',
        alt: 'Crunchyroll',
        link: '/category/streaming',
        category: 'streaming'
    },
    {
        src: '/IMAGES/BANNERS/Dating.webp',
        alt: 'Dating Apps',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
    {
        src: '/IMAGES/BANNERS/Netflix.webp',
        alt: 'Netflix',
        link: '/category/streaming',
        category: 'streaming'
    },
    {
        src: '/IMAGES/BANNERS/Playstation.webp',
        alt: 'PlayStation',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Steam.webp',
        alt: 'Steam',
        link: '/category/gaming',
        category: 'gaming'
    },
    {
        src: '/IMAGES/BANNERS/Suno.webp',
        alt: 'Suno AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/SuperGrok.webp',
        alt: 'SuperGrok AI',
        link: '/category/software',
        category: 'software'
    },
    {
        src: '/IMAGES/BANNERS/iCloud.webp',
        alt: 'iCloud Storage',
        link: '/category/subscriptions',
        category: 'subscriptions'
    },
];

interface PromoBannerProps {
    variant?: 'single' | 'double' | 'carousel' | 'grid' | 'grid2' | 'bento';
    category?: string;
    className?: string;
}

export default function PromoBanner({ variant = 'single', category, className }: PromoBannerProps) {
    const [selectedBanners, setSelectedBanners] = useState<typeof banners>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let availableBanners = category
            ? banners.filter(b => b.category === category)
            : banners;

        if (availableBanners.length === 0) {
            availableBanners = banners;
        }

        const shuffled = [...availableBanners].sort(() => Math.random() - 0.5);

        if (variant === 'double') {
            setSelectedBanners(shuffled.slice(0, 2));
        } else if (variant === 'carousel') {
            setSelectedBanners(shuffled.slice(0, 5));
        } else if (variant === 'grid') {
            setSelectedBanners(shuffled.slice(0, 6));
        } else if (variant === 'grid2') {
            setSelectedBanners(shuffled.slice(0, 6));
        } else if (variant === 'bento') {
            setSelectedBanners(shuffled.slice(0, 12));
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

    // Single banner — clean flat border, no floating/scale hover
    if (variant === 'single') {
        const banner = selectedBanners[0];
        return (
            <Link
                href={banner.link}
                className={className}
                style={{
                    display: 'block',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.015)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                }}
            >
                <img
                    src={banner.src}
                    alt={banner.alt}
                    loading="lazy"
                    decoding="async"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                    }}
                />
            </Link>
        );
    }

    // Double banner layout — flat, bordered, editorial
    if (variant === 'double') {
        return (
            <div
                className={className}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px',
                }}
            >
                {selectedBanners.map((banner, index) => (
                    <Link
                        key={index}
                        href={banner.link}
                        style={{
                            display: 'block',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-medium)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                            const img = e.currentTarget.querySelector('img');
                            if (img) img.style.transform = 'scale(1.015)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.boxShadow = 'none';
                            const img = e.currentTarget.querySelector('img');
                            if (img) img.style.transform = 'scale(1)';
                        }}
                    >
                        <img
                            src={banner.src}
                            alt={banner.alt}
                            loading="lazy"
                            decoding="async"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                transition: 'transform 0.5s ease',
                            }}
                        />
                    </Link>
                ))}
            </div>
        );
    }

    // Carousel banner — flat bordered, dot indicators
    if (variant === 'carousel') {
        return (
            <div
                className={className}
                style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
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
                            onMouseEnter={(e) => {
                                const img = e.currentTarget.querySelector('img');
                                if (img) img.style.transform = 'scale(1.015)';
                            }}
                            onMouseLeave={(e) => {
                                const img = e.currentTarget.querySelector('img');
                                if (img) img.style.transform = 'scale(1)';
                            }}
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                loading="lazy"
                                decoding="async"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    transition: 'transform 0.5s ease',
                                }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Dot indicators */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '5px 10px',
                        borderRadius: '4px',
                    }}
                >
                    {selectedBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: currentIndex === index ? '20px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                border: 'none',
                                background: currentIndex === index ? '#EAB308' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                padding: 0,
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Grid bento — 6 images, 4-col × 2-row, no cropping
    if (variant === 'grid') {
        const [a, b, c, d, e, f] = selectedBanners;

        const card = (col: string, row: string): React.CSSProperties => ({
            gridColumn: col,
            gridRow: row,
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        });

        const imgStyle: React.CSSProperties = {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.4s ease',
        };

        const hi = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = '#bbb';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.1)';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1.03)';
        };
        const ho = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1)';
        };

        /*
         * 4-col × 2-row layout (6 cells):
         * r1: [A] [B──wide──] [C]      ← B spans cols 2-3
         * r2: [D──wide──] [E] [F]      ← D spans cols 1-2
         */
        return (
            <div
                className={`promo-grid-1${className ? ` ${className}` : ''}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '10px',
                    height: 'clamp(240px, 32vw, 400px)',
                }}
            >
                {a && <Link href={a.link} style={card('1', '1')} onMouseEnter={hi} onMouseLeave={ho}><img src={a.src} alt={a.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
                {b && <Link href={b.link} style={card('2 / 4', '1')} onMouseEnter={hi} onMouseLeave={ho}><img src={b.src} alt={b.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
                {c && <Link href={c.link} style={card('4', '1')} onMouseEnter={hi} onMouseLeave={ho}><img src={c.src} alt={c.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
                {d && <Link href={d.link} style={card('1 / 3', '2')} onMouseEnter={hi} onMouseLeave={ho}><img src={d.src} alt={d.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
                {e && <Link href={e.link} style={card('3', '2')} onMouseEnter={hi} onMouseLeave={ho}><img src={e.src} alt={e.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
                {f && <Link href={f.link} style={card('4', '2')} onMouseEnter={hi} onMouseLeave={ho}><img src={f.src} alt={f.alt} loading="lazy" decoding="async" style={imgStyle}/></Link>}
            </div>
        );
    }

    // Bento — large 12-image combined layout (5 cols × 3 rows)
    if (variant === 'bento') {
        const [a,b,c,d,e,f,g,h,i,j,k,l] = selectedBanners;

        const cell = (gridColumn: string, gridRow: string): React.CSSProperties => ({
            gridColumn, gridRow,
            display: 'block',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            position: 'relative',
        });
        const imgFill: React.CSSProperties = {
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: 'block', transition: 'transform 0.4s ease',
        };
        const hi = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = '#aaa';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1.03)';
        };
        const ho = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1)';
        };

        /*
         * 5-col × 3-row bento (12 cells):
         *
         * col:   1      2      3      4      5
         * r1:  [ A  ]  [ B    wide  ]  [ C  ]  [ D  ]
         * r2:  [ E tall ] [ F ][ G  ] [ H    wide  ]
         * r3:  [ E..... ] [ I  wide ] [ J  ] [ K  ] [ L ]
         *
         * Simplified clean version:
         * r1:  [A] [B--B] [C] [D]          → cols 1, 2-3, 4, 5
         * r2:  [E(tall)] [F] [G] [H--H]    → cols 1(r2-r3), 2, 3, 4-5
         * r3:  [........] [I--I] [J] [K]   → col1 cont, 2-3, 4, 5
         */
        return (
            <div
                className={className}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: '8px',
                    height: 'clamp(340px, 46vw, 580px)',
                }}
            >
                {/* Row 1 */}
                {a && <Link href={a.link} style={cell('1','1')} onMouseEnter={hi} onMouseLeave={ho}><img src={a.src} alt={a.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {b && <Link href={b.link} style={cell('2 / 4','1')} onMouseEnter={hi} onMouseLeave={ho}><img src={b.src} alt={b.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {c && <Link href={c.link} style={cell('4','1')} onMouseEnter={hi} onMouseLeave={ho}><img src={c.src} alt={c.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {d && <Link href={d.link} style={cell('5','1')} onMouseEnter={hi} onMouseLeave={ho}><img src={d.src} alt={d.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}

                {/* Row 2–3 — E is tall */}
                {e && <Link href={e.link} style={cell('1','2 / 4')} onMouseEnter={hi} onMouseLeave={ho}><img src={e.src} alt={e.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {f && <Link href={f.link} style={cell('2','2')} onMouseEnter={hi} onMouseLeave={ho}><img src={f.src} alt={f.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {g && <Link href={g.link} style={cell('3','2')} onMouseEnter={hi} onMouseLeave={ho}><img src={g.src} alt={g.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {h && <Link href={h.link} style={cell('4 / 6','2')} onMouseEnter={hi} onMouseLeave={ho}><img src={h.src} alt={h.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}

                {/* Row 3 */}
                {i && <Link href={i.link} style={cell('2 / 4','3')} onMouseEnter={hi} onMouseLeave={ho}><img src={i.src} alt={i.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {j && <Link href={j.link} style={cell('4','3')} onMouseEnter={hi} onMouseLeave={ho}><img src={j.src} alt={j.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {k && <Link href={k.link} style={cell('5','3')} onMouseEnter={hi} onMouseLeave={ho}><img src={k.src} alt={k.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {l && <Link href={l.link} style={cell('5','2')} onMouseEnter={hi} onMouseLeave={ho}><img src={l.src} alt={l.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
            </div>
        );
    }

    // Grid2 — different layout: tall cards flanking a 2×2 center grid
    if (variant === 'grid2') {
        const [a, b, c, d, e, f] = selectedBanners;

        const card = (col: string, row: string): React.CSSProperties => ({
            gridColumn: col, gridRow: row,
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        });
        const imgFill: React.CSSProperties = {
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: 'block', transition: 'transform 0.4s ease',
        };
        const hi = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = '#bbb';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.1)';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1.03)';
        };
        const ho = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
            if (img) img.style.transform = 'scale(1)';
        };

        /*
         * 4-col × 2-row layout (6 cells):
         * col:  1        2     3       4
         * r1: [A tall] [B]   [C]  [F tall]
         * r2: [A....] [D]   [E]  [F....]
         *
         * A and F span both rows (tall), B/C/D/E are squares in the center
         */
        return (
            <div
                className={`promo-grid-2${className ? ` ${className}` : ''}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '10px',
                    height: 'clamp(240px, 32vw, 400px)',
                }}
            >
                {a && <Link href={a.link} style={card('1', '1 / 3')} onMouseEnter={hi} onMouseLeave={ho}><img src={a.src} alt={a.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {b && <Link href={b.link} style={card('2', '1')} onMouseEnter={hi} onMouseLeave={ho}><img src={b.src} alt={b.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {c && <Link href={c.link} style={card('3', '1')} onMouseEnter={hi} onMouseLeave={ho}><img src={c.src} alt={c.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {d && <Link href={d.link} style={card('2', '2')} onMouseEnter={hi} onMouseLeave={ho}><img src={d.src} alt={d.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {e && <Link href={e.link} style={card('3', '2')} onMouseEnter={hi} onMouseLeave={ho}><img src={e.src} alt={e.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
                {f && <Link href={f.link} style={card('4', '1 / 3')} onMouseEnter={hi} onMouseLeave={ho}><img src={f.src} alt={f.alt} loading="lazy" decoding="async" style={imgFill}/></Link>}
            </div>
        );
    }

    return null;
}

// Export banner data for use elsewhere
export { banners };
