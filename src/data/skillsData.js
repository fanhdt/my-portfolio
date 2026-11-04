import { Monitor, Server, Database, Smartphone, Gamepad2, Sparkles, Wrench } from "lucide-react";

// Short descriptions for each technology (key = technology name, must match projectsData exactly)
export const SKILL_INFO = {
  HTML: "Defines the structure and semantics of web pages.",
  CSS: "Handles styling, layouts, and responsive design.",
  JavaScript: "The primary language for web logic and interactivity.",
  TypeScript: "JavaScript with static typing for safer and more maintainable code.",
  React: "A library for building component-based user interfaces.",
  Vue: "A lightweight and reactive frontend framework.",
  "Next.js": "A React framework for routing, rendering, and fullstack applications.",
  "Node.js": "A JavaScript runtime for building servers and APIs.",
  Express: "A Node.js framework for building REST APIs.",
  PHP: "A server-side programming language for web applications.",
  Laravel: "A PHP framework for authentication, ORM, and backend architecture.",
  Python: "A versatile programming language for backend development, automation, and AI.",
  FastAPI: "A modern Python framework for building high-performance REST APIs.",
  MongoDB: "A document-oriented NoSQL database.",
  PostgreSQL: "A relational database for structured data.",
  "React Native": "A framework for building cross-platform mobile applications with React.",
  Unity: "A game engine for creating 2D, 3D, and interactive experiences.",
  "C#": "A programming language used for scripting in Unity.",
  VR: "Immersive experiences powered by virtual reality technology.",
  Docker: "A containerization platform for running applications consistently.",
  MinIO: "Object storage compatible with the S3 API.",
  "LLM APIs": "Integrating large language models into applications.",
  Prompting: "Designing instructions to produce more accurate AI outputs.",
  RAG: "Retrieving relevant context from documents before generating AI responses.",
  "CI/CD": "Automating build, testing, and deployment workflows.",
};

export const PRIMARY_GROUPS = [
  { title: "Frontend", icon: Monitor, span: "lg:col-span-5", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Next.js"] },
  { title: "Backend", icon: Server, span: "lg:col-span-4", items: ["Node.js", "Express", "PHP", "Laravel", "Python", "FastAPI"] },
  { title: "Database", icon: Database, span: "lg:col-span-3", items: ["MongoDB", "PostgreSQL"] },
  { title: "Mobile", icon: Smartphone, span: "lg:col-span-6", items: ["React Native"] },
  { title: "Game & VR", icon: Gamepad2, span: "lg:col-span-6", items: ["Unity", "C#", "VR"] },
];

// Technologies and tools currently being explored
export const EXPLORING_GROUPS = [
  { title: "AI Integration", icon: Sparkles, span: "lg:col-span-6", items: ["LLM APIs", "Prompting", "RAG"] },
  { title: "DevOps", icon: Wrench, span: "lg:col-span-6", items: ["Docker", "CI/CD"] },
];

// RPG-style statistics (About page). Values range from 0 to 100.
// NOTE: TypeScript, Python, and FastAPI values below are examples.
// Adjust them based on your actual proficiency.
export const STAT_GROUPS = [
  {
    label: "Frontend",
    items: [
      { name: "HTML", value: 95 },
      { name: "CSS", value: 90 },
      { name: "JavaScript", value: 88 },
      { name: "TypeScript", value: 75 },
      { name: "React", value: 90 },
      { name: "Vue", value: 86 },
      { name: "Next.js", value: 85 },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Node.js", value: 82 },
      { name: "Express", value: 85 },
      { name: "PHP", value: 80 },
      { name: "Laravel", value: 85 },
      { name: "Python", value: 70 },
      { name: "FastAPI", value: 65 },
      { name: "Database", value: 75 },
    ],
  },
  { label: "Mobile", items: [{ name: "React Native", value: 60 }] },
  {
    label: "DevOps",
    items: [
      { name: "Docker", value: 50 },
      { name: "CI/CD", value: 40 },
    ],
  },
];

// Calculate the average level of a group and round to the nearest integer.
export const averageLevel = (items) => Math.round(items.reduce((sum, it) => sum + it.value, 0) / items.length);
