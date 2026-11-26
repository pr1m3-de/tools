---
titel: Netzumschaltbox und Notstromspeicher – Varianten planen
stufe: schwer
beschreibung: Umschaltbox 4- oder 3-polig, N-PE-Brücke richtig setzen, Phasenbrücke mit Lastabwurf, Zeiten von Box und Speicher abstimmen, Leistung und Kurzschlussstrom eines 1-phasigen Notstromspeichers prüfen.
---
# Netzumschaltbox und Notstromspeicher – Varianten planen

Name: ___  Datum: ___

Benötigte Formeln: $I_n = \dfrac{P_n}{U_0}$, $I_k = k \cdot I_n$, $P = U \cdot I \cdot \cos\varphi$

Zum Ausprobieren: [Stromkreis-Simulator](../../../elektro/stromkreis-simulator.html) – Beispiele unter „Notstrom mit Speicher“.

## Aufgabe 1 – Wo kommt die N-PE-Brücke hin?

Ein Einfamilienhaus (TN-C-S, PEN-Aufteilung an der Haupterdungsschiene) bekommt einen Notstromspeicher und eine automatische Netzumschaltbox. Ordne zu, ob die Kombination zulässig ist und ob der FI im Notstrombetrieb wirkt.

| Box | Speicher | zulässig? | FI wirkt? |
|---|---|---|---|
| 4-polig, N geschaltet | N-PE-Brücke automatisch im Inselbetrieb | ___ | ___ |
| 4-polig, N geschaltet, N-PE-Relais in der Box | keine Brücke | ___ | ___ |
| 4-polig, N geschaltet | keine Brücke | ___ | ___ |
| 3-polig, N durchverbunden | keine Brücke | ___ | ___ |
| 3-polig, N durchverbunden | N-PE-Brücke fest | ___ | ___ |

:::lösung
| Box | Speicher | zulässig? | FI wirkt? |
|---|---|---|---|
| 4-polig, N geschaltet | Brücke automatisch | ja | ja |
| 4-polig, N-PE-Relais in der Box | keine Brücke | ja | ja |
| 4-polig, N geschaltet | keine Brücke | nur mit Isolationswächter (IT-ähnlich) | nein, erster Fehler ohne Abschaltung |
| 3-polig, N durchverbunden | keine Brücke | ja, wenn vom Hersteller freigegeben | ja, Erdung über den Hausanschluss |
| 3-polig, N durchverbunden | Brücke fest | nein – zweite N-PE-Verbindung, Laststrom auf dem PE | – |
:::

## Aufgabe 2 – 1-phasiger Speicher mit Phasenbrücke

Ein 1-phasiger Speicher mit 5 kW und dem 2-Fachen Kurzschlussstrom versorgt über eine Box mit Phasenbrücke das ganze Haus. Im Notstrombetrieb laufen Kühlschrank (150 W), Heizungspumpe (100 W), Licht (300 W) und ein Herd mit 3 × 2 kW.

1. Wie groß sind Bemessungs- und Kurzschlussstrom des Speichers?
2. Reicht die Leistung, wenn der Herd mitläuft? Was muss passieren?
3. Warum darf an der Phasenbrücke kein Drehstrommotor laufen?
4. Ein B16 im Kühlschrank-Kreis: löst er bei einem satten Körperschluss magnetisch aus?

:::lösung
1. $I_n = \dfrac{5000\,\text{W}}{230\,\text{V}} \approx 21{,}7\,\text{A}$; $I_k = 2 \cdot 21{,}7\,\text{A} \approx 43\,\text{A}$
2. $150 + 100 + 300 + 6000 = 6550\,\text{W} > 5000\,\text{W}$ – der Speicher würde abschalten. Ein Lastabwurf-Schütz muss den Herd im Notstrombetrieb trennen.
3. Alle drei Phasen haben dann dieselbe Spannung und Phasenlage – es gibt kein Drehfeld, der Motor brummt und läuft nicht an.
4. Nein: 43 A < 80 A. Schutz bietet hier der FI (mit N-PE-Brücke im Notstrombetrieb) – oder der Speicher schaltet selbst ab.
:::

## Aufgabe 3 – Zeiten abstimmen

Die Box schaltet 2 s nach Netzausfall auf 0, nach 0,5 s Pause auf Notstrom und 60 s nach stabiler Netzwiederkehr zurück. Der Speicher braucht 0,5 s bis zum Inselbetrieb und schaltet seinen Ausgang 30 s nach Netzwiederkehr ab.

1. Wie lange ist das Haus nach einem Netzausfall ohne Strom?
2. Was passiert bei Netzwiederkehr? Wie lange ist das Haus dunkel?
3. Wie müssen die Zeiten eingestellt werden?
4. Wann ist „Rückschalten von Hand“ sinnvoll?

:::lösung
1. Bis die Box auf Notstrom schaltet: 2 s + 0,5 s = 2,5 s (der Speicher ist nach 0,5 s schon bereit).
2. Nach 30 s schaltet der Speicher ab, die Box steht noch auf Notstrom – das Haus ist dunkel, bis die Box nach 60 s zurückschaltet: 30 s ohne Strom.
3. Der Speicher muss länger warten als die Box, zum Beispiel 5 min gegen 60 s – oder die Box steuert den Speicher.
4. Wenn das Netz häufig kurz wiederkommt und wieder ausfällt oder wenn man selbst entscheiden will, wann zurückgeschaltet wird.
:::

## Aufgabe 4 – Inselnetz ohne Erde

Der Speicher wird ohne N-PE-Brücke betrieben, die Box schaltet den N mit. An der Waschmaschine tritt ein Körperschluss auf.

1. Wie groß ist der Fehlerstrom ungefähr? Löst der FI aus?
2. Welches Gerät zeigt den Fehler an?
3. Danach berührt der N-Leiter in einer Abzweigdose den Schutzleiter. Was passiert?

:::lösung
1. Praktisch null – der Stromkreis schließt sich nicht. Der FI löst nicht aus.
2. Nur ein Isolationswächter (Messung zwischen aktiven Leitern und PE) meldet den ersten Fehler.
3. Jetzt fließt ein Kurzschlussstrom L → Gehäuse → PE → N. Je nach Kurzschlussstrom des Speichers löst der LS aus oder der Speicher schaltet ab.
:::
