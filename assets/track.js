(function(){
var GA='G-V9G9GSMPRZ', PIXEL='1065503276447580';
var KEY='bmg_consent';
function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
window.dataLayer=window.dataLayer||[];
window.gtag=function(){dataLayer.push(arguments)};
function load(){
  if(window.__bmgTrk)return;window.__bmgTrk=1;
  var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
  gtag('js',new Date());gtag('config',GA);
  if(PIXEL){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',PIXEL);fbq('track','PageView');}
}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href*="wa.me"],a[href*="whatsapp.com"]');
  if(!a||!window.__bmgTrk)return;
  var sim=location.pathname.indexOf('/simulador')===0;
  gtag('event',sim?'generate_lead':'whatsapp_click',{link_url:a.href,page_path:location.pathname});
  if(window.fbq)fbq('track',sim?'Lead':'Contact');
},true);
function banner(){
  var d=document.createElement('div');d.setAttribute('role','dialog');d.setAttribute('aria-label','Cookies');
  d.style.cssText='position:fixed;left:16px;bottom:16px;max-width:380px;z-index:9999;background:#130119;color:#fff;padding:16px 18px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);font:14px/1.45 system-ui,sans-serif';
  d.innerHTML='<p style="margin:0 0 12px">Usamos cookies de análise e marketing para entender como o site é usado e melhorar nosso atendimento. Você pode aceitar ou recusar. <a href="#" data-pv style="color:#ffe400">Política de Privacidade</a></p><div style="display:flex;gap:8px"><button data-a="1" style="flex:1;padding:9px 12px;border:0;border-radius:999px;background:#fff;color:#130119;font-weight:700;cursor:pointer">Aceitar</button><button data-a="0" style="flex:1;padding:9px 12px;border:1px solid rgba(255,255,255,.5);border-radius:999px;background:transparent;color:#fff;cursor:pointer">Recusar</button></div>';
  d.addEventListener('click',function(e){var l=e.target.closest('[data-pv]');if(l){e.preventDefault();var m=document.getElementById('privacyModal');if(m){m.classList.add('open');m.setAttribute('aria-hidden','false')}return}var b=e.target.closest('button');if(!b)return;var ok=b.getAttribute('data-a')==='1';set(ok?'granted':'denied');d.remove();if(ok)load()});
  document.body.appendChild(d);
}
var c=get();
if(c==='granted')load();
else if(c!=='denied'){if(document.body)banner();else document.addEventListener('DOMContentLoaded',banner)}
})();
