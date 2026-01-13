import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  const { node } = product;
  const firstImage = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const firstVariant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) {
      toast.error("No variant available");
      return;
    }

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("Added to wishlist", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${node.handle}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-cream-dark">
          {/* Primary Image */}
          {firstImage && (
            <motion.img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover absolute inset-0"
              animate={{ opacity: isHovered && secondImage ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
          
          {/* Secondary Image (on hover) */}
          {secondImage && (
            <motion.img
              src={secondImage.url}
              alt={secondImage.altText || node.title}
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Quick Add to Cart */}
          <motion.button
            className="absolute bottom-0 left-0 right-0 bg-foreground/95 backdrop-blur-sm text-background py-3 text-center flex items-center justify-center gap-2"
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? 0 : "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs tracking-luxury uppercase font-sans">Quick Add</span>
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="font-serif text-base mb-2 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          <p className="font-sans font-medium">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
