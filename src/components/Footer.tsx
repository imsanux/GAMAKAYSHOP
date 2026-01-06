'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
            color: '#0f172a',
            paddingTop: '64px'
        }}>
            <div className="container">
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '40px',
                    paddingBottom: '48px'
                }}>
                    {/* Brand Column */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <img
                            src="/logo.png"
                            alt="Gamakay"
                            style={{
                                height: '80px',
                                width: 'auto',
                                filter: 'brightness(0)', // Make logo black
                                marginBottom: '16px'
                            }}
                        />
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'rgba(15, 23, 42, 0.8)',
                            lineHeight: 1.6,
                            maxWidth: '240px'
                        }}>
                            Digital gift cards and subscriptions delivered instantly via WhatsApp.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '20px',
                            color: '#0f172a'
                        }}>
                            Categories
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { href: '/category/gaming', label: 'Gaming' },
                                { href: '/category/streaming', label: 'Streaming' },
                                { href: '/category/software', label: 'Software' },
                                { href: '/category/subscriptions', label: 'Subscriptions' }
                            ].map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        fontSize: '0.9rem',
                                        color: 'rgba(15, 23, 42, 0.7)',
                                        textDecoration: 'none',
                                        transition: 'color 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(15, 23, 42, 0.7)'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '20px',
                            color: '#0f172a'
                        }}>
                            Support
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link
                                href="/track"
                                style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(15, 23, 42, 0.7)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(15, 23, 42, 0.7)'}
                            >
                                Track Order
                            </Link>
                            <a
                                href="https://wa.me/9779862157864"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(15, 23, 42, 0.7)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(15, 23, 42, 0.7)'}
                            >
                                WhatsApp Support
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '20px',
                            color: '#0f172a'
                        }}>
                            Contact
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <a
                                href="https://wa.me/9779862157864"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(15, 23, 42, 0.7)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#25D366'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(15, 23, 42, 0.7)'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a
                                href="viber://chat?number=9779862157864"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(15, 23, 42, 0.7)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#7360f2'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(15, 23, 42, 0.7)'}
                            >
                                <img
                                    src="/viber-logo.png"
                                    alt="Viber"
                                    width={18}
                                    height={18}
                                    style={{
                                        filter: 'brightness(0)',
                                        opacity: 0.8
                                    }}
                                />
                                Viber
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    padding: '24px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <p style={{
                        fontSize: '0.8rem',
                        color: 'rgba(15, 23, 42, 0.6)'
                    }}>
                        © {currentYear} Gamakay Giftcards. All rights reserved.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '24px',
                        fontSize: '0.8rem'
                    }}>
                        Here to Help!
                    </div>
                </div>
            </div>
        </footer>
    );
}
