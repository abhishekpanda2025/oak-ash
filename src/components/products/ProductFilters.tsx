import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  // Advanced filters
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  selectedMaterials?: string[];
  onMaterialsChange?: (materials: string[]) => void;
  selectedStyles?: string[];
  onStylesChange?: (styles: string[]) => void;
  availableMaterials?: string[];
  availableStyles?: string[];
  showAdvancedFilters?: boolean;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "bestseller", label: "Bestseller" },
];

const defaultPriceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $300", min: 200, max: 300 },
  { label: "Over $300", min: 300, max: Infinity },
];

export const ProductFilters = ({
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  selectedMaterials = [],
  onMaterialsChange,
  selectedStyles = [],
  onStylesChange,
  availableMaterials = [],
  availableStyles = [],
  showAdvancedFilters = false,
}: ProductFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isMaterialOpen, setIsMaterialOpen] = useState(true);
  const [isStyleOpen, setIsStyleOpen] = useState(true);

  const handlePriceSelect = (min: number, max: number) => {
    if (onPriceRangeChange) {
      if (priceRange && priceRange[0] === min && priceRange[1] === max) {
        onPriceRangeChange([0, Infinity]);
      } else {
        onPriceRangeChange([min, max]);
      }
    }
  };

  const handleMaterialToggle = (material: string) => {
    if (onMaterialsChange) {
      if (selectedMaterials.includes(material)) {
        onMaterialsChange(selectedMaterials.filter(m => m !== material));
      } else {
        onMaterialsChange([...selectedMaterials, material]);
      }
    }
  };

  const handleStyleToggle = (style: string) => {
    if (onStylesChange) {
      if (selectedStyles.includes(style)) {
        onStylesChange(selectedStyles.filter(s => s !== style));
      } else {
        onStylesChange([...selectedStyles, style]);
      }
    }
  };

  const activeFiltersCount = 
    (priceRange && (priceRange[0] > 0 || priceRange[1] < Infinity) ? 1 : 0) +
    selectedMaterials.length +
    selectedStyles.length;

  return (
    <div className="mb-8">
      {/* Filter Bar */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-neutral-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4">
          {/* Filter Toggle Button */}
          {showAdvancedFilters && (
            <motion.button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-sans border transition-all ${
                isFiltersOpen || activeFiltersCount > 0
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-neutral-300 text-neutral-700 hover:border-amber-500"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500 font-sans hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 text-sm font-sans border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:border-amber-500 cursor-pointer min-w-[160px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <motion.div
          initial={false}
          animate={{ height: isFiltersOpen ? "auto" : 0, opacity: isFiltersOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="py-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range Filter */}
            <div className="space-y-3">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex items-center justify-between w-full text-sm font-sans font-medium text-neutral-800"
              >
                Price Range
                <ChevronDown className={`w-4 h-4 transition-transform ${isPriceOpen ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isPriceOpen ? "auto" : 0, opacity: isPriceOpen ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2">
                  {defaultPriceRanges.map((range) => {
                    const isActive = priceRange && priceRange[0] === range.min && priceRange[1] === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => handlePriceSelect(range.min, range.max)}
                        className={`px-3 py-1.5 text-xs font-sans border transition-all ${
                          isActive
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-neutral-300 text-neutral-600 hover:border-amber-500"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Material Filter */}
            {availableMaterials.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsMaterialOpen(!isMaterialOpen)}
                  className="flex items-center justify-between w-full text-sm font-sans font-medium text-neutral-800"
                >
                  Material
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMaterialOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isMaterialOpen ? "auto" : 0, opacity: isMaterialOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableMaterials.map((material) => {
                      const isActive = selectedMaterials.includes(material);
                      return (
                        <button
                          key={material}
                          onClick={() => handleMaterialToggle(material)}
                          className={`px-3 py-1.5 text-xs font-sans border transition-all ${
                            isActive
                              ? "border-amber-500 bg-amber-500 text-white"
                              : "border-neutral-300 text-neutral-600 hover:border-amber-500"
                          }`}
                        >
                          {material}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Style Filter */}
            {availableStyles.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsStyleOpen(!isStyleOpen)}
                  className="flex items-center justify-between w-full text-sm font-sans font-medium text-neutral-800"
                >
                  Style
                  <ChevronDown className={`w-4 h-4 transition-transform ${isStyleOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isStyleOpen ? "auto" : 0, opacity: isStyleOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableStyles.map((style) => {
                      const isActive = selectedStyles.includes(style);
                      return (
                        <button
                          key={style}
                          onClick={() => handleStyleToggle(style)}
                          className={`px-3 py-1.5 text-xs font-sans border transition-all ${
                            isActive
                              ? "border-amber-500 bg-amber-500 text-white"
                              : "border-neutral-300 text-neutral-600 hover:border-amber-500"
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <motion.button
              onClick={() => {
                onPriceRangeChange?.([0, Infinity]);
                onMaterialsChange?.([]);
                onStylesChange?.([]);
              }}
              className="text-sm text-amber-600 hover:text-amber-700 font-sans mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};
