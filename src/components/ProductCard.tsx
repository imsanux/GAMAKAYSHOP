'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { getDisplayRegion } from '@/lib/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

function ProductCardInner({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const firstDenom = product.denominations[0] ?? { value: 'Standard', price: 0 };
    const [selectedDenom, setSelectedDenom] = useState(firstDenom);
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleAddToCart = () => {
        if (isAdding) return;
        setIsAdding(true);
        addItem(product, selectedDenom);
        setTimeout(() => setIsAdding(false), 900);
    };

    const displayRegion = getDisplayRegion(product);
    const showRegionPill = displayRegion !== 'Global';

    return (
        <article className="product-card gsap-card">
            {/* Artwork Stage */}
            <Link
                href={`/product/${product.slug}`}
                aria-label={product.name}
                style={{
                    display: 'block',
                    textDecoration: 'none',
                    position: 'relative',
                    borderBottom: '1px solid #EFEDE6',
                }}
            >
                <div className="product-card-media">
                    {product.image_url && !imageError ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onError={() => setImageError(true)}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 600,
                            color: '#66635B',
                            background: '#EFEDE6',
                        }}>
                            {product.brand.toUpperCase().slice(0, 2)}
                        </div>
                    )}

                    {/* Functional region marker only when restricted (US / India) */}
                    {showRegionPill && (
                        <span style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            padding: '4px 9px',
                            borderRadius: '9999px',
                            background: 'rgba(20, 20, 19, 0.86)',
                            color: '#F8F7F2',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.01em',
                            lineHeight: 1.1,
                        }}>
                            {displayRegion}
                        </span>
                    )}
                </div>
            </Link>

            {/* Card Body */}
            <div style={{
                padding: '14px 14px 15px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '8px',
            }}>
                {/* Brand Row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.74rem',
                    color: '#66635B',
                    fontWeight: 500,
                }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.brand}
                    </span>
                </div>

                {/* Product Name */}
                <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#181818',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.5em',
                }}>
                    <Link
                        href={`/product/${product.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {product.name}
                    </Link>
                </h3>

                {/* Denomination Selector */}
                {product.denominations.length > 1 ? (
                    <div
                        role="group"
                        aria-label={`Select amount for ${product.name}`}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                        }}
                    >
                        {product.denominations.map((denom) => {
                            const active = denom.value === selectedDenom.value;
                            return (
                                <button
                                    key={denom.value}
                                    type="button"
                                    className="denom-chip"
                                    data-active={active}
                                    aria-pressed={active}
                                    onClick={() => setSelectedDenom(denom)}
                                >
                                    {denom.value}
                                </button>
                            );
                        })}
                        {product.custom_amount && (
                            <Link
                                href={`/product/${product.slug}#custom-amount`}
                                className="denom-chip"
                                style={{
                                    textDecoration: 'none',
                                    background: 'transparent',
                                    borderStyle: 'dashed',
                                    borderColor: '#C5C0B3',
                                    color: '#181818',
                                }}
                            >
                                Custom {product.custom_amount.currency_symbol}
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ fontSize: '0.78rem', color: '#595751', fontWeight: 500 }}>
                        {selectedDenom.value}
                    </div>
                )}

                {/* Price + Quick Add CTA */}
                <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: '6px',
                        marginBottom: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 500, color: '#66635B' }}>
                                Rs.
                            </span>
                            <span
                                key={selectedDenom.value}
                                className="tabular-nums price-tick"
                                style={{
                                    fontSize: '1.28rem',
                                    fontWeight: 700,
                                    color: '#181818',
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1,
                                }}
                            >
                                {(selectedDenom?.price ?? 0).toLocaleString()}
                            </span>
                        </div>
                        <Link
                            href={`/product/${product.slug}`}
                            style={{
                                fontSize: '0.76rem',
                                fontWeight: 500,
                                color: '#66635B',
                                textDecoration: 'none',
                            }}
                        >
                            Details
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="card-add-btn"
                        data-added={isAdding}
                    >
                        {isAdding ? (
                            <>
                                <svg className="check-draw" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Added to cart
                            </>
                        ) : (
                            'Add to cart'
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default React.memo(ProductCardInner);
