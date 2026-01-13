import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Gift } from "lucide-react";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showPopup = useCallback(() => {
    const hasSeenPopup = localStorage.getItem("oak-ash-newsletter-popup");
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("oak-ash-newsletter-popup");
    
    if (!hasSeenPopup) {
      // Show popup after 5 minutes (300000ms)
      const timer = setTimeout(() => {
        showPopup();
      }, 300000); // 5 minutes
      
      // Also show when user tries to leave the page (mouse leaves viewport from top)
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !isOpen) {
          showPopup();
        }
      };

      // Show on visibility change (when user switches tabs and comes back)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          // User is leaving, mark for showing on return or next visit
          sessionStorage.setItem("oak-ash-show-on-return", "true");
        } else if (document.visibilityState === 'visible') {
          const shouldShow = sessionStorage.getItem("oak-ash-show-on-return");
          if (shouldShow && !isOpen) {
            sessionStorage.removeItem("oak-ash-show-on-return");
            showPopup();
          }
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [showPopup, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("oak-ash-newsletter-popup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      localStorage.setItem("oak-ash-newsletter-popup", "true");
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative bg-white overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 transition-colors z-20"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative top bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

              {/* Content - Single Column Centered */}
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Icon */}
                      <motion.div
                        className="w-16 h-16 bg-amber-100 mx-auto mb-6 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Gift className="w-8 h-8 text-amber-600" />
                      </motion.div>

                      {/* Discount Badge */}
                      <motion.div
                        className="inline-block mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-5xl md:text-6xl font-serif font-normal text-amber-600">15%</span>
                        <span className="text-xl font-serif text-neutral-700 ml-2">OFF</span>
                      </motion.div>

                      {/* Title */}
                      <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-4 leading-tight text-center">
                        Sign up to our newsletter and receive 15% on your first order.
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-neutral-600 font-sans font-light mb-8 leading-relaxed text-center max-w-sm mx-auto">
                        By signing up to our mailing list you will receive discounts and exclusive offers.
                      </p>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3.5 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-center"
                          required
                        />
                        
                        <motion.button
                          type="submit"
                          className="w-full bg-neutral-900 hover:bg-amber-600 text-white py-4 text-xs tracking-wide uppercase font-sans font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Unlock 15% Off
                        </motion.button>
                      </form>

                      <p className="text-[10px] text-neutral-400 font-sans mt-6 text-center">
                        By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-green-100 mx-auto mb-6 flex items-center justify-center rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Sparkles className="w-10 h-10 text-green-600" />
                      </motion.div>
                      <h3 className="font-serif text-2xl text-neutral-900 mb-3 text-center">
                        Welcome to OAK & ASH!
                      </h3>
                      <p className="text-sm text-neutral-600 font-sans font-light text-center">
                        Check your inbox for your exclusive 15% discount code.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-amber-300/50" />
              <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-amber-300/50" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
