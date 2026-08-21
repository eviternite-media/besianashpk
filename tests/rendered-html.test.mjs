import assert from "node:assert/strict";
import test from "node:test";

test("renders production BESIANA metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Lubrifikantë CYCLON në Kosovë — BESIANA Sh\.P\.K\./i);
  assert.match(html, /<meta(?=[^>]*property=["']og:title["'])(?=[^>]*content=["']CYCLON Kosovo — BESIANA Sh\.P\.K\.["'])[^>]*>/i);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
  assert.match(html, /11 KATEGORI · (?:<!-- -->)?307(?:<!-- -->)? PRODUKTE JO-DETARE/i);
  assert.match(html, /Krijuar për(?:<br\s*\/?>)?performancë\./i);
  assert.match(html, /Performancë e verifikuar\./i);
  assert.doesNotMatch(html, /Siguri në çdo zgjedhje/i);
  assert.match(html, /Të gjitha 11 kategoritë/i);
  for (const category of [
    "Vetura dhe automjete të lehta",
    "Kamionë dhe automjete të rënda",
    "Motoçikleta",
    "Transmision",
    "Bujqësi",
    "Kopshtari",
    "Ndërtimtari",
    "Prodhim energjie",
    "Industri",
    "Graso",
    "Lëngje teknike",
  ]) {
    assert.match(html, new RegExp(category, "i"));
  }

  const catalogueResponse = await worker.fetch(
    new Request("http://localhost/produktet?category=Vetura%20dhe%20automjete%20t%C3%AB%20lehta&family=PRO", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const catalogueHtml = await catalogueResponse.text();
  const familySelect = catalogueHtml.match(/GAMA<select[^>]*>([\s\S]*?)<\/select>/i)?.[1] ?? "";
  const gradeSelect = catalogueHtml.match(/GRADA<select[^>]*>([\s\S]*?)<\/select>/i)?.[1] ?? "";
  assert.doesNotMatch(familySelect, />CYCLON</i);
  for (const family of ["EVO", "ECO", "PRO", "MAX"]) assert.match(familySelect, new RegExp(`>${family}<`, "i"));
  for (const grade of ["0W-30", "5W-30", "5W-40"]) assert.match(gradeSelect, new RegExp(`>${grade}<`, "i"));
  assert.doesNotMatch(gradeSelect, />680</i);
  assert.doesNotMatch(gradeSelect, />0W-16</i);

  const aboutResponse = await worker.fetch(
    new Request("http://localhost/rreth-nesh", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const aboutHtml = await aboutResponse.text();
  assert.doesNotMatch(aboutHtml, /<strong>Tërë Kosova<\/strong>/i);
  assert.doesNotMatch(aboutHtml, /<strong>Portofol profesional<\/strong>/i);
  assert.doesNotMatch(aboutHtml, /<h3>Teknologji<\/h3>/i);
  assert.doesNotMatch(aboutHtml, /<h3>Inovacion<\/h3>/i);
  assert.doesNotMatch(aboutHtml, /<h3>Mbështetje lokale<\/h3>/i);

  const noApprovalResponse = await worker.fetch(
    new Request("http://localhost/produktet/cyclon-premus-li-ca-3", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const noApprovalHtml = await noApprovalResponse.text();
  assert.match(noApprovalHtml, /është graso profesionale nga linja e specializuar CYCLON/i);
  assert.doesNotMatch(noApprovalHtml, /Premium quality, versatile, multipurpose/i);
  assert.doesNotMatch(noApprovalHtml, /href=["']#aprovimet["']/i);
  assert.doesNotMatch(noApprovalHtml, /id=["']aprovimet["']/i);
  assert.doesNotMatch(noApprovalHtml, /Aprovime të shënuara qartë/i);
  assert.doesNotMatch(noApprovalHtml, /Verifikoni dokumentacionin origjinal/i);

  const approvedResponse = await worker.fetch(
    new Request("http://localhost/produktet/cyclon-evo-v1-ll-0w-30", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const approvedHtml = await approvedResponse.text();
  assert.match(approvedHtml, /href=["']#aprovimet["']/i);
  assert.match(approvedHtml, /<h2>Aprovimet e publikuara\.<\/h2>/i);
  assert.doesNotMatch(approvedHtml, /Long Life mid-SAPS lubricant/i);

  const articleResponse = await worker.fetch(
    new Request("http://localhost/artikuj/cyclon-evo-v1-ll-0w-30", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const articleHtml = await articleResponse.text();
  assert.match(articleHtml, /është vaj motori për vetura dhe automjete të lehta/i);
  assert.doesNotMatch(articleHtml, /Long Life mid-SAPS lubricant/i);
});
