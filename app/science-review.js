(() => {
  const buttons = document.querySelectorAll('[data-panel]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.panel);
      if (!target) return;
      const opening = target.hidden;
      document.querySelectorAll('.detail-panel').forEach((panel) => { panel.hidden = true; });
      target.hidden = !opening;
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  const navLinks = [...document.querySelectorAll('.bottom-nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }
})();
