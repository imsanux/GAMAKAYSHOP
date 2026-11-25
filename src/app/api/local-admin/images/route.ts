import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isLocalAdminRequest, PRODUCT_IMAGES_DIR, sanitizeSlug } from '@/lib/localGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
    'image/webp': '.webp',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/avif': '.avif',
};
const ALLOWED_EXTS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.avif']);

export async function GET(req: Request) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
        const entries = await fs.readdir(PRODUCT_IMAGES_DIR, { withFileTypes: true });
        const images = entries
            .filter((e) => e.isFile() && ALLOWED_EXTS.has(path.extname(e.name).toLowerCase()))
            .map((e) => `/IMAGES/PRODUCTS/${e.name}`)
            .sort((a, b) => a.localeCompare(b));

        return NextResponse.json({ images, total: images.length });
    } catch (err) {
        console.error('Failed to list product images:', err);
        return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!isLocalAdminRequest(req)) {
        return NextResponse.json({ error: 'Local access only' }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const slugHint = String(formData.get('slug') || '').trim();

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
        }
        if (file.size === 0) {
            return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'Image must be 8 MB or smaller.' }, { status: 400 });
        }

        const extFromMime = ALLOWED_MIME_TO_EXT[file.type.toLowerCase()];
        const extFromName = path.extname(file.name).toLowerCase();
        const ext = extFromMime || (ALLOWED_EXTS.has(extFromName) ? extFromName : '');

        if (!ext) {
            return NextResponse.json(
                { error: 'Unsupported format. Upload WEBP, PNG, JPG, or AVIF.' },
                { status: 400 }
            );
        }

        const rawBase = slugHint || path.basename(file.name, extFromName);
        const safeBase = sanitizeSlug(rawBase).toUpperCase().replace(/-/g, '_') || `PRODUCT_${Date.now()}`;
        const fileName = `${safeBase}_${Date.now().toString(36)}${ext}`;

        await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
        const targetPath = path.resolve(PRODUCT_IMAGES_DIR, fileName);
        if (!targetPath.startsWith(path.resolve(PRODUCT_IMAGES_DIR) + path.sep)) {
            return NextResponse.json({ error: 'Invalid upload destination.' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(targetPath, Buffer.from(arrayBuffer));

        return NextResponse.json(
            { image_url: `/IMAGES/PRODUCTS/${fileName}`, fileName },
            { status: 201 }
        );
    } catch (err) {
        console.error('Failed to upload image:', err);
        return NextResponse.json({ error: 'Failed to save uploaded image' }, { status: 500 });
    }
}
