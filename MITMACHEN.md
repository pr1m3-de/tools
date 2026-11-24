# Mitmachen

Anleitung für alle, die zur Sammlung „Formeln & Rechner“ (https://tools.pr1m3.de) etwas beitragen wollen: einen neuen Rechner, ein Aufgabenblatt, eine Korrektur. Sie erklärt, wie alles aufgebaut ist, und führt Schritt für Schritt durch eine neue Seite.

**Beispielseite zum Kopieren:** [`vorlage/beispiel-rechner.html`](vorlage/beispiel-rechner.html), online unter https://tools.pr1m3.de/vorlage/beispiel-rechner.html. Sie nutzt jeden Baustein und ist ausführlich kommentiert.

---

## 1. Grundsätze

- **Nur HTML, CSS und JavaScript.** Keine Frameworks, keine Pakete. Jede Seite ist eine fertige Datei, die im Browser läuft. Nur was mehrere Seiten gemeinsam betrifft (Startseiten-Liste, Suchmaschinen-Angaben, Offline-Liste …), baut `werkzeuge/bauen.js` – siehe Abschnitt 5.
- **Nichts von außen.** Keine CDNs, keine Webfonts, keine fremden Skripte oder Bilder. Einzige Bibliothek ist KaTeX für den Formelsatz, lokal in `assets/katex/`. Dadurch läuft alles offline.
- **JavaScript nach ES2015**, damit es auch auf älteren Geräten läuft (`const`, `let`, Pfeilfunktionen ja; `?.`, `??`, `async/await` nein).
- **Deutsch**: Texte, Variablen und Funktionsnamen (`rechne`, `zeichne`, `felder`).
- **Keine Markennamen** von Herstellern, sondern allgemein beschreiben („Zwischenstecker mit Messfunktion“).
- **Fachlich sauber**: Normen und Richtwerte nennen (DIN, VDE, MBO …), Annahmen offen sagen, unsinnige Eingaben abfangen. Nie `NaN`, `Infinity` oder `undefined` anzeigen.

## 2. Aufbau des Repos

```
index.html            Startseite: Suche, Bereiche; die Liste aller Rechner füllt bauen.js aus daten/seiten/
lernen.html           Lernbereich: Aufgaben, Formelkarten, Formelsammlung, Aufgabenblätter
projektmappe.html     Ablage im Browser für Seiten mit eigenem Speicher
sw.js                 Service Worker; Dateiliste (DATEIEN) und Versionsstand (STAND) setzt bauen.js
manifest.webmanifest  App-Angaben zum Installieren

assets/
  basis.js            auf jeder Seite: Kopf, Fuß, Hell/Dunkel, Formeln, Merken, Teilen, Favoriten, Offline
  stil.css            gemeinsames Design (Farben als CSS-Variablen, hell und dunkel)
  rechner.js          Baukasten für Rechnerseiten: Rechner.seite({ … }) baut die ganze Seite
  rechner.css         Design dazu
  blatt.js            Markdown-Leser für die Aufgabenblätter
  taschenrechner.js   Taschenrechner im Lernbereich
  katex/              Formelsatz (MIT-Lizenz der KaTeX-Autoren)
  og/                 Vorschaubilder für soziale Netzwerke (freiwillig)

elektro/ mechanik/ sanitaer/ heizung/ brandschutz/ arbeitsschutz/ dach/ it/ geld/
                      die Rechner, nach Bereich
protokolle/           Prüfprotokolle mit eigenem Aufbau (Elektro, IT-Sicherheit, Gefährdungsbeurteilung)
aufgabenblaetter/     Aufgabenblätter als Markdown, siehe aufgabenblaetter/LIESMICH.md
vorlage/              Beispielseite für Mitmachende (nicht auf der Startseite, nicht in Suchmaschinen)
daten/seiten/         je Seite eine JSON-Datei: Karte der Startseite, Verständnisfragen, Projektmappe, feste Nachbarn
fehlerprotokoll/      je behobenem Fehler eine Datei (siehe FEHLERPROTOKOLL.md)

werkzeuge/            Hilfsskripte (Node.js ohne Pakete), werden nicht ausgeliefert
  bauen.js            baut alles nach _site/ (ruft die folgenden auf); veröffentlicht wird nur _site/
  seo-bauen.js        Suchmaschinen-Angaben in jede Seite, sitemap.xml, robots.txt
  verwandt-bauen.js   „Passt dazu“ unter jeder Seite
  suche-bauen.js      Stichwortsuche (suchindex.json)
  blaetter-bauen.js   Liste der Aufgabenblätter
  pruefen/alles.js    automatische Prüfung (läuft bei jedem Pull Request)
  seo-daten.json      Zusatzangaben für einzelne Seiten

CNAME                 Domain für GitHub Pages
.github/workflows/    Prüfen (jeder Pull Request) und Veröffentlichen (nach jedem Merge: bauen und auf GitHub Pages)
LICENSE, LIZENZ.md    Code unter MIT, Aufgabenblätter unter CC BY 4.0
FEHLERPROTOKOLL.md    alle bisherigen Fehler mit Ursache und Behebung
```

## 3. Wie eine Seite funktioniert

Jede Seite hat dasselbe Gerüst:

```html
<head>
  <title>Name des Rechners – Formeln &amp; Rechner</title>
  <meta name="description" content="Ein bis zwei Sätze, was der Rechner kann.">
  theme-color, manifest, favicon, apple-touch-icon   ← wie in der Vorlage
  <link rel="stylesheet" href="../assets/katex/katex.min.css">
  <link rel="stylesheet" href="../assets/stil.css">
  <link rel="stylesheet" href="../assets/rechner.css">
  <script src="../assets/basis.js"></script>         ← im head, ohne defer
</head>
<body>
  <div id="seitenkopf" data-wurzel="../"></div>     ← Kopf (baut basis.js)
  <main class="seite" data-rechner data-merken> … </main>
  <div id="seitenfuss" data-wurzel="../"></div>     ← Fuß (baut basis.js)
  <script src="../assets/katex/katex.min.js"></script>
  <script src="../assets/rechner.js"></script>
  <script> Rechner.seite({ … }); </script>
</body>
```

`data-wurzel` ist der Weg zurück zur Startseite, für Seiten in einem Bereichsordner also `../`.

**Was basis.js für jede Seite erledigt**

| Aufgabe | Wie |
| --- | --- |
| Kopf und Fuß | aus `#seitenkopf` und `#seitenfuss` |
| Hell/Dunkel | Schalter im Kopf, Ereignis `themawechsel`, Farben mit `Thema.farbe('--text')` |
| Formeln | `Formel.setze(element, 'U = R \\cdot I', true)` oder `<span data-tex="…">` |
| Eingaben merken | `data-merken` am `<main>`: Felder werden gespeichert und kommen beim nächsten Besuch wieder |
| Link teilen | Knopf „Link mit diesen Werten kopieren“; die Werte stehen hinter `#werte=` und gehen nie an den Server |
| PDF, Favoriten, Offline | automatisch |

## 4. Der Rechner-Baukasten: `Rechner.seite({ … })`

Die Seite liefert nur Daten und Funktionen, `assets/rechner.js` baut daraus immer denselben Aufbau: Eingaben, Bild, Ergebnis, Löser, Rechenweg, Formelsammlung, häufige Fragen.

| Angabe | Bedeutung |
| --- | --- |
| `titel`, `einleitung`, `hilfe` | Überschrift, ein Absatz darunter, Hinweis über den Eingaben |
| `gruppen` | Eingaben in Gruppen: `{ titel, farbe, felder: [ … ] }` oder `{ titel, liste: { … } }` |
| `beispiel` | Startwerte, die sofort ein sinnvolles Ergebnis zeigen; Schlüssel wie bei den Feldern |
| `rechne(e)` | rechnet aus den Eingaben `e` und gibt ein Ergebnis-Objekt `r` zurück; nur Zahlen, keine Ausgabe |
| `ergebnis(r, e, H)` | zeigt das Ergebnis mit den Bausteinen `H` (siehe unten) |
| `weg(r, e)` | Rechenweg mit eingesetzten Zahlen: Liste von `[Titel, TeX]` |
| `loeser` | Löser in jede Richtung (siehe unten); daraus macht der Lernbereich Übungsaufgaben |
| `sammlung` | Formelsammlung: Liste von `[Name, TeX, Hinweis]`; liest auch der Lernbereich |
| `quellen` | Normen, Richtwerte, Annahmen als Text |
| `bild` | Zeichnung oder Animation auf Canvas (siehe unten) |
| `zusatz` | weitere Abschnitte: `[{ titel, bauen: function (tafel, h2) { … } }]` |

**Felder**

```js
{ k: 'a', tex: 'a', name: 'Länge', e: 'm', min: 0.1, max: 100 }
```

`k` Schlüssel · `tex` Formelzeichen · `name` Beschriftung · `e` Einheit · `min`/`max` erlaubter Bereich (alles außerhalb wird rot und nicht übernommen) · `ganz: true` nur ganze Zahlen · `hilfe` Erklärung · `wenn: function (e) { return e.art === 'x'; }` nur unter Bedingung zeigen · `wahl: [['wert', 'Text'], …]` Auswahlliste · `bei: function (e, wert, setze) { setze({ v: 15 }); }` andere Felder anpassen, wenn sich dieses ändert.

Listen (z. B. mehrere Räume oder Geräte): `liste: { k, name, zeile: 'Gerät', max, spalten: [ wie Felder, Text mit text: true ], neu: function (i) { return { … }; } }`. Ein Beispiel ist `geld/stromkosten.html`.

**Ergebnis-Bausteine `H`**

```js
H.urteil(true, 'reicht')                       // Marke oben rechts: true grün, false rot, null neutral
H.meldung('Hinweistext')                       // Hinweis; H.meldung('…', true) als Fehler
H.kacheln([[ '20 m²', 'Bodenfläche', '#2B7BB9' ], …])   // große Werte
H.nachweise([[ true, 'Was geprüft wird', 'Wert ≥ Grenze' ], …])   // ✓ / ✕ / i
H.tabelle('Titel', ['Spalte', …], zeilen, { zahl: [1, 2], klasse: function (i) { return 'gewaehlt'; } })
H.absatz('Text', 'Zwischenüberschrift')
```

**Hilfen für Zahlen und Formeln** (`const R = Rechner`)

| | |
| --- | --- |
| `R.zahl(w, n)` | Zahl deutsch mit `n` Nachkommastellen, nie `NaN` (dann „–“) |
| `R.tz(w, n)` | dieselbe Zahl für TeX |
| `R.E(tex)` | Ergebnis im Rechenweg farbig hervorheben |
| `R.farbe('--text')` | Farbe aus dem Design (hell/dunkel) |
| `R.Z.text`, `R.Z.pfeil`, `R.Z.achsen` | Zeichenhilfen für Canvas |

In TeX-Texten in JavaScript jeden Backslash doppelt schreiben: `'A = a \\cdot b'`.

**Löser in jede Richtung**

```js
loeser: {
  titel: 'Rechteck in jede Richtung',
  felder: [ { k: 'a', tex: 'a', name: 'Länge', e: 'm', min: 0.01, max: 1000, n: 2 }, … ],
  beispiel: { A: 20, a: 5 },
  gleichungen: [
    { name: 'Fläche', v: ['A', 'a', 'b'],
      f: function (x) { return [x.A, x.a * x.b]; },          // linke und rechte Seite
      loese: { A: function (x) { return x.a * x.b; }, … },  // freiwillig: sonst numerisch im Feldbereich
      weg: function (k, x) { return 'TeX'; } }               // freiwillig
  ]
}
```

Jede Gleichung mit genau einer unbekannten Größe wird gelöst, so lange, bis nichts mehr geht. Sind alle Größen einer Gleichung gegeben und passen nicht zusammen, wird das Feld rot. Der Lernbereich würfelt aus dem Löser Aufgaben in drei Schwierigkeiten; Größen, die nicht gewürfelt werden sollen, bekommen `fest: true`.

**Bild und Animation**

```js
bild: { titel: 'Grundriss', label: 'Beschreibung für Screenreader', animiert: true,
        hinweis: function (r, e) { return 'Text unter dem Bild'; },
        zeichne: function (cx, B, H, t, r, e) { … } }   // cx Canvas, B×H Pixel, t Zeit in ms
```

Hochauflösende Bildschirme, Größenänderung und Hell/Dunkel erledigt der Baukasten. Farben für Text und Linien mit `R.farbe('--text')` holen, damit beide Designs passen.

**Häufige Fragen** stehen als normales HTML im `<main>` (siehe Vorlage). Der Baukasten schiebt sie ans Ende, `seo-bauen.js` macht daraus strukturierte Daten für Suchmaschinen.

**Seiten ohne Baukasten** (z. B. Planer, Protokolle) sind erlaubt. Dann gilt: Formelsammlung in einem Element mit Klasse `formelsammlung`, jede Formel mit `Formel.setze`, Name als `h3`, Hinweis als `p` dahinter, damit der Lernbereich sie findet. Eigene Speicher- und Link-Daten laufen über `window.Teilen` aus `basis.js`; Daten aus Links und Speicher immer streng prüfen und Nutzertexte nie mit `innerHTML` einsetzen.

## 5. Schritt für Schritt: ein neuer Rechner

1. **Kopieren**: `vorlage/beispiel-rechner.html` in den passenden Bereich kopieren, Name klein mit Bindestrichen, z. B. `dach/dachflaeche.html`. Die Pfade `../` bleiben.
2. **Anpassen**: `<title>`, `meta description`, alles in `Rechner.seite({ … })` und die häufigen Fragen. Den Kommentar oben löschen.
3. **Daten zur Seite**: eine Datei `daten/seiten/dach/dachflaeche.json` (gleicher Pfad wie die Seite, Endung `.json`):
   ```json
   {
     "nr": 455,
     "titel": "Dachfläche",
     "gruppe": "Grundlagen",
     "bereich": "Dach und Klempnerei",
     "auchIn": ["Mechanik"],
     "themen": ["Dachfläche", "Dachneigung"],
     "text": "Gleicher Text wie meta description.",
     "tex": "A = \\frac{a \\cdot b}{\\cos\\alpha}",
     "verwandt": ["dach/sparren-lattung.html"],
     "projektmappe": {"nr": 455, "name": "Dachfläche", "farbe": "#A16207"},
     "fragen": [
       ["Frage?", "richtige Antwort", ["falsch", "falsch", "falsch"], "Erklärung"]
     ]
   }
   ```
   Pflicht sind `titel`, `bereich` (einer aus `BEREICHE` in index.html), `themen` (Suchwörter), `text` und `tex` (Formel auf der Karte). `nr` legt die Reihenfolge auf der Startseite fest (ohne `nr` ans Ende), `gruppe` die Untergruppe in großen Bereichen, `auchIn` weitere Bereiche. `verwandt` nennt feste Nachbarn für „Passt dazu“ (gelten in beide Richtungen), `projektmappe` braucht nur, wer eigene Daten speichert, `fragen` sind die Verständnisfragen im Lernbereich.
4. **Bauen**: `node werkzeuge/bauen.js`. Das baut die ganze Seite nach `_site/`: Startseite, Suchmaschinen-Angaben, „Passt dazu“, Suche, Offline-Liste mit neuem Stand, Fragen.
5. **Lernbereich prüfen**: `_site/lernen.html` öffnen (siehe Abschnitt 7), nur das neue Thema wählen. Formelsammlung und Formelkarten zeigen alle Formeln; mit Löser entstehen in allen drei Stufen sinnvolle Aufgaben.

**Nur Quellen einchecken**: die neue Seite, ihre Datei in `daten/seiten/`, eventuell Aufgabenblätter. Nie gebaute Inhalte und nie gemeinsame Listen – es gibt keine mehr, die man von Hand ändern muss. Deshalb kommen sich Pull Requests für verschiedene Seiten nicht in die Quere. Die Prüfung meldet, wenn doch etwas Gebautes in den Quellen steht.

## 6. Aufgabenblätter beitragen

Am einfachsten: eine Markdown-Datei unter `aufgabenblaetter/<bereich>/<seite>/`, danach `node werkzeuge/bauen.js`. Aufbau, erlaubte Elemente und Lösungen zum Aufklappen stehen in [`aufgabenblaetter/LIESMICH.md`](aufgabenblaetter/LIESMICH.md). Wer kein Git nutzt, kann ein Blatt auch per Mail schicken.

## 7. Lokal testen

Erst bauen, dann den gebauten Ordner über einen kleinen Webserver öffnen (nicht als Datei, die Seiten laden Formeln und Listen nach):

```
node werkzeuge/bauen.js
python3 -m http.server 8000 -d _site
```

Nach jeder Änderung an einer Quelle neu bauen. Die automatische Prüfung (wie im Pull Request) läuft mit `node werkzeuge/pruefen/alles.js`.

Dann http://localhost:8000/ im Browser. Vor dem Einreichen prüfen:

- Handy (320 und 380 px Breite) und PC, hell und dunkel: nichts läuft seitlich über, keine Fehler in der Konsole (F12)
- keine Anfragen an fremde Adressen (Netzwerk-Reiter)
- in jedes Feld 0, negativ, 1e9, Text, leer eintragen: kein Absturz, kein `NaN`, `Infinity` oder `undefined`
- Löser: Beispiel, leere Felder, widersprüchliche Werte (werden rot)
- „Link mit diesen Werten kopieren“ in einem anderen Fenster öffnen: alles gleich
- Netz trennen, neu laden: Seite läuft weiter
- Drucken bzw. „PDF erstellen“ sieht ordentlich aus
- JavaScript-Syntax nach ES2015, z. B. `npx acorn --ecma2015 --silent datei.js`

## 8. Einreichen

1. Repo auf GitHub forken, einen Branch mit sprechendem Namen anlegen (`dach-dachflaeche`).
2. Commit-Nachricht auf Deutsch: erste Zeile, was sich ändert; darunter Stichpunkte.
3. Pull Request gegen `main` öffnen und kurz sagen, was getestet wurde.
4. Wer einen Fehler behebt, legt eine Datei in [`fehlerprotokoll/`](fehlerprotokoll/) an: Fehler, Ursache, Behebung (siehe [FEHLERPROTOKOLL.md](FEHLERPROTOKOLL.md)).

Fehler gefunden, aber keine Zeit für Code? Ein Issue auf GitHub oder eine Mail an support@pr1m3.de reicht.

## 9. Lizenz

Mit einem Beitrag stellst du ihn unter dieselben Lizenzen wie das Projekt: Code unter [MIT](LICENSE), Aufgabenblätter unter [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de). Einzelheiten in [LIZENZ.md](LIZENZ.md). Nur eigene Texte, Bilder und Aufgaben einreichen oder solche, deren Lizenz das erlaubt.
