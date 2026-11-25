'use client';

import Link from 'next/link';

const POLICY_SECTIONS = [
    {
        num: '01',
        title: 'Region & Redeemability',
        items: [
            {
                lead: 'Region compatibility',
                text: 'Verify the supported account region and redeemability shown on each product before ordering. Refunds cannot be issued for cards purchased for an incompatible account region.',
            },
        ],
    },
    {
        num: '02',
        title: 'Refund Policy',
        items: [
            {
                lead: 'Digital consumables',
                text: 'All gift cards, codes, and digital subscriptions are non-refundable once delivered.',
            },
            {
                lead: 'Delivery guarantee',
                text: 'If there is any product or fulfillment issue on our end before successful delivery, a full refund is guaranteed.',
            },
        ],
    },
    {
        num: '03',
        title: 'Liability & Account Safety',
        items: [
            {
                lead: 'Third-party publishers',
                text: 'We are not liable if a third-party publisher discontinues a service or alters access to an active subscription.',
            },
            {
                lead: 'Account guidelines',
                text: 'Follow each platform’s official terms of service. We cannot intervene in publisher-initiated account locks or suspensions.',
            },
        ],
    },
    {
        num: '04',
        title: 'Delivery & Service Terms',
        items: [
            {
                lead: 'Delivery times',
                text: 'Most codes arrive within 5 to 15 minutes via WhatsApp after payment verification. Specialty denominations may vary depending on stock availability. Ask us on WhatsApp for a live ETA.',
            },
            {
                lead: 'Service discretion',
                text: 'We reserve the right to decline an order at our discretion.',
            },
        ],
    },
];

export default function SupportPage() {
    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '85vh', paddingTop: 'var(--header-height)', paddingBottom: '88px' }}>
            {/* Header Band */}
            <div style={{ background: '#EFEDE6', borderBottom: '1px solid #E8E5DC', padding: '36px 0 32px' }}>
                <div className="container-narrow">
                    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#66635B', marginBottom: '18px' }}>
                        <Link href="/" style={{ color: '#66635B', textDecoration: 'none' }}>Home</Link>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: '#181818', fontWeight: 500 }}>Support &amp; Policies</span>
                    </nav>
                    <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '10px' }}>
                        Support &amp; Policies
                    </h1>
                    <p style={{ fontSize: '0.96rem', color: '#595751', maxWidth: '520px' }}>
                        Please review our region, delivery, and refund policies before completing your purchase.
                    </p>
                </div>
            </div>

            <div className="container-narrow" style={{ paddingTop: '36px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {POLICY_SECTIONS.map((section) => (
                        <section key={section.num} className="surface-card" style={{ padding: 'clamp(22px, 3vw, 28px)' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                                <span className="tabular-nums" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#66635B' }}>
                                    {section.num}
                                </span>
                                <h2 className="font-display" style={{ fontSize: '1.5rem' }}>
                                    {section.title}
                                </h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {section.items.map((item) => (
                                    <p key={item.lead} style={{ fontSize: '0.94rem', color: '#595751', lineHeight: 1.68 }}>
                                        <strong style={{ color: '#181818', fontWeight: 600 }}>{item.lead}:</strong> {item.text}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Help Strip */}
                <div className="framed-dark-card tone-dark" style={{ marginTop: '36px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 className="font-display" style={{ color: '#F8F7F2', fontSize: '1.65rem', marginBottom: '4px' }}>
                            Still have a question?
                        </h2>
                        <p style={{ color: '#B6B3AB', fontSize: '0.9rem' }}>
                            Message us on WhatsApp before ordering to confirm region compatibility or delivery ETAs.
                        </p>
                    </div>
                    <a
                        href="https://wa.me/9779862157864"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent"
                    >
                        Message on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
