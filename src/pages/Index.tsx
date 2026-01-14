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
import { TrailingCursor } from "@/components/animations/GSAPParallax";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <LocalCartDrawer />
        <NewsletterPopup />
        <TrailingCursor />
        
        <main>
          <HeroSection />
          
          {/* Smooth flowing sections without complex parallax */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedProducts />
            <CraftingVideoSection />
            <LookbookGallery />
            <CraftsmanshipSection />
            <CollectionShowcase />
            <Testimonials />
            <PromiseSection />
          </motion.div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;