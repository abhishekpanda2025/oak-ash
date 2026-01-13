import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  company: [
    { label: "About OAK & ASH", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Search", href: "/search" },
    { label: "Contact us", href: "/contact" },
  ],
  support: [
    { label: "Refund Policy", href: "/refunds" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  business: [
    { label: "Want to become a reseller?", href: "/b2b" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-ivory">
      {/* Newsletter Section */}
      <div className="border-b border-ivory/10">
        <div className="container-luxury py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] tracking-luxury uppercase text-gold mb-4 font-sans font-light">
                Stay Connected
              </p>
              <h3 className="font-serif text-3xl md:text-4xl mb-5 leading-tight">
                Join the OAK & ASH Circle
              </h3>
              <p className="text-ivory/60 mb-10 font-sans font-light text-sm max-w-md mx-auto leading-relaxed">
                Be the first to discover new collections, exclusive offers, and the stories behind our craftsmanship.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-b border-ivory/30 px-0 py-3 text-sm font-sans font-light placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
                  required
                />
                <motion.button
                  type="submit"
                  className="btn-gold-shimmer text-charcoal px-8 py-3.5 text-[11px] tracking-wide-luxury uppercase font-sans font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <h2 className="font-serif text-2xl mb-5">
              <span>OAK</span>
              <span className="text-gold mx-1">&</span>
              <span>ASH</span>
            </h2>
            <p className="text-ivory/50 text-sm font-sans font-light leading-relaxed mb-8">
              Inspired by the strength of oak and the grace of ash — jewelry crafted with passion, worn forever.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 font-sans font-light text-ivory/70">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-ivory/50 text-sm font-sans font-light hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Links */}
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 font-sans font-light text-ivory/70">
              Customer Support
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-ivory/50 text-sm font-sans font-light hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* B2B Links */}
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 font-sans font-light text-ivory/70">
              Retailer & B2B
            </h4>
            <ul className="space-y-4">
              {footerLinks.business.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-ivory/50 text-sm font-sans font-light hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 font-sans font-light text-ivory/70">
              Follow Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 text-sm font-sans font-light hover:text-gold transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 text-sm font-sans font-light hover:text-gold transition-colors duration-300"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-ivory/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-ivory/40 text-xs font-sans font-light">
              © 2024 OAK & ASH. All rights reserved.
            </p>
            
            {/* Currency & Payment */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Currency Selector */}
              <select className="bg-transparent text-ivory/50 text-xs font-sans border border-ivory/20 px-3 py-2 focus:outline-none focus:border-gold cursor-pointer">
                <option value="usd">USD $</option>
                <option value="eur">EUR €</option>
                <option value="gbp">GBP £</option>
              </select>
              
              {/* Payment Icons */}
              <div className="flex items-center gap-2">
                <span className="text-ivory/40 text-xs font-sans">We accept:</span>
                <div className="flex gap-2 text-[10px] text-ivory/50">
                  <span className="px-2 py-1 border border-ivory/15">Visa</span>
                  <span className="px-2 py-1 border border-ivory/15">Mastercard</span>
                  <span className="px-2 py-1 border border-ivory/15">Amex</span>
                  <span className="px-2 py-1 border border-ivory/15">PayPal</span>
                  <span className="px-2 py-1 border border-ivory/15">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};