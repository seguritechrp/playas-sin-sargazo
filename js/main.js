/* ==========================================================================
   Playas sin Sargazo · Cancún Live — interacciones
   JavaScript sin dependencias. Cada bloque solo se activa si la página
   tiene los elementos que necesita.
   ========================================================================== */
(function () {
  'use strict';

  // Quita acentos y pasa a minúsculas para que "cancun" encuentre "Cancún".
  var norm = function (t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- 1. Buscador de playas (Home) ---------- */
  var search = $('[data-search="cards"]');
  if (search) {
    var cards = $$('[data-card]');
    var counter = $('[data-search-count]');
    var empty = $('[data-search-empty]');
    var emptyQuery = $('[data-search-query]');
    var filterCards = function () {
      var q = norm(search.value);
      var shown = 0;
      cards.forEach(function (card) {
        var hit = !q || norm(card.getAttribute('data-name') + ' ' + card.getAttribute('data-zone')).indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) shown++;
      });
      if (counter) {
        counter.textContent = q
          ? (shown === 1 ? '1 playa sin sargazo encontrada' : shown + ' playas sin sargazo encontradas')
          : shown + ' playas sin sargazo ahora';
      }
      if (empty) {
        empty.hidden = shown !== 0;
        if (emptyQuery) emptyQuery.textContent = search.value;
      }
      var railTrack = $('[data-carousel-track]');
      if (railTrack) {
        railTrack.scrollLeft = 0;
        railTrack.dispatchEvent(new Event('carousel:refresh'));
      }
    };
    search.addEventListener('input', filterCards);
    filterCards();
  }

  /* ---------- 2. Línea de lecturas del día (06:00 a 18:00, cada 15 min) ---------- */
  $$('[data-timeline-dots]').forEach(function (wrap) {
    var done = parseInt(wrap.getAttribute('data-done') || '0', 10);
    for (var i = 0; i <= 48; i++) {
      var dot = document.createElement('span');
      if (i <= done) dot.className = 'is-done';
      wrap.appendChild(dot);
    }
  });

  /* ---------- 3. Ficha de cámara: cambiar de cámara ---------- */
  var camRows = $$('[data-cam]');
  if (camRows.length) {
    var streamImg = $('[data-stream-img]');
    var camLabel = $('[data-cam-label]');
    var thumbs = $$('[data-cam-thumb]');
    camRows.forEach(function (row) {
      row.addEventListener('click', function () {
        camRows.forEach(function (r) {
          r.classList.toggle('is-active', r === row);
          r.setAttribute('aria-pressed', r === row ? 'true' : 'false');
        });
        if (streamImg) {
          streamImg.src = row.getAttribute('data-src');
          streamImg.alt = 'Streaming en vivo: ' + row.getAttribute('data-name');
        }
        if (camLabel) camLabel.textContent = row.getAttribute('data-cam');
        thumbs.forEach(function (t) { t.src = row.getAttribute('data-thumb'); });
      });
    });
  }

  /* ---------- 4. Ficha de cámara: En vivo / Timelapse ---------- */
  var modeButtons = $$('[data-mode]');
  if (modeButtons.length) {
    var modeBadge = $('[data-mode-badge]');
    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        modeButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        if (modeBadge) modeBadge.textContent = btn.getAttribute('data-mode') === 'live' ? 'EN VIVO' : 'TIMELAPSE';
      });
    });
  }

  /* ---------- 5. Panel de detalles del hotel ---------- */
  var drawer = $('[data-drawer]');
  if (drawer) {
    var backdrop = $('[data-drawer-backdrop]');
    var opener = $('.stream__details') || $('[data-drawer-open]');
    var open = function () {
      drawer.hidden = false;
      if (backdrop) backdrop.hidden = false;
      var closeBtn = $('[data-drawer-close]', drawer);
      if (closeBtn) closeBtn.focus();
    };
    var close = function () {
      drawer.hidden = true;
      if (backdrop) backdrop.hidden = true;
      if (opener) opener.focus();
    };
    if (opener) opener.addEventListener('click', open);
    $$('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', close); });
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) close();
    });
  }

  /* ---------- 6. Mapa en vivo: lista, ficha y Google Maps ---------- */
  var mapRows = $$('[data-place]');
  var mapFrame = $('[data-map-frame]');
  if (mapRows.length && mapFrame) {
    var popup = $('[data-popup]');
    var mapSearch = $('[data-search="map"]');
    var mapCount = $('[data-map-count]');
    var mapEmpty = $('[data-map-empty]');
    var mapQuery = function (name, zone) {
      return 'https://maps.google.com/maps?q=' + encodeURIComponent(name + ', ' + zone + ', Cancún') + '&hl=es&z=14&output=embed';
    };
    var selectPlace = function (row) {
      mapRows.forEach(function (item) { item.classList.toggle('is-active', item === row); });
      var name = row.getAttribute('data-name');
      var zone = row.getAttribute('data-zone');
      var id = row.getAttribute('data-place');
      mapFrame.src = mapQuery(name, zone);
      if (!popup) return;
      $('[data-popup-img]', popup).src = row.getAttribute('data-img');
      $('[data-popup-name]', popup).textContent = name;
      $('[data-popup-zone]', popup).textContent = zone;
      var popupCam = $('a[href^="playa.html"]', popup);
      if (popupCam) popupCam.href = 'playa.html?hotel=' + id;
    };
    mapRows.forEach(function (row) {
      row.addEventListener('click', function () { selectPlace(row); });
    });
    if (mapSearch) {
      mapSearch.addEventListener('input', function () {
        var q = norm(mapSearch.value);
        var shown = 0;
        mapRows.forEach(function (row) {
          var hit = !q || norm(row.getAttribute('data-name') + ' ' + row.getAttribute('data-zone')).indexOf(q) !== -1;
          row.hidden = !hit;
          if (hit) shown++;
        });
        if (mapCount) mapCount.innerHTML = '<b>' + shown + '</b> ' + (shown === 1 ? 'playa sin sargazo' : 'playas sin sargazo');
        if (mapEmpty) mapEmpty.hidden = shown !== 0;
      });
    }
    selectPlace($('.place-row.is-active') || mapRows[0]);
  }

  /* ---------- 7. Formulario de afiliación (demo sin envío real) ---------- */
  var form = $('[data-affiliate-form]');
  if (form) {
    var success = $('[data-affiliate-success]');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Conectar aquí con el backend o servicio de formularios.
      form.hidden = true;
      success.hidden = false;
    });
    $('[data-affiliate-reset]').addEventListener('click', function () {
      form.reset();
      success.hidden = true;
      form.hidden = false;
    });
  }

  /* ---------- 8. Controles de demostración: visor, mapa y diálogo ---------- */
  var streamImg = $('[data-stream-img]');
  var streamStage = streamImg ? streamImg.closest('.stream') : null;
  if (streamImg && streamStage) {
    var zoomStep = 0;
    var setZoom = function (step) {
      zoomStep = Math.max(0, Math.min(2, step));
      streamImg.classList.toggle('is-zoomed-1', zoomStep === 1);
      streamImg.classList.toggle('is-zoomed-2', zoomStep === 2);
    };
    $$('[data-stream]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-stream');
        if (action === 'in') setZoom(zoomStep + 1);
        if (action === 'out') setZoom(zoomStep - 1);
        if (action === 'fullscreen') {
          var target = streamStage;
          if (document.fullscreenElement) document.exitFullscreen();
          else if (target.requestFullscreen) target.requestFullscreen();
        }
        if (action === 'shot') {
          streamStage.classList.add('is-shutter');
          window.setTimeout(function () { streamStage.classList.remove('is-shutter'); }, 160);
        }
      });
    });
  }

  $$('[data-play]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-play');
      var target = $('[data-mode="' + mode + '"]');
      if (target) target.click();
    });
  });

  var mapCanvas = $('.map-canvas');
  if (mapCanvas) {
    var mapScale = 1;
    var paintMap = function () {
      mapCanvas.style.transform = 'scale(' + mapScale + ')';
    };
    $$('[data-map]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-map');
        if (action === 'in') mapScale = Math.min(1.8, Math.round((mapScale + 0.2) * 10) / 10);
        if (action === 'out') mapScale = Math.max(1, Math.round((mapScale - 0.2) * 10) / 10);
        if (action === 'reset') mapScale = 1;
        paintMap();
      });
    });
  }

  var infoDialog = $('[data-info-dialog]');
  var infoOpen = $('[data-info-open]');
  if (infoDialog && infoOpen && infoDialog.showModal) {
    infoOpen.addEventListener('click', function () { infoDialog.showModal(); });
  }

  /* ---------- 9. Carrusel de playas: avanza una tarjeta y sigue en bucle ---------- */
  var carousel = $('[data-carousel]');
  if (carousel) {
    var track = $('[data-carousel-track]', carousel);
    var prevBtn = $('[data-carousel-prev]', carousel);
    var nextBtn = $('[data-carousel-next]', carousel);
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoplayId = 0;
    var settleId = 0;
    var setWidth = 0;
    var distance = function () {
      var card = track.querySelector('.cam-card:not([hidden]):not([data-clone])');
      if (!card) return Math.round(track.clientWidth * 0.8);
      return Math.round(card.getBoundingClientRect().width + 20);
    };
    var syncClones = function () {
      $$('[data-clone]', track).forEach(function (node) { node.remove(); });
      $$('.cam-card:not([hidden])', track).forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('data-clone', '');
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      var first = track.querySelector('.cam-card:not([hidden]):not([data-clone])');
      var clone = track.querySelector('[data-clone]');
      setWidth = first && clone ? clone.offsetLeft - first.offsetLeft : 0;
      $$('video', track).forEach(function (video) {
        if (reducedMotion) {
          video.removeAttribute('autoplay');
          video.pause();
          return;
        }
        var pending = video.play();
        if (pending && pending.catch) pending.catch(function () {});
      });
    };
    var normalize = function () {
      if (setWidth > 0 && track.scrollLeft >= setWidth) {
        var snap = track.style.scrollSnapType;
        track.style.scrollSnapType = 'none';
        track.scrollLeft = track.scrollLeft - setWidth;
        track.style.scrollSnapType = snap;
      }
    };
    var move = function (direction) {
      var behavior = reducedMotion ? 'auto' : 'smooth';
      if (direction < 0 && track.scrollLeft <= 4 && setWidth > 0) {
        track.style.scrollSnapType = 'none';
        track.scrollLeft = setWidth;
        track.style.scrollSnapType = '';
      }
      track.scrollBy({ left: direction * distance(), behavior: behavior });
    };
    var stop = function () { window.clearInterval(autoplayId); };
    var play = function () {
      stop();
      if (reducedMotion) return;
      autoplayId = window.setInterval(function () { move(1); }, 3200);
    };
    if (prevBtn) prevBtn.addEventListener('click', function () { move(-1); play(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { move(1); play(); });
    track.addEventListener('scroll', function () {
      window.clearTimeout(settleId);
      settleId = window.setTimeout(normalize, 80);
    });
    track.addEventListener('carousel:refresh', function () {
      syncClones();
      track.scrollLeft = 0;
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', play);
    window.addEventListener('resize', syncClones);
    syncClones();
    play();
  }

  /* ---------- 10. La ficha abre el hotel que se eligió en la tarjeta o el mapa ---------- */
  var streamPhoto = $('[data-stream-img]');
  var panelTitle = $('.panel-title');
  if (streamPhoto && panelTitle) {
    var hotels = {
      azul: { title: 'Azul Caribe', name: 'Hotel Azul Caribe', zone: 'Zona Hotelera Norte', img: 'assets/img/playa-01.jpg', stream: 'assets/video/cam-01.mp4', initials: 'AC', address: 'Blvd. Kukulcán km 9.5, Zona Hotelera, Cancún, Q. Roo', site: 'www.azulcaribe.mx' },
      turquesa: { title: 'Playa Turquesa', name: 'Playa Turquesa Resort', zone: 'Zona Hotelera Norte', img: 'assets/img/playa-02.jpg', stream: 'assets/video/cam-02.mp4', initials: 'PT', address: 'Zona Hotelera Norte, Cancún, Q. Roo', site: 'Sitio del hotel' },
      brisa: { title: 'Brisa Maya', name: 'Brisa Maya Resort', zone: 'Punta Cancún', img: 'assets/img/playa-04.jpg', stream: 'assets/video/cam-03.mp4', initials: 'BM', address: 'Punta Cancún, Cancún, Q. Roo', site: 'Sitio del hotel' },
      coral: { title: 'Casa Coral', name: 'Casa Coral Beach', zone: 'Zona Hotelera Sur', img: 'assets/img/playa-06.jpg', stream: 'assets/video/cam-01.mp4', initials: 'CC', address: 'Zona Hotelera Sur, Cancún, Q. Roo', site: 'Sitio del hotel' },
      sol: { title: 'Sol del Mar', name: 'Sol del Mar Suites', zone: 'Zona Hotelera Sur', img: 'assets/img/playa-05.jpg', stream: 'assets/video/cam-02.mp4', initials: 'SM', address: 'Zona Hotelera Sur, Cancún, Q. Roo', site: 'Sitio del hotel' },
      nacar: { title: 'Costa Nácar', name: 'Costa Nácar', zone: 'Punta Nizuc', img: 'assets/img/playa-03.jpg', stream: 'assets/video/cam-03.mp4', initials: 'CN', address: 'Punta Nizuc, Cancún, Q. Roo', site: 'Sitio del hotel' },
      esmeralda: { title: 'Punta Esmeralda', name: 'Punta Esmeralda', zone: 'Isla Blanca', img: 'assets/img/playa-07.jpg', stream: 'assets/video/cam-01.mp4', initials: 'PE', address: 'Isla Blanca, Cancún, Q. Roo', site: 'Sitio del hotel' },
      bahia: { title: 'Bahía Serena', name: 'Bahía Serena', zone: 'Punta Cancún', img: 'assets/img/playa-02.jpg', stream: 'assets/video/cam-02.mp4', initials: 'BS', address: 'Punta Cancún, Cancún, Q. Roo', site: 'Sitio del hotel' },
      palma: { title: 'Palma Real', name: 'Palma Real', zone: 'Isla Blanca', img: 'assets/img/playa-05.jpg', stream: 'assets/video/cam-03.mp4', initials: 'PR', address: 'Isla Blanca, Cancún, Q. Roo', site: 'Sitio del hotel' }
    };
    var hotelId = new URLSearchParams(window.location.search).get('hotel') || 'azul';
    var hotel = hotels[hotelId] || hotels.azul;
    document.title = hotel.name + ' · Cámara en vivo | Playas sin Sargazo';
    panelTitle.innerHTML = hotel.title + '<span class="dot-red">.</span>';
    var panelSub = $('.panel-sub');
    if (panelSub) panelSub.textContent = hotel.zone + ' · Cancún';
    var hotelName = $('.hotel-card__who b');
    if (hotelName) hotelName.textContent = hotel.name;
    var initials = $('.hotel-card__logo');
    if (initials) initials.textContent = hotel.initials;
    var address = $('.hotel-card__info span');
    if (address) address.textContent = hotel.address;
    var siteLink = $('.hotel-card__info a[href="sitio-hotel.html"]');
    if (siteLink) siteLink.textContent = hotel.site;
    if (streamPhoto.tagName === 'VIDEO') {
      streamPhoto.src = hotel.stream;
      streamPhoto.poster = hotel.img;
      streamPhoto.setAttribute('aria-label', 'Streaming en vivo: ' + hotel.name);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) streamPhoto.pause();
      else {
        var pending = streamPhoto.play();
        if (pending && pending.catch) pending.catch(function () {});
      }
    } else {
      streamPhoto.src = hotel.img;
      streamPhoto.alt = 'Streaming en vivo: ' + hotel.name;
    }
    $$('[data-cam-thumb]').forEach(function (thumb) { thumb.src = hotel.img; });
    var drawerTitle = $('.drawer__title');
    if (drawerTitle) drawerTitle.innerHTML = hotel.title + '<span class="dot-red">.</span>';
    var drawerAddress = $('.address');
    if (drawerAddress) drawerAddress.textContent = hotel.address;
    $$('[data-hotel-map]').forEach(function (frame) {
      frame.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(hotel.address) + '&hl=es&z=14&output=embed';
      frame.title = 'Mapa de ' + hotel.name;
    });
    var drawerCopy = $('.drawer__copy');
    if (drawerCopy) drawerCopy.textContent = 'Hotel frente al mar en ' + hotel.zone + '. La cámara principal encuadra la orilla, que es la zona que revisa SAiMON VISION.';
    $$('.drawer__gallery img').forEach(function (img) { img.src = hotel.img; });
  }

  /* ---------- 11. Volver arriba, visible al bajar ---------- */
  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.hidden = true;
  toTop.setAttribute('aria-label', 'Volver arriba');
  toTop.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
  document.body.appendChild(toTop);
  var reducedScroll = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paintToTop = function () { toTop.hidden = window.scrollY < 480; };
  window.addEventListener('scroll', paintToTop, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reducedScroll ? 'auto' : 'smooth' });
  });
  paintToTop();

  /* El fondo del menú solo aparece al salir del hero. */
  var overlayHeader = $('.site-header--overlay');
  if (overlayHeader) {
    var paintHeader = function () {
      overlayHeader.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', paintHeader, { passive: true });
    paintHeader();
  }

  /* ---------- 12. Contador del hero y aparición al bajar ---------- */
  var motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionOk) {
    $$('video').forEach(function (video) {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }
  var countEase = function (t) { return 1 - Math.pow(1 - t, 3); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  if (motionOk && $('[data-count], [data-count-time]')) {
    window.setTimeout(function () {
      $$('[data-count]').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var started = performance.now();
        var duration = 1100;
        el.textContent = '0';
        var frame = function () {
          var progress = Math.min(1, (performance.now() - started) / duration);
          el.textContent = String(Math.round(countEase(progress) * target));
          if (progress < 1) window.setTimeout(frame, 16);
        };
        frame();
      });
      $$('[data-count-time]').forEach(function (el) {
        var parts = (el.getAttribute('data-count-time') || '0:00').split(':');
        var target = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
        var started = performance.now();
        var duration = 1400;
        el.textContent = '0:00';
        var frame = function () {
          var progress = Math.min(1, (performance.now() - started) / duration);
          var minutes = Math.round(countEase(progress) * target);
          el.textContent = Math.floor(minutes / 60) + ':' + pad2(minutes % 60);
          if (progress < 1) window.setTimeout(frame, 16);
        };
        frame();
      });
    }, 420);
  }

  if (motionOk) {
    var revealNodes = $$('.coast__copy, .coast__map, .how__head, .step, .logo-tile, .band, .faq__title, .faq__item');
    revealNodes.forEach(function (node) { node.classList.add('reveal'); });
    var shown = [];
    var paintReveal = function () {
      var line = window.innerHeight * 0.88;
      revealNodes.forEach(function (node) {
        if (shown.indexOf(node) !== -1) return;
        var rect = node.getBoundingClientRect();
        if (rect.top > line || rect.bottom < 0) return;
        var parent = node.parentElement;
        var siblings = parent ? $$('.reveal', parent) : [];
        var index = siblings.indexOf(node);
        node.style.transitionDelay = Math.max(0, index) * 90 + 'ms';
        node.classList.add('is-in');
        shown.push(node);
      });
    };
    window.addEventListener('scroll', paintReveal, { passive: true });
    window.addEventListener('resize', paintReveal);
    paintReveal();
  }
})();
