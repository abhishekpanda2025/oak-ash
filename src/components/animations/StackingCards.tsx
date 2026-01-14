import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

const StackingCard = ({ children, index, totalCards }: StackingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const startOffset = index * 100;
    const endOffset = (totalCards - index - 1) * 100;
    
    // Create the stacking animation
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: `top-=${startOffset} center`,
        end: `bottom+=${endOffset} center`,
        scrub: 0.5,
        pin: true,
        pinSpacing: false,
      },
      scale: 1 - (totalCards - index - 1) * 0.02,
      y: (totalCards - index - 1) * 10,
      filter: `brightness(${1 - (totalCards - index - 1) * 0.05})`,
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, [index, totalCards]);

  return (
    <div 
      ref={cardRef} 
      className="w-full relative will-change-transform"
      style={{ 
        zIndex: totalCards - index,
        transformOrigin: "center top",
      }}
    >
      <motion.div
        className="w-full shadow-2xl"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface StackingCardsContainerProps {
  children: ReactNode[];
  className?: string;
}

export const StackingCardsContainer = ({ children, className = "" }: StackingCardsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children.map((child, index) => (
        <StackingCard key={index} index={index} totalCards={children.length}>
          {child}
        </StackingCard>
      ))}
    </div>
  );
};

// Alternative: Smooth stacking with framer-motion only
interface SmoothStackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

export const SmoothStackingCard = ({ children, index, totalCards }: SmoothStackingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  
  const stackProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
  const scale = useTransform(stackProgress, [0, 1], [1, 0.95]);
  const y = useTransform(stackProgress, [0, 1], [0, index * 20]);
  const brightness = useTransform(stackProgress, [0, 1], [1, 0.9]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [5, 0, 0, -2]);
  
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full will-change-transform"
      style={{
        zIndex: totalCards - index,
        scale: smoothScale,
        y: smoothY,
        rotateX: smoothRotateX,
        transformPerspective: 1200,
        transformOrigin: "center top",
        filter: useTransform(brightness, (v) => `brightness(${v})`),
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.15,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

interface SmoothStackingContainerProps {
  children: ReactNode[];
  className?: string;
}

export const SmoothStackingContainer = ({ children, className = "" }: SmoothStackingContainerProps) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1200px" }}>
      {children.map((child, index) => (
        <SmoothStackingCard key={index} index={index} totalCards={children.length}>
          {child}
        </SmoothStackingCard>
      ))}
    </div>
  );
};

// Card with 3D flip reveal
interface FlipRevealCardProps {
  children: ReactNode;
  index: number;
}

export const FlipRevealCard = ({ children, index }: FlipRevealCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });
  
  const rotateY = useTransform(scrollYProgress, [0, 1], [-90, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  
  const smoothRotateY = useSpring(rotateY, { stiffness: 80, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 25 });

  return (
    <motion.div
      ref={cardRef}
      className="w-full will-change-transform"
      style={{
        rotateY: smoothRotateY,
        scale: smoothScale,
        opacity,
        transformPerspective: 1500,
        transformOrigin: "left center",
      }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
};
