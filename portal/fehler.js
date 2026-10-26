// Fehler melden: schwebender Knopf 🐞 unten rechts auf dem Portal und auf allen Kursseiten.
// Der Workflow hängt dieses Skript beim Zusammenstellen an jede index.html an (siehe .github/workflows/speedreading-pages.yml).
// Meldungen landen in der Supabase-Tabelle fehlermeldungen (portal/supabase/0002_fehlermeldungen.sql).
// Das Portal setzt window.FEHLER_SB auf seinen Client, die Kurse bekommen einen eigenen mit derselben Anmeldung.
(function () {
  if (window.__fehlerKnopf) return;
  window.__fehlerKnopf = true;
  var me = document.currentScript, base = new URL(".", me && me.src || location.href).href;

  // Bereiche: Pfad unterhalb der Hauptadresse → Name. Der erste passende wird vorgewählt.
  var BEREICHE = [
    ["", "Portal / Dashboard"],
    ["lesen", "Lesetraining"],
    ["schach", "Schachtraining"],
    ["quiz", "Götterquiz"],
    ["wortwuerfel", "Wortwürfel"],
    ["murmelbahn", "Murmelbahn"],
    ["spiele", "Spiele"],
    ["flipper", "Flipper"],
    ["poker", "Poker"],
    ["vestaboard", "Vestaboard"],
    ["gesundheit", "Gesundheit"],
    ["huberman", "Huberman-Checkliste"],
    ["entspannung", "Entspannung"],
    ["weltkarte", "Weltkarte"],
    ["buecher", "Bücher"],
    ["sprachen", "Sprachen"],
    ["gevt", "Ving Tsun Wissen"],
    ["sonst", "Sonstiges / Idee"]
  ];
  function current() {
    var rest = location.href.indexOf(base) === 0 ? location.href.slice(base.length).split(/[?#]/)[0] : "";
    var first = rest.split("/")[0];
    if (!first || first === "index.html") return "";
    return BEREICHE.some(function (b) { return b[0] === first; }) ? first : "sonst";
  }
  function name(id) { var b = BEREICHE.filter(function (x) { return x[0] === id; })[0]; return b ? b[1] : id; }

  function load(src) {
    return new Promise(function (ok, bad) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
  }
  var sbp = null;
  function client() {
    if (window.FEHLER_SB) return Promise.resolve(window.FEHLER_SB);
    if (!sbp) sbp = (async function () {
      if (!window.SR_CONFIG) await load(base + "config.js");
      if (!window.supabase || !window.supabase.createClient) await load("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js");
      var c = window.SR_CONFIG || {};
      return window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey);
    })();
    return sbp;
  }

  var css = ".fm-btn{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483000;width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,0,0,.15);background:#fff;font-size:20px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);opacity:.6;padding:0}" +
    ".fm-btn:hover,.fm-btn:focus{opacity:1}" +
    ".fm-dlg{border:1px solid #D9DDD3;border-radius:14px;background:#F3F4EF;color:#1E241F;padding:0;width:min(520px,calc(100vw - 24px));max-height:calc(100vh - 40px);font:16px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    ".fm-dlg::backdrop{background:rgba(0,0,0,.45)}" +
    ".fm-dlg form,.fm-dlg .fm-list{display:flex;flex-direction:column;gap:12px;padding:16px}" +
    ".fm-dlg h2{margin:0;font-size:1.3rem}" +
    ".fm-dlg label{display:flex;flex-direction:column;gap:4px;font-weight:600;font-size:.9rem}" +
    ".fm-dlg select,.fm-dlg textarea,.fm-dlg input{font:inherit;font-weight:400;padding:10px;border-radius:8px;border:1px solid #D9DDD3;background:#fff;color:inherit;min-width:0}" +
    ".fm-dlg textarea{min-height:120px;resize:vertical}" +
    ".fm-dlg button{font:inherit;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #D9DDD3;background:#fff;color:inherit;cursor:pointer}" +
    ".fm-dlg button.p{background:#B3261E;border-color:#B3261E;color:#fff}" +
    ".fm-dlg button.s{padding:4px 10px;font-size:.85rem;font-weight:500}" +
    ".fm-dlg .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}" +
    ".fm-dlg .m{color:#5E6A61;font-size:.85rem;margin:0}" +
    ".fm-dlg img{max-width:100%;max-height:160px;border-radius:8px;border:1px solid #D9DDD3;align-self:flex-start}" +
    ".fm-dlg .it{background:#fff;border:1px solid #D9DDD3;border-radius:10px;padding:10px;font-size:.9rem}" +
    ".fm-dlg .it p{margin:4px 0 0;white-space:pre-wrap}" +
    "@media (prefers-color-scheme:dark){.fm-btn{background:#1E2420;border-color:#323A34}.fm-dlg{background:#151916;color:#E7EBE4;border-color:#323A34}.fm-dlg select,.fm-dlg textarea,.fm-dlg input,.fm-dlg button,.fm-dlg .it{background:#1E2420;border-color:#323A34}.fm-dlg button.p{background:#E0574C;border-color:#E0574C;color:#1A0E0D}.fm-dlg .m{color:#9AA69C}}" +
    "@media print{.fm-btn{display:none}}";

  function el(tag, attrs, kids) {
    var d = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === "text") d.textContent = attrs[k]; else if (k.slice(0, 2) === "on") d.addEventListener(k.slice(2), attrs[k]); else d.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c != null) d.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return d;
  }

  // Bild verkleinern: längste Seite höchstens 1280 px, als JPEG data:-URL.
  function shrink(file) {
    return new Promise(function (ok, bad) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, 1280 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var q = 0.75, out = c.toDataURL("image/jpeg", q);
        while (out.length > 900000 && q > 0.3) { q -= 0.15; out = c.toDataURL("image/jpeg", q); }
        ok(out);
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(new Error("Bild nicht lesbar")); };
      img.src = url;
    });
  }

  var dlg, shot = null;
  function geraet() {
    return navigator.userAgent + " · Bildschirm " + screen.width + "×" + screen.height + " · Fenster " + innerWidth + "×" + innerHeight + (matchMedia("(prefers-color-scheme: dark)").matches ? " · dunkel" : "");
  }
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    dlg = el("dialog", {class: "fm-dlg", "aria-label": "Fehler melden"});
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    document.body.appendChild(dlg);
  }
  function form() {
    shot = null;
    var sel = el("select", {}); BEREICHE.forEach(function (b) { sel.appendChild(el("option", {value: b[0], text: b[1]})); }); sel.value = current();
    var txt = el("textarea", {required: "required", maxlength: "5000", placeholder: "Was ist passiert? Was hast du erwartet? Auch Ideen und Wünsche sind willkommen."});
    var file = el("input", {type: "file", accept: "image/*"}), prev = el("img", {alt: "Screenshot", hidden: "hidden"});
    var msg = el("p", {class: "m", "aria-live": "polite"});
    file.addEventListener("change", async function () {
      shot = null; prev.hidden = true; if (!file.files[0]) return;
      msg.textContent = "Bild wird verkleinert …";
      try { shot = await shrink(file.files[0]); prev.src = shot; prev.hidden = false; msg.textContent = ""; } catch (e) { msg.textContent = "Das Bild ließ sich nicht lesen."; }
    });
    var go = el("button", {type: "submit", class: "p", text: "Absenden"});
    var f = el("form", {}, [
      el("div", {class: "row"}, [el("h2", {text: "🐞 Fehler melden"}), el("span", {style: "flex:1"}), el("button", {type: "button", class: "s", text: "Schließen", onclick: function () { dlg.close(); }})]),
      el("label", {}, ["Bereich", sel]),
      el("label", {}, ["Beschreibung", txt]),
      el("label", {}, ["Screenshot (optional)", file]), prev,
      el("p", {class: "m", text: "Seite, Gerät, Datum und deine E-Mail werden automatisch mitgeschickt."}),
      el("div", {class: "row"}, [go, el("button", {type: "button", class: "s", text: "Meine Meldungen", onclick: mine})]),
      msg
    ]);
    f.addEventListener("submit", async function (e) {
      e.preventDefault();
      var text = txt.value.trim(); if (!text) { msg.textContent = "Bitte beschreib kurz, was nicht stimmt."; return; }
      go.disabled = true; msg.textContent = "Wird gesendet …";
      try {
        var sb = await client(), s = await sb.auth.getSession();
        if (!s.data.session) { msg.textContent = "Bitte melde dich zuerst im Portal an."; go.disabled = false; return; }
        var r = await sb.from("fehlermeldungen").insert({bereich: name(sel.value), beschreibung: text, seite: location.href, geraet: geraet(), screenshot: shot});
        if (r.error) throw r.error;
        dlg.replaceChildren(el("div", {class: "fm-list"}, [
          el("h2", {text: "Danke!"}), el("p", {text: "Deine Meldung ist angekommen."}),
          el("div", {class: "row"}, [el("button", {type: "button", class: "p", text: "Schließen", onclick: function () { dlg.close(); }}), el("button", {type: "button", class: "s", text: "Meine Meldungen", onclick: mine})])
        ]));
      } catch (err) {
        go.disabled = false;
        msg.textContent = /fehlermeldungen|relation|schema cache/i.test(err.message || "") ? "Das Meldeformular ist noch nicht eingerichtet." : "Senden ging nicht: " + (err.message || err);
      }
    });
    dlg.replaceChildren(f);
    setTimeout(function () { txt.focus(); }, 50);
  }
  async function mine() {
    var box = el("div", {class: "fm-list"}, [el("div", {class: "row"}, [el("h2", {text: "Meine Meldungen"}), el("span", {style: "flex:1"}), el("button", {type: "button", class: "s", text: "Neue Meldung", onclick: form})]), el("p", {class: "m", text: "Lade …"})]);
    dlg.replaceChildren(box);
    try {
      var sb = await client(), s = await sb.auth.getSession(), uid = s.data.session && s.data.session.user.id;
      if (!uid) { box.lastChild.textContent = "Bitte melde dich zuerst im Portal an."; return; }
      var r = await sb.from("fehlermeldungen").select("id,created_at,bereich,beschreibung,status,notiz").eq("user_id", uid).order("created_at", {ascending: false}).limit(50);
      if (r.error) throw r.error;
      box.lastChild.remove();
      if (!r.data.length) box.appendChild(el("p", {class: "m", text: "Noch keine Meldungen."}));
      r.data.forEach(function (m) {
        box.appendChild(el("div", {class: "it"}, [
          el("b", {text: (m.status === "erledigt" ? "✅ " : "⏳ ") + m.bereich}), " ",
          el("span", {class: "m", text: new Date(m.created_at).toLocaleString("de-DE", {dateStyle: "short", timeStyle: "short"})}),
          el("p", {text: m.beschreibung}),
          m.notiz ? el("p", {class: "m", text: "Antwort: " + m.notiz}) : null
        ]));
      });
    } catch (err) { box.lastChild.textContent = "Laden ging nicht: " + (err.message || err); }
  }
  function open() { if (!dlg) build(); form(); if (!dlg.open) dlg.showModal(); }
  window.Fehler = {open: open};

  function start() {
    var b = el("button", {type: "button", class: "fm-btn", title: "Fehler melden", "aria-label": "Fehler melden", text: "🐞", onclick: open});
    if (!dlg) build();
    document.body.appendChild(b);
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
