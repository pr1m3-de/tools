---
titel: Asynchronmaschine – Typenschild und Kennlinie
stufe: mittel
beschreibung: Schlupf, Läuferfrequenz, Drehmoment, aufgenommene Leistung und Wirkungsgrad vom Typenschild; Anzugs-, Kipp- und Nennmoment, Arbeitspunkt, Einfluss von Spannung und Läuferwiderstand, Generatorbetrieb.
---
# Asynchronmaschine – Typenschild und Kennlinie

Name: ___  Datum: ___

Benötigte Formeln: $n_0 = \dfrac{60 \cdot f}{p}$, $s = \dfrac{n_0 - n}{n_0}$, $f_2 = s \cdot f$, $M = \dfrac{9\,549 \cdot P}{n}$ (M in N·m, P in kW, n in 1/min), $P_1 = \sqrt{3} \cdot U \cdot I \cdot \cos\varphi$, $\eta = \dfrac{P_2}{P_1}$

Zum Ausprobieren: [Drehfeldmaschinen](../../../elektro/drehfeldmaschinen.html), Abschnitt „Asynchronmaschine: Drehmoment über der Drehzahl“

## Aufgabe 1 – Vom Typenschild zu den Betriebswerten

Typenschild eines Käfigläufermotors: 4 kW, Δ 400 V, 8,2 A, cos φ 0,82, 1 440 1/min, 50 Hz.

1. Bestimme Polpaarzahl und synchrone Drehzahl.
2. Berechne Schlupf und Frequenz der Läuferströme.
3. Berechne das Nenndrehmoment.
4. Berechne die aufgenommene Wirkleistung, den Wirkungsgrad und die Verlustleistung.
5. Welche Leistung steht auf dem Typenschild – die aufgenommene oder die abgegebene? Woran erkennst du das hier?

:::lösung
1. Nächste synchrone Drehzahl über 1 440 1/min: 1 500 1/min, also $p = 2$.
2. $s = \dfrac{1\,500 - 1\,440}{1\,500} = 4\ \%$, $f_2 = 0{,}04 \cdot 50\ \text{Hz} = 2\ \text{Hz}$
3. $M_\text{N} = \dfrac{9\,549 \cdot 4}{1\,440} = 26{,}5\ \text{N·m}$
4. $P_1 = \sqrt{3} \cdot 400\ \text{V} \cdot 8{,}2\ \text{A} \cdot 0{,}82 = 4\,658\ \text{W}$, $\eta = \dfrac{4\,000\ \text{W}}{4\,658\ \text{W}} = 85{,}9\ \%$, $P_\text{V} = 658\ \text{W}$
5. Die abgegebene mechanische Leistung an der Welle. Die aus Spannung, Strom und cos φ berechnete Leistung ist größer – die Differenz sind die Verluste.
:::

## Aufgabe 2 – Kennlinie lesen

Stelle auf der Seite Spannung 100 %, Läuferwiderstand 1 ×, Last „konstantes Moment“ ein. Der Beispielmotor hat 0,25 kW bei 1 380 1/min.

1. Lies Anzugsmoment $M_\text{A}$ und Kippmoment $M_\text{K}$ mit der zugehörigen Drehzahl ab.
2. Stelle das Nennmoment 1,73 N·m als Last ein. Bei welcher Drehzahl liegt der Arbeitspunkt?
3. Warum ist der Arbeitspunkt rechts vom Kippmoment stabil, ein Schnittpunkt links davon aber nicht?
4. Erhöhe das Lastmoment auf 2,5 N·m. Was passiert, und warum? Was würde passieren, wenn die 2,5 N·m erst bei laufendem Motor zugeschaltet werden?
5. Stelle 3,3 N·m ein. Erkläre das Ergebnis.

:::lösung
1. $M_\text{A} \approx 2{,}1\ \text{N·m}$, $M_\text{K} \approx 3{,}15\ \text{N·m}$ bei etwa 1 030 1/min.
2. Bei etwa 1 380 1/min – das ist der Nennpunkt.
3. Rechts vom Kippmoment fällt das Motormoment mit steigender Drehzahl: Wird der Motor langsamer, steigt sein Moment und er holt wieder auf. Links davon steigt das Motormoment mit der Drehzahl: Wird er langsamer, sinkt sein Moment weiter, er bleibt stehen oder läuft hoch.
4. Der Motor läuft nicht an, weil das Anzugsmoment (2,1 N·m) kleiner ist als das Lastmoment. Läuft er schon, findet er rechts vom Kippmoment einen Arbeitspunkt (unter 1 380 1/min, mit Überstrom), denn 2,5 N·m liegt unter dem Kippmoment.
5. 3,3 N·m liegt über dem Kippmoment: Es gibt keinen Arbeitspunkt, der Motor kippt und bleibt stehen. Der Strom ist dann ein Vielfaches des Nennstroms, der Motorschutz muss abschalten.
:::

## Aufgabe 3 – Spannung und Läuferwiderstand

1. Senke die Spannung auf 90 % bei 1,73 N·m Last. Wie ändern sich Anzugs- und Kippmoment? Mit welchem Faktor?
2. Läuft der Motor bei 90 % Spannung mit dieser Last noch an?
3. Setze die Spannung wieder auf 100 % und verdopple den Läuferwiderstand. Was passiert mit dem Kippmoment, dem Anzugsmoment und der Drehzahl im Arbeitspunkt?
4. Bei welchem Läuferwiderstand liegt das Kippmoment beim Stillstand? Wozu nutzt man das beim Schleifringläufer?
5. Eine warme Wicklung hat mehr Widerstand. Wie wirkt sich das auf die Drehzahl unter Last aus?

:::lösung
1. Beide sinken auf etwa 81 %: Das Moment ist proportional zum Quadrat der Spannung, $0{,}9^2 = 0{,}81$. $M_\text{K} \approx 2{,}54\ \text{N·m}$, $M_\text{A} \approx 1{,}69\ \text{N·m}$.
2. Nein – das Anzugsmoment (1,69 N·m) ist kleiner als das Lastmoment (1,73 N·m). Spannungsfall auf der Zuleitung kann einen schwer anlaufenden Antrieb so zum Stehen bringen.
3. Das Kippmoment bleibt gleich groß (≈ 3,15 N·m), wandert aber zu kleinerer Drehzahl (≈ 560 1/min). Das Anzugsmoment steigt auf ≈ 3,0 N·m. Der Arbeitspunkt sinkt auf ≈ 1 270 1/min, die Kennlinie wird flacher.
4. Bei etwa dem dreifachen Läuferwiderstand. Beim Schleifringläufer schaltet man dazu Anlasswiderstände in den Läuferkreis: großes Anzugsmoment bei kleinem Anlaufstrom. Danach werden sie stufenweise kurzgeschlossen.
5. Mehr Ständerwiderstand wirkt wie weniger Spannung, mehr Läuferwiderstand macht die Kennlinie flacher: Die Drehzahl unter Last sinkt etwas, der Schlupf steigt.
:::

## Aufgabe 4 – Generator und Bremse

1. Wähle Last „antreibend“. In welchem Bereich der Kennlinie liegt der Arbeitspunkt, und welches Vorzeichen haben Schlupf und Moment?
2. Der Beispielmotor wird mit 1 600 1/min angetrieben. Berechne den Schlupf.
3. In welchem Bereich arbeitet die Maschine, wenn der Läufer gegen das Drehfeld dreht? Wozu kann man das nutzen?

:::lösung
1. Rechts von der synchronen Drehzahl (Generatorbereich). Schlupf und Moment sind negativ, die Maschine gibt Wirkleistung ans Netz ab.
2. $s = \dfrac{1\,500 - 1\,600}{1\,500} = -6{,}7\ \%$
3. Im Bremsbereich (Schlupf größer als 1). Die Maschine nimmt mechanische und elektrische Leistung auf und setzt beide in Wärme um – Gegenstrombremsung, etwa durch kurzes Vertauschen zweier Außenleiter. Vor dem Stillstand muss abgeschaltet werden, sonst läuft der Motor andersherum hoch.
:::
