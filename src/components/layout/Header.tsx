import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems = [
  {
    label: "NEW IN",
    href: "/new-in",
  },
  {
    label: "JEWELLERY",
    href: "/jewellery",
    submenu: {
      categories: [
        { label: "Earrings", href: "/jewellery/earrings" },
        { label: "Rings", href: "/jewellery/rings" },
        { label: "Necklaces", href: "/jewellery/necklaces" },
        { label: "Bangles", href: "/jewellery/bangles" },
        { label: "Bracelets", href: "/jewellery/bracelets" },
        { label: "View All", href: "/jewellery" },
      ],
      collections: [
        { label: "Gold", href: "/collections/gold" },
        { label: "Silver", href: "/collections/silver" },
        { label: "Two Tone", href: "/collections/two-tone" },
        { label: "Stones", href: "/collections/stones" },
        { label: "Fresh Water Pearl", href: "/collections/pearl" },
      ],
    },
  },
  {
    label: "EYEWEAR",
    href: "/eyewear",
  },
  {
    label: "ABOUT US",
    href: "/about",
  },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-center py-2 px-4">
        <p className="text-xs tracking-luxury uppercase font-sans">
          Complimentary shipping on orders over $150
        </p>
      </div>

      {/* Main Header */}
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <motion.h1 
              className="text-xl md:text-2xl font-serif font-semibold tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              OAK & ASH
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 ml-12">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 py-6 text-sm tracking-wide-luxury uppercase font-sans link-elegant"
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Mega Menu */}
                {item.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 bg-card shadow-elegant border border-border rounded-sm min-w-[400px] p-8"
                      >
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xs tracking-luxury uppercase text-muted-foreground mb-4">
                              By Category
                            </h3>
                            <ul className="space-y-3">
                              {item.submenu.categories.map((cat) => (
                                <li key={cat.label}>
                                  <Link
                                    to={cat.href}
                                    className="text-sm font-sans hover:text-primary transition-colors"
                                  >
                                    {cat.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-xs tracking-luxury uppercase text-muted-foreground mb-4">
                              Collections by Color
                            </h3>
                            <ul className="space-y-3">
                              {item.submenu.collections.map((col) => (
                                <li key={col.label}>
                                  <Link
                                    to={col.href}
                                    className="text-sm font-sans hover:text-primary transition-colors"
                                  >
                                    {col.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-primary transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:block p-2 hover:text-primary transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
            <button className="hidden md:block p-2 hover:text-primary transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="container-luxury py-6">
              {navigationItems.map((item) => (
                <div key={item.label} className="border-b border-border last:border-0">
                  <Link
                    to={item.href}
                    className="block py-4 text-sm tracking-wide-luxury uppercase font-sans"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
