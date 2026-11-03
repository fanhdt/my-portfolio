import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Download } from "lucide-react";
import { IMAGES_DATA } from "../data/imageData";
import PageNotch from "../components/PageNotch";

gsap.registerPlugin(useGSAP);

/* ===================== DATA ===================== */

// menu utama ala layar judul game (sesuaikan path dengan routermu)
const MENU = [
  { to: "/projects", label: "Projects", hint: "Selected works" },
  { to: "/skills", label: "Skills", hint: "Tech stack" },
  { to: "/about", label: "About", hint: "Who's playing" },
  { to: "/contact", label: "Contact", hint: "Open channel" },
];

// Letakkan file CV di folder public/, lalu sesuaikan nama file di sini
const CV = { href: "/cv.pdf", filename: "Mochamad_Irfan_Hidayat_CV.pdf" };

const TITLE = ["Build.", "Ship.", "Play."];
const BOOT = ["SYS.BOOT", "LOAD PROFILE", "LINK ESTABLISHED"];
const MARQUEE = "PRESS START ✦ FULLSTACK DEVELOPER ✦ WEB ✦ MOBILE ✦ INTERACTIVE ✦ ";
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

const pad = (n) => String(n).padStart(2, "0");

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

/* ===================== KOMPONEN ===================== */

const Home = () => {
  const root = useRef(null);
  const menuRef = useRef(null);
  const [active, setActive] = useState(0); // kursor menu, tetap di item terakhir yang disorot

  /* ---- navigasi keyboard: panah atas/bawah memindahkan kursor menu ---- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const items = [...(menuRef.current?.querySelectorAll("a") ?? [])];
      if (!items.length) return;
      const down = e.key === "ArrowDown";
      const idx = items.indexOf(document.activeElement);
      const next = idx === -1 ? (down ? 0 : items.length - 1) : (idx + (down ? 1 : -1) + items.length) % items.length;
      e.preventDefault();
      items[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- animasi masuk: boot log, judul teracak, menu, gambar ---- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scr = gsap.utils.toArray(".h-scr");
        scr.forEach((el) => (el.style.visibility = "hidden"));

        // delay menunggu transisi halaman (±0.75 detik) selesai
        gsap.from("[data-art]", { opacity: 0, xPercent: 6, duration: 1, ease: "power3.out", delay: 0.4 });
        gsap.from("[data-art-img]", { scale: 1.25, duration: 1.4, ease: "power3.out", delay: 0.4 });
        gsap.from("[data-band]", { xPercent: 120, duration: 0.9, ease: "power4.out", delay: 0.9 });
        gsap.from("[data-in]", {
          y: 44,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
          stagger: 0.09,
          delay: 0.55,
        });

        scr.forEach((el, i) => scramble(el, el.dataset.text, 0.8).delay(0.6 + i * 0.1));

        // scramble saat baris menu di-hover / difokus
        const cleanups = gsap.utils.toArray("[data-scramble]").map((el) => {
          const trigger = el.closest("[data-hover]") || el.parentElement;
          const on = () => scramble(el, el.dataset.scramble, 0.45);
          trigger.addEventListener("mouseenter", on);
          trigger.addEventListener("focus", on);
          return () => {
            trigger.removeEventListener("mouseenter", on);
            trigger.removeEventListener("focus", on);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  /* ---- parallax gambar dan pita mengikuti kursor (desktop) ---- */
  useGSAP(
    () => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || calm) return;

      const section = root.current;
      const ix = gsap.quickTo("[data-art-img]", "x", { duration: 0.9, ease: "power3.out" });
      const iy = gsap.quickTo("[data-art-img]", "y", { duration: 0.9, ease: "power3.out" });
      const bx = gsap.quickTo("[data-band]", "x", { duration: 1.2, ease: "power3.out" });

      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        ix(nx * -26);
        iy(ny * -16);
        bx(nx * 28);
      };
      section.addEventListener("pointermove", onMove);
      return () => section.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  const art = IMAGES_DATA[0].src;
  const artClass = "size-full object-cover object-[70%_top]";

  return (
    <section ref={root} className="relative h-full overflow-hidden rounded-2xl bg-(--bar)">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.22 0 H1 V1 H0 C0.1 0.75, 0.32 0.3, 0.22 0 Z" />
          </clipPath>
          <clipPath id="hero-shape-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.16 0 H1 V1 H0 C0.08 0.75, 0.26 0.3, 0.16 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[62%] bg-lime-300 lg:block [clip-path:url(#hero-shape-clip)]" />

      <div data-art aria-hidden className="absolute inset-0 overflow-hidden lg:left-auto lg:w-[56%] lg:[clip-path:url(#hero-clip)]">
        <div data-art-img className="absolute inset-0">
          <img src={art} alt="" className={`${artClass} scale-110`} />
          {/* salinan glitch: irisan bergeser berwarna */}
          {["zz-slice-a", "zz-slice-b"].map((c) => (
            <img key={c} src={art} alt="" className={`${c} absolute inset-0 scale-110 ${artClass}`} />
          ))}
        </div>
        <div className="zz-scanlines pointer-events-none absolute inset-0" />
        <div className="zz-sweepline pointer-events-none absolute inset-0 overflow-hidden" />
      </div>

      {/* pita marquee miring (desktop) */}
      <div data-band aria-hidden className="pointer-events-none absolute -right-10 bottom-20 left-[44%] hidden -rotate-6 overflow-hidden bg-lime-300 py-2 text-neutral-900 lg:block">
        <div className="zz-marquee font-display text-xl uppercase tracking-wider">
          {[0, 1].map((n) => (
            <span key={n} className="shrink-0 whitespace-pre">
              {MARQUEE.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* HUD kanan atas */}
      <div aria-hidden className="pointer-events-none absolute right-6 top-6 z-10 hidden items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 lg:flex">
        <span className="size-2 animate-pulse rounded-full bg-lime-300" />
        Portfolio {new Date().getFullYear()}
        <span className="h-px w-12 bg-white/40" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent lg:hidden" />

      <PageNotch />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto overscroll-contain p-6 [scrollbar-width:none] sm:p-12 md:pl-24 lg:max-w-[46%] lg:px-16 lg:py-10 lg:pl-24 [&::-webkit-scrollbar]:hidden">
        <div className="mt-auto flex flex-col gap-4 lg:my-auto lg:gap-3">
          {/* status */}
          <p data-in className="flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300 sm:text-xs">
            <span className="size-2 animate-pulse rounded-full bg-lime-300" />
            <span className="h-scr" data-text="Available for work · Bandung, ID">
              Available for work · Bandung, ID
            </span>
          </p>

          {/* boot log (disembunyikan di layar pendek) */}
          <ul aria-hidden className="flex flex-col gap-0.5 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 max-sm:hidden [@media(max-height:820px)]:hidden">
            {BOOT.map((line) => (
              <li key={line} className="h-scr" data-text={`> ${line} ... OK`}>
                {`> ${line} ... OK`}
              </li>
            ))}
          </ul>

          {/* judul */}
          <h1 className="zz-rgb font-display uppercase leading-[0.9] tracking-wide text-white" aria-label={TITLE.join(" ")} style={{ fontSize: "clamp(1.75rem, min(8.5vh, 11vw), 6rem)" }}>
            {TITLE.map((word, i) => (
              <span key={word} data-in aria-hidden className={`h-scr block ${i === TITLE.length - 1 ? "text-lime-300" : ""}`} data-text={word}>
                {word}
              </span>
            ))}
          </h1>

          {/* kartu pemain */}
          <div data-in className="flex flex-col gap-0.5 border-l-2 border-lime-300 pl-3">
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-lime-300">Player 01</span>
            <span className="font-body text-sm font-extrabold uppercase tracking-[0.12em] text-white sm:text-base">Mochamad Irfan Hidayat</span>
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">Fullstack Developer · Web, Mobile, Interactive</span>
          </div>

          {/* menu utama ala game */}
          <nav aria-label="Menu utama">
            <ul ref={menuRef} className="border-t border-white/15">
              {MENU.map(({ to, label, hint }, i) => {
                const on = i === active;
                return (
                  <li key={to} data-in className="border-b border-white/10">
                    <Link
                      to={to}
                      data-hover
                      aria-current={on || undefined}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className={`group relative isolate grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 overflow-hidden px-3 py-2 outline-none lg:py-1.5 transition-colors duration-200 ${on ? "text-neutral-900" : "text-white"}`}
                    >
                      <span aria-hidden className={`absolute inset-0 -z-10 origin-left -skew-x-12 bg-lime-300 transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`} />
                      <span className={`font-display text-lg leading-none ${on ? "text-neutral-900" : "text-lime-300"}`}>{pad(i + 1)}</span>
                      <span className="font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl" data-scramble={label}>
                        {label}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className={`font-body text-[10px] font-bold uppercase tracking-[0.25em] max-sm:hidden ${on ? "text-neutral-900/70" : "text-neutral-400"}`}>{hint}</span>
                        <span aria-hidden className={`transition-transform duration-300 ${on ? "translate-x-0" : "-translate-x-2 opacity-0"}`}>
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div data-in className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="zz-border inline-flex rounded-full p-0.5">
                <a
                  href={CV.href}
                  download={CV.filename}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-lime-300 px-5 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
                >
                  Download CV
                  <Download aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </span>
              <p aria-hidden className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 [@media(hover:none)]:hidden">
                ↑ ↓ pilih · Enter buka
              </p>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Home;
