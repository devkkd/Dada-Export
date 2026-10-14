'use client';

export const dynamic = 'force-dynamic';

import AdminShell from '@/components/admin/AdminShell';
import RetailProductForm from '@/components/admin/RetailProductForm';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditRetailProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/retail/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <AdminShell title="Edit Retail Product">
        <div className="text-center text-gray-500">Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Edit Retail Product">
      {product && <RetailProductForm product={product} />}
    </AdminShell>
  );
}
