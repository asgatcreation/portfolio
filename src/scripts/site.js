// Inner pages: header, menu, reading progress, back to top, reveal, copy and the screenshot lightbox.
import { prepare, rank } from './search-core.js';

(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) {
    return (c || document).querySelector(s);
  };
  var $$ = function (s, c) {
    return [].slice.call((c || document).querySelectorAll(s));
  };

  var nav = $('[data-nav]'),
    prog = $('[data-scroll-progress]'),
    top = $('[data-totop]'),
    ring = $('[data-totop-ring]');
  function onScroll() {
    var y = scrollY,
      hgt = document.documentElement.scrollHeight - innerHeight,
      p = hgt > 0 ? y / hgt : 0;
    if (nav) nav.classList.toggle('solid', y > 20);
    if (prog) prog.style.width = (p * 100).toFixed(2) + '%';
    if (top) top.classList.toggle('show', y > 600);
    if (ring) ring.style.strokeDashoffset = (150.8 * (1 - p)).toFixed(1);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (top)
    top.addEventListener('click', function () {
      scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

  var burger = $('[data-burger]'),
    links = $('#links');
  function setMenu(open) {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && links)
    burger.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });

  // Reveal on scroll (content is visible without JS; .js on <html> enables the animation)
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  $$('.rv').forEach(function (el) {
    io.observe(el);
  });

  // Toast + copy
  var toastEl = $('[data-toast]'),
    tt = 0;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2400);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText(b.dataset.copy).then(function () {
      toast('Copied ✓');
    });
  });

  // Lightbox for galleries: links still open the image when JavaScript is off.
  var lb = $('[data-lightbox]'),
    img = $('[data-lb-img]'),
    cap = $('[data-lb-cap]'),
    list = [],
    idx = 0,
    back = null;
  function show(i) {
    idx = (i + list.length) % list.length;
    var a = list[idx];
    img.src = a.dataset.src;
    img.alt = a.dataset.cap;
    cap.textContent = a.dataset.cap + '  ·  ' + (idx + 1) + ' / ' + list.length;
  }
  function close() {
    lb.hidden = true;
    document.body.classList.remove('locked');
    if (back) back.focus();
  }
  if (lb) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-gallery] a');
      if (!a || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      back = a;
      list = $$('a', a.closest('[data-gallery]'));
      lb.hidden = false;
      document.body.classList.add('locked');
      show(list.indexOf(a));
      $('[data-lb-close]').focus();
    });
    $('[data-lb-close]').addEventListener('click', close);
    $('[data-lb-prev]').addEventListener('click', function () {
      show(idx - 1);
    });
    $('[data-lb-next]').addEventListener('click', function () {
      show(idx + 1);
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    var tx = 0;
    lb.addEventListener(
      'touchstart',
      function (e) {
        tx = e.touches[0].clientX;
      },
      { passive: true },
    );
    lb.addEventListener('touchend', function (e) {
      var d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
    });
  }
  // Command palette: pages and projects, rendered from the JSON block in InnerOverlays.
  var pal = $('[data-palette]'),
    palIn = $('[data-palette-input]'),
    palList = $('[data-palette-list]'),
    palBtn = $('[data-palette-open]'),
    palSel = 0,
    palItems = [],
    palReturn = null,
    NAV = [],
    loaded = false;
  // The page already carries a short list of pages and projects, so the box works the instant it
  // opens. The full index, which also searches the words inside each case study, is fetched the
  // first time it is opened and never downloaded by anyone who does not search.
  try {
    NAV = prepare(
      JSON.parse($('#site-nav-data').textContent).map(function (it) {
        return { g: it.g, t: it.t, s: it.s, u: it.href, i: it.t.charAt(0), body: '' };
      }),
    );
  } catch {
    NAV = []; // no data block on this page: the palette simply stays empty
  }
  function loadIndex() {
    if (loaded) return;
    loaded = true;
    fetch('/search.json')
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data.length) return;
        NAV = prepare(data);
        if (pal && !pal.hidden) palRender();
      })
      .catch(function () {
        /* offline or blocked: the short list above still works */
      });
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function palMark() {
    $$('[role="option"]', palList).forEach(function (o, i) {
      o.setAttribute('aria-selected', String(i === palSel));
      if (i === palSel) {
        palIn.setAttribute('aria-activedescendant', o.id);
        o.scrollIntoView({ block: 'nearest' });
      }
    });
  }
  function palRender() {
    palList.textContent = '';
    palItems = rank(NAV, palIn.value, 40);
    if (palSel >= palItems.length) palSel = 0;
    if (!palItems.length) {
      palList.appendChild(el('div', 'none', 'Nothing found for “' + palIn.value + '”'));
      palIn.removeAttribute('aria-activedescendant');
      return;
    }
    var last = '';
    palItems.forEach(function (hit, i) {
      var it = hit.item;
      if (it.g !== last) {
        var grp = el('div', 'grp', it.g);
        grp.setAttribute('role', 'presentation');
        palList.appendChild(grp);
        last = it.g;
      }
      var row = el('div', null);
      row.setAttribute('role', 'option');
      row.id = 'pal-' + i;
      row.setAttribute('aria-selected', String(i === palSel));
      var ic = el('span', 'pi', it.i || it.t.charAt(0));
      ic.setAttribute('aria-hidden', 'true');
      var box = el('span', null);
      box.appendChild(el('b', null, it.t));
      box.appendChild(el('small', null, it.s));
      if (hit.where) box.appendChild(el('em', 'pwhy', hit.where));
      row.appendChild(ic);
      row.appendChild(box);
      row.addEventListener('click', function () {
        palRun(i);
      });
      row.addEventListener('mousemove', function () {
        if (palSel !== i) {
          palSel = i;
          palMark();
        }
      });
      palList.appendChild(row);
    });
    palMark();
  }
  function palRun(i) {
    var hit = palItems[i];
    palClose();
    if (hit) location.href = hit.item.u;
  }
  function palOpen() {
    loadIndex();
    palReturn = document.activeElement;
    pal.hidden = false;
    palIn.value = '';
    palSel = 0;
    palRender();
    document.body.classList.add('locked');
    palIn.focus();
  }
  function palClose() {
    if (!pal || pal.hidden) return;
    pal.hidden = true;
    document.body.classList.remove('locked');
    if (palReturn) palReturn.focus({ preventScroll: true });
  }
  if (pal && palBtn) {
    palBtn.addEventListener('click', palOpen);
    $('[data-palette-close]').addEventListener('click', palClose);
    palIn.addEventListener('input', function () {
      palSel = 0;
      palRender();
    });
    palIn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        palSel = (palSel + 1) % Math.max(1, palItems.length);
        palMark();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        palSel = (palSel - 1 + palItems.length) % Math.max(1, palItems.length);
        palMark();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        palRun(palSel);
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (pal && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (pal.hidden) palOpen();
      else palClose();
      return;
    }
    if (pal && !pal.hidden) {
      if (e.key === 'Escape') palClose();
      else if (e.key === 'Tab') e.preventDefault();
      return;
    }
    if (lb && !lb.hidden) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      return;
    }
    if (e.key === 'Escape' && links && links.classList.contains('open')) {
      setMenu(false);
      burger.focus();
    }
  });
})();
