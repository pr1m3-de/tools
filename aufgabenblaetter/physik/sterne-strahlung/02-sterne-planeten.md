---
titel: Sterne – Leuchtkraft, Riesen, Lebensdauer und Planetentemperatur
stufe: schwer
beschreibung: Leuchtkraft und Helligkeit von Sirius, Radius von Beteigeuze, Lebensdauer nach Masse, Gleichgewichtstemperatur von Erde und Mars, lebensfreundliche Zone um Proxima Centauri.
---
# Sterne – Leuchtkraft, Riesen, Lebensdauer und Planetentemperatur

Name: ___  Datum: ___

Benötigte Formeln: $\dfrac{L}{L_\odot} = \left(\dfrac{R}{R_\odot}\right)^2 \left(\dfrac{T}{5\,772\,\text{K}}\right)^4$, $M = 4{,}74 - 2{,}5 \lg\dfrac{L}{L_\odot}$, $m = M + 5 \lg\dfrac{d}{10\,\text{pc}}$, $t \approx 10^{10}\,\text{a} \cdot \left(\dfrac{M}{M_\odot}\right)^{-2{,}5}$, $T_\text{P} = T\sqrt{\dfrac{R}{2a}}\sqrt[4]{1 - A}$

Zum Ausprobieren: [Sterne und Strahlung](../../../physik/sterne-strahlung.html)

## Aufgabe 1 – Sirius

Sirius A: $R = 1{,}711\,R_\odot$, $T = 9\,940\,\text{K}$, Entfernung 2,64 pc.

1. Berechne die Leuchtkraft in Sonnenleuchtkräften.
2. Berechne die absolute bolometrische Helligkeit.
3. Berechne die scheinbare (bolometrische) Helligkeit.

:::lösung
1. $1{,}711^2 \cdot \left(\dfrac{9\,940}{5\,772}\right)^4 = 2{,}93 \cdot 8{,}80 = 25{,}7$
2. $M = 4{,}74 - 2{,}5 \lg 25{,}7 = 1{,}21$
3. $m = 1{,}21 + 5 \lg 0{,}264 = -1{,}68$ (der visuelle Wert ist −1,46)
:::

## Aufgabe 2 – Ein Überriese

Beteigeuze hat etwa $10^5$ Sonnenleuchtkräfte bei nur 3 600 K.

1. Berechne ihren Radius in Sonnenradien.
2. Wie groß ist das in AE ($R_\odot = 6{,}957 \cdot 10^8\,\text{m}$, 1 AE = $1{,}496 \cdot 10^{11}\,\text{m}$)? Bis zu welchem Planeten reichte sie im Sonnensystem (Mars 1,52 AE, Jupiter 5,2 AE)?

:::lösung
1. $\dfrac{R}{R_\odot} = \dfrac{\sqrt{10^5}}{(3\,600/5\,772)^2} = \dfrac{316}{0{,}389} = 813$
2. $813 \cdot 6{,}957 \cdot 10^8\,\text{m} = 5{,}66 \cdot 10^{11}\,\text{m} = 3{,}8\,\text{AE}$ – über die Marsbahn hinaus, aber nicht bis zum Jupiter.
:::

## Aufgabe 3 – Lebensdauer

1. Wie lange bleibt ein Stern mit 10 Sonnenmassen auf der Hauptreihe, wie lange einer mit 0,5 Sonnenmassen?
2. Das Universum ist 13,8 Milliarden Jahre alt. Was folgt für die massearmen Sterne?

:::lösung
1. 10 M☉: $10^{10} \cdot 10^{-2{,}5} = 3{,}2 \cdot 10^7$ Jahre; 0,5 M☉: $10^{10} \cdot 0{,}5^{-2{,}5} = 5{,}7 \cdot 10^{10}$ Jahre.
2. Kein Stern unter etwa 0,9 Sonnenmassen hat bisher die Hauptreihe verlassen; alle jemals entstandenen Roten Zwerge leuchten noch.
:::

## Aufgabe 4 – Temperatur von Planeten

1. Berechne die Gleichgewichtstemperatur der Erde (1 AE, Albedo 0,30) und des Mars (1,524 AE, Albedo 0,25).
2. Die mittlere Temperatur der Erde ist +15 °C. Woher kommt der Unterschied?
3. Proxima Centauri hat 0,0017 Sonnenleuchtkräfte. Berechne die lebensfreundliche Zone (0,95 bis 1,37 AE · √(L/L☉)). Liegt der Planet Proxima b (0,0485 AE) darin?

:::lösung
1. Erde: $T = 5\,772 \cdot \sqrt{\dfrac{6{,}957 \cdot 10^8}{2 \cdot 1{,}496 \cdot 10^{11}}} \cdot \sqrt[4]{0{,}7} = 255\,\text{K} = -18\,^\circ\text{C}$; Mars: $210\,\text{K} = -63\,^\circ\text{C}$.
2. Vom Treibhauseffekt: Wasserdampf und Kohlendioxid halten einen Teil der Wärmestrahlung zurück (rund +33 K).
3. $0{,}95 \cdot \sqrt{0{,}0017} = 0{,}039\,\text{AE}$ bis $1{,}37 \cdot \sqrt{0{,}0017} = 0{,}056\,\text{AE}$ – ja, Proxima b liegt darin.
:::
