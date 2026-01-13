import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Minus, 
  Plus, 
  Truck, 
  RefreshCw, 
  Shield, 
  Sparkles,
  Check,
  ZoomIn,
  X,
  Package,
  Gem
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { Button } from "@/components/ui/button";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";
import { getProductByHandle, demoProducts, DemoProduct } from "@/data/demoProducts";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";

// Import images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";

const getProductImages = (product: DemoProduct): string[] => {
  const allImages = [productNecklace, productEarrings, productRing, productBangle, productPearlEarrings, productSilverRings];
  
  const imageMap: Record<string, string[]> = {
    necklaces: [productNecklace, productPearlEarrings, productEarrings],
    earrings: [productEarrings, productPearlEarrings, productNecklace],
    rings: [productRing, productSilverRings, productBangle],
    bangles: [productBangle, productSilverRings, productRing],
    bracelets: [productBangle, productNecklace, productPearlEarrings],
  };

  return imageMap[product.category] || allImages.slice(0, 3);
};

const DemoProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<DemoProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const backgroundX = useTransform(mouseX, [0, 1], ["-5%", "5%"]);
  const backgroundY = useTransform(mouseY, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    if (handle) {
      const foundProduct = getProductByHandle(handle);
      setProduct(foundProduct || null);
    }
  }, [handle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const images = product ? getProductImages(product) : [];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const { addItem: addToCart } = useLocalCartStore();

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      addToCart(product, quantity);
      toast.success("Added to bag!", {
        description: `${product.title} × ${quantity}`,
        position: "top-center",
      });
      
      setTimeout(() => setIsAdded(false), 2500);
    }, 800);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
    });
  };

  // Get related products
  const relatedProducts = demoProducts
    .filter(p => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <LocalCartDrawer />
          <div className="flex flex-col items-center justify-center min-h-screen pt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Gem className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
              <h1 className="font-serif text-3xl mb-4">Product not found</h1>
              <Link to="/jewellery" className="text-primary hover:underline font-sans">
                Continue shopping
              </Link>
            </motion.div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />

        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-8"
              onClick={() => setIsZoomed(false)}
            >
              <motion.button
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
              <motion.img
                src={currentImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-28 md:pt-32 pb-20">
          <div className="container-luxury">
            {/* Breadcrumb */}
            <motion.nav 
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ol className="flex items-center gap-2 text-sm font-sans text-muted-foreground flex-wrap">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link to="/jewellery" className="hover:text-primary transition-colors">Jewellery</Link></li>
                <li>/</li>
                <li className="text-foreground truncate max-w-[200px]">{product.title}</li>
              </ol>
            </motion.nav>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Main Image */}
                <div 
                  ref={imageContainerRef}
                  className="relative aspect-[3/4] bg-secondary overflow-hidden cursor-zoom-in group"
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsZoomed(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ x: backgroundX, y: backgroundY }}
                    >
                      <img
                        src={currentImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Zoom indicator */}
                  <motion.div
                    className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 flex items-center gap-2 text-sm font-sans opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to zoom</span>
                  </motion.div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}

                  {/* Image Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? "bg-primary w-6" 
                            : "bg-foreground/30 hover:bg-foreground/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-24 flex-shrink-0 overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? "ring-2 ring-primary"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="lg:sticky lg:top-32 lg:self-start space-y-6"
              >
                {/* Badges */}
                <div className="flex gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 text-xs tracking-widest uppercase font-sans bg-primary text-primary-foreground">
                      New Arrival
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="px-3 py-1 text-xs tracking-widest uppercase font-sans bg-foreground text-background">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
                    {product.title}
                  </h1>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl text-primary">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="font-sans text-lg text-muted-foreground line-through">
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  {product.description}
                </p>

                {/* Material & Care Accordion */}
                <div className="border-t border-b border-border divide-y divide-border">
                  <details className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-sans text-sm tracking-wide uppercase">
                      <span className="flex items-center gap-3">
                        <Gem className="w-4 h-4 text-primary" />
                        Material
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-muted-foreground font-sans pl-7">
                      {product.material}
                    </p>
                  </details>
                  <details className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-sans text-sm tracking-wide uppercase">
                      <span className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Care Instructions
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-muted-foreground font-sans pl-7">
                      {product.care}
                    </p>
                  </details>
                </div>

                {/* Size Selector (for rings) */}
                {product.category === "rings" && (
                  <div>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block font-sans">
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 flex items-center justify-center text-sm font-sans transition-all ${
                            selectedSize === size
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-primary/10 border border-border"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block font-sans">
                    Quantity
                  </label>
                  <div className="flex items-center gap-1">
                    <motion.button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-secondary hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="w-16 h-12 flex items-center justify-center font-sans text-lg bg-secondary">
                      {quantity}
                    </span>
                    <motion.button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-secondary hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 h-14 relative overflow-hidden bg-primary text-primary-foreground font-sans tracking-wide uppercase text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {isAdding ? (
                        <motion.div
                          key="adding"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div 
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          />
                        </motion.div>
                      ) : isAdded ? (
                        <motion.div
                          key="added"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute inset-0 flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </motion.div>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          Add to Cart — ${(product.price * quantity).toFixed(2)}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        duration: 1,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.2), transparent)",
                      }}
                    />
                  </motion.button>

                  <motion.button
                    onClick={handleWishlist}
                    className={`w-14 h-14 flex items-center justify-center border transition-colors ${
                      isWishlisted 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                  {[
                    { icon: Truck, label: "Free Shipping", sublabel: "Orders over $100" },
                    { icon: RefreshCw, label: "Easy Returns", sublabel: "30-day policy" },
                    { icon: Shield, label: "1 Year Warranty", sublabel: "Full coverage" },
                  ].map(({ icon: Icon, label, sublabel }) => (
                    <motion.div 
                      key={label}
                      className="text-center p-4 bg-secondary/50"
                      whileHover={{ y: -3 }}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <p className="text-xs font-sans font-medium">{label}</p>
                      <p className="text-xs font-sans text-muted-foreground mt-0.5">{sublabel}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20 bg-secondary">
            <div className="container-luxury">
              <ScrollReveal>
                <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
                  You May Also Love
                </h2>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <DemoProductCard 
                    key={relatedProduct.id} 
                    product={relatedProduct} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
};

export default DemoProductDetail;
