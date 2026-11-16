// Inner pages: header, menu, reading progress, back to top, reveal, copy and the screenshot lightbox.
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
  document.addEventListener('keydown', function (e) {
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
