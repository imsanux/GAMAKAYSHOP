'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const { items } = useCart();
    const { theme, toggleTheme, isDark } = useTheme();
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
        { href: '/category/gaming', label: 'Gaming' },
        { href: '/category/streaming', label: 'Streaming' },
        { href: '/category/software', label: 'Software' },
        { href: '/category/subscriptions', label: 'Subscriptions' },
    ];

    return (
        <>
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: isScrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: `1px solid ${isScrolled ? 'var(--border-color)' : 'transparent'}`,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '52px',
                    gap: '20px'
                }}>
                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        flexShrink: 0
                    }}>
                        <img
                            src="/gamakay-logo.png"
                            alt="Gamakay"
                            style={{
                                height: '80px',
                                maxHeight: '80px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: isDark ? 'brightness(0) invert(1)' : 'none',
                                transition: 'filter 0.3s ease'
                            }}
                        />
                    </Link>

                    {/* Desktop Navigation — Apple-style minimal */}
                    <nav className="hide-mobile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 500,
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-full)',
                                    transition: 'all 0.2s ease',
                                    letterSpacing: '-0.01em'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--btn-secondary-bg)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {/* Theme Toggle — Segmented Controller */}
                        <button
                            className="hide-mobile"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--bg-secondary)',
                                padding: '3px',
                                borderRadius: '20px',
                                border: '1px solid var(--border-light)',
                                gap: '2px',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Sun Segment */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '24px',
                                    borderRadius: '14px',
                                    background: !isDark ? 'var(--card-bg)' : 'transparent',
                                    boxShadow: !isDark ? '0 2px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                                    color: !isDark ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4" />
                                    <line x1="12" y1="2" x2="12" y2="4" />
                                    <line x1="12" y1="20" x2="12" y2="22" />
                                    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                                    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                                    <line x1="2" y1="12" x2="4" y2="12" />
                                    <line x1="20" y1="12" x2="22" y2="12" />
                                    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                                    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                                </svg>
                            </div>
                            {/* Moon Segment */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '24px',
                                    borderRadius: '14px',
                                    background: isDark ? 'var(--card-bg)' : 'transparent',
                                    boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
                                    color: isDark ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </div>
                        </button>

                        {/* Track Order */}
                        <Link
                            href="/track"
                            className="hide-mobile"
                            style={{
                                fontSize: '0.82rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-full)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--btn-secondary-bg)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
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
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'transparent',
                            color: itemCount > 0 ? 'var(--btn-primary-bg)' : 'var(--text-secondary)',
                            textDecoration: 'none',
                            transition: 'all 0.25s ease',
                            transform: cartBounce ? 'scale(1.15)' : 'scale(1)'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0px',
                                    right: '-2px',
                                    minWidth: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#ff453a',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    borderRadius: '50px',
                                    padding: '0 5px',
                                    border: '2px solid var(--header-bg)',
                                }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button — Clean hamburger */}
                        <button
                            className="hide-desktop"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer'
                            }}
                            aria-label="Toggle menu"
                        >
                            <div style={{
                                width: '18px',
                                height: '14px',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    height: '1.5px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    top: isMenuOpen ? '6px' : 0,
                                    transform: isMenuOpen ? 'rotate(45deg)' : 'none'
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '6px',
                                    width: '100%',
                                    height: '1.5px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: isMenuOpen ? 0 : 1
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    height: '1.5px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    top: isMenuOpen ? '6px' : '12px',
                                    transform: isMenuOpen ? 'rotate(-45deg)' : 'none'
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
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    transition: 'all 0.35s ease',
                    zIndex: 98
                }}
            />

            {/* Mobile Menu — Full-width Apple style */}
            <nav
                className="hide-desktop"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '300px',
                    height: '100%',
                    background: 'var(--mobile-menu-bg)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    zIndex: 99,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '80px',
                    boxShadow: isMenuOpen ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                <div style={{ padding: '0 28px', flex: 1 }}>
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '18px 0',
                                fontSize: '1.15rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                borderBottom: index < navLinks.length - 1 ? '1px solid var(--border-light)' : 'none',
                                letterSpacing: '-0.02em',
                                transition: 'color 0.15s ease'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid var(--border-color)' }}>
                        <Link
                            href="/track"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '14px 0',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none'
                            }}
                        >
                            Track Order
                        </Link>

                        {/* Theme toggle in mobile menu */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 0'
                        }}>
                            <span style={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)'
                            }}>
                                {isDark ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--bg-secondary)',
                                    padding: '3px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--border-light)',
                                    gap: '2px',
                                    cursor: 'pointer',
                                }}
                            >
                                {/* Sun Segment */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '24px',
                                        borderRadius: '14px',
                                        background: !isDark ? 'var(--card-bg)' : 'transparent',
                                        boxShadow: !isDark ? '0 2px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                                        color: !isDark ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="4" />
                                        <line x1="12" y1="2" x2="12" y2="4" />
                                        <line x1="12" y1="20" x2="12" y2="22" />
                                        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                                        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                                        <line x1="2" y1="12" x2="4" y2="12" />
                                        <line x1="20" y1="12" x2="22" y2="12" />
                                        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                                        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                                    </svg>
                                </div>
                                {/* Moon Segment */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '24px',
                                        borderRadius: '14px',
                                        background: isDark ? 'var(--card-bg)' : 'transparent',
                                        boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
                                        color: isDark ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '24px 28px',
                    borderTop: '1px solid var(--border-light)'
                }}>
                    <Link
                        href="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '14px',
                            background: 'var(--btn-primary-bg)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)'
                        }}
                    >
                        View Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                </div>
            </nav>
        </>
    );
}
