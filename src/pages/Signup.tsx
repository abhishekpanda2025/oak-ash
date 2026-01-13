import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created!", {
        description: "Welcome to OAK & ASH. Please check your email to verify your account.",
      });
      navigate("/login");
    }, 1500);
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (password.length < 10) return { strength: 2, label: "Medium" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 4, label: "Strong" };
    }
    return { strength: 3, label: "Good" };
  };

  const { strength, label } = passwordStrength();

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container-luxury">
            <div className="max-w-md mx-auto">
              <ScrollReveal className="text-center mb-10">
                <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-3">
                  Create Account
                </h1>
                <p className="text-neutral-600 font-sans font-light">
                  Join the OAK &amp; ASH family
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
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Jane"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={6}
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
                    
                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                strength >= level
                                  ? strength <= 1
                                    ? "bg-red-500"
                                    : strength === 2
                                    ? "bg-yellow-500"
                                    : strength === 3
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                  : "bg-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-sans ${
                          strength <= 1 ? "text-red-500" : 
                          strength === 2 ? "text-yellow-600" : 
                          strength === 3 ? "text-blue-500" : "text-green-500"
                        }`}>
                          {label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 mb-2 block font-sans">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className={`w-full pl-12 pr-12 py-3 border text-neutral-900 font-sans font-light placeholder:text-neutral-400 focus:outline-none transition-colors ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : formData.confirmPassword && formData.password === formData.confirmPassword
                            ? "border-green-300 focus:border-green-500"
                            : "border-neutral-200 focus:border-amber-500"
                        }`}
                      />
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-8">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 border-neutral-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-sans text-neutral-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-amber-600 hover:text-amber-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-amber-600 hover:text-amber-700">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
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
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Sign In Link */}
                  <p className="text-center mt-8 text-sm text-neutral-600 font-sans">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      Sign in
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

export default Signup;
