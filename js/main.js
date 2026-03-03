/* ======================
   PARTICLE CANVAS
====================== */
const canvas = document.getElementById('particleCanvas');

if (canvas) {
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

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });
  }
}

/* ======================
   TYPED TEXT
====================== */
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const words = (localStorage.getItem('lang') === 'en' ? ['Precision', 'Excellence', 'Quality', 'Trust', 'Innovation'] : ['Precisão', 'Excelência', 'Qualidade', 'Confiança', 'Inovação']);
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
}

/* ======================
   NAVBAR SCROLL
====================== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  if (navbar) navbar.classList.toggle('scrolled', y > 60);
  if (backToTop) backToTop.classList.toggle('visible', y > 500);

  // Active link (only on index.html anchor nav)
  const sections = ['hero', 'sobre', 'processo', 'segmentos', 'capacidade', 'clientes', 'contato'];
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

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ======================
   HAMBURGER MENU
====================== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
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

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

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
if (contactForm) {
  const submitBtn = contactForm.querySelector('.btn-submit');

  contactForm.addEventListener('submit', async (e) => {
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

    const formData = {
      name: contactForm.name.value.trim(),
      company: contactForm.company.value.trim(),
      email: contactForm.email.value.trim(),
      phone: contactForm.phone.value.trim(),
      segment: contactForm.segment.value,
      message: contactForm.message.value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Erro desconhecido');

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
    } catch (err) {
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('error');
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        Erro ao enviar. Tente novamente.
      `;
      submitBtn.disabled = false;

      setTimeout(() => {
        submitBtn.classList.remove('error');
        submitBtn.innerHTML = originalHTML;
      }, 4000);
    }
  });
}

/* ======================
   HERO PARALLAX
====================== */
const heroContent = document.querySelector('.hero-content');
const heroSectionEl = document.getElementById('hero');

if (heroSectionEl && heroContent) {
  heroSectionEl.addEventListener('mousemove', (e) => {
    const rect = heroSectionEl.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    heroContent.style.transform = `translate(${x * 12}px, ${y * 6}px)`;
  });

  heroSectionEl.addEventListener('mouseleave', () => {
    heroContent.style.transition = 'transform 0.6s ease';
    heroContent.style.transform = 'translate(0, 0)';
    setTimeout(() => { heroContent.style.transition = 'transform 0.1s ease'; }, 600);
  });
}

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

/* ======================
   LANGUAGE SWITCHER
====================== */
const i18n = {
  pt: {
    'nav.home': 'Início', 'nav.about': 'Sobre', 'nav.segments': 'Segmentos',
    'nav.capacity': 'Capacidade', 'nav.quality': 'Qualidade', 'nav.clients': 'Clientes', 'nav.contact': 'Contato',

    'hero.badge': 'Fundada em 2011 · São Leopoldo/RS',
    'hero.title1': 'Usinagem de', 'hero.subtitle': 'Especialistas em usinagem de precisão de metais ferrosos, não-ferrosos e polímeros. 2.300m² de capacidade produtiva a serviço da sua indústria.',
    'hero.cta1': 'Solicitar Orçamento', 'hero.cta2': 'Conhecer a Empresa',
    'hero.stat1': 'Anos de Experiência', 'hero.stat2': 'Área Produtiva', 'hero.stat3': 'Setores Atendidos',

    'about.tag': 'Sobre Nós', 'about.title': 'Excelência em cada', 'about.title.accent': 'detalhe',
    'about.desc': 'Desde 2011, a APO entrega precisão e qualidade para os principais players da indústria metal-mecânica brasileira.',
    'about.p1': 'A <strong>APO</strong> nasceu com o propósito de oferecer soluções completas em usinagem de precisão, atendendo com excelência as mais rigorosas especificações técnicas do mercado metal-mecânico.',
    'about.p2': 'Operando em uma moderna instalação de <strong>2.300m² de área coberta</strong> em São Leopoldo/RS, contamos com tecnologia CNC de última geração e uma equipe altamente qualificada.',
    'about.p3': 'Nossa filosofia é simples: <strong>qualidade plena e satisfação total do cliente</strong> em cada peça produzida.',
    'about.p4': 'Operamos com cultura de <strong>Lean Manufacturing</strong> — eliminando desperdícios e maximizando eficiência em cada etapa do processo produtivo, do setup à entrega.',
    'about.v1.title': 'Qualidade', 'about.v1.desc': 'ISO certificada com controle rigoroso em cada etapa',
    'about.v2.title': 'Precisão', 'about.v2.desc': 'Tolerâncias mínimas com tecnologia CNC avançada',
    'about.v3.title': 'Compromisso', 'about.v3.desc': 'Parcerias duradouras com os maiores nomes da indústria',
    'about.v4.title': 'Agilidade', 'about.v4.desc': 'Prazos cumpridos sem abrir mão da qualidade',
    'about.s1': 'Ano de Fundação', 'about.s2': 'Área Coberta', 'about.s3': 'Anos no Mercado', 'about.s4': 'Segmentos Atendidos', 'about.s5': 'Certificada',

    'video.tag': 'A APO em Ação', 'video.title': 'Conheça nossa', 'video.title.accent': 'estrutura',
    'video.desc': 'Veja de perto nossa instalação e como transformamos matéria-prima em peças de alta precisão para os maiores nomes da indústria.',

    'process.tag': 'Como Trabalhamos', 'process.title': 'Nosso', 'process.title.accent': 'processo',
    'process.desc': 'Da especificação técnica à entrega, cada etapa é controlada com rigor para garantir peças que superam as expectativas do cliente.',
    'process.s1.title': 'Análise Técnica', 'process.s1.desc': 'Recebemos o desenho técnico ou modelo 3D e revisamos todas as especificações, tolerâncias e materiais requeridos.',
    'process.s2.title': 'Programação CNC', 'process.s2.desc': 'Programadores especialistas desenvolvem o código CNC otimizado para máxima precisão e eficiência via softwares CAM.',
    'process.s3.title': 'Usinagem CNC', 'process.s3.desc': 'Produção em nosso parque de máquinas com monitoramento em tempo real via MES Syneco para máxima eficiência operacional.',
    'process.s4.title': 'Controle de Qualidade', 'process.s4.desc': 'Inspeção dimensional 100% em laboratório de metrologia com CMM e instrumentos calibrados. Nenhuma peça sai sem aprovação.',
    'process.s5.title': 'Expedição', 'process.s5.desc': 'Embalagem adequada e documentação técnica completa, com rastreabilidade total do lote. Entrega no prazo combinado.',

    'seg.tag': 'Setores de Atuação', 'seg.title': 'Segmentos que', 'seg.title.accent': 'atendemos',
    'seg.desc': 'Nossa expertise abrange os mais exigentes setores da indústria, com soluções customizadas para cada aplicação.',

    'cap.tag': 'Parque de Máquinas', 'cap.title': 'Tecnologia de', 'cap.title.accent': 'ponta',
    'cap.desc': 'Investimos continuamente em equipamentos de última geração para garantir produtividade, precisão e competitividade.',

    'clients.tag': 'Nossos Clientes', 'clients.title': 'Confiança de grandes', 'clients.title.accent': 'marcas',
    'clients.desc': 'Somos parceiros de confiança das maiores empresas da indústria nacional, entregando qualidade que faz a diferença.',

    'contact.tag': 'Fale Conosco', 'contact.title': 'Vamos trabalhar', 'contact.title.accent': 'juntos',
    'contact.desc': 'Entre em contato e solicite um orçamento personalizado para a sua necessidade.',
    'contact.address.title': 'Endereço', 'contact.address.value': 'Av. São Borja, 3001<br>Fazenda São Borja<br>São Leopoldo/RS', 'contact.address.hint': 'Ver no Google Maps →',

    'cert.title': 'Empresa Certificada ISO', 'cert.download': 'Baixar Certificado ISO (PDF)',
    'cert.desc': 'A APO opera com sistema de gestão da qualidade certificado, assegurando processos padronizados, rastreabilidade de lotes, controle dimensional sistemático e melhoria contínua em todos os aspectos da produção. Nossa certificação é auditada regularmente e reflete o comprometimento da liderança e de toda a equipe com a excelência.',
  },
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.segments': 'Segments',
    'nav.capacity': 'Capacity', 'nav.quality': 'Quality', 'nav.clients': 'Clients', 'nav.contact': 'Contact',

    'hero.badge': 'Founded in 2011 · São Leopoldo/RS',
    'hero.title1': 'Machining with', 'hero.subtitle': 'Specialists in precision machining of ferrous metals, non-ferrous metals, and polymers. 2,300m² of productive capacity at the service of your industry.',
    'hero.cta1': 'Request a Quote', 'hero.cta2': 'Learn About Us',
    'hero.stat1': 'Years of Experience', 'hero.stat2': 'Production Area', 'hero.stat3': 'Sectors Served',

    'about.tag': 'About Us', 'about.title': 'Excellence in every', 'about.title.accent': 'detail',
    'about.desc': 'Since 2011, APO has delivered precision and quality to the leading players in the Brazilian metal-mechanical industry.',
    'about.p1': '<strong>APO</strong> was founded with the purpose of offering complete solutions in precision machining, meeting with excellence the most rigorous technical specifications of the metal-mechanical market.',
    'about.p2': 'Operating from a modern <strong>2,300m² covered facility</strong> in São Leopoldo/RS, we rely on state-of-the-art CNC technology and a highly qualified team.',
    'about.p3': 'Our philosophy is simple: <strong>full quality and total customer satisfaction</strong> in every part produced.',
    'about.p4': 'We operate with a <strong>Lean Manufacturing</strong> culture — eliminating waste and maximizing efficiency at every stage of the production process, from setup to delivery.',
    'about.v1.title': 'Quality', 'about.v1.desc': 'ISO certified with rigorous control at every step',
    'about.v2.title': 'Precision', 'about.v2.desc': 'Minimal tolerances with advanced CNC technology',
    'about.v3.title': 'Commitment', 'about.v3.desc': 'Long-term partnerships with the biggest names in industry',
    'about.v4.title': 'Agility', 'about.v4.desc': 'Deadlines met without compromising quality',
    'about.s1': 'Year Founded', 'about.s2': 'Covered Area', 'about.s3': 'Years in Business', 'about.s4': 'Segments Served', 'about.s5': 'Certified',

    'video.tag': 'APO in Action', 'video.title': 'Discover our', 'video.title.accent': 'facility',
    'video.desc': 'Take a close look at our facility and how we transform raw material into high-precision parts for industry leaders.',

    'process.tag': 'How We Work', 'process.title': 'Our', 'process.title.accent': 'process',
    'process.desc': 'From technical specification to delivery, every step is rigorously controlled to ensure parts that exceed customer expectations.',
    'process.s1.title': 'Technical Analysis', 'process.s1.desc': 'We receive the technical drawing or 3D model and review all specifications, tolerances, and required materials.',
    'process.s2.title': 'CNC Programming', 'process.s2.desc': 'Expert programmers develop optimized CNC code for maximum precision and efficiency using CAM software.',
    'process.s3.title': 'CNC Machining', 'process.s3.desc': 'Production in our machine park with real-time monitoring via MES Syneco for maximum operational efficiency.',
    'process.s4.title': 'Quality Control', 'process.s4.desc': '100% dimensional inspection in our metrology laboratory with CMM and calibrated instruments. No part leaves without approval.',
    'process.s5.title': 'Shipping', 'process.s5.desc': 'Appropriate packaging and complete technical documentation, with full lot traceability. Delivery on schedule.',

    'seg.tag': 'Industry Sectors', 'seg.title': 'Segments we', 'seg.title.accent': 'serve',
    'seg.desc': 'Our expertise spans the most demanding industrial sectors, with customized solutions for each application.',

    'cap.tag': 'Machine Park', 'cap.title': 'Cutting-edge', 'cap.title.accent': 'technology',
    'cap.desc': 'We continuously invest in state-of-the-art equipment to ensure productivity, precision, and competitiveness.',

    'clients.tag': 'Our Clients', 'clients.title': 'Trusted by major', 'clients.title.accent': 'brands',
    'clients.desc': 'We are trusted partners of the largest companies in the national industry, delivering quality that makes a difference.',

    'contact.tag': 'Get in Touch', 'contact.title': 'Let\'s work', 'contact.title.accent': 'together',
    'contact.desc': 'Contact us and request a personalized quote for your needs.',
    'contact.address.title': 'Address', 'contact.address.value': 'Av. São Borja, 3001<br>Fazenda São Borja<br>São Leopoldo/RS', 'contact.address.hint': 'View on Google Maps →',

    'cert.title': 'ISO Certified Company', 'cert.download': 'Download ISO Certificate (PDF)',
    'cert.desc': 'APO operates with a certified quality management system, ensuring standardized processes, lot traceability, systematic dimensional control, and continuous improvement in all aspects of production. Our certification is regularly audited and reflects the commitment of leadership and the entire team to excellence.',
  }
};

const typedWords = {
  pt: ['Precisão', 'Excelência', 'Qualidade', 'Confiança', 'Inovação'],
  en: ['Precision', 'Excellence', 'Quality', 'Trust', 'Innovation'],
};

/* ======================
   PAGE TRANSITIONS
====================== */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  // Ignora links externos, âncoras, download e target blank
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('http') ||
    href.startsWith('mailto') ||
    href.startsWith('tel') ||
    link.hasAttribute('download') ||
    link.target === '_blank'
  ) return;

  e.preventDefault();
  document.body.classList.add('page-leaving');
  setTimeout(() => { window.location.href = href; }, 120);
});

let currentLang = localStorage.getItem('lang') || 'pt';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang] && i18n[lang][key] !== undefined) {
      el.innerHTML = i18n[lang][key];
    }
  });

  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.textContent = lang === 'pt' ? 'PT | EN' : 'EN | PT';
    toggle.classList.toggle('en-active', lang === 'en');
  }
}

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'pt' ? 'en' : 'pt');
  });
}

applyLanguage(currentLang);
