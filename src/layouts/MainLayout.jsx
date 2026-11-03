import Navbar from "../components/Navbar";
import PageIndicator from "../components/PageIndicator";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <main className="relative mx-4 mb-4 min-h-0 flex-1 max-sm:mb-32">
      <div className="absolute inset-0" style={{ viewTransitionName: "page" }}>
        <Navbar />
        <Outlet />
      </div>
      <PageIndicator />
    </main>
  );
};

export default MainLayout;
