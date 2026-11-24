#!/usr/bin/env node
/*
 * „Passt dazu“ – nach neuen Seiten oder geänderten Stichwörtern ausführen:
 *   node werkzeuge/verwandt-bauen.js
 * Schreibt in jede Seite der Startseiten-Liste einen Block zwischen <!-- verwandt --> und <!-- /verwandt -->
 * (direkt nach </main>) mit bis zu vier passenden Seiten. Reines HTML, damit die Links auch ohne JavaScript
 * und für Suchmaschinen da sind.
 * Auswahl: feste Paare aus PAARE, dann gemeinsame Stichwörter (themen), gleiche Gruppe, gleicher Bereich.
 * Nur Node.js, keine Pakete.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WURZEL = path.join(__dirname, '..');
const ANZAHL = 4;
// Seiten, die fachlich zusammengehören (gelten in beide Richtungen, Reihenfolge = Vorrang)
const PAARE = [];
// Feste Paare stehen in daten/seiten/**/*.json im Feld „verwandt“
(function () {
  const ordner = path.join(WURZEL, 'daten', 'seiten');
  (function lauf(o) {
    if (!fs.existsSync(o)) return;
    fs.readdirSync(o, { withFileTypes: true }).sort(function (x, y) { return x.name < y.name ? -1 : 1; }).forEach(function (e) {
      const p = path.join(o, e.name);
      if (e.isDirectory()) return lauf(p);
      if (!e.name.endsWith('.json')) return;
      const pfad = path.relative(ordner, p).split(path.sep).join('/').replace(/\.json$/, '.html'), d = JSON.parse(fs.readFileSync(p, 'utf8'));
      (d.verwandt || []).forEach(function (z) { PAARE.push([pfad, z]); });
    });
  })(ordner);
})();

const start = fs.readFileSync(path.join(WURZEL, 'index.html'), 'utf8');
const a = start.indexOf('const eintraege = ['), b = start.indexOf('\n    ];', a);
if (a < 0 || b < 0) { console.error('Liste der Startseite nicht gefunden'); process.exit(1); }
const eintraege = vm.runInNewContext('(' + start.slice(a + 'const eintraege = '.length, b + 6) + ')', {})
  .filter(function (k) { return k && typeof k.pfad === 'string' && fs.existsSync(path.join(WURZEL, k.pfad)); });
const nach = {}; eintraege.forEach(function (k) { nach[k.pfad] = k; });
PAARE.forEach(function (p) { p.forEach(function (x) { if (!nach[x]) console.warn('Paar mit unbekannter Seite: ' + x); }); });

const norm = function (t) { return String(t).toLowerCase().replace(/[-\s]+/g, ' ').trim(); };
const stich = {}; eintraege.forEach(function (k) { stich[k.pfad] = (k.themen || []).map(norm); });
function punkte(x, y) {
  let p = 0;
  PAARE.forEach(function (q, i) { if ((q[0] === x.pfad && q[1] === y.pfad) || (q[1] === x.pfad && q[0] === y.pfad)) p += 100 - i * 0.01; });
  const sy = stich[y.pfad]; stich[x.pfad].forEach(function (t) { if (sy.indexOf(t) >= 0) p += 3; });
  if (x.gruppe && x.gruppe === y.gruppe && x.bereich === y.bereich) p += 4;
  if (x.bereich === y.bereich) p += 1;
  if ((x.auchIn || []).indexOf(y.bereich) >= 0 || (y.auchIn || []).indexOf(x.bereich) >= 0) p += 1;
  return p;
}
const html = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
function kurz(t) { t = String(t).replace(/\s+/g, ' ').trim(); const s = t.search(/[.:–]\s/); if (s > 30 && s < 130) t = t.slice(0, s).trim(); return t.length > 120 ? t.slice(0, 117).replace(/\s\S*$/, '') + ' …' : t; }
function relativ(von, zu) { const r = path.posix.relative(path.posix.dirname(von), zu); return r || path.posix.basename(zu); }

let geschrieben = 0;
eintraege.forEach(function (k) {
  const liste = eintraege.filter(function (y) { return y.pfad !== k.pfad; })
    .map(function (y) { return [punkte(k, y), y]; })
    .filter(function (x) { return x[0] >= 1; })
    .sort(function (p, q) { return q[0] - p[0] || p[1].titel.localeCompare(q[1].titel); });
  // gute Treffer (gemeinsame Stichwörter, Gruppe, feste Paare); sonst Seiten desselben Bereichs
  let gut = liste.filter(function (x) { return x[0] >= 2; });
  if (gut.length < 2) gut = liste;
  const wahl = gut.slice(0, ANZAHL).map(function (x) { return x[1]; });
  const datei = path.join(WURZEL, k.pfad);
  let s = fs.readFileSync(datei, 'utf8');
  s = s.replace(/\n  <!-- verwandt -->[\s\S]*?<!-- \/verwandt -->\n/, '\n');
  if (!wahl.length) { fs.writeFileSync(datei, s); return; }
  const block = '\n  <!-- verwandt -->\n  <nav class="verwandt" aria-labelledby="h-verwandt">\n    <h2 id="h-verwandt">Passt dazu</h2>\n    <ul>\n' +
    wahl.map(function (y) { return '      <li><a href="' + html(relativ(k.pfad, y.pfad)) + '"><b>' + html(y.titel) + '</b><span>' + html(kurz(y.text || '')) + '</span></a></li>'; }).join('\n') +
    '\n    </ul>\n  </nav>\n  <!-- /verwandt -->\n';
  const i = s.lastIndexOf('</main>'), j = i < 0 ? -1 : s.indexOf('\n', i);
  if (j < 0) { console.warn('Kein </main> in ' + k.pfad); return; }
  s = s.slice(0, j + 1) + block.slice(1) + s.slice(j + 1);
  fs.writeFileSync(datei, s); geschrieben++;
});
console.log(geschrieben + ' Seiten mit „Passt dazu“');
