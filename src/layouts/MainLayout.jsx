import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import PageIndicator from "../components/PageIndicator";
import { useActiveNav } from "../hooks/useActiveNav";
import { useScrollNav } from "../hooks/useScrollNav";
import { THEMES } from "../lib/pageTheme";

// sama dengan breakpoint `max-sm` Tailwind (< 640px)
const MOBILE_QUERY = "(max-width: 639.98px)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const MainLayout = () => {
  const { item } = useActiveNav();
  const isMobile = useIsMobile();

  // navigasi lewat scroll hanya aktif di desktop
  useScrollNav({ enabled: !isMobile });

  // ganti warna latar sesuai halaman
  useEffect(() => {
    const theme = THEMES[item?.path] ?? THEMES["/"];
    const root = document.documentElement;
    root.style.setProperty("--page", theme.page);
    root.style.setProperty("--accent", theme.accent);
  }, [item]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <main className="relative mx-4 mb-4 min-h-0 flex-1 max-sm:mb-32">
        <div className="absolute inset-0" style={{ viewTransitionName: "page" }}>
          <Outlet />
        </div>
        <PageIndicator />
      </main>
    </div>
  );
};

export default MainLayout;
