import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { ArrowRight } from "lucide-react";

export const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);

  // Get first 6 products for featured section
  const featuredProducts = demoProducts.slice(0, 6);

  const handleQuickView = (product: DemoProduct) => {
    setQuickViewProduct(product);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <>
      <section ref={ref} className="section-padding bg-background overflow-hidden">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div>
              <motion.p 
                className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                New Arrivals
              </motion.p>
              <motion.h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Just Landed
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/collection/new-in"
                className="inline-flex items-center gap-2 text-sm tracking-luxury uppercase font-sans mt-4 md:mt-0 text-muted-foreground hover:text-primary transition-colors link-elegant"
              >
                View All New Arrivals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Products Grid with stagger */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {featuredProducts.map((product, index) => (
              <motion.div key={product.id} variants={itemVariants}>
                <DemoProductCard
                  product={product}
                  index={index}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
          </motion.div>
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
