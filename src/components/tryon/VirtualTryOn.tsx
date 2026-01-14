import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, Eye, ChevronLeft, ChevronRight, Loader2, Scan } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

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

interface FacePosition {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  nose: { x: number; y: number };
  width: number;
  rotation: number;
}

export const VirtualTryOn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(eyewearProducts[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facePosition, setFacePosition] = useState<FacePosition | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [glassesPosition, setGlassesPosition] = useState({ x: 50, y: 35 });
  const [glassesScale, setGlassesScale] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize TensorFlow.js and load face detection model
  const initFaceDetection = useCallback(async () => {
    setIsModelLoading(true);
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: true,
      };
      
      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
      toast.success("Face detection ready!");
      setIsDetecting(true);
    } catch (error) {
      console.error("Error loading face detection model:", error);
      toast.error("Face detection unavailable. Using manual mode.");
      setManualMode(true);
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  // Detect face and update glasses position
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || !isDetecting) return;
    
    try {
      const video = videoRef.current;
      if (video.readyState >= 2) {
        const faces = await detectorRef.current.estimateFaces(video, {
          flipHorizontal: true,
        });
        
        if (faces.length > 0) {
          const face = faces[0];
          const keypoints = face.keypoints;
          
          // Get eye positions (indices for MediaPipe Face Mesh)
          const leftEyeOuter = keypoints[33];  // Left eye outer corner
          const leftEyeInner = keypoints[133]; // Left eye inner corner
          const rightEyeOuter = keypoints[263]; // Right eye outer corner
          const rightEyeInner = keypoints[362]; // Right eye inner corner
          const noseTip = keypoints[1]; // Nose tip
          
          // Calculate eye centers
          const leftEyeCenter = {
            x: (leftEyeOuter.x + leftEyeInner.x) / 2,
            y: (leftEyeOuter.y + leftEyeInner.y) / 2,
          };
          const rightEyeCenter = {
            x: (rightEyeOuter.x + rightEyeInner.x) / 2,
            y: (rightEyeOuter.y + rightEyeInner.y) / 2,
          };
          
          // Calculate rotation angle
          const deltaY = rightEyeCenter.y - leftEyeCenter.y;
          const deltaX = rightEyeCenter.x - leftEyeCenter.x;
          const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          
          // Calculate face width for scaling
          const faceWidth = Math.sqrt(
            Math.pow(rightEyeOuter.x - leftEyeOuter.x, 2) +
            Math.pow(rightEyeOuter.y - leftEyeOuter.y, 2)
          );
          
          // Normalize positions to percentage of video dimensions
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          
          setFacePosition({
            leftEye: {
              x: (leftEyeCenter.x / videoWidth) * 100,
              y: (leftEyeCenter.y / videoHeight) * 100,
            },
            rightEye: {
              x: (rightEyeCenter.x / videoWidth) * 100,
              y: (rightEyeCenter.y / videoHeight) * 100,
            },
            nose: {
              x: (noseTip.x / videoWidth) * 100,
              y: (noseTip.y / videoHeight) * 100,
            },
            width: (faceWidth / videoWidth) * 100,
            rotation: rotation,
          });
        } else {
          setFacePosition(null);
        }
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
    
    animationRef.current = requestAnimationFrame(detectFace);
  }, [isDetecting]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        // Start face detection after camera is ready
        if (!manualMode) {
          await initFaceDetection();
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, [initFaceDetection, manualMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsDetecting(false);
    setFacePosition(null);
  }, []);

  // Start detection loop when detecting becomes true
  useEffect(() => {
    if (isDetecting && isCameraActive && !manualMode) {
      detectFace();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDetecting, isCameraActive, manualMode, detectFace]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
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

  // Calculate glasses position from face detection
  const getGlassesStyle = () => {
    if (facePosition && !manualMode) {
      const centerX = (facePosition.leftEye.x + facePosition.rightEye.x) / 2;
      const centerY = (facePosition.leftEye.y + facePosition.rightEye.y) / 2 - 2;
      const scale = facePosition.width / 22; // Adjusted scale factor
      
      return {
        left: `${centerX}%`,
        top: `${centerY}%`,
        transform: `translate(-50%, -50%) rotate(${-facePosition.rotation}deg) scale(${scale})`,
        width: "200px",
      };
    }
    
    return {
      left: `${glassesPosition.x}%`,
      top: `${glassesPosition.y}%`,
      transform: `translate(-50%, -50%) scale(${glassesScale})`,
      width: "200px",
    };
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
                {isDetecting && (
                  <motion.div 
                    className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Scan className="w-3 h-3" />
                    AI Tracking
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setManualMode(!manualMode)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wide ${
                    manualMode ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'
                  } backdrop-blur-sm`}
                >
                  {manualMode ? 'Manual' : 'Auto'}
                </button>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading Overlay */}
            {isModelLoading && (
              <motion.div
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-white text-lg font-serif">Loading AI Face Detection...</p>
                <p className="text-white/60 text-sm mt-2">This may take a few seconds</p>
              </motion.div>
            )}

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
                  
                  {/* Face Detection Overlay */}
                  {facePosition && !manualMode && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Face tracking indicator */}
                      <div 
                        className="absolute w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                        style={{ 
                          left: `${facePosition.leftEye.x}%`, 
                          top: `${facePosition.leftEye.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                        style={{ 
                          left: `${facePosition.rightEye.x}%`, 
                          top: `${facePosition.rightEye.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* Glasses Overlay - Auto positioned with AI */}
                  {isCameraActive && (facePosition || manualMode) && (
                    <motion.div
                      className="absolute pointer-events-none"
                      style={getGlassesStyle()}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: manualMode ? glassesScale : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={eyewearImages[selectedProduct.id] || eyewearProduct1}
                        alt="Glasses overlay"
                        className="w-full h-auto opacity-90 drop-shadow-lg"
                        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                      />
                    </motion.div>
                  )}

                  {/* No Face Detected Message */}
                  {!facePosition && !manualMode && isCameraActive && !isModelLoading && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm px-6 py-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Scan className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-white text-lg">Looking for your face...</p>
                      <p className="text-white/60 text-sm mt-1">Position yourself in the frame</p>
                    </motion.div>
                  )}

                  {/* Manual Position Controls */}
                  {manualMode && (
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
                  )}
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
            {isCameraActive && !capturedImage && !isModelLoading && (
              <motion.div
                className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 text-white text-sm text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {manualMode 
                  ? "Use arrows to adjust glasses position"
                  : "AI will automatically position glasses on your face"
                }
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
