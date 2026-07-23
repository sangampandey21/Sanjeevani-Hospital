// ===========================================================
// SANJEEVANI HOSPITAL — Shared Script
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Pulse scroll-progress bar ---------- */
  const pulseFill = document.querySelector('.pulse-bar__fill');
  const updatePulse = () => {
    const h = document.documentElement;
    const scrollPercent = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (pulseFill) pulseFill.style.width = (isFinite(scrollPercent) ? scrollPercent : 0) + '%';
  };
  document.addEventListener('scroll', updatePulse, { passive: true });
  updatePulse();

  /* ---------- Header scrolled state ---------- */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      links.classList.toggle('is-open');
      const expanded = toggle.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Toast helper ---------- */
  window.showToast = (msg) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2600);
  };

  /* ---------- Share button (Web Share API + clipboard fallback) ---------- */
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'Sanjeevani Hospital',
        text: 'Sanjeevani Hospital — care that feels like home. Dekhiye unki services aur doctors.',
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); }
        catch (err) { /* user cancelled — no action needed */ }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Link copied! Ab kahin bhi paste karke share karein.');
        } catch (err) {
          showToast('Link: ' + window.location.href);
        }
      } else {
        showToast('Link: ' + window.location.href);
      }
    });
  });

  /* ---------- Active nav link highlight ---------- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });

  /* ---------- Counter animation (used on home page stats) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('en-IN');
          };
          requestAnimationFrame(step);
          countIO.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ---------- Simple contact form handling (demo, no backend) ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Bheja ja raha hai...';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('Dhanyavaad! Hum aapse jald hi sampark karenge.');
      }, 900);
    });
  }

  /* ---------- FAQ accordion (about page) ---------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.closest('.faq').querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Gallery lightbox (home page) ---------- */
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('is-open');
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lightbox__close')) {
        lightbox.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('is-open');
    });
  }

});
