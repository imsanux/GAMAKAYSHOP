'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
    productName: string;
    brand: string;
    denomination: string;
    price: number;
    quantity: number;
}

interface Order {
    order_code: string;
    full_name: string;
    whatsapp: string;
    email?: string;
    items: OrderItem[];
    total: number;
    status: string;
    created_at: string;
}

export default function ConfirmationPage() {
    const params = useParams();
    const orderCode = params.code as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('giftcard-orders') || '[]');
        const foundOrder = orders.find((o: Order) => o.order_code === orderCode);
        if (foundOrder) {
            setOrder(foundOrder);
        }
        setLoaded(true);
    }, [orderCode]);

    const copyOrderCode = () => {
        navigator.clipboard.writeText(orderCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getWhatsAppLink = () => {
        if (!order) return '#';
        const phoneNumber = '9779862157864';
        const itemsList = order.items
            .map(item => `- ${item.productName} (${item.denomination}) x${item.quantity}`)
            .join('\n');

        const message = encodeURIComponent(
            `NEW ORDER\n\n` +
            `Order Code: ${orderCode}\n` +
            `Phone: ${order.whatsapp}\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Total: Rs. ${order.total.toLocaleString()}\n\n` +
            `Please provide payment instructions.`
        );

        return `https://wa.me/${phoneNumber}?text=${message}`;
    };

    const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReceiptFile(file);
    };

    const submitReceipt = async () => {
        if (!receiptFile || !order) return;
        setUploading(true);
        await new Promise(resolve => setTimeout(resolve, 900));

        const orders = JSON.parse(localStorage.getItem('giftcard-orders') || '[]');
        const orderIndex = orders.findIndex((o: Order) => o.order_code === orderCode);
        if (orderIndex >= 0) {
            orders[orderIndex].receipt_uploaded = true;
            orders[orderIndex].receipt_name = receiptFile.name;
            localStorage.setItem('giftcard-orders', JSON.stringify(orders));
        }

        setUploading(false);
        setUploadSuccess(true);
        setReceiptFile(null);
    };

    if (!loaded) {
        return (
            <div style={{ background: 'var(--bg-primary)', minHeight: '75vh', paddingTop: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#635D57' }}>Loading order confirmation...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ background: 'var(--bg-primary)', minHeight: '75vh', paddingTop: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '420px', padding: '40px 20px' }}>
                    <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        Order not found
                    </h1>
                    <p style={{ color: '#57524E', marginBottom: '26px', fontSize: '0.94rem' }}>
                        We could not locate order reference &ldquo;{orderCode}&rdquo; in this browser. You can still check your status on WhatsApp.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/track" className="btn btn-primary">Track Order</Link>
                        <Link href="/" className="btn btn-outline">Return Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '85vh', paddingTop: 'var(--header-height)', paddingBottom: '88px' }}>
            <div className="container" style={{ maxWidth: '680px', paddingTop: '40px' }}>
                {/* Success Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '9999px',
                        background: '#ECFDF5',
                        color: '#11663A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 18px',
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 className="font-display" style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.5rem)', marginBottom: '8px' }}>
                        Order recorded
                    </h1>
                    <p style={{ color: '#57524E', fontSize: '0.95rem' }}>
                        Send your order on WhatsApp to receive payment details and your digital code.
                    </p>
                </div>

                {/* Order Code Card */}
                <div className="surface-card" style={{ padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#635D57', marginBottom: '8px' }}>
                        Order reference
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.02em', color: '#181818', wordBreak: 'break-all' }}>
                            {orderCode}
                        </span>
                        <button type="button" onClick={copyOrderCode} className="btn btn-secondary btn-sm">
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ width: '100%', marginBottom: '20px' }}
                >
                    Open WhatsApp with Order Details
                </a>

                {/* Order Details */}
                <div className="surface-card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 600, color: '#181818', marginBottom: '14px' }}>
                        Order items
                    </h2>
                    <div>
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    padding: '10px 0',
                                    borderBottom: index < order.items.length - 1 ? '1px solid rgba(24, 22, 21, 0.08)' : 'none',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#181818' }}>{item.productName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#635D57' }}>{item.denomination} × {item.quantity}</div>
                                </div>
                                <div className="tabular-nums" style={{ fontWeight: 600, color: '#181818' }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(24, 22, 21, 0.12)', marginTop: '12px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                        <span>Total</span>
                        <span className="tabular-nums">Rs. {order.total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Optional Receipt Upload */}
                <div className="surface-card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 600, color: '#181818', marginBottom: '6px' }}>
                        Save payment receipt
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: '#57524E', marginBottom: '16px' }}>
                        Attach your receipt for reference, or send it directly inside WhatsApp chat.
                    </p>

                    {uploadSuccess ? (
                        <div style={{ padding: '14px', borderRadius: '12px', background: '#ECFDF5', color: '#11663A', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center' }}>
                            Receipt saved to your order record.
                        </div>
                    ) : (
                        <>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleReceiptUpload}
                                id="receipt-upload"
                                style={{ display: 'none' }}
                            />
                            {receiptFile && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    padding: '10px 14px',
                                    background: '#EFEDE6',
                                    borderRadius: '10px',
                                    marginBottom: '12px',
                                    fontSize: '0.86rem',
                                }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {receiptFile.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setReceiptFile(null)}
                                        aria-label="Remove selected file"
                                        style={{ border: 'none', background: 'transparent', color: '#635D57', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <label htmlFor="receipt-upload" className="btn btn-secondary" style={{ flex: 1, cursor: 'pointer' }}>
                                    {receiptFile ? 'Change File' : 'Select Receipt File'}
                                </label>
                                {receiptFile && (
                                    <button type="button" onClick={submitReceipt} disabled={uploading} className="btn btn-primary" style={{ flex: 1 }}>
                                        {uploading ? 'Saving...' : 'Save Receipt'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href={`/track?code=${encodeURIComponent(orderCode)}`} className="section-link">
                        Track this order
                    </Link>
                </div>
            </div>
        </div>
    );
}
