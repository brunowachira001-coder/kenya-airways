/* ================================================
   JANTA KENYA – JAVASCRIPT
   Features:
   - Navbar scroll effect
   - Mobile menu toggle
   - Animated counter stats
   - Scroll-reveal animations
   - Hero particles
   - Form submission handler
   - Smooth interactions
   ================================================ */

'use strict';

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initParticles();
  initScrollAnimations();
  initCounters();
  initForm();
});

/* ════════════════════════════════════════
   NAVBAR — scroll + active states
════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check on load

  // Highlight nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ════════════════════════════════════════
   HERO PARTICLES
════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const delay = Math.random() * 12;
    const opacity = Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${opacity};
    `;
    container.appendChild(p);
  }
}

/* ════════════════════════════════════════
   SCROLL ANIMATIONS
════════════════════════════════════════ */
function initScrollAnimations() {
  // Add animate-on-scroll to cards, steps, testimonials etc.
  const targets = [
    '.step-card',
    '.opp-card',
    '.testimonial-card',
    '.industry-tag',
    '.stat-card',
    '.pain-item',
    '.floating-card',
    '.apply-form-card',
    '.emotional-text',
    '.emotional-visual',
    '.section-header',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('animate-on-scroll');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
}

/* ════════════════════════════════════════
   ANIMATED COUNTERS
════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    if (target === 0) {
      el.textContent = suffix;
      return;
    }

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => io.observe(c));
}

/* ════════════════════════════════════════
   FORM SUBMISSION
════════════════════════════════════════ */
function initForm() {
  const form = document.getElementById('apply-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const toast = document.getElementById('success-toast');

  if (!form || !toast) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('full-name').value.trim();
    const email   = document.getElementById('email-addr').value.trim();
    const phone   = document.getElementById('phone-num').value.trim();
    const industry = document.getElementById('industry-select').value;

    // Simple validation with visual feedback
    let valid = true;
    [
      { id: 'full-name', val: name },
      { id: 'email-addr', val: email },
      { id: 'phone-num', val: phone },
      { id: 'industry-select', val: industry },
    ].forEach(({ id, val }) => {
      const el = document.getElementById(id);
      if (!val) {
        el.style.borderColor = '#e53e3e';
        el.style.boxShadow = '0 0 0 3px rgba(229,62,62,.12)';
        valid = false;
      } else {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }
    });

    if (!valid) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Submitting...
    `;

    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));

    // Success
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      Application Submitted! ✓
    `;
    submitBtn.style.background = 'linear-gradient(135deg, #48bb78, #27ae60)';
    submitBtn.style.color = '#fff';

    showToast(toast);

    setTimeout(() => {
      submitBtn.innerHTML = `
        Submit Application
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      `;
      submitBtn.style.background = '';
      submitBtn.style.color = '';
    }, 4000);
  });

  // Reset field border on input
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  });
}

function showToast(toast) {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

/* ════════════════════════════════════════
   SPIN ICON CSS — injected
════════════════════════════════════════ */
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  .spin-icon { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link.active { color: var(--gold) !important; }
`;
document.head.appendChild(spinStyle);
