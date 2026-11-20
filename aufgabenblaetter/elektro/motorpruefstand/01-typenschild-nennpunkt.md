---
titel: Motorprüfstand – Typenschild und Nennpunkt
stufe: mittel
beschreibung: Versuch am virtuellen Prüfstand: Typenschild auswerten, Nenndrehmoment und aufgenommene Leistung berechnen, sicher anschließen, Nennpunkt messen und mit dem Typenschild vergleichen, Generatorbetrieb über der synchronen Drehzahl.
---
# Motorprüfstand – Typenschild und Nennpunkt

Name: ___  Datum: ___

Benötigte Formeln: $p = \dfrac{60 \cdot f}{n}$, $M = \dfrac{P}{2 \pi \cdot n} = \dfrac{9\,549 \cdot P}{n}$, $P_\text{el} = \sqrt{3} \cdot U \cdot I \cdot \cos\varphi$, $\eta = \dfrac{P_\text{mech}}{P_\text{el}}$

Versuch: [Motorprüfstand](../../../elektro/motorpruefstand.html)

Prüfling laut Typenschild: Δ 230 V / Y 400 V, 1,30 A / 0,75 A, 0,25 kW, cos φ 0,74, 1 380 1/min, 50 Hz

## Aufgabe 1 – Typenschild auswerten

1. Bestimme die Polpaarzahl und die synchrone Drehzahl.
2. Berechne das Nenndrehmoment. Zeige, dass die Einheit N·m herauskommt.
3. Berechne die aufgenommene Wirkleistung für Dreieck- und Sternschaltung.
4. Vergleiche mit der Leistung auf dem Typenschild und berechne den Wirkungsgrad. Warum ist er bei so einem kleinen Motor niedrig?
5. Wie groß dürfen die gemessenen Werte nach DIN EN 60034-1 ungefähr vom Typenschild abweichen?

:::lösung
1. $p = \dfrac{60 \cdot 50\ \text{Hz}}{1\,380\ \tfrac{1}{\text{min}}} = 2{,}17$ → nächste kleinere ganze Zahl: $p = 2$, $n_0 = 1\,500\ \tfrac{1}{\text{min}}$
2. $M_\text{N} = \dfrac{250\ \text{W}}{2 \pi \cdot \frac{1\,380}{60}\ \tfrac{1}{\text{s}}} = 1{,}73\ \text{N·m}$; Einheit: $\dfrac{\text{W}}{1/\text{s}} = \text{W·s} = \dfrac{\text{N·m}}{\text{s}} \cdot \text{s} = \text{N·m}$
3. Δ: $\sqrt{3} \cdot 230\ \text{V} \cdot 1{,}3\ \text{A} \cdot 0{,}74 = 383\ \text{W}$; Y: $\sqrt{3} \cdot 400\ \text{V} \cdot 0{,}75\ \text{A} \cdot 0{,}74 = 385\ \text{W}$ – praktisch gleich.
4. Auf dem Typenschild steht die abgegebene mechanische Leistung (250 W). $\eta = \dfrac{250\ \text{W}}{383\ \text{W}} = 65\ \%$. Bei kleinen Motoren fallen Wicklungswiderstand, Eisen- und Reibungsverluste im Verhältnis zur Leistung stark ins Gewicht.
5. Für einzelne Größen um etwa 10 %.
:::

## Aufgabe 2 – Sicher anschließen

1. In welcher Reihenfolge verbindest du Schutzleiter, Neutralleiter und Außenleiter? Warum?
2. Warum muss die Wellenabdeckung ohne Spalt sitzen und der Maschinensatz fest gekuppelt sein?
3. Welche Schaltung brauchst du für einen Versuch mit 230 V Leiterspannung? Setze die Brücken am Klemmbrett und führe den Anschlusstest durch.
4. Wie stellst du Linkslauf her, und warum muss der Anschlusstest danach wiederholt werden?

:::lösung
1. Erst PE, dann N, zuletzt die Außenleiter; beim Abbauen umgekehrt. So ist das Gehäuse immer geerdet, solange Spannung anliegen kann.
2. Die Belastungsmaschine erzwingt hohe Drehzahlen und Momente; lose Teile oder offene Wellen können Kleidung oder Haare erfassen.
3. Dreieck (U1–W2, V1–U2, W1–V2): Jede Wicklung bekommt dann ihre 230 V.
4. Zwei Außenleiter tauschen, üblicherweise L1 und L3. Der Prüfstand muss die neue Drehrichtung kennen, sonst würde die Belastungsmaschine gegen den Motor arbeiten.
:::

## Aufgabe 3 – Nennpunkt messen

Modus „Manuell“, Dreieck, 230 V, 50 Hz. Starte, stelle 1 380 1/min ein, warte auf BEREIT und speichere den Messpunkt.

1. Trage die gemessenen Werte ein: U = ___ V, I = ___ A, φ = ___°, M = ___ N·m, P_el = ___ W, P_mech = ___ W, η = ___ %
2. Prüfe die gemessene mechanische Leistung mit $P = M \cdot 2 \pi \cdot n$ nach.
3. Vergleiche mit dem Typenschild (Tabelle auf der Seite). Liegen alle Werte in der Toleranz?
4. Speichere zusätzlich Messpunkte bei 1 300 und 1 450 1/min. Wie ändern sich Strom und cos φ?

:::lösung
1. Ungefähr (Simulation): U = 230 V, I ≈ 1,29 A, φ ≈ 42°, M ≈ 1,77 N·m, P_el ≈ 380 W, P_mech ≈ 256 W, η ≈ 67 %. Kleine Abweichungen durch die Wicklungstemperatur sind normal.
2. $P = 1{,}77\ \text{N·m} \cdot 2 \pi \cdot \dfrac{1\,380}{60}\ \tfrac{1}{\text{s}} = 256\ \text{W}$
3. Ja, alle Abweichungen liegen unter 10 %.
4. Bei 1 300 1/min steigen Strom und Moment, cos φ wird größer. Bei 1 450 1/min sinken Strom und Moment, cos φ wird kleiner: Der Magnetisierungsstrom (Blindstrom) bleibt etwa gleich, der Wirkanteil sinkt.
:::

## Aufgabe 4 – Generatorbetrieb

Speichere Messpunkte bei 1 490, 1 500, 1 550 und 1 600 1/min.

1. Bei welcher Drehzahl wechselt das Drehmoment das Vorzeichen, bei welcher die elektrische Wirkleistung? Warum nicht an derselben Stelle?
2. Was bedeutet ein Phasenwinkel über 90°?
3. Berechne den Wirkungsgrad als Generator bei 1 600 1/min.
4. Woher bekommt die Maschine im Generatorbetrieb ihren Magnetisierungsstrom?

:::lösung
1. Das Moment wird kurz vor 1 500 1/min negativ (dort deckt der Motor nur noch seine Reibung), die elektrische Wirkleistung erst etwa ab 1 520 1/min, weil Kupfer- und Eisenverluste weiter aus dem Netz gedeckt werden, bis die angetriebene Leistung sie übersteigt.
2. $\cos\varphi < 0$: Die Wirkleistung fließt ins Netz zurück.
3. Etwa $P_\text{el} = -241\ \text{W}$, $P_\text{mech} = -381\ \text{W}$: $\eta = \dfrac{241\ \text{W}}{381\ \text{W}} = 63\ \%$
4. Weiterhin aus dem Netz (induktiver Blindstrom). Ohne Netz bräuchte sie Kondensatoren zur Erregung.
:::
