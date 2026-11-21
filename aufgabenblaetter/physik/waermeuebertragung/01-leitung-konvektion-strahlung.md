---
titel: Wärmeübertragung
stufe: mittel
beschreibung: Wärmeleitung durch Ziegel und Dämmung, U-Wert einer Außenwand, Konvektion am Heizkörper, Wärmestrahlung des Menschen und Wiensches Verschiebungsgesetz.
---
# Wärmeübertragung

Name: ___  Datum: ___

Benötigte Formeln: $\Phi = \dfrac{\lambda A \Delta\vartheta}{d}$, $U = \dfrac{1}{R_{si} + \frac{d}{\lambda} + R_{se}}$, $\Phi = h A \Delta\vartheta$, $\Phi = \varepsilon \sigma A (T_1^4 - T_2^4)$, $\lambda_\text{max} = \dfrac{2898\ \mu\text{m K}}{T}$; $\sigma = 5{,}67 \cdot 10^{-8}\ \tfrac{\text{W}}{\text{m}^2\text{K}^4}$

Zum Ausprobieren: [Wärmeübertragung](../../../physik/waermeuebertragung.html)

## Aufgabe 1 – Wärmeleitung

Innen ist es 20 °C, außen −5 °C. Betrachte 1 m² Wandfläche.

1. Berechne den Wärmestrom durch 24 cm Vollziegel ($\lambda = 0{,}81\ \tfrac{\text{W}}{\text{m K}}$), nur mit Wärmeleitung.
2. Berechne ihn für 14 cm Mineralwolle ($\lambda = 0{,}035\ \tfrac{\text{W}}{\text{m K}}$).
3. Wie dick müsste eine Ziegelwand sein, um genauso gut zu dämmen?

:::lösung
1. $\Phi = \dfrac{0{,}81 \cdot 1 \cdot 25}{0{,}24}\ \text{W} = 84{,}4\ \text{W}$
2. $\Phi = \dfrac{0{,}035 \cdot 25}{0{,}14}\ \text{W} = 6{,}25\ \text{W}$
3. $d = \dfrac{0{,}81 \cdot 25}{6{,}25}\ \text{m} = 3{,}24\ \text{m}$
:::

## Aufgabe 2 – U-Wert

Mit den Übergangswiderständen $R_{si} = 0{,}13$ und $R_{se} = 0{,}04\ \tfrac{\text{m}^2\text{K}}{\text{W}}$ (DIN EN ISO 6946):

1. Berechne den U-Wert der 24-cm-Ziegelwand.
2. Wie viel Wärme geht durch 12 m² dieser Wand bei 25 K Temperaturunterschied?
3. Berechne den U-Wert, wenn 14 cm Mineralwolle aufgebracht werden.

:::lösung
1. $U = \dfrac{1}{0{,}13 + 0{,}296 + 0{,}04} = 2{,}14\ \tfrac{\text{W}}{\text{m}^2\text{K}}$
2. $\Phi = 2{,}14 \cdot 12 \cdot 25\ \text{W} = 643\ \text{W}$
3. $U = \dfrac{1}{0{,}13 + 0{,}296 + 4{,}0 + 0{,}04} = 0{,}224\ \tfrac{\text{W}}{\text{m}^2\text{K}}$
:::

## Aufgabe 3 – Konvektion

1. Ein Heizkörper hat 2 m² Oberfläche und ist 30 K wärmer als die Luft ($h = 7{,}7\ \tfrac{\text{W}}{\text{m}^2\text{K}}$). Welche Wärme gibt er durch Konvektion ab?
2. Mit Gebläse steigt $h$ auf etwa 50. Wie viel ist es dann?
3. Warum steht der Heizkörper meist unter dem Fenster?

:::lösung
1. $\Phi = 7{,}7 \cdot 2 \cdot 30\ \text{W} = 462\ \text{W}$
2. $\Phi = 50 \cdot 2 \cdot 30\ \text{W} = 3000\ \text{W}$
3. Die warme Luft steigt vor dem kalten Fenster auf und verhindert, dass dort kalte Luft herabfällt und als Zug am Boden spürbar wird.
:::

## Aufgabe 4 – Strahlung

1. Ein Mensch hat 1,8 m² Haut mit 33 °C ($\varepsilon = 0{,}95$) in einem 20 °C warmen Raum. Wie viel Wärme strahlt er netto ab?
2. Bei welcher Wellenlänge strahlen die Sonne (5800 K), ein Glühdraht (2700 K) und die Haut am stärksten?
3. Warum spart eine blanke Alufolie hinter dem Heizkörper Energie?

:::lösung
1. $\Phi = 0{,}95 \cdot 5{,}67 \cdot 10^{-8} \cdot 1{,}8 \cdot (306{,}15^4 - 293{,}15^4)\ \text{W} \approx 136\ \text{W}$
2. Sonne 0,50 µm (sichtbar), Glühdraht 1,07 µm (nahes Infrarot, deshalb viel Wärme und wenig Licht), Haut 9,5 µm (Infrarot)
3. Blankes Metall hat einen kleinen Emissionsgrad und wirft die Wärmestrahlung zurück in den Raum statt in die Außenwand.
:::
