// Regenerates src/woerter.txt from the German word list for word games by Jan Enz (CC0, used by Tanglet):
// https://github.com/enz/german-wordlist. Only needed when the list should be refreshed; the build uses the committed file.
// Words are uppercased, ß becomes SS, only A–Z and ÄÖÜ, 3 to 16 letters. Stored sorted and front-coded:
// each line starts with one base-36 digit (letters shared with the previous word), followed by the rest of the word.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL = "https://raw.githubusercontent.com/enz/german-wordlist/master/words";
const raw = await (await fetch(URL)).text();
const words = [...new Set(raw.split("\n").map((w) => w.trim().toUpperCase().replaceAll("ß", "SS"))
  .filter((w) => /^[A-ZÄÖÜ]{3,16}$/.test(w)))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
let prev = "";
const lines = words.map((w) => {
  let k = 0;
  while (k < 35 && k < prev.length && prev[k] === w[k]) k++;
  prev = w;
  return k.toString(36) + w.slice(k);
});
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "src/woerter.txt"), lines.join("\n"));
console.log(`${words.length} Wörter geschrieben`);
