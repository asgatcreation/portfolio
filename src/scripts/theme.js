// Theme: follows the system until the visitor picks one, then remembers it.
// The <head> sets data-theme before paint (see each page); this file wires the toggle.
(function () {
  var root = document.documentElement;
  function current() {
    return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function label(btn) {
    var dark = current() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    var t = btn.querySelector('[data-theme-label]');
    if (t) t.textContent = dark ? 'Light' : 'Dark';
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    label(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage blocked: the choice lasts for this page only */
      }
      document.querySelectorAll('[data-theme-toggle]').forEach(label);
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  });
})();
