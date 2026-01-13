import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { DemoProduct } from "@/data/demoProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

// Import sample images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";

interface DemoProductCardProps {
  product: DemoProduct;
  index?: number;
}

// Map products to images based on category
const getProductImage = (product: DemoProduct, index: number = 0): string => {
  const images = [productNecklace, productEarrings, productRing, productBangle, productPearlEarrings, productSilverRings];
  
  if (product.category === "necklaces") return productNecklace;
  if (product.category === "earrings") return index % 2 === 0 ? productEarrings : productPearlEarrings;
  if (product.category === "rings") return index % 2 === 0 ? productRing : productSilverRings;
  if (product.category === "bangles" || product.category === "bracelets") return productBangle;
  
  return images[parseInt(product.id) % images.length];
};

export const DemoProductCard = ({ product, index = 0 }: DemoProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const productImage = getProductImage(product, index);
  const secondaryImage = getProductImage(product, index + 1);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    toast.success("Added to cart!", {
      description: product.title,
      position: "top-center",
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
          {/* Primary Image */}
          <motion.img
            src={productImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              opacity: isHovered ? 0 : 1
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {/* Secondary Image (on hover) */}
          <motion.img
            src={secondaryImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.05 : 1.1,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gold Shimmer Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ 
              x: isHovered ? "100%" : "-100%",
              opacity: isHovered ? 0.4 : 0
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-shimmer) / 0.4) 50%, transparent 100%)",
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-primary text-primary-foreground"
              >
                New
              </motion.span>
            )}
            {product.isBestseller && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="px-3 py-1 text-[10px] tracking-widest uppercase font-sans bg-foreground text-background"
              >
                Bestseller
              </motion.span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-4 right-4 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 flex items-center justify-center backdrop-blur-md transition-colors ${
                isWishlisted 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Quick Add Button */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.button
              onClick={handleQuickAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 flex items-center justify-center gap-2 bg-background/95 backdrop-blur-md text-foreground font-sans text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Added
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Quick Add
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="text-center space-y-2">
          <motion.h3 
            className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300"
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {product.title}
          </motion.h3>
          
          <div className="flex items-center justify-center gap-3">
            <span className="font-serif text-primary text-lg">${product.price}</span>
            {product.compareAtPrice && (
              <span className="font-sans text-sm text-muted-foreground line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? "auto" : 0 
            }}
            className="text-xs text-muted-foreground font-sans"
          >
            {product.material}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
};
