// Menentukan arah animasi sebelum navigasi terjadi
export const setDirection = (dir) => {
  document.documentElement.dataset.nav = dir; // "up" | "down" | "left" | "right"
};
