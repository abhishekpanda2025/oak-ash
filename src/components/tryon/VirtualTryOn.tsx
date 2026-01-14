import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, Eye, ChevronLeft, ChevronRight, Move, ZoomIn, ZoomOut, Gem, Glasses, Heart, Star, Wand2, Sun, Moon, Palette } from "lucide-react";
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

// AR Filters and Beauty Effects
const beautyFilters = [
  { id: "none", name: "None", icon: "✨", filter: "" },
  { id: "glamour", name: "Glamour", icon: "💫", filter: "saturate(1.2) contrast(1.1) brightness(1.05)" },
  { id: "soft", name: "Soft Glow", icon: "🌸", filter: "brightness(1.1) contrast(0.95) saturate(0.9)" },
  { id: "bronze", name: "Bronze", icon: "🌅", filter: "sepia(0.2) saturate(1.3) brightness(1.05)" },
  { id: "noir", name: "Noir", icon: "🖤", filter: "grayscale(0.3) contrast(1.2) brightness(0.95)" },
  { id: "vivid", name: "Vivid", icon: "🌈", filter: "saturate(1.5) contrast(1.15)" },
];

const lightingModes = [
  { id: "natural", name: "Natural", icon: Sun },
  { id: "warm", name: "Warm", icon: Sun, overlay: "rgba(255, 200, 150, 0.1)" },
  { id: "cool", name: "Cool", icon: Moon, overlay: "rgba(150, 200, 255, 0.1)" },
  { id: "studio", name: "Studio", icon: Star, overlay: "rgba(255, 255, 255, 0.05)" },
];

// Face detection simulation with responsive positioning
const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [facePosition, setFacePosition] = useState({ x: 50, y: 35, width: 40, rotation: 0 });
  const [isDetecting, setIsDetecting] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !videoRef.current) {
      setIsDetecting(false);
      return;
    }

    setIsDetecting(true);
    
    const detectFace = () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) {
        animationRef.current = requestAnimationFrame(detectFace);
        return;
      }

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      const baseCenterX = 50;
      const baseCenterY = isMobile ? 38 : isTablet ? 36 : 35;
      const baseWidth = isMobile ? 50 : isTablet ? 45 : 40;

      const time = Date.now() / 1000;
      const wobbleX = Math.sin(time * 0.5) * 1.5;
      const wobbleY = Math.cos(time * 0.3) * 0.8;
      const wobbleRotation = Math.sin(time * 0.4) * 2;

      setFacePosition({
        x: baseCenterX + wobbleX,
        y: baseCenterY + wobbleY,
        width: baseWidth,
        rotation: wobbleRotation,
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

// Face Frame Overlay Component
const FaceFrameOverlay = ({ isDetecting, position }: { isDetecting: boolean; position: { x: number; y: number; width: number } }) => {
  if (!isDetecting) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y - 5}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated face guide */}
      <motion.div 
        className="relative"
        style={{ 
          width: `${position.width}vw`, 
          height: `${position.width * 1.3}vw`,
          maxWidth: "280px",
          maxHeight: "360px",
        }}
      >
        {/* Corner markers */}
        {[
          { top: 0, left: 0, rotate: 0 },
          { top: 0, right: 0, rotate: 90 },
          { bottom: 0, left: 0, rotate: -90 },
          { bottom: 0, right: 0, rotate: 180 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8"
            style={pos}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            <div 
              className="w-full h-full border-l-2 border-t-2 border-amber-500 rounded-tl-md"
              style={{ transform: `rotate(${pos.rotate}deg)` }}
            />
          </motion.div>
        ))}

        {/* Center cross */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-px bg-amber-500/50" />
          <div className="h-6 w-px bg-amber-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {/* Status text */}
      <motion.p
        className="text-center text-amber-500 text-xs mt-2 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Face Detected ✓
      </motion.p>
    </motion.div>
  );
};

// Sparkle Effect Component
const SparkleEffect = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        </motion.div>
      ))}
    </div>
  );
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
  const [activeFilter, setActiveFilter] = useState(beautyFilters[0]);
  const [activeLighting, setActiveLighting] = useState(lightingModes[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const products = mode === "eyewear" ? eyewearProducts : jewelryProducts;
  const images = mode === "eyewear" ? eyewearImages : jewelryImages;

  const { facePosition, isDetecting } = useFaceDetection(videoRef, isCameraActive && !capturedImage);

  const currentPosition = manualPosition || { x: facePosition.x, y: facePosition.y };

  const getResponsiveCamera = useCallback(async () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
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
        if (cameraFacing === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.filter = activeFilter.filter || "none";
        ctx.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
        toast.success("Photo captured! ✨");
      }
    }
  }, [cameraFacing, activeFilter]);

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
    setShowFilters(false);
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
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
      transform: `translate(-50%, -50%) scale(${glassesScale}) rotate(${facePosition.rotation}deg)`,
      width: baseWidth,
    };
  };

  return (
    <>
      {/* Trigger Button */}
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

      {/* AR Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent safe-area-inset-top">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                </motion.div>
                <span className="text-white font-serif text-sm md:text-lg">AR Virtual Try-On</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-9 h-9 md:w-10 md:h-10 backdrop-blur-sm flex items-center justify-center transition-colors rounded-full ${showFilters ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {/* Camera Switch */}
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

            {/* Mode Switcher */}
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

            {/* Beauty Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute top-28 left-4 right-4 md:left-auto md:right-4 md:w-72 z-30 bg-black/80 backdrop-blur-md rounded-2xl p-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-500" />
                    Beauty Filters
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {beautyFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          activeFilter.id === filter.id 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <span className="text-lg">{filter.icon}</span>
                        <p className="text-[10px] mt-1">{filter.name}</p>
                      </button>
                    ))}
                  </div>
                  
                  <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Lighting
                  </h4>
                  <div className="flex gap-2">
                    {lightingModes.map((light) => (
                      <button
                        key={light.id}
                        onClick={() => setActiveLighting(light)}
                        className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          activeLighting.id === light.id 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <light.icon className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{light.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera View */}
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
                    style={{ 
                      transform: cameraFacing === "user" ? "scaleX(-1)" : "none",
                      filter: activeFilter.filter || "none",
                    }}
                  />
                  
                  {/* Lighting overlay */}
                  {activeLighting.overlay && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: activeLighting.overlay }}
                    />
                  )}
                  
                  {/* Face Frame Overlay */}
                  <FaceFrameOverlay isDetecting={isDetecting} position={facePosition} />
                  
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

                  {/* Position Controls */}
                  <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
                    <div className="flex items-center gap-1.5 md:gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 text-white text-xs md:text-sm rounded-full">
                      <Move className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Drag to position</span>
                      <span className="sm:hidden">Drag</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full">
                      <button
                        onClick={() => setGlassesScale(s => Math.max(0.5, s - 0.1))}
                        className="p-1.5 md:p-2 text-white hover:text-amber-500 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGlassesScale(s => Math.min(2, s + 0.1))}
                        className="p-1.5 md:p-2 text-white hover:text-amber-500 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                  <SparkleEffect isActive={showSparkles} />
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Product Selector */}
            <div className="absolute bottom-24 md:bottom-28 left-0 right-0 z-20">
              <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
                <button
                  onClick={prevProduct}
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <motion.div 
                  className="flex-1 max-w-xs bg-black/50 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-xl"
                  key={selectedProduct.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-amber-500 text-xs uppercase tracking-wide text-center">
                    {mode === "eyewear" ? "Eyewear" : selectedProduct.category}
                  </p>
                  <p className="text-white text-sm md:text-base font-medium text-center truncate">
                    {selectedProduct.title}
                  </p>
                  <p className="text-amber-500 text-center text-sm">${selectedProduct.price}</p>
                </motion.div>
                
                <button
                  onClick={nextProduct}
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center gap-4 md:gap-6 px-4">
              {!capturedImage ? (
                <motion.button
                  onClick={capturePhoto}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-7 h-7 md:w-8 md:h-8 text-black" />
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                  >
                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={downloadPhoto}
                    className="w-12 h-12 md:w-14 md:h-14 bg-amber-500 flex items-center justify-center text-black rounded-full"
                  >
                    <Download className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={sharePhoto}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                  >
                    <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={() => toast.success("Added to wishlist!")}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-colors rounded-full"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
