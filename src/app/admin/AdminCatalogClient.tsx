'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/supabase';

interface Props {
    isDevServer: boolean;
}

interface DenomRow {
    value: string;
    price: string;
}

interface StructuredDesc {
    overview: string;
    bullets: string[];
    steps: string[];
    note: string;
}

interface EditorDraft {
    id: string | null; // null = creating new product
    name: string;
    slug: string;
    slugTouched: boolean;
    brand: string;
    category: Product['category'];
    region: string;
    delivery_type: 'Instant' | 'Manual';
    in_stock: boolean;
    image_url: string;
    denominations: DenomRow[];
    description: string;
    structured: StructuredDesc;
}

const CATEGORIES: { value: Product['category']; label: string }[] = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'software', label: 'Software & AI' },
    { value: 'dating-social', label: 'Dating & Social' },
    { value: 'subscriptions', label: 'Subscriptions' },
];

const REGION_PRESETS = ['Global', 'US', 'India', 'US & India'];

function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function parseToStructured(raw: string): StructuredDesc {
    const lines = (raw || '').split('\n').map((l) => l.trim()).filter(Boolean);
    const intro: string[] = [];
    const bullets: string[] = [];
    const steps: string[] = [];
    let note = '';

    for (const line of lines) {
        if (/^(what's included|how to redeem|features included):?$/i.test(line)) continue;
        if (line.startsWith('•') || line.startsWith('- ')) {
            bullets.push(line.replace(/^[•\-]\s*/, ''));
        } else if (/^\d+\.\s+/.test(line)) {
            steps.push(line.replace(/^\d+\.\s+/, ''));
        } else if (bullets.length > 0 || steps.length > 0) {
            note = note ? `${note} ${line}` : line;
        } else {
            intro.push(line);
        }
    }

    return {
        overview: intro.join('\n\n'),
        bullets: bullets.length > 0 ? bullets : [''],
        steps: steps.length > 0 ? steps : [''],
        note,
    };
}

function composeFromStructured(s: StructuredDesc): string {
    const parts: string[] = [];
    const overviewClean = s.overview
        .split(/\n{2,}/)
        .map((p) => p.replace(/\n/g, ' ').trim())
        .filter(Boolean);
    if (overviewClean.length > 0) {
        parts.push(overviewClean.join('\n\n'));
    }

    const cleanBullets = s.bullets.map((b) => b.trim()).filter(Boolean);
    if (cleanBullets.length > 0) {
        parts.push(`What's included:\n${cleanBullets.map((b) => `• ${b}`).join('\n')}`);
    }

    const cleanSteps = s.steps.map((st) => st.trim()).filter(Boolean);
    if (cleanSteps.length > 0) {
        parts.push(`How to redeem:\n${cleanSteps.map((st, idx) => `${idx + 1}. ${st}`).join('\n')}`);
    }

    if (s.note.trim()) {
        parts.push(s.note.trim());
    }

    return parts.join('\n\n').trim();
}

function productToDraft(p: Product): EditorDraft {
    const desc = p.description || '';
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        slugTouched: true,
        brand: p.brand,
        category: p.category,
        region: p.region || 'Global',
        delivery_type: p.delivery_type === 'Manual' ? 'Manual' : 'Instant',
        in_stock: p.in_stock !== false,
        image_url: p.image_url || '',
        denominations:
            p.denominations && p.denominations.length > 0
                ? p.denominations.map((d) => ({ value: d.value, price: String(d.price) }))
                : [{ value: 'Standard', price: '0' }],
        description: desc,
        structured: parseToStructured(desc),
    };
}

function emptyDraft(): EditorDraft {
    const starter: StructuredDesc = {
        overview: '',
        bullets: ['', '', ''],
        steps: [
            'Place your order and confirm your details on WhatsApp or Viber.',
            'Receive your digital code or activation instructions directly in chat.',
            'Redeem on your account and start using right away.',
        ],
        note: '',
    };
    return {
        id: null,
        name: '',
        slug: '',
        slugTouched: false,
        brand: '',
        category: 'gaming',
        region: 'Global',
        delivery_type: 'Instant',
        in_stock: true,
        image_url: '',
        denominations: [{ value: 'Standard', price: '' }],
        description: composeFromStructured(starter),
        structured: starter,
    };
}

function previewSeoTitle(name: string, minPrice: number): string {
    const clean = name.trim() || 'Product Name';
    const priceTag = minPrice > 0 ? ` (Rs. ${minPrice.toLocaleString()})` : '';
    const t1 = `Buy ${clean} in Nepal${priceTag} | Gamakay`;
    if (t1.length <= 63) return t1;
    const t2 = `${clean} Nepal${priceTag} | Gamakay`;
    if (t2.length <= 64) return t2;
    const compact = clean.replace(/\s*\([^)]*\)\s*$/g, '').trim();
    return `${compact} Nepal${priceTag} | Gamakay`;
}

export default function AdminCatalogClient({ isDevServer }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | Product['category'] | 'out-of-stock'>('all');

    const [draft, setDraft] = useState<EditorDraft | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [descMode, setDescMode] = useState<'structured' | 'raw'>('structured');

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [formError, setFormError] = useState('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Delete confirmation state
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteImageFile, setDeleteImageFile] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Existing image library modal state
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [libraryImages, setLibraryImages] = useState<string[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [librarySearch, setLibrarySearch] = useState('');

    // Mobile view switch ('list' | 'editor')
    const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = useCallback((type: 'success' | 'error', text: string) => {
        setToast({ type, text });
    }, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3800);
        return () => clearTimeout(t);
    }, [toast]);

    const fetchProducts = useCallback(async (selectId?: string | null) => {
        setLoading(true);
        setLoadError('');
        try {
            const res = await fetch('/api/local-admin/products', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load products');
            const list = (data.products || []) as Product[];
            setProducts(list);

            if (selectId) {
                const match = list.find((p) => p.id === selectId);
                if (match) {
                    setDraft(productToDraft(match));
                    setIsDirty(false);
                }
            } else if (list.length > 0) {
                setDraft((prev) => prev ?? productToDraft(list[0]));
            }
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : 'Unable to load catalog');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (!libraryOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLibraryOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [libraryOpen]);

    const openImageLibrary = async () => {
        setLibraryOpen(true);
        setLibrarySearch('');
        if (libraryImages.length > 0) return;
        setLibraryLoading(true);
        try {
            const res = await fetch('/api/local-admin/images', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) setLibraryImages(data.images || []);
        } finally {
            setLibraryLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        return products.filter((p) => {
            if (categoryFilter === 'out-of-stock') {
                if (p.in_stock !== false) return false;
            } else if (categoryFilter !== 'all' && p.category !== categoryFilter) {
                return false;
            }
            if (!q) return true;
            return (
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.slug.toLowerCase().includes(q) ||
                (p.region || '').toLowerCase().includes(q)
            );
        });
    }, [products, search, categoryFilter]);

    const filteredLibrary = useMemo(() => {
        const q = librarySearch.trim().toLowerCase();
        if (!q) return libraryImages;
        return libraryImages.filter((img) => img.toLowerCase().includes(q));
    }, [libraryImages, librarySearch]);

    const updateDraft = (updater: (prev: EditorDraft) => EditorDraft) => {
        setDraft((prev) => {
            if (!prev) return prev;
            return updater(prev);
        });
        setIsDirty(true);
        setFormError('');
        setConfirmDelete(false);
    };

    const handleSelectProduct = (p: Product) => {
        if (isDirty && !window.confirm('You have unsaved changes. Discard them and switch product?')) {
            return;
        }
        setDraft(productToDraft(p));
        setIsDirty(false);
        setFormError('');
        setConfirmDelete(false);
        setDeleteImageFile(false);
        setMobileView('editor');
    };

    const handleCreateNew = () => {
        if (isDirty && !window.confirm('You have unsaved changes. Discard them and start a new product?')) {
            return;
        }
        setDraft(emptyDraft());
        setDescMode('structured');
        setIsDirty(true);
        setFormError('');
        setConfirmDelete(false);
        setMobileView('editor');
    };

    const handleDuplicateCurrent = () => {
        if (!draft) return;
        const copy: EditorDraft = {
            ...draft,
            id: null,
            name: `${draft.name} (Copy)`,
            slug: `${draft.slug}-copy`,
            slugTouched: false,
            denominations: draft.denominations.map((d) => ({ ...d })),
            structured: {
                ...draft.structured,
                bullets: [...draft.structured.bullets],
                steps: [...draft.structured.steps],
            },
        };
        setDraft(copy);
        setIsDirty(true);
        setFormError('');
        setConfirmDelete(false);
        showToast('success', 'Duplicated into a new draft. Edit details and click Create Product.');
    };

    const handleUploadFile = async (file: File) => {
        if (!draft) return;
        setUploading(true);
        setFormError('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('slug', draft.slug || draft.name || 'product');

            const res = await fetch('/api/local-admin/images', {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Image upload failed');

            updateDraft((prev) => ({ ...prev, image_url: data.image_url }));
            setLibraryImages((prev) => [data.image_url, ...prev.filter((i) => i !== data.image_url)]);
            showToast('success', `Uploaded ${data.fileName}`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Image upload failed';
            setFormError(msg);
            showToast('error', msg);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = useCallback(async () => {
        if (!draft || saving) return;
        setFormError('');

        const finalDescription =
            descMode === 'structured' ? composeFromStructured(draft.structured) : draft.description.trim();

        const payload = {
            name: draft.name.trim(),
            slug: slugify(draft.slug || draft.name),
            brand: draft.brand.trim(),
            category: draft.category,
            region: draft.region.trim() || 'Global',
            delivery_type: draft.delivery_type,
            in_stock: draft.in_stock,
            image_url: draft.image_url.trim(),
            logo_url: draft.image_url.trim(),
            description: finalDescription,
            denominations: draft.denominations
                .map((d) => ({ value: d.value.trim(), price: Number(d.price) }))
                .filter((d) => d.value.length > 0 && Number.isFinite(d.price) && d.price >= 0),
        };

        if (!payload.name) {
            setFormError('Enter a product name before saving.');
            return;
        }
        if (!payload.brand) {
            setFormError('Enter a brand name before saving.');
            return;
        }
        if (payload.denominations.length === 0) {
            setFormError('Add at least one option with a label and price (Rs.).');
            return;
        }

        setSaving(true);
        try {
            const isNew = draft.id === null;
            const endpoint = isNew
                ? '/api/local-admin/products'
                : `/api/local-admin/products/${encodeURIComponent(draft.id!)}`;
            const res = await fetch(endpoint, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save product');

            const saved: Product = data.product;
            setProducts((prev) => {
                if (isNew) return [saved, ...prev];
                return prev.map((p) => (p.id === saved.id ? saved : p));
            });
            setDraft(productToDraft(saved));
            setIsDirty(false);
            showToast(
                'success',
                isNew
                    ? `Created "${saved.name}" in src/data/products.json`
                    : `Saved "${saved.name}" to src/data/products.json`
            );
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Save failed';
            setFormError(msg);
            showToast('error', msg);
        } finally {
            setSaving(false);
        }
    }, [draft, saving, descMode, showToast]);

    // Ctrl+S / Cmd+S quick save
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleSave]);

    const handleDelete = async () => {
        if (!draft || !draft.id || deleting) return;
        setDeleting(true);
        try {
            const query = deleteImageFile ? '?deleteImage=true' : '';
            const res = await fetch(`/api/local-admin/products/${encodeURIComponent(draft.id)}${query}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Delete failed');

            const remaining = products.filter((p) => p.id !== draft.id);
            setProducts(remaining);
            setDraft(remaining.length > 0 ? productToDraft(remaining[0]) : emptyDraft());
            setIsDirty(false);
            setConfirmDelete(false);
            setDeleteImageFile(false);
            setMobileView('list');
            showToast(
                'success',
                data.imageDeleted
                    ? 'Product and unused image deleted from disk.'
                    : 'Product removed from src/data/products.json.'
            );
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Delete failed';
            setFormError(msg);
            showToast('error', msg);
        } finally {
            setDeleting(false);
        }
    };

    const minDraftPrice = useMemo(() => {
        if (!draft) return 0;
        const nums = draft.denominations.map((d) => Number(d.price)).filter((n) => Number.isFinite(n) && n > 0);
        return nums.length > 0 ? Math.min(...nums) : 0;
    }, [draft]);

    const outOfStockCount = useMemo(
        () => products.filter((p) => p.in_stock === false).length,
        [products]
    );

    return (
        <div className="admin-shell">
            {/* Top Toolbar */}
            <div className="admin-topbar">
                <div className="container">
                    <div className="admin-topbar-row">
                        <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <h1 className="font-display" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)', margin: 0 }}>
                                    Catalog Manager
                                </h1>
                                <span className="admin-env-pill" data-live={isDevServer}>
                                    <span className="admin-env-dot" />
                                    {isDevServer ? 'Local Dev · Live Reload' : 'Local Static · Rebuild to Publish'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#66635B', margin: '3px 0 0' }}>
                                {products.length} products in <code style={{ fontSize: '0.78rem', background: '#EFEDE6', padding: '1px 6px', borderRadius: '5px' }}>src/data/products.json</code> · Images save to <code style={{ fontSize: '0.78rem', background: '#EFEDE6', padding: '1px 6px', borderRadius: '5px' }}>public/IMAGES/PRODUCTS/</code>
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <Link href="/" className="btn btn-surface btn-sm">
                                View Storefront
                            </Link>
                            <button
                                type="button"
                                onClick={handleCreateNew}
                                className="btn btn-accent btn-sm"
                            >
                                + Add Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="admin-mobile-tabs container">
                <button
                    type="button"
                    className="admin-tab-btn"
                    data-active={mobileView === 'list'}
                    onClick={() => setMobileView('list')}
                >
                    Products ({filteredProducts.length})
                </button>
                <button
                    type="button"
                    className="admin-tab-btn"
                    data-active={mobileView === 'editor'}
                    onClick={() => setMobileView('editor')}
                >
                    {draft?.id ? 'Edit Product' : 'New Product'} {isDirty ? '·' : ''}
                </button>
            </div>

            {/* Main Workspace */}
            <div className="container" style={{ paddingTop: '20px', paddingBottom: '72px' }}>
                {loadError ? (
                    <div className="surface-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                        <p style={{ color: '#B91C1C', fontWeight: 600, marginBottom: '12px' }}>{loadError}</p>
                        <button type="button" onClick={() => fetchProducts()} className="btn btn-primary btn-sm">
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="admin-workspace" data-mobile-view={mobileView}>
                        {/* LEFT RAIL: Searchable Product List */}
                        <aside className="admin-sidebar surface-card">
                            <div style={{ padding: '14px', borderBottom: '1px solid #E8E5DC' }}>
                                <div style={{ position: 'relative', marginBottom: '10px' }}>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#66635B"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search name, brand, slug..."
                                        aria-label="Search products in catalog manager"
                                        className="input"
                                        style={{ paddingLeft: '36px', minHeight: '38px', fontSize: '0.86rem', borderRadius: '10px' }}
                                    />
                                </div>

                                <div className="filter-strip" style={{ gap: '5px' }}>
                                    {[
                                        { id: 'all', label: `All (${products.length})` },
                                        { id: 'gaming', label: 'Gaming' },
                                        { id: 'streaming', label: 'Streaming' },
                                        { id: 'software', label: 'Software' },
                                        { id: 'dating-social', label: 'Dating & Social' },
                                        { id: 'subscriptions', label: 'Subscriptions' },
                                        ...(outOfStockCount > 0 ? [{ id: 'out-of-stock', label: `Out (${outOfStockCount})` }] : []),
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            className="admin-mini-pill"
                                            data-active={categoryFilter === tab.id}
                                            onClick={() => setCategoryFilter(tab.id as typeof categoryFilter)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-product-list" data-lenis-prevent>
                                {loading ? (
                                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#66635B', fontSize: '0.86rem' }}>
                                        Loading catalog...
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#66635B', fontSize: '0.86rem' }}>
                                        No products match &ldquo;{search}&rdquo;.
                                    </div>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const selected = draft?.id === p.id;
                                        const prices = p.denominations.map((d) => d.price);
                                        const minP = prices.length ? Math.min(...prices) : 0;
                                        const maxP = prices.length ? Math.max(...prices) : 0;
                                        return (
                                            <button
                                                key={`${p.id}-${p.slug}`}
                                                type="button"
                                                onClick={() => handleSelectProduct(p)}
                                                className="admin-list-item"
                                                data-selected={selected}
                                            >
                                                <div className="admin-list-thumb">
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
                                                            alt=""
                                                            loading="lazy"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <span>{p.brand.slice(0, 2).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                                    <div className="admin-list-name">{p.name}</div>
                                                    <div className="admin-list-meta">
                                                        <span>{p.brand}</span>
                                                        <span>·</span>
                                                        <span className="tabular-nums">
                                                            Rs. {minP.toLocaleString()}
                                                            {maxP > minP ? `–${maxP.toLocaleString()}` : ''}
                                                        </span>
                                                        {p.in_stock === false && (
                                                            <span style={{ color: '#B91C1C', fontWeight: 600 }}>· Out</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </aside>

                        {/* RIGHT PANEL: Full Product Editor */}
                        <section className="admin-editor">
                            {!draft ? (
                                <div className="surface-card" style={{ padding: '56px 24px', textAlign: 'center', color: '#66635B' }}>
                                    Select a product on the left or click <strong>+ Add Product</strong>.
                                </div>
                            ) : (
                                <div className="surface-card" style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
                                    {/* Editor Header */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', paddingBottom: '18px', borderBottom: '1px solid #E8E5DC', marginBottom: '22px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#66635B' }}>
                                                    {draft.id ? `Editing ID #${draft.id}` : 'New Product Draft'}
                                                </span>
                                                {isDirty && (
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '9999px' }}>
                                                        Unsaved changes
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="font-display" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.65rem)', margin: '4px 0 0' }}>
                                                {draft.name.trim() || 'Untitled Product'}
                                            </h2>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            {draft.id && draft.slug && (
                                                <Link
                                                    href={`/product/${draft.slug}`}
                                                    target="_blank"
                                                    className="btn btn-surface btn-sm"
                                                >
                                                    Open Page
                                                </Link>
                                            )}
                                            {draft.id && (
                                                <button
                                                    type="button"
                                                    onClick={handleDuplicateCurrent}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Duplicate
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="btn btn-accent btn-sm"
                                            >
                                                {saving ? 'Saving...' : draft.id ? 'Save Changes' : 'Create Product'}
                                            </button>
                                        </div>
                                    </div>

                                    {formError && (
                                        <div
                                            role="alert"
                                            style={{
                                                padding: '12px 14px',
                                                borderRadius: '12px',
                                                background: '#FEF2F2',
                                                border: '1px solid rgba(185, 28, 28, 0.22)',
                                                color: '#B91C1C',
                                                fontSize: '0.86rem',
                                                fontWeight: 500,
                                                marginBottom: '20px',
                                            }}
                                        >
                                            {formError}
                                        </div>
                                    )}

                                    {/* 1. IMAGE + CORE METADATA GRID */}
                                    <div className="admin-top-fields">
                                        {/* Image Uploader & Preview */}
                                        <div className="admin-image-box">
                                            <div
                                                className="admin-image-dropzone"
                                                data-dragover={isDragOver}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragOver(true);
                                                }}
                                                onDragLeave={() => setIsDragOver(false)}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragOver(false);
                                                    const f = e.dataTransfer.files?.[0];
                                                    if (f) handleUploadFile(f);
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        fileInputRef.current?.click();
                                                    }
                                                }}
                                                aria-label="Upload product image"
                                            >
                                                {draft.image_url ? (
                                                    <img
                                                        src={draft.image_url}
                                                        alt={draft.name || 'Product preview'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                    />
                                                ) : (
                                                    <div style={{ textAlign: 'center', padding: '16px', color: '#66635B' }}>
                                                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#181818', marginBottom: '4px' }}>
                                                            Drop image here
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem' }}>WEBP, PNG, JPG · max 8MB</div>
                                                    </div>
                                                )}
                                                {uploading && (
                                                    <div className="admin-upload-overlay">Uploading...</div>
                                                )}
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/webp,image/png,image/jpeg,image/avif"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleUploadFile(f);
                                                }}
                                            />

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ width: '100%', fontSize: '0.78rem' }}
                                                >
                                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={openImageLibrary}
                                                    className="btn btn-surface btn-sm"
                                                    style={{ width: '100%', fontSize: '0.78rem' }}
                                                >
                                                    Library
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                value={draft.image_url}
                                                onChange={(e) => updateDraft((prev) => ({ ...prev, image_url: e.target.value }))}
                                                placeholder="/IMAGES/PRODUCTS/..."
                                                aria-label="Image path"
                                                className="input"
                                                style={{ marginTop: '8px', minHeight: '36px', fontSize: '0.76rem', padding: '6px 10px' }}
                                            />
                                        </div>

                                        {/* Core Form Inputs */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
                                            <div className="admin-grid-2">
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-name">Product Name</label>
                                                    <input
                                                        id="adm-name"
                                                        type="text"
                                                        value={draft.name}
                                                        onChange={(e) => {
                                                            const nextName = e.target.value;
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                name: nextName,
                                                                slug: prev.slugTouched ? prev.slug : slugify(nextName),
                                                            }));
                                                        }}
                                                        placeholder="e.g. Steam Wallet Gift Card (US)"
                                                        className="input"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-brand">Brand</label>
                                                    <input
                                                        id="adm-brand"
                                                        type="text"
                                                        value={draft.brand}
                                                        onChange={(e) => updateDraft((prev) => ({ ...prev, brand: e.target.value }))}
                                                        placeholder="e.g. Steam, Apple, OpenAI"
                                                        className="input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="admin-grid-2">
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-slug">URL Slug</label>
                                                    <input
                                                        id="adm-slug"
                                                        type="text"
                                                        value={draft.slug}
                                                        onChange={(e) =>
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                slug: slugify(e.target.value),
                                                                slugTouched: true,
                                                            }))
                                                        }
                                                        placeholder="steam-wallet-gift-card-us"
                                                        className="input"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-category">Category</label>
                                                    <select
                                                        id="adm-category"
                                                        value={draft.category}
                                                        onChange={(e) =>
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                category: e.target.value as Product['category'],
                                                            }))
                                                        }
                                                        className="input"
                                                    >
                                                        {CATEGORIES.map((c) => (
                                                            <option key={c.value} value={c.value}>
                                                                {c.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="admin-grid-3">
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-region">Region</label>
                                                    <input
                                                        id="adm-region"
                                                        list="adm-region-presets"
                                                        value={draft.region}
                                                        onChange={(e) => updateDraft((prev) => ({ ...prev, region: e.target.value }))}
                                                        placeholder="Global"
                                                        className="input"
                                                    />
                                                    <datalist id="adm-region-presets">
                                                        {REGION_PRESETS.map((r) => (
                                                            <option key={r} value={r} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-delivery">Delivery</label>
                                                    <select
                                                        id="adm-delivery"
                                                        value={draft.delivery_type}
                                                        onChange={(e) =>
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                delivery_type: e.target.value as 'Instant' | 'Manual',
                                                            }))
                                                        }
                                                        className="input"
                                                    >
                                                        <option value="Instant">Instant</option>
                                                        <option value="Manual">Manual</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <span className="admin-label">Availability</span>
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={draft.in_stock}
                                                        onClick={() => updateDraft((prev) => ({ ...prev, in_stock: !prev.in_stock }))}
                                                        className="admin-stock-toggle"
                                                        data-in-stock={draft.in_stock}
                                                    >
                                                        <span className="admin-stock-dot" />
                                                        {draft.in_stock ? 'In stock' : 'Out of stock'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. DENOMINATIONS & PRICING */}
                                    <div className="admin-section">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '10px' }}>
                                            <div>
                                                <h3 className="admin-section-title">Options &amp; Pricing (NPR)</h3>
                                                <p style={{ fontSize: '0.78rem', color: '#66635B', margin: 0 }}>
                                                    Add card values or plan tiers (e.g. $10, 1 Month, Standard).
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateDraft((prev) => ({
                                                        ...prev,
                                                        denominations: [...prev.denominations, { value: '', price: '' }],
                                                    }))
                                                }
                                                className="btn btn-secondary btn-sm"
                                            >
                                                + Add Option
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {draft.denominations.map((row, idx) => (
                                                <div key={idx} className="admin-denom-row">
                                                    <input
                                                        type="text"
                                                        value={row.value}
                                                        onChange={(e) => {
                                                            const next = [...draft.denominations];
                                                            next[idx] = { ...next[idx], value: e.target.value };
                                                            updateDraft((prev) => ({ ...prev, denominations: next }));
                                                        }}
                                                        placeholder="Label (e.g. $25 or 1 Month)"
                                                        aria-label={`Option ${idx + 1} label`}
                                                        className="input"
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                    <div style={{ position: 'relative' }}>
                                                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.82rem', color: '#66635B', pointerEvents: 'none' }}>
                                                            Rs.
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            step={1}
                                                            value={row.price}
                                                            onChange={(e) => {
                                                                const next = [...draft.denominations];
                                                                next[idx] = { ...next[idx], price: e.target.value };
                                                                updateDraft((prev) => ({ ...prev, denominations: next }));
                                                            }}
                                                            placeholder="1850"
                                                            aria-label={`Option ${idx + 1} price in rupees`}
                                                            className="input tabular-nums"
                                                            style={{ paddingLeft: '40px', minHeight: '40px' }}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={draft.denominations.length <= 1}
                                                        onClick={() => {
                                                            const next = draft.denominations.filter((_, i) => i !== idx);
                                                            updateDraft((prev) => ({ ...prev, denominations: next }));
                                                        }}
                                                        aria-label={`Remove option ${idx + 1}`}
                                                        className="admin-icon-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3. DESCRIPTION EDITOR (Structured / Raw) */}
                                    <div className="admin-section">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                                            <div>
                                                <h3 className="admin-section-title">Product Description</h3>
                                                <p style={{ fontSize: '0.78rem', color: '#66635B', margin: 0 }}>
                                                    Structured fields automatically format for the product page and Google SEO.
                                                </p>
                                            </div>
                                            <div className="admin-segmented">
                                                <button
                                                    type="button"
                                                    data-active={descMode === 'structured'}
                                                    onClick={() => {
                                                        if (descMode === 'raw') {
                                                            setDraft((prev) =>
                                                                prev ? { ...prev, structured: parseToStructured(prev.description) } : prev
                                                            );
                                                        }
                                                        setDescMode('structured');
                                                    }}
                                                >
                                                    Structured
                                                </button>
                                                <button
                                                    type="button"
                                                    data-active={descMode === 'raw'}
                                                    onClick={() => {
                                                        if (descMode === 'structured') {
                                                            setDraft((prev) =>
                                                                prev ? { ...prev, description: composeFromStructured(prev.structured) } : prev
                                                            );
                                                        }
                                                        setDescMode('raw');
                                                    }}
                                                >
                                                    Raw Text
                                                </button>
                                            </div>
                                        </div>

                                        {descMode === 'structured' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                <div>
                                                    <label className="admin-label" htmlFor="adm-overview">
                                                        Overview Paragraphs <span style={{ fontWeight: 400, color: '#66635B' }}>(separate paragraphs with a blank line)</span>
                                                    </label>
                                                    <textarea
                                                        id="adm-overview"
                                                        rows={6}
                                                        value={draft.structured.overview}
                                                        onChange={(e) => {
                                                            const nextS = { ...draft.structured, overview: e.target.value };
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                structured: nextS,
                                                                description: composeFromStructured(nextS),
                                                            }));
                                                        }}
                                                        placeholder="Describe what the product includes, supported platforms, and how buyers in Nepal use it..."
                                                        className="input"
                                                        style={{ minHeight: '132px', resize: 'vertical', lineHeight: 1.55 }}
                                                    />
                                                </div>

                                                {/* What's Included Bullets */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span className="admin-label" style={{ margin: 0 }}>What&apos;s Included Bullets</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const nextS = { ...draft.structured, bullets: [...draft.structured.bullets, ''] };
                                                                updateDraft((prev) => ({ ...prev, structured: nextS }));
                                                            }}
                                                            style={{ background: 'none', border: 'none', fontSize: '0.78rem', fontWeight: 600, color: '#181818', cursor: 'pointer', textDecoration: 'underline' }}
                                                        >
                                                            + Add bullet
                                                        </button>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {draft.structured.bullets.map((b, idx) => (
                                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 34px', gap: '6px' }}>
                                                                <input
                                                                    type="text"
                                                                    value={b}
                                                                    onChange={(e) => {
                                                                        const nextB = [...draft.structured.bullets];
                                                                        nextB[idx] = e.target.value;
                                                                        const nextS = { ...draft.structured, bullets: nextB };
                                                                        updateDraft((prev) => ({
                                                                            ...prev,
                                                                            structured: nextS,
                                                                            description: composeFromStructured(nextS),
                                                                        }));
                                                                    }}
                                                                    placeholder={`Feature bullet ${idx + 1}`}
                                                                    className="input"
                                                                    style={{ minHeight: '38px', fontSize: '0.86rem' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const nextB = draft.structured.bullets.filter((_, i) => i !== idx);
                                                                        const nextS = { ...draft.structured, bullets: nextB.length ? nextB : [''] };
                                                                        updateDraft((prev) => ({
                                                                            ...prev,
                                                                            structured: nextS,
                                                                            description: composeFromStructured(nextS),
                                                                        }));
                                                                    }}
                                                                    aria-label={`Remove bullet ${idx + 1}`}
                                                                    className="admin-icon-btn"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* How to Redeem Steps */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span className="admin-label" style={{ margin: 0 }}>How to Redeem Steps</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const nextS = { ...draft.structured, steps: [...draft.structured.steps, ''] };
                                                                updateDraft((prev) => ({ ...prev, structured: nextS }));
                                                            }}
                                                            style={{ background: 'none', border: 'none', fontSize: '0.78rem', fontWeight: 600, color: '#181818', cursor: 'pointer', textDecoration: 'underline' }}
                                                        >
                                                            + Add step
                                                        </button>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {draft.structured.steps.map((st, idx) => (
                                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '26px 1fr 34px', gap: '6px', alignItems: 'center' }}>
                                                                <span className="tabular-nums" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#66635B', textAlign: 'center' }}>
                                                                    {idx + 1}.
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={st}
                                                                    onChange={(e) => {
                                                                        const nextSt = [...draft.structured.steps];
                                                                        nextSt[idx] = e.target.value;
                                                                        const nextS = { ...draft.structured, steps: nextSt };
                                                                        updateDraft((prev) => ({
                                                                            ...prev,
                                                                            structured: nextS,
                                                                            description: composeFromStructured(nextS),
                                                                        }));
                                                                    }}
                                                                    placeholder={`Redemption step ${idx + 1}`}
                                                                    className="input"
                                                                    style={{ minHeight: '38px', fontSize: '0.86rem' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const nextSt = draft.structured.steps.filter((_, i) => i !== idx);
                                                                        const nextS = { ...draft.structured, steps: nextSt.length ? nextSt : [''] };
                                                                        updateDraft((prev) => ({
                                                                            ...prev,
                                                                            structured: nextS,
                                                                            description: composeFromStructured(nextS),
                                                                        }));
                                                                    }}
                                                                    aria-label={`Remove step ${idx + 1}`}
                                                                    className="admin-icon-btn"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="admin-label" htmlFor="adm-note">Region / Compatibility Note</label>
                                                    <input
                                                        id="adm-note"
                                                        type="text"
                                                        value={draft.structured.note}
                                                        onChange={(e) => {
                                                            const nextS = { ...draft.structured, note: e.target.value };
                                                            updateDraft((prev) => ({
                                                                ...prev,
                                                                structured: nextS,
                                                                description: composeFromStructured(nextS),
                                                            }));
                                                        }}
                                                        placeholder="e.g. Requires a US-region account."
                                                        className="input"
                                                        style={{ minHeight: '40px', fontSize: '0.88rem' }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <textarea
                                                    rows={14}
                                                    value={draft.description}
                                                    onChange={(e) =>
                                                        updateDraft((prev) => ({
                                                            ...prev,
                                                            description: e.target.value,
                                                        }))
                                                    }
                                                    className="input"
                                                    style={{ minHeight: '280px', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', fontSize: '0.88rem' }}
                                                />
                                                <div className="tabular-nums" style={{ fontSize: '0.75rem', color: '#66635B', marginTop: '6px', textAlign: 'right' }}>
                                                    {draft.description.length} characters
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 4. LIVE GOOGLE SEO PREVIEW */}
                                    <div className="admin-seo-preview">
                                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#66635B', marginBottom: '6px' }}>
                                            Google Nepal SERP Preview
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#595751', marginBottom: '2px' }}>
                                            https://gamakay.com/product/{draft.slug || 'product-slug'}
                                        </div>
                                        <div style={{ fontSize: '1.02rem', fontWeight: 600, color: '#1A0DAB', lineHeight: 1.3, marginBottom: '4px' }}>
                                            {previewSeoTitle(draft.name, minDraftPrice)}
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: '#4D5156', lineHeight: 1.45 }}>
                                            Buy {draft.name.trim() || 'this product'} in Nepal
                                            {minDraftPrice > 0 ? ` from Rs. ${minDraftPrice.toLocaleString()}` : ''}. Pay via eSewa, Khalti or bank transfer with fast 5-15 min WhatsApp delivery.
                                        </div>
                                    </div>

                                    {/* 5. FOOTER ACTIONS + SAFE DELETE */}
                                    <div className="admin-footer-actions">
                                        {draft.id ? (
                                            !confirmDelete ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDelete(true)}
                                                    className="admin-delete-trigger"
                                                >
                                                    Delete Product
                                                </button>
                                            ) : (
                                                <div className="admin-delete-confirm">
                                                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#991B1B', marginBottom: '6px' }}>
                                                        Delete &ldquo;{draft.name}&rdquo;?
                                                    </div>
                                                    {draft.image_url.startsWith('/IMAGES/PRODUCTS/') && (
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: '#595751', marginBottom: '10px', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={deleteImageFile}
                                                                onChange={(e) => setDeleteImageFile(e.target.checked)}
                                                            />
                                                            Also delete image file if unused by other products
                                                        </label>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            type="button"
                                                            onClick={handleDelete}
                                                            disabled={deleting}
                                                            style={{
                                                                padding: '8px 14px',
                                                                borderRadius: '9999px',
                                                                border: 'none',
                                                                background: '#B91C1C',
                                                                color: '#FFFFFF',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                fontFamily: 'inherit',
                                                            }}
                                                        >
                                                            {deleting ? 'Deleting...' : 'Confirm Delete'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setConfirmDelete(false);
                                                                setDeleteImageFile(false);
                                                            }}
                                                            className="btn btn-surface btn-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#66635B' }}>
                                                Tip: Press Ctrl+S to save quickly.
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="btn btn-accent btn-lg"
                                        >
                                            {saving ? 'Saving...' : draft.id ? 'Save Changes' : 'Create Product'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {/* IMAGE LIBRARY MODAL */}
            {libraryOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Choose existing product image"
                    className="modal-backdrop-enter"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 220,
                        background: 'rgba(20, 20, 19, 0.56)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setLibraryOpen(false);
                    }}
                >
                    <div
                        className="modal-panel-enter"
                        style={{
                            width: '100%',
                            maxWidth: '760px',
                            maxHeight: '82vh',
                            background: '#F8F7F2',
                            borderRadius: '20px',
                            border: '1px solid #E8E5DC',
                            boxShadow: 'var(--shadow-xl)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <h3 className="font-display" style={{ fontSize: '1.2rem', margin: 0 }}>
                                Product Image Library ({libraryImages.length})
                            </h3>
                            <button
                                type="button"
                                onClick={() => setLibraryOpen(false)}
                                aria-label="Close image library"
                                className="admin-icon-btn"
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E8E5DC' }}>
                            <input
                                type="text"
                                value={librarySearch}
                                onChange={(e) => setLibrarySearch(e.target.value)}
                                placeholder="Filter filenames (e.g. playstation, steam, apple)..."
                                className="input"
                                style={{ minHeight: '40px' }}
                            />
                        </div>

                        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }} data-lenis-prevent>
                            {libraryLoading ? (
                                <p style={{ textAlign: 'center', color: '#66635B', padding: '32px 0' }}>Loading images...</p>
                            ) : filteredLibrary.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#66635B', padding: '32px 0' }}>No matching image files.</p>
                            ) : (
                                <div className="admin-library-grid">
                                    {filteredLibrary.map((imgUrl) => {
                                        const fileName = imgUrl.split('/').pop() || imgUrl;
                                        const isCurrent = draft?.image_url === imgUrl;
                                        return (
                                            <button
                                                key={imgUrl}
                                                type="button"
                                                onClick={() => {
                                                    updateDraft((prev) => ({ ...prev, image_url: imgUrl }));
                                                    setLibraryOpen(false);
                                                }}
                                                className="admin-library-tile"
                                                data-selected={isCurrent}
                                            >
                                                <div style={{ aspectRatio: '1 / 1', width: '100%', overflow: 'hidden', borderRadius: '10px', background: '#EFEDE6' }}>
                                                    <img
                                                        src={imgUrl}
                                                        alt={fileName}
                                                        loading="lazy"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                    />
                                                </div>
                                                <span className="admin-library-name">{fileName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STATUS TOAST */}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="cart-toast-enter"
                    style={{
                        position: 'fixed',
                        bottom: '22px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 240,
                        background: toast.type === 'error' ? '#991B1B' : '#141413',
                        color: '#F8F7F2',
                        padding: '11px 18px',
                        borderRadius: '9999px',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        boxShadow: '0 14px 32px rgba(20, 20, 19, 0.25)',
                        maxWidth: 'calc(100% - 32px)',
                        textAlign: 'center',
                    }}
                >
                    {toast.text}
                </div>
            )}

            <style>{`
                .admin-shell {
                    background: #F8F7F2;
                    min-height: 100vh;
                    padding-top: var(--header-height);
                }
                .admin-topbar {
                    background: #FFFFFF;
                    border-bottom: 1px solid #E8E5DC;
                    padding: 18px 0;
                }
                .admin-topbar-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .admin-env-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.74rem;
                    font-weight: 600;
                    background: #EFEDE6;
                    color: #181818;
                    border: 1px solid #E8E5DC;
                }
                .admin-env-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 9999px;
                    background: #D97706;
                }
                .admin-env-pill[data-live="true"] .admin-env-dot {
                    background: #11663A;
                }
                .admin-mobile-tabs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    padding-top: 14px;
                }
                .admin-tab-btn {
                    min-height: 40px;
                    border-radius: 9999px;
                    border: 1px solid #E8E5DC;
                    background: #FFFFFF;
                    color: #595751;
                    font-family: inherit;
                    font-size: 0.84rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .admin-tab-btn[data-active="true"] {
                    background: #141413;
                    border-color: #141413;
                    color: #F8F7F2;
                }
                .admin-workspace {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    align-items: start;
                }
                .admin-workspace[data-mobile-view="list"] .admin-editor { display: none; }
                .admin-workspace[data-mobile-view="editor"] .admin-sidebar { display: none; }

                @media (min-width: 960px) {
                    .admin-mobile-tabs { display: none; }
                    .admin-workspace {
                        grid-template-columns: 360px minmax(0, 1fr);
                        gap: 22px;
                    }
                    .admin-workspace .admin-sidebar,
                    .admin-workspace .admin-editor {
                        display: block !important;
                    }
                    .admin-sidebar {
                        position: sticky;
                        top: calc(var(--header-height) + 18px);
                    }
                }

                .admin-sidebar {
                    overflow: hidden;
                }
                .admin-mini-pill {
                    padding: 5px 10px;
                    border-radius: 9999px;
                    border: 1px solid #E8E5DC;
                    background: #F8F7F2;
                    color: #595751;
                    font-family: inherit;
                    font-size: 0.74rem;
                    font-weight: 500;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: background-color 0.14s ease, color 0.14s ease, border-color 0.14s ease;
                }
                .admin-mini-pill[data-active="true"] {
                    background: #141413;
                    border-color: #141413;
                    color: #F8F7F2;
                }
                .admin-product-list {
                    max-height: calc(100vh - 260px);
                    min-height: 360px;
                    overflow-y: auto;
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .admin-list-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 8px 10px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    cursor: pointer;
                    font-family: inherit;
                    transition: background-color 0.14s ease, border-color 0.14s ease;
                }
                .admin-list-item:hover {
                    background: #F8F7F2;
                }
                .admin-list-item[data-selected="true"] {
                    background: #EFEDE6;
                    border-color: #D7D3C7;
                }
                .admin-list-thumb {
                    width: 42px;
                    height: 42px;
                    border-radius: 9px;
                    overflow: hidden;
                    background: #EFEDE6;
                    border: 1px solid #E8E5DC;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.76rem;
                    font-weight: 700;
                    color: #66635B;
                }
                .admin-list-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #181818;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .admin-list-meta {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.75rem;
                    color: #66635B;
                    margin-top: 2px;
                }

                .admin-top-fields {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 22px;
                    margin-bottom: 24px;
                }
                @media (min-width: 720px) {
                    .admin-top-fields {
                        grid-template-columns: 200px minmax(0, 1fr);
                    }
                }
                .admin-image-dropzone {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #EFEDE6;
                    border: 1.5px dashed #C9C4B6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.16s ease, background-color 0.16s ease;
                }
                .admin-image-dropzone:hover,
                .admin-image-dropzone[data-dragover="true"] {
                    border-color: #181818;
                    background: #E8E5DC;
                }
                .admin-upload-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(20, 20, 19, 0.72);
                    color: #F8F7F2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .admin-label {
                    display: block;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #181818;
                    margin-bottom: 6px;
                }
                .admin-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                .admin-grid-3 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                @media (min-width: 600px) {
                    .admin-grid-2 { grid-template-columns: 1fr 1fr; }
                    .admin-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                }

                .admin-stock-toggle {
                    width: 100%;
                    min-height: 46px;
                    padding: 0 14px;
                    border-radius: 12px;
                    border: 1px solid #E8E5DC;
                    background: #FFFFFF;
                    color: #181818;
                    font-family: inherit;
                    font-size: 0.88rem;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }
                .admin-stock-dot {
                    width: 9px;
                    height: 9px;
                    border-radius: 9999px;
                    background: #B91C1C;
                }
                .admin-stock-toggle[data-in-stock="true"] .admin-stock-dot {
                    background: #11663A;
                }

                .admin-section {
                    padding-top: 22px;
                    margin-top: 22px;
                    border-top: 1px solid #E8E5DC;
                }
                .admin-section-title {
                    font-size: 0.96rem;
                    font-weight: 600;
                    color: #181818;
                    margin: 0 0 2px;
                }
                .admin-denom-row {
                    display: grid;
                    grid-template-columns: 1fr 130px 36px;
                    gap: 8px;
                    align-items: center;
                }
                .admin-icon-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 9999px;
                    border: 1px solid #E8E5DC;
                    background: #FFFFFF;
                    color: #595751;
                    font-size: 1.05rem;
                    line-height: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .admin-icon-btn:hover:not(:disabled) {
                    background: #EFEDE6;
                    color: #181818;
                }
                .admin-icon-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                .admin-segmented {
                    display: inline-flex;
                    background: #EFEDE6;
                    padding: 3px;
                    border-radius: 9999px;
                    border: 1px solid #E8E5DC;
                }
                .admin-segmented button {
                    padding: 5px 12px;
                    border-radius: 9999px;
                    border: none;
                    background: transparent;
                    color: #595751;
                    font-family: inherit;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .admin-segmented button[data-active="true"] {
                    background: #FFFFFF;
                    color: #181818;
                    box-shadow: 0 1px 3px rgba(24, 24, 24, 0.08);
                }

                .admin-seo-preview {
                    margin-top: 22px;
                    padding: 16px 18px;
                    border-radius: 14px;
                    background: #F8F7F2;
                    border: 1px solid #E8E5DC;
                }

                .admin-footer-actions {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #E8E5DC;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .admin-delete-trigger {
                    padding: 9px 16px;
                    border-radius: 9999px;
                    border: 1px solid rgba(185, 28, 28, 0.25);
                    background: transparent;
                    color: #B91C1C;
                    font-family: inherit;
                    font-size: 0.84rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .admin-delete-trigger:hover {
                    background: #FEF2F2;
                }
                .admin-delete-confirm {
                    padding: 12px 14px;
                    border-radius: 14px;
                    background: #FEF2F2;
                    border: 1px solid rgba(185, 28, 28, 0.22);
                }

                .admin-library-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
                    gap: 10px;
                }
                .admin-library-tile {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 6px;
                    border-radius: 12px;
                    border: 1.5px solid #E8E5DC;
                    background: #FFFFFF;
                    cursor: pointer;
                    font-family: inherit;
                    text-align: left;
                }
                .admin-library-tile:hover {
                    border-color: #181818;
                }
                .admin-library-tile[data-selected="true"] {
                    border-color: #181818;
                    background: #EFEDE6;
                }
                .admin-library-name {
                    font-size: 0.7rem;
                    color: #595751;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
