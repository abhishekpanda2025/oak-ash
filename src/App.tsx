import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useState, useEffect, useRef } from "react";
import Index from "./pages/Index";
import Jewellery from "./pages/Jewellery";
import Eyewear from "./pages/Eyewear";
import ProductDetail from "./pages/ProductDetail";
import DemoProductDetail from "./pages/DemoProductDetail";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Animated Routes Wrapper with Loading
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isNavigation, setIsNavigation] = useState(false);
  const isFirstLoad = useRef(true);
  const previousPath = useRef(location.pathname);

  // Show loading on every route change
  useEffect(() => {
    if (isFirstLoad.current) {
      // First load - show full loading
      isFirstLoad.current = false;
      return;
    }

    // Only trigger loading if the path actually changed
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      setIsNavigation(true);
      setIsLoading(true);
      setShowContent(false);
    }
  }, [location.pathname]);

  const handleLoadingComplete = () => {
    setShowContent(true);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} isNavigation={isNavigation} />
      )}
      {showContent && (
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/eyewear" element={<Eyewear />} />
            <Route path="/faq" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
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
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
