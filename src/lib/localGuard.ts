import path from 'path';
import { promises as fs } from 'fs';
import { Product } from './supabase';

export function isLocalHostHeader(hostHeader?: string | null): boolean {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') return false;
    if (!hostHeader) return false;
    const host = hostHeader.trim().toLowerCase();
    return (
        host === 'localhost' ||
        host.startsWith('localhost:') ||
        host === '127.0.0.1' ||
        host.startsWith('127.0.0.1:') ||
        host === '[::1]' ||
        host.startsWith('[::1]:')
    );
}

export function isLocalAdminRequest(req: Request): boolean {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') return false;
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return isLocalHostHeader(host);
}

export const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');
export const PRODUCT_IMAGES_DIR = path.join(process.cwd(), 'public', 'IMAGES', 'PRODUCTS');

export function sanitizeSlug(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

const RETRYABLE_WIN_CODES = new Set(['EBUSY', 'EPERM', 'EACCES', 'UNKNOWN']);

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readCatalog(): Promise<Product[]> {
    const raw = await fs.readFile(PRODUCTS_JSON_PATH, 'utf8');
    return JSON.parse(raw) as Product[];
}

export async function writeCatalogAtomic(products: Product[]): Promise<void> {
    const serialized = JSON.stringify(products, null, 2) + '\n';
    const delays = [60, 120, 220, 350, 500, 750];

    for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
            await fs.writeFile(PRODUCTS_JSON_PATH, serialized, 'utf8');
            return;
        } catch (err) {
            const code = (err as NodeJS.ErrnoException)?.code || '';
            if (attempt < delays.length && RETRYABLE_WIN_CODES.has(code)) {
                await sleep(delays[attempt]);
                continue;
            }
            throw err;
        }
    }
}
