# Fehlerprotokoll – Formeln & Rechner

Alle bisher gefundenen Fehler in der Sammlung und wie sie behoben wurden, aus den PRs #1 bis #65 (30.10. bis 15.11.2026). Neueste Fehler stehen oben.

**Neuer Fehler behoben?** Oben in der Tabelle eine Zeile ergänzen: Datum, Fehler, Ursache, Behebung, PR.

## Übersicht

| Datum | Fehler | Ursache | Behebung | PR |
| --- | --- | --- | --- | --- |
| 15.11. | Aufgabenblätter ließen sich online nicht öffnen („Das Blatt ließ sich nicht laden“) | GitHub Pages lässt Jekyll laufen und wandelt jede `.md`-Datei in eine `.html`-Seite um. Die rohe `.md`, die die Lernseite lädt, gab es online nicht (404). | Leere Datei `.nojekyll` im Hauptordner. Pages liefert seitdem alle Dateien unverändert aus. | #64 |
| 13.11. | Kopfzeile lief bei 320 px um 1 px seitlich über (seit #53 bekannt) | zu viele Einträge in der Kopfzeile auf dem Handy | „Übersicht“ auf dem Handy zuerst ausgeblendet (#58), danach Reiter als eigene Zeile unter Logo und Knöpfen (#59) | #58, #59 |
| 13.11. | Taschenrechner: Tasten verschoben sich beim Tippen | Anzeige ohne feste Höhe, „Übernehmen“ kam und ging, 2nd-Beschriftungen änderten die Spaltenbreite | Anzeige mit fester Höhe, „Übernehmen“ immer vorhanden (nur unsichtbar), feste Spaltenbreiten | #60 |
| 13.11. | Grenzwert für Kohlenmonoxid falsch: 35 mg/m³ statt 23 mg/m³ (20 ppm) | veralteter Wert, nicht auf Stand der TRGS 900 (Juni 2026) | Wert berichtigt, Quellenangabe mit Stand ergänzt. Bei der Prüfung aller übrigen Richtwerte gegen die Quellen wurden keine weiteren Fehler gefunden. | #55 |
| 11.11. | Flucht- und Rettungswege: alte Werte, feste Grenze für den zweiten Fluchtweg | nicht auf ASR A2.3 (Fassung 2022) | Breiten 0,90 / 1,00 / 1,20 / 1,80 / 2,40 m mit Türmaßen, Längen 35 / 25 / 10 m, feste Grenze entfernt | #52 |
| 11.11. | U-Wert: nur pauschale Tauwasser-Warnung | vereinfachte Rechnung | Tauwassermenge nach Glaser über 90 Tage | #52 |
| 11.11. | Strom durch den Körper: Gleichstrom-Grenzen nur genähert, aber nicht gesagt | fehlender Hinweis | Quellenangabe sagt es jetzt offen | #52 |
| 11.11. | Schrauben und Dübel: nach Wechsel der Festigkeitsklasse „lässt sich nicht rechnen“ | Fehler in der Rechnung nach dem Wechsel | behoben | #52 |
| 11.11. | Regenwasser: Boden „Lehm“ brach die Rechnung ab | Auswahlwert `1e-7` wurde als Text statt als Zahl gelesen | in `rechner.js` behoben (Zahlen in Exponentschreibweise werden erkannt). Gilt für alle Rechner. | #52 |
| 11.11. | Löser: als Widerspruch markierte Werte gingen beim Neuladen und im Teilen-Link verloren | rote Felder wurden nicht gespeichert | werden jetzt mit gemerkt und geteilt | #52 |
| 11.11. | Semikolon statt Abstand in Formeln (Fluchtwege, Erdung, U-Wert, Flaschenzug, PV-Dachplaner) | `\;` ging beim Erzeugen verloren (Backslash) | Formeln berichtigt. Seitdem gilt die Regel im Standard: Backslashes in Python-Patches mit `chr(92)` bauen. | #52 |
| 11.11. | Projektmappe: 16 Seiten mit gemerkten Eingaben fehlten | Liste `SEITEN` nicht nachgezogen | ergänzt; Startseite, Projektmappe, Sitemap und Offline-Liste gegeneinander abgeglichen | #52 |
| 11.11. | Klima und Hitze: gewählte Tabellenzeile nicht hervorgehoben | fehlende Zeilenklasse | ergänzt | #52 |
| 11.11. | Beispielwerte zeigten sofort Fehler oder Widerspruch (UV, Spannungsfall, Bildschirm, Gefahrstoffe, Feuchte, Feuerlöscher) | unpassende Startwerte | Beispielwerte angepasst | #52 |
| 11.11. | PDF: Auswahllisten und Textfelder abgeschnitten, halb leere Seiten, Fokusrahmen und Pfeilsymbole im Druck | Druckregeln unvollständig | Felder als Text, Tafeln dürfen umbrechen, Symbole und Rahmen im Druck aus | #53 |
| 11.11. | QR-Codes im PDF schlecht lesbar, Projektmappe mit seitenlangen Rohlinks | Module 0,33 mm, unkomprimierte Links | Module 0,5 mm, Fehlerkorrektur nach Datenmenge, komprimierte Links | #53 |
| 09.11. | PV-Etiketten: Strichcodes über das ganze Etikett gestreckt | Breite an das Etikett angepasst | natürliche Breite | #41 |
| 04.11. | Protokolle: über einen Link mit präpariertem Firmennamen ließ sich Code einschleusen (XSS) | Firmenname, Messgeräte-, Werkzeuglisten und Port-Zeilen wurden als HTML eingesetzt | nur noch als Text; alle Daten aus Link und Speicher streng geprüft; ein Teilen-Muster für alle Seiten | #23 |
| 04.11. | PV-Verschaltung: Änderungen nach Öffnen eines Links gingen beim Neuladen verloren, eigene Planung wurde überschrieben, Link sehr lang | Link blieb in der Adresse, keine Sicherung, unkomprimiert | Link nach dem Öffnen aus der Adresse, eigener Stand gesichert („Vorherige Planung wiederherstellen“), komprimiert hinter `#` | #22 |
| 04.11. | Protokolle: Eingabefelder winzig (teils unter 60 px, Port und CVSS 40–47 px) | Kopfbereiche als Tabellen mit bis zu vier Feldpaaren je Zeile | Raster aus Feldpaaren mit Bezeichnung darüber, Mindestbreiten | #19 |
| 03.11. | PV-Dachplaner: Wind fehlte im Druckfall | Lastfallkombination unvollständig | Kombinationen nach DIN EN 1990 (Schnee, Wind, Wind + 0,5·Schnee, Schnee + 0,6·Wind). Abgleich mit einem Statikbericht: Werte stimmen überein. | #6 |
| 02.11. | PV-Dachplaner: Last hangabwärts nicht geprüft | nur Druck und Sog betrachtet | Schub parallel zur Dachfläche, Halter einzeln in Newton geprüft | #5 |
| 02.11. | Gaubenrechner stürzte bei riesigen Eingaben ab | keine Begrenzung | Grenzen an den Feldern | #4 |
| 02.11. | PV-Dachplaner fror bei absurden Maßen ein (z. B. 1e9 m) | Schleifen ohne Begrenzung | Grenzen und begrenzte Schleifen | #4 |
| 02.11. | Seitlicher Überlauf bei 320 px (Selektivität, Leitungsdimensionierung) | zu breite Elemente | Layout angepasst | #4 |
| 02.11. | Lange Wörter auf Knöpfen brachen ohne Trennstrich um | fehlende Silbentrennung | behoben | #4 |
| 30.10. | Startseite blieb hängen | `index.html` erwartete `assets/katalog.js`, die es nicht mehr gab | Fassung mit den Einträgen direkt in der Datei wiederhergestellt, neue Seiten ergänzt | #1 |
| 30.10. | Animationen auf PV-Dach, PV-Notstrom und Selektivität liefen nicht immer | `bewegungAus` war nicht `false` | `bewegungAus = false` wie auf allen Seiten | #1 |

## Fallen bei den Werkzeugen im Repo

| Falle | Ursache | Umgang |
| --- | --- | --- |
| `werkzeuge/seo-bauen.js` ändert das Datum in fast allen Seiten | in einem flachen Git-Klon (`--depth 1`) liefert `git log` für jede Datei das Datum des letzten Commits | nur die eigenen Dateien committen (steht in MITMACHEN.md) |
| `werkzeuge/blaetter-bauen.js` sortiert die Einträge in `sw.js` um | das Werkzeug hängt die Blätter ans Ende der Liste `DATEIEN` | harmlos; wer einen kleinen Diff will, übernimmt nur den neuen `STAND` |

## Was daraus gelernt wurde

- **Vor jedem PR testen:** 320, 380 und 1280 px, hell und dunkel, Grenzwerte, Angriffstest, offline, Druck. Checkliste in MITMACHEN.md, Abschnitt „Lokal testen“.
- **Auch online prüfen:** Der Fehler mit Jekyll trat nur auf GitHub Pages auf, lokal lief alles. Neue Dateiarten (z. B. `.md`, `.json`) nach dem Mergen einmal auf tools.pr1m3.de aufrufen.
- **Daten aus Link, Datei und Speicher nie vertrauen:** streng prüfen, Texte nie als HTML einsetzen.
- **Listen abgleichen:** Startseite, Projektmappe, `sitemap.xml` und `sw.js` müssen zusammenpassen.
- **Richtwerte mit Stand der Quelle angeben**, damit veraltete Werte auffallen.
