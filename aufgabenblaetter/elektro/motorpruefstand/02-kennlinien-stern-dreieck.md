---
titel: Motorprüfstand – Kennlinien in Dreieck und Stern
stufe: schwer
beschreibung: Hochlauf am virtuellen Prüfstand: Kennlinien von Drehmoment, Strom, Phasenwinkel, Leistungen und Wirkungsgrad aufnehmen, Strombegrenzung verstehen, Dreieck und Stern vergleichen, günstigen Arbeitsbereich und Motorschutz begründen.
---
# Motorprüfstand – Kennlinien in Dreieck und Stern

Name: ___  Datum: ___

Benötigte Formeln: $P_\text{mech} = M \cdot 2 \pi \cdot n$, $P_\text{el} = \sqrt{3} \cdot U \cdot I \cdot \cos\varphi$, $S = \sqrt{3} \cdot U \cdot I$, $\eta = \dfrac{P_\text{mech}}{P_\text{el}}$, $M \sim U_\text{Str}^2$

Versuch: [Motorprüfstand](../../../elektro/motorpruefstand.html), Modus „Automatisch: Hochlauf“

## Aufgabe 1 – Hochlauf im Dreieck

Dreieck, 230 V, 50 Hz, Maximaldrehzahl 1 600 1/min. Starte den Hochlauf und blende nacheinander alle Kurven ein.

1. Beschreibe den Verlauf von Spannung und Strom unterhalb von etwa 1 000 1/min. Was macht der Prüfstand dort, und warum?
2. Welche Folge hat das für die gemessene Drehmomentkennlinie in diesem Bereich?
3. Bei welcher Drehzahl ist die mechanische Leistung am größten, und wie groß ist sie ungefähr?
4. Wo liegt der Wirkungsgrad am höchsten? Vergleiche mit der Nenndrehzahl.
5. Exportiere die Messwerte als CSV und zeichne in einer Tabellenkalkulation M(n) und I(n).

:::lösung
1. Der Strom würde über das Doppelte des Nennstroms (2,6 A) steigen. Der Prüfstand begrenzt ihn und senkt dafür die Klemmenspannung (bis auf etwa 160 V im Stillstand), um die Wicklung zu schützen.
2. Weil das Moment mit dem Quadrat der Spannung sinkt, ist die gemessene Kennlinie dort zu niedrig: Anzugsmoment nur ≈ 1 N·m statt ≈ 2 N·m, das Kippmoment erscheint verschoben.
3. Bei etwa 1 150 bis 1 200 1/min, rund 370 W – deutlich über der Nennleistung, der Motor wäre dort aber überlastet.
4. Der Wirkungsgrad ist bei etwa 1 380 bis 1 420 1/min am höchsten (≈ 67 %). Zu kleineren Drehzahlen fällt er stark, weil die Kupferverluste mit dem Quadrat des Stroms steigen.
5. Individuell.
:::

## Aufgabe 2 – Hochlauf im Stern

Stelle Stern und eine Testspannung von 230 V ein (Klemmbrett umbrücken, Anschlusstest wiederholen) und starte den Hochlauf erneut.

1. Welche Spannung liegt jetzt an jeder Wicklung? Wie groß ist das Verhältnis zur Dreieckschaltung?
2. Wird der Strom begrenzt? Begründe mit den Messwerten.
3. Lies Anzugsmoment und Kippmoment ab und vergleiche mit der Dreieckschaltung. Welchen Faktor erwartest du?
4. Warum lässt sich so die vollständige Kennlinie aufnehmen?
5. Was würde passieren, wenn du im Stern 400 V einstellst?

:::lösung
1. $U_\text{Str} = \dfrac{230\ \text{V}}{\sqrt{3}} = 133\ \text{V}$, also $\dfrac{1}{\sqrt{3}}$ der Wicklungsspannung im Dreieck.
2. Nein: Der größte Strom (im Stillstand) beträgt etwa 1,26 A und bleibt unter der Grenze von 1,5 A (2 · 0,75 A).
3. Erwartet: $\left(\dfrac{1}{\sqrt{3}}\right)^2 = \dfrac{1}{3}$. Gemessen etwa $M_\text{A} \approx 0{,}7\ \text{N·m}$ und $M_\text{K} \approx 1{,}0\ \text{N·m}$ bei rund 1 000 1/min – ein Drittel der Werte ohne Begrenzung (≈ 2,1 und ≈ 3,15 N·m).
4. Ohne Strombegrenzung bleibt die Spannung über die ganze Drehzahl konstant. Die Form der Kennlinie ist dieselbe, nur alle Momente sind gedrittelt und lassen sich zurückrechnen.
5. Jede Wicklung bekommt wieder 231 V wie im Dreieck an 230 V; unter etwa 1 060 1/min greift die Strombegrenzung erneut.
:::

## Aufgabe 3 – Auswertung und Schutz

1. Erkläre mit den Kurven, warum ein Motor dauerhaft nicht links vom Kippmoment betrieben werden darf.
2. Schalte „Erwärmung im Zeitraffer“ ein und fahre im manuellen Modus 1 000 1/min im Dreieck an. Beobachte die Wicklungstemperatur. Was passiert?
3. Warum genügt ein Temperaturfühler in der Wicklung nicht als einziger Schutz, wenn der Motor blockiert?
4. Gegen welchen Fehler schützt ein Temperaturfühler besser als der Motorschutzschalter?
5. Wie ändern sich die gemessenen Werte, wenn die Wicklung heiß ist? Vergleiche einen Messpunkt bei 1 380 1/min kalt und warm.

:::lösung
1. Links vom Kippmoment ist der Arbeitspunkt instabil, der Strom ist ein Vielfaches des Nennstroms und der Wirkungsgrad sehr klein: Fast die ganze aufgenommene Leistung wird zu Wärme.
2. Die Temperatur steigt schnell, bei 110 °C löst der Thermoschutz aus und der Prüfstand schaltet ab.
3. Die Wicklung erwärmt sich beim Blockieren so schnell, dass der Fühler zu träge ist; er misst zudem nur an einer Stelle. Dafür ist der Motorschutzschalter mit seiner stromabhängigen Auslösung da.
4. Gegen langsame Überhitzung, die der Strom nicht zeigt: verschmutzter oder fehlender Lüfter, zu hohe Umgebungstemperatur, häufiges Schalten.
5. Warm sind die Widerstände größer: Bei gleicher Drehzahl sinken Strom, Moment und Leistung leicht; bei gleichem Lastmoment würde die Drehzahl sinken und der Schlupf steigen.
:::
