import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";

export const CraftsmanshipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-neutral-900" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A45C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}
        />
      </motion.div>

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Video/Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={craftsmanshipImage}
                alt="Artisan crafting jewelry"
                className="w-full h-full object-cover"
              />
              
              {/* Play button overlay for video */}
              <motion.button
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm group cursor-pointer"
                whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-neutral-900 ml-1" fill="currentColor" />
                </motion.div>
              </motion.button>
              
              {/* Gold frame decoration */}
              <div className="absolute -inset-4 border border-amber-500/30 pointer-events-none" />
            </div>
            
            {/* Decorative element */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-40 h-40 border border-amber-500/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs tracking-luxury uppercase text-amber-400 mb-6 font-sans font-light">
              Our Craftsmanship
            </p>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-tight">
              Inspired by the Strength of Oak
              <br />
              <span className="italic text-amber-400">&amp; the Grace of Ash</span>
            </h2>
            
            <div className="space-y-6 text-neutral-300 font-sans font-light leading-relaxed text-base">
              <p>
                Every piece in our collection represents a harmony between timeless design and modern elegance. Our master artisans bring decades of expertise to each creation.
              </p>
              <p>
                From the initial sketch to the final polish, each piece of OAK &amp; ASH jewelry passes through the hands of skilled craftspeople who treat every creation as a work of art.
              </p>
            </div>

            {/* Editorial Quote */}
            <motion.blockquote
              className="mt-12 pl-6 border-l-2 border-amber-500/50"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="font-serif text-xl italic text-white leading-relaxed">
                "Every piece is crafted to become part of your story."
              </p>
              <cite className="block mt-4 text-xs tracking-luxury uppercase text-amber-400 font-sans not-italic">
                — The Founders
              </cite>
            </motion.blockquote>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-14 pt-10 border-t border-white/10">
              {[
                { value: "25+", label: "Years of Craft" },
                { value: "500+", label: "Unique Designs" },
                { value: "15K+", label: "Happy Clients" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <span className="font-serif text-3xl md:text-4xl text-amber-400">
                    {stat.value}
                  </span>
                  <p className="text-[10px] tracking-luxury uppercase text-neutral-400 mt-2 font-sans">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
