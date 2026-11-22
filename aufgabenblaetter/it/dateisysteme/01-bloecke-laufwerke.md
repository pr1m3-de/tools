---
titel: Dateisysteme und Speicher
stufe: leicht
beschreibung: Belegter Platz und Verschnitt bei verschiedenen Blockgrößen, Grenzen von FAT32, GB und GiB, Kopierzeit vieler kleiner Dateien auf Festplatte und SSD, Fragmentierung.
---
# Dateisysteme und Speicher

Name: ___  Datum: ___

Benötigte Formeln: $n = \left\lceil \dfrac{s}{b} \right\rceil$, $B = N \cdot n \cdot b$, $t = \dfrac{S}{v}$, $t = \dfrac{N}{\text{IOPS}}$; $1\ \text{KiB} = 1024\ \text{B}$, $1\ \text{GiB} = 2^{30}\ \text{B}$

Zum Ausprobieren: [Dateisysteme und Speicher](../../../it/dateisysteme.html)

## Aufgabe 1 – Blöcke und Verschnitt

Auf einem Laufwerk liegen 100 000 Vorschaubilder mit je 3 KiB.

1. Wie viel Platz belegen sie bei 4-KiB-Blöcken? Wie groß ist der Verschnitt in Prozent?
2. Wie viel belegen sie bei 32-KiB-Blöcken?
3. Warum nimmt man für ein Laufwerk mit großen Videodateien trotzdem gern große Blöcke?

:::lösung
1. Jede Datei braucht einen Block: $100\,000 \cdot 4\ \text{KiB} = 390{,}6\ \text{MiB}$; Nutzdaten 293 MiB, Verschnitt 25 %
2. $100\,000 \cdot 32\ \text{KiB} = 3{,}05\ \text{GiB}$ – über 90 % Verschnitt
3. Bei großen Dateien fällt der Rest im letzten Block kaum ins Gewicht, und es müssen weniger Blöcke verwaltet werden.
:::

## Aufgabe 2 – Grenzen und Einheiten

1. Ein USB-Stick mit FAT32 meldet beim Kopieren einer 5-GB-Videodatei einen Fehler, obwohl 20 GB frei sind. Warum? Was hilft?
2. Ein neues 1-TB-Laufwerk wird mit „931 GB“ angezeigt. Rechne nach.

:::lösung
1. FAT32 erlaubt höchstens 4 GiB − 1 Byte je Datei. Mit exFAT (oder NTFS) formatieren, vorher die Daten sichern.
2. $\dfrac{10^{12}\ \text{B}}{2^{30}\ \text{B/GiB}} = 931{,}3\ \text{GiB}$ – das System rechnet binär, schreibt aber „GB“.
:::

## Aufgabe 3 – Kopierzeit

Die 100 000 Vorschaubilder (zusammen 307 MB) sollen kopiert werden. Pro Datei rechnen wir mit 2 Zugriffen.

1. Festplatte: 200 MB/s, 120 Zugriffe je Sekunde. Wie lange dauert es?
2. SATA-SSD: 540 MB/s, 80 000 Zugriffe je Sekunde?
3. Was ist hier der Engpass, die Übertragungsrate oder die Zahl der Zugriffe?

:::lösung
1. $\dfrac{307}{200}\ \text{s} + \dfrac{200\,000}{120}\ \text{s} = 1{,}5\ \text{s} + 1667\ \text{s} \approx 28\ \text{min}$
2. $\dfrac{307}{540}\ \text{s} + \dfrac{200\,000}{80\,000}\ \text{s} = 0{,}6\ \text{s} + 2{,}5\ \text{s} \approx 3\ \text{s}$
3. Die Zugriffe. Bei der Festplatte macht die Übertragung nicht einmal 0,1 % der Zeit aus.
:::

## Aufgabe 4 – Fragmentierung

1. Erkläre mit der Ansicht „Fragmentierung“, wie eine Datei in mehrere Stücke zerfällt.
2. Warum wird eine fragmentierte Festplatte langsam, eine SSD aber nicht?
3. Wie lange wartet eine Festplatte mit 7200 U/min im Mittel, bis der gesuchte Sektor unter dem Kopf ist?

:::lösung
1. Nach dem Löschen bleiben Lücken. Eine neue, größere Datei wird in mehrere Lücken verteilt.
2. Der Lesekopf muss für jedes Stück zu einer anderen Stelle fahren und auf die Drehung warten. Die SSD erreicht jeden Block gleich schnell.
3. Eine halbe Umdrehung: $\dfrac{1}{2} \cdot \dfrac{60\ \text{s}}{7200} = 4{,}2\ \text{ms}$
:::
