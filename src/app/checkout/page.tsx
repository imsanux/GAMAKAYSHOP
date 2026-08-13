'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

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

    const saveOrderToLocalStorage = (orderNum: string) => {
        const order = {
            order_code: orderNum,
            full_name: 'Customer',
            whatsapp: phone,
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

    const handleProceedToPayment = () => {
        setPhoneError('');
        const phoneRegex = /^9\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setPhoneError('Please enter a correct phone number');
            return;
        }
        const newOrderNumber = generateOrderNumber();
        setOrderNumber(newOrderNumber);
        saveOrderToLocalStorage(newOrderNumber);
        setShowPayment(true);
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
            <div className="container fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', margin: '0 auto 20px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                    🛒
                </div>
                <h1 style={{ marginBottom: '12px', fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    Your cart is empty
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
                    Add some items before checking out.
                </p>
                <Link href="/" style={{ display: 'inline-flex', padding: '14px 28px', background: '#111111', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s ease' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
            <div className="container" style={{ paddingLeft: '16px', paddingRight: '16px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            {showPayment ? 'Step 2 of 2' : 'Step 1 of 2'}
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>
                            {showPayment ? 'Complete Payment' : 'Checkout'}
                        </h1>
                    </div>
                    <Link href="/"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        Close
                    </Link>
                </div>

                {/* Two-column grid */}
                <div className="checkout-grid">

                    {/* LEFT — Form */}
                    <div className="form-payment">
                        {!showPayment ? (
                            <div className="form-card">

                                {/* Step indicator */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#111111', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>1</div>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Your Contact Info</p>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>We&apos;ll send your order code via WhatsApp</p>
                                    </div>
                                </div>

                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    WhatsApp / Phone Number
                                </label>
                                <div style={{ position: 'relative', marginBottom: '12px' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none' }}>🇳🇵 +977</span>
                                    <input
                                        type="tel"
                                        placeholder="98XXXXXXXX"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{ width: '100%', padding: '14px 18px 14px 90px', fontSize: '1rem', fontWeight: 600, border: '1.5px solid var(--border-color)', borderRadius: '8px', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = '#111111'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(250,204,21,0.25)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                {phoneError && (
                                    <div style={{ color: '#B91C1C', fontSize: '0.82rem', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                        {phoneError}
                                    </div>
                                )}
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
                                    We&apos;ll generate a unique order number and you&apos;ll complete payment via WhatsApp.
                                </p>

                                <button
                                    onClick={handleProceedToPayment}
                                    style={{ width: '100%', padding: '16px', fontSize: '0.95rem', fontWeight: 800, background: '#111111', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s ease', textTransform: 'uppercase' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#333333'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#111111'; }}
                                >
                                    Proceed to Payment
                                </button>

                                {/* Trust row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                                    {[
                                        { text: 'Secure' },
                                        { text: 'Instant Delivery' },
                                        { text: 'WhatsApp Support' },
                                    ].map(({ text }) => (
                                        <span key={text} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Payment step */}
                                <div className="form-card" style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#111111', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>2</div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Send Order on WhatsApp or Viber</p>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Tap a button below — your order details will be pre-filled</p>
                                        </div>
                                    </div>

                                    {/* Order number */}
                                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--border-color)' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order #</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em', wordBreak: 'break-all', textAlign: 'right' }}>{orderNumber}</span>
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                        <button
                                            onClick={handleViberPayment}
                                            style={{ padding: '14px', fontSize: '0.88rem', fontWeight: 700, background: '#7360F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(115,96,242,0.3)', transition: 'all 0.2s ease' }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(115,96,242,0.4)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(115,96,242,0.3)'; }}
                                        >
                                            <img src="/viber-logo.png" alt="Viber" style={{ width: '18px', height: '18px', filter: 'brightness(0) invert(1)' }} />
                                            Viber
                                        </button>
                                        <button
                                            onClick={handleWhatsAppPayment}
                                            style={{ padding: '14px', fontSize: '0.88rem', fontWeight: 700, background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(37,211,102,0.3)', transition: 'all 0.2s ease' }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.4)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)'; }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                            WhatsApp
                                        </button>
                                    </div>

                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                                        Your order details will be pre-filled. Send the message and we&apos;ll reply with payment instructions!
                                    </p>
                                </div>

                                {/* QR codes */}
                                <div className="form-card">
                                    <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>Or scan to contact us</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[
                                            { src: '/viber-qr.png', alt: 'Viber QR', label: 'Viber', color: '#7360F2' },
                                            { src: '/whatsapp-qr.png', alt: 'WhatsApp QR', label: 'WhatsApp', color: '#25D366' },
                                        ].map(({ src, alt, label, color }) => (
                                            <div key={label} style={{ textAlign: 'center' }}>
                                                <img src={src} alt={alt} style={{ width: '100%', maxWidth: '140px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', color }}>{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT — Order Summary */}
                    <div className="order-summary">
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: '120px' }}>
                            {/* Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: 0 }}>Order Summary</p>
                            </div>

                            {/* Items */}
                            <div style={{ padding: '0 24px' }}>
                                {items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: index < items.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                                            {item.product.image_url ? (
                                                <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                                    {item.product.brand.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{item.denomination.value} × {item.quantity}</p>
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', flexShrink: 0 }}>
                                            Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div style={{ padding: '16px 24px', borderTop: '2px solid #111111', background: '#111111' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FACC15', letterSpacing: '-0.03em' }}>Rs. {getTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .form-card {
                    background: #FFFFFF;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    padding: 20px 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                }
                .checkout-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .order-summary { order: 2; }
                .form-payment { order: 1; }
                @media (min-width: 768px) {
                    .form-card {
                        padding: 32px !important;
                    }
                    .checkout-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 360px !important;
                        gap: 32px !important;
                        align-items: start !important;
                    }
                    .order-summary { order: 2; }
                    .form-payment { order: 1; }
                }
            `}</style>
        </div>
    );
}
