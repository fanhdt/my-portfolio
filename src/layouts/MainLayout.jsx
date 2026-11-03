import { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import PageIndicator from "../components/PageIndicator";
import { useActiveNav } from "../hooks/useActiveNav";
import { useScrollNav } from "../hooks/useScrollNav";
import { THEMES } from "../lib/pageTheme";

const MainLayout = () => {
  const { item } = useActiveNav();
  useScrollNav();

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
