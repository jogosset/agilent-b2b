function buildPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'agilent-news-grid-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="1"></rect><path d="M3 15l5-5 4 4 3-3 6 6"></path><circle cx="8" cy="9" r="1.5"></circle></svg>';
  return placeholder;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'agilent-news-grid-card';
    const [mediaCell, contentCell] = row.children;

    if (mediaCell) {
      mediaCell.className = 'agilent-news-grid-media';
      if (!mediaCell.querySelector('img')) mediaCell.append(buildPlaceholder());
    }

    if (!contentCell) return;
    contentCell.className = 'agilent-news-grid-content';

    const link = contentCell.querySelector('a');
    const raw = contentCell.textContent.trim();
    const [tag, ...rest] = raw.split('|').map((s) => s.trim());
    const headline = rest.join(' | ') || tag;

    contentCell.innerHTML = '';
    const tagEl = document.createElement('span');
    tagEl.className = 'agilent-news-grid-tag';
    tagEl.textContent = tag;

    const headlineEl = document.createElement('p');
    headlineEl.className = 'agilent-news-grid-headline';
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = headline;
      headlineEl.append(a);
    } else {
      headlineEl.textContent = headline;
    }

    contentCell.append(tagEl, headlineEl);
  });
}
