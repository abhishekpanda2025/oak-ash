import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Truck, RefreshCw, Shield, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { getProductByHandle, type ShopifyProductNode, type ShopifyVariant } from "@/lib/shopify";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProductNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;
      
      try {
        setIsLoading(true);
        const data = await getProductByHandle(handle);
        setProduct(data);
        
        if (data?.variants.edges[0]) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant);
          
          // Set initial options
          const initialOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach((opt) => {
            initialOptions[opt.name] = opt.value;
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;

    const variant = product.variants.edges.find((v) =>
      v.node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );

    if (variant) {
      setSelectedVariant(variant.node);
    }
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem: CartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart!", {
      description: `${product.title} x ${quantity}`,
      position: "top-center",
    });
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.edges.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.edges.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartDrawer />
        <div className="flex items-center justify-center min-h-screen pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartDrawer />
        <div className="flex flex-col items-center justify-center min-h-screen pt-32">
          <h1 className="font-serif text-3xl mb-4">Product not found</h1>
          <Link to="/jewellery" className="text-primary hover:underline font-sans">
            Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const currentImage = images[currentImageIndex]?.node;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link to="/jewellery" className="hover:text-primary transition-colors">Jewellery</Link></li>
              <li>/</li>
              <li className="text-foreground">{product.title}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-cream-dark overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  {currentImage && (
                    <motion.img
                      key={currentImageIndex}
                      src={currentImage.url}
                      alt={currentImage.altText || product.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-24 flex-shrink-0 overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? "ring-2 ring-primary"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.title}</h1>
              
              {/* Price */}
              <p className="font-serif text-2xl text-primary mb-6">
                {selectedVariant?.price.currencyCode || "USD"}{" "}
                {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </p>

              {/* Description */}
              <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                {product.description || "Exquisite craftsmanship meets timeless design in this beautiful piece from our collection."}
              </p>

              {/* Options */}
              {product.options.map((option) => (
                option.values.length > 1 && (
                  <div key={option.name} className="mb-6">
                    <label className="text-xs tracking-luxury uppercase text-muted-foreground mb-3 block font-sans">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-4 py-2 border text-sm font-sans transition-colors ${
                            selectedOptions[option.name] === value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-xs tracking-luxury uppercase text-muted-foreground mb-3 block font-sans">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-sans w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="flex-1 h-14"
                  variant="luxury"
                  size="xl"
                >
                  {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="luxuryOutline" size="icon" className="h-14 w-14">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-sans text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-sans text-muted-foreground">Easy Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-sans text-muted-foreground">Warranty</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
