'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import ScrollReveal from '@/components/ScrollReveal';
import dynamic from 'next/dynamic';

const DraggableMarquee = dynamic(() => import('@/components/DraggableMarquee'), {
  ssr: false,
  loading: () => <div style={{ height: '116px', width: '100%', background: 'var(--bg-secondary)', opacity: 0.5 }} />
});
const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '400px', width: '100%', background: 'var(--bg-primary)' }} />
});
import { getFeaturedProducts, getProductsByCategory } from '@/lib/products';

// ─── Hero banner slides ──────────────────────────────────────────────────────
// Desktop images: /public/IMAGES/webpdesktop/
// Mobile images:  /public/IMAGES/webpmobile/
const HERO_SLIDES = [
  {
    desktop: '/IMAGES/webpmobile/AI_mobile.webp',
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
    desktop: '/IMAGES/webpdesktop/FIFA_web.webp',
    mobile: '/IMAGES/webpmobile/FIFA_mobile.webp',
    alt: 'FIFA',
    link: '/search?q=fifa',
  },
  {
    desktop: '/IMAGES/webpdesktop/GROK_web.webp',
    mobile: '/IMAGES/webpmobile/Grok_mobile_new.webp',
    alt: 'Grok AI',
    link: '/search?q=grok',
  },
  {
    desktop: '/IMAGES/webpmobile/Gamepass_mobile.webp',
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
    desktop: '/IMAGES/webpmobile/GTA_mobile.webp',
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideReady, setSlideReady] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

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
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }
    if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  // Smart FAB: show after scrolling past hero, hide near bottom CTA
  const [showFab, setShowFab] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const rafPending = useRef(false);

  useEffect(() => {
    const handleFabVisibility = () => {
      // Throttle with rAF — only compute once per frame, not on every scroll tick
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

  // Randomize starting slide on mount (after hydration)
  useEffect(() => {
    const random = Math.floor(Math.random() * HERO_SLIDES.length);
    setCurrentSlide(random);
    setSlideReady(true);
  }, []);

  // Auto-slide hero carousel — starts only after random slide is set
  useEffect(() => {
    if (!slideReady) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideReady]);



  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
      {/* Hero Carousel — Contained */}
      <section
        className="hero-section"
        style={{
          paddingTop: 'var(--header-height, 110px)',
          background: 'var(--bg-primary)',
          overflow: 'hidden',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndWrapper}
      >
        <div className="container" style={{ paddingTop: 'clamp(12px, 2vw, 20px)' }}>
          {/* Slide Track */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(180px, 32vw, 380px)',
            background: '#0E1117',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}>
            {/* Slides */}
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s',
                  transform: isActive ? 'scale(1)' : 'scale(1.03)',
                  zIndex: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  willChange: 'opacity, transform',
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
                {/* Slide content end */}
              </div>
            );
          })}

          {/* Left Arrow */}
          <button
            onClick={() => setCurrentSlide(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.color = '#EAB308';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.color = '#EAB308';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '12px 0 10px' }}>
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '22px' : '6px',
                height: '6px',
                borderRadius: '3px',
                border: 'none',
                background: currentSlide === index ? '#EAB308' : '#D1D5DB',
                cursor: 'pointer',
                transition: 'all 0.26s ease',
                padding: 0,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </section>

      {/* Category Icons - right below search bar */}
      <ScrollReveal delay={0.05}>
        <section style={{
          background: 'var(--bg-primary)',
          padding: '16px 0',
          borderBottom: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container">
            <div className="category-row">
              {CATEGORIES.map((cat, index) => (
                <Link
                  key={index}
                  href={cat.slug ? `/category/${cat.slug}` : '/'}
                  className="category-item"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    padding: '12px 8px',
                    borderRadius: '6px',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#111111';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                  }}
                >
                  <span style={{ fontSize: '1.3rem', lineHeight: 1, color: 'var(--text-secondary)' }}>
                    {typeof cat.icon === 'string' ? cat.icon : cat.icon}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                  }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <style jsx>{`
          .category-scroll::-webkit-scrollbar { display: none; }
          @media (min-width: 768px) {
            .category-scroll {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr) !important;
              overflow-x: visible !important;
              padding: 0 16px !important;
            }
          }
          @media (min-width: 1024px) {
            .category-scroll { grid-template-columns: repeat(7, 1fr) !important; }
          }
        `}</style>
        </section>
      </ScrollReveal>

      {/* Best Sellers */}
      <ScrollReveal threshold={0} duration={0.4} distance="20px">
        <section className="section-padding" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>Best Sellers</h2>
              <Link href="/category/gaming">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid">
              {featuredProductsData.map((product) => (
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

      {/* Brand Marquee */}
      <ScrollReveal>
        <section className="promo-padding" style={{
          background: 'var(--bg-marquee)',
          overflow: 'hidden',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          {/* Row 1 - Scrolling Left */}
          <DraggableMarquee
            items={[
              { image: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.webp', link: '/search?q=playstation' },
              { image: '/IMAGES/PRODUCTS/XBOX_GIFTCARDS.webp', link: '/search?q=xbox' },
              { image: '/IMAGES/PRODUCTS/NETFLIX.webp', link: '/search?q=netflix' },
              { image: '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.webp', link: '/search?q=spotify' },
              { image: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.webp', link: '/search?q=apple' },
              { image: '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.webp', link: '/search?q=nintendo' },
              { image: '/IMAGES/PRODUCTS/DISCORD_NITRO.webp', link: '/search?q=discord' },
              { image: '/IMAGES/PRODUCTS/CRUCHYROLL.webp', link: '/search?q=crunchyroll' },
            ]}
            direction="forward"
            speed={0.5}
          />

          <div style={{ height: '16px' }}></div>

          {/* Row 2 - Scrolling Right */}
          <DraggableMarquee
            items={[
              { image: '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.webp', link: '/search?q=youtube' },
              { image: '/IMAGES/PRODUCTS/NORD_VPN.webp', link: '/search?q=nordvpn' },
              { image: '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.webp', link: '/search?q=gemini' },
              { image: '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.webp', link: '/search?q=claude' },
              { image: '/IMAGES/PRODUCTS/CURSOR_AI.webp', link: '/search?q=cursor' },
              { image: '/IMAGES/PRODUCTS/EXPRESS_VPN.webp', link: '/search?q=express' },
              { image: '/IMAGES/PRODUCTS/DUOLINGO.webp', link: '/search?q=duolingo' },
              { image: '/IMAGES/PRODUCTS/TINDER_GOLD.webp', link: '/search?q=tinder' },
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
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A8F3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h4M8 10v4" />
                  <circle cx="17" cy="10" r="1" fill="#1A8F3C" />
                  <circle cx="15" cy="12" r="1" fill="#1A8F3C" />
                </svg>
                Gaming
              </h2>
              <Link href="/category/gaming">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid">
              {gamingProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>


      {/* Promo Banners — grid 2 */}
      <ScrollReveal>
        <section className="promo-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <PromoBanner variant="grid2" />
          </div>
        </section>
      </ScrollReveal>


      <ScrollReveal>
        <section className="section-padding" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', transition: 'var(--theme-transition)' }}>
          <div className="container">
            <div className="section-title-row">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6A817" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                Subscriptions
              </h2>
              <Link href="/category/subscriptions">
                View All
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '3px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="product-grid">
              {subscriptionsProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trust Badges */}
      <ScrollReveal>
        <section className="section-padding" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container">
            <div
              className="trust-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}
            >
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                  title: 'Instant Delivery',
                  desc: 'Codes via WhatsApp'
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  title: 'Secure Payment',
                  desc: 'Bank transfer · eSewa'
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  ),
                  title: '24/7 Support',
                  desc: 'WhatsApp chat support'
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  title: 'Verified Codes',
                  desc: '100% working guaranteed'
                }
              ].map((item, i) => (
                <div key={i} className="trust-card">
                  <div className="trust-card-icon">
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '3px', color: 'var(--text-primary)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
          @media (min-width: 768px) {
            .trust-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
        `}</style>
        </section >
      </ScrollReveal>

      {/* How it Works Section */}
        <section className="section-padding" style={{
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
                Get your gift card in 3 steps
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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  step: '2',
                  title: 'Pay & Send Receipt',
                  desc: 'Pay via bank transfer or eSewa and send the receipt to our WhatsApp.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Cards Section: Hamrobazar & Need Help */}
      <ScrollReveal>
        <section className="section-padding" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'stretch'
            }}>
              
              {/* Hamrobazar Card */}
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '32px 28px 28px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {/* Logo */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '18px' }}>
                  <div style={{
                    width: '120px', height: '120px',
                    borderRadius: '10px', overflow: 'hidden',
                    border: '1.5px solid var(--border-color)',
                  }}>
                    <img
                      src="/hamrobazar-ok-logo.png"
                      alt="Hamrobazar"
                      loading="lazy" decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <h2 style={{
                  fontSize: '1.35rem', fontWeight: 800,
                  color: 'var(--text-primary)', marginBottom: '6px',
                  letterSpacing: '-0.025em',
                }}>
                  Also on Hamrobazar
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px', lineHeight: 1.6 }}>
                  Visit our verified store for more products and exclusive deals
                </p>

                {/* Star rating */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id="halfStar">
                          <stop offset="60%" stopColor="#FFCC00" />
                          <stop offset="60%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= 4 ? "#FFCC00" : (i === 5 ? "url(#halfStar)" : "#FFCC00")} stroke={i === 5 ? "#FFCC00" : "none"} strokeWidth="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>4.6 · 5000+ Sales</span>
                </div>

                {/* Stats */}
                <div style={{ marginBottom: '24px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Since 2015
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href="https://shareurl.hamrobazaar.com/MuP498AHV4jYiuDt6"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                      padding: '13px 24px',
                      fontSize: '0.88rem', fontWeight: 800,
                      background: '#111111', color: 'white',
                      borderRadius: '6px', textDecoration: 'none',
                      transition: 'background 0.15s ease',
                      letterSpacing: '0.02em', textTransform: 'uppercase',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2A2A2A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111111'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Visit Hamrobazar Store
                  </a>
                  <a
                    href="https://www.instagram.com/gamakaygiftcards/"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                      padding: '11px 24px',
                      fontSize: '0.85rem', fontWeight: 700,
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '6px', textDecoration: 'none',
                      transition: 'border-color 0.15s ease, color 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#E1306C';
                      e.currentTarget.style.color = '#E1306C';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Follow on Instagram
                  </a>
                </div>
                            </div>
              </div>


              {/* Need Help CTA Card */}
              <section className="cta-card" ref={ctaRef} style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
<h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px', fontWeight: 800, letterSpacing: '-0.025em' }}>
                Need Help?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.65, maxWidth: '380px', margin: '0 auto 28px' }}>
                We're on WhatsApp 24/7 — reach us in seconds for orders, support, or custom requests.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/9779862157864"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '13px 24px',
                    fontSize: '0.9rem', fontWeight: 800,
                    background: '#FFCC00',
                    color: '#111111',
                    borderRadius: '6px',
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
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '13px 22px',
                    fontSize: '0.88rem', fontWeight: 700,
                    color: 'rgba(255,255,255,0.75)',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    transition: 'border-color 0.15s ease, color 0.15s ease',
                    textTransform: 'uppercase', letterSpacing: '0.03em',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }}
                >
                  Redemption Guides
                </Link>
              </div>
            </section>

            </div>
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
          right: '20px',
          zIndex: 80,
          width: '50px',
          height: '50px',
          borderRadius: '8px',
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
    </div >
  );
}
