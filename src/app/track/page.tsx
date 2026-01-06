'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackPage() {
    const [phone, setPhone] = useState('');

    const handleTrack = () => {
        if (!phone.trim() || phone.length < 10) {
            alert('Please enter your phone number');
            return;
        }

        const message = encodeURIComponent(
            `Hi! I want to track my order.\n\n` +
            `My Phone: ${phone}\n\n` +
            `Please provide an update on my order status.`
        );

        window.open(`https://wa.me/9779862157864?text=${message}`, '_blank');
    };

    return (
        <div className="container fade-in" style={{
            padding: '32px 16px 64px',
            maxWidth: '500px'
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '8px',
                fontSize: '1.5rem'
            }}>
                Track Your Order
            </h1>
            <p style={{
                textAlign: 'center',
                color: '#64748b',
                marginBottom: '32px',
                fontSize: '0.9rem'
            }}>
                Enter your phone number and we&apos;ll update you via WhatsApp
            </p>

            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px'
            }}>
                {/* Phone Number */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}>
                        Your Phone Number
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
                            outline: 'none'
                        }}
                    />
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginTop: '8px'
                    }}>
                        Enter the phone number you used while ordering
                    </p>
                </div>

                {/* Track Button */}
                <button
                    onClick={handleTrack}
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
                    Track via WhatsApp
                </button>
            </div>

            {/* Help Text */}
            <p style={{
                textAlign: 'center',
                color: '#64748b',
                marginTop: '24px',
                fontSize: '0.8rem'
            }}>
                We&apos;ll reply with your order status on WhatsApp
            </p>

            {/* Back Link */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link href="/" style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                }}>
                    ← Continue Shopping
                </Link>
            </div>
        </div>
    );
}
