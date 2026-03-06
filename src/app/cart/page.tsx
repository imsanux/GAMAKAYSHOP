'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="container fade-in" style={{
                padding: '64px 16px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                }}>
                    🛒
                </div>
                <h1 style={{ marginBottom: '10px', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                    Your cart is empty
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '28px',
                    maxWidth: '320px',
                    margin: '0 auto 28px',
                    fontSize: '0.95rem'
                }}>
                    Add some gift cards and they&apos;ll appear here.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: '32px 16px 64px' }}>
            <h1 style={{ marginBottom: '24px', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Shopping Cart
                <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    marginLeft: '10px'
                }}>
                    ({items.reduce((c, i) => c + i.quantity, 0)} items)
                </span>
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px'
            }}>
                {/* Cart Items */}
                <div>
                    {items.map((item) => (
                        <div
                            key={`${item.product.id}-${item.denomination.value}`}
                            style={{
                                padding: '16px',
                                marginBottom: '12px',
                                background: 'var(--card-bg)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'flex-start',
                                transition: 'var(--theme-transition)'
                            }}
                        >
                            {/* Product Image */}
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '8px',
                                background: 'var(--bg-secondary)',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                {item.product.image_url ? (
                                    <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)'
                                    }}>
                                        {item.product.brand.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em',
                                    marginBottom: '2px'
                                }}>
                                    {item.product.brand}
                                </div>
                                <h3 style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    marginBottom: '4px',
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: 'var(--text-primary)'
                                }}>
                                    {item.product.name}
                                </h3>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '10px'
                                }}>
                                    {item.denomination.value}
                                </div>

                                {/* Quantity & Actions Row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px'
                                }}>
                                    {/* Quantity Controls */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity - 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            minWidth: '28px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)'
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity + 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--text-primary)'
                                    }}>
                                        Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeItem(item.product.id, item.denomination.value)}
                                style={{
                                    padding: '6px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    flexShrink: 0
                                }}
                                aria-label="Remove item"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        style={{
                            padding: '10px 16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Clear cart
                    </button>
                </div>

                {/* Order Summary */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    padding: '20px',
                    position: 'sticky',
                    top: '80px',
                    height: 'fit-content',
                    transition: 'var(--theme-transition)'
                }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
                        Order Summary
                    </h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            Subtotal
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>Rs. {getTotal().toLocaleString()}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>Digital (Free)</span>
                    </div>

                    <div style={{
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1.2rem',
                            fontWeight: 700
                        }}>
                            <span style={{ color: 'var(--text-primary)' }}>Total</span>
                            <span style={{ color: 'var(--text-primary)' }}>Rs. {getTotal().toLocaleString()}</span>
                        </div>
                    </div>

                    <Link
                        href="/checkout"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @media (min-width: 900px) {
                    .container > div {
                        grid-template-columns: 1fr 340px !important;
                    }
                }
            `}</style>
        </div>
    );
}
