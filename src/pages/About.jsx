import { GraduationCap, MapPin, BadgeCheck, Code2, Compass } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { IMAGES_DATA } from "../data/imageData";

const FACTS = [
  { icon: GraduationCap, label: "Education", lines: ["Universitas Pendidikan Indonesia", "Pendidikan Multimedia"] },
  { icon: MapPin, label: "Location", lines: ["Bandung, Indonesia"] },
  { icon: BadgeCheck, label: "Current status", lines: ["Available for opportunities"], status: true },
  { icon: Code2, label: "Focus", lines: ["Web Development"] },
  { icon: Compass, label: "Exploring", lines: ["AI Integration / DevOps"] },
];

const STRIPES = { background: "repeating-linear-gradient(-45deg, #ffffff 0 6px, transparent 6px 14px)" };

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const Cross = ({ className = "" }) => (
  <svg aria-hidden viewBox="0 0 12 12" className={`size-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 0v12M0 6h12" />
  </svg>
);

const About = () => {
  return (
    <section className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="about-art-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.14 C0.22 0.03, 0.55 0, 0.78 0.07 C0.94 0.12, 1 0.24, 0.98 0.42 L0.93 1 H0 Z" />
          </clipPath>
          <clipPath id="about-shape-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.3 C0.2 0.12, 0.5 0.04, 0.82 0.1 C0.97 0.14, 1 0.3, 1 0.5 L1 1 H0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* BACKGROUND TEKNIS */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" style={DOTS} />
      <svg aria-hidden viewBox="0 0 220 110" className="pointer-events-none absolute right-[22rem] top-6 hidden w-56 text-white opacity-[0.12] lg:block" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 40 H60 L80 20 H200 M60 40 V90 H120 L140 70 H220" />
        <circle cx="200" cy="20" r="3" />
        <circle cx="220" cy="70" r="3" />
      </svg>
      <Cross className="pointer-events-none absolute left-[40%] top-[58%] hidden text-white opacity-20 lg:block" />
      <Cross className="pointer-events-none absolute bottom-24 right-[24rem] hidden text-lime-300 opacity-70 lg:block" />
      <div aria-hidden className="pointer-events-none absolute right-[22rem] top-24 hidden h-2 w-20 opacity-20 lg:block" style={STRIPES} />

      {/* garis teknis bawah */}
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-24 right-6 hidden h-px bg-white/15 md:block" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-24 right-6 hidden h-2 opacity-20 md:block" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ffffff 0 1px, transparent 1px 16px)" }} />

      <PageNotch />

      {/* AREA SCROLL */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none]">
        <div className="grid min-h-full md:grid-cols-[30%_minmax(0,1fr)] lg:grid-cols-[34%_minmax(0,1fr)_20rem]">
          {/* ZONA KIRI: ARTWORK (sticky di hp) */}
          <div className="relative h-72 max-md:sticky max-md:top-0 md:col-start-1 md:row-span-2 md:row-start-1 md:h-auto lg:row-span-1">
            <div aria-hidden className="absolute inset-y-0 -right-4 left-0 bg-lime-300 lg:-right-8 [clip-path:url(#about-shape-clip)]" />
            <div aria-hidden className="absolute inset-y-0 left-0 right-4 lg:right-6 [clip-path:url(#about-art-clip)]">
              <img src={IMAGES_DATA[0].src} alt="" className="size-full object-cover object-[60%_top]" />
            </div>

            <div className="absolute left-4 top-6 z-10 hidden flex-col items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-900 md:flex">
              <span>01</span>
              <span className="h-10 w-px bg-neutral-900/40" />
              <span style={{ writingMode: "vertical-rl" }}>About</span>
            </div>
          </div>

          {/* ZONA TENGAH: IDENTITAS (lembar membulat di hp) */}
          <div className="relative z-10 flex flex-col p-6 max-md:-mt-8 max-md:rounded-t-3xl max-md:bg-(--bar) sm:p-8 md:col-start-2 md:row-start-1 lg:px-10 lg:py-12">
            <span aria-hidden className="mx-auto mb-5 block h-1 w-10 rounded-full bg-white/25 md:hidden" />

            <div>
              <h1 className="font-display uppercase leading-[0.85] tracking-wide text-white" style={{ fontSize: "clamp(2.75rem, min(12vh, 12vw), 6rem)" }}>
                About <span className="text-lime-300">Me</span>
              </h1>
              <p className="mt-2 flex items-center gap-2 font-display text-xl leading-none text-white">
                <span className="size-2.5 bg-lime-300" />
                01
              </p>
            </div>

            <div className="mt-6">
              <h2 className="font-body text-lg font-extrabold uppercase leading-tight tracking-wide sm:text-xl lg:text-2xl">Mochamad Irfan Hidayat</h2>
              <p className="mt-1 font-body text-xs font-extrabold uppercase tracking-[0.25em] text-lime-300 sm:text-sm">Fullstack Developer</p>
              <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-neutral-300 sm:text-base">
                I am a Multimedia Education graduate and Fullstack Developer interested in building practical digital products across web, mobile, and interactive applications.
              </p>
            </div>

            {/* tanda tangan */}
            <div className="mt-8 flex items-end gap-2 lg:mt-auto lg:pb-8">
              <p className="-rotate-3 origin-left font-body text-xl font-bold italic leading-tight text-neutral-200 sm:text-2xl">
                Keep Learning.
                <br />
                Keep Building.
              </p>
              <span aria-hidden className="mb-1 text-lg text-lime-300">
                ✦
              </span>
              <Cross className="mb-3 text-white" />
            </div>
          </div>

          {/* ZONA KANAN: PANEL PROFIL */}
          <aside className="relative z-10 px-6 pb-8 max-md:bg-(--bar) sm:px-8 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1 lg:p-8 lg:pl-0 lg:pt-12">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 lg:h-full">
              <div className="mb-5 flex items-center justify-between font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                <span>Profile sheet</span>
                <span className="text-lime-300">No. 01</span>
              </div>

              <dl className="flex flex-col gap-5 lg:gap-6">
                {FACTS.map(({ icon: Icon, label, lines, status }) => (
                  <div key={label} className="grid grid-cols-[auto_1fr] gap-4">
                    <Icon className="mt-0.5 size-5 text-lime-300" />
                    <div>
                      <dt className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">{label}</dt>
                      {lines.map((line) => (
                        <dd key={line} className="flex items-center gap-2 font-body text-sm font-semibold leading-snug">
                          {status && <span className="size-2 shrink-0 rounded-full bg-lime-300" />}
                          {line}
                        </dd>
                      ))}
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
