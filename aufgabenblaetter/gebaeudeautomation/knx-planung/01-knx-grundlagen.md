---
titel: KNX-Grundlagen – Medien, Geräte und Busgerät
stufe: leicht
beschreibung: Kommunikationsarten TP, PL, RF, IP und IoT, Gerätearten von der Systemkomponente bis zum Aktor, Aufbau eines Busgeräts aus Busankoppler, Anwendungsschnittstelle und Anwendungsmodul, dezentrale Arbeitsweise.
---
# KNX-Grundlagen – Medien, Geräte und Busgerät

Name: ___  Datum: ___

Hilfe: [KNX-Planung](../../../gebaeudeautomation/knx-planung.html), [KNX-Simulator](../../../gebaeudeautomation/knx-simulator.html)

## Aufgabe 1 – Konventionell oder Bus?

In einem Flur wird das Licht konventionell mit einer Wechselschaltung geschaltet. Es soll künftig auch von der Haustür aus „alles aus“ geschaltet werden können.

1. Was müsste man konventionell dafür ändern?
2. Wie trennt KNX Steuer- und Energieleitung?
3. Warum heißt KNX ein dezentrales System?

:::lösung
1. Neue Leitungen von der Haustür zu jeder Leuchte bzw. jedem Stromkreis ziehen, Schalter und Schützschaltung umbauen – aufwendig.
2. Die Busleitung (Kleinspannung, 30 V DC, z. B. grünes Kabel) überträgt nur Befehle; die 230-V-Leitungen gehen direkt vom Aktor zum Verbraucher. Die Funktion „alles aus“ ist nur ein weiteres Telegramm an eine Gruppenadresse.
3. Jedes Busgerät hat eigene Intelligenz (Mikrocontroller) und arbeitet ohne Zentrale: Der Taster schickt sein Telegramm direkt an die Aktoren. Fällt ein Gerät aus, laufen die anderen weiter.
:::

## Aufgabe 2 – Kommunikationsarten

Ordne zu: TP, PL, RF, IP, IoT.

| Beschreibung | Medium |
|---|---|
| verdrillte Zweidrahtleitung, 9 600 bit/s, Busspannung 30 V DC | ___ |
| Funk im 868-MHz-Band, gut für Nachrüstung | ___ |
| über das vorhandene 230-V-Netz, 110 kHz, 1 200 bit/s | ___ |
| Ethernet bzw. WLAN, schnelle Hauptlinie, Multicast 224.0.23.12 | ___ |
| semantische Schnittstelle, damit Geräte und Dienste im Internet der Dinge KNX-Daten verstehen | ___ |

1. Was ist der Unterschied zwischen TP-64 und TP-256?
2. Warum wird KNX IP gern als Bereichs- oder Hauptlinie eingesetzt?

:::lösung
TP, RF, PL, IP, IoT (in dieser Reihenfolge).

1. TP-64: bis 64 Busgeräte je Liniensegment, mit bis zu drei Linienverstärkern 4 Segmente und 255 Geräte je Linie. TP-256: neuere Geräte mit geringer Stromaufnahme, bis 256 Busgeräte in einem Segment ohne Verstärker.
2. IP überträgt viel schneller (10/100 Mbit/s gegenüber 9 600 bit/s), so dass die Telegramme vieler Linien nicht zum Engpass werden; außerdem ist das Gebäudenetz oft schon vorhanden und Visualisierungen lassen sich direkt anbinden.
:::

## Aufgabe 3 – Gerätearten

Ordne jedes Gerät einer Gruppe zu (Systemkomponente, Sensor, Aktor):
Spannungsversorgung, Präsenzmelder, Jalousieaktor, Linienkoppler, Tastsensor, Wetterstation, Dimmaktor, IP-Router, Heizungsaktor, Binäreingang, USB-Schnittstelle.

:::lösung
- **Systemkomponenten**: Spannungsversorgung, Linienkoppler, IP-Router, USB-Schnittstelle
- **Sensoren** (erfassen und senden): Präsenzmelder, Tastsensor, Wetterstation, Binäreingang
- **Aktoren** (empfangen und schalten): Jalousieaktor, Dimmaktor, Heizungsaktor
:::

## Aufgabe 4 – Aufbau eines Busgeräts

1. Nenne die drei Teile eines Busgeräts und ihre Aufgabe.
2. Was passiert beim Unterputz-Tastsensor, wenn man den Aufsatz (Wippe mit Elektronik) abnimmt?
3. Welche Aufgabe hat die Programmiertaste mit LED?

:::lösung
1. **Busankoppler (BA/BCU)**: Verbindung zum Bus, Senden und Empfangen, Speicher für Adressen und Applikation. **Anwendungsschnittstelle (PEI)**: genormte Steckverbindung zwischen BA und Anwendungsmodul. **Anwendungsmodul (AM)**: die eigentliche Funktion, z. B. Wippe, Relais, Sensor.
2. Der Busankoppler bleibt am Bus und behält seine Programmierung; das Anwendungsmodul fehlt, deshalb tut das Gerät nichts. Viele Busankoppler erkennen den falschen Aufsatz über die PEI und stoppen die Applikation.
3. Bei gedrückter Taste (LED leuchtet) ist das Gerät im Programmiermodus: Die Inbetriebnahme-Software gibt ihm so seine physikalische Adresse. Es darf immer nur ein Gerät im Programmiermodus sein.
:::

## Aufgabe 5 – Datenpunkttypen

1. Ein Schaltobjekt hat den Datenpunkttyp 1.001. Wie viele Bit sind das und welche Werte gibt es?
2. Ein Dimmwert von 75 % wird als DPT 5.001 übertragen. Welche Zahl steht im Telegramm?
3. Warum braucht eine Temperatur (DPT 9.001) 2 Byte?

:::lösung
1. 1 Bit: 0 = Aus, 1 = Ein.
2. $x = 75 \cdot 255 / 100 = 191{,}25 \approx 191$ (hexadezimal BF).
3. Mit 1 Byte gäbe es nur 256 Stufen; DPT 9 ist eine 2-Byte-Gleitkommazahl (Mantisse und Exponent) für Werte mit Nachkommastellen und großem Bereich, z. B. 21,5 °C oder −12,3 °C.
:::
