// Demo Products for OAK & ASH
// These will be replaced with Shopify Storefront API data once approved

export interface DemoProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string[];
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  material: string;
  care: string;
}

export const demoProducts: DemoProduct[] = [
  // Featured Products (as requested)
  {
    id: "1",
    handle: "aurelie-gold-pendant-necklace",
    title: "Aurélie Gold Pendant Necklace",
    description: "A stunning 18k gold vermeil pendant featuring an intricate floral design, suspended from a delicate cable chain. Perfect for adding elegance to any ensemble.",
    price: 189,
    category: "necklaces",
    collection: ["gold", "new-in"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isNew: true,
    material: "18k Gold Vermeil",
    care: "Avoid contact with water and perfume. Store in a jewelry box.",
  },
  {
    id: "2",
    handle: "seraphine-crystal-teardrop-earrings",
    title: "Seraphine Crystal Teardrop Earrings",
    description: "Exquisite teardrop earrings featuring hand-set Swarovski crystals that catch light beautifully. A timeless piece for special occasions.",
    price: 128,
    category: "earrings",
    collection: ["stones", "new-in"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isNew: true,
    material: "Sterling Silver, Swarovski Crystals",
    care: "Clean with a soft cloth. Avoid harsh chemicals.",
  },
  {
    id: "3",
    handle: "eternal-solitaire-diamond-ring",
    title: "Eternal Solitaire Diamond Ring",
    description: "A breathtaking solitaire ring featuring a brilliant-cut cubic zirconia stone set in polished sterling silver. Symbol of everlasting love.",
    price: 245,
    category: "rings",
    collection: ["silver", "stones"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isBestseller: true,
    material: "Sterling Silver, Cubic Zirconia",
    care: "Polish regularly with a jewelry cloth.",
  },
  {
    id: "4",
    handle: "heritage-classic-gold-bangle",
    title: "Heritage Classic Gold Bangle",
    description: "A luxurious hammered gold bangle with a subtle texture that catches light beautifully. Timeless elegance for everyday wear.",
    price: 156,
    category: "bangles",
    collection: ["gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "18k Gold Vermeil",
    care: "Store separately to avoid scratches.",
  },
  // Additional Products
  {
    id: "5",
    handle: "luna-crescent-pendant",
    title: "Luna Crescent Pendant",
    description: "Delicate crescent moon pendant in polished silver, symbolizing new beginnings and dreams.",
    price: 98,
    category: "necklaces",
    collection: ["silver", "new-in"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isNew: true,
    material: "Sterling Silver",
    care: "Keep away from moisture.",
  },
  {
    id: "6",
    handle: "ophelia-pearl-drop-earrings",
    title: "Ophelia Pearl Drop Earrings",
    description: "Freshwater pearl drops suspended from elegant gold hooks. Classic sophistication meets modern design.",
    price: 134,
    category: "earrings",
    collection: ["pearl", "gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isBestseller: true,
    material: "14k Gold Fill, Freshwater Pearl",
    care: "Wipe with damp cloth after wearing.",
  },
  {
    id: "7",
    handle: "arabella-twisted-ring",
    title: "Arabella Twisted Ring",
    description: "A graceful twisted band ring in two-tone gold and silver. Versatile and stackable.",
    price: 89,
    category: "rings",
    collection: ["two-tone"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "Gold Vermeil & Sterling Silver",
    care: "Avoid contact with lotions.",
  },
  {
    id: "8",
    handle: "celestine-star-studs",
    title: "Celestine Star Studs",
    description: "Dainty star-shaped studs with micro-pavé crystal detailing. Perfect for everyday sparkle.",
    price: 68,
    category: "earrings",
    collection: ["stones", "silver"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isNew: true,
    material: "Sterling Silver, Cubic Zirconia",
    care: "Clean with a dry soft cloth.",
  },
  {
    id: "9",
    handle: "valencia-chain-bracelet",
    title: "Valencia Chain Bracelet",
    description: "Bold yet elegant chain bracelet with an adjustable clasp. Statement piece for the modern woman.",
    price: 112,
    category: "bracelets",
    collection: ["gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "18k Gold Vermeil",
    care: "Store flat to prevent tangling.",
  },
  {
    id: "10",
    handle: "rosalind-baroque-pearl-necklace",
    title: "Rosalind Baroque Pearl Necklace",
    description: "Unique baroque pearls strung on a delicate gold chain. Each pearl is one-of-a-kind.",
    price: 178,
    category: "necklaces",
    collection: ["pearl", "gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isBestseller: true,
    material: "14k Gold Fill, Baroque Pearls",
    care: "Last on, first off. Store in silk pouch.",
  },
  {
    id: "11",
    handle: "isadora-emerald-ring",
    title: "Isadora Emerald Ring",
    description: "A striking ring featuring a deep green stone surrounded by delicate detailing.",
    price: 168,
    category: "rings",
    collection: ["stones", "gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "Gold Vermeil, Green Onyx",
    care: "Avoid impact to protect the stone.",
  },
  {
    id: "12",
    handle: "margaux-cuff-bangle",
    title: "Margaux Cuff Bangle",
    description: "A modern open cuff bangle with a brushed finish. Adjustable for the perfect fit.",
    price: 142,
    category: "bangles",
    collection: ["silver"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "Sterling Silver",
    care: "Polish with a silver cloth.",
  },
  {
    id: "13",
    handle: "eloise-layered-necklace",
    title: "Éloise Layered Necklace",
    description: "Three delicate chains of varying lengths create a perfectly layered look in one piece.",
    price: 156,
    category: "necklaces",
    collection: ["gold", "new-in"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isNew: true,
    material: "18k Gold Vermeil",
    care: "Hang to store, avoid tangling.",
  },
  {
    id: "14",
    handle: "vivienne-huggie-hoops",
    title: "Vivienne Huggie Hoops",
    description: "Classic huggie hoops with a subtle sparkle from embedded crystals. Perfect everyday earrings.",
    price: 78,
    category: "earrings",
    collection: ["gold", "stones"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "Gold Vermeil, Cubic Zirconia",
    care: "Remove before sleeping.",
  },
  {
    id: "15",
    handle: "cordelia-signet-ring",
    title: "Cordelia Signet Ring",
    description: "A feminine take on the classic signet ring, featuring a delicate engraved pattern.",
    price: 118,
    category: "rings",
    collection: ["gold"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    material: "18k Gold Vermeil",
    care: "Store in a ring box.",
  },
  {
    id: "16",
    handle: "anastasia-tennis-bracelet",
    title: "Anastasia Tennis Bracelet",
    description: "Timeless tennis bracelet featuring a continuous line of brilliant stones.",
    price: 249,
    category: "bracelets",
    collection: ["silver", "stones"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    isBestseller: true,
    material: "Sterling Silver, Cubic Zirconia",
    care: "Clean with a jewelry cleaning solution.",
  },
];

export const collections = [
  {
    id: "new-in",
    name: "New In",
    description: "Discover our latest arrivals, fresh from our artisan studios.",
    image: "/placeholder.svg",
  },
  {
    id: "gold",
    name: "Gold Collection",
    description: "Timeless pieces crafted in lustrous 18k gold vermeil.",
    image: "/placeholder.svg",
  },
  {
    id: "silver",
    name: "Silver Collection",
    description: "Classic elegance in polished sterling silver.",
    image: "/placeholder.svg",
  },
  {
    id: "pearl",
    name: "Pearl Collection",
    description: "Freshwater pearls for understated sophistication.",
    image: "/placeholder.svg",
  },
  {
    id: "stones",
    name: "Stones Collection",
    description: "Gemstones and crystals that catch the light beautifully.",
    image: "/placeholder.svg",
  },
  {
    id: "two-tone",
    name: "Two-Tone",
    description: "The perfect blend of gold and silver.",
    image: "/placeholder.svg",
  },
];

export const getProductsByCollection = (collectionId: string): DemoProduct[] => {
  return demoProducts.filter(p => p.collection.includes(collectionId));
};

export const getProductsByCategory = (categoryId: string): DemoProduct[] => {
  return demoProducts.filter(p => p.category === categoryId);
};

export const getNewArrivals = (): DemoProduct[] => {
  return demoProducts.filter(p => p.isNew);
};

export const getBestsellers = (): DemoProduct[] => {
  return demoProducts.filter(p => p.isBestseller);
};

export const getProductByHandle = (handle: string): DemoProduct | undefined => {
  return demoProducts.find(p => p.handle === handle);
};