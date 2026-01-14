import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Ruler, Sparkles, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SizeRecommendationProps {
  isOpen: boolean;
  onClose: () => void;
  productType: "ring" | "bracelet" | "necklace" | "earrings";
  onSizeSelect: (size: string) => void;
}

interface Measurements {
  fingerCircumference?: number;
  wristCircumference?: number;
  neckCircumference?: number;
}

const ringGuide = [
  { size: "5", circumference: 49.3, diameter: 15.7 },
  { size: "6", circumference: 52.4, diameter: 16.7 },
  { size: "7", circumference: 55.5, diameter: 17.7 },
  { size: "8", circumference: 58.6, diameter: 18.6 },
  { size: "9", circumference: 61.7, diameter: 19.6 },
  { size: "10", circumference: 64.8, diameter: 20.6 },
];

const braceletGuide = [
  { size: "S", wristMin: 14, wristMax: 15.5, braceletLength: "16cm" },
  { size: "M", wristMin: 15.5, wristMax: 17, braceletLength: "18cm" },
  { size: "L", wristMin: 17, wristMax: 18.5, braceletLength: "20cm" },
  { size: "XL", wristMin: 18.5, wristMax: 20, braceletLength: "22cm" },
];

const necklaceGuide = [
  { size: "Choker", length: 35, description: "Sits close to neck" },
  { size: "Princess", length: 45, description: "Classic length" },
  { size: "Matinee", length: 55, description: "Below collarbone" },
  { size: "Opera", length: 70, description: "Below bust line" },
  { size: "Rope", length: 85, description: "Long statement" },
];

export const SizeRecommendation = ({ 
  isOpen, 
  onClose, 
  productType,
  onSizeSelect 
}: SizeRecommendationProps) => {
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const calculateRingSize = (circumference: number): string => {
    const closest = ringGuide.reduce((prev, curr) => {
      return Math.abs(curr.circumference - circumference) < Math.abs(prev.circumference - circumference)
        ? curr
        : prev;
    });
    return closest.size;
  };

  const calculateBraceletSize = (wristCirc: number): string => {
    const match = braceletGuide.find(
      b => wristCirc >= b.wristMin && wristCirc < b.wristMax
    );
    return match?.size || "M";
  };

  const calculateNecklaceSize = (neckCirc: number): string => {
    // Add some length for comfort
    const idealLength = neckCirc + 10;
    const closest = necklaceGuide.reduce((prev, curr) => {
      return Math.abs(curr.length - idealLength) < Math.abs(prev.length - idealLength)
        ? curr
        : prev;
    });
    return closest.size;
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate AI calculation with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let size: string | null = null;
    
    switch (productType) {
      case "ring":
        if (measurements.fingerCircumference) {
          size = calculateRingSize(measurements.fingerCircumference);
        }
        break;
      case "bracelet":
        if (measurements.wristCircumference) {
          size = calculateBraceletSize(measurements.wristCircumference);
        }
        break;
      case "necklace":
        if (measurements.neckCircumference) {
          size = calculateNecklaceSize(measurements.neckCircumference);
        }
        break;
      default:
        size = "Standard";
    }
    
    setRecommendation(size);
    setIsCalculating(false);
    
    if (size) {
      toast.success(`Perfect! Size ${size} is recommended for you.`);
    }
  };

  const handleSelectSize = () => {
    if (recommendation) {
      onSizeSelect(recommendation);
      onClose();
    }
  };

  const getMeasurementTip = () => {
    switch (productType) {
      case "ring":
        return "Wrap a piece of string or paper around your finger. Mark where it overlaps and measure in mm.";
      case "bracelet":
        return "Measure around your wrist just above the wrist bone using a flexible tape measure.";
      case "necklace":
        return "Measure around your neck at the base, where you'd like the necklace to sit.";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl">AI Size Finder</h2>
                  <p className="text-white/80 text-sm">
                    Get your perfect {productType} size
                  </p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {!recommendation ? (
                <>
                  {/* Measurement Input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-neutral-700 font-medium">
                        {productType === "ring" && "Finger Circumference (mm)"}
                        {productType === "bracelet" && "Wrist Circumference (cm)"}
                        {productType === "necklace" && "Neck Circumference (cm)"}
                      </Label>
                      <button
                        onClick={() => setShowTip(!showTip)}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showTip && (
                        <motion.div
                          className="bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          💡 {getMeasurementTip()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder={
                          productType === "ring" 
                            ? "e.g., 52" 
                            : productType === "bracelet"
                            ? "e.g., 16"
                            : "e.g., 35"
                        }
                        className="pl-10 h-12 text-lg"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (productType === "ring") {
                            setMeasurements({ fingerCircumference: value });
                          } else if (productType === "bracelet") {
                            setMeasurements({ wristCircumference: value });
                          } else {
                            setMeasurements({ neckCircumference: value });
                          }
                        }}
                      />
                    </div>
                    
                    {/* Size Guide */}
                    <div className="mt-6">
                      <p className="text-sm text-neutral-600 mb-3">Quick Reference:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {productType === "ring" && ringGuide.slice(0, 6).map(r => (
                          <div key={r.size} className="bg-neutral-50 p-2 text-center">
                            <span className="font-medium">Size {r.size}</span>
                            <span className="text-neutral-500 block">{r.circumference}mm</span>
                          </div>
                        ))}
                        {productType === "bracelet" && braceletGuide.map(b => (
                          <div key={b.size} className="bg-neutral-50 p-2 text-center">
                            <span className="font-medium">{b.size}</span>
                            <span className="text-neutral-500 block">{b.wristMin}-{b.wristMax}cm</span>
                          </div>
                        ))}
                        {productType === "necklace" && necklaceGuide.slice(0, 3).map(n => (
                          <div key={n.size} className="bg-neutral-50 p-2 text-center">
                            <span className="font-medium">{n.size}</span>
                            <span className="text-neutral-500 block">{n.length}cm</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCalculate}
                    disabled={
                      isCalculating || 
                      (productType === "ring" && !measurements.fingerCircumference) ||
                      (productType === "bracelet" && !measurements.wristCircumference) ||
                      (productType === "necklace" && !measurements.neckCircumference)
                    }
                    className="w-full mt-6 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  >
                    {isCalculating ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Calculating...
                      </motion.div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Find My Perfect Size
                      </>
                    )}
                  </Button>
                </>
              ) : (
                /* Recommendation Result */
                <motion.div
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <span className="text-3xl font-serif text-white">{recommendation}</span>
                  </motion.div>
                  
                  <h3 className="font-serif text-2xl text-neutral-800 mb-2">
                    Your Perfect Size
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Based on your measurements, we recommend size <strong>{recommendation}</strong>
                  </p>
                  
                  <motion.div
                    className="flex items-center justify-center gap-2 text-green-600 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm">AI confidence: 95%</span>
                  </motion.div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setRecommendation(null)}
                      className="flex-1"
                    >
                      Measure Again
                    </Button>
                    <Button
                      onClick={handleSelectSize}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      Select Size {recommendation}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
