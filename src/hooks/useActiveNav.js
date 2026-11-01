import { useLocation } from "react-router";
import { NAV_ITEMS } from "../data/navItems";

export const useActiveNav = () => {
  const { pathname } = useLocation();
  const index = NAV_ITEMS.findIndex(({ path }) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
  return { index, item: NAV_ITEMS[index], total: NAV_ITEMS.length };
};
