import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Package, Heart, MapPin, CreditCard, 
  LogOut, ChevronRight, Edit2, Bell, Shield, Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { icon: Package, label: "My Orders", href: "/account/orders", description: "Track and manage your orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Your saved items" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses", description: "Manage delivery addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/account/payment", description: "Saved payment options" },
  { icon: Bell, label: "Notifications", href: "/account/notifications", description: "Email and push preferences" },
  { icon: Shield, label: "Privacy & Security", href: "/account/security", description: "Password and account security" },
];

const Account = () => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out", {
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user's name from metadata or email
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const firstName = fullName.split(" ")[0];
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <LocalCartDrawer />
        
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <ScrollReveal>
                  <div className="bg-white p-6 shadow-lg mb-6">
                    {/* User Profile */}
                    <div className="text-center mb-6 pb-6 border-b border-neutral-200">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-serif text-2xl">
                        {initials}
                      </div>
                      <h2 className="font-serif text-xl text-neutral-900">
                        {fullName}
                      </h2>
                      <p className="text-sm text-neutral-500 font-sans">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-sans tracking-wide">
                        Member
                      </span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-amber-50 hover:text-amber-600 transition-colors group"
                        >
                          <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-amber-500" />
                          <span className="font-sans text-sm">{item.label}</span>
                          <ChevronRight className="w-4 h-4 ml-auto text-neutral-300 group-hover:text-amber-400" />
                        </Link>
                      ))}
                    </nav>

                    {/* Logout */}
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-sans text-sm">Sign Out</span>
                    </button>
                  </div>
                </ScrollReveal>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-3">
                <ScrollReveal delay={0.1}>
                  {/* Welcome Header */}
                  <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-8 mb-8 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-amber-400 font-sans text-sm mb-1">Welcome back,</p>
                        <h1 className="font-serif text-3xl mb-2">{firstName}</h1>
                        <p className="text-neutral-400 font-sans font-light text-sm">
                          {user.email}
                        </p>
                      </div>
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2 border border-white/20 text-sm font-sans hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </motion.button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Quick Stats */}
                <StaggerContainer className="grid sm:grid-cols-3 gap-4 mb-8">
                  <StaggerItem>
                    <div className="bg-white p-6 shadow-lg text-center">
                      <Package className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <p className="font-serif text-2xl text-neutral-900">0</p>
                      <p className="text-sm text-neutral-500 font-sans">Total Orders</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="bg-white p-6 shadow-lg text-center">
                      <Heart className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <p className="font-serif text-2xl text-neutral-900">{wishlistItems.length}</p>
                      <p className="text-sm text-neutral-500 font-sans">Wishlist Items</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="bg-white p-6 shadow-lg text-center">
                      <CreditCard className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <p className="font-serif text-2xl text-neutral-900">$0</p>
                      <p className="text-sm text-neutral-500 font-sans">Total Spent</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                {/* Account Settings */}
                <ScrollReveal delay={0.2}>
                  <div className="bg-white p-6 md:p-8 shadow-lg">
                    <h3 className="font-serif text-xl text-neutral-900 mb-6">Account Settings</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {menuItems.slice(0, 4).map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-start gap-4 p-4 border border-neutral-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
                        >
                          <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-sans text-sm font-medium text-neutral-900 group-hover:text-amber-600 transition-colors">
                              {item.label}
                            </p>
                            <p className="text-xs text-neutral-500 font-sans">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </main>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Account;