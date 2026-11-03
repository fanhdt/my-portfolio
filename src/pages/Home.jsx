import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IMAGES_DATA } from "../data/imageData";
import PageNotch from "../components/PageNotch";

const Home = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // delay menunggu transisi halaman (±0.75 detik) selesai
        gsap.from("[data-art]", { opacity: 0, xPercent: 6, duration: 1, ease: "power3.out", delay: 0.4 });
        gsap.from("[data-in]", {
          y: 44,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
          stagger: 0.09,
          delay: 0.55,
        });
      });
    },
    { scope: root },
  );

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
        <img data-depth="22" src={IMAGES_DATA[0].src} alt="" className="size-full scale-110 object-cover object-[70%_top]" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent lg:hidden" />

      <PageNotch />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto overscroll-contain p-6 sm:p-12 md:pl-24 lg:max-w-[46%] lg:p-16 lg:pl-24">
        <div className="mt-auto flex flex-col gap-4 lg:my-auto lg:gap-6">
          <p data-in className="flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300 sm:text-xs">
            <span className="size-2 rounded-full bg-lime-300" />
            Available for work · Bandung, ID
          </p>

          <h1 className="font-display uppercase leading-[0.9] tracking-wide text-white" style={{ fontSize: "clamp(1.75rem, min(10vh, 11vw), 6rem)" }}>
            <span data-in className="block">
              Mochamad
            </span>
            <span data-in className="block">
              Irfan
            </span>
            <span data-in className="block">
              Hidayat
            </span>
          </h1>

          <p data-in className="font-body text-sm font-extrabold uppercase tracking-[0.25em] text-white sm:text-lg">
            Fullstack Developer
          </p>

          <p data-in className="max-w-sm font-body text-sm leading-relaxed text-neutral-200 sm:text-base">
            Building web, mobile, and interactive experiences.
          </p>

          <div data-in className="flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:scale-105 hover:bg-white active:scale-95"
            >
              View Projects <span aria-hidden>→</span>
            </Link>
            <Link to="/about" className="inline-flex w-fit items-center rounded-full px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-white ring-1 ring-white/30 transition-colors hover:bg-white/10">
              About Me do yu?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
