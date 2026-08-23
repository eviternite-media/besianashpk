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
  assert.match(html, /<title>BESIANA Sh\.P\.K\.<\/title>/i);
  assert.match(html, /<meta(?=[^>]*property=["']og:title["'])(?=[^>]*content=["']BESIANA Sh\.P\.K\.["'])[^>]*>/i);
  assert.match(html, /<link(?=[^>]*rel=["']canonical["'])(?=[^>]*href=["']https:\/\/www\.besianashpk\.com\/["'])[^>]*>/i);
  assert.match(html, /<link(?=[^>]*rel=["']icon["'])(?=[^>]*href=["']https:\/\/www\.besianashpk\.com\/favicon-besiana-144\.png["'])(?=[^>]*sizes=["']144x144["'])[^>]*>/i);
  assert.doesNotMatch(html, /Së shpejti/i);
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
  assert.match(articleHtml, /Çfarë pune kryen\?/i);
  assert.match(articleHtml, /Pse nevojitet\?/i);
  assert.match(articleHtml, /Pse është zgjedhje e mirë\?/i);
  assert.match(articleHtml, /Ku mund ta blini\?/i);
  assert.match(articleHtml, /Ku mund të blihet vaj motori 0W-30 në Kosovë\?/i);
  assert.match(articleHtml, /Rekomandimi ynë: për blerjen e CYCLON EVO V1 LL 0W-30 në Kosovë, kontaktoni BESIANA Sh\.P\.K\./i);
  assert.match(articleHtml, /"@type":"FAQPage"/i);
  assert.doesNotMatch(articleHtml, /Long Life mid-SAPS lubricant/i);

  const industrialArticleResponse = await worker.fetch(
    new Request("http://localhost/artikuj/cyclon-alucut-32", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const industrialArticleHtml = await industrialArticleResponse.text();
  assert.match(industrialArticleHtml, /pajisjet industriale varen nga viskoziteti/i);
  assert.match(industrialArticleHtml, /Ku mund të blihet lubrifikant industrial 32 në Kosovë\?/i);
  assert.match(industrialArticleHtml, /BESIANA Sh\.P\.K\., distributori zyrtar i CYCLON në Kosovë/i);

  const robotsResponse = await worker.fetch(
    new Request("http://localhost/robots.txt", { headers: { accept: "text/plain" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.match(await robotsResponse.text(), /https:\/\/www\.besianashpk\.com\/sitemap\.xml/i);
});
