'use client';

import Link from 'next/link';

export default function StudentPage() {
    return (
        <div className="container fade-in" style={{ padding: '32px 16px 64px', maxWidth: '900px' }}>
            <div style={{
                position: 'relative',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px'
            }}>
                <div style={{ position: 'absolute', left: 0 }}>
                    <Link href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        padding: '8px 12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50px',
                        transition: 'all 0.2s ease'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>
                <h1 style={{
                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0,
                    padding: '0 40px',
                    width: '100%',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em'
                }}>
                    Student Discounts
                </h1>
            </div>
            <p style={{
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginBottom: '40px',
                fontSize: '0.95rem'
            }}>
                Unlock exclusive savings for college and university students
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--theme-transition)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#3b82f615',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            flexShrink: 0
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '2px'
                            }}>
                                Discount Details
                            </h2>
                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-secondary)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                            }}>
                                Academic Perks
                            </span>
                        </div>
                    </div>

                    <ul style={{
                        margin: '16px 0 0 0',
                        paddingLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <strong>10% Off Academic Products:</strong> Get a 10% discount on all software, subscriptions, and tools categorized as academic products.
                        </li>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <strong>5% Off Everything Else:</strong> Enjoy a 5% discount across the entire site on all other products, including gaming and streaming gift cards.
                        </li>
                    </ul>
                </div>

                <div
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--theme-transition)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#10b98115',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                            flexShrink: 0
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <path d="M12 4v16" />
                                <path d="M8 10h.01" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '2px'
                            }}>
                                How to Apply
                            </h2>
                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-secondary)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                            }}>
                                Eligibility
                            </span>
                        </div>
                    </div>

                    <ol style={{
                        margin: '16px 0 0 0',
                        paddingLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Make sure you have a valid, unexpired College or University ID card.
                        </li>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Take a clear photo of your ID. <strong>For your privacy, we recommend covering any sensitive personal information (like your ID number or photo). We only need to see your Institution Name and the Validity/Expiry dates.</strong>
                        </li>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Contact our support team via WhatsApp using the button below and send the photo.
                        </li>
                        <li style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Once verified, we will immediately apply the discount to your account or provide you with a special promo code! <em>Note: Your ID photo is deleted immediately after verification and is never stored.</em>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Need Help */}
            <div style={{
                marginTop: '40px',
                padding: '24px',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                textAlign: 'center',
                transition: 'var(--theme-transition)'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Ready to verify?
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Send your College ID to our WhatsApp support
                </p>
                <a
                    href="https://wa.me/9779862157864"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#25D366',
                        color: 'white',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send ID on WhatsApp
                </a>
            </div>

            {/* Back Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/" style={{
                    color: 'var(--btn-primary-bg)',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                }}>
                    ← Back to Store
                </Link>
            </div>
        </div>
    );
}
