import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import gsap from "gsap";

// Category icons for the mega menu
const categoryIcons: Record<string, string> = {
  Rings: "💍",
  Earrings: "✨",
  Necklaces: "📿",
  Bangles: "🔗",
  Bracelets: "🔘",
  "View All": "🛍️",
};

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
        { label: "Rings", href: "/jewellery?category=rings", icon: "💍" },
        { label: "Earrings", href: "/jewellery?category=earrings", icon: "✨" },
        { label: "Necklaces", href: "/jewellery?category=necklaces", icon: "📿" },
        { label: "Bangles", href: "/jewellery?category=bangles", icon: "🔗" },
        { label: "Bracelets", href: "/jewellery?category=bracelets", icon: "🔘" },
        { label: "View All", href: "/jewellery", icon: "🛍️" },
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
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  
  const { setOpen: setCartOpen, getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation on mount
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-soft border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      {/* Announcement Bar */}
      <motion.div
        className={`text-center py-2.5 px-4 transition-all duration-500 ${
          isScrolled
            ? "bg-charcoal text-ivory"
            : "bg-charcoal/95 text-ivory"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="text-[11px] tracking-luxury uppercase font-sans font-light">
          Complimentary shipping on orders over $150
        </p>
      </motion.div>

      {/* Main Header */}
      <div className="container-luxury">
        <div className="flex items-center justify-between h-18 md:h-22 py-4">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 icon-gold-hover"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <motion.h1
              className="text-2xl md:text-3xl font-serif font-normal tracking-wide"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span className={`transition-colors duration-500 ${isScrolled ? "text-foreground" : "text-foreground"}`}>
                OAK
              </span>
              <span className="text-primary mx-1">&</span>
              <span className={`transition-colors duration-500 ${isScrolled ? "text-foreground" : "text-foreground"}`}>
                ASH
              </span>
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 ml-16">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 py-8 text-[13px] tracking-wide-luxury uppercase font-sans font-light link-elegant"
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Mega Menu */}
                {item.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mega-menu min-w-[520px] p-10"
                      >
                        <div className="grid grid-cols-2 gap-12">
                          {/* Categories with Icons */}
                          <div>
                            <h3 className="text-[11px] tracking-luxury uppercase text-muted-foreground mb-6 font-sans">
                              By Category
                            </h3>
                            <ul className="space-y-4">
                              {item.submenu.categories.map((cat) => (
                                <li key={cat.label}>
                                  <Link
                                    to={cat.href}
                                    className="flex items-center gap-3 text-sm font-sans font-light group/item transition-all duration-300 hover:text-primary hover:translate-x-1"
                                  >
                                    <span className="text-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:drop-shadow-[0_0_8px_hsl(var(--gold)/0.5)]">
                                      {cat.icon}
                                    </span>
                                    <span>{cat.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Collections */}
                          <div>
                            <h3 className="text-[11px] tracking-luxury uppercase text-muted-foreground mb-6 font-sans">
                              Collections by Color
                            </h3>
                            <ul className="space-y-4">
                              {item.submenu.collections.map((col) => (
                                <li key={col.label}>
                                  <Link
                                    to={col.href}
                                    className="text-sm font-sans font-light transition-all duration-300 hover:text-primary hover:translate-x-1 block"
                                  >
                                    {col.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Decorative gold line */}
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <p className="text-xs text-muted-foreground font-sans font-light">
                            ✨ Free gift wrapping on all orders
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Link 
              to="/search" 
              className="p-2 icon-gold-hover transition-all duration-300" 
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link 
              to="/account" 
              className="hidden md:block p-2 icon-gold-hover transition-all duration-300" 
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link 
              to="/wishlist" 
              className="hidden md:block p-2 icon-gold-hover transition-all duration-300" 
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 icon-gold-hover transition-all duration-300 relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-sans font-medium"
                >
                  {cartCount}
                </motion.span>
              )}
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-card/98 backdrop-blur-xl border-t border-border/30 overflow-hidden"
          >
            <nav className="container-luxury py-8">
              {navigationItems.map((item, index) => (
                <motion.div 
                  key={item.label} 
                  className="border-b border-border/30 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="block py-5 text-sm tracking-wide-luxury uppercase font-sans font-light"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="pb-4 pl-4 space-y-3">
                      {item.submenu.categories.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.href}
                          className="flex items-center gap-2 text-sm text-muted-foreground font-sans font-light"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};