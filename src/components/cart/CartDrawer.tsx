import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    isLoading,
    setOpen,
    updateQuantity,
    removeItem,
    createCheckout,
    getTotalItems,
    getTotalPrice,
    getCurrency,
  } = useCartStore();

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setOpen(false);
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
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-elegant flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-serif text-xl">Your Cart</h2>
                <span className="text-sm text-muted-foreground font-sans">
                  ({getTotalItems()} items)
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="font-serif text-xl mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground font-sans">
                    Add some beautiful pieces to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-24 bg-cream-dark overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-sm mb-1 truncate">
                          {item.product.node.title}
                        </h3>
                        {item.variantTitle !== 'Default Title' && (
                          <p className="text-xs text-muted-foreground font-sans mb-2">
                            {item.selectedOptions.map(o => o.value).join(' / ')}
                          </p>
                        )}
                        <p className="font-sans font-medium text-sm">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-background">
                {/* Shipping Badge */}
                <div className="bg-cream-dark px-4 py-2 text-center">
                  <p className="text-xs font-sans text-muted-foreground">
                    ✨ Complimentary shipping on orders over $150
                  </p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm">Subtotal</span>
                  <span className="font-serif text-xl">
                    {getCurrency()} {getTotalPrice().toFixed(2)}
                  </span>
                </div>

                {/* Payment Icons */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                  <span className="px-2 py-1 border border-border">Visa</span>
                  <span className="px-2 py-1 border border-border">Mastercard</span>
                  <span className="px-2 py-1 border border-border">Amex</span>
                  <span className="px-2 py-1 border border-border">Apple Pay</span>
                  <span className="px-2 py-1 border border-border">Shop Pay</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-12"
                  variant="luxury"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout with Shopify
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground font-sans">
                  You'll be redirected to Shopify's secure checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
