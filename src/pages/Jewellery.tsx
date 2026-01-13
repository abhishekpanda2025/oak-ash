import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SizeGuideModal } from "@/components/products/SizeGuideModal";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { Loader2, SlidersHorizontal, Ruler, Sparkles } from "lucide-react";
import heroJewelry from "@/assets/hero-jewelry.jpg";

const categories = [
  { label: "All", value: "" },
  { label: "Earrings", value: "earrings" },
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Bangles", value: "bangles" },
  { label: "Bracelets", value: "bracelets" },
];

// Extract unique materials and styles from products
const getUniqueMaterials = (products: DemoProduct[]): string[] => {
  const materials = new Set<string>();
  products.forEach(p => {
    // Extract base material keywords
    const materialParts = p.material.toLowerCase();
    if (materialParts.includes("gold")) materials.add("Gold");
    if (materialParts.includes("silver") || materialParts.includes("sterling")) materials.add("Sterling Silver");
    if (materialParts.includes("pearl")) materials.add("Pearl");
    if (materialParts.includes("crystal") || materialParts.includes("zirconia")) materials.add("Crystal/CZ");
    if (materialParts.includes("titanium")) materials.add("Titanium");
  });
  return Array.from(materials);
};

const getUniqueStyles = (products: DemoProduct[]): string[] => {
  return ["Everyday", "Statement", "Minimalist", "Classic", "Modern"];
};

const Jewellery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);
  
  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Get jewellery products only
  const jewelleryProducts = useMemo(() => {
    return demoProducts.filter(p => p.category !== "eyewear");
  }, []);

  const availableMaterials = useMemo(() => getUniqueMaterials(jewelleryProducts), [jewelleryProducts]);
  const availableStyles = useMemo(() => getUniqueStyles(jewelleryProducts), [jewelleryProducts]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory, priceRange, selectedMaterials, selectedStyles]);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...jewelleryProducts];
    
    // Filter by category
    if (activeCategory) {
      products = products.filter(p => p.category === activeCategory);
    }
    
    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < Infinity) {
      products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    
    // Filter by materials
    if (selectedMaterials.length > 0) {
      products = products.filter(p => {
        const materialLower = p.material.toLowerCase();
        return selectedMaterials.some(m => {
          if (m === "Gold") return materialLower.includes("gold");
          if (m === "Sterling Silver") return materialLower.includes("silver") || materialLower.includes("sterling");
          if (m === "Pearl") return materialLower.includes("pearl");
          if (m === "Crystal/CZ") return materialLower.includes("crystal") || materialLower.includes("zirconia");
          if (m === "Titanium") return materialLower.includes("titanium");
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
  }, [jewelleryProducts, activeCategory, sortBy, priceRange, selectedMaterials, selectedStyles]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocalCartDrawer />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={heroJewelry}
            alt="Jewellery Collection"
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
              Our Collection
            </motion.p>
            <motion.h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4 text-white drop-shadow-lg"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Jewellery
            </motion.h1>
            <motion.p 
              className="text-white/90 font-sans max-w-lg mb-6 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Discover our curated collection of exquisite jewelry pieces, each crafted with passion and precision.
            </motion.p>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-black transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Ruler className="w-4 h-4" />
                Size Guide
              </motion.button>
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-sans font-medium">{filteredProducts.length} exquisite pieces</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="py-16 md:py-20 bg-white">
        <div className="container-luxury">
          {/* Category Filters */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 text-sm font-sans tracking-wide transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-amber-100 hover:text-amber-800"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
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
                  setActiveCategory("");
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
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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

export default Jewellery;
