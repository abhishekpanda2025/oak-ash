import { useEffect, useRef, ReactNode } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered animation wrapper
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  duration?: number;
  once?: boolean;
}

export const ScrollReveal = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  duration = 0.8,
  once = true
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const controls = useAnimation();

  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 60 };
      case "down": return { opacity: 0, y: -60 };
      case "left": return { opacity: 0, x: 60 };
      case "right": return { opacity: 0, x: -60 };
      case "scale": return { opacity: 0, scale: 0.9 };
      default: return { opacity: 0, y: 60 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "up":
      case "down": return { opacity: 1, y: 0 };
      case "left":
      case "right": return { opacity: 1, x: 0 };
      case "scale": return { opacity: 1, scale: 1 };
      default: return { opacity: 1, y: 0 };
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start(getAnimate());
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ 
  children, 
  className = "" 
}: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Magnetic hover effect for buttons
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic = ({ children, className = "", strength = 0.3 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Parallax wrapper
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const Parallax = ({ children, className = "", speed = 0.5 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollY = window.scrollY;
      const rect = ref.current.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const relativeScroll = scrollY - elementTop;
      ref.current.style.transform = `translateY(${relativeScroll * speed}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Text reveal animation
interface TextRevealProps {
  children: string;
  delay?: number;
  className?: string;
}

export const TextReveal = ({ children, delay = 0, className = '' }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const words = children.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Floating animation
interface FloatingProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export const Floating = ({ 
  children, 
  duration = 3, 
  distance = 10,
  className = '' 
}: FloatingProps) => {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Smooth scroll hook for mobile-like swipe
export const useSmoothScroll = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const scrollContainers = document.querySelectorAll('.scroll-smooth');
    scrollContainers.forEach(container => {
      (container as HTMLElement).style.setProperty('-webkit-overflow-scrolling', 'touch');
    });

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
};
