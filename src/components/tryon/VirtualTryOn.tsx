import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, ChevronLeft, ChevronRight, Move, ZoomIn, ZoomOut, Gem, Glasses, Heart, Hand, Image } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocalCartStore } from "@/stores/localCartStore";
import { TryOnGallery, useTryOnGallery } from "./TryOnGallery";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

const eyewearProducts = demoProducts.filter(p => p.category === "eyewear");
const jewelryProducts = demoProducts.filter(p => ["necklaces", "earrings", "rings"].includes(p.category));
const ringProducts = demoProducts.filter(p => p.category === "rings");
const braceletProducts = demoProducts.filter(p => p.category === "bracelets" || p.material?.toLowerCase().includes("bangle"));

// Eyewear overlay SVGs (transparent backgrounds)
const eyewearOverlays: Record<string, JSX.Element> = {
  default: (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="50%" stopColor="rgba(50,50,50,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F5D76E" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      {/* Left lens */}
      <ellipse cx="55" cy="40" rx="40" ry="32" fill="url(#lensGrad)" stroke="url(#frameGrad)" strokeWidth="3"/>
      {/* Right lens */}
      <ellipse cx="145" cy="40" rx="40" ry="32" fill="url(#lensGrad)" stroke="url(#frameGrad)" strokeWidth="3"/>
      {/* Bridge */}
      <path d="M95 40 Q100 32 105 40" fill="none" stroke="url(#frameGrad)" strokeWidth="3"/>
      {/* Left temple */}
      <path d="M15 40 L5 38" stroke="url(#frameGrad)" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Right temple */}
      <path d="M185 40 L195 38" stroke="url(#frameGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  aviator: (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="aviatorLens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(139,69,19,0.4)" />
          <stop offset="100%" stopColor="rgba(101,67,33,0.3)" />
        </linearGradient>
        <linearGradient id="goldFrame" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Left lens - teardrop shape */}
      <path d="M20 25 Q55 10 80 25 Q85 45 70 60 Q45 70 25 55 Q15 40 20 25" fill="url(#aviatorLens)" stroke="url(#goldFrame)" strokeWidth="2"/>
      {/* Right lens */}
      <path d="M180 25 Q145 10 120 25 Q115 45 130 60 Q155 70 175 55 Q185 40 180 25" fill="url(#aviatorLens)" stroke="url(#goldFrame)" strokeWidth="2"/>
      {/* Double bridge */}
      <path d="M80 30 Q100 25 120 30" fill="none" stroke="url(#goldFrame)" strokeWidth="1.5"/>
      <path d="M80 38 Q100 33 120 38" fill="none" stroke="url(#goldFrame)" strokeWidth="1.5"/>
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 200 70" className="w-full h-auto">
      <defs>
        <linearGradient id="catLens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
          <stop offset="100%" stopColor="rgba(30,30,30,0.3)" />
        </linearGradient>
      </defs>
      {/* Left cat eye lens */}
      <path d="M15 45 Q25 15 60 20 Q80 25 75 45 Q70 60 40 55 Q20 50 15 45" fill="url(#catLens)" stroke="#1a1a1a" strokeWidth="3"/>
      {/* Right cat eye lens */}
      <path d="M185 45 Q175 15 140 20 Q120 25 125 45 Q130 60 160 55 Q180 50 185 45" fill="url(#catLens)" stroke="#1a1a1a" strokeWidth="3"/>
      {/* Bridge */}
      <path d="M75 35 Q100 28 125 35" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
    </svg>
  ),
  round: (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="roundLens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
        </linearGradient>
      </defs>
      {/* Left round lens */}
      <circle cx="50" cy="40" r="32" fill="url(#roundLens)" stroke="#333" strokeWidth="2.5"/>
      {/* Right round lens */}
      <circle cx="150" cy="40" r="32" fill="url(#roundLens)" stroke="#333" strokeWidth="2.5"/>
      {/* Bridge */}
      <path d="M82 40 Q100 32 118 40" fill="none" stroke="#333" strokeWidth="2"/>
    </svg>
  ),
};

// Jewelry overlay SVGs
const jewelryOverlays = {
  necklace: (
    <svg viewBox="0 0 200 60" className="w-full h-auto">
      <defs>
        <linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="75%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Chain links */}
      <path d="M20 10 Q100 60 180 10" fill="none" stroke="url(#chainGrad)" strokeWidth="3" strokeLinecap="round"/>
      {/* Pendant */}
      <circle cx="100" cy="50" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
      <circle cx="100" cy="50" r="4" fill="#fff" opacity="0.6"/>
    </svg>
  ),
  earring: (
    <svg viewBox="0 0 40 60" className="w-full h-auto">
      <defs>
        <linearGradient id="earringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Stud */}
      <circle cx="20" cy="8" r="5" fill="url(#earringGrad)"/>
      {/* Drop */}
      <ellipse cx="20" cy="35" rx="12" ry="18" fill="none" stroke="url(#earringGrad)" strokeWidth="2"/>
      <circle cx="20" cy="48" r="4" fill="#FFD700"/>
    </svg>
  ),
};

// Ring overlay SVG
const ringOverlay = (
  <svg viewBox="0 0 50 30" className="w-full h-auto">
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#DAA520" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <radialGradient id="gemGrad" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="50%" stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#B0B0B0" />
      </radialGradient>
    </defs>
    {/* Ring band */}
    <ellipse cx="25" cy="18" rx="20" ry="10" fill="none" stroke="url(#ringGrad)" strokeWidth="4"/>
    {/* Gem setting */}
    <circle cx="25" cy="8" r="7" fill="url(#gemGrad)" stroke="#FFD700" strokeWidth="1"/>
    <circle cx="25" cy="8" r="3" fill="#fff" opacity="0.8"/>
  </svg>
);

// Bracelet overlay SVG
const braceletOverlay = (
  <svg viewBox="0 0 100 40" className="w-full h-auto">
    <defs>
      <linearGradient id="braceletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B8860B" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="20" rx="45" ry="15" fill="none" stroke="url(#braceletGrad)" strokeWidth="5"/>
    {/* Decorative elements */}
    <circle cx="25" cy="8" r="3" fill="#FFD700"/>
    <circle cx="50" cy="5" r="3" fill="#FFD700"/>
    <circle cx="75" cy="8" r="3" fill="#FFD700"/>
  </svg>
);

type TryOnMode = "eyewear" | "jewelry" | "rings" | "bracelets";

// Face Detection Hook
const useFaceDetection = (videoRef: React.RefObject<HTMLVideoElement>, isActive: boolean) => {
  const [faceData, setFaceData] = useState<{
    eyeCenter: { x: number; y: number };
    leftEar: { x: number; y: number };
    rightEar: { x: number; y: number };
    neckCenter: { x: number; y: number };
    faceWidth: number;
    rotation: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isActive) return;
      
      try {
        setIsLoading(true);
        await tf.ready();
        await tf.setBackend('webgl');
        
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        detectorRef.current = await faceLandmarksDetection.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1,
        } as faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig);
        
        if (mounted) setIsLoading(false);
      } catch (error) {
        console.error("Face detection init error:", error);
        if (mounted) setIsLoading(false);
      }
    };

    init();
    return () => { mounted = false; cancelAnimationFrame(animationRef.current!); };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current || isLoading) return;

    const detect = async () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0 || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      try {
        if (detectorRef.current) {
          const faces = await detectorRef.current.estimateFaces(video, { flipHorizontal: false });

          if (faces.length > 0) {
            const keypoints = faces[0].keypoints;
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            
            const eyeCenterX = ((keypoints[33]?.x || vw/2) + (keypoints[263]?.x || vw/2)) / 2;
            const eyeCenterY = ((keypoints[33]?.y || vh*0.35) + (keypoints[263]?.y || vh*0.35)) / 2;
            const leftEar = keypoints[234] || { x: eyeCenterX - 100, y: eyeCenterY + 50 };
            const rightEar = keypoints[454] || { x: eyeCenterX + 100, y: eyeCenterY + 50 };
            const chin = keypoints[152] || { x: eyeCenterX, y: vh * 0.7 };
            const faceWidth = Math.abs(rightEar.x - leftEar.x);
            const rotation = Math.atan2(
              (keypoints[263]?.y || 0) - (keypoints[33]?.y || 0),
              (keypoints[263]?.x || 1) - (keypoints[33]?.x || 0)
            ) * (180 / Math.PI);

            setFaceData({
              eyeCenter: { x: (eyeCenterX / vw) * 100, y: (eyeCenterY / vh) * 100 },
              leftEar: { x: (leftEar.x / vw) * 100, y: ((leftEar.y + 30) / vh) * 100 },
              rightEar: { x: (rightEar.x / vw) * 100, y: ((rightEar.y + 30) / vh) * 100 },
              neckCenter: { x: (chin.x / vw) * 100, y: ((chin.y + 50) / vh) * 100 },
              faceWidth: (faceWidth / vw) * 100,
              rotation,
            });
            setFaceDetected(true);
          } else {
            setFaceDetected(false);
          }
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    setTimeout(() => { animationRef.current = requestAnimationFrame(detect); }, 500);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isActive, isLoading, videoRef]);

  return { faceData, isLoading, faceDetected };
};

// Hand Detection Hook
const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement>, isActive: boolean) => {
  const [handData, setHandData] = useState<{
    fingerPosition: { x: number; y: number };
    wristPosition: { x: number; y: number };
    fingerAngle: number;
    wristAngle: number;
    fingerWidth: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [handDetected, setHandDetected] = useState(false);
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isActive) return;
      
      try {
        setIsLoading(true);
        await tf.ready();
        await tf.setBackend('webgl');
        
        detectorRef.current = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          { runtime: 'tfjs', maxHands: 2, modelType: 'full' }
        );
        
        if (mounted) {
          setIsLoading(false);
          toast.success("Hand tracking ready! Show your hand.");
        }
      } catch (error) {
        console.error("Hand detection init error:", error);
        if (mounted) setIsLoading(false);
      }
    };

    init();
    return () => { mounted = false; cancelAnimationFrame(animationRef.current!); };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current || isLoading) return;

    const detect = async () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0 || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      try {
        if (detectorRef.current) {
          const hands = await detectorRef.current.estimateHands(video, { flipHorizontal: false });

          if (hands.length > 0) {
            const kp = hands[0].keypoints;
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            
            // Ring finger PIP joint
            const pip = kp[14];
            const dip = kp[15];
            const base = kp[13];
            // Wrist
            const wrist = kp[0];
            
            if (pip && dip && base && wrist) {
              const fingerAngle = Math.atan2(dip.y - base.y, dip.x - base.x) * (180 / Math.PI);
              const wristAngle = Math.atan2(kp[5].y - wrist.y, kp[5].x - wrist.x) * (180 / Math.PI);
              const fingerWidth = Math.sqrt(Math.pow(dip.x - pip.x, 2) + Math.pow(dip.y - pip.y, 2));

              setHandData({
                fingerPosition: { x: (pip.x / vw) * 100, y: (pip.y / vh) * 100 },
                wristPosition: { x: (wrist.x / vw) * 100, y: (wrist.y / vh) * 100 },
                fingerAngle,
                wristAngle,
                fingerWidth: (fingerWidth / vw) * 100,
              });
              setHandDetected(true);
            }
          } else {
            setHandDetected(false);
          }
        }
      } catch (error) {
        console.error("Hand detection error:", error);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    setTimeout(() => { animationRef.current = requestAnimationFrame(detect); }, 500);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isActive, isLoading, videoRef]);

  return { handData, isLoading, handDetected };
};

// Product Overlay Component
const ProductOverlay = ({ 
  mode, 
  product, 
  position, 
  scale, 
  rotation,
  onDragStart 
}: { 
  mode: TryOnMode;
  product: DemoProduct;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  onDragStart: () => void;
}) => {
  const getOverlay = () => {
    if (mode === "eyewear") {
      const styles = ["aviator", "cat", "round"];
      const style = styles[parseInt(product.id) % styles.length];
      return eyewearOverlays[style] || eyewearOverlays.default;
    }
    if (mode === "rings") return ringOverlay;
    if (mode === "bracelets") return braceletOverlay;
    if (product.category === "earrings") return jewelryOverlays.earring;
    return jewelryOverlays.necklace;
  };

  const getSize = () => {
    if (mode === "eyewear") return { width: 180, height: 70 };
    if (mode === "rings") return { width: 50, height: 30 };
    if (mode === "bracelets") return { width: 100, height: 40 };
    if (product.category === "earrings") return { width: 35, height: 55 };
    return { width: 160, height: 50 };
  };

  const size = getSize();

  return (
    <motion.div
      className="absolute cursor-move z-10 select-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size.width * scale,
        height: size.height * scale,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {getOverlay()}
    </motion.div>
  );
};

// Second Earring Component
const SecondEarring = ({ position, scale, rotation }: { position: { x: number; y: number }; scale: number; rotation: number }) => (
  <motion.div
    className="absolute z-10 pointer-events-none"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      width: 35 * scale,
      height: 55 * scale,
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scaleX(-1)`,
    }}
    animate={{ y: [0, -3, 0] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  >
    {jewelryOverlays.earring}
  </motion.div>
);

// Detection Status Indicator
const DetectionStatus = ({ detected, mode }: { detected: boolean; mode: TryOnMode }) => (
  <motion.div
    className={`absolute top-28 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-xs font-medium ${
      detected ? 'bg-green-500/80 text-white' : 'bg-amber-500/80 text-black'
    }`}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {detected ? (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        {mode === "rings" || mode === "bracelets" ? "Hand detected ✓" : "Face detected ✓"}
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
        {mode === "rings" || mode === "bracelets" ? "Show your hand..." : "Position your face..."}
      </span>
    )}
  </motion.div>
);

export const VirtualTryOn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TryOnMode>("eyewear");
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(eyewearProducts[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [manualPosition, setManualPosition] = useState<{ x: number; y: number } | null>(null);
  const [productScale, setProductScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { addItem } = useLocalCartStore();

  const useHandTracking = mode === "rings" || mode === "bracelets";
  const { faceData, isLoading: faceLoading, faceDetected } = useFaceDetection(videoRef, isCameraActive && !capturedImage && !useHandTracking);
  const { handData, isLoading: handLoading, handDetected } = useHandDetection(videoRef, isCameraActive && !capturedImage && useHandTracking);

  const isLoading = useHandTracking ? handLoading : faceLoading;
  const isDetected = useHandTracking ? handDetected : faceDetected;

  // Hide button while scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsButtonVisible(false);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsButtonVisible(true), 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const getProducts = () => {
    switch (mode) {
      case "eyewear": return eyewearProducts;
      case "rings": return ringProducts;
      case "bracelets": return braceletProducts.length > 0 ? braceletProducts : ringProducts;
      default: return jewelryProducts;
    }
  };

  const products = getProducts();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        toast.success("Camera ready!");
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera");
    }
  }, [cameraFacing]);

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
    if (videoRef.current && canvasRef.current && overlayRef.current) {
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
        ctx.drawImage(video, 0, 0);
        
        // Draw product overlay on captured image
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        toast.success("Photo captured! ✨");
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
        await navigator.share({ title: "My OAK & ASH Try-On", text: "Check out my look!", files: [file] });
      } catch (error) {
        toast.error("Sharing failed");
      }
    } else {
      toast.error("Sharing not supported");
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

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  useEffect(() => {
    setManualPosition(null);
    setProductScale(1);
  }, [selectedProduct, mode]);

  const getPosition = useCallback(() => {
    if (manualPosition) return manualPosition;
    
    if (useHandTracking && handData) {
      return mode === "bracelets" ? handData.wristPosition : handData.fingerPosition;
    }
    
    if (!faceData) return { x: 50, y: mode === "eyewear" ? 35 : 55 };
    
    if (mode === "eyewear") return faceData.eyeCenter;
    if (selectedProduct.category === "earrings") return faceData.leftEar;
    if (selectedProduct.category === "necklaces") return faceData.neckCenter;
    return { x: faceData.eyeCenter.x, y: faceData.eyeCenter.y + 10 };
  }, [faceData, handData, manualPosition, mode, selectedProduct, useHandTracking]);

  const getRotation = () => {
    if (useHandTracking && handData) {
      return mode === "bracelets" ? handData.wristAngle : handData.fingerAngle;
    }
    return faceData?.rotation || 0;
  };

  const nextProduct = () => {
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    setSelectedProduct(products[(idx + 1) % products.length]);
  };

  const prevProduct = () => {
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    setSelectedProduct(products[(idx - 1 + products.length) % products.length]);
  };

  const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setManualPosition({
      x: Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100))
    });
  }, [isDragging]);

  const position = getPosition();
  const rotation = getRotation();

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {isButtonVisible && (
          <motion.button
            onClick={handleOpen}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-3 md:px-6 md:py-4 shadow-lg shadow-amber-500/30 rounded-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium text-xs md:text-sm uppercase tracking-wide hidden sm:inline">Virtual Try-On</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl w-full h-[90vh] md:h-[85vh] p-0 bg-black border-amber-500/20 overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-b from-black to-transparent absolute top-0 left-0 right-0 z-20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-white font-serif text-sm">AR Try-On</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={switchCamera} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={handleClose} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-full">
              {[
                { key: "eyewear", icon: Glasses, label: "Eyewear", products: eyewearProducts },
                { key: "jewelry", icon: Gem, label: "Jewelry", products: jewelryProducts },
                { key: "rings", icon: Hand, label: "Rings", products: ringProducts },
                { key: "bracelets", icon: Heart, label: "Bracelets", products: braceletProducts.length > 0 ? braceletProducts : ringProducts },
              ].map(({ key, icon: Icon, label, products: prods }) => (
                <button
                  key={key}
                  onClick={() => { setMode(key as TryOnMode); setSelectedProduct(prods[0]); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                    mode === key ? "bg-amber-500 text-black" : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Detection Status */}
            {isCameraActive && !capturedImage && !isLoading && (
              <DetectionStatus detected={isDetected} mode={mode} />
            )}

            {/* Camera View */}
            <div
              ref={overlayRef}
              className="relative flex-1 w-full touch-none"
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseUp={() => setIsDragging(false)}
              onTouchEnd={() => setIsDragging(false)}
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

                  {/* Loading */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                      <div className="text-center">
                        <motion.div
                          className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white text-sm">Loading {useHandTracking ? "Hand" : "Face"} Tracking...</p>
                      </div>
                    </div>
                  )}

                  {/* Product Overlay */}
                  {isCameraActive && !isLoading && (
                    <>
                      <ProductOverlay
                        mode={mode}
                        product={selectedProduct}
                        position={position}
                        scale={productScale}
                        rotation={rotation}
                        onDragStart={() => setIsDragging(true)}
                      />
                      
                      {/* Second earring */}
                      {mode === "jewelry" && selectedProduct.category === "earrings" && faceData && (
                        <SecondEarring
                          position={faceData.rightEar}
                          scale={productScale}
                          rotation={faceData.rotation}
                        />
                      )}
                    </>
                  )}

                  {/* Position Controls */}
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 text-white text-xs rounded-full">
                      <Move className="w-3.5 h-3.5" />
                      <span>Drag to move</span>
                    </div>
                    <div className="flex items-center bg-black/60 backdrop-blur-sm rounded-full">
                      <button onClick={() => setProductScale(s => Math.max(0.5, s - 0.1))} className="p-2 text-white hover:text-amber-500">
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button onClick={() => setProductScale(s => Math.min(2, s + 0.1))} className="p-2 text-white hover:text-amber-500">
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  
                  {/* Overlay on captured image */}
                  <ProductOverlay
                    mode={mode}
                    product={selectedProduct}
                    position={position}
                    scale={productScale}
                    rotation={rotation}
                    onDragStart={() => setIsDragging(true)}
                  />
                  
                  {mode === "jewelry" && selectedProduct.category === "earrings" && faceData && (
                    <SecondEarring position={faceData.rightEar} scale={productScale} rotation={faceData.rotation} />
                  )}
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Product Selector */}
            <div className="absolute bottom-20 left-0 right-0 z-20 px-4">
              <div className="flex items-center justify-center gap-2">
                <button onClick={prevProduct} className="w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <motion.div 
                  key={selectedProduct.id}
                  className="flex-1 max-w-xs bg-black/60 backdrop-blur-sm px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-amber-500 text-xs uppercase text-center">{mode}</p>
                  <p className="text-white text-sm font-medium text-center truncate">{selectedProduct.title}</p>
                  <p className="text-amber-500 text-center text-sm">${selectedProduct.price}</p>
                </motion.div>
                <button onClick={nextProduct} className="w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-4 px-4">
              {!capturedImage ? (
                <motion.button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-7 h-7 text-black" />
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button onClick={downloadPhoto} className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black">
                    <Download className="w-5 h-5" />
                  </button>
                  <button onClick={sharePhoto} className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};