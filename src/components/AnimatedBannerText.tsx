'use client';

import { useState, useEffect } from 'react';

const LANGUAGES = [
  "EVERYTHING",  // English
  "सबै कुरा",     // Nepali
  "फुक्क",       // Newari
  "सब कुछ",      // Hindi
  "TUTTO",       // Italian
  "TOUT",        // French
  "TODO",        // Spanish
  "一切"         // Chinese
];

export default function AnimatedBannerText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LANGUAGES.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h2 style={{ 
      fontSize: 'clamp(1.2rem, 4.5vw, 4rem)', 
      fontWeight: 900, 
      color: 'var(--text-primary)',
      textTransform: 'uppercase',
      letterSpacing: '-0.04em',
      lineHeight: 1.15,
      margin: 0,
      whiteSpace: 'nowrap',
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '7.5em', /* Fixed width prevents surrounding text from shifting */
        background: '#FACC15', 
        color: '#111111', 
        padding: '0 16px', 
        borderRadius: '0px',
        whiteSpace: 'nowrap'
      }}>
        {LANGUAGES[index]}
      </span>
      <span>YOU NEED AND MORE</span>
    </h2>
  );
}
