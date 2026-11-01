/* Home, "TTI" chapter: a schematic of how TTI works, drawn on a canvas and driven by the scroll position (with a little idle motion).
   Two lines race along a time axis: the heat (white, solid up to "now", pale and dashed beyond it) and the fan (sapphire), which always runs a
   fixed distance ahead. Under the heat curve a dot matrix fills in; faint streaks of air run faster as the fan speeds up. TTO, the neural network,
   TTI and EricLake are named on the figure itself and again as four pads on a route along the bottom that light up one after another.
   Everything here is schematic, not data (the figure says so). Reduced motion: one still frame, fully drawn. */
(() => {
  const figure = document.querySelector('.tti-figure');
  const canvas = figure && figure.querySelector('.tti-stage');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let WHITE, SAPPHIRE, MUTED; // r,g,b strings read from the colour tokens in refresh()
  const TAU = Math.PI * 2;
  const LEAD = 0.13; // how far (of the axis) the fan runs ahead of the heat
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (from, to, x) => { const k = clamp((x - from) / (to - from)); return k * k * (3 - 2 * k); };
  const lerp = (a, b, k) => a + (b - a) * k;

  // The words on the figure come from the page copy (assets/site-data.js, ui.tti*), in the language on screen, and the fonts from the page's own
  // stacks so that Japanese and Korean use their own faces.
  const copy = {}, fonts = {};
  const refresh = () => {
    const lang = document.documentElement.lang.slice(0, 2), ui = window.RM_SOFT.ui;
    ['Now', 'Lead', 'Temp', 'Airflow', 'Network', 'Observe', 'Predict', 'Regulate', 'Cool'].forEach((key) => { copy[key] = RM_I18N.text({ zh: ui.zh[`tti${key}`], en: ui.en[`tti${key}`] }, lang); });
    const style = getComputedStyle(document.body);
    fonts.mono = style.getPropertyValue('--font-mono').trim(); fonts.sans = style.getPropertyValue('--font-ui').trim();
    const rgb = (token) => { const hex = style.getPropertyValue(token).trim().slice(1); return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(','); };
    WHITE = rgb('--text-1'); MUTED = rgb('--text-2'); SAPPHIRE = rgb('--sapphire-300');
  };

  const wobble = (x) => Math.sin(x * 9.1) * 0.5 + Math.sin(x * 23.7 + 1.3) * 0.28 + Math.sin(x * 51.3 + 0.4) * 0.12;
  const heat = (x) => 0.22 + 0.6 * smooth(0.16, 0.48, x) - 0.36 * smooth(0.56, 0.92, x) + 0.02 * wobble(x * 5);
  const fan = (x) => 0.16 + 0.74 * smooth(0.03, 0.35, x) - 0.45 * smooth(0.43, 0.79, x) + 0.015 * wobble(x * 5 + 2);

  let width = 0, height = 0, dpr = 1, shown = reduce ? 1 : 0, last = performance.now(), frame = 0, visible = false;

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(box.width)), h = Math.max(1, Math.round(box.height));
    if (w !== width || h !== height || canvas.width !== Math.round(w * dpr)) {
      width = w; height = h;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
  };
  // 0 until the figure is well inside the window, 1 once its middle has reached the window's middle
  const progress = () => {
    if (reduce) return 1;
    const box = figure.getBoundingClientRect();
    return clamp((innerHeight * 0.9 - (box.top + box.height / 2)) / (innerHeight * 0.4));
  };

  // text is kept inside the canvas: its position is moved in if the word would run over an edge
  const put = (text, x, y, alpha, align, color) => {
    ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = `rgba(${color},${alpha})`;
    const w = ctx.measureText(text).width, left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    const shift = Math.max(2 - left, Math.min(0, width - 2 - (left + w)));
    ctx.fillText(text, x + shift, y);
  };
  const mono = (text, x, y, alpha, align = 'center', color = WHITE, size = 11, weight = 400) => {
    if (alpha <= 0.01) return;
    ctx.font = `${weight} ${size}px ${fonts.mono}`;
    put(text, x, y, alpha, align, color);
  };
  const sans = (text, x, y, alpha, align, color, size) => {
    if (alpha <= 0.01) return;
    ctx.font = `400 ${size}px ${fonts.sans}`;
    put(text, x, y, alpha, align, color);
  };
  const dot = (x, y, r, color, alpha = 1) => { ctx.fillStyle = `rgba(${color},${alpha})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const trace = (points) => { ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]); };

  // a note on the figure: a dot on the thing, a short leader and its name in mono (what each part does is on the route below)
  const note = (name, ax, ay, dx, dy, alpha) => {
    if (alpha <= 0.01) return;
    ctx.font = `500 12px ${fonts.mono}`;
    const room = ctx.measureText(name).width + 8;
    if (dx >= 0 && ax + dx + room > width - 2 && ax - dx - room >= 2) dx = -dx;     // would run off the right edge: lead to the left
    else if (dx < 0 && ax + dx - room < 2 && ax - dx + room <= width - 2) dx = -dx; // would run off the left edge: lead to the right
    const ex = ax + dx, ey = ay + dy, align = dx >= 0 ? 'left' : 'right', tx = ex + (dx >= 0 ? 8 : -8);
    ctx.strokeStyle = `rgba(${WHITE},${0.45 * alpha})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.lineTo(ex + (dx >= 0 ? 6 : -6), ey); ctx.stroke();
    dot(ax, ay, 2.2, WHITE, alpha);
    mono(name, tx, ey, alpha, align, WHITE, 12, 500);
  };

  // the dot matrix: filled in under the heat curve, brightest at the curve; paler and blue beyond "now"
  const drawDots = (p, t, g) => {
    const cell = clamp(width / 44, 12, 17), cols = Math.floor((g.right - g.left) / cell), rows = Math.floor((g.bottom - g.top) / cell);
    const x0 = g.left + ((g.right - g.left) - cols * cell) / 2 + cell / 2, y0 = g.top + cell / 2;
    const appear = smooth(0, 0.12, p), fanNow = fan(Math.min(1, g.now + LEAD));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * cell, y = y0 + r * cell, u = (x - g.left) / g.span;
      let alpha = 0.035 * appear, tint = WHITE;
      if (u <= g.now) {
        const edge = g.y(heat(u));
        if (y >= edge - cell * 0.4) alpha = (0.05 + 0.62 * Math.pow(1 - clamp((y - edge) / (g.bottom - edge + 1)), 2.2)) * appear;
      } else if (u <= g.now + 0.3) {
        const edge = g.y(heat(u)), fade = 1 - (u - g.now) / 0.3;
        if (y >= edge - cell * 0.4) { alpha = (0.03 + 0.2 * Math.pow(1 - clamp((y - edge) / (g.bottom - edge + 1)), 2.2)) * fade * appear; tint = SAPPHIRE; }
      }
      if (!reduce) alpha *= 1 + 0.12 * Math.sin(t * 1.3 + c * 0.5 + r * 0.7);
      alpha = clamp(alpha, 0, 0.8);
      dot(x, y, 1 + 1.1 * clamp(alpha * 1.6), tint, alpha);
    }
    // the air: faint streaks, quicker as the fan speeds up
    const lanes = 7;
    for (let i = 0; i < lanes; i++) {
      const y = g.top + (i + 0.7) / (lanes + 0.4) * (g.bottom - g.top);
      ctx.strokeStyle = `rgba(${SAPPHIRE},${(0.05 + 0.16 * fanNow) * smooth(0.3, 0.5, p)})`; ctx.lineWidth = 1;
      ctx.setLineDash([22, 62]); ctx.lineDashOffset = reduce ? 0 : -t * (18 + 110 * fanNow) - i * 29;
      ctx.beginPath(); ctx.moveTo(g.left, y); ctx.lineTo(g.right, y); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
  };

  const drawLines = (p, t, g) => {
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = lerp(g.top, g.bottom, i / 4);
      ctx.strokeStyle = `rgba(${WHITE},${i === 4 ? 0.16 : 0.05})`; ctx.beginPath(); ctx.moveTo(g.left, y + 0.5); ctx.lineTo(g.right, y + 0.5); ctx.stroke();
    }
    const sample = (f, from, to) => { const points = []; for (let i = 0; i <= 300; i++) { const u = lerp(from, to, i / 300); points.push([g.x(u), g.y(f(u))]); } return points; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const now = g.now, hx = g.x(now), hy = g.y(heat(now)), fu = Math.min(1, now + LEAD), fx = g.x(fu), fy = g.y(fan(fu));
    ctx.strokeStyle = `rgba(${WHITE},0.92)`; ctx.lineWidth = 1.7; trace(sample(heat, 0, now)); ctx.stroke();
    ctx.strokeStyle = `rgba(${WHITE},0.28)`; ctx.lineWidth = 1.3; ctx.setLineDash([3, 6]); trace(sample(heat, now, Math.min(1, now + 0.3))); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = `rgba(${SAPPHIRE},0.95)`; ctx.lineWidth = 1.5; trace(sample(fan, 0, fu)); ctx.stroke();
    ctx.strokeStyle = `rgba(${WHITE},0.22)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx + 0.5, g.top - 4); ctx.lineTo(hx + 0.5, g.bottom + 6); ctx.stroke();
    mono(copy.Now, hx, g.bottom + 16, smooth(0.04, 0.14, p) * 0.9);
    const pulse = reduce ? 0 : (t % 2.2) / 2.2;
    dot(hx, hy, 3.4, WHITE); dot(fx, fy, 3.4, SAPPHIRE);
    ctx.strokeStyle = `rgba(${SAPPHIRE},${(1 - pulse) * 0.5})`; ctx.beginPath(); ctx.arc(fx, fy, 3.4 + pulse * 15, 0, TAU); ctx.stroke();
    // the lead of the fan over the heat
    const lead = smooth(0.12, 0.26, p), arc = Math.min(hy, fy) - g.height * 0.06;
    ctx.strokeStyle = `rgba(${SAPPHIRE},${0.5 * lead})`; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(hx + 5, hy); ctx.quadraticCurveTo((hx + fx) / 2, arc, fx - 4, fy - 5); ctx.stroke(); ctx.setLineDash([]);
    mono(copy.Lead, (hx + fx) / 2, arc - 10, lead * 0.85, 'center', SAPPHIRE);
    mono(copy.Temp, g.left, g.top + 2, smooth(0.2, 0.35, p) * 0.75, 'left');
    mono(copy.Airflow, g.left, g.top + 18, smooth(0.2, 0.35, p) * 0.75, 'left', SAPPHIRE);
    // TTO, the neural network, TTI and EricLake, named where they act
    const midX = (hx + fx) / 2, midY = (hy + fy) / 2, atEdge = fx > g.right - g.span * 0.2;
    note('TTO', g.x(0.05), g.y(heat(0.05)), 22, -50, smooth(0.06, 0.16, p));
    note(copy.Network, hx, g.top - 2, 18, -20, smooth(0.24, 0.34, p));
    if (atEdge) note('TTI', midX, midY - 4, -26, -66, smooth(0.44, 0.54, p)); else note('TTI', midX, midY + 6, -22, 56, smooth(0.44, 0.54, p));
    if (fx > g.right - g.span * 0.16) note('EricLake', fx, fy, -20, 50, smooth(0.64, 0.74, p)); else note('EricLake', fx, fy, 20, 44, smooth(0.64, 0.74, p));
  };

  // the route along the bottom: four pads, lit one after another, with a light running along it once it is complete.
  // The labels are laid out by their real widths (in the language on screen): kept inside the canvas and apart from each other, and the type is
  // made a little smaller if all four do not fit; the pads sit over their labels.
  const routeLayout = (parts, g) => {
    let x = [], k = 1;
    for (let attempt = 0; attempt < 5; attempt++, k *= 0.9) {
      ctx.font = `500 ${12 * k}px ${fonts.mono}`; const names = parts.map(([name]) => ctx.measureText(name).width);
      ctx.font = `400 ${11 * k}px ${fonts.sans}`; const jobs = parts.map(([, job]) => ctx.measureText(job).width);
      const w = names.map((n, i) => Math.max(n, jobs[i]));
      x = [0.07, 0.37, 0.65, 0.93].map((u, i) => clamp(g.left + g.span * u, w[i] / 2 + 2, width - w[i] / 2 - 2));
      for (let i = 1; i < 4; i++) x[i] = Math.max(x[i], x[i - 1] + (w[i - 1] + w[i]) / 2 + 10);
      x[3] = Math.min(x[3], width - w[3] / 2 - 2);
      for (let i = 2; i >= 0; i--) x[i] = Math.min(x[i], x[i + 1] - (w[i] + w[i + 1]) / 2 - 10);
      if (x[0] >= w[0] / 2 + 1.5) break;
    }
    return { x, k };
  };
  const drawRoute = (p, t, g) => {
    const y = g.routeY, parts = [['TTO', copy.Observe], [copy.Network, copy.Predict], ['TTI', copy.Regulate], ['EricLake', copy.Cool]], on = [0.06, 0.26, 0.46, 0.66];
    const { x: pads, k } = routeLayout(parts, g);
    for (let i = 0; i < 3; i++) {
      const lit = smooth(on[i] + 0.06, on[i + 1], p);
      ctx.strokeStyle = `rgba(${WHITE},0.13)`; ctx.lineWidth = 1; ctx.setLineDash([2, 5]);
      ctx.beginPath(); ctx.moveTo(pads[i] + 9, y); ctx.lineTo(pads[i + 1] - 9, y); ctx.stroke(); ctx.setLineDash([]);
      if (lit > 0) { ctx.strokeStyle = `rgba(${SAPPHIRE},${0.6 * lit})`; ctx.beginPath(); ctx.moveTo(pads[i] + 9, y); ctx.lineTo(lerp(pads[i] + 9, pads[i + 1] - 9, lit), y); ctx.stroke(); }
    }
    parts.forEach(([name, job], i) => {
      const alpha = smooth(on[i], on[i] + 0.08, p), x = pads[i];
      dot(x, y, 6, '11,13,16');
      ctx.strokeStyle = `rgba(${alpha > 0.5 ? SAPPHIRE : WHITE},${alpha > 0.5 ? 0.95 : 0.28})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.stroke();
      if (alpha > 0) dot(x, y, 2.2, WHITE, alpha);
      mono(name, x, y + 22, 0.35 + 0.65 * alpha, 'center', WHITE, 12 * k, 500);
      sans(job, x, y + 38, 0.3 + 0.55 * alpha, 'center', MUTED, 11 * k);
    });
    if (p > 0.7 && !reduce) {
      const x = lerp(pads[0], pads[3], (t % 4) / 4), tail = ctx.createLinearGradient(x - 46, 0, x + 6, 0);
      tail.addColorStop(0, `rgba(${SAPPHIRE},0)`); tail.addColorStop(1, `rgba(${SAPPHIRE},0.9)`);
      ctx.strokeStyle = tail; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Math.max(pads[0], x - 46), y); ctx.lineTo(x, y); ctx.stroke();
      dot(x, y, 2.6, SAPPHIRE);
    }
  };

  const draw = (now) => {
    if (!copy.Now) refresh();
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    shown += (progress() - shown) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
    resize();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    const pad = width * 0.02;
    const g = { height, left: pad, right: width - pad, span: width - 2 * pad, top: Math.max(height * 0.09, 46), bottom: height * 0.69, routeY: height * 0.84 };
    g.x = (u) => g.left + g.span * u; g.y = (v) => g.bottom - v * (g.bottom - g.top);
    g.now = smooth(0, 0.92, shown) * (1 - LEAD) * 0.98 + 0.02; // where "now" is on the axis
    const t = reduce ? 3 : now / 1000;
    drawDots(shown, t, g); drawLines(shown, t, g); drawRoute(shown, t, g);
  };
  const tick = (now) => { frame = 0; if (!visible) return; draw(now); if (!reduce) frame = requestAnimationFrame(tick); };
  const wake = () => { if (visible && !frame) frame = requestAnimationFrame(tick); };

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { last = performance.now(); wake(); } }, { rootMargin: '120px' }).observe(figure);
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', wake);
  new ResizeObserver(wake).observe(figure);
  if (document.fonts) document.fonts.ready.then(() => { refresh(); wake(); });
  new MutationObserver(() => { refresh(); wake(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
