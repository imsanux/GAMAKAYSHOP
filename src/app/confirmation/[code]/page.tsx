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
    const [copied, setCopied] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        // Fetch order from localStorage
        const orders = JSON.parse(localStorage.getItem('giftcard-orders') || '[]');
        const foundOrder = orders.find((o: Order) => o.order_code === orderCode);
        if (foundOrder) {
            setOrder(foundOrder);
        }
    }, [orderCode]);

    const copyOrderCode = () => {
        navigator.clipboard.writeText(orderCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getWhatsAppLink = () => {
        if (!order) return '#';

        const phoneNumber = '1234567890'; // Replace with your business WhatsApp number
        const itemsList = order.items
            .map(item => `• ${item.productName} (${item.denomination}) x${item.quantity}`)
            .join('\n');

        const message = encodeURIComponent(
            `🛒 *New Order*\n\n` +
            `*Order Code:* ${orderCode}\n` +
            `*Name:* ${order.full_name}\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Total:* Rs. ${order.total.toLocaleString()}\n\n` +
            `Please provide payment instructions.`
        );

        return `https://wa.me/${phoneNumber}?text=${message}`;
    };

    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReceiptFile(file);
    };

    const submitReceipt = async () => {
        if (!receiptFile || !order) return;

        setUploading(true);

        // Simulate upload - in production, this would upload to Supabase storage
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update order with receipt info
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

    if (!order) {
        return (
            <div className="container" style={{
                padding: 'var(--spacing-3xl) var(--spacing-md)',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.75rem' }}>
                    Order not found
                </h1>
                <p style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                    The order code &quot;{orderCode}&quot; was not found.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{
            padding: 'var(--spacing-2xl) var(--spacing-md)',
            maxWidth: '700px'
        }}>
            {/* Success Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(45, 138, 78, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--spacing-lg)',
                    fontSize: '2.5rem',
                    color: '#2d8a4e'
                }}>
                    ✓
                </div>
                <h1 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.75rem' }}>
                    Order Placed Successfully!
                </h1>
                <p style={{ color: 'var(--color-secondary)' }}>
                    Contact us on WhatsApp to complete your payment.
                </p>
            </div>

            {/* Order Code Card */}
            <div className="glass-card" style={{
                padding: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-secondary)',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    Your Order Code
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-md)'
                }}>
                    <span style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        fontFamily: 'monospace'
                    }}>
                        {orderCode}
                    </span>
                    <button
                        onClick={copyOrderCode}
                        style={{
                            padding: 'var(--spacing-sm)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-sm)',
                            background: copied ? 'var(--color-success)' : 'var(--bg-primary)',
                            color: copied ? 'white' : 'var(--color-primary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-secondary)',
                    marginTop: 'var(--spacing-md)'
                }}>
                    Save this code to track your order
                </p>
            </div>

            {/* WhatsApp Button */}
            <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg"
                style={{
                    width: '100%',
                    marginBottom: 'var(--spacing-lg)',
                    backgroundColor: '#25D366',
                    color: 'white',
                    fontSize: '1rem',
                    padding: 'var(--spacing-md) var(--spacing-xl)'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact on WhatsApp
            </a>

            {/* Order Summary */}
            <div className="glass-card" style={{
                padding: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-lg)' }}>
                    Order Details
                </h2>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-sm) 0',
                                borderBottom: index < order.items.length - 1 ? '1px solid var(--border-light)' : 'none'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                    {item.productName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                                    {item.denomination} × {item.quantity}
                                </div>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                Rs. {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: 'var(--spacing-md)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1.125rem',
                        fontWeight: 600
                    }}>
                        <span>Total</span>
                        <span>Rs. {order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Receipt Upload */}
            <div className="glass-card" style={{
                padding: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>
                    Upload Payment Receipt
                </h2>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-secondary)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    After making payment, upload your receipt for faster verification.
                </p>

                {uploadSuccess ? (
                    <div style={{
                        padding: 'var(--spacing-lg)',
                        backgroundColor: 'rgba(45, 138, 78, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        color: '#2d8a4e'
                    }}>
                        <span style={{ fontSize: '1.5rem', marginRight: 'var(--spacing-sm)' }}>✓</span>
                        Receipt uploaded successfully!
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

                        {receiptFile ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <span style={{ flex: 1, fontSize: '0.875rem' }}>
                                    📄 {receiptFile.name}
                                </span>
                                <button
                                    onClick={() => setReceiptFile(null)}
                                    style={{
                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--color-secondary)'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : null}

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <label
                                htmlFor="receipt-upload"
                                className="btn btn-secondary"
                                style={{ flex: 1, cursor: 'pointer' }}
                            >
                                {receiptFile ? 'Change File' : 'Select File'}
                            </label>

                            {receiptFile && (
                                <button
                                    onClick={submitReceipt}
                                    disabled={uploading}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Receipt'}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Track Order Link */}
            <div style={{ textAlign: 'center' }}>
                <Link
                    href={`/track?code=${orderCode}`}
                    style={{
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                    }}
                >
                    Track your order →
                </Link>
            </div>
        </div>
    );
}
