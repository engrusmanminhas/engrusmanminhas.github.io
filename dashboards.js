/* ============================================================
   PLAN & CONTROL — Executive dashboards
   Data-driven SVG charts, vanilla JS, no dependencies.
   All datasets are sample / anonymized project-control data.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- validated categorical palette (fixed order) ---------- */
  var C = {
    blue:   '#2563eb',
    aqua:   '#0f9d6c',
    amber:  '#dd9500',
    violet: '#6d28d9',
    blueSoft: '#93c5fd',
    pos: '#2563eb',   /* diverging + pole  */
    neg: '#d64545',   /* diverging − pole  */
    ink: '#0b1220', muted: '#5e6b81', faint: '#94a3b8',
    grid: '#e6eaf2', axis: '#c6d0e0'
  };
  var FMT = {
    pct: function (v) { return v.toFixed(0) + '%'; },
    pct1: function (v) { return v.toFixed(1) + '%'; },
    num: function (v) { return v.toLocaleString('en-US'); },
    usd: function (v) { return '$' + v.toLocaleString('en-US') + 'k'; },
    usdM: function (v) { return '$' + v.toFixed(1) + 'M'; },
    idx: function (v) { return v.toFixed(2); }
  };

  /* ================= DATA (sample · anonymized) ================= */

  var MONTHS18 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
  var WEEKS16 = []; for (var w = 1; w <= 16; w++) WEEKS16.push('W' + w);

  var DATA = {
    portfolio: [
      { name: 'HLPH Substation Upgrade',        sector: 'Oil & Gas',      value: 3.3,   pc: 68,  spi: 0.94, cpi: 1.02, status: ['warn', 'Watch'] },
      { name: 'New Fire School Building',       sector: 'Construction',   value: 1.3,   pc: 54,  spi: 1.01, cpi: 1.03, status: ['ok', 'On track'] },
      { name: 'Gilgit–Shandoor Road Pkg III',   sector: 'Infrastructure', value: 54.0,  pc: 100, spi: 0.97, cpi: 0.99, status: ['info', 'Complete'] },
      { name: 'Jaglot–Skardu Road & Bridges',   sector: 'EPC',            value: 110.0, pc: 100, spi: 1.05, cpi: 1.01, status: ['info', 'Complete'] },
      { name: '50-Bed Cardiac Hospital, GB',    sector: 'Healthcare',     value: 2.6,   pc: 100, spi: 0.98, cpi: 1.00, status: ['info', 'Complete'] },
      { name: 'Capital Smart City (phase)',     sector: 'Smart City',     value: 85.0,  pc: 100, spi: 0.96, cpi: 0.98, status: ['info', 'Complete'] },
      { name: 'Bridges Task Force (8 no.)',     sector: 'EPC',            value: 38.0,  pc: 100, spi: 1.20, cpi: 1.04, status: ['info', 'Complete'] },
      { name: 'Bahria Town Housing Works',      sector: 'Residential',    value: 6.5,   pc: 100, spi: 0.99, cpi: 1.00, status: ['info', 'Complete'] }
    ],

    evm: {
      labels: MONTHS18,
      pv: [2, 5, 9, 14, 20, 27, 35, 44, 53, 62, 70, 77, 83, 88, 92, 95, 98, 100],
      ev: [1.5, 4, 7.5, 12, 17, 23, 30, 38, 46, 54, 62, 69, 75, 81, 86, 90, 93, 96],
      ac: [1.4, 3.8, 7.2, 11.5, 16.4, 22.3, 29.2, 37, 45, 52.8, 60.7, 67.6, 73.5, 79.4, 84.2, 88.1, 91, 94.1]
    },

    progress: {
      labels: WEEKS16,
      planned: [3, 7, 12, 18, 25, 33, 41, 50, 58, 66, 74, 81, 87, 92, 96, 100],
      actual:  [2.5, 6, 10.5, 16, 22, 29, 37, 45, 53, 61, 68, 75, 81, 87, 92, 96]
    },

    manpower: {
      labels: WEEKS16,
      civil:    [18, 24, 30, 36, 40, 44, 46, 48, 46, 42, 38, 32, 26, 20, 16, 12],
      mech:     [6, 8, 12, 16, 22, 28, 32, 36, 38, 38, 34, 30, 24, 18, 12, 8],
      eni:      [4, 5, 6, 8, 10, 14, 18, 24, 28, 32, 34, 32, 28, 22, 16, 10],
      finish:   [0, 0, 0, 2, 4, 6, 8, 10, 14, 18, 22, 26, 28, 26, 22, 16],
      peak: 140
    },

    productivity: [0.86, 0.9, 0.93, 0.95, 0.92, 0.96, 0.99, 1.01, 0.98, 1.02, 1.04, 1.01, 0.99, 1.03, 1.05, 1.02],

    cost: {
      wbs: ['Civil', 'Structural', 'Mechanical', 'Piping', 'Electrical', 'Instrum.', 'Finishes', 'HSE & Temp'],
      budget:    [820, 610, 540, 480, 660, 320, 290, 180],
      committed: [790, 585, 500, 430, 640, 260, 210, 150],
      actual:    [740, 540, 430, 350, 560, 205, 150, 130]
    },

    cashflow: {
      labels: ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'],
      planned: [90, 210, 380, 590, 850, 1150, 1480, 1830, 2190, 2540, 2860, 3120],
      actual:  [80, 190, 350, 545, 800, 1090, 1400, 1740, 2080, 2410, 2720, 2980]
    },

    procurement: [
      ['PO-1042', 'Reinforcement steel', '120 t', 'Received', 'Wk 12', ['ok', 'Delivered']],
      ['PO-1051', 'LV switchgear', '4 set', 'Partial', 'Wk 16', ['warn', 'In transit']],
      ['PO-1055', 'Structural steel sections', '85 t', 'Received', 'Wk 13', ['ok', 'Delivered']],
      ['PO-1063', 'HVAC air-handling units', '6 no.', '—', 'Wk 19', ['info', 'Ordered']],
      ['PO-1067', 'MV cables (11kV)', '2.4 km', 'Partial', 'Wk 17', ['warn', 'In transit']],
      ['PO-1071', 'Instrument control panels', '3 no.', '—', 'Wk 20', ['info', 'Ordered']],
      ['PO-1078', 'Fire-rated doors', '38 no.', '—', 'Wk 21', ['bad', 'Pending']],
      ['PO-1082', 'Piping spools (CS)', '410 m', 'Received', 'Wk 14', ['ok', 'Delivered']],
      ['PO-1085', 'Fire pumps & skids', '2 set', '—', 'Wk 22', ['bad', 'Pending']],
      ['PO-1090', 'Cable trays & supports', '900 m', 'Received', 'Wk 13', ['ok', 'Delivered']],
      ['PO-1094', 'Paint & coating systems', '1 lot', 'Partial', 'Wk 18', ['warn', 'In transit']],
      ['PO-1098', 'Lighting fixtures (Ex-rated)', '260 no.', '—', 'Wk 23', ['info', 'Ordered']]
    ],

    delays: [
      ['C-01', 'PTW window reduced by unit turnaround', 'Permit', 'Critical', ['bad', 'Open']],
      ['C-02', 'IFC drawings — substation layout rev.', 'Design', 'High', ['warn', 'Mitigating']],
      ['C-03', 'Switchgear delivery slipped 3 weeks', 'Material', 'High', ['warn', 'Mitigating']],
      ['C-04', 'Skilled E&I labour shortfall', 'Manpower', 'Medium', ['info', 'Monitoring']],
      ['C-05', 'Client decision — cutover sequence', 'Client', 'Medium', ['ok', 'Closed']],
      ['C-06', 'H₂S alarm evacuations (3 events)', 'Site', 'Medium', ['info', 'Monitoring']],
      ['C-07', 'Road closure for crane mobilisation', 'Logistics', 'Low', ['ok', 'Closed']],
      ['C-08', 'Concrete supply quality hold', 'Material', 'Medium', ['ok', 'Closed']],
      ['C-09', 'Design clash — cable tray routing', 'Design', 'Low', ['ok', 'Closed']],
      ['C-10', 'Extended summer heat-stress regime', 'Weather', 'Medium', ['info', 'Monitoring']]
    ]
  };

  /* ================= SVG helpers ================= */

  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function fmtDefault(v) { return String(v); }

  /* rounded-top vertical bar anchored at baseline */
  function barPathUp(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    var y0 = y + h;
    return 'M' + x + ',' + y0 +
      ' L' + x + ',' + (y + r) +
      ' Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
      ' L' + (x + w - r) + ',' + y +
      ' Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) +
      ' L' + (x + w) + ',' + y0 + ' Z';
  }
  /* rounded-right horizontal bar anchored at left baseline */
  function barPathRight(x, y, w, h, r) {
    r = Math.min(r, h / 2, w);
    return 'M' + x + ',' + y +
      ' L' + (x + w - r) + ',' + y +
      ' Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) +
      ' L' + (x + w) + ',' + (y + h - r) +
      ' Q' + (x + w) + ',' + (y + h) + ' ' + (x + w - r) + ',' + (y + h) +
      ' L' + x + ',' + (y + h) + ' Z';
  }

  function makeTip(wrap) {
    var tip = document.createElement('div');
    tip.className = 'viz-tip';
    wrap.appendChild(tip);
    return tip;
  }
  function moveTip(tip, wrap, clientX, clientY) {
    var r = wrap.getBoundingClientRect();
    var x = clientX - r.left, y = clientY - r.top;
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var lx = x + 16; if (lx + tw > r.width - 4) lx = x - tw - 16;
    var ly = y - th - 12; if (ly < 4) ly = y + 16;
    tip.style.left = lx + 'px'; tip.style.top = ly + 'px';
  }
  function tipHTML(title, rows) {
    var h = '<div class="tt-title">' + title + '</div>';
    rows.forEach(function (r) {
      h += '<div class="tt-row"><span><i style="background:' + r[0] + '"></i>' + r[1] + '</span><b>' + r[2] + '</b></div>';
    });
    return h;
  }

  function frame(svg, m, W, H, yMax, yFmt, ticks) {
    ticks = ticks || 4;
    for (var i = 0; i <= ticks; i++) {
      var yy = m.t + (H - m.t - m.b) * (i / ticks);
      el('line', { x1: m.l, y1: yy, x2: W - m.r, y2: yy, class: 'grid-line' }, svg);
      var val = yMax * (1 - i / ticks);
      var t = el('text', { x: m.l - 8, y: yy + 3.5, 'text-anchor': 'end', class: 'axis-label' }, svg);
      t.textContent = (yFmt || fmtDefault)(val);
    }
    el('line', { x1: m.l, y1: H - m.b, x2: W - m.r, y2: H - m.b, stroke: C.axis, 'stroke-width': 1 }, svg);
  }
  function xLabels(svg, labels, xAt, H, m, every) {
    every = every || 1;
    labels.forEach(function (lb, i) {
      if (i % every !== 0 && i !== labels.length - 1) return;
      var t = el('text', { x: xAt(i), y: H - m.b + 18, 'text-anchor': 'middle', class: 'axis-label' }, svg);
      t.textContent = lb;
    });
  }
  function legend(wrap, series) {
    if (series.length < 2) return;
    var lg = document.createElement('div');
    lg.className = 'legend';
    series.forEach(function (s) {
      var sp = document.createElement('span');
      sp.innerHTML = '<i style="background:' + s.color + '"></i> ' + s.name;
      lg.appendChild(sp);
    });
    wrap.parentNode.insertBefore(lg, wrap.nextSibling);
  }

  /* ---------- multi-series line/area chart with crosshair+tooltip ---------- */
  function lineChart(mount, cfg) {
    var W = cfg.w || 960, H = cfg.h || 360;
    var m = { l: 52, r: cfg.endLabels ? 52 : 20, t: 16, b: 34 };
    var yMax = cfg.yMax, yMin = cfg.yMin || 0;
    var n = cfg.labels.length;
    var wrap = document.createElement('div');
    wrap.className = 'viz-wrap';
    mount.appendChild(wrap);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': cfg.aria || '' }, wrap);
    frame(svg, m, W, H, yMax, cfg.yFmt, cfg.ticks);
    function X(i) { return m.l + (W - m.l - m.r) * (n === 1 ? 0 : i / (n - 1)); }
    function Y(v) { return m.t + (H - m.t - m.b) * (1 - (v - yMin) / (yMax - yMin)); }
    xLabels(svg, cfg.labels, X, H, m, cfg.xEvery || 1);

    if (cfg.refY != null) {
      el('line', { x1: m.l, y1: Y(cfg.refY), x2: W - m.r, y2: Y(cfg.refY), stroke: C.faint, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, svg);
      var rl = el('text', { x: W - m.r + 6, y: Y(cfg.refY) + 3.5, class: 'axis-label' }, svg);
      rl.textContent = cfg.refLabel || cfg.refY;
    }

    cfg.series.forEach(function (s) {
      var pts = s.values.map(function (v, i) { return X(i) + ',' + Y(v); }).join(' ');
      if (s.area) {
        el('polygon', {
          points: X(0) + ',' + Y(yMin) + ' ' + pts + ' ' + X(s.values.length - 1) + ',' + Y(yMin),
          fill: s.color, opacity: 0.07
        }, svg);
      }
      el('polyline', {
        points: pts, fill: 'none', stroke: s.color, 'stroke-width': 2,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'stroke-dasharray': s.dash || 'none'
      }, svg);
    });

    /* selective direct labels at line ends: short codes, dodged vertically */
    if (cfg.endLabels) {
      var ends = cfg.series.map(function (s) {
        var li = s.values.length - 1;
        return { text: s.short || s.name, color: s.color, y: Y(s.values[li]), x: X(li) };
      }).sort(function (a, b) { return a.y - b.y; });
      for (var q = 1; q < ends.length; q++) {
        if (ends[q].y - ends[q - 1].y < 14) ends[q].y = ends[q - 1].y + 14;
      }
      ends.forEach(function (e2) {
        var t = el('text', {
          x: e2.x + 8, y: Math.min(e2.y, H - m.b - 4) + 4,
          'font-family': 'JetBrains Mono, monospace', 'font-size': 11, 'font-weight': 500, fill: C.muted
        }, svg);
        t.textContent = e2.text;
      });
    }

    /* hover layer: crosshair + snap dots + tooltip */
    var cross = el('line', { y1: m.t, y2: H - m.b, class: 'crosshair', opacity: 0 }, svg);
    var dots = cfg.series.map(function (s) {
      return el('circle', { r: 4.5, fill: s.color, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
    });
    var tip = makeTip(wrap);
    var overlay = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' }, svg);
    function hide() { tip.classList.remove('show'); cross.setAttribute('opacity', 0); dots.forEach(function (d) { d.setAttribute('opacity', 0); }); }
    overlay.addEventListener('mousemove', function (evt) {
      var box = svg.getBoundingClientRect();
      var px = (evt.clientX - box.left) * (W / box.width);
      var i = Math.round((px - m.l) / ((W - m.l - m.r) / (n - 1)));
      i = Math.max(0, Math.min(n - 1, i));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('opacity', 1);
      var rows = cfg.series.map(function (s, k) {
        var v = s.values[i];
        dots[k].setAttribute('cx', X(i)); dots[k].setAttribute('cy', Y(v)); dots[k].setAttribute('opacity', v == null ? 0 : 1);
        return [s.color, s.name, (cfg.tipFmt || cfg.yFmt || fmtDefault)(v)];
      });
      tip.innerHTML = tipHTML(cfg.labels[i], rows);
      tip.classList.add('show');
      moveTip(tip, wrap, evt.clientX, evt.clientY);
    });
    overlay.addEventListener('mouseleave', hide);
    legend(wrap, cfg.series);
  }

  /* ---------- grouped vertical bars ---------- */
  function groupBars(mount, cfg) {
    var W = cfg.w || 960, H = cfg.h || 360;
    var m = { l: 56, r: 16, t: 16, b: 34 };
    var yMax = cfg.yMax;
    var wrap = document.createElement('div'); wrap.className = 'viz-wrap'; mount.appendChild(wrap);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': cfg.aria || '' }, wrap);
    frame(svg, m, W, H, yMax, cfg.yFmt);
    var n = cfg.labels.length, k = cfg.series.length;
    var slot = (W - m.l - m.r) / n;
    var bw = Math.min(26, (slot * 0.62) / k);
    var tip = makeTip(wrap);
    function Y(v) { return m.t + (H - m.t - m.b) * (1 - v / yMax); }

    cfg.labels.forEach(function (lb, gi) {
      var cx = m.l + slot * gi + slot / 2;
      var x0 = cx - (bw * k + 2 * (k - 1)) / 2;
      var g = el('g', {}, svg);
      cfg.series.forEach(function (s, si) {
        var v = s.values[gi];
        var y = Y(v), h = H - m.b - y;
        el('path', { d: barPathUp(x0 + si * (bw + 2), y, bw, h, 4), fill: s.color, class: 'bar' }, g);
      });
      var t = el('text', { x: cx, y: H - m.b + 18, 'text-anchor': 'middle', class: 'axis-label' }, svg);
      t.textContent = lb;
      /* group hover target */
      var hover = el('rect', { x: m.l + slot * gi, y: m.t, width: slot, height: H - m.t - m.b, fill: 'transparent' }, svg);
      hover.addEventListener('mousemove', function (evt) {
        tip.innerHTML = tipHTML(lb, cfg.series.map(function (s) {
          return [s.color, s.name, (cfg.tipFmt || cfg.yFmt || fmtDefault)(s.values[gi])];
        }));
        tip.classList.add('show');
        moveTip(tip, wrap, evt.clientX, evt.clientY);
      });
      hover.addEventListener('mouseleave', function () { tip.classList.remove('show'); });
    });
    legend(wrap, cfg.series);
  }

  /* ---------- stacked vertical bars (+ optional reference line) ---------- */
  function stackBars(mount, cfg) {
    var W = cfg.w || 960, H = cfg.h || 360;
    var m = { l: 52, r: 16, t: 16, b: 34 };
    var yMax = cfg.yMax;
    var wrap = document.createElement('div'); wrap.className = 'viz-wrap'; mount.appendChild(wrap);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': cfg.aria || '' }, wrap);
    frame(svg, m, W, H, yMax, cfg.yFmt);
    var n = cfg.labels.length;
    var slot = (W - m.l - m.r) / n;
    var bw = Math.min(34, slot * 0.6);
    var tip = makeTip(wrap);
    function Y(v) { return m.t + (H - m.t - m.b) * (1 - v / yMax); }

    cfg.labels.forEach(function (lb, gi) {
      var cx = m.l + slot * gi + slot / 2;
      var acc = 0;
      cfg.series.forEach(function (s, si) {
        var v = s.values[gi]; if (!v) { return; }
        var yTop = Y(acc + v), yBot = Y(acc);
        var isTop = si === topIndex(cfg.series, gi);
        var h = Math.max(0, yBot - yTop - 2); /* 2px surface gap between segments */
        if (h <= 0) { acc += v; return; }
        if (isTop) el('path', { d: barPathUp(cx - bw / 2, yTop, bw, h, 4), fill: s.color }, svg);
        else el('rect', { x: cx - bw / 2, y: yTop, width: bw, height: h, fill: s.color }, svg);
        acc += v;
      });
      if (gi % (cfg.xEvery || 1) === 0 || gi === n - 1) {
        var t = el('text', { x: cx, y: H - m.b + 18, 'text-anchor': 'middle', class: 'axis-label' }, svg);
        t.textContent = lb;
      }
      var hover = el('rect', { x: m.l + slot * gi, y: m.t, width: slot, height: H - m.t - m.b, fill: 'transparent' }, svg);
      hover.addEventListener('mousemove', function (evt) {
        var total = 0;
        var rows = cfg.series.map(function (s) {
          total += s.values[gi];
          return [s.color, s.name, FMT.num(s.values[gi])];
        });
        rows.push(['transparent', 'Total', FMT.num(total)]);
        tip.innerHTML = tipHTML(lb, rows);
        tip.classList.add('show');
        moveTip(tip, wrap, evt.clientX, evt.clientY);
      });
      hover.addEventListener('mouseleave', function () { tip.classList.remove('show'); });
    });
    function topIndex(series, gi) {
      for (var i = series.length - 1; i >= 0; i--) if (series[i].values[gi]) return i;
      return series.length - 1;
    }
    if (cfg.refY != null) {
      el('line', { x1: m.l, y1: Y(cfg.refY), x2: W - m.r, y2: Y(cfg.refY), stroke: C.neg, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, svg);
      var rl = el('text', { x: W - m.r, y: Y(cfg.refY) - 6, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 10.5, fill: C.neg }, svg);
      rl.textContent = cfg.refLabel;
    }
    legend(wrap, cfg.series);
  }

  /* ---------- horizontal bars (single measure) ---------- */
  function hBars(mount, cfg) {
    var W = cfg.w || 960;
    var rowH = 44, m = { l: 220, r: 70, t: 8, b: 8 };
    var H = m.t + m.b + rowH * cfg.items.length;
    var vMax = cfg.max;
    var wrap = document.createElement('div'); wrap.className = 'viz-wrap'; mount.appendChild(wrap);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': cfg.aria || '' }, wrap);
    var tip = makeTip(wrap);
    cfg.items.forEach(function (it, i) {
      var y = m.t + rowH * i + (rowH - 18) / 2;
      var w = (W - m.l - m.r) * (it.value / vMax);
      var lbl = el('text', { x: m.l - 12, y: y + 13, 'text-anchor': 'end', 'font-family': 'Satoshi, Inter, sans-serif', 'font-size': 13, fill: C.ink }, svg);
      lbl.textContent = it.label;
      el('rect', { x: m.l, y: y, width: W - m.l - m.r, height: 18, rx: 5, fill: '#f0f4fb' }, svg);
      var bar = el('path', { d: barPathRight(m.l, y, Math.max(w, 6), 18, 5), fill: C.blue }, svg);
      var val = el('text', { x: m.l + Math.max(w, 6) + 10, y: y + 13.5, 'font-family': 'JetBrains Mono, monospace', 'font-size': 11.5, fill: C.muted }, svg);
      val.textContent = cfg.fmt(it.value);
      bar.addEventListener('mousemove', function (evt) {
        tip.innerHTML = tipHTML(it.label, [[C.blue, it.sub || 'Value', cfg.fmt(it.value)]]);
        tip.classList.add('show'); moveTip(tip, wrap, evt.clientX, evt.clientY);
      });
      bar.addEventListener('mouseleave', function () { tip.classList.remove('show'); });
    });
  }

  /* ---------- diverging variance bars (SV / CV) ---------- */
  function divergeBars(mount, cfg) {
    var W = cfg.w || 960, H = cfg.h || 300;
    var m = { l: 52, r: 16, t: 16, b: 34 };
    var vAbs = cfg.absMax;
    var wrap = document.createElement('div'); wrap.className = 'viz-wrap'; mount.appendChild(wrap);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': cfg.aria || '' }, wrap);
    var midY = m.t + (H - m.t - m.b) / 2;
    /* frame: ± axis */
    [1, 0.5, 0, -0.5, -1].forEach(function (f) {
      var yy = midY - f * (H - m.t - m.b) / 2;
      el('line', { x1: m.l, y1: yy, x2: W - m.r, y2: yy, class: 'grid-line' }, svg);
      var t = el('text', { x: m.l - 8, y: yy + 3.5, 'text-anchor': 'end', class: 'axis-label' }, svg);
      t.textContent = (f * vAbs > 0 ? '+' : '') + (f * vAbs).toFixed(1);
    });
    el('line', { x1: m.l, y1: midY, x2: W - m.r, y2: midY, stroke: C.axis, 'stroke-width': 1.5 }, svg);
    var n = cfg.labels.length;
    var slot = (W - m.l - m.r) / n;
    var bw = Math.min(22, slot * 0.55);
    var tip = makeTip(wrap);
    cfg.values.forEach(function (v, i) {
      var cx = m.l + slot * i + slot / 2;
      var h = Math.abs(v) / vAbs * (H - m.t - m.b) / 2;
      var y = v >= 0 ? midY - h : midY;
      var bar = el('rect', { x: cx - bw / 2, y: y, width: bw, height: Math.max(h, 1.5), rx: 3, fill: v >= 0 ? C.pos : C.neg }, svg);
      if (i % 2 === 0 || i === n - 1) {
        var t = el('text', { x: cx, y: H - m.b + 18, 'text-anchor': 'middle', class: 'axis-label' }, svg);
        t.textContent = cfg.labels[i];
      }
      bar.addEventListener('mousemove', function (evt) {
        tip.innerHTML = tipHTML(cfg.labels[i], [[v >= 0 ? C.pos : C.neg, cfg.name, (v >= 0 ? '+' : '') + v.toFixed(1) + ' pts']]);
        tip.classList.add('show'); moveTip(tip, wrap, evt.clientX, evt.clientY);
      });
      bar.addEventListener('mouseleave', function () { tip.classList.remove('show'); });
    });
  }

  /* ================= table builders ================= */
  function pill(cls, text) { return '<span class="pill ' + cls + '">' + text + '</span>'; }
  function fillTable(name, rowsHTML) {
    var tb = document.querySelector('tbody[data-table="' + name + '"]');
    if (tb) tb.innerHTML = rowsHTML;
  }

  /* ================= render everything ================= */
  function mountChart(name, fn) {
    var host = document.querySelector('[data-chart="' + name + '"]');
    if (host) fn(host);
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- tabs ---- */
    var tabs = [].slice.call(document.querySelectorAll('.dash-tab'));
    var dashes = [].slice.call(document.querySelectorAll('.dashboard'));
    function activate(id, push) {
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.dash === id); });
      dashes.forEach(function (d) { d.classList.toggle('active', d.id === 'dash-' + id); });
      if (push) history.replaceState(null, '', '#' + id);
      if (push && typeof window.gtag === 'function') window.gtag('event', 'dashboard_tab', { tab: id });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { activate(t.dataset.dash, true); });
    });
    var initial = (location.hash || '').replace('#', '');
    if (!document.getElementById('dash-' + initial)) initial = 'portfolio';
    activate(initial, false);

    /* ---- 1 · Portfolio overview ---- */
    var pf = DATA.portfolio;
    mountChart('pf-value', function (host) {
      hBars(host, {
        items: pf.slice().sort(function (a, b) { return b.value - a.value; }).map(function (p) {
          return { label: p.name, value: p.value, sub: 'Contract value' };
        }),
        max: 115, fmt: FMT.usdM,
        aria: 'Contract value by project, USD millions'
      });
    });
    fillTable('portfolio', pf.map(function (p) {
      return '<tr><td>' + p.name + '</td><td>' + p.sector + '</td>' +
        '<td class="num">' + FMT.usdM(p.value) + '</td>' +
        '<td class="num">' + p.pc + '%</td>' +
        '<td class="num">' + p.spi.toFixed(2) + '</td>' +
        '<td class="num">' + p.cpi.toFixed(2) + '</td>' +
        '<td>' + pill(p.status[0], p.status[1]) + '</td></tr>';
    }).join(''));

    /* ---- 2 · EVM deep dive ---- */
    var evm = DATA.evm;
    mountChart('evm-scurve', function (host) {
      lineChart(host, {
        labels: evm.labels, yMax: 100, yFmt: FMT.pct, xEvery: 2, h: 380, endLabels: true,
        series: [
          { name: 'Planned (PV)', short: 'PV', color: C.blue, values: evm.pv },
          { name: 'Earned (EV)', short: 'EV', color: C.aqua, values: evm.ev, area: true },
          { name: 'Actual (AC)', short: 'AC', color: C.amber, values: evm.ac, dash: '7 5' }
        ],
        tipFmt: FMT.pct1,
        aria: '18-month S-curve: planned, earned and actual cumulative progress'
      });
    });
    var spi = evm.ev.map(function (v, i) { return +(v / evm.pv[i]).toFixed(3); });
    var cpi = evm.ev.map(function (v, i) { return +(v / evm.ac[i]).toFixed(3); });
    mountChart('evm-indices', function (host) {
      lineChart(host, {
        labels: evm.labels, yMax: 1.2, yMin: 0.7, yFmt: FMT.idx, xEvery: 3, h: 300,
        refY: 1.0, refLabel: '1.00',
        series: [
          { name: 'SPI', color: C.blue, values: spi },
          { name: 'CPI', color: C.aqua, values: cpi }
        ],
        tipFmt: FMT.idx, ticks: 5,
        aria: 'SPI and CPI trend over 18 months against a 1.00 reference'
      });
    });
    var sv = evm.ev.map(function (v, i) { return +(v - evm.pv[i]).toFixed(1); });
    mountChart('evm-variance', function (host) {
      divergeBars(host, {
        labels: evm.labels, values: sv, absMax: 8, name: 'Schedule variance', h: 300,
        aria: 'Monthly schedule variance in percentage points'
      });
    });
    fillTable('evm', evm.labels.map(function (mo, i) {
      return '<tr><td>' + mo + ' ' + (i < 12 ? 'Y1' : 'Y2') + '</td>' +
        '<td class="num">' + evm.pv[i].toFixed(1) + '</td>' +
        '<td class="num">' + evm.ev[i].toFixed(1) + '</td>' +
        '<td class="num">' + evm.ac[i].toFixed(1) + '</td>' +
        '<td class="num">' + (sv[i] >= 0 ? '+' : '') + sv[i].toFixed(1) + '</td>' +
        '<td class="num">' + spi[i].toFixed(2) + '</td>' +
        '<td class="num">' + cpi[i].toFixed(2) + '</td></tr>';
    }).join(''));

    /* ---- 3 · Progress & manpower ---- */
    var pg = DATA.progress, mp = DATA.manpower;
    mountChart('prog-curve', function (host) {
      lineChart(host, {
        labels: pg.labels, yMax: 100, yFmt: FMT.pct, xEvery: 2, h: 340, endLabels: true,
        series: [
          { name: 'Planned', short: 'Plan', color: C.blue, values: pg.planned },
          { name: 'Actual', short: 'Act', color: C.aqua, values: pg.actual, area: true }
        ],
        tipFmt: FMT.pct1,
        aria: '16-week planned versus actual cumulative progress'
      });
    });
    mountChart('manpower', function (host) {
      stackBars(host, {
        labels: mp.labels, yMax: 160, yFmt: FMT.num, xEvery: 2, h: 340,
        refY: mp.peak, refLabel: 'Site capacity ' + mp.peak,
        series: [
          { name: 'Civil', color: C.blue, values: mp.civil },
          { name: 'Mechanical', color: C.aqua, values: mp.mech },
          { name: 'E&I', color: C.amber, values: mp.eni },
          { name: 'Finishes', color: C.violet, values: mp.finish }
        ],
        aria: 'Weekly manpower histogram stacked by discipline with site capacity reference'
      });
    });
    mountChart('productivity', function (host) {
      lineChart(host, {
        labels: WEEKS16, yMax: 1.2, yMin: 0.7, yFmt: FMT.idx, xEvery: 3, h: 260,
        refY: 1.0, refLabel: '1.00',
        series: [{ name: 'Productivity index', color: C.violet, values: DATA.productivity }],
        tipFmt: FMT.idx, ticks: 5,
        aria: 'Weekly productivity index against a 1.00 reference'
      });
    });
    fillTable('progress', WEEKS16.map(function (wk, i) {
      var crew = mp.civil[i] + mp.mech[i] + mp.eni[i] + mp.finish[i];
      var varr = +(pg.actual[i] - pg.planned[i]).toFixed(1);
      return '<tr><td>' + wk + '</td>' +
        '<td class="num">' + pg.planned[i].toFixed(1) + '%</td>' +
        '<td class="num">' + pg.actual[i].toFixed(1) + '%</td>' +
        '<td class="num">' + (varr >= 0 ? '+' : '') + varr.toFixed(1) + '</td>' +
        '<td class="num">' + crew + '</td>' +
        '<td class="num">' + DATA.productivity[i].toFixed(2) + '</td></tr>';
    }).join(''));

    /* ---- 4 · Cost & procurement ---- */
    var ct = DATA.cost, cf = DATA.cashflow;
    mountChart('cost-wbs', function (host) {
      groupBars(host, {
        labels: ct.wbs, yMax: 900, yFmt: function (v) { return v.toFixed(0); }, h: 360,
        series: [
          { name: 'Budget', color: C.blue, values: ct.budget },
          { name: 'Committed', color: C.aqua, values: ct.committed },
          { name: 'Actual', color: C.amber, values: ct.actual }
        ],
        tipFmt: FMT.usd,
        aria: 'Budget, committed and actual cost by WBS discipline, USD thousands'
      });
    });
    mountChart('cashflow', function (host) {
      lineChart(host, {
        labels: cf.labels, yMax: 3300, yFmt: function (v) { return (v / 1000).toFixed(1) + 'M'; }, h: 300, endLabels: true,
        series: [
          { name: 'Planned', short: 'Plan', color: C.blue, values: cf.planned },
          { name: 'Actual', short: 'Act', color: C.aqua, values: cf.actual, area: true }
        ],
        tipFmt: FMT.usd,
        aria: 'Cumulative planned versus actual cash flow over 12 months'
      });
    });
    fillTable('wbs', ct.wbs.map(function (w, i) {
      var varr = ct.budget[i] - ct.actual[i];
      return '<tr><td>' + w + '</td>' +
        '<td class="num">' + FMT.usd(ct.budget[i]) + '</td>' +
        '<td class="num">' + FMT.usd(ct.committed[i]) + '</td>' +
        '<td class="num">' + FMT.usd(ct.actual[i]) + '</td>' +
        '<td class="num">' + (varr >= 0 ? '+' : '−') + '$' + Math.abs(varr) + 'k</td></tr>';
    }).join(''));
    fillTable('procurement', DATA.procurement.map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="num">' + r[2] + '</td>' +
        '<td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + pill(r[5][0], r[5][1]) + '</td></tr>';
    }).join(''));
    fillTable('delays', DATA.delays.map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td>' +
        '<td>' + r[3] + '</td><td>' + pill(r[4][0], r[4][1]) + '</td></tr>';
    }).join(''));
  });
})();
