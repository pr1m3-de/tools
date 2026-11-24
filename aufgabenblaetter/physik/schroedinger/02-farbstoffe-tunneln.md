---
titel: Schrödinger – Farbstoffe, Tunneleffekt und Rastertunnelmikroskop
stufe: schwer
beschreibung: Farbe eines Farbstoffmoleküls im Kastenmodell, Tunnelwahrscheinlichkeit genau und genähert, Empfindlichkeit des Rastertunnelmikroskops, warum Protonen kaum tunneln.
---
# Schrödinger – Farbstoffe, Tunneleffekt und Rastertunnelmikroskop

Name: ___  Datum: ___

Benötigte Formeln: $E_n = 0{,}376\,\text{eV} \cdot \dfrac{n^2}{(L/\text{nm})^2}$ (Elektron), $\kappa = \dfrac{\sqrt{2m(V_0 - E)}}{\hbar}$, für Elektronen $\kappa = 5{,}123\,\text{nm}^{-1} \cdot \sqrt{(V_0 - E)/\text{eV}}$, $T = \left(1 + \dfrac{V_0^2 \sinh^2(\kappa a)}{4E(V_0 - E)}\right)^{-1} \approx e^{-2\kappa a}$

Zum Ausprobieren: [Schrödinger-Gleichung: Teilchen im Kasten und Tunneleffekt](../../../physik/schroedinger.html)

## Aufgabe 1 – Ein Farbstoffmolekül

In einem kettenförmigen Farbstoffmolekül bewegen sich 6 Elektronen frei über eine Länge von 1,2 nm. Jeder Zustand nimmt zwei Elektronen auf.

1. Welche Zustände sind besetzt? Welcher ist der höchste besetzte, welcher der niedrigste freie?
2. Berechne die Energie und Wellenlänge des Photons, das ein Elektron vom höchsten besetzten in den niedrigsten freien Zustand hebt.
3. Welche Farbe wird absorbiert, und wie sieht der Farbstoff aus?

:::lösung
1. n = 1, 2, 3 sind besetzt; höchster besetzter n = 3, niedrigster freier n = 4.
2. $\Delta E = 0{,}376\,\text{eV} \cdot \dfrac{16 - 9}{1{,}44} = 1{,}83\,\text{eV}$; $\lambda = 678\,\text{nm}$
3. Rotes Licht wird absorbiert; der Farbstoff erscheint in der Komplementärfarbe, blaugrün.
:::

## Aufgabe 2 – Tunneln durch eine dünne Schicht

Ein Elektron mit 2 eV trifft auf eine 5 eV hohe und 0,5 nm breite Barriere.

1. Berechne κ.
2. Berechne T mit der Näherung $e^{-2\kappa a}$.
3. Die genaue Formel liefert $T = 5{,}4 \cdot 10^{-4}$. Warum weicht die Näherung hier ab?
4. Wie ändert sich T (Näherung), wenn die Barriere doppelt so breit ist?

:::lösung
1. $\kappa = 5{,}123 \cdot \sqrt{3}\,\text{nm}^{-1} = 8{,}87\,\text{nm}^{-1}$
2. $T \approx e^{-2 \cdot 8{,}87 \cdot 0{,}5} = e^{-8{,}87} = 1{,}4 \cdot 10^{-4}$
3. Die Näherung lässt den Vorfaktor weg und gilt erst für $\kappa a \gg 1$; hier ist $\kappa a = 4{,}4$, der Vorfaktor macht noch etwa Faktor 4 aus.
4. $T \approx e^{-17{,}7} = 2 \cdot 10^{-8}$ – das Quadrat des alten Werts.
:::

## Aufgabe 3 – Rastertunnelmikroskop

Zwischen Metallspitze und Probe fehlen dem Elektron etwa 4,5 eV (Austrittsarbeit).

1. Berechne κ.
2. Um welchen Faktor sinkt der Tunnelstrom, wenn der Abstand um 0,1 nm (etwa ein halber Atomdurchmesser) wächst?
3. Warum kann das Mikroskop deshalb einzelne Atome abbilden?

:::lösung
1. $\kappa = 5{,}123 \cdot \sqrt{4{,}5}\,\text{nm}^{-1} = 10{,}9\,\text{nm}^{-1}$
2. $e^{-2 \cdot 10{,}9 \cdot 0{,}1} = e^{-2{,}17} = 0{,}11$ – auf etwa ein Neuntel.
3. Schon winzige Höhenunterschiede ändern den Strom stark; ein Regelkreis hält ihn konstant, und die Bewegung der Spitze zeichnet die Oberfläche Atom für Atom nach.
:::

## Aufgabe 4 – Masse und Tunneln

1. Wie ändert sich κ, wenn statt eines Elektrons ein Proton (1 836-fache Masse) die Barriere aus Aufgabe 2 durchtunneln soll?
2. Schätze T mit der Näherung ab. Was folgt daraus?

:::lösung
1. $\kappa \propto \sqrt{m}$: $\sqrt{1\,836} = 42{,}8$-mal so groß, $\kappa = 380\,\text{nm}^{-1}$.
2. $T \approx e^{-2 \cdot 380 \cdot 0{,}5} = e^{-380} \approx 10^{-165}$ – praktisch null. Nur leichte Teilchen tunneln merklich durch solche Barrieren; schwere brauchen viel dünnere oder niedrigere.
:::
