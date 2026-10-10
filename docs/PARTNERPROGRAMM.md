# Partnerprogramm – interne Anleitung

Stand: 10.10.2026 · My Digital World (info@my-digital-world.de)
Öffentliche Seite: https://www.my-digital-world.de/partnerprogramm

---

## Konditionen

| Was | Provision |
|---|---|
| Monatsgebühren (Webseiten-Pakete, Image-Manager-Abos) | **30 %, 24 Monate** ab Vertragsbeginn des Kunden |
| Einrichtung einer Webseite | **15 %** einmalig |
| Image Manager Dauerlizenz (499 €) | **30 %** einmalig = 149,70 € |

Grundlage ist der **Umsatz** (Nettobetrag), nicht der Gewinn. Kein Rabatt für den geworbenen
Kunden (kann später ergänzt werden). Die Prozentsätze stehen auf der Seite an einer Stelle:
`my-digital-world-ger/src/pages/Partnerprogramm.tsx`, Konstanten `PROVISION_…` und `MONATE`.

---

## Ablauf

1. **Anmeldung:** kommt über das Formular „partner-anmeldung“ in Netlify (Projekt
   my-digital-world.de → Forms). Tipp: unter *Forms → Form notifications* eine E-Mail an
   info@my-digital-world.de einrichten.
2. **Prüfen und Code vergeben:** kurzer, gut lesbarer Code in Großbuchstaben, z. B. `MUELLER`.
   Der Wunschcode aus dem Formular darf übernommen werden, wenn er noch frei ist.
3. **Partner informieren:** Code, Partnerbedingungen und die zwei Empfehlungs-Links schicken:
   - Webseiten: https://www.my-digital-world.de/aktionspreis-fuer-webseiten
     (Kunde trägt den Code im Fragebogen unter „Domain und Paket“ ein)
   - Image Manager: `https://imagemanager.my-digital-world.de/image-manager/login?partner=CODE`
     (Code ist dann schon ausgefüllt, die Registrierung ist geöffnet)
4. **Partner in die Liste unten eintragen.**
5. **Monatlich abrechnen** (siehe unten), Gutschrift schicken, überweisen.

---

## Zuordnung der Kunden

| Produkt | Wo steht der Code? |
|---|---|
| Webseiten-Pakete | Fragebogen, Feld `partnercode` (Netlify-Formular „fragebogen“) – beim Angebot in die Kundenliste übernehmen |
| Image Manager | Kontodaten des Inhabers (`partner_code`) – Abfrage `image-manager-pro/partner-abrechnung.sql` |

Ohne Code keine Zuordnung. Nachträgliches Eintragen nur, wenn der Kunde es schriftlich bestätigt.

---

## Monatliche Abrechnung

1. **Image Manager:** Abfrage `partner-abrechnung.sql` ausführen (oder Claude fragen). Für jede
   `stripe_customer_id` im Stripe-Dashboard die Zahlungen des Vormonats nachsehen.
   30 % davon, solange `provision_bis` nicht überschritten ist.
2. **Webseiten:** Zahlungseingänge der Webseiten-Kunden mit Partnercode aus der Buchhaltung:
   15 % der Einrichtung (einmalig), 30 % der Monatsgebühr (24 Monate).
3. **Gutschrift** je Partner mit allen Einzelposten erstellen, Umsatzsteuer nach Status des
   Partners (Steuerberater fragen: Gutschrift mit/ohne USt, Kleinunternehmer).
4. Überweisen und in der Liste unten „zuletzt abgerechnet“ eintragen.

Rückbuchungen/Erstattungen eines Kunden werden mit der nächsten Gutschrift verrechnet.

---

## Partnerliste

| Code | Name / Firma | E-Mail | Seit | Zuletzt abgerechnet |
|---|---|---|---|---|
| – | – | – | – | – |

---

## Offen

- Partnerbedingungen rechtlich prüfen lassen: Entwurf in `docs/PARTNERBEDINGUNGEN-ENTWURF.md`
- Steuerliche Behandlung der Gutschriften mit dem Steuerberater klären
- Später möglich: automatische Abrechnung (Stripe-Webhook schreibt Zahlungen je Partner in
  die Datenbank), Partner-Login mit eigener Übersicht, Rabatt für geworbene Kunden
