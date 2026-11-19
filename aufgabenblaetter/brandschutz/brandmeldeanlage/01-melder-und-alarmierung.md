---
titel: Brandmeldeanlage – Melder und Alarmierung (Projekt Bäckerei)
stufe: mittel
beschreibung: Internalarm, Externalarm und Fernalarm, Rauch-, Wärme- und Flammenmelder, Rauchansaugsysteme – mit der Auswahl der Melder für eine Bäckerei.
---
# Brandmeldeanlage – Melder und Alarmierung

Name: ___  Datum: ___

**Projekt:** Bäckermeister Gugelhupfer lässt seine Bäckerei renovieren und will eine Brandmeldeanlage. Räume (Raumhöhe 3 m, flache Decke): Backstube 94,5 m² mit Backofen und Gärraum, Verkaufsraum 35 m², Rohstofflager mit Mehlsilos 13,5 m², Kühlraum und Frosterraum (−18 °C).

Überwachungsfläche je Melder nach DIN VDE 0833-2 (Raumhöhe bis 6 m, Decke bis 15° Neigung):

| Melder | Raum bis … | $A_\text{max}$ je Melder | Raum größer | $A_\text{max}$ je Melder |
|---|---|---:|---|---:|
| Rauchmelder | 80 m² | 80 m² | über 80 m² | 60 m² |
| Wärmemelder | 30 m² | 30 m² | über 30 m² | 20 m² |

Anzahl der Melder: $n \ge \left\lceil \dfrac{A}{A_\text{max}} \right\rceil$

## Aufgabe 1 – Arten der Alarmierung

Ordne zu: **Internalarm (still)**, **Internalarm (laut)**, **Externalarm** oder **Fernalarm**.

1. Die Übertragungseinrichtung meldet den Brand an die Leitstelle der Feuerwehr.
2. Im Büro des Bäckermeisters leuchtet eine Anzeige, das Personal soll nachsehen.
3. In der ganzen Bäckerei heulen Sirenen, alle verlassen das Gebäude.
4. An der Außenwand ertönt eine Sirene, damit Passanten Hilfe holen.
5. Warum ist der Externalarm bei Brandmeldeanlagen selten?

:::lösung
1. Fernalarm
2. Internalarm, still (nur bestimmte Personen, oft mit Erkundungszeit)
3. Internalarm, laut (alle Personen im Gebäude)
4. Externalarm
5. Die Feuerwehr wird über den Fernalarm direkt und schneller benachrichtigt. Ein Alarm nach außen ist nur nötig, wenn keine Aufschaltung zur Leitstelle besteht – typisch eher bei Einbruchmeldeanlagen.
:::

## Aufgabe 2 – Stiller Alarm mit Erkundung

Die Anlage arbeitet tagsüber mit Alarmorganisation nach DIN VDE 0833-2.

1. Wie viel Zeit hat das Personal, um den Alarm an der Zentrale anzunehmen (zu quittieren)?
2. Wie lange darf die Erkundung höchstens dauern?
3. Was passiert, wenn eine der Zeiten überschritten wird oder ein Handfeuermelder gedrückt wird?

:::lösung
1. 30 s
2. Höchstens 3 min
3. Der Fernalarm zur Feuerwehr wird sofort ausgelöst. Handfeuermelder lösen grundsätzlich ohne Verzögerung aus, weil dort ein Mensch den Brand bereits gesehen hat.
:::

## Aufgabe 3 – Rauchmelder

1. Erkläre das Streulichtprinzip des optischen Rauchmelders.
2. Erkläre das Prinzip des Ionisationsrauchmelders. Warum wird er heute kaum noch eingebaut?
3. Wie arbeitet ein linearer Rauchmelder, und wo setzt man ihn ein?
4. Ein Kunde möchte statt der Brandmeldeanlage „ein paar Rauchwarnmelder aus dem Baumarkt“. Was ist der entscheidende Unterschied?

:::lösung
1. In einer dunklen Messkammer sendet eine Leuchtdiode Licht, das die Fotodiode normalerweise nicht trifft. Rauchteilchen streuen das Licht zur Fotodiode – sie misst Licht, der Melder löst aus.
2. Ein schwach radioaktiver Strahler macht die Luft zwischen zwei Elektroden leitfähig, es fließt ein Ionenstrom. Rauchteilchen binden Ionen, der Strom sinkt – Alarm. Kaum noch im Einsatz wegen des radioaktiven Strahlers (Strahlenschutz, Entsorgung) und der Empfindlichkeit gegen Luftzug.
3. Ein Lichtstrahl läuft durch den Raum zu einem Empfänger oder Reflektor. Rauch schwächt den Strahl, unter einer Schwelle löst er aus. Für große, hohe Hallen, Atrien und Lager.
4. Rauchwarnmelder sind Einzelgeräte mit eigener Sirene. Sie warnen nur die Menschen vor Ort, melden aber nichts an eine Zentrale oder an die Feuerwehr. Eine Brandmeldeanlage wertet alle Melder zentral aus, steuert und alarmiert die Feuerwehr – auch nachts, wenn niemand da ist.
:::

## Aufgabe 4 – Rauchansaugsystem

1. Beschreibe den Aufbau und die Funktion eines Rauchansaugsystems.
2. Nenne drei Einsatzorte und begründe einen davon.

:::lösung
1. Ein Rohrnetz mit kleinen Ansaugöffnungen liegt im überwachten Bereich. Ein Lüfter saugt ständig Luft an und führt sie zu einer zentralen Auswerteeinheit mit sehr empfindlichem Detektor.
2. Zum Beispiel Serverraum, Reinraum, Hochregallager, Kühl- und Tiefkühlraum, Zellen. Im Tiefkühlraum bleibt die Elektronik außerhalb der Kälte und lässt sich dort warten; im Raum liegt nur das Rohr.
:::

## Aufgabe 5 – Wärmemelder

1. Worin unterscheiden sich Thermomaximal- und Thermodifferentialmelder?
2. Bei einem Brand steigt die Temperatur in einem Raum von 20 °C gleichmäßig um 15 K/min. Nach welcher Zeit spricht ein Thermomaximalmelder mit 58 °C an?
3. Ein Thermodifferentialmelder spricht bei einem Anstieg ab 10 K/min an. Wer meldet früher?
4. Wo setzt man linienförmige Wärmemelder ein?

:::lösung
1. Der Maximalmelder löst bei einer festen Temperatur aus, egal wie schnell sie steigt. Der Differentialmelder löst bei schnellem Anstieg aus (K/min), auch wenn es noch nicht heiß ist; meist hat er zusätzlich eine Maximalstufe.
2. $t = \dfrac{58\ \text{°C} - 20\ \text{°C}}{15\ \text{K/min}} = \dfrac{38\ \text{K}}{15\ \text{K/min}} \approx 2{,}5\ \text{min}$
3. Der Differentialmelder: Der Anstieg von 15 K/min liegt über seiner Schwelle, er meldet schon nach kurzer Zeit, lange bevor 58 °C erreicht sind.
4. Tunnel, Kabelkanäle und -trassen, Förderbänder, Parkhäuser, Kühllager – lange Strecken und raue Umgebung.
:::

## Aufgabe 6 – Flammenmelder

1. Welche Strahlung werten UV- und IR-Flammenmelder aus?
2. Nenne je eine typische Störgröße.
3. Für welche Brände sind Flammenmelder besonders geeignet?

:::lösung
1. UV-Melder: ultraviolette Strahlung der Flamme (etwa 185 bis 260 nm). IR-Melder: Infrarotstrahlung heißer Verbrennungsgase (CO₂-Bande um 4,4 µm) und ihr Flackern.
2. UV: Schweißarbeiten, Blitze. IR: Sonnenlicht, heiße Flächen.
3. Schnell entstehende Brände mit offener Flamme und wenig Rauch zu Beginn, z. B. brennbare Flüssigkeiten, Gase, Lackierereien. Sie brauchen freie Sicht auf den Bereich.
:::

## Aufgabe 7 – Melder für die Bäckerei

Wähle für jeden Raum die Melderart, begründe sie und berechne die Mindestanzahl.

| Raum | Fläche | Melderart | Begründung | $A_\text{max}$ | Anzahl |
|---|---:|---|---|---:|---:|
| Backstube | 94,5 m² | ___ | ___ | ___ | ___ |
| Verkaufsraum | 35 m² | ___ | ___ | ___ | ___ |
| Rohstofflager | 13,5 m² | ___ | ___ | ___ | ___ |
| Frosterraum | – | ___ | ___ | – | – |

:::tipp
In der Backstube gibt es Mehlstaub, Dampf aus dem Gärraum und Hitze, wenn die Ofentür aufgeht.
:::

:::lösung
| Raum | Fläche | Melderart | Begründung | $A_\text{max}$ | Anzahl |
|---|---:|---|---|---:|---:|
| Backstube | 94,5 m² | Thermomaximalmelder | Mehlstaub und Dampf täuschen Rauchmelder; am Ofen springt die Temperatur, deshalb kein Differentialmelder | 20 m² | $\lceil 94{,}5 / 20 \rceil = 5$ |
| Verkaufsraum | 35 m² | optischer Rauchmelder | saubere Luft, Schwelbrand früh erkennen | 80 m² | 1 |
| Rohstofflager | 13,5 m² | Thermomaximalmelder | Mehlstaub | 30 m² | 1 |
| Frosterraum | – | Rauchansaugsystem oder für Kälte zugelassener Wärmemelder | −18 °C, Reif und Kondenswasser; Auswertung außerhalb | – | – |

Dazu Handfeuermelder an den Ausgängen (Ausgang Backstube, Ausgang Verkaufsraum).
:::

## Merksätze

- Internalarm warnt die Menschen im Gebäude (still oder laut), Fernalarm holt die Feuerwehr, Externalarm wendet sich an die Öffentlichkeit.
- Rauchmelder erkennen Brände am frühesten – aber nur, wo kein Staub und kein Dampf sind.
- Wärmemelder für staubige, dampfige und warme Räume; Maximalmelder dort, wo die Temperatur betriebsbedingt springt.
- Flammenmelder brauchen Sicht, Ansaugsysteme sind die empfindlichsten.
- Ein Rauchwarnmelder ist kein Teil einer Brandmeldeanlage.

Nachlesen und ausprobieren: [Brandmeldeanlage planen und simulieren](../../../brandschutz/brandmeldeanlage.html).
