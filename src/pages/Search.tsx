import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoProductCard } from "@/components/products/DemoProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";

const categories = ["All", "Rings", "Earrings", "Necklaces", "Bangles", "Bracelets"];
const materials = ["All Materials", "Gold Vermeil", "Sterling Silver", "Pearl", "Stones"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "$150 - $200", min: 150, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];
const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<DemoProduct | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = useMemo(() => {
    let results = demoProducts.filter((product) => {
      const queryMatch = query === "" || 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.material.toLowerCase().includes(query.toLowerCase());

      const categoryMatch = selectedCategory === "All" || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const materialMatch = selectedMaterial === "All Materials" ||
        product.material.toLowerCase().includes(selectedMaterial.toLowerCase().replace(" ", ""));

      const priceMatch = product.price >= selectedPriceRange.min && 
        product.price <= selectedPriceRange.max;

      return queryMatch && categoryMatch && materialMatch && priceMatch;
    });

    // Sort results
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results = results.filter(p => p.isNew).concat(results.filter(p => !p.isNew));
        break;
      default:
        break;
    }

    return results;
  }, [query, selectedCategory, selectedMaterial, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedMaterial("All Materials");
    setSelectedPriceRange(priceRanges[0]);
    setQuery("");
  };

  const hasActiveFilters = selectedCategory !== "All" || 
    selectedMaterial !== "All Materials" || 
    selectedPriceRange.label !== "All Prices" ||
    query !== "";

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-neutral-50">
          <div className="container-luxury text-center">
            <ScrollReveal>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-6">
                Search
              </h1>
            </ScrollReveal>
            
            {/* Search Bar */}
            <ScrollReveal delay={0.1}>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for jewelry, collections, materials..."
                    className="w-full pl-12 pr-12 py-4 bg-white border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container-luxury">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-32 space-y-8">
                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Category
                    </h3>
                    <ul className="space-y-2">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedCategory === cat 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Material
                    </h3>
                    <ul className="space-y-2">
                      {materials.map((mat) => (
                        <li key={mat}>
                          <button
                            onClick={() => setSelectedMaterial(mat)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedMaterial === mat 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {mat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Price Range
                    </h3>
                    <ul className="space-y-2">
                      {priceRanges.map((range) => (
                        <li key={range.label}>
                          <button
                            onClick={() => setSelectedPriceRange(range)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedPriceRange.label === range.label 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {range.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-sans text-amber-600 hover:text-amber-700 transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-sans text-neutral-500">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden flex items-center gap-2 text-sm font-sans text-neutral-600 hover:text-amber-600 transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                      <button className="flex items-center gap-2 text-sm font-sans text-neutral-600 hover:text-amber-600 transition-colors">
                        Sort by: {sortOptions.find(o => o.value === sortBy)?.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[180px]">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`w-full px-4 py-3 text-left text-sm font-sans font-light transition-colors ${
                              sortBy === option.value 
                                ? "bg-amber-50 text-amber-700" 
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <DemoProductCard
                          product={product}
                          onQuickView={setQuickViewProduct}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-neutral-500 font-sans font-light text-lg">
                      No products found matching your search.
                    </p>
                    <p className="text-sm text-neutral-400 font-sans mt-2">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-6 text-sm font-sans text-amber-600 hover:text-amber-700 transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-serif text-neutral-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-neutral-500 hover:text-neutral-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Category
                    </h3>
                    <ul className="space-y-2">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedCategory === cat 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Material
                    </h3>
                    <ul className="space-y-2">
                      {materials.map((mat) => (
                        <li key={mat}>
                          <button
                            onClick={() => setSelectedMaterial(mat)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedMaterial === mat 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {mat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs tracking-luxury uppercase text-neutral-500 mb-4 font-sans">
                      Price Range
                    </h3>
                    <ul className="space-y-2">
                      {priceRanges.map((range) => (
                        <li key={range.label}>
                          <button
                            onClick={() => setSelectedPriceRange(range)}
                            className={`text-sm font-sans font-light transition-colors ${
                              selectedPriceRange.label === range.label 
                                ? "text-amber-600 font-normal" 
                                : "text-neutral-600 hover:text-amber-600"
                            }`}
                          >
                            {range.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200 flex gap-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 border border-neutral-300 text-neutral-700 text-sm font-sans hover:border-amber-400 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 py-3 bg-neutral-900 text-white text-sm font-sans hover:bg-amber-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <Footer />

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </PageTransition>
  );
};

export default Search;
