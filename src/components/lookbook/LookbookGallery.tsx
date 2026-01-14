import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart, ShoppingBag, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useLocalCartStore } from "@/stores/localCartStore";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Import images
import modelHero1 from "@/assets/model-hero-1.jpg";
import modelHero2 from "@/assets/model-hero-2.jpg";
import modelHero3 from "@/assets/model-hero-3.jpg";
import modelHero4 from "@/assets/model-hero-4.jpg";
import modelHero5 from "@/assets/model-hero-5.jpg";
import modelHero6 from "@/assets/model-hero-6.jpg";
import modelHero7 from "@/assets/model-hero-7.jpg";
import modelHero8 from "@/assets/model-hero-8.jpg";

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
    image: modelHero6,
    title: "Rose Gold Elegance",
    description: "A stunning combination of rose gold jewelry with cat-eye sunglasses",
    products: demoProducts.filter(p => p.id === "6" || p.id === "18" || p.id === "4"),
  },
  {
    id: "2",
    image: modelHero7,
    title: "Bold Gold Statement",
    description: "Make an impression with chunky gold chains and oversized frames",
    products: demoProducts.filter(p => p.id === "9" || p.id === "19" || p.id === "15"),
  },
  {
    id: "3",
    image: modelHero1,
    title: "Classic Gold Collection",
    description: "Layered necklaces paired with signature aviator sunglasses",
    products: demoProducts.filter(p => p.id === "1" || p.id === "17" || p.id === "13"),
  },
  {
    id: "4",
    image: modelHero8,
    title: "Emerald Luxe",
    description: "Emerald accents with sophisticated gold aviator frames",
    products: demoProducts.filter(p => p.id === "11" || p.id === "17" || p.id === "16"),
  },
  {
    id: "5",
    image: modelHero3,
    title: "Pearl & Gold Dreams",
    description: "Timeless pearls with elegant tortoise cat-eye frames",
    products: demoProducts.filter(p => p.id === "6" || p.id === "10" || p.id === "18"),
  },
  {
    id: "6",
    image: modelHero4,
    title: "Diamond Chandelier",
    description: "Statement chandelier earrings with rectangular gold frames",
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

// GSAP Stacked Card Component
const StackedLookCard = ({ look, index, totalCards }: { look: Look; index: number; totalCards: number }) => {
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

  return (
    <div
      ref={cardRef}
      className="stacked-card absolute inset-0 w-full h-full"
      style={{
        zIndex: totalCards - index,
      }}
    >
      <div className="relative w-full h-full overflow-hidden shadow-2xl bg-white">
        {/* Image */}
        <img
          src={look.image}
          alt={look.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-widest text-amber-400 mb-3">Look {index + 1}</p>
            <h3 className="font-serif text-3xl md:text-4xl mb-3">{look.title}</h3>
            <p className="text-white/70 mb-6 max-w-md">{look.description}</p>
            
            {/* Product Pills */}
            <div className="flex flex-wrap gap-3">
              {look.products.slice(0, 3).map((product) => (
                <motion.button
                  key={product.id}
                  onClick={(e) => handleWishlist(e, product)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm transition-colors ${
                    isInWishlist(product.id)
                      ? "bg-amber-500 text-black"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  <span className="truncate max-w-[150px]">{product.title.split(" ").slice(0, 3).join(" ")}</span>
                  <span className="text-amber-400">${product.price}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Card Number */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-amber-500 flex items-center justify-center">
          <span className="font-serif text-xl text-black">{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

export const LookbookGallery = () => {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!stackContainerRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>(".stacked-card");
    
    cards.forEach((card, i) => {
      if (i === 0) return; // First card stays in place
      
      gsap.set(card, {
        y: i * 30,
        scale: 1 - i * 0.05,
        opacity: 1 - i * 0.1,
      });

      ScrollTrigger.create({
        trigger: stackContainerRef.current,
        start: `top+=${i * 150} top`,
        end: `top+=${(i + 1) * 150} top`,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Move current card up and out
          gsap.to(cards[i - 1], {
            y: -100 * progress,
            scale: 1 + 0.1 * progress,
            opacity: 1 - progress,
            duration: 0,
          });
          
          // Bring next card forward
          gsap.to(card, {
            y: (1 - progress) * 30,
            scale: 1 - (1 - progress) * 0.05,
            opacity: 1 - (1 - progress) * 0.1,
            duration: 0,
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: stackContainerRef });

  return (
    <section className="py-24 bg-neutral-900">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-4">Style Inspiration</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">The Lookbook</h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Browse complete outfits curated by our stylists. Save your favorite looks to your wishlist.
          </p>
        </motion.div>

        {/* GSAP Stacked Cards */}
        <div 
          ref={stackContainerRef}
          className="relative h-[600px] md:h-[700px] w-full max-w-4xl mx-auto"
          style={{ perspective: "1000px" }}
        >
          {looks.map((look, index) => (
            <StackedLookCard
              key={look.id}
              look={look}
              index={index}
              totalCards={looks.length}
            />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/jewellery"
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            View All Looks
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
