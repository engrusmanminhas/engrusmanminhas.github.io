/* ============================================================
   PLAN & CONTROL — shared site script
   Defensive: every lookup is null-guarded so any page can load it.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var close = document.getElementById('mClose');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { menu.classList.add('open'); document.body.style.overflow = 'hidden'; });
    var shut = function () { menu.classList.remove('open'); document.body.style.overflow = ''; };
    if (close) close.addEventListener('click', shut);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
  }

  /* ---- Nav scroll state + progress bar + scrollspy + back-to-top ---- */
  var nav = document.getElementById('navbar');
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');

  var spyLinks = [].slice.call(document.querySelectorAll('.nav-links a')).filter(function (a) {
    var href = a.getAttribute('href') || '';
    return href.charAt(0) === '#';
  });
  var spySections = spyLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('show', y > window.innerHeight * 0.6);

    if (spySections.length) {
      var mark = y + window.innerHeight * 0.35, current = -1;
      for (var i = 0; i < spySections.length; i++) {
        if (spySections[i] && spySections[i].offsetTop <= mark) current = i;
      }
      spyLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || '', prefix = el.dataset.prefix || '';
        var cur = 0, step = Math.max(1, Math.ceil(target / 38));
        var t = setInterval(function () {
          cur = Math.min(cur + step, target);
          el.textContent = prefix + cur + suffix;
          if (cur >= target) clearInterval(t);
        }, 34);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = (el.dataset.prefix || '') + el.dataset.target + (el.dataset.suffix || ''); });
  }

  /* ---- Form handler (contact + email capture) via Formspree ---- */
  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    var note = form.querySelector('.form-note');
    form.addEventListener('submit', async function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1 || action === '') {
        e.preventDefault();
        if (note) { note.textContent = 'Form not configured yet — please email directly.'; note.className = 'form-note error'; }
        return;
      }
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      if (note) { note.textContent = ''; note.className = 'form-note'; }
      try {
        var res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          if (note) { note.textContent = '✓ Thank you — your message has been sent. I will respond shortly.'; note.className = 'form-note success'; }
          form.reset();
        } else {
          if (note) { note.textContent = 'Something went wrong — please email me directly.'; note.className = 'form-note error'; }
        }
      } catch (err) {
        if (note) { note.textContent = 'Network error — please email me directly.'; note.className = 'form-note error'; }
      }
      if (btn) { btn.textContent = orig; btn.disabled = false; }
    });
  });

  /* ---- Home hero: animated schedule bars (subtle, optional) ---- */
  var sched = document.getElementById('schedule');
  if (sched && !reduce) {
    for (var i = 0; i < 7; i++) {
      var bar = document.createElement('div');
      bar.style.cssText = 'position:absolute;height:6px;border-radius:3px;background:rgba(37,99,235,0.10);top:' +
        (12 + i * 12) + '%;left:' + (Math.random() * 12) + '%;width:' + (24 + Math.random() * 50) + '%;';
      sched.appendChild(bar);
    }
  }
})();
