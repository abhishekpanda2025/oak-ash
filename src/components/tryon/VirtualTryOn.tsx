import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, Eye, ChevronLeft, ChevronRight, Move, ZoomIn, ZoomOut, Gem, Glasses } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";

// Import eyewear images for overlay
import eyewearProduct1 from "@/assets/eyewear-product-1.jpg";
import eyewearProduct2 from "@/assets/eyewear-product-2.jpg";
import eyewearProduct3 from "@/assets/eyewear-product-3.jpg";
import eyewearProduct4 from "@/assets/eyewear-product-4.jpg";

// Import jewelry images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";

const eyewearProducts = demoProducts.filter(p => p.category === "eyewear");
const jewelryProducts = demoProducts.filter(p => ["necklaces", "earrings", "rings"].includes(p.category));

const eyewearImages: Record<string, string> = {
  "17": eyewearProduct1,
  "18": eyewearProduct3,
  "19": eyewearProduct4,
  "20": eyewearProduct2,
  "21": eyewearProduct1,
};

const jewelryImages: Record<string, string> = {
  "1": productNecklace,
  "2": productEarrings,
  "5": productNecklace,
  "6": productEarrings,
  "8": productEarrings,
  "10": productNecklace,
  "13": productNecklace,
  "14": productEarrings,
};

type TryOnMode = "eyewear" | "jewelry";

// Face detection simulation with responsive positioning
const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [facePosition, setFacePosition] = useState({ x: 50, y: 35, width: 40 });
  const [isDetecting, setIsDetecting] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !videoRef.current) {
      setIsDetecting(false);
      return;
    }

    setIsDetecting(true);
    
    // Responsive face detection based on video dimensions
    const detectFace = () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) {
        animationRef.current = requestAnimationFrame(detectFace);
        return;
      }

      // Get device and viewport info for responsive positioning
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Adjust face center based on device
      const baseCenterX = 50;
      const baseCenterY = isMobile ? 38 : isTablet ? 36 : 35;
      const baseWidth = isMobile ? 50 : isTablet ? 45 : 40;

      // Simulate subtle natural head movement
      const time = Date.now() / 1000;
      const wobbleX = Math.sin(time * 0.5) * 1.5;
      const wobbleY = Math.cos(time * 0.3) * 0.8;

      setFacePosition({
        x: baseCenterX + wobbleX,
        y: baseCenterY + wobbleY,
        width: baseWidth,
      });

      animationRef.current = requestAnimationFrame(detectFace);
    };

    animationRef.current = requestAnimationFrame(detectFace);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, videoRef]);

  return { facePosition, isDetecting };
};

export const VirtualTryOn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mode, setMode] = useState<TryOnMode>("eyewear");
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(eyewearProducts[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [manualPosition, setManualPosition] = useState<{ x: number; y: number } | null>(null);
  const [glassesScale, setGlassesScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const products = mode === "eyewear" ? eyewearProducts : jewelryProducts;
  const images = mode === "eyewear" ? eyewearImages : jewelryImages;

  const { facePosition, isDetecting } = useFaceDetection(videoRef, isCameraActive && !capturedImage);

  // Use manual position if set, otherwise use face detection
  const currentPosition = manualPosition || { x: facePosition.x, y: facePosition.y };

  const getResponsiveCamera = useCallback(async () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Responsive video constraints
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: cameraFacing,
        width: { ideal: isMobile ? 720 : isTablet ? 1080 : 1280 },
        height: { ideal: isMobile ? 1280 : isTablet ? 1920 : 720 },
        aspectRatio: isMobile ? { ideal: 9/16 } : { ideal: 16/9 },
      }
    };

    return constraints;
  }, [cameraFacing]);

  const startCamera = useCallback(async () => {
    try {
      const constraints = await getResponsiveCamera();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        toast.success("Camera ready! Position your face in the frame.");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, [getResponsiveCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    stopCamera();
    setCameraFacing(prev => prev === "user" ? "environment" : "user");
    setTimeout(startCamera, 300);
  }, [stopCamera, startCamera]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror the image for selfie mode
        if (cameraFacing === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        toast.success("Photo captured!");
      }
    }
  }, [cameraFacing]);

  const downloadPhoto = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `oak-ash-tryon-${Date.now()}.jpg`;
      link.href = capturedImage;
      link.click();
      toast.success("Photo downloaded!");
    }
  }, [capturedImage]);

  const sharePhoto = useCallback(async () => {
    if (capturedImage && navigator.share) {
      try {
        const blob = await (await fetch(capturedImage)).blob();
        const file = new File([blob], "oak-ash-tryon.jpg", { type: "image/jpeg" });
        await navigator.share({
          title: "My OAK & ASH Try-On",
          text: "Check out how I look in OAK & ASH!",
          files: [file],
        });
      } catch (error) {
        toast.error("Sharing failed");
      }
    } else {
      toast.error("Sharing not supported on this device");
    }
  }, [capturedImage]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(startCamera, 500);
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setManualPosition(null);
    setIsOpen(false);
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    // Reset position and scale when switching products or modes
    setManualPosition(null);
    setGlassesScale(1);
  }, [selectedProduct, mode]);

  const nextProduct = () => {
    const currentIndex = products.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % products.length;
    setSelectedProduct(products[nextIndex]);
  };

  const prevProduct = () => {
    const currentIndex = products.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    setSelectedProduct(products[prevIndex]);
  };

  // Handle drag for overlay positioning
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  
  const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setManualPosition({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y))
    });
  }, [isDragging]);

  // Get overlay position based on product type
  const getOverlayStyle = () => {
    const isMobile = window.innerWidth < 768;
    const baseWidth = mode === "eyewear" 
      ? (isMobile ? "45vw" : "200px") 
      : (isMobile ? "35vw" : "150px");
    
    const yOffset = mode === "jewelry" 
      ? (selectedProduct.category === "earrings" ? 25 : selectedProduct.category === "necklaces" ? 45 : 35)
      : 0;

    return {
      left: `${currentPosition.x}%`,
      top: `${currentPosition.y + yOffset}%`,
      transform: `translate(-50%, -50%) scale(${glassesScale})`,
      width: baseWidth,
    };
  };

  return (
    <>
      {/* Trigger Button - Fully Responsive */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 md:gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-3 md:px-6 md:py-4 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-shadow rounded-full md:rounded-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Camera className="w-5 h-5" />
        <span className="font-medium text-xs md:text-sm uppercase tracking-wide hidden sm:inline">Virtual Try-On</span>
        <Sparkles className="w-4 h-4 hidden md:block" />
      </motion.button>

      {/* AR Modal - Fully Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header - Responsive */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent safe-area-inset-top">
              <div className="flex items-center gap-2 md:gap-3">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                <span className="text-white font-serif text-sm md:text-lg">Virtual Try-On</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Camera Switch Button (Mobile) */}
                <button
                  onClick={switchCamera}
                  className="w-9 h-9 md:w-10 md:h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 md:w-10 md:h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Mode Switcher - Responsive */}
            <div className="absolute top-14 md:top-16 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/50 backdrop-blur-sm p-1 rounded-full">
              <button
                onClick={() => {
                  setMode("eyewear");
                  setSelectedProduct(eyewearProducts[0]);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all ${
                  mode === "eyewear" 
                    ? "bg-amber-500 text-black" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Glasses className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Eyewear</span>
              </button>
              <button
                onClick={() => {
                  setMode("jewelry");
                  setSelectedProduct(jewelryProducts[0]);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all ${
                  mode === "jewelry" 
                    ? "bg-amber-500 text-black" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Gem className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Jewelry</span>
              </button>
            </div>

            {/* Camera View - Responsive */}
            <div 
              ref={overlayRef}
              className="relative w-full h-full"
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
            >
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: cameraFacing === "user" ? "scaleX(-1)" : "none" }}
                  />
                  
                  {/* Face Guide Overlay */}
                  {isCameraActive && isDetecting && (
                    <motion.div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${facePosition.x}%`,
                        top: `${facePosition.y - 5}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div 
                        className="border-2 border-dashed border-amber-500/40 rounded-full"
                        style={{ 
                          width: `${facePosition.width}vw`, 
                          height: `${facePosition.width * 1.3}vw`,
                          maxWidth: "300px",
                          maxHeight: "390px",
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* Product Overlay with drag support */}
                  {isCameraActive && (
                    <motion.div
                      className="absolute cursor-move z-10"
                      style={getOverlayStyle()}
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                      animate={{
                        y: isDragging ? 0 : [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: isDragging ? 0 : Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src={images[selectedProduct.id] || (mode === "eyewear" ? eyewearProduct1 : productNecklace)}
                        alt="Product overlay"
                        className="w-full h-auto opacity-90 drop-shadow-lg pointer-events-none"
                        style={{ 
                          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                          mixBlendMode: mode === "jewelry" ? "multiply" : "normal",
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Position Controls - Responsive */}
                  <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
                    <div className="flex items-center gap-1.5 md:gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 text-white text-xs md:text-sm rounded-full">
                      <Move className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Drag to position</span>
                      <span className="sm:hidden">Drag</span>
                    </div>
                  </div>
                  
                  {/* Scale Controls - Responsive */}
                  <div className="absolute bottom-44 md:bottom-52 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
                    <button
                      onClick={() => setGlassesScale(s => Math.max(0.5, s - 0.1))}
                      className="w-9 h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center rounded-full active:scale-95 transition-transform"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGlassesScale(s => Math.min(2, s + 0.1))}
                      className="w-9 h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center rounded-full active:scale-95 transition-transform"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Action buttons for captured photo - Responsive */}
                  <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 flex-wrap justify-center px-4">
                    <motion.button
                      onClick={() => setCapturedImage(null)}
                      className="flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 md:px-6 md:py-3 text-sm rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake
                    </motion.button>
                    <motion.button
                      onClick={downloadPhoto}
                      className="flex items-center gap-1.5 md:gap-2 bg-amber-500 text-black px-4 py-2.5 md:px-6 md:py-3 text-sm rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      onClick={sharePhoto}
                      className="flex items-center gap-1.5 md:gap-2 bg-white text-black px-4 py-2.5 md:px-6 md:py-3 text-sm rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </motion.button>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Product Selector - Responsive */}
            {!capturedImage && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 md:p-6 safe-area-inset-bottom">
                <div className="flex items-center justify-center gap-3 md:gap-4">
                  <motion.button
                    onClick={prevProduct}
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/10 text-white flex items-center justify-center rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center min-w-[160px] md:min-w-[200px]">
                    <p className="text-amber-400 text-[10px] md:text-xs uppercase tracking-widest mb-0.5 md:mb-1">
                      {selectedProduct.category}
                    </p>
                    <h3 className="text-white font-serif text-sm md:text-lg line-clamp-1">{selectedProduct.title}</h3>
                    <p className="text-amber-500 font-serif text-sm md:text-base">${selectedProduct.price}</p>
                  </div>

                  <motion.button
                    onClick={nextProduct}
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/10 text-white flex items-center justify-center rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Capture Button - Responsive */}
                <motion.button
                  onClick={capturePhoto}
                  className="mt-4 md:mt-6 mx-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-amber-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full" />
                </motion.button>
              </div>
            )}

            {/* Instructions - Responsive */}
            {isCameraActive && !capturedImage && (
              <motion.div
                className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 text-white text-xs md:text-sm text-center rounded-full max-w-[90%]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {isDetecting ? "Face detected • Drag to adjust" : "Positioning your face..."}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
