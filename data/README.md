# Të dhënat e katalogut CYCLON

`products.json` është burimi i vetëm i të dhënave të produkteve në këtë faqe. Komponentët, filtrat, kërkimi, faqet e produkteve dhe artikujt lexojnë nga ky skedar për të shmangur kopjimin e të njëjtit informacion në disa vende.

Çdo hyrje ruan:

- identitetin e produktit (`slug`, `name`, `shortName`, `family`, `grade`);
- klasifikimin lokal (`category`, `type`);
- tekstin e publikuar nga prodhuesi (`descriptionSource`, `benefitsSource`);
- specifikimet dhe aprovimet në formulimin origjinal (`specifications`);
- paketimet e publikuara (`packaging`);
- URL-në zyrtare të produktit, imazhin zyrtar dhe TDS-në (`officialUrl`, `officialImage`, `tds`);
- packshot-in lokal të optimizuar (`image`).

Importuesi `scripts/import-cyclon-products.py` lexon vetëm faqet publike zyrtare në `cyclon-lpc.com`. Arkivat `Marine`, `Leisure/Outboard` dhe produkti detar `AUS 40` përjashtohen qëllimisht. Produktet shumëpërdorimëshe industriale që mund të kenë edhe aplikim ndihmës detar mbeten në kategorinë e tyre jo-detare. Nëse burimi zyrtar nuk publikon një fushë, ajo ruhet bosh dhe ndërfaqja e shënon si të papublikuar; nuk krijohen aprovime ose specifikime të supozuara.

Përditësimet duhet të rishikojnë manualisht diferencat para se të zëvendësojnë `products.json`, sidomos ndryshimet në statusin “approved”, URL-të e TDS-së dhe imazhet e paketimit.
