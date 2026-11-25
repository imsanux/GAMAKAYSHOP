'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { searchProducts, getFeaturedProducts } from '@/lib/products';

const QUICK_TERMS = ['PlayStation', 'Steam', 'Apple', 'Netflix', 'Spotify', 'Claude', 'Xbox', 'Discord'];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';
    const [inputVal, setInputVal] = useState(query);
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        setInputVal(query);
        setCategoryFilter('all');
    }, [query]);

    const rawResults = useMemo(() => searchProducts(query), [query]);
    const popularFallback = useMemo(() => getFeaturedProducts(4), []);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        rawResults.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [rawResults]);

    const visibleResults = useMemo(() => {
        if (categoryFilter === 'all') return rawResults;
        return rawResults.filter(p => p.category === categoryFilter);
    }, [rawResults, categoryFilter]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputVal.trim();
        router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '80vh', paddingTop: 'var(--header-height)' }}>
            {/* Search Header */}
            <div style={{
                background: '#EFEDE6',
                borderBottom: '1px solid #E8E5DC',
                padding: '32px 0 28px',
            }}>
                <div className="container">
                    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#635D57', marginBottom: '18px' }}>
                        <Link href="/" style={{ color: '#635D57', textDecoration: 'none' }}>Home</Link>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: '#181818', fontWeight: 500 }}>Search</span>
                    </nav>

                    <h1 className="font-display" style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.85rem)', marginBottom: '16px' }}>
                        {query ? `Results for “${query}”` : 'Search gift cards'}
                    </h1>

                    {/* Inline Search Refinement Form */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            maxWidth: '560px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="search"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder="Search by brand, game, or subscription..."
                            aria-label="Search gift cards"
                            className="input"
                            style={{ borderRadius: '9999px' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="container" style={{ paddingTop: '28px', paddingBottom: '80px' }}>
                {!query ? (
                    <div>
                        <p style={{ fontSize: '0.9rem', color: '#57524E', marginBottom: '16px' }}>
                            Popular searches
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
                            {QUICK_TERMS.map(term => (
                                <Link
                                    key={term}
                                    href={`/search?q=${encodeURIComponent(term)}`}
                                    className="filter-pill"
                                >
                                    {term}
                                </Link>
                            ))}
                        </div>
                        <h2 className="font-display" style={{ fontSize: '1.65rem', marginBottom: '20px' }}>
                            Popular right now
                        </h2>
                        <div className="product-grid">
                            {popularFallback.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : rawResults.length === 0 ? (
                    <div>
                        <div className="surface-card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '48px' }}>
                            <h2 className="font-display" style={{ fontSize: '1.65rem', marginBottom: '8px' }}>
                                No cards matched &ldquo;{query}&rdquo;
                            </h2>
                            <p style={{ color: '#57524E', fontSize: '0.94rem', marginBottom: '22px', maxWidth: '420px', margin: '0 auto 22px' }}>
                                Try searching for a broader brand name, or message us on WhatsApp if you need a specific regional card.
                            </p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/category/all" className="btn btn-primary">
                                    Browse All Gift Cards
                                </Link>
                                <a
                                    href={`https://wa.me/9779862157864?text=${encodeURIComponent(`Hi! Do you have "${query}" available?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                >
                                    Request on WhatsApp
                                </a>
                            </div>
                        </div>

                        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
                            Popular gift cards
                        </h2>
                        <div className="product-grid">
                            {popularFallback.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Category Filter Bar for Matches */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                            <div className="filter-strip">
                                <button
                                    type="button"
                                    className="filter-pill"
                                    data-active={categoryFilter === 'all'}
                                    onClick={() => setCategoryFilter('all')}
                                >
                                    All ({rawResults.length})
                                </button>
                                {Object.entries(categoryCounts).map(([cat, count]) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className="filter-pill"
                                        data-active={categoryFilter === cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        style={{ textTransform: cat === 'dating-social' ? 'none' : 'capitalize' }}
                                    >
                                        {cat === 'dating-social' ? 'Dating & Social' : cat} ({count})
                                    </button>
                                ))}
                            </div>
                            <span className="tabular-nums" style={{ fontSize: '0.84rem', color: '#635D57' }}>
                                Showing {visibleResults.length} product{visibleResults.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="product-grid">
                            {visibleResults.map(product => (
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
                paddingTop: 'var(--header-height)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
            }}>
                <h1 className="font-display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', marginBottom: '8px' }}>
                    Search gift cards
                </h1>
                <p style={{ color: '#635D57', fontSize: '0.95rem' }}>Loading catalog search...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
