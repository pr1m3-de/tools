/* Baukasten für Animationen der Rechnerseiten: Text, Pfeile, Diagramme, Ansichten.
   Wird nach rechner.js geladen; die Seiten holen sich die Teile über window.Baukasten. */
(function () {
  'use strict';
  const R = Rechner, tz = R.tz, E = R.E, F = R.farbe, zz = R.zahl, rd = R.rund;
  const PI2 = 2 * Math.PI, W2 = Math.SQRT2, GRAD = Math.PI / 180;
  const BLAU = '#2B7BB9', ROT = '#C0392B', GRUEN = '#2E8B57', ORANGE = '#E07A1F', LILA = '#9333EA', GRAU = '#6B7785', GELB = '#E0A800', KUPFER = '#B87333', TUERKIS = '#0E7C86';
  function T(cx, s, x, y, a, g, fett, c) { R.Z.text(cx, s, x, y, a || 'left', g || 11, !!fett, c); }
  // Text mit Zeilenumbruch auf maxW; gibt die Zeilenzahl zurück
  function TW(cx, s, x, y, maxW, g, fett, c, lh, a) {
    g = g || 11; lh = lh || g + 4;
    cx.font = (fett ? '600 ' : '') + g + 'px ' + (F('--technik') || 'sans-serif');
    const worte = String(s).split(' '), zeilen = []; let z = '';
    worte.forEach(function (w) { const t = z ? z + ' ' + w : w; if (z && cx.measureText(t).width > maxW) { zeilen.push(z); z = w; } else z = t; });
    if (z) zeilen.push(z);
    zeilen.forEach(function (t, i) { T(cx, t, x, y + i * lh, a || 'left', g, fett, c); });
    return zeilen.length;
  }
  // wie TW, aber die letzte Zeile steht auf yUnten
  function TWU(cx, s, x, yUnten, maxW, g, fett, c) {
    g = g || 11; const lh = g + 4;
    cx.font = (fett ? '600 ' : '') + g + 'px ' + (F('--technik') || 'sans-serif');
    let n = 1, z = ''; String(s).split(' ').forEach(function (w) { const t = z ? z + ' ' + w : w; if (z && cx.measureText(t).width > maxW) { n++; z = w; } else z = t; });
    return TW(cx, s, x, yUnten - (n - 1) * lh, maxW, g, fett, c, lh);
  }
  function pfeil(cx, x1, y1, x2, y2, farbe, b) { cx.strokeStyle = farbe; cx.fillStyle = farbe; cx.lineWidth = b || 2; R.Z.pfeil(cx, x1, y1, x2, y2, 6 + (b || 2) * 1.5); }
  function kreis(cx, x, y, r, fuell, rand, b) { cx.beginPath(); cx.arc(x, y, Math.max(0.1, r), 0, PI2); if (fuell) { cx.fillStyle = fuell; cx.fill(); } if (rand) { cx.strokeStyle = rand; cx.lineWidth = b || 1.5; cx.stroke(); } }
  function strecke(cx, x1, y1, x2, y2, farbe, b, strich) { cx.strokeStyle = farbe; cx.lineWidth = b || 1.5; if (strich) cx.setLineDash(strich); cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2, y2); cx.stroke(); if (strich) cx.setLineDash([]); }
  function zug(cx, pts, farbe, b, strich) { if (pts.length < 2) return; cx.strokeStyle = farbe; cx.lineWidth = b || 2; if (strich) cx.setLineDash(strich); cx.beginPath(); pts.forEach(function (p, i) { if (i) cx.lineTo(p[0], p[1]); else cx.moveTo(p[0], p[1]); }); cx.stroke(); if (strich) cx.setLineDash([]); }
  // Zeitschritt in s aus der Bildzeit (0 bei Neuzeichnen ohne Zeitfortschritt)
  function uhr() { let alt = null; return function (t) { const d = alt === null ? 0 : (t - alt) / 1000; alt = t; return Math.max(0, Math.min(0.05, d)); }; }
  // Diagramm: reihen [{ name, farbe, punkte: [[x, y]], breite, punkt: [x, y], strich }]
  function diagramm(cx, x, y, w, h, reihen, o) {
    cx.fillStyle = F('--flaeche'); cx.fillRect(x, y, w, h); cx.strokeStyle = F('--linie'); cx.lineWidth = 1; cx.strokeRect(x, y, w, h);
    let lz = 1, lx0 = x + 8; cx.font = '600 10px ' + (F('--technik') || 'sans-serif'); reihen.forEach(function (r) { if (!r.name) return; const bw = cx.measureText(r.name).width; if (lx0 > x + 8 && lx0 + bw > x + w - 6) { lx0 = x + 8; lz++; } lx0 += bw + 14; });
    const x0 = x + 46, x1 = x + w - 10, y0 = y + 40 + (lz - 1) * 13, y1 = y + h - 30, xr = o.xr, yr = o.yr;
    const X = function (v) { return x0 + (v - xr[0]) / (xr[1] - xr[0]) * (x1 - x0); }, Y = function (v) { return y1 - (Math.max(yr[0], Math.min(yr[1], v)) - yr[0]) / (yr[1] - yr[0]) * (y1 - y0); };
    const ys = schritt(yr[1] - yr[0], 4), xs = schritt(xr[1] - xr[0], Math.max(2, Math.min(5, Math.floor((x1 - x0) / 70))));
    cx.strokeStyle = F('--linie'); cx.beginPath();
    teilung(yr, ys).forEach(function (v) { cx.moveTo(x0, Y(v)); cx.lineTo(x1, Y(v)); });
    cx.stroke();
    teilung(yr, ys).forEach(function (v) { T(cx, zz(v, stellen(ys)), x0 - 4, Y(v), 'right', 9, false, GRAU); });
    teilung(xr, xs).forEach(function (v) { T(cx, zz(v, stellen(xs)), X(v), y1 + 10, 'center', 9, false, GRAU); });
    if (yr[0] < 0 && yr[1] > 0) strecke(cx, x0, Y(0), x1, Y(0), F('--text'), 1);
    strecke(cx, x0, y0, x0, y1, F('--text'), 1);
    T(cx, o.titel, x + 8, y + 12, 'left', 11, true);
    if (o.xl) T(cx, o.xl, x1, y1 + 22, 'right', 10, false, GRAU);
    let lx = x + 8, ly = y + 25;
    reihen.forEach(function (r) { if (!r.name) return; cx.font = '600 10px ' + (F('--technik') || 'sans-serif'); const bw = cx.measureText(r.name).width; if (lx > x + 8 && lx + bw > x + w - 6) { lx = x + 8; ly += 13; } T(cx, r.name, lx, ly, 'left', 10, true, r.farbe); lx += bw + 14; });
    reihen.forEach(function (r) {
      cx.save(); cx.beginPath(); cx.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 4); cx.clip();
      zug(cx, r.punkte.filter(function (p) { return isFinite(p[0]) && isFinite(p[1]); }).map(function (p) { return [X(p[0]), Y(p[1])]; }), r.farbe, r.breite || 2, r.strich);
      cx.restore();
      if (r.punkt && isFinite(r.punkt[0]) && isFinite(r.punkt[1])) kreis(cx, X(r.punkt[0]), Y(r.punkt[1]), 4.5, r.farbe);
    });
    return { X: X, Y: Y, x0: x0, x1: x1, y0: y0, y1: y1 };
  }
  // Achsenteilung mit runden Schritten
  function schritt(spanne, n) { if (!(spanne > 0)) return 1; const roh = spanne / n, p = Math.pow(10, Math.floor(Math.log10(roh))), m = roh / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
  function teilung(b, sp) { const l = []; for (let v = Math.ceil(b[0] / sp - 1e-9) * sp; v <= b[1] + sp * 1e-6 && l.length < 30; v += sp) l.push(Math.abs(v) < sp * 1e-9 ? 0 : v); return l; }
  function stellen(sp) { return sp >= 1 ? (Math.abs(sp - Math.round(sp)) > 1e-9 ? 1 : 0) : Math.min(4, Math.ceil(-Math.log10(sp) - 1e-9)); }
  function runde(b, n) { const sp = schritt(b[1] - b[0], n || 4); return [Math.floor(b[0] / sp) * sp, Math.ceil(b[1] / sp) * sp]; }
  // Leiste mit Ansichten über dem Bild
  function ansichten(seite, liste, start, wechsel) {
    let jetzt = start;
    const ziel = seite && seite.bildZusatz; if (!ziel) return function () { return jetzt; };
    const leiste = document.createElement('div'); leiste.className = 'ansichten'; leiste.setAttribute('role', 'group'); leiste.setAttribute('aria-label', 'Ansicht wählen');
    const knoepfe = liste.map(function (a) {
      const k = document.createElement('button'); k.type = 'button'; k.className = 'knopf'; k.textContent = a[1]; k.setAttribute('data-nicht-merken', '');
      k.setAttribute('aria-pressed', a[0] === jetzt ? 'true' : 'false');
      k.addEventListener('click', function () { jetzt = a[0]; knoepfe.forEach(function (x, i) { x.setAttribute('aria-pressed', liste[i][0] === jetzt ? 'true' : 'false'); }); if (wechsel) wechsel(jetzt); seite.neu(); if (seite.ansagen) seite.ansagen(); });
      leiste.append(k); return k;
    });
    const cv = ziel.parentNode.querySelector('canvas'); ziel.parentNode.insertBefore(leiste, cv || ziel);
    return function () { return jetzt; };
  }
  // Zufall mit festem Startwert (gleiches Bild bei jedem Neuzeichnen)
  function zufall(s) { let x = s || 1; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
  function bildCanvas() { return document.querySelector('canvas.rechner-bild'); }
  // Zeigerposition im Bild in CSS-Pixeln
  function zeiger(cv, ev) { const r = cv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }

  window.Baukasten = { R: R, tz: tz, E: E, F: F, zz: zz, rd: rd, PI2: PI2, W2: W2, GRAD: GRAD, BLAU: BLAU, ROT: ROT, GRUEN: GRUEN, ORANGE: ORANGE, LILA: LILA, GRAU: GRAU, GELB: GELB, KUPFER: KUPFER, TUERKIS: TUERKIS, T: T, TW: TW, TWU: TWU, pfeil: pfeil, kreis: kreis, strecke: strecke, zug: zug, uhr: uhr, diagramm: diagramm, schritt: schritt, teilung: teilung, stellen: stellen, runde: runde, ansichten: ansichten, zufall: zufall, bildCanvas: bildCanvas, zeiger: zeiger };
})();
