/* Carta de bienvenida: se muestra una sola vez por visitante. Para verla de nuevo: ?carta=1 . Para saltarla: ?carta=0 */
(function () {
  'use strict';
  var qs = location.search;
  var forzar = /[?&]carta=1/.test(qs);
  if (/[?&]carta=0/.test(qs)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (/bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent)) return;
  if (!forzar) {
    if (location.hash && location.hash.length > 1) return;
    try {
      if (localStorage.getItem('armand-carta')) return;
      localStorage.setItem('armand-carta', '1');
    } catch (e) { return; }
  }

  var ov = document.createElement('div');
  ov.className = 'carta';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Invitación de ARMAND');
  ov.innerHTML =
    '<div class="carta-caja">' +
    '<p class="carta-sobre">✦ Una invitación para ti ✦</p>' +
    '<div class="carta-papel" aria-hidden="true">' +
    '<span>Estás invitado a</span><b>un momento de calma</b><em>a domicilio o en casa de Edgar</em></div>' +
    '<button type="button" class="carta-sello" aria-label="Abrir la invitación"><span>A</span></button>' +
    '<p class="carta-pista">Toca el sello para abrirla</p>' +
    '<button type="button" class="carta-saltar">Entrar sin abrir</button>' +
    '</div>';
  document.body.appendChild(ov);
  var previo = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';

  var cerrada = false, abierta = false;
  function cerrar() {
    if (cerrada) return; cerrada = true;
    ov.classList.add('sale');
    document.documentElement.style.overflow = previo;
    setTimeout(function () { ov.remove(); }, 900);
  }
  function abrir() {
    if (abierta) return; abierta = true;
    ov.classList.add('abre');
    var s = ov.querySelector('.carta-sello').getBoundingClientRect();
    if (window.armandChispa) window.armandChispa(s.left + s.width / 2, s.top + s.height / 2, 70, 4.6);
    setTimeout(cerrar, 2800);
  }
  ov.querySelector('.carta-sello').addEventListener('click', abrir);
  ov.querySelector('.carta-saltar').addEventListener('click', cerrar);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  setTimeout(abrir, 6000);
})();
