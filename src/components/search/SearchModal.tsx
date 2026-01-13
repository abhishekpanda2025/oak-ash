import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { Link } from "react-router-dom";
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import productPearlEarrings from "@/assets/product-pearl-earrings.jpg";
import productSilverRings from "@/assets/product-silver-rings.jpg";

const categoryImages: Record<string, string> = {
  necklaces: productNecklace,
  earrings: productEarrings,
  rings: productRing,
  bangles: productBangle,
  bracelets: productBangle,
  pearl: productPearlEarrings,
  silver: productSilverRings,
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ["All", "Rings", "Earrings", "Necklaces", "Bangles", "Bracelets"];
const materials = ["All Materials", "Gold Vermeil", "Sterling Silver", "Pearl", "Stones"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "$150 - $200", min: 150, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getProductImage = (product: DemoProduct) => {
    return categoryImages[product.category] || categoryImages[product.collection[0]] || productNecklace;
  };

  const filteredProducts = useMemo(() => {
    return demoProducts.filter((product) => {
      // Query match
      const queryMatch = query === "" || 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.material.toLowerCase().includes(query.toLowerCase());

      // Category match
      const categoryMatch = selectedCategory === "All" || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Material match
      const materialMatch = selectedMaterial === "All Materials" ||
        product.material.toLowerCase().includes(selectedMaterial.toLowerCase().replace(" ", ""));

      // Price match
      const priceMatch = product.price >= selectedPriceRange.min && 
        product.price <= selectedPriceRange.max;

      return queryMatch && categoryMatch && materialMatch && priceMatch;
    });
  }, [query, selectedCategory, selectedMaterial, selectedPriceRange]);

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    const uniqueCategories = [...new Set(filteredProducts.map(p => p.category))];
    const uniqueMaterials = [...new Set(filteredProducts.map(p => p.material))];
    return [...uniqueCategories, ...uniqueMaterials].slice(0, 5);
  }, [query, filteredProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-32 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for jewelry, collections, materials..."
                  className="flex-1 text-lg font-sans font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 transition-colors ${showFilters ? "text-amber-600" : "text-neutral-500"} hover:text-amber-600`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-neutral-500 hover:text-neutral-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setQuery(suggestion)}
                        className="px-3 py-1.5 bg-neutral-100 text-xs font-sans text-neutral-600 hover:bg-amber-100 hover:text-amber-700 transition-colors capitalize"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-neutral-200 overflow-hidden"
                >
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-neutral-200 text-sm font-sans font-light text-neutral-700 hover:border-amber-400 transition-colors"
                      >
                        <span>{selectedCategory}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "category" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === "category" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-lg z-10 mt-1"
                          >
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-sans font-light transition-colors ${
                                  selectedCategory === cat 
                                    ? "bg-amber-50 text-amber-700" 
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Material Filter */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === "material" ? null : "material")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-neutral-200 text-sm font-sans font-light text-neutral-700 hover:border-amber-400 transition-colors"
                      >
                        <span>{selectedMaterial}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "material" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === "material" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-lg z-10 mt-1"
                          >
                            {materials.map((mat) => (
                              <button
                                key={mat}
                                onClick={() => {
                                  setSelectedMaterial(mat);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-sans font-light transition-colors ${
                                  selectedMaterial === mat 
                                    ? "bg-amber-50 text-amber-700" 
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                {mat}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Price Filter */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-neutral-200 text-sm font-sans font-light text-neutral-700 hover:border-amber-400 transition-colors"
                      >
                        <span>{selectedPriceRange.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === "price" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-lg z-10 mt-1"
                          >
                            {priceRanges.map((range) => (
                              <button
                                key={range.label}
                                onClick={() => {
                                  setSelectedPriceRange(range);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-sans font-light transition-colors ${
                                  selectedPriceRange.label === range.label 
                                    ? "bg-amber-50 text-amber-700" 
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="px-6 pb-4">
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedMaterial("All Materials");
                        setSelectedPriceRange(priceRanges[0]);
                        setQuery("");
                      }}
                      className="text-xs font-sans text-amber-600 hover:text-amber-700 transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="overflow-y-auto max-h-[50vh] p-6">
              {filteredProducts.length > 0 ? (
                <>
                  <p className="text-xs font-sans text-neutral-500 mb-4">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProducts.slice(0, 9).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/product/${product.handle}`}
                          onClick={onClose}
                          className="block group"
                        >
                          <div className="aspect-square bg-neutral-100 overflow-hidden mb-3">
                            <img
                              src={getProductImage(product)}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-sm font-sans font-light text-neutral-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-sm font-sans text-amber-600 mt-1">
                            ${product.price}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  {filteredProducts.length > 9 && (
                    <div className="mt-6 text-center">
                      <Link
                        to="/jewellery"
                        onClick={onClose}
                        className="text-sm font-sans text-amber-600 hover:text-amber-700 transition-colors underline"
                      >
                        View all {filteredProducts.length} results
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 font-sans font-light">
                    No products found matching your search.
                  </p>
                  <p className="text-sm text-neutral-400 font-sans mt-2">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
