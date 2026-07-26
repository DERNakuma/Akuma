import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function initScrollEngine() {
  // ── 1. Lenis smooth scroll ──────────────────────────────────────────────
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const lenis = new Lenis({
    smooth: !isTouchDevice,   // native touch scroll on mobile
    lerp: 0.08,               // NOTE: Lenis lerp is 0–1 where lower = smoother/heavier
    wheelMultiplier: 1,
    infinite: false,
  });

  lenisInstance = lenis;

  // ── 2. Sync Lenis → GSAP ticker (critical for ScrollTrigger accuracy) ──
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ── 3. Intercept anchor clicks → Lenis scrollTo ────────────────────────
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });

  // ── 4. SplitText scroll-triggered reveals ─────────────────────────────
  // Wait a tick so React has finished painting the DOM
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initTextAnimations();
    });
  });

  return lenis;
}

function initTextAnimations() {
  // Selectors for headings/pull-quotes to animate
  const targets = [
    '.hero-name',
    '.about-title',
    '.section-title',
    '.cf-headline',
  ];

  targets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      animateHeading(el);
    });
  });
}

function animateHeading(el) {
  // SplitText splits the element into individual char spans
  const split = new SplitText(el, { type: 'chars,words' });
  const chars = split.chars;

  // Start state: slightly muted / shifted down
  gsap.set(chars, { opacity: 0.08, y: 18, rotateX: -20 });

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.028,
    scrollTrigger: {
      trigger: el,
      start: 'top 82%',   // fires when element is 82% down the viewport
      end: 'top 40%',
      toggleActions: 'play none none none',
    },
  });
}
