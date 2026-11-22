---
titel: Netzsysteme TN, TT und IT
stufe: mittel
beschreibung: Bedeutung der Kurzzeichen, Abschaltbedingung im TN-System mit B- und C-Automat, Fehlerstrom und Berührungsspannung im TT-System, Erderwiderstand mit RCD, erster Fehler im IT-System.
---
# Netzsysteme TN, TT und IT

Name: ___  Datum: ___

Benötigte Formeln: $I_k = \dfrac{U_0}{Z_S}$, $I_a = m \cdot I_n$, $Z_S \le \dfrac{U_0}{I_a}$, $I_F = \dfrac{U_0}{R_A + R_B}$, $U_B = I_F \cdot R_A$, $R_A \cdot I_{\Delta n} \le 50\ \text{V}$; $U_0 = 230\ \text{V}$, B: $m = 5$, C: $m = 10$

Zum Ausprobieren: [Netzsysteme TN, TT und IT](../../../elektro/netzsysteme.html)

## Aufgabe 1 – Kurzzeichen

1. Was bedeuten die Buchstaben in TN-C-S?
2. Warum funktioniert ein RCD im TN-C-System nicht?
3. In welchem System läuft die Anlage beim ersten Körperschluss weiter? Was muss dort eingebaut sein?

:::lösung
1. T: Sternpunkt direkt geerdet; N: Gehäuse über Schutzleiter mit dem Sternpunkt verbunden; C-S: erst gemeinsamer PEN, dann getrennt in N und PE
2. Der Fehlerstrom fließt über den PEN zurück und damit wieder durch den Summenstromwandler – der RCD sieht keine Differenz.
3. Im IT-System; ein Isolationswächter meldet den ersten Fehler.
:::

## Aufgabe 2 – TN-System

Ein Steckdosenkreis ist mit B16 abgesichert, die gemessene Schleifenimpedanz beträgt 0,8 Ω.

1. Berechne den Kurzschlussstrom und den Auslösestrom des B16.
2. Wird rechtzeitig abgeschaltet? Wie groß darf $Z_S$ höchstens sein?
3. Wie groß darf $Z_S$ mit einem C16 sein? Ist ein Kreis mit 2 Ω mit B16 oder C16 in Ordnung?

:::lösung
1. $I_k = \dfrac{230}{0{,}8}\ \text{A} = 287{,}5\ \text{A}$; $I_a = 5 \cdot 16\ \text{A} = 80\ \text{A}$
2. Ja, 287,5 A ≥ 80 A; $Z_{S,\text{max}} = \dfrac{230}{80}\ \Omega = 2{,}88\ \Omega$
3. $I_a = 160\ \text{A}$, $Z_{S,\text{max}} = 1{,}44\ \Omega$; bei 2 Ω ($I_k = 115\ \text{A}$) reicht B16, C16 nicht.
:::

## Aufgabe 3 – TT-System

Ein Haus hat einen Anlagenerder mit 40 Ω, der Betriebserder des Netzes 2 Ω. Abgesichert mit B16 und RCD 30 mA.

1. Berechne Fehlerstrom und Berührungsspannung bei einem Körperschluss.
2. Löst der B16 aus? Löst der RCD aus?
3. Prüfe die Bedingung $R_A \cdot I_{\Delta n} \le 50\ \text{V}$. Wie groß dürfte $R_A$ mit 30 mA und mit 300 mA höchstens sein?

:::lösung
1. $I_F = \dfrac{230}{40 + 2}\ \text{A} = 5{,}48\ \text{A}$; $U_B = 5{,}48 \cdot 40\ \text{V} = 219\ \text{V}$ – lebensgefährlich
2. B16 nein (braucht 80 A), RCD ja (5,48 A ≫ 30 mA)
3. $40 \cdot 0{,}03 = 1{,}2\ \text{V} \le 50\ \text{V}$; höchstens $\dfrac{50}{0{,}03} = 1667\ \Omega$ bzw. $\dfrac{50}{0{,}3} = 167\ \Omega$
:::

## Aufgabe 4 – IT-System

Die Ableitkapazität je Außenleiter beträgt 1 µF, der Erder hat 40 Ω.

1. Berechne den Strom beim ersten Fehler mit $I_d \approx \sqrt{3} \cdot U_0 \cdot \omega \cdot C$ und die Berührungsspannung.
2. Muss abgeschaltet werden?

:::lösung
1. $I_d = \sqrt{3} \cdot 230 \cdot 314 \cdot 10^{-6}\ \text{A} = 125\ \text{mA}$; $U_B = 0{,}125 \cdot 40\ \text{V} = 5\ \text{V}$
2. Nein, 5 V liegen unter 50 V. Der Isolationswächter meldet den Fehler; er muss vor einem zweiten Fehler behoben werden.
:::
