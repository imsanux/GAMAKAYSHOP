'use client';

import { useRef, useCallback } from 'react';

interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}

/**
 * MagneticButton
 * Wraps any element — on hover, the child subtly "pulls" toward the cursor.
 * The same premium micro-interaction used on AAA game sites.
 */
export default function MagneticButton({ children, strength = 0.3, className }: MagneticProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const childRef = useRef<HTMLElement | null>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const child = el.firstElementChild as HTMLElement;
        if (child) {
            child.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
            child.style.transition = 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)';
        }
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        const el = wrapRef.current;
        if (!el) return;
        const child = el.firstElementChild as HTMLElement;
        if (child) {
            child.style.transform = 'translate3d(0, 0, 0)';
            child.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
        }
    }, []);

    return (
        <div
            ref={wrapRef}
            className={`magnetic-btn-wrap ${className || ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}
