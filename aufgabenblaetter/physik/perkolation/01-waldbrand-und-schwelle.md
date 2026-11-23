---
titel: Perkolation – Waldbrand und Perkolationsschwelle
stufe: mittel
beschreibung: Begriffe der Perkolation, Bäume und Dichte berechnen, Waldbrand-Simulation auswerten, Schwellen verschiedener Gitter vergleichen, Brandschneisen.
---
# Perkolation – Waldbrand und Perkolationsschwelle

Name: ___  Datum: ___

Benötigte Formeln: $N = p \cdot L^2$, Schwelle Quadratgitter $p_\text{c} \approx 0{,}593$

Zum Ausprobieren: [Perkolation: Waldbrand und Perkolationsschwelle](../../../physik/perkolation.html)

## Aufgabe 1 – Begriffe

1. Erkläre die Begriffe Platz, Besetzungswahrscheinlichkeit p, Cluster und durchgehender Cluster am Beispiel eines Waldes.
2. Was sagt die Perkolationsschwelle $p_\text{c}$ aus?
3. Woher kommt das Wort „Perkolation“? Nenne ein Beispiel aus dem Alltag.

:::lösung
1. Ein Platz ist ein Feld im Gitter. Mit der Wahrscheinlichkeit p steht dort ein Baum. Ein Cluster ist eine Gruppe von Bäumen, die über Nachbarn miteinander verbunden sind. Ein durchgehender Cluster reicht von einem Rand des Waldes bis zum gegenüberliegenden.
2. Unterhalb von $p_\text{c}$ sind alle Cluster endlich, ein Feuer bleibt örtlich begrenzt. Oberhalb gibt es (im sehr großen Wald) einen durchgehenden Cluster, das Feuer kann den ganzen Wald durchqueren.
3. Von lateinisch percolare, durchsickern. Beispiel: Wasser sickert durch Kaffeepulver im Filter, aber nur, wenn das Pulver genug zusammenhängende Poren hat.
:::

## Aufgabe 2 – Bäume und Dichte

1. Ein Wald hat 50 × 50 Felder, die Dichte ist 55 %. Wie viele Bäume stehen darin (Erwartungswert)?
2. Wie viele Bäume erwartet man bei 200 × 200 Feldern und p = 0,6?
3. In einem Wald mit 40 × 40 Feldern stehen 1 000 Bäume. Wie groß ist die Dichte? Kann ein Feuer im Quadratgitter-Modell durchbrennen?

:::lösung
1. $N = 0{,}55 \cdot 50^2 = 1\,375$ Bäume
2. $N = 0{,}6 \cdot 200^2 = 24\,000$ Bäume
3. $p = \dfrac{1\,000}{40^2} = 0{,}625$. Das liegt über $p_\text{c} \approx 0{,}593$, das Feuer brennt sehr wahrscheinlich durch. Bei nur 40 × 40 Feldern ist der Übergang aber verschmiert, sicher ist es nicht.
:::

## Aufgabe 3 – Simulation auswerten

Stelle auf der Seite das Quadratgitter mit L = 100 ein. Probiere für p = 50 %, 59 % und 65 % jeweils fünf verschiedene Zufallszahlen.

1. Notiere jeweils, ob das Feuer durchbrennt und wie viele Schritte der Brand dauert.
2. Bei welcher Dichte brennt es am längsten? Erkläre.
3. Wechsle in die Ansicht „Durchbruch“. Vergleiche die Kurven für L = 100 und L = 25. Was fällt auf?

:::lösung
1. Bei 50 % erlischt das Feuer immer nach kurzer Zeit. Bei 65 % brennt es fast immer durch, in rund 160 bis 210 Schritten. Bei 59 % mal so, mal so; wenn es durchkommt, dauert es oft über 230 Schritte.
2. Nahe der Schwelle. Der durchgehende Cluster ist dort dünn und verschlungen, das Feuer muss große Umwege gehen. Weit über der Schwelle läuft es fast gerade durch, weit darunter findet es kaum Bäume.
3. Die Kurve für den größeren Wald ist steiler. Je größer der Wald, desto schärfer der Übergang bei $p_\text{c}$; im unendlich großen Wald wäre es eine Stufe.
:::

## Aufgabe 4 – Gitter und Brandschneisen

1. Ordne die Schwellen der Größe nach: Quadratgitter mit Diagonalen (8 Nachbarn), Dreiecksgitter (6), Quadratgitter (4), Bienenwabengitter (3). Erkläre die Reihenfolge.
2. Ein Förster lichtet einen Wald von 65 % auf 55 % Baumdichte aus. Wirkt das, wenn das Feuer nur auf direkte Nachbarn (4) überspringt?
3. Bei starkem Wind und Funkenflug springt das Feuer auch über die Ecken (8 Nachbarn). Reicht die Auslichtung dann noch?

:::lösung
1. 8 Nachbarn: 0,407 < 6 Nachbarn: 0,5 < 4 Nachbarn: 0,593 < 3 Nachbarn: 0,697. Je mehr Nachbarn ein Platz hat, desto mehr Wege gibt es, und desto weniger Bäume reichen für einen durchgehenden Cluster.
2. Ja. 55 % liegt unter 59,3 %, ein Brand bleibt meist örtlich begrenzt.
3. Nein. Mit 8 Nachbarn liegt die Schwelle bei 40,7 %, 55 % liegen deutlich darüber – der Wald würde durchbrennen.
:::
