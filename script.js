// script.js — all interactivity here
(() => {
  // Utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Year in footer
  $('#year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $('#nav-toggle');
  const nav = $('#primary-nav');

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    // simple class for small screens: togisibility on small
    if (window.innerWidth <= 980) {
      if (nav.hasAttribute('open')) {
        nav.removeAttribute('open');
      } else {
        nav.setAttribute('open', '');
      }
    }
  });

  // Theme toggle (dark/light)
  const themeToggle = $('#theme-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light');
  else if (saved === 'dark') document.body.classList.remove('light');
  else if (!prefersDark) document.body.classList.add('light');

  function updateThemeButton() {
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-pressed', String(!isLight));
  }
  updateThemeButton();

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeButton();
  });

  // Gallery modal
  const modal = $('#modal');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalClose = $('#modal-close');
  const galleryItems = $$('.gallery-item');

  function openModal(title, desc) {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.setAttribute('aria-hidden', 'false');
    // trap focus to close button
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openModal(item.dataset.title, item.dataset.desc);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item.dataset.title, item.dataset.desc);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Contact form validation & fake submit
  const form = $('#contact-form');
  const nameI = $('#name');
  const emailI = $('#email');
  const msgI = $('#message');
  const successEl = $('#form-success');

  function emailValid(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // clear messages
    $('.error#err-name').textContent = '';
    $('.error#err-email').textContent = '';
    $('.error#err-message').textContent = '';
    successEl.textContent = '';

    let ok = true;
    if (nameI.value.trim().length < 2) {
      $('#err-name').textContent = 'Please enter your name (2+ characters).';
      ok = false;
    }
    if (!emailValid(emailI.value.trim())) {
      $('#err-email').textContent = 'Please enter a valid email address.';
      ok = false;
    }
    if (msgI.value.trim().length < 10) {
      $('#err-message').textContent = 'Message must be at least 10 characters.';
      ok = false;
    }
    if (!ok) {
      return;
    }

    // Simulate submission (no backend). Show success, store in localStorage
    const payload = {
      name: nameI.value.trim(),
      email: emailI.value.trim(),
      message: msgI.value.trim(),
      sentAt: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem('contact_history') || '[]');
    history.push(payload);
    localStorage.setItem('contact_history', JSON.stringify(history));

    successEl.textContent = 'Thanks — your message has been recorded locally. (This demo does not send email.)';
    form.reset();
  });

  // Accessibility: reduce motion if user prefers
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Small enhancement: collapse mobile nav when link clicked
  $$('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 980 && nav.hasAttribute('open')) {
        nav.removeAttribute('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

})();
