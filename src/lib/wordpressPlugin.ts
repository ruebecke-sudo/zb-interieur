import { createZip } from './zip'
import type { CategoryLabels } from './categoryLabels'

const SLUG = 'image-manager-pro-galerie'

const php = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

/**
 * Personalised WordPress plugin: the customer's gallery ID and script URL are
 * already inside, so the customer only uploads, activates and writes
 * [image_manager_galerie] on a page.
 */
export function buildWordPressPluginZip(options: { embedId: string; scriptUrl: string; labels: CategoryLabels; workspaceName: string; exampleValue?: string }): Uint8Array {
  const { embedId, scriptUrl, labels, workspaceName } = options
  const example = (options.exampleValue || 'Beispiel').replace(/["<>]/g, '')
  const plugin = `<?php
/**
 * Plugin Name: Image Manager Pro Galerie
 * Description: Zeigt Ihre Bilder aus Image Manager Pro als Galerie. Einfach [image_manager_galerie] auf eine Seite schreiben. Anleitung unter Einstellungen → Image Manager Galerie.
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.0
 * Author: Image Manager Pro
 * License: GPLv2 or later
 * Text Domain: ${SLUG}
 */

if (!defined('ABSPATH')) {
    exit;
}

// Persönliche Einstellungen für den Arbeitsbereich ${workspaceName.replace(/[\r\n]+/g, ' ').replace(/\?>|\*\//g, '')}
define('IMP_GALERIE_ID', ${php(embedId)});
define('IMP_GALERIE_SCRIPT', ${php(scriptUrl)});

function imp_galerie_labels() {
    return array(${labels.map(php).join(', ')});
}

/**
 * Shortcode [image_manager_galerie]
 * Optional: kategorie1="…" kategorie2="…" kategorie3="…" kategorie4="…"
 *           darstellung="galerie|katalog" filter="1-4" spalten="3" anzahl="24" bildnamen="ja|nein" suche="…"
 */
function imp_galerie_shortcode($atts) {
    $a = shortcode_atts(array(
        'kategorie1' => '',
        'kategorie2' => '',
        'kategorie3' => '',
        'kategorie4' => '',
        'spalten'    => '3',
        'anzahl'     => '24',
        'bildnamen'  => 'ja',
        'suche'      => '',
        'darstellung' => '',
        'aussehen'   => 'website',
        'filter'     => '',
    ), $atts, 'image_manager_galerie');

    wp_enqueue_script('image-manager-pro-galerie', IMP_GALERIE_SCRIPT, array(), '1.0.0', true);

    $html = '<div data-image-manager-gallery="' . esc_attr(IMP_GALERIE_ID) . '"';
    for ($i = 1; $i <= 4; $i++) {
        if ($a['kategorie' . $i] !== '') {
            $html .= ' data-category' . $i . '="' . esc_attr($a['kategorie' . $i]) . '"';
        }
    }
    $html .= ' data-columns="' . esc_attr(max(1, min(6, intval($a['spalten'])))) . '"';
    $html .= ' data-limit="' . esc_attr(max(1, min(200, intval($a['anzahl'])))) . '"';
    if (strtolower($a['bildnamen']) === 'nein') {
        $html .= ' data-captions="false"';
    }
    $darstellung = strtolower($a['darstellung']);
    if ($darstellung === 'katalog' || $darstellung === 'galerie') {
        $html .= ' data-style="' . ($darstellung === 'katalog' ? 'catalog' : 'grid') . '"';
    }
    // Default: adopt the theme's font and colours; aussehen="neutral" keeps the own look.
    if (strtolower($a['aussehen']) !== 'neutral') {
        $html .= ' data-theme="site"';
    }
    $filter = intval($a['filter']);
    if ($filter >= 1 && $filter <= 4) {
        $html .= ' data-filter="' . $filter . '"';
    }
    if ($a['suche'] !== '') {
        $html .= ' data-search="' . esc_attr($a['suche']) . '"';
    }
    return $html . '></div>';
}
add_shortcode('image_manager_galerie', 'imp_galerie_shortcode');

// Anleitung unter Einstellungen → Image Manager Galerie
function imp_galerie_admin_menu() {
    add_options_page('Image Manager Galerie', 'Image Manager Galerie', 'edit_pages', '${SLUG}', 'imp_galerie_admin_page');
}
add_action('admin_menu', 'imp_galerie_admin_menu');

function imp_galerie_settings_link($links) {
    array_unshift($links, '<a href="' . esc_url(admin_url('options-general.php?page=${SLUG}')) . '">Anleitung</a>');
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'imp_galerie_settings_link');

function imp_galerie_admin_page() {
    $labels = imp_galerie_labels();
    ?>
    <div class="wrap">
        <h1>Image Manager Galerie</h1>
        <p style="font-size:15px">Das Plugin ist fertig eingerichtet. Sie müssen nichts eintragen.</p>
        <h2>So zeigen Sie Ihre Bilder auf einer Seite</h2>
        <ol style="font-size:14px;line-height:1.8">
            <li>Seite oder Beitrag öffnen und bearbeiten.</li>
            <li>Einen Block <strong>„Shortcode“</strong> einfügen (im Classic Editor einfach in den Text schreiben).</li>
            <li>Diesen Text eintragen: <code>[image_manager_galerie]</code></li>
            <li>Speichern bzw. aktualisieren. Fertig.</li>
        </ol>
        <h2>Nur bestimmte Bilder zeigen</h2>
        <p>Mit den Kategorien aus Ihrem Image Manager filtern Sie die Galerie:</p>
        <table class="widefat striped" style="max-width:820px">
            <tbody>
                <?php foreach ($labels as $index => $label) : ?>
                <tr>
                    <td style="width:180px"><strong><?php echo esc_html($label); ?></strong></td>
                    <td><code>[image_manager_galerie kategorie<?php echo intval($index) + 1; ?>="…"]</code></td>
                </tr>
                <?php endforeach; ?>
                <tr><td><strong>Als Katalog</strong></td><td><code>[image_manager_galerie darstellung="katalog"]</code> (Karten mit Name, Beschreibung, Hinweis und Anfrage-Knopf)</td></tr>
                <tr><td><strong>Filter-Knöpfe</strong></td><td><code>[image_manager_galerie filter="1"]</code> (Knöpfe nach <?php echo esc_html($labels[0]); ?>; 2, 3 oder 4 für die anderen Kategorien)</td></tr>
                <tr><td><strong>Eigenes Aussehen</strong></td><td><code>[image_manager_galerie aussehen="neutral"]</code> (sonst übernimmt die Galerie Schrift und Farben Ihres Themes)</td></tr>
                <tr><td><strong>Spalten</strong></td><td><code>[image_manager_galerie spalten="4"]</code></td></tr>
                <tr><td><strong>Anzahl Bilder</strong></td><td><code>[image_manager_galerie anzahl="12"]</code></td></tr>
                <tr><td><strong>Ohne Bildnamen</strong></td><td><code>[image_manager_galerie bildnamen="nein"]</code></td></tr>
            </tbody>
        </table>
        <p>Beispiel: <code>[image_manager_galerie kategorie1="${example}" spalten="4"]</code> zeigt nur Bilder mit <?php echo esc_html($labels[0]); ?> „${example}“. Den Wert genau so schreiben wie im Image Manager.</p>
        <p style="color:#646970">Neue und geänderte Bilder erscheinen automatisch. Die Galerie muss im Image Manager unter „Galerie &amp; Website“ eingeschaltet sein.</p>
    </div>
    <?php
}
`

  const readme = `=== Image Manager Pro Galerie ===
Stable tag: 1.0.0
Requires at least: 5.0
Requires PHP: 7.0
License: GPLv2 or later

Zeigt Ihre Bilder aus Image Manager Pro als Galerie auf Ihrer WordPress-Seite.

== Installation ==
1. WordPress → Plugins → Installieren → Plugin hochladen → diese ZIP-Datei auswählen → Jetzt installieren.
2. Plugin aktivieren.
3. Auf einer Seite einen Shortcode-Block mit [image_manager_galerie] einfügen.
`

  return createZip([
    { path: `${SLUG}/${SLUG}.php`, content: plugin },
    { path: `${SLUG}/readme.txt`, content: readme },
  ])
}
