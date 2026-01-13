import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    name: "Gold",
    color: "bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400",
    href: "/collections/gold",
  },
  {
    name: "Silver",
    color: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400",
    href: "/collections/silver",
  },
  {
    name: "Two Tone",
    color: "bg-gradient-to-br from-amber-200 via-gray-200 to-amber-300",
    href: "/collections/two-tone",
  },
  {
    name: "Stones",
    color: "bg-gradient-to-br from-emerald-200 via-rose-200 to-purple-200",
    href: "/collections/stones",
  },
  {
    name: "Pearl",
    color: "bg-gradient-to-br from-rose-100 via-white to-pink-100",
    href: "/collections/pearl",
  },
];

export const CollectionShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-foreground text-background">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs tracking-luxury uppercase text-primary mb-4 font-sans">
              Collections by Color
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium">
              Find Your Perfect Shade
            </h2>
          </div>
          <Link
            to="/jewellery"
            className="inline-flex items-center gap-2 text-sm tracking-luxury uppercase font-sans mt-4 md:mt-0 text-background/70 hover:text-primary transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Collection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={collection.href} className="group block">
                <div className="relative overflow-hidden aspect-square mb-4">
                  <motion.div
                    className={`w-full h-full ${collection.color}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-center group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
