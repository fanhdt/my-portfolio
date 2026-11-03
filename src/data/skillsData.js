import { Monitor, Server, Database, Smartphone, Gamepad2, Sparkles, Wrench } from "lucide-react";

// Penjelasan singkat per teknologi (kunci = nama teknologi, harus sama persis dengan yang di projectsData)
export const SKILL_INFO = {
  HTML: "Struktur dan semantik halaman web.",
  CSS: "Styling, layout, dan desain responsif.",
  JavaScript: "Bahasa utama untuk logika dan interaksi di web.",
  TypeScript: "JavaScript dengan tipe statis untuk kode yang lebih aman dan mudah dirawat.",
  React: "Library untuk membangun antarmuka berbasis komponen.",
  Vue: "Framework frontend yang reaktif dan ringan.",
  "Next.js": "Framework React untuk routing, rendering, dan aplikasi fullstack.",
  "Node.js": "Runtime JavaScript untuk menjalankan server dan API.",
  Express: "Framework Node.js untuk membuat REST API.",
  PHP: "Bahasa server-side untuk aplikasi web.",
  Laravel: "Framework PHP untuk autentikasi, ORM, dan arsitektur backend.",
  Python: "Bahasa serbaguna untuk backend, otomasi, dan AI.",
  FastAPI: "Framework Python modern untuk membangun REST API yang cepat.",
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
  RAG: "Menjawab pertanyaan dari dokumen dengan mengambil konteks relevan sebelum model menjawab.",
  "CI/CD": "Otomatisasi build, test, dan deploy.",
};

export const PRIMARY_GROUPS = [
  { title: "Frontend", icon: Monitor, span: "lg:col-span-5", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Next.js"] },
  { title: "Backend", icon: Server, span: "lg:col-span-4", items: ["Node.js", "Express", "PHP", "Laravel", "Python", "FastAPI"] },
  { title: "Database", icon: Database, span: "lg:col-span-3", items: ["MongoDB", "PostgreSQL"] },
  { title: "Mobile", icon: Smartphone, span: "lg:col-span-6", items: ["React Native"] },
  { title: "Game & VR", icon: Gamepad2, span: "lg:col-span-6", items: ["Unity", "C#", "VR"] },
];

// placeholder: isi dengan yang benar-benar sedang kamu pelajari
export const EXPLORING_GROUPS = [
  { title: "AI Integration", icon: Sparkles, span: "lg:col-span-6", items: ["LLM APIs", "Prompting", "RAG"] },
  { title: "DevOps", icon: Wrench, span: "lg:col-span-6", items: ["Docker", "CI/CD"] },
];

// Statistik gaya RPG (halaman About). Nilai 0-100.
// CATATAN: nilai TypeScript, Python, FastAPI di bawah hanya contoh, ganti sesuai penilaianmu.
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

// rata-rata nilai satu grup, dibulatkan
export const averageLevel = (items) => Math.round(items.reduce((sum, it) => sum + it.value, 0) / items.length);
