'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory, getAllProducts } from '@/lib/products';

const ALL_COUNT = getAllProducts().length;

// Exact 4309x1134 (3.80:1) desktop & 2646x1361 (1.94:1) mobile pairs — zero cropping!
const CATEGORY_BANNERS: Record<string, { desktop: string; mobile: string; alt: string }> = {
    gaming: {
        desktop: '/IMAGES/webpdesktop/Playstation_web.webp',
        mobile: '/IMAGES/webpmobile/Playstation_mobile.webp',
        alt: 'Gaming gift cards for PlayStation, Steam, Xbox and Nintendo',
    },
    streaming: {
        desktop: '/IMAGES/webpdesktop/NETFLIX_web.webp',
        mobile: '/IMAGES/webpmobile/Netflix_mobile_new.webp',
        alt: 'Streaming plans for Netflix, Spotify, YouTube Premium and Crunchyroll',
    },
    software: {
        desktop: '/IMAGES/webpdesktop/AI_web.webp',
        mobile: '/IMAGES/webpmobile/AI_mobile.webp',
        alt: 'AI tools and software subscriptions',
    },
    'dating-social': {
        desktop: '/IMAGES/BANNERS/Dating.webp',
        mobile: '/IMAGES/BANNERS/Dating.webp',
        alt: 'Dating and social media subscriptions for Tinder, Bumble, Telegram, Instagram and Snapchat+',
    },
    subscriptions: {
        desktop: '/IMAGES/webpdesktop/AppleGiftcard_web.webp',
        mobile: '/IMAGES/webpmobile/Applegiftcard_mobile.webp',
        alt: 'Apple gift cards and everyday app subscriptions',
    },
};

const CATEGORY_META: Record<string, { title: string; description: string }> = {
    all: {
        title: 'All Products',
        description: 'All gift cards and subscriptions currently available on Gamakay.',
    },
    gaming: {
        title: 'Gaming Gift Cards',
        description: 'PlayStation, Steam, Xbox Game Pass, Nintendo eShop, and top-ups for US, India, and Global accounts.',
    },
    streaming: {
        title: 'Streaming & Music',
        description: 'Netflix, Spotify Premium, YouTube Premium, Apple Music, Crunchyroll, and Discord Nitro.',
    },
    software: {
        title: 'Software & AI',
        description: 'Claude, ChatGPT Plus, Cursor, Gemini, NordVPN, Microsoft 365, and work tools.',
    },
    'dating-social': {
        title: 'Dating & Social',
        description: 'Tinder Gold & Platinum, Bumble Premium, Hinge, Telegram Premium, Instagram, Facebook, WhatsApp, Snapchat+, and Meta One.',
    },
    subscriptions: {
        title: 'Apps & Subscriptions',
        description: 'iCloud+, Canva Pro, Duolingo, Coursera Plus, travel eSIMs, VPNs, and everyday apps.',
    },
};

const CATEGORY_TABS = [
    { slug: 'all',           label: 'All',             count: ALL_COUNT },
    { slug: 'gaming',        label: 'Gaming',          count: getProductsByCategory('gaming').length },
    { slug: 'streaming',     label: 'Streaming',       count: getProductsByCategory('streaming').length },
    { slug: 'software',      label: 'Software & AI',   count: getProductsByCategory('software').length },
    { slug: 'dating-social', label: 'Dating & Social', count: getProductsByCategory('dating-social').length },
    { slug: 'subscriptions', label: 'Subscriptions',   count: getProductsByCategory('subscriptions').length },
];

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'default',    label: 'Sort: Default' },
    { value: 'price-asc',  label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc',   label: 'Name: A to Z' },
];

export default function CategoryPage() {
    const params = useParams();
    const slug = (params.slug as string) || 'all';
    const rawProducts = useMemo(() => getProductsByCategory(slug), [slug]);

    const [filterText, setFilterText] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sortOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSortOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        window.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            window.removeEventListener('keydown', onKey);
        };
    }, [sortOpen]);

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort: Default';

    const category = CATEGORY_META[slug] || {
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        description: 'Digital gift cards and subscriptions delivered via WhatsApp.',
    };

    const availableRegions = useMemo(() => {
        const set = new Set<string>();
        rawProducts.forEach(p => {
            if (p.region) set.add(p.region);
        });
        return ['All', ...Array.from(set)];
    }, [rawProducts]);

    const filteredProducts = useMemo(() => {
        let list = rawProducts;

        if (regionFilter !== 'All') {
            const rf = regionFilter.toLowerCase();
            list = list.filter(p =>
                p.region === regionFilter ||
                p.name.toLowerCase().includes(rf)
            );
        }

        if (filterText.trim()) {
            const q = filterText.trim().toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q)
            );
        }

        if (sortBy === 'price-asc') {
            list = [...list].sort((a, b) => (a.denominations[0]?.price ?? 0) - (b.denominations[0]?.price ?? 0));
        } else if (sortBy === 'price-desc') {
            list = [...list].sort((a, b) => (b.denominations[0]?.price ?? 0) - (a.denominations[0]?.price ?? 0));
        } else if (sortBy === 'name-asc') {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        }

        return list;
    }, [rawProducts, regionFilter, filterText, sortBy]);

    const hasActiveFilters = filterText.trim() !== '' || regionFilter !== 'All' || sortBy !== 'default';

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '80vh', paddingTop: 'var(--header-height)' }}>
            {/* Editorial Header Band */}
            <div style={{
                background: '#EFEDE6',
                borderBottom: '1px solid #E8E5DC',
                padding: '32px 0 28px',
            }}>
                <div className="container">
                    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#635D57', marginBottom: '18px' }}>
                        <Link href="/" style={{ color: '#635D57', textDecoration: 'none' }}>Home</Link>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: '#181818', fontWeight: 500 }}>{category.title}</span>
                    </nav>

                    <div style={{ maxWidth: '640px', marginBottom: '24px' }}>
                        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '10px' }}>
                            {category.title}
                        </h1>
                        <p style={{ fontSize: '0.96rem', color: '#57524E' }}>
                            {category.description}
                        </p>
                    </div>

                    {/* Seamless Department Tabs */}
                    <div className="filter-strip" aria-label="Departments">
                        {CATEGORY_TABS.map(tab => {
                            const active = tab.slug === slug;
                            return (
                                <Link
                                    key={tab.slug}
                                    href={`/category/${tab.slug}`}
                                    className="filter-pill"
                                    data-active={active}
                                >
                                    <span>{tab.label}</span>
                                    <span className="tabular-nums" style={{ fontSize: '0.74rem', opacity: 0.72 }}>
                                        {tab.count}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Filter Toolbar + Product Grid */}
            <div className="container" style={{ paddingTop: '28px', paddingBottom: '80px' }}>
                {/* Contextual Department Promo Banner */}
                {CATEGORY_BANNERS[slug] && (
                    <div className="cat-promo-banner">
                        <Image
                            src={CATEGORY_BANNERS[slug].desktop}
                            alt={CATEGORY_BANNERS[slug].alt}
                            fill
                            priority
                            sizes="(max-width: 1280px) 100vw, 1200px"
                            className="cat-banner-desktop"
                            style={{ objectFit: 'cover' }}
                        />
                        <Image
                            src={CATEGORY_BANNERS[slug].mobile}
                            alt={CATEGORY_BANNERS[slug].alt}
                            fill
                            priority
                            sizes="100vw"
                            className="cat-banner-mobile"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                )}

                <div className="catalog-toolbar">
                    {/* Inline Quick Filter */}
                    <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px' }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#635D57"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            inputMode="search"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder={`Filter ${category.title.toLowerCase()}...`}
                            aria-label={`Filter ${category.title}`}
                            className="input"
                            style={{ paddingLeft: '40px', paddingRight: filterText ? '38px' : '16px', minHeight: '42px', borderRadius: '9999px' }}
                        />
                        {filterText && (
                            <button
                                type="button"
                                onClick={() => setFilterText('')}
                                aria-label="Clear filter"
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: '#EFEDE6',
                                    color: '#57524E',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Region Pills (only shown when > 1 region exists) */}
                    {availableRegions.length > 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {availableRegions.map(reg => (
                                <button
                                    key={reg}
                                    type="button"
                                    onClick={() => setRegionFilter(reg)}
                                    className="filter-pill"
                                    data-active={regionFilter === reg}
                                    style={{ minHeight: '38px', padding: '6px 14px', fontSize: '0.82rem' }}
                                >
                                    {reg === 'All' ? 'All regions' : reg}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sort Select + Result Count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFilterText('');
                                    setRegionFilter('All');
                                    setSortBy('default');
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '6px 8px',
                                    fontSize: '0.82rem',
                                    fontWeight: 500,
                                    color: '#57524E',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Reset
                            </button>
                        )}
                        <span className="tabular-nums" style={{ fontSize: '0.84rem', color: '#635D57', whiteSpace: 'nowrap' }}>
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                        <div ref={sortRef} style={{ position: 'relative', flexShrink: 0 }}>
                            <button
                                type="button"
                                onClick={() => setSortOpen(o => !o)}
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                                aria-label="Sort products"
                                className="cat-sort-trigger"
                            >
                                <span>{activeSortLabel}</span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    style={{
                                        transition: 'transform 0.18s ease',
                                        transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {sortOpen && (
                                <div
                                    role="listbox"
                                    aria-label="Sort options"
                                    className="cat-sort-menu dropdown-enter"
                                >
                                    {SORT_OPTIONS.map(opt => {
                                        const selected = opt.value === sortBy;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                onClick={() => {
                                                    setSortBy(opt.value);
                                                    setSortOpen(false);
                                                }}
                                                className="cat-sort-option"
                                                data-selected={selected}
                                            >
                                                <span>{opt.label}</span>
                                                {selected && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="surface-card" style={{ textAlign: 'center', padding: '56px 24px', marginTop: '12px' }}>
                        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                            No matching products
                        </h2>
                        <p style={{ color: '#57524E', fontSize: '0.92rem', marginBottom: '22px' }}>
                            {hasActiveFilters
                                ? 'No items match your current filter selection. Reset filters to see everything in this department.'
                                : 'No products are currently listed in this category.'}
                        </p>
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setFilterText('');
                                    setRegionFilter('All');
                                    setSortBy('default');
                                }}
                                className="btn btn-primary"
                            >
                                Reset filters
                            </button>
                        ) : (
                            <Link href="/category/all" className="btn btn-primary">
                                Browse All Gift Cards
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="product-grid product-grid-animate" key={`${slug}-${regionFilter}-${sortBy}`}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .cat-promo-banner {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 2646 / 1361;
                    border-radius: 18px;
                    overflow: hidden;
                    margin-bottom: 24px;
                    border: 1px solid rgba(24, 22, 21, 0.1);
                    box-shadow: var(--shadow-sm);
                    background: #181818;
                }
                .cat-banner-desktop { display: none !important; }
                .cat-banner-mobile { display: block !important; }
                @media (min-width: 768px) {
                    .cat-promo-banner {
                        aspect-ratio: 4309 / 1134;
                    }
                    .cat-banner-desktop { display: block !important; }
                    .cat-banner-mobile { display: none !important; }
                }
                .catalog-toolbar {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .cat-sort-trigger {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 40px;
                    padding: 0 14px 0 15px;
                    border-radius: 9999px;
                    border: 1px solid rgba(24, 22, 21, 0.14);
                    background: #FFFFFF;
                    color: #181818;
                    font-family: inherit;
                    font-size: 0.84rem;
                    font-weight: 500;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: border-color 0.15s ease, background-color 0.15s ease;
                }
                .cat-sort-trigger:hover {
                    border-color: rgba(24, 22, 21, 0.28);
                    background: #F7F5F0;
                }
                .cat-sort-menu {
                    position: absolute;
                    top: calc(100% + 6px);
                    right: 0;
                    z-index: 40;
                    min-width: 196px;
                    padding: 6px;
                    border-radius: 16px;
                    background: #FFFFFF;
                    border: 1px solid rgba(24, 22, 21, 0.1);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .cat-sort-option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    width: 100%;
                    padding: 9px 12px;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    color: #57524E;
                    font-family: inherit;
                    font-size: 0.84rem;
                    font-weight: 500;
                    text-align: left;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: background-color 0.14s ease, color 0.14s ease;
                }
                .cat-sort-option:hover {
                    background: #EFEDE6;
                    color: #181818;
                }
                .cat-sort-option[data-selected="true"] {
                    background: #EFEDE6;
                    color: #181818;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
