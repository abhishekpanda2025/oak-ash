import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { ArrowRight } from "lucide-react";

export const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);

  // Get first 6 products for featured section
  const featuredProducts = demoProducts.slice(0, 6);

  const handleQuickView = (product: DemoProduct) => {
    setQuickViewProduct(product);
  };

  return (
    <>
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
              to="/collection/new-in"
              className="inline-flex items-center gap-2 text-sm tracking-luxury uppercase font-sans mt-4 md:mt-0 text-muted-foreground hover:text-primary transition-colors link-elegant"
            >
              View All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <DemoProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};
