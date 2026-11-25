'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HERO_BANNERS = [
  {
    id: 'playstation',
    label: 'PlayStation Gift Cards',
    cta: 'Shop PlayStation',
    href: '/product/playstation-giftcards-usd',
    src: '/IMAGES/webpmobile/Playstation_mobile.webp',
    alt: 'PlayStation Gift Cards in $25, $50, and $100 digital codes',
  },
  {
    id: 'apple',
    label: 'Apple Gift Cards',
    cta: 'Shop Apple',
    href: '/product/apple-gift-card-usd',
    src: '/IMAGES/webpmobile/Applegiftcard_mobile.webp',
    alt: 'Apple Gift Cards for App Store, iCloud+, and Apple Music',
  },
  {
    id: 'steam',
    label: 'Steam Gift Cards',
    cta: 'Shop Steam',
    href: '/product/steam-giftcards-us-india',
    src: '/IMAGES/webpmobile/Steam_mobile_new.webp',
    alt: 'Steam Wallet Gift Cards for PC games',
  },
  {
    id: 'netflix',
    label: 'Netflix 4K Ultra HD',
    cta: 'Shop Netflix',
    href: '/product/netflix-monthly',
    src: '/IMAGES/webpmobile/Netflix_mobile_new.webp',
    alt: 'Netflix Dolby Atmos and 4K Ultra HD streaming plans',
  },
  {
    id: 'gamepass',
    label: 'Xbox Game Pass Ultimate',
    cta: 'Shop Game Pass',
    href: '/product/xbox-gamepass-ultimate',
    src: '/IMAGES/webpmobile/Gamepass_mobile.webp',
    alt: 'Xbox Game Pass Ultimate for console and PC',
  },
  {
    id: 'ai',
    label: 'AI Subscriptions',
    cta: 'Shop AI Tools',
    href: '/category/software',
    src: '/IMAGES/webpmobile/AI_mobile.webp',
    alt: 'Claude, ChatGPT, Grok, and Gemini AI subscriptions',
  },
];

const AUTO_INTERVAL_MS = 5200;

export default function HeroShowcaseSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  const total = HERO_BANNERS.length;
  const activeSlide = HERO_BANNERS[activeIndex] ?? HERO_BANNERS[0];

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || total <= 1) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      if (!document.hidden) goNext();
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, inView, total, goNext, activeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    didSwipeRef.current = false;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 36) {
      didSwipeRef.current = true;
      if (delta < 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      ref={containerRef}
      className="hero-banner-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured gift card banners"
    >
      {/* Crisp Architectural Exact 2646:1361 (1.94:1) Sliding Showcase */}
      <div className="hero-banner-frame">
        <div
          className="hero-banner-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {HERO_BANNERS.map((slide, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <Link
                key={slide.id}
                href={slide.href}
                className="hero-banner-slide"
                aria-label={`${slide.cta} - ${slide.alt}`}
                tabIndex={isCurrent ? 0 : -1}
                aria-hidden={!isCurrent}
                onClick={(e) => {
                  if (didSwipeRef.current) {
                    e.preventDefault();
                    didSwipeRef.current = false;
                  }
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  loading={idx === 0 || idx === activeIndex || idx === (activeIndex + 1) % total ? 'eager' : 'lazy'}
                  sizes="(max-width: 960px) 100vw, 640px"
                  style={{ objectFit: 'cover' }}
                />
                <span className="hero-banner-cta-pill" aria-hidden="true">
                  <span>{slide.cta}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Minimal Architectural Pagination & Controls */}
      <div className="hero-banner-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div className="hero-progress-bars" role="tablist" aria-label="Select banner slide">
            {HERO_BANNERS.map((slide, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Show ${slide.label}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`hero-progress-hit ${isCurrent ? 'hero-progress-hit-active' : ''}`}
                >
                  <span className="hero-progress-track">
                    {isCurrent && (
                      <span
                        key={`${activeIndex}-${paused ? 'p' : 'r'}`}
                        className={`hero-progress-fill ${paused ? 'hero-progress-fill-paused' : ''}`}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <span key={activeSlide.id} className="hero-slide-caption caption-swap">
            {activeSlide.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span
            className="tabular-nums"
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#66635B',
              letterSpacing: '0.02em',
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous banner"
              className="hero-arrow-circle"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next banner"
              className="hero-arrow-circle"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hero-banner-showcase {
          display: flex;
          flex-direction: column;
        }
        .hero-banner-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 2646 / 1361;
          border-radius: 20px;
          overflow: hidden;
          background: #141413;
          border: 1px solid rgba(24, 24, 24, 0.08);
          box-shadow: 0 18px 38px -14px rgba(24, 24, 24, 0.16);
          user-select: none;
          transition: border-color 0.22s ease, box-shadow 0.28s ease;
        }
        .hero-banner-frame:hover {
          border-color: rgba(24, 24, 24, 0.16);
          box-shadow: 0 24px 48px -14px rgba(24, 24, 24, 0.2);
        }
        .hero-banner-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.58s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .hero-banner-slide {
          position: relative;
          display: block;
          min-width: 100%;
          height: 100%;
          text-decoration: none;
          cursor: pointer;
        }
        .hero-banner-slide img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-banner-slide:hover img {
          transform: scale(1.018);
        }
        .hero-banner-cta-pill {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(24, 24, 24, 0.08);
          box-shadow: 0 4px 14px rgba(24, 24, 24, 0.14);
          color: #181818;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .hero-banner-slide:hover .hero-banner-cta-pill,
        .hero-banner-slide:focus-visible .hero-banner-cta-pill {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-banner-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 12px;
          padding: 0 2px;
        }
        .hero-progress-bars {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .hero-progress-hit {
          display: inline-flex;
          align-items: center;
          padding: 10px 0;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .hero-progress-track {
          position: relative;
          display: block;
          width: 18px;
          height: 3px;
          border-radius: 9999px;
          background: #DDD9CE;
          overflow: hidden;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
        }
        .hero-progress-hit:hover .hero-progress-track {
          background: #C4BFB2;
        }
        .hero-progress-hit-active .hero-progress-track {
          width: 42px;
          background: #DDD9CE;
        }
        @keyframes heroBannerProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hero-progress-fill {
          position: absolute;
          inset: 0;
          background: #181818;
          transform-origin: left center;
          animation: heroBannerProgress ${AUTO_INTERVAL_MS}ms linear forwards;
        }
        .hero-progress-fill-paused {
          animation-play-state: paused;
        }
        .hero-slide-caption {
          font-size: 0.78rem;
          font-weight: 500;
          color: #595751;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: none;
        }
        @media (min-width: 520px) {
          .hero-slide-caption {
            display: inline-block;
          }
        }
        .hero-arrow-circle {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          border: 1px solid #E8E5DC;
          background: #FFFFFF;
          color: #181818;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.14s ease;
        }
        .hero-arrow-circle:hover {
          background: #181818;
          border-color: #181818;
          color: #F8F7F2;
        }
        .hero-arrow-circle:active {
          transform: scale(0.94);
        }

        @media (max-width: 640px) {
          .hero-banner-frame {
            border-radius: 16px;
          }
          .hero-banner-controls {
            margin-top: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-banner-track,
          .hero-progress-fill,
          .hero-banner-slide img,
          .hero-banner-cta-pill {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
