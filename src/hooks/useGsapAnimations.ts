'use client';
import { useEffect } from 'react';

/**
 * useGsapCardStagger
 * Smoothly reveals cards inside a container using GSAP ScrollTrigger.
 * Gracefully skips motion when prefers-reduced-motion is enabled.
 */
export function useGsapCardStagger(containerRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let ctx: { revert?: () => void } = {};

        const init = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const container = containerRef.current;
            if (!container) return;

            const cards = container.querySelectorAll<HTMLElement>('.gsap-card');
            if (!cards.length) return;

            ctx = gsap.context(() => {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power3.out',
                        stagger: 0.045,
                        clearProps: 'transform,opacity',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 92%',
                            once: true,
                        },
                    }
                );
            }, container);
        };

        init();
        return () => ctx.revert?.();
    }, [containerRef]);
}

/**
 * useHeroParallax
 * Subtle scroll-linked parallax for hero visual layers.
 */
export function useHeroParallax(heroRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let ctx: { revert?: () => void } = {};

        const init = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const hero = heroRef.current;
            if (!hero) return;

            const target = hero.querySelector<HTMLElement>('.hero-parallax-img');
            if (!target) return;

            ctx = gsap.context(() => {
                gsap.to(target, {
                    y: -28,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.2,
                    },
                });
            }, hero);
        };

        init();
        return () => ctx.revert?.();
    }, [heroRef]);
}
