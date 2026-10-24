// Texas Hold'em ohne DOM: Karten, Handbewertung, Setzrunden, Side Pots und Bots.
// Läuft im Browser (wird von build.mjs in die Seite eingebettet) und in Node (Tests in poker/test).
// Karten sind Zahlen 0..51: Rang = c >> 2 (0 = Zwei … 12 = Ass), Farbe = c & 3.
var Poker = (function () {
  "use strict";
  var RANKS = "23456789TJQKA", SUITS = ["♠", "♥", "♦", "♣"];
  var RANK_NAMES = ["Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn", "Bube", "Dame", "König", "Ass"];
  var CATS = ["Höchste Karte", "Ein Paar", "Zwei Paare", "Drilling", "Straße", "Flush", "Full House", "Vierling", "Straight Flush"];

  function rank(c) { return c >> 2; }
  function suit(c) { return c & 3; }
  function cardText(c) { return (RANKS[rank(c)] === "T" ? "10" : RANKS[rank(c)]) + SUITS[suit(c)]; }
  function parse(s) { // "As", "Td", "10h" → Karte, für Tests
    s = s.replace("10", "T");
    return RANKS.indexOf(s[0].toUpperCase()) * 4 + "shdc".indexOf(s[1].toLowerCase());
  }

  // Zufall: im Browser crypto, sonst Math.random. rng() liefert [0, 1).
  function cryptoRandom() {
    var g = typeof globalThis !== "undefined" ? globalThis : {};
    if (g.crypto && g.crypto.getRandomValues) { var a = new Uint32Array(1); g.crypto.getRandomValues(a); return a[0] / 4294967296; }
    return Math.random();
  }
  function shuffled(rng) {
    rng = rng || cryptoRandom;
    var d = [];
    for (var i = 0; i < 52; i++) d.push(i);
    for (i = 51; i > 0; i--) { var j = Math.floor(rng() * (i + 1)), t = d[i]; d[i] = d[j]; d[j] = t; }
    return d;
  }

  /* ---------- Handbewertung ---------- */
  // Höchste Karte einer Straße in einer Rangmaske (Bits 0..12), -1 ohne Straße. Das Ass zählt auch als Eins (Wheel bis zur Fünf).
  function straightHigh(mask) {
    var ext = (mask << 1) | ((mask >> 12) & 1);
    for (var hi = 13; hi >= 4; hi--) if (((ext >> (hi - 4)) & 31) === 31) return hi - 1;
    return -1;
  }
  function mk(cat, ks) { var s = cat; for (var i = 0; i < 5; i++) s = s * 16 + (ks[i] === undefined ? 0 : ks[i]); return s; }
  // Wert einer Hand aus 5 bis 7 Karten. Größer ist besser, gleich ist Split.
  function evaluate(cards) {
    var cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], sm = [0, 0, 0, 0], sc = [0, 0, 0, 0], mask = 0, i, r;
    for (i = 0; i < cards.length; i++) { r = rank(cards[i]); var s = suit(cards[i]); cnt[r]++; sm[s] |= 1 << r; sc[s]++; mask |= 1 << r; }
    var flush = -1;
    for (s = 0; s < 4; s++) if (sc[s] >= 5) {
      var sh = straightHigh(sm[s]);
      if (sh >= 0) return mk(8, [sh]);
      var top = [];
      for (r = 12; r >= 0 && top.length < 5; r--) if (sm[s] & (1 << r)) top.push(r);
      flush = mk(5, top);
    }
    var quads = [], trips = [], pairs = [];
    for (r = 12; r >= 0; r--) { if (cnt[r] === 4) quads.push(r); else if (cnt[r] === 3) trips.push(r); else if (cnt[r] === 2) pairs.push(r); }
    function kick(ex, n) { var k = []; for (var q = 12; q >= 0 && k.length < n; q--) if (cnt[q] && ex.indexOf(q) < 0) k.push(q); return k; }
    if (quads.length) return mk(7, [quads[0]].concat(kick([quads[0]], 1)));
    if (trips.length && (trips.length > 1 || pairs.length)) return mk(6, [trips[0], Math.max(trips[1] === undefined ? -1 : trips[1], pairs[0] === undefined ? -1 : pairs[0])]);
    if (flush >= 0) return flush;
    sh = straightHigh(mask);
    if (sh >= 0) return mk(4, [sh]);
    if (trips.length) return mk(3, [trips[0]].concat(kick([trips[0]], 2)));
    if (pairs.length >= 2) return mk(2, [pairs[0], pairs[1]].concat(kick([pairs[0], pairs[1]], 1)));
    if (pairs.length) return mk(1, [pairs[0]].concat(kick([pairs[0]], 3)));
    return mk(0, kick([], 5));
  }
  function category(score) { return Math.floor(score / 1048576); }
  // Lesbarer Name, z. B. „Full House, Könige über Zehnen“.
  function handName(score) {
    var cat = category(score), k = [];
    for (var i = 4; i >= 0; i--) k.push(Math.floor(score / Math.pow(16, i)) % 16);
    var n = function (r) { return RANK_NAMES[r]; };
    switch (cat) {
      case 8: return k[0] === 12 ? "Royal Flush" : "Straight Flush bis " + n(k[0]);
      case 7: return "Vierling " + n(k[0]);
      case 6: return "Full House " + n(k[0]) + " und " + n(k[1]);
      case 5: return "Flush mit " + n(k[0]);
      case 4: return "Straße bis " + n(k[0]);
      case 3: return "Drilling " + n(k[0]);
      case 2: return "Zwei Paare " + n(k[0]) + " und " + n(k[1]);
      case 1: return "Paar " + n(k[0]);
      default: return "Höchste Karte " + n(k[0]);
    }
  }
  // Die fünf Karten, die die Hand bilden (für die Anzeige beim Showdown).
  function bestFive(cards) {
    var best = cards.slice(0, 5), bs = -1;
    (function pick(start, chosen) {
      if (chosen.length === 5) { var v = evaluate(chosen); if (v > bs) { bs = v; best = chosen.slice(); } return; }
      for (var i = start; i <= cards.length - (5 - chosen.length); i++) { chosen.push(cards[i]); pick(i + 1, chosen); chosen.pop(); }
    })(0, []);
    return best;
  }

  /* ---------- Spielablauf ---------- */
  // players: [{id, name, stack, bot}] in Sitzreihenfolge (im Uhrzeigersinn). bot: null oder {style: "vorsichtig"|"solide"|"wild"}.
  function createGame(o) {
    return {
      players: o.players.map(function (p) { return seat(p); }),
      sb: o.sb || 10, bb: o.bb || 20, button: o.button === undefined ? -1 : o.button,
      hand: 0, street: "idle", board: [], deck: [], toAct: -1, currentBet: 0, minRaise: o.bb || 20, raiseId: 0,
      result: null, log: [], startStacks: null
    };
  }
  function seat(p) {
    return {id: p.id, name: p.name, stack: p.stack, bot: p.bot || null, hole: [], bet: 0, total: 0, inHand: false,
      folded: false, allIn: false, acted: false, raiseSeen: -1, last: "", sitOut: !!p.sitOut, away: false};
  }
  function addPlayer(g, p) { var s = seat(p); g.players.push(s); return s; }
  function canAct(p) { return p.inHand && !p.folded && !p.allIn; }
  function live(g) { return g.players.filter(function (p) { return p.inHand && !p.folded; }); }
  function nextSeat(g, from, pred) {
    var n = g.players.length;
    for (var k = 1; k <= n; k++) { var i = (from + k + n) % n; if (pred(g.players[i], i)) return i; }
    return -1;
  }
  function eligible(p) { return p.stack > 0 && !p.sitOut; }
  function canStart(g) { return g.players.filter(eligible).length >= 2; }
  function say(g, t) { g.log.push(t); if (g.log.length > 60) g.log.shift(); }
  function put(g, p, amt) {
    amt = Math.min(amt, p.stack);
    p.stack -= amt; p.bet += amt; p.total += amt;
    if (p.stack === 0) p.allIn = true;
    return amt;
  }

  function startHand(g, rng) {
    if (!canStart(g)) throw new Error("Zu wenige Spieler");
    g.hand++; g.board = []; g.result = null; g.deck = shuffled(rng);
    g.startStacks = {};
    g.players.forEach(function (p) {
      g.startStacks[p.id] = p.stack;
      p.hole = []; p.bet = 0; p.total = 0; p.folded = false; p.allIn = false; p.acted = false; p.raiseSeen = -1; p.last = "";
      p.inHand = eligible(p);
    });
    var n = g.players.filter(function (p) { return p.inHand; }).length;
    g.button = nextSeat(g, g.button < 0 ? -1 : g.button, function (p) { return p.inHand; });
    var sbSeat = n === 2 ? g.button : nextSeat(g, g.button, function (p) { return p.inHand; });
    var bbSeat = nextSeat(g, sbSeat, function (p) { return p.inHand; });
    g.sbSeat = sbSeat; g.bbSeat = bbSeat;
    say(g, "Hand " + g.hand + ": " + g.players[g.button].name + " hat den Button.");
    var a = put(g, g.players[sbSeat], g.sb); g.players[sbSeat].last = "Small Blind " + a;
    var b = put(g, g.players[bbSeat], g.bb); g.players[bbSeat].last = "Big Blind " + b;
    g.currentBet = g.bb; g.minRaise = g.bb; g.raiseId = 0;
    for (var r = 0; r < 2; r++) {
      var i = g.button;
      for (var k = 0; k < n; k++) { i = nextSeat(g, i, function (p) { return p.inHand; }); g.players[i].hole.push(g.deck.pop()); }
    }
    g.street = "preflop";
    g.toAct = nextSeat(g, bbSeat, canAct);
    if (roundDone(g)) endRound(g);
    return g;
  }

  function roundDone(g) {
    if (live(g).length <= 1) return true;
    var acts = g.players.filter(canAct);
    return acts.every(function (p) { return (p.acted || acts.length === 1) && p.bet === g.currentBet; });
  }

  function legal(g) {
    var p = g.players[g.toAct];
    if (!p || !canAct(p) || g.street === "done" || g.street === "idle") return null;
    var toCall = Math.max(0, g.currentBet - p.bet);
    var others = g.players.filter(function (q) { return q !== p && canAct(q); }).length;
    var maxTo = p.bet + p.stack, minTo = Math.min(maxTo, g.currentBet === 0 ? g.bb : g.currentBet + g.minRaise);
    var canRaise = p.stack > toCall && p.raiseSeen !== g.raiseId && others > 0;
    return {seat: g.toAct, id: p.id, toCall: Math.min(toCall, p.stack), canCheck: toCall === 0, canCall: toCall > 0,
      canRaise: canRaise, minTo: minTo, maxTo: maxTo, isBet: g.currentBet === 0, pot: potTotal(g)};
  }
  function potTotal(g) { return g.players.reduce(function (s, p) { return s + p.total; }, 0); }

  // action: "fold" | "check" | "call" | "raise" (amount = Gesamteinsatz in dieser Runde) | "allin". Ungültiges wird passend umgedeutet.
  function act(g, action, amount) {
    var L = legal(g);
    if (!L) throw new Error("Niemand ist am Zug");
    var p = g.players[g.toAct];
    if (action === "allin") { if (L.canRaise && L.maxTo > g.currentBet) { action = "raise"; amount = L.maxTo; } else action = L.canCall ? "call" : "check"; }
    if (action === "check" && !L.canCheck) action = "fold";
    if (action === "fold" && L.canCheck) action = "check";
    if (action === "call" && !L.canCall) action = "check";
    if (action === "raise" && !L.canRaise) action = L.canCall ? "call" : "check";
    if (action === "fold") { p.folded = true; p.last = "Fold"; say(g, p.name + " passt."); }
    else if (action === "check") { p.last = "Check"; say(g, p.name + " schiebt."); }
    else if (action === "call") { var c = put(g, p, L.toCall); p.last = p.allIn ? "All-in " + p.bet : "Call " + c; say(g, p.name + (p.allIn ? " geht all-in mit " + p.bet + "." : " geht mit " + c + ".")); }
    else {
      var to = Math.max(L.minTo, Math.min(L.maxTo, Math.round(+amount || 0)));
      put(g, p, to - p.bet);
      var by = to - g.currentBet;
      if (by >= g.minRaise) { g.minRaise = by; g.raiseId++; }
      var verb = g.currentBet === 0 ? "setzt" : "erhöht auf";
      g.currentBet = Math.max(g.currentBet, to);
      g.players.forEach(function (q) { if (q !== p) q.acted = false; });
      p.last = p.allIn ? "All-in " + to : (verb === "setzt" ? "Bet " : "Raise ") + to;
      say(g, p.name + (p.allIn ? " geht all-in mit " + to + "." : " " + verb + " " + to + "."));
    }
    p.acted = true; p.raiseSeen = g.raiseId; g.actions = (g.actions || 0) + 1;
    if (roundDone(g)) endRound(g);
    else g.toAct = nextSeat(g, g.toAct, canAct);
    return action;
  }

  function endRound(g) {
    g.players.forEach(function (p) { p.bet = 0; p.acted = false; p.raiseSeen = -1; });
    g.currentBet = 0; g.minRaise = g.bb; g.raiseId++;
    if (live(g).length <= 1) return finish(g);
    while (true) {
      if (g.street === "river") return finish(g);
      g.deck.pop(); // Brennkarte
      if (g.street === "preflop") { g.board.push(g.deck.pop(), g.deck.pop(), g.deck.pop()); g.street = "flop"; say(g, "Flop: " + g.board.map(cardText).join(" ")); }
      else if (g.street === "flop") { g.board.push(g.deck.pop()); g.street = "turn"; say(g, "Turn: " + cardText(g.board[3])); }
      else { g.board.push(g.deck.pop()); g.street = "river"; say(g, "River: " + cardText(g.board[4])); }
      if (g.players.filter(canAct).length >= 2) break;
    }
    g.players.forEach(function (p) { if (canAct(p)) p.last = ""; });
    g.toAct = nextSeat(g, g.button, canAct);
  }

  // Pots aus den Gesamteinsätzen: jede Stufe gehört den nicht gepassten Spielern, die mindestens so viel gesetzt haben.
  function buildPots(players) {
    var levels = [];
    players.forEach(function (p) { if (p.total > 0 && levels.indexOf(p.total) < 0) levels.push(p.total); });
    levels.sort(function (a, b) { return a - b; });
    var pots = [], prev = 0;
    levels.forEach(function (lv) {
      var amt = 0;
      players.forEach(function (p) { amt += Math.min(p.total, lv) - Math.min(p.total, prev); });
      var el = players.filter(function (p) { return p.inHand && !p.folded && p.total >= lv; }).map(function (p) { return p.id; });
      var last = pots[pots.length - 1];
      if (!el.length && last) last.amount += amt; // nur Geld von Gepassten: gehört zur Stufe darunter
      else if (last && last.eligible.join() === el.join()) last.amount += amt;
      else pots.push({amount: amt, eligible: el});
      prev = lv;
    });
    return pots.filter(function (x) { return x.amount > 0 && x.eligible.length; });
  }

  function finish(g) {
    var alive = live(g), show = alive.length > 1;
    while (show && g.board.length < 5) g.board.push(g.deck.pop());
    var score = {};
    alive.forEach(function (p) { score[p.id] = show ? evaluate(p.hole.concat(g.board)) : 0; });
    var pots = buildPots(g.players), won = {};
    pots.forEach(function (pot, i) {
      var best = -1, w = [];
      pot.eligible.forEach(function (id) { if (score[id] > best) { best = score[id]; w = [id]; } else if (score[id] === best) w.push(id); });
      // Ungerade Chips bekommt der erste Gewinner links vom Button.
      var order = [], s = g.button;
      for (var k = 0; k < g.players.length; k++) { s = (s + 1) % g.players.length; if (w.indexOf(g.players[s].id) >= 0) order.push(g.players[s]); }
      var share = Math.floor(pot.amount / order.length), rest = pot.amount - share * order.length;
      order.forEach(function (p, j) { var x = share + (j < rest ? 1 : 0); p.stack += x; won[p.id] = (won[p.id] || 0) + x; });
      pot.winners = order.map(function (p) { return p.id; });
      pot.hand = show ? handName(best) : "";
      pot.name = pots.length > 1 ? (i === 0 ? "Hauptpot" : "Side Pot " + i) : "Pot";
    });
    g.result = {pots: pots, won: won, showdown: show, shown: show ? alive.map(function (p) { return p.id; }) : [],
      hands: show ? alive.reduce(function (o, p) { o[p.id] = handName(score[p.id]); return o; }, {}) : {}};
    pots.forEach(function (pot) {
      var names = pot.winners.map(function (id) { return byId(g, id).name; }).join(" und ");
      say(g, names + (pot.winners.length > 1 ? " teilen " : " gewinnt ") + pot.amount + (pots.length > 1 ? " (" + pot.name + ")" : "") + (pot.hand ? " mit " + pot.hand : "") + ".");
    });
    g.players.forEach(function (p) { p.bet = 0; });
    g.street = "done"; g.toAct = -1;
    return g;
  }
  function byId(g, id) { for (var i = 0; i < g.players.length; i++) if (g.players[i].id === id) return g.players[i]; return null; }

  // Was ein Spieler sehen darf: kein Deck, fremde Karten nur nach dem Showdown.
  function publicView(g, viewer) {
    var shown = (g.result && g.result.shown) || [];
    var v = JSON.parse(JSON.stringify(g));
    delete v.deck;
    v.players.forEach(function (p) { if (p.id !== viewer && shown.indexOf(p.id) < 0) p.hole = p.hole.length ? [-1, -1] : []; });
    return v;
  }

  /* ---------- Bots ---------- */
  // Gewinnchance per Monte-Carlo gegen n zufällige Gegnerhände.
  function equity(hole, board, n, iters, rng) {
    rng = rng || Math.random; iters = iters || 300;
    var used = {}, rest = [], i;
    hole.concat(board).forEach(function (c) { used[c] = 1; });
    for (i = 0; i < 52; i++) if (!used[i]) rest.push(i);
    var win = 0;
    for (var it = 0; it < iters; it++) {
      var d = rest.slice(), take = (5 - board.length) + 2 * n;
      for (i = 0; i < take; i++) { var j = i + Math.floor(rng() * (d.length - i)), t = d[i]; d[i] = d[j]; d[j] = t; }
      var b = board.concat(d.slice(0, 5 - board.length)), me = evaluate(hole.concat(b)), ties = 0, lost = false;
      for (var o = 0; o < n && !lost; o++) {
        var k = 5 - board.length + 2 * o, s = evaluate([d[k], d[k + 1]].concat(b));
        if (s > me) lost = true; else if (s === me) ties++;
      }
      if (!lost) win += 1 / (ties + 1);
    }
    return win / iters;
  }
  var STYLES = {
    vorsichtig: {loose: -0.06, aggr: 0.25, bluff: 0.03},
    solide: {loose: 0, aggr: 0.45, bluff: 0.07},
    wild: {loose: 0.08, aggr: 0.7, bluff: 0.16}
  };
  // Vor dem Flop: Chen-Formel statt Simulation, sonst spielen Bots fast jede Hand.
  function chen(hole) {
    var a = rank(hole[0]), b = rank(hole[1]), hi = Math.max(a, b), lo = Math.min(a, b);
    var base = function (r) { return r === 12 ? 10 : r === 11 ? 8 : r === 10 ? 7 : r === 9 ? 6 : (r + 2) / 2; };
    if (a === b) return Math.max(5, base(a) * 2);
    var s = base(hi), gap = hi - lo - 1;
    if (suit(hole[0]) === suit(hole[1])) s += 2;
    s -= [0, 1, 2, 4][gap] === undefined ? 5 : [0, 1, 2, 4][gap];
    if (gap <= 1 && hi < 10) s += 1;
    return Math.ceil(s);
  }
  function preflop(g, L, p, st, rng, level) {
    var n = live(g).length, s = chen(p.hole) + st.loose * 15 + (6 - Math.min(6, n)) * 0.45 + (rng() - 0.5) * [3, 1.6, 0.8][level];
    var bbs = L.toCall / g.bb, raised = g.currentBet > g.bb;
    var size = function (x) { return Math.round(Math.max(L.minTo, Math.min(L.maxTo, x))); };
    if (L.toCall >= p.stack * 0.4 && L.toCall > 0) return s >= 10.5 ? {action: "call"} : {action: "fold"};
    if (!raised) {
      if (L.canRaise && (s >= 10 || (s >= 8 && rng() < st.aggr) || rng() < st.bluff * 0.4)) return {action: "raise", amount: size(g.bb * (2.5 + rng()) + L.toCall * 0)};
      if (L.canCheck) return {action: "check"};
      return s >= 7 ? {action: "call"} : {action: "fold"};
    }
    if (L.canRaise && s >= 11.5 && rng() < 0.4 + st.aggr / 2) return {action: "raise", amount: size(g.currentBet * 3)};
    if (s >= 9 || (s >= 7.5 && bbs <= 3) || (L.canCheck)) return L.canCheck ? {action: "check"} : {action: "call"};
    return {action: "fold"};
  }
  // Entscheidung für den Spieler am Zug: {action, amount}. level: 0 leicht … 2 schwer (mehr Simulationen, weniger Zufall).
  function botDecide(g, rng, level) {
    rng = rng || Math.random; level = level === undefined ? 1 : level;
    var L = legal(g), p = g.players[g.toAct], st = STYLES[(p.bot && p.bot.style) || "solide"] || STYLES.solide;
    var opp = live(g).length - 1;
    if (g.street === "preflop") return preflop(g, L, p, st, rng, level);
    var eq = equity(p.hole, g.board, Math.max(1, opp), [120, 300, 600][level], rng);
    var noise = (rng() - 0.5) * [0.22, 0.12, 0.05][level];
    // Gegen viele Gegner sinkt die Chance von selbst; fair ist 1 / (Gegner + 1).
    var fair = 1 / (opp + 1), str = eq + noise + st.loose, pot = L.pot;
    var potOdds = L.toCall / (pot + L.toCall || 1);
    var size = function (f) { return Math.round(Math.max(L.minTo, Math.min(L.maxTo, g.currentBet + Math.max(g.minRaise, pot * f)))); };
    var strong = str > Math.max(0.5, fair * 1.9), good = str > Math.max(0.3, fair * 1.3);
    if (L.canCheck) {
      if (L.canRaise && strong && rng() < 0.5 + st.aggr / 2) return {action: "raise", amount: size(0.5 + rng() * 0.5)};
      if (L.canRaise && good && rng() < st.aggr * 0.6) return {action: "raise", amount: size(0.4 + rng() * 0.3)};
      if (L.canRaise && rng() < st.bluff) return {action: "raise", amount: size(0.5)};
      return {action: "check"};
    }
    if (str > potOdds + 0.04 + 0.03 * opp) {
      if (L.canRaise && strong && rng() < st.aggr) return {action: "raise", amount: size(0.6 + rng() * 0.6)};
      if (L.toCall >= p.stack * 0.6 && str < Math.max(0.45, fair * 1.5)) return {action: "fold"};
      return {action: "call"};
    }
    if (L.canRaise && rng() < st.bluff * 0.5 && g.street !== "river") return {action: "raise", amount: size(0.7)};
    return {action: "fold"};
  }

  return {
    RANKS: RANKS, SUITS: SUITS, CATS: CATS, rank: rank, suit: suit, cardText: cardText, parse: parse, shuffled: shuffled, cryptoRandom: cryptoRandom,
    evaluate: evaluate, category: category, handName: handName, bestFive: bestFive,
    createGame: createGame, addPlayer: addPlayer, startHand: startHand, legal: legal, act: act, canStart: canStart, potTotal: potTotal,
    buildPots: buildPots, chen: chen, byId: byId, publicView: publicView, equity: equity, botDecide: botDecide, STYLES: STYLES
  };
})();
if (typeof module !== "undefined") module.exports = Poker;
