import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import earringsImage from "@/assets/product-earrings.jpg";
import ringImage from "@/assets/product-ring.jpg";
import necklaceImage from "@/assets/product-necklace.jpg";
import bangleImage from "@/assets/product-bangle.jpg";
import silverRingsImage from "@/assets/product-silver-rings.jpg";
import pearlEarringsImage from "@/assets/product-pearl-earrings.jpg";

const products = [
  {
    id: 1,
    name: "Crystal Teardrop Earrings",
    price: 128,
    originalPrice: 168,
    image: earringsImage,
    category: "Earrings",
    isNew: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Solitaire Diamond Ring",
    price: 245,
    image: ringImage,
    category: "Rings",
    isNew: true,
  },
  {
    id: 3,
    name: "Layered Gold Necklace Set",
    price: 189,
    image: necklaceImage,
    category: "Necklaces",
  },
  {
    id: 4,
    name: "Classic Gold Bangle",
    price: 156,
    image: bangleImage,
    category: "Bangles",
    isNew: true,
  },
  {
    id: 5,
    name: "Silver Stacking Ring Set",
    price: 175,
    image: silverRingsImage,
    category: "Rings",
  },
  {
    id: 6,
    name: "Freshwater Pearl Drops",
    price: 142,
    image: pearlEarringsImage,
    category: "Earrings",
    isNew: true,
  },
];

export const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              New Arrivals
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium">
              Just Landed
            </h2>
          </div>
          <Link
            to="/new-in"
            className="inline-flex items-center text-sm tracking-luxury uppercase font-sans mt-4 md:mt-0 text-muted-foreground hover:text-primary transition-colors link-elegant"
          >
            View All New Arrivals
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                {/* Image Container */}
                <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-cream-dark">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-foreground text-background text-[10px] px-2 py-1 tracking-luxury uppercase font-sans">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-primary text-primary-foreground text-[10px] px-2 py-1 tracking-luxury uppercase font-sans">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      className="w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
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
                  </div>

                  {/* Add to Cart */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-foreground/95 backdrop-blur-sm text-background py-3 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0"
                  >
                    <button className="flex items-center justify-center gap-2 w-full text-xs tracking-luxury uppercase font-sans">
                      <ShoppingBag className="w-4 h-4" />
                      Quick Add
                    </button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1 font-sans">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-base mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-sans font-medium">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="font-sans text-muted-foreground line-through text-sm">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
