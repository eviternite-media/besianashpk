import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const products = JSON.parse(
  await readFile(new URL("../data/products.json", import.meta.url), "utf8"),
);

const excludedMarineTerms = /marine|detar|nautilus|armor medium|outboard|cybio-ob|aus 40/i;

test("catalogue includes the complete verified non-marine collection", () => {
  assert.equal(products.length, 307);
  assert.equal(new Set(products.map((product) => product.category)).size, 11);
  assert.equal(
    products.filter((product) => excludedMarineTerms.test([
      product.name,
      product.category,
      product.type,
      product.officialUrl,
    ].filter(Boolean).join(" "))).length,
    0,
  );
});
