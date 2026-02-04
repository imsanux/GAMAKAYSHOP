'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FAQSection from '@/components/FAQSection';
import PromoBanner from '@/components/PromoBanner';
import { getFeaturedProducts, getProductsByCategory, searchProducts } from '@/lib/products';

export default function Home() {
  const router = useRouter();
  const featuredProducts = getFeaturedProducts();
  const gamingProducts = getProductsByCategory('gaming').slice(0, 6);
  const streamingProducts = getProductsByCategory('streaming').slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Live search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchProducts(searchQuery);
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
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

  const heroSlides = [
    // Product Slides
    {
      type: 'standard',
      title: 'PlayStation Gift Cards',
      subtitle: 'Level up your gaming experience',
      image: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.png',
      bg: 'linear-gradient(135deg, #003087 0%, #0070d1 100%)'
    },
    {
      type: 'standard',
      title: 'Netflix & Streaming',
      subtitle: 'Entertainment at your fingertips',
      image: '/IMAGES/PRODUCTS/NETFLIX.png',
      bg: 'linear-gradient(135deg, #8b0000 0%, #e50914 100%)'
    },
    {
      type: 'standard',
      title: 'Xbox Game Pass',
      subtitle: 'Hundreds of games, one low price',
      image: '/IMAGES/PRODUCTS/XBOX_GAMEPASS.png',
      bg: 'linear-gradient(135deg, #0e7a0d 0%, #107c10 100%)'
    },
    {
      type: 'standard',
      title: 'Steam Gift Cards',
      subtitle: 'Unlock your gaming library',
      image: '/IMAGES/PRODUCTS/STEAM_GIFTCARDS.png',
      bg: 'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)'
    },
    {
      type: 'standard',
      title: 'Apple Gift Cards',
      subtitle: 'For all things Apple',
      image: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.png',
      bg: 'linear-gradient(135deg, #1d1d1f 0%, #555555 100%)'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
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
    <div style={{ background: '#f8fafc' }}>
      {/* Hero Carousel */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0f172a'
      }}>
        <div style={{
          display: 'flex',
          transition: 'transform 0.5s ease-out',
          transform: `translateX(-${currentSlide * 100}%)`
        }}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              style={{
                minWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'clamp(160px, 28vw, 240px)',
                background: slide.bg,
                padding: '0'
              }}
            >
              {/* Horizontal layout - Image + Text side by side */}
              <div className="container" style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(16px, 4vw, 40px)',
                height: '100%',
                padding: '16px 24px'
              }}>
                {/* Product Image */}
                <div style={{
                  width: 'clamp(80px, 18vw, 160px)',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  flexShrink: 0
                }}>
                  <img
                    src={slide.image}
                    alt={slide.title || 'Product'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                {/* Text */}
                <div style={{ maxWidth: '400px', zIndex: 2, textAlign: 'left' }}>
                  <h2 style={{
                    fontSize: 'clamp(1.1rem, 4vw, 2rem)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '4px',
                    lineHeight: 1.15,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    {slide.title}
                  </h2>
                  <p style={{
                    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    margin: 0
                  }}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        < div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {
            heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))
          }
        </div >

        {/* Arrow buttons */}
        < button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="hide-mobile"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button >
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hide-mobile"
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </section >

      {/* Search Bar Section */}
      <section style={{
        background: 'white',
        padding: '24px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                  border: '2px solid #e2e8f0',
                  borderRadius: showDropdown && searchResults.length > 0 ? '20px 20px 0 0' : '50px',
                  background: '#f8fafc',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.15)';
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
                  background: '#3b82f6',
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
                background: 'white',
                border: '2px solid #3b82f6',
                borderTop: 'none',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 8px 24px rgba(59,130,246,0.2)',
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
                      color: '#1e293b',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#f1f5f9'
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
                        color: '#64748b'
                      }}>
                        {product.brand} • {product.category}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#3b82f6'
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
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: '#f8fafc',
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

      {/* Promo Banners - Random Selection */}
      <section style={{
        background: 'white',
        padding: '24px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container">
          <PromoBanner variant="double" />
        </div>
      </section>

      {/* Category Icons - Grid Layout */}
      <section style={{
        background: 'white',
        padding: '20px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}
            className="category-grid"
          >
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={cat.slug ? `/category/${cat.slug}` : '/'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '14px 8px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>
                  {typeof cat.icon === 'string' ? cat.icon : cat.icon}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  textAlign: 'center'
                }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 480px) {
            .category-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (min-width: 768px) {
            .category-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
          @media (min-width: 1024px) {
            .category-grid {
              grid-template-columns: repeat(7, 1fr) !important;
            }
          }
        `}</style>
      </section>

      {/* Brand Marquee - CoinGate Style */}
      < section style={{
        background: '#f1f5f9',
        padding: '32px 0',
        overflow: 'hidden'
      }}>
        {/* Row 1 - Scrolling Left */}
        < div style={{
          display: 'flex',
          animation: 'marquee 30s linear infinite',
          marginBottom: '16px'
        }}>
          {
            [...Array(2)].map((_, setIndex) => (
              <div key={setIndex} style={{ display: 'flex', gap: '16px', paddingRight: '16px' }}>
                {[
                  '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.png',
                  '/IMAGES/PRODUCTS/XBOX_GIFTCARDS.png',
                  '/IMAGES/PRODUCTS/NETFLIX.png',
                  '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.png',
                  '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.png',
                  '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.png',
                  '/IMAGES/PRODUCTS/DISCORD_NITRO.png',
                  '/IMAGES/PRODUCTS/CRUCHYROLL.png',
                ].map((image, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    style={{
                      width: '160px',
                      height: '100px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={image}
                      alt="Gift Card"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            ))
          }
        </div >

        {/* Row 2 - Scrolling Right */}
        < div style={{
          display: 'flex',
          animation: 'marquee-reverse 35s linear infinite'
        }}>
          {
            [...Array(2)].map((_, setIndex) => (
              <div key={setIndex} style={{ display: 'flex', gap: '16px', paddingRight: '16px' }}>
                {[
                  '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.png',
                  '/IMAGES/PRODUCTS/NORD_VPN.png',
                  '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.png',
                  '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.png',
                  '/IMAGES/PRODUCTS/CURSOR_AI.png',
                  '/IMAGES/PRODUCTS/EXPRESS_VPN.png',
                  '/IMAGES/PRODUCTS/DUOLINGO.png',
                  '/IMAGES/PRODUCTS/TINDER_GOLD.png',
                ].map((image, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    style={{
                      width: '160px',
                      height: '100px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={image}
                      alt="Gift Card"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            ))
          }
        </div >

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section >

      {/* Popular Gift Cards */}
      < section style={{ padding: '48px 16px', background: '#f8fafc' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a'
            }}>
              🔥 Popular Gift Cards
            </h2>
            <Link
              href="/category/gaming"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#3b82f6',
                textDecoration: 'none'
              }}
            >
              View all →
            </Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* Gaming Section */}
      < section style={{ padding: '48px 16px', background: 'white' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="17" cy="10" r="1" fill="#10b981" />
                <circle cx="15" cy="12" r="1" fill="#10b981" />
              </svg>
              Gaming
            </h2>
            <Link
              href="/category/gaming"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#3b82f6',
                textDecoration: 'none'
              }}
            >
              Explore →
            </Link>
          </div>
          <div className="product-grid">
            {gamingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* Gaming Banner */}
      <section style={{ padding: '24px 16px', background: '#f8fafc' }}>
        <div className="container">
          <PromoBanner variant="single" category="gaming" />
        </div>
      </section>

      {/* Streaming Section */}
      < section style={{ padding: '48px 16px', background: '#f8fafc' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <polygon points="10,8 10,12 14,10" fill="#f43f5e" />
              </svg>
              Streaming
            </h2>
            <Link
              href="/category/streaming"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#3b82f6',
                textDecoration: 'none'
              }}
            >
              Explore →
            </Link>
          </div>
          <div className="product-grid">
            {streamingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* Streaming/Software Banner */}
      <section style={{ padding: '24px 16px', background: 'white' }}>
        <div className="container">
          <PromoBanner variant="carousel" />
        </div>
      </section>

      {/* Trust Section */}
      < section style={{
        padding: '64px 16px',
        background: 'white',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            className="trust-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}
          >
            {[
              {
                icon: (
                  <svg width="24\" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F59E0B' }}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                bg: '#FEF3C7',
                title: 'Instant Delivery',
                desc: 'Get codes via WhatsApp'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F97316' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                bg: '#FFEDD5',
                title: 'Secure Payment',
                desc: 'Bank transfer or eSewa'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8B5CF6' }}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                ),
                bg: '#F3E8FF',
                title: '24/7 Support',
                desc: 'WhatsApp chat support'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22C55E' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
                bg: '#DCFCE7',
                title: 'Verified Codes',
                desc: '100% working guaranteed'
              }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px', color: '#0f172a' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
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

      {/* How it Works Section */}
      < section style={{
        padding: '64px 16px',
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', color: '#0f172a', fontSize: '1.75rem' }}>
            How it Works
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '32px',
            textAlign: 'center'
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
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
              <div key={i} style={{ flex: '1 1 250px', position: 'relative' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  position: 'relative'
                }}>
                  {item.icon}
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '28px',
                    height: '28px',
                    background: '#0f172a',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    border: '2px solid white'
                  }}>
                    {item.step}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section >
      {/* Hamrobazar Section */}
      < section style={{
        padding: '48px 16px',
        background: '#f8fafc'
      }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 16px',
            }}>
              <img
                src="/hamrobazar-ok-logo.png"
                alt="Hamrobazar"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#0f172a' }}>
              Also on Hamrobazar
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '0.95rem',
              marginBottom: '20px',
              maxWidth: '400px',
              margin: '0 auto 20px'
            }}>
              Visit our verified Hamrobazar store for more products and special deals
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#22c55e'
              }}>
                <span>✓</span> Highly Rated
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#22c55e'
              }}>
                <span>✓</span> 5000+ Sales
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#22c55e'
              }}>
                <span>✓</span> Since 2015
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <a
                href="https://shareurl.hamrobazaar.com/MuP498AHV4jYiuDt6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: '#3D3D3D',
                  color: 'white',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(61, 61, 61, 0.3)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  gap: '10px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
                  color: 'white',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(225, 48, 108, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section >

      {/* FAQ Section */}
      < FAQSection />

      {/* CTA Section */}
      < section style={{
        padding: '64px 16px',
        background: 'white',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <h2 style={{ color: '#0f172a', fontSize: '1.75rem', marginBottom: '12px' }}>
            Need Help?
          </h2>
          <p style={{ color: 'rgba(15, 23, 42, 0.8)', fontSize: '1rem', marginBottom: '24px' }}>
            Contact us on WhatsApp for quick support
          </p>
          <a
            href="https://wa.me/9779862157864"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              background: '#22c55e',
              color: 'white',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(34,197,94,0.3)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>

          <div style={{ marginTop: '16px' }}>
            <Link
              href="/guides"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#64748b',
                background: '#f1f5f9',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View Redemption Guides
            </Link>
          </div>
        </div>
      </section >
    </div >
  );
}
