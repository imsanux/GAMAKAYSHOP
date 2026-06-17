'use client';

import { ReactNode } from 'react';

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    // Disabled Lenis for raw performance, natively handles scroll
    return <>{children}</>;
}
