'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '9779862157864';

const QUICK_STARTERS = [
  { label: 'Unlisted subscription', text: 'Subscription: ' },
  { label: 'Specific region card', text: 'Gift card & region: ' },
  { label: 'Custom amount', text: 'Product & custom amount: ' },
];

interface CustomRequestSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export default function CustomRequestSection({ sectionRef }: CustomRequestSectionProps) {
  const [requestText, setRequestText] = useState('');
  const [error, setError] = useState('');
  const [sentNotice, setSentNotice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = requestText.trim();
    if (!trimmed) {
      setError('Please describe the product, region, or amount you need.');
      setSentNotice(false);
      textareaRef.current?.focus();
      return;
    }

    setError('');
    const waMessage = `Hi Gamakay! I have a custom request:\n\n${trimmed}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentNotice(true);
  };

  const handleStarterClick = (prefix: string) => {
    setError('');
    setSentNotice(false);
    setRequestText((prev) => {
      const cleaned = prev.trim();
      if (!cleaned) return prefix;
      return `${cleaned}\n${prefix}`;
    });
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section
      id="custom-request"
      ref={sectionRef}
      className="tone-dark custom-request-band"
      aria-labelledby="custom-request-heading"
    >
      <div className="container">
        <div className="custom-request-grid">
          {/* Left: Editorial copy */}
          <div className="custom-request-copy">
            <span className="custom-request-kicker">Custom orders</span>
            <h2
              id="custom-request-heading"
              className="font-display custom-request-heading"
            >
              Have a custom request?
            </h2>
            <p className="custom-request-sub">
              Need an unlisted subscription, a specific country gift card, or a custom denomination? Write what you&apos;re looking for and send it straight to us on WhatsApp.
            </p>
            <Link href="/track" className="custom-request-track-link">
              <span>Already ordered? Track your order</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right: Clean WhatsApp request composer */}
          <form onSubmit={handleSubmit} noValidate className="custom-request-card">
            <div className="custom-request-label-row">
              <label htmlFor="custom-request-input" className="custom-request-label">
                Describe what you need
              </label>
              <span className="tabular-nums custom-request-count" aria-live="polite">
                {requestText.length}/500
              </span>
            </div>

            <textarea
              ref={textareaRef}
              id="custom-request-input"
              name="customRequest"
              rows={3}
              maxLength={500}
              value={requestText}
              onChange={(e) => {
                setRequestText(e.target.value);
                if (error) setError('');
                if (sentNotice) setSentNotice(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. a specific VPN plan, Adobe Creative Cloud yearly, or a Udemy course link..."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'custom-request-error' : 'custom-request-hint'}
              className="custom-request-textarea"
            />

            {/* Quick starter pills */}
            <div className="custom-request-starters" aria-label="Quick request starters">
              {QUICK_STARTERS.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => handleStarterClick(starter.text)}
                  className="custom-request-pill"
                >
                  + {starter.label}
                </button>
              ))}
            </div>

            {error && (
              <p id="custom-request-error" role="alert" className="custom-request-error">
                {error}
              </p>
            )}

            <div className="custom-request-actions">
              <div id="custom-request-hint" className="custom-request-meta">
                {sentNotice ? (
                  <span style={{ color: '#4ADE80', fontWeight: 500 }}>
                    WhatsApp opened with your message.
                  </span>
                ) : (
                  <span>Usually replies in 5–15 min</span>
                )}
                {requestText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRequestText('');
                      setError('');
                      setSentNotice(false);
                      textareaRef.current?.focus();
                    }}
                    className="custom-request-clear"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button type="submit" className="btn btn-whatsapp btn-lg custom-request-submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send through WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .custom-request-band {
          background: #141413;
          border-top: 1px solid rgba(248, 247, 242, 0.08);
          padding: clamp(56px, 6.5vw, 88px) 0;
        }
        .custom-request-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (min-width: 900px) {
          .custom-request-grid {
            grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
            gap: clamp(40px, 5vw, 72px);
          }
        }
        .custom-request-copy {
          min-width: 0;
        }
        .custom-request-kicker {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #9E9B93;
          margin-bottom: 10px;
        }
        .custom-request-heading {
          color: #F8F7F2;
          font-size: clamp(1.85rem, 3.1vw, 2.55rem);
          line-height: 1.08;
          letter-spacing: -0.038em;
          margin-bottom: 12px;
        }
        .custom-request-sub {
          font-size: 0.96rem;
          color: #B6B3AB;
          line-height: 1.62;
          max-width: 440px;
          margin-bottom: 22px;
        }
        .custom-request-track-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #D4D1C8;
          text-decoration: none;
          padding-bottom: 3px;
          border-bottom: 1px solid rgba(248, 247, 242, 0.24);
          transition: color 0.16s ease, border-color 0.16s ease;
        }
        .custom-request-track-link:hover {
          color: #F8F7F2;
          border-color: #F8F7F2;
        }
        .custom-request-track-link svg {
          transition: transform 0.16s ease;
        }
        .custom-request-track-link:hover svg {
          transform: translateX(3px);
        }

        .custom-request-card {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(248, 247, 242, 0.12);
          border-radius: 20px;
          padding: clamp(18px, 2.6vw, 26px);
          min-width: 0;
        }
        .custom-request-label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .custom-request-label {
          font-size: 0.84rem;
          font-weight: 600;
          color: #F8F7F2;
          letter-spacing: -0.01em;
        }
        .custom-request-count {
          font-size: 0.76rem;
          color: #8E8B83;
        }
        .custom-request-textarea {
          width: 100%;
          min-height: 96px;
          padding: 13px 15px;
          border-radius: 14px;
          border: 1px solid rgba(248, 247, 242, 0.16);
          background: #1B1B19;
          color: #F8F7F2;
          font-family: inherit;
          font-size: 0.94rem;
          line-height: 1.55;
          resize: vertical;
          transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
        }
        .custom-request-textarea::placeholder {
          color: #8E8B83;
        }
        .custom-request-textarea:hover {
          border-color: rgba(248, 247, 242, 0.28);
        }
        .custom-request-textarea:focus {
          outline: none;
          border-color: #F4CE16;
          box-shadow: 0 0 0 3px rgba(244, 206, 22, 0.18);
          background: #1F1F1D;
        }
        .custom-request-textarea[aria-invalid="true"] {
          border-color: #F87171;
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.18);
        }

        .custom-request-starters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .custom-request-pill {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(248, 247, 242, 0.14);
          background: rgba(248, 247, 242, 0.04);
          color: #D4D1C8;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .custom-request-pill:hover {
          background: rgba(248, 247, 242, 0.1);
          border-color: rgba(248, 247, 242, 0.28);
          color: #F8F7F2;
        }
        .custom-request-pill:focus-visible {
          outline: 2px solid #F4CE16;
          outline-offset: 2px;
        }

        .custom-request-error {
          margin: 10px 0 0;
          font-size: 0.82rem;
          color: #FCA5A5;
          font-weight: 500;
        }

        .custom-request-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(248, 247, 242, 0.08);
        }
        .custom-request-meta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          color: #9E9B93;
        }
        .custom-request-clear {
          background: none;
          border: none;
          padding: 2px 4px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          color: #D4D1C8;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
        }
        .custom-request-clear:hover {
          color: #F8F7F2;
        }
        .custom-request-submit {
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .custom-request-actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .custom-request-submit {
            width: 100%;
          }
          .custom-request-meta {
            justify-content: space-between;
          }
        }
      `}</style>
    </section>
  );
}
