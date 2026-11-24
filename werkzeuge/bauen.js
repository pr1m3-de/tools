#!/usr/bin/env node
/*
 * Seite bauen
 * ===========
 * Aufruf im Hauptordner: node werkzeuge/bauen.js
 *
 * Kopiert die Quellen nach _site/ und erzeugt dort alles, was mehrere Seiten gemeinsam betrifft:
 *   – Liste der Startseite (index.html), Projektmappe, fragen.json   aus daten/seiten/**\/*.json
 *   – SEO-Blöcke, „Passt dazu“, Suchindex, Aufgabenblätter-Liste      (die bisherigen Werkzeuge)
 *   – Offline-Liste und STAND in sw.js                                aus allen Dateien
 * Im Repository stehen diese gebauten Inhalte nie. Deshalb ändern Pull Requests für neue Seiten
 * keine gemeinsamen Dateien und können sich nicht gegenseitig in die Quere kommen.
 *
 * Neue Seite: HTML-Datei anlegen und daten/seiten/<ordner>/<name>.json dazu (siehe MITMACHEN.md).
 * Angesehen und geprüft wird immer _site/ (z. B. python3 -m http.server -d _site).
 * Fehler in den Daten brechen den Bau ab.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const QUELLE = path.resolve(__dirname, '..');
const ZIEL = path.join(QUELLE, '_site');
const AUSLASSEN = ['.git', '.github', 'node_modules', '_site'];
const fehler = [];
const melde = function (t) { fehler.push(t); };

// ---------- 1. Kopieren ----------
fs.rmSync(ZIEL, { recursive: true, force: true });
(function kopiere(von, nach) {
  fs.mkdirSync(nach, { recursive: true });
  fs.readdirSync(von, { withFileTypes: true }).forEach(function (e) {
    if (AUSLASSEN.indexOf(e.name) >= 0) return;
    const a = path.join(von, e.name), b = path.join(nach, e.name);
    if (e.isDirectory()) kopiere(a, b); else if (e.isFile()) fs.copyFileSync(a, b);
  });
})(QUELLE, ZIEL);

// ---------- 2. Daten je Seite einlesen und prüfen ----------
const DATEN = path.join(QUELLE, 'daten', 'seiten');
const seiten = [];
(function lauf(o) {
  if (!fs.existsSync(o)) return;
  fs.readdirSync(o, { withFileTypes: true }).forEach(function (e) {
    const p = path.join(o, e.name);
    if (e.isDirectory()) return lauf(p);
    if (!e.name.endsWith('.json')) return;
    const pfad = path.relative(DATEN, p).split(path.sep).join('/').replace(/\.json$/, '.html');
    let d; try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (x) { melde('daten/seiten/' + pfad.replace(/\.html$/, '.json') + ': kein gültiges JSON (' + x.message + ')'); return; }
    d.pfad = pfad; seiten.push(d);
  });
})(DATEN);

const start = fs.readFileSync(path.join(QUELLE, 'index.html'), 'utf8');
// erlaubte Bereiche: Schlüssel von BEREICHE in index.html
const BEREICHE = (function () { const m = /const BEREICHE = \{([^}]*)\}/.exec(start), r = []; let k; const re = /'([^']+)'\s*:/g; if (m) while ((k = re.exec(m[1]))) r.push(k[1]); return r; })();
const text = function (v) { return typeof v === 'string' && v.trim().length > 0; };
seiten.forEach(function (d) {
  const wo = 'daten/seiten/' + d.pfad.replace(/\.html$/, '.json');
  if (!fs.existsSync(path.join(QUELLE, d.pfad))) melde(wo + ': Seite ' + d.pfad + ' gibt es nicht');
  ['titel', 'bereich', 'text', 'tex'].forEach(function (k) { if (!text(d[k])) melde(wo + ': „' + k + '“ fehlt'); });
  if (!Array.isArray(d.themen) || !d.themen.length) melde(wo + ': „themen“ fehlt');
  if (d.bereich && BEREICHE.length && BEREICHE.indexOf(d.bereich) < 0) melde(wo + ': unbekannter Bereich „' + d.bereich + '“ (erlaubt: ' + BEREICHE.join(', ') + ')');
  (d.auchIn || []).forEach(function (b) { if (BEREICHE.indexOf(b) < 0) melde(wo + ': unbekannter Bereich in auchIn „' + b + '“'); });
  if (d.nr !== undefined && typeof d.nr !== 'number') melde(wo + ': „nr“ muss eine Zahl sein');
  (d.verwandt || []).forEach(function (z) { if (!fs.existsSync(path.join(QUELLE, z))) melde(wo + ': verwandt mit unbekannter Seite ' + z); });
  if (d.projektmappe && (!text(d.projektmappe.name) || !/^#[0-9A-Fa-f]{6}$/.test(d.projektmappe.farbe || ''))) melde(wo + ': „projektmappe“ braucht name und farbe (#RRGGBB)');
  (d.fragen || []).forEach(function (q, i) {
    if (!Array.isArray(q) || q.length !== 4 || !text(q[0]) || !text(q[1]) || !Array.isArray(q[2]) || q[2].length < 2 || !q[2].every(text) || !text(q[3])) melde(wo + ': Frage ' + (i + 1) + ' hat nicht die Form [Frage, richtig, [falsch, falsch, …], Erklärung]');
    else if (q[2].indexOf(q[1]) >= 0) melde(wo + ': Frage ' + (i + 1) + ': richtige Antwort steht auch bei den falschen');
  });
});
if (fehler.length) { console.error('Fehler in den Daten:\n  ' + fehler.join('\n  ')); process.exit(1); }

const sortiert = function (liste, nr) { return liste.slice().sort(function (a, b) { const x = nr(a) === undefined ? 1e12 : nr(a), y = nr(b) === undefined ? 1e12 : nr(b); return x - y || a.titel.localeCompare(b.titel, 'de'); }); };
// Text als JavaScript-Literal in einfachen Anführungszeichen (wie bisher in index.html)
const lit = function (t) { return "'" + String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"; };

// ---------- 3. Startseite ----------
const eintraege = sortiert(seiten, function (d) { return d.nr; });
let idx = fs.readFileSync(path.join(ZIEL, 'index.html'), 'utf8');
const ia = idx.indexOf('const eintraege = ['), ib = idx.indexOf('\n    ];', ia);
if (ia < 0 || ib < 0) { console.error('index.html: „const eintraege = [ … ];“ nicht gefunden'); process.exit(1); }
const liste = eintraege.map(function (d) {
  const z = ['        titel: ' + lit(d.titel)];
  if (d.gruppe) z.push('        gruppe: ' + lit(d.gruppe));
  z.push('        pfad: ' + lit(d.pfad), '        bereich: ' + lit(d.bereich));
  if (d.auchIn && d.auchIn.length) z.push('        auchIn: [' + d.auchIn.map(lit).join(', ') + ']');
  z.push('        themen: [' + d.themen.map(lit).join(', ') + ']', '        text: ' + lit(d.text), '        tex: ' + lit(d.tex));
  return '      {\n' + z.join(',\n') + '\n      }';
}).join(',\n');
idx = idx.slice(0, ia) + 'const eintraege = [\n' + liste + idx.slice(ib);
fs.writeFileSync(path.join(ZIEL, 'index.html'), idx);

// ---------- 4. Projektmappe ----------
const mappeDatei = path.join(ZIEL, 'projektmappe.html');
if (fs.existsSync(mappeDatei)) {
  let m = fs.readFileSync(mappeDatei, 'utf8');
  const ma = m.indexOf('const SEITEN = ['), mb = m.indexOf('\n    ];', ma);
  if (ma >= 0 && mb >= 0) {
    const mit = sortiert(seiten.filter(function (d) { return d.projektmappe; }), function (d) { return d.projektmappe.nr; });
    const zeilen = mit.map(function (d) { const p = d.projektmappe; return '      [' + [d.pfad, p.name, p.farbe].map(lit).join(', ') + (p.speicher ? ', ' + lit(p.speicher) : '') + ']'; });
    m = m.slice(0, ma) + 'const SEITEN = [\n' + zeilen.join(',\n') + m.slice(mb);
    fs.writeFileSync(mappeDatei, m);
  }
}

// ---------- 5. Verständnisfragen ----------
const fragen = { _hinweis: 'Gebaut aus daten/seiten/**/*.json (Feld „fragen“) von werkzeuge/bauen.js. Nicht von Hand ändern.' };
eintraege.forEach(function (d) { if (d.fragen && d.fragen.length) fragen[d.pfad] = d.fragen; });
fs.writeFileSync(path.join(ZIEL, 'fragen.json'), JSON.stringify(fragen, null, 1) + '\n');

// ---------- 6. Bisherige Werkzeuge im gebauten Ordner ----------
const umgebung = Object.assign({}, process.env, { GIT_WURZEL: QUELLE });
['seo-bauen.js', 'verwandt-bauen.js', 'suche-bauen.js', 'blaetter-bauen.js'].forEach(function (w) {
  let aus;
  try { aus = execFileSync(process.execPath, [path.join(ZIEL, 'werkzeuge', w)], { cwd: ZIEL, env: umgebung, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim(); }
  catch (x) { console.error(w + ' ist fehlgeschlagen:\n' + String(x.stderr || x.message)); process.exit(1); }
  if (aus) console.log(w + ': ' + aus.split('\n').pop());
});

// ---------- 7. Offline-Liste und STAND ----------
// alles, was eine Seite zum Laufen braucht; nicht: Werkzeuge, Quelldaten, Texte für Mitwirkende, Vorschaubilder
const OHNE = /^(werkzeuge|daten|vorlage|fehlerprotokoll|assets\/og)\/|^(sw\.js|CNAME|robots\.txt|sitemap\.xml|LICENSE|[A-Z]+\.md)$|(^|\/)(LICENSE|LIESMICH\.md|README\.md)$|^\./;
const dateien = [];
(function lauf(o, rel) {
  fs.readdirSync(o, { withFileTypes: true }).forEach(function (e) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) return lauf(path.join(o, e.name), r);
    if (!OHNE.test(r)) dateien.push(r);
  });
})(ZIEL, '');
dateien.sort(function (a, b) { return a === 'index.html' ? -1 : b === 'index.html' ? 1 : a < b ? -1 : 1; });
const hash = crypto.createHash('sha1');
dateien.forEach(function (d) { hash.update(d); hash.update(fs.readFileSync(path.join(ZIEL, d))); });
const swDatei = path.join(ZIEL, 'sw.js');
let sw = fs.readFileSync(swDatei, 'utf8');
sw = sw.replace(/const STAND = '[^']*';/, "const STAND = '" + hash.digest('hex').slice(0, 10) + "';")
  .replace(/const DATEIEN = \[[\s\S]*?\n\];/, 'const DATEIEN = [\n' + ['./'].concat(dateien).map(function (d) { return '  ' + JSON.stringify(d); }).join(',\n') + '\n];');
fs.writeFileSync(swDatei, sw);

console.log('Gebaut nach _site/: ' + eintraege.length + ' Seiten auf der Startseite, ' + (Object.keys(fragen).length - 1) + ' mit Fragen, ' + dateien.length + ' Dateien offline');
