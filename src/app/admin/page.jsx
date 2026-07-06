import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = { title: 'Dashboard — Admin' };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/admin/login');

  return <AdminDashboard />;
}
