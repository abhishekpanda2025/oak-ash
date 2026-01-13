import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import earringsImage from "@/assets/product-earrings.jpg";
import ringsImage from "@/assets/product-ring.jpg";
import necklacesImage from "@/assets/product-necklace.jpg";
import banglesImage from "@/assets/product-bangle.jpg";

const categories = [
  {
    name: "Earrings",
    description: "Statement pieces for every occasion",
    image: earringsImage,
    href: "/jewellery/earrings",
  },
  {
    name: "Rings",
    description: "Timeless symbols of elegance",
    image: ringsImage,
    href: "/jewellery/rings",
  },
  {
    name: "Necklaces",
    description: "Graceful chains and pendants",
    image: necklacesImage,
    href: "/jewellery/necklaces",
  },
  {
    name: "Bangles",
    description: "Sophisticated wrist adornments",
    image: banglesImage,
    href: "/jewellery/bangles",
  },
];

export const FeaturedCategories = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
            Shop by Category
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium">
            Curated Collections
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={category.href} className="group block">
                <div className="relative overflow-hidden mb-4">
                  <div className="aspect-[3/4] img-zoom">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                  {/* Quick Link */}
                  <motion.div
                    className="absolute bottom-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
                <h3 className="font-serif text-xl mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground font-sans">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
