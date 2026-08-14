function buildPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'agilent-product-carousel-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="1"></rect><path d="M3 15l5-5 4 4 3-3 6 6"></path><circle cx="8" cy="9" r="1.5"></circle></svg>';
  return placeholder;
}

function buildCard(row) {
  const card = document.createElement('li');
  card.className = 'agilent-product-carousel-card';
  const [mediaCell, contentCell] = row.children;

  const media = document.createElement('div');
  media.className = 'agilent-product-carousel-media';
  const img = mediaCell?.querySelector('img');
  media.append(img ? mediaCell.querySelector('picture') || img : buildPlaceholder());

  card.append(media);
  if (contentCell) {
    contentCell.className = 'agilent-product-carousel-content';
    if (!contentCell.querySelector('h1, h2, h3, h4')) {
      const first = contentCell.querySelector('p');
      if (first) {
        const heading = document.createElement('h3');
        heading.append(...first.childNodes);
        first.replaceWith(heading);
      }
    }
    card.append(contentCell);
  }
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('ul');
  track.className = 'agilent-product-carousel-track';
  rows.forEach((row) => track.append(buildCard(row)));

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'agilent-product-carousel-arrow agilent-product-carousel-prev';
  prev.setAttribute('aria-label', 'Scroll left');
  prev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'agilent-product-carousel-arrow agilent-product-carousel-next';
  next.setAttribute('aria-label', 'Scroll right');
  next.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>';

  const scrollByCard = (dir) => {
    const card = track.querySelector('.agilent-product-carousel-card');
    const amount = card ? card.getBoundingClientRect().width + 16 : 280;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));

  const wrap = document.createElement('div');
  wrap.className = 'agilent-product-carousel-wrap';
  wrap.append(prev, track, next);

  block.replaceChildren(wrap);

  if (rows.length < 2) {
    prev.style.display = 'none';
    next.style.display = 'none';
  }
}
