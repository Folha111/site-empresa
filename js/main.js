/* ======================
   PARTICLE CANVAS
====================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = -9999, mouseY = -9999;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(randomY = false) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.maxAlpha = this.alpha;
    this.color = Math.random() > 0.5 ? '118, 196, 24' : '160, 220, 80';
    this.life = 1;
    this.decay = Math.random() * 0.002 + 0.001;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;

    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      this.x += (dx / dist) * force * 1.5;
      this.y += (dy / dist) * force * 1.5;
    }

    if (this.life <= 0 || this.x < -10 || this.x > canvas.width + 10 || this.y < -10) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha * this.life})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(118, 196, 24, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

document.getElementById('hero').addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
document.getElementById('hero').addEventListener('mouseleave', () => {
  mouseX = -9999;
  mouseY = -9999;
});

/* ======================
   TYPED TEXT
====================== */
const typedEl = document.getElementById('typedText');
const words = ['Precisão', 'Excelência', 'Qualidade', 'Confiança', 'Inovação'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const word = words[wordIndex];
  if (isDeleting) {
    typedEl.textContent = word.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = word.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 70 : 110;
  if (!isDeleting && charIndex === word.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
setTimeout(type, 1000);

/* ======================
   NAVBAR SCROLL
====================== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 500);

  // Active link
  const sections = ['hero', 'sobre', 'segmentos', 'capacidade', 'clientes', 'contato'];
  const offset = y + 120;
  sections.forEach(id => {
    const section = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!section || !link) return;
    if (offset >= section.offsetTop && offset < section.offsetTop + section.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ======================
   HAMBURGER MENU
====================== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ======================
   SCROLL REVEAL
====================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('revealed'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Fallback: garante que todos ficam visíveis após 1.5s independente do scroll
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    el.classList.add('revealed');
  });
}, 1500);

/* ======================
   COUNTER ANIMATION
====================== */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ======================
   SMOOTH SCROLL
====================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ======================
   CONTACT FORM
====================== */
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('.btn-submit');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const originalHTML = submitBtn.innerHTML;

  submitBtn.classList.add('loading');
  submitBtn.innerHTML = `
    <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
    Enviando...
  `;
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Mensagem Enviada!
    `;
    contactForm.reset();
    submitBtn.disabled = false;

    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.innerHTML = originalHTML;
    }, 3500);
  }, 1600);
});

/* ======================
   HERO PARALLAX
====================== */
const heroContent = document.querySelector('.hero-content');
const heroSection = document.getElementById('hero');

heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
  if (heroContent) {
    heroContent.style.transform = `translate(${x * 12}px, ${y * 6}px)`;
  }
});

heroSection.addEventListener('mouseleave', () => {
  if (heroContent) {
    heroContent.style.transition = 'transform 0.6s ease';
    heroContent.style.transform = 'translate(0, 0)';
    setTimeout(() => { heroContent.style.transition = 'transform 0.1s ease'; }, 600);
  }
});


/* ======================
   SEGMENT CARDS TILT
====================== */
document.querySelectorAll('.segment-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s ease';
  });
});
