// Shared scripts for every page: mobile nav, sticky header, scroll reveal, back-to-top, toast
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');

  // Mobile hamburger menu
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.header-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Header shadow + back-to-top button on scroll
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '&#8593;';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('show', y > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade-up animation when sections scroll into view
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);

          // Remove the stagger delay afterwards so hover effects stay snappy
          setTimeout(() => {
            entry.target.classList.remove('reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
          }, 1000);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Current year in the footer
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

// Small pop-up message at the bottom of the screen (used by the menu and sign-in pages)
function showToast(message) {
  let toast = document.querySelector('.toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}
