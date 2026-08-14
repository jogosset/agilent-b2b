function buildPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'agilent-promo-cards-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="1"></rect><path d="M3 15l5-5 4 4 3-3 6 6"></path><circle cx="8" cy="9" r="1.5"></circle></svg>';
  return placeholder;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'agilent-promo-cards-card';
    const [mediaCell, contentCell] = row.children;

    if (mediaCell) {
      mediaCell.className = 'agilent-promo-cards-media';
      if (!mediaCell.querySelector('img')) mediaCell.append(buildPlaceholder());
    }

    if (contentCell) {
      contentCell.className = 'agilent-promo-cards-content';
      const linkPara = [...contentCell.querySelectorAll('p')].find((p) => {
        const a = p.querySelector('a');
        return a && p.textContent.trim() === a.textContent.trim();
      });
      if (linkPara) {
        linkPara.classList.add('agilent-promo-cards-actions');
        linkPara.querySelector('a').classList.add('agilent-promo-cards-button');
      }
    }
  });
}
