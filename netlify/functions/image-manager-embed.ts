/**
 * Serves the embed script customers put on their website:
 *   <div data-image-manager-gallery="EMBED_ID" data-category1="Sofa" data-columns="3"></div>
 *   <script src="https://<app-domain>/image-manager-embed.js" async></script>
 * Reads images from public-gallery and renders a responsive grid with a lightbox,
 * isolated from the host page's CSS via Shadow DOM.
 */
const EMBED_SCRIPT = String.raw`(function () {
  'use strict';
  var current = document.currentScript || [].slice.call(document.querySelectorAll('script[src*="image-manager-embed.js"]')).pop();
  var BASE = current ? new URL(current.src, location.href).origin : location.origin;

  var STYLE = [
    ':host{display:block}',
    '.grid{display:grid;gap:var(--gap,12px);grid-template-columns:repeat(var(--cols,3),minmax(0,1fr))}',
    '@media (max-width:600px){.grid{grid-template-columns:repeat(var(--cols-m,2),minmax(0,1fr))}}',
    'figure{margin:0;cursor:zoom-in}',
    'img.thumb{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;background:#f1f3f5;transition:opacity .2s,transform .2s}',
    'figure:hover img.thumb{opacity:.9;transform:scale(1.01)}',
    'figcaption{margin-top:6px;font:500 14px/1.35 system-ui,sans-serif;color:inherit}',
    '.msg{font:14px system-ui,sans-serif;color:#667085;padding:16px 0}',
    '.box{position:fixed;inset:0;z-index:2147483000;background:rgba(10,12,16,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}',
    '.box img{max-width:100%;max-height:78vh;object-fit:contain;border-radius:8px}',
    '.box .cap{color:#fff;font:15px/1.5 system-ui,sans-serif;text-align:center;max-width:720px;margin-top:12px}',
    '.box .cap b{display:block;font-weight:600}',
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

  function render(host) {
    var id = host.getAttribute('data-image-manager-gallery');
    if (!id) return;
    var base = host.getAttribute('data-base') || BASE;
    var cols = Math.min(Math.max(parseInt(host.getAttribute('data-columns') || '3', 10) || 3, 1), 6);
    var captions = host.getAttribute('data-captions') !== 'false';
    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.innerHTML = '';
    var style = el('style'); style.textContent = STYLE; root.appendChild(style);
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
        var items = body.items || [];
        msg.remove();
        if (!items.length) { root.appendChild(el('div', 'msg', 'Keine Bilder vorhanden.')); return; }
        items.forEach(function (item, index) {
          var fig = el('figure');
          var img = el('img', 'thumb');
          img.loading = 'lazy'; img.decoding = 'async'; img.src = item.url; img.alt = item.name || '';
          fig.appendChild(img);
          if (captions && item.name) fig.appendChild(el('figcaption', '', item.name));
          fig.addEventListener('click', function () { open(root, items, index); });
          grid.appendChild(fig);
        });
      })
      .catch(function (err) { msg.textContent = 'Galerie nicht verfügbar: ' + err.message; });
  }

  function open(root, items, start) {
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
