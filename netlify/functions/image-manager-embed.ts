/**
 * Serves the embed script customers put on their website:
 *   <div data-image-manager-gallery="EMBED_ID" data-style="catalog" data-filter="1"></div>
 *   <script src="https://<app-domain>/image-manager-embed.js" async></script>
 * Attributes: data-style grid|catalog (default: workspace setting), data-filter 1-4
 * (filter buttons for that category), data-category1..4, data-search, data-limit,
 * data-columns, data-captions=false, data-gap.
 * Reads images from public-gallery and renders a grid or product catalog with a
 * lightbox, isolated from the host page's CSS via Shadow DOM.
 */
const EMBED_SCRIPT = String.raw`(function () {
  'use strict';
  var current = document.currentScript || [].slice.call(document.querySelectorAll('script[src*="image-manager-embed.js"]')).pop();
  var BASE = current ? new URL(current.src, location.href).origin : location.origin;

  var STYLE = [
    ':host{display:block;--accent:#0E675A}',
    '.filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}',
    '.chip{font:500 14px/1 system-ui,sans-serif;padding:9px 14px;border-radius:999px;border:1px solid #d0d5dd;background:#fff;color:#344054;cursor:pointer}',
    '.chip.on{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.grid{display:grid;gap:var(--gap,12px);grid-template-columns:repeat(var(--cols,3),minmax(0,1fr))}',
    '@media (max-width:600px){.grid{grid-template-columns:repeat(var(--cols-m,2),minmax(0,1fr))}}',
    '@media (max-width:420px){.grid.catalog{grid-template-columns:minmax(0,1fr)}}',
    'figure{margin:0;cursor:zoom-in}',
    'img.thumb{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;background:#f1f3f5;transition:opacity .2s,transform .2s}',
    'figure:hover img.thumb{opacity:.92;transform:scale(1.01)}',
    'figcaption{margin-top:6px;font:500 14px/1.35 system-ui,sans-serif;color:inherit}',
    '.card{display:flex;flex-direction:column;background:#fff;border:1px solid #eaecf0;border-radius:14px;overflow:hidden;color:#101828}',
    '.card img.thumb{border-radius:0;cursor:zoom-in}',
    '.body{display:flex;flex-direction:column;flex:1;padding:14px 16px 16px;font:14px/1.5 system-ui,sans-serif}',
    '.kicker{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}',
    '.title{margin:4px 0 0;font-size:17px;font-weight:700;line-height:1.3}',
    '.text{margin:6px 0 0;color:#475467;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
    '.note{margin:10px 0 0;font-weight:600;color:var(--accent)}',
    '.ask{margin-top:auto;padding-top:14px}',
    '.btn{display:inline-block;font:600 14px/1 system-ui,sans-serif;padding:11px 16px;border-radius:10px;background:var(--accent);color:#fff;text-decoration:none}',
    '.btn:hover{filter:brightness(.92)}',
    '.msg{font:14px system-ui,sans-serif;color:#667085;padding:16px 0}',
    '.box{position:fixed;inset:0;z-index:2147483000;background:rgba(10,12,16,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}',
    '.box img{max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px}',
    '.box .cap{color:#fff;font:15px/1.5 system-ui,sans-serif;text-align:center;max-width:720px;margin-top:12px}',
    '.box .cap b{display:block;font-weight:600}',
    '.box .cap .note{color:#fff;opacity:.9}',
    '.box .cap .btn{margin-top:12px}',
    '.box button{position:absolute;background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:999px;width:44px;height:44px;font-size:22px;cursor:pointer}',
    '.box button:hover{background:rgba(255,255,255,.25)}',
    '.close{top:16px;right:16px}.prev{left:16px;top:50%}.next{right:16px;top:50%}'
  ].join('');

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function inquiryLink(settings, item) {
    var inquiry = settings && settings.inquiry;
    if (!inquiry) return null;
    var href = inquiry.mode === 'email'
      ? 'mailto:' + inquiry.email + '?subject=' + encodeURIComponent('Anfrage zu: ' + (item.name || 'Bild')) + '&body=' + encodeURIComponent('Guten Tag,\n\nich interessiere mich für „' + (item.name || 'dieses Bild') + '“.\n\n')
      : inquiry.url;
    if (!href || (inquiry.mode === 'link' && !/^https?:\/\//i.test(href))) return null;
    var a = el('a', 'btn', inquiry.label || 'Jetzt anfragen');
    a.href = href;
    if (inquiry.mode === 'link') { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  function render(host) {
    var id = host.getAttribute('data-image-manager-gallery');
    if (!id) return;
    var base = host.getAttribute('data-base') || BASE;
    var cols = Math.min(Math.max(parseInt(host.getAttribute('data-columns') || '3', 10) || 3, 1), 6);
    var captions = host.getAttribute('data-captions') !== 'false';
    var filterSlot = parseInt(host.getAttribute('data-filter') || '0', 10);
    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.innerHTML = '';
    // Only the latest render of this element may write its result.
    var token = (host.__imageManagerRender || 0) + 1;
    host.__imageManagerRender = token;
    function stale() { return host.__imageManagerRender !== token; }

    var style = el('style'); style.textContent = STYLE; root.appendChild(style);
    var filters = el('div', 'filters'); root.appendChild(filters);
    var grid = el('div', 'grid');
    grid.style.setProperty('--cols', String(cols));
    grid.style.setProperty('--cols-m', String(Math.min(cols, 2)));
    if (host.getAttribute('data-gap')) grid.style.setProperty('--gap', host.getAttribute('data-gap') + 'px');
    root.appendChild(grid);
    var msg = el('div', 'msg', 'Bilder werden geladen …'); root.appendChild(msg);

    var params = new URLSearchParams({ id: id });
    [1, 2, 3, 4].forEach(function (slot) {
      var value = host.getAttribute('data-category' + slot);
      if (value) params.set('c' + slot, value);
    });
    if (host.getAttribute('data-search')) params.set('q', host.getAttribute('data-search'));
    if (host.getAttribute('data-limit')) params.set('limit', host.getAttribute('data-limit'));

    fetch(base + '/.netlify/functions/public-gallery?' + params.toString())
      .then(function (res) { return res.json().then(function (body) { if (!res.ok) throw new Error(body.error || 'Fehler'); return body; }); })
      .then(function (body) {
        if (stale()) return;
        var items = body.items || [];
        var settings = body.settings || {};
        var catalog = (host.getAttribute('data-style') || settings.style) === 'catalog';
        if (settings.primaryColor) root.host.style.setProperty('--accent', settings.primaryColor);
        grid.classList.toggle('catalog', catalog);
        msg.remove();
        if (!items.length) { root.appendChild(el('div', 'msg', 'Keine Bilder vorhanden.')); return; }

        var labels = settings.categoryLabels || [];
        var kickerSlot = filterSlot >= 1 && filterSlot <= 4 ? filterSlot : 1;
        var selected = '';

        function draw() {
          grid.innerHTML = '';
          var visible = items.filter(function (item) { return !selected || item['category' + filterSlot] === selected; });
          visible.forEach(function (item, index) {
            if (catalog) {
              var card = el('article', 'card');
              var img = el('img', 'thumb');
              img.loading = 'lazy'; img.decoding = 'async'; img.src = item.url; img.alt = item.name || '';
              img.addEventListener('click', function () { open(root, visible, index, settings); });
              card.appendChild(img);
              var bodyEl = el('div', 'body');
              var kicker = item['category' + kickerSlot];
              if (kicker) bodyEl.appendChild(el('div', 'kicker', kicker));
              if (item.name) bodyEl.appendChild(el('h3', 'title', item.name));
              if (item.text) bodyEl.appendChild(el('p', 'text', item.text));
              if (item.note) bodyEl.appendChild(el('p', 'note', item.note));
              var link = inquiryLink(settings, item);
              if (link) { var ask = el('div', 'ask'); ask.appendChild(link); bodyEl.appendChild(ask); }
              card.appendChild(bodyEl);
              grid.appendChild(card);
            } else {
              var fig = el('figure');
              var thumb = el('img', 'thumb');
              thumb.loading = 'lazy'; thumb.decoding = 'async'; thumb.src = item.url; thumb.alt = item.name || '';
              fig.appendChild(thumb);
              if (captions && item.name) fig.appendChild(el('figcaption', '', item.name));
              fig.addEventListener('click', function () { open(root, visible, index, settings); });
              grid.appendChild(fig);
            }
          });
        }

        if (filterSlot >= 1 && filterSlot <= 4) {
          var values = [];
          items.forEach(function (item) { var v = item['category' + filterSlot]; if (v && values.indexOf(v) < 0) values.push(v); });
          values.sort(function (a, b) { return a.localeCompare(b, 'de'); });
          if (values.length > 1) {
            [''].concat(values).forEach(function (value) {
              var chip = el('button', 'chip' + (value === '' ? ' on' : ''), value || 'Alle');
              chip.type = 'button';
              chip.setAttribute('aria-label', (labels[filterSlot - 1] || 'Kategorie') + ': ' + (value || 'Alle'));
              chip.addEventListener('click', function () {
                selected = value;
                [].forEach.call(filters.children, function (c) { c.classList.toggle('on', c === chip); });
                draw();
              });
              filters.appendChild(chip);
            });
          }
        }
        draw();
      })
      .catch(function (err) { if (!stale()) msg.textContent = 'Galerie nicht verfügbar: ' + err.message; });
  }

  function open(root, items, start, settings) {
    var index = start;
    var box = el('div', 'box');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    var img = el('img'); var cap = el('div', 'cap');
    var close = el('button', 'close', '×'); close.setAttribute('aria-label', 'Schließen');
    var prev = el('button', 'prev', '‹'); prev.setAttribute('aria-label', 'Vorheriges Bild');
    var next = el('button', 'next', '›'); next.setAttribute('aria-label', 'Nächstes Bild');
    function show() {
      var item = items[index];
      img.src = item.url; img.alt = item.name || '';
      cap.innerHTML = '';
      if (item.name) cap.appendChild(el('b', '', item.name));
      if (item.text) cap.appendChild(el('span', '', item.text));
      if (item.note) cap.appendChild(el('div', 'note', item.note));
      var link = inquiryLink(settings, item);
      if (link) { var wrap = el('div'); wrap.appendChild(link); cap.appendChild(wrap); }
      prev.style.display = next.style.display = items.length > 1 ? '' : 'none';
    }
    function step(delta) { index = (index + delta + items.length) % items.length; show(); }
    function end() { document.removeEventListener('keydown', onKey); box.remove(); }
    function onKey(e) { if (e.key === 'Escape') end(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); }
    close.onclick = end;
    prev.onclick = function (e) { e.stopPropagation(); step(-1); };
    next.onclick = function (e) { e.stopPropagation(); step(1); };
    box.onclick = function (e) { if (e.target === box) end(); };
    document.addEventListener('keydown', onKey);
    box.appendChild(img); box.appendChild(cap); box.appendChild(close); box.appendChild(prev); box.appendChild(next);
    root.appendChild(box);
    show();
    close.focus();
  }

  function init() { [].forEach.call(document.querySelectorAll('[data-image-manager-gallery]'), render); }
  window.ImageManagerEmbed = { render: render, init: init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
`

export default async () => new Response(EMBED_SCRIPT, {
  headers: {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300',
  },
})

export const config = {
  path: '/image-manager-embed.js',
}
