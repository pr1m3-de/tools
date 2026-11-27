/*
 * Offline-Speicher für die ganze Sammlung
 * ========================================
 * Seiten: erst aus dem Netz (damit Änderungen sofort ankommen), ohne Netz aus dem Speicher.
 * Bilder, Schriften, Skripte: sofort aus dem Speicher, im Hintergrund aufgefrischt.
 * DATEIEN und STAND füllt werkzeuge/bauen.js beim Bauen (nicht von Hand ändern).
 */
const STAND = 'quelle';
const SPEICHER = 'rechner-' + STAND;
// wird von werkzeuge/bauen.js aus allen Dateien der Seite gefüllt
const DATEIEN = [
  "./"
];

// Beim Installieren am Browser-Speicher vorbei laden: sonst landen bis zu 10 min alte Dateien (oder ein altes 404) im App-Speicher
self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(SPEICHER).then(function (c) { return c.addAll(DATEIEN.map(function (d) { return new Request(d, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.filter(function (n) { return n.indexOf('rechner-') === 0 && n !== SPEICHER; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (ev) {
  const anfrage = ev.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;
  const seite = anfrage.mode === 'navigate' || (anfrage.headers.get('accept') || '').indexOf('text/html') >= 0;
  if (seite) {
    ev.respondWith(fetch(anfrage).then(function (antwort) {
      const kopie = antwort.clone();
      caches.open(SPEICHER).then(function (c) { c.put(anfrage, kopie); });
      return antwort;
    }).catch(function () {
      return caches.match(anfrage, { ignoreSearch: true }).then(function (t) { return t || caches.match('index.html'); });
    }));
    return;
  }
  // Aufgabenblätter und ihre Liste: zuerst das Netz, damit neue und geänderte Blätter sofort da sind; ohne Netz der Speicher
  if (new URL(anfrage.url).pathname.indexOf('/aufgabenblaetter/') >= 0) {
    ev.respondWith(fetch(anfrage).then(function (antwort) {
      if (antwort.ok) { const kopie = antwort.clone(); caches.open(SPEICHER).then(function (c) { c.put(anfrage, kopie); }); return antwort; }
      return caches.match(anfrage, { ignoreSearch: true }).then(function (t) { return t || antwort; });
    }).catch(function () {
      return caches.match(anfrage, { ignoreSearch: true }).then(function (t) { return t || Response.error(); });
    }));
    return;
  }
  ev.respondWith(caches.match(anfrage).then(function (treffer) {
    const frisch = fetch(anfrage).then(function (antwort) {
      if (antwort.ok) { const kopie = antwort.clone(); caches.open(SPEICHER).then(function (c) { c.put(anfrage, kopie); }); }
      return antwort;
    }).catch(function () { return treffer || caches.match(anfrage, { ignoreSearch: true }); }); // versionierte Adressen (?v=…) ohne Netz aus dem Speicher
    return treffer || frisch;
  }));
});
