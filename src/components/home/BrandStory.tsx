import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";

export const BrandStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-cream-dark">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] img-zoom">
              <img
                src={craftsmanshipImage}
                alt="Artisan crafting jewelry"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-primary -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              Our Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
              Inspired by Nature,
              <br />
              <span className="italic">Crafted by Hand</span>
            </h2>
            <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
              <p>
                Inspired by the strength of oak and the grace of ash — jewelry crafted with passion, worn forever. Every piece in our collection represents a harmony between timeless design and modern elegance.
              </p>
              <p>
                Our master artisans bring decades of expertise to each creation, ensuring that every ring, necklace, and bracelet meets the highest standards of quality and beauty.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-border">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="font-serif text-3xl md:text-4xl text-primary">25+</span>
                <p className="text-xs tracking-luxury uppercase text-muted-foreground mt-2 font-sans">
                  Years of Craft
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="font-serif text-3xl md:text-4xl text-primary">500+</span>
                <p className="text-xs tracking-luxury uppercase text-muted-foreground mt-2 font-sans">
                  Unique Designs
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span className="font-serif text-3xl md:text-4xl text-primary">15K+</span>
                <p className="text-xs tracking-luxury uppercase text-muted-foreground mt-2 font-sans">
                  Happy Clients
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
