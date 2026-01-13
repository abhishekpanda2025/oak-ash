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

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <NewsletterPopup />
        <main>
          <HeroSection />
          <FeaturedProducts />
          <CraftingVideoSection />
          <CraftsmanshipSection />
          <CollectionShowcase />
          <Testimonials />
          <PromiseSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
