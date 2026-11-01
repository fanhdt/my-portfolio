import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import PageNotch from "../components/PageNotch";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projectsData";

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");

const Label = ({ children }) => (
  <h2 className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
    <span className="size-2 rotate-45 bg-lime-300" />
    {children}
  </h2>
);

// Ikon teknologi sementara: kotak berisi inisial (ganti dengan logo nanti)

// Bingkai menyesuaikan tipe proyek
const Frame = ({ project, src }) => {
  const img = <img src={src} alt={project.title} className="size-full object-cover object-top" />;

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

  return <div className="size-full overflow-hidden rounded-xl shadow-xl">{img}</div>;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [active, setActive] = useState(0);

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return <Navigate to="/projects" replace />;

  const project = PROJECTS[index];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const shots = project.screenshots?.length ? project.screenshots : [project.image];
  const safeActive = Math.min(active, shots.length - 1);

  return (
    <section className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* DEKORASI (di belakang konten) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-36 w-72 bg-white/6 lg:block [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-1.5 w-48 bg-lime-300 lg:block [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute right-16 top-24 hidden size-2 bg-sky-200 lg:block" />
      <div aria-hidden className="pointer-events-none absolute right-28 top-32 hidden size-2 rotate-45 bg-pink-400 lg:block" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 hidden h-20 w-[55%] bg-white/5 lg:block [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 hidden h-px w-1/3 bg-white/15 lg:block" />

      <PageNotch />

      {/* Hp/tablet: scroll di dalam kartu. Desktop: satu layar */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] lg:overflow-y-hidden">
        <div className="relative z-10 flex min-h-full flex-col gap-5 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-4 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8">
          {/* TOP BAR */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link to="/projects" className="inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300 transition-colors hover:text-lime-300 sm:text-xs">
                <ArrowLeft className="size-4" />
                Back to projects
              </Link>
              <span className="hidden font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 md:block">Portfolio System</span>
            </div>

            {PROJECTS.length > 1 && (
              <div className="flex items-center gap-3 font-body text-[11px] font-bold tracking-widest">
                <Link to={`/projects/${prev.slug}`} onClick={() => setActive(0)} aria-label="Proyek sebelumnya" className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
                  <ArrowLeft className="size-3.5" />
                </Link>
                <span>
                  {pad(index + 1)} / {pad(PROJECTS.length)}
                </span>
                <Link to={`/projects/${next.slug}`} onClick={() => setActive(0)} aria-label="Proyek berikutnya" className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* ISI: di hp wrapper "contents" supaya urutan bisa diatur, di desktop dua kolom */}
          <div className="flex flex-col gap-5 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
            {/* KIRI: visual + key features */}
            <div className="max-lg:contents lg:flex lg:min-h-0 lg:flex-col lg:gap-4">
              {/* visual */}
              <div className="order-2 flex flex-col gap-3 lg:order-none lg:min-h-0 lg:flex-1">
                <div className="relative h-64 overflow-hidden sm:h-80 lg:h-auto lg:min-h-0 lg:flex-1">
                  <div aria-hidden className="absolute bottom-0 right-0 top-6 w-3/4 rounded-2xl bg-lime-300" />
                  <div className="absolute inset-0 py-2 pr-4">
                    <Frame project={project} src={shots[safeActive]} />
                  </div>
                </div>

                {shots.length > 1 && (
                  <ul className="flex shrink-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {shots.map((src, i) => (
                      <li key={i} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => setActive(i)}
                          aria-label={`Lihat screenshot ${i + 1}`}
                          aria-current={i === safeActive}
                          className={`block overflow-hidden rounded-lg ring-2 transition-opacity ${i === safeActive ? "ring-lime-300" : "opacity-60 ring-transparent hover:opacity-100"}`}
                        >
                          <img src={src} alt="" className="h-10 w-16 object-cover object-top" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* key features */}
              {project.features?.length > 0 && (
                <div className="order-5 flex shrink-0 flex-col gap-3 lg:order-none">
                  <Label>Key features</Label>
                  <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 font-body text-sm text-neutral-200">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-lime-300 text-neutral-900">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KANAN: identitas, deskripsi, stack, role, aksi */}
            <div className="max-lg:contents lg:flex lg:min-h-0 lg:flex-col lg:justify-center lg:gap-5 lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin]">
              {/* identitas */}
              <div className="order-1 flex flex-col gap-3 lg:order-none">
                <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Project {pad(index + 1)}</span>
                <h1 className="font-display uppercase leading-[0.95] tracking-wide" style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)" }}>
                  {project.title}
                </h1>
                <span className="w-fit rounded-full bg-lime-300 px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-widest text-neutral-900">
                  {project.category} {project.category === "Web" ? "Application" : "Project"}
                </span>
              </div>

              <p className="order-3 max-w-md font-body text-sm leading-relaxed text-neutral-300 sm:text-base lg:order-none">{project.description}</p>

              {project.technologies?.length > 0 && (
                <div className="order-4 flex flex-col gap-3 lg:order-none">
                  <Label>Tech stack</Label>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li key={t} className="flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 font-body text-[11px] font-semibold ring-1 ring-white/20">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-lime-300">
                          <TechIcon name={t} className="size-3.5" />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.role && (
                <div className="order-6 flex flex-col gap-1 lg:order-none">
                  <Label>Role</Label>
                  <p className="font-body text-base font-extrabold">{project.role}</p>
                </div>
              )}

              {project.impact?.length > 0 && (
                <div className="order-6 flex flex-col gap-2 lg:order-none">
                  <Label>Impact</Label>
                  <ul className="flex flex-col gap-1.5">
                    {project.impact.map((item) => (
                      <li key={item} className="border-l-2 border-white/20 pl-3 font-body text-sm text-neutral-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.liveUrl || project.githubUrl) && (
                <div className="order-7 flex flex-wrap gap-3 pb-2 max-sm:[&>a]:flex-1 lg:order-none">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white"
                    >
                      Live demo <ExternalLink className="size-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-bold uppercase tracking-widest ring-1 ring-white/30 transition-colors hover:bg-white/10"
                    >
                      {/* <Github className="size-4" /> GitHub */}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
