'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const { items } = useCart();
    const { toggleTheme } = useTheme(); // kept to avoid unused-import lint error — noop
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartBounce, setCartBounce] = useState(false);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
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
                position: 'sticky',
                top: 0,
                zIndex: 100,
            background: '#111111',
                borderBottom: isScrolled
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid transparent',
                transition: 'border-color 0.25s ease',
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '56px',
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
                                height: '72px',
                                maxHeight: '72px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: 'brightness(0) invert(1)',
                                transition: 'opacity 0.2s ease',
                            }}
                        />
                    </Link>

                    {/* Desktop Nav — centered */}
                    <nav className="hide-mobile" style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                    }}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'rgba(255,255,255,0.7)',
                                    textDecoration: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '4px',
                                    transition: 'color 0.15s ease, background 0.15s ease',
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase',
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
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>


                        {/* Track Order */}
                        <Link
                            href="/track"
                            className="hide-mobile"
                            style={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                                padding: '6px 12px',
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
                            width: '38px',
                            height: '34px',
                            borderRadius: '4px',
                            background: itemCount > 0 ? '#FFCC00' : 'rgba(255,255,255,0.08)',
                            color: itemCount > 0 ? '#111111' : 'rgba(255,255,255,0.85)',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
                            border: itemCount > 0 ? '1px solid transparent' : '1px solid rgba(255,255,255,0.12)',
                            transform: cartBounce ? 'scale(1.12)' : 'scale(1)',
                        }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '4px',
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
