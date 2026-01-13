import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopifyProducts } from "@/components/products/ShopifyProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { LifestyleBanner } from "@/components/home/LifestyleBanner";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { PromiseSection } from "@/components/home/PromiseSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main>
        <HeroSection />
        <ShopifyProducts />
        <BrandStory />
        <FeaturedCategories />
        <LifestyleBanner />
        <CollectionShowcase />
        <Testimonials />
        <PromiseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
