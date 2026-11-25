(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.querySelector('.hero-video');
  const toggle = document.querySelector('#motion-toggle');
  const toggleText = toggle.querySelector('span');
  let userPaused = false;
  let heroVisible = true;
  let lenis;
  let entrance;
  let tick;
  const syncVideo = () => {
    const shouldPause = userPaused || reduced.matches || document.hidden || !heroVisible;
    if (shouldPause) video.pause();
    else video.play().catch(() => { toggleText.textContent = 'Включить'; });
    const paused = shouldPause || video.paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Включить видео' : 'Приостановить видео');
    toggleText.textContent = paused ? 'Включить' : 'Пауза';
    toggle.hidden = reduced.matches;
  };
  function configureMotion() {
    lenis?.destroy(); lenis = undefined;
    if (tick && window.gsap) gsap.ticker.remove(tick);
    entrance?.revert(); entrance = undefined;
    if (!reduced.matches && window.Lenis && window.gsap) {
      lenis = new Lenis({ duration: .8, smoothWheel: true, anchors: false });
      tick = time => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      entrance = gsap.context(() => {
        gsap.from('.hero-copy', {y:24, duration:1.05, ease:'expo.out', clearProps:'transform'});
        gsap.from('.market', {x:24, stagger:.12, duration:1.1, ease:'expo.out', clearProps:'transform'});
        
      });
    }
    syncVideo();
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; syncVideo(); });
  video.addEventListener('playing', () => { toggleText.textContent = 'Пауза'; toggle.setAttribute('aria-pressed','false'); toggle.setAttribute('aria-label','Приостановить видео'); });
  document.addEventListener('visibilitychange', syncVideo);
  reduced.addEventListener('change', configureMotion);
  configureMotion();
  const observer = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncVideo();
  });
  observer.observe(document.querySelector('.hero'));
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const target = hash === '#' ? document.querySelector('main') : document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 24);
      if (lenis) lenis.scrollTo(destination, { immediate: true, force: true });
      else window.scrollTo({top: destination, behavior:'instant'});
      history.pushState(null, '', hash);
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
    });
  });
  const toast = document.querySelector('.toast');
  let timeout;
  document.querySelectorAll('[data-market]').forEach(button => {
    button.addEventListener('click', () => {
      clearTimeout(timeout);
      document.querySelector('#toast-title').textContent = button.dataset.market;
      toast.classList.add('visible');
      timeout = setTimeout(() => toast.classList.remove('visible'), 10000);
    });
  });
  toast.querySelector('button').addEventListener('click', () => { clearTimeout(timeout); toast.classList.remove('visible'); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') toast.classList.remove('visible'); });
  const privacy = document.querySelector('.privacy-dialog');
  document.querySelector('[data-open-privacy]').addEventListener('click', () => { lenis?.stop(); privacy.showModal(); });
  privacy.querySelector('.privacy-close').addEventListener('click', () => privacy.close());
  privacy.addEventListener('close', () => lenis?.start());
  document.querySelector('.feedback-form').addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('.form-status').textContent = 'Сообщение не отправлено: форма пока не принимает обращения. Связаться с брендом можно на mrbuffalo.ru.';
  });
  window.addEventListener('pagehide', () => { video.pause(); lenis?.destroy(); entrance?.revert(); if (tick && window.gsap) gsap.ticker.remove(tick); clearTimeout(timeout); });
  window.addEventListener('pageshow', event => { if (event.persisted) configureMotion(); });
})();
