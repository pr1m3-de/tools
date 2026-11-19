---
titel: Kleintransformatoren und Messwandler
stufe: mittel
beschreibung: Steuer-, Klingel-, Trenn- und Sicherheitstransformator, Spartransformator, Strom- und Spannungswandler mit Bürde und Durchfädeln.
---
# Kleintransformatoren und Messwandler

Name: ___  Datum: ___

Benötigte Formeln: $\ddot{u} = \dfrac{U_1}{U_2} = \dfrac{N_1}{N_2} = \dfrac{I_2}{I_1}$, Stromwandler $I_1 \cdot N_1 = I_2 \cdot N_2$, Bürde $S = I_2^2 \cdot R$, Spannungswandler $R_\text{min} = \dfrac{U_\text{2N}^2}{S_\text{N}}$, Spartransformator $S_\text{B} = S_\text{D} \cdot \left(1 - \dfrac{U_2}{U_1}\right)$, $R_\text{L} = \dfrac{2 \cdot l}{\gamma \cdot A}$ mit $\gamma = 56\ \tfrac{\text{m}}{\Omega \cdot \text{mm}^2}$

Verluste bleiben unberücksichtigt, wenn nichts anderes angegeben ist.

## Aufgabe 1 – Niedervoltlampe

Eine Halogenlampe 12 V/50 W wird über einen Transformator an 230 V betrieben. Die Eingangswicklung hat 690 Windungen.

1. Berechne das Übersetzungsverhältnis und die Windungszahl der Ausgangswicklung.
2. Welche Ströme fließen in beiden Wicklungen?

:::lösung
1. $\ddot{u} = \dfrac{230\ \text{V}}{12\ \text{V}} = 19{,}2$, $N_2 = \dfrac{N_1}{\ddot{u}} = \dfrac{690}{19{,}17} = 36$
2. $I_2 = \dfrac{50\ \text{W}}{12\ \text{V}} = 4{,}17\ \text{A}$, $I_1 = \dfrac{50\ \text{W}}{230\ \text{V}} = 0{,}217\ \text{A}$
:::

## Aufgabe 2 – Klingeltransformator mit Anzapfung

Ein Klingeltransformator an 230 V liefert 3 V, 5 V und 8 V. Die gesamte Ausgangswicklung (8 V) hat 96 Windungen.

1. Berechne die Übersetzungsverhältnisse für alle drei Spannungen.
2. Wie viele Windungen hat die Eingangswicklung?
3. Nach wie vielen Windungen liegen die Anzapfungen für 3 V und 5 V?
4. Welche Höchstwerte gelten für die Ausgangsspannung eines Klingeltransformators?

:::lösung
1. $\ddot{u}_8 = \dfrac{230}{8} = 28{,}75$, $\ddot{u}_5 = 46$, $\ddot{u}_3 = 76{,}7$
2. $N_1 = 28{,}75 \cdot 96 = 2\,760$
3. $N_3 = \dfrac{2\,760}{76{,}7} = 36$, $N_5 = \dfrac{2\,760}{46} = 60$ – also bei 36 und 60 Windungen.
4. Höchstens 24 V, im Leerlauf höchstens 33 V (DIN EN 61558-2-8); der Transformator muss kurzschlussfest sein.
:::

## Aufgabe 3 – Trenntransformator im Leerlauf

Bei einem Trenntransformator 230 V/230 V, 200 VA steigt die Ausgangsspannung im Leerlauf um 6 %.

1. Berechne das Übersetzungsverhältnis bei Bemessungslast und im Leerlauf.
2. Wozu dient ein Trenntransformator? Warum darf der Ausgang nicht geerdet werden?

:::lösung
1. Bemessungslast: $\ddot{u} = \dfrac{230\ \text{V}}{230\ \text{V}} = 1$. Leerlauf: $U_{20} = 230\ \text{V} \cdot 1{,}06 = 243{,}8\ \text{V}$, $\ddot{u} = \dfrac{230}{243{,}8} = 0{,}943$
2. Schutztrennung: Der Ausgangsstromkreis hat keine Verbindung zur Erde. Berührt man einen Außenleiter, schließt sich kein Stromkreis über den Körper. Eine Erdung würde genau diesen Schutz aufheben.
:::

## Aufgabe 4 – Schutzkleinspannung im Kessel

Für Arbeiten in einem Kessel wird eine Handleuchte 24 V/60 W über einen Sicherheitstransformator 230 V/24 V, 100 VA betrieben.

1. Berechne die Ströme in Ausgangs- und Eingangswicklung.
2. Warum darf hier kein Spartransformator verwendet werden?
3. Welche Spannung darf ein Sicherheitstransformator höchstens abgeben?

:::lösung
1. $I_2 = \dfrac{60\ \text{W}}{24\ \text{V}} = 2{,}5\ \text{A}$, $I_1 = \dfrac{60\ \text{W}}{230\ \text{V}} = 0{,}261\ \text{A}$
2. Der Spartransformator hat keine galvanische Trennung: Bei einem Fehler läge die Netzspannung an der Leuchte.
3. 50 V Wechselspannung (SELV/PELV); in engen leitfähigen Räumen gelten oft niedrigere Werte.
:::

## Aufgabe 5 – Arten von Kleintransformatoren

1. Was unterscheidet einen nicht kurzschlussfesten von einem unbedingt kurzschlussfesten Transformator?
2. Was bedeutet „fail-safe“?
3. Nenne zwei Anwendungen für Streufeldtransformatoren und erkläre, warum sie kurzschlussfest sind.

:::lösung
1. Nicht kurzschlussfest: braucht eine vorgeschaltete Schutzeinrichtung gegen Kurzschluss und Überlast. Unbedingt kurzschlussfest: der innere Widerstand begrenzt den Kurzschlussstrom so, dass nichts passiert – keine Absicherung nötig.
2. Bei Überlastung fällt der Transformator bleibend aus, ohne gefährlich zu werden.
3. Schweißtransformator, Zündtransformator (auch Klingeltransformator). Das Streujoch lenkt einen Teil des Flusses an der Ausgangswicklung vorbei; der hohe innere Widerstand begrenzt den Strom bei Kurzschluss.
:::

## Aufgabe 6 – Spartransformator

Ein Spartransformator senkt 230 V auf 207 V ab und versorgt einen Verbraucher mit 1,5 kVA.

1. Berechne die Bauleistung.
2. Nenne einen Vorteil und einen Nachteil gegenüber einem Transformator mit getrennten Wicklungen.

:::lösung
1. $S_\text{B} = 1\,500\ \text{VA} \cdot \left(1 - \dfrac{207\ \text{V}}{230\ \text{V}}\right) = 150\ \text{VA}$ – der Transformator ist nur ein Zehntel so groß.
2. Vorteil: klein, leicht, günstig, geringe Verluste. Nachteil: keine galvanische Trennung, nicht für Schutzkleinspannung oder Schutztrennung.
:::

## Aufgabe 7 – Spannungswandler

Ein 20-kV-Netz wird über einen Spannungswandler 20 000 V/100 V, 30 VA, Klasse 0,5 gemessen.

1. Berechne die Übersetzung, den größten zulässigen Sekundärstrom und den kleinsten Belastungswiderstand.
2. Warum wird der Spannungswandler sekundär abgesichert, der Stromwandler aber nicht?

:::lösung
1. $\ddot{u} = 200$, $I_2 = \dfrac{30\ \text{VA}}{100\ \text{V}} = 0{,}3\ \text{A}$, $R_\text{min} = \dfrac{(100\ \text{V})^2}{30\ \text{VA}} = 333\ \Omega$
2. Ein Spannungswandler arbeitet fast im Leerlauf; ein Kurzschluss auf der Sekundärseite ließe einen sehr hohen Strom fließen und zerstört ihn. Ein Stromwandler arbeitet fast im Kurzschluss; eine auslösende Sicherung würde den Sekundärkreis öffnen – gefährliche Überspannung und Zerstörung.
:::

## Aufgabe 8 – Stromwandler mit Messleitung

Ein Stromwandler 150 A/5 A, 10 VA, Klasse 1 speist über eine 15 m lange Kupferleitung mit 2,5 mm² einen Strommesser mit 2 VA Eigenverbrauch.

1. Berechne die Übersetzung und den größten zulässigen Bürdenwiderstand.
2. Berechne die Bürde der Messleitung und die gesamte Bürde. Ist die Anlage zulässig?
3. Welcher Strom fließt im Messgerät bei 120 A Primärstrom?

:::lösung
1. $K_\text{N} = 30$, $R_\text{max} = \dfrac{10\ \text{VA}}{(5\ \text{A})^2} = 0{,}4\ \Omega$
2. $R_\text{L} = \dfrac{2 \cdot 15\ \text{m}}{56 \cdot 2{,}5\ \text{mm}^2}\ \Omega = 0{,}214\ \Omega$, $S_\text{L} = (5\ \text{A})^2 \cdot 0{,}214\ \Omega = 5{,}36\ \text{VA}$, $S = 2 + 5{,}36 = 7{,}36\ \text{VA} \le 10\ \text{VA}$ ✓
3. $I_2 = \dfrac{120\ \text{A}}{30} = 4\ \text{A}$
:::

## Aufgabe 9 – Zangenstromwandler und Durchfädeln

1. Ein Zangenstromwandler trägt die Aufschrift 100 A/5 A. Wie viele Windungen hat die Ausgangswicklung?
2. Der Nennstrom eines Motors (22 A) soll mit einem Durchsteckwandler 60 A/5 A gemessen werden. Der Strommesser hat die Messbereiche 0,5 A, 2,5 A und 5 A. Welcher Bereich passt, wenn der Leiter einmal bzw. zweimal durch den Wandler geführt wird?
3. Was passiert, wenn man das Messgerät bei laufendem Motor abklemmt?

:::lösung
1. Primär ein Durchgang: $N_2 = \dfrac{100\ \text{A} \cdot 1}{5\ \text{A}} = 20$
2. Einmal: $I_2 = \dfrac{22\ \text{A}}{12} = 1{,}83\ \text{A}$ → Bereich 2,5 A. Zweimal: wirksam 30 A/5 A, $I_2 = \dfrac{22\ \text{A}}{6} = 3{,}67\ \text{A}$ → Bereich 5 A; die Anzeige liegt höher im Bereich und ist genauer.
3. Der Sekundärkreis ist offen: Der Primärstrom magnetisiert den Kern bis in die Sättigung, an den Klemmen entstehen gefährlich hohe Spannungsspitzen, der Wandler wird heiß. Vorher S1 und S2 kurzschließen!
:::

Nachrechnen: [Kleintransformatoren und Messwandler](../../../elektro/kleintransformatoren.html).
