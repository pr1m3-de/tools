---
titel: Transistor und Operationsverstärker
stufe: mittel
beschreibung: Basiswiderstand für einen Transistorschalter mit Übersteuerung und Normwert, Verlustleistung, Relais mit Freilaufdiode, invertierender und nichtinvertierender Verstärker mit Begrenzung, Komparator.
---
# Transistor und Operationsverstärker

Name: ___  Datum: ___

Benötigte Formeln: $I_C = \dfrac{U_B - U_{CE,sat}}{R_L}$, $I_B = \ddot{u} \cdot \dfrac{I_C}{B}$, $R_B = \dfrac{U_E - U_{BE}}{I_B}$, $V = -\dfrac{R_2}{R_1}$, $V = 1 + \dfrac{R_2}{R_1}$; $U_{BE} = 0{,}7\ \text{V}$, $U_{CE,sat} = 0{,}2\ \text{V}$

Zum Ausprobieren: [Transistor und Operationsverstärker](../../../elektro/transistor-opv.html)

## Aufgabe 1 – Transistor als Schalter

Eine 12-V-Last mit 120 Ω soll von einem 5-V-Ausgang über einen NPN-Transistor ($B = 100$) geschaltet werden. Übersteuerungsfaktor 3.

1. Berechne Kollektor- und Basisstrom.
2. Berechne den Basiswiderstand und wähle den nächstkleineren Wert der Reihe E12.
3. Wie groß ist die Verlustleistung im durchgeschalteten Transistor?
4. Warum wird der Transistor heiß, wenn er nur halb durchgesteuert ist? Wie viel Leistung wäre das im schlimmsten Fall?

:::lösung
1. $I_C = \dfrac{12 - 0{,}2}{120}\ \text{A} = 98{,}3\ \text{mA}$; $I_B = 3 \cdot \dfrac{98{,}3}{100}\ \text{mA} = 2{,}95\ \text{mA}$
2. $R_B = \dfrac{5 - 0{,}7}{2{,}95\ \text{mA}} = 1{,}46\ \text{k}\Omega$ → 1,2 kΩ
3. $P \approx 0{,}2 \cdot 0{,}0983 + 0{,}7 \cdot 0{,}00358\ \text{W} \approx 22\ \text{mW}$
4. Dann liegt eine große Spannung am Transistor, während ein großer Strom fließt. Am schlimmsten bei halber Betriebsspannung: $P = \dfrac{U_B^2}{4 R_L} = \dfrac{144}{480}\ \text{W} = 0{,}3\ \text{W}$
:::

## Aufgabe 2 – Relais schalten

Ein 24-V-Relais mit 400 Ω Spulenwiderstand soll von einem 3,3-V-Mikrocontroller geschaltet werden ($B = 200$, Übersteuerung 2).

1. Berechne Spulenstrom, Basisstrom und Basiswiderstand (E12, nächstkleiner).
2. Wozu dient die Diode parallel zur Relaisspule, und wie herum wird sie eingebaut?

:::lösung
1. $I_C \approx \dfrac{24}{400}\ \text{A} = 60\ \text{mA}$; $I_B = 2 \cdot \dfrac{60}{200}\ \text{mA} = 0{,}6\ \text{mA}$; $R_B = \dfrac{3{,}3 - 0{,}7}{0{,}6\ \text{mA}} = 4{,}33\ \text{k}\Omega$ → 3,9 kΩ
2. Freilaufdiode: Beim Abschalten erzeugt die Spule eine hohe Gegenspannung. Die Diode (Kathode an Plus) lässt den Spulenstrom auslaufen und schützt den Transistor.
:::

## Aufgabe 3 – Operationsverstärker

1. Ein invertierender Verstärker hat $R_1 = 10\ \text{k}\Omega$ und $R_2 = 47\ \text{k}\Omega$. Berechne die Verstärkung und die Ausgangsspannung bei 0,5 V am Eingang.
2. Was passiert bei 4 V am Eingang, wenn der Verstärker mit ±15 V versorgt wird und der Ausgang 1,5 V unter der Versorgung bleibt?
3. Ein nichtinvertierender Verstärker soll 10-fach verstärken, $R_1 = 10\ \text{k}\Omega$. Wie groß muss $R_2$ sein? Wie viel ist das in Dezibel?
4. Ein Komparator vergleicht einen Sensor mit 1 V. Was gibt er bei 0,5 V und bei 1,5 V aus?

:::lösung
1. $V = -\dfrac{47}{10} = -4{,}7$; $U_a = -4{,}7 \cdot 0{,}5\ \text{V} = -2{,}35\ \text{V}$
2. Rechnerisch −18,8 V, der Ausgang bleibt aber bei −13,5 V stehen: Das Signal wird abgeschnitten (übersteuert).
3. $R_2 = (V - 1) \cdot R_1 = 90\ \text{k}\Omega$; $20 \cdot \lg 10 = 20\ \text{dB}$
4. 0,5 V: Ausgang an der negativen Grenze (−13,5 V); 1,5 V: an der positiven (+13,5 V)
:::
