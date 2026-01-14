import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Gem, RefreshCw, Shield, ShoppingBag, Package, Heart, Check, Star, Sparkles, Gift } from "lucide-react";

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
    icon: Gift,
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

// Animated Scooty Delivery
const DeliveryScooty = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0"
      style={{ x: `${progress * 100}%` }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -2, 0, -1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        {/* Scooty body */}
        <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-lg">
          {/* Rear wheel */}
          <motion.circle
            cx="12"
            cy="32"
            r="7"
            fill="#333"
            stroke="#555"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="12" cy="32" r="3" fill="#888" />
          
          {/* Front wheel */}
          <motion.circle
            cx="48"
            cy="32"
            r="7"
            fill="#333"
            stroke="#555"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="48" cy="32" r="3" fill="#888" />
          
          {/* Body */}
          <path
            d="M8 25 Q 15 10, 30 12 L 45 12 Q 52 12, 50 25 L 48 28 L 12 28 Z"
            fill="url(#scootyGradient)"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          
          {/* Seat */}
          <ellipse cx="25" cy="12" rx="10" ry="3" fill="#222" />
          
          {/* Handlebar */}
          <line x1="48" y1="12" x2="52" y2="5" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="4" x2="56" y2="4" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          
          {/* Delivery Box */}
          <rect x="12" y="4" width="16" height="10" fill="#D4AF37" rx="1" />
          <text x="14" y="11" fontSize="5" fontWeight="bold" fill="#000">OAK</text>
          
          {/* Headlight */}
          <motion.circle
            cx="54"
            cy="20"
            r="2"
            fill="#FFE066"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          
          <defs>
            <linearGradient id="scootyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Rider silhouette */}
        <motion.div
          className="absolute -top-4 left-4"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28">
            {/* Head with helmet */}
            <ellipse cx="12" cy="6" rx="6" ry="5" fill="#333" />
            <ellipse cx="12" cy="5" rx="5" ry="4" fill="#444" />
            
            {/* Body */}
            <path
              d="M8 10 L6 24 L18 24 L16 10 Z"
              fill="#222"
            />
            
            {/* Arms */}
            <path
              d="M16 12 Q 22 14, 20 18"
              stroke="#222"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        
        {/* Speed lines */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-amber-500/60 to-transparent"
            style={{
              left: -25 - i * 8,
              top: 20 + i * 5,
              width: 20 - i * 3,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], x: [-3, 0, -3] }}
            transition={{ duration: 0.25, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
        
        {/* Dust particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-neutral-400"
            style={{
              left: -10 - i * 5,
              top: 30 + (i % 2) * 5,
              width: 3 - (i % 3),
              height: 3 - (i % 3),
            }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              x: [-5, -15],
              y: [0, -5 + Math.random() * 10]
            }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.1,
              repeatDelay: 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Shop Building Animation
const ShopBuilding = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      className="absolute left-0 -top-8"
      animate={isActive ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg width="40" height="50" viewBox="0 0 40 50">
        {/* Building */}
        <rect x="5" y="15" width="30" height="35" fill="#8B7355" />
        <rect x="8" y="20" width="10" height="12" fill="#D4AF37" />
        <rect x="22" y="20" width="10" height="12" fill="#D4AF37" />
        <rect x="15" y="35" width="10" height="15" fill="#654321" />
        
        {/* Roof */}
        <polygon points="0,15 20,0 40,15" fill="#D4AF37" />
        
        {/* Sign */}
        <rect x="10" y="5" width="20" height="8" fill="#FFF8DC" />
        <text x="12" y="11" fontSize="5" fill="#333" fontWeight="bold">OAK</text>
        
        {/* Door light */}
        <motion.rect
          x="16" y="36"
          width="8" height="2"
          fill="#FFE066"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
};

// Customer House Animation
const CustomerHouse = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      className="absolute right-0 -top-8"
      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg width="40" height="50" viewBox="0 0 40 50">
        {/* House */}
        <rect x="5" y="20" width="30" height="30" fill="#E8D5B7" />
        <rect x="10" y="25" width="8" height="8" fill="#87CEEB" />
        <rect x="22" y="25" width="8" height="8" fill="#87CEEB" />
        <rect x="15" y="38" width="10" height="12" fill="#8B4513" />
        
        {/* Roof */}
        <polygon points="0,20 20,5 40,20" fill="#DC143C" />
        
        {/* Chimney */}
        <rect x="28" y="8" width="6" height="10" fill="#666" />
        
        {/* Heart on door */}
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
  );
};

// Happy customer animation
const HappyCustomer = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <motion.div
      className="relative w-28 h-28 mx-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Face */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-amber-300 relative overflow-hidden shadow-lg">
        {/* Eyes */}
        <motion.div
          className="absolute top-9 left-6 w-3.5 h-3.5 bg-neutral-800 rounded-full"
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-9 right-6 w-3.5 h-3.5 bg-neutral-800 rounded-full"
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        
        {/* Sparkle in eyes */}
        <div className="absolute top-8 left-7 w-1.5 h-1.5 bg-white rounded-full" />
        <div className="absolute top-8 right-7 w-1.5 h-1.5 bg-white rounded-full" />
        
        {/* Smile */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-neutral-800 rounded-b-full"
          initial={{ scaleX: 0.5 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        
        {/* Blush */}
        <div className="absolute top-12 left-2 w-5 h-2.5 bg-rose-300/60 rounded-full blur-[1px]" />
        <div className="absolute top-12 right-2 w-5 h-2.5 bg-rose-300/60 rounded-full blur-[1px]" />
        
        {/* Jewelry on customer */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-amber-600" />
        </motion.div>
      </div>
      
      {/* Hearts floating up */}
      {isVisible && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-500"
          initial={{ 
            x: 14 + Math.random() * 10, 
            y: 0, 
            opacity: 0,
            scale: 0.5 
          }}
          animate={{ 
            y: -70 - Math.random() * 40, 
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            x: 14 + (Math.random() - 0.5) * 50
          }}
          transition={{ 
            duration: 2.5, 
            delay: 0.5 + i * 0.25,
            repeat: Infinity,
            repeatDelay: 0.8
          }}
        >
          <Heart className="w-5 h-5 fill-current" />
        </motion.div>
      ))}
      
      {/* Stars around */}
      {isVisible && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400"
          style={{
            left: `${15 + i * 18}%`,
            top: -15 + (i % 2) * 10,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1, 0], rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            delay: 1 + i * 0.15,
            repeat: Infinity,
            repeatDelay: 1.5
          }}
        >
          <Star className="w-4 h-4 fill-current" />
        </motion.div>
      ))}
      
      {/* Gift box appearing */}
      {isVisible && (
        <motion.div
          className="absolute -bottom-2 -right-2"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-sm flex items-center justify-center shadow-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Animated promise card
const PromiseCard = ({ promise, index, isInView }: { 
  promise: typeof promises[0]; 
  index: number;
  isInView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative text-center group"
      initial={{ opacity: 0, y: 50, rotateY: -30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Icon container with animation */}
      <motion.div
        className="relative inline-flex items-center justify-center w-20 h-20 mb-6 overflow-hidden"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Rotating border */}
        <motion.div
          className="absolute inset-0 border border-amber-500/30"
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Second rotating border (opposite) */}
        <motion.div
          className="absolute inset-1 border border-amber-500/20"
          animate={{ rotate: isHovered ? -180 : 0 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-0 bg-amber-500/10"
          animate={{ 
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.1, 0.3, 0.1] : 0.1 
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />
        
        {/* Icon */}
        <motion.div
          animate={{ 
            y: isHovered ? [0, -5, 0] : 0,
            rotateY: isHovered ? [0, 360] : 0
          }}
          transition={{ duration: 0.6 }}
        >
          <promise.icon className="w-8 h-8 text-amber-500" />
        </motion.div>
        
        {/* Sparkle effect on hover */}
        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
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
          </>
        )}
      </motion.div>
      
      {/* Title with underline animation */}
      <motion.h3 
        className="font-serif text-lg mb-2 text-neutral-800 relative inline-block"
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
        className="text-sm text-neutral-600 font-sans leading-relaxed"
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      >
        {promise.description}
      </motion.p>
    </motion.div>
  );
};

export const PromiseSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentStage, setCurrentStage] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  
  // Animate through journey stages
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
      {/* Background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ y }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>

      <div className="container-luxury relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
            Your Shopping Journey
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-neutral-800">
            Our Promise
          </h2>
        </motion.div>

        {/* Animated Journey Section */}
        <motion.div
          className="mb-20 bg-white p-8 md:p-12 shadow-lg rounded-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-center font-serif text-xl md:text-2xl text-neutral-800 mb-12">
            From OAK & ASH Shop to Your Doorstep
          </h3>
          
          {/* Journey timeline with Scooty */}
          <div className="relative">
            {/* Shop and House illustrations */}
            <div className="absolute top-0 left-4 right-4 flex justify-between pointer-events-none">
              <ShopBuilding isActive={currentStage === 0} />
              <CustomerHouse isActive={currentStage >= journeyStages.length - 1} />
            </div>
            
            {/* Progress track */}
            <div className="absolute top-16 left-12 right-12 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStage / (journeyStages.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            {/* Road markings */}
            <div className="absolute top-[68px] left-12 right-12 flex justify-between px-4">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-1 bg-white/80 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
            
            {/* Animated scooty on the track */}
            <div className="absolute top-8 left-12 right-20 h-12">
              <DeliveryScooty progress={currentStage / (journeyStages.length - 1)} />
            </div>
            
            {/* Journey stages */}
            <div className="flex justify-between relative z-10 pt-24">
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
                    {/* Stage icon */}
                    <motion.div
                      className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 ${
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
                      <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                      
                      {/* Checkmark for completed stages */}
                      {isActive && index < currentStage && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {/* Stage text */}
                    <motion.p
                      className={`text-xs md:text-sm font-medium text-center ${
                        isActive ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                      animate={isCurrent ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                    >
                      {stage.title}
                    </motion.p>
                    <p className="text-[10px] md:text-xs text-neutral-500 text-center hidden md:block">
                      {stage.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Happy customer when journey completes */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: journeyComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <HappyCustomer isVisible={journeyComplete} />
            <motion.p
              className="text-center mt-6 font-serif text-lg text-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              animate={journeyComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              Another Happy Customer! 💎✨
            </motion.p>
            <motion.p
              className="text-center text-sm text-neutral-600 mt-2"
              initial={{ opacity: 0 }}
              animate={journeyComplete ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              Thank you for shopping with OAK & ASH
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Promise Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
