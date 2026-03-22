// ==========================================
// The AI Prompt Vault 2.0 — aierasu.com
// Landing Page Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavScroll();
  initFaqAccordion();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimation();
  initCarousel();
  initCountdownTimer();
  initExitIntent();
  initLegalModals();
  initCheckout();
  initHamburger();
  initTryItTabs();
  initROICalculator();
});

// ----- Particle Background -----
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 270 : 220;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = window.innerWidth < 768 ? 30 : 60;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ----- Navigation Scroll Effect -----
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ----- FAQ Accordion -----
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq__answer').style.maxHeight = '0';
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ----- Scroll Animations (Intersection Observer) -----
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.anim');
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 400));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

// ----- Smooth Scroll -----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip links that open modals — they have their own handler
    if (anchor.hasAttribute('data-modal')) return;

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href === '#') return; // skip bare # links
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ----- Counter Animation -----
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => observer.observe(el));
  } else {
    counters.forEach(el => {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ----- Carousel -----
function initCarousel() {
  const slides = document.querySelectorAll('.carousel__slide');
  const dots = document.querySelectorAll('.carousel__dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!slides.length) return;

  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Touch support
  let touchStartX = 0;
  const track = document.getElementById('carousel-track');
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAutoPlay();
}

// ----- Countdown Timer -----
function initCountdownTimer() {
  const STORAGE_KEY = 'vault_launch_end';
  let endTime = localStorage.getItem(STORAGE_KEY);

  if (!endTime) {
    endTime = Date.now() + (3 * 24 * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_KEY, endTime);
  } else {
    endTime = parseInt(endTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    let diff = endTime - now;
    if (diff <= 0) {
      endTime = Date.now() + (3 * 24 * 60 * 60 * 1000);
      localStorage.setItem(STORAGE_KEY, endTime);
      diff = endTime - Date.now();
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const d = document.getElementById('timer-days');
    const h = document.getElementById('timer-hours');
    const m = document.getElementById('timer-mins');
    const s = document.getElementById('timer-secs');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
    if (s) s.textContent = String(secs).padStart(2, '0');
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}

// ----- Exit Intent Popup -----
function initExitIntent() {
  const popup = document.getElementById('exit-popup');
  const closeBtn = document.getElementById('popup-close');
  const overlay = popup?.querySelector('.popup__overlay');
  const STORAGE_KEY = 'vault_popup_shown';
  if (!popup) return;

  let shown = sessionStorage.getItem(STORAGE_KEY);

  function showPopup() {
    if (shown) return;
    popup.classList.add('active');
    shown = true;
    sessionStorage.setItem(STORAGE_KEY, '1');
  }
  function hidePopup() {
    popup.classList.remove('active');
  }

  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0 && !shown) showPopup();
  });

  if (window.innerWidth < 768) {
    setTimeout(() => { if (!shown) showPopup(); }, 45000);
  }

  closeBtn?.addEventListener('click', hidePopup);
  overlay?.addEventListener('click', hidePopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopup();
  });
}


// ----- Gumroad Checkout -----
function initCheckout() {
  const GUMROAD_URL = 'https://aierasu.gumroad.com/l/prompt';
  document.querySelectorAll('[data-checkout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(GUMROAD_URL, '_blank');
    });
  });
}

// ----- Legal Modals (Terms of Service & Privacy Policy) -----
function initLegalModals() {
  const triggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.legal-modal');
  if (!triggers.length || !modals.length) return;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    const body = modal.querySelector('.legal-modal__body');
    if (body) body.scrollTop = 0;
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function closeAllModals() {
    modals.forEach(m => closeModal(m));
  }

  // Open modal when footer link is clicked
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Close on overlay click or close button
  modals.forEach(modal => {
    const overlay = modal.querySelector('.legal-modal__overlay');
    const closeBtn = modal.querySelector('.legal-modal__close');
    if (overlay) overlay.addEventListener('click', () => closeModal(modal));
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}


// ----- Hamburger Mobile Nav -----
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const links = document.querySelector('.nav__links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close when a link is clicked
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      links.classList.remove('open');
    });
  });
}


// ----- Try It Interactive Tabs -----
function initTryItTabs() {
  const tabs = document.querySelectorAll('.try-it__tab');
  const panels = document.querySelectorAll('.try-it__panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('try-it__tab--active'));
      panels.forEach(p => p.classList.remove('try-it__panel--active'));
      tab.classList.add('try-it__tab--active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('try-it__panel--active');
    });
  });

  // Copy button
  const copyBtn = document.getElementById('copy-prompt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('demo-prompt').textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }
}

// ----- ROI Calculator -----
function initROICalculator() {
  const hoursSlider = document.getElementById('roi-hours');
  const rateSlider = document.getElementById('roi-rate');
  if (!hoursSlider || !rateSlider) return;

  function calculate() {
    const hours = parseInt(hoursSlider.value);
    const rate = parseInt(rateSlider.value);
    const saved = Math.round(hours * 0.8 * 10) / 10;
    const weekly = saved * rate;
    const annual = weekly * 52;
    const roi = Math.round(annual / 19);

    document.getElementById('roi-hours-val').textContent = hours;
    document.getElementById('roi-rate-val').textContent = rate;
    document.getElementById('roi-time-saved').textContent = saved + ' hours';
    document.getElementById('roi-weekly').textContent = '$' + weekly.toLocaleString();
    document.getElementById('roi-annual').textContent = '$' + annual.toLocaleString();
    document.getElementById('roi-multiple').textContent = roi + 'x return';
  }

  hoursSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);
  calculate();
}
