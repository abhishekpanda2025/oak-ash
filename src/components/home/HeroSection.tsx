import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

// Import all model images
import modelHero1 from "@/assets/model-hero-1.jpg";
import modelHero2 from "@/assets/model-hero-2.jpg";
import modelHero3 from "@/assets/model-hero-3.jpg";
import modelHero4 from "@/assets/model-hero-4.jpg";
import modelHero5 from "@/assets/model-hero-5.jpg";

// Model data for the runway
const models = [
  { 
    id: 1, 
    image: modelHero1, 
    name: "Sophia", 
    collection: "Gold Statement Collection",
    description: "Layered gold necklaces & signature sunglasses"
  },
  { 
    id: 2, 
    image: modelHero2, 
    name: "Alexander", 
    collection: "Men's Luxe Collection",
    description: "Gold aviators & premium accessories"
  },
  { 
    id: 3, 
    image: modelHero3, 
    name: "Victoria", 
    collection: "Pearl & Gold Collection",
    description: "Pearl jewelry with OAK & ASH cat-eye frames"
  },
  { 
    id: 4, 
    image: modelHero4, 
    name: "Isabella", 
    collection: "Diamond Chandelier Collection",
    description: "Chandelier earrings & gold rectangular frames"
  },
  { 
    id: 5, 
    image: modelHero5, 
    name: "Catherine", 
    collection: "Silver Diamond Collection",
    description: "Diamond tennis bracelet & tortoise sunglasses"
  },
];

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

// Model slide with walking animation
const ModelSlide = ({ 
  model, 
  isActive, 
  direction 
}: { 
  model: typeof models[0]; 
  isActive: boolean; 
  direction: "enter" | "exit";
}) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={model.id}
          className="absolute inset-0"
          initial={{ 
            x: direction === "enter" ? "100%" : "-100%",
            scale: 0.9,
            opacity: 0 
          }}
          animate={{ 
            x: 0,
            scale: 1,
            opacity: 1 
          }}
          exit={{ 
            x: direction === "enter" ? "-100%" : "100%",
            scale: 0.9,
            opacity: 0 
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        >
          {/* Model Image with Ken Burns effect */}
          <motion.img
            src={model.image}
            alt={`${model.name} - ${model.collection}`}
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.1 }}
            animate={{ 
              scale: 1,
              x: [0, -15, 0],
            }}
            transition={{ 
              scale: { duration: 8, ease: "linear" },
              x: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }}
          />
          
          {/* Model info overlay */}
          <motion.div
            className="absolute bottom-32 right-8 md:right-16 text-right z-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-xs tracking-luxury uppercase text-amber-400 mb-2 font-sans">
              {model.collection}
            </p>
            <p className="text-sm text-white/70 font-sans font-light max-w-xs">
              {model.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"enter" | "exit">("enter");
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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

  // Auto-rotate models like a runway show
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("enter");
      setActiveIndex((prev) => (prev + 1) % models.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-description",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
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
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Models Slideshow */}
      <div className="absolute inset-0">
        {models.map((model, index) => (
          <ModelSlide
            key={model.id}
            model={model}
            isActive={index === activeIndex}
            direction={direction}
          />
        ))}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />
        
        {/* Golden ambient glow */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{
            background: "radial-gradient(ellipse at 60% 50%, rgba(212, 184, 106, 0.15) 0%, transparent 50%)"
          }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Runway spotlight effect */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(180deg, transparent 0%, transparent 60%, rgba(212, 184, 106, 0.1) 100%)"
          }}
        />
      </div>

      {/* Diamond Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {sparkles.map((sparkle, i) => (
          <DiamondSparkle key={i} {...sparkle} />
        ))}
      </div>

      {/* Model Indicator Dots */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {models.map((model, index) => (
          <motion.button
            key={model.id}
            onClick={() => {
              setDirection(index > activeIndex ? "enter" : "exit");
              setActiveIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-amber-500 scale-150"
                : "bg-white/40 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View ${model.name}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={activeIndex}
        />
      </div>

      {/* Content */}
      <motion.div 
        ref={textRef} 
        className="relative z-20 container-luxury pt-24"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          {/* Brand Badge */}
          <div className="hero-subtitle inline-flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-amber-400" />
            <span className="text-xs md:text-sm tracking-luxury uppercase font-sans font-light text-amber-200">
              Runway Collection 2026
            </span>
            <span className="h-px w-12 bg-amber-400" />
          </div>

          {/* Animated Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-8 md:mb-10 text-white overflow-hidden">
            <span className="hero-title-line block">
              Live The
            </span>
            <span className="hero-title-line block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              OAK & ASH
            </span>
            <span className="hero-title-line block mt-2 italic">
              Experience
            </span>
          </h1>

          <p className="hero-description text-base md:text-lg text-white/80 max-w-xl mb-10 md:mb-12 font-sans font-light leading-relaxed">
            Witness our exclusive runway collection featuring handcrafted jewelry and designer eyewear, 
            where elegance meets timeless sophistication.
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

      {/* Current Model Name */}
      <motion.div
        className="absolute bottom-20 left-8 md:left-16 z-30"
        key={activeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs tracking-luxury uppercase text-white/50 font-sans mb-1">
          Model
        </p>
        <p className="font-serif text-2xl md:text-3xl text-white">
          {models[activeIndex].name}
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
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
      <div className="absolute top-32 left-8 w-20 h-20 border-l border-t border-amber-500/30 z-20" />
      <div className="absolute bottom-32 right-8 w-20 h-20 border-r border-b border-amber-500/30 z-20" />
    </section>
  );
};
