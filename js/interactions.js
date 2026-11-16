/* Page-specific interactions. This file is safe to load on every page. */
(() => {
  const data = window.PORTFOLIO_DATA || { projects: [], skills: [], notes: [] };
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // Home hero typing effect.
  const typing = $('[data-typing]');
  if (typing) {
    const phrases = ['C programming', 'web development', 'problem solving', 'learning by building'];
    let phrase = 0, index = 0, deleting = false;
    const tick = () => {
      const word = phrases[phrase];
      index += deleting ? -1 : 1;
      typing.textContent = word.slice(0, index);
      let delay = deleting ? 42 : 78;
      if (!deleting && index === word.length) { deleting = true; delay = 1250; }
      else if (deleting && index === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 450);
  }

  // Project cards and case-study modal.
  const projectGrid = $('[data-project-grid]');
  const projectModal = $('[data-project-modal]');
  const modalContent = $('[data-project-modal-content]');
  let lastFocused = null;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const projectCard = project => `
    <article class="card project-card" id="${escapeHTML(project.id)}" data-tilt data-project-id="${escapeHTML(project.id)}" tabindex="0" role="button" aria-label="View ${escapeHTML(project.title)} case study">
      <div class="project-card-top"><span class="project-symbol">${escapeHTML(project.symbol)}</span><span class="tag"><span class="tag-dot"></span>${escapeHTML(project.status)}</span></div>
      <div><div class="eyebrow">${escapeHTML(project.category)} / ${escapeHTML(project.year)}</div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.short)}</p></div>
      <div class="project-card-bottom"><span class="muted mono" style="font-size:.72rem">OPEN CASE STUDY</span><span class="project-arrow">↗</span></div>
    </article>`;
  const openProject = project => {
    if (!projectModal || !modalContent) return;
    lastFocused = document.activeElement;
    const links = (project.links || []).map(link => `<a class="btn btn-small" href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} ↗</a>`).join('');
    const tech = project.stack.map(x => `<span class="tag">${escapeHTML(x)}</span>`).join('');
    const features = project.features.map(x => `<li>${escapeHTML(x)}</li>`).join('');
    modalContent.innerHTML = `
      <div class="modal-head"><div><div class="eyebrow">${escapeHTML(project.category)} / ${escapeHTML(project.year)}</div><h2 class="heading-lg" style="margin:.5rem 0">${escapeHTML(project.title)}</h2><span class="tag">${escapeHTML(project.status)}</span></div><button class="icon-btn" type="button" data-modal-close aria-label="Close project details">✕</button></div>
      <div class="modal-body"><h4>Problem statement</h4><p>${escapeHTML(project.problem)}</p><h4>Approach</h4><p>${escapeHTML(project.solution)}</p><h4>Tech stack</h4><div class="pill-row">${tech}</div><h4>Key features</h4><ul>${features}</ul><div class="form-notice info show" style="margin-top:1rem">${escapeHTML(project.note)}</div><div class="modal-actions">${links || '<span class="muted" style="font-size:.82rem">No public demo or repository link added yet.</span>'}</div></div>`;
    projectModal.classList.add('open'); projectModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    $('[data-modal-close]', modalContent)?.focus();
  };
  const closeProject = () => {
    if (!projectModal) return;
    projectModal.classList.remove('open'); projectModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    lastFocused?.focus?.();
  };
  if (projectGrid) {
    projectGrid.innerHTML = data.projects.map(projectCard).join('');
    window.initPortfolioTilt?.(projectGrid);
    if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    const filters = $$('[data-project-filter]');
    filters.forEach(btn => btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.toggle('active', b === btn));
      const value = btn.dataset.projectFilter;
      $$('.project-card', projectGrid).forEach(card => {
        const project = data.projects.find(p => p.id === card.dataset.projectId);
        card.hidden = value !== 'All' && project.category !== value;
      });
    }));
    projectGrid.addEventListener('click', e => {
      const card = e.target.closest('[data-project-id]');
      if (card) openProject(data.projects.find(p => p.id === card.dataset.projectId));
    });
    projectGrid.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-project-id]')) { e.preventDefault(); openProject(data.projects.find(p => p.id === e.target.dataset.projectId)); }
    });
  }
  projectModal?.addEventListener('click', e => { if (e.target === projectModal || e.target.closest('[data-modal-close]')) closeProject(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeProject(); closeArticle(); } });

  // Skills list and category filtering.
  const skillsList = $('[data-skills-list]');
  if (skillsList) {
    const renderSkills = group => {
      const skills = data.skills.filter(skill => group === 'All' || skill.group === group);
      skillsList.innerHTML = skills.map(skill => `<div class="skill-row"><div><div class="skill-name">${escapeHTML(skill.name)}</div><div class="muted" style="font-size:.68rem">${escapeHTML(skill.note)}</div></div><div class="skill-track" role="progressbar" aria-label="${escapeHTML(skill.name)} learning progress indicator" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${skill.value}"><span class="skill-fill" style="--level:${skill.value}%"></span></div><div class="skill-level">${escapeHTML(skill.level)}</div></div>`).join('');
    };
    renderSkills('All');
    $$('[data-skill-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-skill-filter]').forEach(b => b.classList.toggle('active', b === btn)); renderSkills(btn.dataset.skillFilter);
    }));
  }

  // Interactive notes list and reader drawer.
  const notesGrid = $('[data-notes-grid]');
  const articleDrawer = $('[data-article-drawer]');
  const articleContent = $('[data-article-content]');
  let priorArticleFocus = null;
  const closeArticle = () => { articleDrawer?.classList.remove('open'); articleDrawer?.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; priorArticleFocus?.focus?.(); };
  const openArticle = note => {
    if (!articleDrawer || !articleContent) return;
    priorArticleFocus = document.activeElement;
    articleContent.innerHTML = `<div class="article-meta"><span>${escapeHTML(note.category)}</span><span>·</span><span>${escapeHTML(note.read)} read</span></div><h2 class="heading-lg" style="margin:1rem 0">${escapeHTML(note.title)}</h2><p class="muted">${escapeHTML(note.excerpt)}</p><div class="divider"></div><div class="article-prose">${note.body}</div>`;
    articleDrawer.classList.add('open'); articleDrawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    $('[data-article-close]', articleDrawer)?.focus();
  };
  if (notesGrid) {
    notesGrid.innerHTML = data.notes.map(note => `<article class="card article-card" data-note-id="${escapeHTML(note.id)}" tabindex="0" role="button"><div class="article-meta"><span>${escapeHTML(note.category)}</span><span>·</span><span>${escapeHTML(note.read)}</span></div><h3 style="margin:.9rem 0 .45rem;letter-spacing:-.03em">${escapeHTML(note.title)}</h3><p class="muted" style="font-size:.86rem;margin:0 0 1.2rem">${escapeHTML(note.excerpt)}</p><span class="inline-link" style="font-size:.8rem">Read note ↗</span></article>`).join('');
    notesGrid.addEventListener('click', e => { const card = e.target.closest('[data-note-id]'); if (card) openArticle(data.notes.find(n => n.id === card.dataset.noteId)); });
    notesGrid.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-note-id]')) { e.preventDefault(); openArticle(data.notes.find(n => n.id === e.target.dataset.noteId)); } });
  }
  articleDrawer?.addEventListener('click', e => { if (e.target === articleDrawer || e.target.closest('[data-article-close]')) closeArticle(); });

  // Contact form: frontend-only validation and simulated send state.
  const form = $('[data-contact-form]');
  if (form) {
    const notice = $('[data-form-notice]');
    const fields = {
      name: { input: $('[name="name"]', form), error: $('[data-error="name"]', form), test: v => v.trim().length >= 2, message: 'Please enter at least 2 characters.' },
      email: { input: $('[name="email"]', form), error: $('[data-error="email"]', form), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Enter a valid email address.' },
      subject: { input: $('[name="subject"]', form), error: $('[data-error="subject"]', form), test: v => v.trim().length >= 3, message: 'Add a short subject (at least 3 characters).' },
      message: { input: $('[name="message"]', form), error: $('[data-error="message"]', form), test: v => v.trim().length >= 15, message: 'Please add a little more detail (at least 15 characters).' }
    };
    const validate = key => {
      const field = fields[key], valid = field.test(field.input.value);
      field.input.closest('.field').classList.toggle('invalid', !valid);
      field.input.setAttribute('aria-invalid', String(!valid));
      field.error.textContent = valid ? '' : field.message;
      return valid;
    };
    Object.keys(fields).forEach(key => fields[key].input.addEventListener('input', () => validate(key)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const valid = Object.keys(fields).map(validate).every(Boolean);
      notice.className = 'form-notice';
      if (!valid) { notice.textContent = 'A couple of fields need attention. Check the messages below.'; notice.classList.add('show', 'info'); Object.values(fields).find(f => !f.test(f.input.value))?.input.focus(); return; }
      const submit = $('[type="submit"]', form); submit.disabled = true; submit.textContent = 'Preparing message…';
      notice.textContent = 'This is a front-end demo: no message has been sent or stored. Open your email app using the button below to send it for real.';
      notice.classList.add('show', 'success');
      const body = `Hi Yashwardhan,\n\n${fields.message.input.value}\n\nFrom: ${fields.name.input.value} (${fields.email.input.value})`;
      const mailto = `mailto:yashwardhan1907@gmail.com?subject=${encodeURIComponent(fields.subject.input.value)}&body=${encodeURIComponent(body)}`;
      const sendLink = $('[data-mailto-link]');
      if (sendLink) { sendLink.href = mailto; sendLink.hidden = false; }
      submit.textContent = 'Message prepared ✓';
      setTimeout(() => { submit.disabled = false; submit.textContent = 'Prepare email ↗'; }, 2200);
    });
  }

  // FAQ accordion: one open item at a time.
  $$('.faq-question').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    $$('.faq-item').forEach(other => { other.classList.remove('open'); $('.faq-question', other)?.setAttribute('aria-expanded', 'false'); });
    if (!wasOpen) { item.classList.add('open'); button.setAttribute('aria-expanded', 'true'); }
  }));

  // Bitwise playground: integer values in a safe 8-bit demonstration range.
  const bitA = $('[data-bit-a]'), bitB = $('[data-bit-b]'), bitOp = $('[data-bit-op]');
  const bitResult = $('[data-bit-result]'), bitBinary = $('[data-bit-binary]');
  const binary8 = value => (value & 255).toString(2).padStart(8, '0');
  const updateBits = () => {
    if (!bitA || !bitB || !bitOp || !bitResult || !bitBinary) return;
    const a = Math.max(0, Math.min(255, Number(bitA.value) || 0));
    const b = Math.max(0, Math.min(255, Number(bitB.value) || 0));
    const op = bitOp.value;
    let result = 0;
    if (op === 'AND') result = a & b;
    if (op === 'OR') result = a | b;
    if (op === 'XOR') result = a ^ b;
    if (op === 'NOT') result = (~a) & 255;
    bitResult.textContent = String(result);
    bitBinary.textContent = `${binary8(a)} ${op === 'NOT' ? '→' : op === 'AND' ? '&' : op === 'OR' ? '|' : '^'} ${op === 'NOT' ? '' : binary8(b) + ' → '}${binary8(result)}`;
  };
  [bitA, bitB, bitOp].forEach(el => el?.addEventListener('input', updateBits)); updateBits();

  // Sorting visualizer: step-by-step bubble sort / selection sort with pauseable controls.
  const barsHost = $('[data-sort-bars]'), sortRun = $('[data-sort-run]'), sortReset = $('[data-sort-reset]'), sortAlgo = $('[data-sort-algo]'), sortSpeed = $('[data-sort-speed]');
  let sortValues = [], sorting = false, sortToken = 0;
  const makeValues = () => Array.from({ length: 18 }, () => 12 + Math.floor(Math.random() * 88));
  const drawBars = (active = [], done = []) => {
    if (!barsHost) return;
    barsHost.innerHTML = sortValues.map((v, i) => `<div class="sort-bar ${active.includes(i) ? 'active' : done.includes(i) ? 'done' : ''}" style="height:${v}%" title="${v}"></div>`).join('');
  };
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const resetSort = () => { sortToken++; sorting = false; sortValues = makeValues(); drawBars(); if (sortRun) { sortRun.disabled = false; sortRun.textContent = 'Run visualizer ▶'; } };
  const startSort = async () => {
    if (!barsHost || sorting) return;
    sorting = true; const token = ++sortToken; sortRun.disabled = true; sortRun.textContent = 'Sorting…';
    const a = [...sortValues], n = a.length, done = [];
    const delay = () => 460 - Number(sortSpeed?.value || 5) * 40;
    if (sortAlgo?.value === 'selection') {
      for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
          if (token !== sortToken) return;
          drawBars([min, j], done); await pause(delay());
          if (a[j] < a[min]) min = j;
        }
        [a[i], a[min]] = [a[min], a[i]]; done.push(i); sortValues = [...a]; drawBars([i, min], done); await pause(delay());
      }
    } else {
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          if (token !== sortToken) return;
          drawBars([j, j + 1], done); await pause(delay());
          if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; sortValues = [...a]; drawBars([j, j + 1], done); await pause(delay()); }
        }
        done.push(n - i - 1); if (!swapped) break;
      }
    }
    if (token === sortToken) { sortValues = a; drawBars([], a.map((_, i) => i)); sorting = false; sortRun.disabled = false; sortRun.textContent = 'Run again ↻'; }
  };
  if (barsHost) { resetSort(); sortRun?.addEventListener('click', startSort); sortReset?.addEventListener('click', resetSort); sortAlgo?.addEventListener('change', resetSort); }
})();
