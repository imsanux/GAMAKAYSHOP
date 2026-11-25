'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
    const pathname = usePathname();
    const {
        items,
        removeItem,
        updateQuantity,
        getTotal,
        getItemCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        lastAdded,
        clearLastAdded,
    } = useCart();

    const itemCount = getItemCount();
    const total = getTotal();
    const suppressToast = pathname === '/cart' || pathname === '/checkout';

    useEffect(() => {
        if (suppressToast && lastAdded) {
            clearLastAdded();
        }
    }, [suppressToast, lastAdded, clearLastAdded]);

    useEffect(() => {
        if (!isDrawerOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isDrawerOpen, closeDrawer]);

    return (
        <>
            {/* Subtle bottom-center Added-to-Cart confirmation bar */}
            {lastAdded && !isDrawerOpen && !suppressToast && (
                <div
                    key={`${lastAdded.productName}-${lastAdded.denomination}-${itemCount}`}
                    role="status"
                    aria-live="polite"
                    className="cart-toast-enter"
                    style={{
                        position: 'fixed',
                        bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 140,
                        width: 'calc(100% - 32px)',
                        maxWidth: '460px',
                        background: '#141413',
                        color: '#F8F7F2',
                        borderRadius: '16px',
                        border: '1px solid rgba(248, 247, 242, 0.12)',
                        boxShadow: '0 16px 38px -8px rgba(24, 24, 24, 0.28)',
                        padding: '12px 14px 12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '9999px',
                            background: 'rgba(22, 209, 109, 0.16)',
                            color: '#16D16D',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg className="check-draw" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </span>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FAF6F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {lastAdded.productName}
                            </div>
                            <div className="tabular-nums" style={{ fontSize: '0.75rem', color: '#B8B5AE' }}>
                                {lastAdded.denomination} · Rs. {lastAdded.price.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                            type="button"
                            onClick={() => {
                                clearLastAdded();
                                openDrawer();
                            }}
                            style={{
                                padding: '8px 12px',
                                minHeight: '36px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(250,246,240,0.18)',
                                background: 'rgba(250,246,240,0.08)',
                                color: '#FAF6F0',
                                fontSize: '0.78rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            Cart ({itemCount})
                        </button>
                        <Link
                            href="/checkout"
                            onClick={clearLastAdded}
                            style={{
                                padding: '8px 14px',
                                minHeight: '36px',
                                borderRadius: '9999px',
                                background: '#F4CE16',
                                color: '#181818',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            <div
                aria-hidden={!isDrawerOpen}
                onClick={closeDrawer}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 180,
                    background: 'rgba(24, 22, 21, 0.45)',
                    opacity: isDrawerOpen ? 1 : 0,
                    visibility: isDrawerOpen ? 'visible' : 'hidden',
                    transition: 'opacity 0.25s ease, visibility 0.25s ease',
                }}
            />

            {/* Slide-Over Cart Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                aria-hidden={!isDrawerOpen}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    maxWidth: '420px',
                    zIndex: 190,
                    background: '#F8F7F2',
                    borderLeft: '1px solid #E8E5DC',
                    boxShadow: isDrawerOpen ? 'var(--shadow-drawer)' : 'none',
                    transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(24, 22, 21, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 className="font-display" style={{ fontSize: '1.55rem', margin: 0 }}>
                            Your Cart
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: '#635D57', marginTop: '2px' }}>
                            {itemCount === 0
                                ? 'Nothing in your cart yet'
                                : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="Close cart"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(24, 22, 21, 0.12)',
                            background: '#FFFFFF',
                            color: '#181818',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    {items.length === 0 ? (
                        <div style={{
                            height: '100%',
                            minHeight: '260px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '24px 8px',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: '#EFEDE6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#635D57',
                                marginBottom: '16px',
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 01-8 0" />
                                </svg>
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#181818', marginBottom: '6px' }}>
                                Your cart is empty
                            </p>
                            <p style={{ fontSize: '0.86rem', color: '#635D57', marginBottom: '20px', maxWidth: '250px' }}>
                                Add a gift card and come back here when you&apos;re ready to check out.
                            </p>
                            <Link
                                href="/category/all"
                                onClick={closeDrawer}
                                className="btn btn-primary"
                            >
                                Browse Gift Cards
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {items.map((item) => (
                                <div
                                    key={`${item.product.id}-${item.denomination.value}`}
                                    style={{
                                        padding: '14px',
                                        borderRadius: '14px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(24, 22, 21, 0.08)',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            background: '#EFEDE6',
                                            flexShrink: 0,
                                            border: '1px solid rgba(24, 22, 21, 0.08)',
                                        }}>
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.72rem', color: '#635D57', fontWeight: 500 }}>
                                                {item.product.brand}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.product.name}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#57524E', marginTop: '2px' }}>
                                                {item.denomination.value}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.product.id, item.denomination.value)}
                                            aria-label={`Remove ${item.product.name}`}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#635D57',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(24,22,21,0.06)' }}>
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
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: '#181818',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                −
                                            </button>
                                            <span className="tabular-nums" style={{ minWidth: '28px', textAlign: 'center', fontSize: '0.86rem', fontWeight: 600 }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product.id, item.denomination.value, item.quantity + 1)}
                                                aria-label={`Increase quantity of ${item.product.name}`}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: '#181818',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="tabular-nums" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#181818' }}>
                                            Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                {items.length > 0 && (
                    <div
                        className="safe-bottom"
                        style={{
                            padding: '18px 24px 22px',
                            borderTop: '1px solid rgba(24, 22, 21, 0.08)',
                            background: '#FFFFFF',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#635D57' }}>WhatsApp digital delivery</span>
                            <span style={{ color: '#11663A', fontWeight: 600 }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#181818' }}>Total</span>
                            <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#181818', letterSpacing: '-0.03em' }}>
                                Rs. {total.toLocaleString()}
                            </span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeDrawer}
                            className="btn btn-accent btn-lg"
                            style={{ width: '100%', marginBottom: '8px' }}
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            href="/cart"
                            onClick={closeDrawer}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                padding: '8px',
                                fontSize: '0.84rem',
                                fontWeight: 500,
                                color: '#57524E',
                                textDecoration: 'none',
                            }}
                        >
                            Review full cart
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}
