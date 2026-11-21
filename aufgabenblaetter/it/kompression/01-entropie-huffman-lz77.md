---
titel: Datenkompression – Entropie, Huffman und LZ77
stufe: mittel
beschreibung: Informationsgehalt und Entropie, Bit für einen Zeichenvorrat, Huffman-Baum von Hand, Lauflängencodierung, LZ77-Tokens, Kompressionsfaktor, Grenzen der Kompression.
---
# Datenkompression – Entropie, Huffman und LZ77

Name: ___  Datum: ___

Benötigte Formeln: $I = \log_2 \dfrac{1}{p}$, $H = -\sum p_i \log_2 p_i$, $b = \lceil \log_2 N \rceil$, $k = \dfrac{S_0}{S_1}$

Zum Ausprobieren: [Datenkompression](../../../it/kompression.html)

## Aufgabe 1 – Information

1. Wie viel Information steckt in einem Ereignis mit der Wahrscheinlichkeit 1/8? Und im Wurf eines Würfels?
2. Wie viele Bit braucht man mindestens für die 26 Buchstaben A bis Z, wenn alle gleich häufig sind? Wie viele ganze Bit?
3. Eine Münze zeigt in 90 % der Würfe Kopf. Wie groß ist die Entropie? Was bedeutet das?

:::lösung
1. $I = \log_2 8 = 3\ \text{bit}$; Würfel: $\log_2 6 = 2{,}585\ \text{bit}$.
2. $\log_2 26 = 4{,}70\ \text{bit}$, also 5 ganze Bit.
3. $H = -0{,}9 \log_2 0{,}9 - 0{,}1 \log_2 0{,}1 = 0{,}469\ \text{bit}$. Eine lange Folge solcher Würfe lässt sich im Mittel auf weniger als die Hälfte komprimieren.
:::

## Aufgabe 2 – Huffman von Hand

Text: ABRAKADABRA

1. Zähle die Zeichen und berechne die Entropie.
2. Baue den Huffman-Baum (immer die zwei seltensten Knoten zusammenfassen) und gib die Codes an.
3. Wie viele Bit braucht der codierte Text? Vergleiche mit 8 bit je Zeichen und mit einem festen 3-bit-Code.
4. Prüfe mit dem Kompressionslabor. Warum dürfen die Codes verschieden sein und trotzdem gleich gut?

:::lösung
1. A 5, B 2, R 2, K 1, D 1 (11 Zeichen). $H = 2{,}04\ \text{bit}$ je Zeichen.
2. Z. B. A = 0, B = 100, R = 101, K = 110, D = 111 (auch andere Lösungen möglich, z. B. A = 0, R = 10, B = 110, K = 1110, D = 1111).
3. $5 \cdot 1 + 2 \cdot 3 + 2 \cdot 3 + 1 \cdot 3 + 1 \cdot 3 = 23\ \text{bit}$ (2,09 bit je Zeichen). 8 bit: 88 bit; fester 3-bit-Code: 33 bit.
4. Bei gleich häufigen Knoten ist die Wahl beliebig; die Gesamtlänge bleibt minimal.
:::

## Aufgabe 3 – Lauflängen und LZ77

1. Codiere die Bildzeile WWWWWWWWWWBBBWWWWW mit Lauflängen. Wie viele Byte sind es mit je 1 Byte für Anzahl und Farbe?
2. Codiere WBWBWBWB mit Lauflängen. Was fällt auf?
3. Bilde die LZ77-Tokens für ABCABCABCABC (Verweise ab 3 Zeichen).
4. Warum kombinieren ZIP und PNG LZ77 mit Huffman?

:::lösung
1. 10W 3B 5W: 3 Läufe = 6 Byte statt 18 Byte.
2. 8 Läufe = 16 Byte statt 8 Byte: Die Datei wird doppelt so groß.
3. A, B, C, (3, 9) – vier Tokens; der Verweis darf in den gerade erzeugten Text hineinreichen.
4. LZ77 entfernt Wiederholungen ganzer Zeichenfolgen; Huffman codiert danach die übrigen Zeichen und Verweise mit kurzen Codes für häufige Werte. Beides zusammen nutzt beide Arten von Redundanz.
:::

## Aufgabe 4 – Grenzen

1. Ein Ordner mit 12 MB Text wird als ZIP 3 MB groß. Berechne Kompressionsfaktor und Einsparung.
2. Ein Ordner mit JPEG-Fotos schrumpft beim Zippen nur um 1 %. Warum?
3. Begründe, warum es kein Verfahren geben kann, das jede Datei verlustfrei verkleinert.
4. Gib im Kompressionslabor das Beispiel „Zufallszeichen“ ein. Welches Verfahren schneidet am schlechtesten ab und warum?

:::lösung
1. $k = 4$, Einsparung 75 %.
2. JPEG ist bereits komprimiert; die Daten haben fast keine Redundanz mehr.
3. Es gibt $2^n$ Dateien mit n Bit, aber nur $2^n - 1$ kürzere. Mindestens zwei Dateien müssten auf dieselbe kürzere abgebildet werden – dann lässt sich nicht mehr eindeutig entpacken.
4. Lauflängen (fast keine Wiederholungen, jedes Zeichen kostet 2 Byte) und LZ77 (keine Treffer, Kennbit kostet extra). Huffman spart nur, weil 64 Zeichen mit 6 statt 8 bit auskommen.
:::
