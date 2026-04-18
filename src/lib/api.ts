/** Mirrors the Python Pydantic response schema exactly */

export interface AspectSentiment {
  positive: number;
  negative: number;
  neutral: number;
  sample_reviews: string[];
}

export interface DiscoveredAspect {
  name: string;
  mention_count: number;
  /** 0-100, higher = more positive */
  sentiment_score: number;
  /** % of mentions that were complaints */
  complaint_rate: number;
  trend: "up" | "down" | "stable";
  /** signed delta vs prior period */
  delta: number;
  top_positive?: string | null;
  top_negative?: string | null;
  sample_reviews?: string[];
}

export interface VelocityPoint {
  t: string;
  /** aspect_name → complaint % */
  values: Record<string, number>;
}

export interface AnomalyAlert {
  severity: "P0" | "P1" | "P2";
  aspect: string;
  title: string;
  description: string;
  confidence: number;
}

export interface ReviewRow {
  snippet: string;
  feature: string;
  sentiment: "Positive" | "Negative" | "Mixed";
  confidence: number;
  flags: string[];
  emojis?: { char: string; meaning: string }[];
}

export interface AnalysisResult {
  metadata: {
    inferred_product: string;
    product_category: string;
    total_reviews: number;
    aspects_found: number;
    analysis_provider: "mock" | "openai" | "skeleton";
  };
  discovered_aspects: DiscoveredAspect[];
  overall_sentiment: { positive: number; negative: number; neutral: number };
  velocity_data: VelocityPoint[];
  top_keywords: { word: string; count: number }[];
  anomaly_alerts: AnomalyAlert[];
  review_table: ReviewRow[];
  batch_defect?: {
    batch_id: string;
    defect_type: string;
    affected_users: number;
    hours_since_purchase: number;
  };
}

/* ── Scenario fingerprints — match URL fragments OR filenames ── */
const SHAMPOO_URL_FRAGMENT    = "botanical-luxuriate-tea-tree-shampoo";
const IPHONE_URL_FRAGMENT     = "apple-iphone-16";
const CRUNCHMATE_URL_FRAGMENT = "crunchmate";

/** Matches both Flipkart-style URLs and the sample CSV filenames */
function detectScenario(slug: string): "shampoo" | "iphone" | "crunchmate" | "skeleton" {
  const lower = slug.toLowerCase();
  if (lower.includes(SHAMPOO_URL_FRAGMENT))    return "shampoo";
  if (lower.includes(IPHONE_URL_FRAGMENT))     return "iphone";
  if (lower.includes(CRUNCHMATE_URL_FRAGMENT)) return "crunchmate";
  return "skeleton";
}

/* ══════════════════════════════════════════════════════
   SCENARIO A — Botanical Luxuriate Tea Tree Shampoo
   Flipkart · Hair Care
══════════════════════════════════════════════════════ */
const SHAMPOO_RESULT: AnalysisResult = {
  metadata: {
    inferred_product:   "Botanical Luxuriate Tea Tree Shampoo (Anti-Lice)",
    product_category:   "Hair Care & Personal Hygiene",
    total_reviews:      1_847,
    aspects_found:      8,
    analysis_provider:  "mock",
  },
  overall_sentiment: { positive: 62, negative: 27, neutral: 11 },
  batch_defect: {
    batch_id:             "BATCH-TT-221A",
    defect_type:          "Leaking Bottle Seal",
    affected_users:       138,
    hours_since_purchase: 6,
  },
  discovered_aspects: [
    {
      name: "Anti-Lice Effectiveness", mention_count: 420, sentiment_score: 78,
      complaint_rate: 15, trend: "up", delta: 9,
      top_positive: "Got rid of lice completely within a week!",
      top_negative: "Took more than one bottle to see results.",
    },
    {
      name: "Fragrance", mention_count: 380, sentiment_score: 85,
      complaint_rate: 8,  trend: "up", delta: 4,
      top_positive: "Leaves hair smelling fresh for hours.",
      top_negative: "Too strong for sensitive noses.",
    },
    {
      name: "Lather Quality", mention_count: 295, sentiment_score: 72,
      complaint_rate: 20, trend: "stable", delta: 0,
      top_positive: "Rich, creamy lather that spreads easily.",
      top_negative: "Doesn't lather well with hard water.",
    },
    {
      name: "Scalp Feel", mention_count: 260, sentiment_score: 81,
      complaint_rate: 12, trend: "up", delta: 6,
      top_positive: "Scalp feels clean and itch-free after use.",
      top_negative: "Felt a bit dry after repeated use.",
    },
    {
      name: "Hair Texture After Wash", mention_count: 198, sentiment_score: 70,
      complaint_rate: 24, trend: "down", delta: -8,
      top_positive: "Hair feels soft and manageable.",
      top_negative: "Made ends feel rough after a few washes.",
    },
    {
      name: "Packaging & Bottle", mention_count: 155, sentiment_score: 38,
      complaint_rate: 62, trend: "down", delta: -28,
      top_positive: "Compact, fits well in shower caddy.",
      top_negative: "Bottle leaked all over the delivery bag.",
    },
    {
      name: "Value for Money", mention_count: 120, sentiment_score: 88,
      complaint_rate: 6,  trend: "up", delta: 11,
      top_positive: "Affordable and works as described.",
      top_negative: "Quantity is a bit less for the price.",
    },
    {
      name: "Ingredient Safety", mention_count: 85, sentiment_score: 91,
      complaint_rate: 3,  trend: "stable", delta: 1,
      top_positive: "No sulfates, safe for color-treated hair.",
      top_negative: null,
    },
  ],
  anomaly_alerts: [
    {
      severity:    "P0",
      aspect:      "Packaging & Bottle",
      title:       "CRITICAL: Mass Leaking Seals — Batch TT-221A",
      description: "138 buyers reported leaking bottles within 6 hrs of delivery. Seal integrity failure in current manufacturing batch. Recommend immediate supplier audit.",
      confidence:  0.97,
    },
    {
      severity:    "P1",
      aspect:      "Hair Texture After Wash",
      title:       "Hair Roughness Climb (+24% Complaints)",
      description: "Week-over-week complaint rate for post-wash roughness has increased 24%. Possible formula batch variance. Cross-check with QC lab.",
      confidence:  0.89,
    },
    {
      severity:    "P2",
      aspect:      "Anti-Lice Effectiveness",
      title:       "Efficacy Queries Rising in 2+ Application Reviews",
      description: "Segment of users report needing 2+ bottles. Consider adding clear usage instructions to PDP.",
      confidence:  0.75,
    },
  ],
  top_keywords: [
    { word: "lice",      count: 312 },
    { word: "leaking",   count: 204 },
    { word: "fragrance", count: 180 },
    { word: "scalp",     count: 155 },
    { word: "dry",       count: 98  },
    { word: "bottle",    count: 87  },
    { word: "nits",      count: 73  },
    { word: "sulfate",   count: 44  },
  ],
  velocity_data: [
    { t: "Mon", values: { "Anti-Lice Effectiveness": 10, "Packaging & Bottle": 18, "Fragrance": 5 } },
    { t: "Tue", values: { "Anti-Lice Effectiveness": 12, "Packaging & Bottle": 32, "Fragrance": 6 } },
    { t: "Wed", values: { "Anti-Lice Effectiveness": 14, "Packaging & Bottle": 55, "Fragrance": 7 } },
    { t: "Thu", values: { "Anti-Lice Effectiveness": 13, "Packaging & Bottle": 62, "Fragrance": 8 } },
    { t: "Fri", values: { "Anti-Lice Effectiveness": 15, "Packaging & Bottle": 58, "Fragrance": 7 } },
    { t: "Sat", values: { "Anti-Lice Effectiveness": 16, "Packaging & Bottle": 65, "Fragrance": 9 } },
    { t: "Sun", values: { "Anti-Lice Effectiveness": 18, "Packaging & Bottle": 71, "Fragrance": 8 } },
  ],
  review_table: [
    { snippet: "Got rid of lice completely within the first week of use!", feature: "Anti-Lice Effectiveness", sentiment: "Positive", confidence: 97, flags: [] },
    { snippet: "The bottle cap cracked open and the entire tube leaked into my bag.", feature: "Packaging & Bottle", sentiment: "Negative", confidence: 99, flags: ["packaging-damage", "seal-failure"] },
    { snippet: "Smells like a spa — absolutely love the tea tree fragrance.", feature: "Fragrance", sentiment: "Positive", confidence: 95, flags: [] },
    { snippet: "Scalp feels squeaky clean and itch-free after the first wash.", feature: "Scalp Feel", sentiment: "Positive", confidence: 93, flags: [] },
    { snippet: "Hair becomes rough and tangled after a few uses. Not impressed.", feature: "Hair Texture After Wash", sentiment: "Negative", confidence: 89, flags: ["hair-damage"] },
    { snippet: "Doesn't lather at all with hard water. Very disappointing.", feature: "Lather Quality", sentiment: "Negative", confidence: 91, flags: ["hard-water-incompatible"] },
    { snippet: "Very affordable! Works exactly as described on the listing.", feature: "Value for Money", sentiment: "Positive", confidence: 96, flags: [] },
    { snippet: "Sulfate-free formula — great for my color-treated hair.", feature: "Ingredient Safety", sentiment: "Positive", confidence: 98, flags: [] },
    { snippet: "Needed two full bottles before seeing any improvement on nits.", feature: "Anti-Lice Effectiveness", sentiment: "Mixed", confidence: 84, flags: ["multiple-applications"] },
    { snippet: "Received a bottle with dented packaging and broken seal.", feature: "Packaging & Bottle", sentiment: "Negative", confidence: 98, flags: ["seal-failure"] },
    { snippet: "Hair is so soft and manageable — best shampoo I've used.", feature: "Hair Texture After Wash", sentiment: "Positive", confidence: 92, flags: [] },
    { snippet: "Fragrance is a bit strong — overwhelming for me personally.", feature: "Fragrance", sentiment: "Negative", confidence: 80, flags: ["strong-scent"] },
    { snippet: "Great foaming action even on thick, long hair.", feature: "Lather Quality", sentiment: "Positive", confidence: 90, flags: [] },
    { snippet: "💚🌿✨", feature: "Ingredient Safety", sentiment: "Positive", confidence: 99, flags: ["emoji-only"], emojis: [{ char: "💚", meaning: "Natural product" }, { char: "🌿", meaning: "Herbal/Organic" }, { char: "✨", meaning: "Great results" }] },
    { snippet: "🚿💧👎", feature: "Lather Quality", sentiment: "Negative", confidence: 93, flags: ["emoji-only"], emojis: [{ char: "🚿", meaning: "In the shower" }, { char: "💧", meaning: "Water" }, { char: "👎", meaning: "Disappointed" }] },
  ],
};

/* ══════════════════════════════════════════════════════
   SCENARIO B — Apple iPhone 16 128 GB (Black)
   Flipkart · Smartphones
══════════════════════════════════════════════════════ */
const IPHONE_RESULT: AnalysisResult = {
  metadata: {
    inferred_product:   "Apple iPhone 16 — 128 GB (Black)",
    product_category:   "Smartphones & Mobile Devices",
    total_reviews:      5_312,
    aspects_found:      8,
    analysis_provider:  "mock",
  },
  overall_sentiment: { positive: 73, negative: 18, neutral: 9 },
  batch_defect: {
    batch_id:             "BATCH-IP16-NOV7",
    defect_type:          "Overheating During Charge (A18 SoC Throttling)",
    affected_users:       427,
    hours_since_purchase: 11,
  },
  discovered_aspects: [
    {
      name: "Camera Quality", mention_count: 1_240, sentiment_score: 91,
      complaint_rate: 5, trend: "up", delta: 12,
      top_positive: "Photos are stunning — best camera on any phone.",
      top_negative: "Night mode still struggles in very low light.",
    },
    {
      name: "Battery Life", mention_count: 980, sentiment_score: 48,
      complaint_rate: 52, trend: "down", delta: -20,
      top_positive: "Lasts a full day with moderate use.",
      top_negative: "Drains 12% per hour with 5G enabled — unacceptable.",
    },
    {
      name: "Performance (A18 Chip)", mention_count: 860, sentiment_score: 95,
      complaint_rate: 3, trend: "up", delta: 8,
      top_positive: "Blazing fast — no lag whatsoever.",
      top_negative: "Gets warm during intense gaming sessions.",
    },
    {
      name: "Display Quality", mention_count: 710, sentiment_score: 89,
      complaint_rate: 7, trend: "stable", delta: 1,
      top_positive: "Super Retina XDR is gorgeous — perfect colours.",
      top_negative: "No always-on display is disappointing vs Android.",
    },
    {
      name: "Build Quality & Design", mention_count: 620, sentiment_score: 82,
      complaint_rate: 11, trend: "stable", delta: 2,
      top_positive: "Fits perfectly in the hand. Premium feel.",
      top_negative: "Got minor scratches on the aluminum frame quickly.",
    },
    {
      name: "iOS & Software", mention_count: 480, sentiment_score: 77,
      complaint_rate: 17, trend: "down", delta: -5,
      top_positive: "iOS 18 is smooth and feature-rich.",
      top_negative: "Sideloading restrictions are frustrating.",
    },
    {
      name: "Heating & Thermals", mention_count: 390, sentiment_score: 34,
      complaint_rate: 68, trend: "down", delta: -30,
      top_positive: "Normal warmth during charging is fine.",
      top_negative: "Phone becomes hot enough to burn during charge + usage.",
    },
    {
      name: "Value for Money", mention_count: 310, sentiment_score: 60,
      complaint_rate: 28, trend: "stable", delta: -3,
      top_positive: "Worth every rupee for the ecosystem.",
      top_negative: "Overpriced compared to Android flagships.",
    },
  ],
  anomaly_alerts: [
    {
      severity:    "P0",
      aspect:      "Heating & Thermals",
      title:       "CRITICAL: Overheating Reports Surge — Batch NOV7",
      description: "427 buyers from Batch IP16-NOV7 report severe heating within 11 hrs of use. A18 SoC potentially throttling. Recommend immediate batch recall audit.",
      confidence:  0.98,
    },
    {
      severity:    "P1",
      aspect:      "Battery Life",
      title:       "Battery Drain Rate +20% vs Prior Gen",
      description: "5G battery drain is consistently 20% worse than iPhone 15 in cross-user comparisons. iOS power management patch may be needed.",
      confidence:  0.93,
    },
    {
      severity:    "P2",
      aspect:      "iOS & Software",
      title:       "Sideloading Policy Complaints Rising",
      description: "EU users flagging sideloading restrictions. Negative sentiment in this segment up 15% this week.",
      confidence:  0.78,
    },
  ],
  top_keywords: [
    { word: "camera",     count: 890 },
    { word: "heating",    count: 640 },
    { word: "battery",    count: 580 },
    { word: "5G",         count: 410 },
    { word: "overpriced", count: 280 },
    { word: "smooth",     count: 240 },
    { word: "scratch",    count: 195 },
    { word: "throttle",   count: 155 },
  ],
  velocity_data: [
    { t: "Mon", values: { "Heating & Thermals": 22, "Battery Life": 30, "Camera Quality": 4 } },
    { t: "Tue", values: { "Heating & Thermals": 35, "Battery Life": 40, "Camera Quality": 5 } },
    { t: "Wed", values: { "Heating & Thermals": 48, "Battery Life": 45, "Camera Quality": 4 } },
    { t: "Thu", values: { "Heating & Thermals": 55, "Battery Life": 50, "Camera Quality": 5 } },
    { t: "Fri", values: { "Heating & Thermals": 62, "Battery Life": 52, "Camera Quality": 6 } },
    { t: "Sat", values: { "Heating & Thermals": 65, "Battery Life": 55, "Camera Quality": 5 } },
    { t: "Sun", values: { "Heating & Thermals": 71, "Battery Life": 58, "Camera Quality": 6 } },
  ],
  review_table: [
    { snippet: "Camera is unbelievably good — portraits look professional.", feature: "Camera Quality", sentiment: "Positive", confidence: 98, flags: [] },
    { snippet: "Phone becomes scorching hot during charging AND using it simultaneously.", feature: "Heating & Thermals", sentiment: "Negative", confidence: 99, flags: ["thermal-throttling", "overheating"] },
    { snippet: "A18 chip is insanely fast — apps open instantly, zero lag.", feature: "Performance (A18 Chip)", sentiment: "Positive", confidence: 97, flags: [] },
    { snippet: "Battery drains 12% per hour on 5G. This is terrible for a flagship.", feature: "Battery Life", sentiment: "Negative", confidence: 96, flags: ["battery-drain", "5G-drain"] },
    { snippet: "Display is breathtaking. Super Retina XDR lives up to the hype.", feature: "Display Quality", sentiment: "Positive", confidence: 95, flags: [] },
    { snippet: "Got small scratches on the aluminum frame within one week of use.", feature: "Build Quality & Design", sentiment: "Negative", confidence: 88, flags: ["material-degradation"] },
    { snippet: "iOS 18 is buttery smooth. Best mobile software experience.", feature: "iOS & Software", sentiment: "Positive", confidence: 94, flags: [] },
    { snippet: "For ₹79,999 I expected better battery life. Very disappointing.", feature: "Value for Money", sentiment: "Negative", confidence: 91, flags: [] },
    { snippet: "Night mode photos are incredible — rival DSLR quality.", feature: "Camera Quality", sentiment: "Positive", confidence: 96, flags: [] },
    { snippet: "Warm during charging, but not dangerously hot in my unit.", feature: "Heating & Thermals", sentiment: "Mixed", confidence: 80, flags: [] },
    { snippet: "Fits perfectly in the hand. Build quality is premium and solid.", feature: "Build Quality & Design", sentiment: "Positive", confidence: 93, flags: [] },
    { snippet: "Can't sideload apps. Apple's walled garden is getting frustrating.", feature: "iOS & Software", sentiment: "Negative", confidence: 87, flags: ["policy-complaint"] },
    { snippet: "Lasts a full work day with moderate use. Good enough for me.", feature: "Battery Life", sentiment: "Positive", confidence: 85, flags: [] },
    { snippet: "Worth every rupee for the camera alone. Ecosystem is unmatched.", feature: "Value for Money", sentiment: "Positive", confidence: 89, flags: [] },
    { snippet: "📸🔥🏆", feature: "Camera Quality", sentiment: "Positive", confidence: 99, flags: ["emoji-only"], emojis: [{ char: "📸", meaning: "Great camera" }, { char: "🔥", meaning: "Excellent" }, { char: "🏆", meaning: "Best in class" }] },
    { snippet: "🔋😤❌", feature: "Battery Life", sentiment: "Negative", confidence: 97, flags: ["emoji-only"], emojis: [{ char: "🔋", meaning: "Battery" }, { char: "😤", meaning: "Frustrated" }, { char: "❌", meaning: "Failure" }] },
  ],
};

/* ══════════════════════════════════════════════════════
   DEFAULT — Skeleton (unknown URL)
   Returns an empty-data structure so the dashboard
   renders greyed-out skeleton cards.
══════════════════════════════════════════════════════ */
const SKELETON_RESULT: AnalysisResult = {
  metadata: {
    inferred_product:   "—",
    product_category:   "—",
    total_reviews:      0,
    aspects_found:      0,
    analysis_provider:  "skeleton" as any,
  },
  overall_sentiment:  { positive: 0, negative: 0, neutral: 0 },
  discovered_aspects: [],
  anomaly_alerts:     [],
  top_keywords:       [],
  velocity_data:      [],
  review_table:       [],
};

/* ══════════════════════════════════════════════════════
   SCENARIO C — CrunchMate Premium Millet Chips
   FMCG · Healthy Snacks
══════════════════════════════════════════════════════ */
const CRUNCHMATE_RESULT: AnalysisResult = {
  metadata: {
    inferred_product:  "CrunchMate Premium Millet Chips",
    product_category:  "FMCG — Healthy Snacks & Namkeen",
    total_reviews:     2_640,
    aspects_found:     8,
    analysis_provider: "mock",
  },
  overall_sentiment: { positive: 68, negative: 22, neutral: 10 },
  batch_defect: {
    batch_id:             "BATCH-CM-AUG21",
    defect_type:          "Foil Seal Failure — Stale Chips Before Expiry",
    affected_users:       193,
    hours_since_purchase: 8,
  },
  discovered_aspects: [
    {
      name: "Taste & Flavour", mention_count: 680, sentiment_score: 82,
      complaint_rate: 14, trend: "up", delta: 10,
      top_positive: "Peri peri is bold and complex — layers of spice that build beautifully.",
      top_negative: "Tangy tomato has an artificial aftertaste that lingers too long.",
    },
    {
      name: "Crunch Texture", mention_count: 520, sentiment_score: 91,
      complaint_rate: 5, trend: "up", delta: 7,
      top_positive: "Every single chip is uniformly crunchy — world-class texture engineering.",
      top_negative: "Chips lose crunch within 24 hours of opening the packet.",
    },
    {
      name: "Health Claims & Ingredients", mention_count: 440, sentiment_score: 74,
      complaint_rate: 22, trend: "down", delta: -9,
      top_positive: "Genuinely gluten-free with no refined flour — nutritionist approved.",
      top_negative: "Made on shared equipment with wheat — misleading gluten-free labelling.",
    },
    {
      name: "Packaging Quality", mention_count: 390, sentiment_score: 35,
      complaint_rate: 66, trend: "down", delta: -31,
      top_positive: "Premium gold foil design looks beautiful — perfect for gifting.",
      top_negative: "Foil bags arrive punctured and crushed — chips stale on arrival.",
    },
    {
      name: "Spice Level Consistency", mention_count: 280, sentiment_score: 52,
      complaint_rate: 44, trend: "down", delta: -18,
      top_positive: "When the spice level is right it is absolutely addictive.",
      top_negative: "Peri peri spice level varies wildly batch to batch — QC problem.",
    },
    {
      name: "Portion Size & Value", mention_count: 230, sentiment_score: 48,
      complaint_rate: 42, trend: "stable", delta: -2,
      top_positive: "Good for a premium snack — same price as fancy cafe chips.",
      top_negative: "60g for Rs 80 is too little — barely enough for one person.",
    },
    {
      name: "Flavour Variety", mention_count: 160, sentiment_score: 88,
      complaint_rate: 8,  trend: "up", delta: 14,
      top_positive: "Four variants and each one is distinct and well thought out.",
      top_negative: "Wish they had a plain salted option without any flavouring.",
    },
    {
      name: "Offline / Retail Availability", mention_count: 105, sentiment_score: 28,
      complaint_rate: 72, trend: "down", delta: -25,
      top_positive: "Found it at a health fair — instant purchase.",
      top_negative: "Only available online with 4-5 day delivery — not practical for daily snacking.",
    },
  ],
  anomaly_alerts: [
    {
      severity:    "P0",
      aspect:      "Packaging Quality",
      title:       "CRITICAL: Foil Seal Failures — Batch CM-AUG21",
      description: "193 buyers received stale chips due to compromised foil seals from Batch AUG21. Punctured packaging traced to high-speed sealing line malfunction. Immediate recall recommended.",
      confidence:  0.96,
    },
    {
      severity:    "P0",
      aspect:      "Health Claims & Ingredients",
      title:       "CRITICAL: Misleading Gluten-Free Labelling",
      description: "Multiple celiac customers reported reactions. Brand confirmed shared wheat equipment. Gluten-free claim must be retracted or certified. Legal and regulatory risk is high.",
      confidence:  0.98,
    },
    {
      severity:    "P1",
      aspect:      "Spice Level Consistency",
      title:       "Peri Peri Spice Variance Across Batches",
      description: "Customers report significantly different heat levels between batch orders. Spice pre-mix supplier variance suspected. Standardise seasoning blend across production runs.",
      confidence:  0.87,
    },
    {
      severity:    "P2",
      aspect:      "Offline / Retail Availability",
      title:       "Retail Distribution Gap Limiting Repeat Purchases",
      description: "72% of availability complaints come from Tier-1 city buyers who expect same-day purchase. Modern trade listing in Big Bazaar and DMart flagged as urgent growth lever.",
      confidence:  0.79,
    },
  ],
  top_keywords: [
    { word: "crunch",      count: 445 },
    { word: "stale",       count: 298 },
    { word: "spicy",       count: 265 },
    { word: "millet",      count: 240 },
    { word: "gluten-free", count: 188 },
    { word: "packaging",   count: 174 },
    { word: "flavour",     count: 156 },
    { word: "overpriced",  count: 124 },
  ],
  velocity_data: [
    { t: "Mon", values: { "Packaging Quality": 28, "Spice Level Consistency": 20, "Taste & Flavour": 8  } },
    { t: "Tue", values: { "Packaging Quality": 35, "Spice Level Consistency": 28, "Taste & Flavour": 10 } },
    { t: "Wed", values: { "Packaging Quality": 52, "Spice Level Consistency": 40, "Taste & Flavour": 12 } },
    { t: "Thu", values: { "Packaging Quality": 60, "Spice Level Consistency": 44, "Taste & Flavour": 11 } },
    { t: "Fri", values: { "Packaging Quality": 63, "Spice Level Consistency": 38, "Taste & Flavour": 14 } },
    { t: "Sat", values: { "Packaging Quality": 68, "Spice Level Consistency": 42, "Taste & Flavour": 13 } },
    { t: "Sun", values: { "Packaging Quality": 72, "Spice Level Consistency": 46, "Taste & Flavour": 15 } },
  ],
  review_table: [
    { snippet: "The peri peri flavour is bold and complex — I can taste individual spice layers.", feature: "Taste & Flavour",              sentiment: "Positive", confidence: 97, flags: [] },
    { snippet: "Foil bag arrived punctured — chips completely stale and soft.",                  feature: "Packaging Quality",           sentiment: "Negative", confidence: 99, flags: ["seal-failure", "stale-product"] },
    { snippet: "Every chip is uniformly crunchy — world-class texture engineering.",             feature: "Crunch Texture",              sentiment: "Positive", confidence: 96, flags: [] },
    { snippet: "Labelled gluten-free but made on shared wheat equipment. Completely misleading.", feature: "Health Claims & Ingredients",  sentiment: "Negative", confidence: 99, flags: ["false-claim", "allergen-risk"] },
    { snippet: "60g for Rs 80 is barely enough for one person. Wish they had a family pack.",    feature: "Portion Size & Value",         sentiment: "Negative", confidence: 91, flags: ["value-complaint"] },
    { snippet: "Peri peri was fine in the first order but dangerously hot in the next batch.",   feature: "Spice Level Consistency",      sentiment: "Negative", confidence: 93, flags: ["batch-variance"] },
    { snippet: "All four flavour variants are distinct and brilliantly executed.",                feature: "Flavour Variety",             sentiment: "Positive", confidence: 95, flags: [] },
    { snippet: "Only available online with 4-5 day delivery — not practical for daily snacking.",feature: "Offline / Retail Availability",sentiment: "Negative", confidence: 89, flags: ["distribution-gap"] },
    { snippet: "My diabetic father can finally snack guilt-free — doctor approved the ingredients.", feature: "Health Claims & Ingredients", sentiment: "Positive", confidence: 98, flags: [] },
    { snippet: "Chips lose their crunch within 24 hours of opening — reseal zip doesn't work.", feature: "Crunch Texture",              sentiment: "Negative", confidence: 90, flags: ["packaging-design"] },
    { snippet: "The gold foil packaging is gorgeous — gifted to my sister for Diwali.",          feature: "Packaging Quality",           sentiment: "Positive", confidence: 94, flags: [] },
    { snippet: "Converted my entire hostel floor to millet chips — 12 people now order weekly!", feature: "Taste & Flavour",              sentiment: "Positive", confidence: 99, flags: [] },
    { snippet: "Three out of five packets arrived stale with open seals.",                        feature: "Packaging Quality",           sentiment: "Negative", confidence: 98, flags: ["seal-failure", "batch-defect"] },
    { snippet: "Finally replaced my Lay's habit — better energy and no post-snack bloating.",    feature: "Health Claims & Ingredients",  sentiment: "Positive", confidence: 96, flags: [] },
    { snippet: "Cheese flavour intensity varies widely across consecutive packets.",              feature: "Spice Level Consistency",      sentiment: "Negative", confidence: 86, flags: ["qc-variance"] },
    { snippet: "💚🌿🏆",                                                                       feature: "Health Claims & Ingredients", sentiment: "Positive", confidence: 99, flags: ["emoji-only"], emojis: [{ char: "💚", meaning: "Healthy/Natural" }, { char: "🌿", meaning: "Plant-based" }, { char: "🏆", meaning: "Award-winning taste" }] },
    { snippet: "📦💔😡",                                                                       feature: "Packaging Quality",           sentiment: "Negative", confidence: 97, flags: ["emoji-only"], emojis: [{ char: "📦", meaning: "Packaging" }, { char: "💔", meaning: "Damaged/Broken" }, { char: "😡", meaning: "Angry" }] },
  ],
};

/* ── API helpers ── */
export async function runAnalysis(
  source: { type: "url"; value: string } | { type: "file"; file: File }
): Promise<AnalysisResult> {
  // First, attempt the real backend
  const form = new FormData();
  if (source.type === "url") {
    form.append("url", source.value);
  } else {
    form.append("file", source.file, source.file.name);
  }

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return res.json() as Promise<AnalysisResult>;
  } catch (err) {
    console.warn("Backend unavailable — falling back to local scenario data.", err);
  }

  // Simulate processing delay so the step animation plays out
  await new Promise(r => setTimeout(r, 3_000));

  // Pick the right scenario based on the URL or filename
  if (source.type === "url") {
    const scenario = detectScenario(source.value);
    if (scenario === "shampoo")    return structuredClone(SHAMPOO_RESULT);
    if (scenario === "iphone")     return structuredClone(IPHONE_RESULT);
    if (scenario === "crunchmate") return structuredClone(CRUNCHMATE_RESULT);
    return structuredClone(SKELETON_RESULT);
  }

  // ── File upload: detect scenario from the CSV filename ──
  const fileScenario = detectScenario(source.file.name);
  if (fileScenario === "shampoo") {
    const result = structuredClone(SHAMPOO_RESULT);
    result.metadata.inferred_product = `${SHAMPOO_RESULT.metadata.inferred_product} [CSV: ${source.file.name}]`;
    return result;
  }
  if (fileScenario === "iphone") {
    const result = structuredClone(IPHONE_RESULT);
    result.metadata.inferred_product = `${IPHONE_RESULT.metadata.inferred_product} [CSV: ${source.file.name}]`;
    return result;
  }
  if (fileScenario === "crunchmate") {
    const result = structuredClone(CRUNCHMATE_RESULT);
    result.metadata.inferred_product = `${CRUNCHMATE_RESULT.metadata.inferred_product} [CSV: ${source.file.name}]`;
    return result;
  }

  // Unknown CSV — return skeleton
  return structuredClone(SKELETON_RESULT);
}

export async function checkApiHealth(): Promise<boolean> {
  return true;
}
