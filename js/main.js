/* Shared site interactions: navigation, theme, reveal, copy, and micro-interactions. */
(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  const header = document.querySelector('.site-header');

  // Restore saved theme before the visitor interacts with the toggle.
  let savedTheme = null;
  try { savedTheme = window.localStorage.getItem('yash-portfolio-theme'); }
  catch { /* Some browsers restrict storage for local file previews. */ }
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const isLight = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.innerHTML = isLight ? '<span aria-hidden="true">◐</span>' : '<span aria-hidden="true">☼</span>';
  };
  updateThemeLabel();
  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { window.localStorage.setItem('yash-portfolio-theme', root.dataset.theme); }
    catch { /* Theme still changes for this page view when storage is unavailable. */ }
    updateThemeLabel();
  });

  // Responsive drawer.
  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  menuToggle?.addEventListener('click', () => {
    const open = mobileDrawer?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  mobileDrawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  document.addEventListener('click', e => {
    if (mobileDrawer?.classList.contains('open') && !mobileDrawer.contains(e.target) && !menuToggle?.contains(e.target)) closeDrawer();
  });

  // Highlight the current page in desktop and mobile navigation.
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav] a').forEach(link => {
    const target = link.getAttribute('href')?.split('/').pop();
    if (target === current || (current === '' && target === 'index.html')) link.classList.add('active');
  });

  // Header state and scroll progress bar.
  const progress = document.querySelector('[data-scroll-progress]');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal content as it enters view.
  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -28px 0px' });
    revealNodes.forEach(node => observer.observe(node));
  } else revealNodes.forEach(node => node.classList.add('visible'));

  // Page transitions only for normal same-site navigation clicks.
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/\.html?$/.test(url.pathname) || url.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add('route-out');
      setTimeout(() => location.href = url.href, 150);
    });
  });

  // Small 3D tilt effect for pointer devices; can also be applied to cards
  // that are injected later (such as the filterable project grid).
  const initTilt = (scope = document) => {
    const supportsTilt = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!supportsTilt || reducedMotion) return;
    scope.querySelectorAll('[data-tilt]:not([data-tilt-ready])').forEach(card => {
      card.dataset.tiltReady = 'true';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  };
  initTilt();
  window.initPortfolioTilt = initTilt;

  // Copy contact details or links with a graceful fallback.
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const field = document.createElement('textarea'); field.value = value; field.style.position = 'fixed'; field.style.opacity = '0';
        document.body.appendChild(field); field.select(); document.execCommand('copy'); field.remove();
      }
      button.textContent = 'Copied ✓';
      setTimeout(() => button.textContent = original, 1400);
    });
  });

  // Footer year.
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
