import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRef } from "react";
import { DemoProduct, demoProducts } from "@/data/demoProducts";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";

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

interface SimilarProductsProps {
  currentProduct?: DemoProduct;
  title?: string;
}

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
    if (product.handle.includes("windsor") || product.handle.includes("optical")) {
      return eyewearProduct2;
    }
    if (product.handle.includes("malibu") || product.handle.includes("sport")) {
      return eyewearProduct1;
    }
    return eyewearProduct1;
  }

  // Jewellery images
  if (product.category === "necklaces") return productNecklace;
  if (product.category === "earrings") return productEarrings;
  if (product.category === "rings") return productRing;
  if (product.category === "bangles" || product.category === "bracelets") return productBangle;
  return productNecklace;
};

export const SimilarProducts = ({ currentProduct, title = "You May Also Like" }: SimilarProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useLocalCartStore();

  // Get similar products (same category or different categories)
  const getSimilarProducts = (): DemoProduct[] => {
    if (!currentProduct) {
      return demoProducts.slice(0, 6);
    }
    
    // Get products from same category first
    const sameCategory = demoProducts.filter(
      p => p.category === currentProduct.category && p.id !== currentProduct.id
    );
    
    // Get products from other categories
    const otherCategory = demoProducts.filter(
      p => p.category !== currentProduct.category && p.id !== currentProduct.id
    );
    
    return [...sameCategory.slice(0, 3), ...otherCategory.slice(0, 3)];
  };

  const similarProducts = getSimilarProducts();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (product: DemoProduct) => {
    addItem(product, 1);
    toast.success("Added to bag!", {
      description: product.title,
    });
  };

  if (similarProducts.length === 0) return null;

  return (
    <div className="py-4 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-base text-neutral-900">{title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 flex items-center justify-center border border-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 flex items-center justify-center border border-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {similarProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[110px] group"
          >
            <div className="relative aspect-square bg-neutral-100 mb-1.5 overflow-hidden rounded">
              <img
                src={getProductImage(product)}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <motion.button
                onClick={() => handleQuickAdd(product)}
                className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-3 h-3" />
              </motion.button>
            </div>
            <p className="text-[10px] font-sans text-neutral-600 truncate leading-tight">{product.title}</p>
            <p className="text-xs font-medium text-amber-600">${product.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
