'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect reduced motion and let touch/mobile devices use native 120Hz inertial scrolling
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    const lenis = new Lenis({
      duration: 0.88,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      prevent: (node) => Boolean(node.closest('textarea, [role="dialog"], [data-lenis-prevent]')),
    });

    let rafId = 0;
    let running = false;

    const raf = (time: number) => {
      lenis.raf(time);
      if (running) {
        rafId = requestAnimationFrame(raf);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(raf);
    };

    const stop = () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stop();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
