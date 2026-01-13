import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import modelImage from "@/assets/model-jewelry.jpg";

export const LifestyleBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
        {/* Image Side */}
        <motion.div
          className="relative h-[400px] lg:h-auto order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img
            src={modelImage}
            alt="Model wearing elegant jewelry"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-foreground/10 lg:hidden" />
        </motion.div>

        {/* Content Side */}
        <motion.div
          className="bg-foreground text-background flex items-center order-1 lg:order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="container-luxury py-16 lg:py-0 lg:px-16 xl:px-24">
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              Exclusive Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
              Elegance
              <br />
              <span className="italic">Redefined</span>
            </h2>
            <p className="text-background/70 font-sans leading-relaxed mb-8 max-w-md">
              Discover our latest collection of minimalist jewelry, designed for the modern woman who appreciates understated luxury and timeless style.
            </p>
            <Link
              to="/collections/new"
              className="group inline-flex items-center gap-3 text-sm tracking-luxury uppercase font-sans text-primary hover:text-gold-light transition-colors"
            >
              Discover the Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
