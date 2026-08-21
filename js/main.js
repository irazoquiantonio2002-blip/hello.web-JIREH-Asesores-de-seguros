/* ══════════════════════════════════════════════════════════════
   JIREH ASESORES DE SEGUROS — main.js
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── WhatsApp config ─────────────────────────────────────── */
  var WA_NUMBER = '529321273550';

  /* ── Loader ───────────────────────────────────────────────── */
  function hideLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return revealHero();
    window.setTimeout(function () {
      loader.classList.add('is-hidden');
      revealHero();
    }, reduceMotion ? 0 : 900);
  }

  function revealHero() {
    var title = document.getElementById('hero-heading');
    if (title) title.classList.add('is-revealed');
    startTypewriter();
  }

  /* ── Hero title typewriter (cycling word) ────────────────── */
  function startTypewriter() {
    var el = document.getElementById('hero-typewriter');
    if (!el) return;
    var words = ['te importa', 'amas', 'valoras', 'cuidas'];

    if (reduceMotion) {
      el.textContent = words[0];
      return;
    }

    var wordIndex = 0, charIndex = words[0].length, deleting = false;

    function tick() {
      var word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex >= word.length) {
          window.setTimeout(function () { deleting = true; tick(); }, 2600);
          return;
        }
        window.setTimeout(tick, 100);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          window.setTimeout(tick, 500);
          return;
        }
        window.setTimeout(tick, 50);
      }
    }

    window.setTimeout(function () { deleting = true; tick(); }, 2600);
  }

  window.addEventListener('load', hideLoader);
  // Safety net in case 'load' fires very late (slow external assets)
  window.setTimeout(hideLoader, 4000);

  /* ── Navbar scroll state + mobile menu ───────────────────── */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ── Scroll reveal ────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Marquee content ──────────────────────────────────────── */
  var marqueeWords = [
    'Seguro de Auto', 'Seguro de Vida', 'Gastos Médicos Mayores',
    'Seguro de Viaje', 'Protección de Hogar', 'Protección por Invalidez',
    'Daños a Terceros', 'Asesoría Personalizada'
  ];
  var marqueeEl = document.getElementById('marquee');
  if (marqueeEl) {
    var buildSet = function () {
      return marqueeWords.map(function (w) {
        return '<span class="marquee-item"><i class="fa-solid fa-shield-halved"></i>' + w + '</span>';
      }).join('');
    };
    // duplicated for a seamless infinite loop
    marqueeEl.innerHTML = buildSet() + buildSet();
  }

  /* ── Footer year ──────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Contact form → WhatsApp ──────────────────────────────── */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        form.reportValidity();
        return;
      }

      var text = 'Hola, soy ' + name + '. Me interesa cotizar: ' + interest + '.\n\n' + msg;
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
