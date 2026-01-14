import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Package, Truck, ShoppingBag, HelpCircle, Sparkles } from "lucide-react";
import { demoProducts, DemoProduct } from "@/data/demoProducts";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: DemoProduct[];
  orderInfo?: {
    orderId: string;
    status: string;
    estimatedDelivery: string;
    items: string[];
  };
};

// Quick action buttons
const quickActions = [
  { label: "Browse Products", icon: ShoppingBag, query: "Show me your best-selling products" },
  { label: "Track Order", icon: Truck, query: "I want to track my order" },
  { label: "Delivery Info", icon: Package, query: "What are your delivery options?" },
  { label: "Help", icon: HelpCircle, query: "What can you help me with?" },
];

// Simulated order database
const mockOrders: Record<string, any> = {
  "OA-2024-001": {
    status: "Shipped",
    estimatedDelivery: "January 16, 2026",
    items: ["Aurélie Gold Pendant Necklace", "Seraphine Crystal Teardrop Earrings"],
    trackingNumber: "1Z999AA10123456784",
  },
  "OA-2024-002": {
    status: "Processing",
    estimatedDelivery: "January 20, 2026",
    items: ["Monaco Aviator Sunglasses"],
    trackingNumber: null,
  },
  "OA-2024-003": {
    status: "Delivered",
    estimatedDelivery: "January 10, 2026",
    items: ["Heritage Classic Gold Bangle", "Eternal Solitaire Diamond Ring"],
    trackingNumber: "1Z999AA10123456785",
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oak-ash-chatbot`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: { role: string; content: string }[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Too many requests. Please try again in a moment.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable.");
      }
      throw new Error("Failed to get response");
    }

    const reader = resp.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let textBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });
      
      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}

// Local response handler for quick queries
function getLocalResponse(query: string): { content: string; products?: DemoProduct[]; orderInfo?: any } | null {
  const lowerQuery = query.toLowerCase();

  // Order tracking
  const orderIdMatch = query.match(/OA-\d{4}-\d{3}/i);
  if (orderIdMatch || lowerQuery.includes("track") || lowerQuery.includes("order status")) {
    if (orderIdMatch) {
      const orderId = orderIdMatch[0].toUpperCase();
      const order = mockOrders[orderId];
      if (order) {
        return {
          content: `📦 **Order ${orderId}**\n\n**Status:** ${order.status}\n**Estimated Delivery:** ${order.estimatedDelivery}\n**Items:** ${order.items.join(", ")}\n${order.trackingNumber ? `**Tracking:** ${order.trackingNumber}` : "Tracking number will be available once shipped."}`,
          orderInfo: { orderId, ...order },
        };
      }
      return {
        content: `I couldn't find an order with ID **${orderId}**. Please check the order ID and try again. Valid format: OA-YYYY-XXX (e.g., OA-2024-001)`,
      };
    }
    return {
      content: "To track your order, please provide your order ID in the format **OA-YYYY-XXX** (e.g., OA-2024-001). You can find this in your confirmation email.",
    };
  }

  // Product search
  if (lowerQuery.includes("best") || lowerQuery.includes("popular") || lowerQuery.includes("selling")) {
    const bestsellers = demoProducts.filter(p => p.isBestseller).slice(0, 4);
    return {
      content: "Here are our most popular items that customers love! ✨",
      products: bestsellers,
    };
  }

  if (lowerQuery.includes("new") || lowerQuery.includes("arrival") || lowerQuery.includes("latest")) {
    const newProducts = demoProducts.filter(p => p.isNew).slice(0, 4);
    return {
      content: "Check out our latest arrivals, fresh from our artisan studios! 🌟",
      products: newProducts,
    };
  }

  if (lowerQuery.includes("eyewear") || lowerQuery.includes("glasses") || lowerQuery.includes("sunglasses")) {
    const eyewear = demoProducts.filter(p => p.category === "eyewear").slice(0, 4);
    return {
      content: "Here's our exclusive eyewear collection - luxury frames crafted for distinction. 👓",
      products: eyewear,
    };
  }

  if (lowerQuery.includes("necklace") || lowerQuery.includes("pendant")) {
    const necklaces = demoProducts.filter(p => p.category === "necklaces").slice(0, 4);
    return {
      content: "Discover our stunning necklace collection! 💎",
      products: necklaces,
    };
  }

  if (lowerQuery.includes("earring")) {
    const earrings = demoProducts.filter(p => p.category === "earrings").slice(0, 4);
    return {
      content: "Here are our elegant earrings - perfect for any occasion! ✨",
      products: earrings,
    };
  }

  if (lowerQuery.includes("ring")) {
    const rings = demoProducts.filter(p => p.category === "rings").slice(0, 4);
    return {
      content: "Explore our beautiful ring collection! 💍",
      products: rings,
    };
  }

  // Stock check
  if (lowerQuery.includes("stock") || lowerQuery.includes("available")) {
    return {
      content: "All items displayed on our website are currently **in stock** and ready to ship! If you're looking for a specific item, just let me know the name and I'll check availability for you.",
    };
  }

  // Delivery info
  if (lowerQuery.includes("delivery") || lowerQuery.includes("shipping")) {
    return {
      content: "🚚 **Delivery Options:**\n\n• **Standard Delivery:** 5-7 business days (Free on orders over £100)\n• **Express Delivery:** 2-3 business days (£9.99)\n• **Next Day Delivery:** Order before 2PM (£14.99)\n• **International:** 7-14 business days (varies by location)\n\nAll orders are beautifully gift-wrapped and come with a certificate of authenticity!",
    };
  }

  // Returns
  if (lowerQuery.includes("return") || lowerQuery.includes("refund") || lowerQuery.includes("exchange")) {
    return {
      content: "↩️ **Returns & Exchanges:**\n\n• 30-day hassle-free returns\n• Free returns on all UK orders\n• Full refund within 5-7 business days\n• Easy exchanges for different sizes\n\nSimply contact us with your order number and we'll send you a prepaid return label!",
    };
  }

  // Help
  if (lowerQuery.includes("help") || lowerQuery.includes("what can you")) {
    return {
      content: "I'm your OAK & ASH personal shopping assistant! Here's what I can help with:\n\n🛍️ **Browse Products** - Jewelry, eyewear, new arrivals\n📦 **Track Orders** - Check status with your order ID\n🚚 **Delivery Info** - Shipping options & times\n↩️ **Returns** - Easy return & exchange process\n💎 **Stock Check** - Product availability\n💬 **Recommendations** - Personalized suggestions\n\nJust ask me anything!",
    };
  }

  return null;
}

export const OakAshChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to OAK & ASH! ✨ I'm your personal shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Try local response first
    const localResponse = getLocalResponse(text);
    
    if (localResponse) {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localResponse.content,
          products: localResponse.products,
          orderInfo: localResponse.orderInfo,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Use AI for complex queries
    let assistantContent = "";
    
    try {
      await streamChat({
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: text },
        ],
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.id !== "welcome") {
              return prev.map((m, i) => 
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { id: Date.now().toString(), role: "assistant", content: assistantContent }];
          });
        },
        onDone: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm here to help! You can ask me about our products, track orders, delivery options, or get personalized recommendations. What would you like to know?",
      };
      setMessages(prev => [...prev, fallbackMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-600 text-black rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-[10px] text-white font-bold">1</span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto z-50 w-full md:w-[400px] h-[85vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">OAK & ASH</h3>
                  <p className="text-xs opacity-80">Your Personal Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-amber-500 text-black rounded-2xl rounded-br-sm px-4 py-2"
                        : "bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Product Cards */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <a
                            key={product.id}
                            href={`/demo/${product.handle}`}
                            className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-amber-50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-neutral-900 truncate">{product.title}</p>
                              <p className="text-xs text-amber-600">${product.price}</p>
                            </div>
                            {product.isNew && (
                              <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded">NEW</span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Order Info */}
                    {message.orderInfo && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-600 mb-2">
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-medium">Order Details</span>
                        </div>
                        <div className="text-xs space-y-1 text-neutral-700">
                          <p><span className="font-medium">Status:</span> {message.orderInfo.status}</p>
                          <p><span className="font-medium">Delivery:</span> {message.orderInfo.estimatedDelivery}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-black" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-white border-t border-neutral-100">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-amber-100 rounded-full text-xs text-neutral-700 transition-colors"
                    >
                      <action.icon className="w-3.5 h-3.5" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-neutral-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products, orders, delivery..."
                  className="flex-1 px-4 py-3 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
