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
        <div style={{ background: '#faf9f7', minHeight: '70vh' }}>
            {/* Search Header */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                padding: '32px 16px'
            }}>
                <div className="container">
                    {/* Breadcrumb with Back Button */}
                    <nav style={{
                        fontSize: '0.8rem',
                        color: '#888',
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
                                color: '#475569',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div>
                            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <span style={{ margin: '0 8px' }}>/</span>
                            <span style={{ color: '#1a1a1a' }}>Search</span>
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
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                                Search Results
                            </h1>
                            <p style={{ color: '#6b6b6b', fontSize: '0.9rem', margin: 0 }}>
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
                            background: '#f0ede8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            🔍
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                            Search for products
                        </h2>
                        <p style={{ color: '#6b6b6b', marginBottom: '20px' }}>
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
                            background: '#f0ede8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            📦
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                            No results found
                        </h2>
                        <p style={{ color: '#6b6b6b', marginBottom: '20px' }}>
                            We couldn't find any products matching "{query}".
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
                            color: '#888'
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
                background: '#faf9f7'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                    <p style={{ color: '#888' }}>Loading search...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
