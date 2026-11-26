---
titel: Fehlerschleifen – Körperschluss im TN- und TT-System, PEN- und N-Bruch
stufe: mittel
beschreibung: Schleifenimpedanz und Abschaltung im TN-System, Fehlerstrom und Berührungsspannung im TT-System, klassische Nullung mit PEN-Bruch und Sternpunktverschiebung beim N-Bruch.
---
# Fehlerschleifen – Körperschluss, PEN- und N-Bruch

Name: ___  Datum: ___

Benötigte Formeln: $R = \dfrac{\rho \cdot l}{A}$ mit $\rho_\text{Cu} = 0{,}0178\,\dfrac{\Omega\,\text{mm}^2}{\text{m}}$, $Z_S \cdot I_a \le U_0$, $I_F = \dfrac{U_0}{R_A + R_B}$, $R_A \cdot I_{\Delta n} \le 50\,\text{V}$, $U_B = I_K \cdot R_K$

Zum Ausprobieren: [Stromkreis-Simulator](../../../elektro/stromkreis-simulator.html) – Beispiele „TN-C-S“, „TT-System“, „Klassische Nullung“ und „Neutralleiterbruch“.

## Aufgabe 1 – Körperschluss im TN-C-S-System

Ein Wasserkocher hängt an einem B16. Außenleiter und Schutzleiter sind je 18 m lang mit 2,5 mm² Kupfer. Die Impedanz von Trafo, Netz und Hausanschluss bis zur Haupterdungsschiene beträgt 0,30 Ω (vereinfacht als reiner Wirkwiderstand).

1. Berechne den Widerstand von Außenleiter und Schutzleiter.
2. Wie groß sind Schleifenimpedanz $Z_S$ und Fehlerstrom $I_k$ bei einem satten Körperschluss?
3. Ist die Abschaltbedingung erfüllt? Der B16 schaltet ab 80 A sicher magnetisch ab.
4. Wie lang dürfte die Leitung (Außenleiter und Schutzleiter gleich lang) höchstens sein?
5. Welche Spannung liegt während des Fehlers zwischen Gehäuse und Haupterdungsschiene?

:::lösung
1. $R_L = R_{PE} = \dfrac{0{,}0178 \cdot 18}{2{,}5}\,\Omega = 0{,}128\,\Omega$
2. $Z_S = 0{,}30\,\Omega + 2 \cdot 0{,}128\,\Omega = 0{,}556\,\Omega$; $I_k = \dfrac{230\,\text{V}}{0{,}556\,\Omega} \approx 414\,\text{A}$
3. Ja: $Z_S \cdot I_a = 0{,}556\,\Omega \cdot 80\,\text{A} = 44{,}5\,\text{V} \le 230\,\text{V}$. Der LS löst in rund 10 ms aus.
4. $Z_{S,\max} = \dfrac{230\,\text{V}}{80\,\text{A}} = 2{,}875\,\Omega$; $l_\max = \dfrac{2{,}875 - 0{,}30}{2 \cdot 0{,}0178 / 2{,}5}\,\text{m} \approx 181\,\text{m}$ – in der Praxis wegen Erwärmung und Spannungsfall deutlich weniger.
5. $U = I_k \cdot R_{PE} = 414\,\text{A} \cdot 0{,}128\,\Omega \approx 53\,\text{V}$ – nur für etwa 10 ms.
:::

## Aufgabe 2 – Körperschluss im TT-System

Ein Heizlüfter ist über einen Staberder mit $R_A = 30\,\Omega$ geerdet, der Betriebserder am Trafo hat $R_B = 2\,\Omega$. Leitungs- und Netzwiderstände sind gegenüber den Erdern klein.

1. Wie groß ist der Fehlerstrom bei einem Körperschluss?
2. Löst ein B16 aus? Begründe.
3. Welche Spannung liegt dauerhaft am Gehäuse gegen Erde?
4. Ist die Bedingung mit einem 30-mA-FI erfüllt? Wie groß darf $R_A$ mit 30 mA und mit 300 mA höchstens sein?

:::lösung
1. $I_F = \dfrac{230\,\text{V}}{30\,\Omega + 2\,\Omega} \approx 7{,}2\,\text{A}$
2. Nein. Der magnetische Auslöser braucht 80 A, der thermische spricht erst ab etwa $1{,}13 \cdot 16\,\text{A} = 18\,\text{A}$ an.
3. $U = I_F \cdot R_A = 7{,}2\,\text{A} \cdot 30\,\Omega \approx 216\,\text{V}$ – lebensgefährlich und ohne Abschaltung.
4. $R_A \cdot I_{\Delta n} = 30\,\Omega \cdot 0{,}03\,\text{A} = 0{,}9\,\text{V} \le 50\,\text{V}$ – erfüllt. $R_{A,\max} = \dfrac{50\,\text{V}}{0{,}03\,\text{A}} \approx 1667\,\Omega$ bzw. $\dfrac{50\,\text{V}}{0{,}3\,\text{A}} \approx 167\,\Omega$.
:::

## Aufgabe 3 – Klassische Nullung und PEN-Bruch

In einer Altanlage (TN-C) ist der Schutzkontakt der Steckdose mit dem PEN gebrückt. Eine Waschmaschine (2200 W) läuft, eine Person berührt das Gehäuse (Körperwiderstand 1000 Ω, Standort 200 Ω). Dann reißt der PEN zwischen Verteiler und Steckdose.

1. Welchen Widerstand hat die Waschmaschine?
2. Wie groß ist der Körperstrom nach dem PEN-Bruch?
3. Warum löst keine Sicherung aus?
4. In welchem Bereich nach IEC 60479-1 liegt der Strom, wenn er länger als eine Sekunde fließt?

:::lösung
1. $R = \dfrac{U^2}{P} = \dfrac{(230\,\text{V})^2}{2200\,\text{W}} \approx 24\,\Omega$
2. $I_K = \dfrac{230\,\text{V}}{24\,\Omega + 1000\,\Omega + 200\,\Omega} \approx 188\,\text{mA}$
3. Der Strom fließt durch die Waschmaschine und die Person – er ist viel kleiner als der Bemessungsstrom der Sicherung. Einen FI gibt es in der TN-C-Altanlage nicht (er würde mit PEN auch nicht funktionieren).
4. AC-4: Herzkammerflimmern möglich – Lebensgefahr.
:::

## Aufgabe 4 – Neutralleiterbruch

An L1 hängt ein Heizlüfter mit 2000 W, an L2 eine Lampe mit 60 W, an L3 nichts. Der gemeinsame N bricht.

1. Berechne die Widerstände beider Verbraucher.
2. Wie sind die Verbraucher jetzt geschaltet, und an welcher Spannung liegen sie?
3. Welche Spannung bekommt die Lampe, welche der Heizlüfter?

:::lösung
1. $R_H = \dfrac{(230\,\text{V})^2}{2000\,\text{W}} \approx 26{,}5\,\Omega$; $R_L = \dfrac{(230\,\text{V})^2}{60\,\text{W}} \approx 882\,\Omega$
2. In Reihe zwischen L1 und L2, also an der Außenleiterspannung 400 V.
3. $I = \dfrac{400\,\text{V}}{26{,}5\,\Omega + 882\,\Omega} \approx 0{,}44\,\text{A}$; $U_L = 0{,}44\,\text{A} \cdot 882\,\Omega \approx 388\,\text{V}$ – die Lampe brennt durch; $U_H \approx 12\,\text{V}$.
:::
