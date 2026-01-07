'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
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
            setPhoneError('Please enter a valid 10-digit phone number');
            return;
        }
        setPhoneError('');
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
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 16px',
                background: '#f8fafc'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 11-8 0" />
                    </svg>
                </div>
                <h1 style={{
                    marginBottom: '12px',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#0f172a'
                }}>
                    Your cart is empty
                </h1>
                <p style={{
                    color: '#64748b',
                    marginBottom: '32px',
                    fontSize: '1rem'
                }}>
                    Add some items before checking out.
                </p>
                <Link href="/" style={{
                    padding: '14px 32px',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease'
                }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc'
        }}>
            <div className="container fade-in" style={{
                padding: '32px 16px 64px',
                maxWidth: '1000px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'transparent',
                        border: 'none',
                        marginBottom: '16px',
                        boxShadow: 'none'
                    }}>
                        {showPayment ? (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        ) : (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 11-8 0" />
                            </svg>
                        )}
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '8px'
                    }}>
                        {showPayment ? 'Complete Payment' : 'Checkout'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        {showPayment ? 'Send your order via WhatsApp or Viber' : 'Review your order and enter your details'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                        }}>
                            ✓
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Cart</span>
                    </div>
                    <div style={{ width: '40px', height: '2px', background: showPayment ? '#3b82f6' : '#e2e8f0' }} />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: showPayment ? '#3b82f6' : '#e2e8f0',
                            color: showPayment ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                        }}>
                            {showPayment ? '✓' : '2'}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: showPayment ? '#0f172a' : '#64748b' }}>Details</span>
                    </div>
                    <div style={{ width: '40px', height: '2px', background: showPayment ? '#3b82f6' : '#e2e8f0' }} />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: showPayment ? '#22c55e' : '#e2e8f0',
                            color: showPayment ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                        }}>
                            3
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: showPayment ? '#0f172a' : '#64748b' }}>Pay</span>
                    </div>
                </div>


                {/* Main Content Grid - Order Summary Left, Phone Details Right */}
                <div className="checkout-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    {/* Order Summary Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                                Order Summary
                            </h2>
                        </div>

                        <div style={{ padding: '8px 24px' }}>
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px 0',
                                        borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: '#f8fafc',
                                        flexShrink: 0
                                    }}>
                                        <Image
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            width={56}
                                            height={56}
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            color: '#0f172a',
                                            marginBottom: '4px'
                                        }}>
                                            {item.product.name}
                                        </div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: '#64748b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span style={{
                                                background: '#f1f5f9',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 500
                                            }}>
                                                {item.denomination.value}
                                            </span>
                                            <span>×{item.quantity}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: '#0f172a'
                                    }}>
                                        Rs. {(item.denomination.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: '#dbeafe',
                            padding: '20px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Total</span>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#0f172a'
                            }}>
                                Rs. {getTotal().toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {!showPayment ? (
                        /* Phone Number Entry */
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                            padding: '24px'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '16px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: '#0f172a'
                            }}>
                                <span style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                </span>
                                Your Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="e.g., 9841234567"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setPhoneError('');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    fontSize: '1.1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '14px',
                                    marginBottom: '12px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontWeight: 500
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                            {phoneError && (
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#ef4444',
                                    marginTop: '-8px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {phoneError}
                                </p>
                            )}
                            <p style={{
                                fontSize: '0.8rem',
                                color: '#64748b',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                We&apos;ll send confirmation via WhatsApp/Viber
                            </p>
                            <button
                                onClick={handleProceedToPayment}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    boxShadow: 'none',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                Continue to Payment
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        /* Payment Section */
                        <>
                            {/* Order Number and QR Codes - Side by Side */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '16px',
                                marginBottom: '16px'
                            }}>
                                {/* Order Number Success */}
                                <div style={{
                                    background: '#d1fae5',
                                    border: '2px solid #22c55e',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: '#22c55e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#15803d', marginBottom: '6px', fontWeight: 600 }}>
                                        Your Order Number
                                    </div>
                                    <div style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        letterSpacing: '1px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {orderNumber}
                                    </div>
                                </div>

                                {/* QR Codes */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                    padding: '16px'
                                }}>
                                    <h3 style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        marginBottom: '12px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        color: '#0f172a'
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7" />
                                            <rect x="14" y="3" width="7" height="7" />
                                            <rect x="14" y="14" width="7" height="7" />
                                            <rect x="3" y="14" width="7" height="7" />
                                        </svg>
                                        Scan QR to Contact Us
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '12px',
                                            background: '#faf5ff',
                                            borderRadius: '12px'
                                        }}>
                                            <img
                                                src="/viber-qr.png"
                                                alt="Viber QR"
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '100px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)'
                                                }}
                                            />
                                            <div style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                marginTop: '8px',
                                                color: '#7c3aed'
                                            }}>
                                                Viber
                                            </div>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '12px',
                                            background: '#f0fdf4',
                                            borderRadius: '12px'
                                        }}>
                                            <img
                                                src="/whatsapp-qr.png"
                                                alt="WhatsApp QR"
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '100px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.15)'
                                                }}
                                            />
                                            <div style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                marginTop: '8px',
                                                color: '#22c55e'
                                            }}>
                                                WhatsApp
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <style jsx>{`
                            @media (min-width: 768px) {
                                div:has(> div[style*="background: '#d1fae5'"]) {
                                    grid-template-columns: 1fr 1fr !important;
                                }
                            }
                        `}</style>

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
                                        padding: '18px',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        background: '#25D366',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
                                        transition: 'all 0.2s ease'
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
                                        padding: '18px',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        background: '#7360F2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        boxShadow: '0 4px 16px rgba(115, 96, 242, 0.3)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <img src="/viber-icon-white.png" alt="Viber" width={28} height={28} style={{ objectFit: 'contain' }} />
                                    Continue via Viber
                                </button>
                            </div>

                            <div style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                    Click a button above to send your order. We&apos;ll reply with payment details!
                                </p>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
