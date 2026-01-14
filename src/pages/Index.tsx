import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CraftingVideoSection } from "@/components/home/CraftingVideoSection";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { PromiseSection } from "@/components/home/PromiseSection";
import { NewsletterPopup } from "@/components/home/NewsletterPopup";
import { PageTransition } from "@/components/animations/PageTransition";
import { LookbookGallery } from "@/components/lookbook/LookbookGallery";
import { VirtualTryOn } from "@/components/tryon/VirtualTryOn";
import { GSAPSection, TrailingCursor } from "@/components/animations/GSAPParallax";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <NewsletterPopup />
        <TrailingCursor />
        <VirtualTryOn />
        
        <main>
          <HeroSection />
          
          <GSAPSection index={1}>
            <FeaturedProducts />
          </GSAPSection>
          
          <GSAPSection index={2}>
            <CraftingVideoSection />
          </GSAPSection>
          
          <GSAPSection index={3}>
            <LookbookGallery />
          </GSAPSection>
          
          <GSAPSection index={4}>
            <CraftsmanshipSection />
          </GSAPSection>
          
          <GSAPSection index={5}>
            <CollectionShowcase />
          </GSAPSection>
          
          <GSAPSection index={6}>
            <Testimonials />
          </GSAPSection>
          
          <GSAPSection index={7}>
            <PromiseSection />
          </GSAPSection>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
