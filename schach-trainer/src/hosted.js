// Hosted mode: accounts and storage via Supabase (same project and login as the Speedreading-Trainer).
// Provides window.claude.use("db") with the small document API the trainer page expects, backed by the table schach_docs.
// Without a config (config.js empty) the page runs without saving and says so.
(function () {
  "use strict";
  if (!window.SCH_HOSTED || !window.supabase) return;
  const cfg = window.SR_CONFIG;
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  let resolveReady;
  window.SCH_READY = new Promise((r) => (resolveReady = r));
  let ready = false;

  // --- Document store -------------------------------------------------------------------------------------------
  function makeDb(user) {
    const cache = new Map(); // path -> data (latest known)
    const docListeners = new Map(); // path -> Set<{cb, err}>
    const colListeners = new Map(); // collection -> Set<{cb, err}>
    const snapOf = (path) => {
      const data = cache.get(path);
      return { id: path.split("/").pop(), exists: data !== undefined, data: () => data };
    };
    const inCollection = (name, path) => path.startsWith(name + "/") && path.indexOf("/", name.length + 1) === -1;
    const colSnap = (name) => {
      const docs = [];
      for (const [p, data] of cache) if (inCollection(name, p)) docs.push({ id: p.split("/").pop(), exists: true, data: () => data });
      return { docs, size: docs.length, empty: !docs.length };
    };
    const fire = (path) => {
      (docListeners.get(path) || []).forEach((l) => safe(() => l.cb(snapOf(path))));
      const name = path.split("/")[0];
      (colListeners.get(name) || []).forEach((l) => safe(() => l.cb(colSnap(name))));
    };
    const safe = (fn) => { try { fn(); } catch (e) { console.error(e); } };
    const fail = (set, e) => (set || []).forEach((l) => l.err && safe(() => l.err(e)));

    async function fetchPrefix(name) {
      const { data, error } = await sb.from("schach_docs").select("path,data").eq("user_id", user.id).like("path", name + "/%");
      if (error) throw error;
      const seen = new Set();
      for (const row of data) { cache.set(row.path, row.data); seen.add(row.path); }
      for (const p of [...cache.keys()]) if (inCollection(name, p) && !seen.has(p)) cache.delete(p);
      return data.map((r) => r.path);
    }
    async function fetchPath(path) {
      const { data, error } = await sb.from("schach_docs").select("data").eq("user_id", user.id).eq("path", path).maybeSingle();
      if (error) throw error;
      if (data) cache.set(path, data.data); else cache.delete(path);
    }
    async function write(path, data) {
      const { error } = await sb.from("schach_docs").upsert({ user_id: user.id, path, data, updated_at: new Date().toISOString() });
      if (error) throw error;
      cache.set(path, data);
      fire(path);
    }
    const plain = (o) => JSON.parse(JSON.stringify(o));

    async function refreshAll() {
      for (const [path, set] of docListeners) if (set.size) { try { await fetchPath(path); fire(path); } catch (e) { fail(set, e); } }
      for (const [name, set] of colListeners) if (set.size) { try { await fetchPrefix(name); fire(name + "/_"); } catch (e) { fail(set, e); } }
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshAll(); });
    setInterval(() => { if (!document.hidden) refreshAll(); }, 60000);

    function docRef(path) {
      return {
        id: path.split("/").pop(),
        async get() { await fetchPath(path); return snapOf(path); },
        async set(data) { await write(path, plain(data)); },
        async update(patch) { await fetchPath(path); await write(path, Object.assign({}, cache.get(path) || {}, plain(patch))); },
        async delete() {
          const { error } = await sb.from("schach_docs").delete().eq("user_id", user.id).eq("path", path);
          if (error) throw error;
          cache.delete(path); fire(path);
        },
        onSnapshot(cb, err) {
          const l = { cb, err };
          if (!docListeners.has(path)) docListeners.set(path, new Set());
          docListeners.get(path).add(l);
          fetchPath(path).then(() => safe(() => cb(snapOf(path)))).catch((e) => err && safe(() => err(e)));
          return () => docListeners.get(path).delete(l);
        },
      };
    }
    function colRef(name) {
      return {
        doc: (id) => docRef(name + "/" + id),
        async add(data) {
          const id = Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
          const ref = docRef(name + "/" + id);
          await ref.set(data);
          return ref;
        },
        async get() { await fetchPrefix(name); return colSnap(name); },
        onSnapshot(cb, err) {
          const l = { cb, err };
          if (!colListeners.has(name)) colListeners.set(name, new Set());
          colListeners.get(name).add(l);
          fetchPrefix(name).then(() => safe(() => cb(colSnap(name)))).catch((e) => err && safe(() => err(e)));
          return () => colListeners.get(name).delete(l);
        },
      };
    }
    // fire() for a collection refresh needs the path of a member only to find the collection name
    return { doc: docRef, collection: colRef };
  }

  function setup(user) {
    if (ready) return;
    ready = true;
    const db = makeDb(user);
    window.claude = Object.assign(window.claude || {}, { use: async (name) => (name === "db" ? db : null) });
    hideLogin();
    accountBar(user);
    resolveReady();
  }

  // --- Login (same accounts as the Speedreading-Trainer, invite code for new people) -----------------------------
  let overlay = null;
  function showLogin() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText = "position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:#F3F4EF";
    const field = "font:inherit;padding:10px;border-radius:8px;border:1px solid #D9DDD3;background:#fff;color:#1E241F";
    const btn = "font:inherit;font-weight:600;padding:10px 16px;border-radius:6px;border:1px solid #D9DDD3;background:#fff;color:#1E241F;cursor:pointer";
    overlay.innerHTML =
      '<form id="sch-login" style="max-width:380px;width:100%;display:flex;flex-direction:column;gap:12px;background:#fff;border:1px solid #D9DDD3;border-radius:12px;padding:20px;font-family:system-ui,sans-serif;color:#1E241F">' +
      '<h2 style="margin:0">Anmelden</h2>' +
      '<p style="margin:0;color:#5E6A61">Das Schachtraining ist nur für eingeladene Personen. Dein Fortschritt wird auf allen Geräten gespeichert. Das Konto ist dasselbe wie beim Lesetraining.</p>' +
      '<label for="sch-email" style="display:flex;flex-direction:column;gap:4px">E-Mail<input id="sch-email" type="email" required autocomplete="username" style="' + field + '"></label>' +
      '<label for="sch-pass" style="display:flex;flex-direction:column;gap:4px">Passwort<input id="sch-pass" type="password" autocomplete="current-password" style="' + field + '"></label>' +
      '<label id="sch-code-row" for="sch-code" hidden style="flex-direction:column;gap:4px">Einladungscode<input id="sch-code" type="text" autocomplete="off" autocapitalize="off" style="' + field + '"></label>' +
      '<label style="display:flex;gap:8px;align-items:flex-start;font-size:.9rem"><input id="sch-consent" type="checkbox" required> <span>Ich habe die <a href="../datenschutz.html" target="_blank">Datenschutzerklärung</a> gelesen und bin mindestens 16 Jahre alt.</span></label>' +
      '<button type="submit" id="sch-submit" style="' + btn + ';background:#B3261E;border-color:#B3261E;color:#fff">Anmelden</button>' +
      '<button type="button" id="sch-toggle" style="' + btn + ';border-color:transparent">Neu hier? Mit Einladungscode registrieren</button>' +
      '<p id="sch-msg" style="margin:0;color:#5E6A61" aria-live="polite"></p>' +
      "</form>";
    document.body.appendChild(overlay);
    const q = (id) => overlay.querySelector(id);
    const msg = q("#sch-msg");
    let signup = false;
    q("#sch-toggle").addEventListener("click", () => {
      signup = !signup;
      q("#sch-code-row").hidden = !signup;
      q("#sch-code-row").style.display = signup ? "flex" : "";
      q("#sch-submit").textContent = signup ? "Registrieren" : "Anmelden";
      q("#sch-toggle").textContent = signup ? "Schon registriert? Anmelden" : "Neu hier? Mit Einladungscode registrieren";
      q("#sch-pass").autocomplete = signup ? "new-password" : "current-password";
      msg.textContent = "";
    });
    q("#sch-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = q("#sch-email").value.trim(), password = q("#sch-pass").value;
      if (signup) {
        const code = q("#sch-code").value.trim();
        if (!code) return void (msg.textContent = "Bitte gib deinen Einladungscode ein.");
        if (password.length < 8) return void (msg.textContent = "Das Passwort braucht mindestens 8 Zeichen.");
        msg.textContent = "Einen Moment…";
        const { error } = await sb.auth.signUp({ email, password, options: { data: { invite_code: code } } });
        if (error) msg.textContent = /already registered/i.test(error.message) ? "Diese E-Mail ist schon registriert. Bitte melde dich an."
          : /database error|invite|not allowed|signups/i.test(error.message) ? "Der Einladungscode stimmt nicht oder ist abgelaufen."
          : "Das hat nicht geklappt: " + error.message;
        return;
      }
      if (!password) return void (msg.textContent = "Bitte gib dein Passwort ein.");
      msg.textContent = "Einen Moment…";
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) msg.textContent = /invalid login/i.test(error.message) ? "E-Mail oder Passwort stimmt nicht." : "Das hat nicht geklappt: " + error.message;
    });
  }
  function hideLogin() { if (overlay) overlay.remove(); overlay = null; }
  function accountBar(user) {
    if (document.getElementById("sch-account")) return;
    const p = document.createElement("p");
    p.id = "sch-account";
    p.style.cssText = "margin:0;padding:8px 16px;font:13px system-ui,sans-serif;opacity:.75;text-align:center";
    p.innerHTML = '<a href="../" style="color:inherit">Zum Lernportal</a> · ';
    p.appendChild(document.createTextNode("Angemeldet als " + (user.email || "") + " · "));
    const out = document.createElement("button");
    out.style.cssText = "font:inherit;padding:2px 8px;border:1px solid #D9DDD3;border-radius:6px;background:transparent;color:inherit;cursor:pointer";
    out.textContent = "Abmelden";
    out.addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });
    p.appendChild(out);
    document.body.appendChild(p);
  }

  sb.auth.onAuthStateChange((_evt, session) => { if (session && session.user) setup(session.user); });
  window.addEventListener("DOMContentLoaded", async () => {
    const { data } = await sb.auth.getSession();
    if (data.session) setup(data.session.user);
    else showLogin();
  });
})();
