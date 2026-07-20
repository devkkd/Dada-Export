import AdminShell from '@/components/admin/AdminShell';
import RetailProductForm from '@/components/admin/RetailProductForm';

export default function NewRetailProductPage() {
  return (
    <AdminShell title="New Retail Product">
      <RetailProductForm />
    </AdminShell>
  );
}
