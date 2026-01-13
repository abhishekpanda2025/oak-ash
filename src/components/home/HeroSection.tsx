import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-jewelry.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImage}
          alt="Premium jewelry collection"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-luxury text-background">
        <div className="max-w-2xl">
          <motion.p
            className="text-xs md:text-sm tracking-luxury uppercase mb-4 md:mb-6 text-primary font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            New Collection 2024
          </motion.p>

          <motion.h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 md:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Craftsmanship
            <br />
            <span className="italic text-primary">Meets Timeless</span>
            <br />
            Elegance
          </motion.h1>

          <motion.p
            className="text-sm md:text-base text-background/80 max-w-md mb-8 md:mb-10 font-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover our curated collection of premium jewelry, where every piece tells a story of artistry and elegance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              to="/new-in"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-luxury uppercase font-sans btn-luxury"
            >
              Shop New In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/jewellery"
              className="inline-flex items-center justify-center gap-2 border border-background/50 text-background px-8 py-4 text-sm tracking-luxury uppercase font-sans hover:bg-background/10 transition-colors"
            >
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-background/60 text-xs tracking-luxury uppercase font-sans">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-background/40"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};
