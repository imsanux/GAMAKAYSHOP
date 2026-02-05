'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
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
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const navLinks = [
        {
            href: '/category/gaming', label: 'Gaming', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M6 12h4M8 10v4" />
                    <circle cx="17" cy="10" r="1" fill="#10b981" />
                    <circle cx="15" cy="12" r="1" fill="#10b981" />
                </svg>
            )
        },
        {
            href: '/category/streaming', label: 'Streaming', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <polygon points="10,8 10,12 14,10" fill="#f43f5e" />
                </svg>
            )
        },
        {
            href: '/category/software', label: 'Software', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <path d="M7 8l3 3-3 3M12 14h5" />
                </svg>
            )
        },
        {
            href: '/category/subscriptions', label: 'Subscriptions', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
            )
        },
    ];

    return (
        <>
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: isScrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
                borderBottom: '1px solid var(--border-color)',
                transition: 'all 0.2s ease'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px',
                    gap: '24px'
                }}>
                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        flexShrink: 0
                    }}>
                        <img
                            src="/logo.png"
                            alt="Gamakay"
                            style={{
                                height: '100px',
                                maxHeight: '100px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: isDark ? 'brightness(0) invert(1)' : 'none'
                            }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hide-mobile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease'
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
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {link.icon}
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {/* Theme Toggle Switch - Hidden on mobile, shown in mobile menu */}
                        <button
                            className="hide-mobile"
                            onClick={toggleTheme}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                width: '56px',
                                height: '28px',
                                borderRadius: '50px',
                                background: isDark ? '#333' : '#e2e8f0',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                                padding: '3px'
                            }}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {/* Sliding circle */}
                            <span style={{
                                position: 'absolute',
                                left: isDark ? '30px' : '3px',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#fff',
                                transition: 'left 0.3s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                            {/* Sun icon (left side) */}
                            <span style={{
                                position: 'absolute',
                                left: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isDark ? 0.5 : 0,
                                transition: 'opacity 0.3s ease'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            </span>
                            {/* Moon icon (right side) */}
                            <span style={{
                                position: 'absolute',
                                right: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isDark ? 0 : 0.5,
                                transition: 'opacity 0.3s ease'
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748b" stroke="none">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </span>
                        </button>

                        {/* Track Order */}
                        <Link
                            href="/track"
                            className="hide-mobile"
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--btn-secondary-bg)';
                            }}
                            onMouseLeave={(e) => {
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
                            height: '44px',
                            borderRadius: '10px',
                            background: 'transparent',
                            color: itemCount > 0 ? 'var(--btn-primary-bg)' : 'var(--text-secondary)',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            transform: cartBounce ? 'scale(1.1)' : 'scale(1)'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    minWidth: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    borderRadius: '50px',
                                    padding: '0 6px'
                                }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="hide-desktop"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '44px',
                                height: '44px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer'
                            }}
                            aria-label="Toggle menu"
                        >
                            <div style={{
                                width: '20px',
                                height: '14px',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.25s ease',
                                    top: isMenuOpen ? '6px' : 0,
                                    transform: isMenuOpen ? 'rotate(45deg)' : 'none'
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '6px',
                                    width: '100%',
                                    height: '2px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.25s ease',
                                    opacity: isMenuOpen ? 0 : 1
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    background: 'var(--text-primary)',
                                    borderRadius: '1px',
                                    transition: 'all 0.25s ease',
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
                    background: 'var(--menu-overlay)',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: 98
                }}
            />

            {/* Mobile Menu */}
            <nav
                className="hide-desktop"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    height: '100%',
                    background: 'var(--mobile-menu-bg)',
                    zIndex: 99,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '80px'
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
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                borderBottom: index < navLinks.length - 1 ? '1px solid var(--border-color)' : 'none'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                        <Link
                            href="/track"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '16px 0',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'var(--text-muted)',
                                textDecoration: 'none'
                            }}
                        >
                            Track Order
                        </Link>

                        {/* Theme toggle in mobile menu */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 0'
                            }}
                        >
                            <span style={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'var(--text-muted)'
                            }}>
                                {isDark ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '56px',
                                    height: '28px',
                                    borderRadius: '50px',
                                    background: isDark ? '#333' : '#e2e8f0',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease',
                                    padding: '3px'
                                }}
                                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {/* Sliding circle */}
                                <span style={{
                                    position: 'absolute',
                                    left: isDark ? '30px' : '3px',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    transition: 'left 0.3s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }} />
                                {/* Sun icon (left side) */}
                                <span style={{
                                    position: 'absolute',
                                    left: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isDark ? 0.5 : 0,
                                    transition: 'opacity 0.3s ease'
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                </span>
                                {/* Moon icon (right side) */}
                                <span style={{
                                    position: 'absolute',
                                    right: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isDark ? 0 : 0.5,
                                    transition: 'opacity 0.3s ease'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748b" stroke="none">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--border-color)'
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
                            borderRadius: '10px',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        View Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                </div>
            </nav>
        </>
    );
}

