import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Product {
    id: string;
    name: string;
    brand: string;
    category: 'gaming' | 'streaming' | 'software' | 'subscriptions';
    region: string;
    denominations: { value: string; price: number }[];
    delivery_type: 'Instant' | 'Manual';
    image_url: string;
    logo_url: string;
    description?: string;
}

export interface Order {
    id: string;
    order_code: string;
    full_name: string;
    whatsapp: string;
    email?: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'verified' | 'delivered';
    receipt_url?: string;
    notes?: string;
    created_at: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    denomination: string;
    price: number;
    quantity: number;
}

export interface CartItem {
    product: Product;
    denomination: { value: string; price: number };
    quantity: number;
}

// Generate unique order code
export function generateOrderCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create order (demo - stores in localStorage)
export async function createOrder(orderData: {
    full_name: string;
    whatsapp: string;
    email: string;
    items: OrderItem[];
    total: number;
}): Promise<string> {
    const orderCode = generateOrderCode();

    const order: Order = {
        id: Date.now().toString(),
        order_code: orderCode,
        full_name: orderData.full_name,
        whatsapp: orderData.whatsapp,
        email: orderData.email,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        created_at: new Date().toISOString()
    };

    // Store in localStorage for demo
    if (typeof window !== 'undefined') {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    return orderCode;
}

// Get order by code (demo - reads from localStorage)
export async function getOrderByCode(code: string): Promise<Order | null> {
    if (typeof window === 'undefined') return null;

    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.find(o => o.order_code === code) || null;
}

