import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { collections, getProductsByCollection, demoProducts, DemoProduct } from "@/data/demoProducts";
import { ArrowLeft, Sparkles } from "lucide-react";

// Import hero images
import heroJewelry from "@/assets/hero-jewelry.jpg";
import modelJewelry from "@/assets/model-jewelry.jpg";
import craftsmanship from "@/assets/craftsmanship.jpg";

const collectionImages: Record<string, string> = {
  "new-in": heroJewelry,
  "gold": modelJewelry,
  "silver": craftsmanship,
  "pearl": heroJewelry,
  "stones": modelJewelry,
  "two-tone": craftsmanship,
};

const Collection = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);
  
  const collection = collections.find(c => c.id === collectionId);
  const products = collectionId ? getProductsByCollection(collectionId) : demoProducts;
  
  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <div className="flex flex-col items-center justify-center min-h-screen pt-32">
          <h1 className="font-serif text-3xl mb-4">Collection not found</h1>
          <Link to="/jewellery" className="text-primary hover:underline font-sans">
            Back to all jewelry
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = collectionImages[collectionId || ""] || heroJewelry;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />

        {/* Hero Banner */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={heroImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </motion.div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-amber-400/60"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "110%",
                  opacity: 0,
                }}
                animate={{
                  y: "-10%",
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container-luxury pb-16 md:pb-24">
              {/* Breadcrumb */}
              <motion.nav 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ol className="flex items-center gap-2 text-sm font-sans text-white/80">
                  <li>
                    <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                  </li>
                  <li className="text-white/60">/</li>
                  <li>
                    <Link to="/jewellery" className="hover:text-amber-400 transition-colors">Jewellery</Link>
                  </li>
                  <li className="text-white/60">/</li>
                  <li className="text-amber-400 font-medium">{collection.name}</li>
                </ol>
              </motion.nav>

              {/* Title */}
              <div className="overflow-hidden">
                <motion.h1 
                  className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-4 drop-shadow-lg"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {collection.name}
                </motion.h1>
              </div>

              <motion.p 
                className="font-sans text-lg text-white/90 max-w-xl drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {collection.description}
              </motion.p>

              <motion.div 
                className="flex items-center gap-2 mt-6 text-sm text-amber-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-sans font-medium">{products.length} exquisite pieces</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <main className="py-20 md:py-28 bg-white">
          <div className="container-luxury">
            {/* Filter Bar */}
            <ScrollReveal className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <Link 
                  to="/jewellery" 
                  className="inline-flex items-center gap-2 text-sm font-sans text-neutral-600 hover:text-amber-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View all collections
                </Link>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-sans text-neutral-500">
                    {products.length} products
                  </span>
                  <select className="px-4 py-2 bg-neutral-100 text-sm font-sans border-0 focus:ring-1 focus:ring-amber-500 rounded">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>
            </ScrollReveal>

            {/* Products Grid */}
            {products.length > 0 ? (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {products.map((product, index) => (
                  <StaggerItem key={product.id}>
                    <DemoProductCard 
                      product={product} 
                      index={index} 
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-20">
                <h3 className="font-serif text-2xl mb-4 text-neutral-900">Coming Soon</h3>
                <p className="text-neutral-600 font-sans">
                  This collection is being curated. Check back soon!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Other Collections */}
        <section className="py-20 bg-neutral-50">
          <div className="container-luxury">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-neutral-900">
                Explore More Collections
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections
                .filter(c => c.id !== collectionId)
                .slice(0, 4)
                .map((col) => (
                  <StaggerItem key={col.id}>
                    <Link 
                      to={`/collection/${col.id}`}
                      className="group block relative aspect-[4/3] overflow-hidden"
                    >
                      <img
                        src={collectionImages[col.id] || heroJewelry}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif text-xl text-white group-hover:text-amber-400 transition-colors">
                          {col.name}
                        </h3>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
            </StaggerContainer>
          </div>
        </section>

        <Footer />

        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </PageTransition>
  );
};

export default Collection;
