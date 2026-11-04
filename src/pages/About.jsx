import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GraduationCap, MapPin, BadgeCheck, Code2, Compass } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { IMAGES } from "../data/imageData";
import { STAT_GROUPS, averageLevel } from "../data/skillsData";

gsap.registerPlugin(useGSAP);

/* ===================== DATA ===================== */

// kata raksasa bawaan di belakang foto
const DEFAULT_WORD = "IRFAN";

// `word` = kata yang muncul di belakang foto saat baris di-hover
const FACTS = [
  { icon: GraduationCap, label: "Education", lines: ["Universitas Pendidikan Indonesia", "Pendidikan Multimedia"], word: "UPI" },
  { icon: MapPin, label: "Location", lines: ["Bandung, Indonesia"], word: "BANDUNG" },
  { icon: BadgeCheck, label: "Current status", lines: ["Available for opportunities"], word: "OPEN", status: true },
  { icon: Code2, label: "Focus", lines: ["Fullstack Development"], word: "WEB" },
  { icon: Compass, label: "Exploring", lines: ["AI Integration / DevOps"], word: "AI OPS" },
];

// Data statistik (STAT_GROUPS) dan averageLevel sekarang ada di data/skillsData.js

const MODES = [
  { id: "simple", label: "Simple" },
  { id: "detail", label: "Detail" },
];

// ganti ke true kalau fotonya PNG transparan (tanpa latar), supaya tidak dipotong bentuk
const PHOTO_IS_CUTOUT = false;
// const PHOTO_SRC = IMAGES.hero;
const PHOTO_PROFILE = IMAGES.profile;
const PHOTO_BG = IMAGES.background;

// kelas bentuk foto dipakai ulang oleh salinan glitch dan lapisan scanline
const PHOTO_SHAPE = PHOTO_IS_CUTOUT ? "" : "[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%,0_7%)]";
const PHOTO_FADE = "[mask-image:linear-gradient(to_bottom,black_82%,transparent)]";

const TICKER = "FULLSTACK DEVELOPER ✦ WEB ✦ MOBILE ✦ INTERACTIVE ✦ ";
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// teks teracak lalu menyusun diri menjadi teks akhir (panjang teks tetap)
const scramble = (el, text, duration = 0.8) => {
  const o = { p: 0 };
  return gsap.to(o, {
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
};

const Cross = ({ className = "" }) => (
  <svg aria-hidden viewBox="0 0 12 12" className={`size-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 0v12M0 6h12" />
  </svg>
);

/* ===================== KOMPONEN ===================== */

const About = () => {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const wordRef = useRef(null);
  const photoImgRef = useRef(null);
  const wordTween = useRef(null);
  const wordMounted = useRef(false);
  const statsPlayed = useRef(false);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("simple");
  const [reduce] = useState(prefersReducedMotion);

  const word = active === null ? DEFAULT_WORD : FACTS[active].word;

  const changeMode = (id) => {
    if (id === mode) return;
    statsPlayed.current = true; // setelah ini, animasi statistik tanpa jeda intro
    setMode(id);
  };

  /* ---- animasi masuk: kata, foto, shard, fakta + scramble teks ---- */
  useGSAP(
    () => {
      if (reduce) return;

      const scr = gsap.utils.toArray(".a-scr");
      scr.forEach((el) => (el.style.visibility = "hidden"));

      // jeda sebentar supaya tidak bentrok dengan transisi halaman (slash reveal ~0.9s)
      const tl = gsap.timeline({ delay: 0.45, defaults: { ease: "power3.out" } });
      tl.from("[data-layer='word']", { yPercent: 35, opacity: 0, duration: 0.8 })
        .from(".a-ticker", { xPercent: 30, opacity: 0, duration: 0.9 }, "<0.1")
        .from("[data-layer='photo']", { y: 70, opacity: 0, clipPath: "inset(100% 0 0 0)", duration: 0.9 }, "-=0.55")
        .from(".shard", { y: 50, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .from(".a-hud", { opacity: 0, y: -8, duration: 0.5, stagger: 0.1 }, "-=0.5")
        .from(".fact-row", { x: -24, opacity: 0, duration: 0.5, stagger: 0.06 }, "-=0.6");

      scr.forEach((el, i) => scramble(el, el.dataset.text, 0.9).delay(0.5 + i * 0.14));

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

  /* ---- statistik: bar terisi + angka naik. Diulang tiap ganti mode ---- */
  useGSAP(
    () => {
      const fills = gsap.utils.toArray(".stat-fill");
      const nums = gsap.utils.toArray("[data-num]");

      if (reduce) {
        fills.forEach((el) => gsap.set(el, { scaleX: Number(el.dataset.value) / 100 }));
        return;
      }

      // pertama kali menunggu intro selesai, ganti mode langsung jalan
      const base = statsPlayed.current ? 0 : 1.2;
      const step = statsPlayed.current ? 0.04 : 0.1;

      nums.forEach((el) => (el.textContent = "0"));
      gsap.from(".stat-row", { x: 24, opacity: 0, duration: 0.5, stagger: step, ease: "power3.out", delay: base });

      fills.forEach((el, i) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: Number(el.dataset.value) / 100, duration: 1, ease: "power2.out", delay: base + 0.15 + i * step });
      });

      nums.forEach((el, i) => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: Number(el.dataset.value),
          duration: 1,
          ease: "power2.out",
          snap: { v: 1 },
          delay: base + 0.15 + i * step,
          onUpdate: () => (el.textContent = counter.v),
        });
      });

      // judul panel ikut teracak setiap ganti mode
      const title = gsap.utils.toArray(".stat-title")[0];
      if (title) {
        if (!statsPlayed.current) title.style.visibility = "hidden";
        scramble(title, title.dataset.text, 0.6).delay(base);
        return () => (title.textContent = title.dataset.text);
      }
    },
    { scope: rootRef, dependencies: [mode], revertOnUpdate: true },
  );

  /* ---- parallax halus antar lapisan mengikuti pointer (desktop) ---- */
  useGSAP(
    () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!finePointer || reduce) return;

      const stage = stageRef.current;
      const wordX = gsap.quickTo("[data-layer='word']", "x", { duration: 0.6, ease: "power3.out" });
      const photoX = gsap.quickTo("[data-layer='photo']", "x", { duration: 0.6, ease: "power3.out" });
      const shardX = gsap.quickTo("[data-layer='shards']", "x", { duration: 0.6, ease: "power3.out" });
      const tickerX = gsap.quickTo(".a-ticker", "x", { duration: 0.9, ease: "power3.out" });

      const onMove = (e) => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        wordX(nx * -26);
        photoX(nx * 10);
        shardX(nx * 34);
        tickerX(nx * 50);
      };
      const onLeave = () => {
        wordX(0);
        photoX(0);
        shardX(0);
        tickerX(0);
      };

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  /* ---- ganti kata di belakang foto: teks teracak + foto tersentak glitch ---- */
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;

    if (!wordMounted.current) {
      wordMounted.current = true;
      el.textContent = word;
      return;
    }
    if (reduce) {
      el.textContent = word;
      return;
    }

    wordTween.current?.kill();
    gsap.killTweensOf(el);
    wordTween.current = scramble(el, word, 0.45);
    gsap.fromTo(el, { x: -14, skewX: -10 }, { x: 0, skewX: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });

    const img = photoImgRef.current;
    if (img) {
      gsap.killTweensOf(img);
      gsap.fromTo(img, { x: -7, filter: "hue-rotate(70deg) saturate(2.2)" }, { x: 0, filter: "hue-rotate(0deg) saturate(1)", duration: 0.4, ease: "steps(5)" });
    }
  }, [word, reduce]);

  useEffect(() => () => wordTween.current?.kill(), []);

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* BACKGROUND TEKNIS */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" style={DOTS} />
      <Cross className="pointer-events-none absolute bottom-24 left-[36%] hidden text-lime-300 opacity-70 lg:block" />

      <PageNotch />

      {/* AREA SCROLL (cadangan untuk layar kecil; di desktop semuanya satu layar) */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none">
        <div className="grid min-h-full lg:h-full lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)_minmax(0,19rem)]">
          {/* ZONA KIRI: IDENTITAS + FAKTA */}
          <div className="relative z-20 flex flex-col p-6 sm:p-8 lg:min-h-0 lg:py-12 lg:pl-10 lg:pr-0">
            <h1 className="zz-rgb font-display uppercase leading-[0.85] tracking-wide text-white" style={{ fontSize: "clamp(2.5rem, min(9vh, 12vw), 4.5rem)" }} aria-label="About Me">
              <span aria-hidden className="a-scr" data-text="About">
                About
              </span>{" "}
              <span aria-hidden className="a-scr text-lime-300" data-text="Me">
                Me
              </span>
            </h1>

            <div className="mt-5">
              <h2 className="a-scr font-body text-lg font-extrabold uppercase leading-tight tracking-wide sm:text-xl" data-text="Mochamad Irfan Hidayat">
                Mochamad Irfan Hidayat
              </h2>
              <p className="a-scr mt-1 font-body text-xs font-extrabold uppercase tracking-[0.25em] text-lime-300" data-text="Fullstack Developer">
                Fullstack Developer
              </p>
              <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-neutral-300">Multimedia Education graduate building practical digital products across web, mobile, and interactive applications.</p>
            </div>

            <dl className="mt-6 md:ml-7 flex flex-col gap-1.5 lg:mt-auto" onMouseLeave={() => setActive(null)}>
              {FACTS.map(({ icon: Icon, label, lines, status }, i) => (
                <div
                  key={label}
                  tabIndex={0}
                  data-hover
                  data-active={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                  className="fact-row grid cursor-default grid-cols-[auto_1fr] gap-3 border-l-2 border-white/10 py-1.5 pl-3 pr-2 outline-none transition-[translate,background-color,border-color] duration-200 hover:translate-x-1 hover:border-lime-300 hover:bg-white/5 focus-visible:translate-x-1 focus-visible:border-lime-300 focus-visible:bg-white/5 data-[active=true]:translate-x-1 data-[active=true]:border-lime-300 data-[active=true]:bg-white/5"
                >
                  <Icon className="mt-0.5 size-4 text-lime-300" />
                  <div>
                    <dt className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                      <span data-scramble={label}>{label}</span>
                    </dt>
                    {lines.map((line) => (
                      <dd key={line} className="flex items-center gap-2 font-body text-[13px] font-semibold leading-snug">
                        {status && <span className="size-2 shrink-0 animate-pulse rounded-full bg-lime-300" />}
                        <span data-scramble={line}>{line}</span>
                      </dd>
                    ))}
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ZONA TENGAH: PANGGUNG KARAKTER (3 lapisan) */}
          <div ref={stageRef} className="relative h-[48svh] min-h-0 max-lg:order-first lg:h-auto" style={{ containerType: "size" }}>
            {/* LAPISAN 1: kata raksasa berkontur di belakang */}
            <div data-layer="word" aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] z-0 flex justify-center overflow-hidden">
              <span
                ref={wordRef}
                className="block whitespace-nowrap font-display uppercase leading-[0.9] tracking-wide"
                style={{
                  fontSize: `min(52cqh, ${150 / word.length}cqw)`,
                  color: "rgba(163, 230, 53, 0.05)",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.55)",
                }}
              />
            </div>

            {/* pita ticker berkontur di belakang foto, bergerak pelan */}
            <div aria-hidden className="a-ticker pointer-events-none absolute -left-8 -right-8 bottom-[22%] z-5 -rotate-6 overflow-hidden border-y border-white/15 py-1">
              <div className="zz-marquee font-display text-lg uppercase tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]">
                {[0, 1].map((n) => (
                  <span key={n} className="shrink-0 whitespace-pre">
                    {TICKER.repeat(4)}
                  </span>
                ))}
              </div>
            </div>

            {/* LAPISAN 2: foto sebagai karakter */}
            <div data-layer="photo" className="absolute bottom-0 left-1/2 z-10 aspect-3/4 h-[90%] -translate-x-1/2">
              <img ref={photoImgRef} src={PHOTO_PROFILE} alt="Mochamad Irfan Hidayat" className={`size-full object-cover object-[60%_top] ${PHOTO_SHAPE} ${PHOTO_FADE}`} />

              {/* salinan glitch: irisan bergeser berwarna */}
              {["zz-slice-a", "zz-slice-b"].map((c) => (
                <img key={c} src={PHOTO_BG} alt="" aria-hidden className={`${c} pointer-events-none absolute inset-0 size-full object-cover object-[60%_top] ${PHOTO_SHAPE} ${PHOTO_FADE}`} />
              ))}

              {/* garis pindai + garis cahaya */}
              <div aria-hidden className={`pointer-events-none absolute inset-0 ${PHOTO_SHAPE} ${PHOTO_FADE}`}>
                <div className="zz-scanlines absolute inset-0" />
                <div className="zz-sweepline absolute inset-0 overflow-hidden" />
              </div>
            </div>

            {/* LAPISAN 3: shard aksen di depan foto */}
            <svg data-layer="shards" aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 size-full">
              <polygon className="shard" points="14,100 27,74 37,100" fill="#bef264" />
              <polygon className="shard" points="38,100 42,89 47,100" fill="#ffffff" />
              <polygon className="shard" points="70,100 82,68 90,100" fill="none" stroke="#bef264" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <polygon className="shard" points="87,22 92,6 95,26" fill="#bef264" />
              <polygon className="shard" points="6,34 10,22 12,40" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* HUD kecil */}
            <div aria-hidden className="a-hud pointer-events-none absolute right-4 top-4 z-30 hidden items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 sm:flex">
              <span className="size-2 animate-pulse rounded-full bg-lime-300" />
              Sync 100%
            </div>
            <div aria-hidden className="a-hud pointer-events-none absolute left-5 top-4 z-30 hidden font-body text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 sm:block">
              ID // 0417
            </div>

            <p className="pointer-events-none absolute bottom-5 left-5 z-30 hidden -rotate-3 origin-left font-body text-lg font-bold italic leading-tight text-neutral-200 sm:block">
              Keep Learning.
              <br />
              Keep Building.
            </p>
          </div>

          {/* ZONA KANAN: STATISTIK GAYA RPG (mode Simple / Detail) */}
          <aside className="relative z-20 p-6 pt-2 sm:p-8 sm:pt-2 lg:min-h-0 lg:py-12 lg:pl-0 lg:pr-8">
            <div className="rounded-2xl p-5 ring-1 ring-white/10 lg:h-full lg:overflow-y-auto lg:scrollbar-none" style={{ background: "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)), var(--bar)" }}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="stat-title font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400" data-text="Player stats">
                  Player stats
                </span>

                <div role="group" aria-label="Mode statistik" className="flex shrink-0 rounded-full bg-white/5 p-0.5 ring-1 ring-white/15">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={mode === m.id}
                      onClick={() => changeMode(m.id)}
                      className={`rounded-full px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 ${
                        mode === m.id ? "bg-lime-300 text-neutral-900" : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "simple" ? (
                /* SIMPLE: satu bar per grup (rata-rata teknologinya) */
                <ul key="simple" className="flex flex-col gap-5">
                  {STAT_GROUPS.map(({ label, items }) => {
                    const value = averageLevel(items);
                    return (
                      <li key={label} className="stat-row">
                        <div className="mb-1.5 flex items-end justify-between">
                          <span className="font-body text-sm font-extrabold uppercase tracking-wide">{label}</span>
                          <span data-num data-value={value} className="font-display text-2xl leading-none text-lime-300">
                            {value}
                          </span>
                        </div>
                        {/* bar miring bersegmen */}
                        <div
                          role="progressbar"
                          aria-label={label}
                          aria-valuenow={value}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="h-3 -skew-x-12 overflow-hidden bg-white/10 mask-[repeating-linear-gradient(90deg,#000_0_9px,transparent_9px_12px)]"
                        >
                          <div className="stat-fill zz-shine h-full origin-left bg-lime-300" data-value={value} style={{ transform: "scaleX(0)" }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                /* DETAIL: tiap teknologi punya bar sendiri, dikelompokkan per grup */
                <div key="detail" className="flex flex-col gap-4">
                  {STAT_GROUPS.map(({ label, items }) => (
                    <section key={label}>
                      <h3 className="stat-row mb-1.5 flex items-center justify-between border-b border-white/10 pb-1 font-body text-[11px] font-extrabold uppercase tracking-[0.25em] text-lime-300">
                        <span>{label}</span>
                        <span className="text-neutral-500">{items.length}</span>
                      </h3>
                      <ul className="flex flex-col gap-1.5">
                        {items.map(({ name, value }) => (
                          <li key={name} className="stat-row grid grid-cols-[5.5rem_minmax(0,1fr)_1.75rem] items-center gap-2">
                            <span className="truncate font-body text-xs font-semibold">{name}</span>
                            <div
                              role="progressbar"
                              aria-label={name}
                              aria-valuenow={value}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              className="h-2 -skew-x-12 overflow-hidden bg-white/10 mask-[repeating-linear-gradient(90deg,#000_0_9px,transparent_9px_12px)]"
                            >
                              <div className="stat-fill zz-shine h-full origin-left bg-lime-300" data-value={value} style={{ transform: "scaleX(0)" }} />
                            </div>
                            <span data-num data-value={value} className="text-right font-display text-base leading-none text-white">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
