---
titel: KNX-Topologie und Adressen berechnen
stufe: mittel
beschreibung: Linien, Bereiche und Segmente planen, Spannungsversorgung auslegen, Leitungslängen prüfen, physikalische Adressen und zwei- und dreistufige Gruppenadressen umrechnen, Telegrammdauer.
---
# KNX-Topologie und Adressen berechnen

Name: ___  Datum: ___

Hilfe: [KNX-Planung](../../../gebaeudeautomation/knx-planung.html)

Benötigte Formeln: $PA = 4096 \cdot B + 256 \cdot L + T$, $GA_3 = 2048 \cdot H + 256 \cdot M + U$, $GA_2 = 2048 \cdot H + U$, $t_\text{T} = n_\text{Byte} \cdot 13 \cdot t_\text{Bit}$

## Aufgabe 1 – Grenzen der Topologie (TP-64)

1. Wie viele Busgeräte sind in einem Liniensegment, in einer Linie (mit Linienverstärkern) erlaubt?
2. Wie viele Linien hat ein Bereich, wie viele Bereiche hat eine Anlage?
3. Wie viele Busgeräte sind damit ohne Bereichs- und Hauptlinie theoretisch möglich?

:::lösung
1. 64 Geräte je Segment; mit bis zu drei Linienverstärkern 4 Segmente, zusammen 255 Geräte je Linie (Teilnehmeradressen 1 … 255).
2. 15 Linien je Bereich (über Linienkoppler an der Bereichslinie), 15 Bereiche (über Bereichskoppler an der Hauptlinie).
3. $15 \cdot 15 \cdot 255 = 57\,375$ Busgeräte.
:::

## Aufgabe 2 – Bürogebäude planen

Ein Bürogebäude bekommt 180 Busgeräte (TP-64, ohne Linienverstärker), Reserve 20 %, mittlere Stromaufnahme 10 mA je Gerät.

1. Wie viele Geräte sind mit Reserve einzuplanen und wie viele Linien braucht man?
2. Wie viele Geräte kommen in jede Linie, wenn man gleichmäßig verteilt?
3. Welche Spannungsversorgung (160, 320, 640, 1 280 mA) braucht jede Linie?
4. Welche Koppler werden gebraucht, wenn alle Linien in Bereich 1 liegen?

:::lösung
1. $180 \cdot 1{,}2 = 216$ Geräte; $216 / 64 = 3{,}4$ → **4 Linien**.
2. $180 / 4 = 45$ Geräte (mit Reserve 54 je Linie, unter 64).
3. $54 \cdot 10\ \text{mA} = 540\ \text{mA}$ → **640 mA** je Linie (320 mA reicht nicht).
4. 4 Linienkoppler (1.1.0 … 1.4.0) an der Bereichslinie 1.0; ein Bereichskoppler ist bei nur einem Bereich nicht nötig. Statt TP-Kopplern können IP-Router mit IP als Bereichslinie eingesetzt werden.
:::

## Aufgabe 3 – Leitungslängen

In einem Liniensegment sind verlegt: insgesamt 820 m Busleitung, größter Abstand von der Spannungsversorgung zu einem Gerät 380 m, größter Abstand zwischen zwei Geräten 640 m.

1. Prüfe alle Grenzwerte.
2. Wie lässt sich der Fehler beheben?

:::lösung
1. Gesamtlänge 820 m ≤ 1 000 m: in Ordnung. Spannungsversorgung – Gerät 380 m > 350 m: **zu lang**. Gerät – Gerät 640 m ≤ 700 m: in Ordnung.
2. Spannungsversorgung näher an die Mitte der Linie setzen oder eine zweite Spannungsversorgung einsetzen (Abstand der beiden mindestens 200 m).
:::

## Aufgabe 4 – Physikalische Adressen

1. Was bedeuten die drei Teile der Adresse 1.2.15?
2. Rechne 1.2.15 in eine Zahl und in Hexadezimal um.
3. Ein Busmonitor zeigt als Absender 0x1105. Welches Gerät war das?
4. Welche Adresse hat der Linienkoppler der Linie 3 im Bereich 2?

:::lösung
1. Bereich 1, Linie 2, Teilnehmer 15.
2. $4096 \cdot 1 + 256 \cdot 2 + 15 = 4\,623$ = 0x120F.
3. 0x11 = 17 = 1·16 + 1 → Bereich 1, Linie 1; 0x05 → Teilnehmer 5: **1.1.5**.
4. **2.3.0** – Koppler haben immer Teilnehmer 0.
:::

## Aufgabe 5 – Gruppenadressen

1. Rechne die dreistufige Gruppenadresse 2/3/15 in eine Zahl und in Hexadezimal um.
2. Wie lautet dieselbe Adresse zweistufig?
3. Im Telegramm steht als Ziel 0x0901. Welche dreistufige Gruppenadresse ist das?
4. Wie viele Bit haben Haupt-, Mittel- und Untergruppe?
5. Schlage eine Gliederung für ein Einfamilienhaus vor: funktional nach Gewerk oder räumlich?

:::lösung
1. $2048 \cdot 2 + 256 \cdot 3 + 15 = 4\,879$ = 0x130F.
2. $4\,879 - 2 \cdot 2048 = 783$ → **2/783**.
3. 0x0901 = 2 305; $2305 = 2048 \cdot 1 + 256 \cdot 1 + 1$ → **1/1/1**.
4. Hauptgruppe 5 Bit (0 … 31), Mittelgruppe 3 Bit (0 … 7), Untergruppe 8 Bit (0 … 255).
5. Beides geht, wichtig ist eine einheitliche Regel. Beispiel funktional: Hauptgruppe = Gewerk (1 Licht, 2 Jalousie, 3 Heizung), Mittelgruppe = Geschoss, Untergruppe = Raum/Funktion, z. B. 1/0/1 Licht EG Wohnen. Räumlich: Hauptgruppe = Geschoss, Mittelgruppe = Gewerk.
:::

## Aufgabe 6 – Telegrammdauer

Ein Schalttelegramm hat 9 Byte. Auf TP werden je Zeichen 13 Bit gerechnet (Start, 8 Datenbit, Parität, Stopp und 2 Bit Pause).

1. Berechne die Bitzeit bei 9 600 bit/s.
2. Berechne die Dauer des Telegramms.
3. Wie viele solcher Telegramme passen höchstens in eine Sekunde, wenn man insgesamt rund 20 ms je Telegramm mit Quittung rechnet?

:::lösung
1. $t_\text{Bit} = 1 / 9600\ \text{bit/s} = 104{,}2\ \mu\text{s}$.
2. $t_\text{T} = 9 \cdot 13 \cdot 104{,}2\ \mu\text{s} = 12{,}2\ \text{ms}$.
3. $1000\ \text{ms} / 20\ \text{ms} = 50$ Telegramme je Sekunde – deshalb filtern Linienkoppler und zyklische Sendungen sind sparsam einzustellen.
:::
