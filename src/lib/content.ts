export const siteConfig = {
  name: "Byond",
  tagline: "Born in Cairo. Built for the world.",
  email: "hello@byond.media",
  phone: "01055551140",
  address:
    "Office no.1, building 52, South Investors Area, 5th settlement, Cairo",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    behance: "https://behance.net",
  },
};

export const heroStatements = [
  "Every brand is a story",
  "Strategy · Cinema · Digital",
  "We do it in double",
  "Built for the world",
];

export const movingStatements = {
  afterHero: [
    "Narratives that outlive the moment",
    "Strategy · Creativity · Technology",
    "Cairo-born · Globally minded",
  ],
  afterWork: [
    "Stories we love to tell",
    "Film · Brand · Digital",
    "Nothing felt staged",
  ],
  beforeContact: [
    "Begin a conversation",
    "Forge a partnership",
    "Beyond expectation",
  ],
};

export const editorialQuotes = [
  {
    quote:
      "People create stories to understand the meaning of what surrounds us. A brand is just that — a story.",
    author: "On narrative",
  },
  {
    quote:
      "Creativity without strategy is noise. We study context first — then we create work that lands.",
    author: "On craft",
  },
  {
    quote:
      "Our goal is not one-time assignments. We forge partnerships built to endure locally and thrive globally.",
    author: "On partnership",
  },
];

export type Capability = {
  index: string;
  title: string;
  code: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Digital Solutions",
    code: "DS",
    description:
      "Platforms and ecosystems where technology serves narrative — not the other way around.",
    image: "/services/digital-solutions.png",
    imageAlt: "Editorial portrait with luminous visor against deep red",
  },
  {
    index: "02",
    title: "Performance Marketing",
    code: "PM",
    description:
      "Data-informed campaigns with editorial sensibility. Conversion without compromising craft.",
    image: "/services/performance-marketing.png",
    imageAlt: "High-contrast silhouette with tinted eyewear on white",
  },
  {
    index: "03",
    title: "Personal Branding",
    code: "PB",
    description:
      "Reputation as architecture — presence, voice, and authority across every touchpoint.",
    image: "/services/personal-branding.png",
    imageAlt: "Dramatic chiaroscuro portrait with rim light",
  },
  {
    index: "04",
    title: "Business Consultation",
    code: "BC",
    description:
      "Strategic counsel for brands entering new markets, repositioning, or scaling.",
    image: "/services/business-consultation.png",
    imageAlt: "Silhouette in contemplation before a luminous frame",
  },
  {
    index: "05",
    title: "Video Production",
    code: "VP",
    description:
      "Cinematic storytelling at our core — spirit, not just spectacle.",
    image: "/services/video-production.png",
    imageAlt: "Cinematic profile with glowing visor on textured red",
  },
];

export const capabilityMarquee = capabilities.map((c) => c.title);

export const approach = [
  {
    step: "01",
    title: "Acknowledge",
    text: "Listen first — to objectives, audience, and the space you wish to occupy.",
  },
  {
    step: "02",
    title: "Plan & Optimize",
    text: "Strategy, concept, moodboard — the path from intention to impact.",
  },
  {
    step: "03",
    title: "Guide",
    text: "Alignment on process and creative direction before a frame is made.",
  },
  {
    step: "04",
    title: "Visualize",
    text: "Location, design, storyboard — until the vision is undeniable.",
  },
  {
    step: "05",
    title: "Execute",
    text: "Cameras roll. Campaigns launch. Nothing less than exceptional.",
  },
  {
    step: "06",
    title: "Deliver",
    text: "Masterpiece in hand — on time, refined until the objective is met.",
  },
];

export type WorkLayout =
  | "full"
  | "offset-right"
  | "offset-left"
  | "wide"
  | "tall"
  | "inset";

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  code: string;
  image: string;
  imageAlt: string;
  layout: WorkLayout;
  mediaBrief: string;
};

export const selectedWork: WorkItem[] = [
  {
    id: "01",
    title: "Felopateer Palace",
    category: "Brand Film · Identity",
    year: "2025",
    code: "FP",
    layout: "full",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    imageAlt: "Luxury interior with warm ambient lighting",
    mediaBrief: "Dark luxury interior — marble, warm gold light",
  },
  {
    id: "02",
    title: "Hassan Allam",
    category: "Employer Branding · Film",
    year: "2024",
    code: "HA",
    layout: "offset-right",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    imageAlt: "Modern corporate tower at dusk",
    mediaBrief: "Corporate architecture at golden hour",
  },
  {
    id: "03",
    title: "Lorenz Global",
    category: "Marketing · Campaign",
    year: "2024",
    code: "LG",
    layout: "inset",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    imageAlt: "Product detail with dramatic lighting",
    mediaBrief: "Premium product photography, moody lighting",
  },
  {
    id: "04",
    title: "Presidential Affairs",
    category: "Documentary · Film",
    year: "2023",
    code: "PA",
    layout: "offset-left",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80",
    imageAlt: "City skyline at night",
    mediaBrief: "Institutional cityscape, cinematic wide shot",
  },
  {
    id: "05",
    title: "KO Squad",
    category: "Creative Ad · Digital",
    year: "2024",
    code: "KO",
    layout: "wide",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80",
    imageAlt: "Abstract fluid gradient",
    mediaBrief: "Abstract dark luxury gradient",
  },
  {
    id: "06",
    title: "Real Estate Launch",
    category: "Film · 3D Visualization",
    year: "2025",
    code: "RE",
    layout: "tall",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    imageAlt: "Luxury residence at twilight",
    mediaBrief: "Luxury villa twilight cinematic",
  },
];

export const testimonials = [
  {
    quote:
      "Byond focuses on the vision beyond the execution. Their films capture not only rhetoric but spirit — nothing felt staged, everything felt true.",
    name: "Mai Ramadan",
    role: "HR Director · PGESCO",
  },
  {
    quote:
      "They compete with top US and UK agencies. Professionalism matched international standards — punctual, committed, and smooth communicators throughout.",
    name: "Mohamed El Hawary",
    role: "CEO · Beuniqueness",
  },
  {
    quote:
      "A different kind of production studio. They found the perfect balance between genuine content and creativity — reaching minds and hearts equally.",
    name: "Shady El Badawy",
    role: "Senior Manager · Ministry of Presidential Affairs, UAE",
  },
];

export const partners = [
  "Hassan Allam",
  "Lorenz",
  "PGESCO",
  "Beuniqueness",
  "KO Squad",
  "Felopateer Palace",
  "Ministry of Presidential Affairs",
  "Four Seasons",
];
