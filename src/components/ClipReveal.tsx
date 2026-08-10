'use client';

import { useEffect, useRef } from 'react';

interface ClipRevealProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

/**
 * ClipReveal
 * Wraps text in an overflow:hidden container. The text slides up from below
 * when it enters the viewport — the same cinematic mask-reveal used on GTA VI
 * for section title entrances.
 */
export default function ClipReveal({ children, delay = 0, className }: ClipRevealProps) {
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        el.classList.add('clip-visible');
                    }, delay * 1000);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <span className={`clip-reveal-wrapper ${className || ''}`}>
            <span ref={textRef} className="clip-reveal-text">
                {children}
            </span>
        </span>
    );
}
