  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }));

  // spotlight cursor-follow effect on cards
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });

    });
  }

  // fullscreen project lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxTags = document.getElementById('lightboxTags');
  const lightboxLink = document.getElementById('lightboxLink');
  let lastFocused = null;

  function openLightbox(card) {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const img = card.dataset.img || '';
    const tags = (card.dataset.tags || '').split(',').filter(Boolean);
    const link = card.dataset.link || '';

    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    if (img) {
      lightboxImg.src = img;
      lightboxImg.alt = title;
      lightboxImg.style.display = '';
    } else {
      lightboxImg.removeAttribute('src');
      lightboxImg.style.display = 'none';
    }

    lightboxTags.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

    if (link) {
      lightboxLink.href = link;
      lightboxLink.classList.add('show');
    } else {
      lightboxLink.removeAttribute('href');
      lightboxLink.classList.remove('show');
    }

    lastFocused = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.card[data-title]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let internal links behave normally
      openLightbox(card);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));