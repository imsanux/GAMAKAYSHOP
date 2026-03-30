'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [selectedDenom, setSelectedDenom] = useState(product.denominations[0]);
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, selectedDenom);
        setTimeout(() => setIsAdding(false), 900);
    };


    /* ── colour accent per category ─────────────────── */
    const categoryAccent: Record<string, string> = {
        gaming:        '#10b981',
        streaming:     '#f43f5e',
        software:      '#3b82f6',
        subscriptions: '#f59e0b',
    };
    const accent = categoryAccent[product.category] ?? 'var(--btn-primary-bg)';

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderRadius: '24px',
                background: 'var(--card-bg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isHovered
                    ? '0 20px 60px rgba(0,0,0,0.14), 0 0 0 1.5px rgba(0,113,227,0.18)'
                    : '0 2px 14px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'box-shadow 0.38s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
        >
            {/* ── IMAGE AREA ──────────────────────────────────── */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '68%',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
            }}>

                {/* image or fallback */}
                {product.image_url && !imageError ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        loading="lazy"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                            transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3.5rem', fontWeight: 800,
                        color: accent, opacity: 0.18,
                        letterSpacing: '-0.05em',
                    }}>
                        {product.brand.toUpperCase().slice(0, 2)}
                    </div>
                )}

                {/* gradient overlay for bottom readability */}
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '55%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                }} />

                {/* delivery badge removed */}

                {/* region badge removed */}

                {/* brand name overlay — bottom left, over gradient */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px', left: '12px',
                    zIndex: 2,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }}>
                    {product.brand}
                </div>
            </div>

            {/* ── CONTENT AREA ────────────────────────────────── */}
            <div style={{
                padding: '16px 16px 18px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '12px',
            }}>

                {/* Product name */}
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.6em',
                }}>
                    {product.name}
                </h3>

                {/* Denomination pills */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                }}>
                    {product.denominations.map(denom => {
                        const active = denom.value === selectedDenom.value;
                        return (
                            <button
                                key={denom.value}
                                onClick={() => setSelectedDenom(denom)}
                                style={{
                                    padding: '7px 14px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: active
                                        ? '1.5px solid #30d158'
                                        : '1.5px solid var(--border-color)',
                                    background: active
                                        ? 'rgba(48,209,88,0.12)'
                                        : 'transparent',
                                    color: active ? '#25a244' : 'var(--text-secondary)',
                                    transition: 'all 0.18s ease',
                                    letterSpacing: '-0.01em',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {denom.value}
                            </button>
                        );
                    })}
                </div>

                {/* Price + Add to Cart */}
                <div style={{ marginTop: 'auto' }}>
                    {/* price row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px',
                        marginBottom: '10px',
                    }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: 'var(--text-muted)',
                        }}>Rs.</span>
                        <span style={{
                            fontSize: '1.4rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                        }}>
                            {selectedDenom.price.toLocaleString()}
                        </span>
                    </div>

                    {/* full-width add to cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            cursor: isAdding ? 'default' : 'pointer',
                            background: isAdding
                                ? 'linear-gradient(135deg, #30d158 0%, #25a244 100%)'
                                : 'var(--btn-primary-bg)',
                            color: 'white',
                            boxShadow: isAdding
                                ? '0 4px 16px rgba(48,209,88,0.35)'
                                : '0 4px 16px rgba(0,113,227,0.3)',
                            transform: isAdding ? 'scale(0.97)' : 'scale(1)',
                            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                        }}
                        onMouseEnter={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = 'var(--btn-primary-hover)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,113,227,0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = 'var(--btn-primary-bg)';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,113,227,0.3)';
                            }
                        }}
                    >
                        {isAdding ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
