---
titel: Elektrische Grundgrößen und Leiterwiderstand
stufe: leicht
beschreibung: Grundgrößen und Einheiten, Ladung, Stromdichte, Leiterwiderstand, Widerstand bei Erwärmung, Leistung mit Energiekosten und Wirkungsgrad.
---
# Elektrische Grundgrößen und Leiterwiderstand

Name: ___  Datum: ___

Benötigte Formeln: $Q = I \cdot t$, $J = \dfrac{I}{A}$, $R = \dfrac{l}{\gamma \cdot A}$, $R_\text{w} = R_\text{k} \cdot (1 + \alpha \cdot \Delta\vartheta)$, $P = U \cdot I$, $W = P \cdot t$, $\eta = \dfrac{P_\text{ab}}{P_\text{zu}}$

Werte: Kupfer $\gamma = 56\ \tfrac{\text{m}}{\Omega\,\text{mm}^2}$, $\alpha = 0{,}0039\ \tfrac{1}{\text{K}}$; Aluminium $\gamma = 35\ \tfrac{\text{m}}{\Omega\,\text{mm}^2}$; $e = 1{,}602 \cdot 10^{-19}\ \text{C}$

## Aufgabe 1 – Größen und Einheiten

Ergänze die Tabelle.

| Größe | Formelzeichen | Einheit | Messgerät und Anschluss |
|---|---|---|---|
| Spannung | ___ | ___ | ___ |
| Stromstärke | ___ | ___ | ___ |
| Widerstand | ___ | ___ | ___ |
| Ladung | ___ | ___ | – |
| Leistung | ___ | ___ | ___ |

:::lösung
| Größe | Formelzeichen | Einheit | Messgerät und Anschluss |
|---|---|---|---|
| Spannung | U | V (Volt) | Spannungsmesser, parallel |
| Stromstärke | I | A (Ampere) | Strommesser, in Reihe (oder Zange) |
| Widerstand | R | Ω (Ohm) | Widerstandsmesser, nur spannungsfrei |
| Ladung | Q | C = As (Coulomb) | – |
| Leistung | P | W (Watt) | Leistungsmesser |
:::

## Aufgabe 2 – Ladung

Ein Akku mit 2,5 Ah wird mit konstant 0,4 A entladen.

1. Wie lange dauert es, bis er leer ist?
2. Wie groß ist die gespeicherte Ladung in Coulomb?
3. Wie viele Elektronen fließen dabei durch den Verbraucher?

:::lösung
1. $t = \dfrac{Q}{I} = \dfrac{2{,}5\ \text{Ah}}{0{,}4\ \text{A}} = 6{,}25\ \text{h}$
2. $Q = 2{,}5\ \text{A} \cdot 3\,600\ \text{s} = 9\,000\ \text{C}$
3. $n = \dfrac{Q}{e} = \dfrac{9\,000\ \text{C}}{1{,}602 \cdot 10^{-19}\ \text{C}} = 5{,}62 \cdot 10^{22}$
:::

## Aufgabe 3 – Stromdichte

Ein Kupferdraht mit 0,6 mm Durchmesser führt 1,5 A.

1. Berechne den Querschnitt und die Stromdichte.
2. Warum ist die Stromdichte für die Erwärmung entscheidend, nicht der Strom allein?

:::lösung
1. $A = \dfrac{\pi \cdot d^2}{4} = \dfrac{\pi \cdot (0{,}6\ \text{mm})^2}{4} = 0{,}283\ \text{mm}^2$, $J = \dfrac{1{,}5\ \text{A}}{0{,}283\ \text{mm}^2} = 5{,}31\ \tfrac{\text{A}}{\text{mm}^2}$
2. Derselbe Strom erwärmt einen dünnen Leiter stärker: Bei kleinerem Querschnitt ist der Widerstand je Meter größer und die Wärme wird auf weniger Material verteilt.
:::

## Aufgabe 4 – Leiterwiderstand

Eine Steckdose wird über eine 28 m lange Mantelleitung NYM-J 3 × 2,5 mm² versorgt.

1. Berechne den Widerstand von Hin- und Rückleiter bei 20 °C.
2. Wie groß ist der Spannungsfall bei 16 A, absolut und in Prozent von 230 V?
3. Welcher Querschnitt wäre bei Aluminium für denselben Widerstand nötig?

:::lösung
1. $R = \dfrac{2 \cdot 28\ \text{m}}{56\ \tfrac{\text{m}}{\Omega\,\text{mm}^2} \cdot 2{,}5\ \text{mm}^2} = 0{,}4\ \Omega$
2. $\Delta U = 16\ \text{A} \cdot 0{,}4\ \Omega = 6{,}4\ \text{V}$, $\dfrac{6{,}4\ \text{V}}{230\ \text{V}} = 2{,}78\ \%$
3. $A = \dfrac{l}{\gamma \cdot R} = \dfrac{56\ \text{m}}{35\ \tfrac{\text{m}}{\Omega\,\text{mm}^2} \cdot 0{,}4\ \Omega} = 4\ \text{mm}^2$
:::

## Aufgabe 5 – Widerstand bei Erwärmung

Die Kupferwicklung eines Motors hat bei 20 °C einen Widerstand von 2,8 Ω. Nach zwei Stunden Betrieb misst man sofort nach dem Abschalten 3,4 Ω.

1. Welche Temperatur hat die Wicklung?
2. Warum misst man so die Wicklungstemperatur, statt ein Thermometer anzulegen?
3. Ist Kupfer ein Kalt- oder ein Heißleiter? Begründe mit dem Kristallgitter.

:::lösung
1. $\Delta\vartheta = \dfrac{R_\text{w}/R_\text{k} - 1}{\alpha} = \dfrac{3{,}4/2{,}8 - 1}{0{,}0039\ \tfrac{1}{\text{K}}} = 54{,}9\ \text{K}$, $\vartheta_\text{w} = 20\ {}^\circ\text{C} + 54{,}9\ \text{K} = 74{,}9\ {}^\circ\text{C}$
2. Die Messung erfasst die mittlere Temperatur der ganzen Wicklung im Inneren, auch an Stellen, die von außen nicht erreichbar sind.
3. Kaltleiter (positives α): Mit steigender Temperatur schwingen die Atomrümpfe stärker, die freien Elektronen stoßen öfter an – der Widerstand steigt.
:::

## Aufgabe 6 – Leistung, Arbeit und Kosten

Ein Wasserkocher hat die Angaben 230 V / 2 000 W. Er läuft täglich 3 Minuten.

1. Welchen Strom nimmt er auf, und wie groß ist sein Widerstand?
2. Wie viel Energie verbraucht er im Jahr (365 Tage), und was kostet das bei 35 ct/kWh?

:::lösung
1. $I = \dfrac{P}{U} = \dfrac{2\,000\ \text{W}}{230\ \text{V}} = 8{,}70\ \text{A}$, $R = \dfrac{U^2}{P} = \dfrac{(230\ \text{V})^2}{2\,000\ \text{W}} = 26{,}45\ \Omega$
2. $W = 2\ \text{kW} \cdot 0{,}05\ \text{h} \cdot 365 = 36{,}5\ \text{kWh}$, $K = 36{,}5\ \text{kWh} \cdot 0{,}35\ \tfrac{\text{€}}{\text{kWh}} = 12{,}78\ \text{€}$
:::

## Aufgabe 7 – Wirkungsgrad

Ein Motor nimmt 4,7 kW auf und gibt 4 kW an der Welle ab. Er treibt über ein Getriebe mit 92 % Wirkungsgrad ein Förderband an.

1. Berechne Wirkungsgrad und Verlustleistung des Motors.
2. Wie groß sind der Gesamtwirkungsgrad und die Leistung am Förderband?
3. In welche Energieform gehen die Verluste über?

:::lösung
1. $\eta = \dfrac{4\ \text{kW}}{4{,}7\ \text{kW}} = 0{,}851 = 85{,}1\ \%$, $P_\text{v} = 4{,}7\ \text{kW} - 4\ \text{kW} = 0{,}7\ \text{kW}$
2. $\eta_\text{ges} = 0{,}851 \cdot 0{,}92 = 0{,}783 = 78{,}3\ \%$, $P = 4\ \text{kW} \cdot 0{,}92 = 3{,}68\ \text{kW}$
3. In Wärme (Wicklung, Eisen, Reibung in Lagern und Getriebe).
:::

## Aufgabe 8 – Verständnis

1. Erkläre den Unterschied zwischen technischer Stromrichtung und Elektronenstrom.
2. Nenne die fünf Wirkungen des elektrischen Stroms mit je einer Anwendung. Welche Wirkungen treten immer auf?
3. Nenne vier Arten, eine Spannung zu erzeugen.

:::lösung
1. Technisch fließt der Strom vom Plus- zum Minuspol (so werden Pfeile gezeichnet); die Elektronen bewegen sich tatsächlich vom Minus- zum Pluspol.
2. Wärme (Heizung), Licht (LED), Magnetismus (Motor), chemisch (Akku laden), physiologisch (Weidezaun, Herzschrittmacher). Immer: Wärme und Magnetismus.
3. Induktion (Generator), chemisch (Batterie), Licht (Solarzelle), Wärme (Thermoelement), Druck (Piezo), Reibung.
:::

Rechnen und nachlesen: [Elektrische Grundgrößen und Leiterwiderstand](../../../elektro/grundgroessen.html).
