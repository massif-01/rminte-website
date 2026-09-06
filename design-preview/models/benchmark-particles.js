(() => {
  const canvas = document.querySelector('.mp-benchmark-particles');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: 0, y: 0, active: false };
  let stars = [];
  let width = 0;
  let height = 0;
  let visible = false;
  let frame = 0;
  let previousTime = 0;

  function draw(time, step = 0) {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(75, width * 0.14);
    for (const star of stars) {
      if (step) {
        let ax = (star.homeX - star.x) * 0.009;
        let ay = (star.homeY - star.y) * 0.009;
        if (pointer.active) {
          const dx = star.x - pointer.x;
          const dy = star.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius) {
            const force = (1 - distance / radius) ** 2 * 3.6;
            const angle = distance > 0.1 ? Math.atan2(dy, dx) : star.phase;
            ax += Math.cos(angle) * force;
            ay += Math.sin(angle) * force;
          }
        }
        star.vx = (star.vx + ax * step) * Math.pow(0.88, step);
        star.vy = (star.vy + ay * step) * Math.pow(0.88, step);
        star.x += star.vx * step;
        star.y += star.vy * step;
      }
      const twinkle = reducedMotion.matches ? 1 : 0.85 + 0.15 * Math.sin(time * 0.0007 + star.phase);
      const edge = Math.min(1, star.x / 55, (width - star.x) / 55, star.y / 35, (height - star.y) / 35);
      const opacity = star.opacity * twinkle * Math.max(0, edge);
      if (star.size > 1.2) {
        context.fillStyle = `rgba(220,230,240,${opacity * 0.075})`;
        context.beginPath();
        context.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = `rgba(232,237,242,${opacity})`;
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function tick(time) {
    const step = previousTime ? Math.min((time - previousTime) / 16.667, 2) : 1;
    previousTime = time;
    draw(time, step);
    frame = requestAnimationFrame(tick);
  }

  function updateAnimation() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    if (visible && !document.hidden && !reducedMotion.matches) {
      frame = requestAnimationFrame(tick);
    } else {
      if (reducedMotion.matches) {
        for (const star of stars) {
          star.x = star.homeX;
          star.y = star.homeY;
          star.vx = star.vy = 0;
        }
      }
      draw(0);
    }
  }

  new ResizeObserver(() => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    stars = Array.from({ length: Math.round(width * height / 430) }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        homeX: x, homeY: y, x, y, vx: 0, vy: 0,
        size: 0.35 + Math.random() ** 3 * 1.3,
        opacity: 0.22 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      };
    });
    pointer.active = false;
    draw(0);
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) pointer.active = false;
    updateAnimation();
  }).observe(canvas);

  function trackPointer(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  }
  canvas.addEventListener('pointermove', trackPointer, { passive: true });
  canvas.addEventListener('pointerdown', trackPointer, { passive: true });
  for (const type of ['pointerleave', 'pointercancel']) {
    canvas.addEventListener(type, () => { pointer.active = false; });
  }
  canvas.addEventListener('pointerup', event => {
    if (event.pointerType !== 'mouse') pointer.active = false;
  });
  reducedMotion.addEventListener('change', updateAnimation);
  document.addEventListener('visibilitychange', () => {
    pointer.active = false;
    updateAnimation();
  });
})();
