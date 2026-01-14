import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

// Import real product images
import productNecklace from "@/assets/product-necklace.jpg";
import productRing from "@/assets/product-ring.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";

const collections = [
  {
    name: "New In",
    description: "Fresh arrivals",
    image: productNecklace,
    gradient: "from-rose-500/20 to-amber-500/20",
    href: "/collection/new-in",
  },
  {
    name: "Gold",
    description: "Timeless luxury",
    image: productRing,
    gradient: "from-amber-400/30 to-yellow-500/20",
    href: "/collection/gold",
  },
  {
    name: "Silver",
    description: "Modern elegance",
    image: productEarrings,
    gradient: "from-gray-300/30 to-slate-400/20",
    href: "/collection/silver",
  },
  {
    name: "Two Tone",
    description: "Perfect harmony",
    image: productBangle,
    gradient: "from-amber-400/20 via-gray-300/20 to-yellow-400/20",
    href: "/collection/two-tone",
  },
  {
    name: "Pearls",
    description: "Classic beauty",
    image: productPearlEarrings,
    gradient: "from-rose-200/30 to-pink-300/20",
    href: "/collection/pearl",
  },
];

// Small Glassmorphism Icon Card
const CollectionIconCard = ({ collection, index }: { collection: typeof collections[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      style={{ perspective: "600px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={collection.href} className="block">
        <motion.div
          className="relative overflow-hidden w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl mx-auto"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl" />
          
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} rounded-2xl`} />
          
          {/* Real Product Image */}
          <motion.div
            className="absolute inset-2 rounded-xl overflow-hidden"
            style={{
              transform: `translateZ(${isHovered ? 15 : 5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Image overlay for glass effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 rounded-xl" />
          </motion.div>
          
          {/* Glass border shine effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)`,
              transform: "translateZ(20px)",
            }}
          />
          
          {/* Sparkle on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ transform: "translateZ(25px)" }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full"
                  initial={{ 
                    x: `${20 + Math.random() * 60}%`, 
                    y: "100%", 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    y: "0%", 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeOut" 
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* Outer glow on hover */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
            style={{
              background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        </motion.div>
        
        {/* Text */}
        <motion.div 
          className="text-center mt-3"
          style={{
            transform: `perspective(600px) translateZ(${isHovered ? 5 : 0}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <motion.h3 
            className="font-serif text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors duration-300"
            animate={isHovered ? { y: -1 } : { y: 0 }}
          >
            {collection.name}
          </motion.h3>
          <motion.p 
            className="text-[9px] sm:text-[10px] text-neutral-500 font-sans font-light mt-0.5"
            animate={isHovered ? { opacity: 1 } : { opacity: 0.6 }}
          >
            {collection.description}
          </motion.p>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export const CollectionShowcase = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-12 md:py-16 bg-neutral-900 overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[300px] h-[300px] -top-20 -left-20 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] top-1/2 -right-10 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] md:text-xs tracking-luxury uppercase text-amber-400 font-sans font-light">
              Shop by Collection
            </p>
          </motion.div>
          <motion.h2
            className="font-serif text-xl sm:text-2xl md:text-3xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Find Your Perfect Shade
          </motion.h2>
        </motion.div>

        {/* Small Glassmorphism Icon Cards */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {collections.map((collection, index) => (
            <CollectionIconCard key={collection.name} collection={collection} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/jewellery"
            className="group inline-flex items-center gap-2 text-[10px] md:text-xs tracking-wide uppercase font-sans text-neutral-400 hover:text-amber-400 transition-colors duration-300"
          >
            View All Collections
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};