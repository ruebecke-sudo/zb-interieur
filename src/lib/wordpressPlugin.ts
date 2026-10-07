import { createZip } from './zip'
import type { CategoryLabels } from './categoryLabels'

const SLUG = 'image-manager-pro-galerie'
const VERSION = '2.0.2'

const php = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

/**
 * Personalised WordPress plugin: the customer's gallery ID and script URL are
 * already inside, so the customer only uploads, activates and writes
 * [image_manager_galerie] on a page.
 * Stage 2: images are also copied into the WordPress media library and can be
 * shown as a native WordPress gallery (darstellung="wordpress") in the theme's design.
 */
export function buildWordPressPluginZip(options: { embedId: string; scriptUrl: string; labels: CategoryLabels; workspaceName: string; exampleValue?: string }): Uint8Array {
  const { embedId, scriptUrl, labels, workspaceName } = options
  const example = (options.exampleValue || 'Beispiel').replace(/["<>]/g, '')
  const plugin = `<?php
/**
 * Plugin Name: Image Manager Pro Galerie
 * Description: Zeigt Ihre Bilder aus Image Manager Pro als Galerie und übernimmt sie auf Wunsch in die Mediathek. Einfach [image_manager_galerie] auf eine Seite schreiben. Anleitung unter Einstellungen → Image Manager Galerie.
 * Version: ${VERSION}
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
define('IMP_GALERIE_VERSION', '${VERSION}');
// Höchstens so viele neue Bilder pro Abgleich herunterladen (verhindert Zeitüberschreitungen).
define('IMP_GALERIE_BATCH', 10);

function imp_galerie_labels() {
    return array(${labels.map(php).join(', ')});
}

function imp_galerie_base_url() {
    return preg_replace('#/image-manager-embed\\.js.*$#', '', IMP_GALERIE_SCRIPT);
}

/* ---------------------------------------------------------------------------
 * Abgleich mit der WordPress-Mediathek
 * ------------------------------------------------------------------------- */

/** Alle vom Plugin angelegten Anhänge: Image-Manager-ID => Anhang-ID. */
function imp_galerie_existing_attachments() {
    $ids = get_posts(array(
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'meta_query'     => array(array('key' => '_imp_id', 'compare' => 'EXISTS')),
    ));
    $map = array();
    $duplicates = array();
    sort($ids);
    foreach ($ids as $attachment_id) {
        $key = (string) get_post_meta($attachment_id, '_imp_id', true);
        if (isset($map[$key])) {
            $duplicates[] = (int) $attachment_id;
            continue;
        }
        $map[$key] = (int) $attachment_id;
    }
    return array($map, $duplicates);
}

function imp_galerie_apply_meta($attachment_id, $item, $order) {
    $name = isset($item['name']) ? (string) $item['name'] : '';
    $text = isset($item['text']) ? (string) $item['text'] : '';
    wp_update_post(array(
        'ID'           => $attachment_id,
        'post_title'   => $name !== '' ? $name : get_the_title($attachment_id),
        'post_excerpt' => $text,
        'post_content' => $text,
    ));
    update_post_meta($attachment_id, '_wp_attachment_image_alt', $name !== '' ? $name : $text);
    update_post_meta($attachment_id, '_imp_active', '1');
    update_post_meta($attachment_id, '_imp_order', (int) $order);
    update_post_meta($attachment_id, '_imp_note', isset($item['note']) ? (string) $item['note'] : '');
    for ($i = 1; $i <= 4; $i++) {
        update_post_meta($attachment_id, '_imp_c' . $i, isset($item['category' . $i]) ? (string) $item['category' . $i] : '');
    }
}

function imp_galerie_sideload($item) {
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $url = isset($item['url']) ? (string) $item['url'] : '';
    if ($url === '' || !preg_match('#^https://#i', $url)) {
        return new WP_Error('imp_url', 'Ungültige Bildadresse.');
    }
    $tmp = download_url($url, 60);
    if (is_wp_error($tmp)) {
        return $tmp;
    }
    $path = (string) wp_parse_url($url, PHP_URL_PATH);
    $filename = sanitize_file_name(rawurldecode(basename($path)));
    if (!preg_match('/\\.(jpe?g|png|gif|webp|avif)$/i', $filename)) {
        $filename .= '.jpg';
    }
    $attachment_id = media_handle_sideload(array('name' => $filename, 'tmp_name' => $tmp), 0, isset($item['name']) ? (string) $item['name'] : '');
    if (is_wp_error($attachment_id)) {
        @unlink($tmp);
        return $attachment_id;
    }
    update_post_meta($attachment_id, '_imp_id', (string) $item['id']);
    update_post_meta($attachment_id, '_imp_url', $url);
    return (int) $attachment_id;
}

/** Holt die Bildliste, legt neue Bilder an, aktualisiert Texte, blendet entfernte Bilder aus. */
function imp_galerie_sync() {
    // Only one sync at a time (cron and button can overlap). add_option is atomic.
    $lock = get_option('imp_galerie_lock');
    if ($lock && (time() - (int) $lock) > 10 * MINUTE_IN_SECONDS) {
        delete_option('imp_galerie_lock');
    }
    if (!add_option('imp_galerie_lock', time(), '', 'no')) {
        $status = get_option('imp_galerie_status', array());
        $status['busy'] = true;
        return $status;
    }
    try {
        return imp_galerie_run_sync();
    } finally {
        delete_option('imp_galerie_lock');
    }
}

function imp_galerie_run_sync() {
    $response = wp_remote_get(imp_galerie_base_url() . '/.netlify/functions/public-gallery?id=' . rawurlencode(IMP_GALERIE_ID) . '&limit=200', array('timeout' => 20));
    if (is_wp_error($response)) {
        return imp_galerie_store_status(array('error' => 'Image Manager nicht erreichbar: ' . $response->get_error_message()));
    }
    $body = json_decode(wp_remote_retrieve_body($response), true);
    if ((int) wp_remote_retrieve_response_code($response) !== 200 || !is_array($body) || !isset($body['items'])) {
        $message = is_array($body) && isset($body['error']) ? $body['error'] : 'Unerwartete Antwort.';
        return imp_galerie_store_status(array('error' => $message));
    }

    list($existing, $duplicates) = imp_galerie_existing_attachments();
    // Earlier double imports stay in the media library but leave the gallery.
    foreach ($duplicates as $duplicate_id) {
        update_post_meta($duplicate_id, '_imp_active', '0');
    }
    $seen = array();
    $created = 0;
    $updated = 0;
    $pending = 0;
    $errors = array();

    foreach (array_values($body['items']) as $order => $item) {
        if (!isset($item['id'])) {
            continue;
        }
        $key = (string) $item['id'];
        $seen[$key] = true;
        if (isset($existing[$key])) {
            imp_galerie_apply_meta($existing[$key], $item, $order);
            $updated++;
            continue;
        }
        if ($created >= IMP_GALERIE_BATCH) {
            $pending++;
            continue;
        }
        $attachment_id = imp_galerie_sideload($item);
        if (is_wp_error($attachment_id)) {
            $errors[] = (isset($item['name']) ? $item['name'] . ': ' : '') . $attachment_id->get_error_message();
            continue;
        }
        imp_galerie_apply_meta($attachment_id, $item, $order);
        $existing[$key] = $attachment_id;
        $created++;
    }

    // Im Image Manager gelöschte Bilder nur ausblenden, nichts aus der Mediathek löschen.
    $hidden = 0;
    foreach ($existing as $key => $attachment_id) {
        if (!isset($seen[$key])) {
            update_post_meta($attachment_id, '_imp_active', '0');
            $hidden++;
        }
    }

    return imp_galerie_store_status(array(
        'created' => $created,
        'updated' => $updated,
        'pending' => $pending,
        'hidden'  => $hidden,
        'total'   => count($existing) - $hidden,
        'errors'  => array_slice($errors, 0, 5),
    ));
}

function imp_galerie_store_status($status) {
    $status['time'] = current_time('mysql');
    update_option('imp_galerie_status', $status, false);
    return $status;
}

add_action('imp_galerie_sync_event', 'imp_galerie_sync');

function imp_galerie_schedule() {
    if (!wp_next_scheduled('imp_galerie_sync_event')) {
        wp_schedule_event(time() + 60, 'hourly', 'imp_galerie_sync_event');
    }
}
register_activation_hook(__FILE__, 'imp_galerie_schedule');
add_action('init', 'imp_galerie_schedule');

function imp_galerie_unschedule() {
    wp_clear_scheduled_hook('imp_galerie_sync_event');
}
register_deactivation_hook(__FILE__, 'imp_galerie_unschedule');

function imp_galerie_handle_sync_button() {
    if (!current_user_can('upload_files')) {
        wp_die('Keine Berechtigung.');
    }
    check_admin_referer('imp_galerie_sync');
    $result = imp_galerie_sync();
    wp_safe_redirect(admin_url('options-general.php?page=${SLUG}&abgleich=1' . (!empty($result['busy']) ? '&busy=1' : '')));
    exit;
}
add_action('admin_post_imp_galerie_sync', 'imp_galerie_handle_sync_button');

/* ---------------------------------------------------------------------------
 * Shortcode
 * ------------------------------------------------------------------------- */

/**
 * Shortcode [image_manager_galerie]
 * Optional: kategorie1="…" kategorie2="…" kategorie3="…" kategorie4="…"
 *           darstellung="galerie|katalog|wordpress" filter="1-4" spalten="3" anzahl="24"
 *           bildnamen="ja|nein" suche="…" aussehen="website|neutral"
 */
function imp_galerie_shortcode($atts) {
    $a = shortcode_atts(array(
        'kategorie1'  => '',
        'kategorie2'  => '',
        'kategorie3'  => '',
        'kategorie4'  => '',
        'spalten'     => '3',
        'anzahl'      => '24',
        'bildnamen'   => 'ja',
        'suche'       => '',
        'darstellung' => '',
        'aussehen'    => 'website',
        'filter'      => '',
    ), $atts, 'image_manager_galerie');

    $columns = max(1, min(6, intval($a['spalten'])));
    $limit = max(1, min(200, intval($a['anzahl'])));
    $darstellung = strtolower($a['darstellung']);

    // Bilder aus der Mediathek als echte WordPress-Galerie (Design des Themes).
    if ($darstellung === 'wordpress') {
        $meta_query = array(array('key' => '_imp_active', 'value' => '1'));
        for ($i = 1; $i <= 4; $i++) {
            if ($a['kategorie' . $i] !== '') {
                $meta_query[] = array('key' => '_imp_c' . $i, 'value' => $a['kategorie' . $i]);
            }
        }
        $ids = get_posts(array(
            'post_type'      => 'attachment',
            'post_status'    => 'inherit',
            'posts_per_page' => $limit,
            'fields'         => 'ids',
            'meta_query'     => $meta_query,
            'meta_key'       => '_imp_order',
            'orderby'        => 'meta_value_num',
            'order'          => 'ASC',
        ));
        if (!$ids) {
            return current_user_can('upload_files')
                ? '<p><em>Noch keine Bilder in der Mediathek. Unter Einstellungen → Image Manager Galerie auf „Jetzt abgleichen“ klicken.</em></p>'
                : '';
        }
        return imp_galerie_block_gallery($ids, $columns, strtolower($a['bildnamen']) !== 'nein');
    }

    wp_enqueue_script('image-manager-pro-galerie', IMP_GALERIE_SCRIPT, array(), IMP_GALERIE_VERSION, true);

    $html = '<div data-image-manager-gallery="' . esc_attr(IMP_GALERIE_ID) . '"';
    for ($i = 1; $i <= 4; $i++) {
        if ($a['kategorie' . $i] !== '') {
            $html .= ' data-category' . $i . '="' . esc_attr($a['kategorie' . $i]) . '"';
        }
    }
    $html .= ' data-columns="' . esc_attr($columns) . '"';
    $html .= ' data-limit="' . esc_attr($limit) . '"';
    if (strtolower($a['bildnamen']) === 'nein') {
        $html .= ' data-captions="false"';
    }
    if ($darstellung === 'katalog' || $darstellung === 'galerie') {
        $html .= ' data-style="' . ($darstellung === 'katalog' ? 'catalog' : 'grid') . '"';
    }
    // Standard: Schrift und Farben des Themes übernehmen; aussehen="neutral" behält das eigene Aussehen.
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

/**
 * Core gallery block (not the classic [gallery] markup): block themes such as
 * Twenty Twenty-Five only style the block, classic themes style both.
 */
function imp_galerie_block_gallery($ids, $columns, $captions) {
    $inner = '';
    foreach ($ids as $attachment_id) {
        $large = wp_get_attachment_image_url($attachment_id, 'large');
        $full = wp_get_attachment_url($attachment_id);
        if (!$large || !$full) {
            continue;
        }
        $alt = (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
        $caption = $captions ? (string) wp_get_attachment_caption($attachment_id) : '';
        $inner .= '<!-- wp:image {"id":' . intval($attachment_id) . ',"sizeSlug":"large","linkDestination":"media"} -->'
            . '<figure class="wp-block-image size-large"><a href="' . esc_url($full) . '">'
            . '<img src="' . esc_url($large) . '" alt="' . esc_attr($alt) . '" class="wp-image-' . intval($attachment_id) . '"/></a>'
            . ($caption !== '' ? '<figcaption class="wp-element-caption">' . esc_html($caption) . '</figcaption>' : '')
            . '</figure><!-- /wp:image -->';
    }
    $markup = '<!-- wp:gallery {"columns":' . intval($columns) . ',"linkTo":"media"} -->'
        . '<figure class="wp-block-gallery has-nested-images columns-' . intval($columns) . ' is-cropped">' . $inner . '</figure>'
        . '<!-- /wp:gallery -->';
    return do_blocks($markup);
}

/* ---------------------------------------------------------------------------
 * Anleitung unter Einstellungen → Image Manager Galerie
 * ------------------------------------------------------------------------- */

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
    $status = get_option('imp_galerie_status', array());
    ?>
    <div class="wrap">
        <h1>Image Manager Galerie</h1>
        <p style="font-size:15px">Das Plugin ist fertig eingerichtet. Sie müssen nichts eintragen.</p>

        <div class="card" style="max-width:820px;padding:16px 20px">
            <h2 style="margin-top:0">🖼️ Bilder in der Mediathek</h2>
            <?php if (!empty($status['error'])) : ?>
                <p style="color:#b32d2e"><strong>Letzter Abgleich fehlgeschlagen:</strong> <?php echo esc_html($status['error']); ?></p>
            <?php elseif (!empty($status['time'])) : ?>
                <?php if (!empty($_GET['busy'])) : ?><p style="color:#996800">Ein Abgleich läuft gerade bereits. Bitte in einer Minute die Seite neu laden.</p><?php endif; ?>
                <p><strong><?php echo intval($status['total']); ?> Bilder</strong> in der Mediathek · zuletzt abgeglichen am <?php echo esc_html(mysql2date('d.m.Y \\u\\m H:i', $status['time'])); ?> Uhr
                <?php if (!empty($status['created'])) : ?> · <?php echo intval($status['created']); ?> neu<?php endif; ?></p>
                <?php if (!empty($status['pending'])) : ?>
                    <p style="color:#996800"><strong>Noch <?php echo intval($status['pending']); ?> Bilder ausstehend.</strong> Bitte noch einmal auf „Jetzt abgleichen“ klicken, oder sie kommen beim nächsten automatischen Abgleich.</p>
                <?php endif; ?>
                <?php if (!empty($status['errors'])) : ?>
                    <p style="color:#b32d2e">Nicht übernommen: <?php echo esc_html(implode(' · ', $status['errors'])); ?></p>
                <?php endif; ?>
            <?php else : ?>
                <p>Noch nicht abgeglichen. Klicken Sie auf „Jetzt abgleichen“.</p>
            <?php endif; ?>
            <p style="color:#646970">Der Abgleich läuft automatisch jede Stunde. Neue Bilder und geänderte Texte werden übernommen. Bilder, die Sie im Image Manager löschen, verschwinden aus der Galerie, bleiben aber in der Mediathek.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="imp_galerie_sync" />
                <?php wp_nonce_field('imp_galerie_sync'); ?>
                <?php submit_button('Jetzt abgleichen', 'primary', 'submit', false); ?>
            </form>
        </div>

        <h2>So zeigen Sie Ihre Bilder auf einer Seite</h2>
        <ol style="font-size:14px;line-height:1.8">
            <li>Seite oder Beitrag öffnen und bearbeiten.</li>
            <li>Einen Block <strong>„Shortcode“</strong> einfügen (im Classic Editor einfach in den Text schreiben).</li>
            <li>Einen dieser Texte eintragen:
                <ul style="list-style:disc;margin-left:20px">
                    <li><code>[image_manager_galerie darstellung="wordpress"]</code>, Galerie aus Ihrer Mediathek, im Design Ihres Themes</li>
                    <li><code>[image_manager_galerie darstellung="katalog" filter="1"]</code>, Katalog mit Beschreibung, Filter-Knöpfen und Anfrage-Knopf</li>
                    <li><code>[image_manager_galerie]</code>, Bildergalerie mit Großansicht</li>
                </ul>
            </li>
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
                <tr><td><strong>Filter-Knöpfe</strong></td><td><code>[image_manager_galerie filter="1"]</code> (Knöpfe nach <?php echo esc_html($labels[0]); ?>; 2, 3 oder 4 für die anderen Kategorien; nicht bei darstellung="wordpress")</td></tr>
                <tr><td><strong>Eigenes Aussehen</strong></td><td><code>[image_manager_galerie aussehen="neutral"]</code> (sonst übernimmt die Galerie Schrift und Farben Ihres Themes)</td></tr>
                <tr><td><strong>Spalten</strong></td><td><code>[image_manager_galerie spalten="4"]</code></td></tr>
                <tr><td><strong>Anzahl Bilder</strong></td><td><code>[image_manager_galerie anzahl="12"]</code></td></tr>
                <tr><td><strong>Ohne Bildnamen</strong></td><td><code>[image_manager_galerie bildnamen="nein"]</code></td></tr>
            </tbody>
        </table>
        <p>Beispiel: <code>[image_manager_galerie darstellung="wordpress" kategorie1="${example}" spalten="4"]</code> zeigt nur Bilder mit <?php echo esc_html($labels[0]); ?> „${example}“. Den Wert genau so schreiben wie im Image Manager.</p>
        <p style="color:#646970">Die Galerie muss im Image Manager unter „Galerie &amp; Website“ eingeschaltet sein.</p>
    </div>
    <?php
}
`

  const readme = `=== Image Manager Pro Galerie ===
Stable tag: ${VERSION}
Requires at least: 5.0
Requires PHP: 7.0
License: GPLv2 or later

Zeigt Ihre Bilder aus Image Manager Pro als Galerie auf Ihrer WordPress-Seite und übernimmt sie in die Mediathek.

== Installation ==
1. WordPress → Plugins → Neues Plugin hinzufügen → Plugin hochladen → diese ZIP-Datei auswählen → Jetzt installieren.
2. Plugin aktivieren.
3. Unter Einstellungen → Image Manager Galerie auf „Jetzt abgleichen“ klicken.
4. Auf einer Seite einen Shortcode-Block mit [image_manager_galerie darstellung="wordpress"] einfügen.
`

  return createZip([
    { path: `${SLUG}/${SLUG}.php`, content: plugin },
    { path: `${SLUG}/readme.txt`, content: readme },
  ])
}
