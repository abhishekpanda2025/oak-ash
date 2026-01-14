import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const collections = [
  {
    name: "New In",
    description: "Fresh arrivals",
    gradient: "from-rose-100 via-amber-50 to-rose-50",
    icon: "✨",
    href: "/collection/new-in",
    depth: 1,
  },
  {
    name: "Gold",
    description: "Timeless luxury",
    gradient: "from-amber-200 via-yellow-300 to-amber-400",
    icon: "🌟",
    href: "/collection/gold",
    depth: 2,
  },
  {
    name: "Silver",
    description: "Modern elegance",
    gradient: "from-gray-200 via-slate-200 to-gray-300",
    icon: "💫",
    href: "/collection/silver",
    depth: 1.5,
  },
  {
    name: "Two Tone",
    description: "Perfect harmony",
    gradient: "from-amber-200 via-gray-200 to-yellow-200",
    icon: "⚡",
    href: "/collection/two-tone",
    depth: 2.5,
  },
  {
    name: "Pearls",
    description: "Classic beauty",
    gradient: "from-rose-50 via-white to-pink-100",
    icon: "🌙",
    href: "/collection/pearl",
    depth: 1.8,
  },
];

// 3D Card component with parallax
const Collection3DCard = ({ collection, index }: { collection: typeof collections[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 200, damping: 30 });
  
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
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 100, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={collection.href} className="block">
        <motion.div
          className="relative overflow-hidden aspect-square"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Layered 3D Background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${collection.gradient}`}
            style={{
              transform: `translateZ(${isHovered ? 20 : 0}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          
          {/* Depth layers */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-black/5"
              style={{
                transform: `translateZ(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.02})`,
              }}
            />
          ))}
          
          {/* Icon with 3D float */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-6xl"
            style={{
              transform: `translateZ(${isHovered ? 60 : 30}px)`,
              transition: "transform 0.4s ease-out",
            }}
            animate={isHovered ? {
              y: [0, -10, 0],
              rotateZ: [0, 5, -5, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {collection.icon}
          </motion.div>
          
          {/* Holographic shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(
                ${isHovered ? 135 + (mouseX.get() * 90) : 135}deg,
                transparent 0%,
                rgba(255, 255, 255, 0.4) 25%,
                rgba(212, 175, 55, 0.3) 50%,
                rgba(255, 255, 255, 0.4) 75%,
                transparent 100%
              )`,
              transform: `translateZ(40px)`,
            }}
          />
          
          {/* Sparkle particles */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ transform: "translateZ(70px)" }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: "100%", 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    y: "-20%", 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeOut" 
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              boxShadow: "inset 0 0 60px rgba(212, 175, 55, 0.4)",
              transform: "translateZ(50px)",
            }}
          />
        </motion.div>
        
        {/* Text with 3D effect */}
        <motion.div 
          className="text-center mt-5"
          style={{
            transform: `perspective(1000px) translateZ(${isHovered ? 10 : 0}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <motion.h3 
            className="font-serif text-lg text-white group-hover:text-amber-400 transition-colors duration-300 mb-1"
            animate={isHovered ? { y: -2 } : { y: 0 }}
          >
            {collection.name}
          </motion.h3>
          <motion.p 
            className="text-xs text-neutral-500 font-sans font-light"
            animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
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
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  // Parallax transforms for background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={ref} className="relative section-padding bg-neutral-900 overflow-hidden">
      {/* 3D Parallax Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full"
          style={{
            y: floatingY1,
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] top-1/2 -right-32 rounded-full"
          style={{
            y: floatingY2,
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)",
          }}
        />
        
        {/* Grid perspective */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: bgY,
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: "perspective(500px) rotateX(60deg) translateY(-50%)",
            transformOrigin: "center top",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [null, "-100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div className="container-luxury relative z-10" style={{ opacity }}>
        {/* Header with 3D depth */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-20"
          initial={{ opacity: 0, y: 50, rotateX: -20 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ perspective: "1000px" }}
        >
          <div>
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <p className="text-xs tracking-luxury uppercase text-amber-400 font-sans font-light">
                Shop by Collection
              </p>
            </motion.div>
            <motion.h2
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-white relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="relative">
                Find Your Perfect Shade
                {/* Glowing underline */}
                <motion.span
                  className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-amber-500 via-amber-300 to-transparent"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/jewellery"
              className="group inline-flex items-center gap-2.5 text-xs tracking-wide uppercase font-sans mt-6 md:mt-0 text-neutral-400 hover:text-amber-400 transition-colors duration-300"
            >
              View All Collections
              <motion.span
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Collection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
          {collections.map((collection, index) => (
            <Collection3DCard key={collection.name} collection={collection} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
