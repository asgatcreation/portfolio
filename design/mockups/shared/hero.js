// Signature hero: sample paths of standard Brownian motion, drawn like ink on paper.
// - Seeded, so the drawing is the same on every visit until it redraws.
// - Paths lean gently towards the cursor's height (a small drift term), never jump.
// - Pauses off-screen; static (fully drawn, no animation) for reduced motion or Save-Data.
// Usage: <canvas data-brownian data-paths="9" data-band="true" data-axes="true"></canvas>
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  var still = reduce || saveData || lowPower;

  function rng(seed) { // mulberry32
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { // Box-Muller
    var u = 1 - r(), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  document.querySelectorAll('canvas[data-brownian]').forEach(function (cv) {
    var ctx = cv.getContext('2d');
    var n = +cv.dataset.paths || 9;
    var steps = 420;
    var band = cv.dataset.band === 'true';
    var axes = cv.dataset.axes === 'true';
    var seed = +cv.dataset.seed || 1991;
    var W = 0, H = 0, dpr = 1, paths = [], progress = 0, visible = true, raf = 0;
    var pull = 0, pullTarget = 0; // cursor drift, in units of sigma

    function build() {
      var r = rng(seed);
      paths = [];
      for (var i = 0; i < n; i++) {
        var p = [0], z = [];
        for (var k = 0; k < steps; k++) z.push(gauss(r));
        paths.push({ z: z, delay: i * 0.06 });
      }
    }
    function resize() {
      var b = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      var ink = css(cv, '--hero-ink') || '#222';
      var accent = css(cv, '--hero-accent') || '#1f5d3a';
      var rule = css(cv, '--hero-rule') || 'rgba(0,0,0,.2)';
      ctx.clearRect(0, 0, W, H);
      var pad = axes ? 28 : 6, x0 = pad, x1 = W - 8, y0 = H / 2;
      var scale = (H / 2 - 14) / 2.6; // 2.6 sigma at t = 1 reaches the edge
      var dt = 1 / steps, sq = Math.sqrt(dt);

      if (axes) {
        ctx.strokeStyle = rule; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, 10); ctx.lineTo(x0, H - 10); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
        ctx.fillStyle = rule; ctx.font = 'italic 13px Georgia, serif';
        ctx.fillText('t', x1 - 8, y0 - 8); ctx.fillText('W', x0 - 18, 22);
        for (var q = 1; q <= 4; q++) { var tx = x0 + (x1 - x0) * q / 4; ctx.beginPath(); ctx.moveTo(tx, y0 - 3); ctx.lineTo(tx, y0 + 3); ctx.stroke(); }
      }
      if (band) { // 95% envelope: ±1.96 √t
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = rule; ctx.lineWidth = 1;
        [1, -1].forEach(function (s) {
          ctx.beginPath();
          for (var k = 0; k <= 80; k++) { var t = k / 80; var x = x0 + (x1 - x0) * t; var y = y0 - s * 1.96 * Math.sqrt(t) * scale; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
        });
        ctx.restore();
      }
      paths.forEach(function (p, i) {
        var local = Math.max(0, Math.min(1, (progress - p.delay) / 0.9));
        var upto = Math.floor(local * steps);
        if (upto < 2) return;
        var hl = i === 0;
        ctx.strokeStyle = hl ? accent : ink;
        ctx.globalAlpha = hl ? 1 : 0.42;
        ctx.lineWidth = hl ? 1.6 : 0.9;
        ctx.lineJoin = 'round';
        ctx.shadowColor = accent; ctx.shadowBlur = hl && cv.dataset.glow === 'true' ? 10 : 0;
        ctx.beginPath(); ctx.moveTo(x0, y0);
        var w = 0;
        for (var k = 0; k < upto; k++) {
          w += p.z[k] * sq + pull * dt * 0.9;
          var x = x0 + (x1 - x0) * (k + 1) / steps;
          ctx.lineTo(x, y0 - w * scale);
        }
        ctx.stroke();
        if (hl && local < 1) { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * upto / steps, y0 - w * scale, 2.4, 0, 7); ctx.fill(); }
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
    var last = 0, hold = 0;
    function tick(ts) {
      raf = 0;
      if (!visible) return;
      var d = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      pull += (pullTarget - pull) * Math.min(1, d * 1.5);
      if (progress < 1.5) progress += d / 7; // about 7 s to draw
      else if ((hold += d) > 9) { hold = 0; progress = 0; seed++; build(); }
      draw();
      raf = requestAnimationFrame(tick);
    }
    function start() { if (!raf && !still) { last = 0; raf = requestAnimationFrame(tick); } }

    build();
    if (still) progress = 2;
    resize();
    new ResizeObserver(resize).observe(cv);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }).observe(cv);
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) start(); });
    document.addEventListener('themechange', draw);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
    if (!still) {
      window.addEventListener('pointermove', function (e) {
        var b = cv.getBoundingClientRect();
        var rel = (b.top + b.height / 2 - e.clientY) / (b.height / 2); // +1 above, -1 below
        pullTarget = Math.max(-1, Math.min(1, rel)) * 1.4;
      }, { passive: true });
    }
    start();
  });
})();
