const IND_W = "4rem";
const IND_H = "20rem";
const GAP = "0.75rem";
const R = "1.5rem";

const FILLET = {
  width: R,
  height: R,
  background: `radial-gradient(circle at 100% 0, transparent ${R}, var(--page) calc(${R} + 0.5px))`,
};

const PageNotch = () => (
  <>
    <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-20 hidden rounded-tr-[1.75rem] bg-(--page) md:block" style={{ width: `calc(${IND_W} + ${GAP})`, height: `calc(${IND_H} + ${GAP})` }} />
    <div aria-hidden className="pointer-events-none absolute left-0 z-20 hidden md:block" style={{ ...FILLET, bottom: `calc(${IND_H} + ${GAP})` }} />
    <div aria-hidden className="pointer-events-none absolute bottom-0 z-20 hidden md:block" style={{ ...FILLET, left: `calc(${IND_W} + ${GAP})` }} />
  </>
);

export default PageNotch;
