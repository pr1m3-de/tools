---
titel: Kleinsteuerung im Funktionsplan
stufe: leicht
beschreibung: Grundverknüpfungen und Wahrheitstabellen, negierte Eingänge, Treppenlicht, Stromstoßrelais, Ein- und Ausschaltverzögerung, Rolltor mit Verriegelung, Schaltuhr und Analogschwellwert – mit dem Kleinsteuerungs-Simulator.
---
# Kleinsteuerung im Funktionsplan

Name: ___  Datum: ___

Arbeite mit dem [Kleinsteuerungs-Simulator](../../../steuerung/kleinsteuerung.html).

## Aufgabe 1 – Wahrheitstabellen

Fülle aus.

| A | B | UND | ODER | XOR | NAND | NOR |
|---|---|---|---|---|---|---|
| 0 | 0 | ___ | ___ | ___ | ___ | ___ |
| 0 | 1 | ___ | ___ | ___ | ___ | ___ |
| 1 | 0 | ___ | ___ | ___ | ___ | ___ |
| 1 | 1 | ___ | ___ | ___ | ___ | ___ |

:::lösung
| A | B | UND | ODER | XOR | NAND | NOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |
:::

## Aufgabe 2 – Welche Funktion?

1. Licht im Treppenhaus soll nach 2 Minuten ausgehen, jeder Tastendruck startet die Zeit neu.
2. Ein Flurlicht wird von drei Tastern ein- und ausgeschaltet.
3. Ein Badlüfter soll nach dem Ausschalten des Lichts noch 5 Minuten laufen.
4. Eine Pumpe soll erst laufen, wenn der Druckschalter 10 s geschlossen ist.
5. Die Außenbeleuchtung soll von 17:00 bis 23:00 Uhr brennen.

:::lösung
1. Treppenlichtschalter (retriggerbar, ggf. mit Vorwarnung).
2. ODER aus drei Tastern an den Trg-Eingang eines Stromstoßrelais.
3. Ausschaltverzögerung, T = 300 s.
4. Einschaltverzögerung, T = 10 s.
5. Schaltuhr 17:00–23:00 (besser noch UND mit einem Dämmerungsschalter).
:::

## Aufgabe 3 – Negierte Eingänge

Ein Garagentor hat einen Endschalter oben als Öffner (betätigt = 0).

1. Welches Signal liefert der Endschalter, wenn das Tor oben ist?
2. Wie wird er an den R-Eingang der Selbsthaltung „Auf“ angeschlossen?
3. Lade „Rolltor mit Endschaltern“ und erkläre, wozu die Blöcke B5 und B6 die Ausgänge der anderen Selbsthaltung negiert lesen.

:::lösung
1. 0.
2. Negiert (Kreis am Eingang): Tor oben → 0 → negiert 1 → Reset.
3. Gegenseitige Verriegelung: Motor_Auf nur, wenn „Zu“ nicht gespeichert ist, und umgekehrt – beide Richtungen gleichzeitig würden einen Kurzschluss verursachen.
:::

## Aufgabe 4 – Selbst bauen

Baue im Simulator (Beispiel „Leer“):

1. Ein Kellerlicht mit Bewegungsmelder (I1), das nur bei Dunkelheit (I2 = Dämmerungsschalter, 1 = dunkel) einschaltet und 60 s nachläuft.
2. Eine Lüftung, die bei CO₂-Sensor (AI1, 0 … 10 V = 0 … 2 000 ppm) über 1 200 ppm einschaltet und unter 800 ppm wieder aus.

:::lösung
1. B1 UND(I1, I2) → B2 Ausschaltverzögerung (Trg = B1, T = 60 s) → Q1.
2. 1 200 ppm ≙ 6 V, 800 ppm ≙ 4 V: B1 Analogschwellwert (AI1, ein ab 6 V, aus unter 4 V) → Q1.
:::

## Aufgabe 5 – Taktgeber

1. Wie groß ist die Frequenz bei T ein = 0,4 s und T aus = 0,4 s?
2. Eine Warnleuchte soll mit 2 Hz blinken. Welche Zeiten stellst du ein (gleich lang an und aus)?

:::lösung
1. $f = \frac{1}{0{,}4\ \text{s} + 0{,}4\ \text{s}} = 1{,}25\ \text{Hz}$.
2. Periode 0,5 s: T ein = T aus = 0,25 s.
:::
