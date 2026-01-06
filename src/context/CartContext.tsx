'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/lib/supabase';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, denomination: { value: string; price: number }) => void;
    removeItem: (productId: string, denominationValue: string) => void;
    updateQuantity: (productId: string, denominationValue: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

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

    const addItem = (product: Product, denomination: { value: string; price: number }) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.product.id === product.id && item.denomination.value === denomination.value
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }

            return [...prev, { product, denomination, quantity: 1 }];
        });
    };

    const removeItem = (productId: string, denominationValue: string) => {
        setItems(prev =>
            prev.filter(item =>
                !(item.product.id === productId && item.denomination.value === denominationValue)
            )
        );
    };

    const updateQuantity = (productId: string, denominationValue: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, denominationValue);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.product.id === productId && item.denomination.value === denominationValue
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotal = () => {
        return items.reduce((total, item) => total + (item.denomination.price * item.quantity), 0);
    };

    const getItemCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotal,
            getItemCount
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
