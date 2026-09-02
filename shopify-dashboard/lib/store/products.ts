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
  category: "Cold Storage" | "Mining & ASICs" | "Sovereign Nodes" | "Cryptographic Relics" | "Security & Backup" | string;
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

export const BTC_USD_RATE = 95240; // 1 BTC = $95,240 USD (1 Sat ≈ $0.0009524)

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "coldkey-prime-mk4",
    name: "Satoshi ColdKey Prime MK-IV",
    tagline: "Air-gapped optical verification hardware signer with CC EAL6+ secure element",
    category: "Cold Storage",
    priceUsd: 289,
    priceSats: 303443,
    rating: 4.98,
    reviewsCount: 1420,
    inStock: true,
    inventory: 48,
    featured: true,
    badge: "BIP-174 Air-Gapped",
    description: "The gold standard of sovereign Bitcoin custody. Features dual independent EAL6+ secure element chips, zero RF/Bluetooth emission, camera-based QR animated PSBT signing, and a high-contrast OLED display with physical dual-switch anti-tamper triggers.",
    features: [
      "100% Air-Gapped: Optical camera QR-code data transfer only",
      "Dual CC EAL6+ Cryptographic Co-processors",
      "Multisig & Miniscript Native Engine",
      "Anti-Klepto signature nonce protection",
      "Self-destruct duress PIN with zeroized RAM"
    ],
    specs: [
      { label: "Secure Element", value: "Dual Microchip ATECC608B + ST33" },
      { label: "Display", value: "2.8\" High-Contrast IPS Cryptographic Matrix" },
      { label: "Connectivity", value: "Optical CMOS Camera + MicroSD (No Wireless)" },
      { label: "Battery", value: "1200mAh Lithium Iron Phosphate (LiFePO4)" },
      { label: "Enclosure", value: "Anodized Aerospace Titanium 6Al-4V" },
      { label: "Entropy Generation", value: "True Hardware Avalanche Noise RNG" }
    ],
    firmwareVersion: "v4.18.2-sovereign",
    securityRating: "CC EAL6+ Certified",
    leadTime: "Immediate Dispatch (Same Block)",
    colorAccent: "#FFB800"
  },
  {
    id: "orion-hydro-miner-140",
    name: "Orion Hydro-ASIC 140 TH/s",
    tagline: "Ultra-silent closed-loop liquid cooled SHA-256 home mining rig",
    category: "Mining & ASICs",
    priceUsd: 3450,
    priceSats: 3622427,
    rating: 4.95,
    reviewsCount: 382,
    inStock: true,
    inventory: 14,
    featured: true,
    badge: "Liquid Cooled 21 J/TH",
    description: "Engineered specifically for residential and boutique sovereign hashing. Operates under 38dB noise level with custom micro-channel cold plates, delivering 140 Terahashes per second with unmatched thermodynamic efficiency.",
    features: [
      "Whisper-Quiet Operation: Under 38 dBA at full continuous hash",
      "21.5 J/TH Industry-Leading Energy Efficiency",
      "Direct Stratum V2 Protocol with Job Negotiation",
      "Integrated Waste-Heat Radiator for Home Warming",
      "Custom Linux OS with Telemetry Dashboard & Grafana integration"
    ],
    specs: [
      { label: "Hashrate", value: "140 TH/s ±3% SHA-256" },
      { label: "Power Draw", value: "3,010W @ 220V AC" },
      { label: "Coolant Loop", value: "Fluorochemical Non-Conductive Liquid" },
      { label: "Acoustic Level", value: "37.5 dBA @ 1 meter" },
      { label: "Weight", value: "14.2 kg (31.3 lbs)" },
      { label: "Network Protocol", value: "Stratum V2 / V1 Dual Fallback" }
    ],
    firmwareVersion: "v2.8.0-braiinsOS",
    securityRating: "Hardware Secure Boot",
    leadTime: "3 Business Days (Express Insured)",
    colorAccent: "#F59E0B"
  },
  {
    id: "sovereign-node-x1",
    name: "Sovereign ZK-Lightning Node X1",
    tagline: "Zero-configuration dedicated Bitcoin Core + Lightning LND validation appliance",
    category: "Sovereign Nodes",
    priceUsd: 799,
    priceSats: 838933,
    rating: 4.96,
    reviewsCount: 890,
    inStock: true,
    inventory: 32,
    featured: true,
    badge: "Plug & Validate",
    description: "Run your own financial sovereignty center. Pre-synced with the complete Bitcoin blockchain history, running Electrum Server, BTCPay Server, Nostr relay, and automated Lightning channel rebalancing algorithms out of the box.",
    features: [
      "Pre-indexed Full UTXO History & Mempool Visualizer",
      "4TB High-Endurance NVMe Gen4 SSD Storage (10,000 TBW)",
      "Zero-Config Tor v3 & I2P Onion Routing",
      "Auto-Pilot Liquidity Routing for 1-5% APY Routing Fees",
      "Hardware Killswitch & Encrypted Automated Offsite Backup"
    ],
    specs: [
      { label: "Processor", value: "AMD Ryzen Embedded 8-Core / 16-Thread" },
      { label: "RAM", value: "32GB ECC DDR5 5600MHz" },
      { label: "Storage", value: "4TB Samsung 990 PRO NVMe SSD" },
      { label: "Networking", value: "Dual 2.5GbE LAN + Dedicated Hardware Firewall" },
      { label: "Chassis", value: "Solid Billet CNC Aluminum Heatsink Enclosure" },
      { label: "Power Consumption", value: "18W Idle / 45W Peak Validation" }
    ],
    firmwareVersion: "Umbrel Sovereign v1.4",
    securityRating: "Full Self-Host Isolation",
    leadTime: "Immediate Dispatch",
    colorAccent: "#FFD600"
  },
  {
    id: "ciphersteel-24-matrix",
    name: "CipherSteel 24-Seed Matrix Plate",
    tagline: "Indestructible 316L Marine-Grade Stainless Steel BIP39 backup vault",
    category: "Security & Backup",
    priceUsd: 119,
    priceSats: 124947,
    rating: 4.99,
    reviewsCount: 2150,
    inStock: true,
    inventory: 120,
    featured: false,
    badge: "2,500°F Fireproof",
    description: "Fireproof, waterproof, corrosion-resistant, and crushproof. Designed to preserve 12, 18, or 24-word seed phrases across centuries without electronic failure or degradation. Includes tungsten-carbide center punch and tamper-evident locking screws.",
    features: [
      "Melting point exceeds 2,550°F (1,400°C)",
      "Immune to acid submersion, rust, and salt spray",
      "Universal BIP39 compatibility (first 4 letters mnemonic indexing)",
      "Laser-engraved grid layout with anti-slip alignment guides",
      "Tamper-evident serial number security seal"
    ],
    specs: [
      { label: "Material", value: "AISI 316L Marine Austenitic Steel" },
      { label: "Dimensions", value: "100mm x 60mm x 6mm" },
      { label: "Weight", value: "420g Solid Steel" },
      { label: "Blast Rating", value: "50 Caliber Shockwave Tested" },
      { label: "Included Tools", value: "Spring-loaded Tungsten Punch & Security Screws" }
    ],
    firmwareVersion: "Analog Hardware",
    securityRating: "Indestructible Physical Vault",
    leadTime: "Immediate Dispatch",
    colorAccent: "#94A3B8"
  },
  {
    id: "nostr-lightning-terminal-mk2",
    name: "Nostr Lightning POS Terminal MK-II",
    tagline: "Point-of-sale handheld terminal for sub-second zero-fee Bitcoin Lightning settlements",
    category: "Sovereign Nodes",
    priceUsd: 349,
    priceSats: 366442,
    rating: 4.91,
    reviewsCount: 410,
    inStock: true,
    inventory: 26,
    featured: false,
    badge: "Sub-Second LNURL",
    description: "Empower brick-and-mortar merchants and mobile vendors. Supports LNURL-Pay, NFC Bolt Cards, on-chain QR codes, and automated custodial/non-custodial settlement into cold storage multisig wallets.",
    features: [
      "Contactless NFC Bolt Card Tap-to-Pay in <300ms",
      "Dynamic Satoshi/Fiat Currency Auto-Conversion",
      "Thermal Receipt Printer Built-in with Custom Nostr Invoices",
      "4G LTE SIM Slot + Dual-Band Wi-Fi 6",
      "Direct Zero-Fee Settlement to Your Self-Custody Node"
    ],
    specs: [
      { label: "Display", value: "5.5\" Glove-Friendly Gorilla Glass Multi-Touch" },
      { label: "Printer", value: "High-Speed 58mm Thermal Line (70mm/sec)" },
      { label: "NFC Reader", value: "NXP ISO/IEC 14443 Type A/B BoltCard" },
      { label: "Battery", value: "5000mAh 18-Hour Continuous Operation" },
      { label: "OS", value: "Hardened Custom Android 13 Enterprise" }
    ],
    firmwareVersion: "v3.2.1-lightningPOS",
    securityRating: "PCI PTS 6.x Compliant Enclave",
    leadTime: "Immediate Dispatch",
    colorAccent: "#FFB800"
  },
  {
    id: "genesis-block-gold-ingot",
    name: "Physical 21,000 Sats Genesis Ingot",
    tagline: "Serialized 24K pure gold alloy proof bar loaded with verifiable timelocked UTXO",
    category: "Cryptographic Relics",
    priceUsd: 580,
    priceSats: 608987,
    rating: 5.0,
    reviewsCount: 640,
    inStock: true,
    inventory: 9,
    featured: true,
    badge: "Limited Genesis Batch #21",
    description: "A tangible convergence of physical gold and cryptographic proof-of-work. Each bar contains exactly 21,000 Satoshis verifiable on the blockchain through a tamper-evident holographic private key seal with OP_CHECKLOCKTIMEVERIFY timelock inscription.",
    features: [
      "Individually Numbered & Laser Inscribed (001 - 210 Edition)",
      "99.99% Fine Investment-Grade Gold Layered Core",
      "Multi-Layer Tamper-Evident Optical Hologram Security",
      "Comes with Cryptographic Certificate of Provenance",
      "Museum-Grade Airtight Acrylic Display Case Included"
    ],
    specs: [
      { label: "Weight", value: "1 Troy Ounce (31.1035 grams)" },
      { label: "Purity", value: "24K .9999 Pure Fine Layered Gold" },
      { label: "UTXO Balance", value: "21,000 Satoshis (Verifiable On-Chain)" },
      { label: "Security Seal", value: "Micro-Optical 3D Diffractive Hologram" },
      { label: "Mintage Limit", value: "Strictly Limited to 2,100 Worldwide" }
    ],
    firmwareVersion: "Blockchain Inscribed",
    securityRating: "Holographic Proof-of-Reserve",
    leadTime: "Ships in Velvet Display Box",
    colorAccent: "#FFD600"
  },
  {
    id: "bitvault-titanium-capsule",
    name: "BitVault Genesis X500 Capsule",
    tagline: "Aerospace Grade 5 Titanium hermetic cold storage capsule for multisig keys",
    category: "Cold Storage",
    priceUsd: 189,
    priceSats: 198446,
    rating: 4.93,
    reviewsCount: 520,
    inStock: true,
    inventory: 64,
    featured: false,
    badge: "Submersible 10,000ft",
    description: "Precision-machined from solid Grade 5 Titanium bar stock. Features double Viton O-ring seals, EMP shielding, and cryogenic freezing tolerance down to -200°C. Protects up to four seed cards in an airtight vacuum.",
    features: [
      "100% Waterproof to 3,000 meters depth",
      "Electromagnetic Pulse (EMP) & Solar Flare Faraday Cage",
      "Corrosion-proof in boiling nitric acid",
      "Laser-welded serialized key ring attachment",
      "Dual Viton high-temperature fluoroelastomer seals"
    ],
    specs: [
      { label: "Material", value: "Titanium Ti-6Al-4V (Grade 5)" },
      { label: "Pressure Tolerance", value: "500 Bar (7,250 PSI)" },
      { label: "Temperature Range", value: "-200°C to +600°C" },
      { label: "Capacity", value: "4 Stainless Steel BIP39 Seed Tiles" },
      { label: "Finish", value: "DLC (Diamond-Like Carbon) Void Black" }
    ],
    firmwareVersion: "Mechanical Spec 1.0",
    securityRating: "Mil-Spec EMP Hardened",
    leadTime: "Immediate Dispatch",
    colorAccent: "#F59E0B"
  },
  {
    id: "quantum-hsm-vault",
    name: "Quantum-Resistant Enterprise HSM",
    tagline: "FIPS 140-3 Level 4 hardware security module for corporate Bitcoin treasuries",
    category: "Security & Backup",
    priceUsd: 4890,
    priceSats: 5134397,
    rating: 4.97,
    reviewsCount: 94,
    inStock: true,
    inventory: 6,
    featured: true,
    badge: "FIPS 140-3 Level 4",
    description: "The apex of cryptographic custody for hedge funds, family offices, and DAOs. Features active environmental intrusion sensors that instantly wipe secrets upon physical drilling, laser probing, or cryogenic side-channel attacks.",
    features: [
      "3-of-5 / M-of-N Threshold Signature Scheme (TSS) Engine",
      "Active Mesh Physical Barrier with Instant Zeroization",
      "Quantum-Resistant Crystals-Kyber & Dilithium Co-processor",
      "Dual Redundant Hot-Swappable Power Supplies",
      "1U Rackmount Server Chassis with OLED Audit Screen"
    ],
    specs: [
      { label: "Standard", value: "FIPS 140-3 Level 4 / CC EAL7 Ready" },
      { label: "Signing Speed", value: "12,000 Schnorr Signatures / Sec" },
      { label: "Form Factor", value: "1U 19\" Rackmount Chassis" },
      { label: "Tamper Response", value: "<15 Nanoseconds Physical Zeroize" },
      { label: "Interface", value: "Dual 10Gb SFP+ Isolated Cryptographic Fibre" }
    ],
    firmwareVersion: "v9.4.0-hardened",
    securityRating: "FIPS 140-3 Level 4",
    leadTime: "5 Business Days (White Glove Courier)",
    colorAccent: "#FFB800"
  }
];

export const CATEGORIES = [
  "All Protocol Gear",
  "Cold Storage",
  "Mining & ASICs",
  "Sovereign Nodes",
  "Cryptographic Relics",
  "Security & Backup"
] as const;

export const LIVE_NETWORK_METRICS = {
  blockHeight: 885412,
  hashrateEH: "712.4 EH/s",
  halvingProgress: "22.8%",
  mempoolFeeSatsVB: "8 sat/vB",
  lightningNodes: "14,890",
  lightningCapacityBTC: "5,410.8 BTC",
  btcUsdPrice: 95240,
  priceChange24h: "+3.84%"
};
