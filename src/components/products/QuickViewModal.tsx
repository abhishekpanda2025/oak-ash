import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, Gem, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { DemoProduct } from "@/data/demoProducts";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";

// Import images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";
import modelJewelry from "@/assets/model-jewelry.jpg";

interface QuickViewModalProps {
  product: DemoProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

// Get 5 product images including model shots
const getProductImages = (product: DemoProduct): string[] => {
  const imageMap: Record<string, string[]> = {
    necklaces: [productNecklace, modelJewelry, productPearlEarrings, productEarrings, productNecklace],
    earrings: [productEarrings, modelJewelry, productPearlEarrings, productNecklace, productEarrings],
    rings: [productRing, modelJewelry, productSilverRings, productBangle, productRing],
    bangles: [productBangle, modelJewelry, productSilverRings, productRing, productBangle],
    bracelets: [productBangle, modelJewelry, productNecklace, productPearlEarrings, productBangle],
  };
  return imageMap[product.category] || [productNecklace, modelJewelry, productEarrings, productRing, productBangle];
};

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const { addItem: addToCart } = useLocalCartStore();

  // Reset state when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
    setIsZoomed(false);
  }, [product?.id]);

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (isOpen && product && !isZoomed) {
      autoScrollRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const images = getProductImages(product);
          return prev === images.length - 1 ? 0 : prev + 1;
        });
      }, 3000);
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isOpen, product, isZoomed]);

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
    addToCart(product, quantity);
    toast.success("Added to bag!", {
      description: `${product.title} × ${quantity}`,
    });
    onClose();
  };

  // Magnifying glass zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      setZoomPosition({ x: 50, y: 50 });
    }
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999]"
          />

          {/* Modal - Perfectly Centered using flex */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-lg pointer-events-auto"
            >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-amber-500 hover:text-white transition-colors shadow-lg rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="grid md:grid-cols-2 gap-0 w-full h-full max-h-[90vh] overflow-auto">
              {/* Image Gallery with Zoom */}
              <div 
                ref={imageContainerRef}
                className={`relative aspect-square md:aspect-[4/5] bg-neutral-100 overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isZoomed && setZoomPosition({ x: 50, y: 50 })}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                    style={isZoomed ? {
                      backgroundImage: `url(${images[currentImageIndex]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat',
                    } : undefined}
                  >
                    {!isZoomed && (
                      <img
                        src={images[currentImageIndex]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Zoom indicator */}
                <motion.div
                  className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 flex items-center gap-2 text-xs font-sans text-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="w-4 h-4" />
                      Click to zoom out
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-4 h-4" />
                      Click to zoom in
                    </>
                  )}
                </motion.div>

                {/* Navigation */}
                {images.length > 1 && !isZoomed && (
                  <>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}

                {/* Thumbnail Strip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/90 backdrop-blur-sm shadow-lg">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                      className={`w-12 h-12 overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? "ring-2 ring-amber-500 ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-amber-500 text-white">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-neutral-900 text-white">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Auto-scroll indicator */}
                {!isZoomed && (
                  <div className="absolute top-4 right-16 flex gap-1">
                    {images.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-1 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-amber-500 w-6" : "bg-white/50 w-1"
                        }`}
                        animate={index === currentImageIndex ? { width: 24 } : { width: 4 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-10 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-none">
                <div className="flex-1">
                  <motion.h2
                    className="font-serif text-2xl md:text-3xl text-neutral-900 mb-3"
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
                    <span className="font-serif text-2xl text-amber-600">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-neutral-400 line-through">
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </motion.div>

                  <motion.p
                    className="text-neutral-600 font-sans font-light leading-relaxed mb-6"
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
                      <Gem className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-neutral-500 font-sans">Material</p>
                        <p className="font-sans text-sm text-neutral-800">{product.material}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-neutral-500 font-sans">Care</p>
                        <p className="font-sans text-sm text-neutral-800">{product.care}</p>
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
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Quantity
                    </label>
                    <div className="flex items-center gap-1 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-amber-100 transition-colors text-lg font-light"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center font-sans bg-neutral-100 text-neutral-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-amber-100 transition-colors text-lg font-light"
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
                      className="flex-1 h-12 bg-neutral-900 text-white font-sans text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
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
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "border-neutral-300 hover:border-amber-500 hover:text-amber-500"
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
                    className="block text-center py-3 text-sm font-sans text-neutral-500 hover:text-amber-600 transition-colors underline underline-offset-4"
                  >
                    View Full Details
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
