#!/usr/bin/env python3
"""Import the public CYCLON catalogue into the local static data model.

The importer deliberately excludes the Marine and Leisure/Outboard archives,
plus dedicated maritime products that surface in another archive.
It reads official public product pages, preserves technical names/specifications,
and downloads the original packshot shown by CYCLON without editing the label.
"""

from __future__ import annotations

import concurrent.futures
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


BASE = "https://www.cyclon-lpc.com"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "products.json"
IMAGE_DIR = ROOT / "public" / "images" / "products"

CATEGORIES = {
    "passenger-light-duty": ("Vetura dhe automjete të lehta", "Vaj motori"),
    "trucks": ("Kamionë dhe automjete të rënda", "Vaj motori"),
    "moto": ("Motoçikleta", "Vaj për motoçikleta"),
    "transmission": ("Transmision", "Vaj transmisioni"),
    "agriculture": ("Bujqësi", "Vaj për makineri bujqësore"),
    "gardening": ("Kopshtari", "Vaj për pajisje kopshti"),
    "construction": ("Ndërtimtari", "Vaj për makineri ndërtimi"),
    "power-generation": ("Prodhim energjie", "Vaj për gjeneratorë"),
    "industrial": ("Industri", "Lubrifikant industrial"),
    "greases": ("Graso", "Graso"),
    "special-fluids": ("Lëngje teknike", "Lëng teknik"),
}

EXCLUDED_PRODUCT_SLUGS = {
    "aus-40",  # dedicated maritime-grade SCR fluid for vessels
}

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; CYCLON-Kosovo-catalogue-import/1.0)"}


def fetch(url: str, attempts: int = 3) -> str:
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=35) as response:
                return response.read().decode("utf-8", "replace")
        except Exception as exc:  # network retry only
            last = exc
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"Could not fetch {url}: {last}")


def clean(fragment: str) -> str:
    fragment = re.sub(r"<br\s*/?>", " ", fragment, flags=re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    return re.sub(r"\s+", " ", fragment).strip()


def match(pattern: str, text: str) -> str:
    found = re.search(pattern, text, flags=re.I | re.S)
    return clean(found.group(1)) if found else ""


def slugify(value: str) -> str:
    value = value.lower().replace("²", "2").replace("™", "")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def archive_cards(category_slug: str) -> list[dict]:
    cards: list[dict] = []
    seen: set[str] = set()
    for page in range(1, 40):
        suffix = "" if page == 1 else f"page/{page}/"
        url = f"{BASE}/cyclon_new_product_cat/{category_slug}/{suffix}"
        try:
            body = fetch(url)
        except RuntimeError as exc:
            if "404" in str(exc):
                break
            raise
        blocks = re.findall(
            r'<a\s+href="([^"]+/cyclon_new_product/[^"]+/)"\s+class="[^"]*product-card[^"]*">(.*?)</a>',
            body,
            flags=re.I | re.S,
        )
        fresh = 0
        for product_url, block in blocks:
            product_slug = urllib.parse.urlparse(product_url).path.rstrip("/").split("/")[-1]
            if product_slug in EXCLUDED_PRODUCT_SLUGS:
                continue
            if product_slug in seen:
                continue
            seen.add(product_slug)
            fresh += 1
            image = match(r'product-card__image.*?<img\s+src="([^"]+)"', block)
            range_name = match(r'<div\s+class="text-ms uppercase">(.*?)</div>', block)
            range_name = re.sub(r"^Cyclon\s*", "", range_name, flags=re.I).strip()
            title = match(r'product-card__title"[^>]*>(.*?)</div>', block)
            grade = match(r'product-card__grade"[^>]*>(.*?)</div>', block)
            summary = match(r'product-card__info"[^>]*>(.*?)</div>', block).removesuffix("...").strip()
            cards.append(
                {
                    "officialSlug": product_slug,
                    "officialUrl": product_url,
                    "range": range_name or "CYCLON",
                    "shortName": title,
                    "grade": grade,
                    "officialImage": image,
                    "officialSummary": summary,
                    "categorySlug": category_slug,
                }
            )
        if not blocks or fresh == 0:
            break
    return cards


def parse_product(card: dict) -> dict:
    body = fetch(card["officialUrl"])
    image = match(r'single-product-new__img-container.*?<img\s+src="([^"]+)"', body) or card["officialImage"]
    range_name = match(r'single-product-new__title"[^>]*>(.*?)</h1>', body)
    range_name = re.sub(r"^Cyclon\s*", "", range_name, flags=re.I).strip()
    grade = match(r'single-product-new__range-code"[^>]*>(.*?)</div>', body) or card["grade"]
    description = match(r'single-product-new__content"[^>]*>(.*?)</div>', body) or card["officialSummary"]
    bullets_block = match(r'single-product-new__bullets"[^>]*>(.*?)</div>', body)
    bullets = [clean(item) for item in re.findall(r"<li[^>]*>(.*?)</li>", bullets_block, flags=re.I | re.S)]
    specs = match(r'>\s*Specifications\s*</div>\s*<div\s+class="text-ms">(.*?)</div>', body)
    packaging = match(r'>\s*Packaging\s*</div>\s*<div\s+class="text-ms">(.*?)</div>', body)
    tds = match(r'single-product-new__technical-guides.*?<a\s+href="([^"]+)"', body)

    category, product_type = CATEGORIES[card["categorySlug"]]
    identity = range_name or " ".join(x for x in [card["range"], card["shortName"]] if x)
    if grade and not identity.upper().endswith(grade.upper()):
        identity = f"{identity} {grade}"
    name = f"CYCLON {identity}".replace("CYCLON CYCLON", "CYCLON").strip()
    site_slug = slugify(name)
    return {
        "slug": site_slug,
        "name": name,
        "shortName": card["shortName"],
        "family": card["range"] or (identity.split()[0] if identity else "CYCLON"),
        "grade": grade or None,
        "category": category,
        "type": product_type,
        "descriptionSource": description,
        "benefitsSource": bullets,
        "specifications": [clean(x) for x in specs.split(",") if clean(x)] if specs else [],
        "packaging": [clean(x) for x in packaging.split("|") if clean(x)] if packaging else [],
        "officialUrl": card["officialUrl"],
        "officialImage": image,
        "tds": tds or None,
    }


def download_image(product: dict) -> None:
    source = product.get("officialImage")
    if not source:
        product["image"] = None
        return
    source = urllib.parse.urljoin(BASE, source.strip())
    suffix = Path(urllib.parse.urlparse(source).path).suffix.lower()
    if suffix not in {".png", ".jpg", ".jpeg", ".webp"}:
        suffix = ".png"
    target = IMAGE_DIR / f"{product['slug']}{suffix}"
    try:
        if not target.exists():
            req = urllib.request.Request(source, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=45) as response:
                target.write_bytes(response.read())
        product["image"] = f"/images/products/{target.name}"
    except Exception as exc:
        print(f"WARN image {product['slug']}: {exc}", flush=True)
        product["image"] = None


def main() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    cards: dict[str, dict] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(archive_cards, category): category for category in CATEGORIES}
        for future in concurrent.futures.as_completed(futures):
            category = futures[future]
            result = future.result()
            for card in result:
                # Keep the first non-marine application as the primary category.
                cards.setdefault(card["officialSlug"], card)
            print(f"{category}: {len(result)} catalogue entries", flush=True)

    products: list[dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(parse_product, card): slug for slug, card in cards.items()}
        for index, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            try:
                products.append(future.result())
            except Exception as exc:
                print(f"WARN {futures[future]}: {exc}")
            if index % 25 == 0:
                print(f"Parsed {index}/{len(futures)} product pages")

    products.sort(key=lambda item: (item["category"], item["family"], item["name"]))
    # Keep a recoverable data checkpoint before the optional packshot downloads.
    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        list(pool.map(download_image, products))

    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(products)} unique non-marine products to {OUT}")


if __name__ == "__main__":
    main()
