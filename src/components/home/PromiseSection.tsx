import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Gem, Truck, RefreshCw, Shield, ShoppingBag, Package, MapPin, Heart, Check, Star } from "lucide-react";

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
    icon: Truck,
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

// Animated delivery truck
const DeliveryTruck = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0"
      style={{ x: `${progress * 100}%` }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {/* Truck body */}
        <div className="w-16 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-sm relative">
          {/* Window */}
          <div className="absolute top-1 right-1 w-4 h-4 bg-neutral-900/50 rounded-sm" />
          {/* OAK & ASH text */}
          <span className="absolute top-2 left-1 text-[6px] font-bold text-neutral-900">OAK</span>
        </div>
        {/* Wheels */}
        <motion.div 
          className="absolute -bottom-2 left-2 w-4 h-4 bg-neutral-800 rounded-full border-2 border-neutral-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-2 right-2 w-4 h-4 bg-neutral-800 rounded-full border-2 border-neutral-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Speed lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-amber-500/60 to-transparent"
            style={{
              left: -20 - i * 10,
              top: 3 + i * 3,
              width: 15 - i * 3,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], x: [-5, 0, -5] }}
            transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
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
      {/* Face */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-amber-300 relative overflow-hidden">
        {/* Eyes */}
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
        {/* Smile */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-5 border-b-4 border-neutral-800 rounded-b-full"
          initial={{ scaleX: 0.5 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        {/* Blush */}
        <div className="absolute top-10 left-1 w-4 h-2 bg-rose-300/50 rounded-full" />
        <div className="absolute top-10 right-1 w-4 h-2 bg-rose-300/50 rounded-full" />
      </div>
      
      {/* Hearts floating up */}
      {isVisible && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-500"
          initial={{ 
            x: 10 + Math.random() * 10, 
            y: 0, 
            opacity: 0,
            scale: 0.5 
          }}
          animate={{ 
            y: -60 - Math.random() * 30, 
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: 10 + (Math.random() - 0.5) * 40
          }}
          transition={{ 
            duration: 2, 
            delay: 0.5 + i * 0.3,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Heart className="w-4 h-4 fill-current" />
        </motion.div>
      ))}
      
      {/* Stars around */}
      {isVisible && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400"
          style={{
            left: `${20 + i * 20}%`,
            top: -10 + (i % 2) * 10,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1, 0], rotate: 180 }}
          transition={{ 
            duration: 1.5, 
            delay: 1 + i * 0.2,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Star className="w-3 h-3 fill-current" />
        </motion.div>
      ))}
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
            Our Promise
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-neutral-800">
            The OAK &amp; ASH Experience
          </h2>
        </motion.div>

        {/* Animated Journey Section */}
        <motion.div
          className="mb-20 bg-white p-8 md:p-12 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-center font-serif text-xl md:text-2xl text-neutral-800 mb-10">
            Your Shopping Journey
          </h3>
          
          {/* Journey timeline */}
          <div className="relative">
            {/* Progress track */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-green-400 via-purple-400 via-blue-400 to-rose-400"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStage / (journeyStages.length - 1)) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            
            {/* Animated truck on the track */}
            <div className="absolute top-5 left-0 right-16 h-8">
              <DeliveryTruck progress={currentStage / (journeyStages.length - 1)} />
            </div>
            
            {/* Journey stages */}
            <div className="flex justify-between relative z-10 pt-4">
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
              className="text-center mt-4 font-serif text-lg text-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              animate={journeyComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              Another Happy Customer! 💎
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
