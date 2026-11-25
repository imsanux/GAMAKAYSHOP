'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND_CHIPS = [
  { name: 'PlayStation', image: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.webp', href: '/product/playstation-giftcards-usd' },
  { name: 'Steam', image: '/IMAGES/PRODUCTS/Steam_Giftcards_US___INDIA.webp', href: '/product/steam-giftcards-us-india' },
  { name: 'Apple', image: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_USD_INR.webp', href: '/product/apple-gift-card-usd' },
  { name: 'Netflix', image: '/IMAGES/PRODUCTS/NETFLIX.webp', href: '/product/netflix-monthly' },
  { name: 'Spotify', image: '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.webp', href: '/product/spotify-premium' },
  { name: 'Xbox Game Pass', image: '/IMAGES/PRODUCTS/XBOX_GAMEPASS.webp', href: '/product/xbox-gamepass-ultimate' },
  { name: 'Claude AI', image: '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.webp', href: '/product/claude-ai-anthropic' },
  { name: 'Nintendo eShop', image: '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.webp', href: '/product/nintendo-eshop-giftcards' },
  { name: 'Discord Nitro', image: '/IMAGES/PRODUCTS/DISCORD_NITRO.webp', href: '/search?q=discord' },
  { name: 'Crunchyroll', image: '/IMAGES/PRODUCTS/CRUCHYROLL.webp', href: '/search?q=crunchyroll' },
  { name: 'Cursor AI', image: '/IMAGES/PRODUCTS/CURSOR_AI.webp', href: '/search?q=cursor' },
  { name: 'YouTube Premium', image: '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.webp', href: '/search?q=youtube' },
  { name: 'NordVPN', image: '/IMAGES/PRODUCTS/NORD_VPN.webp', href: '/search?q=nordvpn' },
  { name: 'iCloud+', image: '/IMAGES/PRODUCTS/ICLOUD_STORAGE.webp', href: '/search?q=icloud' },
];

export default function BrandMarqueeStrip() {
  return (
    <section
      aria-label="Popular brands available"
      style={{
        background: '#EFEDE6',
        borderTop: '1px solid #E8E5DC',
        borderBottom: '1px solid #E8E5DC',
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Edge Fade Masks */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '64px',
          background: 'linear-gradient(90deg, #EFEDE6 0%, rgba(239, 237, 230, 0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '64px',
          background: 'linear-gradient(270deg, #EFEDE6 0%, rgba(239, 237, 230, 0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="brand-marquee-track">
        {[...BRAND_CHIPS, ...BRAND_CHIPS].map((item, idx) => (
          <Link
            key={`${item.name}-${idx}`}
            href={item.href}
            className="brand-marquee-chip"
            tabIndex={idx >= BRAND_CHIPS.length ? -1 : 0}
            aria-hidden={idx >= BRAND_CHIPS.length ? true : undefined}
          >
            <span style={{
              position: 'relative',
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid rgba(24, 22, 21, 0.08)',
              flexShrink: 0,
            }}>
              <Image
                src={item.image}
                alt=""
                fill
                loading="lazy"
                fetchPriority="low"
                sizes="26px"
                style={{ objectFit: 'cover' }}
              />
            </span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes brandMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-marquee-track {
          display: flex;
          align-items: center;
          gap: 10px;
          width: max-content;
          animation: brandMarqueeScroll 44s linear infinite;
          will-change: transform;
        }
        .brand-marquee-track:hover,
        .brand-marquee-track:focus-within {
          animation-play-state: paused;
        }
        .brand-marquee-chip {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 14px 7px 8px;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 1px solid rgba(24, 22, 21, 0.08);
          color: #181818;
          font-size: 0.84rem;
          font-weight: 500;
          letter-spacing: -0.015em;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(24, 22, 21, 0.03);
          transition: border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
        }
        .brand-marquee-chip:hover {
          border-color: rgba(24, 22, 21, 0.24);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(24, 22, 21, 0.06);
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-track {
            animation: none;
            overflow-x: auto;
            width: 100%;
            padding: 0 20px;
            scrollbar-width: none;
          }
        }
      `}</style>
    </section>
  );
}
