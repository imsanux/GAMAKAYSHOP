'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Image from 'next/image';

import Link from 'next/link';

export interface MarqueeItem {
    image: string;
    link: string;
}

interface DraggableMarqueeProps {
    items: MarqueeItem[];
    direction?: 'forward' | 'backward';
    speed?: number;
}

export default function DraggableMarquee({ items, direction = 'forward', speed = 1 }: DraggableMarqueeProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            dragFree: true,
        },
        [
            AutoScroll({
                playOnInit: true,
                speed: speed,
                direction: direction,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnFocusIn: false,
            })
        ]
    );

    return (
        <div
            className="embla"
            ref={emblaRef}
            style={{
                overflow: 'hidden',
                width: '100%',
                cursor: 'grab',
                padding: '8px 0'
            }}
            onMouseDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; }}
            onMouseUp={(e) => { e.currentTarget.style.cursor = 'grab'; }}
            onMouseLeave={(e) => { e.currentTarget.style.cursor = 'grab'; }}
        >
            <div className="embla__container" style={{ display: 'flex', touchAction: 'pan-y' }}>
                {/* We map the array multiple times to guarantee enough slides to fill ultrawide desktop screens for looping */}
                {[...items, ...items, ...items, ...items].map((item, index) => (
                    <div
                        key={index}
                        className="embla__slide"
                        style={{
                            flex: '0 0 auto',
                            minWidth: 0,
                            paddingLeft: '16px', // space between cards
                        }}
                    >
                        <Link
                            href={item.link}
                            style={{
                                display: 'block',
                                width: '160px',
                                height: '100px',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)',
                                position: 'relative',
                                border: '1px solid var(--border-light)',
                                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <Image
                                src={item.image}
                                alt="Gift Card Brand"
                                fill
                                sizes="(max-width: 768px) 160px, 160px"
                                style={{ objectFit: 'cover' }}
                                unoptimized
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
