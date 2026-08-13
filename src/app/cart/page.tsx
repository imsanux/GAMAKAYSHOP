'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '360px', padding: '0 16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Cart is Empty
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.88rem' }}>
                        Add some gift cards and they&apos;ll appear here.
                    </p>
                    <Link href="/" style={{ display: 'inline-flex', padding: '13px 28px', background: '#111111', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
            <div className="container" style={{ paddingLeft: '16px', paddingRight: '16px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>
                            {items.reduce((c, i) => c + i.quantity, 0)} item{items.reduce((c, i) => c + i.quantity, 0) !== 1 ? 's' : ''}
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>
                            Your Cart
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {items.length >= 2 && (
                            <button
                                onClick={clearCart}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#B91C1C'; e.currentTarget.style.borderColor = 'rgba(185,28,28,0.3)'; e.currentTarget.style.background = 'rgba(185,28,28,0.04)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'none'; }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                Clear
                            </button>
                        )}
                        <Link href="/"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none', padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            Close
                        </Link>
                    </div>
                </div>

                <div className="cart-grid">

                    {/* LEFT — Cart Items */}
                    <div>
                        {items.map((item) => (
                            <div
                                key={`${item.product.id}-${item.denomination.value}`}
                                className="cart-item"
                            >
                                {/* Top row: image + info + remove */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                    {/* Product Image */}
                                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                                {item.product.brand.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, margin: '0 0 2px 0' }}>
                                            {item.product.brand}
                                        </p>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px 0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.product.name}
                                        </h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                                            {item.denomination.value}
                                        </p>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeItem(item.product.id, item.denomination.value)}
                                        aria-label="Remove item"
                                        style={{ padding: '5px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '6px', flexShrink: 0, transition: 'all 0.15s ease' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#B91C1C'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Bottom row: quantity + price */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                                    {/* Quantity Controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity - 1)}
                                            style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                                        >−</button>
                                        <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', padding: '0 4px' }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity + 1)}
                                            style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                                        >+</button>
                                    </div>

                                    {/* Price */}
                                    <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                        Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT — Order Summary */}
                    <div className="summary-sticky">
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            {/* Header */}
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: 0 }}>Order Summary</p>
                            </div>

                            <div style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Rs. {getTotal().toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                                    <span style={{ color: '#15803D', fontWeight: 700 }}>Digital — Free</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', background: '#111111' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FACC15', letterSpacing: '-0.03em' }}>Rs. {getTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <div style={{ padding: '16px 20px' }}>
                                <Link
                                    href="/checkout"
                                    style={{ display: 'block', width: '100%', padding: '15px', fontSize: '0.88rem', fontWeight: 800, background: '#111111', color: '#FFFFFF', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'background 0.2s ease', boxSizing: 'border-box' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
                                >
                                    Proceed to Checkout
                                </Link>

                                <a
                                    href={`https://wa.me/9779862157864?text=${encodeURIComponent(`I would like to know more about ${items.map(item => item.product.name).join(', ')}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s ease' }}
                                    onMouseOver={e => (e.currentTarget.style.color = '#25D366')}
                                    onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                    Need help? Ask on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                /* Cart item card */
                .cart-item {
                    padding: 16px;
                    margin-bottom: 8px;
                    background: #FFFFFF;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                }

                /* Summary panel sticky on desktop only */
                .summary-sticky {
                    position: static;
                }

                /* Main grid — mobile: stacked, items first */
                .cart-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* Desktop overrides */
                @media (min-width: 768px) {
                    .cart-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 340px !important;
                        gap: 32px !important;
                        align-items: start !important;
                    }
                    .summary-sticky {
                        position: sticky !important;
                        top: 120px !important;
                    }
                    .cart-item {
                        padding: 18px 20px !important;
                    }
                }
            `}</style>
        </div>
    );
}
