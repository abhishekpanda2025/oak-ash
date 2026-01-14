import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Download, Share2, GitCompare, Image as ImageIcon, Grid, Columns } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SavedPhoto {
  id: string;
  dataUrl: string;
  productName: string;
  category: string;
  timestamp: number;
}

interface TryOnGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: SavedPhoto) => void;
  savedPhotos: SavedPhoto[];
  onDeletePhoto: (id: string) => void;
}

// Hook to manage saved photos in localStorage
export const useTryOnGallery = () => {
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("oak-ash-tryon-photos");
    if (stored) {
      try {
        setSavedPhotos(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved photos");
      }
    }
  }, []);

  const savePhoto = (dataUrl: string, productName: string, category: string) => {
    const newPhoto: SavedPhoto = {
      id: `photo-${Date.now()}`,
      dataUrl,
      productName,
      category,
      timestamp: Date.now(),
    };
    const updated = [newPhoto, ...savedPhotos].slice(0, 20); // Keep max 20 photos
    setSavedPhotos(updated);
    localStorage.setItem("oak-ash-tryon-photos", JSON.stringify(updated));
    toast.success("Photo saved to gallery!");
    return newPhoto;
  };

  const deletePhoto = (id: string) => {
    const updated = savedPhotos.filter((p) => p.id !== id);
    setSavedPhotos(updated);
    localStorage.setItem("oak-ash-tryon-photos", JSON.stringify(updated));
    toast.success("Photo deleted");
  };

  const clearAll = () => {
    setSavedPhotos([]);
    localStorage.removeItem("oak-ash-tryon-photos");
    toast.success("Gallery cleared");
  };

  return {
    savedPhotos,
    savePhoto,
    deletePhoto,
    clearAll,
    isGalleryOpen,
    setIsGalleryOpen,
  };
};

export const TryOnGallery = ({
  isOpen,
  onClose,
  savedPhotos,
  onDeletePhoto,
}: TryOnGalleryProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "compare">("grid");

  const togglePhotoSelection = (id: string) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== id));
    } else if (selectedPhotos.length < 4) {
      setSelectedPhotos([...selectedPhotos, id]);
    } else {
      toast.error("Maximum 4 photos for comparison");
    }
  };

  const downloadPhoto = (photo: SavedPhoto) => {
    const link = document.createElement("a");
    link.download = `oak-ash-${photo.productName}-${photo.timestamp}.jpg`;
    link.href = photo.dataUrl;
    link.click();
    toast.success("Photo downloaded!");
  };

  const sharePhoto = async (photo: SavedPhoto) => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(photo.dataUrl)).blob();
        const file = new File([blob], `oak-ash-tryon.jpg`, { type: "image/jpeg" });
        await navigator.share({
          title: `My OAK & ASH ${photo.productName} Try-On`,
          files: [file],
        });
      } catch (e) {
        toast.error("Sharing failed");
      }
    } else {
      toast.error("Sharing not supported");
    }
  };

  const comparePhotos = savedPhotos.filter((p) => selectedPhotos.includes(p.id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-neutral-950 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif text-xl">My Try-On Gallery</h2>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
              {savedPhotos.length} photos
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded text-xs transition-colors ${
                  viewMode === "grid" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setViewMode("compare");
                  setIsCompareMode(true);
                }}
                className={`px-3 py-1.5 rounded text-xs transition-colors ${
                  viewMode === "compare" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ImageIcon className="w-16 h-16 text-neutral-700 mb-4" />
              <h3 className="font-serif text-xl mb-2">No Photos Yet</h3>
              <p className="text-neutral-500 max-w-sm">
                Take photos during your virtual try-on sessions and they'll appear here for comparison.
              </p>
            </div>
          ) : viewMode === "compare" && selectedPhotos.length > 0 ? (
            /* Compare Mode */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                  Comparing {selectedPhotos.length} photos
                </p>
                <button
                  onClick={() => {
                    setSelectedPhotos([]);
                    setViewMode("grid");
                  }}
                  className="text-xs text-amber-500 hover:text-amber-400"
                >
                  Clear Selection
                </button>
              </div>

              <div
                className={`grid gap-4 ${
                  comparePhotos.length === 2
                    ? "grid-cols-2"
                    : comparePhotos.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {comparePhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.productName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="font-medium text-sm">{photo.productName}</p>
                      <p className="text-xs text-neutral-400">{photo.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Grid Mode */
            <div className="space-y-4">
              {isCompareMode && (
                <p className="text-sm text-amber-400 text-center">
                  Select up to 4 photos to compare side by side
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {savedPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden cursor-pointer ${
                        selectedPhotos.includes(photo.id)
                          ? "ring-2 ring-amber-500"
                          : ""
                      }`}
                      onClick={() => isCompareMode && togglePhotoSelection(photo.id)}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.productName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Selection indicator */}
                      {isCompareMode && selectedPhotos.includes(photo.id) && (
                        <div className="absolute top-2 left-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">
                            {selectedPhotos.indexOf(photo.id) + 1}
                          </span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-medium text-sm truncate">{photo.productName}</p>
                          <p className="text-xs text-neutral-400">{photo.category}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(photo.timestamp).toLocaleDateString()}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPhoto(photo);
                              }}
                              className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sharePhoto(photo);
                              }}
                              className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePhoto(photo.id);
                              }}
                              className="p-1.5 bg-red-500/20 rounded hover:bg-red-500/40 transition-colors text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {savedPhotos.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-800">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isCompareMode
                  ? "bg-amber-500 text-black"
                  : "bg-neutral-800 text-white hover:bg-neutral-700"
              }`}
            >
              <GitCompare className="w-4 h-4" />
              {isCompareMode ? "Exit Compare" : "Compare Photos"}
            </button>

            {isCompareMode && selectedPhotos.length >= 2 && (
              <button
                onClick={() => setViewMode("compare")}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
              >
                <Columns className="w-4 h-4" />
                View Side by Side
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
