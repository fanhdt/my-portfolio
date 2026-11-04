import heroImage from "../assets/images/hero.webp";
import heroProfile from "../assets/images/profile.jpeg";
import backgroundImage from "../assets/images/background.jpeg";

export const IMAGES = {
  hero: heroImage,
  profile: heroProfile,
  background: backgroundImage,
};

const modules = import.meta.glob("../assets/images/*/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const byProject = {};
for (const [path, src] of Object.entries(modules)) {
  const [, slug, file] = path.match(/images\/([^/]+)\/([^/]+)$/);
  (byProject[slug] ??= []).push({ file, src });
}

for (const slug in byProject) {
  byProject[slug].sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
  byProject[slug] = byProject[slug].map((i) => i.src);
}

export const getProjectImages = (slug) => byProject[slug] ?? [];
export const getProjectCover = (slug) => byProject[slug]?.[0];
