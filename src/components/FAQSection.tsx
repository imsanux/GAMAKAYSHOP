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
            padding: '80px 16px',
            background: 'var(--bg-primary)',
            transition: 'var(--theme-transition)'
        }}>
            <div className="container" style={{ maxWidth: '720px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '12px',
                        letterSpacing: '-0.03em'
                    }}>
                        Questions? Answers.
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        Everything you need to know about buying gift cards from Gamakay.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                style={{
                                    borderBottom: index < faqData.length - 1 ? '1px solid var(--border-light)' : 'none'
                                }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    style={{
                                        width: '100%',
                                        padding: '24px 0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        gap: '24px',
                                        color: 'var(--text-primary)',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget.querySelector('.faq-q') as HTMLElement)?.style &&
                                            ((e.currentTarget.firstElementChild as HTMLElement).style.color = 'var(--btn-primary-bg)');
                                    }}
                                    onMouseLeave={(e) => {
                                        ((e.currentTarget.firstElementChild as HTMLElement).style.color = 'var(--text-primary)');
                                    }}
                                >
                                    <span style={{
                                        fontSize: '1.05rem',
                                        fontWeight: 600,
                                        color: 'inherit',
                                        flex: 1,
                                        transition: 'color 0.2s ease',
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {faq.question}
                                    </span>

                                    {/* Plus/Minus icon — Apple FAQ style */}
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: isOpen ? 'var(--btn-primary-bg)' : 'var(--bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}>
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={isOpen ? 'white' : 'var(--text-muted)'}
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                transition: 'transform 0.3s ease, stroke 0.3s ease',
                                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                                            }}
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Answer */}
                                <div style={{
                                    maxHeight: isOpen ? '500px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}>
                                    <div style={{
                                        paddingBottom: '24px',
                                        paddingRight: '52px'
                                    }}>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.75,
                                            margin: 0
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
