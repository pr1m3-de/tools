---
titel: Videoformate – Datenrate, Codecs und Bildgruppen
stufe: mittel
beschreibung: Unkomprimierte Videodatenrate, Farbunterabtastung, Kompressionsfaktor, Dateigröße und Datenvolumen, Vergleich der Codecs, I-, P- und B-Bilder, Videolabor mit Bewegungsschätzung und Paketverlust.
---
# Videoformate – Datenrate, Codecs und Bildgruppen

Name: ___  Datum: ___

Benötigte Formeln: $R_0 = B \cdot H \cdot f \cdot b \cdot s$ (4:2:0 → s = 1,5), $S = \dfrac{R \cdot t}{8}$, $k = \dfrac{R_0}{R}$, $b_\text{px} = \dfrac{R}{B \cdot H \cdot f}$

Zum Ausprobieren: [Videoformate](../../../it/videoformate.html)

## Aufgabe 1 – Rohdaten

1. Berechne die unkomprimierte Datenrate für 1080p (1 920 × 1 080), 30 Bilder/s, 8 bit, 4:2:0.
2. Wie viel Speicher bräuchte eine Minute davon?
3. Wie groß wäre die Datenrate mit 4:4:4? Warum verwendet man zum Anschauen 4:2:0?
4. Berechne die Rohdatenrate für 4K (3 840 × 2 160), 60 Bilder/s, 10 bit, 4:2:0.

:::lösung
1. $R_0 = 1\,920 \cdot 1\,080 \cdot 30 \cdot 8 \cdot 1{,}5\ \tfrac{\text{bit}}{\text{s}} = 746\ \tfrac{\text{Mbit}}{\text{s}}$
2. $\dfrac{746 \cdot 60}{8\,000}\ \text{GB} = 5{,}6\ \text{GB}$
3. Doppelt so viel: $1\,493\ \tfrac{\text{Mbit}}{\text{s}}$. Das Auge sieht Farbe weniger scharf als Helligkeit, die halbe Farbauflösung fällt nicht auf.
4. $3\,840 \cdot 2\,160 \cdot 60 \cdot 10 \cdot 1{,}5 = 7\,465\ \tfrac{\text{Mbit}}{\text{s}}$ – fast 7,5 Gbit/s.
:::

## Aufgabe 2 – Codiert

1. Ein 1080p-Film läuft mit H.264 und 4,35 Mbit/s. Berechne den Kompressionsfaktor und die Größe für 120 min.
2. AV1 braucht für dieselbe Qualität etwa 48 % der Datenrate. Wie groß wird der Film?
3. Berechne die Bits je Pixel für 5 Mbit/s bei 1080p mit 25 Bildern/s.
4. Reicht ein Anschluss mit 16 Mbit/s für einen 4K-Stream mit 15 Mbit/s? Begründe.

:::lösung
1. $k = \dfrac{746}{4{,}35} = 172$; $S = \dfrac{4{,}35 \cdot 7\,200}{8\,000}\ \text{GB} = 3{,}9\ \text{GB}$
2. $0{,}48 \cdot 3{,}9\ \text{GB} = 1{,}9\ \text{GB}$
3. $b_\text{px} = \dfrac{5 \cdot 10^6}{2\,073\,600 \cdot 25} = 0{,}096\ \text{bit}$
4. Kaum: Der Anschluss liefert in der Praxis weniger als die Nennrate, und andere Geräte teilen ihn. Mit etwa 25 % Reserve wären 19 Mbit/s nötig.
:::

## Aufgabe 3 – Bildgruppen

1. Erkläre I-, P- und B-Bild.
2. Eine GOP ist 50 Bilder lang, das Video hat 25 Bilder/s. Wie oft kommt ein I-Bild?
3. Warum kann man beim Spulen oft nur in Sprüngen vorwärts?
4. Warum verwenden Videokonferenzen meist keine B-Bilder?

:::lösung
1. I: ganzes Bild, unabhängig decodierbar, groß. P: nur Unterschied zu einem früheren Bild. B: Unterschied zu einem früheren und einem späteren Bild, am kleinsten.
2. Alle $\dfrac{50}{25} = 2\ \text{s}$.
3. Ohne Vorgeschichte lässt sich nur an I-Bildern einsteigen.
4. B-Bilder brauchen ein späteres Bild als Bezug; der Codierer muss darauf warten. Das kostet Verzögerung, die im Gespräch stört.
:::

## Aufgabe 4 – Videolabor

1. Stelle die Quantisierung auf 5 und dann auf 30. Wie ändern sich Datenrate und Rauschabstand? Wo werden Fehler zuerst sichtbar?
2. Stelle die GOP-Länge auf 1 und dann auf 60. Was passiert mit der Datenrate, und warum?
3. Löse einen Paketverlust aus. Beschreibe, was im decodierten Bild geschieht und wann der Fehler verschwindet.
4. Schalte die Bewegungsvektoren ein. Wo zeigen sie in dieselbe Richtung, wo nicht, und warum?

:::lösung
1. Feinere Quantisierung: höhere Datenrate, höherer Rauschabstand. Grobe: Blöcke und Flecken, zuerst an bewegten Kanten und feinen Mustern.
2. GOP 1: nur I-Bilder, die Datenrate steigt stark. GOP 60: fast nur P-Bilder, die Datenrate sinkt deutlich, weil sich aufeinanderfolgende Bilder ähneln.
3. Der Decodierer hat ein falsches Referenzbild; die folgenden P-Bilder bauen darauf auf, Fehler wandern mit den Bewegungsvektoren durchs Bild – bis zum nächsten I-Bild.
4. Im Hintergrund zeigen alle Vektoren gleich (Kameraschwenk), am Ball, an der Laufschrift und an Kanten abweichend, im gleichmäßigen Himmel teils zufällig (alle Stellen sehen gleich aus).
:::
