'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem } from '@/lib/supabase';

interface LastAddedInfo {
    productName: string;
    denomination: string;
    price: number;
    timestamp: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, denomination: { value: string; price: number }, quantity?: number) => void;
    removeItem: (productId: string, denominationValue: string) => void;
    updateQuantity: (productId: string, denominationValue: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    lastAdded: LastAddedInfo | null;
    clearLastAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [lastAdded, setLastAdded] = useState<LastAddedInfo | null>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('giftcard-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('giftcard-cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // Auto-clear toast banner after 3.5 seconds
    useEffect(() => {
        if (!lastAdded) return;
        const timer = setTimeout(() => setLastAdded(null), 3500);
        return () => clearTimeout(timer);
    }, [lastAdded]);

    const addItem = useCallback((product: Product, denomination: { value: string; price: number }, quantity = 1) => {
        const qty = Math.max(1, Math.floor(quantity));
        setItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.product.id === product.id && item.denomination.value === denomination.value
            );

            if (existingIndex >= 0) {
                return prev.map((item, idx) =>
                    idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
                );
            }

            return [...prev, { product, denomination, quantity: qty }];
        });

        setLastAdded({
            productName: product.name,
            denomination: qty > 1 ? `${denomination.value} × ${qty}` : denomination.value,
            price: denomination.price * qty,
            timestamp: Date.now(),
        });
    }, []);

    const removeItem = useCallback((productId: string, denominationValue: string) => {
        setItems(prev =>
            prev.filter(item =>
                !(item.product.id === productId && item.denomination.value === denominationValue)
            )
        );
    }, []);

    const updateQuantity = useCallback((productId: string, denominationValue: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev =>
                prev.filter(item =>
                    !(item.product.id === productId && item.denomination.value === denominationValue)
                )
            );
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.product.id === productId && item.denomination.value === denominationValue
                    ? { ...item, quantity }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getTotal = useCallback(() => {
        return items.reduce((total, item) => total + (item.denomination.price * item.quantity), 0);
    }, [items]);

    const getItemCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const clearLastAdded = useCallback(() => setLastAdded(null), []);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotal,
            getItemCount,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            lastAdded,
            clearLastAdded,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
