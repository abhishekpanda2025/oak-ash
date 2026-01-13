import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalCartDrawer } from "@/components/cart/LocalCartDrawer";
import { useLocalCartStore } from "@/stores/localCartStore";
import { SimilarProducts } from "@/components/products/SimilarProducts";
import { PaymentIcons } from "@/components/layout/PaymentIcons";
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronDown,
  Check,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import images
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productRing from "@/assets/product-ring.jpg";
import productBangle from "@/assets/product-bangle.jpg";
import { DemoProduct } from "@/data/demoProducts";

const getProductImage = (product: DemoProduct): string => {
  if (product.category === "necklaces") return productNecklace;
  if (product.category === "earrings") return productEarrings;
  if (product.category === "rings") return productRing;
  if (product.category === "bangles" || product.category === "bracelets") return productBangle;
  return productNecklace;
};

const shippingOptions = [
  { id: "standard", name: "Free International Standard Shipping", days: "7-10 working days", price: 0 },
  { id: "express", name: "Express International Shipping", days: "3-4 working days", price: 39 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useLocalCartStore();
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [emailOffers, setEmailOffers] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [useSameAddress, setUseSameAddress] = useState(true);
  
  const [formData, setFormData] = useState({
    country: "United States",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const subtotal = getTotalPrice();
  const shippingCost = shippingOptions.find(s => s.id === shippingMethod)?.price || 0;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed successfully!", {
      description: "This is a demo - connect Shopify for real checkout",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LocalCartDrawer />
        <main className="pt-32 pb-20">
          <div className="container-luxury text-center">
            <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
            <p className="text-neutral-500 mb-6">Add some beautiful pieces to get started</p>
            <Link to="/jewellery" className="text-amber-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LocalCartDrawer />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr,420px] gap-12">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Back Link */}
              <Link 
                to="/jewellery" 
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>

              {/* Express Checkout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-center text-neutral-500 mb-4">Express checkout</p>
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 max-w-[150px] h-12 bg-[#5A31F4] text-white rounded-md font-medium hover:bg-[#4926C4] transition-colors">
                    shop
                  </button>
                  <button className="flex-1 max-w-[150px] h-12 bg-[#FFC439] text-[#003087] rounded-md font-bold hover:bg-[#F0B72F] transition-colors">
                    PayPal
                  </button>
                  <button className="flex-1 max-w-[150px] h-12 bg-black text-white rounded-md font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1">
                    <span className="text-xl">G</span> Pay
                  </button>
                </div>
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-sm text-neutral-400">OR</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl">Contact</h2>
                    <Link to="/login" className="text-sm text-amber-600 hover:underline">
                      Sign in
                    </Link>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                    required
                  />
                  <label className="flex items-center gap-2 mt-3 text-sm text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailOffers}
                      onChange={(e) => setEmailOffers(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                    />
                    Email me with news and offers
                  </label>
                </motion.div>

                {/* Delivery */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-xl">Delivery</h2>
                  
                  {/* Country */}
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full h-12 px-4 border border-neutral-300 rounded-md appearance-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <label className="absolute left-4 -top-2.5 text-xs text-neutral-500 bg-white px-1">Country/Region</label>
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                      className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name"
                      className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>

                  {/* Address */}
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Address"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    required
                  />

                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />

                  {/* City & Postal */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="Postal code (optional)"
                      className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </motion.div>

                {/* Shipping Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-xl">Shipping method</h2>
                  <div className="space-y-2">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-colors ${
                          shippingMethod === option.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={shippingMethod === option.id}
                            onChange={() => setShippingMethod(option.id)}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                          />
                          <div>
                            <p className="text-sm font-medium">{option.name}</p>
                            <p className="text-xs text-neutral-500">{option.days}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {option.price === 0 ? "FREE" : `$${option.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-xl">Payment</h2>
                  <p className="text-sm text-neutral-500">All transactions are secure and encrypted.</p>

                  {/* Credit Card Option */}
                  <div className={`border rounded-md overflow-hidden ${paymentMethod === "card" ? "border-amber-500" : "border-neutral-200"}`}>
                    <label className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium">Credit card</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                        <div className="w-10 h-6 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
                          <div className="w-3 h-3 bg-[#EB001B] rounded-full -mr-1" />
                          <div className="w-3 h-3 bg-[#F79E1B] rounded-full" />
                        </div>
                        <div className="w-10 h-6 bg-[#016FD0] rounded flex items-center justify-center text-white text-[6px] font-bold">AMEX</div>
                      </div>
                    </label>
                    
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="p-4 bg-neutral-50 space-y-4"
                      >
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            placeholder="Card number"
                            className="w-full h-12 px-4 pr-10 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                          <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={formData.expiry}
                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                            placeholder="Expiration date (MM / YY)"
                            className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            placeholder="Security code"
                            className="h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          placeholder="Name on card"
                          className="w-full h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                        
                        <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useSameAddress}
                            onChange={(e) => setUseSameAddress(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                          />
                          Use shipping address as billing address
                        </label>
                      </motion.div>
                    )}
                  </div>

                  {/* PayPal Option */}
                  <label className={`flex items-center justify-between p-4 border rounded-md cursor-pointer ${paymentMethod === "paypal" ? "border-amber-500 bg-amber-50" : "border-neutral-200"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                    <div className="text-[#003087] font-bold text-lg">
                      Pay<span className="text-[#009CDE]">Pal</span>
                    </div>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full h-14 bg-[#1990C6] hover:bg-[#1580B0] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Pay now
                </motion.button>

                {/* Footer Links */}
                <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
                  <a href="#" className="hover:text-amber-600 underline">Refund policy</a>
                  <a href="#" className="hover:text-amber-600 underline">Shipping</a>
                  <a href="#" className="hover:text-amber-600 underline">Privacy policy</a>
                  <a href="#" className="hover:text-amber-600 underline">Terms of service</a>
                  <a href="#" className="hover:text-amber-600 underline">Contact</a>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-neutral-50 p-6 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-neutral-500">{item.product.material}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 h-12 px-4 border border-neutral-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <button className="px-6 h-12 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-100 transition-colors">
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 flex items-center gap-1">
                      Shipping
                      <span className="text-neutral-400">(?)</span>
                    </span>
                    <span className="font-medium">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <span className="font-serif text-lg">Total</span>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 mr-2">USD</span>
                      <span className="font-serif text-2xl">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Similar Products */}
                <SimilarProducts title="Complete Your Look" />

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="w-4 h-4" />
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Truck className="w-4 h-4" />
                    Free Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;