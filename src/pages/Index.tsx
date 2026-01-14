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
import { SmoothStackingCard } from "@/components/animations/StackingCards";

const Index = () => {
  const sections = [
    { key: "featured", component: <FeaturedProducts /> },
    { key: "crafting", component: <CraftingVideoSection /> },
    { key: "lookbook", component: <LookbookGallery /> },
    { key: "craftsmanship", component: <CraftsmanshipSection /> },
    { key: "collection", component: <CollectionShowcase /> },
    { key: "testimonials", component: <Testimonials /> },
    { key: "promise", component: <PromiseSection /> },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <NewsletterPopup />
        <TrailingCursor />
        
        <main>
          <HeroSection />
          
          {/* Stacking Cards Animation Container */}
          <div className="relative" style={{ perspective: "1200px" }}>
            {sections.map((section, index) => (
              <SmoothStackingCard 
                key={section.key} 
                index={index} 
                totalCards={sections.length}
              >
                {section.component}
              </SmoothStackingCard>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
