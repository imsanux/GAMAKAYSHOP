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
            padding: '64px 16px',
            background: 'white'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '40px'
                }}>
                    Frequently Asked Questions
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                borderBottom: index < faqData.length - 1 ? '1px solid #e2e8f0' : 'none'
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
                                    gap: '20px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#0f172a';
                                }}
                            >
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: 'inherit',
                                    flex: 1,
                                    transition: 'color 0.15s ease'
                                }}>
                                    {faq.question}
                                </span>

                                {/* Chevron Icon */}
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        flexShrink: 0,
                                        transition: 'transform 0.25s ease',
                                        transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Answer */}
                            <div style={{
                                maxHeight: openIndex === index ? '500px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease-out'
                            }}>
                                <div style={{
                                    paddingBottom: '24px',
                                    paddingRight: '40px'
                                }}>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#64748b',
                                        lineHeight: 1.7,
                                        margin: 0
                                    }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
