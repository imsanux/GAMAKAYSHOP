'use client';

import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/lib/products';
import Link from 'next/link';

const categoryDetails: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
    all: {
        title: 'All Products',
        description: 'Browse our complete collection of gift cards and subscriptions',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    gaming: {
        title: 'Gift Cards',
        description: 'PlayStation, Xbox, Nintendo, Steam and more',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="17" cy="10" r="1" fill="#10b981" />
                <circle cx="15" cy="12" r="1" fill="#10b981" />
            </svg>
        )
    },
    streaming: {
        title: 'Streaming',
        description: 'Netflix, Spotify, YouTube Premium and more',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <polygon points="10,8 10,12 14,10" fill="#f43f5e" />
            </svg>
        )
    },
    software: {
        title: 'Software & VPNs',
        description: 'Microsoft Office, Adobe, NordVPN and more',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <path d="M7 8l3 3-3 3M12 14h5" />
            </svg>
        )
    },
    subscriptions: {
        title: 'Subscriptions',
        description: 'AI Tools, Dating Apps, Social Media and more',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
        )
    }
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const products = getProductsByCategory(slug);
    const category = categoryDetails[slug] || {
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        description: '',
        icon: '📦'
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '70vh', transition: 'var(--theme-transition)' }}>
            {/* Category Header */}
            <div style={{
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                padding: '32px 16px',
                transition: 'var(--theme-transition)'
            }}>
                <div className="container">
                    {/* Breadcrumb */}
                    <nav style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <button
                            onClick={() => window.history.back()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                background: 'var(--btn-secondary-bg)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--btn-secondary-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--btn-secondary-bg)'; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div>
                            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
                            <span style={{ color: 'var(--text-primary)' }}>{category.title}</span>
                        </div>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                                {category.title}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                {category.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container fade-in" style={{ padding: '32px 16px 64px' }}>
                {products.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 16px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto 16px',
                            borderRadius: '50%',
                            background: 'var(--bg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            📦
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                            No products yet
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Check back soon for new products in this category.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <div style={{
                            marginBottom: '20px',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)'
                        }}>
                            {products.length} product{products.length !== 1 ? 's' : ''} available
                        </div>
                        <div className="product-grid stagger-children">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
