'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  gaming:        { label: 'Gaming',        color: '#15803D', bg: '#ECFDF5' },
  streaming:     { label: 'Streaming',     color: '#B91C1C', bg: '#FEF2F2' },
  software:      { label: 'Software',      color: '#1D4ED8', bg: '#EFF6FF' },
  subscriptions: { label: 'Subscriptions', color: '#92400E', bg: '#FEFCE8' },
};

const HOW_IT_WORKS = [
  {
    num: '1',
    title: 'Add to Cart',
    desc: 'Choose an amount and add it to your cart.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Make Payment',
    desc: 'Pay securely via eSewa or Bank Transfer.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Get Your Code',
    desc: 'Receive your code instantly via WhatsApp.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
];

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductPageClient({ product, related }: Props) {
  const { addItem } = useCart();
  const [selectedDenom, setSelectedDenom] = useState(product.denominations[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const catMeta = CATEGORY_META[product.category] ?? { label: product.category, color: 'var(--text-secondary)', bg: 'var(--bg-secondary)' };
  const waMessage = encodeURIComponent(`Hi! I want to order: ${product.name} — ${selectedDenom.value} (Rs. ${selectedDenom.price})`);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, selectedDenom);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <>
      <style>{`
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .pdp-grid {
            grid-template-columns: 380px 1fr;
            gap: 48px;
          }
        }
        @media (min-width: 1024px) {
          .pdp-grid {
            grid-template-columns: 420px 1fr;
            gap: 56px;
          }
        }
        .pdp-image-wrap {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          overflow: hidden;
          background: var(--bg-secondary);
          box-shadow: var(--shadow-xl);
        }
        @media (min-width: 768px) {
          .pdp-image-wrap {
            max-width: none;
            position: sticky;
            top: 130px;
          }
        }
        .pdp-dropdown-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .pdp-dropdown-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }
        .pdp-meta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .pdp-meta-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px 40px;
          }
        }
        .pdp-check-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
        }
        .pdp-cta-btn {
          width: 100%;
          padding: 15px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          transition: all var(--transition-fast);
          text-decoration: none;
          cursor: pointer;
          border: 1.5px solid transparent;
        }
        .pdp-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .pdp-steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: 'var(--header-height, 110px)', color: 'var(--text-primary)' }}>
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '28px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Home</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href={`/category/${product.category}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'capitalize', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{catMeta.label}</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
          </nav>

          {/* ── Main Grid ── */}
          <div className="pdp-grid">

            {/* LEFT: Image */}
            <div>
              <div className="pdp-image-wrap">
                {product.image_url && !imageError ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 420px"
                    style={{ objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem', fontWeight: 800, color: 'var(--text-muted)',
                    background: 'var(--bg-secondary)',
                  }}>
                    {product.brand.toUpperCase().slice(0, 2)}
                  </div>
                )}


              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

              {/* Title row */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {product.brand}
                </p>
                <h1 style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 900, color: 'var(--text-primary)',
                  letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0,
                  textTransform: 'uppercase',
                }}>
                  {product.name}
                </h1>
              </div>

              {/* Denomination & Region dropdowns */}
              <div className="pdp-dropdown-grid" style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  {product.region || 'Global'} Region
                </div>

                <div style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '12px 36px 12px 14px',
                  transition: 'border-color var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#111111'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <select
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#111111', fontSize: '0.9rem', fontWeight: 700, appearance: 'none', outline: 'none', cursor: 'pointer' }}
                    value={selectedDenom.value}
                    onChange={(e) => {
                      const denom = product.denominations.find(d => d.value === e.target.value);
                      if (denom) setSelectedDenom(denom);
                    }}
                  >
                    {product.denominations.map(d => (
                      <option key={d.value} value={d.value} style={{ background: '#FFFFFF', color: '#111111' }}>
                        {d.value}
                      </option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>

              {/* In Stock badge */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{
                  background: '#EAF6F0', color: '#2B8D56',
                  fontSize: '0.72rem', fontWeight: 800, padding: '6px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>In Stock</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rs.</span>
                <span style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                  fontWeight: 900, color: 'var(--text-primary)',
                  letterSpacing: '-0.04em', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {selectedDenom.price.toLocaleString()}
                </span>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '32px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="pdp-cta-btn"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    background: isAdding ? '#16A34A' : '#111111',
                    color: '#FFFFFF',
                    cursor: isAdding ? 'default' : 'pointer',
                    borderRadius: '6px',
                    padding: 'clamp(10px, 2vw, 16px) clamp(8px, 1.5vw, 24px)',
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.85rem)',
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => { if (!isAdding) { e.currentTarget.style.background = '#333333'; }}}
                  onMouseLeave={(e) => { if (!isAdding) { e.currentTarget.style.background = '#111111'; }}}
                >
                  {isAdding ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ADDED TO CART
                    </>
                  ) : (
                    <>
                      ADD TO CART
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/9779862157864?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="pdp-cta-btn"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    border: '1px solid #B6D8B6',
                    background: '#F9FDF9', color: '#25D366',
                    borderRadius: '6px',
                    padding: 'clamp(10px, 2vw, 16px) clamp(8px, 1.5vw, 24px)',
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.85rem)',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F9F0'; e.currentTarget.style.borderColor = '#25D366'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F9FDF9'; e.currentTarget.style.borderColor = '#B6D8B6'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  ORDER ON WHATSAPP
                </a>
              </div>

              {/* Checklist */}
              <div className="pdp-check-grid" style={{ marginBottom: '24px' }}>
                {[
                  { label: 'In Stock', ok: true },
                  { label: 'Can activate in Nepal', ok: true },
                  { label: 'Digital Key Code', ok: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Activation link */}
              <a href="#product-details" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '24px', display: 'inline-block', borderBottom: '1px dashed var(--border-color)', paddingBottom: '2px', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                Click here for activation instructions and more info
              </a>

              {/* Divider */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

              {/* Metadata Table */}
              <div className="pdp-meta-grid" style={{ fontSize: '0.8rem' }}>
                {[
                  { label: 'Publisher', value: product.brand },
                  { label: 'Platform', value: catMeta.label },
                  { label: 'Region', value: product.region || 'Global' },
                  { label: 'Delivery', value: `${product.delivery_type} Delivery` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Product Description ── */}
          {product.description && (
            <div style={{ marginTop: '64px', maxWidth: '800px' }} id="product-details">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                Product Details
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {product.description}
              </div>
            </div>
          )}

          {/* ── How It Works ── */}
          <div style={{
            marginTop: '56px',
            padding: 'clamp(28px, 4vw, 44px)',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-color)',
          }} id="how-it-works">
            <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '28px', letterSpacing: '-0.02em' }}>
              Get your code in 3 steps
            </h2>
            <div className="pdp-steps-grid">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.82rem', fontWeight: 700, flexShrink: 0,
                    }}>{step.num}</div>
                    <div style={{ color: 'var(--color-green)' }}>{step.icon}</div>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{step.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div style={{ marginTop: '72px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '2px solid var(--border-color)', paddingBottom: '14px' }}>
                <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>You May Also Like</h2>
                <Link href={`/category/${product.category}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  View All
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="product-grid">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
