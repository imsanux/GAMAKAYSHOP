import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts, getProductsByCategory } from '@/lib/products';
import { buildProductMetadata, buildProductJsonLd, CANONICAL_PRODUCT_ALIASES } from '@/lib/seo';
import ProductPageClient from './ProductPageClient';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = CANONICAL_PRODUCT_ALIASES[slug] || slug;
  const product = getProductBySlug(resolvedSlug);
  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: true },
    };
  }
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (CANONICAL_PRODUCT_ALIASES[slug]) {
    permanentRedirect(`/product/${CANONICAL_PRODUCT_ALIASES[slug]}`);
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const { productSchema, breadcrumbSchema } = buildProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPageClient product={product} related={related} />
    </>
  );
}
