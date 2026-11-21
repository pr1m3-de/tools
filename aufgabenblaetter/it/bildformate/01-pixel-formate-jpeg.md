---
titel: Bildformate – Pixel, Farbtiefe und JPEG
stufe: mittel
beschreibung: Unkomprimierte Bildgröße, Farbanzahl, Druckgröße, Formatwahl je Motiv, JPEG mit DCT und Quantisierung, Generationsverlust, Bildlabor mit Messung von Größe und PSNR.
---
# Bildformate – Pixel, Farbtiefe und JPEG

Name: ___  Datum: ___

Benötigte Formeln: $S = \dfrac{B \cdot H \cdot b}{8}$, $N_\text{F} = 2^b$, $l = \dfrac{p}{r} \cdot 2{,}54\ \text{cm}$, $k = \dfrac{S_0}{S}$

Zum Ausprobieren: [Bildformate](../../../it/bildformate.html)

## Aufgabe 1 – Rechnen mit Pixeln

1. Ein Foto hat 4 000 × 3 000 Pixel. Wie viele Megapixel sind das? Wie groß ist es unkomprimiert mit 24 bit?
2. Als JPEG braucht es etwa 2 bit je Pixel. Wie groß wird die Datei, und wie groß ist der Kompressionsfaktor?
3. Ein Bildschirmfoto mit 1 920 × 1 080 Pixeln und 32 bit (mit Transparenz): Wie groß ist es unkomprimiert?
4. Wie viele Farben lassen sich mit 8 bit, 24 bit und 30 bit darstellen?

:::lösung
1. 12 MP. $S = \dfrac{12 \cdot 10^6 \cdot 24}{8}\ \text{Byte} = 36\ \text{MB}$
2. $S = \dfrac{12 \cdot 10^6 \cdot 2}{8}\ \text{Byte} = 3\ \text{MB}$, $k = 12$
3. $1\,920 \cdot 1\,080 \cdot 4\ \text{Byte} = 8{,}29\ \text{MB}$
4. 256; 16 777 216; 1 073 741 824 (etwa eine Milliarde, HDR).
:::

## Aufgabe 2 – Drucken

1. Wie groß lässt sich das 12-MP-Foto mit 300 dpi drucken?
2. Wie viele Pixel braucht ein Bild für eine A4-Seite quer (29,7 × 21 cm) bei 300 dpi?
3. Ein Plakat (84 × 59 cm) wird aus 2 m Abstand betrachtet, 100 dpi genügen. Reicht das 12-MP-Foto?

:::lösung
1. $\dfrac{4\,000}{300} \cdot 2{,}54 = 33{,}9\ \text{cm}$ mal $\dfrac{3\,000}{300} \cdot 2{,}54 = 25{,}4\ \text{cm}$
2. $\dfrac{29{,}7}{2{,}54} \cdot 300 = 3\,508$ mal $\dfrac{21}{2{,}54} \cdot 300 = 2\,480$ Pixel (8,7 MP)
3. Nötig: $\dfrac{84}{2{,}54} \cdot 100 = 3\,307$ mal $2\,323$ Pixel – ja, 4 000 × 3 000 reicht.
:::

## Aufgabe 3 – Das richtige Format

Ordne zu und begründe: Firmenlogo für Webseite und Briefkopf · Urlaubsfoto · Bildschirmfoto einer Tabelle · kurze Animation · Scan für das Archiv.

:::lösung
- Logo: SVG (Vektor, in jeder Größe scharf), sonst PNG.
- Foto: JPEG, WebP oder AVIF (verlustbehaftet, klein, Rauschen und Verläufe werden gut komprimiert).
- Bildschirmfoto mit Text: PNG (verlustfrei, harte Kanten ohne Ringe, große einfarbige Flächen).
- Animation: GIF für einfache, sonst animiertes WebP/AVIF oder ein kurzes Video.
- Scan fürs Archiv: PNG oder TIFF verlustfrei.
:::

## Aufgabe 4 – JPEG verstehen

Nutze die Ansicht „JPEG-Block (DCT)“ und das Bildlabor.

1. Stelle im Rechner JPEG mit Qualität 90, 50 und 10 ein. Wie viele der 64 Koeffizienten bleiben ungleich null? Was passiert mit dem Block?
2. Warum werden bei der Quantisierung vor allem die Koeffizienten rechts unten zu null?
3. Codiere das Testbild als JPEG mit Qualität 90, 75, 50 und 20. Notiere Größe und PSNR. Schiebe die Lupe auf die Schrift.
4. Codiere das Testbild als PNG. Warum ist es so viel größer, und wann wäre PNG kleiner als JPEG?
5. Probiere „10-mal neu speichern“. Erkläre das Ergebnis.

:::lösung
1. Je kleiner die Qualität, desto größer die Teiler der Quantisierungstabelle und desto mehr Koeffizienten werden null. Bei 10 bleiben nur wenige; der Block wird flächig und weich, Kanten verwischen.
2. Sie stehen für feine, schnelle Helligkeitswechsel, die das Auge schlecht sieht. Die Quantisierungstabelle hat dort große Werte.
3. Individuell; typisch: Größe und PSNR sinken mit der Qualität, an Schrift und Kanten entstehen Ringe und Blöcke.
4. PNG ist verlustfrei, Rauschen und Verläufe im Foto lassen sich kaum zusammenfassen. Bei Grafiken mit großen einfarbigen Flächen und Text ist PNG kleiner.
5. Jedes Speichern quantisiert erneut; mit wechselnder Qualität summieren sich die Fehler, der PSNR sinkt. Deshalb das Original verlustfrei aufbewahren.
:::
