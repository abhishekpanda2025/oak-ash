import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import heroPremium from "@/assets/hero-premium.jpg";

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
      {/* Premium Background with Model */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <motion.img
          src={heroPremium}
          alt="OAK & ASH - Premium Jewelry and Eyewear"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Premium Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        
        {/* Golden ambient glow around model */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 60% 50%, rgba(212, 184, 106, 0.2) 0%, transparent 50%)"
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </motion.div>

      {/* Diamond Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle, i) => (
          <DiamondSparkle key={i} {...sparkle} />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        ref={textRef} 
        className="relative z-10 container-luxury pt-24"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          {/* Brand Badge */}
          <motion.div
            className="hero-subtitle inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="h-px w-12 bg-amber-400" />
            <span className="text-xs md:text-sm tracking-luxury uppercase font-sans font-light text-amber-200">
              Jewellery & Eyewear
            </span>
            <span className="h-px w-12 bg-amber-400" />
          </motion.div>

          {/* Animated Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-8 md:mb-10 text-white">
            <span className="block overflow-hidden">
              <AnimatedWord word="Define Your" baseDelay={0.8} />
            </span>
            <span className="block overflow-hidden mt-2">
              <AnimatedWord word="Presence" baseDelay={1.4} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500" />
            </span>
          </h1>

          <p className="hero-description text-base md:text-lg text-white/80 max-w-xl mb-10 md:mb-12 font-sans font-light leading-relaxed">
            Experience the art of craftsmanship with our exclusive collection of handcrafted jewelry and designer eyewear, where elegance meets timeless style.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/jewellery"
              className="hero-cta group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-4 text-sm tracking-wide uppercase font-sans font-medium transition-all duration-500 hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Shop Jewellery
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/eyewear"
              className="hero-cta group inline-flex items-center justify-center gap-3 border border-white/50 text-white px-10 py-4 text-sm tracking-wide uppercase font-sans font-light hover:bg-white/10 hover:border-white transition-all duration-500 backdrop-blur-sm"
            >
              Shop Eyewear
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
          className="w-px h-12 bg-gradient-to-b from-amber-400/60 to-transparent"
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
