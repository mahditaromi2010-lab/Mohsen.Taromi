(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  if (reduce) root.classList.add('no-motion');

  // Load sequence
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
  });

  // Sticky nav + mobile bar after the hero
  var hero = document.querySelector('.hero, .ehero');
  var nav = document.querySelector('.nav');
  var mbar = document.querySelector('.mbar');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var past = !e[0].isIntersecting;
      if (nav) nav.classList.toggle('show', past);
      if (mbar) mbar.classList.toggle('show', past);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  // Reveal + bars
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 }) : null;
  document.querySelectorAll('.rv, .compare').forEach(function (el) {
    if (io && !reduce) io.observe(el); else el.classList.add('in');
  });

  // Counters
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce || !io) { el.textContent = end + suffix; return; }
    el.textContent = '0' + suffix;
    var co = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      co.disconnect();
      var start = el.hasAttribute('data-from') ? parseInt(el.getAttribute('data-from'), 10) : 0;
      var t0 = performance.now(), dur = 1600;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (end - start) * k) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.6 });
    co.observe(el);
  });

  // Work-history road draws with scroll
  var hist = document.querySelector('.history');
  var rail = hist && hist.querySelector('.rail i');

  // Journey: truck follows the route with scroll
  var j = document.querySelector('.journey');
  var path = j && j.querySelector('.jpath');
  var truck = j && j.querySelector('.truck');
  var len = path ? path.getTotalLength() : 0;
  var stops = j ? [].slice.call(j.querySelectorAll('[data-at]')) : [];
  var caps = j ? [].slice.call(j.querySelectorAll('.cap')) : [];
  var bar = j && j.querySelector('.jprogress i');
  if (path) { path.style.strokeDasharray = len; }

  function setJourney(p) {
    if (!path) return;
    path.style.strokeDashoffset = len * (1 - p);
    var pt = path.getPointAtLength(len * p);
    var pt2 = path.getPointAtLength(Math.min(len, len * p + 1));
    var ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    if (p >= 0.999) { var a = path.getPointAtLength(len - 1); ang = Math.atan2(pt.y - a.y, pt.x - a.x) * 180 / Math.PI; }
    var flip = Math.abs(ang) > 90;
    truck.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + (flip ? ang + 180 : ang) + ') scale(' + (flip ? -1 : 1) + ' 1)');
    var active = 0;
    stops.forEach(function (s) {
      var on = p >= parseFloat(s.getAttribute('data-at')) - 0.001;
      s.classList.toggle('on', on);
    });
    caps.forEach(function (c, i) { if (p >= parseFloat(c.getAttribute('data-from'))) active = i; });
    caps.forEach(function (c, i) { c.classList.toggle('on', i === active); });
    if (bar) bar.style.width = (p * 100) + '%';
  }

  function onScroll() {
    var vh = window.innerHeight;
    if (j && !reduce) {
      var r = j.getBoundingClientRect();
      var total = r.height - vh;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      setJourney(p);
    }
    if (rail && !reduce) {
      var hr = hist.getBoundingClientRect();
      var hp = Math.min(1, Math.max(0, (vh * 0.75 - hr.top) / hr.height));
      rail.style.setProperty('--p', hp.toFixed(3));
    }
  }

  if (reduce) { setJourney(1); }
  else {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
})();
