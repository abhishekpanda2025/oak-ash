import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Gem, Truck, RefreshCw, Shield } from "lucide-react";

const promises = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Each piece crafted with the finest materials and meticulous attention to detail.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders over $150 with secure packaging.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns if you're not completely satisfied.",
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Your jewelry is protected with our comprehensive lifetime warranty.",
  },
];

export const PromiseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-cream-dark">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
            Our Promise
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium">
            The OAK & ASH Experience
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((promise, index) => (
            <motion.div
              key={promise.title}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 border border-primary/30 mb-6"
                whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary))" }}
              >
                <promise.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="font-serif text-lg mb-2">{promise.title}</h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {promise.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
