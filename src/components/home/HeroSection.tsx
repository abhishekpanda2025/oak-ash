import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import heroImage from "@/assets/hero-jewelry.jpg";

// Gold particle component
const GoldParticle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gold-shimmer"
    style={{ left }}
    initial={{ y: "100vh", opacity: 0, scale: 0 }}
    animate={{ 
      y: "-100vh", 
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      rotate: [0, 360, 720]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      left: `${Math.random() * 100}%`,
    }));
  }, []);

  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline({ delay: 0.8 });
      
      tl.fromTo(
        ".hero-subtitle",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(
        ".hero-title-line",
        { y: 120, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ".hero-description",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <motion.img
          src={heroImage}
          alt="Premium jewelry collection"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-charcoal/20" />
        
        {/* Soft light reflection */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <GoldParticle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
            left={particle.left}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        ref={textRef} 
        className="relative z-10 container-luxury text-ivory pt-24"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          <motion.p 
            className="hero-subtitle text-[11px] md:text-xs tracking-luxury uppercase mb-6 md:mb-8 font-sans font-light"
            style={{ color: "hsl(var(--gold-light))" }}
          >
            New Collection 2024
          </motion.p>

          <h1 className="font-serif text-display font-normal leading-tight mb-8 md:mb-10 overflow-hidden">
            <span className="hero-title-line block">Crafted by</span>
            <span className="hero-title-line block italic text-gold-gradient">Passion.</span>
            <span className="hero-title-line block">Worn Forever.</span>
          </h1>

          <p className="hero-description text-sm md:text-base text-ivory/70 max-w-lg mb-10 md:mb-12 font-sans font-light leading-relaxed">
            Discover our curated collection of premium jewelry, where every piece tells a story of artistry, heritage, and timeless elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/new-in"
              className="hero-cta group inline-flex items-center justify-center gap-3 btn-gold-shimmer text-charcoal px-10 py-4.5 text-[13px] tracking-wide-luxury uppercase font-sans font-medium transition-all duration-500 hover:shadow-gold"
            >
              Shop New In
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/jewellery"
              className="hero-cta group inline-flex items-center justify-center gap-3 border border-ivory/40 text-ivory px-10 py-4.5 text-[13px] tracking-wide-luxury uppercase font-sans font-light hover:bg-ivory/10 hover:border-ivory/60 transition-all duration-500 backdrop-blur-sm"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-ivory/50 text-[10px] tracking-luxury uppercase font-sans font-light">
          Scroll to Discover
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-ivory/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-32 left-8 w-20 h-20 border-l border-t border-gold/20" />
      <div className="absolute bottom-32 right-8 w-20 h-20 border-r border-b border-gold/20" />
    </section>
  );
};