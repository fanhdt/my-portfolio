import Navbar from "../components/Navbar";
import PageIndicator from "../components/PageIndicator";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <main className="relative mx-4 mb-4 min-h-0 flex-1 max-sm:mb-32">
        <Outlet />
        <PageIndicator />
      </main>
    </div>
  );
};

export default MainLayout;
