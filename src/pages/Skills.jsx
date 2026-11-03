import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Globe, Smartphone, Gamepad2, X } from "lucide-react";
import PageNotch from "../components/PageNotch";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projectsData";
import { SKILL_INFO, PRIMARY_GROUPS, EXPLORING_GROUPS } from "../data/skillsData";

gsap.registerPlugin(useGSAP);

/* ===================== DATA ===================== */

const TABS = [
  { id: "primary", label: "Primary" },
  { id: "experience", label: "Experience" },
  { id: "exploring", label: "Exploring" },
];

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");

// Experience: dihitung dari proyek, tidak ditulis manual
const CAT_ICON = { Web: Globe, Mobile: Smartphone, Game: Gamepad2 };
const EXPERIENCE_GROUPS = ["Web", "Mobile", "Game"]
  .map((cat) => ({
    title: `${cat} projects`,
    icon: CAT_ICON[cat],
    items: [...new Set(PROJECTS.filter((p) => p.category === cat).flatMap((p) => p.technologies))],
  }))
  .filter((g) => g.items.length);

const GROUPS = {
  primary: PRIMARY_GROUPS,
  experience: EXPERIENCE_GROUPS,
  exploring: EXPLORING_GROUPS,
};

const projectsUsing = (name) => PROJECTS.filter((p) => p.technologies.some((t) => t.toLowerCase() === name.toLowerCase()));

/* ===================== HELPER ANIMASI ===================== */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";

// panel detail dibuka dengan potongan miring (selaras dengan transisi halaman)
const CLIP_HIDDEN = "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)";
const CLIP_SHOWN = "polygon(14% 0, 100% 0, 100% 100%, 0 100%)";

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// teks "terdekode": huruf acak berubah jadi teks asli dari kiri ke kanan
const scramble = (el, text, duration = 0.65) => {
  el._scr?.kill(); // batalkan scramble sebelumnya di elemen yang sama
  const state = { p: 0 };
  el._scr = gsap.to(state, {
    p: 1,
    duration,
    ease: "none",
    onStart: () => (el.style.visibility = "visible"),
    onUpdate: () => {
      const done = Math.floor(state.p * text.length);
      const rest = [...text.slice(done)].map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])).join("");
      el.textContent = text.slice(0, done) + rest;
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
  return el._scr;
};

// kata tersentak glitch sesaat saat disorot
const glitchWord = (el) => {
  if (prefersReducedMotion()) return;
  gsap.fromTo(el, { x: -8, skewX: -12 }, { x: 0, skewX: 0, duration: 0.35, ease: "steps(4)", clearProps: "transform", overwrite: true });
};

/* ===================== KOMPONEN ===================== */

const Skills = () => {
  const [tab, setTab] = useState("primary");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [reduce] = useState(prefersReducedMotion);

  const rootRef = useRef(null);
  const chipRef = useRef(null);
  const chipNameRef = useRef(null);
  const panelRef = useRef(null);
  const nameRef = useRef(null);
  const selectedRef = useRef(null);
  const speedRef = useRef([]);

  const groups = GROUPS[tab];
  const isOpen = selected !== null;
  const usedIn = selected ? projectsUsing(selected) : [];
  const selectedGroup = selected ? groups.find((g) => g.items.includes(selected)) : null;

  const changeTab = (id) => {
    setTab(id);
    setSelected(null);
    setHovered(null);
  };

  // sinkronkan ref untuk dibaca ticker marquee
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Esc menutup panel
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // nama di chip kursor teracak setiap pindah kata
  useEffect(() => {
    if (!hovered || reduce || !chipNameRef.current) return;
    scramble(chipNameRef.current, hovered, 0.35);
  }, [hovered, reduce]);

  // kecepatan baris: melambat saat kursor/fokus masuk, normal lagi saat keluar
  const slowRow = (i, v) => {
    const s = speedRef.current[i];
    if (s) gsap.to(s, { v, duration: v < 1 ? 0.7 : 1.1, ease: "power2.out", overwrite: true });
  };

  /* ---- judul halaman: teks teracak saat dibuka ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const els = gsap.utils.toArray(".s-scr");
      els.forEach((el) => (el.style.visibility = "hidden"));
      els.forEach((el, i) => scramble(el, el.dataset.text, 0.9).delay(0.45 + i * 0.14));
    },
    { scope: rootRef },
  );

  /* ---- marquee tiap baris + animasi masuk (diulang saat ganti tab) ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const rows = gsap.utils.toArray(".skill-row");
      speedRef.current = rows.map(() => ({ v: 1 }));

      // baris genap bergerak ke kiri, baris ganjil ke kanan
      const tweens = rows.map((row, i) => {
        const track = row.querySelector(".row-track");
        const reverse = i % 2 === 1;
        return gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: 26 + i * 5, ease: "none", repeat: -1 });
      });

      const tick = () => {
        const slow = selectedRef.current ? 0.25 : 1;
        tweens.forEach((t, i) => t.timeScale((speedRef.current[i]?.v ?? 1) * slow));
      };
      gsap.ticker.add(tick);

      gsap.from(".row-track", { yPercent: 115, duration: 0.95, stagger: 0.09, ease: "power4.out" });
      gsap.from(".row-label", { x: -18, opacity: 0, duration: 0.6, stagger: 0.09, ease: "power3.out", delay: 0.25 });

      // judul grup teracak saat baris muncul
      const titles = gsap.utils.toArray(".row-title");
      titles.forEach((el, i) => {
        el.style.visibility = "hidden";
        scramble(el, el.dataset.text, 0.6).delay(0.3 + i * 0.09);
      });

      return () => {
        gsap.ticker.remove(tick);
        titles.forEach((el) => {
          el._scr?.kill();
          el.textContent = el.dataset.text;
          el.style.visibility = "visible";
        });
      };
    },
    { scope: rootRef, dependencies: [tab], revertOnUpdate: true },
  );

  /* ---- info mengikuti kursor ---- */
  useGSAP(
    () => {
      const section = rootRef.current;
      const chip = chipRef.current;
      const qx = gsap.quickTo(chip, "x", { duration: 0.45, ease: "power3.out" });
      const qy = gsap.quickTo(chip, "y", { duration: 0.45, ease: "power3.out" });
      let ready = false;

      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        const x = Math.min(e.clientX - r.left + 22, r.width - chip.offsetWidth - 16);
        const y = Math.min(e.clientY - r.top + 22, r.height - chip.offsetHeight - 16);
        if (!ready) {
          gsap.set(chip, { x, y });
          ready = true;
          return;
        }
        qx(x);
        qy(y);
      };

      section.addEventListener("pointermove", onMove);
      return () => section.removeEventListener("pointermove", onMove);
    },
    { scope: rootRef },
  );

  /* ---- panel detail: dibuka dengan potongan miring ---- */
  useGSAP(
    () => {
      if (!isOpen || reduce) return;
      gsap.fromTo(panelRef.current, { clipPath: CLIP_HIDDEN }, { clipPath: CLIP_SHOWN, duration: 0.75, ease: "power4.out" });
    },
    { scope: rootRef, dependencies: [isOpen] },
  );

  /* ---- isi panel: nama terdekode, elemen lain naik bergantian ---- */
  useGSAP(
    () => {
      if (!selected) return;
      if (reduce) {
        nameRef.current.textContent = selected;
        return;
      }
      scramble(nameRef.current, selected);
      gsap.from(".panel-item", { y: 16, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.15 });
      gsap.fromTo(".panel-icon", { x: -10, skewX: -14 }, { x: 0, skewX: 0, duration: 0.45, ease: "steps(5)", delay: 0.2, clearProps: "transform" });
    },
    { scope: rootRef, dependencies: [selected] },
  );

  const hoveredInfo = hovered ? (SKILL_INFO[hovered] ?? "Teknologi yang saya gunakan dan pelajari.") : "";

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />

      <PageNotch />

      {/* info mengikuti kursor (hanya perangkat dengan hover) */}
      <div
        ref={chipRef}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-50 w-64 origin-top-left rounded-2xl bg-lime-300 p-4 text-neutral-900 shadow-lg transition-[opacity,scale] duration-200 [@media(hover:none)]:hidden ${
          hovered && !selected ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-lime-300">{hovered && <TechIcon name={hovered} className="size-5" />}</span>
          <span ref={chipNameRef} className="font-display text-xl uppercase leading-none tracking-wide">
            {hovered}
          </span>
        </div>
        <p className="mt-2 font-body text-xs font-semibold leading-snug">{hoveredInfo}</p>
        <p className="mt-2 font-body text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Klik untuk detail</p>
      </div>

      {/* Desktop: satu layar. Hp/tablet: scroll di dalam kartu */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] lg:overflow-y-hidden">
        <div className="flex min-h-full flex-col lg:h-full lg:min-h-0">
          {/* HEADER + TABS */}
          <header className="flex shrink-0 flex-col gap-4 p-6 pb-4 sm:p-8 sm:pb-4 md:pl-28 lg:flex-row lg:items-end lg:justify-between lg:pr-12 lg:pt-8">
            <div>
              <h1 className="s-scr zz-rgb font-display uppercase leading-[0.85] tracking-wide" data-text="Skills" style={{ fontSize: "clamp(2.25rem, min(9vh, 12vw), 4.5rem)" }}>
                Skills
              </h1>
              <p className="mt-2 max-w-md font-body text-xs text-neutral-400 sm:text-sm">Arahkan kursor untuk memperlambat. Klik sebuah teknologi untuk membuka detailnya.</p>
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

          {/* BARIS MARQUEE: satu baris per grup */}
          <div className="relative mb-4 flex min-h-0 flex-1 flex-col border-b border-white/10 md:ml-28 lg:mb-6">
            {groups.length === 0 && <p className="p-6 font-body text-sm text-neutral-400">Belum ada data.</p>}

            {groups.map(({ title, icon: Icon, items }, i) => {
              // ulangi item sampai cukup panjang, lalu gandakan dua kali (xPercent -50 = satu putaran mulus)
              const repeat = reduce ? 1 : Math.max(1, Math.ceil(10 / items.length));
              const blocks = reduce ? 1 : repeat * 2;

              return (
                <div
                  key={`${tab}-${title}`}
                  className="skill-row relative min-h-24 flex-1 border-t border-white/10 transition-colors hover:bg-white/[0.03]"
                  onMouseEnter={() => slowRow(i, 0.06)}
                  onMouseLeave={() => slowRow(i, 1)}
                  onFocus={() => slowRow(i, 0.06)}
                  onBlur={() => slowRow(i, 1)}
                >
                  <div className={`zz-sweepline absolute inset-0 ${reduce ? "overflow-x-auto" : "overflow-hidden"}`} style={{ containerType: "size" }}>
                    <div className="row-track group/track flex h-full w-max items-center will-change-transform" style={{ fontSize: "min(58cqh, 10vw, 8rem)" }}>
                      {Array.from({ length: blocks }, (_, b) => (
                        <div key={b} aria-hidden={b > 0 || undefined} className="flex shrink-0 items-center">
                          {items.map((name) => {
                            const active = selected === name;
                            return (
                              <span key={name} className="flex items-center">
                                <button
                                  type="button"
                                  tabIndex={b === 0 ? 0 : -1}
                                  aria-pressed={active}
                                  onClick={() => setSelected(active ? null : name)}
                                  onMouseEnter={(e) => {
                                    setHovered(name);
                                    glitchWord(e.currentTarget);
                                  }}
                                  onMouseLeave={() => setHovered(null)}
                                  onFocus={(e) => {
                                    setHovered(name);
                                    glitchWord(e.currentTarget);
                                  }}
                                  onBlur={() => setHovered(null)}
                                  className={`flex cursor-pointer items-center gap-[0.22em] whitespace-nowrap px-[0.1em] font-display uppercase leading-none tracking-wide outline-none transition-[color,opacity] duration-200 [-webkit-text-stroke:2px_rgba(255,255,255,0.5)] group-hover/track:opacity-30 hover:text-lime-300 hover:opacity-100! hover:[-webkit-text-stroke-color:#bef264] focus-visible:text-lime-300 focus-visible:opacity-100! focus-visible:[-webkit-text-stroke-color:#bef264] ${
                                    active ? "text-lime-300 opacity-100! [-webkit-text-stroke-color:#bef264]" : "text-transparent"
                                  }`}
                                >
                                  <span className="inline-flex size-[0.5em] shrink-0 items-center justify-center rounded-[0.12em] bg-white/10 text-lime-300 [-webkit-text-stroke:0] [&>svg]:size-[58%]">
                                    <TechIcon name={name} />
                                  </span>
                                  {name}
                                </button>
                                <span aria-hidden className="mx-[0.3em] text-[0.35em] text-lime-300">
                                  ✦
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* label grup di kiri, kata lewat di bawahnya */}
                  <div className="row-label pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-3 bg-linear-to-r from-(--bar) from-55% to-transparent pl-4 pr-12 sm:pl-5">
                    <Icon className="size-5 shrink-0 text-lime-300" />
                    <span className="flex flex-col max-sm:hidden">
                      <span className="row-title font-body text-[11px] font-extrabold uppercase tracking-[0.25em]" data-text={title}>
                        {title}
                      </span>
                      <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300">×{pad(items.length)}</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* PANEL DETAIL */}
            {isOpen && (
              <aside ref={panelRef} aria-live="polite" className="absolute inset-y-0 right-0 z-40 w-[min(28rem,100%)] bg-lime-300 text-neutral-900" style={{ clipPath: CLIP_SHOWN }}>
                {/* garis pindai CRT di atas panel */}
                <div aria-hidden className="zz-scanlines pointer-events-none absolute inset-0 opacity-40" />

                <button
                  type="button"
                  aria-label="Tutup detail"
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-neutral-900 text-lime-300 transition-transform hover:rotate-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                  <X className="size-4" />
                </button>

                <div className="flex h-full flex-col justify-center gap-4 overflow-x-hidden overflow-y-auto p-6 pl-[18%] sm:pl-[22%]">
                  <span className="panel-item font-body text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">{selectedGroup?.title}</span>

                  <div className="panel-item">
                    <div className="panel-icon flex size-14 items-center justify-center rounded-xl bg-neutral-900 text-lime-300">
                      <TechIcon name={selected} className="size-7" />
                    </div>
                  </div>

                  {/* wadah pengukur: huruf Stormfaze lebar (~1.3em per huruf), jadi ukuran dihitung dari kata terpanjang */}
                  <div className="panel-item w-full min-w-0" style={{ containerType: "inline-size" }}>
                    <h2 className="zz-rgb break-words font-display uppercase leading-[0.95] tracking-wide" style={{ fontSize: `min(3.75rem, ${(100 / (Math.max(...selected.split(" ").map((w) => w.length)) * 1.3)).toFixed(1)}cqw)` }}>
                      <span ref={nameRef} />
                    </h2>
                  </div>

                  <p className="panel-item font-body text-sm font-semibold leading-relaxed">{SKILL_INFO[selected] ?? "Teknologi yang saya gunakan dan pelajari."}</p>

                  <div className="panel-item flex flex-wrap items-center gap-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Dipakai di</span>
                    {usedIn.length > 0 ? (
                      usedIn.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/projects/${p.slug}`}
                          className="rounded-full bg-neutral-900 px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-wider text-lime-300 transition-colors hover:bg-white hover:text-neutral-900"
                        >
                          {p.short} →
                        </Link>
                      ))
                    ) : (
                      <span className="font-body text-xs font-semibold opacity-70">belum ada proyek yang tercantum</span>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
