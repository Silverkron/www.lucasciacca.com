/* Shared, dependency-free progressive enhancement. */
(() => {
  'use strict';
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (header && menu && nav) {
    header.dataset.enhanced = '';
    menu.hidden = false;
    const close = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    header.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { close(); menu.focus(); }
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  }
  const theme = document.querySelector('.theme-toggle');
  if (theme) {
    theme.hidden = false;
    const update = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      theme.setAttribute('aria-pressed', String(dark));
      theme.setAttribute('aria-label', dark ? 'Attiva tema chiaro' : 'Attiva tema scuro');
    };
    update();
    theme.addEventListener('click', () => {
      const value = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = value;
      try { localStorage.setItem('theme', value); } catch (_) { /* Storage can be unavailable. */ }
      update();
    });
  }
  const portfolio = document.querySelector('[data-portfolio]');
  if (portfolio) {
    const scenes = [...portfolio.querySelectorAll('[data-animated]')];
    const control = portfolio.querySelector('[data-portfolio-motion]');
    let paused = false;
    const sync = () => portfolio.toggleAttribute('data-paused', paused || document.hidden);
    control.hidden = false;
    control.addEventListener('click', () => {
      paused = !paused;
      control.setAttribute('aria-pressed', String(paused));
      control.textContent = paused ? 'Riprendi le animazioni' : 'Metti in pausa le animazioni';
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    sync();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)));
      scenes.forEach(scene => observer.observe(scene));
    } else scenes.forEach(scene => scene.classList.add('is-visible'));
  }
  const game = document.querySelector('[data-game]');
  if (!game) return;
  // Keep the entire game below the actual menu, including an expanded mobile menu.
  const sizeHeader = () => game.style.setProperty('--site-header-height', (header?.getBoundingClientRect().height || 0) + 'px');
  sizeHeader();
  if (header && 'ResizeObserver' in window) new ResizeObserver(sizeHeader).observe(header);
  let loading = false;
  const load = async () => {
    if (loading) return;
    loading = true;
    try {
      const module = await import(game.dataset.module);
      await module.mount(game);
    } catch (_) {
      const button = game.querySelector('[data-retry]');
      button.hidden = false;
      game.querySelector('#game-status').textContent = 'Il laboratorio non è disponibile. Puoi scoprire cosa faccio qui sotto o riprovare.';
      button.onclick = () => { loading = false; button.hidden = true; button.onclick = null; load(); };
    }
  };
  // The game is fetched only near the viewport, after the initial page load.
  const observe = () => {
    if (!('IntersectionObserver' in window)) { load(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, { rootMargin: '120px' });
    observer.observe(game);
  };
  if (document.readyState === 'complete') observe();
  else window.addEventListener('load', observe, { once: true });
})();
