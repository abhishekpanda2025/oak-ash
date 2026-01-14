import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Package, Heart, Camera, MapPin, CreditCard, 
  LogOut, ChevronRight, Edit2, Bell, Shield, Loader2,
  ShoppingBag, Clock, Image, Trash2, Share2, Download, X
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { demoProducts, DemoProduct } from "@/data/demoProducts";

// Mock purchase history
const mockPurchases = [
  { id: "1", date: "2026-01-10", total: 450, status: "Delivered", items: ["Aurélie Gold Pendant Necklace"] },
  { id: "2", date: "2026-01-05", total: 285, status: "Delivered", items: ["Cat-Eye Gold Frames"] },
  { id: "3", date: "2025-12-20", total: 680, status: "Delivered", items: ["Statement Gold Necklace", "Diamond Hoop Earrings"] },
];

// Mock saved try-on photos
const mockTryOnPhotos = [
  { id: "1", date: "2026-01-12", productId: "17", productName: "Monaco Aviator Sunglasses" },
  { id: "2", date: "2026-01-10", productId: "6", productName: "Seraphine Crystal Earrings" },
  { id: "3", date: "2026-01-08", productId: "1", productName: "Aurélie Gold Pendant" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const { items: wishlistItems, syncToAccount, loadFromAccount, shareOnSocial } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<"wishlist" | "orders" | "photos">("wishlist");
  const [syncing, setSyncing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof mockTryOnPhotos[0] | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Load wishlist from account when user logs in
    if (user) {
      loadFromAccount(user.id);
    }
  }, [user, loadFromAccount]);

  const handleSyncWishlist = async () => {
    if (!user) return;
    setSyncing(true);
    await syncToAccount(user.id);
    setSyncing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) return null;

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <LocalCartDrawer />
        
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container-luxury">
            {/* Profile Header */}
            <ScrollReveal>
              <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-8 md:p-12 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-lg">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">{fullName}</h1>
                    <p className="text-white/60 text-sm mb-4">{user.email}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-sans tracking-wide rounded-full">
                        Premium Member
                      </span>
                      <span className="px-4 py-1.5 bg-white/10 text-white/80 text-xs font-sans tracking-wide rounded-full">
                        Member since Jan 2026
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSyncWishlist}
                      disabled={syncing}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
                    >
                      {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                      Sync Wishlist
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Stats */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StaggerItem>
                <div className="bg-white p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <Package className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="font-serif text-2xl text-neutral-900">{mockPurchases.length}</p>
                  <p className="text-sm text-neutral-500 font-sans">Orders</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <Heart className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="font-serif text-2xl text-neutral-900">{wishlistItems.length}</p>
                  <p className="text-sm text-neutral-500 font-sans">Wishlist</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <Camera className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="font-serif text-2xl text-neutral-900">{mockTryOnPhotos.length}</p>
                  <p className="text-sm text-neutral-500 font-sans">Try-On Photos</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <ShoppingBag className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="font-serif text-2xl text-neutral-900">
                    ${mockPurchases.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-500 font-sans">Total Spent</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Tab Navigation */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white shadow-lg mb-8">
                <div className="flex border-b">
                  {[
                    { id: "wishlist", label: "Synced Wishlist", icon: Heart },
                    { id: "orders", label: "Purchase History", icon: Package },
                    { id: "photos", label: "Try-On Photos", icon: Camera },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-sans transition-colors ${
                        activeTab === tab.id
                          ? "border-b-2 border-amber-500 text-amber-600 bg-amber-50/50"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "wishlist" && (
                      <motion.div
                        key="wishlist"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-serif text-xl">Your Synced Wishlist</h3>
                          <button
                            onClick={() => shareOnSocial("copy")}
                            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                          >
                            <Share2 className="w-4 h-4" />
                            Share Wishlist
                          </button>
                        </div>
                        
                        {wishlistItems.length === 0 ? (
                          <div className="text-center py-12">
                            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500">Your wishlist is empty</p>
                            <Link to="/jewellery" className="inline-block mt-4 text-amber-600 hover:underline">
                              Start browsing
                            </Link>
                          </div>
                        ) : (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {wishlistItems.map((item) => (
                              <motion.div
                                key={item.id}
                                className="flex items-center gap-4 p-4 border border-neutral-200 hover:border-amber-300 transition-colors"
                                whileHover={{ x: 4 }}
                              >
                                <div className="w-16 h-16 bg-amber-100 flex items-center justify-center">
                                  <Heart className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-neutral-900 truncate">{item.title}</p>
                                  <p className="text-sm text-neutral-500">{item.material}</p>
                                  <p className="text-amber-600 font-serif">${item.price}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "orders" && (
                      <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="font-serif text-xl mb-6">Purchase History</h3>
                        <div className="space-y-4">
                          {mockPurchases.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 border border-neutral-200 hover:border-amber-300 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full">
                                  <Package className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-neutral-900">{order.items.join(", ")}</p>
                                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {order.date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-serif text-lg text-neutral-900">${order.total}</p>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "photos" && (
                      <motion.div
                        key="photos"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="font-serif text-xl mb-6">Saved Try-On Photos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {mockTryOnPhotos.map((photo) => (
                            <motion.div
                              key={photo.id}
                              className="relative aspect-[3/4] bg-neutral-200 rounded-lg overflow-hidden cursor-pointer group"
                              onClick={() => setSelectedPhoto(photo)}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Camera className="w-12 h-12 text-neutral-400" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform">
                                <p className="text-sm font-medium truncate">{photo.productName}</p>
                                <p className="text-xs text-white/70">{photo.date}</p>
                              </div>
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </ScrollReveal>

            {/* Email Notifications Section */}
            <ScrollReveal delay={0.3}>
              <div className="bg-white p-6 md:p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-amber-500" />
                  <h3 className="font-serif text-xl">Email Notifications</h3>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-neutral-200 hover:bg-amber-50/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-neutral-900">Sale Alerts</p>
                      <p className="text-sm text-neutral-500">Get notified when wishlist items go on sale</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-neutral-200 hover:bg-amber-50/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-neutral-900">Back in Stock</p>
                      <p className="text-sm text-neutral-500">Get notified when out-of-stock items return</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-neutral-200 hover:bg-amber-50/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-neutral-900">New Arrivals</p>
                      <p className="text-sm text-neutral-500">Be the first to know about new products</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 accent-amber-500" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-neutral-200 hover:bg-amber-50/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-neutral-900">Order Updates</p>
                      <p className="text-sm text-neutral-500">Shipping and delivery notifications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500" />
                  </label>
                </div>
                <button className="mt-6 w-full py-3 bg-amber-500 text-black font-medium hover:bg-amber-600 transition-colors">
                  Save Preferences
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Profile;
