import type { Metadata } from 'next';
import { CATEGORY_SEO, buildCategoryMetadata, buildCategoryJsonLd } from '@/lib/seo';

export function generateStaticParams() {
    return Object.keys(CATEGORY_SEO).map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    return buildCategoryMetadata(slug);
}

export default async function CategorySlugLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { collectionSchema, breadcrumbSchema } = buildCategoryJsonLd(slug);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
