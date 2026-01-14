import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const getVariants = (direction: RevealDirection): Variants => {
  const distance = 80;
  
  const variants: Record<RevealDirection, Variants> = {
    up: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
    },
    down: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };
  
  return variants[direction];
};

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
  amount = 0.3,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants(direction)}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: RevealDirection;
  once?: boolean;
}

export const StaggerReveal = ({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
  once = true,
}: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
}

export const StaggerItem = ({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) => {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction)}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const Parallax = ({
  children,
  className = "",
  speed = 0.5,
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        willChange: "transform",
      }}
      initial={{ y: 0 }}
      whileInView={{ y: `${speed * -20}%` }}
      transition={{
        type: "tween",
        ease: "linear",
      }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};
