#!/usr/bin/env node
/*
 * Automatische Prüfung der Sammlung – läuft bei jedem Pull Request (.github/workflows/pruefen.yml)
 * und lässt sich lokal starten (baut vorher mit werkzeuge/bauen.js nach _site/ und prüft dort):
 *   npm install --no-save playwright acorn && npx playwright install chromium
 *   node werkzeuge/pruefen/alles.js            (alles)
 *   node werkzeuge/pruefen/alles.js schnell    (ohne Browser: JavaScript, JSON, Verweise)
 * Die Seiten selbst brauchen keine Pakete; playwright und acorn werden nur für diese Prüfung geladen.
 *
 * Prüft:
 *  0. Quellen: keine gebauten Inhalte im Repository (SEO-Blöcke, „Passt dazu“, Listen, gebaute Dateien),
 *     damit sich Pull Requests nie gegenseitig Konflikte erzeugen; dann Bau nach _site/
 *  1. JavaScript aller Seiten und assets/*.js ist gültiges ES2015 (acorn)
 *  2. fragen.json, suchindex.json, manifest gültig; Seiten der Startseite in sitemap.xml und sw.js
 *  3. jede Seite bei 380 und 1280 px: keine JS- oder Konsolenfehler, kein seitlicher Überlauf,
 *     keine KaTeX-Fehler, keine Anfragen an fremde Adressen, kein NaN/Infinity/undefined im Text
 *  4. Lernbereich: je Schwierigkeit 25 zufällige Rechenaufgaben aus allen Themen; die angezeigte Lösung
 *     wird eingetragen und muss als richtig bewertet werden, kein NaN/Infinity/undefined
 * Schritt 3 und 4 laufen gleichzeitig, Schritt 3 mit mehreren Seiten parallel (PARALLEL, Standard 4).
 * Umgebung: CHROMIUM_PFAD = eigener Chromium/Chrome, NUR_LERNEN=1 überspringt Schritt 3
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');

const WURZEL = path.join(__dirname, '..', '..');
const schnell = process.argv.indexOf('schnell') >= 0;
const fehler = [];
const melde = function (bereich, text) { fehler.push(bereich + ': ' + text); console.log('  ✗ ' + bereich + ': ' + text); };

// 0. Im Quellordner: Regeln für die Quellen prüfen, bauen und die Prüfung im gebauten Ordner starten
if (path.basename(WURZEL) !== '_site') {
  console.log('0. Quellen');
  const { execFileSync, spawnSync } = require('child_process');
  let gitDateien = [];
  try { gitDateien = execFileSync('git', ['ls-files'], { cwd: WURZEL }).toString().trim().split('\n'); } catch (e) { /* ohne Git */ }
  const GEBAUT = ['fragen.json', 'suchindex.json', 'sitemap.xml', 'robots.txt', 'aufgabenblaetter/liste.json'];
  GEBAUT.forEach(function (f) { if (gitDateien.indexOf(f) >= 0) melde('Quellen', f + ' ist gebaut und gehört nicht ins Repository (git rm --cached ' + f + ')'); });
  const lies = function (f) { return fs.readFileSync(path.join(WURZEL, f), 'utf8'); };
  const leer = function (datei, start, ende, erlaubt) {
    const s = lies(datei), a = s.indexOf(start), b = s.indexOf(ende, a);
    if (a < 0 || b < 0) { melde('Quellen', datei + ': „' + start.trim() + '“ fehlt'); return; }
    const innen = s.slice(a + start.length, b).trim();
    if (innen && !erlaubt.test(innen)) melde('Quellen', datei + ': „' + start.trim() + '“ muss leer bleiben, die Einträge gehören nach daten/seiten/ (werkzeuge/bauen.js füllt sie)');
  };
  leer('index.html', 'const eintraege = [', '\n    ];', /^\/\/[^\n]*$/);
  leer('index.html', '<!-- linkliste -->', '<!-- /linkliste -->', /^$/);
  leer('projektmappe.html', 'const SEITEN = [', '\n    ];', /^\/\/[^\n]*$/);
  leer('sw.js', 'const DATEIEN = [', '\n];', /^"\.\/"$/);
  if (!/const STAND = 'quelle';/.test(lies('sw.js'))) melde('Quellen', "sw.js: STAND muss 'quelle' bleiben (werkzeuge/bauen.js setzt ihn)");
  if (/const PAARE = \[\s*\[/.test(lies('werkzeuge/verwandt-bauen.js'))) melde('Quellen', 'werkzeuge/verwandt-bauen.js: feste Paare gehören in daten/seiten/ (Feld „verwandt“)');
  seitenListe().forEach(function (p) {
    const s = lies(p);
    if (/<!-- seo -->/.test(s)) melde('Quellen', p + ': SEO-Block gehört nicht in die Quelle (werkzeuge/bauen.js erzeugt ihn)');
    if (/<!-- verwandt -->/.test(s)) melde('Quellen', p + ': „Passt dazu“ gehört nicht in die Quelle (werkzeuge/bauen.js erzeugt ihn)');
  });
  const bau = spawnSync(process.execPath, [path.join(WURZEL, 'werkzeuge', 'bauen.js')], { cwd: WURZEL, stdio: 'inherit' });
  if (bau.status !== 0) melde('Quellen', 'werkzeuge/bauen.js ist fehlgeschlagen');
  if (fehler.length) { console.log('\n' + fehler.length + ' Probleme gefunden.'); process.exit(1); }
  const lauf = spawnSync(process.execPath, [path.join(WURZEL, '_site', 'werkzeuge', 'pruefen', 'alles.js')].concat(process.argv.slice(2)), { cwd: path.join(WURZEL, '_site'), stdio: 'inherit', env: process.env });
  process.exit(lauf.status === null ? 1 : lauf.status);
}

function seitenListe() {
  const liste = [];
  (function lauf(ordner, rel) {
    fs.readdirSync(ordner, { withFileTypes: true }).forEach(function (e) {
      if (e.name.startsWith('.') || ['node_modules', 'werkzeuge', 'aufgabenblaetter', 'daten', '_site'].indexOf(e.name) >= 0) return;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) lauf(path.join(ordner, e.name), r);
      else if (e.name.endsWith('.html')) liste.push(r);
    });
  })(WURZEL, '');
  return liste.sort();
}
function startseitenEintraege() {
  const s = fs.readFileSync(path.join(WURZEL, 'index.html'), 'utf8');
  const a = s.indexOf('const eintraege = ['), b = s.indexOf('\n    ];', a);
  return vm.runInNewContext('(' + s.slice(a + 'const eintraege = '.length, b + 6) + ')', {});
}

// 1. JavaScript
function jsPruefen() {
  console.log('1. JavaScript (ES2015)');
  let acorn; try { acorn = require('acorn'); } catch (e) { melde('JS', 'acorn fehlt (npm install --no-save acorn)'); return; }
  let n = 0;
  const teste = function (name, code) { n++; try { acorn.parse(code, { ecmaVersion: 2015, sourceType: 'script' }); } catch (e) { melde('JS', name + ': ' + e.message); } };
  fs.readdirSync(path.join(WURZEL, 'assets')).filter(function (f) { return f.endsWith('.js'); }).forEach(function (f) { teste('assets/' + f, fs.readFileSync(path.join(WURZEL, 'assets', f), 'utf8')); });
  teste('sw.js', fs.readFileSync(path.join(WURZEL, 'sw.js'), 'utf8'));
  seitenListe().forEach(function (p) {
    const s = fs.readFileSync(path.join(WURZEL, p), 'utf8'); const re = /<script>([\s\S]*?)<\/script>/g; let m, i = 0;
    while ((m = re.exec(s))) teste(p + ' (Skript ' + (++i) + ')', m[1]);
  });
  console.log('   ' + n + ' Skripte geprüft');
}

// 2. Dateien und Verweise
function dateienPruefen() {
  console.log('2. Daten und Verweise');
  ['fragen.json', 'suchindex.json', 'manifest.webmanifest'].forEach(function (f) {
    try { JSON.parse(fs.readFileSync(path.join(WURZEL, f), 'utf8')); } catch (e) { melde('JSON', f + ': ' + e.message); }
  });
  try {
    const fr = JSON.parse(fs.readFileSync(path.join(WURZEL, 'fragen.json'), 'utf8'));
    Object.keys(fr).filter(function (k) { return k[0] !== '_'; }).forEach(function (k) {
      if (!fs.existsSync(path.join(WURZEL, k))) melde('Fragen', 'unbekannte Seite ' + k);
      (fr[k] || []).forEach(function (q, i) { if (!Array.isArray(q) || typeof q[0] !== 'string' || typeof q[1] !== 'string' || !Array.isArray(q[2]) || q[2].length < 1 || q[2].indexOf(q[1]) >= 0) melde('Fragen', k + ' Nr. ' + (i + 1) + ' ungültig'); });
    });
  } catch (e) { /* oben gemeldet */ }
  const sitemap = fs.readFileSync(path.join(WURZEL, 'sitemap.xml'), 'utf8'), sw = fs.readFileSync(path.join(WURZEL, 'sw.js'), 'utf8');
  startseitenEintraege().forEach(function (k) {
    if (!fs.existsSync(path.join(WURZEL, k.pfad))) { melde('Startseite', 'Seite fehlt: ' + k.pfad); return; }
    if (k.pfad !== 'projektmappe.html' && sitemap.indexOf('/' + k.pfad + '<') < 0) melde('Sitemap', k.pfad + ' fehlt');
    if (sw.indexOf('"' + k.pfad + '"') < 0) melde('Offline', k.pfad + ' fehlt in sw.js');
    const s = fs.readFileSync(path.join(WURZEL, k.pfad), 'utf8');
    if (s.indexOf('<!-- seo -->') < 0) melde('SEO', k.pfad + ' ohne SEO-Block');
  });
  // lokale Verweise in assets und Seiten müssen existieren
  seitenListe().forEach(function (p) {
    const s = fs.readFileSync(path.join(WURZEL, p), 'utf8'); const re = /(?:src|href)="([^"#?:]+\.(?:js|css|png|html|json|webmanifest))"/g; let m;
    while ((m = re.exec(s))) { const z = path.normalize(path.join(WURZEL, path.dirname(p), m[1])); if (!fs.existsSync(z)) melde('Verweis', p + ' → ' + m[1]); }
  });
}

// kleiner Webserver für die Browserprüfung
function server() {
  const TYP = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8', '.xml': 'application/xml' };
  return new Promise(function (ok) {
    const s = http.createServer(function (q, a) {
      let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html';
      const d = path.normalize(path.join(WURZEL, p));
      if (d.indexOf(WURZEL) !== 0 || !fs.existsSync(d) || fs.statSync(d).isDirectory()) { a.writeHead(404); a.end(); return; }
      a.writeHead(200, { 'Content-Type': TYP[path.extname(d)] || 'application/octet-stream' }); fs.createReadStream(d).pipe(a);
    });
    s.listen(0, '127.0.0.1', function () { ok(s); });
  });
}

// 3. Seiten im Browser
async function seitenPruefen(browser, basis) {
  const liste = seitenListe().filter(function (p) { return p !== '404.html'; });
  const auftraege = []; liste.forEach(function (p) { [380, 1280].forEach(function (b) { auftraege.push([p, b]); }); });
  const parallel = Math.max(1, Math.min(8, Number(process.env.PARALLEL) || 4));
  let naechster = 0;
  async function einzeln(p, breite) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: 900 }, serviceWorkers: 'block' });
    const seite = await ctx.newPage(), probleme = [];
    seite.on('pageerror', function (e) { probleme.push('JS-Fehler: ' + e.message); });
    seite.on('console', function (m) { if (m.type() === 'error') probleme.push('Konsole: ' + m.text()); });
    seite.on('request', function (r) { const u = r.url(); if (!u.startsWith(basis) && !u.startsWith('data:') && !u.startsWith('blob:')) probleme.push('fremde Anfrage: ' + u); });
    try {
      await seite.goto(basis + '/' + p, { waitUntil: 'load', timeout: 30000 });
      await seite.waitForTimeout(400);
      const w = await seite.evaluate(function () {
        const t = document.body ? document.body.innerText : '';
        return { ueber: document.documentElement.scrollWidth > window.innerWidth + 1, katex: document.querySelectorAll('.katex-error').length, nan: /(^|[^A-Za-z])(NaN|Infinity|undefined)([^A-Za-z]|$)/.test(t) };
      });
      if (w.ueber) probleme.push('seitlicher Überlauf');
      if (w.katex) probleme.push(w.katex + ' KaTeX-Fehler');
      if (w.nan) probleme.push('NaN, Infinity oder undefined im Text');
    } catch (e) { probleme.push('lädt nicht: ' + e.message.split('\n')[0]); }
    probleme.filter(function (x, i, l) { return l.indexOf(x) === i; }).forEach(function (x) { melde('Seite', p + ' bei ' + breite + ' px: ' + x); });
    await ctx.close();
  }
  async function arbeiter() { while (naechster < auftraege.length) { const a = auftraege[naechster++]; await einzeln(a[0], a[1]); } }
  const arbeit = []; for (let i = 0; i < parallel; i++) arbeit.push(arbeiter());
  await Promise.all(arbeit);
  console.log('3. Seiten im Browser (380 und 1280 px): ' + liste.length + ' Seiten, ' + parallel + ' gleichzeitig');
}

// 4. Lernbereich
async function lernenPruefen(browser, basis) {

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  // nur Rechenaufgaben (Verständnisfragen haben eine feste richtige Antwort und werden in Schritt 2 geprüft)
  await ctx.addInitScript(function () { try { localStorage.setItem('lernen-fragen', 'false'); } catch (e) { /* egal */ } });
  const l = await ctx.newPage(); const js = [];
  l.on('pageerror', function (e) { js.push(e.message); });
  let geprueft = 0;
  for (const stufe of ['leicht', 'mittel', 'schwer']) {
    await l.goto(basis + '/lernen.html?stufe=' + stufe + '#aufgaben'); await l.waitForTimeout(1500);
    await l.click('.stufen [data-stufe="' + stufe + '"]');
    for (let i = 0; i < 25; i++) {
      try { await l.waitForSelector('#aufgabe form.antwort', { timeout: 30000 }); } catch (e) { melde('Lernen', 'keine Aufgabe erzeugt (' + stufe + ')'); break; }
      const text = await l.locator('#aufgabe .karte').innerText();
      if (/(^|[^A-Za-z])(NaN|Infinity|undefined)([^A-Za-z]|$)/.test(text)) melde('Lernen', 'NaN o. ä. in Aufgabe: ' + text.split('\n')[0]);
      await l.click('#aufgabe button:has-text("Lösung zeigen")');
      const erg = await l.locator('#aufgabe .loesung .hinweis-klein').innerText();
      const m = /Ergebnis: ([\u2212-]?\d+(?:[\u00a0\u202f ]\d{3})*(?:,\d+)?(?:e[-+]?\d+)?)/.exec(erg), wert = m ? m[1].replace(/[\u00a0\u202f ]/g, '').replace('\u2212', '-') : '';
      await l.fill('#aufgabe input', wert);
      await l.click('#aufgabe button:has-text("Prüfen")');
      const k = await l.locator('#aufgabe .rueck').first().getAttribute('class');
      if (!/gut/.test(k || '')) melde('Lernen', 'Lösung ' + wert + ' als falsch bewertet (' + erg.replace(/\s+/g, ' ').slice(0, 60) + '): ' + text.replace(/\s+/g, ' ').slice(0, 160));
      geprueft++;
      await l.click('#aufgabe button:has-text("Neue Aufgabe")'); await l.waitForTimeout(150);
    }
  }
  js.forEach(function (x) { melde('Lernen', 'JS-Fehler: ' + x); });
  console.log('4. Lernbereich: ' + geprueft + ' zufällige Aufgaben gerechnet');
  await ctx.close();
}

(async function () {
  jsPruefen();
  dateienPruefen();
  if (!schnell) {
    let playwright; try { playwright = require('playwright'); } catch (e) { melde('Browser', 'playwright fehlt (npm install --no-save playwright)'); }
    if (playwright) {
      const s = await server(), basis = 'http://127.0.0.1:' + s.address().port;
      const browser = await playwright.chromium.launch(process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {});
      try { await Promise.all([process.env.NUR_LERNEN ? null : seitenPruefen(browser, basis), lernenPruefen(browser, basis)]); } finally { await browser.close(); s.close(); }
    }
  }
  console.log(fehler.length ? '\n' + fehler.length + ' Probleme gefunden.' : '\nAlles in Ordnung.');
  process.exit(fehler.length ? 1 : 0);
})();
