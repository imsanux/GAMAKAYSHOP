'use client';

import Link from 'next/link';

interface Guide {
    title: string;
    category: string;
    icon: React.ReactNode;
    color: string;
    steps: string[];
}

const guides: Guide[] = [
    {
        title: 'How to Redeem PlayStation Gift Cards',
        category: 'Gaming',
        color: '#10b981',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="17" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="12" r="1" fill="currentColor" />
            </svg>
        ),
        steps: [
            'Sign in to your PlayStation account on your console or at store.playstation.com',
            'Go to the PlayStation Store and scroll down to "Redeem Codes"',
            'Enter the 12-digit code we sent you via WhatsApp',
            'Click "Redeem" and the funds will be added to your wallet',
            'Start shopping for games, DLC, and subscriptions!'
        ]
    },
    {
        title: 'How to Redeem Xbox Gift Cards',
        category: 'Gaming',
        color: '#22c55e',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="17" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="12" r="1" fill="currentColor" />
            </svg>
        ),
        steps: [
            'Sign in to your Microsoft account at redeem.microsoft.com',
            'Enter the 25-character code from your WhatsApp message',
            'Click "Next" and then "Confirm"',
            'The balance will be added to your Microsoft account',
            'Use it on Xbox Store, Microsoft Store, or Windows games'
        ]
    },
    {
        title: 'How to Activate Netflix',
        category: 'Streaming',
        color: '#ef4444',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <polygon points="10,8 10,12 14,10" fill="currentColor" />
            </svg>
        ),
        steps: [
            'We will send you login credentials via WhatsApp',
            'Open Netflix app or go to netflix.com',
            'Click "Sign In" and enter the provided email and password',
            'Create your own profile for personalized recommendations',
            'Start streaming your favorite movies and shows!'
        ]
    },
    {
        title: 'How to Activate Spotify Premium',
        category: 'Streaming',
        color: '#22c55e',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36c-.17.28-.51.37-.79.2-2.17-1.33-4.91-1.63-8.13-.89-.31.07-.62-.13-.69-.44-.07-.31.13-.62.44-.69 3.53-.81 6.56-.46 9 .99.28.17.36.52.17.83zm1.23-2.71c-.23.35-.67.46-1.02.23-2.48-1.52-6.26-1.96-9.19-1.07-.39.12-.8-.1-.92-.49-.12-.39.1-.8.49-.92 3.35-1.02 7.51-.53 10.36 1.22.35.23.47.67.28 1.03zm.11-2.82c-2.98-1.77-7.91-1.93-10.76-1.07-.46.14-.94-.12-1.08-.58-.14-.46.12-.94.58-1.08 3.27-.99 8.71-.8 12.15 1.24.42.25.56.79.31 1.21-.25.42-.79.56-1.2.28z" />
            </svg>
        ),
        steps: [
            'We will add you to a premium family plan via invite link',
            'Check your WhatsApp for the invitation link',
            'Click the link and sign in with your Spotify account',
            'Accept the family plan invitation',
            'Enjoy ad-free music and offline downloads!'
        ]
    },
    {
        title: 'How to Use ChatGPT Plus',
        category: 'AI Tools',
        color: '#8b5cf6',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 2l1.5 4.5L15.5 8l-4.5 1.5L9.5 14l-1.5-4.5L3.5 8l4.5-1.5L9.5 2z" />
                <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
            </svg>
        ),
        steps: [
            'We will provide you access credentials via WhatsApp',
            'Go to chat.openai.com and sign in',
            'You will have access to GPT-4 and all premium features',
            'Use it for writing, coding, research, and more',
            'Enjoy faster responses and priority access!'
        ]
    },
    {
        title: 'How to Activate NordVPN',
        category: 'VPN',
        color: '#3b82f6',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        steps: [
            'Download NordVPN app from their official website',
            'We will send you login credentials via WhatsApp',
            'Open the app and sign in with the provided details',
            'Connect to any server location you prefer',
            'Browse securely and access geo-restricted content!'
        ]
    },
    {
        title: 'How to Change Apple ID Region',
        category: 'Apple',
        color: '#64748b',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
        ),
        steps: [
            'Open Settings on your iPhone/iPad and tap on your Apple ID at the top',
            'Go to Media & Purchases → View Account → Country/Region',
            'Tap "Change Country or Region" and select the new region (e.g., US or India)',
            'Accept the Terms & Conditions',
            'Enter a valid payment method for that region (or select None if available)',
            'Enter a valid address for that region (you can use any hotel address)',
            'Your App Store will now show content from the new region!'
        ]
    },
    {
        title: 'How to Redeem Apple Gift Cards',
        category: 'Apple',
        color: '#64748b',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
        ),
        steps: [
            'Make sure your Apple ID is set to the correct region (US or India)',
            'Open the App Store on your iPhone/iPad',
            'Tap your profile icon at the top right',
            'Tap "Redeem Gift Card or Code"',
            'Enter the code we sent you via WhatsApp (or use camera to scan)',
            'The balance will be added to your Apple ID',
            'Use it for apps, games, subscriptions, iCloud, Apple Music, and more!'
        ]
    }
];

export default function GuidesPage() {
    return (
        <div className="container fade-in" style={{ padding: '32px 16px 64px', maxWidth: '900px' }}>
            <div style={{
                position: 'relative',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px'
            }}>
                <div style={{ position: 'absolute', left: 0 }}>
                    <Link href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#64748b',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        padding: '8px 12px',
                        background: '#f1f5f9',
                        borderRadius: '50px',
                        transition: 'all 0.2s ease'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>
                <h1 style={{
                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0,
                    padding: '0 40px',
                    width: '100%'
                }}>
                    Redemption Guides
                </h1>
            </div>
            <p style={{
                color: '#64748b',
                textAlign: 'center',
                marginBottom: '40px',
                fontSize: '0.95rem'
            }}>
                Step-by-step instructions to activate your purchases
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {guides.map((guide, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${guide.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: guide.color,
                                flexShrink: 0
                            }}>
                                {guide.icon}
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '2px'
                                }}>
                                    {guide.title}
                                </h2>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                    background: '#f1f5f9',
                                    padding: '2px 8px',
                                    borderRadius: '4px'
                                }}>
                                    {guide.category}
                                </span>
                            </div>
                        </div>

                        <ol style={{
                            margin: '16px 0 0 0',
                            paddingLeft: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {guide.steps.map((step, stepIndex) => (
                                <li
                                    key={stepIndex}
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#475569',
                                        lineHeight: 1.5
                                    }}
                                >
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

            {/* Need Help */}
            <div style={{
                marginTop: '40px',
                padding: '24px',
                background: '#f8fafc',
                borderRadius: '16px',
                textAlign: 'center'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                    Need Help?
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
                    Contact us on WhatsApp for instant support
                </p>
                <a
                    href="https://wa.me/9779862157864"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#25D366',
                        color: 'white',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                </a>
            </div>

            {/* Back Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/" style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                }}>
                    ← Back to Store
                </Link>
            </div>
        </div>
    );
}
