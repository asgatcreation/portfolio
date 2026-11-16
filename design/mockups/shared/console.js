// A small working console for the hero. Every answer is a fact from the repos.
// User input is only ever written with textContent, never as HTML.
(function () {
  var form = document.querySelector('[data-console]');
  if (!form) return;
  var input = form.querySelector('input');
  var out = document.querySelector('[data-console-out]');
  var box = out.parentElement;

  var projects = [
    ['carhub', 'live', 'Verified car marketplace, parts store, live rides', 'case.html'],
    ['floatbook', 'live', 'Back office for POS and agent-banking businesses', 'https://floatbook.onrender.com'],
    ['naija-data', 'v1.0.0', 'Sourced Nigerian reference data: Python, JS, Go, REST', 'https://naija-data.asgatcreation.workers.dev'],
    ['curavia', 'm6/15', 'Multi-tenant hospital operating system', 'https://github.com/asgatcreation/curavia'],
    ['naija-pay', 'm5/11', 'One typed interface to Nigerian payment providers', 'https://github.com/asgatcreation/naija-pay'],
    ['ojalive', 'm2/11', 'Live auction house with a race-proof bid engine', 'https://github.com/asgatcreation/ojalive'],
    ['scoreline', 'dev', 'Real-time football live scores', 'https://github.com/asgatcreation/scoreline'],
    ['nigeria-econ', 'report', 'Growth, prices, work and population, 1991–2025', 'https://github.com/asgatcreation/nigeria-economic-intelligence']
  ];
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

  // Each line is a list of [className, text] parts.
  var cmds = {
    help: function () { return [[['g', 'commands  '], ['', 'ls · open <project> · whoami · stack · status · contact · clear']]]; },
    ls: function () { return projects.map(function (p) { return [['g', pad(p[0], 14)], [p[1] === 'live' || p[1].indexOf('v') === 0 ? 'k' : 'm', pad(p[1], 8)], ['', p[2]]]; }); },
    whoami: function () { return [[['', 'Akanji Oluwaseun Gabriel · software engineer, data scientist, mathematician · Nigeria']], [['m', 'brand: asgatcreation · code / build / impact']]]; },
    stack: function () { return [
      [['g', 'backend   '], ['', 'Python, Django, DRF, Channels, Laravel, NestJS, Fastify']],
      [['g', 'frontend  '], ['', 'TypeScript, React, Next.js, Vue, Tailwind']],
      [['g', 'data      '], ['', 'PostgreSQL, Redis, pandas, R, SQL']],
      [['g', 'payments  '], ['', 'Paystack, Flutterwave']]]; },
    status: function () { return projects.filter(function (p) { return /^m\d/.test(p[1]); }).map(function (p) {
      var m = p[1].slice(1).split('/'), done = Math.round(10 * m[0] / m[1]);
      return [['g', pad(p[0], 12)], ['k', '█'.repeat(done)], ['m', '░'.repeat(10 - done)], ['', '  milestone ' + m[0] + ' of ' + m[1]]];
    }); },
    contact: function () { return [[['g', 'email     '], ['', 'asgatcreation@gmail.com']], [['g', 'github    '], ['', 'github.com/asgatcreation']], [['g', 'x         '], ['', '@Iam_Asgat']]]; }
  };

  function line(parts) {
    var row = document.createElement('div');
    parts.forEach(function (p) { var s = document.createElement('span'); if (p[0]) s.className = p[0]; s.textContent = p[1]; row.appendChild(s); });
    out.appendChild(row);
  }
  function run(raw) {
    var cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    line([['g', '› '], ['', raw.trim()]]);
    if (cmd === 'clear') { out.textContent = ''; return; }
    var parts = cmd.split(/\s+/);
    if (parts[0] === 'open' || parts[0] === 'cat') {
      var p = projects.filter(function (x) { return x[0] === parts[1]; })[0];
      if (!p) { line([['m', 'usage: open <project>. Try "ls" to see names.']]); return; }
      line([['k', 'opening '], ['', p[0] + ' → ' + p[3]]]);
      setTimeout(function () { location.href = p[3]; }, 450);
      return;
    }
    var fn = cmds[parts[0]];
    (fn ? fn() : [[['m', 'command not found: ' + parts[0] + '. Type "help".']]]).forEach(line);
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.value = ''; box.scrollTop = box.scrollHeight; });
  document.querySelectorAll('[data-run]').forEach(function (b) {
    b.addEventListener('click', function () { run(b.dataset.run); box.scrollTop = box.scrollHeight; input.focus({ preventScroll: true }); });
  });
  // Copy buttons for install commands
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = 'copied'; }, function () { b.textContent = 'select'; });
      setTimeout(function () { b.textContent = 'copy'; }, 1500);
    });
  });
})();
