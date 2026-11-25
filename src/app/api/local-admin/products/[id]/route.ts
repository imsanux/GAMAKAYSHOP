import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/lib/supabase';
import {
    isLocalAdminRequest,
    readCatalog,
    writeCatalogAtomic,
    PRODUCT_IMAGES_DIR,
    sanitizeSlug,
} from '@/lib/localGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID_CATEGORIES = new Set(['gaming', 'streaming', 'software', 'dating-social', 'subscriptions']);

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        const { id } = await context.params;
        const body = await req.json();
        const products = await readCatalog();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        const existing = products[index];
        const name = String(body.name ?? existing.name).trim();
        const brand = String(body.brand ?? existing.brand).trim();
        const category = String(body.category ?? existing.category).trim();
        const region = String(body.region ?? existing.region ?? 'Global').trim() || 'Global';
        const delivery_type = body.delivery_type === 'Manual' ? 'Manual' : 'Instant';
        const image_url = String(body.image_url ?? existing.image_url).trim();
        const logo_url = String(body.logo_url ?? image_url).trim();
        const description = String(body.description ?? existing.description ?? '').trim();
        const in_stock = body.in_stock !== false;
        const slug = sanitizeSlug(String(body.slug ?? existing.slug));

        if (!name) {
            return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
        }
        if (!brand) {
            return NextResponse.json({ error: 'Brand name is required.' }, { status: 400 });
        }
        if (!slug) {
            return NextResponse.json({ error: 'A valid URL slug is required.' }, { status: 400 });
        }
        if (!VALID_CATEGORIES.has(category)) {
            return NextResponse.json({ error: 'Invalid category selected.' }, { status: 400 });
        }

        const slugConflict = products.find((p) => p.slug === slug && p.id !== id);
        if (slugConflict) {
            return NextResponse.json(
                { error: `Slug "${slug}" is already used by "${slugConflict.name}".` },
                { status: 409 }
            );
        }

        const rawDenoms = Array.isArray(body.denominations)
            ? body.denominations
            : existing.denominations;
        const denominations = rawDenoms
            .map((d: { value?: unknown; price?: unknown }) => ({
                value: String(d?.value || '').trim(),
                price: Number(d?.price),
            }))
            .filter((d: { value: string; price: number }) => d.value.length > 0 && Number.isFinite(d.price) && d.price >= 0);

        if (denominations.length === 0) {
            return NextResponse.json(
                { error: 'At least one option with a label and valid price is required.' },
                { status: 400 }
            );
        }

        const updatedProduct: Product = {
            ...existing,
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

        products[index] = updatedProduct;
        await writeCatalogAtomic(products);

        return NextResponse.json({ product: updatedProduct });
    } catch (err) {
        console.error('Failed to update product:', err);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        const { id } = await context.params;
        const url = new URL(req.url);
        const shouldDeleteImage = url.searchParams.get('deleteImage') === 'true';

        const products = await readCatalog();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        const [removed] = products.splice(index, 1);
        await writeCatalogAtomic(products);

        let imageDeleted = false;
        if (shouldDeleteImage && removed.image_url?.startsWith('/IMAGES/PRODUCTS/')) {
            const stillReferenced = products.some((p) => p.image_url === removed.image_url);
            if (!stillReferenced) {
                const fileName = path.basename(removed.image_url);
                const resolvedPath = path.resolve(PRODUCT_IMAGES_DIR, fileName);
                if (resolvedPath.startsWith(path.resolve(PRODUCT_IMAGES_DIR) + path.sep)) {
                    try {
                        await fs.unlink(resolvedPath);
                        imageDeleted = true;
                    } catch {
                        // File already missing on disk; safe to ignore
                    }
                }
            }
        }

        return NextResponse.json({
            deletedId: id,
            imageDeleted,
            total: products.length,
        });
    } catch (err) {
        console.error('Failed to delete product:', err);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
