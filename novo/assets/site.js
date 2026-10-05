/* BrMoveToGo — comportamento do site (JavaScript puro, sem dependências) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cfg = window.BMG || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho e menu ---------- */
  var header = $('.site-header');
  var menuBtn = $('.menu-btn');
  var nav = $('#menu');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setMenu(false); });
  }

  /* ---------- Rodapé ---------- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Animação de entrada ---------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---------- Modais legais ---------- */
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    var c = $('.legal-close', m);
    if (c) c.focus();
  }
  function closeModals() {
    $$('.legal-modal.open').forEach(function (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-legal]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(b.getAttribute('data-legal') === 'privacy' ? 'privacyModal' : 'termsModal');
    });
  });
  $$('.legal-modal').forEach(function (m) {
    var c = $('.legal-close', m);
    if (c) c.addEventListener('click', closeModals);
    m.addEventListener('click', function (e) { if (e.target === m) closeModals(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModals(); setMenu(false); }
  });

  /* ---------- Sub-navegação com destaque da seção ---------- */
  var subLinks = $$('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          subLinks.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
          var a = map[en.target.id], box = a.parentNode;
          if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Checklist de documentos (guarda no navegador) ---------- */
  var checks = $$('.checklist input[type="checkbox"]');
  if (checks.length) {
    var KEY = 'bmg-checklist-v1';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
    var bar = $('#checkBar'), txt = $('#checkTxt');
    var upd = function () {
      var n = checks.filter(function (c) { return c.checked; }).length;
      if (bar) bar.style.width = Math.round(n / checks.length * 100) + '%';
      if (txt) txt.textContent = n + ' de ' + checks.length + ' reunidos';
    };
    checks.forEach(function (c) {
      if (saved[c.id]) c.checked = true;
      c.addEventListener('change', function () {
        saved[c.id] = c.checked;
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* navegador sem armazenamento */ }
        upd();
      });
    });
    upd();
  }

  /* ---------- Central de documentos (iframe com altura automática) ---------- */
  var ws = $('#workspace');
  if (ws) {
    var frame = $('iframe', ws);
    var openWs = function () {
      ws.classList.add('open');
      if (!frame.getAttribute('src')) frame.setAttribute('src', frame.getAttribute('data-src'));
      setTimeout(function () { ws.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }, 60);
    };
    $$('[data-open-docs]').forEach(function (b) { b.addEventListener('click', openWs); });
    var close = $('#closeWorkspace');
    if (close) close.addEventListener('click', function () { ws.classList.remove('open'); });
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || typeof e.data.bmgH !== 'number') return;
      frame.style.height = Math.max(640, Math.ceil(e.data.bmgH) + 8) + 'px';
    });
    if (location.hash === '#gerar-aberto') openWs();
  }

  /* ---------- Simulador ---------- */
  var form = $('#simForm');
  if (!form || !cfg.products) return;

  var P = cfg.products, qty = {};
  P.forEach(function (p) { qty[p.id] = 0; });
  var nfBRL = function (n) { return 'US$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var nf3 = function (n) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }); };
  var el = function (id) { return document.getElementById(id); };

  function totals() {
    var t = { items: 0, total: 0, vol: 0, kg: 0, noDims: 0 };
    P.forEach(function (p) {
      var q = qty[p.id];
      t.items += q; t.total += q * p.price;
      if (p.m3) { t.vol += q * p.m3; t.kg += q * p.kg; } else { t.noDims += q; }
    });
    t.vol = Math.round(t.vol * 1000) / 1000;
    return t;
  }

  var summaryBox = $('.sim-summary');
  var simBar = $('#simBar');
  var summaryVisible = false;

  function render() {
    var t = totals();
    P.forEach(function (p) {
      var input = el('q-' + p.id), sub = el('s-' + p.id), q = qty[p.id];
      if (input && String(input.value) !== String(q)) input.value = q;
      if (sub) { sub.textContent = q ? nfBRL(q * p.price) : ''; sub.classList.toggle('on', q > 0); }
    });
    var lines = el('sumLines');
    lines.textContent = '';
    if (!t.items) {
      var em = document.createElement('div');
      em.className = 'empty';
      em.textContent = 'Escolha as caixas para ver o resumo.';
      lines.appendChild(em);
    } else {
      P.forEach(function (p) {
        if (!qty[p.id]) return;
        var d = document.createElement('div');
        var a = document.createElement('span'); a.textContent = qty[p.id] + '× ' + p.name;
        var b = document.createElement('span'); b.textContent = nfBRL(qty[p.id] * p.price);
        d.appendChild(a); d.appendChild(b); lines.appendChild(d);
      });
    }
    el('sumTotal').textContent = nfBRL(t.total);
    el('sumVol').textContent = t.items ? nf3(t.vol) + ' m³' : '0 m³';
    el('sumKg').textContent = t.items ? t.kg + ' kg' : '0 kg';
    el('sumNoDims').style.display = t.noDims ? 'block' : 'none';
    el('barTotal').textContent = nfBRL(t.total);
    el('barCount').textContent = t.items + (t.items === 1 ? ' volume' : ' volumes');
    var showBar = t.items > 0 && !summaryVisible;
    simBar.classList.toggle('on', showBar);
    document.body.classList.toggle('has-simbar', showBar);
  }

  function setQty(id, v) {
    v = parseInt(v, 10);
    qty[id] = isFinite(v) && v > 0 ? Math.min(v, 99) : 0;
    render();
  }
  $$('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-id');
      setQty(id, qty[id] + (b.getAttribute('data-step') === 'plus' ? 1 : -1));
    });
  });
  P.forEach(function (p) {
    var input = el('q-' + p.id);
    if (input) {
      input.addEventListener('input', function () { setQty(p.id, input.value); });
      input.addEventListener('blur', function () { input.value = qty[p.id]; });
    }
  });

  if ('IntersectionObserver' in window && summaryBox) {
    new IntersectionObserver(function (en) {
      summaryVisible = en[0].isIntersecting;
      render();
    }, { threshold: 0.15 }).observe(summaryBox);
  }
  if (simBar) simBar.addEventListener('click', function () {
    summaryBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  /* Pré-preenchimento pela URL: ?add=grand,tv  &tipo=mini|completa|especial|ajuda */
  try {
    var qs = new URLSearchParams(location.search);
    (qs.get('add') || '').split(',').forEach(function (id) { if (id in qty) qty[id] = Math.max(qty[id], 1); });
    var tipoMap = { mini: 'Mini Mudança', completa: 'Mudança Completa', especial: 'Envio Especial', ajuda: 'Quero ajuda para definir' };
    if (tipoMap[qs.get('tipo')]) el('type').value = tipoMap[qs.get('tipo')];
  } catch (e) { /* URL sem parâmetros */ }

  /* --- Consulta de endereço (ZIP dos EUA e CEP do Brasil) --- */
  function getJSON(url, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 6500);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) { var e = new Error('http'); e.notFound = (r.status === 404 || r.status === 400); throw e; }
      return r.json();
    }, function (err) { clearTimeout(timer); throw err; });
  }
  function lookupZip(zip) {
    return getJSON('https://api.zippopotam.us/us/' + zip).then(function (j) {
      var p = j && j.places && j.places[0];
      if (!p) { var e = new Error('nf'); e.notFound = true; throw e; }
      return { city: p['place name'], uf: p['state abbreviation'] };
    });
  }
  function lookupCep(cep) {
    return getJSON('https://viacep.com.br/ws/' + cep + '/json/').then(function (j) {
      if (j.erro) { var e = new Error('nf'); e.notFound = true; throw e; }
      return { street: j.logradouro || '', district: j.bairro || '', city: j.localidade || '', uf: j.uf || '' };
    }).catch(function (err) {
      if (err && err.notFound) throw err;
      return getJSON('https://brasilapi.com.br/api/cep/v1/' + cep).then(function (j) {
        return { street: j.street || '', district: j.neighborhood || '', city: j.city || '', uf: j.state || '' };
      });
    });
  }
  function setHint(id, cls, msg) {
    var h = el(id);
    if (!h) return;
    h.className = 'hint' + (cls ? ' ' + cls : '');
    h.textContent = msg || '';
  }
  function fill(id, value) {
    var f = el(id);
    if (!f) return;
    f.value = value || '';
    f.classList.toggle('auto', !!value);
  }
  ['o_city', 'o_uf', 'd_street', 'd_district', 'd_city', 'd_uf'].forEach(function (id) {
    var f = el(id);
    if (f) { f.addEventListener('input', function () { f.classList.remove('auto'); }); f.addEventListener('change', function () { f.classList.remove('auto'); }); }
  });

  var zipSeq = 0;
  var zipEl = el('o_zip');
  zipEl.addEventListener('input', function () {
    var z = zipEl.value.replace(/\D/g, '').slice(0, 5);
    zipEl.value = z;
    var seq = ++zipSeq;
    if (z.length < 5) { setHint('o_zip_hint', '', ''); return; }
    setHint('o_zip_hint', 'loading', 'Buscando cidade e estado…');
    lookupZip(z).then(function (r) {
      if (seq !== zipSeq) return;
      fill('o_city', r.city); fill('o_uf', r.uf);
      setHint('o_zip_hint', 'ok', '✓ ' + r.city + ', ' + r.uf);
      var s = el('o_street'); if (s && !s.value) s.focus({ preventScroll: true });
    }).catch(function (e) {
      if (seq !== zipSeq) return;
      setHint('o_zip_hint', 'err', e && e.notFound ? 'ZIP não encontrado. Confira o número ou preencha cidade e estado.' : 'Não consegui buscar agora. Preencha cidade e estado manualmente.');
    });
  });

  var cepSeq = 0;
  var cepEl = el('d_cep');
  cepEl.addEventListener('input', function () {
    var c = cepEl.value.replace(/\D/g, '').slice(0, 8);
    cepEl.value = c.length > 5 ? c.slice(0, 5) + '-' + c.slice(5) : c;
    var seq = ++cepSeq;
    if (c.length < 8) { setHint('d_cep_hint', '', ''); return; }
    setHint('d_cep_hint', 'loading', 'Buscando endereço…');
    lookupCep(c).then(function (r) {
      if (seq !== cepSeq) return;
      fill('d_street', r.street); fill('d_district', r.district); fill('d_city', r.city); fill('d_uf', r.uf);
      setHint('d_cep_hint', 'ok', '✓ ' + (r.street ? r.street + ' · ' : '') + r.city + '/' + r.uf);
      var n = el('d_number'); if (n) n.focus({ preventScroll: true });
    }).catch(function (e) {
      if (seq !== cepSeq) return;
      setHint('d_cep_hint', 'err', e && e.notFound ? 'CEP não encontrado. Confira o número ou preencha o endereço.' : 'Não consegui buscar agora. Preencha o endereço manualmente.');
    });
  });

  /* --- Mensagem do WhatsApp --- */
  var v = function (id) { var f = el(id); return f ? f.value.trim() : ''; };
  function buildMessage() {
    var t = totals(), L = [];
    L.push('Olá! Fiz uma simulação no site da BrMoveToGo e gostaria de uma cotação.', '');
    L.push('*Itens*');
    P.forEach(function (p) { if (qty[p.id]) L.push('• ' + qty[p.id] + '× ' + p.name + ' — ' + nfBRL(qty[p.id] * p.price)); });
    if (!t.items) L.push('• (itens descritos nas observações)');
    if (t.items) {
      L.push('*Total estimado: ' + nfBRL(t.total) + '*');
      L.push('Volume: ' + nf3(t.vol) + ' m³ · Peso: ' + t.kg + ' kg' + (t.noDims ? ' (TV não incluída no volume/peso)' : ''));
    }
    if (v('notes')) L.push('Outros itens/observações: ' + v('notes'));
    L.push('', '*Origem (EUA)*');
    L.push(v('o_street') + (v('o_unit') ? ', ' + v('o_unit') : ''));
    L.push(v('o_city') + ', ' + v('o_uf') + ' ' + v('o_zip'));
    L.push('', '*Destino (Brasil)*');
    L.push(v('d_street') + ', ' + v('d_number') + (v('d_comp') ? ' — ' + v('d_comp') : ''));
    L.push((v('d_district') ? v('d_district') + ' · ' : '') + v('d_city') + '/' + v('d_uf') + ' · CEP ' + v('d_cep'));
    L.push('', '*Contato*');
    L.push('Nome: ' + v('name'));
    L.push('WhatsApp: ' + v('phone'));
    if (v('email')) L.push('E-mail: ' + v('email'));
    L.push('Tipo: ' + (v('type') || 'Quero ajuda para definir'));
    L.push('Data prevista: ' + (v('date') || 'A definir'));
    return L.join('\n');
  }

  var errBox = el('formError');
  function showError(msg) { errBox.textContent = msg; errBox.classList.add('on'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.classList.remove('on');
    var t = totals();
    if (!t.items && !v('notes')) {
      showError('Escolha pelo menos uma caixa ou descreva o que pretende enviar em "Outros itens".');
      el('step-itens').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!form.checkValidity()) {
      showError('Confira os campos destacados antes de enviar.');
      form.reportValidity();
      return;
    }
    if (v('phone').replace(/\D/g, '').length < 8) {
      showError('Informe um WhatsApp válido, com DDI (ex.: +1 ou +55).');
      el('phone').focus();
      return;
    }
    var msg = buildMessage();
    var url = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(msg);
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    var sent = el('sent');
    sent.classList.add('on');
    el('sentLink').href = url;
    el('copyMsg').onclick = function () {
      var done = function () { el('copyMsg').textContent = 'Resumo copiado ✓'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(done, function () {});
    };
    sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  render();
})();
