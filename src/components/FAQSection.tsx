'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: "How do I buy from Gamakay?",
        answer: "Pick your gift card and amount, add it to your cart, and head to checkout. Put in your phone number to get an order number, then send the pre-filled message on WhatsApp or Viber. Once you send your payment screenshot, we reply with your code right in chat."
    },
    {
        question: "How long does delivery take?",
        answer: "Most codes are sent within 5 to 15 minutes on WhatsApp. During busy hours or for certain regional denominations, it can take 1 to 24 hours depending on stock."
    },
    {
        question: "How does checkout work?",
        answer: "Place your order with your WhatsApp or Viber number to get an order code. We send the details right in chat and deliver your code as soon as your order is confirmed."
    },
    {
        question: "How do I check if a card works with my account?",
        answer: "Every product lists its region (US, India, or Global). Make sure your Apple ID, PlayStation, Steam, or Nintendo account matches that region before ordering. If you aren't sure, just ask us on WhatsApp first."
    },
    {
        question: "What is your refund policy?",
        answer: "If there is an issue on our end before delivery, you get a full refund. Once a digital code has been delivered, it cannot be refunded, and we cannot refund orders bought for the wrong account region."
    },
    {
        question: "How do I track my order?",
        answer: "Go to the Track Order page and enter the phone number you used at checkout. It opens WhatsApp with your details filled in so we can reply with your order status right away."
    }
];

export default function FAQSection({ background = '#F8F7F2' }: { background?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <section
            className="section-band"
            style={{
                background,
                borderTop: background === '#EFEDE6' ? '1px solid #E8E5DC' : undefined,
            }}
        >
            <div className="container">
                <div className="faq-layout">
                    {/* Left Column */}
                    <div className="faq-intro">
                        <span className="section-kicker">FAQ</span>
                        <h2 className="font-display" style={{ marginBottom: '14px' }}>
                            Common questions
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#595751', maxWidth: '340px', marginBottom: '24px' }}>
                            Quick answers about payment, account regions, and how fast you get your code.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            <Link href="/guides" className="btn btn-outline btn-sm">
                                Redemption Guides
                            </Link>
                            <Link href="/support" className="btn btn-outline btn-sm">
                                Store Policies
                            </Link>
                        </div>
                    </div>

                    {/* Right Hairline Accordion */}
                    <div>
                        {FAQ_ITEMS.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className="faq-item">
                                    <button
                                        type="button"
                                        className="faq-trigger"
                                        onClick={() => toggleFAQ(index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span
                                            className="faq-question"
                                            style={{
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.4,
                                                transition: 'opacity 0.16s ease',
                                            }}
                                        >
                                            {faq.question}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '9999px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#181818',
                                                flexShrink: 0,
                                                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </span>
                                    </button>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateRows: isOpen ? '1fr' : '0fr',
                                            transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{
                                                paddingBottom: '22px',
                                                paddingRight: '32px',
                                                fontSize: '0.92rem',
                                                color: '#57524E',
                                                lineHeight: 1.68,
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
            </div>
        </section>
    );
}
