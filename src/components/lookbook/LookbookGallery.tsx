import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, ShoppingBag, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useLocalCartStore } from "@/stores/localCartStore";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

const LookCard = ({ look, index, onOpen }: { look: Look; index: number; onOpen: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem: addToWishlist, isInWishlist, removeItem } = useWishlistStore();
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

  const handleWishlist = (product: DemoProduct) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale, rotateY, transformPerspective: 1000 }}
      className="relative group cursor-pointer"
      onClick={onOpen}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <motion.img
          src={look.image}
          alt={look.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"
        />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">Look {index + 1}</p>
            <h3 className="font-serif text-2xl mb-2">{look.title}</h3>
            <p className="text-sm text-white/70 line-clamp-2 mb-4">{look.description}</p>
            
            {/* Product Pills */}
            <div className="flex flex-wrap gap-2">
              {look.products.slice(0, 3).map((product) => (
                <motion.button
                  key={product.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist(product);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs backdrop-blur-sm transition-colors ${
                    isInWishlist(product.id)
                      ? "bg-amber-500 text-black"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  <span className="truncate max-w-[100px]">{product.title.split(" ").slice(0, 2).join(" ")}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* View Look CTA */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-12 h-12 bg-amber-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

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
          {/* Image */}
          <div className="relative aspect-[3/4] md:aspect-auto">
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Products */}
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

export const LookbookGallery = () => {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-4">Style Inspiration</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">The Lookbook</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse complete outfits curated by our stylists. Save your favorite looks to your wishlist.
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {looks.map((look, index) => (
            <LookCard
              key={look.id}
              look={look}
              index={index}
              onOpen={() => setSelectedLook(look)}
            />
          ))}
        </div>
      </div>

      <LookDetailModal
        look={selectedLook}
        isOpen={!!selectedLook}
        onClose={() => setSelectedLook(null)}
      />
    </section>
  );
};
