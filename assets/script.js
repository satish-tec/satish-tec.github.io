(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = [...document.querySelectorAll('.nav__link')];
  const sections = [...document.querySelectorAll('main section[id]')];

  // Restore the visitor's theme preference; default to the dark theme.
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('satish-portfolio-theme');
  } catch (error) {
    // Storage may be unavailable in private or restricted browsing contexts.
  }

  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }
  updateThemeButton();

  function updateThemeButton() {
    const isLight = body.classList.contains('light-theme');
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle?.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const nextTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    try {
      localStorage.setItem('satish-portfolio-theme', nextTheme);
    } catch (error) {
      // The theme still works for this page view without local storage.
    }
    updateThemeButton();
  });

  // Mobile navigation.
  function closeMenu() {
    navMenu?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation');
  }

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('is-open') ?? false;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Update header and back-to-top control while scrolling.
  function handleScroll() {
    const scrollPosition = window.scrollY;
    header?.classList.toggle('is-scrolled', scrollPosition > 12);
    backToTop?.classList.toggle('is-visible', scrollPosition > 500);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Keep the current section highlighted in the navigation.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${activeId}`;
          link.classList.toggle('active-link', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));

    // Reveal content as it enters the viewport.
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  // Keep the footer year current.
  const yearElement = document.getElementById('current-year');
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());
})();
