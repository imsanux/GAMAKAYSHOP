'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Guide {
    title: string;
    category: string;
    steps: string[];
}

const GUIDES: Guide[] = [
    {
        title: 'Redeem PlayStation Gift Cards',
        category: 'Gaming',
        steps: [
            'Sign in to your PlayStation account on your console or at store.playstation.com.',
            'Open the PlayStation Store and navigate to "Redeem Codes".',
            'Enter the 12-digit digital code sent to you on WhatsApp.',
            'Confirm redemption to credit your PlayStation wallet immediately.',
        ],
    },
    {
        title: 'Redeem Xbox Gift Cards',
        category: 'Gaming',
        steps: [
            'Sign in to your Microsoft account at redeem.microsoft.com.',
            'Enter the 25-character code from your WhatsApp message.',
            'Select "Next" and confirm to add the balance to your account.',
            'Use the balance across the Xbox Store, Microsoft Store, and Windows.',
        ],
    },
    {
        title: 'Redeem Apple Gift Cards',
        category: 'Apple',
        steps: [
            'Confirm your Apple ID region matches your card (US or India).',
            'Open the App Store on your iPhone, iPad, or Mac.',
            'Tap your profile icon in the top-right corner and choose "Redeem Gift Card or Code".',
            'Enter the code from WhatsApp to add funds to your Apple Account balance.',
        ],
    },
    {
        title: 'Change Your Apple ID Region',
        category: 'Apple',
        steps: [
            'Open Settings on your iPhone or iPad and tap your Apple ID name at the top.',
            'Go to Media & Purchases, select View Account, then tap Country/Region.',
            'Select "Change Country or Region" and choose your target region (for example, United States or India).',
            'Accept the Terms & Conditions and select None as payment method if available.',
            'Enter a valid billing address for that region to complete the switch.',
        ],
    },
    {
        title: 'Activate Netflix',
        category: 'Streaming',
        steps: [
            'Check your WhatsApp message for your Netflix access details.',
            'Open the Netflix app or visit netflix.com and select "Sign In".',
            'Enter the provided email and password.',
            'Select your assigned profile to start watching.',
        ],
    },
    {
        title: 'Activate Spotify Premium',
        category: 'Streaming',
        steps: [
            'Open the Spotify invitation link sent to your WhatsApp.',
            'Sign in with your existing Spotify account.',
            'Accept the plan invitation to activate ad-free listening and offline downloads.',
        ],
    },
    {
        title: 'Activate ChatGPT Plus',
        category: 'AI Tools',
        steps: [
            'Retrieve the account access instructions sent via WhatsApp.',
            'Visit chatgpt.com and sign in with the provided details.',
            'Verify your plan status in the bottom-left account menu.',
        ],
    },
    {
        title: 'Activate NordVPN',
        category: 'VPN',
        steps: [
            'Download the official NordVPN application for your device.',
            'Sign in using the credentials sent to your WhatsApp.',
            'Choose any server location and connect.',
        ],
    },
];

const CATEGORIES = ['All', 'Gaming', 'Apple', 'Streaming', 'AI Tools', 'VPN'];

export default function GuidesPage() {
    const [selectedCat, setSelectedCat] = useState('All');

    const visibleGuides = useMemo(() => {
        if (selectedCat === 'All') return GUIDES;
        return GUIDES.filter(g => g.category === selectedCat);
    }, [selectedCat]);

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '85vh', paddingTop: 'var(--header-height)', paddingBottom: '88px' }}>
            {/* Header Band */}
            <div style={{ background: '#EFEDE6', borderBottom: '1px solid #E8E5DC', padding: '36px 0 30px' }}>
                <div className="container-narrow">
                    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#66635B', marginBottom: '18px' }}>
                        <Link href="/" style={{ color: '#66635B', textDecoration: 'none' }}>Home</Link>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: '#181818', fontWeight: 500 }}>Redemption Guides</span>
                    </nav>

                    <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '10px' }}>
                        Redemption Guides
                    </h1>
                    <p style={{ fontSize: '0.96rem', color: '#595751', maxWidth: '520px', marginBottom: '22px' }}>
                        Step-by-step instructions to redeem gift cards, switch store regions, and activate subscriptions.
                    </p>

                    <div className="filter-strip">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className="filter-pill"
                                data-active={selectedCat === cat}
                                onClick={() => setSelectedCat(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-narrow" style={{ paddingTop: '36px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {visibleGuides.map((guide, index) => (
                        <article key={guide.title} className="surface-card" style={{ padding: 'clamp(22px, 3vw, 28px)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                                <h2 className="font-display" style={{ fontSize: '1.5rem' }}>
                                    {guide.title}
                                </h2>
                                <span style={{
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                    color: '#595751',
                                    background: '#EFEDE6',
                                    padding: '4px 11px',
                                    borderRadius: '9999px',
                                }}>
                                    {guide.category}
                                </span>
                            </div>

                            <ol style={{
                                margin: 0,
                                paddingLeft: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}>
                                {guide.steps.map((step, i) => (
                                    <li key={i} style={{ fontSize: '0.93rem', color: '#595751', lineHeight: 1.6 }}>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </article>
                    ))}
                </div>

                {/* Help Card */}
                <div className="framed-dark-card tone-dark" style={{ marginTop: '36px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 className="font-display" style={{ color: '#F8F7F2', fontSize: '1.65rem', marginBottom: '4px' }}>
                            Stuck on a redemption step?
                        </h2>
                        <p style={{ color: '#B6B3AB', fontSize: '0.9rem' }}>
                            Our team walks you through region setup and activation live on WhatsApp.
                        </p>
                    </div>
                    <a
                        href="https://wa.me/9779862157864"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent"
                    >
                        Get Live Help
                    </a>
                </div>
            </div>
        </div>
    );
}
