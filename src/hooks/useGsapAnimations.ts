'use client';
import { useEffect } from 'react';

/**
 * useGsapCardStagger
 * Applies GSAP ScrollTrigger batch stagger to product cards inside a container.
 * Each card fades + slides up with a cascade delay — GTA VI card-reveal style.
 */
export function useGsapCardStagger(containerRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        let ctx: { revert?: () => void } = {};

        const init = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const container = containerRef.current;
            if (!container) return;

            const cards = container.querySelectorAll<HTMLElement>('.gsap-card');
            if (!cards.length) return;

            // Set initial hidden state
            gsap.set(cards, { opacity: 0, y: 48, scale: 0.97 });

            ctx = gsap.context(() => {
                ScrollTrigger.batch(cards, {
                    onEnter: (batch) => {
                        gsap.to(batch, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.65,
                            ease: 'power3.out',
                            stagger: 0.08,
                        });
                    },
                    start: 'top 90%',
                    once: true,
                });
            }, container);
        };

        init();
        return () => ctx.revert?.();
    }, [containerRef]);
}

/**
 * useHeroParallax
 * Applies a subtle scroll-driven parallax to the hero banner image.
 * As the user scrolls, the image moves upward at half the scroll speed.
 */
export function useHeroParallax(heroRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        let ctx: { revert?: () => void } = {};

        const init = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const hero = heroRef.current;
            if (!hero) return;

            const img = hero.querySelector<HTMLElement>('.hero-parallax-img');
            if (!img) return;

            ctx = gsap.context(() => {
                gsap.to(img, {
                    y: -60,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                });
            }, hero);
        };

        init();
        return () => ctx.revert?.();
    }, [heroRef]);
}
