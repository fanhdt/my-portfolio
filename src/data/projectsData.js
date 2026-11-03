import { getProjectCover, getProjectImages, IMAGES } from "./imageData";
import { SKILL_INFO } from "./skillsData";

export const PROJECTS = [
  {
    slug: "slms", // = nama folder di assets/images/projects/slms
    title: "Smart Laboratory Management System",
    short: "SLMS",
    category: "Web",
    description:
      "A multi-tenant platform for managing several laboratories in one system, covering lab and equipment booking, services and packages, assets, online payment, and photo delivery. Built as a final-year thesis project, planned for adoption at UPI Cibiru.",
    image: getProjectCover("slms") ?? IMAGES.hero,
    screenshots: getProjectImages("slms"),
    features: [
      "Multi-laboratory management with dynamic branding per lab",
      "Booking for labs, equipment rental, and services & packages",
      "Asset management with status tracking",
      "Online payment via Midtrans",
      "Realtime notifications (Laravel Reverb)",
      "RFID & QR code check-in",
      "Photo delivery workflow for photography labs",
      "Multi-level admin panel with role & permission control",
    ],
    technologies: ["Laravel", "PHP", "Vue", "TypeScript", "PostgreSQL", "Docker", "MinIO"],
    role: "Fullstack Developer",
    impact: ["Replaces manual lab and equipment booking with one centralized system", "Handles multiple labs, each with its own branding and settings", "Planned for adoption at UPI Cibiru campus"],
    liveUrl: "https://slmsupi.studio",
    githubUrl: "https://github.com/fanhdt/main-slms",
  },
  {
    slug: "thinker", // = nama folder di assets/images/projects/thinker
    title: "Thinker: Modular AI Assistant",
    short: "Thinker",
    category: "AI",
    description:
      "A Python AI system that runs in two modes: a personal assistant with long-term memory, document RAG, goals, and a planner with reflection loop, and an AI service for SLMS that answers lab questions from real-time data. Reachable through a REST API, a Telegram bot, and a React web interface.",
    image: getProjectCover("thinker") ?? IMAGES.hero,
    screenshots: getProjectImages("thinker"),
    features: [
      "Personal mode: long-term memory (create, update, delete), document RAG, goals, and personalization",
      "Planner that breaks complex requests into tasks, with a bounded reflection loop",
      "SLMS mode: FAQ via knowledge base and real-time equipment, schedule, and booking data",
      "Booking drafts handed off to the user; the AI never creates bookings or payments",
      "Model-agnostic LLM layer with automatic failover across Gemini, OpenAI, Groq, DeepSeek, OpenRouter",
      "Multiple interfaces: Telegram bot and React web chat on the same message pipeline",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "LLM APIs", "Prompting", "RAG", "Docker"],
    role: "Backend & AI Engineer",
    impact: [
      "One backend serves two modes, switched by configuration instead of separate codebases",
      "Keeps working when one LLM provider hits its rate limit or quota",
      "Answers real-time lab questions from verified SLMS data, not model guesses",
    ],
    liveUrl: null, // Thinker belum punya demo sendiri
    githubUrl: "https://github.com/fanhdt/thinker",
  },
  {
    slug: "balanja",
    title: "Balanja: Fullstack E-Commerce Platform",
    short: "Balanja",
    category: "Web & Mobile",
    description: "A fullstack e-commerce platform built with a modern JavaScript ecosystem. Balanja provides an integrated shopping experience through a web application and mobile app, supported by a REST API backend",

    image: getProjectCover("balanja") ?? IMAGES.hero,
    screenshots: getProjectImages("balanja"),

    features: [
      "Fullstack architecture with a Node.js and Express REST API backend",
      "Product management with Cloudinary image uploads and support for multiple product images",
      "Secure authentication and user management powered by Clerk",
      "E-commerce shopping experience with product browsing and purchasing workflows",
      "Admin dashboard built with React, Vite, and TanStack ecosystem",
      "Event-driven background workflows and asynchronous processing using Inngest",
      "MongoDB database integration using Mongoose",
      "Cross-platform mobile application developed with React Native and Expo",
      "Error monitoring and application observability with Sentry",
    ],

    technologies: ["JavaScript", "TypeScript", "Node.js", "Express.js", "MongoDB", "Mongoose", "React", "Vite", "TanStack", "React Native", "Expo", "Clerk", "Cloudinary", "Inngest", "Sentry"],

    role: "Fullstack Developer",

    impact: [
      "Connects web and mobile applications through a centralized REST API backend",
      "Separates customer-facing shopping experiences from administrative product management",
      "Integrates cloud-based media storage to manage product images efficiently",
      "Uses event-driven workflows to handle asynchronous application processes",
    ],

    liveUrl: "https://balanja-r27dq.sevalla.app/dashboard",
    githubUrl: "https://github.com/fanhdt/balanja",
  },
  {
    slug: "akbar-portofolio-motion",
    title: "Akbar Motion Design Portfolio",
    short: "Akbar Motion",
    category: "Web Development",
    description:
      "A dynamic portfolio website built for a motion designer to showcase creative works through an interactive, video-focused experience. Integrated with Sanity CMS, the platform allows projects to be managed dynamically, including video showcases, styleframes, and highlight clips.",

    image: getProjectCover("akbar-portofolio-motion") ?? IMAGES.hero,
    screenshots: getProjectImages("akbar-portofolio-motion"),

    features: [
      "Dynamic project management powered by Sanity CMS",
      "Embedded Sanity Studio for creating, editing, publishing, and managing portfolio projects",
      "Project gallery with category filters for Client and Personal projects",
      "YouTube and Vimeo video embedding with autoplay and looping support",
      "Dynamic project detail pages generated from unique project slugs",
      "Dedicated video showcase section for each project",
      "Styleframes gallery with support for multiple uploaded images",
      "Highlight clips management with uploaded video assets",
      "Automatic video highlight fallback using the main project video",
      "Animated project cards, hover interactions, and transitions using Framer Motion",
      "Responsive layout for desktop and mobile devices",
    ],

    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Next Sanity", "Styled Components"],

    role: "Fullstack Developer",

    impact: [
      "Simplifies portfolio content management through a dedicated CMS",
      "Allows the artist to publish and update creative projects without modifying frontend code",
      "Provides a structured presentation for client and personal motion design projects",
      "Combines video showcases, styleframes, and highlight clips into a unified project experience",
    ],

    liveUrl: "https://akbar-portofolio-motion.vercel.app/",
    githubUrl: "https://github.com/fanhdt/akbar-portofolio-motion",
  },
];

// peringatan di console saat dev kalau ada teknologi yang tidak punya padanan di SKILL_INFO
if (import.meta.env.DEV) {
  PROJECTS.forEach((p) =>
    p.technologies.forEach((t) => {
      if (!(t in SKILL_INFO)) console.warn(`[projects] "${t}" di "${p.slug}" tidak ada di SKILL_INFO`);
    }),
  );
}
