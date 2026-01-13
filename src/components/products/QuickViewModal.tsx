import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, Gem, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DemoProduct } from "@/data/demoProducts";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

// Import images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";

interface QuickViewModalProps {
  product: DemoProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const getProductImages = (product: DemoProduct): string[] => {
  const imageMap: Record<string, string[]> = {
    necklaces: [productNecklace, productPearlEarrings, productEarrings],
    earrings: [productEarrings, productPearlEarrings, productNecklace],
    rings: [productRing, productSilverRings, productBangle],
    bangles: [productBangle, productSilverRings, productRing],
    bracelets: [productBangle, productNecklace, productPearlEarrings],
  };
  return imageMap[product.category] || [productNecklace, productEarrings, productRing];
};

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const images = getProductImages(product);
  const wishlisted = isInWishlist(product.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addItem(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: `${product.title} × ${quantity}`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-4xl max-h-[90vh] overflow-auto bg-background shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div className="relative aspect-square md:aspect-auto bg-secondary">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-primary w-6"
                          : "bg-foreground/30 hover:bg-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-primary text-primary-foreground">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-foreground text-background">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 md:p-10 flex flex-col">
                <div className="flex-1">
                  <motion.h2
                    className="font-serif text-2xl md:text-3xl mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {product.title}
                  </motion.h2>

                  <motion.div
                    className="flex items-baseline gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span className="font-serif text-2xl text-primary">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-muted-foreground line-through">
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </motion.div>

                  <motion.p
                    className="text-muted-foreground font-sans leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.description}
                  </motion.p>

                  {/* Material & Care */}
                  <motion.div
                    className="space-y-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-start gap-3">
                      <Gem className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-sans">Material</p>
                        <p className="font-sans text-sm">{product.material}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-sans">Care</p>
                        <p className="font-sans text-sm">{product.care}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quantity */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block font-sans">
                      Quantity
                    </label>
                    <div className="flex items-center gap-1 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-primary/10 transition-colors text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center font-sans bg-secondary">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-primary/10 transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Actions */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-primary text-primary-foreground font-sans text-sm tracking-wide uppercase flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      onClick={handleWishlist}
                      className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                        wishlisted
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary hover:text-primary"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                    </motion.button>
                  </div>

                  <Link
                    to={`/product/${product.handle}`}
                    onClick={onClose}
                    className="block text-center py-3 text-sm font-sans text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    View Full Details
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
