import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { PageTransition, ScrollReveal } from "@/components/animations/PageTransition";
import { Mail, Clock, Send, CheckCircle, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const businessHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM (EST)" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM (EST)" },
  { day: "Sunday", hours: "Closed" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully! We'll get back to you soon.");
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />
        <LocalCartDrawer />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="container-luxury relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-luxury uppercase text-amber-400 mb-4 font-sans">
                Contact Us
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-neutral-300 font-sans font-light max-w-xl mx-auto">
                Have any questions or interested to become a reseller or distributor?
                Don't hesitate to send us an email.
              </p>
            </motion.div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-amber-500/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-amber-500/30" />
        </section>

        {/* Main Content */}
        <section className="py-20 md:py-32">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Contact Information */}
              <ScrollReveal direction="left">
                <div>
                  <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
                    Reach Out
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-8">
                    We'd Love to Hear From You
                  </h2>

                  {/* Email Card */}
                  <motion.div
                    className="bg-neutral-50 p-8 mb-8"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-neutral-900 mb-2">General Inquiry</h3>
                        <a
                          href="mailto:info@oakaash.com"
                          className="text-amber-600 hover:text-amber-700 font-sans text-lg transition-colors"
                        >
                          info@oakaash.com
                        </a>
                        <p className="text-neutral-500 font-sans font-light text-sm mt-2">
                          We are looking forward to hear from you!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Business Hours */}
                  <motion.div
                    className="bg-neutral-50 p-8"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-neutral-900 mb-4">Business Hours</h3>
                        <ul className="space-y-3">
                          {businessHours.map((schedule, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center text-sm font-sans"
                            >
                              <span className="text-neutral-600 font-light">{schedule.day}</span>
                              <span className="text-neutral-900">{schedule.hours}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Become a Partner */}
                  <div className="mt-12 p-8 border border-amber-200 bg-amber-50/50">
                    <h3 className="font-serif text-xl text-neutral-900 mb-3">
                      Become a Reseller or Distributor
                    </h3>
                    <p className="text-neutral-600 font-sans font-light text-sm mb-4">
                      Interested in partnering with OAK & ASH? We're always looking for passionate 
                      partners to help bring our premium jewelry and eyewear to more customers worldwide.
                    </p>
                    <p className="text-amber-700 font-sans text-sm">
                      Contact us at <a href="mailto:info@oakaash.com" className="underline hover:text-amber-800">info@oakaash.com</a> with your business details.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact Form */}
              <ScrollReveal direction="right" delay={0.2}>
                <div className="bg-neutral-50 p-8 md:p-12">
                  <h3 className="font-serif text-2xl text-neutral-900 mb-6">Send us a Message</h3>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="font-serif text-2xl text-neutral-900 mb-2">Thank You!</h4>
                      <p className="text-neutral-600 font-sans font-light">
                        Your message has been sent successfully.
                        <br />
                        We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-sans text-neutral-700 mb-2"
                          >
                            Your Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="bg-white border-neutral-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-sans text-neutral-700 mb-2"
                          >
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="bg-white border-neutral-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-sans text-neutral-700 mb-2"
                        >
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          className="bg-white border-neutral-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-sans text-neutral-700 mb-2"
                        >
                          Your Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          className="bg-white border-neutral-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-neutral-900 hover:bg-amber-600 text-white py-6 text-sm tracking-wide uppercase font-sans transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="container-luxury">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
