import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useLocalCartStore } from "@/stores/localCartStore";
import { SimilarProducts } from "@/components/products/SimilarProducts";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { toast } from "sonner";
import { useState } from "react";

// Import jewellery images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";

// Import eyewear images
import eyewearProduct1 from "@/assets/eyewear-product-1.jpg";
import eyewearProduct2 from "@/assets/eyewear-product-2.jpg";
import eyewearProduct3 from "@/assets/eyewear-product-3.jpg";
import eyewearProduct4 from "@/assets/eyewear-product-4.jpg";

import { DemoProduct } from "@/data/demoProducts";

const getProductImage = (product: DemoProduct): string => {
  // Eyewear images
  if (product.category === "eyewear") {
    if (product.handle.includes("aviator") || product.handle.includes("monaco")) {
      return eyewearProduct1;
    }
    if (product.handle.includes("cat-eye") || product.handle.includes("riviera")) {
      return eyewearProduct3;
    }
    if (product.handle.includes("oversized") || product.handle.includes("capri")) {
      return eyewearProduct4;
    }
    return eyewearProduct2;
  }

  // Jewellery images
  const images: Record<string, string> = {
    necklaces: productNecklace,
    earrings: productEarrings,
    rings: productRing,
    bangles: productBangle,
    bracelets: productBangle,
  };
  return images[product.category] || productNecklace;
};

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useLocalCartStore();
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);

  const handleRemove = (id: string, title: string) => {
    removeItem(id);
    toast.success("Removed from wishlist", {
      description: title,
    });
  };

  const handleAddToCart = (item: DemoProduct) => {
    addToCart(item, 1);
    toast.success("Added to bag!", {
      description: item.title,
    });
  };

  const handleClearAll = () => {
    clearWishlist();
    toast.success("Wishlist cleared");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />

        <main className="pt-32 pb-20">
          <div className="container-luxury">
            {/* Header */}
            <ScrollReveal>
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="font-serif text-4xl md:text-5xl mb-4">My Wishlist</h1>
                <p className="text-muted-foreground font-sans">
                  {items.length === 0
                    ? "Your wishlist is empty"
                    : `${items.length} ${items.length === 1 ? "item" : "items"} saved for later`}
                </p>
              </div>
            </ScrollReveal>

            {items.length === 0 ? (
              <ScrollReveal>
                <div className="text-center py-20 bg-secondary/50">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
                  <h2 className="font-serif text-2xl mb-4">Start Your Collection</h2>
                  <p className="text-muted-foreground font-sans max-w-md mx-auto mb-8">
                    Save your favorite pieces to your wishlist and never miss out on the jewelry you love.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/jewellery"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-sans text-sm tracking-wide uppercase hover:opacity-90 transition-opacity"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Explore Jewelry
                    </Link>
                    <Link
                      to="/eyewear"
                      className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-3 font-sans text-sm tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Explore Eyewear
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ) : (
              <>
                {/* Actions Bar */}
                <ScrollReveal className="flex justify-between items-center mb-8">
                  <Link
                    to="/jewellery"
                    className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                  <button
                    onClick={handleClearAll}
                    className="text-sm font-sans text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear All
                  </button>
                </ScrollReveal>

                {/* Wishlist Grid */}
                <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <StaggerItem key={item.id}>
                      <motion.div
                        layout
                        className="group bg-card border border-border/50 overflow-hidden"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Image */}
                        <Link to={`/product/${item.handle}`} className="block relative aspect-[3/4] overflow-hidden">
                          <img
                            src={getProductImage(item)}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {item.isNew && (
                              <span className="px-2 py-1 text-[10px] tracking-widest uppercase font-sans bg-primary text-primary-foreground">
                                New
                              </span>
                            )}
                            {item.isBestseller && (
                              <span className="px-2 py-1 text-[10px] tracking-widest uppercase font-sans bg-foreground text-background">
                                Bestseller
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemove(item.id, item.title);
                              }}
                              className="w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickViewProduct(item);
                              }}
                              className="w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="p-4">
                          <Link to={`/product/${item.handle}`}>
                            <h3 className="font-serif text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground font-sans mb-3">{item.material}</p>

                          <div className="flex items-center justify-between">
                            <span className="font-serif text-lg text-primary">${item.price}</span>
                            <motion.button
                              onClick={() => handleAddToCart(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-sm font-sans transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Add to Cart
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Similar Products Recommendations */}
                {items.length > 0 && (
                  <motion.div
                    className="mt-16 pt-12 border-t border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="font-serif text-2xl md:text-3xl text-center mb-8">You May Also Like</h2>
                    <SimilarProducts 
                      currentProduct={items[0]} 
                      title="Based on your wishlist" 
                    />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Wishlist;
