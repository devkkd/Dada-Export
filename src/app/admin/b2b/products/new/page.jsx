'use client';

import B2BProductForm from '@/components/admin/B2BProductForm';
import AdminShell from '@/components/admin/AdminShell';

export default function NewB2BProductPage() {
  return (
    <AdminShell title="Add B2B Product">
      <B2BProductForm />
    </AdminShell>
  );
}
