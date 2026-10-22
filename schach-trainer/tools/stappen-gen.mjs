// Generates the exercises of the Stappen course (src/data/stappen.json): random, sparse positions in the style of a workbook
// diagram, or positions from games Stockfish plays against itself at club strength (see mine()). Each one is checked with a
// local Stockfish so that the solution is the only good move and fits the lesson topic.
// All positions are made here, none are taken from books. Run: node tools/stappen-gen.mjs [lesson-id ...]
// Needs a Stockfish binary (STOCKFISH=/path, default /usr/games/stockfish). Takes a few minutes.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startEngine } from "./engine.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const Chess = new Function("window", readFileSync(join(root, "src/data/chess.js"), "utf8") + ";return window.Chess")({});
const OUT = join(root, "src/data/stappen.json");
const PER_LESSON = +process.env.PER_LESSON || 12;

// ---------- Random numbers (seeded, so a run can be repeated) ----------
let seed = +process.env.SEED || 20261021;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const pick = (a) => a[Math.floor(rnd() * a.length)];

// ---------- Board helpers ----------
const FILES = "abcdefgh";
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const sq = (f, r) => FILES[f] + (r + 1);
const fr = (s) => [FILES.indexOf(s[0]), +s[1] - 1];
const on = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8;
function boardMap(g) { const m = {}; for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) { const p = g.get(sq(f, r)); if (p) m[sq(f, r)] = p; } return m; }
const DIRS = { b: [[1, 1], [1, -1], [-1, 1], [-1, -1]], r: [[1, 0], [-1, 0], [0, 1], [0, -1]] };
DIRS.q = DIRS.b.concat(DIRS.r);
// Squares attacked by the piece standing on s.
function attacks(m, s) {
  const p = m[s]; if (!p) return [];
  const [f, r] = fr(s), out = [];
  if (p.type === "p") { const d = p.color === "w" ? 1 : -1; for (const df of [-1, 1]) if (on(f + df, r + d)) out.push(sq(f + df, r + d)); return out; }
  if (p.type === "n" || p.type === "k") {
    const st = p.type === "n" ? [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] : DIRS.q;
    for (const [a, b] of st) if (on(f + a, r + b)) out.push(sq(f + a, r + b));
    return out;
  }
  for (const [a, b] of DIRS[p.type]) { let x = f + a, y = r + b; while (on(x, y)) { out.push(sq(x, y)); if (m[sq(x, y)]) break; x += a; y += b; } }
  return out;
}
const attackers = (m, s, color) => Object.keys(m).filter((t) => m[t].color === color && attacks(m, t).includes(s));
const material = (m, color) => Object.values(m).filter((p) => p.color === color && p.type !== "k").reduce((a, p) => a + VAL[p.type], 0);
const balance = (g, color) => { const m = boardMap(g); return material(m, color) - material(m, color === "w" ? "b" : "w"); };
// Pieces on the ray from s in direction (a,b): [{sq, p}, ...] (all pieces behind each other)
function ray(m, s, a, b) { const [f, r] = fr(s); const out = []; let x = f + a, y = r + b; while (on(x, y)) { const t = sq(x, y); if (m[t]) out.push({ sq: t, p: m[t] }); x += a; y += b; } return out; }
const uci = (mv) => mv.from + mv.to + (mv.promotion || "");
const load = (fen) => { const g = new Chess(); if (!g.load(fen)) return null; return g; };
function play(fen, moves) { const g = load(fen); for (const u of moves) if (!g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || "q" })) return null; return g; }
const other = (c) => (c === "w" ? "b" : "w");

// ---------- Random positions ----------
// spec: {w:"KQRPP", b:"KRPP"}; options: shelter (kings on their back rank behind pawns), pawnsNear
function randomFen(spec, opt = {}) {
  for (let tries = 0; tries < 200; tries++) {
    const used = new Set(), place = [];
    const free = (s) => !used.has(s);
    const put = (c, t, s) => { used.add(s); place.push([c, t, s]); };
    let ok = true;
    const planted = opt.plant ? opt.plant() : [];
    if (!planted || planted.some((x) => !x[2] || used.has(x[2]) || !(used.add(x[2]), true))) continue;
    used.clear();
    for (const [c, t, s] of planted) { if (t === "p" && /[18]/.test(s[1])) ok = false; put(c, t, s); }
    if (!ok) continue;
    for (const c of ["w", "b"]) {
      const pieces = spec[c].toLowerCase().split("");
      for (const [pc, pt] of planted) if (pc === c) { const i = pieces.indexOf(pt); if (i >= 0) pieces.splice(i, 1); }
      pieces.sort((x, y) => (x === "k" ? -1 : y === "k" ? 1 : 0));
      for (const t of pieces) {
        let s, n = 0;
        do {
          n++;
          let f = Math.floor(rnd() * 8), r = Math.floor(rnd() * 8);
          if (t === "k" && opt.shelter) r = c === "w" ? 0 : 7;
          if (t === "p") { r = 1 + Math.floor(rnd() * 6); if (opt.shelter && rnd() < 0.6) { const k = place.find((x) => x[0] === c && x[1] === "k"); if (k) { const [kf] = fr(k[2]); f = Math.max(0, Math.min(7, kf + Math.floor(rnd() * 3) - 1)); r = c === "w" ? 1 : 6; } } }
          if (opt.pawnRanks && t === "p") r = c === "w" ? opt.pawnRanks[0] + Math.floor(rnd() * (opt.pawnRanks[1] - opt.pawnRanks[0] + 1)) : 7 - (opt.pawnRanks[0] + Math.floor(rnd() * (opt.pawnRanks[1] - opt.pawnRanks[0] + 1)));
          s = sq(f, r);
        } while (!free(s) && n < 50);
        if (!free(s)) { ok = false; break; }
        put(c, t, s);
      }
    }
    if (!ok) continue;
    const g = new Chess(); g.clear();
    for (const [c, t, s] of place) g.put({ type: t, color: c }, s);
    const ks = place.filter((x) => x[1] === "k").map((x) => fr(x[2]));
    if (Math.abs(ks[0][0] - ks[1][0]) <= 1 && Math.abs(ks[0][1] - ks[1][1]) <= 1) continue;
    const fen = g.fen().split(" ")[0];
    const stm = opt.stm || "w";
    const f2 = load(fen + " " + other(stm) + " - - 0 1");
    if (!f2 || f2.in_check()) continue; // side not to move must not be in check
    const g2 = load(fen + " " + stm + " - - 0 1");
    if (!g2 || g2.game_over()) continue;
    if (!!opt.inCheck !== g2.in_check()) continue;
    return g2.fen();
  }
  return null;
}
// No piece of either side hangs before the key move (so the win comes from the topic, not from a loose piece).
function quiet(fen) {
  const g = load(fen), m = boardMap(g);
  return Object.keys(m).every((s) => {
    const p = m[s]; if (p.type === "k" || p.type === "p") return true;
    const att = attackers(m, s, other(p.color)); if (!att.length) return true;
    if (att.some((a) => VAL[m[a].type] < VAL[p.type])) return false;
    return attackers(m, s, p.color).length > 0;
  });
}
// Planting helpers: a square in a direction, or null when off the board.
const step = (s, a, b, k = 1) => { if (!s) return null; const [f, r] = fr(s); return on(f + a * k, r + b * k) ? sq(f + a * k, r + b * k) : null; };
const rsq = () => sq(Math.floor(rnd() * 8), Math.floor(rnd() * 8));
const KN = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// A slider of type t standing on 'from' that reaches 'to' (free line checked later by the topic test).
function sliderFrom(t, to, avoid) { for (const [a, b] of shuffle(DIRS[t])) { const k = 2 + Math.floor(rnd() * 3); const s = step(to, a, b, k); if (s && !avoid.includes(s)) return s; } return null; }
const plants = {
  knightFork: (targets) => () => { const t = rsq(); const js = shuffle(KN).map(([a, b]) => step(t, a, b)).filter(Boolean); if (js.length < 3) return null; return [["w", "n", js[0]], ["b", targets[0], js[1]], ["b", pick(targets.slice(1)), js[2]]]; },
  pawnFork: (targets) => () => { const f = 1 + Math.floor(rnd() * 6), r = 1 + Math.floor(rnd() * 4); const tt = shuffle(targets); return [["w", "p", sq(f, r)], ["b", tt[0], sq(f - 1, r + 2)], ["b", tt[1], sq(f + 1, r + 2)]]; },
  doubleAttack: (mover, targets) => () => { const t = rsq(); const ds = shuffle(DIRS[mover]); const out = []; const used = [t];
    for (const [a, b] of ds.slice(0, 2)) { const s = step(t, a, b, 1 + Math.floor(rnd() * 3)); if (!s) return null; out.push(["b", out.length ? pick(targets.slice(1)) : targets[0], s]); used.push(s); }
    const s = sliderFrom(mover, t, used); if (!s) return null; return [["w", mover, s], ...out]; },
  line: (mover, front, back) => () => { const t = rsq(); const [a, b] = pick(DIRS[mover]); const A = step(t, a, b, 1 + Math.floor(rnd() * 2)); const B = step(A, a, b, 1 + Math.floor(rnd() * 2)); if (!A || !B) return null;
    const s = sliderFrom(mover, t, [A, B]); if (!s) return null; return [["w", mover, s], ["b", pick(front), A], ["b", pick(back), B]]; },
  discovery: () => () => { const s = rsq(); const sl = pick(["r", "b"]); const [a, b] = pick(DIRS[sl]); const X = step(s, a, b, 1 + Math.floor(rnd() * 2)); const T = step(X, a, b, 1 + Math.floor(rnd() * 3)); if (!X || !T) return null;
    return [["w", sl, s], ["w", pick(sl === "b" ? ["n", "n", "p"] : ["n", "b", "p"]), X], ["b", pick(["r", "k"]), T]]; },
};

// Mirror colours (so that half the exercises have Black to move).
function mirror(fen) {
  const [b, t] = fen.split(" ");
  const rows = b.split("/").reverse().map((r) => r.replace(/[a-zA-Z]/g, (ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase())));
  return rows.join("/") + " " + other(t) + " - - 0 1";
}

// ---------- Engine pool ----------
const POOL = Math.max(1, +process.env.ENGINES || 4);
const engines = Array.from({ length: POOL }, () => startEngine());
await Promise.all(engines.map((e) => e.ready));
let rr = 0;
const eng = () => engines[rr++ % POOL];
const WIN = 250;
const ST = {}; const st = (k) => { ST[k] = (ST[k] || 0) + 1; return null; }; // centipawns that count as "clearly winning"

// Checks that a line of user moves (even plies) is forced: each user move is clearly better than every other one.
// Returns the alternatives accepted on the last user ply (moves that are about as good), or null when the line is not forced.
async function forced(e, fen, line, { mateLast = false, gap = 150, depth = 14 } = {}) {
  let alts = [];
  for (let i = 0; i < line.length; i += 2) {
    const g = play(fen, line.slice(0, i));
    if (!g) return null;
    const res = await e.analyse(g.fen(), { depth, multipv: 4 });
    if (!res.length || res[0].move !== line[i]) {
      // A different but equally good move at the last ply is fine (accepted as alternative).
      if (!(i === line.length - 1 && res.length && res.find((x) => x.move === line[i]) && res.find((x) => x.move === line[i]).score >= res[0].score - 30)) return null;
    }
    const best = res.find((x) => x.move === line[i]);
    const last = i >= line.length - 1;
    if (last) {
      if (mateLast) alts = []; // any mate is accepted in the app
      else alts = res.filter((x) => x.move !== line[i] && x.score >= best.score - 60 && x.score >= WIN).map((x) => x.move);
    } else if (res[1] && res[1].score > best.score - gap) return null;
    if (last && !mateLast && res[1] && res[1].score > best.score - gap && alts.length > 2) return null;
  }
  return alts;
}
// Cut the engine line after the user move that wins the material (and the reply cannot take it back).
function cutLine(fen, pv, minGain, maxPly = 5) {
  const g = load(fen), me = g.turn(), b0 = balance(g, me);
  for (let i = 0; i < Math.min(pv.length, maxPly); i++) {
    const mv = g.move({ from: pv[i].slice(0, 2), to: pv[i].slice(2, 4), promotion: pv[i][4] || "q" });
    if (!mv) return null;
    if (i % 2 === 0) {
      if (g.in_checkmate()) return pv.slice(0, i + 1);
      const gain = balance(g, me) - b0;
      if (gain >= minGain) {
        const nx = pv[i + 1];
        if (!nx) return pv.slice(0, i + 1);
        const g2 = load(g.fen()); g2.move({ from: nx.slice(0, 2), to: nx.slice(2, 4), promotion: nx[4] || "q" });
        if (balance(g2, me) - b0 >= minGain) return pv.slice(0, i + 1);
      }
    }
  }
  return null;
}

// ---------- Topic checks on the key move ----------
function afterMove(fen, u) { const g = play(fen, [u]); return g ? { g, m: boardMap(g) } : null; }
// The piece on s cannot simply be taken: no attacker, or it is defended and every attacker is worth at least as much.
function safeSquare(m, s) { const p = m[s], att = attackers(m, s, other(p.color)); return !att.length || (attackers(m, s, p.color).length > 0 && att.every((x) => VAL[m[x].type] >= VAL[p.type])); }
function forkTargets(fen, u) {
  const a = afterMove(fen, u); if (!a) return [];
  const to = u.slice(2, 4), me = a.m[to].color, mover = VAL[a.m[to].type];
  if (!safeSquare(a.m, to)) return [];
  return attacks(a.m, to).filter((t) => a.m[t] && a.m[t].color !== me && a.m[t].type !== "p" && (a.m[t].type === "k" || VAL[a.m[t].type] > mover || attackers(a.m, t, other(me)).length === 0));
}
function pinOrSkewer(fen, u, kind) {
  const a = afterMove(fen, u); if (!a) return false;
  const to = u.slice(2, 4), p = a.m[to]; if (!"qrb".includes(p.type)) return false;
  if (!safeSquare(a.m, to)) return false;
  for (const [x, y] of DIRS[p.type]) {
    const r = ray(a.m, to, x, y);
    if (r.length < 2 || r[0].p.color === p.color || r[1].p.color === p.color) continue;
    const A = r[0].p, B = r[1].p;
    if (kind === "pin" && A.type !== "k" && A.type !== "p" && (B.type === "k" || VAL[B.type] > VAL[A.type])) return true;
    if (kind === "skewer" && B.type !== "p" && B.type !== "k" && (A.type === "k" || VAL[A.type] > VAL[B.type])) return true;
  }
  return false;
}
function discovered(fen, u) {
  const g0 = load(fen), m0 = boardMap(g0), me = g0.turn(), from = u.slice(0, 2);
  const a = afterMove(fen, u); if (!a) return false;
  for (const s of Object.keys(m0)) {
    if (s === from || m0[s].color !== me || !"qrb".includes(m0[s].type)) continue;
    const before = attacks(m0, s), after = attacks(a.m, s);
    if (after.some((t) => !before.includes(t) && a.m[t] && a.m[t].color !== me && (a.m[t].type === "k" || VAL[a.m[t].type] >= 3))) return true;
  }
  return false;
}
const isMate = (fen, line) => { const g = play(fen, line); return g && g.in_checkmate(); };
function mates1(fen) { const g = load(fen); if (!g) return []; return g.moves({ verbose: true }).filter((mv) => { g.move(mv); const r = g.in_checkmate(); g.undo(); return r; }); }
const kingDist = (a, b) => { const [x1, y1] = fr(a), [x2, y2] = fr(b); return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); };
const find = (g, c, t) => Object.entries(boardMap(g)).filter(([, p]) => p.color === c && p.type === t).map(([s]) => s);

// ---------- Generic exercise makers ----------
// Material tactic: unique key move with the topic, wins at least minGain after a short forced line.
function tactic(spec, opt, topic, { minGain = 2, eq = 1, loose = false } = {}) {
  return async (e) => {
    const fen = randomFen(spec, opt); if (!fen) return st("fen");
    const g = load(fen); if (Math.abs(balance(g, g.turn())) > eq) return st("eq");
    if (!loose && !quiet(fen)) return st("loose");
    const cands = g.moves({ verbose: true }).map(uci).filter((u) => topic(fen, u));
    if (!cands.length) return st("nocand");
    const res = await e.analyse(fen, { depth: 10, multipv: 2 });
    if (!res[0] || !cands.includes(res[0].move)) return st("notbest");
    if (res[0].score < WIN) return st("weak");
    if (res[1] && res[1].score > res[0].score - 200) return st("notunique");
    const deep = await e.analyse(fen, { depth: 16, multipv: 2 });
    if (deep[0].move !== res[0].move || deep[0].score < WIN || (deep[1] && deep[1].score > deep[0].score - 200)) return st("deep");
    if (deep[0].mate) return st("mate"); // mates belong to the mate lessons
    const line = cutLine(fen, deep[0].pv, minGain); if (!line) return st("cut");
    const alts = await forced(e, fen, line); if (alts === null) return st("forced");
    return { f: fen, l: line, a: alts.length ? alts : undefined };
  };
}
// Mate in n: unique first move (other first moves do not mate as fast), any mate accepted on the last move.
function mateIn(n, spec, opt, extra) {
  return async (e) => {
    const fen = randomFen(spec, opt); if (!fen) return null;
    if (n === 1) {
      const ms = mates1(fen); if (ms.length !== 1) return null;
      const line = [uci(ms[0])];
      if (extra && !extra(fen, line)) return null;
      return { f: fen, l: line, m: 1 };
    }
    if (mates1(fen).length) return null;
    const res = await e.analyse(fen, { depth: 12, multipv: 2 });
    if (!res[0] || res[0].mate !== n || (res[1] && res[1].mate && res[1].mate > 0 && res[1].mate <= n)) return null;
    const deep = await e.analyse(fen, { depth: 18, multipv: 2 });
    if (deep[0].mate !== n || (deep[1] && deep[1].mate && deep[1].mate > 0 && deep[1].mate <= n)) return null;
    const line = deep[0].pv.slice(0, 2 * n - 1);
    if (!isMate(fen, line)) return null;
    if (extra && !extra(fen, line)) return null;
    // Intermediate user moves must be the only way to keep the mate.
    for (let i = 2; i < line.length - 1; i += 2) {
      const g = play(fen, line.slice(0, i)); const r = await e.analyse(g.fen(), { depth: 14, multipv: 2 });
      if (r[0].move !== line[i] || (r[1] && r[1].mate && r[1].mate > 0 && r[1].mate <= n - i / 2)) return null;
    }
    return { f: fen, l: line, m: 1 };
  };
}
// Several moves are fine, most moves lose: the accepted moves are all those about as good as the best one.
function safeMoves(spec, opt, pre, { maxOk = 3, badShare = 0.5, range = [-150, 250] } = {}) {
  return async (e) => {
    const fen = randomFen(spec, opt); if (!fen) return null;
    if (pre && !pre(fen)) return null;
    return safeCheck(e, fen, { maxOk, badShare, range });
  };
}
async function safeCheck(e, fen, { maxOk = 3, badShare = 0.5, range = [-150, 250] } = {}) {
  {
    const g = load(fen), n = g.moves().length; if (n < 4) return null;
    const res = await e.analyse(fen, { depth: 12, multipv: Math.min(n, 40) });
    const best = res[0]; if (!best || best.score < range[0] || best.score > range[1] || best.mate) return null;
    const ok = res.filter((x) => x.score >= best.score - 50), bad = res.filter((x) => x.score <= best.score - 250);
    if (ok.length > maxOk || bad.length < n * badShare) return null;
    return { f: fen, l: [best.move], a: ok.length > 1 ? ok.slice(1).map((x) => x.move) : undefined };
  };
}
// Pawn endings: the only move that keeps the best result (win or draw).
function endingOnly(spec, opt, pre) {
  const cat = (s) => (s >= 400 ? 2 : s <= -400 ? 0 : 1);
  return async (e) => {
    const fen = randomFen(spec, opt); if (!fen) return null;
    if (pre && !pre(fen)) return null;
    const g = load(fen), n = g.moves().length; if (n < 3) return null;
    const res = await e.analyse(fen, { depth: 22, multipv: Math.min(n, 12) });
    if (!res[0]) return null;
    const c = cat(res[0].score); if (c === 0) return null;
    const ok = res.filter((x) => cat(x.score) === c);
    if (ok.length !== 1 || res.length < 3) return null;
    const deep = await e.analyse(fen, { depth: 30, multipv: 2 });
    if (deep[0].move !== res[0].move || cat(deep[0].score) !== c || (deep[1] && cat(deep[1].score) === c)) return null;
    return { f: fen, l: [deep[0].move], z: c === 2 ? "gewinnt" : "hält remis" };
  };
}
// Lines with a sacrifice/defender topic, checked on the engine line.
function lineTopic(spec, opt, test, { minGain = 2 } = {}) {
  return async (e) => {
    const fen = randomFen(spec, opt); if (!fen) return null;
    const g = load(fen); if (Math.abs(balance(g, g.turn())) > 1) return null;
    if (!quiet(fen)) return null;
    const res = await e.analyse(fen, { depth: 10, multipv: 2 });
    if (!res[0] || res[0].score < WIN || (res[1] && res[1].score > res[0].score - 200) || res[0].pv.length < 3) return null;
    if (!test(fen, res[0].pv)) return null;
    const deep = await e.analyse(fen, { depth: 16, multipv: 2 });
    if (deep[0].move !== res[0].move || deep[0].score < WIN || (deep[1] && deep[1].score > deep[0].score - 200)) return null;
    const mate = deep[0].mate && deep[0].mate > 0 && deep[0].mate <= 3;
    const line = mate ? deep[0].pv.slice(0, 2 * deep[0].mate - 1) : cutLine(fen, deep[0].pv, minGain);
    if (!line || line.length < 3 || !test(fen, line)) return null;
    if (mate && !isMate(fen, line)) return null;
    const alts = await forced(e, fen, line, { mateLast: mate }); if (alts === null) return null;
    return { f: fen, l: line, a: alts.length ? alts : undefined, m: mate ? 1 : undefined };
  };
}

// ---------- Topic tests on lines ----------
const sameSq = (a, b) => a.slice(2, 4) === b.slice(2, 4);
// Removing the defender: 1. capture the guard, recapture, 2. take the piece it guarded.
function removeDefender(fen, pv) {
  if (pv.length < 3) return false;
  const g = load(fen), m = boardMap(g), me = g.turn();
  const t1 = pv[0].slice(2, 4), t3 = pv[2].slice(2, 4);
  if (!m[t1] || m[t1].color === me) return false; // first move captures
  if (!m[t3] || m[t3].color === me || VAL[m[t3].type] < 3) return false; // third move takes a piece
  return attacks(m, t1).includes(t3); // the captured piece guarded it
}
// Decoy: the key move goes to a square where it is taken (by the king or queen), then that piece is hit.
function decoy(fen, pv) {
  if (pv.length < 3 || !sameSq(pv[0], pv[1])) return false;
  const g = load(fen), m = boardMap(g), me = g.turn();
  const taker = m[pv[1].slice(0, 2)]; if (!taker || !"kq".includes(taker.type)) return false;
  const a = play(fen, pv.slice(0, 3)); if (!a) return false;
  return a.in_check() || a.in_checkmate() || attacks(boardMap(a), pv[2].slice(2, 4)).includes(pv[1].slice(2, 4));
}
// Deflection: the reply piece leaves its post, and the next move uses the square or piece it guarded.
function deflect(fen, pv) {
  if (pv.length < 3) return false;
  const g = load(fen), m = boardMap(g);
  const from = pv[1].slice(0, 2), p = m[from]; if (!p || p.type === "k") return false;
  return attacks(m, from).includes(pv[2].slice(2, 4)) && pv[1].slice(2, 4) !== pv[2].slice(2, 4);
}
const keyIsSacrifice = (fen, line) => { const g = load(fen), m = boardMap(g); const to = line[0].slice(2, 4); return attackers(m, to, other(g.turn())).length > 0 || (play(fen, [line[0]]) && sameSq(line[0], line[1] || "")); };

// ---------- The course ----------
const W = (s) => ({ w: s.split("|")[0], b: s.split("|")[1] });
const LESSONS = [
  // Stufe 1
  { id: "1.1", make: tactic(W("KRBPP|KRNPP"), {}, (f, u) => { const g = load(f), m = boardMap(g); const t = u.slice(2, 4); if (!m[t] || VAL[m[t].type] < 3) return false; const a = afterMove(f, u); return attackers(a.m, t, a.g.turn()).length === 0; }, { minGain: 3, eq: 0, loose: true }) },
  { id: "1.2", make: mateIn(1, W("KQPP|KRPPP"), { shelter: true }, (f, l) => { const a = afterMove(f, l[0]); return "qr".includes(a.m[l[0].slice(2, 4)].type); }) },
  { id: "1.3", make: safeMoves(W("KRNPP|KRBPP"), {}, (f) => { const g = load(f), m = boardMap(g), me = g.turn(); return Object.keys(m).some((s) => m[s].color === me && VAL[m[s].type] >= 3 && m[s].type !== "k" && attackers(m, s, other(me)).some((a) => VAL[m[a].type] < VAL[m[s].type] || attackers(m, s, me).length === 0)); }) },
  { id: "1.4", make: safeMoves(W("KRBP|KQNP"), { inCheck: true }, null, { maxOk: 2, badShare: 0.3, range: [-200, 300] }) },
  // Stufe 2
  { id: "2.1", make: tactic(W("KQNRP|KQNRP"), { plant: plants.knightFork(["k", "q", "r"]) }, (f, u) => { const g = load(f); return g.get(u.slice(0, 2)).type === "n" && forkTargets(f, u).length >= 2; }) },
  { id: "2.2", make: tactic(W("KQBP|KQBRP"), { plant: plants.doubleAttack("q", ["k", "b", "r"]) }, (f, u) => { const g = load(f); return "qrb".includes(g.get(u.slice(0, 2)).type) && forkTargets(f, u).length >= 2; }, { eq: 5 }) },
  { id: "2.3", make: tactic(W("KNBRPP|KNBRP"), { plant: plants.pawnFork(["k", "n", "b", "r"]) }, (f, u) => { const g = load(f); return g.get(u.slice(0, 2)).type === "p" && forkTargets(f, u).length >= 2; }) },
  { id: "2.4", make: mateIn(1, W("KRBNPP|KRBPPP"), { shelter: true }) },
  { id: "2.5", make: safeMoves(W("KRBPPP|KQRPP"), { shelter: true }, (f) => mates1(mirrorTurn(f)).length > 0, { maxOk: 4, badShare: 0.4, range: [-250, 350] }) },
  // Stufe 3
  { id: "3.1", make: tactic(W("KBRQ|KNRQ"), { plant: () => (rnd() < 0.5 ? plants.line("b", ["n", "r"], ["k", "q"]) : plants.line("r", ["n"], ["k", "q"]))() }, (f, u) => pinOrSkewer(f, u, "pin")) },
  { id: "3.2", make: tactic(W("KRBP|KRBP"), { plant: () => (rnd() < 0.5 ? plants.line("b", ["k"], ["r"]) : plants.line("r", ["k"], ["b"]))() }, (f, u) => pinOrSkewer(f, u, "skewer")) },
  { id: "3.3", make: tactic(W("KRBNP|KRBNP"), { plant: plants.discovery() }, (f, u) => discovered(f, u)) },
  { id: "3.4", make: mateIn(2, W("KQRPP|KRBPPP"), { shelter: true }) },
  { id: "3.5", make: endingOnly(W("KP|K"), {}, (f) => { const g = load(f); const p = find(g, "w", "p")[0] || find(g, "b", "p")[0]; return kingDist(find(g, "w", "k")[0], p) >= 3; }) },
  // Stufe 4
  { id: "4.1", make: lineTopic(W("KRBNPP|KRBNPP"), {}, removeDefender) },
  { id: "4.2", make: lineTopic(W("KQRNPP|KQRNPP"), { shelter: true }, decoy) },
  { id: "4.3", make: lineTopic(W("KQRBPP|KQRNPP"), {}, deflect) },
  { id: "4.4", make: endingOnly(W("KP|K"), {}, (f) => { const g = load(f); const p = find(g, "w", "p")[0]; return p && kingDist(find(g, "w", "k")[0], p) <= 2 && kingDist(find(g, "b", "k")[0], p) <= 3; }) },
  { id: "4.5", make: mateIn(2, W("KQRBPP|KQRPPP"), { shelter: true }, keyIsSacrifice) },
  // Stufe 5
  { id: "5.1", make: mateIn(3, W("KQRNPP|KRBPPP"), { shelter: true }) },
  { id: "5.2", make: tactic(W("KQRBNPP|KQRNBPP"), {}, () => true, { minGain: 3 }) },
  { id: "5.3", make: endingOnly(W("KPP|KP"), {}) },
];
function mirrorTurn(fen) { const p = fen.split(" "); p[1] = other(p[1]); p[3] = "-"; return p.join(" "); }

// ---------- Positions from games ----------
// Lessons with a "mine" topic take their positions from games that Stockfish plays against itself at club strength:
// when one side blunders, the other side's winning reply becomes an exercise (like real puzzles from real games).
function classify(fen, line, mate) {
  const g = load(fen), m = boardMap(g), k = line[0], mover = m[k.slice(0, 2)].type;
  if (mate) return null;
  if (line.length >= 3 && removeDefender(fen, line)) return "4.1";
  if (line.length >= 3 && decoy(fen, line)) return "4.2";
  if (line.length >= 3 && deflect(fen, line)) return "4.3";
  if (discovered(fen, k)) return "3.3";
  if (pinOrSkewer(fen, k, "skewer")) return "3.2";
  if (pinOrSkewer(fen, k, "pin")) return "3.1";
  if (forkTargets(fen, k).length >= 2) return mover === "n" ? "2.1" : mover === "p" ? "2.3" : "2.2";
  if (line.length === 1 && m[k.slice(2, 4)]) return "1.1";
  if (line.length >= 3) return "5.2";
  return null;
}
async function mine(need, out) {
  const players = Array.from({ length: POOL }, () => startEngine());
  await Promise.all(players.map((e) => e.ready));
  const counts = () => need.map((id) => id + ":" + out[id].length).join(" ");
  const full = () => need.every((id) => out[id].length >= PER_LESSON);
  let games = 0;
  const GAMES = +process.env.GAMES || 400;
  const one = async (i) => {
    const pl = players[i], an = engines[i];
    while (!full() && games < GAMES) {
      games++;
      const g = new Chess();
      for (let k = 0; k < 4 + Math.floor(rnd() * 5); k++) { const ms = g.moves(); g.move(pick(ms)); }
      let prev = null;
      for (let ply = 0; ply < 120 && !g.game_over(); ply++) {
        const fen = g.fen();
        const res = await an.analyse(fen, { depth: 10, multipv: 2 });
        if (!res[0]) break;
        // Exercise if the previous move was a blunder: before it the game was level, now the side to move wins clearly with one move.
        if (prev !== null && Math.abs(prev) <= 600 && res[0].score >= WIN && res[0].score - prev >= 200 && !(res[1] && res[1].score > res[0].score - 200)) {
          try {
            const ex = await checkMined(an, fen);
            if (ex && out[ex.id] && need.includes(ex.id) && out[ex.id].length < PER_LESSON && !out[ex.id].some((x) => x.f === ex.f)) { out[ex.id].push(ex.ex); writeFileSync(OUT, JSON.stringify(out) + "\n"); console.log(games, counts()); }
          } catch (err) { if (process.env.DEBUG) console.error(err); }
        }
        if (need.includes("2.5") && out["2.5"].length < PER_LESSON && !g.in_check() && mates1(mirrorTurn(fen)).length) {
          const ex = await safeCheck(an, fen, { maxOk: 4, badShare: 0.4, range: [-250, 350] });
          if (ex && !out["2.5"].some((x) => x.f === ex.f)) { out["2.5"].push(ex); writeFileSync(OUT, JSON.stringify(out) + "\n"); console.log(games, counts()); }
        }
        prev = res[0].score;
        const elo = 1320 + Math.floor(rnd() * 500);
        // Now and then a careless move, as in real club games.
        const mv = rnd() < 0.07 ? uci(pick(g.moves({ verbose: true }))) : await pl.bestmove(fen, { elo, movetime: 20 });
        if (!mv || mv === "(none)" || !g.move({ from: mv.slice(0, 2), to: mv.slice(2, 4), promotion: mv[4] || "q" })) break;
        prev = -prev; // score from the view of the new side to move (before its own analysis)
      }
    }
  };
  await Promise.all(players.map((_, i) => one(i)));
  players.forEach((e) => e.quit());
  console.log(`Partien: ${games}, ${counts()}`, JSON.stringify(ST));
}
async function checkMined(e, fen) {
  const deep = await e.analyse(fen, { depth: 16, multipv: 2 });
  st("cand");
  if (!deep[0] || deep[0].score < WIN || (deep[1] && deep[1].score > deep[0].score - 200)) return st("m-deep");
  const mate = deep[0].mate && deep[0].mate > 0;
  if (mate) {
    const n = deep[0].mate; if (n > 3 || (deep[1] && deep[1].mate && deep[1].mate > 0 && deep[1].mate <= n)) return st("m-mate");
    const line = deep[0].pv.slice(0, 2 * n - 1); if (!isMate(fen, line)) return st("m-mate");
    for (let i = 2; i < line.length - 1; i += 2) {
      const g = play(fen, line.slice(0, i)); const r = await e.analyse(g.fen(), { depth: 14, multipv: 2 });
      if (r[0].move !== line[i] || (r[1] && r[1].mate && r[1].mate > 0 && r[1].mate <= n - i / 2)) return st("m-mate");
    }
    const id = n === 1 ? (mates1(fen).length === 1 ? "2.4" : null) : n === 3 ? "5.1" : keyIsSacrifice(fen, line) ? "4.5" : "3.4";
    if (!id) return null;
    st("c" + id);
    return { id, f: fen, ex: { f: fen, l: line, m: 1 } };
  }
  const line = cutLine(fen, deep[0].pv, 2); if (!line) return st("m-cut");
  const id = classify(fen, line, false); if (!id) return st("m-noclass");
  st("c" + id);
  const alts = await forced(e, fen, line); if (alts === null) return st("m-forced");
  return { id, f: fen, ex: { f: fen, l: line, a: alts.length ? alts : undefined } };
}

// ---------- Run ----------
const want = process.argv.slice(2);
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const out = Object.assign({}, old);
const MAX_TRIES = +process.env.MAX_TRIES || 60000;
const MINED = (process.env.MINE || "2.1,2.2,2.3,3.1,3.2,3.3,4.1,4.2,4.3,4.5,5.1,3.4,5.2").split(",").filter((id) => !want.length || want.includes(id));
if (MINED.length) { for (const id of MINED) out[id] = (process.env.FRESH ? [] : out[id] || []).slice(0, PER_LESSON); await mine(MINED, out); }
for (const L of LESSONS) {
  if (want.length && !want.includes(L.id)) continue;
  if (MINED.includes(L.id)) continue;
  const got = [], seen = new Set();
  let tries = 0;
  const t0 = Date.now();
  const worker = async (e) => {
    while (got.length < PER_LESSON && tries < MAX_TRIES) {
      tries++;
      let ex = null;
      try { ex = await L.make(e); } catch (err) { if (process.env.DEBUG) console.error(err); ex = null; }
      if (!ex || seen.has(ex.f.split(" ")[0])) continue;
      seen.add(ex.f.split(" ")[0]);
      // Every second exercise is mirrored, so that Black is to move.
      if (got.length % 2 === 1) ex = mirrorEx(ex);
      if (got.length < PER_LESSON) got.push(ex);
    }
  };
  await Promise.all(engines.map(worker));
  console.log(`${L.id}: ${got.length} Aufgaben, ${tries} Versuche, ${Math.round((Date.now() - t0) / 1000)} s`);
  out[L.id] = got;
  if (process.env.DEBUG) console.log(JSON.stringify(ST)); for (const k in ST) delete ST[k];
}
function mirrorEx(ex) {
  const mu = (u) => u[0] + (9 - +u[1]) + u[2] + (9 - +u[3]) + (u[4] || "");
  return Object.assign({}, ex, { f: mirror(ex.f), l: ex.l.map(mu), a: ex.a && ex.a.map(mu) });
}
writeFileSync(OUT, JSON.stringify(out) + "\n");
engines.forEach((e) => e.quit());
