export const metadata = {
  title: 'Admin Panel — Dada Exports',
};

export default function AdminLayout({ children }) {
  // No shared header/footer — fully isolated admin shell
  return <>{children}</>;
}
