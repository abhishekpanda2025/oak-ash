import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, CircleDot } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ringSizes = [
  { us: "4", uk: "H", eu: "46.8", diameter: "14.9" },
  { us: "5", uk: "J", eu: "49.3", diameter: "15.7" },
  { us: "6", uk: "L", eu: "51.9", diameter: "16.5" },
  { us: "7", uk: "N", eu: "54.4", diameter: "17.3" },
  { us: "8", uk: "P", eu: "57.0", diameter: "18.1" },
  { us: "9", uk: "R", eu: "59.5", diameter: "18.9" },
  { us: "10", uk: "T", eu: "62.1", diameter: "19.8" },
];

const braceletSizes = [
  { size: "XS", wrist: "5.5\" - 6\"", cm: "14 - 15.2" },
  { size: "S", wrist: "6\" - 6.5\"", cm: "15.2 - 16.5" },
  { size: "M", wrist: "6.5\" - 7\"", cm: "16.5 - 17.8" },
  { size: "L", wrist: "7\" - 7.5\"", cm: "17.8 - 19" },
  { size: "XL", wrist: "7.5\" - 8\"", cm: "19 - 20.3" },
];

export const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] w-[95vw] max-w-3xl max-h-[90vh] overflow-auto bg-white shadow-2xl rounded-lg"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-amber-500" />
                <h2 className="font-serif text-xl text-neutral-900">Size Guide</h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-6 space-y-8">
              {/* Ring Size Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <CircleDot className="w-5 h-5 text-amber-500" />
                  </motion.div>
                  <h3 className="font-serif text-lg text-neutral-800">Ring Sizes</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">US</th>
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">UK</th>
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">EU</th>
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">Diameter (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ringSizes.map((size, index) => (
                        <motion.tr
                          key={size.us}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="border-b border-neutral-100 hover:bg-amber-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-sans">{size.us}</td>
                          <td className="py-3 px-4 font-sans">{size.uk}</td>
                          <td className="py-3 px-4 font-sans">{size.eu}</td>
                          <td className="py-3 px-4 font-sans">{size.diameter}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ring Measurement Tip */}
                <motion.div
                  className="mt-4 p-4 bg-amber-50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-sans text-amber-800">
                    <strong>Tip:</strong> Wrap a piece of string around your finger, mark where it overlaps, 
                    and measure the length in mm. This is your circumference - divide by 3.14 to get the diameter.
                  </p>
                </motion.div>
              </motion.div>

              {/* Bracelet Size Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Ruler className="w-5 h-5 text-amber-500" />
                  </motion.div>
                  <h3 className="font-serif text-lg text-neutral-800">Bracelet & Bangle Sizes</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">Size</th>
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">Wrist (inches)</th>
                        <th className="text-left py-3 px-4 font-sans font-medium text-neutral-500 uppercase text-xs tracking-wider">Wrist (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {braceletSizes.map((size, index) => (
                        <motion.tr
                          key={size.size}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="border-b border-neutral-100 hover:bg-amber-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-sans font-medium">{size.size}</td>
                          <td className="py-3 px-4 font-sans">{size.wrist}</td>
                          <td className="py-3 px-4 font-sans">{size.cm}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bracelet Measurement Tip */}
                <motion.div
                  className="mt-4 p-4 bg-amber-50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-sm font-sans text-amber-800">
                    <strong>Tip:</strong> Measure your wrist with a flexible tape measure just below the wrist bone. 
                    For a comfortable fit, add 0.5" to 1" to your wrist measurement.
                  </p>
                </motion.div>
              </motion.div>

              {/* Visual Guide */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-4 border border-neutral-200 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <motion.div
                      className="absolute inset-0 border-4 border-amber-500 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute inset-2 border-2 border-dashed border-neutral-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-neutral-500">Ring</span>
                    </div>
                  </div>
                  <p className="text-sm font-sans text-neutral-600">Measure inner diameter</p>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <motion.div
                      className="absolute inset-0 border-4 border-amber-500 rounded-full"
                      style={{ borderRadius: "50% / 30%" }}
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-2 flex items-center justify-center">
                      <span className="text-xs text-neutral-500">Bangle</span>
                    </div>
                  </div>
                  <p className="text-sm font-sans text-neutral-600">Measure wrist circumference</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};