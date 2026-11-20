---
titel: SPS in Strukturiertem Text programmieren
stufe: mittel
beschreibung: Selbsthaltung, Wendeschützschaltung mit Verriegelung, Timer TON, TOF und TP, Flanken, Zähler, Schrittkette mit CASE und Zweipunktregelung – mit dem SPS-Simulator.
---
# SPS in Strukturiertem Text programmieren

Name: ___  Datum: ___

Arbeite mit dem [SPS-Simulator](../../../steuerung/sps.html). Eingänge, die als Öffner angeschlossen sind, liefern im Ruhezustand 1.

## Aufgabe 1 – Selbsthaltung mit Vorrang

1. Schreibe eine Selbsthaltung mit Vorrang **Start** (Start = Schließer, Stopp = Öffner).
2. Was passiert in beiden Varianten, wenn man Start und Stopp gleichzeitig drückt?
3. Was ist für eine Maschine richtig?

:::lösung
1. `Motor := Start OR (Motor AND Stopp);`
2. Vorrang Stopp (`(Start OR Motor) AND Stopp`): Motor aus. Vorrang Start: Motor an.
3. Vorrang Stopp – Stopp muss immer gewinnen.
:::

## Aufgabe 2 – Wendeschützschaltung

1. Lade das Beispiel „Wendeschützschaltung“. Erkläre, wozu `AND NOT Links` in der Zeile für Rechts dient.
2. Lösche die Verriegelung und drücke beide Taster. Was zeigt das Modell?
3. Warum verriegelt man in der Praxis zusätzlich elektrisch über Hilfskontakte der Schütze?

:::lösung
1. Schützverriegelung: Rechts kann nur einschalten, wenn Links aus ist. `AND NOT S_Links` ist die Tasterverriegelung.
2. Beide Schütze ziehen an – Kurzschluss zwischen zwei Außenleitern, der Motorschutz löst aus.
3. Weil ein verschweißter Schützkontakt oder ein Fehler in der SPS die Programmverriegelung umgehen kann. Die Öffner-Hilfskontakte verhindern das Anziehen auch dann.
:::

## Aufgabe 3 – Zeiten

1. Welcher Baustein passt? (a) Lüfter läuft 3 min nach, wenn das Licht ausgeht. (b) Hupe ertönt genau 2 s nach Tastendruck. (c) Motor startet erst, wenn der Druck 5 s ansteht.
2. Schreibe (c) in ST: Druckschalter `Druck_OK`, Ausgang `Motor`.
3. Baue einen Blinker mit 1 Hz und 25 % Einschaltdauer.

:::lösung
1. (a) TOF, (b) TP, (c) TON.
2. 
```
VAR Verz : TON; END_VAR
Verz(IN := Druck_OK, PT := T#5s);
Motor := Verz.Q;
```
3. Periode 1 s, ein 250 ms, aus 750 ms:
```
VAR T_Ein, T_Aus : TON; END_VAR
T_Ein(IN := Ein AND NOT T_Aus.Q, PT := T#750ms);
T_Aus(IN := T_Ein.Q, PT := T#250ms);
Lampe := T_Ein.Q;
```
:::

## Aufgabe 4 – Flanken und Zähler

1. Warum braucht ein Stromstoßschalter eine Flankenauswertung?
2. Ein Parkhaus hat 50 Plätze. Schreibe mit CTUD: Einfahrt zählt hoch, Ausfahrt runter, Ausgang `Besetzt` ab 50.

:::lösung
1. Ohne Flanke würde der Ausgang in jedem Zyklus umschalten, solange der Taster gedrückt ist – er flackert und bleibt zufällig an oder aus.
2. 
```
VAR Plaetze : CTUD; END_VAR
Plaetze(CU := Einfahrt, CD := Ausfahrt, R := Reset, PV := 50);
Besetzt := Plaetze.QU;
```
:::

## Aufgabe 5 – Schrittkette

Ein Bohrautomat: Schritt 0 warten auf Start; Schritt 1 Bohrer ab, bis Endschalter unten; Schritt 2 Bohrer 2 s halten; Schritt 3 Bohrer auf, bis Endschalter oben, dann Schritt 0.

1. Zeichne den Ablauf als Schrittkette (Schritte und Übergänge).
2. Schreibe das Programm mit CASE.

:::lösung
1. 0 →(Start)→ 1 →(End_Unten)→ 2 →(2 s)→ 3 →(End_Oben)→ 0.
2. 
```
VAR Schritt : INT := 0; T : TON; END_VAR
CASE Schritt OF
  0: IF Start THEN Schritt := 1; END_IF;
  1: IF End_Unten THEN Schritt := 2; END_IF;
  2: T(IN := TRUE, PT := T#2s);
     IF T.Q THEN Schritt := 3; T(IN := FALSE); END_IF;
  3: IF End_Oben THEN Schritt := 0; END_IF;
END_CASE;
Ab := Schritt = 1;
Auf := Schritt = 3;
```
:::

## Aufgabe 6 – Zweipunktregelung

Lade „Füllstand mit Hysterese“.

1. Was passiert, wenn man beide Schwellen auf 50 % setzt? Probiere es mit eingeschaltetem Verbrauch.
2. Ändere das Programm so, dass die Pumpe höchstens 20 s am Stück läuft (Trockenlaufschutz) und dann `Alarm` meldet.

:::lösung
1. Die Pumpe schaltet ständig ein und aus (Flattern) – das verschleißt Schütz und Motor. Die Hysterese verhindert das.
2. Zum Beispiel: `Lauf(IN := Pumpe, PT := T#20s); IF Lauf.Q THEN Pumpe := FALSE; Stoerung := TRUE; END_IF; Alarm := MAX OR NOT MIN OR Stoerung;` mit `Lauf : TON; Stoerung : BOOL;` im VAR-Teil.
:::
