import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowRight, ShoppingBag, Eye, X, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

// Import all model images
import modelHero1 from "@/assets/model-hero-1.jpg";
import modelHero2 from "@/assets/model-hero-2.jpg";
import modelHero3 from "@/assets/model-hero-3.jpg";
import modelHero4 from "@/assets/model-hero-4.jpg";
import modelHero5 from "@/assets/model-hero-5.jpg";
import modelHero6 from "@/assets/model-hero-6.jpg";
import modelHero7 from "@/assets/model-hero-7.jpg";
import modelHero8 from "@/assets/model-hero-8.jpg";
import modelHero9 from "@/assets/model-hero-9.jpg";
import modelHero10 from "@/assets/model-hero-10.jpg";
import runwayVideo from "@/assets/runway-background.mp4";

// Shop the look hotspot type
interface Hotspot {
  id: string;
  x: string;
  y: string;
  type: "jewelry" | "eyewear";
  productName: string;
  price: string;
  link: string;
}

// Model data for the runway
const models = [
  { 
    id: 1, 
    image: modelHero1, 
    name: "Sophia", 
    collection: "Gold Statement Collection",
    description: "Layered gold necklaces & signature sunglasses",
    hotspots: [
      { id: "h1-1", x: "52%", y: "18%", type: "eyewear" as const, productName: "Cat-Eye Gold Frames", price: "£285", link: "/eyewear" },
      { id: "h1-2", x: "48%", y: "28%", type: "jewelry" as const, productName: "Statement Gold Necklace", price: "£450", link: "/jewellery" },
      { id: "h1-3", x: "52%", y: "35%", type: "jewelry" as const, productName: "Layered Chain Set", price: "£320", link: "/jewellery" },
    ]
  },
  { 
    id: 2, 
    image: modelHero6, 
    name: "Mei Lin", 
    collection: "Rose Gold Elegance",
    description: "Rose gold cat-eye frames & delicate chains",
    hotspots: [
      { id: "h2-1", x: "50%", y: "22%", type: "eyewear" as const, productName: "Rose Cat-Eye Sunglasses", price: "£295", link: "/eyewear" },
      { id: "h2-2", x: "42%", y: "30%", type: "jewelry" as const, productName: "Diamond Hoop Earrings", price: "£380", link: "/jewellery" },
      { id: "h2-3", x: "50%", y: "42%", type: "jewelry" as const, productName: "Layered Rose Necklaces", price: "£425", link: "/jewellery" },
    ]
  },
  { 
    id: 3, 
    image: modelHero7, 
    name: "Amara", 
    collection: "Bold Gold Collection",
    description: "Statement gold chain & oversized frames",
    hotspots: [
      { id: "h3-1", x: "50%", y: "18%", type: "eyewear" as const, productName: "Oversized Square Frames", price: "£340", link: "/eyewear" },
      { id: "h3-2", x: "50%", y: "35%", type: "jewelry" as const, productName: "Chunky Gold Chain", price: "£580", link: "/jewellery" },
      { id: "h3-3", x: "35%", y: "55%", type: "jewelry" as const, productName: "Gold Cuff Bracelets", price: "£420", link: "/jewellery" },
    ]
  },
  { 
    id: 4, 
    image: modelHero3, 
    name: "Victoria", 
    collection: "Pearl & Gold Collection",
    description: "Pearl jewelry with OAK & ASH cat-eye frames",
    hotspots: [
      { id: "h4-1", x: "40%", y: "22%", type: "eyewear" as const, productName: "Tortoise Cat-Eye", price: "£265", link: "/eyewear" },
      { id: "h4-2", x: "35%", y: "30%", type: "jewelry" as const, productName: "Pearl Drop Earrings", price: "£290", link: "/jewellery" },
      { id: "h4-3", x: "32%", y: "58%", type: "jewelry" as const, productName: "Gold Bangle Stack", price: "£350", link: "/jewellery" },
    ]
  },
  { 
    id: 5, 
    image: modelHero8, 
    name: "Elena", 
    collection: "Emerald Luxe Collection",
    description: "Emerald jewelry with gold aviator frames",
    hotspots: [
      { id: "h5-1", x: "50%", y: "15%", type: "eyewear" as const, productName: "Green Tint Aviators", price: "£310", link: "/eyewear" },
      { id: "h5-2", x: "50%", y: "32%", type: "jewelry" as const, productName: "Emerald Statement Necklace", price: "£850", link: "/jewellery" },
      { id: "h5-3", x: "35%", y: "52%", type: "jewelry" as const, productName: "Emerald Tennis Bracelet", price: "£720", link: "/jewellery" },
    ]
  },
  { 
    id: 6, 
    image: modelHero4, 
    name: "Isabella", 
    collection: "Diamond Chandelier Collection",
    description: "Chandelier earrings & gold rectangular frames",
    hotspots: [
      { id: "h6-1", x: "50%", y: "18%", type: "eyewear" as const, productName: "Gold Rectangle Frames", price: "£275", link: "/eyewear" },
      { id: "h6-2", x: "40%", y: "28%", type: "jewelry" as const, productName: "Diamond Chandelier Earrings", price: "£680", link: "/jewellery" },
      { id: "h6-3", x: "52%", y: "38%", type: "jewelry" as const, productName: "Diamond Cocktail Ring", price: "£520", link: "/jewellery" },
    ]
  },
  { 
    id: 7, 
    image: modelHero5, 
    name: "Catherine", 
    collection: "Silver Diamond Collection",
    description: "Diamond tennis bracelet & tortoise sunglasses",
    hotspots: [
      { id: "h7-1", x: "38%", y: "22%", type: "eyewear" as const, productName: "Round Tortoise Sunglasses", price: "£255", link: "/eyewear" },
      { id: "h7-2", x: "42%", y: "35%", type: "jewelry" as const, productName: "Diamond Pendant Necklace", price: "£890", link: "/jewellery" },
      { id: "h7-3", x: "32%", y: "52%", type: "jewelry" as const, productName: "Diamond Tennis Bracelet", price: "£1,200", link: "/jewellery" },
    ]
  },
  { 
    id: 8, 
    image: modelHero2, 
    name: "Alexander", 
    collection: "Men's Luxe Collection",
    description: "Gold aviators & premium accessories",
    hotspots: [
      { id: "h8-1", x: "50%", y: "18%", type: "eyewear" as const, productName: "Gold Aviator Sunglasses", price: "£320", link: "/eyewear" },
      { id: "h8-2", x: "45%", y: "42%", type: "jewelry" as const, productName: "Luxury Gold Watch", price: "£1,450", link: "/jewellery" },
      { id: "h8-3", x: "52%", y: "48%", type: "jewelry" as const, productName: "Gold Cufflinks Set", price: "£280", link: "/jewellery" },
    ]
  },
  { 
    id: 9, 
    image: modelHero9, 
    name: "Valentina", 
    collection: "Royal Gold Collection",
    description: "Layered gold statement pieces & designer shades",
    hotspots: [
      { id: "h9-1", x: "50%", y: "20%", type: "eyewear" as const, productName: "Gradient Square Frames", price: "£295", link: "/eyewear" },
      { id: "h9-2", x: "50%", y: "32%", type: "jewelry" as const, productName: "Royal Gold Choker", price: "£680", link: "/jewellery" },
      { id: "h9-3", x: "40%", y: "50%", type: "jewelry" as const, productName: "Gold Cuff Bracelets", price: "£420", link: "/jewellery" },
    ]
  },
  { 
    id: 10, 
    image: modelHero10, 
    name: "Anastasia", 
    collection: "Pearl Couture Collection",
    description: "Baroque pearl statement necklace & crystal earrings",
    hotspots: [
      { id: "h10-1", x: "50%", y: "18%", type: "eyewear" as const, productName: "Cat-Eye Crystal Frames", price: "£345", link: "/eyewear" },
      { id: "h10-2", x: "42%", y: "25%", type: "jewelry" as const, productName: "Diamond Drop Earrings", price: "£520", link: "/jewellery" },
      { id: "h10-3", x: "50%", y: "38%", type: "jewelry" as const, productName: "Pearl Collar Necklace", price: "£890", link: "/jewellery" },
    ]
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

// Shop the Look Hotspot Component
const ShopHotspot = ({ 
  hotspot, 
  isActive,
  onHover,
  onLeave,
}: { 
  hotspot: Hotspot;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  return (
    <motion.div
      className="absolute z-30"
      style={{ left: hotspot.x, top: hotspot.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      {/* Pulsing hotspot */}
      <motion.button
        className="relative w-6 h-6 md:w-8 md:h-8"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onHover}
        whileHover={{ scale: 1.2 }}
      >
        {/* Outer pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-500/30"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Inner circle */}
        <div className="absolute inset-1 md:inset-1.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 flex items-center justify-center">
          {hotspot.type === "eyewear" ? (
            <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-black" />
          ) : (
            <ShoppingBag className="w-2.5 h-2.5 md:w-3 md:h-3 text-black" />
          )}
        </div>
      </motion.button>

      {/* Product tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute left-10 top-0 min-w-48 bg-white/95 backdrop-blur-md shadow-xl rounded-sm p-4 z-40"
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
              {hotspot.type === "eyewear" ? "Eyewear" : "Jewelry"}
            </p>
            <h4 className="font-serif text-neutral-900 text-sm mb-1">
              {hotspot.productName}
            </h4>
            <p className="text-amber-600 font-medium text-sm mb-3">
              {hotspot.price}
            </p>
            <Link
              to={hotspot.link}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-900 hover:text-amber-600 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Walking Model Component with runway animation
const WalkingModel = ({ 
  model, 
  isActive,
  isExiting,
  direction,
}: { 
  model: typeof models[0]; 
  isActive: boolean;
  isExiting: boolean;
  direction: "enter" | "exit";
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelRef.current) return;
    
    if (isActive && !isExiting) {
      // Walking in animation
      gsap.fromTo(
        modelRef.current,
        {
          x: "100%",
          scale: 0.8,
          opacity: 0,
          rotateY: -15,
        },
        {
          x: "0%",
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 1.5,
          ease: "power3.out",
        }
      );

      // Subtle walking sway
      gsap.to(modelRef.current, {
        y: "-10px",
        duration: 0.6,
        yoyo: true,
        repeat: 2,
        ease: "sine.inOut",
        delay: 0.3,
      });
    } else if (isExiting) {
      // Walking out animation
      gsap.to(modelRef.current, {
        x: "-100%",
        scale: 0.8,
        opacity: 0,
        rotateY: 15,
        duration: 1.2,
        ease: "power3.in",
      });
    }
  }, [isActive, isExiting]);

  if (!isActive && !isExiting) return null;

  return (
    <div
      ref={modelRef}
      className="absolute inset-0"
      style={{ perspective: "1200px" }}
    >
      {/* Model Image with walking effect */}
      <motion.div
        className="relative w-full h-full overflow-hidden"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={model.image}
          alt={`${model.name} - ${model.collection}`}
          className="w-full h-full object-cover object-center"
        />

        {/* Dramatic lighting sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            delay: 0.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Shop the Look Hotspots */}
      <div className="hidden md:block">
        <AnimatePresence>
          {isActive && !isExiting && model.hotspots.map((hotspot, index) => (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 1.5 + index * 0.2 }}
            >
              <ShopHotspot
                hotspot={hotspot}
                isActive={activeHotspot === hotspot.id}
                onHover={() => setActiveHotspot(hotspot.id)}
                onLeave={() => setActiveHotspot(null)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Model info overlay */}
      <motion.div
        className="absolute bottom-32 right-8 md:right-16 text-right z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isExiting ? 0 : 1, x: isExiting ? 50 : 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-xs tracking-luxury uppercase text-amber-400 mb-2 font-sans">
          {model.collection}
        </p>
        <p className="text-sm text-white/70 font-sans font-light max-w-xs">
          {model.description}
        </p>
      </motion.div>

      {/* Shop the Look badge - Mobile */}
      <motion.div
        className="absolute top-24 right-4 md:hidden z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Link
          to="/jewellery"
          className="flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm px-4 py-2 text-black text-xs uppercase tracking-wide"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Look
        </Link>
      </motion.div>
    </div>
  );
};

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showShopPanel, setShowShopPanel] = useState(false);
  const [brandZoomed, setBrandZoomed] = useState(false);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

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

  // Auto-rotate models like a runway show with walking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setExitingIndex(activeIndex);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % models.length);
        setExitingIndex(null);
      }, 1200);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Brand zoom animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setBrandZoomed(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline({ delay: 0.8 });
      
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

  // Brand zoom in effect
  useEffect(() => {
    if (brandRef.current && brandZoomed) {
      gsap.fromTo(
        brandRef.current,
        {
          scale: 3,
          opacity: 0,
          y: 100,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power4.out",
        }
      );
    }
  }, [brandZoomed]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: parallaxY }}
      >
        <video
          ref={videoRef}
          src={runwayVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Background Models Slideshow with Walking Animation */}
      <div className="absolute inset-0 z-[1]">
        {models.map((model, index) => (
          <WalkingModel
            key={model.id}
            model={model}
            isActive={index === activeIndex}
            isExiting={index === exitingIndex}
            direction={index === activeIndex ? "enter" : "exit"}
          />
        ))}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/30 z-10" />
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
      </div>

      {/* Diamond Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {sparkles.map((sparkle, i) => (
          <DiamondSparkle key={i} {...sparkle} />
        ))}
      </div>

      {/* Audio Toggle */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-24 right-4 md:right-8 z-40 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </motion.button>

      {/* Shop the Look Toggle */}
      <motion.button
        onClick={() => setShowShopPanel(!showShopPanel)}
        className="absolute top-24 right-16 md:right-20 z-40 flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm px-4 py-2.5 text-black text-xs uppercase tracking-wide hover:bg-amber-400 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="hidden sm:inline">Shop the Look</span>
      </motion.button>

      {/* Shop Panel */}
      <AnimatePresence>
        {showShopPanel && (
          <motion.div
            className="absolute top-36 right-4 md:right-8 z-50 w-80 bg-white/95 backdrop-blur-md shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-serif text-lg text-neutral-900">
                {models[activeIndex].name}'s Look
              </h3>
              <button onClick={() => setShowShopPanel(false)}>
                <X className="w-5 h-5 text-neutral-500 hover:text-neutral-900" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {models[activeIndex].hotspots.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-center gap-4 p-3 bg-neutral-50 hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-amber-100 flex items-center justify-center">
                    {item.type === "eyewear" ? (
                      <Eye className="w-5 h-5 text-amber-600" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-amber-600 uppercase tracking-wide">
                      {item.type}
                    </p>
                    <p className="font-medium text-neutral-900 text-sm">
                      {item.productName}
                    </p>
                    <p className="text-amber-600 text-sm">{item.price}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model Indicator Dots */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {models.map((model, index) => (
          <motion.button
            key={model.id}
            onClick={() => {
              setExitingIndex(activeIndex);
              setTimeout(() => {
                setActiveIndex(index);
                setExitingIndex(null);
              }, 1200);
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

          {/* Animated Title with Brand Zoom */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-8 md:mb-10 text-white overflow-hidden">
            <span className="hero-title-line block">
              Live The
            </span>
            <span 
              ref={brandRef}
              className="hero-title-line block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
            >
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
          Model {activeIndex + 1} of {models.length}
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
