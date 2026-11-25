'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import FAQSection from '@/components/FAQSection';
import CustomRequestSection from '@/components/CustomRequestSection';
import BrandMarqueeStrip from '@/components/BrandMarqueeStrip';
import CampaignBannerCarousel from '@/components/CampaignBannerCarousel';
import HeroShowcaseSlider from '@/components/HeroShowcaseSlider';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
} from '@/lib/products';

const ALL_PRODUCTS = getAllProducts();
const POPULAR_PRODUCTS = getFeaturedProducts(12);
const GAMING_PRODUCTS = getProductsByCategory('gaming');
const STREAMING_PRODUCTS = getProductsByCategory('streaming');
const SOFTWARE_PRODUCTS = getProductsByCategory('software');
const DATING_SOCIAL_PRODUCTS = getProductsByCategory('dating-social');
const SUBSCRIPTIONS_PRODUCTS = getProductsByCategory('subscriptions');

type CatalogTab = 'popular' | 'gaming' | 'streaming' | 'software' | 'dating-social' | 'subscriptions';

const CATALOG_TABS: { id: CatalogTab; label: string; count: number; href: string }[] = [
  { id: 'popular',       label: 'Popular',         count: POPULAR_PRODUCTS.length,       href: '/category/all' },
  { id: 'gaming',        label: 'Gaming',          count: GAMING_PRODUCTS.length,        href: '/category/gaming' },
  { id: 'streaming',     label: 'Streaming',       count: STREAMING_PRODUCTS.length,     href: '/category/streaming' },
  { id: 'software',      label: 'Software & AI',   count: SOFTWARE_PRODUCTS.length,      href: '/category/software' },
  { id: 'dating-social', label: 'Dating & Social', count: DATING_SOCIAL_PRODUCTS.length, href: '/category/dating-social' },
  { id: 'subscriptions', label: 'Subscriptions',   count: SUBSCRIPTIONS_PRODUCTS.length, href: '/category/subscriptions' },
];

// Band A: Large 2-up (exact 2:1) feature pair directly under the widescreen carousel
const PROMO_ADS_PAIR = [
  {
    src: '/IMAGES/BANNERS/Playstation.webp',
    alt: 'PlayStation Plus Essential, Extra and Premium plans',
    cta: 'Shop PlayStation Plus',
    href: '/product/playstation-plus-for-playstations',
  },
  {
    src: '/IMAGES/BANNERS/Apple_Creator_studio.webp',
    alt: 'Apple Creator Studio apps and gift cards',
    cta: 'Shop Apple Creator Studio',
    href: '/product/apple-creator-studio',
  },
];

// Band B: 6-up (exact 2:1) brand showcase gallery
const PROMO_ADS_GALLERY = [
  {
    src: '/IMAGES/BANNERS/Steam.webp',
    alt: 'Steam Wallet gift cards US and India',
    cta: 'Shop Steam',
    href: '/product/steam-giftcards-us-india',
  },
  {
    src: '/IMAGES/BANNERS/Claude.webp',
    alt: 'Claude AI Pro by Anthropic subscription',
    cta: 'Shop Claude AI',
    href: '/product/claude-ai-anthropic',
  },
  {
    src: '/IMAGES/BANNERS/Crunchyroll.webp',
    alt: 'Crunchyroll Premium anime streaming',
    cta: 'Shop Crunchyroll',
    href: '/product/crunchyroll-premium',
  },
  {
    src: '/IMAGES/BANNERS/iCloud.webp',
    alt: 'Apple iCloud+ storage plans',
    cta: 'Shop iCloud+',
    href: '/product/icloud-storage',
  },
  {
    src: '/IMAGES/BANNERS/SuperGrok.webp',
    alt: 'Grok and X Premium subscription',
    cta: 'Shop Grok & X',
    href: '/product/grok-x-premium',
  },
  {
    src: '/IMAGES/BANNERS/AI.webp',
    alt: 'Claude, ChatGPT, Grok and Gemini AI subscriptions',
    cta: 'Shop AI Tools',
    href: '/category/software',
  },
];

// Exact 3:1 (1200x400) department banners + direct 1-click quick-product pills
const DEPARTMENT_BANNERS = [
  {
    title: 'Gaming',
    description: 'PlayStation, Steam, Xbox Game Pass, Nintendo eShop, and top-ups.',
    href: '/category/gaming',
    count: GAMING_PRODUCTS.length,
    banner: '/IMAGES/BANNERS/BANNER_FOR_GAMERS.webp',
    alt: 'For Gamers: PlayStation, Xbox, Steam, Apple, Switch and Google Play',
    shortcuts: [
      { label: 'PlayStation', href: '/product/playstation-giftcards-usd' },
      { label: 'Steam', href: '/product/steam-giftcards-us-india' },
      { label: 'Xbox Game Pass', href: '/product/xbox-gamepass-ultimate' },
    ],
  },
  {
    title: 'Software & AI',
    description: 'Claude, ChatGPT Plus, Cursor, Gemini, VPNs, and work tools.',
    href: '/category/software',
    count: SOFTWARE_PRODUCTS.length,
    banner: '/IMAGES/BANNERS/BANNER_FOR_BUILDERS.webp',
    alt: 'For Builders: AI coding and software tools',
    shortcuts: [
      { label: 'Claude AI', href: '/product/claude-ai-anthropic' },
      { label: 'ChatGPT Plus', href: '/product/chatgpt-plus' },
      { label: 'Cursor AI', href: '/search?q=cursor' },
    ],
  },
  {
    title: 'Streaming',
    description: 'Netflix, YouTube Premium, Crunchyroll, Spotify, and Apple Music.',
    href: '/category/streaming',
    count: STREAMING_PRODUCTS.length,
    banner: '/IMAGES/BANNERS/BANNER_FOR_SHOWS.webp',
    alt: 'For Shows: Netflix, Prime Video, YouTube and Crunchyroll',
    shortcuts: [
      { label: 'Netflix', href: '/product/netflix-monthly' },
      { label: 'Spotify', href: '/product/spotify-premium' },
      { label: 'Crunchyroll', href: '/product/crunchyroll-premium' },
    ],
  },
  {
    title: 'Apps & Subscriptions',
    description: 'Adobe, CapCut, Canva Pro, iCloud+, Coursera, Duolingo, and travel eSIMs.',
    href: '/category/subscriptions',
    count: SUBSCRIPTIONS_PRODUCTS.length,
    banner: '/IMAGES/BANNERS/BANNER_FOR_CREATORS.webp',
    alt: 'For Creators: Adobe, CapCut, HeyGen and Higgsfield',
    shortcuts: [
      { label: 'iCloud+', href: '/product/icloud-storage' },
      { label: 'Canva Pro', href: '/search?q=canva' },
      { label: 'Coursera Plus', href: '/product/coursera-plus' },
    ],
  },
  {
    title: 'Dating & Social',
    description: 'Tinder Gold & Platinum, Bumble, Hinge, Telegram Premium, Instagram, Snapchat+, and Meta One.',
    href: '/category/dating-social',
    count: DATING_SOCIAL_PRODUCTS.length,
    banner: '/IMAGES/BANNERS/Dating.webp',
    alt: 'Connections made easy: Tinder, Bumble, Tantan, Telegram and social media plans',
    featuredWide: true,
    shortcuts: [
      { label: 'Tinder Gold', href: '/product/tinder-gold' },
      { label: 'Telegram Premium', href: '/product/telegram-premium' },
      { label: 'Meta One', href: '/product/meta-one' },
      { label: 'Bumble', href: '/product/bumble-premium' },
    ],
  },
];

const STORE_PROOF_ROWS = [
  {
    metric: '5,000+',
    label: 'Codes delivered',
    detail: 'Verified digital gift cards and subscriptions sent straight to buyers.',
  },
  {
    metric: '4.6/5',
    label: 'Hamrobazar rating',
    detail: 'Public reviews built up from repeat buyers.',
  },
  {
    metric: '5–15 min',
    label: 'Typical delivery',
    detail: 'Sent right inside WhatsApp or Viber once your order is confirmed.',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<CatalogTab>('popular');
  const [expandedCatalog, setExpandedCatalog] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const supportStripRef = useRef<HTMLElement>(null);

  const activeList = useMemo(() => {
    switch (activeTab) {
      case 'gaming':        return GAMING_PRODUCTS;
      case 'streaming':     return STREAMING_PRODUCTS;
      case 'software':      return SOFTWARE_PRODUCTS;
      case 'dating-social': return DATING_SOCIAL_PRODUCTS;
      case 'subscriptions': return SUBSCRIPTIONS_PRODUCTS;
      case 'popular':
      default:              return POPULAR_PRODUCTS;
    }
  }, [activeTab]);

  const visibleProducts = useMemo(
    () => activeList.slice(0, activeTab === 'popular' || expandedCatalog ? 12 : 8),
    [activeList, activeTab, expandedCatalog]
  );

  const activeTabMeta = CATALOG_TABS.find(t => t.id === activeTab) ?? CATALOG_TABS[0];

  const handleTabChange = (tab: CatalogTab) => {
    setActiveTab(tab);
    setExpandedCatalog(false);
  };

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const pastHero = window.scrollY > 560;
        const nearBottom = supportStripRef.current
          ? supportStripRef.current.getBoundingClientRect().top < window.innerHeight + 80
          : false;
        setShowFab(pastHero && !nearBottom);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* 1. HERO: 50:50 Warm Alabaster Canvas with Strategic #F4CE16 Brand Accent */}
      <section className="hero-stage">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-split-grid">
            {/* Left 50%: Crisp Display Typography & Signature Yellow Primary CTA */}
            <div className="hero-split-copy">
              <h1 className="font-display hero-headline">
                <span className="hero-line-1" style={{ display: 'block' }}>Gift cards &amp;</span>
                <span className="hero-line-2" style={{ display: 'block' }}>subscriptions,</span>
                <span className="hero-line-3" style={{ display: 'block', whiteSpace: 'nowrap' }}>
                  sent <span className="hero-yellow-underline">in minutes.</span>
                </span>
              </h1>

              <p
                className="hero-rise-2 hero-subcopy"
              >
                Steam, PlayStation, Apple, Netflix, Spotify, and AI tools, delivered straight to your WhatsApp.
              </p>

              {/* Primary CTA Pair — Signature #F4CE16 Primary + Clean Neutral Secondary */}
              <div className="hero-cta-group hero-rise-3">
                <a href="#catalog" className="btn btn-accent btn-lg hero-cta-btn">
                  Shop Now
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <Link href="/category/all" className="btn btn-surface btn-lg hero-cta-btn">
                  Browse All
                </Link>
              </div>
            </div>

            {/* Right 50%: Sliding Banner Showcase */}
            <div className="hero-rise-4" style={{ minWidth: 0 }}>
              <HeroShowcaseSlider />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BRAND STRIP (#EFEDE6) — 1-Click Access to 14 Flagship Brands */}
      <BrandMarqueeStrip />

      {/* 3. INSTANT-BROWSE CATALOG (#F8F7F2) — Expandable Inline Storefront */}
      <section id="catalog" className="section-band" style={{ background: '#F8F7F2', scrollMarginTop: 'var(--header-height)' }}>
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-kicker">
                {ALL_PRODUCTS.length} items in stock
              </span>
              <h2 className="font-display">
                Shop gift cards
              </h2>
            </div>

            <Link href={activeTabMeta.href} className="section-link">
              See all {activeTab === 'popular' ? ALL_PRODUCTS.length : activeTabMeta.count} {activeTab === 'popular' ? 'items' : activeTabMeta.label.toLowerCase()}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* Interactive Category Tabs */}
          <div
            role="tablist"
            aria-label="Filter gift card category"
            className="filter-strip"
            style={{ marginBottom: '26px' }}
          >
            {CATALOG_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="filter-pill"
                  data-active={active}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '0.74rem',
                      opacity: active ? 0.78 : 0.7,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="product-grid product-grid-animate" key={activeTab}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Inline Expand (category tabs only) + Full Catalog Link */}
          <div style={{ marginTop: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {activeTab !== 'popular' && !expandedCatalog && activeList.length > 8 && (
              <button
                type="button"
                onClick={() => setExpandedCatalog(true)}
                className="btn btn-secondary btn-lg"
              >
                Show more {activeTabMeta.label.toLowerCase()}
              </button>
            )}
            <Link href="/category/all" className="btn btn-outline btn-lg">
              See all {ALL_PRODUCTS.length} products
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY (#EFEDE6) — Directly below Shop Gift Cards */}
      <ScrollReveal>
        <section id="categories" className="section-band" style={{ background: '#EFEDE6', borderTop: '1px solid #E8E5DC', borderBottom: '1px solid #E8E5DC' }}>
          <div className="container">
            <div className="section-header-bar">
              <div>
                <span className="section-kicker">Shop by category</span>
                <h2 className="font-display">Browse categories</h2>
              </div>
              <Link href="/category/all" className="section-link">
                View all
              </Link>
            </div>

            <div className="departments-grid sr-stagger">
              {DEPARTMENT_BANNERS.map((dept) => (
                <div
                  key={dept.href}
                  className={`dept-banner-card ${'featuredWide' in dept && dept.featuredWide ? 'dept-banner-card-wide' : ''}`}
                >
                  {/* Native banner artwork */}
                  <Link
                    href={dept.href}
                    className={`dept-banner-media ${'featuredWide' in dept && dept.featuredWide ? 'dept-banner-media-wide' : ''}`}
                    aria-label={dept.title}
                  >
                    <Image
                      src={dept.banner}
                      alt={dept.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Card Footer + Direct 1-Click Product Pills */}
                  <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <Link href={dept.href} style={{ textDecoration: 'none' }}>
                            <h3 className="font-display" style={{ fontSize: '1.22rem', color: '#181818' }}>
                              {dept.title}
                            </h3>
                          </Link>
                          <span
                            className="tabular-nums"
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              color: '#595751',
                              background: '#EFEDE6',
                              padding: '3px 9px',
                              borderRadius: '9999px',
                            }}
                          >
                            {dept.count} items
                          </span>
                        </div>
                        <p style={{ fontSize: '0.86rem', color: '#595751', lineHeight: 1.5 }}>
                          {dept.description}
                        </p>
                      </div>

                      <Link
                        href={dept.href}
                        aria-label={`Browse ${dept.title}`}
                        className="dept-arrow-btn"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>

                    {/* Direct 1-click product shortcuts */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                      {dept.shortcuts.map((sc) => (
                        <Link
                          key={sc.label}
                          href={sc.href}
                          className="dept-shortcut-pill"
                        >
                          {sc.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. POPULAR RIGHT NOW (#F8F7F2) — 3.80:1 Carousel + Large 2-Up 2:1 Ad Pair */}
      <ScrollReveal>
        <section className="section-band" style={{ background: '#F8F7F2' }}>
          <div className="container">
            <div className="section-header-bar">
              <div>
                <span className="section-kicker">On the store</span>
                <h2 className="font-display">Popular right now</h2>
              </div>
              <Link href="/category/all" className="section-link">
                See everything
              </Link>
            </div>

            <CampaignBannerCarousel />

            {/* Large 2-Up 2:1 Showcase Pair */}
            <div className="promo-ad-grid-2" style={{ marginTop: '22px' }}>
              {PROMO_ADS_PAIR.map((ad) => (
                <Link key={ad.src} href={ad.href} className="promo-ad-card" aria-label={ad.alt}>
                  <Image
                    src={ad.src}
                    alt={ad.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="promo-ad-pill" aria-hidden="true">
                    {ad.cta}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. FULL-BLEED ARCHITECTURAL DARK BAND (#141413 — editorial typography + ruled proof ledger) */}
      <ScrollReveal>
        <section className="tone-dark local-pay-band">
          <div className="container">
            <div className="local-pay-grid">
              {/* Left: Editorial Statement + Single Focal CTA */}
              <div className="local-pay-copy">
                <span className="local-pay-kicker">Direct delivery</span>
                <h2 className="font-display local-pay-heading">
                  Ordered in seconds, sent right to your chat.
                </h2>
                <p className="local-pay-body">
                  Pick your card, send the pre-filled order on WhatsApp or Viber, and receive your verified code straight in chat.
                </p>

                <div className="local-pay-actions">
                  <Link href="/category/all" className="btn btn-accent btn-lg">
                    Shop Gift Cards
                  </Link>
                  <Link href="/guides" className="local-pay-text-link">
                    Redemption guides
                  </Link>
                </div>
              </div>

              {/* Right: Architectural Hairline-Ruled Proof Ledger (zero cards, zero boxes) */}
              <div className="local-pay-ledger sr-stagger">
                {STORE_PROOF_ROWS.map((row) => (
                  <div key={row.label} className="local-pay-row">
                    <div className="font-display tabular-nums local-pay-metric">
                      {row.metric}
                    </div>
                    <div>
                      <div className="local-pay-row-label">{row.label}</div>
                      <p className="local-pay-row-detail">{row.detail}</p>
                    </div>
                  </div>
                ))}

                <div className="local-pay-methods">
                  <span>Delivered via</span>
                  <span className="local-pay-methods-list">WhatsApp · Viber · Live redemption help</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. POPULAR BRANDS (#F8F7F2) — 6 Crisp Native 2:1 Brand Ads */}
      <ScrollReveal>
        <section className="section-band" style={{ background: '#F8F7F2' }}>
          <div className="container">
            <div className="section-header-bar">
              <div>
                <span className="section-kicker">More on Gamakay</span>
                <h2 className="font-display">Popular brands</h2>
              </div>
              <Link href="/category/all" className="section-link">
                All products
              </Link>
            </div>

            <div className="promo-ad-grid sr-stagger">
              {PROMO_ADS_GALLERY.map((ad) => (
                <Link key={ad.src} href={ad.href} className="promo-ad-card" aria-label={ad.alt}>
                  <Image
                    src={ad.src}
                    alt={ad.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="promo-ad-pill" aria-hidden="true">
                    {ad.cta}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 8. HOW TO ORDER + PAYMENTS & SUPPORT (#EFEDE6) */}
      <ScrollReveal>
        <section className="section-band" style={{ background: '#EFEDE6', borderTop: '1px solid #E8E5DC', borderBottom: '1px solid #E8E5DC' }}>
          <div className="container">
            <div className="flow-split-grid">
              {/* Left: Simple 3-Step Order Guide */}
              <div>
                <span className="section-kicker">How it works</span>
                <h2 className="font-display" style={{ marginBottom: '26px' }}>
                  How to order
                </h2>

                <div className="sr-stagger">
                  {[
                    {
                      num: '01',
                      title: 'Pick your card and amount',
                      desc: 'Check the region (US, India, or Global), pick the value you want, and add it to your cart.',
                    },
                    {
                      num: '02',
                      title: 'Send your order on WhatsApp or Viber',
                      desc: 'Put in your phone number at checkout. We generate an order number and pre-fill the message for you.',
                    },
                    {
                      num: '03',
                      title: 'Get your code in chat',
                      desc: 'Confirm your order in chat and we reply with your verified code, usually within 5 to 15 minutes.',
                    },
                  ].map((step, index) => (
                    <div
                      key={step.num}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 1fr',
                        gap: '16px',
                        padding: '20px 0',
                        borderTop: '1px solid #DDD9CE',
                        borderBottom: index === 2 ? '1px solid #DDD9CE' : 'none',
                      }}
                    >
                      <span className="tabular-nums" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#66635B', paddingTop: '2px' }}>
                        {step.num}
                      </span>
                      <div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 600, color: '#181818', marginBottom: '4px' }}>
                          {step.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#595751', lineHeight: 1.6 }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Crisp White Delivery & Support Card on Warm Neutral */}
              <div
                className="surface-card"
                style={{
                  borderRadius: '22px',
                  padding: 'clamp(24px, 4vw, 34px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    background: '#EFEDE6',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#181818',
                    marginBottom: '16px',
                  }}>
                    Delivery &amp; Support
                  </span>

                  <h3 className="font-display" style={{ fontSize: 'clamp(1.45rem, 2.3vw, 1.85rem)', color: '#181818', marginBottom: '10px' }}>
                    Fast chat delivery, real help.
                  </h3>

                  <p style={{ fontSize: '0.92rem', color: '#595751', lineHeight: 1.62, marginBottom: '20px' }}>
                    Every code is checked before we send it. If you&apos;re unsure about your account region or need help redeeming a code, just message us.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { title: 'WhatsApp & Viber', sub: 'Codes sent straight in chat' },
                      { title: '5–15 Min Delivery', sub: 'Fast turnaround on orders' },
                      { title: 'Verified Codes', sub: 'Checked before sending' },
                      { title: 'Redemption Help', sub: 'We help if you get stuck' },
                    ].map((item) => (
                      <div key={item.title} style={{ background: '#F8F7F2', border: '1px solid #E8E5DC', borderRadius: '14px', padding: '14px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#181818' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#66635B', marginTop: '2px' }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/guides" className="btn btn-primary" style={{ flex: 1 }}>
                    Redemption Guides
                  </Link>
                  <Link href="/track" className="btn btn-outline" style={{ flex: 1 }}>
                    Track Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 9. FAQ SECTION (#F8F7F2) */}
      <FAQSection background="#F8F7F2" />

      {/* 10. HAVE A CUSTOM REQUEST? (Dark architectural WhatsApp request composer) */}
      <CustomRequestSection sectionRef={supportStripRef} />

      {/* Subtle Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/9779862157864"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Gamakay on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 90,
          width: '48px',
          height: '48px',
          borderRadius: '9999px',
          background: '#107E3D',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px -4px rgba(24, 24, 24, 0.22)',
          opacity: showFab ? 1 : 0,
          transform: showFab ? 'translateY(0)' : 'translateY(10px)',
          pointerEvents: showFab ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <style>{`
        /* Hero Stage — Warm Neutral #F8F7F2 Canvas with Compact Mobile Height */
        .hero-stage {
          background: #F8F7F2;
          color: #181818;
          padding-top: calc(var(--header-height) + clamp(18px, 3.6vw, 44px));
          padding-bottom: clamp(24px, 4.2vw, 52px);
          position: relative;
          overflow: hidden;
        }
        .hero-headline {
          color: #181818;
          font-size: clamp(2.08rem, 4.35vw, 3.65rem);
          font-weight: 600;
          line-height: 1.06;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
        }
        .hero-yellow-underline {
          position: relative;
          display: inline-block;
          z-index: 1;
          padding: 0 2px;
        }
        .hero-yellow-underline::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0.06em;
          height: 0.22em;
          background: #F4CE16;
          border-radius: 2px;
          z-index: -1;
          transform-origin: left center;
          animation: underlineSweep 0.54s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both;
        }
        .hero-subcopy {
          font-size: clamp(0.95rem, 1.22vw, 1.06rem);
          color: #595751;
          line-height: 1.6;
          max-width: 440px;
          margin-bottom: 24px;
        }

        /* Hero 50:50 Split Grid */
        .hero-split-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          align-items: center;
        }
        @media (min-width: 960px) {
          .hero-split-grid {
            grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
            gap: clamp(32px, 4.4vw, 56px);
          }
        }
        .hero-split-copy {
          min-width: 0;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .hero-stage {
            padding-top: calc(var(--header-height) + 14px);
            padding-bottom: 20px;
          }
          .hero-headline {
            margin-bottom: 10px;
          }
          .hero-subcopy {
            margin-bottom: 18px;
          }
          .hero-cta-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
          }
          .hero-cta-btn {
            width: 100%;
            min-height: 46px;
            padding: 11px 16px;
            font-size: 0.9rem;
          }
        }

        /* Full-Bleed Architectural Dark Editorial Band */
        .local-pay-band {
          background: #141413;
          color: #F8F7F2;
          padding: clamp(64px, 7.5vw, 104px) 0;
        }
        .local-pay-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 44px;
          align-items: start;
        }
        @media (min-width: 960px) {
          .local-pay-grid {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            gap: clamp(48px, 6vw, 88px);
            align-items: center;
          }
        }
        .local-pay-kicker {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 500;
          color: #9E9B93;
          margin-bottom: 14px;
        }
        .local-pay-heading {
          color: #F8F7F2;
          font-size: clamp(2rem, 3.6vw, 3.1rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
          margin-bottom: 18px;
          max-width: 520px;
        }
        .local-pay-body {
          color: #B0ADA5;
          font-size: 1rem;
          line-height: 1.65;
          max-width: 440px;
          margin-bottom: 30px;
        }
        .local-pay-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 22px;
        }
        .local-pay-text-link {
          font-size: 0.92rem;
          font-weight: 500;
          color: #D4D1C8;
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px solid rgba(248, 247, 242, 0.28);
          transition: color 0.16s ease, border-color 0.16s ease;
        }
        .local-pay-text-link:hover {
          color: #F8F7F2;
          border-color: #F8F7F2;
        }
        .local-pay-ledger {
          display: flex;
          flex-direction: column;
        }
        .local-pay-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          padding: 22px 0;
          border-top: 1px solid rgba(248, 247, 242, 0.12);
        }
        @media (min-width: 520px) {
          .local-pay-row {
            grid-template-columns: minmax(136px, 168px) minmax(0, 1fr);
            gap: 24px;
            align-items: baseline;
          }
        }
        .local-pay-metric {
          font-size: clamp(1.85rem, 2.7vw, 2.35rem);
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #F8F7F2;
        }
        .local-pay-row-label {
          font-size: 0.94rem;
          font-weight: 600;
          color: #F8F7F2;
          margin-bottom: 3px;
        }
        .local-pay-row-detail {
          font-size: 0.85rem;
          color: #9E9B93;
          line-height: 1.5;
          margin: 0;
        }
        .local-pay-methods {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(248, 247, 242, 0.12);
          font-size: 0.8rem;
          color: #9E9B93;
        }
        .local-pay-methods-list {
          color: #D4D1C8;
          font-weight: 500;
        }

        /* Category Banner Grid (3:1 Native Banners) */
        .departments-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 768px) {
          .departments-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }
        .dept-banner-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E8E5DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .dept-banner-card:hover {
          transform: translateY(-3px);
          border-color: #D7D3C7;
          box-shadow: var(--shadow-lg);
        }
        .dept-banner-media {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 3 / 1;
          background: #141413;
          overflow: hidden;
          border-bottom: 1px solid #E8E5DC;
        }
        .dept-banner-media-wide {
          aspect-ratio: 2 / 1;
        }
        @media (min-width: 768px) {
          .dept-banner-card-wide {
            grid-column: 1 / -1;
            flex-direction: row;
            align-items: stretch;
          }
          .dept-banner-media-wide {
            width: 48%;
            flex-shrink: 0;
            border-bottom: none;
            border-right: 1px solid #E8E5DC;
          }
        }
        .dept-banner-media img {
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dept-banner-card:hover .dept-banner-media img {
          transform: scale(1.03);
        }
        .dept-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          background: #EFEDE6;
          color: #181818;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          text-decoration: none;
          transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }
        .dept-banner-card:hover .dept-arrow-btn {
          background: #141413;
          color: #F8F7F2;
          transform: translateX(2px);
        }
        .dept-shortcut-pill {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid #E8E5DC;
          background: #F8F7F2;
          color: #181818;
          font-size: 0.78rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .dept-shortcut-pill:hover {
          background: #141413;
          border-color: #141413;
          color: #F8F7F2;
        }

        /* Asymmetric Order Flow + Payments Split */
        .flow-split-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
        }
        @media (min-width: 960px) {
          .flow-split-grid {
            grid-template-columns: 1.3fr 0.95fr;
            gap: 56px;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}
