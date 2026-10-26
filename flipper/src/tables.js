// Die Tische: Aufbau des oberen Spielfelds, Missionen, Texte fürs Punktedisplay und Farben.
// Der untere Teil (Flipper, Slingshots, In- und Outlanes, Abschussbahn) ist bei allen gleich (engine.js, frame).
(function (root) {
  "use strict";
  var F = typeof module !== "undefined" && module.exports ? require("./engine.js") : root.Flipper;

  var BASE_TEXTS = {
    multiball: "MULTIBALL", jackpot: "JACKPOT", superjackpot: "SUPER JACKPOT", save: "KUGEL GERETTET", tilt: "TILT",
    tiltWarn: "VORSICHT", extraball: "EXTRABALL", shootAgain: "NOCHMAL", skill: "SKILLSHOT", lock: "KUGEL GESPERRT",
    lockLit: "LOCK BEREIT", lanes: "BONUS", bank: "ZIELE KOMPLETT", wizard: "WIZARD-MODUS", ramp: "RAMPE", orbit: "ORBIT"
  };
  function texts(t) { var o = {}; for (var k in BASE_TEXTS) o[k] = BASE_TEXTS[k]; for (k in t || {}) o[k] = t[k]; return o; }

  F.TABLES = {
    /* ---------- 1. Klassik: Retro-Gerät mit Holz, Chrom und Glocken ---------- */
    klassik: {
      id: "klassik", name: "Goldene Ära", tag: "Klassischer Retro-Flipper", icon: "🎰",
      blurb: "Chrom, Holz und echte Glockentöne wie bei den Geräten aus den Siebzigern. A-B-C-Lanes für den Bonus-Multiplikator, vier Fallziele, Rampe und Spinner.",
      lanes: {xs: [215, 280, 345], guides: [182, 247, 312, 378], y0: 112, y1: 170, labels: ["A", "B", "C"]},
      bumpers: [{x: 215, y: 268, r: 28, label: "100"}, {x: 345, y: 268, r: 28, label: "100"}, {x: 280, y: 352, r: 28, label: "100"}],
      ramps: [{
        name: "Goldrampe",
        walls: [[105, 645, 105, 522], [160, 645, 160, 522], [105, 520, 160, 520]],
        entry: {x: 132, y: 552, r: 18},
        path: [[132, 545], [116, 430], [118, 320], [150, 225], [230, 188], [330, 192], [420, 232], [470, 320], [494, 450], [492, 600], [482, 735]],
        exit: {x: 482, y: 755, vx: 0, vy: 240}
      }],
      drops: [[470, 400, 470, 426], [470, 434, 470, 460], [470, 468, 470, 494], [470, 502, 470, 528]],
      walls: [[510, 392, 510, 536, {r: 3}]],
      standups: [[31, 340, 31, 366], [31, 380, 31, 406], [31, 420, 31, 446]],
      spinner: {x: 280, y: 540, w: 46, walls: [[252, 482, 252, 578], [308, 482, 308, 578]]},
      saucer: {x: 418, y: 342, vx: -230, vy: 300},
      orbit: {x: 46, y: 262, r: 22},
      missions: [
        {title: "Bumper-Fieber", text: "Triff die Pilzbumper", ev: "bumper", n: 25, points: 10000, reward: "lock"},
        {title: "Volltreffer", text: "Räum die Fallziele ab", ev: "bank", n: 2, points: 15000},
        {title: "Goldrampe", text: "Fahr die Rampe hoch", ev: "ramp", n: 3, points: 20000, reward: "multiball"},
        {title: "Spinner-Rausch", text: "Lass den Spinner drehen", ev: "spin", n: 40, points: 15000, reward: "extraball"},
        {title: "A-B-C", text: "Alle drei Lanes leuchten", ev: "lanes", n: 2, points: 25000}
      ],
      texts: texts({wizard: "GOLDRAUSCH", multiball: "GOLD-MULTIBALL"}),
      theme: {
        dmd: "#ff8a1e", bg: "#2a0d0b", rail: "#d9b46a", wall: "#e9d6a6", accent: "#e8b341", accent2: "#c8322b", light: "#ffd36b", off: "#5a2a1a",
        flipper: "#f4ecd8", flipperEdge: "#c8322b", bumper: "#c8322b", bumperCap: "#f4ecd8", ball: "#dcdcdc", ramp: "rgba(255,214,120,.22)", rampEdge: "#e8b341",
        font: "Georgia, 'Times New Roman', serif", sound: "chime", music: "swing"
      }
    },

    /* ---------- 2. Comic: Superhelden, Sprechblasen, Rasterpunkte ---------- */
    comic: {
      id: "comic", name: "Kapow City", tag: "Comic- und Nerd-Tisch", icon: "💥",
      blurb: "Superhelden-Comic mit Rasterpunkten und Sprechblasen: POW, BAM, ZAP. Besiege die Schurken, spiel N-E-R-D und hol dir den Team-Up-Multiball über die Heldenrampe.",
      lanes: {xs: [200, 253, 306, 359], guides: [174, 227, 280, 333, 386], y0: 106, y1: 165, labels: ["N", "E", "R", "D"]},
      bumpers: [{x: 205, y: 275, r: 26, label: "POW"}, {x: 330, y: 250, r: 26, label: "BAM"}, {x: 300, y: 362, r: 26, label: "ZAP"}, {x: 422, y: 330, r: 18, label: "20"}],
      ramps: [{
        name: "Heldenrampe",
        walls: [[392, 660, 392, 522], [448, 660, 448, 522], [392, 520, 448, 520]],
        entry: {x: 420, y: 552, r: 18},
        path: [[420, 545], [440, 430], [470, 320], [468, 222], [420, 152], [300, 122], [180, 150], [112, 240], [82, 380], [76, 560], [78, 735]],
        exit: {x: 78, y: 755, vx: 0, vy: 240}
      }],
      drops: [[75, 420, 75, 448], [75, 458, 75, 486], [75, 496, 75, 524]],
      standups: [[531, 400, 531, 426], [531, 440, 531, 466], [531, 480, 531, 506]],
      spinner: {x: 178, y: 576, w: 46, walls: [[150, 522, 150, 612], [206, 522, 206, 612]]},
      saucer: {x: 482, y: 250, vx: -280, vy: 220},
      orbit: {x: 46, y: 262, r: 22},
      missions: [
        {title: "Origin Story", text: "Besiege die drei Schurken", ev: "bank", n: 1, points: 10000, reward: "lock"},
        {title: "Trainingsmontage", text: "Verprügel die Bumper", ev: "bumper", n: 30, points: 12000},
        {title: "Team-Up", text: "Schwing dich die Heldenrampe hoch", ev: "ramp", n: 3, points: 20000, reward: "multiball"},
        {title: "Nerd-Wissen", text: "Leuchte N-E-R-D aus", ev: "lanes", n: 2, points: 18000},
        {title: "Endgegner", text: "Stürm das Geheimversteck", ev: "saucer", n: 3, points: 30000, reward: "extraball"},
        {title: "Fan-Service", text: "Sammle Comic-Hefte", ev: "standups", n: 2, points: 20000}
      ],
      texts: texts({multiball: "TEAM-UP!", jackpot: "KAPOW!", superjackpot: "MEGA KAPOW", save: "GERETTET!", wizard: "CROSSOVER", bank: "SCHURKEN BESIEGT", tilt: "HEY! TILT", skill: "HELDENSCHUSS", lanes: "NERD-BONUS"}),
      theme: {
        dmd: "#2fe6ff", bg: "#ffd21f", rail: "#111", wall: "#111", accent: "#e6007e", accent2: "#00a0e9", light: "#fff36b", off: "#7a5a00",
        flipper: "#ffffff", flipperEdge: "#111", bumper: "#e6007e", bumperCap: "#fff", ball: "#e8e8e8", ramp: "rgba(0,160,233,.25)", rampEdge: "#111",
        font: "'Bangers', 'Comic Sans MS', 'Chalkboard SE', Impact, sans-serif", sound: "cartoon", music: "funk"
      }
    },

    /* ---------- 3. Protokoll: Huberman-Tag von Morgenlicht bis Schlaf ---------- */
    huberman: {
      id: "huberman", name: "Protokoll", tag: "Huberman-Tisch", icon: "🌅",
      blurb: "Ein Tag nach den Huberman-Protokollen: Morgenlicht, Kältebad-Rampe mit Looping, Fokus-Spinner, Zone-2-Bumper und Schlaf als REM-Multiball. Der Himmel wandert mit dir durch den Tag.",
      lanes: {xs: [230, 290, 350], guides: [200, 260, 320, 380], y0: 112, y1: 170, labels: ["☀", "❄", "◎"]},
      bumpers: [{x: 215, y: 302, r: 30, label: "Z2"}, {x: 345, y: 302, r: 30, label: "Z2"}, {x: 280, y: 232, r: 22, label: "♥"}],
      ramps: [{
        name: "Kältebad",
        walls: [[100, 655, 100, 522], [155, 655, 155, 522], [100, 520, 155, 520]],
        entry: {x: 127, y: 552, r: 18},
        path: [[127, 545], [104, 452], [112, 402], [150, 374], [198, 386], [208, 430], [176, 458], [140, 440], [146, 398], [200, 352], [262, 262], [360, 240], [450, 290], [494, 420], [492, 600], [482, 735]],
        exit: {x: 482, y: 755, vx: 0, vy: 240}
      }],
      drops: [[212, 602, 240, 602], [248, 602, 276, 602], [284, 602, 312, 602], [320, 602, 348, 602]],
      standups: [[531, 390, 531, 416], [531, 430, 531, 456], [531, 470, 531, 496]],
      spinner: {x: 428, y: 560, w: 46, walls: [[400, 502, 400, 598], [456, 502, 456, 598]]},
      saucer: {x: 128, y: 262, vx: 300, vy: 140},
      orbit: {x: 46, y: 262, r: 22},
      missions: [
        {title: "Morgenlicht", text: "Hol dir Sonnenlicht: alle Lichtziele", ev: "bank", n: 1, points: 10000, done: "SONNE GETANKT"},
        {title: "Kältebad", text: "Ab ins Eis: Kältebad-Rampe", ev: "ramp", n: 2, points: 15000, reward: "lock", done: "DOPAMIN +250%"},
        {title: "Fokus-Block", text: "90 Minuten Fokus: Spinner", ev: "spin", n: 40, points: 15000, done: "DEEP WORK"},
        {title: "Zone 2", text: "Bewegung: Zone-2-Bumper", ev: "bumper", n: 30, points: 15000, reward: "extraball", done: "MITOCHONDRIEN"},
        {title: "NSDR", text: "Kurze Pause: NSDR-Ziele", ev: "standups", n: 1, points: 15000, done: "TIEF ENTSPANNT"},
        {title: "Schlaf", text: "Ab ins Bett: Schlafloch", ev: "saucer", n: 2, points: 25000, reward: "multiball", done: "REM-PHASE"}
      ],
      texts: texts({multiball: "REM-MULTIBALL", save: "NSDR-RETTUNG", wizard: "PERFEKTER TAG", jackpot: "DOPAMIN-JACKPOT", superjackpot: "MELATONIN-JACKPOT", lanes: "LICHT KÄLTE FOKUS", bank: "MORGENLICHT", skill: "SONNENAUFGANG", tilt: "CORTISOL TILT", lockLit: "SCHLAF BEREIT", lock: "MÜDE"}),
      theme: {
        dmd: "#ffe9c2", bg: "#1b2a3f", rail: "#e7eef2", wall: "#e7eef2", accent: "#f0a259", accent2: "#5fb3bf", light: "#ffe28a", off: "#304256",
        flipper: "#fafafa", flipperEdge: "#2f7f8c", bumper: "#2f7f8c", bumperCap: "#f6f3ea", ball: "#f2f2f2", ramp: "rgba(170,225,255,.28)", rampEdge: "#bfe8ff",
        font: "'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif", sound: "soft", music: "ambient", sky: true
      }
    },

    /* ---------- 4. Überraschung: Weltraum mit Schwerkraft und schwarzem Loch ---------- */
    weltraum: {
      id: "weltraum", name: "Orbit 9", tag: "Überraschung: Weltraum", icon: "🪐",
      blurb: "Ein Planet mit echter Schwerkraft zieht die Kugel an, ein schwarzes Loch schluckt sie und spuckt sie per Wurmloch woanders aus. Warp-Rampe, Pulsar-Spinner, Asteroiden. Synthwave inklusive.",
      lanes: {xs: [205, 258, 311, 364], guides: [178, 231, 284, 337, 390], y0: 108, y1: 166, labels: ["S", "T", "A", "R"]},
      bumpers: [{x: 280, y: 330, r: 34, kick: 560, label: ""}, {x: 180, y: 252, r: 20, label: ""}, {x: 392, y: 262, r: 20, label: ""}],
      attractors: [{x: 280, y: 330, R: 150, k: 1300}, {x: 150, y: 432, R: 105, k: 1700}],
      ramps: [{
        name: "Warp",
        walls: [[252, 665, 252, 542], [308, 665, 308, 542], [252, 540, 308, 540]],
        entry: {x: 280, y: 572, r: 18},
        path: [[280, 565], [282, 470], [330, 425], [420, 385], [478, 300], [470, 182], [400, 112], [300, 92], [190, 122], [112, 212], [80, 360], [75, 560], [78, 735]],
        exit: {x: 78, y: 755, vx: 0, vy: 240}
      }],
      drops: [[428, 420, 446, 440], [452, 446, 470, 466], [476, 472, 494, 492]],
      standups: [[31, 330, 31, 356], [31, 372, 31, 398]],
      spinner: {x: 188, y: 600, w: 46, walls: [[160, 545, 160, 635], [216, 545, 216, 635]]},
      saucer: {x: 150, y: 432, vx: -120, vy: 160, out: {x: 470, y: 200}},
      orbit: {x: 46, y: 262, r: 22},
      missions: [
        {title: "Mondlandung", text: "Lande auf den Monden", ev: "bumper", n: 20, points: 10000},
        {title: "Asteroidengürtel", text: "Spreng die Asteroiden", ev: "bank", n: 2, points: 15000, reward: "lock"},
        {title: "Warp-Antrieb", text: "Zünde die Warp-Rampe", ev: "ramp", n: 3, points: 20000, reward: "multiball"},
        {title: "Pulsar", text: "Bring den Pulsar auf Touren", ev: "spin", n: 50, points: 15000},
        {title: "Ereignishorizont", text: "Wirf ins schwarze Loch", ev: "saucer", n: 3, points: 30000, reward: "extraball"},
        {title: "Sternbild", text: "Leuchte S-T-A-R", ev: "lanes", n: 2, points: 20000}
      ],
      texts: texts({multiball: "WARP-MULTIBALL", save: "TRAKTORSTRAHL", wizard: "SUPERNOVA", jackpot: "HYPERJACKPOT", superjackpot: "SINGULARITÄT", bank: "ASTEROIDEN WEG", lanes: "STERNBILD", skill: "ORBIT ERREICHT", lock: "WURMLOCH"}),
      theme: {
        dmd: "#39ffb0", bg: "#07061a", rail: "#7a5cff", wall: "#9d86ff", accent: "#ff3df2", accent2: "#21d4fd", light: "#fff1a8", off: "#2a2450",
        flipper: "#eaf6ff", flipperEdge: "#21d4fd", bumper: "#21d4fd", bumperCap: "#0b0a24", ball: "#e9eef6", ramp: "rgba(255,61,242,.18)", rampEdge: "#ff3df2",
        font: "'Orbitron', 'Eurostile', 'Segoe UI', system-ui, sans-serif", sound: "synth", music: "synthwave"
      }
    }
  };
  F.TABLE_ORDER = ["klassik", "comic", "huberman", "weltraum"];
  if (typeof module !== "undefined" && module.exports) module.exports = F;
})(this);
