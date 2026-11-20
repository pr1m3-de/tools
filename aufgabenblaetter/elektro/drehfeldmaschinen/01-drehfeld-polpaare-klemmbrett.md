---
titel: Drehfeldmaschinen – Drehfeld, Polpaare und Klemmbrett
stufe: leicht
beschreibung: Drehstrom als Grundlage, wie aus drei Wicklungen ein Drehfeld wird, Polpaarzahl und synchrone Drehzahl, Stern und Dreieck am Klemmbrett, Drehrichtung und Synchronmaschine.
---
# Drehfeldmaschinen – Drehfeld, Polpaare und Klemmbrett

Name: ___  Datum: ___

Benötigte Formeln: $\hat{U} = \sqrt{2} \cdot U$, $U_\text{Str} = \dfrac{U}{\sqrt{3}}$, $n_0 = \dfrac{60 \cdot f}{p}$, $s = \dfrac{n_0 - n}{n_0}$

Zum Ausprobieren: [Drehfeldmaschinen](../../../elektro/drehfeldmaschinen.html) (Animation Drehfeld, Zeiger addieren, Klemmbrett)

## Aufgabe 1 – Drehstrom

1. Zwischen einem Außenleiter und dem Neutralleiter misst du 230 V. Wie groß ist der Scheitelwert dieser Spannung?
2. Zwischen zwei Außenleitern liegen 400 V. Welche Spannung bekommt eine Wicklung, wenn der Motor im Stern angeschlossen ist?
3. Um wie viel Grad sind die drei Spannungen gegeneinander verschoben?
4. Welchen Wert hat die Summe der drei Strangspannungen in jedem Augenblick?

:::lösung
1. $\hat{U} = \sqrt{2} \cdot 230\ \text{V} = 325\ \text{V}$
2. $U_\text{Str} = \dfrac{400\ \text{V}}{\sqrt{3}} = 231\ \text{V}$ – also die Spannung zwischen Außenleiter und Sternpunkt.
3. 120° (eine Drittelperiode, bei 50 Hz also 6,67 ms).
4. Null. Deshalb fließt bei gleicher Last kein Strom im Neutralleiter.
:::

## Aufgabe 2 – Wie das Drehfeld entsteht

Öffne die Animation „Drehfeld im Ständer“ und danach „Zeiger addieren“.

1. Beschreibe, wie die drei Wicklungen im Ständer angeordnet sind und welche Ströme durch sie fließen.
2. Jede Wicklung allein erzeugt nur ein Feld, das in seiner Richtung größer und kleiner wird. Warum entsteht zusammen ein Feld, das sich dreht?
3. In der Zeigeransicht werden die drei Durchflutungen aneinandergehängt. Was fällt an der Spitze des letzten Zeigers auf?
4. Wie viel größer ist das resultierende Feld als der Höchstwert einer einzelnen Wicklung?

:::lösung
1. Drei gleiche Wicklungen U, V, W, am Umfang um 120° versetzt. Durch sie fließen drei Wechselströme, die zeitlich ebenfalls um 120° verschoben sind.
2. Die Wicklung mit dem größten Strom bestimmt jeweils die Feldrichtung. Weil die Höchstwerte nacheinander in U, V und W auftreten und die Wicklungen räumlich versetzt sind, wandert die Richtung des Gesamtfelds gleichmäßig weiter.
3. Sie läuft auf einem Kreis: Der Betrag des Gesamtfelds bleibt gleich, nur die Richtung dreht sich.
4. 1,5-mal so groß.
:::

## Aufgabe 3 – Polpaarzahl und Drehzahl

1. Berechne die synchrone Drehzahl für 50 Hz bei 1, 2, 3 und 4 Polpaaren.
2. Ein Motor mit 4 Polen wird an einem 60-Hz-Netz betrieben. Wie schnell dreht sein Feld?
3. Auf einem Typenschild steht 960 1/min bei 50 Hz. Bestimme Polpaarzahl, synchrone Drehzahl und Schlupf.
4. Ein Generator in einem kleinen Wasserkraftwerk dreht mit 600 1/min und liefert 50 Hz. Wie viele Polpaare hat er?

:::lösung
1. 3 000, 1 500, 1 000 und 750 1/min.
2. $p = 2$: $n_0 = \dfrac{60 \cdot 60\ \text{Hz}}{2} = 1\,800\ \tfrac{1}{\text{min}}$
3. Die nächste synchrone Drehzahl über 960 1/min ist 1 000 1/min, also $p = 3$. $s = \dfrac{1\,000 - 960}{1\,000} = 4\ \%$
4. $p = \dfrac{60 \cdot 50\ \text{Hz}}{600\ \tfrac{1}{\text{min}}} = 5$ Polpaare (10 Pole). Generatoren laufen synchron, deshalb ergibt sich hier eine ganze Zahl.
:::

## Aufgabe 4 – Stern oder Dreieck?

Das Klemmbrett hat oben U1, V1, W1 und unten W2, U2, V2.

1. Ein Motor trägt die Angabe „Δ 230 V / Y 400 V“. Welche Schaltung brauchst du am 400-V-Netz? Wie werden die Brücken gesetzt?
2. Ein anderer Motor trägt „Δ 400 V / Y 690 V“. Welche Schaltung gilt am 400-V-Netz?
3. Was passiert, wenn der erste Motor am 400-V-Netz im Dreieck angeschlossen wird? Probiere es am Klemmbrett der Seite aus.
4. Welcher der beiden Motoren eignet sich für den Stern-Dreieck-Anlauf am 400-V-Netz? Begründe.

:::lösung
1. Stern: Jede Wicklung verträgt 230 V, im Stern bekommt sie $400\ \text{V} / \sqrt{3} = 231\ \text{V}$. Zwei waagerechte Brücken unten: W2–U2 und U2–V2.
2. Dreieck: Die Wicklungen sind für 400 V gebaut. Drei senkrechte Brücken: U1–W2, V1–U2, W1–V2.
3. Jede Wicklung bekäme 400 V statt 230 V, also das √3-fache. Strom und Erwärmung steigen stark, ohne Schutz verbrennt die Wicklung.
4. Der zweite. Er läuft im Betrieb im Dreieck und darf zum Anlauf im Stern geschaltet werden (dann nur ein Drittel von Strom und Moment). Der erste läuft schon im Betrieb im Stern.
:::

## Aufgabe 5 – Drehrichtung und Betriebsarten

1. Was bedeutet Rechtslauf nach DIN EN 60034-8, und wie kehrst du die Drehrichtung um?
2. Was muss passieren, damit eine Asynchronmaschine als Generator Leistung ins Netz abgibt?
3. Bei einem Schleifringläufer wird in die Läuferwicklung Gleichstrom eingespeist. Wie verhält sich die Maschine dann?
4. Warum kann ein Asynchronmotor im Betrieb nie genau die synchrone Drehzahl erreichen?

:::lösung
1. Mit Blick auf das Wellenende dreht die Welle im Uhrzeigersinn, wenn L1 an U1, L2 an V1 und L3 an W1 liegt. Zum Umkehren zwei Außenleiter tauschen, üblicherweise L1 und L3.
2. Sie muss von außen über die synchrone Drehzahl angetrieben werden. Dann wird der Schlupf negativ, Drehmoment und Wirkleistung kehren sich um.
3. Der Läufer wird zum Elektromagneten mit festen Polen, die Maschine arbeitet als Synchronmaschine und läuft genau mit dem Drehfeld.
4. Ein Drehmoment entsteht nur, wenn im Läufer Strom fließt. Strom wird nur induziert, wenn sich das Feld gegenüber dem Läufer bewegt. Bei synchroner Drehzahl wäre die Relativbewegung null.
:::
