/*
 * Gemeinsame Helfer für alle Seiten der Sammlung
 * ==============================================
 * Im <head> einbinden (ohne defer, damit das Farbthema sofort sitzt):
 *   <script src="../assets/basis.js"></script>
 *
 * Auf der Seite:
 *   <div id="seitenkopf" data-wurzel="../"></div>   → Kopfzeile mit Marke, Navigation, Hell/Dunkel
 *   <div id="seitenfuss" data-wurzel="../"></div>   → Fußzeile
 *   <span data-tex="Q = m \cdot c \cdot \Delta T"></span>          → Formel (KaTeX, im Text)
 *   <div data-tex-block="W = \frac{Q}{3600}"></div>                  → Formel als eigene Zeile
 *
 * In Skripten:
 *   Formel.setze(element, 'U = R \\cdot I', true)
 *   Thema.farbe('--text')     → aktuelle Farbe aus stil.css (z. B. für Canvas)
 *   document.addEventListener('themawechsel', …)
 *   Teilen.url('plan', objekt) / Teilen.lesen('plan') / Teilen.uebernehmen(…)   → Links zum Teilen (siehe unten)
 */
(function () {
  'use strict';

  // ---------- Farbthema ----------
  const SPEICHER = 'sammlung-thema';

  function gespeichertesThema() {
    try { return localStorage.getItem(SPEICHER); } catch (e) { return null; }
  }

  function aktuellesThema() {
    const gesetzt = document.documentElement.getAttribute('data-thema');
    if (gesetzt) return gesetzt;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dunkel' : 'hell';
  }

  function themaSetzen(thema, merken) {
    document.documentElement.setAttribute('data-thema', thema);
    if (merken) { try { localStorage.setItem(SPEICHER, thema); } catch (e) { /* privates Fenster */ } }
    document.dispatchEvent(new CustomEvent('themawechsel', { detail: thema }));
    schalterAktualisieren();
  }

  const vorher = gespeichertesThema();
  if (vorher === 'hell' || vorher === 'dunkel') document.documentElement.setAttribute('data-thema', vorher);

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const folgen = function () { if (!gespeichertesThema()) document.dispatchEvent(new CustomEvent('themawechsel', { detail: aktuellesThema() })); };
    if (mq.addEventListener) mq.addEventListener('change', folgen); else if (mq.addListener) mq.addListener(folgen);
  }

  window.Thema = {
    aktuell: aktuellesThema,
    setze: function (t) { themaSetzen(t, true); },
    // Wert einer CSS-Variablen aus stil.css, z. B. für Zeichnungen auf Canvas
    farbe: function (name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
  };

  const MOND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const SONNE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function schalterAktualisieren() {
    document.querySelectorAll('.themenschalter').forEach(function (k) {
      const dunkel = aktuellesThema() === 'dunkel';
      k.innerHTML = dunkel ? SONNE : MOND;
      k.setAttribute('aria-label', dunkel ? 'Helles Design' : 'Dunkles Design');
      k.title = k.getAttribute('aria-label');
    });
  }


  // ---------- Formeln mit KaTeX ----------
  window.Formel = {
    setze: function (element, tex, block) {
      if (!window.katex) { element.textContent = tex; return; }
      element.setAttribute('data-formel', tex);   // Quelle bleibt lesbar (Lernbereich)
      tex = String(tex).replace(/€/g, 'Euro');   // KaTeX kennt kein Eurozeichen
      // In \text{…} kennt KaTeX keine Mathezeichen: „N·m“ erschien sonst als „N\cdotpm“, „\mu F“ als „\muF“.
      // Solche Zeichen aus dem Text herauslösen und im Formelsatz setzen.
      tex = tex.replace(/\\text\{([^{}]*)\}/g, function (ganz, inhalt) {
        if (!/[·µ≠∑]|\\mu/.test(inhalt)) return ganz;
        return inhalt.split(/(·|µ|≠|∑|\\mu ?)/).map(function (t) {
          if (t === '·') return '\\cdot ';
          if (t === 'µ' || /^\\mu ?$/.test(t)) return '\\mu ';
          if (t === '≠') return '\\neq ';
          if (t === '∑') return '\\sum ';
          return t ? '\\text{' + t + '}' : '';
        }).join('');
      });
      try {
        window.katex.render(tex, element, {
          displayMode: !!block, throwOnError: false, strict: 'ignore', output: 'html',
          // \htmlClass{ergebnis}{…} erlaubt, damit Ergebnisse im Farbthema erscheinen
          trust: function (k) { return k.command === '\\htmlClass'; }
        });
      } catch (e) {
        element.textContent = tex;
      }
    },
    alle: function (wurzel) {
      (wurzel || document).querySelectorAll('[data-tex], [data-tex-block]').forEach(function (el) {
        const block = el.hasAttribute('data-tex-block');
        Formel.setze(el, el.getAttribute(block ? 'data-tex-block' : 'data-tex'), block);
      });
    },
    // Zahl für LaTeX: deutsches Komma ohne Zwischenraum, schmales Leerzeichen als Tausendertrenner
    zahl: function (text) {
      // erst das Komma, dann das Leerzeichen (sonst würde das Komma in \\, mit ersetzt)
      return String(text).replace(/,/g, '{,}').replace(/\u202F/g, '\\,').replace(/−/g, '-');
    }
  };


  // ---------- Favoriten: nur in diesem Browser gespeichert ----------
  // Liste von Pfaden relativ zur Startseite, z. B. "it/usv.html"; Ereignis „favoritenwechsel“ bei jeder Änderung
  const FAV_SPEICHER = 'favoriten-1';
  const FAV_MUSTER = /^[a-z0-9][a-z0-9-]{0,60}(\/[a-z0-9][a-z0-9-]{0,60})?\.html$/;
  let favNotfall = [];   // falls der Browser keinen Speicher erlaubt: wenigstens bis zum Neuladen
  function favLesen() {
    let a = null;
    try { a = JSON.parse(localStorage.getItem(FAV_SPEICHER) || 'null'); } catch (e) { a = null; }
    if (!Array.isArray(a)) a = favNotfall;
    return a.filter(function (p, i) { return typeof p === 'string' && FAV_MUSTER.test(p) && p !== 'index.html' && a.indexOf(p) === i; }).slice(0, 300);
  }
  function favSchreiben(a) {
    favNotfall = a.slice();
    try { localStorage.setItem(FAV_SPEICHER, JSON.stringify(a)); } catch (e) { /* privates Fenster */ }
    document.dispatchEvent(new CustomEvent('favoritenwechsel'));
  }
  // Pfad dieser Seite relativ zur Startseite (aus data-wurzel); null auf der Startseite
  function favPfadHier() {
    const kopf = document.getElementById('seitenkopf');
    const tiefe = ((kopf && kopf.getAttribute('data-wurzel')) || '').split('../').length - 1;
    const teile = location.pathname.split('/').filter(Boolean);
    let p = '';
    try { p = teile.slice(-(tiefe + 1)).map(decodeURIComponent).join('/'); } catch (e) { return null; }
    return FAV_MUSTER.test(p) && p !== 'index.html' ? p : null;
  }
  window.Favoriten = {
    liste: favLesen,
    ist: function (p) { return favLesen().indexOf(p) >= 0; },
    setze: function (p, an) {
      if (typeof p !== 'string' || !FAV_MUSTER.test(p)) return;
      const a = favLesen().filter(function (x) { return x !== p; });
      if (an) a.push(p);
      favSchreiben(a);
    },
    umschalten: function (p) { const an = !this.ist(p); this.setze(p, an); return an; },
    hier: favPfadHier
  };
  window.addEventListener('storage', function (ev) { if (ev.key === FAV_SPEICHER) document.dispatchEvent(new CustomEvent('favoritenwechsel')); });
  const STERN = '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/></svg>';
  window.Favoriten.stern = STERN;
  function favKnopfAktualisieren() {
    const p = favPfadHier();
    document.querySelectorAll('.favorit-schalter').forEach(function (k) {
      const an = !!p && favLesen().indexOf(p) >= 0;
      k.setAttribute('aria-pressed', String(an));
      k.setAttribute('aria-label', an ? 'Aus den Favoriten entfernen' : 'Zu den Favoriten hinzufügen');
      k.title = an ? 'Favorit – auf der Übersicht unter „Favoriten“' : 'Als Favorit merken';
    });
  }
  document.addEventListener('favoritenwechsel', favKnopfAktualisieren);

  // ---------- Zuletzt geöffnet: die letzten Seiten für die Übersicht, nur in diesem Browser ----------
  const ZULETZT_SPEICHER = 'zuletzt-1';
  function zuletztLesen() {
    let a = null;
    try { a = JSON.parse(localStorage.getItem(ZULETZT_SPEICHER) || 'null'); } catch (e) { a = null; }
    if (!Array.isArray(a)) return [];
    return a.filter(function (p, i) { return typeof p === 'string' && FAV_MUSTER.test(p) && p !== 'index.html' && a.indexOf(p) === i; }).slice(0, 8);
  }
  window.Zuletzt = {
    liste: zuletztLesen,
    leeren: function () { try { localStorage.removeItem(ZULETZT_SPEICHER); } catch (e) { /* egal */ } }
  };
  document.addEventListener('DOMContentLoaded', function () {
    const p = favPfadHier();
    if (!p) return;
    const a = [p].concat(zuletztLesen().filter(function (x) { return x !== p; })).slice(0, 8);
    try { localStorage.setItem(ZULETZT_SPEICHER, JSON.stringify(a)); } catch (e) { /* privates Fenster */ }
  });

  // ---------- Bedienung: Fokus in Fenstern halten, Enter springt im Rechner zum nächsten Feld ----------
  const FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  function sichtbar(e) { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }
  // Tab bleibt im offenen Fenster (Suche, Daten sichern)
  function fokusFalle(dlg) {
    dlg.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      const f = Array.prototype.filter.call(dlg.querySelectorAll(FOKUSSIERBAR), sichtbar);
      if (!f.length) return;
      const erstes = f[0], letztes = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === erstes) { ev.preventDefault(); letztes.focus(); }
      else if (!ev.shiftKey && document.activeElement === letztes) { ev.preventDefault(); erstes.focus(); }
    });
  }
  // Zahlenfelder der Rechner: Enter (Handy: „Weiter“) springt ins nächste Feld, im letzten schließt es die Tastatur
  function zahlenfelder(bei) {
    const bereich = (bei && (bei.closest('.tafel') || bei.closest('section'))) || document.querySelector('main') || document;
    return Array.prototype.filter.call(bereich.querySelectorAll('input[inputmode="decimal"]'), function (e) { return !e.disabled && !e.readOnly && !e.closest('form') && sichtbar(e); });
  }
  document.addEventListener('focusin', function (ev) {
    const e = ev.target;
    if (!e || e.tagName !== 'INPUT' || e.getAttribute('inputmode') !== 'decimal' || e.closest('form')) return;
    const f = zahlenfelder(e), i = f.indexOf(e);
    if (i >= 0) e.enterKeyHint = i < f.length - 1 ? 'next' : 'done';
  });
  document.addEventListener('keydown', function (ev) {
    const e = ev.target;
    if (ev.key !== 'Enter' || ev.defaultPrevented || ev.shiftKey || ev.ctrlKey || ev.metaKey || ev.altKey || ev.isComposing) return;
    if (!e || e.tagName !== 'INPUT' || e.getAttribute('inputmode') !== 'decimal' || e.closest('form')) return;
    const f = zahlenfelder(e), i = f.indexOf(e);
    if (i < 0) return;
    ev.preventDefault();
    if (i < f.length - 1) { f[i + 1].focus(); try { f[i + 1].select(); } catch (x) { /* egal */ } }
    else e.blur();
  });

  // freier Platz unten: feste Leisten der Seite (z. B. Reiterleiste im Lernbereich auf dem Handy) nicht verdecken
  function untenBelegt() {
    let e = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 3), h = 0;
    while (e && e !== document.body && e !== document.documentElement) {
      const st = getComputedStyle(e);
      if (st.position === 'fixed' && !e.classList.contains('daten-hinweis') && !e.classList.contains('nach-oben')) { h = Math.max(0, window.innerHeight - e.getBoundingClientRect().top); break; }
      e = e.parentElement;
    }
    return Math.min(h, 160);
  }
  function untenSetzen() { document.documentElement.style.setProperty('--unten-frei', untenBelegt() + 'px'); }
  // Knopf „nach oben“ auf langen Seiten
  function nachObenEinrichten() {
    const k = document.createElement('button');
    k.type = 'button'; k.className = 'nach-oben'; k.hidden = true; k.setAttribute('aria-label', 'Nach oben'); k.title = 'Nach oben';
    k.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
    k.addEventListener('click', function () {
      const ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: ruhig ? 'auto' : 'smooth' });
      const ziel = document.querySelector('main h1') || document.querySelector('main');
      if (ziel) { if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1'); setTimeout(function () { ziel.focus({ preventScroll: true }); }, 300); }
    });
    document.body.append(k);
    // erscheint nur beim Hochscrollen (wer nach oben will, scrollt meist schon hoch) und verschwindet nach kurzer Ruhe,
    // damit er keine Knöpfe am rechten Rand verdeckt
    let laeuft = false, letzteY = window.scrollY, ruhe = 0;
    const pruefen = function () {
      laeuft = false;
      const y = window.scrollY, hoch = y < letzteY - 4, runter = y > letzteY + 4;
      if (hoch || runter) letzteY = y;
      const lang = document.documentElement.scrollHeight > window.innerHeight * 3;
      if (hoch && lang && y > window.innerHeight * 1.5) {
        if (k.hidden) untenSetzen();
        k.hidden = false;
        clearTimeout(ruhe); ruhe = setTimeout(function () { if (document.activeElement !== k && !k.matches(':hover')) k.hidden = true; }, 2600);
      } else if (runter || y < window.innerHeight) k.hidden = true;
    };
    window.addEventListener('scroll', function () { if (!laeuft) { laeuft = true; requestAnimationFrame(pruefen); } }, { passive: true });
    window.addEventListener('resize', untenSetzen);
  }

  // ---------- Breite Inhalte (Rechenweg, Tabellen): Verlauf am Rand zeigt, dass man seitlich wischen kann ----------
  function ueberlaufMarkieren() {
    document.querySelectorAll('.weg .rechnung, .rahmen').forEach(function (e) {
      const mehr = e.scrollWidth > e.clientWidth + 2;
      e.classList.toggle('mehr-rechts', mehr && e.scrollLeft + e.clientWidth < e.scrollWidth - 2);
      e.classList.toggle('mehr-links', mehr && e.scrollLeft > 2);
    });
  }
  // Felder in Tabellen ohne Beschriftung (z. B. Protokolle): Spaltenkopf und Zeilenanfang als Namen für Vorleseprogramme
  function tabellenFelderBeschriften() {
    const kurz = function (z) { if (!z) return ''; const t = (z.querySelector('b, strong, label, span') || z).textContent; return t.split('ⓘ')[0].replace(/\s+/g, ' ').trim().replace(/:$/, '').slice(0, 70); };
    document.querySelectorAll('input:not([type=hidden]):not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label])').forEach(function (e) {
      if ((e.id && document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(e.id) : e.id) + '"]')) || e.closest('label') || e.title) return;
      const paar = e.closest('.paar'), pn = paar && paar.querySelector('.paar-name');
      if (pn) { const n = kurz(pn); if (n) e.setAttribute('aria-label', n); return; }
      const td = e.closest('td'), tr = td && td.parentElement, tab = tr && tr.closest('table');
      if (!tab) { if (e.placeholder) e.setAttribute('aria-label', e.placeholder.slice(0, 80)); return; }
      const vor = td.previousElementSibling;
      if (vor && (vor.tagName === 'TH' || vor.classList.contains('label'))) { const n = kurz(vor); if (n) { e.setAttribute('aria-label', n); return; } }
      const i = Array.prototype.indexOf.call(tr.children, td);
      const kopfZeile = tab.tHead && tab.tHead.rows[tab.tHead.rows.length - 1];
      const kopf = kopfZeile && kopfZeile.cells[i] ? kurz(kopfZeile.cells[i]) : '';
      const zeile = tr.cells[0] && tr.cells[0] !== td ? kurz(tr.cells[0]) : '';
      const name = [kopf, zeile].filter(Boolean).join(', ').replace(/\s+/g, ' ').slice(0, 120);
      if (name) e.setAttribute('aria-label', name);
    });
  }
  let ueberlaufPlan = 0;
  // gedrosselt statt entprellt: Animationen ändern laufend Text, sonst käme die Prüfung nie dran
  function ueberlaufSpaeter() { if (!ueberlaufPlan) ueberlaufPlan = setTimeout(function () { ueberlaufPlan = 0; ueberlaufMarkieren(); tabellenFelderBeschriften(); }, 150); }
  document.addEventListener('scroll', function (ev) {
    const e = ev.target;
    if (e && e.classList && (e.classList.contains('rechnung') || e.classList.contains('rahmen'))) {
      const mehr = e.scrollWidth > e.clientWidth + 2;
      e.classList.toggle('mehr-rechts', mehr && e.scrollLeft + e.clientWidth < e.scrollWidth - 2);
      e.classList.toggle('mehr-links', mehr && e.scrollLeft > 2);
    }
  }, true);
  function ueberlaufEinrichten() {
    ueberlaufSpaeter();
    window.addEventListener('resize', ueberlaufSpaeter);
    const m = document.querySelector('main') || document.body;
    if (m && window.MutationObserver) new MutationObserver(ueberlaufSpaeter).observe(m, { childList: true, subtree: true });
  }

  // ---------- Stichwortsuche über alle Seiten und Aufgabenblätter ----------
  // Der Index (suchindex.json) entsteht mit node werkzeuge/suche-bauen.js und wird erst beim ersten Öffnen geladen.
  const LUPE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';
  const Suche = (function () {
    let index = null, laden = null, dlg = null, feld = null, liste = null, info = null, wurzel = '', auswahl = -1, vorher = null;
    const ART = { a: 'Abschnitt', f: 'Formel', q: 'Frage', r: 'Rechner', b: 'Aufgabe' };
    // gleiche Schreibweisen: FI = RCD usw. (alles normalisiert)
    const SYNONYME = [
      ['fi', 'rcd', 'fehlerstrom', 'fehlerstromschutzschalter'], ['ls', 'leitungsschutzschalter', 'sicherungsautomat'], ['trafo', 'transformator'],
      ['pv', 'photovoltaik', 'solar', 'solaranlage'], ['bma', 'brandmeldeanlage', 'brandmelder'], ['ema', 'einbruchmeldeanlage', 'alarmanlage'],
      ['gma', 'gefahrenmeldeanlage'], ['wp', 'waermepumpe'], ['nym', 'mantelleitung'], ['usv', 'unterbrechungsfreie'], ['wlan', 'funknetz', 'wifi'],
      ['cos', 'leistungsfaktor'], ['kompensation', 'blindleistung'],
      ['akku', 'batterie', 'speicher'], ['kabel', 'leitung'], ['ohm', 'widerstand'], ['schwingkreis', 'resonanz'], ['filter', 'tiefpass', 'hochpass', 'siebschaltung'],
      ['drehstrom', 'dreiphasen', 'stern', 'dreieck'], ['rauchmelder', 'rauchwarnmelder'], ['loeschen', 'feuerloescher'], ['heizlast', 'heizung']
    ];
    function norm(t) {
      return String(t).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function abstand1(a, b) {   // höchstens ein Tipp-, Lösch- oder Einfügefehler bzw. vertauschte Nachbarn
      if (Math.abs(a.length - b.length) > 1) return false;
      let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
      if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
      return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
    }
    // Güte eines Suchworts in einem Text: ganzes Wort 3, Wortanfang 2, Teilwort 1,2, ein Tippfehler 0,8
    function guete(wort, t, mitTippfehler) {
      if (!t) return 0;
      if (t.indexOf(' ' + wort + ' ') >= 0) return 3;
      if (wort.length <= 2) return 0;   // ganz kurze Wörter (N, PE, FI) nur als ganzes Wort
      if (t.indexOf(' ' + wort) >= 0) return 2;
      if (wort.length <= 3) return 0;
      if (wort.length >= 3 && t.indexOf(wort) >= 0) return 1.2;
      if (mitTippfehler && wort.length >= 5) {
        const w = t.split(' ');
        for (let i = 0; i < w.length; i++) if (w[i].length >= 4 && (abstand1(wort, w[i]) || (w[i].length > wort.length && abstand1(wort, w[i].slice(0, wort.length))))) return 0.8;
      }
      return 0;
    }
    function varianten(wort) {
      const v = [wort];
      SYNONYME.forEach(function (g) { if (g.indexOf(wort) >= 0) g.forEach(function (x) { if (v.indexOf(x) < 0) v.push(x); }); });
      return v;
    }
    function vorbereiten(roh) {
      return roh.seiten.map(function (s) {
        const p = function (t) { return ' ' + norm(t) + ' '; };
        return { pfad: s[0], titel: s[1], text: s[2], bereich: s[3], nT: p(s[1]), nB: p(s[2]), nS: p(s[4] + ' ' + s[3]), nW: ' ' + s[5] + ' ',
          teile: s[6].map(function (t) { return { text: t[0], art: t[1], ziel: t[2], n: p(t[0]) }; }) };
      });
    }
    function suchen(anfrage) {
      let woerter = norm(anfrage).split(' ').filter(Boolean);
      if (!woerter.length || !index) return [];
      // zusammengeschrieben (Q-Label → qlabel, J-Y(St)Y → jystY) als eigenes Wort mitsuchen
      const ganz = woerter.length > 1 ? woerter.join('') : '';
      // ganz kurze Teile (Q in Q-Label) sind kein Muss, wenn es längere gibt
      const lang = woerter.filter(function (w) { return w.length > 2; });
      if (lang.length) woerter = lang;
      const gruppen = woerter.map(varianten);
      const ergebnis = [];
      index.forEach(function (s) {
        let summe = 0, ok = true;
        const teilPunkte = s.teile.map(function () { return 0; });
        for (let g = 0; g < gruppen.length && ok; g++) {
          let best = 0;
          gruppen[g].forEach(function (w, vi) {
            const f = vi ? 0.85 : 1;   // Synonym etwas schwächer
            best = Math.max(best, f * 10 * guete(w, s.nT, true), f * 6 * guete(w, s.nS, true), f * 3 * guete(w, s.nB, false), f * 1.5 * guete(w, s.nW, w.length >= 6));
            s.teile.forEach(function (t, i) { const q = f * guete(w, t.n, true); if (q) { teilPunkte[i] += q; best = Math.max(best, 5 * q); } });
          });
          if (!best) ok = false; else summe += best;
        }
        if (ganz) {
          const g = Math.max(10 * guete(ganz, s.nT, false), 6 * guete(ganz, s.nS, false), 3 * guete(ganz, s.nB, false), 2 * guete(ganz, s.nW, false));
          s.teile.forEach(function (t, i) { const q = guete(ganz, t.n, false); if (q) teilPunkte[i] += 2 * q; });
          if (g) { summe = (ok ? summe : 0) + 2 * g; ok = true; }
        }
        if (!ok) return;
        const treffer = s.teile.map(function (t, i) { return [teilPunkte[i], t]; }).filter(function (x) { return x[0] > 0; })
          .sort(function (a, b) { return b[0] - a[0]; }).slice(0, 4).map(function (x) { return x[1]; });
        ergebnis.push({ s: s, punkte: summe + (s.pfad.indexOf('lernen.html#blatt=') === 0 ? -1 : 0), teile: treffer });
      });
      return ergebnis.sort(function (a, b) { return b.punkte - a.punkte; }).slice(0, 30);
    }
    function link(s, t) {
      if (s.pfad.indexOf('#') >= 0 || !t) return wurzel + s.pfad;
      if (t.ziel) return wurzel + s.pfad + t.ziel;
      // Textfragment: springt zur Stelle und markiert sie (Browser ohne Unterstützung öffnen einfach die Seite)
      return wurzel + s.pfad + '#:~:text=' + encodeURIComponent(t.text).replace(/-/g, '%2D');
    }
    function knoten(tag, klasse, txt) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (txt !== undefined) e.textContent = txt; return e; }
    function zeigen() {
      const q = feld.value;
      liste.innerHTML = ''; auswahl = -1;
      if (!index) { info.textContent = laden ? 'Suchindex wird geladen …' : 'Die Suche ist gerade nicht verfügbar.'; return; }
      if (!norm(q)) {
        info.textContent = 'Stichwort eingeben – gesucht wird in allen Rechnern, Formeln, Erklärungen, häufigen Fragen und Aufgabenblättern.';
        const bsp = knoten('div', 'suche-beispiele');
        ['Resonanz', 'Neutralleiter', 'Q-Label', 'Legionellen', 'Schleifenimpedanz', 'Subnetz', 'Sternpunkt'].forEach(function (b) {
          const k = knoten('button', 'chip', b); k.type = 'button';
          k.addEventListener('click', function () { feld.value = b; zeigen(); feld.focus(); });
          bsp.append(k);
        });
        liste.append(bsp);
        return;
      }
      const e = suchen(q);
      info.textContent = e.length ? e.length + (e.length === 30 ? '+' : '') + ' Treffer' : 'Nichts gefunden. Anderes Wort oder kürzer versuchen (z. B. „Leitung“ statt „Leitungen“).';
      e.forEach(function (r) {
        const li = knoten('li', 'suche-treffer');
        const a = knoten('a', 'suche-haupt'); a.href = link(r.s);
        a.append(knoten('b', '', r.s.titel));
        if (r.s.bereich) a.append(knoten('span', 'suche-bereich', r.s.bereich));
        if (r.s.text) a.append(knoten('small', '', r.s.text.length > 150 ? r.s.text.slice(0, 147) + ' …' : r.s.text));
        li.append(a);
        if (r.teile.length) {
          const u = knoten('div', 'suche-teile');
          r.teile.forEach(function (t) {
            const b = knoten('a', 'suche-teil'); b.href = link(r.s, t);
            b.append(knoten('span', 'suche-art', ART[t.art] || ''), document.createTextNode(t.text));
            u.append(b);
          });
          li.append(u);
        }
        liste.append(li);
      });
    }
    function markieren(neu) {
      const links = liste.querySelectorAll('a');
      if (!links.length) return;
      auswahl = Math.max(0, Math.min(links.length - 1, neu));
      links.forEach(function (l, i) { l.classList.toggle('aktiv', i === auswahl); });
      links[auswahl].scrollIntoView({ block: 'nearest' });
    }
    function bauen() {
      dlg = knoten('div', 'suche-schicht'); dlg.hidden = true;
      dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Stichwortsuche');
      const box = knoten('div', 'suche-box');
      const kopf = knoten('div', 'suche-kopf');
      const l = knoten('span', 'suche-lupe'); l.innerHTML = LUPE;
      feld = knoten('input'); feld.type = 'search'; feld.placeholder = 'Stichwort, z. B. Resonanz, FI, Taupunkt'; feld.setAttribute('aria-label', 'Stichwort');
      feld.setAttribute('data-nicht-merken', ''); feld.autocomplete = 'off'; feld.spellcheck = false; feld.enterKeyHint = 'search';
      const zu = knoten('button', 'suche-zu', 'Schließen'); zu.type = 'button';
      kopf.append(l, feld, zu);
      info = knoten('p', 'suche-info'); info.setAttribute('aria-live', 'polite');
      liste = knoten('ul', 'suche-liste');
      box.append(kopf, info, liste); dlg.append(box);
      document.body.append(dlg);
      fokusFalle(dlg);
      feld.addEventListener('input', zeigen);
      zu.addEventListener('click', schliessen);
      dlg.addEventListener('click', function (ev) { if (ev.target === dlg) schliessen(); });
      dlg.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); schliessen(); }
        else if (ev.key === 'ArrowDown') { ev.preventDefault(); markieren(auswahl + 1); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); if (auswahl <= 0) { auswahl = -1; feld.focus(); } else markieren(auswahl - 1); }
        else if (ev.key === 'Enter' && ev.target === feld) {
          const links = liste.querySelectorAll('a'); const z = links[auswahl >= 0 ? auswahl : 0];
          if (z) { ev.preventDefault(); location.href = z.href; }
        }
      });
      liste.addEventListener('click', function (ev) { if (ev.target.closest && ev.target.closest('a')) schliessen(true); });
    }
    // Index einmal laden; gemeinsam für das Suchfenster und die Suche der Startseite
    function indexLaden(w) {
      if (w !== undefined) wurzel = w || '';
      if (index) return Promise.resolve(true);
      if (!laden) {
        laden = fetch(wurzel + 'suchindex.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
          .then(function (roh) { index = vorbereiten(roh); laden = null; if (dlg && !dlg.hidden) zeigen(); return true; })
          .catch(function () { laden = null; if (dlg && !dlg.hidden) zeigen(); return false; });
      }
      return laden;
    }
    function oeffnen(w, anfrage) {
      wurzel = w || '';
      if (!dlg) bauen();
      vorher = document.activeElement;
      dlg.hidden = false; document.documentElement.classList.add('suche-offen');
      if (typeof anfrage === 'string') feld.value = anfrage.slice(0, 120);
      feld.focus(); feld.select();
      indexLaden(wurzel);
      zeigen();
    }
    function schliessen(beimSprung) {
      if (!dlg || dlg.hidden) return;
      dlg.hidden = true; document.documentElement.classList.remove('suche-offen');
      if (!beimSprung && vorher && vorher.focus) vorher.focus();
    }
    document.addEventListener('keydown', function (ev) {
      const t = ev.target, schreibt = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if ((ev.key === 'k' || ev.key === 'K') && (ev.ctrlKey || ev.metaKey) && !ev.altKey) {
        const k = document.querySelector('.suche-knopf'); if (!k) return;
        ev.preventDefault(); k.click();
      } else if (ev.key === '/' && !schreibt && !ev.ctrlKey && !ev.metaKey && !ev.altKey && (!dlg || dlg.hidden)) {
        const k = document.querySelector('.suche-knopf'); if (!k) return;
        ev.preventDefault(); k.click();
      }
    });
    // Treffer mit fertigen Links (für die Startseite): Seiten nach Güte, je Seite die passendsten Stellen
    function treffer(q) {
      return suchen(q).map(function (r) {
        return { pfad: r.s.pfad, titel: r.s.titel, bereich: r.s.bereich, text: r.s.text, punkte: r.punkte, href: link(r.s),
          teile: r.teile.map(function (t) { return { text: t.text, art: ART[t.art] || '', href: link(r.s, t) }; }) };
      });
    }
    return { oeffnen: oeffnen, laden: indexLaden, treffer: treffer, norm: norm, suchen: function (q) { return suchen(q).map(function (r) { return [r.s.pfad, r.s.titel, r.teile.map(function (t) { return t.text; })]; }); }, bereit: function () { return !!index; } };
  })();
  window.Suche = Suche;

  // ---------- Eigene Daten schützen: dauerhafter Speicher, Gesamtsicherung, Erinnerung ----------
  // Alles, was die Seiten merken, liegt im localStorage dieses Geräts. Die Sicherung schreibt alle Schlüssel
  // dieser Adresse in eine Datei; Wiederherstellen liest sie geprüft ein (vorheriger Stand bleibt zum Zurückholen).
  const Daten = (function () {
    const APP = 'formeln-rechner', ZULETZT_GESICHERT = 'sicherung-datum', ERINNERT = 'sicherung-erinnert', DAUERHAFT = 'sicherung-dauerhaft',
      VOR_IMPORT = 'sicherung-vor-import', ERSTE_DATEN = 'sicherung-erste-daten', TAGE = 30, TAG = 864e5;
    // zählen nicht als eigene Daten
    const NEBENSACHE = function (k) { return k === 'sammlung-thema' || k === 'zuletzt-1' || k.indexOf('sicherung-') === 0 || /:vorher$/.test(k); };
    let dlg = null, vorherFokus = null;
    function schluessel() { const a = []; try { for (let i = 0; i < localStorage.length; i++) a.push(localStorage.key(i)); } catch (e) { /* ohne Speicher */ } return a.filter(function (k) { return typeof k === 'string'; }); }
    function eigene() { return schluessel().filter(function (k) { return !NEBENSACHE(k); }); }
    const iOS = function () { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); };
    const alsApp = function () { return navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); };
    function datum(ms) { const d = new Date(ms); return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    function tageSeit(ms) { return Math.floor((Date.now() - ms) / TAG); }
    // 1. Browser bitten, die Daten nicht von selbst zu löschen (einmal, sobald es eigene Daten gibt)
    function dauerhaftAnfordern() {
      if (!navigator.storage || !navigator.storage.persist || lsLesen(DAUERHAFT)) return;
      if (!eigene().length) return;
      navigator.storage.persisted().then(function (ja) { return ja || navigator.storage.persist(); })
        .then(function (ja) { lsSchreiben(DAUERHAFT, ja ? 'ja' : 'nein'); }).catch(function () { /* egal */ });
    }
    function paket() {
      const daten = {};
      schluessel().forEach(function (k) { if (k.indexOf('sicherung-') !== 0) { const v = lsLesen(k); if (v !== null) daten[k] = v; } });
      return { app: APP, version: 1, erstellt: new Date().toISOString(), adresse: location.origin, daten: daten };
    }
    // 2. Gesamtsicherung als Datei
    function sichern() {
      const p = paket(), text = JSON.stringify(p);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      a.download = 'formeln-rechner-sicherung-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.append(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      lsSchreiben(ZULETZT_GESICHERT, String(Date.now()));
      hinweisWeg();
      return Object.keys(p.daten).length;
    }
    // strenge Prüfung der Datei: nur Text-Schlüssel und Text-Werte in vernünftiger Größe
    function pruefen(roh) {
      let p; try { p = JSON.parse(roh); } catch (e) { throw new Error('Die Datei ist keine gültige Sicherung (kein JSON).'); }
      if (!p || typeof p !== 'object' || p.app !== APP || !p.daten || typeof p.daten !== 'object' || Array.isArray(p.daten)) throw new Error('Die Datei ist keine Sicherung dieser Sammlung.');
      const d = {}; let summe = 0, n = 0;
      Object.keys(p.daten).forEach(function (k) {
        const v = p.daten[k];
        if (typeof k !== 'string' || !k || k.length > 200 || k.indexOf('sicherung-') === 0 || typeof v !== 'string' || v.length > 2e6) return;
        summe += k.length + v.length; n++; d[k] = v;
      });
      if (!n) throw new Error('In der Datei stehen keine Daten.');
      if (summe > 4.5e6) throw new Error('Die Sicherung ist zu groß für den Speicher des Browsers.');
      return { daten: d, erstellt: typeof p.erstellt === 'string' ? Date.parse(p.erstellt) : NaN };
    }
    // 3. Wiederherstellen: vorher den jetzigen Stand sichern, dann übernehmen (vorhandene Schlüssel werden ersetzt, andere bleiben)
    function einspielen(daten) {
      const vorher = paket();
      try { localStorage.setItem(VOR_IMPORT, JSON.stringify(vorher)); } catch (e) { /* zu groß: ohne Rückweg */ }
      let ok = 0;
      Object.keys(daten).forEach(function (k) { try { localStorage.setItem(k, daten[k]); ok++; } catch (e) { /* voll */ } });
      return ok;
    }
    function zurueck() {
      const t = lsLesen(VOR_IMPORT); if (!t) return false;
      let p; try { p = JSON.parse(t); } catch (e) { return false; }
      if (!p || !p.daten) return false;
      schluessel().forEach(function (k) { if (k.indexOf('sicherung-') !== 0) lsSchreiben(k, null); });
      Object.keys(p.daten).forEach(function (k) { if (typeof p.daten[k] === 'string') lsSchreiben(k, p.daten[k]); });
      lsSchreiben(VOR_IMPORT, null);
      return true;
    }
    function knoten(tag, klasse, txt) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (txt !== undefined) e.textContent = txt; return e; }
    // neu laden, ohne dass die Seiten beim Verlassen (pagehide) ihren alten Stand über den eingespielten schreiben
    function neuLaden() {
      setTimeout(function () {
        try { Storage.prototype.setItem = function () {}; Storage.prototype.removeItem = function () {}; } catch (e) { /* egal */ }
        location.reload();
      }, 1600);
    }
    const eintraege = function (n) { return n + (n === 1 ? ' Eintrag' : ' Einträge'); };
    function zusammenfassung() {
      const k = eigene();
      let fav = 0; try { fav = (JSON.parse(lsLesen('favoriten-1') || '[]') || []).length; } catch (e) { fav = 0; }
      const rechner = k.filter(function (x) { return x.indexOf('eingaben:') === 0; }).length;
      const teile = [];
      if (fav) teile.push(fav + (fav === 1 ? ' Favorit' : ' Favoriten'));
      if (rechner) teile.push(rechner + ' Rechner mit gemerkten Eingaben');
      const rest = k.length - rechner - (lsLesen('favoriten-1') ? 1 : 0);
      if (rest > 0) teile.push(rest + (rest === 1 ? ' weiterer Eintrag' : ' weitere Einträge') + ' (Planer, Projektmappe, Protokolle …)');
      return teile.length ? teile.join(', ') : 'noch nichts gespeichert';
    }
    function bauen() {
      dlg = knoten('div', 'suche-schicht daten-schicht'); dlg.hidden = true;
      dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'daten-titel');
      const box = knoten('div', 'suche-box daten-box');
      const kopf = knoten('div', 'suche-kopf');
      const h = knoten('h2', 'daten-titel', 'Deine Daten sichern'); h.id = 'daten-titel';
      const zu = knoten('button', 'suche-zu', 'Schließen'); zu.type = 'button';
      kopf.append(h, zu);
      const inhalt = knoten('div', 'daten-inhalt');
      box.append(kopf, inhalt); dlg.append(box); document.body.append(dlg);
      fokusFalle(dlg);
      zu.addEventListener('click', schliessen);
      dlg.addEventListener('click', function (ev) { if (ev.target === dlg) schliessen(); });
      dlg.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.preventDefault(); schliessen(); } });
    }
    function fuellen(meldung, schlecht) {
      const inhalt = dlg.querySelector('.daten-inhalt'); inhalt.innerHTML = '';
      const p = function (t, k) { const e = knoten('p', k, t); inhalt.append(e); return e; };
      p('Gemerkte Eingaben, Favoriten, Planer und die Projektmappe liegen nur in diesem Browser auf diesem Gerät. Wer die Websitedaten löscht oder den Browser wechselt, verliert sie – außer es gibt eine Sicherung.');
      const stand = knoten('dl', 'daten-stand');
      const zeile = function (a, b, klasse) { const dt = knoten('dt', '', a), dd = knoten('dd', klasse || '', b); stand.append(dt, dd); };
      zeile('Gespeichert', zusammenfassung());
      const g = +lsLesen(ZULETZT_GESICHERT);
      zeile('Letzte Sicherung', g ? datum(g) + ' (vor ' + tageSeit(g) + (tageSeit(g) === 1 ? ' Tag)' : ' Tagen)') : 'noch keine', g && tageSeit(g) <= TAGE ? 'gut' : eigene().length ? 'warnung' : '');
      zeile('Vor automatischem Löschen geschützt', '…');
      inhalt.append(stand);
      if (navigator.storage && navigator.storage.persisted) {
        navigator.storage.persisted().then(function (ja) { const dd = stand.querySelectorAll('dd')[2]; if (dd) { dd.textContent = ja ? 'ja' : iOS() && !alsApp() ? 'nein – als App installieren hilft' : 'nein (der Browser entscheidet selbst)'; dd.className = ja ? 'gut' : ''; } }).catch(function () { /* egal */ });
      } else { const dd = stand.querySelectorAll('dd')[2]; dd.textContent = 'unbekannt'; }
      if (meldung) p(meldung, 'daten-meldung' + (schlecht ? ' schlecht' : ''));
      const knoepfe = knoten('div', 'daten-knoepfe');
      const s = knoten('button', 'knopf', 'Alles sichern (Datei)'); s.type = 'button';
      s.addEventListener('click', function () { const n = sichern(); fuellen(eintraege(n) + ' gesichert. Die Datei liegt bei deinen Downloads – am besten in die Cloud oder auf einen Stick kopieren.'); });
      const w = knoten('label', 'knopf', 'Sicherung wiederherstellen …'); w.style.cursor = 'pointer';
      const f = knoten('input'); f.type = 'file'; f.accept = '.json,application/json'; f.hidden = true; f.setAttribute('data-nicht-merken', '');
      w.append(f);
      f.addEventListener('change', function () {
        const datei = f.files && f.files[0]; if (!datei) return;
        if (datei.size > 6e6) { fuellen('Die Datei ist zu groß für eine Sicherung.', true); return; }
        const r = new FileReader();
        r.onload = function () {
          try {
            const e = pruefen(String(r.result));
            const n = einspielen(e.daten);
            lsSchreiben(ZULETZT_GESICHERT, String(isFinite(e.erstellt) ? e.erstellt : Date.now()));
            fuellen(eintraege(n) + ' wiederhergestellt' + (isFinite(e.erstellt) ? ' (Sicherung vom ' + datum(e.erstellt) + ')' : '') + '. Die Seite lädt gleich neu.');
            neuLaden();
          } catch (err) { fuellen(err.message, true); }
        };
        r.onerror = function () { fuellen('Die Datei ließ sich nicht lesen.', true); };
        r.readAsText(datei);
      });
      knoepfe.append(s, w);
      if (lsLesen(VOR_IMPORT)) {
        const z = knoten('button', 'knopf-leise', 'Stand vor dem letzten Wiederherstellen zurückholen'); z.type = 'button';
        z.addEventListener('click', function () { if (zurueck()) { fuellen('Der vorherige Stand ist zurück. Die Seite lädt gleich neu.'); neuLaden(); } });
        knoepfe.append(z);
      }
      inhalt.append(knoepfe);
      if (iOS() && !alsApp()) p('Tipp für iPhone und iPad: Safari löscht die Daten von Seiten, die 7 Tage nicht geöffnet wurden. Über Teilen → „Zum Home-Bildschirm“ wird die Sammlung zur App – dann bleiben die Daten erhalten.', 'daten-tipp');
      else p('Tipp: Als App installieren (Knopf auf der Startseite oder im Browsermenü) – dann bleibt die Sammlung samt Daten besser erhalten und läuft offline.', 'daten-tipp');
      p('„Nur Bilder und Dateien im Cache leeren“ löscht nichts davon. Erst „Cookies und Websitedaten löschen“ entfernt die Daten.', 'daten-klein');
    }
    function oeffnen() {
      if (!dlg) bauen();
      vorherFokus = document.activeElement;
      fuellen();
      dlg.hidden = false; document.documentElement.classList.add('suche-offen');
      const k = dlg.querySelector('.daten-knoepfe .knopf'); if (k) k.focus();
    }
    function schliessen() {
      if (!dlg || dlg.hidden) return;
      dlg.hidden = true; document.documentElement.classList.remove('suche-offen');
      if (vorherFokus && vorherFokus.focus && document.contains(vorherFokus)) vorherFokus.focus();
    }
    // 4. Erinnerung: eigene Daten da, keine Sicherung seit 30 Tagen (oder noch nie, Daten älter als 7 Tage), höchstens alle 14 Tage
    let hinweis = null;
    function hinweisWeg() { if (hinweis) { hinweis.remove(); hinweis = null; } }
    function erinnern() {
      const k = eigene(); if (!k.length) { lsSchreiben(ERSTE_DATEN, null); return; }
      let erste = +lsLesen(ERSTE_DATEN); if (!erste) { erste = Date.now(); lsSchreiben(ERSTE_DATEN, String(erste)); }
      const g = +lsLesen(ZULETZT_GESICHERT), e = +lsLesen(ERINNERT);
      const faellig = g ? tageSeit(g) > TAGE : tageSeit(erste) >= 7;
      if (!faellig || (e && tageSeit(e) < 14) || document.body.hasAttribute('data-ohne-erinnerung')) return;
      hinweis = knoten('div', 'daten-hinweis'); hinweis.setAttribute('role', 'status');
      hinweis.append(knoten('span', '', g ? 'Letzte Sicherung deiner gespeicherten Daten vor ' + tageSeit(g) + ' Tagen.' : 'Deine gespeicherten Daten sind noch nicht gesichert.'));
      const a = knoten('button', 'knopf', 'Jetzt sichern'); a.type = 'button';
      a.addEventListener('click', function () { lsSchreiben(ERINNERT, String(Date.now())); hinweisWeg(); oeffnen(); });
      const b = knoten('button', 'knopf-leise', 'Später'); b.type = 'button';
      b.addEventListener('click', function () { lsSchreiben(ERINNERT, String(Date.now())); hinweisWeg(); });
      hinweis.append(a, b);
      untenSetzen();
      document.body.append(hinweis);
    }
    function start() {
      dauerhaftAnfordern();
      // auch später anfordern, sobald jemand das erste Mal etwas speichert
      window.addEventListener('pagehide', dauerhaftAnfordern);
      setTimeout(erinnern, 1500);
    }
    return { oeffnen: oeffnen, sichern: sichern, pruefen: pruefen, start: start, eigene: eigene };
  })();
  window.Daten = Daten;

  // ---------- Kopf- und Fußzeile ----------
  function kopfBauen() {
    const ziel = document.getElementById('seitenkopf');
    if (!ziel) return;
    const wurzel = ziel.getAttribute('data-wurzel') || '';
    const hier = ziel.getAttribute('data-seite') || '';
    const haupt = document.querySelector('main');
    if (haupt && !haupt.id) haupt.id = 'inhalt';
    ziel.className = 'seite';
    ziel.innerHTML =
      '<a class="sprung" href="#' + (haupt ? haupt.id : 'inhalt') + '">Zum Inhalt</a>' +
      '<header class="seitenkopf">' +
        '<a class="marke" href="' + wurzel + 'index.html"><span class="marke-zeichen" aria-hidden="true">∑</span>Formeln &amp; Rechner</a>' +
        '<nav class="reiter" aria-label="Hauptnavigation">' +
          '<a href="' + wurzel + 'index.html"' + (hier === 'start' ? ' aria-current="page"' : '') + '>Übersicht</a>' +
          '<a href="' + wurzel + 'lernen.html"' + (/lernen\.html$/.test(location.pathname) ? ' aria-current="page"' : ' class="neu" title="Neu: Aufgaben, Formelkarten und Aufgabenblätter"') + '>Lernen</a>' +
          '<a href="' + wurzel + 'index.html#bereiche">Bereiche</a>' +
          '<a href="' + wurzel + 'projektmappe.html"' + (/projektmappe\.html$/.test(location.pathname) ? ' aria-current="page"' : '') + '>Projekte</a>' +
        '</nav>' +
        '<div class="kopf-knoepfe">' +
          '<button type="button" class="installieren" hidden>App installieren</button>' +
          (hier === 'start' ? '<span class="netz netz-kopf" role="status"></span>' : '') +
          (hier !== 'start' && favPfadHier() ? '<button type="button" class="favorit-schalter" aria-pressed="false">' + STERN + '</button>' : '') +
          '<button type="button" class="suche-knopf" aria-haspopup="dialog" title="Stichwortsuche (Strg + K)">' + LUPE + '<span>Suche</span></button>' +
          '<button type="button" class="themenschalter"></button>' +
        '</div>' +
      '</header>';
    ziel.querySelector('.suche-knopf').addEventListener('click', function () { Suche.oeffnen(wurzel); });
    ziel.querySelector('.themenschalter').addEventListener('click', function () {
      themaSetzen(aktuellesThema() === 'dunkel' ? 'hell' : 'dunkel', true);
    });
    schalterAktualisieren();
    netzZeigen();
    const fav = ziel.querySelector('.favorit-schalter');
    if (fav) {
      fav.addEventListener('click', function () { const p = favPfadHier(); if (p) window.Favoriten.umschalten(p); });
      favKnopfAktualisieren();
    }
    const inst = ziel.querySelector('.installieren');
    if (installAngebot) inst.hidden = false;
    inst.addEventListener('click', function () {
      if (!installAngebot) return;
      installAngebot.prompt();
      installAngebot.userChoice.then(function () { installAngebot = null; inst.hidden = true; });
    });
  }

  // ---------- Als App installieren und offline nutzen ----------
  let installAngebot = null;
  window.addEventListener('beforeinstallprompt', function (ev) {
    ev.preventDefault();
    installAngebot = ev;
    document.querySelectorAll('.installieren').forEach(function (k) { k.hidden = false; });
  });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      const kopf = document.getElementById('seitenkopf');
      const wurzel = (kopf && kopf.getAttribute('data-wurzel')) || '';
      navigator.serviceWorker.register(wurzel + 'sw.js').catch(function () { /* ohne Offline-Speicher geht es auch */ });
    });
  }

  // ---------- Anzeige online / offline (Startseite oben, Fuß auf allen Seiten) ----------
  let offlineBereit = false;
  function netzZeigen() {
    const an = navigator.onLine !== false;
    document.querySelectorAll('.netz').forEach(function (n) {
      n.classList.toggle('netz-aus', !an);
      const kurz = n.classList.contains('netz-kopf');
      n.textContent = an ? (kurz ? 'Online' : 'Online' + (offlineBereit ? ' · auch offline nutzbar' : '')) : (kurz ? 'Offline' : 'Offline · Seiten aus dem Speicher auf diesem Gerät');
      n.title = an ? (offlineBereit ? 'Mit dem Internet verbunden. Die Sammlung ist auf diesem Gerät gespeichert und läuft auch ohne Netz.' : 'Mit dem Internet verbunden.')
        : 'Keine Internetverbindung. Alles läuft weiter aus dem Speicher auf diesem Gerät.';
    });
  }
  window.addEventListener('online', netzZeigen);
  window.addEventListener('offline', netzZeigen);
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.ready.then(function () { offlineBereit = true; netzZeigen(); }).catch(function () { /* egal */ });
  }

  function fussBauen() {
    const ziel = document.getElementById('seitenfuss');
    if (!ziel) return;
    ziel.className = 'seite';
    ziel.innerHTML =
      '<footer class="seitenfuss">' +
        '<p class="haftung"><strong>Ohne Gewähr.</strong> Formeln, Tabellenwerte und Ergebnisse sind sorgfältig erstellt, können aber Fehler enthalten. ' +
        'Ergebnisse vor der Ausführung prüfen; maßgeblich sind die gültigen Normen, Herstellerangaben und die Fachplanung. ' +
        'Etwas passt nicht? Bitte melden an <a href="mailto:support@pr1m3.de?subject=' + encodeURIComponent('Hinweis zu: ' + document.title) + '">support@pr1m3.de</a>.</p>' +
        '<span class="netz" role="status"></span>' +
        '<span><button type="button" class="link-knopf daten-knopf">Daten sichern oder wiederherstellen</button> – gemerkte Eingaben, Favoriten und Planer liegen nur auf diesem Gerät.</span>' +
        '<span>Läuft komplett offline, ohne externe Dateien' + (/^https?:$/.test(location.protocol) && 'serviceWorker' in navigator ? ', einmal geladen auch ohne Netz' : '') + '.</span>' +
        '<span>Offen: <a href="https://github.com/pr1m3-de/tools" rel="noopener">Quelltext auf GitHub</a> · Code MIT, Aufgabenblätter CC BY 4.0.</span>' +
        '<span>Formelsatz mit KaTeX (MIT-Lizenz), lokal in assets/katex.</span>' +
      '</footer>';
    netzZeigen();
    ziel.querySelector('.daten-knopf').addEventListener('click', function () { Daten.oeffnen(); });
  }

  // ---------- Links zum Teilen: ein Muster für alle Seiten ----------
  // Format: seite.html#werte=z.<deflate-raw, base64url>   (ohne „z.“ unkomprimiert, für alte Browser)
  //  - steht hinter „#“ und geht nie an den Server; ein Anker der Seite bleibt erhalten: #reiter&werte=…
  //  - wird beim Laden sofort aus der Adresse genommen (vor den Skripten der Seite), damit Neuladen den eigenen Stand zeigt
  //  - vor dem Übernehmen wird der bisherige Stand gesichert („Vorherige Werte wiederherstellen“)
  //  - Inhalte werden geprüft; strukturierte Daten laufen durch Teilen.entschaerfen
  //  - alte Links mit ?werte=, ?plan=, ?anlage= funktionieren weiter
  const LINK_NAMEN = ['werte', 'plan', 'anlage', 'dach', 'uebernahme', 'pruefung'];
  const linkRoh = {};
  (function linkAbholen() {
    let geaendert = false;
    function teile(t) {
      return (t ? t.split('&') : []).filter(function (x) {
        const i = x.indexOf('='), n = i > 0 ? x.slice(0, i) : '';
        if (LINK_NAMEN.indexOf(n) < 0) return true;
        if (!linkRoh[n]) linkRoh[n] = x.slice(i + 1);
        geaendert = true;
        return false;
      }).join('&');
    }
    const anker = teile(location.hash.slice(1)), suche = teile(location.search.slice(1));
    if (geaendert) { try { history.replaceState(null, '', location.pathname + (suche ? '?' + suche : '') + (anker ? '#' + anker : '')); } catch (e) { /* file:// u. a. */ } }
  })();
  // neuer Link in demselben Tab (nur der Teil hinter # ändert sich): Seite neu laden, dann greift linkAbholen
  window.addEventListener('hashchange', function () {
    if (location.hash.slice(1).split('&').some(function (x) { return LINK_NAMEN.indexOf(x.split('=')[0]) >= 0; })) location.reload();
  });
  function b64zuBytes(t) { const z = atob(t.replace(/-/g, '+').replace(/_/g, '/')); const b = new Uint8Array(z.length); for (let i = 0; i < z.length; i++) b[i] = z.charCodeAt(i); return b; }
  function bytesZuB64(b) { let z = ''; for (let i = 0; i < b.length; i += 8192) z += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); return btoa(z).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function textZuB64(t) { return typeof TextEncoder !== 'undefined' ? bytesZuB64(new TextEncoder().encode(t)) : btoa(unescape(encodeURIComponent(t))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64ZuText(k) { return typeof TextDecoder !== 'undefined' ? new TextDecoder().decode(b64zuBytes(k)) : decodeURIComponent(escape(atob(k.replace(/-/g, '+').replace(/_/g, '/')))); }
  function packen(text) {
    if (typeof CompressionStream === 'undefined' || typeof Response === 'undefined') return Promise.resolve(textZuB64(text));
    return new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()
      .then(function (ab) { return 'z.' + bytesZuB64(new Uint8Array(ab)); }, function () { return textZuB64(text); });
  }
  function entpacken(k) {
    try { k = decodeURIComponent(k); } catch (e) { /* schon roh */ }
    try {
      if (k.slice(0, 2) !== 'z.') return Promise.resolve(b64ZuText(k));
      if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('Dieser Browser kann komprimierte Links nicht entpacken.'));
      // Begrenzt beim Entpacken lesen: ein kleiner Link darf nicht zu Gigabytes aufgehen (Entpack-Bombe)
      const leser = new Blob([b64zuBytes(k.slice(2))]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
      const teile = []; let n = 0;
      const weiter = function () {
        return leser.read().then(function (r) {
          if (r.done) return;
          n += r.value.length;
          if (n > 2000000) { leser.cancel(); throw new Error('zu groß'); }
          teile.push(r.value); return weiter();
        });
      };
      return weiter().then(function () {
        const alle = new Uint8Array(n); let o = 0;
        teile.forEach(function (t) { alle.set(t, o); o += t.length; });
        return new TextDecoder().decode(alle);
      });
    } catch (e) { return Promise.reject(e); }
  }
  // Strukturierte Daten entschärfen: Texte ohne < > " ' ` und begrenzt, Listen und Tiefe begrenzt, keine gefährlichen Schlüssel
  function entschaerfen(w, tiefe) {
    tiefe = tiefe || 0;
    if (tiefe > 14) return null;
    if (typeof w === 'string') return w.replace(/[<>"'`]/g, '').slice(0, 300);
    if (typeof w === 'number') return isFinite(w) ? w : 0;
    if (typeof w === 'boolean' || w === null) return w;
    if (Array.isArray(w)) return w.slice(0, 5000).map(function (x) { return entschaerfen(x, tiefe + 1); });
    if (typeof w === 'object') {
      const o = {};
      Object.keys(w).slice(0, 300).forEach(function (k) { if (k === '__proto__' || k === 'constructor' || k === 'prototype' || k.length > 60) return; o[k] = entschaerfen(w[k], tiefe + 1); });
      return o;
    }
    return null;
  }
  function kopieren(url, melden) {
    const ok = function () { melden('Link kopiert (' + url.length.toLocaleString('de-DE') + ' Zeichen) – öffnet diese Seite mit genau diesem Stand.'); };
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) navigator.clipboard.writeText(url).then(ok, function () { window.prompt('Link kopieren:', url); });
    else window.prompt('Link kopieren:', url);
  }
  function lsLesen(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSchreiben(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ohne Speicher */ } }
  // ---------- Rückfrage im Seitenfenster ----------
  // Ersatz für window.confirm: blockiert nichts und funktioniert auch in eingebetteten Browsern
  // (Apps, die Dialoge unterdrücken – dort lieferte confirm stillschweigend „Abbrechen“).
  // Nachfrage(text, weiter, ohneFrage, jaText, abbruch): ruft weiter() nach „Ja“ auf, sonst abbruch(); mit ohneFrage === true sofort weiter().
  window.Nachfrage = function (text, weiter, ohneFrage, jaText, abbruch) {
    if (ohneFrage) { weiter(); return; }
    const alt = document.activeElement, hg = document.createElement('div'), d = document.createElement('div'), p = document.createElement('p');
    hg.className = 'nachfrage-hg'; d.className = 'nachfrage'; d.setAttribute('role', 'alertdialog'); d.setAttribute('aria-modal', 'true');
    p.id = 'nachfrage-text'; p.textContent = text; d.setAttribute('aria-describedby', 'nachfrage-text');
    const ja = document.createElement('button'), nein = document.createElement('button'), leiste = document.createElement('div');
    ja.type = 'button'; nein.type = 'button'; ja.className = 'knopf-haupt'; nein.className = 'knopf'; leiste.className = 'nachfrage-knoepfe';
    ja.textContent = jaText || 'Ja, fortfahren'; nein.textContent = 'Abbrechen';
    leiste.append(nein, ja); d.append(p, leiste); hg.append(d); document.body.append(hg);
    let offen = true;
    const zu = function (ok) {
      if (!offen) return; offen = false; hg.remove(); document.removeEventListener('keydown', taste, true);
      if (alt && alt.focus && document.contains(alt)) alt.focus({ preventScroll: true });
      if (ok) weiter(); else if (abbruch) abbruch();
    };
    const taste = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); zu(false); }
      else if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === ja ? nein : ja).focus(); }
    };
    ja.addEventListener('click', function () { zu(true); });
    nein.addEventListener('click', function () { zu(false); });
    hg.addEventListener('click', function (e) { if (e.target === hg) zu(false); });
    document.addEventListener('keydown', taste, true);
    nein.focus();
  };

  window.Teilen = {
    namen: LINK_NAMEN,
    hat: function (name) { return Object.prototype.hasOwnProperty.call(linkRoh, name); },
    // Promise mit dem Objekt aus dem Link, null ohne Link; Fehler bei kaputtem Link
    lesen: function (name) {
      if (!this.hat(name)) return Promise.resolve(null);
      const roh = linkRoh[name]; delete linkRoh[name];
      return entpacken(roh).then(function (t) { if (t.length > 2000000) throw new Error('zu groß'); return JSON.parse(t); });
    },
    // Promise mit der fertigen Adresse; der aktuelle Anker der Seite bleibt erhalten
    url: function (name, objekt) {
      const anker = location.hash.slice(1);
      return packen(JSON.stringify(objekt)).then(function (k) { return location.href.split('#')[0].split('?')[0] + '#' + (anker ? anker + '&' : '') + name + '=' + k; });
    },
    // nur der Teil hinter „#“ ohne Komprimierung (für viele Links auf einmal, z. B. Projektmappe)
    urlSofort: function (pfad, name, text) { return pfad + '#' + name + '=' + textZuB64(text); },
    // Promise mit vollständiger, komprimierter Adresse für eine andere Seite (für QR-Codes, z. B. Projektmappe)
    urlFuer: function (pfad, name, text) {
      const ziel = new URL(pfad, location.href).href.split('#')[0].split('?')[0];
      return packen(text).then(function (k) { return ziel + '#' + name + '=' + k; });
    },
    kopieren: kopieren,
    entschaerfen: function (w) { return entschaerfen(w, 0); },
    // bisherigen Stand unter schluessel sichern, bevor ein Link ihn ersetzt; true, wenn gesichert
    sichern: function (schluessel, neu) {
      const alt = lsLesen(schluessel);
      if (!alt || alt === neu) return false;
      lsSchreiben(schluessel + ':vorher', alt);
      return true;
    },
    vorher: function (schluessel) { return lsLesen(schluessel + ':vorher'); },
    vorherWeg: function (schluessel) { lsSchreiben(schluessel + ':vorher', null); },
    // Knopf „Vorherige … wiederherstellen“ (sichtbar, solange eine Sicherung da ist); wiederherstellen(text) übernimmt den Stand
    knopf: function (ziel, schluessel, wiederherstellen, was) {
      const k = document.createElement('button');
      k.type = 'button'; k.className = 'knopf-leise vorher-knopf'; k.setAttribute('data-nicht-merken', '');
      k.textContent = 'Vorherige ' + (was || 'Werte') + ' wiederherstellen';
      const zeigen = function () { k.hidden = !lsLesen(schluessel + ':vorher'); };
      k.addEventListener('click', function () {
        const t = lsLesen(schluessel + ':vorher'); if (!t) { zeigen(); return; }
        window.Nachfrage('Vorherige ' + (was || 'Werte') + ' wiederherstellen? Der Stand aus dem Link wird ersetzt.', function () {
          lsSchreiben(schluessel + ':vorher', null);
          wiederherstellen(t); zeigen();
        }, false, 'Wiederherstellen');
      });
      ziel.append(k); zeigen();
      return { zeigen: zeigen };
    }
  };

  // ---------- Eingaben merken und als Link teilen ----------
  // Auf Seiten mit <main data-merken>: eingetragene Werte, Einheiten und gewählte Modi
  // bleiben im Browser und lassen sich als Link weitergeben (?werte=…).
  const merkSchluessel = 'eingaben:' + location.pathname.replace(/\/index\.html$/, '/');
  function steuerelemente(haupt) {
    return Array.prototype.slice.call(haupt.querySelectorAll('input, select, textarea')).filter(function (el) {
      return el.type !== 'file' && el.type !== 'button' && el.type !== 'submit' && !el.closest('[data-nicht-merken]') && !el.closest('.nicht-merken');
    });
  }
  function schluessel(el, i) { return el.id ? '#' + el.id : el.name ? '@' + el.name : i; }
  // gegeben ist ein Feld auch, wenn es im Löser als Widerspruch markiert ist (dort werden nur eingetragene Werte so markiert)
  function istGegeben(feld) { return feld.classList.contains('gegeben') || (feld.classList.contains('widerspruch') && !!feld.closest('.loeser')); }
  function zustandLesen(haupt) {
    const z = { modi: [], werte: {} };
    haupt.querySelectorAll('button[aria-pressed="true"]').forEach(function (k) {
      const t = k.textContent.trim().replace(/\s+/g, ' ');
      if (t && t.length < 80) z.modi.push(t);
    });
    steuerelemente(haupt).forEach(function (el, i) {
      const feld = el.closest('.feld');
      let w;
      if (el.type === 'checkbox' || el.type === 'radio') w = el.checked;
      else if (feld && el.tagName === 'INPUT' && el.type !== 'range') w = istGegeben(feld) ? el.value : '';
      else w = el.value;
      z.werte[schluessel(el, i)] = w;
    });
    return z;
  }
  function zustandSetzen(haupt, z) {
    if (!z || !z.werte) return;
    // 1. Modi (Knöpfe) wie gespeichert drücken
    (z.modi || []).forEach(function (t) {
      const k = Array.prototype.slice.call(haupt.querySelectorAll('button[aria-pressed]')).filter(function (b) { return b.textContent.trim().replace(/\s+/g, ' ') === t; })[0];
      if (k && k.getAttribute('aria-pressed') !== 'true') k.click();
    });
    // 2. Auswahlfelder und Haken, dann 3. Zahlen (Einheit zuerst, damit die Zahl richtig gelesen wird)
    [function (el) { return el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio'; },
     function (el) { return !(el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio'); }].forEach(function (passt) {
      steuerelemente(haupt).forEach(function (el, i) {
        if (!passt(el)) return;
        const k = schluessel(el, i);
        if (!(k in z.werte)) return;
        const w = z.werte[k];
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked === !!w) return;
          el.checked = !!w;
        } else {
          const feld = el.closest('.feld');
          const jetzt = feld && el.tagName === 'INPUT' && el.type !== 'range' ? (istGegeben(feld) ? el.value : '') : el.value;
          if (jetzt === w) return;
          el.value = w;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }
  // gemerkter Zustand: { modi: [Text, …], werte: { Schlüssel: Text | true/false } } – streng geprüft
  function zustandPruefen(z) {
    if (!z || typeof z !== 'object' || !z.werte || typeof z.werte !== 'object' || Array.isArray(z.werte)) return null;
    const o = { modi: [], werte: {} };
    (Array.isArray(z.modi) ? z.modi : []).slice(0, 60).forEach(function (t) { if (typeof t === 'string' && t.length < 80) o.modi.push(t); });
    Object.keys(z.werte).slice(0, 3000).forEach(function (k) {
      if (k.length > 120 || k === '__proto__') return;
      const w = z.werte[k];
      if (typeof w === 'boolean') o.werte[k] = w;
      else if (typeof w === 'string' || typeof w === 'number') o.werte[k] = String(w).slice(0, 400000);
    });
    return o;
  }
  function merkenEinrichten() {
    const haupt = document.querySelector('main[data-merken]');
    if (!haupt) return;
    let uhr = 0, bereit = false, vorherKnopf = null;
    const sofort = function () { try { localStorage.setItem(merkSchluessel, JSON.stringify(zustandLesen(haupt))); } catch (e) { /* ohne Speicher */ } };
    const sichern = function () {
      if (!bereit) return;
      clearTimeout(uhr);
      uhr = setTimeout(sofort, 400);
    };
    if (!druckLinkQuelle) Teilen.druckLink(function () { return Teilen.url('werte', zustandLesen(haupt)); });
    haupt.addEventListener('input', sichern, true);
    haupt.addEventListener('change', sichern, true);
    haupt.addEventListener('click', function (ev) { if (ev.target.closest('button')) sichern(); }, true);
    window.addEventListener('pagehide', function () { if (bereit) { clearTimeout(uhr); sofort(); } });
    const held = document.querySelector('.held');
    let leiste = null;
    const melden = function (t) { if (!leiste) return; const m = leiste.querySelector('.teilen-meldung'); m.textContent = t; setTimeout(function () { if (m.textContent === t) m.textContent = ''; }, 5000); };
    const setzen = function (z) { try { zustandSetzen(haupt, z); } catch (e) { /* Seite hat sich geändert, dann eben Beispielwerte */ } };
    // Wiederherstellen, nachdem die Seite sich selbst aufgebaut hat: zuerst Link, sonst Speicher
    setTimeout(function () {
      Teilen.lesen('werte').then(function (z) {
        z = zustandPruefen(z);
        if (!z) {
          let g = null; try { g = JSON.parse(localStorage.getItem(merkSchluessel) || 'null'); } catch (e) { g = null; }
          setzen(zustandPruefen(g)); bereit = true; return;
        }
        const gesichert = Teilen.sichern(merkSchluessel, JSON.stringify(z));
        setzen(z); bereit = true; sofort();
        if (vorherKnopf) vorherKnopf.zeigen();
        melden('Werte aus dem Link übernommen und gespeichert.' + (gesichert ? ' Deine vorherigen Werte sind gesichert.' : ''));
      }).catch(function () {
        let g = null; try { g = JSON.parse(localStorage.getItem(merkSchluessel) || 'null'); } catch (e) { g = null; }
        setzen(zustandPruefen(g)); bereit = true;
        melden('Der Link ist unvollständig oder beschädigt – es gelten die gespeicherten Werte.');
      });
    }, 0);
    // Knopf zum Teilen
    if (held) {
      leiste = document.createElement('div');
      leiste.className = 'teilen-leiste';
      leiste.innerHTML = '<button type="button" class="knopf teilen">Link mit diesen Werten kopieren</button><span class="teilen-meldung" aria-live="polite"></span>';
      held.append(leiste);
      leiste.querySelector('button').addEventListener('click', function () {
        Teilen.url('werte', zustandLesen(haupt)).then(function (url) { Teilen.kopieren(url, melden); });
      });
      vorherKnopf = Teilen.knopf(leiste, merkSchluessel, function (t) {
        let z = null; try { z = zustandPruefen(JSON.parse(t)); } catch (e) { z = null; }
        if (!z) return;
        setzen(z); sofort(); melden('Vorherige Werte wiederhergestellt.');
      });
      // Knopf vor die Meldung
      leiste.insertBefore(leiste.querySelector('.vorher-knopf'), leiste.querySelector('.teilen-meldung'));
    }
  }

  // ---------- QR-Code (ISO/IEC 18004, Byte-Modus, Version 1–40) für den Link auf dem Ausdruck ----------
  const QRCode = (function () {
  function utf8(t) {
    const b = [];
    for (let i = 0; i < t.length; i++) {
      let c = t.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF && i + 1 < t.length) { c = 0x10000 + ((c - 0xD800) << 10) + (t.charCodeAt(++i) - 0xDC00); }
      if (c < 0x80) b.push(c); else if (c < 0x800) b.push(0xC0 | c >> 6, 0x80 | c & 63);
      else if (c < 0x10000) b.push(0xE0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
      else b.push(0xF0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return b;
  }
  // Rechnen im Galoiskörper GF(256)
  function gf(prim) {
    const exp = [], log = []; let x = 1;
    for (let i = 0; i < 255; i++) { exp[i] = x; log[x] = i; x <<= 1; if (x & 256) x ^= prim; }
    for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
    return { mul: function (a, b) { return a && b ? exp[log[a] + log[b]] : 0; }, exp: exp };
  }

  // ===== QR-Code (ISO/IEC 18004), Byte-Modus, Version 1 bis 40 =====
  const QR_ECC = {
    L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  };
  const QR_BLOECKE = {
    L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  };
  const QR_FORMAT = { L: 1, M: 0, Q: 3, H: 2 };
  const GQ = gf(0x11D);
  function rohModule(v) { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; }
  function datenWorte(v, s) { return Math.floor(rohModule(v) / 8) - QR_ECC[s][v] * QR_BLOECKE[s][v]; }
  function rsTeiler(grad, feld, start) {
    const r = []; for (let i = 0; i < grad - 1; i++) r.push(0); r.push(1);
    let wurzel = feld.exp[start];
    for (let i = 0; i < grad; i++) { for (let j = 0; j < r.length; j++) { r[j] = feld.mul(r[j], wurzel); if (j + 1 < r.length) r[j] ^= r[j + 1]; } wurzel = feld.mul(wurzel, 2); }
    return r;
  }
  function rsRest(daten, teiler, feld) {
    const r = teiler.map(function () { return 0; });
    daten.forEach(function (b) { const f = b ^ r.shift(); r.push(0); teiler.forEach(function (c, i) { r[i] ^= feld.mul(c, f); }); });
    return r;
  }
  function qr(text, stufe) {
    stufe = QR_ECC[stufe] ? stufe : 'M';
    const daten = utf8(text);
    let v = 1;
    for (; v <= 40; v++) if (4 + (v <= 9 ? 8 : 16) + 8 * daten.length <= datenWorte(v, stufe) * 8) break;
    if (v > 40) return null;
    const bits = [];
    function anhaengen(wert, n) { for (let i = n - 1; i >= 0; i--) bits.push((wert >>> i) & 1); }
    anhaengen(4, 4); anhaengen(daten.length, v <= 9 ? 8 : 16); daten.forEach(function (b) { anhaengen(b, 8); });
    const kap = datenWorte(v, stufe) * 8;
    anhaengen(0, Math.min(4, kap - bits.length)); anhaengen(0, (8 - bits.length % 8) % 8);
    for (let p = 0xEC; bits.length < kap; p ^= 0xEC ^ 0x11) anhaengen(p, 8);
    const worte = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = b << 1 | bits[i + j]; worte.push(b); }
    // Fehlerkorrektur und Verschachtelung
    const nb = QR_BLOECKE[stufe][v], ne = QR_ECC[stufe][v], roh = Math.floor(rohModule(v) / 8), kurz = nb - roh % nb, kl = Math.floor(roh / nb), teiler = rsTeiler(ne, GQ, 0), bl = [];
    for (let i = 0, k = 0; i < nb; i++) { const d = worte.slice(k, k + kl - ne + (i < kurz ? 0 : 1)); k += d.length; const e = rsRest(d, teiler, GQ); if (i < kurz) d.push(0); bl.push(d.concat(e)); }
    const alle = [];
    for (let i = 0; i < bl[0].length; i++) for (let j = 0; j < bl.length; j++) if (i !== kl - ne || j >= kurz) alle.push(bl[j][i]);
    // Muster zeichnen
    const g = v * 4 + 17, m = [], fn = [];
    for (let y = 0; y < g; y++) { m.push([]); fn.push([]); for (let x = 0; x < g; x++) { m[y].push(false); fn[y].push(false); } }
    function setze(x, y, d) { m[y][x] = d; fn[y][x] = true; }
    for (let i = 0; i < g; i++) { setze(6, i, i % 2 === 0); setze(i, 6, i % 2 === 0); }
    [[3, 3], [g - 4, 3], [3, g - 4]].forEach(function (c) { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)), x = c[0] + dx, y = c[1] + dy; if (x >= 0 && x < g && y >= 0 && y < g) setze(x, y, d !== 2 && d !== 4); } });
    const pos = [];
    if (v > 1) { const n = Math.floor(v / 7) + 2, s = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2; pos.push(6); for (let p = g - 7; pos.length < n; p -= s) pos.splice(1, 0, p); }
    pos.forEach(function (a, i) { pos.forEach(function (b, j) { if ((i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setze(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }); });
    function format(maske) {
      const d = QR_FORMAT[stufe] << 3 | maske; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = (d << 10 | r) ^ 0x5412, bit = function (i) { return ((b >>> i) & 1) !== 0; };
      for (let i = 0; i <= 5; i++) setze(8, i, bit(i));
      setze(8, 7, bit(6)); setze(8, 8, bit(7)); setze(7, 8, bit(8));
      for (let i = 9; i < 15; i++) setze(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) setze(g - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) setze(8, g - 15 + i, bit(i));
      setze(8, g - 8, true);
    }
    format(0);
    if (v >= 7) { let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = v << 12 | r; for (let i = 0; i < 18; i++) { const d = ((b >>> i) & 1) !== 0, a = g - 11 + i % 3, c = Math.floor(i / 3); setze(a, c, d); setze(c, a, d); } }
    // Datenmodule im Zickzack
    let i = 0;
    for (let rechts = g - 1; rechts >= 1; rechts -= 2) {
      if (rechts === 6) rechts = 5;
      for (let s = 0; s < g; s++) for (let j = 0; j < 2; j++) {
        const x = rechts - j, hoch = ((rechts + 1) & 2) === 0, y = hoch ? g - 1 - s : s;
        if (!fn[y][x] && i < alle.length * 8) { m[y][x] = ((alle[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0; i++; }
      }
    }
    const MASKE = [function (x, y) { return (x + y) % 2 === 0; }, function (x, y) { return y % 2 === 0; }, function (x) { return x % 3 === 0; }, function (x, y) { return (x + y) % 3 === 0; },
      function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; }, function (x, y) { return x * y % 2 + x * y % 3 === 0; }, function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; }, function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }];
    function maskieren(k) { for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (!fn[y][x] && MASKE[k](x, y)) m[y][x] = !m[y][x]; }
    function strafe() {
      let s = 0, dunkel = 0;
      function zeile(get) {
        let lauf = 1;
        for (let k = 1; k <= g; k++) { if (k < g && get(k) === get(k - 1)) lauf++; else { if (lauf >= 5) s += 3 + lauf - 5; lauf = 1; } }
        for (let k = 0; k + 11 <= g; k++) {
          const a = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], b = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
          let pa = true, pb = true; for (let t = 0; t < 11; t++) { const w = get(k + t) ? 1 : 0; if (w !== a[t]) pa = false; if (w !== b[t]) pb = false; }
          if (pa) s += 40; if (pb) s += 40;
        }
      }
      for (let y = 0; y < g; y++) zeile(function (x) { return m[y][x]; });
      for (let x = 0; x < g; x++) zeile(function (y) { return m[y][x]; });
      for (let y = 0; y < g - 1; y++) for (let x = 0; x < g - 1; x++) { const c = m[y][x]; if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) s += 3; }
      for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (m[y][x]) dunkel++;
      return s + (Math.ceil(Math.abs(dunkel * 20 - g * g * 10) / (g * g)) - 1) * 10;
    }
    let beste = 0, min = Infinity;
    for (let k = 0; k < 8; k++) { maskieren(k); format(k); const p = strafe(); if (p < min) { min = p; beste = k; } maskieren(k); }
    maskieren(beste); format(beste);
    return { matrix: m, rand: 4, info: 'QR-Code Version ' + v + ' (' + g + ' × ' + g + '), Fehlerkorrektur ' + stufe };
  }
  // Fertiges SVG für den Druck. Größe in mm so, dass ein Modul möglichst ≥ 0,5 mm ist (gut lesbar auch
  // mit schwachem Drucker und Handykamera); dafür lieber kleinere Fehlerkorrektur als winzige Module.
  // Sehr viele Daten: Module nicht unter 0,33 mm, dafür darf der Code bis grossMm wachsen.
  // opt: { maxMm, minMm, grossMm }. Ergebnis: { svg, mm, modulMm, info } oder null, wenn der Text zu lang ist.
  const MODUL_GUT = 0.5, MODUL_MIN = 0.33;
  function alsSvg(text, opt) {
    opt = opt || {};
    const maxMm = opt.maxMm || 40, minMm = opt.minMm || 18, grossMm = Math.max(maxMm, opt.grossMm || 62);
    let wahl = null;
    ['Q', 'M', 'L'].some(function (s) {
      const q = qr(text, s);
      if (!q) return false;
      const n = q.matrix.length + 2 * q.rand;
      if (n * MODUL_GUT <= maxMm) { wahl = { q: q, n: n, modul: Math.max(MODUL_GUT, minMm / n) }; return true; }
      if (!wahl || n < wahl.n) wahl = { q: q, n: n, modul: Math.max(MODUL_MIN, maxMm / n) };
      return false;
    });
    if (!wahl || wahl.n * wahl.modul > grossMm + 0.01) return null;
    const q = wahl.q, g = q.matrix.length, r = q.rand, n = wahl.n, mm = n * wahl.modul;
    let d = '';
    for (let y = 0; y < g; y++) {
      let x = 0;
      while (x < g) {
        if (!q.matrix[y][x]) { x++; continue; }
        let l = 1; while (x + l < g && q.matrix[y][x + l]) l++;
        d += 'M' + (x + r) + ' ' + (y + r) + 'h' + l + 'v1h-' + l + 'z';
        x += l;
      }
    }
    return {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" style="width:' + mm.toFixed(1) + 'mm;height:' + mm.toFixed(1) + 'mm"><rect width="' + n + '" height="' + n + '" fill="#fff"/><path fill="#000" d="' + d + '"/></svg>',
      mm: mm, modulMm: wahl.modul, info: q.info
    };
  }
    return { matrix: function (text, stufe) { return qr(text, stufe); }, svg: alsSvg };
  })();
  window.QRCode = QRCode;

  // ---------- QR-Code mit dem Link zum Stand auf der ersten Druckseite ----------
  // Quelle: Seiten mit data-merken automatisch, Planer melden sich mit Teilen.druckLink(function () { return Teilen.url(…); }).
  // Der Code wird nach Änderungen vorbereitet, weil der Druck nicht auf Promises wartet.
  let druckLinkQuelle = null, druckQr = null, druckQrUhr = null, druckQrStand = '';
  const QR_MAX_MM = 38, QR_MIN_MM = 22;
  Teilen.druckLink = function (quelle) { druckLinkQuelle = quelle; druckQrPlanen(); };
  function druckQrElement() {
    if (druckQr) return druckQr;
    druckQr = document.createElement('div');
    druckQr.className = 'druck-qr';
    druckQr.setAttribute('aria-hidden', 'true');
    // Seiten mit eigenem Druckbild (Protokolle): Code rechts oben umflossen, damit er nichts überdeckt
    const eigen = document.querySelector('main[data-eigenes-pdf]');
    if (eigen) { druckQr.classList.add('am-ende'); eigen.insertBefore(druckQr, eigen.firstChild); } else document.body.append(druckQr);
    return druckQr;
  }
  function druckQrPlanen() { clearTimeout(druckQrUhr); druckQrUhr = setTimeout(druckQrJetzt, 700); }
  function druckQrJetzt() {
    clearTimeout(druckQrUhr);
    if (!druckLinkQuelle || !/^https?:$/.test(location.protocol)) return Promise.resolve();
    let p;
    try { p = Promise.resolve(druckLinkQuelle()); } catch (e) { p = Promise.reject(e); }
    return p.then(function (url) {
      if (typeof url !== 'string' || !url || url === druckQrStand) return;
      druckQrStand = url;
      const el = druckQrElement();
      el.innerHTML = '';
      const q = QRCode.svg(url, { maxMm: QR_MAX_MM, minMm: QR_MIN_MM });
      if (!q) {
        el.className = 'druck-qr zu-lang' + (el.parentNode.tagName === 'MAIN' ? ' am-ende' : '');
        el.textContent = 'Stand zu groß für einen QR-Code (' + url.length.toLocaleString('de-DE') + ' Zeichen) – Link kopieren oder als Datei speichern.';
        document.body.style.setProperty('--qr-breite', '42mm');
        return;
      }
      el.className = 'druck-qr' + (el.parentNode.tagName === 'MAIN' ? ' am-ende' : '');
      el.innerHTML = q.svg + '<span>Scannen öffnet<br>diesen Stand</span>';   // svg nur aus eigenen Zahlen gebaut
      el.title = q.info;
      document.body.style.setProperty('--qr-breite', q.mm.toFixed(1) + 'mm');
    }).catch(function () { /* ohne Link kein Code */ });
  }
  window.addEventListener('load', druckQrPlanen);
  ['input', 'change', 'click', 'pointerup', 'keyup'].forEach(function (art) { document.addEventListener(art, druckQrPlanen, true); });
  window.addEventListener('beforeprint', function () { if (druckQr) document.body.classList.add('mit-druck-qr'); });

  // ---------- PDF-Export (über den Druckdialog „Als PDF speichern“) ----------
  // Jede Seite mit <main> bekommt einen Knopf; Kopf mit Bauvorhaben, Bearbeiter und Datum,
  // Bedienelemente werden ausgeblendet, eingeklappte Bereiche geöffnet. Eigene Lösung: <main data-eigenes-pdf>.
  const PDF_SPEICHER = 'pdf-angaben';
  function pdfAngaben() { try { return JSON.parse(localStorage.getItem(PDF_SPEICHER) || '{}') || {}; } catch (e) { return {}; } }
  function heute() { const d = new Date(); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }
  function pdfEinrichten() {
    const haupt = document.querySelector('main');
    const held = document.querySelector('.held');
    if (!haupt || !held || haupt.hasAttribute('data-eigenes-pdf') || document.getElementById('seitenkopf') && document.getElementById('seitenkopf').getAttribute('data-seite') === 'start') return;
    // Kopf für den Druck
    const kopf = document.createElement('div');
    kopf.className = 'druckkopf';
    kopf.setAttribute('aria-hidden', 'true');
    haupt.insertBefore(kopf, haupt.firstChild);
    const kopfFuellen = function () {
      const a = pdfAngaben(), titel = (held.querySelector('h1') || {}).textContent || document.title;
      kopf.innerHTML = '';
      const z = function (k, v) { const d = document.createElement('div'); const b = document.createElement('b'); b.textContent = k; d.append(b, document.createTextNode(' ' + v)); kopf.append(d); };
      const t = document.createElement('div'); t.className = 'druckkopf-titel'; t.textContent = titel.trim(); kopf.append(t);
      z('Datum:', heute());
      z('Bauvorhaben:', a.projekt || '—');
      z('Bearbeiter:', a.bearbeiter || '—');
      if (a.firma) z('Firma:', a.firma);
      const q = document.createElement('div'); q.className = 'druckkopf-quelle'; q.textContent = 'Formeln & Rechner · ' + location.host + location.pathname.replace(/\/[^/]*$/, '/') ; kopf.append(q);
    };
    // Knopf und kleines Formular
    let leiste = held.querySelector('.teilen-leiste');
    if (!leiste) { leiste = document.createElement('div'); leiste.className = 'teilen-leiste'; held.append(leiste); }
    const knopf = document.createElement('button');
    knopf.type = 'button'; knopf.className = 'knopf pdf-knopf'; knopf.textContent = 'PDF erstellen';
    knopf.setAttribute('aria-expanded', 'false');
    leiste.insertBefore(knopf, leiste.firstChild);
    const form = document.createElement('div');
    form.className = 'pdf-form'; form.hidden = true;
    form.innerHTML = '<label>Bauvorhaben <input type="text" data-k="projekt" data-nicht-merken autocomplete="off"></label>' +
      '<label>Bearbeiter <input type="text" data-k="bearbeiter" data-nicht-merken autocomplete="name"></label>' +
      '<label>Firma <input type="text" data-k="firma" data-nicht-merken autocomplete="organization"></label>' +
      '<label class="pdf-haken"><input type="checkbox" data-h="weg"> Rechenweg mitdrucken</label>' +
      '<label class="pdf-haken"><input type="checkbox" data-h="sammlung"> Formelsammlung mitdrucken</label>' +
      '<button type="button" class="knopf-haupt">Als PDF speichern</button>' +
      '<span class="pdf-hinweis">Im Druckdialog „Als PDF speichern“ wählen. Ohne Bedienknöpfe, mit Kopf, Seitenzahlen und QR-Code zu diesem Stand.</span>';
    leiste.after(form);
    const a0 = pdfAngaben();
    const haken = function () { const a = pdfAngaben(); document.body.classList.toggle('druck-ohne-weg', a.weg === false); document.body.classList.toggle('druck-ohne-sammlung', a.sammlung !== true); };
    form.querySelectorAll('input[data-h]').forEach(function (i) {
      const k = i.getAttribute('data-h');
      i.checked = k === 'weg' ? a0.weg !== false : a0.sammlung === true;
      i.addEventListener('change', function () { const a = pdfAngaben(); a[k] = i.checked; try { localStorage.setItem(PDF_SPEICHER, JSON.stringify(a)); } catch (e) { /* ohne Speicher */ } haken(); });
    });
    haken();
    form.querySelectorAll('input[data-k]').forEach(function (i) {
      i.value = a0[i.getAttribute('data-k')] || '';
      i.addEventListener('input', function () { const a = pdfAngaben(); a[i.getAttribute('data-k')] = i.value.slice(0, 120); try { localStorage.setItem(PDF_SPEICHER, JSON.stringify(a)); } catch (e) { /* ohne Speicher */ } });
    });
    knopf.addEventListener('click', function () { form.hidden = !form.hidden; knopf.setAttribute('aria-expanded', String(!form.hidden)); if (!form.hidden) form.querySelector('input').focus(); });
    form.querySelector('.knopf-haupt').addEventListener('click', function () { druckQrJetzt().then(function () { window.print(); }); });
    // vor und nach dem Druck
    let geoeffnet = [], titelAlt = document.title;
    window.addEventListener('beforeprint', function () {
      kopfFuellen();
      geoeffnet = [];
      document.querySelectorAll('main details:not([open])').forEach(function (d) { d.open = true; geoeffnet.push(d); });
      titelAlt = document.title;
      const a = pdfAngaben();
      document.title = titelAlt.replace(/ – Formeln & Rechner$/, '') + (a.projekt ? ' – ' + a.projekt : '') + ' – ' + heute();   // Dateiname des PDFs
      document.dispatchEvent(new CustomEvent('vordruck'));
    });
    window.addEventListener('afterprint', function () {
      geoeffnet.forEach(function (d) { d.open = false; });
      document.title = titelAlt;
      document.dispatchEvent(new CustomEvent('nachdruck'));
    });
    kopfFuellen();
  }

  // ---------- Auswahllisten und Textfelder im Druck vollständig zeigen ----------
  // Ein <select> zeigt im Druck nur so viel Text, wie hineinpasst, ein <textarea> nur die sichtbaren Zeilen.
  // Vor dem Druck kommt daneben ein Textabschnitt mit dem ganzen Inhalt (per textContent), danach wieder weg.
  const NICHT_DRUCKEN = '.teilen-leiste, .pdf-form, .steuerung, .werkzeug, .zoom, .palette, .neu-flaeche, .nur-bildschirm, .leiste, .knoepfe, .seitenkopf, .seitenfuss';
  let druckErsatz = [];
  function druckErsatzBauen() {
    druckErsatzWeg();
    const haupt = document.querySelector('main');
    if (!haupt) return;
    haupt.querySelectorAll('select, textarea').forEach(function (el) {
      if (el.closest(NICHT_DRUCKEN) || !el.getClientRects().length) return;
      let t = '';
      if (el.tagName === 'SELECT') {
        t = Array.prototype.filter.call(el.options, function (o) { return o.selected; }).map(function (o) { return o.textContent.trim(); }).join(', ');
      } else t = el.value;
      const s = document.createElement('span');
      s.className = 'druck-ersatz' + (el.tagName === 'TEXTAREA' ? ' druck-ersatz-text' : '');
      s.textContent = t || (el.tagName === 'TEXTAREA' ? '—' : '');
      el.classList.add('druck-ersetzt');
      el.after(s);
      druckErsatz.push([el, s]);
    });
  }
  function druckErsatzWeg() {
    druckErsatz.forEach(function (p) { p[0].classList.remove('druck-ersetzt'); p[1].remove(); });
    druckErsatz = [];
  }

  document.addEventListener('DOMContentLoaded', function () {
    kopfBauen();
    fussBauen();
    Formel.alle();
    merkenEinrichten();
    pdfEinrichten();
    // nach pdfEinrichten, damit eingeklappte Bereiche schon offen sind
    window.addEventListener('beforeprint', druckErsatzBauen);
    window.addEventListener('afterprint', druckErsatzWeg);
    Daten.start();
    nachObenEinrichten();
    ueberlaufEinrichten();
  });
})();
