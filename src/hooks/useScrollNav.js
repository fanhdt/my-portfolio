import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { setDirection } from "../lib/transition";
import { NAV_ITEMS } from "../data/navItems";

const LOCK_MS = 1100; // sedikit lebih lama dari durasi transisi
const WHEEL_MIN = 30; // abaikan getaran kecil dari touchpad
const SWIPE_MIN = 60; // jarak swipe minimal (px)

// true kalau elemen (atau induknya) masih bisa di-scroll ke arah itu
// dir > 0 = isi bergerak ke bawah (scroll ke bawah), dir < 0 = ke atas
const canScroll = (el, dir) => {
  while (el && el !== document.body) {
    const s = getComputedStyle(el);
    if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((dir > 0 && !atBottom) || (dir < 0 && !atTop)) return true;
    }
    el = el.parentElement;
  }
  return false;
};

// enabled = false -> semua listener (wheel & swipe) tidak dipasang
export const useScrollNav = ({ enabled = true } = {}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const busy = useRef(false);

  useEffect(() => {
    if (!enabled) return; // mobile: scroll-nav dimatikan

    const index = NAV_ITEMS.findIndex((i) => i.path === pathname);
    if (index === -1) return; // halaman detail: tidak pakai scroll-nav

    // dir: +1 = halaman berikutnya (bawah), -1 = sebelumnya (atas)
    const go = (dir, target) => {
      if (busy.current) return;
      if (target && canScroll(target, dir)) return;
      const next = NAV_ITEMS[index + dir];
      if (!next) return;
      busy.current = true;
      setDirection(dir > 0 ? "down" : "up");
      navigate(next.path, { viewTransition: true });
      setTimeout(() => (busy.current = false), LOCK_MS);
    };

    /* ---- roda mouse / touchpad ---- */
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < WHEEL_MIN) return;
      go(e.deltaY > 0 ? 1 : -1, e.target);
    };

    /* ---- swipe di layar sentuh ---- */
    let startY = 0;
    let startTarget = null;
    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startTarget = e.target;
    };
    const onTouchEnd = (e) => {
      const dy = startY - e.changedTouches[0].clientY; // swipe ke atas => positif
      if (Math.abs(dy) < SWIPE_MIN) return;
      go(dy > 0 ? 1 : -1, startTarget);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, navigate, enabled]);
};
