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
    title: "Narrative",
    text: "Brands are stories people believe — we build the ones that stay.",
  },
  {
    index: "02",
    title: "Strategy",
    text: "Context first. Then craft that lands — not noise dressed as creativity.",
  },
  {
    index: "03",
    title: "Craft",
    text: "Cinema and digital held to the same standard — spirit, not spectacle.",
  },
  {
    index: "04",
    title: "Partnership",
    text: "Built to endure locally and thrive globally — not one-time assignments.",
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
    title: "PGESCO Video",
    client: "PGESCO",
    category: "BRAND FILM",
    youtubeId: "ZsMYbdpliQE",
    duration: "09:50",
    thumbnail: "https://img.youtube.com/vi/ZsMYbdpliQE/hqdefault.jpg",
  },
  {
    id: "02",
    title: "Hassan Allam Academy",
    client: "Hassan Allam",
    category: "CORPORATE",
    youtubeId: "MavqDosrHV8",
    duration: "03:11",
    thumbnail: "https://img.youtube.com/vi/MavqDosrHV8/hqdefault.jpg",
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
    title: "Menassat Commercial",
    client: "Menassat",
    category: "COMMERCIAL",
    youtubeId: "mpRjRP7kbUU",
    duration: "01:56",
    thumbnail: "https://img.youtube.com/vi/mpRjRP7kbUU/hqdefault.jpg",
  },
  {
    id: "06",
    title: "Jotun Factory - Egypt",
    client: "Jotun",
    category: "INDUSTRIAL",
    youtubeId: "OTM-4qm5ljk",
    duration: "01:18",
    thumbnail: "https://img.youtube.com/vi/OTM-4qm5ljk/hqdefault.jpg",
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
