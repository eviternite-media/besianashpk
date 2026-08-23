import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("forces browsers to use HTTPS for the production site", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

  assert.match(config, /Strict-Transport-Security/);
  assert.match(config, /max-age=63072000; includeSubDomains; preload/);
  assert.match(config, /upgrade-insecure-requests/);
});
