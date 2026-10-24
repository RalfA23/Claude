// Mehrspieler-Tisch für Texas Hold'em ohne DOM. Der Browser des Gastgebers mischt, führt die Engine und die Bots
// und schickt allen den öffentlichen Spielstand. Eigene Karten gehen nur verschlüsselt an den jeweiligen Spieler
// (ECDH P-256 und AES-GCM), Aktionen kommen genauso verschlüsselt zurück, damit niemand für andere setzen kann.
// Verlässt der Gastgeber den Tisch, übernimmt der nächste Spieler; die laufende Hand wird dann zurückgesetzt.
// transport: {send(event, payload), onMessage(cb), onPresence(cb), track(meta), close()} – im Browser Supabase Realtime, in Tests ein Fake.
var PokerNet = (function () {
  "use strict";
  var P = typeof Poker !== "undefined" ? Poker : require("./engine.js");
  var subtle = (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) || null;

  function b64(buf) { var s = "", a = new Uint8Array(buf); for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function unb64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  async function keyPair() { return subtle.generateKey({name: "ECDH", namedCurve: "P-256"}, false, ["deriveKey"]); }
  async function exportPub(kp) { return subtle.exportKey("jwk", kp.publicKey); }
  async function shared(priv, jwk) {
    var pub = await subtle.importKey("jwk", jwk, {name: "ECDH", namedCurve: "P-256"}, false, []);
    return subtle.deriveKey({name: "ECDH", public: pub}, priv, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
  }
  async function seal(key, obj) {
    var iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    var ct = await subtle.encrypt({name: "AES-GCM", iv: iv}, key, new TextEncoder().encode(JSON.stringify(obj)));
    return {iv: b64(iv), ct: b64(ct)};
  }
  async function open(key, box) {
    var pt = await subtle.decrypt({name: "AES-GCM", iv: unb64(box.iv)}, key, unb64(box.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }

  // o: {transport, me: {id, name}, host: bool, settings: {name, chips, sb, bb, seats, turn, bots}, onChange(view), timers}
  function Table(o) {
    var T = {me: o.me, settings: o.settings || null, isHost: !!o.host, hostId: o.host ? o.me.id : null, view: null, myHole: [], closed: false};
    var tr = o.transport, timers = o.timers || {set: function (f, ms) { return setTimeout(f, ms); }, clear: function (t) { clearTimeout(t); }, now: function () { return Date.now(); }};
    var kp = null, myPub = null, hostKey = null, hostPubSeen = null, keys = {}, pubs = {}, present = {}, seq = 0, lastSeq = -1;
    var g = null, enc = null, encHand = -1, turnTimer = 0, nextTimer = 0, botTimer = 0, deadline = 0, sitTimer = 0, hostGoneSince = 0, lastResit = 0;
    var ready = (async function () { kp = await keyPair(); myPub = await exportPub(kp); })();

    function changed() { if (o.onChange && !T.closed) o.onChange(T.viewFor()); }
    T.viewFor = function () {
      if (!T.view) return null;
      var v = JSON.parse(JSON.stringify(T.view));
      v.players.forEach(function (p) { if (p.id === T.me.id && T.myHole.length && v.hand === T.myHand) p.hole = T.myHole.slice(); });
      v.isHost = T.isHost; v.me = T.me.id;
      v.left = deadline ? Math.max(0, deadline - timers.now()) : 0;
      return v;
    };

    /* ----- Gastgeber ----- */
    function seatOf(id) { return g ? P.byId(g, id) : null; }
    async function keyFor(id) {
      if (keys[id]) return keys[id];
      if (!pubs[id]) return null;
      keys[id] = await shared(kp.privateKey, pubs[id]);
      return keys[id];
    }
    async function broadcast() {
      if (!T.isHost || T.closed) return;
      if (g.street !== "idle" && encHand !== g.hand) {
        enc = {}; encHand = g.hand;
        for (var i = 0; i < g.players.length; i++) {
          var p = g.players[i];
          if (p.bot || p.id === T.me.id || !p.hole.length) continue;
          var k = await keyFor(p.id);
          if (k) enc[p.id] = await seal(k, {hand: g.hand, hole: p.hole});
        }
      }
      var pub = P.publicView(g, null);
      pub.log = pub.log.slice(-14);
      var msg = {seq: ++seq, host: T.me.id, hostPub: myPub, settings: T.settings, game: pub, enc: g.street === "idle" ? {} : enc, left: deadline ? Math.max(0, deadline - timers.now()) : 0};
      T.view = pub; T.myHand = g.hand;
      var mine = seatOf(T.me.id); T.myHole = mine ? mine.hole.slice() : [];
      tr.send("state", msg);
      changed();
    }
    function botSeat() { return g.players.filter(function (p) { return p.bot; }).length; }
    function addBots(n) {
      var names = ["Ada", "Bruno", "Carla", "Dieter", "Edda", "Fiete", "Grete", "Hinnerk"], styles = ["solide", "wild", "vorsichtig"];
      for (var i = 0; i < n && g.players.length < T.settings.seats; i++) {
        var k = botSeat();
        P.addPlayer(g, {id: "bot-" + k + "-" + Math.random().toString(36).slice(2, 6), name: names[k % names.length] + " 🤖", stack: T.settings.chips, bot: {style: styles[k % 3]}, sitOut: g.street !== "idle" && g.street !== "done"});
      }
    }
    T.hostStart = async function (restore) {
      await ready;
      T.isHost = true; T.hostId = T.me.id;
      if (restore) {
        // Neuer Gastgeber: Stände vom Anfang der laufenden Hand, Karten werden neu gemischt.
        var mid = restore.street !== "done" && restore.street !== "idle";
        g = P.createGame({players: [], sb: restore.sb, bb: restore.bb, button: restore.button});
        g.hand = restore.hand; g.log = (restore.log || []).slice(-10);
        restore.players.forEach(function (p) {
          if (p.left) return;
          var s = P.addPlayer(g, {id: p.id, name: p.name, stack: mid && restore.startStacks ? restore.startStacks[p.id] : p.stack, bot: p.bot});
          if (!p.bot && !present[p.id]) { s.away = true; s.awaySince = timers.now(); }
        });
        g.log.push(mid ? "Neuer Gastgeber, die Hand wird neu gegeben." : "Neuer Gastgeber übernimmt den Tisch.");
        if (g.button >= g.players.length) g.button = -1;
      } else {
        g = P.createGame({players: [{id: T.me.id, name: T.me.name, stack: T.settings.chips}], sb: T.settings.sb, bb: T.settings.bb});
        addBots(T.settings.bots || 0);
      }
      await broadcast();
      if (restore) scheduleNext(2500);
    };
    async function onSit(m) {
      if (!m || !m.id || !m.pub) return;
      pubs[m.id] = m.pub; delete keys[m.id];
      var p = seatOf(m.id);
      if (p) { p.away = false; p.left = false; p.name = String(m.name || p.name).slice(0, 20); if (p.inHand && encHand === g.hand) encHand = -1; }
      else {
        if (g.players.filter(function (q) { return !q.bot; }).length >= T.settings.seats) { await broadcast(); return; }
        if (g.players.length >= T.settings.seats) { var b = g.players.filter(function (q) { return q.bot && !q.inHand; })[0] || null; if (b) removeSeat(b.id); else { await broadcast(); return; } }
        var mid = g.street !== "idle" && g.street !== "done";
        P.addPlayer(g, {id: m.id, name: String(m.name || "Gast").slice(0, 20), stack: T.settings.chips, sitOut: mid});
        g.log.push(String(m.name || "Gast").slice(0, 20) + " setzt sich an den Tisch.");
      }
      await broadcast();
      if (g.street === "idle" && T.settings.auto && P.canStart(g)) scheduleNext(1500);
    }
    function removeSeat(id) {
      var i = g.players.findIndex(function (p) { return p.id === id; });
      if (i < 0) return;
      g.players.splice(i, 1);
      if (g.button >= i) g.button--;
    }
    async function onAct(m) {
      if (!m || !m.id || !m.box) return;
      var k = await keyFor(m.id);
      if (!k) return;
      var a;
      try { a = await open(k, m.box); } catch (e) { return; }
      apply(m.id, a);
    }
    function apply(id, a) {
      var L = P.legal(g);
      // n: Zählerstand, den der Spieler gesehen hat. Doppelt geschickte oder veraltete Aktionen zählen nicht.
      if (!L || L.id !== id || a.hand !== g.hand || a.n !== (g.actions || 0)) return false;
      P.act(g, a.action, a.amount);
      afterAct();
      return true;
    }
    function afterAct() {
      timers.clear(turnTimer); timers.clear(botTimer); deadline = 0;
      if (g.street === "done") {
        broadcast();
        scheduleNext(T.settings.pause || 6000);
        return;
      }
      var p = g.players[g.toAct];
      if (p.bot) botTimer = timers.set(function () { var d = P.botDecide(g, null, T.settings.level === undefined ? 1 : T.settings.level); P.act(g, d.action, d.amount); afterAct(); }, T.settings.botDelay !== undefined ? T.settings.botDelay : 700 + Math.random() * 700);
      else if (p.away || p.left) botTimer = timers.set(function () { autoAct(); }, 400);
      else { deadline = timers.now() + (T.settings.turn || 30) * 1000; turnTimer = timers.set(autoAct, (T.settings.turn || 30) * 1000); }
      broadcast();
    }
    function autoAct() {
      var L = P.legal(g);
      if (!L) return;
      P.act(g, L.canCheck ? "check" : "fold");
      afterAct();
    }
    function scheduleNext(ms) {
      timers.clear(nextTimer);
      nextTimer = timers.set(function () { T.deal(); }, ms);
    }
    T.deal = function () {
      if (!T.isHost || T.closed || (g.street !== "done" && g.street !== "idle")) return false;
      // Aufräumen zwischen den Händen: Gegangene und lange Abwesende raus, Wartende rein, Nachkäufe gutschreiben.
      g.players.slice().forEach(function (p) {
        if (p.left || (p.away && p.awaySince && timers.now() - p.awaySince > 60000)) removeSeat(p.id);
        else if (p.bot && p.stack <= 0) removeSeat(p.id);
      });
      g.players.forEach(function (p) { p.sitOut = false; if (p.rebuy && p.stack <= 0) { p.stack = T.settings.chips; p.rebuy = false; g.log.push(p.name + " kauft nach."); } });
      if (T.settings.bots && g.players.length < T.settings.seats && g.players.filter(function (p) { return !p.bot; }).length + botSeat() < T.settings.seats && botSeat() < T.settings.bots) addBots(T.settings.bots - botSeat());
      if (!P.canStart(g)) { g.street = "idle"; g.result = null; broadcast(); return false; }
      T.settings.auto = true;
      P.startHand(g);
      afterAct();
      return true;
    };
    function onLeave(m) {
      var p = seatOf(m && m.id);
      if (!p) return;
      p.left = true;
      g.log.push(p.name + " steht auf.");
      if (!p.inHand || p.folded || g.street === "done" || g.street === "idle") { removeSeat(p.id); broadcast(); if (!P.canStart(g) && g.street === "idle") broadcast(); return; }
      var L = P.legal(g);
      if (L && L.id === p.id) autoAct(); else broadcast();
    }
    function onRebuy(m) { var p = seatOf(m && m.id); if (p && p.stack <= 0) { p.rebuy = true; broadcast(); if (g.street === "idle") scheduleNext(800); } }

    /* ----- Alle ----- */
    async function onState(m) {
      if (!m || !m.game) return;
      if (T.isHost && m.host !== T.me.id) {
        // Zwei Gastgeber (z. B. nach Netzaussetzer): der mit der kleineren Kennung behält den Tisch.
        if (m.host < T.me.id) { T.isHost = false; timers.clear(turnTimer); timers.clear(botTimer); timers.clear(nextTimer); } else return;
      }
      if (m.host !== T.hostId) { T.hostId = m.host; lastSeq = -1; hostKey = null; hostPubSeen = null; }
      if (m.seq <= lastSeq) return;
      lastSeq = m.seq;
      if (JSON.stringify(m.hostPub) !== hostPubSeen) { await ready; hostKey = await shared(kp.privateKey, m.hostPub); hostPubSeen = JSON.stringify(m.hostPub); }
      T.settings = m.settings; T.view = m.game;
      deadline = m.left ? timers.now() + m.left : 0;
      var seated = m.game.players.some(function (p) { return p.id === T.me.id; });
      if (seated) timers.clear(sitTimer);
      var box = m.enc && m.enc[T.me.id];
      var ok = false;
      if (box && T.myHand !== m.game.hand) {
        try { var x = await open(hostKey, box); if (x.hand === m.game.hand) { T.myHole = x.hole; T.myHand = x.hand; ok = true; } } catch (e) {}
      }
      var me = seated && m.game.players.filter(function (p) { return p.id === T.me.id; })[0];
      // Karten fehlen oder sind für einen alten Schlüssel (Seite neu geladen): neu melden, dann verschlüsselt der Gastgeber neu.
      if (me && me.inHand && !ok && T.myHand !== m.game.hand && m.game.street !== "done" && timers.now() - lastResit > 3000) { lastResit = timers.now(); sit(); }
      hostGoneSince = 0;
      changed();
    }
    function onPresence(map) {
      present = map;
      Object.keys(map).forEach(function (id) { if (map[id] && map[id].pub) pubs[id] = map[id].pub; });
      if (T.isHost && g) {
        var dirty = false;
        g.players.forEach(function (p) {
          if (p.bot || p.id === T.me.id) return;
          var here = !!map[p.id];
          if (!here && !p.away) { p.away = true; p.awaySince = timers.now(); dirty = true; var L = P.legal(g); if (L && L.id === p.id) { timers.clear(turnTimer); botTimer = timers.set(autoAct, 400); } }
          if (here && p.away) { p.away = false; dirty = true; }
        });
        if (dirty) broadcast();
        return;
      }
      if (T.hostId && !map[T.hostId] && T.view) checkHost();
    }
    function checkHost() {
      if (!hostGoneSince) hostGoneSince = timers.now();
      timers.set(function () {
        if (T.isHost || T.closed || !T.hostId || present[T.hostId] || !T.view) { hostGoneSince = 0; return; }
        var cand = T.view.players.filter(function (p) { return !p.bot && !p.left && p.id !== T.hostId && present[p.id]; }).map(function (p) { return p.id; });
        if (cand[0] === T.me.id) T.hostStart(T.view);
      }, 4000);
    }
    async function sit() {
      await ready;
      tr.send("sit", {id: T.me.id, name: T.me.name, pub: myPub});
    }
    T.join = async function () {
      await ready;
      tr.track({name: T.me.name, pub: myPub, at: timers.now()});
      if (T.isHost) return;
      var tries = 0;
      (function again() { if (T.closed || tries++ > 6) return; sit(); sitTimer = timers.set(again, 2500); })();
    };
    T.act = async function (action, amount) {
      if (!T.view) return;
      var a = {hand: T.view.hand, n: T.view.actions || 0, action: action, amount: amount};
      if (T.isHost) return apply(T.me.id, a);
      if (!hostKey) return;
      tr.send("act", {id: T.me.id, box: await seal(hostKey, a)});
    };
    T.rebuy = function () { if (T.isHost) onRebuy({id: T.me.id}); else tr.send("rebuy", {id: T.me.id}); };
    T.leave = function () {
      if (T.isHost) {
        // Gastgeber geht: Stand als „gegangen“ markieren, der Nächste übernimmt.
        var p = seatOf(T.me.id); if (p) p.left = true;
        broadcast();
      } else tr.send("leave", {id: T.me.id});
      T.close();
    };
    T.close = function () { T.closed = true; [turnTimer, botTimer, nextTimer, sitTimer].forEach(timers.clear); tr.close(); };
    T.game = function () { return g; };
    T.ready = ready;

    tr.onMessage(function (ev, m) {
      if (T.closed) return;
      if (ev === "state") onState(m);
      else if (!T.isHost) return;
      else if (ev === "sit") onSit(m);
      else if (ev === "act") onAct(m);
      else if (ev === "leave") onLeave(m);
      else if (ev === "rebuy") onRebuy(m);
      else if (ev === "hello" && g) broadcast();
    });
    tr.onPresence(onPresence);
    return T;
  }

  return {Table: Table, EVENTS: ["state", "sit", "act", "leave", "rebuy", "hello"], seal: seal, open: open, keyPair: keyPair, shared: shared, exportPub: exportPub};
})();
if (typeof module !== "undefined") module.exports = PokerNet;
