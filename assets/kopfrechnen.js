/*
 * Kopfrechnen: Tricks mit Anleitung und Übungen in vier Stufen (Leicht, Mittel, Schwer, Profi)
 * ============================================================================================
 * Einbinden nach basis.js (Formel) im Lernbereich: <script src="assets/kopfrechnen.js"></script>,
 * dann Kopfrechnen.baue(element, { lies, schreib, sperren }).
 *
 * Jeder Trick: id, kat, titel, ab (kleinste Stufe), bis (größte Stufe), kurz, anleitung (Schritte),
 * aufgabe(stufe) → { frage (TeX), text, antwort, art ('zahl' | 'bruch' | 'wahl'), optionen, toleranz,
 * einheit, schritte (Text mit $TeX$), trick (Ergebnis auf dem Weg des Tricks, für die Prüfung) }.
 * Texte werden nur mit textContent oder KaTeX gesetzt.
 */
(function () {
  'use strict';
  if (window.Kopfrechnen) return;

  // ---------- Hilfen ----------
  const zuf = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  const wahl = function (l) { return l[Math.floor(Math.random() * l.length)]; };
  const rund = function (x, n) { const f = Math.pow(10, n === undefined ? 10 : n); return Math.round(x * f) / f; };
  const ggT = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  const kgV = function (a, b) { return a / ggT(a, b) * b; };
  function gruppe(s, trenner) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, trenner); }
  // Zahl als Text (deutsch): Komma, schmale Leerzeichen ab 5 Stellen
  function zt(x, dez) {
    if (!isFinite(x)) return '–';
    let s = dez === undefined ? String(rund(x, 10)) : Math.abs(x).toFixed(dez);
    if (dez === undefined) { if (/e/i.test(s)) s = Math.abs(x).toFixed(12).replace(/0+$/, ''); s = s.replace('-', ''); }
    const neg = x < 0 && rund(x, 10) !== 0, t = s.split('.'), g = t[0].length >= 5 ? gruppe(t[0], ' ') : t[0];
    return (neg ? '−' : '') + g + (t[1] ? ',' + t[1] : '');
  }
  // Zahl für TeX
  function tx(x, dez) {
    return zt(x, dez).replace(',', '{,}').replace(/\u202f/g, '\\,').replace('−', '-');
  }
  // Zwei- oder dreistelliger Block mit führenden Nullen (für „links | rechts“)
  const block = function (x, n) { let s = String(x); while (s.length < n) s = '0' + s; return s; };
  const ziffern = function (x) { return String(x).split('').map(Number); };
  const qs = function (x) { return ziffern(x).reduce(function (a, b) { return a + b; }, 0); };
  const STUFEN = ['', 'Leicht', 'Mittel', 'Schwer', 'Profi'];

  // ---------- Kategorien ----------
  const KATEGORIEN = [
    ['plusminus', 'Plus und Minus'], ['mal', 'Malnehmen'], ['quadrat', 'Quadrate und Potenzen'], ['wurzel', 'Wurzeln'],
    ['teilen', 'Teilen und Teilbarkeit'], ['prozent', 'Prozent und Dreisatz'], ['bruch', 'Brüche, Komma, Einheiten'], ['komma', 'Kommazahlen und Zehnerpotenzen'],
    ['ueberschlag', 'Überschlag im Beruf'], ['profi', 'Profi: Logarithmus, Dezibel, Kalender']
  ];

  const T = [];
  function trick(d) { T.push(d); }

  // ===================== Plus und Minus =====================
  trick({ id: 'ergaenzen', kat: 'plusminus', titel: 'Auf runde Zahlen ergänzen', ab: 1, bis: 4,
    kurz: 'Statt 98 rechnest du 100 und ziehst 2 wieder ab.',
    anleitung: ['Suche bei der zweiten Zahl die nächste runde Zahl (Zehner, Hunderter, Tausender).', 'Rechne mit der runden Zahl.', 'Gleiche den Unterschied aus: Beim Plus zu viel addiert → wieder abziehen; beim Minus zu viel abgezogen → wieder dazuzählen.'],
    aufgabe: function (st) {
      const R = [0, 10, 100, 1000, 10000][st], k = st === 1 ? zuf(2, 8) : zuf(1, 9), d = st === 1 ? zuf(1, 3) : st === 2 ? zuf(1, 4) : st === 3 ? zuf(1, 30) : zuf(1, 300);
      const b = k * R - d, plus = Math.random() < 0.5;
      const a = plus ? zuf([0, 20, 100, 1000, 10000][st], [0, 89, 899, 8999, 89999][st]) : zuf(b + [0, 5, 20, 100, 1000][st], b + [0, 60, 800, 8000, 80000][st]);
      const r = plus ? a + b : a - b, m = k * R, zw = plus ? a + m : a - m, tr = plus ? zw - d : zw + d;
      return { frage: tx(a) + (plus ? ' + ' : ' - ') + tx(b), antwort: r, trick: tr,
        schritte: ['$' + tx(b) + ' = ' + tx(m) + ' - ' + tx(d) + '$', '$' + tx(a) + (plus ? ' + ' : ' - ') + tx(m) + ' = ' + tx(zw) + '$', (plus ? 'Zu viel addiert, also $' + tx(d) + '$ abziehen: $' + tx(zw) + ' - ' + tx(d) : 'Zu viel abgezogen, also $' + tx(d) + '$ dazu: $' + tx(zw) + ' + ' + tx(d)) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'vonlinks', kat: 'plusminus', titel: 'Von links nach rechts addieren', ab: 1, bis: 4,
    kurz: 'Erst die großen Stellen, dann die kleinen – so behältst du Zwischenergebnisse im Kopf.',
    anleitung: ['Zerlege die zweite Zahl in Tausender, Hunderter, Zehner und Einer.', 'Addiere die Teile von links nach rechts zur ersten Zahl.', 'Sprich das Zwischenergebnis jedes Mal laut oder leise mit.'],
    aufgabe: function (st) {
      const st0 = Math.min(st, 3), lo = [0, 12, 120, 1200][st0], hi = [0, 99, 999, 9999][st0];
      const zahlen = [zuf(lo, hi), zuf(lo, hi)]; if (st === 4) zahlen.push(zuf(1200, 9999));
      let summe = zahlen[0]; const schritte = [];
      for (let i = 1; i < zahlen.length; i++) {
        const z = zahlen[i], teile = []; let rest = z;
        [1000, 100, 10, 1].forEach(function (p) { const t = Math.floor(rest / p) * p; if (t) teile.push(t); rest -= t; });
        schritte.push('$' + tx(z) + ' = ' + teile.map(function (t) { return tx(t); }).join(' + ') + '$');
        teile.forEach(function (t) { const neu = summe + t; schritte.push('$' + tx(summe) + ' + ' + tx(t) + ' = ' + tx(neu) + '$'); summe = neu; });
      }
      return { frage: zahlen.map(function (z) { return tx(z); }).join(' + '), antwort: zahlen.reduce(function (a, b) { return a + b; }, 0), trick: summe, schritte: schritte };
    } });

  trick({ id: 'abziehen', kat: 'plusminus', titel: 'Von 100, 1000 oder 10 000 abziehen', ab: 1, bis: 4,
    kurz: 'Alle Ziffern von 9, die letzte von 10 – ganz ohne Übertrag.',
    anleitung: ['Schreibe die abzuziehende Zahl mit so vielen Stellen, wie die runde Zahl Nullen hat (vorne mit Nullen auffüllen).', 'Ziehe jede Ziffer von 9 ab – nur die letzte Ziffer (ungleich 0) von 10.', 'Die Ergebnisziffern hintereinander geschrieben sind das Ergebnis.'],
    aufgabe: function (st) {
      const n = st + 1, N = Math.pow(10, st === 4 ? 6 : n), stellen = st === 4 ? 6 : n;
      let x = zuf(Math.pow(10, stellen - 1) + 1, N - 1); if (x % 10 === 0) x += zuf(1, 9); if (x >= N) x = N - 3;
      const d = ziffern(block(x, stellen)), e = d.map(function (z, i) { return i === d.length - 1 ? 10 - z : 9 - z; });
      const tr = Number(e.join(''));
      return { frage: tx(N) + ' - ' + tx(x), antwort: N - x, trick: tr,
        schritte: ['Ziffern von $' + tx(x) + '$: ' + d.join(' · '), 'Von 9 (die letzte von 10): ' + d.map(function (z, i) { return (i === d.length - 1 ? '10−' : '9−') + z + '=' + e[i]; }).join(', '), 'Ergebnis: $' + tx(tr) + '$'] };
    } });

  trick({ id: 'gauss', kat: 'plusminus', titel: 'Summen wie Gauß', ab: 2, bis: 4,
    kurz: 'Erste plus letzte Zahl, mal Anzahl, durch 2.',
    anleitung: ['Zähle, wie viele Zahlen es sind: $n = \\frac{\\text{letzte} - \\text{erste}}{\\text{Abstand}} + 1$.', 'Bilde Paare von außen nach innen: Jedes Paar hat dieselbe Summe erste + letzte.', 'Summe $= \\frac{(\\text{erste} + \\text{letzte}) \\cdot n}{2}$.'],
    aufgabe: function (st) {
      let a, d, n;
      if (st === 2) { a = 1; d = 1; n = zuf(10, 100); } else if (st === 3) { a = zuf(10, 200); d = 1; n = zuf(10, 150); } else { a = zuf(3, 50); d = zuf(2, 9); n = zuf(10, 60); }
      const b = a + (n - 1) * d, s = (a + b) * n / 2;
      const frage = d === 1 ? tx(a) + ' + ' + tx(a + 1) + ' + \\ldots + ' + tx(b) : tx(a) + ' + ' + tx(a + d) + ' + ' + tx(a + 2 * d) + ' + \\ldots + ' + tx(b);
      return { frage: frage, antwort: s, trick: (a + b) * n / 2,
        schritte: ['Anzahl: $n = \\frac{' + tx(b) + ' - ' + tx(a) + '}{' + d + '} + 1 = ' + n + '$', 'Paarsumme: $' + tx(a) + ' + ' + tx(b) + ' = ' + tx(a + b) + '$', 'Summe: $\\frac{' + tx(a + b) + ' \\cdot ' + n + '}{2} = ' + tx(s) + '$'] };
    } });

  // ===================== Malnehmen =====================
  trick({ id: 'mal5', kat: 'mal', titel: 'Mal 5, 25, 50 und 125', ab: 1, bis: 4,
    kurz: '×5 = ×10 : 2, ×25 = ×100 : 4, ×125 = ×1000 : 8.',
    anleitung: ['$5 = \\frac{10}{2}$, $25 = \\frac{100}{4}$, $50 = \\frac{100}{2}$, $125 = \\frac{1000}{8}$.', 'Hänge die Nullen an und teile dann durch 2, 4 oder 8.', 'Oder erst teilen, dann Nullen anhängen – was gerade glatter aufgeht.'],
    aufgabe: function (st) {
      const f = st === 1 ? 5 : st === 2 ? wahl([25, 50]) : st === 3 ? wahl([25, 125]) : 125;
      const x = st === 1 ? zuf(12, 98) : st === 2 ? zuf(12, 99) : st === 3 ? zuf(24, 480) : zuf(101, 999);
      const p = { 5: [10, 2], 25: [100, 4], 50: [100, 2], 125: [1000, 8] }[f], tr = x * p[0] / p[1];
      return { frage: tx(x) + ' \\cdot ' + f, antwort: x * f, trick: tr,
        schritte: ['$' + f + ' = \\frac{' + tx(p[0]) + '}{' + p[1] + '}$', '$' + tx(x) + ' \\cdot ' + tx(p[0]) + ' = ' + tx(x * p[0]) + '$', '$' + tx(x * p[0]) + ' : ' + p[1] + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'mal9', kat: 'mal', titel: 'Mal 9, 99, 999 und Ähnliches', ab: 1, bis: 4,
    kurz: '×99 = ×100 − 1×. Funktioniert mit allen Zahlen knapp unter einer runden.',
    anleitung: ['Schreibe den Faktor als runde Zahl minus Rest: $99 = 100 - 1$, $998 = 1000 - 2$.', 'Rechne mal die runde Zahl (Nullen anhängen).', 'Ziehe die Zahl mal Rest wieder ab.'],
    aufgabe: function (st) {
      const R = st === 1 ? 10 : st === 2 ? 100 : 1000, rest = st <= 2 ? 1 : st === 3 ? 1 : zuf(2, 8), f = R * (st === 4 && Math.random() < 0.4 ? 10 : 1) - rest;
      const RR = f + rest, x = st === 1 ? zuf(12, 99) : st === 2 ? zuf(12, 99) : st === 3 ? zuf(12, 999) : zuf(23, 999);
      const tr = x * RR - x * rest;
      return { frage: tx(x) + ' \\cdot ' + tx(f), antwort: x * f, trick: tr,
        schritte: ['$' + tx(f) + ' = ' + tx(RR) + ' - ' + rest + '$', '$' + tx(x) + ' \\cdot ' + tx(RR) + ' = ' + tx(x * RR) + '$', '$' + tx(x) + ' \\cdot ' + rest + ' = ' + tx(x * rest) + '$', '$' + tx(x * RR) + ' - ' + tx(x * rest) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'mal11', kat: 'mal', titel: 'Mal 11', ab: 1, bis: 4,
    kurz: 'Ränder bleiben, dazwischen kommen die Summen benachbarter Ziffern.',
    anleitung: ['Schreibe die erste und die letzte Ziffer der Zahl an die Ränder.', 'Dazwischen steht jeweils die Summe zweier benachbarter Ziffern.', 'Ist eine Summe 10 oder mehr, gib die 1 nach links weiter (von rechts nach links arbeiten).'],
    aufgabe: function (st) {
      let x;
      if (st === 1) { const a = zuf(1, 8); x = a * 10 + zuf(0, 9 - a); } else if (st === 2) { do { x = zuf(19, 99); } while (Math.floor(x / 10) + x % 10 < 10); } else if (st === 3) x = zuf(123, 989); else x = zuf(1234, 9898);
      const d = ziffern(x), summen = [d[0]];
      for (let i = 1; i < d.length; i++) summen.push(d[i - 1] + d[i]);
      summen.push(d[d.length - 1]);
      // Überträge von rechts
      const erg = []; let ue = 0;
      for (let i = summen.length - 1; i >= 0; i--) { const s = summen[i] + ue; erg.unshift(i === 0 ? s : s % 10); ue = i === 0 ? 0 : Math.floor(s / 10); }
      const tr = Number(erg.join(''));
      return { frage: tx(x) + ' \\cdot 11', antwort: x * 11, trick: tr,
        schritte: ['Ränder: ' + d[0] + ' … ' + d[d.length - 1], 'Nachbarsummen: ' + summen.slice(1, -1).map(function (s, i) { return d[i] + '+' + d[i + 1] + '=' + s; }).join(', '), 'Blöcke ' + summen.join(' | ') + (summen.some(function (s, i) { return i > 0 && s >= 10; }) ? ' – Überträge nach links weitergeben' : ''), 'Ergebnis: $' + tx(tr) + '$'] };
    } });

  trick({ id: 'zerlegen', kat: 'mal', titel: 'Zerlegen: nahe an runden Zahlen', ab: 1, bis: 4,
    kurz: '7 · 48 = 7 · 50 − 7 · 2. Oder 23 · 47 = 20 · 47 + 3 · 47.',
    anleitung: ['Zerlege einen Faktor in eine runde Zahl und einen kleinen Rest.', 'Multipliziere beide Teile einzeln.', 'Addiere oder subtrahiere die Teilergebnisse (Distributivgesetz).'],
    aufgabe: function (st) {
      let a, b, R, d, plus;
      if (st === 1) { a = zuf(3, 9); R = zuf(2, 9) * 10; d = zuf(1, 3); plus = Math.random() < 0.5; b = plus ? R + d : R - d; }
      else if (st === 2) { a = zuf(3, 9); R = zuf(2, 9) * 100; d = zuf(1, 4); plus = Math.random() < 0.5; b = plus ? R + d : R - d; }
      else if (st === 3) { a = zuf(13, 49); b = zuf(13, 99); R = Math.floor(a / 10) * 10; d = a - R; plus = true; const tr = R * b + d * b;
        return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr, schritte: ['$' + tx(a) + ' = ' + R + ' + ' + d + '$', '$' + R + ' \\cdot ' + tx(b) + ' = ' + tx(R * b) + '$', '$' + d + ' \\cdot ' + tx(b) + ' = ' + tx(d * b) + '$', '$' + tx(R * b) + ' + ' + tx(d * b) + ' = ' + tx(tr) + '$'] }; }
      else { a = zuf(13, 79); R = zuf(2, 19) * 50; d = zuf(1, 4); plus = Math.random() < 0.4; b = plus ? R + d : R - d; }
      const tr = plus ? a * R + a * d : a * R - a * d;
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr,
        schritte: ['$' + tx(b) + ' = ' + tx(R) + (plus ? ' + ' : ' - ') + d + '$', '$' + tx(a) + ' \\cdot ' + tx(R) + ' = ' + tx(a * R) + '$', '$' + tx(a) + ' \\cdot ' + d + ' = ' + tx(a * d) + '$', '$' + tx(a * R) + (plus ? ' + ' : ' - ') + tx(a * d) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'verdoppeln', kat: 'mal', titel: 'Halbieren und Verdoppeln', ab: 1, bis: 3,
    kurz: '16 · 35 = 8 · 70 = 560. Ein Faktor halb, der andere doppelt – das Produkt bleibt gleich.',
    anleitung: ['Halbiere den geraden Faktor, verdopple den anderen.', 'Wiederhole, bis eine leichte Aufgabe entsteht (oft mit einer runden Zahl).', 'Besonders gut bei Faktoren, die auf 5 enden.'],
    aufgabe: function (st) {
      let a, b;
      if (st === 1) { a = zuf(2, 9) * 2; b = wahl([15, 25, 35, 45]); } else if (st === 2) { a = zuf(3, 12) * 4; b = wahl([15, 35, 45, 55, 65, 75, 125]); } else { a = zuf(3, 15) * 8; b = wahl([35, 45, 65, 75, 125, 175, 225, 375]); }
      let x = a, y = b; const schritte = [];
      for (let i = 0; i < 4 && x % 2 === 0 && y % 10 !== 0; i++) { schritte.push('$' + tx(x) + ' \\cdot ' + tx(y) + ' = ' + tx(x / 2) + ' \\cdot ' + tx(y * 2) + '$'); x /= 2; y *= 2; }
      schritte.push('$' + tx(x) + ' \\cdot ' + tx(y) + ' = ' + tx(x * y) + '$');
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: x * y, schritte: schritte };
    } });

  trick({ id: 'nahe100', kat: 'mal', titel: 'Zahlen nahe 100 oder 1000', ab: 2, bis: 4,
    kurz: '97 · 94: links 97 − 6 = 91, rechts 3 · 6 = 18 → 9118.',
    anleitung: ['Bestimme die Abstände zur Basis 100 (oder 1000): unter der Basis negativ, darüber positiv.', 'Links: erste Zahl plus Abstand der zweiten (über Kreuz).', 'Rechts: Abstand mal Abstand – mit zwei Stellen bei Basis 100, drei bei 1000.', 'Links mal Basis plus rechts. Ist rechts negativ, wird es abgezogen.'],
    aufgabe: function (st) {
      const B = st === 4 ? 1000 : 100, w = st === 2 ? [-12, -1] : st === 3 ? [-12, 12] : [-25, 25];
      let p, q; do { p = zuf(w[0], w[1]); q = zuf(w[0], w[1]); } while (p === 0 || q === 0);
      const a = B + p, b = B + q, links = a + q, rechts = p * q, tr = links * B + rechts, n = B === 100 ? 2 : 3;
      const vz = function (x) { return x < 0 ? '(' + x + ')' : String(x); };
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr,
        schritte: ['Abstände zu ' + tx(B) + ': $' + vz(p) + '$ und $' + vz(q) + '$', 'Links: $' + tx(a) + (q < 0 ? ' - ' + (-q) : ' + ' + q) + ' = ' + tx(links) + '$', 'Rechts: $' + vz(p) + ' \\cdot ' + vz(q) + ' = ' + rechts + '$' + (rechts >= 0 && String(rechts).length <= n ? ' → ' + block(rechts, n) : ''), '$' + tx(links) + ' \\cdot ' + tx(B) + (rechts < 0 ? ' - ' + tx(-rechts) : ' + ' + tx(rechts)) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'zehner', kat: 'mal', titel: 'Gleicher Anfang, Einer ergeben 10', ab: 2, bis: 4,
    kurz: '43 · 47: 4 · 5 = 20, 3 · 7 = 21 → 2021.',
    anleitung: ['Geht, wenn der vordere Teil gleich ist und die Einer zusammen 10 ergeben.', 'Links: vorderer Teil mal (vorderer Teil + 1).', 'Rechts: Einer mal Einer, immer zweistellig (09 statt 9).', 'Profi-Abwandlung: Einer gleich, Zehner ergeben 10 (37 · 77): links Zehner mal Zehner plus Einer, rechts Einer².'],
    aufgabe: function (st) {
      if (st >= 3 && Math.random() < 0.3) {
        const t = zuf(1, 9), u = zuf(1, 9), a = 10 * t + u, b = 10 * (10 - t) + u, links = t * (10 - t) + u, tr = links * 100 + u * u;
        return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr,
          schritte: ['Einer gleich (' + u + '), Zehner ' + t + ' + ' + (10 - t) + ' = 10', 'Links: $' + t + ' \\cdot ' + (10 - t) + ' + ' + u + ' = ' + links + '$', 'Rechts: $' + u + '^2 = ' + u * u + '$ → ' + block(u * u, 2), 'Ergebnis: $' + tx(tr) + '$'] };
      }
      const t = st === 2 ? zuf(1, 9) : st === 3 ? zuf(10, 19) : zuf(20, 99), u = wahl([1, 2, 3, 4, 6, 7, 8, 9]), a = 10 * t + u, b = 10 * t + 10 - u, links = t * (t + 1), rechts = u * (10 - u), tr = links * 100 + rechts;
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr,
        schritte: ['Vorne gleich: ' + t + ', Einer ' + u + ' + ' + (10 - u) + ' = 10', 'Links: $' + t + ' \\cdot ' + (t + 1) + ' = ' + tx(links) + '$', 'Rechts: $' + u + ' \\cdot ' + (10 - u) + ' = ' + rechts + '$ → ' + block(rechts, 2), 'Ergebnis: $' + tx(tr) + '$'] };
    } });

  trick({ id: 'binomisch', kat: 'mal', titel: 'Mitte suchen: (m − d)(m + d) = m² − d²', ab: 2, bis: 4,
    kurz: '48 · 52 = 50² − 2² = 2496.',
    anleitung: ['Liegen beide Zahlen gleich weit um eine runde Mitte, suche die Mitte $m$ und den Abstand $d$.', 'Rechne $m^2 - d^2$ (dritte binomische Formel).', 'Ist die Mitte keine runde Zahl, hilft der Quadrat-Trick für Zahlen auf 5.'],
    aufgabe: function (st) {
      let m, d;
      if (st === 2) { m = zuf(2, 9) * 10; d = zuf(1, 5); } else if (st === 3) { m = wahl([50, 100, 150, 200, 250, 300, 400, 500]); d = zuf(1, 12); } else { m = Math.random() < 0.5 ? zuf(2, 9) * 10 + 5 : zuf(11, 49) * 10; d = zuf(2, 9); }
      const a = m - d, b = m + d, tr = m * m - d * d;
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: tr,
        schritte: ['Mitte $m = ' + tx(m) + '$, Abstand $d = ' + d + '$', '$m^2 = ' + tx(m * m) + '$, $d^2 = ' + d * d + '$', '$' + tx(m * m) + ' - ' + d * d + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'ueberkreuz', kat: 'mal', titel: 'Überkreuz-Multiplikation', ab: 3, bis: 4,
    kurz: 'Jede zweistellige Multiplikation in einer Zeile: rechts, über Kreuz, links.',
    anleitung: ['Schreibe die Zahlen untereinander. Rechne Spalte für Spalte von rechts.', 'Einer: Einer mal Einer. Zehner: über Kreuz (Zehner · Einer + Einer · Zehner). Hunderter: Zehner mal Zehner.', 'Bei dreistelligen Zahlen kommen weitere Kreuze dazu: Jede Spalte summiert alle Produkte, deren Stellen zusammen diese Spalte ergeben.', 'Von jeder Spalte bleibt nur die Einerziffer stehen, der Rest wandert als Übertrag nach links.'],
    aufgabe: function (st) {
      const a = st === 3 ? zuf(12, 99) : zuf(102, 999), b = st === 3 ? zuf(12, 99) : (Math.random() < 0.5 ? zuf(12, 99) : zuf(102, 999));
      const A = ziffern(a).reverse(), B = ziffern(b).reverse(), sp = [];
      for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) sp[i + j] = (sp[i + j] || 0) + A[i] * B[j];
      const namen = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender'], schritte = [];
      sp.forEach(function (s, k) {
        const teile = []; for (let i = 0; i < A.length; i++) { const j = k - i; if (j >= 0 && j < B.length) teile.push(A[i] + '·' + B[j]); }
        schritte.push((namen[k] || 'Stelle ' + k) + ': ' + teile.join(' + ') + ' = ' + s);
      });
      let ue = 0, erg = '';
      sp.forEach(function (s, k) { const w = s + ue; if (k === sp.length - 1) erg = String(w) + erg; else { erg = String(w % 10) + erg; ue = Math.floor(w / 10); } });
      schritte.push('Überträge von rechts nach links: $' + tx(Number(erg)) + '$');
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: a * b, trick: Number(erg), schritte: schritte };
    } });

  // ===================== Quadrate und Potenzen =====================
  trick({ id: 'quadrat5', kat: 'quadrat', titel: 'Quadrat von Zahlen auf 5', ab: 1, bis: 4,
    kurz: '65² = 6 · 7 | 25 = 4225.',
    anleitung: ['Streiche die 5 am Ende; übrig bleibt $n$.', 'Rechne $n \\cdot (n + 1)$.', 'Hänge 25 an.'],
    aufgabe: function (st) {
      const n = st === 1 ? zuf(1, 9) : st === 2 ? zuf(10, 19) : st === 3 ? zuf(10, 99) : zuf(100, 199), x = 10 * n + 5, tr = n * (n + 1) * 100 + 25;
      return { frage: tx(x) + '^2', antwort: x * x, trick: tr, schritte: ['Ohne die 5: $n = ' + n + '$', '$' + n + ' \\cdot ' + (n + 1) + ' = ' + tx(n * (n + 1)) + '$', '25 anhängen: $' + tx(tr) + '$'] };
    } });

  trick({ id: 'quadrat50', kat: 'quadrat', titel: 'Quadrat nahe 50 und 500', ab: 2, bis: 3,
    kurz: '53² = (25 + 3) | 3² = 2809.',
    anleitung: ['Schreibe die Zahl als $50 + d$ (oder $50 - d$).', 'Links: $25 + d$ (oder $25 - d$).', 'Rechts: $d^2$ zweistellig. Ergebnis: links mal 100 plus rechts.', 'Bei 500: links $250 \\pm d$, rechts $d^2$ dreistellig, links mal 1000.'],
    aufgabe: function (st) {
      const fuenfhundert = st === 3 && Math.random() < 0.6, B = fuenfhundert ? 500 : 50, d = fuenfhundert ? zuf(1, 31) : zuf(1, 9), plus = Math.random() < 0.5, x = plus ? B + d : B - d;
      const links = (B === 50 ? 25 : 250) + (plus ? d : -d), f = B === 50 ? 100 : 1000, tr = links * f + d * d;
      return { frage: tx(x) + '^2', antwort: x * x, trick: tr,
        schritte: ['$' + tx(x) + ' = ' + B + (plus ? ' + ' : ' - ') + d + '$', 'Links: $' + (B === 50 ? 25 : 250) + (plus ? ' + ' : ' - ') + d + ' = ' + links + '$', 'Rechts: $' + d + '^2 = ' + d * d + '$ → ' + block(d * d, B === 50 ? 2 : 3), '$' + links + ' \\cdot ' + tx(f) + ' + ' + d * d + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'quadrat100', kat: 'quadrat', titel: 'Quadrat nahe 100 und 1000', ab: 2, bis: 4,
    kurz: '104² = (104 + 4) | 4² = 10816. 97² = (97 − 3) | 3² = 9409.',
    anleitung: ['Abstand $d$ zur Basis 100 (oder 1000) bestimmen, darunter negativ.', 'Links: Zahl plus Abstand.', 'Rechts: $d^2$ – zweistellig bei 100, dreistellig bei 1000 (Überlauf wandert nach links).'],
    aufgabe: function (st) {
      const B = st === 4 ? 1000 : 100, w = st === 2 ? 9 : st === 3 ? 30 : 60;
      let d; do { d = zuf(-w, w); } while (d === 0);
      const x = B + d, links = x + d, tr = links * B + d * d, n = B === 100 ? 2 : 3;
      return { frage: tx(x) + '^2', antwort: x * x, trick: tr,
        schritte: ['Abstand zu ' + tx(B) + ': $d = ' + d + '$', 'Links: $' + tx(x) + (d < 0 ? ' - ' + (-d) : ' + ' + d) + ' = ' + tx(links) + '$', 'Rechts: $d^2 = ' + d * d + '$' + (String(d * d).length <= n ? ' → ' + block(d * d, n) : ' (Überlauf nach links)'), '$' + tx(links) + ' \\cdot ' + tx(B) + ' + ' + d * d + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'quadratAllg', kat: 'quadrat', titel: 'Jedes Quadrat: a² = (a − d)(a + d) + d²', ab: 3, bis: 4,
    kurz: '47² = 50 · 44 + 3² = 2209.',
    anleitung: ['Runde die Zahl auf die nächste Zehnerzahl; der Rundungsschritt ist $d$.', 'Gehe denselben Schritt in die andere Richtung: $(a - d)(a + d)$ – ein Faktor ist jetzt rund.', 'Addiere $d^2$.'],
    aufgabe: function (st) {
      let a; do { a = st === 3 ? zuf(13, 99) : zuf(102, 999); } while (a % 10 === 0 || a % 10 === 5);
      const R = Math.round(a / 10) * 10, d = R - a, b = a - d, tr = R * b + d * d;
      return { frage: tx(a) + '^2', antwort: a * a, trick: tr,
        schritte: ['Runden: $' + tx(a) + ' \\to ' + tx(R) + '$, Schritt ' + Math.abs(d), '$' + tx(R) + ' \\cdot ' + tx(b) + ' = ' + tx(R * b) + '$', '$+\\ ' + Math.abs(d) + '^2 = ' + d * d + '$', '$' + tx(R * b) + ' + ' + d * d + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'potenzen', kat: 'quadrat', titel: 'Potenzen aus bekannten Bausteinen', ab: 1, bis: 4,
    kurz: '2¹⁰ = 1024 merken – dann ist 2¹³ = 1024 · 8 = 8192.',
    anleitung: ['Merke Ankerwerte: $2^{10} = 1024$, $3^4 = 81$, $5^4 = 625$, $7^3 = 343$, $11^2 = 121$, $12^2 = 144$.', 'Zerlege den Exponenten: $a^{m+n} = a^m \\cdot a^n$.', 'Multipliziere die Bausteine.'],
    aufgabe: function (st) {
      const auswahl = st === 1 ? [[2, 4, 10], [3, 2, 4], [5, 2, 3], [10, 2, 6]] : st === 2 ? [[2, 8, 16], [3, 4, 6], [5, 3, 5], [11, 2, 3], [4, 3, 5]] : st === 3 ? [[2, 12, 20], [3, 5, 8], [7, 2, 4], [12, 2, 3], [15, 2, 3], [6, 3, 5]] : [[2, 20, 30], [3, 7, 10], [11, 3, 5], [25, 2, 4], [7, 4, 5], [13, 2, 3], [9, 4, 6]];
      const w = wahl(auswahl), a = w[0], n = zuf(w[1], w[2]);
      const anker = { 2: 10, 3: 4, 5: 4, 7: 3, 11: 2, 12: 2, 4: 3, 6: 3, 13: 2, 15: 2, 25: 2, 9: 3, 10: 3 }[a] || 2;
      const k = Math.min(anker, n), r = n - k, pk = Math.pow(a, k), pr = Math.pow(a, r);
      return { frage: a + '^{' + n + '}', antwort: Math.pow(a, n), trick: pk * pr,
        schritte: r ? ['$' + a + '^{' + n + '} = ' + a + '^{' + k + '} \\cdot ' + a + '^{' + r + '}$', '$' + a + '^{' + k + '} = ' + tx(pk) + '$, $' + a + '^{' + r + '} = ' + tx(pr) + '$', '$' + tx(pk) + ' \\cdot ' + tx(pr) + ' = ' + tx(pk * pr) + '$'] : ['Ankerwert: $' + a + '^{' + n + '} = ' + tx(pk) + '$'] };
    } });

  // ===================== Wurzeln =====================
  const PAAR = { 0: [0], 1: [1, 9], 4: [2, 8], 9: [3, 7], 6: [4, 6], 5: [5] };
  trick({ id: 'wurzelQ', kat: 'wurzel', titel: 'Quadratwurzel aus Quadratzahlen', ab: 1, bis: 4,
    kurz: '√7056: endet auf 6 → 4 oder 6; 70 liegt zwischen 8² und 9² → 84 oder 86; 85² = 7225 ist größer → 84.',
    anleitung: ['Endziffer: 1 → 1 oder 9, 4 → 2 oder 8, 9 → 3 oder 7, 6 → 4 oder 6, 5 → 5, 0 → 0.', 'Streiche die letzten zwei Ziffern. Suche die größte Zahl $t$, deren Quadrat in den Rest passt – das ist der Anfang der Wurzel.', 'Entscheide zwischen den zwei Kandidaten mit $(t5)^2 = t(t+1)|25$: Ist die Zahl kleiner, nimm den kleineren Kandidaten.'],
    aufgabe: function (st) {
      let r; do { r = st === 1 ? zuf(2, 25) : st === 2 ? zuf(21, 99) : st === 3 ? zuf(101, 316) : zuf(317, 999); } while (st > 1 && r % 10 === 0);
      const N = r * r, e = N % 10, vorn = Math.floor(N / 100), t = Math.floor(Math.sqrt(vorn) + 1e-9), kand = PAAR[e].map(function (x) { return t * 10 + x; });
      const mitte = (10 * t + 5) * (10 * t + 5), tr = kand.length === 1 ? kand[0] : (N < mitte ? Math.min.apply(null, kand) : Math.max.apply(null, kand));
      if (st === 1) return { frage: '\\sqrt{' + tx(N) + '}', antwort: r, trick: r, schritte: ['Quadratzahlen bis $25^2 = 625$ auswendig: $' + r + '^2 = ' + tx(N) + '$'] };
      return { frage: '\\sqrt{' + tx(N) + '}', antwort: r, trick: tr,
        schritte: ['Endziffer ' + e + ' → Wurzel endet auf ' + PAAR[e].join(' oder '), 'Ohne die letzten zwei Ziffern: ' + tx(vorn) + '; $' + t + '^2 = ' + tx(t * t) + ' \\le ' + tx(vorn) + ' < ' + tx((t + 1) * (t + 1)) + '$ → Anfang ' + t, kand.length > 1 ? 'Kandidaten ' + kand.join(' oder ') + '; $' + (10 * t + 5) + '^2 = ' + tx(mitte) + '$ ist ' + (N < mitte ? 'größer → der kleinere' : 'kleiner → der größere') : 'Nur ein Kandidat', '$\\sqrt{' + tx(N) + '} = ' + tx(tr) + '$'] };
    } });

  const KUBEND = { 0: 0, 1: 1, 2: 8, 3: 7, 4: 4, 5: 5, 6: 6, 7: 3, 8: 2, 9: 9 };
  trick({ id: 'wurzelK', kat: 'wurzel', titel: 'Kubikwurzel aus Kubikzahlen', ab: 2, bis: 4,
    kurz: '∛357911: endet auf 1 → Einer 1; 357 liegt zwischen 7³ = 343 und 8³ → 71.',
    anleitung: ['Lerne die Würfelzahlen $1^3$ bis $10^3$: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.', 'Die Endziffer verrät die Einer eindeutig: 2 ↔ 8 und 3 ↔ 7 tauschen, alle anderen bleiben gleich.', 'Streiche die letzten drei Ziffern. Die größte Zahl, deren Würfel in den Rest passt, ist der Zehner.'],
    aufgabe: function (st) {
      let r; do { r = st === 2 ? zuf(11, 39) : st === 3 ? zuf(40, 99) : zuf(101, 299); } while (r % 10 === 0);
      const N = r * r * r, e = N % 10, vorn = Math.floor(N / 1000), t = Math.floor(Math.cbrt(vorn) + 1e-9), tr = t * 10 + KUBEND[e];
      return { frage: '\\sqrt[3]{' + tx(N) + '}', antwort: r, trick: tr,
        schritte: ['Endziffer ' + e + ' → Einer ' + KUBEND[e], 'Ohne die letzten drei Ziffern: ' + tx(vorn) + '; $' + t + '^3 = ' + tx(t * t * t) + ' \\le ' + tx(vorn) + ' < ' + tx((t + 1) * (t + 1) * (t + 1)) + '$', 'Anfang ' + t + ', Einer ' + KUBEND[e] + ' → $' + tx(tr) + '$'] };
    } });

  trick({ id: 'wurzel5', kat: 'wurzel', titel: 'Fünfte Wurzel (Profi-Kunststück)', ab: 4, bis: 4,
    kurz: 'Bei n⁵ ist die Endziffer immer gleich der von n – den Rest liefert eine kleine Tabelle.',
    anleitung: ['Die Endziffer von $n^5$ ist die Endziffer von $n$.', 'Streiche die letzten fünf Ziffern.', 'Vergleiche den Rest mit $1, 32, 243, 1024, 3125, 7776, 16807, 32768, 59049$ ($1^5$ bis $9^5$): die größte, die passt, ist der Zehner.'],
    aufgabe: function () {
      let n; do { n = zuf(11, 99); } while (n % 10 === 0);
      const N = Math.pow(n, 5), vorn = Math.floor(N / 100000);
      let t = 0; for (let k = 1; k <= 9; k++) if (Math.pow(k, 5) <= vorn) t = k;
      const tr = t * 10 + N % 10;
      return { frage: '\\sqrt[5]{' + tx(N) + '}', antwort: n, trick: tr,
        schritte: ['Endziffer ' + N % 10 + ' → Einer ' + N % 10, 'Ohne die letzten fünf Ziffern: ' + tx(vorn) + '; $' + t + '^5 = ' + tx(Math.pow(t, 5)) + '$ passt, $' + (t + 1) + '^5 = ' + tx(Math.pow(t + 1, 5)) + '$ nicht', 'Ergebnis $' + tr + '$'] };
    } });

  trick({ id: 'wurzelNaeh', kat: 'wurzel', titel: 'Wurzeln schätzen (Heron)', ab: 2, bis: 4,
    kurz: '√50 ≈ 7 + 1/14 ≈ 7,07. Nächste Quadratzahl plus Rest durch doppelte Wurzel.',
    anleitung: ['Suche die nächstgelegene Quadratzahl $a^2$.', 'Rechne $\\sqrt{n} \\approx a + \\frac{n - a^2}{2a}$ (bei kleinerem $n$ wird der Bruch negativ).', 'Genauigkeit: meist besser als 1 %, je größer $a$, desto genauer.'],
    aufgabe: function (st) {
      let n; do { n = st === 2 ? zuf(10, 99) : st === 3 ? zuf(101, 999) : zuf(1001, 9999); } while (Math.sqrt(n) % 1 === 0);
      const a = Math.round(Math.sqrt(n)), tr = a + (n - a * a) / (2 * a), w = Math.sqrt(n), dez = st === 2 ? 2 : 2;
      return { frage: '\\sqrt{' + tx(n) + '}', text: 'Auf zwei Nachkommastellen schätzen', antwort: w, trick: tr, toleranz: { abs: Math.max(0.006 * w * (st === 4 ? 0.3 : 1), Math.abs(tr - w) * 1.25 + 0.006) }, anzeige: zt(w, 3),
        schritte: ['Nächste Quadratzahl: $' + a + '^2 = ' + tx(a * a) + '$', '$\\sqrt{' + tx(n) + '} \\approx ' + a + ' + \\frac{' + tx(n - a * a) + '}{' + 2 * a + '} = ' + tx(tr, 3) + '$', 'Genau: $' + tx(w, 4) + '$'], ungefaehr: true, dez: dez };
    } });

  trick({ id: 'wurzelKomma', kat: 'wurzel', titel: 'Wurzeln aus Kommazahlen und großen Zahlen', ab: 2, bis: 4,
    kurz: '√0,0144 = 0,12: Komma bei Wurzeln immer in Zweierschritten verschieben.',
    anleitung: ['Teile die Zahl vom Komma aus in Zweiergruppen.', 'Jede Zweiergruppe unter der Wurzel wird zu einer Stelle im Ergebnis.', 'Ziehe die Wurzel aus der Zahl ohne Komma und setze das Komma passend: $\\sqrt{0{,}0144} = \\sqrt{144} \\cdot 10^{-2}$.'],
    aufgabe: function (st) {
      let r; do { r = st === 2 ? zuf(2, 20) : st === 3 ? zuf(11, 99) : zuf(101, 316); } while (r % 10 === 0);
      let m; do { m = st === 2 ? zuf(-2, 1) : zuf(-3, 2); } while (m === 0);
      const N = rund(r * r * Math.pow(10, 2 * m), 12), w = rund(r * Math.pow(10, m), 12);
      return { frage: '\\sqrt{' + tx(N) + '}', antwort: w, trick: rund(Math.sqrt(r * r) * Math.pow(10, m), 12),
        schritte: ['$' + tx(N) + ' = ' + tx(r * r) + ' \\cdot 10^{' + 2 * m + '}$', '$\\sqrt{' + tx(r * r) + '} = ' + r + '$, $\\sqrt{10^{' + 2 * m + '}} = 10^{' + m + '}$', '$' + r + ' \\cdot 10^{' + m + '} = ' + tx(w) + '$'] };
    } });

  // ===================== Teilen und Teilbarkeit =====================
  trick({ id: 'durch5', kat: 'teilen', titel: 'Durch 5, 25, 50 und 125 teilen', ab: 1, bis: 4,
    kurz: ': 5 = · 2 : 10. : 25 = · 4 : 100. : 125 = · 8 : 1000.',
    anleitung: ['$\\frac{1}{5} = \\frac{2}{10}$, $\\frac{1}{25} = \\frac{4}{100}$, $\\frac{1}{50} = \\frac{2}{100}$, $\\frac{1}{125} = \\frac{8}{1000}$.', 'Verdopple, vervierfache oder verachtfache.', 'Verschiebe das Komma um eine, zwei oder drei Stellen nach links.'],
    aufgabe: function (st) {
      const d = st === 1 ? 5 : st === 2 ? wahl([25, 50]) : st === 3 ? wahl([25, 125]) : 125;
      const x = st === 1 ? zuf(12, 499) : st === 2 ? zuf(12, 999) : st === 3 ? zuf(101, 4999) : zuf(1001, 99999);
      const p = { 5: [2, 10], 25: [4, 100], 50: [2, 100], 125: [8, 1000] }[d], tr = x * p[0] / p[1];
      return { frage: tx(x) + ' : ' + d, antwort: x / d, trick: tr,
        schritte: ['$' + tx(x) + ' \\cdot ' + p[0] + ' = ' + tx(x * p[0]) + '$', '$' + tx(x * p[0]) + ' : ' + tx(p[1]) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'kehrwert', kat: 'teilen', titel: 'Durch Kommazahlen teilen', ab: 2, bis: 3,
    kurz: ': 0,5 = · 2. : 0,25 = · 4. : 0,2 = · 5. : 1,25 = · 0,8.',
    anleitung: ['Teilen durch eine Zahl ist Malnehmen mit dem Kehrwert.', 'Merke: $0{,}5 \\to 2$, $0{,}25 \\to 4$, $0{,}2 \\to 5$, $0{,}125 \\to 8$, $1{,}25 \\to 0{,}8$, $2{,}5 \\to 0{,}4$, $0{,}75 \\to \\frac{4}{3}$.', 'Multipliziere mit dem Kehrwert.'],
    aufgabe: function (st) {
      const w = st === 2 ? wahl([[0.5, 2], [0.25, 4], [0.2, 5]]) : wahl([[0.125, 8], [1.25, 0.8], [2.5, 0.4], [0.4, 2.5], [0.75, 4 / 3]]);
      let x = st === 2 ? zuf(3, 99) : zuf(12, 480); if (w[0] === 0.75) x = zuf(4, 99) * 3;
      const tr = rund(x * w[1], 9);
      return { frage: tx(x) + ' : ' + tx(w[0]), antwort: rund(x / w[0], 9), trick: tr,
        schritte: ['Kehrwert von $' + tx(w[0]) + '$ ist $' + (w[0] === 0.75 ? '\\frac{4}{3}' : tx(w[1])) + '$', '$' + tx(x) + ' \\cdot ' + (w[0] === 0.75 ? '\\frac{4}{3}' : tx(w[1])) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'teilenZerlegen', kat: 'teilen', titel: 'Teilen durch Zerlegen', ab: 1, bis: 4,
    kurz: '1386 : 7 = 1400 : 7 − 14 : 7 = 200 − 2 = 198.',
    anleitung: ['Suche ein rundes Vielfaches des Teilers nahe der Zahl.', 'Teile das Vielfache und den Rest einzeln.', 'Addiere oder subtrahiere die beiden Ergebnisse.'],
    aufgabe: function (st) {
      const d = st === 1 ? zuf(3, 9) : st === 2 ? zuf(6, 19) : st === 3 ? zuf(12, 29) : zuf(13, 49);
      const q = st === 1 ? zuf(12, 99) : st === 2 ? zuf(21, 199) : st === 3 ? zuf(21, 299) : zuf(101, 999);
      const N = d * q, R = q >= 100 ? Math.round(q / 50) * 50 : Math.round(q / 10) * 10, m = q - R, tr = R + m;
      return { frage: tx(N) + ' : ' + d, antwort: q, trick: tr,
        schritte: ['$' + tx(N) + ' = ' + tx(d * R) + (m < 0 ? ' - ' + tx(-d * m) : ' + ' + tx(d * m)) + '$', '$' + tx(d * R) + ' : ' + d + ' = ' + tx(R) + '$, $' + tx(Math.abs(d * m)) + ' : ' + d + ' = ' + Math.abs(m) + '$', '$' + tx(R) + (m < 0 ? ' - ' + (-m) : ' + ' + m) + ' = ' + tx(tr) + '$'] };
    } });

  trick({ id: 'teilbar', kat: 'teilen', titel: 'Teilbarkeit und Rest', ab: 1, bis: 4,
    kurz: 'Rest bei 9 = Rest der Quersumme. Bei 11: Ziffern abwechselnd + und −. Bei 7 und 13: Dreiergruppen abwechselnd.',
    anleitung: ['Durch 3 und 9: Die Quersumme hat denselben Rest wie die Zahl.', 'Durch 4, 8 und 25: Nur die letzten zwei (bei 8: drei) Ziffern zählen.', 'Durch 11: Ziffern von rechts abwechselnd addieren und subtrahieren (alternierende Quersumme).', 'Durch 7 und 13: Dreiergruppen von rechts abwechselnd addieren und subtrahieren, denn $1001 = 7 \\cdot 11 \\cdot 13$.'],
    aufgabe: function (st) {
      const d = st === 1 ? wahl([3, 9]) : st === 2 ? wahl([4, 8, 25]) : st === 3 ? 11 : wahl([7, 13]);
      const x = st === 1 ? zuf(1000, 99999) : st === 2 ? zuf(1000, 999999) : st === 3 ? zuf(10000, 9999999) : zuf(1000000, 999999999);
      const rest = x % d, schritte = []; let tr;
      if (d === 3 || d === 9) { let s = x; while (s >= 10) { const q = qs(s); schritte.push('Quersumme von ' + tx(s) + ' = ' + q); s = q; } tr = s % d; schritte.push('Rest von ' + s + ' bei ' + d + ': ' + tr); }
      else if (d === 4 || d === 25) { const l = x % 100; tr = l % d; schritte.push('Nur die letzten zwei Ziffern: ' + block(l, 2), block(l, 2) + ' : ' + d + ' → Rest ' + tr); }
      else if (d === 8) { const l = x % 1000; tr = l % 8; schritte.push('Nur die letzten drei Ziffern: ' + block(l, 3), block(l, 3) + ' : 8 → Rest ' + tr); }
      else if (d === 11) { const z = ziffern(x).reverse(); let s = 0; z.forEach(function (c, i) { s += i % 2 ? -c : c; }); schritte.push('Von rechts: ' + z.map(function (c, i) { return (i ? (i % 2 ? '− ' : '+ ') : '') + c; }).join(' ') + ' = ' + s); tr = ((s % 11) + 11) % 11; schritte.push('Rest von ' + s + ' bei 11: ' + tr); }
      else { const g = []; let y = x; while (y > 0) { g.push(y % 1000); y = Math.floor(y / 1000); } let s = 0; g.forEach(function (c, i) { s += i % 2 ? -c : c; }); schritte.push('Dreiergruppen von rechts: ' + g.map(function (c, i) { return (i ? (i % 2 ? '− ' : '+ ') : '') + block(c, 3); }).join(' ') + ' = ' + s); tr = ((s % d) + d) % d; schritte.push('Rest von ' + s + ' bei ' + d + ': ' + tr); }
      return { frage: tx(x) + ' : ' + d, text: 'Welcher Rest bleibt?', antwort: rest, trick: tr, schritte: schritte, einheit: 'Rest' };
    } });

  trick({ id: 'neunerprobe', kat: 'teilen', titel: 'Neunerprobe: Ergebnis prüfen', ab: 2, bis: 4,
    kurz: 'Neunerrest der Faktoren multiplizieren – muss den Neunerrest des Ergebnisses ergeben.',
    anleitung: ['Bilde von jedem Faktor den Neunerrest (Quersumme so lange, bis eine Ziffer bleibt; 9 zählt als 0).', 'Multipliziere die Reste und bilde davon wieder den Neunerrest.', 'Vergleiche mit dem Neunerrest des angeblichen Ergebnisses. Ungleich → sicher falsch. Gleich → wahrscheinlich richtig (Zahlendreher findet die Probe nicht).'],
    aufgabe: function (st) {
      const a = st === 2 ? zuf(101, 999) : st === 3 ? zuf(1001, 9999) : zuf(10001, 99999), b = st === 2 ? zuf(12, 99) : st === 3 ? zuf(101, 999) : zuf(1001, 9999);
      const p = a * b, richtig = Math.random() < 0.5; let c = p;
      if (!richtig) { let fehler; do { fehler = zuf(1, 8) * Math.pow(10, zuf(0, String(p).length - 2)) * (Math.random() < 0.5 ? -1 : 1); } while (fehler % 9 === 0 || p + fehler <= 0); c = p + fehler; }
      const nr = function (x) { return x % 9; }, ra = nr(a), rb = nr(b), rab = nr(ra * rb), rc = nr(c), tr = rab === rc ? 'stimmt' : 'falsch';
      return { frage: tx(a) + ' \\cdot ' + tx(b) + ' = ' + tx(c), text: 'Stimmt das Ergebnis? Mit der Neunerprobe prüfen.', art: 'wahl', optionen: [['stimmt', 'stimmt'], ['falsch', 'falsch']], antwort: richtig ? 'stimmt' : 'falsch', trick: tr,
        schritte: ['Neunerreste: ' + tx(a) + ' → ' + ra + ', ' + tx(b) + ' → ' + rb, 'Produkt der Reste: ' + ra + ' · ' + rb + ' = ' + ra * rb + ' → ' + rab, 'Ergebnis ' + tx(c) + ' → ' + rc, rab === rc ? 'Gleich → stimmt' : 'Ungleich → falsch (richtig wäre $' + tx(p) + '$)'] };
    } });

  // ===================== Prozent und Dreisatz =====================
  function prozentTeile(p) {
    const teile = []; let rest = rund(p, 6);
    [[100, '100 %'], [50, '50 %'], [25, '25 %'], [10, '10 %'], [5, '5 %'], [1, '1 %'], [0.5, '0,5 %'], [0.1, '0,1 %']].forEach(function (b) { const n = Math.floor(rund(rest / b[0], 6)); if (n > 0) { teile.push([n, b[0]]); rest = rund(rest - n * b[0], 6); } });
    return teile;
  }
  trick({ id: 'prozentBausteine', kat: 'prozent', titel: 'Prozent aus Bausteinen', ab: 1, bis: 4,
    kurz: '35 % von 260 = 3 · 26 + 13 = 91. Aus 10 %, 5 % und 1 % lässt sich alles bauen.',
    anleitung: ['10 % = Komma eine Stelle nach links, 1 % = zwei Stellen, 5 % = Hälfte von 10 %, 50 % = Hälfte, 25 % = Viertel.', 'Zerlege den Prozentsatz in diese Bausteine.', 'Addiere die Bausteine.'],
    aufgabe: function (st) {
      const p = st === 1 ? wahl([10, 20, 30, 5, 15, 25, 50, 40]) : st === 2 ? wahl([12, 15, 35, 45, 65, 85, 2, 3, 11, 19, 21]) : st === 3 ? wahl([12.5, 17.5, 2.5, 7.5, 19, 37.5, 62.5, 16]) : wahl([0.4, 0.3, 112.5, 137.5, 104, 3.5, 0.6, 18.5]);
      const G = st === 1 ? zuf(4, 90) * 10 : st === 2 ? zuf(12, 99) * 10 : st === 3 ? zuf(12, 99) * 20 : zuf(101, 999) * 10;
      const teile = prozentTeile(p); let summe = 0; const zeilen = [];
      teile.forEach(function (t) { const w = rund(G * t[1] / 100 * t[0], 9); summe = rund(summe + w, 9); zeilen.push((t[0] > 1 ? t[0] + ' · ' : '') + zt(t[1]) + ' % = $' + tx(w) + '$'); });
      return { frage: tx(p) + '\\,\\%\\ \\text{von}\\ ' + tx(G), antwort: rund(G * p / 100, 9), trick: summe,
        schritte: ['10 % von ' + tx(G) + ' = $' + tx(G / 10) + '$, 1 % = $' + tx(G / 100) + '$'].concat(zeilen).concat(['Summe: $' + tx(summe) + '$']) };
    } });

  trick({ id: 'prozentTauschen', kat: 'prozent', titel: 'Prozent tauschen', ab: 1, bis: 3,
    kurz: '16 % von 25 = 25 % von 16 = 4.',
    anleitung: ['$x\\,\\%$ von $y$ ist dasselbe wie $y\\,\\%$ von $x$ – beides ist $\\frac{x \\cdot y}{100}$.', 'Tausche, wenn die andere Richtung leichter ist (25 %, 50 %, 20 % …).'],
    aufgabe: function (st) {
      const y = st === 1 ? wahl([50, 25, 20, 10]) : st === 2 ? wahl([25, 75, 20, 40, 5, 4]) : wahl([12.5, 125, 2.5, 8, 75, 60]);
      const x = st === 1 ? zuf(2, 24) * 2 : st === 2 ? zuf(12, 96) : zuf(16, 96) * 2;
      return { frage: tx(x) + '\\,\\%\\ \\text{von}\\ ' + tx(y), antwort: rund(x * y / 100, 9), trick: rund(y / 100 * x, 9),
        schritte: ['Tauschen: $' + tx(y) + '\\,\\%$ von $' + tx(x) + '$', '$' + tx(y) + '\\,\\% = ' + tx(y / 100) + '$', '$' + tx(y / 100) + ' \\cdot ' + tx(x) + ' = ' + tx(rund(x * y / 100, 9)) + '$'] };
    } });

  trick({ id: 'mwst', kat: 'prozent', titel: 'Mehrwertsteuer, Rabatt und Skonto', ab: 1, bis: 4,
    kurz: '+19 % = +20 % − 1 %. Netto aus Brutto: Brutto : 1,19. Steueranteil im Brutto: 19/119.',
    anleitung: ['Netto → Brutto: 20 % dazu, 1 % wieder ab (oder · 1,19).', 'Brutto → Netto: durch 1,19 – bei Vielfachen von 119 ganz leicht: 595 € = 5 · 119 € → 500 € netto.', 'Steuer im Brutto: Brutto · 19/119.', 'Kette: Listenpreis − Rabatt − Skonto, dann + Umsatzsteuer – jeweils als Faktor: · 0,8 · 0,98 · 1,19.'],
    aufgabe: function (st) {
      if (st === 1) { const n = zuf(1, 40) * 50, b = rund(n * 1.19, 9), tr = rund(n + n * 0.2 - n * 0.01, 9);
        return { frage: '\\text{Netto } ' + tx(n) + '\\,€ \\to \\text{Brutto}', antwort: b, trick: tr, einheit: '€', schritte: ['20 %: $' + tx(n * 0.2) + '$, 1 %: $' + tx(n * 0.01) + '$', '$' + tx(n) + ' + ' + tx(n * 0.2) + ' - ' + tx(n * 0.01) + ' = ' + tx(tr) + '\\,€$'] }; }
      if (st === 2) { const k = zuf(1, 60), b = 119 * k * (Math.random() < 0.5 ? 1 : 10), n = rund(b / 1.19, 9);
        return { frage: '\\text{Brutto } ' + tx(b) + '\\,€ \\to \\text{Netto}', antwort: n, trick: rund(b / 119 * 100, 9), einheit: '€', schritte: ['$' + tx(b) + ' = ' + tx(b / 119) + ' \\cdot 119$', 'Netto $= ' + tx(b / 119) + ' \\cdot 100 = ' + tx(n) + '\\,€$'] }; }
      if (st === 3) { const k = zuf(2, 90), b = 119 * k, s = 19 * k;
        return { frage: '\\text{Steuer in } ' + tx(b) + '\\,€ \\text{ brutto}', antwort: rund(b * 19 / 119, 9), trick: s, einheit: '€', schritte: ['$' + tx(b) + ' : 119 = ' + k + '$', 'Steuer $= ' + k + ' \\cdot 19 = ' + tx(s) + '\\,€$'] }; }
      const L = zuf(2, 60) * 100, r = wahl([10, 15, 20, 25, 30]), s = wahl([2, 3]);
      const nr = L * (1 - r / 100), ns = rund(nr * (1 - s / 100), 9), e = rund(ns * 1.19, 9);
      return { frage: tx(L) + '\\,€ - ' + r + '\\,\\% - ' + s + '\\,\\% + 19\\,\\%', text: 'Listenpreis, Rabatt, Skonto, dann Umsatzsteuer', antwort: e, trick: e, einheit: '€', toleranz: { abs: 0.011 }, anzeige: zt(e, 2),
        schritte: ['Rabatt: $' + tx(L) + ' \\cdot ' + tx(1 - r / 100) + ' = ' + tx(nr) + '$', 'Skonto: $' + tx(nr) + ' - ' + tx(nr * s / 100) + ' = ' + tx(ns) + '$', '+19 %: $' + tx(ns) + ' + ' + tx(ns * 0.2) + ' - ' + tx(ns * 0.01) + ' = ' + tx(e, 2) + '\\,€$'] };
    } });

  trick({ id: 'prozentAenderung', kat: 'prozent', titel: 'Prozente nacheinander', ab: 3, bis: 4,
    kurz: '+20 %, dann −20 % ergibt −4 %, nicht 0. Faktoren multiplizieren.',
    anleitung: ['Schreibe jede Änderung als Faktor: +20 % → 1,2; −20 % → 0,8.', 'Multipliziere die Faktoren.', 'Gesamtänderung = Faktor − 1. Ausgleich einer Senkung um $p$: $\\frac{p}{1 - p}$ (−20 % braucht +25 %).'],
    aufgabe: function (st) {
      if (st === 4 && Math.random() < 0.4) { const p = wahl([20, 25, 50, 10, 40, 60, 75, 80]), aus = rund(p / (100 - p) * 100, 9);
        return { frage: '-' + p + '\\,\\% \\to\\ ?', text: 'Um wie viel Prozent muss es danach steigen, um wieder auf den alten Wert zu kommen?', antwort: aus, trick: aus, einheit: '%', toleranz: { abs: 0.06 }, anzeige: zt(aus, 2),
          schritte: ['Faktor nach der Senkung: $' + tx(1 - p / 100) + '$', 'Ausgleich: $\\frac{1}{' + tx(1 - p / 100) + '} = ' + tx(1 / (1 - p / 100), 4) + '$', '→ $+' + tx(aus, 2) + '\\,\\%$'] }; }
      const n = st === 3 ? 2 : 3, ps = []; for (let i = 0; i < n; i++) { let p; do { p = wahl([-50, -25, -20, -10, -5, 5, 10, 20, 25, 50]); } while (ps.indexOf(p) >= 0); ps.push(p); }
      let f = 1; ps.forEach(function (p) { f *= 1 + p / 100; }); const g = rund((f - 1) * 100, 9);
      return { frage: ps.map(function (p) { return (p > 0 ? '+' : '') + p + '\\,\\%'; }).join(',\\ '), text: 'Gesamtänderung in Prozent (Abnahme mit Minus)?', antwort: g, trick: g, einheit: '%', negativ: true,
        schritte: ['Faktoren: ' + ps.map(function (p) { return '$' + tx(1 + p / 100) + '$'; }).join(' · '), 'Produkt: $' + tx(f) + '$', 'Änderung: $' + tx(f) + ' - 1 = ' + tx(f - 1) + '$ → $' + tx(g) + '\\,\\%$'] };
    } });

  trick({ id: 'dreisatz', kat: 'prozent', titel: 'Dreisatz im Kopf', ab: 1, bis: 4,
    kurz: 'Erst auf 1, dann auf die gesuchte Menge – oder gleich mit dem Verhältnis.',
    anleitung: ['Gerade Proportionalität (mehr → mehr): Wert durch alte Menge, mal neue Menge.', 'Umgekehrte Proportionalität (mehr Leute → weniger Zeit): Wert mal alte Menge, durch neue Menge.', 'Oft geht es direkt mit dem Verhältnis: 6 statt 4 ist das 1,5-Fache.'],
    aufgabe: function (st) {
      if (st === 1) { const k = zuf(2, 9), p = zuf(2, 30) * k, m = zuf(2, 12);
        return { frage: k + '\\text{ m kosten } ' + tx(p) + '\\,€', text: 'Was kosten ' + m + ' m?', antwort: p / k * m, trick: p / k * m, einheit: '€', schritte: ['1 m: $' + tx(p) + ' : ' + k + ' = ' + tx(p / k) + '\\,€$', m + ' m: $' + tx(p / k) + ' \\cdot ' + m + ' = ' + tx(p / k * m) + '\\,€$'] }; }
      if (st === 2) { const a = wahl([2, 3, 4, 6]), b = wahl([2, 3, 4, 6, 8, 12].filter(function (x) { return x !== a; })), t = a * b * zuf(1, 4), h = t / b;
        return { frage: a + '\\text{ Monteure brauchen } ' + t / a + '\\text{ h}', text: 'Wie lange brauchen ' + b + ' Monteure?', antwort: rund(h, 9), trick: rund(t / a * a / b, 9), einheit: 'h', schritte: ['Umgekehrt: mehr Leute, weniger Zeit', 'Arbeit: $' + a + ' \\cdot ' + tx(t / a) + ' = ' + t + '$ Stunden', '$' + t + ' : ' + b + ' = ' + tx(h) + '\\text{ h}$'] }; }
      if (st === 3) { const k = rund(zuf(15, 95) / 10, 1), p = rund(k * zuf(12, 48) / 4, 2), m = rund(zuf(15, 95) / 10, 1), w = rund(p / k * m, 9);
        return { frage: tx(k) + '\\text{ kg kosten } ' + tx(p) + '\\,€', text: 'Was kosten ' + zt(m) + ' kg?', antwort: w, trick: w, einheit: '€', toleranz: { abs: 0.011 }, anzeige: zt(w, 2), schritte: ['1 kg: $' + tx(p) + ' : ' + tx(k) + ' = ' + tx(p / k, 4) + '\\,€$', '$' + tx(p / k, 4) + ' \\cdot ' + tx(m) + ' \\approx ' + tx(w, 2) + '\\,€$'] }; }
      const m1 = zuf(2, 6), t1 = zuf(2, 8), l1 = m1 * t1 * zuf(5, 20), m2 = zuf(2, 8), t2 = zuf(2, 10), l2 = l1 / (m1 * t1) * m2 * t2;
      return { frage: m1 + '\\text{ Monteure, } ' + t1 + '\\text{ Tage: } ' + tx(l1) + '\\text{ m Kabel}', text: 'Wie viel Meter schaffen ' + m2 + ' Monteure in ' + t2 + ' Tagen?', antwort: rund(l2, 9), trick: rund(l2, 9), einheit: 'm',
        schritte: ['Pro Monteur und Tag: $' + tx(l1) + ' : (' + m1 + ' \\cdot ' + t1 + ') = ' + tx(l1 / (m1 * t1)) + '\\text{ m}$', '$' + tx(l1 / (m1 * t1)) + ' \\cdot ' + m2 + ' \\cdot ' + t2 + ' = ' + tx(l2) + '\\text{ m}$'] };
    } });

  // ===================== Brüche, Komma, Einheiten =====================
  trick({ id: 'stammbrueche', kat: 'bruch', titel: 'Brüche als Kommazahl', ab: 1, bis: 4,
    kurz: '⅛ = 0,125, ⅐ = 0,142857…, 1/16 = 0,0625. Ein paar Werte merken, den Rest ableiten.',
    anleitung: ['Merke: $\\frac{1}{8} = 0{,}125$, $\\frac{1}{16} = 0{,}0625$, $\\frac{1}{3} = 0{,}\\overline{3}$, $\\frac{1}{6} = 0{,}1\\overline{6}$, $\\frac{1}{9} = 0{,}\\overline{1}$, $\\frac{1}{11} = 0{,}\\overline{09}$, $\\frac{1}{12} = 0{,}08\\overline{3}$.', 'Siebtel: Die Ziffernfolge 142857 läuft im Kreis – $\\frac{3}{7} = 0{,}428571\\ldots$ beginnt bei der 4.', 'Vielfache: $\\frac{5}{8} = 5 \\cdot 0{,}125 = 0{,}625$.', 'Profi: $\\frac{1}{13} = 0{,}\\overline{076923}$, $\\frac{1}{17} = 0{,}0588235\\ldots$, $\\frac{1}{19} = 0{,}0526315\\ldots$'],
    aufgabe: function (st) {
      const nen = st === 1 ? wahl([2, 4, 5, 8, 10, 20, 25, 50]) : st === 2 ? wahl([8, 16, 40, 3, 6, 12]) : st === 3 ? wahl([7, 9, 11, 12, 6, 15]) : wahl([7, 13, 17, 19, 14, 21]);
      let z; do { z = zuf(1, nen - 1); } while (ggT(z, nen) !== 1);
      const w = z / nen, dez = st <= 2 ? 4 : st === 3 ? 4 : 5, basis = 1 / nen;
      return { frage: '\\frac{' + z + '}{' + nen + '}', text: 'Als Kommazahl (' + dez + ' Nachkommastellen genügen)', antwort: w, trick: z * basis, toleranz: { abs: 0.6 * Math.pow(10, -dez) }, anzeige: zt(w, dez + 2).replace(/0+$/, ''),
        schritte: ['$\\frac{1}{' + nen + '} = ' + tx(basis, dez + 2) + (nen % 2 === 0 || nen % 5 === 0 ? '' : '\\ldots') + '$', '$' + z + ' \\cdot ' + tx(basis, dez + 2) + ' = ' + tx(w, dez + 2) + '$'] };
    } });

  trick({ id: 'bruchRechnen', kat: 'bruch', titel: 'Brüche addieren und subtrahieren', ab: 2, bis: 4,
    kurz: 'Hauptnenner = kleinstes gemeinsames Vielfaches. Erweitern, rechnen, kürzen.',
    anleitung: ['Hauptnenner suchen: das kleinste gemeinsame Vielfache der Nenner.', 'Jeden Bruch auf den Hauptnenner erweitern.', 'Zähler verrechnen, Nenner bleibt. Dann kürzen. Antwort als Bruch (z. B. 7/12) oder Kommazahl.'],
    aufgabe: function (st) {
      const nmax = st === 2 ? 6 : st === 3 ? 12 : 16, anz = st === 4 ? 3 : 2, br = [];
      for (let i = 0; i < anz; i++) { const n = zuf(2, nmax); br.push([zuf(1, n - 1), n]); }
      const zeichen = [1]; for (let i = 1; i < anz; i++) zeichen.push(Math.random() < 0.6 ? 1 : -1);
      let H = 1; br.forEach(function (b) { H = kgV(H, b[1]); });
      let Z = 0; br.forEach(function (b, i) { Z += zeichen[i] * b[0] * H / b[1]; });
      if (Z <= 0) { for (let i = 1; i < anz; i++) zeichen[i] = 1; Z = 0; br.forEach(function (b) { Z += b[0] * H / b[1]; }); }
      const g = ggT(Z, H), zk = Z / g, hk = H / g;
      return { frage: br.map(function (b, i) { return (i ? (zeichen[i] > 0 ? ' + ' : ' - ') : '') + '\\frac{' + b[0] + '}{' + b[1] + '}'; }).join(''), art: 'bruch', antwort: Z / H, trick: zk / hk, toleranz: { abs: 0.0006 }, anzeige: hk === 1 ? String(zk) : zk + '/' + hk + ' ≈ ' + zt(Z / H, 4),
        schritte: ['Hauptnenner: ' + H, br.map(function (b, i) { return (i ? (zeichen[i] > 0 ? ' + ' : ' − ') : '') + '$\\frac{' + b[0] * H / b[1] + '}{' + H + '}$'; }).join(''), '$\\frac{' + Z + '}{' + H + '}' + (g > 1 ? ' = \\frac{' + zk + '}{' + hk + '}' : '') + '$'] };
    } });

  trick({ id: 'bruchMalDurch', kat: 'bruch', titel: 'Brüche malnehmen und teilen', ab: 1, bis: 4,
    kurz: 'Zähler mal Zähler, Nenner mal Nenner – vorher über Kreuz kürzen. Teilen = mal Kehrwert.',
    anleitung: ['Malnehmen: $\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$.', 'Vorher kürzen, auch über Kreuz: Zähler links mit Nenner rechts und umgekehrt – dann bleiben die Zahlen klein.', 'Teilen: mit dem Kehrwert malnehmen, $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$.', 'Antwort als Bruch (z. B. 3/8) oder als Kommazahl.'],
    aufgabe: function (st) {
      const nmax = [0, 5, 9, 12, 20][st], durch = st >= 2 && Math.random() < 0.5;
      const n1 = zuf(2, nmax), n2 = zuf(2, nmax), z1 = zuf(1, st === 1 ? n1 - 1 : nmax), z2 = zuf(1, st === 1 ? n2 - 1 : nmax);
      const Z = durch ? z1 * n2 : z1 * z2, N = durch ? n1 * z2 : n1 * n2, g = ggT(Z, N), zk = Z / g, nk = N / g;
      const b1 = '\\frac{' + z1 + '}{' + n1 + '}', b2 = '\\frac{' + z2 + '}{' + n2 + '}';
      return { frage: b1 + (durch ? ' : ' : ' \\cdot ') + b2, art: 'bruch', antwort: Z / N, trick: zk / nk, toleranz: { abs: 0.0006 }, anzeige: nk === 1 ? String(zk) : zk + '/' + nk + ' ≈ ' + zt(Z / N, 4),
        schritte: (durch ? ['Kehrwert: $' + b1 + ' \\cdot \\frac{' + n2 + '}{' + z2 + '}$'] : []).concat(['$\\frac{' + z1 + ' \\cdot ' + (durch ? n2 : z2) + '}{' + n1 + ' \\cdot ' + (durch ? z2 : n2) + '} = \\frac{' + Z + '}{' + N + '}$', g > 1 ? 'Kürzen mit ' + g + ': $\\frac{' + zk + '}{' + nk + '}$' : 'Nicht weiter kürzbar']) };
    } });

  trick({ id: 'kuerzen', kat: 'bruch', titel: 'Kürzen mit dem größten gemeinsamen Teiler', ab: 1, bis: 3,
    kurz: '18/24: beide durch 6 → 3/4. Erst durch 2, 3, 5 teilen, bis nichts mehr geht.',
    anleitung: ['Suche eine Zahl, die Zähler und Nenner teilt: zuerst 2 (gerade), 3 (Quersumme), 5 (Endziffer 0 oder 5).', 'Teile beide und wiederhole, bis es keinen gemeinsamen Teiler mehr gibt.', 'Schneller: gleich durch den größten gemeinsamen Teiler (ggT) teilen.'],
    aufgabe: function (st) {
      let z, n; do { n = zuf(2, [0, 9, 15, 25][st]); z = zuf(1, n - 1); } while (ggT(z, n) !== 1);
      const k = st === 1 ? wahl([2, 3, 5, 10]) : st === 2 ? wahl([4, 6, 8, 9, 12]) : wahl([12, 14, 15, 16, 18, 24, 25]);
      return { frage: '\\frac{' + z * k + '}{' + n * k + '}', text: 'Vollständig gekürzt (als Bruch eingeben, z. B. 3/4)', art: 'bruch', antwort: z / n, trick: z / n, toleranz: { abs: 1e-9 }, anzeige: z + '/' + n,
        schritte: ['ggT(' + z * k + ', ' + n * k + ') = ' + k, '$\\frac{' + z * k + ' : ' + k + '}{' + n * k + ' : ' + k + '} = \\frac{' + z + '}{' + n + '}$'] };
    } });

  trick({ id: 'bruchProzent', kat: 'bruch', titel: 'Bruch, Kommazahl und Prozent', ab: 1, bis: 3,
    kurz: '3/4 = 75 %: auf Hundertstel erweitern. 1/8 = 12,5 %, 1/3 ≈ 33,3 %.',
    anleitung: ['Prozent heißt Hundertstel: Bruch so erweitern, dass unten 100 steht – $\\frac{3}{4} = \\frac{75}{100} = 75\\,\\%$.', 'Geht das nicht, Zähler durch Nenner teilen und mal 100: $\\frac{3}{8} = 0{,}375 = 37{,}5\\,\\%$.', 'Umgekehrt: $35\\,\\% = \\frac{35}{100} = \\frac{7}{20}$.'],
    aufgabe: function (st) {
      const L = st === 1 ? [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10], [7, 10], [1, 20], [3, 20], [1, 25], [1, 50]] : st === 2 ? [[1, 8], [3, 8], [5, 8], [7, 8], [3, 25], [7, 20], [9, 40], [1, 40], [11, 20], [13, 50]] : [[1, 3], [2, 3], [1, 6], [5, 6], [1, 16], [3, 16], [5, 12], [7, 12], [1, 9]];
      const b = wahl(L), p = 100 * b[0] / b[1], endlich = Math.abs(p * 10 - Math.round(p * 10)) < 1e-9;
      return { frage: '\\frac{' + b[0] + '}{' + b[1] + '} = \\ ?\\ \\%', text: endlich ? 'In Prozent' : 'In Prozent, auf eine Nachkommastelle', antwort: p, trick: p, einheit: '%', toleranz: { abs: endlich ? 1e-9 : 0.051 }, anzeige: zt(rund(p, endlich ? 3 : 1)) + ' %',
        schritte: [100 % b[1] === 0 ? 'Erweitern mit ' + 100 / b[1] + ': $\\frac{' + b[0] * 100 / b[1] + '}{100}$' : '$' + b[0] + ' : ' + b[1] + ' = ' + tx(b[0] / b[1], 4) + (endlich ? '' : '\\ldots') + '$', '$= ' + tx(rund(p, endlich ? 3 : 1)) + '\\,\\%$'] };
    } });

  // ===================== Kommazahlen und Zehnerpotenzen =====================
  const POTW = ['10', '100', '1000', '10\\,000', '100\\,000', '1\\,000\\,000'];
  trick({ id: 'kommaZehner', kat: 'komma', titel: 'Komma verschieben: mal und durch 10, 100, 1000', ab: 1, bis: 4,
    kurz: 'So viele Nullen, so viele Stellen: · 100 → Komma 2 nach rechts, : 1000 → 3 nach links.',
    anleitung: ['Zähle die Nullen der Zehnerzahl.', 'Malnehmen: Komma so viele Stellen nach rechts – die Zahl wird größer.', 'Teilen: Komma nach links – die Zahl wird kleiner.', 'Fehlen Stellen, mit Nullen auffüllen: $0{,}7 : 100 = 0{,}007$. Mal 0,1 ist dasselbe wie durch 10.'],
    aufgabe: function (st) {
      const nk = st === 1 ? zuf(0, 1) : zuf(1, 3), x = rund(zuf(st === 1 ? 1 : 1, st === 1 ? 99 : 9999) / Math.pow(10, nk), 6);
      const k = st === 1 ? zuf(1, 2) : st === 2 ? zuf(1, 3) : zuf(1, 6), mal = Math.random() < 0.5, zehntel = st >= 3 && Math.random() < 0.35 && k <= 3;
      const y = rund(mal !== zehntel ? x * Math.pow(10, k) : x / Math.pow(10, k), 12);
      if (y < 1e-5 || y > 1e8) return this.aufgabe(st);
      const op = zehntel ? ' \\cdot ' + ['0{,}1', '0{,}01', '0{,}001'][k - 1] : (mal ? ' \\cdot ' : ' : ') + POTW[k - 1];
      return { frage: tx(x) + op, antwort: y, trick: y,
        schritte: [(zehntel ? 'Mal ' + ['0,1', '0,01', '0,001'][k - 1] + ' ist durch ' + POTW[k - 1].replace(/\\,/g, ' ') + '. ' : '') + k + (k === 1 ? ' Stelle' : ' Stellen') + ' nach ' + (mal !== zehntel ? 'rechts' : 'links'), '$' + tx(x) + op + ' = ' + tx(y) + '$'] };
    } });

  trick({ id: 'dezimalPlus', kat: 'komma', titel: 'Kommazahlen addieren und subtrahieren', ab: 1, bis: 3,
    kurz: 'Komma unter Komma: 2,5 + 0,75 → 2,50 + 0,75. Erst Ganze, dann Kommastellen.',
    anleitung: ['Gleich viele Nachkommastellen schaffen: hinten Nullen anhängen ($2{,}5 = 2{,}50$).', 'Im Kopf: erst die Ganzen, dann die Nachkommastellen – Übertrag beachten.', 'Beim Minus: auf die nächste ganze Zahl ergänzen hilft ($5 - 2{,}35$: von 2,35 bis 3 sind 0,65, dann noch 2 → 2,65).'],
    aufgabe: function (st) {
      const n1 = st === 1 ? 1 : zuf(1, 2), n2 = st === 1 ? zuf(1, 2) : st === 2 ? zuf(1, 3) : 3;
      const a = rund(zuf(1, st === 3 ? 99999 : 999) / Math.pow(10, n1), 6), b = rund(zuf(1, st === 3 ? 9999 : 999) / Math.pow(10, n2), 6);
      const minus = Math.random() < 0.5, g = Math.max(a, b), k = Math.min(a, b), r = rund(minus ? g - k : a + b, 9), n = Math.max(n1, n2);
      return { frage: minus ? tx(g) + ' - ' + tx(k) : tx(a) + ' + ' + tx(b), antwort: r, trick: r,
        schritte: ['Komma unter Komma: $' + tx(minus ? g : a, n) + (minus ? ' - ' : ' + ') + tx(minus ? k : b, n) + '$', '$= ' + tx(r) + '$'] };
    } });

  trick({ id: 'dezimalMal', kat: 'komma', titel: 'Kommazahlen malnehmen', ab: 1, bis: 4,
    kurz: 'Ohne Komma rechnen, dann Nachkommastellen zählen: 0,3 · 0,04 → 3 · 4 = 12 → 3 Stellen → 0,012.',
    anleitung: ['Rechne zuerst ohne Komma: $0{,}3 \\cdot 0{,}04 \\to 3 \\cdot 4 = 12$.', 'Zähle die Nachkommastellen beider Zahlen zusammen: 1 + 2 = 3.', 'So viele Stellen bekommt das Ergebnis hinter dem Komma, fehlende Stellen mit Nullen auffüllen: $0{,}012$.', 'Überschlag zur Kontrolle: 0,3 · 0,04 ist etwas weniger als die Hälfte von 0,04 · 1.'],
    aufgabe: function (st) {
      const n1 = st === 1 ? 1 : zuf(1, 2), n2 = st <= 2 ? zuf(0, 1) : zuf(1, 3);
      const g1 = st === 1 ? zuf(2, 9) : st === 2 ? zuf(2, 12) : zuf(11, 99), g2 = st === 4 ? zuf(11, 99) : zuf(2, 9);
      const a = rund(g1 / Math.pow(10, n1), 6), b = rund(g2 / Math.pow(10, n2), 6), r = rund(g1 * g2 / Math.pow(10, n1 + n2), 12);
      return { frage: tx(a) + ' \\cdot ' + tx(b), antwort: r, trick: r,
        schritte: ['Ohne Komma: $' + g1 + ' \\cdot ' + g2 + ' = ' + g1 * g2 + '$', 'Nachkommastellen: ' + n1 + ' + ' + n2 + ' = ' + (n1 + n2), '$' + tx(a) + ' \\cdot ' + tx(b) + ' = ' + tx(r) + '$'] };
    } });

  trick({ id: 'dezimalDurch', kat: 'komma', titel: 'Durch eine Kommazahl teilen', ab: 2, bis: 4,
    kurz: '7,5 : 0,25 = 750 : 25 = 30. Beide Kommas gleich weit verschieben, bis der Teiler ganz ist.',
    anleitung: ['Verschiebe das Komma in beiden Zahlen um gleich viele Stellen nach rechts, bis der Teiler keine Nachkommastellen mehr hat.', 'Das Ergebnis ändert sich dadurch nicht – es ist ein Erweitern mit 10, 100 oder 1000.', 'Dann normal teilen: $7{,}5 : 0{,}25 = 750 : 25 = 30$.', 'Durch 0,5 ist mal 2, durch 0,25 ist mal 4, durch 0,2 ist mal 5.'],
    aufgabe: function (st) {
      const nb = st === 2 ? 1 : zuf(1, 2), gb = st === 2 ? wahl([2, 3, 4, 5]) : st === 3 ? wahl([2, 4, 5, 6, 8, 25]) : wahl([12, 15, 25, 75, 125]);
      const q = st === 4 ? zuf(4, 60) : zuf(2, 40), b = rund(gb / Math.pow(10, nb), 6), a = rund(q * b, 9);
      return { frage: tx(a) + ' : ' + tx(b), antwort: q, trick: q,
        schritte: ['Beide Kommas ' + nb + (nb === 1 ? ' Stelle' : ' Stellen') + ' nach rechts: $' + tx(rund(a * Math.pow(10, nb), 9)) + ' : ' + gb + '$', '$= ' + q + '$'] };
    } });

  trick({ id: 'rundenKomma', kat: 'komma', titel: 'Kaufmännisch runden', ab: 1, bis: 3,
    kurz: 'Auf die erste wegfallende Ziffer schauen: 0–4 abrunden, 5–9 aufrunden.',
    anleitung: ['Markiere die Stelle, auf die gerundet wird.', 'Schau auf die Ziffer direkt dahinter – nur diese zählt.', '0 bis 4: abrunden (Rest fällt weg). 5 bis 9: die markierte Stelle um 1 erhöhen, auch mit Übertrag ($2{,}97 \\to 3{,}0$).'],
    aufgabe: function (st) {
      const n = st === 1 ? zuf(0, 1) : zuf(1, 3), extra = st === 3 ? zuf(2, 3) : zuf(1, 2), x = rund(zuf(1, 99999) / Math.pow(10, n + extra), 9);
      const r = rund(Math.round(rund(x * Math.pow(10, n), 6)) / Math.pow(10, n), 9);
      const erste = Math.floor(rund(x * Math.pow(10, n + 1), 6)) % 10;
      return { frage: tx(x) + ' \\approx \\ ?', text: 'Auf ' + (n ? n + (n === 1 ? ' Nachkommastelle' : ' Nachkommastellen') : 'ganze Zahlen') + ' runden', antwort: r, trick: r, anzeige: zt(r, n),
        schritte: ['Erste wegfallende Ziffer: ' + erste + ' → ' + (erste >= 5 ? 'aufrunden' : 'abrunden'), '$' + tx(x) + ' \\approx ' + tx(r, n) + '$'] };
    } });

  const EINHK = [
    ['Länge', [['mm', -3], ['cm', -2], ['dm', -1], ['m', 0], ['km', 3]]],
    ['Fläche', [['cm^2', -4], ['dm^2', -2], ['m^2', 0], ['a', 2], ['ha', 4]]],
    ['Rauminhalt', [['ml', -6], ['l', -3], ['m^3', 0]]],
    ['Masse', [['g', -3], ['kg', 0], ['t', 3]]]
  ];
  const etx = function (e) { return '\\text{' + e.replace(/\^(\d)/, '}^$1\\text{') + '}'; };
  trick({ id: 'einheitenKomma', kat: 'komma', titel: 'Einheiten umrechnen', ab: 1, bis: 4,
    kurz: 'Länge 10, Fläche 100, Rauminhalt und Masse 1000 je Schritt. 1 dm³ = 1 l.',
    anleitung: ['Umrechnungszahl kennen: mm–cm–dm–m je 10, m–km 1000; Flächen je 100 (cm², dm², m², a, ha); Liter und Masse je 1000.', 'In die kleinere Einheit: mehr Stück → malnehmen, Komma nach rechts.', 'In die größere Einheit: weniger Stück → teilen, Komma nach links.'],
    aufgabe: function (st) {
      const gr = st === 1 ? EINHK[wahl([0, 3])] : st === 2 ? EINHK[wahl([0, 2, 3])] : wahl(EINHK), L = gr[1];
      let i, j; do { i = zuf(0, L.length - 1); j = zuf(0, L.length - 1); } while (i === j || (st === 1 && Math.abs(i - j) > 1));
      const nk = st === 1 ? zuf(0, 1) : zuf(0, 2), x = rund(zuf(1, st >= 3 ? 9999 : 999) / Math.pow(10, nk), 6), k = L[i][1] - L[j][1], y = rund(x * Math.pow(10, k), 12);
      if (Math.abs(y) > 1e8 || Math.abs(y) < 1e-5) return this.aufgabe(st);
      return { frage: tx(x) + '\\,' + etx(L[i][0]) + ' = \\ ?\\,' + etx(L[j][0]), text: gr[0] + ' umrechnen', antwort: y, trick: y, einheit: L[j][0].replace('^2', '²').replace('^3', '³'),
        schritte: ['$1\\,' + etx(L[i][0]) + ' = 10^{' + k + '}\\,' + etx(L[j][0]) + '$ → Komma ' + Math.abs(k) + (Math.abs(k) === 1 ? ' Stelle' : ' Stellen') + ' nach ' + (k > 0 ? 'rechts' : 'links'), '$' + tx(x) + '\\,' + etx(L[i][0]) + ' = ' + tx(y) + '\\,' + etx(L[j][0]) + '$'] };
    } });

  const VORS = [['M', 1e6], ['k', 1e3], ['', 1], ['m', 1e-3], ['\\mu ', 1e-6], ['n', 1e-9]];
  trick({ id: 'einheiten', kat: 'bruch', titel: 'Zehnerpotenzen und Vorsätze', ab: 2, bis: 4,
    kurz: 'kΩ · mA = V. Exponenten addieren: 10³ · 10⁻³ = 10⁰.',
    anleitung: ['Vorsätze als Zehnerpotenzen: M = $10^6$, k = $10^3$, m = $10^{-3}$, µ = $10^{-6}$, n = $10^{-9}$.', 'Zahlen und Zehnerpotenzen getrennt rechnen: beim Malnehmen Exponenten addieren, beim Teilen subtrahieren.', 'Am Ende in die verlangte Einheit umrechnen.'],
    aufgabe: function (st) {
      if (st === 4 && Math.random() < 0.5) { const a = zuf(2, 9), m = zuf(-6, 6), b = zuf(2, 9), n = zuf(-6, 6), w = rund(a * b * Math.pow(10, m + n), 12);
        if (Math.abs(m + n) > 4) return this.aufgabe(st);
        return { frage: '(' + a + ' \\cdot 10^{' + m + '}) \\cdot (' + b + ' \\cdot 10^{' + n + '})', text: 'Als Kommazahl', antwort: w, trick: rund(a * b * Math.pow(10, m + n), 12), schritte: ['Zahlen: $' + a + ' \\cdot ' + b + ' = ' + a * b + '$', 'Exponenten: $' + m + ' + (' + n + ') = ' + (m + n) + '$', '$' + a * b + ' \\cdot 10^{' + (m + n) + '} = ' + tx(w) + '$'] }; }
      const R = st === 2 ? wahl([[1, 'k'], [4.7, 'k'], [2.2, 'k'], [10, 'k'], [470, '']]) : wahl([[1.5, 'M'], [3.3, 'k'], [68, 'k'], [220, ''], [12, 'k']]);
      const I = st === 2 ? wahl([[2, 'm'], [5, 'm'], [20, 'm'], [0.5, 'm']]) : wahl([[200, '\\mu '], [15, 'm'], [40, '\\mu '], [250, 'n'], [1.2, 'm']]);
      const fR = VORS.filter(function (v) { return v[0] === R[1]; })[0][1], fI = VORS.filter(function (v) { return v[0] === I[1]; })[0][1];
      const U = rund(R[0] * fR * I[0] * fI, 12), uZahl = rund(R[0] * I[0], 9), uPot = Math.round(Math.log10(fR * fI));
      return { frage: 'U = ' + tx(R[0]) + '\\,\\text{' + R[1] + '}\\Omega \\cdot ' + tx(I[0]) + '\\,' + (I[1] === '\\mu ' ? '\\mu\\text{A}' : '\\text{' + I[1] + 'A}'), text: 'Spannung in Volt', antwort: U, trick: rund(uZahl * Math.pow(10, uPot), 12), einheit: 'V',
        schritte: ['Zahlen: $' + tx(R[0]) + ' \\cdot ' + tx(I[0]) + ' = ' + tx(uZahl) + '$', 'Vorsätze: $10^{' + Math.round(Math.log10(fR)) + '} \\cdot 10^{' + Math.round(Math.log10(fI)) + '} = 10^{' + uPot + '}$', '$U = ' + tx(uZahl) + ' \\cdot 10^{' + uPot + '}\\,\\text{V} = ' + tx(U) + '\\,\\text{V}$'] };
    } });

  // ===================== Überschlag im Beruf =====================
  trick({ id: 'leistung', kat: 'ueberschlag', titel: 'Leistung und Strom: 230 V und 400 V', ab: 1, bis: 4,
    kurz: '230 V · I = 200 · I + 30 · I. Drehstrom 400 V: rund 0,7 kW je Ampere, 1,44 A je kW.',
    anleitung: ['Wechselstrom: $P = 230\\,\\text{V} \\cdot I$ – rechne $200 \\cdot I + 30 \\cdot I$.', 'Strom aus Leistung: $I = \\frac{P}{230}$ – etwa $P \\cdot 4{,}35$ mA je Watt, also 4,35 A je kW.', 'Drehstrom: $P = \\sqrt{3} \\cdot 400\\,\\text{V} \\cdot I \\approx 693\\,\\text{V} \\cdot I$; umgekehrt $I \\approx 1{,}44\\,\\text{A}$ je kW (bei $\\cos\\varphi = 1$).'],
    aufgabe: function (st) {
      if (st <= 2) { const I = st === 1 ? zuf(1, 16) : rund(zuf(11, 159) / 10, 1), P = rund(230 * I, 9);
        return { frage: 'P = 230\\,\\text{V} \\cdot ' + tx(I) + '\\,\\text{A}', text: 'Leistung in Watt', antwort: P, trick: rund(200 * I + 30 * I, 9), einheit: 'W', schritte: ['$200 \\cdot ' + tx(I) + ' = ' + tx(200 * I) + '$', '$30 \\cdot ' + tx(I) + ' = ' + tx(30 * I) + '$', '$P = ' + tx(P) + '\\,\\text{W}$'] }; }
      if (st === 3) { const P = zuf(5, 37) * 100, I = P / 230, tr = P / 1000 * 4.35;
        return { frage: 'I = \\frac{' + tx(P) + '\\,\\text{W}}{230\\,\\text{V}}', text: 'Strom in Ampere – auf etwa 3 % genau', antwort: I, trick: tr, einheit: 'A', toleranz: { rel: 0.03 }, anzeige: zt(I, 2), ungefaehr: true,
          schritte: ['Je kW etwa 4,35 A', '$' + tx(P / 1000) + ' \\cdot 4{,}35 \\approx ' + tx(tr, 2) + '\\,\\text{A}$', 'Genau: $' + tx(I, 3) + '\\,\\text{A}$'] }; }
      if (Math.random() < 0.5) { const I = zuf(6, 63), P = Math.sqrt(3) * 400 * I / 1000, tr = 0.693 * I;
        return { frage: 'P = \\sqrt{3} \\cdot 400\\,\\text{V} \\cdot ' + I + '\\,\\text{A}', text: 'Leistung in kW – auf etwa 3 % genau', antwort: P, trick: tr, einheit: 'kW', toleranz: { rel: 0.03 }, anzeige: zt(P, 2), ungefaehr: true,
          schritte: ['$\\sqrt{3} \\cdot 400 \\approx 693$, also 0,693 kW je A', '$' + I + ' \\cdot 0{,}693 \\approx ' + tx(tr, 2) + '\\,\\text{kW}$', 'Genau: $' + tx(P, 3) + '\\,\\text{kW}$'] }; }
      const P = zuf(3, 45), I = P * 1000 / (Math.sqrt(3) * 400), tr = P * 1.443;
      return { frage: 'I = \\frac{' + P + '\\,\\text{kW}}{\\sqrt{3} \\cdot 400\\,\\text{V}}', text: 'Strom in Ampere – auf etwa 3 % genau', antwort: I, trick: tr, einheit: 'A', toleranz: { rel: 0.03 }, anzeige: zt(I, 2), ungefaehr: true,
        schritte: ['Je kW etwa 1,44 A', '$' + P + ' \\cdot 1{,}44 \\approx ' + tx(tr, 1) + '\\,\\text{A}$', 'Genau: $' + tx(I, 2) + '\\,\\text{A}$'] };
    } });

  trick({ id: 'kreis', kat: 'ueberschlag', titel: 'Kreis, Querschnitt und Rohrinhalt', ab: 2, bis: 4,
    kurz: 'A = d² · 0,785. Umfang ≈ 3,14 · d. 1 m Rohr mit 20 mm innen fasst gut 0,3 l.',
    anleitung: ['Kreisfläche: $A = \\frac{\\pi}{4} d^2 \\approx 0{,}785 \\cdot d^2$ – also $d^2$ minus gut ein Fünftel.', 'Umfang: $U = \\pi \\cdot d \\approx 3 \\cdot d + 0{,}14 \\cdot d$.', 'Rohrinhalt: Fläche in cm² mal Länge in dm, geteilt durch 100, ergibt Liter (1 cm² = 0,01 dm², 1 dm³ = 1 l).'],
    aufgabe: function (st) {
      if (st === 2) { const d = zuf(4, 30), A = Math.PI / 4 * d * d, tr = 0.785 * d * d;
        return { frage: 'A = \\frac{\\pi}{4} \\cdot (' + d + '\\,\\text{mm})^2', text: 'Fläche in mm² – auf 2 % genau', antwort: A, trick: tr, einheit: 'mm²', toleranz: { rel: 0.02 }, anzeige: zt(A, 1), ungefaehr: true,
          schritte: ['$d^2 = ' + d * d + '$', '$' + d * d + ' \\cdot 0{,}785 \\approx ' + tx(tr, 1) + '$ (ein Fünftel ist $' + tx(d * d / 5, 1) + '$, etwas weniger abziehen)'] }; }
      if (st === 3) { const d = rund(zuf(12, 120) / 10, 1), U = Math.PI * d, tr = 3.14 * d;
        return { frage: 'U = \\pi \\cdot ' + tx(d) + '\\,\\text{m}', text: 'Umfang in Metern – auf 1 % genau', antwort: U, trick: tr, einheit: 'm', toleranz: { rel: 0.01 }, anzeige: zt(U, 2), ungefaehr: true, schritte: ['$3 \\cdot ' + tx(d) + ' = ' + tx(3 * d) + '$', '$0{,}14 \\cdot ' + tx(d) + ' \\approx ' + tx(0.14 * d, 2) + '$', '$U \\approx ' + tx(tr, 2) + '\\,\\text{m}$'] }; }
      const di = wahl([13, 16, 20, 26, 32, 40]), l = zuf(5, 60), A = Math.PI / 4 * di * di / 100, V = A * l * 10 / 100, tr = 0.785 * di * di / 100 * l * 10 / 100;
      return { frage: 'd_\\text{i} = ' + di + '\\,\\text{mm},\\ l = ' + l + '\\,\\text{m}', text: 'Wasserinhalt in Litern – auf 3 % genau', antwort: V, trick: tr, einheit: 'l', toleranz: { rel: 0.03 }, anzeige: zt(V, 2), ungefaehr: true,
        schritte: ['$A = 0{,}785 \\cdot (' + tx(di / 10) + '\\,\\text{cm})^2 \\approx ' + tx(0.785 * di * di / 100, 2) + '\\,\\text{cm}^2$', '$l = ' + l + '\\,\\text{m} = ' + tx(l * 10) + '\\,\\text{dm}$', '$V \\approx ' + tx(0.785 * di * di / 100, 2) + '\\,\\text{cm}^2 \\cdot ' + tx(l * 10) + '\\,\\text{dm} : 100 = ' + tx(tr, 2) + '\\,\\text{l}$'] };
    } });

  trick({ id: 'ueberschlag', kat: 'ueberschlag', titel: 'Überschlag: runden und ausgleichen', ab: 1, bis: 4,
    kurz: '487 · 31,2 ≈ 500 · 30 = 15 000 – ein Faktor rauf, einer runter gleicht sich aus.',
    anleitung: ['Runde jede Zahl auf eine oder zwei gültige Ziffern.', 'Runde einen Faktor auf, den anderen ab – dann gleichen sich die Fehler aus. Beim Teilen beide in dieselbe Richtung.', 'Rechne mit Zehnerpotenzen getrennt und prüfe die Größenordnung.'],
    aufgabe: function (st) {
      const sig = function (x, n) { const p = Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - n + 1); return Math.round(x / p) * p; };
      let fs, ds = [], tol;
      if (st === 1) { fs = [zuf(12, 99), zuf(12, 99)]; tol = 0.1; } else if (st === 2) { fs = [zuf(102, 999), zuf(12, 99)]; tol = 0.08; } else if (st === 3) { fs = [zuf(102, 999), rund(zuf(102, 999) / 10, 1)]; ds = [zuf(12, 49)]; tol = 0.08; } else { fs = [rund(zuf(1002, 9999) / 100, 2), zuf(102, 999), rund(zuf(12, 99) / 1000, 3)]; ds = [zuf(12, 99), rund(zuf(12, 99) / 10, 1)]; tol = 0.08; }
      let w = 1; fs.forEach(function (f) { w *= f; }); ds.forEach(function (d) { w /= d; });
      // runden und ausgleichen: jede Zahl auf- oder abrunden, je nachdem, was den bisherigen Fehler kleiner macht
      const SCHOEN = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10];
      const kand = function (x) {
        const e = Math.pow(10, Math.floor(Math.log10(Math.abs(x))));
        if (st >= 3) { const q = e / 10; return [rund(Math.floor(x / q) * q, 9), rund(Math.ceil(x / q) * q, 9)]; }
        const m = x / e; let u = 1, o = 10; SCHOEN.forEach(function (v) { if (v <= m + 1e-12) u = v; }); for (let i = SCHOEN.length - 1; i >= 0; i--) if (SCHOEN[i] >= m - 1e-12) o = SCHOEN[i];
        return [rund(u * e, 9), rund(o * e, 9)];
      };
      let est = 1, ex = 1; const rf = [], rd = [];
      fs.forEach(function (f) { ex *= f; const c = kand(f), g = Math.abs(est * c[0] - ex) <= Math.abs(est * c[1] - ex) ? c[0] : c[1]; rf.push(g); est *= g; });
      ds.forEach(function (d) { ex /= d; const c = kand(d), g = Math.abs(est / c[0] - ex) <= Math.abs(est / c[1] - ex) ? c[0] : c[1]; rd.push(g); est /= g; });
      let tr = 1; rf.forEach(function (f) { tr *= f; }); rd.forEach(function (d) { tr /= d; });
      const frage = (ds.length ? '\\frac{' : '') + fs.map(function (f) { return tx(f); }).join(' \\cdot ') + (ds.length ? '}{' + ds.map(function (d) { return tx(d); }).join(' \\cdot ') + '}' : '');
      const grenze = Math.min(0.2, Math.max(tol, Math.ceil(Math.abs(tr - w) / Math.abs(w) * 105) / 100));
      return { frage: frage, text: 'Überschlag – auf ' + Math.round(grenze * 100) + ' % genau', antwort: w, trick: tr, toleranz: { rel: grenze }, anzeige: zt(sig(w, 3)), ungefaehr: true,
        schritte: ['Gerundet: $' + (rd.length ? '\\frac{' : '') + rf.map(function (f) { return tx(f); }).join(' \\cdot ') + (rd.length ? '}{' + rd.map(function (d) { return tx(d); }).join(' \\cdot ') + '}' : '') + '$', '$\\approx ' + tx(sig(tr, 3)) + '$', 'Genau: $' + tx(sig(w, 4)) + '$'] };
    } });

  // ===================== Profi =====================
  const LG = { 2: 0.30103, 3: 0.47712, 5: 0.69897, 7: 0.84510 };
  trick({ id: 'logarithmus', kat: 'profi', titel: 'Zehnerlogarithmus im Kopf', ab: 3, bis: 4,
    kurz: 'lg 2 ≈ 0,301, lg 3 ≈ 0,477, lg 7 ≈ 0,845 – der Rest folgt aus lg(a·b) = lg a + lg b.',
    anleitung: ['Merke: $\\lg 2 \\approx 0{,}301$, $\\lg 3 \\approx 0{,}477$, $\\lg 7 \\approx 0{,}845$, $\\lg 5 = 1 - \\lg 2 \\approx 0{,}699$.', 'Zerlege die Zahl in Faktoren 2, 3, 5, 7 und Zehnerpotenzen.', 'Addiere die Logarithmen: $\\lg(a \\cdot b) = \\lg a + \\lg b$, $\\lg 10^k = k$, $\\lg \\frac{a}{b} = \\lg a - \\lg b$.'],
    aufgabe: function (st) {
      const ex = { 2: 0, 3: 0, 5: 0, 7: 0 }, n = st === 3 ? 1 : zuf(2, 3);
      for (let i = 0; i < n; i++) ex[wahl([2, 3, 5, 7])]++;
      const k = st === 3 ? zuf(-2, 3) : zuf(-4, 5);
      let N = Math.pow(10, k); Object.keys(ex).forEach(function (p) { N *= Math.pow(Number(p), ex[p]); }); N = rund(N, 12);
      let tr = k; const teile = []; Object.keys(ex).forEach(function (p) { if (ex[p]) { tr += ex[p] * LG[p]; teile.push((ex[p] > 1 ? ex[p] + ' \\cdot ' : '') + tx(LG[p], 3)); } });
      return { frage: '\\lg ' + tx(N), text: 'Auf drei Nachkommastellen', antwort: Math.log10(N), trick: tr, toleranz: { abs: 0.004 }, anzeige: zt(Math.log10(N), 3), negativ: true,
        schritte: ['$' + tx(N) + ' = ' + Object.keys(ex).filter(function (p) { return ex[p]; }).map(function (p) { return p + (ex[p] > 1 ? '^{' + ex[p] + '}' : ''); }).join(' \\cdot ') + ' \\cdot 10^{' + k + '}$', '$\\lg = ' + teile.join(' + ') + (k ? (k > 0 ? ' + ' : ' - ') + Math.abs(k) : '') + ' \\approx ' + tx(tr, 3) + '$'] };
    } });

  trick({ id: 'dezibel', kat: 'profi', titel: 'Dezibel ohne Taschenrechner', ab: 3, bis: 4,
    kurz: '3 dB = doppelte Leistung, 10 dB = zehnfache. 13 dB = 2 · 10 = 20-fach.',
    anleitung: ['Leistung: $L = 10 \\cdot \\lg\\frac{P_2}{P_1}$. Merke: ×2 → 3 dB, ×4 → 6 dB, ×5 → 7 dB, ×8 → 9 dB, ×10 → 10 dB.', 'Faktoren multiplizieren heißt Dezibel addieren: ×20 = ×2 · ×10 → 3 + 10 = 13 dB.', 'Spannung und Schalldruck: $L = 20 \\cdot \\lg\\frac{U_2}{U_1}$ – doppelte Spannung = 6 dB.'],
    aufgabe: function (st) {
      const bau = [[2, 3], [4, 6], [5, 7], [8, 9], [10, 10], [100, 20], [1000, 30]];
      const a = wahl(bau.slice(0, 4)), b = wahl(bau.slice(4, st === 3 ? 6 : 7)), f = a[0] * b[0], db = 10 * Math.log10(f), trDb = a[1] + b[1];
      const spannung = st === 4 && Math.random() < 0.4;
      if (spannung) { const u = wahl([2, 4, 10, 20, 100, 0.5]), L = 20 * Math.log10(u);
        return { frage: '\\frac{U_2}{U_1} = ' + tx(u), text: 'Pegel in dB (Spannung)', antwort: L, trick: u === 0.5 ? -6 : { 2: 6, 4: 12, 10: 20, 20: 26, 100: 40 }[u], toleranz: { abs: 0.35 }, einheit: 'dB', anzeige: zt(L, 1), negativ: true,
          schritte: ['Spannung: 20 · lg, also doppelt so viele dB wie bei Leistung', '$20 \\cdot \\lg ' + tx(u) + ' \\approx ' + tx(L, 1) + '\\,\\text{dB}$'] }; }
      if (Math.random() < 0.5) return { frage: '\\frac{P_2}{P_1} = ' + tx(f), text: 'Pegel in dB (Leistung)', antwort: db, trick: trDb, toleranz: { abs: 0.35 }, einheit: 'dB', anzeige: zt(db, 1),
        schritte: ['$' + tx(f) + ' = ' + a[0] + ' \\cdot ' + tx(b[0]) + '$', '$' + a[1] + '\\,\\text{dB} + ' + b[1] + '\\,\\text{dB} = ' + trDb + '\\,\\text{dB}$'] };
      return { frage: tx(trDb) + '\\,\\text{dB}', text: 'Leistungsfaktor – auf 5 % genau', antwort: Math.pow(10, trDb / 10), trick: f, toleranz: { rel: 0.05 }, anzeige: zt(f),
        schritte: ['$' + trDb + '\\,\\text{dB} = ' + a[1] + '\\,\\text{dB} + ' + b[1] + '\\,\\text{dB}$', '$\\to ' + a[0] + ' \\cdot ' + tx(b[0]) + ' = ' + tx(f) + '$'] };
    } });

  const TAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], TAGNAME = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  trick({ id: 'wochentag', kat: 'profi', titel: 'Wochentag zu jedem Datum', ab: 3, bis: 4,
    kurz: 'Doomsday-Methode: In jedem Jahr fallen 4.4., 6.6., 8.8., 10.10., 12.12. auf denselben Wochentag.',
    anleitung: ['Merktage (alle am selben Wochentag eines Jahres): 3.1. (Schaltjahr 4.1.), 28.2. (29.2.), 14.3., 4.4., 9.5., 6.6., 11.7., 8.8., 5.9., 10.10., 7.11., 12.12.', 'Wochentag der Merktage: Jahrhundertanker (1900: Mittwoch, 2000: Dienstag) plus $\\lfloor\\frac{y}{12}\\rfloor + (y \\bmod 12) + \\lfloor\\frac{y \\bmod 12}{4}\\rfloor$, wobei $y$ die letzten zwei Ziffern der Jahreszahl sind – alles modulo 7.', 'Vom Merktag des Monats zum gesuchten Tag zählen, Vielfache von 7 weglassen.'],
    aufgabe: function (st) {
      const jahr = st === 3 ? wahl([2026, 2027]) : zuf(1900, 2099), monat = zuf(0, 11), tag = zuf(1, new Date(Date.UTC(jahr, monat + 1, 0)).getUTCDate());
      const w = new Date(Date.UTC(jahr, monat, tag)).getUTCDay(), schalt = (jahr % 4 === 0 && jahr % 100 !== 0) || jahr % 400 === 0;
      const y = jahr % 100, anker = jahr < 2000 ? 3 : 2, a = Math.floor(y / 12), b = y % 12, c = Math.floor(b / 4), dd = (anker + a + b + c) % 7;
      const merk = [schalt ? 4 : 3, schalt ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12][monat], diff = tag - merk, tr = ((dd + diff) % 7 + 7) % 7;
      return { frage: '\\text{' + tag + '. ' + MONATE[monat] + ' ' + jahr + '}', text: 'Welcher Wochentag?', art: 'wahl', optionen: [1, 2, 3, 4, 5, 6, 0].map(function (i) { return [TAGE[i], TAGE[i]]; }), antwort: TAGE[w], trick: TAGE[tr], anzeige: TAGNAME[w],
        schritte: [st === 3 ? 'Merktage ' + jahr + ': ' + TAGNAME[dd] : 'Anker ' + (jahr < 2000 ? '1900: Mittwoch (3)' : '2000: Dienstag (2)') + '; $y = ' + y + '$: $' + a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + '$ → Merktage: ' + TAGNAME[dd], 'Merktag im ' + MONATE[monat] + ': ' + merk + '. (' + TAGNAME[dd] + ')', 'Abstand: ' + (diff >= 0 ? '+' : '') + diff + ' Tage, modulo 7: ' + ((diff % 7) + 7) % 7, '→ ' + TAGNAME[tr]] };
    } });

  // ---------- Auswahl und Prüfung ----------
  function verfuegbar(kat, stufe) { return T.filter(function (t) { return (!kat || kat === 'alle' || t.kat === kat) && t.ab <= stufe; }); }
  function aufgabeZu(t, stufe) { const st = Math.max(t.ab, Math.min(t.bis, stufe)); const a = t.aufgabe(st); a.id = t.id; a.titel = t.titel; a.stufe = st; a.art = a.art || 'zahl'; return a; }
  function lese(text) {
    let s = String(text || '').trim().replace(/[\s  ']/g, '').replace(/−|–/g, '-').replace(/%$/, '');
    if (!s) return NaN;
    const b = /^(-?\d+)\/(\d+)$/.exec(s); if (b) return Number(b[2]) ? Number(b[1]) / Number(b[2]) : NaN;
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');
    s = s.replace(',', '.');
    return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
  }
  function richtig(a, eingabe) {
    if (a.art === 'wahl') return eingabe === a.antwort;
    const x = lese(eingabe); if (!isFinite(x)) return false;
    const t = a.toleranz || {}, grenze = Math.max(t.abs || 0, (t.rel || 0) * Math.abs(a.antwort), 1e-9 * Math.max(1, Math.abs(a.antwort)));
    return Math.abs(x - a.antwort) <= grenze;
  }
  function anzeige(a) { return a.anzeige !== undefined ? a.anzeige : a.art === 'wahl' ? String(a.antwort) : zt(a.antwort); }

  // ---------- Darstellung: Text mit $TeX$ ----------
  function setzeText(el, text) {
    String(text).split('$').forEach(function (teil, i) {
      if (!teil) return;
      if (i % 2) { const s = document.createElement('span'); if (window.Formel) Formel.setze(s, teil, false); else s.textContent = teil; el.append(s); }
      else el.append(document.createTextNode(teil));
    });
  }
  const el = function (tag, kl, text) { const e = document.createElement(tag); if (kl) e.className = kl; if (text !== undefined) e.textContent = text; return e; };
  const knopf = function (text, kl) { const b = el('button', 'knopf' + (kl ? ' ' + kl : ''), text); b.type = 'button'; return b; };

  // ---------- Oberfläche ----------
  function baue(wurzel, hilfe) {
    hilfe = hilfe || {};
    const lies = hilfe.lies || function (k, s) { return s; }, schreib = hilfe.schreib || function () {}, sperren = hilfe.sperren || function () {}, gezaehlt = hilfe.gezaehlt || function () {};
    const S = 'lernen-kopfrechnen', zustand = lies(S, {}) || {};
    let kat = typeof zustand.kat === 'string' && (zustand.kat === 'alle' || KATEGORIEN.some(function (k) { return k[0] === zustand.kat; })) ? zustand.kat : 'alle';
    let stufe = [1, 2, 3, 4].indexOf(zustand.stufe) >= 0 ? zustand.stufe : 2;
    let sicht = ['anleitung', 'ueben', 'sprint'].indexOf(zustand.sicht) >= 0 ? zustand.sicht : 'anleitung';
    let nurTrick = null;
    const best = zustand.best && typeof zustand.best === 'object' ? zustand.best : {};
    let serieBest = Number(zustand.serieBest) || 0;
    const merken = function () { schreib(S, { kat: kat, stufe: stufe, sicht: sicht, best: best, serieBest: serieBest }); };

    wurzel.textContent = '';
    const sichten = el('div', 'kr-sichten'); sichten.setAttribute('role', 'group'); sichten.setAttribute('aria-label', 'Ansicht');
    const sKnoepfe = {};
    [['anleitung', 'Anleitungen'], ['ueben', 'Üben'], ['sprint', 'Sprint auf Zeit']].forEach(function (s) { const k = knopf(s[1]); k.addEventListener('click', function () { sicht = s[0]; merken(); zeigen(); }); sKnoepfe[s[0]] = k; sichten.append(k); });
    const katLeiste = el('div', 'kr-kat'); katLeiste.setAttribute('role', 'group'); katLeiste.setAttribute('aria-label', 'Rechenart');
    const kKnoepfe = {};
    [['alle', 'Alle']].concat(KATEGORIEN).forEach(function (k) { const b = knopf(k[1], 'kr-chip'); b.addEventListener('click', function () { kat = k[0]; nurTrick = null; merken(); zeigen(); }); kKnoepfe[k[0]] = b; katLeiste.append(b); });
    const stLeiste = el('div', 'leiste kr-stufen'); stLeiste.setAttribute('role', 'group'); stLeiste.setAttribute('aria-label', 'Schwierigkeit');
    stLeiste.append(el('span', 'hinweis-klein', 'Schwierigkeit:'));
    const stKnoepfe = {};
    [1, 2, 3, 4].forEach(function (s) { const b = knopf(STUFEN[s], 'kr-stufe-' + s); b.addEventListener('click', function () { stufe = s; merken(); zeigen(); }); stKnoepfe[s] = b; stLeiste.append(b); });
    const sperrHinweis = el('p', 'kr-sperre', 'Taschenrechner gesperrt – hier zählt nur der Kopf.');
    const inhalt = el('div', 'kr-inhalt');
    wurzel.append(sichten, katLeiste, stLeiste, sperrHinweis, inhalt);

    let sprintUhr = null;
    function sprintStopp() { if (sprintUhr) { clearInterval(sprintUhr); sprintUhr = null; } }

    function zeigen() {
      sprintStopp();
      Object.keys(sKnoepfe).forEach(function (k) { sKnoepfe[k].setAttribute('aria-pressed', k === sicht ? 'true' : 'false'); });
      Object.keys(kKnoepfe).forEach(function (k) { kKnoepfe[k].setAttribute('aria-pressed', k === kat ? 'true' : 'false'); });
      Object.keys(stKnoepfe).forEach(function (k) { stKnoepfe[k].setAttribute('aria-pressed', Number(k) === stufe ? 'true' : 'false'); });
      const gesperrt = sicht !== 'anleitung'; sperren(gesperrt); sperrHinweis.hidden = !gesperrt;
      inhalt.textContent = '';
      if (sicht === 'anleitung') anleitungen(); else if (sicht === 'ueben') ueben(); else sprint();
    }

    // ---------- Anleitungen ----------
    function anleitungen() {
      const liste = T.filter(function (t) { return kat === 'alle' || t.kat === kat; });
      inhalt.append(el('p', 'hilfe', liste.length + ' Tricks. Jede Karte zeigt die Anleitung und ein Beispiel Schritt für Schritt. Tricks über deiner Stufe sind blass – du kannst sie trotzdem ansehen.'));
      const raster = el('div', 'kr-tricks');
      liste.forEach(function (t) {
        const karte = el('details', 'kr-trick' + (t.ab > stufe ? ' kr-drueber' : ''));
        const sum = el('summary'), titel = el('span', 'kr-trick-titel', t.titel), marke = el('span', 'kr-marke kr-stufe-' + t.ab, 'ab ' + STUFEN[t.ab]);
        sum.append(titel, marke); karte.append(sum);
        const kurz = el('p', 'kr-kurz'); setzeText(kurz, t.kurz); karte.append(kurz);
        const ol = el('ol', 'kr-anleitung'); t.anleitung.forEach(function (s) { const li = el('li'); setzeText(li, s); ol.append(li); }); karte.append(ol);
        const bsp = el('div', 'kr-beispiel'); karte.append(bsp);
        const leiste = el('div', 'leiste'), weiter = knopf('Nächster Schritt'), neu = knopf('Neues Beispiel'), ueb = knopf('Diesen Trick üben', 'primaer');
        leiste.append(weiter, neu, ueb); karte.append(leiste);
        let a = null, schritt = 0;
        function beispiel() {
          a = aufgabeZu(t, Math.max(t.ab, Math.min(stufe, t.bis))); schritt = 0; bsp.textContent = '';
          bsp.append(el('div', 'kr-bsp-kopf', 'Beispiel' + (a.text ? ': ' + a.text : '')));
          const f = el('div', 'kr-frage-klein'); Formel.setze(f, a.frage, true); bsp.append(f);
          bsp.append(el('ol', 'kr-schritte')); weiter.disabled = false; weiter.textContent = 'Nächster Schritt';
        }
        weiter.addEventListener('click', function () {
          if (!a) beispiel();
          const ol2 = bsp.querySelector('.kr-schritte');
          if (schritt < a.schritte.length) { const li = el('li'); setzeText(li, a.schritte[schritt]); ol2.append(li); schritt++; }
          if (schritt >= a.schritte.length) { weiter.disabled = true; const e = el('p', 'kr-ergebnis'); e.append(document.createTextNode('Ergebnis: ' + anzeige(a) + (a.einheit ? ' ' + a.einheit : ''))); bsp.append(e); }
        });
        neu.addEventListener('click', beispiel);
        ueb.addEventListener('click', function () { nurTrick = t.id; if (stufe < t.ab) stufe = t.ab; sicht = 'ueben'; merken(); zeigen(); });
        karte.addEventListener('toggle', function () { if (karte.open && !a) beispiel(); });
        raster.append(karte);
      });
      inhalt.append(raster);
    }

    // ---------- Aufgabe als Karte ----------
    function aufgabeKarte(a, beiAntwort, sprintModus) {
      const karte = el('div', 'kr-karte');
      const kopf = el('div', 'kr-karte-kopf'); kopf.append(el('span', 'kr-trickname', a.titel), el('span', 'kr-marke kr-stufe-' + a.stufe, STUFEN[a.stufe])); karte.append(kopf);
      if (a.text) karte.append(el('p', 'kr-text', a.text));
      const f = el('div', 'kr-frage'); Formel.setze(f, a.frage + (a.art === 'wahl' ? '' : ' = \\ ?'), true); karte.append(f);
      const form = el('form', 'kr-antwort'); form.setAttribute('autocomplete', 'off'); karte.append(form);
      let fertig = false;
      function abgeben(wert) { if (fertig) return; fertig = true; beiAntwort(wert, richtig(a, wert)); }
      karte.aufgeben = function () { if (fertig) return; fertig = true; Array.prototype.forEach.call(form.querySelectorAll('input, button'), function (x) { x.disabled = true; }); beiAntwort('', false); };
      if (a.art === 'wahl') {
        const g = el('div', 'kr-wahl'); a.optionen.forEach(function (o) { const b = knopf(o[1]); b.addEventListener('click', function () { abgeben(o[0]); Array.prototype.forEach.call(g.children, function (x) { x.disabled = true; }); b.classList.add('gewaehlt'); }); g.append(b); }); form.append(g);
        form.addEventListener('submit', function (e) { e.preventDefault(); });
        karte.fokus = function () { const b = g.querySelector('button'); if (b) b.focus(); };
      } else {
        const inp = el('input', 'kr-eingabe'); inp.type = 'text'; inp.setAttribute('inputmode', a.art === 'bruch' || a.negativ ? 'text' : 'decimal'); inp.setAttribute('aria-label', 'Deine Antwort'); inp.setAttribute('data-nicht-merken', ''); inp.setAttribute('enterkeyhint', 'done'); inp.spellcheck = false;
        form.append(inp);
        if (a.einheit) form.append(el('span', 'kr-einheit', a.einheit));
        if (a.negativ) { const vz = knopf('±', 'kr-vz'); vz.title = 'Vorzeichen'; vz.addEventListener('click', function () { const v = inp.value.trim(); inp.value = /^[-−]/.test(v) ? v.replace(/^[-−]/, '') : '−' + v; inp.focus(); }); form.append(vz); }
        const ok = knopf(sprintModus ? 'Weiter' : 'Prüfen', 'primaer'); ok.type = 'submit'; form.append(ok);
        form.addEventListener('submit', function (e) { e.preventDefault(); if (!inp.value.trim() && !sprintModus) { inp.focus(); return; } inp.disabled = true; ok.disabled = true; abgeben(inp.value); });
        karte.fokus = function () { try { inp.focus({ preventScroll: true }); } catch (x) { inp.focus(); } };
        karte.eingabe = inp;
      }
      return karte;
    }
    function loesungsweg(a, ziel) {
      const box = el('div', 'kr-loesung'); box.append(el('div', 'kr-bsp-kopf', 'So geht der Trick'));
      const ol = el('ol', 'kr-schritte'); a.schritte.forEach(function (s) { const li = el('li'); setzeText(li, s); ol.append(li); }); box.append(ol); ziel.append(box);
    }

    // ---------- Üben ----------
    let richtigZ = 0, gesamtZ = 0, serie = 0;
    function ueben() {
      const pool = nurTrick ? T.filter(function (t) { return t.id === nurTrick; }) : verfuegbar(kat, stufe);
      if (nurTrick) {
        const t = pool[0], hinweis = el('div', 'kr-nur'); hinweis.append(document.createTextNode('Nur: ' + t.titel + ' '));
        const weg = knopf('alle Tricks', 'kr-chip'); weg.addEventListener('click', function () { nurTrick = null; zeigen(); }); hinweis.append(weg); inhalt.append(hinweis);
      }
      if (!pool.length) { inhalt.append(el('p', 'hilfe', 'In dieser Rechenart gibt es auf dieser Stufe noch keine Aufgaben – wähle eine höhere Stufe.')); return; }
      const platz = el('div', 'kr-platz'), stand = el('div', 'kr-stand'); inhalt.append(platz, stand);
      function standZeigen() { stand.textContent = 'Richtig: ' + richtigZ + ' von ' + gesamtZ + ' · Serie: ' + serie + ' · beste Serie: ' + serieBest; }
      function naechste() {
        platz.textContent = '';
        const a = aufgabeZu(wahl(pool), stufe), start = Date.now();
        const karte = aufgabeKarte(a, function (wert, ok) {
          gesamtZ++; gezaehlt(ok); if (ok) { richtigZ++; serie++; if (serie > serieBest) { serieBest = serie; merken(); } } else serie = 0;
          const sek = (Date.now() - start) / 1000;
          const r = el('p', 'kr-rueck ' + (ok ? 'gut' : 'schlecht'), (ok ? 'Richtig' : String(wert).trim() ? 'Leider falsch' : 'Lösung') + ' – ' + (a.ungefaehr ? 'genau: ' : '') + anzeige(a) + (a.einheit ? ' ' + a.einheit : '') + ' · ' + zt(sek, 1) + ' s');
          const z2 = karte.querySelector('.kr-zeige'); if (z2) z2.remove();
          karte.append(r); loesungsweg(a, karte);
          const w = knopf('Nächste Aufgabe', 'primaer'); w.addEventListener('click', naechste); karte.append(w);
          standZeigen(); try { w.focus({ preventScroll: true }); } catch (x) { w.focus(); }
        }, false);
        const zeige = knopf('Lösung zeigen', 'kr-zeige'); zeige.addEventListener('click', function () { zeige.remove(); karte.aufgeben(); });
        karte.querySelector('.kr-antwort').append(zeige);
        platz.append(karte); karte.fokus(); standZeigen();
      }
      naechste();
    }

    // ---------- Sprint ----------
    function sprint() {
      const pool = verfuegbar(kat, stufe);
      if (!pool.length) { inhalt.append(el('p', 'hilfe', 'Auf dieser Stufe gibt es in dieser Rechenart noch keine Aufgaben.')); return; }
      const dauerWahl = el('div', 'leiste'); dauerWahl.append(el('span', 'hinweis-klein', 'Dauer:'));
      let dauer = Number(zustand.dauer) || 60;
      [60, 120, 300].forEach(function (d) { const b = knopf(d < 120 ? '1 Minute' : d / 60 + ' Minuten'); b.setAttribute('aria-pressed', d === dauer ? 'true' : 'false'); b.addEventListener('click', function () { dauer = d; zustand.dauer = d; Array.prototype.forEach.call(dauerWahl.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); bestZeigen(); }); dauerWahl.append(b); });
      const schluessel = function () { return kat + '|' + stufe + '|' + dauer; };
      const bestEl = el('p', 'kr-best'); function bestZeigen() { const b = best[schluessel()]; bestEl.textContent = b ? 'Bestwert hier: ' + b + ' richtig' : 'Noch kein Bestwert für diese Auswahl.'; }
      const start = knopf('Sprint starten', 'primaer gross');
      inhalt.append(el('p', 'hilfe', 'So viele Aufgaben wie möglich in der Zeit. Falsche Antworten kosten nichts außer Zeit – die Lösungen gibt es am Ende.'), dauerWahl, bestEl, start);
      bestZeigen();
      start.addEventListener('click', function () {
        inhalt.textContent = '';
        const balken = el('div', 'kr-zeit'), fuell = el('i'); balken.append(fuell);
        const anzeigeZ = el('div', 'kr-zeit-text'), platz = el('div', 'kr-platz'), rueck = el('p', 'kr-rueck-kurz');
        inhalt.append(balken, anzeigeZ, platz, rueck);
        let r = 0, f = 0; const fehler = [], ende = Date.now() + dauer * 1000;
        function tick() {
          const rest = Math.max(0, ende - Date.now());
          fuell.style.width = (rest / (dauer * 1000) * 100) + '%'; anzeigeZ.textContent = Math.ceil(rest / 1000) + ' s · ' + r + ' richtig' + (f ? ' · ' + f + ' falsch' : '');
          if (rest <= 0) schluss();
        }
        function naechste() {
          if (Date.now() >= ende) return schluss();
          platz.textContent = '';
          const a = aufgabeZu(wahl(pool), stufe);
          const karte = aufgabeKarte(a, function (wert, ok) {
            gezaehlt(ok); if (ok) { r++; rueck.textContent = '✓ richtig'; rueck.className = 'kr-rueck-kurz gut'; }
            else { f++; fehler.push([a, wert]); rueck.textContent = '✗ ' + anzeige(a) + (a.einheit ? ' ' + a.einheit : ''); rueck.className = 'kr-rueck-kurz schlecht'; }
            tick(); naechste();
          }, true);
          platz.append(karte); karte.fokus();
        }
        function schluss() {
          if (!sprintUhr) return; sprintStopp();
          const neu = !best[schluessel()] || r > best[schluessel()]; if (neu && r > 0) { best[schluessel()] = r; merken(); }
          inhalt.textContent = '';
          const erg = el('div', 'kr-karte kr-schluss');
          erg.append(el('div', 'kr-gross', r + ' richtig'), el('p', '', f + ' falsch in ' + (dauer < 120 ? 'einer Minute' : dauer / 60 + ' Minuten') + (neu && r > 0 ? ' – neuer Bestwert!' : ' · Bestwert ' + (best[schluessel()] || 0))));
          if (fehler.length) {
            erg.append(el('div', 'kr-bsp-kopf', 'Deine Fehler'));
            fehler.slice(0, 20).forEach(function (x) {
              const d = el('details', 'kr-fehler'), s = el('summary'), fs = el('span'); Formel.setze(fs, x[0].frage, false);
              s.append(fs, document.createTextNode(' – deine Antwort: ' + (String(x[1]).trim() || '(leer)') + ', richtig: ' + anzeige(x[0]) + (x[0].einheit ? ' ' + x[0].einheit : ''))); d.append(s); loesungsweg(x[0], d); erg.append(d);
            });
          }
          const nochmal = knopf('Noch ein Sprint', 'primaer'); nochmal.addEventListener('click', zeigen); erg.append(nochmal);
          inhalt.append(erg); nochmal.focus();
        }
        sprintUhr = setInterval(tick, 200); tick(); naechste();
      });
    }

    zeigen();
    return { zeigen: zeigen, verlassen: function () { sprintStopp(); sperren(false); } };
  }

  window.Kopfrechnen = { KATEGORIEN: KATEGORIEN, TRICKS: T, STUFEN: STUFEN, aufgabeZu: aufgabeZu, verfuegbar: verfuegbar, lese: lese, richtig: richtig, anzeige: anzeige, zt: zt, baue: baue };
})();
