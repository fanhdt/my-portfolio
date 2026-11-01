import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Mail } from "lucide-react";
import PageNotch from "../components/PageNotch";
import { IMAGES_DATA } from "../data/imageData";
import { CONTACT } from "../data/contactData";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const DOTS = {
  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const FIELD = "w-full rounded-xl bg-white/5 px-4 py-2.5 font-body text-sm text-white placeholder:text-neutral-500 ring-1 ring-white/15 transition-shadow focus:outline-none focus:ring-2 focus:ring-lime-300 disabled:opacity-60";

const LABEL = "mb-1 block font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400";

const LINKS = [
  { key: "github", label: "GitHub", icon: FaGithub, href: (v) => v },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, href: (v) => v },
  { key: "email", label: "Email", icon: Mail, href: (v) => `mailto:${v}` },
].filter((l) => CONTACT[l.key]);

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setErrorMsg("EmailJS belum dikonfigurasi. Isi VITE_EMAILJS_* di file .env.");
      setStatus("error");
      return;
    }

    const data = new FormData(formRef.current);

    // honeypot anti-spam: bot biasanya mengisi field tersembunyi ini
    if (data.get("website")) return;

    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: data.get("name"),
          from_email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        },
        { publicKey: PUBLIC_KEY },
      );
      formRef.current.reset();
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <section className="relative h-full overflow-hidden rounded-2xl bg-(--bar) text-white">
      {/* dekorasi latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" style={DOTS} />

      {/* VISUAL KANAN (desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <div className="absolute inset-0 bg-lime-300 [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[92%] [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
          <img src={IMAGES_DATA[0].src} alt="" className="size-full object-cover object-[70%_top]" />
        </div>
        <div className="absolute left-[18%] top-10 size-2.5 bg-sky-200" />
        <div className="absolute bottom-16 left-[8%] size-2.5 rotate-45 bg-pink-400" />
        <div className="absolute right-8 top-8 h-px w-24 bg-white/40" />
      </div>

      <PageNotch />

      {/* Desktop: satu layar. Hp/tablet: scroll di dalam kartu */}
      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] lg:overflow-y-hidden">
        <div className="relative z-10 flex min-h-full flex-col gap-4 p-6 sm:p-8 md:pl-28 lg:h-full lg:min-h-0 lg:gap-3 lg:pb-6 lg:pl-28 lg:pr-12 lg:pt-8">
          <div className="lg:max-w-[52%]">
            {/* HEADER */}
            <div className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs">
              <span className="size-2.5 bg-lime-300" />
              Contact
              <span className="h-px w-12 bg-white/30" />
            </div>
            <h1 className="mt-2 font-display uppercase leading-[0.9] tracking-wide" style={{ fontSize: "clamp(1.75rem, min(6.5vh, 8vw), 3.5rem)" }}>
              Ready to build
              <br />
              <span className="text-lime-300">something?</span>
            </h1>
            <p className="mt-2 font-body text-sm text-neutral-300 sm:text-base">Let&apos;s create something meaningful together.</p>

            {/* STATUS */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-body">
              <span className="text-xs font-extrabold uppercase tracking-wider">Mochamad Irfan Hidayat</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">Fullstack Developer</span>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300">
                <span className="size-2 rounded-full bg-lime-300" />
                Open to opportunities
              </span>
            </div>

            {/* FORM */}
            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 lg:mt-3 lg:gap-2.5">
              <div className="grid gap-3 sm:grid-cols-2 lg:gap-2.5">
                <div>
                  <label htmlFor="name" className={LABEL}>
                    Name
                  </label>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" disabled={sending} className={FIELD} />
                </div>
                <div>
                  <label htmlFor="email" className={LABEL}>
                    Email
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="your@email.com" disabled={sending} className={FIELD} />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={LABEL}>
                  Subject
                </label>
                <input id="subject" name="subject" type="text" required placeholder="What would you like to talk about?" disabled={sending} className={FIELD} />
              </div>

              <div>
                <label htmlFor="message" className={LABEL}>
                  Message
                </label>
                <textarea id="message" name="message" required rows={3} placeholder="Tell me about your project..." disabled={sending} className={`${FIELD} resize-none`} />
              </div>

              {/* honeypot (tersembunyi dari pengguna) */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={sending}
                  className="group inline-flex items-center gap-3 rounded-full bg-lime-300 px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending ? "Sending..." : "Send message"}
                  {!sending && (
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                <p role="status" aria-live="polite" className="font-body text-xs">
                  {status === "success" && <span className="text-lime-300">Message sent successfully.</span>}
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
                  <li key={key}>
                    <a
                      href={href(CONTACT[key])}
                      target={key === "email" ? undefined : "_blank"}
                      rel={key === "email" ? undefined : "noopener noreferrer"}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest ring-1 ring-white/25 transition-colors hover:bg-white/10"
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* GAMBAR (hp/tablet, di bawah form) */}
          <div className="relative mt-2 h-48 shrink-0 overflow-hidden rounded-2xl sm:h-64 lg:hidden">
            <div aria-hidden className="absolute inset-0 bg-lime-300" />
            <img src={IMAGES_DATA[0].src} alt="" className="absolute inset-y-0 right-0 h-full w-[88%] object-cover object-[70%_top] [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
