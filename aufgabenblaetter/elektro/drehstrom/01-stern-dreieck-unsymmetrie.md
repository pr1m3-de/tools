---
titel: Drehstrom – Stern, Dreieck und Unsymmetrie
stufe: mittel
beschreibung: Verkettung, Heizwiderstände in Stern und Dreieck, Motorleistung, Neutralleiterstrom bei unsymmetrischer Last, Neutralleiterunterbrechung, Außenleiterausfall und Stern-Dreieck-Anlauf.
---
# Drehstrom – Stern, Dreieck und Unsymmetrie

Name: ___  Datum: ___

Benötigte Formeln: $U = \sqrt{3} \cdot U_\text{Str}$, Dreieck $I = \sqrt{3} \cdot I_\text{Str}$, $P = \sqrt{3} \cdot U \cdot I \cdot \cos\varphi$, $I_\text{N} = \sqrt{I_1^2 + I_2^2 + I_3^2 - I_1 I_2 - I_2 I_3 - I_3 I_1}$

Netz: 400/230 V, 50 Hz

## Aufgabe 1 – Das Drehstromnetz

1. Wie entstehen die drei Spannungen im Generator?
2. Warum beträgt die Spannung zwischen zwei Außenleitern 400 V und nicht 460 V?
3. Nenne die Farben der Leiter L1, L2, L3, N und PE.

:::lösung
1. Drei um 120° versetzte Wicklungen im Ständer; das umlaufende Magnetfeld des Läufers induziert in jeder eine Sinusspannung, die um 120° verschoben ist.
2. Die beiden Strangspannungen sind um 120° verschoben und werden geometrisch subtrahiert: $U = \sqrt{3} \cdot 230\ \text{V} = 400\ \text{V}$.
3. L1 braun, L2 schwarz, L3 grau, N blau, PE grün-gelb.
:::

## Aufgabe 2 – Heizung in Stern und Dreieck

Ein Heizregister hat drei Heizstäbe mit je 52,9 Ω.

1. Berechne Strangspannung, Strangstrom, Leiterstrom und Leistung in Sternschaltung.
2. Berechne dieselben Werte in Dreieckschaltung.
3. Vergleiche die Leistungen. Wie lässt sich das nutzen?

:::lösung
1. $U_\text{Str} = \dfrac{400\ \text{V}}{\sqrt{3}} = 231\ \text{V}$, $I = I_\text{Str} = \dfrac{231\ \text{V}}{52{,}9\ \Omega} = 4{,}37\ \text{A}$, $P = \sqrt{3} \cdot 400\ \text{V} \cdot 4{,}37\ \text{A} = 3{,}02\ \text{kW}$
2. $U_\text{Str} = 400\ \text{V}$, $I_\text{Str} = \dfrac{400\ \text{V}}{52{,}9\ \Omega} = 7{,}56\ \text{A}$, $I = \sqrt{3} \cdot 7{,}56\ \text{A} = 13{,}1\ \text{A}$, $P = \sqrt{3} \cdot 400\ \text{V} \cdot 13{,}1\ \text{A} = 9{,}07\ \text{kW}$
3. Im Dreieck ist die Leistung dreimal so groß. Durch Umschalten erhält man zwei Heizstufen (Stern = klein, Dreieck = groß).
:::

## Aufgabe 3 – Motorleistung

Ein Drehstrommotor nimmt an 400 V 14,5 A bei cos φ = 0,84 auf. Sein Wirkungsgrad beträgt 89 %.

1. Berechne Schein-, Wirk- und Blindleistung.
2. Welche Leistung gibt der Motor an der Welle ab?

:::lösung
1. $S = \sqrt{3} \cdot 400\ \text{V} \cdot 14{,}5\ \text{A} = 10{,}0\ \text{kVA}$, $P = S \cdot 0{,}84 = 8{,}44\ \text{kW}$, $Q = \sqrt{S^2 - P^2} = 5{,}45\ \text{kvar}$
2. $P_\text{ab} = 8{,}44\ \text{kW} \cdot 0{,}89 = 7{,}51\ \text{kW}$ (ein 7,5-kW-Motor)
:::

## Aufgabe 4 – Unsymmetrische Last

In einem Haus sind an L1 ein Heizlüfter mit 2 000 W, an L2 ein Toaster mit 1 000 W und an L3 eine Leuchte mit 100 W eingeschaltet (alle ohmsch, 230 V).

1. Berechne die drei Außenleiterströme.
2. Berechne den Strom im Neutralleiter.
3. Welche Aufgabe hat der Neutralleiter hier?

:::lösung
1. $I_1 = \dfrac{2\,000\ \text{W}}{230\ \text{V}} = 8{,}70\ \text{A}$, $I_2 = 4{,}35\ \text{A}$, $I_3 = 0{,}435\ \text{A}$
2. $I_\text{N} = \sqrt{8{,}70^2 + 4{,}35^2 + 0{,}435^2 - 8{,}70 \cdot 4{,}35 - 4{,}35 \cdot 0{,}435 - 0{,}435 \cdot 8{,}70}\ \text{A} = 7{,}16\ \text{A}$
3. Er führt den Unterschiedsstrom zurück und hält den Sternpunkt fest, sodass an jedem Gerät 230 V liegen.
:::

## Aufgabe 5 – Neutralleiterunterbrechung

In der Anlage aus Aufgabe 4 löst sich die Klemme des Neutralleiters im Hausanschluss.

1. Erkläre, was passiert.
2. Die Rechnung mit dem Sternpunkt ergibt folgende Spannungen: Heizlüfter 136 V, Toaster 265 V, Leuchte 341 V. Beurteile die Folgen.
3. Vereinfachter Fall: Nur der Heizlüfter (L1) und die Leuchte (L3) sind eingeschaltet. Berechne die Spannungen an beiden Geräten.
4. Nenne drei Maßnahmen, die eine Neutralleiterunterbrechung verhindern.

:::lösung
1. Ohne Neutralleiter verschiebt sich der Sternpunkt zur stark belasteten Seite. Die Geräte liegen über den Sternpunkt in Reihe an den Außenleiterspannungen; die Spannungen teilen sich nach den Widerständen auf.
2. Die Leuchte (großer Widerstand) bekommt 341 V statt 230 V und nimmt rund 220 W statt 100 W auf – sie kann durchbrennen und einen Brand auslösen. Der Toaster ist ebenfalls überlastet, der Heizlüfter bekommt zu wenig.
3. $R_1 = \dfrac{(230\ \text{V})^2}{2\,000\ \text{W}} = 26{,}5\ \Omega$, $R_3 = 529\ \Omega$, $I = \dfrac{400\ \text{V}}{555{,}5\ \Omega} = 0{,}72\ \text{A}$, $U_3 = 0{,}72\ \text{A} \cdot 529\ \Omega = 381\ \text{V}$, $U_1 = 19\ \text{V}$
4. Neutralleiter nie absichern oder einzeln schalten; Klemmen fest anziehen und prüfen; ausreichender Querschnitt (PEN mindestens 10 mm² Cu); Überspannungsschutz für empfindliche Geräte.
:::

## Aufgabe 6 – Ausfall eines Außenleiters

Ein Drehstrommotor in Dreieckschaltung läuft. Die Sicherung von L3 löst aus.

1. Welche Spannungen liegen jetzt an den drei Wicklungen?
2. Was geschieht mit dem Motor, und wie verhindert man Schäden?

:::lösung
1. Die Wicklung L1–L2 liegt weiter an 400 V. Die Wicklungen L2–L3 und L3–L1 liegen in Reihe ebenfalls an 400 V, also je etwa 200 V.
2. Er läuft einphasig weiter (oder läuft nicht mehr an), die Ströme in den verbleibenden Leitern steigen, die Wicklung überhitzt. Schutz: Motorschutzschalter oder Motorschutzrelais mit Phasenausfallerkennung.
:::

## Aufgabe 7 – Stern-Dreieck-Anlauf

Ein Motor 400 V Δ hat einen Bemessungsstrom von 28 A; bei Direktanlauf zieht er das 6-Fache.

1. Wie groß ist der Anlaufstrom direkt und beim Stern-Dreieck-Anlauf?
2. Was geschieht mit dem Anzugsmoment? Für welche Antriebe eignet sich das Verfahren deshalb?

:::lösung
1. Direkt: $6 \cdot 28\ \text{A} = 168\ \text{A}$. Im Stern liegt an jeder Wicklung nur $400\ \text{V}/\sqrt{3}$; der Leiterstrom sinkt auf ein Drittel: $56\ \text{A}$.
2. Auch das Moment sinkt auf ein Drittel. Geeignet für Antriebe, die leer oder mit geringem Moment anlaufen (Lüfter, Pumpen, Kreissägen ohne Last).
:::

Rechnen und simulieren: [Drehstrom: Stern, Dreieck und Unsymmetrie](../../../elektro/drehstrom.html), [Drehstrommotor und Anlauf](../../../elektro/motor.html).
