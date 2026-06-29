import Header from "@/components/retail/Header";
import SwitchBar from "@/components/shared/SwitchBar";
import Footer from "@/components/retail/footer"

export default function RetailLayout({ children }) {
  return (
    <>
      <Header />
      
      {children}
      <Footer />
    </>
  );
}