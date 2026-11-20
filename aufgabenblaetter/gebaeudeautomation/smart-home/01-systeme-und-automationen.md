---
titel: Gebäudeautomation und Smart Home – Systeme und Automationen
stufe: mittel
beschreibung: Automationspyramide, zentral und dezentral, Systeme von KNX über BACnet, DALI und Zigbee bis Matter und MQTT, Wenn-Und-Dann-Regeln planen und testen, BACnet-Prioritäten und DALI-Dimmkurve.
---
# Gebäudeautomation und Smart Home – Systeme und Automationen

Name: ___  Datum: ___

Hilfe: [Gebäudeautomation und Smart Home](../../../gebaeudeautomation/smart-home.html)

## Aufgabe 1 – Automationspyramide

1. Nenne die drei Ebenen und je zwei typische Geräte oder Systeme.
2. Ordne zu: BACnet/IP-Leitrechner, DALI-Vorschaltgerät, Raumregler, Zigbee-Bewegungsmelder, Energiemonitoring, Modbus-Wärmepumpe.

:::lösung
1. Feldebene (Sensoren, Aktoren: Präsenzmelder, Ventilantrieb), Automationsebene (Regler, Controller, Logik: DDC-Regler, Smart-Home-Zentrale), Managementebene (Gebäudeleittechnik, Visualisierung, Energiemonitoring).
2. Management: BACnet/IP-Leitrechner, Energiemonitoring. Automation: Raumregler, Modbus-Wärmepumpe (Regler mit Schnittstelle). Feld: DALI-Vorschaltgerät, Zigbee-Bewegungsmelder.
:::

## Aufgabe 2 – Zentral oder dezentral?

Vergleiche ein dezentrales Bussystem mit einer zentralen Steuerung (Miniserver bzw. Smart-Home-Zentrale): je zwei Vor- und Nachteile.

:::lösung
- Dezentral: + kein einzelner Ausfallpunkt, + gut erweiterbar und herstellerübergreifend; − Logik ist auf viele Geräte verteilt, − oft teurere Einzelgeräte.
- Zentral: + Logik an einer Stelle, einfache und mächtige Programmierung, + günstige Ein-/Ausgänge; − fällt die Zentrale aus, steht vieles still, − oft an einen Hersteller gebunden.
:::

## Aufgabe 3 – Welches System?

Wähle jeweils ein passendes System und begründe kurz.

1. Neubau eines Einfamilienhauses, alles soll 30 Jahre halten.
2. Mietwohnung, nichts darf gestemmt werden.
3. Bürogebäude mit 400 Leuchten, Szenen je Raum.
4. Hallenbad: Lüftung, Heizung und Brandschutz an einer Leitwarte.
5. Stromzähler und Wechselrichter auslesen.
6. Schalter ohne Batterie und ohne Leitung an eine Glaswand kleben.

:::lösung
1. KNX TP (Bus, offen, langlebig), ggf. mit Smart-Home-Zentrale für Visualisierung.
2. Funk: Zigbee, Thread/Matter oder Z-Wave mit einer Zentrale (z. B. Home Assistant).
3. DALI(-2): bis 64 Betriebsgeräte, 16 Gruppen und 16 Szenen je Linie, angebunden über KNX oder BACnet.
4. BACnet (Gebäudeleittechnik mit Prioritäten, Alarmen, Zeitplänen).
5. Modbus (RTU/TCP) oder M-Bus.
6. EnOcean: Energie aus dem Tastendruck.
:::

## Aufgabe 4 – Automationen planen

Formuliere die Regeln als WENN – UND – DANN und teste sie im Simulator (Zeit vorspulen!).

1. Im Flur soll das Licht bei Bewegung angehen, aber nur, wenn es dunkel ist, und nach 2 Minuten ohne Bewegung wieder ausgehen.
2. Bei offenem Fenster soll die Heizung auf Frostschutz gehen.
3. Die Waschmaschine soll starten, wenn die PV-Anlage 10 Minuten lang über 2 500 W liefert.
4. Warum braucht Regel 1 zwei Regeln und Regel 3 eine Wartezeit („seit 10 min“)?

:::lösung
1. WENN Bewegung = erkannt UND Helligkeit < 300 lx DANN Licht Flur ein. WENN Bewegung = nichts seit 2 min DANN Licht Flur aus.
2. WENN Fenster = offen (seit 1 min) DANN Heizung Soll = 7 °C. Zweite Regel: WENN Fenster = zu DANN Heizung Soll = 21 °C.
3. WENN PV-Leistung > 2 500 W seit 10 min DANN Steckdose Waschmaschine ein (und Nachricht).
4. Ein- und Ausschalten sind verschiedene Auslöser. Die Wartezeit filtert kurze Spitzen, z. B. eine Wolkenlücke; sonst würde die Maschine bei jeder Spitze starten.
:::

## Aufgabe 5 – BACnet-Prioritäten

Ein Binärausgang „Lüftung Halle“ hat folgende Einträge: Priorität 16 (Zeitplan) = EIN, Priorität 8 (Bediener) = AUS.

1. Welcher Wert gilt?
2. Die Brandmeldeanlage schreibt auf Priorität 1 EIN (Entrauchung). Welcher Wert gilt jetzt?
3. Brandalarm vorbei, Priorität 1 wird freigegeben. Was gilt? Was muss der Bediener tun, damit wieder der Zeitplan steuert?

:::lösung
1. AUS – Priorität 8 ist kleiner als 16 und gewinnt.
2. EIN – Priorität 1 gewinnt über alle.
3. Wieder AUS (Priorität 8). Der Bediener muss seinen Eintrag freigeben (leer schreiben), dann gilt der Zeitplan auf Priorität 16.
:::

## Aufgabe 6 – Rechnen mit DALI und MQTT

1. Berechne den Lichtstrom für den DALI-Wert n = 170 und n = 254 mit $X(n) = 10^{\frac{n - 1}{253/3} - 1}\,\%$.
2. Wie lange dauert ein DALI-Befehl aus 16 Bit bei 1 200 bit/s (ohne Start- und Stoppbits)?
3. Schlage ein sinnvolles MQTT-Topic für die Temperatur im Kinderzimmer im OG vor.

:::lösung
1. n = 170: $X = 10^{169/84{,}33 - 1} = 10^{1{,}004} \approx 10{,}1\ \%$. n = 254: $10^{3 - 1} = 100\ \%$.
2. $t = 16 / 1200\ \text{bit/s} = 13{,}3\ \text{ms}$.
3. z. B. `haus/og/kinderzimmer/temperatur` – vom Großen zum Kleinen, ohne Leer- und Sonderzeichen.
:::
