import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts, getProductsByCategory } from '@/lib/products';
import ProductPageClient from './ProductPageClient';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found — GAMAKAY Shop' };
  return {
    title: `${product.name} | Buy in Nepal — GAMAKAY Shop`,
    description: product.description ?? `Buy ${product.name} gift cards and subscriptions in Nepal. Delivered instantly via WhatsApp.`,
    openGraph: {
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductPageClient product={product} related={related} />;
}
