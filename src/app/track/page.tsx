'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SavedOrder {
    order_code: string;
    whatsapp: string;
    total: number;
    created_at: string;
    items: { productName: string; denomination: string; quantity: number }[];
}

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialCode = searchParams.get('code') || '';

    const [phone, setPhone] = useState('');
    const [orderCode, setOrderCode] = useState(initialCode);
    const [error, setError] = useState('');
    const [recentOrders, setRecentOrders] = useState<SavedOrder[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('giftcard-orders');
            if (raw) {
                const parsed = JSON.parse(raw) as SavedOrder[];
                if (Array.isArray(parsed)) {
                    setRecentOrders(parsed.slice(-3).reverse());
                }
            }
        } catch {
            // ignore storage errors
        }
    }, []);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const normalized = phone.replace(/[\s\-]/g, '');
        if (!/^9\d{9}$/.test(normalized)) {
            setError('Enter the 10-digit Nepali phone number you used at checkout.');
            return;
        }

        const codeLine = orderCode.trim() ? `Order #: ${orderCode.trim()}\n` : '';
        const message = encodeURIComponent(
            `Hi! I want to track my order.\n\n` +
            codeLine +
            `My Phone: ${normalized}\n\n` +
            `Please provide an update on my order status.`
        );

        window.open(`https://wa.me/9779862157864?text=${message}`, '_blank');
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '82vh', paddingTop: 'var(--header-height)', paddingBottom: '88px' }}>
            <div className="container" style={{ maxWidth: '520px', paddingTop: '48px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span className="section-kicker">Order status</span>
                    <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '10px' }}>
                        Track your order
                    </h1>
                    <p style={{ color: '#57524E', fontSize: '0.95rem' }}>
                        Put in the phone number you used when ordering and we&apos;ll reply with your status on WhatsApp.
                    </p>
                </div>

                <form onSubmit={handleTrack} className="surface-card" style={{ padding: 'clamp(22px, 4vw, 32px)' }}>
                    <div style={{ marginBottom: '18px' }}>
                        <label htmlFor="track-phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.84rem', color: '#181818' }}>
                            Phone Number
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#57524E',
                                paddingRight: '10px',
                                borderRight: '1px solid rgba(24,22,21,0.12)',
                                pointerEvents: 'none',
                            }}>
                                +977
                            </span>
                            <input
                                id="track-phone"
                                type="tel"
                                inputMode="numeric"
                                placeholder="98XXXXXXXX"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (error) setError('');
                                }}
                                aria-invalid={Boolean(error)}
                                className="input"
                                style={{ paddingLeft: '78px', minHeight: '50px' }}
                            />
                        </div>
                        {error && (
                            <p role="alert" style={{ color: '#B91C1C', fontSize: '0.84rem', fontWeight: 500, marginTop: '8px' }}>
                                {error}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '22px' }}>
                        <label htmlFor="track-code" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.84rem', color: '#181818' }}>
                            Order Reference <span style={{ fontWeight: 400, color: '#635D57' }}>(optional)</span>
                        </label>
                        <input
                            id="track-code"
                            type="text"
                            placeholder="GMK-YYYYMMDD-..."
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button type="submit" className="btn btn-whatsapp btn-lg" style={{ width: '100%' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Check Status on WhatsApp
                    </button>
                </form>

                {/* Recent Orders Saved in This Browser */}
                {recentOrders.length > 0 && (
                    <div style={{ marginTop: '28px' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#635D57', marginBottom: '10px' }}>
                            Recent orders on this device
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentOrders.map((ord) => (
                                <button
                                    key={ord.order_code}
                                    type="button"
                                    onClick={() => {
                                        setPhone(ord.whatsapp || '');
                                        setOrderCode(ord.order_code);
                                        setError('');
                                    }}
                                    className="surface-card"
                                    style={{
                                        padding: '14px 16px',
                                        width: '100%',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <div style={{ minWidth: 0 }}>
                                        <div className="tabular-nums" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818' }}>
                                            {ord.order_code}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#635D57', marginTop: '2px' }}>
                                            {ord.items?.[0]?.productName ?? 'Gift card order'}
                                            {ord.items?.length > 1 ? ` + ${ord.items.length - 1} more` : ''}
                                        </div>
                                    </div>
                                    <span className="tabular-nums" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818', whiteSpace: 'nowrap' }}>
                                        Rs. {(ord.total ?? 0).toLocaleString()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <Link href="/category/all" className="section-link">
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '75vh', paddingTop: 'var(--header-height)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '10px' }}>
                    Track your order
                </h1>
                <p style={{ color: '#635D57' }}>Loading order tracker...</p>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
