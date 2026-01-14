import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
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

// Premium Smooth stacking with intensive 3D effects
interface SmoothStackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

export const SmoothStackingCard = ({ children, index, totalCards }: SmoothStackingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  
  // Premium transforms with smoother curves
  const stackProgress = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0, 0.3, 0.7, 1]);
  const scale = useTransform(stackProgress, [0, 1], [1, 0.94 - index * 0.008]);
  const y = useTransform(stackProgress, [0, 1], [0, index * 15]);
  const brightness = useTransform(stackProgress, [0, 1], [1, 0.88 - index * 0.015]);
  
  // 3D rotation effects
  const rotateX = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.6, 0.85, 1], [6, 2, 0, 0, -1, -3]);
  const rotateY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.5, 0, 0, -1.5]);
  const translateZ = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-80, 0, 0, -40]);
  
  // Enhanced shadow based on scroll
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.05, 0.35, 0.35, 0.15]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [8, 50, 50, 25]);
  const shadowY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [4, 35, 35, 18]);
  
  // Glow effects
  const glowOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 0.25, 0.25, 0]);
  const edgeGlowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.6, 0]);
  
  // Ultra smooth spring physics
  const springConfig = { stiffness: 60, damping: 25, mass: 0.8 };
  const smoothScale = useSpring(scale, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothRotateX = useSpring(rotateX, { stiffness: 50, damping: 22 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 50, damping: 22 });
  const smoothTranslateZ = useSpring(translateZ, { stiffness: 50, damping: 22 });

  // Parallax for inner content
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const ctx = gsap.context(() => {
      // Premium entrance animation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 120,
          rotateX: 12,
          scale: 0.92,
        },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "top 55%",
            scrub: 0.8,
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "power3.out",
        }
      );

      // Premium stacking shadow effect
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          scrub: true,
        },
        boxShadow: `0 ${25 + index * 8}px ${50 + index * 15}px -12px rgba(212, 184, 106, ${0.12 + index * 0.04})`,
        ease: "power2.inOut",
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
        transformPerspective: 1800,
        transformOrigin: "center top",
        filter: useTransform(brightness, (v) => `brightness(${v})`),
      }}
    >
      {/* Premium ambient glow */}
      <motion.div
        ref={glowRef}
        className="absolute -inset-6 bg-gradient-to-b from-amber-500/15 via-amber-400/5 to-amber-500/10 rounded-3xl blur-2xl pointer-events-none"
        style={{ opacity: glowOpacity }}
      />
      
      {/* Dynamic shadow layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25 rounded-2xl pointer-events-none"
        style={{
          opacity: shadowOpacity,
          filter: useTransform(shadowBlur, (b) => `blur(${b}px)`),
          transform: useTransform(shadowY, (y) => `translateY(${y}px) scaleX(0.95)`),
        }}
      />
      
      {/* Main card content with premium feel */}
      <motion.div
        className="relative overflow-hidden rounded-lg"
        style={{ y: smoothContentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ 
            duration: 1, 
            delay: index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Top edge highlight */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent z-10"
            style={{ opacity: edgeGlowOpacity }}
          />
          
          {/* Left edge glow */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent z-10"
            style={{ opacity: useTransform(edgeGlowOpacity, v => v * 0.5) }}
          />
          
          {/* Right edge glow */}
          <motion.div
            className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent z-10"
            style={{ opacity: useTransform(edgeGlowOpacity, v => v * 0.5) }}
          />
          
          {children}
          
          {/* Bottom edge highlight */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent z-10"
            style={{ opacity: useTransform(edgeGlowOpacity, v => v * 0.6) }}
          />
        </motion.div>
      </motion.div>
      
      {/* Premium stacking indicator */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1"
        style={{
          opacity: useTransform(stackProgress, [0, 0.4, 0.7, 1], [0, 0.7, 0.7, 0.3]),
        }}
      >
        <motion.div 
          className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full"
          style={{ scaleX: useTransform(stackProgress, [0, 0.5, 1], [0.3, 1, 0.7]) }}
        />
        <motion.div 
          className="w-1.5 h-1.5 bg-amber-500/40 rounded-full"
          style={{ scale: useTransform(stackProgress, [0, 0.5, 1], [0.5, 1.2, 0.8]) }}
        />
        <motion.div 
          className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full"
          style={{ scaleX: useTransform(stackProgress, [0, 0.5, 1], [0.3, 1, 0.7]) }}
        />
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
    <div className={`relative ${className}`} style={{ perspective: "2000px", perspectiveOrigin: "50% 20%" }}>
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
