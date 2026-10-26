// Tonerkennung fürs Mikrofon: aus einem Betragsspektrum (WebAudio-Analyser, linear) wird für jeden Klavierton eine Stärke berechnet.
// Reine Funktionen, damit der Test (node --test) sie mit künstlichen Klängen prüfen kann.
//
// Stärke eines Tons = gewichtete Summe der Spitzen an Grundton und Obertönen (bis zum 6.), nach Abzug des Grundrauschens.
// Damit ein Oberton nicht als eigener Ton gilt: ab C3 muss der Grundton selbst hörbar sein, und ein Ton eine Oktave
// darunter mit kräftigem Grundton macht den oberen zum Verdachtsfall (er wird dann nur akzeptiert, wenn beide erwartet sind).

const TON_NAMEN = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "B", "H"];
const TON_KURZ = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const KLAVIER_MIN = 21, KLAVIER_MAX = 108;
const OBERTON_GEWICHT = [1, 0.8, 0.6, 0.5, 0.4, 0.3];

function tonFrequenz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function tonName(m) { return TON_NAMEN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }

// amp: lineare Beträge (Länge fftSize/2), floor: Grundrauschen gleicher Länge oder null.
// Ergebnis: {E, grund, max} mit E[m] = Stärke, grund[m] = Spitze am Grundton, max = stärkster Ton.
function tonStaerken(amp, floor, sampleRate, fftSize, opts) {
  opts = opts || {};
  const binHz = sampleRate / fftSize, n = amp.length, nyq = sampleRate / 2 * 0.9;
  const faktor = opts.rauschFaktor === undefined ? 2 : opts.rauschFaktor, gate = opts.gate || 0;
  // Spitzen im Spektrum: lokale Maxima über dem Rauschen, Frequenz per Parabel durch die Nachbarn (logarithmisch) genauer bestimmt.
  const pf = [], pv = [];
  for (let i = 2; i < n - 1; i++) {
    const a = amp[i];
    if (!(a >= amp[i - 1] && a > amp[i + 1])) continue;
    const v = a - (floor ? faktor * floor[i] : 0);
    if (v <= 0) continue;
    const l = Math.log(amp[i - 1] + 1e-12), c = Math.log(a + 1e-12), r = Math.log(amp[i + 1] + 1e-12), den = l - 2 * c + r;
    const d = den < 0 ? Math.max(-0.5, Math.min(0.5, 0.5 * (l - r) / den)) : 0;
    pf.push((i + d) * binHz); pv.push(v);
  }
  // Stärkste Spitze innerhalb von ±45 Cent um f
  const spitze = f => {
    const lo = f * 0.97435, hi = f * 1.02634;
    let a = 0, b = pf.length;
    while (a < b) { const mid = (a + b) >> 1; if (pf[mid] < lo) a = mid + 1; else b = mid; }
    let m = 0;
    for (let i = a; i < pf.length && pf[i] <= hi; i++) if (pv[i] > m) m = pv[i];
    return m;
  };
  const E = new Float32Array(128), grund = new Float32Array(128);
  let max = 0;
  for (let m = KLAVIER_MIN; m <= KLAVIER_MAX; m++) {
    const f0 = tonFrequenz(m);
    if (f0 > nyq) break;
    let e = 0, pmax = 0, p1 = 0;
    for (let k = 1; k <= OBERTON_GEWICHT.length; k++) {
      const f = f0 * k;
      if (f > nyq) break;
      const p = spitze(f);
      if (k === 1) p1 = p;
      if (p > pmax) pmax = p;
      e += OBERTON_GEWICHT[k - 1] * p;
    }
    grund[m] = p1;
    // Tiefe Klaviertöne haben einen schwachen Grundton, ab C3 muss er deutlich da sein.
    if (pmax <= gate || p1 < (m >= 48 ? 0.15 : 0.04) * pmax) continue;
    E[m] = e;
    if (e > max) max = e;
  }
  return {E, grund, max};
}

// Klingt m nur als Oberton eines tieferen Tons mit? Oktave darunter (2. Oberton) oder Duodezime darunter (3.) mit kräftigem Grundton.
function obertonVon(r, m) {
  const u = m - 12, d = m - 19;
  if (u >= KLAVIER_MIN && r.E[u] > 0 && r.grund[u] >= 0.5 * r.grund[m]) return u;
  if (d >= KLAVIER_MIN && r.E[d] > 0 && r.grund[d] >= 1.2 * r.grund[m]) return d;
  return 0;
}
function istOberton(r, m) { return obertonVon(r, m) > 0; }

// Ist Ton m zu hören? rel: Anteil an der Stärke des lautesten Tons. erwartet: Menge der gerade erwarteten Töne.
function tonDa(r, m, rel, erwartet) {
  if (!(r.E[m] > 0) || r.E[m] < rel * r.max) return false;
  const u = obertonVon(r, m);
  if (u && !(erwartet && erwartet.has(u))) return false;
  return true;
}

// Die hörbaren Töne, stärkste zuerst (für die Anzeige „Ich höre“).
function gehoerteToene(r, rel, maxAnzahl) {
  const liste = [];
  for (let m = KLAVIER_MIN; m <= KLAVIER_MAX; m++) if (r.E[m] > 0 && r.E[m] >= rel * r.max && !istOberton(r, m)) liste.push(m);
  return liste.sort((a, b) => r.E[b] - r.E[a]).slice(0, maxAnzahl || 4);
}
