import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RotateCcw, Download, Share2, Sparkles, ChevronLeft, ChevronRight, Move, ZoomIn, ZoomOut, Gem, Glasses, Heart, Star, Wand2, Sun, Moon, Palette, Eye, EyeOff, Layers, ShoppingBag, Hand } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocalCartStore } from "@/stores/localCartStore";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

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
const ringProducts = demoProducts.filter(p => p.category === "rings");

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
  "3": productRing,
  "5": productNecklace,
  "6": productEarrings,
  "7": productRing,
  "8": productEarrings,
  "10": productNecklace,
  "11": productRing,
  "13": productNecklace,
  "14": productEarrings,
  "15": productRing,
};

type TryOnMode = "eyewear" | "jewelry" | "rings";

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
  { id: "natural", name: "Natural", icon: Sun, overlay: "" },
  { id: "warm", name: "Warm", icon: Sun, overlay: "rgba(255, 200, 150, 0.1)" },
  { id: "cool", name: "Cool", icon: Moon, overlay: "rgba(150, 200, 255, 0.1)" },
  { id: "studio", name: "Studio", icon: Star, overlay: "rgba(255, 255, 255, 0.05)" },
];

// Hand landmarks for ring placement
const FINGER_LANDMARKS = {
  ringFinger: {
    base: 13,
    pip: 14, // Proximal interphalangeal joint
    dip: 15, // Distal interphalangeal joint
    tip: 16,
  },
  indexFinger: {
    base: 5,
    pip: 6,
    dip: 7,
    tip: 8,
  },
  middleFinger: {
    base: 9,
    pip: 10,
    dip: 11,
    tip: 12,
  },
};

// TensorFlow.js Hand Pose Detection Hook
const useHandPose = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean,
  selectedFinger: "ring" | "index" | "middle" = "ring"
) => {
  const [handData, setHandData] = useState<{
    fingerPosition: { x: number; y: number };
    fingerAngle: number;
    fingerWidth: number;
    isLeftHand: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [handDetected, setHandDetected] = useState(false);
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mounted = true;

    const initializeDetector = async () => {
      if (!isActive) return;
      
      try {
        setIsLoading(true);
        
        await tf.ready();
        await tf.setBackend('webgl');
        
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          maxHands: 2,
          modelType: 'full' as const,
        };
        
        detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
        
        if (mounted) {
          setIsLoading(false);
          toast.success("Hand tracking ready! Show your hand.");
        }
      } catch (error) {
        console.error("Error initializing hand pose:", error);
        if (mounted) {
          setIsLoading(false);
          toast.info("Hand tracking unavailable, using manual placement");
        }
      }
    };

    initializeDetector();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current || isLoading) return;

    const detectHand = async () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0 || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectHand);
        return;
      }

      try {
        if (detectorRef.current) {
          const hands = await detectorRef.current.estimateHands(video, {
            flipHorizontal: false,
          });

          if (hands.length > 0) {
            const hand = hands[0];
            const keypoints = hand.keypoints;
            const fingerData = selectedFinger === "ring" ? FINGER_LANDMARKS.ringFinger :
                             selectedFinger === "index" ? FINGER_LANDMARKS.indexFinger :
                             FINGER_LANDMARKS.middleFinger;
            
            // Get the PIP joint position (middle of finger, where ring sits)
            const pipPoint = keypoints[fingerData.pip];
            const dipPoint = keypoints[fingerData.dip];
            const basePoint = keypoints[fingerData.base];
            
            if (pipPoint && dipPoint && basePoint) {
              // Calculate finger angle
              const dx = dipPoint.x - basePoint.x;
              const dy = dipPoint.y - basePoint.y;
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              // Calculate finger width based on distance between joints
              const fingerWidth = Math.sqrt(
                Math.pow(dipPoint.x - pipPoint.x, 2) + 
                Math.pow(dipPoint.y - pipPoint.y, 2)
              );

              setHandData({
                fingerPosition: {
                  x: (pipPoint.x / video.videoWidth) * 100,
                  y: (pipPoint.y / video.videoHeight) * 100,
                },
                fingerAngle: angle,
                fingerWidth: (fingerWidth / video.videoWidth) * 100,
                isLeftHand: hand.handedness === "Left",
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

      animationRef.current = requestAnimationFrame(detectHand);
    };

    const timeoutId = setTimeout(() => {
      animationRef.current = requestAnimationFrame(detectHand);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isLoading, videoRef, selectedFinger]);

  return { handData, isLoading, handDetected };
};

// TensorFlow.js Face Mesh Detection Hook
const useFaceMesh = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [faceData, setFaceData] = useState<{
    eyeCenter: { x: number; y: number };
    leftEar: { x: number; y: number };
    rightEar: { x: number; y: number };
    neckCenter: { x: number; y: number };
    faceWidth: number;
    faceHeight: number;
    rotation: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mounted = true;

    const initializeDetector = async () => {
      if (!isActive) return;
      
      try {
        setIsLoading(true);
        
        await tf.ready();
        await tf.setBackend('webgl');
        
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1,
        } as faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig;
        
        detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing face mesh:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDetector();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current || isLoading) return;

    const detectFace = async () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0 || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectFace);
        return;
      }

      try {
        if (detectorRef.current) {
          const faces = await detectorRef.current.estimateFaces(video, {
            flipHorizontal: false,
          });

          if (faces.length > 0) {
            const face = faces[0];
            const keypoints = face.keypoints;
            
            const eyeCenterX = (keypoints[33]?.x + keypoints[263]?.x) / 2 || video.videoWidth / 2;
            const eyeCenterY = (keypoints[33]?.y + keypoints[263]?.y) / 2 || video.videoHeight * 0.35;
            
            const leftEarPoint = keypoints[234] || { x: eyeCenterX - 100, y: eyeCenterY + 50 };
            const rightEarPoint = keypoints[454] || { x: eyeCenterX + 100, y: eyeCenterY + 50 };
            const chinPoint = keypoints[152] || { x: eyeCenterX, y: video.videoHeight * 0.7 };
            
            const faceWidth = Math.abs(rightEarPoint.x - leftEarPoint.x);
            const faceHeight = Math.abs(chinPoint.y - (keypoints[10]?.y || eyeCenterY - 80));
            
            const deltaX = keypoints[263]?.x - keypoints[33]?.x || 1;
            const deltaY = keypoints[263]?.y - keypoints[33]?.y || 0;
            const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            setFaceData({
              eyeCenter: { 
                x: (eyeCenterX / video.videoWidth) * 100, 
                y: (eyeCenterY / video.videoHeight) * 100 
              },
              leftEar: { 
                x: (leftEarPoint.x / video.videoWidth) * 100, 
                y: ((leftEarPoint.y + 30) / video.videoHeight) * 100 
              },
              rightEar: { 
                x: (rightEarPoint.x / video.videoWidth) * 100, 
                y: ((rightEarPoint.y + 30) / video.videoHeight) * 100 
              },
              neckCenter: { 
                x: (chinPoint.x / video.videoWidth) * 100, 
                y: ((chinPoint.y + 40) / video.videoHeight) * 100 
              },
              faceWidth: (faceWidth / video.videoWidth) * 100,
              faceHeight: (faceHeight / video.videoHeight) * 100,
              rotation,
            });
            setFaceDetected(true);
          } else {
            setFaceDetected(false);
          }
        } else {
          setFaceData({
            eyeCenter: { x: 50, y: 35 },
            leftEar: { x: 25, y: 40 },
            rightEar: { x: 75, y: 40 },
            neckCenter: { x: 50, y: 65 },
            faceWidth: 40,
            faceHeight: 50,
            rotation: 0,
          });
          setFaceDetected(true);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      animationRef.current = requestAnimationFrame(detectFace);
    };

    const timeoutId = setTimeout(() => {
      animationRef.current = requestAnimationFrame(detectFace);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isLoading, videoRef]);

  return { faceData, isLoading, faceDetected };
};

// Loading Overlay Component
const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center z-20 bg-black/50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-white text-sm">{message}</p>
      <p className="text-amber-500 text-xs mt-1">Powered by TensorFlow.js</p>
    </div>
  </motion.div>
);

// Hand Frame Overlay for Ring Try-On
const HandFrameOverlay = ({ 
  handData, 
  handDetected 
}: { 
  handData: any;
  handDetected: boolean;
}) => {
  if (!handData) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-15"
      style={{
        left: `${handData.fingerPosition.x}%`,
        top: `${handData.fingerPosition.y}%`,
        transform: `translate(-50%, -50%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Finger tracking indicator */}
      <motion.div
        className={`w-6 h-6 rounded-full border-2 ${
          handDetected ? 'border-green-500 bg-green-500/20' : 'border-amber-500 bg-amber-500/20'
        }`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <motion.p
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-medium ${
          handDetected ? 'text-green-500' : 'text-amber-500'
        }`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {handDetected ? "Ring finger detected ✓" : "Show your hand..."}
      </motion.p>
    </motion.div>
  );
};

// Sparkle Effect Component
const SparkleEffect = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {[...Array(15)].map((_, i) => (
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
            duration: 1.5,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 1.5,
          }}
        >
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        </motion.div>
      ))}
    </div>
  );
};

// Shop the Look Panel
interface ShopTheLookItem {
  product: DemoProduct;
  image: string;
}

const ShopTheLookPanel = ({ 
  items, 
  onRemove, 
  onAddAllToCart,
  onClose 
}: { 
  items: ShopTheLookItem[];
  onRemove: (id: string) => void;
  onAddAllToCart: () => void;
  onClose: () => void;
}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <motion.div
      className="absolute top-24 left-2 md:left-4 w-64 md:w-80 z-30 bg-black/90 backdrop-blur-md rounded-xl overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-serif text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            Shop the Look
          </h4>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-white/60 text-xs mt-1">{items.length} items saved</p>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-amber-500/50 mx-auto mb-2" />
            <p className="text-white/60 text-xs">Try on items and save them here!</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.product.id}
              className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{item.product.title}</p>
                <p className="text-amber-500 text-xs">${item.product.price}</p>
              </div>
              <button
                onClick={() => onRemove(item.product.id)}
                className="p-1.5 text-white/40 hover:text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))
        )}
      </div>
      
      {items.length > 0 && (
        <div className="p-4 bg-black/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs">Total</span>
            <span className="text-amber-500 font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <motion.button
            onClick={onAddAllToCart}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-medium rounded-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag className="w-4 h-4" />
            Add All to Cart
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

// Before/After Comparison Slider
const ComparisonView = ({ 
  withProduct, 
  withoutProduct,
  isActive 
}: { 
  withProduct: string | null; 
  withoutProduct: string | null;
  isActive: boolean;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  if (!isActive || !withProduct || !withoutProduct) return null;

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-40 cursor-ew-resize touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={withoutProduct} 
          alt="Without product" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-white text-xs">
          Before
        </div>
      </div>

      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img 
          src={withProduct} 
          alt="With product" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-amber-500/90 px-3 py-1.5 rounded-full text-black text-xs font-medium">
          After ✨
        </div>
      </div>

      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        whileHover={{ scaleX: 1.5 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const VirtualTryOn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mode, setMode] = useState<TryOnMode>("eyewear");
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(eyewearProducts[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedWithoutProduct, setCapturedWithoutProduct] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [manualPosition, setManualPosition] = useState<{ x: number; y: number } | null>(null);
  const [productScale, setProductScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [activeFilter, setActiveFilter] = useState(beautyFilters[0]);
  const [activeLighting, setActiveLighting] = useState(lightingModes[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showProduct, setShowProduct] = useState(true);
  const [showShopTheLook, setShowShopTheLook] = useState(false);
  const [shopTheLookItems, setShopTheLookItems] = useState<ShopTheLookItem[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { addItem } = useLocalCartStore();

  const getProductsForMode = () => {
    switch (mode) {
      case "eyewear": return eyewearProducts;
      case "rings": return ringProducts;
      default: return jewelryProducts;
    }
  };

  const products = getProductsForMode();
  const images = mode === "eyewear" ? eyewearImages : jewelryImages;

  const { faceData, isLoading: faceLoading, faceDetected } = useFaceMesh(
    videoRef, 
    isCameraActive && !capturedImage && mode !== "rings"
  );
  
  const { handData, isLoading: handLoading, handDetected } = useHandPose(
    videoRef, 
    isCameraActive && !capturedImage && mode === "rings"
  );

  const isLoading = mode === "rings" ? handLoading : faceLoading;

  const getProductPosition = useCallback(() => {
    if (manualPosition) {
      return { x: manualPosition.x, y: manualPosition.y };
    }
    
    if (mode === "rings" && handData) {
      return { x: handData.fingerPosition.x, y: handData.fingerPosition.y };
    }
    
    if (!faceData) {
      return { x: 50, y: mode === "rings" ? 70 : 40 };
    }

    if (mode === "eyewear") {
      return { x: faceData.eyeCenter.x, y: faceData.eyeCenter.y };
    } else {
      if (selectedProduct.category === "earrings") {
        return { x: faceData.leftEar.x, y: faceData.leftEar.y };
      } else if (selectedProduct.category === "necklaces") {
        return { x: faceData.neckCenter.x, y: faceData.neckCenter.y };
      }
      return { x: faceData.eyeCenter.x, y: faceData.eyeCenter.y + 10 };
    }
  }, [faceData, handData, manualPosition, mode, selectedProduct]);

  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        toast.success("Camera ready!");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
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

  const capturePhoto = useCallback((withProductOverlay: boolean = true) => {
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
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        
        if (withProductOverlay) {
          setCapturedImage(dataUrl);
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 2000);
          toast.success("Photo captured! ✨");
        } else {
          setCapturedWithoutProduct(dataUrl);
        }
      }
    }
  }, [cameraFacing, activeFilter]);

  const addToShopTheLook = useCallback(() => {
    const existingItem = shopTheLookItems.find(item => item.product.id === selectedProduct.id);
    if (!existingItem) {
      const productImage = images[selectedProduct.id] || (mode === "eyewear" ? eyewearProduct1 : productNecklace);
      setShopTheLookItems(prev => [...prev, { product: selectedProduct, image: productImage }]);
      toast.success(`${selectedProduct.title} added to your look!`);
    } else {
      toast.info("This item is already in your look");
    }
  }, [selectedProduct, shopTheLookItems, images, mode]);

  const removeFromShopTheLook = useCallback((productId: string) => {
    setShopTheLookItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const addAllToCart = useCallback(() => {
    shopTheLookItems.forEach(item => {
      addItem(item.product, 1);
    });
    toast.success(`${shopTheLookItems.length} items added to cart!`);
    setShopTheLookItems([]);
    setShowShopTheLook(false);
  }, [shopTheLookItems, addItem]);

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
    setCapturedWithoutProduct(null);
    setManualPosition(null);
    setIsOpen(false);
    setShowFilters(false);
    setShowComparison(false);
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    setManualPosition(null);
    setProductScale(1);
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

  const position = getProductPosition();
  
  const getOverlayStyle = () => {
    const rotation = mode === "rings" && handData ? handData.fingerAngle : (faceData?.rotation || 0);
    const baseWidth = mode === "eyewear" ? 120 : mode === "rings" ? 40 : 80;
    
    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translate(-50%, -50%) scale(${productScale}) rotate(${rotation}deg)`,
      width: `${baseWidth}px`,
    };
  };

  const renderSecondEarring = () => {
    if (mode !== "jewelry" || selectedProduct.category !== "earrings" || !faceData || !showProduct) return null;
    
    return (
      <motion.div
        className="absolute cursor-move z-10"
        style={{
          left: `${faceData.rightEar.x}%`,
          top: `${faceData.rightEar.y}%`,
          transform: `translate(-50%, -50%) scale(${productScale}) rotate(${faceData?.rotation || 0}deg)`,
          width: "60px",
        }}
        animate={{ y: isDragging ? 0 : [0, -2, 0] }}
        transition={{ duration: 2, repeat: isDragging ? 0 : Infinity, ease: "easeInOut" }}
      >
        <img
          src={images[selectedProduct.id] || productEarrings}
          alt="Right earring"
          className="w-full h-auto opacity-90 drop-shadow-lg pointer-events-none"
          style={{ 
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            transform: "scaleX(-1)",
          }}
          loading="lazy"
        />
      </motion.div>
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 md:gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-3 md:px-6 md:py-4 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-shadow rounded-full"
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

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl w-full h-[90vh] md:h-[85vh] p-0 bg-black border-amber-500/20 overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black to-transparent absolute top-0 left-0 right-0 z-20">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                </motion.div>
                <div>
                  <span className="text-white font-serif text-sm md:text-lg">AR Virtual Try-On</span>
                  <span className="text-amber-500 text-[10px] ml-2 hidden sm:inline">AI Powered</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                {/* Shop the Look Toggle */}
                <button
                  onClick={() => setShowShopTheLook(!showShopTheLook)}
                  className={`w-9 h-9 md:w-10 md:h-10 backdrop-blur-sm flex items-center justify-center transition-colors rounded-full relative ${
                    showShopTheLook ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Shop the Look"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  {shopTheLookItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {shopTheLookItems.length}
                    </span>
                  )}
                </button>
                {/* Add to Look Button */}
                <button
                  onClick={addToShopTheLook}
                  className="w-9 h-9 md:w-10 md:h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-colors rounded-full"
                  title="Add to your look"
                >
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {/* Show/Hide Product Toggle */}
                <button
                  onClick={() => setShowProduct(!showProduct)}
                  className={`w-9 h-9 md:w-10 md:h-10 backdrop-blur-sm flex items-center justify-center transition-colors rounded-full ${
                    showProduct ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={showProduct ? "Hide product" : "Show product"}
                >
                  {showProduct ? <Eye className="w-4 h-4 md:w-5 md:h-5" /> : <EyeOff className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-9 h-9 md:w-10 md:h-10 backdrop-blur-sm flex items-center justify-center transition-colors rounded-full ${
                    showFilters ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all ${
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all ${
                  mode === "jewelry" 
                    ? "bg-amber-500 text-black" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Gem className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Jewelry</span>
              </button>
              <button
                onClick={() => {
                  setMode("rings");
                  setSelectedProduct(ringProducts[0]);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all ${
                  mode === "rings" 
                    ? "bg-amber-500 text-black" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Hand className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Rings</span>
              </button>
            </div>

            {/* Shop the Look Panel */}
            <AnimatePresence>
              {showShopTheLook && (
                <ShopTheLookPanel
                  items={shopTheLookItems}
                  onRemove={removeFromShopTheLook}
                  onAddAllToCart={addAllToCart}
                  onClose={() => setShowShopTheLook(false)}
                />
              )}
            </AnimatePresence>

            {/* Beauty Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute top-24 md:top-28 right-2 md:right-4 w-48 md:w-64 z-30 bg-black/80 backdrop-blur-md rounded-xl p-3 md:p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h4 className="text-white text-xs md:text-sm font-medium mb-2 flex items-center gap-2">
                    <Palette className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                    Beauty Filters
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {beautyFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter)}
                        className={`p-1.5 md:p-2 rounded-lg text-center transition-all ${
                          activeFilter.id === filter.id 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <span className="text-sm md:text-lg">{filter.icon}</span>
                        <p className="text-[8px] md:text-[10px] mt-0.5">{filter.name}</p>
                      </button>
                    ))}
                  </div>
                  
                  <h4 className="text-white text-xs md:text-sm font-medium mb-2 flex items-center gap-2">
                    <Sun className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                    Lighting
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {lightingModes.map((light) => (
                      <button
                        key={light.id}
                        onClick={() => setActiveLighting(light)}
                        className={`p-1.5 md:p-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                          activeLighting.id === light.id 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <light.icon className="w-3 h-3" />
                        <span className="text-[8px] md:text-[10px]">{light.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera View */}
            <div 
              ref={overlayRef}
              className="relative flex-1 w-full touch-none"
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
            >
              {/* Comparison View Overlay */}
              <AnimatePresence>
                {showComparison && capturedImage && capturedWithoutProduct && (
                  <ComparisonView
                    withProduct={capturedImage}
                    withoutProduct={capturedWithoutProduct}
                    isActive={showComparison}
                  />
                )}
              </AnimatePresence>

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
                  
                  {/* Loading Overlay */}
                  {isLoading && (
                    <LoadingOverlay 
                      message={mode === "rings" ? "Loading Hand Tracking..." : "Loading Face Mesh..."} 
                    />
                  )}
                  
                  {/* Hand Frame Overlay for Ring Mode */}
                  {mode === "rings" && !isLoading && (
                    <HandFrameOverlay 
                      handData={handData}
                      handDetected={handDetected} 
                    />
                  )}
                  
                  {/* Product Overlay */}
                  {isCameraActive && showProduct && !isLoading && (
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
                        src={images[selectedProduct.id] || (mode === "eyewear" ? eyewearProduct1 : mode === "rings" ? productRing : productNecklace)}
                        alt="Product overlay"
                        className="w-full h-auto opacity-90 drop-shadow-lg pointer-events-none"
                        style={{ 
                          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                          mixBlendMode: mode !== "eyewear" ? "multiply" : "normal",
                        }}
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                  
                  {/* Second Earring */}
                  {renderSecondEarring()}

                  {/* Position Controls */}
                  <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-20">
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 text-white text-xs rounded-full">
                      <Move className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Drag to position</span>
                      <span className="sm:hidden">Drag</span>
                    </div>
                    <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full">
                      <button
                        onClick={() => setProductScale(s => Math.max(0.5, s - 0.1))}
                        className="p-1.5 md:p-2 text-white hover:text-amber-500 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductScale(s => Math.min(2, s + 0.1))}
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
                    loading="lazy"
                  />
                  <SparkleEffect isActive={showSparkles} />
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Product Selector */}
            <div className="absolute bottom-20 md:bottom-24 left-0 right-0 z-20 px-2 md:px-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={prevProduct}
                  className="w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors rounded-full shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                
                <motion.div 
                  className="flex-1 max-w-[200px] md:max-w-xs bg-black/50 backdrop-blur-sm px-3 py-2 md:px-6 md:py-4 rounded-xl"
                  key={selectedProduct.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-amber-500 text-[10px] md:text-xs uppercase tracking-wide text-center">
                    {mode === "eyewear" ? "Eyewear" : mode === "rings" ? "Rings" : selectedProduct.category}
                  </p>
                  <p className="text-white text-xs md:text-base font-medium text-center truncate">
                    {selectedProduct.title}
                  </p>
                  <p className="text-amber-500 text-center text-xs md:text-sm">${selectedProduct.price}</p>
                </motion.div>
                
                <button
                  onClick={nextProduct}
                  className="w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors rounded-full shrink-0"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-20 flex justify-center gap-3 md:gap-6 px-4">
              {!capturedImage ? (
                <motion.button
                  onClick={() => capturePhoto(true)}
                  className="w-14 h-14 md:w-18 md:h-18 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setCapturedWithoutProduct(null);
                      setShowComparison(false);
                    }}
                    className="w-11 h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                  >
                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={downloadPhoto}
                    className="w-11 h-11 md:w-14 md:h-14 bg-amber-500 flex items-center justify-center text-black rounded-full"
                  >
                    <Download className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={sharePhoto}
                    className="w-11 h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full"
                  >
                    <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={addToShopTheLook}
                    className="w-11 h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-colors rounded-full"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
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
