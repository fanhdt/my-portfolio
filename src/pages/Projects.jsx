import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { PROJECTS } from "../data/projectsData";

gsap.registerPlugin(useGSAP);

const FILTERS = ["All", "Web", "Mobile", "Game"];
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");
const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const countOf = (f) => (f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length);

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

const typeLabel = (p) => `${p.category} ${p.category === "Web" ? "Application" : "Project"}`;

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

// Bingkai visual menyesuaikan tipe proyek
const Frame = ({ project }) => {
  const img = (
    <>
      <img src={project.image} alt={project.title} className="frame-img size-full object-cover object-top" />
      <Glitch src={project.image} />
    </>
  );

  if (project.category === "Mobile") {
    return <div className="relative mx-auto aspect-9/16 h-full max-h-full max-w-[55%] overflow-hidden rounded-[2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-xl">{img}</div>;
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

  // Game
  return <div className="relative size-full overflow-hidden rounded-xl shadow-xl">{img}</div>;
};

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0); // baris yang disorot (langsung)
  const [shown, setShown] = useState(0); // proyek di panggung (berganti di tengah sapuan)
  const [reduce] = useState(prefersReducedMotion);

  const rootRef = useRef(null);
  const slabRef = useRef(null);
  const tlRef = useRef(null);
  const targetRef = useRef(0);

  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const shownIndex = Math.min(shown, Math.max(list.length - 1, 0));
  const current = list[shownIndex];

  // matikan timeline saat halaman ditutup
  useEffect(() => () => tlRef.current?.kill(), []);

  /* ---- pratinjau: lembar putih menyapu panggung, isi berganti saat tertutup ---- */
  const preview = (i) => {
    setActive(i);
    if (i === targetRef.current) return;
    targetRef.current = i;

    if (reduce || !slabRef.current) {
      setShown(i);
      return;
    }

    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .to(slabRef.current, { xPercent: 0, duration: 0.38, ease: "power3.in" })
      .add(() => setShown(targetRef.current))
      .to(slabRef.current, { xPercent: 100, duration: 0.45, ease: "power3.out" })
      .set(slabRef.current, { xPercent: -100 });
  };

  // judul baris teracak saat disorot
  const glitchRow = (link) => {
    if (reduce) return;
    const t = link.querySelector(".proj-title");
    if (t) scramble(t, t.dataset.text, 0.45);
  };

  const changeFilter = (f) => {
    tlRef.current?.kill();
    if (slabRef.current) gsap.set(slabRef.current, { xPercent: -100 });
    targetRef.current = 0;
    setFilter(f);
    setActive(0);
    setShown(0);
  };

  // lembar sapuan mulai di luar layar (kiri)
  useGSAP(
    () => {
      if (!reduce && slabRef.current) gsap.set(slabRef.current, { xPercent: -100 });
    },
    { scope: rootRef },
  );

  /* ---- header: teks teracak saat halaman dibuka ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const els = gsap.utils.toArray(".p-scr");
      els.forEach((el) => (el.style.visibility = "hidden"));
      els.forEach((el, i) => scramble(el, el.dataset.text, 0.9).delay(0.45 + i * 0.14));
    },
    { scope: rootRef },
  );

  /* ---- daftar masuk: judul naik dari balik topeng, garis memanjang ---- */
  useGSAP(
    () => {
      if (reduce) return;
      gsap.from(".proj-title", { yPercent: 115, duration: 0.9, stagger: 0.07, ease: "power4.out", delay: 0.4 });
      gsap.from(".proj-line", { scaleX: 0, transformOrigin: "left center", duration: 0.8, stagger: 0.07, ease: "power3.out", delay: 0.4 });
      gsap.from(".proj-meta", { opacity: 0, x: 16, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.7 });
      gsap.from(".m-card", { y: 28, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.4 });
    },
    { scope: rootRef, dependencies: [filter], revertOnUpdate: true },
  );

  /* ---- info panggung: teks teracak + gambar tersentak glitch setelah sapuan ---- */
  useGSAP(
    () => {
      if (reduce || !current) return;
      gsap.from(".stage-info > *", { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power3.out", delay: 0.1 });

      gsap.utils.toArray(".stage-scr").forEach((el, i) => scramble(el, el.dataset.text, 0.5).delay(0.1 + i * 0.06));

      gsap.fromTo(".frame-img", { x: -8, filter: "hue-rotate(70deg) saturate(2.2)" }, { x: 0, filter: "hue-rotate(0deg) saturate(1)", duration: 0.4, ease: "steps(5)", clearProps: "filter,x" });
    },
    { scope: rootRef, dependencies: [current?.slug] },
  );

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
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
          <header className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
                <span className="size-2.5 bg-lime-300" />
                <span className="p-scr zz-caret" data-text="04 / Works">
                  04 / Works
                </span>
                <span className="h-px w-12 bg-white/30" />
              </div>
              <h1 className="p-scr zz-rgb mt-2 font-display uppercase leading-[0.85] tracking-wide" data-text="Projects" style={{ fontSize: "clamp(2.25rem, min(9vh, 12vw), 4.5rem)" }}>
                Projects
              </h1>
              <p className="mt-2 max-w-md font-body text-xs text-neutral-400 sm:text-sm">
                <span className="max-lg:hidden">Arahkan kursor ke sebuah proyek untuk pratinjau, klik untuk membuka detailnya.</span>
                <span className="lg:hidden">Ketuk sebuah proyek untuk membuka detailnya.</span>
              </p>
            </div>

            <div role="tablist" aria-label="Project categories" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => changeFilter(f)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest transition-colors sm:text-xs ${
                    filter === f ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-neutral-300 ring-1 ring-white/15 hover:bg-white/10"
                  }`}
                >
                  {f}
                  <span className={`text-[10px] ${filter === f ? "opacity-60" : "text-lime-300"}`}>{pad(countOf(f))}</span>
                </button>
              ))}
            </div>
          </header>

          {current ? (
            <div className="flex flex-col gap-6 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
              {/* DAFTAR PROYEK (desktop): tiap proyek satu baris besar */}
              <ul className="flex min-h-0 flex-col border-b border-white/15 max-lg:hidden lg:overflow-y-auto lg:[scrollbar-width:none]">
                {list.map((p, i) => {
                  const on = i === active;
                  return (
                    <li key={p.slug} className="relative min-h-14 flex-1" style={{ containerType: "size" }}>
                      <div aria-hidden className="proj-line absolute inset-x-0 top-0 h-px bg-white/15" />
                      <Link
                        to={`/projects/${p.slug}`}
                        aria-current={on || undefined}
                        onMouseEnter={(e) => {
                          preview(i);
                          glitchRow(e.currentTarget);
                        }}
                        onFocus={(e) => {
                          preview(i);
                          glitchRow(e.currentTarget);
                        }}
                        className="group relative grid size-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 outline-none"
                      >
                        {/* penanda baris aktif */}
                        <span aria-hidden className={`absolute inset-y-2 -left-3 w-1 origin-center bg-lime-300 transition-transform duration-300 ${on ? "scale-y-100" : "scale-y-0"}`} />

                        {/* sapuan miring di belakang baris aktif */}
                        <span aria-hidden className={`absolute inset-y-1.5 inset-x-0 -z-10 origin-left -skew-x-12 bg-lime-300/10 transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`} />

                        <span className={`proj-meta font-display text-xl leading-none transition-colors ${on ? "text-lime-300" : "text-neutral-500"}`}>{pad(i + 1)}</span>

                        {/* topeng untuk animasi judul naik */}
                        <span className="min-w-0 overflow-hidden">
                          <span
                            data-text={p.short || p.title}
                            className={`proj-title block truncate font-display uppercase leading-[1.1] tracking-wide transition-[color,opacity] duration-200 [-webkit-text-stroke:2px_rgba(255,255,255,0.5)] group-hover:text-lime-300 group-hover:[-webkit-text-stroke-color:#bef264] group-focus-visible:text-lime-300 ${
                              on ? "text-lime-300 [-webkit-text-stroke-color:#bef264]" : "text-transparent"
                            }`}
                            style={{ fontSize: "min(42cqh, 7vw, 3.5rem)" }}
                          >
                            {p.short || p.title}
                          </span>
                        </span>

                        <span className="proj-meta flex items-center gap-3">
                          <span className={`font-body text-[10px] font-bold uppercase tracking-widest ${on ? "text-lime-300" : "text-neutral-400"}`}>{p.category}</span>
                          <ArrowUpRight className={`size-5 shrink-0 transition-all duration-300 ${on ? "translate-x-0 text-lime-300 opacity-100" : "-translate-x-2 opacity-0"}`} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* DAFTAR PROYEK (hp): kartu bergambar, judul dan tombol buka selalu terlihat */}
              <ul className="flex flex-col gap-3 pb-2 lg:hidden">
                {list.map((p, i) => (
                  <li key={p.slug} className="m-card">
                    <Link to={`/projects/${p.slug}`} className="group relative block h-40 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:h-52">
                      <img src={p.image} alt="" className="size-full object-cover object-top transition-transform duration-500 group-active:scale-105" />
                      <Glitch src={p.image} />
                      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                      <span className="absolute left-3 top-3 rounded-full bg-lime-300 px-2.5 py-1 font-display text-sm leading-none text-neutral-900">{pad(i + 1)}</span>
                      <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">{p.category}</span>

                      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl">{p.short || p.title}</h2>
                          {p.short && p.short !== p.title && <p className="mt-1 truncate font-body text-xs text-neutral-300">{p.title}</p>}
                        </div>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-300 text-neutral-900">
                          <ArrowUpRight className="size-5" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* PANGGUNG PRATINJAU (desktop) */}
              <div className="flex min-h-0 flex-col gap-4 max-lg:hidden">
                <div className="relative min-h-0 flex-1 overflow-hidden" style={{ containerType: "size" }}>
                  {/* angka raksasa berkontur di belakang */}
                  <span aria-hidden className="zz-rgb pointer-events-none absolute left-0 top-0 z-0 font-display leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.18)]" style={{ fontSize: "min(70cqh, 40cqw)" }}>
                    {pad(shownIndex + 1)}
                  </span>
                  <div aria-hidden className="absolute bottom-0 right-0 top-6 z-0 w-3/4 bg-lime-300 [clip-path:url(#proj-shape-clip)]" />
                  <div className="absolute inset-0 z-10 py-2 pr-4">
                    <Frame project={current} />
                  </div>

                  {/* lembar sapuan */}
                  {!reduce && <div ref={slabRef} aria-hidden className="pointer-events-none absolute inset-y-0 -left-[30%] z-20 w-[160%] bg-white [clip-path:polygon(15%_0,100%_0,85%_100%,0_100%)]" />}
                </div>

                <div className="stage-info flex shrink-0 flex-col gap-2">
                  <p className="flex items-center justify-between gap-3 font-body text-[11px] font-bold uppercase tracking-[0.25em] text-lime-300">
                    <span className="stage-scr" data-text={typeLabel(current)}>
                      {typeLabel(current)}
                    </span>
                    <span aria-hidden className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-neutral-400">
                      <span className="size-1.5 animate-pulse rounded-full bg-lime-300" />
                      Live feed {pad(shownIndex + 1)}/{pad(list.length)}
                    </span>
                  </p>
                  <h2 className="stage-scr font-display uppercase leading-[0.95] tracking-wide" data-text={current.title} style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)" }}>
                    {current.title}
                  </h2>
                  <p className="line-clamp-2 max-w-md font-body text-sm leading-relaxed text-neutral-300 [@media(max-height:760px)]:hidden">{current.description}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {current.technologies.slice(0, 5).map((t) => (
                      <li key={t} className="rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold ring-1 ring-white/20">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="zz-border mt-1 inline-flex w-fit rounded-full p-0.5">
                    <Link
                      to={`/projects/${current.slug}`}
                      className="inline-flex items-center gap-3 rounded-full bg-lime-300 px-5 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white"
                    >
                      View Project <span aria-hidden>→</span>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="m-auto font-body text-sm text-neutral-400">Belum ada proyek di kategori ini.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
