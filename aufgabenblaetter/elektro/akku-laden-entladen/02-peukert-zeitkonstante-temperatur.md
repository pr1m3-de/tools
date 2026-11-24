---
titel: Akku – Peukert, Zeitkonstante τ und Temperatur
stufe: schwer
beschreibung: Kapazität bei hohem Strom nach Peukert, Lastsprung mit Ersatzschaltbild und Zeitkonstante τ bis 5τ, abklingender Strom in der Konstantspannungsphase, Temperaturkorrektur der Ladespannung.
---
# Akku – Peukert, Zeitkonstante τ und Temperatur

Name: ___  Datum: ___

Benötigte Formeln: $t = H \cdot \left(\dfrac{C}{I \cdot H}\right)^{k}$, $\tau = R_1 \cdot C_1$, $U(t) = U_0 - I R_0 - I R_1 \left(1 - e^{-t/\tau}\right)$, $I(t) = I_0 \cdot e^{-t/\tau}$

Zum Ausprobieren: [Akku: Lade- und Entladeverhalten](../../../elektro/akku-laden-entladen.html)

## Aufgabe 1 – Peukert-Effekt

Ein Bleiakku hat 100 Ah bei 20-stündiger Entladung (C20, H = 20 h), der Peukert-Exponent ist k = 1,2.

1. Wie lange hält er bei 5 A, 20 A und 50 A? Wie viel Ladung liefert er jeweils?
2. Ein Lithium-Akku gleicher Nennkapazität hat k = 1,05. Wie viel Ladung liefert er bei 50 A?
3. Warum gibt man die Kapazität von Bleiakkus immer mit einer Entladezeit an?

:::lösung
1. 5 A: $t = 20 \cdot 1^{1{,}2} = 20\,\text{h}$, 100 Ah. 20 A: $t = 20 \cdot 0{,}25^{1{,}2} = 3{,}79\,\text{h}$, 75,8 Ah. 50 A: $t = 20 \cdot 0{,}1^{1{,}2} = 1{,}26\,\text{h}$, 63,1 Ah.
2. $t = 20 \cdot 0{,}1^{1{,}05} = 1{,}78\,\text{h}$, also 89,1 Ah.
3. Die entnehmbare Ladung hängt stark vom Strom ab. Ohne Angabe der Entladezeit (C5, C10, C20) sind Kapazitäten nicht vergleichbar.
:::

## Aufgabe 2 – Lastsprung und Zeitkonstante

Ersatzschaltbild einer Zelle: R₀ = 30 mΩ, R₁ = 60 mΩ parallel C₁ = 500 F, Ruhespannung 3,72 V. Zum Zeitpunkt 0 wird ein Strom von 3 A eingeschaltet.

1. Berechne die Zeitkonstante τ.
2. Wie groß ist die Klemmenspannung direkt nach dem Einschalten, nach 1τ und nach 5τ?
3. Nach 5τ wird die Last abgeschaltet. Nach welcher Zeit ist die Spannung wieder auf 3,70 V gestiegen?
4. Warum wartet man beim Messen der Ruhespannung mehrere Minuten?

:::lösung
1. $\tau = 0{,}06\,\Omega \cdot 500\,\text{F} = 30\,\text{s}$
2. Sofort: $3{,}72 - 3 \cdot 0{,}03 = 3{,}63\,\text{V}$. Nach 1τ: $3{,}63 - 0{,}18 \cdot 0{,}632 = 3{,}516\,\text{V}$. Nach 5τ: $3{,}63 - 0{,}18 \cdot 0{,}993 = 3{,}451\,\text{V}$.
3. Beim Abschalten springt die Spannung sofort um 0,09 V zurück. Danach fehlen noch $0{,}179\,\text{V} \cdot e^{-t/\tau}$. Aus $0{,}179 \cdot e^{-t/30\,\text{s}} = 0{,}02$ folgt $t = 30\,\text{s} \cdot \ln 8{,}94 = 66\,\text{s}$.
4. Die Polarisation klingt erst nach etwa 5τ ab, langsame Diffusion sogar erst nach Minuten bis Stunden. Direkt nach Last oder Ladung misst man nicht die Ruhespannung.
:::

## Aufgabe 3 – Konstantspannungsphase

Beim Laden einer 3-Ah-Zelle mit 1,5 A beginnt die Konstantspannungsphase mit 1,5 A. Der Strom klingt näherungsweise mit τ = 13 min ab. Abgebrochen wird bei C/20.

1. Wie groß ist der Abbruchstrom?
2. Wie lange dauert die Konstantspannungsphase? Wie viele τ sind das?
3. Wie viel Zeit spart man, wenn man bereits beim Wechsel in die Konstantspannungsphase aufhört? Was bedeutet das für die Lebensdauer?

:::lösung
1. $\dfrac{3\,\text{Ah}}{20} = 0{,}15\,\text{A}$
2. $t = \tau \cdot \ln\dfrac{1{,}5}{0{,}15} = 13\,\text{min} \cdot \ln 10 = 30\,\text{min} \approx 2{,}3\tau$
3. Die ganzen 30 Minuten, dafür fehlen einige Prozent Ladung. Ein nicht ganz voller Lithium-Akku altert langsamer – deshalb bieten viele Geräte „Laden bis 80 %“ an.
:::

## Aufgabe 4 – Temperatur

1. Die Ladespannung eines Bleiakkus ist 2,40 V je Zelle bei 25 °C, die Temperaturkorrektur −3 mV je Kelvin und Zelle. Berechne die Ladespannung einer 12-V-Batterie (6 Zellen) bei 0 °C und bei 40 °C.
2. Warum darf man Lithium-Akkus unter 0 °C nicht laden, wohl aber entladen?
3. Ein Akku hat bei 25 °C 3 Ah, bei −20 °C nur noch etwa 64 %. Wie viel Ladung ist bei −20 °C nutzbar?

:::lösung
1. 0 °C: $2{,}40 + 0{,}003 \cdot 25 = 2{,}475\,\text{V}$, also 14,85 V. 40 °C: $2{,}40 - 0{,}003 \cdot 15 = 2{,}355\,\text{V}$, also 14,13 V.
2. Beim Laden in der Kälte können die Lithium-Ionen nicht schnell genug in die Graphit-Anode einwandern und scheiden sich als metallisches Lithium ab (Lithium-Plating). Das kostet dauerhaft Kapazität und kann zu inneren Kurzschlüssen führen. Beim Entladen gibt es diesen Effekt nicht; der Akku liefert nur weniger Leistung und Kapazität.
3. $0{,}64 \cdot 3\,\text{Ah} = 1{,}92\,\text{Ah}$
:::
