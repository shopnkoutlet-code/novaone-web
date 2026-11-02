// Gemeinsam: Menü, Kauf, Gratis, Login. Keine Cookies; Sitzung nur im sessionStorage dieses Tabs.
(function () {
  var API = window.NOVA_API;
  var m = document.querySelector('.menue'), n = document.querySelector('.nav');
  if (m) m.addEventListener('click', function () { var o = n.classList.toggle('offen'); m.setAttribute('aria-expanded', o); });
  function post(p, b, h) { return fetch(API + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: JSON.stringify(b) }).then(function (r) { return r.json().then(function (j) { j._s = r.status; return j; }); }); }
  function melden(el, text, art) { if (el) { el.textContent = text; el.className = 'meldung ' + (art || ''); } }
  window.addEventListener('hashchange', function () { if (/^#[bt]=/.test(location.hash)) location.reload(); });
  window.NOVA = { post: post, melden: melden };

  document.querySelectorAll('form.kauf').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var b = f.querySelector('button'), msg = f.querySelector('.meldung'), box = f.querySelector('input[type=checkbox]');
      if (!box.checked) return melden(msg, 'Bitte bestätige zuerst den Hinweis zum Widerrufsrecht.', 'fehler');
      b.disabled = true; melden(msg, 'Einen Moment, ich leite dich zur sicheren Zahlung weiter …');
      post('/api/checkout', { widerruf: true, email: (f.querySelector('input[type=email]') || {}).value || '' }).then(function (j) {
        if (j.ok && j.url) location.href = j.url; else { b.disabled = false; melden(msg, j.fehler || 'Das hat nicht geklappt. Bitte versuche es gleich noch einmal.', 'fehler'); }
      }).catch(function () { b.disabled = false; melden(msg, 'Keine Verbindung. Bitte versuche es gleich noch einmal.', 'fehler'); });
    });
  });

  var mk = document.querySelector('.mobilknopf'), kz = document.getElementById('kaufen');
  if (mk && kz && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { mk.style.display = e[0].isIntersecting ? 'none' : ''; }).observe(kz);

  var g = document.getElementById('gratis-form');
  if (g) {
    var gm = g.querySelector('.meldung'), hash = location.hash.match(/^#b=([\w-]+)/);
    if (hash) { g.hidden = true; melden(document.getElementById('gratis-status'), 'Ich bestätige deine Adresse …');
      post('/api/gratis/bestaetigen', { token: hash[1] }).then(function (j) {
        var s = document.getElementById('gratis-status');
        if (!j.ok) return melden(s, j.fehler + ' Fordere die Skills bitte unten noch einmal an.', 'fehler') || (g.hidden = false);
        history.replaceState(null, '', location.pathname); s.textContent = 'Bestätigt, danke! Hier sind deine zwei Skills:'; s.className = 'meldung ok';
        var ul = document.getElementById('gratis-downloads'); j.downloads.forEach(function (d) { var a = document.createElement('a'); a.className = 'knopf'; a.href = d.url; a.textContent = d.titel; ul.appendChild(a); });
      }); }
    g.addEventListener('submit', function (e) {
      e.preventDefault(); var b = g.querySelector('button'); b.disabled = true;
      post('/api/gratis', { email: g.querySelector('input[type=email]').value, einwilligung: g.querySelector('input[type=checkbox]').checked }).then(function (j) {
        b.disabled = false; if (j.ok) { g.hidden = true; melden(document.getElementById('gratis-status'), 'Fast geschafft: Ich habe dir eine Mail geschickt. Klick darin auf den Bestätigungs-Link, dann bekommst du die Skills. (Nichts da? Schau im Spam-Ordner.)', 'ok'); } else melden(gm, j.fehler || 'Bitte prüfe deine Eingabe.', 'fehler');
      }).catch(function () { b.disabled = false; melden(gm, 'Keine Verbindung.', 'fehler'); });
    });
  }

  var L = document.getElementById('login');
  if (L) {
    var st = document.getElementById('login-status'), inh = document.getElementById('inhalt'), S = sessionStorage.getItem('nova_sitzung');
    function zeigen() {
      fetch(API + '/api/me', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('nova_sitzung') } }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.ok) { sessionStorage.removeItem('nova_sitzung'); L.hidden = false; inh.hidden = true; return; }
        L.hidden = true; inh.hidden = false; melden(st, ''); document.getElementById('wer').textContent = j.email;
        var box = document.getElementById('liste'); box.innerHTML = '';
        j.inhalt.forEach(function (x) {
          var d = document.createElement('div'); d.className = 'karte eintrag';
          var t = document.createElement('div'); var h = document.createElement('h3'); h.textContent = x.titel; var p = document.createElement('p'); p.textContent = x.beschreibung; t.appendChild(h); t.appendChild(p);
          var k = document.createElement('button'); k.className = 'knopf'; k.textContent = x.typ === 'video' ? 'Ansehen' : 'Herunterladen';
          k.addEventListener('click', function () { k.disabled = true; post('/api/dl', { id: x.id }, { Authorization: 'Bearer ' + sessionStorage.getItem('nova_sitzung') }).then(function (u) { k.disabled = false;
            if (!u.ok) return melden(st, 'Bitte melde dich neu an.', 'fehler');
            if (x.typ === 'video') { var v = document.createElement('video'); v.controls = true; v.autoplay = true; v.playsInline = true; v.src = u.url; t.appendChild(v); k.hidden = true; } else location.href = u.url; }); });
          d.appendChild(t); d.appendChild(k); box.appendChild(d);
        });
      });
    }
    var th = location.hash.match(/^#t=([\w-]+)/);
    if (th) { history.replaceState(null, '', location.pathname); melden(st, 'Ich melde dich an …'); post('/api/session', { token: th[1] }).then(function (j) { if (j.ok) { sessionStorage.setItem('nova_sitzung', j.sitzung); zeigen(); } else melden(st, j.fehler + ' Fordere unten einen neuen Link an.', 'fehler'); }); }
    else if (S) zeigen();
    L.addEventListener('submit', function (e) { e.preventDefault(); var b = L.querySelector('button'); b.disabled = true;
      post('/api/login', { email: L.querySelector('input').value }).then(function (j) { b.disabled = false; melden(st, j.ok ? 'Wenn die Adresse zu einem Kauf gehört, ist jetzt eine Mail mit deinem Anmelde-Link unterwegs (gültig 15 Minuten).' : j.fehler, j.ok ? 'ok' : 'fehler'); }); });
    var ab = document.getElementById('abmelden'); if (ab) ab.addEventListener('click', function () { sessionStorage.removeItem('nova_sitzung'); location.reload(); });
  }
})();
