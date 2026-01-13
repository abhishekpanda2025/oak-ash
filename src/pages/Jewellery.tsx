import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, SlidersHorizontal } from "lucide-react";

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
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const query = activeCategory ? `product_type:${activeCategory}` : undefined;
        const data = await getProducts(20, query);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

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
            <p className="text-muted-foreground font-sans max-w-lg mx-auto">
              Discover our curated collection of exquisite jewelry pieces, each crafted with passion and precision.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 text-sm font-sans tracking-wide transition-all ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-cream-dark hover:bg-primary/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && (
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
                  : "Your store doesn't have any products yet. Add products by telling me what you'd like to sell!"}
              </p>
            </motion.div>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {products.map((product, index) => (
                <ProductCard key={product.node.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jewellery;
