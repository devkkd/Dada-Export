'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import B2BProductForm from '@/components/admin/B2BProductForm';
import AdminShell from '@/components/admin/AdminShell';

export default function EditB2BProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/b2b/products/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProduct(json.data);
        else setError(json.error || 'Product not found');
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminShell title="Edit B2B Product">
      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500 text-sm">{error}</div>
      ) : (
        <B2BProductForm product={product} />
      )}
    </AdminShell>
  );
}
