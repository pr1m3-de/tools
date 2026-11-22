---
titel: DNS, HTTP und TLS
stufe: mittel
beschreibung: Ablauf einer DNS-Auflösung, TCP-Handschlag, Umläufe von TLS 1.2, TLS 1.3 und QUIC, Zeit bis zum ersten Byte, Übertragungszeit und kleinste Umlaufzeit aus der Entfernung.
---
# DNS, HTTP und TLS

Name: ___  Datum: ___

Benötigte Formeln: $t_\text{TTFB} \approx n \cdot \text{RTT} + t_S$, $t = \dfrac{8 \cdot S}{B}$, $\text{RTT} \ge \dfrac{2d}{v}$; Glasfaser $v \approx 200\,000\ \tfrac{\text{km}}{\text{s}}$

Zum Ausprobieren: [DNS, HTTP und TLS Schritt für Schritt](../../../it/dns-http-tls.html)

## Aufgabe 1 – DNS

1. Bringe in die richtige Reihenfolge: Nameserver von beispiel.de antwortet mit der IP-Adresse – Browser fragt den Resolver – Resolver fragt einen Root-Server – Resolver fragt den .de-Server.
2. Warum geht die zweite Anfrage nach demselben Namen viel schneller?
3. Ein Webserver zieht um. Warum sehen manche Nutzer noch stundenlang die alte Adresse?

:::lösung
1. Browser fragt den Resolver → Resolver fragt einen Root-Server → Resolver fragt den .de-Server → Nameserver von beispiel.de antwortet
2. Resolver und Browser speichern die Antwort zwischen (Cache).
3. Die alte Antwort darf bis zum Ablauf ihrer TTL zwischengespeichert bleiben.
:::

## Aufgabe 2 – Verbindungsaufbau

1. Benenne die drei Nachrichten des TCP-Handschlags.
2. Wie viele Umläufe braucht der Aufbau einer HTTPS-Verbindung mit TLS 1.2, mit TLS 1.3 und mit HTTP/3 (QUIC), bevor die Anfrage losgeht?
3. Die Umlaufzeit beträgt 30 ms, die Namensauflösung kostet 90 ms, der Server braucht 50 ms. Berechne die Zeit bis zum ersten Byte für TLS 1.3.

:::lösung
1. SYN, SYN-ACK, ACK
2. TLS 1.2: 1 (TCP) + 2 (TLS) = 3; TLS 1.3: 1 + 1 = 2; QUIC: 1
3. $90 + 30 + 30 + 30 + 50 = 230\ \text{ms}$ (DNS, TCP, TLS, Anfrage, Server)
:::

## Aufgabe 3 – Entfernung und Bandbreite

1. Wie groß ist die Umlaufzeit zu einem 1000 km entfernten Server mindestens?
2. Ein Ping zeigt 30 ms. Wie weit kann der Server höchstens entfernt sein?
3. Wie lange dauert die Übertragung von 2 MB bei 50 Mbit/s (ohne Wartezeiten)?
4. Lohnt sich bei einer kleinen Webseite eher ein schnellerer Anschluss oder ein näherer Server? Begründe.

:::lösung
1. $\text{RTT} = \dfrac{2 \cdot 1000}{200\,000}\ \text{s} = 10\ \text{ms}$
2. $d = \dfrac{0{,}03 \cdot 200\,000}{2}\ \text{km} = 3000\ \text{km}$
3. $t = \dfrac{8 \cdot 2}{50}\ \text{s} = 0{,}32\ \text{s}$
4. Ein näherer Server: Bei kleinen Seiten bestimmen die vielen Umläufe die Ladezeit, die Übertragung selbst dauert nur wenige Millisekunden.
:::
