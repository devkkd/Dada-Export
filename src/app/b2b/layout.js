import Header from "@/components/b2b/Header";

import Footer from '@/components/b2b/Footer';
import FloatingWhatsAppButton from "@/components/shared/Floatingwhatsappbutton";
export default function B2BLayout({ children }) {
  return (
    <>
      <Header />
      <FloatingWhatsAppButton />
      {children}
      <Footer />
    </>
  );
}