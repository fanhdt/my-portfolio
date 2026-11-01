import { useState } from "react";
import { Link } from "react-router";
import { Globe, Smartphone, Gamepad2 } from "lucide-react";
import PageNotch from "../components/PageNotch";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projectsData";
import { SKILL_INFO, PRIMARY_GROUPS, EXPLORING_GROUPS } from "../data/skillsData";

const TABS = [
  { id: "primary", label: "Primary" },
  { id: "experience", label: "Experience" },
  { id: "exploring", label: "Exploring" },
];

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const STRIPES = { background: "repeating-linear-gradient(-45deg, #ffffff 0 6px, transparent 6px 14px)" };

// lebar grup otomatis untuk tab yang datanya dihitung
const SPANS = { 1: "lg:col-span-12", 2: "lg:col-span-6", 3: "lg:col-span-4" };

// Experience: dihitung dari proyek, tidak ditulis manual
const CAT_ICON = { Web: Globe, Mobile: Smartphone, Game: Gamepad2 };
const EXPERIENCE_GROUPS = (() => {
  const groups = ["Web", "Mobile", "Game"]
    .map((cat) => ({
      title: `${cat} projects`,
      icon: CAT_ICON[cat],
      items: [...new Set(PROJECTS.filter((p) => p.category === cat).flatMap((p) => p.technologies))],
    }))
    .filter((g) => g.items.length);
  return groups.map((g) => ({ ...g, span: SPANS[groups.length] ?? "lg:col-span-4" }));
})();

const GROUPS = {
  primary: PRIMARY_GROUPS,
  experience: EXPERIENCE_GROUPS,
  exploring: EXPLORING_GROUPS,
};

const Cross = ({ className = "" }) => (
  <svg aria-hidden viewBox="0 0 12 12" className={`size-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 0v12M0 6h12" />
  </svg>
);

const projectsUsing = (name) => PROJECTS.filter((p) => p.technologies.some((t) => t.toLowerCase() === name.toLowerCase()));

const Skills = () => {
  const [tab, setTab] = useState("primary");
  const [selected, setSelected] = useState(null);

  const groups = GROUPS[tab];
  const usedIn = selected ? projectsUsing(selected) : [];

  const changeTab = (id) => {
    setTab(id);
    setSelected(null);
  };

  return (
    <section className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />
      <svg aria-hidden viewBox="0 0 220 110" className="pointer-events-none absolute right-[30%] top-6 hidden w-56 text-white opacity-[0.1] lg:block" fill="none" stroke="currentColor">
        <path d="M0 40 H60 L80 20 H200 M60 40 V90 H120 L140 70 H220" />
        <circle cx="200" cy="20" r="3" />
        <circle cx="220" cy="70" r="3" />
      </svg>

      <PageNotch />

      {/* Desktop: satu layar. Hp/tablet: scroll di dalam kartu */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] lg:overflow-y-hidden">
        <div className="flex min-h-full flex-col gap-5 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-4 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8">
          {/* HEADER + TABS */}
          <header className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="size-2.5 bg-lime-300" />
                <span className="h-px w-14 bg-white/30" />
              </div>
              <h1 className="mt-2 font-display uppercase leading-[0.85] tracking-wide" style={{ fontSize: "clamp(2.25rem, min(10vh, 12vw), 5rem)" }}>
                Skills
              </h1>
              <p className="mt-2 font-body text-sm text-neutral-300 sm:text-base">Technologies I work with and explore.</p>
            </div>

            <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => changeTab(t.id)}
                  className={`rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest transition-colors sm:text-xs ${
                    tab === t.id ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-neutral-300 ring-1 ring-white/15 hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </header>

          {/* GRUP TEKNOLOGI */}
          <div className="grid shrink-0 items-start gap-4 lg:grid-cols-12 lg:gap-4">
            {groups.length === 0 ? (
              <p className="font-body text-sm text-neutral-400 lg:col-span-12">Belum ada data.</p>
            ) : (
              groups.map(({ title, icon: Icon, span, items }) => (
                <article key={title} className={`rounded-2xl p-5 ring-1 ring-white/12 lg:p-5 ${span}`}>
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 shrink-0 text-lime-300" />
                    <h2 className="font-body text-sm font-extrabold uppercase tracking-widest">{title}</h2>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((name) => {
                      const active = selected === name;
                      return (
                        <li key={name}>
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelected(active ? null : name)}
                            className={`flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 font-body text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 sm:text-sm ${
                              active ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10"
                            }`}
                          >
                            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${active ? "bg-neutral-900/10" : "bg-white/10 text-lime-300"}`}>
                              <TechIcon name={name} className="size-3.5" />
                            </span>
                            {name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))
            )}
          </div>

          {/* PANGGUNG BAWAH: geometris + detail (atau quote kalau belum memilih) */}
          <div className="relative mt-4 min-h-44 shrink-0 sm:min-h-48 lg:mt-auto lg:min-h-0 lg:flex-1">
            <div aria-hidden className="absolute bottom-0 left-0 right-0 hidden h-px bg-white/15 md:block" />

            <div aria-hidden className="absolute inset-y-0 right-0 w-full bg-white/10 lg:w-[58%] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]" />
            <div aria-hidden className="absolute bottom-0 left-[6%] hidden h-14 w-28 bg-lime-300 [clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] lg:block" />
            <div aria-hidden className="absolute bottom-0 left-[20%] hidden h-9 w-16 bg-sky-200 [clip-path:polygon(30%_0,100%_0,70%_100%,0_100%)] lg:block" />
            <div aria-hidden className="absolute bottom-14 left-[18%] hidden size-2.5 rotate-45 bg-pink-400 lg:block" />
            <div aria-hidden className="absolute left-[30%] top-6 hidden h-2 w-16 opacity-25 lg:block" style={STRIPES} />
            <Cross className="absolute left-[34%] top-1/2 hidden text-white opacity-25 lg:block" />

            <div className="relative z-10 flex h-full items-center p-5 sm:p-6 lg:justify-end lg:pl-[48%] lg:pr-8">
              {selected ? (
                <div className="flex w-full max-w-md flex-col gap-2" aria-live="polite">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-neutral-900">
                      <TechIcon name={selected} className="size-5" />
                    </span>
                    <h2 className="font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl">{selected}</h2>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-neutral-200">{SKILL_INFO[selected] ?? "Teknologi yang saya gunakan dan pelajari."}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Dipakai di</span>
                    {usedIn.length > 0 ? (
                      usedIn.map((p) => (
                        <Link key={p.slug} to={`/projects/${p.slug}`} className="rounded-full bg-lime-300 px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-wider text-neutral-900 transition-colors hover:bg-white">
                          {p.short} →
                        </Link>
                      ))
                    ) : (
                      <span className="font-body text-xs text-neutral-400">belum ada proyek yang tercantum</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <p className="-rotate-3 font-body text-lg font-bold italic leading-tight text-neutral-100 sm:text-2xl lg:text-3xl">
                    Code
                    <br />
                    Create
                    <br />
                    Explore
                  </p>
                  <span aria-hidden className="mb-1 text-lg text-lime-300">
                    ✦
                  </span>
                  <p className="ml-4 hidden max-w-40 font-body text-[11px] leading-snug text-neutral-400 sm:block">Klik sebuah teknologi untuk melihat fungsinya dan proyek yang memakainya.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
