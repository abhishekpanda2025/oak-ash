import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error("Sign in failed", {
        description: error.message,
      });
    } else {
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      navigate("/account");
    }
    
    setIsLoading(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <LocalCartDrawer />
        
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container-luxury">
            <div className="max-w-md mx-auto">
              <ScrollReveal className="text-center mb-10">
                <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-3">
                  Welcome Back
                </h1>
                <p className="text-neutral-600 font-sans font-light">
                  Sign in to access your account
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <motion.form
                  onSubmit={handleSubmit}
                  className="bg-white p-8 md:p-10 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Email */}
                  <div className="mb-6">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-6">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-12 pr-12 py-3 border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-neutral-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-sans text-neutral-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-sans text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-neutral-900 text-white font-sans text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Sign Up Link */}
                  <p className="text-center mt-8 text-sm text-neutral-600 font-sans">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      Create one
                    </Link>
                  </p>
                </motion.form>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Login;