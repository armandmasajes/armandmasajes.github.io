/* Tarjeta de regalo de ARMAND: se arma en pantalla, se descarga o se comparte (por WhatsApp). */
(function () {
  'use strict';
  var reg = document.getElementById('regalo');
  var btnRegalo = document.getElementById('btnRegalo');
  if (!reg || !btnRegalo || typeof CONFIG === 'undefined') return;

  var navidad = reg.classList.contains('navidad');
  var W = 1080, H = 1440;
  var ORO = '#e2bd78', CLARO = '#f4e2b8', TEXTO = '#f4eee3';

  /* ---- Estructura ---- */
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'btn btn-line tj-abre';
  toggle.textContent = 'Crear tarjeta de regalo';
  toggle.setAttribute('aria-expanded', 'false');
  btnRegalo.parentNode.appendChild(toggle);

  var panel = document.createElement('div');
  panel.className = 'wrap tj-wrap';
  panel.hidden = true;
  var opts = CONFIG.servicios.map(function (s, i) { return '<option value="' + i + '">' + s.nombre + '</option>'; }).join('');
  panel.innerHTML =
    '<div class="tj">' +
    '<h3>Crea la tarjeta de regalo</h3>' +
    '<p class="lead">Escribe los datos y mira cómo queda. Luego la compartes por WhatsApp o la descargas para imprimirla.</p>' +
    '<div class="tj-cols"><div class="tj-form">' +
    '<label>Para quién es<input id="tjPara" maxlength="26" placeholder="Nombre de quien lo recibe" autocomplete="off"></label>' +
    '<label>De parte de<input id="tjDe" maxlength="26" placeholder="Tu nombre" autocomplete="off"></label>' +
    '<label>Regalo<select id="tjServ">' + opts + '</select></label>' +
    '<label>Mensaje<textarea id="tjMsg" maxlength="140" rows="3"></textarea></label>' +
    '</div><div class="tj-vista"><canvas id="tjCv" width="' + W + '" height="' + H + '" aria-label="Vista previa de la tarjeta de regalo"></canvas></div></div>' +
    '<div class="tj-btns"><button type="button" class="btn btn-gold" id="tjComp" hidden>Compartir tarjeta</button>' +
    '<button type="button" class="btn btn-line" id="tjDesc">Descargar imagen</button>' +
    '<a class="btn btn-neon" id="tjWa" href="#" target="_blank" rel="noopener">Pedir este regalo por WhatsApp</a></div>' +
    '<p class="tj-nota">La tarjeta se canjea por WhatsApp, con cita previa. El pago y la fecha se coordinan con Edgar.</p>' +
    '</div>';
  reg.appendChild(panel);

  var $ = function (id) { return document.getElementById(id); };
  var cv = $('tjCv');
  $('tjMsg').value = navidad
    ? 'Que esta Navidad tengas un momento solo para ti. Te mereces descansar.'
    : 'Un momento de calma solo para ti. Te mereces descansar.';

  /* ---- Dibujo ---- */
  var logo = new Image();
  logo.src = 'fotos/logo-ave.png';
  var logoOk = false;
  logo.onload = function () { logoOk = true; dibuja(); };

  function ajusta(x, txt, max, tam, fam, peso) {
    while (tam > 40) {
      x.font = (peso || '') + ' ' + tam + 'px ' + fam;
      if (x.measureText(txt).width <= max) break;
      tam -= 4;
    }
    return tam;
  }
  function lineas(x, txt, max) {
    var pal = txt.split(/\s+/), out = [], cur = '';
    pal.forEach(function (p) {
      var t = cur ? cur + ' ' + p : p;
      if (x.measureText(t).width > max && cur) { out.push(cur); cur = p; } else cur = t;
    });
    if (cur) out.push(cur);
    return out;
  }
  function esp(x, px) { if ('letterSpacing' in x) x.letterSpacing = px + 'px'; }

  function dibuja() {
    var x = cv.getContext('2d');
    var para = $('tjPara').value.trim() || 'alguien especial';
    var de = $('tjDe').value.trim();
    var msg = $('tjMsg').value.trim();
    var s = CONFIG.servicios[+$('tjServ').value];
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, W, H);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'; esp(x, 0);

    /* fondo */
    x.fillStyle = '#070b09'; x.fillRect(0, 0, W, H);
    var g = x.createRadialGradient(540, 360, 40, 540, 360, 820);
    g.addColorStop(0, 'rgba(226,189,120,.24)'); g.addColorStop(1, 'rgba(226,189,120,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    var g2 = x.createRadialGradient(80, 1400, 20, 80, 1400, 620);
    g2.addColorStop(0, navidad ? 'rgba(122,31,43,.45)' : 'rgba(95,212,154,.14)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g2; x.fillRect(0, 0, W, H);

    /* puntitos dorados (nieve en Navidad) */
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (var i = 0; i < (navidad ? 70 : 28); i++) {
      x.globalAlpha = 0.25 + rnd() * 0.55;
      x.fillStyle = rnd() < 0.4 ? ORO : '#ffffff';
      x.beginPath(); x.arc(rnd() * W, rnd() * H, 1.2 + rnd() * 3, 0, 6.283); x.fill();
    }
    x.globalAlpha = 1;

    /* marco */
    var gb = x.createLinearGradient(0, 0, W, H);
    gb.addColorStop(0, '#f4e2b8'); gb.addColorStop(0.5, '#b98a4b'); gb.addColorStop(1, '#f4e2b8');
    x.strokeStyle = gb; x.lineWidth = 4; x.strokeRect(40, 40, W - 80, H - 80);
    x.globalAlpha = 0.5; x.lineWidth = 1.5; x.strokeRect(62, 62, W - 124, H - 124); x.globalAlpha = 1;
    x.fillStyle = ORO;
    [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]].forEach(function (p) {
      x.save(); x.translate(p[0], p[1]); x.rotate(Math.PI / 4); x.fillRect(-9, -9, 18, 18); x.restore();
    });

    /* ave */
    if (logoOk) {
      var lw = 250, lh = lw * logo.naturalHeight / logo.naturalWidth;
      var oc = document.createElement('canvas'); oc.width = lw; oc.height = Math.ceil(lh);
      var ox = oc.getContext('2d');
      ox.filter = 'brightness(.85) contrast(1.5)';
      ox.drawImage(logo, 0, 0, lw, lh);
      ox.filter = 'none';
      ox.globalCompositeOperation = 'destination-in';
      var mk = ox.createRadialGradient(lw / 2, lh / 2, 0, lw / 2, lh / 2, lw * 0.5);
      mk.addColorStop(0, '#000'); mk.addColorStop(0.55, '#000'); mk.addColorStop(1, 'rgba(0,0,0,0)');
      ox.fillStyle = mk; ox.fillRect(0, 0, lw, lh);
      x.save(); x.globalCompositeOperation = 'screen';
      x.drawImage(oc, 540 - lw / 2, 105); x.restore();
    }

    /* textos */
    var yTop = 440;
    x.fillStyle = ORO; x.font = '600 30px Montserrat, sans-serif'; esp(x, 11);
    x.fillText(navidad ? '✦  TARJETA DE REGALO  ✦' : 'TARJETA DE REGALO', 540 + 5, yTop);
    esp(x, 0);
    x.fillStyle = CLARO; x.font = 'italic 500 54px "Cormorant Garamond", serif';
    x.fillText('Un momento de calma para', 540, yTop + 90);

    var tam = ajusta(x, para, 860, 150, '"Dancing Script", cursive', '700');
    var gn = x.createLinearGradient(0, 560, 0, 700);
    gn.addColorStop(0, '#f4e2b8'); gn.addColorStop(1, '#c9974f');
    x.fillStyle = gn; x.font = '700 ' + tam + 'px "Dancing Script", cursive';
    x.fillText(para, 540, yTop + 90 + 40 + tam * 0.85);

    var yDiv = yTop + 90 + 40 + tam * 0.85 + 60;
    x.fillStyle = ORO; x.font = '36px serif'; x.fillText('✦', 540, yDiv);
    x.fillRect(250, yDiv - 14, 220, 1.5); x.fillRect(610, yDiv - 14, 220, 1.5);

    x.fillStyle = TEXTO; x.font = 'italic 500 46px "Cormorant Garamond", serif';
    var ls = lineas(x, msg || 'Un momento de calma solo para ti.', 800).slice(0, 5);
    ls.forEach(function (l, k) { x.fillText(l, 540, yDiv + 80 + k * 62); });

    var yS = yDiv + 80 + Math.max(ls.length, 1) * 62 + 30;
    x.fillStyle = CLARO; x.font = '600 34px Montserrat, sans-serif';
    x.fillText('Incluye', 540, yS);
    x.fillStyle = TEXTO; x.font = '500 40px "Cormorant Garamond", serif';
    x.fillText(s.nombre + ' · ' + s.duracion, 540, yS + 52);

    if (de) {
      x.fillStyle = CLARO; x.font = 'italic 500 38px "Cormorant Garamond", serif';
      x.fillText('Con cariño,', 540, yS + 128);
      var td = ajusta(x, de, 700, 78, '"Dancing Script", cursive', '700');
      x.fillStyle = ORO; x.font = '700 ' + td + 'px "Dancing Script", cursive';
      x.fillText(de, 540, yS + 128 + td * 0.95);
    }

    /* pie */
    x.fillStyle = CLARO; x.font = '600 30px Montserrat, sans-serif'; esp(x, 10);
    x.fillText('ARMAND', 540 + 5, H - 150);
    esp(x, 0);
    x.fillStyle = '#a9b1a9'; x.font = '500 25px Montserrat, sans-serif';
    x.fillText('Masajes a domicilio o en casa de Edgar', 540, H - 108);
    x.fillText('Se canjea por WhatsApp, con cita previa', 540, H - 74);

    actualizaWa(para, de, msg, s);
  }

  function actualizaWa(para, de, msg, s) {
    var t = 'Hola ARMAND, quiero regalar un ' + s.nombre.toLowerCase().replace(/^masaje /, 'masaje ') + (navidad ? ' esta Navidad' : '') +
      ' para ' + para + (de ? ', de parte de ' + de : '') + '. Mensaje de la tarjeta: "' + msg + '". ¿Me ayudan con los detalles?';
    $('tjWa').href = wa(t);
  }

  /* ---- Eventos ---- */
  var tmr;
  var pide = function () { clearTimeout(tmr); tmr = setTimeout(dibuja, 120); };
  ['tjPara', 'tjDe', 'tjServ', 'tjMsg'].forEach(function (id) { $(id).addEventListener('input', pide); });

  var fuentes = function () {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('700 100px "Dancing Script"'),
      document.fonts.load('italic 500 40px "Cormorant Garamond"'),
      document.fonts.load('500 40px "Cormorant Garamond"'),
      document.fonts.load('600 30px Montserrat'),
      document.fonts.load('500 25px Montserrat')
    ]).catch(function () {});
  };

  toggle.addEventListener('click', function () {
    var abre = panel.hidden;
    panel.hidden = !abre;
    toggle.setAttribute('aria-expanded', String(abre));
    toggle.textContent = abre ? 'Ocultar tarjeta' : 'Crear tarjeta de regalo';
    if (abre) {
      fuentes().then(dibuja);
      setTimeout(function () { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
  });

  function blob(cb) { fuentes().then(function () { dibuja(); cv.toBlob(cb, 'image/png'); }); }
  var nombreArchivo = function () {
    var p = ($('tjPara').value.trim() || 'regalo').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return 'tarjeta-armand-' + (p || 'regalo') + '.png';
  };

  $('tjDesc').addEventListener('click', function () {
    blob(function (b) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = nombreArchivo();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
  });

  try {
    var prueba = new File([''], 'a.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [prueba] })) {
      var bc = $('tjComp'); bc.hidden = false;
      bc.addEventListener('click', function () {
        blob(function (b) {
          var f = new File([b], nombreArchivo(), { type: 'image/png' });
          navigator.share({ files: [f], title: 'Tarjeta de regalo ARMAND', text: 'Un regalo de ARMAND: un momento de calma.' }).catch(function () {});
        });
      });
    }
  } catch (e) { /* sin compartir nativo */ }
})();
