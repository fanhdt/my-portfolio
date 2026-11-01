import { Monitor, Server, Database, Smartphone, Gamepad2, Sparkles, Wrench } from "lucide-react";

// Penjelasan singkat per teknologi (kunci = nama teknologi)
export const SKILL_INFO = {
  HTML: "Struktur dan semantik halaman web.",
  CSS: "Styling, layout, dan desain responsif.",
  JavaScript: "Bahasa utama untuk logika dan interaksi di web.",
  React: "Library untuk membangun antarmuka berbasis komponen.",
  Vue: "Framework frontend yang reaktif dan ringan.",
  "Next.js": "Framework React untuk routing, rendering, dan aplikasi fullstack.",
  "Node.js": "Runtime JavaScript untuk menjalankan server dan API.",
  Express: "Framework Node.js untuk membuat REST API.",
  PHP: "Bahasa server-side untuk aplikasi web.",
  Laravel: "Framework PHP untuk autentikasi, ORM, dan arsitektur backend.",
  MongoDB: "Database NoSQL berbasis dokumen.",
  PostgreSQL: "Database relasional untuk data terstruktur.",
  "React Native": "Membangun aplikasi mobile lintas platform dengan React.",
  Unity: "Game engine untuk game 2D, 3D, dan pengalaman interaktif.",
  "C#": "Bahasa pemrograman untuk scripting di Unity.",
  VR: "Pengalaman realitas virtual yang imersif.",
  Docker: "Container untuk menjalankan aplikasi secara konsisten.",
  MinIO: "Penyimpanan objek (file) yang kompatibel dengan S3.",
  "LLM APIs": "Mengintegrasikan model bahasa ke dalam aplikasi.",
  Prompting: "Merancang instruksi agar output AI lebih akurat.",
  "CI/CD": "Otomatisasi build, test, dan deploy.",
};


export const PRIMARY_GROUPS = [
  { title: "Frontend", icon: Monitor, span: "lg:col-span-5", items: ["HTML", "CSS", "JavaScript", "React", "Vue", "Next.js"] },
  { title: "Backend", icon: Server, span: "lg:col-span-4", items: ["Node.js", "Express", "PHP", "Laravel"] },
  { title: "Database", icon: Database, span: "lg:col-span-3", items: ["MongoDB", "PostgreSQL"] },
  { title: "Mobile", icon: Smartphone, span: "lg:col-span-6", items: ["React Native"] },
  { title: "Game & VR", icon: Gamepad2, span: "lg:col-span-6", items: ["Unity", "C#", "VR"] },
];

// placeholder: isi dengan yang benar-benar sedang kamu pelajari
export const EXPLORING_GROUPS = [
  { title: "AI Integration", icon: Sparkles, span: "lg:col-span-6", items: ["LLM APIs", "Prompting"] },
  { title: "DevOps", icon: Wrench, span: "lg:col-span-6", items: ["Docker", "CI/CD"] },
];
