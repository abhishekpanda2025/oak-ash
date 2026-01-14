import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    name: "New In",
    description: "Fresh arrivals",
    gradient: "from-rose-100 via-amber-50 to-rose-50",
    icon: "✨",
    href: "/collection/new-in",
  },
  {
    name: "Gold",
    description: "Timeless luxury",
    gradient: "from-amber-200 via-yellow-300 to-amber-400",
    icon: "🌟",
    href: "/collection/gold",
  },
  {
    name: "Silver",
    description: "Modern elegance",
    gradient: "from-gray-200 via-slate-200 to-gray-300",
    icon: "💫",
    href: "/collection/silver",
  },
  {
    name: "Two Tone",
    description: "Perfect harmony",
    gradient: "from-amber-200 via-gray-200 to-yellow-200",
    icon: "⚡",
    href: "/collection/two-tone",
  },
  {
    name: "Pearls",
    description: "Classic beauty",
    gradient: "from-rose-50 via-white to-pink-100",
    icon: "🌙",
    href: "/collection/pearl",
  },
];

export const CollectionShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <section ref={ref} className="section-padding bg-neutral-900 overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <motion.p 
              className="text-xs tracking-luxury uppercase text-amber-400 mb-4 font-sans font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Shop by Collection
            </motion.p>
            <motion.h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Perfect Shade
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
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Collection Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.name}
              variants={itemVariants}
            >
              <Link to={collection.href} className="group block">
                <motion.div 
                  className="relative overflow-hidden aspect-square mb-5"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Gradient Background */}
                  <motion.div
                    className={`w-full h-full bg-gradient-to-br ${collection.gradient}`}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-5xl"
                    initial={{ opacity: 0.6, scale: 1 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    {collection.icon}
                  </motion.div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                      initial={{ x: "-100%", y: "-100%" }}
                      whileHover={{ x: "100%", y: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  
                  {/* Gold glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_30px_rgba(212,184,106,0.3)]" />
                </motion.div>
                
                <div className="text-center">
                  <h3 className="font-serif text-lg text-white group-hover:text-amber-400 transition-colors duration-300 mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-light">
                    {collection.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
