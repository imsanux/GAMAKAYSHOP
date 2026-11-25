'use client';

import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    distance?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    scale?: number;
    style?: CSSProperties;
    className?: string;
    once?: boolean;
    threshold?: number;
}

export default function ScrollReveal({
    children,
    delay = 0,
    duration = 0.5,
    distance = '14px',
    direction = 'up',
    scale,
    style,
    className,
    once = true,
    threshold = 0.06
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('sr-visible');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('sr-visible');
                        if (once) observer.unobserve(el);
                    } else if (!once) {
                        el.classList.remove('sr-visible');
                    }
                });
            },
            { threshold, rootMargin: '0px 0px -24px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once, threshold]);

    const translateMap: Record<string, string> = {
        up: `translateY(${distance})`,
        down: `translateY(-${distance})`,
        left: `translateX(${distance})`,
        right: `translateX(-${distance})`
    };

    const initialTransform = [
        translateMap[direction],
        scale ? `scale(${scale})` : ''
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={ref}
            className={`sr-element ${className || ''}`}
            style={{
                transform: initialTransform,
                transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
                ...style
            }}
        >
            {children}
        </div>
    );
}
