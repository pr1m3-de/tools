---
titel: KNX programmieren und Fehler suchen
stufe: mittel
beschreibung: Inbetriebnahme Schritt für Schritt, Kommunikationsobjekte und Flags, Telegramme im Busmonitor lesen, Statusrückmeldung, und sechs typische Fehler mit dem KNX-Simulator finden und beheben.
---
# KNX programmieren und Fehler suchen

Name: ___  Datum: ___

Arbeite mit dem [KNX-Simulator](../../../gebaeudeautomation/knx-simulator.html). Die Szenarien wählst du oben im Simulator aus.

## Aufgabe 1 – Inbetriebnahme

Szenario „Montiert, aber nicht programmiert“.

1. Welche physikalische Adresse haben alle Geräte ab Werk?
2. Bringe die Schritte der Inbetriebnahme in die richtige Reihenfolge: Applikation laden – Gruppenadressen anlegen – Programmiertaste am Gerät drücken – Objekte mit Gruppenadressen verknüpfen – Parameter einstellen – physikalische Adresse programmieren – Funktion testen.
3. Programmiere im Simulator alle Geräte. Warum darf immer nur ein Gerät im Programmiermodus sein?

:::lösung
1. 15.15.255.
2. Gruppenadressen anlegen → Parameter einstellen → Objekte verknüpfen → Programmiertaste drücken → physikalische Adresse programmieren → Applikation (Parameter, Verknüpfungen, Flags) laden → Funktion testen.
3. Die Software schickt die neue Adresse an „das Gerät im Programmiermodus“. Sind zwei Geräte im Programmiermodus, bekämen beide dieselbe Adresse – Adresskonflikt.
:::

## Aufgabe 2 – Ein Telegramm lesen

Szenario „Fertige Anlage“. Drücke Wippe A (Ein). Der Busmonitor zeigt:

`BC 11 01 08 01 E1 00 81 3A`

1. Wer hat gesendet? (Bytes 2 und 3)
2. An welche Gruppenadresse? (Bytes 4 und 5)
3. Was bedeutet E1 (Bit 7: Gruppenadresse, Bits 0–3: Länge)?
4. Was bedeuten 00 81 (Wert schreiben, Wert 1)?
5. Prüfe die Prüfsumme 3A: Sie ist das invertierte XOR aller vorigen Bytes.
6. Warum erscheint kurz danach ein Telegramm vom Dimmaktor 1.1.6 an 1/0/2?

:::lösung
1. 0x1101 → **1.1.1**, der Taster.
2. 0x0801 = 2 049 = 2048·1 + 256·0 + 1 → **1/0/1** Licht Wohnen Schalten.
3. E1 = 1110 0001: Ziel ist eine Gruppenadresse, Routing-Zähler 6, Länge 1.
4. „GroupValue_Write“ mit dem 1-Bit-Wert 1 = Ein.
5. BC⊕11⊕01⊕08⊕01⊕E1⊕00⊕81 = C5; invertiert: 3A. Stimmt.
6. Das ist die Statusrückmeldung: Der Aktor meldet seinen tatsächlichen Zustand auf 1/0/2, damit Taster-LED und Visualisierung stimmen.
:::

## Aufgabe 3 – Flags

| Flag | Bedeutung |
|---|---|
| K | ___ |
| L | ___ |
| S | ___ |
| Ü | ___ |
| A | ___ |

1. Fülle die Tabelle aus.
2. Welche Flags braucht das Schaltobjekt eines Aktors, welche das Statusobjekt?
3. Ein Objekt ist mit mehreren Gruppenadressen verknüpft. Mit welcher sendet es?

:::lösung
1. K Kommunikation (Objekt ist überhaupt mit dem Bus verbunden), L Lesen (antwortet auf Leseanfragen), S Schreiben (Wert darf vom Bus geändert werden), Ü Übertragen (sendet bei Änderung), A Aktualisieren (übernimmt Antworten auf Leseanfragen).
2. Schaltobjekt: K und S. Statusobjekt: K, L und Ü.
3. Nur mit der ersten (sendenden) Gruppenadresse; auf alle anderen hört es nur.
:::

## Aufgabe 4 – Fehlersuche

Wähle nacheinander die Szenarien „Fehlersuche 1“ bis „Fehlersuche 6“. Notiere jeweils, wie du den Fehler gefunden hast, die Ursache und die Abhilfe. Der Simulator prüft, ob die Aufgabe gelöst ist.

| Nr. | Beobachtung | Ursache | Abhilfe |
|---|---|---|---|
| 1 | Licht geht nicht, woanders passiert etwas | ___ | ___ |
| 2 | Präsenzmelder erkennt, Licht bleibt aus | ___ | ___ |
| 3 | Jalousie bleibt bei Sturm unten | ___ | ___ |
| 4 | nach Umbau reagiert die Steckdose nicht | ___ | ___ |
| 5 | zweimal drücken nötig | ___ | ___ |
| 6 | Heizung läuft bei offenem Fenster | ___ | ___ |

:::lösung
1. Busmonitor: Wippe A sendet an 1/1/1 (Steckdose) statt 1/0/1. Objekt A des Tasters auf 1/0/1 (senden) und 1/0/2 (Status) verknüpfen, Applikation laden.
2. Im Busmonitor kein Telegramm: Beim Präsenzobjekt fehlt das Ü-Flag (nur K, L). Ü setzen, Applikation laden.
3. Die Wetterstation sendet Windalarm an 2/0/5, aber das Windobjekt des Jalousieaktors ist mit keiner Gruppenadresse verknüpft. 2/0/5 verknüpfen, laden.
4. Projekt ist richtig, aber der Schaltaktor wurde nach der Änderung nicht neu programmiert: Er kennt 1/1/3 noch nicht. Applikation des Schaltaktors laden (Merke: Jede Änderung muss in alle betroffenen Geräte geladen werden).
5. Wippe A hat kein Statusobjekt: Sie weiß nicht, dass der Präsenzmelder das Licht eingeschaltet hat, und sendet beim ersten Druck wieder „Ein“. Status-GA 1/0/2 zusätzlich mit Objekt A verknüpfen.
6. Der Fensterkontakt sendet auf 3/0/3, das Fensterobjekt des Heizungsaktors ist nicht verknüpft. 3/0/3 verknüpfen, laden.
:::

## Aufgabe 5 – Eigenes Projekt

Szenario „Neues Projekt“. Lege die Gruppenadressen selbst an (dreistufig, funktional nach Gewerk), verknüpfe die Objekte, programmiere und teste. Notiere deinen Gruppenadressplan:

| Gruppenadresse | Name | DPT | Sender | Empfänger |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |

:::lösung
Beispiel: 1/0/1 Licht Wohnen Schalten (1.001, Taster A → Dimmaktor), 1/0/2 Licht Status (1.001, Dimmaktor → Taster A), 1/0/3 Präsenz (1.001, Präsenzmelder → Dimmaktor), 2/0/1 Jalousie Auf/Ab (1.008, Taster B → Jalousieaktor), 2/0/2 Stopp (1.007, Taster B → Jalousieaktor), 3/0/3 Fenster (1.019, Binäreingang → Heizungsaktor). Der Simulator bestätigt die Funktion.
:::
