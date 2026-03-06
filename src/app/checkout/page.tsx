'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Generate order number from phone number
    const generateOrderNumber = (phoneNum: string) => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const phoneSuffix = phoneNum.slice(-4) || '0000';
        return `GK-${phoneSuffix}-${timestamp}`;
    };

    // Create order message for WhatsApp/Viber
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

    // Save order to localStorage for tracking
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
        if (!phone.trim() || phone.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }
        const newOrderNumber = generateOrderNumber(phone);
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
            <div className="container fade-in" style={{
                padding: '64px 16px',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '12px', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                    Your cart is empty
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Add some items before checking out.
                </p>
                <Link href="/" style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600
                }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: '24px 16px 64px', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '24px', fontSize: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                {showPayment ? '💳 Complete Payment' : '🛒 Checkout'}
            </h1>

            {/* Order Summary */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '20px',
                marginBottom: '20px',
                transition: 'var(--theme-transition)'
            }}>
                <h2 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Order Summary
                </h2>

                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            padding: '12px 0',
                            borderBottom: index < items.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                marginBottom: '2px',
                                color: 'var(--text-primary)'
                            }}>
                                {item.product.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {item.denomination.value} × {item.quantity}
                            </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginLeft: '12px', color: 'var(--text-primary)' }}>
                            Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                ))}

                <div style={{
                    borderTop: '2px solid var(--border-color)',
                    paddingTop: '16px',
                    marginTop: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1.25rem',
                        fontWeight: 700
                    }}>
                        <span style={{ color: 'var(--text-primary)' }}>Total</span>
                        <span style={{ color: 'var(--text-primary)' }}>Rs. {getTotal().toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {!showPayment ? (
                /* Phone Number Entry */
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    padding: '20px',
                    transition: 'var(--theme-transition)'
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)'
                    }}>
                        📱 Your Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="e.g., 9841234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            fontSize: '1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: '10px',
                            marginBottom: '16px',
                            outline: 'none',
                            background: 'var(--input-bg)',
                            color: 'var(--text-primary)',
                            transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        We&apos;ll generate your order number and send confirmation via WhatsApp/Viber
                    </p>
                    <button
                        onClick={handleProceedToPayment}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        Proceed to Payment →
                    </button>
                </div>
            ) : (
                /* Payment Section */
                <>
                    {/* Order Number */}
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '2px solid #22c55e',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#15803d', marginBottom: '4px' }}>
                            Your Order Number
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>
                            {orderNumber}
                        </div>
                    </div>

                    {/* QR Codes */}
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        padding: '20px',
                        marginBottom: '20px',
                        transition: 'var(--theme-transition)'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            📱 Scan QR to Contact Us
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src="/viber-qr.png"
                                    alt="Viber QR"
                                    style={{
                                        width: '100%',
                                        maxWidth: '150px',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '8px', color: '#7c3aed' }}>
                                    Viber
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src="/whatsapp-qr.png"
                                    alt="WhatsApp QR"
                                    style={{
                                        width: '100%',
                                        maxWidth: '150px',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '8px', color: '#22c55e' }}>
                                    WhatsApp
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <button
                            onClick={handleWhatsAppPayment}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                background: '#25D366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Continue via WhatsApp
                        </button>
                        <button
                            onClick={handleViberPayment}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                background: '#7360F2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <img
                                src="/viber-logo.png"
                                alt="Viber"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                            Continue via Viber
                        </button>
                    </div>

                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        marginTop: '16px'
                    }}>
                        Click a button above to send your order. We&apos;ll reply with payment details!
                    </p>
                </>
            )}
        </div>
    );
}
