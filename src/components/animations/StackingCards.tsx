import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
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
    
    // Create the stacking animation with enhanced effects
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

// Enhanced Smooth stacking with intensive 3D effects
interface SmoothStackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

export const SmoothStackingCard = ({ children, index, totalCards }: SmoothStackingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  
  // More intensive transforms
  const stackProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 0.5, 1]);
  const scale = useTransform(stackProgress, [0, 1], [1, 0.92 - index * 0.01]);
  const y = useTransform(stackProgress, [0, 1], [0, index * 25]);
  const brightness = useTransform(stackProgress, [0, 1], [1, 0.85 - index * 0.02]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [8, 3, 0, -2, -5]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]);
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, -50]);
  
  // Shadow intensity based on scroll
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0.2]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.5, 1], [10, 60, 30]);
  const shadowY = useTransform(scrollYProgress, [0, 0.5, 1], [5, 40, 20]);
  
  // Glow effect
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.3, 0]);
  
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 25 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 60, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 60, damping: 20 });
  const smoothTranslateZ = useSpring(translateZ, { stiffness: 60, damping: 20 });

  // Parallax for inner content
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    // GSAP enhanced effects
    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 150,
          rotateX: 15,
          scale: 0.9,
        },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 60%",
            scrub: 0.5,
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "power3.out",
        }
      );

      // Stacking shadow effect
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
        boxShadow: `0 ${20 + index * 5}px ${40 + index * 10}px -10px rgba(212, 184, 106, ${0.15 + index * 0.05})`,
        ease: "none",
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full will-change-transform"
      style={{
        zIndex: totalCards - index,
        scale: smoothScale,
        y: smoothY,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        z: smoothTranslateZ,
        transformPerspective: 1500,
        transformOrigin: "center top",
        filter: useTransform(brightness, (v) => `brightness(${v})`),
      }}
    >
      {/* Ambient glow effect */}
      <motion.div
        ref={glowRef}
        className="absolute -inset-4 bg-gradient-to-b from-amber-500/20 via-transparent to-amber-500/10 rounded-3xl blur-xl pointer-events-none"
        style={{ opacity: glowOpacity }}
      />
      
      {/* Card shadow layer */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none"
        style={{
          opacity: shadowOpacity,
          filter: useTransform(shadowBlur, (b) => `blur(${b}px)`),
          transform: useTransform(shadowY, (y) => `translateY(${y}px)`),
        }}
      />
      
      {/* Main card content */}
      <motion.div
        className="relative overflow-hidden"
        style={{ y: smoothContentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.9, 
            delay: index * 0.12,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Edge highlight */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
            style={{
              opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0])
            }}
          />
          
          {children}
          
          {/* Bottom edge glow */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
            style={{
              opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.5, 0])
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Stacking indicator line */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-full"
        style={{
          opacity: useTransform(stackProgress, [0, 0.5, 1], [0, 0.8, 0.3]),
          scaleX: useTransform(stackProgress, [0, 0.5, 1], [0.5, 1, 0.8]),
        }}
      />
    </motion.div>
  );
};

interface SmoothStackingContainerProps {
  children: ReactNode[];
  className?: string;
}

export const SmoothStackingContainer = ({ children, className = "" }: SmoothStackingContainerProps) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1500px", perspectiveOrigin: "50% 25%" }}>
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

// Magnetic hover effect for cards
interface MagneticCardProps {
  children: ReactNode;
  className?: string;
}

export const MagneticCard = ({ children, className = "" }: MagneticCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    x.set(mouseX * 0.1);
    y.set(mouseY * 0.1);
    rotateY.set(mouseX * 0.02);
    rotateX.set(-mouseY * 0.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`will-change-transform ${className}`}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};
