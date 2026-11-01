import { NavLink } from "react-router";
import { NAV_ITEMS } from "../data/navItems";
import { useActiveNav } from "../hooks/useActiveNav";

const Navbar = () => {
  const { index, total } = useActiveNav();

  const cx = index === -1 ? "-200px" : `calc(24px + (100% - 48px) * ${(index + 0.5) / total})`;

  return (
    <nav className="flex flex-col gap-4 px-4 pt-6 max-sm:pb-4 sm:flex-row pb-8 ">
      <div className="flex h-20 flex-1 items-center gap-4 rounded-2xl bg-(--bar) px-6 py-2 md:py-0">
        <span className="truncate text-2xl md:text-3xl font-bold italic uppercase tracking-widest text-white">My Portfolio</span>
      </div>

      <div
        className="fixed inset-x-4 bottom-4 z-50 sm:relative sm:inset-auto sm:bottom-auto sm:h-20 sm:w-96 "
        style={{
          "--cx": cx,
          transition: "--cx 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        }}
      >
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-y-0 left-0 bg-(--bar)" style={{ width: "max(0px, calc(var(--cx) - 59px))" }} />
          <div className="absolute inset-y-0 right-0 bg-(--bar)" style={{ left: "calc(var(--cx) + 59px)" }} />

          <div className="absolute inset-y-0 w-30 -translate-x-1/2" style={{ left: "var(--cx)" }}>
            <div className="absolute inset-x-0 bottom-0 top-8.5 bg-(--bar) sm:bottom-8.5 sm:top-0" />
            <svg viewBox="0 0 120 34" className="absolute inset-x-0 top-0 h-8.5 w-30 -scale-y-100 sm:bottom-0 sm:top-auto sm:scale-y-100" style={{ fill: "var(--bar)" }}>
              <path d="M0 0H120V34H102.85A10 10 0 0 1 93.11 26.27A34 34 0 0 0 26.89 26.27A10 10 0 0 1 17.15 34H0Z" />
            </svg>
          </div>
        </div>

        <span aria-hidden className="pointer-events-none absolute top-0 z-10 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--btn) ring-1 ring-white/5 sm:top-full" style={{ left: "var(--cx)", opacity: index === -1 ? 0 : 1 }} />

        <ul className="relative flex h-16 list-none px-6 sm:h-20">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="flex-1">
                <NavLink to={item.path} end={item.path === "/"} className="group relative z-20 flex h-full w-full items-center justify-center">
                  {({ isActive }) => (
                    <>
                      <Icon className={`size-6 transition-all duration-500 ${isActive ? "-translate-y-8 text-lime-300 sm:translate-y-10" : "text-white hover:text-lime-200"}`} />

                      <span
                        className={`pointer-events-none absolute left-1/2 z-30  whitespace-nowrap rounded-md bg-[#111214] px-3 py-1 text-sm font-medium text-white opacity-0
                          bottom-full group-hover:animate-[tooltip-bounce-up_0.5s_ease-out_forwards]
                          sm:bottom-auto sm:top-full sm:mb-0 sm:group-hover:animate-[tooltip-bounce_0.5s_ease-out_forwards]
                          ${isActive ? "mb-9 sm:mt-9" : "mb-1 sm:mt-1"}`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
