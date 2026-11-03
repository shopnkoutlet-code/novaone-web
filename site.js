// Gemeinsam: Menü und Kauf. Keine Cookies, keine Server-Schnittstelle.
(function () {
  var m = document.querySelector('.menue'), n = document.querySelector('.nav');
  if (m) m.addEventListener('click', function () { var o = n.classList.toggle('offen'); m.setAttribute('aria-expanded', o); });
  function melden(el, text, art) { if (el) { el.textContent = text; el.className = 'meldung ' + (art || ''); } }

  document.querySelectorAll('form.kauf').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var b = f.querySelector('button'), msg = f.querySelector('.meldung'), box = f.querySelector('input[type=checkbox]');
      if (!box.checked) return melden(msg, 'Bitte bestätige zuerst den Hinweis zum Widerrufsrecht.', 'fehler');
      var z = f.getAttribute('data-stripe'); if (!z) return melden(msg, 'Der Kauf startet in Kürze. Schreib uns gern an kontakt@novaone-group.de, wir melden uns, sobald es losgeht.', 'fehler');
      melden(msg, 'Einen Moment, ich leite dich zur sicheren Zahlung weiter …'); location.href = z;
    });
  });

  var af = document.getElementById('anfrage');
  if (af) af.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = af.querySelector('.meldung'), b = af.querySelector('button'), v = function (n) { return (af.elements[n].value || '').trim(); };
    if (!v('name') || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v('email')) || v('nachricht').length < 5) return melden(m, 'Bitte Name, gültige E-Mail und eine kurze Nachricht angeben.', 'fehler');
    if (!af.elements.datenschutz.checked) return melden(m, 'Bitte stimme der Datenschutzerklärung zu.', 'fehler');
    b.disabled = true; melden(m, 'Wird gesendet …');
    fetch('https://macbook-air-von-niklas.tailcd6010.ts.net/api/anfrage', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, mode: 'cors',
      body: JSON.stringify({ name: v('name'), firma: v('firma'), email: v('email'), telefon: v('telefon'), nachricht: v('nachricht'), website: v('website'), datenschutz: true, thema: af.getAttribute('data-thema') || 'NovaOS Erstgespräch' }) })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (d) { if (d && d.ok) { af.reset(); melden(m, 'Danke! Ihre Anfrage ist angekommen, wir melden uns bald.', 'ok'); } else { b.disabled = false; melden(m, (d && d.text) || 'Das hat leider nicht geklappt.', 'fehler'); } })
      .catch(function () { b.disabled = false; m.className = 'meldung fehler'; m.innerHTML = 'Das hat leider nicht geklappt. Bitte schreiben Sie uns direkt: <a href="mailto:kontakt@novaone-group.de?subject=NovaOS%20Erstgespr%C3%A4ch">kontakt@novaone-group.de</a>'; });
  });

  var mk = document.querySelector('.mobilknopf'), kz = document.getElementById('kaufen');
  if (mk && kz && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { mk.style.display = e[0].isIntersecting ? 'none' : ''; }).observe(kz);
})();
