---
titel: Audioformate – Bitrate, Größe und Klang
stufe: mittel
beschreibung: PCM-Datenrate, Dateigrößen von WAV, FLAC, MP3 und Opus, Kompressionsfaktor, Abtasttheorem und Aliasing, Dynamikumfang, Hörlabor mit Spektrogramm und ABX-Blindtest.
---
# Audioformate – Bitrate, Größe und Klang

Name: ___  Datum: ___

Benötigte Formeln: $R = f_\text{A} \cdot n \cdot k$, $S = \dfrac{R \cdot t}{8}$, $k = \dfrac{R_\text{PCM}}{R}$, $f_\text{A} > 2 f_\text{max}$, $D \approx 6{,}02\ \text{dB} \cdot n + 1{,}76\ \text{dB}$

Zum Ausprobieren: [Audioformate](../../../it/audioformate.html)

## Aufgabe 1 – Unkomprimiert

1. Berechne die Datenrate der CD (44,1 kHz, 16 bit, Stereo).
2. Wie groß ist ein Lied von 3:30 min als WAV?
3. Ein Studio nimmt mit 96 kHz, 24 bit, Stereo auf. Wie viel Speicher braucht eine Minute?
4. Berechne den Dynamikumfang für 16 bit und für 24 bit.

:::lösung
1. $R = 44{,}1\ \text{kHz} \cdot 16\ \text{bit} \cdot 2 = 1\,411{,}2\ \tfrac{\text{kbit}}{\text{s}}$
2. $S = \dfrac{1\,411{,}2 \cdot 210}{8\,000}\ \text{MB} = 37{,}0\ \text{MB}$
3. $R = 96 \cdot 24 \cdot 2 = 4\,608\ \tfrac{\text{kbit}}{\text{s}}$, je Minute $\dfrac{4\,608 \cdot 60}{8\,000}\ \text{MB} = 34{,}6\ \text{MB}$
4. 16 bit: $6{,}02 \cdot 16 + 1{,}76 = 98\ \text{dB}$; 24 bit: $146\ \text{dB}$ – mehr als das Ohr zwischen Hörschwelle und Schmerzgrenze verarbeiten kann.
:::

## Aufgabe 2 – Komprimiert

1. Dasselbe Lied als MP3 mit 128 kbit/s: Wie groß ist es, und wie groß ist der Kompressionsfaktor?
2. Wie viele Bit bleiben im MP3 im Mittel für einen Abtastwert?
3. FLAC braucht bei Popmusik etwa 58 % der WAV-Größe. Wie groß wird das Lied?
4. Wie viele solcher Lieder passen auf 32 GB als FLAC und als Opus mit 128 kbit/s?
5. Wie viel Datenvolumen verbraucht eine Stunde Streaming mit 160 kbit/s?

:::lösung
1. $S = \dfrac{128 \cdot 210}{8\,000}\ \text{MB} = 3{,}36\ \text{MB}$, $k = \dfrac{1\,411{,}2}{128} = 11$
2. $\dfrac{128\,000}{44\,100 \cdot 2} = 1{,}45\ \text{bit}$ statt 16 bit.
3. $0{,}58 \cdot 37{,}0\ \text{MB} = 21{,}5\ \text{MB}$
4. FLAC: $\dfrac{32\,000}{21{,}5} \approx 1\,490$ Lieder; Opus 128 kbit/s: $\dfrac{32\,000}{3{,}36} \approx 9\,520$ Lieder.
5. $\dfrac{160 \cdot 3\,600}{8\,000}\ \text{MB} = 72\ \text{MB}$
:::

## Aufgabe 3 – Abtastung

Nutze die Ansicht „Abtastung und Aliasing“.

1. Welche höchste Frequenz kann eine CD wiedergeben?
2. Ein Ton mit 30 kHz wird ohne Filter mit 44,1 kHz abgetastet. Welche Frequenz hört man nach der Wiedergabe?
3. Warum hat jedes Aufnahmegerät vor dem Wandler einen Tiefpass?
4. Stelle in der Lupe 3 bit ein. Was beobachtest du, und wie klingt das?

:::lösung
1. $f_\text{max} = \dfrac{44{,}1\ \text{kHz}}{2} = 22{,}05\ \text{kHz}$
2. $|30 - 44{,}1|\ \text{kHz} = 14{,}1\ \text{kHz}$ – ein Ton, der im Original gar nicht vorkam (Aliasing).
3. Damit keine Frequenzen über der halben Abtastrate in den Wandler gelangen und als falsche Töne erscheinen.
4. Nur 8 Stufen: Die Kurve wird zur Treppe. Der Fehler klingt als lautes Rauschen und Verzerrung (Dynamik nur etwa 20 dB).
:::

## Aufgabe 4 – Hörlabor

1. Stelle MP3 mit 64 kbit/s ein und vergleiche das Spektrogramm mit dem Original. Wo liegt die obere Grenze? Wie klingt das?
2. Stelle Opus mit 64 kbit/s ein. Was ist anders, im Bild und beim Hören?
3. Höre bei MP3 mit 64 kbit/s das Differenzsignal. Was hat der Codierer weggelassen?
4. Mache einen ABX-Test mit MP3 128 kbit/s und mit Opus 128 kbit/s (je 16 Durchgänge, Kopfhörer). Notiere die Ergebnisse.
5. Warum sagt der Rauschabstand (in dB) bei verlustbehafteten Formaten wenig über den Klang aus?

:::lösung
1. Bei etwa 11 kHz ist das Spektrum abgeschnitten; der Klang ist dumpf, Becken und S-Laute fehlen, dazu zwitschernde Artefakte.
2. Opus überträgt bis 20 kHz und füllt Lücken mit Rauschen in der richtigen Lautstärke: heller, voller Klang, eher leicht rauschig.
3. Vor allem die hohen Frequenzen und Anteile, die von lauteren Tönen verdeckt werden (Quantisierungsrauschen).
4. Individuell. Bei 128 kbit/s erreichen viele Hörer bei Opus kein sicheres Ergebnis; bei MP3 gelingt es mit geübtem Gehör und kritischem Material eher.
5. Der Codierer verteilt das Rauschen gezielt dorthin, wo es verdeckt wird. Ein Signal mit kleinem Rauschabstand kann deshalb besser klingen als eines mit großem (Opus füllt sogar bewusst Rauschen ein).
:::
