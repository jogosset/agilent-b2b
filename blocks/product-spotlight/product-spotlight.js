function buildSpecs(specsRow) {
  const wrap = document.createElement('div');
  wrap.className = 'product-spotlight-specs';
  if (!specsRow) return wrap;
  [...specsRow.children].forEach((cell) => {
    const label = cell.querySelector('strong')?.textContent.trim() || '';
    const value = cell.textContent.replace(label, '').trim();
    const item = document.createElement('div');
    item.innerHTML = `<div class="k">${label}</div><div class="v">${value}</div>`;
    wrap.append(item);
  });
  return wrap;
}

export default function decorate(block) {
  const [contentRow, specsRow] = [...block.children];

  const content = document.createElement('div');
  content.className = 'product-spotlight-content';
  const cell = contentRow?.firstElementChild;
  if (cell) {
    while (cell.firstElementChild) content.append(cell.firstElementChild);
  }

  // paragraphs whose only content is a link are CTAs (decorateButtons has
  // already turned bold/italic-wrapped ones into .button / .button.primary)
  const actions = document.createElement('div');
  actions.className = 'product-spotlight-actions';
  [...content.querySelectorAll('p')]
    .filter((p) => {
      const a = p.querySelector('a');
      return a && p.textContent.trim() === a.textContent.trim();
    })
    .forEach((p) => actions.append(p));

  // Everything else, in authored order, is [eyebrow, heading, lede...].
  // If the heading wasn't authored as a real heading tag, promote the
  // second plain paragraph so the CSS always has a real heading to style.
  const plainParagraphs = [...content.querySelectorAll('p')];
  let heading = content.querySelector('h1, h2, h3');
  let eyebrow;
  let lede;
  if (heading) {
    eyebrow = heading.previousElementSibling?.tagName === 'P' ? heading.previousElementSibling : null;
    lede = plainParagraphs.find((p) => p !== eyebrow) || null;
  } else if (plainParagraphs.length) {
    [eyebrow] = plainParagraphs;
    const headingPara = plainParagraphs[1];
    if (headingPara) {
      heading = document.createElement('h2');
      heading.append(...headingPara.childNodes);
      headingPara.replaceWith(heading);
    }
    lede = plainParagraphs[2] || null;
  }
  eyebrow?.classList.add('product-spotlight-eyebrow');
  lede?.classList.add('product-spotlight-lede');

  // specs sit between the lede and the CTA row
  content.append(buildSpecs(specsRow), actions);

  const visual = document.createElement('div');
  visual.className = 'product-spotlight-visual';
  visual.setAttribute('aria-hidden', 'true');
  visual.innerHTML = `
    <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1">
      <rect x="3" y="4" width="18" height="16" rx="1"></rect>
      <path d="M3 9h18M8 4v5M3 14h18M8 14v6"></path>
      <circle cx="14" cy="11.5" r="1.4" fill="currentColor" stroke="none"></circle>
      <circle cx="18" cy="11.5" r="1.4" fill="currentColor" stroke="none"></circle>
    </svg>
  `;

  block.replaceChildren(content, visual);
}
