'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

// Category accent — small badge only, restrained
const CATEGORY_ACCENT: Record<string, { bg: string; text: string }> = {
    gaming:        { bg: '#ECFDF5', text: '#15803D' },
    streaming:     { bg: '#FEF2F2', text: '#B91C1C' },
    software:      { bg: '#EFF6FF', text: '#1D4ED8' },
    subscriptions: { bg: '#FEFCE8', text: '#92400E' },
};

// Dark mode accent overrides
const CATEGORY_ACCENT_DARK: Record<string, { bg: string; text: string }> = {
    gaming:        { bg: 'rgba(21,128,61,0.15)', text: '#4ADE80' },
    streaming:     { bg: 'rgba(185,28,28,0.15)', text: '#F87171' },
    software:      { bg: 'rgba(29,78,216,0.15)', text: '#60A5FA' },
    subscriptions: { bg: 'rgba(146,64,14,0.15)', text: '#FCD34D' },
};

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const firstDenom = product.denominations[0] ?? { value: 'N/A', price: 0 };
    const [selectedDenom, setSelectedDenom] = useState(firstDenom);
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, selectedDenom);
        setTimeout(() => setIsAdding(false), 900);
    };

    const accent = CATEGORY_ACCENT[product.category] ?? {
        bg: '#F5F5F5', text: '#555555'
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderRadius: '7px',
                background: 'var(--card-bg)',
                border: isHovered
                    ? '1px solid #1A1A1A'
                    : '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isHovered
                    ? '0 4px 16px rgba(0,0,0,0.09)'
                    : '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'border-color 0.18s ease, box-shadow 0.2s ease',
            }}
        >
            {/* ── IMAGE AREA ──────────────────────────────────── */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '51%',   /* ~25% shorter than before — text-first hierarchy */
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
            }}>
                {/* Product image */}
                {product.image_url && !imageError ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        loading="lazy"
                        decoding="async"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.25rem', fontWeight: 800,
                        color: '#CCCCCC',
                        letterSpacing: '-0.05em',
                        background: 'var(--bg-secondary)',
                    }}>
                        {product.brand.toUpperCase().slice(0, 2)}
                    </div>
                )}
            </div>

            {/* ── CONTENT AREA ────────────────────────────────── */}
            <div style={{
                padding: '11px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '7px',
            }}>
                {/* Brand label — muted, small caps */}
                <div style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.09em',
                    lineHeight: 1,
                }}>
                    {product.brand}
                </div>

                {/* Product name — clear hierarchy */}
                <h3 style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.3em',
                }}>
                    {product.name}
                </h3>

                {/* Denomination pills — flat selection */}
                {product.denominations.length > 1 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                    }}>
                        {product.denominations.map(denom => {
                            const active = denom.value === selectedDenom.value;
                            return (
                                <button
                                    key={denom.value}
                                    onClick={() => setSelectedDenom(denom)}
                                    style={{
                                        padding: '4px 9px',
                                        borderRadius: '4px',
                                        fontSize: '0.74rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        border: active
                                            ? '1.5px solid #111111'
                                            : '1px solid var(--border-color)',
                                        background: active
                                            ? '#111111'
                                            : 'transparent',
                                        color: active ? '#FFFFFF' : 'var(--text-secondary)',
                                        transition: 'all 0.12s ease',
                                        whiteSpace: 'nowrap',
                                        lineHeight: 1,
                                    }}
                                >
                                    {denom.value}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Price + CTA — pushed to bottom */}
                <div style={{ marginTop: 'auto' }}>
                    {/* Price row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '2px',
                        marginBottom: '8px',
                    }}>
                        <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                        }}>Rs.</span>
                        <span style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {(selectedDenom?.price ?? 0).toLocaleString()}
                        </span>
                    </div>

                    {/* Add to Cart — black primary, yellow on hover */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            borderRadius: '5px',
                            border: 'none',
                            fontSize: '0.79rem',
                            fontWeight: 700,
                            letterSpacing: '0.005em',
                            cursor: isAdding ? 'default' : 'pointer',
                            background: isAdding ? '#16A34A' : '#111111',
                            color: isAdding ? '#FFFFFF' : '#FFFFFF',
                            transition: 'background 0.16s ease, color 0.14s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = '#EAB308';
                                e.currentTarget.style.color = '#111111';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = '#111111';
                                e.currentTarget.style.color = '#FFFFFF';
                            }
                        }}
                    >
                        {isAdding ? (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Added
                            </>
                        ) : (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
