// Regenerates src/woerter.txt. Only needed when the list should be refreshed; the build uses the committed file.
// Words: German word list for word games by Jan Enz (CC0, used by Tanglet), https://github.com/enz/german-wordlist.
// Uppercased, ß becomes SS, only A–Z and ÄÖÜ, 3 to 16 letters.
// Common words are marked with the German frequency list from OpenSubtitles 2018 by Hermit Dave (CC BY-SA 4.0),
// https://github.com/hermitdave/FrequencyWords: a word counts as common from MIN_COUNT occurrences on.
// Rare words are still accepted in the game, but only common words are listed as "what was on the board".
// Stored sorted and front-coded: optional "*" for common, one base-36 digit (letters shared with the previous word),
// then the rest of the word. Because of the frequency marks the file is under CC BY-SA 4.0.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WORDS = "https://raw.githubusercontent.com/enz/german-wordlist/master/words";
const FREQ = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_full.txt";
const MIN_COUNT = 15;
const norm = (w) => w.trim().toUpperCase().replaceAll("ß", "SS");

const raw = await (await fetch(WORDS)).text();
const words = [...new Set(raw.split("\n").map(norm).filter((w) => /^[A-ZÄÖÜ]{3,16}$/.test(w)))]
  .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
const freq = new Map();
for (const line of (await (await fetch(FREQ)).text()).split("\n")) {
  const [w, n] = line.split(" ");
  if (w && n) freq.set(norm(w), (freq.get(norm(w)) || 0) + Number(n));
}
let prev = "", common = 0;
const lines = words.map((w) => {
  let k = 0;
  while (k < 35 && k < prev.length && prev[k] === w[k]) k++;
  prev = w;
  const c = (freq.get(w) || 0) >= MIN_COUNT;
  if (c) common++;
  return (c ? "*" : "") + k.toString(36) + w.slice(k);
});
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "src/woerter.txt"), lines.join("\n"));
console.log(`${words.length} Wörter geschrieben, davon ${common} gebräuchlich`);
