/* ---------- Preloader ---------- */
const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloaderCount');
const PRELOAD_MS = 1100;
const preloadStart = performance.now();

function preloadTick(now) {
  const t = Math.min(1, (now - preloadStart) / PRELOAD_MS);
  preloaderCount.textContent = Math.round(t * 100);
  if (t < 1) {
    requestAnimationFrame(preloadTick);
  } else {
    preloader.classList.add('is-done');
    startHeroAnimations();
  }
}
requestAnimationFrame(preloadTick);

/* ---------- Hero entrance (letters + fades) ---------- */
function startHeroAnimations() {
  const heroName = document.getElementById('heroName');
  const text = heroName.textContent.trim();
  heroName.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    span.className = ch === ' ' ? 'letter space' : 'letter';
    span.style.setProperty('--d', `${i * 35}ms`);
    heroName.appendChild(span);
  });
  heroName.classList.add('play');

  document.querySelectorAll('.split-in').forEach((el, i) => {
    el.style.setProperty('--d', `${200 + i * 90}ms`);
    el.classList.add('play');
  });

  typeRoles();
}

/* ---------- Typing effect for hero role line ---------- */
const roles = [
  'Бизнес-аналитик',
  'AI-автоматизатор',
  'Партнёр по продукту',
  'Founder-в-душе'
];
const typedEl = document.getElementById('typed');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRoles() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRoles, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRoles, deleting ? 40 : 70);
}

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- Stat counters ---------- */
const statNums = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statNums.forEach((el) => statObserver.observe(el));

/* ---------- Nav background + mobile menu ---------- */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---------- Parallax blobs ---------- */
const blobs = document.querySelectorAll('.blob');
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

function parallaxLoop() {
  const scrollY = window.scrollY;
  blobs.forEach((blob) => {
    const depth = parseFloat(blob.dataset.depth) || 0.2;
    const x = mouseX * depth * 120;
    const y = mouseY * depth * 120 - scrollY * depth * 0.3;
    blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  requestAnimationFrame(parallaxLoop);
}
requestAnimationFrame(parallaxLoop);

/* ---------- Custom cursor ---------- */
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (isFinePointer) {
  document.body.classList.add('has-cursor');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
  });

  function ringLoop() {
    ringX += (dotX - ringX) * 0.18;
    ringY += (dotY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(ringLoop);
  }
  requestAnimationFrame(ringLoop);

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .tilt')) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .tilt')) ring.classList.remove('is-active');
  });
}

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

/* ---------- Tilt cards ---------- */
document.querySelectorAll('.tilt').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});
