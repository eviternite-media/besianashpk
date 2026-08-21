import rawProducts from "./products.json";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  family: string;
  grade?: string | null;
  category: string;
  type: string;
  descriptionSource?: string;
  benefitsSource?: string[];
  specifications: string[];
  packaging: string[];
  officialUrl: string;
  officialImage?: string;
  tds?: string | null;
  image?: string | null;
};

export const products = rawProducts as Product[];

type CategoryCopy = {
  noun: string;
  purpose: string;
  context: string;
  benefits: string[];
  angle: string;
};

const categoryCopy: Record<string, CategoryCopy> = {
  "Vetura dhe automjete të lehta": {
    noun: "vaj motori për vetura dhe automjete të lehta",
    purpose: "motorë të veturave dhe automjeteve të lehta",
    context: "llojin e motorit, sistemet e trajtimit të emetimeve dhe intervalin e servisit",
    benefits: ["Mbrojtje e motorit sipas kërkesës teknike", "Zgjedhje e saktë e gradës së viskozitetit", "Mbështetje për pastërtinë dhe qëndrueshmërinë e motorit"],
    angle: "vaj motori për vetura",
  },
  "Kamionë dhe automjete të rënda": {
    noun: "lubrifikant për motorë të automjeteve të rënda",
    purpose: "kamionë, flota dhe automjete komerciale",
    context: "ngarkesën, standardin e motorit, sistemet e emetimeve dhe intervalin e ndërrimit",
    benefits: ["Mbrojtje në punë me ngarkesë", "Stabilitet termik dhe kontroll i konsumimit", "Zgjedhje sipas standardit të flotës"],
    angle: "vaj për kamionë dhe flota",
  },
  "Motoçikleta": {
    noun: "vaj për motorë motoçikletash",
    purpose: "motoçikleta dhe aplikime të përcaktuara nga prodhuesi",
    context: "tipin e motorit, sistemin e tufës dhe gradën e kërkuar",
    benefits: ["Lubrifikim i qëndrueshëm i motorit", "Përshtatje me gradën e kërkuar", "Mbrojtje gjatë përdorimit të përditshëm ose intensiv"],
    angle: "vaj për motoçikleta",
  },
  Transmision: {
    noun: "lëng ose vaj transmisioni",
    purpose: "transmisione, diferenciale dhe sisteme të përcaktuara",
    context: "llojin e kutisë, specifikimin OEM dhe viskozitetin e kërkuar",
    benefits: ["Mbrojtje e komponentëve të transmisionit", "Funksionim i qëndrueshëm në ngarkesë", "Përzgjedhje sipas specifikimit të kutisë"],
    angle: "vaj transmisioni",
  },
  Bujqësi: {
    noun: "lubrifikant për makineri bujqësore",
    purpose: "traktorë, korrëse dhe pajisje bujqësore",
    context: "motorin, transmisionin, hidraulikën dhe kushtet sezonale të punës",
    benefits: ["Mbrojtje në punë të rëndë dhe sezonale", "Mbështetje për sistemet e makinerisë", "Zgjedhje sipas manualit të pajisjes"],
    angle: "vaj për makineri bujqësore",
  },
  Kopshtari: {
    noun: "lubrifikant për pajisje kopshti",
    purpose: "motorë, zinxhirë dhe pajisje të kopshtarisë",
    context: "tipin 2T/4T, metodën e përzierjes dhe kërkesën e prodhuesit",
    benefits: ["Lubrifikim i përshtatur për pajisje të vogla", "Mbrojtje e pjesëve lëvizëse", "Përdorim sipas raportit dhe udhëzimit të prodhuesit"],
    angle: "vaj për pajisje kopshti",
  },
  Ndërtimtari: {
    noun: "lubrifikant për makineri ndërtimi",
    purpose: "makineri ndërtimi, gurore dhe pajisje jashtë rruge",
    context: "ngarkesën, temperaturën, sistemin dhe specifikimin e prodhuesit",
    benefits: ["Mbrojtje në kushte të rënda pune", "Qëndrueshmëri nën ngarkesë", "Përzgjedhje sipas sistemit dhe pajisjes"],
    angle: "vaj për makineri ndërtimi",
  },
  "Prodhim energjie": {
    noun: "vaj për motorë dhe njësi të prodhimit të energjisë",
    purpose: "gjeneratorë dhe sisteme të prodhimit të energjisë",
    context: "karburantin, ngarkesën, orët e punës dhe kërkesën e prodhuesit",
    benefits: ["Mbrojtje gjatë punës së vazhdueshme", "Kontroll i depozitave dhe konsumimit", "Zgjedhje sipas llojit të gjeneratorit"],
    angle: "vaj për gjeneratorë",
  },
  Industri: {
    noun: "lubrifikant industrial",
    purpose: "sisteme hidraulike, kompresorë, ingranazhe dhe aplikime industriale",
    context: "standardin ISO/DIN, viskozitetin, temperaturën dhe materialet e sistemit",
    benefits: ["Mbrojtje e pajisjeve industriale", "Qëndrueshmëri gjatë cikleve të punës", "Përzgjedhje sipas standardit teknik"],
    angle: "lubrifikant industrial",
  },
  Graso: {
    noun: "graso profesionale",
    purpose: "kushineta, nyje, shasi dhe aplikime të tjera të lubrifikimit",
    context: "klasën NLGI, temperaturën, ngarkesën dhe ekspozimin ndaj ujit",
    benefits: ["Aderim dhe mbrojtje e sipërfaqeve", "Rezistencë sipas kushteve të aplikimit", "Përzgjedhje sipas klasës dhe ngarkesës"],
    angle: "graso profesionale",
  },
  "Lëngje teknike": {
    noun: "lëng teknik për automjete ose pajisje",
    purpose: "ftohje, frenim, pastrim dhe sisteme ndihmëse",
    context: "funksionin e sistemit, përqendrimin dhe udhëzimin e prodhuesit",
    benefits: ["Funksionim i besueshëm i sistemit përkatës", "Përdorim sipas etiketës dhe dokumentacionit", "Mbështetje profesionale për përzgjedhjen"],
    angle: "lëng teknik CYCLON",
  },
};

export function getCategoryCopy(category: string): CategoryCopy {
  return categoryCopy[category] ?? {
    noun: "produkt profesional CYCLON",
    purpose: "aplikimin e përcaktuar në dokumentacionin teknik",
    context: "specifikimin, gradën dhe udhëzimin e prodhuesit",
    benefits: ["Përdorim profesional", "Përzgjedhje sipas dokumentacionit", "Mbështetje lokale nga distributori"],
    angle: "produkt CYCLON",
  };
}

export function productDescription(product: Product): string {
  const copy = getCategoryCopy(product.category);
  const grade = product.grade ? ` me gradë ${product.grade}` : "";
  const series = product.family === "CYCLON" ? "nga linja e specializuar CYCLON" : `nga gama ${product.family} e CYCLON`;
  return `${product.name} është ${copy.noun} ${series}${grade}, i kategorizuar për ${copy.purpose}. Përputhshmëria duhet të kontrollohet sipas manualit dhe specifikimeve të automjetit ose pajisjes.`;
}

export function productCardDescription(product: Product): string {
  const grade = product.grade ? ` · ${product.grade}` : "";
  return `${product.type} nga gama ${product.family}${grade}. Të dhënat teknike dhe përputhshmëria verifikohen në faqen e produktit.`;
}

export function approvedSpecifications(product: Product): string[] {
  return product.specifications.filter((specification) => /\bapproved\b/i.test(specification));
}

export function performanceSpecifications(product: Product): string[] {
  return product.specifications.filter((specification) => !/\bapproved\b/i.test(specification));
}

export function articleTitle(product: Product): string {
  return `${product.name}: përdorimi, grada dhe specifikimet`;
}

export function articleExcerpt(product: Product): string {
  return `Udhëzues i verifikueshëm për ${product.name}, dokumentacionin zyrtar, paketimet dhe përzgjedhjen sipas kërkesës së prodhuesit.`;
}

export function articleTags(product: Product): string[] {
  return [product.family, product.grade || product.type, product.category].filter(Boolean);
}

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("sq")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9çë]+/g, "");
}

export function productSearchText(product: Product): string {
  return normalizeSearchText([
    product.name,
    product.shortName,
    product.family,
    product.grade,
    product.category,
    product.type,
    product.descriptionSource,
    ...(product.benefitsSource ?? []),
    ...product.specifications,
    ...product.packaging,
    ...articleKeywords(product),
    articleTitle(product),
    articleExcerpt(product),
    ...articleTags(product),
  ].filter(Boolean).join(" "));
}

export function productBenefits(product: Product): string[] {
  return getCategoryCopy(product.category).benefits;
}

export function productApplications(product: Product): string[] {
  const copy = getCategoryCopy(product.category);
  return [product.category, copy.purpose, `Verifikim sipas ${copy.context}`];
}

export function articleKeywords(product: Product): string[] {
  const copy = getCategoryCopy(product.category);
  return [
    `${product.name} në Kosovë`,
    `${copy.angle} ${product.shortName}`,
    `${product.family} ${product.grade ?? product.type} BESIANA`,
  ];
}

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const categoryOrder = [
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
];

const availableCategories = new Set(products.map((product) => product.category));
export const categories = [
  ...categoryOrder.filter((category) => availableCategories.has(category)),
  ...Array.from(availableCategories).filter((category) => !categoryOrder.includes(category)).sort(),
];
const availableFamilies = new Set(products.map((product) => product.family));
export const families = ["EVO", "ECO", "PRO", "MAX"].filter((family) => availableFamilies.has(family));
