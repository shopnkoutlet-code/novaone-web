// Gemeinsam: Menü und Kauf. Keine Cookies, keine Server-Schnittstelle.
(function () {
  var m = document.querySelector('.menue'), n = document.querySelector('.nav');
  if (m) m.addEventListener('click', function () { var o = n.classList.toggle('offen'); m.setAttribute('aria-expanded', o); });
  function melden(el, text, art) { if (el) { el.textContent = text; el.className = 'meldung ' + (art || ''); } }

  document.querySelectorAll('form.kauf').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var b = f.querySelector('button'), msg = f.querySelector('.meldung'), box = f.querySelector('input[type=checkbox]');
      if (!box.checked) return melden(msg, 'Bitte bestätige zuerst den Hinweis zum Widerrufsrecht.', 'fehler');
      melden(msg, 'Einen Moment, ich leite dich zur sicheren Zahlung weiter …'); location.href = f.getAttribute('data-stripe');
    });
  });

  var mk = document.querySelector('.mobilknopf'), kz = document.getElementById('kaufen');
  if (mk && kz && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { mk.style.display = e[0].isIntersecting ? 'none' : ''; }).observe(kz);
})();
