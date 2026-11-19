---
titel: Wechselstrom und RLC-Schaltungen
stufe: mittel
beschreibung: Sinusgrößen, Blindwiderstände, RL-Reihenschaltung an einer Leuchtstofflampe, RLC in Reihe, RC parallel, Saugkreis mit Güte und Spannungsüberhöhung, Tiefpass und Hochpass.
---
# Wechselstrom und RLC-Schaltungen

Name: ___  Datum: ___

Benötigte Formeln: $U = \dfrac{\hat{u}}{\sqrt{2}}$, $\omega = 2\pi f$, $X_L = \omega L$, $X_C = \dfrac{1}{\omega C}$, $Z = \sqrt{R^2 + (X_L - X_C)^2}$, $f_0 = \dfrac{1}{2\pi\sqrt{LC}}$, $Q = \dfrac{1}{R}\sqrt{\dfrac{L}{C}}$, $f_\text{g} = \dfrac{1}{2\pi RC}$

## Aufgabe 1 – Sinusgrößen

Die Netzspannung beträgt 230 V bei 50 Hz.

1. Berechne Scheitelwert, Spitze-Spitze-Wert, Periodendauer und Kreisfrequenz.
2. Welchen Augenblickswert hat die Spannung 2,5 ms nach dem positiven Nulldurchgang?
3. Was bedeutet der Effektivwert?

:::lösung
1. $\hat{u} = \sqrt{2} \cdot 230\ \text{V} = 325{,}3\ \text{V}$, $u_\text{ss} = 650{,}5\ \text{V}$, $T = \dfrac{1}{50\ \text{Hz}} = 20\ \text{ms}$, $\omega = 2\pi \cdot 50\ \text{Hz} = 314{,}2\ \tfrac{1}{\text{s}}$
2. $u = 325{,}3\ \text{V} \cdot \sin(314{,}2\ \tfrac{1}{\text{s}} \cdot 0{,}0025\ \text{s}) = 325{,}3\ \text{V} \cdot \sin 45^\circ = 230\ \text{V}$
3. Die Wechselspannung erzeugt in einem Widerstand dieselbe Wärme wie eine gleich große Gleichspannung.
:::

## Aufgabe 2 – Blindwiderstände

1. Berechne den Blindwiderstand einer Spule mit 0,5 H und eines Kondensators mit 10 µF bei 50 Hz und bei 150 Hz.
2. Beschreibe in einem Satz, wie sich beide bei steigender Frequenz verhalten.
3. Wie liegt der Strom jeweils zur Spannung?

:::lösung
1. 50 Hz: $X_L = 2\pi \cdot 50\ \text{Hz} \cdot 0{,}5\ \text{H} = 157{,}1\ \Omega$, $X_C = \dfrac{1}{2\pi \cdot 50\ \text{Hz} \cdot 10\ \mu\text{F}} = 318{,}3\ \Omega$. 150 Hz: $X_L = 471{,}2\ \Omega$, $X_C = 106{,}1\ \Omega$.
2. $X_L$ wächst proportional mit der Frequenz, $X_C$ sinkt umgekehrt proportional.
3. Spule: Strom eilt 90° nach. Kondensator: Strom eilt 90° vor.
:::

## Aufgabe 3 – Leuchtstofflampe mit Drossel

Eine Leuchtstofflampe mit Vorschaltdrossel nimmt an 230 V/50 Hz 0,4 A auf. An der Lampe (Wirkwiderstand) misst man 110 V.

1. Warum ergeben 110 V an der Lampe und die Spannung an der Drossel nicht 230 V in der Summe?
2. Berechne die Spannung an der Drossel (Wicklungswiderstand vernachlässigt).
3. Berechne Z, R, $X_L$ und L.
4. Bestimme cos φ, φ und die Wirkleistung. Zeichne das Zeigerdiagramm.

:::lösung
1. Die Spannungen sind um 90° verschoben und addieren sich geometrisch.
2. $U_L = \sqrt{(230\ \text{V})^2 - (110\ \text{V})^2} = 202\ \text{V}$
3. $Z = \dfrac{230\ \text{V}}{0{,}4\ \text{A}} = 575\ \Omega$, $R = \dfrac{110\ \text{V}}{0{,}4\ \text{A}} = 275\ \Omega$, $X_L = \dfrac{202\ \text{V}}{0{,}4\ \text{A}} = 505\ \Omega$, $L = \dfrac{505\ \Omega}{314{,}2\ \tfrac{1}{\text{s}}} = 1{,}61\ \text{H}$
4. $\cos\varphi = \dfrac{110}{230} = 0{,}478$, $\varphi = 61{,}4^\circ$ induktiv, $P = 110\ \text{V} \cdot 0{,}4\ \text{A} = 44\ \text{W}$. Zeigerdiagramm: I waagerecht als Bezug, $U_R$ in Richtung von I, $U_L$ senkrecht nach oben, U als Hypotenuse.
:::

## Aufgabe 4 – RLC-Reihenschaltung

R = 40 Ω, L = 318 mH und C = 47 µF liegen in Reihe an 230 V/50 Hz.

1. Berechne $X_L$, $X_C$, Z und I.
2. Berechne die Teilspannungen. Was fällt auf?
3. Bestimme φ. Verhält sich die Schaltung induktiv oder kapazitiv?
4. Bei welcher Frequenz tritt Resonanz auf, und wie groß ist die Güte?

:::lösung
1. $X_L = 99{,}9\ \Omega$, $X_C = 67{,}7\ \Omega$, $Z = \sqrt{(40\ \Omega)^2 + (32{,}2\ \Omega)^2} = 51{,}3\ \Omega$, $I = \dfrac{230\ \text{V}}{51{,}3\ \Omega} = 4{,}48\ \text{A}$
2. $U_R = 179\ \text{V}$, $U_L = 448\ \text{V}$, $U_C = 303\ \text{V}$. Die Spannungen an L und C sind größer als die Quellenspannung (Spannungsüberhöhung), weil sie entgegengesetzt sind und sich teilweise aufheben.
3. $\varphi = \arctan\dfrac{32{,}2}{40} = 38{,}8^\circ$; $X_L > X_C$: induktiv.
4. $f_0 = \dfrac{1}{2\pi\sqrt{0{,}318\ \text{H} \cdot 47\ \mu\text{F}}} = 41{,}2\ \text{Hz}$, $Q = \dfrac{1}{40\ \Omega}\sqrt{\dfrac{0{,}318\ \text{H}}{47\ \mu\text{F}}} = 2{,}06$
:::

## Aufgabe 5 – RC-Parallelschaltung

Ein Widerstand mit 100 Ω und ein Kondensator mit 20 µF liegen parallel an 230 V/50 Hz.

1. Berechne die Teilströme und den Gesamtstrom.
2. Berechne den Scheinwiderstand und die Phasenverschiebung.

:::lösung
1. $I_R = \dfrac{230\ \text{V}}{100\ \Omega} = 2{,}3\ \text{A}$, $X_C = 159{,}2\ \Omega$, $I_C = 1{,}45\ \text{A}$, $I = \sqrt{(2{,}3\ \text{A})^2 + (1{,}45\ \text{A})^2} = 2{,}72\ \text{A}$
2. $Z = \dfrac{230\ \text{V}}{2{,}72\ \text{A}} = 84{,}7\ \Omega$, $\varphi = \arctan\dfrac{1{,}45}{2{,}3} = 32{,}1^\circ$, der Strom eilt der Spannung vor (kapazitiv).
:::

## Aufgabe 6 – Saugkreis

Ein Reihenschwingkreis mit L = 20 mH und R = 2,2 Ω soll Störungen bei 1 kHz absaugen. Er liegt an 12 V.

1. Welche Kapazität ist nötig?
2. Berechne die Güte und die Bandbreite.
3. Welcher Strom fließt bei Resonanz, und welche Spannung liegt dann am Kondensator?
4. Was muss man bei der Auswahl des Kondensators beachten?

:::lösung
1. $C = \dfrac{1}{(2\pi f_0)^2 \cdot L} = \dfrac{1}{(2\pi \cdot 1\,000\ \text{Hz})^2 \cdot 0{,}02\ \text{H}} = 1{,}27\ \mu\text{F}$
2. $Q = \dfrac{1}{2{,}2\ \Omega}\sqrt{\dfrac{0{,}02\ \text{H}}{1{,}27\ \mu\text{F}}} = 57{,}1$, $b = \dfrac{1\,000\ \text{Hz}}{57{,}1} = 17{,}5\ \text{Hz}$
3. $I_0 = \dfrac{12\ \text{V}}{2{,}2\ \Omega} = 5{,}45\ \text{A}$, $U_C = Q \cdot U = 57{,}1 \cdot 12\ \text{V} = 685\ \text{V}$
4. Die Spannungsfestigkeit muss für die überhöhte Spannung reichen (hier deutlich über 685 V), außerdem für den Strom.
:::

## Aufgabe 7 – Tiefpass und Hochpass

Aus R = 4,7 kΩ und C = 100 nF wird ein RC-Glied gebaut. Am Eingang liegt ein Sinussignal mit 5 V und 1 kHz.

1. Berechne die Grenzfrequenz.
2. Welche Spannung liefert die Schaltung als Tiefpass (Ausgang am Kondensator)?
3. Welche Spannung liefert sie als Hochpass (Ausgang am Widerstand)?
4. Nenne je eine Anwendung.

:::lösung
1. $f_\text{g} = \dfrac{1}{2\pi \cdot 4\,700\ \Omega \cdot 100\ \text{nF}} = 339\ \text{Hz}$
2. $\dfrac{U_\text{a}}{U_\text{e}} = \dfrac{1}{\sqrt{1 + (1\,000/339)^2}} = 0{,}321$, $U_\text{a} = 1{,}60\ \text{V}$
3. $\dfrac{U_\text{a}}{U_\text{e}} = \dfrac{1}{\sqrt{1 + (339/1\,000)^2}} = 0{,}947$, $U_\text{a} = 4{,}74\ \text{V}$
4. Tiefpass: Bass-Weiche, Glättung, Entstörung. Hochpass: Hochtöner-Weiche, Gleichanteil abtrennen.
:::

## Aufgabe 8 – Resonanz verstehen

Vergleiche Reihen- und Parallelschwingkreis bei Resonanz: Scheinwiderstand, Strom aus der Quelle, Überhöhung und typische Anwendung.

:::lösung
| | Reihenschwingkreis | Parallelschwingkreis |
|---|---|---|
| Scheinwiderstand | am kleinsten, Z = R | am größten |
| Strom aus der Quelle | am größten | am kleinsten |
| Überhöhung | Spannung an L und C | Strom in L und C |
| Anwendung | Saugkreis, Bandpass | Sperrkreis, Bandsperre |
:::

Rechnen und simulieren: [Wechselstrom und RLC-Schaltungen](../../../elektro/wechselstrom.html).
