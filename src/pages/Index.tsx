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
import { PageFlipSection } from "@/components/animations/SectionTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <NewsletterPopup />
        <main>
          <HeroSection />
          
          <PageFlipSection index={1}>
            <FeaturedProducts />
          </PageFlipSection>
          
          <PageFlipSection index={2}>
            <CraftingVideoSection />
          </PageFlipSection>
          
          <PageFlipSection index={3}>
            <CraftsmanshipSection />
          </PageFlipSection>
          
          <PageFlipSection index={4}>
            <CollectionShowcase />
          </PageFlipSection>
          
          <PageFlipSection index={5}>
            <Testimonials />
          </PageFlipSection>
          
          <PageFlipSection index={6}>
            <PromiseSection />
          </PageFlipSection>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
