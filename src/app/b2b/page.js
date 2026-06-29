import CollectionsSection from "@/components/b2b/Collectionssection";
import ConceptToCollection from "@/components/b2b/ConceptToCollection";
import ExclusiveSection from "@/components/b2b/ExclusiveSection";
import GlobalPresence from "@/components/b2b/GlobalPresence";
import HeroSection from "@/components/b2b/Herosection";
import LegacySection from "@/components/b2b/LegacySection";
import ManufacturingProcess from "@/components/b2b/ManufacturingProcess";
import NewArrivalSection from "@/components/b2b/NewArrivalSection";
import Testimonials from "@/components/b2b/Testimonials";
import WhyChooseDadaExports from '@/components/b2b/WhyChooseDadaExports';
import SwitchBar from "@/components/shared/SwitchBar";
export default function B2BHome() {
  return (
    <>
    <SwitchBar />
      <HeroSection />
      <CollectionsSection />
      <ExclusiveSection />
      <LegacySection />
      <NewArrivalSection />
      <WhyChooseDadaExports />
      <GlobalPresence />
      <ManufacturingProcess />
      <Testimonials />
      <ConceptToCollection />
    </>
  );
}