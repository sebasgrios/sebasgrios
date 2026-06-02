const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
  if (REDUCED_MOTION || !FINE_POINTER) return;
  document.addEventListener('mousemove', (e) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>('.glass.interactive');
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    target.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}

function initParallax() {
  if (REDUCED_MOTION || !FINE_POINTER) return;
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

let spyHandler: (() => void) | null = null;

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav a[href*="#"]'));
  const linksByHash = new Map<string, HTMLAnchorElement[]>();
  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href) continue;
    const hash = new URL(href, location.href).hash;
    if (!hash || hash === '#top') continue;
    const list = linksByHash.get(hash) ?? [];
    list.push(link);
    linksByHash.set(hash, list);
  }

  const sections = [...linksByHash.keys()]
    .map((hash) => document.getElementById(hash.slice(1)))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  let current: string | null = '';
  const setActive = (activeHash: string | null) => {
    if (activeHash === current) return;
    current = activeHash;
    for (const [hash, list] of linksByHash) {
      for (const link of list) {
        if (hash === activeHash) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    }
  };

  let raf = 0;
  const update = () => {
    raf = 0;
    const line = window.innerHeight * 0.3;
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    let active: HTMLElement | null = atBottom ? (sections[sections.length - 1] ?? null) : null;
    if (!atBottom) {
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section;
        else break;
      }
    }
    setActive(active ? `#${active.id}` : null);
  };
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  if (spyHandler) {
    window.removeEventListener('scroll', spyHandler);
    window.removeEventListener('resize', spyHandler);
  }
  spyHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function init() {
  initReveal();
  initGlassSpecular();
  initParallax();
  initScrollSpy();
}

init();
document.addEventListener('astro:after-swap', init);
