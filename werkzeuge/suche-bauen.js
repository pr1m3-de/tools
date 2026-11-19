#!/usr/bin/env node
/*
 * Stichwortsuche – nach jeder neuen oder geänderten Seite und jedem neuen Aufgabenblatt ausführen:
 *   node werkzeuge/suche-bauen.js
 * Liest alle Seiten (Titel, Beschreibung, Stichwörter der Startseite, Überschriften, häufige Fragen,
 * Tabellen, hervorgehobene Begriffe, Rechner mit Feldern, Lösern und Formelsammlung) und alle
 * Aufgabenblätter und schreibt daraus suchindex.json. basis.js lädt die Datei erst, wenn jemand die
 * Suche öffnet. Trägt suchindex.json in sw.js ein (offline) und setzt STAND neu.
 * Nur Node.js, keine Pakete.
 *
 * Aufbau von suchindex.json:
 *   { v: 1, seiten: [ [pfad, titel, beschreibung, bereich, stichwörter, wörter, [[text, art, ziel], …]], … ] }
 *   art: a Abschnitt, f Formel, q häufige Frage, r Rechner/Löser, b Aufgabe eines Blatts
 *   ziel: Anker (#id) oder leer – dann springt der Link per Textfragment zur Überschrift
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const WURZEL = path.join(__dirname, '..');
const ZUSATZ = ' – Formeln & Rechner';
const AUSLASSEN = ['404.html', 'index.html', 'vorlage/beispiel-rechner.html'];   // die Startseite hat ihre eigene Suche

const entities = function (t) {
  return t.replace(/&nbsp;/g, ' ').replace(/&shy;/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(+n); });
};
const text = function (t) { return entities(String(t).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); };
const jsText = function (t) { return t.replace(/\\'/g, "'").replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); }); };
// TeX aus Hinweisen entfernen, Einheiten bleiben lesbar
const ohneTex = function (t) { return t.replace(/\$[^$]*\$/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}_^\\]/g, ' ').replace(/\s+/g, ' ').trim(); };

// normalisieren wie im Browser: klein, Umlaute ausgeschrieben, nur Buchstaben und Ziffern
function norm(t) {
  return String(t).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
const STOPP = new Set(('aber alle allem allen aller alles also auch auf aus bei beim bis dann dass dem den denn der des die dies diese diesem diesen dieser durch eine einem einen einer eines etwa fuer hat hier ihr ihre immer ist jede jedem jeden jeder kann kein keine mehr mit nach nicht noch nur oder ohne sehr sich sie sind soll sowie ueber und uns unter vom von vor wann warum was weil wenn werden wie wird wo zum zur zwei drei dazu damit deshalb sonst schon zwischen gibt geht wurde wurden waere hier dort beim seit eines einem etwas oben unten links rechts dabei davon').split(' '));
function woerter(t) {
  const m = new Set();
  // Begriffe mit Bindestrich auch zusammengeschrieben (Q-Label → qlabel)
  (String(t).match(/[A-Za-zÄÖÜäöüß0-9]+(?:[-/][A-Za-zÄÖÜäöüß0-9()]+)+/g) || []).forEach(function (b) { const z = norm(b).replace(/ /g, ''); if (z.length >= 4) m.add(z); });
  norm(t).split(' ').forEach(function (w) { if (w.length >= 4 && !STOPP.has(w) && !/^\d+$/.test(w)) m.add(w); });
  return m;
}

function seiten(ordner, rel) {
  let liste = [];
  fs.readdirSync(ordner, { withFileTypes: true }).forEach(function (e) {
    if (e.name.startsWith('.') || ['assets', 'werkzeuge', 'node_modules', 'aufgabenblaetter'].indexOf(e.name) >= 0) return;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) liste = liste.concat(seiten(path.join(ordner, e.name), r));
    else if (e.name.endsWith('.html') && AUSLASSEN.indexOf(r) < 0) liste.push(r);
  });
  return liste.sort();
}

// Karten der Startseite: Bereich und Stichwörter
const start = fs.readFileSync(path.join(WURZEL, 'index.html'), 'utf8');
const KARTEN = {};
(function () {
  const a = start.indexOf('const eintraege = ['); if (a < 0) return;
  const b = start.indexOf('\n    ];', a);
  try {
    const liste = vm.runInNewContext('(' + start.slice(a + 'const eintraege = '.length, b + 6) + ')', {});
    liste.forEach(function (k) { KARTEN[k.pfad] = k; });
  } catch (e) { console.warn('Karten der Startseite nicht lesbar: ' + e.message); }
})();

// passende schließende Klammer ab Position i (öffnende Klammer), Zeichenketten werden übersprungen
function klammerEnde(s, i) {
  const auf = s[i], zu = auf === '[' ? ']' : auf === '{' ? '}' : ')';
  let tiefe = 0, q = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === auf) tiefe++; else if (c === zu) { tiefe--; if (!tiefe) return j; }
  }
  return s.length;
}

function seiteLesen(rel) {
  const s = fs.readFileSync(path.join(WURZEL, rel), 'utf8');
  const titelRoh = /<title>([\s\S]*?)<\/title>/.exec(s);
  const titel = titelRoh ? text(titelRoh[1]).replace(ZUSATZ, '') : rel;
  const besch = (/<meta name="description" content="([^"]*)"/.exec(s) || [])[1] || '';
  const karte = KARTEN[rel] || {};
  const teile = [], gesehen = new Set(), alleWoerter = new Set();
  const neu = function (t, art, ziel) {
    t = t.replace(/\s+/g, ' ').trim(); if (t.length < 3 || t.length > 140) return;
    const k = norm(t) + '|' + art; if (gesehen.has(k) || !/[a-zäöü]{3}/i.test(t)) return; gesehen.add(k);
    teile.push([t, art, ziel || '']);
  };
  const ohneSkript = s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!-- seo -->[\s\S]*?<!-- \/seo -->/, ' ').replace(/<noscript>[\s\S]*?<\/noscript>/g, ' ');
  const haupt = (/<main[\s\S]*?<\/main>/.exec(ohneSkript) || [ohneSkript])[0];
  // Überschriften mit Anker
  const reH = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/g; let m;
  while ((m = reH.exec(haupt))) { const id = (/\sid="([^"]+)"/.exec(m[2]) || [])[1]; neu(text(m[3]), 'a', id ? '#' + id : ''); }
  // häufige Fragen
  const reF = /<summary>([\s\S]*?)<\/summary>/g;
  while ((m = reF.exec(haupt))) neu(text(m[1]), 'q', '');
  // Tabellenköpfe und erste Spalte, hervorgehobene Begriffe: nur als Wörter der Seite
  const reB = /<(?:b|strong|th|dt)>([\s\S]*?)<\/(?:b|strong|th|dt)>/g;
  while ((m = reB.exec(haupt))) woerter(text(m[1])).forEach(function (w) { alleWoerter.add(w); });
  woerter(text(haupt)).forEach(function (w) { alleWoerter.add(w); });
  // Rechner aus dem Skript: Titel der Löser, Feldnamen, Formelsammlung, Einleitung
  const skripte = (s.match(/<script>[\s\S]*?<\/script>/g) || []).join('\n');
  const sa = skripte.indexOf('sammlung: [');
  if (sa >= 0) {
    const block = skripte.slice(sa, klammerEnde(skripte, sa + 'sammlung: '.length));
    const reS = /\[\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*(?:,\s*'((?:\\.|[^'\\])*)')?/g;
    while ((m = reS.exec(block))) { neu(jsText(m[1]), 'f', ''); if (m[3]) woerter(ohneTex(jsText(m[3]))).forEach(function (w) { alleWoerter.add(w); }); }
  }
  const reL = /titel:\s*'((?:\\.|[^'\\])*)',\s*hilfe:/g;
  while ((m = reL.exec(skripte))) neu(jsText(m[1]).replace(/ – in jede Richtung$/, ''), 'r', '');
  // alle Texte im Skript, die nach Sätzen aussehen (Felder, Hinweise, Meldungen, Erklärungen), aber kein TeX
  const reN = /'((?:\\.|[^'\\\n])*)'/g;
  while ((m = reN.exec(skripte))) {
    const t = jsText(m[1]);
    if (t.indexOf('\\') >= 0 || !/[a-zäöüß]{4,}\s+[a-zäöüß]{3,}/i.test(t) || /[<>{};=]/.test(t)) continue;
    woerter(t).forEach(function (w) { alleWoerter.add(w); });
  }
  // Formelsammlungen in HTML (eigene Seiten)
  const reT = /<[^>]+title="([^"]+)"[^>]*data-tex=/g;
  while ((m = reT.exec(s))) neu(text(m[1]), 'f', '');
  const stich = (karte.themen || []).join(', ');
  const kopf = woerter([titel, besch, stich, karte.gruppe || ''].join(' '));
  teile.forEach(function (t) { woerter(t[0]).forEach(function (w) { kopf.add(w); }); });
  const rest = Array.from(alleWoerter).filter(function (w) { return !kopf.has(w); }).sort();
  return [rel, karte.titel || titel, text(besch), karte.bereich || '', stich, rest.join(' '), teile];
}

function blattLesen(b) {
  const s = fs.readFileSync(path.join(WURZEL, b.datei), 'utf8').replace(/^---[\s\S]*?---/, '');
  const ziel = 'lernen.html#blatt=' + b.datei.replace(/^aufgabenblaetter\//, '').replace(/\.md$/, '');
  const teile = []; let m;
  const re = /^##\s+(.+)$/gm;
  while ((m = re.exec(s))) teile.push([ohneTex(m[1]), 'b', '']);
  const zuSeite = KARTEN[b.thema] ? KARTEN[b.thema].titel : '';
  const w = Array.from(woerter(ohneTex(s.replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/:::\w+/g, ' ')))).sort();
  return [ziel, 'Aufgabenblatt: ' + b.titel, b.beschreibung || '', 'Aufgabenblätter', [zuSeite, b.stufe || ''].filter(Boolean).join(', '), w.join(' '), teile];
}

const index = { v: 1, seiten: [] };
seiten(WURZEL, '').forEach(function (rel) { index.seiten.push(seiteLesen(rel)); });
let blaetter = [];
try { blaetter = JSON.parse(fs.readFileSync(path.join(WURZEL, 'aufgabenblaetter', 'liste.json'), 'utf8')).blaetter || []; } catch (e) { console.warn('aufgabenblaetter/liste.json fehlt – erst node werkzeuge/blaetter-bauen.js'); }
blaetter.forEach(function (b) { if (fs.existsSync(path.join(WURZEL, b.datei))) index.seiten.push(blattLesen(b)); });

const ausgabe = JSON.stringify(index);
fs.writeFileSync(path.join(WURZEL, 'suchindex.json'), ausgabe);
const teileZahl = index.seiten.reduce(function (a, s) { return a + s[6].length; }, 0);
console.log('suchindex.json: ' + index.seiten.length + ' Einträge (' + blaetter.length + ' Blätter), ' + teileZahl + ' Abschnitte, ' + Math.round(ausgabe.length / 1024) + ' KB');

// ---------- sw.js: suchindex.json offline, STAND neu ----------
const swDatei = path.join(WURZEL, 'sw.js');
if (fs.existsSync(swDatei)) {
  let sw = fs.readFileSync(swDatei, 'utf8');
  const d = /const DATEIEN = \[\n([\s\S]*?)\n\];/.exec(sw);
  if (d && d[1].indexOf('"suchindex.json"') < 0) sw = sw.replace(d[0], 'const DATEIEN = [\n' + d[1] + ',\n  "suchindex.json"\n];');
  const h = crypto.createHash('sha1');
  /const DATEIEN = \[\n([\s\S]*?)\n\];/.exec(sw)[1].split(',\n').forEach(function (z) {
    z = z.trim(); if (!z) return;
    const p = JSON.parse(z.replace(/^'(.*)'$/, '"$1"')), f = path.join(WURZEL, p === './' ? 'index.html' : p);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) h.update(fs.readFileSync(f));
  });
  sw = sw.replace(/const STAND = '[^']*';/, "const STAND = '" + h.digest('hex').slice(0, 10) + "';");
  fs.writeFileSync(swDatei, sw);
  console.log('sw.js: suchindex.json eingetragen, STAND neu');
}
