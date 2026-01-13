import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LifestyleBanner } from "@/components/home/LifestyleBanner";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { PromiseSection } from "@/components/home/PromiseSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
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
