---
titel: Gravitation – Gewichtskraft, Satellitenbahnen, geostationär
stufe: mittel
beschreibung: Gravitationsgesetz anwenden, Bahngeschwindigkeit und Umlaufzeit der Raumstation, Schwere und Fluchtgeschwindigkeit auf dem Mond, Höhe der geostationären Bahn herleiten.
---
# Gravitation – Gewichtskraft, Satellitenbahnen, geostationär

Name: ___  Datum: ___

Benötigte Formeln: $F = G \dfrac{m_1 m_2}{r^2}$, $v = \sqrt{\dfrac{GM}{r}}$, $T = 2\pi\sqrt{\dfrac{r^3}{GM}}$, $v_\text{F} = \sqrt{\dfrac{2GM}{R}}$; $G = 6{,}674 \cdot 10^{-11}\,\tfrac{\text{m}^3}{\text{kg s}^2}$, $M_\text{Erde} = 5{,}972 \cdot 10^{24}\,\text{kg}$, $R_\text{Erde} = 6\,371\,\text{km}$

Zum Ausprobieren: [Gravitation und Raumfahrt](../../../physik/gravitation-raumfahrt.html)

## Aufgabe 1 – Gewichtskraft

1. Berechne die Gravitationskraft der Erde auf einen 80 kg schweren Menschen an der Oberfläche.
2. Wie groß ist sie in 420 km Höhe (Raumstation)? Wie viel Prozent sind das?
3. Warum schweben die Astronauten trotzdem?

:::lösung
1. $F = 6{,}674 \cdot 10^{-11} \cdot \dfrac{5{,}972 \cdot 10^{24} \cdot 80}{(6{,}371 \cdot 10^6)^2} = 786\,\text{N}$
2. $r = 6\,791\,\text{km}$: $F = 691\,\text{N}$, also $\left(\tfrac{6\,371}{6\,791}\right)^2 = 88\,\%$.
3. Station und Menschen fallen gemeinsam um die Erde (freier Fall). Nichts drückt gegen den Boden, deshalb spüren sie kein Gewicht.
:::

## Aufgabe 2 – Die Raumstation

1. Berechne die Bahngeschwindigkeit der Raumstation in 420 km Höhe.
2. Wie lange dauert ein Umlauf?
3. Wie viele Sonnenaufgänge erlebt die Besatzung an einem Tag?

:::lösung
1. $v = \sqrt{\dfrac{6{,}674 \cdot 10^{-11} \cdot 5{,}972 \cdot 10^{24}}{6{,}791 \cdot 10^6}} = 7\,661\,\tfrac{\text{m}}{\text{s}} \approx 27\,600\,\tfrac{\text{km}}{\text{h}}$
2. $T = 2\pi\sqrt{\dfrac{(6{,}791 \cdot 10^6)^3}{3{,}986 \cdot 10^{14}}} = 5\,570\,\text{s} = 92{,}8\,\text{min}$
3. $\dfrac{1\,440\,\text{min}}{92{,}8\,\text{min}} \approx 15{,}5$, also 15 bis 16.
:::

## Aufgabe 3 – Auf dem Mond

Mond: $M = 7{,}342 \cdot 10^{22}\,\text{kg}$, $R = 1\,737\,\text{km}$.

1. Wie groß ist die Schwerebeschleunigung auf dem Mond? Vergleiche mit der Erde.
2. Berechne die Fluchtgeschwindigkeit vom Mond und von der Erde.
3. Warum hat der Mond keine Atmosphäre?

:::lösung
1. $g = \dfrac{GM}{R^2} = 1{,}62\,\tfrac{\text{m}}{\text{s}^2}$, etwa ein Sechstel der Erde.
2. Mond: $v_\text{F} = \sqrt{\dfrac{2GM}{R}} = 2{,}38\,\tfrac{\text{km}}{\text{s}}$; Erde: $11{,}2\,\tfrac{\text{km}}{\text{s}}$.
3. Gasteilchen erreichen in der Sonnenhitze genügend oft Geschwindigkeiten über der kleinen Fluchtgeschwindigkeit und entweichen nach und nach.
:::

## Aufgabe 4 – Geostationäre Bahn

1. Ein geostationärer Satellit umläuft die Erde in einem Sterntag (86 164 s). Leite die Formel für den Bahnradius her (Gravitationskraft = Zentripetalkraft).
2. Berechne den Bahnradius und die Höhe über dem Äquator (Äquatorradius 6 378 km).
3. Wie schnell fliegt der Satellit?

:::lösung
1. $\dfrac{GMm}{r^2} = m\,\omega^2 r$ mit $\omega = \dfrac{2\pi}{T}$ ergibt $r = \sqrt[3]{\dfrac{G M T^2}{4\pi^2}}$.
2. $r = 42\,163\,\text{km}$, Höhe $42\,163 - 6\,378 = 35\,785\,\text{km}$.
3. $v = \dfrac{2\pi r}{T} = 3{,}07\,\tfrac{\text{km}}{\text{s}}$
:::
