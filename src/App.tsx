import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Jewellery from "./pages/Jewellery";
import Eyewear from "./pages/Eyewear";
import ProductDetail from "./pages/ProductDetail";
import DemoProductDetail from "./pages/DemoProductDetail";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Animated Routes Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/jewellery" element={<Jewellery />} />
        <Route path="/new-in" element={<Jewellery />} />
        <Route path="/collection/:collectionId" element={<Collection />} />
        <Route path="/product/:handle" element={<DemoProductDetail />} />
        <Route path="/shopify-product/:handle" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/eyewear" element={<Eyewear />} />
        <Route path="/contact" element={<About />} />
        <Route path="/faq" element={<About />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main App with Loading Screen
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loading screen in this session
    const hasSeenLoading = sessionStorage.getItem('oakash-loaded');
    if (hasSeenLoading) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('oakash-loaded', 'true');
    setShowContent(true);
  };

  return (
    <>
      {isLoading && !sessionStorage.getItem('oakash-loaded') && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      {showContent && (
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
