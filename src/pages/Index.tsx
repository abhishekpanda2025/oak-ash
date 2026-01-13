import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { PromiseSection } from "@/components/home/PromiseSection";
import { NewsletterPopup } from "@/components/home/NewsletterPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <NewsletterPopup />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CraftsmanshipSection />
        <CollectionShowcase />
        <Testimonials />
        <PromiseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;