---
titel: Perkolation – Bethe-Gitter, kritische Exponenten und Fraktale
stufe: schwer
beschreibung: Schwelle und Clustergröße im Bethe-Gitter herleiten, Kette, Korrelationslänge und endliche Gitter, fraktale Dimension des Clusters an der Schwelle.
---
# Perkolation – Bethe-Gitter, kritische Exponenten und Fraktale

Name: ___  Datum: ___

Benötigte Formeln: $p_\text{c} = \dfrac{1}{z-1}$, $S = \dfrac{1 + p}{1 - (z-1)\,p}$, $\xi \approx |p - p_\text{c}|^{-4/3}$, $M \approx L^{91/48}$

Zum Ausprobieren: [Perkolation: Waldbrand und Perkolationsschwelle](../../../physik/perkolation.html)

## Aufgabe 1 – Schwelle im Bethe-Gitter

Im Bethe-Gitter hat jeder Platz z Nachbarn, und es gibt keine geschlossenen Schleifen (ein unendlicher Baum).

1. Begründe: Kommt man auf einem Weg an einen besetzten Platz, gehen von dort z − 1 neue Äste aus. Unter welcher Bedingung kann ein Weg im Mittel unendlich weiterlaufen?
2. Berechne $p_\text{c}$ für z = 3, z = 4 und z = 7.
3. Die Kette (eindimensional) hat z = 2. Warum ist dort $p_\text{c} = 1$?

:::lösung
1. Jeder der z − 1 neuen Äste ist mit der Wahrscheinlichkeit p besetzt. Im Mittel gibt es also $(z-1)\,p$ Fortsetzungen. Ist das mindestens 1, stirbt der Weg nicht aus: $(z-1)\,p_\text{c} = 1$, also $p_\text{c} = \dfrac{1}{z-1}$.
2. z = 3: 0,5; z = 4: 0,333; z = 7: 0,167
3. In einer Kette gibt es nur einen Weg. Schon ein einziger leerer Platz unterbricht ihn. In einer unendlich langen Kette gibt es bei p < 1 immer irgendwo eine Lücke.
:::

## Aufgabe 2 – Clustergröße

1. Berechne die mittlere Clustergröße S im Bethe-Gitter mit z = 3 für p = 0,2, p = 0,4 und p = 0,45.
2. Was passiert, wenn p gegen 0,5 geht?
3. Berechne S und die Korrelationslänge $\xi = -1/\ln p$ für eine Kette mit p = 0,9.

:::lösung
1. p = 0,2: $S = \dfrac{1{,}2}{1 - 0{,}4} = 2$; p = 0,4: $S = \dfrac{1{,}4}{0{,}2} = 7$; p = 0,45: $S = \dfrac{1{,}45}{0{,}1} = 14{,}5$
2. Der Nenner geht gegen null, S wächst über alle Grenzen. An der Schwelle entsteht ein unendlicher Cluster.
3. $S = \dfrac{1{,}9}{0{,}1} = 19$; $\xi = -\dfrac{1}{\ln 0{,}9} = 9{,}49$ Plätze
:::

## Aufgabe 3 – Korrelationslänge und endliche Wälder

Die Korrelationslänge ξ gibt grob an, wie groß die typischen Cluster sind. In zwei Dimensionen gilt $\xi \approx |p - p_\text{c}|^{-4/3}$ (in Feldern).

1. Berechne ξ für einen Abstand zur Schwelle von 0,1 und von 0,01.
2. Ein Wald hat 100 × 100 Felder. Ab welchem Abstand zur Schwelle ist ξ größer als der Wald?
3. Erkläre damit, warum der Übergang im endlichen Wald verschmiert ist.

:::lösung
1. $0{,}1^{-4/3} = 21{,}5$ Felder; $0{,}01^{-4/3} = 464$ Felder
2. $|p - p_\text{c}| < 100^{-3/4} = 0{,}032$, also näher als etwa 3,2 Prozentpunkte an der Schwelle.
3. In diesem Bereich sind die typischen Cluster so groß wie der Wald. Ob einer zufällig von Rand zu Rand reicht, hängt vom einzelnen Wald ab. Die Breite des Übergangs schrumpft wie $L^{-3/4}$.
:::

## Aufgabe 4 – Fraktaler Cluster

Der größte Cluster an der Schwelle hat in einem Fenster der Größe L etwa $M = L^{D}$ Plätze mit $D = 91/48 \approx 1{,}896$.

1. Berechne M für L = 10 und L = 100.
2. Um welchen Faktor wächst M, wenn L verdoppelt wird? Vergleiche mit einer gefüllten Fläche.
3. Welcher Anteil der Fläche gehört für L = 100 und L = 1 000 000 zu diesem Cluster ($M/L^2$)? Was folgt daraus für sehr große Gitter?

:::lösung
1. $10^{1{,}896} = 79$; $100^{1{,}896} = 6\,190$ Plätze
2. $2^{1{,}896} = 3{,}72$-fach, eine gefüllte Fläche wächst um den Faktor 4.
3. $L^{D-2} = L^{-0{,}104}$: L = 100: 0,62; L = 10⁶: 0,24. Der Anteil geht für unendliche Gitter gegen null: Genau an der Schwelle hat der unendliche Cluster die Dichte null, er ist ein löchriges Fraktal.
:::
