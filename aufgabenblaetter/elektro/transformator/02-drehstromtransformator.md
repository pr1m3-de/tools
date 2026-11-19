---
titel: Drehstromtransformator – Prüfungsaufgaben
stufe: schwer
beschreibung: Typenschild, Kurzschlussspannung, Bemessungsströme, Schaltgruppe Dyn5, Anzapfungen, Belastung und Kompensation, Parallelbetrieb, Öl oder Gießharz.
---
# Drehstromtransformator – Prüfungsaufgaben

Name: ___  Datum: ___

Ein Gewerbegebiet wird aus dem 20-kV-Netz über eine eigene Station versorgt. Typenschild des Transformators:

| Angabe | Wert |
|---|---|
| Art | LT (Leistungstransformator) |
| Bemessungsleistung | 160 kVA |
| Bemessungsspannung OS | 20 kV ± 2 × 2,5 % |
| Bemessungsspannung US | 400 V |
| Frequenz | 50 Hz |
| Schaltgruppe | Dyn5 |
| Kurzschlussspannung | 4 % |
| Kühlungsart | ONAN |

Benötigte Formeln: $S = \sqrt{3} \cdot U \cdot I$, $u_\text{k} = \dfrac{U_\text{k}}{U_\text{N}} \cdot 100\,\%$, $I_\text{k} = \dfrac{I_\text{N} \cdot 100\,\%}{u_\text{k}}$, Stern $U_\text{Str} = \dfrac{U}{\sqrt{3}}$, Dreieck $I_\text{Str} = \dfrac{I}{\sqrt{3}}$, $Q_\text{C} = P \cdot (\tan\varphi_1 - \tan\varphi_2)$, Dreieck $C = \dfrac{Q_\text{C}}{3 \cdot U^2 \cdot \omega}$

## Aufgabe 1 – Grundlagen

1. Erkläre den Begriff galvanische Trennung.
2. Welche Verluste treten im Transformator auf, und wie werden sie ermittelt?
3. Welches Verhalten beschreibt die Kurzschlussspannung?

:::lösung
1. Ober- und Unterspannungswicklung sind elektrisch nicht verbunden; die Energie geht nur über das Magnetfeld. Fehler der 20-kV-Seite gelangen nicht leitend ins 400-V-Netz.
2. Eisenverluste (Ummagnetisierung, Wirbelströme) – im Leerlaufversuch bei Bemessungsspannung. Wicklungsverluste (Kupfer) – im Kurzschlussversuch bei Bemessungsstrom.
3. Sie gibt an, wie stark die Spannung unter Last nachgibt und wie groß der Kurzschlussstrom wird: kleines $u_\text{k}$ – spannungssteif, aber hoher Kurzschlussstrom.
:::

## Aufgabe 2 – Rechnen mit dem Typenschild

1. Berechne die Kurzschlussspannung in Volt (Oberspannungsseite).
2. Berechne die Bemessungsströme auf beiden Seiten.
3. Berechne die Strangströme in beiden Wicklungen.
4. Berechne das Windungszahlverhältnis $N_1 : N_2$.
5. Wie groß ist der Dauerkurzschlussstrom an den Unterspannungsklemmen?

:::tipp
Bei Dyn5 ist die Oberspannung im Dreieck geschaltet (Strangspannung = Leiterspannung), die Unterspannung im Stern (Strangspannung = Leiterspannung / √3).
:::

:::lösung
1. $U_\text{k} = 0{,}04 \cdot 20\,000\ \text{V} = 800\ \text{V}$
2. $I_\text{1N} = \dfrac{160\,000\ \text{VA}}{\sqrt{3} \cdot 20\,000\ \text{V}} = 4{,}62\ \text{A}$, $I_\text{2N} = \dfrac{160\,000\ \text{VA}}{\sqrt{3} \cdot 400\ \text{V}} = 231\ \text{A}$
3. OS Dreieck: $I_\text{Str} = \dfrac{4{,}62\ \text{A}}{\sqrt{3}} = 2{,}67\ \text{A}$. US Stern: $I_\text{Str} = I = 231\ \text{A}$
4. $\dfrac{N_1}{N_2} = \dfrac{U_\text{1Str}}{U_\text{2Str}} = \dfrac{20\,000\ \text{V}}{400\ \text{V}/\sqrt{3}} = \dfrac{20\,000}{230{,}9} = 86{,}6$ (die Leiterspannungen stehen dagegen 50 : 1)
5. $I_\text{k} = \dfrac{231\ \text{A} \cdot 100\,\%}{4\,\%} = 5\,774\ \text{A} \approx 5{,}8\ \text{kA}$
:::

## Aufgabe 3 – Schaltgruppe und unsymmetrische Last

1. Erkläre alle Zeichen der Schaltgruppe Dyn5.
2. Ist der Transformator für stark unsymmetrische Last geeignet? Begründe.
3. Warum ist Yyn0 dafür ungeeignet?

:::lösung
1. D: Oberspannung im Dreieck. y: Unterspannung im Stern. n: Sternpunkt der Unterspannung herausgeführt (Neutralleiter). 5: Die Unterspannung eilt der Oberspannung um 5 · 30° = 150° nach.
2. Ja. Jeder Strang der Unterspannung belastet genau einen Strang der Oberspannung (Dreieck); die Durchflutungen gleichen sich auf jedem Schenkel aus, der Sternpunkt bleibt stabil, der Neutralleiter darf voll belastet werden.
3. Bei Yyn0 findet ein einseitig belasteter Unterspannungsstrang auf der Oberspannungsseite keinen Ausgleich (kein Neutralleiter, kein Dreieck): Der Sternpunkt verschiebt sich, die Spannung der belasteten Phase sinkt, die der anderen steigt.
:::

## Aufgabe 4 – Anzapfungen

1. Erkläre die Angabe 20 kV ± 2 × 2,5 %. Welche Oberspannungen lassen sich einstellen?
2. Das Netz führt dauerhaft nur 19,5 kV. Welche Spannung stellt sich in Mittelstellung auf der Unterspannungsseite ein? Wie hilft die Anzapfung?

:::lösung
1. Die Oberspannungswicklung hat je zwei Anzapfungen um 2,5 % nach oben und unten: 19,0 – 19,5 – 20,0 – 20,5 – 21,0 kV.
2. $U_2 = 400\ \text{V} \cdot \dfrac{19{,}5}{20} = 390\ \text{V}$. Stellt man (spannungslos) auf die Anzapfung 19,5 kV um, gilt wieder das Verhältnis 19,5 kV : 400 V – es kommen 400 V an.
:::

## Aufgabe 5 – Belastung und Kompensation

1. Das Gewerbegebiet nimmt 125 kW bei $\cos\varphi = 0{,}8$ auf. Wird der Transformator überlastet?
2. Nach einer Erweiterung sind es 140 kW bei $\cos\varphi = 0{,}8$. Prüfe erneut.
3. Durch Kompensation soll $\cos\varphi = 0{,}95$ erreicht werden. Berechne die Kondensatorleistung, die neue Scheinleistung und die Kapazität je Strang bei Dreieckschaltung an 400 V.

:::lösung
1. $S = \dfrac{125\ \text{kW}}{0{,}8} = 156{,}3\ \text{kVA} \le 160\ \text{kVA}$ – zulässig, aber fast voll ausgelastet.
2. $S = \dfrac{140\ \text{kW}}{0{,}8} = 175\ \text{kVA} > 160\ \text{kVA}$ – Überlast.
3. $\tan\varphi_1 = 0{,}75$, $\tan\varphi_2 = 0{,}329$: $Q_\text{C} = 140\ \text{kW} \cdot (0{,}75 - 0{,}329) = 59\ \text{kvar}$. $S = \dfrac{140\ \text{kW}}{0{,}95} = 147{,}4\ \text{kVA}$ – passt wieder. $C = \dfrac{59\,000\ \text{var}}{3 \cdot (400\ \text{V})^2 \cdot 314\ \tfrac{1}{\text{s}}} \approx 391\ \mu\text{F}$ je Strang.
:::

## Aufgabe 6 – Parallelbetrieb

Statt eines neuen, größeren Transformators soll ein vorhandener Transformator 250 kVA, 20 kV/400 V, Dyn5, $u_\text{k} = 6\,\%$ parallel geschaltet werden.

1. Nenne die Bedingungen für den Parallelbetrieb.
2. Ist der Parallelbetrieb hier sinnvoll? Begründe.

:::lösung
1. Gleiche Bemessungsspannungen und Frequenz, gleiche Übersetzung, gleiche Kennzahl der Schaltgruppe, Kurzschlussspannungen höchstens 10 % Abweichung, Leistungsverhältnis höchstens 3 : 1.
2. Spannungen, Schaltgruppe und Leistungsverhältnis (250 : 160 ≈ 1,6 : 1) passen, aber die Kurzschlussspannungen weichen um 50 % voneinander ab (4 % gegen 6 %). Der Transformator mit 4 % würde überproportional belastet und überlastet – nicht sinnvoll.
:::

## Aufgabe 7 – Bauart und Schutz

1. Nenne je einen Vor- und Nachteil eines Öltransformators gegenüber einem Gießharztransformator.
2. Wie arbeitet der Buchholzschutz?
3. Was bedeutet die Kühlungsart ONAN?

:::lösung
1. Öl: günstiger und gut überlastbar, aber brennbar – Auffangwanne und Brandschutz nötig. Gießharz: schwer entflammbar, darf im Gebäude stehen – aber teurer und lauter.
2. Er sitzt in der Leitung zwischen Kessel und Ausdehnungsgefäß. Gasblasen bei einem Windungsschluss drücken einen Schwimmer nach unten: Warnung. Eine starke Ölströmung bei einem Kurzschluss bewegt eine Stauklappe: Abschaltung.
3. Öl, natürlicher Umlauf; Luft, natürlicher Umlauf (ohne Pumpe und Lüfter).
:::

Nachrechnen: [Transformator – Drehstrom und Schaltgruppen](../../../elektro/transformator.html).
