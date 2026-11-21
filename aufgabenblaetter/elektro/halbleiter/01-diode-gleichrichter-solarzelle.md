---
titel: Halbleiter – Diode, Gleichrichter und Solarzelle
stufe: mittel
beschreibung: Stromleitung in Metallen und Halbleitern, Dotierung, pn-Übergang und Diode, Brückengleichrichter mit Ladekondensator und Brummspannung, Solarzelle mit Wirkungsgrad.
---
# Halbleiter – Diode, Gleichrichter und Solarzelle

Name: ___  Datum: ___

Benötigte Formeln: $\hat{U} = \sqrt{2} \cdot U$, $\hat{U}_\text{a} = \hat{U} - 2 U_\text{F}$, $\bar{U} = \dfrac{2}{\pi} \hat{U}_\text{a}$, $\Delta U = \dfrac{I}{2 f C}$, $\eta = \dfrac{P}{E \cdot A}$

Zum Ausprobieren: [Halbleiter, Diode und Gleichrichter](../../../elektro/halbleiter.html)

## Aufgabe 1 – Leiter und Halbleiter

1. Beschreibe, wie in einem Metall Strom fließt. In welche Richtung bewegen sich die Elektronen, in welche zeigt die technische Stromrichtung?
2. Warum steigt der Widerstand eines Metalls mit der Temperatur, während er bei reinem Silizium sinkt?
3. Erkläre n- und p-Dotierung. Welche Ladungsträger überwiegen jeweils?
4. Was ist ein Loch, und warum wandert es wie eine positive Ladung?

:::lösung
1. Freie Elektronen bewegen sich zwischen den festen Atomrümpfen; mit Spannung driften sie zum Pluspol. Die technische Stromrichtung ist umgekehrt, von Plus nach Minus.
2. Im Metall ist die Zahl der freien Elektronen fest; wärmer schwingen die Rümpfe stärker und behindern die Elektronen. Im Silizium werden mit der Wärme erst Ladungsträger frei (Eigenleitung) – ihre Zahl steigt stark.
3. n: Fremdatome mit fünf Außenelektronen (z. B. Phosphor), eines ist frei – Elektronen überwiegen. p: Fremdatome mit drei Außenelektronen (z. B. Bor), es fehlt eine Bindung – Löcher überwiegen.
4. Eine Stelle, an der ein Bindungselektron fehlt. Springt ein Nachbarelektron hinein, wandert das Loch in Gegenrichtung – wie eine positive Ladung.
:::

## Aufgabe 2 – Diode

1. Was ist die Sperrschicht, und wie verändert sie sich in Durchlass- und Sperrrichtung? Probiere mit dem Feld „Spannung an der Diode“.
2. Ab welcher Spannung leitet eine Silizium-Diode merklich?
3. An welcher Seite liegt beim Schaltzeichen die Kathode, und wie ist sie auf dem Bauteil meist markiert?

:::lösung
1. Am Übergang füllen Elektronen aus dem n-Gebiet die Löcher im p-Gebiet auf; es bleibt eine Zone ohne freie Ladungsträger. In Durchlassrichtung (Plus an p) wird sie schmal und verschwindet, in Sperrrichtung wird sie breiter.
2. Ab etwa 0,6 bis 0,7 V.
3. Am Querstrich, auf dem Bauteil meist mit einem Ring.
:::

## Aufgabe 3 – Brückengleichrichter

Ein Transformator liefert 12 V / 50 Hz, Dioden mit $U_\text{F} = 0{,}7\ \text{V}$.

1. Welche Dioden leiten in der positiven und welche in der negativen Halbwelle? Nutze die Ansicht „Brückengleichrichter“.
2. Berechne den Scheitelwert, die Spitze der Ausgangsspannung und den Mittelwert ohne Kondensator.
3. Mit 2 200 µF und 0,5 A Laststrom: Berechne die Brummspannung und die Gleichspannung.
4. Wie groß muss C sein, damit die Brummspannung höchstens 1 V beträgt?
5. Welche Sperrspannung müssen die Dioden mindestens aushalten?

:::lösung
1. Positive Halbwelle D1 und D3, negative D2 und D4; der Strom fließt durch die Last immer in derselben Richtung.
2. $\hat{U} = 17{,}0\ \text{V}$, $\hat{U}_\text{a} = 17{,}0 - 1{,}4 = 15{,}6\ \text{V}$, $\bar{U} = \dfrac{2}{\pi} \cdot 15{,}6\ \text{V} = 9{,}9\ \text{V}$
3. $\Delta U = \dfrac{0{,}5\ \text{A}}{2 \cdot 50\ \text{Hz} \cdot 2\,200\ \mu\text{F}} = 2{,}3\ \text{V}$, $U_\text{d} \approx 15{,}6 - 1{,}1 = 14{,}4\ \text{V}$
4. $C = \dfrac{0{,}5\ \text{A}}{2 \cdot 50\ \text{Hz} \cdot 1\ \text{V}} = 5\,000\ \mu\text{F}$
5. Mindestens den Scheitelwert, rund 17 V; man wählt mit Reserve (z. B. 50 V oder mehr).
:::

## Aufgabe 4 – Solarzelle

1. Erkläre mit der Ansicht „Solarzelle“, wie aus Licht Strom wird.
2. Eine Zelle mit 100 cm² liefert bei 1 000 W/m² im MPP 1,7 W. Berechne den Wirkungsgrad.
3. Was passiert mit Kurzschlussstrom und Leerlaufspannung, wenn die Bestrahlungsstärke halbiert wird? Probiere es aus.
4. Warum betreibt ein Wechselrichter die Module im MPP und nicht im Kurzschluss oder Leerlauf?

:::lösung
1. Licht erzeugt Elektron-Loch-Paare. Das elektrische Feld der Sperrschicht trennt sie: Elektronen zur n-Seite, Löcher zur p-Seite. Über den äußeren Verbraucher fließen die Elektronen zurück – ein Strom.
2. $\eta = \dfrac{1{,}7\ \text{W}}{1\,000\ \tfrac{\text{W}}{\text{m}^2} \cdot 0{,}01\ \text{m}^2} = 17\ \%$
3. Der Kurzschlussstrom halbiert sich, die Leerlaufspannung sinkt nur wenig (logarithmisch).
4. Im Kurzschluss ist die Spannung null, im Leerlauf der Strom – in beiden Fällen ist die Leistung null. Nur dazwischen, im MPP, ist das Produkt aus Spannung und Strom am größten.
:::
