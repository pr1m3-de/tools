# Pull Requests für neue Seiten hatten ständig Merge-Konflikte

- **Ursache:** Jede neue Seite musste in gemeinsame Dateien eingetragen werden (Liste der Startseite, Projektmappe, Fragen, Offline-Liste mit Versionsstand, feste Nachbarn). Dazu schrieben die Werkzeuge gebaute Inhalte (SEO-Blöcke, „Passt dazu“, Sitemap, Suchindex, Blätter-Liste) in viele Dateien. Zwei offene Pull Requests änderten so fast immer dieselben Zeilen.
- **Behebung:** Je Seite eine Datei in `daten/seiten/`; `werkzeuge/bauen.js` baut alles Gemeinsame nach `_site/`, veröffentlicht wird `_site/` über GitHub Actions. Gebaute Inhalte stehen nicht mehr im Repository, die Prüfung verhindert, dass sie wieder hineinkommen. Fehler werden als eigene Dateien in `fehlerprotokoll/` festgehalten.
