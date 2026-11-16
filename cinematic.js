/* Cinematic effects shared by every page. Vanilla JS only; respects reduced motion. */
(() => {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Trigger the entrance animation after the browser has painted the base layout.
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('motion-ready')));

  // Soft pointer light for desktop. This is decorative and disabled for reduced-motion/touch users.
  if (!reduceMotion && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let pointerFrame = 0;
    document.addEventListener('pointermove', event => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { glow.style.opacity = ''; });
  }

  // Gentle hero parallax, limited to the image wrapper so the text stays readable.
  const parallaxTargets = $$('.cinema-portrait-wrap, .internship-visual');
  if (!reduceMotion && parallaxTargets.length && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) {
    parallaxTargets.forEach(target => {
      const parent = target.closest('section') || target;
      parent.addEventListener('pointermove', event => {
        const rect = parent.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - .5;
        const py = (event.clientY - rect.top) / rect.height - .5;
        target.style.setProperty('--parallax-x', `${px * 9}px`);
        target.style.setProperty('--parallax-y', `${py * 8}px`);
        target.classList.add('parallax-active');
      }, { passive: true });
      parent.addEventListener('pointerleave', () => {
        target.style.setProperty('--parallax-x', '0px');
        target.style.setProperty('--parallax-y', '0px');
        target.classList.remove('parallax-active');
      });
    });
  }

  // Photo lightbox with next/previous navigation and keyboard support.
  const photoButtons = $$('[data-lightbox]');
  if (photoButtons.length) {
    let modal = $('[data-lightbox-modal]');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'lightbox';
      modal.dataset.lightboxModal = '';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '<button class="lightbox-close" type="button" data-lightbox-close aria-label="Close image">×</button><button class="lightbox-nav lightbox-prev" type="button" data-lightbox-prev aria-label="Previous image">←</button><figure><img data-lightbox-image src="" alt=""><figcaption data-lightbox-caption></figcaption></figure><button class="lightbox-nav lightbox-next" type="button" data-lightbox-next aria-label="Next image">→</button>';
      document.body.appendChild(modal);
    } else {
      const figure = $('figure', modal);
      if (figure && !$('[data-lightbox-prev]', modal)) {
        const prev = document.createElement('button');
        prev.className = 'lightbox-nav lightbox-prev'; prev.type = 'button'; prev.dataset.lightboxPrev = ''; prev.setAttribute('aria-label', 'Previous image'); prev.textContent = '←';
        const next = document.createElement('button');
        next.className = 'lightbox-nav lightbox-next'; next.type = 'button'; next.dataset.lightboxNext = ''; next.setAttribute('aria-label', 'Next image'); next.textContent = '→';
        modal.append(prev, next);
      }
    }
    const image = $('[data-lightbox-image]', modal);
    const caption = $('[data-lightbox-caption]', modal);
    let activeIndex = 0;
    let previousFocus = null;
    const open = index => {
      activeIndex = (index + photoButtons.length) % photoButtons.length;
      const item = photoButtons[activeIndex];
      const preview = $('img', item);
      image.src = item.dataset.lightbox;
      image.alt = preview?.alt || item.dataset.caption || 'Portfolio photograph';
      caption.textContent = item.dataset.caption || preview?.alt || '';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('[data-lightbox-close]', modal)?.focus();
    };
    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      image.removeAttribute('src');
      previousFocus?.focus?.();
    };
    photoButtons.forEach((button, index) => {
      const show = () => { previousFocus = document.activeElement; open(index); };
      button.addEventListener('click', show);
      if (button.tagName !== 'BUTTON' && button.tagName !== 'A') {
        button.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); }
        });
      }
    });
    $('[data-lightbox-close]', modal)?.addEventListener('click', close);
    $('[data-lightbox-prev]', modal)?.addEventListener('click', () => open(activeIndex - 1));
    $('[data-lightbox-next]', modal)?.addEventListener('click', () => open(activeIndex + 1));
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    document.addEventListener('keydown', event => {
      if (!modal.classList.contains('open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') open(activeIndex - 1);
      if (event.key === 'ArrowRight') open(activeIndex + 1);
    });
  }

  // Small tilt enhancements for any new cards not present when main.js first ran.
  window.initPortfolioTilt?.(document);
})();
