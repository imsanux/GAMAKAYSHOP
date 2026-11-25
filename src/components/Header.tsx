'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { searchProducts, getFeaturedProducts } from '@/lib/products';

const NAV_LINKS = [
    { href: '/category/gaming',        label: 'Gaming' },
    { href: '/category/streaming',     label: 'Streaming' },
    { href: '/category/software',      label: 'Software & AI' },
    { href: '/category/dating-social', label: 'Dating & Social' },
    { href: '/category/subscriptions', label: 'Subscriptions' },
    { href: '/track',                  label: 'Track Order' },
];

const QUICK_SEARCH_TERMS = ['Steam', 'PlayStation', 'Apple', 'Netflix', 'ChatGPT', 'Spotify'];
const ROTATING_SEARCH_BRANDS = ['Apple', 'PlayStation', 'Steam', 'Netflix', 'Spotify', 'Claude AI', 'Xbox'];

const RotatingBrandSlot = React.memo(function RotatingBrandSlot({
    paused,
    textColor,
}: {
    paused: boolean;
    textColor: string;
}) {
    const [brandIndex, setBrandIndex] = useState(0);

    useEffect(() => {
        if (paused) return;
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const timer = setInterval(() => {
            if (!document.hidden) {
                setBrandIndex((prev) => (prev + 1) % ROTATING_SEARCH_BRANDS.length);
            }
        }, 2500);
        return () => clearInterval(timer);
    }, [paused]);

    return (
        <span className="header-search-brand-slot">
            <span
                key={ROTATING_SEARCH_BRANDS[brandIndex]}
                className="header-search-brand-text"
                style={{ color: textColor }}
            >
                {ROTATING_SEARCH_BRANDS[brandIndex]}
            </span>
        </span>
    );
});

export default function Header() {
    const { items, openDrawer } = useCart();
    const router = useRouter();
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartPulse, setCartPulse] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);
    const prevCountRef = useRef(0);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const isDarkHeader = isMenuOpen;
    const hideSearch = ['/cart', '/checkout'].some(p => pathname === p || pathname?.startsWith(p));

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return searchProducts(searchQuery.trim()).slice(0, 6);
    }, [searchQuery]);

    const popularPicks = useMemo(() => getFeaturedProducts(4), []);

    // Track scroll position for adaptive header tone
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 32);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Subtle scale feedback when cart count increases
    useEffect(() => {
        if (itemCount > prevCountRef.current) {
            setCartPulse(true);
            const timer = setTimeout(() => setCartPulse(false), 260);
            prevCountRef.current = itemCount;
            return () => clearTimeout(timer);
        }
        prevCountRef.current = itemCount;
    }, [itemCount]);

    // Global keyboard shortcuts: Escape closes modals, Cmd/Ctrl+K opens search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !hideSearch) {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hideSearch]);

    // Focus search input when overlay opens
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 40);
        } else {
            setSearchQuery('');
        }
    }, [isSearchOpen]);

    // Lock body scroll when drawer/search modal is open
    useEffect(() => {
        const locked = isMenuOpen || isSearchOpen;
        document.body.style.overflow = locked ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen, isSearchOpen]);

    // Close overlays on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        setIsSearchOpen(false);
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const handleCartClick = (e: React.MouseEvent) => {
        if (pathname === '/cart' || pathname === '/checkout') return;
        e.preventDefault();
        openDrawer();
    };

    const textColor = isDarkHeader ? '#F8F7F2' : '#181818';
    const mutedColor = isDarkHeader ? 'rgba(248, 247, 242, 0.72)' : '#595751';
    const pillHoverBg = isDarkHeader ? 'rgba(248, 247, 242, 0.12)' : '#EFEDE6';
    const headerBg = isDarkHeader
        ? 'rgba(20, 20, 19, 0.96)'
        : isScrolled
            ? 'rgba(248, 247, 242, 0.96)'
            : 'rgba(248, 247, 242, 0.9)';
    const headerBorder = isDarkHeader
        ? 'rgba(248, 247, 242, 0.08)'
        : isScrolled
            ? '#E8E5DC'
            : 'rgba(232, 229, 220, 0.65)';

    return (
        <>
            <header
                className={isDarkHeader ? 'tone-dark' : ''}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 'var(--header-height)',
                    zIndex: 100,
                    backgroundColor: headerBg,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${headerBorder}`,
                    transition: 'background-color 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div
                    className="container"
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}
                >
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        aria-label="Gamakay Home"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            flexShrink: 0,
                            minHeight: '44px',
                        }}
                    >
                        <img
                            src="/gamakay-logo.webp"
                            alt="Gamakay"
                            width={220}
                            height={74}
                            decoding="async"
                            style={{
                                height: '74px',
                                width: 'auto',
                                objectFit: 'contain',
                                margin: '-8px -4px',
                                filter: isDarkHeader ? 'brightness(0) invert(1)' : 'none',
                                transition: 'filter 0.25s ease, opacity 0.2s ease',
                                display: 'block',
                            }}
                        />
                    </Link>

                    {/* Centered Desktop Navigation */}
                    <nav
                        aria-label="Primary navigation"
                        className="hide-mobile"
                        style={{
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        padding: '8px 11px',
                                        borderRadius: '9999px',
                                        fontSize: '0.855rem',
                                        fontWeight: isActive ? 600 : 500,
                                        letterSpacing: '-0.02em',
                                        color: isActive ? textColor : mutedColor,
                                        background: isActive ? pillHoverBg : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'background-color 0.16s ease, color 0.16s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = pillHoverBg;
                                        e.currentTarget.style.color = textColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isActive ? pillHoverBg : 'transparent';
                                        e.currentTarget.style.color = isActive ? textColor : mutedColor;
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Utility Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {/* Desktop Search Trigger Pill */}
                        {!hideSearch && (
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Search gift cards"
                                className="hide-mobile"
                                style={{
                                    alignItems: 'center',
                                    gap: '10px',
                                    height: '40px',
                                    padding: '0 14px',
                                    borderRadius: '9999px',
                                    border: `1px solid ${isDarkHeader ? 'rgba(248,247,242,0.16)' : '#E8E5DC'}`,
                                    background: isDarkHeader ? 'rgba(248,247,242,0.08)' : '#FFFFFF',
                                    color: mutedColor,
                                    fontFamily: 'inherit',
                                    fontSize: '0.84rem',
                                    fontWeight: 500,
                                    letterSpacing: '-0.015em',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = textColor;
                                    e.currentTarget.style.borderColor = isDarkHeader ? 'rgba(248,247,242,0.3)' : '#C9C4B6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = mutedColor;
                                    e.currentTarget.style.borderColor = isDarkHeader ? 'rgba(248,247,242,0.16)' : '#E8E5DC';
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                                <span
                                    aria-hidden="true"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <span>Search</span>
                                    <RotatingBrandSlot paused={isSearchOpen || hideSearch} textColor={textColor} />
                                </span>
                            </button>
                        )}

                        {/* Mobile Search Icon Button (44x44 tap target) */}
                        {!hideSearch && (
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Search gift cards"
                                className="hide-desktop"
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: textColor,
                                    cursor: 'pointer',
                                    transition: 'color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            </button>
                        )}

                        {/* Cart Pill Button */}
                        <Link
                            href="/cart"
                            onClick={handleCartClick}
                            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
                            style={{
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '7px',
                                minWidth: '44px',
                                height: '42px',
                                padding: itemCount > 0 ? '0 14px' : '0 12px',
                                borderRadius: '9999px',
                                background: itemCount > 0
                                    ? (isDarkHeader ? '#F8F7F2' : '#181818')
                                    : (isDarkHeader ? 'rgba(248,247,242,0.1)' : '#EFEDE6'),
                                color: itemCount > 0
                                    ? (isDarkHeader ? '#181818' : '#F8F7F2')
                                    : textColor,
                                textDecoration: 'none',
                                fontSize: '0.84rem',
                                fontWeight: 600,
                                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, color 0.2s ease',
                                transform: cartPulse ? 'scale(1.07)' : 'scale(1)',
                            }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            <span className="hide-mobile" style={{ display: 'inline' }}>
                                Cart
                            </span>
                            {itemCount > 0 && (
                                <span
                                    key={itemCount}
                                    className="tabular-nums badge-pop"
                                    style={{
                                        minWidth: '20px',
                                        height: '20px',
                                        padding: '0 6px',
                                        borderRadius: '9999px',
                                        background: '#F4CE16',
                                        color: '#181818',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button (clearly labeled & 44px height) */}
                        <button
                            type="button"
                            className="hide-desktop"
                            onClick={() => setIsMenuOpen(prev => !prev)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                minHeight: '44px',
                                padding: '0 12px',
                                borderRadius: '9999px',
                                border: `1px solid ${isDarkHeader ? 'rgba(248,247,242,0.16)' : '#E8E5DC'}`,
                                background: isDarkHeader ? 'rgba(248,247,242,0.08)' : '#FFFFFF',
                                color: textColor,
                                fontFamily: 'inherit',
                                fontSize: '0.82rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background-color 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                {isMenuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="4" y1="8" x2="20" y2="8" />
                                        <line x1="4" y1="16" x2="20" y2="16" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Instant Search Command Modal (Desktop & Mobile) ── */}
            {isSearchOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search gift cards"
                    className="modal-backdrop-enter"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 200,
                        background: 'rgba(20, 20, 19, 0.54)',
                        backdropFilter: 'blur(3px)',
                        WebkitBackdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        padding: 'clamp(16px, 8vh, 84px) 16px 24px',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsSearchOpen(false);
                    }}
                >
                    <div
                        className="modal-panel-enter"
                        style={{
                            width: '100%',
                            maxWidth: '620px',
                            background: '#F8F7F2',
                            borderRadius: '20px',
                            border: '1px solid rgba(24, 24, 24, 0.12)',
                            boxShadow: '0 24px 64px rgba(20, 20, 19, 0.24)',
                            overflow: 'hidden',
                        }}
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 18px',
                                borderBottom: '1px solid rgba(24, 22, 21, 0.08)',
                            }}
                        >
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#635D57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                inputMode="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        setIsSearchOpen(false);
                                    }
                                }}
                                placeholder="Search Steam, PlayStation, Netflix..."
                                aria-label="Search gift cards"
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontSize: '0.98rem',
                                    color: '#181818',
                                    fontFamily: 'inherit',
                                    minHeight: '36px',
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                    style={{
                                        border: 'none',
                                        background: '#EFEDE6',
                                        color: '#57524E',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                style={{
                                    border: '1px solid rgba(24,22,21,0.12)',
                                    background: '#FFFFFF',
                                    color: '#57524E',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Esc
                            </button>
                        </form>

                        <div style={{ maxHeight: '62vh', overflowY: 'auto', overflowX: 'hidden', padding: '16px 18px 18px' }}>
                            {!searchQuery.trim() ? (
                                <>
                                    <div style={{ marginBottom: '18px' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#635D57', marginBottom: '10px' }}>
                                            Popular searches
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {QUICK_SEARCH_TERMS.map((term) => (
                                                <button
                                                    key={term}
                                                    type="button"
                                                    onClick={() => setSearchQuery(term)}
                                                    className="filter-pill"
                                                    style={{ minHeight: '36px', padding: '6px 14px', fontSize: '0.82rem' }}
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#635D57', marginBottom: '10px' }}>
                                            Popular right now
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {popularPicks.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.slug}`}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '8px 10px',
                                                        borderRadius: '12px',
                                                        textDecoration: 'none',
                                                        color: '#181818',
                                                        minWidth: 0,
                                                        transition: 'background-color 0.14s ease',
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#EFEDE6'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#EFEDE6', flexShrink: 0, border: '1px solid rgba(24,22,21,0.08)' }}>
                                                        <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {product.name}
                                                        </div>
                                                        <div style={{ fontSize: '0.76rem', color: '#635D57', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {product.brand} · {product.region || 'Global'}
                                                        </div>
                                                    </div>
                                                    <div className="tabular-nums" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                        Rs. {product.denominations[0]?.price.toLocaleString()}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : searchResults.length === 0 ? (
                                <div style={{ padding: '28px 12px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#181818', marginBottom: '6px' }}>
                                        No cards matched &ldquo;{searchQuery}&rdquo;
                                    </p>
                                    <p style={{ fontSize: '0.84rem', color: '#635D57', marginBottom: '16px' }}>
                                        Try searching by brand name such as Steam, Apple, Netflix, or ChatGPT.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.slug}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '9px 10px',
                                                borderRadius: '12px',
                                                textDecoration: 'none',
                                                color: '#181818',
                                                minWidth: 0,
                                                transition: 'background-color 0.14s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#EFEDE6'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', background: '#EFEDE6', flexShrink: 0, border: '1px solid rgba(24,22,21,0.08)' }}>
                                                <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {product.name}
                                                </div>
                                                <div style={{ fontSize: '0.76rem', color: '#635D57', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {product.brand} · {product.region || 'Global'} · {product.denominations.length} option{product.denominations.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <div className="tabular-nums" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                Rs. {product.denominations[0]?.price.toLocaleString()}
                                            </div>
                                        </Link>
                                    ))}

                                    <Link
                                        href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                                        onClick={() => setIsSearchOpen(false)}
                                        style={{
                                            marginTop: '8px',
                                            padding: '11px',
                                            borderRadius: '12px',
                                            background: '#EFEDE6',
                                            color: '#181818',
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        See all results for &ldquo;{searchQuery.trim()}&rdquo;
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mobile Full-Height Menu Sheet (Plasma dark editorial sheet) ── */}
            {isMenuOpen && (
                <div
                    className="hide-desktop tone-dark mobile-menu-enter"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        top: 'var(--header-height)',
                        zIndex: 99,
                        background: '#141413',
                        color: '#F8F7F2',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '28px 20px 28px',
                        overflowY: 'auto',
                    }}
                >
                    <nav className="mobile-menu-stagger" style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9D9A93', marginBottom: '12px' }}>
                            Shop
                        </p>
                        {[
                            { href: '/category/all',           label: 'All Gift Cards' },
                            { href: '/category/gaming',        label: 'Gaming' },
                            { href: '/category/streaming',     label: 'Streaming' },
                            { href: '/category/software',      label: 'Software & AI' },
                            { href: '/category/dating-social', label: 'Dating & Social' },
                            { href: '/category/subscriptions', label: 'Subscriptions' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="font-display"
                                style={{
                                    padding: '14px 0',
                                    fontSize: '1.65rem',
                                    color: '#FAF6F0',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid rgba(250, 246, 240, 0.1)',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', marginTop: '24px' }}>
                            {[
                                { href: '/track',   label: 'Track Order' },
                                { href: '/guides',  label: 'Redemption Guides' },
                                { href: '/support', label: 'Policies' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#B8B5AE',
                                        textDecoration: 'none',
                                        padding: '6px 0',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="safe-bottom" style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link
                            href={itemCount > 0 ? '/checkout' : '/cart'}
                            onClick={() => setIsMenuOpen(false)}
                            className="btn btn-accent btn-lg"
                            style={{ width: '100%' }}
                        >
                            {itemCount > 0 ? `Proceed to Checkout (${itemCount})` : 'View Cart'}
                        </Link>
                        <a
                            href="https://wa.me/9779862157864"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-glass btn-lg"
                            style={{ width: '100%' }}
                        >
                            Message on WhatsApp
                        </a>
                    </div>
                </div>
            )}

            <style>{`
                .header-search-brand-slot {
                    display: inline-flex;
                    align-items: center;
                    min-width: 82px;
                    height: 1.35em;
                    line-height: 1.35em;
                    overflow: hidden;
                    text-align: left;
                }
                @keyframes headerSearchBrandIn {
                    from {
                        opacity: 0;
                        transform: translateY(65%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .header-search-brand-text {
                    display: inline-block;
                    animation: headerSearchBrandIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    will-change: transform, opacity;
                }
                @media (prefers-reduced-motion: reduce) {
                    .header-search-brand-text {
                        animation: none !important;
                    }
                }
            `}</style>
        </>
    );
}
