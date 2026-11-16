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

export const principles = [
  {
    index: "01",
    title: "Strategy",
    text: "Every successful brand starts with a clear vision. We define its positioning, audience, and direction, turning business objectives into a focused strategy for growth.",
  },
  {
    index: "02",
    title: "Identity",
    text: "We shape distinctive brand identities through visual direction, storytelling, and a consistent voice that makes brands recognizable and memorable.",
  },
  {
    index: "03",
    title: "Content",
    text: "From the first concept to the final frame, we create compelling content through creative thinking, strategic storytelling, and high-quality production.",
  },
  {
    index: "04",
    title: "Growth",
    text: "We turn strategy into momentum through digital presence, social media management, and meaningful audience connections that drive long-term brand growth.",
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
    image: "/services/digital-solutions.webp",
    imageAlt:
      "Hands on a laptop with glowing red holographic dashboards floating above it",
  },
  {
    index: "02",
    title: "Performance Marketing",
    code: "PM",
    description:
      "Data-informed campaigns with editorial sensibility. Conversion without compromising craft.",
    image: "/services/performance-marketing.webp",
    imageAlt:
      "Marketer at a laptop with streams of red light flowing into revenue and conversion metrics",
  },
  {
    index: "03",
    title: "Personal Branding",
    code: "PB",
    description:
      "Reputation as architecture — presence, voice, and authority across every touchpoint.",
    image: "/services/personal-branding.webp",
    imageAlt:
      "Man in a white suit standing still while a blurred crowd moves around him",
  },
  {
    index: "04",
    title: "Business Consultation",
    code: "BC",
    description:
      "Strategic counsel for brands entering new markets, repositioning, or scaling.",
    image: "/services/business-consultation.webp",
    imageAlt:
      "Two executives in discussion across a polished boardroom table with a city skyline behind",
  },
  {
    index: "05",
    title: "Video Production",
    code: "VP",
    description:
      "Cinematic storytelling at our core — spirit, not just spectacle.",
    image: "/services/video-production.webp",
    imageAlt:
      "Director's chair with a clapperboard on a cinema set lit in deep red",
  },
];

export const capabilityMarquee = capabilities.map((c) => c.title);

export type WorkItem = {
  id: string;
  title: string;
  client: string;
  category: string;
  youtubeId: string;
  duration: string;
  thumbnail: string;
};

export const selectedWork: WorkItem[] = [
  {
    id: "01",
    title: "Hassan Allam Academy",
    client: "Hassan Allam",
    category: "CORPORATE",
    youtubeId: "MavqDosrHV8",
    duration: "03:11",
    thumbnail: "https://img.youtube.com/vi/MavqDosrHV8/hqdefault.jpg",
  },
  {
    id: "02",
    title: "Jotun Factory - Egypt",
    client: "Jotun",
    category: "INDUSTRIAL",
    youtubeId: "OTM-4qm5ljk",
    duration: "01:18",
    thumbnail: "https://img.youtube.com/vi/OTM-4qm5ljk/hqdefault.jpg",
  },
  {
    id: "03",
    title: "Sorouh AD",
    client: "Sorouh",
    category: "COMMERCIAL",
    youtubeId: "rm5jroM6kCg",
    duration: "01:10",
    thumbnail: "https://img.youtube.com/vi/rm5jroM6kCg/hqdefault.jpg",
  },
  {
    id: "04",
    title: "Hassan Allam - NEW CAPITAL",
    client: "Hassan Allam",
    category: "DOCUMENTARY",
    youtubeId: "ZA_YPogBMRU",
    duration: "01:34",
    thumbnail: "https://img.youtube.com/vi/ZA_YPogBMRU/hqdefault.jpg",
  },
  {
    id: "05",
    title: "PGESCO Video",
    client: "PGESCO",
    category: "BRAND FILM",
    youtubeId: "ZsMYbdpliQE",
    duration: "09:50",
    thumbnail: "https://img.youtube.com/vi/ZsMYbdpliQE/hqdefault.jpg",
  },
  {
    id: "06",
    title: "Menassat Commercial",
    client: "Menassat",
    category: "COMMERCIAL",
    youtubeId: "mpRjRP7kbUU",
    duration: "01:56",
    thumbnail: "https://img.youtube.com/vi/mpRjRP7kbUU/hqdefault.jpg",
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

/** Hero floating gallery — files live in /public/hero (see scripts/prepare-images.py) */
export type HeroShot = {
  id: string;
  image: string;
  label: string;
  alt: string;
};

export const heroShowcase: HeroShot[] = [
  {
    id: "kareem-stage",
    image: "/hero/kareem-stage.webp",
    label: "Personal Brand",
    alt: "Kareem Hanafy speaking on stage with the Giza pyramids behind him",
  },
  {
    id: "jewelry",
    image: "/hero/jewelry.webp",
    label: "Luxury",
    alt: "Diamond jewelry on burgundy satin",
  },
  {
    id: "studio",
    image: "/hero/studio.webp",
    label: "Production",
    alt: "Film crew shooting in a studio with burgundy accents",
  },
  {
    id: "clinics",
    image: "/hero/clinics.webp",
    label: "Clinics",
    alt: "Elegant aesthetic clinic treatment room in warm marble and burgundy",
  },
  {
    id: "construction",
    image: "/hero/construction.webp",
    label: "Construction",
    alt: "Engineer holding blueprints with a double-exposure city skyline",
  },
  {
    id: "corporate",
    image: "/hero/corporate.webp",
    label: "Corporate",
    alt: "Executives in a glass boardroom reviewing analytics",
  },
  {
    id: "cosmetics",
    image: "/hero/cosmetics.webp",
    label: "Beauty",
    alt: "Close-up beauty portrait against a deep burgundy backdrop",
  },
  {
    id: "interiors",
    image: "/hero/interiors.webp",
    label: "Interiors",
    alt: "Classic living room with patterned armchairs and a burgundy sofa",
  },
  {
    id: "real-estate",
    image: "/hero/real-estate.webp",
    label: "Real Estate",
    alt: "Luxury balcony overlooking Burj Khalifa at sunset",
  },
];
