import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
  isNavigation?: boolean;
}

export const LoadingScreen = ({ onComplete, isNavigation = false }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = isNavigation ? 1000 : 2500;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, isNavigation]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Background gold particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: isNavigation ? 15 : 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-500/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: isNavigation ? 1 : 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Decorative line */}
          <motion.div
            className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: isNavigation ? 0.5 : 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Logo Animation */}
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="absolute border border-amber-500/30 rounded-full"
              style={{ width: 140, height: 140, left: -45, top: -45 }}
              initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: isNavigation ? 1 : 2, ease: "linear", repeat: Infinity }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute border border-amber-400/40 rounded-full"
              style={{ width: 100, height: 100, left: -25, top: -25 }}
              initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -360 }}
              transition={{ duration: isNavigation ? 1.5 : 3, ease: "linear", repeat: Infinity }}
            />

            {/* Main logo */}
            <motion.div
              className="relative w-[50px] h-[50px] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-serif text-4xl text-white">O</span>
            </motion.div>
          </div>

          {/* Brand Text */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: isNavigation ? 0.2 : 0.5 }}
          >
            <div className="font-serif text-3xl md:text-4xl tracking-wider mb-3">
              <motion.span
                className="inline-block text-white"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: isNavigation ? 0.3 : 0.7 }}
              >
                OAK
              </motion.span>
              <motion.span
                className="inline-block text-amber-500 mx-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: isNavigation ? 0.4 : 0.9 }}
              >
                &
              </motion.span>
              <motion.span
                className="inline-block text-white"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: isNavigation ? 0.5 : 1.1 }}
              >
                ASH
              </motion.span>
            </div>
            
            <motion.p
              className="text-[10px] tracking-[0.3em] uppercase text-amber-400/80 font-sans font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: isNavigation ? 0.6 : 1.3 }}
            >
              Premium Jewelry & Eyewear
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: isNavigation ? 0.8 : 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-6 left-6 w-12 h-12 border-l border-t border-amber-500/30"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-amber-500/30"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
