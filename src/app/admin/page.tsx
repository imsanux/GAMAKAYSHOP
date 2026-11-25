import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { isLocalHostHeader } from '@/lib/localGuard';
import AdminCatalogClient from './AdminCatalogClient';

export const dynamic = 'force-dynamic';

export default async function LocalAdminPage() {
    const reqHeaders = await headers();
    const host = reqHeaders.get('x-forwarded-host') || reqHeaders.get('host');

    if (!isLocalHostHeader(host)) {
        notFound();
    }

    return <AdminCatalogClient isDevServer={process.env.NODE_ENV === 'development'} />;
}
