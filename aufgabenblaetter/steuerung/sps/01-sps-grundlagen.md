---
titel: SPS-Grundlagen – Aufbau, Zyklus und Signale
stufe: leicht
beschreibung: Aufbau einer SPS, Zyklus mit Prozessabbild, Reaktionszeit, Öffner und Schließer, Drahtbruchsicherheit, Adressen, Datentypen, Analogwerte skalieren und die Sprachen der IEC 61131-3.
---
# SPS-Grundlagen – Aufbau, Zyklus und Signale

Name: ___  Datum: ___

Hilfe: [SPS-Simulator](../../../steuerung/sps.html)

Benötigte Formeln: $y = \frac{x - x_\text{min}}{x_\text{max} - x_\text{min}} \cdot (y_\text{max} - y_\text{min}) + y_\text{min}$, $t_\text{R,max} \approx 2 \cdot t_\text{Zyklus}$

## Aufgabe 1 – Verbindungsprogrammiert oder speicherprogrammiert?

1. Was ist der Unterschied zwischen einer Schützsteuerung und einer SPS?
2. Nenne drei Vorteile der SPS.
3. Nenne die Baugruppen einer modularen SPS.

:::lösung
1. Bei der Schützsteuerung steckt die Funktion in der Verdrahtung (verbindungsprogrammiert). Bei der SPS steckt sie im Programm; die Sensoren und Aktoren werden nur an Ein- und Ausgänge angeschlossen.
2. Änderungen ohne Umverdrahten, weniger Platz und Bauteile, Zeiten und Zähler ohne zusätzliche Geräte, Diagnose und Vernetzung, Programm kopierbar.
3. Stromversorgung (24 V DC), CPU, digitale Ein- und Ausgabebaugruppen, analoge Baugruppen, Kommunikationsbaugruppen.
:::

## Aufgabe 2 – Der Zyklus

1. Beschreibe die drei Schritte eines SPS-Zyklus.
2. Ein Taster wird für 15 ms gedrückt, die Zykluszeit beträgt 20 ms. Kann die SPS den Tastendruck verpassen? Begründe.
3. Wie lange dauert es höchstens, bis ein Ausgang auf einen Eingang reagiert (Zykluszeit 10 ms, Ein- und Ausgabeverzögerung zusammen 6 ms)?
4. Probiere im Simulator: Beispiel „Förderband“, Zykluszeit 2 s. Was passiert mit dem Zähler?

:::lösung
1. Eingänge in das Prozessabbild der Eingänge (PAE) lesen – Programm von oben nach unten abarbeiten – Prozessabbild der Ausgänge (PAA) auf die Ausgänge schreiben.
2. Ja. Fällt der Tastendruck genau zwischen zwei Lesezeitpunkte, sieht das Programm ihn nie. Signale müssen länger als eine Zykluszeit anstehen (sonst Alarm- oder Zähleingänge verwenden).
3. $t_\text{R,max} \approx 2 \cdot 10\ \text{ms} + 6\ \text{ms} = 26\ \text{ms}$.
4. Die Teile stehen nur etwa 0,3 s in der Lichtschranke. Bei 2 s Zykluszeit werden die meisten nicht gezählt – die Kiste läuft über.
:::

## Aufgabe 3 – Öffner und Schließer

1. Welchen Signalzustand liefert ein unbetätigter Öffner, welchen ein unbetätigter Schließer?
2. Warum werden Stopp, Not-Halt und Endschalter als Öffner angeschlossen?
3. Ergänze die Selbsthaltung: Start = Schließer, Stopp = Öffner.

`Motor := (Start OR Motor) ___ Stopp;`

4. Darf ein Not-Halt nur über die SPS abschalten?

:::lösung
1. Öffner: 1. Schließer: 0.
2. Drahtbruchsicherheit: Bricht ein Draht oder fällt ein Stecker ab, sieht die SPS 0 wie bei „betätigt“ – die Anlage stoppt. Ein Schließer würde bei Drahtbruch nie mehr auslösen.
3. `AND` – weil der Öffner im Ruhezustand 1 liefert. (Mit Schließer müsste man `AND NOT Stopp` schreiben.)
4. Nein. Not-Halt wird über Sicherheitsschaltgeräte oder eine Sicherheits-SPS ausgeführt, die die Energie unabhängig vom normalen Programm abschalten (EN ISO 13849, EN 60204-1).
:::

## Aufgabe 4 – Adressen und Datentypen

1. Was bedeuten %IX1.5, %QX0.2 und %IW64?
2. Welche Datentypen passen: Zustand eines Tasters, Stückzahl bis 20 000, Temperatur 21,7 °C, Wartezeit 5 Sekunden?
3. Warum ist `Zaehler := 32767 + 1;` bei INT ein Problem?

:::lösung
1. %IX1.5: Eingang Byte 1, Bit 5. %QX0.2: Ausgang Byte 0, Bit 2. %IW64: Eingangswort ab Byte 64 (16 Bit, z. B. Analogwert).
2. BOOL, INT, REAL, TIME (z. B. T#5s).
3. INT reicht nur bis 32 767 – der Wert läuft über und springt ohne Fehlermeldung auf −32 768 (probier es im Simulator aus und beobachte die Variable). Der Übersetzer warnt, wenn er das erkennen kann. DINT verwenden.
:::

## Aufgabe 5 – Analogwerte

Ein Drucksensor 0 … 10 bar liefert 4 … 20 mA. Die Analogbaugruppe wandelt 4 … 20 mA in 0 … 10 000.

1. Welcher Druck entspricht 12 mA?
2. Welcher Druck entspricht dem Rohwert 7 350?
3. Die Baugruppe misst 2 mA. Was bedeutet das?

:::lösung
1. $p = \frac{12 - 4}{16} \cdot 10\ \text{bar} = 5\ \text{bar}$.
2. $p = \frac{7350}{10000} \cdot 10\ \text{bar} = 7{,}35\ \text{bar}$.
3. Unter 4 mA (meist unter 3,6 mA) liegt ein Drahtbruch oder ein Sensorfehler vor – der Vorteil des „lebenden Nullpunkts“.
:::

## Aufgabe 6 – Programmiersprachen

Ordne zu: KOP, FUP, ST, AWL, AS.

| Beschreibung | Sprache |
|---|---|
| Textsprache ähnlich Pascal mit IF, CASE, FOR | ___ |
| Stromlaufplan mit Kontakten und Spulen, gedreht | ___ |
| Logikbausteine mit &, ≥1, verbunden durch Linien | ___ |
| Schritte und Übergänge für Abläufe | ___ |
| Maschinennahe Befehlsliste, in der Norm als auslaufend gekennzeichnet | ___ |

:::lösung
ST, KOP, FUP, AS, AWL.
:::
