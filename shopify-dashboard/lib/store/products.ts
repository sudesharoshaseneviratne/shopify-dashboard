export interface ProductSpec {
  label: string;
  value: string;
}

export interface StoreCollection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  badge?: string;
  productCount?: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  tagline: string;
  category: "Books & Workbooks" | "Tech & Electronics" | "Stationery & Office" | "School Essentials" | "Novelties & Gifts" | string;
  priceUsd: number;
  priceSats: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  inventory: number;
  featured: boolean;
  badge?: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  firmwareVersion: string;
  securityRating: string;
  leadTime: string;
  colorAccent: string;
  images?: string[];
  image?: string;
  status?: string;
  collections?: string[];
}

export const USD_LKR_RATE = 320; // 1 USD ≈ 320 LKR reference rate
export const BTC_USD_RATE = USD_LKR_RATE; // Backwards-compatible alias

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "oxford-advanced-learners-dictionary",
    name: "Oxford Advanced Learner's Dictionary (10th Ed)",
    tagline: "The definitive English vocabulary, pronunciation, and grammatical guide for students & professionals",
    category: "Books & Workbooks",
    priceUsd: 3420,
    priceSats: 0,
    rating: 4.98,
    reviewsCount: 1420,
    inStock: true,
    inventory: 85,
    featured: true,
    badge: "Official Oxford Edition",
    description: "Build vocabulary and improve fluency with over 182,000 words, phrases, and definitions. Includes the Oxford 3000 and 5000 core word lists, CEFR level alignments, full-color illustrative plates, and interactive online resource access.",
    features: [
      "Over 182,000 words, phrases, and meanings clearly defined",
      "Oxford 3000 and 5000 keywords graded by CEFR proficiency",
      "Visual vocabulary builder with 96 full-color reference plates",
      "Comprehensive grammatical patterns and collocations",
      "Hardcover binding with protective matte finish"
    ],
    specs: [
      { label: "Publisher", value: "Oxford University Press" },
      { label: "Edition", value: "10th Revised Global Edition" },
      { label: "Pages", value: "1,856 Pages (Thumb Indexed)" },
      { label: "Language", value: "International English (UK & US)" },
      { label: "Binding", value: "Deluxe Hardbound with Ribbon" },
      { label: "ISBN", value: "978-0194798488" }
    ],
    firmwareVersion: "10th Edition",
    securityRating: "Authentic Quality A+",
    leadTime: "Immediate Dispatch (24h Delivery)",
    colorAccent: "#FFB800"
  },
  {
    id: "building-blocks-year-3-grammar",
    name: "Building Blocks Year 3 Spelling & Grammar",
    tagline: "Comprehensive curriculum workbook designed for foundational English language mastery",
    category: "Books & Workbooks",
    priceUsd: 1450,
    priceSats: 0,
    rating: 4.95,
    reviewsCount: 382,
    inStock: true,
    inventory: 64,
    featured: true,
    badge: "Curriculum Aligned",
    description: "A structured, progressive workbook designed to develop spelling accuracy, punctuation mastery, and creative sentence construction for primary school students. Includes progressive self-assessment drills and color illustrations.",
    features: [
      "Structured 36-week progressive spelling and phonics program",
      "Clear, engaging grammar practice with practical examples",
      "Comprehensive review checkpoints and answer keys included",
      "Printed on high-opacity smudge-free eco-friendly paper",
      "Endorsed by leading primary education curriculum boards"
    ],
    specs: [
      { label: "Target Grade", value: "Grade 3 / Year 3 (Ages 7-9)" },
      { label: "Subject", value: "English Grammar, Phonics & Spelling" },
      { label: "Format", value: "Activity Workbook (Perforated)" },
      { label: "Pages", value: "164 Illustrated Pages" },
      { label: "Printing", value: "Full Color Soy Ink" }
    ],
    firmwareVersion: "2026 Reprint",
    securityRating: "Curriculum Certified",
    leadTime: "In Stock (Same-Day Courier)",
    colorAccent: "#F59E0B"
  },
  {
    id: "abacus-year-2-textbook",
    name: "Abacus Year 2 Mathematics Master Textbook",
    tagline: "Award-winning mathematics textbook fostering deep conceptual numeracy and problem-solving",
    category: "Books & Workbooks",
    priceUsd: 1850,
    priceSats: 0,
    rating: 4.96,
    reviewsCount: 890,
    inStock: true,
    inventory: 42,
    featured: true,
    badge: "Bestselling Numeracy",
    description: "Renowned curriculum mathematics textbook empowering primary students to master arithmetic, mental math, geometry, and word problems through intuitive step-by-step visual models and progressive problem sets.",
    features: [
      "Intuitive concrete-pictorial-abstract visual modeling",
      "Extensive real-world word problems and reasoning tasks",
      "Mental math challenges and speed arithmetic warmups",
      "Full coverage of national and international curriculum targets",
      "Durable water-resistant laminated cover"
    ],
    specs: [
      { label: "Series", value: "Abacus Mathematics Global" },
      { label: "Grade Level", value: "Grade 2 / Primary 2" },
      { label: "Subject", value: "Mathematics & Applied Numeracy" },
      { label: "Pages", value: "192 Full Color Pages" },
      { label: "Publisher", value: "Pearson Education" }
    ],
    firmwareVersion: "Revised Edition",
    securityRating: "Authentic Textbook",
    leadTime: "In Stock (Islandwide Delivery)",
    colorAccent: "#FFB800"
  },
  {
    id: "casio-fx-991cw-scientific-calculator",
    name: "Casio FX-991CW ClassWiz Scientific Calculator",
    tagline: "Advanced non-programmable scientific calculator with high-resolution 4-gradation natural display",
    category: "Tech & Electronics",
    priceUsd: 6500,
    priceSats: 0,
    rating: 4.99,
    reviewsCount: 1150,
    inStock: true,
    inventory: 35,
    featured: true,
    badge: "Official Exam Approved",
    description: "The ultimate mathematical computing companion for G.C.E. A/L, Cambridge, and Edexcel exams. Features over 540 functions, spreadsheet calculation, matrix operations, statistical regressions, and QR code graph visualization.",
    features: [
      "Natural Textbook Display shows expressions exactly as written",
      "Over 540 scientific, engineering, and statistical functions",
      "Dual Power: High-efficiency solar cell + backup lithium battery",
      "Intuitive menu navigation with cursor keys and high-speed CPU",
      "Approved for GCE O/L, A/L, Cambridge, and SAT examinations"
    ],
    specs: [
      { label: "Display", value: "High-Resolution 4-Gradation Matrix" },
      { label: "Power Source", value: "Two-Way (Solar + LR44 Battery)" },
      { label: "Key Material", value: "Wear-Resistant Plastic Resin" },
      { label: "Dimensions", value: "162 x 77 x 10.7 mm" },
      { label: "Warranty", value: "3 Years Official Casio Warranty" }
    ],
    firmwareVersion: "ClassWiz CW Series",
    securityRating: "100% Genuine with QR Verification",
    leadTime: "Immediate Dispatch (Insured Courier)",
    colorAccent: "#3B82F6"
  },
  {
    id: "rotring-rapid-pro-mechanical-pencil",
    name: "rOtring Rapid PRO Drafting Pencil Set (0.5mm)",
    tagline: "Professional German engineered all-metal drafting instrument with cushion lead mechanism",
    category: "Stationery & Office",
    priceUsd: 4800,
    priceSats: 0,
    rating: 4.92,
    reviewsCount: 410,
    inStock: true,
    inventory: 28,
    featured: false,
    badge: "German Precision",
    description: "Crafted from solid brass with a knurled anti-slip grip and matte black hexagonal barrel. Incorporates an innovative sliding sleeve and cushion point mechanism that virtually eliminates lead breakage during rapid writing and technical drafting.",
    features: [
      "Solid brass all-metal hexagonal body for balanced ergonomics",
      "Knurled non-slip metal grip for fatigue-free drafting and drawing",
      "Cushioned lead sleeve prevents breakage under heavy writing pressure",
      "Pocket-safe push-mechanism with retractable tip",
      "Includes 3 tubes of high-polymer HB replacement leads and erasers"
    ],
    specs: [
      { label: "Brand", value: "rOtring Germany" },
      { label: "Lead Size", value: "0.5mm Standard Drafting" },
      { label: "Material", value: "Full Brass Body with Matte Epoxy" },
      { label: "Weight", value: "25 grams (Optimal Ergonomic Balance)" },
      { label: "Origin", value: "Designed in Germany" }
    ],
    firmwareVersion: "Rapid PRO Series",
    securityRating: "Authentic German Craftsmanship",
    leadTime: "In Stock (Dispatched in 24h)",
    colorAccent: "#EF4444"
  },
  {
    id: "premium-leather-hardbound-journal",
    name: "Prasanthi Craft Executive Hardbound Notebook (A5)",
    tagline: "Archival-grade 120gsm ink-proof fountain pen friendly journal with lay-flat thread binding",
    category: "Stationery & Office",
    priceUsd: 2400,
    priceSats: 0,
    rating: 4.88,
    reviewsCount: 295,
    inStock: true,
    inventory: 50,
    featured: false,
    badge: "120gsm Fountain Proof",
    description: "Designed for thinkers, writers, and students. Features 240 numbered pages of acid-free 120gsm ivory paper that resists ghosting and bleed-through from all inks. Finished with an expandable inner pocket, dual ribbon bookmarks, and an elastic closure.",
    features: [
      "240 numbered pages of premium 120gsm fountain pen friendly paper",
      "Thread-bound spine opens 180° completely flat on any surface",
      "Includes 8-page index and perforated notes section at the rear",
      "Expandable gusseted back pocket for loose sheets and receipts",
      "Water-resistant vegan PU leather cover with gold debossed monogram"
    ],
    specs: [
      { label: "Format", value: "A5 (148 x 210 mm)" },
      { label: "Paper Weight", value: "120 gsm Acid-Free Ivory" },
      { label: "Ruling", value: "5mm Subtle Dotted Matrix" },
      { label: "Pages", value: "240 Numbered Pages" },
      { label: "Closure", value: "Custom Elastic Band + Pen Loop" }
    ],
    firmwareVersion: "Classic Edition",
    securityRating: "Archival Grade Standard",
    leadTime: "Immediate Dispatch",
    colorAccent: "#10B981"
  },
  {
    id: "ergonomic-student-orthopedic-backpack",
    name: "Prasanthi Craft Ergonomic Multi-Pocket School Backpack",
    tagline: "Orthopedic spinal-support school backpack with waterproof ballistic nylon and padded laptop pocket",
    category: "School Essentials",
    priceUsd: 5900,
    priceSats: 0,
    rating: 4.94,
    reviewsCount: 360,
    inStock: true,
    inventory: 22,
    featured: true,
    badge: "Spinal Support Certified",
    description: "Engineered to distribute heavy book loads evenly across the shoulders and lumbar region. Built with tear-resistant waterproof 900D nylon, reinforced dual zippers, dedicated 15.6-inch padded laptop compartment, and reflective safety bands.",
    features: [
      "S-curve ergonomic memory foam shoulder straps with breathable mesh",
      "Reinforced heavy-duty bottom panel supports up to 25kg book loads",
      "Multi-tier organizer pockets for stationery, water bottles, and electronics",
      "Hydrophobic water-repellent coating shields against tropical rain",
      "360-degree reflective piping for nighttime pedestrian safety"
    ],
    specs: [
      { label: "Capacity", value: "28 Liters (Large 3-Compartment)" },
      { label: "Material", value: "900D Ballistic Waterproof Oxford Nylon" },
      { label: "Laptop Sleeve", value: "Padded up to 15.6\" Devices" },
      { label: "Zippers", value: "Heavy-Duty YKK Dual Smooth Glides" },
      { label: "Weight", value: "780 grams (Ultra Lightweight)" }
    ],
    firmwareVersion: "2026 Pro Series",
    securityRating: "ISO 9001 Quality Assured",
    leadTime: "In Stock (Islandwide Delivery)",
    colorAccent: "#FFB800"
  },
  {
    id: "staedtler-noris-stationery-geometry-set",
    name: "Staedtler Noris Complete Math & Geometry Kit",
    tagline: "Comprehensive 10-piece metal geometry box with precision compass, dividers, and shatterproof rulers",
    category: "School Essentials",
    priceUsd: 1750,
    priceSats: 0,
    rating: 4.97,
    reviewsCount: 510,
    inStock: true,
    inventory: 90,
    featured: false,
    badge: "German Standards",
    description: "The gold standard geometry set used by students worldwide. Housed in a durable vintage-style embossed metal tin, containing self-centering precision compass, divider, 15cm ruler, set squares, protractor, and sharpener.",
    features: [
      "Precision metal spring-bow compass with safety blunt-needle tip",
      "Clear transparent shatterproof scale rulers with millimeter gradations",
      "Embossed vintage tin storage case with anti-scratch internal tray",
      "Includes HB mechanical pencil lead refills and dust-free eraser",
      "Conforms strictly to national and international school exam regulations"
    ],
    specs: [
      { label: "Brand", value: "Staedtler Mars GmbH Germany" },
      { label: "Components", value: "10-Piece Full Exam Kit" },
      { label: "Case", value: "Sturdy Lithographed Metal Storage Tin" },
      { label: "Safety", value: "EN71 Non-Toxic Child Safe Certified" },
      { label: "Origin", value: "Made in Germany" }
    ],
    firmwareVersion: "Noris Edition",
    securityRating: "Genuine European Quality",
    leadTime: "Immediate Dispatch",
    colorAccent: "#FFD600"
  }
];

export const CATEGORIES = [
  "All Products",
  "Books & Workbooks",
  "Tech & Electronics",
  "Stationery & Office",
  "School Essentials",
  "Novelties & Gifts"
] as const;

export const LIVE_NETWORK_METRICS = {
  activeProducts: 48,
  satisfactionRate: "99.4%",
  verifiedOrders: "15,200+",
  deliveryTime: "24-48 Hours",
  supportHotline: "+9477 423 0976",
  storeLocation: "Maharagama, Colombo",
  freeDeliveryThreshold: "LKR 5,000"
};
