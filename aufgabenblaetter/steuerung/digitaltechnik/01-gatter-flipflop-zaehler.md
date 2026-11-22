---
titel: Digitaltechnik
stufe: leicht
beschreibung: Wahrheitstabellen der Grundgatter, NICHT aus NAND, De Morgan, D- und T-Flipflop, Binärzähler als Frequenzteiler, binäre Addition mit Übertrag.
---
# Digitaltechnik

Name: ___  Datum: ___

Benötigte Formeln: $N = 2^n$, $f_a = \dfrac{f_e}{2^n}$, $S = A \oplus B$, $C = A \land B$

Zum Ausprobieren: [Digitaltechnik](../../../steuerung/digitaltechnik.html)

## Aufgabe 1 – Gatter

1. Schreibe die Wahrheitstabellen für UND, ODER, NAND und XOR mit zwei Eingängen auf.
2. Welches Gatter ist gemeint: „Die Lampe leuchtet, wenn genau einer der beiden Schalter an ist“?
3. Wie baut man aus einem NAND-Gatter ein NICHT-Gatter?
4. Prüfe mit der Wahrheitstabelle: $\overline{A \land B} = \overline{A} \lor \overline{B}$.

:::lösung
1. Ausgang Y für (A, B) = 00, 01, 10, 11 – UND: 0 0 0 1; ODER: 0 1 1 1; NAND: 1 1 1 0; XOR: 0 1 1 0
2. XOR (Exklusiv-ODER), zum Beispiel eine Wechselschaltung
3. Beide Eingänge verbinden: $\overline{A \land A} = \overline{A}$
4. Für 00, 01, 10, 11 ergeben beide Seiten 1, 1, 1, 0 – also gleich (De Morgan).
:::

## Aufgabe 2 – Flipflops

1. Ein D-Flipflop hat Q = 0. D wechselt zwischen zwei Taktflanken mehrmals zwischen 0 und 1 und ist bei der nächsten steigenden Flanke 1. Welchen Wert hat Q danach?
2. Ein T-Flipflop bekommt einen Takt von 1 kHz. Welche Frequenz hat Q?
3. Ein RS-Flipflop: S = 1, dann S = 0. Welchen Wert hat Q? Was passiert danach mit R = 1?

:::lösung
1. Q = 1 – nur der Wert bei der Flanke zählt, die Wechsel davor nicht.
2. 500 Hz, weil Q bei jeder steigenden Flanke kippt.
3. Q = 1 und bleibt gespeichert, auch wenn S wieder 0 ist. Mit R = 1 wird Q = 0.
:::

## Aufgabe 3 – Zähler und Frequenzteiler

1. Wie viele Zustände hat ein 8-Bit-Zähler, und bis zu welcher Zahl zählt er?
2. Ein Uhrenquarz schwingt mit 32 768 Hz. Wie viele Stufen braucht man für 1 Hz?
3. Ein 1-MHz-Takt wird mit 10 Stufen geteilt. Welche Frequenz kommt heraus?
4. Wie viele Bits braucht man, um 1000 verschiedene Werte zu zählen?

:::lösung
1. $2^8 = 256$ Zustände, von 0 bis 255
2. $32\,768 = 2^{15}$ → 15 Stufen
3. $f_a = \dfrac{1\,000\,000}{2^{10}}\ \text{Hz} = 976{,}6\ \text{Hz}$
4. 10 Bit ($2^{10} = 1024 \ge 1000$, $2^9 = 512$ reicht nicht)
:::

## Aufgabe 4 – Addieren

1. Rechne 11 und 6 ins Binärsystem um und addiere sie schriftlich mit Übertrag.
2. Passt das Ergebnis noch in 4 Bit?
3. Welche zwei Gatter bilden einen Halbaddierer?

:::lösung
1. $1011_2 + 0110_2 = 10001_2 = 17$
2. Nein, das fünfte Bit ist der Übertrag (4 Bit reichen nur bis 15).
3. XOR für die Summe, UND für den Übertrag.
:::
