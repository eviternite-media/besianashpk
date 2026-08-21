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
  return `${product.name}: çfarë bën, pse nevojitet dhe ku blihet`;
}

export function articleExcerpt(product: Product): string {
  return `Udhëzues i plotë për ${product.name}: përdorimi, rëndësia, përfitimet, specifikimet dhe ku mund të blihet në Kosovë nga BESIANA Sh.P.K.`;
}

type CategoryLongCopy = {
  job: string;
  need: string;
  value: string;
  wrongChoice: string;
};

const categoryLongCopy: Record<string, CategoryLongCopy> = {
  "Vetura dhe automjete të lehta": {
    job: "lubrifikon pjesët lëvizëse të motorit, ndihmon largimin e nxehtësisë dhe mban nën kontroll fërkimin, konsumimin dhe depozitat",
    need: "motori punon me toleranca të ngushta dhe kërkon viskozitet e standarde që përputhen me projektimin e tij dhe me sistemet e trajtimit të gazrave",
    value: "një vaj i zgjedhur saktë ndihmon ndezjen, pastërtinë, mbrojtjen në temperaturë pune dhe ruajtjen e performancës gjatë intervalit të servisit",
    wrongChoice: "një gradë ose standard i papërshtatshëm mund të dobësojë lubrifikimin, të ndikojë sistemet DPF/katalizator dhe të dalë jashtë kërkesës së prodhuesit",
  },
  "Kamionë dhe automjete të rënda": {
    job: "mbron motorët dizel të flotave nga bloza, fërkimi, temperaturat e larta dhe ngarkesat e vazhdueshme",
    need: "kamionët dhe pajisjet e rënda punojnë gjatë, me ngarkesë dhe shpesh në kushte ku ndalesa e paplanifikuar kushton shumë",
    value: "stabiliteti i vajit, kontrolli i blozës dhe përputhja me standardin e motorit mbështesin besueshmërinë dhe planifikimin e mirëmbajtjes",
    wrongChoice: "produkti i gabuar mund të mos përballojë ngarkesën, intervalin ose sistemin e emetimeve të motorit përkatës",
  },
  Motoçikleta: {
    job: "lubrifikon motorin me rrotullime të larta dhe, kur kërkohet, punon në harmoni me kutinë dhe tufën e lagësht",
    need: "motorët e motoçikletave kanë ngarkesa specifike, temperatura të larta dhe kërkesa të veçanta për fërkimin e tufës",
    value: "formulimi i duhur mbështet ndërrimin e marsheve, reagimin e motorit dhe mbrojtjen gjatë përdorimit rrugor ose intensiv",
    wrongChoice: "vajrat pa standardin e kërkuar mund të ndikojnë tufën, kutinë ose mbrojtjen e motorit",
  },
  Transmision: {
    job: "lubrifikon ingranazhet, kushinetat dhe elementet e kontrollit të transmisionit, duke menaxhuar fërkimin dhe nxehtësinë",
    need: "çdo kuti automatike, manuale, diferencial ose final drive kërkon kimi dhe viskozitet të caktuar",
    value: "lëngu i saktë ndihmon ndërrime të qëndrueshme, mbrojtje nga konsumimi dhe funksionim të parashikueshëm nën ngarkesë",
    wrongChoice: "një specifikim i gabuar mund të shkaktojë sjellje jo të rregullt, konsumim ose papajtueshmëri me materialet e sistemit",
  },
  Bujqësi: {
    job: "mbron motorin, transmisionin, hidraulikën ose sistemin e përcaktuar të makinerisë bujqësore gjatë punës sezonale",
    need: "traktorët dhe korrëset punojnë me ngarkesë, pluhur, ndryshime temperature dhe afate ku pajisja duhet të jetë në dispozicion",
    value: "produkti i përshtatshëm ndihmon vazhdimësinë e punës dhe mbrojtjen e sistemeve gjatë cikleve të gjata",
    wrongChoice: "përdorimi jashtë standardit të manualit mund të ndikojë motorin, frenat e lagështa, hidraulikën ose transmisionin",
  },
  Kopshtari: {
    job: "lubrifikon motorët e vegjël, zinxhirët dhe mekanizmat e pajisjeve të kopshtit sipas aplikimit",
    need: "pajisjet kompakte punojnë me shpejtësi të lartë dhe kërkojnë produkt të përshtatur për 2T, 4T, zinxhir ose mekanizmin përkatës",
    value: "lubrifikimi i duhur ndihmon lëvizjen e lirë, mbrojtjen e pjesëve dhe funksionimin e rregullt të pajisjes",
    wrongChoice: "raporti, lloji ose viskoziteti i gabuar mund të dëmtojë performancën dhe jetëgjatësinë e pajisjes",
  },
  Ndërtimtari: {
    job: "mbron komponentët e makinerive të ndërtimit dhe pajisjeve jashtë rruge nën goditje, ngarkesë dhe temperaturë",
    need: "ekskavatorët, ngarkuesit dhe makineritë e kantierit punojnë në mjedise të vështira ku konsumimi dhe ndalesat kanë kosto të lartë",
    value: "rezistenca nën ngarkesë dhe përputhja me sistemin ndihmojnë mbrojtjen dhe ritmin e punës së pajisjes",
    wrongChoice: "një vaj që nuk plotëson kërkesën e kutisë, diferencialit ose hidraulikës mund të ulë mbrojtjen dhe kontrollin e fërkimit",
  },
  "Prodhim energjie": {
    job: "lubrifikon motorët stacionarë dhe njësitë e prodhimit të energjisë gjatë punës së vazhdueshme",
    need: "gjeneratorët kanë orë të gjata pune, temperatura të qëndrueshme të larta dhe kërkesa të veçanta sipas karburantit",
    value: "kontrolli i oksidimit, depozitave dhe konsumimit mbështet pastërtinë e motorit dhe planifikimin e intervaleve të mirëmbajtjes",
    wrongChoice: "produkti i papërshtatshëm për gaz, biogaz, dizel ose standardin e njësisë mund të kufizojë mbrojtjen",
  },
  Industri: {
    job: "krijon filmin lubrifikues ose kryen funksionin teknik të kërkuar në hidraulikë, kompresorë, ingranazhe dhe procese prodhuese",
    need: "pajisjet industriale varen nga viskoziteti, qëndrueshmëria dhe përputhja me materialet e sistemit",
    value: "zgjedhja sipas ISO/DIN dhe kushteve reale ndihmon efikasitetin, mbrojtjen e sipërfaqeve dhe vazhdimësinë e prodhimit",
    wrongChoice: "një produkt i pasaktë mund të ndikojë presionin, temperaturën, filtrimin, ndarjen e ujit ose mbrojtjen e komponentëve",
  },
  Graso: {
    job: "qëndron në pikën e lubrifikimit dhe mbron kushinetat, nyjet e sipërfaqet ku vaji i lëngshëm nuk është zgjidhja e duhur",
    need: "ngarkesa, shpejtësia, temperatura, uji dhe intervali i rilyerjes kërkojnë trashësues dhe klasë NLGI të përshtatshme",
    value: "aderimi dhe qëndrueshmëria e duhur ndihmojnë mbajtjen e filmit mbrojtës dhe zvogëlimin e konsumimit",
    wrongChoice: "përzierja e grasove të papajtueshme ose klasa e gabuar mund të ndryshojë konsistencën dhe mbrojtjen",
  },
  "Lëngje teknike": {
    job: "kryen funksionin e posaçëm të sistemit, si ftohja, frenimi, pastrimi, trajtimi i emetimeve ose mirëmbajtja teknike",
    need: "këto sisteme varen nga përbërja, përqendrimi dhe standardi i saktë, jo vetëm nga emri i përgjithshëm i produktit",
    value: "produkti i duhur ndihmon funksionimin e sigurt dhe të qëndrueshëm të sistemit për të cilin është projektuar",
    wrongChoice: "përdorimi në rezervuarin ose sistemin e gabuar mund të shkaktojë mosfunksionim ose dëmtim",
  },
};

function getCategoryLongCopy(category: string): CategoryLongCopy {
  return categoryLongCopy[category] ?? {
    job: "kryen lubrifikimin dhe mbrojtjen e aplikimit të përcaktuar në dokumentacionin teknik",
    need: "pajisja kërkon produkt me viskozitet, kimi dhe standard të përshtatshëm",
    value: "përputhja e saktë mbështet mbrojtjen dhe funksionimin e qëndrueshëm",
    wrongChoice: "produkti i gabuar mund të mos ofrojë mbrojtjen e kërkuar nga prodhuesi",
  };
}

export function productStrengths(product: Product): string[] {
  const source = `${product.descriptionSource ?? ""} ${product.specifications.join(" ")}`.toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/fully synthetic|synthetic/, "Formulim sintetik për stabilitet dhe mbrojtje në një gamë të gjerë temperaturash"],
    [/low[- ]?saps|mid[- ]?saps/, "Teknologji SAPS e kontrolluar për sisteme moderne të trajtimit të emetimeve, kur kërkohet nga prodhuesi"],
    [/fuel economy|fuel saving/, "Formulim i orientuar drejt efikasitetit dhe ekonomisë së karburantit"],
    [/anti[- ]?wear|wear protection|resistant to wear/, "Aditivë kundër konsumimit për mbrojtjen e sipërfaqeve nën ngarkesë"],
    [/oxidation|oxidative/, "Rezistencë ndaj oksidimit për qëndrueshmëri më të mirë gjatë përdorimit"],
    [/detergent|dispersant|cleaner engines|keeps?.*clean/, "Veprim detergjent dhe shpërndarës për kontrollin e papastërtive dhe depozitave"],
    [/extreme pressure|\bep\b/, "Mbrojtje EP për kontakte dhe ngarkesa të larta mekanike"],
    [/water[- ]?washout|water resistance|resistance to water/, "Rezistencë ndaj ujit për ruajtjen e filmit mbrojtës në kushte të lagështa"],
    [/biodegradable|eco-friendly/, "Karakteristika të orientuara drejt uljes së ndikimit mjedisor sipas përshkrimit zyrtar"],
    [/corrosion|rust/, "Mbrojtje kundër korrozionit dhe ndryshkut"],
    [/friction control|friction modifier/, "Kontroll i fërkimit i përshtatur për funksionimin e sistemit"],
    [/wet clutch/, "Përputhshmëri me tufë të lagësht kur këtë e kërkon aplikimi"],
    [/wet brake/, "Karakteristika fërkimi për sisteme me frena të lagështa"],
    [/seal compatibility|seal\/metal compatibility/, "Përputhshmëri e deklaruar me vulat dhe materialet e sistemit"],
    [/thermal|high temperature|high-temperature/, "Qëndrueshmëri termike për punë në temperatura të larta"],
    [/shear/, "Stabilitet ndaj prerjes për ruajtjen e karakteristikave nën stres mekanik"],
    [/extended.*interval|extend.*oil change|long drain/, "Potencial për intervale të optimizuara vetëm kur lejohet nga prodhuesi dhe analiza e përdorimit"],
    [/dpf|after[- ]?treatment/, "Formulim i përshtatur për automjete me sisteme pas-trajtimi, sipas specifikimit përkatës"],
    [/hybrid/, "I përshtatshëm për aplikime hibride kur plotësohen kërkesat OEM"],
    [/adhesion/, "Aderim i lartë në sipërfaqet metalike për qëndrueshmëri në pikën e lubrifikimit"],
    [/foam|foaming/, "Kontroll i shkumëzimit për punë më të qëndrueshme të sistemit"],
  ];
  const matched = rules.filter(([pattern]) => pattern.test(source)).map(([, text]) => text);
  return Array.from(new Set(matched.length ? matched : productBenefits(product))).slice(0, 6);
}

export function productArticleCopy(product: Product) {
  const category = getCategoryLongCopy(product.category);
  const strengths = productStrengths(product);
  const grade = product.grade ? ` me gradë ${product.grade}` : "";
  const specPreview = product.specifications.slice(0, 6).join(", ");
  const specificationProfile = product.specifications.length
    ? `Në dokumentacionin e katalogut janë regjistruar ${product.specifications.length} specifikime ose nivele performance. Ndër referencat e publikuara janë ${specPreview}. Këto të dhëna e bëjnë përzgjedhjen më të kontrollueshme, por secila duhet krahasuar me formulimin e saktë në manual dhe në fletën teknike më të fundit.`
    : "Për këtë produkt nuk është publikuar një listë e strukturuar specifikimesh në burimin e aksesuar. Prandaj përdorimi duhet konfirmuar nga etiketa, fleta teknike dhe rekomandimi i prodhuesit të pajisjes.";
  const buyingTerm = product.grade ? `${product.type.toLocaleLowerCase("sq")} ${product.grade} në Kosovë` : `${product.shortName} në Kosovë`;
  return {
    overview: [
      productDescription(product),
      `${product.name} nuk duhet zgjedhur vetëm nga emri ose ambalazhi. Vlera e tij vjen nga kombinimi i tipit ${product.type.toLocaleLowerCase("sq")}, gamës ${product.family}${grade}, profilit teknik të publikuar dhe përputhjes me aplikimin real. Ky udhëzues shpjegon çfarë pune kryen, pse nevojitet dhe si të verifikohet para blerjes.`,
    ],
    job: [
      `${product.name} ${category.job}. Në praktikë, ai krijon kushtet që komponentët të punojnë me më pak kontakt të drejtpërdrejtë, më shumë kontroll të temperaturës dhe mbrojtje të përshtatur për kategorinë “${product.category}”.`,
      `Roli i tij nuk është vetëm “të jetë vaj” ose “të jetë graso”. Ai duhet të ruajë karakteristikat e kërkuara gjatë ciklit të punës, të arrijë pikat kritike të lubrifikimit dhe të bashkëpunojë me materialet, filtrat, vulat ose mekanizmat e sistemit përkatës.`,
    ],
    need: [
      `${product.name} nevojitet sepse ${category.need}. ${category.value}. Kjo është veçanërisht e rëndësishme kur pajisja punon çdo ditë, nën ngarkesë ose në temperatura të ndryshueshme.`,
      `Mirëmbajtja me produktin e duhur është investim në parandalim. ${category.wrongChoice}. Për këtë arsye, grada ${product.grade || "dhe tipi i produktit"}, standardet dhe udhëzimi i prodhuesit duhen parë si një paketë e vetme vendimmarrjeje.`,
    ],
    strengths,
    whyGood: `Ajo që e bën ${product.name} zgjedhje të fortë nuk është një slogan i vetëm, por profili i tij i dokumentuar: ${strengths.map((item) => item.toLocaleLowerCase("sq")).join("; ")}. Këto karakteristika kanë vlerë vetëm kur përputhen me kërkesën teknike të automjetit ose pajisjes.`,
    specificationProfile,
    buying: [
      `Nëse po kërkoni ku mund të blini ${buyingTerm}, filloni me emrin e plotë të produktit, gradën, modelin dhe vitin e automjetit ose pajisjes. Kjo shmang ngatërrimin mes produkteve që kanë të njëjtën gradë, por standarde dhe përdorime të ndryshme.`,
      `BESIANA Sh.P.K. është distributori zyrtar i CYCLON në Kosovë dhe mund t’ju ndihmojë të kontrolloni produktin, paketimin dhe disponueshmërinë. Kontakti me distributorin lokal është i vlefshëm sidomos kur duhet dalluar një aprovim OEM nga një nivel performance ose rekomandim përdorimi.`,
    ],
    recommendation: `Rekomandimi ynë: për blerjen e ${product.name} në Kosovë, kontaktoni BESIANA Sh.P.K. Para porosisë dërgoni modelin, vitin, motorin ose sistemin, gradën dhe specifikimin e manualit. Ekipi i BESIANA Sh.P.K. ju ndihmon të identifikoni variantin e saktë CYCLON dhe të konfirmoni disponueshmërinë, duke e bërë zgjedhjen më të sigurt dhe më të argumentuar.`,
    faq: [
      { question: `Për çfarë përdoret ${product.name}?`, answer: `${product.name} është ${getCategoryCopy(product.category).noun}${grade} për ${getCategoryCopy(product.category).purpose}. Përdorimi përfundimtar konfirmohet sipas manualit dhe specifikimeve.` },
      { question: `Pse nevojitet ${product.name}?`, answer: `Nevojitet sepse ${category.need}. Produkti i saktë ndihmon mbrojtjen dhe funksionimin e qëndrueshëm të sistemit.` },
      { question: `Ku mund të blihet ${buyingTerm}?`, answer: `${product.name} mund të kërkohet te BESIANA Sh.P.K., distributori zyrtar i CYCLON në Kosovë. Kontaktoni ekipin për verifikimin e aplikimit, paketimit dhe disponueshmërisë.` },
    ],
  };
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
