---
titel: Notstrom – Umschaltung, Inselnetz und Kurzschlussstrom
stufe: schwer
beschreibung: Kurzschlussstrom eines Inselwechselrichters und Abschaltbedingung, N-PE-Brücke und mitgeschalteter N, Akkulaufzeit im Notstrombetrieb und Zeitablauf einer automatischen Umschaltung mit Aggregat.
---
# Notstrom – Umschaltung, Inselnetz und Kurzschlussstrom

Name: ___  Datum: ___

Benötigte Formeln: $I_n = \dfrac{P_n}{U_0}$, $I_k = k \cdot I_n$, $t = \dfrac{W_\text{nutzbar}}{P_\text{DC}}$, $P_\text{DC} = \dfrac{P_\text{AC}}{\eta}$

Zum Ausprobieren: [Stromkreis-Simulator](../../../elektro/stromkreis-simulator.html) – Beispiele „Netzersatz“, „Automatische Umschaltung“ und „Kurzschluss im Inselnetz“.

## Aufgabe 1 – Kurzschluss im Inselnetz

Ein einphasiger Inselwechselrichter hat 3 kW und liefert im Kurzschluss das 1,5-Fache seines Bemessungsstroms. Der Stromkreis ist mit einem B16 abgesichert.

1. Wie groß sind Bemessungsstrom und Kurzschlussstrom des Wechselrichters?
2. Welchen Strom braucht der B16 zum sofortigen Auslösen? Was passiert bei einem Kurzschluss?
3. Wie groß dürfte der Bemessungsstrom eines B-Automaten höchstens sein, damit er magnetisch auslöst?
4. Nenne zwei praxistaugliche Lösungen.

:::lösung
1. $I_n = \dfrac{3000\,\text{W}}{230\,\text{V}} \approx 13{,}0\,\text{A}$; $I_k = 1{,}5 \cdot 13{,}0\,\text{A} \approx 19{,}6\,\text{A}$
2. $5 \cdot 16\,\text{A} = 80\,\text{A}$. Der Wechselrichter begrenzt auf rund 20 A und schaltet nach kurzer Zeit selbst ab – das ganze Inselnetz ist dunkel, der Fehler wird nicht selektiv abgeschaltet.
3. $I_n \le \dfrac{19{,}6\,\text{A}}{5} \approx 3{,}9\,\text{A}$ – für Steckdosenkreise unbrauchbar.
4. Zum Beispiel: Wechselrichter mit hohem Kurzschlussstrom (Herstellerangabe), Fehlerschutz über FI mit N-PE-Brücke im Inselbetrieb, kleinere Absicherung einzelner Kreise oder ein Aggregat mit ausreichendem Kurzschlussstrom.
:::

## Aufgabe 2 – N-PE-Brücke und Umschalter

Ein Haus wird über einen Netzumschalter I-0-II aus dem Netz (TN-C-S) oder aus einem Inselwechselrichter versorgt.

1. Was passiert beim ersten Körperschluss, wenn der Wechselrichter keine N-PE-Brücke hat? Löst der FI aus?
2. Warum ist dieser Zustand trotzdem nicht dauerhaft sicher?
3. Der Wechselrichter verbindet N und PE im Inselbetrieb. Warum muss der Umschalter dann den N mitschalten?
4. Braucht das Inselnetz einen eigenen Erder, um zu funktionieren?

:::lösung
1. Es fließt praktisch kein Fehlerstrom, weil der Stromkreis über PE nicht zum Wechselrichter zurückführt – wie beim ersten Fehler im IT-Netz. Der FI löst nicht aus.
2. Tritt ein zweiter Fehler an einem anderen Leiter auf, liegt zwischen zwei Gehäusen die volle Spannung. Ohne Isolationsüberwachung bemerkt niemand den ersten Fehler.
3. Sonst wären N und PE im Netzbetrieb ein zweites Mal verbunden (über die Brücke im Wechselrichter). Ein Teil des Laststroms fließt dann über den Schutzleiter, und ein vorgeschalteter FI löst aus.
4. Nein. Die Schutzmaßnahme ergibt sich aus N-PE-Brücke und Schutzleiter. Die Gehäuse und der Wechselrichter sind trotzdem über die Haupterdungsschiene in den Potentialausgleich einzubinden.
:::

## Aufgabe 3 – Laufzeit im Notstrombetrieb

Ein Akku hat 10 kWh, steht bei 80 % und darf bis 5 % entladen werden. Im Notstrombetrieb laufen Kühlschrank, Heizungspumpe und Licht mit zusammen 1,2 kW. Der Wechselrichter hat einen Wirkungsgrad von 95 %.

1. Wie viel Energie ist nutzbar?
2. Wie lange reicht der Akku ohne Sonne?
3. Tagsüber liefert die PV-Anlage 2 kW. Was passiert mit dem Überschuss, und was, wenn der Akku voll ist?

:::lösung
1. $W = (0{,}80 - 0{,}05) \cdot 10\,\text{kWh} = 7{,}5\,\text{kWh}$
2. $P_\text{DC} = \dfrac{1{,}2\,\text{kW}}{0{,}95} \approx 1{,}26\,\text{kW}$; $t = \dfrac{7{,}5\,\text{kWh}}{1{,}26\,\text{kW}} \approx 5{,}9\,\text{h}$, also knapp 6 Stunden.
3. Rund 0,8 kW (abzüglich Verluste) laden den Akku. Ist er voll, hebt der Inselwechselrichter die Frequenz an und der PV-Wechselrichter regelt auf den Verbrauch ab.
:::

## Aufgabe 4 – Zeitablauf der automatischen Umschaltung

Ein Auto-Umschalter schaltet 2 s nach Netzausfall auf 0 und gibt sofort das Startsignal an ein Aggregat (Hochlaufzeit 8 s). Sobald die Spannung des Aggregats stabil ist, schaltet er nach 0,5 s auf Notstrom. Bei Netzwiederkehr schaltet er nach 30 s zurück, das Aggregat läuft danach noch 60 s nach.

1. Wie lange ist das Haus nach einem Netzausfall ohne Strom?
2. Das Netz kehrt 10 Minuten nach dem Ausfall zurück. Wann ist das Haus wieder am Netz, wann steht das Aggregat?
3. Welche Geräte im Haus brauchen trotzdem eine USV?

:::lösung
1. Aggregat bereit nach 8 s, Umschalten 0,5 s später: rund 8,5 s ohne Strom.
2. Netz zurück bei 600 s, Rückschaltung bei 630 s, Aggregat steht bei 690 s (11 min 30 s nach dem Ausfall).
3. Alles, was keine Unterbrechung verträgt: Router und Server, Brandmelde- und Alarmzentralen, medizinische Geräte, Steuerungen.
:::
