'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { getFeaturedProducts, getProductsByCategory, searchProducts } from '@/lib/products';

// ─── Hero banner slides ──────────────────────────────────────────────────────
// Desktop images: /public/IMAGES/webpdesktop/
// Mobile images:  /public/IMAGES/webpmobile/
const HERO_SLIDES = [
  {
    desktop: '/IMAGES/webpdesktop/Netflix_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Netflix_mobile.webp',
    alt:     'Netflix',
  },
  {
    desktop: '/IMAGES/webpdesktop/Playstatio_Xbox_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Playstation_xbox_mobile.webp',
    alt:     'PlayStation & Xbox',
  },
  {
    desktop: '/IMAGES/webpdesktop/Steam_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Steam_mobile.webp',
    alt:     'Steam Gift Cards',
  },
  {
    desktop: '/IMAGES/webpdesktop/Apple_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Apple_mobile.webp',
    alt:     'Apple Gift Cards',
  },
  {
    desktop: '/IMAGES/webpdesktop/Grok_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Grok_mobile.webp',
    alt:     'Grok AI',
  },
  {
    desktop: '/IMAGES/webpdesktop/Suno_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Suno_mobile.webp',
    alt:     'Suno AI',
  },
  {
    desktop: '/IMAGES/webpdesktop/Udemy_desktop.webp',
    mobile:  '/IMAGES/webpmobile/Udemy_mobile.webp',
    alt:     'Udemy',
  },
];

const CATEGORIES = [
  {
    name: 'Browse All', slug: 'all', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  },
  {
    name: 'Gaming', slug: 'gaming', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4M8 10v4" />
        <circle cx="17" cy="10" r="1" fill="#10b981" />
        <circle cx="15" cy="12" r="1" fill="#10b981" />
      </svg>
    )
  },
  {
    name: 'Streaming', slug: 'streaming', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <polygon points="10,8 10,12 14,10" fill="#f43f5e" />
      </svg>
    )
  },
  {
    name: 'Software', slug: 'software', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l3 3-3 3M12 14h5" />
      </svg>
    )
  },
  {
    name: 'Subscriptions', slug: 'subscriptions', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    )
  },
  {
    name: 'AI Tools', slug: 'software', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b5cf6">
        <path d="M9.5 2l1.5 4.5L15.5 8l-4.5 1.5L9.5 14l-1.5-4.5L3.5 8l4.5-1.5L9.5 2z" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      </svg>
    )
  },
  {
    name: 'Social Media', slug: 'subscriptions', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Live search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchProducts(searchQuery);
      setSearchResults(results.slice(0, 8));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-slide hero carousel (uses module-level constant length)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);



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
      {/* Hero Carousel */}
      <section className="hero-section" style={{
        padding: '16px 0',
        background: 'var(--bg-primary)',
        transition: 'var(--theme-transition)'
      }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndWrapper}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              background: '#0f172a',
              touchAction: 'pan-y' // Allows vertical scrolling while tracking horizontal swipes
            }}>
            <div style={{
              display: 'flex',
              transition: 'transform 0.8s cubic-bezier(0.8, 0, 0.2, 1)',
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: '100%',
                    height: 'clamp(200px, 38vw, 430px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Responsive banner — mobile WebP on small screens, desktop WebP on large */}
                  <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                    <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
                    <img
                      src={slide.desktop}
                      alt={slide.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                  </picture>
                </div>
              ))}
            </div>

            {/* Controls - Dots */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.25)',
              padding: '7px 14px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
            }}>
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? '28px' : '7px',
                    height: '7px',
                    borderRadius: '4px',
                    border: 'none',
                    background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <style jsx>{`
            /* Hero banner: desktop tall, mobile compact */
            .hero-carousel-inner {
              display: flex;
              transition: transform 0.8s cubic-bezier(0.8, 0, 0.2, 1);
            }
            .hero-carousel-inner > div {
              height: clamp(200px, 38vw, 430px);
            }
          `}</style>
        </div>
      </section>


      {/* Search Bar Section */}
      <section style={{
        background: 'var(--card-bg)',
        padding: '24px 0',
        borderBottom: '1px solid var(--border-color)',
        transition: 'var(--theme-transition)'
      }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
          <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setShowDropdown(false);
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              style={{
                position: 'relative',
                width: '100%'
              }}
            >
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gift cards, subscriptions..."
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 20px',
                  fontSize: '1rem',
                  border: '1.5px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: showDropdown && searchResults.length > 0 ? '20px 20px 0 0' : '50px',
                  background: 'var(--input-bg)',
                  outline: 'none',
                  transition: 'all 0.25s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--btn-primary-bg)';
                  e.currentTarget.style.background = 'var(--input-bg-focus)';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 113, 227, 0.1)';
                  if (searchQuery.trim().length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  background: 'var(--btn-primary-bg)',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Live Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--dropdown-bg)',
                border: '1.5px solid var(--btn-primary-bg)',
                borderTop: 'none',
                borderRadius: '0 0 20px 20px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/search?q=${encodeURIComponent(product.name)}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--dropdown-bg)';
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-secondary)'
                    }}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                      }}>
                        {product.brand} • {product.category}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--btn-primary-bg)'
                    }}>
                      Rs. {product.denominations[0]?.price.toLocaleString()}
                    </div>
                  </Link>
                ))}

                {/* View All Results */}
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 16px',
                    textDecoration: 'none',
                    color: 'var(--btn-primary-bg)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '0 0 18px 18px'
                  }}
                >
                  View all results for "{searchQuery}"
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Icons - right below search bar */}
      <ScrollReveal delay={0.05}>
        <section style={{
          background: 'var(--card-bg)',
          padding: '20px 0',
          borderBottom: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ padding: '0' }}>
            <div
              className="category-scroll"
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '4px'
              }}
            >
              {CATEGORIES.map((cat, index) => (
                <Link
                  key={index}
                  href={cat.slug ? `/category/${cat.slug}` : '/'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 20px',
                    minWidth: '100px',
                    borderRadius: '24px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--btn-primary-bg)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,113,227,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>
                    {typeof cat.icon === 'string' ? cat.icon : cat.icon}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <style jsx>{`
          .category-scroll::-webkit-scrollbar {
            display: none;
          }
          @media (min-width: 768px) {
            .category-scroll {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr) !important;
              overflow-x: visible !important;
              padding: 0 16px !important;
            }
          }
          @media (min-width: 1024px) {
            .category-scroll {
              grid-template-columns: repeat(7, 1fr) !important;
            }
          }
        `}</style>
        </section>
      </ScrollReveal>

      {/* Promo Banners */}
      <ScrollReveal>
        <section style={{
          background: 'var(--card-bg)',
          padding: '24px 0',
          borderBottom: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <PromoBanner variant="double" />
          </div>
        </section>
      </ScrollReveal>

      {/* Brand Marquee */}
      <ScrollReveal>
        <section style={{
          background: 'var(--bg-marquee)',
          padding: '32px 0',
          overflow: 'hidden',
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

      {/* Popular Gift Cards */}
      <ScrollReveal threshold={0} duration={0.4} distance="20px">
        <section style={{ padding: '48px 0', background: 'var(--bg-primary)', transition: 'var(--theme-transition)' }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <div className="section-title-row">
              <h2>
                Best Seller
              </h2>
              <Link href="/category/gaming">
                View All
              </Link>
            </div>
            <div className="product-grid">
              {featuredProductsData.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section >

        {/* Gaming Section */}
        <section style={{ padding: '48px 0', background: 'var(--card-bg)', transition: 'var(--theme-transition)' }} className="below-fold">
          <div className="container" style={{ padding: '0 16px' }}>
            <div className="section-title-row">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h4M8 10v4" />
                  <circle cx="17" cy="10" r="1" fill="#10b981" />
                  <circle cx="15" cy="12" r="1" fill="#10b981" />
                </svg>
                Gaming
              </h2>
              <Link href="/category/gaming">
                View All
              </Link>
            </div>
            <div className="product-grid">
              {gamingProductsData.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section >
      </ScrollReveal>

      {/* Gaming Banner */}
      <ScrollReveal>
        <section style={{ padding: '24px 0', background: 'var(--bg-primary)', transition: 'var(--theme-transition)' }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <PromoBanner variant="single" category="gaming" />
          </div>
        </section>
      </ScrollReveal>

      {/* Streaming Section */}
      <ScrollReveal>
        <section style={{ padding: '48px 0', background: 'var(--bg-primary)', transition: 'var(--theme-transition)' }} className="below-fold">
          <div className="container" style={{ padding: '0 16px' }}>
            <div className="section-title-row">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                  <polygon points="10,8 10,12 14,10" fill="#f43f5e" />
                </svg>
                Streaming
              </h2>
              <Link href="/category/streaming">
                View All
              </Link>
            </div>
            <div className="product-grid">
              {streamingProductsData.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section >
      </ScrollReveal>

      {/* Streaming/Software Banner */}
      <ScrollReveal>
        <section style={{ padding: '24px 0', background: 'var(--card-bg)', transition: 'var(--theme-transition)' }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <PromoBanner variant="carousel" />
          </div>
        </section>
      </ScrollReveal>

      {/* Subscriptions Section */}
      <ScrollReveal>
        <section style={{ padding: '48px 0', background: 'var(--bg-primary)', transition: 'var(--theme-transition)' }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <div className="section-title-row">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                Subscriptions
              </h2>
              <Link href="/category/subscriptions">
                View All
              </Link>
            </div>
            <div className="product-grid">
              {subscriptionsProductsData.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trust Section */}
      <ScrollReveal>
        < section style={{
          padding: '64px 0',
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '900px', padding: '0 16px' }}>
          <div
              className="trust-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px'
              }}
            >
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F59E0B' }}>
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                  bg: '#FEF3C7',
                  bgDark: 'rgba(245,158,11,0.15)',
                  title: 'Instant Delivery',
                  desc: 'Codes via WhatsApp'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F97316' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  bg: '#FFEDD5',
                  bgDark: 'rgba(249,115,22,0.15)',
                  title: 'Secure Payment',
                  desc: 'Bank transfer · eSewa'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8B5CF6' }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  ),
                  bg: '#F3E8FF',
                  bgDark: 'rgba(139,92,246,0.15)',
                  title: '24/7 Support',
                  desc: 'WhatsApp chat support'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22C55E' }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  bg: '#DCFCE7',
                  bgDark: 'rgba(34,197,94,0.15)',
                  title: 'Verified Codes',
                  desc: '100% working guaranteed'
                }
              ].map((item, i) => (
                <div key={i} className="trust-card">
                  <div className="trust-card-icon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
          @media (min-width: 768px) {
            .trust-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
        `}</style>
        </section >
      </ScrollReveal>

      {/* How it Works Section */}
      <ScrollReveal>
        <section style={{
          padding: '72px 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '880px', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: 0 }}>
                How it Works
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem' }}>
                Get your gift card in 3 easy steps
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '24px',
              position: 'relative'
            }}>
              {[
                {
                  step: '1',
                  title: 'Browse & Select',
                  desc: 'Choose your desired gift card or subscription from our wide selection.',
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3B82F6' }}>
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  step: '2',
                  title: 'Pay & Send Receipt',
                  desc: 'Pay via bank transfer or eSewa and send the receipt to our WhatsApp.',
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F59E0B' }}>
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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10B981' }}>
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )
                }
              ].map((item, i) => (
                <div key={i} className="hiw-step">
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
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Hamrobazar Section */}
      <ScrollReveal>
        <section style={{
          padding: '56px 0',
          background: 'var(--bg-secondary)',
          transition: 'var(--theme-transition)'
        }}>
          <div className="container" style={{ maxWidth: '560px', padding: '0 16px' }}>
            {/* Card — always white in both modes */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.18)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>

              <div style={{ padding: '36px 32px 32px', textAlign: 'center' }}>
                {/* Logo + verified badge */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '2px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src="/hamrobazar-ok-logo.png"
                      alt="Hamrobazar"
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  {/* Verified badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(34,197,94,0.4)'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '8px',
                  letterSpacing: '-0.02em'
                }}>
                  Also on Hamrobazar
                </h2>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  lineHeight: 1.6
                }}>
                  Visit our verified store for more products and exclusive deals
                </p>

                {/* Star rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>5.0 · 5000+ Sales</span>
                </div>

                {/* Stats badges */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '28px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { label: 'Verified', color: '#dcfce7', text: '#16a34a' },
                    { label: 'Highly Rated', color: '#fef9c3', text: '#ca8a04' },
                    { label: 'Since 2015', color: '#eff6ff', text: '#2563eb' }
                  ].map(badge => (
                    <span key={badge.label} style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      background: badge.color,
                      color: badge.text,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {badge.label}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a
                    href="https://shareurl.hamrobazaar.com/MuP498AHV4jYiuDt6"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '15px 28px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      background: '#3D3D3D',
                      color: 'white',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(61, 61, 61, 0.35)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(61, 61, 61, 0.5)'; e.currentTarget.style.background = '#2a2a2a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(61, 61, 61, 0.35)'; e.currentTarget.style.background = '#3D3D3D'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Visit Hamrobazar Store
                  </a>
                  <a
                    href="https://www.instagram.com/gamakaygiftcards/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '13px 28px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
                      color: 'white',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(225, 48, 108, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(225, 48, 108, 0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(225, 48, 108, 0.3)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Follow on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        < FAQSection />
      </ScrollReveal>

      {/* CTA Section — gradient card */}
      <ScrollReveal>
        <section
          ref={ctaRef}
          style={{
            padding: '56px 0',
            background: 'var(--bg-primary)',
            transition: 'var(--theme-transition)'
          }}
        >
          <div className="container" style={{ maxWidth: '720px', padding: '0 16px' }}>
            <div className="cta-card">
              <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '10px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Need Help?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 28px' }}>
                We're on WhatsApp 24/7 — reach us in seconds for orders, support, or custom requests.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/9779862157864"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: '#25D366',
                    color: 'white',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
                <Link
                  href="/guides"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-secondary)',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                >
                  Redemption Guides
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* ctaRef anchors the FAB hide logic */}
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
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          // Smart visibility
          opacity: showFab ? 1 : 0,
          transform: showFab ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
          pointerEvents: showFab ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (showFab) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.55)';
          }
        }}
        onMouseLeave={(e) => {
          if (showFab) {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.45)';
          }
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div >
  );
}
