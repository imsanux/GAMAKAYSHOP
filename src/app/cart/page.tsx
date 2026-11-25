'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getDisplayRegion } from '@/lib/products';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
    const totalCount = items.reduce((c, i) => c + i.quantity, 0);

    if (items.length === 0) {
        return (
            <div style={{
                background: 'var(--bg-primary)',
                minHeight: '78vh',
                paddingTop: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px 20px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: '#EFEDE6',
                        color: '#635D57',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                    </div>
                    <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        Your cart is empty
                    </h1>
                    <p style={{ color: '#57524E', marginBottom: '26px', fontSize: '0.94rem' }}>
                        Select any gift card and denomination from the catalog to get started.
                    </p>
                    <Link href="/category/all" className="btn btn-primary btn-lg">
                        Browse Gift Cards
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '85vh', paddingTop: 'var(--header-height)', paddingBottom: '88px' }}>
            <div className="container-narrow" style={{ paddingTop: '36px' }}>
                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                    <div>
                        <span className="section-kicker tabular-nums">
                            {totalCount} item{totalCount !== 1 ? 's' : ''} selected
                        </span>
                        <h1 className="font-display" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)' }}>
                            Your Cart
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {items.length >= 2 && (
                            <button
                                type="button"
                                onClick={clearCart}
                                className="btn btn-outline btn-sm"
                                style={{ color: '#B91C1C', borderColor: 'rgba(185, 28, 28, 0.24)' }}
                            >
                                Clear cart
                            </button>
                        )}
                        <Link href="/category/all" className="btn btn-secondary btn-sm">
                            Continue shopping
                        </Link>
                    </div>
                </div>

                <div className="cart-grid">
                    {/* LEFT: Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map((item) => (
                            <div
                                key={`${item.product.id}-${item.denomination.value}`}
                                className="surface-card"
                                style={{ padding: '18px 20px' }}
                            >
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <Link
                                        href={`/product/${item.product.slug}`}
                                        style={{
                                            width: '68px',
                                            height: '68px',
                                            borderRadius: '12px',
                                            background: '#EFEDE6',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            border: '1px solid rgba(24, 22, 21, 0.08)',
                                            display: 'block',
                                        }}
                                    >
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#635D57' }}>
                                                {item.product.brand.slice(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </Link>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#635D57', fontWeight: 500, marginBottom: '2px' }}>
                                            {item.product.brand} · {getDisplayRegion(item.product)}
                                        </div>
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            style={{ fontSize: '0.98rem', fontWeight: 600, color: '#181818', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
                                        >
                                            {item.product.name}
                                        </Link>
                                        <div style={{ fontSize: '0.82rem', color: '#57524E', fontWeight: 500 }}>
                                            {item.denomination.value.toLowerCase() === 'standard'
                                                ? 'Digital gift card'
                                                : `Option: ${item.denomination.value}`}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.product.id, item.denomination.value)}
                                        aria-label={`Remove ${item.product.name}`}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#635D57',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: '14px',
                                    paddingTop: '14px',
                                    borderTop: '1px solid rgba(24, 22, 21, 0.06)',
                                }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        background: '#EFEDE6',
                                        borderRadius: '9999px',
                                        padding: '2px',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity - 1)}
                                            aria-label={`Decrease quantity of ${item.product.name}`}
                                            style={{ width: '36px', height: '36px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.05rem', color: '#181818' }}
                                        >
                                            −
                                        </button>
                                        <span className="tabular-nums" style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: '#181818' }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity + 1)}
                                            aria-label={`Increase quantity of ${item.product.name}`}
                                            style={{ width: '36px', height: '36px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.05rem', color: '#181818' }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="tabular-nums" style={{ fontSize: '1.08rem', fontWeight: 700, color: '#181818', letterSpacing: '-0.02em' }}>
                                        Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="cart-summary-sticky">
                        <div className="surface-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E8E5DC', background: '#EFEDE6' }}>
                                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', fontWeight: 600, color: '#595751', margin: 0 }}>
                                    Order Summary
                                </h2>
                            </div>

                            <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#66635B' }}>Subtotal ({totalCount} item{totalCount !== 1 ? 's' : ''})</span>
                                    <span className="tabular-nums" style={{ color: '#181818', fontWeight: 600 }}>Rs. {getTotal().toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#66635B' }}>Digital delivery</span>
                                    <span style={{ color: '#11663A', fontWeight: 600 }}>Free</span>
                                </div>
                            </div>

                            <div style={{ padding: '16px 22px', background: '#141413', color: '#F8F7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#B6B3AB' }}>Total</span>
                                <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F8F7F2', letterSpacing: '-0.03em' }}>
                                    Rs. {getTotal().toLocaleString()}
                                </span>
                            </div>

                            <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link href="/checkout" className="btn btn-accent btn-lg" style={{ width: '100%', whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.25 }}>
                                    Proceed to Checkout
                                </Link>
                                <a
                                    href={`https://wa.me/9779862157864?text=${encodeURIComponent(`Hi, I have a question about my cart: ${items.map(item => `${item.product.name} (${item.denomination.value})`).join(', ')}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textAlign: 'center',
                                        padding: '8px',
                                        fontSize: '0.82rem',
                                        fontWeight: 500,
                                        color: '#57524E',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Questions about region or stock? Ask on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cart-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr);
                    gap: 24px;
                    width: 100%;
                }
                .cart-grid > * {
                    min-width: 0;
                    max-width: 100%;
                }
                @media (min-width: 820px) {
                    .cart-grid {
                        grid-template-columns: minmax(0, 1fr) 340px;
                        gap: 32px;
                        align-items: start;
                    }
                    .cart-summary-sticky {
                        position: sticky;
                        top: calc(var(--header-height) + 24px);
                    }
                }
            `}</style>
        </div>
    );
}
