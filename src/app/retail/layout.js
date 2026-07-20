import Header                from '@/components/retail/Header';
import Footer                from '@/components/retail/footer';
import { RetailDataProvider } from '@/components/retail/RetailDataContext';
import { RetailAuthProvider }  from '@/context/RetailAuthContext';
import RetailSessionWrapper   from '@/components/retail/RetailSessionWrapper';
import { getRetailLayoutData } from '@/lib/dataFetcher';

export default async function RetailLayout({ children }) {
  const data = await getRetailLayoutData();

  return (
    // RetailSessionWrapper gives next-auth/react's signIn() the correct basePath
    // (needed only for Google OAuth redirect — does NOT poll /session)
    <RetailSessionWrapper>
      <RetailAuthProvider>
        <RetailDataProvider data={data}>
          <Header />
          {children}
          <Footer />
        </RetailDataProvider>
      </RetailAuthProvider>
    </RetailSessionWrapper>
  );
}
