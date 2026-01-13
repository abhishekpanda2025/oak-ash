import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "New York, USA",
    rating: 5,
    text: "The craftsmanship is absolutely stunning. My gold necklace from OAK & ASH has become my signature piece. The attention to detail is remarkable.",
  },
  {
    name: "Emma Thompson",
    location: "London, UK",
    rating: 5,
    text: "I've never felt more elegant. The earrings I purchased are lightweight yet look incredibly luxurious. Customer service was exceptional too.",
  },
  {
    name: "Isabella Romano",
    location: "Milan, Italy",
    rating: 5,
    text: "As someone who appreciates fine jewelry, I'm impressed by the quality and design. Each piece tells a story of true artisanship.",
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-neutral-800">
            What Our Clients Say
          </h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            {/* Navigation */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 text-neutral-400 hover:text-amber-600 transition-colors hidden md:block"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 text-neutral-400 hover:text-amber-600 transition-colors hidden md:block"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonial Content */}
            <motion.div
              key={activeIndex}
              className="text-center px-4 md:px-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl italic text-neutral-700 mb-8 leading-relaxed">
                "{testimonials[activeIndex].text}"
              </blockquote>

              {/* Author */}
              <div>
                <p className="font-serif text-lg font-medium text-neutral-800">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-sm text-neutral-500 font-sans">
                  {testimonials[activeIndex].location}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-amber-500 w-8"
                    : "bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
