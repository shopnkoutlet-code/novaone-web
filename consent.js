/* NOVA ONE – Einwilligung (Cookie-Fenster) und Google Ads Conversion-Messung.
   Ohne Einwilligung wird keine Anfrage an Google gesendet. */
(function () {
  var AW_ID = 'AW-18540673526';
  var KAUF_LABEL = 'D-3wCKPNs64dEPbz8IhF';
  var KEY = 'novaone_einwilligung';
  var SPERRE = 'novaone_kauf_gezaehlt';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Consent Mode v2: Standard alles verweigert
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  function lesen() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function speichern(wert) {
    try { localStorage.setItem(KEY, wert); } catch (e) {}
  }

  var geladen = false;
  function gtagLaden() {
    if (geladen) return;
    geladen = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', AW_ID);
  }

  function kaufMelden() {
    if (!window.novaKauf) return;
    try { if (sessionStorage.getItem(SPERRE)) return; sessionStorage.setItem(SPERRE, '1'); } catch (e) {}
    gtag('event', 'conversion', {
      send_to: AW_ID + '/' + KAUF_LABEL,
      value: 27.0,
      currency: 'EUR'
    });
  }

  function anwenden(wert) {
    if (wert === 'alle') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'denied'
      });
      gtagLaden();
      kaufMelden();
    } else {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      });
    }
  }

  function css() {
    var st = document.createElement('style');
    st.textContent =
      '#nova-cb{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;z-index:99999;' +
      'background:#FBF8F2;color:#1C2A23;border:1px solid #D9CFB8;border-top:3px solid #B0864F;border-radius:12px;' +
      'box-shadow:0 10px 40px rgba(23,61,46,.22);padding:20px 22px;font:15px/1.55 -apple-system,"Inter",Helvetica,Arial,sans-serif}' +
      '#nova-cb h2{font:700 1.1rem Georgia,"Fraunces",serif;color:#1F4D3A;margin:0 0 6px}' +
      '#nova-cb p{margin:0 0 14px}' +
      '#nova-cb a{color:#1F4D3A}' +
      '#nova-cb .nova-cb-knoepfe{display:flex;gap:10px;flex-wrap:wrap}' +
      '#nova-cb button{flex:1 1 180px;cursor:pointer;background:#1F4D3A;color:#F5F1E8;border:2px solid #1F4D3A;' +
      'border-radius:10px;padding:12px 18px;font:600 15px -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.02em}' +
      '#nova-cb button:hover{background:#173D2E;border-color:#173D2E}' +
      '#nova-cb button:focus-visible{outline:3px solid #B0864F;outline-offset:2px}';
    document.head.appendChild(st);
  }

  function fensterZeigen() {
    if (document.getElementById('nova-cb')) return;
    var d = document.createElement('div');
    d.id = 'nova-cb';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-labelledby', 'nova-cb-titel');
    d.setAttribute('aria-describedby', 'nova-cb-text');
    d.innerHTML =
      '<h2 id="nova-cb-titel">Ihre Privatsphäre</h2>' +
      '<p id="nova-cb-text">Wir würden gerne messen, ob ein Kauf auf eine unserer Google-Anzeigen zurückgeht. ' +
      'Dafür setzt Google Ads mit Ihrer Einwilligung Cookies und erhält Daten wie Ihre IP-Adresse. ' +
      'Ohne Einwilligung findet keine Verbindung zu Google statt. Sie können Ihre Wahl jederzeit unten im Footer ändern. ' +
      '<a href="datenschutz.html#google-ads">Mehr in der Datenschutzerklärung</a></p>' +
      '<div class="nova-cb-knoepfe">' +
      '<button type="button" data-wahl="alle">Alle akzeptieren</button>' +
      '<button type="button" data-wahl="notwendig">Nur notwendige</button></div>';
    d.addEventListener('click', function (e) {
      var w = e.target && e.target.getAttribute && e.target.getAttribute('data-wahl');
      if (!w) return;
      speichern(w);
      anwenden(w);
      d.parentNode.removeChild(d);
    });
    document.body.appendChild(d);
    var erster = d.querySelector('button');
    if (erster) erster.focus();
  }

  function start() {
    css();
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) { e.preventDefault(); fensterZeigen(); });
    }
    var gespeichert = lesen();
    if (gespeichert === 'alle' || gespeichert === 'notwendig') anwenden(gespeichert);
    else fensterZeigen();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
