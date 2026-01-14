import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Gem, RefreshCw, Shield, ShoppingBag, Package, Heart, Check, Star, Sparkles, Gift, Truck } from "lucide-react";

// Animated journey stages
const journeyStages = [
  {
    icon: ShoppingBag,
    title: "Browse & Shop",
    description: "Discover your perfect piece",
    color: "from-amber-400 to-amber-600",
  },
  {
    icon: Check,
    title: "Order Placed",
    description: "Secure checkout complete",
    color: "from-green-400 to-green-600",
  },
  {
    icon: Package,
    title: "Carefully Packed",
    description: "Premium gift packaging",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Truck,
    title: "On Its Way",
    description: "Express delivery to you",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Heart,
    title: "Joy Delivered",
    description: "Customer happiness",
    color: "from-rose-400 to-rose-600",
  },
];

const promises = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Each piece crafted with the finest materials and meticulous attention to detail.",
    delay: 0,
  },
  {
    icon: Gift,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders over $150 with secure packaging.",
    delay: 0.1,
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns if you're not completely satisfied.",
    delay: 0.2,
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Your jewelry is protected with our comprehensive lifetime warranty.",
    delay: 0.3,
  },
];

// 3D Animated Package with Parallax
const AnimatedPackage = ({ progress }: { progress: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      ref={containerRef}
      className="absolute bottom-2 left-0"
      style={{ x: `${progress * 100}%`, perspective: "500px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <motion.div
        className="relative cursor-pointer"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* 3D Gift Box */}
        <div className="relative w-14 h-14 md:w-16 md:h-16" style={{ transformStyle: "preserve-3d" }}>
          {/* Front face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 rounded-lg shadow-xl"
            style={{ transform: "translateZ(8px)" }}
          >
            {/* Ribbon vertical */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-200 to-amber-300 -translate-x-1/2 shadow-inner" />
            {/* Ribbon horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 -translate-y-1/2 shadow-inner" />
            {/* Bow */}
            <motion.div 
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="relative">
                <div className="w-4 h-3 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full absolute -left-3 top-0 rotate-[-30deg] shadow-md" />
                <div className="w-4 h-3 bg-gradient-to-l from-amber-300 to-amber-400 rounded-full absolute -right-3 top-0 rotate-[30deg] shadow-md" />
                <div className="w-2 h-2 bg-amber-300 rounded-full relative z-10 shadow-md" />
              </div>
            </motion.div>
            {/* OAK & ASH logo */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              <span className="text-[6px] font-bold text-amber-100">OAK&ASH</span>
            </div>
          </motion.div>
          
          {/* Side face */}
          <motion.div
            className="absolute top-0 right-0 w-4 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-r-lg"
            style={{ transform: "rotateY(90deg) translateZ(7px)" }}
          />
          
          {/* Top face */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-400 to-amber-500"
            style={{ transform: "rotateX(90deg) translateZ(7px)" }}
          />
        </div>
        
        {/* Sparkle effects */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-300"
            style={{
              left: `${-10 + i * 35}%`,
              top: `${-15 + (i % 2) * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        ))}
        
        {/* Motion trail */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`trail-${i}`}
            className="absolute w-1 h-1 bg-amber-400/50 rounded-full"
            style={{ left: -8 - i * 6, top: "50%" }}
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Shop Building Animation with 3D Parallax
const ShopBuilding = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      className="absolute left-0 -top-4"
      animate={isActive ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
      style={{ perspective: "200px" }}
    >
      <motion.div
        whileHover={{ rotateY: 10, rotateX: -5 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width="36" height="45" viewBox="0 0 40 50" className="drop-shadow-lg">
          {/* Building with 3D effect */}
          <defs>
            <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#6B5344" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          
          <rect x="5" y="15" width="30" height="35" fill="url(#buildingGrad)" />
          <rect x="8" y="20" width="10" height="12" fill="#D4AF37" opacity="0.9" />
          <rect x="22" y="20" width="10" height="12" fill="#D4AF37" opacity="0.9" />
          <rect x="15" y="35" width="10" height="15" fill="#654321" />
          
          <polygon points="0,15 20,0 40,15" fill="url(#roofGrad)" />
          
          <rect x="10" y="5" width="20" height="8" fill="#FFF8DC" />
          <text x="12" y="11" fontSize="5" fill="#333" fontWeight="bold">OAK</text>
          
          <motion.rect
            x="16" y="36"
            width="8" height="2"
            fill="#FFE066"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Customer House Animation with 3D Parallax
const CustomerHouse = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      className="absolute right-0 -top-4"
      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5 }}
      style={{ perspective: "200px" }}
    >
      <motion.div
        whileHover={{ rotateY: -10, rotateX: -5 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width="36" height="45" viewBox="0 0 40 50" className="drop-shadow-lg">
          <defs>
            <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8D5B7" />
              <stop offset="100%" stopColor="#D4C4A8" />
            </linearGradient>
          </defs>
          
          <rect x="5" y="20" width="30" height="30" fill="url(#houseGrad)" />
          <rect x="10" y="25" width="8" height="8" fill="#87CEEB" />
          <rect x="22" y="25" width="8" height="8" fill="#87CEEB" />
          <rect x="15" y="38" width="10" height="12" fill="#8B4513" />
          
          <polygon points="0,20 20,5 40,20" fill="#DC143C" />
          <rect x="28" y="8" width="6" height="10" fill="#666" />
          
          {isActive && (
            <motion.text
              x="18" y="46"
              fontSize="8"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ❤️
            </motion.text>
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Happy customer animation
const HappyCustomer = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <motion.div
      className="relative w-24 h-24 mx-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-amber-300 relative overflow-hidden shadow-lg">
        <motion.div
          className="absolute top-8 left-5 w-3 h-3 bg-neutral-800 rounded-full"
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-8 right-5 w-3 h-3 bg-neutral-800 rounded-full"
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        
        <div className="absolute top-7 left-6 w-1 h-1 bg-white rounded-full" />
        <div className="absolute top-7 right-6 w-1 h-1 bg-white rounded-full" />
        
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-5 border-b-4 border-neutral-800 rounded-b-full"
          initial={{ scaleX: 0.5 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        
        <div className="absolute top-11 left-2 w-4 h-2 bg-rose-300/60 rounded-full blur-[1px]" />
        <div className="absolute top-11 right-2 w-4 h-2 bg-rose-300/60 rounded-full blur-[1px]" />
        
        <motion.div
          className="absolute top-5 left-1/2 -translate-x-1/2"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-amber-600" />
        </motion.div>
      </div>
      
      {isVisible && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-500"
          initial={{ x: 12, y: 0, opacity: 0, scale: 0.5 }}
          animate={{ 
            y: -60 - Math.random() * 30, 
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            x: 12 + (Math.random() - 0.5) * 40
          }}
          transition={{ 
            duration: 2, 
            delay: 0.5 + i * 0.2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Heart className="w-4 h-4 fill-current" />
        </motion.div>
      ))}
      
      {isVisible && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400"
          style={{ left: `${20 + i * 20}%`, top: -12 + (i % 2) * 8 }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1, 0], rotate: 360 }}
          transition={{ duration: 1.5, delay: 1 + i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <Star className="w-3 h-3 fill-current" />
        </motion.div>
      ))}
      
      {isVisible && (
        <motion.div
          className="absolute -bottom-2 -right-2"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-sm flex items-center justify-center shadow-lg">
            <Gift className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Animated promise card with 3D parallax
const PromiseCard = ({ promise, index, isInView }: { 
  promise: typeof promises[0]; 
  index: number;
  isInView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="relative text-center group"
      initial={{ opacity: 0, y: 50, rotateY: -30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0); }}
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{ rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0, transformStyle: "preserve-3d" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative inline-flex items-center justify-center w-18 h-18 md:w-20 md:h-20 mb-5 overflow-hidden"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute inset-0 border border-amber-500/30"
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          />
          
          <motion.div
            className="absolute inset-1 border border-amber-500/20"
            animate={{ rotate: isHovered ? -180 : 0 }}
            transition={{ duration: 0.6 }}
          />
          
          <motion.div
            className="absolute inset-0 bg-amber-500/10"
            animate={{ 
              scale: isHovered ? [1, 1.2, 1] : 1,
              opacity: isHovered ? [0.1, 0.3, 0.1] : 0.1 
            }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
          
          <motion.div
            animate={{ 
              y: isHovered ? [0, -5, 0] : 0,
              rotateY: isHovered ? [0, 360] : 0
            }}
            transition={{ duration: 0.6 }}
            style={{ transform: `translateZ(${isHovered ? 20 : 0}px)` }}
          >
            <promise.icon className="w-7 h-7 md:w-8 md:h-8 text-amber-500" />
          </motion.div>
          
          {isHovered && [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: [0, (i % 2 === 0 ? 20 : -20) * Math.cos(i * Math.PI / 2)],
                y: [0, (i % 2 === 0 ? 20 : -20) * Math.sin(i * Math.PI / 2)]
              }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
        
        <motion.h3 
          className="font-serif text-base md:text-lg mb-2 text-neutral-800 relative inline-block"
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {promise.title}
          <motion.span
            className="absolute -bottom-1 left-0 h-px bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.h3>
        
        <motion.p 
          className="text-xs md:text-sm text-neutral-600 font-sans leading-relaxed px-2"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          {promise.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export const PromiseSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentStage, setCurrentStage] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);
  
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= journeyStages.length - 1) {
          setJourneyComplete(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative section-padding bg-neutral-100 overflow-hidden">
      {/* Static background pattern - no parallax */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
            Your Shopping Journey
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800">
            Our Promise
          </h2>
        </motion.div>

        <motion.div
          className="mb-16 md:mb-20 bg-white p-6 md:p-10 lg:p-12 shadow-lg rounded-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-center font-serif text-lg md:text-xl lg:text-2xl text-neutral-800 mb-10 md:mb-12">
            From OAK & ASH Shop to Your Doorstep
          </h3>
          
          <div className="relative">
            <div className="absolute top-0 left-2 right-2 md:left-4 md:right-4 flex justify-between pointer-events-none">
              <ShopBuilding isActive={currentStage === 0} />
              <CustomerHouse isActive={currentStage >= journeyStages.length - 1} />
            </div>
            
            <div className="absolute top-14 md:top-16 left-10 right-10 md:left-12 md:right-12 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStage / (journeyStages.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="absolute top-[60px] md:top-[68px] left-10 right-10 md:left-12 md:right-12 flex justify-between px-2 md:px-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 md:w-4 h-1 bg-white/80 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
            
            <div className="absolute top-6 md:top-8 left-10 right-16 md:left-12 md:right-20 h-12">
              <AnimatedPackage progress={currentStage / (journeyStages.length - 1)} />
            </div>
            
            <div className="flex justify-between relative z-10 pt-20 md:pt-24">
              {journeyStages.map((stage, index) => {
                const isActive = index <= currentStage;
                const isCurrent = index === currentStage;
                
                return (
                  <motion.div
                    key={stage.title}
                    className="flex flex-col items-center w-1/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={`relative w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-2 md:mb-3 ${
                        isActive 
                          ? `bg-gradient-to-br ${stage.color} text-white shadow-lg` 
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                      animate={isCurrent ? { 
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(212, 175, 55, 0)",
                          "0 0 0 15px rgba(212, 175, 55, 0.2)",
                          "0 0 0 0 rgba(212, 175, 55, 0)"
                        ]
                      } : {}}
                      transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                    >
                      <stage.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                      
                      {isActive && index < currentStage && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <motion.p
                      className={`text-[10px] md:text-xs lg:text-sm font-medium text-center ${
                        isActive ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                      animate={isCurrent ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                    >
                      {stage.title}
                    </motion.p>
                    <p className="text-[8px] md:text-[10px] lg:text-xs text-neutral-500 text-center hidden sm:block">
                      {stage.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <motion.div
            className="mt-10 md:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: journeyComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <HappyCustomer isVisible={journeyComplete} />
            <motion.p
              className="text-center mt-5 md:mt-6 font-serif text-base md:text-lg text-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              animate={journeyComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              Another Happy Customer! 💎✨
            </motion.p>
            <motion.p
              className="text-center text-xs md:text-sm text-neutral-600 mt-2"
              initial={{ opacity: 0 }}
              animate={journeyComplete ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              Thank you for shopping with OAK & ASH
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {promises.map((promise, index) => (
            <PromiseCard 
              key={promise.title} 
              promise={promise} 
              index={index} 
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
