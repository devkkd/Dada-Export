import AdminShell from '@/components/admin/AdminShell';
import RetailProductForm from '@/components/admin/RetailProductForm';
import { connectDB } from '@/lib/db';
import RetailProduct from '@/models/retail/RetailProduct';
import { notFound } from 'next/navigation';

export default async function EditRetailProductPage({ params }) {
  const { id } = await params;

  await connectDB();
  const raw = await RetailProduct.findById(id).lean();
  if (!raw) notFound();

  // Serialize for client
  const product = JSON.parse(JSON.stringify(raw));

  return (
    <AdminShell title="Edit Retail Product">
      <RetailProductForm product={product} />
    </AdminShell>
  );
}
