'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import ScrollReveal from '@/components/ScrollReveal';
import ClipReveal from '@/components/ClipReveal';
import { useGsapCardStagger, useHeroParallax } from '@/hooks/useGsapAnimations';
import dynamic from 'next/dynamic';
import AnimatedBannerText from '@/components/AnimatedBannerText';

const DraggableMarquee = dynamic(() => import('@/components/DraggableMarquee'), {
  ssr: false,
  loading: () => <div style={{ height: '116px', width: '100%', background: 'var(--bg-secondary)', opacity: 0.5 }} />
});
const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '400px', width: '100%', background: 'var(--bg-primary)' }} />
});
import { getFeaturedProducts, getProductsByCategory } from '@/lib/products';
import { Product } from '@/lib/supabase';

// ─── Hero banner slides ──────────────────────────────────────────────────────
// Desktop images: /public/IMAGES/webpdesktop/
// Mobile images:  /public/IMAGES/webpmobile/
const HERO_SLIDES = [
  {
    desktop: '/IMAGES/webpdesktop/AI_web.webp',
    mobile: '/IMAGES/webpmobile/AI_mobile.webp',
    alt: 'AI Tools',
    link: '/category/software',
  },
  {
    desktop: '/IMAGES/webpdesktop/AppleGiftcard_web.webp',
    mobile: '/IMAGES/webpmobile/Applegiftcard_mobile.webp',
    alt: 'Apple Gift Cards',
    link: '/search?q=apple',
  },
  {
    desktop: '/IMAGES/webpdesktop/Applemusic_web.webp',
    mobile: '/IMAGES/webpmobile/Applemusic_mobile.webp',
    alt: 'Apple Music',
    link: '/search?q=apple+music',
  },
  {
    desktop: '/IMAGES/webpdesktop/GROK_web.webp',
    mobile: '/IMAGES/webpmobile/Grok_mobile_new.webp',
    alt: 'Grok AI',
    link: '/search?q=grok',
  },
  {
    desktop: '/IMAGES/webpdesktop/Gamepass_web.webp',
    mobile: '/IMAGES/webpmobile/Gamepass_mobile.webp',
    alt: 'Xbox Game Pass',
    link: '/search?q=xbox',
  },
  {
    desktop: '/IMAGES/webpdesktop/NETFLIX_web.webp',
    mobile: '/IMAGES/webpmobile/Netflix_mobile_new.webp',
    alt: 'Netflix',
    link: '/search?q=netflix',
  },
  {
    desktop: '/IMAGES/webpdesktop/Playstation_web.webp',
    mobile: '/IMAGES/webpmobile/Playstation_mobile.webp',
    alt: 'PlayStation',
    link: '/search?q=playstation',
  },
  {
    desktop: '/IMAGES/webpdesktop/Steam_web.webp',
    mobile: '/IMAGES/webpmobile/Steam_mobile_new.webp',
    alt: 'Steam Gift Cards',
    link: '/search?q=steam',
  },
  {
    desktop: '/IMAGES/webpdesktop/GTA_web.webp',
    mobile: '/IMAGES/webpmobile/GTA_mobile.webp',
    alt: 'GTA',
    link: '/category/gaming',
  },
];

const CATEGORIES = [
  {
    name: 'Browse All', slug: 'all', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  },
  {
    name: 'Gaming', slug: 'gaming', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4M8 10v4" />
        <circle cx="17" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'Streaming', slug: 'streaming', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <polygon points="10,8 10,12 14,10" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    name: 'Software', slug: 'software', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l3 3-3 3M12 14h5" />
      </svg>
    )
  },
  {
    name: 'Subscriptions', slug: 'subscriptions', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    )
  },
  {
    name: 'AI Tools', slug: 'software', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5 2l1.5 4.5L15.5 8l-4.5 1.5L9.5 14l-1.5-4.5L3.5 8l4.5-1.5L9.5 2z" opacity="0.9" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" opacity="0.6" />
      </svg>
    )
  },
  {
    name: 'Social Media', slug: 'subscriptions', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    )
  },
];

// Pre-compute product lists once at module level (static data)
const featuredProductsData = getFeaturedProducts();
const gamingProductsData = getProductsByCategory('gaming').slice(0, 6);
const streamingProductsData = getProductsByCategory('streaming').slice(0, 6);
const subscriptionsProductsData = getProductsByCategory('subscriptions').slice(0, 6);
const aiProductsData = getProductsByCategory('software').slice(0, 6);

// Marquee items — static
const MARQUEE_ROW1 = [
  { image: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.webp', link: '/search?q=playstation' },
  { image: '/IMAGES/PRODUCTS/XBOX_GIFTCARDS.webp', link: '/search?q=xbox' },
  { image: '/IMAGES/PRODUCTS/NETFLIX.webp', link: '/search?q=netflix' },
  { image: '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.webp', link: '/search?q=spotify' },
  { image: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.webp', link: '/search?q=apple' },
  { image: '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.webp', link: '/search?q=nintendo' },
  { image: '/IMAGES/PRODUCTS/DISCORD_NITRO.webp', link: '/search?q=discord' },
  { image: '/IMAGES/PRODUCTS/CRUCHYROLL.webp', link: '/search?q=crunchyroll' },
];
const MARQUEE_ROW2 = [
  { image: '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.webp', link: '/search?q=youtube' },
  { image: '/IMAGES/PRODUCTS/NORD_VPN.webp', link: '/search?q=nordvpn' },
  { image: '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.webp', link: '/search?q=gemini' },
  { image: '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.webp', link: '/search?q=claude' },
  { image: '/IMAGES/PRODUCTS/CURSOR_AI.webp', link: '/search?q=cursor' },
  { image: '/IMAGES/PRODUCTS/EXPRESS_VPN.webp', link: '/search?q=express' },
  { image: '/IMAGES/PRODUCTS/DUOLINGO.webp', link: '/search?q=duolingo' },
  { image: '/IMAGES/PRODUCTS/TINDER_GOLD.webp', link: '/search?q=tinder' },
];


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => featuredProductsData.slice(0, 6));
  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Refs for GSAP animations
  const heroRef = useRef<HTMLElement>(null);
  const featuredGridRef = useRef<HTMLDivElement>(null);
  const gamingGridRef = useRef<HTMLDivElement>(null);
  const streamingGridRef = useRef<HTMLDivElement>(null);
  const subsGridRef = useRef<HTMLDivElement>(null);
  const aiGridRef = useRef<HTMLDivElement>(null);

  // Wire up GSAP animations
  useHeroParallax(heroRef);
  useGsapCardStagger(featuredGridRef);
  useGsapCardStagger(gamingGridRef);
  useGsapCardStagger(streamingGridRef);
  useGsapCardStagger(subsGridRef);
  useGsapCardStagger(aiGridRef);

  // Randomize the order of the slides on each visit (client-side only to avoid SSR mismatch)
  useEffect(() => {
    setHeroSlides([...HERO_SLIDES].sort(() => 0.5 - Math.random()));
    setCurrentSlide(0);
  }, []);

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndWrapper = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }
    if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  // Auto-slide hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  // Smart FAB: show after scrolling past hero, hide near bottom CTA
  const [showFab, setShowFab] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const rafPending = useRef(false);

  useEffect(() => {
    const handleFabVisibility = () => {
      // Throttle with rAF
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        const scrollY = window.scrollY;
        const heroThreshold = window.innerHeight * 0.8;
        const nearBottom = ctaRef.current
          ? ctaRef.current.getBoundingClientRect().top < window.innerHeight + 100
          : false;
        setShowFab(scrollY > heroThreshold && !nearBottom);
      });
    };
    window.addEventListener('scroll', handleFabVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleFabVisibility);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
      {/* Premium Hero Carousel */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{
          paddingTop: 'var(--header-height, 110px)',
          background: 'var(--bg-primary)',
          overflow: 'hidden',
          paddingBottom: '24px'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndWrapper}
      >
        {/* Visually-hidden h1 for accessibility & heading hierarchy */}
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
          GAMAKAY Shop — Gift Cards &amp; Subscriptions in Nepal
        </h1>
        <div className="container" style={{ paddingTop: '16px' }}>
          {/* Slide Track */}
          <div className="hero-track" style={{
            position: 'relative',
            width: '100%',
            background: 'var(--color-ink)',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          }}>
            {/* Slides */}
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.7s cubic-bezier(0.2, 0, 0, 1), transform 0.7s cubic-bezier(0.2, 0, 0, 1)',
                    transform: isActive ? 'scale(1)' : 'scale(1.05)',
                    zIndex: isActive ? 1 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                    visibility: isActive ? 'visible' : 'hidden',
                  }}
                >
                  <Link
                    href={slide.link}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                      <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
                      <img
                        src={slide.desktop}
                        alt={slide.alt}
                        width="1920"
                        height="600"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : undefined}
                        decoding="async"
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                        }}
                      />
                    </picture>
                  </Link>
                </div>
              );
            })}

            {/* Premium Glass Arrows */}
            <button
              onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>
        </div>
      </section>

      {/* Tactile Pill Categories */}
      <ScrollReveal delay={0.05}>
        <section style={{
          background: 'var(--bg-primary)',
          padding: '24px 0',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container">
            <div className="pill-category-row">
              {CATEGORIES.map((cat, index) => (
                <Link
                  key={index}
                  href={cat.slug ? `/category/${cat.slug}` : '/'}
                  className="pill-category-item"
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#111111';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#111111';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--color-card)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <span style={{ display: 'flex', opacity: 0.7 }}>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Best Sellers */}
      <ScrollReveal threshold={0} duration={0.4} distance="20px">
        <section className="section-padding" style={{ paddingTop: '8px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>BEST SELLERS</h2>
              <Link href="/category/gaming">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid" ref={featuredGridRef}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Promo Banners — grid 1 */}
      <ScrollReveal>
        <section className="promo-padding" style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div className="container">
            <PromoBanner variant="grid" />
          </div>
        </section>
      </ScrollReveal>

      {/* Typographic Stat Banner */}
      <ScrollReveal>
        <section className="promo-padding" style={{
          background: 'var(--bg-primary)',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div className="container" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', padding: '20px 0' }}>
              <AnimatedBannerText />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Brand Marquee */}
      <ScrollReveal>
        <section className="promo-padding" style={{
          background: '#111111',
          overflow: 'hidden',
          borderTop: '1px solid #222222',
          borderBottom: '1px solid #222222',
          transition: 'var(--theme-transition)'
        }}>
          {/* Row 1 - Scrolling Left */}
          <DraggableMarquee
            items={[
              { image: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.webp', link: '/search?q=playstation', name: 'PlayStation Gift Cards' },
              { image: '/IMAGES/PRODUCTS/XBOX_GIFTCARDS.webp', link: '/search?q=xbox', name: 'Xbox Gift Cards' },
              { image: '/IMAGES/PRODUCTS/NETFLIX.webp', link: '/search?q=netflix', name: 'Netflix' },
              { image: '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.webp', link: '/search?q=spotify', name: 'Spotify Premium' },
              { image: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.webp', link: '/search?q=apple', name: 'Apple Gift Card' },
              { image: '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.webp', link: '/search?q=nintendo', name: 'Nintendo eShop Gift Cards' },
              { image: '/IMAGES/PRODUCTS/DISCORD_NITRO.webp', link: '/search?q=discord', name: 'Discord Nitro' },
              { image: '/IMAGES/PRODUCTS/CRUCHYROLL.webp', link: '/search?q=crunchyroll', name: 'Crunchyroll' },
            ]}
            direction="forward"
            speed={0.5}
          />

          <div style={{ height: '16px' }}></div>

          {/* Row 2 - Scrolling Right */}
          <DraggableMarquee
            items={[
              { image: '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.webp', link: '/search?q=youtube', name: 'YouTube Premium' },
              { image: '/IMAGES/PRODUCTS/NORD_VPN.webp', link: '/search?q=nordvpn', name: 'NordVPN' },
              { image: '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.webp', link: '/search?q=gemini', name: 'Google Gemini Pro' },
              { image: '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.webp', link: '/search?q=claude', name: 'Claude by Anthropic' },
              { image: '/IMAGES/PRODUCTS/CURSOR_AI.webp', link: '/search?q=cursor', name: 'Cursor AI' },
              { image: '/IMAGES/PRODUCTS/EXPRESS_VPN.webp', link: '/search?q=express', name: 'ExpressVPN' },
              { image: '/IMAGES/PRODUCTS/DUOLINGO.webp', link: '/search?q=duolingo', name: 'Duolingo' },
              { image: '/IMAGES/PRODUCTS/TINDER_GOLD.webp', link: '/search?q=tinder', name: 'Tinder Gold' },
            ]}
            direction="backward"
            speed={0.5}
          />
        </section>
      </ScrollReveal>



      {/* Gaming Section */}
      <ScrollReveal>
        <section className="section-padding below-fold" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>GAMING</h2>
              <Link href="/category/gaming">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid" ref={gamingGridRef}>
              {gamingProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>


      {/* Promo Banners — grid 2 */}
      <ScrollReveal>
        <section className="promo-padding below-fold" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <PromoBanner variant="grid2" />
          </div>
        </section>
      </ScrollReveal>


      <ScrollReveal>
        <section className="section-padding below-fold" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>SUBSCRIPTIONS</h2>
              <Link href="/category/subscriptions">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid" ref={subsGridRef}>
              {subscriptionsProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Typographic Trust Break */}
      <ScrollReveal>
        <section className="section-padding below-fold" style={{
          background: 'var(--color-ink)',
          transition: 'var(--theme-transition)',
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(255,204,0,0.08) 0%, rgba(17,17,17,0) 70%)',
            pointerEvents: 'none',
          }} />
          
          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <style>{`
              @keyframes maskRiseUp {
                0% { transform: translateY(110%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }
            `}</style>
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#FFCC00',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: '0 auto',
              maxWidth: '800px',
              textTransform: 'uppercase',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                <div style={{ animation: 'maskRiseUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
                  5,000+ Codes Delivered.
                </div>
              </div>
              <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                <div style={{ color: '#FFFFFF', animation: 'maskRiseUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}>
                  4.6/5 Stars on Hamrobazar.
                </div>
              </div>
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 600 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8F3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                100% Verified
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 600 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A5EC8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                24/7 Support
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* AI Tools Section */}
      <ScrollReveal>
        <section className="section-padding below-fold" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>AI TOOLS</h2>
              <Link href="/category/software">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid" ref={aiGridRef}>
              {aiProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* How it Works Section */}
        <section className="section-padding below-fold" style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '920px' }}>
            <ScrollReveal>
              <div className="hiw-header" style={{ marginBottom: '36px' }}>
              <div style={{
                display: 'inline-block',
                fontSize: '0.65rem', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#111111', background: '#FFCC00',
                padding: '3px 9px', borderRadius: '3px', marginBottom: '10px',
              }}>How It Works</div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.35rem, 3.5vw, 1.8rem)', margin: 0, fontWeight: 800, letterSpacing: '-0.025em' }}>
                Get your product In 3 simple steps
              </h2>
              </div>
            </ScrollReveal>
            <div className="hiw-steps-container">
              {[
                {
                  step: '1',
                  title: 'Browse & Select',
                  desc: 'Choose your desired gift card or subscription from our wide selection.',
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  step: '2',
                  title: 'Pay & Send Receipt',
                  desc: 'Pay via bank transfer or eSewa and send the receipt to our WhatsApp.',
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )
                },
                {
                  step: '3',
                  title: 'Delivery & Guidance',
                  desc: 'Receive your code instantly and get help with redemption if needed.',
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )
                }
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.15 * (i + 1)}>
                  <div className="hiw-step">
                    <div className="hiw-step-icon">
                    {item.icon}
                    <div className="hiw-step-num">{item.step}</div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '220px', margin: '0 auto' }}>
                    {item.desc}
                  </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

      {/* Need Help Section */}
      <ScrollReveal>
        <section className="section-padding below-fold" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <section className="cta-card" ref={ctaRef} style={{
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center', 
              width: '100%',
              background: '#000000',
              border: 'none',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-lg)'
            }}>

              <h2 style={{ color: '#FFFFFF', position: 'relative', zIndex: 1, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '10px', fontWeight: 800, letterSpacing: '-0.025em' }}>
                Need Help?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 1, fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.65, maxWidth: '420px', margin: '0 auto 32px' }}>
                We're on WhatsApp 24/7 — reach us in seconds for orders, support, or custom requests.
              </p>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/9779862157864"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      width: '100%', maxWidth: '260px',
                      padding: '13px 22px',
                      fontSize: '0.9rem', fontWeight: 700,
                      background: '#FFCC00',
                      color: '#111111',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'background 0.15s ease',
                      textTransform: 'uppercase', letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#E6B800'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFCC00'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <Link
                    href="/guides"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                      width: '100%', maxWidth: '260px',
                      padding: '13px 22px',
                      fontSize: '0.88rem', fontWeight: 700,
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      border: '1.5px solid var(--border-color)',
                      transition: 'border-color 0.15s ease, color 0.15s ease',
                      textTransform: 'uppercase', letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#FFCC00';
                      e.currentTarget.style.color = '#FFCC00';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    Redemption Guides
                  </Link>
                </div>
              </section>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

{/* WhatsApp Floating Button — smart visibility */}
      <a
        href="https://wa.me/9779862157864"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99,
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          background: '#25D366',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 14px rgba(37,211,102,0.4)',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: showFab ? 1 : 0,
          transform: showFab ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: showFab ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (showFab) {
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(37,211,102,0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (showFab) {
            e.currentTarget.style.boxShadow = '0 3px 14px rgba(37,211,102,0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <style>{`
        .hero-track {
          height: clamp(220px, 40vw, 480px);
        }
        @media (min-width: 1024px) {
          .hero-track {
            height: auto;
            aspect-ratio: 21 / 9;
          }
        }
        @media (min-width: 1440px) {
          .hero-track {
            aspect-ratio: 2.8 / 1;
          }
        }
      `}</style>
    </div >
  );
}
