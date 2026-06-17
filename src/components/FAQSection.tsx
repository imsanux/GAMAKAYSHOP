'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is Gamakay Giftcards, and how does it work?",
        answer: "Gamakay Giftcards is Nepal's digital marketplace for gift cards. Simply browse our collection, select your desired denomination, add to cart, and complete your purchase. We'll deliver your code via WhatsApp within minutes."
    },
    {
        question: "How long does it take to receive an online gift card?",
        answer: "Most orders are delivered within 5-15 minutes via WhatsApp. On some occasions, delivery may take between 1-24 hours depending on availability."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers to major Nepali banks, eSewa, and Khalti. Payment details are provided after you place your order."
    },
    {
        question: "What is your refund policy?",
        answer: "We offer a comprehensive refund guarantee in case of product or service issues. However, no refunds are provided if the buyer fails to check region compatibility. Receipt is required before delivery, and all sales are final with no replacements after delivery unless issues arise."
    },
    {
        question: "How do I check region compatibility?",
        answer: "Each product listing clearly shows the supported region (e.g., US, UK, Turkey). Make sure your account or device is set to the correct region before purchasing. Contact us on WhatsApp if you're unsure."
    },
    {
        question: "Can I track my order?",
        answer: "Yes! Go to the 'Track Order' page and enter your phone number. This will open WhatsApp with your details pre-filled, and we'll reply with your order status right away."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section style={{
            padding: '72px 0',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            transition: 'var(--theme-transition)',
        }}>
            <div className="container" style={{ maxWidth: '740px' }}>
                {/* Header — left-aligned, editorial */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-block',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#111111',
                        background: '#FFCC00',
                        padding: '3px 9px',
                        borderRadius: '3px',
                        marginBottom: '12px',
                    }}>
                        FAQ
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: '0 0 8px',
                        letterSpacing: '-0.03em',
                    }}>
                        Questions? Answers.
                    </h2>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: 1.6,
                    }}>
                        Everything you need to know about buying gift cards from Gamakay.
                    </p>
                </div>

                {/* FAQ Items */}
                <div style={{
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                }}>
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                style={{
                                    borderBottom: index < faqData.length - 1
                                        ? '1px solid var(--border-color)'
                                        : 'none',
                                }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    style={{
                                        width: '100%',
                                        padding: '20px 22px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: isOpen ? 'var(--bg-secondary)' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        gap: '20px',
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isOpen) e.currentTarget.style.background = 'var(--bg-secondary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isOpen) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        flex: 1,
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.4,
                                    }}>
                                        {faq.question}
                                    </span>

                                    {/* Plus/minus — flat square button */}
                                    <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '4px',
                                        background: isOpen ? '#111111' : 'var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'background 0.2s ease',
                                    }}>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={isOpen ? 'white' : 'var(--text-secondary)'}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                transition: 'transform 0.25s ease, stroke 0.2s ease',
                                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Answer panel */}
                                <div style={{
                                    maxHeight: isOpen ? '400px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.35s ease',
                                }}>
                                    <div style={{ padding: '0 22px 20px', paddingRight: '60px' }}>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.75,
                                            margin: 0,
                                        }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
