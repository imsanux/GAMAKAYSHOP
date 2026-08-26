'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AD_BANNERS = [
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

export default function RandomAdBoxes({ count = 2 }: { count?: number }) {
  const [ads, setAds] = useState<typeof AD_BANNERS>([]);

  useEffect(() => {
    // Randomize the banners on mount to avoid hydration mismatch
    const shuffled = [...AD_BANNERS].sort(() => 0.5 - Math.random());
    setAds(shuffled.slice(0, count));
  }, [count]);

  if (ads.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    }}>
      {ads.map((ad, idx) => (
        <Link key={idx} href={ad.link} style={{
          display: 'block',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
           e.currentTarget.style.transform = 'translateY(-4px)';
           e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
           const imgs = e.currentTarget.querySelectorAll('img');
           imgs.forEach(img => img.style.transform = 'scale(1.02)');
        }}
        onMouseLeave={e => {
           e.currentTarget.style.transform = 'translateY(0)';
           e.currentTarget.style.boxShadow = 'var(--shadow-md)';
           const imgs = e.currentTarget.querySelectorAll('img');
           imgs.forEach(img => img.style.transform = 'scale(1)');
        }}>
           <Image
             src={ad.mobile}
             alt={ad.alt}
             className="hide-desktop"
             width={767}
             height={900}
             style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
           />
           <Image
             src={ad.desktop}
             alt={ad.alt}
             className="hide-mobile"
             width={1920}
             height={600}
             style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
           />
        </Link>
      ))}
    </div>
  );
}
