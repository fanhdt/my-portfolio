import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Download } from "lucide-react";
import PageNotch from "../components/PageNotch";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projectsData";

gsap.registerPlugin(useGSAP);

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");
const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const typeLabel = (p) => `${p.category} ${p.category === "Web" ? "Application" : "Project"}`;

// teks teracak lalu menyusun diri menjadi teks akhir (panjang teks tetap)
const scramble = (el, text, duration = 0.8) => {
  el._scr?.kill(); // batalkan scramble sebelumnya di elemen yang sama
  const o = { p: 0 };
  el._scr = gsap.to(o, {
    p: 1,
    duration,
    ease: "none",
    onStart: () => (el.style.visibility = "visible"),
    onUpdate: () => {
      const n = Math.floor(o.p * text.length);
      el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    },
    onComplete: () => (el.textContent = text),
  });
  return el._scr;
};

const Label = ({ children }) => (
  <h2 className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
    <span className="size-2 rotate-45 bg-lime-300" />
    <span className="d-scr-b" data-text={children}>
      {children}
    </span>
  </h2>
);

// salinan gambar berwarna yang sesekali bergeser + garis pindai CRT
const Glitch = ({ src }) => (
  <>
    {["zz-slice-a", "zz-slice-b"].map((c) => (
      <img key={c} src={src} alt="" aria-hidden className={`${c} pointer-events-none absolute inset-0 size-full object-cover object-top`} />
    ))}
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="zz-scanlines absolute inset-0" />
      <div className="zz-sweepline absolute inset-0 overflow-hidden" />
    </div>
  </>
);

// Bingkai menyesuaikan tipe proyek. `sweep` = lembar sapuan yang menempel di area gambar
const Frame = ({ project, src, sweep }) => {
  const img = (
    <>
      <img src={src} alt={project.title} className="d-main-img size-full object-cover object-top" />
      <Glitch src={src} />
      {sweep}
    </>
  );

  if (project.category === "Mobile") {
    return <div className="relative mx-auto aspect-9/16 h-full max-h-full max-w-[55%] overflow-hidden rounded-4xl border-[6px] border-neutral-900 bg-neutral-900 shadow-xl">{img}</div>;
  }

  if (project.category === "Web") {
    return (
      <div className="flex size-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-xl">
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-lime-300" />
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">{img}</div>
      </div>
    );
  }

  return <div className="relative size-full overflow-hidden rounded-xl shadow-xl">{img}</div>;
};

// Dipisah supaya state dan animasi mulai dari awal tiap pindah proyek (key = slug)
const Detail = ({ index }) => {
  const project = PROJECTS[index];
  const isGame = project.category.toLowerCase().includes("game");
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const shots = project.screenshots?.length ? project.screenshots : [project.image];

  const [shot, setShot] = useState(0);
  const [reduce] = useState(prefersReducedMotion);

  const rootRef = useRef(null);
  const visualRef = useRef(null);
  const sweepRef = useRef(null);
  const tlRef = useRef(null);
  const targetRef = useRef(0);

  const safeShot = Math.min(shot, shots.length - 1);

  useEffect(() => () => tlRef.current?.kill(), []);

  /* ---- ganti screenshot: lembar lime menyapu gambar, gambar tersentak glitch saat terbuka ---- */
  const goShot = (i) => {
    if (i === targetRef.current) return;
    targetRef.current = i;

    if (reduce || !sweepRef.current) {
      setShot(i);
      return;
    }

    const imgEl = rootRef.current?.querySelector(".d-main-img");
    tlRef.current?.kill();
    if (imgEl) gsap.set(imgEl, { clearProps: "filter,x" });

    const tl = gsap
      .timeline()
      .to(sweepRef.current, { xPercent: 0, duration: 0.35, ease: "power3.in" })
      .add(() => setShot(targetRef.current))
      .to(sweepRef.current, { xPercent: 100, duration: 0.45, ease: "power3.out" });
    if (imgEl) tl.fromTo(imgEl, { x: -8, filter: "hue-rotate(70deg) saturate(2.2)" }, { x: 0, filter: "hue-rotate(0deg) saturate(1)", duration: 0.4, ease: "steps(5)", clearProps: "filter,x" }, "<");
    tl.set(sweepRef.current, { xPercent: -100 });
    tlRef.current = tl;
  };

  /* ---- animasi masuk berurutan + scramble teks ---- */
  useGSAP(
    () => {
      if (reduce) return;
      if (sweepRef.current) gsap.set(sweepRef.current, { xPercent: -100 });
      gsap.set(".d-tilt", { transformPerspective: 900 });

      gsap.utils.toArray(".d-scr-a, .d-scr-b").forEach((el) => (el.style.visibility = "hidden"));

      const tl = gsap.timeline({ delay: 0.45, defaults: { ease: "power3.out" } });
      // helper: lewati kalau elemennya tidak ada (mis. proyek tanpa impact)
      const add = (sel, vars, pos) => {
        const els = gsap.utils.toArray(sel);
        if (els.length) tl.from(els, vars, pos);
      };
      // jalankan scramble pada saat yang sama dengan tween sebelumnya
      const scr = (sel, pos) => tl.add(() => gsap.utils.toArray(sel).forEach((el, i) => scramble(el, el.dataset.text, 0.6).delay(i * 0.05)), pos);

      add(".d-top", { y: -16, opacity: 0, duration: 0.5 });
      scr(".d-scr-a", "<");
      add(".d-slab", { xPercent: 105, duration: 0.9, ease: "power4.out" }, "<0.1");
      add(".d-tilt", { y: 80, opacity: 0, rotationX: 14, duration: 0.9 }, "<0.15");
      add(".d-ghost", { opacity: 0, x: -60, duration: 0.9 }, "<");
      add(".d-eyebrow", { y: 12, opacity: 0, duration: 0.4 }, "<0.1");
      scr(".d-scr-eyebrow", "<");
      add(".d-word", { yPercent: 115, duration: 0.8, stagger: 0.07, ease: "power4.out" }, "<0.1");
      add(".d-badge", { scale: 0.8, opacity: 0, duration: 0.4 }, "-=0.4");
      scr(".d-scr-badge", "<");
      add(".d-fade", { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.4");
      scr(".d-scr-b", "<");
      add(".d-chip", { scale: 0.6, opacity: 0, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, "-=0.4");
      add(".d-check", { scale: 0, duration: 0.35, stagger: 0.05, ease: "back.out(3)" }, "-=0.5");
      add(".d-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");

      // scramble saat baris/tombol di-hover
      const cleanups = gsap.utils.toArray("[data-scramble]").map((el) => {
        const trigger = el.closest("[data-hover]") || el.parentElement;
        const on = () => scramble(el, el.dataset.scramble, 0.45);
        trigger.addEventListener("mouseenter", on);
        return () => trigger.removeEventListener("mouseenter", on);
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef },
  );

  /* ---- bingkai miring 3D mengikuti kursor (desktop) ---- */
  useGSAP(
    () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (reduce || !finePointer) return;

      const visual = visualRef.current;
      const rotY = gsap.quickTo(".d-tilt", "rotationY", { duration: 0.6, ease: "power3.out" });
      const rotX = gsap.quickTo(".d-tilt", "rotationX", { duration: 0.6, ease: "power3.out" });
      const ghostX = gsap.quickTo(".d-ghost-in", "x", { duration: 0.8, ease: "power3.out" });

      const onMove = (e) => {
        const r = visual.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        rotY(nx * 10);
        rotX(ny * -7);
        ghostX(nx * -40);
      };
      const onLeave = () => {
        rotY(0);
        rotX(0);
        ghostX(0);
      };

      visual.addEventListener("pointermove", onMove);
      visual.addEventListener("pointerleave", onLeave);
      return () => {
        visual.removeEventListener("pointermove", onMove);
        visual.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  const sweep = reduce ? null : <div ref={sweepRef} aria-hidden className="pointer-events-none absolute inset-y-0 left-[-30%] z-10 w-[160%] bg-lime-300 [clip-path:polygon(15%_0,100%_0,85%_100%,0_100%)]" />;

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* DEKORASI (di belakang konten) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mask-[linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-36 w-72 bg-white/6 lg:block [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-1.5 w-48 bg-lime-300 lg:block [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute right-16 top-24 hidden size-2 bg-sky-200 lg:block" />
      <div aria-hidden className="pointer-events-none absolute right-28 top-32 hidden size-2 rotate-45 bg-pink-400 lg:block" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 hidden h-20 w-[55%] bg-white/5 lg:block [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 hidden h-px w-1/3 bg-white/15 lg:block" />

      <PageNotch />

      {/* Hp/tablet: scroll di dalam kartu. Desktop: satu layar */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none lg:overflow-y-hidden">
        <div className="relative z-10 flex min-h-full flex-col gap-5 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-4 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8 [@media(max-height:840px)]:lg:pt-5 [@media(max-height:840px)]:lg:pb-4 [@media(max-height:840px)]:lg:gap-3">
          {/* TOP BAR */}
          <div className="d-top flex shrink-0 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link data-hover to="/projects" className="inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300 transition-colors hover:text-lime-300 sm:text-xs">
                <ArrowLeft className="size-4" />
                <span data-scramble="Back to projects">Back to projects</span>
              </Link>
              <span className="d-scr-a hidden font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 md:block" data-text="Portfolio System">
                Portfolio System
              </span>
            </div>

            {PROJECTS.length > 1 && (
              <div className="flex items-center gap-3 font-body text-[11px] font-bold tracking-widest">
                <Link to={`/projects/${prev.slug}`} aria-label={`Proyek sebelumnya: ${prev.short}`} className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
                  <ArrowLeft className="size-3.5" />
                </Link>
                <span>
                  {pad(index + 1)} / {pad(PROJECTS.length)}
                </span>
                <Link to={`/projects/${next.slug}`} aria-label={`Proyek berikutnya: ${next.short}`} className="rounded-full p-2 ring-1 ring-white/20 transition-colors hover:bg-white/10">
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
              <div className="order-2 flex flex-col gap-3 lg:order-0 lg:min-h-0 lg:flex-1">
                <div ref={visualRef} className="relative h-64 overflow-hidden sm:h-80 lg:h-auto lg:min-h-0 lg:flex-1" style={{ containerType: "size" }}>
                  {/* angka proyek raksasa berkontur di belakang */}
                  <div aria-hidden className="d-ghost pointer-events-none absolute left-0 top-0 z-0">
                    <span className="d-ghost-in zz-rgb block font-display leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.18)]" style={{ fontSize: "min(75cqh, 40cqw)" }}>
                      {pad(index + 1)}
                    </span>
                  </div>
                  <div aria-hidden className="d-slab absolute bottom-0 right-0 top-6 z-0 w-3/4 rounded-2xl bg-lime-300" />
                  <div className="d-tilt absolute inset-0 z-10 py-2 pr-4">
                    <Frame project={project} src={shots[safeShot]} sweep={sweep} />
                  </div>
                </div>

                {shots.length > 1 && (
                  <div className="d-fade flex shrink-0 items-center justify-between gap-3">
                    <ul className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {shots.map((src, i) => (
                        <li key={i} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => goShot(i)}
                            aria-label={`Lihat screenshot ${i + 1}`}
                            aria-current={i === safeShot}
                            className={`block overflow-hidden rounded-lg ring-2 transition-[opacity,transform] hover:-translate-y-0.5 ${i === safeShot ? "ring-lime-300" : "opacity-60 ring-transparent hover:opacity-100"}`}
                          >
                            <img src={src} alt="" className="h-10 w-16 object-cover object-top" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <span className="shrink-0 font-body text-[11px] font-bold tracking-widest text-neutral-400">
                      {pad(safeShot + 1)} / {pad(shots.length)}
                    </span>
                  </div>
                )}
              </div>

              {/* key features */}
              {project.features?.length > 0 && (
                <div className="d-fade order-5 flex shrink-0 flex-col gap-3 lg:order-0">
                  <Label>Key features</Label>
                  <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} data-hover className="flex items-center gap-3 font-body text-sm text-neutral-200">
                        <span className="d-check flex size-5 shrink-0 items-center justify-center rounded-full bg-lime-300 text-neutral-900">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span data-scramble={f}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KANAN: identitas, deskripsi, stack, role, aksi */}
            <div className="max-lg:contents lg:flex lg:min-h-0 lg:flex-col lg:justify-center lg:gap-5 [@media(max-height:840px)]:lg:gap-2 lg:overflow-y-auto lg:pr-2 scrollbar-thin">
              {/* identitas */}
              <div className="order-1 flex flex-col gap-3 lg:order-0">
                <span className="d-eyebrow d-scr-eyebrow zz-caret font-body text-xs font-bold uppercase tracking-[0.3em] text-lime-300" data-text={`Project ${pad(index + 1)}`}>
                  {`Project ${pad(index + 1)}`}
                </span>
                <h1 className="zz-rgb font-display uppercase leading-[1.02] tracking-wide" style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)" }}>
                  {project.title.split(" ").map((word, i) => (
                    <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <span className="d-word inline-block">{word}</span>
                    </span>
                  ))}
                </h1>
                <span className="d-badge d-scr-badge w-fit rounded-full bg-lime-300 px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-widest text-neutral-900" data-text={typeLabel(project)}>
                  {typeLabel(project)}
                </span>
              </div>

              <p className="d-fade order-3 max-w-md font-body text-sm leading-relaxed text-neutral-300 sm:text-base lg:order-0">{project.description}</p>

              {project.technologies?.length > 0 && (
                <div className="d-fade order-4 flex flex-col gap-3 lg:order-0">
                  <Label>Tech stack</Label>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li key={t} data-hover className="d-chip flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 font-body text-[11px] font-semibold ring-1 ring-white/20 transition-colors hover:bg-white/10">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-lime-300">
                          <TechIcon name={t} className="size-3.5" />
                        </span>
                        <span data-scramble={t}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.role && (
                <div className="d-fade order-6 flex flex-col gap-1 lg:order-0">
                  <Label>Role</Label>
                  <p className="font-body text-base font-extrabold">{project.role}</p>
                </div>
              )}

              {project.impact?.length > 0 && (
                <div className="d-fade order-6 flex flex-col gap-2 lg:order-0">
                  <Label>Impact</Label>
                  <ul className="flex flex-col gap-1.5">
                    {project.impact.map((item) => (
                      <li key={item} data-hover className="border-l-2 border-white/20 pl-3 font-body text-sm text-neutral-200 transition-colors hover:border-lime-300">
                        <span data-scramble={item}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(isGame ? project.downloadUrl : project.liveUrl || project.githubUrl) && (
                <div className="order-7 flex flex-wrap gap-3 pb-2 max-sm:*:flex-1 lg:order-0">
                  {isGame ? (
                    <span className="d-cta zz-border inline-flex rounded-full p-0.5">
                      <a
                        href={project.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white"
                      >
                        Download <Download className="size-4" />
                      </a>
                    </span>
                  ) : (
                    <>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-cta inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 hover:bg-white"
                        >
                          Live demo <ExternalLink className="size-4" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-cta inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-bold uppercase tracking-widest ring-1 ring-white/30 transition-colors hover:bg-white/10"
                        >
                          GitHub <ExternalLink className="size-4" />
                        </a>
                      )}
                    </>
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

const ProjectDetail = () => {
  const { slug } = useParams();
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return <Navigate to="/projects" replace />;
  return <Detail key={slug} index={index} />;
};

export default ProjectDetail;
