/* ---------- Preloader ---------- */
const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloaderCount');
const PRELOAD_MS = 900;
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

/* ---------- Hero entrance ---------- */
function startHeroAnimations() {
  document.querySelectorAll('.split-in').forEach((el, i) => {
    el.style.setProperty('--d', `${i * 90}ms`);
    el.classList.add('play');
  });
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
      const value = eased * target;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
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

/* ---------- Cursor spotlight ---------- */
const spotlight = document.getElementById('spotlight');

/* ---------- Hero mockup 3D tilt ---------- */
const heroMockup = document.getElementById('heroMockup');

/* ---------- Parallax blobs ---------- */
const blobs = document.querySelectorAll('.blob');
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;

  if (spotlight) {
    spotlight.style.setProperty('--sx', `${e.clientX}px`);
    spotlight.style.setProperty('--sy', `${e.clientY}px`);
  }

  if (heroMockup) {
    const rect = heroMockup.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    heroMockup.style.transform = `rotateX(${-dy * 10}deg) rotateY(${dx * 14}deg)`;
  }
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

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
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
    el.style.transform = `perspective(700px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ---------- Contact form → Telegram ---------- */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const TG_TOKEN = '8798890094:AAEWwauRD0tDjrpKwlZp0Yv-yNLssd55v5A';
const TG_CHAT  = '755194552';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name    = data.get('name')    || '—';
    const company = data.get('company') || '—';
    const phone   = data.get('phone')   || '—';
    const email   = data.get('email')   || '—';
    const message = data.get('message') || '—';

    const text = `📬 <b>Новая заявка с сайта</b>\n\n👤 <b>Имя:</b> ${name}\n🏢 <b>Бизнес:</b> ${company}\n📞 <b>Телефон:</b> ${phone}\n✉️ <b>Email:</b> ${email}\n📝 <b>Проект:</b> ${message}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' }),
      });
      if (!res.ok) throw new Error();
      formNote.style.color = '';
      formNote.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      contactForm.reset();
    } catch {
      formNote.style.color = '#ff4d4d';
      formNote.textContent = 'Ошибка отправки. Напишите напрямую в Telegram или на Email.';
    }
  });
}
