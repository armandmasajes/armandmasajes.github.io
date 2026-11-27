/* Capa de magia y Navidad de ARMAND.
   Temporada de Navidad: del 15 de noviembre al 6 de enero (sola). Para probar: ?navidad=1 o ?navidad=0 */
(function () {
  'use strict';
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qs = location.search;
  var hoy = new Date(), mes = hoy.getMonth(), dia = hoy.getDate();
  var temporada = (mes === 10 && dia >= 15) || mes === 11 || (mes === 0 && dia <= 6);
  if (/[?&]navidad=1/.test(qs)) temporada = true;
  if (/[?&]navidad=0/.test(qs)) temporada = false;
  var $ = function (s) { return document.querySelector(s); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  /* ---- Aviso ---- */
  var aviso = document.createElement('div');
  aviso.className = 'aviso-magico';
  aviso.setAttribute('role', 'status');
  document.body.appendChild(aviso);
  var tAviso;
  function decir(txt) {
    aviso.textContent = txt;
    aviso.classList.add('ver');
    clearTimeout(tAviso);
    tAviso = setTimeout(function () { aviso.classList.remove('ver'); }, 3600);
  }

  /* ---- Chispas ---- */
  var chispas = [], cv, cx, raf2 = 0;
  var COL = ['#ffe9a8', '#e2bd78', '#ffffff', '#ffd36a'];
  if (!calmo) {
    cv = document.createElement('canvas');
    cv.className = 'chispas';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    cx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ajusta = function () {
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajusta();
    addEventListener('resize', ajusta);
  }
  function pinta() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = chispas.length - 1; i >= 0; i--) {
      var p = chispas[i];
      p.vida -= 1; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.985;
      if (p.vida <= 0) { chispas.splice(i, 1); continue; }
      var a = Math.min(1, p.vida / 22);
      cx.globalAlpha = a; cx.fillStyle = p.c;
      cx.shadowColor = p.c; cx.shadowBlur = 8;
      cx.beginPath(); cx.arc(p.x, p.y, p.r * (0.5 + a / 2), 0, 6.283); cx.fill();
    }
    cx.globalAlpha = 1; cx.shadowBlur = 0;
    raf2 = chispas.length ? requestAnimationFrame(pinta) : 0;
  }
  function chispa(x, y, n, fuerza) {
    if (calmo || !cx) return;
    for (var i = 0; i < n; i++) {
      var ang = rnd(0, 6.283), v = rnd(0.4, 1) * (fuerza || 2.2);
      chispas.push({ x: x, y: y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 0.4, g: 0.045, r: rnd(1, 2.6), c: COL[(Math.random() * COL.length) | 0], vida: rnd(28, 56) });
    }
    if (chispas.length > 220) chispas.splice(0, chispas.length - 220);
    if (!raf2) raf2 = requestAnimationFrame(pinta);
  }
  window.armandChispa = chispa;
  addEventListener('pointerdown', function (e) { chispa(e.clientX, e.clientY, 9, 2); }, { passive: true });
  var ult = 0;
  addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse' || e.buttons) {
      var t = Date.now();
      if (t - ult > 40) { ult = t; chispa(e.clientX, e.clientY, 1, 0.9); }
    }
  }, { passive: true });

  /* ---- Velas flotantes en el hero ---- */
  var hero = $('.hero');
  var velas;
  if (hero) {
    velas = document.createElement('div');
    velas.className = 'velas';
    velas.setAttribute('aria-hidden', 'true');
    var n = innerWidth < 620 ? 5 : 9;
    for (var i = 0; i < n; i++) {
      var v = document.createElement('span');
      v.className = 'vela';
      v.style.setProperty('--x', ((i + 0.5) / n * 100 + rnd(-3, 3)).toFixed(1) + '%');
      v.style.setProperty('--y', Math.round(rnd(8, 52)) + 'px');
      v.style.setProperty('--h', Math.round(rnd(26, 46)));
      v.style.setProperty('--d', '-' + rnd(0, 5).toFixed(1) + 's');
      velas.appendChild(v);
    }
    hero.insertBefore(velas, hero.firstChild);
  }

  /* ---- Nieve dorada (solo en temporada) ---- */
  if (temporada && hero && !calmo) {
    var c = document.createElement('canvas');
    c.className = 'nieve';
    c.setAttribute('aria-hidden', 'true');
    hero.insertBefore(c, hero.firstChild);
    var g = c.getContext('2d'), w = 0, h = 0, P = [], visible = true, raf = 0;
    var d2 = Math.min(window.devicePixelRatio || 1, 2);
    var medir = function () {
      w = hero.clientWidth; h = hero.clientHeight;
      c.width = w * d2; c.height = h * d2; g.setTransform(d2, 0, 0, d2, 0, 0);
      var cant = w < 620 ? 38 : 72; P = [];
      for (var k = 0; k < cant; k++) P.push({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.8, 2.8), v: rnd(0.25, 0.8), s: rnd(0, 6.28), o: rnd(0.3, 0.8), d: Math.random() < 0.35 });
    };
    var cae = function () {
      g.clearRect(0, 0, w, h);
      for (var k = 0; k < P.length; k++) {
        var p = P[k];
        p.y += p.v; p.s += 0.012; p.x += Math.sin(p.s) * 0.45;
        if (p.y > h + 4) { p.y = -4; p.x = rnd(0, w); }
        g.fillStyle = p.d ? 'rgba(226,189,120,' + p.o + ')' : 'rgba(255,255,255,' + (p.o * 0.8) + ')';
        g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
      }
      raf = visible && !document.hidden ? requestAnimationFrame(cae) : 0;
    };
    medir();
    addEventListener('resize', medir);
    var ob = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(cae);
    });
    ob.observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(cae); });
    raf = requestAnimationFrame(cae);
  }

  /* ---- Cinta con cuenta regresiva ---- */
  if (temporada) {
    var navidad = new Date(hoy.getFullYear(), 11, 25);
    var inicioHoy = new Date(hoy.getFullYear(), mes, dia);
    var faltan = mes === 0 ? -1 : Math.round((navidad - inicioHoy) / 864e5);
    var msg;
    if (faltan > 1) msg = 'Faltan ' + faltan + ' días para Navidad';
    else if (faltan === 1) msg = '¡Mañana es Navidad!';
    else if (faltan === 0) msg = '¡Feliz Navidad!';
    else msg = 'Felices fiestas y próspero año nuevo';
    var cinta = document.createElement('a');
    cinta.className = 'cinta';
    cinta.href = '#regalo';
    var e1 = document.createElement('span'); e1.className = 'est'; e1.textContent = '✦'; e1.setAttribute('aria-hidden', 'true');
    var b = document.createElement('b'); b.textContent = ' ' + msg + ' ';
    var e2 = document.createElement('span'); e2.className = 'est'; e2.textContent = '✦'; e2.setAttribute('aria-hidden', 'true');
    var u = document.createElement('u'); u.textContent = faltan >= 0 ? 'Regala un masaje' : 'Regala bienestar';
    cinta.appendChild(e1); cinta.appendChild(b); cinta.appendChild(e2); cinta.appendChild(document.createTextNode(' · ')); cinta.appendChild(u);
    var skip = $('.skip');
    document.body.insertBefore(cinta, skip ? skip.nextSibling : document.body.firstChild);

    /* Regalo de Navidad */
    var reg = $('#regalo');
    if (reg) {
      reg.classList.add('navidad');
      var ey = reg.querySelector('.eyebrow'), h2 = reg.querySelector('h2'), ld = reg.querySelector('.lead');
      if (ey) ey.textContent = 'Regalo de Navidad';
      if (h2) h2.textContent = 'Regala magia esta Navidad';
      if (ld) ld.textContent = 'El detalle que se abre con una sonrisa: un masaje para alguien especial. Coordinamos la fecha y la hora con quien lo recibe.';
      var colores = ['#e2bd78', '#e0525e', '#5fd49a', '#fbf3dc'];
      var luces = document.createElement('div');
      luces.className = 'luces';
      luces.setAttribute('aria-hidden', 'true');
      var nl = innerWidth < 620 ? 9 : 18;
      for (var j = 0; j < nl; j++) {
        var lz = document.createElement('span'); lz.className = 'luz';
        var bi = document.createElement('i');
        bi.style.setProperty('--c', colores[j % colores.length]);
        bi.style.setProperty('--d', (-rnd(0, 2.2)).toFixed(2) + 's');
        lz.appendChild(bi); luces.appendChild(lz);
      }
      reg.insertBefore(luces, reg.firstChild);
      var br = $('#btnRegalo');
      if (br) {
        try {
          var url = new URL(br.href);
          var tx = url.searchParams.get('text');
          if (tx) { url.searchParams.set('text', tx.replace('regalar un masaje', 'regalar un masaje esta Navidad')); br.href = url.toString(); }
        } catch (err) { /* sin cambios */ }
      }
    }
    var pie = $('footer .script');
    if (pie) pie.textContent = 'Tu salud en buenas manos · Felices fiestas ✦';
  }

  /* ---- Esfera dorada que cruza el hero ---- */
  if (hero && !calmo) {
    var esf = document.createElement('div');
    esf.className = 'esfera';
    esf.setAttribute('aria-hidden', 'true');
    esf.innerHTML = '<b></b><b></b><i></i>';
    hero.appendChild(esf);
    var vuela = function () {
      var W = hero.clientWidth, H = hero.clientHeight;
      var y0 = rnd(H * 0.12, H * 0.6), amp = rnd(18, 42), dur = rnd(6500, 8500), t0 = performance.now(), atrapada = false;
      esf.style.display = 'block';
      esf.onclick = function (ev) {
        ev.stopPropagation();
        if (atrapada) return; atrapada = true;
        var r = esf.getBoundingClientRect();
        chispa(r.left + 23, r.top + 23, 34, 3.4);
        esf.style.display = 'none';
        decir('✦ ¡Atrapaste la esfera dorada! Ya tienes la calma ✦');
      };
      (function paso(t) {
        if (atrapada) return;
        var k = (t - t0) / dur;
        if (k >= 1) { esf.style.display = 'none'; return; }
        var x = W + 30 - k * (W + 110);
        var y = y0 + Math.sin(k * 14) * amp + Math.sin(k * 37) * 6;
        esf.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        requestAnimationFrame(paso);
      })(t0);
    };
    setTimeout(vuela, 7000);
    setInterval(function () { if (!document.hidden) vuela(); }, 45000);
  }

  /* ---- Huevo de pascua: toca 5 veces el ave del logo ---- */
  var logo = $('.marca');
  if (logo) {
    var toques = 0, tToques;
    logo.addEventListener('click', function () {
      toques++; clearTimeout(tToques);
      tToques = setTimeout(function () { toques = 0; }, 3000);
      if (toques >= 5) {
        toques = 0;
        var r = logo.getBoundingClientRect();
        chispa(r.left + 20, r.top + 20, 60, 4.2);
        if (velas) { velas.classList.add('aviva'); setTimeout(function () { velas.classList.remove('aviva'); }, 2500); }
        decir('✦ Magia de relajación activada ✦');
      }
    });
  }

  /* ---- Texto del selector ---- */
  var h3 = $('.mini-quiz h3');
  if (h3) h3.textContent = '¿No sabes cuál elegir? Deja que la magia te guíe';
})();

/* Aviso de privacidad */
(function () {
  var d = document.getElementById('priv'), a = document.getElementById('abrePriv'), c = document.getElementById('cierraPriv');
  if (!d || !a) return;
  var abre = function () { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); };
  var cierra = function () { if (d.close) d.close(); else d.removeAttribute('open'); };
  a.addEventListener('click', abre);
  c.addEventListener('click', cierra);
  d.addEventListener('click', function (e) { if (e.target === d) cierra(); });
})();
