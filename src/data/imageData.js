import heroImage from "../assets/images/hero.webp";

export const IMAGES = {
  hero: heroImage,
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
