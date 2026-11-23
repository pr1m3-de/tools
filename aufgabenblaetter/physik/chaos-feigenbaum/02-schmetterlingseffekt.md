---
titel: Chaos – Feigenbaum-Konstante, Ljapunow-Exponent und Schmetterlingseffekt
stufe: schwer
beschreibung: Feigenbaum-Verhältnisse aus der Tabelle berechnen, Ljapunow-Exponent am Fixpunkt, Fehlerwachstum im Chaos und Grenzen der Wettervorhersage.
---
# Chaos – Feigenbaum-Konstante, Ljapunow-Exponent und Schmetterlingseffekt

Name: ___  Datum: ___

Benötigte Formeln: $\delta_k = \dfrac{r_k - r_{k-1}}{r_{k+1} - r_k}$, $\lambda = \ln|f'(x^*)|$ (am Fixpunkt), $\Delta_n = \Delta_0 \cdot e^{\lambda n}$

Zum Ausprobieren: [Chaos und Feigenbaum-Konstante](../../../physik/chaos-feigenbaum.html)

## Aufgabe 1 – Die Feigenbaum-Konstante bestimmen

Die ersten Verdopplungen liegen bei r₁ = 3, r₂ = 3,449490, r₃ = 3,544090, r₄ = 3,564407 und r₅ = 3,568759.

1. Berechne die Abstände r₂ − r₁, r₃ − r₂, r₄ − r₃ und r₅ − r₄.
2. Berechne die Verhältnisse zweier aufeinanderfolgender Abstände.
3. Gegen welche Zahl laufen sie? Warum ist diese Zahl bemerkenswert?

:::lösung
1. 0,449490; 0,094600; 0,020317; 0,004352
2. 4,751; 4,656; 4,668
3. Gegen δ = 4,6692. Sie kommt bei allen Systemen mit einem einfachen quadratischen Höcker heraus, auch in Experimenten (Konvektion, Schwingkreise, Wasserhahn): Sie ist universell.
:::

## Aufgabe 2 – Ljapunow-Exponent am Fixpunkt

Liegt die Folge auf einem Fixpunkt, gilt $\lambda = \ln|f'(x^*)| = \ln|2 - r|$.

1. Berechne λ für r = 2,5, r = 2,9 und r = 2.
2. Was bedeutet λ = −0,693 anschaulich?
3. Warum läuft die Folge bei r = 2,9 so langsam in den Fixpunkt? Vergleiche in der Ansicht „Ljapunow“.

:::lösung
1. r = 2,5: ln 0,5 = −0,693; r = 2,9: ln 0,9 = −0,105; r = 2: ln 0 = −∞ (superstabil, der Fixpunkt ist x = 0,5 mit Steigung null).
2. $e^{-0{,}693} = 0{,}5$: Eine Abweichung vom Fixpunkt halbiert sich bei jedem Schritt.
3. λ liegt nahe null, die Abweichung schrumpft je Schritt nur um 10 %. Bei r = 3 ist λ = 0, dort kippt der Fixpunkt in die Periode 2.
:::

## Aufgabe 3 – Schmetterlingseffekt

Bei r = 4 ist λ = ln 2: Eine Abweichung verdoppelt sich im Mittel bei jedem Schritt.

1. Zwei Startwerte unterscheiden sich um 10⁻⁶. Nach wie vielen Schritten ist die Abweichung 0,1?
2. Ein Rechner arbeitet mit 16 Stellen (Abweichung 10⁻¹⁶). Nach wie vielen Schritten ist das Ergebnis wertlos (Abweichung 0,1)?
3. Mit doppelter Genauigkeit (10⁻³²): Wie viele Schritte gewinnt man? Was folgt daraus?

:::lösung
1. $n = \dfrac{\ln(0{,}1 / 10^{-6})}{\ln 2} = \dfrac{\ln 10^5}{\ln 2} = 16{,}6$ Schritte
2. $n = \dfrac{\ln 10^{15}}{\ln 2} = 49{,}8$, also nach etwa 50 Schritten.
3. $n = \dfrac{\ln 10^{31}}{\ln 2} = 103$ Schritte. 16 Stellen mehr bringen nur gut 50 Schritte. Die Vorhersage wächst nur mit dem Logarithmus der Genauigkeit – genauer messen hilft wenig.
:::

## Aufgabe 4 – Wettervorhersage

Ein Wettermodell verdoppelt kleine Fehler etwa alle 2 Tage. Der Anfangsfehler der Messung beträgt 1 % einer typischen Wetteränderung. Unbrauchbar wird die Vorhersage, wenn der Fehler 100 % erreicht.

1. Wie viele Verdopplungen und wie viele Tage sind das?
2. Eine zehnmal genauere Messung (0,1 %) kostet sehr viel. Wie viele Tage gewinnt man?
3. Warum gilt das auch für ein perfektes Modell?

:::lösung
1. $\log_2 \dfrac{100\,\%}{1\,\%} = \log_2 100 = 6{,}6$ Verdopplungen, also rund 13 Tage.
2. $\log_2 10 = 3{,}3$ Verdopplungen mehr, rund 6,6 Tage.
3. Das Wetter ist selbst chaotisch. Auch ein exaktes Modell braucht exakte Startwerte, und jede noch so kleine Messabweichung wächst exponentiell (Schmetterlingseffekt nach Lorenz).
:::
