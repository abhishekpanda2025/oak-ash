import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Play, Pause } from "lucide-react";

interface Product3DViewerProps {
  images: string[];
  productName: string;
}

export const Product3DViewer = ({ images, productName }: Product3DViewerProps) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const rotationSpeed = 360 / images.length;
  
  const rotateY = useMotionValue(0);
  const scale = useTransform(rotateY, [-180, 0, 180], [0.95, 1, 0.95]);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentAngle((prev) => (prev + 1) % images.length);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, images.length]);

  // Smooth rotation animation
  useEffect(() => {
    const targetRotation = (currentAngle / images.length) * 360;
    animate(rotateY, targetRotation - 180, { duration: 0.1 });
  }, [currentAngle, images.length, rotateY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastX.current;
    const sensitivity = 0.5;
    
    if (Math.abs(deltaX) > 5) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentAngle((prev) => {
        const newAngle = prev + direction;
        if (newAngle < 0) return images.length - 1;
        if (newAngle >= images.length) return 0;
        return newAngle;
      });
      lastX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - lastX.current;
    
    if (Math.abs(deltaX) > 8) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentAngle((prev) => {
        const newAngle = prev + direction;
        if (newAngle < 0) return images.length - 1;
        if (newAngle >= images.length) return 0;
        return newAngle;
      });
      lastX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const currentImage = images[currentAngle] || images[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  return (
    <>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div 
            className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-full object-contain"
              style={{ scale: zoomLevel }}
              drag={zoomLevel > 1}
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            />
            
            {/* Close button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* 3D Viewer Container */}
      <div className="relative">
        <motion.div
          ref={containerRef}
          className={`relative aspect-square bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: "1000px" }}
        >
          {/* Reflection/Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-black/20 to-transparent blur-xl rounded-full" />
          
          {/* Product Image with 3D Effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-8"
            style={{ 
              rotateY,
              scale,
              transformStyle: "preserve-3d"
            }}
          >
            <motion.img
              key={currentAngle}
              src={currentImage}
              alt={`${productName} - View ${currentAngle + 1}`}
              className="w-full h-full object-contain drop-shadow-2xl"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              style={{ scale: zoomLevel }}
              draggable={false}
            />
          </motion.div>

          {/* Rotation Indicator Ring */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="text-amber-500"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${(currentAngle / images.length) * 283} 283`}
                strokeLinecap="round"
                className="text-amber-500"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div 
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-lg"
              style={{
                transform: `translate(-50%, -50%) rotate(${(currentAngle / images.length) * 360}deg) translateY(-45px)`
              }}
            />
          </div>

          {/* 360° Badge */}
          <motion.div
            className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-500" />
            <span>360° View</span>
          </motion.div>

          {/* Drag Hint */}
          {!isDragging && !isAutoRotating && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Drag to rotate
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.button
            onClick={toggleAutoRotate}
            className={`p-2.5 rounded-full transition-colors ${
              isAutoRotating 
                ? "bg-amber-500 text-black" 
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isAutoRotating ? "Pause rotation" : "Auto rotate"}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-full disabled:opacity-40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          
          <div className="px-3 py-1 bg-secondary rounded-full text-xs font-medium min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </div>
          
          <motion.button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-full disabled:opacity-40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={toggleFullscreen}
            className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Angle Indicator */}
        <div className="flex justify-center mt-3">
          <div className="flex gap-1">
            {images.slice(0, Math.min(images.length, 12)).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentAngle(index);
                  setIsAutoRotating(false);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentAngle 
                    ? "w-4 bg-amber-500" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
