---
titel: Chaos – logistische Gleichung, Fixpunkt und Periodenverdopplung
stufe: mittel
beschreibung: Logistische Gleichung von Hand iterieren, Fixpunkt und Stabilität, Spinnwebdiagramm deuten, Verdopplungen im Feigenbaumdiagramm und Abschätzung mit der Feigenbaum-Konstante.
---
# Chaos – logistische Gleichung, Fixpunkt und Periodenverdopplung

Name: ___  Datum: ___

Benötigte Formeln: $x_{n+1} = r \cdot x_n \cdot (1 - x_n)$, $x^* = 1 - \dfrac{1}{r}$, $f'(x^*) = 2 - r$, $\delta = 4{,}6692$

Zum Ausprobieren: [Chaos und Feigenbaum-Konstante](../../../physik/chaos-feigenbaum.html)

## Aufgabe 1 – Von Hand rechnen

1. Berechne für r = 2 und x₀ = 0,1 die Werte x₁ bis x₄. Wogegen läuft die Folge?
2. Berechne für r = 3,2 und x₀ = 0,5 die Werte x₁ bis x₄. Was fällt auf?
3. Was beschreibt x in der logistischen Gleichung, was r?

:::lösung
1. x₁ = 0,18; x₂ = 0,2952; x₃ = 0,4161; x₄ = 0,4859. Die Folge läuft gegen 0,5 = 1 − 1/2.
2. x₁ = 0,8; x₂ = 0,512; x₃ = 0,7995; x₄ = 0,5129. Die Werte springen zwischen etwa 0,513 und 0,799 hin und her: Periode 2.
3. x ist die Größe einer Population als Anteil der höchstmöglichen (0 bis 1), r die Wachstumsrate. Der Faktor (1 − x) bremst das Wachstum, wenn es eng wird.
:::

## Aufgabe 2 – Fixpunkt und Stabilität

1. Leite den Fixpunkt her: Setze $x^* = r\,x^*(1 - x^*)$ und löse nach x* auf.
2. Berechne x* und die Steigung $f'(x^*) = 2 - r$ für r = 2,5 und r = 3,3. Ist der Fixpunkt jeweils stabil?
3. Für welche r ist x* = 1 − 1/r stabil? Was passiert für r < 1?

:::lösung
1. Entweder x* = 0 oder (durch x* teilen) $1 = r\,(1 - x^*)$, also $x^* = 1 - \dfrac{1}{r}$.
2. r = 2,5: x* = 0,6; f′ = −0,5, |f′| < 1: stabil. r = 3,3: x* = 0,697; f′ = −1,3, |f′| > 1: instabil, die Folge springt in eine Periode 2.
3. Für |2 − r| < 1, also 1 < r < 3. Für r < 1 ist der Fixpunkt x* = 0 stabil (f′(0) = r < 1): Die Population stirbt aus.
:::

## Aufgabe 3 – Spinnwebdiagramm

Öffne die Ansicht „Spinnweb“.

1. Beschreibe, wie man aus dem Diagramm den nächsten Wert abliest (senkrecht zur Parabel, waagerecht zur Diagonale).
2. Wo schneiden sich Parabel und Diagonale? Was bedeutet der Schnittpunkt?
3. Stelle r = 2,8, r = 3,2 und r = 3,9 ein und beschreibe die Treppe jeweils.

:::lösung
1. Vom aktuellen x senkrecht bis zur Parabel: Die Höhe ist f(x) = xₙ₊₁. Dann waagerecht zur Diagonale y = x: Dort wird der neue Wert zum neuen x.
2. Bei x = 0 und bei x* = 1 − 1/r. Dort gilt f(x) = x, das sind die Fixpunkte.
3. r = 2,8: Die Treppe windet sich spiralförmig in den Fixpunkt 0,643. r = 3,2: Sie läuft in ein Rechteck – zwei Werte im Wechsel. r = 3,9: Sie füllt unregelmäßig eine große Fläche aus, ohne sich zu wiederholen: Chaos.
:::

## Aufgabe 4 – Feigenbaumdiagramm und δ

1. Lies im Feigenbaumdiagramm ab, bei welchen r die ersten beiden Verdopplungen liegen.
2. Schätze mit δ = 4,6692 die dritte Verdopplung r₃ aus r₁ = 3 und r₂ = 3,4495.
3. Schätze mit r₂ = 3,4495 und r₃ = 3,5441 den Häufungspunkt $r_\infty \approx r_3 + \dfrac{r_3 - r_2}{\delta - 1}$.

:::lösung
1. r₁ = 3 (Periode 1 → 2), r₂ ≈ 3,45 (2 → 4).
2. $r_3 \approx r_2 + \dfrac{r_2 - r_1}{\delta} = 3{,}4495 + \dfrac{0{,}4495}{4{,}6692} = 3{,}5458$ (genau: 3,5441)
3. $r_\infty \approx 3{,}5441 + \dfrac{0{,}0946}{3{,}6692} = 3{,}5699$ – der genaue Wert ist 3,56995.
:::
