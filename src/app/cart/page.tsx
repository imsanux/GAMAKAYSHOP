'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="container fade-in" style={{
                paddingTop: '110px',
                paddingBottom: '80px',
                paddingLeft: '16px',
                paddingRight: '16px',
                textAlign: 'center'
            }}>
                <div style={{
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                </div>
                <h1 style={{ marginBottom: '10px', fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
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
                <Link href="/" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ 
            paddingTop: '100px', 
            paddingBottom: '80px', 
            paddingLeft: '16px', 
            paddingRight: '16px' 
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px'
            }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    margin: 0
                }}>
                    Shopping Cart
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 400,
                        color: 'var(--text-muted)',
                        marginLeft: '10px'
                    }}>
                        ({items.reduce((c, i) => c + i.quantity, 0)} items)
                    </span>
                </h1>
                
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </Link>
            </div>

            <div className="cart-grid" style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: '28px'
            }}>
                {/* Cart Items */}
                <div>
                    {items.length >= 2 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                            <button
                                onClick={clearCart}
                                style={{
                                    padding: '8px 16px',
                                    background: 'none',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius-full)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ff453a';
                                    e.currentTarget.style.borderColor = 'rgba(255, 69, 58, 0.3)';
                                    e.currentTarget.style.background = 'rgba(255, 69, 58, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.style.background = 'none';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Clear cart
                            </button>
                        </div>
                    )}
                    {items.map((item) => (
                        <div
                            key={`${item.product.id}-${item.denomination.value}`}
                            style={{
                                padding: '20px',
                                marginBottom: '12px',
                                background: 'var(--card-bg)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                                transition: 'all 0.2s ease',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            {/* Product Image */}
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: 'var(--radius-md)',
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
                                        fontWeight: 700,
                                        color: 'var(--text-muted)'
                                    }}>
                                        {item.product.brand.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    marginBottom: '3px',
                                    fontWeight: 600
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
                                    marginBottom: '12px'
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
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border-light)'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity - 1)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: 'var(--text-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'background 0.15s ease'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            minWidth: '32px',
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
                                                width: '36px',
                                                height: '36px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: 'var(--text-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'background 0.15s ease'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--text-primary)',
                                        letterSpacing: '-0.02em',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeItem(item.product.id, item.denomination.value)}
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    flexShrink: 0,
                                    borderRadius: '50%',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.color = '#ff453a';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                                aria-label="Remove item"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    padding: '24px',
                    position: 'sticky',
                    top: '72px',
                    height: 'fit-content',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--theme-transition)'
                }}>
                    <h2 style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '20px',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em'
                    }}>
                        Order Summary
                    </h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Rs. {getTotal().toLocaleString()}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                        <span style={{ color: '#30d158', fontWeight: 500 }}>Digital (Free)</span>
                    </div>

                    <div style={{
                        borderTop: '1.5px solid var(--border-color)',
                        paddingTop: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em'
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

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                        <a 
                            href={`https://wa.me/9779862157864?text=${encodeURIComponent(`I would like to know more about ${items.map(item => item.product.name).join(', ')}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#25D366'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Need Help?
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (min-width: 900px) {
                    .cart-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 340px !important;
                    }
                }
            `}</style>
        </div>
    );
}
