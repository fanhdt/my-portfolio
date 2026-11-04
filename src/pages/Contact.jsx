import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Mail } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { IMAGES } from "../data/imageData";
import { CONTACT } from "../data/contactData";

gsap.registerPlugin(useGSAP);

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const FIELD = "w-full rounded-xl bg-white/5 px-4 py-2.5 font-body text-sm text-white placeholder:text-neutral-500 ring-1 ring-white/15 transition-shadow focus:outline-none focus:ring-2 focus:ring-lime-300 disabled:opacity-60";
const LABEL = "mb-1 flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400";

const KEYS = ["name", "email", "subject", "message"];
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
const MARQUEE = "OPEN TO OPPORTUNITIES ✦ NOW ACCEPTING COMMISSIONS ✦ FULLSTACK DEV ✦ ";

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const LINKS = [
  { key: "github", label: "GitHub", icon: FaGithub, href: (v) => v },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, href: (v) => v },
  { key: "email", label: "Email", icon: Mail, href: (v) => `mailto:${v}` },
].filter((l) => CONTACT[l.key]);

// Teks teracak lalu menyusun diri menjadi teks akhir
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

const Field = ({ id, index, label, children }) => (
  <div className="c-field zz-field">
    <label htmlFor={id} className={LABEL}>
      <i aria-hidden className="zz-dot block size-1.5 rotate-45 bg-neutral-500" />
      {index} // {label}
    </label>
    {children}
  </div>
);

const Contact = () => {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [filled, setFilled] = useState(0);
  const [reduce] = useState(prefersReducedMotion);

  const sending = status === "sending";

  const handleChange = () => {
    const d = new FormData(formRef.current);
    setFilled(KEYS.filter((k) => String(d.get(k) || "").trim()).length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setErrorMsg("EmailJS belum dikonfigurasi. Isi VITE_EMAILJS_* di file .env.");
      setStatus("error");
      return;
    }

    const data = new FormData(formRef.current);

    // Honeypot anti-spam
    if (data.get("website")) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          // Harus sama dengan variable di EmailJS Template
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        },
        { publicKey: PUBLIC_KEY },
      );

      formRef.current.reset();
      setFilled(0);
      setStatus("success");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setErrorMsg("Failed to send your message. Please try again later.");
      setStatus("error");
    }
  };

  /* ---- animasi masuk berurutan + scramble teks ---- */
  useGSAP(
    () => {
      if (reduce) return;

      const scr = gsap.utils.toArray(".c-scr");
      scr.forEach((el) => (el.style.visibility = "hidden"));

      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power3.out" } });
      tl.from(".c-slash", { xPercent: 110, duration: 0.9, ease: "power4.out" })
        .from(".c-img", { scale: 1.25, opacity: 0, duration: 1.1 }, "<0.15")
        .from(".c-band", { xPercent: -120, duration: 0.8, ease: "power4.out" }, "<0.2")
        .from(".c-hud", { opacity: 0, y: -10, duration: 0.5 }, "<0.3")
        .from(".c-field", { clipPath: "inset(0 100% 0 0)", x: -24, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.7)
        .from(".c-act", { y: 14, opacity: 0, duration: 0.45, stagger: 0.07 }, "-=0.3");

      scr.forEach((el, i) => scramble(el, el.dataset.text, 0.9).delay(0.45 + i * 0.14));

      // scramble saat hover
      const cleanups = gsap.utils.toArray("[data-scramble]").map((el) => {
        const on = () => scramble(el, el.dataset.scramble, 0.45);
        el.parentElement.addEventListener("mouseenter", on);
        return () => el.parentElement.removeEventListener("mouseenter", on);
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef },
  );

  /* ---- parallax gambar mengikuti kursor (desktop) ---- */
  useGSAP(
    () => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (reduce || !fine) return;

      const root = rootRef.current;
      const ix = gsap.quickTo(".c-img", "x", { duration: 0.9, ease: "power3.out" });
      const iy = gsap.quickTo(".c-img", "y", { duration: 0.9, ease: "power3.out" });
      const bx = gsap.quickTo(".c-band", "x", { duration: 1.2, ease: "power3.out" });

      const onMove = (e) => {
        const r = root.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        ix(nx * -28);
        iy(ny * -18);
        bx(nx * 24);
      };
      root.addEventListener("pointermove", onMove);
      return () => root.removeEventListener("pointermove", onMove);
    },
    { scope: rootRef },
  );

  const img = IMAGES.background;

  return (
    <section ref={rootRef} className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* Dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mask-[linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />

      {/* VISUAL KANAN (desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden lg:block">
        <div className="c-slash absolute inset-0 bg-lime-300 [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]" />

        <div className="absolute inset-y-0 right-0 w-[92%] [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
          <div className="c-img absolute inset-0">
            <img src={img} alt="" className="size-full scale-110 object-cover object-[70%_top]" />
            <img src={img} alt="" className="zz-slice-a absolute inset-0 size-full scale-110 object-cover object-[70%_top]" />
            <img src={img} alt="" className="zz-slice-b absolute inset-0 size-full scale-110 object-cover object-[70%_top]" />
          </div>
          <div className="zz-scanlines absolute inset-0" />
          <div className="zz-sweepline absolute inset-0 overflow-hidden" />

          {/* pita marquee miring: di dalam wadah ber-clip, jadi ujung kirinya menyelip di balik garis hijau */}
          <div className="c-band absolute -left-16 -right-10 bottom-14 -rotate-6 overflow-hidden bg-lime-300 py-2 text-neutral-900">
            <div className="zz-marquee font-display text-xl uppercase tracking-wider">
              {[0, 1].map((n) => (
                <span key={n} className="shrink-0 whitespace-pre pr-0">
                  {MARQUEE.repeat(3)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* HUD kecil */}
        <div className="c-hud absolute right-8 top-8 flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
          <span className="size-2 animate-pulse rounded-full bg-lime-300" />
          Link standby
          <span className="h-px w-16 bg-white/40" />
        </div>
        <div className="absolute left-[18%] top-10 size-2.5 bg-sky-200" />
        <div className="absolute bottom-6 left-[8%] size-2.5 rotate-45 bg-pink-400" />
      </div>

      <PageNotch />

      {/* Overlay sukses */}
      {status === "success" && (
        <div role="status" className="zz-wipe absolute inset-0 z-15 flex flex-col items-center justify-center gap-4 bg-lime-300 p-8 text-center text-neutral-900">
          <p className="font-body text-xs font-extrabold uppercase tracking-[0.4em]">Signal locked</p>
          <h2 className="zz-rgb font-display uppercase leading-[0.9] tracking-wide" style={{ fontSize: "clamp(2.25rem, 9vw, 6rem)" }}>
            Transmission
            <br />
            received
          </h2>
          <p className="max-w-sm font-body text-sm font-semibold">Pesanmu sudah masuk. Aku akan membalas secepatnya.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 rounded-full bg-neutral-900 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-lime-300 transition-colors hover:bg-white hover:text-neutral-900"
          >
            Send another
          </button>
        </div>
      )}

      {/* Desktop: satu layar. HP/tablet: scroll di dalam kartu */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none lg:overflow-y-hidden">
        <div className="relative z-10 flex min-h-full flex-col gap-4 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-3 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8">
          <div className="lg:max-w-[52%]">
            {/* HEADER */}
            <div className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
              <span className="size-2.5 bg-lime-300" />
              <span className="c-scr zz-caret" data-text="Incoming transmission">
                Incoming transmission
              </span>
            </div>

            <h1 className="zz-rgb mt-2 font-display uppercase leading-[0.9] tracking-wide" style={{ fontSize: "clamp(1.75rem, min(6.5vh, 8vw), 3.5rem)" }} aria-label="Ready to build something?">
              <span aria-hidden className="c-scr block" data-text="Ready to build">
                Ready to build
              </span>
              <span aria-hidden className="c-scr block text-lime-300" data-text="something?">
                something?
              </span>
            </h1>

            {/* STATUS */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-body">
              <span className="text-xs font-extrabold uppercase tracking-wider">Mochamad Irfan Hidayat</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">Fullstack Developer</span>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300">
                <span className="size-2 animate-pulse rounded-full bg-lime-300" />
                Open to opportunities
              </span>
            </div>

            {/* FORM */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onAnimationEnd={(e) => e.currentTarget.classList.remove("zz-shake")}
              key={status === "error" ? "err" : "form"}
              className={`mt-4 flex flex-col gap-3 lg:mt-3 lg:gap-2.5 ${status === "error" ? "zz-shake" : ""}`}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:gap-2.5">
                <Field id="name" index="01" label="Name">
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" disabled={sending} className={FIELD} />
                </Field>
                <Field id="email" index="02" label="Email">
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="your@email.com" disabled={sending} className={FIELD} />
                </Field>
              </div>

              <Field id="subject" index="03" label="Subject">
                <input id="subject" name="subject" type="text" required placeholder="What would you like to talk about?" disabled={sending} className={FIELD} />
              </Field>

              <Field id="message" index="04" label="Message">
                <textarea id="message" name="message" required rows={3} placeholder="Tell me about your project..." disabled={sending} className={`${FIELD} resize-none`} />
              </Field>

              {/* Honeypot anti-spam */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              {/* SUBMIT */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <span className="zz-border c-act inline-flex rounded-full p-0.5" data-sending={sending || undefined}>
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center gap-3 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sending ? "Transmitting..." : "Send message"}
                    {!sending && (
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </span>

                {/* meter sinyal: terisi sesuai kolom yang sudah diisi */}
                <div aria-hidden className="c-act flex items-center gap-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">Signal</span>
                  <span className="flex gap-1">
                    {KEYS.map((k, i) => (
                      <span key={k} className={`h-3 w-4 -skew-x-12 transition-colors duration-300 ${i < filled ? "bg-lime-300" : "bg-white/15"}`} />
                    ))}
                  </span>
                  <span className="w-9 font-body text-[10px] font-bold text-lime-300">{filled * 25}%</span>
                </div>

                <p role="status" aria-live="polite" className="font-body text-xs">
                  {status === "success" && <span className="sr-only">Message sent successfully.</span>}
                  {status === "error" && (
                    <span role="alert" className="text-pink-400">
                      {errorMsg}
                    </span>
                  )}
                </p>
              </div>
            </form>

            {/* LINK LANGSUNG */}
            {LINKS.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 lg:mt-3">
                {LINKS.map(({ key, label, icon: Icon, href }) => (
                  <li key={key} className="c-act">
                    <a
                      href={href(CONTACT[key])}
                      target={key === "email" ? undefined : "_blank"}
                      rel={key === "email" ? undefined : "noopener noreferrer"}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest ring-1 ring-white/25 transition-colors hover:bg-lime-300 hover:text-neutral-900"
                    >
                      <Icon className="size-3.5" />
                      <span data-scramble={label}>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* GAMBAR HP/TABLET */}
          <div className="relative mt-2 h-48 shrink-0 overflow-hidden rounded-2xl sm:h-64 lg:hidden">
            <div aria-hidden className="absolute inset-0 bg-lime-300" />
            <img src={img} alt="" className="absolute inset-y-0 right-0 h-full w-[88%] object-cover object-[70%_top] [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]" />
            <div aria-hidden className="zz-scanlines absolute inset-0" />
            <div aria-hidden className="absolute inset-x-0 bottom-3 -rotate-3 overflow-hidden bg-lime-300 py-1.5 text-neutral-900">
              <div className="zz-marquee font-display text-base uppercase tracking-wider">
                {[0, 1].map((n) => (
                  <span key={n} className="shrink-0 whitespace-pre">
                    {MARQUEE.repeat(3)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
