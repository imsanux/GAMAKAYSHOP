import { NextResponse } from 'next/server';
import { Product } from '@/lib/supabase';
import {
    isLocalAdminRequest,
    readCatalog,
    writeCatalogAtomic,
    sanitizeSlug,
} from '@/lib/localGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID_CATEGORIES = new Set(['gaming', 'streaming', 'software', 'dating-social', 'subscriptions']);

export async function GET(req: Request) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        const products = await readCatalog();
        return NextResponse.json({
            products,
            total: products.length,
            isDev: process.env.NODE_ENV === 'development',
        });
    } catch (err) {
        console.error('Failed to read products.json:', err);
        return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const name = String(body.name || '').trim();
        const brand = String(body.brand || '').trim();
        const category = String(body.category || 'subscriptions').trim();
        const region = String(body.region || 'Global').trim() || 'Global';
        const delivery_type = body.delivery_type === 'Manual' ? 'Manual' : 'Instant';
        const image_url = String(body.image_url || '').trim();
        const logo_url = String(body.logo_url || image_url).trim();
        const description = String(body.description || '').trim();
        const in_stock = body.in_stock !== false;

        if (!name) {
            return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
        }
        if (!brand) {
            return NextResponse.json({ error: 'Brand name is required.' }, { status: 400 });
        }
        if (!VALID_CATEGORIES.has(category)) {
            return NextResponse.json({ error: 'Invalid category selected.' }, { status: 400 });
        }

        const rawDenoms = Array.isArray(body.denominations) ? body.denominations : [];
        const denominations = rawDenoms
            .map((d: { value?: unknown; price?: unknown }) => ({
                value: String(d?.value || '').trim(),
                price: Number(d?.price),
            }))
            .filter((d: { value: string; price: number }) => d.value.length > 0 && Number.isFinite(d.price) && d.price >= 0);

        if (denominations.length === 0) {
            return NextResponse.json(
                { error: 'Add at least one valid option with a label and price.' },
                { status: 400 }
            );
        }

        const products = await readCatalog();
        const baseSlug = sanitizeSlug(String(body.slug || name));
        if (!baseSlug) {
            return NextResponse.json({ error: 'Could not generate a valid URL slug.' }, { status: 400 });
        }

        let slug = baseSlug;
        const existingSlugs = new Set(products.map((p) => p.slug));
        let suffix = 2;
        while (existingSlugs.has(slug)) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const maxNumericId = products.reduce((max, p) => {
            const n = parseInt(p.id, 10);
            return Number.isFinite(n) && n > max ? n : max;
        }, 0);

        const newProduct: Product = {
            id: String(maxNumericId + 1),
            name,
            slug,
            category: category as Product['category'],
            brand,
            description,
            denominations,
            image_url,
            logo_url,
            delivery_type,
            region,
            in_stock,
        };

        const updated = [newProduct, ...products];
        await writeCatalogAtomic(updated);

        return NextResponse.json({ product: newProduct, total: updated.length }, { status: 201 });
    } catch (err) {
        console.error('Failed to create product:', err);
        return NextResponse.json({ error: 'Failed to save new product' }, { status: 500 });
    }
}
