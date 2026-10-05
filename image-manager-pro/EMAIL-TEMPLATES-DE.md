# Deutsche E-Mail-Vorlagen – Image Manager Pro

Diese Vorlagen sind für die von Supabase Auth versendeten E-Mails vorgesehen.

**Wichtig:** Die E-Mails der Benutzer-Einladung werden von Supabase Auth versendet, nicht von Netlify. Diese Datei dokumentiert die fertigen Texte für die Supabase-Auth-E-Mail-Vorlagen. Das Ändern dieser Datei allein ändert die gehosteten Supabase-E-Mails noch nicht.

## 1. Einladung eines Benutzers

**Betreff**

Einladung zu Image Manager Pro

**HTML-Inhalt**

<p>Hallo,</p>

<p>Sie wurden eingeladen, einen Benutzerzugang für <strong>{{ .Data.workspace_name }}</strong> in Image Manager Pro zu erstellen.</p>

<p>Vorgesehene Rolle: <strong>{{ .Data.invited_role }}</strong></p>

<p>Über den folgenden Button können Sie Ihre Einladung annehmen und Ihr persönliches Passwort festlegen.</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">Einladung annehmen</a></p>

<p>Nach der Einrichtung können Sie sich mit Ihrer E-Mail-Adresse bei Image Manager Pro anmelden.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## 2. E-Mail-Adresse bestätigen

**Betreff**

Bitte bestätigen Sie Ihre E-Mail-Adresse

**HTML-Inhalt**

<p>Hallo,</p>

<p>vielen Dank für Ihre Registrierung bei <strong>Image Manager Pro</strong>.</p>

<p>Bitte bestätigen Sie Ihre E-Mail-Adresse über den folgenden Button:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">E-Mail-Adresse bestätigen</a></p>

<p>Wenn Sie diese Registrierung nicht vorgenommen haben, können Sie diese E-Mail ignorieren.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## 3. Passwort zurücksetzen

**Betreff**

Passwort für Image Manager Pro zurücksetzen

**HTML-Inhalt**

<p>Hallo,</p>

<p>Sie haben angefordert, Ihr Passwort für <strong>Image Manager Pro</strong> zurückzusetzen.</p>

<p>Über den folgenden Button können Sie ein neues Passwort festlegen:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">Passwort zurücksetzen</a></p>

<p>Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## 4. Magic Link / Anmelde-Link

**Betreff**

Ihr Anmelde-Link für Image Manager Pro

**HTML-Inhalt**

<p>Hallo,</p>

<p>über den folgenden Button können Sie sich bei <strong>Image Manager Pro</strong> anmelden:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">Jetzt anmelden</a></p>

<p>Wenn Sie diese Anmeldung nicht angefordert haben, können Sie diese E-Mail ignorieren.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## 5. E-Mail-Adresse ändern

**Betreff**

Änderung Ihrer E-Mail-Adresse bestätigen

**HTML-Inhalt**

<p>Hallo,</p>

<p>Sie haben eine Änderung Ihrer E-Mail-Adresse für <strong>Image Manager Pro</strong> angefordert.</p>

<p>Bitte bestätigen Sie die Änderung über den folgenden Button:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">Änderung bestätigen</a></p>

<p>Wenn Sie diese Änderung nicht angefordert haben, kontaktieren Sie bitte den Administrator Ihres Kontos.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## 6. Sicherheitsbenachrichtigung

**Betreff**

Sicherheitsbenachrichtigung – Image Manager Pro

**HTML-Inhalt**

<p>Hallo,</p>

<p>dies ist eine Sicherheitsbenachrichtigung zu Ihrem Benutzerkonto bei <strong>Image Manager Pro</strong>.</p>

<p>Wenn Sie diese Änderung nicht selbst vorgenommen haben, sollten Sie Ihr Passwort ändern und den Administrator Ihres Kontos kontaktieren.</p>

<p>Viele Grüße<br>
<strong>Image Manager Pro</strong></p>

## Platzhalter

Für die Auth-E-Mails sind insbesondere diese Supabase-Platzhalter relevant:

- `{{ .ConfirmationURL }}` – persönlicher Bestätigungs-/Einladungs-Link
- `{{ .Email }}` – E-Mail-Adresse des Empfängers
- `{{ .Data }}` – Benutzerdaten/Metadaten
- `{{ .Data.workspace_name }}` – Name des eingeladenen Workspaces
- `{{ .Data.invited_role }}` – vorgesehene Benutzerrolle

## Aktueller Einladungsablauf

Image Manager Pro verwendet serverseitig `admin.auth.admin.inviteUserByEmail()`.

Der Ablauf ist:

1. Administrator gibt eine E-Mail-Adresse und Rolle ein.
2. Image Manager Pro legt die Einladung in der Datenbank ab.
3. Image Manager Pro ruft Supabase Auth auf.
4. Supabase Auth versendet die Einladung.
5. Der Empfänger öffnet den Link aus `{{ .ConfirmationURL }}`.
6. Der Benutzer wird dem vorgesehenen Workspace zugeordnet.

Die deutsche E-Mail muss deshalb in den Supabase-Auth-E-Mail-Vorlagen hinterlegt werden.

## Technischer Hinweis

Die Netlify-Umgebungsvariablen steuern die Serverfunktionen von Image Manager Pro. Sie ändern nicht automatisch die von Supabase Auth verwendeten E-Mail-Vorlagen.

Für eine vollständige Anpassung der gehosteten Supabase-E-Mails muss die entsprechende Auth-E-Mail-Konfiguration im Supabase-Projekt geändert werden. Falls die Supabase-Standard-SMTP-Konfiguration die Template-Anpassung für das Projekt einschränkt, ist dafür ggf. ein eigener SMTP-Dienst erforderlich.
