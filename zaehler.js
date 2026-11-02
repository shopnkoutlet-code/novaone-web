/* NOVA ONE Besucherzaehler: anonym, ohne Cookies */
(function(){try{
var u="https://macbook-air-von-niklas.tailcd6010.ts.net/api/zaehl",id;
try{id=sessionStorage.nz||(sessionStorage.nz=Math.random().toString(36).slice(2,14))}catch(e){id=""}
function s(o){o.v=id;o.s=location.pathname;o.m=/Mobi|Android|iPhone/i.test(navigator.userAgent)?1:0;
try{fetch(u,{method:"POST",body:JSON.stringify(o),keepalive:true,mode:"cors",headers:{"Content-Type":"text/plain"}})}catch(e){}}
s({r:document.referrer?new URL(document.referrer).hostname:""});
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(!a)return;var h=a.href||"";
if(/digistore|checkout|buy\.stripe\.com/i.test(h))s({e:"bestellen"});else if(/downloads\//i.test(h))s({e:"gratis"});else if(/anfrage|termin|kontakt/i.test(h))s({e:"anfrage"})});
document.addEventListener("submit",function(e){if(e.target&&e.target.classList&&e.target.classList.contains("kauf"))s({e:"bestellen"})});
}catch(e){}})();
