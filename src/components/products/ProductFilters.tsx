import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown, Star, Clock, TrendingUp } from "lucide-react";

interface ProductFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: "featured", label: "Featured", icon: Star },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
  { value: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
  { value: "bestseller", label: "Bestsellers", icon: TrendingUp },
];

export const ProductFilters = ({ sortBy, onSortChange }: ProductFiltersProps) => {
  return (
    <motion.div
      className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-sans text-neutral-600">Sort by:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option, index) => {
          const Icon = option.icon;
          const isActive = sortBy === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-sans tracking-wide transition-all duration-300
                ${isActive 
                  ? "bg-neutral-900 text-white" 
                  : "bg-neutral-100 text-neutral-700 hover:bg-amber-100 hover:text-amber-800"
                }
              `}
            >
              <Icon className={`w-3.5 h-3.5 ${option.value.includes('high') ? 'rotate-180' : ''}`} />
              <span>{option.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-neutral-900 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};