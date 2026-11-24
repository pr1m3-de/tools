---
titel: Schrödinger – Teilchen im Kasten
stufe: mittel
beschreibung: Energiestufen eines Elektrons im Potentialtopf, Einfluss der Kastenbreite, Photon beim Übergang, Wellenfunktionen, Knoten und Aufenthaltswahrscheinlichkeit, klassischer Grenzfall.
---
# Schrödinger – Teilchen im Kasten

Name: ___  Datum: ___

Benötigte Formeln: $E_n = \dfrac{n^2 h^2}{8 m L^2}$, für Elektronen $E_n \approx 0{,}376\,\text{eV} \cdot \dfrac{n^2}{(L/\text{nm})^2}$, $\psi_n(x) = \sqrt{\tfrac{2}{L}} \sin\dfrac{n\pi x}{L}$, $\lambda = \dfrac{1\,240\,\text{eV nm}}{\Delta E}$

Zum Ausprobieren: [Schrödinger-Gleichung: Teilchen im Kasten und Tunneleffekt](../../../physik/schroedinger.html)

## Aufgabe 1 – Energiestufen

1. Berechne die Energien der drei niedrigsten Zustände eines Elektrons in einem 1 nm breiten Kasten.
2. Wie groß ist die Grundzustandsenergie, wenn der Kasten nur 0,5 nm breit ist?
3. Warum ist die kleinste Energie nie null?

:::lösung
1. 0,376 eV; 1,50 eV; 3,38 eV
2. Viermal so groß: 1,50 eV ($E \propto 1/L^2$).
3. Für n = 0 wäre ψ überall null – kein Teilchen. Ein eingesperrtes Teilchen hat immer eine Impulsunschärfe und damit Bewegungsenergie (Nullpunktsenergie).
:::

## Aufgabe 2 – Licht aus dem Kasten

1. Das Elektron im 1-nm-Kasten springt von n = 2 auf n = 1. Welche Wellenlänge hat das Photon? In welchem Bereich liegt es?
2. Wie müsste man den Kasten ändern, damit das Photon sichtbar wird?

:::lösung
1. $\Delta E = 1{,}50 - 0{,}376 = 1{,}13\,\text{eV}$; $\lambda = 1\,100\,\text{nm}$ – nahes Infrarot.
2. Kleiner machen: Die Energien wachsen mit $1/L^2$, die Wellenlänge wird kürzer. (Für 550 nm bräuchte man L ≈ 0,71 nm.)
:::

## Aufgabe 3 – Wellenfunktionen

1. Skizziere ψ und |ψ|² für n = 1, 2 und 3. Wie viele Knoten hat jeder Zustand im Inneren?
2. Mit welcher Wahrscheinlichkeit findet man das Teilchen im Zustand n = 1 im mittleren Drittel des Kastens? (61 %) Wie groß ist sie für n = 2? Vergleiche mit einer klassischen Kugel.
3. Was passiert mit |ψ|² für sehr große n?

:::lösung
1. n = 1: ein Bauch, 0 Knoten; n = 2: zwei Bauche, 1 Knoten in der Mitte; n = 3: drei Bauche, 2 Knoten.
2. n = 2: 19,6 % (der Knoten liegt genau in der Mitte). Klassisch: überall gleich wahrscheinlich, also 33,3 %.
3. Die Maxima liegen immer dichter; im Mittel wird die Verteilung gleichmäßig – der klassische Grenzfall.
:::

## Aufgabe 4 – Ein Tennisball im Kasten

Ein Tennisball (58 g) liegt in einer 1 m breiten Kiste.

1. Berechne seine Nullpunktsenergie in Joule.
2. Warum merkt man von Energiestufen bei Alltagsgegenständen nichts?

:::lösung
1. $E_1 = \dfrac{(6{,}626 \cdot 10^{-34})^2}{8 \cdot 0{,}058 \cdot 1^2}\,\text{J} = 9{,}5 \cdot 10^{-67}\,\text{J}$
2. Die Stufen liegen unvorstellbar dicht; jede noch so kleine Energie ist praktisch erlaubt. Die Quantisierung zeigt sich erst bei kleinen Massen und kleinen Abständen.
:::
