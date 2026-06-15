/**
 * Reveal-on-scroll. The base state is VISIBLE (see base.css); the hidden start
 * state is only armed (html.anim-on) once we confirm the transition clock
 * actually advances — so export / PDF / no-JS / frozen-clock contexts always
 * show the full content. Ported from the prototype's useReveal (HANDOFF §7.5).
 */
const root = document.documentElement;
const reveal = (el: Element) => el.classList.add('in');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (const el of document.querySelectorAll('.reveal')) reveal(el);
} else {
  root.classList.add('anim-on');

  // Probe: if the clock is frozen (capture harness), disarm so all is visible.
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;transition:opacity 40ms linear;pointer-events:none';
  document.body.appendChild(probe);
  void probe.offsetWidth;
  probe.style.opacity = '1';
  setTimeout(() => {
    if (Number.parseFloat(getComputedStyle(probe).opacity) < 0.5) root.classList.remove('anim-on');
    probe.remove();
  }, 180);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  for (const el of document.querySelectorAll('.reveal:not(.in)')) io.observe(el);

  // Safety net: anything already in view on load reveals immediately.
  setTimeout(() => {
    for (const el of document.querySelectorAll('.reveal:not(.in)')) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) reveal(el);
    }
  }, 120);
}
