/* BrandSeoTools mockup — shared shell + vanilla JS app */
(function () {
  'use strict';
  var M = window.MOCK;
  var P = window.ICON_PATHS || {};

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function icon(n, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function inr(n) { return '₹' + n.toLocaleString('en-IN'); }
  function prod(slug) { return M.products.filter(function (p) { return p.slug === slug; })[0]; }
  function catCls(cat) {
    return { 'SEO & Marketing': 'pi-seo', 'AI & Writing': 'pi-ai', 'Design & Media': 'pi-design', 'Learning': 'pi-learn', 'Streaming': 'pi-stream', 'Utilities': 'pi-util', 'Bundles': 'pi-bundle' }[cat] || 'pi-util';
  }
  function initials(name) { return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function fmtDate(iso) { var d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  var TODAY = new Date('2026-11-23T12:00:00'); // fixed "today" for consistent demo dates
  function daysLeft(iso) { return Math.ceil((new Date(iso + 'T00:00:00') - TODAY) / 86400000); }
  function subFor(slug) {
    var s = M.subscriptions.filter(function (x) { return x.product === slug; });
    return s.length ? s[0] : null;
  }
  function liveSubs() { return M.subscriptions.filter(function (s) { return daysLeft(s.expires) >= 0; }); }
  function subStatus(sub) {
    var d = daysLeft(sub.expires);
    if (d < 0) return { key: 'expired', label: 'Expired', cls: 'b-expired' };
    if (d <= 7) return { key: 'expiring', label: 'Expires in ' + d + 'd', cls: 'b-expiring' };
    return { key: 'active', label: 'Active', cls: 'b-active' };
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('bst-' + k)); localStorage.setItem('bst-' + k, JSON.stringify(v)); } catch (e) { return null; } }
  function getParam(n) { return new URLSearchParams(location.search).get(n); }

  var favs = store('favs') || ['semrush', 'canva', 'udemy'];
  function isFav(slug) { return favs.indexOf(slug) > -1; }
  function toggleFav(slug) {
    var i = favs.indexOf(slug);
    if (i > -1) favs.splice(i, 1); else favs.push(slug);
    store('favs', favs);
    return isFav(slug);
  }

  /* ---------- toast ---------- */
  function toast(msg, type) {
    var box = $('#toasts') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'toasts' }));
    var t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    var ic = { ok: 'check-circle', warn: 'alert-triangle', err: 'alert-circle', info: 'info' }[type] || 'check-circle';
    t.innerHTML = icon(ic) + '<span>' + esc(msg) + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 220); }, 3600);
  }

  /* ---------- modal ---------- */
  function modal(opts) {
    var back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(opts.title) + '">' +
      '<div class="modal-head"><h3>' + esc(opts.title) + '</h3><button class="icon-btn" data-close aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="modal-body">' + opts.body + '</div>' +
      (opts.foot ? '<div class="modal-foot">' + opts.foot + '</div>' : '') + '</div>';
    document.body.appendChild(back);
    requestAnimationFrame(function () { back.classList.add('show'); });
    function close() { back.classList.remove('show'); setTimeout(function () { back.remove(); }, 160); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) { if (e.target === back || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    var f = back.querySelector('button, [href], input, select');
    if (f) f.focus();
    if (opts.onClose) back.addEventListener('remove', opts.onClose);
    return { el: back, close: close };
  }

  /* ---------- shell ---------- */
  var NAV = [
    { sec: 'Menu' },
    { id: 'dashboard', href: 'dashboard.html', label: 'Dashboard', ic: 'layout-dashboard' },
    { id: 'products', href: 'products.html', label: 'Tool Catalogue', ic: 'layout-grid' },
    { id: 'subscriptions', href: 'subscriptions.html', label: 'Subscriptions', ic: 'credit-card' },
    { id: 'billing', href: 'billing.html', label: 'Payment History', ic: 'receipt' },
    { sec: 'Help' },
    { id: 'extension', href: 'extension.html', label: 'Install Extension', ic: 'puzzle' },
    { id: 'support', href: 'support.html', label: 'Help & Support', ic: 'life-buoy' },
    { sec: 'Account' },
    { id: 'profile', href: 'profile.html', label: 'Settings', ic: 'settings' }
  ];

  function buildShell() {
    var page = document.body.dataset.page;
    var content = $('#page');
    if (!page || !content || ['auth', 'landing', 'login', 'forgot', 'signup'].indexOf(page) > -1) return;
    document.title = (document.body.dataset.title || 'Dashboard') + ' — BrandSeoTools';

    var app = document.createElement('div');
    app.className = 'app' + (store('sidebar') === 'collapsed' ? ' sb-collapsed' : '');
    var main = document.createElement('div');
    main.className = 'main';
    document.body.prepend(app);
    app.appendChild(main);
    main.appendChild(content);

    // sidebar
    var sb = document.createElement('aside');
    sb.className = 'sidebar';
    sb.setAttribute('aria-label', 'Primary navigation');
    var nav = NAV.map(function (it) {
      if (it.sec) return '<div class="sb-sec">' + it.sec + '</div>';
      var exp = it.id === 'subscriptions' ? '<span class="sb-badge">' + liveSubs().length + '</span>' : '';
      return '<a class="sb-item' + (it.id === page ? ' active' : '') + '" href="' + it.href + '"' + (it.id === page ? ' aria-current="page"' : '') + '>' + icon(it.ic) + '<span>' + it.label + '</span>' + exp + '</a>';
    }).join('');
    sb.innerHTML =
      '<div class="sb-brand"><span class="sb-logo">B</span><span class="sb-name">BrandSeoTools<span>MEMBER AREA</span></span>' +
      '<button class="sb-toggle" aria-label="Collapse sidebar" title="Collapse sidebar">' + icon('panel-left-close') + '</button></div>' +
      '<nav class="sb-nav">' + nav + '</nav>' +
      '<div class="sb-foot"><button class="sb-user" id="sb-user-btn">' +
      '<span class="avatar">' + initials(M.user.name) + '</span>' +
      '<span class="sb-user-meta"><b>' + esc(M.user.name) + '</b><span>' + esc(M.user.email) + '</span></span></button></div>';
    app.insertBefore(sb, main);
    var back = document.createElement('div'); back.className = 'sb-backdrop'; app.appendChild(back);

    // topbar
    var unread = M.notifications.filter(function (n) { return !n.read; }).length;
    var tb = document.createElement('header');
    tb.className = 'topbar';
    tb.innerHTML =
      '<button class="icon-btn tb-menu-btn" aria-label="Open menu">' + icon('menu') + '</button>' +
      '<span class="tb-title">' + esc(document.body.dataset.title || '') + '</span>' +
      '<div class="tb-search"><label class="sr-only" style="position:absolute;left:-9999px">Search tools</label>' + icon('search') +
      '<input type="search" placeholder="Search tools…" id="global-search" autocomplete="off"></div>' +
      '<div class="tb-actions">' +
      '<button class="icon-btn" id="theme-btn" aria-label="Toggle theme">' + icon('moon') + '</button>' +
      '<span class="menu-wrap"><button class="icon-btn" id="notif-btn" aria-label="Notifications">' + icon('bell') + (unread ? '<span class="dot"></span>' : '') + '</button></span>' +
      '<span class="menu-wrap"><button class="icon-btn" id="user-btn" aria-label="Account menu"><span class="avatar" style="width:26px;height:26px;font-size:10.5px">' + initials(M.user.name) + '</span></button></span>' +
      '</div>';
    main.insertBefore(tb, content);
    content.classList.add('content');

    // sidebar interactions
    $('.sb-toggle', sb).addEventListener('click', function () {
      app.classList.toggle('sb-collapsed');
      store('sidebar', app.classList.contains('sb-collapsed') ? 'collapsed' : 'open');
      $('.sb-toggle .ic', sb).outerHTML = icon(app.classList.contains('sb-collapsed') ? 'panel-left-open' : 'panel-left-close');
    });
    $('.tb-menu-btn', tb).addEventListener('click', function () { app.classList.toggle('sb-open'); });
    back.addEventListener('click', function () { app.classList.remove('sb-open'); });
    $('#sb-user-btn').addEventListener('click', function () { location.href = 'profile.html'; });

    // theme
    if (store('theme') !== 'light') { document.documentElement.classList.add('dark'); }
    $('#theme-btn').addEventListener('click', function () {
      var d = document.documentElement.classList.toggle('dark');
      store('theme', d ? 'dark' : 'light');
      $('#theme-btn').innerHTML = icon(d ? 'sun' : 'moon');
    });
    if (store('theme') !== 'light') $('#theme-btn').innerHTML = icon('sun');

    // user menu
    dropdown('#user-btn', [
      { head: M.user.email },
      { label: 'Settings', ic: 'settings', href: 'profile.html' },
      { label: 'Payment history', ic: 'receipt', href: 'billing.html' },
      { sep: true },
      { label: 'Sign out', ic: 'log-out', cls: 'danger', fn: function () { toast('Signed out — demo only', 'info'); setTimeout(function () { location.href = 'login.html'; }, 700); } }
    ]);

    // notifications menu
    var nBtn = $('#notif-btn');
    dropdown('#notif-btn', null, function () {
      return '<div class="menu-head" style="display:flex;justify-content:space-between;align-items:center">Notifications<button class="btn btn-ghost btn-sm" data-markall>Mark all read</button></div>' +
        '<div class="notif-list">' + M.notifications.map(function (n) {
          var ic = { expiry: 'clock', announcement: 'megaphone', payment: 'receipt', system: 'info' }[n.type] || 'info';
          return '<button class="notif-item' + (n.read ? ' read' : '') + '" data-nid="' + n.id + '"><span class="ni-ic ni-' + n.type + '">' + icon(ic) + '</span><span><b>' + esc(n.title) + '</b><p>' + esc(n.body) + '</p><time>' + n.time + '</time></span>' + (n.read ? '' : '<span class="ni-dot" style="margin-left:auto"></span>') + '</button>';
        }).join('') + '</div>' +
        '<div class="menu-sep"></div><a class="menu-item" href="dashboard.html#announcements">' + icon('megaphone') + 'View announcements</a>';
    }, function (menuEl) {
      $$('.notif-item', menuEl).forEach(function (b) {
        b.addEventListener('click', function () {
          var n = M.notifications.find(function (x) { return x.id === b.dataset.nid; });
          if (n) n.read = true; b.classList.add('read');
          if (!M.notifications.some(function (x) { return !x.read; })) { var d = $('#notif-btn .dot'); if (d) d.remove(); }
        });
      });
      $('[data-markall]', menuEl).addEventListener('click', function () {
        M.notifications.forEach(function (n) { n.read = true; });
        $$('.notif-item', menuEl).forEach(function (x) { x.classList.add('read'); });
        var d = $('#notif-btn .dot'); if (d) d.remove();
        toast('All notifications marked as read');
      });
    });
    void nBtn;

    // global search → products page
    var gs = $('#global-search');
    gs.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') location.href = 'products.html?q=' + encodeURIComponent(gs.value);
    });
  }

  function dropdown(btnSel, items, htmlFn, after) {
    var btn = $(btnSel);
    var wrap = btn.parentElement;
    var menu = document.createElement('div');
    menu.className = 'menu' + (btnSel === '#notif-btn' ? ' notif-menu' : '');
    wrap.appendChild(menu);
    function render() {
      if (htmlFn) { menu.innerHTML = htmlFn(); if (after) after(menu); return; }
      menu.innerHTML = items.map(function (it) {
        if (it.sep) return '<div class="menu-sep"></div>';
        if (it.head) return '<div class="menu-head" style="text-transform:none;letter-spacing:0">' + esc(it.head) + '</div>';
        var inner = (it.ic ? icon(it.ic) : '') + esc(it.label);
        return it.href ? '<a class="menu-item ' + (it.cls || '') + '" href="' + it.href + '">' + inner + '</a>'
          : '<button class="menu-item ' + (it.cls || '') + '">' + inner + '</button>';
      }).join('');
      items.forEach(function (it, i) {
        if (it.fn) { var el = $$('.menu-item', menu).filter(function (x) { return x.textContent.trim() === it.label; })[0]; if (el) el.addEventListener('click', function () { close(); it.fn(); }); }
      });
    }
    var open = false;
    function close() { open = false; menu.classList.remove('open'); }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      $$('.menu.open').forEach(function (m) { if (m !== menu) m.classList.remove('open'); });
      open = !open;
      if (open) { render(); menu.classList.add('open'); } else close();
    });
    document.addEventListener('click', function (e) { if (open && !wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return { close: close, el: menu };
  }

  /* ---------- shared renderers ---------- */
  function statusBadge(sub) {
    var s = subStatus(sub);
    return '<span class="badge ' + s.cls + '">' + s.label + '</span>';
  }
  function picon(p, extra) {
    var im = (window.PROD_IMAGES || {})[p.slug];
    var inner = initials(p.name);
    if (im && im.file) {
      inner += '<img src="assets/images/products/' + im.file + '" alt="" loading="lazy" draggable="false" onerror="this.parentNode.removeChild(this)">';
      return '<span class="picon ' + catCls(p.cat) + ' picon-img ' + (extra || '') + '" aria-hidden="true">' + inner + '</span>';
    }
    return '<span class="picon ' + catCls(p.cat) + ' ' + (extra || '') + '" aria-hidden="true">' + inner + '</span>';
  }
  function daysBar(sub) {
    var d = daysLeft(sub.expires), total = Math.max(1, Math.ceil((new Date(sub.expires) - new Date(sub.started)) / 86400000));
    var pct = Math.max(0, Math.min(100, Math.round(d / total * 100)));
    var cls = d <= 4 ? 'danger' : d <= 7 ? 'warn' : '';
    var lbl = d < 0 ? Math.abs(d) + 'd ago' : d + 'd left';
    return '<div class="dbar ' + cls + '"><span class="track"><span class="fill" style="width:' + pct + '%"></span></span><span class="lbl">' + lbl + '</span></div>';
  }
  function renewModal(slug) {
    var p = prod(slug), sub = subFor(slug);
    var body = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:14px">' + picon(p) + '<div><b style="font-size:15px">' + esc(p.name) + '</b><div class="small muted">' + esc(p.cat) + ' · 30-day term</div></div></div>' +
      '<div class="kv"><span class="k">Price</span><span class="v">' + inr(p.price) + '</span></div>' +
      (sub ? '<div class="kv"><span class="k">Current expiry</span><span class="v">' + fmtDate(sub.expires) + '</span></div><div class="kv"><span class="k">New expiry</span><span class="v">' + fmtDate(sub.expires > '2026-11-23' ? addDays(sub.expires, 30) : addDays('2026-11-23', 30)) + '</span></div>' : '') +
      '<p class="small muted" style="margin-top:12px">Checkout is simulated — no real payment is made in this prototype.</p>';
    var m = modal({
      title: 'Renew ' + p.name, body: body,
      foot: '<button class="btn btn-secondary" data-close>Cancel</button><button class="btn btn-primary" data-pay>Pay ' + inr(p.price) + '</button>'
    });
    $('[data-pay]', m.el).addEventListener('click', function () {
      m.close();
      toast(p.name + ' renewed for 30 days (simulated)');
    });
  }
  function addDays(iso, n) { var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

  /* ---------- PAGE: dashboard ---------- */
  function pageDashboard() {
    var live = liveSubs();
    var expiring = live.filter(function (s) { return daysLeft(s.expires) <= 7; });
    var next = live.slice().sort(function (a, b) { return a.expires < b.expires ? -1 : 1; })[0];
    var spend = live.reduce(function (t, s) { return t + s.amount; }, 0);

    $('#greet').textContent = 'Good evening, ' + M.user.firstName;
    $('#subline').textContent = 'Here’s what’s happening with your tools today.';

    var wrap = $('#alerts');
    expiring.forEach(function (s) {
      var p = prod(s.product);
      var a = document.createElement('div');
      a.className = 'alert alert-warn';
      a.innerHTML = icon('alert-triangle') + '<div class="alert-txt"><b>' + esc(p.name) + '</b> expires in <b>' + daysLeft(s.expires) + ' day' + (daysLeft(s.expires) === 1 ? '' : 's') + '</b> (' + fmtDate(s.expires) + '). Renew to keep uninterrupted access.</div><span class="alert-act"><button class="btn btn-sm" data-renew="' + p.slug + '">Renew now</button></span><button class="alert-x" aria-label="Dismiss">' + icon('x') + '</button>';
      wrap.appendChild(a);
      $('.alert-x', a).addEventListener('click', function () { a.remove(); });
    });

    $('#stat-active .v').innerHTML = live.length + '<small> products</small>';
    $('#stat-expiry .v').innerHTML = next ? fmtDate(next.expires) : '—';
    $('#stat-expiry .s').textContent = next ? prod(next.product).name + ' · ' + daysLeft(next.expires) + ' days left' : 'No active subscriptions';
    $('#stat-spend .v').innerHTML = inr(spend);
    $('#stat-tools .v').innerHTML = M.products.length + '<small> in catalogue</small>';

    // your tools
    var yt = $('#your-tools');
    yt.innerHTML = live.map(function (s) {
      var p = prod(s.product), st = subStatus(s);
      return '<div class="prod">' +
        '<div class="prod-top">' + picon(p) + '<div><div class="prod-name"><a href="product-details.html?slug=' + p.slug + '">' + esc(p.name) + '</a></div><div class="prod-cat">' + esc(p.cat) + '</div></div></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between"><span class="badge ' + st.cls + '">' + st.label + '</span>' + daysBar(s) + '</div>' +
        '<div class="prod-foot"><span class="prod-price">' + inr(p.price) + '<span>/mo</span></span><span class="prod-cta"><a class="btn btn-primary btn-sm" href="product-details.html?slug=' + p.slug + '">' + icon('external-link') + 'Access</a></span></div></div>';
    }).join('');

    // recent tools
    var recent = store('recent') || ['udemy', 'canva', 'chatgpt', 'semrush'];
    $('#recent-list').innerHTML = recent.slice(0, 5).map(function (slug) {
      var p = prod(slug); if (!p) return '';
      var s = subFor(slug);
      return '<div class="rowitem">' + picon(p) + '<div class="grow"><b>' + esc(p.name) + '</b><span class="sub">' + esc(p.cat) + '</span></div>' +
        (s && daysLeft(s.expires) >= 0 ? '<a class="btn btn-ghost btn-sm" href="product-details.html?slug=' + p.slug + '">Open</a>' : '<a class="btn btn-ghost btn-sm" href="product-details.html?slug=' + p.slug + '">Renew</a>') + '</div>';
    }).join('');

    // announcements
    $('#ann-list').innerHTML = M.announcements.map(function (a) {
      return '<div class="rowitem" style="align-items:flex-start"><span class="eic" style="width:30px;height:30px;border-radius:7px;background:var(--info-soft);color:var(--info);display:grid;place-items:center;flex:none">' + icon('megaphone') + '</span><div class="grow"><b>' + esc(a.title) + '</b><span class="sub" style="line-height:1.45">' + esc(a.body) + (a.link ? ' <a href="' + a.link + '">Contact support</a>' : '') + '</span></div></div>';
    }).join('');

    // expiring list
    $('#exp-list').innerHTML = live.filter(function (s) { return daysLeft(s.expires) <= 30; }).sort(function (a, b) { return a.expires < b.expires ? -1 : 1; }).slice(0, 4).map(function (s) {
      var p = prod(s.product);
      return '<div class="rowitem">' + picon(p) + '<div class="grow"><b>' + esc(p.name) + '</b><span class="sub">' + fmtDate(s.expires) + '</span></div>' + daysBar(s) + '</div>';
    }).join('');

    document.addEventListener('click', function (e) {
      var r = e.target.closest('[data-renew]');
      if (r) renewModal(r.dataset.renew);
    });
  }

  /* ---------- PAGE: products ---------- */
  function pageProducts() {
    var state = { q: getParam('q') || '', cat: 'All', sort: 'name', filter: 'all' };
    var qInput = $('#pq'); qInput.value = state.q;
    var cats = ['All'].concat(M.categories);
    $('#cat-chips').innerHTML = cats.map(function (c) {
      var n = c === 'All' ? M.products.length : M.products.filter(function (p) { return p.cat === c; }).length;
      return '<button class="chip' + (c === state.cat ? ' on' : '') + '" data-cat="' + c + '">' + c + ' <span class="cnt">' + n + '</span></button>';
    }).join('');
    $$('#cat-chips .chip').forEach(function (ch) {
      ch.addEventListener('click', function () {
        state.cat = ch.dataset.cat;
        $$('#cat-chips .chip').forEach(function (x) { x.classList.toggle('on', x === ch); });
        render();
      });
    });
    $$('[data-quick]').forEach(function (ch) {
      ch.addEventListener('click', function () {
        state.filter = ch.dataset.quick;
        $$('[data-quick]').forEach(function (x) { x.classList.toggle('on', x === ch); });
        render();
      });
    });
    qInput.addEventListener('input', function () { state.q = qInput.value; render(); });
    $('#psort').addEventListener('change', function () { state.sort = $('#psort').value; render(); });

    function matches(p) {
      if (state.cat !== 'All' && p.cat !== state.cat) return false;
      if (state.filter === 'owned' && !(subFor(p.slug) && daysLeft(subFor(p.slug).expires) >= 0)) return false;
      if (state.filter === 'fav' && !isFav(p.slug)) return false;
      if (state.filter === 'new') { /* popular acts as "trending" */ }
      if (state.q) {
        var q = state.q.toLowerCase();
        return p.name.toLowerCase().indexOf(q) > -1 || p.cat.toLowerCase().indexOf(q) > -1 || p.desc.toLowerCase().indexOf(q) > -1;
      }
      return true;
    }
    function render() {
      var list = M.products.filter(matches);
      list.sort(function (a, b) {
        if (state.sort === 'price-asc') return a.price - b.price;
        if (state.sort === 'price-desc') return b.price - a.price;
        if (state.sort === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
      $('#pcount').textContent = list.length + ' tool' + (list.length === 1 ? '' : 's');
      if (!list.length) {
        $('#pgrid').innerHTML = '<div class="card" style="grid-column:1/-1"><div class="empty"><div class="eic">' + icon('search', 'ic-20') + '</div><h4>No tools match your search</h4><p>Try a different keyword or category filter.</p><button class="btn btn-secondary btn-sm" id="clear-f">Clear filters</button></div></div>';
        $('#clear-f').addEventListener('click', function () { state.q = ''; qInput.value = ''; state.cat = 'All'; state.filter = 'all'; $$('#cat-chips .chip').forEach(function (x) { x.classList.toggle('on', x.dataset.cat === 'All'); }); $$('[data-quick]').forEach(function (x) { x.classList.toggle('on', x.dataset.quick === 'all'); }); render(); });
        return;
      }
      $('#pgrid').innerHTML = list.map(function (p) {
        var sub = subFor(p.slug), owned = sub && daysLeft(sub.expires) >= 0;
        var st = owned ? statusBadge(sub) : '<span class="badge b-neutral">Not subscribed</span>';
        return '<div class="prod">' +
          '<div class="prod-top">' + picon(p) + '<div><div class="prod-name"><a href="product-details.html?slug=' + p.slug + '">' + esc(p.name) + '</a></div><div class="prod-cat">' + esc(p.cat) + (p.popular ? ' · <span style="color:var(--accent-text);font-weight:600">Popular</span>' : '') + '</div></div>' +
          '<button class="prod-fav' + (isFav(p.slug) ? ' on' : '') + '" data-fav="' + p.slug + '" aria-label="Save ' + esc(p.name) + '" aria-pressed="' + isFav(p.slug) + '">' + icon('star') + '</button></div>' +
          '<p class="prod-desc">' + esc(p.desc) + '</p>' +
          '<div style="display:flex;align-items:center;gap:6px">' + st + (p.access === 'cloud' ? '<span class="badge b-info">' + icon('globe') + 'Cloud</span>' : '') + '</div>' +
          '<div class="prod-foot"><span class="prod-price">' + inr(p.price) + '<span>/30d</span></span><span class="prod-cta">' +
          (owned ? '<a class="btn btn-primary btn-sm" href="product-details.html?slug=' + p.slug + '">Access</a>'
                 : '<a class="btn btn-secondary btn-sm" href="product-details.html?slug=' + p.slug + '">Details</a><a class="btn btn-primary btn-sm" href="signup.html?add=' + p.slug + '">Subscribe</a>') +
          '</span></div></div>';
      }).join('');
      $$('#pgrid [data-fav]').forEach(function (b) {
        b.addEventListener('click', function () {
          var on = toggleFav(b.dataset.fav);
          b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
          toast(on ? 'Added to favorites' : 'Removed from favorites', 'info');
        });
      });
    }
    render();
  }

  /* ---------- PAGE: product details ---------- */
  function pageDetails() {
    var slug = getParam('slug') || 'udemy';
    var p = prod(slug);
    if (!p) { location.replace('products.html'); return; }
    var rec = store('recent') || [];
    rec = [slug].concat(rec.filter(function (s) { return s !== slug; })).slice(0, 8);
    store('recent', rec);

    var sub = subFor(slug), owned = sub && daysLeft(sub.expires) >= 0;
    document.title = p.name + ' — BrandSeoTools';
    $('#pd-crumb-cur').textContent = p.name;
    $('#pd-icon').className = 'picon ' + catCls(p.cat);
    $('#pd-icon').textContent = initials(p.name);
    $('#pd-name').textContent = p.name;
    $('#pd-meta').innerHTML = '<span>' + esc(p.cat) + '</span>·<span>' + inr(p.price) + ' / 30 days</span>' + (p.access === 'cloud' ? '·<span class="badge b-info">' + icon('globe') + 'Cloud access</span>' : '');
    $('#pd-status').innerHTML = owned ? statusBadge(sub) : '<span class="badge b-neutral">Not subscribed</span>';
    $('#pd-desc').textContent = p.desc;

    // access panel
    var ap = $('#access-panel');
    if (owned) {
      var st = subStatus(sub);
      ap.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="badge ' + st.cls + '" style="font-size:12px;padding:3px 9px">' + st.label + '</span><span class="small muted tnum">until ' + fmtDate(sub.expires) + '</span></div>' +
        daysBar(sub) +
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">' +
        '<button class="btn btn-primary btn-lg btn-block" id="btn-access">' + icon('external-link') + 'Access ' + esc(p.name) + '</button>' +
        '<button class="btn btn-secondary btn-block" id="btn-renew">' + icon('refresh-cw') + 'Renew — ' + inr(p.price) + '</button></div>' +
        '<p class="xs faint" style="margin-top:10px;text-align:center">Requires the BrandSeoTools extension v3.0.1+</p>';
    } else {
      ap.innerHTML =
        '<div class="kv"><span class="k">Price</span><span class="v">' + inr(p.price) + ' <span class="faint" style="font-weight:400">/ 30 days</span></span></div>' +
        '<div class="kv"><span class="k">Billing</span><span class="v">Manual renewal</span></div>' +
        '<div class="kv"><span class="k">Access method</span><span class="v">' + (p.access === 'cloud' ? 'Cloud browser' : 'Extension') + '</span></div>' +
        '<a class="btn btn-primary btn-lg btn-block" style="margin-top:16px" href="signup.html?add=' + p.slug + '">' + icon('shopping-cart') + 'Subscribe — ' + inr(p.price) + '</a>' +
        '<p class="xs faint" style="margin-top:10px;text-align:center">Renews manually every 30 days. No auto-billing.</p>';
    }
    var ba = $('#btn-access');
    if (ba) ba.addEventListener('click', function () {
      ba.innerHTML = icon('loader-2') + 'Preparing access…'; ba.disabled = true;
      setTimeout(function () {
        ba.innerHTML = icon('check-circle') + 'Signed in — redirecting…';
        toast(p.name + ' access granted (simulated)', 'ok');
        setTimeout(function () { ba.innerHTML = icon('external-link') + 'Access ' + esc(p.name); ba.disabled = false; }, 1500);
      }, 1100);
    });
    var br = $('#btn-renew');
    if (br) br.addEventListener('click', function () { renewModal(slug); });

    $('#fav-btn').setAttribute('aria-pressed', isFav(slug));
    $('#fav-btn').classList.toggle('on', isFav(slug));
    $('#fav-btn').addEventListener('click', function () {
      var on = toggleFav(slug); $('#fav-btn').classList.toggle('on', on);
      toast(on ? 'Added to favorites' : 'Removed from favorites', 'info');
    });

    // related
    var rel = M.products.filter(function (x) { return x.cat === p.cat && x.slug !== slug; }).slice(0, 3);
    $('#pd-related').innerHTML = rel.map(function (x) {
      return '<a class="rowitem" href="product-details.html?slug=' + x.slug + '" style="color:inherit">' + picon(x) + '<div class="grow"><b>' + esc(x.name) + '</b><span class="sub">' + inr(x.price) + '/30d</span></div>' + icon('chevron-right') + '</a>';
    }).join('');
  }

  /* ---------- PAGE: subscriptions ---------- */
  function pageSubscriptions() {
    var live = liveSubs(), dead = M.subscriptions.filter(function (s) { return daysLeft(s.expires) < 0; });
    $('#ss-active').textContent = live.length;
    $('#ss-expiring').textContent = live.filter(function (s) { return daysLeft(s.expires) <= 7; }).length;
    $('#ss-spend').textContent = inr(live.reduce(function (t, s) { return t + s.amount; }, 0));
    var next = live.slice().sort(function (a, b) { return a.expires < b.expires ? -1 : 1; })[0];
    $('#ss-next').innerHTML = next ? prod(next.product).name + '<small>' + fmtDate(next.expires) + '</small>' : '—';

    function row(s, isPast) {
      var p = prod(s.product), st = subStatus(s);
      return '<tr><td><div class="t-name">' + picon(p) + '<span>' + esc(p.name) + '</span></div></td>' +
        '<td>' + statusBadge(s) + '</td>' +
        '<td class="num">' + fmtDate(s.started) + '</td>' +
        '<td class="num">' + fmtDate(s.expires) + '</td>' +
        '<td>' + daysBar(s) + '</td>' +
        '<td class="num">' + inr(s.amount) + '</td>' +
        '<td class="r">' + (isPast
          ? '<button class="btn btn-secondary btn-sm" data-renew="' + p.slug + '">Renew</button>'
          : '<a class="btn btn-ghost btn-sm" href="product-details.html?slug=' + p.slug + '">Access</a> <button class="btn btn-secondary btn-sm" data-renew="' + p.slug + '">Renew</button>') + '</td></tr>';
    }
    $('#sub-active').innerHTML = live.sort(function (a, b) { return a.expires < b.expires ? -1 : 1; }).map(function (s) { return row(s); }).join('');
    $('#sub-past').innerHTML = dead.length
      ? dead.map(function (s) { return row(s, true); }).join('')
      : '<tr><td colspan="7"><div class="empty" style="padding:26px"><p>No past subscriptions.</p></div></td></tr>';
    $$('[data-renew]').forEach(function (b) { b.addEventListener('click', function () { renewModal(b.dataset.renew); }); });
  }

  /* ---------- PAGE: billing ---------- */
  function pageBilling() {
    var state = { q: '', status: 'all' };
    function render() {
      var list = M.transactions.filter(function (t) {
        if (state.status !== 'all' && t.status !== state.status) return false;
        if (state.q) { var q = state.q.toLowerCase(); return (t.id + t.item + t.method).toLowerCase().indexOf(q) > -1; }
        return true;
      });
      var tbody = $('#txn-body');
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="6"><div class="empty"><div class="eic">' + icon('receipt', 'ic-20') + '</div><h4>No transactions found</h4><p>Try a different filter or search term.</p></div></td></tr>';
        return;
      }
      tbody.innerHTML = list.map(function (t) {
        var st = { completed: '<span class="badge b-active">Completed</span>', failed: '<span class="badge b-expired">Failed</span>', refunded: '<span class="badge b-refund">Refunded</span>' }[t.status];
        return '<tr><td class="num" style="font-weight:600">' + t.id + '</td><td class="num">' + fmtDate(t.date) + '</td><td>' + esc(t.item) + '</td><td>' + esc(t.method) + '</td><td class="num">' + inr(t.amount) + '</td><td>' + st + '</td>' +
          '<td class="r"><button class="btn btn-ghost btn-sm" data-inv="' + t.id + '">' + icon('file-text') + 'Invoice</button></td></tr>';
      }).join('');
      $$('#txn-body [data-inv]').forEach(function (b) {
        b.addEventListener('click', function () {
          var t = M.transactions.find(function (x) { return x.id === b.dataset.inv; });
          modal({
            title: 'Invoice ' + t.id,
            body: '<div class="invoice-row"><span>Billed to</span><b>' + esc(M.user.name) + '</b></div>' +
              '<div class="invoice-row"><span>Item</span><b>' + esc(t.item) + '</b></div>' +
              '<div class="invoice-row"><span>Date</span><b>' + fmtDate(t.date) + '</b></div>' +
              '<div class="invoice-row"><span>Method</span><b>' + esc(t.method) + '</b></div>' +
              '<div class="invoice-row"><span>Status</span><b style="text-transform:capitalize">' + t.status + '</b></div>' +
              '<div class="invoice-row" style="font-size:15px;margin-top:4px"><span>Total</span><b>' + inr(t.amount) + '</b></div>',
            foot: '<button class="btn btn-secondary" data-close>Close</button><button class="btn btn-primary" id="dl-inv">' + icon('download') + 'Download PDF</button>'
          });
          $('#dl-inv').addEventListener('click', function () { toast('Invoice download is simulated in this prototype', 'info'); });
        });
      });
    }
    $('#bq').addEventListener('input', function () { state.q = $('#bq').value; render(); });
    $('#bstatus').addEventListener('change', function () { state.status = $('#bstatus').value; render(); });
    render();
  }

  /* ---------- PAGE: profile ---------- */
  function pageProfile() {
    $$('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.tab').forEach(function (x) { x.classList.toggle('on', x === t); });
        $$('[data-pane]').forEach(function (pn) { pn.style.display = pn.dataset.pane === t.dataset.tab ? '' : 'none'; });
      });
    });
    $('#pf-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [['pf-name', 'Please enter your name'], ['pf-email', 'Enter a valid email']].forEach(function (f) {
        var el = $('#' + f[0]), fd = el.closest('.field');
        var bad = f[0] === 'pf-email' ? !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value) : !el.value.trim();
        fd.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (ok) toast('Profile saved (simulated)');
    });
    $('#pw-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var cur = $('#pw-cur'), nw = $('#pw-new'), cf = $('#pw-confirm'), ok = true;
      [[cur, cur.value.length >= 6], [nw, nw.value.length >= 8], [cf, cf.value === nw.value && nw.value]].forEach(function (x) {
        x[0].closest('.field').classList.toggle('invalid', !x[1]); if (!x[1]) ok = false;
      });
      if (ok) { toast('Password changed — other sessions signed out (simulated)'); e.target.reset(); }
    });
    $$('[data-pref]').forEach(function (sw) {
      sw.addEventListener('change', function () { toast('Preference updated (simulated)', 'info'); });
    });
    $('#btn-revoke').addEventListener('click', function () {
      modal({ title: 'Sign out all other sessions?', body: '<p class="small muted">This signs your account out of every device except this one. Demo action — nothing actually happens.</p>', foot: '<button class="btn btn-secondary" data-close>Cancel</button><button class="btn btn-danger-outline" data-close id="revoke-ok">Sign out others</button>' });
      setTimeout(function () { var b = $('#revoke-ok'); if (b) b.addEventListener('click', function () { toast('Other sessions revoked (simulated)'); }); }, 0);
    });
  }

  /* ---------- PAGE: support ---------- */
  function pageSupport() {
    var state = { q: '', cat: 'All' };
    var cats = ['All', 'Access', 'Billing', 'Account', 'Extension'];
    $('#faq-chips').innerHTML = cats.map(function (c) { return '<button class="chip' + (c === 'All' ? ' on' : '') + '" data-c="' + c + '">' + c + '</button>'; }).join('');
    $$('#faq-chips .chip').forEach(function (ch) {
      ch.addEventListener('click', function () {
        state.cat = ch.dataset.c;
        $$('#faq-chips .chip').forEach(function (x) { x.classList.toggle('on', x === ch); });
        render();
      });
    });
    $('#fq').addEventListener('input', function () { state.q = $('#fq').value; render(); });
    function render() {
      var list = M.faqs.filter(function (f) {
        if (state.cat !== 'All' && f.cat !== state.cat) return false;
        if (state.q) { var q = state.q.toLowerCase(); return (f.q + f.a).toLowerCase().indexOf(q) > -1; }
        return true;
      });
      $('#faq-list').innerHTML = list.length ? list.map(function (f, i) {
        return '<div class="faq-item"><button class="faq-q" aria-expanded="false"><span><span class="faq-cat">' + f.cat + '</span>' + esc(f.q) + '</span>' + icon('chevron-down') + '</button><div class="faq-a">' + esc(f.a) + '</div></div>';
      }).join('') : '<div class="empty"><div class="eic">' + icon('search', 'ic-20') + '</div><h4>No answers found</h4><p>Try different keywords or <a href="#" id="faq-contact">contact support</a>.</p></div>';
      $$('#faq-list .faq-q').forEach(function (q) {
        q.addEventListener('click', function () {
          var it = q.parentElement, open = it.classList.contains('open');
          $$('#faq-list .faq-item').forEach(function (x) { x.classList.remove('open'); $('.faq-q', x).setAttribute('aria-expanded', 'false'); });
          if (!open) { it.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
        });
      });
    }
    render();
    $('#contact-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var sub = $('#cf-subject'), msg = $('#cf-msg'), ok = true;
      [[sub, !!sub.value], [msg, msg.value.trim().length >= 10]].forEach(function (x) {
        x[0].closest('.field').classList.toggle('invalid', !x[1]); if (!x[1]) ok = false;
      });
      if (ok) {
        e.target.reset();
        toast('Message sent — we usually reply within a few hours');
      }
    });
  }

  /* ---------- PAGE: extension ---------- */
  function pageExtension() {
    $('#ext-check').addEventListener('click', function () {
      var b = $('#ext-check');
      b.innerHTML = icon('loader-2') + 'Checking…'; b.disabled = true;
      setTimeout(function () {
        b.innerHTML = icon('puzzle') + 'Check extension status'; b.disabled = false;
        modal({
          title: 'Extension not detected',
          body: '<div class="alert alert-warn" style="margin-bottom:12px">' + icon('alert-triangle') + '<div class="alert-txt">We couldn’t detect the BrandSeoTools extension in this browser.</div></div>' +
            '<p class="small muted">This is expected in the prototype — the real site detects the extension automatically. Install it below, or use tools marked <b>Cloud access</b>.</p>',
          foot: '<button class="btn btn-secondary" data-close>Close</button><button class="btn btn-primary" id="m-dl">' + icon('download') + 'Install extension</button>'
        });
        $('#m-dl').addEventListener('click', function () { toast('Extension download simulated'); });
      }, 900);
    });
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy);
        toast('Copied to clipboard');
      });
    });
  }

  /* ---------- PAGE: login ---------- */
  function pageLogin() {
    var form = $('#login-form');
    $('#pw-eye').addEventListener('click', function () {
      var i = $('#login-pw'), show = i.type === 'password';
      i.type = show ? 'text' : 'password';
      this.innerHTML = icon(show ? 'eye-off' : 'eye');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = $('#login-email'), pw = $('#login-pw'), ok = true;
      em.closest('.field').classList.toggle('invalid', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value));
      pw.closest('.field').classList.toggle('invalid', pw.value.length < 6);
      if (em.closest('.field').classList.contains('invalid') || pw.closest('.field').classList.contains('invalid')) {
        $('#login-err').classList.add('show'); return;
      }
      $('#login-err').classList.remove('show');
      var btn = $('#login-btn');
      btn.innerHTML = icon('loader-2') + 'Signing in…'; btn.disabled = true;
      setTimeout(function () { location.href = 'dashboard.html'; }, 900);
    });
  }

  /* ---------- PAGE: forgot ---------- */
  function pageForgot() {
    $('#fp-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var em = $('#fp-email');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)) { em.closest('.field').classList.add('invalid'); return; }
      $('#fp-step1').style.display = 'none';
      $('#fp-step2').style.display = '';
      $('#fp-sent-to').textContent = em.value;
    });
  }

  /* ---------- PAGE: signup ---------- */
  function pageSignup() {
    var picked = {};
    var cart = store('cart') || [];
    cart.forEach(function (s) { picked[s] = true; });
    var pre = getParam('add'); if (pre && prod(pre)) picked[pre] = true;

    var step = 1;
    function goStep(n) {
      step = n;
      $$('.stp').forEach(function (s, i) {
        s.classList.toggle('on', i === n - 1);
        s.classList.toggle('done', i < n - 1);
      });
      [1, 2, 3].forEach(function (i) { $('#step-' + i).style.display = i === n ? '' : 'none'; });
      window.scrollTo({ top: 0 });
    }

    // step 1: account
    $('#su-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [['su-name', function (v) { return !!v.trim(); }],
       ['su-email', function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }],
       ['su-pass', function (v) { return v.length >= 8; }],
       ['su-phone', function (v) { return v.trim().length >= 10; }]].forEach(function (f) {
        var el = $('#' + f[0]), bad = !f[1](el.value);
        el.closest('.field').classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (ok) goStep(2);
      else toast('Check the highlighted fields', 'err');
    });

    // step 2: pick products
    var cat = 'All', q = '';
    function renderPicks() {
      var list = M.products.filter(function (p) {
        if (cat !== 'All' && p.cat !== cat) return false;
        if (q) { var s = q.toLowerCase(); return p.name.toLowerCase().indexOf(s) > -1; }
        return true;
      }).sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.name.localeCompare(b.name); });
      $('#pick-grid').innerHTML = list.map(function (p) {
        var sel = !!picked[p.slug];
        return '<button type="button" class="pick' + (sel ? ' sel' : '') + '" data-pick="' + p.slug + '" aria-pressed="' + sel + '">' + picon(p) +
          '<span><span class="pn">' + esc(p.name) + '</span><br><span class="pc">' + esc(p.cat) + '</span></span>' +
          '<span class="pp">' + inr(p.price) + '<small>/30d</small></span></button>';
      }).join('');
      $$('#pick-grid .pick').forEach(function (b) {
        b.addEventListener('click', function () {
          var s = b.dataset.pick;
          picked[s] = !picked[s];
          if (!picked[s]) delete picked[s];
          b.classList.toggle('sel', !!picked[s]);
          b.setAttribute('aria-pressed', !!picked[s]);
          renderSummary();
        });
      });
    }
    $('#su-chips').innerHTML = ['All'].concat(M.categories).map(function (c) { return '<button type="button" class="chip' + (c === 'All' ? ' on' : '') + '" data-c="' + c + '">' + c + '</button>'; }).join('');
    $$('#su-chips .chip').forEach(function (ch) {
      ch.addEventListener('click', function () { cat = ch.dataset.c; $$('#su-chips .chip').forEach(function (x) { x.classList.toggle('on', x === ch); }); renderPicks(); });
    });
    $('#su-q').addEventListener('input', function () { q = $('#su-q').value; renderPicks(); });

    var coupon = 0;
    function renderSummary() {
      var items = Object.keys(picked).map(prod);
      store('cart', Object.keys(picked));
      $('#sum-items').innerHTML = items.length ? items.map(function (p) {
        return '<div class="sum-item">' + picon(p) + '<span>' + esc(p.name) + '</span><button type="button" class="rm" data-rm="' + p.slug + '" aria-label="Remove">' + icon('x') + '</button><span class="r">' + inr(p.price) + '</span></div>';
      }).join('') : '<p class="small muted" style="padding:10px 0">No tools selected yet.</p>';
      $$('#sum-items [data-rm]').forEach(function (b) {
        b.addEventListener('click', function () { delete picked[b.dataset.rm]; renderPicks(); renderSummary(); });
      });
      var sub = items.reduce(function (t, p) { return t + p.price; }, 0);
      var disc = Math.round(sub * coupon);
      $('#sum-sub').textContent = inr(sub);
      $('#sum-disc-row').style.display = disc ? '' : 'none';
      $('#sum-disc').textContent = '−' + inr(disc);
      $('#sum-total').textContent = inr(sub - disc);
      $('#sum-sub2').textContent = inr(sub);
      $('#sum-total2').textContent = inr(sub - disc);
      $('#pick-count').textContent = items.length + ' selected';
      var cont = $('#to-step3');
      cont.disabled = !items.length;
      $('#sum-review').innerHTML = items.map(function (p) { return '<div class="sum-line"><span>' + esc(p.name) + ' · 30 days</span><span>' + inr(p.price) + '</span></div>'; }).join('') || '<p class="small muted">No tools selected.</p>';
      $('#pay-btn').innerHTML = icon('lock') + 'Pay ' + inr(sub - disc) + ' securely';
    }
    $('#coupon-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#coupon').value.trim().toUpperCase();
      if (v === 'SAVE10') { coupon = 0.10; $('#coupon-msg').innerHTML = '<span style="color:var(--success)">SAVE10 applied — 10% off</span>'; }
      else if (!v) { coupon = 0; $('#coupon-msg').textContent = ''; }
      else { coupon = 0; $('#coupon-msg').innerHTML = '<span style="color:var(--danger)">Invalid coupon code</span>'; }
      renderSummary();
    });
    $('#to-step3').addEventListener('click', function () { goStep(3); });
    $('#back-2').addEventListener('click', function () { goStep(1); });
    $('#back-3').addEventListener('click', function () { goStep(2); });
    $$('input[name=pay]').forEach(function (r) {
      r.addEventListener('change', function () { $$('.payopt').forEach(function (o) { o.classList.toggle('sel', $('input', o).checked); }); });
    });
    $('#pay-btn').addEventListener('click', function () {
      var b = $('#pay-btn');
      b.innerHTML = icon('loader-2') + 'Processing…'; b.disabled = true;
      setTimeout(function () {
        $('#checkout-view').style.display = 'none';
        $('#success-view').style.display = '';
        store('cart', []);
        window.scrollTo({ top: 0 });
      }, 1400);
    });
    renderPicks(); renderSummary();
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (store('theme') !== 'light') document.documentElement.classList.add('dark');
    buildShell();
    var page = document.body.dataset.page;
    ({ dashboard: pageDashboard, products: pageProducts, details: pageDetails, subscriptions: pageSubscriptions, billing: pageBilling, profile: pageProfile, support: pageSupport, extension: pageExtension, login: pageLogin, forgot: pageForgot, signup: pageSignup }[page] || function () {})();
    // landing: swap static initial tiles for brand logos where mapped
    $$('.land-tool').forEach(function (a) {
      var slug = (a.getAttribute('href') || '').split('add=')[1];
      var im = slug && (window.PROD_IMAGES || {})[slug];
      var sp = a.querySelector('.picon');
      if (im && im.file && sp) {
        sp.classList.add('picon-img');
        var img = document.createElement('img');
        img.src = 'assets/images/products/' + im.file;
        img.alt = ''; img.loading = 'lazy';
        img.onerror = function () { sp.removeChild(img); };
        sp.appendChild(img);
      }
    });
  });
  window.App = { icon: icon, toast: toast, modal: modal, inr: inr };
})();
