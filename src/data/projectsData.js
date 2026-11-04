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
    category: "Mobile",
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

    technologies: ["JavaScript", "TypeScript", "Node.js", "Express", "MongoDB", "Mongoose", "React", "Vite", "TanStack", "React Native", "Expo", "Clerk", "Cloudinary", "Inngest", "Sentry"],

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
    slug: "jedx-learning-platform",
    title: "JedX Learning Platform",
    short: "JedX Learning Platform",
    category: "Web",

    description:
      "A web-based learning platform designed to provide an accessible and user-friendly experience for discovering online courses. The platform features a responsive-style landing page structure, course listings dynamically retrieved from an external JSON source, and dedicated navigation to individual course details.",

    image: getProjectCover("jedx-learning-platform") ?? IMAGES.hero,
    screenshots: getProjectImages("jedx-learning-platform"),

    features: [
      "Learning platform landing page with Home, About, Courses, and Contact sections",
      "Dynamic course listing retrieved from an external JSON source using JavaScript Fetch API",
      "Course cards displaying categories, titles, descriptions, mentors, and pricing",
      "Individual course navigation using URL query parameters",
      "Mobile navigation menu with hamburger toggle interaction",
      "External course data integration through GitHub Gist",
      "Contact section with an embedded Google Maps location and contact form",
    ],

    technologies: ["HTML", "CSS", "JavaScript", "Fetch API", "JSON", "GitHub Gist"],

    role: "Frontend Developer",

    impact: [
      "Demonstrates dynamic content rendering by separating course data from the website interface",
      "Makes course information easier to manage through an external JSON data source",
      "Provides a centralized interface for users to explore available learning opportunities",
    ],

    liveUrl: "https://jedx-learning-platform.vercel.app/",
    githubUrl: "https://github.com/fanhdt/jedx-learning-platform",
  },

  {
    slug: "ruang-kala",
    title: "Ruang Kala: Educational Creative Agency",
    short: "Ruang Kala",
    category: "Web",

    description:
      "A cinematic agency website designed for Ruang Kala, an educational creative agency specializing in photography, documentation, creative production, and visual education. The website features an immersive editorial experience with interactive camera-inspired elements, cinematic transitions, and scroll-driven storytelling.",

    image: getProjectCover("ruang-kala") ?? IMAGES.hero,
    screenshots: getProjectImages("ruang-kala"),

    features: [
      "Cinematic preloader with animated loading progress and branded introduction",
      "Interactive editorial navigation with fullscreen menu transitions",
      "Custom cursor with contextual labels, animated trails, and image previews",
      "Ambient studio lighting effect following mouse movement",
      "Camera-inspired interactive portal with scroll-driven visual transitions",
      "Horizontal project gallery with pinned scrolling interactions",
      "Scroll-based storytelling with animated typography and visual transitions",
      "Interactive production process showcase with dynamic content switching",
      "Magnetic buttons and interactive hover effects",
      "Responsive navigation and adaptive visual themes",
      "Behind-the-scenes video showcase with viewport-based playback optimization",
      "Project inquiry modal with interactive contact form",
      "Live studio clock displaying Jakarta local time",
    ],

    technologies: ["HTML", "CSS", "JavaScript", "Vite", "GSAP", "ScrollTrigger", "Lenis"],

    role: "Frontend Developer",

    impact: [
      "Creates an immersive digital identity for a photography and creative production agency",
      "Transforms conventional website navigation into an interactive editorial experience",
      "Showcases creative services and portfolio content through cinematic visual storytelling",
      "Combines animation, smooth scrolling, and interactive elements into a cohesive browsing experience",
    ],

    liveUrl: "https://ruang-kala-virid.vercel.app/",
    githubUrl: "https://github.com/fanhdt/ruang-kala",
  },

  {
    slug: "akbar-portofolio-motion",
    title: "Akbar Motion Design Portfolio",
    short: "Akbar Motion",
    category: "Web",
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

    technologies: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Next Sanity", "Styled Components"],

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
  {
    slug: "ecoprint-vr",
    title: "Ecoprint VR: Interactive Learning Experience",
    short: "Ecoprint VR",
    category: "Game",
    description:
      "An immersive VR educational application designed to teach elementary school students the ecoprint process through interactive 3D simulations. Built with Unity and Google Cardboard XR, the application guides students through collecting natural materials, preparing fabric, transferring leaf pigments, and completing an interactive learning quiz.",

    image: getProjectCover("ecoprint-vr") ?? IMAGES.hero,
    screenshots: getProjectImages("ecoprint-vr"),

    features: [
      "Mobile VR experience for Android smartphones using Google Cardboard",
      "First-person perspective with head tracking through smartphone gyroscope",
      "Gaze-based interaction system with reticle feedback and timed object selection",
      "Interactive ecoprint learning simulation from material collection to final result",
      "Multiple 3D environments, including bedroom and backyard scenes",
      "Educational voice narration explaining each stage of the ecoprint process",
      "Interactive quiz with randomized multiple-choice questions and instant feedback",
      "Optimized low-poly 3D assets and rendering for mid-range Android devices",
    ],

    technologies: ["Unity", "C#", "Google Cardboard XR", "Blender", "Android", "VR"],

    role: "VR Developer",

    impact: [
      "Transforms the traditional ecoprint learning process into an immersive virtual experience",
      "Provides hands-on learning simulations without requiring physical ecoprint materials",
      "Makes VR-based learning more accessible through affordable Google Cardboard headsets",
      "Combines interactive simulations, educational narration, and quizzes in one application",
    ],

    liveUrl: null,
    githubUrl: null,
    downloadUrl: "https://drive.google.com/file/d/1sNInOIGHpDtA704MRgW3W-71150X8Tdi/view?usp=drive_link",
  },
  {
    slug: "vr-mitigasi-banjir",
    title: "VR Flood Mitigation: Disaster Preparedness Simulation",
    short: "VR Mitigasi Banjir",
    category: "Game",

    description:
      "An interactive Virtual Reality learning application designed to teach elementary school students how to respond safely to flood disasters. Developed with Unity and Blender for Android smartphones using Google Cardboard, the application simulates real-life flood emergency situations through first-person experiences. Students learn essential mitigation procedures, from identifying early warning signs and preventing electrical hazards to securing important belongings, evacuating to higher ground, and maintaining environmental hygiene after a flood.",

    image: getProjectCover("vr-mitigasi-banjir") ?? IMAGES.hero,
    screenshots: getProjectImages("vr-mitigasi-banjir"),

    features: [
      "Mobile VR experience for Android smartphones using Google Cardboard",
      "First-person perspective with head tracking through smartphone gyroscope",
      "Flood emergency simulation in a familiar home environment",
      "Interactive weather observation and early flood warning scenarios",
      "Hands-on simulation for preventing electrical hazards by unplugging electronic devices",
      "Interactive system for securing important belongings such as documents, books, and first-aid kits",
      "Self-evacuation simulation through stairs to a safer, elevated area",
      "Post-flood environmental cleaning simulation",
      "Gaze-based interaction system with a reticle and 1.5-second selection duration",
      "Audio narration, environmental sound effects, and interactive feedback",
      "Interactive multiple-choice quiz with visual and audio feedback",
      "Optimized low-poly 3D assets, baked lighting, and occlusion culling for Android performance",
    ],

    technologies: ["Unity", "C#", "Blender", "Google Cardboard XR", "Android", "VR", "3D Modeling", "Audacity"],

    role: "VR Developer",

    impact: [
      "Provides a safe virtual environment for students to practice flood emergency procedures without facing real-world risks",
      "Helps students understand flood mitigation through interactive, hands-on learning experiences",
      "Introduces practical safety measures, including electrical hazard prevention, securing important belongings, and self-evacuation",
      "Makes VR-based disaster preparedness learning more accessible through affordable Google Cardboard devices",
      "Supports independent learning through guided narration, interactive tasks, and quiz-based evaluation",
    ],

    liveUrl: null,
    githubUrl: null,
    downloadUrl: "https://drive.google.com/file/d/1QMuOoGdCGYEF-LpDGzzuU_-VnEO1mzQF/view?usp=drive_link",
  },
  {
    slug: "vr-siklus-air",
    title: "VR Water Cycle: An Interactive Learning Experience",
    short: "VR Siklus Air",
    category: "Game",

    description:
      "An educational mobile Virtual Reality application designed to help elementary school students understand the water cycle through an immersive first-person experience. Students experience the journey of a water droplet as it travels through different stages of the water cycle, making scientific concepts easier to understand through interactive 3D environments.",

    image: getProjectCover("vr-siklus-air") ?? IMAGES.hero,
    screenshots: getProjectImages("vr-siklus-air"),

    features: [
      "Mobile VR learning experience for Android smartphones",
      "First-person perspective where students experience the water cycle as a water droplet",
      "Immersive 3D environments representing different stages of the water cycle",
      "Educational journey covering evaporation, condensation, precipitation, and water collection",
      "Visual learning experience designed for elementary school students",
      "Interactive exploration of the natural water cycle process",
      "VR-based educational simulation with an immersive first-person viewpoint",
    ],

    technologies: ["Unity", "C#", "Blender", "Google Cardboard XR", "Android", "VR", "3D Modeling"],

    role: "VR Developer",

    impact: [
      "Transforms abstract water cycle concepts into an immersive first-person learning experience",
      "Helps elementary school students understand the journey of water through visual 3D simulation",
      "Encourages experiential learning by allowing students to explore the water cycle from the perspective of a water droplet",
      "Makes VR-based science education more accessible through Android smartphones",
    ],

    liveUrl: null,
    githubUrl: null,
    downloadUrl: null,
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
