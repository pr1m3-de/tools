---
titel: Photoeffekt – Planck-Konstante aus Messwerten, Photostrom, Strahlungsdruck
stufe: schwer
beschreibung: Planck-Konstante und Austrittsarbeit aus einer Messreihe mit Quecksilberlinien bestimmen, Photostrom aus Lichtleistung und Quantenausbeute, Impuls von Photonen und Strahlungsdruck.
---
# Photoeffekt – Planck-Konstante aus Messwerten, Photostrom, Strahlungsdruck

Name: ___  Datum: ___

Benötigte Formeln: $e U_0 = h f - W_\text{A}$, $N = \dfrac{P}{h f}$, $I = \eta N e$, $p = \dfrac{h}{\lambda}$, $F = \dfrac{P}{c}$ (vollständige Absorption)

Zum Ausprobieren: [Photoeffekt und Photonen](../../../physik/photoeffekt.html)

## Aufgabe 1 – Messreihe mit einer Quecksilberlampe

Eine Photozelle wird mit drei Linien einer Quecksilberlampe beleuchtet. Gemessen wird jeweils die Gegenspannung, bei der der Strom null wird:

| λ in nm | 365 | 405 | 436 |
|---|---|---|---|
| U₀ in V | 1,117 | 0,781 | 0,564 |

1. Berechne die Frequenzen.
2. Bestimme die Steigung der Geraden U₀(f) und daraus die Planck-Konstante.
3. Bestimme die Austrittsarbeit und die Grenzwellenlänge.

:::lösung
1. 8,213 · 10¹⁴ Hz; 7,402 · 10¹⁴ Hz; 6,876 · 10¹⁴ Hz
2. $\dfrac{\Delta U_0}{\Delta f} = \dfrac{1{,}117 - 0{,}564}{(8{,}213 - 6{,}876) \cdot 10^{14}}\,\tfrac{\text{V}}{\text{Hz}} = 4{,}14 \cdot 10^{-15}\,\tfrac{\text{V}}{\text{Hz}}$; $h = e \cdot 4{,}14 \cdot 10^{-15} = 6{,}63 \cdot 10^{-34}\,\text{Js}$
3. $W_\text{A} = h f - e U_0 = 4{,}14 \cdot 10^{-15} \cdot 8{,}213 \cdot 10^{14}\,\text{eV} - 1{,}117\,\text{eV} = 2{,}28\,\text{eV}$; $\lambda_\text{G} = \dfrac{1\,240}{2{,}28}\,\text{nm} = 544\,\text{nm}$
:::

## Aufgabe 2 – Photostrom

Eine Cäsium-Kathode wird mit 2 mW Licht von 405 nm beleuchtet; 8 % der Photonen lösen ein Elektron aus.

1. Wie viele Photonen treffen pro Sekunde auf?
2. Wie groß ist der Sättigungs-Photostrom?
3. Die Leistung wird halbiert, die Wellenlänge bleibt. Wie ändern sich Strom und U₀?

:::lösung
1. $N = \dfrac{2 \cdot 10^{-3} \cdot 405 \cdot 10^{-9}}{6{,}626 \cdot 10^{-34} \cdot 3{,}00 \cdot 10^8} = 4{,}1 \cdot 10^{15}\,\tfrac{1}{\text{s}}$
2. $I = 0{,}08 \cdot 4{,}1 \cdot 10^{15} \cdot 1{,}602 \cdot 10^{-19}\,\text{A} = 52\,\mu\text{A}$
3. Der Strom halbiert sich auf 26 µA, U₀ bleibt gleich.
:::

## Aufgabe 3 – Licht drückt

1. Berechne den Impuls eines Photons mit 500 nm.
2. Ein 1-W-Laser wird vollständig von einer Fläche absorbiert. Welche Kraft übt er aus?
3. Sonnensegel nutzen diesen Druck. Warum braucht man dafür riesige, sehr leichte Folien?

:::lösung
1. $p = \dfrac{6{,}626 \cdot 10^{-34}}{500 \cdot 10^{-9}}\,\tfrac{\text{kg m}}{\text{s}} = 1{,}3 \cdot 10^{-27}\,\tfrac{\text{kg m}}{\text{s}}$
2. $F = \dfrac{P}{c} = \dfrac{1}{3{,}00 \cdot 10^8}\,\text{N} = 3{,}3 \cdot 10^{-9}\,\text{N}$
3. Bei der Erde liefert die Sonne nur 1 361 W/m², das sind höchstens 9 µN je m² (bei Reflexion doppelt). Für eine merkliche Beschleunigung braucht man sehr große Fläche bei sehr kleiner Masse.
:::
