---
titel: Prüfsummen und Fehlerkorrektur
stufe: mittel
beschreibung: Paritätsbit bilden und prüfen, Grenzen der Parität, Hamming(7,4) codieren und einen Fehler über das Syndrom korrigieren, CRC-8 als Division, fehlerfreie Pakete bei einer Bitfehlerrate.
---
# Prüfsummen und Fehlerkorrektur

Name: ___  Datum: ___

Benötigte Formeln: $p_1 = d_1 \oplus d_2 \oplus d_4$, $p_2 = d_1 \oplus d_3 \oplus d_4$, $p_3 = d_2 \oplus d_3 \oplus d_4$, Codewort $p_1\,p_2\,d_1\,p_3\,d_2\,d_3\,d_4$, $s = s_1 + 2 s_2 + 4 s_3$, $P = (1 - p)^n$, $R = \dfrac{k}{n}$

Zum Ausprobieren: [Prüfsummen und Fehlerkorrektur](../../../it/pruefsummen.html)

## Aufgabe 1 – Paritätsbit

1. Bilde das Paritätsbit für 01001011 bei gerader und bei ungerader Parität.
2. Empfangen wird 01001111 mit Paritätsbit 0 (gerade Parität). Was stellt der Empfänger fest?
3. Warum bleibt ein Fehler in zwei Bits unbemerkt?

:::lösung
1. 4 Einsen: gerade Parität 0, ungerade Parität 1
2. 5 Einsen plus Paritätsbit 0 – ungerade: Fehler erkannt, aber nicht, welches Bit.
3. Zwei Fehler ändern die Anzahl der Einsen um 0 oder 2, die Parität bleibt gleich.
:::

## Aufgabe 2 – Hamming(7,4)

1. Codiere das Datenwort 0110 ($d_1 d_2 d_3 d_4$).
2. Empfangen wird 1100100. Berechne das Syndrom mit $s_1 = c_1 \oplus c_3 \oplus c_5 \oplus c_7$, $s_2 = c_2 \oplus c_3 \oplus c_6 \oplus c_7$, $s_3 = c_4 \oplus c_5 \oplus c_6 \oplus c_7$ und korrigiere.
3. Wie groß ist die Coderate? Wie viele Prüfbits braucht man für 64 Datenbits ($2^r \ge k + r + 1$)?

:::lösung
1. $p_1 = 0 \oplus 1 \oplus 0 = 1$, $p_2 = 0 \oplus 1 \oplus 0 = 1$, $p_3 = 1 \oplus 1 \oplus 0 = 0$ → 1100110
2. $s_1 = 1 \oplus 0 \oplus 1 \oplus 0 = 0$, $s_2 = 1 \oplus 0 \oplus 0 \oplus 0 = 1$, $s_3 = 0 \oplus 1 \oplus 0 \oplus 0 = 1$ → $s = 6$: Bit 6 umdrehen → 1100110, Daten 0110
3. $R = \dfrac{4}{7} = 0{,}57$; für 64 Bit: $r = 7$ ($2^7 = 128 \ge 72$)
:::

## Aufgabe 3 – CRC

1. Berechne die CRC-8 (Generator 100000111) für das Byte 00000001: Hänge 8 Nullen an und dividiere mit XOR.
2. Warum hängt Ethernet eine CRC an jedes Paket und keine einfache Parität?

:::lösung
1. 00000001 00000000: Die erste 1 steht an der Stelle von $x^8$; XOR mit 100000111 ergibt den Rest 00000111 = 0x07.
2. Die CRC-32 erkennt alle Ein- und Zweibitfehler, alle ungeraden Fehlerzahlen und alle Bündelfehler bis 32 Bit – die Parität nur ungerade Fehlerzahlen.
:::

## Aufgabe 4 – Bitfehlerrate

1. Wie viel Prozent der Pakete mit 1500 Byte kommen bei einer Bitfehlerrate von $10^{-6}$ fehlerfrei an?
2. Wie viele Bitfehler je Sekunde sind bei 1 Gbit/s und einer Bitfehlerrate von $10^{-9}$ zu erwarten?

:::lösung
1. $n = 12\,000\ \text{bit}$: $P = (1 - 10^{-6})^{12\,000} = 0{,}988$ → 98,8 %
2. $E = 10^{-9} \cdot 10^9 = 1$ Fehler je Sekunde
:::
