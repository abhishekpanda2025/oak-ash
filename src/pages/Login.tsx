import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      navigate("/account");
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        
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
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-neutral-500 font-sans">or</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full h-12 border border-neutral-200 font-sans text-sm text-neutral-700 flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </div>

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
