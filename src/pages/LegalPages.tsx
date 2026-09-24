import type { ReactNode } from 'react'
import { site } from '../data/site'

export function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        {site.legalName}
        <br />
        {site.street}
        <br />
        {site.zipCity}
      </p>
      <p>
        Handelsregister: 108769
        <br />
        Registergericht: Saarbrücken
      </p>
      <p>
        Vertreten durch:
        <br />
        Joerg Zenz
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: {site.phone}
        <br />
        E-Mail: {site.email}
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        <br />
        DE355149308
      </p>
      <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
      <p>
        Berufsbezeichnung: Innenarchitekt / Ma
        <br />
        Zuständige Kammer: Wien, Köln
        <br />
        Verliehen in: Österreich, Deutschland
      </p>
      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
      <p className="text-sm text-muted">Quelle: e-recht24.de (Inhalt der Originalseite)</p>
    </LegalLayout>
  )
}

export function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutz">
      <p>
        Wir möchten Sie nachfolgend über die Verarbeitung personenbezogener Daten im Rahmen der
        Nutzung unserer Internetseiten informieren.
      </p>
      <h2>Verantwortlicher</h2>
      <p>
        Verantwortlicher für diese Internetseiten ist Interieur Zenz GmbH. Weitere Angaben zu unserem
        Unternehmen und den vertretungsberechtigten Personen können Sie unserem Impressum entnehmen.
      </p>
      <h2>Rechtsgrundlagen der Datenverarbeitung</h2>
      <ul>
        <li>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
        <li>Erfüllung von Verträgen (Art. 6 Abs. 1 lit. b DSGVO)</li>
        <li>Interessenabwägung (Art. 6 Abs. 1 lit. f DSGVO)</li>
        <li>Erfüllung einer rechtlichen Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO)</li>
      </ul>
      <h2>Zugriffsdaten</h2>
      <p>
        Beim Besuch unserer Seiten werden technisch erforderliche Daten verarbeitet (u. a.
        IP-Adresse bei Fehlerprotokollen max. 7 Tage, Browser/OS, abgerufene Datei, Zeitpunkt,
        Datenmenge, referrernde URL), um die Website darzustellen und Fehler zu beheben.
      </p>
      <h2>Kontaktformular</h2>
      <p>
        Angaben aus dem Kontaktformular werden zur Bearbeitung Ihrer Anfrage verarbeitet. Pflichtfelder
        sind gekennzeichnet; weitere Angaben sind freiwillig. Die Übermittlung erfolgt über
        verschlüsselte Verbindungen (HTTPS). Nach dem Netlify-Deploy werden Formulare über Netlify
        Forms entgegengenommen.
      </p>
      <h2>Cookies & Webanalyse</h2>
      <p>
        Diese Netlify-Version setzt keine Tracking-Cookies von Drittanbietern (kein Stetic/Google
        Analytics in der Standardkonfiguration). Technisch notwendige Cookies von Netlify können
        beim Hosting anfallen.
      </p>
      <h2>Ihre Rechte</h2>
      <p>
        Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Widerspruch und Datenübertragbarkeit sowie ein Beschwerderecht bei einer Aufsichtsbehörde.
      </p>
      <p className="text-sm text-muted">Stand der Originalhinweise: 24.05.2018 – für Netlify-Hosting angepasst.</p>
    </LegalLayout>
  )
}

export function AgbPage() {
  return (
    <LegalLayout title="Allgemeine Verkaufsbedingungen">
      <p>
        Diese Verkaufsbedingungen gelten ausschließlich gegenüber Unternehmern, juristischen Personen
        des öffentlichen Rechts oder öffentlich-rechtlichen Sondervermögen im Sinne von § 310 Abs. 1
        BGB. Entgegenstehende oder von unseren Verkaufsbedingungen abweichende Bedingungen des
        Bestellers erkennen wir nur an, wenn wir ausdrücklich schriftlich der Geltung zustimmen.
      </p>
      <p>
        Diese Verkaufsbedingungen gelten auch für alle zukünftigen Geschäfte mit dem Besteller,
        soweit es sich um Rechtsgeschäfte verwandter Art handelt.
      </p>
      <h2>Angebot und Vertragsabschluss</h2>
      <p>
        Sofern eine Bestellung als Angebot gemäß § 145 BGB anzusehen ist, können wir diese innerhalb
        von zwei Wochen annehmen. An überlassenen Unterlagen (Kalkulationen, Zeichnungen etc.)
        behalten wir uns Eigentums- und Urheberrechte vor.
      </p>
      <h2>Preise und Zahlung</h2>
      <p>
        Sofern nichts Gegenteiliges schriftlich vereinbart wird, gelten unsere Preise ab Werk
        ausschließlich Verpackung und zuzüglich Mehrwertsteuer. Der Kaufpreis ist – sofern nichts
        anderes vereinbart – innerhalb von 10 Tagen nach Lieferung zu zahlen. Skonto nur bei
        schriftlicher Vereinbarung.
      </p>
      <h2>Lieferzeit</h2>
      <p>
        Der Beginn der angegebenen Lieferzeit setzt die rechtzeitige und ordnungsgemäße Erfüllung der
        Verpflichtungen des Bestellers voraus. Bei Annahmeverzug oder Verletzung von
        Mitwirkungspflichten sind wir berechtigt, den entstandenen Schaden ersetzt zu verlangen.
      </p>
      <h2>Eigentumsvorbehalt</h2>
      <p>
        Wir behalten uns das Eigentum an der gelieferten Sache bis zur vollständigen Zahlung
        sämtlicher Forderungen aus dem Liefervertrag vor. Der Besteller ist zur pfleglichen
        Behandlung verpflichtet und zur Weiterveräußerung im normalen Geschäftsverkehr berechtigt,
        wobei Forderungen in Höhe des Rechnungswertes an uns abgetreten werden.
      </p>
      <h2>Gewährleistung und Mängelrüge</h2>
      <p>
        Gewährleistungsrechte setzen voraus, dass der Besteller seinen Untersuchungs- und
        Rügeobliegenheiten nach § 377 HGB nachgekommen ist. Mängelansprüche verjähren in 12 Monaten
        nach Ablieferung, soweit keine längeren gesetzlichen Fristen greifen. Bei Vorliegen eines
        Mangels zum Gefahrübergang leisten wir nach Wahl Nachbesserung oder Ersatzlieferung.
      </p>
      <p className="text-sm text-muted">
        Vollständiger AGB-Text gemäß Originalseite zb-interieur.de/agb/ – bei Bedarf juristisch
        prüfen lassen.
      </p>
    </LegalLayout>
  )
}

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pt-[88px] md:pt-[108px]">
      <section className="bg-fog">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="font-serif text-4xl font-bold">{title}</h1>
        </div>
      </section>
      <article className="legal mx-auto max-w-3xl space-y-4 px-4 py-12 text-[15px] leading-relaxed text-ink [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-muted [&_p]:text-muted">
        {children}
      </article>
    </div>
  )
}
