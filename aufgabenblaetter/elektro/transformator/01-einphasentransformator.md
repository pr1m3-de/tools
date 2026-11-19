---
titel: Einphasentransformator – Wiederholung
stufe: mittel
beschreibung: Induktionsgesetz, Hauptgleichung, Spannungs-, Strom- und Widerstandsübersetzung, Kopplungsfaktor, Kurzschlussspannung, Wirkungsgrad und Leistungsschild.
---
# Einphasentransformator – Wiederholung

Name: ___  Datum: ___

Benötigte Formeln (Tabellenbuch): $u_\text{i} = -N \cdot \dfrac{\Delta\Phi}{\Delta t}$, $U = 4{,}44 \cdot f \cdot N \cdot A \cdot \hat{B}$, $\ddot{u} = \dfrac{U_1}{U_2} = \dfrac{N_1}{N_2} = \dfrac{I_2}{I_1}$, $\ddot{u}^2 = \dfrac{Z_1}{Z_2}$, $K = \dfrac{U_2 \cdot N_1}{U_1 \cdot N_2}$, $u_\text{k} = \dfrac{U_\text{k}}{U_\text{1N}} \cdot 100\,\%$, $\eta = \dfrac{P_\text{ab}}{P_\text{ab} + P_\text{VFe} + P_\text{VCu}}$

## Aufgabe 1 – Induktionsgesetz

Eine Spule mit 50 Windungen wird von einem Magnetfluss durchsetzt. In den ersten 2 ms steigt der Fluss gleichmäßig um 0,2 mVs, danach bleibt er 3 ms konstant, dann fällt er in 1 ms um 0,3 mVs.

1. Berechne die induzierte Spannung in den drei Abschnitten.
2. Warum funktioniert ein Transformator nicht mit Gleichspannung?

:::lösung
1. Abschnitt 1: $u_\text{i} = -50 \cdot \dfrac{0{,}2\ \text{mVs}}{2\ \text{ms}} = -5\ \text{V}$. Abschnitt 2: Fluss konstant, $u_\text{i} = 0\ \text{V}$. Abschnitt 3: $u_\text{i} = -50 \cdot \dfrac{-0{,}3\ \text{mVs}}{1\ \text{ms}} = +15\ \text{V}$.
2. Nur ein sich ändernder Fluss induziert eine Spannung. Gleichspannung erzeugt nach dem Einschalten einen konstanten Fluss – auf der Ausgangsseite entsteht keine Spannung, und die Eingangswicklung wirkt nur noch mit ihrem kleinen Drahtwiderstand: Es fließt ein sehr großer Strom.
:::

## Aufgabe 2 – Transformatorhauptgleichung

1. Ein Transformator für 230 V, 50 Hz hat einen Kern mit 12 cm² Eisenquerschnitt. Wie viele Windungen braucht die Eingangswicklung für $\hat{B} = 1{,}1\ \text{T}$?
2. Ein Bahntransformator für 16,7 Hz hat 16 cm² Eisenquerschnitt; die 24-V-Wicklung hat 150 Windungen. Wie groß ist der Scheitelwert der Flussdichte?
3. Was passiert, wenn man einen 50-Hz-Transformator an 16,7 Hz mit gleicher Spannung betreibt?

:::lösung
1. $N = \dfrac{U}{4{,}44 \cdot f \cdot A \cdot \hat{B}} = \dfrac{230\ \text{V}}{4{,}44 \cdot 50\ \text{Hz} \cdot 12 \cdot 10^{-4}\ \text{m}^2 \cdot 1{,}1\ \text{T}} \approx 785$
2. $\hat{B} = \dfrac{U}{4{,}44 \cdot f \cdot N \cdot A} = \dfrac{24\ \text{V}}{4{,}44 \cdot 16{,}7\ \text{Hz} \cdot 150 \cdot 16 \cdot 10^{-4}\ \text{m}^2} \approx 1{,}35\ \text{T}$
3. Bei einem Drittel der Frequenz müsste die Flussdichte dreimal so groß werden. Der Kern gerät in die Sättigung, der Magnetisierungsstrom steigt stark an, die Wicklung wird heiß und kann verbrennen.
:::

## Aufgabe 3 – Übersetzung

Ein Steuertransformator 250 VA liegt an 400 V. Die Eingangswicklung hat 1 100, die Ausgangswicklung 66 Windungen. Die Verluste bleiben unberücksichtigt.

1. Berechne die Steuerspannung $U_2$ und das Übersetzungsverhältnis.
2. Berechne die Ströme in beiden Wicklungen bei Bemessungsleistung.

:::lösung
1. $U_2 = U_1 \cdot \dfrac{N_2}{N_1} = 400\ \text{V} \cdot \dfrac{66}{1\,100} = 24\ \text{V}$, $\ddot{u} = \dfrac{1\,100}{66} = 16{,}7$
2. $I_2 = \dfrac{S}{U_2} = \dfrac{250\ \text{VA}}{24\ \text{V}} = 10{,}4\ \text{A}$, $I_1 = \dfrac{S}{U_1} = \dfrac{250\ \text{VA}}{400\ \text{V}} = 0{,}625\ \text{A}$ – der Strom verhält sich umgekehrt wie die Spannung.
:::

## Aufgabe 4 – Kopplungsfaktor

Ein Experimentiertransformator mit $N_1 = 1\,000$ und $N_2 = 500$ liegt an 230 V. Unter Bemessungslast misst man am Ausgang 104 V.

1. Welche Spannung hätte ein idealer Transformator geliefert?
2. Berechne den Kopplungsfaktor. Was sagt er aus?

:::lösung
1. $U_2 = 230\ \text{V} \cdot \dfrac{500}{1\,000} = 115\ \text{V}$
2. $K = \dfrac{U_2 \cdot N_1}{U_1 \cdot N_2} = \dfrac{104\ \text{V} \cdot 1\,000}{230\ \text{V} \cdot 500} \approx 0{,}90$ – etwa 10 % des Flusses erreichen die Ausgangswicklung nicht (Streufluss); dazu kommt der Spannungsfall an den Wicklungswiderständen.
:::

## Aufgabe 5 – Widerstandsübersetzung

Ein Lautsprecher mit $Z_2 = 4\ \Omega$ ist über einen Übertrager mit $N_1 = 1\,200$ und $N_2 = 100$ angeschlossen. Welchen Widerstand sieht der Verstärker am Eingang?

:::lösung
$\ddot{u} = \dfrac{1\,200}{100} = 12$, $Z_1 = \ddot{u}^2 \cdot Z_2 = 144 \cdot 4\ \Omega = 576\ \Omega$
:::

## Aufgabe 6 – Kurzschlussspannung

Ein Transformator 230 V/24 V, 400 VA wird im Kurzschlussversuch gemessen: Bei kurzgeschlossenem Ausgang fließt der Bemessungsstrom, wenn am Eingang 23 V anliegen.

1. Beschreibe, wie der Kurzschlussversuch durchgeführt wird.
2. Berechne die relative Kurzschlussspannung.
3. Wie groß wird der Dauerkurzschlussstrom auf der Ausgangsseite bei Bemessungsspannung?

:::lösung
1. Stelltransformator auf 0 V stellen, Ausgang kurzschließen, Eingangsspannung langsam erhöhen, bis der Eingangsbemessungsstrom fließt; dann $U_\text{k}$ ablesen. Die gemessene Wirkleistung sind die Wicklungsverluste.
2. $u_\text{k} = \dfrac{23\ \text{V}}{230\ \text{V}} \cdot 100\,\% = 10\,\%$
3. $I_\text{2N} = \dfrac{400\ \text{VA}}{24\ \text{V}} = 16{,}7\ \text{A}$, $I_\text{k} = \dfrac{I_\text{2N} \cdot 100\,\%}{u_\text{k}} = \dfrac{16{,}7\ \text{A} \cdot 100\,\%}{10\,\%} = 167\ \text{A}$
:::

## Aufgabe 7 – Wirkungsgrad

Für denselben Transformator misst man im Leerlaufversuch 12 W und im Kurzschlussversuch 20 W.

1. Welche Verluste werden in den beiden Versuchen gemessen?
2. Berechne den Wirkungsgrad bei Bemessungslast mit ohmscher Last.

:::lösung
1. Leerlauf: Eisenverluste (Ummagnetisierung, Wirbelströme), sie sind lastunabhängig. Kurzschluss: Wicklungsverluste (Kupferverluste), sie wachsen mit dem Quadrat des Stroms.
2. $\eta = \dfrac{400\ \text{W}}{400\ \text{W} + 12\ \text{W} + 20\ \text{W}} \approx 0{,}926 = 92{,}6\,\%$
:::

## Aufgabe 8 – Leistungsschild

Ein Leistungsschild zeigt: Bemessungsleistung 20 kVA, Bemessungsspannungen 10 000 V / 400 V, Bemessungsströme 2 A / 50 A, 50 Hz, $u_\text{k} = 5\,\%$, Betrieb S1, Isolierstoffklasse F.

1. Erkläre die Angaben S1 und Isolierstoffklasse F.
2. Prüfe die Bemessungsströme rechnerisch.
3. Berechne den Dauerkurzschlussstrom auf der 400-V-Seite.

:::lösung
1. S1: Dauerbetrieb mit gleichbleibender Last. Isolierstoffklasse F: Die Isolierung verträgt dauerhaft bis 155 °C.
2. $I_1 = \dfrac{20\,000\ \text{VA}}{10\,000\ \text{V}} = 2\ \text{A}$, $I_2 = \dfrac{20\,000\ \text{VA}}{400\ \text{V}} = 50\ \text{A}$ ✓
3. $I_\text{k} = \dfrac{50\ \text{A} \cdot 100\,\%}{5\,\%} = 1\,000\ \text{A}$
:::

Nachrechnen: [Transformator](../../../elektro/transformator.html).
