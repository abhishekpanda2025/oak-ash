import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart, ShoppingBag, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useLocalCartStore } from "@/stores/localCartStore";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";

// Import all model images
import modelHero1 from "@/assets/model-hero-1.jpg";
import modelHero2 from "@/assets/model-hero-2.jpg";
import modelHero3 from "@/assets/model-hero-3.jpg";
import modelHero4 from "@/assets/model-hero-4.jpg";
import modelHero5 from "@/assets/model-hero-5.jpg";
import modelHero6 from "@/assets/model-hero-6.jpg";
import modelHero7 from "@/assets/model-hero-7.jpg";
import modelHero8 from "@/assets/model-hero-8.jpg";
import modelHero11 from "@/assets/model-hero-11.jpg";
import modelHero12 from "@/assets/model-hero-12.jpg";
import modelHero13 from "@/assets/model-hero-13.jpg";
import modelHero14 from "@/assets/model-hero-14.jpg";
import modelHero15 from "@/assets/model-hero-15.jpg";
import modelHero16 from "@/assets/model-hero-16.jpg";
import modelHero17 from "@/assets/model-hero-17.jpg";
import modelHero18 from "@/assets/model-hero-18.jpg";
import modelHero19 from "@/assets/model-hero-19.jpg";
import modelHero20 from "@/assets/model-hero-20.jpg";

interface Look {
  id: string;
  image: string;
  title: string;
  description: string;
  products: DemoProduct[];
}

const looks: Look[] = [
  {
    id: "1",
    image: modelHero11,
    title: "Golden Heritage",
    description: "Traditional gold jewelry with modern elegance",
    products: demoProducts.filter(p => p.id === "6" || p.id === "18" || p.id === "4"),
  },
  {
    id: "2",
    image: modelHero12,
    title: "Bold Noir",
    description: "Statement sunglasses with golden hoops",
    products: demoProducts.filter(p => p.id === "9" || p.id === "19" || p.id === "15"),
  },
  {
    id: "3",
    image: modelHero13,
    title: "Pearl Glamour",
    description: "Timeless pearls with diamond accents",
    products: demoProducts.filter(p => p.id === "1" || p.id === "17" || p.id === "13"),
  },
  {
    id: "4",
    image: modelHero14,
    title: "Rose Gold Dreams",
    description: "Chain necklace with matching bracelet set",
    products: demoProducts.filter(p => p.id === "11" || p.id === "17" || p.id === "16"),
  },
  {
    id: "5",
    image: modelHero15,
    title: "Aviator Luxe",
    description: "Designer sunglasses with gold hoops",
    products: demoProducts.filter(p => p.id === "6" || p.id === "10" || p.id === "18"),
  },
  {
    id: "6",
    image: modelHero16,
    title: "Diamond Cascade",
    description: "Stunning diamond earrings with pearl necklace",
    products: demoProducts.filter(p => p.id === "2" || p.id === "20" || p.id === "16"),
  },
  {
    id: "7",
    image: modelHero17,
    title: "Emerald Royale",
    description: "Exquisite emerald and gold statement pieces",
    products: demoProducts.filter(p => p.id === "1" || p.id === "6" || p.id === "9"),
  },
  {
    id: "8",
    image: modelHero18,
    title: "Chain & Cat-Eye",
    description: "Layered gold chains with cat-eye sunglasses",
    products: demoProducts.filter(p => p.id === "9" || p.id === "15" || p.id === "18"),
  },
  {
    id: "9",
    image: modelHero19,
    title: "Vintage Elegance",
    description: "Timeless brooch with layered necklaces",
    products: demoProducts.filter(p => p.id === "4" || p.id === "6" || p.id === "11"),
  },
  {
    id: "10",
    image: modelHero20,
    title: "Modern Geometry",
    description: "Contemporary geometric earrings with minimal chain",
    products: demoProducts.filter(p => p.id === "2" || p.id === "10" || p.id === "13"),
  },
  {
    id: "11",
    image: modelHero1,
    title: "Classic Gold Collection",
    description: "Layered necklaces with signature style",
    products: demoProducts.filter(p => p.id === "1" || p.id === "17" || p.id === "13"),
  },
  {
    id: "12",
    image: modelHero6,
    title: "Rose Gold Romance",
    description: "Delicate rose gold jewelry combination",
    products: demoProducts.filter(p => p.id === "6" || p.id === "18" || p.id === "4"),
  },
  {
    id: "13",
    image: modelHero7,
    title: "Bold Statement",
    description: "Chunky gold chains with oversized frames",
    products: demoProducts.filter(p => p.id === "9" || p.id === "19" || p.id === "15"),
  },
  {
    id: "14",
    image: modelHero8,
    title: "Emerald Luxe",
    description: "Emerald accents with gold aviator frames",
    products: demoProducts.filter(p => p.id === "11" || p.id === "17" || p.id === "16"),
  },
  {
    id: "15",
    image: modelHero3,
    title: "Pearl & Gold Dreams",
    description: "Timeless pearls with elegant frames",
    products: demoProducts.filter(p => p.id === "6" || p.id === "10" || p.id === "18"),
  },
  {
    id: "16",
    image: modelHero4,
    title: "Diamond Chandelier",
    description: "Statement chandelier earrings",
    products: demoProducts.filter(p => p.id === "2" || p.id === "20" || p.id === "16"),
  },
];

// Look Detail Modal
const LookDetailModal = ({ look, isOpen, onClose }: { look: Look | null; isOpen: boolean; onClose: () => void }) => {
  const { addItem: addToWishlist, isInWishlist, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useLocalCartStore();
  
  if (!isOpen || !look) return null;

  const handleWishlist = (product: DemoProduct) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (product: DemoProduct) => {
    addToCart(product, 1);
    toast.success("Added to bag!");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white overflow-hidden"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 h-full">
          <div className="relative aspect-[3/4] md:aspect-auto">
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 overflow-y-auto max-h-[50vh] md:max-h-full">
            <p className="text-xs uppercase tracking-widest text-amber-600 mb-2">Complete the Look</p>
            <h2 className="font-serif text-3xl mb-2">{look.title}</h2>
            <p className="text-muted-foreground mb-6">{look.description}</p>

            <div className="space-y-4">
              {look.products.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-neutral-50 hover:bg-amber-50 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex-1">
                    <Link to={`/product/${product.handle}`} className="hover:text-amber-600 transition-colors">
                      <h4 className="font-serif text-lg">{product.title}</h4>
                    </Link>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
                    <p className="text-amber-600 font-serif text-lg mt-1">${product.price}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleWishlist(product)}
                      className={`w-10 h-10 flex items-center justify-center transition-colors ${
                        isInWishlist(product.id)
                          ? "bg-amber-500 text-black"
                          : "bg-neutral-200 hover:bg-amber-100"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-amber-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/wishlist"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-black font-medium hover:bg-amber-600 transition-colors"
            >
              <Heart className="w-4 h-4" />
              View My Wishlist
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Parallax Stacked Card Component with different effects
const StackedLookCard = ({ 
  look, 
  index, 
  totalCards, 
  currentIndex,
  parallaxOffset
}: { 
  look: Look; 
  index: number; 
  totalCards: number; 
  currentIndex: number;
  parallaxOffset: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem: addToWishlist, isInWishlist, removeItem } = useWishlistStore();

  const handleWishlist = (e: React.MouseEvent, product: DemoProduct) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  // Calculate card position based on current index
  const isActive = index === currentIndex;
  const isPrevious = index < currentIndex;
  const offset = index - currentIndex;

  // Different parallax effects based on card index
  const parallaxEffects = [
    { x: parallaxOffset * 0.5, y: 0, rotate: parallaxOffset * 0.02 },
    { x: -parallaxOffset * 0.3, y: parallaxOffset * 0.2, rotate: -parallaxOffset * 0.015 },
    { x: parallaxOffset * 0.4, y: -parallaxOffset * 0.15, rotate: parallaxOffset * 0.01 },
    { x: -parallaxOffset * 0.2, y: parallaxOffset * 0.1, rotate: -parallaxOffset * 0.025 },
  ];
  const effect = parallaxEffects[index % parallaxEffects.length];

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 w-full h-full"
      initial={false}
      animate={{
        y: isPrevious ? -200 : offset * 20 + (isActive ? effect.y : 0),
        x: isActive ? effect.x : 0,
        scale: isPrevious ? 1.08 : 1 - Math.max(0, offset) * 0.03,
        opacity: isPrevious ? 0 : 1 - Math.max(0, offset) * 0.12,
        zIndex: totalCards - index,
        rotateX: isPrevious ? 15 : 0,
        rotateZ: isActive ? effect.rotate : 0,
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformOrigin: "center top" }}
    >
      <div className="relative w-full h-full overflow-hidden shadow-2xl bg-white rounded-xl">
        {/* Image with parallax zoom effect */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            scale: isActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={look.image}
            alt={look.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0.7 }}
          animate={{ 
            opacity: isActive ? 1 : 0.5,
            background: isActive 
              ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)" 
              : "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)"
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Sparkle effect on active card */}
        {isActive && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full blur-sm" />
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full blur-sm" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full blur-sm" />
          </motion.div>
        )}
        
        {/* Content */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isActive ? 1 : 0.6, 
            y: isActive ? 0 : 15,
          }}
          transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
        >
          <motion.p 
            className="text-xs uppercase tracking-widest text-amber-400 mb-1"
            animate={{ x: isActive ? [20, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            Look {index + 1} of {totalCards}
          </motion.p>
          <motion.h3 
            className="font-serif text-xl md:text-2xl lg:text-3xl mb-1.5"
            animate={{ x: isActive ? [30, 0] : 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {look.title}
          </motion.h3>
          <motion.p 
            className="text-white/70 mb-3 text-sm max-w-md"
            animate={{ x: isActive ? [40, 0] : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {look.description}
          </motion.p>
          
          {/* Product Pills with stagger animation */}
          <motion.div 
            className="flex flex-wrap gap-2"
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {look.products.slice(0, 3).map((product, pIndex) => (
              <motion.button
                key={product.id}
                onClick={(e) => handleWishlist(e, product)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs backdrop-blur-md transition-colors rounded-full border ${
                  isInWishlist(product.id)
                    ? "bg-amber-500 text-black border-amber-400"
                    : "bg-white/15 hover:bg-white/25 border-white/20"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
                transition={{ delay: isActive ? 0.2 + pIndex * 0.1 : 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                <span className="truncate max-w-[100px]">{product.title.split(" ").slice(0, 2).join(" ")}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Card Number with glow effect */}
        <motion.div 
          className="absolute top-3 right-3 w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg"
          animate={{ 
            boxShadow: isActive ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)" 
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-serif text-base text-black font-semibold">{index + 1}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const LookbookGallery = () => {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fast auto-advance cards every 1.5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % looks.length);
    }, 1500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stackContainerRef.current) return;
      const rect = stackContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const offset = (e.clientX - centerX) / rect.width * 40;
      setParallaxOffset(offset);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Pause on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % looks.length);
    }, 1500);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + looks.length) % looks.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % looks.length);
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-900 overflow-hidden">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-xs uppercase tracking-widest text-amber-400 mb-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✦ Style Inspiration ✦
          </motion.p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-3 text-white">The Lookbook</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base">
            Browse {looks.length} stunning looks curated by our stylists
          </p>
        </motion.div>

        {/* Parallax Stacked Cards */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div 
            ref={stackContainerRef}
            className="relative h-[420px] sm:h-[480px] md:h-[550px] w-full max-w-2xl mx-auto"
            style={{ perspective: "1200px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {looks.map((look, index) => (
              <StackedLookCard
                key={look.id}
                look={look}
                index={index}
                totalCards={looks.length}
                currentIndex={currentIndex}
                parallaxOffset={parallaxOffset}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / looks.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span>{currentIndex + 1}</span>
              <span>{looks.length}</span>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/jewellery"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium hover:from-amber-400 hover:to-amber-500 transition-all rounded-full shadow-lg shadow-amber-500/25"
          >
            <Sparkles className="w-5 h-5" />
            View All {looks.length} Looks
          </Link>
        </motion.div>
      </div>

      <LookDetailModal
        look={selectedLook}
        isOpen={!!selectedLook}
        onClose={() => setSelectedLook(null)}
      />
    </section>
  );
};