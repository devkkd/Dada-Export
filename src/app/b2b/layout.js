import Header from '@/components/b2b/Header';
import Footer from '@/components/b2b/Footer';
import FloatingWhatsAppButton from '@/components/shared/Floatingwhatsappbutton';
import { B2BDataProvider } from '@/components/b2b/B2BDataContext';
import { getB2BLayoutData } from '@/lib/dataFetcher';

export default async function B2BLayout({ children }) {
  // Fetched ONCE on the server — all child components get data via context
  const data = await getB2BLayoutData();

  return (
    <B2BDataProvider data={data}>
      <Header />
      <FloatingWhatsAppButton />
      {children}
      <Footer />
    </B2BDataProvider>
  );
}
