# Fehlerprotokoll – Formeln & Rechner

Alle bisher gefundenen Fehler in der Sammlung und wie sie behoben wurden, aus den PRs #1 bis #65. Neueste Fehler stehen oben.

**Neuer Fehler behoben?** Oben unter „Fehler“ einen Eintrag im selben Aufbau ergänzen: der Fehler als Überschrift, darunter Ursache, Behebung und PR.

## Fehler

### Aufgabenblätter ließen sich online nicht öffnen („Das Blatt ließ sich nicht laden“)

- **Ursache:** GitHub Pages lässt Jekyll laufen und wandelt jede `.md`-Datei in eine `.html`-Seite um. Die rohe `.md`, die die Lernseite lädt, gab es online nicht (404).
- **Behebung:** Leere Datei `.nojekyll` im Hauptordner. Pages liefert seitdem alle Dateien unverändert aus.
- **PR:** #64

### Kopfzeile lief bei 320 px um 1 px seitlich über (seit #53 bekannt)

- **Ursache:** zu viele Einträge in der Kopfzeile auf dem Handy
- **Behebung:** „Übersicht“ auf dem Handy zuerst ausgeblendet (#58), danach Reiter als eigene Zeile unter Logo und Knöpfen (#59)
- **PR:** #58, #59

### Taschenrechner: Tasten verschoben sich beim Tippen

- **Ursache:** Anzeige ohne feste Höhe, „Übernehmen“ kam und ging, 2nd-Beschriftungen änderten die Spaltenbreite
- **Behebung:** Anzeige mit fester Höhe, „Übernehmen“ immer vorhanden (nur unsichtbar), feste Spaltenbreiten
- **PR:** #60

### Grenzwert für Kohlenmonoxid falsch: 35 mg/m³ statt 23 mg/m³ (20 ppm)

- **Ursache:** veralteter Wert, nicht auf Stand der TRGS 900 (Juni 2026)
- **Behebung:** Wert berichtigt, Quellenangabe mit Stand ergänzt. Bei der Prüfung aller übrigen Richtwerte gegen die Quellen wurden keine weiteren Fehler gefunden.
- **PR:** #55

### Flucht- und Rettungswege: alte Werte, feste Grenze für den zweiten Fluchtweg

- **Ursache:** nicht auf ASR A2.3 (Fassung 2022)
- **Behebung:** Breiten 0,90 / 1,00 / 1,20 / 1,80 / 2,40 m mit Türmaßen, Längen 35 / 25 / 10 m, feste Grenze entfernt
- **PR:** #52

### U-Wert: nur pauschale Tauwasser-Warnung

- **Ursache:** vereinfachte Rechnung
- **Behebung:** Tauwassermenge nach Glaser über 90 Tage
- **PR:** #52

### Strom durch den Körper: Gleichstrom-Grenzen nur genähert, aber nicht gesagt

- **Ursache:** fehlender Hinweis
- **Behebung:** Quellenangabe sagt es jetzt offen
- **PR:** #52

### Schrauben und Dübel: nach Wechsel der Festigkeitsklasse „lässt sich nicht rechnen“

- **Ursache:** Fehler in der Rechnung nach dem Wechsel
- **Behebung:** behoben
- **PR:** #52

### Regenwasser: Boden „Lehm“ brach die Rechnung ab

- **Ursache:** Auswahlwert `1e-7` wurde als Text statt als Zahl gelesen
- **Behebung:** in `rechner.js` behoben (Zahlen in Exponentschreibweise werden erkannt). Gilt für alle Rechner.
- **PR:** #52

### Löser: als Widerspruch markierte Werte gingen beim Neuladen und im Teilen-Link verloren

- **Ursache:** rote Felder wurden nicht gespeichert
- **Behebung:** werden jetzt mit gemerkt und geteilt
- **PR:** #52

### Semikolon statt Abstand in Formeln (Fluchtwege, Erdung, U-Wert, Flaschenzug, PV-Dachplaner)

- **Ursache:** `\;` ging beim Erzeugen verloren (Backslash)
- **Behebung:** Formeln berichtigt. Seitdem gilt die Regel im Standard: Backslashes in Python-Patches mit `chr(92)` bauen.
- **PR:** #52

### Projektmappe: 16 Seiten mit gemerkten Eingaben fehlten

- **Ursache:** Liste `SEITEN` nicht nachgezogen
- **Behebung:** ergänzt; Startseite, Projektmappe, Sitemap und Offline-Liste gegeneinander abgeglichen
- **PR:** #52

### Klima und Hitze: gewählte Tabellenzeile nicht hervorgehoben

- **Ursache:** fehlende Zeilenklasse
- **Behebung:** ergänzt
- **PR:** #52

### Beispielwerte zeigten sofort Fehler oder Widerspruch (UV, Spannungsfall, Bildschirm, Gefahrstoffe, Feuchte, Feuerlöscher)

- **Ursache:** unpassende Startwerte
- **Behebung:** Beispielwerte angepasst
- **PR:** #52

### PDF: Auswahllisten und Textfelder abgeschnitten, halb leere Seiten, Fokusrahmen und Pfeilsymbole im Druck

- **Ursache:** Druckregeln unvollständig
- **Behebung:** Felder als Text, Tafeln dürfen umbrechen, Symbole und Rahmen im Druck aus
- **PR:** #53

### QR-Codes im PDF schlecht lesbar, Projektmappe mit seitenlangen Rohlinks

- **Ursache:** Module 0,33 mm, unkomprimierte Links
- **Behebung:** Module 0,5 mm, Fehlerkorrektur nach Datenmenge, komprimierte Links
- **PR:** #53

### PV-Etiketten: Strichcodes über das ganze Etikett gestreckt

- **Ursache:** Breite an das Etikett angepasst
- **Behebung:** natürliche Breite
- **PR:** #41

### Protokolle: über einen Link mit präpariertem Firmennamen ließ sich Code einschleusen (XSS)

- **Ursache:** Firmenname, Messgeräte-, Werkzeuglisten und Port-Zeilen wurden als HTML eingesetzt
- **Behebung:** nur noch als Text; alle Daten aus Link und Speicher streng geprüft; ein Teilen-Muster für alle Seiten
- **PR:** #23

### PV-Verschaltung: Änderungen nach Öffnen eines Links gingen beim Neuladen verloren, eigene Planung wurde überschrieben, Link sehr lang

- **Ursache:** Link blieb in der Adresse, keine Sicherung, unkomprimiert
- **Behebung:** Link nach dem Öffnen aus der Adresse, eigener Stand gesichert („Vorherige Planung wiederherstellen“), komprimiert hinter `#`
- **PR:** #22

### Protokolle: Eingabefelder winzig (teils unter 60 px, Port und CVSS 40–47 px)

- **Ursache:** Kopfbereiche als Tabellen mit bis zu vier Feldpaaren je Zeile
- **Behebung:** Raster aus Feldpaaren mit Bezeichnung darüber, Mindestbreiten
- **PR:** #19

### PV-Dachplaner: Wind fehlte im Druckfall

- **Ursache:** Lastfallkombination unvollständig
- **Behebung:** Kombinationen nach DIN EN 1990 (Schnee, Wind, Wind + 0,5·Schnee, Schnee + 0,6·Wind). Abgleich mit einem Statikbericht: Werte stimmen überein.
- **PR:** #6

### PV-Dachplaner: Last hangabwärts nicht geprüft

- **Ursache:** nur Druck und Sog betrachtet
- **Behebung:** Schub parallel zur Dachfläche, Halter einzeln in Newton geprüft
- **PR:** #5

### Gaubenrechner stürzte bei riesigen Eingaben ab

- **Ursache:** keine Begrenzung
- **Behebung:** Grenzen an den Feldern
- **PR:** #4

### PV-Dachplaner fror bei absurden Maßen ein (z. B. 1e9 m)

- **Ursache:** Schleifen ohne Begrenzung
- **Behebung:** Grenzen und begrenzte Schleifen
- **PR:** #4

### Seitlicher Überlauf bei 320 px (Selektivität, Leitungsdimensionierung)

- **Ursache:** zu breite Elemente
- **Behebung:** Layout angepasst
- **PR:** #4

### Lange Wörter auf Knöpfen brachen ohne Trennstrich um

- **Ursache:** fehlende Silbentrennung
- **Behebung:** behoben
- **PR:** #4

### Startseite blieb hängen

- **Ursache:** `index.html` erwartete `assets/katalog.js`, die es nicht mehr gab
- **Behebung:** Fassung mit den Einträgen direkt in der Datei wiederhergestellt, neue Seiten ergänzt
- **PR:** #1

### Animationen auf PV-Dach, PV-Notstrom und Selektivität liefen nicht immer

- **Ursache:** `bewegungAus` war nicht `false`
- **Behebung:** `bewegungAus = false` wie auf allen Seiten
- **PR:** #1

## Fallen bei den Werkzeugen im Repo

### `werkzeuge/seo-bauen.js` ändert das Datum in fast allen Seiten

- **Ursache:** in einem flachen Git-Klon (`--depth 1`) liefert `git log` für jede Datei das Datum des letzten Commits
- **Umgang:** nur die eigenen Dateien committen (steht in MITMACHEN.md)

### `werkzeuge/blaetter-bauen.js` sortiert die Einträge in `sw.js` um

- **Ursache:** das Werkzeug hängt die Blätter ans Ende der Liste `DATEIEN`
- **Umgang:** harmlos; wer einen kleinen Diff will, übernimmt nur den neuen `STAND`

## Was daraus gelernt wurde

- **Vor jedem PR testen:** 320, 380 und 1280 px, hell und dunkel, Grenzwerte, Angriffstest, offline, Druck. Checkliste in MITMACHEN.md, Abschnitt „Lokal testen“.
- **Auch online prüfen:** Der Fehler mit Jekyll trat nur auf GitHub Pages auf, lokal lief alles. Neue Dateiarten (z. B. `.md`, `.json`) nach dem Mergen einmal auf tools.pr1m3.de aufrufen.
- **Daten aus Link, Datei und Speicher nie vertrauen:** streng prüfen, Texte nie als HTML einsetzen.
- **Listen abgleichen:** Startseite, Projektmappe, `sitemap.xml` und `sw.js` müssen zusammenpassen.
- **Richtwerte mit Stand der Quelle angeben**, damit veraltete Werte auffallen.
