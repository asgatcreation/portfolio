// Lab page: NUBAN check digit, float-versus-kobo demonstration, Brownian motion canvas.
// Everything runs in the browser; nothing is sent anywhere.
(function () {
  'use strict';
  var $ = function (s, c) {
    return (c || document).querySelector(s);
  };
  var fmt = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });
  var num = new Intl.NumberFormat('en-GB');

  function setOut(el, kind, lines) {
    if (!el) return;
    el.textContent = '';
    el.className = 'tool-out show ' + kind;
    lines.forEach(function (line, i) {
      var p = document.createElement(i === 0 ? 'b' : 'span');
      p.textContent = line;
      el.appendChild(p);
    });
  }

  /* ---------- 01 NUBAN check digit (CBN rule: weights 3,7,3 repeated) ---------- */
  var WEIGHTS = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3];
  function checkDigit(bank, first9) {
    var seed = bank + first9,
      sum = 0;
    for (var i = 0; i < 12; i++) sum += Number(seed.charAt(i)) * WEIGHTS[i];
    var d = 10 - (sum % 10);
    return d === 10 ? 0 : d;
  }

  var nuban = $('[data-nuban]');
  if (nuban) {
    var bankF = $('#nb-bank'),
      acctF = $('#nb-acct'),
      nOut = $('[data-out]', nuban);
    var digits = function (el) {
      el.addEventListener('input', function () {
        var clean = el.value.replace(/\D/g, '');
        if (clean !== el.value) el.value = clean;
        el.closest('.fld').classList.remove('bad');
      });
    };
    digits(bankF);
    digits(acctF);

    nuban.addEventListener('submit', function (e) {
      e.preventDefault();
      var bank = bankF.value.trim(),
        acct = acctF.value.trim(),
        bad = false;
      if (bank.length !== 3) {
        bankF.closest('.fld').classList.add('bad');
        bad = true;
      }
      if (acct.length !== 10) {
        acctF.closest('.fld').classList.add('bad');
        bad = true;
      }
      if (bad) {
        setOut(nOut, 'warn', ['Fill both fields', 'A bank code is three digits and an account number is ten.']);
        return;
      }
      var want = checkDigit(bank, acct.slice(0, 9)),
        got = Number(acct.charAt(9));
      if (want === got) {
        setOut(nOut, 'ok', [
          'Well formed ✓',
          'The check digit ' + got + ' is what the NUBAN rule gives for bank ' + bank + '.',
          'Whether the account exists is still a question for the bank.',
        ]);
      } else {
        setOut(nOut, 'bad', [
          'That is not a valid NUBAN',
          'The last digit is ' + got + ', but the rule gives ' + want + ' for these digits.',
          'Likely a typo: ' + acct.slice(0, 9) + want + ' would be valid for bank ' + bank + '.',
        ]);
      }
    });

    var demo = $('[data-nuban-demo]', nuban);
    if (demo)
      demo.addEventListener('click', function () {
        var bank = '058',
          body = '';
        for (var i = 0; i < 9; i++) body += String(Math.floor(Math.random() * 10));
        bankF.value = bank;
        acctF.value = body + checkDigit(bank, body);
        bankF.closest('.fld').classList.remove('bad');
        acctF.closest('.fld').classList.remove('bad');
        setOut(nOut, 'warn', [
          'Example filled in',
          'A random account body with the correct check digit added. Press Check.',
        ]);
      });
  }

  /* ---------- 02 Floating point versus whole kobo ---------- */
  var kobo = $('[data-kobo]');
  if (kobo) {
    var amtF = $('#kb-amt'),
      nF = $('#kb-n'),
      kOut = $('[data-out]', kobo);
    kobo.addEventListener('submit', function (e) {
      e.preventDefault();
      var amt = parseFloat(amtF.value),
        times = Math.floor(Number(nF.value));
      if (!isFinite(amt) || amt <= 0 || !isFinite(times) || times < 1) {
        setOut(kOut, 'warn', ['Check the numbers', 'An amount above zero, and at least one repetition.']);
        return;
      }
      if (times > 1000000) times = 1000000;
      var asFloat = 0;
      for (var i = 0; i < times; i++) asFloat += amt;
      var perKobo = Math.round(amt * 100),
        asKobo = perKobo * times,
        exact = asKobo / 100,
        drift = asFloat - exact;
      var lines = [
        drift === 0 ? 'No drift this time' : 'The float is out by ' + drift.toFixed(10).replace(/0+$/, '') + ' naira',
        'Adding ' + fmt.format(amt) + ' ' + num.format(times) + ' times.',
        'Floating point: ' + asFloat.toFixed(10),
        'Whole kobo: ' + num.format(asKobo) + ' kobo = ' + fmt.format(exact) + ' exactly.',
      ];
      if (drift !== 0) lines.push('Nothing in the loop was wrong. The decimal simply cannot be held in binary.');
      else lines.push('Try ₦0.10 ten thousand times: some amounts drift and some do not, which is the real danger.');
      setOut(kOut, drift === 0 ? 'ok' : 'bad', lines);
    });
  }

  /* ---------- 03 Brownian motion ---------- */
  var canvas = $('[data-bm-canvas]');
  if (canvas) {
    var ctx = canvas.getContext('2d'),
      pathsIn = $('[data-bm-paths]'),
      volIn = $('[data-bm-vol]'),
      stepsIn = $('[data-bm-steps]'),
      bmOut = $('[data-bm-out]'),
      seed = 12345;

    function rng(s) {
      var t = s;
      return function () {
        t += 0x6d2b79f5;
        var x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    }
    function normal(rand) {
      var u = 1 - rand(),
        v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    function css(name, fallback) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }

    function draw() {
      var paths = Number(pathsIn.value),
        vol = Number(volIn.value) / 100,
        steps = Number(stepsIn.value);
      $('[data-bm-paths-val]').textContent = String(paths);
      $('[data-bm-vol-val]').textContent = vol * 100 + '%';
      $('[data-bm-steps-val]').textContent = String(steps);

      var dpr = Math.min(2, devicePixelRatio || 1),
        w = canvas.clientWidth || 900,
        h = Math.round(Math.min(420, Math.max(240, w * 0.46)));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      var rand = rng(seed),
        dt = 1 / steps,
        sd = vol * Math.sqrt(dt),
        series = [],
        lo = 100,
        hi = 100,
        p,
        s,
        k;
      for (p = 0; p < paths; p++) {
        s = [100];
        for (k = 1; k <= steps; k++) {
          var next = s[k - 1] * (1 + sd * normal(rand));
          s.push(next);
          if (next < lo) lo = next;
          if (next > hi) hi = next;
        }
        series.push(s);
      }
      var pad = 10,
        span = Math.max(1, hi - lo),
        x = function (i) {
          return pad + (i / steps) * (w - pad * 2);
        },
        y = function (v) {
          return h - pad - ((v - lo) / span) * (h - pad * 2);
        };

      ctx.strokeStyle = css('--line', 'rgba(255,255,255,.12)');
      ctx.lineWidth = 1;
      for (k = 0; k <= 4; k++) {
        var gy = pad + (k / 4) * (h - pad * 2);
        ctx.beginPath();
        ctx.moveTo(pad, gy);
        ctx.lineTo(w - pad, gy);
        ctx.stroke();
      }
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = css('--dim', '#8a8894');
      ctx.beginPath();
      ctx.moveTo(pad, y(100));
      ctx.lineTo(w - pad, y(100));
      ctx.stroke();
      ctx.restore();

      var gold = css('--gold', '#c99a3c');
      ctx.lineWidth = 1.4;
      ctx.lineJoin = 'round';
      for (p = 0; p < series.length; p++) {
        ctx.globalAlpha = 0.35 + 0.55 * (p / Math.max(1, series.length - 1));
        ctx.strokeStyle = gold;
        ctx.beginPath();
        for (k = 0; k < series[p].length; k++) {
          if (k === 0) ctx.moveTo(x(k), y(series[p][k]));
          else ctx.lineTo(x(k), y(series[p][k]));
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      var ends = series.map(function (ser) {
          return ser[ser.length - 1];
        }),
        mean =
          ends.reduce(function (a, b) {
            return a + b;
          }, 0) / ends.length;
      setOut(bmOut, 'ok', [
        'Started at 100, ended between ' +
          Math.min.apply(null, ends).toFixed(1) +
          ' and ' +
          Math.max.apply(null, ends).toFixed(1),
        paths + (paths === 1 ? ' path' : ' paths') + ', ' + steps + ' steps, ' + vol * 100 + '% volatility.',
        'Average finish: ' + mean.toFixed(1) + '. The dashed line is where every path began.',
      ]);
    }

    [pathsIn, volIn, stepsIn].forEach(function (el) {
      el.addEventListener('input', draw);
    });
    var roll = $('[data-bm-roll]');
    if (roll)
      roll.addEventListener('click', function () {
        seed = Math.floor(Math.random() * 1e9);
        draw();
      });
    var rt = 0;
    addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(draw, 160);
    });
    draw();
  }
})();
