---
titel: Akku – Laden, Entladen, C-Rate und Innenwiderstand
stufe: mittel
beschreibung: C-Rate, Ladezeit und Energie berechnen, Ladeverfahren CC/CV erklären, Klemmenspannung und Wärme am Innenwiderstand, Ladezeit mit Ladungswirkungsgrad.
---
# Akku – Laden, Entladen, C-Rate und Innenwiderstand

Name: ___  Datum: ___

Benötigte Formeln: $Q = I \cdot t$, $c = \dfrac{I}{C}$, $W = U_\text{N} \cdot C$, $U_\text{K} = U_0 - I \cdot R_\text{i}$, $P = I^2 \cdot R_\text{i}$, $t = \dfrac{C}{I \cdot \eta}$

Zum Ausprobieren: [Akku: Lade- und Entladeverhalten](../../../elektro/akku-laden-entladen.html)

## Aufgabe 1 – C-Rate, Ladezeit und Energie

1. Eine Rundzelle mit 3 Ah wird mit 1,5 A geladen. Welche C-Rate ist das, und wie lange dauert das Laden von leer auf voll im Idealfall?
2. Ein E-Bike-Akku hat 36 V und 14 Ah. Wie viel Energie speichert er?
3. Das Ladegerät liefert 4 A. Wie lange dauert das Laden von 10 % auf 100 % ohne Konstantspannungsphase?
4. Das Rad braucht 10 Wh je Kilometer. Wie weit kommt man mit einem vollen Akku höchstens?

:::lösung
1. $c = \dfrac{1{,}5\,\text{A}}{3\,\text{Ah}} = 0{,}5\,\text{C}$; $t = \dfrac{3\,\text{Ah}}{1{,}5\,\text{A}} = 2\,\text{h}$
2. $W = 36\,\text{V} \cdot 14\,\text{Ah} = 504\,\text{Wh}$
3. $\Delta Q = 0{,}9 \cdot 14\,\text{Ah} = 12{,}6\,\text{Ah}$; $t = \dfrac{12{,}6\,\text{Ah}}{4\,\text{A}} = 3{,}15\,\text{h} \approx 3\,\text{h}\,9\,\text{min}$, mit Konstantspannungsphase etwas länger.
4. $\dfrac{504\,\text{Wh}}{10\,\text{Wh/km}} = 50\,\text{km}$; nutzbar ist meist nur etwa 90 %, also rund 45 km.
:::

## Aufgabe 2 – Ladeverfahren CC/CV

1. Beschreibe die beiden Phasen beim Laden eines Lithium-Ionen-Akkus. Was ist jeweils konstant, was ändert sich?
2. Warum lädt man nicht von Anfang an mit konstanter Spannung 4,20 V? Rechne mit einer Ruhespannung von 3,6 V und einem wirksamen Widerstand von 0,093 Ω.
3. Woran erkennt das Ladegerät, dass der Akku voll ist?

:::lösung
1. Konstantstrom (CC): Der Strom ist fest, die Spannung steigt mit dem Ladezustand. Konstantspannung (CV): Ab der Ladeschlussspannung 4,20 V bleibt die Spannung fest, der Strom sinkt.
2. $I = \dfrac{4{,}20\,\text{V} - 3{,}6\,\text{V}}{0{,}093\,\Omega} = 6{,}45\,\text{A}$ – mehr als 2C für eine 3-Ah-Zelle. Das wäre viel zu viel, die Zelle würde heiß und altern.
3. Der Strom ist in der Konstantspannungsphase unter etwa C/20 gefallen (bei 3 Ah: 0,15 A).
:::

## Aufgabe 3 – Starterbatterie im Winter

Eine Starterbatterie hat die Ruhespannung 12,6 V und den Innenwiderstand 8 mΩ. Der Anlasser zieht 300 A.

1. Wie groß ist die Klemmenspannung beim Starten?
2. Welche Wärmeleistung entsteht in der Batterie?
3. Bei −10 °C verdoppelt sich der Innenwiderstand. Wie groß ist die Klemmenspannung jetzt? Was bedeutet das für den Start?

:::lösung
1. $U_\text{K} = 12{,}6\,\text{V} - 300\,\text{A} \cdot 0{,}008\,\Omega = 10{,}2\,\text{V}$
2. $P = (300\,\text{A})^2 \cdot 0{,}008\,\Omega = 720\,\text{W}$
3. $U_\text{K} = 12{,}6\,\text{V} - 300\,\text{A} \cdot 0{,}016\,\Omega = 7{,}8\,\text{V}$. Der Anlasser dreht viel langsamer, die Steuergeräte können bei so niedriger Spannung aussteigen – der Motor springt schlecht an.
:::

## Aufgabe 4 – Ladezeit mit Wirkungsgrad

1. Ein NiMH-Akku (2 Ah) wird mit 0,2 A geladen, der Ladungswirkungsgrad ist 0,7. Wie lange dauert das Laden von leer auf voll?
2. Ein Bleiakku mit 60 Ah ist zur Hälfte entladen und wird mit 6 A geladen (η = 0,88). Wie lange dauert es?
3. Warum braucht man bei NiMH und Blei mehr Ladung, als man später entnehmen kann?

:::lösung
1. $t = \dfrac{2\,\text{Ah}}{0{,}2\,\text{A} \cdot 0{,}7} = 14{,}3\,\text{h}$ – daher die übliche Angabe „14 bis 16 Stunden bei 0,1C“.
2. $t = \dfrac{30\,\text{Ah}}{6\,\text{A} \cdot 0{,}88} = 5{,}68\,\text{h} \approx 5\,\text{h}\,41\,\text{min}$
3. Ein Teil des Ladestroms geht in Nebenreaktionen: Beim Bleiakku wird Wasser zersetzt (Gasen), beim NiMH-Akku entsteht gegen Ende Wärme. Diese Ladung ist danach nicht entnehmbar.
:::
