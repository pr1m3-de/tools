---
titel: Elektromagnetismus – Feld, Kraft und Induktion
stufe: leicht
beschreibung: Mit den Animationen: Magnetfeld um einen Leiter, Kraft auf einen Leiter im Magnetfeld, Gleichstrommotor mit Kommutator, Induktion mit Magnet und Spule, Wechselstrom- und Drehstromgenerator, Klingel als Selbstunterbrecher.
---
# Elektromagnetismus – Feld, Kraft und Induktion

Name: ___  Datum: ___

Benötigte Formeln: $B = \dfrac{\mu_0 \cdot I}{2 \pi \cdot r}$ mit $\mu_0 = 4\pi \cdot 10^{-7}\ \tfrac{\text{V·s}}{\text{A·m}}$, $F = B \cdot I \cdot l$, $u_\text{i} = -N \cdot \dfrac{\Delta\Phi}{\Delta t}$, $\hat{u} = N \cdot B \cdot A \cdot \omega$, $f = \dfrac{p \cdot n}{60}$

Animationen: [Elektromagnetismus](../../../elektro/elektromagnetismus.html)

## Aufgabe 1 – Magnetfeld um einen Leiter

1. Beschreibe Form und Richtung der Feldlinien um einen Leiter, in den der Strom hineinfließt. Welche Regel hilft dir?
2. Was passiert mit den Kompassnadeln, wenn du die Stromrichtung umkehrst?
3. Berechne die Flussdichte im Abstand 3 cm von einem Leiter mit 10 A.
4. In welchem Abstand ist das Feld so stark wie das Erdmagnetfeld (≈ 50 µT)? Was folgt daraus für einen Kompass neben einer Leitung?

:::lösung
1. Konzentrische Kreise um den Leiter, von vorn gesehen im Uhrzeigersinn. Rechte-Faust-Regel: Daumen in Stromrichtung, die gekrümmten Finger zeigen die Feldrichtung.
2. Sie drehen sich um 180°, weil das Feld seine Richtung umkehrt.
3. $B = \dfrac{4\pi \cdot 10^{-7} \cdot 10\ \text{A}}{2\pi \cdot 0{,}03\ \text{m}} = 66{,}7\ \mu\text{T}$
4. $r = \dfrac{\mu_0 \cdot I}{2\pi \cdot B} = \dfrac{2 \cdot 10^{-7} \cdot 10}{50 \cdot 10^{-6}}\ \text{m} = 4\ \text{cm}$. Ein Kompass neben einer stromführenden Leitung zeigt falsch; bei Wechselstrom zittert er nur, weil sich das Feld 100-mal je Sekunde umkehrt.
:::

## Aufgabe 2 – Leiterschaukel

1. Bei Strom 5 A, Nordpol oben und Strom in die Bildebene: In welche Richtung schwingt der Leiter aus? Überprüfe mit der Drei-Finger-Regel.
2. Berechne die Kraft für B = 0,12 T, l = 6 cm und I = 5 A.
3. Nenne zwei Möglichkeiten, die Kraftrichtung umzukehren. Was passiert, wenn du beide gleichzeitig änderst?
4. Warum pendelt die Schaukel ein paarmal, bevor sie in der ausgelenkten Lage stehen bleibt?

:::lösung
1. Nach links (Daumen in die Bildebene, Zeigefinger von N nach S also nach unten, Mittelfinger nach links).
2. $F = 0{,}12\ \text{T} \cdot 5\ \text{A} \cdot 0{,}06\ \text{m} = 0{,}036\ \text{N} = 36\ \text{mN}$
3. Stromrichtung umkehren oder Magnet umdrehen. Beides zusammen: Die Richtung bleibt gleich.
4. Die Kraft setzt plötzlich ein, der Leiter schwingt über die Gleichgewichtslage hinaus; Reibung dämpft die Schwingung.
:::

## Aufgabe 3 – Gleichstrommotor

1. Erkläre, warum sich die Spule dreht. Zeichne die Kräfte auf beide Leiterseiten ein.
2. Wähle „Kommutator weggelassen“. Was beobachtest du, und warum?
3. Welche Aufgabe hat der Kommutator, und wann genau polt er um?
4. Warum sinkt der Strom, wenn der Motor schneller wird?

:::lösung
1. Die beiden Leiterseiten werden gegensinnig vom Strom durchflossen. Im Feld wirkt auf die eine Seite eine Kraft nach oben, auf die andere nach unten: ein Kräftepaar, das ein Drehmoment bildet.
2. Die Spule dreht sich bis zur Stellung quer zum Feld, pendelt darüber hinaus und zurück und bleibt dort stehen: Nach jeder halben Umdrehung wirkt das Moment in die Gegenrichtung.
3. Er polt den Strom in der Spule bei jeder halben Umdrehung um, und zwar im Totpunkt (Spulenebene quer zum Feld). So wirkt das Moment immer in dieselbe Richtung.
4. Die drehende Spule induziert selbst eine Spannung, die der angelegten entgegenwirkt (Gegenspannung). Je schneller, desto größer sie – und desto kleiner der Strom.
:::

## Aufgabe 4 – Induktion

1. Unter welcher Bedingung zeigt das Messgerät eine Spannung an? Teste mit „von Hand“.
2. Wie ändert sich die Spannung, wenn du schneller bewegst, die Windungszahl verdoppelst oder den Magneten umdrehst?
3. Erkläre mit der Lenzschen Regel, warum man beim Hineinschieben des Magneten eine Gegenkraft spürt, wenn die Spule kurzgeschlossen ist.
4. Der Fluss durch eine Spule mit 600 Windungen steigt in 0,1 s gleichmäßig von 0 auf 0,2 mWb. Berechne die induzierte Spannung.

:::lösung
1. Nur solange sich der Fluss durch die Spule ändert, also solange sich der Magnet bewegt.
2. Schneller: größere Spannung. Doppelte Windungszahl: doppelte Spannung. Magnet umgedreht: umgekehrtes Vorzeichen.
3. Der Induktionsstrom macht die Spule zu einem Magneten, dessen Pol dem nahenden Magneten gleichnamig gegenübersteht – er stößt ihn ab und wirkt so der Ursache (der Flusszunahme) entgegen.
4. $u_\text{i} = 600 \cdot \dfrac{0{,}2 \cdot 10^{-3}\ \text{Wb}}{0{,}1\ \text{s}} = 1{,}2\ \text{V}$ (Betrag)
:::

## Aufgabe 5 – Generatoren und Klingel

1. Eine Spule mit 100 Windungen und 25 cm² Fläche dreht sich mit 1 500 1/min in einem Feld von 0,25 T. Berechne Scheitel- und Effektivwert der Spannung sowie die Frequenz.
2. Wie sieht die Spannung aus, wenn du statt Schleifringen einen Kommutator verwendest?
3. Wie schnell muss ein Drehstromgenerator mit 2 Polpaaren für 50 Hz drehen?
4. Erkläre, warum die Klingel immer wieder schlägt, solange der Taster gedrückt ist.

:::lösung
1. $\omega = 2\pi \cdot 25\ \tfrac{1}{\text{s}} = 157\ \tfrac{1}{\text{s}}$, $\hat{u} = 100 \cdot 0{,}25\ \text{T} \cdot 0{,}0025\ \text{m}^2 \cdot 157\ \tfrac{1}{\text{s}} = 9{,}8\ \text{V}$, $U = 6{,}9\ \text{V}$, $f = 25\ \text{Hz}$
2. Pulsierende Gleichspannung: Die negativen Halbwellen werden umgeklappt.
3. $n = \dfrac{60 \cdot 50}{2} = 1\,500\ \tfrac{1}{\text{min}}$
4. Selbstunterbrecher: Strom fließt über den Kontakt, der Elektromagnet zieht den Anker an und öffnet dabei den Kontakt. Ohne Strom zieht die Blattfeder den Anker zurück, der Kontakt schließt, und alles beginnt von vorn.
:::
