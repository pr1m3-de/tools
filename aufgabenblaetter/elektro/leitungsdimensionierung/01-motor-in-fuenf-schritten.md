---
titel: Leitungsdimensionierung in fünf Schritten – Drehstrommotor
stufe: mittel
beschreibung: Ein Beispiel von vorn bis hinten: Betriebsstrom, Umrechnungsfaktoren, Querschnitt, LS-Schalter und Spannungsfall für einen Motor, dazu eine Beleuchtungsanlage zum Selbstrechnen.
---
# Leitungsdimensionierung in fünf Schritten

Name: ___  Datum: ___

**Ausgangslage:** Ein Drehstrommotor (400 V, 5,5 kW, $\cos\varphi = 0{,}85$) soll an eine 30 m entfernte Steckdose angeschlossen werden. Die Mantelleitung (Kupfer, PVC) liegt in einem Rohr auf Putz (Verlegeart B2), die Umgebungstemperatur beträgt 30 °C, keine anderen Stromkreise im Rohr.

Benötigte Formeln (Tabellenbuch): $I_\text{b} = \dfrac{P}{\sqrt{3} \cdot U \cdot \cos\varphi}$ (Drehstrom), $I_\text{b} = \dfrac{P}{U \cdot \cos\varphi}$ (Wechselstrom), $I_\text{z} = I_\text{r} \cdot f_1 \cdot f_2 \cdot f_3$, $I_\text{b} \le I_\text{n} \le I_\text{z}$, $\Delta U = \dfrac{\sqrt{3} \cdot I \cdot l \cdot \cos\varphi}{\gamma \cdot A}$ (Drehstrom), $\Delta U = \dfrac{2 \cdot I \cdot l \cdot \cos\varphi}{\gamma \cdot A}$ (Wechselstrom), $\gamma_\text{Cu} = 56\ \tfrac{\text{m}}{\Omega \cdot \text{mm}^2}$

Auszug aus den Tabellen (DIN VDE 0298-4, Kupfer, PVC, 30 °C):

| Querschnitt | B1, 2 belastete Adern | B2, 3 belastete Adern |
|---|---:|---:|
| 1,5 mm² | 17,5 A | 15 A |
| 2,5 mm² | 24 A | 20 A |
| 4 mm² | 32 A | 27 A |
| 6 mm² | 41 A | 34 A |

| Umgebungstemperatur | 25 °C | 30 °C | 35 °C | 40 °C | 45 °C |
|---|---:|---:|---:|---:|---:|
| $f_1$ | 1,06 | 1,00 | 0,94 | 0,87 | 0,79 |

| Stromkreise gebündelt | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---:|---:|---:|---:|---:|---:|
| $f_2$ | 1,00 | 0,80 | 0,70 | 0,65 | 0,60 | 0,57 |

## Aufgabe 1 – Betriebsstrom

Berechne den Betriebsstrom $I_\text{b}$ des Motors.

:::tipp
Drehstrom: $\sqrt{3} \approx 1{,}732$ im Nenner nicht vergessen. Ist kein $\cos\varphi$ angegeben, rechnet man mit 1.
:::

:::lösung
$I_\text{b} = \dfrac{P}{\sqrt{3} \cdot U \cdot \cos\varphi} = \dfrac{5\,500\ \text{W}}{\sqrt{3} \cdot 400\ \text{V} \cdot 0{,}85} = \dfrac{5\,500\ \text{W}}{588{,}9\ \text{V}} \approx 9{,}34\ \text{A}$
:::

:::hinweis
Auf einem echten Typenschild ist die Leistung eines Motors die **abgegebene** Leistung an der Welle. Aufgenommen wird mehr: $P = \dfrac{P_\text{ab}}{\eta}$. Mit $\eta = 0{,}87$ wären es 6,32 kW und $I_\text{b} \approx 10{,}7\ \text{A}$. Am besten steht der Bemessungsstrom direkt auf dem Typenschild.
:::

## Aufgabe 2 – Umrechnungsfaktoren

1. Bestimme $f_1$ (Umgebungstemperatur), $f_2$ (Häufung) und $f_3$ (Kabelwannen und -pritschen) für die Ausgangslage.
2. Welche Faktoren gelten, wenn es 40 °C warm ist und 5 Stromkreise im selben Rohr liegen?

:::lösung
1. 30 °C ist die Bezugstemperatur der Tabelle: $f_1 = 1{,}00$. Nur ein Stromkreis im Rohr: $f_2 = 1{,}00$. Keine Kabelwanne: $f_3 = 1{,}00$.
2. 40 °C: $f_1 = 0{,}87$. 5 Stromkreise gebündelt: $f_2 = 0{,}60$ (0,70 gilt erst für 3 Stromkreise). $f_3 = 1{,}00$.
:::

## Aufgabe 3 – Querschnitt und LS-Schalter

1. Prüfe, ob 1,5 mm² mit einem LS-Schalter C13 die Bedingung $I_\text{b} \le I_\text{n} \le I_\text{z}$ erfüllt.
2. Der Motor zieht beim Anlauf etwa das 6- bis 8-Fache seines Stroms. Ein LS-Schalter Typ C löst ab dem 5- bis 10-Fachen von $I_\text{n}$ sofort aus. Warum ist C16 die bessere Wahl als C13?
3. Welcher Querschnitt ist für C16 nötig?

:::tipp
Erst den Schutz wählen, dann den Querschnitt so, dass $I_\text{z} \ge I_\text{n}$ ist.
:::

:::lösung
1. B2, 3 belastete Adern, 1,5 mm²: $I_\text{z} = 15\ \text{A} \cdot 1{,}00 \cdot 1{,}00 \cdot 1{,}00 = 15\ \text{A}$. $9{,}34\ \text{A} \le 13\ \text{A} \le 15\ \text{A}$ – die Bedingung ist **erfüllt**.
2. Anlaufstrom $\approx 6 \ldots 8 \cdot 9{,}34\ \text{A} = 56 \ldots 75\ \text{A}$. C13 löst sicher ab $10 \cdot 13\ \text{A} = 130\ \text{A}$ aus, kann aber schon ab $5 \cdot 13\ \text{A} = 65\ \text{A}$ auslösen – mitten im Anlaufstrom. C16 löst frühestens bei $5 \cdot 16\ \text{A} = 80\ \text{A}$ aus und lässt den Anlauf sicher durch.
3. Mit $I_\text{n} = 16\ \text{A}$ reicht 1,5 mm² (15 A) nicht mehr. 2,5 mm²: $I_\text{z} = 20\ \text{A}$, $9{,}34\ \text{A} \le 16\ \text{A} \le 20\ \text{A}$ ✓. **Gewählt: 2,5 mm² mit C16** (NYM-J 5 × 2,5 mm²).
:::

## Aufgabe 4 – Ungünstige Bedingungen

Die Leitung aus Aufgabe 3 (2,5 mm², C16) liegt nun bei 40 °C mit 5 Stromkreisen im selben Rohr (Faktoren aus Aufgabe 2).

1. Berechne die korrigierte Strombelastbarkeit $I_\text{z}$.
2. Reicht 2,5 mm² noch? Welcher Querschnitt ist nötig?

:::lösung
1. $I_\text{z} = I_\text{r} \cdot f_1 \cdot f_2 \cdot f_3 = 20\ \text{A} \cdot 0{,}87 \cdot 0{,}60 \cdot 1{,}00 = 10{,}4\ \text{A}$
2. $10{,}4\ \text{A}$ ist zwar größer als $I_\text{b} = 9{,}34\ \text{A}$, aber kleiner als $I_\text{n} = 16\ \text{A}$ – **nicht zulässig**, die Leitung wäre nicht vor Überlast geschützt.

| Querschnitt | $I_\text{r}$ | $I_\text{z} = I_\text{r} \cdot 0{,}522$ | $I_\text{z} \ge 16\ \text{A}$? |
|---|---:|---:|---|
| 2,5 mm² | 20 A | 10,4 A | nein |
| 4 mm² | 27 A | 14,1 A | nein |
| 6 mm² | 34 A | 17,7 A | ja |

Nötig sind **6 mm²** – die Umrechnungsfaktoren halbieren hier fast die Belastbarkeit.
:::

## Aufgabe 5 – Spannungsfall

1. Berechne den Spannungsfall für die Ausgangslage (2,5 mm², 30 m) in Volt und Prozent.
2. Wie groß wäre er bei 50 m Leitungslänge?
3. Sind beide Werte zulässig, wenn höchstens 3 % erlaubt sind?

:::lösung
1. $\Delta U = \dfrac{\sqrt{3} \cdot I_\text{b} \cdot l \cdot \cos\varphi}{\gamma \cdot A} = \dfrac{\sqrt{3} \cdot 9{,}34\ \text{A} \cdot 30\ \text{m} \cdot 0{,}85}{56\ \tfrac{\text{m}}{\Omega \cdot \text{mm}^2} \cdot 2{,}5\ \text{mm}^2} = \dfrac{412{,}5}{140}\ \text{V} \approx 2{,}95\ \text{V}$, $\Delta u = \dfrac{2{,}95\ \text{V}}{400\ \text{V}} \cdot 100\ \% \approx 0{,}74\ \%$
2. $\Delta U = \dfrac{\sqrt{3} \cdot 9{,}34 \cdot 50 \cdot 0{,}85}{56 \cdot 2{,}5}\ \text{V} = \dfrac{687{,}5}{140}\ \text{V} \approx 4{,}91\ \text{V}$, $\Delta u \approx 1{,}23\ \%$
3. Ja, beide liegen unter 3 %. Der Spannungsfall wächst genau mit der Länge: doppelte Länge, doppelter Spannungsfall.
:::

## Aufgabe 6 – Zum Selbstrechnen: Beleuchtungsanlage

Eine Beleuchtungsanlage (230 V, 3 kW, ohmsch) wird über eine 25 m lange Leitung versorgt: Aderleitungen im Rohr (Verlegeart B1), Kupfer, PVC, 35 °C, keine weiteren Stromkreise im Rohr. Zulässiger Spannungsfall: 3 %.

1. Berechne den Betriebsstrom $I_\text{b}$.
2. Bestimme die Umrechnungsfaktoren.
3. Wähle LS-Schalter und Querschnitt nach der Belastbarkeit.
4. Berechne den Spannungsfall. Ist er zulässig?
5. Welcher Querschnitt wird am Ende verlegt?

:::lösung
1. $I_\text{b} = \dfrac{P}{U} = \dfrac{3\,000\ \text{W}}{230\ \text{V}} \approx 13{,}0\ \text{A}$ (ohmsch: $\cos\varphi = 1$)
2. $f_1 = 0{,}94$ (35 °C), $f_2 = 1{,}00$, $f_3 = 1{,}00$
3. Nächster LS-Schalter über 13,0 A: **B16** (ohmsche Last → Typ B). 1,5 mm², B1, 2 belastete Adern: $I_\text{z} = 17{,}5\ \text{A} \cdot 0{,}94 = 16{,}5\ \text{A}$; $13{,}0 \le 16 \le 16{,}5$ ✓
4. $\Delta U = \dfrac{2 \cdot 13{,}0\ \text{A} \cdot 25\ \text{m} \cdot 1}{56 \cdot 1{,}5}\ \text{V} \approx 7{,}76\ \text{V}$, $\Delta u = \dfrac{7{,}76}{230} \approx 3{,}4\ \%$ – **zu hoch**.
5. 2,5 mm²: $\Delta U = \dfrac{2 \cdot 13{,}0 \cdot 25}{56 \cdot 2{,}5}\ \text{V} \approx 4{,}66\ \text{V} \approx 2{,}0\ \%$ ✓, $I_\text{z} = 24\ \text{A} \cdot 0{,}94 = 22{,}6\ \text{A}$ ✓. Verlegt wird **2,5 mm² mit B16** – hier entscheidet der Spannungsfall, nicht die Belastbarkeit.
:::

## Merksätze

- Immer alle fünf Schritte: Betriebsstrom, Umrechnungsfaktoren, Querschnitt, Schutz, Spannungsfall.
- Alle Umrechnungsfaktoren multiplizieren – zusammen können sie die Belastbarkeit halbieren.
- $I_\text{n} = I_\text{z}$ ist erlaubt. Für Motoren den Schutz so wählen, dass der Anlaufstrom nicht auslöst.
- Bei langen Leitungen entscheidet oft der Spannungsfall über den Querschnitt.
- Prüfung: Einheiten angeben, Rechenweg aufschreiben, Tabelle nennen, Ergebnis plausibel?

Nachrechnen mit dem Rechner [Leitungsdimensionierung](../../../elektro/leitungsdimensionierung.html).
