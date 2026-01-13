import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { Sparkles } from "lucide-react";

// Import eyewear model images
import eyewearModel1 from "@/assets/eyewear-model-1.jpg";
import eyewearModel2 from "@/assets/eyewear-model-2.jpg";
import eyewearModel3 from "@/assets/eyewear-model-3.jpg";
import eyewearModel4 from "@/assets/eyewear-model-4.jpg";
import eyewearModel5 from "@/assets/eyewear-model-5.jpg";

const eyewearImages = [eyewearModel1, eyewearModel2, eyewearModel3, eyewearModel4, eyewearModel5];

const Eyewear = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);
  const eyewearProducts = demoProducts.filter(p => p.category === "eyewear");

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
              <span className="font-sans font-medium">{eyewearProducts.length} exquisite pieces</span>
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

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {eyewearProducts.map((product, index) => (
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eyewear;
