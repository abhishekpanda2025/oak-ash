import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import craftingVideo from "@/assets/crafting-video.mp4";

export const CraftingVideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-neutral-950 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-luxury uppercase text-amber-400 mb-4 font-sans font-light">
            The Art of Creation
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Crafted with <span className="italic text-amber-400">Passion</span>
          </h2>
          <p className="text-neutral-400 font-sans font-light max-w-xl mx-auto">
            Witness the dedication and artistry behind every OAK & ASH piece, 
            where master craftsmen transform precious metals into timeless treasures.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          style={{ opacity, scale }}
        >
          {/* Decorative corners */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-amber-500/50 z-20" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-amber-500/50 z-20" />

          {/* Video wrapper */}
          <div className="relative aspect-video bg-neutral-900 overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay
            >
              <source src={craftingVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-neutral-950/30 pointer-events-none" />

            {/* Video controls */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
              <motion.button
                onClick={togglePlay}
                className="w-12 h-12 bg-amber-500/90 backdrop-blur-sm flex items-center justify-center text-black hover:bg-amber-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              <div className="text-white/70 text-xs font-sans tracking-wide uppercase">
                Master Craftsmanship
              </div>
            </div>

            {/* Play button overlay when paused */}
            {!isPlaying && (
              <motion.button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 z-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-20 h-20 bg-amber-500/90 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-black ml-1" />
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* Video caption */}
          <motion.p
            className="text-center text-neutral-500 text-sm font-sans font-light mt-6 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            "Every piece carries the soul of its maker" — OAK & ASH Atelier
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
