'use client';

import React from 'react';
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
    const duration = 30 / speed;

    return (
        <div style={{ overflow: 'hidden', width: '100%', padding: '8px 0', position: 'relative', display: 'flex' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-forward {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-backward {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .marquee-track-${direction} {
                    display: flex;
                    width: max-content;
                    animation: marquee-${direction} ${duration}s linear infinite;
                }
            `}} />
            <div className={`marquee-track-${direction}`} style={{ display: 'flex' }}>
                {/* Render the array 8 times to guarantee enough slides to fill ultrawide screens for a seamless 50% loop */}
                {[...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items].map((item, index) => (
                    <div
                        key={index}
                        style={{
                            flex: '0 0 auto',
                            paddingLeft: '16px',
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

