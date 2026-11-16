// Phone menu, reading progress and the active table-of-contents link.
(function () {
  var btn = document.querySelector('[data-menu]');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }
  var bar = document.querySelector('[data-progress]');
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  if (bar || links.length) {
    var onScroll = function () {
      var doc = document.querySelector('.doc');
      if (bar && doc) {
        var r = doc.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        bar.style.width = (p * 100).toFixed(1) + '%';
      }
      var current = null;
      links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < 160) current = a; });
      links.forEach(function (a) { a.classList.toggle('on', a === current); if (a === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();
