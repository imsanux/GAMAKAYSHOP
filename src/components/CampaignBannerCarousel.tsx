'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CampaignSlide {
  id: string;
  label: string;
  cta: string;
  alt: string;
  desktop: string;
  mobile: string;
  href: string;
}

const SLIDE_DURATION_MS = 5200;

// All slides share exact 4309x1134 (3.80:1) desktop & 2646x1361 (1.94:1) mobile dimensions
const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'playstation',
    label: 'PlayStation',
    cta: 'Shop PlayStation',
    alt: 'Get More, Play More with PlayStation Gift Cards',
    desktop: '/IMAGES/webpdesktop/Playstation_web.webp',
    mobile: '/IMAGES/webpmobile/Playstation_mobile.webp',
    href: '/product/playstation-giftcards-usd',
  },
  {
    id: 'apple',
    label: 'Apple Gift Card',
    cta: 'Shop Apple',
    alt: 'The gift card for everything Apple',
    desktop: '/IMAGES/webpdesktop/AppleGiftcard_web.webp',
    mobile: '/IMAGES/webpmobile/Applegiftcard_mobile.webp',
    href: '/product/apple-gift-card-usd',
  },
  {
    id: 'gamepass',
    label: 'Xbox Game Pass',
    cta: 'Shop Game Pass',
    alt: 'Xbox Game Pass Ultimate subscription in Nepal',
    desktop: '/IMAGES/webpdesktop/Gamepass_web.webp',
    mobile: '/IMAGES/webpmobile/Gamepass_mobile.webp',
    href: '/product/xbox-gamepass-ultimate',
  },
  {
    id: 'steam',
    label: 'Steam Wallet',
    cta: 'Shop Steam',
    alt: 'Steam Gift Cards US and India in Nepal',
    desktop: '/IMAGES/webpdesktop/Steam_web.webp',
    mobile: '/IMAGES/webpmobile/Steam_mobile_new.webp',
    href: '/product/steam-giftcards-us-india',
  },
  {
    id: 'netflix',
    label: 'Netflix 4K',
    cta: 'Shop Netflix',
    alt: 'Netflix Dolby Atmos 4K Ultra HD subscriptions in Nepal',
    desktop: '/IMAGES/webpdesktop/NETFLIX_web.webp',
    mobile: '/IMAGES/webpmobile/Netflix_mobile_new.webp',
    href: '/product/netflix-monthly',
  },
  {
    id: 'gta',
    label: 'Console Credit',
    cta: 'Shop Gaming',
    alt: 'PlayStation and Xbox console store gift cards',
    desktop: '/IMAGES/webpdesktop/GTA_web.webp',
    mobile: '/IMAGES/webpmobile/GTA_mobile.webp',
    href: '/category/gaming',
  },
];

export default function CampaignBannerCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = setInterval(() => {
      if (!document.hidden) {
        setActive((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
      }
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [paused, inView, active]);

  const goPrev = () => setActive((prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length);
  const goNext = () => setActive((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);

  return (
    <div
      ref={stageRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        touchStartX.current = null;
        if (delta > 45) goNext();
        if (delta < -45) goPrev();
      }}
    >
      {/* Main Stage — exact 4309/1134 desktop & 2646/1361 mobile ratios */}
      <div className="campaign-stage">
        {CAMPAIGN_SLIDES.map((slide, idx) => {
          const isCurrent = idx === active;
          return (
            <Link
              key={slide.id}
              href={slide.href}
              aria-hidden={!isCurrent}
              tabIndex={isCurrent ? 0 : -1}
              className="campaign-slide-link"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent ? 'scale(1)' : 'scale(1.015)',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: isCurrent ? 'auto' : 'none',
                zIndex: isCurrent ? 2 : 1,
                display: 'block',
              }}
            >
              <Image
                src={slide.desktop}
                alt={slide.alt}
                fill
                loading={idx === active || idx === (active + 1) % CAMPAIGN_SLIDES.length ? 'eager' : 'lazy'}
                fetchPriority="low"
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="campaign-img-desktop"
                style={{ objectFit: 'cover' }}
              />
              <Image
                src={slide.mobile}
                alt={slide.alt}
                fill
                loading={idx === active || idx === (active + 1) % CAMPAIGN_SLIDES.length ? 'eager' : 'lazy'}
                fetchPriority="low"
                sizes="100vw"
                className="campaign-img-mobile"
                style={{ objectFit: 'cover' }}
              />
              <span className="campaign-hover-cta" aria-hidden="true">
                {slide.cta}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="campaign-arrow campaign-arrow-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="campaign-arrow campaign-arrow-right"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Labeled Slide Selector Pills with Live Progress Track */}
      <div
        className="filter-strip"
        style={{ marginTop: '14px', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} role="tablist" aria-label="Popular banners">
          {CAMPAIGN_SLIDES.map((slide, idx) => {
            const isCurrent = idx === active;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setActive(idx)}
                className="campaign-tab-pill"
                data-active={isCurrent}
              >
                {slide.label}
              </button>
            );
          })}
        </div>
        <span className="tabular-nums hide-mobile" style={{ fontSize: '0.78rem', color: '#66635B', fontWeight: 500, flexShrink: 0 }}>
          {String(active + 1).padStart(2, '0')} / {String(CAMPAIGN_SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      <style>{`
        .campaign-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 2646 / 1361;
          border-radius: 20px;
          overflow: hidden;
          background: #141413;
          border: 1px solid #E8E5DC;
          box-shadow: var(--shadow-md);
        }
        .campaign-img-desktop { display: none !important; }
        .campaign-img-mobile { display: block !important; }
        @media (min-width: 768px) {
          .campaign-stage { aspect-ratio: 4309 / 1134; }
          .campaign-img-desktop { display: block !important; }
          .campaign-img-mobile { display: none !important; }
        }
        .campaign-hover-cta {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 6;
          padding: 8px 15px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.94);
          color: #181818;
          border: 1px solid rgba(24, 24, 24, 0.08);
          box-shadow: 0 4px 14px rgba(24, 24, 24, 0.14);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .campaign-slide-link:hover .campaign-hover-cta,
        .campaign-slide-link:focus-visible .campaign-hover-cta {
          opacity: 1;
          transform: translateY(0);
        }
        .campaign-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          border: 1px solid rgba(24, 24, 24, 0.12);
          background: rgba(255, 255, 255, 0.92);
          color: #181818;
          box-shadow: 0 4px 12px rgba(24, 24, 24, 0.14);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
        }
        .campaign-arrow:hover {
          background: #141413;
          border-color: #141413;
          color: #F8F7F2;
          transform: translateY(-50%) scale(1.04);
        }
        .campaign-arrow-left { left: 14px; }
        .campaign-arrow-right { right: 14px; }

        .campaign-tab-pill {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid #E8E5DC;
          background: #FFFFFF;
          color: #595751;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: border-color 0.16s ease, color 0.16s ease, background-color 0.16s ease;
        }
        .campaign-tab-pill:hover {
          border-color: #D7D3C7;
          color: #181818;
        }
        .campaign-tab-pill[data-active="true"] {
          background: #141413;
          border-color: #141413;
          color: #F8F7F2;
        }
      `}</style>
    </div>
  );
}
