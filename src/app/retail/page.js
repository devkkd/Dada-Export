import HeroSection from "@/components/retail/Herosection";
import Header from "@/components/retail/Header";
import SwitchBar from "@/components/shared/SwitchBar";
import ProductDetail from "@/components/retail/ProductDetail";
import CollectionsSection from "@/components/retail/Collectionssection";
import NewArrivalSection from "@/components/retail/NewArrivalSection";
import BotanicalHeroSection from "@/components/retail/Botanicalherosection";
import Dress from "@/components/retail/Dress"
import SurpriseGiftBanner from "@/components/retail/Surprisegiftbanner";
import Tops from '@/components/retail/Tops'
import BottomWear from '@/components/retail/BottomWear'
import Review from '@/components/retail/Review'
import ConceptToCollection from "@/components/retail/ConceptToCollection";
export default function RetailHome() {
  return (
    <>
      <SwitchBar />
      <HeroSection />
      <ProductDetail />
      <CollectionsSection />
      <NewArrivalSection />
      <BotanicalHeroSection />
      <Dress />
      <SurpriseGiftBanner />
      <Tops />
      <BottomWear />
      <Review />
      <ConceptToCollection />
    </>
  );
}