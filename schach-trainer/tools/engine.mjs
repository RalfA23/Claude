// Small UCI wrapper around a local Stockfish binary (only used to generate and check the Stappen exercises, not in the app).
import { spawn } from "node:child_process";

export function startEngine(bin = process.env.STOCKFISH || "/usr/games/stockfish") {
  const p = spawn(bin, [], { stdio: ["pipe", "pipe", "ignore"] });
  let buf = "", waiter = null, lines = [];
  p.stdout.on("data", (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      lines.push(l);
      if (waiter && waiter.test(l)) { const w = waiter; waiter = null; w.done(lines); lines = []; }
    }
  });
  const send = (s) => p.stdin.write(s + "\n");
  const until = (re) => new Promise((done) => { waiter = { test: (l) => re.test(l), done }; });
  let q = Promise.resolve();
  const serial = (fn) => (q = q.then(fn, fn));
  const ready = serial(async () => { send("uci"); await until(/^uciok/); send("setoption name Threads value 1"); send("setoption name Hash value 32"); send("isready"); await until(/^readyok/); });

  // Returns the lines sorted by rank: {move, score (centipawns for the side to move, mate as +-(100000-n)), mate, pv}
  function analyse(fen, { depth = 14, multipv = 3, moves } = {}) {
    return serial(async () => {
      lines = [];
      send("setoption name MultiPV value " + multipv);
      send("position fen " + fen);
      send("go depth " + depth + (moves ? " searchmoves " + moves.join(" ") : ""));
      const out = await until(/^bestmove/);
      const best = new Map();
      for (const l of out) {
        const m = l.match(/^info .*?\bdepth (\d+) .*?\bmultipv (\d+) .*?\bscore (cp|mate) (-?\d+).*?\bpv (.+)$/);
        if (!m) continue;
        const d = +m[1], k = +m[2], kind = m[3], v = +m[4], pv = m[5].split(" ");
        const prev = best.get(k);
        if (prev && prev.d > d) continue;
        const score = kind === "cp" ? v : v > 0 ? 100000 - v : -100000 - v;
        best.set(k, { d, move: pv[0], score, mate: kind === "mate" ? v : null, pv });
      }
      return [...best.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
    });
  }
  // Plays like a club player: limited strength, short thinking time. Returns the chosen move.
  function bestmove(fen, { elo = 1400, movetime = 30 } = {}) {
    return serial(async () => {
      send("setoption name MultiPV value 1");
      send("setoption name UCI_LimitStrength value true");
      send("setoption name UCI_Elo value " + elo);
      send("position fen " + fen);
      send("go movetime " + movetime);
      const out = await until(/^bestmove/);
      send("setoption name UCI_LimitStrength value false");
      return out[out.length - 1].split(" ")[1];
    });
  }
  return { ready, analyse, bestmove, quit: () => { send("quit"); } };
}
