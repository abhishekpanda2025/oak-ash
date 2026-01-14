import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Premium Sliding Section with Parallax Effects
interface SlidingSectionProps {
  children: ReactNode;
  index: number;
  totalSections: number;
  direction?: "left" | "right" | "up" | "down";
}

export const SlidingSection = ({ 
  children, 
  index, 
  totalSections, 
  direction = index % 2 === 0 ? "left" : "right" 
}: SlidingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const parallaxX = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    direction === "left" ? [-50, 0, 50] : direction === "right" ? [50, 0, -50] : [0, 0, 0]
  );
  
  // Opacity based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Scale effect
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
  
  // Rotation for premium feel
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [5, 0, 0, -5]);
  
  // Smooth springs
  const springY = useSpring(parallaxY, { stiffness: 50, damping: 20 });
  const springX = useSpring(parallaxX, { stiffness: 50, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 80, damping: 25 });
  const springRotate = useSpring(rotateX, { stiffness: 60, damping: 20 });

  // Inner content parallax (Misala style)
  const innerParallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const smoothInnerY = useSpring(innerParallaxY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Premium entrance animation
      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: direction === "up" ? 150 : direction === "down" ? -150 : 80,
          x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
          scale: 0.85,
        },
        {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.6,
          },
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          ease: "power3.out",
        }
      );

      // Sticky effect
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 0.5}`,
        pin: false,
        anticipatePin: 1,
      });
    }, section);

    return () => ctx.revert();
  }, [direction]);

  return (
    <motion.div
      ref={sectionRef}
      className="relative w-full will-change-transform overflow-hidden"
      style={{
        opacity,
        scale: springScale,
        rotateX: springRotate,
        transformPerspective: 1500,
        transformOrigin: "center center",
      }}
    >
      {/* Parallax background glow */}
      <motion.div
        className="absolute -inset-20 bg-gradient-radial from-amber-500/5 via-transparent to-transparent pointer-events-none"
        style={{ y: springY, opacity: useTransform(opacity, v => v * 0.5) }}
      />
      
      {/* Sliding content wrapper */}
      <motion.div
        ref={contentRef}
        className="relative"
        style={{ 
          x: springX,
        }}
      >
        {/* Inner parallax container */}
        <motion.div style={{ y: smoothInnerY }}>
          {/* Edge glow effects */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
            style={{ opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]) }}
          />
          
          {children}
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
            style={{ opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 0.5, 0.5, 0]) }}
          />
        </motion.div>
      </motion.div>
      
      {/* Section indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]) }}
      >
        {Array.from({ length: totalSections }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? 'bg-amber-500' : 'bg-amber-500/20'
            }`}
            animate={{ scale: i === index ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Container for sliding sections
interface SlidingSectionsContainerProps {
  children: ReactNode[];
  className?: string;
}

export const SlidingSectionsContainer = ({ children, className = "" }: SlidingSectionsContainerProps) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: "2000px" }}>
      {children.map((child, index) => (
        <SlidingSection 
          key={index} 
          index={index} 
          totalSections={children.length}
        >
          {child}
        </SlidingSection>
      ))}
    </div>
  );
};

// Misala-style Sticky Parallax Section
interface StickyParallaxSectionProps {
  children: ReactNode;
  index: number;
  totalSections: number;
}

export const StickyParallaxSection = ({ children, index, totalSections }: StickyParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Sticky transform
  const stickyProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [150, 0, 0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.92, 1, 1, 0.96]);
  
  // Parallax for inner elements
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  
  // 3D transforms
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [8, 0, 0, -4]);
  const translateZ = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-100, 0, 0, -50]);
  
  // Smooth springs for premium feel
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 25 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 60, damping: 22 });
  const smoothTranslateZ = useSpring(translateZ, { stiffness: 60, damping: 22 });
  
  // Glow effects
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 0.4, 0.4, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const ctx = gsap.context(() => {
      // Create sticky scroll effect
      gsap.to(inner, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 0.8}`,
          scrub: true,
          pin: index < totalSections - 1,
          pinSpacing: index === 0,
          anticipatePin: 1,
        },
        ease: "none",
      });

      // Parallax layers within section
      const layers = inner.querySelectorAll('[data-parallax]');
      layers.forEach((layer, i) => {
        const depth = parseFloat(layer.getAttribute('data-parallax') || '1');
        gsap.to(layer, {
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: depth * -100,
          ease: "none",
        });
      });
    }, section);

    return () => ctx.revert();
  }, [index, totalSections]);

  return (
    <motion.div
      ref={sectionRef}
      className="relative w-full will-change-transform min-h-screen"
      style={{
        zIndex: totalSections - index,
      }}
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute -inset-10 bg-gradient-to-b from-amber-500/10 via-transparent to-amber-500/5 blur-3xl pointer-events-none"
        style={{ opacity: glowOpacity }}
      />

      <motion.div
        ref={innerRef}
        className="relative w-full"
        style={{
          y: smoothY,
          scale: smoothScale,
          rotateX: smoothRotateX,
          z: smoothTranslateZ,
          opacity,
          transformPerspective: 2000,
          transformOrigin: "center top",
        }}
      >
        {/* Top edge highlight */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
          style={{ opacity: glowOpacity }}
        />
        
        {/* Side glows */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent"
          style={{ opacity: useTransform(glowOpacity, v => v * 0.6) }}
        />
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent"
          style={{ opacity: useTransform(glowOpacity, v => v * 0.6) }}
        />

        {/* Main content with parallax layers */}
        <div className="relative">
          {/* Background parallax layer */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ y: parallaxY1 }}
            data-parallax="0.3"
          />
          
          {/* Mid parallax layer */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ y: parallaxY2 }}
            data-parallax="0.5"
          />
          
          {/* Foreground parallax layer */}
          <motion.div 
            className="relative"
            style={{ y: parallaxY3 }}
            data-parallax="0.8"
          >
            {children}
          </motion.div>
        </div>

        {/* Bottom edge highlight */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
          style={{ opacity: useTransform(glowOpacity, v => v * 0.7) }}
        />
      </motion.div>

      {/* Premium depth shadow */}
      <motion.div
        className="absolute inset-x-4 -bottom-4 h-8 bg-gradient-to-b from-black/20 to-transparent blur-xl pointer-events-none"
        style={{ 
          opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 0]),
          scaleX: 0.9,
        }}
      />
    </motion.div>
  );
};

// Container for sticky parallax sections
interface StickyParallaxContainerProps {
  children: ReactNode[];
  className?: string;
}

export const StickyParallaxContainer = ({ children, className = "" }: StickyParallaxContainerProps) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: "2500px", perspectiveOrigin: "50% 30%" }}>
      {children.map((child, index) => (
        <StickyParallaxSection key={index} index={index} totalSections={children.length}>
          {child}
        </StickyParallaxSection>
      ))}
    </div>
  );
};

// Export for backward compatibility (aliased to new sliding version)
interface SmoothStackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

export const SmoothStackingCard = ({ children, index, totalCards }: SmoothStackingCardProps) => {
  return (
    <SlidingSection index={index} totalSections={totalCards}>
      {children}
    </SlidingSection>
  );
};

export const SmoothStackingContainer = ({ children, className = "" }: { children: ReactNode[]; className?: string }) => {
  return (
    <SlidingSectionsContainer className={className}>
      {children}
    </SlidingSectionsContainer>
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

// Legacy exports
interface StackingCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
}

const StackingCard = ({ children, index, totalCards }: StackingCardProps) => {
  return (
    <SlidingSection index={index} totalSections={totalCards}>
      {children}
    </SlidingSection>
  );
};

interface StackingCardsContainerProps {
  children: ReactNode[];
  className?: string;
}

export const StackingCardsContainer = ({ children, className = "" }: StackingCardsContainerProps) => {
  return (
    <SlidingSectionsContainer className={className}>
      {children}
    </SlidingSectionsContainer>
  );
};
