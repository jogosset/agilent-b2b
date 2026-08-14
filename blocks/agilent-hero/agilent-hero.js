/**
 * Builds a placeholder media box when no real image was authored, so the
 * slide layout still looks correct until an author swaps in a real asset.
 * @returns {HTMLDivElement}
 */
function buildPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'agilent-hero-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="1"></rect><path d="M3 15l5-5 4 4 3-3 6 6"></path><circle cx="8" cy="9" r="1.5"></circle></svg>';
  return placeholder;
}

/**
 * Ensures the slide content has a real heading element for CSS/semantics,
 * even if the author only entered plain paragraphs.
 * @param {Element} content
 */
function ensureHeading(content) {
  if (content.querySelector('h1, h2, h3')) return;
  const first = content.querySelector('p');
  if (!first) return;
  const heading = document.createElement('h2');
  heading.append(...first.childNodes);
  first.replaceWith(heading);
}

function buildSlide(row, index) {
  const li = document.createElement('li');
  li.className = 'agilent-hero-slide';
  li.dataset.slideIndex = index;

  const [imageCell, contentCell] = row.children;

  const media = document.createElement('div');
  media.className = 'agilent-hero-slide-media';
  const img = imageCell?.querySelector('img');
  if (img) {
    media.append(imageCell.querySelector('picture') || img);
  } else {
    media.append(buildPlaceholder());
  }

  const content = document.createElement('div');
  content.className = 'agilent-hero-slide-content';
  if (contentCell) {
    while (contentCell.firstElementChild) content.append(contentCell.firstElementChild);
  }
  ensureHeading(content);

  // paragraph whose only content is a link becomes the CTA button
  const ctaPara = [...content.querySelectorAll('p')].find((p) => {
    const a = p.querySelector('a');
    return a && p.textContent.trim() === a.textContent.trim();
  });
  if (ctaPara) {
    ctaPara.className = 'agilent-hero-slide-actions';
    ctaPara.querySelector('a').classList.add('agilent-hero-button');
  }

  li.append(media, content);
  return li;
}

function goTo(block, index) {
  const slides = [...block.querySelectorAll('.agilent-hero-slide')];
  if (!slides.length) return;
  const next = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('agilent-hero-slide--active', i === next));
  block.querySelectorAll('.agilent-hero-dot').forEach((dot, i) => {
    dot.setAttribute('aria-current', i === next ? 'true' : 'false');
  });
  block.dataset.activeSlide = next;
}

function buildNav(block, count) {
  const nav = document.createElement('div');
  nav.className = 'agilent-hero-nav';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'agilent-hero-arrow agilent-hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>';

  const dots = document.createElement('div');
  dots.className = 'agilent-hero-dots';
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'agilent-hero-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(block, i));
    dots.append(dot);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'agilent-hero-arrow agilent-hero-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>';

  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'agilent-hero-pause';
  pause.setAttribute('aria-label', 'Pause autoplay');
  pause.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

  nav.append(prev, dots, next, pause);
  return {
    nav, prev, next, pause,
  };
}

export default function decorate(block) {
  const rows = [...block.children];
  const slidesList = document.createElement('ul');
  slidesList.className = 'agilent-hero-slides';
  rows.forEach((row, i) => slidesList.append(buildSlide(row, i)));

  const {
    nav, prev, next, pause,
  } = buildNav(block, rows.length);

  block.replaceChildren(slidesList, nav);
  goTo(block, 0);

  if (rows.length < 2) {
    nav.style.display = 'none';
    return;
  }

  let current = 0;
  let playing = true;
  let timer;

  const advance = (step) => {
    current += step;
    goTo(block, current);
  };

  const startAutoplay = () => {
    timer = setInterval(() => {
      if (!document.body.classList.contains('quick-edit')) advance(1);
    }, 6000);
  };
  const stopAutoplay = () => clearInterval(timer);

  prev.addEventListener('click', () => { advance(-1); });
  next.addEventListener('click', () => { advance(1); });
  block.querySelectorAll('.agilent-hero-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => { current = i; });
  });

  pause.addEventListener('click', () => {
    playing = !playing;
    pause.classList.toggle('agilent-hero-pause--paused', !playing);
    pause.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Resume autoplay');
    if (playing) startAutoplay();
    else stopAutoplay();
  });

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) startAutoplay();
  else {
    playing = false;
    pause.classList.add('agilent-hero-pause--paused');
  }
}
