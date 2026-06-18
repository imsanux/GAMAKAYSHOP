'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { searchProducts } from '@/lib/products';

export default function Header() {
    const { items } = useCart();
    const { toggleTheme } = useTheme(); // kept to avoid unused-import lint error — noop
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartBounce, setCartBounce] = useState(false);

    // Live search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle live search
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const results = searchProducts(searchQuery);
            setSearchResults(results.slice(0, 6));
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const clickOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node);
            const clickOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);
            
            if (clickOutsideDesktop && clickOutsideMobile) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (itemCount > 0) {
            setCartBounce(true);
            const timer = setTimeout(() => setCartBounce(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/category/gaming',        label: 'Gaming' },
        { href: '/category/streaming',     label: 'Streaming' },
        { href: '/category/software',      label: 'Software' },
        { href: '/category/subscriptions', label: 'Subscriptions' },
    ];

    return (
        <>
            {/* ── HEADER ─────────────────────────────────────── */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: '#111111',
                borderBottom: isScrolled
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid transparent',
                boxShadow: isScrolled ? '0 2px 16px rgba(0,0,0,0.45)' : 'none',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}>
                <div className="container nav-top-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    position: 'relative',
                }}>
                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}>
                        <img
                            src="/gamakay-logo.png"
                            alt="Gamakay"
                            style={{
                                height: '96px',
                                maxHeight: '96px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: 'brightness(0) invert(1)',
                                transition: 'opacity 0.2s ease',
                            }}
                        />
                    </Link>

                    {/* Search Bar — Centered on Desktop */}
                    <div ref={desktopSearchRef} className="hide-mobile" style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '560px',
                        zIndex: 10,
                    }}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    setShowDropdown(false);
                                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                }
                            }}
                            style={{ position: 'relative', width: '100%' }}
                        >
                            <input
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search gift cards, games..."
                                style={{
                                    width: '100%',
                                    padding: '12px 48px 12px 18px',
                                    fontSize: '0.98rem',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#FFFFFF',
                                    borderRadius: showDropdown && searchResults.length > 0 ? '6px 6px 0 0' : '6px',
                                    background: 'rgba(255,255,255,0.06)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                                    fontWeight: 500,
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    if (searchQuery.trim().length > 0) setShowDropdown(true);
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    position: 'absolute',
                                    right: '4px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '30px',
                                    height: '28px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'color 0.15s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            </button>
                        </form>

                        {/* Live Search Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: '#18181B',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderTop: 'none',
                                borderRadius: '0 0 6px 6px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                zIndex: 100,
                                maxHeight: '320px',
                                overflowY: 'auto'
                            }}>
                                {searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/search?q=${encodeURIComponent(product.name)}`}
                                        onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '8px 12px',
                                            textDecoration: 'none',
                                            color: '#FFFFFF',
                                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                                            transition: 'background 0.12s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '4px', overflow: 'hidden',
                                            flexShrink: 0, background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}>
                                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {product.name}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>
                                                {product.brand} · {product.category}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFCC00', whiteSpace: 'nowrap' }}>
                                            Rs. {product.denominations[0]?.price.toLocaleString()}
                                        </div>
                                    </Link>
                                ))}

                                {/* View All Results */}
                                <Link
                                    href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                                    onClick={() => setShowDropdown(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '6px',
                                        padding: '10px 12px',
                                        textDecoration: 'none',
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: '0 0 5px 5px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                >
                                    View all results
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>


                        {/* Track Order */}
                        <Link
                            href="/track"
                            className="hide-mobile"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                                padding: '10px 16px',
                                borderRadius: '4px',
                                transition: 'color 0.15s ease, background 0.15s ease',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Track Order
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '44px',
                            height: '40px',
                            background: 'transparent',
                            color: itemCount > 0 ? '#FFCC00' : 'rgba(255,255,255,0.85)',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
                            border: 'none',
                            transform: cartBounce ? 'scale(1.12)' : 'scale(1)',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    minWidth: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#D93025',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    borderRadius: '3px',
                                    padding: '0 4px',
                                    border: '1.5px solid #111111',
                                }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            className="hide-desktop"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '34px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                            aria-label="Toggle menu"
                        >
                            <div style={{ width: '16px', height: '12px', position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: 0, width: '100%', height: '1.5px',
                                    background: 'white', borderRadius: '1px',
                                    transition: 'all 0.25s ease',
                                    top: isMenuOpen ? '5px' : 0,
                                    transform: isMenuOpen ? 'rotate(45deg)' : 'none',
                                }} />
                                <span style={{
                                    position: 'absolute', left: 0, top: '5px', width: '100%', height: '1.5px',
                                    background: 'white', borderRadius: '1px',
                                    transition: 'all 0.25s ease',
                                    opacity: isMenuOpen ? 0 : 1,
                                }} />
                                <span style={{
                                    position: 'absolute', left: 0, width: '100%', height: '1.5px',
                                    background: 'white', borderRadius: '1px',
                                    transition: 'all 0.25s ease',
                                    top: isMenuOpen ? '5px' : '10px',
                                    transform: isMenuOpen ? 'rotate(-45deg)' : 'none',
                                }} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar Row — only visible on mobile */}
                <div ref={mobileSearchRef} className="hide-desktop" style={{
                    padding: '0 16px 12px 16px',
                    background: '#111111',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchQuery.trim()) {
                                setShowDropdown(false);
                                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                            }
                        }}
                        style={{ position: 'relative', width: '100%' }}
                    >
                        <input
                            type="text"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search gift cards, games..."
                            style={{
                                width: '100%',
                                padding: '8px 40px 8px 14px',
                                fontSize: '0.88rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#FFFFFF',
                                borderRadius: showDropdown && searchResults.length > 0 ? '6px 6px 0 0' : '6px',
                                background: 'rgba(255,255,255,0.06)',
                                outline: 'none',
                                transition: 'border-color 0.2s ease, background-color 0.2s ease',
                                fontWeight: 500,
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                if (searchQuery.trim().length > 0) setShowDropdown(true);
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                position: 'absolute',
                                right: '4px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '30px',
                                height: '28px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                    </form>

                    {/* Live Search Dropdown */}
                    {showDropdown && searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '16px',
                            right: '16px',
                            background: '#18181B',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderTop: 'none',
                            borderRadius: '0 0 6px 6px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                            zIndex: 100,
                            maxHeight: '280px',
                            overflowY: 'auto'
                        }}>
                            {searchResults.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/search?q=${encodeURIComponent(product.name)}`}
                                    onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 12px',
                                        textDecoration: 'none',
                                        color: '#FFFFFF',
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '4px', overflow: 'hidden',
                                        flexShrink: 0, background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}>
                                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>
                                            {product.brand} · {product.category}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFCC00', whiteSpace: 'nowrap' }}>
                                        Rs. {product.denominations[0]?.price.toLocaleString()}
                                    </div>
                                </Link>
                            ))}

                            {/* View All Results */}
                            <Link
                                href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                                onClick={() => setShowDropdown(false)}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '6px',
                                    padding: '10px 12px',
                                    textDecoration: 'none',
                                    color: '#FFFFFF',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    background: 'rgba(255,255,255,0.04)',
                                    borderRadius: '0 0 5px 5px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            >
                                View all results
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className="hide-desktop"
                onClick={() => setIsMenuOpen(false)}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: 98,
                }}
            />

            {/* Mobile Menu Drawer */}
            <nav
                className="hide-desktop"
                style={{
                    position: 'fixed',
                    top: 0, right: 0,
                    width: '280px',
                    height: '100%',
                    background: '#0A0A0A',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                    zIndex: 99,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '72px',
                    boxShadow: isMenuOpen ? '-8px 0 32px rgba(0,0,0,0.3)' : 'none',
                }}
            >
                <div style={{ padding: '0 24px', flex: 1 }}>
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '16px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.85)',
                                textDecoration: 'none',
                                borderBottom: index < navLinks.length - 1
                                    ? '1px solid rgba(255,255,255,0.06)'
                                    : 'none',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase',
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#FFCC00'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <Link
                            href="/track"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block', padding: '12px 0',
                                fontSize: '0.88rem', fontWeight: 600,
                                color: 'rgba(255,255,255,0.5)',
                                textDecoration: 'none',
                                letterSpacing: '0.02em', textTransform: 'uppercase',
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        >
                            Track Order
                        </Link>


                    </div>
                </div>

                {/* Cart CTA */}
                <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <Link
                        href="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px',
                            width: '100%', padding: '13px',
                            background: '#FFCC00',
                            color: '#111111',
                            borderRadius: '6px',
                            fontWeight: 800, textDecoration: 'none',
                            fontSize: '0.88rem',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                        }}
                    >
                        View Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                </div>
            </nav>
        </>
    );
}
