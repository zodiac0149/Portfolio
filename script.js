/* ═══════════════════════════════════════════════════════
   Portfolio — script.js  (Zodiac · Akshay)
   Features:
   • Splash / loading screen
   • Custom glowing cursor
   • Scroll progress bar
   • Zodiac name letter-drop animation
   • Particle canvas (hero bg)
   • Hero role rotator
   • Navbar scroll + active link
   • Scroll-reveal (IntersectionObserver)
   • Skill bar fill animation
   • Counter animation (about stats)
   • Skills tab switcher
   • Project filter
   • Testimonial slider (auto + nav)
   • Magnetic buttons
   • Contact form (EmailJS / simulated)
   • Back-to-top
═══════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   0. EmailJS INIT
   Replace 'YOUR_PUBLIC_KEY' with your key
   from https://www.emailjs.com/
────────────────────────────────────────── */
if (typeof emailjs !== 'undefined') {
  emailjs.init('YOUR_PUBLIC_KEY');
}

/* ──────────────────────────────────────────
   1. SPLASH SCREEN
────────────────────────────────────────── */
const splash = document.getElementById('splash');
const splashBar = document.getElementById('splash-bar');
let progress = 0;
const splashTick = setInterval(() => {
  progress += Math.random() * 18 + 6;
  if (progress >= 100) {
    progress = 100;
    clearInterval(splashTick);
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.style.overflow = 'auto';
      // Trigger name animation after splash
      buildZodiacName();
    }, 300);
  }
  splashBar.style.width = progress + '%';
}, 80);

document.body.style.overflow = 'hidden'; // freeze scroll during splash

/* ──────────────────────────────────────────
   2. ZODIAC NAME ANIMATION
────────────────────────────────────────── */
function buildZodiacName() {
  const container = document.getElementById('name-zodiac');
  if (!container) return;
  const word = 'Zodiac';
  container.innerHTML = '';

  [...word].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.style.setProperty('--i', i);
    span.textContent = ch;

    // Randomise each letter's wave speed so they drift out of sync naturally
    const waveDur = (2.2 + Math.random() * 1.8).toFixed(2) + 's';
    const dropDelay = (0.5 + i * 0.09).toFixed(2) + 's';
    const waveDelay = (1.6 + i * 0.22).toFixed(2) + 's';
    span.style.animationDuration = `0.65s, ${waveDur}`;
    span.style.animationDelay = `${dropDelay}, ${waveDelay}`;

    // Hover: jump & glow — JS handles restore so it's smooth
    span.addEventListener('mouseenter', function () {
      const dir = i % 2 === 0 ? -10 : 10;
      this.style.transition = 'transform 0.18s cubic-bezier(.175,.885,.32,1.275), filter 0.18s';
      this.style.transform = `translateY(-22px) scale(1.45) rotate(${dir}deg)`;
      this.style.filter = 'brightness(1.7) drop-shadow(0 0 18px rgba(108,99,255,0.95))';
      this.style.animationPlayState = 'running, paused';
    });
    span.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.filter = '';
      this.style.transition = 'transform 0.4s cubic-bezier(.175,.885,.32,1.275), filter 0.4s';
      this.style.animationPlayState = '';
      setTimeout(() => { this.style.transition = ''; }, 420);
    });

    container.appendChild(span);
  });
}

/* ──────────────────────────────────────────
   3. CUSTOM CURSOR
────────────────────────────────────────── */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor "click" shrink
document.addEventListener('mousedown', () => {
  cursorDot.style.transform = 'translate(-50%,-50%) scale(0.6)';
  cursorRing.style.transform = 'translate(-50%,-50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
  cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '0.6';
});

/* ──────────────────────────────────────────
   4. SCROLL PROGRESS BAR
────────────────────────────────────────── */
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

/* ──────────────────────────────────────────
   5. THEME TOGGLE
────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ──────────────────────────────────────────
   6. HAMBURGER
────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ──────────────────────────────────────────
   7. NAVBAR SCROLL + ACTIVE LINK
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const backTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  backTop.classList.toggle('visible', window.scrollY > 400);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ──────────────────────────────────────────
   8. HERO ROLE ROTATOR
────────────────────────────────────────── */
const roles = document.querySelectorAll('.role');
let roleIdx = 0;

function rotateRoles() {
  roles[roleIdx].classList.remove('active');
  roles[roleIdx].classList.add('exit');
  setTimeout(() => roles[roleIdx].classList.remove('exit'), 400);
  roleIdx = (roleIdx + 1) % roles.length;
  roles[roleIdx].classList.add('active');
}
setInterval(rotateRoles, 2800);

/* ──────────────────────────────────────────
   9. PARTICLE CANVAS
────────────────────────────────────────── */
(function particles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);
  let W, H, pts;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.a = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -5) this.x = W + 5;
      if (this.x > W + 5) this.x = -5;
      if (this.y < -5) this.y = H + 5;
      if (this.y > H + 5) this.y = -5;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.a})`;
      ctx.fill();
    }
  }

  function init() { pts = Array.from({ length: 85 }, () => new P()); }

  function connect() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - d / 110) * 0.12})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }
  init(); loop();
})();

/* ──────────────────────────────────────────
   10. SCROLL REVEAL
────────────────────────────────────────── */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Skill fills
        entry.target.querySelectorAll('.skill-fill').forEach(f => f.style.width = f.dataset.width + '%');
        // Counters
        entry.target.querySelectorAll('.stat-number').forEach(el => animateCount(el));
      }, delay);
      revealObs.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ──────────────────────────────────────────
   11. COUNTER ANIMATION
────────────────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1600;
  const step = target / (dur / 16);
  let cur = 0;
  const tick = () => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur < target) requestAnimationFrame(tick);
  };
  tick();
}

/* ──────────────────────────────────────────
   12. SKILLS TABS
────────────────────────────────────────── */
function animatePanel(panel) {
  panel.querySelectorAll('.skill-fill').forEach(f => {
    f.style.width = '0%';
    setTimeout(() => f.style.width = f.dataset.width + '%', 80);
  });
  panel.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(22px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'none';
    }, 60 * i);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`tab-${btn.dataset.tab}`);
    panel.classList.add('active');
    animatePanel(panel);
  });
});

// Trigger initial panel on scroll
const skillsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animatePanel(document.querySelector('.tab-panel.active'));
    skillsObs.disconnect();
  }
}, { threshold: 0.3 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObs.observe(skillsSection);

/* ──────────────────────────────────────────
   13. PROJECT FILTER
────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
      const matches = filter === 'all' || tags.includes(filter);

      if (matches) {
        card.style.display = '';
        card.style.animation = 'none';
        void card.offsetWidth; // reflow
        card.style.animation = 'filterIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards';
      } else {
        card.style.animation = 'filterOut 0.3s ease forwards';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

// Inject filter keyframes
const filterStyle = document.createElement('style');
filterStyle.textContent = `
  @keyframes filterIn  { from { opacity:0; transform:scale(0.88) translateY(16px); } to { opacity:1; transform:none; } }
  @keyframes filterOut { from { opacity:1; transform:none; } to { opacity:0; transform:scale(0.88) translateY(-10px); } }
`;
document.head.appendChild(filterStyle);




/* ──────────────────────────────────────────
   15. MAGNETIC BUTTONS
────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = '';
    setTimeout(() => el.style.transition = '', 500);
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.1s ease';
  });
});

/* ──────────────────────────────────────────
   16. PROJECT CARD 3D TILT
────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const tiltX = dy * 5;
    const tiltY = -dx * 5;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.3s, border-color 0.3s';
    card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s, border-color 0.3s';
    card.style.transform = '';
  });
});

/* ──────────────────────────────────────────
   17. CONTACT FORM
   Using EmailJS — or simulated fallback
────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      if (typeof emailjs !== 'undefined' && emailjs._userID) {
        // Real EmailJS send
        // Replace SERVICE_ID and TEMPLATE_ID from your EmailJS dashboard
        await emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm);
        showStatus('success', '✅ Message sent! I\'ll respond soon.');
      } else {
        // Simulated for demo
        await new Promise(r => setTimeout(r, 1400));
        showStatus('success', '✅ Message received! Talk soon. (EmailJS not configured yet)');
      }
      contactForm.reset();
    } catch (err) {
      showStatus('error', '❌ Something went wrong. Please try again!');
    } finally {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }
  });
}

function showStatus(type, msg) {
  formStatus.className = 'form-status ' + type;
  formStatus.textContent = msg;
  setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 6000);
}

/* ──────────────────────────────────────────
   18. DEV CONSOLE GREETING
────────────────────────────────────────── */
console.log('%c⚡ Zodiac · Akshay — Portfolio loaded!', 'color:#6c63ff;font-size:1.1rem;font-weight:bold');
console.log('%cBuilt with ❤️  using vanilla HTML/CSS/JS', 'color:#a0a0c0;font-size:0.85rem');
