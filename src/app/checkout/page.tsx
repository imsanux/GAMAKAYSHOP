'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [copied, setCopied] = useState(false);

    const generateOrderNumber = () => {
        const date = new Date();
        const dateToday = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

        let productName = 'MIX';
        if (items.length > 0) {
            productName = items[0].product.name.split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (productName.length > 12) productName = productName.substring(0, 12);
            if (!productName) productName = 'ITEM';
        }

        const amountBackwards = getTotal().toString().split('').reverse().join('');
        return `GMK-${dateToday}-${productName}-${amountBackwards}`;
    };

    const createOrderMessage = () => {
        const itemsList = items.map(item =>
            `- ${item.product.name} (${item.denomination.value}) x${item.quantity} = Rs.${(item.denomination.price * item.quantity).toLocaleString()}`
        ).join('\n');

        return `NEW ORDER\n\n` +
            `Order #: ${orderNumber}\n` +
            `Phone: ${phone}\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Total: Rs.${getTotal().toLocaleString()}\n\n` +
            `Please confirm my order!`;
    };

    const saveOrderToLocalStorage = (orderNum: string, cleanPhone: string) => {
        const order = {
            order_code: orderNum,
            full_name: 'Customer',
            whatsapp: cleanPhone,
            items: items.map(item => ({
                productName: item.product.name,
                brand: item.product.brand,
                denomination: item.denomination.value,
                price: item.denomination.price,
                quantity: item.quantity
            })),
            total: getTotal(),
            status: 'pending',
            created_at: new Date().toISOString()
        };
        const existingOrders = JSON.parse(localStorage.getItem('giftcard-orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('giftcard-orders', JSON.stringify(existingOrders));
    };

    const handleProceedToPayment = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setPhoneError('');
        const normalized = phone.replace(/[\s\-]/g, '');
        const phoneRegex = /^9\d{9}$/;
        if (!phoneRegex.test(normalized)) {
            setPhoneError('Enter a valid 10-digit mobile number starting with 9 (for example, 98XXXXXXXX).');
            return;
        }
        setPhone(normalized);
        const newOrderNumber = generateOrderNumber();
        setOrderNumber(newOrderNumber);
        saveOrderToLocalStorage(newOrderNumber, normalized);
        setShowPayment(true);
    };

    const handleCopyOrder = () => {
        if (!orderNumber) return;
        navigator.clipboard.writeText(orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleWhatsAppPayment = () => {
        const message = encodeURIComponent(createOrderMessage());
        window.open(`https://wa.me/9779862157864?text=${message}`, '_blank');
        clearCart();
    };

    const handleViberPayment = () => {
        const message = encodeURIComponent(createOrderMessage());
        window.open(`viber://chat?number=9779862157864&text=${message}`, '_blank');
        clearCart();
    };

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
                        No items to check out
                    </h1>
                    <p style={{ color: '#57524E', marginBottom: '26px', fontSize: '0.94rem' }}>
                        Add a gift card to your cart before proceeding to checkout.
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
                {/* Header + Clean Stepper */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <span style={{ color: '#181818' }}>1. Contact</span>
                            <span aria-hidden="true" style={{ color: 'rgba(24,22,21,0.28)' }}>/</span>
                            <span style={{ color: showPayment ? '#181818' : '#635D57' }}>2. Confirm &amp; Pay</span>
                        </div>
                        <h1 className="font-display" style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)' }}>
                            {showPayment ? 'Confirm your order' : 'Checkout'}
                        </h1>
                    </div>

                    <Link href="/cart" className="btn btn-secondary btn-sm">
                        Edit cart
                    </Link>
                </div>

                <div className="checkout-grid">
                    {/* LEFT: Form / Payment Step */}
                    <div className="checkout-main">
                        {!showPayment ? (
                            <form onSubmit={handleProceedToPayment} className="surface-card checkout-card">
                                <div style={{ marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid rgba(24, 22, 21, 0.08)' }}>
                                    <h2 className="font-display" style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.5rem)', marginBottom: '4px' }}>
                                        Where should we send your code?
                                    </h2>
                                    <p style={{ fontSize: '0.88rem', color: '#595751' }}>
                                        Enter your mobile number to generate your order code and continue on WhatsApp or Viber.
                                    </p>
                                </div>

                                <label
                                    htmlFor="checkout-phone"
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.84rem', color: '#181818' }}
                                >
                                    WhatsApp or Viber number
                                </label>

                                <div style={{ position: 'relative', marginBottom: '10px' }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: '#57524E',
                                        pointerEvents: 'none',
                                        paddingRight: '10px',
                                        borderRight: '1px solid rgba(24,22,21,0.12)',
                                    }}>
                                        +977
                                    </span>
                                    <input
                                        id="checkout-phone"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        placeholder="98XXXXXXXX"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (phoneError) setPhoneError('');
                                        }}
                                        aria-invalid={Boolean(phoneError)}
                                        aria-describedby={phoneError ? 'checkout-phone-error' : 'checkout-phone-hint'}
                                        className="input"
                                        style={{ paddingLeft: '78px', minHeight: '50px', fontSize: '1rem', fontWeight: 500 }}
                                    />
                                </div>

                                {phoneError ? (
                                    <p id="checkout-phone-error" role="alert" style={{ color: '#B91C1C', fontSize: '0.84rem', fontWeight: 500, marginBottom: '18px' }}>
                                        {phoneError}
                                    </p>
                                ) : (
                                    <p id="checkout-phone-hint" style={{ fontSize: '0.82rem', color: '#635D57', marginBottom: '22px' }}>
                                        Used to match your payment receipt and deliver your code.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-accent btn-lg checkout-submit-btn"
                                >
                                    Continue to Payment · Rs. {getTotal().toLocaleString()}
                                </button>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                    gap: '8px',
                                    marginTop: '22px',
                                    paddingTop: '18px',
                                    borderTop: '1px solid rgba(24, 22, 21, 0.08)',
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    color: '#57524E',
                                    lineHeight: 1.35,
                                }}>
                                    <div>WhatsApp &amp; Viber</div>
                                    <div>Verified codes</div>
                                    <div>5–15 min delivery</div>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                                <div className="surface-card checkout-card">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid rgba(24, 22, 21, 0.08)' }}>
                                        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                                            <h2 className="font-display" style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.5rem)', marginBottom: '4px' }}>
                                                Send your order in chat
                                            </h2>
                                            <p style={{ fontSize: '0.88rem', color: '#595751' }}>
                                                Choose WhatsApp or Viber below. Your order summary will be pre-filled so we can confirm and send your code right away.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPayment(false)}
                                            className="btn btn-outline btn-sm"
                                            style={{ flexShrink: 0 }}
                                        >
                                            Edit phone
                                        </button>
                                    </div>

                                    {/* Generated Order Reference */}
                                    <div style={{
                                        background: '#EFEDE6',
                                        borderRadius: '14px',
                                        padding: '14px 16px',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        flexWrap: 'wrap',
                                    }}>
                                        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                                            <div style={{ fontSize: '0.74rem', fontWeight: 500, color: '#635D57' }}>Order number</div>
                                            <div className="tabular-nums" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#181818', wordBreak: 'break-all' }}>
                                                {orderNumber}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCopyOrder}
                                            className="btn btn-outline btn-sm"
                                            style={{ background: '#FFFFFF', flexShrink: 0 }}
                                        >
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>

                                    {/* Messaging Channel Buttons */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '12px', marginBottom: '16px' }}>
                                        <button
                                            type="button"
                                            onClick={handleWhatsAppPayment}
                                            className="btn btn-whatsapp btn-lg"
                                            style={{ width: '100%', padding: '13px 14px', fontSize: '0.9rem', whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.25 }}
                                        >
                                            <WhatsAppIcon size={18} />
                                            Confirm on WhatsApp
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleViberPayment}
                                            className="btn btn-lg"
                                            style={{ width: '100%', padding: '13px 14px', fontSize: '0.9rem', background: '#6652E0', color: '#FFFFFF', whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.25 }}
                                        >
                                            <img src="/viber-logo.webp" alt="" role="presentation" width={18} height={18} decoding="async" style={{ width: '18px', height: '18px', minWidth: '18px', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                                            Confirm on Viber
                                        </button>
                                    </div>

                                    <p style={{ fontSize: '0.82rem', color: '#635D57', textAlign: 'center' }}>
                                        Phone saved: +977 {phone}. Sending the message clears your cart automatically.
                                    </p>
                                </div>

                                {/* Desktop QR Scan Option */}
                                <div className="surface-card checkout-card">
                                    <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#181818', textAlign: 'center', marginBottom: '16px' }}>
                                        On a computer? Scan to message from your phone
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', maxWidth: '340px', margin: '0 auto' }}>
                                        {[
                                            { src: '/whatsapp-qr.webp', alt: 'WhatsApp QR code', label: 'WhatsApp' },
                                            { src: '/viber-qr.webp', alt: 'Viber QR code', label: 'Viber' },
                                        ].map(({ src, alt, label }) => (
                                            <div key={label} style={{ textAlign: 'center', minWidth: 0 }}>
                                                <img
                                                    src={src}
                                                    alt={alt}
                                                    width={132}
                                                    height={132}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{ width: '100%', maxWidth: '132px', height: 'auto', borderRadius: '12px', border: '1px solid rgba(24, 22, 21, 0.1)' }}
                                                />
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#181818', marginTop: '8px' }}>
                                                    {label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="checkout-summary">
                        <div className="surface-card" style={{ overflow: 'hidden', maxWidth: '100%' }}>
                            <div className="checkout-summary-pad" style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(24, 22, 21, 0.08)', background: '#EFEDE6' }}>
                                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', fontWeight: 600, color: '#57524E', margin: 0 }}>
                                    Order Summary
                                </h2>
                            </div>

                            <div className="checkout-summary-pad">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.product.id}-${item.denomination.value}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '14px 0',
                                            minWidth: 0,
                                            borderBottom: index < items.length - 1 ? '1px solid rgba(24, 22, 21, 0.08)' : 'none',
                                        }}
                                    >
                                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', background: '#EFEDE6', flexShrink: 0, border: '1px solid rgba(24,22,21,0.08)' }}>
                                            {item.product.image_url ? (
                                                <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#635D57' }}>
                                                    {item.product.brand.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.product.name}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#635D57', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.denomination.value} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="tabular-nums" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-summary-pad" style={{ paddingTop: '16px', paddingBottom: '16px', background: '#141413', color: '#F8F7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                                <span style={{ fontSize: '0.88rem', color: '#B8B5AE', fontWeight: 500 }}>Total</span>
                                <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
                                    Rs. {getTotal().toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr);
                    gap: 20px;
                    width: 100%;
                }
                .checkout-main,
                .checkout-summary {
                    min-width: 0;
                    max-width: 100%;
                }
                .checkout-card {
                    padding: 20px 18px;
                    min-width: 0;
                    max-width: 100%;
                }
                .checkout-summary-pad {
                    padding-left: 18px;
                    padding-right: 18px;
                }
                .checkout-submit-btn {
                    width: 100%;
                    padding: 13px 16px;
                    white-space: normal;
                    text-align: center;
                    line-height: 1.25;
                }
                @media (min-width: 640px) {
                    .checkout-card {
                        padding: 26px 28px;
                    }
                    .checkout-summary-pad {
                        padding-left: 22px;
                        padding-right: 22px;
                    }
                }
                @media (min-width: 820px) {
                    .checkout-grid {
                        grid-template-columns: minmax(0, 1fr) 350px;
                        gap: 32px;
                        align-items: start;
                    }
                    .checkout-summary {
                        position: sticky;
                        top: calc(var(--header-height) + 24px);
                    }
                }
            `}</style>
        </div>
    );
}
