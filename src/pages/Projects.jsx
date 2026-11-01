import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { PROJECTS } from "../data/projectsData";

const FILTERS = ["All", "Web", "Mobile", "Game"];

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");

// Bingkai visual menyesuaikan tipe proyek
const Frame = ({ project }) => {
  const img = <img src={project.image} alt={project.title} className="size-full object-cover object-top" />;

  if (project.category === "Mobile") {
    return <div className="mx-auto aspect-9/16 h-full max-h-full max-w-[55%] overflow-hidden rounded-[2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-xl">{img}</div>;
  }

  if (project.category === "Web") {
    return (
      <div className="flex size-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-xl">
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-lime-300" />
        </div>
        <div className="min-h-0 flex-1">{img}</div>
      </div>
    );
  }

  // Game
  return <div className="size-full overflow-hidden rounded-xl shadow-xl">{img}</div>;
};

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState(0);

  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const safeIndex = Math.min(index, Math.max(list.length - 1, 0));
  const current = list[safeIndex];

  const changeFilter = (f) => {
    setFilter(f);
    setIndex(0);
  };
  const go = (dir) => setIndex((safeIndex + dir + list.length) % list.length);

  return (
    <section className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="proj-shape-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.08 0 H1 V1 H0 C0.04 0.7, 0.12 0.3, 0.08 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />

      <PageNotch />

      {/* Desktop: tanpa scroll. Hp/tablet: scroll di dalam kartu */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] lg:overflow-y-hidden">
        <div className="flex min-h-full flex-col gap-5 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-4 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8">
          {/* HEADER + FILTER */}
          <header className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
                <span className="size-2.5 bg-lime-300" />
                04 / Works
                <span className="h-px w-12 bg-white/30" />
              </div>
              <h1 className="mt-2 font-display uppercase leading-[0.85] tracking-wide" style={{ fontSize: "clamp(2.25rem, min(10vh, 12vw), 5rem)" }}>
                Projects
              </h1>
              <p className="mt-2 font-body text-sm text-neutral-300 sm:text-base">Things I build, experiment with, and bring to life.</p>
            </div>

            <div role="tablist" aria-label="Project categories" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => changeFilter(f)}
                  className={`rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest transition-colors sm:text-xs ${
                    filter === f ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-neutral-300 ring-1 ring-white/15 hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          {current ? (
            <>
              {/* FEATURED */}
              <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[3fr_2fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
                {/* visual: gambar absolute supaya tidak menentukan tinggi */}
                <div className="relative h-64 overflow-hidden sm:h-80 lg:h-auto lg:min-h-0">
                  <div aria-hidden className="absolute bottom-0 right-0 top-6 w-3/4 bg-lime-300 [clip-path:url(#proj-shape-clip)]" />
                  <div className="absolute inset-0 py-2 pr-4">
                    <Frame project={current} />
                  </div>
                </div>

                {/* info */}
                <div className="flex flex-col justify-center gap-4 lg:min-h-0 lg:overflow-hidden lg:pr-4">
                  <span className="font-display text-5xl leading-none text-lime-300 lg:text-6xl">{pad(safeIndex + 1)}</span>
                  <h2 className="font-display uppercase leading-[0.95] tracking-wide" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                    {current.title}
                  </h2>
                  <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
                    {current.category} {current.category === "Web" ? "Application" : "Project"}
                  </p>
                  <p className="max-w-md font-body text-sm leading-relaxed text-neutral-300 sm:text-base [@media(max-height:760px)]:hidden">{current.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {current.technologies.map((t) => (
                      <li key={t} className="rounded-full px-3 py-1 font-body text-[11px] font-semibold ring-1 ring-white/20">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/projects/${current.slug}`}
                    className="mt-2 inline-flex w-fit items-center gap-3 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white"
                  >
                    View Project <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              {/* ARSIP + NAVIGASI */}
              <div className="flex shrink-0 flex-col gap-3 border-t border-white/15 pt-4 lg:flex-row lg:items-center lg:justify-between">
                <ul className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {list.map((p, i) => (
                    <li key={p.slug} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-current={i === safeIndex}
                        className={`flex items-center gap-3 rounded-xl p-2 pr-4 text-left transition-colors ${i === safeIndex ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
                      >
                        <img src={p.image} alt="" className="size-10 rounded-lg object-cover object-top" />
                        <span className="flex flex-col">
                          <span className="font-body text-[10px] font-bold tracking-[0.25em] opacity-70">{pad(i + 1)}</span>
                          <span className="font-body text-xs font-extrabold uppercase tracking-wider">{p.short}</span>
                          <span className="font-body text-[10px] opacity-70">{p.category}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex shrink-0 items-center gap-3 font-body text-xs font-bold tracking-widest">
                  <button type="button" aria-label="Proyek sebelumnya" onClick={() => go(-1)} className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
                    <ArrowLeft className="size-4" />
                  </button>
                  <span>
                    {pad(safeIndex + 1)} / {pad(list.length)}
                  </span>
                  <button type="button" aria-label="Proyek berikutnya" onClick={() => go(1)} className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="m-auto font-body text-sm text-neutral-400">Belum ada proyek di kategori ini.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
