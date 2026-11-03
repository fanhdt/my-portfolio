import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Globe, Smartphone, Gamepad2, Sparkles, X } from "lucide-react";
import PageNotch from "../components/PageNotch";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projectsData";
import { SKILL_INFO, PRIMARY_GROUPS, EXPLORING_GROUPS } from "../data/skillsData";

gsap.registerPlugin(useGSAP);

/* ===================== DATA ===================== */

const TABS = [
  { id: "core", label: "Core" },
  { id: "used", label: "Used" },
  { id: "exploring", label: "Exploring" },
];

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const pad = (n) => String(n).padStart(2, "0");
const low = (s) => s.toLowerCase();

const CAT_ICON = { Web: Globe, Mobile: Smartphone, Game: Gamepad2, AI: Sparkles };
const USED_GROUPS = (() => {
  const seen = new Set(); // satu teknologi hanya muncul di satu grup
  return ["Web", "Mobile", "Game", "AI"]
    .map((cat) => {
      const items = [...new Set(PROJECTS.filter((p) => p.category === cat).flatMap((p) => p.technologies))].filter((t) => {
        if (seen.has(low(t))) return false;
        seen.add(low(t));
        return true;
      });
      return { title: `${cat} projects`, icon: CAT_ICON[cat], items };
    })
    .filter((g) => g.items.length);
})();
// CORE = PRIMARY_GROUPS, EXPLORING = EXPLORING_GROUPS (tanpa data baru)
const GROUPS = {
  core: PRIMARY_GROUPS,
  used: USED_GROUPS,
  exploring: EXPLORING_GROUPS,
};

const projectsUsing = (name) => PROJECTS.filter((p) => p.technologies.some((t) => low(t) === low(name)));

const CORE_SET = new Set(PRIMARY_GROUPS.flatMap((g) => g.items).map(low));
const EXPLORING_SET = new Set(EXPLORING_GROUPS.flatMap((g) => g.items).map(low));

// kategori "domain" teknologi (Frontend, Backend, dst) dari data skill yang sudah ada
const domainOf = (name) => [...PRIMARY_GROUPS, ...EXPLORING_GROUPS].find((g) => g.items.some((i) => low(i) === low(name)))?.title;

// siapkan per tab: nomor urut, dua kolom seimbang (desktop lebar), daftar datar, jumlah proyek
const buildTab = (groups) => {
  let n = 0;
  const list = groups.map((g) => {
    const out = { ...g, start: n };
    n += g.items.length;
    return out;
  });

  let acc = 0;
  const left = [];
  const right = [];
  list.forEach((g) => {
    (acc < n / 2 ? left : right).push(g);
    acc += g.items.length;
  });

  const flat = groups.flatMap((g) => g.items);
  const counts = Object.fromEntries(flat.map((name) => [name, projectsUsing(name).length]));

  return { groups: list, columns: [left, right].filter((c) => c.length), flat, counts };
};

const TAB_DATA = Object.fromEntries(Object.entries(GROUPS).map(([id, groups]) => [id, buildTab(groups)]));

const FALLBACK_INFO = "Teknologi yang saya gunakan dan pelajari.";

/* ===================== HELPER ANIMASI ===================== */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";

// panel detail dibuka dengan potongan miring (harus sama dengan kelas clip-path di <aside>)
const CLIP_HIDDEN = "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)";
const CLIP_SHOWN = "polygon(10% 0, 100% 0, 100% 100%, 0 100%)";

// offset warna RGB singkat saat hover/klik
const RGB_ON = "3px 0 rgba(244,114,182,0.9), -3px 0 rgba(125,211,252,0.9)";
const RGB_OFF = "0px 0 rgba(244,114,182,0), 0px 0 rgba(125,211,252,0)";

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

const firstOf = (tabId) => TAB_DATA[tabId].flat[0] ?? null;

/* ===================== KOMPONEN ===================== */

const Skills = () => {
  const [tab, setTab] = useState("core");
  const [selected, setSelected] = useState(() => firstOf("core"));
  const [reduce] = useState(prefersReducedMotion);

  const rootRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const nameRef = useRef(null);
  const tabIntro = useRef(false);
  const detailIntro = useRef(false);

  const data = TAB_DATA[tab];
  const usedIn = selected ? projectsUsing(selected) : [];
  const fields = [...new Set(usedIn.map((p) => p.category))];
  const index = selected ? data.flat.indexOf(selected) + 1 : 0;
  const category = selected ? (domainOf(selected) ?? data.groups.find((g) => g.items.includes(selected))?.title) : null;

  const statuses = [];
  if (selected) {
    if (CORE_SET.has(low(selected))) statuses.push("Core");
    if (usedIn.length > 0) statuses.push("Used");
    if (EXPLORING_SET.has(low(selected))) statuses.push("Exploring");
  }

  const ticker = `${data.flat.join(" ✦ ").toUpperCase()} ✦ `;

  // pindah tab: pilihan dipertahankan kalau skill-nya ada di tab baru (kalau detail ditutup, tetap tertutup)
  const changeTab = (id) => {
    if (id === tab) return;
    setTab(id);
    setSelected((cur) => (cur === null ? null : TAB_DATA[id].flat.includes(cur) ? cur : firstOf(id)));
  };

  // feedback singkat: scramble nama + RGB offset + sentakan miring
  const fx = (btn, name) => {
    if (reduce) return;
    const label = btn.querySelector("[data-name]");
    if (!label) return;
    scramble(label, name, 0.3);
    gsap.fromTo(label, { x: -5, skewX: -10, textShadow: RGB_ON }, { x: 0, skewX: 0, textShadow: RGB_OFF, duration: 0.3, ease: "steps(4)", clearProps: "transform,textShadow", overwrite: true });
  };

  // panah memindahkan pilihan di daftar skill
  const onListKey = (e) => {
    const down = e.key === "ArrowDown" || e.key === "ArrowRight";
    const up = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!down && !up) return;
    const btns = [...(listRef.current?.querySelectorAll("[data-skill]") ?? [])];
    const i = btns.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    const next = btns[(i + (down ? 1 : -1) + btns.length) % btns.length];
    next.focus();
    setSelected(next.dataset.skill);
  };

  // panah kiri/kanan berpindah tab
  const onTabKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const bar = e.currentTarget;
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    e.preventDefault();
    changeTab(next.id);
    requestAnimationFrame(() => bar.querySelector(`[data-tab="${next.id}"]`)?.focus());
  };

  // Esc menutup detail
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- judul halaman: teks teracak saat dibuka ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const els = gsap.utils.toArray(".s-scr");
      els.forEach((el) => (el.style.visibility = "hidden"));
      els.forEach((el, i) => scramble(el, el.dataset.text, 0.8).delay(0.45 + i * 0.14));
    },
    { scope: rootRef },
  );

  /* ---- daftar skill masuk bergantian + judul grup teracak (diulang saat ganti tab) ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const base = tabIntro.current ? 0 : 0.5; // pertama kali menunggu transisi halaman
      tabIntro.current = true;

      gsap.from(".skill-item", { x: -18, opacity: 0, duration: 0.35, stagger: 0.025, ease: "power3.out", delay: base, clearProps: "transform,opacity" });

      const titles = gsap.utils.toArray(".group-title");
      titles.forEach((el, i) => {
        el.style.visibility = "hidden";
        scramble(el, el.dataset.text, 0.5).delay(base + 0.05 + i * 0.06);
      });

      return () => {
        titles.forEach((el) => {
          el._scr?.kill();
          el.textContent = el.dataset.text;
          el.style.visibility = "visible";
        });
      };
    },
    { scope: rootRef, dependencies: [tab], revertOnUpdate: true },
  );

  /* ---- panel detail: dibuka dengan potongan miring (desktop) / naik dari bawah (HP) ---- */
  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(panelRef.current, { clipPath: CLIP_HIDDEN }, { clipPath: CLIP_SHOWN, duration: 0.75, ease: "power4.out", delay: 0.5, clearProps: "clipPath" });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.from(panelRef.current, { yPercent: 30, opacity: 0, duration: 0.6, ease: "power4.out", delay: 0.5, clearProps: "transform,opacity" });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  /* ---- isi panel: nama terdekode, elemen lain naik bergantian ---- */
  useGSAP(
    () => {
      if (!selected || !nameRef.current) return;
      if (reduce) {
        nameRef.current.textContent = selected;
        return;
      }
      const base = detailIntro.current ? 0 : 0.55;
      detailIntro.current = true;

      scramble(nameRef.current, selected, 0.45).delay(base);
      gsap.from(".d-item", { y: 12, opacity: 0, duration: 0.35, stagger: 0.05, ease: "power3.out", delay: base, overwrite: "auto" });
      gsap.fromTo(".d-icon", { x: -10, skewX: -14 }, { x: 0, skewX: 0, duration: 0.4, ease: "steps(5)", delay: base + 0.05, clearProps: "transform" });
    },
    { scope: rootRef, dependencies: [selected] },
  );

  const nameFit = selected ? (100 / (Math.max(...selected.split(" ").map((w) => w.length)) * 1.3)).toFixed(1) : 20;

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mask-[linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />

      <PageNotch />

      {/* Selalu satu layar (tanpa scroll halaman); daftar scroll di dalam dirinya sendiri bila perlu */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col">
          {/* HEADER + TABS */}
          <header className="flex shrink-0 flex-col gap-3 p-4 pb-3 sm:gap-4 sm:p-8 sm:pb-4 md:pl-28 lg:flex-row lg:items-end lg:justify-between lg:pr-12 lg:pt-8">
            <div>
              <h1 aria-label="System // Skills" className="zz-rgb font-display uppercase leading-[0.85] tracking-wide" style={{ fontSize: "clamp(2.25rem, min(9vh, 12vw), 4.5rem)" }}>
                <span aria-hidden className="s-scr mb-1 block text-lime-300" style={{ fontSize: "0.4em" }} data-text="System //">
                  System //
                </span>
                <span aria-hidden className="s-scr block" data-text="Skills">
                  Skills
                </span>
              </h1>
              <p className="mt-2 hidden max-w-md font-body text-xs text-neutral-400 sm:block sm:text-sm">Technology profile / tools I use to build digital products.</p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <p aria-hidden className="hidden items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 lg:flex">
                <span className="size-2 animate-pulse rounded-full bg-lime-300 motion-reduce:animate-none" />
                System status: online
              </p>

              <div role="tablist" aria-label="Skill categories" onKeyDown={onTabKey} className="flex flex-wrap gap-2">
                {TABS.map((t) => {
                  const on = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`tab-${t.id}`}
                      data-tab={t.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="skill-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => changeTab(t.id)}
                      className={`flex min-h-9 items-center gap-2 rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 sm:text-xs ${
                        on ? "bg-lime-300 text-neutral-900" : "bg-white/5 text-neutral-300 ring-1 ring-white/15 hover:bg-white/10"
                      }`}
                    >
                      {t.label}
                      <span className="opacity-60">{pad(TAB_DATA[t.id].flat.length)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* BODY: daftar skill (kiri) + detail skill terpilih (kanan di desktop, bawah di HP) */}
          <div className="flex min-h-0 flex-1 flex-col md:ml-28 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
            {/* DAFTAR SKILL */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div
                ref={listRef}
                id="skill-panel"
                role="tabpanel"
                aria-labelledby={`tab-${tab}`}
                onKeyDown={onListKey}
                className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-3 scrollbar-none sm:px-8 md:pl-0 lg:pr-6"
              >
                <div key={tab} className="grid gap-x-8 gap-y-4 xl:grid-cols-2">
                  {data.columns.map((col, c) => (
                    <div key={c} className="flex flex-col gap-4 lg:gap-5">
                      {col.map(({ title, icon: Icon, items, start }) => (
                        <section key={title} aria-label={title}>
                          <h3 className="mb-2 flex items-center gap-2 font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-lime-300">
                            <Icon aria-hidden className="size-4 shrink-0" />
                            <span className="group-title" data-text={title}>
                              {title}
                            </span>
                            <span className="ml-auto text-neutral-500">×{pad(items.length)}</span>
                          </h3>

                          {/* HP: chip yang mudah disentuh. Desktop: baris database bernomor */}
                          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-white/10">
                            {items.map((name, i) => {
                              const on = selected === name;
                              const count = data.counts[name];
                              return (
                                <li key={name} className="lg:w-full">
                                  <button
                                    type="button"
                                    data-skill={name}
                                    aria-pressed={on}
                                    title={`${count} project${count === 1 ? "" : "s"}`}
                                    onClick={(e) => {
                                      setSelected(on ? null : name);
                                      if (!on) fx(e.currentTarget, name);
                                    }}
                                    onMouseEnter={(e) => fx(e.currentTarget, name)}
                                    className={`skill-item relative isolate flex min-h-11 w-full items-center gap-2.5 overflow-hidden px-3 py-1.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-300 max-lg:rounded-full max-lg:ring-1 max-lg:ring-white/15 lg:min-h-0 lg:border-b lg:border-white/10 ${
                                      on ? "text-neutral-900" : "text-white hover:text-lime-300"
                                    }`}
                                  >
                                    <span aria-hidden className={`absolute inset-0 -z-10 origin-left bg-lime-300 transition-transform duration-300 lg:-skew-x-12 ${on ? "scale-x-100" : "scale-x-0"}`} />
                                    <span aria-hidden className={`hidden w-6 shrink-0 font-display text-sm leading-none lg:block ${on ? "text-neutral-900" : "text-lime-300"}`}>
                                      {pad(start + i + 1)}
                                    </span>
                                    <span aria-hidden className={`inline-flex size-4 shrink-0 items-center justify-center ${on ? "text-neutral-900" : "text-lime-300"}`}>
                                      <TechIcon name={name} className="size-4" />
                                    </span>
                                    <span data-name className="block min-w-0 truncate font-display text-base uppercase leading-none tracking-wide xl:text-lg 2xl:text-xl">
                                      {name}
                                    </span>
                                    <span className={`ml-auto shrink-0 pl-1 font-body text-[10px] font-bold tracking-widest ${on ? "text-neutral-900/70" : "text-neutral-400"}`}>×{pad(count)}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      ))}
                    </div>
                  ))}
                </div>

                {data.flat.length === 0 && <p className="p-2 font-body text-sm text-neutral-400">Belum ada data.</p>}
              </div>

              {/* status bar bawah (desktop) */}
              <div aria-hidden className="hidden shrink-0 items-center justify-between border-t border-white/10 py-3 pr-6 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 lg:flex">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 animate-pulse rounded-full bg-lime-300 motion-reduce:animate-none" />
                  Database // Active
                </span>
                <span>{pad(data.flat.length)} entries</span>
              </div>
            </div>

            {/* DETAIL SKILL TERPILIH: selalu terlihat, tidak perlu scroll halaman */}
            <aside ref={panelRef} aria-label="Selected skill" className={`relative shrink-0 overflow-hidden bg-lime-300 text-neutral-900 lg:shrink lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)] ${selected ? "" : "max-lg:hidden"}`}>
              {/* garis pindai CRT di atas panel */}
              <div aria-hidden className="zz-scanlines pointer-events-none absolute inset-0 opacity-40" />

              {selected ? (
                <>
                  <button
                    type="button"
                    aria-label="Tutup detail"
                    onClick={() => setSelected(null)}
                    className="absolute right-2.5 top-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-neutral-900 text-lime-300 transition-transform hover:rotate-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 lg:right-4 lg:top-4 lg:size-9"
                  >
                    <X aria-hidden className="size-4" />
                  </button>

                  <div className="relative flex flex-col gap-3 overflow-y-auto p-4 scrollbar-none max-lg:max-h-[min(46svh,22rem)] sm:p-5 lg:h-full lg:justify-center lg:gap-4 lg:p-8 lg:pb-14 lg:pl-[16%]">
                    <p className="sr-only" aria-live="polite">
                      {selected} selected, used in {usedIn.length} {usedIn.length === 1 ? "project" : "projects"}
                    </p>

                    <div className="d-item flex items-center justify-between pr-10 font-body text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">
                      <span>Selected skill</span>
                      <span>
                        {pad(index)} / {pad(data.flat.length)}
                      </span>
                    </div>

                    {/* ikon + nama (ukuran dihitung dari kata terpanjang; huruf Stormfaze lebar ±1.3em) */}
                    <div className="d-item flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
                      <div className="d-icon flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-lime-300 lg:size-14">
                        <TechIcon name={selected} className="size-6 lg:size-7" />
                      </div>
                      <div className="min-w-0 flex-1 lg:w-full lg:flex-none" style={{ containerType: "inline-size" }}>
                        <h2 aria-label={selected} className="zz-rgb wrap-break-words font-display uppercase leading-[0.95] tracking-wide" style={{ fontSize: `min(3.25rem, ${nameFit}cqw)` }}>
                          <span ref={nameRef} aria-hidden />
                        </h2>
                      </div>
                    </div>

                    {/* data inti: status, kategori, pengalaman, bidang (tanpa persentase) */}
                    <dl className="d-item grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-neutral-900/20 py-3 font-body">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Status</dt>
                        <dd className="mt-1 flex flex-wrap gap-1">
                          {statuses.length > 0 ? (
                            statuses.map((s) => (
                              <span key={s} className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-lime-300">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs font-extrabold uppercase">Listed</span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Category</dt>
                        <dd className="mt-1 text-xs font-extrabold uppercase tracking-wide">{category ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Experience</dt>
                        <dd className="mt-1 text-xs font-extrabold uppercase tracking-wide">{usedIn.length > 0 ? `Used in ${usedIn.length} ${usedIn.length === 1 ? "project" : "projects"}` : "Not in a project yet"}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Field</dt>
                        <dd className="mt-1 text-xs font-extrabold uppercase tracking-wide">{fields.length > 0 ? fields.join(" · ") : "—"}</dd>
                      </div>
                    </dl>

                    <p className="d-item font-body text-xs font-semibold leading-relaxed sm:text-sm">{SKILL_INFO[selected] ?? FALLBACK_INFO}</p>

                    <div className="d-item flex flex-col gap-2">
                      <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Used in</span>
                      {usedIn.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {usedIn.map((p) => (
                            <li key={p.slug}>
                              <Link
                                to={`/projects/${p.slug}`}
                                className="inline-flex min-h-9 items-center rounded-full bg-neutral-900 px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-wider text-lime-300 transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                              >
                                {p.short} →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="font-body text-xs font-semibold opacity-70">belum ada proyek yang tercantum</span>
                      )}
                    </div>

                    <Link
                      to="/projects"
                      className="d-item hidden self-start border-2 border-neutral-900 px-4 py-2 font-body text-[11px] font-extrabold uppercase tracking-widest transition-colors hover:bg-neutral-900 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:inline-flex"
                    >
                      View projects →
                    </Link>
                  </div>
                </>
              ) : (
                <p className="relative p-6 font-body text-sm font-semibold ml-7">Pilih sebuah skill untuk melihat detailnya.</p>
              )}

              {/* marquee ambient: lapisan sekunder, mati saat reduced-motion */}
              {!reduce && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden overflow-hidden border-t border-neutral-900/20 py-1.5 text-neutral-900/35 lg:block">
                  <div className="zz-marquee font-display text-sm uppercase tracking-widest">
                    {[0, 1].map((n) => (
                      <span key={n} className="shrink-0 whitespace-pre">
                        {ticker.repeat(3)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
