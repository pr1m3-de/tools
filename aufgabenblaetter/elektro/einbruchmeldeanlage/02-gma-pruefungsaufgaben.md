---
titel: Gefahrenmeldeanlagen – Prüfungsaufgaben
stufe: schwer
beschreibung: Rechnen an der Meldelinie (Spannungsteiler, zwei Brückenschaltungen), Neutralleiterunterbrechung, Melderanzahl, Melderwahl, Glasbruchmelder-Schaltungen und Alarmierung – im Stil der Abschlussprüfungen.
---
# Gefahrenmeldeanlagen – Prüfungsaufgaben

Name: ___  Datum: ___

Benötigte Formeln: Spannungsteiler $U_2 = U \cdot \dfrac{R_2}{R_1 + R_2}$, Brückenspannung $U_\text{AB} = U \cdot \left(\dfrac{R_2}{R_1 + R_2} - \dfrac{R_4}{R_3 + R_4}\right)$, Abgleich $R_1 \cdot R_4 = R_2 \cdot R_3$, $R = \dfrac{U^2}{P}$, Melderanzahl $n \ge \left\lceil \dfrac{A}{A_\text{max}} \right\rceil$

## Aufgabe 1 – Meldelinie mit Vorwiderstand

Eine Zentrale mit eigener Versorgung (12 V) speist über einen Vorwiderstand von 2,2 kΩ eine Meldelinie. Am Ende der Linie sitzt ein Abschlusswiderstand von 2,2 kΩ. In der Linie liegt ein Ruhekontakt S1 (in Reihe) und ein Arbeitskontakt S2 (parallel zum Abschlusswiderstand). Gemessen wird die Spannung $U_\text{Z}$ an den Klemmen der Linie.

1. Welche Spannung misst die Zentrale in Ruhe?
2. Welche Spannung liegt an, wenn S1 öffnet?
3. Durch Sabotage wird bei geschlossenem S1 der Arbeitskontakt S2 betätigt. Welche Spannung misst die Zentrale, und welcher Strom fließt durch S1?
4. S2 soll durch ein Reed-Relais mit Öffner ersetzt werden. Wie wirkt ein Reed-Relais?

:::lösung
1. $U_\text{Z} = 12\ \text{V} \cdot \dfrac{2{,}2\ \text{k}\Omega}{4{,}4\ \text{k}\Omega} = 6\ \text{V}$
2. Kein Strom, kein Spannungsfall am Vorwiderstand: $U_\text{Z} = 12\ \text{V}$
3. S2 schließt den Abschlusswiderstand kurz: $U_\text{Z} = 0\ \text{V}$, $I = \dfrac{12\ \text{V}}{2{,}2\ \text{k}\Omega} = 5{,}45\ \text{mA}$
4. Zwei Kontaktzungen in einem Glasröhrchen schalten, wenn ein Magnetfeld (Dauermagnet oder Spule) einwirkt; beim Öffner trennt das Magnetfeld die Zungen.
:::

## Aufgabe 2 – Brückenschaltung (1)

Eine Meldeanlage arbeitet mit einer Brücke: links $R_1 = R_2 = 1{,}5\ \text{k}\Omega$, rechts oben die Meldekontakte mit dem Abschlusswiderstand $R_3 = 680\ \Omega$ (zwischen C und B), rechts unten der einstellbare $R_4$. $U = 24\ \text{V}$.

1. Auf welchen Wert muss $R_4$ eingestellt werden, damit die Brücke abgeglichen ist?
2. Welche Spannung $U_\text{AB}$ liegt im ungestörten Fall an?
3. Wie ändert sich $U_\text{AB}$, wenn ein Meldekontakt auslöst?
4. Ein Einbrecher überbrückt die Punkte B und C. Warum führt das ebenfalls zum Alarm?

:::lösung
1. $R_4 = \dfrac{R_2 \cdot R_3}{R_1} = 680\ \Omega$
2. $U_\text{AB} = 0\ \text{V}$
3. Der Zweig rechts ist unterbrochen, Punkt B liegt auf 0 V: $U_\text{AB} = 24\ \text{V} \cdot \dfrac{1{,}5}{3} = 12\ \text{V}$
4. Mit $R_3 = 0$ liegt B auf 24 V: $U_\text{AB} = 12\ \text{V} - 24\ \text{V} = -12\ \text{V}$. Jede Abweichung vom Abgleich wird ausgewertet – ob die Linie geöffnet oder überbrückt wird.
:::

## Aufgabe 3 – Brückenschaltung (2)

In einer Meldezentrale liegt an 12 V eine Brücke: linker Zweig 60 Ω oben und 80 Ω unten, rechter Zweig oben ein einstellbarer Widerstand $R_\text{E}$ (0 bis 500 Ω), unten die Meldelinie mit zwei Magnetkontakten (Öffner, in Reihe) und dem Abschlusswiderstand 30 Ω. Parallel zum Abschlusswiderstand liegen zwei Glasbruchmelder mit Schließern.

1. Um welche Melder handelt es sich bei den Kontakten in Reihe und bei denen parallel? Nenne je einen Anwendungsfall.
2. Wozu dient der Widerstand am Ende der Linie?
3. Berechne die Spannung $U_\text{v}$ am Verstärker (zwischen den Brückenmitten) für $R_\text{E} = 40\ \Omega$ in Ruhe.
4. Auf welchen Wert muss $R_\text{E}$ eingestellt werden, damit $U_\text{v} = 0\ \text{V}$ ist?

:::lösung
1. In Reihe: Magnetkontakte (Öffner, Ruhestrom) an Türen und Fenstern. Parallel: Glasbruchmelder (Schließer, Arbeitsstrom) an Scheiben – sie schließen den Abschlusswiderstand im Alarmfall kurz.
2. Er legt den Ruhewert fest; so erkennt die Zentrale Unterbrechung und Kurzschluss gleichermaßen.
3. Links: $12\ \text{V} \cdot \dfrac{80}{140} = 6{,}86\ \text{V}$. Rechts: $12\ \text{V} \cdot \dfrac{30}{40 + 30} = 5{,}14\ \text{V}$. $U_\text{v} = 6{,}86\ \text{V} - 5{,}14\ \text{V} = 1{,}71\ \text{V}$
4. $\dfrac{R_\text{E}}{30\ \Omega} = \dfrac{60\ \Omega}{80\ \Omega} \Rightarrow R_\text{E} = 22{,}5\ \Omega$
:::

## Aufgabe 4 – Brandursache Neutralleiterunterbrechung

In einer alten Villa sind ein Gerät 230 V/100 W an L1 und ein Gerät 230 V/2 kW an L3 angeschlossen (400/230 V). Der gemeinsame Neutralleiter wird unterbrochen.

1. Erkläre, was dabei geschieht.
2. Berechne die Spannungen an beiden Geräten.
3. Beurteile, wo ein Brand entstehen kann.

:::lösung
1. Beide Geräte liegen jetzt in Reihe an der Außenleiterspannung 400 V; die Spannung teilt sich im Verhältnis der Widerstände auf.
2. $R_1 = \dfrac{(230\ \text{V})^2}{100\ \text{W}} = 529\ \Omega$, $R_2 = \dfrac{(230\ \text{V})^2}{2\,000\ \text{W}} = 26{,}5\ \Omega$, $I = \dfrac{400\ \text{V}}{555{,}5\ \Omega} = 0{,}72\ \text{A}$, $U_1 = 0{,}72\ \text{A} \cdot 529\ \Omega = 381\ \text{V}$, $U_2 = 19\ \text{V}$
3. Am kleinen Gerät liegen 381 V statt 230 V; es nimmt etwa 274 W statt 100 W auf und überhitzt – Brandgefahr. Das große Gerät bekommt fast keine Spannung.
:::

## Aufgabe 5 – Anzahl der Brandmelder

Tabelle (DIN VDE 0833-2, Auszug, Dachneigung bis 20°):

| Grundfläche | Melder | Raumhöhe | $A_\text{max}$ | $D_\text{H}$ |
|---|---|---|---|---|
| bis 80 m² | Rauchmelder | bis 12 m | 80 m² | 6,6 m |
| über 80 m² | Rauchmelder | bis 6 m | 60 m² | 5,7 m |
| bis 30 m² | Wärmemelder | bis 6 m | 30 m² | 4,4 m |
| über 30 m² | Wärmemelder | bis 6 m | 20 m² | 3,5 m |

1. Ein Verkaufsraum ist 22 m lang, 15 m breit und 4 m hoch, die Decke 10° geneigt. Wie viele Rauchmelder sind mindestens nötig?
2. In der Werkstatt einer Schreinerei (16,5 m × 9,0 m, 2,8 m hoch, flache Decke) ist trotz Absaugung viel Holzstaub in der Luft. Wähle die Melderart und bestimme die Anzahl.
3. Was bedeutet $D_\text{H}$?

:::lösung
1. $A = 330\ \text{m}^2 > 80\ \text{m}^2$, Höhe bis 6 m: $A_\text{max} = 60\ \text{m}^2$; $n = \lceil 330 / 60 \rceil = \lceil 5{,}5 \rceil = 6$
2. Holzstaub würde Rauchmelder täuschen – Wärmemelder. $A = 148{,}5\ \text{m}^2 > 30\ \text{m}^2$: $A_\text{max} = 20\ \text{m}^2$, $n = \lceil 7{,}4 \rceil = 8$
3. Größter waagerechter Abstand von einem beliebigen Punkt der Decke zum nächsten Melder. Neben der Anzahl muss also auch die Verteilung stimmen.
:::

## Aufgabe 6 – Melderwahl

1. In einer Werkstatt wird geschweißt und es entsteht Rauch. Im Lager liegen in raumhohen Regalen Ersatzteile, Verpackung und Gummireifen. Wähle für beide Räume eine Melderart und begründe.
2. Im Bereich der Anlieferung fahren Transporter mit laufendem Motor. Welche Melderart passt dort?
3. Erkläre das Streulichtprinzip.

:::lösung
1. Werkstatt: Wärmemelder (Thermomaximal oder Differential mit Maximalstufe) – Rauch würde optische Melder täuschen, Lichtbögen beim Schweißen UV-Flammenmelder. Lager: optische Rauch- oder Mehrkriterienmelder, die Schwelbrände von Verpackung und Gummi früh erkennen; bei hohen Regalen zusätzlich Melder in den Regalen oder ein Rauchansaugsystem.
2. Abgase und Rauch: Wärmemelder.
3. In der dunklen Messkammer trifft das Licht einer Leuchtdiode die Fotodiode normalerweise nicht. Rauchteilchen streuen das Licht auf die Fotodiode – Alarm.
:::

## Aufgabe 7 – Glasbruchmelder verschalten

Die Glasbruchmelder eines Raums bilden eine Meldergruppe mit Abschlusswiderstand. Bei der Kontrolle findest du zwei Varianten:

- Variante 1: Die Ruhekontakte der Melder liegen in Reihe, der Abschlusswiderstand am Ende der Linie.
- Variante 2: Die Ruhekontakte der Melder liegen parallel zueinander, der Abschlusswiderstand in Reihe vor der Gruppe.

1. Analysiere die Funktionsweise beider Varianten. Welche ist falsch?
2. Woran erkennt man im Alarmfall den auslösenden Glasbruchmelder?

:::lösung
1. Variante 1 ist richtig: Öffnet ein Kontakt oder reißt der Draht, ist die Linie unterbrochen – Alarm. Variante 2 ist falsch: Öffnet ein Melder, fließt der Strom über die anderen parallelen Kontakte weiter – die Zentrale merkt nichts; Alarm käme erst, wenn alle gleichzeitig öffnen.
2. An der Zentrale nur an der Meldergruppe; der einzelne Melder zeigt es mit seiner Alarm-LED (Alarmspeicher) an.
:::

## Aufgabe 8 – Alarmierung und Vorschriften

1. Nenne drei Arten der Alarmierung und je ein Beispiel.
2. Welche Besonderheit schreibt der VdS für die Energieversorgung vor?
3. Darf jede Elektrofachkraft eine Brandmeldeanlage planen und errichten?

:::lösung
1. Internalarm (Summer, Anzeige, Hausalarm), Externalarm (Sirene und Blitzleuchte außen), Fernalarm (still über Übertragungsgerät an Leitstelle oder Wachdienst).
2. Zwei voneinander unabhängige Energiequellen (Netz und Akku), der Akku mit ausreichender Überbrückungszeit für Ruhe und anschließenden Alarm.
3. Nein. Planung, Errichtung und Inbetriebnahme verlangen eine nach DIN 14675 zertifizierte Fachfirma; Elektrofachkräfte können unter deren Verantwortung mitarbeiten.
:::

Rechnen und simulieren: [Einbruchmeldeanlage](../../../elektro/einbruchmeldeanlage.html), [Brandmeldeanlage](../../../brandschutz/brandmeldeanlage.html).
