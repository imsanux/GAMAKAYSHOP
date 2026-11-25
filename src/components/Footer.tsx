'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="tone-dark"
            style={{
                background: '#141413',
                color: '#F8F7F2',
                borderTop: '1px solid rgba(248, 247, 242, 0.08)',
            }}
        >
            <div className="container" style={{ paddingTop: '64px', paddingBottom: '36px' }}>
                <div className="footer-grid">
                    {/* Brand & Direct Summary */}
                    <div style={{ maxWidth: '320px' }}>
                        <Link href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
                            <img
                                src="/gamakay-logo.webp"
                                alt="Gamakay"
                                width={226}
                                height={76}
                                style={{
                                    height: '76px',
                                    width: 'auto',
                                    margin: '-8px 0 -6px -4px',
                                    filter: 'brightness(0) invert(1)',
                                    display: 'block',
                                }}
                                loading="lazy"
                                decoding="async"
                            />
                        </Link>
                        <p style={{ fontSize: '0.9rem', color: '#B6B3AB', lineHeight: 1.65 }}>
                            Digital gift cards and subscriptions, sent straight to your WhatsApp or Viber in minutes.
                        </p>
                    </div>

                    {/* Link Columns (real destinations only) */}
                    <div className="footer-links-grid">
                        <div>
                            <h3 style={{ fontSize: '0.78rem', fontWeight: 500, color: '#9D9A93', marginBottom: '16px', letterSpacing: '0' }}>
                                Catalog
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                {[
                                    { href: '/category/all',           label: 'All Products' },
                                    { href: '/category/gaming',        label: 'Gaming Cards' },
                                    { href: '/category/streaming',     label: 'Streaming' },
                                    { href: '/category/software',      label: 'Software & AI' },
                                    { href: '/category/dating-social', label: 'Dating & Social' },
                                    { href: '/category/subscriptions', label: 'Subscriptions' },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="footer-link"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.78rem', fontWeight: 500, color: '#9D9A93', marginBottom: '16px', letterSpacing: '0' }}>
                                Help & Orders
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                {[
                                    { href: '/track',   label: 'Track Order' },
                                    { href: '/guides',  label: 'Redemption Guides' },
                                    { href: '/support', label: 'Policies & Refunds' },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="footer-link"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.78rem', fontWeight: 500, color: '#9D9A93', marginBottom: '16px', letterSpacing: '0' }}>
                                Connect
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                <a
                                    href="https://wa.me/9779862157864"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    WhatsApp (+977 9862157864)
                                </a>
                                <a
                                    href="viber://chat?number=9779862157864"
                                    className="footer-link"
                                >
                                    Viber Support
                                </a>
                                <a
                                    href="https://www.instagram.com/gamakaygiftcards/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Rule */}
                <div style={{
                    marginTop: '48px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(250, 246, 240, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.8rem',
                    color: '#9D9A93',
                }}>
                    <span>© {currentYear} Gamakay Giftcards.</span>
                    <a
                        href="https://selroti.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                        style={{ color: 'inherit', fontSize: 'inherit' }}
                    >
                        SelRotiDesigns
                    </a>
                </div>
            </div>

            <style>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 44px;
                }
                .footer-links-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 32px;
                }
                @media (min-width: 640px) {
                    .footer-links-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }
                @media (min-width: 960px) {
                    .footer-grid {
                        grid-template-columns: 360px 1fr;
                        gap: 80px;
                    }
                }
                .footer-link {
                    font-size: 0.88rem;
                    color: #B8B5AE;
                    text-decoration: none;
                    transition: color 0.16s ease;
                    line-height: 1.4;
                }
                .footer-link:hover {
                    color: #FAF6F0;
                }
            `}</style>
        </footer>
    );
}
