/* Konto und Speicher für die Trainingsseiten unter /gesundheit/.
   Anmeldung kommt vom Portal (config.js, Supabase), gespeichert wird in schach_docs
   unter gesundheit/<name> (nur ein Schrägstrich im Pfad). Ohne Konto oder Netz bleibt alles im Browser. */
(function () {
  "use strict";
  let sb = null, user = null, onState = () => {};
  const lk = p => "gesundheit-" + (user ? user.id : "anon") + "-" + p;
  const cacheIdx = () => lk("index");

  function readIdx() { try { return JSON.parse(localStorage.getItem(cacheIdx()) || "[]") || []; } catch (e) { return []; } }
  function writeIdx(a) { try { localStorage.setItem(cacheIdx(), JSON.stringify(a)); } catch (e) {} }
  function local(path, data) {
    try {
      if (data === undefined) { localStorage.removeItem(lk(path)); writeIdx(readIdx().filter(x => x !== path)); return; }
      localStorage.setItem(lk(path), JSON.stringify(data));
      const i = readIdx(); if (!i.includes(path)) { i.push(path); writeIdx(i); }
    } catch (e) {}
  }
  function localGet(path) { try { const v = localStorage.getItem(lk(path)); return v ? JSON.parse(v) : null; } catch (e) { return null; } }

  const Konto = {
    get user() { return user; },
    onState(fn) { onState = fn; },
    async init() {
      const c = window.SR_CONFIG || {};
      try {
        if (!c.supabaseUrl || !window.supabase) throw new Error("ohne Konfiguration");
        sb = window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey);
        const s = await sb.auth.getSession();
        user = s.data.session ? s.data.session.user : null;
      } catch (e) { user = null; }
      return user;
    },
    /* Alle Dokumente mit diesem Präfix, z. B. "gesundheit/ss." -> {pfad: daten}. */
    async list(prefix) {
      const out = {};
      for (const p of readIdx()) if (p.startsWith(prefix)) { const v = localGet(p); if (v !== null) out[p] = v; }
      if (!sb || !user) return out;
      try {
        const r = await sb.from("schach_docs").select("path,data").eq("user_id", user.id).like("path", prefix.replace(/[_%]/g, m => "\\" + m) + "%");
        if (r.error) throw r.error;
        const fresh = {};
        for (const row of r.data || []) fresh[row.path] = row.data;
        /* Lokal noch nicht hochgeladene Einträge behalten und nachschieben. */
        for (const p of Object.keys(out)) if (!(p in fresh) && localGet("pending:" + p)) { fresh[p] = out[p]; this.put(p, out[p]); }
        for (const p of Object.keys(out)) if (!(p in fresh)) local(p, undefined);
        for (const [p, v] of Object.entries(fresh)) local(p, v);
        onState("db");
        return fresh;
      } catch (e) { onState("error"); return out; }
    },
    async put(path, data) {
      local(path, data);
      if (!sb || !user) return false;
      try {
        local("pending:" + path, 1);
        const r = await sb.from("schach_docs").upsert({user_id: user.id, path, data, updated_at: new Date().toISOString()});
        if (r.error) throw r.error;
        local("pending:" + path, undefined);
        onState("db"); return true;
      } catch (e) { onState("error"); return false; }
    },
    async del(path) {
      local(path, undefined); local("pending:" + path, undefined);
      if (!sb || !user) return false;
      try { const r = await sb.from("schach_docs").delete().eq("user_id", user.id).eq("path", path); if (r.error) throw r.error; onState("db"); return true; }
      catch (e) { onState("error"); return false; }
    }
  };
  window.Konto = Konto;
})();
