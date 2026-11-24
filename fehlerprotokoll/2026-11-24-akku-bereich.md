# Akku-Seite stand in einem eigenen Bereich „Elektro“

- **Ursache:** Beim Eintrag auf der Startseite stand `bereich: 'Elektro'` statt `'Elektrotechnik'`. Die Startseite legte dafür einen zusätzlichen Reiter in Grau an.
- **Behebung:** Bereich korrigiert. `werkzeuge/bauen.js` lässt nur noch Bereiche aus `BEREICHE` in index.html zu und bricht sonst ab.
