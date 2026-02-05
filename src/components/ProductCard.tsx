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

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, selectedDenom);
        setTimeout(() => setIsAdding(false), 600);
    };

    return (
        <div style={{
            borderRadius: '16px',
            background: 'var(--card-bg)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Product Image */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '70%',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
            }}>
                {product.image_url && !imageError ? (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '85%',
                        height: '85%',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            onError={() => setImageError(true)}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                    </div>
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)'
                    }}>
                        {product.brand.charAt(0)}
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div style={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                {/* Brand */}
                <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                }}>
                    {product.brand}
                </div>

                {/* Product Name */}
                <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    minHeight: '2.6em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {product.name}
                </h3>

                {/* Denomination Selector */}
                <div style={{ marginBottom: '8px', marginTop: 'auto' }}>
                    <select
                        value={selectedDenom.value}
                        onChange={(e) => {
                            const denom = product.denominations.find(d => d.value === e.target.value);
                            if (denom) setSelectedDenom(denom);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 28px 8px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            background: 'var(--input-bg)',
                            cursor: 'pointer',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center',
                            transition: 'border-color 0.15s ease',
                            color: 'var(--text-primary)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--btn-primary-bg)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                        {product.denominations.map(denom => (
                            <option key={denom.value} value={denom.value}>
                                {denom.value}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price & Add Button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                }}>
                    <div>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)'
                        }}>
                            Rs. {selectedDenom.price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        style={{
                            padding: '8px 10px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: isAdding ? '#22c55e' : 'var(--btn-primary-bg)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isAdding ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                            transform: isAdding ? 'scale(0.97)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isAdding) e.currentTarget.style.background = 'var(--btn-primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                            if (!isAdding) e.currentTarget.style.background = 'var(--btn-primary-bg)';
                        }}
                    >
                        {isAdding ? '✓' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div >
    );
}

