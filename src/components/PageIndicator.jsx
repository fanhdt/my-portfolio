import { useActiveNav } from "../hooks/useActiveNav";
import { NAV_ITEMS } from "../data/navItems";
import { useNavigate } from "react-router";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";

const buttonBase = "flex size-12 items-center justify-center rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] enabled:hover:scale-110 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";

const PageIndicator = () => {
  const navigate = useNavigate();
  const { index, item } = useActiveNav();

  if (index === -1) return null;

  const prev = NAV_ITEMS[index - 1];
  const next = NAV_ITEMS[index + 1];

  return (
    <div className="absolute bottom-0 left-0 z-30 hidden h-80 w-16 flex-col items-center gap-4 rounded-2xl bg-(--bar) p-2 md:flex">
      <button type="button" aria-label="Halaman sebelumnya" disabled={!prev} onClick={() => prev && navigate(prev.path)} className={`${buttonBase} bg-white/20 text-white enabled:hover:bg-white enabled:hover:text-black`}>
        <ArrowUpToLine />
      </button>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
        <div key={item.label} className="max-h-full animate-[title-bounce_0.6s_ease-out_both]">
          <span className="block max-h-full rotate-180 truncate text-xl font-bold uppercase tracking-widest text-lime-200" style={{ writingMode: "vertical-rl" }}>
            {item.label}
          </span>
        </div>
      </div>

      <button type="button" aria-label="Halaman berikutnya" disabled={!next} onClick={() => next && navigate(next.path)} className={`${buttonBase} bg-lime-300 text-black enabled:hover:bg-lime-200`}>
        <ArrowDownToLine />
      </button>
    </div>
  );
};

export default PageIndicator;
