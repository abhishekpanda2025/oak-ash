import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { DemoProduct, demoProducts } from "@/data/demoProducts";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";

// Import images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";

interface SimilarProductsProps {
  currentProduct?: DemoProduct;
  title?: string;
}

const getProductImage = (product: DemoProduct): string => {
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
    <div className="py-6 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-neutral-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {similarProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[140px] group"
          >
            <div className="relative aspect-square bg-neutral-100 mb-2 overflow-hidden">
              <img
                src={getProductImage(product)}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <motion.button
                onClick={() => handleQuickAdd(product)}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <p className="text-xs font-sans text-neutral-600 truncate">{product.title}</p>
            <p className="text-sm font-medium text-amber-600">${product.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};