import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/new-in" },
    { label: "Earrings", href: "/jewellery/earrings" },
    { label: "Rings", href: "/jewellery/rings" },
    { label: "Necklaces", href: "/jewellery/necklaces" },
    { label: "Bracelets", href: "/jewellery/bracelets" },
  ],
  collections: [
    { label: "Gold Collection", href: "/collections/gold" },
    { label: "Silver Collection", href: "/collections/silver" },
    { label: "Pearl Collection", href: "/collections/pearl" },
    { label: "Stones Collection", href: "/collections/stones" },
  ],
  help: [
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds", href: "/refunds" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container-luxury py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">
              Join the OAK & ASH Circle
            </h3>
            <p className="text-background/70 mb-8 font-sans text-sm">
              Be the first to discover new collections, exclusive offers, and the stories behind our craftsmanship.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-background/30 px-4 py-3 text-sm font-sans placeholder:text-background/50 focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-3 text-sm tracking-luxury uppercase font-sans hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <h2 className="font-serif text-xl font-semibold mb-4">OAK & ASH</h2>
            <p className="text-background/70 text-sm font-sans leading-relaxed mb-6">
              Inspired by the strength of oak and the grace of ash — jewelry crafted with passion, worn forever.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-background/30 hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-background/30 hover:border-primary hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-background/30 hover:border-primary hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs tracking-luxury uppercase mb-4 font-sans">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 text-sm font-sans hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections Links */}
          <div>
            <h4 className="text-xs tracking-luxury uppercase mb-4 font-sans">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 text-sm font-sans hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-xs tracking-luxury uppercase mb-4 font-sans">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 text-sm font-sans hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-xs tracking-luxury uppercase mb-4 font-sans">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 text-sm font-sans hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Copyright */}
        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-xs font-sans">
            © 2024 OAK & ASH. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-background/50 text-xs font-sans">We accept:</span>
            <div className="flex gap-2 text-xs text-background/70">
              <span className="px-2 py-1 border border-background/20 rounded-sm">Visa</span>
              <span className="px-2 py-1 border border-background/20 rounded-sm">Mastercard</span>
              <span className="px-2 py-1 border border-background/20 rounded-sm">Amex</span>
              <span className="px-2 py-1 border border-background/20 rounded-sm">PayPal</span>
              <span className="px-2 py-1 border border-background/20 rounded-sm">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
