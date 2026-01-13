import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { useLocalCartStore } from "@/stores/localCartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import images for products
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";
import { DemoProduct } from "@/data/demoProducts";
import { PaymentIcons } from "@/components/layout/PaymentIcons";

// Get product image based on category
const getProductImage = (product: DemoProduct): string => {
  if (product.category === "necklaces") return productNecklace;
  if (product.category === "earrings") return productEarrings;
  if (product.category === "rings") return productRing;
  if (product.category === "bangles" || product.category === "bracelets") return productBangle;
  return productNecklace;
};

export const LocalCartDrawer = () => {
  const {
    items,
    isOpen,
    setOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useLocalCartStore();

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...", {
      description: "This is a demo - connect Shopify for real checkout",
    });
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-neutral-800" />
                <h2 className="font-serif text-xl text-neutral-900">Your Bag</h2>
                <span className="text-sm text-neutral-500 font-sans">
                  ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:text-amber-600 transition-colors text-neutral-800"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-neutral-200 mb-4" />
                  <p className="font-serif text-xl mb-2 text-neutral-900">Your bag is empty</p>
                  <p className="text-sm text-neutral-500 font-sans">
                    Add some beautiful pieces to get started
                  </p>
                  <Button
                    onClick={() => setOpen(false)}
                    className="mt-6"
                    variant="outline"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-28 bg-neutral-100 overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-sm mb-1 truncate text-neutral-900">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-sans mb-2">
                          {item.product.material}
                        </p>
                        <p className="font-sans font-medium text-amber-600">
                          ${item.product.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-neutral-300 flex items-center justify-center hover:border-amber-500 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-sans text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border border-neutral-300 flex items-center justify-center hover:border-amber-500 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success("Removed from bag");
                        }}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}

                  {/* Clear All Button */}
                  {items.length > 0 && (
                    <motion.button
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                      className="w-full py-2 text-sm text-neutral-500 hover:text-red-500 transition-colors font-sans"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear All Items
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-4 bg-white">
                {/* Shipping Badge */}
                <div className="bg-amber-50 px-4 py-2 text-center rounded">
                  <p className="text-xs font-sans text-amber-700">
                    ✨ Complimentary shipping on orders over $150
                  </p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-neutral-600">Subtotal</span>
                  <span className="font-serif text-2xl text-neutral-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                {/* Payment Icons */}
                <div className="flex items-center justify-center gap-2">
                  <PaymentIcons />
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-neutral-900 hover:bg-amber-600 text-white font-sans text-sm tracking-wide uppercase"
                  size="lg"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <p className="text-[10px] text-center text-neutral-400 font-sans">
                  Secure checkout • Free returns within 30 days
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
