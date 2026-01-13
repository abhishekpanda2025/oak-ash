import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SizeGuideModal } from "@/components/products/SizeGuideModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { Loader2, SlidersHorizontal, Ruler } from "lucide-react";

const categories = [
  { label: "All", value: "" },
  { label: "Earrings", value: "earrings" },
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Bangles", value: "bangles" },
  { label: "Bracelets", value: "bracelets" },
];

const Jewellery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory]);

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
    let products = [...demoProducts];
    
    // Filter by category
    if (activeCategory) {
      products = products.filter(p => p.category === activeCategory);
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
        // Featured - keep original order
        break;
    }
    
    return products;
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocalCartDrawer />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      <main className="pt-32 pb-20">
        <div className="container-luxury">
          {/* Page Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              Our Collection
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
              Jewellery
            </h1>
            <p className="text-muted-foreground font-sans max-w-lg mx-auto mb-6">
              Discover our curated collection of exquisite jewelry pieces, each crafted with passion and precision.
            </p>
            
            {/* Size Guide Button */}
            <motion.button
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans text-amber-600 border border-amber-500 hover:bg-amber-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Ruler className="w-4 h-4" />
              Size Guide
            </motion.button>
          </motion.div>

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

          {/* Product Filters */}
          <ProductFilters sortBy={sortBy} onSortChange={setSortBy} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-20 bg-cream-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-serif text-2xl mb-4">No products found</h3>
              <p className="text-muted-foreground font-sans max-w-md mx-auto mb-6">
                {activeCategory
                  ? `No products found in "${activeCategory}". Try a different category.`
                  : "No products available at the moment."}
              </p>
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
                  <DemoProductCard product={product} index={index} />
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
