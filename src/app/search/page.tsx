'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/lib/products';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const results = searchProducts(query);

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '70vh', transition: 'var(--theme-transition)' }}>
            {/* Search Header */}
            <div style={{
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                padding: '32px 16px',
                transition: 'var(--theme-transition)'
            }}>
                <div className="container">
                    {/* Breadcrumb with Back Button */}
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
                            <span style={{ color: 'var(--text-primary)' }}>Search</span>
                        </div>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '2rem' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </span>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                                Search Results
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                {query ? `Results for "${query}"` : 'Enter a search term'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="container fade-in" style={{ padding: '32px 16px 64px' }}>
                {!query ? (
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
                            🔍
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                            Search for products
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Use the search bar to find gift cards and subscriptions.
                        </p>
                    </div>
                ) : results.length === 0 ? (
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
                            No results found
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            We couldn&apos;t find any products matching &quot;{query}&quot;.
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
                            {results.length} product{results.length !== 1 ? 's' : ''} found
                        </div>
                        <div className="product-grid stagger-children">
                            {results.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading search...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
