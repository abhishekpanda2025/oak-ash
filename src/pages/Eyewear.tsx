import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { Sparkles, Loader2, SlidersHorizontal } from "lucide-react";

// Import eyewear model images
import eyewearModel1 from "@/assets/eyewear-model-1.jpg";
import eyewearModel2 from "@/assets/eyewear-model-2.jpg";
import eyewearModel3 from "@/assets/eyewear-model-3.jpg";
import eyewearModel4 from "@/assets/eyewear-model-4.jpg";
import eyewearModel5 from "@/assets/eyewear-model-5.jpg";

const eyewearImages = [eyewearModel1, eyewearModel2, eyewearModel3, eyewearModel4, eyewearModel5];

// Extract unique materials for eyewear
const getUniqueMaterials = (products: DemoProduct[]): string[] => {
  const materials = new Set<string>();
  products.forEach(p => {
    const materialLower = p.material.toLowerCase();
    if (materialLower.includes("metal") || materialLower.includes("gold")) materials.add("Metal");
    if (materialLower.includes("acetate")) materials.add("Acetate");
    if (materialLower.includes("titanium")) materials.add("Titanium");
    if (materialLower.includes("tr90")) materials.add("TR90");
  });
  return Array.from(materials);
};

const Eyewear = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(false);
  
  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const eyewearProducts = useMemo(() => {
    return demoProducts.filter(p => p.category === "eyewear");
  }, []);

  const availableMaterials = useMemo(() => getUniqueMaterials(eyewearProducts), [eyewearProducts]);
  const availableStyles = useMemo(() => ["Aviator", "Cat-Eye", "Oversized", "Sport", "Classic"], []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...eyewearProducts];
    
    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < Infinity) {
      products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    
    // Filter by materials
    if (selectedMaterials.length > 0) {
      products = products.filter(p => {
        const materialLower = p.material.toLowerCase();
        return selectedMaterials.some(m => {
          if (m === "Metal") return materialLower.includes("metal") || materialLower.includes("gold");
          if (m === "Acetate") return materialLower.includes("acetate");
          if (m === "Titanium") return materialLower.includes("titanium");
          if (m === "TR90") return materialLower.includes("tr90");
          return false;
        });
      });
    }

    // Filter by styles
    if (selectedStyles.length > 0) {
      products = products.filter(p => {
        const titleLower = p.title.toLowerCase();
        const handleLower = p.handle.toLowerCase();
        return selectedStyles.some(s => {
          if (s === "Aviator") return titleLower.includes("aviator") || handleLower.includes("aviator");
          if (s === "Cat-Eye") return titleLower.includes("cat-eye") || handleLower.includes("cat-eye");
          if (s === "Oversized") return titleLower.includes("oversized") || handleLower.includes("oversized");
          if (s === "Sport") return titleLower.includes("sport") || handleLower.includes("sport");
          if (s === "Classic") return titleLower.includes("windsor") || titleLower.includes("optical");
          return false;
        });
      });
    }
    
    // Sort products
    switch (sortBy) {
      case "newest":
        products = products.filter(p => p.isNew).concat(products.filter(p => !p.isNew));
        break;
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        products = products.filter(p => p.isBestseller).concat(products.filter(p => !p.isBestseller));
        break;
      default:
        break;
    }
    
    return products;
  }, [eyewearProducts, sortBy, priceRange, selectedMaterials, selectedStyles]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocalCartDrawer />
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

      {/* Hero Banner with Model Images */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={eyewearModel1}
            alt="Eyewear Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </motion.div>

        <div className="absolute inset-0 flex items-end">
          <div className="container-luxury pb-12 md:pb-16">
            <motion.p 
              className="text-xs tracking-luxury uppercase text-amber-400 mb-4 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Premium Collection
            </motion.p>
            <motion.h1 
              className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium mb-4 text-white drop-shadow-lg"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Eyewear
            </motion.h1>
            <motion.p 
              className="text-white/90 font-sans max-w-lg mb-6 text-lg drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Luxury sunglasses and optical frames crafted for those who appreciate refined style.
            </motion.p>
            <motion.div 
              className="flex items-center gap-2 text-sm text-amber-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-sans font-medium">{filteredProducts.length} exquisite pieces</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Model Gallery */}
      <section className="py-12 bg-neutral-900">
        <div className="container-luxury">
          <motion.h2 
            className="text-center font-serif text-2xl md:text-3xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Styled for Every Occasion
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {eyewearImages.map((img, index) => (
              <motion.div
                key={index}
                className="relative aspect-[3/4] overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={img} 
                  alt={`Eyewear model ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="py-16 md:py-20 bg-white">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-4">Shop the Collection</h2>
            <p className="text-neutral-600 font-sans max-w-lg mx-auto">
              From classic aviators to bold oversized frames, find your perfect pair.
            </p>
          </motion.div>

          {/* Product Filters with Advanced Options */}
          <ProductFilters 
            sortBy={sortBy} 
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
            selectedStyles={selectedStyles}
            onStylesChange={setSelectedStyles}
            availableMaterials={availableMaterials}
            availableStyles={availableStyles}
            showAdvancedFilters={true}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-20 bg-neutral-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="font-serif text-2xl mb-4 text-neutral-900">No products found</h3>
              <p className="text-neutral-600 font-sans max-w-md mx-auto mb-6">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, Infinity]);
                  setSelectedMaterials([]);
                  setSelectedStyles([]);
                }}
                className="px-6 py-2 bg-amber-500 text-white font-sans text-sm hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}

          {/* Products Grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DemoProductCard 
                    product={product} 
                    index={index}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Products Count */}
          {!isLoading && filteredProducts.length > 0 && (
            <motion.p
              className="text-center text-sm text-neutral-500 mt-12 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </motion.p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eyewear;
