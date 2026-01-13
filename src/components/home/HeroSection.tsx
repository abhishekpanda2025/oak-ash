import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import heroImage from "@/assets/hero-jewelry.jpg";

// Floating jewelry icons with elegant animations
const FloatingJewelry = ({ 
  icon, 
  delay, 
  duration, 
  startX, 
  startY,
  size = "text-2xl"
}: { 
  icon: string; 
  delay: number; 
  duration: number; 
  startX: string;
  startY: string;
  size?: string;
}) => (
  <motion.div
    className={`absolute ${size} pointer-events-none select-none`}
    style={{ left: startX, top: startY }}
    initial={{ opacity: 0, scale: 0, rotate: -20 }}
    animate={{ 
      opacity: [0, 0.8, 0.8, 0],
      scale: [0.5, 1, 1, 0.5],
      rotate: [0, 10, -10, 0],
      y: [0, -100, -200, -300],
      x: [0, 20, -20, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {icon}
  </motion.div>
);

// Diamond sparkle effect
const DiamondSparkle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute w-3 h-3 pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill="url(#diamondGradient)"
      />
      <defs>
        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D5A3" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D4B86A" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

// Gold particle with shimmer
const GoldParticle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-gold-shimmer"
    style={{ 
      left,
      boxShadow: "0 0 10px hsl(43 80% 65% / 0.5)"
    }}
    initial={{ y: "100vh", opacity: 0, scale: 0 }}
    animate={{ 
      y: "-100vh", 
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0],
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

// Animated letter component
const AnimatedLetter = ({ 
  letter, 
  delay 
}: { 
  letter: string; 
  delay: number;
}) => (
  <motion.span
    className="inline-block"
    initial={{ opacity: 0, y: 50, rotateX: -90 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {letter === " " ? "\u00A0" : letter}
  </motion.span>
);

// Animated word component with letter-by-letter reveal
const AnimatedWord = ({ 
  word, 
  baseDelay = 0,
  className = ""
}: { 
  word: string; 
  baseDelay?: number;
  className?: string;
}) => (
  <span className={className}>
    {word.split("").map((letter, i) => (
      <AnimatedLetter key={i} letter={letter} delay={baseDelay + i * 0.05} />
    ))}
  </span>
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
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 8,
      left: `${Math.random() * 100}%`,
    }));
  }, []);

  // Floating jewelry items
  const jewelryItems = useMemo(() => [
    { icon: "💍", delay: 0, duration: 8, startX: "10%", startY: "70%", size: "text-3xl" },
    { icon: "✨", delay: 2, duration: 6, startX: "85%", startY: "60%", size: "text-2xl" },
    { icon: "💎", delay: 1, duration: 7, startX: "20%", startY: "80%", size: "text-4xl" },
    { icon: "📿", delay: 3, duration: 9, startX: "75%", startY: "75%", size: "text-3xl" },
    { icon: "👑", delay: 4, duration: 8, startX: "90%", startY: "85%", size: "text-2xl" },
    { icon: "💫", delay: 1.5, duration: 7, startX: "5%", startY: "60%", size: "text-xl" },
    { icon: "🔗", delay: 2.5, duration: 6, startX: "95%", startY: "70%", size: "text-2xl" },
    { icon: "💍", delay: 5, duration: 8, startX: "15%", startY: "90%", size: "text-2xl" },
  ], []);

  // Diamond sparkles
  const sparkles = useMemo(() => [
    { delay: 0, x: "25%", y: "30%" },
    { delay: 0.5, x: "70%", y: "25%" },
    { delay: 1, x: "80%", y: "45%" },
    { delay: 1.5, x: "15%", y: "50%" },
    { delay: 2, x: "60%", y: "65%" },
    { delay: 2.5, x: "35%", y: "40%" },
    { delay: 3, x: "85%", y: "35%" },
    { delay: 3.5, x: "10%", y: "35%" },
  ], []);

  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        ".hero-description",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "+=0.8"
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        
        {/* Animated light reflections */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 40%, rgba(212, 184, 106, 0.15) 0%, transparent 50%)"
          }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 70% 60%, rgba(212, 184, 106, 0.1) 0%, transparent 40%)"
          }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      {/* Diamond Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle, i) => (
          <DiamondSparkle key={i} {...sparkle} />
        ))}
      </div>

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

      {/* Floating Jewelry */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {jewelryItems.map((item, i) => (
          <FloatingJewelry key={i} {...item} />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        ref={textRef} 
        className="relative z-10 container-luxury pt-24"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          <motion.p 
            className="hero-subtitle text-xs md:text-sm tracking-luxury uppercase mb-6 md:mb-8 font-sans font-light text-amber-200"
          >
            New Collection 2024
          </motion.p>

          {/* Animated Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-tight mb-8 md:mb-10 text-white">
            <span className="block overflow-hidden">
              <AnimatedWord word="Crafted by" baseDelay={0.8} />
            </span>
            <span className="block overflow-hidden">
              <AnimatedWord word="Passion" baseDelay={1.3} className="italic text-amber-300" />
              <motion.span 
                className="inline-block text-amber-400 mx-2"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                &amp;
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <AnimatedWord word="Worn Forever." baseDelay={2.2} />
            </span>
          </h1>

          <p className="hero-description text-sm md:text-base text-white/80 max-w-lg mb-10 md:mb-12 font-sans font-light leading-relaxed">
            Discover our curated collection of premium jewelry, where every piece tells a story of artistry, heritage, and timeless elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/collection/new-in"
              className="hero-cta group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-4 text-sm tracking-wide uppercase font-sans font-medium transition-all duration-500 hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Shop New In
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/jewellery"
              className="hero-cta group inline-flex items-center justify-center gap-3 border border-white/50 text-white px-10 py-4 text-sm tracking-wide uppercase font-sans font-light hover:bg-white/10 hover:border-white transition-all duration-500 backdrop-blur-sm"
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
        transition={{ delay: 3 }}
      >
        <span className="text-white/60 text-[10px] tracking-luxury uppercase font-sans font-light">
          Scroll to Discover
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-32 left-8 w-20 h-20 border-l border-t border-amber-500/30" />
      <div className="absolute bottom-32 right-8 w-20 h-20 border-r border-b border-amber-500/30" />
    </section>
  );
};
