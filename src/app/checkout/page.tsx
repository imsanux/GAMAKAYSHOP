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
                <h1 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>
                    Your cart is empty
                </h1>
                <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>
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
            <h1 style={{ marginBottom: '24px', fontSize: '1.5rem', textAlign: 'center' }}>
                {showPayment ? '💳 Complete Payment' : '🛒 Checkout'}
            </h1>

            {/* Order Summary */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <h2 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
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
                            borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                marginBottom: '2px'
                            }}>
                                {item.product.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {item.denomination.value} × {item.quantity}
                            </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginLeft: '12px' }}>
                            Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                ))}

                <div style={{
                    borderTop: '2px solid #0f172a',
                    paddingTop: '16px',
                    marginTop: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1.25rem',
                        fontWeight: 700
                    }}>
                        <span>Total</span>
                        <span style={{ color: '#0f172a' }}>Rs. {getTotal().toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {!showPayment ? (
                /* Phone Number Entry */
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px'
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem'
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
                            border: '2px solid #e2e8f0',
                            borderRadius: '10px',
                            marginBottom: '16px',
                            outline: 'none'
                        }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '20px' }}>
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
                        background: '#f0fdf4',
                        border: '2px solid #22c55e',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#15803d', marginBottom: '4px' }}>
                            Your Order Number
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '1px' }}>
                            {orderNumber}
                        </div>
                    </div>

                    {/* QR Codes */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        padding: '20px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.4 0C9.3 0 5.02.3 3.2 2.05c-1.32 1.32-1.77 3.3-1.87 5.74-.1 2.46-.05 4.73.91 6.23.52.8 1.25 1.45 2.15 1.95.9.5 1.82.8 2.82.91l.12 2.37c0 .12.08.15.16.08l2.32-2.45h.18c2.24 0 6.68-.3 8.53-2.08 1.32-1.32 1.82-3.2 1.89-5.6.09-2.57-.07-4.8-.95-6.25-.5-.8-1.23-1.47-2.13-1.97C16.4.48 15.48.15 14.48.05 13.8-.02 12.8 0 11.4 0zm.2 1.5c1.3 0 2.17.05 2.77.12.8.1 1.5.35 2.1.72.67.42 1.15.93 1.47 1.48.67 1.1.82 2.97.74 5.25-.06 2.05-.47 3.47-1.35 4.3-1.4 1.3-5.17 1.55-7.03 1.55h-.42l-1.52 1.6-.07-1.55-.4-.08c-.82-.17-1.55-.42-2.2-.78-.67-.38-1.15-.87-1.47-1.4-.73-1.17-.8-3.15-.72-5.3.08-2.08.4-3.53 1.3-4.43 1.28-1.28 4.52-1.48 6.8-1.48zm.18 2.77c-.18 0-.33.15-.33.33v.02c0 .18.15.33.33.33 1.24.05 2.27.52 3.07 1.32.8.82 1.22 1.85 1.25 3.08 0 .18.15.32.33.32h.02c.18 0 .32-.15.32-.33-.03-1.45-.53-2.67-1.47-3.62-.95-.95-2.15-1.45-3.52-1.45zm.03 1.65c-.18 0-.32.15-.32.33v.02c0 .18.15.32.32.32.8.03 1.42.32 1.93.85.5.52.77 1.15.8 1.92 0 .18.15.32.33.32h.02c.18 0 .32-.15.32-.33-.03-.97-.4-1.77-1.02-2.42-.63-.63-1.42-.98-2.38-1.01zm-2.36.28c-.4-.02-.77.12-.98.58l-.2.38c-.13.25-.22.42-.45.42-.17 0-.42-.22-.68-.52-.35-.38-.7-.87-.93-1.45-.15-.35-.08-.58.12-.75l.35-.32c.35-.32.38-.7.23-1.08-.42-.97-.75-1.53-.92-1.82-.28-.45-.6-.52-.92-.52h-.35c-.17 0-.48.03-.8.25-.52.4-.97 1.05-.97 1.87 0 1.23.87 2.77 2.07 4.07 1.57 1.77 3.75 3.12 5.5 3.12.82 0 1.3-.32 1.55-.68l.25-.4c.17-.27.17-.52.03-.75-.35-.52-.82-.95-1.4-1.28-.2-.12-.47-.12-.55-.12z" />
                            </svg>
                            Continue via Viber
                        </button>
                    </div>

                    <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
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
