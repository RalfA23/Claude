// Hosted mode: accounts and storage via Supabase, AI practice texts via the generate-text edge function.
// Without a config (config.js empty) the trainer runs fully local in the browser.
(function () {
  "use strict";
  if (!window.SR_HOSTED || !window.supabase) return;
  const cfg = window.SR_CONFIG;
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  let resolveReady;
  window.SR_READY = new Promise((r) => (resolveReady = r));
  let ready = false;

  function setup(user) {
    if (ready) return;
    ready = true;
    window.SR_STORAGE = {
      async load() {
        const { data, error } = await sb.from("progress").select("state").eq("user_id", user.id).maybeSingle();
        if (error) throw error;
        return data ? data.state : null;
      },
      async save(state) {
        const { error } = await sb.from("progress").upsert({ user_id: user.id, state, updated_at: new Date().toISOString() });
        if (error) throw error;
      },
    };
    window.SR_AI = {
      // The server builds the prompt itself; only the topic is sent.
      async generate(_prompt, opts) {
        const { data, error } = await sb.functions.invoke("generate-text", { body: { topic: opts && opts.topic } });
        if (error) throw error;
        return data;
      },
    };
    hideLogin();
    accountBar(user);
    resolveReady();
  }

  let overlay = null;
  function showLogin() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText = "position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:var(--paper,#f5f7fa)";
    overlay.innerHTML =
      '<form id="sr-login" style="max-width:380px;width:100%;display:flex;flex-direction:column;gap:12px;background:var(--card,#fff);border:1px solid var(--line,#dbe1ea);border-radius:14px;padding:20px;font-family:var(--f-ui,system-ui)">' +
      '<h2 style="margin:0;font-family:var(--f-read,Georgia,serif)">Anmelden</h2>' +
      '<p style="margin:0;color:var(--muted,#5a6475)">Der Trainer ist nur für eingeladene Personen. Gib deine E-Mail-Adresse ein, du bekommst einen Link, mit dem du dich ohne Passwort anmeldest. Dein Fortschritt wird dann auf allen Geräten gespeichert.</p>' +
      '<label for="sr-email" style="display:flex;flex-direction:column;gap:4px">E-Mail<input id="sr-email" type="email" required autocomplete="email" style="font:inherit;padding:10px;border-radius:8px;border:1px solid var(--line,#dbe1ea);background:var(--card,#fff);color:var(--ink,#1a2130)"></label>' +
      '<label style="display:flex;gap:8px;align-items:flex-start;font-size:.9rem"><input id="sr-consent" type="checkbox" required> <span>Ich habe die <a href="datenschutz.html" target="_blank">Datenschutzerklärung</a> gelesen und bin mindestens 16 Jahre alt.</span></label>' +
      '<button class="btn primary" type="submit">Anmeldelink schicken</button>' +
      '<p id="sr-login-msg" style="margin:0;color:var(--muted,#5a6475)" aria-live="polite"></p>' +
      "</form>";
    document.body.appendChild(overlay);
    overlay.querySelector("#sr-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = overlay.querySelector("#sr-email").value.trim();
      const msg = overlay.querySelector("#sr-login-msg");
      msg.textContent = "Einen Moment…";
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: false } });
      // Sign-ups are invite-only, so an unknown address is rejected by Supabase.
      msg.textContent = !error ? "Der Link ist unterwegs. Öffne ihn auf diesem Gerät."
        : /signup|not allowed|not found/i.test(error.message) ? "Diese E-Mail-Adresse ist nicht eingeladen."
        : "Das hat nicht geklappt: " + error.message;
    });
  }
  function hideLogin() {
    if (overlay) overlay.remove();
    overlay = null;
  }
  function accountBar(user) {
    const app = document.getElementById("app");
    if (!app || document.getElementById("sr-account")) return;
    const p = document.createElement("p");
    p.id = "sr-account";
    p.style.cssText = "margin:0;font-size:.8rem;color:var(--muted)";
    p.textContent = "Angemeldet als " + (user.email || "") + " · ";
    const out = document.createElement("button");
    out.className = "btn ghost";
    out.style.cssText = "min-height:0;padding:2px 8px;font-size:.8rem";
    out.textContent = "Abmelden";
    out.addEventListener("click", async () => {
      await sb.auth.signOut();
      location.reload();
    });
    p.appendChild(out);
    app.appendChild(p);
  }

  sb.auth.onAuthStateChange((_evt, session) => {
    if (session && session.user) setup(session.user);
  });
  window.addEventListener("DOMContentLoaded", async () => {
    const { data } = await sb.auth.getSession();
    if (data.session) setup(data.session.user);
    else showLogin();
  });
})();
