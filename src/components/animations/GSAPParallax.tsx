import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export const ParallaxSection = ({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
};

// Trailing cursor effect
export const TrailingCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Cursor follows mouse directly
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      // Follower trails behind
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={cursorRef}
        className="absolute w-3 h-3 bg-amber-500 rounded-full mix-blend-difference"
      />
      <div
        ref={followerRef}
        className="absolute w-10 h-10 border border-amber-500/50 rounded-full mix-blend-difference"
      />
    </div>
  );
};

// Smooth scroll sections with GSAP
interface GSAPSectionProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export const GSAPSection = ({ children, className = "", index = 0 }: GSAPSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Parallax effect on scroll
    gsap.to(section, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [index]);

  return (
    <div ref={sectionRef} className={`${className} will-change-transform`}>
      {children}
    </div>
  );
};

// Image parallax with trailing effect
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export const ParallaxImage = ({ src, alt, className = "", speed = 0.3 }: ParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    gsap.to(image, {
      yPercent: -20 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover will-change-transform"
        style={{ marginTop: "-10%" }}
      />
    </div>
  );
};

// Floating elements with parallax
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  amplitude?: number;
}

export const FloatingElement = ({ 
  children, 
  className = "", 
  delay = 0,
  amplitude = 20 
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: amplitude,
      duration: 2 + Math.random(),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay,
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [delay, amplitude]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Horizontal scroll section
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export const HorizontalScroll = ({ children, className = "" }: HorizontalScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const scrollWidth = wrapper.scrollWidth - container.offsetWidth;

    gsap.to(wrapper, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={wrapperRef} className="flex">
        {children}
      </div>
    </div>
  );
};
