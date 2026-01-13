import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import heroImage from "@/assets/hero-jewelry.jpg";

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        ".hero-title-line",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-description",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          src={heroImage}
          alt="Premium jewelry collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent" />
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 container-luxury text-background pt-20">
        <div className="max-w-2xl">
          <p className="hero-subtitle text-xs md:text-sm tracking-luxury uppercase mb-4 md:mb-6 text-primary font-sans">
            New Collection 2024
          </p>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 md:mb-8 overflow-hidden">
            <span className="hero-title-line block">Crafted by</span>
            <span className="hero-title-line block italic text-primary">Passion.</span>
            <span className="hero-title-line block">Worn Forever.</span>
          </h1>

          <p className="hero-description text-sm md:text-base text-background/80 max-w-md mb-8 md:mb-10 font-sans leading-relaxed">
            Discover our curated collection of premium jewelry, where every piece tells a story of artistry and timeless elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/new-in"
              className="hero-cta group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-luxury uppercase font-sans btn-luxury"
            >
              Shop New In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/jewellery"
              className="hero-cta inline-flex items-center justify-center gap-2 border border-background/50 text-background px-8 py-4 text-sm tracking-luxury uppercase font-sans hover:bg-background/10 transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
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
