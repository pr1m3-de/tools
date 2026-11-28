/* Elektroplanung: Bauplan, Stromlaufplan, Verdrahtungsplan
 * Ein Projekt (P) beschreibt Geschosse, Räume, Geräte (Symbole im Bauplan), Stromkreise und Fehlerstrom-Schutzschalter.
 * Alles andere – Schaltungsarten, Abzweigdosen, Kabel, Klemmen, Längen, Prüfungen, Pläne – wird daraus berechnet.
 * Nur ES2015, keine externen Bibliotheken.
 */
(function () {
  'use strict';
  const SPEICHER = 'elektroplanung-1', BILD = 'elektroplanung-bild-';
  const $ = function (id) { return document.getElementById(id); };
  function el(tag, klasse, text) { const k = document.createElement(tag); if (klasse) k.className = klasse; if (text !== undefined && text !== null) k.textContent = text; return k; }
  const kopie = function (o) { return JSON.parse(JSON.stringify(o)); };
  const runde = function (x, n) { const f = Math.pow(10, n || 0); return Math.round(x * f) / f; };
  const zahl = function (x, n) { return isFinite(x) ? runde(x, n === undefined ? 1 : n).toFixed(n === undefined ? 1 : n).replace('.', ',') : '–'; };
  const lies = function (t) { const s = String(t).trim().replace(/\s/g, '').replace(',', '.'); return s === '' ? NaN : Number(s); };
  const esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  let idZaehler = 0;
  function neueId(p) { idZaehler++; return p + Date.now().toString(36).slice(-4) + idZaehler.toString(36); }

  // ---------- Katalog der Symbole ----------
  // kat: Gruppe in der Palette; h: Einbauhöhe (m, Mitte); wand: rastet an Wänden ein; kreis: braucht einen Stromkreis
  const TYP = {
    sd: { n: 'Steckdose', kat: 'Steckdosen', h: 0.3, wand: true, kreis: true, bmk: 'XD' },
    sd400: { n: 'CEE-Steckdose 400 V', kat: 'Steckdosen', h: 1.05, wand: true, kreis: true, bmk: 'XD', drei: true },
    schalter: { n: 'Schalter', kat: 'Schalter', h: 1.05, wand: true, kreis: true, bmk: 'S', schalt: true },
    serie: { n: 'Serienschalter', kat: 'Schalter', h: 1.05, wand: true, kreis: true, bmk: 'S', schalt: true },
    taster: { n: 'Taster (Stromstoß)', kat: 'Schalter', h: 1.05, wand: true, kreis: true, bmk: 'S', schalt: true },
    dimmer: { n: 'Dimmer', kat: 'Schalter', h: 1.05, wand: true, kreis: true, bmk: 'S', schalt: true },
    bwm: { n: 'Bewegungsmelder', kat: 'Schalter', h: 2.2, wand: true, kreis: true, bmk: 'B', schalt: true },
    jalousie: { n: 'Rollladenschalter', kat: 'Schalter', h: 1.05, wand: true, kreis: true, bmk: 'S' },
    leuchte: { n: 'Deckenleuchte', kat: 'Leuchten', h: 0, wand: false, kreis: true, bmk: 'E', lampe: true },
    wandleuchte: { n: 'Wandleuchte', kat: 'Leuchten', h: 2.0, wand: true, kreis: true, bmk: 'E', lampe: true },
    motor: { n: 'Rollladenmotor', kat: 'Geräte', h: 2.3, wand: true, kreis: true, bmk: 'M' },
    geraet: { n: 'Geräteanschluss 230 V', kat: 'Geräte', h: 0.6, wand: true, kreis: true, bmk: 'E', P: 2000 },
    geraet3: { n: 'Geräteanschluss 400 V', kat: 'Geräte', h: 0.6, wand: true, kreis: true, bmk: 'E', P: 7000, drei: true },
    uv: { n: 'Verteiler', kat: 'Sonstiges', h: 1.6, wand: true },
    dose: { n: 'Abzweigdose', kat: 'Sonstiges', h: 0, wand: true },
    daten: { n: 'Datendose', kat: 'Sonstiges', h: 0.3, wand: true },
    tv: { n: 'Antennendose', kat: 'Sonstiges', h: 0.3, wand: true },
    rm: { n: 'Rauchmelder', kat: 'Sonstiges', h: 0, wand: false }
  };
  const KATS = ['Steckdosen', 'Schalter', 'Leuchten', 'Geräte', 'Sonstiges'];
  const RAUMTYP = [['wohn', 'Wohnzimmer'], ['schlaf', 'Schlafzimmer'], ['kind', 'Kinderzimmer'], ['arbeit', 'Arbeitszimmer'], ['kueche', 'Küche'], ['essen', 'Essbereich'], ['bad', 'Bad / Dusche'], ['wc', 'WC'], ['flur', 'Flur / Diele'], ['abstell', 'Abstellraum'], ['hwr', 'Hausarbeitsraum'], ['keller', 'Keller'], ['aussen', 'Außen / Terrasse'], ['sonst', 'Sonstiger Raum']];
  const LS_IN = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63];
  const QUERSCHNITTE = [1.5, 2.5, 4, 6, 10, 16];
  // Strombelastbarkeit Cu, PVC 70 °C, 30 °C Umgebung (DIN VDE 0298-4, Tab. 3) – Verlegearten A1, B2, C
  const VERLEGUNG = [['A1', 'A1 – im Rohr in wärmegedämmter Wand'], ['B2', 'B2 – im Rohr auf oder in der Wand'], ['C', 'C – direkt in oder auf der Wand']];
  const IZ = {
    2: { 1.5: [15.5, 16.5, 19.5], 2.5: [19.5, 23, 27], 4: [26, 30, 36], 6: [34, 38, 46], 10: [46, 52, 63], 16: [61, 69, 85] },
    3: { 1.5: [13.5, 15, 17.5], 2.5: [18, 20, 24], 4: [24, 27, 32], 6: [31, 34, 41], 10: [42, 46, 57], 16: [56, 62, 76] }
  };
  function iz(belastet, a, verlegung) { const t = IZ[belastet >= 3 ? 3 : 2][a]; return t ? t[Math.max(0, ['A1', 'B2', 'C'].indexOf(verlegung))] : 0; }
  const KAPPA = 56;          // m/(Ω·mm²), Kupfer bei 20 °C (Spannungsfall nach DIN 18015-1)
  const WARM = 1.24;          // Widerstandserhöhung bei 80 °C für die Schleifenimpedanz (DIN VDE 0100-600)

  // Aderfarben (DIN VDE 0293-308) und Kurzzeichen
  const ADERN = { 3: ['gnge', 'bl', 'br'], 4: ['gnge', 'br', 'sw', 'gr'], 5: ['gnge', 'bl', 'br', 'sw', 'gr'] };
  const FARBE = { gnge: '#2F9E44', bl: '#1C7ED6', br: '#8B5A2B', sw: '#111111', gr: '#868E96' };
  const FNAME = { gnge: 'gn-ge', bl: 'bl', br: 'br', sw: 'sw', gr: 'gr' };

  // ---------- Beispiel: Wohnung mit typischen Schaltungen ----------
  function beispiel() {
    const g = 'g1';
    const P = {
      v: 1,
      projekt: { name: 'Wohnung Musterstraße 1, EG', kunde: 'Familie Muster', adresse: 'Musterstraße 1, 12345 Musterstadt', ersteller: '', firma: '', datum: heute(), zeichnung: 'EP-001', netz: 'TN-C-S', zvor: 0.35, maxRcd: 4, ausstattung: 1, symbol: 0.32, format: 'A3', revision: 'A' },
      geschosse: [{ id: g, name: 'Erdgeschoss', hoehe: 2.75, raum: 2.5, bildB: 0, bildX: 0, bildY: 0, bildDeck: 0.5 }],
      aktiv: g,
      raeume: [
        { id: 'r1', g: g, name: 'Flur', typ: 'flur', x: 0, y: 4, w: 7.5, l: 1.6 },
        { id: 'r2', g: g, name: 'Wohnzimmer', typ: 'wohn', x: 0, y: 0, w: 5, l: 4 },
        { id: 'r3', g: g, name: 'Küche', typ: 'kueche', x: 5, y: 0, w: 3.5, l: 4 },
        { id: 'r4', g: g, name: 'Bad', typ: 'bad', x: 7.5, y: 4, w: 2.5, l: 3 },
        { id: 'r5', g: g, name: 'Schlafzimmer', typ: 'schlaf', x: 0, y: 5.6, w: 4, l: 3.6 },
        { id: 'r6', g: g, name: 'Kinderzimmer', typ: 'kind', x: 4, y: 5.6, w: 3.5, l: 3.6 },
        { id: 'r7', g: g, name: 'Terrasse', typ: 'aussen', x: 0, y: -2.2, w: 5, l: 2 }
      ],
      geraete: [], kreise: [], rcds: []
    };
    const d = function (t, x, y, rot, extra) { const o = { id: neueId('d'), t: t, g: g, x: x, y: y, rot: rot || 0, k: '', gr: '', gr2: '', anz: 1, ip: false, eigen: false, name: '', P: TYP[t].P || 0, h: null }; Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; }); P.geraete.push(o); return o; };
    // Verteiler im Flur
    d('uv', 7.3, 4.3, 1);
    // Flur: Stromstoßschaltung mit drei Tastern, zwei Leuchten
    d('leuchte', 2, 4.8); d('leuchte', 5.5, 4.8);
    d('taster', 0.2, 4.4, 3); d('taster', 4.3, 5.55, 2); d('taster', 7.3, 5.4, 1);
    d('sd', 3.2, 4.05, 0); d('rm', 3.7, 4.8);
    // Wohnzimmer: Kreuzschaltung (3 Schaltstellen), Wandleuchten mit Dimmer, Rollladen
    d('leuchte', 2.5, 2); d('schalter', 4.6, 3.95, 0); d('schalter', 0.05, 3.2, 3); d('schalter', 2.5, 0.05, 2);
    d('wandleuchte', 0.05, 1, 3); d('wandleuchte', 4.95, 1, 1); d('dimmer', 4.95, 3.3, 1);
    d('sd', 0.05, 2, 3, { anz: 2 }); d('sd', 1.5, 3.95, 0, { anz: 3 }); d('sd', 4.95, 2.2, 1, { anz: 2 }); d('sd', 3.5, 0.05, 2);
    d('daten', 1.9, 3.95, 0, { anz: 2 }); d('tv', 1.1, 3.95, 0);
    d('motor', 1.6, 0.05, 2); d('jalousie', 0.9, 0.05, 2);
    d('rm', 3.3, 2.4);
    // Küche: Herd, Geschirrspüler, Arbeitsplatte, Wechselschaltung
    d('leuchte', 6.75, 2); d('schalter', 5.6, 3.95, 0); d('schalter', 8.45, 3.3, 1);
    d('geraet3', 8.45, 1.2, 1, { name: 'Herd', P: 10800 }); d('geraet', 7.2, 0.05, 2, { name: 'Geschirrspüler', P: 2200 });
    d('sd', 5.05, 1.2, 3, { anz: 2, h: 1.15 }); d('sd', 5.05, 2.8, 3, { anz: 2, h: 1.15 }); d('wandleuchte', 5.05, 2.0, 3); d('sd', 8.45, 0.4, 1, { anz: 2, h: 1.15 }); d('sd', 6.0, 0.05, 2, { h: 1.15, anz: 2 }); d('sd', 8.45, 2.4, 1, { name: 'Kühlschrank' });
    // Bad: Serienschalter für Decke und Spiegel, Steckdosen, Waschmaschine
    d('leuchte', 8.75, 5.5); d('wandleuchte', 9.95, 5.8, 1); d('serie', 7.55, 4.6, 3);
    d('sd', 9.95, 6.4, 1, { anz: 2, h: 1.15 }); d('sd', 8.6, 6.95, 0, { name: 'Waschmaschine', eigen: true, P: 2300 });
    // Schlafzimmer: Wechselschaltung Tür und Bett
    d('leuchte', 2, 7.4); d('schalter', 3.5, 5.65, 2); d('schalter', 0.05, 8.3, 3);
    d('sd', 0.05, 6.6, 3, { anz: 2 }); d('sd', 0.05, 8.7, 3, { anz: 2 }); d('sd', 3.95, 7.4, 1, { anz: 2 }); d('sd', 2.6, 9.15, 0); d('rm', 2.6, 6.8);
    // Kinderzimmer: Ausschaltung
    d('leuchte', 5.75, 7.4); d('schalter', 4.5, 5.65, 2);
    d('sd', 4.05, 7.0, 3, { anz: 2 }); d('sd', 4.05, 8.6, 3); d('sd', 7.45, 7.4, 1, { anz: 2 }); d('sd', 6.0, 9.15, 0, { anz: 2 }); d('rm', 5.2, 7.9);
    // Terrasse: Bewegungsmelder mit Außenleuchte, Außensteckdose
    d('wandleuchte', 2.5, -0.25, 0); d('bwm', 4, -0.25, 0); d('sd', 1.2, -0.25, 0, { ip: true });
    // Wallbox außen am Haus (eigener Stromkreis, eigener RCD)
    d('geraet3', 4.8, -0.25, 0, { name: 'Wallbox', P: 11000, h: 1.2 });
    kreiseNeuBilden(P);
    return P;
  }
  function heute() { const d = new Date(); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }

  // ---------- Prüfen und Angleichen (Speicher, Link, Datei) ----------
  const ID = /^[A-Za-z0-9_-]{1,24}$/;
  function txt(v, n, std) { return typeof v === 'string' ? v.replace(/[\u0000-\u001F<>]/g, '').slice(0, n || 60) : (std || ''); }
  function num(v, min, max, std) { return typeof v === 'number' && isFinite(v) && v >= min && v <= max ? v : std; }
  function eins(v, liste, std) { return liste.indexOf(v) >= 0 ? v : std; }
  function pruefeProjekt(p) {
    if (!p || typeof p !== 'object' || !Array.isArray(p.geschosse) || !Array.isArray(p.raeume) || !Array.isArray(p.geraete)) return false;
    const pr = p.projekt && typeof p.projekt === 'object' ? p.projekt : {};
    p.v = 1;
    p.projekt = {
      name: txt(pr.name, 80), kunde: txt(pr.kunde, 80), adresse: txt(pr.adresse, 100), ersteller: txt(pr.ersteller, 60), firma: txt(pr.firma, 80),
      datum: txt(pr.datum, 20, heute()), zeichnung: txt(pr.zeichnung, 30), revision: txt(pr.revision, 6),
      netz: eins(pr.netz, ['TN-C-S', 'TN-S', 'TT'], 'TN-C-S'), zvor: num(pr.zvor, 0, 5, 0.35), maxRcd: num(pr.maxRcd, 1, 12, 4),
      ausstattung: num(pr.ausstattung, 1, 3, 1), symbol: num(pr.symbol, 0.15, 1, 0.32), format: eins(pr.format, ['A3', 'A4'], 'A3'), ra: num(pr.ra, 0, 500, 30)
    };
    p.geschosse = p.geschosse.filter(function (g) { return g && ID.test(g.id); }).slice(0, 8).map(function (g) {
      return { id: g.id, name: txt(g.name, 30, 'Geschoss'), hoehe: num(g.hoehe, 2, 6, 2.75), raum: num(g.raum, 2, 5, 2.5), bildB: num(g.bildB, 0, 500, 0), bildX: num(g.bildX, -500, 500, 0), bildY: num(g.bildY, -500, 500, 0), bildDeck: num(g.bildDeck, 0.05, 1, 0.5) };
    });
    if (!p.geschosse.length) return false;
    const gids = p.geschosse.map(function (g) { return g.id; });
    p.aktiv = eins(p.aktiv, gids, gids[0]);
    p.raeume = p.raeume.filter(function (r) { return r && ID.test(r.id) && gids.indexOf(r.g) >= 0; }).slice(0, 200).map(function (r) {
      return { id: r.id, g: r.g, name: txt(r.name, 30, 'Raum'), typ: eins(r.typ, RAUMTYP.map(function (t) { return t[0]; }), 'sonst'), x: num(r.x, -500, 500, 0), y: num(r.y, -500, 500, 0), w: num(r.w, 0.3, 200, 3), l: num(r.l, 0.3, 200, 3) };
    });
    p.rcds = (Array.isArray(p.rcds) ? p.rcds : []).filter(function (q) { return q && ID.test(q.id); }).slice(0, 30).map(function (q) {
      return { id: q.id, nr: num(q.nr, 1, 99, 1), i: eins(q.i, [25, 40, 63, 80], 40), idn: eins(q.idn, [10, 30, 100, 300], 30), typ: eins(q.typ, ['A', 'F', 'B', 'EV'], 'A'), pole: eins(q.pole, [2, 4], 4) };
    });
    const qids = p.rcds.map(function (q) { return q.id; });
    p.kreise = (Array.isArray(p.kreise) ? p.kreise : []).filter(function (k) { return k && ID.test(k.id); }).slice(0, 80).map(function (k) {
      return { id: k.id, nr: num(k.nr, 1, 199, 1), name: txt(k.name, 40), art: eins(k.art, ['licht', 'sd', 'last', 'last3', 'gemischt'], 'gemischt'),
        c: eins(k.c, ['B', 'C'], 'B'), i: eins(k.i, LS_IN, 16), rcd: k.rcd === 'rcbo' ? 'rcbo' : eins(k.rcd, qids, ''), ph: eins(k.ph, ['L1', 'L2', 'L3', '3'], 'L1'),
        typ: eins(k.typ, ['NYM-J', 'NYY-J'], 'NYM-J'), a: k.a === 0 ? 0 : eins(k.a, QUERSCHNITTE, 0), verlegung: eins(k.verlegung, ['A1', 'B2', 'C'], 'C'), zus: num(k.zus, 0, 200, 0), wallbox: k.wallbox === true, fest: k.fest === true };
    });
    const kids = p.kreise.map(function (k) { return k.id; });
    p.geraete = p.geraete.filter(function (d) { return d && ID.test(d.id) && TYP[d.t] && gids.indexOf(d.g) >= 0; }).slice(0, 1500).map(function (d) {
      return { id: d.id, t: d.t, g: d.g, x: num(d.x, -500, 500, 0), y: num(d.y, -500, 500, 0), rot: eins(d.rot, [0, 1, 2, 3], 0), k: eins(d.k, kids, ''),
        gr: /^[a-z]{0,2}$/.test(d.gr || '') ? (d.gr || '') : '', gr2: /^[a-z]{0,2}$/.test(d.gr2 || '') ? (d.gr2 || '') : '',
        anz: num(d.anz, 1, 4, 1), ip: d.ip === true, eigen: d.eigen === true, name: txt(d.name, 30), P: num(d.P, 0, 50000, TYP[d.t].P || 0), h: d.h === null || d.h === undefined ? null : num(d.h, 0, 6, null) };
    });
    Object.keys(p).forEach(function (k) { if (['v', 'projekt', 'geschosse', 'aktiv', 'raeume', 'geraete', 'kreise', 'rcds'].indexOf(k) < 0) delete p[k]; });
    return true;
  }

  // ---------- Geometrie ----------
  function raumVon(P, d) {
    // Raum, in dem das Gerät liegt (Wandgeräte sitzen auf der Kante); sonst der nächstgelegene Raum im Geschoss
    let best = null, bd = Infinity;
    P.raeume.forEach(function (r) {
      if (r.g !== d.g) return;
      const dx = Math.max(r.x - d.x, 0, d.x - (r.x + r.w)), dy = Math.max(r.y - d.y, 0, d.y - (r.y + r.l)), ab = Math.sqrt(dx * dx + dy * dy);
      const innen = d.x > r.x + 0.02 && d.x < r.x + r.w - 0.02 && d.y > r.y + 0.02 && d.y < r.y + r.l - 0.02;
      const w = innen ? -1 : ab;
      if (w < bd) { bd = w; best = r; }
    });
    return best;
  }
  function geschoss(P, id) { return P.geschosse.filter(function (g) { return g.id === id; })[0] || P.geschosse[0]; }
  function geschossIndex(P, id) { return Math.max(0, P.geschosse.map(function (g) { return g.id; }).indexOf(id)); }
  function hoeheVon(P, d) { const g = geschoss(P, d.g); return d.h !== null && d.h !== undefined ? d.h : (TYP[d.t].h || g.raum); }
  function flaeche(r) { return r.w * r.l; }

  // ======================================================================
  //  Stromkreise bilden (automatisch, auf Knopfdruck oder für neue Geräte)
  // ======================================================================
  const istLicht = function (d) { return d.t === 'leuchte' || d.t === 'wandleuchte' || TYP[d.t].schalt || d.t === 'jalousie' || d.t === 'motor'; };
  const istLast = function (d) { return d.t === 'geraet' || d.t === 'geraet3' || d.t === 'sd400' || (d.t === 'sd' && d.eigen); };
  function iVon(p, drei) { const ib = drei ? p / (Math.sqrt(3) * 400) : p / 230; return LS_IN.filter(function (i) { return i >= Math.max(ib, drei ? 16 : 16); })[0] || 63; }
  function naechsteNr(P) { let n = 1; while (P.kreise.some(function (k) { return k.nr === n; })) n++; return n; }
  function neuerKreis(P, art, name, extra) {
    const k = { id: neueId('k'), nr: naechsteNr(P), name: name, art: art, c: 'B', i: art === 'licht' ? 10 : 16, rcd: '', ph: 'L1', typ: 'NYM-J', a: 0, verlegung: 'C', zus: 0 };
    Object.keys(extra || {}).forEach(function (x) { k[x] = extra[x]; });
    P.kreise.push(k);
    return k;
  }
  function geraeteIn(P, k) { return P.geraete.filter(function (d) { return d.k === k.id; }); }
  function freieGruppe(P, k) {
    const belegt = {};
    geraeteIn(P, k).forEach(function (d) { if (d.gr) belegt[d.gr] = 1; if (d.gr2) belegt[d.gr2] = 1; });
    for (let i = 0; i < 26; i++) { const b = String.fromCharCode(97 + i); if (!belegt[b]) return b; }
    return 'z';
  }
  // Raumweise Gruppen: Deckenleuchten, Wandleuchten, Schalter, Rollläden (für das vollständige Neubilden)
  function raumGruppen(P, r, liste) {
    const d = liste.filter(function (x) { const rr = raumVon(P, x); return rr && rr.id === r.id; });
    const nach = function (t) { return d.filter(function (x) { return x.t === t; }); };
    const deck = nach('leuchte'), wand = nach('wandleuchte'), sch = nach('schalter'), tas = nach('taster'), dim = nach('dimmer'), bwm = nach('bwm'), ser = nach('serie'), jal = nach('jalousie'), mot = nach('motor');
    const gr = [];
    if (ser.length) {
      gr.push({ lampen: deck.length ? deck : wand, schalter: sch.concat(tas, dim, bwm), serie: ser, teil: 1 });
      if (deck.length && wand.length) gr.push({ lampen: wand, schalter: [], serie: ser, teil: 2 });
    } else {
      let w = wand;
      const haupt = { lampen: deck.slice(), schalter: tas.length ? tas : sch.slice(), serie: [] };
      if (tas.length && sch.length) haupt.schalter = tas.concat(sch);
      if (dim.length && (deck.length || sch.length || tas.length)) { gr.push({ lampen: w, schalter: dim, serie: [] }); w = []; }
      else if (dim.length) { haupt.schalter = haupt.schalter.concat(dim); }
      if (bwm.length) {
        if (deck.length && w.length) { gr.push({ lampen: w, schalter: bwm, serie: [] }); w = []; }
        else haupt.schalter = haupt.schalter.concat(bwm);
      }
      haupt.lampen = haupt.lampen.concat(w);
      if (haupt.lampen.length || haupt.schalter.length) gr.unshift(haupt);
    }
    // Rollläden: Schalter und Motor paarweise nach Abstand
    const frei = mot.slice();
    jal.forEach(function (j) {
      frei.sort(function (a, b) { return Math.hypot(a.x - j.x, a.y - j.y) - Math.hypot(b.x - j.x, b.y - j.y); });
      gr.push({ lampen: frei.length ? [frei.shift()] : [], schalter: [j], serie: [], roll: true });
    });
    frei.forEach(function (m) { gr.push({ lampen: [m], schalter: [], serie: [], roll: true }); });
    return gr;
  }
  function verteilerVon(P) { return P.geraete.filter(function (d) { return d.t === 'uv'; })[0] || null; }
  function raumOrdnung(P) {
    const uv = verteilerVon(P);
    return P.raeume.slice().sort(function (a, b) {
      const ga = geschossIndex(P, a.g), gb = geschossIndex(P, b.g);
      if (ga !== gb) return ga - gb;
      if (uv) return Math.hypot(a.x + a.w / 2 - uv.x, a.y + a.l / 2 - uv.y) - Math.hypot(b.x + b.w / 2 - uv.x, b.y + b.l / 2 - uv.y);
      return a.y - b.y || a.x - b.x;
    });
  }
  function kreiseNeuBilden(P) {
    P.kreise = []; P.rcds = [];
    P.geraete.forEach(function (d) { if (TYP[d.t].kreis) { d.k = ''; d.gr = ''; d.gr2 = ''; } });
    const kreisGer = P.geraete.filter(function (d) { return TYP[d.t].kreis; });
    // 1. Licht und Rollläden: Räume der Reihe nach, bis 12 Brennstellen oder 4 Räume je Stromkreis
    let lk = null, lkRaeume = 0, lkLampen = 0;
    raumOrdnung(P).forEach(function (r) {
      const gruppen = raumGruppen(P, r, kreisGer.filter(istLicht));
      if (!gruppen.length) return;
      const lampen = gruppen.reduce(function (s, g) { return s + g.lampen.length; }, 0);
      if (!lk || lk.g !== r.g || lkRaeume >= 4 || lkLampen + lampen > 12) { lk = neuerKreis(P, 'licht', 'Licht'); lk.g = r.g; lkRaeume = 0; lkLampen = 0; }
      lk.name = lkRaeume ? lk.name + ', ' + r.name : 'Licht ' + r.name;
      lkRaeume++; lkLampen += lampen;
      const buchst = [];
      gruppen.forEach(function (g, i) {
        const b = freieGruppe(P, lk);
        buchst.push(b);
        g.lampen.concat(g.schalter).forEach(function (d) { d.k = lk.id; d.gr = b; });
        if (g.serie.length) g.serie.forEach(function (s) { s.k = lk.id; if (g.teil === 2) s.gr2 = b; else s.gr = b; });
        // freie Buchstaben fortlaufend halten
        void i;
      });
    });
    // übrig gebliebene Licht-Geräte (ohne Raum)
    kreisGer.filter(function (d) { return istLicht(d) && !d.k; }).forEach(function (d) {
      if (!lk) { lk = neuerKreis(P, 'licht', 'Licht'); lk.g = d.g; }
      d.k = lk.id; d.gr = freieGruppe(P, lk);
    });
    // 2. Geräte mit eigenem Stromkreis
    kreisGer.filter(istLast).forEach(function (d) {
      const drei = !!TYP[d.t].drei, r = raumVon(P, d), name = d.name || (d.t === 'sd400' ? 'CEE-Steckdose' : TYP[d.t].n) + (r ? ' ' + r.name : '');
      const k = neuerKreis(P, drei ? 'last3' : 'last', name, { ph: drei ? '3' : 'L1', i: iVon(d.P || (drei ? 7000 : 2000), drei), a: 0 });
      if (/wallbox|ladestation|ladepunkt/i.test(d.name)) k.wallbox = true;
      d.k = k.id;
    });
    // 3. Steckdosen: je Raum, Küche geteilt, Außensteckdosen zusammen, kleine Räume zusammengefasst
    let klein = null, kleinZahl = 0, aussen = null;
    raumOrdnung(P).forEach(function (r) {
      const sd = kreisGer.filter(function (d) { if (d.t !== 'sd' || d.k) return false; const rr = raumVon(P, d); return rr && rr.id === r.id; });
      if (!sd.length) return;
      const raus = sd.filter(function (d) { return d.ip || r.typ === 'aussen'; }), drin = sd.filter(function (d) { return raus.indexOf(d) < 0; });
      if (raus.length) { if (!aussen) aussen = neuerKreis(P, 'sd', 'Außensteckdosen'); raus.forEach(function (d) { d.k = aussen.id; }); }
      if (!drin.length) return;
      if (r.typ === 'kueche') {
        const n = Math.ceil(drin.length / 5);
        for (let i = 0; i < n; i++) { const k = neuerKreis(P, 'sd', 'Steckdosen ' + r.name + (n > 1 ? ' ' + (i + 1) : '')); drin.slice(i * 5, i * 5 + 5).forEach(function (d) { d.k = k.id; }); }
        return;
      }
      if ((flaeche(r) < 8 || drin.length <= 2) && r.typ !== 'bad') {
        if (!klein || klein.g !== r.g || kleinZahl + drin.length > 8) { klein = neuerKreis(P, 'sd', 'Steckdosen ' + r.name); klein.g = r.g; kleinZahl = 0; }
        else klein.name += ', ' + r.name;
        kleinZahl += drin.length;
        drin.forEach(function (d) { d.k = klein.id; });
        return;
      }
      const k = neuerKreis(P, 'sd', 'Steckdosen ' + r.name);
      drin.forEach(function (d) { d.k = k.id; });
    });
    kreisGer.filter(function (d) { return d.t === 'sd' && !d.k; }).forEach(function (d) { if (!klein) klein = neuerKreis(P, 'sd', 'Steckdosen'); d.k = klein.id; });
    P.kreise.forEach(function (k) { delete k.g; });
    schutzVerteilen(P);
  }
  // RCDs anlegen und Stromkreise darauf verteilen: Lichtkreise auf verschiedene RCDs, Außenleiter gleichmäßig belastet
  function schaetzeLast(P, k) {
    const ger = geraeteIn(P, k);
    if (k.art === 'licht') return ger.reduce(function (s, d) { return s + (TYP[d.t].lampe ? 60 : d.t === 'motor' ? 150 : 0); }, 0);
    if (k.art === 'sd') return 1500;
    return ger.reduce(function (s, d) { return s + (d.P || 0); }, 0) || 2000;
  }
  function schutzVerteilen(P) {
    P.rcds = [];
    const max = P.projekt ? P.projekt.maxRcd || 4 : 4;
    const normal = P.kreise.filter(function (k) { return !k.wallbox; }), wb = P.kreise.filter(function (k) { return k.wallbox; });
    const n = Math.max(1, Math.ceil(normal.length / max));
    for (let i = 0; i < n; i++) P.rcds.push({ id: neueId('q'), nr: i + 1, i: 40, idn: 30, typ: 'A', pole: 4 });
    const sortiert = normal.slice().sort(function (a, b) { return ['licht', 'sd', 'last', 'last3'].indexOf(a.art) - ['licht', 'sd', 'last', 'last3'].indexOf(b.art) || a.nr - b.nr; });
    const zahl = P.rcds.map(function () { return 0; });
    sortiert.forEach(function (k, i) {
      // reihum, aber nie mehr als max je RCD
      let j = i % n; let tries = 0;
      while (zahl[j] >= max && tries < n) { j = (j + 1) % n; tries++; }
      k.rcd = P.rcds[j].id; zahl[j]++;
    });
    wb.forEach(function (k) { const q = { id: neueId('q'), nr: P.rcds.length + 1, i: 40, idn: 30, typ: 'EV', pole: 4 }; P.rcds.push(q); k.rcd = q.id; });
    phasenVerteilen(P);
    // Kreise nach RCD und Art durchnummerieren, damit der Verteiler übersichtlich bleibt
    const folge = [];
    P.rcds.forEach(function (q) { P.kreise.filter(function (k) { return k.rcd === q.id; }).sort(function (a, b) { return ['licht', 'sd', 'last', 'last3'].indexOf(a.art) - ['licht', 'sd', 'last', 'last3'].indexOf(b.art) || a.nr - b.nr; }).forEach(function (k) { folge.push(k); }); });
    P.kreise.filter(function (k) { return folge.indexOf(k) < 0; }).forEach(function (k) { folge.push(k); });
    folge.forEach(function (k, i) { k.nr = i + 1; });
    P.kreise = folge;
  }
  function phasenVerteilen(P) {
    const last = { L1: 0, L2: 0, L3: 0 };
    P.kreise.filter(function (k) { return k.art === 'last3' || k.ph === '3'; }).forEach(function (k) { k.ph = '3'; const p = schaetzeLast(P, k) / 3; last.L1 += p; last.L2 += p; last.L3 += p; });
    P.kreise.filter(function (k) { return k.ph !== '3'; }).sort(function (a, b) { return schaetzeLast(P, b) - schaetzeLast(P, a); }).forEach(function (k) {
      // Licht möglichst auf verschiedene Außenleiter; sonst nach Last
      const ph = ['L1', 'L2', 'L3'].sort(function (a, b) { return last[a] - last[b]; })[0];
      k.ph = ph; last[ph] += schaetzeLast(P, k);
    });
  }
  // Einzelnes neues Gerät einem passenden Stromkreis zuordnen (beim Setzen im Bauplan)
  function geraetZuordnen(P, d) {
    if (!TYP[d.t].kreis || d.k) return;
    const r = raumVon(P, d), imRaum = function (x) { const rr = raumVon(P, x); return r && rr && rr.id === r.id && x.k; };
    if (istLast(d)) {
      const drei = !!TYP[d.t].drei;
      const k = neuerKreis(P, drei ? 'last3' : 'last', (d.name || TYP[d.t].n) + (r ? ' ' + r.name : ''), { ph: drei ? '3' : 'L1', i: iVon(d.P || (drei ? 7000 : 2000), drei) });
      if (/wallbox|ladestation|ladepunkt/i.test(d.name)) k.wallbox = true;
      d.k = k.id; schutzFuerNeuen(P, k); return;
    }
    if (d.t === 'sd') {
      const aussen = d.ip || (r && r.typ === 'aussen');
      const nachbar = P.geraete.filter(function (x) { return x !== d && x.t === 'sd' && imRaum(x) && !!(x.ip || (r && r.typ === 'aussen')) === aussen; })[0];
      if (nachbar) { d.k = nachbar.k; return; }
      const k = neuerKreis(P, 'sd', aussen ? 'Außensteckdosen' : 'Steckdosen' + (r ? ' ' + r.name : ''));
      d.k = k.id; schutzFuerNeuen(P, k); return;
    }
    // Licht, Schalter, Rollladen: Gruppe im Raum übernehmen
    const lampe = TYP[d.t].lampe, roll = d.t === 'jalousie' || d.t === 'motor';
    const imR = P.geraete.filter(function (x) { return x !== d && imRaum(x) && istLicht(x) && x.gr; });
    let vorbild = null;
    if (roll) {
      const gegen = d.t === 'motor' ? 'jalousie' : 'motor';
      vorbild = imR.filter(function (x) { return x.t === gegen && !imR.some(function (y) { return y !== x && y.k === x.k && y.gr === x.gr && y.t === d.t; }); })[0];
    } else if (lampe) vorbild = imR.filter(function (x) { return x.t === d.t; })[0] || imR.filter(function (x) { return TYP[x.t].lampe; })[0] || imR.filter(function (x) { return TYP[x.t].schalt && !geraeteIn(P, { id: x.k }).some(function (y) { return y.gr === x.gr && TYP[y.t].lampe; }); })[0];
    else vorbild = imR.filter(function (x) { return TYP[x.t].lampe; })[0] || imR.filter(function (x) { return TYP[x.t].schalt; })[0];
    if (vorbild) { d.k = vorbild.k; d.gr = vorbild.gr; return; }
    // neuer Buchstabe in einem Lichtkreis desselben Geschosses mit Platz
    const k = P.kreise.filter(function (k) {
      if (k.art !== 'licht') return false;
      const g = geraeteIn(P, k);
      return g.length && g[0].g === d.g && g.filter(function (x) { return TYP[x.t].lampe; }).length < 12 && raeumeVon(P, g).length < 4;
    })[0] || (function () { const n = neuerKreis(P, 'licht', 'Licht' + (r ? ' ' + r.name : '')); schutzFuerNeuen(P, n); return n; })();
    d.k = k.id; d.gr = freieGruppe(P, k);
    if (r && k.name.indexOf(r.name) < 0 && k.name.length < 34) k.name += ', ' + r.name;
  }
  function raeumeVon(P, liste) { const ids = []; liste.forEach(function (d) { const r = raumVon(P, d); if (r && ids.indexOf(r.id) < 0) ids.push(r.id); }); return ids; }
  function schutzFuerNeuen(P, k) {
    if (k.wallbox) { const q = { id: neueId('q'), nr: P.rcds.length + 1, i: 40, idn: 30, typ: 'EV', pole: 4 }; P.rcds.push(q); k.rcd = q.id; }
    else {
      const max = P.projekt.maxRcd;
      const q = P.rcds.filter(function (q) { return q.typ !== 'EV' && P.kreise.filter(function (x) { return x.rcd === q.id; }).length < max; })[0];
      if (q) k.rcd = q.id;
      else { const n = { id: neueId('q'), nr: P.rcds.reduce(function (m, x) { return Math.max(m, x.nr); }, 0) + 1, i: 40, idn: 30, typ: 'A', pole: 4 }; P.rcds.push(n); k.rcd = n.id; }
    }
    if (k.ph !== '3') {
      const last = { L1: 0, L2: 0, L3: 0 };
      P.kreise.forEach(function (x) { if (x === k) return; const p = schaetzeLast(P, x); if (x.ph === '3') { last.L1 += p / 3; last.L2 += p / 3; last.L3 += p / 3; } else if (last[x.ph] !== undefined) last[x.ph] += p; });
      k.ph = ['L1', 'L2', 'L3'].sort(function (a, b) { return last[a] - last[b]; })[0];
    }
  }
  // leere Stromkreise und RCDs entfernen
  function aufraeumen(P) {
    P.kreise = P.kreise.filter(function (k) { return P.geraete.some(function (d) { return d.k === k.id; }) || k.fest; });
    P.rcds = P.rcds.filter(function (q) { return P.kreise.some(function (k) { return k.rcd === q.id; }); });
  }

  // ======================================================================
  //  Berechnung: Schaltungen, Abzweigdosen, Kabel, Klemmen, Längen, Prüfungen
  // ======================================================================
  const ROLLE = function (key) {
    if (key === 'L' || key === 'N' || key === 'PE' || key === 'L1' || key === 'L2' || key === 'L3') return key;
    const t = key.split(':');
    if (t[0] === 'LS') return 'L′ ' + t[1];
    if (t[0] === 'T') return 'Taster ' + t[1];
    if (t[0] === 'K') return 'Korr. ' + t[1] + (+t[2] + 1) + '.' + t[3];
    if (t[0] === 'AUF') return '↑ ' + t[1];
    if (t[0] === 'AB') return '↓ ' + t[1];
    if (t[0] === 'R') return 'Reserve';
    return key;
  };
  // Kabel mit Adern: liste = [[Farbe, Rolle], …] in Farbreihenfolge
  function adernAus(n, rollen) {
    const farben = ADERN[n];
    return farben.map(function (f, i) {
      const r = rollen[i] || 'R';
      return { f: f, r: r, kennz: f === 'bl' && r !== 'N' && r !== 'R' };
    });
  }
  function abstand(P, a, b) {
    // Leitungsweg: waagerecht im rechten Winkel (Installationszonen), senkrecht zur Einbauhöhe, Geschosswechsel
    const ga = geschossIndex(P, a.g), gb = geschossIndex(P, b.g);
    let v = Math.abs(a.h - b.h);
    if (ga !== gb) {
      const lo = Math.min(ga, gb), hi = Math.max(ga, gb);
      let hz = 0; for (let i = lo; i < hi; i++) hz += P.geschosse[i].hoehe;
      v = Math.abs((ga < gb ? hz : -hz) + b.h - a.h);
    }
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + v + 0.3;   // 0,3 m Vorrat für die Anschlüsse
  }

  function berechnen(P) {
    const R = { kreise: [], kabel: [], dosen: [], gruppen: [], warn: [], nachKreis: {}, geraetInfo: {}, uvKlemmen: [], stueck: [], phasen: { L1: 0, L2: 0, L3: 0 } };
    const warn = function (stufe, text, kreis, gid) { R.warn.push({ stufe: stufe, text: text, kreis: kreis || '', g: gid || '' }); };
    const uv = verteilerVon(P);
    const uvPos = uv ? { x: uv.x, y: uv.y, g: uv.g, h: hoeheVon(P, uv) } : (function () {
      const r = raumOrdnung(P)[0]; return r ? { x: r.x + 0.3, y: r.y + 0.3, g: r.g, h: 1.6 } : { x: 0, y: 0, g: P.geschosse[0].id, h: 1.6 };
    })();
    if (!uv) warn('fehler', 'Kein Verteiler gesetzt – Längen werden ab einer Raumecke gerechnet. Symbol „Verteiler“ im Bauplan setzen.');
    if (P.geraete.filter(function (d) { return d.t === 'uv'; }).length > 1) warn('hinweis', 'Mehrere Verteiler gesetzt – gerechnet wird mit dem ersten. Unterverteiler mit eigener Planung abbilden.');
    P.geraete.forEach(function (d) { if (TYP[d.t].kreis && !d.k) warn('fehler', TYP[d.t].n + (d.name ? ' „' + d.name + '“' : '') + ' hat keinen Stromkreis.', '', d.id); });
    let wNr = 0, adNr = 0;
    P.kreise.forEach(function (k) {
      const ger = geraeteIn(P, k);
      const RK = { k: k, ger: ger, gruppen: [], dosen: [], kabel: [], warn: [], bmk: '-F' + k.nr, drei: k.ph === '3' || k.art === 'last3' };
      R.nachKreis[k.id] = RK; R.kreise.push(RK);
      if (!ger.length) { RK.leer = true; warn('hinweis', 'Stromkreis -F' + k.nr + ' ist leer.', k.id); return; }
      if (!RK.drei && ger.some(function (d) { return TYP[d.t].drei; })) warn('fehler', '-F' + k.nr + ': Drehstromgerät in einem Wechselstromkreis. Außenleiter auf „3 Außenleiter“ stellen.', k.id);
      // ---- Gruppen (Schaltungen) ----
      const buchst = {};
      ger.forEach(function (d) {
        [d.gr, d.t === 'serie' ? d.gr2 : ''].forEach(function (b) {
          if (!b) return;
          if (!buchst[b]) buchst[b] = { b: b, kreis: k, lampen: [], schalter: [], taster: [], bwm: [], serie: [], jal: [], motor: [] };
          const G = buchst[b];
          if (TYP[d.t].lampe) G.lampen.push(d);
          else if (d.t === 'schalter' || d.t === 'dimmer') G.schalter.push(d);
          else if (d.t === 'taster') G.taster.push(d);
          else if (d.t === 'bwm') G.bwm.push(d);
          else if (d.t === 'serie') G.serie.push(d);
          else if (d.t === 'jalousie') G.jal.push(d);
          else if (d.t === 'motor') G.motor.push(d);
        });
      });
      ger.forEach(function (d) { if ((TYP[d.t].lampe || TYP[d.t].schalt || d.t === 'jalousie' || d.t === 'motor') && !d.gr) warn('fehler', '-F' + k.nr + ': ' + TYP[d.t].n + ' ohne Schaltgruppe (Buchstabe).', k.id, d.id); });
      Object.keys(buchst).sort().forEach(function (b) {
        const G = buchst[b];
        G.id = k.id + ':' + b;
        const erste = G.lampen[0] || G.motor[0] || G.schalter[0] || G.taster[0] || G.bwm[0] || G.serie[0] || G.jal[0];
        G.raum = raumVon(P, erste);
        G.g = erste.g;
        if (G.motor.length || G.jal.length) {
          G.art = 'roll';
          if (G.motor.length > 1) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': ' + G.motor.length + ' Rollladenmotoren an einem Schalter – nur mit Trennrelais zulässig.', k.id);
          if (!G.jal.length) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': Rollladenmotor ohne Rollladenschalter.', k.id);
          if (!G.motor.length) warn('hinweis', '-F' + k.nr + ' Gruppe ' + b + ': Rollladenschalter ohne Motor.', k.id);
          if (G.lampen.length || G.schalter.length || G.taster.length) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': Rollladen und Licht im selben Buchstaben – getrennte Buchstaben wählen.', k.id);
        } else if (G.taster.length) {
          G.art = 'stromstoss';
          if (G.schalter.length || G.bwm.length || G.serie.length) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': Taster und Schalter gemischt – Schalter entfernen oder als Taster ausführen.', k.id);
        } else if (G.serie.length) {
          G.art = 'serie';
          if (G.serie.length > 1 || G.schalter.length || G.bwm.length) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': Serienschalter nur allein je Gruppe (keine Wechsel-Serienschaltung).', k.id);
        } else if (G.bwm.length) {
          G.art = 'bwm';
          if (G.schalter.length) warn('hinweis', '-F' + k.nr + ' Gruppe ' + b + ': Schalter neben Bewegungsmelder wird nicht verdrahtet (Handschaltung des Melders nutzen).', k.id);
        } else {
          const n = G.schalter.length, dim = G.schalter.filter(function (d) { return d.t === 'dimmer'; });
          if (dim.length > 1) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': mehrere Dimmer in einer Gruppe.', k.id);
          G.kette = dim.concat(G.schalter.filter(function (d) { return d.t !== 'dimmer'; }).sort(function (x, y) { return x.y - y.y || x.x - y.x; }));
          G.art = n === 0 ? 'dauer' : n === 1 ? (dim.length ? 'dimmer' : 'aus') : n === 2 ? 'wechsel' : 'kreuz';
          if (n === 0 && G.lampen.length) warn('fehler', '-F' + k.nr + ' Gruppe ' + b + ': Leuchte ohne Schalter (Dauerlicht).', k.id);
        }
        if (!G.lampen.length && G.art !== 'roll') warn('hinweis', '-F' + k.nr + ' Gruppe ' + b + ': Schalter ohne Leuchte.', k.id);
        G.name = { aus: 'Ausschaltung', dimmer: 'Dimmer', wechsel: 'Wechselschaltung', kreuz: 'Kreuzschaltung', serie: 'Serienschaltung', stromstoss: 'Stromstoßschaltung', bwm: 'Bewegungsmelder', roll: 'Rollladensteuerung', dauer: 'ohne Schalter' }[G.art];
        RK.gruppen.push(G); R.gruppen.push(G);
      });
      const ss = RK.gruppen.filter(function (g) { return g.art === 'stromstoss'; });
      if (ss.length > 1) warn('fehler', '-F' + k.nr + ': ' + ss.length + ' Stromstoßschaltungen in einem Stromkreis – je Stromkreis nur eine (5-adrige Zuleitung). Zweite Gruppe auf einen eigenen Stromkreis legen.', k.id);
      RK.ss = ss[0] || null;
      // Rolle jedes Geräts in seiner Gruppe
      const rolleVon = {};
      RK.gruppen.forEach(function (G) {
        if (G.kette) G.kette.forEach(function (d, i) {
          const n = G.kette.length;
          rolleVon[d.id] = n === 1 ? (d.t === 'dimmer' ? 'dimmer' : 'aus') : i === 0 ? (d.t === 'dimmer' ? 'wdimmer' : 'w1') : i === n - 1 ? 'w2' : 'kreuz';
          G['pos_' + d.id] = i;
        });
      });
      // ---- Abzweigdosen: je Raum (Gruppen im Raum der Gruppe) ----
      const g1 = geschoss(P, ger[0].g);
      const direkt = ger.length === 1 && !TYP[ger[0].t].lampe && !TYP[ger[0].t].schalt && ger[0].t !== 'motor' && ger[0].t !== 'jalousie';
      const dosenNach = {};
      function doseFuer(d) {
        let r;
        if (d.gr && (TYP[d.t].lampe || TYP[d.t].schalt || d.t === 'jalousie' || d.t === 'motor')) { const G = RK.gruppen.filter(function (g) { return g.b === d.gr; })[0]; r = G ? G.raum : raumVon(P, d); }
        else r = raumVon(P, d);
        const key = r ? r.id : 'ohne-' + d.g;
        if (!dosenNach[key]) {
          const manuell = r ? P.geraete.filter(function (x) { return x.t === 'dose' && x.g === r.g && raumVon(P, x) && raumVon(P, x).id === r.id; })[0] : null;
          const G = geschoss(P, r ? r.g : d.g);
          let pos;
          if (manuell) pos = { x: manuell.x, y: manuell.y };
          else if (r) {
            const zx = uvPos.g === r.g ? uvPos.x : r.x, zy = uvPos.g === r.g ? uvPos.y : r.y;
            const cx = Math.abs(zx - r.x) < Math.abs(zx - (r.x + r.w)) ? r.x + 0.25 : r.x + r.w - 0.25;
            const cy = Math.abs(zy - r.y) < Math.abs(zy - (r.y + r.l)) ? r.y + 0.25 : r.y + r.l - 0.25;
            pos = { x: cx, y: cy };
          } else pos = { x: d.x, y: d.y };
          // mehrere Kreise im selben Raum: Dosen leicht versetzt
          const schon = R.dosen.filter(function (o) { return o.raum && r && o.raum.id === r.id; }).length;
          if (!manuell && r) pos.x += (pos.x < r.x + r.w / 2 ? 1 : -1) * 0.2 * schon;
          dosenNach[key] = { bmk: '', kreis: k, raum: r, g: r ? r.g : d.g, x: pos.x, y: pos.y, h: (manuell && manuell.h !== null ? manuell.h : G.raum - 0.3), ger: [], kabel: [], manuell: !!manuell };
        }
        dosenNach[key].ger.push(d);
        return dosenNach[key];
      }
      if (!direkt) ger.forEach(doseFuer);
      // Kette: vom Verteiler zur nächsten Dose usw.
      const offen = Object.keys(dosenNach).map(function (x) { return dosenNach[x]; });
      let pos = uvPos;
      while (offen.length) {
        offen.sort(function (a, b) { return abstand(P, pos, a) - abstand(P, pos, b); });
        const n = offen.shift(); n.bmk = 'AD' + (++adNr); RK.dosen.push(n); R.dosen.push(n); pos = n;
      }
      // ---- Zuleitung und Kette ----
      const zuAdern = RK.drei ? 5 : RK.ss ? 5 : 3;
      const zuRollen = RK.drei ? ['PE', 'N', 'L1', 'L2', 'L3'] : RK.ss ? ['PE', 'N', 'L', 'T:' + RK.ss.b, 'LS:' + RK.ss.b] : ['PE', 'N', 'L'];
      wNr++;
      const wBasis = '-W' + k.nr;
      let wUnter = 0;
      function kabel(von, nach, adern, rollen, art, a) {
        const bmk = wUnter === 0 ? wBasis : wBasis + '.' + wUnter;
        wUnter++;
        const K = { bmk: bmk, kreis: k, von: von, nach: nach, adern: adern, a: a, typ: k.typ, art: art, laenge: abstand(P, von, nach), ader: adernAus(adern, rollen) };
        RK.kabel.push(K); R.kabel.push(K);
        return K;
      }
      const uvEnde = { name: uv ? '-UV' : 'Verteiler', x: uvPos.x, y: uvPos.y, g: uvPos.g, h: uvPos.h, uv: true };
      const geraetEnde = function (d) { return { name: bmkVon(d), x: d.x, y: d.y, g: d.g, h: hoeheVon(P, d), d: d }; };
      const doseEnde = function (o) { return { name: o.bmk, x: o.x, y: o.y, g: o.g, h: o.h, dose: o }; };
      // BMK der Geräte: -E3.1, -S3.2, -XD3.4 … je Stromkreis fortlaufend
      const zaehl = {};
      ger.slice().sort(function (a, b) { return (a.gr || 'zz').localeCompare(b.gr || 'zz') || a.y - b.y || a.x - b.x; }).forEach(function (d) {
        const p = TYP[d.t].bmk; zaehl[p] = (zaehl[p] || 0) + 1;
        R.geraetInfo[d.id] = { bmk: '-' + p + k.nr + '.' + zaehl[p], kreis: k, rolle: rolleVon[d.id] || '' };
      });
      function bmkVon(d) { return R.geraetInfo[d.id] ? R.geraetInfo[d.id].bmk : '?'; }
      if (direkt) {
        const d = ger[0], drei = !!TYP[d.t].drei;
        kabel(uvEnde, geraetEnde(d), drei ? 5 : 3, drei ? ['PE', 'N', 'L1', 'L2', 'L3'] : ['PE', 'N', 'L'], 'zu', 0);
        R.geraetInfo[d.id].kabel = RK.kabel[0];
      } else {
        let vor = uvEnde;
        RK.dosen.forEach(function (o, i) {
          // Tasterader und geschaltete Ader der Stromstoßschaltung nur bis zur letzten Dose, die sie braucht
          const ssWeiter = !!RK.ss && RK.dosen.slice(i).some(function (x) { return x.ger.some(function (d) { return d.gr === RK.ss.b && d.k === k.id; }); });
          const K = kabel(vor, doseEnde(o), RK.drei || ssWeiter ? zuAdern : 3, RK.drei || ssWeiter ? zuRollen : ['PE', 'N', 'L'], i === 0 ? 'zu' : 'kette', 0);
          o.kabel.push({ K: K, ein: true });
          if (vor.dose) vor.dose.kabel.push({ K: K, ein: false });
          vor = doseEnde(o);
        });
        // Geräteleitungen je Dose
        RK.dosen.forEach(function (o) {
          o.ger.forEach(function (d) {
            const rolle = rolleVon[d.id], G = RK.gruppen.filter(function (g) { return g.b === d.gr; })[0];
            let n = 3, r = ['PE', 'N', 'L'], art = 'last';
            const b = d.gr, lsKey = G && G.art === 'dauer' ? 'L' : 'LS:' + b;
            if (TYP[d.t].lampe) { r = ['PE', 'N', lsKey]; art = 'licht'; }
            else if (d.t === 'sd400' || d.t === 'geraet3') { n = 5; r = ['PE', 'N', 'L1', 'L2', 'L3']; }
            else if (d.t === 'taster') { r = ['PE', 'T:' + b, 'L']; art = 'schalt'; }
            else if (d.t === 'bwm') { n = 5; r = ['PE', 'N', 'L', 'LS:' + b, 'R']; art = 'schalt'; }
            else if (d.t === 'serie') { n = 4; r = ['PE', 'L', 'LS:' + d.gr, 'LS:' + (d.gr2 || d.gr)]; art = 'schalt'; }
            else if (d.t === 'jalousie') { n = 4; r = ['PE', 'L', 'AUF:' + b, 'AB:' + b]; art = 'schalt'; }
            else if (d.t === 'motor') { n = 5; r = ['PE', 'N', 'AUF:' + b, 'AB:' + b, 'R']; }
            else if (d.t === 'schalter' || d.t === 'dimmer') {
              art = 'schalt';
              const i = G ? G['pos_' + d.id] : 0;
              if (rolle === 'aus' || rolle === 'dimmer') r = ['PE', 'LS:' + b, 'L'];
              else if (rolle === 'w1' || rolle === 'wdimmer') { n = 4; r = ['PE', 'L', 'K:' + b + ':0:1', 'K:' + b + ':0:2']; }
              else if (rolle === 'w2') { n = 4; r = ['PE', 'LS:' + b, 'K:' + b + ':' + (i - 1) + ':1', 'K:' + b + ':' + (i - 1) + ':2']; }
              else if (rolle === 'kreuz') { n = 5; r = ['PE', 'K:' + b + ':' + (i - 1) + ':1', 'K:' + b + ':' + (i - 1) + ':2', 'K:' + b + ':' + i + ':1', 'K:' + b + ':' + i + ':2']; }
              else r = ['PE', 'LS:' + b, 'L'];
            }
            const a = art === 'last' ? 0 : 1.5;   // 0 = Querschnitt des Stromkreises
            const K = kabel(doseEnde(o), geraetEnde(d), n, r, art, a);
            o.kabel.push({ K: K, ein: false, d: d });
            R.geraetInfo[d.id].kabel = K; R.geraetInfo[d.id].dose = o;
          });
        });
      }
      // ---- Leitungslängen, Querschnitt, Spannungsfall, Schleifenimpedanz ----
      RK.ib = (function () {
        if (k.art === 'sd' || ger.some(function (d) { return d.t === 'sd'; })) return k.i;
        const p = ger.reduce(function (s, d) { return s + (TYP[d.t].lampe ? 60 : d.t === 'motor' ? 150 : (d.P || 0)); }, 0);
        return RK.drei ? p / (Math.sqrt(3) * 400) : p / 230;
      })();
      // Widerstandsweg zu jedem Verbraucher: Zuleitung/Kette + Umwege über Schalter + Geräteleitung
      const kette = function (o) { let s = 0; for (let i = 0; i <= RK.dosen.indexOf(o); i++) s += RK.kabel.filter(function (K) { return K.nach.dose === RK.dosen[i] && (K.art === 'zu' || K.art === 'kette'); })[0].laenge; return s; };
      function wegeMit(aK) {
        // liefert [{Name, Länge Hauptquerschnitt, Länge 1,5 mm²}] für jeden Verbraucher
        const wege = [];
        if (direkt) { const K = RK.kabel[0]; wege.push({ d: ger[0], haupt: K.laenge, klein: 0 }); return wege; }
        RK.dosen.forEach(function (o) {
          const lk = kette(o);
          o.kabel.forEach(function (x) {
            if (!x.d) return;
            const d = x.d;
            if (TYP[d.t].schalt || d.t === 'jalousie') return;
            const eigen = x.K.a === 0 ? { haupt: x.K.laenge, klein: 0 } : { haupt: 0, klein: x.K.laenge };
            let umweg = 0;
            const G = RK.gruppen.filter(function (g) { return g.b === d.gr; })[0];
            if (G && G.art !== 'stromstoss' && G.art !== 'dauer') {
              const sch = (G.kette || []).concat(G.bwm, G.serie, G.jal);
              sch.forEach(function (s) { const info = R.geraetInfo[s.id]; if (info && info.kabel) umweg += 2 * info.kabel.laenge; });
              if (G.art === 'bwm') umweg = sch.length ? 2 * Math.min.apply(null, sch.map(function (s) { return R.geraetInfo[s.id].kabel.laenge; })) : 0;
            }
            wege.push({ d: d, haupt: lk + eigen.haupt, klein: eigen.klein + umweg / 2 });
          });
        });
        void aK;
        return wege;
      }
      const wege = wegeMit();
      RK.lMax = wege.reduce(function (m, w) { return Math.max(m, w.haupt + w.klein); }, 0) + k.zus;
      RK.lGesamt = RK.kabel.reduce(function (s, K) { return s + K.laenge; }, 0);
      const belastet = RK.drei ? 3 : 2, U0 = 230, ia = (k.c === 'C' ? 10 : 5) * k.i;
      function pruefA(a) {
        let du = 0, rs = 0;
        wege.forEach(function (w) {
          const r = (w.haupt + k.zus) / (KAPPA * a) + w.klein / (KAPPA * 1.5);
          const d = RK.drei ? Math.sqrt(3) * k.i * r / 400 * 100 : 2 * k.i * r / U0 * 100;
          du = Math.max(du, d); rs = Math.max(rs, 2 * r);
        });
        const zs = P.projekt.zvor + rs * WARM;
        return { a: a, iz: iz(belastet, a, k.verlegung), du: du, zs: zs, zsMax: U0 / ia, ok: iz(belastet, a, k.verlegung) >= k.i && du <= 3 && (zs <= U0 / ia || k.rcd) };
      }
      let erg;
      if (k.a) erg = pruefA(k.a);
      else {
        const start = k.art === 'sd' ? 1.5 : RK.drei ? 2.5 : 1.5;
        const moegl = QUERSCHNITTE.filter(function (a) { return a >= start; });
        erg = null;
        for (let i = 0; i < moegl.length; i++) { const e = pruefA(moegl[i]); if (e.iz >= k.i && e.du <= 3 && e.zs <= e.zsMax) { erg = e; break; } }
        if (!erg) for (let i = 0; i < moegl.length; i++) { const e = pruefA(moegl[i]); if (e.iz >= k.i && e.du <= 3) { erg = e; break; } }
        if (!erg) erg = pruefA(moegl[moegl.length - 1]);
        erg.auto = true;
      }
      RK.a = erg.a; RK.iz = erg.iz; RK.du = erg.du; RK.zs = erg.zs; RK.zsMax = erg.zsMax; RK.autoA = !!erg.auto;
      RK.kabel.forEach(function (K) { K.aEff = K.a || RK.a; });
      if (RK.ib > k.i + 1e-9) warn('fehler', '-F' + k.nr + ': Betriebsstrom ' + zahl(RK.ib) + ' A größer als Bemessungsstrom ' + k.i + ' A.', k.id);
      if (RK.iz < k.i) warn('fehler', '-F' + k.nr + ': Leitung ' + zahl(RK.a, 1) + ' mm² (Iz = ' + zahl(RK.iz) + ' A bei Verlegeart ' + k.verlegung + ') zu schwach für ' + k.c + k.i + '.', k.id);
      if (RK.du > 3) warn('fehler', '-F' + k.nr + ': Spannungsfall ' + zahl(RK.du, 2) + ' % über 3 % (DIN 18015-1). Querschnitt erhöhen oder Stromkreis teilen.', k.id);
      if (RK.zs > RK.zsMax) warn(k.rcd ? 'hinweis' : 'fehler', '-F' + k.nr + ': Schleifenimpedanz ' + zahl(RK.zs, 2) + ' Ω > ' + zahl(RK.zsMax, 2) + ' Ω – Abschaltung in 0,4 s über ' + k.c + k.i + ' nicht sicher' + (k.rcd ? '; der Fehlerschutz übernimmt der RCD, der Kurzschlussschutz ist trotzdem zu prüfen.' : '.'), k.id);
      if (!k.rcd) warn('fehler', '-F' + k.nr + ': ohne Fehlerstrom-Schutzschalter. In Wohnungen sind Steckdosen bis 32 A, Leuchtenstromkreise und Außenanlagen mit RCD 30 mA zu schützen (DIN VDE 0100-410).', k.id);
      if (k.wallbox || ger.some(function (d) { return /wallbox|ladestation|ladepunkt/i.test(d.name); })) {
        const q = P.rcds.filter(function (q) { return q.id === k.rcd; })[0];
        if (k.rcd !== 'rcbo' && (!q || (q.typ !== 'B' && q.typ !== 'EV'))) warn('fehler', '-F' + k.nr + ': Ladepunkt braucht RCD Typ B oder Typ A mit DC-Fehlerstromerkennung 6 mA (DIN VDE 0100-722).', k.id);
        if (q && P.kreise.filter(function (x) { return x.rcd === q.id; }).length > 1) warn('fehler', '-F' + k.nr + ': Ladepunkt mit eigenem RCD versorgen.', k.id);
      }
      if (ger.some(function (d) { const r = raumVon(P, d); return r && r.typ === 'bad'; })) RK.bad = true;
      // Außenleiterlast
      const p = schaetzeLast(P, k);
      if (RK.drei) { R.phasen.L1 += p / 3; R.phasen.L2 += p / 3; R.phasen.L3 += p / 3; } else if (R.phasen[k.ph] !== undefined) R.phasen[k.ph] += p;
      RK.last = p;
      // ---- Klemmen in den Dosen ----
      RK.dosen.forEach(function (o) {
        const nachKey = {}, folge = [];
        o.kabel.forEach(function (x) {
          x.K.ader.forEach(function (a, i) {
            if (a.r === 'R') return;
            if (!nachKey[a.r]) { nachKey[a.r] = []; folge.push(a.r); }
            nachKey[a.r].push({ K: x.K, a: a, i: i, ein: x.ein });
          });
        });
        const ord = function (r) { return r === 'PE' ? 0 : r === 'N' ? 1 : r === 'L' || r === 'L1' ? 2 : r === 'L2' ? 3 : r === 'L3' ? 4 : 5; };
        folge.sort(function (a, b) { return ord(a) - ord(b) || a.localeCompare(b); });
        o.klemmen = folge.map(function (r, i) { return { nr: i + 1, r: r, adern: nachKey[r] }; });
        o.klemmen.forEach(function (kl) { if (kl.adern.length === 1) kl.einzeln = true; });
        o.reserve = [];
        o.kabel.forEach(function (x) { x.K.ader.forEach(function (a) { if (a.r === 'R') o.reserve.push({ K: x.K, a: a }); }); });
      });
    });
    // ---- Klemmen im Verteiler (X1) ----
    let xnr = 0;
    P.kreise.forEach(function (k) {
      const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return;
      const K0 = RK.kabel[0]; if (!K0) return;
      const ord = function (r) { return r === 'L' || r === 'L1' ? 0 : r === 'L2' ? 1 : r === 'L3' ? 2 : r.indexOf('T:') === 0 ? 3 : r.indexOf('LS:') === 0 ? 4 : r === 'N' ? 5 : 6; };
      RK.klemmen = K0.ader.slice().sort(function (a, b) { return ord(a.r) - ord(b.r); }).map(function (a) { xnr++; return { nr: xnr, r: a.r, a: a, K: K0 }; });
    });
    // ---- RCD-Prüfungen ----
    P.rcds.forEach(function (q) {
      const ks = P.kreise.filter(function (k) { return k.rcd === q.id; });
      if (ks.length > P.projekt.maxRcd) R.warn.push({ stufe: 'hinweis', text: '-Q' + q.nr + ': ' + ks.length + ' Stromkreise an einem RCD (gewählt höchstens ' + P.projekt.maxRcd + '). Mehr RCDs vermeiden, dass ein Fehler zu viel abschaltet (DIN VDE 0100-530).', kreis: '' });
      const summe = ks.reduce(function (s, k) { return s + k.i * (k.ph === '3' ? 1 : 1 / 3); }, 0);
      if (summe > q.i * 1.5) R.warn.push({ stufe: 'hinweis', text: '-Q' + q.nr + ': Summe der Bemessungsströme hoch für ' + q.i + ' A – Gleichzeitigkeit prüfen oder 63 A wählen.', kreis: '' });
      if (q.pole === 2 && ks.some(function (k) { return k.ph === '3'; })) R.warn.push({ stufe: 'fehler', text: '-Q' + q.nr + ': 2-poliger RCD mit Drehstromkreis.', kreis: '' });
      if (q.pole === 2) { const ph = {}; ks.forEach(function (k) { ph[k.ph] = 1; }); if (Object.keys(ph).length > 1) R.warn.push({ stufe: 'fehler', text: '-Q' + q.nr + ': 2-poliger RCD mit Stromkreisen an verschiedenen Außenleitern.', kreis: '' }); }
    });
    if (P.projekt.netz === 'TT' && P.projekt.ra * 0.03 > 50) R.warn.push({ stufe: 'fehler', text: 'TT-System: RA · IΔn = ' + zahl(P.projekt.ra * 0.03) + ' V > 50 V.', kreis: '' });
    // Lichtkreise alle am selben RCD?
    const lichtRcd = {}; P.kreise.forEach(function (k) { if (k.art === 'licht' && k.rcd) lichtRcd[k.rcd] = 1; });
    if (P.kreise.filter(function (k) { return k.art === 'licht'; }).length > 1 && Object.keys(lichtRcd).length === 1 && P.rcds.length > 1) R.warn.push({ stufe: 'hinweis', text: 'Alle Lichtstromkreise hängen an einem RCD – löst er aus, ist es überall dunkel. Auf mehrere RCDs verteilen.', kreis: '' });
    // Außenleiter-Unsymmetrie
    const ph = [R.phasen.L1, R.phasen.L2, R.phasen.L3], mx = Math.max.apply(null, ph), mn = Math.min.apply(null, ph);
    if (mx > 0 && (mx - mn) / mx > 0.5 && mx > 3000) R.warn.push({ stufe: 'hinweis', text: 'Außenleiter ungleich belastet (L1 ' + zahl(R.phasen.L1 / 1000) + ' / L2 ' + zahl(R.phasen.L2 / 1000) + ' / L3 ' + zahl(R.phasen.L3 / 1000) + ' kW geschätzt).', kreis: '' });
    // ---- Ausstattung je Raum (grobe Richtwerte nach DIN 18015-2) ----
    R.ausstattung = P.raeume.map(function (r) {
      const d = P.geraete.filter(function (x) { const rr = raumVon(P, x); return rr && rr.id === r.id; });
      const sd = d.filter(function (x) { return x.t === 'sd'; }).length, licht = d.filter(function (x) { return x.t === 'leuchte' || x.t === 'wandleuchte'; }).length;
      const soll = richtwert(r, P.projekt.ausstattung);
      return { r: r, sd: sd, licht: licht, soll: soll, ok: sd >= soll[0] && licht >= soll[1] };
    });
    R.ausstattung.forEach(function (a) { if (!a.ok) R.warn.push({ stufe: 'hinweis', text: a.r.name + ': ' + a.sd + ' Steckdosen-Einbaustellen / ' + a.licht + ' Leuchten – Richtwert ' + a.soll[0] + ' / ' + a.soll[1] + '.', kreis: '' }); });
    if (P.raeume.some(function (r) { return ['schlaf', 'kind', 'flur'].indexOf(r.typ) >= 0 && !P.geraete.some(function (d) { const rr = raumVon(P, d); return d.t === 'rm' && rr && rr.id === r.id; }); })) R.warn.push({ stufe: 'hinweis', text: 'Rauchwarnmelder fehlen in Schlafräumen, Kinderzimmern oder Fluren (Landesbauordnung).', kreis: '' });
    R.stueck = stueckliste(P, R);
    return R;
  }
  function richtwert(r, aw) {
    const A = flaeche(r), f = aw === 3 ? 2 : aw === 2 ? 1.5 : 1;
    const t = { wohn: [A <= 12 ? 3 : A <= 20 ? 4 : 5, A <= 20 ? 1 : 2], schlaf: [A <= 12 ? 3 : A <= 20 ? 4 : 5, 1], kind: [A <= 12 ? 3 : A <= 20 ? 4 : 5, 1], arbeit: [A <= 12 ? 3 : A <= 20 ? 4 : 5, 1], essen: [A <= 12 ? 2 : 3, 1],
      kueche: [5, 2], bad: [2, 2], wc: [1, 1], flur: [1, 1], abstell: [0, 1], hwr: [3, 1], keller: [1, 1], aussen: [1, 1], sonst: [1, 1] }[r.typ] || [1, 1];
    return [Math.ceil(t[0] * f), Math.ceil(t[1] * (aw === 3 ? 1.5 : 1))];
  }

  // ---------- Stückliste ----------
  function stueckliste(P, R) {
    const L = {};
    const plus = function (gruppe, name, n, einheit) { const k = gruppe + '|' + name; if (!L[k]) L[k] = { gruppe: gruppe, name: name, n: 0, e: einheit || 'Stk.' }; L[k].n += n; };
    P.geraete.forEach(function (d) {
      const info = R.geraetInfo[d.id] || {}, rolle = info.rolle;
      if (d.t === 'sd') { plus('Schalter und Steckdosen', (d.ip ? 'Steckdose IP44 (Feuchtraum)' : 'Schutzkontakt-Steckdose'), d.anz); if (!d.ip && d.anz > 1) plus('Schalter und Steckdosen', d.anz + '-fach-Rahmen', 1); if (!d.ip && d.anz === 1) plus('Schalter und Steckdosen', '1-fach-Rahmen', 1); plus('Dosen', d.anz > 1 ? 'Geräte-Verbindungsdose' : 'Gerätedose', d.anz); }
      else if (d.t === 'sd400') { plus('Schalter und Steckdosen', 'CEE-Steckdose 16 A 400 V 5-polig', 1); plus('Dosen', 'Gerätedose tief', 1); }
      else if (d.t === 'schalter' || d.t === 'dimmer') {
        const n = { aus: 'Ausschalter', dimmer: 'Dimmer (Drehdimmer)', wdimmer: 'Wechsel-Dimmer', w1: 'Wechselschalter', w2: 'Wechselschalter', kreuz: 'Kreuzschalter' }[rolle] || 'Ausschalter';
        plus('Schalter und Steckdosen', n, 1); plus('Schalter und Steckdosen', 'Wippe / Abdeckung', 1); plus('Schalter und Steckdosen', '1-fach-Rahmen', 1); plus('Dosen', 'Gerätedose', 1);
      } else if (d.t === 'serie') { plus('Schalter und Steckdosen', 'Serienschalter', 1); plus('Schalter und Steckdosen', 'Serienwippe', 1); plus('Schalter und Steckdosen', '1-fach-Rahmen', 1); plus('Dosen', 'Gerätedose', 1); }
      else if (d.t === 'taster') { plus('Schalter und Steckdosen', 'Taster (Schließer)', 1); plus('Schalter und Steckdosen', 'Wippe / Abdeckung', 1); plus('Schalter und Steckdosen', '1-fach-Rahmen', 1); plus('Dosen', 'Gerätedose', 1); }
      else if (d.t === 'bwm') plus('Schalter und Steckdosen', 'Bewegungsmelder 230 V, 3-Draht (IP44)', 1);
      else if (d.t === 'jalousie') { plus('Schalter und Steckdosen', 'Rollladenschalter (verriegelt)', 1); plus('Schalter und Steckdosen', '1-fach-Rahmen', 1); plus('Dosen', 'Gerätedose', 1); }
      else if (TYP[d.t].lampe) plus('Leuchten', d.t === 'leuchte' ? 'Deckenauslass (Leuchte bauseits)' : 'Wandauslass (Leuchte bauseits)', 1);
      else if (d.t === 'motor') plus('Geräte', 'Anschluss Rollladenmotor', 1);
      else if (d.t === 'geraet') plus('Geräte', 'Geräteanschlussdose 230 V' + (d.name ? ' (' + d.name + ')' : ''), 1);
      else if (d.t === 'geraet3') plus('Geräte', (/wallbox/i.test(d.name) ? 'Anschluss Ladepunkt 400 V' : 'Geräteanschlussdose 400 V') + (d.name ? ' (' + d.name + ')' : ''), 1);
      else if (d.t === 'daten') { plus('Schwachstrom', 'Datendose Cat 6A ' + d.anz + '-fach', 1); plus('Dosen', 'Gerätedose', 1); }
      else if (d.t === 'tv') { plus('Schwachstrom', 'Antennendose', 1); plus('Dosen', 'Gerätedose', 1); }
      else if (d.t === 'rm') plus('Schwachstrom', 'Rauchwarnmelder (DIN 14676)', 1);
    });
    R.dosen.forEach(function (o) {
      plus('Dosen', 'Abzweigdose (Unterputz, Ø 70 mm)', o.manuell ? 1 : 1);
      (o.klemmen || []).forEach(function (kl) { if (kl.einzeln) return; const n = kl.adern.length, g = n <= 2 ? 2 : n <= 3 ? 3 : n <= 5 ? 5 : 8; plus('Klemmen', 'Verbindungsklemme ' + g + '-polig', 1); });
    });
    // Leitungen: je Typ und Querschnitt, 10 % Verschnitt, auf 5 m gerundet
    const ltg = {};
    R.kabel.forEach(function (K) { const n = K.typ + ' ' + K.adern + '×' + zahl(K.aEff, K.aEff < 2 ? 1 : K.aEff % 1 ? 1 : 0); ltg[n] = (ltg[n] || 0) + K.laenge; });
    Object.keys(ltg).sort().forEach(function (n) { plus('Leitungen', n, Math.ceil(ltg[n] * 1.1 / 5) * 5, 'm'); });
    // Verteiler
    plus('Verteiler', 'Hauptschalter (Lasttrennschalter) 4-polig 63 A', 1);
    plus('Verteiler', 'Überspannungsschutz Typ 2 (DIN VDE 0100-443/-534)', 1);
    P.rcds.forEach(function (q) { plus('Verteiler', 'RCD ' + (q.pole === 4 ? '4' : '2') + '-polig ' + q.i + ' A / ' + (q.idn >= 1000 ? q.idn / 1000 + ' A' : q.idn + ' mA') + ' Typ ' + (q.typ === 'EV' ? 'A + DC 6 mA' : q.typ), 1); });
    P.kreise.forEach(function (k) {
      const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return;
      if (k.rcd === 'rcbo') plus('Verteiler', 'FI/LS-Schalter ' + k.c + k.i + ' 30 mA Typ A', 1);
      else plus('Verteiler', 'Leitungsschutzschalter ' + (RK.drei ? '3-polig ' : '1-polig ') + k.c + k.i, 1);
      if (RK.ss) plus('Verteiler', 'Stromstoßschalter 230 V, 1 Schließer', 1);
      plus('Verteiler', 'Reihenklemme (N, PE, L getrennt)', RK.kabel[0] ? RK.kabel[0].adern : 0);
    });
    const te = verteilerTE(P, R);
    plus('Verteiler', 'Kleinverteiler ' + (te.reihen.length + 1) + '-reihig à 12 TE (' + te.summe + ' TE belegt, 1 Reihe Klemmen)', 1);
    const GR = ['Verteiler', 'Leitungen', 'Dosen', 'Klemmen', 'Schalter und Steckdosen', 'Leuchten', 'Geräte', 'Schwachstrom'];
    return Object.keys(L).map(function (k) { return L[k]; }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return GR.indexOf(a.gruppe) - GR.indexOf(b.gruppe) || a.name.localeCompare(b.name, 'de'); });
  }
  function verteilerTE(P, R) {
    const teile = [];
    teile.push({ bmk: '-Q0', text: 'Hauptschalter', te: 4, art: 'haupt' });
    teile.push({ bmk: '-F0', text: 'Überspannungsschutz', te: 4, art: 'uess' });
    P.rcds.forEach(function (q) {
      teile.push({ bmk: '-Q' + q.nr, text: 'RCD ' + q.i + ' A ' + q.idn + ' mA Typ ' + (q.typ === 'EV' ? 'A-EV' : q.typ), te: q.pole === 4 ? 4 : 2, art: 'rcd', q: q });
      P.kreise.filter(function (k) { return k.rcd === q.id; }).forEach(function (k) {
        const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return;
        teile.push({ bmk: '-F' + k.nr, text: k.c + k.i + ' ' + k.name, te: RK.drei ? 3 : 1, art: 'ls', k: k });
        if (RK.ss) teile.push({ bmk: '-K' + k.nr, text: 'Stromstoß ' + k.name, te: 1, art: 'ss', k: k });
      });
    });
    P.kreise.filter(function (k) { return !k.rcd || k.rcd === 'rcbo'; }).forEach(function (k) {
      const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return;
      teile.push({ bmk: '-F' + k.nr, text: (k.rcd === 'rcbo' ? 'FI/LS ' : '') + k.c + k.i + ' ' + k.name, te: k.rcd === 'rcbo' ? 2 : RK.drei ? 3 : 1, art: 'ls', k: k });
      if (RK.ss) teile.push({ bmk: '-K' + k.nr, text: 'Stromstoß', te: 1, art: 'ss', k: k });
    });
    // Reihen à 12 TE: eine RCD-Gruppe möglichst nicht trennen
    const reihen = [[]]; let frei = 12;
    teile.forEach(function (t, i) {
      if (t.art === 'rcd') {
        let g = t.te, j = i + 1; while (j < teile.length && (teile[j].art === 'ls' || teile[j].art === 'ss') && teile[j].k && teile[j].k.rcd === t.q.id) { g += teile[j].te; j++; }
        if (g <= 12 && g > frei) { reihen.push([]); frei = 12; }
      }
      if (t.te > frei) { reihen.push([]); frei = 12; }
      reihen[reihen.length - 1].push(t); frei -= t.te;
    });
    const summe = teile.reduce(function (s, t) { return s + t.te; }, 0);
    return { teile: teile, reihen: reihen, summe: summe };
  }

  // ======================================================================
  //  Symbole für den Installationsplan (DIN EN 60617-11), Einheit = Symbolgröße
  //  Grundlage: Befestigungspunkt (0|0) an der Wand, Körper nach oben (−y)
  // ======================================================================
  const WINKEL = [0, -90, 180, 90];
  function sym(t, rolle, opt) {
    opt = opt || {};
    const s = 'fill="none" stroke="currentColor" stroke-width="0.07" stroke-linecap="round" stroke-linejoin="round"';
    const f = 'fill="currentColor" stroke="none"';
    const ang = opt.winkel || 0;
    const tx = function (text, x, y, gr) { return '<text x="0" y="0" transform="translate(' + x + ' ' + y + ') rotate(' + (-ang) + ')" font-size="' + (gr || 0.34) + '" text-anchor="middle" dominant-baseline="central" ' + f + ' font-family="Arial, sans-serif" font-weight="700">' + esc(text) + '</text>'; };
    const stiel = function (y) { return '<line x1="0" y1="0" x2="0" y2="' + y + '" ' + s + '/>'; };
    const kreis = function (y, r) { return '<circle cx="0" cy="' + y + '" r="' + r + '" ' + s + '/>'; };
    const haken = function (x, y, dx, dy) { return '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" ' + s + '/>'; };
    switch (t) {
      case 'sd': case 'daten': case 'tv': case 'sd400': {
        let o = stiel(-0.25) + '<path d="M -0.36 -0.25 A 0.36 0.36 0 0 1 0.36 -0.25 Z" ' + s + '/>';
        if (t === 'sd' || t === 'sd400') o += '<line x1="-0.36" y1="-0.72" x2="0.36" y2="-0.72" ' + s + '/>';
        if (t === 'sd400') o += '<line x1="-0.12" y1="-0.06" x2="0.12" y2="-0.18" ' + s + '/><line x1="-0.12" y1="-0.12" x2="0.12" y2="-0.24" ' + s + '/>';
        if (t === 'daten') o += tx('D', 0, -0.42, 0.26);
        if (t === 'tv') o += tx('TV', 0, -0.42, 0.22);
        if (opt.anz > 1) o += tx(String(opt.anz), 0.55, -0.45, 0.3);
        return o;
      }
      case 'schalter': case 'dimmer': case 'serie': case 'taster': case 'jalousie': {
        let o = stiel(-0.37) + kreis(-0.55, 0.18);
        const r = rolle || (t === 'dimmer' ? 'dimmer' : 'aus');
        if (t === 'taster') return o + '<circle cx="0" cy="-0.55" r="0.07" ' + f + '/>';
        if (t === 'jalousie') return o + '<line x1="0.13" y1="-0.68" x2="0.42" y2="-0.97" ' + s + '/>' + haken(0.42, -0.97, 0.12, 0.12) + '<line x1="-0.13" y1="-0.68" x2="-0.42" y2="-0.97" ' + s + '/>' + haken(-0.42, -0.97, -0.12, 0.12) + '<path d="M -0.1 -0.42 L 0 -0.32 L 0.1 -0.42" ' + s + '/>';
        if (t === 'serie') return o + '<line x1="0.13" y1="-0.68" x2="0.5" y2="-1.05" ' + s + '/>' + haken(0.5, -1.05, 0.12, 0.12) + haken(0.36, -0.91, 0.12, 0.12);
        if (r === 'kreuz') return o + '<line x1="-0.45" y1="-1" x2="0.45" y2="-0.1" ' + s + '/><line x1="0.45" y1="-1" x2="-0.45" y2="-0.1" ' + s + '/>' + haken(0.45, -1, 0.12, 0.12) + haken(-0.45, -1, -0.12, 0.12) + haken(0.45, -0.1, 0.12, -0.12) + haken(-0.45, -0.1, -0.12, -0.12);
        if (r === 'w1' || r === 'w2' || r === 'wdimmer') o += '<line x1="-0.42" y1="-0.13" x2="0.42" y2="-0.97" ' + s + '/>' + haken(0.42, -0.97, 0.12, 0.12) + haken(-0.42, -0.13, -0.12, -0.12);
        else o += '<line x1="0.13" y1="-0.68" x2="0.42" y2="-0.97" ' + s + '/>' + haken(0.42, -0.97, 0.12, 0.12);
        if (r === 'dimmer' || r === 'wdimmer' || t === 'dimmer') o += '<path d="M -0.42 -0.78 L -0.12 -0.78 M -0.2 -0.86 L -0.12 -0.78 L -0.2 -0.7" ' + s + '/>';
        return o;
      }
      case 'bwm': return stiel(-0.2) + '<path d="M -0.35 -0.2 A 0.35 0.35 0 0 1 0.35 -0.2 Z" ' + s + '/><path d="M -0.3 -0.68 Q 0 -0.86 0.3 -0.68 M -0.4 -0.86 Q 0 -1.08 0.4 -0.86" ' + s + '/>';
      case 'leuchte': return kreis(0, 0.3) + '<line x1="-0.21" y1="-0.21" x2="0.21" y2="0.21" ' + s + '/><line x1="0.21" y1="-0.21" x2="-0.21" y2="0.21" ' + s + '/>';
      case 'wandleuchte': return stiel(-0.2) + kreis(-0.48, 0.28) + '<line x1="-0.2" y1="-0.68" x2="0.2" y2="-0.28" ' + s + '/><line x1="0.2" y1="-0.68" x2="-0.2" y2="-0.28" ' + s + '/>';
      case 'motor': return stiel(-0.2) + kreis(-0.5, 0.3) + tx('M', 0, -0.5, 0.3);
      case 'geraet': case 'geraet3': {
        const k = (opt.name || (t === 'geraet3' ? '3~' : '~')).replace(/[^A-Za-zÄÖÜäöü0-9~]/g, '').slice(0, 3) || '~';
        return stiel(-0.15) + '<rect x="-0.45" y="-0.75" width="0.9" height="0.6" ' + s + '/>' + tx(k, 0, -0.45, 0.24) + (t === 'geraet3' ? '<line x1="-0.12" y1="-0.04" x2="0.12" y2="-0.1" ' + s + '/>' : '');
      }
      case 'uv': return '<rect x="-0.7" y="-0.55" width="1.4" height="0.55" ' + s + '/><path d="M -0.7 0 L 0.7 -0.55 L 0.7 0 Z" ' + f + '/>';
      case 'dose': return '<circle cx="0" cy="0" r="0.16" ' + s + '/><circle cx="0" cy="0" r="0.05" ' + f + '/>';
      case 'rm': return '<rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx="0.3" ' + s + '/>' + tx('RM', 0, 0, 0.22);
    }
    return '';
  }
  // Richtung „in den Raum“ (Einheitsvektor) je Drehung
  const RICHT = [[0, -1], [-1, 0], [0, 1], [1, 0]];

  // ======================================================================
  //  Bauplan-Editor
  // ======================================================================
  let P = null, R = null;
  const ED = { werkzeug: 'wahl', typ: 'sd', wahl: null, wahlRaum: null, ansicht: null, raster: true, leitungen: true, fang: true, kalib: null, ziehen: null, zeigerZahl: {} };
  const undo = [], redo = [];
  const bilder = {};   // Geschoss-ID → DataURL
  function bildLaden(gid) { if (bilder[gid] === undefined) { try { bilder[gid] = localStorage.getItem(BILD + gid) || ''; } catch (e) { bilder[gid] = ''; } } return bilder[gid]; }
  function S() { return P.projekt.symbol; }
  function aktivG() { return geschoss(P, P.aktiv); }

  function planSvg() { return $('bauplan'); }
  function ansichtEinpassen() {
    const g = P.aktiv, rs = P.raeume.filter(function (r) { return r.g === g; }), ds = P.geraete.filter(function (d) { return d.g === g; });
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rs.forEach(function (r) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.l); });
    ds.forEach(function (d) { x0 = Math.min(x0, d.x); y0 = Math.min(y0, d.y); x1 = Math.max(x1, d.x); y1 = Math.max(y1, d.y); });
    const G = aktivG(), b = bildLaden(g);
    if (b && G.bildB) { x0 = Math.min(x0, G.bildX); y0 = Math.min(y0, G.bildY); x1 = Math.max(x1, G.bildX + G.bildB); y1 = Math.max(y1, G.bildY + G.bildB * 0.7); }
    if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 10; y1 = 8; }
    const rand = 1;
    const sv = planSvg(), bw = sv.clientWidth || 800, bh = sv.clientHeight || 500;
    let w = x1 - x0 + 2 * rand, h = y1 - y0 + 2 * rand;
    if (w / h < bw / bh) w = h * bw / bh; else h = w * bh / bw;
    ED.ansicht = { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w: w, h: h };
  }
  function ansichtSetzen() {
    const sv = planSvg(), v = ED.ansicht;
    const bw = sv.clientWidth || 800, bh = sv.clientHeight || 500;
    // Seitenverhältnis an die Fläche anpassen
    const h = v.w * bh / bw;
    v.y += (v.h - h) / 2; v.h = h;
    sv.setAttribute('viewBox', [v.x, v.y, v.w, v.h].map(function (x) { return runde(x, 4); }).join(' '));
  }
  function weltPunkt(ev) {
    const sv = planSvg(), r = sv.getBoundingClientRect(), v = ED.ansicht;
    return { x: v.x + (ev.clientX - r.left) / r.width * v.w, y: v.y + (ev.clientY - r.top) / r.height * v.h };
  }
  const fang = function (x, schritt) { return ED.raster ? Math.round(x / (schritt || 0.05)) * (schritt || 0.05) : x; };
  // Wandfang: nächste Raumkante im Geschoss, Gerät 5 cm in den Raum, Drehung zur Wand
  function anWand(p, g) {
    let best = null, bd = Math.max(0.35, ED.ansicht.w / 40);
    P.raeume.forEach(function (r) {
      if (r.g !== g) return;
      const kanten = [
        { d: Math.abs(p.y - r.y), ok: p.x >= r.x - 0.05 && p.x <= r.x + r.w + 0.05 && p.y >= r.y - 0.4, x: Math.min(Math.max(p.x, r.x + 0.1), r.x + r.w - 0.1), y: r.y + 0.05, rot: 2 },
        { d: Math.abs(p.y - (r.y + r.l)), ok: p.x >= r.x - 0.05 && p.x <= r.x + r.w + 0.05 && p.y <= r.y + r.l + 0.4, x: Math.min(Math.max(p.x, r.x + 0.1), r.x + r.w - 0.1), y: r.y + r.l - 0.05, rot: 0 },
        { d: Math.abs(p.x - r.x), ok: p.y >= r.y - 0.05 && p.y <= r.y + r.l + 0.05 && p.x >= r.x - 0.4, x: r.x + 0.05, y: Math.min(Math.max(p.y, r.y + 0.1), r.y + r.l - 0.1), rot: 3 },
        { d: Math.abs(p.x - (r.x + r.w)), ok: p.y >= r.y - 0.05 && p.y <= r.y + r.l + 0.05 && p.x <= r.x + r.w + 0.4, x: r.x + r.w - 0.05, y: Math.min(Math.max(p.y, r.y + 0.1), r.y + r.l - 0.1), rot: 1 }
      ];
      // Innenseite bevorzugen: Punkt innerhalb des Raums zählt doppelt so nah
      const innen = p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.l;
      kanten.forEach(function (k) { const d = innen ? k.d * 0.5 : k.d; if (k.ok && d < bd) { bd = d; best = { x: runde(fang(k.x), 3), y: runde(fang(k.y), 3), rot: k.rot }; if (k.rot === 2 || k.rot === 0) best.y = runde(k.y, 3); else best.x = runde(k.x, 3); } });
    });
    return best;
  }

  // ---------- Zeichnen ----------
  const KFARBEN = ['#2B7BB9', '#E8590C', '#2F9E44', '#9C36B5', '#C92A2A', '#0C8599', '#E67700', '#5C940D', '#364FC7', '#A61E4D', '#087F5B', '#862E9C'];
  function kreisFarbe(k) { return k ? KFARBEN[(k.nr - 1) % KFARBEN.length] : '#868E96'; }
  function kreisVon(id) { return P.kreise.filter(function (k) { return k.id === id; })[0] || null; }
  function bauplanZeichnen() {
    const sv = planSvg(); if (!sv || !ED.ansicht) return;
    ansichtSetzen();
    const g = P.aktiv, G = aktivG(), Sz = S(), v = ED.ansicht;
    const o = [];
    o.push('<rect x="' + (v.x - 50) + '" y="' + (v.y - 50) + '" width="' + (v.w + 100) + '" height="' + (v.h + 100) + '" fill="#FFFFFF"/>');
    const b = bildLaden(g);
    if (b && G.bildB) o.push('<image href="' + b + '" x="' + G.bildX + '" y="' + G.bildY + '" width="' + G.bildB + '" preserveAspectRatio="xMinYMin meet" opacity="' + G.bildDeck + '" style="pointer-events:none"/>');
    if (ED.raster) {
      const s1 = v.w > 60 ? 5 : v.w > 25 ? 1 : 0.5;
      const xa = Math.floor(v.x / s1) * s1, ya = Math.floor(v.y / s1) * s1;
      let p = '';
      for (let x = xa; x <= v.x + v.w; x += s1) p += 'M' + runde(x, 3) + ' ' + runde(v.y, 3) + 'V' + runde(v.y + v.h, 3);
      for (let y = ya; y <= v.y + v.h; y += s1) p += 'M' + runde(v.x, 3) + ' ' + runde(y, 3) + 'H' + runde(v.x + v.w, 3);
      o.push('<path d="' + p + '" stroke="#DDE3E8" stroke-width="1" vector-effect="non-scaling-stroke" fill="none"/>');
    }
    // Räume
    P.raeume.filter(function (r) { return r.g === g; }).forEach(function (r) {
      const sel = ED.wahlRaum === r.id;
      o.push('<g data-raum="' + r.id + '" class="raum' + (sel ? ' gewaehlt' : '') + '"><rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.l + '" fill="' + (sel ? 'rgba(43,123,185,.08)' : 'rgba(241,243,245,.55)') + '" stroke="#343A40" stroke-width="0.1"/>');
      const fs = Math.min(0.32, r.w / 7, r.l / 3) * Math.max(1, Sz / 0.32);
      o.push('<text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.l * 0.28) + '" font-size="' + fs + '" text-anchor="middle" fill="#495057" font-family="Arial, sans-serif" style="pointer-events:none">' + esc(r.name) + '</text>');
      o.push('<text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.l * 0.28 + fs * 1.2) + '" font-size="' + fs * 0.75 + '" text-anchor="middle" fill="#868E96" font-family="Arial, sans-serif" style="pointer-events:none">' + zahl(flaeche(r), 1) + ' m²</text></g>');
      if (sel) [[r.x, r.y, 'nw'], [r.x + r.w, r.y, 'no'], [r.x, r.y + r.l, 'sw'], [r.x + r.w, r.y + r.l, 'so']].forEach(function (e) {
        o.push('<rect data-griff="' + e[2] + '" x="' + (e[0] - Sz * 0.35) + '" y="' + (e[1] - Sz * 0.35) + '" width="' + Sz * 0.7 + '" height="' + Sz * 0.7 + '" fill="#FFFFFF" stroke="#2B7BB9" stroke-width="2" vector-effect="non-scaling-stroke" style="cursor:nwse-resize"/>');
      });
    });
    // Leitungswege (vereinfachte Linien im rechten Winkel)
    if (ED.leitungen && R) {
      R.kabel.forEach(function (K) {
        if (K.von.g !== g || K.nach.g !== g) return;
        const c = kreisFarbe(K.kreis), a = K.von, z = K.nach;
        const sel = ED.wahl && ((K.nach.d && K.nach.d.id === ED.wahl) || (ED.wahlKreis && K.kreis.id === ED.wahlKreis));
        o.push('<path d="M' + a.x + ' ' + a.y + 'H' + z.x + 'V' + z.y + '" fill="none" stroke="' + c + '" stroke-width="' + (sel ? 2.6 : 1.1) + '" vector-effect="non-scaling-stroke" stroke-dasharray="' + (K.art === 'zu' || K.art === 'kette' ? '' : '5 3') + '" opacity="' + (sel ? 1 : ED.wahlKreis ? 0.15 : 0.45) + '" style="pointer-events:none"/>');
      });
      R.dosen.forEach(function (d) {
        if (d.g !== g || d.manuell) return;
        o.push('<g transform="translate(' + d.x + ' ' + d.y + ') scale(' + Sz + ')" color="' + kreisFarbe(d.kreis) + '" style="pointer-events:none">' + sym('dose') + '</g>');
        o.push('<text x="' + (d.x + Sz * 0.25) + '" y="' + (d.y - Sz * 0.25) + '" font-size="' + Sz * 0.32 + '" fill="' + kreisFarbe(d.kreis) + '" font-family="Arial, sans-serif" style="pointer-events:none">' + d.bmk + '</text>');
      });
    }
    // Geräte
    P.geraete.filter(function (d) { return d.g === g; }).forEach(function (d) {
      const k = kreisVon(d.k), c = TYP[d.t].kreis ? kreisFarbe(k) : '#212529', info = R && R.geraetInfo[d.id];
      const wand = TYP[d.t].wand, w = wand ? WINKEL[d.rot] : 0, sel = ED.wahl === d.id;
      o.push('<g data-id="' + d.id + '" class="geraet" transform="translate(' + d.x + ' ' + d.y + ')" color="' + c + '">');
      o.push('<circle r="' + Sz * 0.75 + '" cx="' + (wand ? RICHT[d.rot][0] * Sz * 0.5 : 0) + '" cy="' + (wand ? RICHT[d.rot][1] * Sz * 0.5 : 0) + '" fill="' + (sel ? 'rgba(43,123,185,.18)' : 'transparent') + '" stroke="' + (sel ? '#2B7BB9' : 'none') + '" stroke-width="2" vector-effect="non-scaling-stroke"/>');
      o.push('<g transform="scale(' + Sz + ') rotate(' + w + ')">' + sym(d.t, info && info.rolle, { winkel: w, anz: d.anz, name: d.name }) + '</g>');
      // Beschriftung: Stromkreis und Schaltgruppe, Schutzart
      if (k || d.ip || d.name) {
        const r = wand ? RICHT[d.rot] : [0.7, -0.7], ab = wand ? 1.45 : 0.8;
        const lx = r[0] * Sz * ab + (wand && r[0] === 0 ? Sz * 0.75 : 0), ly = r[1] * Sz * ab + (wand && r[1] === 0 ? -Sz * 0.55 : 0);
        const txt = (k ? k.nr + (d.gr || '') + (d.t === 'serie' && d.gr2 ? '/' + d.gr2 : '') : '') + (d.ip ? ' IP44' : '');
        o.push('<text x="' + runde(lx, 3) + '" y="' + runde(ly, 3) + '" font-size="' + Sz * 0.5 + '" text-anchor="middle" dominant-baseline="central" fill="' + c + '" font-family="Arial, sans-serif" font-weight="700" style="pointer-events:none">' + esc(txt) + '</text>');
      }
      o.push('</g>');
    });
    // Raum aufziehen / Kalibrierlinie
    if (ED.neuRaum) { const n = ED.neuRaum; o.push('<rect x="' + Math.min(n.x0, n.x1) + '" y="' + Math.min(n.y0, n.y1) + '" width="' + Math.abs(n.x1 - n.x0) + '" height="' + Math.abs(n.y1 - n.y0) + '" fill="rgba(43,123,185,.12)" stroke="#2B7BB9" stroke-width="2" vector-effect="non-scaling-stroke" stroke-dasharray="6 4"/><text x="' + (Math.min(n.x0, n.x1) + Math.abs(n.x1 - n.x0) / 2) + '" y="' + (Math.min(n.y0, n.y1) - 0.15) + '" font-size="' + Sz * 0.45 + '" text-anchor="middle" fill="#2B7BB9" font-family="Arial, sans-serif">' + zahl(Math.abs(n.x1 - n.x0), 2) + ' × ' + zahl(Math.abs(n.y1 - n.y0), 2) + ' m</text>'); }
    if (ED.kalib && ED.kalib.a) { const a = ED.kalib.a, z = ED.kalib.b || ED.kalib.m || a; o.push('<line x1="' + a.x + '" y1="' + a.y + '" x2="' + z.x + '" y2="' + z.y + '" stroke="#E8590C" stroke-width="3" vector-effect="non-scaling-stroke"/><circle cx="' + a.x + '" cy="' + a.y + '" r="' + Sz * 0.2 + '" fill="#E8590C"/>' + (ED.kalib.b ? '<circle cx="' + z.x + '" cy="' + z.y + '" r="' + Sz * 0.2 + '" fill="#E8590C"/>' : '')); }
    if (ED.vorschau) { const p = ED.vorschau, w = TYP[ED.typ].wand ? WINKEL[p.rot || 0] : 0; o.push('<g transform="translate(' + p.x + ' ' + p.y + ') scale(' + Sz + ') rotate(' + w + ')" color="#2B7BB9" opacity="0.55" style="pointer-events:none">' + sym(ED.typ, '', { winkel: w }) + '</g>'); }
    sv.innerHTML = o.join('');
  }

  // ---------- Bedienung ----------
  function geraetVon(id) { return P.geraete.filter(function (d) { return d.id === id; })[0] || null; }
  function raumNach(id) { return P.raeume.filter(function (r) { return r.id === id; })[0] || null; }
  function vorher() { undo.push(JSON.stringify(P)); if (undo.length > 80) undo.shift(); redo.length = 0; knoepfeUndo(); }
  function knoepfeUndo() { if ($('ep-undo')) { $('ep-undo').disabled = !undo.length; $('ep-redo').disabled = !redo.length; } }
  function rueck(aus, nach) {
    if (!aus.length) return;
    nach.push(JSON.stringify(P));
    const p = JSON.parse(aus.pop());
    if (pruefeProjekt(p)) { P = p; ED.wahl = null; ED.wahlRaum = null; neu(); }
    knoepfeUndo();
  }
  function werkzeug(w, typ) {
    ED.werkzeug = w; if (typ) ED.typ = typ;
    ED.kalib = w === 'kalib' ? {} : null; ED.vorschau = null; ED.neuRaum = null;
    document.querySelectorAll('[data-werkzeug]').forEach(function (k) { k.setAttribute('aria-pressed', String(k.getAttribute('data-werkzeug') === w && (w !== 'setzen' || k.getAttribute('data-typ') === ED.typ))); });
    planSvg().style.cursor = w === 'wahl' ? 'default' : 'crosshair';
    $('ep-hinweis').textContent = w === 'raum' ? 'Raum aufziehen: Ecke drücken und ziehen. Maße danach rechts genau eintragen.' : w === 'setzen' ? TYP[ED.typ].n + ' setzen: tippen, Wandgeräte rasten an der nächsten Wand ein. Esc beendet.' : w === 'kalib' ? 'Maßstab: zwei Punkte im Plan antippen, deren Abstand du kennst.' : 'Antippen wählt, Ziehen verschiebt. Leere Fläche ziehen verschiebt die Ansicht, Mausrad oder zwei Finger zoomen.';
    bauplanZeichnen();
  }
  function zeigerEinrichten() {
    const sv = planSvg();
    const zeiger = ED.zeigerZahl;
    let pinch = null;
    sv.addEventListener('pointerdown', function (ev) {
      zeiger[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
      try { sv.setPointerCapture(ev.pointerId); } catch (e) { /* alt */ }
      const ids = Object.keys(zeiger);
      if (ids.length === 2) { const a = zeiger[ids[0]], b = zeiger[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), v: kopie(ED.ansicht), m: weltPunkt({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }) }; ED.ziehen = null; ED.neuRaum = null; return; }
      const p = weltPunkt(ev), ziel = ev.target.closest ? ev.target : null;
      const gEl = ziel && ziel.closest('[data-id]'), rEl = ziel && ziel.closest('[data-raum]'), griff = ziel && ziel.getAttribute && ziel.getAttribute('data-griff');
      ev.preventDefault();
      if (ED.werkzeug === 'setzen') { ED.ziehen = { art: 'setzen', p: p }; return; }
      if (ED.werkzeug === 'raum') { ED.neuRaum = { x0: fang(p.x, 0.05), y0: fang(p.y, 0.05), x1: fang(p.x, 0.05), y1: fang(p.y, 0.05) }; bauplanZeichnen(); return; }
      if (ED.werkzeug === 'kalib') {
        if (!ED.kalib.a || ED.kalib.b) ED.kalib = { a: p }; else { ED.kalib.b = p; eigenschaftenZeigen(); }
        bauplanZeichnen(); return;
      }
      if (griff && ED.wahlRaum) { ED.ziehen = { art: 'griff', e: griff, r: raumNach(ED.wahlRaum), start: p, alt: kopie(raumNach(ED.wahlRaum)), bewegt: false }; return; }
      if (gEl) {
        const d = geraetVon(gEl.getAttribute('data-id'));
        waehle(d.id, null);
        ED.ziehen = { art: 'geraet', d: d, start: p, x: d.x, y: d.y, rot: d.rot, bewegt: false };
        return;
      }
      if (rEl) {
        const r = raumNach(rEl.getAttribute('data-raum'));
        const inner = P.geraete.filter(function (d) { return d.g === r.g && d.x >= r.x - 0.01 && d.x <= r.x + r.w + 0.01 && d.y >= r.y - 0.01 && d.y <= r.y + r.l + 0.01 && raumVon(P, d) === r; });
        ED.ziehen = { art: 'raum', r: r, start: p, x: r.x, y: r.y, mit: inner.map(function (d) { return [d, d.x, d.y]; }), bewegt: false, wahl: true };
        return;
      }
      ED.ziehen = { art: 'pan', start: { x: ev.clientX, y: ev.clientY }, v: kopie(ED.ansicht), bewegt: false };
    });
    sv.addEventListener('pointermove', function (ev) {
      if (zeiger[ev.pointerId]) zeiger[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
      const ids = Object.keys(zeiger);
      if (pinch && ids.length === 2) {
        const a = zeiger[ids[0]], b = zeiger[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y) || 1, f = Math.min(8, Math.max(0.12, pinch.d / d));
        const v = pinch.v, m = pinch.m;
        ED.ansicht = { x: m.x - (m.x - v.x) * f, y: m.y - (m.y - v.y) * f, w: v.w * f, h: v.h * f };
        bauplanZeichnen(); return;
      }
      const p = weltPunkt(ev), Z = ED.ziehen;
      if (ED.werkzeug === 'setzen' && !Z) { const w = TYP[ED.typ].wand ? anWand(p, P.aktiv) : null; ED.vorschau = w || { x: fang(p.x), y: fang(p.y), rot: 0 }; bauplanZeichnen(); return; }
      if (ED.werkzeug === 'kalib' && ED.kalib && ED.kalib.a && !ED.kalib.b) { ED.kalib.m = p; bauplanZeichnen(); return; }
      if (ED.neuRaum) { ED.neuRaum.x1 = fang(p.x, 0.05); ED.neuRaum.y1 = fang(p.y, 0.05); bauplanZeichnen(); return; }
      if (!Z) return;
      if (Z.art === 'pan') {
        const sv2 = planSvg(), r = sv2.getBoundingClientRect();
        const dx = (ev.clientX - Z.start.x) / r.width * Z.v.w, dy = (ev.clientY - Z.start.y) / r.height * Z.v.h;
        if (Math.abs(ev.clientX - Z.start.x) + Math.abs(ev.clientY - Z.start.y) > 4) Z.bewegt = true;
        ED.ansicht.x = Z.v.x - dx; ED.ansicht.y = Z.v.y - dy; bauplanZeichnen(); return;
      }
      if (ED.neuRaum) { ED.neuRaum.x1 = fang(p.x, 0.05); ED.neuRaum.y1 = fang(p.y, 0.05); bauplanZeichnen(); return; }
      const dx = p.x - Z.start.x, dy = p.y - Z.start.y;
      if (!Z.bewegt && Math.hypot(dx, dy) < ED.ansicht.w / 150) return;
      if (!Z.bewegt) { Z.bewegt = true; vorher(); }
      if (Z.art === 'geraet') {
        const d = Z.d, roh = { x: Z.x + dx, y: Z.y + dy };
        const w = TYP[d.t].wand && ED.fang ? anWand(roh, d.g) : null;
        if (w) { d.x = w.x; d.y = w.y; d.rot = w.rot; } else { d.x = runde(fang(roh.x), 3); d.y = runde(fang(roh.y), 3); }
      } else if (Z.art === 'raum') {
        const nx = runde(fang(Z.x + dx), 3), ny = runde(fang(Z.y + dy), 3);
        Z.r.x = nx; Z.r.y = ny;
        Z.mit.forEach(function (m) { m[0].x = runde(m[1] + nx - Z.x, 3); m[0].y = runde(m[2] + ny - Z.y, 3); });
      } else if (Z.art === 'griff') {
        const a = Z.alt, r = Z.r, e = Z.e;
        let x0 = a.x, y0 = a.y, x1 = a.x + a.w, y1 = a.y + a.l;
        if (e.indexOf('w') >= 0) x0 = fang(a.x + dx); if (e.indexOf('o') >= 0) x1 = fang(a.x + a.w + dx);
        if (e[0] === 'n') y0 = fang(a.y + dy); if (e[0] === 's') y1 = fang(a.y + a.l + dy);
        r.x = runde(Math.min(x0, x1 - 0.3), 3); r.y = runde(Math.min(y0, y1 - 0.3), 3); r.w = runde(Math.max(0.3, Math.abs(x1 - x0)), 3); r.l = runde(Math.max(0.3, Math.abs(y1 - y0)), 3);
      }
      bauplanZeichnen();
    });
    const ende = function (ev) {
      delete zeiger[ev.pointerId];
      if (pinch) { if (Object.keys(zeiger).length < 2) pinch = null; return; }
      const Z = ED.ziehen; ED.ziehen = null;
      if (ED.neuRaum) {
        const n = ED.neuRaum; ED.neuRaum = null;
        const w = Math.abs(n.x1 - n.x0), l = Math.abs(n.y1 - n.y0);
        if (w >= 0.3 && l >= 0.3) {
          vorher();
          const r = { id: neueId('r'), g: P.aktiv, name: 'Raum ' + (P.raeume.filter(function (x) { return x.g === P.aktiv; }).length + 1), typ: 'sonst', x: runde(Math.min(n.x0, n.x1), 3), y: runde(Math.min(n.y0, n.y1), 3), w: runde(w, 3), l: runde(l, 3) };
          P.raeume.push(r); ED.wahlRaum = r.id; ED.wahl = null; werkzeug('wahl'); neu();
          setTimeout(function () { const f = document.querySelector('#eigenschaften input'); if (f) { f.focus(); f.select(); } }, 30);
        } else bauplanZeichnen();
        return;
      }
      if (!Z) return;
      if (Z.art === 'setzen') {
        const p = weltPunkt(ev);
        if (Math.hypot(p.x - Z.p.x, p.y - Z.p.y) > ED.ansicht.w / 60) return;   // war ein Wisch
        setzen(p); return;
      }
      if (Z.art === 'pan') { if (!Z.bewegt) { ED.wahl = null; ED.wahlRaum = null; eigenschaftenZeigen(); bauplanZeichnen(); } return; }
      if (Z.art === 'raum' && !Z.bewegt) { waehle(null, Z.r.id); return; }
      if (Z.bewegt) {
        if (Z.art === 'geraet' && Z.d.k) {
          // in einen anderen Raum gezogen? Stromkreis bleibt, Gruppe bleibt – nur neu rechnen
        }
        neu();
      }
    };
    sv.addEventListener('pointerup', ende);
    sv.addEventListener('pointercancel', ende);
    sv.addEventListener('pointerleave', function () { if (ED.vorschau) { ED.vorschau = null; bauplanZeichnen(); } });
    sv.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      zoom(Math.pow(1.0015, ev.deltaY * (ev.deltaMode === 1 ? 30 : 1)), weltPunkt(ev));
    }, { passive: false });
  }
  function zoom(f, m) {
    const v = ED.ansicht; f = Math.min(5, Math.max(0.2, f));
    const nw = Math.min(400, Math.max(1.5, v.w * f)); f = nw / v.w;
    m = m || { x: v.x + v.w / 2, y: v.y + v.h / 2 };
    ED.ansicht = { x: m.x - (m.x - v.x) * f, y: m.y - (m.y - v.y) * f, w: v.w * f, h: v.h * f };
    bauplanZeichnen();
  }
  function setzen(p) {
    const t = ED.typ, T = TYP[t];
    if (t === 'uv' && P.geraete.some(function (d) { return d.t === 'uv'; })) { melde('Es gibt schon einen Verteiler – vorhandenen verschieben.'); return; }
    const w = T.wand ? anWand(p, P.aktiv) : null;
    if (T.wand && !w && !P.raeume.some(function (r) { return r.g === P.aktiv; })) melde('Tipp: Zuerst Räume aufziehen – Wandgeräte rasten dann an den Wänden ein.');
    vorher();
    const d = { id: neueId('d'), t: t, g: P.aktiv, x: w ? w.x : runde(fang(p.x), 3), y: w ? w.y : runde(fang(p.y), 3), rot: w ? w.rot : 0, k: '', gr: '', gr2: '', anz: 1, ip: false, eigen: false, name: '', P: T.P || 0, h: null };
    if (t === 'geraet3') d.name = 'Herd';
    P.geraete.push(d);
    geraetZuordnen(P, d);
    if (t === 'serie' && d.k) d.gr2 = freieGruppe(P, kreisVon(d.k));
    ED.wahl = d.id; ED.wahlRaum = null;
    neu();
  }
  function waehle(id, rid) { ED.wahl = id; ED.wahlRaum = rid; ED.wahlKreis = id ? (geraetVon(id) || {}).k : null; eigenschaftenZeigen(); bauplanZeichnen(); }
  function loeschen() {
    if (ED.wahl) { vorher(); P.geraete = P.geraete.filter(function (d) { return d.id !== ED.wahl; }); ED.wahl = null; aufraeumen(P); neu(); }
    else if (ED.wahlRaum) {
      const r = raumNach(ED.wahlRaum), n = P.geraete.filter(function (d) { const rr = raumVon(P, d); return rr === r; }).length;
      Nachfrage('Raum „' + r.name + '“ löschen?' + (n ? ' Die ' + n + ' Geräte darin bleiben stehen.' : ''), function () { vorher(); P.raeume = P.raeume.filter(function (x) { return x !== r; }); ED.wahlRaum = null; neu(); });
    }
  }
  function drehen() { const d = geraetVon(ED.wahl); if (!d) return; vorher(); d.rot = (d.rot + 1) % 4; neu(); }
  function duplizieren() {
    const d = geraetVon(ED.wahl); if (!d) return;
    vorher();
    const n = kopie(d); n.id = neueId('d'); const r = RICHT[d.rot]; n.x = runde(d.x + (r[1] !== 0 ? 0.4 : 0), 3); n.y = runde(d.y + (r[0] !== 0 ? 0.4 : 0), 3);
    if (d.t === 'uv') return;
    P.geraete.push(n); ED.wahl = n.id; neu();
  }
  function tasten(ev) {
    if (!document.body.contains(planSvg()) || $('ep-ansicht-bauplan').hidden) return;
    const z = ev.target; if (z && (z.tagName === 'INPUT' || z.tagName === 'SELECT' || z.tagName === 'TEXTAREA')) return;
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'z' || ev.key === 'Z')) { ev.preventDefault(); if (ev.shiftKey) rueck(redo, undo); else rueck(undo, redo); return; }
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'y')) { ev.preventDefault(); rueck(redo, undo); return; }
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'd')) { ev.preventDefault(); duplizieren(); return; }
    if (ev.key === 'Escape') { werkzeug('wahl'); ED.wahl = null; ED.wahlRaum = null; eigenschaftenZeigen(); bauplanZeichnen(); return; }
    if (ev.key === 'Delete' || ev.key === 'Backspace') { if (ED.wahl || ED.wahlRaum) { ev.preventDefault(); loeschen(); } return; }
    if (ev.key === 'r' || ev.key === 'R') { drehen(); return; }
    const sch = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[ev.key];
    if (sch && (ED.wahl || ED.wahlRaum)) {
      ev.preventDefault();
      const s = ev.shiftKey ? 0.5 : 0.05;
      vorher();
      if (ED.wahl) { const d = geraetVon(ED.wahl); d.x = runde(d.x + sch[0] * s, 3); d.y = runde(d.y + sch[1] * s, 3); }
      else { const r = raumNach(ED.wahlRaum); P.geraete.forEach(function (d) { if (raumVon(P, d) === r) { d.x = runde(d.x + sch[0] * s, 3); d.y = runde(d.y + sch[1] * s, 3); } }); r.x = runde(r.x + sch[0] * s, 3); r.y = runde(r.y + sch[1] * s, 3); }
      neu();
    }
  }

  // ======================================================================
  //  Planblätter (A3 quer, Maße in mm): Rahmen, Schriftfeld, Pläne, Listen
  // ======================================================================
  const BW = 420, BH = 297, RX0 = 20, RX1 = 410, RY0 = 10, RY1 = 287, SF = 262;   // Rahmen und Oberkante Schriftfeld
  const SCHRIFT = 'Arial, Helvetica, sans-serif';
  function T(x, y, text, o) {
    o = o || {};
    return '<text x="' + runde(x, 2) + '" y="' + runde(y, 2) + '" font-size="' + (o.gr || 2.5) + '"' + (o.ausr ? ' text-anchor="' + o.ausr + '"' : '') + (o.fett ? ' font-weight="700"' : '') + (o.dreh ? ' transform="rotate(' + o.dreh + ' ' + runde(x, 2) + ' ' + runde(y, 2) + ')"' : '') + ' fill="' + (o.farbe || '#000') + '" font-family="' + SCHRIFT + '"' + (o.mitte ? ' dominant-baseline="central"' : '') + '>' + esc(text) + '</text>';
  }
  const L = function (x1, y1, x2, y2, o) { o = o || {}; return '<line x1="' + runde(x1, 2) + '" y1="' + runde(y1, 2) + '" x2="' + runde(x2, 2) + '" y2="' + runde(y2, 2) + '" stroke="' + (o.farbe || '#000') + '" stroke-width="' + (o.st || 0.35) + '"' + (o.strich ? ' stroke-dasharray="' + o.strich + '"' : '') + '/>'; };
  const RE = function (x, y, w, h, o) { o = o || {}; return '<rect x="' + runde(x, 2) + '" y="' + runde(y, 2) + '" width="' + runde(w, 2) + '" height="' + runde(h, 2) + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.farbe || '#000') + '" stroke-width="' + (o.st || 0.35) + '"' + (o.strich ? ' stroke-dasharray="' + o.strich + '"' : '') + (o.rx ? ' rx="' + o.rx + '"' : '') + '/>'; };
  const PU = function (x, y, r) { return '<circle cx="' + runde(x, 2) + '" cy="' + runde(y, 2) + '" r="' + (r || 0.7) + '" fill="#000"/>'; };
  const KL = function (x, y) { return '<circle cx="' + runde(x, 2) + '" cy="' + runde(y, 2) + '" r="1" fill="#fff" stroke="#000" stroke-width="0.3"/>'; };

  function rahmen(ctx, inhalt) {
    const p = P.projekt, o = [];
    o.push('<rect x="0" y="0" width="' + BW + '" height="' + BH + '" fill="#fff"/>');
    o.push(RE(RX0, RY0, RX1 - RX0, RY1 - RY0, { st: 0.7 }));
    // Schriftfeld (angelehnt an DIN EN ISO 7200)
    o.push(L(RX0, SF, RX1, SF, { st: 0.7 }));
    const sp = [RX0, 105, 215, 305, 355, RX1];
    sp.slice(1, -1).forEach(function (x) { o.push(L(x, SF, x, RY1, { st: 0.5 })); });
    o.push(L(sp[3], SF + 12.5, RX1, SF + 12.5, { st: 0.25 }));
    o.push(T(sp[0] + 2, SF + 4, 'Ersteller', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[0] + 2, SF + 10, p.firma || '—', { gr: 3, fett: true }));
    o.push(T(sp[0] + 2, SF + 16, p.ersteller || '', { gr: 2.5 }));
    o.push(T(sp[0] + 2, SF + 22, 'Datum ' + p.datum + (p.revision ? '  ·  Index ' + p.revision : ''), { gr: 2.2 }));
    o.push(T(sp[1] + 2, SF + 4, 'Projekt / Bauvorhaben', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[1] + 2, SF + 10, p.name || '—', { gr: 3, fett: true }));
    o.push(T(sp[1] + 2, SF + 16, p.kunde || '', { gr: 2.5 }));
    o.push(T(sp[1] + 2, SF + 22, p.adresse || '', { gr: 2.2 }));
    o.push(T(sp[2] + 2, SF + 4, 'Planinhalt', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[2] + 2, SF + 11, ctx.titel, { gr: 3.4, fett: true }));
    if (ctx.unter) o.push(T(sp[2] + 2, SF + 17.5, ctx.unter, { gr: 2.3 }));
    o.push(T(sp[2] + 2, SF + 23, 'Netz ' + p.netz + ' · 3/N/PE AC 400/230 V 50 Hz', { gr: 2 }));
    o.push(T(sp[3] + 2, SF + 4, 'Zeichnungs-Nr.', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[3] + 2, SF + 10, p.zeichnung || '—', { gr: 2.8, fett: true }));
    o.push(T(sp[3] + 2, SF + 16.5, 'Format', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[3] + 2, SF + 22, p.format + ' quer', { gr: 2.5 }));
    o.push(T(sp[4] + 2, SF + 4, 'Blatt', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[4] + 27.5, SF + 10.5, ctx.nr + ' / ' + ctx.von, { gr: 4.5, fett: true, ausr: 'middle' }));
    o.push(T(sp[4] + 2, SF + 16.5, 'Norm', { gr: 1.8, farbe: '#555' }));
    o.push(T(sp[4] + 2, SF + 22, 'DIN EN 61082 / 60617', { gr: 2 }));
    o.push(inhalt);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + BW + ' ' + BH + '" class="blatt-svg" role="img" aria-label="' + esc(ctx.titel + ', Blatt ' + ctx.nr) + '">' + o.join('') + '</svg>';
  }

  // ---------- Stromlaufplan-Symbole (DIN EN 60617-7) ----------
  function schliesser(x, y, h, o) {   // Kontakt von y bis y+h, Hebel nach links offen
    o = o || {};
    const a = y + h * 0.3, b = y + h * 0.7;
    let s = L(x, y, x, a) + L(x, b, x, y + h) + L(x, b, x - h * 0.28, a + h * 0.02);
    if (o.ls) s += L(x - 1.2, b - 1.2, x + 1.2, b + 1.2, { st: 0.3 }) + L(x - 1.2, b + 1.2, x + 1.2, b - 1.2, { st: 0.3 });   // Schaltschloss-Kreuz
    if (o.taster) s += L(x - h * 0.14, a + h * 0.2, x - h * 0.42, a + h * 0.2, { st: 0.3, strich: '0.8 0.6' }) + L(x - h * 0.42, a + h * 0.1, x - h * 0.42, a + h * 0.3, { st: 0.35 });
    return s;
  }
  function wechsler(x, y, h, unten) {   // gemeinsamer Anschluss oben (unten=false) bzw. unten
    if (!unten) return L(x, y, x, y + h * 0.35) + L(x, y + h * 0.35, x - 2.5, y + h * 0.78) + L(x - 2.5, y + h * 0.75, x - 2.5, y + h) + L(x + 2.5, y + h * 0.7, x + 2.5, y + h) + L(x + 2.5, y + h * 0.7, x + 1.4, y + h * 0.7);
    return L(x, y + h, x, y + h * 0.65) + L(x, y + h * 0.65, x - 2.5, y + h * 0.22) + L(x - 2.5, y + h * 0.25, x - 2.5, y) + L(x + 2.5, y + h * 0.3, x + 2.5, y) + L(x + 2.5, y + h * 0.3, x + 1.4, y + h * 0.3);
  }
  function kreuzer(x, y, h) {
    return L(x - 2.5, y, x - 2.5, y + h * 0.25) + L(x + 2.5, y, x + 2.5, y + h * 0.25) + L(x - 2.5, y + h * 0.75, x - 2.5, y + h) + L(x + 2.5, y + h * 0.75, x + 2.5, y + h) +
      L(x - 2.5, y + h * 0.25, x + 2.5, y + h * 0.75, { st: 0.3, strich: '1 0.7' }) + L(x + 2.5, y + h * 0.25, x - 2.5, y + h * 0.75, { st: 0.3, strich: '1 0.7' }) +
      L(x - 2.5, y + h * 0.25, x - 2.5, y + h * 0.72) + L(x + 2.5, y + h * 0.25, x + 2.5, y + h * 0.72) + RE(x - 4, y + h * 0.2, 8, h * 0.6, { st: 0.25, strich: '1 0.8' });
  }
  function lampe(x, y) { const r = 2.4; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" stroke="#000" stroke-width="0.35"/>' + L(x - r * 0.7, y - r * 0.7, x + r * 0.7, y + r * 0.7) + L(x + r * 0.7, y - r * 0.7, x - r * 0.7, y + r * 0.7); }
  function spule(x, y) { return RE(x - 3, y, 6, 4.5, { fill: '#fff' }); }

  // ---------- Stromlaufplan: Aufbau der Spalten je Stromkreis ----------
  function spaltenVon(RK) {
    // jede Spalte: { art, ... } – wird in zeichneKreis verwendet
    const sp = [], k = RK.k;
    if (RK.drei) {
      sp.push({ art: 'ls3', teil: 0 }, { art: 'ls3', teil: 1 }, { art: 'ls3', teil: 2 });
      return sp;
    }
    sp.push({ art: 'ls' });
    const nichtGr = RK.ger.filter(function (d) { return !d.gr || (!TYP[d.t].lampe && !TYP[d.t].schalt && d.t !== 'jalousie' && d.t !== 'motor'); });
    let ersteBelegt = false;
    const nimm = function (o) { if (!ersteBelegt) { Object.assign(sp[0], o, { ls: true }); ersteBelegt = true; } else sp.push(o); };
    nichtGr.forEach(function (d) { nimm({ art: 'verbr', d: d }); });
    RK.gruppen.forEach(function (G) {
      if (G.art === 'roll') { nimm({ art: 'roll', G: G, teil: 0 }); sp.push({ art: 'roll', G: G, teil: 1 }); return; }
      if (G.art === 'stromstoss') {
        G.taster.forEach(function (t, i) { nimm({ art: 'taster', G: G, d: t, i: i }); });
        sp.push({ art: 'kontakt', G: G });
        G.lampen.slice(1).forEach(function (l) { sp.push({ art: 'lampe', G: G, d: l }); });
        return;
      }
      if (G.art === 'serie') {
        // Serienschalter einmal je Schalter: zwei Gruppen teilen sich den Schalter – nur bei der ersten Gruppe zeichnen
        const s = G.serie[0];
        if (s && s.gr !== G.b) return;
        const andere = RK.gruppen.filter(function (x) { return x.b === (s ? s.gr2 : '') && x !== G; })[0];
        nimm({ art: 'serie', G: G, G2: andere, d: s, teil: 0 });
        G.lampen.slice(1).forEach(function (l) { sp.push({ art: 'lampe', G: G, d: l }); });
        if (andere) { sp.push({ art: 'serie', G: andere, G2: G, d: s, teil: 1 }); andere.lampen.slice(1).forEach(function (l) { sp.push({ art: 'lampe', G: andere, d: l }); }); }
        return;
      }
      nimm({ art: 'gruppe', G: G });
      G.lampen.slice(1).forEach(function (l) { sp.push({ art: 'lampe', G: G, d: l }); });
    });
    return sp;
  }
  // Seiten des Stromlaufplans je RCD (ohne RCD: eigene Gruppe)
  const SL = { x0: 34, cw: 14, max: 26, yL: { L1: 24, L2: 29, L3: 34 }, yN: 245, yPE: 252 };
  function stromlaufSeiten() {
    const gruppen = P.rcds.map(function (q) { return { q: q, kreise: P.kreise.filter(function (k) { return k.rcd === q.id; }) }; });
    const ohne = P.kreise.filter(function (k) { return !k.rcd || k.rcd === 'rcbo'; });
    if (ohne.length) gruppen.push({ q: null, kreise: ohne });
    const seiten = [];
    gruppen.forEach(function (gr) {
      let s = null;
      gr.kreise.forEach(function (k) {
        const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return;
        const sp = spaltenVon(RK);
        if (!s || s.n + sp.length > SL.max) { s = { q: gr.q, bloecke: [], n: 0, teil: s && s.q === gr.q ? s.teil + 1 : 1 }; seiten.push(s); }
        s.bloecke.push({ RK: RK, sp: sp, start: s.n });
        s.n += sp.length;
      });
      if (!s && gr.q) seiten.push({ q: gr.q, bloecke: [], n: 0, teil: 1 });
    });
    return seiten;
  }
  function raumKurz(d) { const r = raumVon(P, d); return r ? r.name : ''; }
  function stromlaufBlatt(seite, ctx) {
    const o = [], cw = seite.n > SL.max ? (RX1 - 6 - SL.x0) / seite.n : SL.cw;
    const X = function (i) { return SL.x0 + cw * (i + 0.5); };
    const xEnde = Math.max(X(Math.max(seite.n - 1, 0)) + cw / 2, 120);
    // Pfadnummern
    o.push(L(RX0, 17, RX1, 17, { st: 0.25 }));
    for (let i = 0; i < seite.n; i++) { o.push(T(X(i), 15.5, String(i + 1), { gr: 2.2, ausr: 'middle' })); o.push(L(SL.x0 + cw * (i + 1), RY0, SL.x0 + cw * (i + 1), 17, { st: 0.2 })); }
    // Sammelschienen
    const q = seite.q;
    ['L1', 'L2', 'L3'].forEach(function (ph) { o.push(L(26, SL.yL[ph], xEnde, SL.yL[ph], { st: 0.5 })); o.push(T(22, SL.yL[ph] + 0.9, ph, { gr: 2.4, fett: true })); });
    o.push(L(26, SL.yN, xEnde, SL.yN, { st: 0.5, farbe: '#1C7ED6' })); o.push(T(22, SL.yN + 0.9, 'N', { gr: 2.4, fett: true }));
    o.push(L(26, SL.yPE, xEnde, SL.yPE, { st: 0.5, farbe: '#2F9E44' })); o.push(T(21.5, SL.yPE + 0.9, 'PE', { gr: 2.4, fett: true }));
    const vonText = q ? 'von -Q' + q.nr + ' (Blatt ' + ctx.nrVon('einspeisung') + ')' : 'direkt von der Sammelschiene (Blatt ' + ctx.nrVon('einspeisung') + ')';
    o.push(T(26, 21, vonText, { gr: 2 }));
    o.push(T(xEnde, 21, seite.teil > 1 ? 'Fortsetzung' : '', { gr: 2, ausr: 'end' }));
    o.push(L(26, 64, xEnde, 64, { st: 0.2, strich: '3 1.5', farbe: '#868E96' }));
    o.push(T(21.5, 62.6, 'Verteiler', { gr: 1.5, farbe: '#868E96' }));
    o.push(T(21.5, 67, 'Install.', { gr: 1.5, farbe: '#868E96' }));
    seite.bloecke.forEach(function (B) { o.push(zeichneKreis(B, X, cw, ctx)); });
    return rahmen(ctx, o.join(''));
  }
  function zeichneKreis(B, X, cw, ctx) {
    const RK = B.RK, k = RK.k, o = [], sp = B.sp, s0 = B.start, info = function (d) { return R.geraetInfo[d.id] || { bmk: '?' }; };
    const xa = X(s0) - cw / 2 + 1, xb = X(s0 + sp.length - 1) + cw / 2 - 1;
    // Kopf: Stromkreis
    o.push(RE(xa, 38, xb - xa, 7.5, { st: 0.25, fill: '#F1F3F5' }));
    const kopfText = '-F' + k.nr + ' ' + k.name, passt = (xb - xa - 2) / (kopfText.length * 0.55);
    if (passt >= 1.7) o.push(T(xa + 1, 42.8, kopfText, { gr: Math.min(2.4, passt), fett: true }));
    else { o.push(T(xa + 1, 42.8, '-F' + k.nr, { gr: 2.2, fett: true })); o.push(T(X(s0) + 4.2, 82, k.name.slice(0, 40), { gr: 1.9, dreh: 90, fett: true })); }
    const kab = RK.kabel[0];
    o.push(T(X(s0) + 4, 241.8, (kab ? kab.bmk + ' ' + kab.typ + ' ' + kab.adern + '×' + zahl(RK.a, RK.a % 1 ? 1 : 0) : '') + ' · ' + zahl(RK.lGesamt, 0) + ' m', { gr: 1.7, farbe: '#495057' }));
    const yLS = 47, yX = 66, yLine = 72, yNl = 229, yPEl = 235;
    if (RK.drei) {
      ['L1', 'L2', 'L3'].forEach(function (ph, i) {
        const x = X(s0 + i);
        o.push(PU(x, SL.yL[ph]) + L(x, SL.yL[ph], x, yLS) + schliesser(x, yLS, 11, { ls: true }) + L(x, yLS + 11, x, yX - 1) + KL(x, yX) + T(x + 1.5, yX + 0.8, (RK.klemmen && RK.klemmen[2 + i] ? 'X1:' + RK.klemmen[2 + i].nr : ''), { gr: 1.6 }));
        o.push(L(x, yX + 1, x, 190));
      });
      o.push(L(X(s0) - 2.5, yLS + 5.5, X(s0 + 2) + 2.5, yLS + 5.5, { st: 0.25, strich: '1 0.8' }));
      o.push(T(X(s0) - 4, yLS + 4, '-F' + k.nr, { gr: 2, ausr: 'end', fett: true }) + T(X(s0) - 4, yLS + 7, k.c + k.i, { gr: 1.8, ausr: 'end' }));
      const d = RK.ger[0];
      o.push(RE(X(s0) - 4, 190, X(s0 + 2) - X(s0) + 8, 14, { fill: '#fff' }));
      o.push(T((X(s0) + X(s0 + 2)) / 2, 196, d ? (d.name || TYP[d.t].n) : '', { gr: 2.2, ausr: 'middle', fett: true }));
      o.push(T((X(s0) + X(s0 + 2)) / 2, 200.5, d ? info(d).bmk + (d.P ? ' · ' + zahl(d.P / 1000, 1) + ' kW' : '') : '', { gr: 1.8, ausr: 'middle' }));
      // N und PE
      const xn = X(s0) + 1.5, xp = X(s0 + 2) - 1.5;
      const kl3 = function (r) { const t = (RK.klemmen || []).filter(function (x) { return x.r === r; })[0]; return t ? 'X1:' + t.nr : ''; };
      o.push(L(xn, 204, xn, SL.yN, { farbe: '#1C7ED6' }) + KL(xn, 236) + T(xn - 1.5, 235.4, kl3('N'), { gr: 1.6, ausr: 'end' }) + PU(xn, SL.yN) + L(xp, 204, xp, SL.yPE, { farbe: '#2F9E44' }) + KL(xp, 236) + T(xp + 1.5, 235.4, kl3('PE'), { gr: 1.6 }) + PU(xp, SL.yPE));
      return o.join('');
    }
    // Wechselstromkreis: LS aus dem Außenleiter
    const x0 = X(s0), ph = SL.yL[k.ph] || SL.yL.L1;
    o.push(PU(x0, ph) + L(x0, ph, x0, yLS) + schliesser(x0, yLS, 11, { ls: true }) + L(x0, yLS + 11, x0, yX - 1));
    o.push(T(x0 - 3.5, yLS + 4.5, '-F' + k.nr, { gr: 2, ausr: 'end', fett: true }) + T(x0 - 3.5, yLS + 7.5, k.c + k.i, { gr: 1.8, ausr: 'end' }));
    const kl = function (r) { const t = (RK.klemmen || []).filter(function (x) { return x.r === r; })[0]; return t ? 'X1:' + t.nr : ''; };
    o.push(KL(x0, yX) + T(x0 + 1.5, yX - 1.3, kl('L'), { gr: 1.6 }));
    const letzte = X(s0 + sp.length - 1);
    o.push(L(x0, yX + 1, x0, yLine) + L(x0, yLine, letzte, yLine));
    // N- und PE-Sammellinie des Stromkreises mit Klemmen
    o.push(L(x0 - 2.5, yNl, letzte + 2.5, yNl, { farbe: '#1C7ED6' }) + L(x0 - 2.5, yNl, x0 - 2.5, SL.yN - 1, { farbe: '#1C7ED6' }) + KL(x0 - 2.5, SL.yN - 4) + PU(x0 - 2.5, SL.yN));
    o.push(T(x0 - 4, SL.yN - 3.2, kl('N'), { gr: 1.6, ausr: 'end' }));
    o.push(L(x0 + 2.5, yPEl, letzte + 3.5, yPEl, { farbe: '#2F9E44' }) + L(x0 + 2.5, yPEl, x0 + 2.5, SL.yPE, { farbe: '#2F9E44' }) + PU(x0 + 2.5, SL.yPE));
    const nAn = function (x, y) { return L(x, y, x, yNl, { farbe: '#1C7ED6' }) + PU(x, yNl); };
    const peAn = function (x, y) { return L(x, y, x, yPEl, { farbe: '#2F9E44' }) + PU(x, yPEl); };
    const lab = function (x, y, d, zus) { return T(x + 3.2, y, info(d).bmk, { gr: 1.9, fett: true }) + T(x + 3.2, y + 2.6, (zus ? zus + ' ' : '') + raumKurz(d), { gr: 1.5, farbe: '#495057' }); };
    const yLampe = 205;
    function lampeZeichnen(x, d, yVon) {
      return L(x, yVon, x, yLampe - 2.4) + lampe(x, yLampe) + lab(x, yLampe - 1, d) + L(x - 1, yLampe + 2.2, x - 1, yNl, { farbe: '#1C7ED6' }) + PU(x - 1, yNl) +
        (d.t === 'motor' ? '' : L(x + 1.2, yLampe + 2.1, x + 1.2, yPEl, { farbe: '#2F9E44' }) + PU(x + 1.2, yPEl));
    }
    const lsLinie = {};   // Gruppe → x der ersten Lampe, für Verbindungslinie
    sp.forEach(function (c, i) {
      const x = X(s0 + i);
      if (i > 0 && c.art !== 'kontakt' && c.art !== 'lampe' && !(c.art === 'roll' && c.teil === 1) && !(c.art === 'serie' && c.teil === 1)) o.push(PU(x, yLine) + L(x, yLine, x, 80));
      else if (i === 0) o.push(L(x, yLine, x, 80));
      if (c.art === 'verbr') {
        const d = c.d;
        if (d.t === 'sd' || d.t === 'sd400') {
          o.push(L(x, 80, x, 196) + RE(x - 3, 196, 6, 6, { fill: '#fff' }) + T(x, 200.3, d.anz > 1 ? d.anz + '×' : '', { gr: 1.8, ausr: 'middle' }) + lab(x, 197, d, d.ip ? 'IP44' : '') + nAn(x - 1.5, 202) + peAn(x + 1.5, 202));
        } else {
          o.push(L(x, 80, x, 196) + RE(x - 3.5, 196, 7, 7, { fill: '#fff' }) + T(x, 200.8, (d.name || '~').slice(0, 3), { gr: 1.7, ausr: 'middle' }) + lab(x, 197, d, d.P ? zahl(d.P / 1000, 1) + ' kW' : '') + nAn(x - 1.5, 203) + peAn(x + 1.5, 203));
        }
      } else if (c.art === 'gruppe') {
        const G = c.G, kette = G.kette || [];
        let y = 84;
        o.push(T(x - 3.5, 82.5, G.b, { gr: 2.6, fett: true, ausr: 'end', farbe: '#2B7BB9' }));
        if (G.art === 'aus' || G.art === 'dimmer') {
          const d = kette[0];
          o.push(L(x, 80, x, 120) + schliesser(x, 120, 12) + lab(x, 124, d, G.art === 'dimmer' ? 'Dimmer' : ''));
          if (G.art === 'dimmer') o.push(RE(x - 4.5, 121, 3, 9, { st: 0.25 }) + L(x - 5, 129, x - 1.5, 122, { st: 0.25 }));
          y = 132;
        } else if (G.art === 'wechsel' || G.art === 'kreuz') {
          const n = kette.length, h = Math.min(18, 100 / n);
          y = 86;
          kette.forEach(function (d, j) {
            if (j === 0) { o.push(L(x, 80, x, y) + wechsler(x, y, h, false) + lab(x + 2, y + 2, d)); }
            else if (j === n - 1) { o.push(wechsler(x, y, h, true) + lab(x + 2, y + h - 3, d)); }
            else { o.push(kreuzer(x, y, h) + lab(x + 2.5, y + h / 2, d)); }
            y += h;
            if (j < n - 1) { o.push(L(x - 2.5, y, x - 2.5, y + 3) + L(x + 2.5, y, x + 2.5, y + 3)); y += 3; }
          });
        } else if (G.art === 'bwm') {
          const d = G.bwm[0];
          o.push(L(x, 80, x, 118) + RE(x - 3.5, 118, 7, 12, { fill: '#fff' }) + T(x, 125, 'BWM', { gr: 1.6, ausr: 'middle' }) + lab(x + 1, 122, d));
          o.push(L(x - 3.5, 127, x - 5.5, 127) + L(x - 5.5, 127, x - 5.5, yNl, { farbe: '#1C7ED6' }) + PU(x - 5.5, yNl));
          G.bwm.slice(1).forEach(function () { /* parallele Melder sind im Plan durch die Anzahl vermerkt */ });
          if (G.bwm.length > 1) o.push(T(x, 133, G.bwm.length + ' Melder parallel', { gr: 1.4, ausr: 'middle' }));
          y = 130;
        } else y = 80;
        const erste = G.lampen[0];
        if (erste) { o.push(lampeZeichnen(x, erste, y)); lsLinie[G.id] = { x: x, y: 182 }; if (G.lampen.length > 1) o.push(PU(x, 182)); }
        else o.push(L(x, y, x, y + 4) + T(x, y + 7, 'ohne Leuchte', { gr: 1.5, ausr: 'middle', farbe: '#C92A2A' }));
      } else if (c.art === 'lampe') {
        const v = lsLinie[c.G.id];
        if (v) { o.push(L(v.x, v.y, x, v.y) + PU(x, v.y) + lampeZeichnen(x, c.d, v.y)); }
      } else if (c.art === 'serie') {
        const G = c.G, d = c.d;
        if (c.teil === 0) {
          o.push(L(x, 80, x, 112) + schliesser(x, 118, 12) + L(x, 112, x, 118) + T(x - 3.5, 82.5, G.b, { gr: 2.6, fett: true, ausr: 'end', farbe: '#2B7BB9' }) + lab(x, 122, d, 'Serie'));
          if (c.G2) { const xb = X(s0 + i + 1 + G.lampen.length - 1); o.push(PU(x, 112) + L(x, 112, xb, 112)); }
        } else {
          o.push(L(x, 112, x, 118) + schliesser(x, 118, 12) + T(x - 3.5, 117, G.b, { gr: 2.6, fett: true, ausr: 'end', farbe: '#2B7BB9' }));
          const erste0 = sp.indexOf(sp.filter(function (z) { return z.art === 'serie' && z.teil === 0 && z.d === c.d; })[0]); o.push(L(X(s0 + erste0) - 3.4, 124, x - 3.4, 124, { st: 0.25, strich: '1 0.8' }));
        }
        if (G.lampen[0]) { o.push(lampeZeichnen(x, G.lampen[0], 130)); lsLinie[G.id] = { x: x, y: 182 }; if (G.lampen.length > 1) o.push(PU(x, 182)); }
      } else if (c.art === 'taster') {
        const G = c.G, d = c.d, xs = X(s0 + i - c.i);
        o.push(L(x, 80, x, 112) + schliesser(x, 112, 12, { taster: true }) + lab(x, 116, d));
        if (c.i === 0) o.push(T(x - 3.5, 82.5, G.b, { gr: 2.6, fett: true, ausr: 'end', farbe: '#2B7BB9' }));
        o.push(L(x, 124, x, 150));
        if (c.i > 0) o.push(PU(x, 150) + L(xs, 150, x, 150));
        if (c.i === 0) {
          // Spule im Verteiler, über Klemme X1:T
          const kk = (RK.klemmen || []).filter(function (t) { return t.r === 'T:' + G.b; })[0];
          o.push(L(x, 150, x, 182) + KL(x, 182) + T(x + 1.5, 181, kk ? 'X1:' + kk.nr : '', { gr: 1.6 }) + L(x, 183, x, 196) + spule(x, 196) + L(x, 200.5, x, yNl, { farbe: '#1C7ED6' }) + PU(x, yNl));
          o.push(T(x + 3.5, 198.5, '-K' + k.nr, { gr: 1.9, fett: true }) + T(x + 3.5, 201.2, 'Stromstoß', { gr: 1.5 }));
          const kpos = s0 + sp.indexOf(sp.filter(function (z) { return z.art === 'kontakt' && z.G === G; })[0]) + 1;
          o.push(T(x, 207.5, '13-14 /' + ctx.nr + '.' + kpos, { gr: 1.5, ausr: 'middle', farbe: '#495057' }));
        }
      } else if (c.art === 'kontakt') {
        const G = c.G, sp0 = s0 + sp.indexOf(sp.filter(function (z) { return z.art === 'taster' && z.G === G && z.i === 0; })[0]) + 1;
        // Kontakt im Verteiler: von der LS-Abgangsseite (vor X1)
        o.push(PU(x0, 60) + L(x0, 60, x, 60) + L(x, 60, x, 86) + schliesser(x, 86, 12) + T(x + 3.2, 91, '-K' + k.nr, { gr: 1.9, fett: true }) + T(x + 3.2, 93.6, '/' + ctx.nr + '.' + sp0, { gr: 1.5, farbe: '#495057' }));
        const kk = (RK.klemmen || []).filter(function (t) { return t.r === 'LS:' + G.b; })[0];
        o.push(L(x, 98, x, 112) + KL(x, 113) + T(x + 1.5, 112, kk ? 'X1:' + kk.nr : '', { gr: 1.6 }) + L(x, 114, x, 120));
        if (G.lampen[0]) { o.push(lampeZeichnen(x, G.lampen[0], 120)); lsLinie[G.id] = { x: x, y: 182 }; if (G.lampen.length > 1) o.push(PU(x, 182)); }
      } else if (c.art === 'roll') {
        const G = c.G, d = G.jal[0], m = G.motor[0];
        if (c.teil === 0) {
          const x2 = X(s0 + i + 1);
          o.push(L(x, 80, x, 108) + PU(x, 108) + L(x, 108, x2, 108) + L(x2, 108, x2, 114) + L(x, 108, x, 114));
          o.push(schliesser(x, 114, 12) + schliesser(x2, 114, 12) + L(x - 3.4, 120, x2 - 3.4, 120, { st: 0.25, strich: '1 0.8' }));
          o.push(T(x - 3.5, 82.5, G.b, { gr: 2.6, fett: true, ausr: 'end', farbe: '#2B7BB9' }));
          if (d) o.push(lab(x2, 106, d, '↑ ↓ verriegelt'));
          o.push(T(x + 1.2, 130, '↑', { gr: 2.2 }) + T(x2 + 1.2, 130, '↓', { gr: 2.2 }));
          o.push(L(x, 126, x, 194) + L(x2, 126, x2, 194));
          const xm = (x + x2) / 2;
          o.push('<circle cx="' + xm + '" cy="' + 201 + '" r="6" fill="#fff" stroke="#000" stroke-width="0.35"/>' + T(xm, 200.5, 'M', { gr: 3, ausr: 'middle', fett: true }) + T(xm, 203.7, '1~', { gr: 1.7, ausr: 'middle' }));
          o.push(L(x, 194, xm - 3, 196) + L(x2, 194, xm + 3, 196));
          if (m) o.push(T(x2 + 3.2, 199, info(m).bmk, { gr: 1.9, fett: true }) + T(x2 + 3.2, 201.6, raumKurz(m), { gr: 1.5, farbe: '#495057' }));
          o.push(L(xm - 1.5, 206.8, xm - 1.5, yNl, { farbe: '#1C7ED6' }) + PU(xm - 1.5, yNl) + L(xm + 1.5, 206.8, xm + 1.5, yPEl, { farbe: '#2F9E44' }) + PU(xm + 1.5, yPEl));
        }
      }
    });
    return o.join('');
  }

  // ---------- Einspeisung (Hauptstromversorgung) ----------
  function einspeisungBlatt(ctx, gruppenSeiten) {
    const o = [], p = P.projekt, xs = [40, 46, 52, 58], ys = 28;
    const namen = ['L1', 'L2', 'L3', p.netz === 'TN-S' ? 'N' : p.netz === 'TT' ? 'N' : 'PEN'];
    o.push(T(36, 22, 'Hausanschluss ' + (p.netz === 'TN-C-S' ? '(TN-C)' : p.netz), { gr: 2.4, fett: true }));
    namen.forEach(function (n, i) { o.push(T(xs[i], ys - 1, n, { gr: 2, ausr: 'middle' })); o.push(L(xs[i], ys, xs[i], 84, { farbe: i === 3 ? '#1C7ED6' : '#000' })); });
    // Hausanschlusssicherungen
    xs.slice(0, 3).forEach(function (x) { o.push(RE(x - 1.5, 36, 3, 8, { fill: '#fff' }) + L(x, 36, x, 44)); });
    o.push(T(36.5, 41, '-F00', { gr: 2, ausr: 'end', fett: true }) + T(36.5, 44, 'HAK', { gr: 1.7, ausr: 'end' }));
    // Zähler
    o.push(RE(36, 54, 26, 12, { fill: '#fff' }) + T(49, 61.5, 'kWh', { gr: 2.6, ausr: 'middle', fett: true }) + T(34, 60, '-P1', { gr: 2, ausr: 'end', fett: true }));
    // PEN-Aufteilung
    if (p.netz === 'TN-C-S') { o.push(PU(58, 74) + L(58, 74, 66, 74, { farbe: '#2F9E44' }) + L(66, 74, 66, 252, { farbe: '#2F9E44' }) + T(59.5, 72.5, 'PEN → PE + N', { gr: 1.6 })); }
    else if (p.netz === 'TT') o.push(T(60, 72.5, 'Anlagenerder RA ≈ ' + zahl(p.ra, 0) + ' Ω', { gr: 1.6 }) + L(66, 252, 66, 80, { farbe: '#2F9E44' }) + T(67, 82, 'PE von Erdungsanlage', { gr: 1.5 }));
    else o.push(L(66, 30, 66, 252, { farbe: '#2F9E44' }) + T(66, 27, 'PE', { gr: 2, ausr: 'middle' }));
    // Hauptschalter
    xs.forEach(function (x) { o.push(schliesser(x, 84, 12)); });
    o.push(L(xs[0] - 3.4, 90, xs[3] - 3.4, 90, { st: 0.25, strich: '1 0.8' }) + T(34, 89, '-Q0', { gr: 2, ausr: 'end', fett: true }) + T(34, 92, 'Hauptschalter', { gr: 1.6, ausr: 'end' }));
    // Sammelschiene
    const yS = [120, 125, 130, 135], xE = RX1 - 6;
    yS.forEach(function (y, i) { o.push(PU(xs[i], y) + L(xs[i], y, xE, y, { st: 0.5, farbe: i === 3 ? '#1C7ED6' : '#000' }) + T(xE + 1, y + 0.8, ['L1', 'L2', 'L3', 'N'][i], { gr: 1.8 })); });
    o.push(L(66, 252, xE, 252, { st: 0.5, farbe: '#2F9E44' }) + T(xE + 1, 252.8, 'PE', { gr: 1.8 }));
    xs.forEach(function (x, i) { o.push(L(x, 96, x, yS[i])); });
    // Überspannungsschutz
    const xu = 78;
    [0, 1, 2, 3].forEach(function (i) { const x = xu + i * 4; o.push(PU(x, yS[i]) + L(x, yS[i], x, 150) + RE(x - 1.3, 150, 2.6, 8, { fill: '#fff' }) + L(x, 158, x, 166) + L(x, 166, xu + 14, 166)); });
    o.push(L(xu + 14, 166, xu + 14, 252, { farbe: '#2F9E44' }) + PU(xu + 14, 252) + T(xu + 6, 174, '-F0', { gr: 2, ausr: 'middle', fett: true }) + T(xu + 6, 177, 'ÜSS Typ 2', { gr: 1.6, ausr: 'middle' }));
    // RCDs
    let x = 104;
    P.rcds.forEach(function (q) {
      const pole = q.pole === 4 ? [0, 1, 2, 3] : [P.kreise.filter(function (k) { return k.rcd === q.id; })[0] ? ['L1', 'L2', 'L3'].indexOf(P.kreise.filter(function (k) { return k.rcd === q.id; })[0].ph) : 0, 3];
      pole.forEach(function (pi, j) {
        if (pi < 0) pi = 0;
        const xx = x + j * 5;
        o.push(PU(xx, yS[pi]) + L(xx, yS[pi], xx, 160) + schliesser(xx, 160, 12) + L(xx, 172, xx, 214) + '<path d="M ' + (xx - 1.3) + ' 211 L ' + xx + ' 214 L ' + (xx + 1.3) + ' 211" fill="none" stroke="#000" stroke-width="0.35"/>');
        o.push(T(xx, 218, ['L1', 'L2', 'L3', 'N'][pi], { gr: 1.6, ausr: 'middle' }));
      });
      const xr = x + (pole.length - 1) * 5;
      o.push(L(x - 3.4, 166, xr + 1, 166, { st: 0.25, strich: '1 0.8' }) + '<ellipse cx="' + (xr + 6) + '" cy="166" rx="4" ry="2.6" fill="#fff" stroke="#000" stroke-width="0.35"/>' + T(xr + 6, 167, 'IΔ', { gr: 2, ausr: 'middle' }) + L(xr + 1, 166, xr + 2, 166));
      o.push(T(x - 1, 157, '-Q' + q.nr, { gr: 2.2, fett: true }) + T(x - 1, 228, q.i + ' A / ' + q.idn + ' mA', { gr: 1.7 }) + T(x - 1, 231, 'Typ ' + (q.typ === 'EV' ? 'A + DC 6 mA' : q.typ), { gr: 1.7 }));
      const s = gruppenSeiten.filter(function (g) { return g.q === q; })[0];
      o.push(T(x - 1, 236, '→ Blatt ' + (s ? ctx.nrVon('stromlauf-' + q.id) : '–'), { gr: 1.9, fett: true }));
      x += pole.length * 5 + 14;
    });
    const ohne = P.kreise.filter(function (k) { return (!k.rcd || k.rcd === 'rcbo') && R.nachKreis[k.id] && !R.nachKreis[k.id].leer; });
    if (ohne.length) o.push(T(x, 140, 'Stromkreise ohne RCD bzw. mit FI/LS → Blatt ' + ctx.nrVon('stromlauf-ohne'), { gr: 2, fett: true }));
    o.push(T(RX0 + 4, 250, 'Hausanschluss und Zähler nach TAB des Netzbetreibers; Überspannungsschutz Typ 2 nach DIN VDE 0100-443/-534.', { gr: 1.8, farbe: '#495057' }));
    return rahmen(ctx, o.join(''));
  }

  // ---------- Übersichtsschaltplan (einpolig) ----------
  function uebersichtSeiten() {
    const sp = [];
    P.rcds.forEach(function (q) { P.kreise.filter(function (k) { return k.rcd === q.id && R.nachKreis[k.id] && !R.nachKreis[k.id].leer; }).forEach(function (k, i) { sp.push({ q: q, k: k, erste: i === 0 }); }); });
    P.kreise.filter(function (k) { return (!k.rcd || k.rcd === 'rcbo') && R.nachKreis[k.id] && !R.nachKreis[k.id].leer; }).forEach(function (k, i) { sp.push({ q: null, k: k, erste: i === 0 }); });
    const seiten = []; let s = null, breite = 0;
    sp.forEach(function (c) {
      const w = 11 + (c.erste ? 8 : 0);
      if (!s || breite + w > 300) { s = []; seiten.push(s); breite = 0; }
      s.push(c); breite += w;
    });
    if (!seiten.length) seiten.push([]);
    return seiten;
  }
  function striche(x, y, n) { let o = ''; for (let i = 0; i < n; i++) o += L(x - 1.3, y + 1.3 + i * 1.3, x + 1.3, y - 0.3 + i * 1.3, { st: 0.25 }); return o; }
  function uebersichtBlatt(seite, ctx, ersteSeite) {
    const o = [], yB = 78;
    if (ersteSeite) {
      const x = 40;
      o.push(T(x, 22, 'Hausanschluss', { gr: 2.2, ausr: 'middle', fett: true }) + L(x, 25, x, yB) + striche(x, 27, 4));
      o.push(RE(x - 3, 30, 6, 7, { fill: '#fff' }) + T(x - 4.5, 34.5, '-F00', { gr: 1.9, ausr: 'end' }));
      o.push(RE(x - 6, 42, 12, 8, { fill: '#fff' }) + T(x, 47.3, 'kWh', { gr: 2.2, ausr: 'middle' }) + T(x - 7.5, 47, '-P1', { gr: 1.9, ausr: 'end' }));
      o.push(schliesser(x, 56, 12) + T(x - 4.5, 63, '-Q0', { gr: 1.9, ausr: 'end' }) + striche(x + 2.5, 58, 4));
      o.push(L(x, yB, RX1 - 8, yB, { st: 0.7 }) + T(RX1 - 8, yB - 1.5, '3/N/PE AC 400/230 V', { gr: 1.9, ausr: 'end' }));
      o.push(PU(x + 16, yB) + L(x + 16, yB, x + 16, yB + 12) + RE(x + 14.5, yB + 12, 3, 8, { fill: '#fff' }) + L(x + 16, yB + 20, x + 16, yB + 26) + L(x + 13, yB + 26, x + 19, yB + 26, { st: 0.5 }) + T(x + 19, yB + 18, '-F0 ÜSS', { gr: 1.8 }));
    } else o.push(L(30, yB, RX1 - 8, yB, { st: 0.7 }) + T(30, yB - 1.5, 'Fortsetzung Sammelschiene', { gr: 1.8 }));
    let x = ersteSeite ? 78 : 40, qAlt = null, qStart = 0;
    seite.forEach(function (c, i) {
      const RK = R.nachKreis[c.k.id], k = c.k, K0 = RK.kabel[0];
      if (c.q !== qAlt || i === 0) {
        if (i > 0) x += 6;
        qAlt = c.q; qStart = x;
        if (c.q) {
          o.push(PU(x, yB) + L(x, yB, x, 88) + schliesser(x, 88, 12) + striche(x + 2.5, 90, c.q.pole) + '<ellipse cx="' + (x - 6) + '" cy="94" rx="3" ry="2" fill="#fff" stroke="#000" stroke-width="0.3"/>' + T(x - 6, 94.8, 'IΔ', { gr: 1.6, ausr: 'middle' }) + L(x - 3, 94, x - 1.5, 94, { st: 0.25, strich: '0.8 0.5' }));
          o.push(T(x + 3, 103, '-Q' + c.q.nr, { gr: 2, fett: true }) + T(x + 3, 106, c.q.i + 'A ' + c.q.idn + 'mA ' + (c.q.typ === 'EV' ? 'A-EV' : c.q.typ), { gr: 1.5 }));
          o.push(L(x, 100, x, 112));
        } else o.push(PU(x, yB) + L(x, yB, x, 112));
      }
      // Abzweig zum Leitungsschutzschalter
      const xx = x;
      const naechste = seite[i + 1];
      if (naechste && naechste.q === c.q) o.push(L(xx, 112, xx + 11, 112));
      o.push(PU(xx, 112) + L(xx, 112, xx, 118) + schliesser(xx, 118, 11, { ls: true }) + (RK.drei ? striche(xx + 2.3, 120, 3) : ''));
      o.push(T(xx + 1.8, 133.5, '-F' + k.nr, { gr: 1.9, fett: true }) + T(xx + 1.8, 136.3, (k.rcd === 'rcbo' ? 'FI/LS ' : '') + k.c + k.i, { gr: 1.7 }));
      o.push(L(xx, 129, xx, 150) + striche(xx, 140, K0 ? K0.adern : 3));
      if (RK.ss) o.push(RE(xx - 2.5, 150, 5, 5, { fill: '#fff' }) + T(xx, 153.3, 'K', { gr: 1.7, ausr: 'middle' }));
      o.push(L(xx, RK.ss ? 155 : 150, xx, 162));
      o.push(T(xx + 1, 165, (K0 ? K0.typ + ' ' + K0.adern + '×' + zahl(RK.a, RK.a % 1 ? 1 : 0) : '') + '  ' + zahl(RK.lGesamt, 0) + ' m', { gr: 1.8, dreh: 90 }));
      o.push(T(xx + 1, 207, k.name, { gr: 2, dreh: 90, fett: true }));
      const raeume = raeumeVon(P, RK.ger).map(function (id) { return raumNach(id).name; }).join(', ');
      o.push(T(xx - 3, 207, (k.ph === '3' ? 'L1 L2 L3' : k.ph) + '  ΔU ' + zahl(RK.du, 1) + ' %', { gr: 1.6, dreh: 90, farbe: '#495057' }));
      o.push(T(xx + 4, 207, raeume.length > 40 ? raeume.slice(0, 39) + '…' : raeume, { gr: 1.5, dreh: 90, farbe: '#495057' }));
      x += 11;
      void qStart;
    });
    o.push(T(RX0 + 4, 255, 'Striche an der Linie = Anzahl der Leiter. ΔU = Spannungsfall bis zum entferntesten Verbraucher bei Bemessungsstrom.', { gr: 1.8, farbe: '#495057' }));
    return rahmen(ctx, o.join(''));
  }

  // ---------- Verteiler-Aufbau und Klemmenplan ----------
  function klemmZeilen() {
    const z = [];
    P.kreise.forEach(function (k) {
      const RK = R.nachKreis[k.id]; if (!RK || RK.leer || !RK.klemmen) return;
      RK.klemmen.forEach(function (t, i) {
        const K = t.K, ziel = K.nach.name + (K.nach.d ? ' (' + raumKurz(K.nach.d) + ')' : K.nach.dose && K.nach.dose.raum ? ' (' + K.nach.dose.raum.name + ')' : '');
        const intern = t.r === 'N' ? '-Q' + ((P.rcds.filter(function (q) { return q.id === k.rcd; })[0] || {}).nr || '?') + ' N' : t.r === 'PE' ? 'PE-Schiene' : t.r.indexOf('T:') === 0 ? '-K' + k.nr + ' A1' : t.r.indexOf('LS:') === 0 ? '-K' + k.nr + ' 14' : '-F' + k.nr + (RK.drei ? ' ' + t.r : ' 2');
        z.push(['X1:' + t.nr, ROLLE(t.r), i === 0 ? '-F' + k.nr : '', intern, K.bmk, FNAME[t.a.f] + (t.a.kennz ? ' *' : ''), ziel]);
      });
    });
    return z;
  }
  function verteilerBlatt(ctx, zeilen, start, mitAufbau) {
    const o = [], te = verteilerTE(P, R);
    let tabX = RX0 + 4;
    if (mitAufbau) {
      const w = 11.5, h = Math.max(22, Math.min(42, (SF - 50) / te.reihen.length - 8)), x0 = RX0 + 8;
      o.push(T(x0, 20, 'Verteiler -UV, Ansicht (Teilungseinheiten 18 mm, Maßstab ca. 1:1,5)', { gr: 2.4, fett: true }));
      te.reihen.forEach(function (reihe, ri) {
        const y = 26 + ri * (h + 8);
        o.push(RE(x0 - 2, y - 2, 12 * w + 4, h + 4, { st: 0.25, fill: '#F8F9FA' }) + L(x0 - 2, y + h / 2, x0 + 12 * w + 2, y + h / 2, { st: 0.6, farbe: '#ADB5BD' }));
        let x = x0;
        reihe.forEach(function (t) {
          const fill = t.art === 'rcd' ? '#E7F5FF' : t.art === 'haupt' ? '#FFF3BF' : t.art === 'uess' ? '#FFE8CC' : t.art === 'ss' ? '#F3F0FF' : '#fff';
          o.push(RE(x + 0.3, y, t.te * w - 0.6, h, { fill: fill, rx: 0.8 }));
          o.push(T(x + t.te * w / 2, y + 4, t.bmk, { gr: 2.2, fett: true, ausr: 'middle' }));
          if (t.te >= 2) { o.push(T(x + t.te * w / 2, y + 8, t.text.slice(0, t.te * 6), { gr: 1.6, ausr: 'middle' })); }
          else o.push(T(x + w / 2 + 0.6, y + 7, t.text.slice(0, Math.floor((h - 8) / 0.9)), { gr: 1.6, dreh: 90 }));
          x += t.te * w;
        });
        o.push(T(x0 + 12 * w + 4, y + h / 2, 'Reihe ' + (ri + 1), { gr: 1.8 }));
      });
      const yk = 26 + te.reihen.length * (h + 8);
      if (yk + 14 < SF - 4) {
        o.push(T(x0, yk + 2, 'Reihenklemmen X1 (' + zeilen.length + ' Klemmen) – Belegung siehe Tabelle', { gr: 2 }));
        o.push(RE(x0 - 2, yk + 4, 12 * w + 4, 8, { st: 0.25, fill: '#F8F9FA' }));
        const n = Math.min(zeilen.length, 60), tw = (12 * w) / Math.max(n, 1);
        for (let i = 0; i < n; i++) { const r = zeilen[i][1]; o.push(RE(x0 + i * tw, yk + 5, Math.max(tw - 0.3, 0.5), 6, { fill: r === 'PE' ? '#D3F9D8' : r === 'N' ? '#D0EBFF' : '#E9ECEF', st: 0.15 })); }
      }
      tabX = x0 + 12 * w + 22;
    }
    const sp = [['Klemme', 16], ['Potential', 18], ['Stromkreis', 15], ['intern von', 22], ['Kabel', 16], ['Ader', 12], ['Ziel', 0]];
    const breite = RX1 - 4 - tabX;
    sp[6][1] = breite - sp.slice(0, 6).reduce(function (s, x) { return s + x[1]; }, 0);
    o.push(T(tabX, 20, start ? 'Klemmenplan X1 (Fortsetzung)' : 'Klemmenplan X1', { gr: 2.6, fett: true }));
    o.push(tabelle(tabX, 24, sp, zeilen, 4.4));
    o.push(T(tabX, SF - 3, '* blaue Ader nicht als N verwendet: an beiden Enden schwarz oder braun kennzeichnen.', { gr: 1.6, farbe: '#495057' }));
    return rahmen(ctx, o.join(''));
  }
  function tabelle(x, y, spalten, zeilen, zh) {
    const o = []; let xx = x;
    const w = spalten.reduce(function (s, c) { return s + c[1]; }, 0);
    o.push(RE(x, y, w, zh, { fill: '#E9ECEF', st: 0.3 }));
    spalten.forEach(function (c) { o.push(T(xx + 1, y + zh * 0.72, c[0], { gr: Math.min(2.2, zh * 0.5), fett: true })); xx += c[1]; });
    zeilen.forEach(function (z, i) {
      const yy = y + zh * (i + 1);
      if (i % 2) o.push(RE(x, yy, w, zh, { fill: '#F8F9FA', st: 0 }));
      xx = x;
      spalten.forEach(function (c, j) {
        let t = String(z[j] === undefined || z[j] === null ? '' : z[j]);
        const max = Math.floor(c[1] / (zh * 0.44));
        if (t.length > max) t = t.slice(0, Math.max(1, max - 1)) + '…';
        o.push(T(xx + 1, yy + zh * 0.72, t, { gr: Math.min(2.1, zh * 0.48), ausr: c[2] || null }));
        xx += c[1];
      });
      o.push(L(x, yy + zh, x + w, yy + zh, { st: 0.12, farbe: '#ADB5BD' }));
    });
    o.push(RE(x, y, w, zh * (zeilen.length + 1), { st: 0.3 }));
    return o.join('');
  }

  // ---------- Dosenverdrahtung ----------
  const ZH = 3.6;
  function doseHoehe(o) { const n = o.kabel.reduce(function (s, x) { return s + x.K.ader.length; }, 0); return 12 + Math.max(n, (o.klemmen || []).length * 2) * ZH + (o.reserve.length ? 5 : 0); }
  function doseKarte(o, x0, y0, w) {
    const s = [], h = doseHoehe(o);
    s.push(RE(x0, y0, w, h, { fill: '#fff', rx: 1.5, st: 0.4 }));
    s.push(T(x0 + 2, y0 + 4.5, o.bmk + '  ·  -F' + o.kreis.nr + ' ' + o.kreis.name, { gr: 2.4, fett: true }));
    s.push(T(x0 + 2, y0 + 8.3, 'Raum ' + (o.raum ? o.raum.name : '–') + ' · ' + (o.klemmen || []).filter(function (k) { return !k.einzeln; }).length + ' Verbindungsklemmen', { gr: 1.7, farbe: '#495057' }));
    let y = y0 + 12;
    const xA = x0 + 52, xK = x0 + w - 26;
    const zeile = {};   // Ader → y
    o.kabel.forEach(function (x) {
      const K = x.K, gegen = x.ein ? K.von : K.nach;
      s.push(T(x0 + 2, y + 2.6, K.bmk + ' ' + K.typ + ' ' + K.adern + '×' + zahl(K.aEff, K.aEff % 1 ? 1 : 0), { gr: 1.8, fett: true }));
      s.push(T(x0 + 2, y + 2.6 + ZH, (x.ein ? 'von ' : 'zu ') + gegen.name + (gegen.d ? ' ' + TYP[gegen.d.t].n.replace(' (Stromstoß)', '') : ''), { gr: 1.5, farbe: '#495057' }));
      K.ader.forEach(function (a, i) {
        const yy = y + ZH * i + ZH / 2;
        zeile[K.bmk + i] = yy;
        const c = FARBE[a.f];
        s.push(L(xA - 10, yy, xA, yy, { farbe: c, st: 1.1 }) + (a.f === 'gnge' ? L(xA - 10, yy, xA, yy, { farbe: '#FAB005', st: 1.1, strich: '1.2 1.2' }) : ''));
        s.push(T(xA - 11, yy + 0.7, FNAME[a.f] + (a.kennz ? '*' : ''), { gr: 1.5, ausr: 'end' }));
        if (a.r === 'R') s.push(T(xA + 1.5, yy + 0.6, 'Reserve', { gr: 1.4, farbe: '#868E96' }));
      });
      y += ZH * K.ader.length;
      s.push(L(x0 + 2, y, x0 + w - 2, y, { st: 0.1, farbe: '#DEE2E6' }));
    });
    // Klemmen rechts, gleichmäßig verteilt
    const kl = o.klemmen || [], n = kl.length, hRaum = y - (y0 + 12);
    kl.forEach(function (k, i) {
      const yk = y0 + 12 + (i + 0.5) * hRaum / Math.max(n, 1), hk = Math.max(3, Math.min(hRaum / n - 1, k.adern.length * 1.8));
      const farbe = k.r === 'PE' ? '#2F9E44' : k.r === 'N' ? '#1C7ED6' : '#343A40';
      k.adern.forEach(function (a, j) {
        const ya = zeile[a.K.bmk + a.i], c = FARBE[a.a.f];
        if (ya === undefined) return;
        const yz = yk - hk / 2 + hk * (j + 0.5) / k.adern.length;
        s.push('<path d="M ' + runde(xA, 2) + ' ' + runde(ya, 2) + ' C ' + runde(xA + 22, 2) + ' ' + runde(ya, 2) + ' ' + runde(xK - 22, 2) + ' ' + runde(yz, 2) + ' ' + runde(xK, 2) + ' ' + runde(yz, 2) + '" fill="none" stroke="' + c + '" stroke-width="0.55"/>');
        if (a.a.f === 'gnge') s.push('<path d="M ' + runde(xA, 2) + ' ' + runde(ya, 2) + ' C ' + runde(xA + 22, 2) + ' ' + runde(ya, 2) + ' ' + runde(xK - 22, 2) + ' ' + runde(yz, 2) + ' ' + runde(xK, 2) + ' ' + runde(yz, 2) + '" fill="none" stroke="#FAB005" stroke-width="0.55" stroke-dasharray="1 1"/>');
      });
      s.push(RE(xK, yk - hk / 2, 4, hk, { fill: k.einzeln ? '#FFF5F5' : '#F1F3F5', farbe: farbe, st: 0.4, rx: 0.6 }));
      s.push(T(xK + 5.5, yk + 0.7, 'K' + k.nr + ' ' + ROLLE(k.r), { gr: 1.7, fett: true, farbe: farbe }));
      s.push(T(xK + 5.5, yk + 3, k.einzeln ? 'nur 1 Ader' : k.adern.length + '-polig', { gr: 1.3, farbe: '#868E96' }));
    });
    if (o.reserve.length) s.push(T(x0 + 2, y0 + h - 2, 'Reserve isoliert ablegen: ' + o.reserve.map(function (r) { return r.K.bmk + ' ' + FNAME[r.a.f]; }).join(', '), { gr: 1.5, farbe: '#495057' }));
    return s.join('');
  }
  function dosenSeiten() {
    const seiten = []; let s = null, spalte = 0;
    const W = 126, G = 3, hMax = SF - 4 - 16;
    const hoehen = [0, 0, 0];
    R.dosen.forEach(function (o) {
      const h = doseHoehe(o);
      if (!s) { s = []; seiten.push(s); hoehen[0] = hoehen[1] = hoehen[2] = 0; }
      spalte = hoehen.indexOf(Math.min.apply(null, hoehen));
      if (hoehen[spalte] + h > hMax) { s = []; seiten.push(s); hoehen[0] = hoehen[1] = hoehen[2] = 0; spalte = 0; }
      s.push({ o: o, x: RX0 + 4 + spalte * (W + G), y: 18 + hoehen[spalte], w: W });
      hoehen[spalte] += h + G;
    });
    return seiten;
  }
  function dosenBlatt(seite, ctx) {
    const o = [T(RX0 + 4, 15.5, 'Verdrahtung der Abzweigdosen – je Ader die Verbindungsklemme', { gr: 2.4, fett: true })];
    seite.forEach(function (c) { o.push(doseKarte(c.o, c.x, c.y, c.w)); });
    o.push(T(RX0 + 4, SF - 2.5, 'Aderfarben nach DIN VDE 0293-308. * blaue Ader nicht als N: an beiden Enden schwarz/braun kennzeichnen. L′ = geschaltete Phase, Korr. = korrespondierende Leitung.', { gr: 1.6, farbe: '#495057' }));
    return rahmen(ctx, o.join(''));
  }

  // ---------- Installationsplan (Bauplan als Blatt) ----------
  const MASSSTAEBE = [20, 25, 50, 75, 100, 125, 150, 200, 250, 500, 1000];
  function bauplanBlatt(G, ctx) {
    const o = [], rs = P.raeume.filter(function (r) { return r.g === G.id; }), ds = P.geraete.filter(function (d) { return d.g === G.id; });
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rs.forEach(function (r) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.l); });
    ds.forEach(function (d) { x0 = Math.min(x0, d.x - 0.5); y0 = Math.min(y0, d.y - 0.5); x1 = Math.max(x1, d.x + 0.5); y1 = Math.max(y1, d.y + 0.5); });
    if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 10; y1 = 8; }
    const fx0 = RX0 + 6, fy0 = RY0 + 8, fw = 300 - fx0 - 6, fh = SF - fy0 - 6;
    const mass = MASSSTAEBE.filter(function (m) { return (x1 - x0) * 1000 / m <= fw && (y1 - y0) * 1000 / m <= fh; })[0] || 1000;
    const f = 1000 / mass;   // mm je m
    const ox = fx0 + (fw - (x1 - x0) * f) / 2 - x0 * f, oy = fy0 + (fh - (y1 - y0) * f) / 2 - y0 * f;
    const Sz = Math.max(3.2, Math.min(6.5, P.projekt.symbol * f));
    o.push(T(RX0 + 4, 15.5, 'Installationsplan ' + G.name + ' · Maßstab 1:' + mass + (P.projekt.format === 'A4' ? ' (auf A3 bezogen)' : ''), { gr: 2.6, fett: true }));
    const b = bildLaden(G.id);
    if (b && G.bildB) o.push('<image href="' + b + '" x="' + runde(ox + G.bildX * f, 2) + '" y="' + runde(oy + G.bildY * f, 2) + '" width="' + runde(G.bildB * f, 2) + '" preserveAspectRatio="xMinYMin meet" opacity="' + Math.min(0.5, G.bildDeck) + '"/>');
    rs.forEach(function (r) {
      o.push(RE(ox + r.x * f, oy + r.y * f, r.w * f, r.l * f, { st: 0.9, fill: 'rgba(248,249,250,.6)' }));
      o.push(T(ox + (r.x + r.w / 2) * f, oy + (r.y + r.l * 0.28) * f, r.name, { gr: 2.6, ausr: 'middle', fett: true, farbe: '#495057' }));
      o.push(T(ox + (r.x + r.w / 2) * f, oy + (r.y + r.l * 0.28) * f + 3.3, zahl(r.w, 2) + ' × ' + zahl(r.l, 2) + ' m · ' + zahl(flaeche(r), 1) + ' m²', { gr: 1.7, ausr: 'middle', farbe: '#868E96' }));
    });
    // Leitungen dünn
    R.kabel.forEach(function (K) {
      if (K.von.g !== G.id || K.nach.g !== G.id) return;
      o.push('<path d="M ' + runde(ox + K.von.x * f, 2) + ' ' + runde(oy + K.von.y * f, 2) + ' H ' + runde(ox + K.nach.x * f, 2) + ' V ' + runde(oy + K.nach.y * f, 2) + '" fill="none" stroke="' + kreisFarbe(K.kreis) + '" stroke-width="0.25"' + (K.art === 'zu' || K.art === 'kette' ? '' : ' stroke-dasharray="1.2 0.8"') + '/>');
    });
    R.dosen.forEach(function (d) { if (d.g === G.id) o.push('<g transform="translate(' + runde(ox + d.x * f, 2) + ' ' + runde(oy + d.y * f, 2) + ') scale(' + runde(Sz, 2) + ')" color="' + kreisFarbe(d.kreis) + '">' + sym('dose') + '</g>' + T(ox + d.x * f + Sz * 0.3, oy + d.y * f - Sz * 0.3, d.bmk, { gr: 1.4, farbe: kreisFarbe(d.kreis) })); });
    ds.forEach(function (d) {
      const info = R.geraetInfo[d.id], k = kreisVon(d.k), w = TYP[d.t].wand ? WINKEL[d.rot] : 0;
      o.push('<g transform="translate(' + runde(ox + d.x * f, 2) + ' ' + runde(oy + d.y * f, 2) + ') scale(' + runde(Sz, 2) + ') rotate(' + w + ')" color="#000">' + sym(d.t, info && info.rolle, { winkel: w, anz: d.anz, name: d.name }) + '</g>');
      if (k || d.ip) {
        const r = TYP[d.t].wand ? RICHT[d.rot] : [0.7, -0.7], ab = TYP[d.t].wand ? 1.4 : 0.8;
        const lx = ox + d.x * f + r[0] * Sz * ab + (TYP[d.t].wand && r[0] === 0 ? Sz * 0.6 : 0), ly = oy + d.y * f + r[1] * Sz * ab + (TYP[d.t].wand && r[1] === 0 ? -Sz * 0.6 : 0);
        o.push(T(lx, ly + 0.6, (k ? k.nr + (d.gr || '') + (d.t === 'serie' && d.gr2 ? '/' + d.gr2 : '') : '') + (d.ip ? ' IP44' : ''), { gr: 1.6, ausr: 'middle', fett: true, farbe: kreisFarbe(k) }));
      }
    });
    // Legende
    const lx = 306;
    o.push(L(300, RY0, 300, SF, { st: 0.5 }));
    o.push(T(lx, 16, 'Legende', { gr: 2.6, fett: true }));
    const arten = [];
    ds.forEach(function (d) { const info = R.geraetInfo[d.id], rolle = info ? info.rolle : '', key = d.t + '|' + (d.t === 'schalter' ? rolle : ''); if (arten.map(function (a) { return a.key; }).indexOf(key) < 0) arten.push({ key: key, t: d.t, rolle: rolle }); });
    arten.push({ key: 'dose', t: 'dose', rolle: '' });
    let y = 22;
    arten.forEach(function (a) {
      if (y > SF - 30) return;
      const name = a.t === 'schalter' || a.t === 'dimmer' ? ({ aus: 'Ausschalter', dimmer: 'Dimmer', wdimmer: 'Wechsel-Dimmer', w1: 'Wechselschalter', w2: 'Wechselschalter', kreuz: 'Kreuzschalter' }[a.rolle] || TYP[a.t].n) : TYP[a.t].n;
      if (arten.filter(function (b) { return b !== a && b.y && b.name === name; }).length) return;
      a.y = y; a.name = name;
      const w = TYP[a.t].wand ? 0 : 0;
      o.push('<g transform="translate(' + (lx + 4) + ' ' + (y + (TYP[a.t].wand ? 2.5 : 0)) + ') scale(4.2) rotate(' + w + ')" color="#000">' + sym(a.t, a.rolle, { anz: 1 }) + '</g>');
      o.push(T(lx + 11, y + 0.8, name, { gr: 2 }));
      y += 7;
    });
    y += 2;
    o.push(T(lx, y, 'Beschriftung „3a“ = Stromkreis -F3, Schaltgruppe a', { gr: 1.6 })); y += 3.5;
    o.push(T(lx, y, 'Linien: Zuleitung (voll), Geräteleitung (gestrichelt);', { gr: 1.6 })); y += 3;
    o.push(T(lx, y, 'vereinfacht, Verlauf in den Installationszonen', { gr: 1.6 })); y += 3;
    o.push(T(lx, y, 'nach DIN 18015-3 (waagerecht 15–45 cm unter', { gr: 1.6 })); y += 3;
    o.push(T(lx, y, 'Decke, senkrecht zu den Auslässen).', { gr: 1.6 })); y += 5;
    o.push(T(lx, y, 'Höhen (Mitte über OKFF):', { gr: 1.8, fett: true })); y += 3.5;
    [['Schalter, Taster', '1,05 m'], ['Steckdosen', '0,30 m'], ['über Arbeitsplatte', '1,15 m'], ['Abzweigdosen', (G.raum - 0.3).toFixed(2).replace('.', ',') + ' m']].forEach(function (z) { o.push(T(lx, y, z[0], { gr: 1.6 }) + T(RX1 - 4, y, z[1], { gr: 1.6, ausr: 'end' })); y += 3; });
    // Maßstabsleiste
    const ml = f * (mass >= 200 ? 5 : mass >= 100 ? 2 : 1), mt = mass >= 200 ? '5 m' : mass >= 100 ? '2 m' : '1 m';
    o.push(RE(fx0, SF - 6, ml, 1.6, { fill: '#000' }) + T(fx0 + ml + 2, SF - 4.6, mt, { gr: 1.8 }));
    return rahmen(ctx, o.join(''));
  }

  // ---------- Deckblatt mit Inhalt ----------
  function deckblatt(ctx, inhalt) {
    const p = P.projekt, o = [];
    o.push(T(RX0 + 14, 40, 'Elektroplanung', { gr: 9, fett: true }));
    o.push(T(RX0 + 14, 52, p.name || 'Projekt', { gr: 5.5 }));
    o.push(T(RX0 + 14, 61, [p.kunde, p.adresse].filter(Boolean).join(' · '), { gr: 3.2, farbe: '#495057' }));
    const zr = [['Netzsystem', p.netz], ['Stromkreise', String(R.kreise.filter(function (k) { return !k.leer; }).length)], ['Fehlerstrom-Schutzschalter', String(P.rcds.length)], ['Abzweigdosen', String(R.dosen.length)], ['Leitung gesamt', zahl(R.kabel.reduce(function (s, K) { return s + K.laenge; }, 0), 0) + ' m'], ['Plan-Stand', p.datum + (p.revision ? ', Index ' + p.revision : '')]];
    zr.forEach(function (z, i) { o.push(T(RX0 + 14, 78 + i * 6, z[0], { gr: 2.8, farbe: '#495057' }) + T(RX0 + 70, 78 + i * 6, z[1], { gr: 2.8, fett: true })); });
    o.push(T(220, 40, 'Inhalt', { gr: 4, fett: true }));
    inhalt.forEach(function (z, i) { if (i < 34) o.push(T(220, 48 + i * 5.6, z[1], { gr: 2.6 }) + T(RX1 - 10, 48 + i * 5.6, 'Blatt ' + z[0], { gr: 2.6, ausr: 'end' })); });
    const w = R.warn.filter(function (x) { return x.stufe === 'fehler'; }).length;
    const hw = R.warn.length - w;
    o.push(T(RX0 + 14, 128, w ? w + ' offene Prüfpunkte' + (hw ? ' und ' + hw + ' Hinweise' : '') + ' – siehe Blatt „Prüfhinweise“.' : 'Rechnerische Prüfungen bestanden' + (hw ? ' (' + hw + ' Hinweis' + (hw > 1 ? 'e' : '') + ' auf Blatt „Prüfhinweise“).' : '.'), { gr: 3, fett: true, farbe: w ? '#C92A2A' : '#2F9E44' }));
    const hinweise = ['Kennzeichnung nach DIN EN 81346: -F Leitungsschutz, -Q Schalter/RCD, -K Relais, -S Schalter/Taster,', '-E Leuchte/Gerät, -XD Steckdose, -B Melder, -M Motor, -W Leitung, X1 Reihenklemmen im Verteiler, AD Abzweigdose.', 'Spannungsfall nach DIN 18015-1 (≤ 3 % ab Verteiler, κ = 56 m/Ωmm²), Strombelastbarkeit nach DIN VDE 0298-4,', 'Abschaltbedingung nach DIN VDE 0100-410 (Zs ≤ U0/Ia; Leitertemperatur 80 °C). Leitungslängen sind Schätzwerte', 'aus dem Plan (rechtwinklig in Installationszonen, plus 0,3 m je Leitung). Vor Ort aufmessen und nach', 'Fertigstellung nach DIN VDE 0100-600 prüfen und messen. Planung ersetzt keine Fachplanung.'];
    hinweise.forEach(function (t, i) { o.push(T(RX0 + 14, 150 + i * 5, t, { gr: 2.4, farbe: '#343A40' })); });
    return rahmen(ctx, o.join(''));
  }

  // ---------- Listen als Blätter ----------
  function listenSeiten(titel, spalten, zeilen, zh) {
    const pro = Math.floor((SF - 26) / zh) - 1, seiten = [];
    for (let i = 0; i < Math.max(1, zeilen.length); i += pro) seiten.push({ titel: titel, spalten: spalten, zeilen: zeilen.slice(i, i + pro), zh: zh, teil: i / pro });
    return seiten;
  }
  function listenBlatt(s, ctx) {
    return rahmen(ctx, T(RX0 + 4, 17, s.titel + (s.teil ? ' (Fortsetzung)' : ''), { gr: 3, fett: true }) + tabelle(RX0 + 4, 21, s.spalten, s.zeilen, s.zh));
  }
  function kreisZeilen() {
    return P.kreise.map(function (k) {
      const RK = R.nachKreis[k.id]; if (!RK || RK.leer) return null;
      const q = P.rcds.filter(function (x) { return x.id === k.rcd; })[0];
      return ['-F' + k.nr, k.name, raeumeVon(P, RK.ger).map(function (id) { return raumNach(id).name; }).join(', '), (k.rcd === 'rcbo' ? 'FI/LS ' : '') + k.c + k.i, q ? '-Q' + q.nr : k.rcd === 'rcbo' ? 'FI/LS' : '–', k.ph === '3' ? 'L1-L3' : k.ph, k.typ + ' ' + (RK.kabel[0] ? RK.kabel[0].adern : 3) + '×' + zahl(RK.a, RK.a % 1 ? 1 : 0), zahl(RK.lGesamt, 1) + ' m', zahl(RK.du, 2) + ' %', zahl(RK.zs, 2) + ' Ω', RK.ger.length];
    }).filter(Boolean);
  }
  const KREIS_SPALTEN = [['Nr.', 14], ['Bezeichnung', 70], ['Räume', 86], ['Schutz', 22], ['RCD', 14], ['Außenl.', 15], ['Leitung', 32], ['Länge', 18, 'end'], ['ΔU', 18, 'end'], ['Zs', 18, 'end'], ['Geräte', 15, 'end']];
  function kabelZeilen() { return R.kabel.map(function (K) { return [K.bmk, '-F' + K.kreis.nr, K.typ + ' ' + K.adern + '×' + zahl(K.aEff, K.aEff % 1 ? 1 : 0), K.von.name + (K.von.dose && K.von.dose.raum ? ' (' + K.von.dose.raum.name + ')' : ''), K.nach.name + (K.nach.d ? ' ' + TYP[K.nach.d.t].n + ' (' + raumKurz(K.nach.d) + ')' : K.nach.dose && K.nach.dose.raum ? ' (' + K.nach.dose.raum.name + ')' : ''), zahl(Math.ceil(K.laenge * 2) / 2, 1) + ' m', K.ader.map(function (a) { return FNAME[a.f] + '=' + ROLLE(a.r); }).join('  ')]; }); }
  const KABEL_SPALTEN = [['Kabel', 18], ['Kreis', 12], ['Typ', 30], ['von', 38], ['nach', 72], ['Länge', 16, 'end'], ['Adern', 196]];
  function stueckZeilen() { return R.stueck.map(function (s) { return [s.gruppe, s.name, s.n, s.e]; }); }
  const STUECK_SPALTEN = [['Gruppe', 62], ['Artikel', 238], ['Menge', 30, 'end'], ['Einheit', 20]];
  function warnZeilen() { return R.warn.map(function (w) { return [w.stufe === 'fehler' ? 'Prüfen' : 'Hinweis', w.text]; }); }

  // ---------- Planmappe: alle Blätter mit Nummern ----------
  function planMappe() {
    const teile = [];
    const add = function (key, titel, unter, render) { teile.push({ key: key, titel: titel, unter: unter, render: render }); };
    add('deck', 'Deckblatt und Inhalt', '', null);
    P.geschosse.forEach(function (G) { add('bauplan-' + G.id, 'Installationsplan', G.name, function (ctx) { return bauplanBlatt(G, ctx); }); });
    uebersichtSeiten().forEach(function (s, i) { add(i ? 'uebersicht-' + i : 'uebersicht', 'Übersichtsschaltplan', i ? 'Fortsetzung' : 'Verteiler -UV', function (ctx) { return uebersichtBlatt(s, ctx, i === 0); }); });
    const sl = stromlaufSeiten();
    add('einspeisung', 'Stromlaufplan', 'Einspeisung und RCDs', function (ctx) { return einspeisungBlatt(ctx, sl); });
    const gesehen = {};
    sl.forEach(function (s) {
      const key = s.q ? 'stromlauf-' + s.q.id : 'stromlauf-ohne';
      const k = gesehen[key] ? key + '-' + s.teil : key; gesehen[key] = 1;
      add(k, 'Stromlaufplan', (s.q ? 'Stromkreise an -Q' + s.q.nr : 'Stromkreise ohne RCD') + (s.teil > 1 ? ' (' + s.teil + ')' : ''), function (ctx) { return stromlaufBlatt(s, ctx); });
    });
    const kz = klemmZeilen(), proV = Math.floor((SF - 32) / 4.4) - 1;
    for (let i = 0; i === 0 || i < kz.length; i += proV) { const st = i; add(i ? 'verteiler-' + i : 'verteiler', 'Verteiler und Klemmenplan', i ? 'Klemmenplan, Fortsetzung' : 'Aufbau -UV, Klemmen X1', function (ctx) { return verteilerBlatt(ctx, kz.slice(st, st + proV), st, st === 0); }); }
    dosenSeiten().forEach(function (s, i) { add('dosen-' + i, 'Verdrahtungsplan', 'Abzweigdosen' + (i ? ' (' + (i + 1) + ')' : ''), function (ctx) { return dosenBlatt(s, ctx); }); });
    listenSeiten('Stromkreisliste (Verteilerbeschriftung)', KREIS_SPALTEN, kreisZeilen(), 5.6).forEach(function (s, i) { add('kreise-' + i, 'Stromkreisliste', '', function (ctx) { return listenBlatt(s, ctx); }); });
    listenSeiten('Kabelliste mit Aderbelegung', KABEL_SPALTEN, kabelZeilen(), 5).forEach(function (s, i) { add('kabel-' + i, 'Kabelliste', '', function (ctx) { return listenBlatt(s, ctx); }); });
    listenSeiten('Stückliste (Mengen gerundet, Leitungen +10 %)', STUECK_SPALTEN, stueckZeilen(), 5).forEach(function (s, i) { add('stueck-' + i, 'Stückliste', '', function (ctx) { return listenBlatt(s, ctx); }); });
    if (R.warn.length) listenSeiten('Prüfhinweise', [['Art', 22], ['Hinweis', 360]], warnZeilen(), 5).forEach(function (s, i) { add('warn-' + i, 'Prüfhinweise', '', function (ctx) { return listenBlatt(s, ctx); }); });
    const nr = {}; teile.forEach(function (t, i) { t.nr = i + 1; nr[t.key] = i + 1; });
    const nrVon = function (key) { return nr[key] || '–'; };
    const inhalt = teile.map(function (t) { return [t.nr, t.titel + (t.unter ? ' – ' + t.unter : '')]; });
    teile.forEach(function (t) {
      const ctx = { nr: t.nr, von: teile.length, titel: t.titel, unter: t.unter, nrVon: nrVon };
      t.svg = t.render ? t.render(ctx) : deckblatt(ctx, inhalt);
    });
    return teile;
  }

  // ======================================================================
  //  Oberfläche: Reiter, Eigenschaften, Stromkreise, Pläne, Listen, Projekt
  // ======================================================================
  let reiter = 'bauplan', blattWahl = 0, mappe = null, uhr = 0;
  function melde(t) { const m = $('ep-meldung'); m.textContent = t; clearTimeout(melde.u); melde.u = setTimeout(function () { m.textContent = ''; }, 6000); }
  function speichern(sofort) {
    clearTimeout(uhr);
    const tu = function () { try { localStorage.setItem(SPEICHER, JSON.stringify(P)); } catch (e) { melde('Speichern im Browser nicht möglich (Speicher voll?). Projekt als Datei sichern.'); } };
    if (sofort) tu(); else uhr = setTimeout(tu, 250);
  }
  function neu() {
    aufraeumen(P);
    R = berechnen(P);
    mappe = null;
    speichern();
    zaehlerZeigen();
    if (reiter === 'bauplan') { bauplanZeichnen(); eigenschaftenZeigen(); geschossLeiste(); }
    else zeigeReiter(reiter);
  }
  function zaehlerZeigen() {
    const f = R.warn.filter(function (w) { return w.stufe === 'fehler'; }).length, h = R.warn.length - f;
    const z = $('ep-zahl-pruefung'); z.textContent = f ? String(f) : h ? String(h) : '✓'; z.className = 'zahl ' + (f ? 'schlecht' : h ? 'mittel' : 'gut');
    $('ep-kurz').textContent = R.kreise.filter(function (k) { return !k.leer; }).length + ' Stromkreise · ' + P.rcds.length + ' RCD · ' + R.dosen.length + ' Abzweigdosen · ' + zahl(R.kabel.reduce(function (s, K) { return s + K.laenge; }, 0), 0) + ' m Leitung';
  }
  function zeigeReiter(r) {
    reiter = r;
    document.querySelectorAll('[data-reiter]').forEach(function (k) { k.setAttribute('aria-selected', String(k.getAttribute('data-reiter') === r)); });
    ['bauplan', 'kreise', 'plaene', 'listen', 'pruefung', 'projekt'].forEach(function (x) { $('ep-ansicht-' + x).hidden = x !== r; });
    if (r === 'bauplan') { if (!ED.ansicht) ansichtEinpassen(); bauplanZeichnen(); eigenschaftenZeigen(); geschossLeiste(); }
    if (r === 'kreise') kreiseZeigen();
    if (r === 'plaene') plaeneZeigen();
    if (r === 'listen') listenZeigen();
    if (r === 'pruefung') pruefungZeigen();
    if (r === 'projekt') projektZeigen();
    try { history.replaceState(null, '', location.pathname + location.search + (r === 'bauplan' ? '' : '#' + r)); } catch (e) { /* egal */ }
  }

  // ---------- Formularhelfer ----------
  function feld(ziel, name, wert, opt) {
    opt = opt || {};
    const l = el('label', opt.klasse || ''); l.append(el('span', '', name));
    let e;
    if (opt.wahl) {
      e = el('select');
      opt.wahl.forEach(function (w) { const o = el('option', '', w[1]); o.value = String(w[0]); e.append(o); });
      e.value = String(wert);
      e.addEventListener('change', function () { opt.setze(opt.zahl ? Number(e.value) : e.value); });
    } else if (opt.haken) {
      e = el('input'); e.type = 'checkbox'; e.checked = !!wert; l.classList.add('haken');
      e.addEventListener('change', function () { opt.setze(e.checked); });
      l.insertBefore(e, l.firstChild);
      ziel.append(l); return e;
    } else {
      e = el('input'); e.type = 'text'; e.value = opt.text ? wert : (wert === null || wert === undefined || wert === '' ? '' : String(runde(wert, 3)).replace('.', ','));
      if (!opt.text) e.inputMode = 'decimal';
      if (opt.platz) e.placeholder = opt.platz;
      e.addEventListener('change', function () {
        if (opt.text) { opt.setze(e.value.replace(/[<>]/g, '').slice(0, opt.max || 60)); return; }
        if (opt.leer && e.value.trim() === '') { opt.setze(null); return; }
        const w = lies(e.value);
        if (!isFinite(w) || w < opt.min || w > opt.max) { e.classList.add('falsch'); melde(name + ': Wert zwischen ' + zahl(opt.min, 2) + ' und ' + zahl(opt.max, 2) + ' eingeben.'); return; }
        e.classList.remove('falsch'); opt.setze(w);
      });
    }
    if (opt.einheit) { const w = el('div', 'mit-einheit'); w.append(e, el('i', '', opt.einheit)); l.append(w); } else l.append(e);
    ziel.append(l);
    return e;
  }
  function aendere(f) { return function (w) { vorher(); f(w); neu(); }; }
  function knopf(text, klick, klasse) { const b = el('button', 'knopf' + (klasse ? ' ' + klasse : ''), text); b.type = 'button'; b.addEventListener('click', klick); return b; }

  // ---------- Eigenschaften im Bauplan ----------
  function kreisWahl(d) {
    const passt = P.kreise.filter(function (k) { return !TYP[d.t].drei || k.ph === '3'; });
    return [['', '– ohne –']].concat(passt.map(function (k) { return [k.id, '-F' + k.nr + ' ' + k.name]; }), [['neu', '+ neuer Stromkreis']]);
  }
  function eigenschaftenZeigen() {
    const z = $('eigenschaften'); if (!z) return;
    z.innerHTML = '';
    const d = ED.wahl ? geraetVon(ED.wahl) : null, r = ED.wahlRaum ? raumNach(ED.wahlRaum) : null;
    if (ED.werkzeug === 'kalib' && ED.kalib && ED.kalib.b) { kalibrierFeld(z); return; }
    if (d) {
      const T0 = TYP[d.t], info = R.geraetInfo[d.id] || {}, rr = raumVon(P, d);
      z.append(el('h3', '', T0.n + (info.bmk ? ' ' + info.bmk : '')));
      const rolleText = { aus: 'Ausschalter (Ausschaltung)', dimmer: 'Dimmer', wdimmer: 'Wechsel-Dimmer', w1: 'Wechselschalter (Anfang)', w2: 'Wechselschalter (Ende)', kreuz: 'Kreuzschalter' }[info.rolle];
      z.append(el('p', 'klein', (rr ? 'Raum ' + rr.name : 'außerhalb der Räume') + (rolleText ? ' · wird ' + rolleText : '')));
      const raster = el('div', 'raster');
      if (T0.schalt && d.t !== 'bwm') feld(raster, 'Art', d.t, { wahl: [['schalter', 'Schalter (Art automatisch)'], ['taster', 'Taster (Stromstoß)'], ['dimmer', 'Dimmer'], ['serie', 'Serienschalter']], setze: aendere(function (w) { d.t = w; if (w === 'serie' && !d.gr2 && d.k) d.gr2 = freieGruppe(P, kreisVon(d.k)); }) });
      if (d.t === 'leuchte' || d.t === 'wandleuchte') feld(raster, 'Art', d.t, { wahl: [['leuchte', 'Deckenleuchte'], ['wandleuchte', 'Wandleuchte']], setze: aendere(function (w) { d.t = w; }) });
      if (d.t === 'geraet' || d.t === 'geraet3') feld(raster, 'Anschluss', d.t, { wahl: [['geraet', '230 V (1 Außenleiter)'], ['geraet3', '400 V (3 Außenleiter)']], setze: aendere(function (w) { d.t = w; d.k = ''; geraetZuordnen(P, d); }) });
      if (T0.kreis) {
        feld(raster, 'Stromkreis', d.k, { wahl: kreisWahl(d), setze: aendere(function (w) {
          if (w === 'neu') { d.k = ''; const alt = d.gr; d.gr = ''; const art = istLast(d) ? (TYP[d.t].drei ? 'last3' : 'last') : istLicht(d) ? 'licht' : 'sd'; const k = neuerKreis(P, art, (d.name || TYP[d.t].n) + (rr ? ' ' + rr.name : ''), { ph: TYP[d.t].drei ? '3' : 'L1', i: art === 'licht' ? 10 : istLast(d) ? iVon(d.P || 2000, !!TYP[d.t].drei) : 16 }); schutzFuerNeuen(P, k); d.k = k.id; if (istLicht(d)) d.gr = 'a'; void alt; }
          else { d.k = w; if (istLicht(d)) d.gr = w ? freieGruppe(P, kreisVon(w)) : ''; }
        }) });
        if (istLicht(d) && d.k) {
          const k = kreisVon(d.k), belegt = {};
          geraeteIn(P, k).forEach(function (x) { if (x.gr) belegt[x.gr] = 1; if (x.gr2) belegt[x.gr2] = 1; });
          const frei = freieGruppe(P, k);
          const wahl = Object.keys(belegt).sort().map(function (b) {
            const g = R.gruppen.filter(function (G) { return G.kreis === k && G.b === b; })[0];
            return [b, b + (g ? ' – ' + g.name + (g.raum ? ', ' + g.raum.name : '') : '')];
          });
          if (!belegt[frei]) wahl.push([frei, frei + ' – neue Gruppe']);
          feld(raster, d.t === 'serie' ? 'Gruppe Wippe 1' : 'Schaltgruppe', d.gr, { wahl: wahl, setze: aendere(function (w) { d.gr = w; }) });
          if (d.t === 'serie') feld(raster, 'Gruppe Wippe 2', d.gr2, { wahl: wahl, setze: aendere(function (w) { d.gr2 = w; }) });
        }
      }
      if (d.t === 'sd' || d.t === 'daten') feld(raster, 'Anzahl (Mehrfach)', d.anz, { wahl: [[1, '1-fach'], [2, '2-fach'], [3, '3-fach'], [4, '4-fach']], zahl: true, setze: aendere(function (w) { d.anz = w; }) });
      if (d.t === 'sd' || d.t === 'sd400' || d.t === 'schalter' || d.t === 'taster') feld(raster, 'Feuchtraum / außen IP44', d.ip, { haken: true, setze: aendere(function (w) { d.ip = w; }) });
      if (d.t === 'sd') feld(raster, 'Gerätesteckdose mit eigenem Stromkreis', d.eigen, { haken: true, setze: aendere(function (w) { d.eigen = w; d.k = ''; d.gr = ''; geraetZuordnen(P, d); }) });
      if (d.t === 'geraet' || d.t === 'geraet3' || d.t === 'sd' || d.t === 'sd400' || d.t === 'motor') feld(raster, 'Bezeichnung', d.name, { text: true, max: 30, platz: d.t === 'sd' ? 'z. B. Waschmaschine' : 'z. B. Herd', setze: aendere(function (w) { d.name = w; }) });
      if (d.t === 'geraet' || d.t === 'geraet3' || (d.t === 'sd' && d.eigen)) feld(raster, 'Leistung', d.P / 1000, { min: 0, max: 50, einheit: 'kW', setze: aendere(function (w) { d.P = runde(w * 1000, 0); const k = kreisVon(d.k); if (k && geraeteIn(P, k).length === 1 && k.art !== 'sd') k.i = iVon(d.P, k.ph === '3'); }) });
      feld(raster, 'Einbauhöhe (Mitte)', d.h, { min: 0, max: 6, einheit: 'm', leer: true, platz: zahl(hoeheVon(P, Object.assign({}, d, { h: null })), 2), setze: aendere(function (w) { d.h = w; }) });
      feld(raster, 'x', d.x, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { d.x = w; }) });
      feld(raster, 'y', d.y, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { d.y = w; }) });
      z.append(raster);
      if (info.kabel) {
        const K = info.kabel, p = el('div', 'kabel-info');
        p.append(el('b', '', K.bmk + ' ' + K.typ + ' ' + K.adern + '×' + zahl(K.aEff, K.aEff % 1 ? 1 : 0) + ' · ' + zahl(K.laenge, 1) + ' m'));
        p.append(el('span', '', 'von ' + K.von.name + ': ' + K.ader.map(function (a) { return FNAME[a.f] + ' ' + ROLLE(a.r); }).join(', ')));
        z.append(p);
      }
      const reihe = el('div', 'knopf-reihe');
      if (T0.wand) reihe.append(knopf('Drehen (R)', drehen));
      if (d.t !== 'uv') reihe.append(knopf('Kopieren', duplizieren));
      reihe.append(knopf('Löschen', loeschen, 'gefahr'));
      if (d.k) reihe.append(knopf('Im Stromlaufplan', function () { springeZuBlatt(d); }));
      z.append(reihe);
      return;
    }
    if (r) {
      z.append(el('h3', '', 'Raum'));
      const raster = el('div', 'raster');
      feld(raster, 'Name', r.name, { text: true, max: 30, setze: aendere(function (w) { r.name = w || 'Raum'; }) });
      feld(raster, 'Raumart', r.typ, { wahl: RAUMTYP, setze: aendere(function (w) { r.typ = w; }) });
      feld(raster, 'Breite (x)', r.w, { min: 0.3, max: 200, einheit: 'm', setze: aendere(function (w) { r.w = w; }) });
      feld(raster, 'Länge (y)', r.l, { min: 0.3, max: 200, einheit: 'm', setze: aendere(function (w) { r.l = w; }) });
      feld(raster, 'x', r.x, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { const dx = w - r.x; P.geraete.forEach(function (d) { if (raumVon(P, d) === r) d.x = runde(d.x + dx, 3); }); r.x = w; }) });
      feld(raster, 'y', r.y, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { const dy = w - r.y; P.geraete.forEach(function (d) { if (raumVon(P, d) === r) d.y = runde(d.y + dy, 3); }); r.y = w; }) });
      z.append(raster);
      const a = R.ausstattung.filter(function (x) { return x.r === r; })[0];
      if (a) z.append(el('p', 'klein ' + (a.ok ? 'gut' : 'mittel'), zahl(flaeche(r), 1) + ' m² · ' + a.sd + ' Steckdosen-Einbaustellen, ' + a.licht + ' Leuchten · Richtwert ' + a.soll[0] + ' / ' + a.soll[1] + ' (DIN 18015-2, Ausstattungswert ' + P.projekt.ausstattung + ', grob)'));
      const reihe = el('div', 'knopf-reihe');
      reihe.append(knopf('Raum löschen', loeschen, 'gefahr'));
      z.append(reihe);
      return;
    }
    // nichts gewählt: Geschoss und Hintergrundplan
    const G = aktivG();
    z.append(el('h3', '', 'Geschoss „' + G.name + '“'));
    const raster = el('div', 'raster');
    feld(raster, 'Name', G.name, { text: true, max: 30, setze: aendere(function (w) { G.name = w || 'Geschoss'; }) });
    feld(raster, 'Geschosshöhe', G.hoehe, { min: 2, max: 6, einheit: 'm', setze: aendere(function (w) { G.hoehe = w; }) });
    feld(raster, 'lichte Raumhöhe', G.raum, { min: 2, max: 5, einheit: 'm', setze: aendere(function (w) { G.raum = w; }) });
    if (P.geschosse.length > 1) {
      const i = P.geschosse.indexOf(G), lage = el('div', 'knopf-reihe');
      lage.append(el('span', 'klein', 'Lage im Gebäude (für Leitungen zwischen Geschossen):'));
      if (i < P.geschosse.length - 1) lage.append(knopf('↑ eine Ebene höher', aendere(function () { P.geschosse.splice(i, 1); P.geschosse.splice(i + 1, 0, G); }), 'klein'));
      if (i > 0) lage.append(knopf('↓ eine Ebene tiefer', aendere(function () { P.geschosse.splice(i, 1); P.geschosse.splice(i - 1, 0, G); }), 'klein'));
      z.append(lage);
    }
    feld(raster, 'Symbolgröße', P.projekt.symbol * 100, { min: 15, max: 100, einheit: 'cm', setze: aendere(function (w) { P.projekt.symbol = w / 100; }) });
    z.append(raster);
    z.append(el('h4', '', 'Bauplan als Hintergrund'));
    const b = bildLaden(G.id);
    const hilfe = el('p', 'klein', b ? 'Mit „Maßstab festlegen“ zwei Punkte mit bekanntem Abstand antippen (z. B. eine bemaßte Wand). Räume danach auf dem Plan nachziehen.' : 'Grundriss als Foto, Scan oder Bild (PNG, JPG) laden – PDF vorher als Bild speichern. Das Bild bleibt nur in diesem Browser und geht nicht in den Link.');
    z.append(hilfe);
    const r2 = el('div', 'knopf-reihe');
    const datei = el('input'); datei.type = 'file'; datei.accept = 'image/*'; datei.hidden = true;
    datei.addEventListener('change', function () { if (datei.files && datei.files[0]) bildEinlesen(datei.files[0], G); datei.value = ''; });
    r2.append(datei, knopf(b ? 'Anderes Bild' : 'Bild laden', function () { datei.click(); }));
    if (b) { r2.append(knopf('Maßstab festlegen', function () { werkzeug('kalib'); })); r2.append(knopf('Bild entfernen', function () { Nachfrage('Hintergrundbild entfernen?', function () { try { localStorage.removeItem(BILD + G.id); } catch (e) { /* egal */ } bilder[G.id] = ''; bauplanZeichnen(); eigenschaftenZeigen(); }); }, 'gefahr')); }
    z.append(r2);
    if (b) {
      const r3 = el('div', 'raster');
      feld(r3, 'Bildbreite', G.bildB, { min: 0.5, max: 500, einheit: 'm', setze: aendere(function (w) { G.bildB = w; }) });
      feld(r3, 'Versatz x', G.bildX, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { G.bildX = w; }) });
      feld(r3, 'Versatz y', G.bildY, { min: -500, max: 500, einheit: 'm', setze: aendere(function (w) { G.bildY = w; }) });
      feld(r3, 'Deckkraft', Math.round(G.bildDeck * 100), { min: 5, max: 100, einheit: '%', setze: aendere(function (w) { G.bildDeck = w / 100; }) });
      z.append(r3);
    }
    const tipp = el('ul', 'tipps');
    ['Räume aufziehen, dann Symbole links wählen und antippen.', 'Schalter: Die Art (Aus-, Wechsel-, Kreuzschalter) ergibt sich aus der Zahl der Schalter in der Gruppe.', 'Gleicher Buchstabe = gleiche Schaltgruppe (z. B. „3a“: Stromkreis 3, Gruppe a).', 'Tasten: Entf löscht, R dreht, Pfeile verschieben (Umschalt: 50 cm), Strg+Z rückgängig.'].forEach(function (t) { tipp.append(el('li', '', t)); });
    z.append(tipp);
  }
  function kalibrierFeld(z) {
    const a = ED.kalib.a, b = ED.kalib.b, m = Math.hypot(b.x - a.x, b.y - a.y);
    z.append(el('h3', '', 'Maßstab festlegen'));
    z.append(el('p', 'klein', 'Gemessener Abstand im Plan: ' + zahl(m, 3) + ' m. Wie lang ist die Strecke wirklich?'));
    const raster = el('div', 'raster');
    const e = feld(raster, 'wirklicher Abstand', '', { min: 0.05, max: 500, einheit: 'm', setze: function (w) {
      const G = aktivG(), f = w / m;
      if (!(m > 0)) return;
      vorher();
      G.bildB = runde(G.bildB * f, 4); G.bildX = runde(a.x + (G.bildX - a.x) * f, 4); G.bildY = runde(a.y + (G.bildY - a.y) * f, 4);
      werkzeug('wahl'); ED.ansicht = null; ansichtEinpassen(); neu();
      melde('Maßstab übernommen: Bildbreite jetzt ' + zahl(G.bildB, 2) + ' m.');
    } });
    z.append(raster);
    z.append(knopf('Abbrechen', function () { werkzeug('wahl'); eigenschaftenZeigen(); }));
    setTimeout(function () { e.focus(); }, 30);
  }
  function bildEinlesen(datei, G) {
    if (!/^image\//.test(datei.type)) { melde('Bitte ein Bild (PNG, JPG) wählen. PDF vorher als Bild speichern.'); return; }
    const leser = new FileReader();
    leser.onload = function () {
      const img = new Image();
      img.onload = function () {
        const max = 2200, f = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * f); c.height = Math.round(img.height * f);
        const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(img, 0, 0, c.width, c.height);
        let url = c.toDataURL('image/jpeg', 0.82);
        try { localStorage.setItem(BILD + G.id, url); }
        catch (e) { url = c.toDataURL('image/jpeg', 0.55); try { localStorage.setItem(BILD + G.id, url); } catch (e2) { melde('Bild zu groß für den Browserspeicher – es gilt nur bis zum Neuladen.'); } }
        bilder[G.id] = url;
        vorher();
        const rs = P.raeume.filter(function (r) { return r.g === G.id; });
        const breite = rs.length ? Math.max.apply(null, rs.map(function (r) { return r.x + r.w; })) - Math.min.apply(null, rs.map(function (r) { return r.x; })) : 12;
        G.bildB = runde(Math.max(4, breite * 1.2), 2); G.bildX = rs.length ? Math.min.apply(null, rs.map(function (r) { return r.x; })) - 0.5 : 0; G.bildY = rs.length ? Math.min.apply(null, rs.map(function (r) { return r.y; })) - 0.5 : 0;
        ED.ansicht = null; ansichtEinpassen(); neu();
        melde('Bild geladen. Jetzt „Maßstab festlegen“ und eine bekannte Strecke antippen.');
      };
      img.onerror = function () { melde('Das Bild ließ sich nicht lesen.'); };
      img.src = leser.result;
    };
    leser.readAsDataURL(datei);
  }
  function geschossLeiste() {
    const z = $('ep-geschosse'); z.innerHTML = '';
    P.geschosse.forEach(function (G) {
      const b = el('button', '', G.name); b.type = 'button'; b.setAttribute('aria-pressed', String(G.id === P.aktiv));
      b.addEventListener('click', function () { P.aktiv = G.id; ED.wahl = null; ED.wahlRaum = null; ED.ansicht = null; ansichtEinpassen(); speichern(); bauplanZeichnen(); eigenschaftenZeigen(); geschossLeiste(); });
      z.append(b);
    });
    const plus = el('button', 'plus', '+'); plus.type = 'button'; plus.title = 'Geschoss hinzufügen';
    plus.addEventListener('click', function () {
      if (P.geschosse.length >= 8) { melde('Höchstens 8 Geschosse.'); return; }
      vorher();
      const namen = ['Erdgeschoss', 'Obergeschoss', 'Dachgeschoss', '2. Obergeschoss', 'Spitzboden', 'Keller'];
      const G = { id: neueId('g'), name: namen.filter(function (n) { return !P.geschosse.some(function (g) { return g.name === n; }); })[0] || 'Geschoss ' + (P.geschosse.length + 1), hoehe: 2.75, raum: 2.5, bildB: 0, bildX: 0, bildY: 0, bildDeck: 0.5 };
      P.geschosse.push(G); P.aktiv = G.id; ED.ansicht = null; ansichtEinpassen(); neu();
    });
    z.append(plus);
    if (P.geschosse.length > 1) {
      const weg = el('button', 'weg', '×'); weg.type = 'button'; weg.title = 'Aktuelles Geschoss löschen';
      weg.addEventListener('click', function () {
        const G = aktivG();
        Nachfrage('Geschoss „' + G.name + '“ mit allen Räumen und Geräten löschen?', function () {
          vorher();
          P.raeume = P.raeume.filter(function (r) { return r.g !== G.id; }); P.geraete = P.geraete.filter(function (d) { return d.g !== G.id; });
          P.geschosse = P.geschosse.filter(function (g) { return g !== G; }); P.aktiv = P.geschosse[0].id;
          try { localStorage.removeItem(BILD + G.id); } catch (e) { /* egal */ }
          ED.ansicht = null; ansichtEinpassen(); neu();
        });
      });
      z.append(weg);
    }
  }
  function paletteBauen() {
    const z = $('ep-palette'); z.innerHTML = '';
    const w = el('div', 'werkzeuge');
    [['wahl', 'Auswählen', '<path d="M5 3 L5 19 L9 15 L12 21 L14 20 L11 14 L17 14 Z" fill="currentColor"/>'], ['raum', 'Raum', '<rect x="4" y="5" width="16" height="14" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M4 12 H11 V19" fill="none" stroke="currentColor" stroke-width="1.4"/>']].forEach(function (x) {
      const b = el('button'); b.type = 'button'; b.setAttribute('data-werkzeug', x[0]); b.title = x[1];
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + x[2] + '</svg>'; b.append(el('span', '', x[1]));
      b.addEventListener('click', function () { werkzeug(x[0]); });
      w.append(b);
    });
    z.append(w);
    KATS.forEach(function (kat) {
      const g = el('div', 'kat'); g.append(el('h4', '', kat));
      const reihe = el('div', 'symbole');
      Object.keys(TYP).filter(function (t) { return TYP[t].kat === kat; }).forEach(function (t) {
        const b = el('button'); b.type = 'button'; b.setAttribute('data-werkzeug', 'setzen'); b.setAttribute('data-typ', t); b.title = TYP[t].n;
        const wand = TYP[t].wand;
        b.innerHTML = '<svg viewBox="-0.8 ' + (wand ? '-1.2' : '-0.8') + ' 1.6 ' + (wand ? '1.5' : '1.6') + '" aria-hidden="true">' + (wand ? '<line x1="-0.8" y1="0.05" x2="0.8" y2="0.05" stroke="#ADB5BD" stroke-width="0.1"/>' : '') + sym(t, t === 'schalter' ? 'aus' : '', { name: t === 'geraet3' ? 'Herd' : '' }) + '</svg>';
        b.append(el('span', '', TYP[t].n.replace(' (Stromstoß)', '').replace('Geräteanschluss', 'Gerät')));
        b.addEventListener('click', function () { werkzeug('setzen', t); });
        reihe.append(b);
      });
      g.append(reihe); z.append(g);
    });
  }
  function springeZuBlatt(d) {
    zeigeReiter('plaene');
    if (!mappe) mappe = planMappe();
    const k = kreisVon(d.k);
    const key = k && k.rcd && k.rcd !== 'rcbo' ? 'stromlauf-' + k.rcd : 'stromlauf-ohne';
    // Blatt suchen, auf dem der Stromkreis steht
    let idx = mappe.map(function (t) { return t.key; }).indexOf(key);
    mappe.forEach(function (t, i) { if (t.svg.indexOf('-F' + k.nr + ' ' + esc(k.name)) >= 0 && t.key.indexOf('stromlauf') === 0) idx = i; });
    if (idx >= 0) { blattWahl = idx; plaeneZeigen(); }
  }

  // ---------- Stromkreise ----------
  function kreiseZeigen() {
    const z = $('ep-kreise'); z.innerHTML = '';
    const kopf = el('div', 'knopf-reihe');
    kopf.append(knopf('Stromkreise neu bilden', function () { Nachfrage('Alle Stromkreise, Schaltgruppen und RCDs automatisch neu bilden? Eigene Zuordnungen gehen verloren.', function () { vorher(); kreiseNeuBilden(P); neu(); melde('Stromkreise neu gebildet.'); }); }));
    kopf.append(knopf('Außenleiter neu verteilen', function () { vorher(); phasenVerteilen(P); neu(); }));
    kopf.append(knopf('+ RCD', function () { vorher(); P.rcds.push({ id: neueId('q'), nr: P.rcds.reduce(function (m, q) { return Math.max(m, q.nr); }, 0) + 1, i: 40, idn: 30, typ: 'A', pole: 4 }); P.kreise.push({ id: neueId('k'), nr: naechsteNr(P), name: 'Reserve', art: 'gemischt', c: 'B', i: 16, rcd: P.rcds[P.rcds.length - 1].id, ph: 'L1', typ: 'NYM-J', a: 0, verlegung: 'C', zus: 0, fest: true, wallbox: false }); neu(); }));
    kopf.append(knopf('+ leerer Stromkreis', function () { vorher(); const k = neuerKreis(P, 'gemischt', 'Reserve'); k.fest = true; schutzFuerNeuen(P, k); neu(); }));
    z.append(kopf);
    // Außenleiterlast
    const ph = el('div', 'phasen');
    ['L1', 'L2', 'L3'].forEach(function (p) {
      const max = Math.max(R.phasen.L1, R.phasen.L2, R.phasen.L3, 1), b = el('div', 'balken');
      b.append(el('span', '', p), el('i'), el('b', '', zahl(R.phasen[p] / 1000, 1) + ' kW'));
      b.querySelector('i').style.width = Math.round(R.phasen[p] / max * 100) + '%';
      ph.append(b);
    });
    z.append(el('p', 'klein', 'Geschätzte Last je Außenleiter (Licht 60 W je Leuchte, Steckdosenkreis 1,5 kW, Geräte mit Nennleistung):'), ph);
    // RCDs
    const qt = el('div', 'tabelle-huelle'), tq = el('table', 'liste');
    tq.innerHTML = '<thead><tr><th>RCD</th><th>Bemessungsstrom</th><th>Fehlerstrom</th><th>Typ</th><th>Pole</th><th>Stromkreise</th><th></th></tr></thead>';
    const bq = el('tbody');
    P.rcds.forEach(function (q) {
      const tr = el('tr');
      tr.append(el('td', 'fett', '-Q' + q.nr));
      const zelle = function (w) { const td = el('td'); w(td); tr.append(td); };
      zelle(function (td) { feld(td, '', q.i, { wahl: [[25, '25 A'], [40, '40 A'], [63, '63 A'], [80, '80 A']], zahl: true, setze: aendere(function (w) { q.i = w; }) }); });
      zelle(function (td) { feld(td, '', q.idn, { wahl: [[10, '10 mA'], [30, '30 mA'], [100, '100 mA'], [300, '300 mA']], zahl: true, setze: aendere(function (w) { q.idn = w; }) }); });
      zelle(function (td) { feld(td, '', q.typ, { wahl: [['A', 'Typ A'], ['F', 'Typ F'], ['B', 'Typ B'], ['EV', 'Typ A + DC 6 mA']], setze: aendere(function (w) { q.typ = w; }) }); });
      zelle(function (td) { feld(td, '', q.pole, { wahl: [[2, '2-polig'], [4, '4-polig']], zahl: true, setze: aendere(function (w) { q.pole = w; }) }); });
      tr.append(el('td', '', P.kreise.filter(function (k) { return k.rcd === q.id; }).map(function (k) { return '-F' + k.nr; }).join(', ')));
      const td = el('td');
      if (!P.kreise.some(function (k) { return k.rcd === q.id; })) td.append(knopf('×', aendere(function () { P.rcds = P.rcds.filter(function (x) { return x !== q; }); }), 'klein gefahr'));
      tr.append(td); bq.append(tr);
    });
    tq.append(bq); qt.append(tq); z.append(el('h3', '', 'Fehlerstrom-Schutzschalter'), qt);
    // Stromkreise
    const ht = el('div', 'tabelle-huelle'), t = el('table', 'liste kreise');
    t.innerHTML = '<thead><tr><th>Nr.</th><th>Bezeichnung</th><th>Schutz</th><th>RCD</th><th>Außenl.</th><th>Leitung</th><th>Querschnitt</th><th>Verlegung</th><th>Zuschlag</th><th>Länge</th><th>ΔU</th><th>Zs / max</th><th></th></tr></thead>';
    const tb = el('tbody');
    P.kreise.forEach(function (k) {
      const RK = R.nachKreis[k.id] || {}, tr = el('tr'), fehler = R.warn.some(function (w) { return w.kreis === k.id && w.stufe === 'fehler'; });
      if (fehler) tr.className = 'fehlerzeile';
      const nr = el('td', 'fett'); nr.append(el('span', 'farbpunkt')); nr.lastChild.style.background = kreisFarbe(k); nr.append(document.createTextNode('-F' + k.nr)); tr.append(nr);
      const zelle = function (w) { const td = el('td'); w(td); tr.append(td); };
      zelle(function (td) { feld(td, '', k.name, { text: true, max: 40, setze: aendere(function (w) { k.name = w; }) }); });
      zelle(function (td) {
        const w = el('div', 'zwei');
        feld(w, '', k.rcd === 'rcbo' ? 'rcbo' : k.c, { wahl: [['B', 'B'], ['C', 'C']], setze: aendere(function (v) { k.c = v; }) });
        feld(w, '', k.i, { wahl: LS_IN.map(function (i) { return [i, i + ' A']; }), zahl: true, setze: aendere(function (v) { k.i = v; }) });
        td.append(w);
      });
      zelle(function (td) { feld(td, '', k.rcd, { wahl: P.rcds.map(function (q) { return [q.id, '-Q' + q.nr]; }).concat([['rcbo', 'FI/LS'], ['', 'ohne']]), setze: aendere(function (v) { k.rcd = v; }) }); });
      zelle(function (td) { feld(td, '', k.ph, { wahl: [['L1', 'L1'], ['L2', 'L2'], ['L3', 'L3'], ['3', 'L1–L3']], setze: aendere(function (v) { k.ph = v; if (v === '3') k.art = 'last3'; }) }); });
      zelle(function (td) { feld(td, '', k.typ, { wahl: [['NYM-J', 'NYM-J'], ['NYY-J', 'NYY-J']], setze: aendere(function (v) { k.typ = v; }) }); });
      zelle(function (td) { feld(td, '', k.a, { wahl: [[0, 'auto (' + zahl(RK.a || 1.5, 1) + ')']].concat(QUERSCHNITTE.map(function (a) { return [a, zahl(a, a % 1 ? 1 : 0) + ' mm²']; })), zahl: true, setze: aendere(function (v) { k.a = v; }) }); });
      zelle(function (td) { feld(td, '', k.verlegung, { wahl: [['A1', 'A1'], ['B2', 'B2'], ['C', 'C']], setze: aendere(function (v) { k.verlegung = v; }) }); });
      zelle(function (td) { feld(td, '', k.zus, { min: 0, max: 200, einheit: 'm', setze: aendere(function (v) { k.zus = v; }) }); });
      tr.append(el('td', 'zahl', RK.lGesamt ? zahl(RK.lGesamt, 1) + ' m' : '–'));
      tr.append(el('td', 'zahl ' + (RK.du > 3 ? 'schlecht' : ''), isFinite(RK.du) ? zahl(RK.du, 2) + ' %' : '–'));
      tr.append(el('td', 'zahl ' + (RK.zs > RK.zsMax ? 'mittel' : ''), isFinite(RK.zs) ? zahl(RK.zs, 2) + ' / ' + zahl(RK.zsMax, 2) + ' Ω' : '–'));
      const td = el('td');
      td.append(knopf('Zeigen', function () { const d = (RK.ger || [])[0]; if (d) { P.aktiv = d.g; ED.wahl = d.id; ED.wahlKreis = k.id; ED.ansicht = null; zeigeReiter('bauplan'); } }, 'klein'));
      if (!RK.ger || !RK.ger.length) td.append(knopf('×', aendere(function () { P.kreise = P.kreise.filter(function (x) { return x !== k; }); }), 'klein gefahr'));
      tr.append(td);
      tb.append(tr);
    });
    t.append(tb); ht.append(t);
    z.append(el('h3', '', 'Stromkreise'), ht);
    z.append(el('p', 'klein', 'Verlegeart nach DIN VDE 0298-4: A1 im Rohr in wärmegedämmter Wand, B2 im Rohr auf/in der Wand, C direkt in/auf der Wand (Unterputz). Querschnitt „auto“ wählt den kleinsten Querschnitt mit Iz ≥ In, ΔU ≤ 3 % und erfüllter Abschaltbedingung. Zuschlag: zusätzliche Leitungslänge (Umwege, Steigleitung).'));
  }

  // ---------- Pläne ----------
  function plaeneZeigen() {
    if (!mappe) mappe = planMappe();
    blattWahl = Math.min(blattWahl, mappe.length - 1);
    const liste = $('ep-blaetter'); liste.innerHTML = '';
    mappe.forEach(function (t, i) {
      const b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(i === blattWahl));
      b.append(el('b', '', String(t.nr)), el('span', '', t.titel + (t.unter ? ' – ' + t.unter : '')));
      b.addEventListener('click', function () { blattWahl = i; plaeneZeigen(); });
      liste.append(b);
    });
    $('ep-blatt').innerHTML = mappe[blattWahl].svg;
    $('ep-blatt-titel').textContent = 'Blatt ' + mappe[blattWahl].nr + ' von ' + mappe.length + ': ' + mappe[blattWahl].titel + (mappe[blattWahl].unter ? ' – ' + mappe[blattWahl].unter : '');
  }
  function drucken(nurAktuell) {
    if (!mappe) mappe = planMappe();
    const a4 = P.projekt.format === 'A4';
    const ziel = $('ep-druck'); ziel.innerHTML = '';
    (nurAktuell ? [mappe[blattWahl]] : mappe).forEach(function (t) { const d = el('div', 'druck-blatt'); d.innerHTML = t.svg; ziel.append(d); });
    const st = $('ep-druckstil');
    st.textContent = '@page { size: ' + (a4 ? 'A4' : 'A3') + ' landscape; margin: 0; } .druck-blatt { width: ' + (a4 ? 297 : 420) + 'mm; height: ' + (a4 ? 209 : 296) + 'mm; }';
    document.body.classList.add('drucke-mappe');
    const fertig = function () { document.body.classList.remove('drucke-mappe'); ziel.innerHTML = ''; st.textContent = ''; window.removeEventListener('afterprint', fertig); };
    window.addEventListener('afterprint', fertig);
    setTimeout(function () { window.print(); setTimeout(function () { if (document.body.classList.contains('drucke-mappe') && !window.matchMedia('print').matches) fertig(); }, 1500); }, 60);
  }
  function herunterladen(name, inhalt, typ) {
    const b = new Blob([inhalt], { type: typ }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name; document.body.append(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function dateiname(endung) { return (P.projekt.zeichnung || P.projekt.name || 'elektroplanung').replace(/[^A-Za-z0-9ÄÖÜäöüß_-]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) + endung; }

  // ---------- Listen ----------
  function htmlTabelle(spalten, zeilen) {
    const h = el('div', 'tabelle-huelle'), t = el('table', 'liste');
    const kopf = el('tr'); spalten.forEach(function (s) { kopf.append(el('th', s[2] === 'end' ? 'zahl' : '', s[0])); });
    const th = el('thead'); th.append(kopf); t.append(th);
    const tb = el('tbody');
    zeilen.forEach(function (z) { const tr = el('tr'); z.forEach(function (w, i) { tr.append(el('td', spalten[i] && spalten[i][2] === 'end' ? 'zahl' : '', String(w))); }); tb.append(tr); });
    t.append(tb); h.append(t); return h;
  }
  function csv(spalten, zeilen) { return '﻿' + [spalten.map(function (s) { return s[0]; })].concat(zeilen).map(function (z) { return z.map(function (w) { const t = String(w).replace(/"/g, '""'); return /[;"\n]/.test(t) ? '"' + t + '"' : t; }).join(';'); }).join('\r\n'); }
  function listenZeigen() {
    const z = $('ep-listen'); z.innerHTML = '';
    [['Stromkreisliste', KREIS_SPALTEN, kreisZeilen(), 'stromkreise'], ['Kabelliste mit Aderbelegung', KABEL_SPALTEN, kabelZeilen(), 'kabel'], ['Stückliste', STUECK_SPALTEN, stueckZeilen(), 'stueckliste']].forEach(function (x) {
      const kopf = el('div', 'listen-kopf'); kopf.append(el('h3', '', x[0]), knopf('CSV', function () { herunterladen(dateiname('-' + x[3] + '.csv'), csv(x[1], x[2]), 'text/csv;charset=utf-8'); }, 'klein'));
      z.append(kopf, htmlTabelle(x[1], x[2]));
    });
    // Abzweigdosen als Text
    z.append(el('h3', '', 'Abzweigdosen und Klemmen'));
    const d = el('div', 'dosen-liste');
    R.dosen.forEach(function (o) {
      const k = el('details'); const s = el('summary', '', o.bmk + ' · -F' + o.kreis.nr + ' ' + o.kreis.name + ' · ' + (o.raum ? o.raum.name : ''));
      k.append(s);
      const ul = el('ul');
      (o.klemmen || []).forEach(function (kl) { ul.append(el('li', kl.einzeln ? 'mittel' : '', 'K' + kl.nr + ' ' + ROLLE(kl.r) + ': ' + kl.adern.map(function (a) { return a.K.bmk + ' ' + FNAME[a.a.f] + (a.a.kennz ? '*' : ''); }).join(', '))); });
      if (o.reserve.length) ul.append(el('li', '', 'Reserve isolieren: ' + o.reserve.map(function (r) { return r.K.bmk + ' ' + FNAME[r.a.f]; }).join(', ')));
      k.append(ul); d.append(k);
    });
    z.append(d);
  }
  function pruefungZeigen() {
    const z = $('ep-pruefung'); z.innerHTML = '';
    if (!R.warn.length) { z.append(el('p', 'gut', 'Keine Auffälligkeiten. Rechnerische Prüfung bestanden – vor Ort trotzdem messen (DIN VDE 0100-600).')); return; }
    const ul = el('ul', 'warn-liste');
    R.warn.slice().sort(function (a, b) { return (a.stufe === 'fehler' ? 0 : 1) - (b.stufe === 'fehler' ? 0 : 1); }).forEach(function (w) {
      const li = el('li', w.stufe === 'fehler' ? 'schlecht' : 'mittel');
      li.append(el('b', '', w.stufe === 'fehler' ? 'Prüfen' : 'Hinweis'), el('span', '', w.text));
      const ziel = w.g ? geraetVon(w.g) : w.kreis ? (R.nachKreis[w.kreis] && R.nachKreis[w.kreis].ger[0]) : null;
      if (ziel) li.append(knopf('Zeigen', function () { P.aktiv = ziel.g; ED.wahl = ziel.id; ED.wahlKreis = ziel.k; ED.ansicht = null; zeigeReiter('bauplan'); }, 'klein'));
      ul.append(li);
    });
    z.append(ul);
  }

  // ---------- Projekt ----------
  function projektZeigen() {
    const z = $('ep-projekt'); z.innerHTML = '';
    const p = P.projekt, ra = el('div', 'raster breit');
    const t = function (k, n, max) { feld(ra, n, p[k], { text: true, max: max || 80, setze: aendere(function (w) { p[k] = w; }) }); };
    t('name', 'Projekt / Bauvorhaben'); t('kunde', 'Bauherr / Kunde'); t('adresse', 'Adresse', 100); t('firma', 'Firma / Ersteller'); t('ersteller', 'Bearbeiter', 60);
    t('datum', 'Datum', 20); t('zeichnung', 'Zeichnungs-Nr.', 30); t('revision', 'Index / Revision', 6);
    z.append(el('h3', '', 'Angaben für das Schriftfeld'), ra);
    const rb = el('div', 'raster breit');
    feld(rb, 'Netzsystem', p.netz, { wahl: [['TN-C-S', 'TN-C-S (PEN bis Hausanschluss)'], ['TN-S', 'TN-S'], ['TT', 'TT (eigener Erder)']], setze: aendere(function (w) { p.netz = w; }) });
    feld(rb, 'Schleifenimpedanz am Verteiler Zvor', p.zvor, { min: 0, max: 5, einheit: 'Ω', setze: aendere(function (w) { p.zvor = w; }) });
    if (p.netz === 'TT') feld(rb, 'Erdungswiderstand RA', p.ra, { min: 0, max: 500, einheit: 'Ω', setze: aendere(function (w) { p.ra = w; }) });
    feld(rb, 'Stromkreise je RCD höchstens', p.maxRcd, { wahl: [2, 3, 4, 5, 6, 8, 10, 12].map(function (n) { return [n, String(n)]; }), zahl: true, setze: aendere(function (w) { p.maxRcd = w; }) });
    feld(rb, 'Ausstattungswert (DIN 18015-2)', p.ausstattung, { wahl: [[1, '1 – Mindestausstattung'], [2, '2 – Standard'], [3, '3 – Komfort']], zahl: true, setze: aendere(function (w) { p.ausstattung = w; }) });
    feld(rb, 'Blattformat', p.format, { wahl: [['A3', 'A3 quer'], ['A4', 'A4 quer (verkleinert)']], setze: aendere(function (w) { p.format = w; }) });
    z.append(el('h3', '', 'Netz und Bemessung'), rb);
    z.append(el('h3', '', 'Datei'));
    const r = el('div', 'knopf-reihe');
    r.append(knopf('Projekt speichern (.json)', function () { herunterladen(dateiname('.json'), JSON.stringify(P, null, 1), 'application/json'); }));
    const datei = el('input'); datei.type = 'file'; datei.accept = '.json,application/json'; datei.hidden = true;
    datei.addEventListener('change', function () {
      const f = datei.files && datei.files[0]; datei.value = ''; if (!f) return;
      if (f.size > 3e6) { melde('Datei zu groß.'); return; }
      const l = new FileReader();
      l.onload = function () { let q = null; try { q = JSON.parse(l.result); } catch (e) { q = null; } if (!q || !pruefeProjekt(q)) { melde('Keine gültige Projektdatei.'); return; } vorher(); P = q; ED.ansicht = null; ED.wahl = null; ED.wahlRaum = null; neu(); melde('Projekt geladen.'); };
      l.readAsText(f);
    });
    r.append(datei, knopf('Projekt öffnen …', function () { datei.click(); }));
    r.append(knopf('Beispiel laden', function () { Nachfrage('Beispielwohnung laden? Die aktuelle Planung wird ersetzt (vorher als Datei sichern).', function () { vorher(); P = beispiel(); ED.ansicht = null; ED.wahl = null; neu(); zeigeReiter('bauplan'); }); }));
    r.append(knopf('Neues leeres Projekt', function () { Nachfrage('Neues Projekt beginnen? Die aktuelle Planung wird ersetzt.', function () { vorher(); P = leer(); ED.ansicht = null; ED.wahl = null; neu(); zeigeReiter('bauplan'); }); }, 'gefahr'));
    z.append(r);
    z.append(el('p', 'klein', 'Alles bleibt in diesem Browser. Der Link zum Teilen enthält die Planung ohne Hintergrundbilder.'));
  }
  function leer() {
    const g = neueId('g');
    return { v: 1, projekt: { name: '', kunde: '', adresse: '', ersteller: '', firma: '', datum: heute(), zeichnung: '', revision: '', netz: 'TN-C-S', zvor: 0.35, maxRcd: 4, ausstattung: 1, symbol: 0.32, format: 'A3', ra: 30 }, geschosse: [{ id: g, name: 'Erdgeschoss', hoehe: 2.75, raum: 2.5, bildB: 0, bildX: 0, bildY: 0, bildDeck: 0.5 }], aktiv: g, raeume: [], geraete: [], kreise: [], rcds: [] };
  }

  // ---------- Start ----------
  function start() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(SPEICHER) || 'null'); } catch (e) { p = null; }
    P = p && pruefeProjekt(p) ? p : beispiel();
    pruefeProjekt(P);
    R = berechnen(P);
    paletteBauen();
    zeigerEinrichten();
    document.addEventListener('keydown', tasten);
    document.querySelectorAll('[data-reiter]').forEach(function (k) { k.addEventListener('click', function () { zeigeReiter(k.getAttribute('data-reiter')); }); });
    $('ep-undo').addEventListener('click', function () { rueck(undo, redo); });
    $('ep-redo').addEventListener('click', function () { rueck(redo, undo); });
    $('ep-zoom-plus').addEventListener('click', function () { zoom(0.75); });
    $('ep-zoom-minus').addEventListener('click', function () { zoom(1.33); });
    $('ep-einpassen').addEventListener('click', function () { ED.ansicht = null; ansichtEinpassen(); bauplanZeichnen(); });
    $('ep-raster').addEventListener('change', function () { ED.raster = $('ep-raster').checked; bauplanZeichnen(); });
    $('ep-leitungen').addEventListener('change', function () { ED.leitungen = $('ep-leitungen').checked; bauplanZeichnen(); });
    $('ep-drucken').addEventListener('click', function () { drucken(false); });
    $('ep-drucken-eins').addEventListener('click', function () { drucken(true); });
    $('ep-svg').addEventListener('click', function () { if (!mappe) mappe = planMappe(); herunterladen(dateiname('-blatt-' + mappe[blattWahl].nr + '.svg'), mappe[blattWahl].svg, 'image/svg+xml'); });
    $('ep-vorher').addEventListener('click', function () { blattWahl = Math.max(0, blattWahl - 1); plaeneZeigen(); });
    $('ep-nachher').addEventListener('click', function () { blattWahl = Math.min(mappe.length - 1, blattWahl + 1); plaeneZeigen(); });
    // Link teilen
    $('ep-teilen').addEventListener('click', function () { Teilen.url('plan', P).then(function (url) { Teilen.kopieren(url, melde); }); });
    if (Teilen.druckLink) Teilen.druckLink(function () { return Teilen.url('plan', P); });
    const vorherKnopf = Teilen.knopf($('ep-teilen').parentNode, SPEICHER, function (roh) {
      let q = null; try { q = JSON.parse(roh); } catch (e) { q = null; }
      if (!q || !pruefeProjekt(q)) { melde('Keine gültige vorherige Planung gefunden.'); return; }
      vorher(); P = q; ED.ansicht = null; neu(); melde('Vorherige Planung wiederhergestellt.');
    }, 'Planung');
    Teilen.lesen('plan').then(function (q) {
      if (!q) return;
      if (!pruefeProjekt(q)) throw new Error('ungültig');
      const roh = JSON.stringify(q), gesichert = Teilen.sichern(SPEICHER, roh);
      P = q; try { localStorage.setItem(SPEICHER, roh); } catch (e) { /* ohne Speicher */ }
      ED.ansicht = null; neu(); if (vorherKnopf && vorherKnopf.zeigen) vorherKnopf.zeigen();
      melde('Planung aus dem Link geladen.' + (gesichert ? ' Deine vorherige Planung ist gesichert.' : ''));
    }).catch(function () { melde('Der Link ist unvollständig oder beschädigt – es bleibt die gespeicherte Planung.'); });
    window.addEventListener('pagehide', function () { speichern(true); });
    window.addEventListener('resize', function () { if (reiter === 'bauplan' && ED.ansicht) bauplanZeichnen(); });
    werkzeug('wahl');
    const anker = (location.hash || '').replace('#', '');
    zaehlerZeigen();
    zeigeReiter(['kreise', 'plaene', 'listen', 'pruefung', 'projekt'].indexOf(anker) >= 0 ? anker : 'bauplan');
    knoepfeUndo();
  }
  function sammlungBauen() {
    const z = $('ep-sammlung'); if (!z || !window.Formel) return;
    [
      ['Spannungsfall Wechselstrom', '\\Delta u = \\frac{2 \\, l \\, I \\cos\\varphi}{\\kappa \\, A \\, U_0} \\cdot 100\\,\\% \\le 3\\,\\%', 'gerechnet mit dem Bemessungsstrom des Leitungsschutzschalters, κ = 56 m/(Ω·mm²) für Kupfer'],
      ['Spannungsfall Drehstrom', '\\Delta u = \\frac{\\sqrt{3} \\, l \\, I \\cos\\varphi}{\\kappa \\, A \\, U} \\cdot 100\\,\\%', 'U = 400 V zwischen den Außenleitern'],
      ['Leiterwiderstand', 'R = \\frac{l}{\\kappa \\, A}, \\quad R_{80} = 1{,}24 \\cdot R_{20}', 'für die Abschaltbedingung mit der Leitertemperatur 80 °C'],
      ['Abschaltbedingung (TN-System)', 'Z_\\text{S} = Z_\\text{vor} + 2 \\, R_{80} \\le \\frac{U_0}{I_\\text{a}}', 'I_a = 5 · I_n bei Typ B, 10 · I_n bei Typ C; Abschaltung in 0,4 s'],
      ['Überstromschutz', 'I_\\text{b} \\le I_\\text{n} \\le I_\\text{z}', 'Iz nach DIN VDE 0298-4 für Verlegeart A1, B2 oder C'],
      ['Bemessungsstrom aus der Leistung', 'I = \\frac{P}{U_0} \\ (1\\sim), \\quad I = \\frac{P}{\\sqrt{3} \\, U} \\ (3\\sim)', 'U0 = 230 V, U = 400 V'],
      ['Fehlerschutz im TT-System', 'R_\\text{A} \\cdot I_{\\Delta n} \\le 50\\,\\text{V}', 'Erdungswiderstand mal Bemessungsdifferenzstrom des RCD']
    ].forEach(function (q) { const s = el('section'), f = el('div'); s.append(el('h3', '', q[0])); Formel.setze(f, q[1], true); s.append(f, el('p', '', q[2])); z.append(s); });
  }
  sammlungBauen();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  // für Tests
  window.Elektroplanung = { projekt: function () { return P; }, ergebnis: function () { return R; }, mappe: function () { return planMappe(); }, beispiel: beispiel, pruefe: pruefeProjekt, berechnen: berechnen };
})();
