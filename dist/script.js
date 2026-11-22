/**
 * RANIA JAMADAR — LUXURY PORTFOLIO INTERACTION ENGINE
 * Zak Steele-Eklund "KRAI" Inspired Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Audio Engine (Web Audio API)
  const soundEngine = {
    ctx: null,
    enabled: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    },
    toggle() {
      this.init();
      this.enabled = !this.enabled;
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.enabled;
    },
    playChime(freq = 587.33, type = 'sine', duration = 0.3) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }
  };

  // Sound Toggle Listener
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = soundEngine.toggle();
      const icon = soundBtn.querySelector('i');
      if (active) {
        soundBtn.style.color = 'var(--sunset-gold)';
        soundBtn.style.borderColor = 'var(--sunset-gold)';
        soundEngine.playChime(659.25, 'triangle', 0.4);
      } else {
        soundBtn.style.color = '';
        soundBtn.style.borderColor = '';
      }
    });
  }

  // Play subtle chime on key interactive buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta-btn, .filter-tab-btn, .cert-thumbnail-wrapper').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      soundEngine.playChime(440, 'sine', 0.15);
    });
    btn.addEventListener('click', () => {
      soundEngine.playChime(880, 'sine', 0.25);
    });
  });

  // ==========================================================================
  // AMBIENT PARALLAX CANVAS (Stars, Sunset Mountain Contours & Glowing Embers)
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // Particles: Twinkling celestial stars and warm sunset embers
    const particles = [];
    const particleCount = Math.min(85, Math.floor((width * height) / 14000));

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.6,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: -Math.random() * 0.45 - 0.1, // gently float upward
          opacity: Math.random() * 0.7 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          isEmber: Math.random() > 0.45
        });
      }
    }
    initParticles();

    function renderCanvas() {
      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#060312');
      skyGrad.addColorStop(0.5, '#0b0722');
      skyGrad.addColorStop(1, '#110a2f');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Mountain Peak Silhouette 1 (Distant Purple-Gold)
      const m1Offset = (mouse.x - width / 2) * 0.02;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width * 0.2 + m1Offset, height * 0.45);
      ctx.lineTo(width * 0.5 + m1Offset, height * 0.62);
      ctx.lineTo(width * 0.85 + m1Offset, height * 0.38);
      ctx.lineTo(width, height * 0.7);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const m1Grad = ctx.createLinearGradient(0, height * 0.35, 0, height);
      m1Grad.addColorStop(0, 'rgba(255, 94, 20, 0.14)');
      m1Grad.addColorStop(0.3, 'rgba(88, 28, 135, 0.25)');
      m1Grad.addColorStop(1, 'rgba(10, 6, 26, 0.85)');
      ctx.fillStyle = m1Grad;
      ctx.fill();
      ctx.restore();

      // Mountain Peak Silhouette 2 (Midground Sunset Rim)
      const m2Offset = (mouse.x - width / 2) * -0.035;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.82);
      ctx.lineTo(width * 0.32 + m2Offset, height * 0.55);
      ctx.lineTo(width * 0.65 + m2Offset, height * 0.72);
      ctx.lineTo(width * 0.95 + m2Offset, height * 0.52);
      ctx.lineTo(width, height * 0.85);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const m2Grad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      m2Grad.addColorStop(0, 'rgba(255, 170, 0, 0.18)');
      m2Grad.addColorStop(0.4, 'rgba(40, 18, 80, 0.5)');
      m2Grad.addColorStop(1, 'rgba(6, 4, 18, 0.92)');
      ctx.fillStyle = m2Grad;
      ctx.fill();
      ctx.restore();

      // Draw Particles & Embers
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.025;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isEmber) {
          // Sunset ember glow
          ctx.fillStyle = `rgba(255, 140, 40, ${currentOpacity})`;
          ctx.shadowBlur = p.size * 6;
          ctx.shadowColor = 'rgba(255, 110, 20, 0.8)';
        } else {
          // Starlight shimmer
          ctx.fillStyle = `rgba(220, 230, 255, ${currentOpacity * 0.8})`;
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = 'rgba(180, 200, 255, 0.6)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  // ==========================================================================
  // 3D HERO CARD TILT (Interactive Mouse Gyroscope Effect)
  // ==========================================================================
  const visualCard = document.querySelector('.hero-visual-card');
  const cardInner = document.querySelector('.visual-card-inner');

  if (visualCard && cardInner) {
    visualCard.addEventListener('mousemove', (e) => {
      const rect = visualCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 14;

      cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    visualCard.addEventListener('mouseleave', () => {
      cardInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================================================
  // ACTIVE NAV LINK HIGHLIGHT ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // ==========================================================================
  // PROJECT CATEGORY FILTER
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // CERTIFICATE & MEDIA LIGHTBOX MODAL
  // ==========================================================================
  const modal = document.getElementById('media-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');

  function openModal(imgSrc, title, desc) {
    if (!modal) return;
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    soundEngine.playChime(784, 'triangle', 0.3);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Trigger modal from any element with data-modal-img
  document.querySelectorAll('[data-modal-img]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-modal-img');
      const title = el.getAttribute('data-modal-title') || 'View Document';
      const desc = el.getAttribute('data-modal-desc') || '';
      openModal(src, title, desc);
    });
  });

  // Team thumbnails switcher in Research Feature
  const teamThumbs = document.querySelectorAll('.team-thumb-btn');
  const mainCertImg = document.getElementById('main-cert-img');
  const mainCertWrapper = document.getElementById('main-cert-wrapper');

  teamThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      teamThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.getAttribute('data-src');
      const newTitle = thumb.getAttribute('data-title');
      const newDesc = thumb.getAttribute('data-desc');

      if (mainCertImg) mainCertImg.src = newSrc;
      if (mainCertWrapper) {
        mainCertWrapper.setAttribute('data-modal-img', newSrc);
        mainCertWrapper.setAttribute('data-modal-title', newTitle);
        mainCertWrapper.setAttribute('data-modal-desc', newDesc);
      }
      soundEngine.playChime(523.25, 'sine', 0.2);
    });
  });

  // ==========================================================================
  // ENQUIRY FORM — delivered to email through FormSubmit (https://formsubmit.co)
  // ==========================================================================
  const ENQUIRY_ENDPOINT = 'https://formsubmit.co/ajax/raniajamadar8@gmail.com';
  const contactForm = document.getElementById('portfolio-contact-form');
  const statusEl = document.getElementById('form-status');

  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const label = btn.querySelector('.btn-label');
      const data = Object.fromEntries(new FormData(contactForm).entries());

      if (!data.name.trim() || !data.subject.trim() || !data.message.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) {
        setStatus('Please fill in every field with a valid email address.', 'error');
        return;
      }
      if (data._honey) return; // bot trap

      btn.disabled = true;
      label.textContent = 'Sending...';
      setStatus('', '');
      try {
        const res = await fetch(ENQUIRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            _subject: 'Portfolio enquiry: ' + data.subject,
            _replyto: data.email,
            _template: 'table',
            _captcha: 'false'
          })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || 'Request failed');
        contactForm.reset();
        label.textContent = 'Sent \u2713';
        setStatus('Thank you! Your enquiry has been sent. I will reply soon.', 'ok');
        soundEngine.playChime(1046.5, 'sine', 0.4);
      } catch (err) {
        label.textContent = 'Send enquiry';
        setStatus('Could not send right now. Please email raniajamadar8@gmail.com directly.', 'error');
      } finally {
        btn.disabled = false;
        setTimeout(() => { if (label.textContent === 'Sent \u2713') label.textContent = 'Send enquiry'; }, 4000);
      }
    });
  }

  // Copy helper
  window.copyText = function(text, element) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = element.innerHTML;
      element.innerHTML = 'Copied to clipboard! ✓';
      soundEngine.playChime(880, 'sine', 0.2);
      setTimeout(() => {
        element.innerHTML = orig;
      }, 2500);
    });
  };
});
