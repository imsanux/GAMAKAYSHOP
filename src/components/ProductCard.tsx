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
        setTimeout(() => setIsAdding(false), 800);
    };

    return (
        <div
            style={{
                borderRadius: '20px',
                background: 'var(--card-bg)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
                border: `1px solid ${isHovered ? 'var(--btn-primary-bg)' : 'var(--border-light)'}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '72%',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
            }}>
                {product.image_url && !imageError ? (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '82%',
                        height: '82%',
                        borderRadius: '14px',
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
                                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                transform: isHovered ? 'scale(1.06)' : 'scale(1)'
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
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        opacity: 0.4
                    }}>
                        {product.brand.charAt(0)}
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '6px'
            }}>
                {/* Brand */}
                <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                }}>
                    {product.brand}
                </div>

                {/* Product Name */}
                <h3 style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.35,
                    minHeight: '2.7em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    letterSpacing: '-0.01em',
                    margin: 0
                }}>
                    {product.name}
                </h3>

                {/* Denomination Selector */}
                <div style={{ marginTop: 'auto' }}>
                    <select
                        value={selectedDenom.value}
                        onChange={(e) => {
                            const denom = product.denominations.find(d => d.value === e.target.value);
                            if (denom) setSelectedDenom(denom);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 30px 8px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            background: 'var(--input-bg)',
                            cursor: 'pointer',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 10px center',
                            transition: 'all 0.2s ease',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--btn-primary-bg)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 113, 227, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
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
                    gap: '8px',
                    marginTop: '6px'
                }}>
                    <div>
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em'
                        }}>
                            Rs. {selectedDenom.price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        style={{
                            padding: '8px 14px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: isAdding ? '#30d158' : 'var(--btn-primary-bg)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: isAdding ? 'default' : 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            whiteSpace: 'nowrap',
                            transform: isAdding ? 'scale(0.95)' : 'scale(1)',
                            boxShadow: isAdding
                                ? '0 2px 8px rgba(48, 209, 88, 0.3)'
                                : '0 2px 8px rgba(0, 113, 227, 0.2)',
                            letterSpacing: '-0.01em'
                        }}
                        onMouseEnter={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = 'var(--btn-primary-hover)';
                                e.currentTarget.style.transform = 'scale(1.03)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isAdding) {
                                e.currentTarget.style.background = 'var(--btn-primary-bg)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }
                        }}
                    >
                        {isAdding ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Added
                            </span>
                        ) : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
