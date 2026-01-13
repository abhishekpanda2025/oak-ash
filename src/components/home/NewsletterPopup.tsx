import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("oak-ash-newsletter-popup");
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("oak-ash-newsletter-popup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In production, this would send to your newsletter API
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
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative bg-ivory mx-4 overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-charcoal transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2">
                {/* Left - Visual Side */}
                <div className="relative bg-gradient-to-br from-gold/20 via-gold/10 to-transparent p-8 md:p-10 flex items-center justify-center min-h-[200px] md:min-h-[400px]">
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute top-6 left-6 w-16 h-16 border border-gold/30" />
                    <div className="absolute bottom-6 right-6 w-16 h-16 border border-gold/30" />
                  </motion.div>
                  
                  <motion.div
                    className="text-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles className="w-10 h-10 text-gold mx-auto mb-4" />
                    <span className="text-6xl md:text-7xl font-serif text-gold-gradient">15%</span>
                    <p className="text-[11px] tracking-luxury uppercase text-charcoal/60 mt-2 font-sans">
                      Off Your First Order
                    </p>
                  </motion.div>
                </div>

                {/* Right - Form Side */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-3 leading-tight">
                          Join the
                          <br />
                          <span className="italic text-gold-gradient">OAK & ASH</span>
                          <br />
                          Circle
                        </h3>
                        
                        <p className="text-sm text-charcoal/60 font-sans font-light mb-6 leading-relaxed">
                          Subscribe for exclusive access to new collections, styling tips, and members-only offers.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-transparent border-b border-charcoal/20 pb-3 text-sm font-sans font-light placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
                            required
                          />
                          
                          <motion.button
                            type="submit"
                            className="w-full btn-gold-shimmer text-charcoal py-4 text-[12px] tracking-wide-luxury uppercase font-sans font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Unlock 15% Off
                          </motion.button>
                        </form>

                        <p className="text-[10px] text-charcoal/40 font-sans mt-4 text-center">
                          By subscribing, you agree to our Privacy Policy
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
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
                        </motion.div>
                        <h3 className="font-serif text-2xl text-charcoal mb-2">
                          Welcome to the Circle
                        </h3>
                        <p className="text-sm text-charcoal/60 font-sans font-light">
                          Check your inbox for your exclusive discount code.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};