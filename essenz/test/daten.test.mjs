import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/daten.json", import.meta.url), "utf8"));

test("Themen und Videos sind vollständig", () => {
  assert.ok(data.themen.length > 0);
  for (const t of data.themen) {
    assert.ok(t.id && t.title && t.icon, "Thema ohne id/title/icon");
    assert.ok(t.videos.length > 0, "leeres Thema " + t.id);
    for (const v of t.videos) {
      assert.ok(v.id && v.title && v.kern && v.url, "Video unvollständig: " + v.id);
      assert.match(v.url, /^https:\/\/produktivikus\.de\//);
      assert.ok(v.todos.length >= 1 && v.todos.length <= 8, "To-dos " + v.id);
      for (const x of v.todos) assert.ok(typeof x === "string" && x.length > 5 && x.length < 160, "To-do zu kurz/lang: " + v.id);
    }
  }
});

test("Video-IDs sind eindeutig", () => {
  const ids = data.themen.flatMap(t => t.videos.map(v => v.id));
  assert.equal(new Set(ids).size, ids.length);
});
