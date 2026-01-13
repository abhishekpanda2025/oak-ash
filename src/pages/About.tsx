import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { Heart, Gem, Award, Users, Sparkles, Shield } from "lucide-react";
import heroImage from "@/assets/hero-jewelry.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import modelJewelry from "@/assets/model-jewelry.jpg";

const values = [
  {
    icon: Gem,
    title: "Exceptional Quality",
    description: "Every piece is crafted with the finest materials and meticulous attention to detail.",
  },
  {
    icon: Heart,
    title: "Timeless Design",
    description: "We create jewelry that transcends trends, becoming cherished heirlooms for generations.",
  },
  {
    icon: Shield,
    title: "Ethical Sourcing",
    description: "All our materials are responsibly sourced with complete transparency and care.",
  },
  {
    icon: Sparkles,
    title: "Artisan Craftsmanship",
    description: "Master jewelers bring decades of expertise to every creation we offer.",
  },
];

const team = [
  {
    name: "Victoria Ashford",
    role: "Founder & Creative Director",
    image: modelJewelry,
    bio: "With over 20 years in luxury jewelry, Victoria founded OAK & ASH to blend timeless elegance with modern sensibility.",
  },
  {
    name: "Sebastian Oak",
    role: "Head of Design",
    image: craftsmanshipImage,
    bio: "Sebastian brings a unique perspective to jewelry design, drawing inspiration from architecture and nature.",
  },
  {
    name: "Isabella Chen",
    role: "Master Goldsmith",
    image: heroImage,
    bio: "A third-generation goldsmith, Isabella ensures every piece meets our exacting standards of excellence.",
  },
];

const milestones = [
  { year: "2015", event: "OAK & ASH founded in London" },
  { year: "2017", event: "First flagship store opens" },
  { year: "2019", event: "Launched sustainable collections" },
  { year: "2021", event: "Expanded to international markets" },
  { year: "2023", event: "Celebrated 10,000+ happy customers" },
  { year: "2026", event: "Introducing our new heritage collection" },
];

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={heroImage}
              alt="Our Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </motion.div>
          
          <div className="relative z-10 text-center text-white container-luxury">
            <motion.p
              className="text-xs tracking-luxury uppercase mb-4 text-amber-300 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Our Story
            </motion.p>
            <motion.h1
              className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              OAK <span className="text-amber-400">&amp;</span> ASH
            </motion.h1>
            <motion.p
              className="font-sans font-light text-lg md:text-xl max-w-2xl mx-auto text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Where timeless elegance meets modern craftsmanship
            </motion.p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-20 md:py-32 bg-neutral-50">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <div className="relative">
                  <img
                    src={craftsmanshipImage}
                    alt="Our craftsmanship"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-amber-500/30" />
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="right" delay={0.2}>
                <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
                  Our Heritage
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 leading-tight">
                  Inspired by Nature,
                  <br />
                  <span className="italic text-amber-600">Crafted with Passion</span>
                </h2>
                <div className="space-y-4 text-neutral-600 font-sans font-light leading-relaxed">
                  <p>
                    OAK & ASH was born from a profound appreciation for nature's enduring beauty. 
                    Our name draws from two of Earth's most magnificent trees – the mighty oak, 
                    symbolizing strength and longevity, and the graceful ash, representing 
                    adaptability and elegance.
                  </p>
                  <p>
                    Founded in 2015 in the heart of London, we set out with a singular vision: 
                    to create jewelry that would be treasured for generations. Every piece in 
                    our collection tells a story – of skilled artisans, ethically sourced 
                    materials, and designs that transcend fleeting trends.
                  </p>
                  <p>
                    Today, OAK & ASH stands as a testament to what happens when passion meets 
                    precision. Our jewelry doesn't just adorn; it becomes part of life's most 
                    precious moments.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 md:py-32 bg-neutral-900 text-white">
          <div className="container-luxury text-center">
            <ScrollReveal>
              <p className="text-xs tracking-luxury uppercase text-amber-400 mb-6 font-sans">
                Our Mission
              </p>
              <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl leading-relaxed max-w-4xl mx-auto mb-8">
                "To create jewelry that celebrates life's meaningful moments, 
                <span className="italic text-amber-400"> crafted with integrity</span>, 
                worn with pride, and passed down with love."
              </blockquote>
              <cite className="text-amber-400 font-sans text-sm tracking-wide not-italic">
                — Victoria Ashford, Founder
              </cite>
            </ScrollReveal>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-32">
          <div className="container-luxury">
            <ScrollReveal className="text-center mb-16">
              <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900">
                Our Core Values
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    className="text-center p-8 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-500"
                    whileHover={{ y: -10 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-serif text-xl text-neutral-900 mb-3">{value.title}</h3>
                    <p className="text-neutral-600 font-sans font-light text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 md:py-32 bg-neutral-50">
          <div className="container-luxury">
            <ScrollReveal className="text-center mb-16">
              <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
                The People Behind the Craft
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900">
                Meet Our Team
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid md:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    className="group"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-serif text-xl text-neutral-900 mb-1">{member.name}</h3>
                    <p className="text-amber-600 font-sans text-sm mb-3">{member.role}</p>
                    <p className="text-neutral-600 font-sans font-light text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 md:py-32">
          <div className="container-luxury">
            <ScrollReveal className="text-center mb-16">
              <p className="text-xs tracking-luxury uppercase text-amber-600 mb-4 font-sans">
                Our Journey
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900">
                Milestones
              </h2>
            </ScrollReveal>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-amber-200" />

              {milestones.map((milestone, index) => (
                <ScrollReveal 
                  key={index} 
                  delay={index * 0.1}
                  direction={index % 2 === 0 ? "left" : "right"}
                >
                  <div className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}>
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-amber-500 rounded-full -translate-x-1/2 z-10" />
                    
                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                    }`}>
                      <span className="font-serif text-2xl text-amber-600">{milestone.year}</span>
                      <p className="text-neutral-700 font-sans font-light mt-1">{milestone.event}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-neutral-900 text-white">
          <div className="container-luxury text-center">
            <ScrollReveal>
              <Award className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Experience the OAK &amp; ASH Difference
              </h2>
              <p className="text-neutral-400 font-sans font-light max-w-xl mx-auto mb-10">
                Discover jewelry that tells your story. Each piece is a testament to 
                craftsmanship, quality, and timeless design.
              </p>
              <motion.a
                href="/jewellery"
                className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 text-neutral-900 font-sans text-sm tracking-wide uppercase hover:bg-amber-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-4 h-4" />
                Shop Our Collection
              </motion.a>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
