import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { X, RotateCcw, ZoomIn, ZoomOut, Move3d, Hand } from "lucide-react";
import { DemoProduct } from "@/data/demoProducts";

import productNecklace from "@/assets/product-necklace.jpg";
import productRing from "@/assets/product-ring.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBangle from "@/assets/product-bangle.jpg";

interface ProductViewer360Props {
  product: DemoProduct;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductViewer360 = ({ product, isOpen, onClose }: ProductViewer360Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth 3D rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Smooth spring animations
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 30 });
  
  // Light reflection based on rotation
  const lightX = useTransform(smoothRotateY, [-180, 180], [-50, 50]);
  const lightY = useTransform(smoothRotateX, [-90, 90], [-30, 30]);
  
  // Shadow based on rotation
  const shadowX = useTransform(smoothRotateY, [-180, 180], [20, -20]);
  const shadowY = useTransform(smoothRotateX, [-90, 90], [10, 30]);
  const shadowBlur = useTransform(smoothScale, [0.5, 1.5], [20, 40]);

  // Get product image
  const getProductImage = () => {
    const images: Record<string, string> = {
      "1": productNecklace,
      "2": productRing,
      "3": productEarrings,
      "4": productBangle,
    };
    return images[product.id] || productNecklace;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position from center
    const newRotateY = ((e.clientX - centerX) / (rect.width / 2)) * 45;
    const newRotateX = -((e.clientY - centerY) / (rect.height / 2)) * 30;
    
    rotateY.set(rotateY.get() + (newRotateY - rotateY.get()) * 0.1);
    rotateX.set(rotateX.get() + (newRotateX - rotateX.get()) * 0.1);
  }, [isDragging, rotateX, rotateY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const newRotateY = ((touch.clientX - centerX) / (rect.width / 2)) * 60;
    const newRotateX = -((touch.clientY - centerY) / (rect.height / 2)) * 40;
    
    rotateY.set(newRotateY);
    rotateX.set(newRotateX);
  }, [rotateX, rotateY]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale.get() + (e.deltaY > 0 ? -0.1 : 0.1);
    scale.set(Math.max(0.5, Math.min(2, newScale)));
  }, [scale]);

  const resetView = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  const zoomIn = useCallback(() => {
    scale.set(Math.min(2, scale.get() + 0.2));
  }, [scale]);

  const zoomOut = useCallback(() => {
    scale.set(Math.max(0.5, scale.get() - 0.2));
  }, [scale]);

  // Auto-rotate when not interacting
  useEffect(() => {
    if (!isOpen || isDragging) return;
    
    let frame: number;
    let angle = rotateY.get();
    
    const autoRotate = () => {
      angle += 0.3;
      rotateY.set(angle);
      frame = requestAnimationFrame(autoRotate);
    };
    
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(autoRotate);
    }, 2000);
    
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [isOpen, isDragging, rotateY]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Move3d className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-serif text-white">{product.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 360 Viewer */}
            <div
              ref={containerRef}
              className="relative aspect-square max-h-[70vh] mx-auto cursor-grab active:cursor-grabbing bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden"
              style={{ perspective: "1500px" }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onWheel={handleWheel}
            >
              {/* Ambient light effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${50}% ${50}%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`,
                }}
              />
              
              {/* Light reflection */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: useTransform(
                    [lightX, lightY],
                    ([x, y]) => `radial-gradient(circle at ${50 + Number(x)}% ${50 + Number(y)}%, rgba(255, 255, 255, 0.2) 0%, transparent 40%)`
                  ),
                }}
              />
              
              {/* Product container with 3D transform */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  scale: smoothScale,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Shadow */}
                <motion.div
                  className="absolute bottom-10 left-1/2 w-3/4 h-8 bg-black/50 blur-xl rounded-full"
                  style={{
                    x: shadowX,
                    y: shadowY,
                    filter: useTransform(shadowBlur, (v) => `blur(${v}px)`),
                    translateX: "-50%",
                  }}
                />
                
                {/* Product image with depth layers */}
                <div className="relative w-4/5 h-4/5">
                  {/* Back shadow layer */}
                  <motion.img
                    src={getProductImage()}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-contain blur-sm opacity-30"
                    style={{
                      transform: "translateZ(-20px) scale(1.05)",
                    }}
                  />
                  
                  {/* Main product */}
                  <img
                    src={getProductImage()}
                    alt={product.title}
                    className="relative w-full h-full object-contain drop-shadow-2xl"
                    draggable={false}
                    style={{ 
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))"
                    }}
                  />
                  
                  {/* Highlight reflection */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      background: useTransform(
                        [lightX, lightY],
                        ([x, y]) => `linear-gradient(${135 + Number(x)}deg, rgba(255,255,255,0.4) 0%, transparent 50%)`
                      ),
                      maskImage: `url(${getProductImage()})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${getProductImage()})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  />
                </div>
              </motion.div>

              {/* Grid lines for depth perception */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
              </div>

              {/* Drag indicator */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 text-white/70 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Hand className="w-4 h-4" />
                <span>Drag to rotate • Scroll to zoom</span>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                onClick={zoomOut}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomOut className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={resetView}
                className="w-12 h-12 bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={zoomIn}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Product Info */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-amber-400 text-xs uppercase tracking-widest mb-2">{product.category}</p>
              <p className="text-white/60 text-sm mb-2">{product.material}</p>
              <p className="text-amber-500 font-serif text-2xl">${product.price}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
