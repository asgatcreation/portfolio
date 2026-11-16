// Home page: motion and interaction. No libraries. Respects "reduce motion".
// Data comes from the content collections, embedded by src/pages/index.astro as JSON.
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var css = function (n) { return getComputedStyle(root).getPropertyValue(n).trim(); };
  var DATA = JSON.parse(document.getElementById('portfolio-data').textContent), P = DATA.projects;
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var IMG = '/img/';

  // Tiny element builder: h('div', {class: 'x'}, [children or text]). Text is always set with textContent.
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k]; if (v == null || v === false) return;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v;
      else if (k === 'style') e.setAttribute('style', v); else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var ICON = {
    arrow: 'M5 12h14M13 6l6 6-6 6', ext: 'M7 17 17 7M8 7h9v9', code: 'm8 16-4-4 4-4M16 8l4 4-4 4',
    car: 'M5 16h14M6 16l1.5-5h9L18 16M7 16v2M17 16v2M8 13.5h.01M16 13.5h.01', parts: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
    ride: 'M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10zM12 9h.01'
  };
  function svg(name) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2.1'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', ICON[name]); s.appendChild(p); return s;
  }
  var LANG = { Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6', PHP: '#4F5D95', Go: '#00ADD8', R: '#198CE7', HTML: '#e34c26', CSS: '#563d7c', TeX: '#3D6117', 'Jupyter Notebook': '#DA5B0B', Dart: '#00B4AB', Java: '#b07219' };
  var STATUS = { live: 'Live', dev: 'In development', pre: 'Pre-release', report: 'Report', private: 'Private', team: 'Team project' };
  var STATUS_C = { live: 'var(--live)', dev: 'var(--dev)', pre: 'var(--pre)', report: '#b48cff', private: '#ff9fd1', team: '#c9a7ff' };

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400); }

  /* ---------- Preloader ---------- */
  var loader = $('[data-loader]');
  function ready() { if (loader) loader.classList.add('done'); root.classList.add('ready'); }
  if (!loader || reduce || /^#project\//.test(location.hash)) ready();
  else {
    var lbar = $('[data-load-bar]'), lpct = $('[data-load-pct]'), t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / 900), v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      lbar.style.width = v + '%'; lpct.textContent = v + '%';
      if (p < 1) requestAnimationFrame(tick); else setTimeout(ready, 150);
    })(t0);
    setTimeout(ready, 2500);
  }

  /* ---------- Cursor ---------- */
  if (fine && !reduce) {
    var ring = $('.cursor'), dot = $('.cursor-dot'), mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; document.body.classList.add('has-cursor'); dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); });
    (function follow() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(follow); })();
    document.addEventListener('mouseover', function (e) { ring.classList.toggle('hover', !!e.target.closest('a, button, input, textarea, label, summary')); });
  }

  /* ---------- Nav, progress, back to top, menu, scroll spy ---------- */
  var nav = $('[data-nav]'), prog = $('[data-scroll-progress]'), topBtn = $('[data-totop]'), topRing = $('[data-totop-ring]');
  var cards = [];
  function onScroll() {
    var y = scrollY, hgt = document.documentElement.scrollHeight - innerHeight, p = hgt > 0 ? y / hgt : 0;
    nav.classList.toggle('solid', y > 20);
    prog.style.width = (p * 100).toFixed(2) + '%';
    topBtn.classList.toggle('show', y > 600);
    topRing.style.strokeDashoffset = (150.8 * (1 - p)).toFixed(1);
    stackEffect();
  }
  addEventListener('scroll', onScroll, { passive: true });
  topBtn.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); $('.brand').focus({ preventScroll: true }); });
  var burger = $('[data-burger]'), links = $('#links');
  function setMenu(open) { links.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  burger.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  var navLinks = $$('a', links);
  var spyMap = { projects: 'work', now: 'work', services: 'about', process: 'skills', 'open-source': 'skills', faq: 'writing' };
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; var id = spyMap[en.target.id] || en.target.id;
      navLinks.forEach(function (a) { var on = a.getAttribute('href') === '/#' + id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(function (s) { spy.observe(s); });

  /* ---------- Typed roles ---------- */
  var tw = $('[data-typed]');
  if (tw && !reduce) {
    var words = JSON.parse(tw.dataset.typed), wi = 0, ci = words[0].length, del = true;
    (function type() {
      if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; } }
      else { ci++; if (ci >= words[wi].length) { del = true; tw.textContent = words[wi]; return setTimeout(type, 1800); } }
      tw.textContent = words[wi].slice(0, Math.max(0, ci)) || '​';
      setTimeout(type, del ? 40 : 75);
    })();
  }

  /* ---------- Particle field ---------- */
  var cv = $('#field'), hero = $('.hero');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), pts = [], mouse = { x: -999, y: -999 }, running = false, raf = 0, gold = '', ink = '';
    var colors = function () { gold = css('--gold') || '#e6b450'; ink = css('--text') || '#fff'; };
    var size = function () {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, W * H / 14000)), seed = 7; pts = [];
      var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (var i = 0; i < n; i++) pts.push({ x: rnd() * W, y: rnd() * H, vx: (rnd() - .5) * .35, vy: (rnd() - .5) * .35, r: rnd() * 1.6 + .6, g: rnd() < .22 });
    };
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
        var dx = mouse.x - p.x, dy = mouse.y - p.y, dm = Math.sqrt(dx * dx + dy * dy);
        if (dm < 160 && !reduce) { p.x -= dx * .006; p.y -= dy * .006; }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], ex = p.x - q.x, ey = p.y - q.y, d = ex * ex + ey * ey;
          if (d < 13000) { ctx.globalAlpha = (1 - d / 13000) * .22; ctx.strokeStyle = ink; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        if (dm < 180) { ctx.globalAlpha = (1 - dm / 180) * .7; ctx.strokeStyle = gold; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.globalAlpha = p.g ? .95 : .45; ctx.fillStyle = p.g ? gold : ink; ctx.beginPath(); ctx.arc(p.x, p.y, p.g ? p.r + .6 : p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    };
    var start = function () { if (running || reduce || document.hidden) return; running = true; raf = requestAnimationFrame(draw); };
    var stop = function () { running = false; cancelAnimationFrame(raf); };
    colors(); size(); draw();
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) start(); else stop(); }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    document.addEventListener('themechange', function () { colors(); if (!running) draw(); });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (!running) draw(); }, 150); });
    hero.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });
  }
  var orbit = $('[data-parallax]');
  if (orbit && fine && !reduce) hero.addEventListener('mousemove', function (e) { orbit.style.transform = 'translate(' + ((e.clientX / innerWidth - .5) * 24) + 'px,' + ((e.clientY / innerHeight - .5) * 24) + 'px)'; });

  // Marquee: duplicate the list once so it loops seamlessly.
  var mq = $('[data-marquee]'); if (mq) $$('li', mq).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); mq.appendChild(c); });

  /* ---------- Reveal + counters ---------- */
  var counted = false;
  function countUp(el) {
    var end = +el.dataset.count, s = performance.now(), fmt = new Intl.NumberFormat('en-GB');
    (function step(now) { var p = Math.min(1, (now - s) / 1600), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt.format(Math.round(end * e)); if (p < 1) requestAnimationFrame(step); })(s);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target; t.classList.add('in'); io.unobserve(t);
      if (t.classList.contains('stats') && !counted && !reduce) { counted = true; $$('[data-count]', t).forEach(countUp); }
      if (t.classList.contains('term')) runTerm('py');
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  function watch(scope) { $$('.rv, [data-process]', scope).forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); }); }

  /* ---------- Hover effects (re-bound after each render) ---------- */
  function bindFx(scope) {
    $$('.spot', scope).forEach(function (el) {
      el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--x', (e.clientX - r.left) + 'px'); el.style.setProperty('--y', (e.clientY - r.top) + 'px'); });
    });
    if (!fine || reduce) return;
    $$('[data-tilt]', scope).forEach(function (el) {
      el.addEventListener('mouseenter', function () { el.style.transition = 'transform .15s ease-out, border-color .3s'; });
      el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = 'perspective(1000px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)'; });
      el.addEventListener('mouseleave', function () { el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1), border-color .3s'; el.style.transform = ''; });
    });
    $$('.magnetic', scope).forEach(function (el) {
      el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35).toFixed(1) + 'px)'; });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Shared bits ---------- */
  function statusBadge(p) { return h('span', { class: 'st ' + p.status, text: p.statusLabel }); }
  function coverEl(p, src) {
    var c = h('div', { class: 'cover' }, [statusBadge(p)]);
    if (src || p.cover) c.appendChild(h('img', { src: src || p.cover, alt: '', loading: 'lazy' }));
    else c.appendChild(artEl(p));
    return c;
  }
  function artEl(p) { var a = h('div', { class: 'art', style: '--c:' + p.color }, [h('span', { text: p.art[0] }, [h('small', { text: p.art[1] })])]); return a; }
  function linkBtn(label, href, cls) { return h('a', { class: 'btn sm ' + (cls || ''), href: href, target: '_blank', rel: 'noopener', 'aria-label': label + ' (opens in a new tab)' }, [label + ' ', svg('ext')]); }
  function shotsFor(p, part) { if (p.parts) return p.parts[part || 0].shots; return p.shots; }

  /* ---------- Featured showcase ---------- */
  var showcaseBox = $('[data-showcase]'), slideshows = [];
  var feat = P.filter(function (p) { return p.featured; });
  feat.forEach(function (p, i) {
    var state = { part: 0, idx: 0, timer: 0, visible: false, hover: false };
    var screen = h('button', { class: 'screen', type: 'button', 'aria-label': 'Open screenshots of ' + p.title });
    var cap = h('span', { class: 'cap' }), dots = h('div', { class: 'dots', role: 'group', 'aria-label': 'Screenshots' });
    var sum = h('p', { class: 'sc-sum', text: p.summary });
    function paint() {
      var list = shotsFor(p, state.part); screen.textContent = ''; dots.textContent = '';
      list.forEach(function (s, k) {
        screen.appendChild(h('img', { src: IMG + s[0], alt: k === state.idx ? s[1] : '', loading: 'lazy', class: k === state.idx ? 'on' : null }));
        dots.appendChild(h('button', { type: 'button', 'aria-label': 'Show ' + s[1], 'aria-current': k === state.idx ? 'true' : null, onclick: function () { go(k); } }));
      });
      cap.textContent = list[state.idx] ? list[state.idx][1] : '';
    }
    function go(k) {
      var list = shotsFor(p, state.part); state.idx = (k + list.length) % list.length;
      $$('img', screen).forEach(function (im, n) { im.classList.toggle('on', n === state.idx); im.alt = n === state.idx ? list[n][1] : ''; });
      $$('button', dots).forEach(function (d, n) { if (n === state.idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      cap.textContent = list[state.idx][1];
    }
    screen.addEventListener('click', function () { openLightbox(shotsFor(p, state.part), state.idx); });
    var visual;
    if (p.id === 'naijadata') {
      visual = h('div', { class: 'sc-visual' }, [h('div', { class: 'term-art', 'aria-label': 'Install commands for naija-data' }, [
        h('span', { class: 'p', text: '$ ' }), 'pip install naija-data\n', h('span', { class: 'p', text: '$ ' }), 'npm install naija-data\n', h('span', { class: 'p', text: '$ ' }), 'go get github.com/asgatcreation/naija-data/go\n\n',
        h('span', { class: 'm', text: '# same data, same answers, every language\n' }), h('span', { class: 'ok', text: '✓ 13,392 shared test cases\n' }), h('span', { class: 'ok', text: '✓ 8,809 wards, each with a source\n' }), h('span', { class: 's', text: '→ free REST API on Cloudflare Workers' })])]);
    } else {
      var host = (p.demo || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
      visual = h('div', { class: 'sc-visual' }, [
        h('div', { class: 'browser' }, [h('div', { class: 'bar' }, [h('i'), h('i'), h('i'), h('span', { text: host })]), screen]),
        h('div', { class: 'cap-bar' }, [cap, dots]),
        p.phone ? h('div', { class: 'phone', 'aria-hidden': 'true' }, [h('img', { src: p.phone, alt: '', loading: 'lazy' })]) : null
      ]);
      paint();
    }
    var seg = null;
    if (p.parts) {
      seg = h('div', { class: 'seg', role: 'group', 'aria-label': p.title + ' products' });
      p.parts.forEach(function (pt, k) {
        seg.appendChild(h('button', { type: 'button', 'aria-pressed': String(k === 0), text: pt.short, onclick: function () {
          state.part = k; state.idx = 0; $$('button', seg).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === k)); });
          sum.textContent = pt.about; paint();
        } }));
      });
    }
    var facts = h('div', { class: 'sc-facts' }, p.facts.slice(0, 4).map(function (f) { return h('div', null, [h('b', { text: f[0] }), h('span', { text: f[1] })]); }));
    var actions = h('div', { class: 'sc-actions' }, [
      h('a', { class: 'btn gold sm', href: '/work/' + p.id + '/' }, ['Explore project ', svg('arrow')]),
      p.demo ? linkBtn(p.demoLabel || 'Live demo', p.demo) : null,
      p.code ? linkBtn('Code', p.code) : null
    ]);
    var chips = h('div', { class: 'sc-chips' }, [h('span', { class: 'chip st2', style: '--c2:' + STATUS_C[p.status], text: p.statusLabel })].concat(p.categories.map(function (c) { return h('span', { class: 'chip', text: c }); })));
    var card = h('article', { class: 'showcase', style: '--c:' + p.color + ';--i:' + i, 'aria-labelledby': 'sc-' + p.id }, [
      h('div', { class: 'showcase-in' }, [
        h('div', null, [h('span', { class: 'sc-idx' }, [h('b', { text: String(i + 1).padStart(2, '0') }), ' / ' + String(feat.length).padStart(2, '0')]), chips, h('h3', { id: 'sc-' + p.id, text: p.title }), h('p', { class: 'sc-tag', text: p.tagline }), seg, sum, facts, actions]),
        visual
      ])
    ]);
    showcaseBox.appendChild(card); cards.push(card);
    if (p.id !== 'naijadata') {
      card.addEventListener('mouseenter', function () { state.hover = true; }); card.addEventListener('mouseleave', function () { state.hover = false; });
      slideshows.push({ card: card, state: state, next: function () { go(state.idx + 1); } });
    }
  });
  if (!reduce) {
    var sio = new IntersectionObserver(function (es) { es.forEach(function (en) { slideshows.forEach(function (s) { if (s.card === en.target) s.state.visible = en.isIntersecting; }); }); }, { threshold: .4 });
    slideshows.forEach(function (s) { sio.observe(s.card); });
    setInterval(function () { if (document.hidden) return; slideshows.forEach(function (s) { if (s.state.visible && !s.state.hover) s.next(); }); }, 3600);
  }
  function stackEffect() {
    if (reduce || innerWidth <= 860) { cards.forEach(function (c) { c.style.transform = ''; }); return; }
    for (var i = 0; i < cards.length - 1; i++) {
      var next = cards[i + 1].getBoundingClientRect(), stick = 96 + (i + 1) * 16;
      var p = Math.min(1, Math.max(0, (innerHeight - next.top) / Math.max(1, innerHeight - stick)));
      cards[i].style.transform = 'scale(' + (1 - p * .06).toFixed(4) + ')';
    }
  }

  /* ---------- Explorer ---------- */
  var ex = { status: 'all', category: 'all', language: 'all', q: '', only: null };
  var exGrid = $('[data-ex-grid]'), exCount = $('[data-ex-count]'), exEmpty = $('[data-ex-empty]'), exSearch = $('[data-ex-search]');
  var uniq = function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); };
  var groups = {
    status: ['live', 'dev', 'pre', 'report', 'private', 'team'],
    category: uniq([].concat.apply([], P.map(function (p) { return p.categories; }))),
    language: uniq([].concat.apply([], P.map(function (p) { return p.languages; }))).filter(function (l) { return l.indexOf('[[') < 0; })
  };
  function has(p, g, v) { return g === 'status' ? p.status === v : g === 'category' ? p.categories.indexOf(v) > -1 : p.languages.indexOf(v) > -1; }
  Object.keys(groups).forEach(function (g) {
    var box = $('[data-ex-group="' + g + '"]');
    ['all'].concat(groups[g]).forEach(function (v) {
      var n = v === 'all' ? P.length : P.filter(function (p) { return has(p, g, v); }).length;
      box.appendChild(h('button', { class: 'fchip', type: 'button', 'aria-pressed': String(v === 'all'), 'data-v': v, onclick: function () { ex[g] = v; syncChips(); renderEx(); } }, [g === 'status' && v !== 'all' ? STATUS[v] : v === 'all' ? 'All' : v, h('sup', { text: String(n) })]));
    });
  });
  function syncChips() { Object.keys(groups).forEach(function (g) { $$('[data-ex-group="' + g + '"] .fchip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === ex[g])); }); }); }
  function matches(p) {
    if (ex.only && ex.only.ids.indexOf(p.id) < 0) return false;
    if (ex.status !== 'all' && !has(p, 'status', ex.status)) return false;
    if (ex.category !== 'all' && !has(p, 'category', ex.category)) return false;
    if (ex.language !== 'all' && !has(p, 'language', ex.language)) return false;
    if (ex.q) { var hay = [p.title, p.tagline, p.summary].concat(p.stack, p.categories, p.languages, p.features || []).join(' ').toLowerCase(); return ex.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; }); }
    return true;
  }
  function renderEx() {
    var list = P.filter(matches); exGrid.textContent = '';
    list.forEach(function (p, i) {
      var a = h('a', { class: 'xcard', href: '/work/' + p.id + '/', style: 'animation-delay:' + (reduce ? 0 : i * 45) + 'ms', 'aria-label': p.title + ', ' + p.statusLabel + '. ' + p.tagline }, [
        coverEl(p),
        h('div', { class: 'xbody' }, [
          h('span', { class: 'kind', text: p.categories.join(' · ') }),
          h('h3', { text: p.title }), h('p', { text: p.tagline }),
          h('div', { class: 'xmeta' }, p.languages.map(function (l) { return h('span', { class: 'lang', style: '--lc:' + (LANG[l] || 'var(--dim)') }, [h('i'), l]); }).concat([p.demo ? h('span', { text: '● Live demo' }) : null]))
        ])
      ]);
      $('.cover', a).appendChild(h('span', { class: 'peek', 'aria-hidden': 'true' }, [h('span', { text: 'Explore project →' }), h('span', { text: p.demo ? 'Live ↗' : '' })]));
      exGrid.appendChild(a);
    });
    exEmpty.hidden = list.length > 0;
    exCount.textContent = 'Showing ' + list.length + ' of ' + P.length + ' projects' + (ex.only ? ' that use ' + ex.only.label : '') + (ex.q ? ' for “' + ex.q + '”' : '');
    if (ex.only) exCount.appendChild(h('button', { type: 'button', class: 'linkish', style: 'margin-left:.6rem', text: 'Clear', onclick: function () { ex.only = null; renderEx(); } }));
  }
  var sT; exSearch.addEventListener('input', function () { clearTimeout(sT); sT = setTimeout(function () { ex.q = exSearch.value.trim(); renderEx(); }, 120); });
  $$('[data-ex-reset]').forEach(function (b) { b.addEventListener('click', function () { ex = { status: 'all', category: 'all', language: 'all', q: '', only: null }; exSearch.value = ''; syncChips(); renderEx(); }); });
  renderEx();
  function showProjects(label, ids) { ex = { status: 'all', category: 'all', language: 'all', q: '', only: { label: label, ids: ids } }; exSearch.value = ''; syncChips(); renderEx(); $('#projects').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }

  /* ---------- Now building ---------- */
  var nowBox = $('[data-now]');
  P.filter(function (p) { return p.progress || p.status === 'private'; }).forEach(function (p, i) {
    var kids = [h('h3', { text: p.title }), h('p', { text: p.progress ? p.statusLabel + ' · ' + p.tagline : 'Private repository · details coming' })];
    if (p.progress) {
      var pct = Math.round(p.progress[0] / p.progress[1] * 100);
      kids.push(h('span', { class: 'pct', text: pct + '%' }));
      kids.push(h('div', { class: 'meter', 'aria-hidden': 'true' }, [h('i', { style: '--w:' + pct + '%' })]));
      var t = h('div', { class: 'ticks', 'aria-hidden': 'true' }); for (var k = 0; k < p.progress[1]; k++) t.appendChild(h('span', { class: k < p.progress[0] ? 'done' : null })); kids.push(t);
    } else kids.push(h('span', { class: 'pct', text: '🔒' }));
    nowBox.appendChild(h('a', { class: 'ncard rv d' + Math.min(i, 3), href: '/work/' + p.id + '/', 'aria-label': p.title + ': ' + p.statusLabel }, kids));
  });

  /* ---------- Live GitHub data (the real site fetches this at build time) ---------- */
  (function gh() {
    var state = $('[data-gh-state]');
    var show = P.map(function (p) { return (p.code || '').split('/').pop(); }).filter(Boolean); // only my own project repos are listed by name
    fetch('https://api.github.com/users/asgatcreation/repos?per_page=100&sort=pushed').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (repos) {
      var own = repos.filter(function (r) { return !r.fork; });
      $('[data-gh-repos]').textContent = repos.length; $('[data-gh-own]').textContent = own.length;
      var c = {}; own.forEach(function (r) { if (r.language) c[r.language] = (c[r.language] || 0) + 1; });
      var tot = Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0), sorted = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).slice(0, 7);
      var bar = $('[data-gh-bar]'), ul = $('[data-gh-langs]');
      sorted.forEach(function (k) { bar.appendChild(h('i', { style: 'width:' + (c[k] / tot * 100).toFixed(1) + '%;background:' + (LANG[k] || '#888'), title: k })); ul.appendChild(h('li', { class: 'lang', style: '--lc:' + (LANG[k] || '#888') }, [h('i'), k + ' ' + Math.round(c[k] / tot * 100) + '%'])); });
      var rec = $('[data-gh-recent]'); rec.textContent = '';
      own.filter(function (r) { return show.indexOf(r.name) > -1; }).slice(0, 5).forEach(function (r) {
        var d = new Date(r.pushed_at), days = Math.round((Date.now() - d) / 864e5);
        rec.appendChild(h('li', null, [h('a', { href: r.html_url, target: '_blank', rel: 'noopener', text: r.name }), h('time', { datetime: r.pushed_at, text: days < 1 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago' })]));
      });
      state.textContent = 'live';
    }).catch(function () {
      state.textContent = 'offline'; $('[data-gh-recent]').textContent = '';
      $('[data-gh-recent]').appendChild(h('li', { class: 'm', text: 'GitHub is busy right now. The real site saves this at build time, so it never shows empty.' }));
    });
  })();

  /* ---------- Skills ---------- */
  var DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  var SK = [
    ['Languages', [['Python', 'python/python-original', ['carhub', 'financeflow', 'taskflow', 'naijadata', 'curavia', 'naijapay', 'nei']], ['TypeScript', 'typescript/typescript-original', ['floatbook', 'naijadata', 'curavia', 'ojalive', 'naijapay']], ['JavaScript', 'javascript/javascript-original', ['carhub', 'financeflow']], ['PHP', 'php/php-original', ['floatbook']], ['Go', 'go/go-original', ['naijadata']], ['R', 'r/r-original', ['nei']], ['SQL', null, ['carhub', 'floatbook', 'financeflow', 'taskflow', 'curavia', 'ojalive', 'nei']], ['HTML & CSS', 'html5/html5-original', ['carhub', 'financeflow', 'taskflow', 'floatbook']], ['LaTeX', 'latex/latex-original', [], 'Research writing and typesetting']]],
    ['Backend', [['Django', 'django/django-plain', ['carhub', 'financeflow', 'taskflow', 'curavia']], ['Django REST Framework', null, ['curavia']], ['Django Channels', null, ['carhub', 'curavia'], 'WebSockets in Django'], ['Laravel', 'laravel/laravel-original', ['floatbook']], ['Node.js', 'nodejs/nodejs-original', ['ojalive']], ['Fastify', 'fastify/fastify-original', ['ojalive']], ['Socket.IO', 'socketio/socketio-original', ['ojalive']], ['Celery', null, ['curavia'], 'Background jobs'], ['BullMQ', null, ['ojalive'], 'Job queues'], ['REST APIs', null, ['naijadata', 'curavia']], ['Auth, 2FA & OAuth', null, ['carhub', 'financeflow', 'floatbook']]]],
    ['Frontend', [['Vue 3', 'vuejs/vuejs-original', ['floatbook']], ['React 19', 'react/react-original', ['curavia']], ['Next.js', 'nextjs/nextjs-original', ['ojalive']], ['Inertia.js', null, ['floatbook']], ['Tailwind CSS', 'tailwindcss/tailwindcss-original', ['floatbook']], ['Chart.js', null, ['financeflow']], ['Leaflet maps', null, ['carhub'], 'Live maps and routes'], ['PWA & offline', null, ['carhub', 'floatbook']], ['Responsive design', null, ['carhub', 'financeflow', 'taskflow', 'floatbook'], 'Phone-first layouts']]],
    ['Data & statistics', [['Data analysis', 'pandas/pandas-original', ['nei'], 'Python and R'], ['Statistical modelling', null, [], 'Statistician by training'], ['Forecasting', null, ['financeflow', 'nei'], 'Trends and predictions'], ['Data visualisation', null, ['financeflow', 'nei']], ['Jupyter', 'jupyter/jupyter-original', ['nei']], ['Reproducible research', null, ['nei'], 'Same answer every run'], ['Reference data', null, ['naijadata'], 'Sourced, tested datasets'], ['Mathematics', null, [], 'Probability and stochastic models']]],
    ['Data & cloud', [['PostgreSQL', 'postgresql/postgresql-original', ['carhub', 'floatbook', 'financeflow', 'taskflow', 'curavia', 'ojalive', 'nei']], ['Row-level security', null, ['curavia'], 'Tenant isolation'], ['Redis', 'redis/redis-original', ['curavia', 'ojalive']], ['Docker', 'docker/docker-original', ['floatbook', 'nei']], ['Cloudflare Workers', 'cloudflareworkers/cloudflareworkers-original', ['naijadata']], ['Supabase', 'supabase/supabase-original', ['financeflow']], ['Render', null, ['carhub', 'floatbook', 'financeflow', 'taskflow']], ['GitHub Actions', 'githubactions/githubactions-original', ['carhub', 'floatbook'], 'CI on every push']]],
    ['Payments & fintech', [['Paystack', null, ['carhub', 'naijapay']], ['Flutterwave', null, ['naijapay'], 'In progress'], ['Double-entry ledgers', null, ['floatbook']], ['Webhooks', null, ['carhub', 'naijapay']], ['Multi-currency', null, ['financeflow']], ['Reconciliation', null, ['floatbook'], 'Provider statements']]],
    ['Testing & quality', [['Django tests', null, ['carhub'], '146 in CarHub'], ['Pest', null, ['floatbook']], ['Playwright', 'playwright/playwright-original', ['floatbook'], 'End-to-end tests'], ['Property-based tests', null, ['ojalive']], ['Shared test suites', null, ['naijadata'], '13,392 cases'], ['Static analysis', null, ['floatbook'], 'Larastan level 7']]]
  ];
  var skTabs = $('[data-sk-tabs]'), skGrid = $('[data-sk-grid]'), skAll = [];
  SK.forEach(function (g) { g[1].forEach(function (s) { skAll.push(s); }); });
  var skGroups = [['All', skAll]].concat(SK);
  function initials(n) { return n.replace(/[^A-Za-z0-9 ]/g, '').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
  function renderSk(gi) {
    skGrid.textContent = ''; skGrid.setAttribute('aria-labelledby', 'skt-' + gi);
    skGroups[gi][1].forEach(function (s, i) {
      var used = s[2].map(function (id) { return byId[id] ? byId[id].title : id; });
      var logo = h('span', { class: 'logo' + (s[1] ? '' : ' txt'), 'aria-hidden': 'true' });
      if (s[1]) { var im = h('img', { src: DI + s[1] + '.svg', alt: '', loading: 'lazy', width: 26, height: 26 }); im.onerror = function () { logo.className = 'logo txt'; logo.textContent = initials(s[0]); }; logo.appendChild(im); } else logo.textContent = initials(s[0]);
      var sub = s[3] || (used.length ? used.slice(0, 3).join(' · ') + (used.length > 3 ? ' +' + (used.length - 3) : '') : '');
      var attrs = { class: 'sktile', style: 'animation-delay:' + (reduce ? 0 : i * 25) + 'ms' };
      var kids = [logo, h('b', { text: s[0] }), h('small', { text: sub }), used.length ? h('span', { class: 'uses', text: used.length + (used.length === 1 ? ' project' : ' projects') }) : null];
      var tile;
      if (used.length) { attrs.type = 'button'; attrs['aria-label'] = s[0] + ': used in ' + used.join(', ') + '. Show these projects.'; attrs.onclick = function () { showProjects(s[0], s[2]); }; tile = h('button', attrs, kids); }
      else tile = h('div', attrs, kids);
      skGrid.appendChild(tile);
    });
  }
  skGroups.forEach(function (g, i) {
    skTabs.appendChild(h('button', { type: 'button', role: 'tab', id: 'skt-' + i, 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1', onclick: function () { selSk(i); }, onkeydown: function (e) {
      var k = e.key, j = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? skGroups.length - 1 : null;
      if (j === null) return; e.preventDefault(); j = (j + skGroups.length) % skGroups.length; selSk(j); $('#skt-' + j).focus();
    } }, [g[0], h('small', { text: String(g[1].length) })]));
  });
  function selSk(i) { $$('[role="tab"]', skTabs).forEach(function (b, n) { b.setAttribute('aria-selected', String(n === i)); b.tabIndex = n === i ? 0 : -1; }); renderSk(i); }
  renderSk(0);

  /* ---------- Writing ---------- */
  var artBox = $('[data-articles]'), artF = $('[data-art-filters]'), tags = ['All'].concat(uniq(DATA.articles.map(function (a) { return a.tag; })));
  function renderArt(tag) {
    artBox.textContent = '';
    DATA.articles.filter(function (a) { return tag === 'All' || a.tag === tag; }).forEach(function (a, i) {
      artBox.appendChild(h('article', { class: 'acard', style: 'animation-delay:' + (reduce ? 0 : i * 50) + 'ms' }, [
        h('div', { class: 'top' }, [h('span', { text: a.tag + ' · ' + a.mins + ' min read' }), h('span', { class: 'draft', text: 'Draft' })]),
        h('h3', { text: a.title }), h('p', { class: 'from' }, ['From ', h('b', { text: a.from })])
      ]));
    });
  }
  tags.forEach(function (t) { artF.appendChild(h('button', { type: 'button', 'aria-pressed': String(t === 'All'), text: t, onclick: function (e) { $$('button', artF).forEach(function (b) { b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); renderArt(t); } })); });
  renderArt('All');

  /* ---------- FAQ: one open at a time ---------- */
  $$('[data-faq] details').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) $$('[data-faq] details').forEach(function (o) { if (o !== d) o.open = false; }); }); });

  /* ---------- Terminal ---------- */
  var term = $('[data-term]'), termT = 0;
  var scripts = {
    py: [['$', 'pip install naija-data'], ['m', 'Collecting naija-data'], ['ok', 'Successfully installed naija-data-1.0.0']],
    js: [['$', 'npm install naija-data'], ['m', 'added 1 package']],
    go: [['$', 'go get github.com/asgatcreation/naija-data/go'], ['m', 'go: added github.com/asgatcreation/naija-data/go v1.0.0']]
  };
  function runTerm(lang) {
    clearTimeout(termT); term.textContent = '';
    var steps = scripts[lang], si = 0, cur = h('span', { class: 'cur' });
    (function next() {
      if (si >= steps.length) { term.appendChild(h('div', null, [h('span', { class: 'p', text: '$ ' }), cur])); return; }
      var st = steps[si++];
      if (st[0] !== '$') { term.appendChild(h('div', null, [h('span', { class: st[0], text: st[1] })])); termT = setTimeout(next, reduce ? 0 : 420); return; }
      var tgt = h('span'), row = h('div', null, [h('span', { class: 'p', text: '$ ' }), tgt]); term.appendChild(row);
      if (reduce) { tgt.textContent = st[1]; return next(); }
      var c = 0; row.appendChild(cur);
      (function ch() { tgt.textContent = st[1].slice(0, ++c); if (c < st[1].length) termT = setTimeout(ch, 28 + Math.random() * 40); else { cur.remove(); termT = setTimeout(next, 380); } })();
    })();
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-lang]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); runTerm(b.dataset.lang); }); });

  /* ---------- Copy (delegated) ---------- */
  function copy(text, label) {
    var done = function () { toast((label || 'Copied') + ' ✓'); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { toast('Copy failed: ' + text); }); else toast(text);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-copy]'); if (b) copy(b.dataset.copy, b.dataset.copy.indexOf('@') > -1 ? 'Email copied' : 'Copied: ' + b.dataset.copy); });

  /* ---------- CV menu ---------- */
  var cvBtn = $('[data-cv-btn]'), cvList = $('#cv-list');
  function cvOpen(o) { cvList.hidden = !o; cvBtn.setAttribute('aria-expanded', String(o)); if (o) $('a', cvList).focus(); }
  cvBtn.addEventListener('click', function () { cvOpen(cvList.hidden); });
  document.addEventListener('click', function (e) { if (!cvList.hidden && !e.target.closest('.cv-menu')) cvOpen(false); });
  (DATA.cvs || []).forEach(function (c) {
    cvList.appendChild(h('li', null, [h('a', { href: '/cv/' + c[2], download: c[2], onclick: function () { cvOpen(false); toast('Downloading ' + c[0]); } }, [h('b', { text: c[0] }), h('span', { text: c[1] }), h('em', { text: 'PDF ⇩' })])]));
  });

  /* ---------- Contact: clock + wizard ---------- */
  var clock = $('[data-clock]'), clockNote = $('[data-clock-note]');
  function tickClock() {
    var now = new Date();
    clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }).format(now);
    var diff = 1 + now.getTimezoneOffset() / 60; // Lagos is UTC+1
    clockNote.textContent = 'West Africa Time (UTC+1) · ' + (diff === 0 ? 'same time as you' : Math.abs(diff) + (Math.abs(diff) === 1 ? ' hour ' : ' hours ') + (diff > 0 ? 'ahead of you' : 'behind you'));
  }
  tickClock(); setInterval(tickClock, 30000);
  var C = DATA.contact;
  function waLink(text) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text); }
  function mailLink(subject, body) { return 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function check(form) {
    var bad = null;
    $$('[required]', form).forEach(function (i) { var b = !i.checkValidity(); var f = i.closest('.fld'); if (f) f.classList.toggle('bad', b); i.setAttribute('aria-invalid', String(b)); if (b && !bad) bad = i; });
    if (bad) bad.focus(); return !bad;
  }
  $$('[data-msg-form] [required], [data-book-form] [required]').forEach(function (i) { i.addEventListener('input', function () { if (i.checkValidity()) { i.closest('.fld').classList.remove('bad'); i.removeAttribute('aria-invalid'); } }); });
  // Tabs
  var cTabs = $$('[data-ctab]');
  function cSelect(id, focus) {
    cTabs.forEach(function (t) { var on = t.dataset.ctab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; if (on && focus) t.focus(); });
  }
  cTabs.forEach(function (t, i) {
    t.addEventListener('click', function () { cSelect(t.dataset.ctab); });
    t.addEventListener('keydown', function (e) { var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null; if (j === null) return; e.preventDefault(); cSelect(cTabs[(j + cTabs.length) % cTabs.length].dataset.ctab, true); });
  });
  $$('[data-goto-tab]').forEach(function (a) { a.addEventListener('click', function () { cSelect(a.dataset.gotoTab); }); });
  // 1. Message
  var mf = $('[data-msg-form]'), mMsg = $('#m-msg'), chars = $('[data-chars]', mf), mStatus = $('[data-msg-status]');
  mMsg.addEventListener('input', function () { chars.textContent = mMsg.value.length + ' / 2000'; });
  function msgText(f) {
    return ['Name: ' + f.name.value.trim(), 'Email: ' + f.email.value.trim(), f.phone.value.trim() ? 'Phone: ' + f.phone.value.trim() : null, f.org.value.trim() ? 'Organisation: ' + f.org.value.trim() : null,
      'About: ' + f.topic.value, 'Budget: ' + f.budget.value, 'Timeline: ' + f.when.value, '', f.message.value.trim()].filter(function (x) { return x !== null; }).join('\n');
  }
  function done(el, text) { el.textContent = text; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }
  mf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(mf)) return;
    var f = mf.elements, subject = f.topic.value + ' · from ' + f.name.value.trim();
    if (C.formEndpoint) {
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ subject: subject, name: f.name.value, email: f.email.value, message: msgText(f) }) })
        .then(function (r) { if (!r.ok) throw 0; done(mStatus, 'Thank you, ' + f.name.value.trim().split(' ')[0] + '! Your message has been sent.'); mf.reset(); chars.textContent = '0 / 2000'; })
        .catch(function () { location.href = mailLink(subject, msgText(f)); });
    } else {
      location.href = mailLink(subject, msgText(f));
      done(mStatus, 'Your email app is opening with the message ready. Just press send.');
    }
  });
  $('[data-send="wa"]', mf).addEventListener('click', function () {
    if (!check(mf)) return; open(waLink('Hello Gabriel,\n\n' + msgText(mf.elements)), '_blank', 'noopener');
    done(mStatus, 'WhatsApp is opening with your message ready. Just press send.');
  });
  // 2. Booking
  var bf = $('[data-book-form]'), daysBox = $('[data-days]'), slotsBox = $('[data-slots]'), bSum = $('[data-book-summary]'), bStatus = $('[data-book-status]');
  var dFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }), longFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  for (var dd = 1, made = 0; made < C.days && dd < 30; dd++) {
    var day = new Date(); day.setDate(day.getDate() + dd); var wd = day.getDay(); if (wd === 0 || wd === 6) continue;
    var parts = dFmt.formatToParts(day), get = function (t) { return (parts.filter(function (x) { return x.type === t; })[0] || {}).value; };
    daysBox.appendChild(h('label', null, [h('input', { type: 'radio', name: 'day', value: longFmt.format(day), checked: made === 0 }), h('span', null, [h('small', { text: get('weekday') }), h('b', { text: get('day') }), h('small', { text: get('month') })])]));
    made++;
  }
  C.slots.forEach(function (t, i) { slotsBox.appendChild(h('label', null, [h('input', { type: 'radio', name: 'time', value: t, checked: i === 0 }), h('span', { text: t })])); });
  function bookText() { var f = bf.elements; return 'Call request: ' + f.day.value + ' at ' + f.time.value + ' (WAT) by ' + f.via.value + '.'; }
  function bookSum() { var f = bf.elements; bSum.textContent = ''; bSum.append(h('b', { text: f.day.value + ' · ' + f.time.value + ' WAT' }), ' by ' + f.via.value); }
  bf.addEventListener('change', bookSum); bookSum();
  function bookBody() { var f = bf.elements; return [bookText(), 'Name: ' + f.name.value.trim(), 'Email: ' + f.email.value.trim(), f.about.value.trim() ? 'Topic: ' + f.about.value.trim() : null].filter(Boolean).join('\n'); }
  bf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(bf)) return;
    location.href = mailLink('Call request · ' + bf.elements.day.value + ' ' + bf.elements.time.value, bookBody());
    done(bStatus, 'Your email app is opening with the request. I’ll confirm the time by email.');
  });
  $('[data-book="wa"]', bf).addEventListener('click', function () { if (!check(bf)) return; open(waLink('Hello Gabriel,\n\n' + bookBody()), '_blank', 'noopener'); done(bStatus, 'WhatsApp is opening with your request. I’ll confirm the time there.'); });
  // 3. WhatsApp quick messages
  $$('[data-wa-text]').forEach(function (a) { a.href = waLink(a.dataset.waText); a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- Focus trap helper ---------- */
  function trap(box, e) {
    var f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', box).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return; var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function lock() { document.body.classList.toggle('locked', !viewer.hidden || !lb.hidden || !pal.hidden); }

  /* ---------- Lightbox ---------- */
  var lb = $('[data-lightbox]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]'), lbList = [], lbI = 0, lbReturn = null;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var s = lbList[lbI]; lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = ''; lbImg.src = IMG + s[0]; lbImg.alt = s[1]; lbCap.textContent = s[1] + '  ·  ' + (lbI + 1) + ' / ' + lbList.length; }
  function openLightbox(list, i) { if (!list || !list.length) return; lbReturn = document.activeElement; lbList = list; lb.hidden = false; lbShow(i || 0); lock(); $('[data-lb-close]').focus(); }
  function closeLightbox() { lb.hidden = true; lock(); if (lbReturn) lbReturn.focus(); }
  $('[data-lb-close]').addEventListener('click', closeLightbox);
  $('[data-lb-prev]').addEventListener('click', function () { lbShow(lbI - 1); });
  $('[data-lb-next]').addEventListener('click', function () { lbShow(lbI + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  var tx = 0; lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) lbShow(lbI + (d < 0 ? 1 : -1)); });

  /* ---------- Project viewer ---------- */
  var viewer = $('[data-viewer]'), vSheet = $('.v-sheet', viewer), vBody = $('[data-v-body]'), vCurrent = null, vReturn = null, pushedHere = false;
  function gallery(list, main) {
    var g = h('div', { class: 'gal' + (main ? ' main' : '') });
    list.forEach(function (s, i) { g.appendChild(h('button', { type: 'button', 'aria-label': 'Enlarge: ' + s[1], onclick: function () { openLightbox(list, i); } }, [h('img', { src: IMG + s[0], alt: '', loading: 'lazy' }), h('span', { text: s[1] })])); });
    return g;
  }
  function sec(title, tag, kids) { return h('section', { class: 'v-sec' }, [h('h3', null, [title, tag ? h('small', { text: tag }) : null])].concat(kids)); }
  function archEl(a) {
    var cols = Object.keys(a).filter(function (k) { return a[k] && a[k].length; });
    var box = h('div', { class: 'arch', style: '--cols:' + cols.length });
    cols.forEach(function (k, i) {
      if (i) box.appendChild(h('div', { class: 'arch-link', 'aria-hidden': 'true' }, [h('i')]));
      box.appendChild(h('div', { class: 'arch-col' }, [h('h5', { text: k })].concat(a[k].map(function (x) { return h('div', { class: 'node', text: x }); }))));
    });
    return box;
  }
  function radarEl(vals) {
    var NS = 'http://www.w3.org/2000/svg', S = 340, c = S / 2, R = 110, ax = DATA.radarAxes, n = ax.length;
    var el = function (t, at) { var e = document.createElementNS(NS, t); Object.keys(at).forEach(function (k) { e.setAttribute(k, at[k]); }); return e; };
    var pt = function (i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    var svgE = el('svg', { viewBox: '-50 -10 ' + (S + 100) + ' ' + (S + 20), role: 'img', 'aria-label': 'Complexity: ' + ax.map(function (a, i) { return a + ' ' + vals[i] + ' of 5'; }).join(', '), class: 'radar' });
    for (var l = 1; l <= 5; l++) svgE.appendChild(el('polygon', { points: ax.map(function (_, i) { return pt(i, R * l / 5).join(','); }).join(' '), class: 'r-grid' }));
    ax.forEach(function (a, i) {
      var e = pt(i, R); svgE.appendChild(el('line', { x1: c, y1: c, x2: e[0], y2: e[1], class: 'r-grid' }));
      var t = pt(i, R + 26), tx = el('text', { x: t[0], y: t[1] + 4, 'text-anchor': Math.abs(t[0] - c) < 5 ? 'middle' : t[0] > c ? 'start' : 'end', class: 'r-lbl' }); tx.textContent = a; svgE.appendChild(tx);
    });
    var poly = el('polygon', { points: vals.map(function (v, i) { return pt(i, R * v / 5).join(','); }).join(' '), class: 'r-val' }); svgE.appendChild(poly);
    vals.forEach(function (v, i) { var q = pt(i, R * v / 5); svgE.appendChild(el('circle', { cx: q[0], cy: q[1], r: 4, class: 'r-dot' })); });
    return svgE;
  }
  function barsEl(c) {
    var max = c.max || Math.max.apply(null, c.rows.map(function (r) { return r[1]; })), fmt = new Intl.NumberFormat('en-GB');
    return h('figure', { class: 'bars' }, [h('figcaption', null, [h('b', { text: c.title }), h('small', { text: c.note || '' })]),
      h('div', { class: 'bar-list' }, c.rows.map(function (r, i) {
        var w = c.log ? Math.log10(r[1]) / Math.log10(max) : r[1] / max;
        return h('div', { class: 'brow' }, [h('span', { text: r[0] }), h('div', { class: 'btrack', 'aria-hidden': 'true' }, [h('i', { style: '--w:' + Math.max(2, w * 100).toFixed(1) + '%;--d:' + i * 120 + 'ms' })]), h('b', { text: fmt.format(r[1]) + (c.unit || '') })]);
      }))]);
  }
  var langCache = {};
  function langEl(repo) {
    var fig = h('figure', { class: 'bars lang-fig' }, [h('figcaption', null, [h('b', { text: 'Languages in the code' }), h('small', { text: 'Live from GitHub' })])]), body = h('div', { class: 'donut-wrap' }, [h('p', { class: 'm', text: 'Loading…' })]);
    fig.appendChild(body);
    var draw = function (d) {
      body.textContent = ''; var keys = Object.keys(d).sort(function (a, b) { return d[b] - d[a]; }), tot = keys.reduce(function (s, k) { return s + d[k]; }, 0);
      if (!tot) { body.appendChild(h('p', { class: 'm', text: 'No language data yet.' })); return; }
      var NS = 'http://www.w3.org/2000/svg', sv = document.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 120 120'); sv.setAttribute('class', 'donut'); sv.setAttribute('aria-hidden', 'true');
      var off = 0, C2 = 2 * Math.PI * 46, top = keys.slice(0, 6);
      top.forEach(function (k) { var f = d[k] / tot, ci = document.createElementNS(NS, 'circle'); ci.setAttribute('cx', 60); ci.setAttribute('cy', 60); ci.setAttribute('r', 46); ci.setAttribute('fill', 'none'); ci.setAttribute('stroke', LANG[k] || '#888'); ci.setAttribute('stroke-width', 16); ci.setAttribute('stroke-dasharray', (f * C2).toFixed(2) + ' ' + C2.toFixed(2)); ci.setAttribute('stroke-dashoffset', (-off * C2).toFixed(2)); ci.setAttribute('transform', 'rotate(-90 60 60)'); sv.appendChild(ci); off += f; });
      body.appendChild(sv);
      body.appendChild(h('ul', { class: 'langs' }, top.map(function (k) { return h('li', { class: 'lang', style: '--lc:' + (LANG[k] || '#888') }, [h('i'), k + ' ' + (d[k] / tot * 100).toFixed(1) + '%']); })));
    };
    if (langCache[repo]) draw(langCache[repo]);
    else fetch('https://api.github.com/repos/asgatcreation/' + repo + '/languages').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { langCache[repo] = d; draw(d); })
      .catch(function () { body.textContent = ''; body.appendChild(h('p', { class: 'm', text: 'GitHub is busy right now; the real site saves this at build time.' })); });
    return fig;
  }
  function renderViewer(p) {
    vBody.textContent = ''; vSheet.style.setProperty('--c', p.color);
    $('[data-v-crumb]').textContent = ''; $('[data-v-crumb]').append('~ / work / ', h('b', { text: p.id }));
    var ctas = h('div', { class: 'v-ctas' }, [
      p.demo ? h('a', { class: 'btn gold', href: p.demo, target: '_blank', rel: 'noopener', 'aria-label': (p.demoLabel || 'Live demo') + ' (opens in a new tab)' }, [(p.demoLabel || 'Open live demo') + ' ', svg('ext')]) : null,
      h('a', { class: 'btn', href: '/work/' + p.id + '/', 'data-full': '' }, ['Full page']),
      p.code ? h('a', { class: 'btn', href: p.code, target: '_blank', rel: 'noopener', 'aria-label': 'Code on GitHub (opens in a new tab)' }, ['View code ', svg('ext')]) : h('span', { class: 'chip', text: p.status === 'private' ? '🔒 Private code' : 'Code private' })
    ]);
    var heroKids = [h('div', { class: 'sc-chips' }, [h('span', { class: 'chip st2', style: '--c2:' + STATUS_C[p.status], text: p.statusLabel })].concat(p.categories.map(function (c) { return h('span', { class: 'chip', text: c }); }))), h('h2', { id: 'v-title', text: p.title }), h('p', { class: 'sc-tag', text: p.tagline }), h('p', { class: 'sc-sum', text: p.summary })];
    if (p.progress) { var pct = Math.round(p.progress[0] / p.progress[1] * 100); heroKids.push(h('div', { class: 'v-progress' }, [h('div', { class: 'meter in' }, [h('i', { style: '--w:' + pct + '%' })]), h('p', { text: p.progress[0] + ' of ' + p.progress[1] + ' milestones · ' + pct + '%' })])); }
    heroKids.push(ctas);
    vBody.appendChild(h('header', { class: 'v-hero' }, heroKids));
    if (p.facts.length) vBody.appendChild(h('div', { class: 'v-facts' }, p.facts.map(function (f) { return h('div', null, [h('b', { text: f[0] }), h('span', { text: f[1] })]); })));
    var n = 0, num = function () { n++; return String(n).padStart(2, '0'); };
    vBody.appendChild(sec('Why I built it', num(), [h('p', { class: 'v-why', text: p.why || p.problem }), p.why && p.problem ? h('p', { class: 'v-problem' }, [h('b', { text: 'The problem: ' }), p.problem]) : null]));
    if (p.flow) vBody.appendChild(sec('How it works', num(), [h('ol', { class: 'flow' }, p.flow.map(function (f, k) { return h('li', { style: '--k:' + k }, [h('span', { text: String(k + 1) }), h('b', { text: f })]); }))]));
    if (p.parts) {
      var tabs = h('div', { class: 'v-parts', role: 'tablist', 'aria-label': p.title + ' products' }), panel = h('div', { role: 'tabpanel', id: 'v-part-panel' });
      var showPart = function (k) {
        $$('button', tabs).forEach(function (b, m) { b.setAttribute('aria-selected', String(m === k)); b.tabIndex = m === k ? 0 : -1; });
        var pt = p.parts[k]; panel.textContent = ''; panel.setAttribute('aria-labelledby', 'v-pt-' + k);
        panel.appendChild(h('div', { class: 'v-part' }, [h('div', null, [h('h4', { text: pt.name }), h('p', { text: pt.about }), h('ul', { class: 'feat' }, pt.features.map(function (f) { return h('li', { text: f }); }))]), gallery(pt.shots, true)]));
      };
      p.parts.forEach(function (pt, k) {
        tabs.appendChild(h('button', { type: 'button', role: 'tab', id: 'v-pt-' + k, 'aria-controls': 'v-part-panel', onclick: function () { showPart(k); }, onkeydown: function (e) {
          var j = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : null; if (j === null) return; e.preventDefault(); j = (j + p.parts.length) % p.parts.length; showPart(j); $('#v-pt-' + j).focus();
        } }, [svg(pt.icon), pt.name]));
      });
      vBody.appendChild(sec(p.parts.length + ' products in one', num(), [tabs, panel])); showPart(0);
      if (p.extra) vBody.appendChild(sec('Across the platform', num(), [gallery(p.extra)]));
    } else {
      vBody.appendChild(sec('What it does', num(), [h('ul', { class: 'feat grid2' }, p.features.map(function (f) { return h('li', { text: f }); }))]));
      vBody.appendChild(sec('Screens', num(), [p.shots.length ? gallery(p.shots, true) : h('div', { class: 'v-art' }, [artEl(p)]), p.shots.length ? null : h('p', { class: 'art-note', text: 'Screenshots arrive with the live demo.' })]));
    }
    if (p.arch) vBody.appendChild(sec('Architecture', num(), [archEl(p.arch), h('p', { class: 'art-note', text: 'How the parts connect, from the people using it to the services behind it.' })]));
    if ((p.hard && p.hard.length) || p.radar) {
      vBody.appendChild(sec('Technical complexity', num(), [h('div', { class: 'cx' }, [
        p.hard && p.hard.length ? h('div', { class: 'hard' }, p.hard.map(function (x, k) { return h('article', null, [h('span', { text: String(k + 1).padStart(2, '0') }), h('h4', { text: x[0] }), h('p', { text: x[1] })]); })) : null,
        p.radar ? h('figure', { class: 'radar-fig' }, [radarEl(p.radar), h('figcaption', { text: 'Complexity profile, self-assessed from 1 to 5' })]) : null
      ])]));
    }
    var charts = h('div', { class: 'charts' });
    [p.chart, p.chart2].forEach(function (c) { if (c) charts.appendChild(barsEl(c)); });
    if (p.progress) charts.appendChild(barsEl({ title: 'Build progress', note: 'Milestones completed', rows: [['Done', p.progress[0]], ['To go', p.progress[1] - p.progress[0]]], max: p.progress[1] }));
    if (p.code) charts.appendChild(langEl(p.code.split('/').pop()));
    if (charts.children.length) vBody.appendChild(sec('Numbers & charts', num(), [charts]));
    var meta = h('dl', { class: 'v-meta' }, [['Status', STATUS[p.status]], ['Industry', p.industry || p.categories.join(', ')], ['Year', p.year], ['Languages', p.languages.join(', ')]].map(function (m) { return h('div', null, [h('dt', { text: m[0] }), h('dd', { text: m[1] })]); }));
    vBody.appendChild(sec('Tech stack & facts', num(), [h('ul', { class: 'v-stack' }, p.stack.map(function (s) { return h('li', { text: s }); })), meta, p.note ? h('div', { class: 'v-note' }, [h('b', { text: 'Note' }), h('span', { text: p.note })]) : null]));
    var i = P.indexOf(p), prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
    vBody.appendChild(h('nav', { class: 'v-end', 'aria-label': 'More projects' }, [
      h('button', { type: 'button', onclick: function () { goProject(prev.id); } }, [h('small', { text: '← Previous' }), h('b', { text: prev.title })]),
      h('button', { type: 'button', onclick: function () { goProject(next.id); } }, [h('small', { text: 'Next →' }), h('b', { text: next.title })])
    ]));
    vBody.scrollTop = 0;
  }
  function goProject(id) { history.replaceState(null, '', '#project/' + id); openViewer(id); }
  function openViewer(id) {
    var p = byId[id]; if (!p) return;
    if (viewer.hidden) { vReturn = document.activeElement; viewer.hidden = false; void viewer.offsetWidth; viewer.classList.add('open'); }
    vCurrent = p; renderViewer(p); lock(); setTimeout(function () { $('[data-v-close]').focus(); }, 60);
    document.title = p.title + ' · Akanji Oluwaseun Gabriel';
  }
  function closeViewer(fromHash) {
    if (viewer.hidden) return;
    viewer.classList.remove('open'); vCurrent = null; document.title = 'Akanji Oluwaseun Gabriel · Software engineer (Mockup E: Spotlight)';
    setTimeout(function () { viewer.hidden = true; lock(); }, reduce ? 0 : 450);
    if (!fromHash) { if (pushedHere) { pushedHere = false; history.back(); } else history.replaceState(null, '', location.pathname + location.search); }
    if (vReturn && document.contains(vReturn)) vReturn.focus({ preventScroll: true });
  }
  $('[data-v-close]').addEventListener('click', function () { closeViewer(false); });
  $('[data-v-prev]').addEventListener('click', function () { var i = P.indexOf(vCurrent); goProject(P[(i - 1 + P.length) % P.length].id); });
  $('[data-v-next]').addEventListener('click', function () { var i = P.indexOf(vCurrent); goProject(P[(i + 1) % P.length].id); });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) closeViewer(false); });
  function route(initial) {
    var m = location.hash.match(/^#project\/([\w-]+)/);
    if (m) { if (!initial) pushedHere = true; openViewer(m[1]); } else closeViewer(true);
  }
  addEventListener('hashchange', function () { route(false); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="/work/"]:not([data-full])');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var m = a.getAttribute('href').match(/^\/work\/([\w-]+)\/$/);
    if (!m || !byId[m[1]]) return;
    e.preventDefault(); location.hash = '#project/' + m[1];
  });

  /* ---------- Command palette ---------- */
  var pal = $('[data-palette]'), palIn = $('[data-palette-input]'), palList = $('[data-palette-list]'), palSel = 0, palItems = [], palReturn = null;
  var SECTIONS = [['About me', '#about', '👋'], ['Featured work', '#work', '★'], ['All projects', '#projects', '▦'], ['Now building', '#now', '⚙'], ['Skills & tools', '#skills', '◆'], ['Journey', '#journey', '↗'], ['Articles', '#writing', '✎'], ['FAQ', '#faq', '?'], ['Contact', '#contact', '✉']];
  var ITEMS = [].concat(
    P.map(function (p) { return { g: 'Projects', t: p.title, s: p.statusLabel + ' · ' + p.categories.join(', '), i: p.title[0], run: function () { location.hash = '#project/' + p.id; } }; }),
    SECTIONS.map(function (s) { return { g: 'Go to', t: s[0], s: 'Section', i: s[2], run: function () { $(s[1]).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } }; }),
    [{ g: 'Actions', t: 'Switch light / dark theme', s: 'Theme', i: '◐', run: function () { $('[data-theme-toggle]').click(); } },
     { g: 'Actions', t: 'Copy my email address', s: 'asgatcreation@gmail.com', i: '@', run: function () { copy('asgatcreation@gmail.com', 'Email copied'); } },
     { g: 'Actions', t: 'Download my CV', s: 'General · Software engineer · Data scientist · Statistician', i: '⇩', run: function () { $('#about').scrollIntoView(); setTimeout(function () { cvOpen(true); }, 400); } },
     { g: 'Actions', t: 'Open GitHub profile', s: 'github.com/asgatcreation', i: '↗', run: function () { open('https://github.com/asgatcreation', '_blank', 'noopener'); } }]
  );
  function renderPal() {
    var q = palIn.value.trim().toLowerCase(); palList.textContent = '';
    palItems = ITEMS.filter(function (it) { return !q || (it.t + ' ' + it.s + ' ' + it.g).toLowerCase().indexOf(q) > -1; });
    if (palSel >= palItems.length) palSel = 0;
    if (!palItems.length) { palList.appendChild(h('div', { class: 'none', text: 'Nothing found for “' + palIn.value + '”' })); palIn.removeAttribute('aria-activedescendant'); return; }
    var last = '';
    palItems.forEach(function (it, i) {
      if (it.g !== last) { palList.appendChild(h('div', { class: 'grp', role: 'presentation', text: it.g })); last = it.g; }
      palList.appendChild(h('div', { role: 'option', id: 'pal-' + i, 'aria-selected': String(i === palSel), onclick: function () { runPal(i); }, onmousemove: function () { if (palSel !== i) { palSel = i; mark(); } } }, [h('span', { class: 'pi', 'aria-hidden': 'true', text: it.i }), h('span', null, [h('b', { text: it.t }), h('small', { text: it.s })])]));
    });
    mark();
  }
  function mark() { $$('[role="option"]', palList).forEach(function (o, i) { o.setAttribute('aria-selected', String(i === palSel)); if (i === palSel) { palIn.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' }); } }); }
  function runPal(i) { var it = palItems[i]; closePal(); if (it) setTimeout(it.run, 30); }
  function openPal() { palReturn = document.activeElement; pal.hidden = false; palIn.value = ''; palSel = 0; renderPal(); lock(); palIn.focus(); }
  function closePal() { if (pal.hidden) return; pal.hidden = true; lock(); if (palReturn) palReturn.focus({ preventScroll: true }); }
  palIn.addEventListener('input', function () { palSel = 0; renderPal(); });
  palIn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); palSel = (palSel + 1) % Math.max(1, palItems.length); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = (palSel - 1 + palItems.length) % Math.max(1, palItems.length); mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
  });
  $('[data-palette-open]').addEventListener('click', openPal);
  $('[data-palette-close]').addEventListener('click', closePal);

  /* ---------- One keyboard handler for every overlay ---------- */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (pal.hidden) openPal(); else closePal(); return; }
    if (!lb.hidden) { if (e.key === 'Escape') closeLightbox(); else if (e.key === 'ArrowRight') lbShow(lbI + 1); else if (e.key === 'ArrowLeft') lbShow(lbI - 1); else if (e.key === 'Tab') trap(lb, e); return; }
    if (!pal.hidden) { if (e.key === 'Escape') closePal(); else if (e.key === 'Tab') e.preventDefault(); return; }
    if (!viewer.hidden) { if (e.key === 'Escape') closeViewer(false); else if (e.key === 'Tab') trap(vSheet, e); return; }
    if (e.key === 'Escape') {
      if (links.classList.contains('open')) { setMenu(false); burger.focus(); }
      else if (!cvList.hidden) { cvOpen(false); cvBtn.focus(); }
    }
  });

  /* ---------- Start ---------- */
  watch(document); bindFx(document); onScroll(); route(true);
  if (reduce && term) runTerm('py');
})();
