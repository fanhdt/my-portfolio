import { useEffect } from "react";
import gsap from "gsap";

export const useParallax = () => {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const target = { x: 0, y: 0 };
      const pos = { x: 0, y: 0 };

      const onMove = (e) => {
        target.x = e.clientX / window.innerWidth - 0.5;
        target.y = e.clientY / window.innerHeight - 0.5;
      };

      const tick = () => {
        // easing halus menuju posisi kursor
        pos.x += (target.x - pos.x) * 0.08;
        pos.y += (target.y - pos.y) * 0.08;
        document.querySelectorAll("[data-depth]").forEach((el) => {
          const d = parseFloat(el.dataset.depth) || 0;
          gsap.set(el, { x: pos.x * d, y: pos.y * d });
        });
      };

      window.addEventListener("pointermove", onMove);
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
      };
    });

    return () => mm.revert();
  }, []);
};
