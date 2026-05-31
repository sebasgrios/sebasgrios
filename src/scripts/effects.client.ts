const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  const targets = document.querySelectorAll('.reveal:not(.in)');
  if (REDUCED_MOTION) {
    for (const el of targets) el.classList.add('in');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  );
  for (const el of targets) io.observe(el);
}

function initGlassSpecular() {
  if (REDUCED_MOTION) return;
  document.addEventListener('mousemove', (e) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>('.glass.interactive');
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    target.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}

function initParallax() {
  if (REDUCED_MOTION) return;
  const targets = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (targets.length === 0) return;
  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  window.addEventListener('mousemove', (e) => {
    lastX = (e.clientX / window.innerWidth - 0.5) * 14;
    lastY = (e.clientY / window.innerHeight - 0.5) * 14;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      for (const el of targets) {
        el.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
      }
      raf = 0;
    });
  });
}

function init() {
  initReveal();
  initGlassSpecular();
  initParallax();
}

init();
document.addEventListener('astro:after-swap', init);
