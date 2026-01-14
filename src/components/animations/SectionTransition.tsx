import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

type TransitionType = "fade" | "slide-up" | "page-turn" | "reveal" | "zoom";

interface SectionTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  className?: string;
  delay?: number;
}

export const SectionTransition = ({
  children,
  type = "fade",
  className = "",
  delay = 0,
}: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax values for different effects
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [15, 0]);

  const getTransitionConfig = () => {
    switch (type) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };
      case "slide-up":
        return {
          initial: { opacity: 0, y: 80 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 },
          transition: { duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };
      case "page-turn":
        return {
          style: { opacity, rotateX, transformPerspective: 1200, transformOrigin: "top center" },
        };
      case "reveal":
        return {
          initial: { opacity: 0, y: 60, scale: 0.95 },
          animate: isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 },
          transition: { duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };
      case "zoom":
        return {
          style: { opacity, scale },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 0.8, delay },
        };
    }
  };

  const config = getTransitionConfig();

  return (
    <motion.div
      ref={ref}
      className={`${className} will-change-transform`}
      {...config}
    >
      {children}
    </motion.div>
  );
};

// Page flip effect wrapper
interface PageFlipSectionProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export const PageFlipSection = ({
  children,
  className = "",
  index = 0,
}: PageFlipSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [80, 0, 0, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.96, 1, 1, 0.98]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [8, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [4, 0, 0, 2]);

  return (
    <motion.div
      ref={ref}
      className={`${className} relative will-change-transform`}
      style={{
        opacity,
        y,
        scale,
        rotateX,
        transformPerspective: 1200,
        transformOrigin: "center center",
        filter: blur.get() > 0 ? `blur(${blur.get()}px)` : "none",
      }}
    >
      {/* Page shadow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.05) 100%)",
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 0, 0, 0.3]),
        }}
      />
      {children}
    </motion.div>
  );
};

// Elegant fade with slide
interface ElegantRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export const ElegantReveal = ({
  children,
  className = "",
  direction = "up",
}: ElegantRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getDirectionValues = () => {
    switch (direction) {
      case "up": return { y: 60, x: 0 };
      case "down": return { y: -60, x: 0 };
      case "left": return { y: 0, x: 60 };
      case "right": return { y: 0, x: -60 };
    }
  };

  const directionValues = getDirectionValues();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionValues }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directionValues }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {children}
    </motion.div>
  );
};
