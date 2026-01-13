import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";

export const ShopifyProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const data = await getProducts(6);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              New Arrivals
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium">
              Just Landed
            </h2>
          </div>
          <Link
            to="/jewellery"
            className="inline-flex items-center text-sm tracking-luxury uppercase font-sans mt-4 md:mt-0 text-muted-foreground hover:text-primary transition-colors link-elegant"
          >
            View All Products
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-sans">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <motion.div
            className="text-center py-20 bg-cream-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-serif text-2xl mb-4">No products yet</h3>
            <p className="text-muted-foreground font-sans max-w-md mx-auto mb-6">
              Your store is ready! Add your first product by telling me what you'd like to sell and the price.
            </p>
            <p className="text-sm text-primary font-sans">
              Example: "Add a gold necklace for $189"
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.node.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
