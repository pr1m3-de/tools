---
titel: Raumfahrt – Hohmann-Übergang, Energie und Raketengleichung
stufe: schwer
beschreibung: Hohmann-Übergang von der niedrigen Erdbahn in die geostationäre Bahn, Flug zum Mars, Energie für den Weg in die Umlaufbahn, Raketengleichung und Massenverhältnis.
---
# Raumfahrt – Hohmann-Übergang, Energie und Raketengleichung

Name: ___  Datum: ___

Benötigte Formeln: $\Delta v_1 = \sqrt{\tfrac{GM}{r_1}}\left(\sqrt{\tfrac{2 r_2}{r_1 + r_2}} - 1\right)$, $\Delta v_2 = \sqrt{\tfrac{GM}{r_2}}\left(1 - \sqrt{\tfrac{2 r_1}{r_1 + r_2}}\right)$, $t = \pi\sqrt{\tfrac{a^3}{GM}}$, $\Delta v = v_\text{aus} \ln\dfrac{m_0}{m_1}$; $GM_\text{Erde} = 3{,}986 \cdot 10^{14}\,\tfrac{\text{m}^3}{\text{s}^2}$

Zum Ausprobieren: [Gravitation und Raumfahrt](../../../physik/gravitation-raumfahrt.html)

## Aufgabe 1 – Von der Raumstationsbahn in die geostationäre Bahn

Start auf einer Kreisbahn mit $r_1 = 6\,791\,\text{km}$, Ziel $r_2 = 42\,163\,\text{km}$.

1. Berechne die große Halbachse der Übergangsellipse.
2. Berechne $\Delta v_1$, $\Delta v_2$ und den gesamten Geschwindigkeitsbedarf.
3. Wie lange dauert der Übergang?

:::lösung
1. $a = \dfrac{6\,791 + 42\,163}{2} = 24\,477\,\text{km}$
2. $\Delta v_1 = 2\,394\,\tfrac{\text{m}}{\text{s}}$, $\Delta v_2 = 1\,455\,\tfrac{\text{m}}{\text{s}}$, zusammen $3\,849\,\tfrac{\text{m}}{\text{s}}$.
3. $t = \pi\sqrt{\dfrac{(2{,}448 \cdot 10^7)^3}{3{,}986 \cdot 10^{14}}} = 19\,060\,\text{s} = 5{,}29\,\text{h}$
:::

## Aufgabe 2 – Flug zum Mars

Erde und Mars umlaufen die Sonne auf (fast) Kreisbahnen mit 1 AE und 1,524 AE.

1. Wie groß ist die große Halbachse der Hohmann-Ellipse in AE?
2. Berechne die Flugdauer mit dem dritten Keplerschen Gesetz ($T^2 = a^3$ mit T in Jahren, a in AE).
3. Warum kann man nur etwa alle 26 Monate starten?

:::lösung
1. $a = \dfrac{1 + 1{,}524}{2} = 1{,}262\,\text{AE}$
2. Ganze Ellipse $T = 1{,}262^{1{,}5} = 1{,}418\,\text{a}$, die Hälfte davon: $0{,}709\,\text{a} = 259\,\text{Tage} \approx 8{,}5$ Monate.
3. Bei der Ankunft muss der Mars genau am Zielpunkt sein. Diese Stellung von Erde und Mars wiederholt sich nur alle 780 Tage (synodische Periode).
:::

## Aufgabe 3 – Energie und Rakete

1. Wie viel Energie braucht man mindestens, um 1 kg vom Erdboden (ruhend) auf die Kreisbahn in 420 km Höhe zu bringen? $E = GMm\left(\dfrac{1}{R} - \dfrac{1}{2r}\right)$
2. Für den Weg in die Umlaufbahn braucht eine Rakete mit Verlusten etwa $\Delta v = 9{,}4\,\tfrac{\text{km}}{\text{s}}$. Ihr Triebwerk stößt mit $4{,}4\,\tfrac{\text{km}}{\text{s}}$ aus. Wie groß muss das Massenverhältnis $m_0/m_1$ sein?
3. Welcher Anteil der Startmasse ist dann Treibstoff? Warum baut man Raketen in Stufen?

:::lösung
1. $E = 3{,}986 \cdot 10^{14} \cdot \left(\dfrac{1}{6{,}371 \cdot 10^6} - \dfrac{1}{2 \cdot 6{,}791 \cdot 10^6}\right) = 33{,}2\,\text{MJ} = 9{,}2\,\text{kWh}$
2. $\dfrac{m_0}{m_1} = e^{9{,}4/4{,}4} = e^{2{,}14} = 8{,}47$
3. $1 - \dfrac{1}{8{,}47} = 88\,\%$ Treibstoff. Leere Tanks und schwere Triebwerke werden abgeworfen, damit sie nicht weiter mitbeschleunigt werden müssen; jede Stufe startet mit einem günstigeren Massenverhältnis.
:::
