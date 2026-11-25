'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/supabase';
import { getDisplayRegion, cleanProductDescription } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import CustomAmountSelector from '@/components/CustomAmountSelector';

const CATEGORY_LABELS: Record<string, string> = {
  gaming: 'Gaming',
  streaming: 'Streaming',
  software: 'Software & AI',
  'dating-social': 'Dating & Social',
  subscriptions: 'Subscriptions',
};

interface Props {
  product: Product;
  related: Product[];
}

function parseDescription(raw?: string) {
  const cleaned = cleanProductDescription(raw);
  if (!cleaned) return { intro: [] as string[], bullets: [] as string[], steps: [] as string[], note: '' };

  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  const intro: string[] = [];
  const bullets: string[] = [];
  const steps: string[] = [];
  let note = '';

  for (const line of lines) {
    if (/^(what's included|how to redeem|features included):?$/i.test(line)) continue;
    if (line.startsWith('•') || line.startsWith('- ')) {
      bullets.push(line.replace(/^[•\-]\s*/, ''));
    } else if (/^\d+\.\s+/.test(line)) {
      steps.push(line.replace(/^\d+\.\s+/, ''));
    } else if (bullets.length > 0 || steps.length > 0) {
      note = note ? `${note} ${line}` : line;
    } else {
      intro.push(line);
    }
  }

  return { intro, bullets, steps, note };
}

export default function ProductPageClient({ product, related }: Props) {
  const router = useRouter();
  const { addItem, isDrawerOpen, lastAdded } = useCart();

  const customCfg = product.custom_amount;
  const [selectedDenom, setSelectedDenom] = useState(product.denominations[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customRaw, setCustomRaw] = useState('');
  const [customError, setCustomError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const primaryActionsRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const displayRegion = getDisplayRegion(product);
  const inStock = product.in_stock ?? true;
  const hasMultipleOptions = product.denominations.length > 1 || Boolean(customCfg);

  const parsedCustomAmount = customRaw.trim() === '' ? NaN : Number(customRaw.trim());
  const isCustomValid = Boolean(
    customCfg &&
    Number.isInteger(parsedCustomAmount) &&
    parsedCustomAmount >= customCfg.min &&
    parsedCustomAmount <= customCfg.max
  );
  const customPrice = isCustomValid && customCfg ? Math.round(parsedCustomAmount * customCfg.rate) : 0;

  const activeDenom =
    isCustomMode && customCfg
      ? {
          value: isCustomValid
            ? `${customCfg.currency_symbol}${parsedCustomAmount.toLocaleString()}`
            : `Custom ${customCfg.currency_label}`,
          price: customPrice,
        }
      : selectedDenom;

  const isStandardOption = activeDenom.value.trim().toLowerCase() === 'standard';
  const totalPrice = activeDenom.price * quantity;
  const canPurchase = inStock && (!isCustomMode || isCustomValid);
  const parsed = useMemo(() => parseDescription(product.description), [product.description]);

  // If user arrived via #custom-amount link from a catalog card, activate custom mode cleanly
  useEffect(() => {
    if (!customCfg || typeof window === 'undefined') return;
    if (window.location.hash === '#custom-amount') {
      setIsCustomMode(true);
      requestAnimationFrame(() => customInputRef.current?.focus());
    }
  }, [customCfg]);

  // Show compact sticky purchase bar on mobile once main Buy button scrolls out of view
  useEffect(() => {
    const el = primaryActionsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const waMessage = encodeURIComponent(
    `Hi! I want to order: ${product.name}${!isStandardOption ? ` (${activeDenom.value})` : ''}${quantity > 1 ? ` x${quantity}` : ''}${totalPrice > 0 ? ` - Rs. ${totalPrice.toLocaleString()}` : ''}`
  );

  const validateCustomBeforeAction = (): boolean => {
    if (!isCustomMode || !customCfg) return true;
    if (isCustomValid) {
      setCustomError('');
      return true;
    }
    setCustomError(
      `Enter a whole amount between ${customCfg.currency_symbol}${customCfg.min.toLocaleString()} and ${customCfg.currency_symbol}${customCfg.max.toLocaleString()}.`
    );
    customInputRef.current?.focus();
    return false;
  };

  const handleAddToCart = () => {
    if (isAdding || !inStock) return;
    if (!validateCustomBeforeAction()) return;
    setIsAdding(true);
    addItem(product, activeDenom, quantity);
    setTimeout(() => setIsAdding(false), 950);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    if (!validateCustomBeforeAction()) return;
    addItem(product, activeDenom, quantity);
    router.push('/checkout');
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: 'var(--header-height)' }}>
      <div className="container pdp-container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#635D57',
            marginBottom: '26px',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="pdp-crumb-link">Home</Link>
          <span aria-hidden="true" style={{ opacity: 0.45 }}>/</span>
          <Link href={`/category/${product.category}`} className="pdp-crumb-link">{categoryLabel}</Link>
          <span aria-hidden="true" style={{ opacity: 0.45 }}>/</span>
          <span style={{ color: '#181818', fontWeight: 500 }}>{product.name}</span>
        </nav>

        {/* Main 2-Column Purchase Layout */}
        <div className="pdp-grid">
          {/* LEFT: Sticky Framed Artwork + Reassurance Strip */}
          <div className="pdp-media-col">
            <div className="pdp-media-frame">
              {product.image_url && !imageError ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 840px) 92vw, 460px"
                  style={{ objectFit: 'cover' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                  fontWeight: 600,
                  color: '#635D57',
                  background: '#EFEDE6',
                }}>
                  {product.brand.toUpperCase().slice(0, 2)}
                </div>
              )}
            </div>

            {/* Quiet Desktop Reassurance Strip Beneath Artwork */}
            <div className="pdp-media-meta hide-mobile">
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#181818' }}>Direct Delivery</div>
                <div style={{ fontSize: '0.74rem', color: '#66635B', marginTop: '2px' }}>Sent on WhatsApp &amp; Viber</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#181818' }}>Fast Turnaround</div>
                <div style={{ fontSize: '0.74rem', color: '#66635B', marginTop: '2px' }}>Usually 5–15 minutes</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#181818' }}>Verified Codes</div>
                <div style={{ fontSize: '0.74rem', color: '#66635B', marginTop: '2px' }}>Redemption help included</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Clean Architectural Purchase Interface */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
            {/* Header & Clean Typographic Metadata */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '10px',
                fontSize: '0.82rem',
                color: '#635D57',
                fontWeight: 500,
              }}>
                <span style={{ color: '#181818', fontWeight: 600 }}>{product.brand}</span>
                <span aria-hidden="true" style={{ opacity: 0.35 }}>·</span>
                <span>{displayRegion} region</span>
                {!inStock && (
                  <>
                    <span aria-hidden="true" style={{ opacity: 0.35 }}>·</span>
                    <span style={{ color: '#B91C1C', fontWeight: 600 }}>Out of stock</span>
                  </>
                )}
              </div>

              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(1.85rem, 3.4vw, 2.75rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.035em',
                  marginBottom: '14px',
                }}
              >
                {product.name}
              </h1>

              {/* Active Price Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                {isCustomMode && !isCustomValid ? (
                  <span style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.7rem)', fontWeight: 600, color: '#635D57', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                    Enter custom {customCfg?.currency_label} amount
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#635D57' }}>Rs.</span>
                    <span
                      key={`${activeDenom.value}-${totalPrice}`}
                      className="tabular-nums price-tick"
                      style={{
                        fontSize: 'clamp(2rem, 3.8vw, 2.65rem)',
                        fontWeight: 700,
                        color: '#181818',
                        letterSpacing: '-0.035em',
                        lineHeight: 1,
                      }}
                    >
                      {totalPrice.toLocaleString()}
                    </span>
                    {!isStandardOption && (
                      <span style={{ fontSize: '0.88rem', color: '#635D57', fontWeight: 500, marginLeft: '4px' }}>
                        / {activeDenom.value}
                      </span>
                    )}
                    {quantity > 1 && (
                      <span className="tabular-nums" style={{ fontSize: '0.8rem', color: '#635D57', marginLeft: '6px' }}>
                        ({quantity} × Rs. {activeDenom.price.toLocaleString()})
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* PlayStation India Low-Stock Notice (authentic product-specific notice) */}
            {product.id === '2' && (
              <div style={{
                background: '#FFFBEB',
                border: '1px solid rgba(146, 64, 14, 0.22)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#92400E', marginBottom: '2px' }}>
                    High demand, limited stock
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                    PlayStation India gift cards are currently in low stock. Please avoid placing duplicate orders so we can fulfill yours faster.
                  </p>
                </div>
              </div>
            )}

            {/* Option Selector (Multi-Option Grid) OR Clean Single-Plan Summary Row with Quantity */}
            {hasMultipleOptions ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818' }}>
                    Choose amount
                  </span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#635D57' }}>Qty</span>
                    <div className="pdp-qty-stepper">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="pdp-qty-btn"
                      >
                        −
                      </button>
                      <span className="tabular-nums pdp-qty-val">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                        disabled={quantity >= 10}
                        aria-label="Increase quantity"
                        className="pdp-qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Choose amount"
                  className="pdp-denom-grid"
                  data-wide={product.denominations.some((d) => d.value.length > 10)}
                >
                  {product.denominations.map((denom) => {
                    const active = !isCustomMode && denom.value === selectedDenom.value;
                    return (
                      <button
                        key={denom.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setSelectedDenom(denom);
                          setIsCustomMode(false);
                          setCustomError('');
                        }}
                        className="pdp-denom-tile"
                        data-active={active}
                      >
                        <div style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}>
                          <span style={{ fontSize: '0.96rem', fontWeight: 600, letterSpacing: '-0.015em' }}>
                            {denom.value}
                          </span>
                          <span className="pdp-denom-check" aria-hidden="true">
                            {active && (
                              <svg className="check-draw" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            color: active ? 'rgba(250, 246, 240, 0.8)' : '#635D57',
                          }}
                        >
                          Rs. {denom.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom INR Amount Composer (Apple India / Steam India) */}
                {customCfg && (
                  <CustomAmountSelector
                    config={customCfg}
                    isActive={isCustomMode}
                    rawValue={customRaw}
                    isValid={isCustomValid}
                    calculatedPrice={customPrice}
                    error={customError}
                    inputRef={customInputRef}
                    onActivate={() => setIsCustomMode(true)}
                    onChangeValue={(digitsOnly) => {
                      setCustomRaw(digitsOnly);
                      setIsCustomMode(true);
                      if (customError) setCustomError('');
                    }}
                  />
                )}
              </div>
            ) : (
              /* Clean Single-Option Bar with Integrated Quantity Stepper (No lonely black tile!) */
              <div className="pdp-single-plan-bar">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.74rem', color: '#635D57', fontWeight: 500, marginBottom: '2px' }}>
                    Included option
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#181818' }}>
                    {isStandardOption ? 'Digital gift card code' : selectedDenom.value}
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.8rem', color: '#635D57', fontWeight: 500 }}>Quantity</span>
                  <div className="pdp-qty-stepper" style={{ background: '#FFFFFF' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="pdp-qty-btn"
                    >
                      −
                    </button>
                    <span className="tabular-nums pdp-qty-val">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      className="pdp-qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Purchase CTAs — Clean Two-Button Row + Subtle Direct WhatsApp Link */}
            <div ref={primaryActionsRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="pdp-actions-row">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="btn btn-accent btn-lg"
                  style={{ width: '100%' }}
                >
                  {canPurchase ? `Buy Now · Rs. ${totalPrice.toLocaleString()}` : 'Buy Now'}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || !inStock}
                  className="btn btn-secondary btn-lg"
                  style={{
                    width: '100%',
                    background: isAdding ? '#11663A' : undefined,
                    color: isAdding ? '#FFFFFF' : undefined,
                    borderColor: isAdding ? '#11663A' : undefined,
                  }}
                >
                  {isAdding ? (
                    <>
                      <svg className="check-draw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>

              <a
                href={`https://wa.me/9779862157864?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!validateCustomBeforeAction()) e.preventDefault();
                }}
                className="pdp-whatsapp-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order directly on WhatsApp
              </a>
            </div>

            {/* Key Product Specs Card */}
            <div className="pdp-specs-card">
              <div>
                <div style={{ color: '#66635B', fontSize: '0.75rem', marginBottom: '3px' }}>Account Region</div>
                <div style={{ color: '#181818', fontWeight: 600, fontSize: '0.88rem' }}>{displayRegion}</div>
              </div>
              <div>
                <div style={{ color: '#66635B', fontSize: '0.75rem', marginBottom: '3px' }}>Delivery</div>
                <div style={{ color: '#181818', fontWeight: 600, fontSize: '0.88rem' }}>WhatsApp &amp; Viber</div>
              </div>
              <div>
                <div style={{ color: '#66635B', fontSize: '0.75rem', marginBottom: '3px' }}>Turnaround</div>
                <div style={{ color: '#181818', fontWeight: 600, fontSize: '0.88rem' }}>5–15 minutes</div>
              </div>
              <div>
                <div style={{ color: '#66635B', fontSize: '0.75rem', marginBottom: '3px' }}>Redemption Help</div>
                <Link href="/guides" style={{ color: '#181818', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  View step-by-step guide
                </Link>
              </div>
            </div>

            {/* Region Check Reminder */}
            <p style={{ fontSize: '0.8rem', color: '#635D57', lineHeight: 1.55, margin: 0 }}>
              Make sure your account matches the <strong style={{ color: '#181818', fontWeight: 600 }}>{displayRegion}</strong> region before ordering. Digital codes can&apos;t be refunded once sent.
            </p>
          </div>
        </div>

        {/* Structured Details & Redemption Section */}
        <section
          id="product-details"
          style={{
            marginTop: '64px',
            paddingTop: '48px',
            borderTop: '1px solid rgba(24, 22, 21, 0.1)',
          }}
        >
          <div className="pdp-details-grid">
            <div>
              <span className="section-kicker">Overview</span>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.15rem)', marginBottom: '16px' }}>
                Details &amp; how to redeem
              </h2>
              {parsed.intro.length > 0 ? (
                parsed.intro.map((para, i) => (
                  <p key={i} style={{ fontSize: '0.96rem', color: '#57524E', lineHeight: 1.7, marginBottom: '14px' }}>
                    {para}
                  </p>
                ))
              ) : (
                <p style={{ fontSize: '0.96rem', color: '#595751', lineHeight: 1.7, marginBottom: '14px' }}>
                  Order {product.name} and receive your digital code or activation details directly on WhatsApp or Viber, usually within 5 to 15 minutes after confirmation.
                </p>
              )}
              {parsed.note && (
                <p style={{ fontSize: '0.88rem', color: '#635D57', lineHeight: 1.65 }}>
                  {parsed.note}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {parsed.bullets.length > 0 && (
                <div className="surface-card" style={{ padding: '22px 24px' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 600, marginBottom: '14px', color: '#181818' }}>
                    What is included
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {parsed.bullets.map((b, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#57524E', lineHeight: 1.55 }}>
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '9999px',
                          background: '#EFEDE6',
                          color: '#181818',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="surface-card" style={{ padding: '22px 24px' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 600, marginBottom: '14px', color: '#181818' }}>
                  {parsed.steps.length > 0 ? 'How to redeem' : 'How ordering works'}
                </h3>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(parsed.steps.length > 0
                    ? parsed.steps
                    : [
                        `Select ${product.name} and continue to checkout with your WhatsApp or Viber number.`,
                        'Send your pre-filled order message in chat to confirm.',
                        'Receive your digital code or activation details on WhatsApp or Viber within 5–15 minutes.',
                      ]
                  ).map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem', color: '#57524E', lineHeight: 1.55 }}>
                      <span
                        className="tabular-nums"
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '9999px',
                          background: '#181818',
                          color: '#FAF6F0',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid rgba(24, 22, 21, 0.1)' }}>
            <div className="section-header-bar">
              <div>
                <span className="section-kicker">More in {categoryLabel}</span>
                <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.15rem)' }}>
                  You may also like
                </h2>
              </div>
              <Link href={`/category/${product.category}`} className="section-link">
                View all {categoryLabel.toLowerCase()}
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Purchase Bar (appears cleanly once user scrolls past CTA) */}
      {inStock && showStickyBar && !isDrawerOpen && !lastAdded && (
        <div className="pdp-mobile-sticky-bar sticky-bar-enter safe-bottom" role="region" aria-label="Quick purchase">
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '0.76rem',
              color: '#635D57',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {product.name}{!isStandardOption ? ` · ${activeDenom.value}` : ''}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.08rem', fontWeight: 700, color: '#181818', letterSpacing: '-0.02em' }}>
              {canPurchase ? `Rs. ${totalPrice.toLocaleString()}` : 'Enter amount'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="btn btn-accent"
            style={{ flexShrink: 0, padding: '10px 22px', minHeight: '42px' }}
          >
            Buy Now
          </button>
        </div>
      )}

      <style>{`
        .pdp-container {
          padding-top: 28px;
          padding-bottom: 92px;
        }
        .pdp-crumb-link {
          color: #635D57;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .pdp-crumb-link:hover {
          color: #181818;
        }
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        @media (min-width: 840px) {
          .pdp-grid {
            grid-template-columns: 420px 1fr;
            gap: 54px;
            align-items: start;
          }
        }
        @media (min-width: 1120px) {
          .pdp-grid {
            grid-template-columns: 468px 1fr;
            gap: 64px;
          }
        }
        .pdp-media-col {
          width: 100%;
          max-width: 468px;
          margin: 0 auto;
        }
        @media (min-width: 840px) {
          .pdp-media-col {
            position: sticky;
            top: calc(var(--header-height) + 28px);
          }
        }
        .pdp-media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 22px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(24, 22, 21, 0.08);
          box-shadow: var(--shadow-lg);
        }
        .pdp-media-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #EFEDE6;
          border: 1px solid #E8E5DC;
          text-align: left;
        }

        /* Quantity Stepper */
        .pdp-qty-stepper {
          display: inline-flex;
          align-items: center;
          background: #EFEDE6;
          border: 1px solid rgba(24, 22, 21, 0.08);
          border-radius: 9999px;
          padding: 2px;
        }
        .pdp-qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #181818;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.14s ease, opacity 0.14s ease;
        }
        .pdp-qty-btn:hover:not(:disabled) {
          background: rgba(24, 22, 21, 0.08);
        }
        .pdp-qty-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .pdp-qty-val {
          min-width: 26px;
          text-align: center;
          font-size: 0.86rem;
          font-weight: 600;
          color: #181818;
        }

        /* Single-Option Summary Row */
        .pdp-single-plan-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 14px 18px;
          border-radius: 16px;
          background: #EFEDE6;
          border: 1px solid #E8E5DC;
        }

        /* Multi-Option Denomination Grid */
        .pdp-denom-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        @media (min-width: 520px) {
          .pdp-denom-grid {
            grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
          }
          .pdp-denom-grid[data-wide="true"] {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .pdp-denom-tile {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 5px;
          min-height: 66px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(24, 22, 21, 0.12);
          background: #FFFFFF;
          color: #181818;
          font-family: inherit;
          cursor: pointer;
          transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;
          text-align: left;
        }
        .pdp-denom-tile:hover {
          border-color: rgba(24, 22, 21, 0.32);
          background: #F7F5F0;
        }
        .pdp-denom-tile:active {
          transform: scale(0.98);
        }
        .pdp-denom-tile[data-active="true"] {
          background: #181818;
          border-color: #181818;
          color: #FAF6F0;
          box-shadow: 0 6px 18px rgba(24, 22, 21, 0.16);
        }
        .pdp-denom-check {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(24, 22, 21, 0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #181818;
          transition: background-color 0.16s ease, border-color 0.16s ease;
        }
        .pdp-denom-tile[data-active="true"] .pdp-denom-check {
          background: #F4CE16;
          border-color: #F4CE16;
          color: #181818;
          animation: badgePop 0.24s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }

        /* Custom INR Amount Selector Card */
        .pdp-custom-card {
          margin-top: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #EFEDE6;
          border: 1.5px solid #E2DED3;
          transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
          cursor: pointer;
        }
        .pdp-custom-card:hover {
          border-color: #C7C2B4;
        }
        .pdp-custom-card[data-active="true"] {
          background: #FFFFFF;
          border-color: #181818;
          box-shadow: 0 6px 18px rgba(24, 22, 21, 0.08);
          cursor: default;
        }
        .pdp-custom-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid rgba(24, 22, 21, 0.16);
          border-radius: 12px;
          padding: 4px 6px 4px 13px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .pdp-custom-input-wrap:focus-within {
          border-color: #181818;
          box-shadow: 0 0 0 3px rgba(244, 206, 22, 0.28);
        }
        .pdp-custom-input-wrap[data-invalid="true"] {
          border-color: #B91C1C;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
        }
        .pdp-custom-prefix {
          font-size: 1.05rem;
          font-weight: 700;
          color: #181818;
          flex-shrink: 0;
        }
        .pdp-custom-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: #181818;
          padding: 9px 4px;
          outline: none;
        }
        .pdp-custom-input::placeholder {
          color: #8A867D;
          font-weight: 400;
        }
        .pdp-custom-preview {
          padding: 6px 12px;
          border-radius: 9px;
          background: #EFEDE6;
          color: #181818;
          font-size: 0.84rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pdp-custom-card[data-active="true"] .pdp-custom-preview {
          background: #181818;
          color: #F8F7F2;
        }

        /* Purchase CTAs */
        .pdp-actions-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 520px) {
          .pdp-actions-row {
            grid-template-columns: 1.25fr 1fr;
          }
        }
        .pdp-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 9999px;
          border: 1px solid rgba(24, 22, 21, 0.12);
          background: #FFFFFF;
          color: #11663A;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: background-color 0.16s ease, border-color 0.16s ease;
        }
        .pdp-whatsapp-btn:hover {
          background: #F4F9F6;
          border-color: rgba(17, 102, 58, 0.32);
        }

        /* Specs Card */
        .pdp-specs-card {
          background: #EFEDE6;
          border: 1px solid #E8E5DC;
          border-radius: 16px;
          padding: 18px 20px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px 20px;
        }

        .pdp-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 840px) {
          .pdp-details-grid {
            grid-template-columns: 1fr 1.1fr;
            gap: 56px;
            align-items: start;
          }
        }

        /* Mobile Sticky Bottom Purchase Bar */
        .pdp-mobile-sticky-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 120;
          background: rgba(248, 247, 242, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid #E8E5DC;
          box-shadow: 0 -8px 24px rgba(24, 24, 24, 0.08);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        @media (min-width: 840px) {
          .pdp-mobile-sticky-bar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
