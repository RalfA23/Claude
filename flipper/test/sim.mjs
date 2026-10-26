// Hilfen für die Tests: Zufall mit Startwert und ein einfacher Autopilot, der die Flipper bedient.
import { createRequire } from "node:module";
export const F = createRequire(import.meta.url)("../src/tables.js");
export function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
export function autopilot(g, t, rnd) {
  // Drücken, sobald eine Kugel über dem Flipper ist, nach 0,2 s wieder loslassen und kurz warten (sonst hält er die Kugel ewig fest).
  const near = (side) => g.balls.some((b) => !b.ramp && b.y > 850 && b.y < 990 && (side === "L" ? b.x < 280 && b.x > 110 : b.x >= 280 && b.x < 450));
  for (const s of ["L", "R"]) {
    const k = "_c" + s; g[k] = (g[k] || 0) - 1 / 60;
    if (g[k] <= -0.25 && near(s) && rnd() < 0.5) g[k] = 0.2;
    g.input[s === "L" ? "left" : "right"] = g[k] > 0;
  }
  if (g.waiting()) { g._pt = (g._pt || 0) + 1 / 60; g.input.plunger = g._pt < 0.45 + rnd() * 0.6; if (!g.input.plunger) g._pt = 0; }
  else { g.input.plunger = false; g._pt = 0; }
}
