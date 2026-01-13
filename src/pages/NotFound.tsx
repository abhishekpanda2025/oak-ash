import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { demoProducts } from "@/data/demoProducts";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { SizeGuideModal } from "@/components/products/SizeGuideModal";
import { useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const [quickViewProduct, setQuickViewProduct] = useState<typeof demoProducts[0] | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  
  // Get random featured products
  const featuredProducts = demoProducts.slice(0, 4);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <LocalCartDrawer />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center relative overflow-hidden pt-32 pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container-luxury text-center relative z-10">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="font-serif text-[120px] md:text-[180px] lg:text-[220px] leading-none font-normal text-neutral-200 select-none relative">
              <span className="relative">
                4
                <motion.span
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-amber-500" />
                </motion.span>
              </span>
              <span className="text-amber-500">0</span>
              <span>4</span>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-neutral-600 font-sans font-light text-lg max-w-lg mx-auto mb-10">
              The page you're looking for seems to have wandered off. 
              Let us help you find something beautiful instead.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 text-sm tracking-wide uppercase font-sans font-medium hover:bg-amber-600 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              to="/jewellery"
              className="group inline-flex items-center gap-3 border border-neutral-300 text-neutral-800 px-8 py-4 text-sm tracking-wide uppercase font-sans font-light hover:border-amber-500 hover:text-amber-600 transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Jewellery
            </Link>
            <Link
              to="/search"
              className="group inline-flex items-center gap-3 border border-neutral-300 text-neutral-800 px-8 py-4 text-sm tracking-wide uppercase font-sans font-light hover:border-amber-500 hover:text-amber-600 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Search Products
            </Link>
          </motion.div>

          {/* Decorative lines */}
          <motion.div
            className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 bg-white">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-xs tracking-luxury uppercase text-amber-600 mb-3 font-sans">
              Discover Our Collection
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">
              You May Also Like
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {featuredProducts.map((product) => (
              <DemoProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer Credit */}
      <section className="py-8 bg-neutral-100 border-t border-neutral-200">
        <div className="container-luxury text-center">
          <motion.p
            className="text-xs text-neutral-500 font-sans font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Design and developed by{" "}
            <a
              href="https://www.Cropxon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              CROPXON INNOVATIONS PVT LTD
            </a>
          </motion.p>
        </div>
      </section>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};

export default NotFound;
