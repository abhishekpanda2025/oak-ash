import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";

// Import eyewear images for overlay
import eyewearProduct1 from "@/assets/eyewear-product-1.jpg";
import eyewearProduct2 from "@/assets/eyewear-product-2.jpg";
import eyewearProduct3 from "@/assets/eyewear-product-3.jpg";
import eyewearProduct4 from "@/assets/eyewear-product-4.jpg";

const eyewearProducts = demoProducts.filter(p => p.category === "eyewear");

const eyewearImages: Record<string, string> = {
  "17": eyewearProduct1,
  "18": eyewearProduct3,
  "19": eyewearProduct4,
  "20": eyewearProduct2,
  "21": eyewearProduct1,
};

export const VirtualTryOn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(eyewearProducts[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [glassesPosition, setGlassesPosition] = useState({ x: 50, y: 35 });
  const [glassesScale, setGlassesScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror the image for selfie mode
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        toast.success("Photo captured!");
      }
    }
  }, []);

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
          text: "Check out how I look in OAK & ASH eyewear!",
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
    setIsOpen(false);
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const nextProduct = () => {
    const currentIndex = eyewearProducts.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % eyewearProducts.length;
    setSelectedProduct(eyewearProducts[nextIndex]);
  };

  const prevProduct = () => {
    const currentIndex = eyewearProducts.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + eyewearProducts.length) % eyewearProducts.length;
    setSelectedProduct(eyewearProducts[prevIndex]);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-4 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Camera className="w-5 h-5" />
        <span className="font-medium text-sm uppercase tracking-wide">Virtual Try-On</span>
        <Sparkles className="w-4 h-4" />
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
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-amber-500" />
                <span className="text-white font-serif text-lg">Virtual Try-On</span>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera View */}
            <div className="relative w-full h-full">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  
                  {/* Glasses Overlay - Simulated AR */}
                  {isCameraActive && (
                    <motion.div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${glassesPosition.x}%`,
                        top: `${glassesPosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${glassesScale})`,
                        width: "200px",
                      }}
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src={eyewearImages[selectedProduct.id] || eyewearProduct1}
                        alt="Glasses overlay"
                        className="w-full h-auto opacity-90 drop-shadow-lg"
                        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
                      />
                    </motion.div>
                  )}

                  {/* Position Controls */}
                  <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={() => setGlassesPosition(p => ({ ...p, y: Math.max(10, p.y - 5) }))}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => setGlassesPosition(p => ({ ...p, y: Math.min(90, p.y + 5) }))}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => setGlassesScale(s => Math.max(0.5, s - 0.1))}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGlassesScale(s => Math.min(2, s + 0.1))}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                    >
                      +
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
                  
                  {/* Action buttons for captured photo */}
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4">
                    <motion.button
                      onClick={() => setCapturedImage(null)}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake
                    </motion.button>
                    <motion.button
                      onClick={downloadPhoto}
                      className="flex items-center gap-2 bg-amber-500 text-black px-6 py-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                    <motion.button
                      onClick={sharePhoto}
                      className="flex items-center gap-2 bg-white text-black px-6 py-3"
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

            {/* Product Selector */}
            {!capturedImage && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6">
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={prevProduct}
                    className="w-10 h-10 bg-white/10 text-white flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center">
                    <p className="text-amber-400 text-xs uppercase tracking-widest mb-1">
                      {selectedProduct.category}
                    </p>
                    <h3 className="text-white font-serif text-lg">{selectedProduct.title}</h3>
                    <p className="text-amber-500 font-serif">${selectedProduct.price}</p>
                  </div>

                  <motion.button
                    onClick={nextProduct}
                    className="w-10 h-10 bg-white/10 text-white flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Capture Button */}
                {!capturedImage && (
                  <motion.button
                    onClick={capturePhoto}
                    className="mt-6 mx-auto flex items-center justify-center w-20 h-20 bg-white rounded-full border-4 border-amber-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-16 h-16 bg-amber-500 rounded-full" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Instructions */}
            {isCameraActive && !capturedImage && (
              <motion.div
                className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 text-white text-sm text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Position your face in the frame • Use arrows to adjust glasses
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
